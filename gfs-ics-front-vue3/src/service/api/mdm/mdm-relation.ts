import { request } from '../../request';

/**
 * 绑定 MDM 关系
 * @param params
 */
export function bindMdmRelation(params: any) {
  return request<any>({
    url: '/mdm/mdmRelation/bindMdmRelation',
    method: 'post',
    data: params
  });
}

/**
 * 更新 MDM 关系
 * @param params
 */
export function updateMdmRelation(params: any) {
  return request<any>({
    url: '/mdm/mdmRelation/updateMdmRelation',
    method: 'post',
    data: params
  });
}

/**
 * 获取详情
 * @param projectId
 */
export function info(projectId: string | number) {
  return request<any>({
    url: '/mdm/mdmRelation/info',
    method: 'get',
    params: { projectId }
  });
}

/**
 * 根据项目查询 MDM 关系
 * @param projectId
 */
export function queryMdmRelationByProject(projectId: string | number) {
  return request<any>({
    url: '/mdm/mdmRelation/queryMdmRelationByProjectId',
    method: 'get',
    params: { projectId }
  });
}

/**
 * 获取项目关系
 * @param projectId
 */
export function getProjectRelation(projectId: string | number) {
  return request<any>({
    url: '/mdm/mdmRelation/getProjectRelationByProjectId',
    method: 'get',
    params: { projectId }
  });
}
