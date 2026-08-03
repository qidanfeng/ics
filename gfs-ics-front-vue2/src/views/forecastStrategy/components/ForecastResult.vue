<template>
  <div class="forecast-result">

    <!-- 库存计算结果 -->
    <div class="report-section">
      <h5 class="report-title">库存计算结果</h5>
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">安全库存</div>
            <div class="report-value">{{ inventoryData.safetyStock }}</div>
            <div class="report-desc">安全库存决策模型</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">提前期需求</div>
            <div class="report-value">{{ inventoryData.leadTimeDemand }}</div>
            <div class="report-desc">平均需求 × 提前期</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">再订货点</div>
            <div class="report-value highlight">{{ inventoryData.reorderPoint }}</div>
            <div class="report-desc">提前期需求 + 安全库存</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 详细预测结果 -->
    <div class="report-section">
      <h5 class="report-title">详细预测数据</h5>
      <el-row :gutter="20">
        <!-- 历史拟合数据 -->
        <el-col :span="12">
          <div>
            <h6 class="subsection-title">历史拟合数据</h6>
            <el-table :data="fittedData" size="mini" max-height="250">
              <el-table-column prop="period" label="时期" width="60" />
              <el-table-column prop="actualValue" label="实际值" min-width="80" />
              <el-table-column prop="fittedValue" label="拟合值" min-width="80" />
              <el-table-column prop="residual" label="残差" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="实际值与拟合值之间的差异，反映模型对数据的拟合程度" placement="top">
                    <span>残差<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="水平分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列的基准水平或平均值，反映数据的基本水平" placement="top">
                    <span>水平分量<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="trend" label="趋势分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列的长期变化方向（上升、下降或平稳），捕捉数据的长期趋势" placement="top">
                    <span>趋势分量<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="seasonal" label="季节分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列中周期性重复的波动模式，捕捉数据的季节性规律" placement="top">
                    <span>季节分量<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>

        <!-- 未来预测数据 -->
        <el-col :span="12">
          <div>
            <h6 class="subsection-title">未来预测数据</h6>
            <el-table :data="forecastData" size="mini" max-height="250">
              <el-table-column prop="period" label="预测时期" width="80" />
              <el-table-column prop="forecastValue" label="预测值" min-width="80" />
              <el-table-column prop="lowerBound" label="置信下限" min-width="90" />
              <el-table-column prop="upperBound" label="置信上限" min-width="90" />
              <el-table-column prop="intervalWidth" label="区间宽度" min-width="90" />
              <el-table-column prop="level" label="水平分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列的基准水平或平均值，反映数据的基本水平" placement="top">
                    <span>水平分量 <i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="trend" label="趋势分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列的长期变化方向（上升、下降或平稳），捕捉数据的长期趋势" placement="top">
                    <span>趋势分量<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="seasonal" label="季节分量" min-width="80">
                <template slot="header" slot-scope="scope">
                  <el-tooltip content="代表时间序列中周期性重复的波动模式，捕捉数据的季节性规律" placement="top">
                    <span>季节分量<i class="el-icon-question" style="color: #848486; margin-left: 4px;"></i></span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 算法参数 -->
    <div class="report-section">
      <h5 class="report-title">算法参数</h5>
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">水平平滑α</div>
            <div class="report-value">{{ algorithmData.alpha }}</div>
            <div class="report-desc">控制历史数据对水平估计影响</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">趋势平滑β</div>
            <div class="report-value">{{ algorithmData.beta }}</div>
            <div class="report-desc">控制历史趋势对趋势估计影响</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">季节性γ</div>
            <div class="report-value">{{ algorithmData.gamma }}</div>
            <div class="report-desc">控制历史季节性对季节性估计影响</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">季节周期</div>
            <div class="report-value">{{ algorithmData.period }}</div>
            <div class="report-desc">数据的季节性循环周期长度</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">预测周期数</div>
            <div class="report-value">{{ algorithmData.forecastPeriods }}</div>
            <div class="report-desc">需要预测的未来时间点数量</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">阻尼参数φ</div>
            <div class="report-value">{{ algorithmData.phi }}</div>
            <div class="report-desc">控制趋势随时间衰减的程度</div>
          </div>
        </el-col>
      </el-row>
    </div>


    <!-- 模型评估指标 -->
    <div class="report-section">
      <h5 class="report-title">模型评估指标</h5>
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">均方误差 (MSE)</div>
            <div class="report-value">{{ statisticsData.mse }}</div>
            <div class="report-desc">拟合值与实际值偏差平方的平均值</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">均方根误差 (RMSE)</div>
            <div class="report-value">{{ statisticsData.rmse }}</div>
            <div class="report-desc">MSE的平方根，与原始数据同量纲</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">平均绝对百分比误差 (MAPE)</div>
            <div class="report-value">{{ statisticsData.mape }}%</div>
            <div class="report-desc">预测准确度指标，值越小越准确</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">标准误差</div>
            <div class="report-value">{{ statisticsData.stdError }}</div>
            <div class="report-desc">预测值的标准不确定性</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">历史数据点数</div>
            <div class="report-value">{{ statisticsData.dataPoints }}</div>
            <div class="report-desc">参与模型训练的数据点数量</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-item">
            <div class="report-label">置信水平</div>
            <div class="report-value">{{ statisticsData.confidenceLevel }}</div>
            <div class="report-desc">预测区间的统计置信度</div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { calculateInventoryDecision } from '@/utils/holtWinters'
export default {
  name: 'ForecastResult',
  data() {
    return {
      historicalData:[],
      forecastResult: {
        algorithm: {
          alpha: '--',
          beta: '--',
          gamma: '--',
          period: '--',
          forecastPeriods: '--',
          phi: '--',
          leadTime:'',
          safetyFactor:''
        },
        statistics: {
          mse: '--',
          rmse: '--',
          mape: '--',
          stdError: '--',
          dataPoints: '--',
          confidenceLevel: '95%'
        },
        inventoryData: {
          safetyStock: '--',
          leadTimeDemand: '--',
          reorderPoint: '--'
        },
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

    }
  },
  methods: {
    updateResult(formData, historicalData,result){
      this.updateForecastResult(formData,historicalData,result);
      const { leadTime, safetyFactor } = this.forecastResult.algorithm;
      let param = {
        historicalData:historicalData,
        serviceLevel:formData.serviceLevel/100,
        leadTime:leadTime,
        demandProbability:formData.demandProbability,
        simulations:10000
      }
      let inventoryDecision = calculateInventoryDecision(param);
      this.forecastResult.inventoryData.safetyStock = inventoryDecision.recommendedStock;
      console.log("安全库存计算结果：",inventoryDecision);
      this.calculateInventory()
    },
    calculateInventory() {
    // 获取预测结果数据
    if (!this.forecastResult || !this.forecastResult.statistics) {
      console.log('预测结果数据不存在，跳过库存计算');
      return;
    }

    const { leadTime, safetyFactor } = this.forecastResult.algorithm;

    const { stdError, rmse } = this.forecastResult.statistics;

    console.log('库存计算输入参数:', {
      leadTime,
      safetyFactor,
      stdError,
      rmse,
      forecastResult: this.forecastResult.statistics
    });

    // 检查参数有效性
    if (!leadTime || !safetyFactor) {
      console.log('参数不完整，跳过计算:', { leadTime, safetyFactor });
      return;
    }

    // 解析标准误差
    let demandVariability =  parseFloat(stdError);
    console.log('使用stdError作为需求波动性:', demandVariability);

    // 计算平均需求
    let avgDemand = 0;
    if (this.historicalData && this.historicalData.length > 0) {
      const validData = this.historicalData.filter(val => !isNaN(val) && val > 0);
      if (validData.length > 0) {
        avgDemand = validData.reduce((sum, val) => sum + val, 0) / validData.length;
      }
    }

    // 如果没有有效的历史数据，使用默认值
    if (avgDemand === 0) {
      avgDemand = 100; // 默认平均需求
      console.log('使用默认平均需求:', avgDemand);
    }

    // 计算安全库存 = Z值 × 需求波动性 × √提前期
   // const safetyStock = safetyFactor * demandVariability * Math.sqrt(leadTime);

    // 提前期内的预测需求
    const leadTimeDemand = avgDemand * leadTime;

    // 计算再订货点 = 提前期内的预测需求 + 安全库存
    const reorderPoint = leadTimeDemand + this.forecastResult.inventoryData.safetyStock;

    // 存储计算结果
   // this.forecastResult.inventoryData.safetyStock = safetyStock.toFixed(2);
    this.forecastResult.inventoryData.leadTimeDemand = leadTimeDemand.toFixed(2);
    this.forecastResult.inventoryData.reorderPoint = reorderPoint.toFixed(2);

    console.log('库存策略计算结果:', {
      安全库存: this.forecastResult.inventoryData.safetyStock,
      提前期需求: leadTimeDemand.toFixed(2),
      再订货点: reorderPoint.toFixed(2),
      计算参数: {
        提前期: leadTime,
        安全系数: safetyFactor,
        需求波动性: demandVariability.toFixed(2),
        平均需求: avgDemand.toFixed(2),
        波动性来源: rmse && rmse !== '--' ? 'RMSE' : (stdError && stdError !== '--' ? 'stdError' : '历史数据标准差')
      }
    });
  },
    updateForecastResult(formData, historicalData, result) {
      this.historicalData = historicalData;
      // 更新算法参数
      console.log(formData)
      this.forecastResult.algorithm.alpha = formData.alpha.toFixed(3);
      this.forecastResult.algorithm.beta = formData.beta.toFixed(3);
      this.forecastResult.algorithm.gamma = formData.gamma.toFixed(3);
      this.forecastResult.algorithm.period = formData.period;
      this.forecastResult.algorithm.forecastPeriods = formData.forecastPeriods;
      this.forecastResult.algorithm.phi = formData.phi.toFixed(3);
      this.forecastResult.algorithm.leadTime = formData.leadTime;
      this.forecastResult.algorithm.safetyFactor = formData.safetyFactor;
      console.log(result);
      // 更新数据统计
      const mse = result.statistics.mse;
      const rmse = Math.sqrt(mse);

      // 计算MAPE (平均绝对百分比误差)
      let mape = 0;
      let validMapeCount = 0;
      for (let i = 0; i < historicalData.length; i++) {
        if (historicalData[i] > 0 && result.fittedData[i] > 0) {
          const error = Math.abs(historicalData[i] - result.fittedData[i]);
          const percentageError = error / historicalData[i];
          mape += percentageError;
          validMapeCount++;
        }
      }
      mape = validMapeCount > 0 ? (mape / validMapeCount * 100) : 0;

      this.forecastResult.statistics.mse = mse.toExponential(3);
      this.forecastResult.statistics.rmse = rmse.toFixed(2);
      this.forecastResult.statistics.mape = mape.toFixed(2);
      this.forecastResult.statistics.stdError = result.statistics.stdError.toFixed(2);
      this.forecastResult.statistics.dataPoints = historicalData.length;

      // 生成详细的历史拟合数据
      this.forecastResult.fittedData = [];
      for (let i = 0; i < historicalData.length; i++) {
        if (result.fittedData[i] > 0) {
          const seasonalIndex = i % result.seasonal.length;
          this.forecastResult.fittedData.push({
            period: i + 1,
            actualValue: historicalData[i].toFixed(2),
            fittedValue: result.fittedData[i].toFixed(2),
            residual: (historicalData[i] - result.fittedData[i]).toFixed(2),
            level: result.level ? result.level[i].toFixed(2) : '--',
            trend: result.trend ? result.trend[i].toFixed(2) : '--',
            seasonal: result.seasonal ? result.seasonal[seasonalIndex].toFixed(2) : '--'
          });
        }
      }

      // 生成详细的未来预测数据
      this.forecastResult.forecastData = [];
      for (let i = 0; i < result.forecastData.length; i++) {
        const lower = result.lowerBound[i];
        const upper = result.upperBound[i];
        const intervalWidth = upper - lower;

        this.forecastResult.forecastData.push({
          period: `T+${i + 1}`,
          forecastValue: result.forecastData[i].toFixed(2),
          lowerBound: lower.toFixed(2),
          upperBound: upper.toFixed(2),
          intervalWidth: intervalWidth.toFixed(2),
          level: result.forecastLevel ? result.forecastLevel[i].toFixed(2) : '--',
          trend: result.forecastTrend ? result.forecastTrend[i].toFixed(2) : '--',
          seasonal: result.forecastSeasonal ? result.forecastSeasonal[i].toFixed(2) : '--'
        });
      }
    }
  },
  computed: {
    algorithmData() {
      return this.forecastResult.algorithm || {};
    },
    statisticsData() {
      return this.forecastResult.statistics || {};
    },
    fittedData(){
      return this.forecastResult.fittedData || [];
    },
    forecastData(){
      return this.forecastResult.forecastData || [];
    },
    inventoryData(){
      return this.forecastResult.inventoryData ||
        {
          safetyStock: '--',
          leadTimeDemand: '--',
          reorderPoint: '--'
        };
    }
  }
}
</script>

<style scoped>
.forecast-result {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

/* 预测结果报文样式 */
.report-section {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.report-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.report-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #409EFF;
  font-weight: 600;
  background: #f5f9ff;
  padding: 5px 10px;
  border-radius: 3px;
  border-left: 3px solid #409EFF;
}

.report-item {
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.report-item:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.report-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.report-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.report-value.highlight {
  color: #E6A23C;
  font-weight: 700;
  font-size: 16px;
}

.report-desc {
  font-size: 10px;
  color: #999;
  line-height: 1.3;
  margin-top: 2px;
}


.subsection-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #333;
  font-weight: 600;
  background: #fafafa;
  padding: 4px 8px;
  border-radius: 3px;
  border-left: 2px solid #909399;
}

/* 表格样式优化 */
.el-table {
  font-size: 11px;
}

.el-table th {
  background: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  padding: 6px 0;
}

.el-table td {
  padding: 4px 0;
}

.el-table .cell {
  padding: 0 5px;
  line-height: 1.2;
}
</style>
