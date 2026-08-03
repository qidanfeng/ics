/**
 * Holt-Winters 算法完整实现（三次指数平滑）
 * 支持趋势衰减和季节性调整，返回标准化预测结果
 *
 * @param {Object} params 算法参数配置
 * @returns {Object} 包含拟合数据、预测结果及统计信息的对象
 */
export function calculateHoltWinters({
                                       historicalData,
                                       alpha,
                                       beta,
                                       gamma,
                                       period,
                                       forecastPeriods,
                                       phi = 1 // 默认线性趋势
                                     }) {
  // 参数校验
  if (!historicalData || historicalData.length < 2 * period) {
    throw new Error('历史数据长度必须至少为2倍周期');
  }
  if ([alpha, beta, gamma].some(p => p <= 0 || p > 1)) {
    throw new Error('平滑系数必须在(0, 1]范围内');
  }

  const n = historicalData.length;
  // 初始化数组存储中间结果
  const level = new Array(n);          // 水平分量
  const trend = new Array(n);          // 趋势分量
  const seasonal = new Array(period);  // 季节性分量
  const fittedData = new Array(n);     // 拟合值序列

  // 阶段1：初始化（使用首周期数据计算初始值）
  const initialPeriodData = historicalData.slice(0, period);
  const seasonAvg = initialPeriodData.reduce((sum, val) => sum + val, 0) / period;

  // 初始水平为周期均值
  level[0] = seasonAvg;
  // 初始趋势使用前两个周期的差异
  trend[0] = (historicalData[period] - historicalData[0]) / period;
  // 初始季节性分量为各期与均值的偏差
  for (let i = 0; i < period; i++) {
    seasonal[i] = historicalData[i] - seasonAvg;
  }
  fittedData[0] = level[0] + seasonal[0];

  // 阶段2：平滑迭代计算（更新水平、趋势和季节性分量）
  for (let t = 1; t < n; t++) {
    const seasonIndex = (t - 1) % period; // 上一周期的季节性索引
    // 更新水平分量（包含趋势和季节性调整）
    level[t] = alpha * (historicalData[t] - seasonal[seasonIndex]) +
      (1 - alpha) * (level[t - 1] + phi * trend[t - 1]);
    // 更新趋势分量（考虑趋势衰减）
    trend[t] = beta * (level[t] - level[t - 1]) + (1 - beta) * phi * trend[t - 1];
    // 更新季节性分量
    seasonal[t % period] = gamma * (historicalData[t] - level[t]) +
      (1 - gamma) * seasonal[seasonIndex];
    // 计算拟合值
    fittedData[t] = level[t] + seasonal[t % period];
  }

  // 阶段3：预测未来值
  const forecastData = [];        // 预测结果序列
  const lowerBound = [];          // 置信区间下限
  const upperBound = [];          // 置信区间上限
  const forecastLevel = [];       // 预测期水平分量
  const forecastTrend = [];       // 预测期趋势分量
  const forecastSeasonal = [];    // 预测期季节性分量

  const lastLevel = level[n - 1];
  const lastTrend = trend[n - 1];

  for (let h = 1; h <= forecastPeriods; h++) {
    // 确定预测期对应的季节性分量
    const seasonIndex = (n + h - 1) % period;
    const seasonComponent = seasonal[seasonIndex];

    // 计算趋势累加项（支持线性/指数趋势）
    const trendComponent = phi === 1
      ? h * lastTrend  // 线性趋势
      : (phi * (1 - Math.pow(phi, h)) / (1 - phi)) * lastTrend;  // 指数衰减趋势

    // 预测值 = 水平 + 趋势 + 季节性
    const meanForecast = lastLevel + trendComponent + seasonComponent;

    // 存储预测结果
    forecastData.push(meanForecast);
    forecastLevel.push(lastLevel + trendComponent);
    forecastTrend.push(lastTrend * Math.pow(phi, h));
    forecastSeasonal.push(seasonComponent);

    // 计算95%置信区间（基于拟合误差的标准差）
    const stdError = Math.sqrt(fittedData.reduce(
      (sum, val, idx) => sum + Math.pow(historicalData[idx] - val, 2), 0
    ) / (n - 2));  // 使用自由度n-2
    lowerBound.push(Math.max(0, meanForecast - 1.96 * stdError));  // 非负约束
    upperBound.push(meanForecast + 1.96 * stdError);
  }

  // 阶段4：计算误差统计指标
  const mse = fittedData.reduce(
    (sum, val, idx) => sum + Math.pow(historicalData[idx] - val, 2), 0
  ) / n;
  const stdError = Math.sqrt(mse);
  const mae = fittedData.reduce(
    (sum, val, idx) => sum + Math.abs(historicalData[idx] - val), 0
  ) / n;
  const mape = fittedData.reduce(
    (sum, val, idx) => {
      const actual = historicalData[idx];
      return sum + (actual === 0 ? 0 : Math.abs((actual - val) / actual));
    }, 0
  ) / n * 100;  // 转换为百分比

  // 返回标准化结果
  return {
    fittedData,        // 历史数据拟合值
    forecastData,      // 未来预测值
    lowerBound,        // 预测下限
    upperBound,        // 预测上限
    level,             // 水平分量序列
    trend,             // 趋势分量序列
    seasonal,          // 季节性分量序列
    forecastLevel,     // 预测期水平分量
    forecastTrend,     // 预测期趋势分量
    forecastSeasonal,  // 预测期季节性分量
    statistics: {      // 误差统计指标
      mse,             // 均方误差
      stdError,        // 标准误差
      mae,             // 平均绝对误差
      mape             // 平均绝对百分比误差（%）
    },
    success: true,
    message: 'Holt-Winters 算法计算成功'
  };
}


/**
 * 安全库存决策模型（例如 Croston / TSB）
 * @param {Object} params
 * @returns {Object}
 */
export function calculateInventoryDecision({
                                      historicalData,
                                      serviceLevel,
                                      leadTime,
                                      demandProbability,
                                      simulations
                                    }) {
  // 模拟库存决策计算
  const positiveDemands = historicalData.filter(d => d > 0);
  const totals = [];

  // 蒙特卡洛模拟
  for (let i = 0; i < simulations; i++) {
    let sum = 0;
    for (let t = 0; t < leadTime; t++) {
      if (Math.random() < demandProbability) { // 设定 60% 的概率发生需求
        const idx = Math.floor(Math.random() * positiveDemands.length);
        sum += positiveDemands[idx];
      }
    }
    totals.push(sum);
  }

  totals.sort((a, b) => a - b);

  function quantile(arr, p) {
    const pos = (arr.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    return arr[base + 1] !== undefined
      ? arr[base] + rest * (arr[base + 1] - arr[base])
      : arr[base];
  }

  const recommendedStock = quantile(totals, serviceLevel);

  return {
    recommendedStock
  };
}
