<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <!-- 第一行：库存预测统计 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="inventory-prediction-card">
            <div class="prediction-header">
              <div class="prediction-title">库存预测统计</div>
              <el-dropdown trigger="click" @command="handlePredictionCommand">
                <span class="el-dropdown-link">
                  未来30天<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="7">未来7天</el-dropdown-item>
                  <el-dropdown-item command="30">未来30天</el-dropdown-item>
                  <el-dropdown-item command="90">未来90天</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="prediction-stats">
              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <i class="el-icon-s-data"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">总库存</div>
                  <div class="stat-value">{{ inventoryStats.total }}件</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <i class="el-icon-shopping-cart-2"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">预测需求</div>
                  <div class="stat-value">{{ inventoryStats.predictedDemand }}件</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                  <i class="el-icon-box"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">安全库存</div>
                  <div class="stat-value">{{ inventoryStats.safetyStock }}件</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                  <i class="el-icon-warning"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">缺货风险</div>
                  <div class="stat-value">{{ inventoryStats.shortageRisk }}%</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 待添加：库存周转率 -->
        <el-col :span="8">
          <div class="inventory-prediction-card">
            <div class="prediction-header">
              <div class="prediction-title">库存周转分析</div>
              <el-dropdown trigger="click" @command="handleTurnoverCommand">
                <span class="el-dropdown-link">
                  本月<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="week">本周</el-dropdown-item>
                  <el-dropdown-item command="month">本月</el-dropdown-item>
                  <el-dropdown-item command="quarter">本季度</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="prediction-stats">
              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);">
                  <i class="el-icon-refresh"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">库存周转率</div>
                  <div class="stat-value">{{ turnoverStats.turnoverRate }}次</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #a8e6cf 0%, #56ab2f 100%);">
                  <i class="el-icon-timer"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">平均周转天数</div>
                  <div class="stat-value">{{ turnoverStats.avgTurnoverDays }}天</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ffd93d 0%, #f9a825 100%);">
                  <i class="el-icon-money"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">库存成本</div>
                  <div class="stat-value">{{ turnoverStats.inventoryCost }}万</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #6a89cc 0%, #4a69bd 100%);">
                  <i class="el-icon-sold-out"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">呆滞库存占比</div>
                  <div class="stat-value">{{ turnoverStats.slowMovingPercent }}%</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 待添加：订单处理效率 -->
        <el-col :span="8">
          <div class="inventory-prediction-card">
            <div class="prediction-header">
              <div class="prediction-title">订单处理效率</div>
              <el-dropdown trigger="click" @command="handleOrderCommand">
                <span class="el-dropdown-link">
                  今日<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="today">今日</el-dropdown-item>
                  <el-dropdown-item command="week">本周</el-dropdown-item>
                  <el-dropdown-item command="month">本月</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="prediction-stats">
              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);">
                  <i class="el-icon-s-order"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">待处理订单</div>
                  <div class="stat-value">{{ orderStats.pendingOrders }}单</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);">
                  <i class="el-icon-ship"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">平均处理时间</div>
                  <div class="stat-value">{{ orderStats.avgProcessTime }}小时</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);">
                  <i class="el-icon-check"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">订单满足率</div>
                  <div class="stat-value">{{ orderStats.fulfillmentRate }}%</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);">
                  <i class="el-icon-chat-dot-round"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-label">客户满意度</div>
                  <div class="stat-value">{{ orderStats.customerSatisfaction }}%</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 第二行：动态单据状态看板 -->
      <div class="status-section" style="margin-top: 12px;">
        <el-row :gutter="20">
          <el-col
            v-for="(docType, index) in documentTypes.slice(0, visibleDocuments)"
            :key="docType.id"
            :span="6"
          >
            <el-card class="status-card">
              <div class="status-header">
                <div class="status-title">{{ docType.name }}</div>
                <div class="status-total">{{ documentStats[docType.id] ? documentStats[docType.id].total : 0 }}</div>
              </div>
              <div class="status-content">
                <div
                  v-for="status in docType.statuses"
                  :key="status.key"
                  class="status-item"
                >
                  <div class="status-meta">
                    <div class="status-label">{{ status.label }}</div>
                    <div class="status-value">{{ documentStats[docType.id] ? documentStats[docType.id][status.key] : 0 }}</div>
                  </div>
                  <div class="status-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :class="{ completed: status.color === '#6BCF77' }"
                        :style="{
                          width: (documentStats[docType.id] ? documentStats[docType.id][status.key + 'Percent'] : 0) + '%',
                          background: status.color
                        }"
                      ></div>
                    </div>
                    <div class="progress-percent">{{ documentStats[docType.id] ? documentStats[docType.id][status.key + 'Percent'] : 0 }}%</div>
                  </div>
                </div>
              </div>
              <div class="status-footer">
                <el-button type="text" size="mini" @click="handleDocTypeAction(docType.id)">查看详情</el-button>
                <div class="status-trend">
                  <i class="el-icon-arrow-up" v-if="(documentStats[docType.id] ? documentStats[docType.id].trend : 0) > 0"></i>
                  <i class="el-icon-arrow-down" v-else></i>
                  <span>{{ documentStats[docType.id] ? Math.abs(documentStats[docType.id].trend) : 0 }}%</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 第三行：未来库存水位与可售天数趋势 -->
      <el-row :gutter="20" style="margin-top: 12px;">
        <el-col :span="24">
          <el-card class="chart-card full-width" :body-style="{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }">
            <div class="status-header">
              <div class="status-title">未来库存水位与可售天数趋势</div>
              <el-dropdown @command="handleInventoryTrendCommand">
                <span class="el-dropdown-link">
                  未来30天<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="7">未来7天</el-dropdown-item>
                  <el-dropdown-item command="30">未来30天</el-dropdown-item>
                  <el-dropdown-item command="90">未来90天</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="chart-container">
              <div ref="inventoryTrendChart" style="width: 100%; height: 280px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
       <!-- 第四行：主要功能区 -->
      <div class="main-functions" style="margin-top: 12px;">
        <el-row :gutter="20">
          <!-- 呆滞库存预警 -->
          <el-col :span="8">
            <el-card class="warning-card" :body-style="{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }">
              <div class="status-header">
                <div class="status-title">呆滞库存预警</div>
                <div class="header-actions">
                 <el-link type="primary"
                    v-if="slowMovingList.length > 5"
      
                    size="mini" 
                    @click="toggleSlowMovingView" 
                    class="view-more-btn"
                  >
                    {{ showAllSlowMoving ? '收起' : `查看更多(${slowMovingList.length - 5})` }}
                  </el-link>
                </div>
              </div>
              <div class="warning-list">
                <div
                  v-for="item in showSlowMovingList"
                  :key="item.sku"
                  class="warning-item"
                  @click="handleSlowMovingClick(item)"
                >
                  <div class="sku-info">
                    <div class="sku-name">{{ item.skuName }}</div>
                    <div class="sku-detail">库存天数：{{ item.daysOfSupply }}天</div>
                  </div>
                  <div class="warning-level" :class="getSlowMovingLevelClass(item.daysOfSupply)">
                    {{ getSlowMovingLevelText(item.daysOfSupply) }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 缺货风险预警 -->
          <el-col :span="8">
            <el-card class="warning-card" :body-style="{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }">
              <div class="status-header">
                <div class="status-title">缺货风险预警</div>
                <div class="header-actions">
                    <el-link type="primary"
                    v-if="shortageRiskList.length > 5"
        
                    size="mini" 
                    @click="toggleShortageRiskView" 
                    class="view-more-btn"
                  >
                    {{ showAllShortageRisk ? '收起' : `查看更多(${shortageRiskList.length - 5})` }}
                  </el-link>
                </div>
              </div>
              <div class="warning-list">
                <div
                  v-for="item in showShortageRiskList"
                  :key="item.sku"
                  class="warning-item"
                  @click="handleWarningClick(item)"
                >
                  <div class="sku-info">
                    <div class="sku-name">{{ item.skuName }}</div>
                    <div class="sku-detail">预计缺货：{{ item.expectedDate }}</div>
                  </div>
                  <div class="warning-level" :class="getWarningLevelClass(item.daysLeft)">
                    剩余{{ item.daysLeft }}天
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 准确率 -->
          <el-col :span="8">
            <el-card class="function-card" :body-style="{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }">
              <div class="status-header">
                <div class="status-title">准确率</div>
                <el-link type="primary" @click="refreshData">刷新</el-link>
              </div>
              <div class="business-overview">
                <div class="overview-item">
                  <div class="overview-icon" style="background: #f0f9ff;">
                    <i class="el-icon-check" style="color: #67c23a;"></i>
                  </div>
                  <div class="overview-info">
                    <div class="overview-title">供应商确认及时率</div>
                    <div class="overview-stats">
                      <span class="stat-count">{{ businessData.supplierConfirmationRate }}%</span>
                      <span class="stat-detail">目标 ≥ 95%</span>
                    </div>
                  </div>
                </div>

                <div class="overview-item">
                  <div class="overview-icon" style="background: #f0f9ff;">
                    <i class="el-icon-truck" style="color: #409eff;"></i>
                  </div>
                  <div class="overview-info">
                    <div class="overview-title">供应商送货及时率</div>
                    <div class="overview-stats">
                      <span class="stat-count">{{ businessData.supplierDeliveryRate }}%</span>
                      <span class="stat-detail">目标 ≥ 90%</span>
                    </div>
                  </div>
                </div>

                <div class="overview-item">
                  <div class="overview-icon" style="background: #f0f9ff;">
                    <i class="el-icon-shopping-cart-2" style="color: #e6a23c;"></i>
                  </div>
                  <div class="overview-info">
                    <div class="overview-title">订单满足率</div>
                    <div class="overview-stats">
                      <span class="stat-count">{{ businessData.orderFulfillmentRate }}%</span>
                      <span class="stat-detail">目标 ≥ 98%</span>
                    </div>
                  </div>
                </div>

                <div class="overview-item">
                  <div class="overview-icon" style="background: #f0f9ff;">
                    <i class="el-icon-data-analysis" style="color: #f56c6c;"></i>
                  </div>
                  <div class="overview-info">
                    <div class="overview-title">预测准确率</div>
                    <div class="overview-stats">
                      <span class="stat-count">{{ businessData.predictionAccuracyRate }}%</span>
                      <span class="stat-detail">目标 ≥ 85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "Dashboard",
  data() {
    return {
      userName: '管理员',
      currentDate: '',
      currentTime: '',
      trendPeriod: 'today',
      completionRate: 85,
      todayStats: {
        totalOrders: 0,
        urgentOrders: 0,
        completedOrders: 0
      },
      documentTypes: [],
      documentStats: {},
      purchaseInboundStats: {
        total: 0,
        pending: 0,
        completed: 0,
        pendingPercent: 0,
        completedPercent: 0
      },
      transferStats: {
        total: 0,
        pendingOutbound: 0,
        outboundCompleted: 0,
        inboundCompleted: 0,
        pendingOutboundPercent: 0,
        outboundCompletedPercent: 0,
        inboundCompletedPercent: 0
      },
      inventoryTrendChart: null,
      completionChart: null,
      timer: null,
      visibleDocuments: 4,
      todoItems: [
        {
          id: 1,
          type: 'purchase',
          title: '采购建议单PO20251121001待审批',
          time: '10分钟前',
          priority: 'warning',
          priorityText: '紧急',
          url: '/purchase/suggestion'
        },
        {
          id: 2,
          type: 'transfer',
          title: '调拨单TO20251121001需要确认',
          time: '30分钟前',
          priority: '',
          priorityText: '普通',
          url: '/inventory/transferOrders'
        },
        {
          id: 3,
          type: 'inbound',
          title: '采购入库单待处理',
          time: '1小时前',
          priority: 'danger',
          priorityText: '重要',
          url: '/purchase/inOrders'
        }
      ],
      businessData: {
        supplierConfirmationRate: 0,
        supplierDeliveryRate: 0,
        orderFulfillmentRate: 0,
        predictionAccuracyRate: 0
      },
      inventoryStats: {
        total: 12500,
        predictedDemand: 8500,
        safetyStock: 3200,
        shortageRisk: 5
      },
      // 库存周转分析数据
      turnoverStats: {
        turnoverRate: 3.2,
        avgTurnoverDays: 28,
        inventoryCost: 45,
        slowMovingPercent: 8
      },
      // 订单处理效率数据
      orderStats: {
        pendingOrders: 12,
        avgProcessTime: 2.5,
        fulfillmentRate: 98,
        customerSatisfaction: 95
      },
      // 缺货风险预警数据
      shortageRiskList: [],
      // 呆滞库存预警数据
      slowMovingList: [],
      // 查看更多功能状态
      showAllSlowMoving: false,
      showAllShortageRisk: false
    }
  },
  mounted() {
    this.initDateTime()
    this.updateDateTime()
    this.generateTodayStats()
    this.generateStatusStats()
    this.generateShortageRiskData()
    this.generateSlowMovingData()
    this.timer = setInterval(this.updateDateTime, 60000)
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.inventoryTrendChart) {
      this.inventoryTrendChart.dispose()
    }
    if (this.completionChart) {
      this.completionChart.dispose()
    }
  },
  computed: {
    // 呆滞库存预警显示列表
    showSlowMovingList() {
      return this.showAllSlowMoving ? this.slowMovingList : this.slowMovingList.slice(0, 5)
    },
    // 缺货风险预警显示列表
    showShortageRiskList() {
      return this.showAllShortageRisk ? this.shortageRiskList : this.shortageRiskList.slice(0, 5)
    }
  },
  watch: {
    trendPeriod() {
      this.updateInventoryTrendChart()
    }
  },
  methods: {
    initDateTime() {
      const now = new Date()
      this.currentDate = this.formatDate(now)
      this.currentTime = this.formatTime(now)
    },
    updateDateTime() {
      const now = new Date()
      this.currentTime = this.formatTime(now)
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekDay = weekDays[date.getDay()]
      return `${year}年${month}月${day}日 ${weekDay}`
    },
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    },
    handleQuickAction(action) {
      const actionMap = {
        'create-suggestion': '/purchase/suggestion',
        'create-transfer': '/inventory/transferOrders',
        'batch-approve': '/purchase/suggestion'
      }
      if (actionMap[action]) {
        this.$router.push(actionMap[action])
      }
    },
    handleTodoClick(item) {
      if (item.url) {
        this.$router.push(item.url)
      }
    },
    
    // 切换呆滞库存预警查看更多状态
    toggleSlowMovingView() {
      this.showAllSlowMoving = !this.showAllSlowMoving
    },
    
    // 切换缺货风险预警查看更多状态
    toggleShortageRiskView() {
      this.showAllShortageRisk = !this.showAllShortageRisk
    },
    getTodoIcon(type) {
      const iconMap = {
        'purchase': 'el-icon-shopping-cart-2',
        'transfer': 'el-icon-truck',
        'inbound': 'el-icon-box'
      }
      return iconMap[type] || 'el-icon-info'
    },
    refreshData() {
      this.generateTodayStats()
      this.$message.success('数据刷新成功')
    },
    // 生成今日统计数据
    generateTodayStats() {
      const now = new Date()
      const hour = now.getHours()
      const dayProgress = hour / 24

      // 根据当前时间生成合理的今日数据
      const baseOrders = Math.floor(Math.random() * 20) + 15
      const urgentOrders = Math.floor(Math.random() * 8) + 2
      const completedOrders = Math.floor(baseOrders * dayProgress * 0.7)

      this.todayStats = {
        totalOrders: baseOrders,
        urgentOrders: urgentOrders,
        completedOrders: completedOrders
      }

      // 更新业务数据 - 供应商确认及时率、供应商送货及时率、订单满足率、预测准确率
      this.businessData.supplierConfirmationRate = Math.floor(Math.random() * 6) + 95 // 95%-100%
      this.businessData.supplierDeliveryRate = Math.floor(Math.random() * 11) + 90 // 90%-100%
      this.businessData.orderFulfillmentRate = Math.floor(Math.random() * 3) + 98 // 98%-100%
      this.businessData.predictionAccuracyRate = Math.floor(Math.random() * 16) + 85 // 85%-100%
    },

    generateStatusStats() {
      // 定义所有单据类型的配置
      this.documentTypes = [
        {
          id: 'purchaseInbound',
          name: '采购入库',
          statuses: [
            { key: 'pending', label: '待确认', color: '#FF6B6B' },
            { key: 'notified', label: '已通知供应商', color: '#FFD93D' },
            { key: 'confirmed', label: '已确认', color: '#4FC3F7' },
            { key: 'generated', label: '已生成采购入库', color: '#6BCF77' }
          ]
        },
        {
          id: 'purchaseOrder',
          name: '采购订单',
          statuses: [
            { key: 'pending', label: '待入库', color: '#FF6B6B' },
            { key: 'completed', label: '入库完成', color: '#6BCF77' }
          ]
        },
        {
          id: 'transfer',
          name: '库存调拨',
          statuses: [
            { key: 'pendingOutbound', label: '待出库', color: '#FF6B6B' },
            { key: 'outboundCompleted', label: '出库完成', color: '#FFD93D' },
            { key: 'inboundCompleted', label: '入库完成', color: '#6BCF77' }
          ]
        },
        {
          id: 'returnOutbound',
          name: '退供出库',
          statuses: [
            { key: 'pending', label: '待出库', color: '#FF6B6B' },
            { key: 'outbound', label: '出库中', color: '#FFD93D' },
            { key: 'completed', label: '出库完成', color: '#6BCF77' }
          ]
        }
      ]

      // 为每种单据类型生成统计数据
      this.documentStats = {}
      this.documentTypes.forEach(docType => {
        const stats = {}
        let total = 0

        // 为每个状态生成随机数据
        docType.statuses.forEach(status => {
          const count = Math.floor(Math.random() * 25) + 5
          stats[status.key] = count
          total += count
        })

        // 计算百分比
        docType.statuses.forEach(status => {
          const percentKey = `${status.key}Percent`
          stats[percentKey] = total > 0 ? Math.round((stats[status.key] / total) * 100) : 0
        })

        // 生成趋势数据（随机生成-10%到+15%的变化）
        stats.trend = Math.floor(Math.random() * 26) - 10

        stats.total = total
        this.documentStats[docType.id] = stats
      })

      // 保持向后兼容性
      this.purchaseInboundStats = this.documentStats.purchaseInbound
      this.transferStats = this.documentStats.transfer
    },

    // 添加新单据类型的方法
    addDocumentType(docConfig) {
      this.documentTypes.push(docConfig)
      this.generateStatusStats() // 重新生成统计数据
    },

    // 切换显示更多单据
    toggleMoreDocuments() {
      if (this.visibleDocuments === 4) {
        this.visibleDocuments = this.documentTypes.length
      } else {
        this.visibleDocuments = 4
      }
    },

    // 获取单据类型图标
    getDocTypeIcon(docTypeId) {
      const iconMap = {
        'purchaseInbound': 'el-icon-box',
        'transfer': 'el-icon-truck',
        'purchaseOrder': 'el-icon-shopping-cart-2',
        'returnOutbound': 'el-icon-refresh-left',
        'purchaseSuggestion': 'el-icon-edit-outline',
        'qualityCheck': 'el-icon-check'
      }
      return iconMap[docTypeId] || 'el-icon-document'
    },

    // 处理单据类型操作
    handleDocTypeAction(docTypeId) {
      const routeMap = {
        'purchaseInbound': '/purchase/inbound',
        'transfer': '/inventory/transferOrders',
        'purchaseOrder': '/purchase/orders',
        'returnOutbound': '/purchase/returnOutbound',
        'purchaseSuggestion': '/purchase/suggestion',
        'qualityCheck': '/quality/check'
      }

      if (routeMap[docTypeId]) {
        this.$router.push(routeMap[docTypeId])
      } else {
        this.$message.info(`跳转到${docTypeId}管理页面`)
      }
    },
    initCharts() {
      this.initInventoryTrendChart()
      this.initCompletionChart()
    },
    initCompletionChart() {
      const chartDom = this.$refs.completionChart
      if (!chartDom) return

      this.completionChart = echarts.init(chartDom)
      this.updateCompletionChart()
    },

    initInventoryTrendChart() {
      const chartDom = this.$refs.inventoryTrendChart
      if (!chartDom) return

      this.inventoryTrendChart = echarts.init(chartDom)
      const days = 30
      const dates = Array.from({ length: days }, (_, i) => `1月${i + 1}日`)
      const inventory = Array.from({ length: days }, () => Math.floor(Math.random() * 10000) + 50000)
      const daysOfSupply = Array.from({ length: days }, () => Math.floor(Math.random() * 30) + 10)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['库存数量', '可售天数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: [{
          type: 'value',
          name: '库存数量',
          position: 'left'
        }, {
          type: 'value',
          name: '可售天数',
          position: 'right'
        }],
        series: [{
          name: '库存数量',
          type: 'line',
          yAxisIndex: 0,
          data: inventory,
          lineStyle: {
            width: 3,
            color: '#67C23A'
          }
        }, {
          name: '可售天数',
          type: 'line',
          yAxisIndex: 1,
          data: daysOfSupply,
          lineStyle: {
            width: 3,
            color: '#E6A23C'
          }
        }]
      }

      this.inventoryTrendChart.setOption(option)
    },
    handlePredictionCommand(command) {
      const periodMap = {
        '7': '未来7天',
        '30': '未来30天',
        '90': '未来90天'
      }
      this.$message.success(`已切换到${periodMap[command]}`)

      // 根据选择的时间范围更新库存预测数据
      this.updateInventoryStats(command)
    },

    updateInventoryStats(period) {
      // 根据不同的时间范围生成不同的库存预测数据
      const baseStats = {
        '7': { total: 8500, predictedDemand: 5200, safetyStock: 1800, shortageRisk: 3 },
        '30': { total: 12500, predictedDemand: 8500, safetyStock: 3200, shortageRisk: 5 },
        '90': { total: 18500, predictedDemand: 12500, safetyStock: 4800, shortageRisk: 7 }
      }

      this.inventoryStats = baseStats[period] || baseStats['30']
    },

    // 处理库存周转分析时间范围切换
    handleTurnoverCommand(command) {
      const periodMap = {
        'week': '本周',
        'month': '本月',
        'quarter': '本季度'
      }
      this.$message.success(`已切换到${periodMap[command]}`)

      // 根据选择的时间范围更新库存周转数据
      this.updateTurnoverStats(command)
    },

    updateTurnoverStats(period) {
      // 根据不同的时间范围生成不同的库存周转数据
      const baseStats = {
        'week': { turnoverRate: 0.8, avgTurnoverDays: 35, inventoryCost: 12, slowMovingPercent: 10 },
        'month': { turnoverRate: 3.2, avgTurnoverDays: 28, inventoryCost: 45, slowMovingPercent: 8 },
        'quarter': { turnoverRate: 9.5, avgTurnoverDays: 25, inventoryCost: 135, slowMovingPercent: 6 }
      }

      this.turnoverStats = baseStats[period] || baseStats['month']
    },

    // 处理订单处理效率时间范围切换
    handleOrderCommand(command) {
      const periodMap = {
        'today': '今日',
        'week': '本周',
        'month': '本月'
      }
      this.$message.success(`已切换到${periodMap[command]}`)

      // 根据选择的时间范围更新订单处理效率数据
      this.updateOrderStats(command)
    },

    updateOrderStats(period) {
      // 根据不同的时间范围生成不同的订单处理效率数据
      const baseStats = {
        'today': { pendingOrders: 8, avgProcessTime: 1.8, fulfillmentRate: 99, customerSatisfaction: 97 },
        'week': { pendingOrders: 15, avgProcessTime: 2.2, fulfillmentRate: 98, customerSatisfaction: 96 },
        'month': { pendingOrders: 12, avgProcessTime: 2.5, fulfillmentRate: 98, customerSatisfaction: 95 }
      }

      this.orderStats = baseStats[period] || baseStats['month']
    },

    handleInventoryTrendCommand(command) {
      const periodMap = {
        '7': '未来7天',
        '30': '未来30天',
        '90': '未来90天'
      }
      this.$message.success(`已切换到${periodMap[command]}`)

      // 更新库存趋势图表
      this.updateInventoryTrendChart(command)
    },

    updateInventoryTrendChart(period) {
      if (!this.inventoryTrendChart) return

      // 根据不同的时间范围生成不同的数据
      const daysMap = {
        '7': 7,
        '30': 30,
        '90': 90
      }

      const days = daysMap[period] || 30
      const dates = []
      const today = new Date()
      for (let i = 1; i <= days; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
      }

      // 生成新的库存数量和可售天数数据
      const inventoryData = []
      const daysOfSupplyData = []
      let baseInventory = 5000
      let baseDays = 15

      for (let i = 0; i < days; i++) {
        // 库存数量波动
        const inventory = baseInventory + Math.random() * 1000 - 500
        inventoryData.push(Math.round(inventory))

        // 可售天数波动
        const days = baseDays + Math.random() * 5 - 2.5
        daysOfSupplyData.push(Number(days.toFixed(1)))
      }

      const option = this.inventoryTrendChart.getOption()
      option.xAxis[0].data = dates
      option.series[0].data = inventoryData
      option.series[1].data = daysOfSupplyData

      this.inventoryTrendChart.setOption(option)
    },

    updateCompletionChart() {
      if (!this.completionChart) return

      const option = {
        series: [{
          type: 'gauge',
          radius: '85%',
          startAngle: 225,
          endAngle: -45,
          min: 0,
          max: 100,
          progress: {
            show: true,
            width: 12,
            roundCap: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [{
                  offset: 0, color: '#FF6B6B'
                }, {
                  offset: 0.5, color: '#FFD93D'
                }, {
                  offset: 1, color: '#6BCF77'
                }]
              }
            }
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, '#F2F6FC']]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          anchor: {
            show: true,
            size: 6,
            showAbove: true,
            itemStyle: {
              color: '#6BCF77',
              borderWidth: 0
            }
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '0%'],
            formatter: function(value) {
              return '{value|' + value + '}{unit|%}'
            },
            rich: {
              value: {
                fontSize: 28,
                fontWeight: 'bold',
                color: '#303133'
              },
              unit: {
                fontSize: 14,
                color: '#909399',
                padding: [0, 0, 0, 4]
              }
            }
          },
          title: {
            offsetCenter: [0, '30%'],
            fontSize: 12,
            color: '#909399'
          },
          data: [{
            value: this.completionRate,
            name: '任务完成率'
          }]
        }]
      }

      this.completionChart.setOption(option)
    },

    // 生成缺货风险预警数据
    generateShortageRiskData() {
      this.shortageRiskList = Array.from({ length: 8 }, (_, i) => ({
        sku: `SKU00${i + 1}`,
        skuName: `商品${i + 1}`,
        expectedDate: `2024-01-${15 + i}`,
        daysLeft: Math.floor(Math.random() * 10) + 1
      }))
    },

    // 获取预警级别样式类
    getWarningLevelClass(daysLeft) {
      if (daysLeft <= 3) {
        return 'danger'
      } else if (daysLeft <= 7) {
        return 'warning'
      } else {
        return 'normal'
      }
    },

    // 处理预警项点击
    handleWarningClick(item) {
      this.$message.info(`查看SKU ${item.sku} 的缺货风险详情`)
      // 这里可以添加跳转到详情页的逻辑
      // this.$router.push(`/inventory/risk-detail/${item.sku}`)
    },

    // 生成呆滞库存预警数据
    generateSlowMovingData() {
      this.slowMovingList = Array.from({ length: 6 }, (_, i) => ({
        sku: `SKU10${i + 1}`,
        skuName: `商品${i + 11}`,
        daysOfSupply: Math.floor(Math.random() * 100) + 90
      }))
    },

    // 获取呆滞库存预警级别样式类
    getSlowMovingLevelClass(daysOfSupply) {
      if (daysOfSupply >= 180) {
        return 'high-risk'
      } else if (daysOfSupply >= 120) {
        return 'medium-risk'
      } else {
        return 'low-risk'
      }
    },

    // 获取呆滞库存预警级别文本
    getSlowMovingLevelText(daysOfSupply) {
      if (daysOfSupply >= 180) {
        return '严重呆滞'
      } else if (daysOfSupply >= 120) {
        return '中度呆滞'
      } else {
        return '轻度呆滞'
      }
    },

    // 处理呆滞库存预警项点击
    handleSlowMovingClick(item) {
      this.$message.info(`查看SKU ${item.sku} 的呆滞库存详情`)
      // 这里可以添加跳转到详情页的逻辑
      // this.$router.push(`/inventory/slow-moving-detail/${item.sku}`)
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 90vh;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 18px;
}

.welcome-card {
  background: linear-gradient(135deg, #42B983 0%, #13ce66 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(66, 185, 131, 0.3);
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.welcome-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(66, 185, 131, 0.4);
}

.welcome-info h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.welcome-date {
  margin: 0 0 12px 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.3;
}

.welcome-desc {
  margin: 0 0 20px 0;
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
}

.welcome-stats {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-top: auto;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.2;
}

/* 库存预测卡片 */
.inventory-prediction-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 200px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.inventory-prediction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #F2F6FC;
  flex-shrink: 0;
}

.prediction-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.prediction-stats {
  flex: 1;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  min-height: 0;
}

.prediction-stats .stat-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  text-align: left;
  padding: 8px;
  border-radius: 8px;
  background: #FAFAFA;
  transition: all 0.2s ease;
}

.prediction-stats .stat-item:hover {
  background: #f8f9fa;
}

.prediction-stats .stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.prediction-stats .stat-info {
  flex: 1;
  min-width: 0;
}

.prediction-stats .stat-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 2px;
  line-height: 1.2;
}

.prediction-stats .stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

/* 图表卡片 */
.chart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 200px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* 全宽图表卡片 */
.chart-card.full-width {
  height: 350px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  border-bottom: 1px solid #F2F6FC;
  flex-shrink: 0;
}

.completion-rate {
  font-size: 16px;
  font-weight: 700;
  color: #42B983;
}

.chart-container {
  flex: 1;
  padding: 8px 10px 10px;
  min-height: 0;
}

/* 状态统计看板 - 新设计 */
.status-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 260px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #F2F6FC;
  flex-shrink: 0;
}

.status-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.status-total {
  font-size: 20px;
  font-weight: 700;
  color: #409EFF;
  line-height: 1;
}

.status-content {
  flex: 1;
  padding: 8px 16px 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  min-height: 0;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
  min-height: 24px;
}

.status-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  margin-bottom: 1px;
}

.status-label {
  font-size: 10px;
  color: #606266;
  flex-shrink: 0;
  line-height: 1.1;
}

.status-value {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
  line-height: 1.1;
}

.status-progress {
  display: flex;
  align-items: center;
  gap: 4px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #F2F6FC;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.completed {
  background: #6BCF77;
}

.progress-percent {
  font-size: 9px;
  color: #909399;
  min-width: 24px;
  text-align: right;
  line-height: 1;
}

.status-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #F2F6FC;
  background: #FAFAFA;
  flex-shrink: 0;
  min-height: 40px;
  box-sizing: border-box;
}

.status-footer .el-button {
  font-size: 12px;
  padding: 4px 0;
}

.status-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 1;
}

.status-trend .el-icon-arrow-up {
  color: #F56C6C;
}

.status-trend .el-icon-arrow-down {
  color: #67C23A;
}

/* 查看更多卡片 */
.more-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed #DCDFE6;
}

.more-card:hover {
  border-color: #409EFF;
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.15);
}

.more-content {
  text-align: center;
  color: #909399;
}

.more-content i {
  font-size: 32px;
  margin-bottom: 12px;
  display: block;
}

.more-content span {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
}

.more-count {
  font-size: 12px;
  color: #409EFF;
  background: rgba(64, 158, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

/* 概览卡片 */
.overview-section {
  margin-bottom: 18px;
}

.el-col {
  margin-bottom: 20px;
}

.overview-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 120px;
  overflow: hidden;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

::v-deep .overview-card .el-card__body {
  padding: 0 !important;
  height: 100%;
  display: flex;
  align-items: center;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  width: 100%;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.card-purchase .card-icon { background: linear-gradient(135deg, #42B983, #13ce66); }
.card-inbound .card-icon { background: linear-gradient(135deg, #13ce66, #FFBA00); }
.card-transfer .card-icon { background: linear-gradient(135deg, #FFBA00, #42B983); }
.card-pending .card-icon { background: linear-gradient(135deg, #f56c6c, #f78989); }

.card-info {
  flex: 1;
  min-width: 0;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1;
}

.card-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  line-height: 1.2;
}

.card-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.trend.up { color: #42B983; }
.trend.down { color: #f56c6c; }

/* 功能卡片 */
.function-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  padding: 16px 20px;
  margin-bottom: 0;
}

::v-deep .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  padding: 20px;
  justify-content: space-between;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 72px;
}

.action-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.action-info {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #909399;
}

/* 待办事项 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  padding: 20px;
  justify-content: space-between;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 72px;
}

.todo-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.todo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #42B983, #13ce66);
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.todo-time {
  color: #909399;
}

.todo-action {
  color: #c0c4cc;
  font-size: 14px;
  flex-shrink: 0;
}

/* 业务概览 */
.business-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1;
  padding: 20px;
  justify-content: space-between;
  align-content: flex-start;
  min-height: 0;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-height: 72px;
  min-width: 200px;
  max-width: calc(25% - 12px);
}

.overview-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.overview-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.overview-info {
  flex: 1;
  min-width: 0;
}

.overview-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.overview-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.stat-count {
  font-weight: 600;
  color: #42B983;
}

.stat-detail {
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .welcome-stats {
    gap: 24px;
  }

  .el-col {
    margin-bottom: 16px;
  }

  .overview-card {
    height: 110px;
  }

  .card-content {
    padding: 16px;
    gap: 12px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .card-value {
    font-size: 24px;
  }

  .overview-item {
    max-width: calc(50% - 12px);
  }
}

@media (max-width: 992px) {
  .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
  }

  .welcome-card {
    padding: 20px;
  }

  .welcome-info h2 {
    font-size: 24px;
  }

  .welcome-stats {
    flex-direction: column;
    gap: 16px;
  }

  .function-card {
    height: auto;
    margin-bottom: 16px;
  }

  .el-col {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 12px;
  }

  .overview-item {
    max-width: 100%;
    min-width: auto;
  }

  .welcome-info-card {
    height: 180px;
    padding: 20px;
  }

  .welcome-info h2 {
    font-size: 18px;
  }

  .welcome-date {
    font-size: 13px;
  }

  .welcome-desc {
    font-size: 11px;
  }

  .welcome-stats {
    gap: 15px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 11px;
  }

  .status-card {
    height: 180px;
  }

  .status-header {
    padding: 14px 16px 10px;
  }

  .status-content {
    padding: 10px 16px;
  }

  .status-item {
    gap: 8px;
  }

  .status-label {
    font-size: 11px;
    width: 50px;
  }

  .status-value {
    font-size: 13px;
    width: 25px;
  }

  .status-total {
    font-size: 14px;
    padding: 3px 6px;
  }

  .chart-card {
    height: 180px;
  }

  .chart-header {
    padding: 14px 16px 0;
  }

  .chart-container {
    padding: 0 8px 8px;
  }

  .chart-card {
    height: 180px;
  }

  .chart-header {
    padding: 12px 16px 0;
    font-size: 13px;
  }

  .completion-rate {
    font-size: 14px;
  }

  .overview-card {
    height: 100px;
  }

  .card-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 12px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .card-value {
    font-size: 20px;
    margin-bottom: 2px;
  }

  .card-label {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .card-trend {
    font-size: 11px;
  }

  .action-item:hover {
    transform: none;
  }

  .todo-item:hover {
    transform: none;
  }
}

/* 缺货风险预警卡片样式 */
.warning-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 320px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* 准确率卡片样式 */
.function-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 320px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.function-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.warning-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Header actions样式 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 20px;
  justify-content: flex-start;
  overflow-y: auto;
  max-height: calc(100% - 80px);
}

.warning-list::-webkit-scrollbar {
  width: 6px;
}

.warning-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.warning-list::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.warning-list::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

.warning-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  min-height: 50px;
  max-height: 60px;
}

.warning-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.sku-info {
  flex: 1;
  min-width: 0;
}

.sku-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1.2;
}

.sku-detail {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
}

.warning-level {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  min-width: 60px;
  text-align: center;
  line-height: 1;
}

.warning-level.danger {
  background: #F56C6C;
}

.warning-level.warning {
  background: #E6A23C;
}

.warning-level.normal {
  background: #67C23A;
}

/* 呆滞库存预警级别样式 */
.warning-level.high-risk {
  background: #F56C6C;
}

.warning-level.medium-risk {
  background: #E6A23C;
}

.warning-level.low-risk {
  background: #909399;
}

/* 查看更多按钮样式 */
.view-more-container {
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
}

.view-more-btn {

  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.view-more-btn:hover {
  background-color: #ecf5ff;

}

/* 响应式设计 */
@media (max-width: 768px) {
  .warning-card {
    height: auto;
    margin-bottom: 16px;
  }

  .warning-item:hover {
    transform: none;
  }
}
</style>
