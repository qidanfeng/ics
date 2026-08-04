import { request } from '../../request';

/**
 * 分页查询费项配置
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/costItemConfig/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存费项配置
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/costItemConfig/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新费项配置
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/costItemConfig/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量删除费项配置
 */
export function deleteByIds(params: any[]) {
  return request<any>({
    url: '/ics/costItemConfig/deleteByIds',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID查询费项配置详情
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/costItemConfig/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 根据费项编码查询配置
 */
export function getByCostItemCode(code: string) {
  return request<any>({
    url: '/ics/costItemConfig/getByCostItemCode',
    method: 'get',
    params: { code }
  });
}

/**
 * 获取所有费项编码列表
 */
export function getAllCostItemCodeList() {
  return request<any>({
    url: '/ics/costItemConfig/getAllCostItemCodeList',
    method: 'get'
  });
}

const billItemConfigApi = {
  getListPage,
  save,
  update,
  deleteByIds,
  info,
  getByCostItemCode,
  getAllCostItemCodeList
};

export default billItemConfigApi;
