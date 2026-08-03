import request from '@/api/request'
import requestUrl from '@/api/requestUrl'




// 获取货主级供应商
export function  getSupplierVoByCustomerId(customerId) {
  return request({
    url:  process.env.VUE_APP_MDM_BASE_URL + '/supplier/getSupplierVoByCustomerId?customerId='+customerId,
    method: 'get'
  })
}
