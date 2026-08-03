<template>
  <el-dialog
    title="采购订单详情"
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
      <el-tab-pane label="费用详情" name="costDetail">
       <cost-detail v-if="activeTab === 'costDetail'" ref="costDetailRef"/>
      </el-tab-pane>
      <el-tab-pane label="订单状态记录" name="statusRecord">
       <status-record v-if="activeTab === 'statusRecord'" ref="statusRecordRef"/>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import OrderDetail from "./components/showDialog/orderDetail";
import CostDetail from "./components/showDialog/costDetail";
import StatusRecord from "./components/showDialog/statusRecord";
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
    CostDetail,
    StatusRecord
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
            case 'costDetail':
              if (this.$refs.costDetailRef && this.$refs.costDetailRef.init) {
                this.$refs.costDetailRef.init(this.currentOrderData);
              }
              break;
            case 'statusRecord':
              if (this.$refs.statusRecordRef && this.$refs.statusRecordRef.init) {
                this.$refs.statusRecordRef.init(this.currentOrderData);
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
