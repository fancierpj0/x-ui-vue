<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: "Form"
    ,props:{
      formData:{
        type:Object
        ,required:true
      }
      ,rules:{
        type:Array
      }
    }
    ,data(){
      return {
        eventBus: new Vue()
      }
    }
    ,provide(){
      return {
        eventBus: this.eventBus
      }
    }
  }
</script>

<style lang="scss">

</style>
