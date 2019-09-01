<template >
    <div :class="headerClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  export default {
    name: "Header"
    ,computed:{
      headerClass(){
        return `${UI_PREFIX}header`;
      }
    }
  }
</script>

<style lang="scss">
</style>
