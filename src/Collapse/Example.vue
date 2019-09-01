<template>
    <div class="example">
        <h2>Button Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>selected必须是一个数组</p>
            <div style="width:400px;">
                <Collapse :selected.sync="selectedArray1">
                    <collapse-item title="标题1" name="1">内容1</collapse-item>
                    <collapse-item title="标题2" name="2">内容2</collapse-item>
                    <collapse-item title="标题3" name="3">内容3</collapse-item>
                </Collapse>
            </div>
        </div>

        <div>
            <p>single:true</p>
            <div style="width:400px;">
                <Collapse :selected.sync="selectedArray2" :single="true">
                    <collapse-item title="标题1" name="1">内容1</collapse-item>
                    <collapse-item title="标题2" name="2">内容2</collapse-item>
                    <collapse-item title="标题3" name="3">内容3</collapse-item>
                </Collapse>
            </div>
        </div>
    </div>
</template>

<script>
  import Collapse from './index';
  import CollapseItem from './CollapseItem';
  export default {
    name: "Example"
    ,components:{Collapse,CollapseItem}
    ,data(){
      return{
        selectedArray1: ['1']
        ,selectedArray2: ['3']
      }
    }
  }
</script>

<style lang="scss">

</style>
