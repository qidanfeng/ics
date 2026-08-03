<template>
  <div :class="className" :style="{ height: height, width: width }" v-loading="dataLoading" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import 'echarts/theme/macarons';

interface Props {
  className?: string;
  width?: string;
  height?: string;
  autoResize?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: 'chart',
  width: '100%',
  height: '350px',
  autoResize: true
});

const chartRef = ref<HTMLElement>();
const dataLoading = ref(false);
let myChart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

defineExpose({
  init: initChart
});

function initChart(data: any) {
  dataLoading.value = true;

  const xAxisData: string[] = [];
  for (let i = 1; i <= 31; i++) {
    xAxisData.push(i + "日");
  }

  if (chartRef.value) {
    if (myChart) {
      myChart.dispose();
    }
    myChart = echarts.init(chartRef.value, null);

    const thisMonthClientList = new Array(31).fill(0);
    const lastMonthClientList = new Array(31).fill(0);

    if (data) {
      data.thisMonthClientVos?.forEach((item: any) => {
        const date = new Date(item.createdTime);
        const day = date.getDate();
        if (xAxisData.includes(day.toString() + "日")) {
          thisMonthClientList[day - 1] = thisMonthClientList[day - 1] + 1;
        }
      });
      data.lastMonthClientVos?.forEach((item: any) => {
        const date = new Date(item.createdTime);
        const day = date.getDate();
        if (xAxisData.includes(day.toString() + "日")) {
          lastMonthClientList[day - 1] = lastMonthClientList[day - 1] + 1;
        }
      });
    }

    setOption(xAxisData, thisMonthClientList, lastMonthClientList);
    setTimeout(() => {
      dataLoading.value = false;
    }, 1000);
  }
}

function setOption(xAxisData: string[], thisMonthClientList: number[], lastMonthClientList: number[]) {
  if (!myChart) return;

  myChart.setOption({
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '18%',
      containLabel: true
    },
    color: ['#409EFF', '#67C23A'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'var(--el-text-color-secondary)'
        }
      }
    },
    legend: {
      data: ['本月', '上月'],
      top: 8,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      selectedMode: true,
      inactiveColor: 'rgba(204,204,204,0.93)',
      selectedColor: '#1989fa' // 选中状态颜色（自定义，比如Element UI的主色）
    },
    series: [
      {
        name: "本月",
        data: thisMonthClientList,
        type: 'line',
        lineStyle: {
          width: 0
        },
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.1)'
            },
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.8)'
            },
          ])
        },
      },
      {
        name: "上月",
        data: lastMonthClientList,
        type: 'line',
        lineStyle: {
          width: 0
        },
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(103, 194, 58, 0.1)'
            },
            {
              offset: 0,
              color: 'rgba(103, 194, 58, 0.8)'
            },
          ])
        },
      }
    ]
  });
}

onMounted(() => {
  if (props.autoResize && chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      myChart?.resize();
    });
    resizeObserver.observe(chartRef.value);
  }
});

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>

</style>
