import { request } from '../../request';

/**
 * 获取承运商列表
 * @param params
 */
export function getListPage(params?: any) {
  return request<any>({
    url: '/mdm/carrier/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 新增或修改承运商
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/carrier/updateCarrierById' : '/mdm/carrier/save',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID删除承运商
 * @param id
 */
export function deleteById(id: string | number) {
  return request<any>({
    url: `/mdm/carrier/deleteById`,
    method: 'get',
    params: { id }
  });
}

/**
 * 获取承运商详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/carrier/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 承运商激活关闭
 * @param params
 */
export function updateStatusByIds(params: any) {
  return request<any>({
    url: '/mdm/carrier/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 通过统一社会信用代码查询承运商
 * @param unifiedSocialCreditCode
 */
export function getCarrierByUnifiedSocialCreditCode(unifiedSocialCreditCode: string) {
  return request<any>({
    url: '/mdm/carrier/getCarrierByUnifiedSocialCreditCode',
    method: 'get',
    params: { unifiedSocialCreditCode }
  });
}

/**
 * 承运商下发
 * @param params
 */
export function carrierDown(params: any) {
  return request<any>({
    url: '/mdm/carrier/carrierDown',
    method: 'post',
    data: params
  });
}

/**
 * 验证承运商是否可以被取消勾选
 * @param carrierId
 * @param companyId
 * @param companyType
 */
export function verifyUncheckedOrNot(carrierId: string | number, companyId: string | number, companyType: string) {
  return request<any>({
    url: '/mdm/carrier/verifyUncheckedOrNot',
    method: 'get',
    params: { carrierId, companyId, companyType }
  });
}

/**
 * 查询当前用户拥有的承运商
 * @param params
 */
export function queryCurrentUserOwnCarrier(params?: any) {
  return request<any>({
    url: '/mdm/carrier/queryCurrentUserOwnCarrier',
    method: 'get',
    params
  });
}

/**
 * 获取所有承运商
 * @param params
 */
export function getAllCarrier(params?: any) {
  return request<any>({
    url: '/mdm/carrier/getAllCarrier',
    method: 'post',
    data: params
  });
}

/**
 * 查询承运商类型
 */
export function queryCarrierType() {
  return request<any>({
    url: '/mdm/carrier/queryCarrierType',
    method: 'get'
  });
}

/**
 * 获取自有承运商
 * @param params
 */
export function getAllInCarrier(params?: any) {
  return request<any>({
    url: '/mdm/carrier/getAllInCarrier',
    method: 'post',
    data: params
  });
}

/**
 * 获取外部承运商
 * @param params
 */
export function getAllOutCarrier(params?: any) {
  return request<any>({
    url: '/mdm/carrier/getAllOutCarrier',
    method: 'post',
    data: params
  });
}

/**
 * 根据外部客户ID获取激活的承运商
 * @param clientId 外部客户ID
 */
export function getActivatedCarrierByExternalClientId(clientId: string | number) {
  return request<any>({
    url: '/mdm/carrier/getActivatedCarrierByExternalClientId',
    method: 'get',
    params: { externalClientId: clientId }
  });
}