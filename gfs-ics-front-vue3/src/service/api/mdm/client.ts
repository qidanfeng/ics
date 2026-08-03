import { request } from '../../request';

/**
 * 获取分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/client/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 获取所有客户
 * @param params
 */
export function getAllClient(params: any) {
  return request<any>({
    url: '/mdm/client/getAllClient',
    method: 'post',
    data: params
  });
}

/**
 * 获取客户类型列表
 */
export function getClientTypeList() {
  return request<any>({
    url: '/mdm/client/getClientTypeList',
    method: 'post'
  });
}

/**
 * 保存或更新
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/client/update' : '/mdm/client/save',
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
    url: '/mdm/client/deleteById',
    method: 'get',
    params: { id }
  });
}

/**
 * 获取详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/client/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 查询当前用户拥有的客户
 * @param params
 */
export function queryCurrentUserOwnClient(params?: any) {
  return request<any>({
    url: '/mdm/client/queryCurrentUserOwnClient',
    method: 'get',
    params
  });
}

/**
 * 查询激活的用户拥有的客户
 * @param params
 */
export function queryActivatedUserOwnClient(params?: any) {
  return request<any>({
    url: '/mdm/client/queryActivatedUserOwnClient',
    method: 'get',
    params
  });
}

/**
 * 查询激活的用户拥有的客户信息
 * @param params
 */
export function queryActivatedUserOwnClientInfo(params?: any) {
  return request<any>({
    url: '/mdm/client/queryActivatedUserOwnClientInfo',
    method: 'get',
    params
  });
}

/**
 * 查询激活的所有拥有的客户信息
 * @param params
 */
export function queryActivatedOwnClientInfo(params?: any) {
  return request<any>({
    url: '/mdm/client/queryActivatedOwnClientInfo',
    method: 'get',
    params
  });
}

/**
 * 查询激活的用户拥有的外部客户信息
 * @param params
 */
export function queryActivatedUserOwnExternalClientInfo(params?: any) {
  return request<any>({
    url: '/mdm/client/queryActivatedUserOwnExternalClientInfo',
    method: 'get',
    params
  });
}

/**
 * 批量更新状态
 * @param params
 */
export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/client/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 验证客户是否可以被取消勾选
 * @param clientId
 * @param companyId
 * @param companyType
 */
export function verifyUncheckedOrNot(clientId: string | number, companyId: string | number, companyType: string) {
  return request<any>({
    url: '/mdm/client/verifyUncheckedOrNot',
    method: 'get',
    params: { clientId, companyId, companyType }
  });
}

/**
 * 导入文件URL
 */
export function importClientFile() {
  return '/mdm/client/importClientFile';
}
