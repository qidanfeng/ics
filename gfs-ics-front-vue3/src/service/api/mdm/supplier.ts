import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

const supplierApi = {
  getListPage,
  addOrUpdate,
  deleteById,
  info,
  updateStatusByIds,
  supplierDown,
  verifyUncheckedOrNot,
  queryCurrentUserOwnSupplier,
  getAllSupplier,
  bindCustomer,
  importFile,
  importFileForUpdate,
  exportData,
  uploadQualificationFile,
  getQualificationList,
  deleteQualificationFile
};

export default supplierApi;

/**
 * 获取供应商列表
 * @param params
 */
export function getListPage(params?: any) {
  return request<any>({
    url: '/mdm/supplier/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 新增或修改供应商
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/supplier/updateSupplierById' : '/mdm/supplier/save',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID删除供应商
 * @param id
 */
export function deleteById(id: string | number) {
  return request<any>({
    url: `/mdm/supplier/deleteById`,
    method: 'get',
    params: { id }
  });
}

/**
 * 获取供应商详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/supplier/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 供应商激活关闭
 * @param params
 */
export function updateStatusByIds(params: any) {
  return request<any>({
    url: '/mdm/supplier/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 供应商下发
 * @param params
 */
export function supplierDown(params: any) {
  return request<any>({
    url: '/mdm/supplier/supplierDown',
    method: 'post',
    data: params
  });
}

/**
 * 验证供应商是否可以被取消勾选
 * @param supplierId
 * @param companyId
 * @param companyType
 */
export function verifyUncheckedOrNot(supplierId: string | number, companyId: string | number, companyType: string) {
  return request<any>({
    url: '/mdm/supplier/verifyUncheckedOrNot',
    method: 'get',
    params: { supplierId, companyId, companyType }
  });
}

/**
 * 查询当前用户拥有的供应商
 * @param params
 */
export function queryCurrentUserOwnSupplier(params?: any) {
  return request<any>({
    url: '/mdm/supplier/queryCurrentUserOwnSupplier',
    method: 'get',
    params
  });
}

/**
 * 获取所有供应商
 * @param params
 */
export function getAllSupplier(params?: any) {
  return request<any>({
    url: '/mdm/supplier/getAllSupplier',
    method: 'post',
    data: params
  });
}

/**
 * 绑定货主
 * @param params
 */
export function bindCustomer(params: any) {
  return request<any>({
    url: '/mdm/supplier/bindCustomer',
    method: 'post',
    data: params
  });
}

/**
 * 导入文件
 */
export function importFile() {
  return request<any>({
    url: '/mdm/supplier/import',
    method: 'post'
  });
}

/**
 * 导入文件用于更新
 */
export function importFileForUpdate() {
  return request<any>({
    url: '/mdm/supplier/importForUpdate',
    method: 'post'
  });
}

/**
 * 导出数据
 */
export function exportData(params?: any) {
  return blobRequest({
    url: '/mdm/supplier/export',
    method: 'post',
    data: params
  });
}

/**
 * 上传资质文件
 */
export function uploadQualificationFile() {
  return requestUrl('/mdm/supplierFileRecord/save');
}

/**
 * 获取资质文件列表
 * @param supplierId
 */
export function getQualificationList(supplierId: string | number) {
  return request<any>({
    url: '/mdm/supplierFileRecord/listBySupplierId',
    method: 'get',
    params: { supplierId }
  });
}

/**
 * 删除资质文件
 * @param fileId
 */
export function deleteQualificationFile(id: string | number) {
  return request<any>({
    url: '/mdm/supplierFileRecord/delete',
    method: 'post',
    params: { id }
  });
}

/**
 * 根据货主ID获取供应商VO列表
 * @param customerId 货主ID
 */
export function getSupplierVoByCustomerId(customerId: string | number) {
  return request<any>({
    url: '/mdm/supplier/getSupplierVoByCustomerId',
    method: 'get',
    params: { customerId }
  });
}
