<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog_customWidth"
    top="10vh"
    :visible.sync="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="form"
      :model="currentFormData"
      :rules="rules"
      size="mini"
      label-width="120px"
      style="padding-right: 20px"
    >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="货主" prop="projectId">
          <el-select @change="projectChangeHandle" size="mini" style="width:100%" v-model="currentFormData.projectId" filterable placeholder="请选择货主" clearable>
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
      <el-col :span="8">
        <el-form-item label="仓库" prop="warehouseCode">
          <el-select
            v-model="currentFormData.warehouseCode"
            @change="warehouseChangeHandle"
            placeholder="请选择仓库"
            style="width: 100%"
          >
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
      <el-col :span="8">
        <el-form-item label="供应商" prop="supplierId">
          <el-select
            filterable
            :filter-method="supplierFilterHandle"
            @visible-change="supplierOptionsForSelect = supplierOptions"
            v-model="currentFormData.supplierId"
            @change="supplierChangeHandle"
            placeholder="请选择供应商"
            style="width: 100%"
          >
            <el-option
              style="width:400px"
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


    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="产品编码" prop="productNumber">
          <el-input
            v-model="currentFormData.productNumber"
            placeholder="请输入产品编码"
            style="width: 100%"
            @keydown.tab.native="searchProductByCode"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="产品名称" prop="productName">
          <el-select
            v-model="currentFormData.productName"
            filterable
            remote
            reserve-keyword
            placeholder="输入产品名称模糊搜索"
            :remote-method="(query) => debounceSearchProductByName(query)"
            :loading="productCnNameLoading"
            @change="(value) => fillProductInfo(null,value)"
            style="width: 100%">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.productCnName"
              :value="item.id">
              <span style="float: left">{{ item.productNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productCnName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="安全库存天数" prop="safeStockDay">
          <el-input-number
            v-model="currentFormData.safeStockDay"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
<!--      <el-col :span="8">-->
<!--        <el-form-item label="订货周期(天)" prop="orderCycleTime">-->
<!--          <el-input-number-->
<!--            v-model="currentFormData.orderCycleTime"-->
<!--            :min="0"-->
<!--            controls-position="right"-->
<!--            style="width: 100%"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-col>-->
    </el-row>

    <el-row :gutter="20">
<!--      <el-col :span="8">-->
<!--        <el-form-item :label="'最小起订量(收货单位)'" prop="minOrderQuantity">-->
<!--          <el-input-number-->
<!--            v-model="currentFormData.minOrderQuantity"-->
<!--            :min="0"-->
<!--            controls-position="right"-->
<!--            style="width: 100%"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-col>-->
      <el-col :span="8">
        <el-form-item label="代采服务价" prop="proxyPurchasePrice">
          <el-input
            v-model="currentFormData.proxyPurchasePrice"
            placeholder="请输入代采服务价"
            style="width: 100%"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="出厂价" prop="factoryPrice">
          <el-input
            v-model="currentFormData.factoryPrice"
            placeholder="请输入出厂价"
            style="width: 100%"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input
            v-model="currentFormData.purchasePrice"
            placeholder="请输入采购价"
            style="width: 100%"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="调拨价" prop="transferPrice">
          <el-input
            v-model="currentFormData.transferPrice"
            placeholder="请输入调拨价"
            style="width: 100%"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="备注" prop="remarks">
      <el-input
        v-model="currentFormData.remarks"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息"
      />
    </el-form-item>

    <el-form-item>
      <div style="text-align: center; width: 100%;">
        <el-button @click="resetForm">重置</el-button>
        <el-button style="width:10%" type="primary" :loading="submitButtonLoading" @click="submitForm">保存</el-button>
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
    ]),
  },
  data() {
    // 防抖定时器
    this.debounceTimer = null;
    return {
      dialogVisible: false,
      dialogTitle: '',
      currentFormData: {
        id: null,
        productNumber: '',
        productName: '',
        warehouseCode: '',
        warehouseName: '',
        clientId: null,
        clientName: '',
        clientCode: '',
        projectId: null,
        projectName: '',
        projectCode: '',
        supplierId: null,
        supplierName: '',
        supplierCode: '',
        safeStockDay: 0,
        // orderCycleTime: 0,
        // minOrderQuantity: 0,
        proxyPurchasePrice: 0,
        factoryPrice: 0,
        purchasePrice: 0,
        transferPrice: 0,
        remarks: ''
      },
      submitButtonLoading:false,
      supplierOptions:[],
      supplierOptionsForSelect:[],
      productList: [], // 产品列表
      projectOptions:[],
      warehouseOptions:[],
      productCnNameLoading: false, // 产品名称搜索加载状态
      product: null, // 当前选中的产品
      // 表单验证规则
      rules: {
        productNumber: [
          { required: true, message: '请输入产品编码', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        projectId:[
          { required: true, message: '请选择货主', trigger: 'blur' }
        ],
        supplierId:[
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        clientId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        // orderCycleTime: [
        //   { required: true, message: '请输入订货周期', trigger: 'blur' }
        // ],
        // minOrderQuantity: [
        //   { required: true, message: '请输入最小起订量(收货单位)', trigger: 'blur' }
        // ],
        safeStockDay: [
          { required: true, message: '请输入安全库存天数', trigger: 'blur' }
        ],

        proxyPurchasePrice: [
          { required: true, message: '请输入代采服务价', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ],
        factoryPrice: [
          { required: true, message: '请输入出厂价', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ],
        transferPrice: [
          { required: true, message: '请输入调拨价', trigger: 'blur' },
          { validator: this.validatePrice, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增初始化方法（供父组件调用）
    addInit() {
      this.dialogTitle = '新增产品价格配置'
      this.currentFormData = {
        id: null,
        warehouseCode: '',
        warehouseName: '',
        supplierId: null,
        supplierCode: '',
        supplierName: '',
        clientId: null,
        clientCode: '',
        clientName: '',
        projectId: null,
        projectCode: '',
        projectName: '',
        productId: null,
        productNumber: '',
        productName: '',
        proxyPurchasePrice: 0.00,
        factoryPrice: 0.00,
        purchasePrice: 0.00,
        transferPrice: 0.00,
        safeStockDay: 0,
        // orderCycleTime: 0,
        // minOrderQuantity: 0,
        createdBy: '',
        createdTime: '',
        lastModifiedBy: '',
        lastModifiedTime: '',
        delFlag: 1,
        remarks: ''
      }
      this.dialogVisible = true
      this.loadProjectOptions();
    },

    // 编辑初始化方法（供父组件调用）
    updateInit(rowData) {
      this.dialogTitle = '编辑产品价格配置'
      this.currentFormData = { ...rowData }
      this.dialogVisible = true  ;
      this.loadWarehouseOptions();
      this.loadProjectOptions();
      this.loadSupplierOptions();

    },
    supplierFilterHandle(val) {
      if (val) {
        this.supplierOptionsForSelect = this.supplierOptions.filter((item => {
          if (!!~item.code.indexOf(val) || !!~item.code.toUpperCase().indexOf(val.toUpperCase()) || !!~item.shortName.indexOf(val) || !!~item.shortName.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      } else {
        this.supplierOptionsForSelect = this.supplierOptions;
      }
    },

    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 重置表单（供父组件调用）
    reset() {
      this.resetForm()
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.currentFormData.clientId=this.client.id;
          this.currentFormData.clientCode = this.client.code;
          this.currentFormData.clientName = this.client.cnName;
          this.submitButtonLoading=true;
          if(this.currentFormData.id){

            API.productPriceConfig.update(this.currentFormData).then(({ data }) => {
              if(data.code == 0){
                this.$emit("submit");
                this.dialogVisible=false;
              }
              this.submitButtonLoading=false;

            }).catch(error => {
              this.submitButtonLoading=false;
            })
          }else{
            API.productPriceConfig.save(this.currentFormData).then(({ data }) => {
              if( data.code == 0){
                this.$emit("submit");
                this.dialogVisible=false;

              }
              this.submitButtonLoading=false;
            }).catch(error => {
              this.submitButtonLoading=false;
            })
          }

        }


      })
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
      // 清空内部数据
      this.productList = []
      this.productCnNameLoading = false
      this.product = null
    },


    // 根据产品编码搜索产品信息
    searchProductByCode() {
      if (!this.currentFormData.productNumber) return;

      if (!this.currentFormData.projectId) {
        this.$message.warning("请录入货主再进行查询");
        return;
      }

      API.product.queryEntityByProductNumberAndCustomerId(this.currentFormData.productNumber, this.currentFormData.projectId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.product = data.data[0];
          if(this.product){
            this.fillProductInfo(this.product,null);
          }
        } else if (data.code === 0 && !data.data) {
          this.$message.warning("该货主下未找到产品[" + this.currentFormData.productNumber + "]的相关信息，请确认后重试");
          return;
        }
      }).catch(error => {
        console.error('获取产品信息失败:', error);
        this.$message.error('获取产品信息失败');
      });
    },

    // 根据产品名称模糊搜索产品（防抖）
    debounceSearchProductByName(query) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchProductByName(query);
      }, 500);
    },

    // 根据产品名称搜索产品
    searchProductByName(query) {
      if (!query) return;

      if (!this.currentFormData.projectId) {
        this.$message.warning("请录入货主再进行查询");
        return;
      }

      this.productCnNameLoading = true;
      API.product.queryEntityByProductCnNameAndCustomerId(query, this.currentFormData.projectId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.productList = data.data;
        }
        this.productCnNameLoading = false;
      }).catch(error => {
        this.productCnNameLoading = false;
        console.error('搜索产品信息失败:', error);
        this.$message.error('搜索产品信息失败');
      });
    },
    // 填充产品信息
    fillProductInfo(product,productId) {
      let selectProduct =null;
      if (product){
        selectProduct = product;
      }else if(productId){
        selectProduct = this.productList.find(product => product.id === productId);
      }
      this.currentFormData.productNumber = selectProduct.productNumber;
      this.currentFormData.productName = selectProduct.productCnName;
      this.currentFormData.productId = selectProduct.id;

    },

    loadProjectOptions(){
      API.project.getActivatedProjectByClient(this.client.id).then(({data})=>{
        if(data.code == 0 && data.data){
          this.projectOptions= data.data;
        }
      }).catch((error)=>{

      });
    },
    loadWarehouseOptions(){
      let param = {
        externalClientId:this.client.id,
        projectId: this.currentFormData.projectId
      }
      API.warehouse.getActivatedWarehouseByParams(param).then(({data})=>{
        if(data.code == 0 && data.data){
          this.warehouseOptions = data.data;
        }
      }).catch((error)=>{

      });
    },

    // 货主选择变化处理
    projectChangeHandle(value) {
      if (value) {
        // 根据选择的货主ID查找对应的货主信息
        const selectedProject = this.projectOptions.find(project => project.id === value);
        if (selectedProject) {
          // 同时赋值给code和name字段
          this.currentFormData.projectCode = selectedProject.code;
          this.currentFormData.projectName = selectedProject.shortName;
          this.loadWarehouseOptions();
          //查询货主对应的供应商
          this.loadSupplierOptions();
        }
      } else {
        // 清空选择时，清空相关字段
        this.currentFormData.projectCode = '';
        this.currentFormData.projectName = '';
      }
    },

    // 仓库选择变化处理
    warehouseChangeHandle(value) {
      if (value) {
        // 根据选择的仓库编码查找对应的仓库信息
        const selectedWarehouse = this.warehouseOptions.find(warehouse => warehouse.code === value);
        if (selectedWarehouse) {
          // 同时赋值给name字段
          this.currentFormData.warehouseName = selectedWarehouse.name;
        }
      } else {
        // 清空选择时，清空相关字段
        this.currentFormData.warehouseName = '';
      }
    },

    // 供应商选择变化处理
    supplierChangeHandle(value) {
      if (value) {
        // 根据选择的供应商ID查找对应的供应商信息
        const selectedSupplier = this.supplierOptionsForSelect.find(supplier => supplier.id === value);
        console.log(selectedSupplier);
        if (selectedSupplier) {
          // 同时赋值给name字段
          this.currentFormData.supplierName = selectedSupplier.shortName;
          this.currentFormData.supplierCode = selectedSupplier.code;
        }
      } else {
        // 清空选择时，清空相关字段
        this.currentFormData.supplierName = '';
        this.currentFormData.supplierCode = '';
      }
    },

    // 验证价格格式
    validatePrice(rule, value, callback) {
      if (value === '' || value === null || value === undefined) {
        callback();
        return;
      }

      // 检查是否为数字格式（支持小数）
      const priceRegex = /^\d+(\.\d{1,4})?$/;
      if (!priceRegex.test(value)) {
        callback(new Error('请输入正确的数字格式，最多支持四位小数'));
      } else {
        callback();
      }
    },
    loadSupplierOptions(){
      API.supplier.getSupplierVoByCustomerId(this.currentFormData.projectId).then(({ data }) => {
        if (data && data.code === 0) {
          this.supplierOptions = data.data;
          this.supplierOptionsForSelect = this.supplierOptions;
        }

      })
    },
  },

}
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
