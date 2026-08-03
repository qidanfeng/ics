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
          <el-select size="mini" style="width:100%" v-model="searchForm.projectCode" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projectOptions"
              :key="item.projectCode"
              :label="item.projectName"
              :value="item.projectCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
<!--            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">-->
<!--              <el-button size="mini" :disabled="selectedRow.length !== 1" @click="handleEdit" style="width:100%">编辑</el-button>-->
<!--            </el-col>-->
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" @click="handleOpenOrClose" style="width:100%">激活/关闭</el-button>
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
          <el-table-column type="index" label="序号" width="80" align="center" />

          <el-table-column prop="strategyName" label="策略名称" width="250" align="center" show-overflow-tooltip />
          <el-table-column prop="warehouseName" label="仓库" width="150" align="center" show-overflow-tooltip/>
          <el-table-column prop="projectName" label="货主" width="200" align="center" show-overflow-tooltip/>
          <el-table-column prop="algorithmTypeName" label="预测算法" width="200" align="center">
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
          <el-table-column prop="forecastPeriods" label="预测周期数" width="120" align="center" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
<!--              <el-button type="text" size="small" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>-->
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
import API from "@/api";
import {mapGetters} from "vuex";

export default {
  name: "ForecastStrategy",
  components: {
    UpdateOrAdd
  },
  computed: {
    ...mapGetters([
      'client'
    ])
  },
  data() {
    return {
      loading: false,
      searchForm: {
        strategyName: '',
        warehouseCode: '',
        projectCode: '',
        algorithmType: '',
        status: ''
      },
      supplierOptionsForSelect: [],
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
      warehouseOptions: [],
      projectOptions: [],
      algorithmOptions: [
        { value: 'holtwinters', label: 'Holt-Winters' },
        { value: 'sma', label: '简单移动平均' },
        { value: 'wma', label: '加权移动平均' },
        { value: 'ewma', label: '指数加权移动平均' }
      ],
      statusOptions: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' }
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

      // 设置分页参数
      const searchParams = {
        ...this.searchForm,
        page: this.pagination.page,
        limit: this.pagination.size,
        clientCode: this.$store.getters.client.code // 添加客户编码
      };

      // 调用真实API
      API.forecastStrategy.getListPage(searchParams).then(({data}) => {
        if (data && data.code === 0) {
          this.tableData = data.data.list;
          this.pagination.total = data.data.totalCount;
          this.$message.success('搜索完成');
        }
        this.loading = false;
      }).catch(error => {
        console.error('搜索失败:', error);
        this.loading = false;
      });
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
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.$refs.updateOrAddRef.init('view', row)
      })
    },

    handleOpenOrClose() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要操作的策略');
        return;
      }

      const ids = this.selectedRow.map(item => item.id);
      const self = this;

      this.$confirm('确定要修改选中策略的激活状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        API.forecastStrategy.openOrClose(ids).then(({data}) => {
          if (data && data.code === 0) {
            self.$message.success('状态修改成功');
            self.handleSearch();
          } else {
            self.$message.error(data.message || '状态修改失败');
          }
        }).catch(error => {
          console.error('状态修改失败:', error);
          self.$message.error('状态修改失败');
        });
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
