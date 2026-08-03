import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

/**
 * 获取分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/address/list',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID获取详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/address/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 保存或更新
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/address/update' : '/mdm/address/save',
    method: 'post',
    data: params
  });
}

/**
 * 删除
 * @param id
 */
export function deleteById(id: string | number) {
  return request<any>({
    url: '/mdm/address/deleteById',
    method: 'get',
    params: { id }
  });
}

/**
 * 批量删除
 * @param params
 */
export function del(params: any[]) {
  return request<any>({
    url: '/mdm/address/delete',
    method: 'post',
    data: params
  });
}

/**
 * 更新状态
 * @param params
 */
export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/address/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 查询地址类型
 */
export function queryAddressType() {
  return request<any>({
    url: '/mdm/address/queryAddressType',
    method: 'get'
  });
}

/**
 * 查询所有地址
 */
export function queryAll() {
  return request<any>({
    url: '/mdm/address/queryAll',
    method: 'get'
  });
}

/**
 * 地址下发
 * @param params
 */
export function addressDown(params: any) {
  return request<any>({
    url: '/mdm/address/addressDown',
    method: 'post',
    data: params
  });
}

/**
 * 验证地址是否可以被取消勾选
 * @param addressId
 * @param companyId
 * @param companyType
 */
export function verifyUncheckedOrNot(addressId: string | number, companyId: string | number, companyType: string) {
  return request<any>({
    url: '/mdm/address/verifyUncheckedOrNot',
    method: 'get',
    params: { addressId, companyId, companyType }
  });
}

/**
 * 根据代码查询实体列表
 * @param code
 */
export function queryEntityListByCode(code: string) {
  return request<any>({
    url: '/mdm/address/queryEntityListByCode',
    method: 'get',
    params: { code }
  });
}

/**
 * 根据名称查询实体列表
 * @param name
 */
export function queryEntityListByName(name: string) {
  return request<any>({
    url: '/mdm/address/queryEntityListByName',
    method: 'get',
    params: { name }
  });
}

/**
 * 根据公司和仓库代码查询实体列表
 * @param code
 * @param warehouseCode
 * @param companyId
 */
export function queryEntityListByCompanyAndwarehouse(code: string, warehouseCode: string, companyId: string | number) {
  return request<any>({
    url: '/mdm/address/queryEntityListByCompanyAndwarehouse',
    method: 'get',
    params: { code, warehouseCode, companyId }
  });
}

/**
 * 根据公司查询实体列表
 * @param code
 * @param companyId
 */
export function queryEntityListByCompany(code: string, companyId: string | number) {
  return request<any>({
    url: '/mdm/address/queryEntityListByCompany',
    method: 'get',
    params: { code, companyId }
  });
}

/**
 * 根据拆分查询实体列表
 * @param code
 * @param companyId
 */
export function queryEntityListBySplit(code: string, companyId: string | number) {
  return request<any>({
    url: '/mdm/address/queryEntityListBySplit',
    method: 'get',
    params: { code, companyId }
  });
}

/**
 * 根据公司ID和仓库代码查询实体列表
 * @param params
 */
export function queryEntityListByCompanyIdAndWarehouseCode(params: any) {
  return request<any>({
    url: '/mdm/address/queryEntityListByCompanyIdAndWarehouseCode',
    method: 'get',
    params
  });
}

/**
 * 根据代码获取地址
 * @param code
 */
export function getAddressByCode(code: string) {
  return request<any>({
    url: '/mdm/address/getAddressByCode',
    method: 'get',
    params: { code }
  });
}

/**
 * 根据客户ID获取地址VO列表
 * @param customerId
 */
export function getAddressVosByCustomerId(customerId: string | number) {
  return request<any>({
    url: '/mdm/address/getAddressVosByCustomerId',
    method: 'get',
    params: { customerId }
  });
}

/**
 * 导出数据
 * @param params
 */
export function exportData(params: any) {
  return blobRequest({
    url: '/mdm/address/export',
    method: 'get',
    params
  });
}

/**
 * 地址导入文件路径
 */
export function addressFile() {
  return requestUrl('/mdm/address/addressFile');
}

/**
 * 地址更新导入文件路径
 */
export function addressFileForUpdate() {
  return requestUrl('/mdm/address/addressFileForUpdate');
}

/**
 * 获取县区信息
 */
export function getCounty() {
  return request<any>({
    url: '/mdm/dtarea/getCounty',
    method: 'get'
  });
}

/**
 * 获取所有地址
 * @param params
 */
export function getAllAddress(params: any) {
  return request<any>({
    url: '/mdm/address/getAllAddress',
    method: 'post',
    data: params
  });
}

/**
 * 获取所有内部地址
 * @param params
 */
export function getAllInAddress(params: any) {
  return request<any>({
    url: '/mdm/address/getAllInAddress',
    method: 'post',
    data: params
  });
}

/**
 * 获取所有外部地址
 * @param params
 */
export function getAllOutAddress(params: any) {
  return request<any>({
    url: '/mdm/address/getAllOutAddress',
    method: 'post',
    data: params
  });
}

/**
 * 上传地址图片
 */
export function uploadAddressImg() {
  return requestUrl('/mdm/address/uploadImg');
}