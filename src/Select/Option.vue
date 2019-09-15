<template>
    <li :class="selectOptionClass" @click="onClick">
        <slot></slot>
    </li>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Option"
    ,props:{
      value:{
        type:String
        ,required:true
      }
    }
    ,computed:{
      selectOptionClass(){
        return `${UI_PREFIX}selectOption`;
      }
    }
    ,methods:{
      onClick(){
        this.$parent.$emit('change', this.value);
        this.$parent.open = false;
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}selectOption{
    list-style: none;
    text-align: left;

    padding:7px 16px;

    &:hover{
        background:#f3f3f3;
    }
}
</style>
