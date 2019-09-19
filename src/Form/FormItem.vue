<template>
    <div :class="formItemClass">
        <label :class="labelClass" v-if="label" :style="{width:labelWidth}"><span>{{label}}</span></label>
        <div :class="contentClass" :style="{marginLeft:labelWidth}">
            <slot></slot>
            <template v-if="errorMsg">
                <div :class="errorBoxClass">
                    <Icon name="error" :class="errorIconClass"></Icon>
                    <span :class="errorMessageClass">{{ errorMsg }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
  import {FORM_EVENTBUS, UI_PREFIX} from "../constant";
  import Icon from '../Icon';
  import {isEmpty} from "../util";
  import Validator from "./Validator";

  export default {
    name: "FormItem"
    ,components:{Icon}
    ,inject: {
      _rules: { from: "rules", default: null }
      ,formData: { from: 'formData', default: null }
      ,[FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null }
    }
    ,props:{
      field:{
        type:String
      }
      ,label:{
        type:String
      }
      ,labelWidth:{
        type:String
      }
    }
    ,data(){
      return {
        errorMsg:null
        ,lastTrigger:null // 上次产生了error的trigger
      }
    }
    ,provide(){
      return {
        field: this.field
      }
    }
    ,watch:{
      errorMsg: function (newV, oldV) {
        this.$children[0].error = newV;
      }
    }
    ,computed:{
      formItemClass(){
        return `${UI_PREFIX}formItem`;
      }
      ,labelClass(){
        return `${this.formItemClass}-label`;
      }
      ,contentClass(){
        return `${this.formItemClass}-content`;
      }
      ,errorBoxClass(){
        return `${this.contentClass}-errorBox`;
      }
      ,errorIconClass(){
        return `${this.errorBoxClass}-errorIcon`;
      }
      ,errorMessageClass(){
        return `${this.errorBoxClass}-errorMessage`;
      }
      ,rules(){
        if(!this._rules) return null;
        return this._rules[this.field];
      }
    }
    ,mounted() {
      if(!isEmpty(this.rules)) this.listenAndVerifyFieldValueChange();
    }
    ,methods:{
      listenAndVerifyFieldValueChange(){
        const validator = new Validator();
        this[FORM_EVENTBUS].$on('update:formItem', (field,trigger) => {
          if(field === this.field){
            const rules = this.getRulesThoseNeededToBeVerified(this.rules, trigger);
            // 回调只有在error存在时才会被调用
            if(!isEmpty(rules)) validator.validate(this.formData[field], rules, this.updateErrorMsg.bind(this,trigger));
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
      ,updateErrorMsg(trigger,error){
        if(error){
          this.errorMsg = error;
          this.lastTrigger = trigger; // lastTrigger是上次产生了errorMsg的trigger

        }else{
          /* input->input ：要清除 */
          if(trigger === this.lastTrigger){
            this.errorMsg = null;

            /*
              input -> blur/change ：input产生的errMsg不清除
              blur/change -> input ：blur/change产生的errMsg要清除
            */
          }else{
            if(['change','blur'].includes(this.lastTrigger)){
              this.errorMsg = null;
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}formItem{
    margin-bottom:24px;
    position:relative;

    &-label{
        box-sizing:border-box;
        align-items: center;
        text-align: right;
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        padding-right:12px;
        span {
            position:absolute;
            top:50%;
            transform: translateY(-50%);
            white-space: nowrap;
            right:12px;

            &:before{
                content: "*";
                display: inline-block;
                margin-right: 4px;
                color: #ed4014;
                vertical-align: -2px;
            }
        }
    }

    &-content{
        text-align: left;
        &-errorBox{
            display:flex;
            align-items: center;
            justify-content: start;
            position:absolute;
            width:100%;
            line-height:24px;
            font-size:12px;

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

}
</style>
