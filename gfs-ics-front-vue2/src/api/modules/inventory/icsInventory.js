import request from '@/api/request'

/**
 * 分页查询ics库存
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/icsInventory/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 导出ics库存
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回导出结果
 */
export function exportFile(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/icsInventory/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}
