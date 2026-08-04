import { request, blobRequest } from '../../request';

/**
 * 分页查询月结账单
 */
export function getListPage(params: any) {
  return request<any>({
    url: '/ics/billMonthRecord/getListPage',
    method: 'post',
    data: params
  });
}

/**
 * 生成月结账单
 */
export function generate(params: any) {
  return request<any>({
    url: '/ics/billMonthRecord/generate',
    method: 'post',
    data: params
  });
}

/**
 * 重新月结
 */
export function reGenerate(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/billMonthRecord/reGenerate',
    method: 'post',
    data: idList
  });
}

/**
 * 确认月结账单
 */
export function confirm(idList: (string | number)[]) {
  return request<any>({
    url: '/ics/billMonthRecord/confirm',
    method: 'post',
    data: idList
  });
}

/**
 * 导出月结账单
 */
export function exportFile(params: any) {
  return blobRequest({
    url: '/ics/billMonthRecord/export',
    method: 'post',
    data: params
  });
}

/**
 * 根据账单号获取明细列表
 */
export function getDetailListByBillNumber(billNumber: string) {
  return request<any>({
    url: '/ics/billMonthRecord/recordDetail/getDetailListByBillNumber',
    method: 'get',
    params: { billNumber }
  });
}

const billMonthRecordApi = {
  getListPage,
  generate,
  reGenerate,
  confirm,
  exportFile,
  getDetailListByBillNumber
};

export default billMonthRecordApi;
