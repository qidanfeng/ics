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
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              filterable
              :filter-method="supplierFilterHandle"
              @visible-change="supplierOptionsForSelect = supplierOptions"
              v-model="currentFormData.supplierId"
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
          <el-form-item label="仓库" prop="warehouseCode">
            <el-select
              v-model="currentFormData.warehouseCode"
              placeholder="请选择仓库"
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

<!--    <el-row :gutter="20">-->
<!--      <el-col :span="8">-->
<!--        <el-form-item label="货主" prop="projectId">-->
<!--          <el-select @change="projectChangeHandle" size="mini" style="width:100%" v-model="currentFormData.projectId" filterable placeholder="请选择货主" clearable>-->
<!--            <el-option-->
<!--              v-for="item in projectOptions"-->
<!--              :key="item.id"-->
<!--              :label="item.shortName"-->
<!--              :value="item.id">-->
<!--              <span style="float: left">{{ item.code }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
<!--      <el-col :span="8">-->
<!--        <el-form-item label="仓库" prop="warehouseCode">-->
<!--          <el-select-->
<!--            v-model="currentFormData.warehouseCode"-->
<!--            @change="warehouseChangeHandle"-->
<!--            placeholder="请选择仓库"-->
<!--            style="width: 100%"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in warehouseOptions"-->
<!--              :key="item.code"-->
<!--              :label="item.name"-->
<!--              :value="item.code">-->
<!--              <span style="float: left">{{ item.code }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
<!--      <el-col :span="8">-->
<!--        <el-form-item label="供应商" prop="supplierId">-->
<!--          <el-select-->
<!--            filterable-->
<!--            :filter-method="supplierFilterHandle"-->
<!--            @visible-change="supplierOptionsForSelect = supplierOptions"-->
<!--            v-model="currentFormData.supplierId"-->
<!--            @change="supplierChangeHandle"-->
<!--            placeholder="请选择供应商"-->
<!--            style="width: 100%"-->
<!--          >-->
<!--            <el-option-->
<!--              style="width:400px"-->
<!--              v-for="item in supplierOptionsForSelect"-->
<!--              :key="item.id"-->
<!--              :label="item.shortName"-->
<!--              :value="item.id">-->
<!--              <span style="float: left">{{ item.code }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-col>-->


<!--    </el-row>-->


    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="订货周期(天)" prop="orderCycleTime">
          <el-input-number
            v-model="currentFormData.orderCycleTime"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="'最小起订量(收货单位)'" prop="minOrderQuantity">
          <el-input-number
            v-model="currentFormData.minOrderQuantity"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />
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
        orderCycleTime: 0,
        minOrderQuantity: 0,
        remarks: ''
      },
      submitButtonLoading:false,
      supplierOptions:[],
      supplierOptionsForSelect:[],
      projectOptions:[],
      warehouseOptions:[],
      // 表单验证规则
      rules: {
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
        minOrderQuantity: [
          { required: true, message: '请输入最小起订量(收货单位)', trigger: 'blur' }
        ],
        orderCycleTime: [
          { required: true, message: '请输入订货周期(天)', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    // 监听供应商ID变化，自动加载仓库
    'currentFormData.supplierId': {
      handler(newVal, oldVal) {
        if (newVal && oldVal != newVal) {
          if(this.supplierOptions.length > 0){
            let supplier = this.supplierOptions.find(supplier => supplier.supplierId == newVal)
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
        if (!this.shouldTriggerWarehouseWatch) {
          return
        }
        if (newVal == oldVal) {
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
  },
  methods: {
    // 新增初始化方法（供父组件调用）
    async addInit() {
      this.dialogTitle = '新增订购量配置'
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
        orderCycleTime: 0,
        minOrderQuantity: 0,
        createdBy: '',
        createdTime: '',
        lastModifiedBy: '',
        lastModifiedTime: '',
        delFlag: 1,
        remarks: ''
      }
      this.dialogVisible = true
      // 启用watch监听器
      this.shouldTriggerWarehouseWatch = true;
      this.shouldTriggerProjectWatch = true;
      await this.loadSupplierOptions();
      await this.$nextTick();
    },

    // 编辑初始化方法（供父组件调用）
    async updateInit(rowData) {
      this.dialogTitle = '编辑订购量配置'
      this.currentFormData = { ...rowData }
      this.dialogVisible = true  ;
      // 启用watch监听器
      this.shouldTriggerWarehouseWatch = true;
      this.shouldTriggerProjectWatch = true;
      await this.loadSupplierOptions();
      await this.$nextTick();

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

            API.orderQuantityConfig.update(this.currentFormData).then(({ data }) => {
              if(data.code == 0){
                this.$emit("submit");
                this.dialogVisible=false;
              }
              this.submitButtonLoading=false;

            }).catch(error => {
              this.submitButtonLoading=false;
            })
          }else{
            API.orderQuantityConfig.save(this.currentFormData).then(({ data }) => {
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
              this.currentFormData.supplierId = this.supplierOptions[0].supplierId;
              this.currentFormData.supplierCode = this.supplierOptions[0].supplierCode;
              this.currentFormData.supplierName = this.supplierOptions[0].supplierName;
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
      if (!this.currentFormData.supplierId) {
        this.currentFormData.warehouseCode = null;
        this.currentFormData.warehouseName = null;
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
          }else {
            let notMatch = true;
            if(this.warehouseOptions.length > 0){
              let warehouse = this.warehouseOptions.find(warehouse => warehouse.warehouseCode === this.currentFormData.warehouseCode)
              if (warehouse) {
                notMatch = false;
              }
            }
            if(notMatch){
              this.currentFormData.warehouseCode = null;
              this.currentFormData.warehouseName = null;
            }
          }
        }
      }).catch(error => {
      });
    },
    //查询货主信息
    loadProjectOptions(){
      if (!this.currentFormData.supplierId || !this.currentFormData.warehouseCode) {
        this.currentFormData.projectId = null;
        this.currentFormData.projectCode = null;
        this.currentFormData.projectName = null;
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
          }else {
            let notMatch = true;
            if(this.projectOptions.length > 0){
              let project = this.projectOptions.find(item => item.projectId === this.currentFormData.projectId)
              if (project) {
                notMatch = false;
              }
            }
            if(notMatch){
              this.currentFormData.projectId = null;
              this.currentFormData.projectCode = null;
              this.currentFormData.projectName = null;
            }
          }
        }
      }).catch(error => {
      });
    },
  },

}
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
