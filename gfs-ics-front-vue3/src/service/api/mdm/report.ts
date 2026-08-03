import { request } from '../../request';

/**
 * 获取客户数量分组
 */
export function getClientQuantityGroup() {
  return request<any>({
    url: '/mdm/report/getClientQuantityGroup',
    method: 'get'
  });
}

/**
 * 获取客户增长
 */
export function getClientGrowth() {
  return request<any>({
    url: '/mdm/report/getClientGrowth',
    method: 'get'
  });
}

/**
 * 获取仓库客户数量
 */
export function getWarehouseClientQuantity() {
  return request<any>({
    url: '/mdm/report/getWarehouseClientQuantity',
    method: 'get'
  });
}

/**
 * 获取客户仓库数量
 */
export function getClientWarehouseQuantity() {
  return request<any>({
    url: '/mdm/report/getClientWarehouseQuantity',
    method: 'get'
  });
}

/**
 * 获取产品下发数量
 */
export function getProductDownCount() {
  return request<any>({
    url: '/mdm/report/getProductDownCount',
    method: 'get'
  });
}
