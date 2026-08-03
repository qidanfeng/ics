import { request } from '../../request';

/**
 * 获取仓库图片列表
 * @param warehouseId
 */
export function getWarehouseImage(warehouseId: string | number) {
  return request<any>({
    url: '/mdm/warehouseImage/getWarehouseImageVosByWarehouseId',
    method: 'get',
    params: { warehouseId }
  });
}

/**
 * 上传图片
 * @param params
 */
export function uploadImage(params: FormData) {
  return request<any>({
    url: '/mdm/warehouseImage/uploadImage',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': undefined as any
    }
  });
}

/**
 * 保存图片信息
 * @param params
 */
export function saveImage(params: any) {
  return request<any>({
    url: '/mdm/warehouseImage/saveImage',
    method: 'post',
    data: params
  });
}

/**
 * 批量删除图片
 * @param params
 */
export function deleteImageBatch(params: any) {
  return request<any>({
    url: '/mdm/warehouseImage/deleteImageBatch',
    method: 'post',
    data: params
  });
}

/**
 * 获取图片类型列表
 * @param params
 */
export function getImageTypeList(params?: any) {
  return request<any>({
    url: '/mdm/warehouseImage/getImageTypeList',
    method: 'post',
    data: params
  });
}
