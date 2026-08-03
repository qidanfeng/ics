/**
   * 供应商确认页面打印模板
   * @param {Object} orderData
   * @param {Array} orderDetails
   */
export function generatePdfContent(orderData, orderDetails) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>普冷采购单</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Microsoft YaHei", Arial, sans-serif;
        }

        body {
            background-color: #fff;
            color: #333;
            line-height: 1.2;
            font-size: 12px;
            margin: 0;
            padding: 10px;
        }

        .container {
            max-width: 100%;
            margin: 20px 20px;
            background-color: #fff;
            padding: 0;
        }

        /* 页眉样式 */
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }

        .purchase-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        /* 信息表格样式 */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 11px;
        }

        .info-table td {
            padding: 3px 5px;
            border: 1px solid #ddd;
            vertical-align: top;
            white-space: nowrap;
        }

        .info-label {
            width: 15%;
            background-color: #f9f9f9;
            font-weight: bold;
        }

        .info-content {
            width: 35%;
        }

        /* 商品表格样式 */
        .goods-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 11px;
        }

        .goods-table th, .goods-table td {
            border: 1px solid #333;
            padding: 2px 3px;
            text-align: center;
            white-space: nowrap;
        }

        .goods-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 10px;
        }

        /* 表格列宽度定义 */
        .col-index { width: 20px; }           /* 序号 */
        .col-product-code { width: 100px; }    /* 产品编码 */
        .col-product-name { width: auto; }       /* 产品名称 - 自适应剩余宽度 */
        .col-spec { width: 60px; }           /* 规格 */
        .col-temp { width: 50px; }           /* 温区 */
        .col-quantity { width: 60px;font-weight: bold }       /* 订货数量 */
        .col-unit { width: 50px; }           /* 单位 */
        .col-remark { width: auto; }          /* 备注 - 自适应剩余宽度 */

        .goods-table tfoot td {
            font-weight: bold;
            background-color: #f9f9f9;
        }

        /* 送货须知样式 */
        .delivery-notice {
            margin-top: 15px;
        }

        .delivery-notice h3 {
            font-size: 14px;
            margin-bottom: 8px;
            color: #333;
        }

        .notice-list {
            padding-left: 15px;
            margin: 0;
        }

        .notice-list li {
            margin-bottom: 5px;
            font-size: 10px;
            line-height: 1.2;
        }

        /* 页脚样式 */
        .footer {
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
            display: flex;
            justify-content: space-between;
        }

        /* 打印样式 */
        @media print {
            body {
                background-color: white;
                padding: 5px;
                font-size: 10px;
            }

            .container {
                box-shadow: none;
                padding: 0;
            }
        }

    </style>
</head>
<body>
    <div class="container">
        <!-- 页眉 -->
        <div class="header">
            <h1 class="purchase-title">普冷采购单</h1>
        </div>

        <!-- 供应商信息 -->
        <table class="info-table">
            <tr>
                <td class="info-label">供应商名称：</td>
                <td class="info-content">${orderData.supplierName || ''}</td>
                <td class="info-label">联系人：</td>
                <td class="info-content">${orderData.supplierLinkMan || ''}</td>
            </tr>
            <tr>
                <td class="info-label">联系电话：</td>
                <td class="info-content">${orderData.supplierLinkManPhone || ''}</td>
                <td class="info-label">采购单号：</td>
                <td class="info-content">${orderData.orderNumber || ''}</td>
            </tr>
            <tr>
                <td class="info-label">下单日期：</td>
                <td class="info-content">${orderData.createdTime || ''}</td>
                <td class="info-label">要求到货日期：</td>
                <td class="info-content">${orderData.estimatedDeliveryDate || ''}</td>
            </tr>
        </table>
        <!-- 收货地信息 -->
        <table class="info-table">
            <tr>
                <td class="info-label">收货地名称：</td>
                <td colspan="3">${orderData.deliveryWarehouseName || ''}</td>
            </tr>
            <tr>
                <td class="info-label">收货仓地址：</td>
                <td colspan="3">${orderData.deliveryWarehouseAddress || ''}</td>
            </tr>
            <tr>
                <td class="info-label">收货人电话：</td>
                <td colspan="3">${orderData.deliveryWarehouseLinkManPhone || ''}</td>
            </tr>
        </table>

        <!-- 商品表格 -->
        <table class="goods-table">
            <thead>
                <tr>
                    <th class="col-index">序号</th>
                    <th class="col-product-code">货品编号</th>
                    <th class="col-product-name">货品名称</th>
                    <th class="col-spec">包装规格</th>
                    <th class="col-temp">温区</th>
                    <th class="col-quantity">订单数量</th>
                    <th class="col-unit">单位</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails.map((item, index) => `
                    <tr>
                        <td class="col-index center">${index + 1}</td>
                        <td class="col-product-code">${item.productNumber || ''}</td>
                        <td class="col-product-name">${item.productName || ''}</td>
                        <td class="col-spec">${item.specification || ''}</td>
                        <td class="col-temp">${item.temperatureRangeName || ''}</td>
                        <td class="col-quantity center">${item.quantity || ''}</td>
                        <td class="col-unit center">${item.unitDictionaryName || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td>总计</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${orderData.totalQuantity}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <!-- 送货须知 -->
        <div class="delivery-notice">
            <h3>送货须知:</h3>
            <ol class="notice-list">
             <li>入库要在到货前一天16:00前在微信小程序“普冷预约”上预约；</li>
               <li>低温产品收货温度标准：冷藏品1~4℃，冷冻品≤-18℃；产品剩余保质期不小于产品保质期的三分之二；</li>
            <li>送货司机需要带齐汉堡王货物清单及质检报告，先到投单室（C1办公楼一楼）投单，窗口接待人员根据车型（送低温产品最小车型4.2米）安排道口；</li>
            <li>司机在卸货期间如需进入仓库，应得到收货人员的允许，穿好反光背心。不得穿着拖鞋、凉鞋与高跟鞋进入仓库，仅在月台区域活动，不得随意走动，不得触碰库内任何电动设备、升降平台、消防设施等设备设施，遵守现场安全警示标志及其所示内容。</li>
            <li>除园区指定吸烟区域外，仓库其它区域严禁吸烟、动火。</li>

            </ol>
        </div>

        <!-- 页脚 -->
        <div class="footer">
            <div>生成时间：<span>${new Date().toLocaleString()}</span></div>
            <div>GFS普冷采购系统</div>
        </div>
    </div>
    <script>

    </script>
</body>
</html>`;
  }

