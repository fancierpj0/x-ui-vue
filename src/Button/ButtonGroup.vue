<template>
    <div :class="buttonClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "ButtonGroup"
    ,computed:{
      buttonClass(){
        return `${UI_PREFIX}buttonGroup`
      }
    }
    ,mounted() {
      for(let vnode of this.$slots.default){
        if(!vnode.data) return this.childrenErrorMessage();
        const name = vnode.data.class?vnode.data.class.toLocaleString():null;
        if(!name) return this.childrenErrorMessage();
        if( !name.includes(`${UI_PREFIX}button`)) return this.childrenErrorMessage();
      }
    }
    ,methods:{
        childrenErrorMessage(){
          return console.warn(`${UI_PREFIX}button-group 的子元素应该全是 ${UI_PREFIX}button`);
        }
    }
  }
</script>

<style lang="scss">
    @import "../var";
    .#{$ui-prefix}buttonGroup{
        display:inline-block;
        vertical-align:middle;
        > .#{$ui-prefix}button{
            border-radius:0;
            &:not(:first-child){
                margin-left:-$button-border-width;
            }
            &:first-child{
                border-top-left-radius: $button-border-radius;
                border-bottom-left-radius: $button-border-radius;
            }
            &:last-child{
                border-top-right-radius: $button-border-radius;
                border-bottom-right-radius: $button-border-radius;
            }
            &:hover {
                position: relative;
                z-index: 1;
            }
        }
    }
</style>
