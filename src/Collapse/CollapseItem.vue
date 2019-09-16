<template>
    <div :class="collapseItemClass">
        <div :class="titleClass" @click="toggle">
            {{title}}
        </div>
        <div :class="contentClass" v-if="open">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {UI_PREFIX} from "../constant";

    export default {
    name: "CollapseItem"
    , props: {
      title: {type: String, required: true}
      , name: {type: String}
    }
    , inject: ['eventBus']
    , data() {return {open: false}}
    ,computed:{
        collapseItemClass(){return `${UI_PREFIX}collapseItem`}
        ,titleClass(){return `${UI_PREFIX}collapseItem-title`}
        ,contentClass(){return `${UI_PREFIX}collapseItem-content`}
    }
    , mounted() {
      this.eventBus && this.eventBus.$on('update:selected', (names) => {
        this.open = names.indexOf(this.name) >= 0;
      });
    }
    , methods: {
      toggle() {
        if (this.open) {
          this.eventBus && this.eventBus.$emit('update:removeSelected', this.name);
        } else {
          this.eventBus && this.eventBus.$emit('update:addSelected', this.name);
        }
      }
    }

  }
</script>

<style lang="scss">
    @import '../var';
    $grey: #ddd;

    .#{$ui-prefix}collapseItem {
        &-title {
            display: flex;
            align-items: center;
            padding: 0 8px;
            min-height: 32px;
            border: 1px solid $grey;
            margin-top: -1px;
            margin-left: -1px;
            margin-right: -1px;
        }
        &:first-child {
            > .#{$ui-prefix}collapseItem-title {
                border-top-left-radius: $borderRadius;
                border-top-right-radius: $borderRadius;
            }
        }
        &:last-child {
            > .#{$ui-prefix}collapseItem-title:last-child { //:last-child，意思是最后一个要不展开，这里才会生效
                border-bottom-left-radius: $borderRadius;
                border-bottom-right-radius: $borderRadius
            }
        }
        &-content { padding: 8px; }
    }
</style>
