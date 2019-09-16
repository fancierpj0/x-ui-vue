<template>
    <div :class="selectClass"  v-click-outside="close">
        <div :class="inputContainerClass" @click="onClick" tabindex="0">
            <input type="hidden" :value="value">
            <div :class="fakeInputClass">
                <span ref="inputText">{{this.value||'请选择'}}</span>
                <Icon name="right"></Icon>
            </div>
        </div>
        <transition :name="transitionName">
            <div :class="dropdownListClass" v-show="open">
                <ul>
                    <slot></slot>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
  import {UI_PREFIX,FORM_EVENTBUS,SELECT_EVENTBUS} from "../constant";
  import Icon from '../Icon'
  import ClickOutside from '../directive/click-outside';
  import Vue from 'vue';

  export default {
    name: "Select"
    ,components:{Icon}
    ,directives:{ClickOutside}
    ,model:{prop:'value',event:'change'}
    ,inject: {
      [FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null }
      ,field: { from: "field", default: null }
    }
    ,props:{value:{type:String}
      ,size: {type: String, default: "default",
        validator(value) {return ["large", "small", "default"].indexOf(value) >= 0;}}
    }
    ,data(){
      return {
        open: false
        , error: false
        , [SELECT_EVENTBUS]: new Vue()
      };
    }
    ,provide(){
      return {
        [SELECT_EVENTBUS]: this[SELECT_EVENTBUS]
      };
    }
    ,computed:{
      selectClass(){
        return `${UI_PREFIX}select`;
      }
      ,inputContainerClass(){
        return [`${this.selectClass}-inputContainer`,{error: this.error, small: this.size === "small", large: this.size === "large",open:this.open}];
      }
      ,fakeInputClass(){
        return [`${this.selectClass}-inputContainer-fakeInput`];
      }
      ,dropdownListClass(){
        return `${this.selectClass}-dropdownList`
      }
      ,transitionName(){
        return `${UI_PREFIX}Select-dropdownList`
      }
    }
    ,mounted() {
      this.listenToSelectChange();
    }
    ,methods:{
      onClick(){
        this.open = !this.open;
      }
      ,close(){
        this.open = false;
      }
      ,listenToSelectChange(){
        this[SELECT_EVENTBUS].$on('select:change', (value) => {
          this.$emit('change', value);
          this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
          this.close();
        });
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
@import '../shape';

.#{$ui-prefix}Select-dropdownList-enter-active,.#{$ui-prefix}Select-dropdownList-leave-active{
    transition:all 250ms;
}
.#{$ui-prefix}Select-dropdownList-enter,.#{$ui-prefix}Select-dropdownList-leave-to{
    transform: scaleY(.7);
    opacity: 0;
}

.#{$ui-prefix}select{
    display:inline-block;
    vertical-align: center;
    position:relative;
    user-select:none;

    ul {margin: 0;padding: 0;}

    &-inputContainer{
        @include differentSizeSelect();

        &-fakeInput{
            min-width: 6em;
            text-align: initial;

            span{
                display: block;
                margin-right:14px;
            }

            svg{
                position:absolute;
                top:50%;
                right:6px;
                transform:translateY(-50%) rotate(90deg);
                transition:all .2s linear;
                fill:$color-light;
            }
        }

        &.open{ .#{$ui-prefix}select-inputContainer-fakeInput{ svg{transform:translateY(-50%) rotate(270deg);} } }
        &.large{ .#{$ui-prefix}select-inputContainer-fakeInput{ svg{right: 7px;} } } /* input形状的横向padding都为.5em，而只有large大小时fontSize才会变为14px，其余size都为12px，而这里的right大小等于横向padding */
    }


    &-dropdownList{
        position:absolute;
        z-index:1;
        margin-top:5px;
        min-width:100%;
        white-space: nowrap;

        background: #fff;
        box-shadow: 0 1px 6px fade_out(#000, 0.8);
        border-radius: $borderRadius;
        padding:5px 0;

        font-size:12px;

        transform-origin: top left;
    }

    &-inputContainer.large + &-dropdownList {
        font-size: 14px;
    }
}
</style>
