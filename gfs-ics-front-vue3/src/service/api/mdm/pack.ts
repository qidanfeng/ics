import { request } from '../../request';
import requestUrl from '../../request/requestUrl';

export function getUnitsByPackCode(code: string, warehouseCode: string) {
  return request<any>({
    url: '/mdm/pack/getUnitsByPackCode',
    method: 'get',
    params: { code, warehouseCode }
  });
}

export function getPackByCode(code: string) {
  return request<any>({
    url: '/mdm/pack/getPackByCode',
    method: 'get',
    params: { code }
  });
}

export function updateWmsPackForProduct(packCode: string, productId: string | number) {
  return request<any>({
    url: '/mdm/pack/updateWmsPackForProduct',
    method: 'get',
    params: { packCode, productId }
  });
}

export function getPackConfigsByCode(code: string) {
  return request<any>({
    url: '/mdm/pack/getPackConfigsByCode',
    method: 'get',
    params: { code }
  });
}

export function getInventoryUnitByProductNumberAndCustomerId(productNumber: string, customerId: string | number) {
  return request<any>({
    url: '/mdm/pack/getInventoryUnitByProductNumberAndCustomerId',
    method: 'get',
    params: { productNumber, customerId }
  });
}

export function importFile() {
  return requestUrl('/mdm/pack/import');
}

export function packCodeUpdateImport() {
  return requestUrl('/mdm/pack/packCodeUpdateImport');
}

export function list(params: any) {
  return request<any>({
    url: '/mdm/pack/getListPage',
    method: 'post',
    data: params
  });
}

export function addOrUpdate(params: any, option: string) {
  return request<any>({
    url: `/mdm/pack/${option}`,
    method: 'post',
    data: params
  });
}

export function del(params: any[]) {
  return request<any>({
    url: '/mdm/pack/delete',
    method: 'post',
    data: params
  });
}

export function exportData(params: any) {
  return request({
    url: '/mdm/dtarea/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
}

export function exportPackConfig(params: any) {
  return request({
    url: '/mdm/pack/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
}

const packApi = {
  getUnitsByPackCode,
  getPackByCode,
  updateWmsPackForProduct,
  getPackConfigsByCode,
  getInventoryUnitByProductNumberAndCustomerId,
  importFile,
  packCodeUpdateImport,
  list,
  addOrUpdate,
  del,
  exportData,
  exportPackConfig
};

export default packApi;