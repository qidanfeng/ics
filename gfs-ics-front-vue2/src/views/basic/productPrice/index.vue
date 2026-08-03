<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.productNumber" placeholder="请输入产品编码" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="mini" style="width:100%" v-model="searchForm.productName" placeholder="请输入产品名称" clearable />
        </el-col>
        <el-col :span="4">
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
        <el-col :span="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.supplierId" placeholder="请选择供应商" clearable>
            <el-option
              v-for="item in suppliers"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select size="mini" style="width:100%" v-model="searchForm.projectId" filterable placeholder="请选择货主" clearable>
            <el-option
              v-for="item in projects"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :span="6">
          <el-date-picker
            size="mini"
            style="width:100%"
            v-model="createdTimeRange"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </el-col>
        <el-col :span="18" >
          <el-button size="mini" type="primary" @click="handleSearch" :loading="searchLoading">查询</el-button>
          <el-button size="mini" v-if="isAuth('ics:productPriceConfig:add')" @click="handleAdd">新增</el-button>
          <el-button size="mini" type="danger" v-if="isAuth('ics:productPriceConfig:delete')" :disabled="selectedRow.length === 0" :loading="deleteLoading" @click="handleDelete">删除</el-button>
          <el-button size="mini" v-if="isAuth('ics:productPriceConfig:export')" :loading="exportLoading" @click="handleExport">导出</el-button>
          <el-button size="mini" v-if="isAuth('ics:productPriceConfig:import')" :loading="importLoading" @click="handleImport">导入</el-button>
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
            style="width: 100%; height: 100%"
            @selection-change="handleSelectionChange"
          >
          <u-table-column type="selection" width="55" align="center" fixed="left"/>
            <u-table-column type="index" width="55" align="center" />
            <u-table-column prop="warehouseCode" label="仓库编码"  width="100" align="center" />
          <u-table-column prop="warehouseName" label="仓库名称"  width="150" align="center"show-overflow-tooltip />
            <u-table-column prop="supplierCode" label="供应商代码"  width="100" align="center"/>
          <u-table-column prop="supplierName" label="供应商名称"  width="150" align="center" show-overflow-tooltip />
            <u-table-column prop="projectCode" label="货主代码" width="100" align="center"/>
          <u-table-column prop="projectName" label="货主名称" min-width="120" align="center" show-overflow-tooltip/>
            <u-table-column prop="productNumber" label="产品编码" width="120" align="center" show-overflow-tooltip />
            <u-table-column prop="productName" label="产品名称"  width="150" align="center" show-overflow-tooltip />
          <u-table-column prop="proxyPurchasePrice" label="代采服务价" width="100" align="center" />
          <u-table-column prop="factoryPrice" label="出厂价" width="100" align="center" />
          <u-table-column prop="purchasePrice" label="采购价" width="100" align="center" />
          <u-table-column prop="transferPrice" label="调拨价" width="100" align="center" />
          <u-table-column prop="orderCycleTime" label="订货周期(天)" width="120" align="center" />
          <u-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="createdTime" label="创建时间" width="160" align="center" />
          <u-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
          <u-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
          <u-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="isAuth('ics:productPriceConfig:edit')" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </u-table-column>
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

    <!-- 新增/编辑子组件 -->
    <update-or-add v-if="showUpdateOrAdd" ref="updateOrAddRef" @submit="handleFormSubmit" />

    <upload v-if="uploadVisible" :templateUrl='templateUrl' ref="upload" @refreshDataList="handleSearch"></upload>
  </div>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import UpdateOrAdd from './updateOrAdd.vue'
import API from "@/api";
import {mapGetters} from "vuex";
import Upload from '@/components/upload/upload'
import {getImportTempletsUrl} from '@/utils/importTemplate'
export default {
  name: "ProductPriceConfig",
  components: {
    UTable,
    UTableColumn,
    UpdateOrAdd,Upload
  },
  computed: {
    ...mapGetters([
      'client',
      'projects',
      'warehouses',
      'suppliers'
    ]),
  },
  data() {
    return {
      templateUrl: {
        url: '',
        name: '',
        code: 1
      },
      uploadVisible:false,
      loading: false,
      submitting: false,
      searchLoading: false,
      deleteLoading: false,
      importLoading: false,
      exportLoading: false,
      searchForm: {
        productNumber: '',
        productName: '',
        warehouseCode: '',
        supplierId: '',
        projectId: '',
        clientId: ''
      },
      createdTimeRange: [],
      warehouseOptions: [],
      supplierOptions: [],
      projectOptions: [],
      clientOptions: [],
      tableData: [],
      selectedRow: [],
      pagination: {
        page: 1,
        size: 20,
        total: 1
      },
      tableHeight: 500, // 默认高度
      showUpdateOrAdd: false // 控制新增/编辑子组件显示
    }
  },
  mounted() {
    // 设置默认时间范围（最近2天）
    this.setDefaultTimeRange();

    // 计算表格高度
    this.calculateTableHeight();

    // 监听窗口大小变化
    window.addEventListener('resize', this.calculateTableHeight);

  },
  activated() {
    //设置初始查询条件
    this.setInitSearchForm();

    //查询数据
    this.handleSearch();
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('resize', this.calculateTableHeight);
  },
  methods: {
    setInitSearchForm(){
      this.searchForm.clientId = this.client.id;
      console.log(this.searchForm);
    },
    // 设置默认时间范围（最近2天）
    setDefaultTimeRange() {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      // 格式化开始时间为00:00:00，结束时间为23:59:59
      const formatStartDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
      };

      const formatEndDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 23:59:59`;
      };

     /* this.createdTimeRange = [
        formatStartDateTime(twoDaysAgo),
        formatEndDateTime(now)
      ];*/
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
          this.tableHeight =  availableHeight // 最小高度300px
        }
      });
    },

    handleSearch() {
      this.searchLoading = true
      this.loading = true
      this.searchForm.createdTimeStart = this.createdTimeRange[0];
      this.searchForm.createdTimeEnd = this.createdTimeRange[1];
      // 设置分页参数
      this.searchForm.page = this.pagination.page;
      this.searchForm.limit = this.pagination.size;

      API.productPriceConfig.getListPage(this.searchForm).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.data.list;
          this.pagination.total = data.data.totalCount;
          this.loading = false
          this.$message.success('搜索完成')
        }
        this.searchLoading = false
      }).catch(error => {
        this.loading = false
        this.searchLoading = false
      })
    },
    resetSearch() {
      this.searchForm = {
        productNumber: '',
        productName: '',
        warehouseCode: '',
        clientId: '',
        createdTimeRange: []
      }
      this.handleSearch()
    },
    handleAdd() {
      this.showUpdateOrAdd = true
      this.$nextTick(() => {
        this.$refs.updateOrAddRef.addInit()
      })
    },
    handleEdit(row) {
      this.showUpdateOrAdd = true
      this.$nextTick(() => {
        this.$refs.updateOrAddRef.updateInit(row)
      })
    },
    handleDelete() {
      if (this.selectedRow.length === 0) {
        this.$message.warning('请先选择要删除的产品价格配置')
        return
      }
      this.deleteLoading = true
      this.$confirm('确认删除该产品价格配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRow.map(item => item.id)
       API.productPriceConfig.deleteByIds(ids).then(({ data }) => {
         if (data && data.code === 0) {
           this.$message.success('删除成功')
           this.handleSearch()
         }
         this.deleteLoading = false
       }).catch((error)=>{
         this.deleteLoading = false
       })
      }).catch(() => {
        this.deleteLoading = false
      })
    },

    handleImport() {
      this.importLoading = true
      this.uploadVisible = true
      let {url,name} =getImportTempletsUrl('1000');
      console.log(url,name)
      this.templateUrl.url = url;
      this.templateUrl.name = name;
      this.$nextTick(() => {
        let url = API.productPriceConfig.importFile();
        let accept = '.xls,.xlsx';
        this.$refs.upload.init(url,accept);
        this.importLoading = false
      })
    },

    handleExport() {
      this.exportLoading = true
      this.searchForm.idList = this.selectedRow.map(item => item.id);
      API.productPriceConfig.exportFile(this.searchForm).then(({data}) => {
        this.searchForm.idList = null;
        if(data){
          const blob = new Blob([data],{type:'application/vnd.ms-excel'});
          const a = document.createElement('a')
          a.addEventListener('click', function(e){
              const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            a.download = `产品价格配置_${year}${month}${day}${hour}${minute}${second}.xlsx`;
            a.href = URL.createObjectURL(blob)
          })
          const e=document.createEvent('MouseEvents')
          e.initEvent('click', false, false)
          a.dispatchEvent(e)
        }
        this.exportLoading = false
      }).catch(()=>{
        this.searchForm.idList = null;
        this.exportLoading = false
      })
    },
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.handleSearch()
    },
    handleFormSubmit() {
      // 处理表单提交
      this.showUpdateOrAdd = false
      this.handleSearch()
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

</style>

