import { request } from '../../request';

/**
 * 根据地址ID获取营业时间信息
 * @param addressId
 */
export function getInfoByAddressId(addressId: string | number) {
  return request<any>({
    url: '/mdm/addressBusinessHours/getInfoByAddressId',
    method: 'get',
    params: { addressId }
  });
}

/**
 * 根据地址ID和星期获取营业时间信息
 * @param addressId
 * @param week
 */
export function getInfoByAddressIdAndWeek(addressId: string | number, week: number) {
  return request<any>({
    url: '/mdm/addressBusinessHours/getInfoByAddressIdAndWeek',
    method: 'get',
    params: { addressId, week }
  });
}

/**
 * 保存或更新营业时间
 * @param params
 */
export function addOrUpdate(params: any[]) {
  return request<any>({
    url: params[0].id ? '/mdm/addressBusinessHours/update' : '/mdm/addressBusinessHours/save',
    method: 'post',
    data: params
  });
}