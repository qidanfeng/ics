<template>
  <div class="transfer-container">
    <!-- 调拨产品明细表格 -->
    <div class="table-section">
      <el-table
        :data="tableData"
        border
        size="small"
        :row-height="30"
        :row-style="{ height: '0' }"
        :cell-style="{ padding: '0' }"
        style="width: 100%"
        height="600"
        empty-text="暂无数据"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="productNumber" label="产品编号" width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="productName" label="产品名称" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column prop="outStockQuantity" label="调出数量" width="100" align="center" />
        <el-table-column prop="inStockQuantity" label="调入数量" width="100" align="center" />
        <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
        <el-table-column prop="volume" label="体积" width="100" align="center" />
        <el-table-column prop="weight" label="重量" width="100" align="center" />
        <el-table-column prop="totalPrice" label="总价" width="100" align="center" />
        <el-table-column prop="remarks" label="备注" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
        <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getDetailListByOrderNumber } from '@/service/api/inventory/transfer-order';

defineOptions({ name: 'TransferOrderDetail' });

const orderNumber = ref('');
const tableData = ref<any[]>([]);

/** 初始化组件数据 */
function init(data: any) {
  if (!data) return;
  orderNumber.value = data.orderNumber;
  loadOrderDetailData();
}

/** 加载调拨订单详情 */
function loadOrderDetailData() {
  getDetailListByOrderNumber(orderNumber.value)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        tableData.value = data.data;
      }
    })
    .catch(err => {
      console.error('获取调拨订单详情失败:', err);
    });
}

/** 重置数据 */
function resetData() {
  orderNumber.value = '';
  tableData.value = [];
}

defineExpose({ init, resetData });
</script>

<style scoped>
.transfer-container {
  margin: 0 auto;
  overflow: hidden;
}

.table-section {
  padding: 10px 0;
}
</style>
