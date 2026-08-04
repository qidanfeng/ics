<template>
  <div class="h-full">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="mb-4">
      <el-row :gutter="10" class="search-row">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.warehouseCodeList"
            placeholder="请选择仓库"
            multiple
            filterable
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
            v-model="searchForm.projectIdList"
            multiple
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
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
            v-model="searchForm.productNumber"
            placeholder="请输入产品编码(支持多个，分隔符,)"
            clearable
            size="small"
            class="w-full"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select
            v-model="searchForm.inventoryType"
            filterable
            clearable
            placeholder="请选择库存类型"
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in inventoryTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="8">
          <el-row :gutter="8">
            <el-col :span="8">
              <el-button size="small" type="primary" @click="handleSearch" class="w-full">查询</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="small" :loading="exportLoading" @click="handleExport" class="w-full">导出</el-button>
            </el-col>
            <el-col :span="8">
              <el-button size="small" @click="handleReset" class="w-full">重置</el-button>
            </el-col>
          </el-row>
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
        <el-table-column prop="warehouseName" label="仓库" width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="productNumber" label="产品编码" width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="productName" label="产品名称" width="300" align="center" show-overflow-tooltip />
        <el-table-column prop="totalQuantityStr" label="总数量" width="120" align="center" />
        <el-table-column prop="availableQuantityStr" label="可用数量" width="120" align="center">
          <template #header>
            <el-tooltip effect="light" placement="top">
              <template #content>正品库位上库位剩余数量</template>
              <span>可用数量<el-icon><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <span :class="getAvailableQuantityTextClass(row)">
              {{ row.availableQuantityStr }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="lockQuantityStr" label="锁定数量" width="120" align="center">
          <template #header>
            <el-tooltip effect="light" placement="top">
              <template #content>正品库位上已分配数量+异动数量</template>
              <span>锁定数量<el-icon><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="onTheWayQuantityStr" label="在途数量" width="120" align="center">
          <template #header>
            <el-tooltip effect="light" placement="top">
              <template #content>已确认的采购订单还未完成入库的数量</template>
              <span>在途数量<el-icon><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="damagedQuantityStr" label="损坏数量" width="120" align="center">
          <template #header>
            <el-tooltip effect="light" placement="top">
              <template #content>非正品库位上所有库存数量</template>
              <span>损坏数量<el-icon><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="specification" label="规格" width="120" align="center" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import { usePlatformStore } from '@/store/modules/platform';
import { getListPage, exportFile } from '@/service/api/inventory/ics-inventory';
import { getInventoryTypeList } from '@/service/api/constant/order-constant';

defineOptions({ name: 'IcsInventory' });

const platformStore = usePlatformStore();

const loading = ref(false);
const exportLoading = ref(false);
const tableHeight = ref(400);
const searchCardRef = ref();
const paginationRef = ref();

const searchForm = reactive<any>({
  inventoryType: null,
  productNumber: '',
  warehouseCodeList: [],
  projectIdList: [],
  page: 1,
  limit: 20,
  clientId: null
});

const inventoryTypeOptions = ref<any[]>([]);
const tableData = ref<any[]>([]);
const selectedRow = ref<any[]>([]);

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
});

const projects = ref<any[]>([]);
const warehouses = ref<any[]>([]);

let platformSynced = false;

function syncPlatformData() {
  if (platformSynced) return;
  projects.value = platformStore.projects;
  warehouses.value = platformStore.warehouses;
  platformSynced = true;
}

async function loadData() {
  loading.value = true;
  try {
    searchForm.page = pagination.page;
    searchForm.limit = pagination.size;
    searchForm.clientId = platformStore.client?.id;

    const { response } = await getListPage(searchForm);
    const data: any = response?.data;
    if (data && (data.code as unknown as number) === 0) {
      tableData.value = data.data?.list || [];
      pagination.total = data.data?.totalCount || 0;
      ElMessage.success('搜索完成');
    } else {
      ElMessage.error(data?.message || '获取数据失败');
    }
  } catch (error) {
    console.error('搜索失败:', error);
    ElMessage.error('搜索失败');
  } finally {
    loading.value = false;
  }
}

function loadInventoryTypeOptions() {
  getInventoryTypeList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        inventoryTypeOptions.value = data.data || [];
      }
    })
    .catch(() => {});
}

function handleSearch() {
  pagination.page = 1;
  loadData();
}

function handleReset() {
  searchForm.inventoryType = null;
  searchForm.productNumber = '';
  searchForm.warehouseCodeList = [];
  searchForm.projectIdList = [];
  pagination.page = 1;
  loadData();
}

function handleExport() {
  exportLoading.value = true;
  searchForm.idList = selectedRow.value.map((item: any) => item.id);
  exportFile(searchForm)
    .then((res: any) => {
      searchForm.idList = null;
      if (res) {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        const a = document.createElement('a');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        a.download = `库存信息_${year}${month}${day}${hour}${minute}${second}.xlsx`;
        a.href = URL.createObjectURL(blob);
        a.click();
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

function handleSelectionChange(selection: any[]) {
  selectedRow.value = selection;
}

function handleSizeChange(size: number) {
  pagination.size = size;
  loadData();
}

function handleCurrentChange(page: number) {
  pagination.page = page;
  loadData();
}

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

function getAvailableQuantityTextClass(row: any) {
  if (row.availableQuantity < row.safeStockQuantity) {
    return 'text-danger';
  }
  return 'text-success';
}

onMounted(() => {
  syncPlatformData();
  loadInventoryTypeOptions();
  window.addEventListener('resize', calculateTableHeight);
});

onActivated(() => {
  syncPlatformData();
  calculateTableHeight();
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateTableHeight);
});
</script>

<style scoped>
.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}
</style>
