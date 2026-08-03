<template>
  <el-dialog
    title="选择库存"
    :visible.sync="dialogVisible"
    width="95%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div class="inventory-selection">
        <el-row :gutter="20">
          <el-col :span="4">
              <el-input
                size="mini"
                v-model="searchForm.productNumber"
                placeholder="请输入产品编码"
                clearable
              />
          </el-col>
          <el-col :span="4">
              <el-select
                v-model="searchForm.productName"
                filterable
                size="mini"
                style="width:100%"
                remote
                clearable
                value-key="id"
                reserve-keyword
                placeholder="输入产品名称模糊搜索"
                :remote-method="(query) => debounceSearchProductByName(query)"
                :loading="productCnNameLoading"
                @change="(value) => fillProductInfo(value)">
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.productCnName"
                  :value="item">
                  <span style="float: left">{{ item.productNumber}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productCnName }}</span>
                </el-option>
              </el-select>

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr01Value"
                placeholder="请输入批次属性1"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr02Value"
                placeholder="请输入批次属性2"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr03Value"
                placeholder="请输入批次属性3"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr04Value"
                placeholder="请输入批次属性4"
                clearable
              />

          </el-col>

          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr05Value"
                placeholder="请输入批次属性5"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr06Value"
                placeholder="请输入批次属性6"
                clearable
              />

          </el-col>

          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr07Value"
                placeholder="请输入批次属性7"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr08Value"
                placeholder="请输入批次属性8"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr09Value"
                placeholder="请输入批次属性9"
                clearable
              />

          </el-col>
          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr10Value"
                placeholder="请输入批次属性10"
                clearable
              />
          </el-col>

          <el-col :span="4">

              <el-input
                size="mini"
                v-model="searchForm.lotAttr11Value"
                placeholder="请输入批次属性11"
                clearable
              />
          </el-col>
          <el-col :span="4">
              <el-input
                size="mini"
                v-model="searchForm.lotAttr12Value"
                placeholder="请输入批次属性12"
                clearable
              />
          </el-col>
          <el-col :span="4">
              <el-input
                size="mini"
                v-model="searchForm.lotAttr13Value"
                placeholder="请输入批次属性13"
                clearable
              />
          </el-col>
          <el-col :span="4">
              <el-input
                size="mini"
                v-model="searchForm.lotAttr14Value"
                placeholder="请输入批次属性14"
                clearable
              />
          </el-col>

          <el-col :span="4">
              <el-input
                size="mini"
                v-model="searchForm.lotAttr15Value"
                placeholder="请输入批次属性15"
                clearable
              />
          </el-col>
          <el-col :span="4">
              <el-button type="primary"  size="mini" @click="handleSearch">搜索</el-button>
              <el-button  size="mini"  @click="handleResetSearch">重置</el-button>
          </el-col>
        </el-row>

      <!-- 操作按钮 -->
      <div class="operation-buttons">
        <el-button type="primary"  size="mini" @click="handleConfirm" :disabled="!(totalReturnQty > 0)">
          确定选择
        </el-button>
        <el-button size="mini" @click="handleClearAll">清空</el-button>
        <span style="margin-left: 10px; color: #409EFF;">
          已选择 {{ selectedRows.length }} 项，退货数量：{{ totalReturnQtyWithReceiveUnit }} 收货单位 | {{ totalReturnQtyWithInventoryUnit }} 库存单位
        </span>
      </div>

      <!-- 库存列表 -->
      <div>
       <el-table
          ref="inventoryTableRef"
          :data="availableInventoryList"
          border
          :row-style="{height: '0'}"
          :cell-style="{padding: '0'}"
          size="mini"
          stripe
          :height="550"
          style="width: 100%"
          v-loading="tableLoading"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
          @select="handleSelectionChange"
          @select-all="handleSelectionAllChange"
        >
          <!-- 复选框列 -->
         <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
          <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
         <el-table-column prop="productNumber" label="产品编码" min-width="150" show-overflow-tooltip></el-table-column>
         <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>

         <el-table-column label="可用库存(库存单位)" min-width="130" >
           <template slot-scope="scope">
             {{ scope.row.availableQty+scope.row.unitDictionaryName}}
           </template>
         </el-table-column>
         <el-table-column label="可用库存(收货单位)" min-width="130" >
           <template slot-scope="scope">
             {{ calculateQuantityToUnitForShow(scope.row.availableQty, scope.row.receiveProductPackVo, scope.row.unitDictionaryName) }}
           </template>
         </el-table-column>

         <el-table-column label="已退货数量" width="100">
           <template slot-scope="scope">
             <!--              {{ getReturnedQty(scope.row) }}-->
             {{
               calculateQuantityToUnitForShow(getReturnedQty(scope.row), scope.row.receiveProductPackVo, scope.row.unitDictionaryName)
             }}
           </template>
         </el-table-column>
         <el-table-column label="退货数量(库存单位)" width="200">
           <template slot-scope="scope">
             <el-input-number
               v-model="scope.row.returnQtyWithInventoryUnit"
               :min="0"
               style="width: 100%"
               :max="getReturnQtyWithInventoryUnitMaxLimit(scope.row)"
               size="small"
               :disabled="getRemainingQty(scope.row) <= 0"
               @change="handleReturnQtyChange(scope.row)"
             ></el-input-number>
           </template>
         </el-table-column>
         <el-table-column label="退货数量(收货单位)" width="200">
           <template slot-scope="scope">
             <el-input-number
               v-model="scope.row.returnQtyWithReceiveUnit"
               :min="0"
               style="width: 100%"
               :max="getReturnQtyWithReceiveUnitMaxLimit(scope.row)"
               size="small"
               :disabled="getRemainingQty(scope.row) < scope.row.receiveProductPackVo.number || scope.row.receiveProductPackLossFlag || scope.row.receiveProductPackVo.number === 1"
               @change="handleReturnQtyChange(scope.row)"
             ></el-input-number>
           </template>
         </el-table-column>
         <el-table-column label="剩余数量" width="100">
           <template slot-scope="scope">
             <!--              {{ getRemainingQty(scope.row) - scope.row.returnQty }}-->
             {{
               calculateQuantityToUnitForShow(getRemainingQty(scope.row) - scope.row.returnQty, scope.row.receiveProductPackVo, scope.row.unitDictionaryName)
             }}
           </template>
         </el-table-column>

<!--         <el-table-column prop="unitDictionaryName" label="单位" width="80"></el-table-column>-->
          <!-- 批次属性列 -->
         <el-table-column prop="lotAttr01Value" label="生产日期" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr02Value" label="过期日期" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr03Value" label="入库日期" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr04Value" label="质量状态" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr05Value" label="批次属性5" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr06Value" label="批次属性6" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr07Value" label="批次属性7" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr08Value" label="批次属性8" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr09Value" label="批次属性9" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr10Value" label="批次属性10" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr11Value" label="批次属性11" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr12Value" label="批次属性12" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr13Value" label="批次属性13" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr14Value" label="批次属性14" min-width="120" show-overflow-tooltip></el-table-column>
         <el-table-column prop="lotAttr15Value" label="批次属性15" min-width="120" show-overflow-tooltip></el-table-column>

        </el-table>

        <!-- 分页组件 -->
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            style="margin-top: 10px; text-align: right;"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { UTable, UTableColumn } from 'umy-ui'
import API from '@/api'
export default {
  name: 'SelectInventory',
  components: {
    UTable,
    UTableColumn
  },
  props: {
    // 对话框显示状态
    visible: {
      type: Boolean,
      default: false
    },
    // 当前已选择的退货明细
    detailList: {
      type: Array,
      default: () => []
    },
    // 退货仓库信息
    returnWarehouse: {
      type: Object,
      default: () => ({
        code: '',
        name: ''
      })
    },
    // 项目信息
    project: {
      type: Object,
      default: () => ({
        id: null,
        name: '',
        code: ''
      })
    }
  },

  data() {
    // 防抖定时器
    this.debounceTimer = null;
    return {
      productList:[],
      productCnNameLoading:false,
      // 对话框显示状态（内部状态）
      dialogVisible: false,
      // 库存列表数据
      inventoryList: [],
      // 表格加载状态
      tableLoading: false,
      // 搜索表单
      searchForm: {
        productNumber: '',
        productName: '',
        lotAttr01Value: '',
        lotAttr02Value: '',
        lotAttr03Value: '',
        lotAttr04Value: '',
        lotAttr05Value: '',
        lotAttr06Value: '',
        lotAttr07Value: '',
        lotAttr08Value: '',
        lotAttr09Value: '',
        lotAttr10Value: '',
        lotAttr11Value: '',
        lotAttr12Value: '',
        lotAttr13Value: '',
        lotAttr14Value: '',
        lotAttr15Value: ''
      },
      // 存储用户输入的退货数量
      returnQtyMap: {},
      // 选中的行数据
      selectedRows: [],
      totalReturnQty:0,
      totalReturnQtyWithReceiveUnit:0,
      totalReturnQtyWithInventoryUnit:0,
      // 分页参数
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  computed: {
    // 可选择的库存列表（显示所有库存，包括已部分退货的）
    availableInventoryList() {
      if (!this.inventoryList) {
        return []
      }
      return this.inventoryList
        .map(item => {
          // 从returnQtyMap中获取用户输入的退货数量，如果没有则为0
          const returnQty = this.returnQtyMap[item.uniqueCode] || 0;
          // 无收货单位时特殊处理
          if(!item.receiveProductPackVo){
            item.receiveProductPackLossFlag = true;
            item.receiveProductPackVo = {
              unitDictionaryId:item.unitDictionaryId,
              unitDictionaryName:item.unitDictionaryName,
              number:1,
            }
          }
          let returnQtyTranUnitObj = this.calculateQuantityToUnit(returnQty,item.receiveProductPackVo);
          let returnQtyWithReceiveUnit = returnQtyTranUnitObj.quantityWithReceiveUnit;
          let returnQtyWithInventoryUnit = returnQtyTranUnitObj.quantityWithInventoryUnit;

          return {
            ...item,
            returnQty: returnQty,
            returnQtyWithReceiveUnit: returnQtyWithReceiveUnit,
            returnQtyWithInventoryUnit: returnQtyWithInventoryUnit,
            remainingQty: this.getRemainingQty(item),
            returnedQty: this.getReturnedQty(item)
          }
        })
    },
  },
  methods: {
    // 对话框打开时的处理
    init(dialogVisible) {
      // 清空returnQtyMap，确保每次打开都是初始状态
      this.dialogVisible = dialogVisible
      this.$nextTick(() => {
        this.returnQtyMap = {}
        this.selectedRows = []
        // 重置分页参数
        this.pagination.currentPage = 1
        this.pagination.pageSize = 10
        this.pagination.total = 0
        this.loadInventoryList()
      })
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
      if (!this.project.id) {
        this.$message.warning("请录入货主再进行查询");
        return;
      }

      this.productList=[];
      this.productCnNameLoading=true;

      API.product.queryEntityByProductCnNameAndCustomerId(query,this.project.id).then(({data}) => {
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

    // 对话框关闭时的处理
    handleDialogClose() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
      this.$emit('close')
    },

    // 取消选择
    handleCancel() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },

    // 确认选择
    handleConfirm() {
      const selectedItems = []

      // 处理复选框选中的行（使用用户手动调整后的退货数量）
      this.selectedRows.forEach(row => {
        const returnQty = this.returnQtyMap[row.uniqueCode] || 0
        if (returnQty > 0) {
          selectedItems.push({
            ...row,
            productNumber: row.productNumber,
            productName: row.productName,
            specification: row.specification || '',
            warehouseCode: row.warehouseCode || this.returnWarehouse.code,
            warehouseName: row.warehouseName || this.returnWarehouse.name,
            availableQty: row.availableQty,
            returnQty: returnQty,
            quantity:returnQty,
          })
        }
      })

      // 处理手动输入退货数量的行
      this.availableInventoryList
        .filter(item => item.returnQty > 0 && !this.selectedRows.some(row => row.uniqueCode === item.uniqueCode))
        .forEach(item => {
          selectedItems.push({
            ...item,
            productNumber: item.productNumber,
            productName: item.productName,
            availableQty: item.availableQty,
            returnQty: item.returnQty,
            quantity:item.returnQty,
          })
        })

      // 累加现有的明细和新的明细
      const updatedDetails = [...this.detailList]

      selectedItems.forEach(newItem => {
        const existingIndex = updatedDetails.findIndex(detail =>
          detail.uniqueCode === newItem.uniqueCode
        )
        let quantityForDetailNew = newItem.quantity;
        let matchUpdatedDetail = newItem;
        if (existingIndex >= 0) {
          matchUpdatedDetail = updatedDetails[existingIndex];
          //因为两边取值名称不同，所以需要多加一个变量
          quantityForDetailNew = matchUpdatedDetail.quantity * matchUpdatedDetail.unitMatchInventoryNumber + newItem.quantity
        } else {
          // 如果不存在，则添加新项
          updatedDetails.push(newItem)

        }

        let availableQtyTranUnitObj = this.calculateQuantityToUnit(newItem.availableQty,newItem.receiveProductPackVo);
        let returnQtyTranUnitObj = this.calculateQuantityToUnit(quantityForDetailNew,newItem.receiveProductPackVo);
        let returnOrderDetailQuantity = quantityForDetailNew;
        let returnOrderDetailUnitId = newItem.unitDictionaryId;
        let returnOrderDetailUnitName = newItem.unitDictionaryName;
        let unitMatchInventoryNumber = 1;
        let returnOrderDetailQuantityMaxLimit = newItem.availableQty;
        if(returnQtyTranUnitObj.quantityWithInventoryUnit === 0){
          returnOrderDetailQuantity = returnQtyTranUnitObj.quantityWithReceiveUnit;
          returnOrderDetailUnitId = newItem.receiveProductPackVo.unitDictionaryId;
          returnOrderDetailUnitName = newItem.receiveProductPackVo.unitDictionaryName;
          returnOrderDetailQuantityMaxLimit = availableQtyTranUnitObj.quantityWithReceiveUnit;
          unitMatchInventoryNumber = newItem.receiveProductPackVo.number;
        }
        matchUpdatedDetail.quantity = returnOrderDetailQuantity;
        matchUpdatedDetail.unitDictionaryId = returnOrderDetailUnitId;
        matchUpdatedDetail.unitDictionaryName = returnOrderDetailUnitName;
        matchUpdatedDetail.quantityMaxLimit = returnOrderDetailQuantityMaxLimit;
        matchUpdatedDetail.unitMatchInventoryNumber = unitMatchInventoryNumber;
      })

      this.$emit('confirm', updatedDetails)
      this.dialogVisible = false
      this.$emit('update:visible', false)
    },
    //获取退货得总量
    getReturnedTotalQty(){
      this.totalReturnQty=0;
      this.totalReturnQtyWithReceiveUnit=0;
      this.totalReturnQtyWithInventoryUnit=0;
      this.availableInventoryList.forEach(item => {
        if (item.returnQty > 0) {
          this.totalReturnQty += item.returnQty
          this.totalReturnQtyWithReceiveUnit += item.returnQtyWithReceiveUnit
          this.totalReturnQtyWithInventoryUnit += item.returnQtyWithInventoryUnit
        }

      })
    },
    // 获取已退货的数量
    getReturnedQty(item) {
      const existingDetail = this.detailList.find(detail => detail.uniqueCode === item.uniqueCode)
      if(existingDetail){
        let unitMatchInventoryNumber = this.getUnitMatchInventoryNumber(item,existingDetail);
        return existingDetail.quantity * unitMatchInventoryNumber;
      }

      return 0
    },

    getUnitMatchInventoryNumber(item,existingDetail) {
      if (item.unitDictionaryId === existingDetail.unitDictionaryId) {
        return 1;
      } else if (item.receiveProductPackVo.unitDictionaryId === existingDetail.unitDictionaryId) {
        return item.receiveProductPackVo.number;
      } else {
        this.$message.error("未匹配到包装单位");
        throw new Error("未匹配到包装单位");
      }
    },

    // 获取剩余数量（考虑已退货的数量）
    getRemainingQty(item) {
      const existingDetail = this.detailList.find(detail => detail.uniqueCode === item.uniqueCode)
      if (existingDetail) {
        let unitMatchInventoryNumber = this.getUnitMatchInventoryNumber(item,existingDetail);
        return Math.max(0, item.availableQty - existingDetail.quantity * unitMatchInventoryNumber)
      }
      return item.availableQty
    },

    // 退货数量变化处理
    handleReturnQtyChange(item) {
      // 更新returnQtyMap中的值，使用Vue.set确保响应式
      let returnQtyWithReceiveUnit = item.returnQtyWithReceiveUnit;
      let returnQty = item.returnQtyWithInventoryUnit;
      if(returnQtyWithReceiveUnit){
        let returnQtyByReceiveTrans = returnQtyWithReceiveUnit * item.receiveProductPackVo.number;
        returnQty += returnQtyByReceiveTrans;
      }
      item.returnQty = returnQty;

      this.returnQtyMap[item.uniqueCode]= item.returnQty;
      this.getReturnedTotalQty();

    },
    getReturnQtyWithReceiveUnitMaxLimit(row){
      if(row.receiveProductPackLossFlag || row.receiveProductPackVo.number === 1){
        return 0;
      }
      return Math.floor((this.getRemainingQty(row)-row.returnQtyWithInventoryUnit) / row.receiveProductPackVo.number);
    },
    getReturnQtyWithInventoryUnitMaxLimit(row){
      if(row.receiveProductPackLossFlag || row.receiveProductPackVo.number === 1){
        return this.getRemainingQty(row);
      }
      return Math.min((this.getRemainingQty(row)-row.returnQtyWithReceiveUnit * row.receiveProductPackVo.number),row.receiveProductPackVo.number-1);
    },
    /**
     * 计算数量到单位的转换
     * @param {number} quantity - 数量
     * @param {Object} packUnitNumberVo - 包装单位信息
     * @param {string} inventoryUnitName - 库存单位名称
     * @returns {string} 转换后的字符串表示
     */
    calculateQuantityToUnit(quantity, packUnitNumberVo) {
      if (!packUnitNumberVo || packUnitNumberVo.number === 1) {
        // 和库存单位一致，不处理
        return {quantityWithReceiveUnit: 0, quantityWithInventoryUnit: quantity};
      }

      const packNumber = Number(packUnitNumberVo.number) || 1;

      // 转成单位数量
      const spec = Math.floor(quantity / packNumber);
      const remainder = quantity - (spec * packNumber);

      if (Math.abs(remainder) < 0.000001) { // 处理浮点数精度问题
        return {quantityWithReceiveUnit: spec, quantityWithInventoryUnit: 0};
      }

      return {quantityWithReceiveUnit: spec, quantityWithInventoryUnit: remainder};
    },
    /**
     * 计算数量到单位的转换-展示用
     * @param {number} quantity - 数量
     * @param {Object} packUnitNumberVo - 包装单位信息
     * @param {string} inventoryUnitName - 库存单位名称
     * @returns {string} 转换后的字符串表示
     */
    calculateQuantityToUnitForShow(quantity, packUnitNumberVo, inventoryUnitName) {
      if (!packUnitNumberVo || packUnitNumberVo.number === 1) {
        // 和库存单位一致，不处理
        return this.formatNumber(quantity) + inventoryUnitName;
      }

      const packNumber = Number(packUnitNumberVo.number) || 1;

      // 转成单位数量
      const spec = Math.floor(quantity / packNumber);
      const remainder = quantity - (spec * packNumber);

      if (Math.abs(remainder) < 0.000001) { // 处理浮点数精度问题
        return this.formatNumber(spec) + packUnitNumberVo.unitDictionaryName;
      }

      return this.formatNumber(spec) + packUnitNumberVo.unitDictionaryName + this.formatNumber(remainder) + inventoryUnitName;
    },
    /**
     * 格式化数字，如果是整数则去除小数部分，否则保留最多4位小数
     * @param {number} value - 要格式化的数值
     * @returns {string} 格式化后的字符串
     */
    formatNumber(value) {
      // 处理JavaScript浮点数精度问题
      const num = Number(value);

      // 检查是否为整数
      if (Number.isInteger(num)) {
        return num.toString();
      }

      // 使用toFixed处理小数，然后移除末尾的0
      let str = num.toFixed(4);

      // 移除末尾的0和小数点
      str = str.replace(/(\.\d*?)0+$/, '$1');
      str = str.replace(/\.$/, '');

      return str;
    },


    // 复选框选择变化
    handleSelectionChange(selection, row) {
      if(selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          if (item.uniqueCode == row.uniqueCode) {
            const remainingQty = this.getRemainingQty(row);
            this.returnQtyMap[row.uniqueCode] = remainingQty;
            let remainingQtyTransUnitObj = this.calculateQuantityToUnit(remainingQty,row.receiveProductPackVo);

            row.returnQty = remainingQty;
            row.returnQtyWithReceiveUnit = remainingQtyTransUnitObj.quantityWithReceiveUnit;
            row.returnQtyWithInventoryUnit = remainingQtyTransUnitObj.quantityWithInventoryUnit;
            this.selectedRows = selection;
            this.getReturnedTotalQty();
            return;
          }
        }
      }
      delete this.returnQtyMap[row.uniqueCode];
      row.returnQty = 0;
      row.returnQtyWithReceiveUnit = 0;
      row.returnQtyWithInventoryUnit = 0;
      this.selectedRows = selection;
      this.getReturnedTotalQty();
    },
    handleSelectionAllChange(selection){
      if(selection.length == 0){
        this.returnQtyMap={};
        this.selectedRows.forEach(row=>{
          row.returnQty = 0;
          row.returnQtyWithReceiveUnit = 0;
          row.returnQtyWithInventoryUnit = 0;
        })
      }
      selection.forEach(row=>{
        const remainingQty = this.getRemainingQty(row)
        this.returnQtyMap[row.uniqueCode] = remainingQty;
        let remainingQtyTransUnitObj = this.calculateQuantityToUnit(remainingQty,row.receiveProductPackVo);

        row.returnQty = remainingQty;
        row.returnQtyWithReceiveUnit = remainingQtyTransUnitObj.quantityWithReceiveUnit;
        row.returnQtyWithInventoryUnit = remainingQtyTransUnitObj.quantityWithInventoryUnit;
      })
      this.selectedRows = selection;
      this.getReturnedTotalQty();
    },

    // 清空选择
    handleClearAll() {
      this.selectedRows = []
      // 同时清空所有手动输入的数量
      this.availableInventoryList.forEach(item => {
        this.returnQtyMap[item.uniqueCode]= 0
        item.returnQty = 0;
        item.returnQtyWithReceiveUnit = 0;
        item.returnQtyWithInventoryUnit = 0;
      }) ;
      this.getReturnedTotalQty();

      this.$refs.inventoryTableRef.clearSelection();
    },

    // 搜索库存
    handleSearch() {
      this.loadInventoryList()
    },

    // 重置搜索条件
    handleResetSearch() {
      this.searchForm = {
        productNumber: '',
        productName: '',
        lotAttr01Value: '',
        lotAttr02Value: '',
        lotAttr03Value: '',
        lotAttr04Value: '',
        lotAttr05Value: '',
        lotAttr06Value: '',
        lotAttr07Value: '',
        lotAttr08Value: '',
        lotAttr09Value: '',
        lotAttr10Value: '',
        lotAttr11Value: '',
        lotAttr12Value: '',
        lotAttr13Value: '',
        lotAttr14Value: '',
        lotAttr15Value: ''
      }
      this.loadInventoryList()
    },

    // 加载库存列表
    loadInventoryList() {
      // 显示loading效果
      this.tableLoading = true

      // 构建API请求参数（包含分页参数和批次属性查询条件）
      let param = {
        warehouseCode: this.returnWarehouse.code,
        projectId: this.project.id,
        productNumber: this.searchForm.productNumber,
        productName: this.searchForm.productName,
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        lotAttr01Value: this.searchForm.lotAttr01Value,
        lotAttr02Value: this.searchForm.lotAttr02Value,
        lotAttr03Value: this.searchForm.lotAttr03Value,
        lotAttr04Value: this.searchForm.lotAttr04Value,
        lotAttr05Value: this.searchForm.lotAttr05Value,
        lotAttr06Value: this.searchForm.lotAttr06Value,
        lotAttr07Value: this.searchForm.lotAttr07Value,
        lotAttr08Value: this.searchForm.lotAttr08Value,
        lotAttr09Value: this.searchForm.lotAttr09Value,
        lotAttr10Value: this.searchForm.lotAttr10Value,
        lotAttr11Value: this.searchForm.lotAttr11Value,
        lotAttr12Value: this.searchForm.lotAttr12Value,
        lotAttr13Value: this.searchForm.lotAttr13Value,
        lotAttr14Value: this.searchForm.lotAttr14Value,
        lotAttr15Value: this.searchForm.lotAttr15Value
      }

      // 调用真实API获取库存数据
      API.wmsInventory.queryInventory(param).then(({ data }) => {
        if (data && data.code === 0 && data.data) {
          // 按照您提供的JSON报文格式处理返回数据
          const apiInventoryList = data.data.list || []

          // 更新分页信息
          if (data.data.totalCount) {
            this.pagination.total = data.data.totalCount
          }

          // 将API返回的数据转换为前端需要的格式
          this.inventoryList = apiInventoryList.map((item, index) => {
            // 计算可用库存数量（quantity）
            const availableQty = item.quantity

            return {
              uniqueCode:item.uniqueCode,
              productId: item.productId, // 使用产品ID作为库存数量ID
              productNumber: item.productNumber,
              productName: item.productName,
              warehouseCode: item.warehouseCode,
              projectId: this.project.id,
              projectName: this.project.name,
              availableQty: availableQty > 0 ? availableQty : 0, // 确保可用库存不为负数
              unitDictionaryId: item.unitDictionaryId, // 单位信息需要从其他字段获取或留空
              unitDictionaryName:item.unitDictionaryName,
              receiveProductPackVo: item.receiveProductPackVo, // 收货单位包装信息
              // 批次属性直接提取到顶层，便于表格列直接访问
              lotAttr01Value: item.lotAttr01Value,
              lotAttr02Value: item.lotAttr02Value,
              lotAttr03Value: item.lotAttr03Value,
              lotAttr04Value: item.lotAttr04Value,
              lotAttr05Value: item.lotAttr05Value,
              lotAttr06Value: item.lotAttr06Value,
              lotAttr07Value: item.lotAttr07Value,
              lotAttr08Value: item.lotAttr08Value,
              lotAttr09Value: item.lotAttr09Value,
              lotAttr10Value: item.lotAttr10Value,
              lotAttr11Value: item.lotAttr11Value,
              lotAttr12Value: item.lotAttr12Value,
              lotAttr13Value: item.lotAttr13Value,
              lotAttr14Value: item.lotAttr14Value,
              lotAttr15Value: item.lotAttr15Value
            }
          })

          console.log('API返回数据转换结果:', this.inventoryList)
        } else {
          // API返回数据为空或格式不正确
          this.inventoryList = []
          this.pagination.total = 0
          this.$message.warning('未查询到库存数据')
        }
      }).catch((error) => {
        console.error('API调用失败:', error)
        this.inventoryList = []
        this.pagination.total = 0
        this.$message.error('库存查询失败，请稍后重试')
      }).finally(() => {
        // 无论成功或失败，都隐藏loading效果
        this.tableLoading = false
      })
    },

    // 分页大小变化处理
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.currentPage = 1 // 重置到第一页
      this.loadInventoryList()
    },

    // 当前页码变化处理
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loadInventoryList()
    }
  }
}
</script>

<style scoped>
.inventory-selection {
  height: 700px;
}

.inventory-table {
  margin-top: 10px;
}

.operation-buttons{
  margin-top: 10px;
}

/* 优化表格容器样式 */
.inventory-table .u-table {
  height: 100% !important;
}

/* 调整对话框大小以适应更多列 */
.el-dialog {
  min-width: 1200px;
  max-width: 95vw;
}
</style>
