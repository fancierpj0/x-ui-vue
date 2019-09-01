import {shallowMount} from "@vue/test-utils";
import Icon from '../index';

describe('Icon 组件', () => {

  it('存在', () => {
    const wrapper = shallowMount(Icon);
    expect(wrapper.exists()).toBe(true);
  });

  it('通过接受的name属性 来决定 使用哪个svg', () => {
    const wrapper = shallowMount(Icon, {
      propsData: {
        name: 'loading'
      }
      /*context:{
        props:{
          name: 'loading'
        }
      }*/
    });

    const useElement = wrapper.find('use');
    expect(useElement.attributes()['href']).toBe('#i-loading');
  });

  it('可绑定各种事件', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    const wrapper = shallowMount(Icon,{
      listeners:{
        'click':func1
        ,'mouseenter':func2
      }
    });

    wrapper.trigger('click');
    expect(func1).toBeCalled();
    wrapper.trigger('mouseenter');
    expect(func2).toBeCalled();
  });

  it('可绑定native事件', () => {

  });
});
