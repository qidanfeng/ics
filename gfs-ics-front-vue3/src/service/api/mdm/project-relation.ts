import { request } from '../../request';

/**
 * 将项目与当前公司绑定
 * @param projectId
 * @param companyId
 */
export function bindingProjectOfCurrentCompany(projectId: string | number, companyId: string | number) {
  return request<any>({
    url: '/mdm/projectRelation/bindingProjectOfCurrentCompany',
    method: 'get',
    params: { projectId, companyId }
  });
}

/**
 * 查询当前用户所有公司权限下的关联关系
 * @param projectId
 * @param ownCompanyIds
 */
export function queryProjectRelation(projectId: string | number, ownCompanyIds: (string | number)[]) {
  return request<any>({
    url: '/mdm/projectRelation/queryProjectRelation',
    method: 'get',
    params: { projectId, ownCompanyIds: ownCompanyIds.join(',') }
  });
}

/**
 * 更新关联关系状态
 * @param status
 * @param id
 */
export function updateProjectRelationStatus(status: number | string, id: string | number) {
  return request<any>({
    url: '/mdm/projectRelation/updateProjectRelationStatus',
    method: 'get',
    params: { status, id }
  });
}
