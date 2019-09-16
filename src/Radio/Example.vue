<template>
    <div class="example">
        <h2>Radio Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div>
                {{single}}
                <Radio v-model="single">Single Radio</Radio>
            </div>
        </div>


        <hr>
        <div>
            <p></p>
            <div>
                <Radio value="0" size="large" v-model="single"><Icon name="right"/>Apple</Radio>
                <Radio value="1" size="" v-model="single">Android</Radio>
                <Radio value="2" size="small" v-model="single">Windows</Radio>
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                {{phone}}
                <RadioGroup v-model="phone" size="large">
                    <Radio value="0" ><Icon name="right"/>Apple</Radio>
                    <Radio value="1" >Android</Radio>
                    <Radio value="2" >Windows</Radio>
                </RadioGroup>
            </div>
        </div>

    </div>
</template>

<script>
  import Radio from './index';
  import RadioGroup from './RadioGroup';
  import Icon from "../Icon";
  export default {
    name: "Example"
    ,components:{Radio,RadioGroup,Icon}
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
