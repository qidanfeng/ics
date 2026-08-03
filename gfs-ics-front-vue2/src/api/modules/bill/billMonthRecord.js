import request from "@/api/request";

export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 生成月结账单
 */
export function generate(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/generate',
    method: 'post',
    data: params
  })
}

/**
 * 重新月结
 */
export function reGenerate(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/reGenerate',
    method: 'post',
    data: idList
  })
}

/**
 * 确认月结账单
 */
export function confirm(idList) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/confirm',
    method: 'post',
    data: idList
  })
}

/**
 * 导出月结账单
 */
export function exportFile(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

/**
 * 根据账单号获取明细列表
 */
export function getDetailListByBillNumber(billNumber) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/billMonthRecord/recordDetail/getDetailListByBillNumber',
    method: 'get',
    params: { billNumber }
  })
}
