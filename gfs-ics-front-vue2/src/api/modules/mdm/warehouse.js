import request from '@/api/request'
import requestUrl from '@/api/requestUrl'
import requestParam from '@/api/requestParam'


export function  getActivatedWarehouseByParams(params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/warehouse/getActivatedWarehouseByParams',
    method: 'post',
    data:params
  })
}
