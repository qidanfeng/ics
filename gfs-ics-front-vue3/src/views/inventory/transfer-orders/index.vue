<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
            size="small"
            class="w-full"
            v-model="searchForm.orderNumber"
            placeholder="请输入调拨订单号"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.outWarehouseCode"
            placeholder="请选择调出仓库"
            clearable
          >
            <el-option
              v-for="item in warehouses"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            >
              <span style="float: left">{{ item.warehouseCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.inWarehouseCode"
            placeholder="请选择调入仓库"
            clearable
          >
            <el-option
              v-for="item in warehouses"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode"
            >
              <span style="float: left">{{ item.warehouseCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.projectId"
            filterable
            placeholder="请选择货主"
            clearable
          >
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.carrierId"
            placeholder="请选择承运商"
            clearable
          >
            <el-option
              v-for="item in carriers"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.orderStatusList"
            placeholder="请选择订单状态"
            clearable
            multiple
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.outStockStatus"
            placeholder="请选择出库状态"
            clearable
          >
            <el-option
              v-for="item in outStockStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select
            size="small"
            class="w-full"
            v-model="searchForm.issueStatus"
            placeholder="请选择下发状态"
            clearable
          >
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
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="small" type="primary" :loading="searchLoading" @click="handleSearch" class="w-full">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="hasAuth('ics:transferOrders:add')">
              <el-button size="small" @click="handleAdd" class="w-full">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="hasAuth('ics:transferOrders:issue')">
              <el-button size="small" :disabled="selectedRow.length === 0" :loading="issueLoading" @click="handleIssue" class="w-full">下发</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="4" v-if="hasAuth('ics:transferOrders:withdraw')">
              <el-button size="small" type="danger" :disabled="selectedRow.length === 0" :loading="issueRepealLoading" @click="handleIssueRepeal" class="w-full">下发撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="hasAuth('ics:transferOrders:cancel')">
              <el-button size="small" type="danger" :disabled="selectedRow.length === 0" :loading="cancelOrderLoading" @click="handleCancelOrder" class="w-full">取消</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="hasAuth('ics:transferOrders:export')">
              <el-button size="small" :loading="exportLoading" @click="handleExport" class="w-full">导出</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" style="flex: 1; display: flex; flex-direction: column;">
      <div style="flex: 1; overflow: hidden;">
        <el-table
          border
          size="small"
          highlight-current-row
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          style="width: 100%; height: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="orderNumber" label="调拨订单号" width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="outWarehouseName" label="调出仓库" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="inWarehouseName" label="调入仓库" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
          <el-table-column prop="carrierName" label="承运商" width="120" align="center" show-overflow-tooltip />
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
          <el-table-column prop="inStockFinishTime" label="入库完成时间" width="160" align="center" />
          <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="handleView(row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(row)" v-if="hasAuth('ics:transferOrders:edit')">编辑</el-button>
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
    <ShowDialog ref="showDialogRef" v-if="showDialogVisible" />

    <!-- 新增编辑弹窗 -->
    <UpdateOrAdd
      ref="updateOrAddRef"
      :delivery-method-options="deliveryMethodOptions"
      @success="handleSaveSuccess"
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
} from '@/service/api/inventory/transfer-order';
import {
  getInventoryTransferOrderStatusList,
  getTransferDeliveryMethodList,
  getOutStockStatusList,
  getIssueStatusList
} from '@/service/api/constant/order-constant';
import ShowDialog from './modules/show-dialog.vue';
import UpdateOrAdd from './modules/update-or-add.vue';

defineOptions({ name: 'TransferOrders' });

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
  outWarehouseCode: '',
  inWarehouseCode: '',
  supplierId: '',
  clientId: '',
  projectId: '',
  deliveryMethodCodeList: [],
  carrierId: '',
  transferStauts: '',
  orderStatusList: [],
  createdTimeStart: null as string | null,
  createdTimeEnd: null as string | null,
  page: 1,
  limit: 20
});

// 时间范围
const createdTimeRange = ref<string[]>([]);

// 平台数据
const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);
// platform store 已移除承运商功能，承运商下拉数据源为空数组
const carriers = ref<any[]>([]);

// 下拉选项
const deliveryMethodOptions = ref<any[]>([]);
const orderStatusOptions = ref<any[]>([]);
const outStockStatusOptions = ref<any[]>([]);
const issueStatusOptions = ref<any[]>([]);

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
const showDialogVisible = ref(false);

// 表格高度
const tableHeight = ref(500);
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
      tableHeight.value = Math.max(availableHeight, 300);
    }
  }, 100);
}

/** 获取送货方式列表 */
function loadDeliveryMethodOptions() {
  getTransferDeliveryMethodList()
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

/** 获取订单状态列表 */
function loadOrderStatusOptions() {
  getInventoryTransferOrderStatusList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        orderStatusOptions.value = data.data || [];
      }
    })
    .catch(() => {});
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
  updateOrAddRef.value?.addInit('新增调拨订单', {});
}

/** 编辑 */
function handleEdit(row: any) {
  updateOrAddRef.value?.updateInit('编辑调拨订单', row);
}

/** 查看详情 */
function handleView(row: any) {
  showDialogVisible.value = true;
  nextTick(() => {
    showDialogRef.value?.init(row);
  });
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
        a.download = `库存调拨单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
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
    ElMessage.warning('请先选择要下发的调拨订单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认下发调拨订单：${orderNumbers}？`, '下发调拨订单', {
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
            ElMessage.success('调拨订单下发成功');
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
    ElMessage.warning('请先选择要撤回的调拨订单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认撤回调拨订单：${orderNumbers}？`, '撤回调拨订单', {
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
            ElMessage.success('调拨订单撤回成功');
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
    ElMessage.warning('请先选择要取消的调拨订单');
    return;
  }
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认取消调拨订单：${orderNumbers}？取消后将无法恢复。`, '取消调拨订单', {
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
            ElMessage.success('调拨订单取消成功');
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
  pagination.page = 1;
  handleSearch();
}

/** 当前页变化 */
function handleCurrentChange(val: number) {
  pagination.page = val;
  handleSearch();
}

/** 保存成功 */
function handleSaveSuccess() {
  handleSearch();
}

/** 获取订单状态文本样式类 */
function getOrderStatusTextClass(status: number | string) {
  const statusClassMap: Record<string, string> = {
    10: 'status-text-pending',
    20: 'status-text-confirmed',
    30: 'status-text-processing',
    90: 'status-text-cancelled'
  };
  return statusClassMap[String(status)] || 'status-text-default';
}

/** 监听窗口大小变化 */
const handleResize = () => calculateTableHeight();

onMounted(() => {
  platformStore.init();
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

  .button-group .el-col {
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
