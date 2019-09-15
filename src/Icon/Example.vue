<template>
<div class="example">
    <h2>Icon Example</h2>
    <div style="height:1em;background: #4a90e2;"></div>

    <hr>
    <div>
        <p>显示svg图标</p>
        <div>
            <Icon name="loading"></Icon>
        </div>
    </div>

    <hr>
    <div>
        <p>自动$emit监听的事件</p>
        <Icon name="loading" @mouseenter="handler"></Icon>mouseenter触发
    </div>

    <hr>
    <div>
        <p>支持原生事件</p>
        <Icon name="loading" @click.native="handleNativeClick"></Icon>
    </div>
</div>
</template>

<script>
  import Icon from './index';
  export default {
    name: "Example"
    ,components:{Icon}
    ,methods:{
      handler(){
        alert('handler');
      }
      ,handleNativeClick(e){
        alert('native click');
        console.log('this:',this)
        console.log('e:',e)
      }
    }
  }
</script>

<style lang="scss">
.example{

}
</style>
