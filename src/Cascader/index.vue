<template>
    <div :class="cascaderClass" ref="cascader" v-click-outside="close">
        <div :class="triggerClass" @click="toggle" tabindex="0">
            {{this.result||'&nbsp;'}}
        </div>
        <div :class="popoverClass" v-if="popoverVisible">
            <cascader-items
                :selected="selected"
                @update:selected="onUpdateSelected"
                :items="source"
                :loadData="loadData"
                :loading-list="loadingList"
                :height="popoverHeight"
            ></cascader-items>
        </div>
    </div>
</template>

<script>
  import CascaderItems from './CascaderItem';
  import ClickOutside from '../directive/click-outside';
  import {FORM_EVENTBUS, UI_PREFIX} from "../constant";
  import {findInDeepByField} from "../util";

  export default {
    name: "Cascader"
    , components: {CascaderItems}
    ,directives:{ClickOutside}
    ,model:{prop:'selected',event:'change'}
    ,inject: {
      [FORM_EVENTBUS]: { from: FORM_EVENTBUS, default: null }
      ,field: { from: "field", default: null }
    }
    , props: {
      /*
        source中每一项长这样:
        {name:...,children:[]}
        ,如果是动态加载的还会有id、parent_id、isLeaf
      */
      source: {type: Array}
      // 就是从↑选取的几项
      , selected: {type: Array, default: () => {return [];}}

      , loadData: {type: Function} //
      , popoverHeight: {type: String}
      , size: {type: String, default: "default",
        validator(value) {return ["large", "small", "default"].indexOf(value) >= 0;}}
    }
    , data() {
      return {
        popoverVisible: false
        ,loadingList:[]
        ,error:false
      }
    }
    , computed: {
      cascaderClass(){return `${UI_PREFIX}cascader`;}
      ,popoverClass(){return `${this.cascaderClass}-popover`;}
      ,triggerClass(){return [`${this.cascaderClass}-trigger`,{error: this.error, small: this.size === "small", large: this.size === "large",open:this.popoverVisible}];}
      ,result() {
        return this.selected.map(item => item.name).join('/')
      }
    }
    , methods: {
      close(){
        this.popoverVisible = false;
      }
      ,open(){
        this.popoverVisible = true;
      }
      ,toggle(){
        if(this.popoverVisible === true){
          this.close();
        }else{
          this.open();
        }
      }

      ,checkLoad(lastItem){
        if (lastItem.isLeaf || !this.loadData) return false;
        if (lastItem.children || this.loadingList.includes(lastItem.id)) return false;
        this.loadingList.push(lastItem.id);
        return true;
      }

      /*
        这里的newSelected 是 CascaderItem里 onClickLabel() 方法发射出的newSelected
        ,这个newSelected是从本组件(Cascader)传递到CascaderItem后经过copy并处理后返回的新selected
      */
      ,onUpdateSelected(newSelected) {
        this.$emit('change', newSelected);
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');

        if(!this.loadData) return;

        let updateSource = (result) => {
          /*let toUpdate = complex(this.source, lastItem.id);
          this.$set(toUpdate, 'children', result);*/

          //↑直接修改了父数据
          this.loadingList.splice(this.loadingList.indexOf(lastItem.id), 1);
          let copy = JSON.parse(JSON.stringify(this.source));
          let toUpdate = findInDeepByField(copy, lastItem.id, 'id');
          toUpdate.children = result;
          this.$emit('update:source', copy);
        };

        /*
            lastItem即是你 onClickLabel() 时 click的那一项
            ,如果是动态加载的数据
            ,此时就需要判断是否有孩子
            ,有就动态加载(将请求回来的数据挂载到item.children上)
        */
        let lastItem = newSelected[newSelected.length - 1];
        this.checkLoad(lastItem) &&
        this.loadData(lastItem, updateSource);
      }
    }

  }
</script>

<style lang="scss">
@import "../var";
@import '../shape';

.#{$ui-prefix}cascader {
    display:inline-block;
    vertical-align: middle;
    display:inline-flex;
    align-items: center;
    position: relative;

    &-trigger {
        min-width:10em;

        @include differentSizeSelect();
    }

    &-popover {
        /*display:flex;*/
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 4px;
        background: #fff;
        z-index:1;
        box-shadow: 0 1px 6px fade_out(#000, 0.8);
    }
}
</style>
