<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" size="mini" inline>
        <el-form-item label="账单日期">
          <el-date-picker
            v-model="searchForm.billDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" placeholder="请选择" clearable style="width: 200px">
            <el-option
              v-for="item in supplierOptions"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货主">
          <el-select v-model="searchForm.projectId" placeholder="请选择" clearable style="width: 200px">
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账单状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 150px">
            <el-option label="待确认" value="PENDING" />
            <el-option label="已确认" value="CONFIRMED" />
            <el-option label="已对账" value="RECONCILED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" icon="el-icon-document" @click="showGenerateMonthBill">生成月结账单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="billNo" label="日结账单号" width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="billDate" label="账单日期" width="120" align="center" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="orderCount" label="订单数量" width="100" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="showDetail(scope.row)">{{ scope.row.orderCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额(元)" width="120" align="right">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold">{{ scope.row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额(元)" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.taxAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="mini">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="生成时间" width="160" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" @click="handleConfirm(scope.row)" v-if="scope.row.status === 'PENDING'">确认</el-button>
            <el-button type="text" size="small" @click="handleExport(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>

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
    <order-fee-detail
      :visible.sync="detailVisible"
      :bill-data="currentBill"
      :order-detail-data="orderDetailData"
      @export="exportDetail"
    />

    <!-- 生成月结账单对话框 -->
    <el-dialog
      title="生成月结账单"
      :visible.sync="generateMonthBillVisible"
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
        <el-form-item label="备注">
          <el-input
            v-model="generateMonthBillForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="generateMonthBillVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGenerateMonthBill" :loading="generating">确定生成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrderFeeDetail from './orderFeeDetail.vue'

export default {
  name: 'DailyBill',
  components: {
    OrderFeeDetail
  },
  data() {
    return {
      loading: false,
      searchForm: {
        billDate: '',
        supplierId: '',
        projectId: '',
        status: ''
      },
      tableData: [],
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

      // 静态选项
      supplierOptions: [
        { supplierId: '1001', supplierName: '优质供应商有限公司' },
        { supplierId: '1002', supplierName: '快捷物流供应商' },
        { supplierId: '1003', supplierName: '华东配送中心' }
      ],
      projectOptions: [
        { projectId: '2001', projectName: '京东自营项目' },
        { projectId: '2002', projectName: '天猫旗舰店项目' },
        { projectId: '2003', projectName: '拼多多官方店' }
      ]
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      // 模拟数据
      this.tableData = [
        {
          id: '1',
          billNo: 'DRB20260305001',
          billDate: '2026-03-05',
          supplierId: '1001',
          supplierName: '优质供应商有限公司',
          projectId: '2001',
          projectName: '京东自营项目',
          warehouseCode: 'WH-BJ-001',
          warehouseName: '北京大兴仓',
          orderCount: 15,
          totalAmount: 12580.50,
          taxAmount: 1635.47,
          status: 'CONFIRMED',
          createdTime: '2026-03-05 23:00:00'
        },
        {
          id: '2',
          billNo: 'DRB20260305002',
          billDate: '2026-03-05',
          supplierId: '1002',
          supplierName: '快捷物流供应商',
          projectId: '2002',
          projectName: '天猫旗舰店项目',
          warehouseCode: 'WH-SH-001',
          warehouseName: '上海浦东仓',
          orderCount: 23,
          totalAmount: 18650.80,
          taxAmount: 2424.60,
          status: 'PENDING',
          createdTime: '2026-03-05 23:00:00'
        },
        {
          id: '3',
          billNo: 'DRB20260304001',
          billDate: '2026-03-04',
          supplierId: '1003',
          supplierName: '华东配送中心',
          projectId: '2003',
          projectName: '拼多多官方店',
          warehouseCode: 'WH-GZ-001',
          warehouseName: '广州白云仓',
          orderCount: 18,
          totalAmount: 14320.30,
          taxAmount: 1861.64,
          status: 'RECONCILED',
          createdTime: '2026-03-04 23:00:00'
        }
      ]
      this.pagination.total = 3
      this.loading = false
    },

    showDetail(row) {
      this.currentBill = row
      this.detailVisible = true
      // 模拟订单费用明细数据
      this.orderDetailData = [
        {
          orderNo: 'ORD202603050001',
          orderType: '入库单',
          costItemName: '仓储保管费',
          productNumber: 'PRD-20260001',
          productName: '高端智能手机',
          quantity: 100,
          unit: '件',
          unitPrice: 2.5,
          amount: 250.00,
          taxRate: 0.13,
          taxAmount: 32.50,
          billingRule: '按件数计费',
          completeTime: '2026-03-05 10:30:00'
        },
        {
          orderNo: 'ORD202603050001',
          orderType: '入库单',
          costItemName: '装卸作业费',
          productNumber: 'PRD-20260001',
          productName: '高端智能手机',
          quantity: 100,
          unit: '件',
          unitPrice: 1.5,
          amount: 150.00,
          taxRate: 0.13,
          taxAmount: 19.50,
          billingRule: '按件数计费',
          completeTime: '2026-03-05 10:30:00'
        },
        {
          orderNo: 'ORD202603050002',
          orderType: '出库单',
          costItemName: '分拣作业费',
          productNumber: 'PRD-20260002',
          productName: '无线蓝牙耳机',
          quantity: 200,
          unit: '件',
          unitPrice: 0.8,
          amount: 160.00,
          taxRate: 0.13,
          taxAmount: 20.80,
          billingRule: '按件数计费',
          completeTime: '2026-03-05 14:20:00'
        },
        {
          orderNo: 'ORD202603050003',
          orderType: '调拨单',
          costItemName: '干线运输费',
          productNumber: 'PRD-20260003',
          productName: '智能手表',
          quantity: 50,
          unit: '件',
          unitPrice: 5.0,
          amount: 250.00,
          taxRate: 0.13,
          taxAmount: 32.50,
          billingRule: '按件数计费',
          completeTime: '2026-03-05 16:45:00'
        }
      ]
    },

    handleSearch() {
      this.loadData()
      this.$message.success('查询完成')
    },

    handleReset() {
      this.searchForm = {
        billDate: '',
        supplierId: '',
        projectId: '',
        status: ''
      }
      this.loadData()
    },

    handleConfirm(row) {
      this.$confirm('确认该日结账单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 'CONFIRMED'
        this.$message.success('确认成功')
      }).catch(() => {})
    },

    handleExport(row) {
      this.$message.success('导出成功（演示）')
    },

    exportDetail() {
      this.$message.success('导出明细成功（演示）')
    },

    showGenerateMonthBill() {
      this.generateMonthBillForm = {
        billMonth: '',
        remarks: ''
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
        // 模拟生成过程
        setTimeout(() => {
          this.generating = false
          this.generateMonthBillVisible = false
          this.$message.success(`月结账单生成成功：${this.generateMonthBillForm.billMonth}`)
          // 可以跳转到月结账单页面或刷新列表
        }, 1000)
      }).catch(() => {})
    },

    getStatusType(status) {
      const map = {
        'PENDING': 'warning',
        'CONFIRMED': 'success',
        'RECONCILED': 'info'
      }
      return map[status] || 'info'
    },

    getStatusName(status) {
      const map = {
        'PENDING': '待确认',
        'CONFIRMED': '已确认',
        'RECONCILED': '已对账'
      }
      return map[status] || status
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
