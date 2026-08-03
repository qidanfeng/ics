import { request, blobRequest } from '../../request';

/**
 * 获取采购入库单分页列表
 * @param params 查询参数
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/purchaseInOrder/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存采购入库单
 * @param params 采购入库单数据
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/purchaseInOrder/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新采购入库单
 * @param params 更新数据
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/purchaseInOrder/update',
    method: 'post',
    data: params
  });
}

/**
 * 取消采购入库单
 * @param idList 订单ID列表
 */
export function cancelOrder(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseInOrder/cancelOrder',
    method: 'post',
    data: idList
  });
}

/**
 * 下发采购入库单
 * @param idList 订单ID列表
 */
export function issue(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseInOrder/issue',
    method: 'post',
    data: idList
  });
}

/**
 * 撤回已下发的采购入库单
 * @param idList 订单ID列表
 */
export function issueRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseInOrder/issueRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 获取采购入库单详情
 * @param id 订单ID
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/purchaseInOrder/info',
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
    url: '/ics/purchaseInOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 根据订单明细ID查询批次属性值
 * @param purchaseInOrderDetailId 采购入库单明细ID
 */
export function queryLotAttributeValueByOrderDetailId(purchaseInOrderDetailId: string | number) {
  return request<any>({
    url: `/ics/purchaseInOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/${purchaseInOrderDetailId}`,
    method: 'get'
  });
}

/**
 * 根据订单号获取订单下发日志
 * @param orderNumber 订单号
 */
export function getOrderIssueLogByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/purchaseInOrder/orderIssueLog/getByOrderNumber',
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
    url: '/ics/purchaseInOrder/monitorOrderStatus/getByOrderNumber',
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
    url: '/ics/purchaseInOrder/callbackInfo/in',
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
    url: '/ics/purchaseInOrder/callbackLog/getByOrderNumber',
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
    url: '/ics/purchaseInOrder/callbackLog/retry',
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
    url: '/ics/purchaseInOrder/bill/getByOrderNumber',
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
    url: '/ics/purchaseInOrder/bill/save',
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
    url: '/ics/purchaseInOrder/bill/update',
    method: 'post',
    data: params
  });
}

/**
 * 删除费用
 * @param params 费用数据
 */
export function billDelete(params: any) {
  return request<any>({
    url: '/ics/purchaseInOrder/bill/delete',
    method: 'post',
    data: params
  });
}

/**
 * 重新自动计算费用
 * @param orderNumber 订单号
 */
export function billReCalc(orderNumber: string) {
  return request<any>({
    url: `/ics/purchaseInOrder/bill/reCalc?orderNumber=${orderNumber}`,
    method: 'get'
  });
}

/**
 * 导出采购入库单
 * @param params 查询参数
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/purchaseInOrder/export',
    method: 'post',
    data: params
  });
}

/**
 * 完成订单
 * @param idList 订单ID列表
 */
export function finishOrders(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseInOrder/finishOrders',
    method: 'post',
    data: idList
  });
}

const purchaseInOrderApi = {
  getListPage,
  save,
  update,
  cancelOrder,
  issue,
  issueRepeal,
  info,
  getDetailListByOrderNumber,
  queryLotAttributeValueByOrderDetailId,
  getOrderIssueLogByOrderNumber,
  getMonitorOrderStatusByOrderNumber,
  getInOmsOrderCallbackInfo,
  getCallbackLogByOrderNumber,
  callbackLogRetry,
  getBillByOrderNumber,
  billSave,
  billUpdate,
  billDelete,
  billReCalc,
  exportFile,
  finishOrders
};

export default purchaseInOrderApi;
