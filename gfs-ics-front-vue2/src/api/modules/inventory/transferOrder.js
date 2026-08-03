import request from '@/api/request'

/**
 * 库存调拨单 API
 */

/**
 * 获取库存调拨单分页列表
 * @param {Object} params - 查询参数对象
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.orderNumber - 订单号（可选）
 * @param {string} params.status - 订单状态（可选）
 * @returns {Promise} 返回分页数据
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存库存调拨单
 * @param {Object} params - 库存调拨单数据
 * @param {string} params.orderNumber - 订单号
 * @param {Array} params.orderDetails - 订单明细列表
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回保存结果
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新库存调拨单
 * @param {Object} params - 更新数据
 * @param {string} params.id - 订单ID
 * @param {string} params.orderNumber - 订单号
 * @param {Array} params.orderDetails - 订单明细列表
 * @param {string} params.remark - 备注（可选）
 * @returns {Promise} 返回更新结果
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/update',
    method: 'post',
    data: params
  })
}

/**
 * 取消库存调拨单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回取消结果
 */
export function cancelOrder(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/cancelOrder',
    method: 'post',
    data: idList
  })
}

/**
 * 下发库存调拨单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回下发结果
 */
export function issue(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/issue',
    method: 'post',
    data: idList
  })
}

/**
 * 撤回已下发的库存调拨单
 * @param {Array} idList - 订单ID列表
 * @returns {Promise} 返回撤回结果
 */
export function issueRepeal(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/issueRepeal',
    method: 'post',
    data: idList
  })
}

/**
 * 获取库存调拨单详情
 * @param {string} id - 订单ID
 * @returns {Promise} 返回订单详情数据
 */
export function info(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/info',
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
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/orderDetail/getDetailListByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 删除订单明细
 * @param {Array} orderDetailIdList - 订单明细ID列表
 * @returns {Promise} 返回删除结果
 */
export function deleteOrderDetails(orderDetailIdList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/orderDetail/deleteByIds',
    method: 'post',
    data: orderDetailIdList
  })
}

/**
 * 根据订单明细ID查询批次属性值
 * @param {string} inventoryTransferOrderDetailId - 库存调拨单明细ID
 * @returns {Promise} 返回批次属性值列表
 */
export function queryLotAttributeValueByOrderDetailId(inventoryTransferOrderDetailId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/orderDetailLotAttribute/queryLotAttributeValueByOrderDetailId/' + inventoryTransferOrderDetailId,
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
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/orderIssueLog/getByOrderNumber',
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
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/monitorOrderStatus/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}
/**
 * 根据OMS主单订单号查询OMS入库订单回传明细
 */
export function getInOmsOrderCallbackInfo(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/callbackInfo/in',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据OMS主单订单号查询OMS出库订单回传明细
 */
export function getOutOmsOrderCallbackInfo(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/callbackInfo/out',
    method: 'get',
    params: { id }
  })
}


/**
 * 根据订单号查询订单回传日志
 */
export function getCallbackLogByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/callbackLog/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 回传重试
 */
export function callbackLogRetry(callbackLogId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/callbackLog/retry',
    method: 'get',
    params: { callbackLogId }
  })
}


/**
 * 根据订单号查询费用详情
 */
export function getBillByOrderNumber(orderNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/bill/getByOrderNumber',
    method: 'get',
    params: { orderNumber }
  })
}

/**
 * 保存费用
 */
export function billSave(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/bill/save',
    method: 'post',
    data: params
  })
}
/**
 * 更新费用
 */
export function billUpdate(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/bill/update',
    method: 'post',
    data: params
  })
}

/**
 * 导出库存调拨单
 */
export function exportFile(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/inventoryTransferOrder/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

