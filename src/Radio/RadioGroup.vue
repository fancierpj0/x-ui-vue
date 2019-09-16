<template>
    <div :class="radioGroupClass">
        <slot></slot>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {UI_PREFIX,RADIOGROUP_EVENTBUS,FORM_EVENTBUS} from "../constant";

  export default {
    name: "RadioGroup"
    ,model:{
      prop:'checked'
      ,event:'change'
    }
    ,props:{
      checked:{type:[String,Number]/*emmm... 这不能写required，因为我们是通过v-model传递的 它识别不了*/}
      ,size:{type:String,default:'default', validator(value) {return ["large","default", "small"].indexOf(value) >= 0;}}
    }
    ,inject:{
      [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
      ,field:{from:'field', default: null}
    }
    ,data(){
      return {
        [RADIOGROUP_EVENTBUS]: new Vue()
      }
    }
    ,computed:{
      radioGroupClass(){
        return `${UI_PREFIX}radioGroup`;
      }
    }
    ,provide(){
      return {
        [RADIOGROUP_EVENTBUS]: this[RADIOGROUP_EVENTBUS]
        ,name:`RadioGroup_${Date.now()}`
        ,radioGroupSize:this.size
      }
    }
    ,mounted() {
      this.listenToRadioChange();
      this[RADIOGROUP_EVENTBUS].$emit('radio:initial', this.checked);
    }
    ,methods:{
      listenToRadioChange(){
        this[RADIOGROUP_EVENTBUS].$on('radio:change', (value) => {
          this.$emit('change', value); // v-model 依赖
          this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
        });
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}radioGroup{
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}
</style>
