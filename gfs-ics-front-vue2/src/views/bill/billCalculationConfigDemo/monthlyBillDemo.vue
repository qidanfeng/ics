<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" size="mini" inline>
        <el-form-item label="账单月份">
          <el-date-picker
            v-model="searchForm.billMonth"
            type="month"
            placeholder="选择月份"
            value-format="yyyy-MM"
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
            <el-option label="已开票" value="INVOICED" />
            <el-option label="已付款" value="PAID" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
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
        <el-table-column prop="billNo" label="月结账单号" width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="billMonth" label="账单月份" width="120" align="center" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="dailyBillCount" label="日结单数量" width="110" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="showDetail(scope.row)">{{ scope.row.dailyBillCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单总数" width="100" align="center" />
        <el-table-column prop="totalAmount" label="总金额(元)" width="130" align="right">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold; font-size: 14px">{{ scope.row.totalAmount.toFixed(2) }}</span>
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
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" @click="handleConfirm(scope.row)" v-if="scope.row.status === 'PENDING'">确认</el-button>
            <el-button type="text" size="small" @click="handleInvoice(scope.row)" v-if="scope.row.status === 'CONFIRMED'">开票</el-button>
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

    <!-- 详情对话框 -->
    <el-dialog
      title="月结账单详情 - 日结账单明细"
      :visible.sync="detailVisible"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div v-if="currentBill" class="detail-header">
        <el-descriptions :column="4" border size="small">
          <el-descriptions-item label="账单号">{{ currentBill.billNo }}</el-descriptions-item>
          <el-descriptions-item label="账单月份">{{ currentBill.billMonth }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ currentBill.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="货主">{{ currentBill.projectName }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ currentBill.warehouseName }}</el-descriptions-item>
          <el-descriptions-item label="日结单数">{{ currentBill.dailyBillCount }}</el-descriptions-item>
          <el-descriptions-item label="订单总数">{{ currentBill.orderCount }}</el-descriptions-item>
          <el-descriptions-item label="总金额">{{ currentBill.totalAmount.toFixed(2) }} 元</el-descriptions-item>
          <el-descriptions-item label="税额">{{ currentBill.taxAmount.toFixed(2) }} 元</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentBill.status)" size="mini">
              {{ getStatusName(currentBill.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 汇总统计 -->
        <div class="summary-stats">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">日结账单总额</div>
                <div class="stat-value">{{ currentBill.totalAmount.toFixed(2) }} 元</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">平均日结金额</div>
                <div class="stat-value">{{ (currentBill.totalAmount / currentBill.dailyBillCount).toFixed(2) }} 元</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">日均订单数</div>
                <div class="stat-value">{{ Math.round(currentBill.orderCount / currentBill.dailyBillCount) }} 单</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">平均订单金额</div>
                <div class="stat-value">{{ (currentBill.totalAmount / currentBill.orderCount).toFixed(2) }} 元</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-table
        :data="dailyBillDetailData"
        border
        size="mini"
        style="width: 100%; margin-top: 15px"
        max-height="500"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="dailyBillNo" label="日结账单号" width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="billDate" label="账单日期" width="120" align="center" />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="orderCount" label="订单数量" width="100" align="center" />
        <el-table-column prop="totalAmount" label="总金额(元)" width="130" align="right">
          <template slot-scope="scope">
            <span style="color: #E6A23C; font-weight: bold">{{ scope.row.totalAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额(元)" width="110" align="right">
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
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewDailyBill(scope.row)">查看日结单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportDetail">导出明细</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MonthlyBill',
  data() {
    return {
      loading: false,
      searchForm: {
        billMonth: '',
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
      dailyBillDetailData: [],

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
          billNo: 'MTB202603001',
          billMonth: '2026-03',
          supplierId: '1001',
          supplierName: '优质供应商有限公司',
          projectId: '2001',
          projectName: '京东自营项目',
          warehouseCode: 'WH-BJ-001',
          warehouseName: '北京大兴仓',
          dailyBillCount: 28,
          orderCount: 520,
          totalAmount: 356800.50,
          taxAmount: 46384.07,
          status: 'CONFIRMED',
          createdTime: '2026-03-31 23:00:00'
        },
        {
          id: '2',
          billNo: 'MTB202603002',
          billMonth: '2026-03',
          supplierId: '1002',
          supplierName: '快捷物流供应商',
          projectId: '2002',
          projectName: '天猫旗舰店项目',
          warehouseCode: 'WH-SH-001',
          warehouseName: '上海浦东仓',
          dailyBillCount: 30,
          orderCount: 680,
          totalAmount: 425600.80,
          taxAmount: 55328.10,
          status: 'PENDING',
          createdTime: '2026-03-31 23:00:00'
        },
        {
          id: '3',
          billNo: 'MTB202602001',
          billMonth: '2026-02',
          supplierId: '1003',
          supplierName: '华东配送中心',
          projectId: '2003',
          projectName: '拼多多官方店',
          warehouseCode: 'WH-GZ-001',
          warehouseName: '广州白云仓',
          dailyBillCount: 25,
          orderCount: 450,
          totalAmount: 289500.30,
          taxAmount: 37635.04,
          status: 'INVOICED',
          createdTime: '2026-02-28 23:00:00'
        },
        {
          id: '4',
          billNo: 'MTB202601001',
          billMonth: '2026-01',
          supplierId: '1001',
          supplierName: '优质供应商有限公司',
          projectId: '2001',
          projectName: '京东自营项目',
          warehouseCode: 'WH-BJ-001',
          warehouseName: '北京大兴仓',
          dailyBillCount: 31,
          orderCount: 620,
          totalAmount: 398200.00,
          taxAmount: 51766.00,
          status: 'PAID',
          createdTime: '2026-01-31 23:00:00'
        }
      ]
      this.pagination.total = 4
      this.loading = false
    },

    showDetail(row) {
      this.currentBill = row
      this.detailVisible = true
      // 模拟日结账单明细数据
      this.dailyBillDetailData = []
      for (let i = 1; i <= row.dailyBillCount; i++) {
        const day = i.toString().padStart(2, '0')
        this.dailyBillDetailData.push({
          id: `${row.id}-${i}`,
          dailyBillNo: `DRB${row.billMonth.replace('-', '')}${day}01`,
          billDate: `${row.billMonth}-${day}`,
          warehouseName: row.warehouseName,
          orderCount: Math.floor(Math.random() * 30) + 10,
          totalAmount: Math.random() * 20000 + 10000,
          taxAmount: 0,
          status: 'CONFIRMED',
          createdTime: `${row.billMonth}-${day} 23:00:00`
        })
      }
      // 计算税额
      this.dailyBillDetailData.forEach(item => {
        item.taxAmount = item.totalAmount * 0.13
        item.totalAmount = parseFloat(item.totalAmount.toFixed(2))
        item.taxAmount = parseFloat(item.taxAmount.toFixed(2))
      })
    },

    viewDailyBill(row) {
      this.$message.info(`跳转到日结账单：${row.dailyBillNo}（演示）`)
      // 实际项目中可以跳转到日结账单页面并自动查询该单号
    },

    handleSearch() {
      this.loadData()
      this.$message.success('查询完成')
    },

    handleReset() {
      this.searchForm = {
        billMonth: '',
        supplierId: '',
        projectId: '',
        status: ''
      }
      this.loadData()
    },

    handleConfirm(row) {
      this.$confirm('确认该月结账单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 'CONFIRMED'
        this.$message.success('确认成功')
      }).catch(() => {})
    },

    handleInvoice(row) {
      this.$confirm('确认该月结账单已开票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 'INVOICED'
        this.$message.success('开票成功')
      }).catch(() => {})
    },

    handleExport(row) {
      this.$message.success('导出成功（演示）')
    },

    exportDetail() {
      this.$message.success('导出明细成功（演示）')
    },

    getStatusType(status) {
      const map = {
        'PENDING': 'warning',
        'CONFIRMED': 'success',
        'INVOICED': 'primary',
        'PAID': 'info'
      }
      return map[status] || 'info'
    },

    getStatusName(status) {
      const map = {
        'PENDING': '待确认',
        'CONFIRMED': '已确认',
        'INVOICED': '已开票',
        'PAID': '已付款'
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

.detail-header {
  margin-bottom: 15px;
}

.summary-stats {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #E6A23C;
}
</style>
