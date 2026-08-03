import request from '@/api/request'
import requestParam from '@/api/requestParam'

import isInteger from 'lodash/isInteger'

export function list (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/list',
    method: 'get',
    params: requestParam(params, 'get')
  })
}


export function info (id) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/info?id=' + id,
    method: 'get',
    params: requestParam({}, 'get')
  })
}


export function queryAll () {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/queryAll',
    method: 'get',
  })
}


export function queryByType (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/queryByType',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

export function queryByParentType (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/queryByParentType',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

export function queryByParentIds (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/queryByParentIds',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

export function addOrUpdate (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/'+params.url,
    method: 'post',
    data: requestParam(params)
  })
}

export function del (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/delete',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}


export function updateStatusByIds (params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/updateStatusByIds',
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}
export function exportData(params) {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/export',
    method: 'get',
    params: requestParam(params, 'get'),
    responseType: 'blob'
  })
}


export function queryAllTypeList () {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/queryAllTypeList',
    method: 'get',
  })
}
export function getListTree () {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/getListTree',
    method: 'get',
  })
}

export function getOrderTypeGroupList () {
  return request({
    url: process.env.VUE_APP_MDM_BASE_URL + '/dictionary/getOrderTypeGroupList',
    method: 'get',
  })
}
