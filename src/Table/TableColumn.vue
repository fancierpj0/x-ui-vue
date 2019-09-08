<template>
    <div>
        <!--用不到，只是一个相当于一个接受参数的工具人，嗯...没毛病-->
    </div>
</template>

<script>
  export default {
    name: "table-column"
    ,props:{
      text:{
        type:String
        ,required:true
      }
      ,field:{
        type:String
        // ,required:true // 可能是操作列 无需field
      }
      ,width:{
        type:[Number,String]
      }
    }
  }
</script>
