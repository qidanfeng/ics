import request from '@/api/request'


// 获取货主级地址
export function  getAddressVosByCustomerId(customerId) {
  return request({
    url:  process.env.VUE_APP_MDM_BASE_URL + '/address/getAddressVosByCustomerId?customerId='+customerId,
    method: 'get'
  })
}
