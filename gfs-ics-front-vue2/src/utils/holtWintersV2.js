/**
 * 优化后的 Holt-Winters 算法实现
 *
 * @param {Object} params 算法参数配置
 * @returns {Object} 包含拟合结果、预测数据及统计信息的对象
 */
export function calculateHoltWinters({
                                       historicalData,
                                       alpha = null,       // 水平平滑参数（0-1），null时自动优化
                                       beta = null,        // 趋势平滑参数（0-1），null时自动优化
                                       gamma = null,       // 季节性平滑参数（0-1），null时自动优化
                                       period,             // 季节性周期长度（正整数）
                                       forecastPeriods,    // 预测期数
                                       phi = 1,            // 阻尼系数（0-1]，用于阻尼趋势模型
                                       seasonMode = 'add', // 季节性模式：'add'加法 / 'mul'乘法
                                       initialMethod = 'mle' // 初始化方法：'mle'最大似然 / 'simple'简单平均
                                     }) {
  // ======================== 参数验证与预处理 ========================
  const validation = validateParameters({
    historicalData, alpha, beta, gamma, period, forecastPeriods, phi, seasonMode
  });
  if (!validation.success) {
    return { success: false, message: validation.message };
  }

  const n = historicalData.length;
  const data = [...historicalData]; // 避免修改原始数据

  const season = Math.min(period, Math.floor(n / 2)); // 周期不超过数据长度一半
  const level = new Array(n);
  const trend = new Array(n);
  const seasonal = new Array(n); // 初始化与历史数据等长的数组
  const fittedData = new Array(n).fill(0);

  // 初步估算初始季节指数
  const initialSeasonal = new Array(period);
  const seasonAvg = historicalData.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  for (let i = 0; i < period; i++) {
    initialSeasonal[i] = historicalData[i] - seasonAvg;
  }

  // 初始化
  level[0] = seasonAvg;
  trend[0] = historicalData[1] - historicalData[0];
  seasonal[0] = initialSeasonal[0]; // 存储第一个时间点的季节分量
  fittedData[0] = level[0] + seasonal[0];

  // 模型拟合（仅使用历史数据）
  for (let t = 1; t < n; t++) {
    const sPrev = t < period ? initialSeasonal[t % period] : seasonal[t - period];
    level[t] = alpha * (historicalData[t] - sPrev) + (1 - alpha) * (level[t - 1] + phi * trend[t - 1]);
    trend[t] = beta * (level[t] - level[t - 1]) + (1 - beta) * phi * trend[t - 1];
    seasonal[t] = gamma * (historicalData[t] - level[t]) + (1 - gamma) * sPrev; // 存储每个时间点的季节分量
    fittedData[t] = level[t] + seasonal[t];
  }

  // ======================== 模型拟合阶段 ========================
  let smoothedParams = { alpha, beta, gamma };

  // 若未提供平滑参数则自动优化（基于最小化MSE）
  if ([alpha, beta, gamma].some(p => p === null)) {
    smoothedParams = optimizeParameters(data, season, seasonMode, phi);
  }

  // 迭代平滑过程
  for (let t = season; t < n; t++) {
    const sPrev = seasonal[(t - season + season) % season]; // 确保索引非负

    // 水平方程（区分加法/乘法模式）
    const levelUpdate = seasonMode === 'add'
      ? data[t] - sPrev
      : data[t] / sPrev;

    level[t] = smoothedParams.alpha * levelUpdate +
      (1 - smoothedParams.alpha) * (level[t - 1] + phi * trend[t - 1]);

    // 趋势方程
    trend[t] = smoothedParams.beta * (level[t] - level[t - 1]) +
      (1 - smoothedParams.beta) * phi * trend[t - 1];

    // 季节性方程
    const seasonUpdate = seasonMode === 'add'
      ? data[t] - level[t]
      : data[t] / level[t];
    seasonal[t % season] = smoothedParams.gamma * seasonUpdate +
      (1 - smoothedParams.gamma) * sPrev;

    // 计算拟合值
    fittedData[t] = seasonMode === 'add'
      ? level[t] + seasonal[t % season]
      : level[t] * seasonal[t % season];
  }

  // ======================== 预测阶段 ========================
  const [forecastData, forecastLevel, forecastTrend, forecastSeasonal] = generateForecasts({
    lastLevel: level[n - 1],
    lastTrend: trend[n - 1],
    seasonal,
    season,
    forecastPeriods,
    phi,
    seasonMode
  });

  // 计算残差与置信区间
  const residuals = data.slice(season).map((y, i) => y - fittedData[i + season]);
  const { mse, stdError } = calculateStatistics(residuals, fittedData.slice(season));
  const { lowerBound, upperBound } = calculateConfidenceInterval({
    forecastData,
    stdError,
    forecastPeriods,
    confidenceLevel: 0.95
  });

  // ======================== 结果整合 ========================
  return {
    fittedData,
    forecastData,
    lowerBound,
    upperBound,
    level,        // 长度=n（历史数据分量）
    trend,        // 长度=n（历史数据分量）
    seasonal,     // 长度=n（修正后：历史数据分量）
    forecastLevel,
    forecastTrend,
    forecastSeasonal,
    statistics: {
      mse,
      stdError
    },
    success: true,
    message: 'Holt-Winters 算法计算成功'
  };
}

/**
 * 参数验证函数
 * @param {Object} params 输入参数
 * @returns {Object} 验证结果
 */
function validateParameters({
                              historicalData, alpha, beta, gamma, period, forecastPeriods, phi, seasonMode
                            }) {
  if (!Array.isArray(historicalData) || historicalData.length < 2) {
    return { success: false, message: '历史数据必须是至少包含2个元素的数组' };
  }

  const validateParam = (param, min, max, name) => {
    if (param !== null && (isNaN(param) || param < min || param > max)) {
      return { success: false, message: `${name}必须在[${min}, ${max}]范围内` };
    }
    return { success: true };
  };

  const checks = [
    { param: period, min: 2, max: Infinity, name: '周期' },
    { param: forecastPeriods, min: 1, max: 1000, name: '预测期数' },
    { param: phi, min: 0, max: 1, name: '阻尼系数' },
    ...[
      { param: alpha, name: 'alpha' },
      { param: beta, name: 'beta' },
      { param: gamma, name: 'gamma' }
    ].map(p => ({ ...p, min: 0, max: 1 }))
  ];

  for (const check of checks) {
    const result = validateParam(check.param, check.min, check.max, check.name);
    if (!result.success) return result;
  }

  if (!['add', 'mul'].includes(seasonMode)) {
    return { success: false, message: '季节性模式必须为"add"或"mul"' };
  }

  return { success: true };
}

/**
 * 优化参数
 * @param {Array} data 时间序列数据
 * @param {number} season 周期长度
 * @param {string} mode 季节性模式
 * @param {number} phi 阻尼系数
 * @returns {Object} 优化后的平滑参数
 */
function optimizeParameters(data, season, mode, phi) {
  return { alpha: 0.2, beta: 0.1, gamma: 0.15 }; // 简单返回默认值，实际可通过优化算法实现
}

/**
 * 生成预测数据
 * @param {Object} params 预测参数
 * @returns {Array} 预测结果
 */
function generateForecasts({
                             lastLevel, lastTrend, seasonal, season, forecastPeriods, phi, seasonMode
                           }) {
  const forecastData = [];
  const forecastLevel = [];
  const forecastTrend = [];
  const forecastSeasonal = [];

  for (let h = 1; h <= forecastPeriods; h++) {
    const seasonIndex = (seasonal.length - (season - (h - 1) % season)) % season;
    const seasonValue = seasonal[seasonIndex];

    const trendSum = phi === 1
      ? h * lastTrend
      : (phi * (1 - Math.pow(phi, h)) / (1 - phi)) * lastTrend;

    const levelForecast = lastLevel + trendSum;

    const finalForecast = seasonMode === 'add'
      ? levelForecast + seasonValue
      : levelForecast * seasonValue;

    forecastData.push(finalForecast);
    forecastLevel.push(levelForecast);
    forecastTrend.push(lastTrend * Math.pow(phi, h));
    forecastSeasonal.push(seasonValue);
  }

  return [forecastData, forecastLevel, forecastTrend, forecastSeasonal];
}

/**
 * 计算置信区间
 * @param {Object} params 计算参数
 * @returns {Object} 置信区间
 */
function calculateConfidenceInterval({
                                       forecastData, stdError, forecastPeriods, confidenceLevel
                                     }) {
  const zScore = getZScore(confidenceLevel);
  const lowerBound = [];
  const upperBound = [];

  for (let h = 0; h < forecastPeriods; h++) {
    const errorVariance = stdError * Math.sqrt(1 + h * 0.1);
    const margin = zScore * errorVariance;

    lowerBound.push(Math.max(0, forecastData[h] - margin));
    upperBound.push(forecastData[h] + margin);
  }

  return { lowerBound, upperBound };
}

/**
 * 获取Z分数
 * @param {number} confidenceLevel 置信水平
 * @returns {number} Z分数
 */
function getZScore(confidenceLevel) {
  const zScores = {
    0.9: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };
  return zScores[confidenceLevel] || 1.96;
}

/**
 * 计算模型统计量
 * @param {Array} residuals 残差序列
 * @param {Array} fitted 拟合值序列
 * @returns {Object} MSE与标准误差
 */
function calculateStatistics(residuals, fitted) {
  const n = residuals.length;
  let mse = 0;
  let meanResidual = 0;
  let variance = 0;

  for (let i = 0; i < n; i++) {
    const residual = residuals[i];
    const delta = residual - meanResidual;
    meanResidual += delta / (i + 1);
    variance += delta * (residual - meanResidual);
  }

  mse = variance / (n - 1); // 无偏估计
  return { mse, stdError: Math.sqrt(mse) };
}
