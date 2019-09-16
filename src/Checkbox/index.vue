<template>
  <label :class="checkboxWrapperClass">
    <div :class="checkboxContainerClass">
      <input
        :class="realCheckbox"
        type="checkbox"
        :checked="x"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        @change="onChange"
      />
      <div :class="fakeCheckbox"></div>
    </div>
    <slot></slot>
  </label>
</template>

<script>
import { UI_PREFIX, FORM_EVENTBUS, CHECKGROUP_EVENTBUS } from "../constant";

export default {
  name: "Checkbox"
  ,inject: {
    [CHECKGROUP_EVENTBUS]: { from: CHECKGROUP_EVENTBUS, default: null }
    ,[FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null }
    ,name: { from: "name", default: null }
    ,field: { from: "field", default: null }
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
  }
  ,data() {
    return {
      error: false
      ,checkboxGroupChecked: false
    };
  }
  ,computed: {
    checkboxWrapperClass() {
      return [`${UI_PREFIX}checkboxWrapper`, { error: this.error }];
    }
    ,checkboxContainerClass() {
      return [`${UI_PREFIX}checkboxWrapper-checkboxContainer`];
    }
    ,realCheckbox() {
      return `${this.checkboxContainerClass}-realCheckbox`;
    }
    ,fakeCheckbox() {
      return [`${this.checkboxContainerClass}-fakeCheckbox`,{checked:this.x}];
    }
    ,x(){
      if(!this[CHECKGROUP_EVENTBUS]) return this.checked;
      return this.checkboxGroupChecked;
    }
  }
  ,mounted() {
    if(this[CHECKGROUP_EVENTBUS]){
      this.initChecked();
      this.listenToCheckboxChange();
    }
  }
  ,methods: {
    onChange(e) {
      if (this[CHECKGROUP_EVENTBUS]) { // 放置在checkboxGroup中时
        this[CHECKGROUP_EVENTBUS].$emit("checkbox:change", this.value);
      } else { // 单个checkbox时
        this.$emit("change", e.target.checked); // v-model 依赖
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "change");
      }
    }
    ,initChecked(){
      this[CHECKGROUP_EVENTBUS].$on("checkbox:initial", checked => {
        checked.includes(this.value) && (this.checkboxGroupChecked = true);
      });
    }
    ,listenToCheckboxChange(){
      this[CHECKGROUP_EVENTBUS].$on("checkbox:change", checked => {
        if(checked === this.value) this.checkboxGroupChecked = !this.checkboxGroupChecked;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../var";
$checkboxDiameter:14px;
$checkboxBorderWidth:1px;

.#{$ui-prefix}checkboxWrapper {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;

  &:hover &-checkboxContainer-fakeCheckbox:not(.checked){
    border-color:$borderColor-hover;
  }

  &-checkboxContainer {
    position: relative;
    margin-right: 4px;

    &-realCheckbox {
      position: absolute;
      top:0;left:0;right:0;bottom:0;
      opacity: 0;
    }

    &-realCheckbox:focus + &-fakeCheckbox{
      box-shadow: 0 0 0 2px fade_out($blue, 0.7);
    }

    &-fakeCheckbox {
      box-sizing: border-box;
      width: $checkboxDiameter;
      height: $checkboxDiameter;
      position: relative;
      border: $checkboxBorderWidth solid $borderColor;
      border-radius: 2px;
      transition: all .2s ease-in-out;

      &:after {
        box-sizing: border-box;
        content: "";
        display: block;
        position: absolute;
        transition: all .2s ease-in-out;

        width: 4px;
        height: 8px;
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
        transform: rotate(45deg) scale(0);
        top: 1px;
        left: 4px;
      }

      &.checked {
        border-color: $blue;
        background: $blue;

        &:after {
          transform: rotate(45deg) scale(1);
        }
      }
    }
  }

  svg{
    margin:0 2px;
  }

}
</style>
