<template>
  <div :class="inputWrapperClass">
    <input
      type="text"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      @change="$emit('change',$event)"
      @input="$emit('input',$event)"
    />
    <template v-if="error">
      <Icon name="error" :class="errorIconClass"></Icon>
      <span :class="errorMessageClass">{{ error }}</span>
    </template>
  </div>
</template>

<script>
import Icon from "../Icon";
import {UI_PREFIX} from "../constant";

export default {
  name: "Input"
  ,components: {Icon}
  ,props: {
    value: {type: [String,Date]}
    ,disabled: {type: Boolean, default: false}
    ,readonly: {type: Boolean, default: false}
    ,error: {type: String}
  }
  ,computed:{
    inputWrapperClass(){
      return [`${UI_PREFIX}inputWrapper`,{error:this.error}];
    }
    ,errorIconClass(){
      return `${UI_PREFIX}inputWrapper-ErrorIcon`;
    }
    ,errorMessageClass(){
      return `${UI_PREFIX}inputWrapper-ErrorMessage`;
    }
  }
};
</script>

<style lang="scss" >
@import '../var';

$input-font-size:$font-size;
$input-line-height:$line-height;
$input-border-color-hover:$border-color-hover;
$input-box-shadow-color:$box-shadow-color;
$input-border:1px solid $border-color;
$input-border-radius:$border-radius;
$box-shadow-color: rgba(0, 0, 0, 0.5);
$errorColor: #f1453d;


.#{$ui-prefix}inputWrapper {
  display: inline-flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 0.5em;
  }
  > input {
    border: $input-border;
    border-radius: $input-border-radius;
    padding: .5em 1em;
    font-size: $input-font-size;
    line-height:$input-line-height; // input的line-height并不会继承父元素的而是normal，这个值和浏览器和字体有关

    &:hover {
      border-color: $border-color-hover;
    }

    &:focus {
      box-shadow: inset 0 1px 3px $box-shadow-color;
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
    }
  }

  &-ErrorIcon {
    fill: $errorColor;
  }

  &-ErrorMessage{
    color: $errorColor;
  }
}
</style>
