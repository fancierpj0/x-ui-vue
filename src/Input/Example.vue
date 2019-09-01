<template>
    <div class="Example">
        <h2>Input Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>@change</p>
            <div>
                <Input @change="handleChange"></Input>
            </div>
        </div>

        <hr>
        <div>
            <p>@input</p>
            <div>
                <Input @input="handleInput"></Input>
            </div>
        </div>

        <hr>
        <div>
            <p>设置value</p>
            <div>
                <Input value="hi input"></Input>
            </div>
        </div>

        <hr>
        <div>
            <p>disabled</p>
            <div>
                <Input value="hi input" disabled></Input>
            </div>
        </div>

        <hr>
        <div>
            <p>readonly</p>
            <div>
                <Input value="hi input" readonly></Input>
            </div>
        </div>


        <hr>
        <div>
            <p>error</p>
            <div>
                <Input value="hi input" error="something wrong"></Input>
            </div>
        </div>
    </div>
</template>

<script>
  import Input from './index';
  export default {
    name: "Example"
    ,components:{Input}
    ,methods:{
      handleChange(e){
        console.log(e);
        alert('change');
      }
      ,handleInput(e){
        console.log(e);
        console.log('handleInput');
      }
    }
  }
</script>

<style lang="scss">

</style>
