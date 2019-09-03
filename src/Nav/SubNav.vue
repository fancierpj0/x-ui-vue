<template>
  <div :class="subNavClass" v-click-outside="close">
    <span :class="subNavLabelClass" @click="onClick" @mouseenter="mouseenterHandler" @mouseleave="mouseleaveHandler">
      <slot name="title"></slot>
      <span :class="subNavLabelIconClass">
        <Icon name="right"></Icon>
      </span>
    </span>

    <template v-if="vertical">
        <transition :name="transitionName" @enter="enter" @leave="leave" @after-leave="afterLeave" @after-enter="afterEnter">
            <div :class="subNavPopoverClass" v-show="open" >
                <slot></slot>
            </div>
        </transition>
    </template>
    <template v-else>
        <div :class="subNavPopoverClass" v-show="open" @mouseenter="checkLeaveTimer" @mouseleave="mouseleaveHandler">
            <slot></slot>
        </div>
    </template>

  </div>
</template>

<script>
import Icon from "../Icon";
import {UI_PREFIX} from "../constant";
import ClickOutside from '../directive/click-outside';

export default {
  name: "SubNav"
  ,components: { Icon }
  ,directives:{ClickOutside}
  ,inject: ["root", "vertical","openAll"]
  ,props: {
    name: {
      type: String,
      required: true
    }
  }
  ,data() {
    return {
      open: false
      ,leaveTimer:null
    };
  }
  ,created() {
    this.openAll && (this.open = true);
  }
  ,computed: {
    active() {return this.root.namePath.indexOf(this.name) >= 0;}
    ,subNavClass(){return [`${UI_PREFIX}subNav`, {active: this.active, vertical: this.vertical}];}
    ,subNavLabelClass(){return `${UI_PREFIX}subNav-label`;}
    ,subNavLabelIconClass(){return [`${UI_PREFIX}subNav-label-icon`, {open: this.open, vertical: this.vertical}];}
    ,subNavPopoverClass(){return [`${UI_PREFIX}subNav-popover`,{vertical:this.vertical}];}
    ,transitionName(){return `${UI_PREFIX}SubNav`}
  }
  ,methods: {
    //beforeEnter 应该没有对应的transition类名阶段，是在enter-active之前
    enter(el,done){ //应该对应的是 .enter-active 存在的阶段
      el.style.height = 'auto';
      let {height} = el.getBoundingClientRect();

      el.style.height = '0px';
      el.getBoundingClientRect(); //如果两次设置之间没有其它操作，浏览器会进行合并，故这里调用该方法以防止合并
      el.style.height = `${height}px`;

      el.addEventListener('transitionend', () => {
        done();//调用done 就会马上执行 afterEnter
      },{once:true});
    }
    ,afterEnter(el){
      el.style.height = 'auto'; //这里设置为auto，是因为有可能el会自动增高(点击内嵌的subNav时)，so如果还是之前人为的固定height，就无法实现展开
    }
    ,leave(el,done){
      let {height} = el.getBoundingClientRect();
      el.style.height = `${height}px`;
      el.getBoundingClientRect();
      el.style.height = '0px';

      el.addEventListener('transitionend', () => {
        done(); //调用done 就会马上 display:none 并执行afterLeave
      },{once:true});
    }
    ,afterLeave(el){
      // el.style.height = 'auto';
    }
    ,checkChildrenOpen(item){
      if(!item.$children) return;
      item.$children.forEach((i)=>{
        if(i.$options.name.toLowerCase() === 'subnav'){
          i.open = false;
          if(i.$children) this.checkChildrenOpen(i);
        }
      })
    }
    //↓只有纵向导航会调用该api
    ,onClick() {
      if(this.vertical){
        this.open = !this.open;
        this.checkChildrenOpen(this)
      }
    }
    /*
        1.click-outside会调用
        2.mouseleave会调用
        纵向都会跳过
    */
    ,close() {
      if(this.vertical) return;
      this.open = false;
    }
    ,updateNamePath() {
      this.root.namePath.unshift(this.name);
      if (this.$parent.updateNamePath) {
        this.$parent.updateNamePath();
      }
    }
    ,checkLeaveTimer(){
      if(this.leaveTimer){
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
    }
    ,mouseenterHandler(){
      if(this.vertical) return;
      this.checkLeaveTimer();
      this.open = true;
    }
    ,mouseleaveHandler(){
      if(this.vertical) return;
      this.leaveTimer = setTimeout(this.close, 300);
    }
  }
};
</script>

<style lang="scss">
@import "../var";
@import '../shape';

.#{$ui-prefix}subNav {
  position: relative;
  text-align: left;

  //选中时下边的横线装饰
  &:not(.vertical){
      &.active {
          &::after {
              content: "";
              @include bottomLine($color:$blue);
          }
      }
  }

  &-label {
    padding:.5em 1em;
    display: flex;
    align-items: center;

    &:hover{
      color:$blue;
    }

    &-icon {
      display: none; // 一级菜单中非vertical的subNav无需图标
      margin-left:1em;
      transition: transform 0.25s;
      svg {
        font-size:.5em;
        fill: $light-color;
      }
      &.open {
        transform: rotate(180deg);
      }

      &.vertical{
          display: inline-flex;
          transform: rotate(90deg);
          margin-left:auto;
          &.open {
              transform: rotate(270deg)
          }
      }
    }
  }

  &-popover {
    background: #fff;
    box-shadow: 0 0 3px fade_out(black, 0.7);
    border-radius: $border-radius;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    white-space: nowrap;
    /*min-width: 6em;*/
    color: $light-color;

    transition:height 250ms;
    &.vertical {
        position: static;
        border-radius: 0;
        border: none;
        box-shadow: none;
        overflow:hidden;
        margin-left:8px;
    }
  }
}

//二级及以上菜单中的subNav
.#{$ui-prefix}subNav .#{$ui-prefix}subNav {
  &.active {
    &::after {
      display: none;}
  }

  .#{$ui-prefix}subNav-popover { //纵向时这个的absolute为static，并不会影响
    top: 0;
    left: 100%;
    margin-left: 8px;
  }

  .#{$ui-prefix}subNav-label-icon {
      display: inline-flex; //水平菜单要二级菜单中的subNav才开始有icon
   }
}


</style>

