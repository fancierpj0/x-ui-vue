<template>
    <div :class="layoutClass">
        <slot></slot>
    </div>
</template>

<script>
import {UI_PREFIX} from "../constant";
export default {
    name: "Layout"
    ,data(){
      return {
        hasSider:false
      }
    }
    ,computed:{
      layoutClass(){
        return this.hasSider ? `${UI_PREFIX}layout hasSider` : `${UI_PREFIX}layout`;
      }
    }
    ,mounted() {
      this.$children.forEach(vm=>{
        if(vm.$options.name.toLowerCase() === 'sider'){
          this.hasSider = true;
        }
      })
    }
  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}layout{
        display:flex;
        flex-direction: column;
        flex-grow:1; // 如果自己是flex-item 那么自增长
        &.hasSider{
            flex-direction: row;
        }
    }
</style>
