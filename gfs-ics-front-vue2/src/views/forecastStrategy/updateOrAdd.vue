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
        <div class="history-data-section" style="flex: 1; display: flex; flex-direction: column; padding: 10px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 0 10px;">
            <div style="display: flex; align-items: center;">
              <h4 style="margin: 0; font-size: 14px; color: #333;">历史数据</h4>
              <el-tooltip placement="top" content="日期格式：YYYY-MM-DD，值可以为数值">
                <i class="el-icon-question" style="color: #409EFF; margin-left: 4px;"></i>
              </el-tooltip>
            </div>
            <el-button @click="() => updateForecast('forecastOnly')" type="info" size="mini">更新预测</el-button>
          </div>
          <div style="flex: 1; overflow-y: auto; padding: 0 20px; min-height: 0;">
            <el-table
              :data="historyDataTable"
              max-height="500"
              size="mini"
              border
              style="width: 100%; margin: 0 auto;">
              <el-table-column
                prop="date"
                label="日期"
                width="200"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="数值"
                align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.value"
                    size="mini"
                    width="200"
                    :min="0"
                    @change="handleHistoryDataChange"
                    style="width: 120px;"/>
                </template>
              </el-table-column>
            </el-table>
            <div class="param-tip">值可以编辑修改</div>
          </div>
        </div>
        <div class="custom-card-body" style="flex: 1; display: flex; flex-direction: column;">
          <!-- 图表容器 -->
          <div ref="chartContainer" style="width: 100%; height: 100%; margin: auto;">
          </div>
        </div>
      </div>
      </div>

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
              label-width="120px"
              :disabled="isViewMode">

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
                  <el-form-item label="货主" prop="projectId">
                    <el-select @change="handleProjectChange" size="mini" style="width:100%" v-model="formData.projectId" filterable placeholder="请选择货主" clearable>
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.id"
                        :label="item.shortName"
                        :value="item.id">
                        <span style="float: left">{{ item.code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="仓库" prop="warehouseCode">
                    <el-select
                      v-model="formData.warehouseCode"
                      placeholder="请选择仓库"
                      style="width: 100%"
                      @change="() => updateForecast('full')">
                      <el-option
                        v-for="item in warehouseOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        <span style="float: left">{{ item.code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="货品分类" prop="productCategory">
                    <el-select
                      v-model="formData.productCategory"
                      placeholder="请选择货品分类"
                      style="width: 100%"
                      :disabled="!!formData.productNumber"
                      @change="handleCategoryChange"
                      clearable
                      @clear="clearProductCategory"
                      @change.native="() => updateForecast('full')"
                    >
                      <el-option
                        v-for="item in productCategoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品名称" prop="productNumber">
                    <el-select
                      v-model="formData.productNumber"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="输入产品名称模糊搜索"
                      clearable
                      :disabled="!!formData.productCategory"
                      :remote-method="(query) => debounceSearchProductByName(query)"
                      :loading="productCodeLoading"
                      @change="(value) => { fillProductInfo(null,value); updateForecast('full'); }"
                      style="width: 100%">
                      <el-option
                        v-for="item in productCodeOptions"
                        :key="item.productNumber"
                        :label="item.productCnName"
                        :value="item.productNumber">
                        <span style="float: left">{{ item.productNumber }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productCnName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="历史数据天数" prop="historyDays">
                    <el-input-number
                      v-model="formData.historyDays"
                      :min="6"
                      :max="100"
                      :step="1"
                      style="width: 100%"
                      placeholder="请输入历史数据天数"
                      @change="(value) => { handleHistoryDaysChange(value); updateForecast('full'); }"
                    />
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="() => updateForecast('forecastOnly')"
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
                      @change="handleDataPeriodChange"
                    >
                      <el-option
                        v-for="item in dataPeriodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
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

            <!-- 模拟预测参数（独立表单外，查看模式下可编辑） -->
            <el-divider content-position="left">模拟预测参数</el-divider>
            <el-form
              ref="simulationForm"
              :model="formData"
              size="mini"
              label-width="120px">

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="供应商" prop="supplierId">
                    <el-select
                      filterable
                      :filter-method="supplierFilterHandle"
                      @visible-change="supplierOptionsForSelect = supplierOptions"
                      v-model="formData.supplierId"
                      @change="supplierChangeHandle"
                      placeholder="请选择供应商"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in supplierOptionsForSelect"
                        :key="item.id"
                        :label="item.shortName"
                        :value="item.id">
                        <span style="float: left">{{ item.code }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品" prop="simulationProductName">
                    <el-select
                      v-model="formData.simulationProductName"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      placeholder="输入产品名称模糊搜索"
                      :remote-method="(query) => debounceSearchSimulationProductByName(query)"
                      :loading="simulationProductLoading"
                      @change="(value) => { fillSimulationProductInfo(value); updateForecast('full'); }"
                      style="width: 100%">
                      <el-option
                        v-for="item in simulationProductList"
                        :key="item.productId"
                        :label="item.productName"
                        :value="item.productId">
                        <span style="float: left">{{ item.productNumber}}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="订货周期(天)" prop="orderCycleTime">
                    <el-input-number
                      v-model="formData.orderCycleTime"
                      :min="0"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="开始日期" prop="startDate">
                    <el-date-picker
                      v-model="formData.startDate"
                      type="date"
                      placeholder="选择开始日期"
                      style="width: 100%"
                      @change="() => { handleStartDateChange(); updateForecast('full'); }"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束日期" prop="endDate">
                    <el-date-picker
                      v-model="formData.endDate"
                      type="date"
                      placeholder="选择结束日期"
                      style="width: 100%"
                      @change="() => { handleEndDateChange(); updateForecast('full'); }"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          <!-- 操作按钮 -->
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e8e8e8;">
            <el-button @click="handleClose" size="small">{{ isViewMode ? '关闭' : '取消' }}</el-button>
            <el-button v-if="!isViewMode" type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
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
  BASIC_OPTIONS,
  DATA_FORMAT_DESCRIPTION,
  DEFAULT_PARAMS,
  HOLT_WINTERS_PARAMS,
  HOLT_WINTERS_PRESETS,
  INVENTORY_CALCULATION,
  INVENTORY_PARAMS,
  SERVICE_LEVEL_CONFIG,
} from './constants'
import {calculateHoltWinters} from '@/utils/holtWintersV2'
import {mapGetters} from 'vuex'
import API from "@/api";

import ForecastResult from './components/ForecastResult.vue'

export default {
  name: "UpdateOrAdd",
  components: {
    ForecastResult
  },

      data() {
    return {
      submitting: false,
      loadingHistoryData: false,
      currentPreset: 'default',
      chart: echarts,
      dialogTitle: '新增策略',
      dialogVisible: false,
      isViewMode: false, // 是否为查看模式
      formData: {
        // 添加历史数据天数字段
        historyDays: 30
      },
      // 模拟预测参数相关
      supplierOptions: [],
      simulationProductList: [],
      simulationProductLoading: false,
      // 使用导入的预设配置
      presets: Object.keys(HOLT_WINTERS_PRESETS).map(key => ({
        key,
        ...HOLT_WINTERS_PRESETS[key]
      })),
      // 使用导入的基础选项
      warehouseOptions: BASIC_OPTIONS.warehouses,
      supplierOptionsForSelect: [],
      projectOptions: [], // 初始为空数组，通过API加载
      productCategoryOptions: BASIC_OPTIONS.productCategories,
      dataPeriodOptions: [], // 数据周期选项，通过API加载
      // 产品编码搜索相关
      productCodeOptions: [],
      productCodeLoading: false,
      productCodeSearchTimer: null,
      debounceTimer: null,
      // 数据状态
      historicalData: [],
      // 历史数据表格
      historyDataTable: [],
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
        historyDate:[],
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
        productCategory: [
          {
            validator: this.validateProductSelection,
            trigger: 'change'
          }
        ],
        productNumber: [
          {
            validator: this.validateProductSelection,
            trigger: 'change'
          }
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
    'formData.projectId': {
      handler(newVal, oldVal) {
        // 只有在oldVal存在（之前已有货主）且发生变化时才清空
        if (oldVal && newVal !== oldVal) {
          // 清空产品编码和仓库
          this.formData.productNumber = '';
          this.formData.warehouseCode = '';

          if (newVal) {
            // 选择货主后立即加载该货主的所有产品
            this.loadWarehouseOptions();
            this.loadProductsByProject();
          } else {
            // 清空货主时清空产品列表和供应商列表
            this.productCodeOptions = [];
            this.supplierOptions = [];
          }
        } else if (newVal && !oldVal) {
          // 首次设置货主（从null变为有值），不清空仓库
          this.loadWarehouseOptions();
          this.loadProductsByProject();
        }
      },
      immediate: false // 改为false，避免初始化时触发
    },
    'formData.historyDays': {
      handler(newVal, oldVal) {
        // 历史数据天数变化时，重新计算开始日期并重新绘制图表
        if (newVal && this.formData.endDate) {
          this.calculateStartDate();
          // 延迟执行图表重绘，确保日期已经更新
          this.$nextTick(() => {
            if (this.chart) {
              this.drawChart();
            }
          });
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    // 清理ECharts实例和事件监听
    if (this.chart) {
      this.chart.dispose();
    }
    window.removeEventListener('resize', this.handleChartResize);

    // 清理搜索定时器
    if (this.productCodeSearchTimer) {
      clearTimeout(this.productCodeSearchTimer);
    }
  },
  computed: {
    ...mapGetters([
      'client',
    ]),
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
    // 计算开始日期（结束日期为昨天，根据历史天数计算开始日期）
    calculateStartDate() {
      if (!this.formData.endDate || !this.formData.historyDays) {
        return;
      }

      const endDate = new Date(this.formData.endDate);
      const startDate = new Date(endDate);
      // 修正：结束日期减去（历史天数-1）天，保证包含正确的天数范围
      startDate.setDate(endDate.getDate() - (this.formData.historyDays - 1));

      this.formData.startDate = startDate;
    },

    // 开始日期变化处理
    handleStartDateChange(value) {

    },

    // 结束日期变化处理
    handleEndDateChange(value) {

    },

    // 货主变化处理
    handleProjectChange(value) {
      // 清空仓库、产品编码、产品分类等依赖货主的数据
      this.formData.warehouseCode = '';
      this.formData.productNumber = '';
      this.formData.productCategory = '';
      this.formData.projectCode = '';

      // 清空相关选项列表
      this.productCodeOptions = [];
      this.supplierOptions = [];

      // 如果选择了货主，设置货主编码并加载供应商列表和数据周期选项
      if (value) {
        // 根据选择的货主ID找到对应的货主对象，获取编码
        const selectedProject = this.projectOptions.find(item => item.id === value);
        if (selectedProject) {
          this.formData.projectCode = selectedProject.code;
        }
        this.loadSupplierOptions();
      }
    },

    // 加载数据周期选项
    loadDataPeriodOptions() {
      API.orderConstant.getDataPeriodList().then(({ data }) => {
        if (data && data.code === 0 && data.data) {
          this.dataPeriodOptions = data.data.map(item => ({
            label: item.name || item.label,
            value: item.value || item.code
          }));
          // 设置默认值
          if (this.dataPeriodOptions.length > 0 && !this.formData.dataPeriod) {
            this.formData.dataPeriod = this.dataPeriodOptions[0].value;
          }
        }
      }).catch(error => {
        console.error('加载数据周期选项失败:', error);
        this.$message.error('加载数据周期选项失败');
      });
    },

    // 数据周期变化处理
    handleDataPeriodChange(value) {
    },

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
    // 货品分类和产品编码的互斥选择验证
    validateProductSelection(rule, value, callback) {
      const hasCategory = !!this.formData.productCategory;
      const hasCode = !!this.formData.productNumber;

      // 可以两个都不填，但如果填了就只能二选一
      if (hasCategory && hasCode) {
        callback(new Error('货品分类和产品编码只能选择一个'));
      } else {
        callback();
      }
    },
    // 货品分类选择处理
    handleCategoryChange(value) {
      if (value) {
        // 选择了货品分类，清空产品编码
        this.formData.productNumber = '';
        this.productCodeOptions = [];
      }
      // 触发表单验证
      this.$nextTick(() => {
        this.$refs.form.validateField(['productCategory', 'productNumber']);
      });
    },
    // 清除货品分类选择
    clearProductCategory() {
      this.formData.productCategory = '';
      // 触发表单验证
      this.$nextTick(() => {
        this.$refs.form.validateField(['productCategory', 'productNumber']);
      });
    },
    // 产品名称模糊搜索（防抖）
    debounceSearchProductByName(query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchProductByName(query);
      }, 500);
    },

    // 产品名称模糊搜索
    searchProductByName(query) {
      if (!query) {
        this.productCodeOptions = [];
        return;
      }

      // 检查是否选择了货主
      if (!this.formData.projectId) {
        this.$message.warning('请先选择货主');
        this.productCodeOptions = [];
        return;
      }

      // 如果有查询词，进行搜索
      this.productCodeLoading = true;

      // 实际API调用 - 根据产品名称模糊搜索
      API.product.queryEntityByProductCnNameAndCustomerId(query, this.formData.projectId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.productCodeOptions = data.data;
        }
        this.productCodeLoading = false;
      }).catch(error => {
        this.productCodeLoading = false;
        console.error('搜索产品信息失败:', error);
        this.$message.error('搜索产品信息失败');
      });
    },

    // 填充产品信息
    fillProductInfo(product,productNumber) {
      let selectProduct =null;
      if (product){
        selectProduct = product;
      }else if(productNumber){
        selectProduct = this.productCodeOptions.find(product => product.productNumber === productNumber);
      }
      if (selectProduct) {
        this.formData.productNumber = selectProduct.productNumber;
        this.formData.productName = selectProduct.productCnName;
        this.formData.productId = selectProduct.id;
      }
    },

    // 加载当前货主的所有产品
    loadProductsByProject() {
      if (!this.formData.projectId) {
        this.productCodeOptions = [];
        return;
      }

      // 清空产品列表
      this.productCodeOptions = [];
      this.searchProductByName(' ');
    },

    // 处理历史数据天数变化
    handleHistoryDaysChange(value) {
      if (value && value >= 6) {
        // 根据历史数据天数调整图表横坐标长度
        this.updateChartXAxis();
      }
    },

    // 更新图表横坐标
    updateChartXAxis() {
      if (!this.chart) return;

      const option = this.chart.getOption();
      if (option && option.xAxis && option.xAxis[0]) {
        // 生成基于开始日期的日期序列作为横坐标
        const xData = [];
        const historyDays = this.formData.historyDays || 30;

        // 计算历史数据日期范围
        const startDate = new Date(this.formData.startDate);
        const endDate = new Date(this.formData.endDate);

        // 生成历史数据日期序列 - 根据实际选择的开始日期和结束日期生成
        const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        for (let i = 0; i < daysBetween; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          xData.push(this.formatDate(currentDate));
        }

        // 如果有预测数据，添加预测日期
        if (this.forecastResult && this.forecastResult.forecastDetails) {
          this.forecastResult.forecastDetails.forEach(item => {
            if (item.forecastDate && !xData.includes(item.forecastDate)) {
              xData.push(item.forecastDate);
            }
          });
        }

        option.xAxis[0].data = xData;
        this.chart.setOption(option);
      }
    },

    // 模拟预测参数相关方法
    // 供应商选择变化处理
    supplierChangeHandle(value) {
      if (value) {
        // 根据选择的供应商ID查找对应的供应商信息
        const selectedSupplier = this.supplierOptions.find(supplier => supplier.supplierId === value);
        if (selectedSupplier) {
          // 同时赋值给name字段
          this.formData.supplierName = selectedSupplier.supplierName;
          this.formData.supplierCode = selectedSupplier.supplierCode;
        }
      } else {
        // 清空选择时，清空相关字段
        this.formData.supplierName = '';
        this.formData.supplierCode = '';
      }
    },

    // 模拟产品名称模糊搜索（防抖）
    debounceSearchSimulationProductByName(query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchSimulationProductByName(query);
      }, 500);
    },

    // 模拟产品名称模糊搜索
    searchSimulationProductByName(query) {
      if (!query) {
        this.simulationProductList = [];
        return;
      }

      // 检查是否选择了货主和仓库
      if (!this.formData.projectId) {
        this.$message.warning('请先选择货主');
        this.simulationProductList = [];
        return;
      }

      if (!this.formData.warehouseCode) {
        this.$message.warning('请先选择仓库');
        this.simulationProductList = [];
        return;
      }

      // 如果有查询词，进行搜索
      this.simulationProductLoading = true;

      // 使用fuzzyQueryProduct接口进行模糊搜索
      let param = {
        productName: query,
        projectId: this.formData.projectId,
        warehouseCode: this.formData.warehouseCode,
        supplierId: this.formData.supplierId || '',
        clientId: this.client.id
      }

      API.productPriceConfig.fuzzyQueryProduct(param).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.simulationProductList = data.data;
        }
        this.simulationProductLoading = false;
      }).catch(error => {
        this.simulationProductLoading = false;
        console.error('搜索模拟产品信息失败:', error);
        this.$message.error('搜索模拟产品信息失败');
      });
    },

    // 填充模拟产品信息
    fillSimulationProductInfo(value) {
      // 根据选择的产品ID从simulationProductList中查找对应的产品
      const selectProduct = this.simulationProductList.find(product => product.productId === value);
      if (selectProduct) {
        this.formData.simulationProductNumber = selectProduct.productNumber;
        this.formData.simulationProductName = selectProduct.productName;
        this.formData.simulationProductId = selectProduct.productId;
        this.formData.orderCycleTime = selectProduct.orderCycleTime;
      }
    },

    loadWarehouseOptions(){
      let param = {
        externalClientId:this.client.id,
        projectId: this.formData.projectId
      }
      API.warehouse.getActivatedWarehouseByParams(param).then(({data})=>{
        if(data.code == 0 && data.data){
          this.warehouseOptions = data.data;
        }
      }).catch((error)=>{

      });
    },

    // 加载供应商选项
    loadSupplierOptions(){
      if (!this.client.id) {
        this.supplierOptions = [];
        return;
      }
      API.productPriceConfig.getSupplierByClientId(this.client.id).then(({data}) => {
        if (data && data.code === 0) {
          this.supplierOptions = data.data;
          this.supplierOptionsForSelect = this.supplierOptions;
        }
      });
    },

    loadProjectOptions(){
      API.project.getActivatedProjectByClient(this.client.id).then(({data})=>{
        if(data.code == 0 && data.data){
          this.projectOptions= data.data;
        }
      }).catch((error)=>{

      });
    },

    // 从接口获取历史数据
    loadHistoryData() {
      // 验证必要参数
      if (!this.formData.projectId || !this.formData.warehouseCode || !this.formData.simulationProductId || !this.formData.startDate || !this.formData.endDate) {
        this.$message.warning('请先配置产品、仓库和日期范围');
        return;
      }

      // 验证日期范围
      const startDate = new Date(this.formData.startDate);
      const endDate = new Date(this.formData.endDate);
      if (startDate > endDate) {
        this.$message.warning('开始日期不能晚于结束日期');
        return;
      }

      this.submitting = true;

      // 构建请求参数
      const params = {
        clientId: this.client.id,
        clientCode: this.client.code,
        warehouseCode: this.formData.warehouseCode,
        projectId: this.formData.projectId,
        projectCode: this.formData.projectCode || '',
        productId: this.formData.simulationProductId,
        productNumber: this.formData.simulationProductNumber,
        queryDateStart: this.formatDate(this.formData.startDate),
        queryDateEnd: this.formatDate(this.formData.endDate)
      };

      // 并行调用两个接口（历史数据和拟合数据）
      Promise.all([
        API.forecastStrategy.getHisOutStockDataList(params),
        API.forecastRecord.queryForHisForecast(params) // 拟合数据接口
      ]).then(([historyResponse, fittedResponse]) => {
        const historyData = historyResponse.data;
        const fittedData = fittedResponse.data;

        if (historyData && historyData.code === 0 && historyData.data) {
          // 处理历史数据 - 从对象格式转换为表格格式
          this.convertHistoryDataToTable(historyData.data);

          // 处理拟合数据（如果有）
          if (fittedData && fittedData.code === 0 && fittedData.data) {
            const fittedDataArray = fittedData.data;

            if (Array.isArray(fittedDataArray) && fittedDataArray.length > 0) {
              console.log('拟合数据接口返回:', fittedDataArray); // 调试日志

              // 保存拟合数据
              this.forecastResult.fittedDetails = fittedDataArray;
              console.log('拟合数据已保存'); // 调试日志
            } else {
              console.warn('拟合数据为空或格式不正确');
            }
          }

          // 现在调用预测数据接口
          this.callForecastDataApi();

          this.$message.success(`成功获取 ${this.historicalData.length} 条历史数据`);
        } else {
          this.$message.error((historyData && historyData.message) || '获取历史数据失败');
        }
      }).catch(error => {
        console.error('获取数据失败:', error);
        this.$message.error('获取数据失败');
      }).finally(() => {
        this.submitting = false;
      });
    },

    // 将历史数据对象转换为表格格式
    convertHistoryDataToTable(historyDataObject) {
      if (!historyDataObject || typeof historyDataObject !== 'object') {
        this.historyDataTable = [];
        this.historicalData = [];
        return;
      }

      // 转换为表格格式
      this.historyDataTable = Object.entries(historyDataObject)
        .map(([date, value]) => ({
          date: date,
          value: Number(value) || 0
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // 更新图表数据
      this.updateHistoricalDataFromTable();
    },

    // 从表格数据更新历史数据数组
    updateHistoricalDataFromTable() {
      this.historicalData = this.historyDataTable
        .map(item => item.value);
    },

    // 处理历史数据表格变化
    handleHistoryDataChange() {
      this.updateHistoricalDataFromTable();
      if (this.historicalData.length >= 6) {
        // 修改历史数据表格的数值，只调用预测接口
        if (this.formData.projectId && this.formData.warehouseCode && this.formData.simulationProductId && this.formData.startDate && this.formData.endDate) {
          this.callForecastDataApi();
        } else {
          // 否则使用本地计算
          // this.calculateHoltWinters();
          this.drawChart();
          // this.calculateInventory();
        }
      }
    },

    // 格式化日期为 yyyy-MM-dd
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    initForm() {
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

        // 页面加载时设置结束日期为昨天，并根据历史天数计算开始日期
        if (!this.formData.endDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          this.formData.endDate = yesterday;
        }

        if (this.formData.historyDays && this.formData.endDate) {
          this.calculateStartDate();
        }

        // 将默认的历史数据数组转换为表格格式
        this.historyDataTable = this.convertArrayToTable(this.formData.historyData);
        this.updateHistoricalDataFromTable();

        // 延迟执行预测，确保图表已经初始化
        this.$nextTick(() => {
          setTimeout(() => {
            // this.updateForecast();
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
            data: ['历史数据', '拟合数据', '预测数据'],
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

    // 将历史数据数组转换为表格格式（用于手动输入数据）
    convertArrayToTable(dataArray) {
      if (!Array.isArray(dataArray)) {
        return [];
      }

      // 生成日期序列
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dataArray.length);

      return dataArray.map((value, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return {
          date: this.formatDate(date),
          value: Number(value) || 0
        };
      });
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

      // 保留接口返回的预测数据，只更新算法相关字段
      const originalForecastDetails = this.forecastResult.forecastDetails;
      this.forecastResult = {
        ...result,
        forecastDetails: originalForecastDetails // 保留接口返回的预测数据
      };

      // 更新组件数据
      this.$refs.forecastResultComponent.updateResult(this.formData, this.historicalData, this.forecastResult);


      // 记录统计信息
      console.log('算法统计信息:', result.statistics);

      // 验证预测值在置信区间中间
      // console.log('验证置信区间:');
      // for (let i = 0; i < result.forecastData.length; i++) {
      //   const midPoint = (result.lowerBound[i] + result.upperBound[i]) / 2;
      //   const difference = Math.abs(midPoint - result.forecastData[i]);
      //   if (difference > 0.01) { // 允许小的浮点误差
      //     console.warn(`预测点 ${i+1}: 预测值=${result.forecastData[i]}, 区间中点=${midPoint.toFixed(2)}, 差异=${difference.toFixed(2)}`);
      //   } else {
      //     console.log(`预测点 ${i+1}: 预测值在置信区间中间 ✓`);
      //   }
      // }
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
        // 生成基于开始日期的日期序列作为横坐标
        const xData = [];
        const n = this.historicalData.length;
        const historyDays = this.formData.historyDays || 30;

        // 计算历史数据日期范围
        const startDate = new Date(this.formData.startDate);
        const endDate = new Date(this.formData.endDate);

        // 生成历史数据日期序列 - 根据实际选择的开始日期和结束日期生成
        const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        // 清空historyDate数组，避免重复累加
        this.forecastResult.historyDate = [];
        for (let i = 0; i < daysBetween; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          xData.push(this.formatDate(currentDate));
          this.forecastResult.historyDate.push(this.formatDate(currentDate));
        }

        // 生成预测数据日期序列（基于历史数据结束日期的后一天开始）
        const forecastStartDate = new Date(endDate);
        forecastStartDate.setDate(endDate.getDate() + 1);

        // 处理拟合数据和预测数据
        const fittedDataMap = new Map();  // 拟合数据映射（历史日期）
        const forecastDataMap = new Map(); // 预测数据映射（未来日期）

        // 处理拟合数据（历史范围内的数据）
        if (this.forecastResult && this.forecastResult.fittedDetails) {
          if (Array.isArray(this.forecastResult.fittedDetails) && this.forecastResult.fittedDetails.length > 0) {
            console.log('拟合数据:', this.forecastResult.fittedDetails);

            // 获取历史日期范围
            const historyStartDate = new Date(this.formData.startDate);
            const historyEndDate = new Date(this.formData.endDate);

            this.forecastResult.fittedDetails.forEach(item => {
              if (item.forecastDate) {
                const formattedDate = this.formatDate(new Date(item.forecastDate));

                // 只要日期在横坐标中，就作为拟合数据处理
                if (xData.includes(formattedDate)) {
                  // 直接赋值，包括0值
                  fittedDataMap.set(formattedDate, item.forecastQuantity);
                  // console.log(`拟合数据赋值: ${formattedDate} = ${item.forecastQuantity}`);
                }
              }
            });

            // 调试日志：显示拟合数据映射
            console.log('拟合数据映射:', Array.from(fittedDataMap.entries()));
          }
        }

        // 处理预测数据（未来日期的数据）
        if (this.forecastResult && this.forecastResult.forecastDetails) {
          if (Array.isArray(this.forecastResult.forecastDetails) && this.forecastResult.forecastDetails.length > 0) {
            console.log('预测数据:', this.forecastResult.forecastDetails);

            // 获取历史日期范围
            const historyEndDate = new Date(this.formData.endDate);

            this.forecastResult.forecastDetails.forEach(item => {
              if (item.forecastDate) {
                const formattedDate = this.formatDate(new Date(item.forecastDate));
                const itemDate = new Date(item.forecastDate);

                // 只处理未来日期的数据作为预测数据
                if (itemDate > historyEndDate) {
                  // 直接赋值，包括0值（不要用 || null 过滤0值）
                  forecastDataMap.set(formattedDate, item.forecastQuantity);

                  // 将未来日期添加到横坐标（只在第一次时添加）
                  if (!xData.includes(formattedDate)) {
                    xData.push(formattedDate);
                  }
                }
              }
            });
          } else {
            // 没有预测数据时，清空之前添加的未来日期
            const historyEndDate = new Date(this.formData.endDate);
            // 只保留历史日期范围内的日期
            xData = xData.filter(date => new Date(date) <= historyEndDate);
          }
        } else {
          // forecastDetails不存在时，清空之前添加的未来日期
          const historyEndDate = new Date(this.formData.endDate);
          xData = xData.filter(date => new Date(date) <= historyEndDate);
        }

        // 对横坐标日期进行排序
        xData.sort((a, b) => new Date(a) - new Date(b));
        console.log('排序后的横坐标（包含未来日期）:', xData);
        console.log('拟合数据映射:', fittedDataMap);
        console.log('预测数据映射:', forecastDataMap);

        // 准备系列数据
        const historicalData = this.historicalData.map((value, index) => [xData[index], value]);

        // 拟合数据 - 使用接口返回的拟合数据（历史日期范围内）
        const fittedData = [];
        for (let i = 0; i < xData.length; i++) {
          const date = xData[i];
          const fittedValue = fittedDataMap.has(date) ? fittedDataMap.get(date) : null;
          fittedData.push([date, fittedValue]);
        }

        // 预测数据 - 使用接口返回的预测数据（未来日期）
        const forecastData = [];
        for (let i = 0; i < xData.length; i++) {
          const date = xData[i];
          const forecastValue = forecastDataMap.has(date) ? forecastDataMap.get(date) : null;
          forecastData.push([date, forecastValue]);
        }

        console.log('拟合数据:', fittedData); // 调试日志
        console.log('预测数据:', forecastData); // 调试日志

        // this.forecastResult.fittedData =  fittedData;
        //  this.forecastResult.forecastData = forecastData;

        // 置信区间数据
        const upperBound = [];
        const lowerBound = [];

        // 如果接口返回了置信区间数据，使用接口数据；否则使用默认计算的数据
        const hasConfidenceData = this.forecastResult.upperBound && this.forecastResult.lowerBound &&
                                this.forecastResult.upperBound.length > 0 && this.forecastResult.lowerBound.length > 0;

        // 遍历所有横坐标日期，为有预测值的日期生成置信区间
        for (let i = 0; i < xData.length; i++) {
          const date = xData[i];
          if (forecastDataMap.has(date)) {
            const forecastValue = forecastDataMap.get(date);
            if (forecastValue !== null && forecastValue !== undefined) {
              // 使用默认值（预测值的±20%）
              upperBound.push([date, forecastValue * 1.2]);
              lowerBound.push([date, forecastValue * 0.8]);
            }
          }
        }
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
            data: ['历史数据', '拟合数据', '预测数据'],
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
              },
              // 确保0值能够正确显示
              connectNulls: false, // 不连接null值，但显示0值
              symbol: 'circle', // 显示数据点标记
              symbolSize: 4 // 标记大小
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
              },
              // 确保0值能够正确显示和连接
              connectNulls: false, // 不连接null值，但显示0值
              symbol: 'circle', // 显示数据点标记
              symbolSize: 6 // 标记大小
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

    updateForecast(updateType = 'forecastOnly') {
      // updateType 参数说明:
      // - 'full': 完整更新，调用 loadHistoryData 查询历史数据、拟合数据和预测数据
      // - 'forecastOnly': 仅更新预测，只调用预测接口，历史数据和拟合数据保持不变

      // 如果已经配置了产品、仓库和日期范围，则调用预测接口获取预测数据
      if (this.formData.projectId && this.formData.warehouseCode && this.formData.simulationProductId && this.formData.startDate && this.formData.endDate) {
        // 检查是否有历史数据
        if (!this.historicalData || this.historicalData.length === 0) {
          // 没有历史数据，需要先查询历史数据
          this.loadHistoryData();
        } else if (updateType === 'full') {
          // 完整更新：查询历史数据、拟合数据和预测数据
          this.loadHistoryData();
        } else {
          // 仅更新预测数据
          this.callForecastDataApi();
        }
      } else {
         this.$message.warning('请先完善基础信息和模拟预测参数的填写');
      }
    },

    calculateInventory() {
        // 调用子组件的库存计算方法
      this.$refs.forecastResultComponent.updateResult(this.formData, this.historicalData, this.forecastResult);
    },

    /**
     * 调用预测数据接口
     */
    callForecastDataApi() {
      // 构建符合后端DTO要求的预测数据接口参数
      const forecastParams = this.buildForecastApiParams();

      console.log('调用预测数据接口，参数:', forecastParams);

      API.forecastStrategy.forecast(forecastParams)
        .then(({ data }) => {
          if (data && data.code === 0 && data.data) {
            console.log('预测数据接口返回:', data.data);

            // 处理预测数据
            if (data.data.forecastDataList) {
              const dataList = data.data.forecastDataList;
              this.processForecastData(dataList);
            }

            // 处理库存决策数据
            if (data.data.inventoryDecisionData) {
              this.processInventoryDecisionData(data.data.inventoryDecisionData);
            }

            // 更新图表
            this.drawChart();
            // 更新预测报文
            this.calculateInventory();
          } else {
            console.warn('预测数据接口返回格式不正确:', data);
            // 即使没有预测数据，也要更新图表显示历史数据和拟合数据
            this.drawChart();
            this.calculateInventory();
          }
        })
        .catch(error => {
          console.error('调用预测数据接口失败:', error);
          // 即使预测数据接口失败，也要更新图表显示历史数据和拟合数据
          this.drawChart();
          this.calculateInventory();
        });
    },

    /**
     * 处理库存决策数据
     * @param {Object} inventoryDecisionData 后端返回的库存决策数据
     */
    processInventoryDecisionData(inventoryDecisionData) {
      if (inventoryDecisionData && inventoryDecisionData.success) {
        console.log('处理库存决策数据:', inventoryDecisionData);

        // 将真实库存决策数据传递给子组件
        if (this.$refs.forecastResultComponent) {
          this.$refs.forecastResultComponent.updateInventoryDecisionData(inventoryDecisionData);
        }
      } else {
        console.warn('库存决策数据无效或处理失败:', inventoryDecisionData);
        // 如果后端返回的数据无效，继续使用前端计算
        this.calculateInventory();
      }
    },

    /**
     * 构建预测数据接口参数
     * @returns {Object} 符合后端DTO要求的参数对象
     */
    buildForecastApiParams() {
      // 校验必填字段
      this.validateRequiredFields();

      return {
        strategyName: this.formData.strategyName,
        warehouseCode: this.formData.warehouseCode,
        projectId: this.formData.projectId,
        projectCode: this.formData.projectCode || '',
        dataPeriod: this.formData.dataPeriod,
        forecastPeriods: this.formData.forecastPeriods,
        alpha: this.formData.alpha,
        beta: this.formData.beta,
        gamma: this.formData.gamma,
        period: this.formData.period,
        phi: this.formData.phi,
        leadTime: this.formData.leadTime,
        serviceLevel: this.formData.serviceLevel / 100,
        safetyFactor: this.formData.safetyFactor,
        demandProbability: this.formData.demandProbability,
        historyData: this.historicalData,
      };
    },

    /**
     * 校验必填字段
     */
    validateRequiredFields() {
      const requiredFields = [
        { field: 'strategyName', message: '策略名称不能为空' },
        { field: 'warehouseCode', message: '仓库编码不能为空' },
        { field: 'projectId', message: '货主ID不能为空' },
        { field: 'dataPeriod', message: '数据周期不能为空' },
        { field: 'forecastPeriods', message: '预测周期数不能为空' },
        { field: 'alpha', message: '水平平滑参数不能为空' },
        { field: 'beta', message: '趋势平滑参数不能为空' },
        { field: 'gamma', message: '季节性平滑参数不能为空' },
        { field: 'period', message: '季节性周期不能为空' },
        { field: 'phi', message: '阻尼参数不能为空' },
        { field: 'leadTime', message: '提前期不能为空' },
        { field: 'serviceLevel', message: '服务水平不能为空' },
        { field: 'safetyFactor', message: '安全库存系数不能为空' },
        { field: 'demandProbability', message: '需求概率阈值不能为空' }
      ];

      const missingFields = [];

      requiredFields.forEach(({ field, message }) => {
        const value = this.formData[field];
        if (value === null || value === undefined || value === '' ||
            (typeof value === 'number' && isNaN(value))) {
          missingFields.push({ field, message });
        }
      });

      if (missingFields.length > 0) {
        const errorMessages = missingFields.map(item => item.message).join('；');
        this.$message.error(`以下必填字段未填写：${errorMessages}`);
        throw new Error(`必填字段校验失败：${errorMessages}`);
      }

      // 校验历史数据
      if (!this.historicalData || this.historicalData.length === 0) {
        this.$message.error('历史数据不能为空，请先获取历史数据');
        throw new Error('历史数据不能为空');
      }

      // 校验历史数据有效性
      const validHistoricalData = this.historicalData.filter(val =>
        val !== null && val !== undefined && !isNaN(val) && val >= 0
      );

      if (validHistoricalData.length === 0) {
        this.$message.error('历史数据无效，请检查数据格式');
        throw new Error('历史数据无效');
      }
    },

    /**
     * 处理预测数据
     * @param {Array} forecastDataList 预测数据数组
     */
    processForecastData(forecastDataList) {
      if (!Array.isArray(forecastDataList) || forecastDataList.length === 0) {
        console.warn('预测数据为空');
        // 清空旧的预测数据
        this.forecastResult.forecastDetails = [];
        return;
      }

      // 根据预测数据生成预测详情（每次都重新生成，不会追加）
      const forecastDetails = [];
      const endDate = new Date(this.formData.endDate);

      forecastDataList.forEach((value, index) => {
        const forecastDate = new Date(endDate);
        forecastDate.setDate(endDate.getDate() + index + 1); // 从历史数据结束日期的后一天开始

        forecastDetails.push({
          forecastDate: this.formatDate(forecastDate),
          forecastQuantity: value,
        });
      });

      // 完全替换预测数据，不追加
      this.forecastResult.forecastDetails = forecastDetails;
      console.log('处理后的预测数据详情:', forecastDetails);
    },

    /**
     * 模拟预测数据 - 使用拟合数据生成预测数据
     * @param {Array} fittedDataArray 拟合数据数组
     * @param {String} endDate 历史数据结束日期
     * @param {Number} days 预测天数
     */
    generateMockForecastData(fittedDataArray, endDate, days = 7) {
      if (!fittedDataArray || fittedDataArray.length === 0) return [];

      const forecastData = [];
      const end = new Date(endDate);

      // 使用拟合数据的平均值作为预测值
      const avgValue = fittedDataArray.reduce((sum, item) => {
        return sum + (item.forecastQuantity || 0);
      }, 0) / fittedDataArray.length;

      // 生成未来日期的预测数据
      for (let i = 1; i <= days; i++) {
        const forecastDate = new Date(end);
        forecastDate.setDate(end.getDate() + i);

        forecastData.push({
          forecastDate: this.formatDate(forecastDate),
          forecastQuantity: Math.round(avgValue), // 使用平均值作为预测值
          productName: (fittedDataArray[0] && fittedDataArray[0].productName) || '模拟产品',
          productNumber: (fittedDataArray[0] && fittedDataArray[0].productNumber) || '模拟编号'
        });
      }

      return forecastData;
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
        productCategory: '',
        productNumber: '',
        algorithmType: 'holtwinters',
        dataPeriod: 'day',
        forecastPeriods: 1,
        status: 1,
        // 历史数据天数
        historyDays: 30,
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
        // 模拟预测参数
        supplierId: '',
        supplierName: '',
        supplierCode: '',
        simulationProductId: '',
        simulationProductName: '',
        simulationProductNumber: '',
        orderCycleTime: 0,
        // 日期字段
        startDate: new Date(),
        endDate: '',
        // 历史数据
        historyData: [],
        historyDataText:''
      };
        this.initForm();
        this.initChart();

        // 加载货主选项
        this.loadProjectOptions();
        // 加载供应商选项
        this.loadSupplierOptions();
        // 加载数据周期选项
        this.loadDataPeriodOptions();

        // 如果有数据传递过来（编辑或查看模式），填充表单数据
        if (data && (type === 'edit' || type === 'view')) {
          // 然后填充表单数据
          this.$nextTick(() => {
            this.assignFormData(data);
          });
        }
      })
      if (type === 'add') {
        this.dialogTitle = '新增预测策略';
      } else if (type === 'edit') {
        this.dialogTitle = '编辑预测策略';
      } else if (type === 'view') {
        this.dialogTitle = '查看预测策略';
      }

    },

    // 赋值表单数据
    assignFormData(data) {
      if (!data) return;

      // 复制基本字段
      this.formData.id = data.id;
      this.formData.strategyCode = data.strategyCode;
      this.formData.strategyName = data.strategyName;
      this.formData.projectId = data.projectId;
      this.formData.projectCode = data.projectCode;
      this.formData.projectName = data.projectName;
      this.formData.warehouseCode = data.warehouseCode;
      this.formData.warehouseName = data.warehouseName;

      // 货品分类
      this.formData.productTypeDictionaryId = data.productTypeDictionaryId;
      this.formData.productTypeDictionaryName = data.productTypeDictionaryName;
      this.formData.productCategory = data.productTypeDictionaryId;

      // 产品信息
      this.formData.productId = data.productId;
      this.formData.productNumber = data.productNumber;
      this.formData.productCnName = data.productName;
      this.formData.productId = data.productId;

      this.formData.hisDataDays = data.hisDataDays;
      this.formData.historyDays = data.hisDataDays;
      this.formData.dataPeriod = data.dataPeriod || 'day';
      this.formData.forecastPeriods = data.forecastPeriods || 1;
      this.formData.alpha = data.alpha !== undefined ? data.alpha : HOLT_WINTERS_PRESETS.default.alpha;
      this.formData.beta = data.beta !== undefined ? data.beta : HOLT_WINTERS_PRESETS.default.beta;
      this.formData.gamma = data.gamma !== undefined ? data.gamma : HOLT_WINTERS_PRESETS.default.gamma;
      this.formData.period = data.period !== undefined ? data.period : HOLT_WINTERS_PRESETS.default.period;
      this.formData.phi = data.phi !== undefined ? data.phi : 0.9;
      this.formData.serviceLevel = data.serviceLevel !== undefined ? data.serviceLevel * 100 : 95;
      this.formData.safetyFactor = data.safetyFactor !== undefined ? data.safetyFactor : 1.65;
      this.formData.demandProbability = data.demandProbability !== undefined ? data.demandProbability : 0.3;
      this.formData.status = data.status !== undefined ? data.status : 1;

      // 根据类型决定是否禁用表单
      this.isViewMode = this.dialogTitle === '查看预测策略';
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

          // 构建保存参数
          const saveParams = self.buildSaveParams();

          // 根据是否有id决定调用更新还是保存接口
          const apiCall = self.formData.id
            ? API.forecastStrategy.update(saveParams)
            : API.forecastStrategy.save(saveParams);

          apiCall
            .then(({ data }) => {
              if (data && data.code === 0) {
                const message = self.formData.id ? '更新成功' : '保存成功';
                self.$message.success(message);
                self.$emit('success');
                self.dialogVisible = false;
              } else {
                self.$message.error(data.message || '操作失败');
              }
            })
            .catch(error => {
              console.error('操作失败:', error);
              self.$message.error('操作失败');
            })
            .finally(() => {
              self.submitting = false;
            });
        }
      });
    },

    /**
     * 构建保存参数
     */
    buildSaveParams() {
      // 获取当前选中的货主、仓库、产品信息
      const selectedProject = this.projectOptions.find(item => item.id === this.formData.projectId);
      const selectedWarehouse = this.warehouseOptions.find(item => item.code === this.formData.warehouseCode);

      // 根据产品选择方式获取产品信息
      let productId = '';
      let productNumber = '';
      let productName = '';
      let productTypeDictionaryId = '';
      let productTypeDictionaryName = '';

      if (this.formData.productNumber) {
        // 选择了具体产品
        const selectedProduct = this.productCodeOptions.find(item => item.productNumber === this.formData.productNumber);
        if (selectedProduct) {
          productId = selectedProduct.id;
          productNumber = selectedProduct.productNumber;
          productName = selectedProduct.productCnName;
        }
      } else if (this.formData.productCategory) {
        // 选择了货品分类
        const selectedCategory = this.productCategoryOptions.find(item => item.value === this.formData.productCategory);
        if (selectedCategory) {
          productTypeDictionaryId = this.formData.productCategory;
          productTypeDictionaryName = selectedCategory.label;
        }
      }
      return {
        id: this.formData.id,
        strategyCode: this.formData.strategyCode,
        strategyName: this.formData.strategyName,
        clientId: this.client.id,
        clientCode: this.client.code,
        clientName: this.client.cnName,
        warehouseCode: this.formData.warehouseCode,
        warehouseName: selectedWarehouse.name,
        projectId: this.formData.projectId,
        projectCode: selectedProject.code,
        projectName: selectedProject.shortName,
        productTypeDictionaryId: productTypeDictionaryId,
        productTypeDictionaryName: productTypeDictionaryName,
        productId: productId,
        productNumber: productNumber,
        productName: productName,
        algorithmTypeCode: 1, // Holt-Winters算法类型编码
        algorithmTypeName: 'Holt-Winters', // Holt-Winters算法类型名称
        hisDataDays: this.formData.historyDays,
        dataPeriod: this.formData.dataPeriod,
        forecastPeriods: this.formData.forecastPeriods,
        alpha: this.formData.alpha,
        beta: this.formData.beta,
        gamma: this.formData.gamma,
        period: this.formData.period,
        phi: this.formData.phi,
        serviceLevel: this.formData.serviceLevel / 100,
        safetyFactor: this.formData.safetyFactor,
        demandProbability: this.formData.demandProbability,
      };
    },
    supplierFilterHandle(val) {
      if (val) {
        this.supplierOptionsForSelect = this.supplierOptions.filter((item => {
          if (!!~item.supplierCode.indexOf(val) || !!~item.supplierCode.toUpperCase().indexOf(val.toUpperCase()) || !!~item.supplierName.indexOf(val) || !!~item.supplierName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      } else {
        this.supplierOptionsForSelect = this.supplierOptions;
      }
    },
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
