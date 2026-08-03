import { baseURL } from './index';

/**
 * 请求地址统一处理／组装
 * @param actionName action方法名称
 */
export default function requestUrl(actionName: string) {
  return baseURL + actionName;
}
