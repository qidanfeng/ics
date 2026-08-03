<template>
  <!-- 查看详情弹窗 -->
  <el-dialog
    title="查看"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    custom-class="dialog_customWidth"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <!-- 标签页区域 -->
    <el-tabs v-model="activeTab">
      <el-tab-pane label="退货明细" name="orderDetail">
       <order-detail v-if="activeTab === 'orderDetail'" ref="orderDetailRef"/>
      </el-tab-pane>
      <el-tab-pane label="实际退货明细" name="actualDetail">
        <actual-detail v-if="activeTab === 'actualDetail'" ref="actualDetailRef"/>
      </el-tab-pane>
      <el-tab-pane label="费用详情" name="costDetail">
        <cost-detail v-if="activeTab === 'costDetail'" ref="costDetailRef"/>
      </el-tab-pane>
      <el-tab-pane label="下发记录" name="issueRecord">
        <issue-record v-if="activeTab === 'issueRecord'" ref="issueRecordRef"/>
      </el-tab-pane>
      <el-tab-pane label="订单状态记录" name="statusRecord">
       <status-record v-if="activeTab === 'statusRecord'" ref="statusRecordRef"/>
      </el-tab-pane>
      <el-tab-pane label="回调记录" name="callBackRecord">
        <call-back-record v-if="activeTab === 'callBackRecord'" ref="callBackRecordRef"/>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import OrderDetail from "./components/showDialog/orderDetail";
import ActualDetail from "./components/showDialog/actualDetail";
import StatusRecord from "./components/showDialog/statusRecord";
import issueRecord from "./components/showDialog/issueRecord";
import CallBackRecord from "./components/showDialog/callBackRecord"
import CostDetail from "./components/showDialog/costDetail"
export default {
  name: 'ShowDialog',
  components: {
    OrderDetail,
    ActualDetail,
    StatusRecord,
    issueRecord,
    CallBackRecord,
    CostDetail
  },

  data() {
    return {
      dialogVisible: false,
      activeTab: 'orderDetail',
      submitting: false,
      selectedRows: [],
      initData: null, // 存储初始化数据
    }
  },

  watch: {
    /**
     * 监听activeTab变化，切换tab时初始化对应组件
     */
    activeTab(newTab, oldTab) {
      if (this.initData) {
        this.$nextTick(() => {
          this.initActiveComponent(this.initData)
        })
      }
    }
  },
  methods: {
    /**
     * 初始化弹窗数据
     * @param {Object} data - 退供单详情数据
     */
    init(data) {
      // 显示弹窗
      this.dialogVisible = true

      // 重置到默认标签页
      this.activeTab = 'orderDetail'

      // 存储初始化数据
      this.initData = data

      // 初始化当前激活的子组件数据
      this.$nextTick(() => {
        this.initActiveComponent(data)
      })
    },

    /**
     * 初始化当前激活的子组件
     * @param {Object} data - 退供单详情数据
     */
    initActiveComponent(data) {
      switch (this.activeTab) {
        case 'orderDetail':
          if (this.$refs.orderDetailRef && this.$refs.orderDetailRef.init) {
            this.$refs.orderDetailRef.init(data)
          }
          break
        case 'actualDetail':
          if (this.$refs.actualDetailRef && this.$refs.actualDetailRef.init) {
            this.$refs.actualDetailRef.init(data)
          }
          break
        case 'costDetail':
          if (this.$refs.costDetailRef && this.$refs.costDetailRef.init) {
            this.$refs.costDetailRef.init(data);
          }
          break;
        case 'issueRecord':
          if (this.$refs.issueRecordRef && this.$refs.issueRecordRef.init) {
            this.$refs.issueRecordRef.init(data)
          }
          break
        case 'statusRecord':
          if (this.$refs.statusRecordRef && this.$refs.statusRecordRef.init) {
            this.$refs.statusRecordRef.init(data)
          }
          break
        case 'callBackRecord':
          if (this.$refs.callBackRecordRef && this.$refs.callBackRecordRef.init) {
            this.$refs.callBackRecordRef.init(data);
          }
          break;
      }
    },

    /**
     * 弹窗关闭处理
     */
    handleDialogClose() {
      this.dialogVisible = false
      // 重置数据
      this.resetData()
    },

    /**
     * 重置数据
     */
    resetData() {
      this.activeTab = 'orderDetail'
      this.selectedRows = []

      // 重置所有子组件数据
      this.resetChildComponents()
    },

    /**
     * 重置所有子组件数据
     */
    resetChildComponents() {
      // 重置退货明细组件
      if (this.$refs.orderDetailRef && this.$refs.orderDetailRef.resetData) {
        this.$refs.orderDetailRef.resetData()
      }

      // 重置实际退货明细组件
      if (this.$refs.actualDetailRef && this.$refs.actualDetailRef.resetData) {
        this.$refs.actualDetailRef.resetData()
      }

      // 重置下发记录组件
      if (this.$refs.issueRecordRef && this.$refs.issueRecordRef.resetData) {
        this.$refs.issueRecordRef.resetData()
      }

      // 重置订单状态记录组件
      if (this.$refs.statusRecordRef && this.$refs.statusRecordRef.resetData) {
        this.$refs.statusRecordRef.resetData()
      }
    }
  }
}
</script>

<style scoped>

</style>
