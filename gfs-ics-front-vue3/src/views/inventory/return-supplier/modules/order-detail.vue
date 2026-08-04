<template>
  <div>
    <!-- 退供产品明细表格 -->
    <el-table
      :data="tableData"
      border
      size="small"
      height="600"
      style="width: 100%"
      empty-text="暂无数据"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="productNumber" label="产品编码" min-width="120" align="center" />
      <el-table-column prop="productName" label="产品名称" min-width="150" align="center" />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="计划退货数量" width="120" align="center" />
      <el-table-column prop="outStockQuantity" label="实际退货数量" width="120" align="center" />
      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
      <el-table-column prop="volume" label="体积" width="100" align="center" />
      <el-table-column prop="weight" label="重量" width="100" align="center" />
      <el-table-column prop="remark" label="备注" min-width="150" align="center" />
      <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
      <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getDetailListByOrderNumber } from '@/service/api/inventory/return-supplier';

defineOptions({ name: 'ReturnSupplierOrderDetail' });

const orderNumber = ref('');
const tableData = ref<any[]>([]);

/** 初始化组件数据 */
function init(data: any) {
  orderNumber.value = data.orderNumber;
  loadOrderDetailData();
}

/** 加载退供订单详情 */
function loadOrderDetailData() {
  getDetailListByOrderNumber(orderNumber.value)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        tableData.value = data.data;
      }
    })
    .catch(err => {
      console.error('获取退供订单详情失败:', err);
    });
}

/** 重置组件数据 */
function resetData() {
  tableData.value = [];
}

defineExpose({ init, resetData });
</script>

<style scoped></style>
