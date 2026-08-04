<template>
  <!-- 查看详情弹窗 -->
  <el-dialog
    title="查看"
    v-model="dialogVisible"
    width="90%"
    top="5vh"
    custom-class="dialog_customWidth"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <!-- 标签页区域 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="调拨概览" name="orderDetail">
        <OrderDetail v-if="activeTab === 'orderDetail'" ref="orderDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="调出明细" name="transferOutDetail">
        <TransferOutDetail v-if="activeTab === 'transferOutDetail'" ref="transferOutDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="调入明细" name="transferInDetail">
        <TransferInDetail v-if="activeTab === 'transferInDetail'" ref="transferInDetailRef" />
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
import TransferInDetail from './transfer-in-detail.vue';
import TransferOutDetail from './transfer-out-detail.vue';
import CostDetail from './cost-detail.vue';
import StatusRecord from './status-record.vue';
import IssueRecord from './issue-record.vue';
import CallBackRecord from './call-back-record.vue';

defineOptions({ name: 'TransferOrderShowDialog' });

const dialogVisible = ref(false);
const activeTab = ref('orderDetail');
const initData = ref<any>(null);

const orderDetailRef = ref();
const transferOutDetailRef = ref();
const transferInDetailRef = ref();
const costDetailRef = ref();
const issueRecordRef = ref();
const statusRecordRef = ref();
const callBackRecordRef = ref();

/** 初始化弹窗数据 */
function init(data: any) {
  dialogVisible.value = true;
  activeTab.value = 'orderDetail';
  initData.value = data;
  nextTick(() => {
    initActiveComponent(data);
  });
}

/** 初始化当前激活的子组件 */
function initActiveComponent(data: any) {
  switch (activeTab.value) {
    case 'orderDetail':
      orderDetailRef.value?.init(data);
      break;
    case 'transferOutDetail':
      transferOutDetailRef.value?.init(data);
      break;
    case 'transferInDetail':
      transferInDetailRef.value?.init(data);
      break;
    case 'costDetail':
      costDetailRef.value?.init(data);
      break;
    case 'issueRecord':
      issueRecordRef.value?.init(data);
      break;
    case 'statusRecord':
      statusRecordRef.value?.init(data);
      break;
    case 'callBackRecord':
      callBackRecordRef.value?.init(data);
      break;
  }
}

/** tab 切换时调用对应子组件的 init 方法 */
function handleTabChange(tabName: string | number) {
  const name = String(tabName);
  if (!initData.value) return;
  nextTick(() => {
    initActiveComponent(initData.value);
    void name;
  });
}

/** 弹窗关闭处理 */
function handleDialogClose() {
  dialogVisible.value = false;
  resetData();
}

/** 重置数据 */
function resetData() {
  activeTab.value = 'orderDetail';
  initData.value = null;
  resetChildComponents();
}

/** 重置所有子组件数据 */
function resetChildComponents() {
  orderDetailRef.value?.resetData?.();
  transferOutDetailRef.value?.resetData?.();
  transferInDetailRef.value?.resetData?.();
  costDetailRef.value?.resetData?.();
  issueRecordRef.value?.resetData?.();
  statusRecordRef.value?.resetData?.();
  callBackRecordRef.value?.resetData?.();
}

defineExpose({ init });
</script>

<style scoped></style>
