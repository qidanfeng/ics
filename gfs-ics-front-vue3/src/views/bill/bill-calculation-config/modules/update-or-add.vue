<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog_customWidth"
    top="10vh"
    v-model="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="formRef"
      :model="currentFormData"
      :rules="rules"
      size="small"
      label-width="120px"
      style="padding-right: 20px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              filterable
              :filter-method="supplierFilterHandle"
              @visible-change="supplierOptionsForSelect = suppliers"
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

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="费用类型" prop="costType">
            <el-select size="small" class="w-full" v-model="currentFormData.costType" placeholder="请选择费用类型">
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
            <el-select size="small" class="w-full" v-model="currentFormData.documentTypeCode" placeholder="请选择单据类型" @change="handleDocumentTypeChange">
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
            <el-select size="small" class="w-full" v-model="currentFormData.deliveryMethodCode" placeholder="请选择送货方式" @change="handleDeliveryMethodChange">
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
          <el-form-item label="费项" prop="costItemCode">
            <el-select size="small" @change="costItemCodeHandle" class="w-full" v-model="currentFormData.costItemCode" filterable placeholder="请选择费项">
              <el-option
                v-for="item in costItemOptions"
                :key="item.costItemCode"
                :label="item.costItemName"
                :value="item.costItemCode">
                <span style="float: left">{{ item.costItemCode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计算方式" prop="calculationMethodCode">
            <el-select size="small" class="w-full" v-model="currentFormData.calculationMethodCode" placeholder="请选择计算方式">
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

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import { save, update } from '@/service/api/bill/bill-calculation-config';
import { getAllCostItemCodeList } from '@/service/api/bill/bill-item-config';
import { getDeliveryMethodList, getCalculationMethodList } from '@/service/api/constant/order-constant';
import { getWarehouseBySupplierId, getProjectBySupplierAndWarehouseCode } from '@/service/api/basic/product-price-config';

defineOptions({ name: 'UpdateOrAdd' });

const props = withDefaults(
  defineProps<{
    costTypeOptions?: any[];
    documentTypeOptions?: any[];
  }>(),
  {
    costTypeOptions: () => [],
    documentTypeOptions: () => []
  }
);

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const submitButtonLoading = ref(false);

const currentFormData = ref<any>({
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
});

const suppliers = ref<any[]>(platformStore.suppliers);
const supplierOptionsForSelect = ref<any[]>([]);
const deliveryMethodOptions = ref<any[]>([]);
const calculationMethodOptions = ref<any[]>([]);
const projectOptions = ref<any[]>([]);
const warehouseOptions = ref<any[]>([]);
const costItemOptions = ref<any[]>([]);

// 表单验证规则
const rules = ref<FormRules>({
  costType: [
    { required: true, message: '请选择费用类型', trigger: 'change' }
  ],
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  warehouseCode: [
    { required: true, message: '请选择仓库', trigger: 'change' }
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
    { required: true, message: '请选择费项', trigger: 'change' }
  ],
  calculationMethodCode: [
    { required: true, message: '请选择计算方式', trigger: 'change' }
  ],
  remarks: [
    { max: 256, message: '备注长度不能超过 256 个字符', trigger: 'blur' }
  ]
});

// 监听供应商ID变化，自动加载仓库
watch(
  () => currentFormData.value.supplierId,
  (newVal, oldVal) => {
    if (newVal && oldVal != newVal) {
      if (suppliers.value.length > 0) {
        const supplier = suppliers.value.find((s: any) => s.supplierId == newVal);
        if (supplier) {
          currentFormData.value.supplierCode = supplier.supplierCode;
          currentFormData.value.supplierName = supplier.supplierName;
        }
      }
      loadWarehouseOptions();
    }
  },
  { immediate: false }
);

// 监听仓库编码变化，自动加载货主
watch(
  () => currentFormData.value.warehouseCode,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    if (warehouseOptions.value.length > 0) {
      const warehouse = warehouseOptions.value.find((w: any) => w.warehouseCode == newVal);
      if (warehouse) {
        currentFormData.value.warehouseName = warehouse.warehouseName;
      }
    }
    loadProjectOptions();
  },
  { immediate: false }
);

// 监听货主ID变化，自动加载批次属性
watch(
  () => currentFormData.value.projectId,
  (newVal, oldVal) => {
    if (newVal == oldVal) {
      return;
    }
    if (!newVal) {
      return;
    }
    const project = projectOptions.value.find((p: any) => p.projectId == newVal);
    if (project) {
      currentFormData.value.projectCode = project.projectCode;
      currentFormData.value.projectName = project.projectName;
    }
  },
  { immediate: false }
);

// 新增初始化方法（供父组件调用）
function addInit() {
  dialogTitle.value = '新增费用计算配置';
  isEdit.value = false;
  currentFormData.value = {
    id: null,
    costType: '',
    supplierId: '',
    supplierCode: '',
    supplierName: '',
    clientId: platformStore.client?.id,
    clientCode: platformStore.client?.code,
    clientName: platformStore.client?.cnName,
    warehouseCode: null,
    warehouseName: null,
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
  };
  dialogVisible.value = true;
  suppliers.value = platformStore.suppliers;
  supplierOptionsForSelect.value = suppliers.value;
  loadAllCostItem();
  loadCalculationMethodOptions();
  // 清除验证
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 编辑初始化方法（供父组件调用）
function updateInit(rowData: any) {
  dialogTitle.value = '编辑费用计算配置';
  isEdit.value = true;
  currentFormData.value = { ...rowData };
  dialogVisible.value = true;
  suppliers.value = platformStore.suppliers;
  supplierOptionsForSelect.value = suppliers.value;
  loadCalculationMethodOptions();
  loadAllCostItem();
  loadDeliveryMethodOptions();
  // 清除验证
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 弹窗关闭处理
function handleDialogClose() {
  dialogVisible.value = false;
  resetForm();
}

function costItemCodeHandle(value: any) {
  const item = costItemOptions.value.find((item: any) => item.costItemCode == value);
  if (item) {
    currentFormData.value.costItemName = item.costItemName;
  }
}

// 重置表单（供父组件调用）
function reset() {
  resetForm();
}

function loadAllCostItem() {
  getAllCostItemCodeList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        costItemOptions.value = data.data;
      }
    })
    .catch(() => {});
}

// 获取送货方式列表
function loadDeliveryMethodOptions() {
  deliveryMethodOptions.value = [];
  getDeliveryMethodList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data.data == data.code == 0) {
        for (let i = 0; i < data.data.length; i++) {
          const item = data.data[i];

          if (item.documentTypeCodeList.indexOf(currentFormData.value.documentTypeCode) != -1) {
            deliveryMethodOptions.value.push(item);
          }

          if (data.data.length == 1) {
            currentFormData.value.deliveryMethodName = data.data[0].name;
            currentFormData.value.deliveryMethodCode = data.data[0].value;
          }
        }
      }
    })
    .catch(() => {});
}

// 查询仓库信息
function loadWarehouseOptions() {
  if (!currentFormData.value.supplierId) {
    return;
  }
  // 调用API获取仓库列表
  getWarehouseBySupplierId(platformStore.client?.id, currentFormData.value.supplierId)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        warehouseOptions.value = data.data;
        // 如果只有一个仓库，直接选中，同时查询货主信息
        if (warehouseOptions.value.length == 1) {
          currentFormData.value.warehouseCode = warehouseOptions.value[0].warehouseCode;
          currentFormData.value.warehouseName = warehouseOptions.value[0].warehouseName;
        }
      }
    })
    .catch(() => {});
}

// 查询计算方法
function loadCalculationMethodOptions() {
  // 调用API获取仓库列表
  getCalculationMethodList()
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        calculationMethodOptions.value = data.data;
      }
    })
    .catch(() => {});
}

// 查询货主信息
function loadProjectOptions() {
  if (!currentFormData.value.supplierId || !currentFormData.value.warehouseCode) {
    return;
  }
  // 调用API获取货主列表
  getProjectBySupplierAndWarehouseCode(
    platformStore.client?.id,
    currentFormData.value.supplierId,
    currentFormData.value.warehouseCode
  )
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        projectOptions.value = data.data;
        // 如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
        if (projectOptions.value.length == 1) {
          currentFormData.value.projectId = projectOptions.value[0].projectId;
          currentFormData.value.projectCode = projectOptions.value[0].projectCode;
          currentFormData.value.projectName = projectOptions.value[0].projectName;
        }
      }
    })
    .catch(() => {});
}

// 单据类型选择变化处理
function handleDocumentTypeChange(value: any) {
  if (value) {
    const selectedOption = props.documentTypeOptions.find((option: any) => option.value == value);
    if (selectedOption) {
      currentFormData.value.documentTypeName = selectedOption.name;
    }
    currentFormData.value.deliveryMethodCode = '';
    currentFormData.value.deliveryMethodName = '';
    loadDeliveryMethodOptions();
  } else {
    currentFormData.value.documentTypeName = '';
  }
}

// 送货方式选择变化处理
function handleDeliveryMethodChange(value: any) {
  if (value != null && value != undefined) {
    const selectedOption = deliveryMethodOptions.value.find((option: any) => option.value === value);
    if (selectedOption) {
      currentFormData.value.deliveryMethodName = selectedOption.name;
    }
  } else {
    currentFormData.value.deliveryMethodName = '';
  }
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      submitButtonLoading.value = true;
      const calculationMethodOption = calculationMethodOptions.value.find((item: any) => item.value == currentFormData.value.calculationMethodCode);
      currentFormData.value.calculationMethodName = calculationMethodOption.name;

      if (isEdit.value) {
        // 编辑操作
        update(currentFormData.value)
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('更新成功');
              emit('submit');
              dialogVisible.value = false;
            } else {
              ElMessage.error(data?.message || '更新失败');
            }
            submitButtonLoading.value = false;
          })
          .catch((error: any) => {
            submitButtonLoading.value = false;
            ElMessage.error('更新失败：' + error.message);
          });
      } else {
        // 新增操作
        save(currentFormData.value)
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('保存成功');
              emit('submit');
              dialogVisible.value = false;
            } else {
              ElMessage.error(data?.message || '保存失败');
            }
            submitButtonLoading.value = false;
          })
          .catch((error: any) => {
            submitButtonLoading.value = false;
            ElMessage.error('保存失败：' + error.message);
          });
      }
    }
  });
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields();
}

function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = suppliers.value.filter((item: any) => {
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
    supplierOptionsForSelect.value = suppliers.value;
  }
}

defineExpose({ addInit, updateInit, reset });
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
