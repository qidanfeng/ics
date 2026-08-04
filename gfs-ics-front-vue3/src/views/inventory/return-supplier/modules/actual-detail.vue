<template>
  <div class="detail-content">
    <el-table
      :data="tableData"
      border
      size="small"
      style="width: 100%"
      height="600"
      empty-text="暂无数据"
      v-loading="loading"
      @expand-change="handleInventoryConfirm"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="productNumber" label="产品编号" min-width="120" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="退货数量" width="100" align="center" />
      <el-table-column prop="outStockQuantity" label="实际退货数量" width="100" align="center" />
      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
      <el-table-column prop="volume" label="体积" width="80" align="center" />
      <el-table-column prop="weight" label="重量" width="80" align="center" />
      <!-- 批次属性列 -->
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
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOutOmsOrderCallbackInfo } from '@/service/api/inventory/return-supplier';
import { queryLotAttributeByCustomerId } from '@/service/api/mdm/lot-attribute';

defineOptions({ name: 'ReturnSupplierActualDetail' });

const orderData = ref<any>({});
const tableData = ref<any[]>([]);
const lotAttributeVos = ref<any[]>([]);
const loading = ref(false);

/** 初始化组件数据 */
function init(data: any) {
  if (!data) return;
  orderData.value = data;
  loadOutOmsOrder();
  queryLotAttributeByCustomerIdData();
}

/** 根据客户ID查询批次属性 */
function queryLotAttributeByCustomerIdData() {
  if (!orderData.value.projectId) {
    return;
  }
  queryLotAttributeByCustomerId(orderData.value.projectId, 0)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        lotAttributeVos.value = data.data;
      }
    })
    .catch(error => {
      console.error('查询客户批次属性失败:', error);
    });
}

/** 展开行时填充批次属性 */
function handleInventoryConfirm(row: any) {
  row.lotAttributeVos = [];
  if (lotAttributeVos.value && lotAttributeVos.value.length > 0) {
    lotAttributeVos.value.forEach((config: any) => {
      const lotAttrNumber = config.lotAttrNumber;
      row.lotAttributeVos.push({
        lotAttrLabel: config.lotAttrLabel,
        lotAttrValue: row.lotAttributeEntity?.[lotAttrNumber]
      });
    });
  }
}

/** 加载OMS出库订单回传信息 */
function loadOutOmsOrder() {
  loading.value = true;
  getOutOmsOrderCallbackInfo(orderData.value.id)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        tableData.value = data.data;
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}

/** 重置组件数据 */
function resetData() {
  tableData.value = [];
}

defineExpose({ init, resetData });
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
