<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
        <el-row :gutter="10">
        <el-col :span="6">
          <el-date-picker
            size="small"
            v-model="billMonthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始账单月份"
            end-placeholder="结束账单月份"
            value-format="YYYY-MM"
            format="YYYY-MM"
            class="w-full"
          />
<!--          <el-date-picker-->
<!--            size="small" class="w-full"-->
<!--            v-model="createdTimeRange"-->
<!--            :clearable="false"-->
<!--            type="datetimerange"-->
<!--            range-separator="至"-->
<!--            start-placeholder="创建开始时间"-->
<!--            end-placeholder="创建结束时间"-->
<!--            value-format="YYYY-MM-DD HH:mm:ss"-->
<!--            format="YYYY-MM-DD HH:mm:ss"-->
<!--          />-->
        </el-col>
        <el-col :span="4">
          <el-input size="small" class="w-full"  v-model="searchForm.billNumber" placeholder="请输入月结账单号" clearable />
        </el-col>
          <el-col :span="4">
            <el-select size="small" class="w-full" v-model="searchForm.supplierId" placeholder="请选择供应商" filterable clearable
                       :filter-method="supplierFilterHandle"
                       @visible-change="handleSupplierVisibleChange"
            >
              <el-option
                style="width:400px"
                v-for="item in supplierOptionsForSelect"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId"
              >
                <span style="float: left">{{ item.supplierCode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplierName }}</span>
              </el-option>
            </el-select>
          </el-col>
        <el-col :span="4">
          <el-select size="small" class="w-full"  v-model="searchForm.statusList" placeholder="请选择状态" clearable multiple>
            <el-option
              v-for="item in billMonthRecordStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="8">
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
          <el-button size="small" v-if="hasAuth('ics:billMonthRecord:generate')" type="success" :icon="Document" @click="showGenerateMonthBill">生成月结账单</el-button>
          <el-button size="small" v-if="hasAuth('ics:billMonthRecord:reGenerate')" type="primary" :disabled="selectedRow.length === 0" :loading="reGenerateLoading" @click="handleReGenerateMonthBill()">重新月结</el-button>
          <el-button size="small" v-if="hasAuth('ics:billMonthRecord:confirm')" type="primary" :disabled="selectedRow.length === 0" :loading="confirmLoading" @click="handleConfirm()">确认</el-button>
          <el-button size="small" v-if="hasAuth('ics:billMonthRecord:export')" :loading="exportLoading" @click="handleExport">导出</el-button>
        </el-col>
        </el-row>
    </el-card>
    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        border
        size="small"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column type="selection" width="55" align="center" fixed="left" style="background-color: white"/>
        <el-table-column prop="billNumber" label="月结账单号" width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="billMonth" label="账单月份" width="120" align="center" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
<!--        <el-table-column prop="projectName" label="货主" min-width="150" align="center" show-overflow-tooltip />-->
<!--        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />-->
        <el-table-column prop="orderCount" label="订单个数" width="100" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="应收总金额(元)" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold">{{ row.arTotalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="应付总金额(元)" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold">{{ row.apTotalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="taxAmount" label="税额(元)" width="120" align="right">-->
<!--          <template #default="{ row }">-->
<!--            {{ row.taxAmount.toFixed(2) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.statusName)" size="small">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="confirmTime" label="确认时间" width="200" align="center" />
        <el-table-column prop="createdBy" label="创建人" width="150" align="center" show-overflow-tooltip/>
        <el-table-column prop="createdTime" label="创建时间" width="200" align="center" />
        <el-table-column prop="lastModifiedBy" label="修改人" width="150" align="center" show-overflow-tooltip/>
        <el-table-column prop="lastModifiedTime" label="修改时间" width="200" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="showDetail(row)">查看详情</el-button>
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
    <record-detail
      ref="recordDetailRef"
      @export="exportDetail"
    />

    <!-- 生成月结账单对话框 -->
    <el-dialog
      title="生成月结账单"
      v-model="generateMonthBillVisible"
      ref="generateMonthBillRef"
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
<!--        <el-form-item label="备注">-->
<!--          <el-input-->
<!--            v-model="generateMonthBillForm.remarks"-->
<!--            type="textarea"-->
<!--            :rows="3"-->
<!--            placeholder="请输入备注信息（选填）"-->
<!--          />-->
<!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <el-button @click="generateMonthBillVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGenerateMonthBill" :loading="generating">确定生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document } from '@element-plus/icons-vue';
import { usePlatformStore } from '@/store/modules/platform';
import { useAuth } from '@/hooks/business/auth';
import RecordDetail from './modules/record-detail.vue';
import { getListPage, generate, reGenerate, confirm, exportFile } from '@/service/api/bill/bill-month-record';
import { getBillMonthRecordStatusList } from '@/service/api/constant/order-constant';

defineOptions({ name: 'DailyBill' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

const loading = ref(false);
const exportLoading = ref(false);
const reGenerateLoading = ref(false);
const confirmLoading = ref(false);

const searchForm = reactive<any>({
  statusList: [],
  billMonth: '',
  supplierId: '',
  billNumber: null
});

const billMonthRange = ref<any[]>([]);
const billMonthRecordStatusOptions = ref<any[]>([]);
const selectedRow = ref<any[]>([]);
const tableData = ref<any[]>([]);
const supplierOptionsForSelect = ref<any[]>([]);

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

const recordDetailRef = ref();

async function loadData() {
  loading.value = true;
  try {
    // 设置时间范围参数到searchForm，与suggestion组件保持一致
    if (billMonthRange.value && billMonthRange.value.length === 2) {
      searchForm.billMonthStart = billMonthRange.value[0];
      searchForm.billMonthEnd = billMonthRange.value[1];
    } else {
      searchForm.billMonthStart = null;
      searchForm.billMonthEnd = null;
    }

    // 设置分页参数
    searchForm.page = pagination.page;
    searchForm.limit = pagination.size;
    searchForm.clientId = platformStore.client?.id;

    const { response } = await getListPage(searchForm);
    const data: any = response?.data;
    if (data && (data.code as unknown as number) === 0) {
      tableData.value = data.data.list || [];
      pagination.total = data.data.totalCount || 0;
      ElMessage.success('搜索完成');
    } else {
      ElMessage.error(data.message || '获取数据失败');
    }
  } catch (error) {
    console.error('搜索失败:', error);
    ElMessage.error('搜索失败');
  } finally {
    loading.value = false;
  }
}

function showDetail(row: any) {
  detailVisible.value = true;
  nextTick(() => {
    recordDetailRef.value?.init(row);
  });
}

function handleSearch() {
  loadData();
  ElMessage.success('查询完成');
}

function handleReset() {
  searchForm.statusList = [];
  searchForm.billMonth = '';
  searchForm.supplierId = '';
  searchForm.billNumber = null;
  loadData();
}

function loadBillMonthRecordStatusList() {
  getBillMonthRecordStatusList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && data.data && (data.code as unknown as number) === 0) {
        billMonthRecordStatusOptions.value = data.data;
      }
    })
    .catch(() => {});
}

function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = platformStore.suppliers.filter((item: any) => {
      if (!!~item.supplierCode.indexOf(val) || !!~item.supplierCode.toUpperCase().indexOf(val.toUpperCase()) || !!~item.supplierName.indexOf(val) || !!~item.supplierName.toUpperCase().indexOf(val.toUpperCase())) {
        return true;
      }
      return false;
    });
  } else {
    supplierOptionsForSelect.value = platformStore.suppliers;
  }
}

function handleSupplierVisibleChange() {
  supplierOptionsForSelect.value = platformStore.suppliers;
}

function exportDetail() {
  ElMessage.success('导出明细成功（演示）');
}

function showGenerateMonthBill() {
  generateMonthBillForm.billMonth = '';
  generateMonthBillForm.remarks = '';
  generateMonthBillForm.clientId = platformStore.client?.id;
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
    generate(generateMonthBillForm).then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        ElMessage.success('生成月结账单成功');
        generateMonthBillVisible.value = false;
        handleSearch();
      }
      generating.value = false;
    }).catch(() => {
      generating.value = false;
    });
  }).catch(() => {});
}

// 重新月结
function handleReGenerateMonthBill() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要重新月结的月结账单');
    return;
  }
  reGenerateLoading.value = true;
  const billNumbers = selectedRow.value.map((row: any) => row.billNumber).join('、');
  ElMessageBox.confirm(`重新月结：${billNumbers}？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const idList = selectedRow.value.map((row: any) => row.id);
    reGenerate(idList).then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        ElMessage.success('重新月结成功');
        handleSearch();
      }
      reGenerateLoading.value = false;
    }).catch(() => {
      reGenerateLoading.value = false;
    });
  }).catch(() => {
    reGenerateLoading.value = false;
  });
}

// 确认
function handleConfirm() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要确认的月结账单');
    return;
  }
  confirmLoading.value = true;
  const billNumbers = selectedRow.value.map((row: any) => row.billNumber).join('、');
  ElMessageBox.confirm(`确认月结账单：${billNumbers}？`, '确认提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    const idList = selectedRow.value.map((row: any) => row.id);
    confirm(idList).then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        ElMessage.success('确认成功');
        handleSearch();
      }
      confirmLoading.value = false;
    }).catch(() => {
      confirmLoading.value = false;
    });
  }).catch(() => {
    confirmLoading.value = false;
  });
}

function handleExport() {
  exportLoading.value = true;
  // 设置选中的ID列表
  searchForm.idList = selectedRow.value.map((item: any) => item.id);

  exportFile(searchForm).then((res: any) => {
    searchForm.idList = null;
    if (res) {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const a = document.createElement('a');
      a.addEventListener('click', function (e) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        a.download = `月结账单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
        a.href = URL.createObjectURL(blob);
      });
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', false, false);
      a.dispatchEvent(e);

      ElMessage.success('导出成功');
    }
    exportLoading.value = false;
  }).catch(() => {
    searchForm.idList = null;
    ElMessage.error('导出失败');
    exportLoading.value = false;
  });
}

function getStatusType(statusName: string) {
  const map: Record<string, string> = {
    '待确认': 'warning',
    '已确认': 'success',
    'RECONCILED': 'info'
  };
  return map[statusName] || 'info';
}

function getStatusName(status: string) {
  const map: Record<string, string> = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'RECONCILED': '已对账'
  };
  return map[status] || status;
}

function handleSelectionChange(selection: any[]) {
  selectedRow.value = selection;
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
  // 页面初始化时加载下拉框数据
  loadBillMonthRecordStatusList();
});

onActivated(() => {
  handleSearch();
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
