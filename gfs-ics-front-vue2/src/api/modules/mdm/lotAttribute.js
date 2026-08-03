import request from '@/api/request'
import requestUrl from '@/api/requestUrl'


export function  queryLotAttributeByCustomerId(customerId, productId) {
  return request({
    url:  process.env.VUE_APP_MDM_BASE_URL + '/lotAttribute/queryByCustomerIdAndProductId?customerId='+customerId+"&productId="+productId,
    method: 'get'
  })
}


