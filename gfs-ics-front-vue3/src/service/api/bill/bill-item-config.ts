import { request } from '../../request';

/**
 * 获取所有费项编码列表
 */
export function getAllCostItemCodeList() {
  return request<any>({
    url: '/ics/costItemConfig/getAllCostItemCodeList',
    method: 'get'
  });
}

const billItemConfigApi = {
  getAllCostItemCodeList
};

export default billItemConfigApi;
