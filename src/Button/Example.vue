<template>
    <div class="example">
        <h2>Button Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>支持不同种类的标签，并且支持这些标签的原生attrs</p>
            <div>
                <Button icon-position="right" href="http://www.baidu.com" target="_blank">我是a标签，点击前往百度</Button>
                <Button tag-type="button">Button</Button>
                <Button tag-type="input" type="button" value="我是type为button的input"></Button>
            </div>
        </div>

        <hr>
        <div>
            <p>支持icon，支持iconPosition</p>
            <div>
                <Button icon="upload">Button</Button>
                <Button icon="upload" icon-position="right">Button</Button>
            </div>
        </div>

        <hr>
        <div>
            <p>支持loading</p>
            <div>
                <Button :loading="loading" icon="upload" @click="handleClick">Button</Button>点击会取消loading态
            </div>
        </div>

        <hr>
        <div>
            <p>支持绑定各种事件</p>
            <div>
                <Button :loading="loading" icon="upload" @click="handleClick">Button</Button>绑定@click
                <Button :loading="loading" icon="upload" @mouseenter="handleClick" @mouseleave="handleClick">Button</Button>绑定@mouseenter和mouseleave
                <Button :loading="loading" @click.native="abc">Button213</Button>绑定@click.native
            </div>
        </div>

        <hr>
        <div>
            <p>button-group，children必须是Button组件，否则会报一个warning</p>
            <button-group size="large">
                <Button icon="upload" :class="'abc'"></Button>
                <Button icon="download" icon-position="right" :class="['abc','bbb']" ></Button>
                <Button icon="download" icon-position="right" :class="'abc'"></Button>
            </button-group>
            <br>
            <button-group size="large">
                <div>这是第二个button-group，会warning</div>
            </button-group>
        </div>

        <hr>
        <div>
            <p>inline-block，一行显示无问题</p>
            <div>
                <button-group size="large">
                    <Button icon="upload"></Button>
                    <Button icon="download" icon-position="right"></Button>
                    <Button icon="download" icon-position="right"></Button>
                </button-group>
                <Button icon="loading" size="small">a</Button>
                <Button icon="loading" tag-type="input">input</Button>
                <Button icon="loading" tag-type="button" size="large">button</Button>
            </div>
        </div>
    </div>
</template>

<script>
  import Button from './index';
  import ButtonGroup from './ButtonGroup';
  export default {
    name: "Example"
    ,components:{Button,ButtonGroup}
    ,data(){
      return {
        loading:true
      }
    }
    ,methods:{
      changeLoading(){
        this.loading = !this.loading;
      }
      ,handleClick(){
        this.changeLoading();
      }
      ,abc(e){
        alert('native 事件');
        console.log('this:', this);
        console.log('e:',e);
        console.log('e.target:', e.target);
      }
    }
  }
</script>

<style lang="scss">

</style>
