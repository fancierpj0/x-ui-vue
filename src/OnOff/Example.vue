<template>
    <div class="example">
        <h2>OnOff Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div>
                {{value1}}
                <on-off v-model="value1" on-text="开" off-text="关" :loading="loading"/>
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                {{value1}}
                <on-off v-model="value2" on-text="开" off-text="关" :loading="loading" size="large"/>
            </div>
        </div>

        <hr>
        <div>
            <p></p>
            <div>
                {{value1}}
                <on-off v-model="value3" on-text="开" off-text="关" :loading="false" size="small"/>
            </div>
        </div>
    </div>
</template>

<script>
  import OnOff from './index';
  export default {
    name: "Example"
    ,components:{OnOff}
    ,data(){
      return {
        value1: true
        ,value2: true
        ,value3: false
        ,loading:false
      };
    }
  }
</script>

<style lang="scss">

</style>
