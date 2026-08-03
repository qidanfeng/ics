import { request } from '../../request';

/**
 * 将承运商与当前公司绑定
 * @param carrierId
 * @param companyId
 */
export function bindingCarrierOfCurrentCompany(carrierId: string | number, companyId: string | number) {
  return request<any>({
    url: '/mdm/carrierRelation/bindingCarrierOfCurrentCompany',
    method: 'get',
    params: { carrierId, companyId }
  });
}

/**
 * 根据公司ids和承运商id查询下发详情
 * @param carrierId
 * @param ownCompanyIds
 */
export function queryCarrierRelation(carrierId: string | number, ownCompanyIds: string[]) {
  return request<any>({
    url: '/mdm/carrierRelation/queryCarrierRelation',
    method: 'get',
    params: { carrierId, ownCompanyIds: ownCompanyIds.join(',') }
  });
}

/**
 * 更新承运商关联状态
 * @param status
 * @param id
 */
export function updateCarrierRelationStatus(status: boolean, id: string | number) {
  return request<any>({
    url: '/mdm/carrierRelation/updateCarrierRelationStatus',
    method: 'get',
    params: { status, id }
  });
}