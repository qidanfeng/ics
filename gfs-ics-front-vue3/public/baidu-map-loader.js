// 动态加载百度地图API的函数
function loadBaiduMapAPI() {
  // 优先级：全局配置 > localStorage > 默认AK（开发环境）
  const ak = window.BAIDU_MAP_AK ||
            localStorage.getItem('BAIDU_MAP_AK') ||
            (window._BAIDU_CONFIG && window._BAIDU_CONFIG.ak) ||
            '2F2vR6F5FYyLQEoMPnB5TwkuQxmTaLve';

  if (!ak || ak === 'your_baidu_map_ak_here') {
    console.error('百度地图 AK 未配置！请在 .env 文件中设置 VITE_BAIDU_MAP_AK');
    return Promise.reject(new Error('百度地图 AK 未配置'));
  }

  // 检查是否已经加载了百度地图API（检查GL版本）
  if (window.BMapGL || document.querySelector('#baidu-map-api-script')) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // 创建全局回调函数（GL版本回调）
    window.initBaiduMap = function() {
      // GL 版本加载完成后，BMapGL 对象会自动注入到 window
      // 需要等待 BMapGL 完全可用
      let checkCount = 0;
      const maxCheckCount = 50; // 最多检查50次（5秒）

      const checkBMapGL = setInterval(() => {
        checkCount++;
        if (window.BMapGL) {
          clearInterval(checkBMapGL);
          //console.log('BMapGL 已加载并初始化');
          resolve(window.BMapGL);
        } else if (checkCount >= maxCheckCount) {
          clearInterval(checkBMapGL);
          console.error('BMapGL 加载超时');
          reject(new Error('BMapGL 加载超时'));
        }
      }, 100);
    };

    // 创建script标签加载百度地图API
    const script = document.createElement('script');
    script.id = 'baidu-map-api-script';
    script.type = 'text/javascript';
    script.src = `https://api.map.baidu.com/api?type=webgl&v=3.0&ak=${ak}&callback=initBaiduMap`;
    script.onerror = function() {
      console.error('百度地图API加载失败');
      reject(new Error('百度地图API加载失败'));
    };

    document.head.appendChild(script);
  });
}

// 加载额外的百度地图库（仅加载兼容 BMapGL 的库）
function loadBaiduMapLibraries() {
  // 注意：DrawingManager、TrafficControl、CurveLine、GeoUtils 等库只兼容旧版 BMap
  // 项目使用 BMapGL (WebGL 版本)，这些库不需要加载
  // 如需使用相关功能，请参考 BMapGL 官方文档使用原生 API

  // 目前项目没有使用这些库，暂不加载
  //console.log('BMapGL 扩展库按需加载，当前没有需要预加载的库');
}

// 自动加载百度地图API
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadBaiduMapAPI().then(() => {
      //console.log('百度地图GL版本API加载成功');
      loadBaiduMapLibraries();
    }).catch(err => {
      console.error('百度地图API加载失败:', err);
    });
  });
} else {
  loadBaiduMapAPI().then(() => {
    //console.log('百度地图GL版本API加载成功');
    loadBaiduMapLibraries();
  }).catch(err => {
    console.error('百度地图API加载失败:', err);
  });
}
