<template>
  <el-dialog
    title="采购入库单详情"
    top="5vh"
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="reset"
  >
    <!-- 标签页区域 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="订单明细" name="orderDetail">
        <OrderDetail v-if="activeTab === 'orderDetail'" ref="orderDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="实际入库信息" name="actualDetail">
        <ActualDetail v-if="activeTab === 'actualDetail'" ref="actualDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="费用详情" name="costDetail">
        <CostDetail v-if="activeTab === 'costDetail'" ref="costDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="下发记录" name="issueRecord">
        <IssueRecord v-if="activeTab === 'issueRecord'" ref="issueRecordRef" />
      </el-tab-pane>
      <el-tab-pane label="订单状态记录" name="statusRecord">
        <StatusRecord v-if="activeTab === 'statusRecord'" ref="statusRecordRef" />
      </el-tab-pane>
      <el-tab-pane label="回调记录" name="callBackRecord">
        <CallBackRecord v-if="activeTab === 'callBackRecord'" ref="callBackRecordRef" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import OrderDetail from './order-detail.vue';
import ActualDetail from './actual-detail.vue';
import CostDetail from './cost-detail.vue';
import StatusRecord from './status-record.vue';
import IssueRecord from './issue-record.vue';
import CallBackRecord from './callback-record.vue';

defineOptions({ name: 'PurchaseInOrdersShowDialog' });

const emit = defineEmits(['close']);

const dialogVisible = ref(false);
const activeTab = ref('orderDetail');
const currentOrderData = ref<any>(null);

const orderDetailRef = ref();
const actualDetailRef = ref();
const costDetailRef = ref();
const issueRecordRef = ref();
const statusRecordRef = ref();
const callBackRecordRef = ref();

/** 初始化弹窗（供父组件调用） */
function init(orderData: any) {
  dialogVisible.value = true;
  currentOrderData.value = orderData;
  activeTab.value = 'orderDetail';
  // 初始化默认显示的 tab（订单明细）
  nextTick(() => {
    orderDetailRef.value?.init(orderData);
  });
}

/** tab 切换时调用对应子组件的 init 方法 */
function handleTabChange(tabName: string | number) {
  if (!currentOrderData.value) return;
  const name = String(tabName);
  nextTick(() => {
    switch (name) {
      case 'orderDetail':
        orderDetailRef.value?.init(currentOrderData.value);
        break;
      case 'actualDetail':
        actualDetailRef.value?.init(currentOrderData.value);
        break;
      case 'costDetail':
        costDetailRef.value?.init(currentOrderData.value);
        break;
      case 'issueRecord':
        issueRecordRef.value?.init(currentOrderData.value);
        break;
      case 'statusRecord':
        statusRecordRef.value?.init(currentOrderData.value);
        break;
      case 'callBackRecord':
        callBackRecordRef.value?.init(currentOrderData.value);
        break;
      default:
        break;
    }
  });
}

/** 重置（关闭时调用） */
function reset() {
  currentOrderData.value = null;
  activeTab.value = 'orderDetail';
  dialogVisible.value = false;
  emit('close');
}

defineExpose({ init });
</script>

<style scoped></style>
