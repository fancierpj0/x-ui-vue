<template>
    <div :class="formItemClass">
        <slot></slot>
        {{errors}}
        <template v-if="errorMsg">
            <div :class="errorBoxClass">
                <Icon name="error" :class="errorIconClass"></Icon>
                <span :class="errorMessageClass">{{ errorMsg }}</span>
            </div>
        </template>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  import {isEmpty} from "../util";
  import Icon from '../Icon';

  export default {
    name: "FormItem"
    ,components:{Icon}
    ,inject:['eventBus']
    ,props:{
      field:{
        type:String
        ,required:true
      }
      ,rules:{
        type:[Object,Array] // {input:[{minLength:6,message:'太短'},{maxLength:10,message:'太长'}],blur:[{required:true,message:'必填'}]}；如果是数组，trigger就默认为change
      }
      ,errorsDisplayMode:{
        type:String
        ,default:'first'
        ,validator(value){
          return ['first', 'all'].indexOf(value) !== -1;
        }
      }
    }
    ,data(){
      return {
        errors:{}
      }
    }
    ,provide(){
      return {
        field: this.field
      }
    }
    ,computed:{
      formItemClass(){
        return `${UI_PREFIX}formItem`;
      }
      ,errorBoxClass(){
        return `${this.formItemClass}-errorBox`;
      }
      ,errorIconClass(){
        return `${this.errorBoxClass}-errorIcon`;
      }
      ,errorMessageClass(){
        return `${this.errorBoxClass}-errorMessage`;
      }

      /*
        在displayMode不为null的情况下
        如果有多个error
        在同一个trigger类型下，优先显示 `[]` 中被匹配上的非异步验证(不为validator)的靠左边的那一项 产生的 error
        如果不同trigger类型下都有error，优先显示 `{input:[],blur:[]}` 中key值(trigger)靠前(左)那一大项里的
      */
      ,errorMsg(){
        if(this.errorsDisplayMode==='all'){
          let arr = [];
          Object.keys(this.errors).forEach(k => {
            if (Array.isArray(this.errors[k])) {
              arr = [...arr, ...this.errors[k]];
            }
          });
          return arr.join(',');
        }else{
          if(Array.isArray(this.rules)){
            return this.errors['change'] && this.errors['change'][0];
          }else{
            let k = Object.keys(this.rules);
            for(let i=0;i<k.length;++i){
              const oneKindOfTriggerErrors = this.errors[k[i]];
              if (oneKindOfTriggerErrors && oneKindOfTriggerErrors.length !== 0) {
                return oneKindOfTriggerErrors[0];
              }
            }
          }

          return '';
        }
      }
    }
    ,mounted() {
      if(this.rules) this.listenAndVerifyFormChanges();

      /*
        input时提示出错，这个时候又失去了焦点触发blur/change，又报另一个错
        这种情况要保留input时的错误
        另外如果errorsDisplayMode不为all
        此时就要决定显示哪个错误

        当再次获取焦点时，应该清除blur/change的报错，显示保存的input触发的错误(这也是不能每次有新的error时先清除所有error的原因)
      */
      this.listenToFormItemFocus()
    }
    ,methods:{
      validate(fieldValue,rules,cb){
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
        const errPromiseList = errors.map(err => (err instanceof Promise ? err : Promise.reject(err)).then(() => {return null;}, (err) => {return err})); // 不论成功失败,都返回一个成功的promise,之所以这样做,是因为Promise.all如果失败只会返回第一个失败的结果,而不是我们期待的所有

        if(this.errorsDisplayMode === 'all'){ // emmm... 实际中，这种情况似乎并没有？？
          Promise.all(errPromiseList).then(r=>{ // array,此时 r 是所有errPromiseList的结果 ; 如果errPromiseList为[]，则r为[]
            cb(r.filter(item => item));
          })
        }else{
          Promise.race(errPromiseList).then(r=>{ // string 如果有非validator的error(或则说异步error)，那么一定是非异步error胜出; 如果errPromiseList为[]，则不会走这个then，也就不会调用回调
            cb(r);
          })
        }

      }

      ,listenAndVerifyFormChanges(){
        if(Array.isArray(this.rules)){
          this.ListenAndVerifyFormChangesCausedByKindOfTrigger(this.rules, 'change');
        }else{ // object
          Object.keys(this.rules).forEach(trigger => {
            const rules = this.rules[trigger];
            this.ListenAndVerifyFormChangesCausedByKindOfTrigger(rules, trigger);
          });
        }
      }
      ,ListenAndVerifyFormChangesCausedByKindOfTrigger(rules,trigger){
        if (Array.isArray(rules) && rules.length !== 0) {
          this.eventBus.$on(`formItem:${trigger}`, (value, field) => {
            console.log(`接收到formItem，trigger:${trigger}`);
            if (field === this.field) {
              if(this.errors[trigger]) this.errors[trigger] = []; // eg:之前input有错误，现在input后没有错误，就需要清除。(下面虽然重新赋值了，但所处的回调只有在有error时才会调用)
              this.clearBlurAndChangeErrors(); // 光listenToFormItemFocus是不够的，因为有可能我们Focus的过快，快到之前的blur/change可能存在promise都还没有结果，这样清除时它还正在生成，就清不到，故退而求其次，我们在下一次formItem事件触发时清掉它
              this.validate(value, rules, (errors) => {
                console.log('validate调用了回调，其errors为:',errors);
                errors = Array.isArray(errors) ? errors : [errors];
                (!this.errors[trigger]) ? this.$set(this.errors, trigger, errors) : this.errors[trigger] = errors;
              });
            }
          });
        }
      }
      ,listenToFormItemFocus(){
        this.eventBus.$on('formItem:focus', (value, field) => {
          if (field === this.field) {
            this.clearBlurAndChangeErrors();
          }
        });
      }
      ,clearBlurAndChangeErrors(){
        this.errors['blur'] ? this.errors['blur'] = [] : this.$set(this.errors, 'blur', []);
        this.errors['change'] ? this.errors['change'] = [] : this.$set(this.errors, 'change', []);
      }

    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}formItem{
    &-errorBox{
        display:flex;
        align-items: center;
        justify-content: center;
        &-errorIcon {
            fill: $red;
            margin-right:.5em;
            font-size: 12px;
        }

        &-errorMessage{
            color: $red;
        }
    }
}
</style>
