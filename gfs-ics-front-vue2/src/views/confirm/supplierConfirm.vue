<template>
  <div class="supplier-confirm-page">
    <!-- 供应商确认页面头部 -->
    <div class="supplier-header">
      <div class="header-left">
        <h1>{{ pageTitle }}</h1>
        <p class="header-subtitle">供应商订单确认页面</p>
      </div>
      <div class="header-actions">
        <el-button size="mini" type="primary" :disabled="!orderData || !orderData.allowSupplierConfirmFlag" @click="handleConfirm" :loading="confirmLoading">
          确认订单
        </el-button>
        <el-button  size="mini" type="success" @click="downloadPDF" :loading="pdfLoading" :disabled="!orderData">
          <i class="el-icon-download"></i> 下载PDF
        </el-button>
        <el-button size="mini" @click="refresh">刷新</el-button>
      </div>
    </div>

    <!-- 页面内容区域 -->
    <div class="supplier-content"  v-if="orderData">
      <!-- 订单基本信息 -->
      <div class="order-info-card" v-if="orderData">
        <div class="custom-card-header">
          <div style="flex: 1;"></div>
          <span class="order-status" :class="getStatusClass(orderData.orderStatus)">{{ getStatusText(orderData.orderStatus) }}</span>
        </div>

        <table class="info-table">
          <tr>
            <td class="info-label">供应商名称：</td>
            <td class="info-content">{{ orderData.supplierName || '' }}</td>
            <td class="info-label">联系人：</td>
            <td class="info-content">{{ orderData.supplierLinkMan || '' }}</td>
          </tr>
          <tr>
            <td class="info-label">联系电话：</td>
            <td class="info-content">{{ orderData.supplierLinkManPhone || '' }}</td>
            <td class="info-label">采购单号：</td>
            <td class="info-content">{{ orderData.orderNumber || '' }}</td>
          </tr>
          <tr>
            <td class="info-label">下单日期：</td>
            <td class="info-content">{{ orderData.createdTime || '' }}</td>
            <td class="info-label">要求到货日期：</td>
            <td class="info-content">{{ orderData.estimatedDeliveryDate || '' }}</td>
          </tr>
        </table>
      </div>

      <!-- 收货地信息 -->
      <div class="order-info-card" v-if="orderData">

        <table class="info-table">
          <tr>
            <td class="info-label">收货地名称：</td>
            <td colspan="3">{{ orderData.deliveryWarehouseName || '' }}</td>
          </tr>
          <tr>
            <td class="info-label">收货仓地址：</td>
            <td colspan="3">{{ orderData.deliveryWarehouseAddress || '' }}</td>
          </tr>
          <tr>
            <td class="info-label">收货人电话：</td>
            <td colspan="3">{{ orderData.deliveryWarehouseLinkManPhone || '' }}</td>
          </tr>
        </table>
      </div>

      <!-- 订单明细 -->
      <div class="order-detail-card" v-if="orderData && orderData.detailList.length > 0">

        <table class="goods-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>货品编号</th>
              <th>货品名称</th>
              <th>包装规格</th>
              <th>温区</th>
              <th>订单数量</th>
              <th>单位</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in orderData.detailList" :key="index">
              <td class="center">{{ index + 1 }}</td>
              <td>{{ item.productNumber || '' }}</td>
              <td>{{ item.productName || '' }}</td>
              <td>{{ item.specification || '' }}</td>
              <td>{{ item.temperatureRangeName || '' }}</td>
              <td class="center" style="font-weight: bolder">{{ item.quantity || '' }}</td>
              <td class="center">{{ item.unitDictionaryName || '' }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>总计</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="center" style="font-weight: bolder">{{ getTotalQuantity() }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

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
    </div>
    <!-- 无数据提示 -->
    <div v-if="!orderData" class="no-data">
      <el-empty description="未找到订单信息" :image-size="200">
      </el-empty>
    </div>
  </div>
</template>

<script>
import API from '@/api'
import {generatePdfContent} from './pdfContent.js'
export default {
  name: 'SupplierConfirm',
  data() {
    return {
      pageTitle: '供应商确认页面',
      orderData: null,
      orderDetails: [],
      orderNumber:'',
      confirmLoading: false,
      pdfLoading: false
    }
  },
  methods: {
    // 处理确认操作
    handleConfirm() {
      this.$confirm('确定要确认此订单吗？', '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.confirmLoading = true

        // 调用API确认订单
        API.confirm.supplierConfirm(this.orderData.orderNumber).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('订单确认成功')
          }
          this.refresh();
        }).catch(error => {
          this.$message.error('确认失败：' + error.message)
        }).finally(() => {
          this.confirmLoading = false
        })
      }).catch(() => {
        // 用户取消操作
        this.$message.info('已取消确认操作')
      })
    },

    // 解析URL参数并加载数据
    loadOrderData() {
      // 当前域名
      const currentDomain = window.location.hostname;
      if (process.env.VUE_APP_SHORT_LINK_DOMAIN === currentDomain) {
        let orderNumberEncrypt = this.$route.query.a;
        if (!orderNumberEncrypt) {
          this.$message.warning('参数缺失')
          return;
        }
        try {
          this.orderNumber = this.base64Decode(orderNumberEncrypt);
        } catch (error) {
          this.$message.error('解析参数失败')
          console.log("解析参数失败",error);
          return;
        }
      }else {
        this.orderNumber = this.$route.query.orderNumber;
      }


      if (!this.orderNumber) {
        this.$message.warning('未找到订单数据')
        return
      }

      try {
        this.loadOrderInfo();
        this.pageTitle = `订单确认 - ${this.orderNumber}`

      } catch (error) {
        this.$message.error('解析订单数据失败')
      }
    },
    // 简写版本（仅适用于ASCII字符）
    base64Encode(str) {
      return btoa(str);
    },

    base64Decode(base64) {
      return atob(base64);
    },
    loadOrderInfo(){

      if(!this.orderNumber){
        return
      }
      API.confirm.getSupplierConfirmOrderInfo(this.orderNumber).then(({data})=>{
        if (data && data.code === 0) {
          this.orderData = data.data;
        } else {
          this.$message.error('获取订单信息失败：' + (data.message || '未知错误'))
        }
      }).catch(error=>{
        this.$message.error('获取订单信息失败：' + error.message)
      })
    },
    refresh() {
      this.loadOrderData();
      // window.location.reload()
    },

    // 下载PDF文件
    downloadPDF() {
      if (!this.orderData) {
        this.$message.warning('请先加载订单数据')
        return
      }
      this.pdfLoading = true;
      const htmlContent =  generatePdfContent(this.orderData,this.orderData.detailList);


      // 同时打开打印窗口
      const printWindow = window.open('', '_blank')
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // 等待内容加载完成后打印
      printWindow.onload = () => {
        printWindow.print()
        this.pdfLoading = false
      }
    },


    // 根据订单状态返回对应的CSS类
    getStatusClass(status) {
      const statusMap = {
        20: 'status-confirmed',    // 已通知供应商
        30: 'status-completed',    // 已生成采购入库
        90: 'status-cancelled'     // 已取消
      }
      return statusMap[status] || 'status-default'
    },
    getStatusText(status) {
      const statusMap = {
        20: '待确认',    // 已通知供应商
        30: '已确认',    // 已确认
        40: '已确认'    // 已生成采购入库
      }
      return statusMap[status] || '未知状态'
    },
    // 计算订单明细的总数量
    getTotalQuantity() {
      if (!this.orderData.detailList || this.orderData.detailList.length === 0) {
        return 0
      }
      this.orderData.totalQuantity= this.orderData.detailList.reduce((total, item) => {
        const quantity = parseFloat(item.quantity) || 0
        return total + quantity
      }, 0);
      return this.orderData.totalQuantity;
    }
  },
  mounted() {
    // 直接加载订单数据
    this.loadOrderData()
  }
}
</script>

<style scoped>
.supplier-confirm-page {
    background-color: #fff;
    color: #333;
    line-height: 1.5;
    font-size: 16px;
    margin: 0 auto;
    padding: 10px;
    min-height: 100vh;
    max-width: 900px;
}

.supplier-header {
    text-align: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
}

.header-left h1 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.header-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.header-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.supplier-content {
    margin-bottom: 15px;
}

.order-info-card,
.order-detail-card {
    margin-bottom: 15px;
    border: none;
    border-radius: 0;
    box-shadow: none;
}

.custom-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: bold;
    border-bottom: 1px solid #f0f0f0;
    padding: 5px;
    background-color: #f9f9f9;
}

.header-right {
    display: flex;
    align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.total-count {
  color: #909399;
  font-size: 13px;
}

.order-status {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-confirmed {
  color: #67c23a; /* 橙色 - 待确认 */
}


.status-completed {
  color: #409eff; /* 橙色 - 待确认 */
}

.status-cancelled {
  color: #f10313;
}

.status-default {
  color: #6c757d;
}

.confirm-action-area {
  text-align: center;
  margin: 20px 0;
}

.confirm-action-area .el-button {
  min-width: 120px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 商品表格样式 - 匹配PDF */
.goods-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    font-size: 15px;
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
    font-size: 14px;
}

/* 信息表格样式 - 匹配PDF */
.info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    font-size: 15px;
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


/* 送货须知样式 */
.delivery-notice {
    margin-top: 15px;
}

.delivery-notice h3 {
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
}

.notice-list {
    padding-left: 15px;
    margin: 0;
}

.notice-list li {
    margin-bottom: 5px;
    font-size: 14px;
    line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .supplier-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px 20px;
  }

  .supplier-content {
    padding: 15px;
  }

  .header-left h1 {
    font-size: 24px;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .action-buttons .el-button {
    margin: 5px;
    width: calc(50% - 10px);
  }

  .order-info-card .el-descriptions {
    --el-descriptions-item-bordered-label-width: 100px;
  }
}

@media (max-width: 480px) {
  .supplier-header {
    padding: 12px 15px;
  }

  .supplier-content {
    padding: 10px;
  }

  .header-left h1 {
    font-size: 20px;
  }

  .header-subtitle {
    font-size: 12px;
  }

  .action-buttons .el-button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
