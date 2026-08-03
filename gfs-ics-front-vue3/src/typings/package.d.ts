/// <reference types="@amap/amap-jsapi-types" />
/// <reference types="bmapgl" />

declare const TMap: any;

interface Window {
  /**
   * make baidu map request under https protocol
   *
   * - 0: http
   * - 1: https
   * - 2: https
   */
  HOST_TYPE: '0' | '1' | '2';

  /**
   * 百度地图 GL 版本 API
   * 升级说明：https://lbsyun.baidu.com/index.php?title=jspopularGL
   */
  BMapGL: any;

  /**
   * BMap 向后兼容别名（指向 BMapGL）
   * @deprecated 建议直接使用 BMapGL
   */
  BMap?: any;
}
