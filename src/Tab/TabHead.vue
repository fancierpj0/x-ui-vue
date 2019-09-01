<template>
    <div :class="tabHeadClass">
        <slot></slot>
        <div :class="lineClass" ref="line"></div>
        <div :class="actionsWrapperClass">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
    import {UI_PREFIX} from "../constant";
    export default {
    name: "TabHead"
    ,inject:['eventBus']
    ,computed:{
        tabHeadClass(){return `${UI_PREFIX}tab-head`;}
        ,lineClass(){return `${UI_PREFIX}tab-head-line`;}
        ,actionsWrapperClass(){return `${UI_PREFIX}tab-head-actionsWrapper`;}
    }
    ,mounted() {
      this.eventBus&&this.eventBus.$on('update:selected',(selectedItemName,selectedVm)=>{
        this.updateLinePosition(selectedVm)
      });
    }
    ,methods:{
      updateLinePosition(selectedVm){
        const tabHeadLeft = this.$el.getBoundingClientRect().left;
        const {width,left} = selectedVm.$el.getBoundingClientRect();
        this.$refs.line.style.width = `${width}px`; //使用getBounding的好处就在于，不论box-sizing是border-box还是content-box，这里获取到的宽度都是完整的可视尺寸
        this.$refs.line.style.left = `${left-tabHeadLeft}px`;
      }
    }
  }
</script>

<style lang="scss">
    @import '../var';
    $tab-head-height:40px;
    $tab-head-border-color:$border-color;
    $tab-head-border-width:1px;
    $tab-head-line-thickness:2px;
    .#{$ui-prefix}tab-head{
        height:$tab-head-height;
        border-bottom:$tab-head-border-width solid $border-color;
        display:flex;
        justify-content: flex-start;
        align-items:center;
        position:relative;
        &-line {
            position: absolute;
            bottom: -$tab-head-border-width;
            border-bottom: $tab-head-line-thickness solid $blue;
            transition: all 350ms;
        }
        &-actionsWrapper{
            margin-left:auto;
            display:flex;
            align-items:center;
            justify-content: center;
        }
    }
</style>
