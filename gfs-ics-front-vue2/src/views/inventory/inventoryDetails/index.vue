<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.skuCode" placeholder="请输入商品编码" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.skuName" placeholder="请输入商品名称" clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.warehouseCode" placeholder="请选择仓库" clearable>
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
          <el-select size="mini" style="width:100%" v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.inventoryType" placeholder="请选择库存类型" clearable>
            <el-option
              v-for="item in inventoryTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.inventoryStatus" placeholder="请选择库存状态" clearable>
            <el-option
              v-for="item in inventoryStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-date-picker
            size="mini"
            style="width:100%"
            v-model="lastModifiedTimeRange"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="最后修改开始时间"
            end-placeholder="最后修改结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="primary" @click="handleSearch" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inventoryDetails:export')">
              <el-button size="mini" @click="handleExport" style="width:100%">导出</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" @click="handleReset" style="width:100%">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" style="flex: 1; display: flex; flex-direction: column;">
      <div style="flex: 1; overflow: hidden;">
        <u-table
          border
          size="mini"
          highlight-current-row
          v-loading="loading"
          :data="tableData"
          :row-height="30"
          :height="tableHeight"
          :row-style="{height: '0'}"
          :cell-style="{padding: '0'}"
          style="width: 100%; height: 100%;"
          @selection-change="handleSelectionChange">
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
          <u-table-column type="index" width="55" align="center" />

          <u-table-column prop="skuCode" label="商品编码" width="120" align="center" show-overflow-tooltip />
          <u-table-column prop="skuName" label="商品名称" width="150" align="center" show-overflow-tooltip/>
          <u-table-column prop="warehouseName" label="仓库名称" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="inventoryTypeName" label="库存类型" width="100" align="center" />
          <u-table-column prop="inventoryStatusName" label="库存状态" width="100" align="center">
            <template slot-scope="scope">
              <span :class="getInventoryStatusTextClass(scope.row.inventoryStatus)">
                {{ scope.row.inventoryStatusName }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="totalQuantity" label="总数量" width="100" align="center" />
          <u-table-column prop="availableQuantity" label="可用数量" width="100" align="center" />
          <u-table-column prop="inTransitQuantity" label="在途数量" width="100" align="center" />
          <u-table-column prop="damagedQuantity" label="残损数量" width="100" align="center" />
          <u-table-column prop="unit" label="单位" width="80" align="center" />
          <u-table-column prop="batchNumber" label="批次号" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="productionDate" label="生产日期" width="120" align="center" />
          <u-table-column prop="expirationDate" label="过期日期" width="120" align="center" />
          <u-table-column prop="lastModifiedBy" label="最后修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="最后修改时间" width="160" align="center" />
        </u-table>
      </div>
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
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
export default {
  name: 'InventoryDetails',
  components: {
    UTable, UTableColumn
  },
  data() {
    return {
      searchForm: {
        skuCode: '',
        skuName: '',
        warehouseCode: '',
        projectId: '',
        inventoryType: '',
        inventoryStatus: ''
      },
      lastModifiedTimeRange: [],
      warehouses: [
        { warehouseCode: 'WH001', warehouseName: '北京仓库' },
        { warehouseCode: 'WH002', warehouseName: '上海仓库' },
        { warehouseCode: 'WH003', warehouseName: '广州仓库' },
        { warehouseCode: 'WH004', warehouseName: '深圳仓库' }
      ],
      projects: [
        { projectId: 'P001', projectName: '货主A' },
        { projectId: 'P002', projectName: '货主B' },
        { projectId: 'P003', projectName: '货主C' }
      ],
      inventoryTypeOptions: [
        { value: 'NORMAL', name: '正常库存' },
        { value: 'DAMAGED', name: '残损库存' },
        { value: 'LOCKED', name: '锁定库存' }
      ],
      inventoryStatusOptions: [
        { value: 'AVAILABLE', name: '可用' },
        { value: 'LOCKED', name: '锁定' },
        { value: 'DAMAGED', name: '残损' }
      ],
      tableData: [
        {
          skuCode: 'SKU001',
          skuName: '商品A',
          warehouseName: '北京仓库',
          projectName: '货主A',
          inventoryType: 'NORMAL',
          inventoryTypeName: '正常库存',
          inventoryStatus: 'AVAILABLE',
          inventoryStatusName: '可用',
          totalQuantity: 1000,
          availableQuantity: 800,
          inTransitQuantity: 200,
          damagedQuantity: 50,
          unit: '件',
          batchNumber: 'BATCH20241201',
          productionDate: '2024-01-15',
          expirationDate: '2025-01-15',
          lastModifiedBy: '张三',
          lastModifiedTime: '2024-12-17 10:30:00'
        },
        {
          skuCode: 'SKU002',
          skuName: '商品B',
          warehouseName: '上海仓库',
          projectName: '货主B',
          inventoryType: 'LOCKED',
          inventoryTypeName: '锁定库存',
          inventoryStatus: 'LOCKED',
          inventoryStatusName: '锁定',
          totalQuantity: 500,
          availableQuantity: 0,
          inTransitQuantity: 100,
          damagedQuantity: 0,
          unit: '箱',
          batchNumber: 'BATCH20241202',
          productionDate: '2024-02-20',
          expirationDate: '2025-02-20',
          lastModifiedBy: '李四',
          lastModifiedTime: '2024-12-16 14:20:00'
        },
        {
          skuCode: 'SKU003',
          skuName: '商品C',
          warehouseName: '广州仓库',
          projectName: '货主C',
          inventoryType: 'DAMAGED',
          inventoryTypeName: '残损库存',
          inventoryStatus: 'DAMAGED',
          inventoryStatusName: '残损',
          totalQuantity: 200,
          availableQuantity: 0,
          inTransitQuantity: 0,
          damagedQuantity: 200,
          unit: '个',
          batchNumber: 'BATCH20241203',
          productionDate: '2024-03-10',
          expirationDate: '2025-03-10',
          lastModifiedBy: '王五',
          lastModifiedTime: '2024-12-15 09:15:00'
        },
        {
          skuCode: 'SKU004',
          skuName: '商品D',
          warehouseName: '深圳仓库',
          projectName: '货主A',
          inventoryType: 'NORMAL',
          inventoryTypeName: '正常库存',
          inventoryStatus: 'AVAILABLE',
          inventoryStatusName: '可用',
          totalQuantity: 3000,
          availableQuantity: 2500,
          inTransitQuantity: 500,
          damagedQuantity: 200,
          unit: '盒',
          batchNumber: 'BATCH20241204',
          productionDate: '2024-04-05',
          expirationDate: '2025-04-05',
          lastModifiedBy: '赵六',
          lastModifiedTime: '2024-12-14 16:45:00'
        }
      ],
      selectedRow: [],
      currentRow: {},
      loading: false,
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      tableHeight: 400
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {

    // 监听窗口大小变化
    window.addEventListener('resize', this.calculateTableHeight);
  },
  activated() {
    // 计算表格高度
    this.calculateTableHeight();
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('resize', this.calculateTableHeight);
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.loading = true
      // 模拟异步加载
      setTimeout(() => {
        // 这里可以根据搜索条件过滤数据
        let filteredData = [...this.tableData]
        
        if (this.searchForm.skuCode) {
          filteredData = filteredData.filter(item => 
            item.skuCode.includes(this.searchForm.skuCode)
          )
        }
        
        if (this.searchForm.skuName) {
          filteredData = filteredData.filter(item => 
            item.skuName.includes(this.searchForm.skuName)
          )
        }
        
        if (this.searchForm.warehouseCode) {
          const warehouse = this.warehouses.find(w => w.warehouseCode === this.searchForm.warehouseCode)
          if (warehouse) {
            filteredData = filteredData.filter(item => 
              item.warehouseName === warehouse.warehouseName
            )
          }
        }
        
        if (this.searchForm.projectId) {
          const project = this.projects.find(p => p.projectId === this.searchForm.projectId)
          if (project) {
            filteredData = filteredData.filter(item => 
              item.projectName === project.projectName
            )
          }
        }
        
        if (this.searchForm.inventoryType) {
          filteredData = filteredData.filter(item => 
            item.inventoryType === this.searchForm.inventoryType
          )
        }
        
        if (this.searchForm.inventoryStatus) {
          filteredData = filteredData.filter(item => 
            item.inventoryStatus === this.searchForm.inventoryStatus
          )
        }
        
        this.pagination.total = filteredData.length
        // 简单分页处理
        const startIndex = (this.pagination.page - 1) * this.pagination.size
        const endIndex = startIndex + this.pagination.size
        this.tableData = filteredData.slice(startIndex, endIndex)
        
        this.loading = false
      }, 500)
    },
    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.getTableData()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        skuCode: '',
        skuName: '',
        warehouseCode: '',
        projectId: '',
        inventoryType: '',
        inventoryStatus: ''
      }
      this.lastModifiedTimeRange = []
      this.pagination.page = 1
      this.getTableData()
    },
    // 导出
    handleExport() {
      // 导出功能实现
      this.$message.info('导出功能待实现')
    },
    // 表格选择变化
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.size = size
      this.getTableData()
    },
    // 当前页变化
    handleCurrentChange(page) {
      this.pagination.page = page
      this.getTableData()
    },
    // 计算表格高度以适配屏幕
    calculateTableHeight() {
      this.$nextTick(() => {
        const searchCard = document.querySelector('.search-card');
        const paginationContainer = document.querySelector('.pagination-container');
        const headerHeight = 150; // 顶部可能的导航栏高度
        const padding = 20; // 页面内边距

        if (searchCard && paginationContainer) {
          const searchCardHeight = searchCard.offsetHeight;
          const paginationHeight = paginationContainer.offsetHeight;
          const availableHeight = window.innerHeight - headerHeight - searchCardHeight - paginationHeight - padding;
          this.tableHeight = Math.max(availableHeight, 300); // 最小高度300px
        }
      });
    },
    // 获取库存状态文本样式
    getInventoryStatusTextClass(status) {
      const classMap = {
        'AVAILABLE': 'text-success',
        'LOCKED': 'text-warning',
        'DAMAGED': 'text-danger'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 10px 10px 0 10px;
  height: calc(100vh - 85px);
  display: flex;
  flex-direction: column;
}

.search-card {
  margin-bottom: 10px;
}

.table-card {
  margin-bottom: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: 10px;
  text-align: right;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.text-danger {
  color: #f56c6c;
}
</style>