<template>
    <div :class="tabPaneClass" v-if="active">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "TabPane"
    ,inject:['eventBus']
    ,props:{
      name:{
        type:String|Number
        ,required:true
      }
    }
    ,data(){
      return {
        active:false
      }
    }
    ,computed:{
      tabPaneClass(){
        return [`${UI_PREFIX}tab-pane`,{
          active:this.active
        }]
      }
    }
    ,created() {
      this.eventBus&&this.eventBus.$on('update:selected', (name) => {
        this.active = name === this.name;
      });
    }
  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}tab-pane{
        padding:1em;
        &.active{

        }
    }
</style>
