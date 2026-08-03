import { request } from '../../request';

/**
 * 获取分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/operationRelation/list',
    method: 'post',
    data: params
  });
}

/**
 * 保存或更新
 * @param params
 */
export function addOrUpdate(params: any) {
  return request<any>({
    url: params.addOrUpdate ? '/mdm/operationRelation/update' : '/mdm/operationRelation/save',
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
    url: '/mdm/operationRelation/delete',
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
    url: '/mdm/operationRelation/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 更新运作关系
 * @param params
 */
export function updateOperationRelation(params: any) {
  return request<any>({
    url: '/mdm/operationRelation/updateOperationRelation',
    method: 'post',
    data: params
  });
}

/**
 * 根据项目获取运作关系
 * @param projectId
 */
export function getOperationRelationByProject(projectId: string | number) {
  return request<any>({
    url: '/mdm/operationRelation/getOperationRelationByProject',
    method: 'get',
    params: { projectId }
  });
}

/**
 * 批量更新状态
 * @param params
 */
export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/operationRelation/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 获取运作公司列表
 * @param clientId
 */
export function getOperationCompanyList(clientId: string | number) {
  return request<any>({
    url: '/mdm/operationRelation/getOperationCompanyListByClientId',
    method: 'get',
    params: { clientId }
  });
}

/**
 * 根据外部客户代码获取运作关系列表
 * @param externalClientCode
 */
export function getOperationRelationListByExternalClientCode(externalClientCode: string) {
  return request<any>({
    url: '/mdm/operationRelation/getOperationRelationListByExternalClientCode',
    method: 'get',
    params: { externalClientCode }
  });
}

/**
 * 根据客户ID获取运作关系列表
 * @param clientId
 */
export function getOperationRelationListByClientId(clientId: string | number) {
  return request<any>({
    url: '/mdm/operationRelation/getOperationRelationListByClientId',
    method: 'get',
    params: { clientId }
  });
}
