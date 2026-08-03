import request from '@/api/request'

export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/averageForecastStrategyConfig/getListPage',
    method: 'post',
    data: params
  })
}

export function save(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/averageForecastStrategyConfig/save',
    method: 'post',
    data: params
  })
}

/**
 * 更新
 */
export function update(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/averageForecastStrategyConfig/update',
    method: 'post',
    data: params
  })
}

export function openOrClose(ids) {
  return request({
    url:  process.env.VUE_APP_ICS_BASE_URL + '/averageForecastStrategyConfig/openOrClose',
    method: 'post',
    data:ids
  })
}

export function manuForecast(ids) {
  return request({
    url:  process.env.VUE_APP_ICS_BASE_URL + '/averageForecastStrategyConfig/manuForecast',
    method: 'post',
    data:ids
  })
}
