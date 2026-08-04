import { request } from '../../request';

/**
 * 分页查询平均预测策略配置
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/averageForecastStrategyConfig/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 保存平均预测策略配置
 * @param params
 */
export function save(params: any) {
  return request<any>({
    url: '/ics/averageForecastStrategyConfig/save',
    method: 'post',
    data: params
  });
}

/**
 * 更新平均预测策略配置
 * @param params
 */
export function update(params: any) {
  return request<any>({
    url: '/ics/averageForecastStrategyConfig/update',
    method: 'post',
    data: params
  });
}

/**
 * 批量激活/关闭平均预测策略配置
 * @param ids
 */
export function openOrClose(ids: (string | number)[]) {
  return request<any>({
    url: '/ics/averageForecastStrategyConfig/openOrClose',
    method: 'post',
    data: ids
  });
}

/**
 * 手动执行预测
 * @param ids
 */
export function manuForecast(ids: (string | number)[]) {
  return request<any>({
    url: '/ics/averageForecastStrategyConfig/manuForecast',
    method: 'post',
    data: ids
  });
}

const averageForecastStrategyApi = {
  getListPage,
  save,
  update,
  openOrClose,
  manuForecast
};

export default averageForecastStrategyApi;
