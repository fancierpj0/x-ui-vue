<!--
TODO 动画
click outside
-->
<template>
    <div :class="selectClass"  v-click-outside="close">
        <div :class="inputContainerClass" @click="onClick" tabindex="0">
            <input type="hidden" :value="value">
            <div :class="fakeInputClass">
                <span ref="inputText">{{this.value||'请选择'}}</span>
                <Icon name="right"></Icon>
            </div>
        </div>
        <div :class="dropdownListClass" v-if="open">
            <ul>
                <slot></slot>
            </ul>
        </div>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";
  import Icon from '../Icon'
  import ClickOutside from '../directive/click-outside';

  export default {
    name: "Select"
    ,components:{Icon}
    ,directives:{ClickOutside}
    ,model:{
      prop:'value'
      ,event:'change'
    }
    ,props:{
      value:{
        type:String
      }
    }
    ,data(){
      return {
        open:false
      }
    }
    ,computed:{
      selectClass(){
        return `${UI_PREFIX}select`;
      }
      ,inputContainerClass(){
        return [`${this.selectClass}-inputContainer`,{open:this.open}];
      }
      ,fakeInputClass(){
        return [`${this.selectClass}-inputContainer-fakeInput`,{open:this.open}];
      }
      ,dropdownListClass(){
        return `${this.selectClass}-dropdownList`
      }
    }
    ,methods:{
      onClick(){
        this.open = !this.open;
      }
      ,close(){
        this.open = false;
      }
    }
  }
</script>

<style lang="scss">
@import '../var';

.#{$ui-prefix}select{
    display:inline-block;
    position:relative;
    vertical-align: center;
    user-select:none;

    ul {margin: 0;padding: 0;}

    &-inputContainer{
        border:1px solid $border-color-light;
        border-radius:4px;
        padding: 5px 1em;
        cursor: pointer;

        box-shadow: 0 0 0 2px fade_out($blue, 1);

        &:hover {
            border-color: $blue;
        }

        &:focus {
            border-color:$blue;
            outline: none;
        }

        &.open:focus{
            box-shadow: 0 0 0 2px fade_out($blue, 0.7);
        }

        &-fakeInput{
            min-width: 5em;

            svg{
                transition:all .2s linear;
                transform:rotate(90deg);
                margin-left:1em;
                fill:$light-color;
                vertical-align: middle;
            }

            &.open svg{
                transform:rotate(270deg);
            }
        }
    }


    &-dropdownList{
        position:absolute;
        margin-top:5px;
        width:100%;

        background: #fff;
        box-shadow: 0 1px 6px fade_out(#000, 0.8);
        border-radius: $border-radius;
        padding:5px 0;
    }
}
</style>
