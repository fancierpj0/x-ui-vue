<template>
    <div class="example">
        <h2>Form Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <div>
            <p></p>
            <div>
                {{single}}
                <Radio v-model="single">Single Radio</Radio>
            </div>
        </div>

        <div>
            <p></p>
            <div>
                {{phone}}
                <RadioGroup v-model="phone">
                    <Radio value="0">Apple</Radio>
                    <Radio value="1">Android</Radio>
                    <Radio value="2">Windows</Radio>
                </RadioGroup>
            </div>
        </div>

    </div>
</template>

<script>
  import Radio from './index';
  import RadioGroup from './RadioGroup';
  export default {
    name: "Example"
    ,components:{Radio,RadioGroup}
    ,data(){
      return {
        single:false
        ,phone:'0'
      }
    }
  }
</script>

<style lang="scss">

</style>
