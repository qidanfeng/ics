import request from '@/api/request'
import requestParam from '@/api/requestParam'

import requestUrl from '@/api/requestUrl'





export function queryEntityByProductNumberAndCustomerId(productNumber,customerId) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/product/queryEntityByProductNumberAndCustomerId?productNumber='+productNumber+"&customerId="+customerId,
    method: 'get',
  })
}

export function queryEntityByProductCnNameAndCustomerId(productCnName,customerId) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/product/queryEntityByProductCnNameAndCustomerId?productCnName='+productCnName+"&customerId="+customerId,
    method: 'get',
  })
}
export function getProductPackByProductId(productId) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/productPack/getProductPack',
    method: 'get',
    params:{productId}
  })
}
