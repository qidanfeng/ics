/**
 * @Author: lichenhao
 * @Date: 2021/3/4 17:03
 */
export default{
  pointEquals(point1,point2){
    //点比较
    return (point1.lat == point2.lat) && (point1.lng == point2.lng)
  },

  lineEquals(point1,point2,point3,point4){
    //线比较
    return (this.pointEquals(point1,point3) && this.pointEquals(point2,point4)) || (this.pointEquals(point1,point4) && this.pointEquals(point2,point3))
  },

  isPointInPolygon(point,polygon){
    //点是否在多边形内
    return BMapLib.GeoUtils.isPointInPolygon(point, polygon)
  },

  judgeIntersect(x1,y1,x2,y2,x3,y3,x4,y4) {
    //两条线段是否相交
    //快速排斥：
    //两个线段为对角线组成的矩形，如果这两个矩形没有重叠的部分，那么两条线段是不可能出现重叠的

    //这里的确如此，这一步是判定两矩形是否相交
    //1.线段ab的低点低于cd的最高点（可能重合）
    //2.cd的最左端小于ab的最右端（可能重合）
    //3.cd的最低点低于ab的最高点（加上条件1，两线段在竖直方向上重合）
    //4.ab的最左端小于cd的最右端（加上条件2，两直线在水平方向上重合）
    //综上4个条件，两条线段组成的矩形是重合的
    //特别要注意一个矩形含于另一个矩形之内的情况
    if(!(Math.min(x1,x2)<=Math.max(x3,x4) && Math.min(y3,y4)<=Math.max(y1,y2)&&Math.min(x3,x4)<=Math.max(x1,x2) && Math.min(y1,y2)<=Math.max(y3,y4)))
      return false;

    //跨立实验：
    //如果两条线段相交，那么必须跨立，就是以一条线段为标准，另一条线段的两端点一定在这条线段的两段
    //也就是说a b两点在线段cd的两端，c d两点在线段ab的两端
    var u,v,w,z
    u=(x3-x1)*(y2-y1)-(x2-x1)*(y3-y1);
    v=(x4-x1)*(y2-y1)-(x2-x1)*(y4-y1);
    w=(x1-x3)*(y4-y3)-(x4-x3)*(y1-y3);
    z=(x2-x3)*(y4-y3)-(x4-x3)*(y2-y3);
    return (u*v<=0.00000001 && w*z<=0.00000001);
  },
  //获取两个点的中点
  getMiddlePoint(point1,point2){
    var longitude = (point1.lng + point2.lng)/2;
    var latitude = (point1.lat + point2.lat)/2;
    return new BMap.Point(Number(longitude), Number(latitude));
  },
  //根据逗号连接的经纬度和#号拼接的多个坐标点，连接的字符串，处理成多个百度地图点集合
  transferPointsByPointStr(pointStr){
    var pointStrs = pointStr.split('#');
    var pointArr = [];
    pointStrs.length>0 && (
      pointStrs.forEach(item=>{
        var lng = item.split(',')[0];
        var lat = item.split(',')[1];
        var point = new BMap.Point(Number(lng), Number(lat));
        pointArr.push(point);
      })
    )
    return pointArr;
  }
}
