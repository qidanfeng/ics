import { request, blobRequest } from '../../request';

/**
 * 查询列表
 * @param params
 */
export function queryPage(params: any) {
  return request<any>({
    url: '/mdm/abutment/ediMdmSynchTask/list',
    method: 'post',
    data: params
  });
}

/**
 * 获取任务状态列表
 */
export function getTaskStatusList() {
  return request<any>({
    url: '/mdm/abutment/ediMdmSynchTask/getTaskStatusList',
    method: 'post'
  });
}

/**
 * 重新下发
 * @param params 
 */
export function synchTaskAgain(params: any) {
  return request<any>({
    url: '/mdm/abutment/ediMdmSynchTask/mdmSynchTaskAgain',
    method: 'post',
    data: params
  });
}

/**
 * 导出
 * @param params 
 */
export function exportMdmSynchTask(params: any) {
  return blobRequest({
    url: '/mdm/abutment/ediMdmSynchTask/exportMdmSynchTask',
    method: 'post',
    data: params
  });
}

/**
 * 校验导出
 * @param params 
 */
export function checkExport(params: any) {
  return request<any>({
    url: '/mdm/abutment/ediMdmSynchTask/checkExport',
    method: 'post',
    data: params
  });
}
