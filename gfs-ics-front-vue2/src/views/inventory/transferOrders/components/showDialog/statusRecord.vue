<template>
  <div class="operation-timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(record, index) in operationRecords"
        :key="index"
        :timestamp="record.time"
        type="success"
        placement="top"
        :hide-timestamp="false">

        <div class="timeline-content">
          <div class="operation-info">
            <div class="operator">
              <i class="el-icon-user"></i>
              <span>{{ record.operator }}</span>
            </div>
            <div class="operation-time">
              <i class="el-icon-time"></i>
              <span>{{ record.time }}</span>
            </div>
          </div>
          <div class="operation-detail">
            <div class="status-change">
              <span class="old-status" v-if="record.oldStatusName">{{ record.oldStatusName }}</span>
              <i class="el-icon-right" v-if="record.oldStatusName && record.newStatusName"></i>
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

<script>
import API from "@/api";

export default {
  name: 'statusRecord',
  data() {
    return {
      operationRecords: []
    }
  },
  methods: {
    async init(orderData) {
      // 调用API加载状态记录数据
      console.log('statusRecord init called with:', orderData);

      if (orderData && orderData.orderNumber) {
        await this.loadStatusRecordData(orderData.orderNumber);
      } else {
        this.$message.warning('订单数据不完整，无法获取状态记录');
        this.operationRecords = [];
      }
    },

    /**
     * 加载状态记录数据
     * @param {string} orderNumber - 订单编号
     */
    async loadStatusRecordData(orderNumber) {
      try {
        // 调用API获取订单状态记录数据
        const { data } = await API.transferOrder.getMonitorOrderStatusByOrderNumber(orderNumber);

        if (data.code === 0 && data.data) {
          // 处理返回的数据
          this.operationRecords = this.formatStatusData(data.data);
          this.$message.success('状态记录数据加载成功');
        } else {
          this.$message.error(data.msg || '获取状态记录失败');
          this.operationRecords = [];
        }
      } catch (error) {
        console.error('获取状态记录失败:', error);
        this.$message.error('获取状态记录失败，请重试');
        this.operationRecords = [];
      }
    },

    /**
     * 格式化状态数据
     * @param {Array} rawData - 原始数据数组
     * @returns {Array} 格式化后的状态数据
     */
    formatStatusData(rawData) {
      // 确保rawData是数组，如果不是则转换为数组
      const dataArray = Array.isArray(rawData) ? rawData : [rawData];

      return dataArray.map((item, index) => ({
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
  }
}
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
.operator, .operation-time {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #303133;
}
.operator i, .operation-time i {
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
.status-change i {
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
