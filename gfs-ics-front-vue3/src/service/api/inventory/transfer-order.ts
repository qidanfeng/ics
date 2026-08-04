import { request, blobRequest } from '../../request';

/**
 * 获取库存调拨单分页列表
 * @param params 查询参数
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存库存调拨单
 * @param params 库存调拨单数据
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新库存调拨单
 * @param params 更新数据
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/update',
    method: 'post',
    data: params
  });
}

/**
 * 取消库存调拨单
 * @param idList 订单ID列表
 */
export function cancelOrder(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/cancelOrder',
    method: 'post',
    data: idList
  });
}

/**
 * 下发库存调拨单
 * @param idList 订单ID列表
 */
export function issue(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/issue',
    method: 'post',
    data: idList
  });
}

/**
 * 撤回已下发的库存调拨单
 * @param idList 订单ID列表
 */
export function issueRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/issueRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 获取库存调拨单详情
 * @param id 订单ID
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 根据订单号获取订单明细列表
 * @param orderNumber 订单号
 */
export function getDetailListByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 删除订单明细
 * @param orderDetailIdList 订单明细ID列表
 */
export function deleteOrderDetails(orderDetailIdList: (string | number)[]) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/orderDetail/deleteByIds',
    method: 'post',
    data: orderDetailIdList
  });
}

/**
 * 根据订单明细ID查询批次属性值
 * @param inventoryTransferOrderDetailId 库存调拨单明细ID
 */
export function queryLotAttributeValueByOrderDetailId(inventoryTransferOrderDetailId: string | number) {
  return request<any>({
    url: `/ics/inventoryTransferOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/${inventoryTransferOrderDetailId}`,
    method: 'get'
  });
}

/**
 * 根据订单号获取订单下发日志
 * @param orderNumber 订单号
 */
export function getOrderIssueLogByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/orderIssueLog/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 根据订单号获取订单监控状态
 * @param orderNumber 订单号
 */
export function getMonitorOrderStatusByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 根据OMS主单订单号查询OMS入库订单回传明细
 * @param id 订单ID
 */
export function getInOmsOrderCallbackInfo(id: string | number) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/callbackInfo/in',
    method: 'get',
    params: { id }
  });
}

/**
 * 根据OMS主单订单号查询OMS出库订单回传明细
 * @param id 订单ID
 */
export function getOutOmsOrderCallbackInfo(id: string | number) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/callbackInfo/out',
    method: 'get',
    params: { id }
  });
}

/**
 * 根据订单号查询订单回传日志
 * @param orderNumber 订单号
 */
export function getCallbackLogByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/callbackLog/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 回传重试
 * @param callbackLogId 回传日志ID
 */
export function callbackLogRetry(callbackLogId: string | number) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/callbackLog/retry',
    method: 'get',
    params: { callbackLogId }
  });
}

/**
 * 根据订单号查询费用详情
 * @param orderNumber 订单号
 */
export function getBillByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/bill/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 保存费用
 * @param params 费用数据
 */
export function billSave(params: any) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/bill/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新费用
 * @param params 费用数据
 */
export function billUpdate(params: any) {
  return request<any>({
    url: '/ics/inventoryTransferOrder/bill/update',
    method: 'post',
    data: params
  });
}

/**
 * 导出库存调拨单
 * @param params 查询参数
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/inventoryTransferOrder/export',
    method: 'post',
    data: params
  });
}

const transferOrderApi = {
  getListPage,
  save,
  update,
  cancelOrder,
  issue,
  issueRepeal,
  info,
  getDetailListByOrderNumber,
  deleteOrderDetails,
  queryLotAttributeValueByOrderDetailId,
  getOrderIssueLogByOrderNumber,
  getMonitorOrderStatusByOrderNumber,
  getInOmsOrderCallbackInfo,
  getOutOmsOrderCallbackInfo,
  getCallbackLogByOrderNumber,
  callbackLogRetry,
  getBillByOrderNumber,
  billSave,
  billUpdate,
  exportFile
};

export default transferOrderApi;
