<template>
    <div :class="toastWrapperClass">
        <div :class="toastClass" ref="toast" data-test="toast">
            <div :class="messageClass" data-test="message">
                <slot></slot>
            </div>
            <div :class="lineClass" ref="line"></div>
            <span :class="closeClass" v-if="closeButton" @click="onClickClose" data-test="closeButton">
                {{closeButton.text}}
            </span>
        </div>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Toast"
    , props: {
      // 默认启用，持续5秒，要更改设置的话要么是false，要么给一个新的number作为持续时间，单位为毫秒
      autoClose: {type: [Boolean,Number], default: 5000,validator(value){return value === false || typeof value === 'number';}}
      , closeButton: {type: Object, default: () => ({text: '关闭', callback: () => {}})}
      , position: {type: String, default: 'top', validator(value) {return ['top', 'bottom', 'middle'].indexOf(value) >= 0;}}
      ,createdByPlugin:{type:Boolean,default:false}
      , autoWidth:{type:Boolean,default:false}
      ,container: {type: Element}
    }
    ,data(){
      return{
        cancel:false
      }
    }
    ,computed:{
      toastWrapperClass(){return [`${UI_PREFIX}toastWrapper position-${this.position}`,{autoWidth: this.autoWidth}];}
      ,toastClass(){return [`${UI_PREFIX}toastWrapper-toast`,{autoWidth: this.autoWidth}];}
      ,messageClass(){return `${UI_PREFIX}toastWrapper-toast-message`;}
      ,lineClass(){return `${UI_PREFIX}toastWrapper-toast-line`;}
      ,closeClass(){return `${UI_PREFIX}toastWrapper-toast-close`;}
    }
    , mounted() {
      this.updateStyles();
      this.execAutoClose();
      !this.createdByPlugin && (this.container || document.body).appendChild(this.$el); // ma...其实plugin里也可以不用append，直接统一在这里append
    }
    , methods: {
      updateStyles() {
        /*
            在我们将toast的height改为min-height时，竖线的height 100%就失效了
            ，并且absolute虽然能解决高度问题，但是位置又存在问题
            ，SO我们需要用js来设置
        */

        //当我们是现在plugin中先$mount()的，生命周期mounted触发，但此时还没有真正插入页面，也就没css，就会报错
        setTimeout(() => {
          this.$refs.line.style.height = `${this.$refs.toast.getBoundingClientRect().height}px`;
        },0);
      }
      ,execAutoClose() {
        if (this.autoClose) setTimeout(() => {this.close();}, this.autoClose);
      },
      close() {
        this.$emit('close');
        this.$el.remove();
        this.$destroy(); //会将绑定的事件取消掉
      }
      , onClickClose() {
        if(this.closeButton&&typeof this.closeButton.callback === 'function') this.closeButton.callback(this);
        this.$nextTick(()=>{
          !this.cancel&&this.close();
        })
      }
    }

  }
</script>

<style lang="scss">
    @import "../var";
    $toast-font-size: $font-size;
    $toast-line-height: $line-height;
    $toast-min-height: 40px;
    $toast-border-radius: $borderRadius;
    $toast-bg: rgba(0, 0, 0, .75);
    $toast-color:#fff;
    $toast-frame-width:16px;
    $animation-duration: 500ms;
    $toast-slide-up:#{$ui-prefix}toast-slide-up;
    $toast-slide-down:#{$ui-prefix}toast-slide-down;
    $toast-fade-in:#{$ui-prefix}toast-fade-in;

    @keyframes #{$toast-slide-up} {
        0% {opacity: 0;transform: translateY(100%);}
        100% {opacity: 1;transform: translateY(0%);}
    }

    @keyframes #{$toast-slide-down} {
        0% {opacity: 0;transform: translateY(-100%);}
        100% {opacity: 1;transform: translateY(0%);}
    }

    @keyframes #{$toast-fade-in}{
        0% {opacity: 0;}
        100% {opacity: 1;}
    }

    .#{$ui-prefix}toastWrapper{
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width:100%;
        &.autoWidth{
            width:auto;
        }

        &.position-top {
            top: 0;
            .#{$ui-prefix}toastWrapper-toast{
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                animation: $toast-slide-down $animation-duration;
            }
        }
        &.position-bottom {
            bottom: 0;
            .#{$ui-prefix}toastWrapper-toast{
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                animation: $toast-slide-up $animation-duration;
            }
        }
        &.position-middle {
            top: 50%;
            transform:translateX(-50%) translateY(-50%);
            .#{$ui-prefix}toastWrapper-toast{
                animation: $toast-fade-in $animation-duration;
            }
        }

        &-toast {
            display: flex;
            align-items: center;

            box-sizing:border-box;
            width:100%;

            font-size: $toast-font-size;
            line-height: $toast-line-height;
            min-height: $toast-min-height;

            border-radius: $toast-border-radius;
            background: $toast-bg;
            box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, .5);
            color: $toast-color;
            padding: 0 $toast-frame-width;

            &-message {
                padding: $toast-frame-width/2 0;
                flex-grow: 1;
                text-align: center;
            }
            &-close {
                cursor:pointer;
                padding-left: $toast-frame-width;
                flex-shrink: 0; // 防止某些情况下的换行
            }
            &-line {
                height: 100%;
                border-left: 1px solid #666;
                margin-left: $toast-frame-width;
            }

            &.autoWidth {
                box-sizing: content-box;
                width: auto;
            }
        }
    }

</style>
