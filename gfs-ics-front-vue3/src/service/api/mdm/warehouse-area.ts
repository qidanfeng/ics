import { request } from '../../request';
import requestUrl from '../../request/requestUrl';

export function getPickWarehouseAreaListByLikeCode(code: string) {
  return request<any>({
    url: '/mdm/warehouseArea/getPickWarehouseAreaListByLikeCode',
    method: 'get',
    params: { code }
  });
}

const warehouseAreaApi = {
  getPickWarehouseAreaListByLikeCode
};

export default warehouseAreaApi;