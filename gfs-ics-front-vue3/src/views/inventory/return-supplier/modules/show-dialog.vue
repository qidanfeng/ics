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
      <el-tab-pane label="退货明细" name="orderDetail">
        <OrderDetail v-if="activeTab === 'orderDetail'" ref="orderDetailRef" />
      </el-tab-pane>
      <el-tab-pane label="实际退货明细" name="actualDetail">
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
import { ref, nextTick, watch } from 'vue';
import OrderDetail from './order-detail.vue';
import ActualDetail from './actual-detail.vue';
import CostDetail from './cost-detail.vue';
import IssueRecord from './issue-record.vue';
import StatusRecord from './status-record.vue';
import CallBackRecord from './call-back-record.vue';

defineOptions({ name: 'ReturnSupplierShowDialog' });

const dialogVisible = ref(false);
const activeTab = ref('orderDetail');
const submitting = ref(false);
const selectedRows = ref<any[]>([]);
const initData = ref<any>(null);

const orderDetailRef = ref();
const actualDetailRef = ref();
const costDetailRef = ref();
const issueRecordRef = ref();
const statusRecordRef = ref();
const callBackRecordRef = ref();

// 监听activeTab变化，切换tab时初始化对应组件
watch(activeTab, () => {
  if (initData.value) {
    nextTick(() => {
      initActiveComponent(initData.value);
    });
  }
});

/** 初始化弹窗数据 */
function init(data: any) {
  // 显示弹窗
  dialogVisible.value = true;
  // 重置到默认标签页
  activeTab.value = 'orderDetail';
  // 存储初始化数据
  initData.value = data;
  // 初始化当前激活的子组件数据
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
    case 'actualDetail':
      actualDetailRef.value?.init(data);
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

/** tab切换处理 */
function handleTabChange(tabName: string | number) {
  activeTab.value = String(tabName);
}

/** 弹窗关闭处理 */
function handleDialogClose() {
  dialogVisible.value = false;
  resetData();
}

/** 重置数据 */
function resetData() {
  activeTab.value = 'orderDetail';
  selectedRows.value = [];
  resetChildComponents();
}

/** 重置所有子组件数据 */
function resetChildComponents() {
  orderDetailRef.value?.resetData?.();
  actualDetailRef.value?.resetData?.();
  issueRecordRef.value?.resetData?.();
  statusRecordRef.value?.resetData?.();
}

defineExpose({ init });
</script>

<style scoped></style>
