<template>
    <div class="example">
        <h2>Button Example</h2>
        <div style="height:1em;background: #4a90e2;"></div>

        <hr>
        <div>
            <p>horizontal</p>
            <div>
                {{selectedNav1}}
                <Nav :selected.sync="selectedNav1" @update:selected="onChange">
                    <nav-item name="home">首页</nav-item>
                    <sub-nav name="about">
                        <template slot="title">关于</template>
                        <nav-item name="culture">企业文化</nav-item>
                        <nav-item name="developers">开发团队</nav-item>
                        <sub-nav name="contacts">
                            <template slot="title">联系方式</template>
                            <nav-item name="wechat">微信</nav-item>
                            <nav-item name="qq">QQ</nav-item>
                            <sub-nav name="phone">
                                <template slot="title">手机</template>
                                <nav-item name="cm">移动</nav-item>
                                <nav-item name="cu">联通</nav-item>
                                <nav-item name="cn">电信</nav-item>
                            </sub-nav>
                        </sub-nav>
                    </sub-nav>
                    <nav-item name="hire">招聘</nav-item>
                </Nav>
            </div>
        </div>

        <div>
            <p>vertical</p>
            <div>
                {{selectedNav2}}
                <Nav :selected.sync="selectedNav2" vertical style="width:200px;margin-top:200px;min-height:500px;">
                    <nav-item name="home">首页</nav-item>
                    <sub-nav name="about">
                        <template slot="title">关于</template>
                        <nav-item name="culture">企业文化</nav-item>
                        <nav-item name="developers">开发团队</nav-item>
                        <sub-nav name="contacts">
                            <template slot="title">联系方式</template>
                            <nav-item name="wechat">微信</nav-item>
                            <nav-item name="qq">QQ</nav-item>
                            <sub-nav name="phone">
                                <template slot="title">手机</template>
                                <nav-item name="cm">移动</nav-item>
                                <nav-item name="cu">联通</nav-item>
                                <nav-item name="cn">电信</nav-item>
                            </sub-nav>
                        </sub-nav>
                    </sub-nav>
                    <nav-item name="hire">招聘</nav-item>
                    <sub-nav name="phone">
                        <template slot="title">手机</template>
                        <nav-item name="cm">移动</nav-item>
                        <nav-item name="cu">联通</nav-item>
                        <nav-item name="cn">电信</nav-item>
                    </sub-nav>
                </Nav>
            </div>
        </div>
    </div>
</template>

<script>
  import Nav from './index';
  import NavItem from './NavItem';
  import SubNav from './SubNav';
  export default {
    name: "Example"
    ,components:{Nav,NavItem,SubNav}
    ,data(){
      return{
        selectedNav1: []
        ,selectedNav2: []
      }
    }
    ,methods:{
      onChange(){
        console.log('change');
      }
    }
  }
</script>

<style lang="scss">

</style>
