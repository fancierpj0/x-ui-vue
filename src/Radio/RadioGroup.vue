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
      checked:{
        type:[String,Number]
      }
    }
    ,inject:{
      [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
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
      }
    }
    ,mounted() {
      this.listenToRadioChange();
      this[RADIOGROUP_EVENTBUS].$emit('radio:initial', this.checked);
    }
    ,methods:{
      listenToRadioChange(){
        this[RADIOGROUP_EVENTBUS].$on('radio:change', (value) => {
          this.$emit('change', value);
          this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change', value);
        });
      }
    }
  }
</script>

<style lang="scss">

</style>
