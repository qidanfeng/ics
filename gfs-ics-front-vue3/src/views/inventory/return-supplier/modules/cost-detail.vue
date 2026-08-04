<template>
  <div class="cost-detail-container">
    <div style="margin-bottom: 4px;">
      <el-button
        v-if="hasAuth('ics:returnSupplier:costDetail:reCalc')"
        type="primary"
        size="small"
        @click="reCalcCost"
      >
        <el-icon style="margin-right: 4px;"><Refresh /></el-icon>
        重新自动计算费用
        <el-tooltip placement="top" content="根据计费配置重新自动计算费用，手工创建的费用不受影响">
          <el-icon class="section-icon"><Warning /></el-icon>
        </el-tooltip>
      </el-button>
    </div>
    <!-- 主要内容区域：左右布局 -->
    <div class="main-content">
      <!-- 左侧：应收费用 -->
      <div class="left-section receivable-section">
        <div class="section-title receivable-title">
          <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add')" type="primary" size="small" @click="addReceivableRow">+</el-button>
          <h3>应收费用</h3>
        </div>
        <div class="table-container">
          <el-table
            size="small"
            :data="receivableData"
            height="400"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.costItemName }}</span>
                <el-select v-else size="small" @change="(value: any) => costItemCodeHandle(value, scope.row)" style="width:100%" v-model="scope.row.costItemCode" filterable placeholder="请选择费项">
                  <el-option
                    v-for="item in costItemOptions"
                    :key="item.costItemCode"
                    :label="item.costItemName"
                    :value="item.costItemCode"
                  >
                    <span style="float: left">{{ item.costItemCode }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template #default="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.totalPrice }}</span>
                <el-input-number v-else v-model="scope.row.totalPrice" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add') && scope.row.tempNewData" size="small" type="text" @click="saveReceivableRow(scope.row)">保存</el-button>
                <el-button size="small" type="text" v-else @click="viewReceivableRow(scope.row)">查看</el-button>
                <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add') && scope.row.tempNewData" size="small" type="text" class="delete-btn" @click="deleteReceivableRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 右侧：应付费用 -->
      <div class="right-section payable-section">
        <div class="section-title payable-title">
          <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add')" type="primary" size="small" @click="addPayableRow">+</el-button>
          <h3>应付费用</h3>
        </div>
        <div class="table-container">
          <el-table
            :data="payableData"
            size="small"
            height="400"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.costItemName }}</span>
                <el-select v-else size="small" @change="(value: any) => costItemCodeHandle(value, scope.row)" style="width:100%" v-model="scope.row.costItemCode" filterable placeholder="请选择费项">
                  <el-option
                    v-for="item in costItemOptions"
                    :key="item.costItemCode"
                    :label="item.costItemName"
                    :value="item.costItemCode"
                  >
                    <span style="float: left">{{ item.costItemCode }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template #default="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.totalPrice }}</span>
                <el-input-number v-else v-model="scope.row.totalPrice" size="small" :min="0" :precision="2" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="scope">
                <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add') && scope.row.tempNewData" type="text" size="small" @click="savePayableRow(scope.row)">保存</el-button>
                <el-button type="text" size="small" v-else @click="viewPayableRow(scope.row)">查看</el-button>
                <el-button v-if="hasAuth('ics:returnSupplier:costDetail:add') && scope.row.tempNewData" type="text" size="small" class="delete-btn" @click="deletePayableRow(scope.row)">删除</el-button>
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
    <CostDetailInfo ref="costDetailInfoRef" @refreshData="refreshData" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh, Warning } from '@element-plus/icons-vue';
import { useAuth } from '@/hooks/business/auth';
import {
  getBillByOrderNumber,
  billReCalc,
  billSave,
  billUpdate
} from '@/service/api/inventory/return-supplier';
import { getAllCostItemCodeList } from '@/service/api/bill/bill-item-config';
import CostDetailInfo from './cost-detail-info.vue';

defineOptions({ name: 'ReturnSupplierCostDetail' });

const { hasAuth } = useAuth();

const costDetailInfoRef = ref();

const orderNumber = ref('');
const receivableData = ref<any[]>([]);
const payableData = ref<any[]>([]);
const receivableTotal = ref(0);
const payableTotal = ref(0);
const profit = ref(0);
const costItemOptions = ref<any[]>([]);

const profitClass = computed(() => (profit.value >= 0 ? 'profit-positive' : 'profit-negative'));

/** 初始化组件数据 */
async function init(data: any) {
  orderNumber.value = data.orderNumber;
  await loadBillData();
  loadAllCostItem();
  calculateReceivableTotal();
  calculatePayableTotal();
}

/** 刷新数据 */
async function refreshData() {
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
            receivableData.value.forEach((item: any, idx: number) => {
              item.index = idx + 1;
            });
          }
          if (data.data.apDetailList) {
            payableData.value = data.data.apDetailList;
            payableData.value.forEach((item: any, idx: number) => {
              item.index = idx + 1;
            });
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

/** 费项编码变更处理 */
function costItemCodeHandle(value: string, row: any) {
  const item = costItemOptions.value.find((item: any) => item.costItemCode == value);
  if (item) {
    row.costItemName = item.costItemName;
  }
}

/** 加载所有费项编码 */
function loadAllCostItem() {
  getAllCostItemCodeList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        costItemOptions.value = data.data;
      }
    })
    .catch(() => {});
}

/** 重新自动计算费用 */
function reCalcCost() {
  ElMessageBox.confirm(`确定重新自动计算费用吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      billReCalc(orderNumber.value)
        .then(async ({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('重新自动计算费用成功');
            await loadBillData();
            calculateReceivableTotal();
            calculatePayableTotal();
          }
        })
        .catch(() => {});
    })
    .catch(() => {});
}

/** 新增应收费用行 */
function addReceivableRow() {
  const newIndex = receivableData.value.length + 1;
  receivableData.value.push({
    index: newIndex,
    tempNewData: true,
    totalPrice: 0,
    costType: 1,
    orderNumber: orderNumber.value,
    editing: true
  });
}

/** 保存应收费用行 */
function saveReceivableRow(row: any) {
  row.editing = false;
  let api: any = null;
  if (row.id) {
    api = billUpdate([row]);
  } else {
    api = billSave([row]);
    row.costPrice = row.totalPrice;
  }
  api
    .then(async ({ response }: any) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        ElMessage.success('保存成功');
        await loadBillData();
        calculateReceivableTotal();
      }
    })
    .catch(() => {});
}

/** 查看应收费用行 */
function viewReceivableRow(row: any) {
  costDetailInfoRef.value?.init(row);
}

/** 删除应收费用行 */
function deleteReceivableRow(row: any) {
  ElMessageBox.confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = receivableData.value.indexOf(row);
      if (index !== -1) {
        receivableData.value.splice(index, 1);
        receivableData.value.forEach((item: any, idx: number) => {
          item.index = idx + 1;
        });
        calculateReceivableTotal();
      }
    })
    .catch(() => {});
}

/** 计算应收总计 */
function calculateReceivableTotal() {
  receivableTotal.value = receivableData.value.reduce((total: number, item: any) => {
    return total + parseFloat(item.totalPrice || 0);
  }, 0);
  calculateProfit();
}

/** 新增应付费用行 */
function addPayableRow() {
  const newIndex = payableData.value.length + 1;
  payableData.value.push({
    index: newIndex,
    tempNewData: true,
    totalPrice: 0,
    costType: 2,
    orderNumber: orderNumber.value,
    editing: true
  });
}

/** 保存应付费用行 */
function savePayableRow(row: any) {
  row.editing = false;
  let api: any = null;
  if (row.id) {
    api = billUpdate([row]);
  } else {
    api = billSave([row]);
    row.costPrice = row.totalPrice;
  }
  api
    .then(async ({ response }: any) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        ElMessage.success('保存成功');
        await loadBillData();
        calculatePayableTotal();
      }
    })
    .catch(() => {});
}

/** 查看应付费用行 */
function viewPayableRow(row: any) {
  costDetailInfoRef.value?.init(row);
}

/** 删除应付费用行 */
function deletePayableRow(row: any) {
  ElMessageBox.confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = payableData.value.indexOf(row);
      if (index !== -1) {
        payableData.value.splice(index, 1);
        payableData.value.forEach((item: any, idx: number) => {
          item.index = idx + 1;
        });
        calculatePayableTotal();
      }
    })
    .catch(() => {});
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

.delete-btn {
  color: #f56c6c;
  padding: 2px 8px;
  min-width: 40px;
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

.section-icon {
  margin-left: 4px;
  vertical-align: middle;
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
