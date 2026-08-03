<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="95%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 上半部分：左右两列布局 -->
    <div style="display: flex; flex-direction: row; gap: 20px;">
      <!-- 左侧：预测结果展示 -->
      <div style="width: 50%; min-width: 400px;">
        <div class="custom-card">
          <div class="custom-card-header">
            <span>预测结果可视化</span>
          </div>
        <!-- 历史数据 -->
        <div class="history-data-section">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <h4 style="margin: 0; font-size: 14px; color: #333;">历史数据</h4>
              <el-tooltip placement="top" :content="DATA_FORMAT_DESCRIPTION.format">
                <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
              </el-tooltip>
            </div>
            <el-button @click="updateForecast" type="info" size="mini">更新预测</el-button>
          </div>
          <el-input
            v-model="formData.historyDataText"
            type="textarea"
            :rows="10"
            placeholder="请输入历史数据，每行一个数值..."
            @input="parseHistoryData"
          />
          <div class="param-tip">{{ DATA_FORMAT_DESCRIPTION.note }}</div>
        </div>
        <div class="custom-card-body">
          <!-- 图表容器 -->
          <div ref="chartContainer" style="width: 100%; height: 350px;">
          </div>
        </div>
      </div>
<      </div>

      <!-- 右侧：表单配置 -->
      <div style="width: 50%; min-width: 400px;">
        <div class="custom-card">
          <div class="custom-card-header">
            <span>策略配置</span>
          </div>
          <div class="custom-card-body">
            <el-form
              ref="form"
              :model="formData"
              :rules="rules"
              size="mini"
              label-width="120px">

              <!-- 基本信息 -->
              <el-divider content-position="left">基本信息</el-divider>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="策略名称" prop="strategyName">
                    <el-input
                      v-model="formData.strategyName"
                      placeholder="请输入策略名称"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="仓库" prop="warehouseCode">
                    <el-select
                      v-model="formData.warehouseCode"
                      placeholder="请选择仓库"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in warehouseOptions"
                        :key="item.warehouseCode"
                        :label="item.warehouseName"
                        :value="item.warehouseCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="货主" prop="projectId">
                    <el-select
                      v-model="formData.projectId"
                      placeholder="请选择货主"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.projectId"
                        :label="item.projectName"
                        :value="item.projectId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 预测算法配置 -->
              <el-divider content-position="left">预测参数配置</el-divider>

              <!-- 参数预设 -->
              <div class="preset-section" style="margin-bottom: 20px;">
                <h4>参数预设</h4>
                <div class="preset-buttons">
                  <el-tooltip
                    v-for="preset in presets"
                    :key="preset.key"
                    :content="getPresetInfo(preset.key).usage"
                    placement="top">
                    <el-button
                      size="mini"
                      :type="currentPreset === preset.key ? 'primary' : 'default'"
                      @click="applyPreset(preset)">
                      {{ preset.name }}
                    </el-button>
                  </el-tooltip>
                </div>
              </div>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item>
                    <template slot="label">
                      <span>水平平滑α</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('alpha').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('alpha').usage }}</div>
                          <div style="margin-top: 4px;">📊 推荐: {{ getParameterInfo('alpha').recommendation.medium }}</div>
                          <div style="margin-top: 4px;">⚡ {{ getParameterInfo('alpha').behavior.high }}</div>
                          <div style="margin-top: 4px;">🛡️ {{ getParameterInfo('alpha').behavior.low }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.alpha"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      show-stops
                      @change="updateForecast"
                    />
                    <div class="slider-value">{{ formData.alpha }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template slot="label">
                      <span>趋势平滑β</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('beta').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('beta').usage }}</div>
                          <div style="margin-top: 4px;">📈 推荐: {{ getParameterInfo('beta').recommendation.medium }}</div>
                          <div style="margin-top: 4px;">🚀 {{ getParameterInfo('beta').behavior.strong }}</div>
                          <div style="margin-top: 4px;">🎯 {{ getParameterInfo('beta').behavior.weak }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.beta"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      show-stops
                      @change="updateForecast"
                    />
                    <div class="slider-value">{{ formData.beta }}</div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item>
                    <template slot="label">
                      <span>季节性γ</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('gamma').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('gamma').usage }}</div>
                          <div style="margin-top: 4px;">🌸 推荐: {{ getParameterInfo('gamma').recommendation.medium }}</div>
                          <div style="margin-top: 4px;">🔥 {{ getParameterInfo('gamma').behavior.strong }}</div>
                          <div style="margin-top: 4px;">💧 {{ getParameterInfo('gamma').behavior.weak }}</div>
                          <div style="margin-top: 4px;">⚠️ {{ getParameterInfo('gamma').note }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.gamma"
                      :min="0"
                      :max="1"
                      :step="0.01"
                      show-stops
                      @change="updateForecast"
                    />
                    <div class="slider-value">{{ formData.gamma }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template slot="label">
                      <span>季节周期</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('period').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('period').usage }}</div>
                          <div style="margin-top: 4px;">📅 推荐: {{ getParameterInfo('period').recommendation.monthly }}</div>
                          <div style="margin-top: 4px;">🛒 {{ getParameterInfo('period').examples.week }}</div>
                          <div style="margin-top: 4px;">📊 {{ getParameterInfo('period').examples.year_month }}</div>
                          <div style="margin-top: 4px;">💼 {{ getParameterInfo('period').examples.year_quarter }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-input-number
                      v-model="formData.period"
                      :min="3"
                      :max="30"
                      :step="1"
                      style="width: 100%"
                      @change="updateForecast"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="forecastPeriods">
                    <template slot="label">
                      <span>预测周期数</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('forecastPeriods').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('forecastPeriods').usage }}</div>
                          <div style="margin-top: 4px;">📅 日数据: {{ getParameterInfo('forecastPeriods').recommendation.daily }}</div>
                          <div style="margin-top: 4px;">📊 周数据: {{ getParameterInfo('forecastPeriods').recommendation.weekly }}</div>
                          <div style="margin-top: 4px;">📈 月数据: {{ getParameterInfo('forecastPeriods').recommendation.monthly }}</div>
                          <div style="margin-top: 4px;">🎯 {{ getParameterInfo('forecastPeriods').consideration }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-input-number
                      v-model="formData.forecastPeriods"
                      :min="1"
                      :max="30"
                      :step="1"
                      style="width: 100%"
                      @change="updateForecast"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <template slot="label">
                      <span>阻尼参数φ</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getParameterInfo('phi').description }}</div>
                          <div style="margin-top: 8px;">{{ getParameterInfo('phi').usage }}</div>
                          <div style="margin-top: 4px;">🎯 标准: {{ getParameterInfo('phi').recommendation.standard }}</div>
                          <div style="margin-top: 4px;">🛡️ 保守: {{ getParameterInfo('phi').recommendation.conservative }}</div>
                          <div style="margin-top: 4px;">📈 稳定: {{ getParameterInfo('phi').recommendation.stable }}</div>
                          <div style="margin-top: 4px;">💡 {{ getParameterInfo('phi').purpose }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.phi"
                      :min="0.8"
                      :max="1.0"
                      :step="0.01"
                      show-stops
                      @change="updateForecast"
                    />
                    <div class="slider-value">{{ formData.phi }}</div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="数据周期" prop="dataPeriod">
                    <el-select
                      v-model="formData.dataPeriod"
                      style="width: 100%"
                      @change="updateForecast"
                    >
                      <el-option label="日" value="day" />
                      <el-option label="周" value="week" />
                      <el-option label="月" value="month" />
                      <el-option label="季度" value="quarter" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 库存策略配置 -->
              <el-divider content-position="left">库存策略配置</el-divider>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="leadTime">
                    <template slot="label">
                      <span>提前期</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getInventoryParameterInfo('leadTime').description }}</div>
                          <div style="margin-top: 8px;">{{ getInventoryParameterInfo('leadTime').usage }}</div>
                          <div style="margin-top: 4px;">📦 推荐: {{ getInventoryParameterInfo('leadTime').recommendation.monthly }}</div>
                          <div style="margin-top: 4px;">⏱️ 日补货: {{ getInventoryParameterInfo('leadTime').recommendation.daily }}</div>
                          <div style="margin-top: 4px;">📆 周补货: {{ getInventoryParameterInfo('leadTime').recommendation.weekly }}</div>
                          <div style="margin-top: 4px;">💡 {{ getInventoryParameterInfo('leadTime').optimization }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-input-number
                      v-model="formData.leadTime"
                      :min="1"
                      :max="30"
                      :step="1"
                      style="width: 100%"
                      @change="calculateInventory"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="serviceLevel">
                    <template slot="label">
                      <span>服务水平</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getInventoryParameterInfo('serviceLevel').description }}</div>
                          <div style="margin-top: 8px;">{{ getInventoryParameterInfo('serviceLevel').usage }}</div>
                          <div style="margin-top: 4px;">🎯 推荐: {{ getInventoryParameterInfo('serviceLevel').recommendation.standard }}</div>
                          <div style="margin-top: 4px;">⭐ 关键产品: {{ getInventoryParameterInfo('serviceLevel').recommendation.critical }}</div>
                          <div style="margin-top: 4px;">🔄 灵活产品: {{ getInventoryParameterInfo('serviceLevel').recommendation.flexible }}</div>
                          <div style="margin-top: 4px;">📊 Z值对照: 90%→1.28, 95%→1.65, 99%→2.33</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.serviceLevel"
                      :min="80"
                      :max="99.9"
                      :step="0.1"
                      @change="updateServiceLevel"
                    />
                    <div class="slider-value">{{ formData.serviceLevel }}%</div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="safetyFactor">
                    <template slot="label">
                      <span>安全系数Z</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getInventoryParameterInfo('safetyFactor').description }}</div>
                          <div style="margin-top: 8px;">{{ getInventoryParameterInfo('safetyFactor').usage }}</div>
                          <div style="margin-top: 4px;">🎯 标准: {{ getInventoryParameterInfo('safetyFactor').recommendation.medium }}</div>
                          <div style="margin-top: 4px;">📦 低需求: {{ getInventoryParameterInfo('safetyFactor').recommendation.low }}</div>
                          <div style="margin-top: 4px;">⚠️ 高波动: {{ getInventoryParameterInfo('safetyFactor').recommendation.high }}</div>
                          <div style="margin-top: 4px;">📊 {{ getInventoryParameterInfo('safetyFactor').calculation }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-input-number
                      v-model="formData.safetyFactor"
                      :min="1"
                      :max="3"
                      :step="0.01"
                      :precision="2"
                      style="width: 100%"
                      @change="calculateInventory"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="demandProbability">
                    <template slot="label">
                      <span>需求概率</span>
                      <el-tooltip placement="top">
                        <div slot="content">
                          <div>{{ getInventoryParameterInfo('demandProbability').description }}</div>
                          <div style="margin-top: 8px;">{{ getInventoryParameterInfo('demandProbability').usage }}</div>
                          <div style="margin-top: 4px;">🎯 推荐: {{ getInventoryParameterInfo('demandProbability').recommendation.standard }}</div>
                          <div style="margin-top: 4px;">⭐ 关键产品: {{ getInventoryParameterInfo('demandProbability').recommendation.critical }}</div>
                          <div style="margin-top: 4px;">🔄 灵活产品: {{ getInventoryParameterInfo('demandProbability').recommendation.flexible }}</div>
                          <div style="margin-top: 4px;">📊 计算: {{ getInventoryParameterInfo('demandProbability').calculation }}</div>
                        </div>
                        <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
                      </el-tooltip>
                    </template>
                    <el-slider
                      v-model="formData.demandProbability"
                      :min="0.1"
                      :max="1.0"
                      show-stops
                      :step="0.1"
                      @change="calculateInventory"
                    />
                    <div class="slider-value">{{ formData.demandProbability }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          <!-- 操作按钮 -->
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e8e8e8;">
            <el-button @click="handleClose" size="small">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
          </div>
          </div>
        </div>
      </div>
      <!-- 上半部分结束 -->
    </div>

    <!-- 底部：预测结果报文 -->
    <div style="width: 100%;">
      <div class="custom-card">
        <div class="custom-card-header">
          <span>预测结果报文</span>
        </div>
        <div class="custom-card-body">
          <ForecastResult ref="forecastResultComponent" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as echarts from 'echarts'
import {
  HOLT_WINTERS_PRESETS,
  HOLT_WINTERS_PARAMS,
  INVENTORY_PARAMS,
  INVENTORY_CALCULATION,
  DATA_FORMAT_DESCRIPTION,
  BASIC_OPTIONS,
  DEFAULT_PARAMS,
  SERVICE_LEVEL_CONFIG
} from './constants'
import { calculateHoltWinters } from '@/utils/holtWintersV2'

import ForecastResult from './components/ForecastResult.vue'

export default {
  name: "UpdateOrAdd",
  components: {
    ForecastResult
  },

  data() {
    return {
      submitting: false,
      currentPreset: 'default',
      chart: echarts,
      dialogTitle: '新增策略',
      dialogVisible: false,
      formData: {},
      // 使用导入的预设配置
      presets: Object.keys(HOLT_WINTERS_PRESETS).map(key => ({
        key,
        ...HOLT_WINTERS_PRESETS[key]
      })),
      // 使用导入的基础选项
      warehouseOptions: BASIC_OPTIONS.warehouses,
      projectOptions: BASIC_OPTIONS.projects,
      // 数据状态
      historicalData: [],
      // 预测结果报文数据
      forecastResult: {
        // 算法参数
        algorithm: {
          alpha: '--',           // 水平平滑参数：控制历史数据对当前水平估计的影响程度
          beta: '--',            // 趋势平滑参数：控制历史趋势对当前趋势估计的影响程度
          gamma: '--',           // 季节性平滑参数：控制历史季节性对当前季节性估计的影响程度
          period: '--',          // 季节周期：数据的季节性循环周期长度
          forecastPeriods: '--', // 预测周期数：需要预测的未来时间点数量
          phi: '--'              // 阻尼参数：控制趋势随时间衰减的程度
        },
        // 数据统计
        statistics: {
          mse: '--',             // 均方误差：拟合值与实际值偏差平方的平均值
          rmse: '--',            // 均方根误差：MSE的平方根，与原始数据同量纲
          mape: '--',            // 平均绝对百分比误差：预测准确度指标
          stdError: '--',        // 标准误差：预测值的标准不确定性
          dataPoints: '--',      // 数据点数：参与模型训练的数据点数量
          confidenceLevel: '95%' // 置信水平：预测区间的统计置信度
        },
        // 详细预测数据
        fittedData: [], // 历史拟合详细数据：每个时期的实际值、拟合值、残差等
        forecastData: [],// 未来预测详细数据：每个时期的预测值、置信区间等
        lowerBound: [],
        upperBound: [],
        level: [],
        trend: [],
        seasonal: [],
        forecastLevel: [],
        forecastTrend: [],
      },
      // 表单验证规则
      rules: {
        strategyName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],
        alpha: [
          { required: true, message: '请设置水平平滑参数', trigger: 'change' }
        ],
        beta: [
          { required: true, message: '请设置趋势平滑参数', trigger: 'change' }
        ],
        gamma: [
          { required: true, message: '请设置季节性平滑参数', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请设置季节周期', trigger: 'blur' }
        ],
        forecastPeriods: [
          { required: true, message: '请设置预测周期数', trigger: 'blur' }
        ],
        leadTime: [
          { required: true, message: '请设置提前期', trigger: 'blur' }
        ],
        serviceLevel: [
          { required: true, message: '请设置服务水平', trigger: 'change' }
        ],
        safetyFactor: [
          { required: true, message: '请设置安全库存系数', trigger: 'blur' }
        ],
        demandProbability: [
          { required: true, message: '请设置需求概率阈值', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {

  },
  watch: {
  },
  beforeDestroy() {
    // 清理ECharts实例和事件监听
    if (this.chart) {
      this.chart.dispose();
    }
    window.removeEventListener('resize', this.handleChartResize);
  },
  computed: {
    // 暴露常量到模板中
    HOLT_WINTERS_PARAMS() {
      return HOLT_WINTERS_PARAMS;
    },
    INVENTORY_PARAMS() {
      return INVENTORY_PARAMS;
    },
    INVENTORY_CALCULATION() {
      return INVENTORY_CALCULATION;
    },
    DATA_FORMAT_DESCRIPTION() {
      return DATA_FORMAT_DESCRIPTION;
    },
    BASIC_OPTIONS() {
      return BASIC_OPTIONS;
    },
    DEFAULT_PARAMS() {
      return DEFAULT_PARAMS;
    },
    SERVICE_LEVEL_CONFIG() {
      return SERVICE_LEVEL_CONFIG;
    }
  },
  methods: {
    // 获取参数详细说明
    getParameterInfo(param) {
      return HOLT_WINTERS_PARAMS[param] || {};
    },
    // 获取库存参数详细说明
    getInventoryParameterInfo(param) {
      return INVENTORY_PARAMS[param] || {};
    },
    // 获取预设场景的详细说明
    getPresetInfo(key) {
      return HOLT_WINTERS_PRESETS[key] || {};
    },
    initForm() {
      // 确保historyDataText字段存在
      if (this.formData.historyData) {
        this.formData.historyDataText = this.formData.historyData.join('\n');
      }

      // 设置默认值
      if (!this.formData.id) {
        // 使用常量中定义的默认参数
        const allDefaults = { ...this.DEFAULT_PARAMS.holtwinters, ...this.DEFAULT_PARAMS.inventory };
        Object.keys(allDefaults).forEach(key => {
          if (!this.formData[key]) {
            this.formData[key] = allDefaults[key];
          }
        });
      }

      // 解析历史数据
      this.parseHistoryData();

      // 延迟执行预测，确保图表已经初始化
      this.$nextTick(() => {
        setTimeout(() => {
          this.updateForecast();
        }, 100);
      });
    },

    initChart() {
      if (!this.$refs.chartContainer) {
        console.warn('图表容器未找到');
        return;
      }

      if (!echarts) {
        console.error('ECharts未正确加载');
        this.$message.error('图表库加载失败，请检查echarts依赖');
        return;
      }

      try {
        // 初始化ECharts实例
        this.chart = echarts.init(this.$refs.chartContainer);

        // 设置基础配置
        const option = {
          title: {
            text: '预测结果',
            left: 'center',
            textStyle: {
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['历史数据', '拟合数据', '预测数据', '置信区间上限', '置信区间下限'],
            top: 30
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: []
        };

        this.chart.setOption(option);

        // 监听窗口大小变化
        window.addEventListener('resize', this.handleChartResize);

        console.log('ECharts初始化成功');
      } catch (error) {
        console.error('ECharts初始化失败:', error);
        this.$message.error('图表初始化失败');
      }
    },

    parseHistoryData() {
      if (this.formData.historyDataText) {
        const lines = this.formData.historyDataText.trim().split('\n');
        this.historicalData = lines.map(line => {
          const num = parseFloat(line.trim());
          return isNaN(num) ? 0 : num;
        }).filter(num => num > 0);
      }
    },
    /**
     * 构建Holt-Winters算法输入参数
     * @returns {Object} 算法输入参数
     */
    buildAlgorithmParams() {
      return {
        historicalData: this.historicalData,
        alpha: this.formData.alpha,
        beta: this.formData.beta,
        gamma: this.formData.gamma,
        period: this.formData.period,
        forecastPeriods: this.formData.forecastPeriods,
        phi: this.formData.phi
      };
    },

    /**
     * 处理算法输出结果
     * @param {Object} result - 算法输出结果
     */
    handleAlgorithmResult(result) {
      if (!result.success) {
        this.$message.error(result.message);
        return;
      }
      this.forecastResult = result;
      // 更新组件数据
      this.$refs.forecastResultComponent.updateResult(this.formData, this.historicalData, result);


      // 记录统计信息
      console.log('算法统计信息:', result.statistics);

      // 验证预测值在置信区间中间
      console.log('验证置信区间:');
      for (let i = 0; i < result.forecastData.length; i++) {
        const midPoint = (result.lowerBound[i] + result.upperBound[i]) / 2;
        const difference = Math.abs(midPoint - result.forecastData[i]);
        if (difference > 0.01) { // 允许小的浮点误差
          console.warn(`预测点 ${i+1}: 预测值=${result.forecastData[i]}, 区间中点=${midPoint.toFixed(2)}, 差异=${difference.toFixed(2)}`);
        } else {
          console.log(`预测点 ${i+1}: 预测值在置信区间中间 ✓`);
        }
      }
    },



    /**
     * 执行Holt-Winters预测算法
     */
    calculateHoltWinters() {
      // 构建算法参数
      const params = this.buildAlgorithmParams();

      // 参数验证
      /*const validation = validateParams(params);
      if (!validation.valid) {
        this.$message.error(validation.message);
        return;
      }*/

      // 调用算法
      const result = calculateHoltWinters(params);
      console.log("预测结果：",result)
      // 处理结果
      this.handleAlgorithmResult(result);
    },

    drawChart() {
      if (!this.chart) {
        console.warn('图表实例不存在');
        return;
      }

      try {
        // 准备X轴数据
        const xData = [];
        const n = this.historicalData.length;
        const forecastCount = this.forecastResult.forecastData.length;

        // 历史数据X轴
        for (let i = 0; i < n; i++) {
          xData.push(`T${i + 1}`);
        }

        // 预测数据X轴
        for (let i = 0; i < forecastCount; i++) {
          xData.push(`F${i + 1}`);
        }

        // 准备系列数据
        const historicalData = this.historicalData.map((value, index) => [xData[index], value]);
        const fittedData = this.forecastResult.fittedData.map((item, index) => [xData[index], parseFloat(item)]).filter(item => item && item[1] > 0);
        const forecastData = this.forecastResult.forecastData.map((item, index) => [xData[n + index], parseFloat(item)]);
        const upperBound = this.forecastResult.upperBound.map((item, index) => [xData[n + index], parseFloat(item)]);
        const lowerBound = this.forecastResult.lowerBound.map((item, index) => [xData[n + index], parseFloat(item)]);
        // 更新图表配置
        const option = {
          title: {
            text: '预测结果',
            left: 'center',
            textStyle: {
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: function(params) {
              let result = params[0] ? params[0].name : '';
              params.forEach(param => {
                // 过滤掉填充系列，只显示主要数据系列
                if (param && param.value && param.value[1] !== null && param.value[1] !== undefined &&
                    !param.seriesName.includes('填充')) {
                  result += '<br/>' + param.marker + param.seriesName + ': ' + param.value[1].toFixed(2);
                }
              });
              return result;
            }
          },
          legend: {
            data: ['历史数据', '拟合数据', '预测数据', '置信区间上限', '置信区间下限'],
            top: 30
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '需求量'
          },
          series: [
            {
              name: '历史数据',
              type: 'line',
              data: historicalData,
              itemStyle: {
                color: '#409EFF'
              },
              lineStyle: {
                width: 2
              }
            },
            {
              name: '拟合数据',
              type: 'line',
              data: fittedData,
              itemStyle: {
                color: '#67C23A'
              },
              lineStyle: {
                type: 'dashed',
                width: 1
              }
            },
            {
              name: '置信区间填充-顶部',
              type: 'line',
              data: upperBound,
              lineStyle: {
                opacity: 0
              },
              areaStyle: {
                color: 'rgba(230, 162, 60, 0.2)'
              },
              symbol: 'none',
              showInLegend: false
            },
            {
              name: '置信区间填充-底部',
              type: 'line',
              data: lowerBound.map((val, idx) => upperBound[idx] - val),
              lineStyle: {
                opacity: 0
              },
              areaStyle: {
                color: 'rgba(230, 162, 60, 0.2)'
              },
              stack: 'confidence',
              symbol: 'none',
              showInLegend: false
            },
            {
              name: '置信区间上限',
              type: 'line',
              data: upperBound,
              lineStyle: {
                color: 'rgba(230, 162, 60, 0.8)',
                type: 'dashed',
                width: 1
              },
              symbol: 'none',
              showInLegend: true
            },
            {
              name: '置信区间下限',
              type: 'line',
              data: lowerBound,
              lineStyle: {
                color: 'rgba(243,15,15,0.8)',
                type: 'dashed',
                width: 1
              },
              symbol: 'none',
              showInLegend: true
            },
            {
              name: '预测数据',
              type: 'line',
              data: forecastData,
              itemStyle: {
                color: '#E6A23C'
              },
              lineStyle: {
                width: 3
              }
            }
          ]
        };

        this.chart.setOption(option, true);
        console.log('图表更新成功');
      } catch (error) {
        console.error('图表更新失败:', error);
        this.$message.error('图表更新失败');
      }
    },

    handleChartResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },

    updateForecast() {
      this.parseHistoryData();
      if (this.historicalData.length < 6) {
        this.$message.warning('历史数据不足，请至少输入6个数据点');
        return;
      }

      this.calculateHoltWinters();
      this.drawChart();
      this.calculateInventory();

    },

    calculateInventory() {
        // 调用子组件的库存计算方法
      this.$refs.forecastResultComponent.updateResult(this.formData, this.historicalData, this.forecastResult);
    },

    applyPreset(preset) {
      this.currentPreset = preset.key;
      this.formData.alpha = preset.alpha;
      this.formData.beta = preset.beta;
      this.formData.gamma = preset.gamma;
      this.formData.period = preset.period;

      this.updateForecast();
    },

    updateServiceLevel(value) {
      // 根据服务水平自动调整安全系数
      const levelMap = this.SERVICE_LEVEL_CONFIG.zMap;

      const nearestLevel = Object.keys(levelMap).reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
      });

      this.formData.safetyFactor = levelMap[nearestLevel];
      this.calculateInventory();
    },

    getSafetyFactorDesc() {
      const descriptions = this.SERVICE_LEVEL_CONFIG.descriptions;
      return descriptions[this.formData.safetyFactor] || '自定义服务水平';
    },

    // 兼容inOrders调用模式
    init(type, data) {
      this.dialogVisible = true;

      this.$nextTick(()=>{
        this.formData = {
        id: '',
        strategyName: '',
        warehouseCode: '',
        projectId: '',
        algorithmType: 'holtwinters',
        dataPeriod: 'day',
        forecastPeriods: 1,
        status: 1,
        // Holt-Winters特定参数
        alpha: HOLT_WINTERS_PRESETS.default.alpha,
        beta: HOLT_WINTERS_PRESETS.default.beta,
        gamma: HOLT_WINTERS_PRESETS.default.gamma,
        phi: HOLT_WINTERS_PRESETS.default.phi ? HOLT_WINTERS_PRESETS.default.phi: 0.9,
        period: HOLT_WINTERS_PRESETS.default.period,
        // 库存策略参数
        leadTime: 1,
        serviceLevel: 95,
        safetyFactor: 1.65,
        // 库存计算结果
        safetyStock: 0,
        reorderPoint: 0,
        leadTimeDemand: 0,
        demandProbability:0.3,
        // 历史数据
        historyData: [
          207, 231, 243, 294, 370, 350, 292, 248, 326, 334,
          339, 476, 310, 361, 235, 354, 297, 365, 387, 396,
          286, 286, 354, 492, 371, 342, 297, 367, 323, 300,
          433, 429, 283, 230, 335, 291, 257, 354, 426, 289,
          278, 306, 297, 274, 403, 0, 232, 132, 322, 274,
          255, 306, 296
        ],
        historyDataText:''
      };
        this.initForm();
        this.initChart();
      })
      if (type === 'add') {
        this.dialogTitle = '新增预测策略';
      } else if (type === 'edit') {
        this.dialogTitle = '编辑预测策略';
      }

    },

    handleClose() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    },

    submitForm() {
      const self = this;
      this.$refs.form.validate(function(valid) {
        if (valid) {
          self.submitting = true;

          // 模拟保存操作
          setTimeout(function() {
            if (self.formData.id) {
              self.$message.success('更新成功');
            } else {
              self.$message.success('保存成功');
            }
            self.$emit('success');
            self.dialogVisible = false;
            self.submitting = false;
          }, 500);
        }
      });
    }
  }
}
</script>

<style scoped>
/* 自定义卡片样式 */
.custom-card {
  height: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.custom-card-header {
  padding: 12px 20px;
  border-bottom: 1px solid #e4e7ed;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  background-color: #fafafa;
}

.custom-card-body {
  flex: 1;
  padding: 20px;
  height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 左侧卡片特殊布局 */
.custom-card:first-child .custom-card-body {
  overflow-y: visible;
}

.slider-value {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.param-tip {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.param-tip-detail {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
  font-style: italic;
}

.preset-section {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.preset-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chart-container {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
}

#forecastChart {
  width: 100%;
  height: 100%;
}

.stats-section {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stats-section h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}



.history-data-section {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>
