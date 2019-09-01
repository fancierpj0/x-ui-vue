<template>
    <div :class="footerClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  export default {
    name: "Footer"
    ,computed:{
      footerClass(){
        return `${UI_PREFIX}footer`;
      }
    }
  }
</script>

<style lang="scss">

</style>
