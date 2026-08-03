<template>
  <el-dialog
    title="日结账单详情 - 订单费用明细"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="billData" class="detail-header">
      <el-descriptions :column="4" border size="small">
        <el-descriptions-item label="账单号">{{ billData.billNo }}</el-descriptions-item>
        <el-descriptions-item label="账单日期">{{ billData.billDate }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ billData.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="货主">{{ billData.projectName }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{ billData.warehouseName }}</el-descriptions-item>
        <el-descriptions-item label="订单数量">{{ billData.orderCount }}</el-descriptions-item>
        <el-descriptions-item label="总金额">{{ billData.totalAmount.toFixed(2) }} 元</el-descriptions-item>
        <el-descriptions-item label="税额">{{ billData.taxAmount.toFixed(2) }} 元</el-descriptions-item>
      </el-descriptions>
    </div>

    <el-table
      :data="orderDetailData"
      border
      size="mini"
      style="width: 100%; margin-top: 15px"
      max-height="500"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="orderNo" label="订单号" width="160" align="center" show-overflow-tooltip />
      <el-table-column prop="orderType" label="订单类型" width="100" align="center" />
      <el-table-column prop="costItemName" label="费项" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="productNumber" label="产品编码" width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="quantity" label="数量" width="100" align="center" />
      <el-table-column prop="unit" label="单位" width="80" align="center" />
      <el-table-column prop="unitPrice" label="单价(元)" width="100" align="right">
        <template slot-scope="scope">
          {{ scope.row.unitPrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额(元)" width="120" align="right">
        <template slot-scope="scope">
          <span style="color: #E6A23C; font-weight: bold">{{ scope.row.amount.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          {{ (scope.row.taxRate * 100).toFixed(0) }}%
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="税额(元)" width="100" align="right">
        <template slot-scope="scope">
          {{ scope.row.taxAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="billingRule" label="计费规则" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="completeTime" label="完成时间" width="160" align="center" />
    </el-table>

    <div slot="footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleExport">导出明细</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'OrderFeeDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    billData: {
      type: Object,
      default: null
    },
    orderDetailData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleExport() {
      this.$emit('export')
    }
  }
}
</script>

<style scoped>
.detail-header {
  margin-bottom: 15px;
}
</style>