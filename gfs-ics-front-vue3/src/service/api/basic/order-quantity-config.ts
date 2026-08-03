import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

/**
 * 分页查询订购量配置
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/orderQuantityConfig/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存订购量配置
 * @param params
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/orderQuantityConfig/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新订购量配置
 * @param params
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/orderQuantityConfig/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量删除订购量配置
 * @param params
 */
export function deleteByIds(params: any[]) {
  return request<any>({
    url: '/ics/orderQuantityConfig/deleteByIds',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID查询订购量配置详情
 * @param params
 */
export function info(params: any) {
  return request<any>({
    url: '/ics/orderQuantityConfig/info',
    method: 'get',
    params
  });
}

/**
 * 订购量配置导入文件路径
 */
export function importFile() {
  return requestUrl('/ics/orderQuantityConfig/import');
}

/**
 * 导出订购量配置
 * @param params
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/orderQuantityConfig/export',
    method: 'post',
    data: params
  });
}
