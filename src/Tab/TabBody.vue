<template>
    <div :class="tabBodyClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "TabBody"
    ,computed:{
      tabBodyClass(){
        return `${UI_PREFIX}tab-body`;
      }
    }
  }
</script>

<style lang="scss">

</style>
