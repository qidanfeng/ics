import request from '@/api/request'
import requestUrl from '@/api/requestUrl'
import requestParam from '@/api/requestParam'
import isInteger from 'lodash/isInteger'


/**
 * 获取指定客户的项目
 * @param id
 */
// export function  getProjectListByClientId(clientId) {
//   return request({
//     url: process.env.VUE_APP_MDM_BASE_URL + '/project/getProjectListByClientId',
//     method: 'post',
//     data: clientId
//   })
// }

export function  getActivatedProjectByClient(clientId) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/project/getActivatedProjectByClientId?externalClientId='+clientId,
    method: 'get'
  })
}

// export function queryActivatedUserOwnProjectInfo(params) {
//   return request({
//     url: process.env.VUE_APP_MDM_BASE_URL + '/project/queryActivatedUserOwnProjectInfo',
//     method: 'get',
//     params: requestParam(params, 'get')
//   })
// }

export function queryBusinessType(params) {
  return request({
    url: requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/project/queryBusinessType'),
    method: 'get',
    data:params
  })
}

/**
 * 获取所有货主
 * @returns
 */
export function getAllCustomer() {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/project/getAllCustomer',
    method: 'post',
  })
}
