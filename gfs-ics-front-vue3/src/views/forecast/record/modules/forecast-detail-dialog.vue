<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1600px"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="currentDetailData" class="detail-container">
      <!-- 基本信息 -->
      <el-descriptions :column="3" border size="small" title="基本信息">
        <el-descriptions-item label="供应商">{{ currentDetailData.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{ currentDetailData.warehouseName }}</el-descriptions-item>
        <el-descriptions-item label="货主">{{ currentDetailData.projectName }}</el-descriptions-item>
        <el-descriptions-item label="产品编码">{{ currentDetailData.productNumber }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentDetailData.productName }}</el-descriptions-item>
        <el-descriptions-item label="执行预测日期">{{ currentDate }}</el-descriptions-item>
      </el-descriptions>

      <!-- 历史预测数据 -->
      <div style="margin-top: 20px">
        <h4 style="margin-bottom: 10px">预测记录详情</h4>
        <el-table
          :data="currentDetailData.recordDetailList || []"
          border
          size="small"
          style="width: 100%"
          max-height="300"
        >
          <el-table-column prop="forecastExeTime" label="执行预测时间" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="productNumber" label="产品编码" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="productName" label="产品名称" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="saleEndDate" label="截至售卖日" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="forecastDemandQuantity" label="预测需求数量" width="120" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <span :style="getForecastDemandQuantityStyle(row)">{{ row.forecastDemandQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="hisDataDays" label="历史数据天数" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="dayAverageQuantity" label="日均用量" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="orderCycleTime" label="订货周期" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="safeStockDay" label="安全库存天数" width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="safeStockQuantity" label="安全库存数量" width="120" align="center" show-overflow-tooltip />
          <el-table-column prop="currentQuantity" label="现有库存" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="onTheWayQuantity" label="在途库存" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="minOrderQuantity" label="最小起订量" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" show-overflow-tooltip />
          <el-table-column prop="generatedSuggestionOrderFlagName" label="是否已生成采购订单" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="suggestionOrderNumber" label="采购订单号" width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="forecastSourceName" label="预测来源" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="strategyName" label="预测策略名称" width="150" align="center" show-overflow-tooltip />
          <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip />
          <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineOptions({ name: 'ForecastDetailDialog' });

const dialogVisible = ref(false);
const detailData = ref<any>({});
const currentDate = ref('');

// 静态模拟数据
const mockDetailData = {
  supplierName: '上海鲜达供应链有限公司',
  warehouseName: '上海浦东冷链仓库',
  projectName: '华润万家超市',
  productName: '有机纯牛奶250ml',
  predictValue: 128,
  historyData: [
    {
      saleEndDate: '2026-03-01',
      orderCycleTime: '7天',
      safeStockDay: 3,
      dayAverageQuantity: 110,
      productNumber: 'P001',
      productName: '有机纯牛奶250ml',
      safeStockQuantity: 330,
      forecastDemandQuantity: 120,
      minOrderQuantity: 50,
      currentQuantity: 450,
      onTheWayQuantity: 200,
      unitDictionaryName: '箱'
    },
    {
      saleEndDate: '2026-03-02',
      orderCycleTime: '7天',
      safeStockDay: 3,
      dayAverageQuantity: 125,
      productNumber: 'P001',
      productName: '有机纯牛奶250ml',
      safeStockQuantity: 375,
      forecastDemandQuantity: 135,
      minOrderQuantity: 50,
      currentQuantity: 380,
      onTheWayQuantity: 200,
      unitDictionaryName: '箱'
    },
    {
      saleEndDate: '2026-03-03',
      orderCycleTime: '7天',
      safeStockDay: 3,
      dayAverageQuantity: 98,
      productNumber: 'P001',
      productName: '有机纯牛奶250ml',
      safeStockQuantity: 294,
      forecastDemandQuantity: 98,
      minOrderQuantity: 50,
      currentQuantity: 520,
      onTheWayQuantity: 150,
      unitDictionaryName: '箱'
    }
  ]
};

const dialogTitle = computed(() => '库存预测记录详情');

/** 使用传入数据或模拟数据 */
const currentDetailData = computed(() => {
  if (detailData.value && Object.keys(detailData.value).length > 0) {
    return detailData.value;
  }
  return mockDetailData;
});

/** 初始化弹窗数据（供父组件调用） */
function init(data: any, date: string) {
  dialogVisible.value = true;
  detailData.value = data;
  currentDate.value = date;
}

/** 弹窗关闭处理 */
function handleClose() {
  dialogVisible.value = false;
}

function getDeviation(actual: number, predict: number) {
  return actual - predict;
}

function getDeviationRate(actual: number, predict: number) {
  if (predict === 0) return '-';
  const rate = (((actual - predict) / predict) * 100).toFixed(1);
  return (Number(rate) > 0 ? '+' : '') + rate + '%';
}

function getDeviationColor(actual: number, predict: number) {
  const deviation = Math.abs(actual - predict);
  const rate = deviation / predict;
  if (rate <= 0.1) {
    return '#67C23A'; // 绿色 - 偏差小
  }
  if (rate <= 0.2) {
    return '#E6A23C'; // 黄色 - 偏差中等
  }
  return '#F56C6C'; // 红色 - 偏差大
}

/** 获取预测需求数量文本样式 */
function getForecastDemandQuantityStyle(row: any) {
  let textStyle = 'color:#E6A23C';
  if (row.generatedSuggestionOrderFlag === 1) {
    textStyle = 'color:#42b983';
  }
  return textStyle;
}

defineExpose({ init, getDeviation, getDeviationRate, getDeviationColor });
</script>

<style scoped>
.detail-container {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
