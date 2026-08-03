<template>
  <div>
    <el-table
      :data="tableData"
      border
      stripe
      size="small"
      :row-height="30"
      :row-style="{ height: '0' }"
      :cell-style="{ padding: '0' }"
      style="width: 100%"
      @expand-change="queryLotAttributeValueByOrderDetailId"
      height="600"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="productNumber" label="产品编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="采购数量" width="100" align="center" />
      <el-table-column prop="inStockQuantity" label="入库数量" width="100" align="center" />
      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
      <el-table-column type="expand" label="批属性" width="100">
        <template #default="{ row }">
          <div class="batch-attributes-panel">
            <div class="attribute-grid">
              <div class="attribute-item" v-for="(lotAttribute, index) in row.lotAttributeVos" :key="index">
                <span class="attribute-label">{{ lotAttribute.lotAttrLabel }}：</span>
                <span class="attribute-value">{{ lotAttribute.lotAttrValue }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="体积cm³" width="100" align="center" />
      <el-table-column prop="weight" label="重量(毛重)kg" width="100" align="center" />
      <el-table-column prop="totalPrice" label="总价" width="100" align="center">
        <template #default="scope">
          {{ formatPrice(scope.row.totalPrice) }}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
      <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getDetailListByOrderNumber,
  queryLotAttributeValueByOrderDetailId as queryLotAttributeValueByOrderDetailIdApi
} from '@/service/api/ics/purchase-in-order';

defineOptions({ name: 'OrderDetail' });

const tableData = ref<any[]>([]);

/** 初始化 */
async function init(orderData: any) {
  if (orderData && orderData.orderNumber) {
    await loadOrderDetailData(orderData.orderNumber);
  } else {
    ElMessage.warning('订单数据不完整，无法获取明细');
    tableData.value = [];
  }
}

/** 加载订单明细数据 */
async function loadOrderDetailData(orderNumber: string) {
  try {
    const { response } = await getDetailListByOrderNumber(orderNumber);
    const data: any = response?.data;
    if (data.code === 0 && data.data) {
      tableData.value = formatTableData(data.data);
      ElMessage.success('订单明细数据加载成功');
    } else {
      ElMessage.error(data.msg || '获取订单明细失败');
      tableData.value = [];
    }
  } catch (error) {
    console.error('获取订单明细失败:', error);
    ElMessage.error('获取订单明细失败，请重试');
    tableData.value = [];
  }
}

/** 格式化表格数据 */
function formatTableData(rawData: any[]) {
  return rawData.map(item => ({
    id: item.id,
    productNumber: item.productNumber || '',
    productName: item.productName || '',
    lineNumber: item.lineNumber || '',
    quantity: item.quantity || 0,
    inStockQuantity: item.inStockQuantity || 0,
    unitDictionaryName: item.unitDictionaryName || '',
    volume: item.volume || 0,
    weight: item.weight || 0,
    totalPrice: item.totalPrice || 0,
    remarks: item.remarks || '',
    createdBy: item.createdBy || '',
    createdTime: item.createdTime || '',
    lastModifiedBy: item.lastModifiedBy || '',
    lastModifiedTime: item.lastModifiedTime || '',
    lotAttributeVos: []
  }));
}

/** 格式化价格显示 */
function formatPrice(price: number) {
  if (price === 0 || price === null || price === undefined) {
    return '0.00';
  }
  return Number(price).toFixed(2);
}

/** 根据订单明细ID查询批属性值 */
function queryLotAttributeValueByOrderDetailId(row: any, _expandedRows: any) {
  if (!row.id) {
    return;
  }
  if (row.lotAttributeVos && row.lotAttributeVos.length > 0) {
    return;
  }
  queryLotAttributeValueByOrderDetailIdApi(row.id).then(({ response }) => {
    const data: any = response?.data;
    if (data.data && data.code === 0) {
      row.lotAttributeVos = data.data;
    }
  });
}

defineExpose({ init });
</script>

<style scoped>
.batch-attributes-panel {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.attribute-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: white;
  border-radius: 3px;
  border: 1px solid #e8e8e8;
}

.attribute-label {
  font-weight: 600;
  color: #606266;
  min-width: 80px;
  margin-right: 8px;
}

.attribute-value {
  color: #303133;
  flex: 1;
}

@media (max-width: 1200px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: 1fr;
  }
}
</style>
