<template>
  <el-dialog
    :title="title"
    custom-class="dialog_customWidth"
    top="5vh"
    :visible.sync="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="resetForm"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      size="mini"
      label-width="120px"
      style="padding-right: 20px"
    >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="供应商" prop="supplierId">
          <el-select
            filterable
            :filter-method="supplierFilterHandle"
            @visible-change="supplierOptionsForSelect = supplierOptions"
            v-model="formData.supplierId"
            placeholder="请选择供应商"
            style="width: 100%"
          >
            <el-option
              v-for="item in supplierOptionsForSelect"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierId">
              <span style="float: left">{{ item.supplierCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplierName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="送货仓库" prop="deliveryWarehouseCode">
          <el-select
            v-model="formData.deliveryWarehouseCode"
            placeholder="请选择送货仓库"
            style="width: 100%"
          >
            <el-option
              v-for="item in warehouseOptions"
              :key="item.warehouseCode"
              :label="item.warehouseName"
              :value="item.warehouseCode">
              <span style="float: left">{{ item.warehouseCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="货主" prop="projectId">
          <el-select
            v-model="formData.projectId"
            placeholder="请选择货主"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
              <span style="float: left">{{ item.projectCode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="送货方式" prop="deliveryMethodCode">
          <el-select
            v-model="formData.deliveryMethodCode"
            placeholder="请选择送货方式"
            style="width: 100%"
            @change="deliveryMethodChangeHandle"
          >
            <el-option
              v-for="item in deliveryMethodOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8" v-if="formData.deliveryMethodCode == 1">
        <el-form-item label="承运商" prop="carrierId">
          <el-select
            v-model="formData.carrierId"
            placeholder="请选择承运商"
            style="width: 100%"
            @change="carrierChangeHandle"
          >
            <el-option
              v-for="item in carriers"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="预计到仓日期" prop="estimatedDeliveryDate">
          <el-date-picker
            v-model="formData.estimatedDeliveryDate"
            type="date"
            placeholder="请选择预计到仓日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"  v-if="formData.deliveryMethodCode == 1">
        <el-form-item label="提货地址" prop="fromAddressId">
          <el-select
            size="mini"
            v-model="formData.fromAddressName"
            filterable
            @change="fromAddressChangeHandle"
            reserve-keyword
            value-key="id"
            clearable
            style="width:100%"
            placeholder="地址名称">
            <el-option
              v-for="item in fromAddressList"
              :key="item.id"
              :label="item.name"
              :value="item">
              <span style="float: left">{{ item.code }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="formData.remarks"
            type="textarea"
            :rows="1"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 采购建议单明细表格 -->
    <el-form-item label="明细信息">
      <div style="margin-top: 10px;">
        <el-button type="primary" size="mini" @click="addDetailRow">
          +
        </el-button>
      </div>
      <el-table
        ref="detailTable"
        :data="formData.detailList"
        row-key="index"
        :row-class-name="tableRowClassName"
        border
        size="mini"
        show-summary
        :summary-method="getSummaries"
        max-height="450"
        style="width: 100%"
        @expand-change="queryLotAttributeValueByOrderDetailId"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column label="产品编码" min-width="150"  align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.productNumber"
              placeholder="输入产品编码按Tab搜索"
              @keydown.tab.native="searchProductByCode(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column label="产品名称" min-width="200"  align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.productName"
              filterable
              size="mini"
              style="width:100%"
              remote
              value-key="productId"
              reserve-keyword
              placeholder="输入产品名称模糊搜索"
              :remote-method="(query) => debounceSearchProductByName(scope.row, scope.$index, query)"
              :loading="productCnNameLoading"
              @change="(value) => fillProductInfo(scope.row, value,scope.$index)">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item">
                <span style="float: left">{{ item.productNumber}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="订货数量" width="150"  align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.quantity"
              size="mini"
              :min="0"
              controls-position="right"
              style="width: 100%"
              @change="calculateTotals(scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="unitDictionaryName" label="单位" min-width="100"  align="center">
          <template slot-scope="scope">
            <el-select @change="calculateTotals(scope.$index)" size="mini"
                       style="width: 100%" v-model="scope.row.unitDictionaryName" placeholder="单位选择">
              <el-option
                v-for="(item, index) in scope.row.packList"
                :key="index"
                :label="item.unitDictionaryName"
                :value="item.unitDictionaryName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  type="expand" label="拓展字段" width="100">
          <template slot-scope="{row}" >
            <div class="lot-attribute-container">
              <el-row :gutter="12">
                <el-col :span="6" v-for="(lotAttribute,index) in row.lotAttributeVos" :key="index" class="lot-attribute-item">
                  <div class="attribute-label">
                    <span class="label-text">{{lotAttribute.lotAttrLabel}}</span>
                    <span v-if="lotAttribute.required" class="required-mark">*</span>
                  </div>
                  <div class="attribute-control">
                    <el-input
                      size="small"
                      v-if="lotAttribute.lotAttrType == 'String'"
                      v-model="lotAttribute.lotAttrValue"
                      :placeholder="lotAttribute.lotAttrLabel"
                      clearable
                    ></el-input>

                    <el-select
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'Select'"
                      v-model="lotAttribute.lotAttrValue"
                      placeholder="请选择"
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in lotAttribute.lotAttrSelectOptions.split('#')"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>

                    <el-date-picker
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'yyyy-MM-dd'"
                      v-model="lotAttribute.lotAttrValue"
                      :format="lotAttribute.lotAttrType"
                      :value-format="lotAttribute.lotAttrType"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>

                    <el-date-picker
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'yyyy-MM-dd HH:mm:ss'"
                      v-model="lotAttribute.lotAttrValue"
                      style="width: 100%"
                      :format="lotAttribute.lotAttrType"
                      :value-format="lotAttribute.lotAttrType"
                      type="datetime"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>

        <el-table-column  prop="weight" label="总重量(kg)" width="120"  align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.weight"
              size="mini"
            />
          </template>
        </el-table-column>


        <el-table-column prop="volume" label="总体积(cm³)" width="120"  align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.volume"
              size="mini"
              placeholder="请输入体积"
            />
          </template>
        </el-table-column>

        <el-table-column prop="totalPrice" label="总价" width="120"  align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.totalPrice"
              size="mini"
              placeholder="请输入总价"
            />
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="150"  align="center">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="1"
              v-model="scope.row.remarks"
              size="mini"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="color: #ff0000"
              size="mini"
              @click="deleteDetailRow(scope.row.id,scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <div style="text-align: center; width: 100%;">
        <el-button @click="resetForm">重置</el-button>
        <el-button style="width:10%" type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </div>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import API from "@/api";
export default {
  name: 'UpdateOrAdd',
  computed: {
    ...mapGetters([
      'client',
      'projects',
      'carriers'
    ]),
  },
  props:{
    visible: {
      type: Boolean,
      default: false
    },

    deliveryMethodOptions:{
      type:Array,
      default:[]
    }
  },
  data() {
    // 防抖定时器
    this.debounceTimer = null;

    return {
      formData:{
        id: null,
        orderNumber:'',
        deliveryWarehouseCode: '',
        deliveryWarehouseName: '',
        supplierId: null,
        supplierCode: '',
        supplierName: '',
        clientId: null,
        clientCode: '',
        clientName: '',
        projectId: null,
        projectCode: '',
        projectName: '',
        fromAddressId:'',
        fromAddressName:'',
        fromAddressCode:'',
        documentTypeCode: '10',
        documentTypeName: '采购订单',
        deliveryMethodCode: '',
        deliveryMethodName: '',
        carrierId: null,
        carrierCode: '',
        carrierName: '',
        orderStatus: 10,
        orderStatusName: '待确认',
        estimatedDeliveryDate: '',
        remarks: '',
        detailList:[]
      },
      submitLoading:false,
      dialogVisible: false,
      title: '',
      productCnNameLoading:false,
      fromAddressList:[],
      product:[],
      productList:[],
      lotAttributeVos: [], // 扩展字段列表
      orderStatusOptions: [
        { label: '待确认', value: 10 },
        { label: '已确认', value: 20 },
        { label: '执行中', value: 30 },
        { label: '已完成', value: 40 },
        { label: '已取消', value: 50 }
      ],
      warehouseOptions:[],
      projectOptions:[],
      carrierOptions:[],
      supplierOptions:[],
      supplierOptionsForSelect:[],
      // 用于控制watch监听器的触发时机
      shouldTriggerWarehouseWatch: false,
      shouldTriggerProjectWatch: false,
      // 表单验证规则
      rules: {
        deliveryWarehouseCode: [
          { required: true, message: '请选择送货仓库', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],
        deliveryMethodCode: [
          { required: true, message: '请选择送货方式', trigger: 'change' }
        ],
        estimatedDeliveryDate: [
          { required: true, message: '请选择预计到仓日期', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
      if (!val) {
        this.$emit('close');
      }
    },

    // 监听供应商ID变化，自动加载仓库
    'formData.supplierId': {
      handler(newVal, oldVal) {
        if (newVal && oldVal != newVal) {
          if(this.supplierOptions.length > 0){
            let supplier = this.supplierOptions.find(supplier => supplier.supplierId == newVal)
            if(supplier){
              this.formData.supplierCode = supplier.supplierCode;
              this.formData.supplierName = supplier.supplierName;
            }

          }
          this.loadWarehouseOptions();
        }

      },
      immediate: false
    },

    // 监听仓库编码变化，自动加载货主
    'formData.deliveryWarehouseCode': {
      handler(newVal, oldVal) {
        if (!this.shouldTriggerWarehouseWatch) {
          return
        }
        if (newVal == oldVal) {
          return;
        }
        if (!newVal) {
          return;
        }
        if(this.warehouseOptions.length > 0){
          let warehouse = this.warehouseOptions.find(warehouse => warehouse.warehouseCode == newVal)
          if (warehouse) {
            this.formData.deliveryWarehouseName = warehouse.warehouseName;
          }
        }

        this.loadProjectOptions();

      },
      immediate: false
    },

    // 监听货主ID变化，自动加载批次属性
    'formData.projectId': {
      handler(newVal,oldVal) {
        if(!this.shouldTriggerProjectWatch){
          return;
        }
        if(newVal == oldVal){
          return;
        }
        if(!newVal){
          return;
        }

        let project = this.projectOptions.find(project => project.projectId == newVal);
        if(project){
          this.formData.projectCode = project.projectCode;
          this.formData.projectName = project.projectName;
        }

        this.queryLotAttributeByCustomerId();
        this.getFromAddressListByProjectIdHandle();
        if(this.formData.detailList && this.formData.detailList.length > 0){
          this.resetDetailList();
        }
      },
      immediate: false
    }
  },
  methods: {
    async addInit(dialogTitle,formData){
      this.dialogVisible = true;
      this.title = dialogTitle;
      this.initFormData();
      try {
        // 启用watch监听器
        this.shouldTriggerWarehouseWatch = true;
        this.shouldTriggerProjectWatch = true;
        // 1. 加载供应商
        await this.loadSupplierOptions();

        await this.$nextTick();
      } catch (error) {
        console.error('初始化失败:', error);
        this.$message.error('初始化失败，请重试');
      }
    },
    async updateInit(dialogTitle,formData){
      this.dialogVisible = true;
      this.title = dialogTitle;
      try {
        // 启用watch监听器
        this.shouldTriggerWarehouseWatch = true;
        this.shouldTriggerProjectWatch = true;
        this.formData = {
          id: formData.id,
          orderNumber:formData.orderNumber,
          deliveryWarehouseCode: formData.deliveryWarehouseCode,
          deliveryWarehouseName: formData.deliveryWarehouseName,
          supplierId: formData.supplierId,
          supplierCode: formData.supplierCode,
          supplierName:formData.supplierName,
          clientId:formData.clientId,
          clientCode:formData.clientCode,
          clientName: formData.clientName,
          projectId: formData.projectId,
          projectCode: formData.projectCode,
          projectName: formData.projectName,
          fromAddressId:formData.fromAddressId,
          fromAddressName:formData.fromAddressName,
          fromAddressCode:formData.fromAddressCode,
          deliveryMethodCode: formData.deliveryMethodCode,
          deliveryMethodName: formData.deliveryMethodName,
          carrierId: formData.carrierId,
          carrierCode: formData.carrierCode,
          carrierName: formData.carrierName,
          estimatedDeliveryDate: formData.estimatedDeliveryDate,
          remarks: formData.remarks,
        }
        // 1. 加载供应商
        await this.loadSupplierOptions();
        await this.loadOrderDetails();
        await this.loadProductPack();

        // 5. 确保DOM更新完成
        await this.$nextTick();
      } catch (error) {
        console.error('初始化失败:', error);
        this.$message.error('初始化失败，请重试');
      }
    },
    async addInitFromForecastRecord(dialogTitle,formData){
      this.dialogVisible = true;
      this.title = dialogTitle;
      try {
        this.formData = {
          id: null,
          orderNumber:'',
          forecastRecordIdList: formData.forecastRecordIdList,
          deliveryWarehouseCode: formData.deliveryWarehouseCode,
          deliveryWarehouseName: formData.deliveryWarehouseName,
          supplierId: formData.supplierId,
          supplierCode: formData.supplierCode,
          supplierName:formData.supplierName,
          clientId:formData.clientId,
          clientCode:formData.clientCode,
          clientName: formData.clientName,
          projectId: formData.projectId,
          projectCode: formData.projectCode,
          projectName: formData.projectName,
          fromAddressId:'',
          fromAddressName:'',
          fromAddressCode:'',
          documentTypeCode: '10',
          documentTypeName: '采购订单',
          deliveryMethodCode: '',
          deliveryMethodName: '',
          carrierId: null,
          carrierCode: '',
          carrierName: '',
          orderStatus: 10,
          orderStatusName: '待确认',
          estimatedDeliveryDate: '',
          remarks: formData.remarks,
          // 前端页面新增订单的操作来源，2=通过库存预测记录创建采购订单
          frontAddOrderSource: 2,
          detailList: formData.detailList,
        }

        // 1. 加载供应商
        await this.loadSupplierOptions();
        this.loadProjectOptions();
        this.queryLotAttributeByCustomerId();
        this.getFromAddressListByProjectIdHandle();
        await this.loadProductPack();
        this.formData.detailList.forEach((item,index) => {
          this.calculateTotals(index)
        })

        // 5. 确保DOM更新完成
        await this.$nextTick();
        // 启用watch监听器
        this.shouldTriggerWarehouseWatch = true;
        this.shouldTriggerProjectWatch = true;
      } catch (error) {
        console.error('初始化失败:', error);
        this.$message.error('初始化失败，请重试');
      }
    },
    initFormData(){
      this.formData = {
        id: null,
        orderNumber:'',
        deliveryWarehouseCode: '',
        deliveryWarehouseName: '',
        supplierId: null,
        supplierCode: '',
        supplierName: '',
        clientId: null,
        clientCode: '',
        clientName: '',
        projectId: null,
        projectCode: '',
        projectName: '',
        fromAddressId:'',
        fromAddressName:'',
        fromAddressCode:'',
        documentTypeCode: '10',
        documentTypeName: '采购订单',
        deliveryMethodCode: '',
        deliveryMethodName: '',
        carrierId: null,
        carrierCode: '',
        carrierName: '',
        orderStatus: 10,
        orderStatusName: '待确认',
        estimatedDeliveryDate: '',
        remarks: '',
        detailList:[]
      };
      this.shouldTriggerWarehouseWatch = false;
      this.shouldTriggerProjectWatch = false;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => {
          const value = item[column.property];
          return parseFloat(value) || 0;
        });

        if (!values.every(value => isNaN(value))) {
          // 根据列属性计算不同的汇总值

          switch (column.property) {
            case 'quantity':
              sums[index] = values.reduce((prev, curr) => prev + curr, 0);
              break;
            case 'weight':
              sums[index] = values.reduce((prev, curr) => prev + curr, 0);
              break;
            case 'volume':
              const totalCm3 = values.reduce((prev, curr) => prev + curr, 0);
              const totalM3 = (totalCm3 / 1000000).toFixed(6);
              // 使用 VNode 创建复杂的 DOM 结构
              sums[index] = this.$createElement('div', {}, [
                this.$createElement('div', {

                }, `${totalCm3} cm³`),
                this.$createElement('div', {
                }, `${totalM3} m³`)
              ]);
              break;
            case 'totalPrice':
              sums[index] = values.reduce((prev, curr) => prev + curr, 0);
              break;
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    /**
     *模糊搜索提货地址名称
     */
    getFromAddressListByProjectIdHandle() {
      if(!this.formData.projectId){
        this.$message.warning("请先选择货主！");
        return;
      }
      this.fromAddressList = [];

      API.address.getAddressVosByCustomerId(this.formData.projectId).then(({data}) => {
        if (data && data.code === 0) {
          this.fromAddressList = data.data;
        }
      });
    },
    fromAddressChangeHandle(item){
      this.formData.fromAddressCode = item.code;
      this.formData.fromAddressName = item.name;
      this.formData.fromAddressId = item.id
    },
    //货主发生改变时，需要清空明细信息
    resetDetailList(){
      this.formData.detailList=[];
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if(this.formData.id){
            API.suggestion.update(this.formData).then(({ data }) => {
              if(data.code == 0){
                this.$emit('submit');
                this.dialogVisible = false;
              }
              this.submitLoading = false;

            }).catch(error => {
              this.submitLoading = false;
            })
          }else{
            this.formData.clientId = this.client.id;
            this.formData.clientName =this.client.cnName;
            this.formData.clientCode = this.client.code;
            API.suggestion.save(this.formData).then(({ data }) => {
              if(data.code == 0){
                this.$emit('submit');
                this.dialogVisible = false;
              }
              this.submitLoading = false;
            }).catch(error => {
              this.submitLoading = false;
            })
          }

        }
      })
    },
    //加载订单明细
    loadOrderDetails(){
      return new Promise((resolve, reject) => {
        API.suggestion.getDetailListByOrderNumber(this.formData.orderNumber).then(({ data }) => {
          if (data && data.code ===0){
            this.$set(this.formData,'detailList',data.data)
          }
          resolve();
        }).catch(error => {
          reject(error);
        })
      });
    },
    loadProductPack(){
      for (let i = 0; i < this.formData.detailList.length; i++) {
        let element = this.formData.detailList[i];

        this.getProductPackByProductIdHandle(element)
      }
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
      this.initFormData();
      // 清空内部数据
      this.productList = []
      this.formData.detailList=[]
      this.productCnNameLoading = false
      this.product = null
    },

    // 获取供应商列表
     loadSupplierOptions() {
      // 实际应用中应该调用API获取数据
       return new Promise((resolve, reject) => {
         API.productPriceConfig.getSupplierByClientId(this.client.id).then(({data}) => {
           if (data.code == 0) {
             this.supplierOptions = data.data;
             this.supplierOptionsForSelect = this.supplierOptions;
             //如果只有一个供应商，直接选中，选中的同时 查询仓库
             if (this.supplierOptions.length == 1) {
               this.formData.supplierId = this.supplierOptions[0].supplierId;
               this.formData.supplierCode = this.supplierOptions[0].supplierCode;
               this.formData.supplierName = this.supplierOptions[0].supplierName;
             }
           }
           resolve();
         }).catch(error => {
           reject(error);
         })
       })
    },
    //查询仓库信息
    loadWarehouseOptions(){
      if (!this.formData.supplierId) {
        return;
      }
      // 调用API获取仓库列表
      API.productPriceConfig.getWarehouseBySupplierId(this.client.id, this.formData.supplierId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.warehouseOptions = data.data;
          //如果只有一个仓库，直接选中，同时查询货主信息
          if(this.warehouseOptions.length ==1){
            this.formData.deliveryWarehouseCode = this.warehouseOptions[0].warehouseCode;
            this.formData.deliveryWarehouseName = this.warehouseOptions[0].warehouseName;
          }
        }
      }).catch(error => {
      });
    },
    //查询货主信息
    loadProjectOptions(){
      if (!this.formData.supplierId || !this.formData.deliveryWarehouseCode) {
        return;
      }
      // 调用API获取货主列表
      API.productPriceConfig.getProjectBySupplierAndWarehouseCode(
        this.client.id,
        this.formData.supplierId,
        this.formData.deliveryWarehouseCode
      ).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.projectOptions = data.data;
          //如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
          if(this.projectOptions.length ==1){
            this.formData.projectId = this.projectOptions[0].projectId;
            this.formData.projectCode = this.projectOptions[0].projectCode;
            this.formData.projectName = this.projectOptions[0].projectName;
          }
        }
      }).catch(error => {
      });
    },
    carrierChangeHandle(){
      if(!this.formData.carrierId){
        return;
      }
      let carrier = this.carriers.find(carrier => carrier.id == this.formData.carrierId)
      this.formData.carrierCode = carrier.code;
      this.formData.carrierName = carrier.fullName;

    },

    deliveryMethodChangeHandle(){
      let deliveryMethod = this.deliveryMethodOptions.find(item => item.value == this.formData.deliveryMethodCode)
      if(deliveryMethod){
        this.formData.deliveryMethodName = deliveryMethod.name;
      }
      this.updateFormValidationRules();
    },
    // 更新表单验证规则，根据送货方式动态控制承运商和提货地址的必填性
    updateFormValidationRules() {
      // 复制原始规则
      const newRules = { ...this.rules };

      // 送货方式等于1时，承运商和提货地址必填
      if (this.formData.deliveryMethodCode === 1) {
        newRules.carrierId = [
          { required: true, message: '请选择承运商', trigger: 'change' }
        ];
        newRules.fromAddressId = [
          { required: true, message: '请选择提货地址', trigger: 'change' }
        ];
      } else {
        // 送货方式不等于1时，承运商和提货地址不必填
        newRules.carrierId = [];
        newRules.fromAddressId = [];
        this.formData.carrierId=null;
        this.formData.carrierCode='';
        this.formData.carrierName='';
        this.formData.fromAddressId=null;
        this.formData.fromAddressName='';
        this.formData.fromAddressCode='';
      }

      // 更新规则
      this.rules = newRules;

      // 清除相关字段的验证状态
      if (this.$refs.form) {
        this.$refs.form.clearValidate(['carrierId', 'fromAddressName']);
      }
    },
    // 表格行样式
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
    },
    //根据订单明细ID查询批属性值
    queryLotAttributeValueByOrderDetailId(row, expandedRows) {
      if(!row.id){
        return
      }
      if(row.lotAttributeVos && row.lotAttributeVos.length > 0){
        return;
      }
      API.suggestion.queryLotAttributeValueByOrderDetailId(row.id).then(({data}) => {
        if (data.data && data.code === 0) {
          this.$set(row,"lotAttributeVos",data.data);
        }
      })
    },

    // 根据客户ID查询批次属性
    queryLotAttributeByCustomerId() {
      if (!this.formData.projectId) {
        return;
      }

      API.lotAttribute.queryLotAttributeByCustomerId(this.formData.projectId, 0).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.lotAttributeVos = data.data;
          if(this.formData.frontAddOrderSource === 2 && this.formData.detailList && this.formData.detailList.length > 0){
            // 通过库存预测记录新增的采购订单给订单行赋批属性初始值
            this.formData.detailList.forEach(item => this.$set(item,"lotAttributeVos",structuredClone(this.lotAttributeVos)));
          }

        }
      }).catch(error => {
        console.error('查询客户批次属性失败:', error);
      });
    },

    // 新增明细行
    addDetailRow() {
      this.formData.detailList.push({
        id: null, // 使用时间戳作为临时ID
        productId: null,
        productNumber: '',
        productName: '',
        quantity: 0,
        unitDictionaryName: '',
        unitDictionaryId:'',
        volume: 0,
        weight: 0,
        totalPrice: 0,
        remarks: '',
        lotAttributeVos: this.lotAttributeVos ? JSON.parse(JSON.stringify(this.lotAttributeVos)) : [], // 深拷贝初始化扩展字段
      });
      this.$refs.detailTable.doLayout();
    },

    // 删除明细行
    deleteDetailRow(id,index) {

      // 如果明细行有ID（已保存到数据库），需要调用API删除
      if (id) {
        this.$confirm('确认删除该明细行？', '删除确认', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idList = [id];
          API.suggestion.deleteByIds(idList).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('删除成功');
              this.formData.detailList.splice(index, 1);
            } else {
              this.$message.error(data.message || '删除失败');
            }
          }).catch(error => {
            console.error('删除失败:', error);
            this.$message.error('删除失败');
          });
        });
      } else {
        // 没有ID（新增未保存的行），直接从前端删除
        this.formData.detailList.splice(index, 1);
      }
    },

    // 根据产品编码搜索产品
    searchProductByCode(row, index) {
      if (!row.productNumber) return;
      let param = {
        productNumber:row.productNumber,
        projectId:this.formData.projectId,
        warehouseCode:this.formData.deliveryWarehouseCode,
        supplierId:this.formData.supplierId,
        clientId:this.client.id
      }
      API.productPriceConfig.fuzzyQueryProduct(param).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.product = data.data[0];
          if(this.product){
            this.fillProductInfo(row, this.product,index);
          }

        } else if (data.code === 0 && !data.data) {
          this.$message.warning("该货主下未找到产品[" + productNumber + "]的相关信息，请确认后重试");
          return;
        }
      });
    },

    // 根据产品名称模糊搜索产品（防抖）
    debounceSearchProductByName(row, index, query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchProductByName(row, index, query);
      }, 500);
    },

    // 根据产品名称搜索产品
    searchProductByName(row, index, query) {
      if (!query) return;
      // 根据输入的产品名称，模糊查找产品编码+名称
      if (!this.formData.projectId) {
        this.$message.warning("请录入货主再进行查询");
        return;
      }

      this.productList=[];
      this.productCnNameLoading=true;
      let param = {
        productName:query,
        projectId:this.formData.projectId,
        warehouseCode:this.formData.deliveryWarehouseCode,
        supplierId:this.formData.supplierId,
        clientId:this.client.id
      }

      API.productPriceConfig.fuzzyQueryProduct(param).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.productList = data.data;
        }
        this.productCnNameLoading=false;
      }).catch(error => {
        this.productCnNameLoading=false;
      })
    },
    //根据产品查询包装信息
    getProductPackByProductIdHandle(row){
      API.product.getProductPackByProductId(row.productId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.$set(row, 'packList', data.data);
        }

        if(data.data.length == 1){
          row.unitDictionaryName = row.packList[0].unitDictionaryName;
          row.unitDictionaryId = row.packList[0].unitDictionaryId;
        }

        if(this.formData.frontAddOrderSource === 2 && row.quantity > 0 && row.unitDictionaryId && row.weight === null){
          // 通过库存预测生成采购建议单，初始化数据时计算重量、体积
          let calculateIndexArr = [];
          this.formData.detailList.forEach((item,index) => {
            if(row.productId === item.productId){
              calculateIndexArr.push(index);
            }
          })
          calculateIndexArr.forEach(item => this.calculateTotals(item))
        }

      }).catch(error => {
      })
    },

    // 填充产品信息
    fillProductInfo(row, product,index) {
      row.productId = product.productId;
      row.productNumber = product.productNumber;
      row.productName = product.productName;
      this.getProductPackByProductIdHandle(row);
      this.calculateTotals(index);
    },

    // 计算总重量和总体积
    calculateTotals(index) {

      let orderDetail = this.formData.detailList[index];
      if(!orderDetail.packList || orderDetail.packList.length == 0){
        return;
      }
      let quantity = parseFloat(orderDetail.quantity);
      if(quantity <= 0){
        return;
      }
      // 计算毛重、净重、体积
      this.formData.detailList[index].weight = 0;
      this.formData.detailList[index].volume = 0;
      for (let i = 0; i < orderDetail.packList.length; i++) {
        let item =orderDetail.packList[i];
        if (item.unitDictionaryName === orderDetail.unitDictionaryName) {
          orderDetail.productPackId = item.id;
          orderDetail.unitDictionaryId=item.unitDictionaryId;
          item.volume = (item.caseHeight ? item.caseHeight : 0) * (item.caseLength ? item.caseLength : 0) * (item.caseWidth ? item.caseWidth : 0)
          orderDetail.weight = ((item.grossWeight ? item.grossWeight : 0) * (quantity ? quantity : 0)).toFixed(2);
          orderDetail.volume = ((item.volume ? item.volume : 0) * (quantity ? quantity : 0)).toFixed(2);
        }
      }
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
  },

}
</script>

<style scoped>
/* 扩展字段容器样式 - 简化版 */
.lot-attribute-container {
  padding: 12px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
}

/* 扩展字段项样式 */
.lot-attribute-item {
  margin-bottom: 12px;
}

/* 标签样式 */
.attribute-label {
  margin-bottom: 6px;
}

.label-text {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.required-mark {
  color: #f56c6c;
  font-size: 12px;
  margin-left: 2px;
}

/* 控件样式 */
.attribute-control {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .lot-attribute-item {
    width: 100%;
  }
}
</style>
