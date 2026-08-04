<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="small" class="w-full" v-model="searchForm.orderNumber" placeholder="请输入退供单号" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="small" class="w-full" v-model="searchForm.returnWarehouseCode" placeholder="请选择退货仓库" clearable>
            <el-option
              v-for="item in warehouses"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            >
              <div class="flex justify-between items-center w-full">
                <span>{{ item.warehouseCode }}</span>
                <span class="text-xs text-gray-400">{{ item.warehouseName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.supplierId"
            placeholder="请选择供应商"
            filterable
            clearable
            :filter-method="supplierFilterHandle"
            @visible-change="supplierOptionsForSelect = suppliers"
          >
            <el-option
              v-for="item in supplierOptionsForSelect"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            >
              <div class="flex justify-between items-center w-full">
                <span>{{ item.supplierCode }}</span>
                <span class="text-xs text-gray-400">{{ item.supplierName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="small" class="w-full" v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt-2">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="small" class="w-full" v-model="searchForm.orderStatusList" placeholder="请选择订单状态" clearable multiple>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="small" class="w-full" v-model="searchForm.outStockStatus" placeholder="请选择出库状态" clearable>
            <el-option
              v-for="item in outStockStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="small" class="w-full" v-model="searchForm.issueStatus" placeholder="请选择下发状态" clearable>
            <el-option
              v-for="item in issueStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-date-picker
            size="small"
            class="w-full"
            v-model="createdTimeRange"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2">
            <div>
              <el-button size="small" type="primary" :loading="searchLoading" class="w-full truncate" @click="handleSearch">查询</el-button>
            </div>
            <div v-if="hasAuth('ics:returnSupplier:add')">
              <el-button size="small" class="w-full truncate" @click="handleAdd">新增</el-button>
            </div>
            <div v-if="hasAuth('ics:returnSupplier:issue')">
              <el-button size="small" :disabled="selectedRow.length === 0" :loading="issueLoading" class="w-full truncate" @click="handleIssue">下发</el-button>
            </div>
            <div v-if="hasAuth('ics:returnSupplier:withdraw')">
              <el-button size="small" type="danger" :disabled="selectedRow.length === 0" :loading="issueRepealLoading" class="w-full truncate" @click="handleIssueRepeal">下发撤回</el-button>
            </div>
            <div v-if="hasAuth('ics:returnSupplier:cancel')">
              <el-button size="small" type="danger" :disabled="selectedRow.length === 0" :loading="cancelOrderLoading" class="w-full truncate" @click="handleCancelOrder">取消</el-button>
            </div>
            <div v-if="hasAuth('ics:returnSupplier:export')">
              <el-button size="small" :loading="exportLoading" class="w-full truncate" @click="handleExport">导出</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <div style="flex: 1; overflow: hidden;">
        <el-table
          border
          size="small"
          highlight-current-row
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />

          <el-table-column prop="orderNumber" label="退供单号" width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="returnWarehouseName" label="退货仓库" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="supplierName" label="供应商" width="250" align="center" show-overflow-tooltip />
          <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
          <el-table-column prop="orderStatusName" label="订单状态" width="120" align="center">
            <template #default="{ row }">
              <span :class="getOrderStatusTextClass(row.orderStatus)">
                {{ row.orderStatusName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="outStockStatusName" label="出库状态" width="120" align="center" />
          <el-table-column prop="issueStatusName" label="下发状态" width="120" align="center" />
          <el-table-column prop="omsOrderNumber" label="OMS订单号" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="outStockFinishTime" label="出库完成时间" width="160" align="center" />
          <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="handleView(row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(row)" v-if="hasAuth('ics:returnSupplier:edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          ref="paginationRef"
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

    <!-- 查看详情弹窗组件 -->
    <ShowDialog v-if="showDialogVisible" ref="showDialogRef" @close="handleShowDialogClose" />

    <!-- 新增编辑弹窗 -->
    <UpdateOrAdd
      v-if="dialogVisible"
      ref="updateOrAddRef"
      :delivery-method-options="deliveryMethodOptions"
      @success="handleSaveSuccess"
      @close="handleUpdateOrAddClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth } from '@/hooks/business/auth';
import { usePlatformStore } from '@/store/modules/platform';
import {
  getListPage,
  issue as issueApi,
  issueRepeal,
  cancelOrder,
  exportFile
} from '@/service/api/inventory/return-supplier';
import {
  getReturnSupplierOutOrderStatusList,
  getReturnSupplierDeliveryMethodList,
  getOutStockStatusList,
  getIssueStatusList
} from '@/service/api/constant/order-constant';
import ShowDialog from './modules/show-dialog.vue';
import UpdateOrAdd from './modules/update-or-add.vue';

defineOptions({ name: 'ReturnSupplier' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

// 加载状态
const loading = ref(false);
const searchLoading = ref(false);
const issueLoading = ref(false);
const issueRepealLoading = ref(false);
const cancelOrderLoading = ref(false);
const exportLoading = ref(false);

// 搜索表单
const searchForm = reactive<any>({
  orderNumber: '',
  returnWarehouseCode: '',
  supplierId: '',
  clientId: '',
  projectId: '',
  deliveryMethodCodeList: [],
  orderStatusList: [],
  outStockStatus: '',
  issueStatus: '',
  createdTimeStart: null as string | null,
  createdTimeEnd: null as string | null,
  page: 1,
  limit: 20
});

const supplierOptionsForSelect = ref<any[]>([]);
const createdTimeRange = ref<string[]>([]);
const deliveryMethodOptions = ref<any[]>([]);
const orderStatusOptions = ref<any[]>([]);
const outStockStatusOptions = ref<any[]>([]);
const issueStatusOptions = ref<any[]>([]);

// 平台数据
const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);
const suppliers = ref<any[]>([]);

// 表格数据
const tableData = ref<any[]>([]);
const selectedRow = ref<any[]>([]);

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});

// 弹窗状态
const dialogVisible = ref(false);
const currentFormData = ref<any>({});
const showDialogVisible = ref(false);
const tableHeight = ref(600);

const searchCardRef = ref();
const paginationRef = ref();
const showDialogRef = ref();
const updateOrAddRef = ref();

// 平台数据初始化标记
let platformSynced = false;

/** 同步平台数据到本地 */
function syncPlatformData() {
  if (platformSynced) return;
  projects.value = platformStore.projects;
  warehouses.value = platformStore.warehouses;
  suppliers.value = platformStore.suppliers;
  supplierOptionsForSelect.value = platformStore.suppliers;
  platformSynced = true;
}

/** 设置默认时间范围（最近7天） */
function setDefaultTimeRange() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const formatStartDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 00:00:00`;
  };

  const formatEndDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 23:59:59`;
  };

  createdTimeRange.value = [formatStartDateTime(sevenDaysAgo), formatEndDateTime(now)];
}

/** 计算表格高度 */
function calculateTableHeight() {
  setTimeout(() => {
    const searchCard = searchCardRef.value?.$el;
    const paginationContainer = paginationRef.value?.$el;
    const headerHeight = 150;
    const padding = 20;
    if (searchCard && paginationContainer) {
      const searchCardHeight = searchCard.offsetHeight || 0;
      const paginationHeight = paginationContainer.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
      tableHeight.value = Math.max(300, availableHeight);
    }
  }, 100);
}

/** 获取送货方式列表 */
function loadDeliveryMethodOptions() {
  getReturnSupplierDeliveryMethodList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        deliveryMethodOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

/** 获取出库状态列表 */
function loadOutStockStatusOptions() {
  getOutStockStatusList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        outStockStatusOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

/** 获取下发状态列表 */
function loadIssueStatusOptions() {
  getIssueStatusList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        issueStatusOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

/** 加载订单状态 */
function loadOrderStatusOptions() {
  getReturnSupplierOutOrderStatusList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        orderStatusOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

/** 供应商过滤 */
function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = suppliers.value.filter(item => {
      return (
        item.supplierCode?.indexOf(val) > -1 ||
        item.supplierCode?.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
        item.supplierName?.indexOf(val) > -1 ||
        item.supplierName?.toUpperCase().indexOf(val.toUpperCase()) > -1
      );
    });
  } else {
    supplierOptionsForSelect.value = suppliers.value;
  }
}

/** 查询 */
function handleSearch() {
  searchLoading.value = true;
  loading.value = true;
  if (createdTimeRange.value && createdTimeRange.value.length === 2) {
    searchForm.createdTimeStart = createdTimeRange.value[0];
    searchForm.createdTimeEnd = createdTimeRange.value[1];
  } else {
    searchForm.createdTimeStart = null;
    searchForm.createdTimeEnd = null;
  }
  searchForm.page = pagination.page;
  searchForm.limit = pagination.size;
  searchForm.clientId = platformStore.client?.id;

  getListPage(searchForm)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        tableData.value = data.data?.list || [];
        pagination.total = data.data?.totalCount || 0;
        ElMessage.success('搜索完成');
      }
      loading.value = false;
      searchLoading.value = false;
    })
    .catch(() => {
      loading.value = false;
      searchLoading.value = false;
    });
}

/** 新增 */
function handleAdd() {
  currentFormData.value = {
    id: '',
    orderType: '',
    expectedArrivalDate: '',
    projectId: '',
    projectCode: '',
    projectName: '',
    returnWarehouseCode: '',
    returnWarehouseName: '',
    supplierId: '',
    supplierCode: '',
    supplierName: '',
    deliveryMethod: '',
    remark: '',
    returnDetails: []
  };
  dialogVisible.value = true;
  nextTick(() => {
    updateOrAddRef.value?.addInit('新增退供单');
  });
}

/** 编辑 */
function handleEdit(row: any) {
  currentFormData.value = { ...row };
  dialogVisible.value = true;
  nextTick(() => {
    updateOrAddRef.value?.updateInit('编辑退供单', row);
  });
}

/** 查看详情 */
function handleView(row: any) {
  showDialogVisible.value = true;
  nextTick(() => {
    showDialogRef.value?.init(row);
  });
}

/** 查看弹窗关闭 */
function handleShowDialogClose() {
  showDialogVisible.value = false;
}

/** 新增/编辑弹窗关闭 */
function handleUpdateOrAddClose() {
  dialogVisible.value = false;
}

/** 导出 */
function handleExport() {
  exportLoading.value = true;
  (searchForm as any).idList = selectedRow.value.map(item => item.id);
  exportFile(searchForm)
    .then(({ data }) => {
      (searchForm as any).idList = null;
      if (data) {
        const blob = new Blob([data as any], { type: 'application/vnd.ms-excel' });
        const a = document.createElement('a');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        a.download = `退供出库单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
      }
      exportLoading.value = false;
    })
    .catch(() => {
      (searchForm as any).idList = null;
      exportLoading.value = false;
    });
}

/** 批量下发 */
function handleIssue() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要下发的退供单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认下发退供单：${orderNumbers}？`, '下发退供单', {
    confirmButtonText: '确认下发',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      issueLoading.value = true;
      const ids = selectedRow.value.map(row => row.id);
      issueApi(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('退供单下发成功');
            handleSearch();
          }
          issueLoading.value = false;
        })
        .catch(() => {
          issueLoading.value = false;
        });
    })
    .catch(() => {});
}

/** 批量撤回 */
function handleIssueRepeal() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要撤回的退供单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认撤回退供单：${orderNumbers}？`, '撤回退供单', {
    confirmButtonText: '确认撤回',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      issueRepealLoading.value = true;
      const ids = selectedRow.value.map(row => row.id);
      issueRepeal(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('退供单撤回成功');
            handleSearch();
          }
          issueRepealLoading.value = false;
        })
        .catch(() => {
          issueRepealLoading.value = false;
        });
    })
    .catch(() => {});
}

/** 批量取消 */
function handleCancelOrder() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要取消的退供单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认取消退供单：${orderNumbers}？取消后将无法恢复。`, '取消退供单', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'error'
  })
    .then(() => {
      cancelOrderLoading.value = true;
      const ids = selectedRow.value.map(row => row.id);
      cancelOrder(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('退供单取消成功');
            handleSearch();
          }
          cancelOrderLoading.value = false;
        })
        .catch(() => {
          cancelOrderLoading.value = false;
        });
    })
    .catch(() => {});
}

/** 多选变化 */
function handleSelectionChange(selection: any[]) {
  selectedRow.value = selection;
}

/** 分页大小变化 */
function handleSizeChange(val: number) {
  pagination.size = val;
  handleSearch();
}

/** 当前页变化 */
function handleCurrentChange(val: number) {
  pagination.page = val;
  handleSearch();
}

/** 保存成功处理 */
function handleSaveSuccess() {
  handleSearch();
}

/** 获取订单状态文本样式类 */
function getOrderStatusTextClass(status: number | string) {
  const statusClassMap: Record<string, string> = {
    '10': 'status-text-pending',
    '20': 'status-text-confirmed',
    '30': 'status-text-processing',
    '90': 'status-text-cancelled'
  };
  return statusClassMap[String(status)] || 'status-text-default';
}

/** 监听窗口大小变化 */
const handleResize = () => calculateTableHeight();

onMounted(() => {
  platformStore.init?.();
  syncPlatformData();
  setDefaultTimeRange();
  loadDeliveryMethodOptions();
  loadOrderStatusOptions();
  loadOutStockStatusOptions();
  loadIssueStatusOptions();
  calculateTableHeight();
  window.addEventListener('resize', handleResize);
});

onActivated(() => {
  syncPlatformData();
  calculateTableHeight();
  handleSearch();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.app-container {
  padding: 10px 10px 0 10px;
  height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
}

.search-card {
  margin-bottom: 10px;
}

.table-card {
  margin-bottom: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: 10px;
  text-align: right;
}

/* 状态文本样式 */
.status-text-pending {
  color: #e6a23c;
  font-weight: 600;
}

.status-text-processing {
  color: #409eff;
  font-weight: 600;
}

.status-text-confirmed {
  color: #67c23a;
  font-weight: 600;
}

.status-text-completed {
  color: #67c23a;
  font-weight: 600;
}

.status-text-cancelled {
  color: #f56c6c;
  font-weight: 600;
}

.status-text-default {
  color: #909399;
  font-weight: 600;
}

/* 响应式布局优化 */
@media screen and (max-width: 768px) {
  .search-card .el-col {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 480px) {
  .app-container {
    padding: 5px;
  }

  .search-card {
    margin-bottom: 5px;
  }
}
</style>
