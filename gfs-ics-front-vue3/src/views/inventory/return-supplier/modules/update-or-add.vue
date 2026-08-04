<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="90%"
    top="5vh"
    custom-class="dialog_customWidth"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="transfer-order-form">
      <!-- 基本信息表单 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="small"
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
                    :value="item.supplierId"
                  >
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
            <el-button size="small" type="primary" @click="openInventoryDialog">
              <el-icon><Plus /></el-icon>
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
              size="small"
              style="width: 100%"
              @expand-change="queryLotAttributeValueByOrderDetailId"
            >
              <el-table-column type="expand" label="批属性" width="100">
                <template #default="{ row }">
                  <div class="batch-attributes-panel">
                    <div class="attribute-grid">
                      <div class="attribute-item" v-for="(lotAttribute, index) in row.lotAttributeVos" :key="index">
                        <span class="attribute-label">{{ lotAttribute.lotAttrLabel }}：</span>
                        <span class="attribute-value">{{ lotAttribute.lotAttrValue }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column type="index" width="55" label="序号" align="center" fixed="left" />
              <el-table-column prop="productNumber" label="产品编码" min-width="150" align="center" fixed="left" />
              <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip fixed="left" />
              <el-table-column prop="quantity" label="退货数量" width="200" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    :min="1"
                    :max="scope.row.quantityMaxLimit"
                    size="small"
                    @change="handleReturnQtyChange(scope.$index)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="unitDictionaryName" label="单位" min-width="50" />
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template #default="scope">
                  <el-button type="text" size="small" style="color: #f56c6c" @click="removeDetail(scope.$index)">
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
          <el-button size="small" style="width:10%" type="primary" @click="submitForm" :loading="submitting">保存</el-button>
        </div>
      </div>

      <!-- 库存选择对话框 -->
      <SelectInventory
        ref="selectInventoryRef"
        v-if="inventoryDialogVisible"
        :detailList="formData.detailList"
        :returnWarehouse="{
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

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { usePlatformStore } from '@/store/modules/platform';
import {
  save,
  update,
  getDetailListByOrderNumber,
  queryLotAttributeValueByOrderDetailId as queryLotAttributeValueByOrderDetailIdApi,
  deleteOrderDetails
} from '@/service/api/inventory/return-supplier';
import {
  getSupplierByClientId,
  getWarehouseBySupplierId,
  getProjectBySupplierAndWarehouseCode
} from '@/service/api/basic/product-price-config';
import { queryLotAttributeByCustomerId } from '@/service/api/mdm/lot-attribute';
import SelectInventory from './select-inventory.vue';

defineOptions({ name: 'ReturnSupplierUpdateOrAdd' });

const props = withDefaults(
  defineProps<{
    deliveryMethodOptions?: any[];
  }>(),
  {
    deliveryMethodOptions: () => []
  }
);

const emit = defineEmits(['success', 'close']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const tableRef = ref<any>();
const selectInventoryRef = ref();

const dialogVisible = ref(false);
const submitting = ref(false);
const inventoryDialogVisible = ref(false);
const title = ref('');

// 用于控制watch监听器的触发时机
const shouldTriggerWarehouseWatch = ref(false);
const shouldTriggerProjectWatch = ref(false);

const formData = ref<any>({});
const projectOptions = ref<any[]>([]);
const supplierOptions = ref<any[]>([]);
const supplierOptionsForSelect = ref<any[]>([]);
const warehouseOptions = ref<any[]>([]);
const lotAttributeVos = ref<any[]>([]);

// 表单验证规则
const rules = ref<FormRules>({
  returnWarehouseCode: [{ required: true, message: '请选择退货仓库', trigger: 'change' }],
  projectId: [{ required: true, message: '请选择货主', trigger: 'change' }],
  deliveryMethodCode: [{ required: true, message: '请选择退货方式', trigger: 'change' }],
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }]
});

// 监听内部dialogVisible变化，通知父组件
watch(dialogVisible, newVal => {
  if (!newVal) {
    emit('close');
  }
});

// 监听退货仓库编码变化
watch(
  () => formData.value.returnWarehouseCode,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const warehouse = warehouseOptions.value.find((warehouse: any) => warehouse.warehouseCode == newVal);
    if (warehouse) {
      formData.value.returnWarehouseName = warehouse.warehouseName;
    }
    loadProjectOptions();
  }
);

// 监听货主ID变化
watch(
  () => formData.value.projectId,
  (newVal, oldVal) => {
    if (!shouldTriggerProjectWatch.value) {
      return;
    }
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const project = projectOptions.value.find((project: any) => project.projectId == newVal);
    if (project) {
      formData.value.projectCode = project.projectCode;
      formData.value.projectName = project.projectName;
    }
    queryLotAttributeByCustomerIdData();
  }
);

// 监听供应商ID变化
watch(
  () => formData.value.supplierId,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const supplier = supplierOptions.value.find((supplier: any) => supplier.supplierId == newVal);
    if (supplier) {
      formData.value.supplierCode = supplier.supplierCode;
      formData.value.supplierName = supplier.supplierName;
    }
    loadWarehouseOptions();
  }
);

/** 新增初始化 */
function addInit(dialogTitle: string) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  formData.value = {
    id: '',
    orderType: '',
    expectedArrivalDate: '',
    projectId: '',
    projectCode: '',
    projectName: '',
    returnWarehouseCode: '',
    returnWarehouseName: '',
    supplierId: '',
    supplierCode: '',
    supplierName: '',
    deliveryMethod: '',
    remark: '',
    returnDetails: [],
    detailList: []
  };
  formData.value.clientId = platformStore.client?.id;
  formData.value.clientCode = platformStore.client?.code;
  formData.value.clientName = platformStore.client?.cnName;
  shouldTriggerWarehouseWatch.value = true;
  shouldTriggerProjectWatch.value = true;
  loadSupplierOptions();

  if (props.deliveryMethodOptions.length == 1) {
    formData.value.deliveryMethodCode = props.deliveryMethodOptions[0].value;
    formData.value.deliveryMethodName = props.deliveryMethodOptions[0].name;
  }
}

/** 编辑初始化 */
async function updateInit(dialogTitle: string, row: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  formData.value = { ...row, detailList: [] };
  await loadSupplierOptions();
  await loadProjectOptions();
  queryLotAttributeByCustomerIdData();
  loadOrderDetailData();
}

/** 加载订单明细 */
function loadOrderDetailData() {
  getDetailListByOrderNumber(formData.value.orderNumber)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        formData.value.detailList = data.data;
      }
    })
    .catch(err => {
      console.error('获取退货订单详情失败:', err);
    });
}

/** 获取供应商列表 */
function loadSupplierOptions() {
  if (!platformStore.client?.id) {
    return;
  }
  return new Promise<void>(resolve => {
    supplierOptions.value = [];
    getSupplierByClientId(platformStore.client?.id)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.data && data.data.length > 0) {
          supplierOptions.value = data.data;
          supplierOptionsForSelect.value = supplierOptions.value;
          // 如果只有一个供应商，直接选中
          if (supplierOptions.value.length == 1) {
            formData.value.supplierId = supplierOptions.value[0].supplierId;
            formData.value.supplierCode = supplierOptions.value[0].supplierCode;
            formData.value.supplierName = supplierOptions.value[0].supplierName;
          }
        } else {
          formData.value.supplierId = null;
          formData.value.supplierCode = '';
          formData.value.supplierName = '';
        }
        resolve();
      })
      .catch(() => {
        resolve();
      });
  });
}

/** 查询仓库信息 */
function loadWarehouseOptions() {
  if (!formData.value.supplierId) {
    return;
  }
  warehouseOptions.value = [];
  return new Promise<void>(resolve => {
    getWarehouseBySupplierId(platformStore.client?.id, formData.value.supplierId)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.data && data.data.length > 0) {
          warehouseOptions.value = data.data;
          // 如果只有一个仓库，直接选中
          if (warehouseOptions.value.length == 1) {
            formData.value.returnWarehouseCode = warehouseOptions.value[0].warehouseCode;
            formData.value.returnWarehouseName = warehouseOptions.value[0].warehouseName;
          }
        } else {
          formData.value.returnWarehouseCode = '';
          formData.value.returnWarehouseName = '';
        }
        resolve();
      })
      .catch(() => {
        resolve();
      });
  });
}

/** 加载仓库下面的货主 */
function loadProjectOptions() {
  if (!formData.value.supplierId || !formData.value.returnWarehouseCode) {
    return;
  }
  projectOptions.value = [];
  return new Promise<void>(resolve => {
    getProjectBySupplierAndWarehouseCode(
      platformStore.client?.id,
      formData.value.supplierId,
      formData.value.returnWarehouseCode
    )
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.data && data.data.length > 0) {
          projectOptions.value = data.data;
          // 如果只有一个货主，则默认选中
          if (projectOptions.value.length == 1) {
            formData.value.projectId = projectOptions.value[0].projectId;
            formData.value.projectCode = projectOptions.value[0].projectCode;
            formData.value.projectName = projectOptions.value[0].projectName;
          }
        } else {
          formData.value.projectId = null;
          formData.value.projectCode = '';
          formData.value.projectName = '';
        }
        resolve();
      })
      .catch(() => {
        resolve();
      });
  });
}

/** 对话框关闭处理 */
function handleClose() {
  formRef.value?.resetFields();
  formData.value = {};
  formData.value.detailList = [];
  dialogVisible.value = false;
}

/** 提交表单 */
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 验证是否有退货明细
      if (!formData.value.detailList || formData.value.detailList.length === 0) {
        ElMessage.warning('请至少添加一条退货明细');
        return;
      }
      // 封装批属性到lotAttributeEntity属性下
      const formDataWithLotAttributes = {
        ...formData.value,
        detailList: formData.value.detailList.map((detail: any) => ({
          id: detail.id || null,
          productId: detail.productId,
          productNumber: detail.productNumber,
          productName: detail.productName,
          quantity: detail.quantity,
          unitDictionaryName: detail.unitDictionaryName,
          unitDictionaryId: detail.unitDictionaryId,
          lotAttributeEntity: {
            id: detail.lotAttributeVos && detail.lotAttributeVos.length > 0 ? detail.lotAttributeVos[0].id : null,
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
      };

      submitting.value = true;
      if (!formData.value.id) {
        save(formDataWithLotAttributes)
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('保存成功');
              emit('success', '');
              dialogVisible.value = false;
            }
            submitting.value = false;
          })
          .catch(() => {
            submitting.value = false;
          });
      } else {
        update(formDataWithLotAttributes)
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('更新成功');
              emit('success', '');
              dialogVisible.value = false;
            }
            submitting.value = false;
          })
          .catch(() => {
            submitting.value = false;
          });
      }
    }
  });
}

/** 根据订单明细ID查询批属性值 */
function queryLotAttributeValueByOrderDetailId(row: any, _expandedRows: any) {
  if (!row.id) {
    return;
  }
  if (row.lotAttributeVos && row.lotAttributeVos.length > 0) {
    return;
  }
  queryLotAttributeValueByOrderDetailIdApi(row.id).then(({ response }) => {
    const data: any = response?.data;
    if (data && data.data && (data.code as unknown as number) === 0) {
      row.lotAttributeVos = data.data;
    }
  });
}

/** 根据客户ID查询批次属性 */
function queryLotAttributeByCustomerIdData() {
  if (!formData.value.projectId) {
    return;
  }
  queryLotAttributeByCustomerId(formData.value.projectId, 0)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        lotAttributeVos.value = data.data;
      }
    })
    .catch(error => {
      console.error('查询客户批次属性失败:', error);
    });
}

/** 退货方式变更处理 */
function handleDeliveryMethodChange(value: any) {
  const method = props.deliveryMethodOptions.find(item => item.value === value);
  formData.value.deliveryMethodName = method ? method.label : '';
}

/** 退货数量变化处理 */
function handleReturnQtyChange(index: number) {
  const detail = formData.value.detailList[index];
  if (detail.quantity > detail.quantityMaxLimit) {
    ElMessage.warning(`退货数量不能超过可用库存（${detail.quantityMaxLimit}）`);
    detail.quantity = detail.quantityMaxLimit;
  }
}

/** 删除退货明细 */
function removeDetail(index: number) {
  const detail = formData.value.detailList[index];
  // 如果有订单明细ID，说明是已保存的明细，需要调用API删除
  if (detail.id) {
    ElMessageBox.confirm('此操作将永久删除该退货明细，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteOrderDetails([detail.id])
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('删除成功');
              formData.value.detailList.splice(index, 1);
            } else {
              ElMessage.error(data?.msg || '删除失败');
            }
          })
          .catch(error => {
            console.error('删除订单明细失败:', error);
            ElMessage.error('删除失败');
          });
      })
      .catch(() => {
        ElMessage.info('已取消删除');
      });
  } else {
    // 如果是未保存的明细，直接删除
    formData.value.detailList.splice(index, 1);
    ElMessage.success('删除成功');
  }
}

/** 打开库存选择对话框 */
function openInventoryDialog() {
  inventoryDialogVisible.value = true;
  nextTick(() => {
    selectInventoryRef.value?.init(inventoryDialogVisible.value);
  });
}

/** 库存选择确认处理 */
function handleInventoryConfirm(updatedDetails: any[]) {
  // 使用动态的批次属性配置 lotAttributeVos
  formData.value.detailList = updatedDetails.map(detail => {
    const newDetail = { ...detail };
    // 如果存在批次属性配置，则应用到明细项
    if (lotAttributeVos.value && lotAttributeVos.value.length > 0) {
      lotAttributeVos.value.forEach(config => {
        config.lotAttrValue = detail[config.lotAttrNumber] || '';
      });
    }
    newDetail.lotAttributeVos = { ...lotAttributeVos.value };
    return newDetail;
  });
  inventoryDialogVisible.value = false;
}

/** 库存选择取消处理 */
function handleInventoryCancel() {
  inventoryDialogVisible.value = false;
}

/** 库存选择对话框关闭处理 */
function handleInventoryDialogClose() {
  inventoryDialogVisible.value = false;
}

/** 供应商过滤 */
function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = supplierOptions.value.filter(item => {
      if (
        !!~item.supplierCode.indexOf(val) ||
        !!~item.supplierCode.toUpperCase().indexOf(val.toUpperCase()) ||
        !!~item.supplierName.indexOf(val) ||
        !!~item.supplierName.toUpperCase().indexOf(val.toUpperCase())
      ) {
        return true;
      }
    });
  } else {
    supplierOptionsForSelect.value = supplierOptions.value;
  }
}

defineExpose({ addInit, updateInit });
</script>

<style scoped>
.transfer-order-form {
  min-height: 100%;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 15px;
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

.batch-attributes-panel {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.attribute-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: white;
  border-radius: 3px;
  border: 1px solid #e8e8e8;
}

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
