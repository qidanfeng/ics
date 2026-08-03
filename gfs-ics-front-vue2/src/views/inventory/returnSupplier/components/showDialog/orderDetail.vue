<template>
  <div>
       <!-- 调拨产品明细表格 -->
    <u-table
      :data="tableData"
      border
      size="mini"
      :row-height="30"
      :row-style="{height: '0'}"
      :cell-style="{padding: '0'}"
      height="600px"
      style="width: 100%"
      empty-text="暂无数据">
      <u-table-column type="index" label="序号" width="60" align="center"></u-table-column>
      <u-table-column prop="productNumber" label="产品编码" min-width="120" align="center"></u-table-column>
      <u-table-column prop="productName" label="产品名称" min-width="150" align="center"></u-table-column>
      <u-table-column prop="lineNumber" label="行号" width="80" align="center"></u-table-column>
      <u-table-column prop="quantity" label="计划退货数量" width="120" align="center"></u-table-column>
      <u-table-column prop="outStockQuantity" label="实际退货数量" width="120" align="center"></u-table-column>
      <u-table-column prop="unitDictionaryName" label="单位" width="80" align="center"></u-table-column>
      <u-table-column prop="volume" label="体积" width="100" align="center"></u-table-column>
      <u-table-column prop="weight" label="重量" width="100" align="center"></u-table-column>
      <u-table-column prop="remark" label="备注" min-width="150" align="center"></u-table-column>
      <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
      <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
      <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
      <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
    </u-table>
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import API from '@/api'
export default {
  name: 'OrderDetail',
  data() {
    return {
      orderNumber:"",
      // 退供单详情数据
      tableData: []
    }
  },
  components:{
    UTable,UTableColumn
  },
  methods: {
    /**
     * 初始化组件数据
     * @param {Object} data - 退供单详情数据
     */
    init(data) {
      this.orderNumber = data.orderNumber;
      this.loadOrderDetailData();

    },
    loadOrderDetailData(){
      API.returnSupplier.getDetailListByOrderNumber(this.orderNumber).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.tableData = data.data;
        }
      }).catch(err => {
        console.error('获取退供订单详情失败:', err)
      })
    },
    /**
     * 重置组件数据
     */
    resetData() {
      this.tableData = []
    }
  }
}
</script>

<style scoped>
.transfer-container {
  margin: 0 auto;
  overflow: hidden;
}
.info-cards-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.info-card {
  flex: 1;
  min-width: 0; /* 防止flex item溢出 */
}
.table-card {
  width: 100%;
  margin-bottom: 0;
}
.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.info-content {
  padding: 10px 0;
}
.info-row {
  display: flex;
  margin-bottom: 10px;
}
.info-label {
  width: 120px;
  font-size: 14px;
  color: #909399;
}
.info-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
}
.status-out {
  color: #67c23a; /* 绿色表示已完成 */
}
.status-in {
  color: #f56c6c; /* 红色表示未完成 */
}
.table-section {
  padding: 10px 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .info-cards-container {
    flex-direction: column;
  }
}
</style>
