import { request, blobRequest } from '../../request';
import requestUrl from '../../request/requestUrl';

export function getPackList(productId: string | number) {
  return request<any>({
    url: '/mdm/productPack/getProductPackList',
    method: 'get',
    params: { productId }
  });
}

export function updateBarcodeAndPack(params: any) {
  return request<any>({
    url: '/mdm/productPack/updateBarcodeAndPack',
    method: 'post',
    data: params
  });
}

export function getPack(productId: string | number) {
  return request<any>({
    url: '/mdm/productPack/getProductPack',
    method: 'get',
    params: { productId }
  });
}

export function importFile() {
  return requestUrl('/mdm/productPack/import');
}

export function importFileForUpdate() {
  return requestUrl('/mdm/productPack/productPackUpdateImport');
}

export function exportProduct(params: any) {
  return blobRequest({
    url: '/mdm/productPack/export',
    method: 'get',
    params
  });
}

export function activeOrClose(id: any) {
  return request<any>({
    url: '/mdm/productPack/activeOrClose',
    method: 'post',
    data: id
  });
}

export function getProductPackVosByCode(code: string) {
  return request<any>({
    url: '/mdm/productPack/getProductPackVosByCode',
    method: 'get',
    params: { code }
  });
}

const productPackApi = {
  getPackList,
  updateBarcodeAndPack,
  getPack,
  importFile,
  importFileForUpdate,
  exportProduct,
  activeOrClose,
  getProductPackVosByCode
};

export default productPackApi;