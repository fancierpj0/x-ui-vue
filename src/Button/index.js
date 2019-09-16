import {UI_PREFIX} from "../constant";
import Icon from '../Icon';
import './index.scss'

export default {
  name: 'Button'
  ,inject:{
    buttonGroupSize:{from:'buttonGroupSize',default:null}
  }
  , props: {
    icon:{type:String}
    ,loading:{type:Boolean,default: false}
    ,iconPosition:{type:String,default:'left',validator(value) {return (value === 'left' || value === 'right');}
    }
    ,tagType:{type:String,default:'a'}
    ,size:{type:String,default:'default'}
  }

  ,render(h){  // 函数式组件里的context.listeners 是 context.data.on 的一个别名，但是这里的data.on却貌似和nativeOn相同 ... emmm....
    const {tagType,loading,icon,iconPosition,size,buttonGroupSize,$listeners,$slots:{default:children},$vnode:{data:{class:/*preClass,on,*/nativeOn,style,attrs}}} = this;
    // console.log('children:',children); // $children在这里貌似无效，只能通过$slots.default获取children，emmm....

    const buttonClassName = [`${UI_PREFIX}button`, {
      small: (buttonGroupSize||size) === "small"
      , large: (buttonGroupSize||size) === "large"
      , iconRight: iconPosition === 'right'
      , iconOnly: !children
    }]; // 不用把preClass加进来...vue会自动加入(不论是否是v-bind:class=还是直接class=)...emmm...

    const iconClassName = [`${UI_PREFIX}button-icon`, {[`${UI_PREFIX}button-iconLoading`]: loading}];

    const iconName = loading ? 'loading' : icon;

    return (
      <tagType class={buttonClassName} {...{attrs}} {...{on:{...$listeners,...nativeOn}}} {...{style}} tabindex="0">
        {icon && <Icon name={iconName} class={iconClassName}></Icon>}
        <span class={`${UI_PREFIX}button-content`}>{children}</span>
      </tagType>
    );
  }
}
