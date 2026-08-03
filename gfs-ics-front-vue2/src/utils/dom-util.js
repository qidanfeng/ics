/**
 * @Author: lichenhao
 * @Date: 2021/3/4 17:03
 */
export default{
  stopBubbling(e) {
    e = window.event || e;
    if (e.stopPropagation) {
      e.stopPropagation();      //阻止事件 冒泡传播
    } else {
      e.cancelBubble = true;   //ie兼容
    }
  },
  removeTabHandle(store,router,route,toRoutePath){
    store.dispatch('tagsView/delView', route).then(({ visitedViews }) => {
      router.push({ path: toRoutePath, params: {getData: true} });
    })
  }
}
