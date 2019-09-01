<template>
    <div :class="collapseClass">
        <slot></slot>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Collapse"
    ,props:{
      single:{type:Boolean,default:false}
      ,selected:{type:Array}
    }
    ,data(){
      return {
        eventBus:new Vue()
        ,isLastItemOpen:false
      }
    }
    ,provide(){return {eventBus:this.eventBus}}
    ,computed:{collapseClass(){return [`${UI_PREFIX}collapse`,{isLastItemOpen:this.isLastItemOpen}];}}
    ,mounted() {
      this.eventBus.$emit('update:selected', this.selected);
      if (this.checkIfLastItemOpen(this.selected)) this.isLastItemOpen = true;
      this.addAddListener();
      this.addRemoveListener();
    }
    ,updated() {
      this.eventBus.$emit('update:selected', this.selected);
    }
    ,methods:{
      checkIfLastItemOpen(name){
        if(Array.isArray(name)) {
          return name.includes(this.$children[this.$children.length - 1].name)
        }
        return this.$children[this.$children.length - 1].name === name;
      }
      ,addAddListener(){
        this.eventBus.$on('update:addSelected', (name) => {
          let selectedCopy = JSON.parse(JSON.stringify(this.selected));
          if(this.single){
            selectedCopy = [name]; // 确保是数组
          }else{
            selectedCopy.push(name);
          }
          this.$emit('update:selected', selectedCopy);

          if (this.checkIfLastItemOpen(name)) {
            this.isLastItemOpen = true;
          }else{
            if(this.single) this.isLastItemOpen = false;
          }
        });
      }
      ,addRemoveListener(){
        this.eventBus.$on('update:removeSelected', (name) => {
          let selectedCopy = JSON.parse(JSON.stringify(this.selected));
          selectedCopy.splice(selectedCopy.indexOf(name),1);
          this.$emit('update:selected', selectedCopy);
          if (this.checkIfLastItemOpen(name)) this.isLastItemOpen = false;
        });
      }
    }
  }
</script>

<style lang="scss">
    @import "../var";
    .#{$ui-prefix}collapse{
        border:1px solid $red;
        border-radius:$border-radius;
        &:not(.isLastItemOpen){
            border-bottom:none;
        }
        /*overflow: hidden;*/
    }
</style>
