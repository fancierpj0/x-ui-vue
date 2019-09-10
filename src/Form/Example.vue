<template>
    <div class="example">
        <h2>Form Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div>
                {{formData}}
                <Form @submit.native="onSubmit"
                    :formData="formData"
                    :rules="rules"
                >

                    <!--
                        ahhh123 -> errors (2) ["名字重复咯~~", "太长"]
                        会显示  名字重复咯~~
                        Promise.all 返回的结果的顺序是按照 Promise.all(p1,p2,p3) 传递的顺序(而不是先完成的排前面)
                        :rules="[{validator:validate1},{maxLength:7,message:'太长'}]"
                        :rules="{blur:[{required:true,message:'必填'},{validator:validate2}],input:[{minLength:6,message:'太短'},{maxLength:10,message:'太长'}]}"
                    -->
                    <form-item field="username" label=""  >
                        <Input type="text" v-model="formData.username" />
                    </form-item>

                    <form-item field="password" label="">
                        <Input type="text" v-model="formData.password" />
                    </form-item>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
  import Form from './Form';
  import FormItem from './FormItem';
  import Input from '../Input';

  const username = ['ahhh111','ahhh123','ahhh234'];
  const passwd = 123456;

  export default {
    name: "Example"
    ,components:{Form,FormItem,Input}
    ,data(){
      return {
        formData:{
          username:''
          ,password:''
          ,age:''
        }
        ,rules:{
          username: [{validator:this.validate1,trigger:'blur'},{maxLength:7,message:'太长',trigger:'input'}]
          ,password:[{required:true,message:'必填',trigger:'blur'},{validator:this.validate2,trigger:'blur'},{minLength:6,message:'太短',trigger:'input'},{maxLength:10,message:'太长',trigger:'input'}]
        }
      }
    }
    ,methods:{
      onSubmit(e){
        e.preventDefault();
        console.log(e);
      }
      ,validate1(value){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (username.includes(value)) {
              reject('名字重复咯~~')
            } else {
              resolve()
            }
          }, 2000);
        });
      }
      ,validate2(value){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (passwd==value) {
              resolve()
            } else {
              reject('密码不正确~~')
            }
          }, 2000);
        });
      }
    }
  }
</script>

<style lang="scss">

</style>
