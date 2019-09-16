<template>
    <li :class="selectOptionClass" @click="onClick">
        <slot></slot>
    </li>
</template>

<script>
  import {UI_PREFIX,SELECT_EVENTBUS} from "../constant";

  export default {
    name: "Option"
    ,inject: {
      [SELECT_EVENTBUS]: { from: SELECT_EVENTBUS, default: null }
    }
    ,props:{
      value:{type:String,required:true}
    }
    ,computed:{
      selectOptionClass(){return `${UI_PREFIX}selectOption`;}
    }
    ,methods:{
      onClick(){
        this[SELECT_EVENTBUS].$emit('select:change', this.value);
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}selectOption{
    list-style: none;
    text-align: initial;

    padding:7px 16px;

    &:hover{
        background:#f3f3f3;
    }
}
</style>
