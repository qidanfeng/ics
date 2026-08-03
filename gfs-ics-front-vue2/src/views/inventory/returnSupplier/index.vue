<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.orderNumber" placeholder="请输入退供单号" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.returnWarehouseCode" placeholder="请选择退货仓库" clearable>
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
          <el-select size="mini" style="width:100%" v-model="searchForm.supplierId" filterable placeholder="请选择供应商" clearable>
              <el-option
              v-for="item in suppliers"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            />
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
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width:100%" v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width:100%" v-model="searchForm.outStockStauts" placeholder="请选择出库状态" clearable>
            <el-option
              v-for="item in outStockStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.issueStatus" placeholder="请选择下发状态" clearable>
            <el-option
              v-for="item in issueStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
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
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="primary" :loading="searchLoading" @click="handleSearch" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:returnSupplier:add')">
              <el-button size="mini" @click="handleAdd" style="width:100%">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:returnSupplier:issue')">
              <el-button size="mini" :disabled="selectedRow.length === 0" :loading="issueLoading" @click="handleIssue" style="width:100%">下发</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="4" v-if="isAuth('ics:returnSupplier:withdraw')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="issueRepealLoading" @click="handleIssueRepeal" style="width:100%">下发撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:returnSupplier:cancel')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="cancelOrderLoading" @click="handleCancelOrder" style="width:100%">取消</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:returnSupplier:export')">
              <el-button size="mini" :loading="exportLoading" @click="handleExport" style="width:100%">导出</el-button>
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
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
          <u-table-column type="index" width="55" align="center" />

          <u-table-column prop="orderNumber" label="退供单号" width="180" align="center" show-overflow-tooltip />
          <u-table-column prop="returnWarehouseName" label="退货仓库" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="supplierName" label="供应商" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
          <u-table-column prop="orderStatusName" label="订单状态" width="120" align="center">
            <template slot-scope="scope">
              <span :class="getOrderStatusTextClass(scope.row.orderStatus)">
                {{ scope.row.orderStatusName }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="outStockStatusName" label="出库状态" width="120" align="center">
          </u-table-column>
          <u-table-column prop="issueStatusName" label="下发状态" width="120" align="center">

          </u-table-column>
          <u-table-column prop="omsOrderNumber" label="OMS订单号" width="120" align="center" show-overflow-tooltip>

          </u-table-column>

          <u-table-column prop="outStockFinishTime" label="出库完成时间" width="120" align="center" />
          <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column label="操作" width="180" align="center" fixed="right" style="background-color: white">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)" v-if="isAuth('ics:returnSupplier:edit')">编辑</el-button>
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
        :visible.sync="showDialogVisible"
      />

    <!-- 新增编辑弹窗 -->
    <update-or-add
      ref="updateOrAddRef"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :delivery-method-options="deliveryMethodOptions"
      :form-data="currentFormData"
      @success="handleSaveSuccess"
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
  name: "ReturnSupplier",
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
      submitting: false,
      searchLoading: false,
      issueLoading: false,
      issueRepealLoading: false,
      cancelOrderLoading: false,
      exportLoading: false,
      searchForm: {
        orderNumber: '',
        returnWarehouseCode: '',
        supplierId: '',
        clientId: '',
        projectId: '',
        deliveryMethodCode: '',
        orderStatus: '',
        outStockStauts: '',
        issueStatus: '',
      },
      createdTimeRange: [],
      deliveryMethodOptions: [],
      orderStatusOptions: [],
      outStockStatusOptions:[],
      issueStatusOptions:[],
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
      tableHeight: 600
    }
  },
  mounted() {
    // 设置默认时间范围（最近2天）
    this.setDefaultTimeRange();
    this.loadDeliveryMethodOptions();
    this.loadOrderStatusOptions();
    this.loadOutStockStatusOptions();
    this.loadIssueStatusOptions();
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
    setDefaultTimeRange() {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const formatStartDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
      };

      const formatEndDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 23:59:59`;
      };

      this.createdTimeRange = [
        formatStartDateTime(twoDaysAgo),
        formatEndDateTime(now)
      ];
    },

    calculateTableHeight() {
      this.$nextTick(() => {
        const searchCard = document.querySelector('.search-card')
        const paginationContainer = document.querySelector('.pagination-container')
        const headerHeight = 150
        const padding = 20

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight
          const paginationHeight = paginationContainer.offsetHeight
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding
          this.tableHeight = Math.max(300, availableHeight)
        }
      })
    },
    // 获取送货方式列表
    loadDeliveryMethodOptions() {
      API.orderConstant.getReturnSupplierDeliveryMethodList().then(({data})=>{
        if(data.data == data.code == 0){
          this.deliveryMethodOptions = data.data;
        }
      }).catch();
    },
    loadOutStockStatusOptions() {
      API.orderConstant.getOutStockStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.outStockStatusOptions = data.data;
        }
      }).catch();
    },
    //下发状态
    loadIssueStatusOptions(){
      API.orderConstant.getIssueStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.issueStatusOptions = data.data;
        }
      }).catch();
    },

    handleSearch() {
      this.searchLoading = true
      this.loading = true
      this.searchForm.createdTimeStart = this.createdTimeRange[0];
      this.searchForm.createdTimeEnd = this.createdTimeRange[1];
      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;
      this.searchForm.clientId = this.client.id;

      API.returnSupplier.getListPage(this.searchForm).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.list;
          this.pagination.total = data.data.totalCount;
          this.$message.success( '搜索完成');
        }
        this.loading = false
        this.searchLoading = false

      }).catch(error => {
        this.loading = false
        this.searchLoading = false
      })
    },

    handleAdd() {
      this.dialogTitle = '新增退供单'
      this.currentFormData = {
        id: '',
        orderType: '',
        expectedArrivalDate: '',
        projectId: '',
        projectCode: '',
        projectName: '',
        returnWarehouseCode: '',
        returnWarehouseName: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        deliveryMethod: '',
        remark: '',
        returnDetails: []
      }
      this.dialogVisible = true
       this.$nextTick(() => {
        this.$refs.updateOrAddRef.addInit('新增退供单', this.updateOrAddDialogData);
      })
    },

    handleEdit(row) {

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.updateOrAddRef.updateInit('编辑退供单', row);
      })
    },


    handleView(row) {
      this.showDialogVisible=true;
      this.$nextTick(()=>{
        this.$refs.showDialogRef.init(row)
      })

    },

    handleExport() {
      this.exportLoading = true
      this.searchForm.idList = this.selectedRow.map(item => item.id);
      API.returnSupplier.exportFile(this.searchForm).then(({data}) => {
        this.searchForm.idList = null;
        if(data){
          const blob = new Blob([data],{type:'application/vnd.ms-excel'});
          const a = document.createElement('a')
          a.addEventListener('click', function(e){
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            a.download = `退供出库单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
            a.href = URL.createObjectURL(blob)
          })
          const e=document.createEvent('MouseEvents')
          e.initEvent('click', false, false)
          a.dispatchEvent(e)
        }
        this.exportLoading = false
      }).catch(()=>{
        this.searchForm.idList = null;
        this.exportLoading = false
      })
    },

    // 批量下发
    handleIssue() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要下发的退供单')
        return
      }
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认下发退供单：${orderNumbers}？`, '下发退供单', {
        confirmButtonText: '确认下发',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.issueLoading = true
        const ids = this.selectedRow.map(row => row.id);
        API.returnSupplier.issue(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('退供单下发成功')
            this.handleSearch()
          }
          this.issueLoading = false
        }).catch(error => {
          this.issueLoading = false
        })
      })
    },
    //加载订单状态
    loadOrderStatusOptions(){
      API.orderConstant.getReturnSupplierOutOrderStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.orderStatusOptions = data.data;
        }
      }).catch();
    },

    // 批量撤回
    handleIssueRepeal() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要撤回的退供单')
        return
      }
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认撤回退供单：${orderNumbers}？`, '撤回退供单', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.issueRepealLoading = true
        const ids = this.selectedRow.map(row => row.id);
        API.returnSupplier.issueRepeal(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('退供单撤回成功')
            this.handleSearch()
          }
          this.issueRepealLoading = false
        }).catch(error => {
          this.issueRepealLoading = false
        })
      })
    },

    // 批量取消
    handleCancelOrder() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要取消的退供单')
        return
      }
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认取消退供单：${orderNumbers}？取消后将无法恢复。`, '取消退供单', {
        confirmButtonText: '确认取消',
        cancelButtonText: '返回',
        type: 'error'
      }).then(() => {
        this.cancelOrderLoading = true
        const ids = this.selectedRow.map(row => row.id);
        API.returnSupplier.cancelOrder(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('退供单取消成功')
            this.handleSearch()
          }
          this.cancelOrderLoading = false
        }).catch(error => {
          this.cancelOrderLoading = false
        })
      })
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

    handleSaveSuccess() {
      this.handleSearch()
    },

    /**
     * 获取订单状态文本样式类
     */
    getOrderStatusTextClass(status) {
      const statusClassMap = {
        10: 'status-text-pending',    // 未出库
        20: 'status-text-confirmed',  // 已出库
        30: 'status-text-processing', // 已入库
        90: 'status-text-cancelled'   // 已取消
      };
      return statusClassMap[status] || 'status-text-default';
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

/* 状态文本样式 */
.status-text-pending {
  color: #e6a23c;
  font-weight: 600;
}

.status-text-processing {
  color: #409eff;
  font-weight: 600;

}

.status-text-confirmed {
  color: #67c23a;
  font-weight: 600;
}

.status-text-completed {
  color: #67c23a;
  font-weight: 600;
}

.status-text-cancelled {
  color: #f56c6c;
  font-weight: 600;
}

.status-text-default {
  color: #909399;
  font-weight: 600;
}

/* 响应式布局优化 */
@media screen and (max-width: 768px) {
  .search-card .el-col {
    margin-bottom: 10px;
  }

  .button-group .el-col {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 480px) {
  .app-container {
    padding: 5px;
  }

  .search-card {
    margin-bottom: 5px;
  }
}
</style>
