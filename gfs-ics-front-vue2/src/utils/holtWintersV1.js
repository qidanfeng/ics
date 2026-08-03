/**
 * 修正后的Holt-Winters 算法实现
 *
 * @param {Object} params
 * @returns {Object}
 */
export function calculateHoltWinters({
                                       historicalData,
                                       alpha,
                                       beta,
                                       gamma,
                                       period,
                                       forecastPeriods,
                                       phi
                                     }) {
  const n = historicalData.length;
  const level = new Array(n);
  const trend = new Array(n);
  const seasonal = new Array(period);
  const fittedData = new Array(n);

  // 计算初步的季节性（用移动平均法代替简单平均）
  const seasonAvg = [];
  for (let i = 0; i < n; i++) {
    if (i < period) {
      seasonAvg.push(historicalData.slice(0, i + 1).reduce((sum, value) => sum + value, 0) / (i + 1));
    } else {
      seasonAvg.push(historicalData.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0) / period);
    }
  }

  // 初始化
  level[0] = seasonAvg[0];
  trend[0] = historicalData[1] - historicalData[0];
  for (let i = 0; i < period; i++) seasonal[i] = historicalData[i] - seasonAvg[i];
  fittedData[0] = level[0] + seasonal[0];

  // Holt-Winters 预测
  for (let t = 1; t < n; t++) {
    const sPrev = seasonal[(t - 1) % period];
    level[t] = alpha * (historicalData[t] - sPrev) + (1 - alpha) * (level[t - 1] + phi * trend[t - 1]);
    trend[t] = beta * (level[t] - level[t - 1]) + (1 - beta) * phi * trend[t - 1];
    seasonal[t % period] = gamma * (historicalData[t] - level[t]) + (1 - gamma) * sPrev;
    fittedData[t] = level[t] + seasonal[t % period];
  }

  // 预测未来
  const forecastData = [];
  const lowerBound = [];
  const upperBound = [];
  const forecastLevel = [];
  const forecastTrend = [];
  const forecastSeasonal = [];

  const lastLevel = level[n - 1];
  const lastTrend = trend[n - 1];

  for (let h = 1; h <= forecastPeriods; h++) {
    const season = seasonal[(n + h - 1) % period];
    const trendSum = phi === 1 ? h * lastTrend : (phi * (1 - Math.pow(phi, h)) / (1 - phi)) * lastTrend;
    const meanForecast = lastLevel + trendSum + season;

    forecastData.push(meanForecast);
    forecastLevel.push(meanForecast);
    forecastTrend.push(lastTrend);
    forecastSeasonal.push(season);

    // 计算置信区间上下限（用自定义倍数进行调整）
    const stdError = Math.sqrt(fittedData.reduce((sum, value) => sum + Math.pow(value - meanForecast, 2), 0) / n);
    lowerBound.push(Math.max(0, meanForecast - 2 * stdError));
    upperBound.push(meanForecast + 2 * stdError);
  }

  // 计算误差统计
  const mse = fittedData.reduce((sum, value, index) => sum + Math.pow(historicalData[index] - value, 2), 0) / n;
  const stdError = Math.sqrt(mse);

  // 计算MAE（平均绝对误差）
  const mae = fittedData.reduce((sum, value, index) => sum + Math.abs(historicalData[index] - value), 0) / n;

  // 计算MAPE（平均绝对百分比误差）
  const mape = fittedData.reduce((sum, value, index) => sum + Math.abs((historicalData[index] - value) / historicalData[index]), 0) / n * 100;

  return {
    fittedData,
    forecastData,
    lowerBound,
    upperBound,
    level,
    trend,
    seasonal,
    forecastLevel,
    forecastTrend,
    forecastSeasonal,
    statistics: {
      mse,
      stdError,
      mae,
      mape
    },
    success: true,
    message: 'Holt-Winters 算法计算成功'
  };
}
