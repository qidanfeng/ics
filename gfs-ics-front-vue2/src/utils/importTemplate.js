let baseTemplateUrl = process.env.VUE_APP_BASE_API + '/system/common/download?ossFilePath=' + process.env.VUE_APP_ENV

export var importTemplets =[

  {name: '产品价格配置导入-新增模板', url:baseTemplateUrl + '/template/ics/product_price_config.xlsx', code: '1000'},
  {name: '采购建议单导入模板', url:baseTemplateUrl + '/template/ics/purchase_suggestion_order.xlsx', code: '1001'},
  {name: '产品价格配置导入-更新模板', url:baseTemplateUrl + '/template/ics/product_price_config-update.xlsx', code: '1002'},
  {name: '订购量配置导入模板', url:baseTemplateUrl + '/template/ics/order_quantity_config.xlsx', code: '1003'},
]

export function getImportTempletsUrl(code) {
  let parameter = {
    url: '',
    name: ''
  };
  importTemplets.forEach(item=>{
    if(item.code == code){
      parameter.url = item.url;
      parameter.name = item.name;
  }
})
  return parameter;
}
