<template>
  <div class="cost-detail-container">
    <div style="margin-bottom: 4px;">
      <el-button
        v-if="isAuth('ics:inOrders:costDetail:reCalc')"
        type="primary"
        size="mini"
        @click="reCalcCost">
        <i class="el-icon-refresh" style="margin-right: 4px;"></i>
        重新自动计算费用
        <el-tooltip placement="top" content="根据计费配置重新自动计算费用，手工创建的费用不受影响">
          <i class="el-icon-warning-outline section-icon"></i>
        </el-tooltip>
      </el-button>
    </div>
    <!-- 主要内容区域：左右布局 -->
    <div class="main-content">
      <!-- 左侧：应收费用 -->
      <div class="left-section receivable-section">
        <div class="section-title receivable-title">
          <el-button v-if="isAuth('ics:inOrders:costDetail:add')" type="primary" size="mini" @click="addReceivableRow">+</el-button>
          <h3>应收费用</h3>
        </div>
        <div class="table-container">
          <u-table
            size="mini"
            :data="receivableData"
            height="400"
            :row-height="30"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            style="width: 100%"
            empty-text="暂无数据">
            <u-table-column type="index" label="序号" width="60" align="center"></u-table-column>
            <u-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.costItemName }}</span>
                <el-select v-else size="mini" @change="value => costItemCodeHandle(value,scope.row)" style="width:100%" v-model="scope.row.costItemCode" filterable placeholder="请选择费项">
                  <el-option
                    v-for="item in costItemOptions"
                    :key="item.costItemCode"
                    :label="item.costItemName"
                    :value="item.costItemCode">
                    <span style="float: left">{{ item.costItemCode }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
                  </el-option>
                </el-select>
              </template>
            </u-table-column>
            <u-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template slot-scope="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.totalPrice }}</span>
                <el-input-number v-else v-model="scope.row.totalPrice" size="mini" :min="0" :precision="2" style="width: 100%"></el-input-number>
              </template>
            </u-table-column>
            <u-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
<!--                <el-button size="mini" type="text" v-if="!scope.row.editing" @click="editReceivableRow(scope.row)">修改</el-button>-->
                <el-button v-if="isAuth('ics:inOrders:costDetail:add') && scope.row.tempNewData" size="mini" type="text"  @click="saveReceivableRow(scope.row)">保存</el-button>
                <el-button size="mini" type="text" v-else @click="viewReceivableRow(scope.row)">查看</el-button>
                <el-button v-if="isAuth('ics:inOrders:costDetail:add') && scope.row.tempNewData" size="mini" type="text"  class="delete-btn" @click="deleteReceivableRow(scope.row)">删除</el-button>
              </template>
            </u-table-column>
          </u-table>
        </div>
      </div>
      <!-- 右侧：应付费用 -->
      <div class="right-section payable-section">
        <div class="section-title payable-title">
          <el-button v-if="isAuth('ics:inOrders:costDetail:add')" type="primary" size="mini" @click="addPayableRow">+</el-button>
          <h3>应付费用</h3>
        </div>
        <div class="table-container">
          <u-table
            :data="payableData"
            size="mini"
            height="400"
            :row-height="30"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            style="width: 100%"
            empty-text="暂无数据">
            <u-table-column type="index" label="序号" width="60" align="center"></u-table-column>
            <u-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.costItemName }}</span>
                <el-select v-else size="mini" @change="value => costItemCodeHandle(value,scope.row)" style="width:100%" v-model="scope.row.costItemCode" filterable placeholder="请选择费项">
                  <el-option
                    v-for="item in costItemOptions"
                    :key="item.costItemCode"
                    :label="item.costItemName"
                    :value="item.costItemCode">
                    <span style="float: left">{{ item.costItemCode }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
                  </el-option>
                </el-select>
              </template>
            </u-table-column>
            <u-table-column prop="totalPrice" align="center" label="费用" width="200">
              <template slot-scope="scope">
                <span v-if="!scope.row.tempNewData">{{ scope.row.totalPrice }}</span>
                <el-input-number v-else v-model="scope.row.totalPrice" size="mini" :min="0" :precision="2" style="width: 100%"></el-input-number>
              </template>
            </u-table-column>
            <u-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
<!--                <el-button type="text" size="mini" v-if="!scope.row.editing"  @click="editPayableRow(scope.row)">修改</el-button>-->
                <el-button v-if="isAuth('ics:inOrders:costDetail:add') && scope.row.tempNewData" type="text" size="mini"   @click="savePayableRow(scope.row)">保存</el-button>
                <el-button type="text" size="mini" v-else @click="viewPayableRow(scope.row)">查看</el-button>
                <el-button v-if="isAuth('ics:inOrders:costDetail:add') && scope.row.tempNewData" type="text" size="mini"  class="delete-btn" @click="deletePayableRow(scope.row)">删除</el-button>
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
    <cost-detail-info ref="costDetailInfoRef" @refreshData="refreshData"/>
  </div>
</template>
<script>
import { UTable, UTableColumn } from 'umy-ui'
import ShowDialog from "@/views/purchase/inOrders/showDialog";
import API from "@/api";
import CostDetailInfo from "./costDetailInfo";
import {billSave} from "@/api/modules/purchase/inOrder";
export default {
  name: "CostDetail",
  data() {
    return {
      orderNumber:"",
      // 应收费用数据
      receivableData: [],
      // 应付费用数据
      payableData: [],
      // 应收总计
      receivableTotal: 0,
      // 应付总计
      payableTotal: 0,
      // 利润
      profit: 0,
      costItemOptions:[],
    }
  },
  computed: {
    profitClass() {
      return this.profit >= 0 ? 'profit-positive' : 'profit-negative'
    }
  },
  components:{
    UTable,
    UTableColumn,
    CostDetailInfo,
  },
  methods: {
    /**
     * 初始化组件数据
     * @param {Object} data - 退供单详情数据
     */
    async init(data) {
      this.orderNumber = data.orderNumber;
      await this.loadBillData();
      this.loadAllCostItem();
      // 计算总计
      this.calculateReceivableTotal()
      this.calculatePayableTotal()

    },
    async refreshData() {
      await this.loadBillData();
      // 计算总计
      this.calculateReceivableTotal()
      this.calculatePayableTotal()

    },
    loadBillData(){
      return new Promise((resolve, reject) => {
        API.inOrder.getBillByOrderNumber(this.orderNumber).then(({data})=>{

          if(data.code == 0 && data.data){
            if(data.data.arDetailList){
              this.receivableData = data.data.arDetailList;
              this.receivableData.forEach((item, idx) => {
                item.index = idx + 1;
              });
            }
            if(data.data.apDetailList){
              this.payableData = data.data.apDetailList;
              this.payableData.forEach((item, idx) => {
                item.index = idx + 1;
              });
            }

          }
          resolve();
        }).catch(error=>{
          reject(error);
        })
      })
    },
    /**
     * 重置组件数据
     */
    resetData() {
      this.receivableData = []
      this.payableData = []
      this.receivableTotal = 0
      this.payableTotal = 0
      this.profit = 0
    },

    // 格式化数字显示
    formatNumber(value) {
      return parseFloat(value || 0).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    costItemCodeHandle(value,row){
      const item = this.costItemOptions.find(item=> item.costItemCode == value)
      if(item){
        row.costItemName = item.costItemName;
      }
    },
    loadAllCostItem(){
      API.billItemConfig.getAllCostItemCodeList().then(({data})=>{
        if(data.code == 0 && data.data){
          this.costItemOptions = data.data;
        }
      }).catch(error=>{

      })
    },
    reCalcCost() {
      this.$confirm(`确定重新自动计算费用吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.inOrder.billReCalc(this.orderNumber).then(async ({data})=>{
          if (data.code === 0) {
            this.$message.success('重新自动计算费用成功');
            await this.loadBillData();
            // 计算总计
            this.calculateReceivableTotal()
            this.calculatePayableTotal()
          }
        }).catch(error=>{

        })
      });
    },
    // 应收费用相关方法
    addReceivableRow() {
      const newIndex = this.receivableData.length + 1;
      this.receivableData.push({
        index: newIndex,
        tempNewData: true,
        totalPrice: 0,
        costType: 1,
        orderNumber: this.orderNumber,
        editing: true
      });
    },
    editReceivableRow(row) {
      row.editing = true;
    },
    saveReceivableRow(row) {
      row.editing = false;
      let api = null;
      if(row.id){
        api = API.inOrder.billUpdate([row]);
      }else {
        api = API.inOrder.billSave([row]);
        row.costPrice = row.totalPrice;
      }
      api.then(async ({data})=>{
        if (data.code === 0) {
          this.$message.success('保存成功');
          await this.loadBillData();
          this.calculateReceivableTotal();
        }
      }).catch(error=>{

      })

    },
    viewReceivableRow(row) {
      this.$refs.costDetailInfoRef.init(row);
    },
    deleteReceivableRow(row) {
      this.$confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
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
        return total + parseFloat(item.totalPrice || 0);
      }, 0);
      this.calculateProfit();
    },

    // 应付费用相关方法
    addPayableRow() {
      const newIndex = this.payableData.length + 1;
      this.payableData.push({
        index: newIndex,
        tempNewData: true,
        totalPrice: 0,
        costType: 2,
        orderNumber: this.orderNumber,
        editing: true
      });
    },
    editPayableRow(row) {
      row.editing = true;
    },
    savePayableRow(row) {
      row.editing = false;
      let api = null;
      if(row.id){
        api = API.inOrder.billUpdate([row]);
      }else {
        api = API.inOrder.billSave([row]);
        row.costPrice = row.totalPrice;
      }
      api.then(async ({data})=>{
        if (data.code === 0) {
          this.$message.success('保存成功');
          await this.loadBillData();
          this.calculatePayableTotal();
        }
      }).catch(error=>{

      })
    },
    viewPayableRow(row) {
      this.$refs.costDetailInfoRef.init(row);
    },
    deletePayableRow(row) {
      this.$confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
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
        return total + parseInt(item.totalPrice || 0);
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
.receivable-title h3 {
  color: #1890ff;
}
.payable-title {
  background-color: #fef0f0; /* 浅红色背景 */
  color: #333;
}
.payable-title h3 {
  color: #f5222d;
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
