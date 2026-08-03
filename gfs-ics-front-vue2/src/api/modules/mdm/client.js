import request from '@/api/request'
import requestUrl from '@/api/requestUrl'
import requestParam from '@/api/requestParam'
import isInteger from 'lodash/isInteger'


export function  getListPage(params) {
  return request({
    url: requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/client/getListPage'),
    method: 'post',
    data:params
  })
}

export function addOrUpdate(params){
  return request({
    url:  requestUrl(params.addOrUpdate ? process.env.VUE_APP_MDM_BASE_URL + `/client/update`:process.env.VUE_APP_MDM_BASE_URL + `/client/save`),
    method: 'post',
    data:params
  })
};

export function  deleteById(id) {
  return request({
    url:  requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/client/deleteById?id='+id),
    method: 'get'
  })
}

export function info (id) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/info?id=' + id,
    method: 'get',
    params: requestParam({}, 'get')
  })
}

/**
 * 获取所有客户
 * @returns {AxiosPromise}
 */
export function getAllClient() {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/getAllClient',
    method: 'post',
  })
}

export function updateStatusByIds (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/updateStatusByIds',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

/**
 * 通过统一社会信用代码查询客户
 * @param id
 */
export function  getClientByUnifiedSocialCreditCode(unifiedSocialCreditCode) {
  return request({
    url:  requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/client/getClientByUnifiedSocialCreditCode?unifiedSocialCreditCode='+unifiedSocialCreditCode),
    method: 'get'
  })
}

/**
 *客户下发
 * @param params
 * @returns {AxiosPromise}
 */
export function clientDown(params){
  return request({
    url:  requestUrl(process.env.VUE_APP_MDM_BASE_URL + `/client/clientDown`),
    method: 'post',
    data:params
  })
};
/**
 * 验证客户是否可以被取消勾选
 * @param id
 */
export function  verifyUncheckedOrNot(clientId,companyId,companyType) {
  return request({
    url:  requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/client/verifyUncheckedOrNot?clientId='+clientId+'&companyId='+companyId+'&companyType='+companyType),
    method: 'get'
  })
}

export function queryActivatedUserOwnClient(params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/queryActivatedUserOwnClient',
    method: 'get',
    params: requestParam(params, 'get')
  })
}

export function queryActivatedUserOwnClientInfo(params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/queryActivatedUserOwnClientInfo',
    method: 'get',
    params: requestParam(params, 'get')
  })
}

export function queryActivatedOwnClientInfo(params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/queryActivatedOwnClientInfo',
    method: 'get',
    params: requestParam(params, 'get')
  })
}

export function getActivatedClientByProject(projectId) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/client/getActivatedClientByProject?projectId=' + projectId,
    method: 'get'
  })
}

export function  getClientInfoByProjectId(projectId) {
  return request({
    url:  requestUrl(process.env.VUE_APP_MDM_BASE_URL + '/client/getClientByProjectId?projectId='+projectId),
    method: 'get'
  })
}
