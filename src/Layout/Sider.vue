<template>
    <transition :name="transitionName" @enter="enter" @leave="leave" >
        <div :class="siderClass" v-show="visible" ref="sider">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  export default {
    name: "Sider"
    ,props:{
      visible:{
        type:Boolean
        ,default:true
      }
      ,width:{
        type:String
      }
      ,inCb:{
        type:Function
      }
      ,outCb:{
        type:Function
      }
    }
    ,computed:{
      siderClass(){
        return `${UI_PREFIX}sider`;
      }
      ,transitionName(){
        return `${this.siderClass}-slide`; // xui-sider-slide
      }
    }
    ,mounted() {
      this.$refs.sider.style.width = this.width;
    }
    ,methods:{
      //beforeEnter 应该没有对应的transition类名阶段，是在enter-active之前
      enter(el,done){ //应该对应的是 .enter-active 存在的阶段
        el.style.marginLeft = `-${this.width}`; //display:none->block时，第一次给的样式是不会触发transition的，故这里"多余"的调用了一次
        el.getBoundingClientRect(); //如果两次设置之间没有其它操作，浏览器会进行合并，故这里调用该方法以防止合并
        el.style.marginLeft = '0px';

        el.addEventListener('transitionend', () => {
          // console.log('in:transitionend');
          this.inCb && this.inCb();
          done();//调用done 就会马上执行 afterEnter
        },{once:true});
      }
      ,leave(el,done){
        el.style.marginLeft = `-${this.width}`;

        /*
            调用done 就会马上 display:none 并执行afterLeave
            ,有些组件可能使用了getBoundingClientRect
            ,在display:none时候就获取不到
            ,比如Scroll组件
            ,如果我们display：none掉了
            ,然后改变窗口大小
            ,那么组件里的resize handler里 getBoundingClientRect就会报错
            ,导致组件运行失败
            ,故选择不调用done()
          */
        el.addEventListener('transitionend', () => {
          // console.log('out:transitionend');
          this.outCb && this.outCb();
          // done();
        },{once:true});
      }
    }
  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}sider{
        position:relative;
    }

    .#{$ui-prefix}sider-slide-enter-active,.#{$ui-prefix}sider-slide-leave-active{
        transition:margin-left .5s;
    }
</style>
