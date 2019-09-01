<template>
<div class="example">
    <h2>Toast Example</h2>
    <div style="height:1em;background: #4a90e2;"></div>

    <hr>
    <div>
        <p>click</p>
        <div>
            <Button>Button</Button>
            <Popover position="bottomRight">
                <template v-slot:content="{close}">
                    <!--<div>popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容</div>-->
                    <div style="width:100px;height:100px;background:orange;">
                        abc
                    </div>
                    <Button @click="close">关闭</Button>
                </template>
                <Button>点我</Button>
            </Popover>
        </div>
    </div>

    <hr>
    <div>
        <p>hover</p>
        <div>
            <Popover position="right" trigger="hover">
                <template v-slot:content="{close}">
                    <!--<div>popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容popover内容</div>-->
                    <div style="width:100px;height:100px;background:orange;">
                        abc
                    </div>
                    <Button @click="close">关闭</Button>
                </template>
                <Button>点我</Button>
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
  }
</script>

<style lang="scss">
@import '../shape';

</style>
