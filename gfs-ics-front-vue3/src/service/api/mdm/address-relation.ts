import { request } from '../../request';

/**
 * 将地址与当前公司绑定
 * @param addressId 
 * @param companyId 
 */
export function bindingAddressOfCurrentCompany(addressId: string | number, companyId: string | number) {
  return request<any>({
    url: '/mdm/addressRelation/bindingAddressOfCurrentCompany',
    method: 'get',
    params: { addressId, companyId }
  });
}

/**
 * 根据公司ids和地址id查询下发详情
 * @param addressId 
 * @param ownCompanyIds 
 */
export function queryAddressRelation(addressId: string | number, ownCompanyIds: (string | number)[]) {
  return request<any>({
    url: '/mdm/addressRelation/queryAddressRelation',
    method: 'get',
    params: { addressId, ownCompanyIds: ownCompanyIds.join(',') }
  });
}

/**
 * 已经下发的状态
 * @param status 
 * @param id 
 */
export function updateAddressRelationStatus(status: number, id: string | number) {
  return request<any>({
    url: '/mdm/addressRelation/updateAddressRelationStatus',
    method: 'get',
    params: { status, id }
  });
}