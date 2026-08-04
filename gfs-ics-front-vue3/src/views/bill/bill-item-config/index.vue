<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card ref="searchCardRef" class="search-card">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input size="small" class="w-full" v-model="searchForm.costItemCode" placeholder="请输入费项编码" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" class="w-full" v-model="searchForm.costItemName" placeholder="请输入费项名称" clearable />
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="small" v-if="hasAuth('ics:costItemConfig:add')" @click="handleAdd">新增</el-button>
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
          style="width: 100%; height: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="costItemCode" label="费项编码" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="costItemName" label="费项名称" min-width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <el-table-column prop="remarks" label="备注" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" v-if="hasAuth('ics:costItemConfig:edit')" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 新增/编辑子组件 -->
    <UpdateOrAdd v-if="showUpdateOrAdd" ref="updateOrAddRef" @submit="handleFormSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated, onUnmounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth } from '@/hooks/business/auth';
import { usePlatformStore } from '@/store/modules/platform';
import { getListPage, deleteByIds } from '@/service/api/bill/bill-item-config';
import UpdateOrAdd from './modules/update-or-add.vue';

defineOptions({ name: 'CostItemConfig' });

const { hasAuth } = useAuth();
const platformStore = usePlatformStore();

const loading = ref(false);
const submitting = ref(false);
const tableHeight = ref(500);
const searchCardRef = ref();
const paginationRef = ref();
const updateOrAddRef = ref();

const searchForm = reactive<any>({
  costItemCode: '',
  costItemName: '',
  createdBy: '',
  createdTimeStart: '',
  createdTimeEnd: '',
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

const showUpdateOrAdd = ref(false);

// 计算表格高度以适配屏幕
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

function handleSearch() {
  loading.value = true;

  // 设置分页参数
  searchForm.page = pagination.page;
  searchForm.limit = pagination.size;

  getListPage(searchForm)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        tableData.value = data.data?.list || [];
        pagination.total = data.data?.totalCount || 0;
        ElMessage.success('搜索完成');
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function resetSearch() {
  searchForm.costItemCode = '';
  searchForm.costItemName = '';
  searchForm.createdBy = '';
  searchForm.createdTimeStart = '';
  searchForm.createdTimeEnd = '';
  handleSearch();
}

function handleAdd() {
  showUpdateOrAdd.value = true;
  nextTick(() => {
    updateOrAddRef.value?.addInit();
  });
}

function handleEdit(row: any) {
  showUpdateOrAdd.value = true;
  nextTick(() => {
    updateOrAddRef.value?.updateInit(row);
  });
}

function handleDelete() {
  ElMessageBox.confirm('确认删除选中的费项配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const ids = selectedRow.value.map((item: any) => item.id);
      deleteByIds(ids)
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            ElMessage.success('删除成功');
            handleSearch();
          }
        })
        .catch(() => {});
    })
    .catch(() => {});
}

function handleSelectionChange(selection: any[]) {
  selectedRow.value = selection;
}

function handleSizeChange(val: number) {
  pagination.size = val;
  handleSearch();
}

function handleCurrentChange(val: number) {
  pagination.page = val;
  handleSearch();
}

function handleFormSubmit() {
  // 处理表单提交
  showUpdateOrAdd.value = false;
  handleSearch();
}

onMounted(() => {
  // 计算表格高度
  calculateTableHeight();

  // 监听窗口大小变化
  window.addEventListener('resize', calculateTableHeight);
});

onActivated(() => {
  // 查询数据
  handleSearch();
});

onUnmounted(() => {
  // 组件销毁前移除事件监听
  window.removeEventListener('resize', calculateTableHeight);
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
</style>
