import { request } from '../../request';

/**
 * 获取省信息
 */
export function getProvince() {
  return request<any>({
    url: '/mdm/dtAreaMapping/getProvince',
    method: 'get'
  });
}

/**
 * 根据父级代码获取区域信息
 * @param parentCode
 */
export function getAreasByParentCode(parentCode: string) {
  return request<any>({
    url: '/mdm/dtAreaMapping/getAreasByParentCode',
    method: 'get',
    params: { parentCode }
  });
}
