<template>
    <div :class="formItemClass">
        <slot></slot>
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
        type:Array
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
      ,errorBoxClass(){
        return `${this.formItemClass}-errorBox`;
      }
      ,errorIconClass(){
        return `${this.errorBoxClass}-errorIcon`;
      }
      ,errorMessageClass(){
        return `${this.errorBoxClass}-errorMessage`;
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
