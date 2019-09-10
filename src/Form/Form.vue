<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
  import Vue from 'vue';
  import validate from "./validate";
  import {isEmpty} from "../util";

  export default {
    name: "Form"
    ,props:{
      formData:{
        type:Object
        ,required:true
      }

      /*
        {
             username: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }]
             ,mail: [ { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }, { type: 'email', message: 'Incorrect email format', trigger: 'blur' } ]
        }
      */
      ,rules:{
        type:Object
      }
    }
    ,data(){
      return {
        eventBus: new Vue()
      }
    }
    ,provide(){
      return {
        eventBus: this.eventBus
      }
    }
    ,mounted() {
      if(this.rules) this.listenAndVerifyFormChanges();
    }
    ,methods:{
      listenAndVerifyFormChanges(){
        this.eventBus.$on('update:formItem', (field,trigger,value) => {
          const rulesOfTheField = this.rules[field];
          if (rulesOfTheField && Array.isArray(rulesOfTheField) && rulesOfTheField.length !== 0) {
            const rules = this.getRulesThoseNeededToBeVerified(rulesOfTheField, trigger);
            // 回调只有在error存在时才会被调用
            if(!isEmpty(rules)) validate(value, rules, this.notifyTheFormItemToModifyErrorMsg.bind(this,field,trigger));
          }
        });
      }
      ,getRulesThoseNeededToBeVerified(rules,trigger){
        const rulesNeededToBeVerified = [];
        rules.forEach(rule => {
          if (rule.trigger === trigger) {
            rulesNeededToBeVerified.push(rule);
          }
        });
        return rulesNeededToBeVerified;
      }
      ,notifyTheFormItemToModifyErrorMsg(field,trigger,error){ // error -> null | String
        const childrenVnodes = this.$slots.default;
        for (let i = 0; i < childrenVnodes.length; ++i) {
          const childInstance = childrenVnodes[i].componentInstance;
          if(field === childInstance.field){
            if(error){
              childInstance.errorMsg = error;
              childInstance.lastTrigger = trigger; // lastTrigger是上次产生了errorMsg的trigger

            }else{
              /* input->input ：要清除 */
              if(trigger === childInstance.lastTrigger){
                childInstance.errorMsg = null;

              /*
                input -> blur/change ：input产生的errMsg不清除
                blur/change -> input ：blur/change产生的errMsg要清除
              */
              }else{
                if(['change','blur'].includes(childInstance.lastTrigger)){
                  childInstance.errorMsg = null;
                }
              }
            }
            break;
          }
        }
      }

    }
  }
</script>

<style lang="scss">

</style>
