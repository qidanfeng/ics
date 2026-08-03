<template>
  <div>
    <el-table
      :data="tableData"
      border
      size="small"
      :row-height="30"
      :row-style="{ height: '0' }"
      :cell-style="{ padding: '0' }"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      row-key="index"
      height="600px"
      @expand-change="handleInventoryConfirm"
    >
      <el-table-column prop="index" label="序号" width="60" align="center" />
      <el-table-column prop="productNumber" label="产品编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="订货数量" width="100" align="center" />
      <el-table-column prop="inStockQuantity" label="实际入库数量" width="120" align="center" />
      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
      <el-table-column prop="volume" label="体积(cm^³)" width="100" align="center" />
      <el-table-column prop="weight" label="重量(kg)" width="100" align="center" />
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
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getInOmsOrderCallbackInfo } from '@/service/api/purchase/purchase-in-order';
import { queryLotAttributeByCustomerId } from '@/service/api/mdm/lot-attribute';

defineOptions({ name: 'ActualDetail' });

const tableData = ref<any[]>([]);
const orderData = ref<any>({});
const lotAttributeVos = ref<any[]>([]);

let lineMax = 0;

/** 初始化 */
function init(data: any) {
  orderData.value = data;
  loadInOmsOrder();
  queryLotAttribute();
}

/** 根据客户ID查询批次属性 */
function queryLotAttribute() {
  if (!orderData.value.projectId) {
    return;
  }
  queryLotAttributeByCustomerId(orderData.value.projectId, 0)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data.code === 0 && data.data) {
        lotAttributeVos.value = data.data;
      }
    })
    .catch(error => {
      console.error('查询客户批次属性失败:', error);
    });
}

function handleInventoryConfirm(row: any) {
  row.lotAttributeVos = [];
  if (lotAttributeVos.value && lotAttributeVos.value.length > 0) {
    lotAttributeVos.value.forEach(config => {
      const lotAttrNumber = config.lotAttrNumber;
      row.lotAttributeVos.push({
        lotAttrLabel: config.lotAttrLabel,
        lotAttrValue: row.lotAttributeEntity[lotAttrNumber]
      });
    });
  }
}

function loadInOmsOrder() {
  getInOmsOrderCallbackInfo(orderData.value.id)
    .then(({ response }) => {
      const data: any = response?.data;
      console.log(data.data);
      if (data.code == 0 && data.data) {
        tableData.value = data.data;
      }
    })
    .catch(() => {});
}

function tableRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
  // 把每一行的索引放进row
  // 获取行号最大值,行号和原始行号为当前行号最大值+1
  if (tableData.value && tableData.value.length > 0) {
    lineMax = Math.max.apply(
      Math,
      tableData.value.map(item => {
        return item.lineNum ? parseInt(item.lineNum) : 0;
      })
    );
  }
  row.lineNum = row.lineNum ? row.lineNum : lineMax + 1;
  row.originalLineNum = row.originalLineNum ? row.originalLineNum : lineMax + 1;
  row.index = rowIndex + 1;
  return '';
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
