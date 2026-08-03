<template>
  <div>
    <div class="issue-timeline">
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in recordData"
          :key="record.id"
          :timestamp="record.createdTime"
          :type="getTimelineType(record.resStatus)"
          placement="top"
          :hide-timestamp="false"
        >
          <div class="timeline-content">
            <div class="operation-info">
              <div class="operator">
                <el-icon><User /></el-icon>
                <span>{{ record.createdBy }}</span>
              </div>
              <div class="operation-time">
                <el-icon><Timer /></el-icon>
                <span>{{ record.createdTime }}</span>
              </div>
              <div class="action-buttons">
                <el-button
                  v-if="record.allowRetryFlag"
                  type="primary"
                  size="small"
                  plain
                  @click="retryCallBack(record.id)"
                >
                  <el-icon style="margin-right: 4px;"><Refresh /></el-icon>
                  重新拉取
                </el-button>
              </div>
            </div>
            <div class="operation-detail">
              <div class="status-section">
                <div class="status-tag">
                  <el-tag
                    :type="getStatusType(record.resStatus)"
                    size="default"
                    effect="dark"
                    class="status-tag-item"
                  >
                    <el-icon style="margin-right: 4px;"><component :is="getTimelineIcon(record.resStatus)" /></el-icon>
                    {{ getStatusName(record.resStatus) }}
                  </el-tag>
                </div>
              </div>
              <div class="content-row">
                <div class="info-item">
                  <span class="label">订单号：</span>
                  <span class="value">{{ record.orderNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="label">业务编码：</span>
                  <span class="value">{{ record.bizCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">同步系统：</span>
                  <span class="value">{{ record.syncFromSystem }}</span>
                </div>
              </div>
              <div class="content-row">
                <div class="info-item">
                  <span class="label">OMS单号：</span>
                  <span class="value">{{ record.omsOrderNumber || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">WMS单号：</span>
                  <span class="value">{{ record.wmsOrderNumber || '无' }}</span>
                </div>
                <div class="info-item">
                  <!-- 占位项，保持三列对齐 -->
                </div>
              </div>
              <div class="content-row" v-if="record.taskReqData">
                <div class="info-item info-row">
                  <span class="label">请求数据：</span>
                  <el-tooltip
                    :content="record.taskReqData"
                    placement="top"
                    effect="dark"
                    :disabled="!isTextOverflow(record.taskReqData)"
                    popper-class="custom-tooltip"
                  >
                    <span class="value result text-ellipsis">{{ record.taskReqData }}</span>
                  </el-tooltip>
                </div>
              </div>
              <div class="content-row" v-if="record.taskResData">
                <div class="info-item info-row">
                  <span class="label">响应数据：</span>
                  <el-tooltip
                    :content="record.taskResData"
                    placement="top"
                    effect="dark"
                    :disabled="!isTextOverflow(record.taskResData)"
                    popper-class="custom-tooltip"
                  >
                    <span class="value result text-ellipsis">{{ record.taskResData }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Component } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh, User, Timer, CircleCheck, CircleClose, Loading, InfoFilled } from '@element-plus/icons-vue';
import { getCallbackLogByOrderNumber, callbackLogRetry } from '@/service/api/ics/purchase-in-order';

defineOptions({ name: 'CallBackRecord' });

const recordData = ref<any[]>([]);
const loading = ref(false);
const orderNumber = ref('');
const id = ref<string | number | null>(null);

/** 初始化拉取记录数据 */
function init(data: any) {
  if (data && data.orderNumber) {
    orderNumber.value = data.orderNumber;
    id.value = data.id;
    loadCallBackRecord();
  } else {
    console.log('issueRecord组件初始化完成，缺少订单号');
  }
}

async function loadCallBackRecord() {
  if (!orderNumber.value) {
    console.warn('订单号为空，无法获取拉取记录');
    return;
  }
  loading.value = true;
  try {
    const { response } = await getCallbackLogByOrderNumber(orderNumber.value);
    const data: any = response?.data;
    if (data.code === 0 && data.data) {
      recordData.value = data.data.reverse();
    } else {
      recordData.value = [];
      console.log('未找到拉取记录数据或API返回异常');
    }
  } catch (error) {
    console.error('获取拉取记录失败:', error);
    ElMessage.error('获取拉取记录失败');
    recordData.value = [];
  } finally {
    loading.value = false;
  }
}

function retryCallBack(recordId: string | number) {
  ElMessageBox.confirm(`确定要重新拉取此记录吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callbackLogRetry(recordId)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.code === 0) {
          ElMessage.success('重新拉取成功');
        }
        loadCallBackRecord();
      })
      .catch(() => {});
  });
}

function getStatusType(status: string | number) {
  const typeMap: Record<string, 'success' | 'danger' | 'info' | 'primary' | 'warning'> = {
    '1': 'success',
    '0': 'danger',
    '2': 'warning'
  };
  return typeMap[status as string] || 'info';
}

function getTimelineType(status: string | number) {
  const typeMap: Record<string, 'success' | 'danger' | 'info' | 'primary' | 'warning'> = {
    '1': 'success',
    '0': 'danger',
    '2': 'warning'
  };
  return typeMap[status as string] || 'primary';
}

function getTimelineIcon(status: string | number): Component {
  const iconMap: Record<string, Component> = {
    '1': CircleCheck,
    '0': CircleClose,
    '2': Loading
  };
  return iconMap[status as string] || InfoFilled;
}

function getStatusName(status: string | number) {
  const colorMap: Record<string, string> = {
    '1': '成功',
    '0': '失败',
    '2': '重试中'
  };
  return colorMap[status as string];
}

function getCardClass(status: string | number) {
  return `card-${status}`;
}

function isTextOverflow(text: string) {
  if (!text) return false;
  return text.length > 100;
}

defineExpose({ init });
</script>

<style scoped>
.issue-timeline {
  height: 600px;
  overflow-y: auto;
}

.timeline-content {
  background: #f8f9fa;
  padding: 12px 15px;
  border-radius: 4px;
}

.operation-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.operator,
.operation-time {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #303133;
}

.operator .el-icon,
.operation-time .el-icon {
  margin-right: 5px;
  color: #409eff;
}

.operation-detail {
  font-size: 14px;
  color: #606266;
}

.status-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.status-tag {
  flex: 1;
}

.status-tag-item {
  font-size: 14px;
  font-weight: 600;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-bottom: 10px;
}

.content-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.info-item .label {
  font-size: 14px;
  color: #909399;
  min-width: 80px;
  flex-shrink: 0;
}

.info-item .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  word-break: break-all;
  flex: 1;
}

.info-row .value.result {
  color: #606266;
  font-weight: normal;
  line-height: 1.5;
}

.info-row .value {
  max-height: 200px;
  overflow-y: auto;
}

.info-row .value.text-ellipsis {
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: break-all !important;
  line-height: 1.5 !important;
  max-height: none !important;
}

.text-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
  max-height: none !important;
  overflow: hidden !important;
}

:deep(.el-tooltip__popper) {
  max-width: 300px !important;
  width: auto !important;
  word-break: break-all;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
}

:deep(.el-tooltip__popper .el-tooltip__content) {
  max-width: 300px !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
}

:deep(.custom-tooltip) {
  max-width: 300px !important;
  width: 300px !important;
}

:deep(.custom-tooltip .el-tooltip__popper) {
  max-width: 300px !important;
  width: 300px !important;
  min-width: 200px !important;
}

:deep(.custom-tooltip .el-tooltip__content) {
  max-width: 300px !important;
  width: 300px !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  line-height: 1.4 !important;
  overflow: hidden !important;
}

@media (max-width: 768px) {
  .issue-timeline {
    padding: 12px;
  }

  .operation-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .status-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .status-tag {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }

  .content-row {
    flex-direction: column;
    gap: 8px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-item .label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .issue-timeline {
    padding: 8px;
  }
}
</style>
