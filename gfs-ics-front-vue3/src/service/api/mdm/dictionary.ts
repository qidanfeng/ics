import { request, blobRequest } from '../../request';

/**
 * 获取分页列表
 * @param params
 */
export function list(params: any) {
  return request<any>({
    url: '/mdm/dictionary/list',
    method: 'post',
    data: params
  });
}

/**
 * 获取详情
 * @param id
 */
export function info(id: string | number) {
  return request<any>({
    url: '/mdm/dictionary/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 查询所有
 */
export function queryAll() {
  return request<any[]>({
    url: '/mdm/dictionary/queryAll',
    method: 'get'
  });
}

/**
 * 根据类型查询
 * @param params
 */
export function queryByType(params: any) {
  return request<any[]>({
    url: '/mdm/dictionary/queryByType',
    method: 'post',
    data: params
  });
}

/**
 * 根据父类型查询字典
 * @param params
 */
export function queryByParentType(params: any) {
  return request<any[]>({
    url: '/mdm/dictionary/queryByParentType',
    method: 'post',
    data: params
  });
}

/**
 * 保存或更新
 * @param params
 */
export function addOrUpdate(params: any) {
  const url = params.url || 'save';
  return request<any>({
    url: `/mdm/dictionary/${url}`,
    method: 'post',
    data: params
  });
}

/**
 * 删除
 * @param params
 */
export function del(params: any[]) {
  return request<any>({
    url: '/mdm/dictionary/delete',
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
    url: '/mdm/dictionary/updateStatusByIds',
    method: 'post',
    data: params
  });
}

/**
 * 导出数据
 * @param params
 */
export function exportData(params: any) {
  return blobRequest({
    url: '/mdm/dictionary/export',
    method: 'get',
    params
  });
}

/**
 * 查询所有类型列表
 */
export function queryAllTypeList() {
  return request<string[]>({
    url: '/mdm/dictionary/queryAllTypeList',
    method: 'get'
  });
}

/**
 * 获取树形结构
 */
export function getListTree() {
  return request<any[]>({
    url: '/mdm/dictionary/getListTree',
    method: 'get'
  });
}
