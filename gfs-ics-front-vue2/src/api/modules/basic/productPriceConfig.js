import request from "@/api/request";
import requestUrl from "@/api/requestUrl";

/**
 * 分页查询产品订存配置
 */
export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/getListPage',
    method: 'post',
    data: params
  })
}

/**
 * 保存产品订存配置
 */
export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新产品订存配置
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/update',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除产品订存配置
 */
export function deleteByIds(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/deleteByIds',
    method: 'post',
    data: params
  })
}

/**
 * 批量激活/关闭产品订存配置
 */
export function openOrClose(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/openOrClose',
    method: 'post',
    data: params
  })
}

/**
 * 根据ID查询产品订存配置详情
 */
export function info(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/info',
    method: 'get',
    params: params
  })
}

/**
 * 按客户查询供应商
 */
export function getSupplierByClientId(clientId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getSupplierByClientId',
    method: 'get',
    params: { clientId }
  })
}

/**
 * 按客户、供应商查询仓库
 */
export function getWarehouseBySupplierId(clientId, supplierId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getWarehouseBySupplierId',
    method: 'get',
    params: { clientId, supplierId }
  })
}

/**
 * 按客户、供应商、仓库查询货主
 */
export function getProjectBySupplierAndWarehouseCode(clientId, supplierId, warehouseCode) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getProjectBySupplierAndWarehouseCode',
    method: 'get',
    params: { clientId, supplierId, warehouseCode }
  })
}

/**
 * 按客户查询仓库
 */
export function getWarehouseByClientId(clientId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getWarehouseByClientId',
    method: 'get',
    params: { clientId}
  })
}
/**
 * 按客户查询货主
 */
export function getProjectByClientId(clientId) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getProjectByClientId',
    method: 'get',
    params: { clientId}
  })
}



/**
 * 模糊查询供应商、仓库、货主下的产品
 */
export function fuzzyQueryProduct(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/fuzzyQueryProduct',
    method: 'post',
    data: params
  })
}

export function getProjectByWarehouseCode(clientId, warehouseCode) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/supplierInfo/getProjectByWarehouseCode',
    method: 'get',
    params: { clientId, warehouseCode }
  })
}


/**
 * 产品价格配置导入-新增
 */
export function importFile () {
  return requestUrl(process.env.VUE_APP_ICS_BASE_URL +`/productPriceConfig/import`)
}
/**
 * 产品价格配置导入-更新
 */
export function importFileForUpdate () {
  return requestUrl(process.env.VUE_APP_ICS_BASE_URL +`/productPriceConfig/importForUpdate`)
}

/**
 * 导出
 */
export function exportFile (params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/productPriceConfig/export',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}


