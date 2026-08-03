import request from "@/api/request";
import requestUrl from "@/api/requestUrl";

/**
 * 分页查询订购量配置
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存订购量配置
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新订购量配置
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/update',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除订购量配置
 */
export function deleteByIds(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/deleteByIds',
    method: 'post',
    data: params
  })
}

/**
 * 根据ID查询订购量配置详情
 */
export function info(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/info',
    method: 'get',
    params: params
  })
}


/**
 * 产品价格配置导入-新增
 */
export function importFile () {
  return requestUrl(process.env.VUE_APP_ICS_BASE_URL +`/orderQuantityConfig/import`)
}

/**
 * 导出
 */
export function exportFile (params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/orderQuantityConfig/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}


