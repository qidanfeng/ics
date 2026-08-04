import { request } from '../../request';

/**
 * 分页查询费用计算配置
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/costCalculationConfig/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存费用计算配置
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/costCalculationConfig/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新费用计算配置
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/costCalculationConfig/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量删除费用计算配置
 */
export function deleteByIds(params: any[]) {
  return request<any>({
    url: '/ics/costCalculationConfig/deleteByIds',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID查询费用计算配置详情
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/costCalculationConfig/info',
    method: 'get',
    params: { id }
  });
}

const billCalculationConfigApi = {
  getListPage,
  save,
  update,
  deleteByIds,
  info
};

export default billCalculationConfigApi;
