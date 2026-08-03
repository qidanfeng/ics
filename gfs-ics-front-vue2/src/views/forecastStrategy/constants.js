


// 默认参数配置
export const DEFAULT_PARAMS = {
  // Holt-Winters默认参数
  holtwinters: {
    alpha: 0.7,  // 水平平滑参数
    beta: 0.3,   // 趋势平滑参数
    gamma: 0.2,  // 季节性平滑参数
    phi: 0.9,    // 阻尼参数
    period: 7,   // 季节性周期
    forecastPeriods: 12,  // 预测周期数
    minHistoryData: 6     // 最小历史数据要求
  },
  // 库存策略默认参数
  inventory: {
    leadTime: 7,              // 提前期
    serviceLevel: 95,         // 服务水平
    safetyFactor: 1.65,       // 安全库存系数
    demandProbability: 0.3    // 需求概率阈值
  }
};

// 服务水平配置（统一管理）
export const SERVICE_LEVEL_CONFIG = {
  // 服务水平与Z值对应表
  zMap: {
    80: 0.84,
    85: 1.04,
    90: 1.28,
    95: 1.65,
    98: 2.05,
    99: 2.33,
    99.9: 3.09
  },
  // Z值与服务水平描述对照表
  descriptions: {
    0.84: '≈80%服务水平',
    1.04: '≈85%服务水平',
    1.28: '≈90%服务水平',
    1.65: '≈95%服务水平',
    2.05: '≈98%服务水平',
    2.33: '≈99%服务水平',
    3.09: '≈99.9%服务水平'
  },
  // 服务水平详细配置
  levels: [
    { level: 80, factor: 0.84, description: '80%服务水平' },
    { level: 85, factor: 1.04, description: '85%服务水平' },
    { level: 90, factor: 1.28, description: '90%服务水平' },
    { level: 95, factor: 1.65, description: '95%服务水平' },
    { level: 98, factor: 2.05, description: '98%服务水平' },
    { level: 99, factor: 2.33, description: '99%服务水平' },
    { level: 99.9, factor: 3.09, description: '99.9%服务水平' }
  ]
};



// Holt-Winters预设场景配置
export const HOLT_WINTERS_PRESETS = {
  default: {
    name: '默认设置',
    description: '平衡的预测参数，适合大多数场景',
    alpha: 0.7,
    beta: 0.3,
    gamma: 0.2,
    period: 7,
    usage: '适用于需求相对稳定，有轻微季节性波动的常规产品'
  },
  stable: {
    name: '稳定需求',
    description: '适用于需求变化不大的稳定产品',
    alpha: 0.2,
    beta: 0.1,
    gamma: 0.1,
    period: 6,
    usage: '适用于需求变化很小、趋势平缓的基础消费品或工业原料'
  },
  seasonal: {
    name: '强季节性',
    description: '适用于季节性明显的产品',
    alpha: 0.5,
    beta: 0.2,
    gamma: 0.4,
    period: 4,
    usage: '适用于季节性强的产品，如服装、空调、节日商品等'
  },
  trending: {
    name: '增长趋势',
    description: '适用于有明显增长或下降趋势的产品',
    alpha: 0.6,
    beta: 0.4,
    gamma: 0.1,
    period: 6,
    usage: '适用于处于成长期或衰退期的产品，有明显趋势变化'
  },
  volatile: {
    name: '波动市场',
    description: '适用于需求波动较大的产品',
    alpha: 0.8,
    beta: 0.3,
    gamma: 0.1,
    period: 3,
    usage: '适用于需求变化频繁、波动性大的产品，如生鲜、促销品'
  },
  conservative: {
    name: '保守预测',
    description: '适用于预测准确性要求高的关键产品',
    alpha: 0.3,
    beta: 0.2,
    gamma: 0.2,
    period: 6,
    usage: '适用于关键产品或缺货成本高的产品，追求预测稳定性'
  }
};

// Holt-Winters参数详细说明
export const HOLT_WINTERS_PARAMS = {
  alpha: {
    name: '水平平滑参数α',
    description: '控制模型对新数据的响应速度，控制历史数据对当前水平估计的影响权重',
    range: '0-1',
    usage: 'α越大，对近期变化越敏感，响应越快；α越小，历史数据权重越高，预测越平滑',
    behavior: {
      high: '反应快（敏感）: 快速响应需求变化，适合波动大的市场',
      low: '反应慢（稳定）: 平滑处理历史数据，适合需求稳定的产品'
    },
    recommendation: {
      high: '0.7-1.0: 适用于需求变化快、需要快速响应的场景，如时尚品、电子产品',
      medium: '0.3-0.7: 适用于需求变化适中的常规场景，如日用品、食品',
      low: '0.1-0.3: 适用于需求稳定、追求平滑预测的场景，如基础工业原料'
    }
  },
  beta: {
    name: '趋势平滑参数β',
    description: '控制模型对趋势变化的敏感度，控制历史趋势对当前趋势估计的影响权重',
    range: '0-1',
    usage: 'β越大，趋势变化越快被捕捉；β越小，趋势估计越稳定',
    behavior: {
      strong: '强趋势: 快速捕捉和响应趋势变化',
      weak: '弱趋势: 平滑处理趋势变化，避免过度反应'
    },
    recommendation: {
      high: '0.5-1.0: 适用于趋势变化明显的场景，如成长期或衰退期产品',
      medium: '0.2-0.5: 适用于趋势变化适中的场景，如成熟期产品',
      low: '0-0.2: 适用于趋势平缓或无趋势的场景，如基础消费品'
    }
  },
  gamma: {
    name: '季节性平滑参数γ',
    description: '控制模型对季节性波动的敏感度，控制历史季节性对当前季节性估计的影响权重',
    range: '0-1',
    usage: 'γ越大，对季节性变化越敏感；γ越小，季节性模式越稳定',
    behavior: {
      strong: '强季节性: 快速响应季节性波动变化',
      weak: '弱季节性: 平滑处理季节性变化，避免过度拟合'
    },
    recommendation: {
      high: '0.5-1.0: 适用于季节性强的产品，如服装、空调、节日商品、农产品',
      medium: '0.2-0.5: 适用于季节性适中的产品，如部分食品、饮料',
      low: '0-0.2: 适用于季节性弱或无季节性的产品，如工业原料、基础消费品'
    },
    note: '库存预测通常需要较高值以准确捕捉季节性需求波动'
  },
  period: {
    name: '季节性周期',
    description: '季节性重复的周期长度，一个完整季节性模式包含的数据点数量',
    range: '3-30',
    usage: '根据数据的季节性特征设定，如7天周周期、12个月年周期等',
    recommendation: {
      daily: '7: 适用于周度季节性模式（如周末效应）',
      weekly: '52: 适用于年度季节性模式（按周统计）',
      monthly: '12: 适用于年度季节性模式（按月统计）',
      quarterly: '4: 适用于年度季节性模式（按季度统计）'
    },
    examples: {
      week: '7天: 零售业的周度销售模式',
      year_month: '12个月: 大多数商品的年度季节性模式',
      year_quarter: '4个季度: 宏观经济或B2B业务的季度模式'
    }
  },
  phi: {
    name: '阻尼参数φ',
    description: '控制趋势的衰减程度，用于防止长期预测中的趋势过度发散',
    range: '0.8-1.0',
    usage: 'φ值越接近1，趋势衰减越慢；φ值越小，趋势衰减越快',
    purpose: '提高长期预测的稳定性，避免趋势无限延伸导致的不现实预测',
    recommendation: {
      standard: '0.9-0.95: 适用于大多数常规预测场景',
      conservative: '0.8-0.9: 适用于需要更保守长期预测的场景',
      stable: '0.95-1.0: 适用于趋势稳定且可持续的场景'
    }
  },
  forecastPeriods: {
    name: '预测周期数',
    description: '需要预测的未来时间周期数量',
    range: '1-30',
    usage: '根据业务需求和数据周期确定预测时长',
    recommendation: {
      daily: '1-30天: 适用于短期运营计划',
      weekly: '1-13周: 适用于中期库存计划',
      monthly: '1-24个月: 适用于年度业务规划',
      quarterly: '1-8个季度: 适用于长期战略规划'
    },
    consideration: '预测周期越长，不确定性越大，预测精度通常会有所下降'
  }
};

// 库存策略参数详细说明
export const INVENTORY_PARAMS = {
  leadTime: {
    name: '提前期',
    description: '从下单到收货的时间周期数',
    range: '1-30',
    usage: '提前期越长，需要的安全库存越多，再订货点也越高',
    recommendation: {
      daily: '1-7天: 适用于日常补货，快速响应',
      weekly: '1-4周: 适用于定期补货，稳定供应',
      monthly: '1-2个月: 适用于月度计划补货',
      quarterly: '0.5-1个季度: 适用于长期计划补货'
    },
    optimization: '尽量缩短提前期可显著降低安全库存需求和库存持有成本'
  },
  serviceLevel: {
    name: '服务水平',
    description: '满足客户需求的概率，即在100次需求中有多少次不会缺货',
    range: '80%-99.9%',
    usage: '服务水平越高，安全库存越多，缺货风险越低，但库存持有成本也越高',
    zValues: {
      '90%': 1.28,
      '95%': 1.65,
      '98%': 2.05,
      '99%': 2.33,
      '99.9%': 3.09
    },
    recommendation: {
      standard: '95%: 适用于大多数常规产品，平衡成本和服务',
      critical: '99%-99.9%: 适用于关键产品或缺货成本高的产品',
      flexible: '90%-95%: 适用于替代品多或缺货成本低的产品'
    }
  },
  safetyFactor: {
    name: '安全库存系数',
    description: '安全库存计算公式中的Z值，对应特定服务水平的统计系数',
    range: '0.5-3.5',
    usage: 'Z值越大，安全库存越多，应对需求波动的能力越强',
    calculation: '安全库存 = Z值 × 需求标准差 × √提前期',
    recommendation: {
      low: '0.84-1.28: 对应80%-90%服务水平，适用于成本敏感场景',
      medium: '1.65: 对应95%服务水平，适用于标准场景',
      high: '2.33-3.09: 对应99%-99.9%服务水平，适用于关键产品'
    }
  },
  demandProbability: {
    name: '需求概率阈值',
    description: '判断是否备货的最小需求发生概率，低于此概率不建议备货',
    range: '0.1-0.9',
    usage: '需求概率越高，备货决策越积极；需求概率越低，备货决策越保守',
    calculation: '需求概率 = 非零需求数量 / 总数据点数',
    recommendation: {
      standard: '0.2-0.4: 适用于大多数常规产品，平衡备货与成本',
      critical: '0.1-0.2: 适用于高价值或关键产品，降低备货风险',
      flexible: '0.4-0.6: 适用于需求稳定的产品，提高备货积极性'
    },
    examples: {
      low: '0.1: 需求稀疏产品，如奢侈品、特种设备',
      medium: '0.3: 常规消费品，如日用品、标准件',
      high: '0.5: 高频需求产品，如快消品、办公用品'
    }
  }
};

// 数据格式说明
export const DATA_FORMAT_DESCRIPTION = {
  format: '每行一个数值，代表一个时间周期的需求量',
  supportedDimensions: ['天维度', '周度', '月度', '季度维度'],
  examples: {
    daily: '105\n112\n98\n124\n118\n132\n125\n141\n135\n152',
    weekly: '735\n784\n686\n868\n826\n924\n875\n987\n945\n1064',
    monthly: '354\n492\n371\n342\n297\n367\n323\n300\n433\n429\n283\n230',
    quarterly: '1062\n1476\n1113\n1026\n891\n1101\n969\n900\n1299\n1287\n849\n690'
  },
  note: '数据应按时间顺序排列，不能有空值或异常值'
};

// 库存补货策略计算说明
export const INVENTORY_CALCULATION = {
  safetyStock: {
    name: '安全库存 (Safety Stock)',
    description: '为应对需求不确定性而设置的额外库存',
    purpose: '防止因需求波动或提前期变化导致的缺货',
    formula: '安全库存 = Z值 × 需求标准差 × √提前期',
    impact: '安全库存越高，缺货风险越低，但库存持有成本也越高'
  },
  reorderPoint: {
    name: '再订货点 (Reorder Point)',
    description: '触发补货的库存水平',
    purpose: '当库存降至再订货点时，应立即下单补货，防止在提前期内缺货',
    formula: '再订货点 = 提前期内的预测需求 + 安全库存',
    timing: '需要考虑补货提前期，确保在库存耗尽前新货到达'
  },
  leadTimeDemand: {
    name: '提前期需求 (Lead Time Demand)',
    description: '提前期内的预测需求总量',
    purpose: '计算在补货提前期内需要的库存量',
    formula: '提前期需求 = 平均需求 × 提前期',
    consideration: '需要考虑季节性和趋势对提前期内需求的影响'
  },
  orderQuantity: {
    name: '建议订货量',
    description: '建议的每次订货数量',
    purpose: '平衡订货成本和库存持有成本',
    factors: '考虑经济订货量(EOQ)、存储容量、资金占用等因素'
  }
};

// 基础数据选项
export const BASIC_OPTIONS = {
  warehouses: [
    { warehouseCode: 'WH001', warehouseName: '北京仓库' },
    { warehouseCode: 'WH002', warehouseName: '上海仓库' },
    { warehouseCode: 'WH003', warehouseName: '广州仓库' }
  ],
  projects: [
    { projectId: 'PJ001', projectName: '货主A' },
    { projectId: 'PJ002', projectName: '货主B' },
    { projectId: 'PJ003', projectName: '货主C' }
  ]
};