<template>
  <div id="app">
    <Layout class="page-wrapper">
      <Header class="page-wrapper-header">
        <h2>
          x-ui
        </h2>
        <Button @click="toggleSider">X</Button>
      </Header>
      <Layout class="page-wrapper-l">
        <Sider class="page-wrapper-l-sider" :visible="siderVisible" width="200px" :out-cb="updateScrollContainerWrapper" :in-cb="updateScrollContainerWrapper">
          <Scroll>
            <Nav :selected.sync="navSelected" vertical open-all class="page-wrapper-l-sider-nav">
              <nav-item name="installation">安装</nav-item>
              <nav-item name="getStarted">快速上手</nav-item>
              <!-- component -->
              <sub-nav name="component">
                <template slot="title">组件</template>
                <!--基础-->
                <sub-nav name="base">
                  <template slot="title">基础</template>
                  <nav-item name="icon">
                    <router-link to="/icon">Icon</router-link>
                  </nav-item>
                  <nav-item name="button">
                    <router-link to="/button">Button</router-link>
                  </nav-item>
                </sub-nav>
                <!--布局-->
                <sub-nav name="layout">
                  <template slot="title">布局</template>
                  <nav-item name="grid">
                    <router-link to="/grid">Grid</router-link>
                  </nav-item>
                  <nav-item name="layout">
                    <router-link to="/layout">Layout</router-link>
                  </nav-item>
                  <nav-item name="sticky">
                    <router-link to="/sticky">Sticky</router-link>
                  </nav-item>
                  <nav-item name="scroll">
                    <router-link to="/scroll">Scroll</router-link>
                  </nav-item>
                </sub-nav>
                <!--导航-->
                <sub-nav name="nav">
                  <template slot="title">导航</template>
                  <nav-item name="tab">
                    <router-link to="/tab">Tab</router-link>
                  </nav-item>
                  <nav-item name="nav">
                    <router-link to="/nav">Nav</router-link>
                  </nav-item>
                  <nav-item name="pager">
                    <router-link to="/pager">Pager</router-link>
                  </nav-item>
                </sub-nav>
                <!--反馈-->
                <sub-nav name="feedback">
                  <template slot="title">反馈</template>
                  <nav-item name="toast">
                    <router-link to="/toast">Toast</router-link>
                  </nav-item>
                  <nav-item name="popover">
                    <router-link to="/popover">Popover</router-link>
                  </nav-item>
                </sub-nav>
                <!--数据录入-->
                <sub-nav name="dataInput">
                  <template slot="title">数据录入</template>
                  <nav-item name="input">
                    <router-link to="/input">Input</router-link>
                  </nav-item>
                  <nav-item name="textarea">
                    <router-link to="/textarea">Textarea</router-link>
                  </nav-item>
                  <nav-item name="radio">
                    <router-link to="/radio">Radio</router-link>
                  </nav-item>
                    <nav-item name="checkbox">
                        <router-link to="/checkbox">Checkbox</router-link>
                    </nav-item>
                  <nav-item name="form">
                    <router-link to="/form">Form</router-link>
                  </nav-item>
                </sub-nav>
                <!--数据展示-->
                <sub-nav name="dataOutput">
                  <template slot="title">数据展示</template>
                  <nav-item name="collapse">
                    <router-link to="/collapse">Collapse</router-link>
                  </nav-item>
                  <nav-item name="slide">
                    <router-link to="/slide">Slide</router-link>
                  </nav-item>
                  <nav-item name="cascader">
                    <router-link to="/cascader">Cascader</router-link>
                  </nav-item>
                  <nav-item name="table">
                    <router-link to="/table">Table</router-link>
                  </nav-item>
                </sub-nav>
              </sub-nav>
            </Nav>
          </Scroll>
        </Sider>
        <Content class="page-wrapper-l-content">
          <Scroll>
            <!-- key没用？？ -->
            <router-view :key="a"/>
          </Scroll>
        </Content>
      </Layout>
      <Footer class="page-wrapper-footer">&copy;Code and Designed By Cris</Footer>
    </Layout>
  </div>

  <!--<div id="app">
    <StickyExample></StickyExample>
  </div>-->
</template>

<script>
  import Layout from './Layout/Layout'
  import Header from './Layout/Header';
  import Footer from './Layout/Footer';
  import Content from './Layout/Content';
  import Sider from './Layout/Sider';
  import Nav from './Nav';
  import NavItem from './Nav/NavItem';
  import SubNav from './Nav/SubNav';
  import Button from './Button';
  import Scroll from './Scroll';
  import Popover from './Popover';
  import StickyExample from './Sticky/Example';

  import Vue from 'vue';
  import {LAYOUT_EVENTBUS} from './constant';

  export default {
    name:'App'
    ,components:{Layout,Header,Footer,Content,Sider,Nav,NavItem,SubNav,Button,Scroll,Popover,StickyExample}
    ,data(){
      return {
        navSelected:[]
        ,navData:[

        ]
        ,siderVisible:true
        ,[LAYOUT_EVENTBUS]: new Vue()
      }
    }
    ,provide(){
      return {
        [LAYOUT_EVENTBUS]: this[LAYOUT_EVENTBUS]
      }
    }
    ,computed:{
      a(){
        console.log(this.$route.name);
        return this.$route.name;
      }
    }
    ,methods:{
      toggleSider(){
        this.siderVisible = !this.siderVisible;
      }
      ,updateScrollContainerWrapper(){
        this[LAYOUT_EVENTBUS].$emit('update:scrollContainerWrapper');
      }
    }
  }
</script>

<style lang="scss">
@import './var';
$headerHeight:64px;
$footerHeight:21px;

#app {
  text-align: center;
  color: $color;
  font-size: $font-size;
  line-height: $line-height;
}

.page-wrapper{
  &-header{
    box-sizing: border-box;
    border-bottom: 1px solid $grey;
    height:64px;
    display: flex;
    align-items: center;
    h2{
      width:201px;
    }
  }

  &-l{
    height:calc(100vh - #{$headerHeight} - #{$footerHeight});
    &-sider{
      &-nav{
        border-left:none !important;
        border-top:none !important;
        border-bottom:none !important;

        .#{$ui-prefix}nav-navItem{
          a{display:block;}
        }
      }
    }
    &-content{
    }
  }

  &-footer{
    box-sizing: border-box;
    border-top:1px solid $grey;
    height:$footerHeight - 1px;
  }
}

/*&.router-link-exact-active {

}*/
</style>
