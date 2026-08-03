import { request } from '../../request';

const supplierRelationApi = {
  querySupplierRelation,
  updateSupplierRelationStatus,
  bindingSupplierOfCurrentCompany
};

export default supplierRelationApi;

/**
 * 根据公司ids和供应商id查询下发详情
 * @param supplierId
 * @param ownCompanyIds
 */
export function querySupplierRelation(supplierId: string | number, ownCompanyIds: string[]) {
  return request<any>({
    url: '/mdm/supplierRelation/querySupplierRelation',
    method: 'get',
    params: { supplierId, ownCompanyIds: ownCompanyIds.join(',') }
  });
}

/**
 * 更新供应商关联状态
 * @param status
 * @param id
 */
export function updateSupplierRelationStatus(status: boolean, id: string | number) {
  return request<any>({
    url: '/mdm/supplierRelation/updateSupplierRelationStatus',
    method: 'get',
    params: { status, id }
  });
}

/**
 * 将供应商与当前公司绑定
 * @param supplierId
 * @param companyId
 */
export function bindingSupplierOfCurrentCompany(supplierId: string | number, companyId: string | number) {
  return request<any>({
    url: '/mdm/supplierRelation/bindingSupplierOfCurrentCompany',
    method: 'get',
    params: { supplierId, companyId }
  });
}