<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    custom-class="dialog_customWidth"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="transfer-order-form">
    <!-- 基本信息表单 -->
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      size="mini"
      label-width="120px"
      style="padding-right: 20px"
    >
      <div>
        <div class="section-title">基本信息</div>
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
            <el-form-item label="退货仓库" prop="returnWarehouseCode">
              <el-select
                v-model="formData.returnWarehouseCode"
                placeholder="请选择退货仓库"
                style="width: 100%"
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
                  :value="item.projectId"
                >
                  <span style="float: left">{{ item.projectCode }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="退货方式" prop="deliveryMethodCode">
              <el-select
                v-model="formData.deliveryMethodCode"
                placeholder="请选择退货方式"
                style="width: 100%"
                @change="handleDeliveryMethodChange"
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


        </el-row>
        <!-- 备注 -->
        <div class="form-remarks">
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="formData.remarks"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 库存选择 -->
      <div>
        <div class="section-title">
          <span>退货明细</span>
          <el-button
            size="mini"
            type="primary"
            @click="openInventoryDialog"
          >
            <i class="el-icon-plus"></i>
            选择库存
          </el-button>
        </div>

        <div class="selected-inventory">
          <p v-if="!formData.detailList || formData.detailList.length === 0" class="empty-text">
            暂无选择库存明细，请点击"选择库存"按钮添加退货明细
          </p>

          <el-table
            v-else
            ref="tableRef"
            :data="formData.detailList"
            border
            height="400px"
            :row-style="{height: '0'}"
            :cell-style="{padding: '0'}"
            size="mini"
            style="width: 100%"
            @expand-change="queryLotAttributeValueByOrderDetailId"
          >
            <el-table-column type="expand" label="批属性" width="100">
              <template slot-scope="{row}">
                <div class="batch-attributes-panel">
                  <div class="attribute-grid">
                    <div class="attribute-item" v-for="lotAttribute in row.lotAttributeVos">
                      <span class="attribute-label">{{lotAttribute.lotAttrLabel}}：</span>
                      <span class="attribute-value">{{lotAttribute.lotAttrValue  }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center" fixed="left"></el-table-column>
            <el-table-column prop="productNumber" label="产品编码" min-width="150" align="center" fixed="left"/>
            <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip fixed="left"/>
            <el-table-column prop="quantity" label="退货数量" width="200" align="center" >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :min="1"
                  :max="scope.row.quantityMaxLimit"
                  size="mini"
                  @change="handleReturnQtyChange(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="unitDictionaryName" label="单位" min-width="50"/>
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  style="color: #F56C6C"
                  @click="removeDetail(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>

    <!-- 操作按钮 -->
    <div class="form-actions">
        <div style="text-align: center; width: 100%;">
          <el-button  size="mini" style="width:10%" type="primary" @click="submitForm" :loading="submitting">保存</el-button>
        </div>
    </div>

    <!-- 库存选择对话框 -->
    <select-inventory
      ref="selectInventoryRef"
      v-if="inventoryDialogVisible"
      :detailList="formData.detailList"
      :return-warehouse="{
        code: formData.returnWarehouseCode,
        name: formData.returnWarehouseName
      }"
      :project="{
        id: formData.projectId,
        name: formData.projectName,
        code: formData.projectCode
      }"
      @confirm="handleInventoryConfirm"
      @cancel="handleInventoryCancel"
      @close="handleInventoryDialogClose"
    />
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectInventory from './components/updateOrAdd/selectInventory.vue'
import API from "@/api";

export default {
  name: 'ReturnSupplierUpdateOrAdd',

  components: {
    SelectInventory
  },

  props: {
    // 对话框是否可见
    visible: {
      type: Boolean,
      default: false
    },
    deliveryMethodOptions:{
      type:Array,
      default:[]
    },
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      inventoryDialogVisible: false,
      title: '',

      // 用于控制watch监听器的触发时机
      shouldTriggerWarehouseWatch: false,
      shouldTriggerProjectWatch: false,
      formData:{},
      projectOptions:[],
      supplierOptions:[],
      supplierOptionsForSelect:[],
      warehouseOptions:[],
      // 表单验证规则
      rules: {
        returnWarehouseCode: [
          { required: true, message: '请选择退货仓库', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],

        deliveryMethodCode: [
          { required: true, message: '请选择退货方式', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],


      },
    }
  },
  computed: {
    ...mapGetters([
      'client',
    ])
  },
  watch: {
    // 监听内部dialogVisible变化，通知父组件
    dialogVisible: {
      handler(newVal) {
        if (!newVal) {
          this.$emit('update:visible', false);
          this.$emit('close');
        }
      },
      immediate: false
    },

    // 监听退货仓库编码变化
    'formData.returnWarehouseCode': {
      handler(newVal,oldVal) {
        console.log(23424)
        if(newVal == oldVal){
          return;
        }
        if(!newVal){
          return;
        }

        let warehouse = this.warehouseOptions.find(warehouse=>warehouse.warehouseCode == newVal)
        if(warehouse){
          this.formData.returnWarehouseName = warehouse.warehouseName;
        }
        this.loadProjectOptions();
      },
      immediate: false
    },
    // 监听货主ID变化
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
        // 查询客户批次属性
        this.queryLotAttributeByCustomerId();
      },
      immediate: false
    },
    'formData.supplierId': {
      handler(newVal,oldVal) {
        if(newVal == oldVal){
          return;
        }
        if(!newVal){
          return;
        }
        let supplier = this.supplierOptions.find(supplier => supplier.supplierId == newVal);
        if(supplier){
          this.formData.supplierCode = supplier.supplierCode;
          this.formData.supplierName = supplier.supplierName;
        }

        this.loadWarehouseOptions();
      },
      immediate: false
    }
  },
  methods: {
    // 初始化方法
    addInit(title) {
      this.dialogVisible = true;
      this.title = title;

     this.formData.clientId = this.client.id;
     this.formData.clientCode = this.client.code;
     this.formData.clientName = this.client.cnName;
      this.shouldTriggerWarehouseWatch = true;
      this.shouldTriggerProjectWatch = true;
      this.loadSupplierOptions();

      if(this.deliveryMethodOptions.length == 1){
          this.formData.deliveryMethodCode = this.deliveryMethodOptions[0].value;
          this.formData.deliveryMethodName = this.deliveryMethodOptions[0].name;
      }

    },
    async updateInit(title,row){
      this.dialogVisible = true;
      this.title = title;
      this.formData= {...row};
      await this.loadSupplierOptions();
      await this.loadProjectOptions();
      this.queryLotAttributeByCustomerId();
      this.loadOrderDetailData();
    },
    loadOrderDetailData(){
      API.returnSupplier.getDetailListByOrderNumber(this.formData.orderNumber).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.formData.detailList = data.data;
        }
      }).catch(err => {
        console.error('获取退货订单详情失败:', err)
      })
    },
    // 获取供应商列表
    loadSupplierOptions() {
      // 实际应用中应该调用API获取数据
      if (!this.client.id) {
        return;
      }
      return new Promise((resolve, reject) => {
        this.supplierOptions=[];
        API.productPriceConfig.getSupplierByClientId(this.client.id).then(({data}) => {
          if (data.data && data.data.length> 0) {

            this.supplierOptions = data.data;
            this.supplierOptionsForSelect = this.supplierOptions;
            //如果只有一个供应商，直接选中，选中的同时 查询仓库
            if (this.supplierOptions.length == 1) {
              this.formData.supplierId = this.supplierOptions[0].supplierId;
              this.formData.supplierCode = this.supplierOptions[0].supplierCode;
              this.formData.supplierName = this.supplierOptions[0].supplierName;
            }
          }else{
            this.formData.supplierId =null;
            this.formData.supplierCode = '';
            this.formData.supplierName ='' ;
          }
          resolve();
        }).catch(({error}) => {
          resolve(error);
        })
      })
    },
    //查询仓库信息
    loadWarehouseOptions(){
      if (!this.formData.supplierId) {
        return;
      }
      this.warehouseOptions=[];
      return new Promise((resolve, reject) => {
        API.productPriceConfig.getWarehouseBySupplierId(this.client.id, this.formData.supplierId).then(({data}) => {
          if (data.data && data.data.length> 0) {
            this.warehouseOptions = data.data;
            //如果只有一个仓库，直接选中，同时查询货主信息
            if(this.warehouseOptions.length ==1){
              this.$set(this.formData,'returnWarehouseCode',this.warehouseOptions[0].warehouseCode);
              this.formData.returnWarehouseName = this.warehouseOptions[0].warehouseName;
            }
          }else{
            this.formData.returnWarehouseCode = '';
            this.formData.returnWarehouseName = '';
          }
          resolve();
        }).catch(error => {
          resolve(error);
        });
      })
      // 调用API获取仓库列表

    },
    //加载仓库下面的货主
    loadProjectOptions(){
      if (!this.formData.supplierId || !this.formData.returnWarehouseCode) {
        return;
      }
      this.projectOptions=[]
      return new Promise((resolve, reject) => {
        // 调用API获取货主列表
        API.productPriceConfig.getProjectBySupplierAndWarehouseCode(
          this.client.id,
          this.formData.supplierId,
          this.formData.returnWarehouseCode
        ).then(({data}) => {
          if (data.data && data.data.length> 0) {
            this.projectOptions = data.data;
            //如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
            if(this.projectOptions.length ==1){
              this.$set(this.formData,'projectId',this.projectOptions[0].projectId);
              this.formData.projectCode = this.projectOptions[0].projectCode;
              this.formData.projectName = this.projectOptions[0].projectName;
            }
          }else{
            this.formData.projectId = null
            this.formData.projectCode = ''
            this.formData.projectName = ''
          }
          resolve();
        }).catch(error => {
          resolve(error)
        });
      })

    },
    // 对话框关闭处理
    handleClose() {
      this.$refs.form.resetFields()
      this.formData={};
      this.formData.detailList = []
      this.dialogVisible = false;
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 验证是否有退货明细
          if (!this.formData.detailList || this.formData.detailList.length === 0) {
            this.$message.warning('请至少添加一条退货明细')
            return
          }
          console.log(this.formData.detailList)
          // 封装批属性到lotAttributeEntity属性下
          const formDataWithLotAttributes = {
            ...this.formData,
            detailList: this.formData.detailList.map(detail => ({
              id:detail.id || null,
              productId:detail.productId,
              productNumber:detail.productNumber,
              productName:detail.productName,
              quantity:detail.quantity,
              unitDictionaryName:detail.unitDictionaryName,
              unitDictionaryId:detail.unitDictionaryId,
              lotAttributeEntity: {
                id:(detail.lotAttributeVos&&detail.lotAttributeVos.length > 0) ? detail.lotAttributeVos[0].id:null,
                lotAttr01Value: detail.lotAttr01Value || '',
                lotAttr02Value: detail.lotAttr02Value || '',
                lotAttr03Value: detail.lotAttr03Value || '',
                lotAttr04Value: detail.lotAttr04Value || '',
                lotAttr05Value: detail.lotAttr05Value || '',
                lotAttr06Value: detail.lotAttr06Value || '',
                lotAttr07Value: detail.lotAttr07Value || '',
                lotAttr08Value: detail.lotAttr08Value || '',
                lotAttr09Value: detail.lotAttr09Value || '',
                lotAttr10Value: detail.lotAttr10Value || '',
                lotAttr11Value: detail.lotAttr11Value || '',
                lotAttr12Value: detail.lotAttr12Value || '',
                lotAttr13Value: detail.lotAttr13Value || '',
                lotAttr14Value: detail.lotAttr14Value || '',
                lotAttr15Value: detail.lotAttr15Value || ''
              }
            }))
          }

          this.submitting = true
          if(!this.formData.id){
            API.returnSupplier.save(formDataWithLotAttributes).then(({data})=>{
              if(data.code == 0){

                this.$message.success('保存成功')
                // 触发success事件，通知父组件操作成功
                this.$emit('success', '')
                this.dialogVisible =false
              }
              this.submitting = false
            }).catch((error=>{
              this.submitting = false
            }))
          }else{

            API.returnSupplier.update(formDataWithLotAttributes).then(({data})=>{
              if(data.code == 0){

                this.$message.success('更新成功')
                // 触发success事件，通知父组件操作成功
                this.$emit('success', '')
                this.dialogVisible =false
              }
              this.submitting = false
            }).catch((error=>{
              this.submitting = false
            }))
          }

        }
      })
    },

    //根据订单明细ID查询批属性值
    queryLotAttributeValueByOrderDetailId(row, expandedRows) {
      if(!row.id){
        return
      }
      if(row.lotAttributeVos && row.lotAttributeVos.length > 0){
        return;
      }
      API.returnSupplier.queryLotAttributeValueByOrderDetailId(row.id).then(({data}) => {
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


        }
      }).catch(error => {
        console.error('查询客户批次属性失败:', error);
      });
    },
    handleDeliveryMethodChange(value) {
      const method = this.deliveryMethodOptions.find(item => item.value === value)
      this.formData.deliveryMethodName = method ? method.label : ''
    },
    // 退货数量变化处理
    handleReturnQtyChange(index) {
      const detail = this.formData.detailList[index]
      if (detail.quantity > detail.quantityMaxLimit) {
        this.$message.warning(`退货数量不能超过可用库存（${detail.quantityMaxLimit}）`)
        detail.quantity = detail.quantityMaxLimit
      }
    },

    // 删除退货明细
    removeDetail(index) {
      const detail = this.formData.detailList[index]

      // 如果有订单明细ID，说明是已保存的明细，需要调用API删除
      if (detail.id) {
        this.$confirm('此操作将永久删除该退货明细，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用API删除退货明细
          API.returnSupplier.deleteOrderDetails([detail.id]).then(({data}) => {
            if (data.code === 0) {
              this.$message.success('删除成功')
              this.formData.detailList.splice(index, 1)
            } else {
              this.$message.error(data.msg || '删除失败')
            }
          }).catch(error => {
            console.error('删除订单明细失败:', error)
            this.$message.error('删除失败')
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      } else {
        // 如果是未保存的明细，直接删除
        this.formData.detailList.splice(index, 1)
        this.$message.success('删除成功')
      }
    },

    // 库存选择相关方法
    openInventoryDialog() {
      this.inventoryDialogVisible = true
      this.$nextTick(() => {
        this.$refs.selectInventoryRef.init(this.inventoryDialogVisible)
      })
    },

    // 库存选择确认处理
    handleInventoryConfirm(updatedDetails) {
      // 使用动态的批次属性配置 this.lotAttributeVos
      this.formData.detailList = updatedDetails.map(detail => {
        const newDetail = { ...detail }

        // 如果存在批次属性配置，则应用到明细项
        if (this.lotAttributeVos && this.lotAttributeVos.length > 0) {
          this.lotAttributeVos.forEach(config => {
            config.lotAttrValue = detail[config.lotAttrNumber] || ''
          })
        }
        newDetail.lotAttributeVos = {...this.lotAttributeVos}
        return newDetail
      })

      this.inventoryDialogVisible = false
    },


    // 库存选择取消处理
    handleInventoryCancel() {
      this.inventoryDialogVisible = false
    },

    // 库存选择对话框关闭处理
    handleInventoryDialogClose() {
      // 清空选择状态
      this.inventoryDialogVisible = false
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
  }
}
</script>

<style scoped>
.transfer-order-form {
  min-height: 100%;
}

.form-remarks {
  margin-top: 15px;
}

.empty-text {
  text-align: center;
  color: #909399;
  padding: 40px 0;
  font-style: italic;
}

.selected-inventory {
  min-height: 100px;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}

.form-actions .el-button {
  margin: 0 10px;
}

.inventory-selection {
  padding: 10px 0;
}

.dialog-footer {
  text-align: right;
}

.basic-info-card,
.inventory-select-card,
.remarks-card {
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.batch-attributes-panel {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;

  .attribute-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;

    .attribute-item {
      display: flex;
      align-items: center;
      padding: 6px 8px;
      background: white;
      border-radius: 3px;
      border: 1px solid #e8e8e8;

      .attribute-label {
        font-weight: 600;
        color: #606266;
        min-width: 80px;
        margin-right: 8px;
      }

      .attribute-value {
        color: #303133;
        flex: 1;
      }
    }
  }
}

@media (max-width: 1200px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: 1fr;
  }
}
</style>
