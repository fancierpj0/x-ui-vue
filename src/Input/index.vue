<template>
  <div :class="inputWrapperClass">
    <input
      type="text"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      @change="onChange"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />
  </div>
</template>

<script>
import Icon from "../Icon";
import {UI_PREFIX} from "../constant";

export default {
  name: "Input"
  ,components: {Icon}
  ,inject:{
    eventBus:{from:'eventBus',default:null}
    ,field:{from:'field', default: null}
  }
  ,model:{
    prop:'value'
    ,event:'input'
  }
  ,props: {
    value: {type: [String,Date]}
    ,disabled: {type: Boolean, default: false}
    ,readonly: {type: Boolean, default: false}
    ,error: {type: Boolean, default: false}
  }
  ,computed:{
    inputWrapperClass(){
      return [`${UI_PREFIX}inputWrapper`,{error:this.error}];
    }
  }
  ,methods:{
    onInput(e){
      const value = e.target.value;
      this.$emit('input', value);
      this.eventBus && this.eventBus.$emit(`formItem:input`, value, this.field);
    }
    ,onChange(e){
      const value = e.target.value;
      this.$emit('change', value);
      this.eventBus && this.eventBus.$emit(`formItem:change`, value, this.field);
    }
    ,onBlur(e){
      const value = e.target.value;
      this.$emit('blur', value);
      this.eventBus && this.eventBus.$emit(`formItem:blur`, value, this.field);
    }
    ,onFocus(e){
      const value = e.target.value;
      this.$emit('focus', value);
      this.eventBus && this.eventBus.$emit(`formItem:focus`, value, this.field);
    }
  }
};
</script>

<style lang="scss" >
@import '../var';

$input-font-size:$font-size;
$input-line-height:$line-height;
$input-border:1px solid $border-color;
$input-border-radius:$border-radius;
$errorColor: $red;

.#{$ui-prefix}inputWrapper {
  display: inline-flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 0.5em;
  }
  > input {
    border: $input-border;
    border-radius: $input-border-radius;
    padding: 5px 1em;
    font-size: $input-font-size;
    line-height:$input-line-height; // input的line-height并不会继承父元素的而是normal，这个值和浏览器和字体有关
    color:$color;
    transition:box-shadow .2s ease-in-out,border .2s ease-in-out;
    box-shadow: 0 0 0 2px fade_out($blue, 1);

    &:hover {
      border-color: $blue;
    }

    &:focus {
      border-color:$blue;
      box-shadow: 0 0 0 2px fade_out($blue, 0.7);
      outline: none;
    }

    &[disabled],
    &[readonly] {
      border-color:$disabled-text-color;
      color:$disabled-text-color;
      cursor: not-allowed;
    }
  }

  &.error {
    > input {
      border-color: $errorColor;
      box-shadow: 0 0 0 2px fade_out($red, 1);
      &:hover{
        border-color:$red;
      }
      &:focus{
        border-color:$red;
        box-shadow: 0 0 0 2px fade_out($red, 0.7);
        outline: none;
      }
    }
  }

}
</style>
