<template>
    <form @submit="onSubmit">
        <slot></slot>
    </form>
</template>

<script>
  import Vue from 'vue';
  import Validator from "./Validator";
  import {isEmpty} from "../util";
  import {FORM_EVENTBUS} from "../constant";

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
        [FORM_EVENTBUS]: new Vue()
      }
    }
    ,provide(){
      return {
        [FORM_EVENTBUS]: this[FORM_EVENTBUS]
        ,rules: this.rules // undefined | Object
        ,formData: this.formData
      }
    }
    ,methods:{
      onSubmit(e){
        e.preventDefault();
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
