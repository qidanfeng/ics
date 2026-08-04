<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-date-picker
            v-model="forecastExeDateRange"
            size="small"
            style="width: 100%"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :clearable="false"
            :disabled-date="disabledForecastExeDate"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.warehouseCode"
            size="small"
            style="width: 100%"
            placeholder="请选择仓库"
            clearable
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
            size="small"
            style="width: 100%"
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
          <el-select
            v-model="searchForm.projectId"
            size="small"
            style="width: 100%"
            placeholder="请选择货主"
            filterable
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
          <el-input
            v-model="searchForm.productNumber"
            size="small"
            style="width: 100%"
            placeholder="请输入产品编码(支持多个，分隔符,)"
            clearable
          />
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt-1">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select
            v-model="searchForm.generatedSuggestionOrderFlag"
            size="small"
            style="width: 100%"
            placeholder="已生成采购订单"
            clearable
          >
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
          <el-button size="small" type="primary" :loading="searchLoading" style="width: 100%" @click="handleSearch">
            查询
          </el-button>
        </el-col>
        <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
          <el-button size="small" style="width: 100%" @click="handleReset">重置</el-button>
        </el-col>
        <el-col
          v-if="hasAuth('ics:forecast:record:generatePurchaseOrder')"
          :xs="12"
          :sm="6"
          :md="4"
          :lg="3"
          :xl="2"
        >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-document"
            :disabled="selectedRows.length === 0"
            style="width: 100%"
            @click="handleGeneratePurchaseOrder"
          >
            生成采购订单
          </el-button>
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
        style="width: 100%"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" min-width="120" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="productNumber" label="产品编码" width="100" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="productName" label="产品名称" min-width="200" align="center" fixed="left" show-overflow-tooltip />
        <!-- 动态日期列 -->
        <el-table-column
          v-for="date in dateColumns"
          :key="date"
          :label="date"
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <el-link
              v-if="getPredictValue(row, date)"
              type="primary"
              @click="showDetail(row, date)"
            >
              <span :style="getForecastDemandQuantityStyle(row, date)">
                {{ getPredictValue(row, date)[0].forecastDemandQuantity }}
              </span>
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 预测详情弹框 -->
    <ForecastDetailDialog ref="forecastDetailDialogRef" />

    <!-- 新增/编辑弹窗 -->
    <UpdateOrAdd
      v-if="suggestionOrderDialogVisible"
      ref="suggestionOrderUpdateOrAddRef"
      :delivery-method-options="deliveryMethodOptions"
      @submit="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuth } from '@/hooks/business/auth';
import { usePlatformStore } from '@/store/modules/platform';
import { getListPage } from '@/service/api/forecast/average-forecast-record';
import { getPurchaseDeliveryMethodList } from '@/service/api/constant/order-constant';
import ForecastDetailDialog from './modules/forecast-detail-dialog.vue';
import UpdateOrAdd from '@/views/purchase/suggestion/modules/update-or-add.vue';

defineOptions({ name: 'ForecastRecord' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

const loading = ref(false);
const searchLoading = ref(false);

const supplierOptionsForSelect = ref<any[]>([]);
const selectedRows = ref<any[]>([]);
const forecastExeDateRange = ref<string[]>([]);

const searchForm = reactive<any>({
  supplierId: '',
  warehouseId: '',
  projectId: '',
  productId: '',
  warehouseCode: '',
  productNumber: '',
  generatedSuggestionOrderFlag: null,
  forecastExeDateStart: null,
  forecastExeDateEnd: null,
  page: 1,
  limit: 20
});

const tableData = ref<any[]>([]);
const dateColumns = ref<string[]>([]);
const deliveryMethodOptions = ref<any[]>([]);

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});

const suggestionOrderDialogVisible = ref(false);
const detailData = ref<any>({});
const currentDate = ref('');
const currentRow = ref<any>({});

const tableHeight = ref(window.innerHeight - 280);
const paginationRef = ref();
const suggestionOrderUpdateOrAddRef = ref();
const forecastDetailDialogRef = ref();

// 平台数据
const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);
const suppliers = ref<any[]>([]);
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
function setDefaultDateRange() {
  const now = new Date();
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  forecastExeDateRange.value = [formatDate(sixDaysAgo), formatDate(now)];
}

/** 格式化日期 */
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 禁用今天之后和14天前的所有日期 */
function disabledForecastExeDate(time: Date) {
  const today = new Date();
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(today.getDate() - 13);
  today.setHours(0, 0, 0, 0);
  fourteenDaysAgo.setHours(0, 0, 0, 0);
  return time.getTime() > today.getTime() || time.getTime() < fourteenDaysAgo.getTime();
}

function handleResize() {
  tableHeight.value = window.innerHeight - 280;
}

function handleSizeChange(size: number) {
  pagination.size = size;
  loadData();
}

function handleCurrentChange(page: number) {
  pagination.page = page;
  loadData();
}

/** 生成日期范围内的所有日期 */
function generateDateColumns(startDate: string, endDate: string) {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates.reverse();
}

function handleSearch() {
  pagination.page = 1;
  loadData();
}

function loadData() {
  searchLoading.value = true;
  loading.value = true;
  if (forecastExeDateRange.value && forecastExeDateRange.value.length === 2) {
    searchForm.forecastExeDateStart = forecastExeDateRange.value[0];
    searchForm.forecastExeDateEnd = forecastExeDateRange.value[1];
  } else {
    searchForm.forecastExeDateStart = null;
    searchForm.forecastExeDateEnd = null;
  }
  const [startDate, endDate] = forecastExeDateRange.value;
  dateColumns.value = generateDateColumns(startDate, endDate);
  // 设置分页参数
  searchForm.page = pagination.page;
  searchForm.limit = pagination.size;
  searchForm.clientId = platformStore.client?.id;

  getListPage(searchForm)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        tableData.value = data.data.list;
        pagination.total = data.data.totalCount;
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

function getPredictValue(row: any, date: string) {
  return row.forecastRecordMap && row.forecastRecordMap[date] ? row.forecastRecordMap[date] : null;
}

/** 获取预测需求数量文本样式 */
function getForecastDemandQuantityStyle(row: any, date: string) {
  const matchForecastRecordList = getPredictValue(row, date);
  let textStyle = 'color:#E6A23C;text-decoration: underline;';
  if (matchForecastRecordList && matchForecastRecordList[0].generatedSuggestionOrderFlag === 1) {
    textStyle = 'color:#42b983;text-decoration: underline;';
  }
  return textStyle;
}

function showDetail(row: any, date: string) {
  currentRow.value = row;
  currentDate.value = date;
  detailData.value = {
    ...row,
    recordDetailList: row.forecastRecordMap[date]
  };
  forecastDetailDialogRef.value?.init(detailData.value, date);
}

function handleSelectionChange(val: any[]) {
  selectedRows.value = val;
}

function handleGeneratePurchaseOrder() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先勾选数据');
    return;
  }
  const firstRow = selectedRows.value[0];
  const baseSet = new Set<string>();
  const today = formatDate(new Date());
  const forecastRecordIdList: any[] = [];
  const detailList = selectedRows.value
    .filter(
      row => row.forecastRecordMap[today] && row.forecastRecordMap[today][0].forecastDemandQuantity > 0
    )
    .map(row => {
      const todayForecastRecord = row.forecastRecordMap[today][0];
      forecastRecordIdList.push(todayForecastRecord.id);
      baseSet.add(`${row.clientId}_${row.supplierId}_${row.warehouseCode}_${row.projectId}`);
      return {
        productId: todayForecastRecord.productId,
        productNumber: todayForecastRecord.productNumber,
        productName: todayForecastRecord.productName,
        unitDictionaryId: todayForecastRecord.unitDictionaryId,
        unitDictionaryName: todayForecastRecord.unitDictionaryName,
        quantity: todayForecastRecord.forecastDemandQuantity,
        weight: null,
        volume: null,
        totalPrice: 0
      };
    });
  if (detailList.length === 0) {
    ElMessage.warning(`勾选数据无可生成采购订单的预测记录，执行预测日期=${today}`);
    return;
  }
  if (baseSet.size > 1) {
    ElMessage.warning('勾选数据对应的供应商+仓库+货主必须一致');
    return;
  }
  const suggestionOrderFormData = {
    forecastRecordIdList,
    deliveryWarehouseCode: firstRow.warehouseCode,
    deliveryWarehouseName: firstRow.warehouseName,
    supplierId: firstRow.supplierId,
    supplierCode: firstRow.supplierCode,
    supplierName: firstRow.supplierName,
    clientId: firstRow.clientId,
    clientCode: firstRow.clientCode,
    clientName: firstRow.clientName,
    projectId: firstRow.projectId,
    projectCode: firstRow.projectCode,
    projectName: firstRow.projectName,
    detailList
  };
  suggestionOrderDialogVisible.value = true;
  nextTick(() => {
    suggestionOrderUpdateOrAddRef.value?.addInitFromForecastRecord(
      '通过库存预测记录新增采购订单',
      suggestionOrderFormData
    );
  });
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

function handleReset() {
  Object.assign(searchForm, {
    supplierId: '',
    warehouseId: '',
    projectId: '',
    productId: '',
    warehouseCode: '',
    productNumber: '',
    generatedSuggestionOrderFlag: null
  });
  loadData();
}

/** 获取送货方式列表 */
function loadDeliveryMethodOptions() {
  getPurchaseDeliveryMethodList()
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        deliveryMethodOptions.value = data.data;
      }
    })
    .catch(() => {});
}

onMounted(() => {
  syncPlatformData();
  setDefaultDateRange();
  loadDeliveryMethodOptions();
  handleSearch();
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
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 15px;
}

.table-card {
  margin-bottom: 15px;
}
</style>
