import { request } from '../../request';

/**
 * 获取所有单据类型
 */
export function getDocumentTypeList() {
  return request<any>({
    url: '/ics/constant/getDocumentTypeList',
    method: 'get'
  });
}

/**
 * 获取所有单据类型（用于账单）
 */
export function getDocumentTypeListForBill() {
  return request<any>({
    url: '/ics/constant/getDocumentTypeListForBill',
    method: 'get'
  });
}

/**
 * 获取所有采购建议单-订单状态
 */
export function getPurchaseSuggestionOrderStatusList() {
  return request<any>({
    url: '/ics/constant/getPurchaseSuggestionOrderStatusList',
    method: 'get'
  });
}

/**
 * 获取所有采购建议单-送货方式
 */
export function getPurchaseDeliveryMethodList() {
  return request<any>({
    url: '/ics/constant/getPurchaseDeliveryMethodList',
    method: 'get'
  });
}

/**
 * 获取所有采购入库单-订单状态
 */
export function getPurchaseInOrderStatusList() {
  return request<any>({
    url: '/ics/constant/getPurchaseInOrderStatusList',
    method: 'get'
  });
}

/**
 * 获取所有库存调拨单-订单状态
 */
export function getInventoryTransferOrderStatusList() {
  return request<any>({
    url: '/ics/constant/getInventoryTransferOrderStatusList',
    method: 'get'
  });
}

/**
 * 获取所有库存调拨单-送货方式
 */
export function getTransferDeliveryMethodList() {
  return request<any>({
    url: '/ics/constant/getTransferDeliveryMethodList',
    method: 'get'
  });
}

/**
 * 获取所有出库状态
 */
export function getOutStockStatusList() {
  return request<any>({
    url: '/ics/constant/getOutStockStatusList',
    method: 'get'
  });
}

/**
 * 获取所有退供出库单-订单状态
 */
export function getReturnSupplierOutOrderStatusList() {
  return request<any>({
    url: '/ics/constant/getReturnSupplierOutOrderStatusList',
    method: 'get'
  });
}

/**
 * 获取所有退供出库单-送货方式
 */
export function getReturnSupplierDeliveryMethodList() {
  return request<any>({
    url: '/ics/constant/getReturnSupplierDeliveryMethodList',
    method: 'get'
  });
}

/**
 * 获取所有下发状态
 */
export function getIssueStatusList() {
  return request<any>({
    url: '/ics/constant/getIssueStatusList',
    method: 'get'
  });
}

/**
 * 获取所有入库状态
 */
export function getInStockStatusList() {
  return request<any>({
    url: '/ics/constant/getInStockStatusList',
    method: 'get'
  });
}

/**
 * 获取所有费用类型
 */
export function getCostTypeList() {
  return request<any>({
    url: '/ics/constant/bill/getCostTypeList',
    method: 'get'
  });
}

/**
 * 获取所有费用计算方式
 */
export function getCalculationMethodList() {
  return request<any>({
    url: '/ics/constant/bill/getCalculationMethodList',
    method: 'get'
  });
}

/**
 * 获取所有送货方式
 */
export function getDeliveryMethodList() {
  return request<any>({
    url: '/ics/constant/getDeliveryMethodList',
    method: 'get'
  });
}

/**
 * 获取所有月结账单-状态
 */
export function getBillMonthRecordStatusList() {
  return request<any>({
    url: '/ics/constant/bill/getBillMonthRecordStatusList',
    method: 'get'
  });
}

/**
 * 获取数据周期列表
 */
export function getDataPeriodList() {
  return request<any>({
    url: '/ics/constant/forecast/getDataPeriodList',
    method: 'get'
  });
}

/**
 * 获取所有库存类型
 */
export function getInventoryTypeList() {
  return request<any>({
    url: '/ics/constant/icsInventory/getInventoryTypeList',
    method: 'get'
  });
}

const orderConstantApi = {
  getDocumentTypeList,
  getDocumentTypeListForBill,
  getPurchaseSuggestionOrderStatusList,
  getPurchaseDeliveryMethodList,
  getPurchaseInOrderStatusList,
  getInventoryTransferOrderStatusList,
  getTransferDeliveryMethodList,
  getOutStockStatusList,
  getReturnSupplierOutOrderStatusList,
  getReturnSupplierDeliveryMethodList,
  getIssueStatusList,
  getInStockStatusList,
  getCostTypeList,
  getCalculationMethodList,
  getDeliveryMethodList,
  getBillMonthRecordStatusList,
  getDataPeriodList,
  getInventoryTypeList
};

export default orderConstantApi;
