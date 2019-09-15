let callbacks = [];
const onClickDocument = (e) => {
  let {target} = e;
  callbacks.forEach(item => {

    if (!(target === item.el || item.el.contains(target))) item.callback();
  })
};
document.addEventListener('click', onClickDocument);
export default {
  //bin执行时 el还没有插入页面
  bind:function(el,binding,vnode,oldVnode){
    // 一个页面中 可能会有很多个组件都共用这个指令
    // console.log(vnode);
    callbacks.push({el,callback:binding.value});
    console.log('callbacks:',callbacks);
  }
  ,unbind:function(el){
    callbacks = callbacks.filter(item => item.el !== el);
  }
}
let removeListener = () => {
  document.removeEventListener('click', onClickDocument);
};

export {removeListener};

