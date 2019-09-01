<template>
    <div class="example">
        <h2>Layout Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>案例一</p>
            <div style="height:400px;">
                <Layout style="height:100%;">
                    <Header>header</Header>
                    <Layout>
                        <Sider>sider</Sider>
                        <Content>content</Content>
                    </Layout>
                    <Footer>footer</Footer>
                </Layout>
            </div>
        </div>

        <hr>
        <div>
            <p>案例二</p>
            <div style="height:400px;">
                <Layout style="height:100%;">
                    <Sider>sider</Sider>
                    <Layout>
                        <Header>header</Header>
                        <Content>content</Content>
                        <Footer>footer</Footer>
                    </Layout>
                </Layout>
            </div>
        </div>
    </div>
</template>

<script>
  import Layout from './Layout';
  import Header from './Header';
  import Content from './Content';
  import Footer from './Footer';
  import Sider from './Sider';
  export default {
    name: "Example"
    ,components:{Layout,Header,Content,Footer,Sider}
  }
</script>

<style lang="scss">
@import "../var";

.example{
    .#{$ui-prefix}header{background:lightgray;}
    .#{$ui-prefix}content{background:lightblue;}
    .#{$ui-prefix}footer{background:lightgray;}
    .#{$ui-prefix}sider{
        text-align:left;
        width:100px;
        background:lightcoral;
    }
}
</style>
