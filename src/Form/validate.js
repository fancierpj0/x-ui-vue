import {isEmpty} from "../util";

const validate = (fieldValue, rules, cb, returnAllErrors = false) => {
  const errors = [];
  rules.map(rule => {
    if (rule.validator) {
      const promise = rule.validator(fieldValue);
      errors.push(promise);
    }
    if (rule.required && isEmpty(fieldValue)) {
      errors.push(rule.message);
    }
    if (rule.minLength && !isEmpty(fieldValue) && fieldValue.length < rule.minLength) {
      errors.push(rule.message);
    }
    if (rule.maxLength && !isEmpty(fieldValue) && fieldValue.length > rule.maxLength) {
      errors.push(rule.message);
    }
    if (rule.pattern) {
      if (!(rule.pattern.test(value))) {
        errors.push(rule.message);
      }
    }
  });



  /*
    当returnAllErrors为true时
    我们期待最终的返回值是一个[err1,err2,err3...]
    其中的err1、err2、err3...是String

    但当rule匹配rule.validator，产生的err是一个promise
    并且这样的promise可能并不止一个 (So，我们并不能通过在promise.then中将其余的非promise的err加入来实现统一返回)
    So，要想把握住这些个promise完成的时机 统一返回所有err
    我们选择使用Promise.all
    So，我们将非promise的err统一转换成promise (也可以不转换，在all.then()中加入，但这样需要先将这些非promise的err从errors数组中提取出来)
    另外当调用Promise.all方法需要注意一点，Promise.all如果失败只会返回第一个失败的结果,而不是我们期待的所有
    So，我们将所有promise再then一下返回一个成功态的promise (那些个本来是promise的err在状态转换后也一定会因为这个then而返回一个成功态的promise)
  */

  const errPromiseList = errors.map(err => (err instanceof Promise ? err : Promise.reject(err)).then(() => {
    return null;
  }, (err) => {
    return err // 如果return有返回值一定返回一个成功态的promise，除非在这里抛出错误或则这个返回值是一个失败或则即将失败的promise
  }));



  /*
    race接受的如果是一个[]，则不会调用then
    all接受的如果是一个[]，则会返回[]
    调用cb时候传递的参数只可能为 null | 非空数组 | String
  */

  if (returnAllErrors === false) {
    /*
      如果有非validator的error(或则说异步error)，那么一定是非异步error胜出
      如果errPromiseList为[]，则不会走then
    */
    if(errPromiseList.length!==0){
      Promise.race(errPromiseList).then(r => {
        cb(r); // string | null(为null是rule.validator，且没有错误的情况)
      });
    }else{
      cb(null);
    }

  // emmm... 实际中，这种情况↓似乎并没有？？
  }else{
    Promise.all(errPromiseList).then(r => { // array 此时 r 是所有errPromiseList的结果 ; 如果errPromiseList为[]，则r为[]
      r = r.filter(item => item); // 清除没有错误的promise返回的null
      if(r.length!==0){
        cb(r); // 非[]的Array
      }else{
        cb(null);
      }
    });
  }


};

export default validate;
