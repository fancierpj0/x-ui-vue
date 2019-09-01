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
  ,render(h,{props:{name},data:{attrs,class:preClassName,on,nativeOn,style}}){
    return (
      <svg class={[`${UI_PREFIX}icon`,preClassName]} {...{on:{...on,...nativeOn}}} {...{attrs}} {...{style}}>
        <use {...{attrs:{'xlink:href': `#i-${name}`}}}></use>
      </svg>
    );
  }
}
