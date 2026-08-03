<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog_customWidth"
    top="10vh"
    :visible.sync="dialogVisible"
    width="80%"
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
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="currentFormData.supplierId"
              placeholder="请选择供应商"
              style="width: 100%"
            >
              <el-option
                v-for="item in suppliers"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="仓库" prop="warehouseCode">
            <el-select
              v-model="currentFormData.warehouseCode"
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
              v-model="currentFormData.projectId"
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
          <el-form-item label="费用类型" prop="costType">
            <el-select size="mini" style="width:100%" v-model="currentFormData.costType" placeholder="请选择费用类型">
              <el-option
                v-for="item in costTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据类型" prop="documentTypeCode">
            <el-select size="mini" style="width:100%" v-model="currentFormData.documentTypeCode" placeholder="请选择单据类型" @change="handleDocumentTypeChange">
              <el-option
                v-for="item in documentTypeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送货方式" prop="deliveryMethodCode">
            <el-select size="mini" style="width:100%" v-model="currentFormData.deliveryMethodCode" placeholder="请选择送货方式" @change="handleDeliveryMethodChange">
              <el-option
                v-for="item in deliveryMethodOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="费项编码" prop="costItemCode">
            <el-select size="mini" @change="costItemCodeHandle" style="width:100%" v-model="currentFormData.costItemCode" filterable placeholder="请选择费项编码">
              <el-option
                v-for="item in costItemOptions"
                :key="item.costItemCode"
                :label="item.costItemName"
                :value="item.costItemCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计算方式" prop="calculationMethodCode">
            <el-select size="mini" style="width:100%" v-model="currentFormData.calculationMethodCode" placeholder="请选择计算方式">
              <el-option
                v-for="item in calculationMethodOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
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
      'suppliers'
    ]),
  },
  props:{
    costTypeOptions:{
      type:Array,
      default:[]
    },
    documentTypeOptions:{
      type:Array,
      default:[]
    },
  },
  watch:{
    // 监听供应商ID变化，自动加载仓库
    'currentFormData.supplierId': {
      handler(newVal, oldVal) {
        if (newVal && oldVal != newVal) {
          if(this.suppliers.length > 0){
            let supplier = this.suppliers.find(supplier => supplier.supplierId == newVal)
            if(supplier){
              this.currentFormData.supplierCode = supplier.supplierCode;
              this.currentFormData.supplierName = supplier.supplierName;
            }

          }
          this.loadWarehouseOptions();
        }

      },
      immediate: false
    },

    // 监听仓库编码变化，自动加载货主
    'currentFormData.warehouseCode': {
      handler(newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }
        if (!newVal) {
          return;
        }
        if(this.warehouseOptions.length > 0){
          let warehouse = this.warehouseOptions.find(warehouse => warehouse.warehouseCode == newVal)
          if (warehouse) {
            this.currentFormData.warehouseName = warehouse.warehouseName;
          }
        }

        this.loadProjectOptions();

      },
      immediate: false
    },

    // 监听货主ID变化，自动加载批次属性
    'currentFormData.projectId': {
      handler(newVal,oldVal) {
        if(newVal == oldVal){
          return;
        }
        if(!newVal){
          return;
        }

        let project = this.projectOptions.find(project => project.projectId == newVal);
        if(project){
          this.currentFormData.projectCode = project.projectCode;
          this.currentFormData.projectName = project.projectName;
        }
      },
      immediate: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      currentFormData: {
        id: null,
        costType: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        clientId: '',
        clientCode: '',
        clientName: '',
        projectId: '',
        projectCode: '',
        projectName: '',
        documentTypeCode: '',
        documentTypeName: '',
        deliveryMethodCode: '',
        deliveryMethodName: '',
        costItemCode: '',
        calculationMethodCode: '',
        calculationMethodName: '',
        createdBy: '',
        createdTime: '',
        lastModifiedBy: '',
        lastModifiedTime: '',
        remarks: ''
      },
      submitButtonLoading: false,
      deliveryMethodOptions: [],
      calculationMethodOptions: [],
      supplierOptions: [],
      projectOptions: [],
      warehouseOptions:[],
      costItemOptions: [],
      // 表单验证规则
      rules: {
        costType: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        clientId: [
          { required: true, message: '客户信息不能为空', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],
        documentTypeCode: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        deliveryMethodCode: [
          { required: true, message: '请选择送货方式', trigger: 'change' }
        ],
        costItemCode: [
          { required: true, message: '请选择费项编码', trigger: 'change' }
        ],
        calculationMethodCode: [
          { required: true, message: '请选择计算方式', trigger: 'change' }
        ],
        remarks: [
          { max: 256, message: '备注长度不能超过 256 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增初始化方法（供父组件调用）
    addInit() {
      this.dialogTitle = '新增费用计算配置'
      this.isEdit = false
      this.currentFormData = {
        id: null,
        costType: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        clientId: this.client.id,
        clientCode: this.client.code,
        clientName: this.client.cnName,
        projectId: '',
        projectCode: '',
        projectName: '',
        documentTypeCode: '',
        documentTypeName: '',
        deliveryMethodCode: '',
        deliveryMethodName: '',
        costItemCode: '',
        calculationMethodCode: '',
        calculationMethodName: '',
        createdBy: '',
        createdTime: '',
        lastModifiedBy: '',
        lastModifiedTime: '',
        remarks: ''
      }
      this.dialogVisible = true
      this.loadAllCostItem();
      this.loadCalculationMethodOptions();
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 编辑初始化方法（供父组件调用）
    updateInit(rowData) {
      this.dialogTitle = '编辑费用计算配置'
      this.isEdit = true
      this.currentFormData = { ...rowData }
      this.dialogVisible = true
      this.loadCalculationMethodOptions();
      this.loadAllCostItem();
      this.loadDeliveryMethodOptions();
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogVisible = false
      this.resetForm()
    },
    costItemCodeHandle(value){
     const item = this.costItemOptions.find(item=> item.costItemCode == value)
      if(item){
        this.currentFormData.costItemName = item.costItemName;
      }
    },
    // 重置表单（供父组件调用）
    reset() {
      this.resetForm()
    },
    loadAllCostItem(){
      API.billItemConfig.getAllCostItemCodeList().then(({data})=>{
        if(data.code == 0 && data.data){
          this.costItemOptions = data.data;
        }
      }).catch(error=>{

      })
    },

    // 获取送货方式列表
    loadDeliveryMethodOptions() {
      this.deliveryMethodOptions=[] ;
      API.orderConstant.getDeliveryMethodList().then(({data})=>{
        if(data.data == data.code == 0){
          for (let i = 0; i < data.data.length; i++) {
            const item =data.data[i];

            if(item.documentTypeCodeList.indexOf(this.currentFormData.documentTypeCode) != -1){
              this.deliveryMethodOptions.push(item);
            }

            if(data.data.length == 1){
              this.currentFormData.deliveryMethodName=data.data[0].name;
              this.currentFormData.deliveryMethodCode=data.data[0].value;
            }
          }
        }
      }).catch();
    },
    //查询仓库信息
    loadWarehouseOptions(){
      if (!this.currentFormData.supplierId) {
        return;
      }
      // 调用API获取仓库列表
      API.productPriceConfig.getWarehouseBySupplierId(this.client.id, this.currentFormData.supplierId).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.warehouseOptions = data.data;
          //如果只有一个仓库，直接选中，同时查询货主信息
          if(this.warehouseOptions.length ==1){
            this.currentFormData.warehouseCode = this.warehouseOptions[0].warehouseCode;
            this.currentFormData.warehouseName = this.warehouseOptions[0].warehouseName;
          }
        }
      }).catch(error => {
      });
    },

    //查询计算方法
    loadCalculationMethodOptions(){
      // 调用API获取仓库列表
      API.orderConstant.getCalculationMethodList().then(({data}) => {
        if (data.code === 0 && data.data) {
          this.calculationMethodOptions = data.data;
        }
      }).catch(error => {
      });
    },

    //查询货主信息
    loadProjectOptions(){
      if (!this.currentFormData.supplierId || !this.currentFormData.warehouseCode) {
        return;
      }
      // 调用API获取货主列表
      API.productPriceConfig.getProjectBySupplierAndWarehouseCode(
        this.client.id,
        this.currentFormData.supplierId,
        this.currentFormData.warehouseCode
      ).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.projectOptions = data.data;
          //如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
          if(this.projectOptions.length ==1){
            this.currentFormData.projectId = this.projectOptions[0].projectId;
            this.currentFormData.projectCode = this.projectOptions[0].projectCode;
            this.currentFormData.projectName = this.projectOptions[0].projectName;
          }
        }
      }).catch(error => {
      });
    },

    // 单据类型选择变化处理
    handleDocumentTypeChange(value) {
      if (value) {
        const selectedOption = this.documentTypeOptions.find(option => option.value == value);
        if (selectedOption) {
          this.currentFormData.documentTypeName = selectedOption.name;
        }
        this.currentFormData.deliveryMethodCode='';
        this.currentFormData.deliveryMethodName=''
        this.loadDeliveryMethodOptions();
      } else {
        this.currentFormData.documentTypeName = '';
      }
    },

    // 送货方式选择变化处理
    handleDeliveryMethodChange(value) {
      if (value != null && value != undefined) {
        const selectedOption = this.deliveryMethodOptions.find(option => option.value === value);
        if (selectedOption) {
          this.currentFormData.deliveryMethodName = selectedOption.name;
        }
      } else {
        this.currentFormData.deliveryMethodName = '';
      }
    },


    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitButtonLoading = true;
          const calculationMethodOption= this.calculationMethodOptions.find(item=>{return item.value == this.currentFormData.calculationMethodCode})
          this.currentFormData.calculationMethodName = calculationMethodOption.name;

          if (this.isEdit) {
            // 编辑操作
            API.billCalculationConfig.update(this.currentFormData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.$emit("submit")
                this.dialogVisible = false
              } else {
                this.$message.error(data.message || '更新失败')
              }
              this.submitButtonLoading = false
            }).catch(error => {
              this.submitButtonLoading = false
              this.$message.error('更新失败：' + error.message)
            })
          } else {
            // 新增操作
            API.billCalculationConfig.save(this.currentFormData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success('保存成功')
                this.$emit("submit")
                this.dialogVisible = false
              } else {
                this.$message.error(data.message || '保存失败')
              }
              this.submitButtonLoading = false
            }).catch(error => {
              this.submitButtonLoading = false
              this.$message.error('保存失败：' + error.message)
            })
          }
        }
      })
    },

    // 重置表单
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    }
  }
}
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
