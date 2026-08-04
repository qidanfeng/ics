<template>
  <div class="operation-timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(record, index) in operationRecords"
        :key="index"
        :timestamp="record.time"
        type="success"
        placement="top"
        :hide-timestamp="false"
      >
        <div class="timeline-content">
          <div class="operation-info">
            <div class="operator">
              <el-icon><User /></el-icon>
              <span>{{ record.operator }}</span>
            </div>
            <div class="operation-time">
              <el-icon><Clock /></el-icon>
              <span>{{ record.time }}</span>
            </div>
          </div>
          <div class="operation-detail">
            <div class="status-change">
              <span class="old-status" v-if="record.oldStatusName">{{ record.oldStatusName }}</span>
              <el-icon v-if="record.oldStatusName && record.newStatusName"><Right /></el-icon>
              <span class="new-status" v-if="record.newStatusName">{{ record.newStatusName }}</span>
            </div>
            <div class="additional-info" v-if="record.createdBy || record.lastModifiedBy">
              <span v-if="record.createdBy">创建人: {{ record.createdBy }}</span>
              <span v-if="record.lastModifiedBy">最后修改人: {{ record.lastModifiedBy }}</span>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Clock, Right } from '@element-plus/icons-vue';
import { getMonitorOrderStatusByOrderNumber } from '@/service/api/inventory/return-supplier';

defineOptions({ name: 'ReturnSupplierStatusRecord' });

const operationRecords = ref<any[]>([]);

/** 初始化 */
async function init(orderData: any) {
  console.log('statusRecord init called with:', orderData);
  if (orderData && orderData.orderNumber) {
    await loadStatusRecordData(orderData.orderNumber);
  } else {
    ElMessage.warning('订单数据不完整，无法获取状态记录');
    operationRecords.value = [];
  }
}

/** 加载状态记录数据 */
async function loadStatusRecordData(orderNumber: string) {
  try {
    const { response } = await getMonitorOrderStatusByOrderNumber(orderNumber);
    const data: any = response?.data;
    if (data && (data.code as unknown as number) === 0 && data.data) {
      operationRecords.value = formatStatusData(data.data);
      ElMessage.success('状态记录数据加载成功');
    } else {
      ElMessage.error(data?.msg || '获取状态记录失败');
      operationRecords.value = [];
    }
  } catch (error) {
    console.error('获取状态记录失败:', error);
    ElMessage.error('获取状态记录失败，请重试');
    operationRecords.value = [];
  }
}

/** 格式化状态数据 */
function formatStatusData(rawData: any) {
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];
  return dataArray.map((item: any) => ({
    operator: item.createdBy || item.lastModifiedBy || '未知用户',
    time: item.createdTime || item.lastModifiedTime || '',
    oldStatus: item.oldStatus || null,
    oldStatusName: item.oldStatusName || '',
    newStatus: item.newStatus || null,
    newStatusName: item.newStatusName || '',
    createdBy: item.createdBy || '',
    createdTime: item.createdTime || '',
    lastModifiedBy: item.lastModifiedBy || '',
    lastModifiedTime: item.lastModifiedTime || ''
  }));
}

/** 重置组件数据 */
function resetData() {
  operationRecords.value = [];
}

defineExpose({ init, resetData });
</script>

<style scoped>
.operation-timeline {
  padding: 20px;
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

.status-change {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.old-status {
  color: #f56c6c;
  font-weight: 500;
}

.new-status {
  color: #67c23a;
  font-weight: 500;
}

.status-change .el-icon {
  margin: 0 8px;
  color: #909399;
}

.additional-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.additional-info span {
  background: #ebeef5;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
