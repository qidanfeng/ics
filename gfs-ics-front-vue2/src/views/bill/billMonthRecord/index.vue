<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
        <el-row :gutter="10">
        <el-col :span="6">
          <el-date-picker
            size="mini"
            v-model="billMonthRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始账单月份"
            end-placeholder="结束账单月份"
            value-format="yyyy-MM"
            format="yyyy-MM"
            style="width: 100%"
          />
<!--          <el-date-picker-->
<!--            size="mini" style="width: 100%"-->
<!--            v-model="createdTimeRange"-->
<!--            :clearable="false"-->
<!--            type="datetimerange"-->
<!--            range-separator="至"-->
<!--            start-placeholder="创建开始时间"-->
<!--            end-placeholder="创建结束时间"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            format="yyyy-MM-dd HH:mm:ss"-->
<!--          />-->
        </el-col>
        <el-col :span="4">
          <el-input size="mini" style="width: 100%"  v-model="searchForm.billNumber" placeholder="请输入月结账单号" clearable />
        </el-col>
          <el-col :span="4">
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
        <el-col :span="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.statusList" placeholder="请选择状态" clearable multiple>
            <el-option
              v-for="item in billMonthRecordStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="8">
          <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
          <el-button size="mini" @click="handleReset">重置</el-button>
          <el-button size="mini" v-if="isAuth('ics:billMonthRecord:generate')" type="success" icon="el-icon-document" @click="showGenerateMonthBill">生成月结账单</el-button>
          <el-button size="mini" v-if="isAuth('ics:billMonthRecord:reGenerate')" type="primary" :disabled="selectedRow.length === 0" :loading="reGenerateLoading" @click="handleReGenerateMonthBill()">重新月结</el-button>
          <el-button size="mini" v-if="isAuth('ics:billMonthRecord:confirm')" type="primary" :disabled="selectedRow.length === 0" :loading="confirmLoading" @click="handleConfirm()">确认</el-button>
          <el-button size="mini" v-if="isAuth('ics:billMonthRecord:export')" :loading="exportLoading" @click="handleExport">导出</el-button>
        </el-col>
        </el-row>
    </el-card>
    <!-- 数据表格 -->
    <el-card class="table-card">
      <u-table
        :data="tableData"
        border
        size="mini"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <u-table-column type="index" label="序号" width="60" align="center" />
        <u-table-column type="selection" width="55" align="center" fixed="left" style="background-color: white"/>
        <u-table-column prop="billNumber" label="月结账单号" width="160" align="center" show-overflow-tooltip />
        <u-table-column prop="billMonth" label="账单月份" width="120" align="center" />
        <u-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
<!--        <u-table-column prop="projectName" label="货主" min-width="150" align="center" show-overflow-tooltip />-->
<!--        <u-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />-->
        <u-table-column prop="orderCount" label="订单个数" width="100" align="center"></u-table-column>
        <u-table-column prop="totalAmount" label="应收总金额(元)" width="120" align="right">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold">{{ scope.row.arTotalAmount.toFixed(2) }}</span>
          </template>
        </u-table-column>
        <u-table-column prop="totalAmount" label="应付总金额(元)" width="120" align="right">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold">{{ scope.row.apTotalAmount.toFixed(2) }}</span>
          </template>
        </u-table-column>
<!--        <u-table-column prop="taxAmount" label="税额(元)" width="120" align="right">-->
<!--          <template slot-scope="scope">-->
<!--            {{ scope.row.taxAmount.toFixed(2) }}-->
<!--          </template>-->
<!--        </u-table-column>-->
        <u-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.statusName)" size="mini">
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </u-table-column>
        <u-table-column prop="confirmTime" label="确认时间" width="200" align="center" />
        <u-table-column prop="createdBy" label="创建人" width="150" align="center" show-overflow-tooltip/>
        <u-table-column prop="createdTime" label="创建时间" width="200" align="center" />
        <u-table-column prop="lastModifiedBy" label="修改人" width="150" align="center" show-overflow-tooltip/>
        <u-table-column prop="lastModifiedTime" label="修改时间" width="200" align="center" />
        <u-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </u-table-column>
      </u-table>

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

    <!-- 订单费用明细组件 -->
    <record-detail
      ref="recordDetailRef"
      @export="exportDetail"
    />

    <!-- 生成月结账单对话框 -->
    <el-dialog
      title="生成月结账单"
      :visible.sync="generateMonthBillVisible"
      ref="generateMonthBillRef"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="generateMonthBillForm" label-width="100px" size="mini">
        <el-form-item label="账单月份" required>
          <el-date-picker
            v-model="generateMonthBillForm.billMonth"
            type="month"
            placeholder="请选择账单月份"
            value-format="yyyy-MM"
            format="yyyy-MM"
            style="width: 100%"
          />
        </el-form-item>
<!--        <el-form-item label="备注">-->
<!--          <el-input-->
<!--            v-model="generateMonthBillForm.remarks"-->
<!--            type="textarea"-->
<!--            :rows="3"-->
<!--            placeholder="请输入备注信息（选填）"-->
<!--          />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button @click="generateMonthBillVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGenerateMonthBill" :loading="generating">确定生成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import RecordDetail from './recordDetail.vue'
import API from "@/api";
import {mapGetters} from "vuex";
import {reGenerate} from "@/api/modules/bill/billMonthRecord";

export default {
  name: 'DailyBill',
  components: {
    UTable,
    UTableColumn,RecordDetail
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      reGenerateLoading: false,
      confirmLoading: false,
      searchForm: {
        statusList: [],
        billMonth: '',
        supplierId: '',
        billNumber: null
      },
      billMonthRange: [],
      billMonthRecordStatusOptions: [],
      selectedRow: [],
      tableData: [],
      supplierOptionsForSelect: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      detailVisible: false,
      currentBill: null,
      orderDetailData: [],
      generateMonthBillVisible: false,
      generating: false,
      generateMonthBillForm: {
        billMonth: '',
        remarks: ''
      },
    }
  },
  mounted() {
    // 页面初始化时加载下拉框数据
    this.loadBillMonthRecordStatusList();
    },
  activated() {
    this.handleSearch();
  },
  computed: {
    ...mapGetters([
      'client',
      'suppliers',
      'warehouses',
      'projects'
    ])
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // 设置时间范围参数到searchForm，与suggestion组件保持一致
        if (this.billMonthRange && this.billMonthRange.length === 2) {
          this.searchForm.billMonthStart = this.billMonthRange[0]
          this.searchForm.billMonthEnd = this.billMonthRange[1]
        }else {
          this.searchForm.billMonthStart = null;
          this.searchForm.billMonthEnd = null;
        }

        // 设置分页参数
        this.searchForm.page = this.pagination.page;
        this.searchForm.limit = this.pagination.size;
        this.searchForm.clientId= this.client.id;

        const { data } = await API.billMonthRecord.getListPage(this.searchForm)
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

    showDetail(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.recordDetailRef.init(row)
      })
    },

    handleSearch() {
      this.loadData()
      this.$message.success('查询完成')
    },

    handleReset() {
      this.searchForm = {
        statusList: [],
        billMonth: '',
        supplierId: '',
        billNumber: null
      }
      this.loadData()
    },

    loadBillMonthRecordStatusList(){
      API.orderConstant.getBillMonthRecordStatusList().then(({data})=>{
        if(data.data && data.code ===0 ){
          this.billMonthRecordStatusOptions = data.data;
        }
      }).catch(error=>{

      })
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

    exportDetail() {
      this.$message.success('导出明细成功（演示）')
    },

    showGenerateMonthBill() {
      this.generateMonthBillForm = {
        billMonth: '',
        remarks: '',
        clientId:this.client.id
      }
      // 默认选择上个月
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const year = lastMonth.getFullYear()
      const month = (lastMonth.getMonth() + 1).toString().padStart(2, '0')
      this.generateMonthBillForm.billMonth = `${year}-${month}`

      this.generateMonthBillVisible = true
    },

    handleGenerateMonthBill() {
      if (!this.generateMonthBillForm.billMonth) {
        this.$message.warning('请选择账单月份')
        return
      }

      this.$confirm(`确认生成 ${this.generateMonthBillForm.billMonth} 的月结账单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.generating = true
        API.billMonthRecord.generate(this.generateMonthBillForm).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('生成月结账单成功')
            this.generateMonthBillVisible = false;
            this.handleSearch()
          }
          this.generating = false
        }).catch(error => {
          this.generating = false
        })
      }).catch(() => {})
    },
    // 重新月结
    handleReGenerateMonthBill() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要重新月结的月结账单')
        return
      }
      this.reGenerateLoading = true
      const billNumbers = this.selectedRow.map(row => row.billNumber).join('、')
      this.$confirm(`重新月结：${billNumbers}？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const idList = this.selectedRow.map(row => row.id)
        API.billMonthRecord.reGenerate(idList).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('重新月结成功')
            this.handleSearch()
          }
          this.reGenerateLoading = false
        }).catch(error => {
          this.reGenerateLoading = false
        })
      }).catch(() => {
        this.reGenerateLoading = false
      })
    },
    // 确认
    handleConfirm() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要确认的月结账单')
        return
      }
      this.confirmLoading = true
      const billNumbers = this.selectedRow.map(row => row.billNumber).join('、')
      this.$confirm(`确认月结账单：${billNumbers}？`, '确认提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const idList = this.selectedRow.map(row => row.id)
        API.billMonthRecord.confirm(idList).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('确认成功')
            this.handleSearch()
          }
          this.confirmLoading = false
        }).catch(error => {
          this.confirmLoading = false
        })
      }).catch(() => {
        this.confirmLoading = false
      })
    },
    handleExport() {
      this.exportLoading = true
      // 设置选中的ID列表
      this.searchForm.idList = this.selectedRow.map(item => item.id)

      API.billMonthRecord.exportFile(this.searchForm).then(({data}) => {
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
            a.download = `月结账单_${year}${month}${day}${hour}${minute}${second}.xlsx`;
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

    getStatusType(statusName) {
      const map = {
        '待确认': 'warning',
        '已确认': 'success',
        'RECONCILED': 'info'
      }
      return map[statusName] || 'info'
    },

    getStatusName(status) {
      const map = {
        'PENDING': '待确认',
        'CONFIRMED': '已确认',
        'RECONCILED': '已对账'
      }
      return map[status] || status
    },
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.loadData()
    },

    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadData()
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 15px;
}

.table-card {
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}
</style>
