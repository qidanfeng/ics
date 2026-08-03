<template>
  <div class="h-full">
    <!-- 搜索区域 -->
    <el-card ref="searchCardRef" class="mb-4">
      <el-row :gutter="10" class="search-row">
        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-select
            v-model="searchForm.warehouseCode"
            placeholder="请选择仓库"
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

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
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

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
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

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
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

        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <el-button
                size="small"
                type="primary"
                :loading="searchLoading"
                class="w-full truncate"
                @click="handleSearch"
                v-track="{ name: 'ICS_ORDER_QUANTITY_SEARCH', description: '订购量查询' }"
              >
                查询
              </el-button>
            </div>
            <div>
              <el-button
                v-if="hasAuth('ics:orderQuantityConfig:add')"
                size="small"
                class="w-full truncate"
                @click="handleAdd"
                v-track="{ name: 'ICS_ORDER_QUANTITY_ADD', description: '订购量新增' }"
              >
                新增
              </el-button>
            </div>
            <div>
              <el-button
                v-if="hasAuth('ics:orderQuantityConfig:delete')"
                size="small"
                type="danger"
                :disabled="selectedRow.length === 0"
                :loading="deleteLoading"
                class="w-full truncate"
                @click="handleDelete"
                v-track="{ name: 'ICS_ORDER_QUANTITY_DELETE', description: '订购量删除' }"
              >
                删除
              </el-button>
            </div>
            <div>
              <el-button
                v-if="hasAuth('ics:orderQuantityConfig:export')"
                size="small"
                :loading="exportLoading"
                class="w-full truncate"
                @click="handleExport"
                v-track="{ name: 'ICS_ORDER_QUANTITY_EXPORT', description: '订购量导出' }"
              >
                导出
              </el-button>
            </div>
            <div>
              <el-button
                v-if="hasAuth('ics:orderQuantityConfig:import')"
                size="small"
                :loading="importLoading"
                class="w-full truncate"
                @click="handleImport"
                v-track="{ name: 'ICS_ORDER_QUANTITY_IMPORT', description: '订购量导入' }"
              >
                导入
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
        stripe
        :height="tableHeight"
        size="small"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="warehouseCode" label="仓库编码" width="100" align="center" />
        <el-table-column prop="warehouseName" label="仓库名称" width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="supplierCode" label="供应商代码" width="100" align="center" />
        <el-table-column prop="supplierName" label="供应商名称" width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectCode" label="货主代码" width="100" align="center" />
        <el-table-column prop="projectName" label="货主名称" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="orderCycleTime" label="订货周期(天)" width="120" align="center" />
        <el-table-column prop="minOrderQuantity" label="最小起订量(收货单位)" width="150" align="center" />
        <el-table-column prop="remarks" label="备注" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
        <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
        <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="hasAuth('ics:orderQuantityConfig:edit')"
              type="text"
              size="small"
              @click="handleEdit(row)"
              v-track="{ name: 'ICS_ORDER_QUANTITY_EDIT', description: '订购量编辑' }"
            >
              编辑
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

    <!-- 新增/编辑子组件 -->
    <UpdateOrAdd
      v-if="showUpdateOrAdd"
      ref="updateOrAddRef"
      @submit="handleFormSubmit"
    />

    <!-- 上传弹窗 -->
    <Upload
      v-if="uploadVisible"
      ref="uploadRef"
      :template-url="templateUrl"
      :template-name="templateName"
      @refresh-data-list="handleSearch"
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
  deleteByIds,
  exportFile,
  importFile
} from '@/service/api/basic/order-quantity-config';
import { getImportTempletsUrl } from '@/utils/importTemplate';
import UpdateOrAdd from './update-or-add.vue';
import Upload from '@/components/upload/upload.vue';

defineOptions({ name: 'OrderQuantityConfig' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

// 模板配置
const templateUrl = ref('');
const templateName = ref('');
const uploadVisible = ref(false);

// 加载状态
const loading = ref(false);
const searchLoading = ref(false);
const deleteLoading = ref(false);
const importLoading = ref(false);
const exportLoading = ref(false);

// 搜索表单
const searchForm = reactive<any>({
  productNumber: '',
  productName: '',
  warehouseCode: '',
  supplierId: '',
  projectId: '',
  clientId: '',
  createdTimeStart: null as string | null,
  createdTimeEnd: null as string | null,
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
const uploadRef = ref();
const showUpdateOrAdd = ref(false);

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

/** 设置初始查询条件 */
function setInitSearchForm() {
  searchForm.clientId = platformStore.client?.id;
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

  getListPage(searchForm)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        tableData.value = data.data.list;
        pagination.total = data.data.totalCount;
        ElMessage.success('搜索完成');
      }
      searchLoading.value = false;
      loading.value = false;
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

/** 删除 */
function handleDelete() {
  if (selectedRow.value.length === 0) {
    ElMessage.warning('请先选择要删除的订购量配置');
    return;
  }
  deleteLoading.value = true;
  ElMessageBox.confirm('确认删除该订购量配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map(item => item.id);
      deleteByIds(ids)
        .then(({ response }) => {
          const data = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('删除成功');
            handleSearch();
          }
          deleteLoading.value = false;
        })
        .catch(() => {
          deleteLoading.value = false;
        });
    })
    .catch(() => {
      deleteLoading.value = false;
    });
}

/** 导入 */
function handleImport() {
  importLoading.value = true;
  uploadVisible.value = true;
  const templateCode = '1003';
  const importApiUrl = importFile();
  const { url, name } = getImportTempletsUrl(templateCode);
  templateUrl.value = url;
  templateName.value = name;
  nextTick(() => {
    const accept = '.xls,.xlsx';
    uploadRef.value?.init(importApiUrl, accept);
    importLoading.value = false;
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
        a.download = `订购量配置_${year}${month}${day}${hour}${minute}${second}.xlsx`;
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

/** 表单提交后刷新 */
function handleFormSubmit() {
  showUpdateOrAdd.value = false;
  handleSearch();
}

/** 监听窗口大小变化 */
const handleResize = () => calculateTableHeight();

onMounted(() => {
  // 等待 platform store 初始化完成后再同步数据
  syncPlatformData();
  setInitSearchForm();
  calculateTableHeight();
  window.addEventListener('resize', handleResize);
});

onActivated(() => {
  syncPlatformData();
  setInitSearchForm();
  handleSearch();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.search-col {
  margin-bottom: 10px;
}
</style>
