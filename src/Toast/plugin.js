import Toast from './index';

let currentToast;

export default {
  install(Vue, options) {
    Vue.prototype.$toast = function (message, toastOptions) {
      if(currentToast) {
        currentToast.close();
      }
      currentToast = createToast({Vue, message, propsData: toastOptions, onClose:()=>{currentToast = null;}});
    }
  }
}

function createToast({Vue, message, propsData, onClose}) {
  var Constructor = Vue.extend(Toast); // 会执行 beforeMount 之前的钩子(不包括beforeMount)
  let toast = new Constructor({propsData:{createdByPlugin:true,...propsData}});
  toast.$slots.default = [message]; //必须数组 必须放mount前
  toast.$on('close', onClose);
  toast.$mount(); // 会执行 beforeMount 及其之后的钩子，包括mounted(因为此时有可能还没有真正插入页面中，so，此时在这里获取css的话可能有问题)
  (propsData.container || document.body).appendChild(toast.$el);
  return toast;
}
