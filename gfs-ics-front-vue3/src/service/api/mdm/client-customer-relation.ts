import { request } from '../../request';

/** 绑定客户关系 */
export function bindCustomerRelation(data: any) {
  return request<any>({
    url: '/mdm/clientCustomerRelation/bindCustomerRelation',
    method: 'post',
    data
  });
}

/** 获取绑定详情 */
export function info(customerId: number | string) {
  return request<any>({
    url: '/mdm/clientCustomerRelation/info',
    method: 'get',
    params: { customerId }
  });
}

/** 根据客户ID获取货主信息 */
export function getClientInfo(customerId: number | string) {
  return request<any>({
    url: '/mdm/clientCustomerRelation/getClientByCustomerId',
    method: 'get',
    params: { customerId }
  });
}
