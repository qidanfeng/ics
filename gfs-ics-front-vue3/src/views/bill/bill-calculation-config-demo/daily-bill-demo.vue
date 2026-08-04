<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" size="small" inline>
        <el-form-item label="账单日期">
          <el-date-picker
            v-model="searchForm.billDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" placeholder="请选择" clearable style="width: 200px">
            <el-option
              v-for="item in supplierOptions"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货主">
          <el-select v-model="searchForm.projectId" placeholder="请选择" clearable style="width: 200px">
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账单状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="待确认" value="PENDING" />
            <el-option label="已确认" value="CONFIRMED" />
            <el-option label="已对账" value="RECONCILED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Document" @click="showGenerateMonthBill">生成月结账单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        border
        size="small"
        v-loading="loading"
        class="w-full"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="billNo" label="日结账单号" width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="billDate" label="账单日期" width="120" align="center" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="orderCount" label="订单数量" width="100" align="center">
          <template #default="{ row }">
            <el-link type="primary" @click="showDetail(row)">{{ row.orderCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额(元)" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold">{{ row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额(元)" width="120" align="right">
          <template #default="{ row }">
            {{ row.taxAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="生成时间" width="160" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="showDetail(row)">查看详情</el-button>
            <el-button type="text" size="small" @click="handleConfirm(row)" v-if="row.status === 'PENDING'">确认</el-button>
            <el-button type="text" size="small" @click="handleExport(row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[20, 50, 100]"
          :page-size="pagination.size"
          :total="pagination.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单费用明细组件 -->
    <order-fee-detail
      v-model:visible="detailVisible"
      :bill-data="currentBill"
      :order-detail-data="orderDetailData"
      @export="exportDetail"
    />

    <!-- 生成月结账单对话框 -->
    <el-dialog
      title="生成月结账单"
      v-model="generateMonthBillVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="generateMonthBillForm" label-width="100px" size="small">
        <el-form-item label="账单月份" required>
          <el-date-picker
            v-model="generateMonthBillForm.billMonth"
            type="month"
            placeholder="请选择账单月份"
            value-format="YYYY-MM"
            format="YYYY-MM"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="generateMonthBillForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="generateMonthBillVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGenerateMonthBill" :loading="generating">确定生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document } from '@element-plus/icons-vue';
import OrderFeeDetail from './modules/order-fee-detail.vue';

defineOptions({ name: 'DailyBill' });

const loading = ref(false);
const searchForm = reactive<any>({
  billDate: '',
  supplierId: '',
  projectId: '',
  status: ''
});
const tableData = ref<any[]>([]);
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});
const detailVisible = ref(false);
const currentBill = ref<any>(null);
const orderDetailData = ref<any[]>([]);
const generateMonthBillVisible = ref(false);
const generating = ref(false);
const generateMonthBillForm = reactive<any>({
  billMonth: '',
  remarks: ''
});

// 静态选项
const supplierOptions = ref([
  { supplierId: '1001', supplierName: '优质供应商有限公司' },
  { supplierId: '1002', supplierName: '快捷物流供应商' },
  { supplierId: '1003', supplierName: '华东配送中心' }
]);
const projectOptions = ref([
  { projectId: '2001', projectName: '京东自营项目' },
  { projectId: '2002', projectName: '天猫旗舰店项目' },
  { projectId: '2003', projectName: '拼多多官方店' }
]);

function loadData() {
  loading.value = true;
  // 模拟数据
  tableData.value = [
    {
      id: '1',
      billNo: 'DRB20260305001',
      billDate: '2026-03-05',
      supplierId: '1001',
      supplierName: '优质供应商有限公司',
      projectId: '2001',
      projectName: '京东自营项目',
      warehouseCode: 'WH-BJ-001',
      warehouseName: '北京大兴仓',
      orderCount: 15,
      totalAmount: 12580.50,
      taxAmount: 1635.47,
      status: 'CONFIRMED',
      createdTime: '2026-03-05 23:00:00'
    },
    {
      id: '2',
      billNo: 'DRB20260305002',
      billDate: '2026-03-05',
      supplierId: '1002',
      supplierName: '快捷物流供应商',
      projectId: '2002',
      projectName: '天猫旗舰店项目',
      warehouseCode: 'WH-SH-001',
      warehouseName: '上海浦东仓',
      orderCount: 23,
      totalAmount: 18650.80,
      taxAmount: 2424.60,
      status: 'PENDING',
      createdTime: '2026-03-05 23:00:00'
    },
    {
      id: '3',
      billNo: 'DRB20260304001',
      billDate: '2026-03-04',
      supplierId: '1003',
      supplierName: '华东配送中心',
      projectId: '2003',
      projectName: '拼多多官方店',
      warehouseCode: 'WH-GZ-001',
      warehouseName: '广州白云仓',
      orderCount: 18,
      totalAmount: 14320.30,
      taxAmount: 1861.64,
      status: 'RECONCILED',
      createdTime: '2026-03-04 23:00:00'
    }
  ];
  pagination.total = 3;
  loading.value = false;
}

function showDetail(row: any) {
  currentBill.value = row;
  detailVisible.value = true;
  // 模拟订单费用明细数据
  orderDetailData.value = [
    {
      orderNo: 'ORD202603050001',
      orderType: '入库单',
      costItemName: '仓储保管费',
      productNumber: 'PRD-20260001',
      productName: '高端智能手机',
      quantity: 100,
      unit: '件',
      unitPrice: 2.5,
      amount: 250.00,
      taxRate: 0.13,
      taxAmount: 32.50,
      billingRule: '按件数计费',
      completeTime: '2026-03-05 10:30:00'
    },
    {
      orderNo: 'ORD202603050001',
      orderType: '入库单',
      costItemName: '装卸作业费',
      productNumber: 'PRD-20260001',
      productName: '高端智能手机',
      quantity: 100,
      unit: '件',
      unitPrice: 1.5,
      amount: 150.00,
      taxRate: 0.13,
      taxAmount: 19.50,
      billingRule: '按件数计费',
      completeTime: '2026-03-05 10:30:00'
    },
    {
      orderNo: 'ORD202603050002',
      orderType: '出库单',
      costItemName: '分拣作业费',
      productNumber: 'PRD-20260002',
      productName: '无线蓝牙耳机',
      quantity: 200,
      unit: '件',
      unitPrice: 0.8,
      amount: 160.00,
      taxRate: 0.13,
      taxAmount: 20.80,
      billingRule: '按件数计费',
      completeTime: '2026-03-05 14:20:00'
    },
    {
      orderNo: 'ORD202603050003',
      orderType: '调拨单',
      costItemName: '干线运输费',
      productNumber: 'PRD-20260003',
      productName: '智能手表',
      quantity: 50,
      unit: '件',
      unitPrice: 5.0,
      amount: 250.00,
      taxRate: 0.13,
      taxAmount: 32.50,
      billingRule: '按件数计费',
      completeTime: '2026-03-05 16:45:00'
    }
  ];
}

function handleSearch() {
  loadData();
  ElMessage.success('查询完成');
}

function handleReset() {
  searchForm.billDate = '';
  searchForm.supplierId = '';
  searchForm.projectId = '';
  searchForm.status = '';
  loadData();
}

function handleConfirm(row: any) {
  ElMessageBox.confirm('确认该日结账单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 'CONFIRMED';
    ElMessage.success('确认成功');
  }).catch(() => {});
}

function handleExport(row: any) {
  ElMessage.success('导出成功（演示）');
}

function exportDetail() {
  ElMessage.success('导出明细成功（演示）');
}

function showGenerateMonthBill() {
  generateMonthBillForm.billMonth = '';
  generateMonthBillForm.remarks = '';
  // 默认选择上个月
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonth.getFullYear();
  const month = (lastMonth.getMonth() + 1).toString().padStart(2, '0');
  generateMonthBillForm.billMonth = `${year}-${month}`;

  generateMonthBillVisible.value = true;
}

function handleGenerateMonthBill() {
  if (!generateMonthBillForm.billMonth) {
    ElMessage.warning('请选择账单月份');
    return;
  }

  ElMessageBox.confirm(`确认生成 ${generateMonthBillForm.billMonth} 的月结账单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    generating.value = true;
    // 模拟生成过程
    setTimeout(() => {
      generating.value = false;
      generateMonthBillVisible.value = false;
      ElMessage.success(`月结账单生成成功：${generateMonthBillForm.billMonth}`);
      // 可以跳转到月结账单页面或刷新列表
    }, 1000);
  }).catch(() => {});
}

function getStatusType(status: string) {
  const map: Record<string, string> = {
    'PENDING': 'warning',
    'CONFIRMED': 'success',
    'RECONCILED': 'info'
  };
  return map[status] || 'info';
}

function getStatusName(status: string) {
  const map: Record<string, string> = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'RECONCILED': '已对账'
  };
  return map[status] || status;
}

function handleSizeChange(val: number) {
  pagination.size = val;
  loadData();
}

function handleCurrentChange(val: number) {
  pagination.page = val;
  loadData();
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 15px;
}

.table-card {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}
</style>
