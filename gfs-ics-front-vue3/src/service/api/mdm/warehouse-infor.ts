import { request } from '../../request';

/**
 * 获取仓库温度信息列表
 * @param warehouseId
 */
export function getWarehouseTemperatureInfo(warehouseId: string | number) {
  return request<any[]>({
    url: '/mdm/warehouseInfor/getWarehouseInfoVosByWarehouseId',
    method: 'get',
    params: { warehouseId }
  });
}
