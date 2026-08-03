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
      size="small"
      label-width="120px"
      style="padding-right: 20px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="货主" prop="projectId">
            <el-select
              v-model="currentFormData.projectId"
              filterable
              placeholder="请选择货主"
              clearable
              style="width: 100%"
              @change="projectChangeHandle"
            >
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.shortName"
                :value="item.id"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.code }}</span>
                  <span class="text-xs text-gray-400">{{ item.shortName }}</span>
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
              @change="warehouseChangeHandle"
            >
              <el-option
                v-for="item in warehouseOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.code }}</span>
                  <span class="text-xs text-gray-400">{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="currentFormData.supplierId"
              filterable
              :filter-method="supplierFilterHandle"
              @visible-change="supplierOptionsForSelect = supplierOptions"
              placeholder="请选择供应商"
              style="width: 100%"
              @change="supplierChangeHandle"
            >
              <el-option
                v-for="item in supplierOptionsForSelect"
                :key="item.id"
                :label="item.shortName"
                :value="item.id"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.code }}</span>
                  <span class="text-xs text-gray-400">{{ item.shortName }}</span>
                </div>
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
              @keydown.tab="searchProductByCode"
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
              :remote-method="(query: string) => debounceSearchProductByName(query)"
              :loading="productCnNameLoading"
              @change="(value: any) => fillProductInfo(null, value)"
              style="width: 100%"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.productCnName"
                :value="item.id"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.productNumber }}</span>
                  <span class="text-xs text-gray-400">{{ item.productCnName }}</span>
                </div>
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
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="代采服务价" prop="proxyPurchasePrice">
            <el-input
              v-model="currentFormData.proxyPurchasePrice"
              placeholder="请输入代采服务价"
              style="width: 100%"
            >
              <template #append>元</template>
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
              <template #append>元</template>
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
              <template #append>元</template>
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
              <template #append>元</template>
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

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import { save, update } from '@/service/api/basic/product-price-config';
import { getActivatedProjectByClient } from '@/service/api/mdm/project';
import { getActivatedWarehouseByParams } from '@/service/api/mdm/warehouse';
import { getSupplierVoByCustomerId } from '@/service/api/mdm/supplier';
import {
  queryEntityByProductNumberAndCustomerId,
  queryEntityByProductCnNameAndCustomerId
} from '@/service/api/mdm/product';

defineOptions({ name: 'ProductPriceUpdateOrAdd' });

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const submitButtonLoading = ref(false);

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const currentFormData = reactive<any>({
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
  proxyPurchasePrice: 0,
  factoryPrice: 0,
  purchasePrice: 0,
  transferPrice: 0,
  remarks: ''
});

const supplierOptions = ref<any[]>([]);
const supplierOptionsForSelect = ref<any[]>([]);
const productList = ref<any[]>([]);
const projectOptions = ref<any[]>([]);
const warehouseOptions = ref<any[]>([]);
const productCnNameLoading = ref(false);
const product = ref<any>(null);

// 价格校验
function validatePrice(_rule: any, value: any, callback: (error?: Error) => void) {
  if (value === '' || value === null || value === undefined) {
    callback();
    return;
  }
  const priceRegex = /^\d+(\.\d{1,4})?$/;
  if (!priceRegex.test(String(value))) {
    callback(new Error('请输入正确的数字格式，最多支持四位小数'));
  } else {
    callback();
  }
}

// 表单验证规则
const rules = reactive<FormRules>({
  productNumber: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  projectId: [{ required: true, message: '请选择货主', trigger: 'blur' }],
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
  warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
  clientId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
  safeStockDay: [{ required: true, message: '请输入安全库存天数', trigger: 'blur' }],
  proxyPurchasePrice: [
    { required: true, message: '请输入代采服务价', trigger: 'blur' },
    { validator: validatePrice, trigger: 'blur' }
  ],
  factoryPrice: [
    { required: true, message: '请输入出厂价', trigger: 'blur' },
    { validator: validatePrice, trigger: 'blur' }
  ],
  purchasePrice: [
    { required: true, message: '请输入采购价', trigger: 'blur' },
    { validator: validatePrice, trigger: 'blur' }
  ],
  transferPrice: [
    { required: true, message: '请输入调拨价', trigger: 'blur' },
    { validator: validatePrice, trigger: 'blur' }
  ]
});

/** 新增初始化方法（供父组件调用） */
function addInit() {
  dialogTitle.value = '新增产品价格配置';
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
    productId: null,
    productNumber: '',
    productName: '',
    proxyPurchasePrice: 0.0,
    factoryPrice: 0.0,
    purchasePrice: 0.0,
    transferPrice: 0.0,
    safeStockDay: 0,
    createdBy: '',
    createdTime: '',
    lastModifiedBy: '',
    lastModifiedTime: '',
    delFlag: 1,
    remarks: ''
  });
  dialogVisible.value = true;
  loadProjectOptions();
}

/** 编辑初始化方法（供父组件调用） */
function updateInit(rowData: any) {
  dialogTitle.value = '编辑产品价格配置';
  Object.assign(currentFormData, rowData);
  dialogVisible.value = true;
  loadWarehouseOptions();
  loadProjectOptions();
  loadSupplierOptions();
}

/** 供应商过滤 */
function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = supplierOptions.value.filter((item: any) => {
      return (
        item.code?.indexOf(val) > -1 ||
        item.code?.toUpperCase().indexOf(val.toUpperCase()) > -1 ||
        item.shortName?.indexOf(val) > -1 ||
        item.shortName?.toUpperCase().indexOf(val.toUpperCase()) > -1
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
  productList.value = [];
  productCnNameLoading.value = false;
  product.value = null;
}

/** 根据产品编码搜索产品信息 */
function searchProductByCode() {
  if (!currentFormData.productNumber) return;
  if (!currentFormData.projectId) {
    ElMessage.warning('请录入货主再进行查询');
    return;
  }
  queryEntityByProductNumberAndCustomerId(currentFormData.productNumber, currentFormData.projectId)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        product.value = data.data[0];
        if (product.value) {
          fillProductInfo(product.value, null);
        }
      } else if (data && (data.code as unknown as number) === 0 && !data.data) {
        ElMessage.warning('该货主下未找到产品[' + currentFormData.productNumber + ']的相关信息，请确认后重试');
      }
    })
    .catch((error: any) => {
      console.error('获取产品信息失败:', error);
      ElMessage.error('获取产品信息失败');
    });
}

/** 根据产品名称模糊搜索产品（防抖） */
function debounceSearchProductByName(query: string) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    searchProductByName(query);
  }, 500);
}

/** 根据产品名称搜索产品 */
function searchProductByName(query: string) {
  if (!query) return;
  if (!currentFormData.projectId) {
    ElMessage.warning('请录入货主再进行查询');
    return;
  }
  productCnNameLoading.value = true;
  queryEntityByProductCnNameAndCustomerId(query, currentFormData.projectId)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        productList.value = data.data;
      }
      productCnNameLoading.value = false;
    })
    .catch((error: any) => {
      productCnNameLoading.value = false;
      console.error('搜索产品信息失败:', error);
      ElMessage.error('搜索产品信息失败');
    });
}

/** 填充产品信息 */
function fillProductInfo(productItem: any, productId: any) {
  let selectProduct: any = null;
  if (productItem) {
    selectProduct = productItem;
  } else if (productId) {
    selectProduct = productList.value.find((p: any) => p.id === productId);
  }
  if (!selectProduct) return;
  currentFormData.productNumber = selectProduct.productNumber;
  currentFormData.productName = selectProduct.productCnName;
  currentFormData.productId = selectProduct.id;
}

/** 加载货主选项 */
function loadProjectOptions() {
  getActivatedProjectByClient(platformStore.client?.id)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        projectOptions.value = data.data;
      }
    })
    .catch(() => {});
}

/** 加载仓库选项 */
function loadWarehouseOptions() {
  const param = {
    externalClientId: platformStore.client?.id,
    projectId: currentFormData.projectId
  };
  getActivatedWarehouseByParams(param)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        warehouseOptions.value = data.data;
      }
    })
    .catch(() => {});
}

/** 加载供应商选项 */
function loadSupplierOptions() {
  getSupplierVoByCustomerId(currentFormData.projectId)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        supplierOptions.value = data.data || [];
        supplierOptionsForSelect.value = supplierOptions.value;
      }
    })
    .catch(() => {});
}

/** 货主选择变化处理 */
function projectChangeHandle(value: any) {
  if (value) {
    const selectedProject = projectOptions.value.find((p: any) => p.id === value);
    if (selectedProject) {
      currentFormData.projectCode = selectedProject.code;
      currentFormData.projectName = selectedProject.shortName;
      loadWarehouseOptions();
      loadSupplierOptions();
    }
  } else {
    currentFormData.projectCode = '';
    currentFormData.projectName = '';
  }
}

/** 仓库选择变化处理 */
function warehouseChangeHandle(value: any) {
  if (value) {
    const selectedWarehouse = warehouseOptions.value.find((w: any) => w.code === value);
    if (selectedWarehouse) {
      currentFormData.warehouseName = selectedWarehouse.name;
    }
  } else {
    currentFormData.warehouseName = '';
  }
}

/** 供应商选择变化处理 */
function supplierChangeHandle(value: any) {
  if (value) {
    const selectedSupplier = supplierOptionsForSelect.value.find((s: any) => s.id === value);
    if (selectedSupplier) {
      currentFormData.supplierName = selectedSupplier.shortName;
      currentFormData.supplierCode = selectedSupplier.code;
    }
  } else {
    currentFormData.supplierName = '';
    currentFormData.supplierCode = '';
  }
}

defineExpose({ addInit, updateInit, reset });
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
