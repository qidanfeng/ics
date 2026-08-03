import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

/**
 * 分页查询采购建议单
 * @param params 查询参数
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存采购建议单
 * @param params 采购建议单数据
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新采购建议单
 * @param params 采购建议单数据
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/update',
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
    url: '/ics/purchaseSuggestionOrder/cancelOrder',
    method: 'post',
    data: idList
  });
}

/**
 * 根据ID查询采购建议单详情
 * @param id 订单ID
 */
export function info(id: string | number) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/info',
    method: 'get',
    params: { id }
  });
}

/**
 * 根据订单号查询明细列表
 * @param orderNumber 订单号
 */
export function getDetailListByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 根据订单明细ID查询批属性值
 * @param suggestionOrderDetailId 采购建议单明细ID
 */
export function queryLotAttributeValueByOrderDetailId(suggestionOrderDetailId: string | number) {
  return request<any>({
    url: `/ics/purchaseSuggestionOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/${suggestionOrderDetailId}`,
    method: 'get'
  });
}

/**
 * 通知供应商
 * @param idList 订单ID列表
 */
export function noticeSupplier(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/noticeSupplier',
    method: 'post',
    data: idList
  });
}

/**
 * 通知供应商撤回
 * @param idList 订单ID列表
 */
export function noticeSupplierRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/noticeSupplierRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 生成采购入库单
 * @param idList 订单ID列表
 */
export function generatePurchaseInOrder(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/generatePurchaseInOrder',
    method: 'post',
    data: idList
  });
}

/**
 * 生成采购入库单撤回
 * @param idList 订单ID列表
 */
export function generatePurchaseInOrderRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/generatePurchaseInOrderRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 供应商确认订单
 * @param orderNumber 订单号
 */
export function supplierConfirm(orderNumber: string) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/supplierConfirm',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 手动确认订单
 * @param idList 订单ID列表
 */
export function manuConfirm(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/manuConfirm',
    method: 'post',
    data: idList
  });
}

/**
 * 订单确认撤回
 * @param idList 订单ID列表
 */
export function confirmRepeal(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/confirmRepeal',
    method: 'post',
    data: idList
  });
}

/**
 * 根据订单号查询订单状态记录
 * @param orderNumber 订单号
 */
export function getMonitorOrderStatusByOrderNumber(orderNumber: string) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  });
}

/**
 * 删除订单明细
 * @param idList 明细ID列表
 */
export function deleteByIds(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/purchaseSuggestionOrder/orderDetail/deleteByIds',
    method: 'post',
    data: idList
  });
}

/**
 * 导入采购建议单
 */
export function importFile() {
  return requestUrl('/ics/purchaseSuggestionOrder/import');
}

/**
 * 导出采购建议单
 * @param params 查询参数
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/purchaseSuggestionOrder/export',
    method: 'post',
    data: params
  });
}

const suggestionApi = {
  getListPage,
  save,
  update,
  cancelOrder,
  info,
  getDetailListByOrderNumber,
  queryLotAttributeValueByOrderDetailId,
  noticeSupplier,
  noticeSupplierRepeal,
  generatePurchaseInOrder,
  generatePurchaseInOrderRepeal,
  supplierConfirm,
  manuConfirm,
  confirmRepeal,
  getMonitorOrderStatusByOrderNumber,
  deleteByIds,
  importFile,
  exportFile
};

export default suggestionApi;
