<template>
<div class="example">
    <h2>Toast Example</h2>
    <div style="height:1em;background: #4a90e2;"></div>

    <hr>
    <div>
        <p>click</p>
        <div>
            <Button>Button</Button>
            <Popover position="rightBottom">
                <template v-slot:content="{close}">
                    <!--<div>popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容</div>-->
                    <div style="width:100px;height:100px;background:orange;" ref="a">
                        abc
                    </div>
                    <Button @click="close" @mouseover="handleClick">关闭</Button>
                </template>
                <Button>点我</Button>
            </Popover>
        </div>
    </div>

    <hr>
    <div>
        <p>hover</p>
        <div>
            <Popover position="leftBottom" trigger="hover">
                <template v-slot:content="{close}">
                    <!--<div>popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容</div>-->
                    <div style="width:100px;height:100px;background:orange;">
                        abc
                    </div>
                    <Button @click="close">关闭</Button>
                </template>
                <Button @click="handleClick">点我</Button>
            </Popover>
        </div>
    </div>

</div>
</template>

<script>
  import Popover from './index';
  import Button from '../Button/index';
  export default {
    name: "Example"
    ,components:{Popover,Button}
    ,mounted() {
      console.log('this.$refs.a:',this.$refs.a);
      setTimeout(()=>{
        console.log('this.$refs.a:',this.$refs.a); //undefined 无效的ref
      },2000)
    }
    ,methods:{
      handleClick(e){
        console.log('test');
        console.log(e.target.getBoundingClientRect())
      }
    }
  }
</script>

<style lang="scss">
@import '../shape';

</style>
