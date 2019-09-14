<template>
    <div class="example">
        <h2>Form Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div>
                {{formData}}
                <Form @submit="onSubmit"
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

                    <form-item field="profile" label="">
                        <Textarea type="text" v-model="formData.profile" />
                    </form-item>

                    <form-item field="sex">
                        <radio-group v-model="formData.sex">
                            <radio value="0">女</radio>
                            <radio value="1">男</radio>
                        </radio-group>
                    </form-item>


                    <form-item field="friends">
                        {{formData.friends}}
                        <checkbox-group v-model="formData.friends">
                            <Checkbox value="0">月儿兰</Checkbox>
                            <Checkbox value="1">流沙</Checkbox>
                            <Checkbox value="2">苏海伦</Checkbox>
                        </checkbox-group>
                    </form-item>

                    <form-item field="open1">
                        <on-off v-model="formData.open1" size="large" :loading="loading1"></on-off>
                        <Button @click="loading1=!loading1">点击切换loading</Button>
                    </form-item>

                    <form-item field="open2">
                        <on-off v-model="formData.open2" on-text="开" off-text="关" :loading="loading2"></on-off>
                        <Button @click="loading2=!loading2">点击切换loading</Button>
                    </form-item>

                    <form-item>
                        <Button tag-type="button">提交</Button>
                    </form-item>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
  import Form from './index';
  import FormItem from './FormItem';
  import Input from '../Input';
  import Textarea from '../Textarea';
  import Radio from '../Radio';
  import RadioGroup from '../Radio/RadioGroup';
  import Checkbox from '../Checkbox';
  import CheckboxGroup from '../Checkbox/CheckboxGroup';
  import Button from '../Button';
  import OnOff from '../OnOff';

  const username = ['ahhh111','ahhh123','ahhh234'];
  const passwd = 123456;

  export default {
    name: "Example"
    ,components:{Form,FormItem,Input,Textarea,RadioGroup,Radio,Checkbox,CheckboxGroup,Button,OnOff}
    ,data(){
      return {
        formData:{
          username:''
          ,password:''
          ,profile:''
          ,sex:''
          ,friends:[]
          ,open1:true
          ,open2:false
        }
        ,rules:{
          username: [{validator:this.validate1,trigger:'blur'},{maxLength:7,message:'太长',trigger:'input'}]

          ,password:[{required:true,message:'必填',trigger:'blur'},{validator:this.validate2,trigger:'blur'},{minLength:6,message:'太短',trigger:'input'},{maxLength:10,message:'太长',trigger:'input'}]

          ,profile:[{required:true,message:'必填',trigger:'blur'},{minLength:20,message:'太短',trigger:'input'},{maxLength:25,message:'太长',trigger:'input'}]

          ,sex:[{required:true,message:'必选',trigger:'change'}]

          ,friends:[{required:true,message:'必选111',trigger:'change'}]
        }
        ,loading1:true
        ,loading2:false
      }
    }
    ,methods:{
      onSubmit(e){
        console.log('e:',e);
        console.log('准备提交')
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
