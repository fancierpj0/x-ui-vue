<!--
vue 中 <textarea>{{text}}</textarea> 并不会生效
-->
<template>
    <div :class="textareaWrapperClass">
        <textarea
            :value="value"
            :disabled="disabled"
            :readonly="readonly"
            @change="onChange"
            @input="onInput"
            @blur="onBlur"
            @focus="onFocus"
        ></textarea>
    </div>
</template>

<script>
  import {UI_PREFIX, FORM_EVENTBUS} from "../constant";

  export default {
    name: "Textarea"
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
    }
    ,data(){
      return {
        error:false
      }
    }
    ,computed:{
      textareaWrapperClass(){
        return [`${UI_PREFIX}textareaWrapper`,{error:this.error}];
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

    $input-font-size:$font-size;
    $input-line-height:$line-height;
    $input-border:1px solid $border-color;
    $input-border-radius:$border-radius;
    $errorColor: $red;

    .#{$ui-prefix}textareaWrapper {
        display: inline-flex;
        align-items: center;

        > :not(:last-child) {
            margin-right: 0.5em;
        }
        > textarea {
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
            > textarea {
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
