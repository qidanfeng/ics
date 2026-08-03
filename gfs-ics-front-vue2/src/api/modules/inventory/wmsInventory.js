import request from '@/api/request'

/**
 * WMS库存查询API
 */

/**
 * 查询库存
 */
export function queryInventory(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/wmsInventory/queryInventory',
    method: 'post',
    data: params
  })
}
