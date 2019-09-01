<template>
  <div :class="colClass" :style="colStyle">
    <slot></slot>
  </div>
</template>

<script>
import {UI_PREFIX} from "../constant";

//只允许{span:x,offset,y} 这样的对象数据
let validator = value => {
  let keys = Object.keys(value);
  let valid = true;
  keys.forEach(key => {
    if (!["span", "offset"].includes(key)) {
      valid = false;
    }
  });
  return valid;
};

export default {
  name: "Col",
  inject: ["gutter"],
  props: {
    span: {type: [Number, String]},
    offset: {type: [Number, String]},
    phone: { type: Object, validator },
    pad: { type: Object, validator },
    narrowPc: { type: Object, validator },
    pc: { type: Object, validator },
    widePc: { type: Object, validator }
  },
  methods:{
    createClasses(obj,str = ''){ //str: pad- pc- ...
      if(!obj) return [];
      let arr = [];
      if(obj.span||obj.span===0){arr.push(`${UI_PREFIX}col-${str}${obj.span}`)} // col-phone-12
      if(obj.offset||obj.offset===0){arr.push(`${UI_PREFIX}offset-${str}${obj.offset}`)} // offset-phone-3
      return arr;
    }
  },
  computed: {
    colClass() {
      let { span, offset, phone, pad, narrowPc, pc, widePc, createClasses } = this;

      return [
        `${UI_PREFIX}col`,
        ...createClasses({span,offset}),
        ...createClasses(phone,'phone-'),
        ...createClasses(pad,'pad-'),
        ...createClasses(narrowPc,'narrowPc-'),
        ...createClasses(pc,'pc-'),
        ...createClasses(widePc,'widePc-'),
      ];
    },
    colStyle() {
      let { gutter } = this;
      return {
        paddingLeft: gutter / 2 + "px",
        paddingRight: gutter / 2 + "px"
      };
    }
  }
};
</script>

<style lang="scss">
@import '../var';
.#{$ui-prefix}col {
  box-sizing:border-box;

  //flex-shrink:0; // 不妥协，不进行缩放，相较于在row上flex-wrap:wrap会出现横向滚动条
  //flex-grow: 1; // 如果不设置span，或则一个row中的span不满，gutter是有bug的

  //padding: 0 10px; // 采用后默认gutter为20

  & img {
    max-width: 100%;
  }

  // col- 等同于 col-phone-
  $class-prefix: col-;
  @for $n from 0 through $gridColumns {
    &.#{$ui-prefix}#{$class-prefix}#{$n} {
      width: ($n/$gridColumns) * 100%;
    }
  }
  $class-prefix: offset-;
  @for $n from 0 through $gridColumns {
    &.#{$ui-prefix}#{$class-prefix}#{$n} {
      margin-left: ($n/$gridColumns) * 100%;
    }
  }


  @each $k,$v in $bpList {
    @media (min-width:$v) {

      // col-pad-1、col-pad-2 ...col-pad-#{$gridColumns}
      $class-prefix: col-#{$k};
      @for $n from 0 through $gridColumns {
        &.#{$ui-prefix}#{$class-prefix}#{$n} {
          width: ($n/$gridColumns) * 100%;
        }
      }

      // offset-pad-1、offset-pad-2 ...offset-pad-#{$gridColumns}
      $class-prefix: offset-#{$k};
      @for $n from 0 through $gridColumns {
        &.#{$ui-prefix}#{$class-prefix}#{$n} {
          margin-left: ($n/$gridColumns) * 100%;
        }
      }
    }
  }


}
</style>
