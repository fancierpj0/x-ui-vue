<template>
  <label :class="radioWrapperClass">
    <div :class="radioContainerClass">
      <input
        :class="realRadio"
        type="radio"
        :checked="x"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        @change="onChange"
      />
      <div :class="fakeRadio"></div>
    </div>
    <slot></slot>
  </label>
</template>

<script>
import { UI_PREFIX, FORM_EVENTBUS, RADIOGROUP_EVENTBUS } from "../constant";

export default {
  name: "Radio"
  ,inject: {
    [RADIOGROUP_EVENTBUS]: { from: RADIOGROUP_EVENTBUS, default: null }
    ,[FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null }
    ,name: { from: "name", default: null }
    ,field: { from: "field", default: null }
    ,radioGroupSize:{from:"radioGroupSize",default:null}
  }
  ,model: {
    prop: "checked"
    ,event: "change"
  }
  ,props: {
    checked: { type: Boolean }
    ,value: { type: [String, Number] }
    ,disabled: { type: Boolean, default: false }
    ,readonly: { type: Boolean, default: false }
    ,size:{type:String,default:'default', validator(value) {return ["large","default", "small"].indexOf(value) >= 0;}}
  }
  ,data() {
    return {
      error: false
      ,radioGroupChecked: false
    };
  }
  ,computed: {
    radioWrapperClass() {
      return [`${UI_PREFIX}radioWrapper`, {error: this.error, small: (this.radioGroupSize || this.size) === "small", large: (this.radioGroupSize || this.size) === "large"}];
    }
    ,radioContainerClass() {
      return `${UI_PREFIX}radioWrapper-radioContainer`;
    }
    ,realRadio() {
      return `${this.radioContainerClass}-realRadio`;
    }
    ,fakeRadio() {
      return [`${this.radioContainerClass}-fakeRadio`,{checked:this.x}];
    }
    ,x(){
      if(!this[RADIOGROUP_EVENTBUS]) return this.checked;
      return this.radioGroupChecked;
    }
  }
  ,mounted() {
    if(this[RADIOGROUP_EVENTBUS]){
      this.initChecked();
      this.listenToRadioChange();
    }
  }
  ,methods: {
    onChange(e) {
      if (this[RADIOGROUP_EVENTBUS]) { // 放置在radioGroup中时
        this[RADIOGROUP_EVENTBUS].$emit("radio:change", this.value);
      } else { // 单个radio时
        this.$emit("change", e.target.checked);
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "change");
      }
    }
    ,initChecked(){
      this[RADIOGROUP_EVENTBUS].$on("radio:initial", checked => {
        checked === this.value && (this.radioGroupChecked = true);
      });
    }
    ,listenToRadioChange(){
      this[RADIOGROUP_EVENTBUS].$on("radio:change", checked => {
        this.radioGroupChecked = (checked === this.value);
      });
    }
  }
};
</script>

<style lang="scss">
@import "../var";
$radioDiameter:14px;
$radioBorderWidth:1px;
$innerRadioDiameter:8px;
$innerRadioLeft:($radioDiameter - $radioBorderWidth*2 - $innerRadioDiameter)/2;
$innerRadioTop:$innerRadioLeft;

//large
$radioDiameter-large:16px;
$innerRadioDiameter-large:10px;
$innerRadioLeft-large:($radioDiameter-large - $radioBorderWidth*2 - $innerRadioDiameter-large)/2;
$innerRadioTop-large:$innerRadioLeft-large;

//small
$radioDiameter-small:12px;
$innerRadioDiameter-small:6px;
$innerRadioLeft-small:($radioDiameter-small - $radioBorderWidth*2 - $innerRadioDiameter-small)/2;
$innerRadioTop-small:$innerRadioLeft-small;

.#{$ui-prefix}radioWrapper {
  display:inline-block;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;

  font-size:12px;

  &:hover &-radioContainer-fakeRadio:not(.checked){
    border-color:$borderColor-hover;
  }

  &-radioContainer {
    position: relative;
    margin-right: 4px;

    &-realRadio {
      position: absolute;
      top:0;left:0;right:0;bottom:0;
      opacity: 0;
    }

    &-realRadio:focus + &-fakeRadio{
      box-shadow: 0 0 0 2px fade_out($blue, 0.7);
    }

    &-fakeRadio{
      box-sizing:border-box;
      width:$radioDiameter;
      height:$radioDiameter;
      position:relative;
      border:$radioBorderWidth solid $borderColor;
      border-radius:50%;
      transition:all .2s ease-in-out;

      &:after {
        position: absolute;
        display:block;
        content:'';
        width:$innerRadioDiameter;
        height:$innerRadioDiameter;
        left:$innerRadioLeft;
        top:$innerRadioTop;
        border-radius:50%;
        background-color:$blue;
        opacity: 0;
        transition:all .2s ease-in-out;
        transform: scale(0);
      }

      &.checked{
        border-color:$blue;

        &:after{
          opacity: 1;
          transform:scale(1);
        }
      }
    }
  }

  svg{
    font-size:12px;
    margin:0 2px;
  }

  &.large {
    font-size:14px;

    .#{$ui-prefix}radioWrapper-radioContainer-fakeRadio{
      width:$radioDiameter-large;
      height:$radioDiameter-large;
      &:after{
        width:$innerRadioDiameter-large;
        height:$innerRadioDiameter-large;
        left:$innerRadioLeft-large;
        top:$innerRadioTop-large;
      }
    }
  }

  &.small {
    .#{$ui-prefix}radioWrapper-radioContainer-fakeRadio{
      width:$radioDiameter-small;
      height:$radioDiameter-small;
      &:after{
        width:$innerRadioDiameter-small;
        height:$innerRadioDiameter-small;
        left:$innerRadioLeft-small;
        top:$innerRadioTop-small;
      }
    }
  }
}
</style>
