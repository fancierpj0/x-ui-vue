<template>
    <div class="example">
        <h2>Pager Example</h2>

        <hr>
        <div>
            <p></p>
            <div>
                <Pager :total-page="20" :current-page="currentPage" @update:currentPage="changePage" hide-if-one-page></Pager>
            </div>
        </div>


    </div>
</template>

<script>
  import Pager from './index';
  export default {
    name: "Example"
    ,components:{Pager}
    ,data(){
      return {
        currentPage:1
      }
    }
    ,methods:{
      changePage(n){
        this.currentPage = n;
        console.log(n);
      }
    }
  }
</script>

<style lang="scss">

</style>
