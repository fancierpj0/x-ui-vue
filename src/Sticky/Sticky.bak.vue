<template>
    <!--
        两层设计：
        1.fixed后不会影响原本布局
        2.防止一层设计定位后可能的反复闪烁(定位)问题
    -->
    <div :class="stickyWrapperClass" ref="wrapper" :style="{height:wrapperHeight}">
        <div :class="stickyContainerClass" ref="container" :style="{left:containerLeft,width:containerWidth,top:containerTop}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  import {UI_PREFIX,SCROLL_EVENTBUS} from "../constant";

  export default {
    name: "Sticky"
    ,inject:{
      [SCROLL_EVENTBUS]:{
        from:SCROLL_EVENTBUS
        ,default:null
      }
    }
    ,props:{
      distance:{type:Number,default:0}
      ,isCustomScroll:{type:Boolean, default: false}
    }
    ,data(){
      return {
        sticky:false
        ,containerLeft:undefined
        ,containerWidth:undefined
        ,wrapperHeight:undefined
        ,containerTop:undefined
      }
    }
    ,computed:{
      stickyWrapperClass(){
        return `${UI_PREFIX}stickyWrapper`;
      }
      ,stickyContainerClass(){
        return [`${this.stickyWrapperClass}-container`,{sticky:this.sticky}];
      }
    }
    , mounted() {
      /*setTimeout(()=>{
        this.offsetTop();
      },0);*/
      if(this.isCustomScroll){
        this[SCROLL_EVENTBUS]&&this[SCROLL_EVENTBUS].$on('update:scrollY',(scrollY,scrollComponent_offsetTop)=>{

          this.customScrollHandler(scrollY,scrollComponent_offsetTop)
        })
      }else{
        window.addEventListener('scroll', this.windowScrollHandler);
      }
    }
    ,beforeDestroy() {
      if(!this.isCustomScroll) window.removeEventListener('scroll', this.windowScrollHandler);
    }
    ,methods:{
      //TODO
      checkDistance(){
        // 用户设置的 distance 不能超过 Sticky 距离文档顶部的初始高度
      }
      //↓元素距离滚动文档顶部的高度
      /*
        TODO 不能在mounted时候获取
        ，如果非要在mounted中获取css，特别是通过getBoundingClientRect获取
        ，需要setTimeout(this.$nextTick不管用)
        ，但是还有另外一个问题没有解决
        当我们获取该wrapper的css时，可能它头上还有img没有加载完，这样我们获取到的top其实就是不对的
        So，只能即时获取
      */
      ,offsetTop () {
        let {top} = this.$refs.wrapper.getBoundingClientRect();
        return top + window.scrollY;
      }
      ,setStyleDataBeforeSticky(){
        let {height, left, width} = this.$refs.wrapper.getBoundingClientRect(); // 因为可能内部是一张从远程下载的图片，如果一开始就获取，可能图片还没下载好，故我们在可滚动时再获取(一般可滚动时，已经加载完毕)
        console.log('height:',height);
        this.wrapperHeight = height + 'px';
        this.containerLeft = left + 'px';
        this.containerWidth = width + 'px';
      }
      ,clearStickAndStyleData(){
        this.wrapperHeight = undefined;
        this.containerLeft = undefined;
        this.containerWidth = undefined;
        this.containerTop = undefined;
        this.sticky = false;
      }
      ,windowScrollHandler() {
        let {top} = this.$refs.wrapper.getBoundingClientRect();
        if (top<this.distance) { // 只要滚动距离超过目标元素距离文档顶部的高度 就说明已经滚过该元素了 当然，有distance的话还要减去distance
          this.setStyleDataBeforeSticky();
          this.containerTop = this.distance + 'px';
          this.sticky = true;
        } else {
          this.clearStickAndStyleData();
        }
      }
      ,customScrollHandler(scrollY,x1){
        let {top} = this.$refs.wrapper.getBoundingClientRect();
        if ((x1-top)<this.distance) {
          this.setStyleDataBeforeSticky();
          this.containerTop = x1 + this.distance + 'px';
          // console.log(this.$refs.container);
          document.body.appendChild(this.$refs.container);
          this.sticky = true;
        } else {
          this.clearStickAndStyleData();
        }
      }

    }

  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}stickyWrapper-container{
        &.sticky{
            position:fixed;
        }
    }
</style>
