import {UI_PREFIX} from "../constant";
import Icon from '../Icon';
import './index.scss'

export default {
  name: 'Button'
  ,functional:true
  , props: {
    icon:{type:String}
    ,loading:{type:Boolean,default: false}
    ,iconPosition:{type:String,default:'left',validator(value) {return (value === 'left' || value === 'right');}
    }
    ,tagType:{type:String,default:'a'}
  }
  ,render(h,{props,children,data:{attrs,class:preClassName,on,nativeOn,style},listeners}){
    const {tagType,loading,icon,iconPosition} = props;

    let buttonClassName = `${UI_PREFIX}button`;
    iconPosition==='right' && (buttonClassName = buttonClassName + ' iconRight');

    const iconClassName = loading ? `${UI_PREFIX}button-icon ${UI_PREFIX}button-iconLoading` : `${UI_PREFIX}button-icon`;

    const iconName = loading ? 'loading' : icon;
    return (
      <tagType class={[buttonClassName,preClassName]} {...{attrs}} {...{on:{...on,...nativeOn}}} {...{style}}>
        {icon && <Icon name={iconName} class={iconClassName}></Icon>}
        <span class={`${UI_PREFIX}button-content`}>{children}</span>
      </tagType>
    );
  }
}
