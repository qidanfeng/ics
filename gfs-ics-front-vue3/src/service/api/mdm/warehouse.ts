import { request } from '../../request';

/**
 * 获取分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/warehouse/getPageList',
    method: 'post',
    data: params
  });
}

/**
 * 保存
 * @param params
 */
export function save(params: any) {
  return request<any>({
    url: '/mdm/warehouse/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新
 * @param params
 */
export function update(params: any) {
  return request<any>({
    url: '/mdm/warehouse/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量更新状态
 * @param params
 */
export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/warehouse/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 获取详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/warehouse/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 获取运营模式列表
 * @param params
 */
export function getOperationalModeList(params?: any) {
  return request<any>({
    url: '/mdm/warehouse/getOperationalModeList',
    method: 'post',
    data: params
  });
}

/**
 * 获取使用状态列表
 * @param params
 */
export function getUseStatusList(params?: any) {
  return request<any>({
    url: '/mdm/warehouse/getUseStatusList',
    method: 'post',
    data: params
  });
}

/**
 * 获取所有激活的仓库基本信息
 * @param params
 */
export function getAllWarehouse(params?: any) {
  return request<any>({
    url: '/mdm/warehouse/getAllActivateWarehouseBaseInfo',
    method: 'post',
    data: params
  });
}
