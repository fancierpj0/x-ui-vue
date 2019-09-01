<template>
    <div :class="rowClass" :style="rowStyle">
        <slot></slot>
    </div>
</template>

<script>
    import {UI_PREFIX} from "../constant";
    export default {
    name: "Row"
    ,props:{
      gutter:{type:[Number,String]}
      ,align:{type:String
        ,validator(value){return ['left', 'right', 'center'].includes(value);}}
    }
    ,computed:{
      /*
        Row是没有固定宽度的
        ，此时margin负值表现为增大可视尺寸
        ，而子项的百分比width是按照这个增大后的可视尺寸来计算的(需要子项border-box)
        ，故左右两头的子项多余的左padding(最左头那个子项的)和右padding(最右头那个子项的)
        刚好在Row通过margin负值增大的可视尺寸区域部位
        ，而这部分区域是不具备空间占据特性的，并不会影响布局
        ，这样就完美实现了两端对齐
      */
      rowStyle(){
        let {gutter} = this;
        return {marginLeft: -gutter / 2 + 'px', marginRight: -gutter / 2 + 'px'};
      }
      ,rowClass(){
        let {align} = this;
        return [`${UI_PREFIX}row`,align && `align-${align}`];
      }
    }
    ,provide(){
        return {
          gutter:this.gutter
        }
    }
  }
</script>

<style lang="scss">
    @import '../var';
    .#{$ui-prefix}row{
        display:flex;

        flex-wrap:wrap; // flex默认是不换行 nowrap

        //margin: 0 -10px; // 采用后默认gutter为20

        &.align-left {
            justify-content: flex-start;
        }
        &.align-right{
            justify-content:flex-end;
        }
        &.align-center {
            justify-content: center;
        }
    }
</style>
