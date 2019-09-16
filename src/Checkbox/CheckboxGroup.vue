<template>
    <div :class="checkboxGroupClass">
        <slot></slot>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {UI_PREFIX,CHECKGROUP_EVENTBUS,FORM_EVENTBUS} from "../constant";

  export default {
    name: "CheckboxGroup"
    ,model:{
      prop:'checked'
      ,event:'change'
    }
    ,props:{
      checked:{type:Array}
      ,size:{type:String,default:'default', validator(value) {return ["large","default", "small"].indexOf(value) >= 0;}}
    }
    ,inject:{
      [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
      ,field:{from:'field', default: null}
    }
    ,data(){
      return {
        [CHECKGROUP_EVENTBUS]: new Vue()
      }
    }
    ,computed:{
      checkboxGroupClass(){
        return `${UI_PREFIX}checkboxGroup`;
      }
    }
    ,provide(){
      return {
        [CHECKGROUP_EVENTBUS]: this[CHECKGROUP_EVENTBUS]
        ,name:`RadioGroup_${Date.now()}`
        ,checkboxGroupSize:this.size
      }
    }
    ,mounted() {
      this.listenToRadioChange();
      this[CHECKGROUP_EVENTBUS].$emit('checkbox:initial', this.checked);
    }
    ,methods:{
      listenToRadioChange(){
        this[CHECKGROUP_EVENTBUS].$on('checkbox:change', (value) => {
          const newChecked = JSON.parse(JSON.stringify(this.checked));
          newChecked.includes(value) ?
            newChecked.splice(newChecked.indexOf(value), 1)
            : newChecked.push(value);
          this.$emit('change', newChecked);
          this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
        });
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}checkboxGroup{
    display:inline-block;
    vertical-align: middle;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
</style>
