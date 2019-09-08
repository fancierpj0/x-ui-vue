<template>
    <div :class="tabClass">
        <slot></slot>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Tab"
    , props: {
      selected: {type: String, required: true}
      , direction: {type: String, default: 'horizontal', validator(value) {return ['horizontal', 'vertical'].indexOf(value) >= 0;}}
      ,trigger: {type: String, default: "click"
        , validator(value) {return ["click", "hover"].indexOf(value) >= 0;}}
    }
    , provide() {
      return {
        eventBus: this.eventBus
        ,trigger: this.trigger
      }
    }
    , data() {
      return {
        eventBus: new Vue()
      }
    }
    ,computed:{
      tabClass(){
        return `${UI_PREFIX}tab`;
      }
    }
    , mounted() {
      this.checkChildren();
      this.selectTab();
      this.eventBus.$on('change',(selectedItemName,selectedVm)=>{
        this.$emit('update:selected',selectedItemName, selectedVm)
      })
    }
    ,updated() {
      this.selectTab();
    }
    , methods: {
      consoleChildTypeErrorWarnMsg(){
        console.warn('tab的子组件应该是tab-head或tab-body');
      }
      ,checkSelectedIfWithDisabled(tabHeadItems){
        for(let j=0;j<tabHeadItems.$children.length;++j){
          const tabItem = tabHeadItems.$children[j];
          if (tabItem.$options.name.toLowerCase() === 'tabitem' && tabItem.disabled === true && tabItem.name === this.selected ){
            console.warn(`组件${UI_PREFIX}tab@error:禁用的按钮无法设置为被选中!`);}}
      }
      ,checkChildren() {
        if (this.$children.length === 0) return this.consoleChildTypeErrorWarnMsg();
        for(let i=0;i<this.$children.length;++i){
          const item = this.$children[i];
          const name = item.$options.name.toLowerCase();
          if(['tabhead','tabbody'].indexOf(name)<0) return this.consoleChildTypeErrorWarnMsg();
          if(name === 'tabhead'){this.checkSelectedIfWithDisabled(item);}}
      }
      /*
        找到被选中的那个TabItem
        ,并将它带上然后通知给全组件
      */
      , selectTab() {
        this.$children.forEach((vm) => {
          if (vm.$options.name.toLowerCase() === 'tabhead') {
            vm.$children.forEach((item) => {
              if (item.$options.name.toLowerCase() === 'tabitem' && item.name === this.selected && item.disabled !== true) {
                this.eventBus.$emit('update:selected', this.selected, item);}})}});
      }
    }
  }
</script>

<style lang="scss">

</style>
