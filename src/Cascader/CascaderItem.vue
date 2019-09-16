<template>
    <div :class="cascaderItemClass" :style="{ height: height }">
        <div :class="leftClass">
            <div :class="labelClass" v-for="item in items" @click="onClickLabel(item)">
                <span :class="nameClass">{{ item.name }}</span>
                <!-- 需要后端返回的数据具有isLeaf标识，是否有儿子，叶子即单身 -->
                <span :class="iconClass">
                  <template v-if="isLoading(item)">
                    <Icon :class="loadingClass" name="loading"></Icon>
                  </template>
                  <template v-else>
                    <Icon :class="nextClass" v-if="rightArrowVisible(item)" name="right"></Icon>
                  </template>
                </span>
            </div>
        </div>
        <div :class="rightClass" v-if="rightItems">
            <!--
            这里的 @update:selected="onUpdateSelected" 很关键
            会一层一层往上抛
            ,直到抛到CascaderItem递归组件的根
            ,最后@emit父组件Cascader传递过来的onUpdateSelected
            ,最终会调用 this.loadData(lastItem, updateSource);
            -->
            <cascader-item
                :selected="selected"
                @update:selected="onUpdateSelected"
                :items="rightItems"
                :load-data="loadData"
                :loading-list="loadingList"
                :level="level + 1"
                :height="height"
            ></cascader-item>
        </div>
    </div>
</template>

<script>
  import Icon from "../Icon";
  import {UI_PREFIX} from "../constant";

  export default {
    name: "CascaderItem"
    ,components: { Icon }
    ,props: {
      selected: {type: Array, default: () => {return [];}}
      ,items: {type: Array}
      ,loadData:{type:Function}
      ,loadingList:{type:Array,default:()=>([])}
      ,level: {type: Number, default: 0}
      ,height: {type: String}
    },
    computed: {
      cascaderItemClass(){return `${UI_PREFIX}cascaderItem`;}
      ,leftClass(){return `${this.cascaderItemClass}-left`;}
      ,rightClass(){return `${this.cascaderItemClass}-right`;}
      ,labelClass(){return `${this.leftClass}-label`;}
      ,nameClass(){return `${this.labelClass}-name`;}
      ,iconClass(){return `${this.labelClass}-icon`;}
      ,loadingClass(){return `${this.iconClass}-loading`;}
      ,nextClass(){return `${this.iconClass}-next`;}

      ,rightItems() {
        /*
            支持动态加载 该计算属性在动态加载时会重新计算
            因为我们动态加载时 父组件会update:source
            即更新父组件接受的source 也即是本计算属性依赖的的items
        */
        if (this.selected && this.selected[this.level]) {
          let item = this.items.filter(item => item.name === this.selected[this.level].name)[0];
          if (item && item.children && item.children.length > 0) {
            return item.children;
          }
        }
      }
    },
    methods: {
      onClickLabel(item) {
        /*//Vue.set(vm.someObject,'b',2)
        //vue中push等数组方法是经过改造的，有类似于set的功效
        this.$set(this.selected,this.level,item);*/

        //但↑这样修改了父组件的数据 违背单向数据流 不好
        let copy = JSON.parse(JSON.stringify(this.selected));
        copy[this.level] = item;
        copy.splice(this.level + 1);
        this.$emit("update:selected", copy);
      }
      ,onUpdateSelected(newSelected) {
        this.$emit("update:selected", newSelected);
      }
      ,rightArrowVisible(item){
        return this.loadData ? !item.isLeaf : item.children;
      }
      ,isLoading(item){
        return this.loadingList.length !== 0 && this.loadingList.includes(item.id)
      }
    }
  };
</script>

<style lang="scss">
    @import "../var";
    .#{$ui-prefix}cascaderItem {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        height: 100px; // 默认值 可以通过popoverHeight属性在行内样式中改变
        &-left {
            /*border:1px solid red;*/
            box-sizing:border-box;
            height: 100%;
            overflow: auto;

            &-label {
                padding: 0.5em 1em;
                display: flex;
                align-items: center;
                cursor:pointer;
                white-space:nowrap;
                &:hover {
                    background: $grey;
                }
                &-name {
                    margin-right: 1em;
                    user-select:none;
                }
                &-icon {
                    margin-left: auto; //todo
                    &-next{
                        transform: scale(0.5);
                    }
                    &-loading{
                        animation:spin 2s infinite linear;
                    }
                }
            }

        }
        &-right {
            height: 100%;
            border-left: 1px solid $borderColor-light;
            overflow: auto;
        }
    }

</style>
