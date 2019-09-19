<template>
    <div class="example">
        <h2>Datepicker Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div class="page" style="position:relative;">
                <Datepicker v-model="d" :scope="scope"></Datepicker>
            </div>
        </div>
    </div>
</template>

<script>
  import Datepicker from './index'

  export default {
    name: "Example"
    ,components:{Datepicker}
    ,data () {
      return {
        d:new Date()
        ,scope:[new Date(1918,1),new Date(2019,5)]
      }
    }
    ,methods: {

    }
  }
</script>

<style lang="scss">

</style>
