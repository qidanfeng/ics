<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.orderNumber" placeholder="请输入采购订单号" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.deliveryWarehouseCode" placeholder="请选择送货仓库" clearable>
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
          <el-select size="mini" style="width:100%" v-model="searchForm.supplierId" placeholder="请选择供应商" filterable clearable
                     :filter-method="supplierFilterHandle"
                     @visible-change="supplierOptionsForSelect = suppliers"
          >
            <el-option
              style="width:400px"
              v-for="item in supplierOptionsForSelect"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            >
              <span style="float: left">{{ item.supplierCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplierName }}</span>
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
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini"  style="width:100%"  v-model="searchForm.orderStatusList" placeholder="请选择订单状态" clearable multiple>
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width:100%"  v-model="searchForm.deliveryMethodCodeList" placeholder="请选择送货方式" clearable multiple>
            <el-option
              v-for="item in deliveryMethodOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%"  v-model="searchForm.carrierId" placeholder="请选择承运商" clearable>
            <el-option
              v-for="item in carriers"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
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
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="1">
              <el-button size="mini" type="primary" @click="handleSearch" :loading="searchLoading" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="1" v-if="isAuth('ics:suggestion:add')">
              <el-button size="mini" @click="handleAdd" style="width:100%">新增</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:suggestion:sendSupplier')">
              <el-button size="mini" :disabled="selectedRow.length === 0" :loading="sendSupplierLoading" @click="handleSendSupplierConfirm" style="width:100%">发送供应商确认</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:suggestion:sendSupplierRepeal')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="sendSupplierRepealLoading" @click="handleSendSupplierConfirmRepeal" style="width:100%">发送供应商撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:suggestion:confirmRepeal')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="confirmRepealLoading" @click="handleConfirmRepeal" style="width:100%">订单确认撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:suggestion:generateInbound')">
              <el-button size="mini" :disabled="selectedRow.length === 0" :loading="generateInboundLoading" @click="handleGenerateInbound" style="width:100%">生成采购入库单</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-if="isAuth('ics:suggestion:inboundWithdraw')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="inboundWithdrawLoading" @click="handleInboundWithdraw" style="width:100%">采购入库撤回</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="1" v-if="isAuth('ics:suggestion:cancel')">
              <el-button size="mini" type="danger" :disabled="selectedRow.length === 0" :loading="cancelLoading" @click="handleCancel" style="width:100%">取消</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="1" v-if="isAuth('ics:suggestion:import')">
              <el-button size="mini" :loading="importLoading" @click="handleImport" style="width:100%">导入</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="1" v-if="isAuth('ics:suggestion:export')">
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
          style="width: 100%; height: 100%;"
          @selection-change="handleSelectionChange">
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
          <u-table-column type="index" label="序号" width="55" align="center" />

          <u-table-column prop="orderNumber" label="采购订单号" width="180" align="center" show-overflow-tooltip />
          <u-table-column prop="fromAddressName" label="提货地址" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="deliveryWarehouseName" label="送货仓库" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="supplierName" label="供应商" width="250" align="center" show-overflow-tooltip />
          <u-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
<!--          <u-table-column prop="documentTypeName" label="单据类型" width="100" align="center" />-->
          <u-table-column prop="deliveryMethodName" label="送货方式" width="100" align="center" />
          <u-table-column prop="carrierName" label="承运商" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="orderStatusName" label="订单状态" width="120" align="center">
            <template slot-scope="scope">
              <span :class="getStatusTextClass(scope.row.orderStatus)">
                {{ scope.row.orderStatusName }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="estimatedDeliveryDate" label="预计到仓日期" width="120" align="center" />
          <u-table-column prop="orderSourceName" label="订单来源" width="120" align="center" />
          <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column label="操作" width="250" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)" v-if="isAuth('ics:suggestion:edit')">编辑</el-button>
              <el-button type="text" size="small" :loading="manuConfirmLoading" @click="manuConfirm(scope.row)" v-if="isAuth('ics:suggestion:supplierConfirm')">手动确认</el-button>
              <el-button type="text" size="small" :loading="supplierConfirmLoading" @click="supplierConfirm(scope.row)" v-if="isAuth('ics:suggestion:supplierConfirm')">供应商确认</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <update-or-add
      ref="updateOrAddRef"
      v-if="dialogVisible"
      :delivery-method-options="deliveryMethodOptions"
      @submit="handleFormSubmit"
    />

    <!-- 查看弹窗 -->
    <show-dialog
      ref="showDialogRef"
      :visible.sync="showDialogVisible"
    />

    <upload v-if="uploadVisible" :templateUrl='templateUrl' ref="upload" @refreshDataList="handleSearch"></upload>
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import UpdateOrAdd from './updateOrAdd.vue'
import ShowDialog from './showDialog.vue'
import API from "@/api";
import {mapGetters} from "vuex";
import Upload from '@/components/upload/upload'
import {getImportTempletsUrl} from '@/utils/importTemplate'
import {noticeSupplierRepeal} from "@/api/modules/purchase/suggestion";
export default {
  name: "PurchaseSuggestion",
  components: {
    UTable,
    UTableColumn,
    UpdateOrAdd,
    ShowDialog,
    Upload
  },
  computed: {
    ...mapGetters([
      'client',
      'carriers',
      'suppliers',
      'warehouses',
      'projects'
    ]),
  },
  data() {
    return {
      loading: false,
      submitting: false,
      searchLoading: false,
      sendSupplierLoading: false,
      sendSupplierRepealLoading: false,
      confirmRepealLoading: false,
      generateInboundLoading: false,
      inboundWithdrawLoading: false,
      cancelLoading: false,
      importLoading: false,
      exportLoading: false,
      manuConfirmLoading: false,
      supplierConfirmLoading: false,
      templateUrl: {
        url: '',
        name: '',
        code: 1
      },
      uploadVisible: false,
      searchForm: {
        orderNumber: '',
        deliveryWarehouseCode: '',
        supplierId: '',
        projectId: '',
        deliveryMethodCodeList: [],
        carrierId: '',
        orderStatusList: []
      },
      supplierOptionsForSelect: [],
      createdTimeRange: [],
      deliveryMethodOptions: [],
      carrierOptions: [],
      orderStatusOptions: [],
      tableData: [],
      selectedRow: [],
      pagination: {
        page: 1,
        size: 20,
        total: 1
      },
      dialogVisible: false,
      showDialogVisible: false,
      currentFormData: {},
      tableHeight: 500 // 默认高度
    }
  },
  mounted() {
    // 设置默认时间范围（最近2天）
    this.setDefaultTimeRange();

    // 页面初始化时加载下拉框数据
    this.loadDeliveryMethodOptions();
    this.loadOrderStatusOptions();
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
        const searchCard = document.querySelector('.search-card');
        const paginationContainer = document.querySelector('.pagination-container');
        const headerHeight = 150; // 顶部可能的导航栏高度
        const padding = 20; // 页面内边距

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight;
          const paginationHeight = paginationContainer.offsetHeight;
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
          this.tableHeight = Math.max(300, availableHeight); // 最小高度300px
        }
      });
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
      API.orderConstant.getPurchaseSuggestionOrderStatusList().then(({data})=>{
        if(data.data == data.code == 0){
          this.orderStatusOptions = data.data;
        }
      }).catch();
    },


    /**
     * 获取状态文本样式类
     * @param {number} status - 订单状态值
     * @returns {string} 样式类名
     */
    getStatusTextClass(status) {
      const statusClassMap = {
        10: 'status-text-pending',     // 待确认
        20: 'status-text-notified',    // 已通知供应商
        30: 'status-text-confirmed',   // 已确认
        40: 'status-text-generated',   // 已生成采购入库
        90: 'status-text-cancelled'    // 已取消
      };
      return statusClassMap[status] || 'status-text-default';
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
      API.suggestion.getListPage(this.searchForm).then(({data})=>{
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
      this.currentFormData = {
        id: null,
        orderNumber:'',
        deliveryWarehouseCode: '',
        deliveryWarehouseName: '',
        supplierId: null,
        supplierCode: '',
        supplierName: '',
        clientId: null,
        clientCode: '',
        clientName: '',
        projectId: null,
        projectCode: '',
        projectName: '',
        documentTypeCode: '10',
        documentTypeName: '采购订单',
        deliveryMethodCode: '',
        deliveryMethodName: '',
        carrierId: null,
        carrierCode: '',
        carrierName: '',
        orderStatus: 10,
        orderStatusName: '待确认',
        estimatedDeliveryDate: '',
        remarks: '',
        detailList:[]
      }
      this.dialogVisible = true
      this.$nextTick(()=>{
        this.$refs.updateOrAddRef.addInit('新增采购订单',this.currentFormData);
      })
    },
    handleEdit(row) {
      this.dialogVisible = true
      this.$nextTick(()=>{
        this.$refs.updateOrAddRef.updateInit('编辑采购订单',row);
      })

    },
    handleView(row) {
      this.showDialogVisible = true
      this.$nextTick(() => {
        this.$refs.showDialogRef.init(row)
      })
    },
    manuConfirm(row){
      this.manuConfirmLoading = true
      this.$confirm(`确认此采购单：${row.orderNumber} ？`, '手动确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success',
    }).then(() => {

      API.suggestion.manuConfirm([row.id]).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('采购单确认成功')
          this.handleSearch()
        }
        this.manuConfirmLoading = false
      }).catch(error => {
        this.manuConfirmLoading = false
      })
    }).catch(() => {
      this.manuConfirmLoading = false
    })
    },
    supplierConfirm(row){
      this.supplierConfirmLoading = true
      let routeData = this.$router.resolve({path: "/supplierConfirm", query: {orderNumber:row.orderNumber,type:'open'}});
      window.open(routeData.href, '_blank');
      this.supplierConfirmLoading = false
    },
    // 发送供应商确认
    handleSendSupplierConfirm() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要发送确认的采购订单')
        return
      }
      this.sendSupplierLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认向供应商发送采购订单：${orderNumbers} 的确认通知？`, '发送供应商确认', {
        confirmButtonText: '确定发送',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 调用API发送供应商确认
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.noticeSupplier(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('已成功发送供应商确认通知')
            this.handleSearch()
          }
          this.sendSupplierLoading = false
        }).catch(error => {
          this.sendSupplierLoading = false
        })
      }).catch(() => {
        this.sendSupplierLoading = false
      })
    },
    // 发送供应商确认撤回
    handleSendSupplierConfirmRepeal() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要发送撤回的采购订单')
        return
      }
      this.sendSupplierRepealLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认撤回向供应商发送采购订单：${orderNumbers} 的确认通知？`, '发送供应商撤回', {
        confirmButtonText: '确定撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用API发送供应商确认撤回
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.noticeSupplierRepeal(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('已成功撤回发送供应商确认通知')
            this.handleSearch()
          }
          this.sendSupplierRepealLoading = false
        }).catch(error => {
          this.sendSupplierRepealLoading = false
        })
      }).catch(() => {
        this.sendSupplierRepealLoading = false
      })
    },
    // 确认撤回
    handleConfirmRepeal() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要订单确认撤回的采购订单')
        return
      }
      this.confirmRepealLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认对采购订单：${orderNumbers} 进行订单确认撤回？`, '订单确认撤回', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用API订单确认撤回
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.confirmRepeal(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('已成功订单确认撤回')
            this.handleSearch()
          }
          this.confirmRepealLoading = false
        }).catch(error => {
          this.confirmRepealLoading = false
        })
      }).catch(() => {
        this.confirmRepealLoading = false
      })
    },

    // 生成采购入库单
    handleGenerateInbound() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要生成采购入库单的采购订单')
        return
      }
      this.generateInboundLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认根据采购订单：${orderNumbers} 生成采购入库单？`, '生成采购入库单', {
        confirmButtonText: '确认生成',
        cancelButtonText: '取消',
        type: 'success',
      }).then(() => {
        // 调用API取消采购订单，传递id数组
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.generatePurchaseInOrder(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('生成采购入库成功')
            this.handleSearch()
          }
          this.generateInboundLoading = false
        }).catch(error => {
          this.generateInboundLoading = false
        })
      }).catch(() => {
        this.generateInboundLoading = false
      })
    },

    // 采购入库撤回
    handleInboundWithdraw() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要撤回的采购订单')
        return
      }
      this.inboundWithdrawLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认撤回采购订单：${orderNumbers} 的采购入库单？`, '采购入库撤回', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.generatePurchaseInOrderRepeal(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('采购入库单撤回成功')
            this.handleSearch()
          }
          this.inboundWithdrawLoading = false
        }).catch(error => {
          this.inboundWithdrawLoading = false
        })
      }).catch(() => {
        this.inboundWithdrawLoading = false
      })
    },

    // 取消
    handleCancel() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要取消的采购订单')
        return
      }
      this.cancelLoading = true
      const orderNumbers = this.selectedRow.map(row => row.orderNumber).join('、');
      this.$confirm(`确认取消采购订单：${orderNumbers}？取消后将无法恢复。`, '取消采购订单', {
        confirmButtonText: '确认取消',
        cancelButtonText: '返回',
        type: 'error'
      }).then(() => {
        // 调用API取消采购订单，传递id数组
        const ids = this.selectedRow.map(row => row.id);
        API.suggestion.cancelOrder(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('采购订单取消成功')
            this.handleSearch()
          }
          this.cancelLoading = false
        }).catch(error => {
          this.cancelLoading = false
        })
      }).catch(() => {
        this.cancelLoading = false
      })
    },


    handleImport() {
      this.importLoading = true
      this.uploadVisible = true
      let {url,name} =getImportTempletsUrl('1001');
      this.templateUrl.url = url;
      this.templateUrl.name = name;
      this.$nextTick(() => {
        let url = API.suggestion.importFile();
        let accept = '.xls,.xlsx';
        this.$refs.upload.init(url,accept);
        this.importLoading = false
      })
    },

    handleExport() {
      this.exportLoading = true
      this.searchForm.idList = this.selectedRow.map(item => item.id);
      API.suggestion.exportFile(this.searchForm).then(({data}) => {
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
            a.download = `采购建议单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
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

    handleFormSubmit(formData) {
      // 处理表单提交
      this.$message.success('保存成功')
      this.dialogVisible = false
      this.handleSearch()
    },
    supplierFilterHandle(val) {
      if (val) {
        this.supplierOptionsForSelect = this.suppliers.filter((item => {
          if (!!~item.supplierCode.indexOf(val) || !!~item.supplierCode.toUpperCase().indexOf(val.toUpperCase()) || !!~item.supplierName.indexOf(val) || !!~item.supplierName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      } else {
        this.supplierOptionsForSelect = this.suppliers;
      }
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

