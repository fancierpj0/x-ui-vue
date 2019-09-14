<template>
    <!--
        关于tabIndex
        https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/tabIndex
    -->
    <div :class="onOffClass" @mouseup="onMouseup" @mousedown="onMousedown" @click="onClick" tabindex="0">
        <input type="hidden" :value="value">
        <span :class="textClass">{{value?onText:offText}}</span>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "OnOff"
    ,model:{
      prop:'value'
      ,event:'click'
    }
    , props:{
      value:{
        type: Boolean
      }
      ,'on-text':{
        type:String
        ,default:'On'
      }
      ,'off-text':{
        type:String
        ,default:'Off'
      }
      ,loading:{
        type:Boolean
        ,default:false
      }
    }
    ,computed:{
      onOffClass(){
        return [`${UI_PREFIX}onOff`,{checked:this.value,loading:this.loading}];
      }
      ,textClass(){
        return `${UI_PREFIX}onOff-text`;
      }
    }
    , methods:{
      onClick(){
        if(this.loading) return;
        this.$emit('click', !this.value);
      }
      ,onMousedown(){
        this.$el.classList.add('hold');
      }
      ,onMouseup(){
        this.$el.classList.remove('hold');
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
@import '../animation';
$onOff-fontSize:12px;
$onOff-lineHeight:20px;
$onOff-width:44px;
$onOff-borderWidth:1px;
$onOff-borderColor:#ccc;

$onOff-Height:$onOff-lineHeight + $onOff-borderWidth*2;
$onOff-radius:$onOff-Height/2;



$offText-right:7px;
$onText-left:$offText-right;



$innerOnOff-height:$onOff-lineHeight - 2px;
$innerOnOff-width:$innerOnOff-height;
$innerOnOff-borderRadius:$innerOnOff-height;
$innerOnOff-top:($onOff-lineHeight - $innerOnOff-height)/2;
$innerOnOff-left:$innerOnOff-top;
$innerOnOff-left-checked:$onOff-width - $innerOnOff-width - $innerOnOff-left - $onOff-borderWidth*2;
$innerOnOff-bgColor:#fff;
$innerOnOff-holdWidth:$onOff-width - $onOff-borderWidth*2 - $onOff-fontSize - $offText-right +2px;
$innerOnOff-left-checked-hold:$innerOnOff-left-checked - ($innerOnOff-holdWidth - $innerOnOff-width);



$onOffLoading-height:$innerOnOff-height - 4px;
$onOffLoading-width:$onOffLoading-height;
$onOffLoading-size:1px;
$onOffLoading-top:($onOff-lineHeight - $onOffLoading-height)/2;
$onOffLoading-left:$onOffLoading-top;
$onOffLoading-left-checked:$onOffLoading-left + ($innerOnOff-left-checked - $innerOnOff-left);







.#{$ui-prefix}onOff{
    box-sizing:border-box;
    display:inline-block;
    vertical-align: middle;
    position: relative;
    cursor: pointer;
    user-select: none;

    line-height: $onOff-lineHeight;
    height:$onOff-Height;
    border-radius: $onOff-radius;
    border: $onOff-borderWidth solid $onOff-borderColor;

    width: 44px;

    background-color:$onOff-borderColor;
    transition: all .2s ease-in-out;

    font-size:$onOff-fontSize;

    &:focus { // 需tabIndex支持
        box-shadow: 0 0 0 2px fade_out($blue, 0.7);
        outline: none;
    }
    &:focus:hover {
        box-shadow: none;
    }

    &-text{
        position:absolute;
        left:initial;
        right:$offText-right;
    }

    &:after{
        box-sizing:border-box;
        content: "";
        width: $innerOnOff-width;
        height: $innerOnOff-height;
        border-radius:$innerOnOff-borderRadius;
        background-color: $innerOnOff-bgColor;
        position: absolute;
        left: $innerOnOff-left;
        top: $innerOnOff-top;
        cursor: pointer;
        transition: left .2s ease-in-out,width .2s ease-in-out;
    }

    &:before{
        box-sizing:border-box;
        content: "";
        display: none;
        position: absolute;
        z-index: 1;

        width: $onOffLoading-width;
        height: $onOffLoading-height;
        border-radius: 50%;
        background-color: transparent;
        border: $onOffLoading-size solid;
        border-color: transparent transparent transparent $blue;
        @include spin(1s);

        left: $onOffLoading-left;
        top: $onOffLoading-top;
    }

    &.checked {
        background-color:$blue;
        border-color: $blue;

        .#{$ui-prefix}onOff-text{
            right:initial;
            left:$onText-left;
        }

        &:after{
            left:$innerOnOff-left-checked;
        }
        &:before{
            left:$onOffLoading-left-checked;
        }
    }

    &.loading{
        opacity: .4;
        &:before{
            display:block;
        }
    }

    &.hold{
        &:after{
            width:$innerOnOff-holdWidth;
        }
        &.checked:after{
            left:$innerOnOff-left-checked-hold;
        }
    }
}

</style>
