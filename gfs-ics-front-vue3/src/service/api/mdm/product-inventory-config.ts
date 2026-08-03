import { request } from '../../request';
import requestUrl from '../../request/requestUrl';

export function getConfigListByProductId(productId: string | number) {
  return request<any>({
    url: '/mdm/productInventoryConfig/getConfigListByProductId',
    method: 'get',
    params: { productId }
  });
}

export function deleteById(id: string | number) {
  return request<any>({
    url: '/mdm/productInventoryConfig/deleteById',
    method: 'post',
    data: { id }
  });
}

export function save(params: any[]) {
  return request<any>({
    url: '/mdm/productInventoryConfig/save',
    method: 'post',
    data: params
  });
}

const productInventoryConfigApi = {
  getConfigListByProductId,
  deleteById,
  save
};

export default productInventoryConfigApi;