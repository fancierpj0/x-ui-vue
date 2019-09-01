import Vue from 'vue'
import Router from 'vue-router'
import IconExample from './Icon/Example'
import ButtonExample from './Button/Example'
import GridExample from './Grid/Example'
import LayoutExample from './Layout/Example'
import InputExample from './Input/Example'
import ToastExample from './Toast/Example'
import PopoverExample from './Popover/Example'
import TabExample from './Tab/Example'
import CollapseExample from './Collapse/Example'
import NavExample from './Nav/Example'
import SlideExample from './Slide/Example'
import CascaderExample from './Cascader/Example'
import PagerExample from './Pager/Example'
import StickyExample from './Sticky/Example'
import ScrollExample from './Scroll/Example'


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/icon', name: 'icon', component: IconExample}
    ,{path: '/button', name: 'button', component: ButtonExample}
    ,{path: '/grid', name: 'grid', component: GridExample}
    ,{path: '/layout', name: 'layout', component: LayoutExample}
    ,{path: '/input', name: 'input', component: InputExample}
    ,{path: '/toast', name: 'toast', component: ToastExample}
    ,{path: '/popover', name: 'popover', component: PopoverExample}
    ,{path: '/tab', name: 'tab', component: TabExample}
    ,{path: '/collapse', name: 'collapse', component: CollapseExample}
    ,{path: '/nav', name: 'nav', component: NavExample}
    ,{path: '/slide', name: 'slide', component: SlideExample}
    ,{path: '/cascader', name: 'cascader', component: CascaderExample}
    ,{path: '/pager', name: 'pager', component: PagerExample}
    ,{path: '/sticky', name: 'sticky', component: StickyExample}
    ,{path: '/scroll', name: 'scroll', component: ScrollExample}
  ]
})
