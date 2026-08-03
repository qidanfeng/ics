<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.costItemCode" placeholder="请输入费项编码" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.costItemName" placeholder="请输入费项名称" clearable />
        </el-col>
<!--        <el-col :span="6">
          <el-date-picker
            size="mini"
            style="width:100%"
            v-model="createdTimeRange"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </el-col>-->
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="mini" v-if="isAuth('ics:costItemConfig:add')" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" style="flex: 1; display: flex; flex-direction: column;">
      <div style="flex: 1; overflow: hidden;">
          <u-table
            border
            size="mini"
            highlight-current-row
            v-loading="loading"
            :data="tableData"
            :row-height="30"
            :height="tableHeight"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            style="width: 100%; height: 100%"
            @selection-change="handleSelectionChange"
          >
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
            <u-table-column type="index" label="序号" width="55" align="center" />
          <u-table-column prop="costItemCode" label="费项编码" width="120" align="center" show-overflow-tooltip />
          <u-table-column prop="costItemName" label="费项名称" min-width="150" align="center" show-overflow-tooltip />
          <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column prop="remarks" label="备注" min-width="200" align="center" show-overflow-tooltip />
          <u-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="isAuth('ics:costItemConfig:edit')" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </u-table-column>
        </u-table>
        </div>
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

    <!-- 新增/编辑子组件 -->
    <update-or-add v-if="showUpdateOrAdd" ref="updateOrAddRef" @submit="handleFormSubmit" />
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import UpdateOrAdd from './updateOrAdd.vue'
import API from "@/api";
import {mapGetters} from "vuex";
export default {
  name: "CostItemConfig",
  components: {
    UTable,
    UTableColumn,
    UpdateOrAdd
  },
  computed: {
    ...mapGetters([
      'client',
      'projects',
      'warehouses',
      'suppliers'
    ]),
  },
  data() {
    return {
      loading: false,
      submitting: false,
      searchForm: {
        costItemCode: '',
        costItemName: '',
        createdBy: '',
        createdTimeStart: '',
        createdTimeEnd: ''
      },
      tableData: [],
      selectedRow: [],
      pagination: {
        page: 1,
        size: 20,
        total: 1
      },
      tableHeight: 500, // 默认高度
      showUpdateOrAdd: false // 控制新增/编辑子组件显示
    }
  },
  mounted() {
    // 计算表格高度
    this.calculateTableHeight();

    // 监听窗口大小变化
    window.addEventListener('resize', this.calculateTableHeight);

  },
  activated() {
    //查询数据
    this.handleSearch();
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('resize', this.calculateTableHeight);
  },
  methods: {
    // 计算表格高度以适配屏幕
    calculateTableHeight() {
      this.$nextTick(() => {
        const searchCard = document.querySelector('.search-card');
        const paginationContainer = document.querySelector('.pagination-container');
        const headerHeight = 150; // 顶部可能的导航栏高度
        const padding = 20; // 页面内边距

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight;
          const paginationHeight = paginationContainer.offsetHeight;
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
          this.tableHeight = Math.max(availableHeight, 300); // 最小高度300px
        }
      });
    },

    handleSearch() {
      this.loading = true

      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;

      API.billItemConfig.getListPage(this.searchForm).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.list;
          this.pagination.total = data.data.totalCount;
          this.loading = false
          this.$message.success('搜索完成')
        }
      }).catch(error => {
        this.loading = false
      })
    },

    resetSearch() {
      this.searchForm = {
        costItemCode: '',
        costItemName: '',
        createdBy: '',
        createdTimeStart: '',
        createdTimeEnd: ''
      }
      this.createdTimeRange = this.setDefaultTimeRange();
      this.handleSearch()
    },

    handleAdd() {
      this.showUpdateOrAdd = true
      this.$nextTick(() => {
        this.$refs.updateOrAddRef.addInit()
      })
    },

    handleEdit(row) {
      this.showUpdateOrAdd = true
      this.$nextTick(() => {
        this.$refs.updateOrAddRef.updateInit(row)
      })
    },

    handleDelete() {
      this.$confirm('确认删除选中的费项配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRow.map(item => item.id)
        API.billItemConfig.deleteByIds(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('删除成功')
            this.handleSearch()
          }
        }).catch((error)=>{

        })
      })
    },

    handleImport() {
      this.$message.info('导入功能开发中...')
    },

    handleExport() {
      this.$message.info('导出功能开发中...')
    },

    handleSelectionChange(selection) {
      this.selectedRow = selection
    },

    handleSizeChange(val) {
      this.pagination.size = val
      this.handleSearch()
    },

    handleCurrentChange(val) {
      this.pagination.page = val
      this.handleSearch()
    },

    handleFormSubmit() {
      // 处理表单提交
      this.showUpdateOrAdd = false
      this.handleSearch()
    }
  }
}
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
