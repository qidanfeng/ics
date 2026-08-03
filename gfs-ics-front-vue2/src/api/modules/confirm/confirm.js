import NoLoginRequest from "@/api/noLoginRequest";

/**
 * 查询供应商确认订单的订单信息
 */
export function getSupplierConfirmOrderInfo (orderNumber) {
  return NoLoginRequest({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/getSupplierConfirmOrderInfo',
    method: 'get',
    params: { orderNumber }
  })
}



/**
 * 供应商确认订单
 */
export function supplierConfirm (orderNumber) {
  return NoLoginRequest({
    url: process.env.VUE_APP_ICS_BASE_URL + '/purchaseSuggestionOrder/supplierConfirm',
    method: 'get',
    params: { orderNumber }
  })
}
