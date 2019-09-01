import {mount,shallowMount} from "@vue/test-utils";
import Toast from '../index';

describe('Toast 组件', () => {
  it('存在', () => {
    const wrapper = shallowMount(Toast);
    expect(wrapper.exists()).toBe(true);
  });

  it('可自定义通知信息', () => {
    /*let x = <div class="xxx">hi 我是自定义的通知信息</div>; // h is not defined
    const wrapper = shallowMount(Toast,{
      slots:{
        default:[x]
      }
    });*/
    const wrapper = shallowMount(Toast,{
      slots:{
        default:['这是自定义的通知信息']
      }
    });
    expect(wrapper.find(`[data-test=message]`).text()).toBe('这是自定义的通知信息');
  });

  describe('接受autoWidth', () => {
    it('默认值为false', () => {
      const wrapper = shallowMount(Toast);
      expect(wrapper.find(`[data-test=toast]`).classes('autoWidth')).not.toBe(true);
    });

    it('值可以是true', () => {
      const wrapper = shallowMount(Toast,{
        propsData:{
          autoWidth:true
        }
      });
      expect(wrapper.find(`[data-test=toast]`).classes('autoWidth')).toBe(true);
    });
  });

  describe('接受position', () => {
    it('初始值为top', () => {
      const wrapper = shallowMount(Toast);
      expect(wrapper.props('position')).toBe('top');
      expect(wrapper.classes('position-top')).toBe(true);
    });

    it('值可以是middle', () => {
      const wrapper = shallowMount(Toast,{
        propsData:{
          position:'middle'
        }
      });
      expect(wrapper.props('position')).toBe('middle');
      expect(wrapper.classes('position-middle')).toBe(true);
    });

    it('值可以是bottom', () => {
      const wrapper = shallowMount(Toast,{
        propsData:{
          position:'bottom'
        }
      });
      expect(wrapper.props('position')).toBe('bottom');
      expect(wrapper.classes('position-bottom')).toBe(true);
    });
  });

  describe('接受closeButton', () => {
    it(`默认值为{text:'关闭',callback:()=>{}}`, (done) => {
      const wrapper = shallowMount(Toast);
      // expect(wrapper.props('closeButton')).toEqual({text:'关闭',callback:()=>{}})  //Compared values have no visual difference.
      const cb = wrapper.props('closeButton').callback;
      const text = wrapper.props('closeButton').text;
      expect(cb.toLocaleString()).toBe('() => {}');
      expect(text).toBe('关闭');
      wrapper.find(`[data-test=closeButton]`).trigger('click');
      // expect(cb.called).toBe(true);
      setTimeout(() => {
        expect(wrapper.emitted().close.length).toBe(1);
        expect(wrapper.vm.$el.__vue__).toBeNull();
        done();
      })
    });

    it(`是一个对象，text是文本，callback是函数`,(done)=>{
      const func = jest.fn();
      const wrapper = shallowMount(Toast,{
        propsData:{
          closeButton:{
            text:'关闭22'
            ,callback:func
          }
        }
      });
      expect(wrapper.props('closeButton')).toEqual({text:'关闭22',callback:func});  //Compared values have no visual difference.
      wrapper.find(`[data-test=closeButton]`).trigger('click');
      expect(func).toBeCalled();
      setTimeout(()=>{
        expect(wrapper.emitted().close.length).toBe(1);
        expect(wrapper.vm.$el.__vue__).toBeNull();
        done();
      })
    })

    //TODO 集成测试中测试 在传递的回调中使用this.cancel = true 来反悔关闭
  });

  describe('接受autoClose', () => {
    it('默认值为 5000', () => {
      jest.useFakeTimers();
      const wrapper = shallowMount(Toast);
      jest.advanceTimersByTime(5000);
      // jest.runTimersToTime(5000);
      expect(wrapper.emitted().close.length).toBe(1);
      expect(wrapper.vm.$el.__vue__).toBeNull();
      jest.useRealTimers();
    });

    it('值可以是一个数值', () => {
      jest.useFakeTimers();
      const wrapper = shallowMount(Toast, {
        propsData: {
          autoClose: 2000
        }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.emitted().close).toBe(undefined);
      expect(wrapper.vm.$el.__vue__).not.toBeNull();
      jest.advanceTimersByTime(1000); //2000后才会关闭
      expect(wrapper.emitted().close.length).toBe(1);
      expect(wrapper.vm.$el.__vue__).toBeNull();
      jest.useRealTimers();
    });

    it('值可以是false',()=>{
      jest.useFakeTimers();
      const wrapper = shallowMount(Toast,{
        propsData:{
          autoClose:false
        }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.emitted().close).toBe(undefined);
      expect(wrapper.vm.$el.__vue__).not.toBeNull();
      jest.advanceTimersByTime(10000); //不会关闭
      expect(wrapper.emitted().close).toBe(undefined);
      expect(wrapper.vm.$el.__vue__).not.toBeNull();
      jest.useRealTimers();
    })
  });
});
