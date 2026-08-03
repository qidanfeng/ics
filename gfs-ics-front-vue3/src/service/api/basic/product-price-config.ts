import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

/**
 * 分页查询产品价格配置
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/productPriceConfig/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存产品价格配置
 * @param params
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/productPriceConfig/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新产品价格配置
 * @param params
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/productPriceConfig/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量删除产品价格配置
 * @param params
 */
export function deleteByIds(params: any[]) {
  return request<any>({
    url: '/ics/productPriceConfig/deleteByIds',
    method: 'post',
    data: params
  });
}

/**
 * 批量激活/关闭产品价格配置
 * @param params
 */
export function openOrClose(params: any[]) {
  return request<any>({
    url: '/ics/productPriceConfig/openOrClose',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID查询产品价格配置详情
 * @param params
 */
export function info(params: any) {
  return request<any>({
    url: '/ics/productPriceConfig/info',
    method: 'get',
    params
  });
}

/**
 * 按客户查询供应商
 * @param clientId 客户ID
 */
export function getSupplierByClientId(clientId: string | number) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getSupplierByClientId',
    method: 'get',
    params: { clientId }
  });
}

/**
 * 按客户、供应商查询仓库
 * @param clientId 客户ID
 * @param supplierId 供应商ID
 */
export function getWarehouseBySupplierId(clientId: string | number, supplierId: string | number) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getWarehouseBySupplierId',
    method: 'get',
    params: { clientId, supplierId }
  });
}

/**
 * 按客户、供应商、仓库查询货主
 * @param clientId 客户ID
 * @param supplierId 供应商ID
 * @param warehouseCode 仓库编码
 */
export function getProjectBySupplierAndWarehouseCode(
  clientId: string | number,
  supplierId: string | number,
  warehouseCode: string
) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getProjectBySupplierAndWarehouseCode',
    method: 'get',
    params: { clientId, supplierId, warehouseCode }
  });
}

/**
 * 按客户查询仓库
 * @param clientId 客户ID
 */
export function getWarehouseByClientId(clientId: string | number) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getWarehouseByClientId',
    method: 'get',
    params: { clientId }
  });
}

/**
 * 按客户查询货主
 * @param clientId 客户ID
 */
export function getProjectByClientId(clientId: string | number) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getProjectByClientId',
    method: 'get',
    params: { clientId }
  });
}

/**
 * 模糊查询供应商、仓库、货主下的产品
 * @param params
 */
export function fuzzyQueryProduct(params: any) {
  return request<any>({
    url: '/ics/productPriceConfig/fuzzyQueryProduct',
    method: 'post',
    data: params
  });
}

/**
 * 按客户、仓库查询货主
 * @param clientId 客户ID
 * @param warehouseCode 仓库编码
 */
export function getProjectByWarehouseCode(clientId: string | number, warehouseCode: string) {
  return request<any>({
    url: '/ics/productPriceConfig/supplierInfo/getProjectByWarehouseCode',
    method: 'get',
    params: { clientId, warehouseCode }
  });
}

/**
 * 产品价格配置导入-新增 文件路径
 */
export function importFile() {
  return requestUrl('/ics/productPriceConfig/import');
}

/**
 * 产品价格配置导入-更新 文件路径
 */
export function importFileForUpdate() {
  return requestUrl('/ics/productPriceConfig/importForUpdate');
}

/**
 * 导出产品价格配置
 * @param params
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/productPriceConfig/export',
    method: 'post',
    data: params
  });
}
