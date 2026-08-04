<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
            v-model="searchForm.strategyName"
            size="small"
            class="w-full"
            placeholder="请输入策略名称"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.warehouseCode"
            size="small"
            class="w-full"
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
            v-model="searchForm.projectId"
            size="small"
            class="w-full"
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
            class="w-full"
            placeholder="请输入产品编码(支持多个，分隔符,)"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.status"
            size="small"
            class="w-full"
            placeholder="请选择状态"
            clearable
          >
            <el-option :value="1" label="激活" />
            <el-option :value="0" label="关闭" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt-2">
        <el-col :span="24">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
              <el-button
                size="small"
                type="primary"
                :loading="searchLoading"
                class="w-full"
                @click="handleSearch"
              >
                查询
              </el-button>
            </el-col>
            <el-col v-if="hasAuth('ics:forecast:strategy:add')" :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
              <el-button size="small" class="w-full" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col
              v-if="hasAuth('ics:forecast:strategy:activateOrNot')"
              :xs="12"
              :sm="6"
              :md="4"
              :lg="3"
              :xl="2"
            >
              <el-button
                size="small"
                type="primary"
                :disabled="selectedRow.length === 0"
                :loading="openOrCloseLoading"
                class="w-full"
                @click="handleOpenOrClose"
              >
                激活/关闭
              </el-button>
            </el-col>
            <el-col
              v-if="hasAuth('ics:forecast:strategy:manuForecast')"
              :xs="12"
              :sm="6"
              :md="4"
              :lg="3"
              :xl="2"
            >
              <el-button
                size="small"
                type="primary"
                :loading="manuForecastLoading"
                class="w-full"
                @click="handleManuForecast"
              >
                手动预测
              </el-button>
            </el-col>
          </el-row>
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
          style="width: 100%; height: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="strategyName" label="策略名称" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="warehouseName" label="仓库" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="productNumber" label="产品编码" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="productName" label="产品名称" width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="algorithmTypeName" label="预测算法" width="140" align="center">
            <template #default="{ row }">
              <span :class="getAlgorithmTypeClass(row.algorithmType)">
                {{ row.algorithmTypeName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="saleEndDate" label="截至售卖日" width="120" align="center">
            <template #default="{ row }">
              <span :class="getSaleEndDateTextClass(row)">
                {{ row.saleEndDate }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dataPeriodName" label="数据周期" width="100" align="center" />
          <el-table-column prop="hisDataPeriods" label="历史数据周期数" width="120" align="center" />
          <el-table-column prop="remarks" label="备注" width="120" align="center" />
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status === 1" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="handleView(row)">查看</el-button>
              <el-button
                v-if="hasAuth('ics:forecast:strategy:edit')"
                type="text"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
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
    <ShowDialog v-if="showDialogVisible" ref="showDialogRef" />

    <!-- 新增编辑弹窗 -->
    <UpdateOrAdd v-if="showUpdateOrAdd" ref="updateOrAddRef" @submit="handleSaveSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth } from '@/hooks/business/auth';
import { usePlatformStore } from '@/store/modules/platform';
import {
  getListPage,
  openOrClose,
  manuForecast
} from '@/service/api/forecast/average-forecast-strategy';
import ShowDialog from './modules/show-dialog.vue';
import UpdateOrAdd from './modules/update-or-add.vue';

defineOptions({ name: 'ForecastStrategy' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

const loading = ref(false);
const searchLoading = ref(false);
const openOrCloseLoading = ref(false);
const manuForecastLoading = ref(false);

const searchForm = reactive<any>({
  clientId: null,
  strategyName: '',
  warehouseCode: null,
  projectId: null,
  productNumber: null,
  status: 1,
  page: 1,
  limit: 20
});

const tableData = ref<any[]>([]);
const selectedRow = ref<any[]>([]);

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});

const showDialogVisible = ref(false);
const showUpdateOrAdd = ref(false);

const tableHeight = ref(500);
const searchCardRef = ref();
const paginationRef = ref();
const showDialogRef = ref();
const updateOrAddRef = ref();

// 平台数据
const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);

// 平台数据初始化标记
let platformSynced = false;

/** 同步平台数据到本地 */
function syncPlatformData() {
  if (platformSynced) return;
  projects.value = platformStore.projects;
  warehouses.value = platformStore.warehouses;
  platformSynced = true;
}

/** 计算表格高度 */
function calculateTableHeight() {
  nextTick(() => {
    const searchCard = searchCardRef.value?.$el || document.querySelector('.search-card');
    const paginationContainer = paginationRef.value?.$el || document.querySelector('.pagination-container');
    const headerHeight = 150;
    const padding = 20;
    if (searchCard && paginationContainer) {
      const searchCardHeight = searchCard.offsetHeight;
      const paginationHeight = paginationContainer.offsetHeight;
      const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
      tableHeight.value = Math.max(availableHeight, 300);
    }
  });
}

/** 查询 */
function handleSearch() {
  searchLoading.value = true;
  loading.value = true;
  // 设置分页参数
  searchForm.page = pagination.page;
  searchForm.limit = pagination.size;
  searchForm.clientId = platformStore.client?.id;

  getListPage(searchForm)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0) {
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

/** 新增 */
function handleAdd() {
  showUpdateOrAdd.value = true;
  nextTick(() => {
    updateOrAddRef.value?.addInit();
  });
}

/** 编辑 */
function handleEdit(row: any) {
  showUpdateOrAdd.value = true;
  nextTick(() => {
    updateOrAddRef.value?.updateInit(row);
  });
}

/** 查看 */
function handleView(row: any) {
  showDialogVisible.value = true;
  nextTick(() => {
    showDialogRef.value?.init(row);
  });
}

/** 激活/关闭 */
function handleOpenOrClose() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要激活/关闭的预测策略配置');
    return;
  }
  openOrCloseLoading.value = true;
  ElMessageBox.confirm('确认激活/关闭该预测策略配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map(item => item.id);
      openOrClose(ids)
        .then(({ response }) => {
          const data = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('激活/关闭成功');
            handleSearch();
          }
          openOrCloseLoading.value = false;
        })
        .catch(() => {
          openOrCloseLoading.value = false;
        });
    })
    .catch(() => {
      openOrCloseLoading.value = false;
    });
}

/** 手动预测 */
function handleManuForecast() {
  manuForecastLoading.value = true;
  ElMessageBox.confirm('确认进行手动预测吗？', '手动预测', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      const idList = selectedRow.value.map(row => row.id);
      manuForecast(idList)
        .then(({ response }) => {
          const data = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('执行成功');
            handleSearch();
          }
          manuForecastLoading.value = false;
        })
        .catch(() => {
          manuForecastLoading.value = false;
        });
    })
    .catch(() => {
      manuForecastLoading.value = false;
    });
}

/** 多选变化 */
function handleSelectionChange(selection: any[]) {
  selectedRow.value = selection;
}

/** 分页大小变化 */
function handleSizeChange(size: number) {
  pagination.size = size;
  handleSearch();
}

/** 当前页变化 */
function handleCurrentChange(page: number) {
  pagination.page = page;
  handleSearch();
}

/** 保存成功 */
function handleSaveSuccess() {
  showUpdateOrAdd.value = false;
  handleSearch();
}

/** 获取算法类型样式类 */
function getAlgorithmTypeClass(algorithmType: string) {
  const classes: Record<string, string> = {
    sma: 'algorithm-sma',
    wma: 'algorithm-wma',
    ewma: 'algorithm-ewma'
  };
  return classes[algorithmType] || '';
}

/** 获取售卖截至日文本样式 */
function getSaleEndDateTextClass(row: any) {
  let textClass = 'text-success';
  const saleEndDate = new Date(row.saleEndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (saleEndDate.getTime() < today.getTime()) {
    textClass = 'text-danger';
  }
  return textClass;
}

const handleResize = () => calculateTableHeight();

onMounted(() => {
  syncPlatformData();
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
  margin-bottom: 0;
}

.table-card {
  margin-top: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: 10px;
  text-align: right;
}

.algorithm-sma {
  color: #409eff;
}

.algorithm-wma {
  color: #67c23a;
}

.algorithm-ewma {
  color: #e6a23c;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.text-danger {
  color: #f56c6c;
}
</style>
