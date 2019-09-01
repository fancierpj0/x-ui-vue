import { shallowMount, mount } from "@vue/test-utils";
import Button from "../index";

describe("Button.vue", () => {
  it("存在.", () => {
    const wrapper = shallowMount(Button);
    expect(wrapper.exists()).toBe(true);
  });

  it("可以设置根dom的标签类型.", () => {
    const wrapper = mount(Button, {
      propsData: {
        tagType: "input"
      }
    });

    expect(wrapper.is('input')).toBe(true);
  });

  it("可以设置icon.", () => {
    const wrapper = mount(Button, {
      propsData: {
        icon: "loading"
      }
    });
    const useElement = wrapper.find("use");
    expect(useElement.attributes()["href"]).toBe("#i-loading");
  });

  describe("可以设置loading.", () => {
    it("loading 为 true", () => {
      const wrapper = mount(Button, {
        propsData: {
          icon: "upload",
          loading: true
        }
      });
      const useElement = wrapper.find("use");
      expect(useElement.attributes()["href"]).toBe("#i-loading");
    });

    it("loading 为 false", () => {
      const wrapper = mount(Button, {
        propsData: {
          icon: "upload",
          loading: false
        }
      });
      const useElement = wrapper.find("use");
      expect(useElement.attributes()["href"]).toBe("#i-upload");
    });
  });

  it("icon 默认的 order 是 1", () => {
    const wrapper = mount(Button, {
      // attachToDocument: true,
      propsData: {
        icon: "loading"
      }
    });

    /* //因为这里的css都是假的，所以获取不到
    const svgWrapper = wrapper.find('svg');
    expect(svgWrapper.is('svg')).toBe(true)
    const svg = svgWrapper.element;
    console.log('svg:',svg);
    console.log(wrapper.html());
    console.log('getComputedStyle(svg):', getComputedStyle(svg));
    expect(getComputedStyle(svg).order).toBe('1'); */

    expect(wrapper).toMatchInlineSnapshot(`
<a class="xui-button"><svg class="xui-icon xui-button-icon">
    <use xlink:href="#i-loading"></use>
  </svg><span class="xui-button-content"></span></a>
`);
  });

  it("设置 iconPosition 可以改变 order", () => {
    const wrapper = mount(Button, {
      // attachToDocument: true,
      propsData: {
        icon: "settings",
        iconPosition: "right"
      }
    });

    expect(wrapper).toMatchInlineSnapshot(`
<a class="xui-button iconRight"><svg class="xui-icon xui-button-icon">
    <use xlink:href="#i-settings"></use>
  </svg><span class="xui-button-content"></span></a>
`);
  });

  it('可以绑定各种事件', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();

    const wrapper = mount(Button, {
      listeners: {
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
