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
              <el-form-item label="调出仓库" prop="outWarehouseCode">
                <el-select
                  v-model="formData.outWarehouseCode"
                  placeholder="请选择调出仓库"
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
              <el-form-item label="调入仓库" prop="inWarehouseCode">
                <el-select
                  v-model="formData.inWarehouseCode"
                  placeholder="请选择调入仓库"
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
              <el-form-item label="送货方式" prop="deliveryMethodCode">
                <el-select
                  v-model="formData.deliveryMethodCode"
                  placeholder="请选择送货方式"
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

            <el-col :span="8">
              <el-form-item label="承运商" prop="carrierId">
                <el-select
                  v-model="formData.carrierId"
                  placeholder="请选择承运商"
                  style="width: 100%"
                  @change="handleCarrierChange"
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
            <span>调拨明细</span>
            <el-button
              size="small"
              type="primary"
              @click="openInventoryDialog"
            >
              <el-icon><Plus /></el-icon>
              选择库存
            </el-button>
          </div>

          <div class="selected-inventory">
            <p v-if="!formData.detailList || formData.detailList.length === 0" class="empty-text">
              暂无选择库存明细，请点击"选择库存"按钮添加调拨明细
            </p>

            <el-table
              v-else
              ref="tableRef"
              :data="formData.detailList"
              border
              height="400"
              :row-height="30"
              :row-style="{ height: '0' }"
              :cell-style="{ padding: '0' }"
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
              <el-table-column prop="quantity" label="调拨数量" width="200" align="center">
                <template #default="scope">
                  <el-input-number
                    v-model="scope.row.quantity"
                    :min="1"
                    :max="scope.row.quantityMaxLimit"
                    size="small"
                    @change="handleTransferQtyChange(scope.$index)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="unitDictionaryName" label="单位" min-width="50" />
              <el-table-column label="操作" min-width="80" align="center" fixed="right">
                <template #default="scope">
                  <el-button
                    type="text"
                    size="small"
                    style="color: #f56c6c"
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
          <el-button size="small" style="width:10%" type="primary" @click="submitForm" :loading="submitting">保存</el-button>
        </div>
      </div>

      <!-- 库存选择对话框 -->
      <SelectInventory
        ref="selectInventoryRef"
        v-if="inventoryDialogVisible"
        :detailList="formData.detailList"
        :out-warehouse="{
          code: formData.outWarehouseCode,
          name: formData.outWarehouseName
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
import SelectInventory from './select-inventory.vue';
import {
  save,
  update,
  getDetailListByOrderNumber,
  deleteOrderDetails,
  queryLotAttributeValueByOrderDetailId as queryLotAttributeValueByOrderDetailIdApi
} from '@/service/api/inventory/transfer-order';
import {
  getWarehouseByClientId,
  getProjectByWarehouseCode
} from '@/service/api/basic/product-price-config';
import { queryLotAttributeByCustomerId as queryLotAttributeByCustomerIdApi } from '@/service/api/mdm/lot-attribute';

defineOptions({ name: 'TransferOrderUpdateOrAdd' });

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

// platform store 已移除 carriers，使用本地 ref 空数组保持 UI 结构
const carriers = ref<any[]>([]);

const formData = ref<any>({});

const warehouseOptions = ref<any[]>([]);
const projectOptions = ref<any[]>([]);
const lotAttributeVos = ref<any[]>([]);

// 表单验证规则
const rules = ref<FormRules>({
  outWarehouseCode: [
    { required: true, message: '请选择调出仓库', trigger: 'change' }
  ],
  inWarehouseCode: [
    { required: true, message: '请选择调入仓库', trigger: 'change' }
  ],
  projectId: [
    { required: true, message: '请选择货主', trigger: 'change' }
  ],
  deliveryMethodCode: [
    { required: true, message: '请选择送货方式', trigger: 'change' }
  ],
  carrierId: [
    { required: true, message: '请选择承运商', trigger: 'change' }
  ]
});

// 监听调出仓库编码变化
watch(
  () => formData.value.outWarehouseCode,
  (newVal, oldVal) => {
    if (!shouldTriggerWarehouseWatch.value) {
      return;
    }
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const warehouse = warehouseOptions.value.find((warehouse: any) => warehouse.warehouseCode == newVal);
    if (warehouse) {
      formData.value.outWarehouseName = warehouse.warehouseName;
    }
    loadProjectOptions();
  }
);

// 监听调入仓库编码变化
watch(
  () => formData.value.inWarehouseCode,
  (newVal, oldVal) => {
    if (!shouldTriggerWarehouseWatch.value) {
      return;
    }
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const warehouse = warehouseOptions.value.find((warehouse: any) => warehouse.warehouseCode == newVal);
    if (warehouse) {
      formData.value.inWarehouseName = warehouse.warehouseName;
    }
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
    queryLotAttributeByCustomerId();
  }
);

/** 新增初始化 */
function addInit(dialogTitle: string, _formData: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  initFormData();
  formData.value.clientId = platformStore.client?.id;
  formData.value.clientCode = platformStore.client?.code;
  formData.value.clientName = platformStore.client?.cnName;
  shouldTriggerWarehouseWatch.value = true;
  shouldTriggerProjectWatch.value = true;
  loadWarehouseOptions();
  if (props.deliveryMethodOptions.length == 1) {
    formData.value.deliveryMethodCode = props.deliveryMethodOptions[0].value;
    formData.value.deliveryMethodName = props.deliveryMethodOptions[0].name;
  }
  if (carriers.value.length == 1) {
    formData.value.carrierId = carriers.value[0].id;
    formData.value.carrierCode = carriers.value[0].code;
    formData.value.carrierName = carriers.value[0].fullName;
  }
}

/** 编辑初始化 */
async function updateInit(dialogTitle: string, row: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  formData.value = { ...row };
  shouldTriggerWarehouseWatch.value = true;
  shouldTriggerProjectWatch.value = true;
  await loadWarehouseOptions();
  await loadProjectOptions();
  queryLotAttributeByCustomerId();
  loadOrderDetailData();
}

function initFormData() {
  formData.value = {
    id: '',
    orderType: '',
    expectedArrivalDate: '',
    projectId: '',
    projectCode: '',
    projectName: '',
    outWarehouseCode: '',
    outWarehouseName: '',
    inWarehouseCode: '',
    inWarehouseName: '',
    carrierId: '',
    carrierCode: '',
    carrierName: '',
    deliveryMethodCode: '',
    deliveryMethodName: '',
    remarks: '',
    detailList: []
  };
}

/** 加载订单明细数据 */
function loadOrderDetailData() {
  getDetailListByOrderNumber(formData.value.orderNumber)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        formData.value.detailList = data.data;
      }
    })
    .catch(err => {
      console.error('获取调拨订单详情失败:', err);
    });
}

/** 对话框关闭处理 */
function handleClose() {
  formRef.value?.resetFields();
  initFormData();
  formData.value.detailList = [];
  dialogVisible.value = false;
  emit('close');
}

/** 提交表单 */
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (!formData.value.detailList || formData.value.detailList.length === 0) {
        ElMessage.warning('请至少添加一条调拨明细');
        return;
      }
      const formDataWithLotAttributes = {
        ...formData.value,
        detailList: formData.value.detailList.map((detail: any) => ({
          id: detail.id || null,
          unitDictionaryId: detail.unitDictionaryId,
          unitDictionaryName: detail.unitDictionaryName,
          productId: detail.productId,
          productNumber: detail.productNumber,
          productName: detail.productName,
          quantity: detail.quantity,
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

/** 查询仓库信息 */
function loadWarehouseOptions() {
  warehouseOptions.value = [];
  return new Promise<void>(resolve => {
    getWarehouseByClientId(platformStore.client?.id)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.data && data.data.length > 0) {
          warehouseOptions.value = data.data;
          if (warehouseOptions.value.length == 1) {
            formData.value.outWarehouseCode = warehouseOptions.value[0].warehouseCode;
            formData.value.outWarehouseName = warehouseOptions.value[0].warehouseName;
            formData.value.inWarehouseCode = warehouseOptions.value[0].warehouseCode;
            formData.value.inWarehouseName = warehouseOptions.value[0].warehouseName;
          }
        } else {
          formData.value.outWarehouseCode = '';
          formData.value.outWarehouseName = '';
          formData.value.inWarehouseCode = '';
          formData.value.inWarehouseName = '';
        }
        resolve();
      })
      .catch(error => {
        console.error(error);
        resolve();
      });
  });
}

/** 加载仓库下面的货主 */
function loadProjectOptions() {
  if (!formData.value.outWarehouseCode) {
    return;
  }
  projectOptions.value = [];
  return new Promise<void>(resolve => {
    getProjectByWarehouseCode(platformStore.client?.id, formData.value.outWarehouseCode)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && data.data && data.data.length > 0) {
          projectOptions.value = data.data;
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
      .catch(error => {
        console.error(error);
        resolve();
      });
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
function queryLotAttributeByCustomerId() {
  if (!formData.value.projectId) {
    return;
  }
  queryLotAttributeByCustomerIdApi(formData.value.projectId, 0)
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

function handleDeliveryMethodChange(value: any) {
  const method = props.deliveryMethodOptions.find((item: any) => item.value === value);
  formData.value.deliveryMethodName = method ? method.name : '';
}

function handleCarrierChange(value: any) {
  const carrier = carriers.value.find((item: any) => item.id === value);
  formData.value.carrierName = carrier ? carrier.fullName : '';
  formData.value.carrierCode = carrier ? carrier.code : '';
}

/** 调拨数量变化处理 */
function handleTransferQtyChange(index: number) {
  const detail = formData.value.detailList[index];
  if (detail.quantity > detail.quantityMaxLimit) {
    ElMessage.warning(`调拨数量不能超过可用库存（${detail.quantityMaxLimit}）`);
    detail.quantity = detail.quantityMaxLimit;
  }
}

/** 删除调拨明细 */
function removeDetail(index: number) {
  const detail = formData.value.detailList[index];
  if (detail.id) {
    ElMessageBox.confirm('此操作将永久删除该调拨明细，是否继续？', '提示', {
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
              ElMessage.error(data.msg || '删除失败');
            }
          })
          .catch(error => {
            console.error('删除订单明细失败:', error);
            ElMessage.error('删除失败');
          });
      })
      .catch(() => {});
  } else {
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
  formData.value.detailList = updatedDetails.map((detail: any) => {
    const newDetail = { ...detail };
    if (lotAttributeVos.value && lotAttributeVos.value.length > 0) {
      lotAttributeVos.value.forEach((config: any) => {
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

defineExpose({ addInit, updateInit });
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
