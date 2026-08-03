<template>
  <div class="h-full">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="mb-4">
      <el-row :gutter="10" class="search-row">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
            v-model="searchForm.orderNumber"
            placeholder="请输入采购订单号"
            clearable
            size="small"
            class="w-full"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.deliveryWarehouseCode"
            placeholder="请选择送货仓库"
            clearable
            size="small"
            class="w-full"
          >
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
            v-model="searchForm.supplierId"
            placeholder="请选择供应商"
            filterable
            clearable
            size="small"
            class="w-full"
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
          <el-select
            v-model="searchForm.projectId"
            filterable
            placeholder="请选择货主"
            clearable
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select
            v-model="searchForm.orderStatusList"
            placeholder="请选择订单状态"
            clearable
            multiple
            size="small"
            class="w-full"
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
            v-model="searchForm.deliveryMethodCodeList"
            placeholder="请选择送货方式"
            clearable
            multiple
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in deliveryMethodOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt-2">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.carrierId"
            placeholder="请选择承运商"
            clearable
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in carriers"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-date-picker
            v-model="createdTimeRange"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            size="small"
            class="w-full"
          />
        </el-col>
      </el-row>
      <el-row class="mt-2">
        <el-col :span="24">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2">
            <div>
              <el-button
                size="small"
                type="primary"
                :loading="searchLoading"
                class="w-full truncate"
                @click="handleSearch"
              >
                查询
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:add')">
              <el-button size="small" class="w-full truncate" @click="handleAdd">新增</el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:sendSupplier')">
              <el-button
                size="small"
                :disabled="selectedRow.length === 0"
                :loading="sendSupplierLoading"
                class="w-full truncate"
                @click="handleSendSupplierConfirm"
              >
                发送供应商确认
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:sendSupplierRepeal')">
              <el-button
                size="small"
                type="danger"
                :disabled="selectedRow.length === 0"
                :loading="sendSupplierRepealLoading"
                class="w-full truncate"
                @click="handleSendSupplierConfirmRepeal"
              >
                发送供应商撤回
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:confirmRepeal')">
              <el-button
                size="small"
                type="danger"
                :disabled="selectedRow.length === 0"
                :loading="confirmRepealLoading"
                class="w-full truncate"
                @click="handleConfirmRepeal"
              >
                订单确认撤回
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:generateInbound')">
              <el-button
                size="small"
                :disabled="selectedRow.length === 0"
                :loading="generateInboundLoading"
                class="w-full truncate"
                @click="handleGenerateInbound"
              >
                生成采购入库单
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:inboundWithdraw')">
              <el-button
                size="small"
                type="danger"
                :disabled="selectedRow.length === 0"
                :loading="inboundWithdrawLoading"
                class="w-full truncate"
                @click="handleInboundWithdraw"
              >
                采购入库撤回
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:cancel')">
              <el-button
                size="small"
                type="danger"
                :disabled="selectedRow.length === 0"
                :loading="cancelLoading"
                class="w-full truncate"
                @click="handleCancel"
              >
                取消
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:import')">
              <el-button size="small" :loading="importLoading" class="w-full truncate" @click="handleImport">
                导入
              </el-button>
            </div>
            <div v-if="hasAuth('ics:suggestion:export')">
              <el-button size="small" :loading="exportLoading" class="w-full truncate" @click="handleExport">
                导出
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card>
      <el-table
        :data="tableData"
        border
        size="small"
        highlight-current-row
        :height="tableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="orderNumber" label="采购订单号" width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="fromAddressName" label="提货地址" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="deliveryWarehouseName" label="送货仓库" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="supplierName" label="供应商" width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
        <el-table-column prop="carrierName" label="承运商" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="orderStatusName" label="订单状态" width="120" align="center">
          <template #default="{ row }">
            <span :class="getStatusTextClass(row.orderStatus)">{{ row.orderStatusName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="estimatedDeliveryDate" label="预计到仓日期" width="120" align="center" />
        <el-table-column prop="orderSourceName" label="订单来源" width="120" align="center" />
        <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
        <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleView(row)">查看</el-button>
            <el-button v-if="hasAuth('ics:suggestion:edit')" type="text" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="hasAuth('ics:suggestion:supplierConfirm')"
              type="text"
              size="small"
              :loading="manuConfirmLoading"
              @click="manuConfirm(row)"
            >
              手动确认
            </el-button>
            <el-button
              v-if="hasAuth('ics:suggestion:supplierConfirm')"
              type="text"
              size="small"
              :loading="supplierConfirmLoading"
              @click="supplierConfirm(row)"
            >
              供应商确认
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        ref="paginationRef"
        size="small"
        :current-page="pagination.page"
        :page-sizes="[20, 50, 100]"
        :page-size="pagination.size"
        :total="pagination.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-2"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <UpdateOrAdd
      v-if="dialogVisible"
      ref="updateOrAddRef"
      :delivery-method-options="deliveryMethodOptions"
      @submit="handleFormSubmit"
    />

    <!-- 查看弹窗 -->
    <ShowDialog v-if="viewDialogVisible" ref="showDialogRef" @close="handleViewDialogClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAuth } from '@/hooks/business/auth';
import { usePlatformStore } from '@/store/modules/platform';
import {
  getListPage,
  cancelOrder,
  noticeSupplier,
  noticeSupplierRepeal,
  confirmRepeal,
  generatePurchaseInOrder,
  generatePurchaseInOrderRepeal,
  manuConfirm as manuConfirmApi,
  exportFile,
  importFile
} from '@/service/api/purchase/suggestion';
import {
  getPurchaseDeliveryMethodList,
  getPurchaseSuggestionOrderStatusList
} from '@/service/api/constant/order-constant';
import { getImportTempletsUrl } from '@/utils/importTemplate';
import UpdateOrAdd from './modules/update-or-add.vue';
import ShowDialog from './modules/show-dialog.vue';

defineOptions({ name: 'PurchaseSuggestion' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();
const router = useRouter();

// 加载状态
const loading = ref(false);
const searchLoading = ref(false);
const sendSupplierLoading = ref(false);
const sendSupplierRepealLoading = ref(false);
const confirmRepealLoading = ref(false);
const generateInboundLoading = ref(false);
const inboundWithdrawLoading = ref(false);
const cancelLoading = ref(false);
const importLoading = ref(false);
const exportLoading = ref(false);
const manuConfirmLoading = ref(false);
const supplierConfirmLoading = ref(false);

// 搜索表单
const searchForm = reactive<any>({
  orderNumber: '',
  deliveryWarehouseCode: '',
  supplierId: '',
  projectId: '',
  deliveryMethodCodeList: [],
  carrierId: '',
  orderStatusList: [],
  createdTimeStart: null as string | null,
  createdTimeEnd: null as string | null,
  clientId: null,
  page: 1,
  limit: 20
});

// 时间范围
const createdTimeRange = ref<string[]>([]);

// 供应商过滤
const supplierOptionsForSelect = ref<any[]>([]);

// 平台数据
const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);
const suppliers = ref<any[]>([]);
// platform store 已移除承运商功能，承运商下拉数据源为空数组
const carriers = ref<any[]>([]);

// 下拉选项
const deliveryMethodOptions = ref<any[]>([]);
const orderStatusOptions = ref<any[]>([]);

// 表格数据
const tableData = ref<any[]>([]);
const selectedRow = ref<any[]>([]);

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});

// 表格高度
const tableHeight = ref(500);
const searchCardRef = ref();
const paginationRef = ref();
const updateOrAddRef = ref();
const showDialogRef = ref();

// 弹窗
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);

// 导入相关
const templateUrl = reactive({ url: '', name: '', code: 1 });
const uploadRef = ref();
const uploadVisible = ref(false);

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
      tableHeight.value = Math.max(availableHeight, 300);
    }
  }, 100);
}

/** 获取送货方式列表 */
function loadDeliveryMethodOptions() {
  getPurchaseDeliveryMethodList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        deliveryMethodOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

/** 获取订单状态列表 */
function loadOrderStatusOptions() {
  getPurchaseSuggestionOrderStatusList()
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
      } else {
        ElMessage.error(data?.message || '获取数据失败');
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
  const currentFormData = {
    id: null,
    orderNumber: '',
    deliveryWarehouseCode: '',
    deliveryWarehouseName: '',
    supplierId: null,
    supplierCode: '',
    supplierName: '',
    clientId: null,
    clientCode: '',
    clientName: '',
    projectId: null,
    projectCode: '',
    projectName: '',
    documentTypeCode: '10',
    documentTypeName: '采购订单',
    deliveryMethodCode: '',
    deliveryMethodName: '',
    carrierId: null,
    carrierCode: '',
    carrierName: '',
    orderStatus: 10,
    orderStatusName: '待确认',
    estimatedDeliveryDate: '',
    remarks: '',
    detailList: []
  };
  dialogVisible.value = true;
  nextTick(() => {
    updateOrAddRef.value?.addInit('新增采购订单', currentFormData);
  });
}

/** 编辑 */
function handleEdit(row: any) {
  dialogVisible.value = true;
  nextTick(() => {
    updateOrAddRef.value?.updateInit('编辑采购订单', row);
  });
}

/** 查看 */
function handleView(row: any) {
  viewDialogVisible.value = true;
  nextTick(() => {
    showDialogRef.value?.init(row);
  });
}

/** 查看弹窗关闭 */
function handleViewDialogClose() {
  viewDialogVisible.value = false;
}

/** 手动确认 */
function manuConfirm(row: any) {
  manuConfirmLoading.value = true;
  ElMessageBox.confirm(`确认此采购单：${row.orderNumber} ？`, '手动确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      manuConfirmApi([row.id])
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('采购单确认成功');
            handleSearch();
          }
          manuConfirmLoading.value = false;
        })
        .catch(() => {
          manuConfirmLoading.value = false;
        });
    })
    .catch(() => {
      manuConfirmLoading.value = false;
    });
}

/** 供应商确认（打开新窗口） */
function supplierConfirm(row: any) {
  supplierConfirmLoading.value = true;
  const routeData = router.resolve({ path: '/supplierConfirm', query: { orderNumber: row.orderNumber, type: 'open' } });
  window.open(routeData.href, '_blank');
  supplierConfirmLoading.value = false;
}

/** 发送供应商确认 */
function handleSendSupplierConfirm() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要发送确认的采购订单');
    return;
  }
  sendSupplierLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认向供应商发送采购订单：${orderNumbers} 的确认通知？`, '发送供应商确认', {
    confirmButtonText: '确定发送',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      noticeSupplier(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('已成功发送供应商确认通知');
            handleSearch();
          }
          sendSupplierLoading.value = false;
        })
        .catch(() => {
          sendSupplierLoading.value = false;
        });
    })
    .catch(() => {
      sendSupplierLoading.value = false;
    });
}

/** 发送供应商确认撤回 */
function handleSendSupplierConfirmRepeal() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要发送撤回的采购订单');
    return;
  }
  sendSupplierRepealLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认撤回向供应商发送采购订单：${orderNumbers} 的确认通知？`, '发送供应商撤回', {
    confirmButtonText: '确定撤回',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      noticeSupplierRepeal(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('已成功撤回发送供应商确认通知');
            handleSearch();
          }
          sendSupplierRepealLoading.value = false;
        })
        .catch(() => {
          sendSupplierRepealLoading.value = false;
        });
    })
    .catch(() => {
      sendSupplierRepealLoading.value = false;
    });
}

/** 订单确认撤回 */
function handleConfirmRepeal() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要订单确认撤回的采购订单');
    return;
  }
  confirmRepealLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认对采购订单：${orderNumbers} 进行订单确认撤回？`, '订单确认撤回', {
    confirmButtonText: '确认撤回',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      confirmRepeal(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('已成功订单确认撤回');
            handleSearch();
          }
          confirmRepealLoading.value = false;
        })
        .catch(() => {
          confirmRepealLoading.value = false;
        });
    })
    .catch(() => {
      confirmRepealLoading.value = false;
    });
}

/** 生成采购入库单 */
function handleGenerateInbound() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要生成采购入库单的采购订单');
    return;
  }
  generateInboundLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认根据采购订单：${orderNumbers} 生成采购入库单？`, '生成采购入库单', {
    confirmButtonText: '确认生成',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      generatePurchaseInOrder(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('生成采购入库成功');
            handleSearch();
          }
          generateInboundLoading.value = false;
        })
        .catch(() => {
          generateInboundLoading.value = false;
        });
    })
    .catch(() => {
      generateInboundLoading.value = false;
    });
}

/** 采购入库撤回 */
function handleInboundWithdraw() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要撤回的采购订单');
    return;
  }
  inboundWithdrawLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认撤回采购订单：${orderNumbers} 的采购入库单？`, '采购入库撤回', {
    confirmButtonText: '确认撤回',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      generatePurchaseInOrderRepeal(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('采购入库单撤回成功');
            handleSearch();
          }
          inboundWithdrawLoading.value = false;
        })
        .catch(() => {
          inboundWithdrawLoading.value = false;
        });
    })
    .catch(() => {
      inboundWithdrawLoading.value = false;
    });
}

/** 取消 */
function handleCancel() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要取消的采购订单');
    return;
  }
  cancelLoading.value = true;
  const orderNumbers = selectedRow.value.map(row => row.orderNumber).join('、');
  ElMessageBox.confirm(`确认取消采购订单：${orderNumbers}？取消后将无法恢复。`, '取消采购订单', {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    type: 'error'
  })
    .then(() => {
      const ids = selectedRow.value.map(row => row.id);
      cancelOrder(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('采购订单取消成功');
            handleSearch();
          }
          cancelLoading.value = false;
        })
        .catch(() => {
          cancelLoading.value = false;
        });
    })
    .catch(() => {
      cancelLoading.value = false;
    });
}

/** 导入 */
function handleImport() {
  importLoading.value = true;
  uploadVisible.value = true;
  const { url, name } = getImportTempletsUrl('1001');
  templateUrl.url = url;
  templateUrl.name = name;
  nextTick(() => {
    const importUrl = importFile();
    const accept = '.xls,.xlsx';
    uploadRef.value?.init(importUrl, accept);
    importLoading.value = false;
  });
}

/** 导出 */
function handleExport() {
  exportLoading.value = true;
  searchForm.idList = selectedRow.value.map(item => item.id);
  exportFile(searchForm)
    .then(({ data }) => {
      searchForm.idList = null;
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
        a.download = `采购建议单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
        ElMessage.success('导出成功');
      }
      exportLoading.value = false;
    })
    .catch(() => {
      searchForm.idList = null;
      ElMessage.error('导出失败');
      exportLoading.value = false;
    });
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

/** 表单提交回调 */
function handleFormSubmit() {
  ElMessage.success('保存成功');
  dialogVisible.value = false;
  handleSearch();
}

/** 获取订单状态文本样式类 */
function getStatusTextClass(status: number | string) {
  const statusMap: Record<string, string> = {
    10: 'status-text-pending',
    20: 'status-text-notified',
    30: 'status-text-confirmed',
    40: 'status-text-generated',
    90: 'status-text-cancelled'
  };
  return statusMap[String(status)] || 'status-text-default';
}

/** 监听窗口大小变化 */
const handleResize = () => calculateTableHeight();

onMounted(() => {
  syncPlatformData();
  setDefaultTimeRange();
  loadDeliveryMethodOptions();
  loadOrderStatusOptions();
  calculateTableHeight();
  window.addEventListener('resize', handleResize);
});

onActivated(() => {
  syncPlatformData();
  handleSearch();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* 状态文本样式 */
.status-text-pending {
  color: #e6a23c;
  font-weight: 600;
}
.status-text-notified {
  color: #67c23a;
  font-weight: 600;
}
.status-text-confirmed {
  color: #409eff;
  font-weight: 600;
}
.status-text-generated {
  color: #909399;
  font-weight: 600;
}
.status-text-cancelled {
  color: #f56c6c;
  font-weight: 600;
}
.status-text-default {
  color: #606266;
  font-weight: 500;
}
</style>
