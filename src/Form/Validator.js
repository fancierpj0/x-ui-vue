/*
TODO 当验证singleField 且 returnAllErrors为false时 若有多个异步验证有错 应该取最先返回的那个
这里选择的是promise.all获取到的有效(有error)中的[0]个，而它并不一定是最先返回的
但这样也有好处，这样在[{rule1},{rule2}]中排在前面的那个若有错就会优先显示它，这样也便于用户自己抉择，但实际上这并不是最佳的用户体验
*/
import {isEmpty} from "../util";

class Validator {
  constructor(){
    this.latestAsyncValidateList = null;
  }

  static addRule(name,fn){
    if (typeof fn !== 'function') return console.error(`the second parameter of 'Validator.addRule' must be a function!`);
    !Validator.extraRules && (Validator.extraRules = {});
    Validator.extraRules[name] = fn; // 返回Boolean
  }

  validate(formData, _rules, cb, returnAllErrors = false) { // 调用cb时候传递的参数只可能为 null | 非空数组(returnAllErrors为true时) | String(returnAllErrors为false时)

    if (this.latestAsyncValidateList && !this.latestAsyncValidateList.expired) { // 最近正在执行的异步验证
      /*
        ↓采用这种模式(姑且称之为expired模式)主要是考虑到

        如果一个规则还在进行异步验证
        但新的验证已经触发
        应该取消掉那个异步验证
      */
      this.latestAsyncValidateList.expired = true;
    }

    let rules = []
      , isMultifield = false;

    if(Object.prototype.toString.call(formData)!=='[object Object]'){ // 单个字段进行验证，可能是String、Date、Array，Array时是checkbox的值
      rules = _rules;
    }else{ // 多个字段或者说整个表单进行验证
      Object.keys(_rules).forEach(fieldName => {
        rules.push(..._rules[fieldName].map(rule => (rule.key = fieldName, rule)));
        isMultifield = true;
        returnAllErrors = true;
      });
    }

    const errors = [];
    let hasAsync = false
      , fieldValue = formData;

    for (let i = 0; i < rules.length; ++i) {
      const rule = rules[i];
      if(isMultifield) fieldValue = formData[rule.key];

      if (rule.validator) {
        /*
          如果想要进行异步验证，直接instance.validate(,[{validator:fn,trigger:String}],)
          ，validator函数必须返回一个promise
          ，如果不是promise而是 String(有错误)|Null(没错误) 则为同步验证
        */
        const r = rule.validator(fieldValue);
        if (!(r instanceof Promise)) { // String | Null
          if (r !== null) { // 有error
            if (!returnAllErrors) return cb(r);
            errors.push(isMultifield ? [rule.key, r] : r); // x 代表 可能是字符串也可能是promise
          }
        }else{ // promise
          errors.push(isMultifield ? [rule.key, r] : r); // 即使returnAllErrors为false也需要存放在errors数组中，因为可能这一组rules里有多个promise，我们暂时并不能知道他们谁先返回，谁有error
          hasAsync = true;
        }
        continue;
      }

      if(rule.required){
        if(isEmpty(fieldValue)){
          if (!returnAllErrors) return cb(rule.message);
          errors.push(isMultifield ? [rule.key, rule.message] : rule.message);
        }
        else if (Array.isArray(fieldValue) && typeof fieldValue[0] === 'object' && fieldValue[0].size) { // 上传
          let someOneIsUploading = false;
          for(let i=0;i<fieldValue.length;++i) {
            if (fieldValue[i].status !== 'success') {
              someOneIsUploading = true;
            }
          }
          if(someOneIsUploading){
            if (!returnAllErrors) return cb(rule.message);
            errors.push(isMultifield ? [rule.key, '文件还在上传中!'] : '文件还在上传中!');
          }
        }
      }

      if (rule.minLength && !isEmpty(fieldValue) && fieldValue.length < rule.minLength ||
        rule.maxLength && !isEmpty(fieldValue) && fieldValue.length > rule.maxLength ||
        rule.pattern && !(rule.pattern.test(fieldValue))) {
        if (!returnAllErrors) return cb(rule.message);
        errors.push(isMultifield ? [rule.key, rule.message] : rule.message);
        continue;
      }

      if(Validator.extraRules){
        const key = Object.keys(rule).filter(item => {return !(item === 'trigger') && !(item === 'message')});
        if (Validator.extraRules[key] && !Validator.extraRules[key](fieldValue, rule[key])) {
          if (!returnAllErrors) return cb(rule.message);
          errors.push(isMultifield ? [rule.key, rule.message] : rule.message);
        }
      }
    }

    if (errors.length === 0) {
      return cb(null);
    }

    if (!hasAsync) { // isMultifield 且 无异步验证
      return cb(errors);
    }



    /*
      all方法需要注意一点，Promise.all如果失败只会返回第一个失败的结果,而不是我们all([...])里所有promise的结果
      race需要注意的是它总是返回第一个完成的promise，不论解决还是拒绝，这也是为什么不能再singleField验证中使用它的原因(singleField验证中我们是期望得到第一个失败的promise)
      如果then中return有返回值一定返回一个成功态的promise，除非在这里抛出错误或则这个返回值是一个失败或则即将失败的promise

      returnAllErrors
      →true:
          errors:array<Promise,String> -> all
      →false:
          errors:array<Promise> -> race(×) 不能用race 还是只能用all

      综上，我们选择all方法
      ，另外为了能确实拿到所有的错误
      ，需要将errors处理成一定会返回成功态promise的errPromiseList (通过then return)
      ，之所以要这么处理是因为:Promise.all如果失败只会返回第一个失败的结果
    */

    const errPromiseList = !isMultifield ?
      errors.map(err => {
        const promise = (err instanceof Promise ? err : Promise.reject(err));
        return promise.then(() => {return null;}, (err) => {return err;});
      })
      :errors.map(([key,x]) => {
        const promise = (x instanceof Promise ? x : Promise.reject(x));
        return promise.then(() => {return [key, null];}, (err) => {return [key, err];});
      });

    this.latestAsyncValidateList = errPromiseList;

    Promise.all(errPromiseList).then(r => { // array 此时 r 是所有errPromiseList的结果
      if (!errPromiseList.expired) {
        r = r.filter(item => !isMultifield ? item : item[1]); // 清除没有错误的promise返回的null
        if (r.length !== 0) {
          /*
            如果有多个异步验证出错 且 returnAllErrors = false
            ，会返回[{validator:fn1},{validator:fn2}] 靠前的的那个验证的错误
          */
          if(!isMultifield){
            returnAllErrors ? cb(r) : cb(r[0]);
          }else{
            const result = {};
            r.map(([key, value]) => {
              result[key] = result[key] || [];
              result[key].push(value);
            });
            cb(result);
          }
        } else {
          cb(null);
        }
      }
    });

  }

}

Validator.extraRules = null;

export default Validator;
