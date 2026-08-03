<template>
  <div class="cost-detail-container">
    <!-- 主要内容区域：左右布局 -->
    <div class="main-content">
      <!-- 左侧：应收费用 -->
      <div class="left-section receivable-section">
        <div class="section-title receivable-title">
          <el-button type="primary" size="mini" @click="addReceivableRow">+</el-button>
          <h3>应收费用</h3>
        </div>
        <div class="table-container">
          <u-table
            size="mini"
            :data="receivableData"
            border
            :row-height="30"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            style="width: 100%"
            empty-text="暂无数据">
            <u-table-column prop="index" label="序号" width="60" align="center"></u-table-column>
            <u-table-column prop="feeName" align="center" label="费项名称" min-width="150" show-overflow-tooltip></u-table-column>
            <u-table-column prop="amount" align="center" label="费用" width="200">
              <template slot-scope="scope">
                <span v-if="!scope.row.editing">{{ scope.row.amount }}</span>
                <u-input-number v-else v-model="scope.row.amount" size="mini" :min="0" :precision="2" style="width: 100%"></u-input-number>
              </template>
            </u-table-column>
            <u-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                  <el-button size="mini" type="text" v-if="!scope.row.editing" @click="editReceivableRow(scope.row)">修改</el-button>
                  <el-button size="mini" type="text" v-else  @click="saveReceivableRow(scope.row)">保存</el-button>
                  <el-button size="mini" type="text"  @click="viewReceivableRow(scope.row)">查看</el-button>
                  <el-button size="mini" type="text" class="delete-btn" @click="deleteReceivableRow(scope.row)">删除</el-button>
              </template>
            </u-table-column>
          </u-table>
        </div>
      </div>
      <!-- 右侧：应付费用 -->
      <div class="right-section payable-section">
        <div class="section-title payable-title">
          <el-button type="primary" size="mini" @click="addPayableRow">+</el-button>
          <h3>应付费用</h3>
        </div>
        <div class="table-container">
          <u-table
            :data="payableData"
            border
            size="mini"
            :row-height="30"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            style="width: 100%"
            empty-text="暂无数据">
            <u-table-column prop="index" label="序号" width="60" align="center"></u-table-column>
            <u-table-column prop="feeName" align="center" label="费项名称" min-width="150" show-overflow-tooltip></u-table-column>
            <u-table-column prop="amount" align="center" label="费用" width="200">
              <template slot-scope="scope">
                <span v-if="!scope.row.editing">{{ scope.row.amount }}</span>
                <el-input-number v-else v-model="scope.row.amount" size="mini" :min="0" :precision="2" style="width: 100%"></el-input-number>
              </template>
            </u-table-column>
            <u-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                  <el-button type="text" size="mini" v-if="!scope.row.editing"  @click="editPayableRow(scope.row)">修改</el-button>
                  <el-button type="text" size="mini" v-else  @click="savePayableRow(scope.row)">保存</el-button>
                  <el-button type="text" size="mini" @click="viewPayableRow(scope.row)">查看</el-button>
                  <el-button type="text" size="mini" class="delete-btn" @click="deletePayableRow(scope.row)">删除</el-button>
              </template>
            </u-table-column>
          </u-table>
        </div>
      </div>
    </div>

    <!-- 底部：统计信息 -->
    <div class="summary-section">
      <div class="summary-item">
        <div class="summary-label">应收总计</div>
        <div class="summary-value">¥{{ formatNumber(receivableTotal) }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">应付总计</div>
        <div class="summary-value">¥{{ formatNumber(payableTotal) }}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">利润</div>
        <div class="summary-value" :class="profitClass">¥{{ formatNumber(profit) }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { UTable, UTableColumn } from 'umy-ui'
import ShowDialog from "@/views/purchase/inOrders/showDialog";
export default {
  name: "costDetail",
  data() {
    return {
      // 应收费用数据
      receivableData: [
        { index: 1, feeName: '采购货款', amount: 4564, editing: false },
        { index: 2, feeName: '自提运费', amount: 4564, editing: false }
      ],
      // 应付费用数据
      payableData: [
        { index: 1, feeName: '采购货款', amount: 4564, editing: false },
        { index: 2, feeName: '自提运费', amount: 4564, editing: false }
      ],
      // 应收总计
      receivableTotal: 456456456,
      // 应付总计
      payableTotal: 456456456,
      // 利润
      profit: 456456456
    }
  },
  computed: {
    profitClass() {
      return this.profit >= 0 ? 'profit-positive' : 'profit-negative'
    }
  },
  components:{
    UTable,
    UTableColumn
  },
  methods: {
    init(orderData) {
      // 这里可以添加加载费用详情数据的逻辑
      console.log('costDetail init called with:', orderData);
      
      // 模拟数据加载
      if (orderData && orderData.id) {
        // 实际开发中这里应该调用API加载数据
        this.receivableTotal = 9128;
        this.payableTotal = 9128;
        this.profit = 0;
        this.calculateProfit();
      }
    },
    // 格式化数字显示
    formatNumber(value) {
      return parseFloat(value || 0).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    // 应收费用相关方法
    addReceivableRow() {
      const newIndex = this.receivableData.length + 1;
      this.receivableData.push({
        index: newIndex,
        feeName: '新费用项',
        amount: 0,
        editing: true
      });
    },
    editReceivableRow(row) {
      row.editing = true;
    },
    saveReceivableRow(row) {
      row.editing = false;
      this.calculateReceivableTotal();
    },
    viewReceivableRow(row) {
      this.$message({
        message: `查看应收费用: ${row.feeName}`,
        type: 'info'
      });
    },
    deleteReceivableRow(row) {
      this.$confirm(`确定要删除"${row.feeName}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.receivableData.indexOf(row);
        if (index !== -1) {
          this.receivableData.splice(index, 1);
          // 重新排序
          this.receivableData.forEach((item, idx) => {
            item.index = idx + 1;
          });
          this.calculateReceivableTotal();
        }
      });
    },
    calculateReceivableTotal() {
      this.receivableTotal = this.receivableData.reduce((total, item) => {
        return total + parseFloat(item.amount || 0);
      }, 0);
      this.calculateProfit();
    },

    // 应付费用相关方法
    addPayableRow() {
      const newIndex = this.payableData.length + 1;
      this.payableData.push({
        index: newIndex,
        feeName: '新费用项',
        amount: 0,
        editing: true
      });
    },
    editPayableRow(row) {
      row.editing = true;
    },
    savePayableRow(row) {
      row.editing = false;
      this.calculatePayableTotal();
    },
    viewPayableRow(row) {
      this.$message({
        message: `查看应付费用: ${row.feeName}`,
        type: 'info'
      });
    },
    deletePayableRow(row) {
      this.$confirm(`确定要删除"${row.feeName}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.payableData.indexOf(row);
        if (index !== -1) {
          this.payableData.splice(index, 1);
          // 重新排序
          this.payableData.forEach((item, idx) => {
            item.index = idx + 1;
          });
          this.calculatePayableTotal();
        }
      });
    },
    calculatePayableTotal() {
      this.payableTotal = this.payableData.reduce((total, item) => {
        return total + parseInt(item.amount || 0);
      }, 0);
      this.calculateProfit();
    },

    // 计算利润
    calculateProfit() {
      this.profit = this.receivableTotal - this.payableTotal;
    }
  }
}
</script>
<style scoped>
.cost-detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域：左右布局 */
.main-content {
  display: flex;
  gap: 20px;
  flex: 1;
  margin-bottom: 20px;
}

/* 左侧和右侧区域共用样式 */
.left-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
}

/* 标题区域 */
.section-title {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.section-title h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-left: 10px;
}
.receivable-title {
  background-color: #f0f9ff; /* 浅蓝色背景 */
  color: #333;
}

.payable-title {
  background-color: #fef0f0; /* 浅红色背景 */
  color: #333;
}


/* 表格容器 */
.table-container {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}


.delete-btn {
  color: #f56c6c;
  padding: 2px 8px;
  min-width: 40px;
}

/* 统计信息区域 */
.summary-section {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.summary-item {
  text-align: center;
  padding: 0 20px;
}
.summary-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}
.summary-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  .left-section,
  .right-section {
    width: 100%;
  }
}
</style>
