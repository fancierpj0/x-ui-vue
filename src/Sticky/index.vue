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
        ,lastScrollY:0
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
      if(this.isCustomScroll){
        if(this[SCROLL_EVENTBUS]){
          /*
            _offsetTop/Left是滚动窗口距离视口的偏移
            统一在动画执行完成后在执行回调
          */
          this[SCROLL_EVENTBUS].$on('update:scrollY', (scrollY, scrollComponent_offsetLeft, scrollComponent_offsetTop) => { /* 如果fixed但不移动dom的方式，可能需要left*/setTimeout(()=>{this.customScrollHandler(scrollY, scrollComponent_offsetTop)},300/* 这个时间必须要大于对方动画的时间，这里是滚动动画的持续时间，之所以在动画之后调用回调，是因为在动画时我们即使想sticky也没法介入，只能等动画完后再判断是否达到或则超过distance*/);})
          this[SCROLL_EVENTBUS].$on('update:scrollContainerWrapper', ()=>{if(this.sticky){setTimeout(()=>{this.updateStickyStyle();},300/* 这个时间必须要大于对方动画的时间，不然updateStickyStyle获取到的数据可能还在动画中，这里是scrollBar切入切出的时间*/)}});
        }
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
      ,updateStickyStyle(){
        let {height, left, width} = this.$refs.wrapper.getBoundingClientRect(); // 因为可能内部是一张从远程下载的图片，如果一开始就获取，可能图片还没下载好，故我们在可滚动时再获取(一般可滚动时，已经加载完毕)
        this.wrapperHeight = height + 'px';
        this.containerLeft = left + 'px';
        this.containerWidth = width + 'px';
      }
      ,clearStickyStyle(){
        this.wrapperHeight = undefined;
        this.containerLeft = undefined;
        this.containerWidth = undefined;
        this.containerTop = undefined;
        this.sticky = false;
      }
      ,windowScrollHandler() {
        let {top} = this.$refs.wrapper.getBoundingClientRect();
        if (top<this.distance) { // 只要滚动距离超过目标元素距离文档顶部的高度 就说明已经滚过该元素了 当然，有distance的话还要减去distance
          this.updateStickyStyle();
          this.containerTop = this.distance + 'px';
          this.sticky = true;
        } else {
          this.clearStickyStyle();
        }
      }
      ,customScrollHandler(scrollY,scrollComponent_offsetTop){
        const direction = scrollY - this.lastScrollY
          , {wrapper, container} = this.$refs
          , {top} = wrapper.getBoundingClientRect()
          , offsetTop = top - scrollComponent_offsetTop;

        if ( direction > 0 && offsetTop < this.distance && this.sticky !== true ) {
          this.updateStickyStyle();
          this.sticky = true;
          document.body.appendChild(container);
        }

        //可能是向上滚 也可能 是向下滚 都需要更新top
        if (this.sticky === true) {
          this.containerTop = scrollComponent_offsetTop + this.distance + 'px';
        }

        if (direction < 0 && offsetTop >= this.distance && this.sticky === true){
          wrapper.appendChild(container);
          this.clearStickyStyle(); // 为避免影响其它组件元素 先移回 再去掉fixed
        }

        this.lastScrollY = scrollY;
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
