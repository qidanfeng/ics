import request from "@/api/request";
import requestParam from "@/api/requestParam";

/**
 * 分页查询费用计算配置
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存费用计算配置
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新费用计算配置
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/update',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除费用计算配置
 */
export function deleteByIds(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/deleteByIds',
    method: 'post',
    data: params
  })
}

/**
 * 根据ID查询费用计算配置详情
 */
export function info(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/info',
    method: 'get',
    params: params
  })
}

/**
 * 按客户查询供应商
 */
export function getSupplierByClientId(clientId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getSupplierByClientId',
    method: 'get',
    params: { clientId }
  })
}

/**
 * 按客户、供应商查询货主
 */
export function getProjectBySupplierId(clientId, supplierId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getProjectBySupplierId',
    method: 'get',
    params: { clientId, supplierId }
  })
}

/**
 * 获取费用类型选项
 */
export function getCostTypeOptions() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getCostTypeOptions',
    method: 'get'
  })
}

/**
 * 获取单据类型选项
 */
export function getDocumentTypeOptions() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getDocumentTypeOptions',
    method: 'get'
  })
}

/**
 * 获取送货方式选项
 */
export function getDeliveryMethodOptions() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getDeliveryMethodOptions',
    method: 'get'
  })
}

/**
 * 获取计算方式选项
 */
export function getCalculationMethodOptions() {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/costCalculationConfig/getCalculationMethodOptions',
    method: 'get'
  })
}
