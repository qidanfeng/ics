<template>
  <el-row :gutter="40" class="client-group" v-loading="dataLoading">
    <el-col :xs="12" :sm="12" :lg="6" class="margin-bottom">
      <div class="client-group-card">
        <div class="card-icon-wrapper icon-today-background">
          <svg-icon localIcon="today" class="card-icon"></svg-icon>
        </div>
        <div class="client-group-card-label">
          <div class="client-group-card-text">
            <span>今日新增客户</span>
            <el-tooltip content="统计今日新增的客户数量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <div class="client-group-card-num">{{ todayQuantity }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="margin-bottom">
      <div class="client-group-card">
        <div class="card-icon-wrapper icon-week-background">
          <svg-icon localIcon="week" class="card-icon"></svg-icon>
        </div>
        <div class="client-group-card-label">
          <div class="client-group-card-text">
            <span>本周新增客户</span>
            <el-tooltip content="统计本周新增的客户数量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <div class="client-group-card-num">{{ thisWeekQuantity }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="margin-bottom">
      <div class="client-group-card">
        <div class="card-icon-wrapper icon-month-background">
          <svg-icon localIcon="month" class="card-icon"></svg-icon>
        </div>
        <div class="client-group-card-label">
          <div class="client-group-card-text">
            <span>本月新增客户</span>
            <el-tooltip content="统计本月新增的客户数量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <div class="client-group-card-num">{{ thisMonthQuantity }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="margin-bottom">
      <div class="client-group-card">
        <div class="card-icon-wrapper icon-total-background">
          <svg-icon localIcon="total" class="card-icon"></svg-icon>
        </div>
        <div class="client-group-card-label">
          <div class="client-group-card-text">
            <span>目前总客户</span>
            <el-tooltip content="统计客户总量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <div class="client-group-card-num">{{ totalQuantity }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineExpose({
  init
});

const todayQuantity = ref(0);
const thisWeekQuantity = ref(0);
const thisMonthQuantity = ref(0);
const totalQuantity = ref(0);
const dataLoading = ref(false);

function init(data: any) {
  dataLoading.value = true;
  todayQuantity.value = data.todayQuantity || 0;
  thisWeekQuantity.value = data.thisWeekQuantity || 0;
  thisMonthQuantity.value = data.thisMonthQuantity || 0;
  totalQuantity.value = data.totalQuantity || 0;
  setTimeout(() => {
    dataLoading.value = false;
  }, 1000);
}
</script>

<style scoped lang="scss">
.client-group {
  margin-top: 10px;

  .margin-bottom {
    margin-bottom: 15px;
  }

  .client-group-card {
    height: 100px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: var(--el-text-color-regular);
    background-color: var(--el-bg-color);
    cursor: pointer;
    box-shadow: var(--el-box-shadow-light);
    border: 1px solid var(--el-border-color-lighter);

    &:hover {
      .card-icon-wrapper {
        color: var(--el-color-white);
      }

      .icon-today-background {
        background: var(--el-color-primary);
      }

      .icon-week-background {
        background: var(--el-color-primary);
      }

      .icon-month-background {
        background: var(--el-color-danger);
      }

      .icon-total-background {
        background: var(--el-color-success);
      }
    }

    .card-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-icon {
      float: left;
      font-size: 40px;
    }

    .client-group-card-label {
      float: right;
      font-weight: bold;
      margin: 26px;
      .client-group-card-text {
        color: var(--el-text-color-secondary);
        font-size: 16px;
        line-height: 18px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
      }
      .client-group-card-num {
        font-size: 20px;
      }
    }

    .icon-today-background {
      color: var(--el-color-primary);
    }

    .icon-week-background {
      color: var(--el-color-primary);
    }

    .icon-month-background {
      color: var(--el-color-danger);
    }

    .icon-total-background {
      color: var(--el-color-success);
    }
  }
}
</style>
