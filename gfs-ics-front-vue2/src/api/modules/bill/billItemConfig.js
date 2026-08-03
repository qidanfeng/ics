import request from "@/api/request";
import requestParam from "@/api/requestParam";

/**
 * 分页查询费项配置
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存费项配置
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新费项配置
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/update',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除费项配置
 */
export function deleteByIds(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/deleteByIds',
    method: 'post',
    data: params
  })
}

/**
 * 根据ID查询费项配置详情
 */
export function info(id) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/info',
    method: 'get',
    params: {id}
  })
}

/**
 * 根据费项编码查询配置
 */
export function getByCostItemCode(code) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/getByCostItemCode',
    method: 'get',
    params: {code}
  })
}


export function getAllCostItemCodeList() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costItemConfig/getAllCostItemCodeList',
    method: 'get'
  })
}



















