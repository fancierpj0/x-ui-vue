<template>
  <div :class="popoverClass" ref="popover">

    <div
      ref="contentWrapper"
      :class="popoverContentWrapperClass"
      v-if="visible"
    >
      <slot name="content" :close="close"></slot>
    </div>

    <span ref="triggerWrapper" style="display: inline-block;">
      <slot></slot>
    </span>

  </div>
</template>

<script>
import {UI_PREFIX} from "../constant";

export default {
  name: "Popover"
  ,props: {
    popClassName: {type: String} //用户自定义弹出框类名
    ,position: {type: String, default: "top"
      , validator(value) {return ["top","leftTop","rightTop", "bottom","leftBottom","rightBottom","left","topLeft","bottomLeft", "right","topRight","bottomRight"].indexOf(value) >= 0;}}
    ,trigger: {type: String, default: "click"
      , validator(value) {return ["click", "hover"].indexOf(value) >= 0;}}
    ,container: {type: Element}
  }
  ,data() {
    return {
      visible: false
      ,leaveTimer:null
    };
  }
  ,computed: {
    popoverClass(){return `${UI_PREFIX}popover`;}
    ,popoverContentWrapperClass(){return [`${this.popoverClass}-contentWrapper`,`position-${this.position}`, this.popClassName];}
    ,isHoverStyle(){return this.trigger === 'hover';}
  }
  ,mounted() {
    this.addPopoverListeners();
  }
  ,beforeDestroy() {
    this.putBackContent();
    this.removePopoverListeners();
  }
  ,methods: {
    onClickDocument(e) {
        if (this.$refs.popover && (this.$refs.popover === e.target || this.$refs.popover.contains(e.target))) return;
        if (this.$refs.contentWrapper && (this.$refs.contentWrapper === e.target || this.$refs.contentWrapper.contains(e.target))) return;
        this.close();
    }

    /*
        TODO
        如果 <slot name="content" :close="close"></slot> 是一长串无分割的英文单词
        ，并且我们word-break:break-all了
        ，会导致定位的位置并不是我们所期望的
        ，以为此时我们通过 getBoundingClientRect 获取到的高度是不对(未知bug)
    */
    ,positionContent() {
      const { contentWrapper, triggerWrapper } = this.$refs;
      (this.container || document.body).appendChild(contentWrapper);
      const {width, height, top, left} = triggerWrapper.getBoundingClientRect();
      const {height: height2, width: width2} = contentWrapper.getBoundingClientRect();

      //下面的position[x]，x即是Popover组件接受到的position
      let positions = {
        //top系列 css里我们还会使用translateY进行调整
        leftTop: {
          top: top + window.scrollY
          , left: left + window.scrollX
        }
        ,top: {
          top: top + window.scrollY
          , left: left + window.scrollX + (width - width2) / 2
        }
        ,rightTop: {
          top: top + window.scrollY
          , left: left + window.scrollX + width - width2
        }

        //bottom系列 下面的height是getBounding得到的，是包含padding和border的
        ,leftBottom: {
          top: top + height + window.scrollY
          , left: left + window.scrollX
        }
        ,bottom: {
          top: top + height + window.scrollY
          ,left: left + window.scrollX + (width - width2) / 2
        }
        ,rightBottom:{
          top: top + height + window.scrollY
          , left: left + window.scrollX + width - width2
        }

        //left系列 css里我们还会使用translateX进行调整
        ,topLeft:{
          top: top + window.scrollY
          ,left: left + window.scrollX
        }
        ,left: {
          top: top + window.scrollY + (height - height2) / 2
          ,left: left + window.scrollX
        }
        ,bottomLeft:{
          top: top + window.scrollY + height - height2
          ,left: left + window.scrollX
        }

        //right系列
        ,topRight: {
          top: top + window.scrollY
          ,left: left + window.scrollX + width
        }
        ,right: {
          top: top + window.scrollY + (height - height2) / 2
          ,left: left + window.scrollX + width
        }
        ,bottomRight:{
          top: top + window.scrollY + height - height2
          ,left: left + window.scrollX + width
        }
      };
      contentWrapper.style.left = positions[this.position].left + "px";
      contentWrapper.style.top = positions[this.position].top + "px";
    }
    ,checkLeaveTimer(){
      if(this.leaveTimer){
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
    }
    ,open() {
      // 移除按钮马上又移回↓
      if (this.isHoverStyle) this.checkLeaveTimer();
      this.visible = true;
      this.$emit("open");

      /*
        因为我们是在一个触发的事件里进行监听,并且监听的事件还是相同的(指下面document监听的事件)，So小心冒泡，故这里使用了setTimeout，在冒泡完才执行
        另外 v-if=visible  ref 也需要nextTick
      */
      this.$nextTick(() => {
        this.positionContent();
        document.addEventListener("click", this.onClickDocument); //理论上这个this 是document，但vue貌似帮我们改了
        if(this.isHoverStyle){
          this.$refs.contentWrapper.addEventListener('mouseenter', this.checkLeaveTimer);
          this.$refs.contentWrapper.addEventListener('mouseleave', this.close);
        }
      });
    }
    ,doClose(){
      this.visible = false;
      this.$emit("close");
      document.removeEventListener("click", this.onClickDocument);
      if(this.isHoverStyle){
        this.$refs.contentWrapper.removeEventListener('mouseenter', this.checkLeaveTimer);
        this.$refs.contentWrapper.removeEventListener('mouseleave', this.close);
      }
    }
    ,close() {
      if(this.trigger === 'hover'){
        this.leaveTimer = setTimeout(this.doClose,300)
      }else{
        this.doClose();
      }
    }
    ,onClick(event) {
        if (this.$refs.triggerWrapper.contains(event.target)) {
          if (this.visible === true) {
            this.close();
          } else {
            this.open();
          }
        }
    }
    ,resize(){
      if(this.visible) this.positionContent();
    }
    ,addPopoverListeners() {
      if (!this.isHoverStyle) {
        this.$refs.popover.addEventListener("click", this.onClick);
      } else {
        this.$refs.popover.addEventListener("mouseenter", this.open);
        this.$refs.popover.addEventListener("mouseleave", this.close);
      }
      window.addEventListener('resize', this.resize);
    }
    ,removePopoverListeners() {
      if (this.trigger === "click") {
        this.$refs.popover.removeEventListener("click", this.onClick);
      } else {
        this.$refs.popover.removeEventListener("mouseenter", this.open);
        this.$refs.popover.removeEventListener("mouseleave", this.close);
      }
      window.removeEventListener('resize', this.resize);
    }
    ,putBackContent() {
      const { contentWrapper, popover } = this.$refs;
      if (!contentWrapper) {
        return;
      }
      popover.appendChild(contentWrapper);
    }
  }
};
</script>

<style lang="scss">
@import '../var';
$content-wrapper-border-color:$border-color;
$content-wrapper-border-radius:$border-radius;
$content-wrapper-border-width:1px;
$content-wrapper-offset:10px;
$content-wrapper-triangle-size:14px;
$content-wrapper-triangle-offset:7px;

.#{$ui-prefix}popover {
  display: inline-block;
  vertical-align: middle;
  position: relative;

  &-contentWrapper{
      position: absolute; //在存在滚动条的情况下，比使用fixed好
      border: $content-wrapper-border-width solid $content-wrapper-border-color;
      border-radius: $content-wrapper-border-radius;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5)); // box-shadow的话三角形就没有阴影了
      background: white;
      padding: 0.5em 1em;
      word-break: break-all;

      //为制作三角形做准备
      &::before,
      &::after {
          content: "";
          display: block;
          border: $content-wrapper-triangle-size/2 solid transparent; // 20 x 20 的正方形
          width: 0;
          height: 0;
          position: absolute;
      }

      //top系列
      &.position-top,&.position-leftTop,&.position-rightTop {
          transform: translateY(-100%);
          margin-top: -$content-wrapper-offset;
          &::before,
          &::after {
              left: 50%;
              transform: translateX(-50%);
          }
          &::before {
              border-top-color: $content-wrapper-border-color;
              border-bottom: none; // 这里none是为了不侵入被hover的元素，从而避免因此导致的bug
              top: 100%;
          }
          &::after {
              border-top-color: white;
              border-bottom: none;
              top: calc(100% - #{$content-wrapper-border-width});
          }
      }
      &.position-leftTop{
          &::before,
          &::after {
              right:initial;
              transform:none;
              left: $content-wrapper-triangle-offset;
          }
      }
      &.position-rightTop{
          &::before,
          &::after {
              left:initial;
              transform:none;
              right: $content-wrapper-triangle-offset;
          }
      }

      //bottom系列
      &.position-bottom,&.position-leftBottom,&.position-rightBottom {
          margin-top: $content-wrapper-offset;
          &::before,
          &::after {
              left: 50%;
              transform: translateX(-50%);
          }
          &::before {
              border-top: none;
              border-bottom-color: $content-wrapper-border-color;
              bottom: 100%;
          }
          &::after {
              border-top: none;
              border-bottom-color: white;
              bottom: calc(100% - #{$content-wrapper-border-width});
          }
      }
      &.position-leftBottom{
          &::before,
          &::after {
              right:initial;
              transform:none;
              left: $content-wrapper-triangle-offset;
          }
      }
      &.position-rightBottom{
          &::before,
          &::after {
              left:initial;
              transform:none;
              right: $content-wrapper-triangle-offset;
          }
      }

      //left系列
      &.position-left,&.position-topLeft,&.position-bottomLeft {
          transform: translateX(-100%);
          margin-left: -$content-wrapper-offset;
          &::before,
          &::after {
              transform: translateY(-50%);
              top: 50%;
          }
          &::before {
              border-left-color: $content-wrapper-border-color;
              border-right: none;
              left: 100%;
          }
          &::after {
              border-left-color: white;
              border-right: none;
              left: calc(100% - #{$content-wrapper-border-width});
          }
      }
      &.position-topLeft{
          &::before,
          &::after {
              transform: none;
              top: $content-wrapper-triangle-offset;
          }
      }
      &.position-bottomLeft{
          &::before,
          &::after {
              transform: none;
              top:initial;
              bottom: $content-wrapper-triangle-offset;
          }
      }

      //right系列
      &.position-right,&.position-topRight,&.position-bottomRight {
          margin-left: $content-wrapper-offset;
          &::before,
          &::after {
              transform: translateY(-50%);
              top: 50%;
          }
          &::before {
              border-right-color: $content-wrapper-border-color;
              border-left: none;
              right: 100%;
          }
          &::after {
              border-right-color: white;
              border-left: none;
              right: calc(100% - #{$content-wrapper-border-width});
          }
      }
      &.position-topRight{
          &::before,
          &::after {
              transform: none;
              top: $content-wrapper-triangle-offset;
          }
      }
      &.position-bottomRight{
          &::before,
          &::after {
              transform: none;
              top:initial;
              bottom: $content-wrapper-triangle-offset;
          }
      }
  }
}

</style>
