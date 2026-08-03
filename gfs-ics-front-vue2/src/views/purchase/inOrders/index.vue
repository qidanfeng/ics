<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width: 100%"  v-model="searchForm.suggestionOrderNumber" placeholder="请输入采购订单号" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width: 100%"  v-model="searchForm.orderNumber" placeholder="请输入采购入库单号" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.deliveryWarehouseCode" placeholder="请选择送货仓库" clearable>
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
          <el-select size="mini" style="width: 100%"  v-model="searchForm.supplierId" placeholder="请选择供应商" clearable>
            <el-option
              v-for="item in suppliers"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.deliveryMethodCode" placeholder="请选择送货方式" clearable>
            <el-option
              v-for="item in deliveryMethodOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.carrierId" placeholder="请选择承运商" clearable>
            <el-option
              v-for="item in carriers"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.inStockStatus" placeholder="请选择入库状态" clearable>
            <el-option
              v-for="item in inStockStatusOptions"
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
            size="mini" style="width: 100%"
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
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="primary" @click="handleSearch" :loading="searchLoading" style="width: 100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inOrders:add')">
              <el-button size="mini" @click="handleAdd" style="width: 100%">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inOrders:issue')">
              <el-button size="mini" :disabled="selectedRow.length === 0" :loading="issueLoading" @click="handleIssue" style="width: 100%">下发</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="4" v-if="isAuth('ics:inOrders:withdraw')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="issueRepealLoading" @click="handleIssueRepeal" style="width: 100%">下发撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inOrders:cancel')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="cancelOrderLoading" @click="handleCancelOrder" style="width: 100%">取消</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inOrders:export')">
              <el-button size="mini" :loading="exportLoading" @click="handleExport" style="width: 100%">导出</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="4" v-if="isAuth('ics:inOrders:finish')">
              <el-button size="mini" :loading="finishLoading" @click="handleFinish" style="width: 100%">完成订单</el-button>
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
          @selection-change="handleSelectionChange"
        >
          <u-table-column type="index" width="55" align="center" />
          <u-table-column type="selection" width="55" align="center" fixed="left" style="background-color: white"/>
          <u-table-column prop="suggestionOrderNumber" label="采购订单号" width="180" align="center" />
          <u-table-column prop="deliveryWarehouseName" label="送货仓库" width="120" align="center" />
          <u-table-column prop="supplierName" label="供应商" width="150" align="center" show-overflow-tooltip />
          <u-table-column prop="projectName" label="货主" width="120" align="center" />
          <u-table-column prop="omsOrderNumber" label="OMS订单号" width="180" align="center" />
          <u-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
          <u-table-column prop="carrierName" label="承运商" width="120" align="center" />
          <u-table-column prop="orderStatusName" label="订单状态" width="120" align="center">
            <template slot-scope="scope">
              <span :class="getStatusTextClass(scope.row.orderStatus)">
                {{ scope.row.orderStatusName }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="inStockStatusName" label="入库状态" width="120" align="center">

          </u-table-column>
          <u-table-column prop="issueStatusName" label="下发状态" width="120" align="center">

          </u-table-column>
          <u-table-column prop="estimatedDeliveryDate" label="预计到仓日期" width="120" align="center" />
          <u-table-column prop="orderNumber" label="采购入库单号" width="180" align="center" />
          <u-table-column prop="createdBy" label="创建人" width="100" align="center"  show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center"  show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column label="操作" width="50" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
<!--              <el-button type="text" size="small" @click="handleEdit(scope.row)" v-if="isAuth('ics:inOrders:edit')">编辑</el-button>-->
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

    <!-- 查看弹窗 -->
    <show-dialog
      ref="showDialogRef"
      :visible.sync="viewDialogVisible"
    />
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import ShowDialog from './showDialog.vue'
import {mapGetters} from "vuex";
import API from '@/api'
export default {
  name: "PurchaseInOrders",
  components: {
    UTable,
    UTableColumn,ShowDialog
  },

  data() {
    return {
      loading: false,
      finishLoading:false,
      submitting: false,
      searchLoading: false,
      issueLoading: false,
      issueRepealLoading: false,
      cancelOrderLoading: false,
      exportLoading: false,
      viewDialogData:{},
      viewDialogVisible: false,
      createdTimeRange: [],
      searchForm: {
        suggestionOrderNumber:'',
        orderNumber: '',
        inStockStatus:'',
        issueStatus:'',
        deliveryWarehouseCode: '',
        supplierId: '',
        projectId: '',
        deliveryMethodCode: '',
        carrierId: '',
        orderStatus: ''
      },
      deliveryMethodOptions: [],
      carrierOptions: [],
      orderStatusOptions: [],
      inStockStatusOptions: [],
      issueStatusOptions: [],
      tableData: [],
      selectedRow: [],
      pagination: {
        page: 1,
        size: 20,
        total: 1
      },
      dialogVisible: false,
      dialogTitle: '',
      currentFormData: {},
      selectedRows: [],
      tableHeight: 500,
      showDialogVisible: false,
    }
  },
  computed: {
    ...mapGetters([
      'client',
      'carriers',
      'suppliers',
      'warehouses',
      'projects'
    ])
  },
  mounted() {
    // 设置默认时间范围（最近2天）
    this.setDefaultTimeRange();

    // 页面初始化时加载下拉框数据
    this.loadDeliveryMethodOptions();
    this.loadOrderStatusOptions();
    this.loadInStockStatusOptions();
    this.loadIssueStatusOptions();
    // 计算表格高度
    this.calculateTableHeight();

    // 监听窗口大小变化
    window.addEventListener('resize', this.calculateTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  activated() {
    this.handleSearch();
  },
  methods: {
    // 设置默认时间范围（最近2天）
    setDefaultTimeRange() {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // 格式化开始时间为00:00:00，结束时间为23:59:59
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

    // 计算表格高度以适配屏幕
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
      API.orderConstant.getPurchaseDeliveryMethodList().then(({data})=>{
        if(data.data == data.code == 0){
          this.deliveryMethodOptions = data.data;
        }
      }).catch();
    },

    loadOrderStatusOptions(){
      API.orderConstant.getPurchaseInOrderStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.orderStatusOptions = data.data;
        }
      }).catch();
    },

    loadInStockStatusOptions(){
      API.orderConstant.getInStockStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.inStockStatusOptions = data.data;
        }
      }).catch();
    },

    loadIssueStatusOptions(){
      API.orderConstant.getIssueStatusList().then(({data})=>{
       if(data.data == data.code == 0){
          this.issueStatusOptions = data.data;
        }
      }).catch();


    },
    async handleSearch() {
      this.searchLoading = true
      this.loading = true
      try {
        // 设置时间范围参数到searchForm，与suggestion组件保持一致
        if (this.createdTimeRange && this.createdTimeRange.length === 2) {
          this.searchForm.createdTimeStart = this.createdTimeRange[0]
          this.searchForm.createdTimeEnd = this.createdTimeRange[1]
        }

         // 设置分页参数
        this.searchForm.page = this.pagination.page;
        this.searchForm.limit = this.pagination.size;
        this.searchForm.clientId= this.client.id;

        const { data } = await API.inOrder.getListPage(this.searchForm)
        if (data && data.code === 0) {
          this.tableData = data.data.list || []
          this.pagination.total = data.data.totalCount || 0
          this.$message.success('搜索完成')
        } else {
          this.$message.error(data.message || '获取数据失败')
        }
      } catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败')
      } finally {
        this.loading = false
        this.searchLoading = false
      }
    },

    // 新增
    handleAdd() {
      this.$refs.updateOrAddDialog.init('add')
    },

    handleEdit(row) {
      this.$refs.updateOrAddDialog.init('edit', row)
    },

    // 查看详情
    handleView(row) {
      this.showDialogVisible = true
      this.$nextTick(() => {
        this.$refs.showDialogRef.init(row)
      })
    },

    // 下发
    handleIssue() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要下发的采购入库单')
        return
      }
      this.issueLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、')
      this.$confirm(`确认下发采购入库单：${orderNumbers}？`, '下发确认', {
        confirmButtonText: '确认下发',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const idList = this.selectedRow.map(row => row.id)
        API.inOrder.issue(idList).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('下发成功')
            this.handleSearch()
          }
          this.issueLoading = false
        }).catch(error => {
          this.issueLoading = false
        })
      }).catch(() => {
        this.issueLoading = false
      })
    },

    // 下发撤回
    handleIssueRepeal() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要撤回的采购入库单')
        return
      }
      this.issueRepealLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、')
      this.$confirm(`确认撤回已下发的采购入库单：${orderNumbers}？`, '撤回确认', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = this.selectedRow.map(row => row.id)
        API.inOrder.issueRepeal(idList).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('下发撤回成功')
            this.handleSearch()
          }
          this.issueRepealLoading = false
        }).catch(error => {
          this.issueRepealLoading = false
        })
      }).catch(() => {
        this.issueRepealLoading = false
      })
    },

    // 取消订单
    handleCancelOrder() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要取消的采购入库单')
        return
      }
      this.cancelOrderLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、')
      this.$confirm(`确认取消采购入库单：${orderNumbers}？取消后将无法恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
             const idList = this.selectedRow.map(row => row.id)
          const { data } = await API.inOrder.cancelOrder(idList)
          if (data && data.code === 0) {
            this.$message.success('取消成功')
            this.handleSearch()
          }
          this.cancelOrderLoading = false
        } catch (error) {
          this.cancelOrderLoading = false
        }
      }).catch(() => {
        this.cancelOrderLoading = false
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除该采购入库单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data } = await API.inOrder.delete({ id: row.id })
          if (data && data.code === 0) {
            this.$message.success('删除成功')
            this.handleSearch()
          }
        } catch (error) {

        }
      }).catch(() => {

      })
    },
    handleFinish(){
      // 设置选中的ID列表
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要完成的采购入库单')
        return
      }
      const  idList = this.selectedRow.map(item => item.id);
      this.$confirm('确认完成该采购入库单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.finishLoading = true
        API.inOrder.finishOrders(idList).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.handleSearch()
          }
          this.finishLoading = false;
        }).catch(error=>{
          this.finishLoading = false;
        })
      })

    },
    handleExport() {
      this.exportLoading = true
      // 设置选中的ID列表
      this.searchForm.idList = this.selectedRow.map(item => item.id)

      API.inOrder.exportFile(this.searchForm).then(({data}) => {
        this.searchForm.idList = null
        if(data){
          const blob = new Blob([data],{type:'application/vnd.ms-excel'})
          const a = document.createElement('a')
          a.addEventListener('click', function(e){
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            a.download = `采购入库单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
            a.href = URL.createObjectURL(blob)
          })
          const e=document.createEvent('MouseEvents')
          e.initEvent('click', false, false)
          a.dispatchEvent(e)

          this.$message.success('导出成功')
        }
        this.exportLoading = false
      }).catch(()=>{
        this.searchForm.idList = null
        this.$message.error('导出失败')
        this.exportLoading = false
      })
    },
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.pagination.page = 1
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.handleSearch()
    },

    // 弹窗相关方法
    handleDialogClose() {
      this.dialogVisible = false
      this.currentFormData = {}
      this.$refs.formRef && this.$refs.formRef.resetFields()
    },
    handleViewDialogClose() {
      this.viewDialogVisible = false
    },

    // 表单相关方法
    addRow() {
      if (!this.currentFormData.products) {
        this.currentFormData.products = []
      }
      this.currentFormData.products.push({
        productCode: '',
        productName: '',
        specification: '',
        unit: '个',
        quantity: 1,
        price: 0,
        amount: 0,
        remark: ''
      })
    },
    deleteRows() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的商品')
        return
      }
      this.$confirm('确认删除选中的商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selectedIndexes = this.selectedRows.map(row =>
          this.currentFormData.products.findIndex(item => item === row)
        )
        selectedIndexes.sort((a, b) => b - a).forEach(index => {
          this.currentFormData.products.splice(index, 1)
        })
        this.$message.success('删除成功')
      })
    },
    calculateTotal(row) {
      row.amount = (row.quantity || 0) * (row.price || 0)
    },
    handleFormSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (!this.currentFormData.products || this.currentFormData.products.length === 0) {
            this.$message.warning('请至少添加一个商品')
            return
          }
          const hasEmptyProduct = this.currentFormData.products.some(item =>
            !item.productName || !item.quantity || !item.price
          )
          if (hasEmptyProduct) {
            this.$message.warning('请完善商品信息')
            return
          }

          this.submitting = true
          setTimeout(() => {
            this.submitting = false
            this.$message.success('保存成功')
            this.handleDialogClose()
            this.handleSearch()
          }, 1500)
        }
      })
    },
    handleSaveDraft() {
      this.$message.success('草稿保存成功')
      this.handleDialogClose()
    },

    // 获取订单状态文本样式类
    getStatusTextClass(status) {
      const statusMap = {
        10: 'status-text-pending',     // 待入库
        20: 'status-text-notified',    // 入库完成
        90: 'status-text-cancelled'    // 已取消
      }
      return statusMap[status] || 'status-text-default'
    },
  }
}
</script>

<style scoped>
.app-container {
  padding: 10px 10px 0 10px;
  height: calc(100vh - 85px);
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
  color: #e6a23c; /* 橙色 - 待确认 */
  font-weight: 600;
}

.status-text-notified {
  color: #67c23a; /* 绿色 - 已通知供应商 */
  font-weight: 600;
}

.status-text-confirmed {
  color: #409eff; /* 蓝色 - 已确认 */
  font-weight: 600;
}

.status-text-generated {
  color: #909399; /* 灰色 - 已生成采购入库 */
  font-weight: 600;
}

.status-text-cancelled {
  color: #f56c6c; /* 红色 - 已取消 */
  font-weight: 600;
}

.status-text-default {
  color: #606266; /* 默认颜色 */
  font-weight: 500;
}

/* 按钮组响应式样式 */
.button-group {
  margin: 0;
}

.button-group .el-col {
  margin-bottom: 8px;
}

/* 超小屏幕（xs < 576px） */
@media screen and (max-width: 576px) {
  .button-group .el-col {
    margin-bottom: 6px;
  }
}

/* 小屏幕（sm 576px-768px） */
@media screen and (min-width: 576px) and (max-width: 768px) {
  .button-group .el-col {
    margin-bottom: 6px;
  }
}

/* 中等屏幕（md 768px-992px） */
@media screen and (min-width: 768px) and (max-width: 992px) {
  .button-group .el-col {
    margin-bottom: 6px;
  }
}

/* 大屏幕（lg 992px-1200px） */
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .button-group .el-col {
    margin-bottom: 6px;
  }
}
</style>




