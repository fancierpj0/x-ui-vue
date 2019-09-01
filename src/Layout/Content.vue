<template>
    <div :class="contentClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  export default {
    name: "Content"
    ,computed:{
      contentClass(){
        return `${UI_PREFIX}content`;
      }
    }
  }
</script>

<style lang="scss">
    @import "../var";
    .#{$ui-prefix}content{flex-grow:1;}
</style>
