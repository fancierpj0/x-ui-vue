+ Button、Icon native事件的this并不是指向组件的根dom节点，而是父组件

+ native事件的单元测试

+ 组件name加不加前缀

+ 以`this.$toast()`的方式反复呼出toast，会报`Error in nextTick: "TypeError: Cannot read property 'style' of undefined"`，但并不影响使用



Sticky

重构 eventBus命名
