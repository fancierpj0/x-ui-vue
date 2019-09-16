import {UI_PREFIX} from "../constant";
import './svg';
import './index.scss'

export default {
  name: 'Icon'
  ,functional:true
  ,props:{
    name:{
      type:String
      ,required:true
    }
  }
  //函数式组件里on的确是on，但非函数式组件里on貌似和nativeOn是一样的，要取$listeners才是我们想要的on
  ,render(h,{props:{name},data:{attrs,class:preClassName,on,nativeOn,style}}){
    return (
      <svg class={[`${UI_PREFIX}icon`,preClassName]} {...{on:{...on,...nativeOn}}} {...{attrs}} {...{style}}>
        <use {...{attrs:{'xlink:href': `#i-${name}`}}}></use>
      </svg>
    );
  }
}
