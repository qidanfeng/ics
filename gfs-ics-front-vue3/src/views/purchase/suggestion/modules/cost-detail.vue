<template>
  <div class="cost-detail-container">
    <!-- 主要内容区域：左右布局 -->
    <div class="main-content">
      <!-- 左侧：应收费用 -->
      <div class="left-section receivable-section">
        <div class="section-title receivable-title">
          <el-button type="primary" size="small" @click="addReceivableRow">+</el-button>
          <h3>应收费用</h3>
        </div>
        <div class="table-container">
          <el-table
            size="small"
            :data="receivableData"
            border
            :row-height="30"
            :row-style="{ height: '0' }"
            :cell-style="{ padding: '0' }"
            style="width: 100%"
          >
            <el-table-column prop="index" label="序号" width="60" align="center" />
            <el-table-column prop="feeName" align="center" label="费项名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="amount" align="center" label="费用" width="200">
              <template #default="scope">
                <span v-if="!scope.row.editing">{{ scope.row.amount }}</span>
                <el-input-number v-else v-model="scope.row.amount" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button size="small" type="text" v-if="!scope.row.editing" @click="editReceivableRow(scope.row)">修改</el-button>
                <el-button size="small" type="text" v-else @click="saveReceivableRow(scope.row)">保存</el-button>
                <el-button size="small" type="text" @click="viewReceivableRow(scope.row)">查看</el-button>
                <el-button size="small" type="text" class="delete-btn" @click="deleteReceivableRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 右侧：应付费用 -->
      <div class="right-section payable-section">
        <div class="section-title payable-title">
          <el-button type="primary" size="small" @click="addPayableRow">+</el-button>
          <h3>应付费用</h3>
        </div>
        <div class="table-container">
          <el-table
            :data="payableData"
            border
            size="small"
            :row-height="30"
            :row-style="{ height: '0' }"
            :cell-style="{ padding: '0' }"
            style="width: 100%"
          >
            <el-table-column prop="index" label="序号" width="60" align="center" />
            <el-table-column prop="feeName" align="center" label="费项名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="amount" align="center" label="费用" width="200">
              <template #default="scope">
                <span v-if="!scope.row.editing">{{ scope.row.amount }}</span>
                <el-input-number v-else v-model="scope.row.amount" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button type="text" size="small" v-if="!scope.row.editing" @click="editPayableRow(scope.row)">修改</el-button>
                <el-button type="text" size="small" v-else @click="savePayableRow(scope.row)">保存</el-button>
                <el-button type="text" size="small" @click="viewPayableRow(scope.row)">查看</el-button>
                <el-button type="text" size="small" class="delete-btn" @click="deletePayableRow(scope.row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus';

defineOptions({ name: 'CostDetail' });

// 应收费用数据
const receivableData = ref<any[]>([
  { index: 1, feeName: '采购货款', amount: 4564, editing: false },
  { index: 2, feeName: '自提运费', amount: 4564, editing: false }
]);
// 应付费用数据
const payableData = ref<any[]>([
  { index: 1, feeName: '采购货款', amount: 4564, editing: false },
  { index: 2, feeName: '自提运费', amount: 4564, editing: false }
]);
// 应收总计
const receivableTotal = ref(456456456);
// 应付总计
const payableTotal = ref(456456456);
// 利润
const profit = ref(456456456);

const profitClass = computed(() => (profit.value >= 0 ? 'profit-positive' : 'profit-negative'));

/** 初始化 */
function init(orderData: any) {
  // 这里可以添加加载费用详情数据的逻辑
  console.log('costDetail init called with:', orderData);
  // 模拟数据加载
  if (orderData && orderData.id) {
    // 实际开发中这里应该调用API加载数据
    receivableTotal.value = 9128;
    payableTotal.value = 9128;
    profit.value = 0;
    calculateProfit();
  }
}

/** 格式化数字显示 */
function formatNumber(value: number) {
  return parseFloat(String(value || 0)).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// 应收费用相关方法
function addReceivableRow() {
  const newIndex = receivableData.value.length + 1;
  receivableData.value.push({
    index: newIndex,
    feeName: '新费用项',
    amount: 0,
    editing: true
  });
}

function editReceivableRow(row: any) {
  row.editing = true;
}

function saveReceivableRow(row: any) {
  row.editing = false;
  calculateReceivableTotal();
}

function viewReceivableRow(row: any) {
  ElMessage({
    message: `查看应收费用: ${row.feeName}`,
    type: 'info'
  });
}

function deleteReceivableRow(row: any) {
  ElMessageBox.confirm(`确定要删除"${row.feeName}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = receivableData.value.indexOf(row);
    if (index !== -1) {
      receivableData.value.splice(index, 1);
      // 重新排序
      receivableData.value.forEach((item, idx) => {
        item.index = idx + 1;
      });
      calculateReceivableTotal();
    }
  });
}

function calculateReceivableTotal() {
  receivableTotal.value = receivableData.value.reduce((total, item) => {
    return total + parseFloat(item.amount || 0);
  }, 0);
  calculateProfit();
}

// 应付费用相关方法
function addPayableRow() {
  const newIndex = payableData.value.length + 1;
  payableData.value.push({
    index: newIndex,
    feeName: '新费用项',
    amount: 0,
    editing: true
  });
}

function editPayableRow(row: any) {
  row.editing = true;
}

function savePayableRow(row: any) {
  row.editing = false;
  calculatePayableTotal();
}

function viewPayableRow(row: any) {
  ElMessage({
    message: `查看应付费用: ${row.feeName}`,
    type: 'info'
  });
}

function deletePayableRow(row: any) {
  ElMessageBox.confirm(`确定要删除"${row.feeName}"吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = payableData.value.indexOf(row);
    if (index !== -1) {
      payableData.value.splice(index, 1);
      // 重新排序
      payableData.value.forEach((item, idx) => {
        item.index = idx + 1;
      });
      calculatePayableTotal();
    }
  });
}

function calculatePayableTotal() {
  payableTotal.value = payableData.value.reduce((total, item) => {
    return total + parseInt(item.amount || 0);
  }, 0);
  calculateProfit();
}

/** 计算利润 */
function calculateProfit() {
  profit.value = receivableTotal.value - payableTotal.value;
}

defineExpose({ init });
</script>

<style scoped>
.cost-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域：左右布局 */
.main-content {
  display: flex;
  gap: 20px;
  flex: 1;
  margin-bottom: 20px;
}

/* 左侧和右侧区域共用样式 */
.left-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
}

/* 标题区域 */
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

.payable-title {
  background-color: #fef0f0;
  color: #333;
}

/* 表格容器 */
.table-container {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.delete-btn {
  color: #f56c6c;
  padding: 2px 8px;
  min-width: 40px;
}

/* 统计信息区域 */
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

/* 响应式设计 */
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
