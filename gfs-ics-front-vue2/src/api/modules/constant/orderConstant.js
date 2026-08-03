import request from '@/api/request'

/**
 * 获取所有单据类型
 */
export function getDocumentTypeList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getDocumentTypeList',
    method: 'get'
  })
}

/**
 * 获取所有单据类型
 */
export function getDocumentTypeListForBill() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getDocumentTypeListForBill',
    method: 'get'
  })
}

/**
 * 获取所有采购建议单-订单状态
 */
export function getPurchaseSuggestionOrderStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getPurchaseSuggestionOrderStatusList',
    method: 'get'
  })
}

/**
 * 获取所有采购建议单-送货方式
 */
export function getPurchaseDeliveryMethodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getPurchaseDeliveryMethodList',
    method: 'get'
  })
}

/**
 * 获取所有采购入库单-订单状态
 */
export function getPurchaseInOrderStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getPurchaseInOrderStatusList',
    method: 'get'
  })
}

/**
 * 获取所有库存调拨单-订单状态
 */
export function getInventoryTransferOrderStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getInventoryTransferOrderStatusList',
    method: 'get'
  })
}

/**
 * 获取所有库存调拨单-送货方式
 */
export function getTransferDeliveryMethodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getTransferDeliveryMethodList',
    method: 'get'
  })
}
/**
 * 获取所有出库状态
 * @return
 */
export function getOutStockStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getOutStockStatusList',
    method: 'get'
  })
}

/**
 * 获取所有退供出库单-订单状态
 */
export function getReturnSupplierOutOrderStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getReturnSupplierOutOrderStatusList',
    method: 'get'
  })
}

/**
 * 获取所有退供出库单-送货方式
 */
export function getReturnSupplierDeliveryMethodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getReturnSupplierDeliveryMethodList',
    method: 'get'
  })
}
/**
 * 获取所有下发状态
 * @return
 */
export function getIssueStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getIssueStatusList',
    method: 'get'
  })
}

export function getInStockStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getInStockStatusList',
    method: 'get'
  })
}

/**
 * 获取所有费用类型
 */
export function getCostTypeList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/bill/getCostTypeList',
    method: 'get'
  })
}


/**
 * 获取所有费用计算方式
 */
export function getCalculationMethodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/bill/getCalculationMethodList',
    method: 'get'
  })
}
/**
 * 获取所有送货方式
 */
export function getDeliveryMethodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/getDeliveryMethodList',
    method: 'get'
  })
}

/**
 * 获取所有月结账单-状态
 */
export function getBillMonthRecordStatusList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/bill/getBillMonthRecordStatusList',
    method: 'get'
  })
}

/**
 * 获取数据周期列表
 */
export function getDataPeriodList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/forecast/getDataPeriodList',
    method: 'get'
  })
}

/**
 * 获取所有库存类型
 */
export function getInventoryTypeList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/constant/icsInventory/getInventoryTypeList',
    method: 'get'
  })
}
