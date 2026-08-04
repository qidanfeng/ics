import { request, blobRequest } from '../../request';

/**
 * 获取退供出库单分页列表
 * @param params 查询参数
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存退供出库单
 * @param params 退供出库单数据
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新退供出库单
 * @param params 更新数据
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/update',
    method: 'post',
    data: params
  });
}

/**
 * 根据id集合取消订单
 * @param idList 订单ID列表
 */
export function cancelOrder(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/cancelOrder',
    method: 'post',
    data: idList
  });
}

/**
 * 下发退供出库单
 * @param idList 订单ID列表
 */
export function issue(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/issue',
    method: 'post',
    data: idList
  });
}

/**
 * 下发撤回退供出库单
 * @param idList 订单ID列表
 */
export function issueRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/issueRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 根据ID查询退供出库单详情
 * @param id 订单ID
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/info',
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
    url: '/ics/returnSupplierOutOrder/orderDetail/getDetailListByOrderNumber',
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
    url: '/ics/returnSupplierOutOrder/orderDetail/deleteByIds',
    method: 'post',
    data: orderDetailIdList
  });
}

/**
 * 根据订单明细ID查询批次属性值
 * @param returnSupplierOutOrderDetailId 退供出库单明细ID
 */
export function queryLotAttributeValueByOrderDetailId(returnSupplierOutOrderDetailId: string | number) {
  return request<any>({
    url: `/ics/returnSupplierOutOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/${returnSupplierOutOrderDetailId}`,
    method: 'get'
  });
}

/**
 * 根据订单号获取订单下发日志
 * @param orderNumber 订单号
 */
export function getOrderIssueLogByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/orderIssueLog/getByOrderNumber',
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
    url: '/ics/returnSupplierOutOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 根据OMS主单订单号查询OMS出库订单回传明细
 * @param id 订单ID
 */
export function getOutOmsOrderCallbackInfo(id: string | number) {
  return request<any>({
    url: '/ics/returnSupplierOutOrder/callbackInfo/out',
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
    url: '/ics/returnSupplierOutOrder/callbackLog/getByOrderNumber',
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
    url: '/ics/returnSupplierOutOrder/callbackLog/retry',
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
    url: '/ics/returnSupplierOutOrder/bill/getByOrderNumber',
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
    url: '/ics/returnSupplierOutOrder/bill/save',
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
    url: '/ics/returnSupplierOutOrder/bill/update',
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
    url: '/ics/returnSupplierOutOrder/bill/delete',
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
    url: `/ics/returnSupplierOutOrder/bill/reCalc?orderNumber=${orderNumber}`,
    method: 'get'
  });
}

/**
 * 导出退供出库单
 * @param params 查询参数
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/returnSupplierOutOrder/export',
    method: 'post',
    data: params
  });
}

const returnSupplierApi = {
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
  getOutOmsOrderCallbackInfo,
  getCallbackLogByOrderNumber,
  callbackLogRetry,
  getBillByOrderNumber,
  billSave,
  billUpdate,
  billDelete,
  billReCalc,
  exportFile
};

export default returnSupplierApi;
