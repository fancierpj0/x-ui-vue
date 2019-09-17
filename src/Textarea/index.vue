<!--
vue 中 <textarea>{{text}}</textarea> 并不会生效
-->
<template>
  <div :class="textareaWrapperClass">
    <textarea
      :class="textareaClass"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      @change="onChange"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @keyup.enter="onEnter"
      @keydown="onDelete"
    ></textarea>
  </div>
</template>

<script>
import { UI_PREFIX, FORM_EVENTBUS } from "../constant";

export default {
  name: "Textarea"
  , inject: {
    [FORM_EVENTBUS]: {from: FORM_EVENTBUS, default: null},
    field: {from: "field", default: null}
  }
  , model: {
    prop: "value",
    event: "input"
  }
  , props: {
    value: {type: [String, Date]}
    , disabled: {type: Boolean, default: false}
    , readonly: {type: Boolean, default: false}
    , size: {type: String, default: "default",
      validator(value) {return ["large", "small", "default"].indexOf(value) >= 0;}}
    , rows: {type: [String, Number], default: 2}
  }
  , data() {
    return {
      error: false
    };
  }
  , computed: {
    textareaWrapperClass() {return `${UI_PREFIX}textareaWrapper`;}
    ,textareaClass() {return [`${this.textareaWrapperClass}-textarea`, {error: this.error, small: this.size === "small", large: this.size === "large"}];}
  }
  , methods: {
    onInput(e) {
      this.$emit("input", e.target.value, e);
      this[FORM_EVENTBUS] &&
      this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "input");
    }
    , onChange(e) {
      this.$emit("change", e.target.value, e);
      this[FORM_EVENTBUS] &&
      this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "change");
    }
    , onBlur(e) {
      this.$emit("blur", e.target.value, e);
      this[FORM_EVENTBUS] &&
      this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "blur");
    }
    , onFocus(e) {
      this.$emit("focus", e.target.value, e);
      this[FORM_EVENTBUS] &&
      this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "focus");
    }
    , onEnter(e) {
      let addHeight = 22;
      if (this.size === 'small') addHeight = 20;
      const curHeight = getComputedStyle(e.target).minHeight;
      e.target.style.minHeight = `${parseInt(curHeight) + addHeight}px`;
    }
    , onDelete(e) {
      if (e.keyCode === 8 ) {
        // console.log(e.key); // Backspace
        const el = e.target;
        if(el.value.charAt(el.selectionStart - 1) === '\n'){
          let minusHeight = 22;
          if (this.size === 'small') minusHeight = 20;
          const curHeight = parseInt(getComputedStyle(el).minHeight);
          if(curHeight === parseInt(this.rows)*minusHeight) return;
          el.style.minHeight = `${curHeight - minusHeight}px`;
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "../var";
@import "../shape";
@import "../helper";

.#{$ui-prefix}textareaWrapper {
  display:inline-block;
  vertical-align: middle;
  display:inline-flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 0.5em;
  }

  &-textarea {
    @include differentSizeInput();
    resize:vertical;
    max-width: 100%;
    min-height:map_get_deep($input-differentSizeMap,(default lineHeight)) * 2;
    &.small{
      min-height:map_get_deep($input-differentSizeMap,(small lineHeight)) * 2;
    }
    &.large{
      min-height:map_get_deep($input-differentSizeMap,(large lineHeight)) * 2;
    }
  }
}
</style>
