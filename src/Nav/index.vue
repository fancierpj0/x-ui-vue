<template>
    <div :class="navClass">
        <slot></slot>
    </div>
</template>

<script>
  import {UI_PREFIX} from "../constant";

  export default {
    name: "Nav"
    ,provide(){
      return {
        root:this
        ,vertical:this.vertical
        ,openAll:this.openAll
      }
    }
    ,props:{
      selected:{type:Array,default:()=>[]}
      ,multiple:{type:Boolean,default:false}
      ,vertical:{type:Boolean,default:false}
      ,openAll:{type:Boolean,default:false}
    }
    ,computed:{
        navClass(){
          return [`${UI_PREFIX}nav`,{vertical:this.vertical}];
        }
    }
    ,data(){
      return {
        items:[]
        ,namePath:[]
      }
    }

    /*
        在Nav mounted之前，NavItem created的时候 会被注入 Nav的items
        在mounted时，我们再通过方法(updateChildren)遍历items与接受到的selected比较进行选定
    */
    ,mounted() {
      this.updateChildren();
      this.listenToChildren();
    }

    ,updated() {
      this.updateChildren();
    }
    ,methods:{
        updateChildren(){
            this.items.forEach(vm => {
              vm.selected = this.selected.indexOf(vm.name) >= 0;});
        }


        ,listenToChildren(){
            this.items.forEach(vm => {
              vm.$on('add:selected', (name) => {
                if(this.multiple){
                  if (this.selected.indexOf(name) < 0) {
                    let copy = JSON.parse(JSON.stringify(this.selected));
                    copy.push(name);
                    this.$emit('update:selected', copy);
                  }
                }else{
                  this.$emit('update:selected', [name]);}});}); //紧接着就会走 updated 生命周期
        }

        ,addItem(vm){ // NavItem created时 会将自己的this传递过来(this.root.addItem(this);)
            this.items.push(vm);
        }
    }

  }
</script>


<style lang="scss">
@import '../var';
.#{$ui-prefix}nav{
    display:flex;
    align-items: center;
    border-bottom:1px solid $grey;
    color:$color;
    user-select:none;

    &.vertical{
        display:block;
        border:1px solid $grey;
    }
}
</style>
