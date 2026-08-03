import { baseURL } from '@/service/request';

/**
 * 导入模板下载基础地址
 * 对应 vue2 项目的 importTemplate.js
 * URL 模式: {baseURL}/system/common/download?ossFilePath={env}/template/ics/{filename}
 */
const baseTemplateUrl = `${baseURL}/system/common/download?ossFilePath=${import.meta.env.VITE_APP_ENV}`;

export interface ImportTemplate {
  /** 模板名称 */
  name: string;
  /** 模板下载地址 */
  url: string;
  /** 模板编码 */
  code: string;
}

export const importTemplets: ImportTemplate[] = [
  {
    name: '产品价格配置导入-新增模板',
    url: `${baseTemplateUrl}/template/ics/product_price_config.xlsx`,
    code: '1000'
  },
  {
    name: '采购建议单导入模板',
    url: `${baseTemplateUrl}/template/ics/purchase_suggestion_order.xlsx`,
    code: '1001'
  },
  {
    name: '产品价格配置导入-更新模板',
    url: `${baseTemplateUrl}/template/ics/product_price_config-update.xlsx`,
    code: '1002'
  },
  {
    name: '订购量配置导入模板',
    url: `${baseTemplateUrl}/template/ics/order_quantity_config.xlsx`,
    code: '1003'
  }
];

/**
 * 根据模板编码获取模板下载地址
 * @param code 模板编码
 */
export function getImportTempletsUrl(code: string): { url: string; name: string } {
  const parameter = { url: '', name: '' };
  importTemplets.forEach(item => {
    if (item.code === code) {
      parameter.url = item.url;
      parameter.name = item.name;
    }
  });
  return parameter;
}
