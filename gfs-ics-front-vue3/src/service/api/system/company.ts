import { request } from '../../request';

/** 查询当前用户拥有的公司 */
export function queryCurrentUserOwnCompany() {
  return request<any[]>({
    url: '/system/company/queryCurrentUserOwnCompany',
    method: 'get'
  });
}


// 获取所有公司列表（用于选择输入）
export function getAllCompanyListForSelectInput() {
  return request<any>({
    url: '/system/company/queryAllCompany',
    method: 'get'
  });

}

/**
 * 获取公司分页列表
 * @param params
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/system/company/getListPage',
    method: 'post',
    data: params
  });
}
