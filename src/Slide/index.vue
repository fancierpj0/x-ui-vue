<template>
    <div :class="slideClass"
         @mouseenter="onMouseenter" @mouseleave="onMouseleave"
         @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div :class="windowClass" ref="window">
            <slot></slot>
        </div>
        <template v-if="arrow!=='none'">
            <span :class="prevArrowClass" @click="onClickPrev">
                <Icon name="left"></Icon>
            </span>
            <span :class="nextArrowClass" @click="onClickNext">
                <Icon name="right"></Icon>
            </span>
        </template>
        <div :class="dotsClass" v-if="dots!=='none'">
            <!-- v-for除了遍历数组还能遍历整数，但需要注意的是此时n是从1开始的 -->
            <span v-for="n in childrenLength" :class="{active:selectedIndex===n-1}" @click="select(n-1)">
                {{n}}
            </span>
        </div>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  import Icon from '../Icon';
  export default {
    name: "Slide"
    ,components:{Icon}
    ,props:{
      selected:{type:String} // 默认或取第一个item的name
      ,autoPlay:{type:Boolean,default:true}
      ,autoPlaySpeed:{type:Number,default:3000}
      ,selfAdaption:{type:Boolean,default:false} // selfAdaption是指容器适应图片原尺寸
      ,dots:{type:String,default:'bottom'} // bottom top left right inside? outside? none
      ,arrow:{type:String,default:'hover'} // hover always none
    }
    ,provide(){
      return {
        selfAdaption:this.selfAdaption
      }
    }
    ,data(){
      return {
       lastSelectedIndex:undefined
        ,timerId:undefined
        ,startTouch:undefined
        ,childrenLength:0 // 不能为计算属性，因为items是个对象，而它地址并不会改变，也就不会重新计算，而第一次时为0
      }
    }
    ,computed:{
      slideClass(){return `${UI_PREFIX}slide`;} //TODO selfAdaption
      ,windowClass(){return `${UI_PREFIX}slide-window`;}
      ,dotsClass(){return `${UI_PREFIX}slide-dots`;}
      ,prevArrowClass(){return `${UI_PREFIX}slide-prevArrow`;}
      ,nextArrowClass(){return `${UI_PREFIX}slide-nextArrow`;}
      ,items(){
        return this.$children.filter(vm => vm.$options.name.toLowerCase() === 'slideitem');
      }
      ,names(){
        return this.items.map(vm => vm.name);
      }
      ,selectedIndex(){
        let cur = this.names.indexOf(this.selected);
        return cur < 0 ? 0 : cur;
      }
    }
    ,mounted() {
      this.childrenLength = this.items.length;
      this.updateChildren();
      this.autoPlay && this.playAutomatically();
    }
    ,updated() {
      this.updateChildren();
    }
    ,methods:{
      select(newIndex){
        if(newIndex === -1) newIndex = this.names.length - 1;
        if(newIndex === this.names.length) newIndex = 0;
        this.lastSelectedIndex = this.selectedIndex;
        this.$emit('update:selected', this.names[newIndex]);
      }
      ,onClickPrev(){
        this.select(this.selectedIndex - 1);
      }
      ,onClickNext(){
        this.select(this.selectedIndex + 1);
      }
      ,getSelected(){
        let first = this.items[0];
        return this.selected||first.name;
      }
      ,updateChildren(){
        let selected = this.getSelected();
        this.items.forEach((vm) => {
          let reverse = this.selectedIndex <= this.lastSelectedIndex;
          if(this.autoPlay&&this.timerId){
            if(this.lastSelectedIndex === this.childrenLength-1&&this.selectedIndex===0){
              /*
                实现自动轮播时是无缝的就靠这个了，本来从最后一张跳到第一张应该revers=true
                因为在timerId存在时才会走这，故手动点击第一张时，仍然会reverse
              */
              reverse = false;
            }
          }
          vm.reverse = reverse;
          this.$nextTick(()=>{ //确保做动画之前 reverse已经生效
            vm.selected = selected;
          })
        });
      }
      ,pause(){
        window.clearTimeout(this.timerId);
        this.timerId = null;
      }
      ,playAutomatically(){
        if(this.timerId) return;
        let run = () => {
          let index = this.names.indexOf(this.getSelected());
          let newIndex = index + 1;
          this.select(newIndex);
          this.timerId = setTimeout(run, this.autoPlaySpeed);
        };
        this.timerId = setTimeout(run,this.autoPlaySpeed)
      }
      //移动端并不会触发↓
      ,onMouseenter(){
        this.autoPlay && this.pause();
      }
      //移动端并不会触发↓
      ,onMouseleave(){
        this.autoPlay && this.playAutomatically();
      }
      ,onTouchStart(e){
        this.autoPlay && this.pause();
        if(e.touches.length>1) return;
        this.startTouch = e.touches[0];
      }
      ,onTouchEnd(e){
        let endTouch = e.changedTouches[0];
        let {clientX: x1, clientY: y1} = this.startTouch;
        let {clientX: x2, clientY: y2} = endTouch;
        let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        let deltaY = Math.abs(y2-y1);
        let rate = distance / deltaY;
        if(rate>2){
            if(x2<x1){
              //手机上是反方向
              this.select(this.selectedIndex + 1);
            }else{
              this.select(this.selectedIndex - 1);
            }
        }
        this.autoPlay&&this.$nextTick(()=>{
          this.playAutomatically();
        })
      }
    }

  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}slide{
        /*display:inline-block;*/
        position:relative;

        &-window{
            overflow:hidden;
            position:relative;
        }


        &-prevArrow,&-nextArrow{
            position:absolute;
            top:0;
            bottom:0;
            display:inline-flex;
            align-items: center;
            svg{
                font-size:2em;
                fill:$color;
                visibility:hidden;
            }
            &:hover{
                svg{
                    visibility:visible;
                }
            }
        }

        &-prevArrow{
            left:0;
        }

        &-nextArrow{
            right:0;
        }

        &-dots{
            position:absolute;
            left:0;
            right:0;
            bottom:0;
            padding:8px 0;
            display:flex;
            justify-content: center;
            align-content: center;
            >span{
                width:20px;
                height: 20px;
                border-radius:50%;
                background:#ddd;
                display:inline-flex;
                justify-content: center;
                align-items: center;
                margin:0 8px;
                font-size:12px;
                &:hover{cursor:pointer;}
                &.active{background:black;color:white;cursor:default;}
            }
        }
    }
</style>
