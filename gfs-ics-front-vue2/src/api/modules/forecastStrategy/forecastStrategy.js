import request from '@/api/request'

export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/getListPage',
    method: 'post',
    data: params
  })
}

export function getHisOutStockDataList(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/getHisOutStockDataList',
    method: 'post',
    data: params
  })
}

export function forecast(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/forecast',
    method: 'post',
    data: params
  })
}

export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/update',
    method: 'post',
    data: params
  })
}

export function openOrClose(ids) {
  return request({
    url:  process.env.VUE_APP_ICS_BASE_URL + '/forecastStrategyConfig/openOrClose',
    method: 'post',
    data:ids
  })
}

