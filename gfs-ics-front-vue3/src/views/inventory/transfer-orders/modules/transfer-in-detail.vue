<template>
  <div class="detail-content">
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
      v-loading="loading"
      @expand-change="handleInventoryConfirm"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="productNumber" label="产品编号" min-width="150" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="调拨数量" width="100" align="center" />
      <el-table-column prop="outStockQuantity" label="出库数量" width="100" align="center" />
      <el-table-column prop="inStockQuantity" label="入库数量" width="100" align="center" />
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
import { getInOmsOrderCallbackInfo } from '@/service/api/inventory/transfer-order';
import { queryLotAttributeByCustomerId } from '@/service/api/mdm/lot-attribute';

defineOptions({ name: 'TransferInDetail' });

const orderData = ref<any>({});
const tableData = ref<any[]>([]);
const lotAttributeVos = ref<any[]>([]);
const loading = ref(false);

/** 初始化组件数据 */
function init(data: any) {
  if (!data) return;
  orderData.value = data;
  loadInOmsOrder();
  queryLotAttributeByCustomerIdHandle();
}

/** 根据客户ID查询批次属性 */
function queryLotAttributeByCustomerIdHandle() {
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
        lotAttrValue: row.lotAttributeEntity[lotAttrNumber]
      });
    });
  }
}

/** 加载调入OMS订单回传信息 */
function loadInOmsOrder() {
  loading.value = true;
  getInOmsOrderCallbackInfo(orderData.value.id)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        tableData.value = data.data;
      }
    })
    .catch(error => {
      console.error('获取调拨入库明细失败:', error);
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置数据 */
function resetData() {
  orderData.value = {};
  tableData.value = [];
  lotAttributeVos.value = [];
  loading.value = false;
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
