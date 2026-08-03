import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SetupStoreId } from '@/enum';

/**
 * 页面间参数传递 Store
 * 用于页面跳转时传递参数，避免使用 URL 参数
 */
export const usePageParamsStore = defineStore(SetupStoreId.PageParams, () => {
  /**
   * 存储页面跳转参数
   * key: 目标页面路由名称
   * value: 参数对象
   */
  const pageParams = ref<Record<string, any>>({});

  /**
   * 设置页面参数
   * @param routeName 目标页面路由名称
   * @param params 参数对象
   * @param options 配置选项
   */
  function setParams(routeName: string, params: any, options?: { once?: boolean }) {
    pageParams.value[routeName] = {
      data: params,
      once: options?.once ?? true, // 默认只使用一次
      used: false
    };
  }

  /**
   * 获取页面参数
   * @param routeName 目标页面路由名称
   * @returns 参数对象或 null
   */
  function getParams(routeName: string): any | null {
    const stored = pageParams.value[routeName];
    if (!stored) return null;

    // 如果标记为一次性使用，则获取后删除
    if (stored.once && !stored.used) {
      stored.used = true;
      const data = stored.data;
      delete pageParams.value[routeName];
      return data;
    }

    return stored.data;
  }

  /**
   * 检查是否有未使用的参数
   * @param routeName 目标页面路由名称
   * @returns boolean
   */
  function hasParams(routeName: string): boolean {
    const stored = pageParams.value[routeName];
    return !!stored && (!stored.once || !stored.used);
  }

  /**
   * 清除指定页面的参数
   * @param routeName 目标页面路由名称
   */
  function clearParams(routeName: string) {
    delete pageParams.value[routeName];
  }

  /**
   * 清除所有参数
   */
  function clearAllParams() {
    pageParams.value = {};
  }

  return {
    pageParams,
    setParams,
    getParams,
    hasParams,
    clearParams,
    clearAllParams
  };
});
