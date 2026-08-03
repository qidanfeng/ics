<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.strategyName" placeholder="请输入策略名称" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.warehouseCode" placeholder="请选择仓库" clearable>
            <el-option
              v-for="item in warehouseOptions"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode">
              <span style="float: left">{{ item.warehouseCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.algorithmType" placeholder="请选择预测算法" clearable>
            <el-option
              v-for="item in algorithmOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="primary" @click="handleSearch" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" @click="handleAdd" style="width:100%">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" :disabled="selectedRow.length !== 1" @click="handleEdit" style="width:100%">编辑</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" @click="handleDelete" style="width:100%">删除</el-button>
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
          size="mini"
          highlight-current-row
          v-loading="loading"
          :data="tableData"
          :height="tableHeight"
          style="width: 100%; height: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left"/>
          <el-table-column type="index" width="55" align="center" />

          <el-table-column prop="strategyName" label="策略名称" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="warehouseName" label="仓库" width="120" align="center" show-overflow-tooltip/>
          <el-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
          <el-table-column prop="algorithmTypeName" label="预测算法" width="120" align="center">
            <template slot-scope="scope">
              <span :class="getAlgorithmTypeClass(scope.row.algorithmType)">
                {{ scope.row.algorithmTypeName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dataPeriod" label="数据周期" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ getDataPeriodName(scope.row.dataPeriod) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="forecastPeriods" label="预测周期数" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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

    <!-- 新增编辑弹窗 -->
    <update-or-add
      ref="updateOrAddRef"
      v-if="dialogVisible"
      :title="dialogTitle"
      :form-data="currentFormData"
      @success="handleSaveSuccess"
    />
  </div>
</template>

<script>
import UpdateOrAdd from './updateOrAdd.vue'

export default {
  name: "ForecastStrategy",
  components: {
    UpdateOrAdd
  },
  data() {
    return {
      loading: false,
      searchForm: {
        strategyName: '',
        warehouseCode: '',
        projectId: '',
        algorithmType: ''
      },
      tableData: [],
      selectedRow: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      currentFormData: {},
      tableHeight: 500,
      // 选项数据
      warehouseOptions: [
        { warehouseCode: 'WH001', warehouseName: '北京仓库' },
        { warehouseCode: 'WH002', warehouseName: '上海仓库' },
        { warehouseCode: 'WH003', warehouseName: '广州仓库' }
      ],
      projectOptions: [
        { projectId: 'PJ001', projectName: '货主A' },
        { projectId: 'PJ002', projectName: '货主B' },
        { projectId: 'PJ003', projectName: '货主C' }
      ],
      algorithmOptions: [
        { value: 'holtwinters', label: 'Holt-Winters' },
        { value: 'sma', label: '简单移动平均' },
        { value: 'wma', label: '加权移动平均' },
        { value: 'ewma', label: '指数加权移动平均' }
      ]
    }
  },
  mounted() {
    this.calculateTableHeight();
    window.addEventListener('resize', this.calculateTableHeight);
    this.handleSearch();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight);
  },
  methods: {
    calculateTableHeight() {
      const self = this;
      this.$nextTick(function() {
        const searchCard = document.querySelector('.search-card');
        const paginationContainer = document.querySelector('.pagination-container');
        const headerHeight = 150;
        const padding = 20;

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight;
          const paginationHeight = paginationContainer.offsetHeight;
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
          self.tableHeight = Math.max(300, availableHeight);
        }
      });
    },

    handleSearch() {
      this.loading = true;
      const self = this;

      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;

      // 模拟API调用
      setTimeout(function() {
        // 模拟数据
        const mockData = [
          {
            id: 1,
            strategyName: '库存需求预测策略V2',
            warehouseCode: 'WH001',
            warehouseName: '北京仓库',
            projectId: 'PJ001',
            projectName: '货主A',
            algorithmType: 'holtwinters',
            algorithmTypeName: 'Holt-Winters',
            dataPeriod: 'day',
            forecastPeriods: 12,
            status: 1,
            createdTime: '2023-12-18 10:00:00'
          },
          {
            id: 2,
            strategyName: '销量预测策略',
            warehouseCode: 'WH002',
            warehouseName: '上海仓库',
            projectId: 'PJ002',
            projectName: '货主B',
            algorithmType: 'sma',
            algorithmTypeName: '简单移动平均',
            dataPeriod: 'week',
            forecastPeriods: 4,
            status: 1,
            createdTime: '2023-12-17 14:30:00'
          }
        ];

        // 根据搜索条件过滤数据
        const filteredData = mockData.filter(function(item) {
          if (self.searchForm.strategyName && item.strategyName.indexOf(self.searchForm.strategyName) === -1) {
            return false;
          }
          if (self.searchForm.warehouseCode && item.warehouseCode !== self.searchForm.warehouseCode) {
            return false;
          }
          if (self.searchForm.projectId && item.projectId !== self.searchForm.projectId) {
            return false;
          }
          if (self.searchForm.algorithmType && item.algorithmType !== self.searchForm.algorithmType) {
            return false;
          }
          return true;
        });

        // 分页处理
        const startIndex = (self.pagination.page - 1) * self.pagination.size;
        const endIndex = startIndex + self.pagination.size;
        const pageData = filteredData.slice(startIndex, endIndex);

        self.tableData = pageData;
        self.pagination.total = filteredData.length;
        self.loading = false;
      }, 500);
    },

    handleAdd() {
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.$refs.updateOrAddRef.init('add')
      })

    },

    handleEdit(row) {
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.$refs.updateOrAddRef.init('edit', row)
      })

    },

    handleView(row) {
      this.$message.info(`查看策略：${row.strategyName}`);
    },

    handleDelete(row) {
      const ids = row ? [row.id] : this.selectedRow.map(item => item.id);
      const self = this;

      this.$confirm('确定要删除选中的预测策略吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // 模拟删除操作
        setTimeout(function() {
          self.$message.success('删除成功');
          self.handleSearch();
        }, 500);
      }).catch(function() {});
    },

    handleSelectionChange(selection) {
      this.selectedRow = selection;
    },

    handleSizeChange(size) {
      this.pagination.size = size;
      this.handleSearch();
    },

    handleCurrentChange(page) {
      this.pagination.page = page;
      this.handleSearch();
    },

    handleSaveSuccess() {
      this.dialogVisible = false;
      this.handleSearch();
    },

    getAlgorithmTypeClass(algorithmType) {
      const classes = {
        'holtwinters': 'algorithm-holtwinters',
        'sma': 'algorithm-sma',
        'wma': 'algorithm-wma',
        'ewma': 'algorithm-ewma'
      };
      return classes[algorithmType] || '';
    },

    getDataPeriodName(dataPeriod) {
      const periods = {
        'day': '日',
        'week': '周',
        'month': '月',
        'quarter': '季度'
      };
      return periods[dataPeriod] || '未知';
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 10px;
  height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
}

.search-card {
  margin-bottom: 10px;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: 10px;
  text-align: right;
}

.algorithm-holtwinters {
  color: #409EFF;
}

.algorithm-sma {
  color: #67C23A;
}

.algorithm-wma {
  color: #E6A23C;
}

.algorithm-ewma {
  color: #F56C6C;
}
</style>
