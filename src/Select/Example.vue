<template>
    <div class="example">
        <h2>Select Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <div>
            <p></p>
            <div>
                {{value1}}
                <Select v-model="value1" size="default">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        </div>
    </div>
</template>

<script>
  import Select from './index';
  import Option from './Option';
  export default {
    name: "Example"
    ,components:{Select,Option}
    ,data(){
      return {
        value1: ''
        ,cityList: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          },
          {
            value: 'Sydney',
            label: 'Sydney'
          },
          {
            value: 'Ottawa',
            label: 'Ottawa'
          },
          {
            value: 'Paris',
            label: 'Paris'
          },
          {
            value: 'Canberra',
            label: 'Canberra'
          }
        ]
      };
    }
  }
</script>

<style lang="scss">

</style>
