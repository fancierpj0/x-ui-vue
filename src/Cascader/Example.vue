<template>
    <div class="example">
        <h2>Cascader Example</h2>

        <hr>
        <div>
            <p></p>
            <div>
                <Cascader :source.sync="source1" popoverHeight="200px" :selected.sync="selectedCity1" ></Cascader>
                <!--{{selectedCity1}}-->
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                <Cascader :source.sync="source2" :selected.sync="selectedCity2" :load-data="loadData" popoverHeight="200px"></Cascader>
                <!--{{selectedCity2}}-->
            </div>
        </div>
    </div>
</template>

<script>
  import Cascader from "./index";
  import CascaderItem from "./CascaderItem";
  import db from '../db';

  function ajaxRequest(pid = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = db.filter((item) => item.parent_id === pid);
        result.forEach(node => {
          node.isLeaf = db.filter(item => item.parent_id === node.id).length <= 0;
        });
        resolve(result);
      }, 2000);
    });
  }

  export default {
    name: "Example"
    ,components: {Cascader,CascaderItem}
    ,data(){
      return {
        source1:[{
        name:'浙江'
        ,children:[
          {name:'杭州'
            ,children:[
              {name:'上城'}
              ,{name:'下城'}
              ,{name:'江干'}
            ]
          }
          ,{name:'嘉兴'
            ,children:[
              {name:'南湖'}
              ,{name:'秀洲'}
              ,{name:'嘉善'}
            ]
          }
          ,{name:'湖州'}
        ]
      },{
        name:'福建'
        ,children:[
          {name:'福州'
            ,children:[
              {name:'鼓楼'}
              ,{name:'台江'}
              ,{name:'仓山'}
            ]
          }
          ,{name:'厦门'}
          ,{name:'莆田'}
          ,{name:'三明'}
          ,{name:'泉州'}
        ]
      }]
        ,source2:[]
        ,selectedCity1:[]
        ,selectedCity2:[]
      }
    }
    , created() {
      //↓级联
      //动态需要加上
      ajaxRequest(0).then((result) => {
        this.source2 = result;
      });
    }
    ,methods:{
      loadData(node, callback) {
        let {name, id, parent_id} = node;
        ajaxRequest(id).then(result => {
          if (result.length > 0) callback(result); //this.$emit('update:source', copy);
        });
      }
    }
  }
</script>

<style lang="scss">

</style>
