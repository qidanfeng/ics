import { request, blobRequest } from '../../request';

/**
 * 分页查询ics库存
 * @param params 查询参数
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/icsInventory/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 导出ics库存
 * @param params 查询参数
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/icsInventory/export',
    method: 'post',
    data: params
  });
}

const icsInventoryApi = {
  getListPage,
  exportFile
};

export default icsInventoryApi;
