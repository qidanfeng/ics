<template>
  <div class="cost-detail-container">
    <!-- 主要内容区域：左右布局 -->
    <div class="main-content">
      <!-- 左侧：应收费用 -->
      <div class="left-section receivable-section">
        <div class="section-title receivable-title">
          <h3>应收费用</h3>
        </div>
        <div class="table-container">
          <el-table
            :data="receivableData"
            size="small"
            height="400"
            :row-height="30"
            :row-style="{ height: '0' }"
            :cell-style="{ padding: '0' }"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template #default="{ row }">
                <span v-if="!row.editing">{{ row.totalPrice }}</span>
                <el-input-number v-else v-model="row.totalPrice" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="{ row }">
                <el-button size="small" type="text" @click="viewReceivableRow(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 右侧：应付费用 -->
      <div class="right-section payable-section">
        <div class="section-title payable-title">
          <h3>应付费用</h3>
        </div>
        <div class="table-container">
          <el-table
            :data="payableData"
            size="small"
            height="400"
            :row-height="30"
            :row-style="{ height: '0' }"
            :cell-style="{ padding: '0' }"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template #default="{ row }">
                <span v-if="!row.editing">{{ row.totalPrice }}</span>
                <el-input-number v-else v-model="row.totalPrice" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="viewPayableRow(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 底部：统计信息 -->
    <div class="summary-section">
      <div class="summary-item">
        <div class="summary-label">应收总计</div>
        <div class="summary-value">¥{{ formatNumber(receivableTotal) }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">应付总计</div>
        <div class="summary-value">¥{{ formatNumber(payableTotal) }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">利润</div>
        <div class="summary-value" :class="profitClass">¥{{ formatNumber(profit) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getBillByOrderNumber } from '@/service/api/inventory/transfer-order';

defineOptions({ name: 'TransferCostDetail' });

const orderNumber = ref('');
const receivableData = ref<any[]>([]);
const payableData = ref<any[]>([]);
const receivableTotal = ref(0);
const payableTotal = ref(0);
const profit = ref(0);

const profitClass = computed(() => (profit.value >= 0 ? 'profit-positive' : 'profit-negative'));

/** 初始化组件数据 */
async function init(data: any) {
  orderNumber.value = data.orderNumber;
  await loadBillData();
  calculateReceivableTotal();
  calculatePayableTotal();
}

/** 加载费用数据 */
function loadBillData() {
  return new Promise<void>((resolve, reject) => {
    getBillByOrderNumber(orderNumber.value)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && (data.code as unknown as number) === 0 && data.data) {
          if (data.data.arDetailList) {
            receivableData.value = data.data.arDetailList;
          }
          if (data.data.apDetailList) {
            payableData.value = data.data.apDetailList;
          }
        }
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

/** 重置组件数据 */
function resetData() {
  orderNumber.value = '';
  receivableData.value = [];
  payableData.value = [];
  receivableTotal.value = 0;
  payableTotal.value = 0;
  profit.value = 0;
}

/** 格式化数字显示 */
function formatNumber(value: number) {
  return parseFloat(String(value || 0)).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/** 查看应收费用 */
function viewReceivableRow(row: any) {
  ElMessage({
    message: `查看应收费用: ${row.costItemName}`,
    type: 'info'
  });
}

/** 查看应付费用 */
function viewPayableRow(row: any) {
  ElMessage({
    message: `查看应付费用: ${row.costItemName}`,
    type: 'info'
  });
}

/** 计算应收总计 */
function calculateReceivableTotal() {
  receivableTotal.value = receivableData.value.reduce((total: number, item: any) => {
    return total + parseFloat(item.totalPrice || 0);
  }, 0);
  calculateProfit();
}

/** 计算应付总计 */
function calculatePayableTotal() {
  payableTotal.value = payableData.value.reduce((total: number, item: any) => {
    return total + parseInt(item.totalPrice || 0);
  }, 0);
  calculateProfit();
}

/** 计算利润 */
function calculateProfit() {
  profit.value = receivableTotal.value - payableTotal.value;
}

defineExpose({ init, resetData });
</script>

<style scoped>
.cost-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  gap: 20px;
  flex: 1;
  margin-bottom: 20px;
}

.left-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
}

.section-title {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.section-title h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-left: 10px;
}
.receivable-title {
  background-color: #f0f9ff;
  color: #333;
}
.receivable-title h3 {
  color: #1890ff;
}
.payable-title {
  background-color: #fef0f0;
  color: #333;
}
.payable-title h3 {
  color: #f5222d;
}

.table-container {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.summary-section {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.summary-item {
  text-align: center;
  padding: 0 20px;
}
.summary-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}
.summary-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}
.profit-positive {
  color: #67c23a;
}
.profit-negative {
  color: #f56c6c;
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  .left-section,
  .right-section {
    width: 100%;
  }
}
</style>
