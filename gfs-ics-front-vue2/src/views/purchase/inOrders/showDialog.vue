<template>
  <el-dialog
    title="采购入库单详情"
    custom-class="dialog_customWidth"
    top="5vh"
    :visible.sync="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="reset"
  >
    <!-- 标签页区域 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="订单明细" name="orderDetail">
       <order-detail v-if="activeTab === 'orderDetail'" ref="orderDetailRef"/>
      </el-tab-pane>
      <el-tab-pane label="实际入库信息" name="actualDetail">
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
import ActualDetail from "./components/showDialog/actualDetail"
import CostDetail from "./components/showDialog/costDetail";
import StatusRecord from "./components/showDialog/statusRecord";
import issueRecord from "./components/showDialog/issueRecord";
import CallBackRecord from "./components/showDialog/callBackRecord"
export default {
  name: 'ShowDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    OrderDetail,
    ActualDetail,
    CostDetail,
    StatusRecord,
    issueRecord,
    CallBackRecord,
  },

  data() {
    return {
      tableData:[],
      dialogVisible:false,
      activeTab: 'orderDetail',
      submitting: false,
      selectedRows: [],
      currentOrderData: null
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
      if (!val) {
        this.$emit('close');
      }
    }
  },
  methods: {
    init(orderData) {
      this.dialogVisible = true;
      this.currentOrderData = orderData;
      this.activeTab = 'orderDetail';

      // 初始化默认显示的tab（订单明细）
      this.$nextTick(() => {
        if (this.$refs.orderDetailRef && this.$refs.orderDetailRef.init) {
          this.$refs.orderDetailRef.init(orderData);
        }
      });
    },
    handleTabClick(tab) {
      // 当tab被激活时，调用对应子组件的init方法
      const tabName = tab.name;
      if (this.currentOrderData) {
        this.$nextTick(() => {
          switch (tabName) {
            case 'orderDetail':
              if (this.$refs.orderDetailRef && this.$refs.orderDetailRef.init) {
                this.$refs.orderDetailRef.init(this.currentOrderData);
              }
              break;
            case 'actualDetail':
              if (this.$refs.actualDetailRef && this.$refs.actualDetailRef.init) {
                this.$refs.actualDetailRef.init(this.currentOrderData);
              }
              break;
            case 'costDetail':
              if (this.$refs.costDetailRef && this.$refs.costDetailRef.init) {
                this.$refs.costDetailRef.init(this.currentOrderData);
              }
              break;
            case 'issueRecord':
              if (this.$refs.issueRecordRef && this.$refs.issueRecordRef.init) {
                this.$refs.issueRecordRef.init(this.currentOrderData);
              }
              break;
            case 'statusRecord':
              if (this.$refs.statusRecordRef && this.$refs.statusRecordRef.init) {
                this.$refs.statusRecordRef.init(this.currentOrderData);
              }
              break;
            case 'callBackRecord':
              if (this.$refs.callBackRecordRef && this.$refs.callBackRecordRef.init) {
                this.$refs.callBackRecordRef.init(this.currentOrderData);
              }
              break;
            default:
              break;
          }
        });
      }
    },
    reset() {
      this.currentOrderData = null;
      this.activeTab = 'orderDetail';
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>

</style>
