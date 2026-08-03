<template>
  <div >
    <div class="action-buttons">
      <el-button
        v-if="issueStatus == 30"
        type="primary"
        size="mini"
        plain
        @click="retryIssue()">
        <i class="el-icon-refresh" style="margin-right: 4px;"></i>
        重新下发
      </el-button>
    </div>
    <div class="issue-timeline">
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in recordData"
          :key="record.id"
          :timestamp="record.createdTime"
          :type="getTimelineType(record.resStatus)"
          placement="top"
          :hide-timestamp="false">

          <div class="timeline-content">
            <div class="operation-info">
              <div class="operator">
                <i class="el-icon-user"></i>
                <span>{{ record.createdBy }}</span>
              </div>
              <div class="operation-time">
                <i class="el-icon-time"></i>
                <span>{{ record.createdTime }}</span>
              </div>
            </div>
            <div class="operation-detail">
              <div class="status-section">
                <div class="status-tag">
                  <el-tag
                    :type="getStatusType(record.resStatus)"
                    size="medium"
                    effect="dark"
                    class="status-tag-item">
                    <i :class="getTimelineIcon(record.resStatus)" style="margin-right: 4px;"></i>
                    {{getStatusName(record.resStatus)}}
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
              </div>
              <div class="content-row">
                <div class="info-item">
                  <span class="label">同步系统：</span>
                  <span class="value">{{ record.syncToSystem }}</span>
                </div>
                <div class="info-item">
                  <span class="label">OMS单号：</span>
                  <span class="value">{{ record.omsOrderNumber || '无' }}</span>
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
                    :popper-options="{ boundariesElement: 'body', removeOnDestroy: true }">
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
                    :popper-options="{ boundariesElement: 'body', removeOnDestroy: true }">
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

<script>
import API from '@/api'

export default {
  name: 'IssueRecord',
  data() {
    return {
      // 下发记录数据
      recordData: [],
      loading: false,
      // 本地存储的订单号，基于props初始化
      orderNumber: '',
      id:null,
      issueStatus:null,
    }
  },

  methods: {
    init(data) {
      // 初始化下发记录数据
      if (data && data.orderNumber) {
        this.orderNumber = data.orderNumber;
        this.issueStatus = data.issueStatus;
        this.id = data.id;
        this.loadIssueRecord();
      } else {
        console.log('issueRecord组件初始化完成，缺少订单号');
      }
    },
    async loadIssueRecord(){
      if (!this.orderNumber) {
        console.warn('订单号为空，无法获取下发记录');
        return;
      }

      this.loading = true;
      try {
         const { data } = await API.inOrder.getOrderIssueLogByOrderNumber(this.orderNumber);

        if (data.code === 0 && data.data) {
          this.recordData = data.data.reverse();
        } else {
          this.recordData = [];
          console.log('未找到下发记录数据或API返回异常');
        }
      } catch (error) {
        console.error('获取下发记录失败:', error);
        this.$message.error('获取下发记录失败');
        this.recordData = [];
      } finally {
        this.loading = false;
      }
    },

    // 重新下发
    retryIssue() {
      this.$confirm(`确定要重新下发此订单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.inOrder.issue([this.id]).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('重新下发成功')
            }
          this.loadIssueRecord();
          }).catch(error => {

          })

      });
    },
    // 获取状态标签样式
    getStatusType(status) {
      const typeMap = {
        '1': 'success',
        '0': 'danger',
      };
      return typeMap[status] || 'info';
    },
    // 获取时间轴类型
    getTimelineType(status) {
      const typeMap = {
        '1': 'success',
        '0': 'danger',
      };
      return typeMap[status] || 'primary';
    },
    // 获取时间轴图标
    getTimelineIcon(status) {
      const iconMap = {
        '1': 'el-icon-circle-check',
        '0': 'el-icon-circle-close',
      };
      return iconMap[status] || 'el-icon-info';
    },
    // 获取时间轴颜色
    getStatusName(status) {
      const colorMap = {
        '1': '成功',
        '0': '失败',
      };
      return colorMap[status];
    },
    // 获取卡片样式
    getCardClass(status) {
      return `card-${status}`;
    },

    // 判断文本是否溢出
    isTextOverflow(text) {
      if (!text) return false;
      // 假设超过100个字符就认为需要tooltip
      return text.length > 100;
    }
  }
}
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

/* 为包含text-ellipsis类的元素提供更高的优先级 */
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
  /* 确保优先级高于其他样式 */
  max-height: none !important;
  overflow: hidden !important;
}

/* 确保tooltip样式正确 */
::v-deep .el-tooltip__popper {
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

::v-deep .el-tooltip__popper .el-tooltip__content {
  max-width: 300px !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
}

/* 自定义tooltip样式 */
::v-deep .custom-tooltip {
  max-width: 300px !important;
  width: 300px !important;
}

::v-deep .custom-tooltip .el-tooltip__popper {
  max-width: 300px !important;
  width: 300px !important;
  min-width: 200px !important;
}

::v-deep .custom-tooltip .el-tooltip__content {
  max-width: 300px !important;
  width: 300px !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  line-height: 1.4 !important;
  overflow: hidden !important;
}

/* 强制所有tooltip宽度 */
::v-deep .el-tooltip__popper {
  max-width: 300px !important;
  width: 300px !important;
}

::v-deep .el-tooltip__content {
  max-width: 300px !important;
  width: 300px !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
}

/* 响应式设计 */
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
