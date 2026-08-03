<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-date-picker
              size="mini"
              style="width: 100%"
              v-model="forecastExeDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="forecastExeDatePickerOptions"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.warehouseCode" placeholder="请选择仓库" clearable>
            <el-option
                v-for="item in warehouses"
                :key="item.warehouseCode"
                :label="item.warehouseName"
                :value="item.warehouseCode">
              <span style="float: left">{{ item.warehouseCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.supplierId" placeholder="请选择供应商" filterable clearable
                     :filter-method="supplierFilterHandle"
                     @visible-change="supplierOptionsForSelect = suppliers"
          >
            <el-option
                style="width:400px"
                v-for="item in supplierOptionsForSelect"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId"
            >
              <span style="float: left">{{ item.supplierCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplierName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
                v-for="item in projects"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input
              size="mini"
              v-model="searchForm.productNumber"
              placeholder="请输入产品编码(支持多个，分隔符,)"
              clearable
          />
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 5px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
          <el-select size="mini" style="width:100%" v-model="searchForm.generatedSuggestionOrderFlag" placeholder="已生成采购订单" clearable>
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
          <el-button size="mini" type="primary" @click="handleSearch" :loading="searchLoading" style="width: 100%">查询</el-button>
        </el-col>
        <el-col :xs="12" :sm="6" :md="2" :lg="2" :xl="1">
          <el-button size="mini" @click="handleReset" style="width: 100%">重置</el-button>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2"  v-if="isAuth('ics:forecast:record:generatePurchaseOrder')">
          <el-button size="mini" type="primary" icon="el-icon-document" :disabled="selectedRows.length === 0" @click="handleGeneratePurchaseOrder" style="width: 100%">生成采购订单</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="loading"
        style="width: 100%"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" fixed="left" />
        <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
        <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="projectName" label="货主" min-width="120" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="productNumber" label="产品编码" width="100" align="center" fixed="left" show-overflow-tooltip />
        <el-table-column prop="productName" label="产品名称" min-width="200" align="center" fixed="left" show-overflow-tooltip />
        <!-- 动态日期列 -->
        <el-table-column
          v-for="date in dateColumns"
          :key="date"
          :label="date"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              v-if="getPredictValue(scope.row, date)"
              type="primary"
              @click="showDetail(scope.row, date)"
            >
              <span :style="getForecastDemandQuantityStyle(scope.row, date)">{{ getPredictValue(scope.row, date)[0].forecastDemandQuantity }}</span>
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            :current-page="pagination.page"
            :page-sizes="[20, 50, 100]"
            :page-size="pagination.size"
            :total="pagination.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 预测详情弹框 -->
    <forecast-detail-dialog
      :visible.sync="detailVisible"
      :detail-data="detailData"
      :current-date="currentDate"
      :row-data="currentRow"
    />

    <!-- 新增/编辑弹窗 -->
    <update-or-add
        ref="suggestionOrderUpdateOrAddRef"
        v-if="suggestionOrderDialogVisible"
        :delivery-method-options="deliveryMethodOptions"
        @submit="handleSearch"
    />
  </div>
</template>

<script>
import ForecastDetailDialog from './forecastDetailDialog.vue'
import API from "@/api";
import {mapGetters} from "vuex";
import UpdateOrAdd from "@/views/purchase/suggestion/updateOrAdd.vue";

export default {
  name: 'ForecastRecord',
  components: {
    UpdateOrAdd,
    ForecastDetailDialog
  },
  data() {
    return {
      loading: false,
      searchLoading: false,
      supplierOptionsForSelect: [],
      selectedRows: [],
      forecastExeDateRange: [],
      searchForm: {
        supplierId: '',
        warehouseId: '',
        projectId: '',
        productId: ''
      },
      tableData: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      dateColumns: [],
      deliveryMethodOptions: [],
      suggestionOrderDialogVisible: false,
      detailVisible: false,
      detailData: {},
      currentDate: '',
      currentRow: {},
      tableHeight: window.innerHeight - 280,
      forecastExeDatePickerOptions: {
        disabledDate: (time) => {
          const today = new Date();
          const fourteenDaysAgo = new Date();

          // 计算14天前的日期
          fourteenDaysAgo.setDate(today.getDate() - 13); // 包括今天共14天

          // 清除时间部分
          today.setHours(0, 0, 0, 0);
          fourteenDaysAgo.setHours(0, 0, 0, 0);

          // 禁用今天之后和14天前的所有日期
          return time.getTime() > today.getTime() ||
              time.getTime() < fourteenDaysAgo.getTime();
        }
      }
    }
  },
  mounted() {
    this.setDefaultDateRange();
    this.loadDeliveryMethodOptions();
    this.handleSearch()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapGetters([
      'projects',
      'warehouses',
      'client',
      'suppliers'
    ]),
  },
  methods: {
    // 设置默认时间范围（最近7天）
    setDefaultDateRange() {
      const now = new Date();
      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

      // 格式化日期
      const formatStartDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatEndDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.forecastExeDateRange = [
        formatStartDate(sixDaysAgo),
        formatEndDate(now)
      ];
    },
    handleResize() {
      this.tableHeight = window.innerHeight - 280
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadData()
    },

    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadData()
    },

    // 生成日期范围内的所有日期
    generateDateColumns(startDate, endDate) {
      const dates = []
      const start = new Date(startDate)
      const end = new Date(endDate)
      const current = new Date(start)

      while (current <= end) {
        dates.push(this.formatDate(current))
        current.setDate(current.getDate() + 1)
      }
      return dates.reverse();
    },

    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    handleSearch() {
      this.pagination.page = 1;
      this.loadData();
    },
    loadData() {
      this.searchLoading = true
      this.loading = true
      if (this.forecastExeDateRange && this.forecastExeDateRange.length === 2) {
        this.searchForm.forecastExeDateStart = this.forecastExeDateRange[0]
        this.searchForm.forecastExeDateEnd = this.forecastExeDateRange[1]
      }else {
        this.searchForm.forecastExeDateStart = null;
        this.searchForm.forecastExeDateEnd = null;
      }
      const [startDate, endDate] = this.forecastExeDateRange
      this.dateColumns = this.generateDateColumns(startDate, endDate)
      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;
      this.searchForm.clientId= this.client.id;
      API.averageForecastRecord.getListPage(this.searchForm).then(({data})=>{
        if (data.data && data.code ===0){
          this.tableData = data.data.list;
          this.pagination.total=data.data.totalCount;
          this.$message.success('搜索完成');
        }
        this.loading = false
        this.searchLoading = false
      }).catch(error =>{
        this.loading = false
        this.searchLoading = false
      })
    },

    getPredictValue(row, date) {
      return row.forecastRecordMap && row.forecastRecordMap[date] ? row.forecastRecordMap[date] : null
    },
    // 获取预测需求数量文本样式
    getForecastDemandQuantityStyle(row, date) {
      let matchForecastRecordList = this.getPredictValue(row, date);
      let textStyle = 'color:#E6A23C;text-decoration: underline;';
      if(matchForecastRecordList && matchForecastRecordList[0].generatedSuggestionOrderFlag === 1){
        textStyle = 'color:#42b983;text-decoration: underline;';
      }
      return textStyle
    },
    showDetail(row, date) {
      this.currentRow = row
      this.currentDate = date
      this.detailData = {
        ...row,
        // 详情附加信息
        recordDetailList: row.forecastRecordMap[date]
      }
      this.detailVisible = true
    },


    handleSelectionChange(val) {
      this.selectedRows = val
    },

    handleGeneratePurchaseOrder() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先勾选数据')
        return
      }
      let firstRow = this.selectedRows[0];
      let baseSet = new Set();
      let today = this.formatDate(new Date());
      let forecastRecordIdList = [];
      const detailList = this.selectedRows.filter(row => row.forecastRecordMap[today] && row.forecastRecordMap[today][0].forecastDemandQuantity > 0).map(row => {
          let todayForecastRecord = row.forecastRecordMap[today][0];
          forecastRecordIdList.push(todayForecastRecord.id);
          baseSet.add(`${row.clientId}_${row.supplierId}_${row.warehouseCode}_${row.projectId}`);
          return {
            productId: todayForecastRecord.productId,
            productNumber: todayForecastRecord.productNumber,
            productName: todayForecastRecord.productName,
            unitDictionaryId: todayForecastRecord.unitDictionaryId,
            unitDictionaryName: todayForecastRecord.unitDictionaryName,
            quantity: todayForecastRecord.forecastDemandQuantity,
            weight: null,
            volume: null,
            totalPrice: 0,
          };
      })
      if(detailList.length === 0){
        this.$message.warning('勾选数据无可生成采购订单的预测记录，执行预测日期='+today)
        return;
      }
      if(baseSet.size > 1){
        this.$message.warning('勾选数据对应的供应商+仓库+货主必须一致')
        return;
      }
      let suggestionOrderFormData = {
        forecastRecordIdList:forecastRecordIdList,
        deliveryWarehouseCode: firstRow.warehouseCode,
        deliveryWarehouseName: firstRow.warehouseName,
        supplierId: firstRow.supplierId,
        supplierCode: firstRow.supplierCode,
        supplierName: firstRow.supplierName,
        clientId: firstRow.clientId,
        clientCode: firstRow.clientCode,
        clientName: firstRow.clientName,
        projectId: firstRow.projectId,
        projectCode: firstRow.projectCode,
        projectName: firstRow.projectName,
        detailList:detailList
      }
      console.log("suggestionOrderFormData=",suggestionOrderFormData)
      this.suggestionOrderDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.suggestionOrderUpdateOrAddRef.addInitFromForecastRecord('通过库存预测记录新增采购订单',suggestionOrderFormData);
      })
    },
    supplierFilterHandle(val) {
      if (val) {
        this.supplierOptionsForSelect = this.suppliers.filter((item => {
          if (!!~item.supplierCode.indexOf(val) || !!~item.supplierCode.toUpperCase().indexOf(val.toUpperCase()) || !!~item.supplierName.indexOf(val) || !!~item.supplierName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      } else {
        this.supplierOptionsForSelect = this.suppliers;
      }
    },
    handleReset() {
      this.searchForm = {
        supplierId: '',
        warehouseId: '',
        projectId: '',
        productId: ''
      }
      this.loadData()
    },
    // 获取送货方式列表
    loadDeliveryMethodOptions() {
      API.orderConstant.getPurchaseDeliveryMethodList().then(({data})=>{
        if(data.data && data.code === 0){
          this.deliveryMethodOptions = data.data;
        }
      }).catch();
    },
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 15px;
}

.table-card {
  margin-bottom: 15px;
}
</style>
