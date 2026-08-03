<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div style="display: flex; flex-direction: row;">
      <div style="width: 40%">
        <AlgorithmDescription/>

      </div>
      <div style="width: 60%">
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          size="mini"
          style="width: 100%;"
          label-width="120px">
            <!-- 基本信息 -->
            <el-divider content-position="left">基本信息</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="策略名称" prop="strategyName">
                  <el-input
                    v-model="formData.strategyName"
                    placeholder="请输入策略名称"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="仓库" prop="warehouseCode">
                  <el-select
                    v-model="formData.warehouseCode"
                    placeholder="请选择仓库"
                    style="width: 100%"
                    @change="handleWarehouseChange"
                  >
                    <el-option
                      v-for="item in warehouseOptions"
                      :key="item.warehouseCode"
                      :label="item.warehouseName"
                      :value="item.warehouseCode"
                    >
                      <span style="float: left">{{ item.warehouseCode }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货主" prop="projectId">
                  <el-select
                    v-model="formData.projectId"
                    placeholder="请选择货主"
                    style="width: 100%"
                    filterable
                    @change="handleProjectChange"
                  >
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.projectId"
                      :label="item.projectName"
                      :value="item.projectId"
                    >
                      <span style="float: left">{{ item.projectCode }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 预测算法配置 -->
            <el-divider content-position="left">预测算法配置</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="预测算法" prop="algorithmTypeCode">
                  <el-select
                    disabled
                    v-model="formData.algorithmTypeCode"
                    placeholder="请选择预测算法"
                    style="width: 100%"
                    @change="handleAlgorithmTypeChange"
                  >
                    <el-option
                      v-for="item in algorithmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截至售卖日" prop="saleEndDate">
                  <el-date-picker
                    v-model="formData.saleEndDate"
                    type="date"
                    placeholder="请选择截至售卖日"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :picker-options="saleEndDatePickerOptions"
                  />
                </el-form-item>
              </el-col>


              <!-- SMA参数 -->
              <el-col :span="12">
                <el-form-item label="历史数据周期数" prop="hisDataPeriods">
                  <el-input-number
                    v-model="formData.hisDataPeriods"
                    :min="1"
                    :max="12"
                    :step="1"
                    placeholder="请输入历史数据周期数"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <!-- 数据周期 -->
              <el-col :span="12">
                <el-form-item label="数据周期" prop="dataPeriod">
                  <el-select
                    v-model="formData.dataPeriod"
                    placeholder="请选择数据周期"
                    style="width: 100%"
                  >
                    <el-option
                        v-for="item in dataPeriodOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.days }}天</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品编码" prop="productNumber">
                  <el-input
                    v-model="formData.productNumber"
                    placeholder="输入产品编码按Tab搜索"
                    @keydown.tab.native="searchProductByCode(formData, 0)"
                  />
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="产品名称" prop="productName">
                  <el-select
                    v-model="formData.productName"
                    filterable
                    size="mini"
                    style="width:100%"
                    remote
                    value-key="productId"
                    reserve-keyword
                    placeholder="输入产品名称模糊搜索"
                    :remote-method="(query) => debounceSearchProductByName(formData, 1, query)"
                    :loading="productCnNameLoading"
                    @change="(value) => fillProductInfo(formData, value,0)">
                    <el-option
                      v-for="item in productList"
                      :key="item.productId"
                      :label="item.productName"
                      :value="item">
                      <span style="float: left">{{ item.productNumber}}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remarks"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注信息"
                  />
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleClose" size="mini">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitLoading" size="mini">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import API from "@/api";
import AlgorithmDescription from '@/views/forecast/strategy/components/AlgorithmDescription.vue'

export default {
  name: "UpdateOrAdd",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    AlgorithmDescription
  },
  computed: {
    ...mapGetters([
      'warehouses',
      'projects',
      'client'
    ]),
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    algorithmOptions() {
      return [{
        value:1,
        label:"简单移动平均(SMA)",
      }]
    },
  },
  data() {
    return {
      submitLoading: false,
      productCnNameLoading: false,
      productList: [],
      dataPeriodOptions: [],
      warehouseOptions: [],
      projectOptions: [],
      productOptions: [],
      rules: {
        strategyName: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        warehouseCode: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],
        algorithmTypeCode: [
          { required: true, message: '请选择预测算法', trigger: 'change' }
        ],
        dataPeriod: [
          { required: true, message: '请选择数据周期', trigger: 'change' }
        ],
        saleEndDate: [
          { required: true, message: '请选择截至售卖日', trigger: 'change' }
        ],
        hisDataPeriods: [
          { required: true, message: '请输入历史数据周期数', trigger: 'blur' }
        ],
      },
      saleEndDatePickerOptions: {
        disabledDate: (time) => {
          const today = new Date();

          // 清除时间部分
          today.setHours(0, 0, 0, 0);

          // 禁用今天之前的所有日期
          return time.getTime() < today.getTime();
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initForm()
      }
    },
  },
  methods: {
    initForm() {
      this.warehouseOptions = this.warehouses;
      this.projectOptions = this.projects;
      this.loadDataPeriodOptions();
    },


    handleWarehouseChange(value) {
      const warehouse = this.warehouseOptions.find(item => item.warehouseCode === value)
      if (warehouse) {
        this.formData.warehouseName = warehouse.warehouseName
      }
    },

    handleProjectChange(value) {
      const project = this.projectOptions.find(item => item.projectId === value)
      if (project) {
        this.formData.projectCode = project.projectCode
        this.formData.projectName = project.projectName
      }
    },

    handleAlgorithmTypeChange(value) {
      const algorithm = this.algorithmOptions.find(item => item.value === value)
      if (algorithm) {
        this.formData.algorithmTypeName = algorithm.label
      }
    },

    handleClose() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if(this.formData.id){
            API.averageForecastStrategy.update(this.formData).then(({ data }) => {
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
            API.averageForecastStrategy.save(this.formData).then(({ data }) => {
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

    // 根据产品编码搜索产品
    searchProductByCode(row, index) {
      if (!row.productNumber) return;
      let param = {
        productNumber:row.productNumber,
        ignoreSupplierLimitFlag:1,
        projectId:this.formData.projectId,
        warehouseCode:this.formData.warehouseCode,
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
        ignoreSupplierLimitFlag:1,
        projectId:this.formData.projectId,
        warehouseCode:this.formData.warehouseCode,
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

    // 填充产品信息
    fillProductInfo(row, product,index) {
      row.productId = product.productId;
      row.productNumber = product.productNumber;
      row.productName = product.productName;
    },
    // 加载数据周期选项
    loadDataPeriodOptions() {
      API.orderConstant.getDataPeriodList().then(({ data }) => {
        if (data && data.code === 0 && data.data) {
          this.dataPeriodOptions = data.data;
        }
      }).catch(error => {
        console.error('加载数据周期选项失败:', error);
        this.$message.error('加载数据周期选项失败');
      });
    },
  }
}
</script>

<style scoped>

/* 参数提示图标样式 */
.param-tip {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.param-tip .el-icon-info {
  color: #909399;
  font-size: 14px;
  cursor: pointer;
}

.param-tip .el-icon-info:hover {
  color: #409eff;
}

/* 算法说明组件样式 */
.algorithm-description {

  font-size: 12px;
  line-height: 1.4;
  max-height: 80vh;
  overflow-y: auto;
}

.algorithm-info h4 {
  color: #333;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
}

.scenario-section {
  margin: 5px 0;
}

.scenario-section h5 {
  color: #0066cc;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 600;
}

.scenario-section p {
  margin: 2px 0;
  font-size: 11px;
  color: #666;
}

.features-section {
  margin: 5px 0;
}

.features-section h5 {
  color: #2e7d32;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 600;
}

.features-section ul {
  list-style-type: disc;
  padding-left: 12px;
  margin: 0;
}

.features-section li {
  padding: 1px 0;
  font-size: 11px;
}

.example-section {
  margin: 5px 0;
}

.example-section h5 {
  color: #d32f2f;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 600;
}

.example-section p {
  margin: 2px 0;
  font-size: 11px;
  color: #666;
}

.weights-config {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  background-color: #f5f7fa;
}

.weight-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.weight-label {
  width: 100px;
  font-size: 14px;
  color: #606266;
}

.weight-summary {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-remarks {
  margin-top: 20px;
}


.forecast-method-selection h4 {
  margin-bottom: 10px;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.method-radio {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.method-radio:hover {
  background-color: #f5f7fa;
}

.method-radio.is-checked {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.method-info {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.method-name {
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.method-desc {
  color: #606266;
  font-size: 12px;
  margin-top: 2px;
}

/* 预测结果显示样式 */
.forecast-values {
  font-weight: 600;
  color: #409eff;
  font-family: 'Courier New', monospace;
}

.method-comparison {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #67c23a;
}

.method-comparison p {
  margin-bottom: 5px;
  font-weight: 600;
  color: #303133;
}

.method-comparison ul {
  margin: 0;
  padding-left: 20px;
}

.method-comparison li {
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}
</style>
