<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.warehouseCodeList" placeholder="请选择仓库" multiple filterable clearable>
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
          <el-select size="mini" style="width: 100%"  v-model="searchForm.projectIdList" multiple filterable placeholder="请选择货主" clearable >
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
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-select size="mini" style="width: 100%"  v-model="searchForm.inventoryType" filterable clearable placeholder="请选择库存类型">
            <el-option
              v-for="item in inventoryTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
<!--        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">-->
<!--          <el-select-->
<!--            v-model="searchForm.productName"-->
<!--            filterable-->
<!--            size="mini"-->
<!--            style="width:100%"-->
<!--            remote-->
<!--            clearable-->
<!--            value-key="id"-->
<!--            reserve-keyword-->
<!--            placeholder="输入产品名称模糊搜索"-->
<!--            :remote-method="(query) => debounceSearchProductByName(query)"-->
<!--            :loading="productCnNameLoading"-->
<!--            @change="(value) => fillProductInfo(value)">-->
<!--            <el-option-->
<!--              v-for="item in productList"-->
<!--              :key="item.id"-->
<!--              :label="item.productCnName"-->
<!--              :value="item">-->
<!--              <span style="float: left">{{ item.productNumber}}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productCnName }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="8">
          <el-row :gutter="8" class="button-group">
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3">
              <el-button size="mini" type="primary" @click="handleSearch" style="width:100%">查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="3" v-if="isAuth('ics:inventoryDetails:export') || true">
              <el-button size="mini" :loading="exportLoading" @click="handleExport" style="width:100%">导出</el-button>
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
          <u-table-column type="index" label="序号" width="55" align="center" />
          <u-table-column prop="warehouseName" label="仓库" width="250" align="center" show-overflow-tooltip/>
          <u-table-column prop="projectName" label="货主" width="120" align="center" show-overflow-tooltip/>
          <u-table-column prop="productNumber" label="产品编码" width="150" align="center" show-overflow-tooltip />
          <u-table-column prop="productName" label="产品名称" width="300" align="center" show-overflow-tooltip/>
          <u-table-column prop="totalQuantityStr" label="总数量" width="120" align="center" />
          <u-table-column prop="availableQuantityStr" label="可用数量" width="120" align="center" >
            <template slot="header" slot-scope="scope">
              <el-tooltip effect="light" placement="top">
                <div slot="content">
                  正品库位上库位剩余数量
                </div>
                <span>可用数量<i class="el-icon-question"></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :class="getAvailableQuantityTextClass(scope.row)">
                {{ scope.row.availableQuantityStr }}
              </span>
            </template>
          </u-table-column>
          <u-table-column prop="lockQuantityStr" label="锁定数量" width="120" align="center" >
            <template slot="header" slot-scope="scope">
              <el-tooltip effect="light" placement="top">
                <div slot="content">
                  正品库位上已分配数量+异动数量
                </div>
                <span>锁定数量<i class="el-icon-question"></i></span>
              </el-tooltip>
            </template>
          </u-table-column>
          <u-table-column prop="onTheWayQuantityStr" label="在途数量" width="120" align="center" >
            <template slot="header" slot-scope="scope">
              <el-tooltip effect="light" placement="top">
                <div slot="content">
                  已确认的采购订单还未完成入库的数量
                </div>
                <span>在途数量<i class="el-icon-question"></i></span>
              </el-tooltip>
            </template>
          </u-table-column>
          <u-table-column prop="damagedQuantityStr" label="损坏数量" width="120" align="center" >
            <template slot="header" slot-scope="scope">
              <el-tooltip effect="light" placement="top">
                <div slot="content">
                  非正品库位上所有库存数量
                </div>
                <span>损坏数量<i class="el-icon-question"></i></span>
              </el-tooltip>
            </template>
          </u-table-column>
          <u-table-column prop="specification" label="规格" width="120" align="center" />
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
import API from "@/api";
import {mapGetters} from "vuex";
export default {
  name: 'InventoryDetails',
  components: {
    UTable, UTableColumn
  },
  data() {
    return {
      project:{},
      productList:[],
      productCnNameLoading:false,
      searchForm: {
        inventoryType:null,
        productNumber: '',
        warehouseCodeList: [],
        projectIdList:  [],
      },
      inventoryTypeOptions: [],
      lastModifiedTimeRange: [],
      tableData: [],
      selectedRow: [],
      currentRow: {},
      loading: false,
      exportLoading: false,
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      tableHeight: 400
    }
  },
  computed: {
    ...mapGetters([
      'client',
      'carriers',
      'suppliers',
      'warehouses',
      'projects'
    ])
  },
  watch: {
    client: {
      handler: function (newVal, oldVal) {
        this.searchForm = {
          inventoryType:null,
          productNumber: '',
          warehouseCodeList: [],
          projectIdList:  [],
        }
        this.tableData = [];
      }
    },
  },
  mounted() {
    this.loadInventoryTypeOptions();
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
    async loadData() {
      this.loading = true;
      try {
        // 设置分页参数
        this.searchForm.page = this.pagination.page;
        this.searchForm.limit = this.pagination.size;
        this.searchForm.clientId= this.client.id;

        const { data } = await API.icsInventory.getListPage(this.searchForm)
        if (data && data.code === 0) {
          this.tableData = data.data.list || []
          this.pagination.total = data.data.totalCount || 0
          this.$message.success('搜索完成')
        } else {
          this.$message.error(data.message || '获取数据失败')
        }
      } catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败')
      } finally {
        this.loading = false
        this.searchLoading = false
      }
    },
    loadInventoryTypeOptions(){
      API.orderConstant.getInventoryTypeList().then(({data})=>{
        if(data.data == data.code == 0){
          this.inventoryTypeOptions = data.data;
        }
      }).catch();
    },

    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.loadData();
    },
    // 重置
    handleReset() {
      this.searchForm = {
        inventoryType:null,
        productNumber: '',
        warehouseCodeList: [],
        projectIdList:  [],
      }
      this.lastModifiedTimeRange = []
      this.pagination.page = 1
      this.loadData()
    },
    // 根据产品名称模糊搜索产品（防抖）
    debounceSearchProductByName( query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchProductByName(query);
      }, 500);
    },
    // 根据产品名称搜索产品
    searchProductByName( query) {
      if (!query) return;
      // 根据输入的产品名称，模糊查找产品编码+名称
      if (!this.project.projectId) {
        this.$message.warning("请录入货主再进行查询");
        return;
      }

      this.productList=[];
      this.productCnNameLoading=true;

      API.product.queryEntityByProductCnNameAndCustomerId(query,this.project.projectId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.productList = data.data;
        }
        this.productCnNameLoading=false;
      }).catch(error => {
        this.productCnNameLoading=false;
      })
    },
    // 填充产品信息
    fillProductInfo( product) {
      this.searchForm.productId = product.id;
      this.searchForm.productNumber = product.productNumber;
      this.searchForm.productName = product.productCnName;

    },
    projectChangeHandle(val){
      if(!val){
        this.searchForm.projectId = null;
        this.searchForm.projectCode = null;
        this.searchForm.projectName = null;
        this.project = {};
        return;
      }
      let matchProject = this.projects.find(item => item.projectId === val);
      this.project = matchProject;
      this.searchForm.projectId = matchProject.projectId;
      this.searchForm.projectCode = matchProject.projectCode;
      this.searchForm.projectName = matchProject.projectName;
    },
    handleExport() {
      this.exportLoading = true
      // 设置选中的ID列表
      this.searchForm.idList = this.selectedRow.map(item => item.id)

      API.icsInventory.exportFile(this.searchForm).then(({data}) => {
        this.searchForm.idList = null
        if(data){
          const blob = new Blob([data],{type:'application/vnd.ms-excel'})
          const a = document.createElement('a')
          a.addEventListener('click', function(e){
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            a.download = `库存信息_${year}${month}${day}${hour}${minute}${second}.xlsx`;
            a.href = URL.createObjectURL(blob)
          })
          const e=document.createEvent('MouseEvents')
          e.initEvent('click', false, false)
          a.dispatchEvent(e)

          this.$message.success('导出成功')
        }
        this.exportLoading = false
      }).catch(()=>{
        this.searchForm.idList = null
        this.$message.error('导出失败')
        this.exportLoading = false
      })
    },
    // 表格选择变化
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadData()
    },
    // 当前页变化
    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadData()
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
    },
    // 获取库存状态文本样式
    getAvailableQuantityTextClass(row) {
      let textClass = 'text-success';
      if(row.availableQuantity < row.safeStockQuantity){
        textClass = 'text-danger';
      }
      return textClass
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
  //display: flex;
  //justify-content: flex-end;
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
