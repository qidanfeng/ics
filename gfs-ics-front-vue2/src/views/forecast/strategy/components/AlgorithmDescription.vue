<template>
  <div class="algorithm-description">
    <!-- SMA算法说明 -->
    <div v-if="algorithmType === 'sma'" class="algorithm-info sma-info">
      <h4>简单移动平均（SMA）算法说明</h4>

      <!-- 第一部分：参数意义 -->
<!--      <div class="parameter-meaning-section">-->
<!--        <h5>一、参数意义与作用</h5>-->
<!--        <ul>-->
<!--          <li><strong>数据周期：</strong>历史数据的时间单位（日/周/月）。决定预测的时间粒度，影响预测精度和响应速度。</li>-->
<!--          <li><strong>预测周期数：</strong>需要预测的未来周期数量。SMA适合短期预测（1-4周期），长期预测准确性会下降。</li>-->
<!--          <li><strong>窗口大小：</strong>计算移动平均时使用的历史数据数量。窗口越大，预测越平滑但响应越慢；窗口越小，响应快但波动大。</li>-->
<!--          <li><strong>最小历史数据：</strong>进行预测所需的最小历史数据量。SMA要求历史数据≥窗口大小才能开始预测。</li>-->
<!--          <li><strong>安全库存系数：</strong>控制服务水平的关键参数。1.28≈90%服务水平，1.65≈95%服务水平，2.33≈99%服务水平。</li>-->
<!--          <li><strong>提前期：</strong>从下单到收货的时间周期，单位与数据周期一致。影响安全库存的缓冲时间。</li>-->
<!--        </ul>-->
<!--      </div>-->

      <!-- 第二部分：配置方法 -->
<!--      <div class="configuration-method-section">-->
<!--        <h5>二、参数配置方法</h5>-->
<!--        <ul>-->
<!--          <li><strong>数据周期选择：</strong>-->
<!--            <ul>-->
<!--              <li>日：适合快速变化、高频需求商品（如生鲜、快消品）</li>-->
<!--              <li>周：适合中等变化频率商品（如办公用品、常规商品）</li>-->
<!--              <li>月：适合稳定需求、低频变化商品（如工业原料、耐用品）</li>-->
<!--            </ul>-->
<!--          </li>-->
<!--          <li><strong>窗口大小配置：</strong>-->
<!--            <ul>-->
<!--              <li>稳定需求：6~10个周期（平滑效果更好）</li>-->
<!--              <li>轻微波动：4~6个周期（平衡平滑与响应）</li>-->
<!--              <li>较大波动：2~3个周期（快速响应变化）</li>-->
<!--            </ul>-->
<!--          </li>-->
<!--          <li><strong>安全库存系数配置：</strong>-->
<!--            <ul>-->
<!--              <li>关键商品：2.33（99%服务水平，缺货风险极低）</li>-->
<!--              <li>常规商品：1.65（95%服务水平，平衡成本与服务）</li>-->
<!--              <li>非关键商品：1.28（90%服务水平，成本优先）</li>-->
<!--            </ul>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

      <!-- 第三部分：场景示例 -->
<!--      <div class="scenario-example-section">-->
<!--        <h5>三、不同场景配置示例</h5>-->

<!--        <div class="scenario-item">-->
<!--          <h6>场景1：稳定需求商品（办公耗材）</h6>-->
<!--          <ul>-->
<!--            <li><strong>商品特点：</strong>月需求稳定在500件左右，无明显趋势</li>-->
<!--            <li><strong>配置参数：</strong>数据周期=月，窗口大小=6，预测周期数=3，最小历史数据=6</li>-->
<!--            <li><strong>库存策略：</strong>安全库存系数=1.65(95%)，提前期=2个月</li>-->
<!--            <li><strong>适用性：</strong>SMA算法最适合此类稳定需求商品</li>-->
<!--          </ul>-->
<!--        </div>-->

<!--        <div class="scenario-item">-->
<!--          <h6>场景2：快速响应商品（生鲜食品）</h6>-->
<!--          <ul>-->
<!--            <li><strong>商品特点：</strong>日需求波动较大，需要快速响应</li>-->
<!--            <li><strong>配置参数：</strong>数据周期=日，窗口大小=3，预测周期数=7，最小历史数据=3</li>-->
<!--            <li><strong>库存策略：</strong>安全库存系数=2.33(99%)，提前期=1天</li>-->
<!--            <li><strong>适用性：</strong>SMA可快速响应，但可能不如EWMA准确</li>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 第四部分：完整计算流程 -->
      <div class="inventory-calculation-section">
        <h3>完整计算流程示例</h3>

        <div class="complete-calculation-example">
<!--          <h6>完整计算示例：办公耗材场景</h6>-->
<!--          <p><strong>场景背景：</strong>某办公耗材月需求稳定，需要预测未来3个月的库存需求</p>-->

          <div class="parameter-configuration">
            <h4>1. 参数配置</h4>
            <ul>
              <li><strong>数据周期：</strong>周</li>
              <li><strong>历史数据周期数：</strong>2（使用2周历史数据计算日均用量）</li>
              <li><strong>安全库存天数：</strong>5</li>
              <li><strong>订货周期：</strong>10（从下单到收货需要10天）</li>
              <li><strong>截至售卖日：</strong>2025-11-30（预计产品支持售卖到2025-11-30，且到2025-11-30时，期望库内实时库存>=订货周期天数*日均用量+产品安全库存天数*日均用量）</li>
            </ul>
          </div>
          <div class="forecast-calculation">
            <h4>2. 日均用量计算</h4>
            <p><strong>历史数据：2025-11-03至2025-11-16</strong>过去2周的出库量(箱)：[14,12,20,0,39,0,0,19,11,13,0,16,0,0]</p>
            <p><strong>日均用量计算：</strong>(14,12,20,0,39,0,0,19,11,13,0,16,0,0) ÷ 14 = 144 ÷ 14 = 10.2 ≈ 11箱；计算结果为向上取整</p>
            <p><strong>计算结果：</strong>日均用量为11箱</p>
          </div>

<!--          <div class="safety-stock-calculation">-->
<!--            <h6>3. 安全库存计算</h6>-->
<!--            <p><strong>预测误差标准差：</strong>基于历史预测误差计算得出标准差为15</p>-->
<!--            <p><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</p>-->
<!--            <p><strong>计算过程：</strong>15 × 1.65 × √2 ≈ 15 × 1.65 × 1.41 ≈ 35单位</p>-->
<!--          </div>-->

          <div class="final-inventory-calculation">
            <h4>3. 库存需求计算</h4>
            <p><strong>当天：2025-11-17；当前库内实时库存：100箱； 在途库存：50箱</strong></p>
            <p><strong>2025-11-17 至 2025-11-30的预测出库量：</strong>14*11=154箱</p>
            <p><strong>订货周期天数*日均用量+产品安全库存天数*日均用量：</strong>10*11+5*11=165箱</p>
            <p><strong>预测需求量计算公式：</strong>截至售卖日的预测出库量 + 订货周期天数*日均用量 + 产品安全库存天数*日均用量 - 当前库内实时库存 - 在途库存</p>
            <p><strong>预测需求量：</strong>154 + 165 - 100 - 50 = 169箱</p>
            <p><strong>总需求：</strong>169箱（满足截至售卖到2025-11-30的预测需求量）</p>
          </div>
        </div>

<!--        <div class="formula-explanation">-->
<!--          <h6>关键公式说明：</h6>-->
<!--          <ul>-->
<!--            <li><strong>SMA预测公式：</strong>预测值 = (历史数据1 + 历史数据2 + ... + 历史数据n) ÷ n</li>-->
<!--            <li><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</li>-->
<!--            <li><strong>总库存需求：</strong>总需求 = 预测采购量 + 安全库存</li>-->
<!--          </ul>-->
<!--        </div>-->
      </div>
    </div>

    <!-- WMA算法说明 -->
    <div v-if="algorithmType === 'wma'" class="algorithm-info wma-info">
      <h4>加权移动平均（WMA）算法说明</h4>

      <!-- 第一部分：参数意义 -->
      <div class="parameter-meaning-section">
        <h5>一、参数意义与作用</h5>
        <ul>
          <li><strong>数据周期：</strong>历史数据的时间单位（日/周/月）。决定预测的时间粒度，影响预测精度和响应速度。</li>
          <li><strong>预测周期数：</strong>需要预测的未来周期数量。WMA适合中短期预测（2-6周期），能较好捕捉趋势变化。</li>
          <li><strong>窗口大小：</strong>计算加权平均时使用的历史数据数量。窗口大小影响趋势识别的灵敏度。</li>
          <li><strong>权重配置：</strong>各历史周期的权重分配。近期数据权重应更高，权重总和必须为1。</li>
          <li><strong>最小历史数据：</strong>进行预测所需的最小历史数据量。WMA要求历史数据≥窗口大小+1。</li>
          <li><strong>安全库存系数：</strong>控制服务水平的关键参数。1.28≈90%服务水平，1.65≈95%服务水平，2.33≈99%服务水平。</li>
          <li><strong>提前期：</strong>从下单到收货的时间周期，单位与数据周期一致。WMA算法对趋势敏感，提前期设置应考虑趋势持续性。</li>
        </ul>
      </div>

      <!-- 第二部分：配置方法 -->
      <div class="configuration-method-section">
        <h5>二、参数配置方法</h5>
        <ul>
          <li><strong>数据周期选择：</strong>
            <ul>
              <li>日：适合有明显日趋势商品（如生鲜、促销品）</li>
              <li>周：适合有周趋势商品（如电子产品、常规商品）</li>
              <li>月：适合有月趋势商品（如季节性服装、大宗商品）</li>
            </ul>
          </li>
          <li><strong>权重配置方法：</strong>
            <ul>
              <li>线性递减：如[0.4,0.3,0.2,0.1]（窗口大小=4）</li>
              <li>指数递减：如[0.5,0.25,0.125,0.125]（窗口大小=4）</li>
              <li>自定义配置：根据业务经验调整权重分配</li>
            </ul>
          </li>
          <li><strong>安全库存系数配置：</strong>
            <ul>
              <li>快速变化商品：1.28-1.65（90-95%服务水平）</li>
              <li>稳定趋势商品：1.65-2.33（95-99%服务水平）</li>
              <li>关键商品：2.33（99%服务水平，缺货风险极低）</li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 第三部分：场景示例 -->
      <div class="scenario-example-section">
        <h5>三、不同场景配置示例</h5>

        <div class="scenario-item">
          <h6>场景1：轻微上升趋势商品（电子产品配件）</h6>
          <ul>
            <li><strong>商品特点：</strong>月需求微涨5%，有轻微上升趋势</li>
            <li><strong>配置参数：</strong>数据周期=月，窗口大小=4，权重=[0.4,0.3,0.2,0.1]，预测周期数=3，最小历史数据=5</li>
            <li><strong>库存策略：</strong>安全库存系数=1.65(95%)，提前期=2个月</li>
            <li><strong>适用性：</strong>WMA算法能较好捕捉轻微上升趋势</li>
          </ul>
        </div>

        <div class="scenario-item">
          <h6>场景2：快速响应商品（生鲜食品）</h6>
          <ul>
            <li><strong>商品特点：</strong>日需求波动大，需要快速响应变化</li>
            <li><strong>配置参数：</strong>数据周期=日，窗口大小=3，权重=[0.6,0.3,0.1]，预测周期数=7，最小历史数据=4</li>
            <li><strong>库存策略：</strong>安全库存系数=2.33(99%)，提前期=1天</li>
            <li><strong>适用性：</strong>WMA能快速响应日变化，优于SMA</li>
          </ul>
        </div>
      </div>

      <!-- 第四部分：完整计算流程 -->
      <div class="inventory-calculation-section">
        <h5>四、完整计算流程示例</h5>

        <div class="complete-calculation-example">
          <h6>完整计算示例：电子产品配件场景</h6>
          <p><strong>场景背景：</strong>某电子产品配件月需求有轻微上升趋势，需要预测未来3个月的库存需求</p>

          <div class="parameter-configuration">
            <h6>1. 参数配置</h6>
            <ul>
              <li><strong>数据周期：</strong>月（适合有趋势的商品）</li>
              <li><strong>预测周期数：</strong>3（预测未来3个月的每月需求量）</li>
              <li><strong>窗口大小：</strong>4（使用4个月历史数据计算加权平均）</li>
              <li><strong>权重配置：</strong>[0.4,0.3,0.2,0.1]（近期数据权重更高）</li>
              <li><strong>最小历史数据：</strong>5（需要至少5个月数据才能开始预测）</li>
              <li><strong>安全库存系数：</strong>1.65（95%服务水平）</li>
              <li><strong>提前期：</strong>2个月（从下单到收货需要2个月）</li>
            </ul>
          </div>

          <div class="forecast-calculation">
            <h6>2. WMA预测计算</h6>
            <p><strong>历史数据：</strong>过去4个月的月需求量：[520, 540, 560, 580]</p>
            <p><strong>WMA计算：</strong>520×0.1 + 540×0.2 + 560×0.3 + 580×0.4 = 52 + 108 + 168 + 232 = 560单位</p>
            <p><strong>预测结果：</strong>未来3个月的每月预测需求量均为560单位</p>
          </div>

          <div class="safety-stock-calculation">
            <h6>3. 安全库存计算</h6>
            <p><strong>预测误差标准差：</strong>基于历史预测误差计算得出标准差为18</p>
            <p><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</p>
            <p><strong>计算过程：</strong>18 × 1.65 × √2 ≈ 18 × 1.65 × 1.41 ≈ 42单位</p>
          </div>

          <div class="final-inventory-calculation">
            <h6>4. 最终库存需求计算</h6>
            <p><strong>总库存需求 = 预测采购量 + 安全库存</strong></p>
            <p><strong>第一个月：</strong>560 + 42 = 602单位</p>
            <p><strong>第二个月：</strong>560 + 42 = 602单位</p>
            <p><strong>第三个月：</strong>560 + 42 = 602单位</p>
            <p><strong>总需求：</strong>602 × 3 = 1806单位（未来3个月总库存需求）</p>
          </div>
        </div>

        <div class="formula-explanation">
          <h6>关键公式说明：</h6>
          <ul>
            <li><strong>WMA预测公式：</strong>预测值 = ∑(历史数据ᵢ × 权重ᵢ)</li>
            <li><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</li>
            <li><strong>总库存需求：</strong>总需求 = 预测采购量 + 安全库存</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- EWMA算法说明 -->
    <div v-if="algorithmType === 'ewma'" class="algorithm-info ewma-info">
      <h4>指数移动平均（EWMA）算法说明</h4>

      <!-- 第一部分：参数意义 -->
      <div class="parameter-meaning-section">
        <h5>一、参数意义与作用</h5>
        <ul>
          <li><strong>数据周期：</strong>历史数据的时间单位（日/周/月）。决定预测的时间粒度，影响预测精度和响应速度。</li>
          <li><strong>预测周期数：</strong>需要预测的未来周期数量。EWMA适合中短期预测（3-8周期），能较好捕捉趋势变化。</li>
          <li><strong>平滑系数α：</strong>控制近期数据权重的关键参数。α越大，近期数据权重越高，响应越快；α越小，历史数据权重越高，预测越平滑。<strong>仅适用于EWMA预测方法。</strong></li>
          <li><strong>最小历史数据：</strong>进行预测所需的最小历史数据量。EWMA理论上可处理较少数据，但建议≥3个周期。</li>
          <li><strong>安全库存系数：</strong>控制服务水平的关键参数。1.28≈90%服务水平，1.65≈95%服务水平，2.33≈99%服务水平。</li>
          <li><strong>提前期：</strong>从下单到收货的时间周期，单位与数据周期一致。EWMA算法对趋势敏感，提前期设置应考虑趋势持续性。</li>
        </ul>
      </div>

      <!-- 第二部分：配置方法 -->
      <div class="configuration-method-section">
        <h5>二、参数配置方法</h5>
        <ul>
          <li><strong>数据周期选择：</strong>
            <ul>
              <li>日：适合有明显日趋势商品（如生鲜、促销品）</li>
              <li>周：适合有周趋势商品（如电子产品、常规商品）</li>
              <li>月：适合有月趋势商品（如季节性服装、大宗商品）</li>
            </ul>
          </li>
          <li><strong>平滑系数配置（仅EWMA方法）：</strong>
            <ul>
              <li>稳定需求：0.1~0.3（平滑效果更好）</li>
              <li>轻微趋势：0.4~0.6（平衡平滑与响应）</li>
              <li>明显趋势：0.7~0.9（快速响应变化）</li>
            </ul>
          </li>
          <li><strong>安全库存系数配置：</strong>
            <ul>
              <li>快速变化商品：1.28-1.65（90-95%服务水平）</li>
              <li>稳定趋势商品：1.65-2.33（95-99%服务水平）</li>
              <li>关键商品：2.33（99%服务水平，缺货风险极低）</li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 第三部分：场景示例 -->
      <div class="scenario-example-section">
        <h5>三、不同场景配置示例</h5>

        <div class="scenario-item">
          <h6>场景1：明显上升趋势商品（爆款日用品）</h6>
          <ul>
            <li><strong>商品特点：</strong>月需求稳定增长8%，有明显上升趋势</li>
            <li><strong>配置参数：</strong>数据周期=月，平滑系数=0.7，预测周期数=4，最小历史数据=5</li>
            <li><strong>库存策略：</strong>安全库存系数=2.33(99%)，提前期=2个月</li>
            <li><strong>适用性：</strong>EWMA算法最适合此类有明显趋势的商品</li>
          </ul>
        </div>

        <div class="scenario-item">
          <h6>场景2：快速响应商品（生鲜食品）</h6>
          <ul>
            <li><strong>商品特点：</strong>日需求波动大，需要快速响应变化</li>
            <li><strong>配置参数：</strong>数据周期=日，平滑系数=0.8，预测周期数=7，最小历史数据=3</li>
            <li><strong>库存策略：</strong>安全库存系数=1.65(95%)，提前期=1天</li>
            <li><strong>适用性：</strong>EWMA能快速响应日变化，优于SMA/WMA</li>
          </ul>
        </div>
      </div>

      <!-- 第四部分：完整计算流程 -->
      <div class="inventory-calculation-section">
        <h5>四、完整计算流程示例</h5>

        <div class="complete-calculation-example">
          <h6>完整计算示例：爆款日用品场景</h6>
          <p><strong>场景背景：</strong>某爆款日用品月需求有明显上升趋势，需要预测未来4个月的库存需求</p>

          <div class="parameter-configuration">
            <h6>1. 参数配置</h6>
            <ul>
              <li><strong>数据周期：</strong>月（适合有明显趋势的商品）</li>
              <li><strong>预测周期数：</strong>4（预测未来4个月的每月需求量）</li>
              <li><strong>平滑系数α：</strong>0.7（快速响应趋势变化）</li>
              <li><strong>最小历史数据：</strong>5（需要至少5个月数据才能开始预测）</li>
              <li><strong>安全库存系数：</strong>2.33（99%服务水平）</li>
              <li><strong>提前期：</strong>2个月（从下单到收货需要2个月）</li>
            </ul>
          </div>

          <div class="forecast-calculation">
            <h6>2. {{ getMethodName(selectedForecastMethod) }}计算</h6>
            <p><strong>历史数据：</strong>过去5个月的月需求量：[750, 780, 810, 840, 870]</p>

            <!-- EWMA预测详细计算 -->
            <div v-if="selectedForecastMethod === 'ewma'">
              <p><strong>EWMA计算过程：</strong></p>
              <ul>
                <li>EWMA₁ = 750（初始值）</li>
                <li>EWMA₂ = 0.7×780 + 0.3×750 = 546 + 225 = 771</li>
                <li>EWMA₃ = 0.7×810 + 0.3×771 = 567 + 231.3 = 798.3</li>
                <li>EWMA₄ = 0.7×840 + 0.3×798.3 = 588 + 239.5 = 827.5</li>
                <li>EWMA₅ = 0.7×870 + 0.3×827.5 = 609 + 248.3 = 857.3</li>
              </ul>
              <p><strong>预测逻辑：</strong>使用最后一个EWMA值（857.3）作为未来4个月的预测值</p>
            </div>

            <!-- 趋势预测详细计算 -->
            <div v-if="selectedForecastMethod === 'trend'">
              <p><strong>趋势预测计算过程：</strong></p>
              <p>使用线性回归计算趋势线：y = a + bx</p>
              <ul>
                <li>数据点：x=[0,1,2,3,4], y=[750,780,810,840,870]</li>
                <li>n=5, ∑x=10, ∑y=4050, ∑xy=8400, ∑x²=30</li>
                <li>斜率b = (5×8400 - 10×4050) ÷ (5×30 - 10×10) = (42000 - 40500) ÷ (150 - 100) = 1500 ÷ 50 = 30</li>
                <li>截距a = (4050 - 30×10) ÷ 5 = (4050 - 300) ÷ 5 = 3750 ÷ 5 = 750</li>
                <li>趋势方程：y = 750 + 30x</li>
              </ul>
              <p><strong>预测计算：</strong></p>
              <ul>
                <li>第6个月(x=5): 750 + 30×5 = 750 + 150 = 900</li>
                <li>第7个月(x=6): 750 + 30×6 = 750 + 180 = 930</li>
                <li>第8个月(x=7): 750 + 30×7 = 750 + 210 = 960</li>
                <li>第9个月(x=8): 750 + 30×8 = 750 + 240 = 990</li>
              </ul>
            </div>

            <p><strong>预测结果：</strong>未来4个月的每月预测需求量：
              <span class="forecast-values">{{ formatForecasts(forecastResults[selectedForecastMethod]) }}</span>
              单位（基于{{ getMethodDescription(selectedForecastMethod) }}）
            </p>
          </div>

          <div class="safety-stock-calculation">
            <h6>3. 安全库存计算</h6>
            <p><strong>预测误差标准差：</strong>基于历史预测误差计算得出标准差为12</p>
            <p><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</p>
            <p><strong>计算过程：</strong>12 × 2.33 × √2 ≈ 12 × 2.33 × 1.41 ≈ 39单位</p>
          </div>

          <div class="final-inventory-calculation">
            <h6>4. 最终库存需求计算</h6>
            <p><strong>总库存需求 = 预测采购量 + 安全库存</strong></p>
            <p><strong>第一个月：</strong>857 + 39 = 896单位</p>
            <p><strong>第二个月：</strong>857 + 39 = 896单位</p>
            <p><strong>第三个月：</strong>857 + 39 = 896单位</p>
            <p><strong>第四个月：</strong>857 + 39 = 896单位</p>
            <p><strong>总需求：</strong>896 × 4 = 3584单位（未来4个月总库存需求）</p>
          </div>
        </div>

        <div class="formula-explanation">
          <h6>关键公式说明：</h6>
          <ul>
            <li><strong>EWMA预测公式：</strong>EWMAₜ = α×实际值ₜ + (1-α)×EWMAₜ₋₁</li>
            <li><strong>安全库存公式：</strong>安全库存 = 预测误差标准差 × 安全库存系数 × √(提前期)</li>
            <li><strong>总库存需求：</strong>总需求 = 预测采购量 + 安全库存</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlgorithmDescription',
  props: {
    algorithmType: {
      type: String,
      default: 'sma'
    },
    selectedForecastMethod: {
      type: String,
      default: 'sma'
    },
    forecastResults: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getMethodName(method) {
      const methodMap = {
        'ewma': 'EWMA',
        'trend': '趋势预测'
      }
      return methodMap[method] || '预测'
    },

    getMethodDescription(method) {
      const descMap = {
        'ewma': 'EWMA算法',
        'trend': '线性趋势分析'
      }
      return descMap[method] || '所选方法'
    },

    formatForecasts(forecasts) {
      if (!forecasts || !Array.isArray(forecasts)) return ''
      return forecasts.map(f => Math.round(f)).join(' → ')
    }
  }
}
</script>

<style scoped>
.algorithm-description {
  margin-top: 20px;
}

.algorithm-info {
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.parameter-meaning-section,
.configuration-method-section,
.scenario-example-section,
.inventory-calculation-section {
  margin-bottom: 30px;
}

.scenario-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-left: 4px solid #409EFF;
}

.complete-calculation-example {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}

.forecast-values {
  font-weight: bold;
  color: #409EFF;
}
</style>
