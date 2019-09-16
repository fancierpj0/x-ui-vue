<template>
    <div :class="pagerClass">
        <span :class="pagerPrevClass" @click="onClickPage(currentPage-1)">
            Prev
        </span>
        <template v-for="page in pages">
            <template v-if="page === currentPage">
                <span :class="[pagerItemClass,'current']">{{page}}</span>
            </template>
            <template v-else-if="page === '...'">
                ...
            </template>
            <template v-else>
                <span :class="[pagerItemClass,'other']" @click="onClickPage(page)">{{page}}</span>
            </template>
        </template>
        <span :class="pagerNextClass" @click="onClickPage(currentPage+1)">
            Next
        </span>
    </div>
</template>

<script>
  import Icon from '../Icon';
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Pager"
    , components: {Icon}
    , props: {
      totalPage: {type: Number, required: true}
      , currentPage: {type: Number, required: true}
      , hideIfOnePage: {type: Boolean, default: true}
    }
    ,computed:{
      pagerClass(){return [`${UI_PREFIX}pager`, {hide: this.hideIfOnePage === true && this.totalPage <= 1}];}
      ,pagerPrevClass(){return [`${UI_PREFIX}pager-prev`,{disabled:this.currentPage === 1}];}
      ,pagerNextClass(){return [`${UI_PREFIX}pager-next`,{disabled:this.currentPage === this.totalPage}];}
      ,pagerItemClass(){return `${UI_PREFIX}pager-item`;}
      ,pages(){
        return unique([1, this.totalPage
          , this.currentPage
          , this.currentPage - 1, this.currentPage - 2
          , this.currentPage + 1, this.currentPage + 2]
          .filter((n) => n >= 1 && n <= this.totalPage)
          .sort((a, b) => a - b))
          .reduce((p, c, index, array) => {
            p.push(c);
            if (array[index + 1] !== undefined && array[index + 1] - array[index] > 1) {
              p.push('...')
            }
            return p;
          }, []);
      }
    }
    ,methods:{
      onClickPage(n){
        if (n >= 1 && n <= this.totalPage) {
          this.$emit('update:currentPage', n);
        }
      }
    }
  }

  function unique(array) {
    // return [...new Set(array)]

    const object = {};
    array.map((number) => {
      object[number] = true
    });

    return Object.keys(object).map(s => parseInt(s, 10));
  }
</script>

<style lang="scss">
    @import "../var";
    $width: 20px;
    $height: 20px;
    $font-size: 12px;

    .#{$ui-prefix}pager {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        user-select:none;

        &.hide{display:none;}

        &-item {
            display: inline-flex;justify-content: center;align-items: center;

            font-size: 12px;
            min-width: 20px;
            height: 20px;
            padding: 0 8px;
            border: 1px solid $grey;
            border-radius: $borderRadius;
            margin: 0 4px;

            cursor: pointer;

            &.current, &:hover {
                border-color: $blue;
            }
            &.current {
                cursor: default;
            }
        }
        &-prev,&-next {
            display: inline-flex;justify-content: center;align-items: center;

            font-size:12px;
            color:$color-light;
            height: $height;
            margin: 0 4px;

            cursor: pointer;

            &:not(.disabled):hover{
                color:$blue;
            }
            &.disabled {
                color: $color-disabled;
                cursor: not-allowed;
                svg {fill: darken($grey, 30%)}
            }
        }
    }
</style>
