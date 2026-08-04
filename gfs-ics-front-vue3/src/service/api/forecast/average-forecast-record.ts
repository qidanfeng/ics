import { request } from '../../request';

/**
 * 分页查询平均预测记录
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/averageForecastRecord/getListPage',
    method: 'post',
    data: params
  });
}

const averageForecastRecordApi = {
  getListPage
};

export default averageForecastRecordApi;
