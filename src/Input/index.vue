<template>
  <div :class="inputWrapperClass">
    <input :class="inputClass"
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
import {UI_PREFIX,FORM_EVENTBUS} from "../constant";

export default {
  name: "Input"
  ,components: {Icon}
  ,inject:{
    [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
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
    ,size:{type: String, default: 'default'
      , validator(value) {return ["large", "small", "default"].indexOf(value) >= 0;}}
  }
  ,data(){
    return {
      error:false
    }
  }
  ,computed:{
    inputWrapperClass(){
      return `${UI_PREFIX}inputWrapper`;
    }
    ,inputClass(){
      return [`${UI_PREFIX}inputWrapper-input`, {error: this.error, small: this.size === 'small', large: this.size === 'large'}];
    }
  }
  ,methods:{
    onInput(e){
      this.$emit('input', e.target.value, e);
      this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'input');
    }
    ,onChange(e){
      this.$emit('change', e.target.value, e);
      this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
    }
    ,onBlur(e){
      this.$emit('blur', e.target.value, e);
      this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'blur');
    }
    ,onFocus(e){
      this.$emit('focus', e.target.value, e);
      this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'focus');
    }
  }
};
</script>

<style lang="scss" >
@import '../var';
@import '../shape';

.#{$ui-prefix}inputWrapper {
  display:inline-block;
  vertical-align: middle;
  display:inline-flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 0.5em;
  }

  &-input {
    @include differentSizeInput();
  }

}
</style>
