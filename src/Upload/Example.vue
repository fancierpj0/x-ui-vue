<template>
    <div class="example">
        <h2>Upload Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        {{fileList}}
        <div>只能上传 300kb 以内的 png、jpeg文件</div>
        <Uploader accept="image/*" action="http://localhost:3000/upload" name="file" :fileList.sync="fileList" method="POST" :parse-response="parseResponse" v-on:update:fileList="yyy">
            <Button icon="upload">上传</Button>
        </Uploader>
    </div>
</template>

<script>
  import Uploader from "./index";
  import Button from "../Button";
  export default {
    name: "Example"
    ,components:{Uploader,Button}
    ,data () {
      return {
        fileList: []
      }
    }
    ,methods: {
      parseResponse (response) {
        let object = JSON.parse(response)
        let url = `http://127.0.0.1:3000/preview/${object.id}`
        return url
      }
      ,yyy (fileList) {
        console.log('监听到了 update:fileList 事件')
        // console.log('fileList')
        // console.log(fileList)
        // console.log('this.fileList')
        // console.log(this.fileList)
        // console.log('this.fileList.length')
        // console.log(this.fileList.length)
      }
    }
  }
</script>

<style lang="scss">

</style>
