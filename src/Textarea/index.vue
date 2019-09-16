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
      @change="onChange"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    ></textarea>
  </div>
</template>

<script>
import { UI_PREFIX, FORM_EVENTBUS } from "../constant";

export default {
  name: "Textarea",
  inject: {
    [FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null },
    field: { from: "field", default: null }
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: { type: [String, Date] },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    size: {type: String, default: "default",
      validator(value) {return ["large", "small", "default"].indexOf(value) >= 0;}}
  },
  data() {
    return {
      error: false
    };
  },
  computed: {
    textareaWrapperClass() {return `${UI_PREFIX}textareaWrapper`;},
    textareaClass() {return [`${this.textareaWrapperClass}-textarea`, {error: this.error, small: this.size === "small", large: this.size === "large"}];}
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value, e);
      this[FORM_EVENTBUS] &&
        this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "input");
    },
    onChange(e) {
      this.$emit("change", e.target.value, e);
      this[FORM_EVENTBUS] &&
        this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "change");
    },
    onBlur(e) {
      this.$emit("blur", e.target.value, e);
      this[FORM_EVENTBUS] &&
        this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "blur");
    },
    onFocus(e) {
      this.$emit("focus", e.target.value, e);
      this[FORM_EVENTBUS] &&
        this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, "focus");
    }
  }
};
</script>

<style lang="scss">
@import "../var";
@import "../shape";

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
  }
}
</style>
