<template>
  <div class="transfer-container">
    <!-- 调拨产品明细表格 -->
    <div class="table-section">
      <u-table
        :data="tableData"
        border
        size="mini"
        :row-height="30"
        :row-style="{height: '0'}"
        :cell-style="{padding: '0'}"
        style="width: 100%"
        height="600px"
        empty-text="暂无数据">
        <u-table-column type="index" label="序号" width="60" align="center"></u-table-column>
        <u-table-column prop="productNumber" label="产品编号" width="150" align="center" show-overflow-tooltip></u-table-column>
        <u-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip></u-table-column>
        <u-table-column prop="lineNumber" label="行号" width="80" align="center"></u-table-column>
        <u-table-column prop="quantity" label="数量" width="100" align="center"></u-table-column>
          <u-table-column prop="outStockQuantity" label="调出数量" width="100" align="center"></u-table-column>
          <u-table-column prop="inStockQuantity" label="调入数量" width="100" align="center"></u-table-column>
        <u-table-column prop="unitDictionaryName" label="单位" width="80" align="center"></u-table-column>
        <u-table-column prop="volume" label="体积" width="100" align="center"></u-table-column>
        <u-table-column prop="weight" label="重量" width="100" align="center"></u-table-column>
        <u-table-column prop="totalPrice" label="总价" width="100" align="center"></u-table-column>
        <u-table-column prop="remarks" label="备注" min-width="150" align="center" show-overflow-tooltip></u-table-column>
            <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
      <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
      <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
      <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
      </u-table>
    </div>
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import API from '@/api'
export default {
  name: 'WarehouseTransfer',
  data() {
    return {
      orderNumber:'',
      // 调拨产品明细
      tableData: []
    }
  },
  components:{
    UTable,UTableColumn
  },
  methods: {
    /**
     * 初始化组件数据
     * @param {Object} data - 调拨订单详情数据
     */
    init(data) {
      if (!data) return
      this.orderNumber = data.orderNumber;
      // 设置调拨产品明细
      this.loadOrderDetailData();

    },
    loadOrderDetailData(){
      API.transferOrder.getDetailListByOrderNumber(this.orderNumber).then(({data}) => {
        if (data.code === 0 && data.data) {
         this.tableData = data.data;
        }
      }).catch(err => {
        console.error('获取调拨订单详情失败:', err)
      })
    },

    /**
     * 重置数据
     */
    resetData() {
      // 重置调出仓库信息
      this.outWarehouse = ''
      this.outStatus = '未出库'
      this.outTime = ''
      this.deliveryMethod = ''
      this.carrier = ''

      // 重置调入仓库信息
      this.inWarehouse = ''
      this.inStatus = '未入库'
      this.inTime = ''

      // 重置调拨产品明细
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
