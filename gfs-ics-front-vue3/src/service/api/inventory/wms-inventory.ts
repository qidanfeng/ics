import { request } from '../../request';

/**
 * 查询WMS库存
 * @param params 查询参数
 */
export function queryInventory(params: any) {
  return request<any>({
    url: '/ics/wmsInventory/queryInventory',
    method: 'post',
    data: params
  });
}

const wmsInventoryApi = {
  queryInventory
};

export default wmsInventoryApi;
