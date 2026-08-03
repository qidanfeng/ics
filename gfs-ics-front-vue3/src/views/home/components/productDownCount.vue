<template>
  <div class="product-down-count" v-loading="dataLoading">
    <div class="stat-item">
      <div class="stat-content">
        <svg-icon localIcon="circle-mark" class="svg-icon-class" :class="unAuditProductQuantity === 0 ? 'icon-default' : 'icon-warning'"></svg-icon>
        <span class="svg-icon-num-class" :class="unAuditProductQuantity === 0 ? 'text-default' : 'text-danger'">{{ unAuditProductQuantity }}</span>
      </div>
      <div class="svg-icon-name-class">产品待审核</div>
    </div>
    <div class="stat-item">
      <div class="stat-content">
        <svg-icon localIcon="circle-mark" class="svg-icon-class" :class="unSyncProductQuantity === 0 ? 'icon-default' : 'icon-warning'"></svg-icon>
        <span class="svg-icon-num-class" :class="unSyncProductQuantity === 0 ? 'text-default' : 'text-danger'">{{ unSyncProductQuantity }}</span>
      </div>
      <div class="svg-icon-name-class">产品待同步</div>
    </div>
    <div class="stat-item">
      <div class="stat-content">
        <svg-icon localIcon="circle-mark" class="svg-icon-class" :class="downFailedProductQuantity === 0 ? 'icon-default' : 'icon-warning'"></svg-icon>
        <span class="svg-icon-num-class" :class="downFailedProductQuantity === 0 ? 'text-default' : 'text-danger'">{{ downFailedProductQuantity }}</span>
      </div>
      <div class="svg-icon-name-class">产品同步失败</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineExpose({
  init
});

const unAuditProductQuantity = ref(0);
const unSyncProductQuantity = ref(0);
const downFailedProductQuantity = ref(0);
const dataLoading = ref(false);

function init(data: any) {
  dataLoading.value = true;
  unAuditProductQuantity.value = data.unAuditProductQuantity || 0;
  unSyncProductQuantity.value = data.unSyncProductQuantity || 0;
  downFailedProductQuantity.value = data.downFailedProductQuantity || 0;
  setTimeout(() => {
    dataLoading.value = false;
  }, 1000);
}
</script>

<style scoped lang="scss">
.product-down-count {
  width: 100%;
  height: 350px;
  background-color: var(--el-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .stat-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .svg-icon-class {
    font-size: 24px;
  }

  .icon-default {
    color: var(--el-text-color-secondary);
  }

  .icon-warning {
    color: var(--el-color-warning);
  }

  .text-default {
    color: var(--el-text-color-secondary);
  }

  .text-danger {
    color: var(--el-color-danger);
  }

  .svg-icon-name-class {
    font-size: 14px;
    color: var(--el-color-primary);
    white-space: nowrap;
  }

  .svg-icon-num-class {
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
