<template>
  <el-dialog
    :title="dialogTitle"
    top="10vh"
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="formRef"
      :model="currentFormData"
      :rules="rules"
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
                :value="item.supplierId"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.supplierCode }}</span>
                  <span class="text-xs text-gray-400">{{ item.supplierName }}</span>
                </div>
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
                :value="item.warehouseCode"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.warehouseCode }}</span>
                  <span class="text-xs text-gray-400">{{ item.warehouseName }}</span>
                </div>
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
                :value="item.projectId"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.projectCode }}</span>
                  <span class="text-xs text-gray-400">{{ item.projectName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

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

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import { save, update } from '@/service/api/basic/order-quantity-config';
import {
  getSupplierByClientId,
  getWarehouseBySupplierId,
  getProjectBySupplierAndWarehouseCode
} from '@/service/api/basic/product-price-config';

defineOptions({ name: 'OrderQuantityUpdateOrAdd' });

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const submitButtonLoading = ref(false);

// 是否触发 watch
let shouldTriggerWarehouseWatch = true;

const currentFormData = reactive<any>({
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
});

const supplierOptions = ref<any[]>([]);
const supplierOptionsForSelect = ref<any[]>([]);
const projectOptions = ref<any[]>([]);
const warehouseOptions = ref<any[]>([]);

// 表单验证规则
const rules = reactive<FormRules>({
  projectId: [{ required: true, message: '请选择货主', trigger: 'blur' }],
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
  warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
  clientId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
  minOrderQuantity: [{ required: true, message: '请输入最小起订量(收货单位)', trigger: 'blur' }],
  orderCycleTime: [{ required: true, message: '请输入订货周期(天)', trigger: 'blur' }]
});

// 监听供应商ID变化，自动加载仓库
watch(
  () => currentFormData.supplierId,
  (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      if (supplierOptions.value.length > 0) {
        const supplier = supplierOptions.value.find((s: any) => s.supplierId === newVal);
        if (supplier) {
          currentFormData.supplierCode = supplier.supplierCode;
          currentFormData.supplierName = supplier.supplierName;
        }
      }
      loadWarehouseOptions();
    }
  }
);

// 监听仓库编码变化，自动加载货主
watch(
  () => currentFormData.warehouseCode,
  (newVal, oldVal) => {
    if (!shouldTriggerWarehouseWatch) return;
    if (newVal === oldVal) return;
    if (warehouseOptions.value.length > 0) {
      const warehouse = warehouseOptions.value.find((w: any) => w.warehouseCode === newVal);
      if (warehouse) {
        currentFormData.warehouseName = warehouse.warehouseName;
      }
    }
    loadProjectOptions();
  }
);

/** 新增初始化方法（供父组件调用） */
async function addInit() {
  dialogTitle.value = '新增订购量配置';
  Object.assign(currentFormData, {
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
  });
  dialogVisible.value = true;
  shouldTriggerWarehouseWatch = true;
  await loadSupplierOptions();
  await nextTick();
}

/** 编辑初始化方法（供父组件调用） */
async function updateInit(rowData: any) {
  dialogTitle.value = '编辑订购量配置';
  Object.assign(currentFormData, rowData);
  dialogVisible.value = true;
  shouldTriggerWarehouseWatch = true;
  await loadSupplierOptions();
  await nextTick();
}

/** 供应商过滤 */
function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = supplierOptions.value.filter((item: any) => {
      return (
        item.supplierCode?.indexOf(val) > -1 ||
        item.supplierCode?.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
        item.supplierName?.indexOf(val) > -1 ||
        item.supplierName?.toUpperCase().indexOf(val.toUpperCase()) > -1
      );
    });
  } else {
    supplierOptionsForSelect.value = supplierOptions.value;
  }
}

/** 弹窗关闭处理 */
function handleDialogClose() {
  dialogVisible.value = false;
  resetForm();
}

/** 重置表单（供父组件调用） */
function reset() {
  resetForm();
}

/** 提交表单 */
function submitForm() {
  formRef.value?.validate(valid => {
    if (valid) {
      currentFormData.clientId = platformStore.client?.id;
      currentFormData.clientCode = platformStore.client?.code;
      currentFormData.clientName = platformStore.client?.cnName;
      submitButtonLoading.value = true;
      if (currentFormData.id) {
        update(currentFormData)
          .then(({ response }) => {
            const data = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              emit('submit');
              dialogVisible.value = false;
            }
            submitButtonLoading.value = false;
          })
          .catch(() => {
            submitButtonLoading.value = false;
          });
      } else {
        save(currentFormData)
          .then(({ response }) => {
            const data = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              emit('submit');
              dialogVisible.value = false;
            }
            submitButtonLoading.value = false;
          })
          .catch(() => {
            submitButtonLoading.value = false;
          });
      }
    }
  });
}

/** 重置表单 */
function resetForm() {
  formRef.value?.resetFields();
}

/** 获取供应商列表 */
function loadSupplierOptions() {
  return new Promise<void>((resolve, reject) => {
    getSupplierByClientId(platformStore.client?.id)
      .then(({ response }) => {
        const data = response?.data;
        if (data && (data.code as unknown as number) === 0) {
          supplierOptions.value = data.data || [];
          supplierOptionsForSelect.value = supplierOptions.value;
          // 如果只有一个供应商，直接选中，选中的同时查询仓库
          if (supplierOptions.value.length === 1) {
            currentFormData.supplierId = supplierOptions.value[0].supplierId;
            currentFormData.supplierCode = supplierOptions.value[0].supplierCode;
            currentFormData.supplierName = supplierOptions.value[0].supplierName;
          }
        }
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

/** 查询仓库信息 */
function loadWarehouseOptions() {
  if (!currentFormData.supplierId) {
    currentFormData.warehouseCode = null;
    currentFormData.warehouseName = null;
    return;
  }
  getWarehouseBySupplierId(platformStore.client?.id, currentFormData.supplierId)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        warehouseOptions.value = data.data;
        // 如果只有一个仓库，直接选中，同时查询货主信息
        if (warehouseOptions.value.length === 1) {
          currentFormData.warehouseCode = warehouseOptions.value[0].warehouseCode;
          currentFormData.warehouseName = warehouseOptions.value[0].warehouseName;
        } else {
          let notMatch = true;
          if (warehouseOptions.value.length > 0) {
            const warehouse = warehouseOptions.value.find((w: any) => w.warehouseCode === currentFormData.warehouseCode);
            if (warehouse) {
              notMatch = false;
            }
          }
          if (notMatch) {
            currentFormData.warehouseCode = null;
            currentFormData.warehouseName = null;
          }
        }
      }
    })
    .catch(() => {});
}

/** 查询货主信息 */
function loadProjectOptions() {
  if (!currentFormData.supplierId || !currentFormData.warehouseCode) {
    currentFormData.projectId = null;
    currentFormData.projectCode = null;
    currentFormData.projectName = null;
    return;
  }
  getProjectBySupplierAndWarehouseCode(
    platformStore.client?.id,
    currentFormData.supplierId,
    currentFormData.warehouseCode
  )
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        projectOptions.value = data.data;
        // 如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
        if (projectOptions.value.length === 1) {
          currentFormData.projectId = projectOptions.value[0].projectId;
          currentFormData.projectCode = projectOptions.value[0].projectCode;
          currentFormData.projectName = projectOptions.value[0].projectName;
        } else {
          let notMatch = true;
          if (projectOptions.value.length > 0) {
            const project = projectOptions.value.find((item: any) => item.projectId === currentFormData.projectId);
            if (project) {
              notMatch = false;
            }
          }
          if (notMatch) {
            currentFormData.projectId = null;
            currentFormData.projectCode = null;
            currentFormData.projectName = null;
          }
        }
      }
    })
    .catch(() => {});
}

defineExpose({ addInit, updateInit, reset });
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
