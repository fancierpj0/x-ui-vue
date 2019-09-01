<template>
    <div :class="navItemClass" @click="onClick">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "NavItem"
    ,inject:['root','vertical']
    ,props:{
      name:{
        type:String
        ,required:true
      }
    }
    ,data(){
      return {
        selected:false
      }
    }
    ,computed:{
      navItemClass(){
        return [`${UI_PREFIX}nav-navItem`, {selected: this.selected, vertical: this.vertical}];
      }
    }
    ,created() {
      this.root.addItem(this);
    }
    ,methods:{
      onClick(){
        this.root.namePath = [];
        this.$parent.updateNamePath && this.$parent.updateNamePath();
        this.$emit('add:selected', this.name);
      }
    }

  }
</script>


<style lang="scss">
@import "../var";
@import '../shape';
.#{$ui-prefix}nav-navItem{
    position:relative;
    padding:0.5em 1em;
    text-align: left;

    a{
        color:inherit;
        text-decoration: none;
    }

    &:hover{
        color:$blue;
    }

    //横向导航选中时下边的横线装饰
    &:not(.vertical){
        &.selected{
            &::after{
                content:'';
                @include bottomLine($color:$blue);
            }
        }
    }

    //纵向导航选中时的样式
    &.vertical{
        &.selected{
            color:$blue;
        }
    }
}

.#{$ui-prefix}subNav .#{$ui-prefix}nav-navItem:not(.vertical){
    &.selected{
        background: $grey;
        color:$color;
        &::after{
            display:none;
        }
    }
}
</style>
