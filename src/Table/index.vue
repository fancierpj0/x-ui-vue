<template>
  <div :class="tableWrapperClass" ref="tableWrapper">
    <Scroll :class="tableContainerClass" :style="{height:`${height}px`}" ref="tableContainer">

      <table :class="tableClass" ref="table">
        <thead>
          <tr>
            <th v-if="extendField" :style="{width:'50px'}" class="cellCenter"></th>
            <th v-if="checkable" :style="{width:'50px'}" class="cellCenter">
              <input type="checkbox" @change="onChangeAllItems" ref="allChecked" :checked="areAllItemsSelected"/>
            </th>
            <!--column:{text, field, width, render}-->
            <th v-for="column in columns" :key="column.field" :style="{width:column.width+'px'}">
              <div :class="tableHeaderClass">
                {{ column.text }}
                <span v-if="column.field in orderBy" :class="sorterClass" @click="changeOrderBy(column.field)">
                  <Icon name="asc" :class="{active:orderBy[column.field]==='asc'}"></Icon>
                  <Icon name="desc" :class="{active:orderBy[column.field]==='desc'}"></Icon>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(item,index) in dataSource">
            <tr :key="item.id">
              <td v-if="extendField" :style="{width:'50px'}" class="cellCenter">
                <Icon name="right" :class="extendIconClass(item.id)" @click="extendItem(item.id)"></Icon>
              </td>
              <td v-if="checkable" :style="{width:'50px'}" class="cellCenter">
                <input type="checkbox" @change="onChangeItem(item, index, $event)" :checked="inSelectedItems(item)"/>
              </td>

              <!--column:{text, field, width, render}-->
              <template v-for="column in columns">
                <td :key="column.field" :style="{width:column.width+'px'}">
                  <template v-if="column.render">
                    <!--
                      column.render:(props)=>return createElement(...)|JSX

                      下面slot里的模板将作为上面函数返回的createElement|JSX，上面的prop即是下面的prop
                      ,也即是我们column.render(prop)传递的prop

                      <template slot-scope="props">
                        <a href="#">{{props.value}}</a>
                      </template>

                      之所以要套一层组件，是因为vue模板里不允许直接{{createElement}}
                    -->
                    <vnode :vnode="column.render({value:item[column.field],row:item})"></vnode>
                  </template>
                  <template v-else>
                    {{item[column.field]}}
                  </template>
                </td>
              </template>
            </tr>
            <!--↓需要被展开的-->
            <tr v-if="inExtendedIds(item.id)" :key="`${item.id}-extend`">
              <td :colspan="extendedCellColSpan">
                {{item[extendField]||'空'}}
              </td>
            </tr>
          </template>

        </tbody>
      </table>
    </Scroll>
    <div :class="loadingContainerClass" v-if="loading">
        <Icon name="loading"></Icon>
    </div>
  </div>
</template>

<script>
import Icon from "../Icon";
import Scroll from "../Scroll";
import {UI_PREFIX} from "../constant";

export default {
  name: "Table"
  , components: {
    Icon,Scroll
    , vnode: {functional: true
      , render: (h, context) => context.props.vnode}
  }
  , props: {
      height: {/* type:[Number,String]*/ type: [Number,String]}
      , extendField: {type: String}
      , orderBy: {type: Object, default: () => ({})} // { name:true,score:'desc'}true 开启排序，界面上显示排序按钮，但还没有选定是asc还是desc
      , loading: {type: Boolean, default: false}
      , dataSource: {type: Array, required: true, validator(array) {
          return array.filter(item => item.id === undefined).length <= 0;}}
      , bordered: {type: Boolean, default: false}
      , compact: {type: Boolean, default: false} // 每一行的padding大小
      , striped: {type: Boolean, default: true} // 斑马纹
      , selectedItems: {type: Array, default: () => []}
      , checkable: {type: Boolean, default: false}
  }
  , data() {
    return {
      extendedIds: []
      , columns: [] // {text, field, width, render} render为scopedSlots具名插槽对象里的具名插槽生成函数
      , tableCopy: undefined
    }
  }
  , computed: {
    tableWrapperClass(){return `${UI_PREFIX}tableWrapper`;}
    ,tableContainerClass(){return `${this.tableWrapperClass}-tableContainer`;}
    ,tableClass(){return [`${this.tableContainerClass}-table`,{ bordered:this.bordered, compact:this.compact, striped:this.striped }]}
    ,tableHeaderClass(){return `${this.tableContainerClass}-table-thead-tr-th-tableHeader`;}
    ,sorterClass(){return `${this.tableHeaderClass}-sorter`;}
    ,loadingContainerClass(){return `${this.tableWrapperClass}-loadingContainer`;}

    //dataSource 和 selectedItems两个数组里的数据进行对比
    ,areAllItemsSelected() {
      const a = this.dataSource.map(item => item.id).sort(); //默认字典排序，默认即可
      const b = this.selectedItems.map(item => item.id).sort();
      if (a.length !== b.length) return false;
      let equal = true;
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
          equal = false;
          break;
        }
      }
      return equal;
    }
    , extendedCellColSpan() {
      let result = this.columns.length;
      if (this.checkable) result += 1;
      if (this.extendField) result += 1;
      return result;
    }
  }
  , watch: {
    selectedItems() { // ↓半选
      this.$refs.allChecked.indeterminate = !(this.selectedItems.length === this.dataSource.length || this.selectedItems.length === 0);
    }
  }
  , mounted() {
    this.getColumnsConfig();

    this.setFixedTableHeader();
  }
  , beforeDestroy() {
    this.tableCopy.remove();
    // window.removeEventListener('resize', this.onWindowResize);
  }
  , methods: {
    getColumnsConfig(){
      /*
        无法通过this.$children 得到孩子
        这可能是因为组件并没有使用<slot></slot>来接受default插槽的原因
        so，我们通过this.$slots.default来得到孩子(vnode)
      */
      this.columns = this.$slots.default.map(node => { // vnode
        let {text, field, width} = node.componentOptions.propsData; // <table-column> 上接受到的prop

        /*
          <table-column>包裹里的<x v-slot:default>，是一个函数
          node.data.scopedSlots和createElement的dataObject里的scopedSlots是同一个东西
          区别在于node.data.scopedSlots里这个是插槽里的插槽

          scopedSlots: {
            default: function (props) {
              return createElement('span', props.text) } }
        */
        let render = node.data.scopedSlots && node.data.scopedSlots.default; // (props)=>return createElement(...)
        return {text, field, width, render};
      });
    }
    ,setFixedTableHeader(){
      let tableCopy = this.$refs.table.cloneNode(false); //true 后代也会被复制
      this.tableCopy = tableCopy;
      tableCopy.classList.add(`${UI_PREFIX}tableWrapper-tableCopy`);
      let tHead = this.$refs.table.children[0]; // this.$refs.table.children:[thead,tbody]
      let {height} = tHead.getBoundingClientRect();
      this.$refs.tableContainer.$el.style.marginTop = height + 'px';
      this.$refs.tableContainer.$el.style.height = this.height - height + 'px';
      tableCopy.appendChild(tHead);
      this.$refs.tableWrapper.appendChild(tableCopy);
    }
    ,extendItem(id) {
      if (this.inExtendedIds(id)) {
        this.extendedIds.splice(this.extendedIds.indexOf(id), 1);
      } else {
        this.extendedIds.push(id);
      }
    }
    , inExtendedIds(id) {
      return this.extendedIds.indexOf(id) >= 0;
    }

    , changeOrderBy(key, value) {
      //不单独识别上下箭头 这么做是为了 手机端好点击...
      const copy = JSON.parse(JSON.stringify(this.orderBy));
      let oldValue = copy[key];
      if(oldValue === 'asc'){
        copy[key] = 'desc';
      }else if(oldValue === 'desc'){
        copy[key] = true;
      }else{ // true -> asc
        copy[key] = 'asc';
      }
      this.$emit('update:orderBy', copy);
    }
    , inSelectedItems(item) {
      return this.selectedItems.filter(i => i.id === item.id).length > 0;
    }
    , onChangeItem(item, index, e) {
      // console.log(e.target.checked);
      let selected = e.target.checked;
      let copy = JSON.parse(JSON.stringify(this.selectedItems));
      if (selected) {
        copy.push(item);
      } else {
        // copy.splice(copy.map(item=>item.id).indexOf(item.id), 1);
        copy = copy.filter(i => i.id !== item.id);
      }
      this.$emit("update:selectedItems", copy);
    }
    , onChangeAllItems(e) {
      let selected = e.target.checked;
      if (selected) {
        this.$emit("update:selectedItems", this.dataSource);
      } else {
        this.$emit("update:selectedItems", []);
      }
    }
    ,extendIconClass(id){
      return [`${this.tableContainerClass}-table-tbody-tr-td-extendIcon`,{extended: this.inExtendedIds(id)}];
    }


  }
};
</script>

<style lang="scss">
@import "../var";
@import "../animation";

$border-color:rgb(232,232,232);
$table-bgColor:#fff;
$tr-bgLightColor:#fff;
$tr-bgDarkColor:rgb(250,250,250);

.#{$ui-prefix}tableWrapper{
  position:relative;
  overflow:auto;

  .cellCenter{
    text-align: center;
  }

  &-loadingContainer{
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    background: rgba(255,255,255,.7);
    svg{
      width: 50px;
      height: 50px;
      @include spin;
    }
  }

  &-tableContainer{
    /* 有一个固定高度，由用户传递，通过js设置 */
    /*overflow:auto; // 使用Scroll组件 无需自己overflow 交由scroll组件自己决定*/
    &-table {
      background: $table-bgColor;
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0; // 设置了 collapse 其实 border-spacing就没用了

      &.#{$ui-prefix}tableWrapper-tableCopy{
        background:$tr-bgDarkColor;
      }

      &:not(.#{$ui-prefix}tableWrapper-tableCopy) tr:hover{
        background: rgb(230, 247, 255) !important;
      }
      /*tr:hover {
        background: rgb(230, 247, 255) !important;
      }*/

      td, th {
        border-bottom: 1px solid $border-color;
        text-align: left;
        padding: 8px;
      }

      &.bordered {
        border: 1px solid $border-color;
        td, th {
          border: 1px solid $border-color;
        }
      }

      &.compact {
        td, th {
          padding: 4px;
        }
      }

      &.striped { // 条纹
        tbody {
          > tr {
            &:nth-child(odd) {
              background: $tr-bgLightColor;
            }
            &:nth-child(even) {
              background:$tr-bgDarkColor;
            }
          }
        }
      }

      &-thead-tr-th-tableHeader {
        display: flex;
        align-items: center;
        &-sorter {
          display: inline-flex;
          flex-direction: column;
          margin-left:8px;
          cursor: pointer;
          svg {
            width: 10px;
            height: 10px;
            fill: $grey;
            &.active{fill:$red;}
            &:nth-of-type(1) {
              position: relative;
              bottom: -1px;
            }
            &:nth-of-type(2) {
              position: relative;
              top: -1px;
            }
          }
        }
      }

      &-tbody-tr-td-extendIcon{
        width:10px;
        height:10px;
        transition:transform .25s;
        &.extended{
          transform: rotate(90deg);
        }
      }

    }
  }

  &-tableCopy {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

}

</style>
