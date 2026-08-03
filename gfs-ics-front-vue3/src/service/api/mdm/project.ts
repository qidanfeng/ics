import { request } from '../../request';

/**
 * 获取分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/project/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 查询业务类型
 * @param params
 */
export function queryBusinessType(params: any) {
  return request<any>({
    url: '/mdm/project/queryBusinessType',
    method: 'get',
    params
  });
}

/**
 * 保存或更新
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/project/update' : '/mdm/project/save',
    method: 'post',
    data: params
  });
}

/**
 * 根据ID删除
 * @param id
 */
export function deleteById(id: string | number) {
  return request<any>({
    url: '/mdm/project/deleteById',
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
    url: '/mdm/project/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 查询当前用户拥有的项目
 * @param params
 */
export function queryCurrentUserOwnProject(params: any) {
  return request<any>({
    url: '/mdm/project/queryCurrentUserOwnProject',
    method: 'get',
    params
  });
}

/**
 * 查询激活的用户拥有的项目
 * @param params
 */
export function queryActivatedUserOwnProject(params: any) {
  return request<any>({
    url: '/mdm/project/queryActivatedUserOwnProject',
    method: 'get',
    params
  });
}

/**
 * 获取激活的用户拥有的项目信息
 * @param params
 */
export function queryActivatedUserOwnProjectInfo(params?: any) {
  return request<any>({
    url: '/mdm/project/queryActivatedUserOwnProjectInfo',
    method: 'get',
    params
  });
}

/**
 * 更新状态
 * @param params
 */
export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/project/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 激活货主
 * @param params
 */
export function activateCustomer(params: any[]) {
  return request<any>({
    url: '/mdm/project/activateCustomer',
    method: 'post',
    data: params
  });
}

/**
 * 关闭货主
 * @param params
 */
export function closeCustomer(params: any[]) {
  return request<any>({
    url: '/mdm/project/closeCustomer',
    method: 'post',
    data: params
  });
}

/**
 * 货主下发
 * @param params
 */
export function projectDown(params: any) {
  return request<any>({
    url: '/mdm/project/projectDown',
    method: 'post',
    data: params
  });
}

/**
 * 根据简称查询项目
 * @param shortName
 */
export function getProjectByClientIdAndShortName(shortName: string) {
  return request<any>({
    url: '/mdm/project/getProjectByClientIdAndShortName',
    method: 'get',
    params: { shortName }
  });
}

/**
 * 验证项目是否可以被取消勾选
 * @param projectId
 * @param companyId
 * @param companyType
 */
export function verifyUncheckedOrNot(projectId: string | number, companyId: string | number, companyType: string) {
  return request<any>({
    url: '/mdm/project/verifyUncheckedOrNot',
    method: 'get',
    params: { projectId, companyId, companyType }
  });
}

/**
 * 获取货主下发状态
 * @param dataId
 */
export function getIssueStatusByProjectId(dataId: string | number) {
  return request<any>({
    url: '/mdm/project/getIssueStatusByDataTypeAndId',
    method: 'get',
    params: { dataId }
  });
}

/**
 * 获取所有货主
 * @param params
 */
export function getAllCustomer(params: any) {
  return request<any>({
    url: '/mdm/project/getAllCustomer',
    method: 'post',
    data: params
  });
}

/**
 * 获取所有项目
 */
export function getAllProject() {
  return request<any>({
    url: '/mdm/project/getAllProject',
    method: 'post'
  });
}

/**
 * 根据客户ID获取激活的项目
 * @param clientId
 */
export function getActivatedProjectByClient(clientId: string | number) {
  return request<any>({
    url: '/mdm/project/getActivatedProjectByClientId',
    method: 'get',
    params: { clientId }
  });
}
