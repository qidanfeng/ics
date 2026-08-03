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
              v-for="item in warehouses"
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
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
              size="mini"
              v-model="searchForm.productNumber"
              placeholder="请输入产品编码(支持多个，分隔符,)"
              clearable
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option :value="1" label="激活"></el-option>
            <el-option :value="0" label="关闭"></el-option>
          </el-select>
        </el-col>
<!--        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">-->
<!--          <el-select size="mini" style="width:100%" v-model="searchForm.algorithmType" placeholder="请选择预测算法" clearable>-->
<!--            <el-option-->
<!--              v-for="item in algorithmOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
              <el-button size="mini" type="primary" @click="handleSearch" :loading="searchLoading" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1" v-if="isAuth('ics:forecast:strategy:add')">
              <el-button size="mini" @click="handleAdd" style="width:100%">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:forecast:strategy:activateOrNot')">
              <el-button size="mini" type="primary" :disabled="selectedRow.length === 0" :loading="openOrCloseLoading"  @click="handleOpenOrClose()" style="width:100%">激活/关闭</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:forecast:strategy:manuForecast')">
              <el-button size="mini" type="primary" :loading="manuForecastLoading"  @click="handleManuForecast()" style="width:100%">手动预测</el-button>
            </el-col>
          </el-row>
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
          style="width: 100%; height: 100%;"
          @selection-change="handleSelectionChange">
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
          <u-table-column type="index" label="序号" width="55" align="center" />

          <u-table-column prop="strategyName" label="策略名称" width="150" align="center" show-overflow-tooltip />
          <u-table-column prop="warehouseName" label="仓库" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="productNumber" label="产品编码" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="productName" label="产品名称" width="200" align="center" show-overflow-tooltip/>
          <u-table-column prop="algorithmTypeName" label="预测算法" width="140" align="center">
            <template slot-scope="scope">
                <span :class="getAlgorithmTypeClass(scope.row.algorithmType)">
                    {{ scope.row.algorithmTypeName }}
                </span>
            </template>
          </u-table-column>
          <u-table-column prop="saleEndDate" label="截至售卖日" width="120" align="center" >
            <template slot-scope="scope">
              <span :class="getSaleEndDateTextClass(scope.row)">
                {{ scope.row.saleEndDate }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="dataPeriodName" label="数据周期" width="100" align="center" />
          <u-table-column prop="hisDataPeriods" label="历史数据周期数" width="120" align="center" />
          <u-table-column prop="remarks" label="备注" width="120" align="center" />
          <u-table-column prop="status" label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1" disabled>
              </el-switch>
            </template>
          </u-table-column>
          <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column label="操作" width="180" align="center" fixed="right" style="background-color: white">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="mini" @click="handleEdit(scope.row)" v-if="isAuth('ics:forecast:strategy:edit')">编辑</el-button>
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

    <!-- 查看详情弹窗组件 -->
    <show-dialog
        ref="showDialogRef"
        v-if="showDialogVisible"
      />

    <!-- 新增编辑弹窗 -->
    <update-or-add
      ref="updateOrAddRef"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :form-data="currentFormData"
      @submit="handleSaveSuccess"
    />
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import ShowDialog from './showDialog.vue'
import UpdateOrAdd from './updateOrAdd.vue'
import API from "@/api";
import { mapGetters } from 'vuex'

export default {
  name: "ForecastStrategy",
  components: {
    UTable,
    UTableColumn,
    ShowDialog,
    UpdateOrAdd
  },
  computed: {
    ...mapGetters([
      'projects',
      'warehouses',
      'client',
      'suppliers'
    ]),
  },
  data() {
    return {
      loading: false,
      searchLoading: false,
      openOrCloseLoading: false,
      manuForecastLoading: false,
      searchForm: {
        clientId: null,
        strategyName: '',
        warehouseCode: null,
        projectId: null,
        productNumber: null,
        status: 1
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
      showDialogVisible: false,
      tableHeight: 500
    }
  },
  mounted() {
    this.calculateTableHeight();
    window.addEventListener('resize', this.calculateTableHeight)
  },
  activated() {
    this.calculateTableHeight();
    this.handleSearch();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    calculateTableHeight() {
      var self = this;
      this.$nextTick(function() {
        const searchCard = document.querySelector('.search-card')
        const paginationContainer = document.querySelector('.pagination-container')
        const headerHeight = 150
        const padding = 20

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight
          const paginationHeight = paginationContainer.offsetHeight
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding
          self.tableHeight = Math.max(300, availableHeight)
        }
      })
    },
    handleSearch() {
      this.searchLoading = true
      this.loading = true
      if (this.createdTimeRange && this.createdTimeRange.length === 2) {
        this.searchForm.createdTimeStart = this.createdTimeRange[0]
        this.searchForm.createdTimeEnd = this.createdTimeRange[1]
      }else {
        this.searchForm.createdTimeStart = null;
        this.searchForm.createdTimeEnd = null;
      }
      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;
      this.searchForm.clientId= this.client.id;
      API.averageForecastStrategy.getListPage(this.searchForm).then(({data})=>{
        if (data.data && data.code ===0){
          this.tableData = data.data.list;
          this.pagination.total=data.data.totalCount;
          this.$message.success('搜索完成');
        }
        this.loading = false
        this.searchLoading = false
      }).catch(error =>{
        this.loading = false
        this.searchLoading = false
      })
    },

    handleAdd() {
      this.dialogTitle = '新增预测策略'
      this.currentFormData = {
        id: null,
        strategyName: '',
        warehouseCode: '',
        projectId: '',
        productNumber: '',
        productName: '',
        algorithmTypeCode: 1,
        dataPeriod: 'week', // 默认周周期
        hisDataPeriods: 2, // 默认需要2个周期的历史数据
        status: 1
      }
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.dialogTitle = '编辑预测策略'
      this.currentFormData = { ...row }
      this.dialogVisible = true
    },

    handleView(row) {
      this.showDialogVisible = true
      var self = this;
      this.$nextTick(function() {
        self.$refs.showDialogRef.init(row)
      })
    },

    handleOpenOrClose() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要激活/关闭的预测策略配置')
        return
      }
      this.openOrCloseLoading = true
      this.$confirm('确认激活/关闭该预测策略配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRow.map(item => item.id)
        API.averageForecastStrategy.openOrClose(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('激活/关闭成功')
            this.handleSearch()
          }
          this.openOrCloseLoading = false
        }).catch((error)=>{
          this.openOrCloseLoading = false
        })
      }).catch(() => {
        this.openOrCloseLoading = false
      })
    },
    // 手动预测
    handleManuForecast() {
      this.manuForecastLoading = true
      this.$confirm(`确认进行手动预测吗？`, '手动预测', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const idList = this.selectedRow.map(row => row.id)
        API.averageForecastStrategy.manuForecast(idList).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('执行成功')
            this.handleSearch()
          }
          this.manuForecastLoading = false
        }).catch(error => {
          this.manuForecastLoading = false
        })
      }).catch(() => {
        this.manuForecastLoading = false
      })
    },
    handleExport() {
      // 导出功能实现
      this.$message.info('导出功能待实现')
    },

    handleSelectionChange(selection) {
      this.selectedRow = selection
    },

    handleSizeChange(size) {
      this.pagination.size = size
      this.handleSearch()
    },

    handleCurrentChange(page) {
      this.pagination.page = page
      this.handleSearch()
    },

    handleSaveSuccess() {
      this.dialogVisible = false
      this.handleSearch()
    },

    getAlgorithmTypeClass(algorithmType) {
      const classes = {
        'sma': 'algorithm-sma',
        'wma': 'algorithm-wma',
        'ewma': 'algorithm-ewma'
      }
      return classes[algorithmType] || ''
    },

    // 获取售卖截至日文本样式
    getSaleEndDateTextClass(row) {
      let textClass = 'text-success';
      const saleEndDate = new Date(row.saleEndDate);
      const today = new Date();
      // 清除时间部分
      today.setHours(0, 0, 0, 0);
      if(saleEndDate.getTime() < today.getTime()){
        textClass = 'text-danger';
      }
      return textClass
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
  color: #409EFF;
}

.algorithm-wma {
  color: #67C23A;
}

.algorithm-ewma {
  color: #E6A23C;
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
