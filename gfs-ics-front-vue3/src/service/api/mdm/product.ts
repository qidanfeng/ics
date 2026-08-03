import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

export function deleteById(id: string | number) {
  return request<any>({
    url: '/mdm/product/deleteById',
    method: 'get',
    params: { id }
  });
}

// 获取菜单列表
export function list(params: any) {
  return request<any>({
    url: '/mdm/product/list',
    method: 'post',
    data: params
  });
}

export function info(id: string | number) {
  return request<any>({
    url: '/mdm/product/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 新增或修改（弃用）
 * @param params
 * @returns {AxiosPromise}
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.id ? '/mdm/product/update' : '/mdm/product/save',
    method: 'post',
    data: params
  });
}

/**
 * 新增
 * @param params
 * @returns {AxiosPromise}
 */
export function add(params: any) {
  return request<any>({
    url: '/mdm/product/save',
    method: 'post',
    data: params
  });
}

/**
 * 修改产品
 * @param params
 */
export function update(params: any) {
  return request<any>({
    url: '/mdm/product/update',
    method: 'post',
    data: params
  });
}

/**
 * 修改产品基本信息
 * @param params
 */
export function updateProduct(params: any) {
  return request<any>({
    url: '/mdm/product/updateProduct',
    method: 'post',
    data: params
  });
}

/**
 * 修改产品条码信息
 * @param params
 */
export function updateProductBarcode(params: any) {
  return request<any>({
    url: '/mdm/product/updateProductBarcode',
    method: 'post',
    data: params
  });
}

/**
 * 修改产品包装信息
 * @param params
 */
export function updateProductPack(params: any) {
  return request<any>({
    url: '/mdm/product/updateProductPackVo',
    method: 'post',
    data: params
  });
}

export function del(params: any[]) {
  return request<any>({
    url: '/mdm/product/delete',
    method: 'post',
    data: params
  });
}

export function importFile() {
  return requestUrl('/mdm/product/import');
}

export function importFileForUpdate() {
  return requestUrl('/mdm/product/importFileForUpdate');
}

export function uploadImg() {
  return requestUrl('/mdm/product/uploadImg');
}

export function queryAddressIdsByProductId(id: string | number) {
  return request<any>({
    url: '/mdm/product/queryAddressIdsByProductId',
    method: 'get',
    params: { id }
  });
}

export function queryByCustomerIdAndFromAddressId(customerId: string | number, fromAddressId: string | number) {
  return request<any>({
    url: '/mdm/product/queryByCustomerIdAndFromAddressId',
    method: 'get',
    params: { customerId, fromAddressId }
  });
}

export function exportData(params: any) {
  return blobRequest({
    url: '/mdm/product/export',
    method: 'get',
    params
  });
}

export function queryEntityByProductNumberAndClientId(productNumber: string, clientId: string | number, companyId: string | number) {
  return request<any>({
    url: '/mdm/product/queryEntityByProductNumberAndClientId',
    method: 'get',
    params: { productNumber, clientId, companyId }
  });
}

export function fuzzyQueryByProductNumberAndCustomerId(productNumber: string, customerId: string | number) {
  return request<any>({
    url: '/mdm/product/fuzzyQueryByProductNumberAndCustomerId',
    method: 'get',
    params: { productNumber, customerId }
  });
}

export function updateProductAddressStatus(params: any) {
  return request<any>({
    url: '/mdm/product/updateProductAddressStatus',
    method: 'post',
    data: params
  });
}

export function queryEntityByProductCnNameAndClientId(productCnName: string, clientId: string | number) {
  return request<any>({
    url: '/mdm/product/queryEntityByProductCnNameAndClientId',
    method: 'get',
    params: { productCnName, clientId }
  });
}

/**
 * 根据产品编码和货主ID查询产品实体
 * @param productNumber 产品编码
 * @param customerId 货主ID
 */
export function queryEntityByProductNumberAndCustomerId(productNumber: string, customerId: string | number) {
  return request<any>({
    url: '/mdm/product/queryEntityByProductNumberAndCustomerId',
    method: 'get',
    params: { productNumber, customerId }
  });
}

/**
 * 根据产品中文名和货主ID查询产品实体
 * @param productCnName 产品中文名
 * @param customerId 货主ID
 */
export function queryEntityByProductCnNameAndCustomerId(productCnName: string, customerId: string | number) {
  return request<any>({
    url: '/mdm/product/queryEntityByProductCnNameAndCustomerId',
    method: 'get',
    params: { productCnName, customerId }
  });
}

export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/product/updateStatusByIds',
    method: 'post',
    data: params
  });
}

export function exportProduct(params: any) {
  return blobRequest({
    url: '/mdm/product/export',
    method: 'get',
    params
  });
}

//获取所有温区枚举
export function getAllTemperatureRange(params: any) {
  return request<any>({
    url: '/mdm/product/getAllTemperatureRange',
    method: 'post',
    data: params
  });
}

export function getIssueStatusByDataId(dataId: string | number) {
  return request<any>({
    url: '/mdm/product/getIssueStatusByDataTypeAndId',
    method: 'get',
    params: { dataId }
  });
}

export function getEnterTypeList() {
  return request<any>({
    url: '/mdm/product/getEnterTypeList',
    method: 'post'
  });
}

export function getProductSyncRecordList(productIdList: string) {
  return request<any>({
    url: '/mdm/productSyncRecord/getProductSyncRecordListVo',
    method: 'get',
    params: { productIdList }
  });
}

export function refreshProductSyncRecordList(productIdList: string) {
  return request<any>({
    url: '/mdm/productSyncRecord/refreshProductSyncRecordList',
    method: 'get',
    params: { productIdList }
  });
}

export function checkSyncProduct(productIdList: string) {
  return request<any>({
    url: '/mdm/productSyncRecord/checkSyncProduct',
    method: 'get',
    params: { productIdList }
  });
}

export function confirmSyncProduct(params: any) {
  return request<any>({
    url: '/mdm/productSyncRecord/confirmSyncProduct',
    method: 'post',
    data: params
  });
}

export function productAutoSync(taskNumber: string) {
  return request<any>({
    url: '/mdm/productSyncRecord/productAutoSync',
    method: 'get',
    params: { taskNumber }
  });
}

export function abandonSyncProduct(params: any) {
  return request<any>({
    url: '/mdm/productSyncRecord/abandonSyncProduct',
    method: 'post',
    data: params
  });
}

export function viewSyncProductDetail(params: any) {
  return request<any>({
    url: '/mdm/productSyncRecord/viewSyncProductDetail',
    method: 'post',
    data: params
  });
}

export function hasEdiModifyData(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/hasEdiModifyData',
    method: 'post',
    data: params
  });
}

export function viewEdiModifyDetail(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/viewEdiModifyDetail',
    method: 'post',
    data: params
  });
}

export function applyUpdate(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/applyUpdate',
    method: 'post',
    data: params
  });
}

export function abandonUpdate(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/abandonUpdate',
    method: 'post',
    data: params
  });
}

export function ediPushCandidateData(productId: string | number) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/ediPushCandidateData',
    method: 'get',
    params: { productId }
  });
}

export function getProductUpdateLogs(productId: string | number) {
  return request<any>({
    url: '/mdm/productUpdateLog/getProductUpdateLogs',
    method: 'get',
    params: { productId }
  });
}

export function getEdiModifiedConfirmLogs(productId: string | number) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/getEdiModifiedConfirmLogs',
    method: 'get',
    params: { productId }
  });
}

export function checkProductSyncStatus(productIds: any[]) {
  return request<any>({
    url: '/mdm/product/checkProductSyncStatus',
    method: 'post',
    data: productIds
  });
}

export function getAuditStatusList() {
  return request<any>({
    url: '/mdm/product/getAuditStatusList',
    method: 'post'
  });
}

export function getSyncStatusList() {
  return request<any>({
    url: '/mdm/product/getSyncStatusList',
    method: 'post'
  });
}

/**
 * 产品审核列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getModifiedConfirmPageList(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/getModifiedConfirmPageList',
    method: 'post',
    data: params
  });
}

/**
 * 通过审核
 * @param ids
 * @returns {AxiosPromise}
 */
export function confirmModified(ids: (string | number)[]) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/confirmModified',
    method: 'post',
    data: ids
  });
}

/**
 * 拒绝审核
 * @param ids
 * @returns {AxiosPromise}
 */
export function abandonModified(ids: (string | number)[]) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/abandonModified',
    method: 'post',
    data: ids
  });
}

export function getDataResourcesList() {
  return request<any>({
    url: '/mdm/productModifiedConfirm/getDataResourcesList',
    method: 'post'
  });
}

const productApi = {
  deleteById,
  list,
  info,
  addOrUpdate,
  add,
  update,
  updateProduct,
  updateProductBarcode,
  updateProductPack,
  del,
  importFile,
  importFileForUpdate,
  uploadImg,
  queryAddressIdsByProductId,
  queryByCustomerIdAndFromAddressId,
  exportData,
  queryEntityByProductNumberAndClientId,
  fuzzyQueryByProductNumberAndCustomerId,
  updateProductAddressStatus,
  queryEntityByProductCnNameAndClientId,
  queryEntityByProductNumberAndCustomerId,
  queryEntityByProductCnNameAndCustomerId,
  updateStatusByIds,
  exportProduct,
  getAllTemperatureRange,
  getIssueStatusByDataId,
  getEnterTypeList,
  getProductSyncRecordList,
  refreshProductSyncRecordList,
  checkSyncProduct,
  confirmSyncProduct,
  productAutoSync,
  abandonSyncProduct,
  viewSyncProductDetail,
  hasEdiModifyData,
  viewEdiModifyDetail,
  applyUpdate,
  abandonUpdate,
  ediPushCandidateData,
  getProductUpdateLogs,
  getEdiModifiedConfirmLogs,
  checkProductSyncStatus,
  getAuditStatusList,
  getSyncStatusList,
  getModifiedConfirmPageList,
  confirmModified,
  abandonModified,
  getDataResourcesList
};

export default productApi;
