/*
* 返回两个数组差异元素组成新数组
* */
export function getArrDifference(arr1, arr2) {
  return arr1.concat(arr2).filter(function(v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}


/*
 * 根据数组对象属性删除对应项
 * @param {Array} arr - 数组对象
 * @param {String} attr - 属性
 * @param {} value - 属性值
 * @return void
 */
export function removeArrByValue(arr, attr, value) {
  for(var i in arr){
    if(arr[i][attr]==value){
      arr.splice(i,1);
    }
  }
}
