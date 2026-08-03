import request from '@/api/request'

export function queryForHisForecast(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/forecastRecord/recordDetail/queryForHisForecast',
    method: 'post',
    data: params
  })
}
