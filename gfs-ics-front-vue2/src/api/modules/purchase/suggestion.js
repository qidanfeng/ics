import request from "@/api/request";
import requestParam from "@/api/requestParam";
import requestUrl from "@/api/requestUrl";

/**
 * 分页查询采购建议单
 */
export function getListPage (params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存采购建议单
 */
export function save (purchaseSuggestionOrder) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/save',
    method: 'post',
    data: purchaseSuggestionOrder
  })
}

/**
 * 更新采购建议单
 */
export function update (purchaseSuggestionOrder) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/update',
    method: 'post',
    data: purchaseSuggestionOrder
  })
}

/**
 * 根据id集合取消订单
 */
export function cancelOrder (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/cancelOrder',
    method: 'post',
    data: idList
  })
}

/**
 * 根据ID查询采购建议单详情
 */
export function info (id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/info',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据订单号查询明细列表
 */
export function getDetailListByOrderNumber (orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 根据订单明细ID查询批属性值
 */
export function queryLotAttributeValueByOrderDetailId (suggestionOrderDetailId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/' + suggestionOrderDetailId,
    method: 'get'
  })
}
/**
 * 通知供应商
 */
export function noticeSupplier (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/noticeSupplier',
    method: 'post',
    data: idList
  })
}


/**
 * 生成采购入库单
 */
export function generatePurchaseInOrder (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/generatePurchaseInOrder',
    method: 'post',
    data: idList
  })
}
/**
 * 生成采购入库单撤回
 */
export function generatePurchaseInOrderRepeal (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/generatePurchaseInOrderRepeal',
    method: 'post',
    data: idList
  })
}



/**
 * 供应商确认订单
 */
export function supplierConfirm (orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/supplierConfirm',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 手动确认订单
 */
export function manuConfirm (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/manuConfirm',
    method: 'post',
    data: idList
  })
}

/**
 * 根据订单号查询订单状态记录
 */
export function getMonitorOrderStatusByOrderNumber (orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 删除订单明细
 */
export function deleteByIds (idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/orderDetail/deleteByIds',
    method: 'post',
    data: idList
  })
}

/**
 * 导入采购建议单
 */
export function importFile () {
  return requestUrl(process.env.VUE_APP_ICS_BASE_URL + `/purchaseSuggestionOrder/import`)
}

/**
 * 导出采购建议单
 */
export function exportFile (params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
