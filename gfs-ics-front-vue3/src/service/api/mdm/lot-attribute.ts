import { request } from '../../request';

/** 获取分页列表 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/lotAttribute/getListPage',
    method: 'post',
    data: params
  });
}

/** 保存或更新 */
export function saveOrUpdate(params: any) {
  return request<any>({
    url: params.id ? '/mdm/lotAttribute/update' : '/mdm/lotAttribute/save',
    method: 'post',
    data: params
  });
}

/** 根据客户ID获取拓展字段 */
export function getLotAttributeByCustomerId(customerId: string | number) {
  return request<any>({
    url: '/mdm/lotAttribute/getLotAttributeByCustomerId',
    method: 'post',
    params: { customerId }
  });
}
