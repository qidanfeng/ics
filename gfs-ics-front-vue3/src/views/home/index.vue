<template>
  <div class="app-container">
    <el-button type="primary" size="small" @click="refreshDataList">刷新</el-button>
    <ClientGroup ref="clientGroupRef" />
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="font-xl">
          <span>客户每日新增情况</span>
          <el-tooltip content="统计本月和上月每日客户增长情况，不包含已关闭客户" effect="light" placement="right">
            <svg-icon localIcon="warning-outline"></svg-icon>
          </el-tooltip>
        </div>
        <el-card class="dashboard-card">
          <el-row class="chart-container">
            <el-col>
              <ClientMonthlyGrowth ref="clientMonthlyGrowth" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div class="font-xl">
          <span>产品下发异常统计</span>
          <el-tooltip content="统计待审核、待同步。同步失败状态的产品数量，不包含已关闭产品" effect="light" placement="right">
            <svg-icon localIcon="warning-outline"></svg-icon>
          </el-tooltip>
        </div>
        <el-card class="dashboard-card">
          <ProductDownCount ref="productDownCountRef" />
        </el-card>
      </el-col>
    </el-row>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="font-xl">
            <span>各仓客户数</span>
            <el-tooltip content="统计各仓库的客户数量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <el-card class="dashboard-card">
            <div class="scroll_table">
              <el-table :data="warehouseClientList" class="table" size="small">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="warehouseName" label="仓库" align="center">
                  <template #header>
                    <div class="header-with-icon">
                      <svg-icon localIcon="warehouse" class="icon-primary" />
                      <span>仓库</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="clientQuantity" label="客户数量" align="center">
                  <template #header>
                    <div class="header-with-icon">
                      <svg-icon localIcon="peoples" class="icon-primary" />
                      <span>客户数量</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div v-loading="warehouseClientLoading" style="height: 260px;">
                <vue3-seamless-scroll
                  v-if="warehouseClientList.length > 0"
                  :list="warehouseClientList"
                  :limitScrollNum="5"
                  :step="0.5"
                  :hover="true"
                  direction="up"
                  :isWatch="true"
                  class="seamless-warp">
                  <div class="custom-table">
                    <div class="table-row" v-for="(item, index) in warehouseClientList" :key="index" :class="{ 'is-striped': index % 2 === 1 }">
                      <div class="table-cell index-cell">
                        <div class="cell-content">
                          <svg-icon v-if="item.originalIndex <= 3" localIcon="star" class="card-panel-icon icon-warning" />
                          <span>{{ item.originalIndex }}</span>
                        </div>
                      </div>
                      <div class="table-cell">{{ item.warehouseName }}</div>
                      <div class="table-cell">{{ item.clientQuantity }}</div>
                    </div>
                  </div>
                </vue3-seamless-scroll>
                <div v-else class="no-data">
                  暂无数据
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div class="font-xl">
            <span>TOP20客户分仓数</span>
            <el-tooltip content="统计客户在各仓库的数量，不包含已关闭客户" effect="light" placement="right">
              <svg-icon localIcon="warning-outline"></svg-icon>
            </el-tooltip>
          </div>
          <el-card class="dashboard-card">
            <div class="scroll_table">
              <el-table class="table" size="small">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="clientName" label="客户" align="center">
                  <template #header>
                    <div class="header-with-icon">
                      <svg-icon localIcon="peoples" class="icon-primary" />
                      <span>客户</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="warehouseQuantity" label="仓库数量" align="center">
                  <template #header>
                    <div class="header-with-icon">
                      <svg-icon localIcon="warehouse" class="icon-primary" />
                      <span>仓库数量</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div v-loading="clientWarehouseLoading" style="height: 260px;">
                <vue3-seamless-scroll
                  v-if="clientWarehouseList.length > 0"
                  :list="clientWarehouseList"
                  :limitScrollNum="5"
                  :step="0.5"
                  :hover="true"
                  direction="up"
                  :isWatch="true"
                  class="seamless-warp">
                  <div class="custom-table">
                    <div class="table-row" v-for="(item, index) in clientWarehouseList" :key="index" :class="{ 'is-striped': index % 2 === 1 }">
                      <div class="table-cell index-cell">
                        <div class="cell-content">
                          <svg-icon v-if="item.originalIndex <= 3" localIcon="star" class="card-panel-icon icon-warning" />
                          <span>{{ item.originalIndex }}</span>
                        </div>
                      </div>
                      <div class="table-cell">{{ item.clientName }}</div>
                      <div class="table-cell">{{ item.warehouseQuantity }}</div>
                    </div>
                  </div>
                </vue3-seamless-scroll>
                <div v-else class="no-data">
                  暂无数据
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
import ClientGroup from './components/clientGroup.vue';
import ClientMonthlyGrowth from './components/clientMonthlyGrowth.vue';
import ProductDownCount from './components/productDownCount.vue';
import * as reportApi from '@/service/api/mdm/report';

const clientGroupRef = ref<InstanceType<typeof ClientGroup>>();
const clientMonthlyGrowth = ref<InstanceType<typeof ClientMonthlyGrowth>>();
const productDownCountRef = ref<InstanceType<typeof ProductDownCount>>();

const warehouseClientList = ref<any[]>([]);
const clientWarehouseList = ref<any[]>([]);
const warehouseClientLoading = ref(false);
const clientWarehouseLoading = ref(false);

async function getClientMonthlyGrowth() {
  const { response } = await reportApi.getClientGrowth();
  if (response && response.data && (response.data.code as unknown as number) === 0) {
    clientMonthlyGrowth.value?.init(response.data.data);
  }
}

async function getClientGroup() {
  const { response } = await reportApi.getClientQuantityGroup();
  if (response && response.data && (response.data.code as unknown as number) === 0) {
    clientGroupRef.value?.init(response.data.data);
  }
}

async function getProductDownCountHandle() {
  const { response } = await reportApi.getProductDownCount();
  if (response && response.data && (response.data.code as unknown as number) === 0) {
    productDownCountRef.value?.init(response.data.data);
  }
}

async function getWarehouseClient() {
  warehouseClientList.value = [];
  clientWarehouseList.value = [];
  warehouseClientLoading.value = true;
  clientWarehouseLoading.value = true;

  try {
    const { response } = await reportApi.getWarehouseClientQuantity();
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      warehouseClientList.value = (response.data.data.warehouseClientList || []).map((item: any, index: number) => ({
        ...item,
        originalIndex: index + 1
      }));
    }
  } catch {
    // Error handled
  } finally {
    warehouseClientLoading.value = false;
  }

  try {
    const { response } = await reportApi.getClientWarehouseQuantity();
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      clientWarehouseList.value = (response.data.data.warehouseClientList || []).map((item: any, index: number) => ({
        ...item,
        originalIndex: index + 1
      }));
    }
  } catch {
    // Error handled
  } finally {
    clientWarehouseLoading.value = false;
  }
}

function refreshDataList() {
  getClientMonthlyGrowth();
  getClientGroup();
  getProductDownCountHandle();
  getWarehouseClient();
}

onMounted(() => {
  getClientMonthlyGrowth();
  getClientGroup();
  getProductDownCountHandle();
  getWarehouseClient();
});
</script>

<style scoped lang="scss">
.font-xl {
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-container {
  padding: 16px 16px 0;
  background-color: var(--el-bg-color);
}

.header-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.icon-primary {
  color: var(--el-color-primary);
}

.icon-warning {
  color: var(--el-color-warning);
  font-size: 16px;
}

.scroll_table {
  :deep(.table .el-table__body-wrapper) {
    display: none;
  }
  :deep(.el-table--small .el-table__cell) {
    padding: 0;
  }
  .seamless-warp {
    height: 260px;
    background-color: var(--el-bg-color);
    overflow: hidden;
    width: 100%;
  }
  .custom-table {
    .table-row {
      display: flex;
      line-height: 42px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      .table-cell {
        flex: 1;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        &.index-cell {
          flex: 0 0 80px;
        }
        .cell-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
      }
      &.is-striped {
        background-color: var(--el-fill-color-lighter);
      }
    }
  }
}

.no-data {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}

.dashboard-card {
  margin-bottom: 15px;
  :deep(.el-card__body) {
    padding: 0;
    height: 350px;
  }
}
</style>
