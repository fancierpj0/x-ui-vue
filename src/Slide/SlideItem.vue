<template>
    <transition :name="transitionName">
        <div :class="slideItemClass" v-if="visible">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "SlideItem"
    ,props:{
      name:{
        type:String
        ,required:true
      }
    }
    ,inject:['selfAdaption']
    ,data(){
      return {
        selected:undefined
        ,reverse:false
      }
    }
    ,computed:{
      visible(){
        return this.selected === this.name;
      }
      ,slideItemClass(){
        return [`${UI_PREFIX}slide-item`,{reverse:this.reverse,selfAdaption:this.selfAdaption}];
      }
      ,transitionName(){
        return `${UI_PREFIX}slide`;
      }
    }
  }
</script>

<style lang="scss">
    @import '../var';

    // 最好用background
    .#{$ui-prefix}slide-item{
        >img{
            vertical-align: bottom;
        }

        &:not(.selfAdaption){ // selfAdaption是指容器适应图片原尺寸
            >img{
                width:100%;
            }
        }
    }

    .#{$ui-prefix}slide-enter-active,.#{$ui-prefix}slide-leave-active{
        transition:all 1s;
    }
    .#{$ui-prefix}slide-leave-active{
        /*
            因为在过度期间 元素原本的位置仍然被占据着(并且为block，独占一行)
            ，故为了让【进来】的那张进行translateX(100%)精确定位
            以便实现从右边滑进来的效果
            ，需要用进来的覆盖出去那张占据的位置
        */
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
    }

    // 默认 - > translateX(-100%)
    .#{$ui-prefix}slide-leave-to { // 元素本身默认是translateX(0)
        transform: translateX(-100%);
    }
    // translateX(100%) - > 默认
    .#{$ui-prefix}slide-enter { //不用担心会执行transition过度，因为从display:none->block是不会触发过度的
        transform: translateX(100%);
    }

    // translateX(-100%) - > 默认
    .#{$ui-prefix}slide-enter.reverse {
        transform: translateX(-100%);
    }
    // 默认 - > translateX(100%)
    .#{$ui-prefix}slide-leave-to.reverse {
        transform: translateX(100%);
    }
</style>
