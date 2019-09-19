<template>
    <div class="example">
        <h2>Form Example</h2>

        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p></p>
            <div style="width:320px;">
                {{formData}}
                <Form @submit="onSubmit"
                    :formData="formData"
                    :rules="rules"
                >
                    <form-item field="selectValue" label="城市" :label-width="labelWidth">
                        <Select v-model="formData.selectValue" size="large">
                            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </form-item>

                    <form-item field="cascaderValue" label="city" :label-width="labelWidth">
                        <Cascader :source.sync="cascaderSource" v-model="formData.cascaderValue" :load-data="loadData" popoverHeight="200px" size="large"></Cascader>
                    </form-item>

                    <form-item field="d" label="日期" :label-width="labelWidth">
                        <Datepicker v-model="formData.d" :scope="scope" :style="{width:'200px'}"></Datepicker>
                    </form-item>

                    <form-item field="fileList" label="avatar" :label-width="labelWidth">
                        <Upload accept="image/*" action="http://localhost:3000/upload" name="file" v-model="formData.fileList" method="POST" :parse-response="parseResponse">
                            <Button icon="upload">上传</Button>
                        </Upload>
                    </form-item>

                    <!--
                        ahhh123 -> errors (2) ["名字重复咯~~", "太长"]
                        会显示  名字重复咯~~
                        Promise.all 返回的结果的顺序是按照 Promise.all(p1,p2,p3) 传递的顺序(而不是先完成的排前面)
                        :rules="[{validator:validate1},{maxLength:7,message:'太长'}]"
                        :rules="{blur:[{required:true,message:'必填'},{validator:validate2}],input:[{minLength:6,message:'太短'},{maxLength:10,message:'太长'}]}"
                    -->
                    <form-item field="username" label="用户名" :label-width="labelWidth">
                        <Input type="text" v-model="formData.username" />
                    </form-item>

                    <form-item field="password" label="密码" :label-width="labelWidth">
                        <Input type="text" v-model="formData.password" size="large"/>
                    </form-item>

                    <form-item field="profile" label="介绍" :label-width="labelWidth">
                        <Textarea type="text" v-model="formData.profile" size="large" />
                    </form-item>

                    <form-item field="sex" label="sex" :label-width="labelWidth">
                        <radio-group v-model="formData.sex">
                            <radio value="0">女</radio>
                            <radio value="1">男</radio>
                        </radio-group>
                    </form-item>


                    <form-item field="friends" label="朋友们" :label-width="labelWidth">
                        {{formData.friends}}
                        <checkbox-group v-model="formData.friends">
                            <Checkbox value="0">月儿兰</Checkbox>
                            <Checkbox value="1">流沙</Checkbox>
                            <Checkbox value="2">苏海伦</Checkbox>
                        </checkbox-group>
                    </form-item>

                    <form-item field="open1" label="开关1" :label-width="labelWidth">
                        <on-off v-model="formData.open1" size="large" :loading="loading1"></on-off>
                        <Button @click="loading1=!loading1" size="small">点击切换loading</Button>
                    </form-item>

                    <form-item field="open2" label="开关2" :label-width="labelWidth">
                        <on-off v-model="formData.open2" on-text="开" off-text="关" :loading="loading2"></on-off>
                        <Button @click="loading2=!loading2" size="small">点击切换loading</Button>
                    </form-item>


                    <form-item :label-width="labelWidth">
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
  import Select from '../Select';
  import Option from '../Select/Option';
  import Cascader from '../Cascader';
  import Datepicker from '../Datepicker';
  import Upload from '../Upload';

  import db from '../db';

  const username = ['ahhh111','ahhh123','ahhh234'];
  const passwd = 123456;

  function ajaxRequest(pid = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result = db.filter((item) => item.parent_id === pid);
        result.forEach(node => {
          node.isLeaf = db.filter(item => item.parent_id === node.id).length <= 0;
        });
        resolve(result);
      }, 2000);
    });
  }

  export default {
    name: "Example"
    ,components:{Form,FormItem,Input,Textarea,RadioGroup,Radio,Checkbox,CheckboxGroup,Button,OnOff,Select,Option,Cascader,Datepicker,Upload}
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
          ,selectValue:''
          ,cascaderValue:[]
          ,d:new Date()
          ,fileList:[]
        }
        ,rules:{
          username: [{validator:this.validate1,trigger:'blur'},{maxLength:7,message:'太长',trigger:'input'}]

          ,password:[{required:true,message:'必填',trigger:'blur'},{validator:this.validate2,trigger:'blur'},{minLength:6,message:'太短',trigger:'input'},{maxLength:10,message:'太长',trigger:'input'}]

          ,profile:[{required:true,message:'必填',trigger:'blur'},{minLength:20,message:'太短',trigger:'input'},{maxLength:25,message:'太长',trigger:'input'}]

          ,sex:[{required:true,message:'必选',trigger:'change'}]

          ,friends:[{required:true,message:'必选111',trigger:'change'}]

          ,selectValue:[{required:true,message:'必选222',trigger:'change'}]
          ,cascaderValue:[{required:true,message:'必选333',trigger:'change'}]
          ,d:[{required:true,message:'必选444',trigger:'change'}]
          ,fileList:[{required:true,message:'必选555',trigger:'change'}]
        }
        ,loading1:true
        ,loading2:false
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
        ,cascaderSource:[]
        ,scope:[new Date(2000,1),new Date(2019,12)]
        ,labelWidth:'80px'
      }
    }
    , created() {
      //↓级联
      //动态需要加上
      ajaxRequest(0).then((result) => {
        this.cascaderSource = result;
      });
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
      ,loadData(node, callback) {
        let {name, id, parent_id} = node;
        ajaxRequest(id).then(result => {
          if (result.length > 0) callback(result); //this.$emit('update:source', copy);
        });
      }
      ,parseResponse (response) {
        let object = JSON.parse(response)
        let url = `http://127.0.0.1:3000/preview/${object.id}`
        return url
      }
    }
  }
</script>

<style lang="scss">

</style>
