import request from '@/api/request'

/**
 * 采购入库单 API
 */

/**
 * 获取采购入库单分页列表
 * @param {Object} params - 查询参数对象
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.orderNumber - 订单号（可选）
 * @param {string} params.status - 订单状态（可选）
 * @returns {Promise} 返回分页数据
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存采购入库单
 * @param {Object} params - 采购入库单数据
 * @param {string} params.orderNumber - 订单号
 * @param {Array} params.orderDetails - 订单明细列表
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回保存结果
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新采购入库单
 * @param {Object} params - 更新数据
 * @param {string} params.id - 订单ID
 * @param {string} params.orderNumber - 订单号
 * @param {Array} params.orderDetails - 订单明细列表
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回更新结果
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/update',
    method: 'post',
    data: params
  })
}

/**
 * 取消采购入库单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回取消结果
 */
export function cancelOrder(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/cancelOrder',
    method: 'post',
    data: idList
  })
}

/**
 * 下发采购入库单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回下发结果
 */
export function issue(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/issue',
    method: 'post',
    data: idList
  })
}

/**
 * 撤回已下发的采购入库单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回撤回结果
 */
export function issueRepeal(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/issueRepeal',
    method: 'post',
    data: idList
  })
}

/**
 * 获取采购入库单详情
 * @param {string} id - 订单ID
 * @returns {Promise} 返回订单详情数据
 */
export function info(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/info',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据订单号获取订单明细列表
 * @param {string} orderNumber - 订单号
 * @returns {Promise} 返回订单明细列表
 */
export function getDetailListByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 根据订单明细ID查询批次属性值
 * @param {string} purchaseInOrderDetailId - 采购入库单明细ID
 * @returns {Promise} 返回批次属性值列表
 */
export function queryLotAttributeValueByOrderDetailId(purchaseInOrderDetailId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/' + purchaseInOrderDetailId,
    method: 'get'
  })
}

/**
 * 根据订单号获取订单下发日志
 * @param {string} orderNumber - 订单号
 * @returns {Promise} 返回下发日志列表
 */
export function getOrderIssueLogByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/orderIssueLog/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 根据订单号获取订单监控状态
 * @param {string} orderNumber - 订单号
 * @returns {Promise} 返回监控状态信息
 */
export function getMonitorOrderStatusByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 根据OMS主单订单号查询OMS入库订单回传明细
 */
export function getInOmsOrderCallbackInfo(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/callbackInfo/in',
    method: 'get',
    params: { id }
  })
}


/**
 * 根据订单号查询订单回传日志
 */
export function getCallbackLogByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/callbackLog/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 回传重试
 */
export function callbackLogRetry(callbackLogId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/callbackLog/retry',
    method: 'get',
    params: { callbackLogId }
  })
}

/**
 * 根据订单号查询费用详情
 */
export function getBillByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/bill/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 保存费用
 */
export function billSave(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/bill/save',
    method: 'post',
    data: params
  })
}
/**
 * 更新费用
 */
export function billUpdate(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/bill/update',
    method: 'post',
    data: params
  })
}

/**
 * 导出采购入库单
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回导出结果
 */
export function exportFile(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
/**
 * 完成订单
 */
export function finishOrders(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseInOrder/finishOrders',
    method: 'post',
    data: idList
  })
}








