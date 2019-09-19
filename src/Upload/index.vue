<template>
    <div :class="uploadClass">
        <div :class="triggerClass" @click="onClickUpload" ref="trigger">
            <slot></slot>
        </div>

        <div ref="temp" style="width:0;height:0;overflow:hidden;"></div>
    </div>
</template>

<script>
  import Icon from '../Icon';
  import {FORM_EVENTBUS, UI_PREFIX, UPLOAD_SIZE_LIMIT} from "../constant";

  export default {
    name: "Upload"
    ,model:{
      prop:'fileList'
      ,event:'change'
    }
    ,inject:{
      [FORM_EVENTBUS]:{from:FORM_EVENTBUS,default:null}
      ,field:{from:'field', default: null}
    }
    ,components:{Icon}
    ,props:{
      name:{type:String,required:true}
      ,action:{type:String,required:true}
      ,method:{type:String,default:'POST'}
      ,parseResponse:{type:Function,required:true}
      ,fileList:{type:Array,default:()=>[]}
      ,sizeLimit:{type:Number,default:UPLOAD_SIZE_LIMIT}
      ,multiple:{type:Boolean,default:false}
      ,withCredentials:{type:Boolean,default:false}

      /*
        + 以 STOP 字符 (U+002E) 开始的文件扩展名 (例如：".jpg,.png,.doc")
        + 其它有效的MIME类型，但没有扩展名
        + HTML5的↓
            + audio/*
            + video/*
            + image/*

        多选可以用逗号隔开组成列表的形式
        https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#attr-accept
      */
      , accept: {type: String, default: 'image/*'}
    }
    ,data(){
      return {
        url:'about:blank'
      }
    }
    ,computed:{
      uploadClass(){
        return `${UI_PREFIX}upload`;
      }
      ,triggerClass(){
        return `${this.uploadClass}-trigger`;
      }
    }
    ,methods:{
      onClickUpload(){
        const input = this.createInput();

        const x = () => {
          //console.log('input.files:',input.files); //类数组
          /*
            FileList {0: File, length: 1}
                0: File
                    lastModified: 1556535486459
                    lastModifiedDate: Mon Apr 29 2019 18:58:06 GMT+0800 (中国标准时间) {}
                    name: "005Xk2Xogy1g1u9dsta2wj30rs111u0x.jpg"
                    size: 273739
                    type: "image/jpeg"
                    webkitRelativePath: ""
                    __proto__: File
                length: 1
                __proto__: FileList
          */

          this.uploadFiles(input.files);
          input.removeEventListener('change', x);
          input.remove();
        };
        input.addEventListener('change',x );
        input.click();
      }

      ,createInput(){
        this.$refs.temp.innerHTML = ''; //防止确认时一直点击取消导致input堆叠
        const input = document.createElement('input');
        input.accept = this.accept;
        input.type = 'file';
        input.multiple = this.multiple; // 置为true后，可以按住ctrl连选
        this.$refs.temp.appendChild(input);
        return input;
      }

      ,uploadFiles(files){
        const newNames = [];
        for(let i=0;i<files.length;++i){
          newNames[i] = this.generateName(files[i].name);
        }

        if(!this.beforeUpdates(files,newNames)) return;

        for(let i=0;i<files.length;++i){
          const newName = newNames[i];
          //事件是同步的，但组件渲染是异步的
          //父组件虽然能马上拿到新的fileList，但是子组件要在重新接受props(UI重新渲染时)时才会更新

          const formData = new FormData();
          formData.append(this.name,files[i]); // 二进制文件需要进过formData包装一下才能上传，就想传统的form表单提交需要将属性enctype置为multipart/form一样
          this.doUploadFile(formData,(response)=>{
            const url = this.parseResponse(response); // 上传图片保存位置所对应的url
            this.url = url;
            this.afterUploadFile(newName,url); //  去掉菊花 && this.$emit('update:fileList', fileListCopy);
          },(xhr)=>{
            this.uploadError(xhr,newName)
          })
        }
      }

      /*
        如果存在该文件名则加上(1)
        否则返回原名
      */
      ,generateName(name){
        while (this.fileList.filter(f => f.name === name).length > 0) {
          const dotIndex = name.lastIndexOf('.');
          const nameWithoutExtension = name.substring(0, dotIndex);
          const extension = name.substring(dotIndex);
          name = nameWithoutExtension + '(1)' + extension;
        }
        return name;
      }

      /*
        校验文件大小
        this.$emit('error', '文件大于2MB');
        更新fileList
        this.$emit('update:fileList',[...this.fileList,...x]);
      */
      ,beforeUpdates(files,newNames){
        files = Array.from(files);

        //check sizeLimit
        for(let i=0;i<files.length;++i){
          if (files[i].size > this.sizeLimit) {
            this.$emit('error', '文件大于2MB');
            return false;
          }
        }

        //update:fileList
        const r = files.map((file, i) => {
          const {type, size} = file;
          return {name: newNames[i], type, size, status: 'uploading'};
        });
        this.$emit('update:fileList',[...this.fileList,...r]);
        this.$emit('change',[...this.fileList,...r]); // 支持v-model
        return true;
      }

      //ajaxRequest↓
      ,doUploadFile(formData,success,fail){
        const xhr = new XMLHttpRequest();
        xhr.open(this.method.toLowerCase(), this.action, true); // 默认即为 true
        this.withCredentials && (xhr.withCredentials = true);

        xhr.onload = ()=>{ //xhr.readyState = 4时 数据全部回来后
          success && success(xhr.response); // xhr.response
        };
        xhr.onerror = () => {
          fail && fail(xhr);
        };
        //https://developer.mozilla.org/zh-CN/docs/Web/Events/%E8%BF%9B%E5%BA%A6%E6%9D%A1
        xhr.onprogress = (ev) => {
          this.$emit('progress', ev.loaded / ev.total);
        };

        xhr.send(formData);
      }

      /*
        fileList里的fileObj会多出一个url属性(上传图片保存位置所对应的url)
        以及将status置为success
        发射一个uploaded上传完毕事件(注意如果是多文件上传，uploaded只表示该次上传完毕)
      */
      ,afterUploadFile(newName,url){
        const fileObj = this.fileList.filter(f => f.name === newName)[0]; // {name: newNames[i], type, size, status: 'uploading'}
        const index = this.fileList.indexOf(fileObj);
        const copy = JSON.parse(JSON.stringify(fileObj));
        copy.url = url;
        copy.status = 'success';
        const fileListCopy = [...this.fileList];
        fileListCopy.splice(index, 1, copy);
        this.$emit('update:fileList', fileListCopy);
        this.$emit('change', fileListCopy); // 支持v-model
        this.$emit('uploaded');
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
      }

      ,uploadError(xhr,newName){
        const fileObj = this.fileList.filter(f => f.name === newName)[0];
        const index = this.fileList.indexOf(fileObj);
        const copy = JSON.parse(JSON.stringify(fileObj));
        copy.status = 'fail';
        const fileListCopy = [...this.fileList];
        fileListCopy.splice(index, 1, copy);
        this.$emit('update:fileList', fileListCopy);
        this.$emit('change', fileListCopy); // 支持v-model
        this.$emit('error',xhr);  // 在请求完成前，status的值为0。值得注意的是，如果 XMLHttpRequest 出错，浏览器返回的 status 也为0 ← 网络无法连接
        this[FORM_EVENTBUS] && this[FORM_EVENTBUS].$emit(`update:formItem`, this.field, 'change');
      }
    }
  }
</script>

<style lang="scss">
@import '../var';
@import '../animation';
.#{$ui-prefix}upload{
  display: inline-block;
  vertical-align: middle;
  &-trigger{}
}
</style>
