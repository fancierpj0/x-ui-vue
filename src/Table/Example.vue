<template>
<div class="example">
    <h2>Toast Example</h2>
    <div style="height:1em;background: #4a90e2;"></div>

    <div>
        <p></p>
        <div >
            {{selectedTableItem}}
            <Table :data-source="dataSource" :selected-items.sync="selectedTableItem" :order-by.sync="orderBy" @update:orderBy="updateOrderBy" :loading="tableLoading" :height="400" extend-field="description" checkable>
                <table-column text="姓名" field="name" :width="100">
                    <template v-slot:default="{value}">
                        <a href="#">{{value}}</a>
                    </template>
                </table-column>
                <table-column text="分数" field="score"></table-column>
                <table-column text="操作" width="120">
                    <template v-slot:default="{row}">
                        <div style="display:flex;justify-content: space-between;">
                            <Button @click="edit(row)">编辑</Button>
                            <Button @click="view(row)">查看</Button>
                        </div>
                    </template>
                </table-column>
                <!--<template slot-scope="xxx">
                    <button @click="edit(xxx.item)">编辑</button>
                    <button @click="view(xxx.item)">查看</button>
                </template>-->
            </Table>
            <Pager :total-page="20" :current-page="currentPage" hide-if-one-page :style="{marginTop:'8px'}"></Pager>
        </div>
    </div>

    <div>
        <p></p>
        <div>
            <div>
                <Table :data-source="dataSource" bordered compact :selected-items.sync="selectedTableItem" :order-by.sync="orderBy" @update:orderBy="updateOrderBy" :loading="tableLoading" :height="400" expend-field="description" checkable>
                    <table-column text="姓名" field="name" :width="100">
                        <template v-slot:default="props">
                            <a href="#">{{props.value}}</a>
                        </template>
                    </table-column>
                    <table-column text="分数" field="score"></table-column>
                </Table>
                <Pager :total-page="20" :current-page.sync="currentPage" hide-if-one-page :style="{marginTop:'8px'}"></Pager>
            </div>
        </div>
    </div>
</div>
</template>

<script>
  import Table from './index';
  import TableColumn from './TableColumn';
  import Pager from '../Pager';
  import Button from '../Button';
  export default {
    name: "Example"
    ,components:{Table, TableColumn,Pager,Button}
    ,data(){
      return {
        dataSource:[
          {id:1,name:'方方',score:100,description:'xxx xxx'}
          ,{id:2,name:'圆圆',score:99,description:'yyy yyy'}
          ,{id:3,name:'张三',score:99}
          ,{id:4,name:'李四',score:99}
          ,{id:5,name:'超人',score:99}
          ,{id:6,name:'蝙蝠侠',score:99}
          ,{id:7,name:'蜘蛛侠',score:99}
          ,{id:8,name:'钢铁侠',score:99}
          ,{id:9,name:'钢铁侠',score:99}
          ,{id:10,name:'钢铁侠',score:99}
          ,{id:11,name:'钢铁侠',score:99}
          ,{id:12,name:'钢铁侠',score:99}
          ,{id:13,name:'钢铁侠',score:99}
          ,{id:14,name:'钢铁侠',score:99}
          ,{id:15,name:'钢铁侠',score:99}
          ,{id:16,name:'钢铁侠',score:99}
          ,{id:17,name:'钢铁侠',score:99}
          ,{id:18,name:'钢铁侠',score:99}
          ,{id:19,name:'钢铁侠',score:99}
          ,{id:20,name:'钢铁侠',score:99}
        ]
        ,orderBy:{ // true 开启排序 但不确定是asc desc
          name:true
          ,score:'desc'
        }
        ,selectedTableItem:[]
        ,tableLoading:false
        ,currentPage:1
      }
    }
    ,methods:{
        updateOrderBy(){
          this.tableLoading = true;
          setTimeout(() => {
            this.dataSource = this.dataSource.sort((a, b) => a.score - b.score);
            this.tableLoading = false;
          }, 3000);
          /*ajax(url,orderBy) //  /api/users?score='desc'
            .then((res)=>{
              this.dataSource = res.data;
            })*/
        }
      ,edit(item){
        alert(`开始编辑${item.id}`)
      }
      ,view(item){
        alert(`开始查看${item.id}`);
      }
      ,handlePageChange(n){
        this.tableLoading = true;
        this.currentPage = n
      }
    }
  }
</script>

<style lang="scss">
.example{
    margin:8px;
}
</style>
