<template>
    <!--
        两层设计：
        1.fixed后不会影响原本布局
        2.防止一层设计定位后可能的反复闪烁(定位)问题
    -->
    <div :class="stickyWrapperClass" ref="wrapper" :style="{height}">
        <div :class="stickyContentClass" :style="{left,width,top}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Sticky"
    ,props:{
      distance:{type:Number,default:0}
    }
    ,data(){
      return {
        sticky:false
        ,left:undefined
        ,width:undefined
        ,height:undefined
        ,top:undefined
      }
    }
    ,computed:{
      stickyWrapperClass(){
        return `${UI_PREFIX}stickyWrapper`;
      }
      ,stickyContentClass(){
        return [`${this.stickyWrapperClass}-content`,{sticky:this.sticky}];
      }
    }
    , mounted() {
      /*setTimeout(()=>{
        this.offsetTop();
      },0);*/
      this.windowScrollHandler = this._windowScrollHandler.bind(this);
      window.addEventListener('scroll', this.windowScrollHandler);
    }
    ,beforeDestroy() {
      window.removeEventListener('scroll',this.windowScrollHandler)
    }
    ,methods:{
      //↓元素距离滚动文档顶部的高度
      //TODO 不能再mounted时候获取，如果非要在mounted中获取css，特别是通过getBoundingClientRect获取，需要setTimeout(this.$nextTick不管用)
      offsetTop () {
        console.log(this.$refs.wrapper);
        console.log(this.$refs.wrapper.getBoundingClientRect());
        let {top} = this.$refs.wrapper.getBoundingClientRect();
        console.log('top:',top);
        console.log('window.scrollY:',window.scrollY);
        console.log('offsetTop', top + window.scrollY);
        return top + window.scrollY;
      }
      ,_windowScrollHandler() {
        if (window.scrollY > this.offsetTop() - this.distance) { // 页面滚动距离超过了 offsetTop减去distance的高度
          let {height, left, width} = this.$refs.wrapper.getBoundingClientRect(); // 因为可能内部是一张从远程下载的图片，如果一开始就获取，可能图片还没下载好，故我们在可滚动时再获取(一般可滚动时，已经加载完毕)
          this.height = height + 'px';
          this.left = left + 'px';
          this.width = width + 'px';
          this.top = this.distance + 'px';
          this.sticky = true;
        } else {
          this.height = undefined;
          this.left = undefined;
          this.width = undefined;
          this.top = undefined;
          this.sticky = false;
        }
      }
    }

  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}stickyWrapper-content{
        &.sticky{
            position:fixed;
        }
    }
</style>
