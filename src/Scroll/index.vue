<!--
TODO 响应式
TODO 被隐藏时，改变窗口大小，无法getBoundingClientRect
-->
<template>
  <div :class="scrollWrapperClass"
       @mouseenter="onMouseEnter"
       @mouseleave="onMouseLeave"
       @wheel="onWheel">

    <div :class="containerWrapperClass" ref="containerWrapper">
      <div :class="containerClass" ref="scrollContainer"
           :style="{transform: `translateY(${this.contentY}px)`}">
        <slot></slot>
      </div>
    </div>

    <div :class="scrollBarClass" ref="scrollBar" v-show="checkScrollBarVisible"
         @mouseenter="onMouseEnterScrollBar"
         @mouseleave="onMouseLeaveScrollBar"
    >
      <div :class="upButtonClass"
           @mousedown="onMouseDownButton('up')"
           @mouseup="onMouseUpButton"><Icon name="arrow-up"></Icon></div>
      <div :class="draggerContainerClass" ref="draggerContainer"
           @mousedown="onMouseDownRail"
      >
        <div :class="draggerClass" ref="dragger"
             :style="{
             transform:`translateY(${this.draggerY}px)`
             ,height:`${this.draggerHeight}px`}"
             @mousedown="onMouseDownDragger"
             @selectstart="onSelectStartScrollBar">
          <div :class="draggerInnerClass"></div>
        </div>
        <div :class="railClass" ref="draggerRail"></div>
      </div>
      <div :class="downButtonClass"
           @mousedown="onMouseDownButton('down')"
           @mouseup="onMouseUpButton"><Icon name="arrow-down"></Icon></div>
    </div>
    <div :class="fakeScrollBarClass" v-show="!checkScrollBarVisible"
         @mouseenter="onMouseEnterFakeScrollBar"
    ></div>

  </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  import Icon from '../Icon';

  const BUTTON_HEIGHT = 20;

  export default {
    name: "Scroll"
    ,components:{Icon}
    ,props:{
      scrollBarDuration:{
        type:[String,Number]
        ,default:2500
      }
    }
    ,data () {
      return {
        scrollBarVisible: false
        ,mouseIn: false
        ,isScrolling: false

        ,contentY: 0
        ,draggerY: 0

        ,startPosition: undefined
        ,endPosition: undefined

        ,containerHeight:undefined
        ,containerWrapperHeight:undefined

        ,timerId_buttonTrigger:undefined
        ,timerId_autoHiddenScrollBar:undefined
      }
    }
    ,computed: {
      scrollWrapperClass(){return `${UI_PREFIX}scrollWrapper`;}
      ,containerWrapperClass(){
        return [`${this.scrollWrapperClass}-scrollContainerWrapper`,{scrollBarVisible:this.checkScrollBarVisible}];
      }
      ,containerClass(){return `${this.scrollWrapperClass}-scrollContainerWrapper-scrollContainer`;}

      ,scrollBarClass(){return `${this.scrollWrapperClass}-scrollBar`;}
      ,fakeScrollBarClass(){return `${this.scrollWrapperClass}-fakeScrollBar`;}
      ,upButtonClass(){return `${this.scrollBarClass}-upButton`;}
      ,downButtonClass(){return `${this.scrollBarClass}-downButton`;}
      ,draggerContainerClass(){return `${this.scrollBarClass}-draggerContainer`;}
      ,railClass(){return `${this.draggerContainerClass}-draggerRail`;}
      ,draggerClass(){return `${this.draggerContainerClass}-dragger`;}
      ,draggerInnerClass(){return [`${this.draggerClass}-inner`,{isScrolling:this.isScrolling}];}

      , scrollable(){
        // ↓这样的话dragger高度计算不出来 emmm.... ???
        // return this.maxContentY > 0;

        if(this.maxContentY <= 0) return false;
        return true;
      }
      ,checkScrollBarVisible(){
        // return (this.maxContentY>0) && this.scrollBarVisible;
        if (!this.scrollable) return false;
        return this.scrollBarVisible;
      }
      ,draggerHeight () {
        return this.draggerRailHeight * this.containerWrapperHeight / this.containerHeight;
      }
      ,draggerRailHeight(){
        return this.containerWrapperHeight - 2 * BUTTON_HEIGHT;
      }
      ,maxDraggerY(){return this.draggerRailHeight - this.draggerHeight;}
      ,maxContentY(){return this.containerHeight - this.containerWrapperHeight;}
    }

    ,mounted () {
      setTimeout(() => {
        this.init();
      }, 0);
    }

    ,beforeDestroy () {
      // 移除 document 的事件监听
      document.removeEventListener('mousemove', this.onMouseMoveDragger);
      document.removeEventListener('mouseup', this.onMouseUpDragger);
    }

    ,methods: {
      init(){

        //触发增删子节点、图片懒加载等可以改变容器大小的操作时 需要更新这个
        this.containerHeight = this.$refs.scrollContainer.getBoundingClientRect().height;
        //scrollWrapper大小发生改变时
        this.containerWrapperHeight = this.$refs.containerWrapper.getBoundingClientRect().height;

        this.listenToDocument();
        this.listenToWindowResize();
        this.listenToRemoteResources();
        this.listenToDomChange();
      }

      ,updateContentY (contentY) {
        this.contentY = contentY;
        const contentYmaxHeight = this.maxContentY;
        if (contentY > 0) { // 必为负值 0时为初始位置  <0 时 contentWrapper处于containerWrapper上方
          this.contentY = 0
        } else if (contentY < -contentYmaxHeight) {
          this.contentY = -contentYmaxHeight
        }
      }
      ,updateDraggerY (draggerY) {
        this.draggerY = draggerY;
        const maxDraggerY = this.maxDraggerY;
        if (draggerY < 0) {
          this.draggerY = 0;
        } else if (draggerY > maxDraggerY) {
          this.draggerY = maxDraggerY;
        }
      }
      ,onMouseEnter () {
        // console.log(2); // TODO 特殊的，当鼠标在绑定的元素内部时，向右或向左移动，就会触发，导致visible=true
        this.scrollBarVisible = true;
        this.mouseIn = true;
        this.autoHiddenScrollBar();
      }
      ,onMouseLeave () {
        this.mouseIn = false;
        if(this.timerId_autoHiddenScrollBar) clearTimeout(this.timerId_autoHiddenScrollBar); // 清除自动隐藏定时器
        if (!this.isScrolling) { /* 为true时表名正在拖动(拖动允许超出)*/this.scrollBarVisible = false;}
      }



      /*
        拖动
      */
      ,onMouseDownDragger (e) {
        this.isScrolling = true; // 只有在点击dragger以后，move才是有效的
        let {screenX, screenY} = e;
        this.startPosition = {x: screenX, y: screenY};
      }
      ,onSelectStartScrollBar (e) { // 相较于onselect事件的已经选中后触发，该事件是选中之前触发
        e.preventDefault()
      }
      ,listenToDocument () {
        document.addEventListener('mousemove', this.onMouseMoveDragger);
        document.addEventListener('mouseup', this.onMouseUpDragger);
      }
      ,onMouseMoveDragger (e) {
        if (!this.isScrolling) return; // 只有在点击dragger以后，move才是有效的
        this.endPosition = {x: e.screenX, y: e.screenY};
        let delta = {x: this.endPosition.x - this.startPosition.x, y: this.endPosition.y - this.startPosition.y};
        this.updateDraggerY(this.calculateDraggerYFromDeltaY(delta.y));
        this.updateContentY(this.calculateContentYFromDraggerY());
        this.startPosition = this.endPosition;
      }
      ,calculateDraggerYFromDeltaY (deltaY) {
        // return parseInt(this.draggerY) + delta.y; // 这里之所以parseInt 是因为通过wheel滚动触发计算得到draggerY是可能会有小数的，不parseInt也没撒大问题
        return this.draggerY + deltaY;
      }
      ,calculateContentYFromDraggerY(){ // 不用传递draggerY，因为vue里，设置data是及时的，只是updated会合并更新(渲染)
        return -(this.maxContentY * this.draggerY / this.maxDraggerY);
      }
      ,onMouseUpDragger (e) {
        this.isScrolling = false;
        if (!this.mouseIn) {
          this.scrollBarVisible = false;
        }else{
          if(!this.$refs.scrollBar.contains(e.target)) this.autoHiddenScrollBar();
        }
      }



      /*
        滚轮
      */
      ,onWheel (e) {
        if(!this.scrollable) return;
        if(this.timerId_autoHiddenScrollBar) clearTimeout(this.timerId_autoHiddenScrollBar);
        /*
          stopPropagation 并不能阻止根页面的滚动响应
          ，这可能是因为其是在捕获阶段响应的 或则 其它特殊原因
          ，但是preventDefault是可以阻止它的
        */
        e.preventDefault();
        e.stopPropagation(); // 这里主要是防止scroll嵌套时同时响应
        /*
          windows下：
          向下滚动，恒为100
          向上滚动，恒为-100
        */
        // console.log(e.deltaY);
        this.updateContentY(this.calculateContentYFromDeltaY(e.deltaY));
        this.updateDraggerY(this.calculateDraggerYFromContentY());
        this.autoHiddenScrollBar();
      }
      ,calculateContentYFromDeltaY (deltaY) {
        let contentY = this.contentY;
        if (deltaY > 20) { // 向下滚动，contentWrapper 应该向上移动 contentY 不论是translateY 还是 absolute top 数值都应该减小
          contentY -= 20 * 3
        } else if (deltaY < -20) {
          contentY += 20 * 3

        // 上面是对最快滚轮速度导致的滚动速度进行了限制(针对apple),另外windows不论怎样都走上面，因为其deltaY固定+、-100
        } else {
          contentY -= deltaY * 3
        }
        return contentY
      }
      ,calculateDraggerYFromContentY(){
        return (this.draggerRailHeight - this.draggerHeight) * (-this.contentY) / this.maxContentY;
      }



      /*
        点击箭头 和 rail 触发的滚动
      */
      ,onMouseDownButton(direction){
        if(this.timerId_buttonTrigger) clearTimeout(this.timerId_buttonTrigger);
        let step;
        direction === 'down' ? step = 25 : step = -25;
        let go = () => {
          const draggerY = this.draggerY + step;
          this.updateDraggerY(draggerY);
          this.updateContentY(this.calculateContentYFromDraggerY());
          this.timerId_buttonTrigger = setTimeout(go, 310); // 这个时间必须要比transition设置的时间晚一点，动画才会顺畅运行
        };
        go();
      }
      ,onMouseUpButton(){
        if(this.timerId_buttonTrigger) clearTimeout(this.timerId_buttonTrigger);
      }
      ,onMouseDownRail(ev){
        if(this.$refs.dragger.contains(ev.target)) return;
        this.updateDraggerY(ev.clientY - this.$refs.draggerContainer.getBoundingClientRect().top);
        this.updateContentY(this.calculateContentYFromDraggerY());
      }


      /*
        图片加载 或 容器子元素增删或则样式变化 导致大小容器变化
      */
      ,updateNewContainerHAndContainerH(){
        /*
          只更新containerHeight就好
          ，因为draggerHeight计算属性依赖它
          ，并且该属性直接作为了style样式值，故会自动刷新
        */
        this.containerHeight = this.$refs.scrollContainer.getBoundingClientRect().height;
        this.updateDraggerY(this.calculateDraggerYFromContentY());
      }
      ,addLoadListener(tag){
        tag.setAttribute('data-listened', 'yes');
        tag.addEventListener('load', () => {
          this.updateNewContainerHAndContainerH();
        });
      }
      ,listenToRemoteResources () {
        let tags = this.$refs.scrollContainer.querySelectorAll('img, video, audio');
        Array.from(tags).map((tag) => {
          if (tag.hasAttribute('data-listened')) return;
          this.addLoadListener(tag);
        })
      }
      ,listenToDomChange () {
        const targetNode = this.$refs.scrollContainer;
        const config = {attributeFilter: ['class','style'], childList: true, subtree: true};
        const callback = (mutationsList) => { // ←array
          for(let mutation of mutationsList) {
            let type = mutation.type;
            // console.log('mutation:',mutation);
            switch (type) {
              case "childList":
                // console.log("A child node has been added or removed.");
                for(let node of mutation.addedNodes){ // nodeList 可用 of 遍历
                  if (['img', 'video', 'audio'].includes(node.nodeName.toLowerCase())) {
                    this.addLoadListener(node);
                  }
                }
                this.updateNewContainerHAndContainerH();
                break;
              case "attributes":
                if(mutation.target === this.$refs.scrollContainer) return; // 容器自身滚动依赖行内的transform，变化时不需要做处理
                // console.log(`The ${mutation.attributeName} attribute was modified.`);
                this.updateNewContainerHAndContainerH(); // 容器子元素自身属性(css、style)发生改变时 统一更新一下
                break;
              default:
                break;
            }
          }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
      }



      // window窗口大小改变导致容器大小变化
      ,listenToWindowResize(){
        window.addEventListener('resize',() => {
          this.containerWrapperHeight = this.$refs.containerWrapper.getBoundingClientRect().height;
          this.updateNewContainerHAndContainerH();
        });
      }



      /*
        停止滚动后定时自动隐藏
      */
      ,autoHiddenScrollBar(){
        if(!this.mouseIn) return;
        clearTimeout(this.timerId_autoHiddenScrollBar);
        this.timerId_autoHiddenScrollBar = setTimeout(() => {
          if (!this.mouseIn) return;
          this.scrollBarVisible = false;
        }, this.scrollBarDuration);
      }
      ,onMouseEnterFakeScrollBar(){
        if(!this.scrollBarVisible){
          this.scrollBarVisible = true;
        }
      }
      ,onMouseEnterScrollBar(){
        if(this.timerId_autoHiddenScrollBar) clearTimeout(this.timerId_autoHiddenScrollBar);
      }
      ,onMouseLeaveScrollBar(){
        if(!this.isScrolling) this.autoHiddenScrollBar();
      }

    }

  }
</script>

<style scoped lang="scss">
  @import '../var';
  $scrollBarWidth:16px;
  $draggerRailColor:rgba(0,0,0,0.15);
  $draggerColor:rgba(0,0,0,0.75);
  $draggerActiveColor:#000;
  $wheel-transition:transform 0.3s ease-out;

  .#{$ui-prefix}scrollWrapper {
    position: relative;
    height: 100%;

    &-scrollContainerWrapper {
      position: absolute; // emmm 可以考虑无定位 直接height:100%
      overflow: hidden;
      top: 0;bottom: 0;right: 0;left: 0;
      transition: margin-right 0.3s ease-out;
      &.scrollBarVisible {margin-right: 30px;}
      &-scrollContainer {
        min-height:100%;
        overflow: hidden; // 防止子元素margin穿透
        transition: $wheel-transition;
      }
    }

    @mixin scrollBar {
      cursor: pointer;
      position: absolute; top: 0; right: 0; bottom: 0;width: $scrollBarWidth;
    }
    &-fakeScrollBar {
      @include scrollBar;
    }
    &-scrollBar {
      @include scrollBar;

      &-upButton, &-downButton {
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        svg:hover {
          fill: $red;
        }
      }
      &-downButton {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      &-draggerContainer {
        position: absolute;
        top: 0;bottom: 0;right: 0;left: 0;
        margin: 20px 0;
        &-draggerRail {
          width: 2px;
          height: 100%;
          background: $draggerRailColor;
          margin: 0 auto;
        }
        &-dragger {
          transition: $wheel-transition;
          position: absolute;
          width: 100%;

          &-inner {
            height: 100%;
            width: 4px;
            margin: 0 auto;
            border-radius: $scrollBarWidth;
            background: $draggerColor;
            &.isScrolling, &:hover {
              background: $draggerActiveColor;
            }
          }
        }
      }
    }

  }
</style>

