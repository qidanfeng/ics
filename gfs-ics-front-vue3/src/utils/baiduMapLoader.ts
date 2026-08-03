/**
 * 百度地图 GL 版本加载工具
 * 提供统一的百度地图 WebGL API 加载接口
 */

// 全局加载状态
let loadPromise: Promise<void> | null = null;
let isLoaded = false;

/**
 * 检查百度地图 GL 版本是否已加载
 */
export function isBaiduMapLoaded(): boolean {
  return typeof (window as any).BMapGL !== 'undefined';
}

/**
 * 等待百度地图 GL 版本加载完成
 * @param timeout 超时时间（毫秒），默认 15000
 */
export function waitForBaiduMap(timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {

    if (isBaiduMapLoaded()) {
      resolve();
      return;
    }

    let checkCount = 0;
    const checkInterval = setInterval(() => {
      checkCount++;

      if (isBaiduMapLoaded()) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (isBaiduMapLoaded()) {
        resolve();
      } else {
        console.error(`BMapGL 加载超时（已检查 ${checkCount} 次）`);
        reject(new Error('等待百度地图 GL 版本加载超时'));
      }
    }, timeout);
  });
}

/**
 * 加载百度地图 GL 版本 API
 * 注意：由于已经在 index.html 中通过 baidu-map-loader.js 预加载，此函数主要用于确保地图已可用
 */
export async function loadBaiduMap(): Promise<void> {
  // 已加载则直接返回
  if (isLoaded) {
    return;
  }

  // 正在加载则等待
  if (loadPromise) {
    return loadPromise;
  }

  // 检查是否已由 baidu-map-loader.js 加载
  if (isBaiduMapLoaded()) {
    isLoaded = true;
    return Promise.resolve();
  }


  // 等待预加载完成
  loadPromise = waitForBaiduMap()
    .then(() => {
      isLoaded = true;
      console.log('百度地图 GL 版本 API 已准备就绪');
    })
    .catch(error => {
      console.error('等待百度地图 GL 版本 API 加载失败:', error);
      throw error;
    });

  return loadPromise;
}

/**
 * 初始化百度地图 GL 版本实例
 * @param containerId 地图容器 ID
 * @param options 地图配置选项
 */
export function initBaiduMap(
  containerId: string,
  options: {
    center?: { lng: number; lat: number };
    zoom?: number;
    enableScrollWheelZoom?: boolean;
    enableDoubleClickZoom?: boolean;
    mapType?: 'BMAP_NORMAL_MAP' | 'BMAP_HYBRID_MAP' | 'BMAP_EARTH_MAP';
  } = {}
) {
  const {
    center,
    zoom = 12,
    enableScrollWheelZoom = true,
    enableDoubleClickZoom = true,
    mapType = 'BMAP_NORMAL_MAP'
  } = options;


  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`initBaiduMap: 地图容器 #${containerId} 未找到`);
    throw new Error(`地图容器 #${containerId} 未找到`);
  }

  const BMapGL = (window as any).BMapGL;
  if (!BMapGL) {
    console.error('initBaiduMap: BMapGL 对象未找到');
    throw new Error('百度地图 GL 版本 API 未加载，请先调用 loadBaiduMap()');
  }

  try {
    const map = new BMapGL.Map(containerId);
    console.log('initBaiduMap: 地图实例创建成功');

    // 设置地图类型
    if (window[mapType]) {
      map.setMapType(window[mapType]);
    }

    // 配置地图交互
    if (enableScrollWheelZoom) {
      map.enableScrollWheelZoom(true);
    }
    if (enableDoubleClickZoom) {
      map.enableDoubleClickZoom();
    }

    // 设置中心点和缩放级别
    if (center) {
      const point = new BMapGL.Point(center.lng, center.lat);
      map.centerAndZoom(point, zoom);
    } else if (zoom) {
      map.setZoom(zoom);
    }

    return map;
  } catch (error) {
    console.error('initBaiduMap: 地图实例创建失败', error);
    throw new Error(`地图实例创建失败: ${error}`);
  }
}

/**
 * 创建地图标注
 * @param map 地图实例
 * @param point 标注坐标 { lng, lat }
 * @param options 标注选项
 */
export function createMarker(
  map: any,
  point: { lng: number; lat: number },
  options: any = {}
) {
  const BMapGL = (window as any).BMapGL;
  const bdPoint = new BMapGL.Point(point.lng, point.lat);
  const marker = new BMapGL.Marker(bdPoint, options);
  map.addOverlay(marker);
  return marker;
}

/**
 * 执行地理编码（地址 → 坐标）
 * @param address 地址字符串
 */
export function geocode(address: string): Promise<{ lng: number; lat: number }> {
  return new Promise((resolve, reject) => {
    const BMapGL = (window as any).BMapGL;
    if (!BMapGL) {
      reject(new Error('百度地图 GL 版本 API 未加载'));
      return;
    }

    const geocoder = new BMapGL.Geocoder();
    console.log('geocode: 开始地理编码', address);

    geocoder.getPoint(address, (point: any) => {
      console.log('geocode: 地理编码结果', point);
      if (point) {
        resolve({ lng: point.lng, lat: point.lat });
      } else {
        reject(new Error('地址解析失败'));
      }
    });
  });
}

/**
 * 执行逆地理编码（坐标 → 地址）
 * @param lng 经度
 * @param lat 纬度
 */
export function reverseGeocode(lng: number, lat: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const BMapGL = (window as any).BMapGL;
    if (!BMapGL) {
      reject(new Error('百度地图 GL 版本 API 未加载'));
      return;
    }


    const point = new BMapGL.Point(lng, lat);
    const geocoder = new BMapGL.Geocoder();

    // GL 版本的 getLocation 回调只接收一个参数 result
    geocoder.getLocation(point, (result: any) => {

      // GL 版本返回的数据结构：result 直接包含地址信息
      if (result) {
        const address = result.address || '';
        resolve(result);
      } else {
        console.error('reverseGeocode: 逆地理编码失败，result:', result);
        reject(new Error('逆地理编码失败'));
      }
    });
  });
}

/**
 * 搜索地点
 * @param map 地图实例
 * @param keyword 搜索关键词
 */
export function localSearch(map: any, keyword: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const BMapGL = (window as any).BMapGL;
    if (!BMapGL) {
      reject(new Error('百度地图 GL 版本 API 未加载'));
      return;
    }

    console.log('localSearch: 开始搜索', keyword);

    const search = new BMapGL.LocalSearch(map, {
      onSearchComplete: (results: any) => {
        console.log('localSearch: 搜索结果', results);
        console.log('localSearch: results 类型', typeof results);
        console.log('localSearch: results 所有属性', Object.keys(results || {}));

        // GL 版本的 LocalSearch 结果通过 getPoi(i) 方法获取
        // 需要先获取结果数量，然后逐个获取 POI
        let pois: any[] = [];

        // 尝试不同的方式获取 POI 列表
        if (results && typeof results.getPoi === 'function') {
          // 获取结果数量
          const numPois = results.getNumPois ? results.getNumPois() : (results._numPois || 0);
          console.log('localSearch: 结果数量', numPois);

          for (let i = 0; i < numPois; i++) {
            const poi = results.getPoi(i);
            if (poi) {
              pois.push(poi);
            }
          }
        } else if (results && results.poiList && results.poiList.pois) {
          // 备用：如果 poiList.pois 存在
          pois = results.poiList.pois;
        }

        console.log('localSearch: 提取的 POI 列表', pois);

        if (pois.length > 0) {
          // 转换为统一的格式
          const formattedResults = pois.map((poi: any, index: number) => ({
            address: poi.address || '',
            city: poi.city || '',
            detailUrl: poi.uid || poi.id || `poi-${index}`,
            point: {
              lng: poi.point?.lng || 0,
              lat: poi.point?.lat || 0
            },
            title: poi.title || '',
            uid: poi.uid || poi.id || `poi-${index}`
          }));
          console.log('localSearch: 格式化后的结果', formattedResults);
          resolve(formattedResults);
        } else {
          console.log('localSearch: 未找到结果');
          resolve([]);
        }
      }
    });

    search.search(keyword);
  });
}

/**
 * 清除地图所有覆盖物
 * @param map 地图实例
 */
export function clearOverlays(map: any): void {
  if (map) {
    map.clearOverlays();
  }
}

/**
 * 设置地图中心点
 * @param map 地图实例
 * @param point 坐标 { lng, lat }
 */
export function setMapCenter(map: any, point: { lng: number; lat: number }): void {
  const BMapGL = (window as any).BMapGL;
  if (map && BMapGL) {
    const bdPoint = new BMapGL.Point(point.lng, point.lat);
    map.setCenter(bdPoint);
  }
}

/**
 * 设置地图缩放级别
 * @param map 地图实例
 * @param zoom 缩放级别（3-19，GL 版本支持更大范围）
 */
export function setMapZoom(map: any, zoom: number): void {
  if (map) {
    map.setZoom(zoom);
  }
}

