import { request } from '../../request';
import requestUrl from '../../request/requestUrl';

/**
 * 获取产品审核分页列表
 * @param params
 */
export function getModifiedConfirmPageList(params: any) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/getModifiedConfirmPageList',
    method: 'post',
    data: params
  });
}

/**
 * 确认修改
 * @param ids
 */
export function confirmModified(ids: (string | number)[]) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/confirmModified',
    method: 'post',
    data: ids
  });
}

/**
 * 放弃修改
 * @param ids
 */
export function abandonModified(ids: (string | number)[]) {
  return request<any>({
    url: '/mdm/productModifiedConfirm/abandonModified',
    method: 'post',
    data: ids
  });
}

/**
 * 获取数据来源列表
 */
export function getDataResourcesList() {
  return request<any>({
    url: '/mdm/productModifiedConfirm/getDataResourcesList',
    method: 'post'
  });
}

const productAuditsApi = {
  getModifiedConfirmPageList,
  confirmModified,
  abandonModified,
  getDataResourcesList
};

export default productAuditsApi;
