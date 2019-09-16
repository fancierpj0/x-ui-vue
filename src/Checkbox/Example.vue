<template>
    <div class="example">
        <h2>Checkbox Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>single checkbox</p>
            <div>
                <div>{{single}}</div>
                <Checkbox v-model="single"></Checkbox>
            </div>
        </div>

        <hr>
        <div>
            <p>group checkbox</p>
            <div>
                <div>{{group}}</div>
                <checkbox-group v-model="group">
                    <Checkbox :value="0" size="small">肯德基</Checkbox>
                    <Checkbox :value="1" size="default">麦当劳</Checkbox>
                    <Checkbox :value="2">德克士</Checkbox>
                    <Checkbox :value="3" size="large">汉堡王</Checkbox>
                </checkbox-group>
            </div>
        </div>

        <hr>
        <div>
            <p>group checkbox</p>
            <div>
                <div>{{group}}</div>
                <checkbox-group v-model="group" size="large">
                    <Checkbox :value="0" size="small">肯德基</Checkbox>
                    <Checkbox :value="1" size="default">麦当劳</Checkbox>
                    <Checkbox :value="2">德克士</Checkbox>
                    <Checkbox :value="3" size="large">汉堡王</Checkbox>
                </checkbox-group>
            </div>
        </div>
    </div>
</template>

<script>
  import Checkbox from './index';
  import CheckboxGroup from './CheckboxGroup';
  export default {
    name: "Example"
    ,components:{Checkbox,CheckboxGroup}
    ,data(){
      return {
        single:false
        ,group:[1,2]
      }
    }
  }
</script>

<style lang="scss">

</style>
