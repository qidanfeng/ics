import request from "@/api/request";

export function getListPage(params) {
  return request({
    url: process.env.VUE_APP_ICS_BASE_URL + '/averageForecastRecord/getListPage',
    method: 'post',
    data: params
  })
}
