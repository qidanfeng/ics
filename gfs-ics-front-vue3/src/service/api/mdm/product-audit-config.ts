import { request } from '../../request';

export function getListPage(params: any) {
  return request<any>({
    url: '/mdm/productAuditConfig/getPageList',
    method: 'post',
    data: params
  });
}

export function save(params: any) {
  return request<any>({
    url: '/mdm/productAuditConfig/save',
    method: 'post',
    data: params
  });
}

export function update(params: any) {
  return request<any>({
    url: '/mdm/productAuditConfig/update',
    method: 'post',
    data: params
  });
}

export function info(id: string | number) {
  return request<any>({
    url: '/mdm/productAuditConfig/info',
    method: 'get',
    params: { id }
  });
}

export function updateStatusByIds(params: any[]) {
  return request<any>({
    url: '/mdm/productAuditConfig/updateStatusByIds',
    method: 'post',
    data: params
  });
}

export function deleteBatch(ids: (string | number)[]) {
  return request<any>({
    url: '/mdm/productAuditConfig/deleteBatch',
    method: 'post',
    data: ids
  });
}

const productAuditConfigApi = {
  getListPage,
  save,
  update,
  info,
  updateStatusByIds,
  deleteBatch
};

export default productAuditConfigApi;