<template>
    <div>
        <h2>Toast Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>
                默认行为:
                1.自动关闭，可设置是否取消(false，boolean值)以及调整持续时间(数字，单位为秒)
                2.显示关闭按钮(close-button)，可设置为false则隐藏
                3.关闭后会触发`close`事件(真关闭，不可撤销)，不论是自动关闭还是点击按钮后导致的关闭
            </p>
            <div>
                <Toast :auto-close="false">
                    Toast测试000001 <br>
                    Toast测试000001 <br>
                    Toast测试000001 <br>
                </Toast>
            </div>
        </div>

        <hr>
        <div>
            <p>支持三个position，top、bottom、middle</p>
            <div>
                <Toast position="bottom"  @close="handleCloseEmit">position:bottom</Toast>
            </div>
        </div>

        <hr>
        <div>
            <p>close-button接受一个参数，可设置button的文本显示和点击关闭后触发的回调，和触发的`emit`事件不同的是，此回调在Toast真正执行之前执行</p>
            <div>
                <Toast :close-button="{text:'自定义关闭按钮的文本',callback}" position="middle" :auto-close="false">
                    <Button icon="success" @click="handleClick" icon-position="right">按钮</Button>
                </Toast>
            </div>
        </div>

        <p>可通过注册插件的方式，以this.$toast(message/jsx,optionsObj)来呼出toast；这种方式是单例的，意味着同时只能呼出一个toast</p>

        <p>可设置`widthAuto=true`，让toast自适应内容宽度</p>
    </div>
</template>

<script>
  import Toast from './index';
  import Button from '../Button';
  import Vue from 'vue';
  import Plugin from './plugin';
  Vue.use(Plugin);

  export default {
    name: "Example"
    , components: {Toast,Button}
    ,data(){
      return {
        data1:123
        ,htmlString:'<div>我是一个div</div>'
      }
    }
    ,mounted() {
      this.$toast(<div style="background:pink;width:100px;height:100px;">这是通过this.$toast()呼出的toast1</div>,{position:'bottom',autoClose:false,autoWidth:true});
      this.$toast(<div style="background:pink;width:100px;height:100px;">这是通过this.$toast()呼出的toast2</div>,{position:'bottom',autoClose:false,autoWidth:true});
    }
    ,methods:{
      callback(x){
        alert('回调接受的第一个参数为this，指向该组件；在关闭真正执行之前，可以通过x.cancel=false进行反悔撤销');
        x.cancel = true;
      }
      ,handleClick(){
        alert(this.data1);
      }
      ,handleCloseEmit(){
        console.log('close emit')
      }
    }
  }
</script>

<style lang="scss">

</style>
