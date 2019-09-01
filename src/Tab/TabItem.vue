<template>
    <div :class="tabItemClass" ref="tabItem" :data-test="name">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "TabItem"
    ,inject:['eventBus','trigger']
    ,props:{
      disabled:{
        type:Boolean
        ,default:false
      }
      ,name:{
        type:String|Number
        ,required:true
      }
    }
    ,data(){
      return{
        active:false
      }
    }
    ,computed:{
      tabItemClass(){
        return [`${UI_PREFIX}tab-item`,{
          active:this.active
          ,disabled:this.disabled
        }]
      }
    }
    ,mounted() {
      this.updateActiveProps();
      this.addTabItemListener();
    }
    ,methods:{
      handler(){
        if(this.disabled) return;
        this.eventBus&&this.eventBus.$emit('change', this.name, this);
        this.$emit('change', this); //还会向用户发射一个change事件，用户可在对应的tab-item上监听
      }
      ,addTabItemListener(){
        if(this.trigger==='click'){
          this.$refs.tabItem.addEventListener('click', this.handler);
        }else{
          this.$refs.tabItem.addEventListener('mouseover', this.handler);
        }
      }
      ,updateActiveProps(){
        this.eventBus&&this.eventBus.$on('update:selected', (name) => {
          this.active = name === this.name;
        });
      }
    }
  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}tab-item{
        flex-shrink: 0;
        padding:0 1em;
        height:100%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        &:hover{
            color:$blue;
        }
        &.active{
            color:$blue;
            /*font-weight:bold; // 会影响item占据的宽度，从而影响后续元素的站位*/
        }
        &.disabled {
            color: $disabled-text-color;
            cursor:not-allowed;
            svg {
                fill: $disabled-text-color;
            }
        }
    }
</style>
