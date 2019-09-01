<template>
    <div class="example">
        <h2>Button Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>click</p>
            <div>
                {{selectTab}}
                <tab :selected.sync="selectTab" :direction="direction">
                    <tab-head>
                        <h2>Animate</h2>
                        <template slot="actions">
                            <Button :style="{marginRight:'10px'}">设置</Button>
                            <Button icon="loading">加载更多</Button>
                        </template>
                        <tab-item name="woman" disabled>
                            <Icon name="loading"></Icon>
                            美女
                        </tab-item>
                        <tab-item name="finance">财经</tab-item>
                        <tab-item name="sports">体育123</tab-item>
                        <Input style="margin-left:10px;"></Input>
                    </tab-head>
                    <tab-body>
                        <tab-pane name="woman">美女相关资讯</tab-pane>
                        <tab-pane name="finance">财经相关资讯</tab-pane>
                        <tab-pane name="sports">体育相关资讯</tab-pane>
                    </tab-body>
                </tab>
            </div>
        </div>


        <hr>
        <div>
            <p>hover</p>
            <div>
                {{selectTab}}
                <tab :selected.sync="selectTab" :direction="direction" trigger="hover">
                    <tab-head>
                        <h2>Animate</h2>
                        <template slot="actions">
                            <Button :style="{marginRight:'10px'}">设置</Button>
                            <Button icon="loading">加载更多</Button>
                        </template>
                        <tab-item name="woman" disabled>
                            <Icon name="loading"></Icon>
                            美女
                        </tab-item>
                        <tab-item name="finance">财经</tab-item>
                        <tab-item name="sports">体育123</tab-item>
                        <Input style="margin-left:10px;"></Input>
                    </tab-head>
                    <tab-body>
                        <tab-pane name="woman">美女相关资讯</tab-pane>
                        <tab-pane name="finance">财经相关资讯</tab-pane>
                        <tab-pane name="sports">体育相关资讯</tab-pane>
                    </tab-body>
                </tab>
            </div>
        </div>
    </div>
</template>

<script>
  import Tab from './index';
  import TabBody from './TabBody';
  import TabHead from './TabHead';
  import TabItem from './TabItem';
  import TabPane from './TabPane';
  import Icon from '../Icon';
  import Button from '../Button';
  import Input from '../Input';
  export default {
    name: "Example"
    ,components:{Tab,TabBody,TabHead,TabItem,TabPane,Icon,Button,Input}
    ,data(){
      return {
        selectTab:'woman'
        ,direction:'horizontal'
      }
    }
  }
</script>

<style lang="scss">

</style>
