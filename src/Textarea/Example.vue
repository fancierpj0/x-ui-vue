<template>
    <div class="example">
        <h2>Textarea Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <div>
            <p></p>
            <div>
                {{value1}}
                <Textarea v-model="value1"/>
            </div>
        </div>
    </div>
</template>

<script>
  import Textarea from './index';
  export default {
    name: "Example"
    ,components:{Textarea}
    ,data(){
      return {
        value1:''
      }
    }
  }
</script>

<style lang="scss">

</style>
