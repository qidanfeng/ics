<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="90%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div style="display: flex; flex-direction: row;">
      <div style="width: 40%">
        <AlgorithmDescription />
      </div>
      <div style="width: 60%">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          size="small"
          style="width: 100%"
          label-width="120px"
        >
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
                    <div class="flex justify-between items-center w-full">
                      <span>{{ item.warehouseCode }}</span>
                      <span class="text-xs text-gray-400">{{ item.warehouseName }}</span>
                    </div>
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
                    <div class="flex justify-between items-center w-full">
                      <span>{{ item.projectCode }}</span>
                      <span class="text-xs text-gray-400">{{ item.projectName }}</span>
                    </div>
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
                  value-format="YYYY-MM-DD"
                  :clearable="false"
                  :disabled-date="disabledSaleEndDate"
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
                    <div class="flex justify-between items-center w-full">
                      <span>{{ item.name }}</span>
                      <span class="text-xs text-gray-400">{{ item.days }}天</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="产品编码" prop="productNumber">
                <el-input
                  v-model="formData.productNumber"
                  placeholder="输入产品编码按Tab搜索"
                  @keydown.tab="searchProductByCode(formData, 0)"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="产品名称" prop="productName">
                <el-select
                  v-model="formData.productName"
                  filterable
                  size="small"
                  style="width: 100%"
                  remote
                  value-key="productId"
                  reserve-keyword
                  placeholder="输入产品名称模糊搜索"
                  :remote-method="(query: string) => debounceSearchProductByName(formData, 1, query)"
                  :loading="productCnNameLoading"
                  @change="(value: any) => fillProductInfo(formData, value, 0)"
                >
                  <el-option
                    v-for="item in productList"
                    :key="item.productId"
                    :label="item.productName"
                    :value="item"
                  >
                    <div class="flex justify-between items-center w-full">
                      <span>{{ item.productNumber }}</span>
                      <span class="text-xs text-gray-400">{{ item.productName }}</span>
                    </div>
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
    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" size="small" :loading="submitLoading" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import { save, update } from '@/service/api/forecast/average-forecast-strategy';
import { getDataPeriodList } from '@/service/api/constant/order-constant';
import { fuzzyQueryProduct } from '@/service/api/basic/product-price-config';
import AlgorithmDescription from '../components/algorithm-description.vue';

defineOptions({ name: 'ForecastStrategyUpdateOrAdd' });

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const submitLoading = ref(false);
const productCnNameLoading = ref(false);

const title = ref('');

const formData = reactive<any>({
  id: null,
  strategyName: '',
  warehouseCode: '',
  warehouseName: '',
  projectId: '',
  projectCode: '',
  projectName: '',
  productNumber: '',
  productName: '',
  algorithmTypeCode: 1,
  algorithmTypeName: '',
  saleEndDate: '',
  dataPeriod: 'week',
  dataPeriodName: '',
  hisDataPeriods: 2,
  remarks: '',
  status: 1,
  clientId: null,
  clientName: '',
  clientCode: ''
});

const productList = ref<any[]>([]);
const dataPeriodOptions = ref<any[]>([]);
let debounceTimer: any = null;

const warehouseOptions = computed(() => platformStore.warehouses);
const projectOptions = computed(() => platformStore.projects);

const algorithmOptions = computed(() => [
  {
    value: 1,
    label: '简单移动平均(SMA)'
  }
]);

const rules = reactive<FormRules>({
  strategyName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
  warehouseCode: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  projectId: [{ required: true, message: '请选择货主', trigger: 'change' }],
  algorithmTypeCode: [{ required: true, message: '请选择预测算法', trigger: 'change' }],
  dataPeriod: [{ required: true, message: '请选择数据周期', trigger: 'change' }],
  saleEndDate: [{ required: true, message: '请选择截至售卖日', trigger: 'change' }],
  hisDataPeriods: [{ required: true, message: '请输入历史数据周期数', trigger: 'blur' }]
});

/** 禁用今天之前的日期 */
function disabledSaleEndDate(time: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
}

/** 新增初始化方法（供父组件调用） */
function addInit() {
  title.value = '新增预测策略';
  Object.assign(formData, {
    id: null,
    strategyName: '',
    warehouseCode: '',
    warehouseName: '',
    projectId: '',
    projectCode: '',
    projectName: '',
    productNumber: '',
    productName: '',
    algorithmTypeCode: 1,
    algorithmTypeName: '简单移动平均(SMA)',
    saleEndDate: '',
    dataPeriod: 'week',
    dataPeriodName: '',
    hisDataPeriods: 2,
    remarks: '',
    status: 1,
    clientId: null,
    clientName: '',
    clientCode: ''
  });
  dialogVisible.value = true;
  loadDataPeriodOptions();
}

/** 编辑初始化方法（供父组件调用） */
function updateInit(rowData: any) {
  title.value = '编辑预测策略';
  Object.assign(formData, rowData);
  dialogVisible.value = true;
  loadDataPeriodOptions();
}

/** 仓库变化 */
function handleWarehouseChange(value: string) {
  const warehouse = warehouseOptions.value.find((item: any) => item.warehouseCode === value);
  if (warehouse) {
    formData.warehouseName = warehouse.warehouseName;
  }
}

/** 货主变化 */
function handleProjectChange(value: string) {
  const project = projectOptions.value.find((item: any) => item.projectId === value);
  if (project) {
    formData.projectCode = project.projectCode;
    formData.projectName = project.projectName;
  }
}

/** 算法类型变化 */
function handleAlgorithmTypeChange(value: number) {
  const algorithm = algorithmOptions.value.find(item => item.value === value);
  if (algorithm) {
    formData.algorithmTypeName = algorithm.label;
  }
}

/** 关闭弹窗 */
function handleClose() {
  formRef.value?.resetFields();
  dialogVisible.value = false;
}

/** 提交表单 */
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      submitLoading.value = true;
      if (formData.id) {
        update(formData)
          .then(({ response }) => {
            const data = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              emit('submit');
              dialogVisible.value = false;
            }
            submitLoading.value = false;
          })
          .catch(() => {
            submitLoading.value = false;
          });
      } else {
        formData.clientId = platformStore.client?.id;
        formData.clientName = platformStore.client?.cnName;
        formData.clientCode = platformStore.client?.code;
        save(formData)
          .then(({ response }) => {
            const data = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              emit('submit');
              dialogVisible.value = false;
            }
            submitLoading.value = false;
          })
          .catch(() => {
            submitLoading.value = false;
          });
      }
    }
  });
}

/** 根据产品编码搜索产品 */
function searchProductByCode(row: any, index: number) {
  if (!row.productNumber) return;
  const param = {
    productNumber: row.productNumber,
    ignoreSupplierLimitFlag: 1,
    projectId: formData.projectId,
    warehouseCode: formData.warehouseCode,
    supplierId: formData.supplierId,
    clientId: platformStore.client?.id
  };
  fuzzyQueryProduct(param)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        const product = data.data[0];
        if (product) {
          fillProductInfo(row, product, index);
        }
      } else if (data && (data.code as unknown as number) === 0 && !data.data) {
        ElMessage.warning(`该货主下未找到产品[${row.productNumber}]的相关信息，请确认后重试`);
      }
    })
    .catch(() => {});
}

/** 根据产品名称模糊搜索产品（防抖） */
function debounceSearchProductByName(row: any, index: number, query: string) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    searchProductByName(row, index, query);
  }, 500);
}

/** 根据产品名称搜索产品 */
function searchProductByName(row: any, _index: number, query: string) {
  if (!query) return;
  if (!formData.projectId) {
    ElMessage.warning('请录入货主再进行查询');
    return;
  }
  productList.value = [];
  productCnNameLoading.value = true;
  const param = {
    productName: query,
    ignoreSupplierLimitFlag: 1,
    projectId: formData.projectId,
    warehouseCode: formData.warehouseCode,
    clientId: platformStore.client?.id
  };
  fuzzyQueryProduct(param)
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        productList.value = data.data;
      }
      productCnNameLoading.value = false;
    })
    .catch(() => {
      productCnNameLoading.value = false;
    });
}

/** 填充产品信息 */
function fillProductInfo(row: any, product: any, _index: number) {
  row.productId = product.productId;
  row.productNumber = product.productNumber;
  row.productName = product.productName;
}

/** 加载数据周期选项 */
function loadDataPeriodOptions() {
  getDataPeriodList()
    .then(({ response }) => {
      const data = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        dataPeriodOptions.value = data.data;
      }
    })
    .catch(error => {
      console.error('加载数据周期选项失败:', error);
      ElMessage.error('加载数据周期选项失败');
    });
}

defineExpose({ addInit, updateInit });
</script>

<style scoped>
/* 参数提示图标样式 */
.param-tip {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
