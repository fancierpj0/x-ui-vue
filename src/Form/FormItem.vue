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

      ,errorMsg(){
        if(this.errorsDisplayMode==='all'){
          let arr = [];
          Object.keys(this.errors).forEach(k => {
            if (Array.isArray(this.errors[k])) {
              arr = [...arr, ...this.errors[k]];
            }
          });
          return arr.join(';');
        }else{
          if(Array.isArray(this.rules)){
            return this.errors['change'] && this.errors['change'][0];
          }else{
            let k = Object.keys(this.rules);
            for(let i=0;i<k.length;++i){
              console.log('k:',k);
              if(this.errors[k[i]]&&this.errors[k[i]].length!==0){
                console.log(this.errors[k[i]][0]);
                return this.errors[k[i]][0];
              }
            }
          }

          return '';
        }
      }
    }
    ,mounted() {
      if(this.rules) this.listenAndVerifyFormChanges();

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
        Promise.all(errPromiseList).then(r=>{ // 此时 r 是所有errPromiseList的结果
          cb(r.filter(item => item));
        })
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
            if (field === this.field) {
              this.validate(value, rules, (errors) => {
                console.log('errors',errors);
                if (this.errors['blur'] && trigger !== 'blur') this.errors['blur'] = [];
                if(this.errors['change'] && trigger!=='change') this.errors['change'] = [];
                if(!this.errors[trigger]){
                  this.$set(this.errors, trigger, errors);
                }else{
                  this.errors[trigger] = errors;
                }
              });
            }
          });
        }
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
