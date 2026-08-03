<template>
  <el-dialog
    :title="title"
    custom-class="dialog_customWidth"
    top="5vh"
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
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
        <el-form-item label="送货仓库" prop="deliveryWarehouseCode">
          <el-select
            v-model="formData.deliveryWarehouseCode"
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
            v-model="formData.projectId"
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
        <el-form-item label="送货方式" prop="deliveryMethodCode">
          <el-select
            v-model="formData.deliveryMethodCode"
            placeholder="请选择送货方式"
            style="width: 100%"
            @change="deliveryMethodChangeHandle"
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

      <el-col :span="8" v-if="formData.deliveryMethodCode == 1">
        <el-form-item label="承运商" prop="carrierId">
          <el-select
            v-model="formData.carrierId"
            placeholder="请选择承运商"
            style="width: 100%"
            @change="carrierChangeHandle"
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
      <el-col :span="8">
        <el-form-item label="预计到仓日期" prop="estimatedDeliveryDate">
          <el-date-picker
            v-model="formData.estimatedDeliveryDate"
            type="date"
            placeholder="请选择预计到仓日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"  v-if="formData.deliveryMethodCode == 1">
        <el-form-item label="提货地址" prop="fromAddressId">
          <el-select
            size="small"
            v-model="formData.fromAddressName"
            filterable
            @change="fromAddressChangeHandle"
            reserve-keyword
            value-key="id"
            clearable
            style="width:100%"
            placeholder="地址名称">
            <el-option
              v-for="item in fromAddressList"
              :key="item.id"
              :label="item.name"
              :value="item">
              <span style="float: left">{{ item.code }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="formData.remarks"
            type="textarea"
            :rows="1"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 采购建议单明细表格 -->
    <el-form-item label="明细信息">
      <div style="margin-top: 10px;">
        <el-button type="primary" size="small" @click="addDetailRow">
          +
        </el-button>
      </div>
      <el-table
        ref="detailTableRef"
        :data="formData.detailList"
        row-key="index"
        :row-class-name="tableRowClassName"
        border
        size="small"
        show-summary
        :summary-method="getSummaries"
        max-height="450"
        style="width: 100%"
        @expand-change="queryLotAttributeValueByOrderDetailId"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column label="产品编码" min-width="150"  align="center">
          <template #default="scope">
            <el-input
              v-model="scope.row.productNumber"
              placeholder="输入产品编码按Tab搜索"
              @keydown.tab="searchProductByCode(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column label="产品名称" min-width="200"  align="center">
          <template #default="scope">
            <el-select
              v-model="scope.row.productName"
              filterable
              size="small"
              style="width:100%"
              remote
              value-key="productId"
              reserve-keyword
              placeholder="输入产品名称模糊搜索"
              :remote-method="(query) => debounceSearchProductByName(scope.row, scope.$index, query)"
              :loading="productCnNameLoading"
              @change="(value) => fillProductInfo(scope.row, value,scope.$index)">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item">
                <span style="float: left">{{ item.productNumber}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="订货数量" width="150"  align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.quantity"
              size="small"
              :min="0"
              controls-position="right"
              style="width: 100%"
              @change="calculateTotals(scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="unitDictionaryName" label="单位" min-width="100"  align="center">
          <template #default="scope">
            <el-select @change="calculateTotals(scope.$index)" size="small"
                       style="width: 100%" v-model="scope.row.unitDictionaryName" placeholder="单位选择">
              <el-option
                v-for="(item, index) in scope.row.packList"
                :key="index"
                :label="item.unitDictionaryName"
                :value="item.unitDictionaryName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column  type="expand" label="拓展字段" width="100">
          <template #default="{row}" >
            <div class="lot-attribute-container">
              <el-row :gutter="12">
                <el-col :span="6" v-for="(lotAttribute,index) in row.lotAttributeVos" :key="index" class="lot-attribute-item">
                  <div class="attribute-label">
                    <span class="label-text">{{lotAttribute.lotAttrLabel}}</span>
                    <span v-if="lotAttribute.required" class="required-mark">*</span>
                  </div>
                  <div class="attribute-control">
                    <el-input
                      size="small"
                      v-if="lotAttribute.lotAttrType == 'String'"
                      v-model="lotAttribute.lotAttrValue"
                      :placeholder="lotAttribute.lotAttrLabel"
                      clearable
                    ></el-input>

                    <el-select
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'Select'"
                      v-model="lotAttribute.lotAttrValue"
                      placeholder="请选择"
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in lotAttribute.lotAttrSelectOptions.split('#')"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>

                    <el-date-picker
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'yyyy-MM-dd'"
                      v-model="lotAttribute.lotAttrValue"
                      :format="lotAttribute.lotAttrType"
                      :value-format="lotAttribute.lotAttrType"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>

                    <el-date-picker
                      size="small"
                      v-else-if="lotAttribute.lotAttrType == 'yyyy-MM-dd HH:mm:ss'"
                      v-model="lotAttribute.lotAttrValue"
                      style="width: 100%"
                      :format="lotAttribute.lotAttrType"
                      :value-format="lotAttribute.lotAttrType"
                      type="datetime"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>

        <el-table-column  prop="weight" label="总重量(kg)" width="120"  align="center">
          <template #default="scope">
            <el-input
              v-model="scope.row.weight"
              size="small"
            />
          </template>
        </el-table-column>


        <el-table-column prop="volume" label="总体积(cm³)" width="120"  align="center">
          <template #default="scope">
            <el-input
              v-model="scope.row.volume"
              size="small"
              placeholder="请输入体积"
            />
          </template>
        </el-table-column>

        <el-table-column prop="totalPrice" label="总价" width="120"  align="center">
          <template #default="scope">
            <el-input
              v-model="scope.row.totalPrice"
              size="small"
              placeholder="请输入总价"
            />
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="150"  align="center">
          <template #default="scope">
            <el-input
              type="textarea"
              :rows="1"
              v-model="scope.row.remarks"
              size="small"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button
              type="text"
              style="color: #ff0000"
              size="small"
              @click="deleteDetailRow(scope.row.id,scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <div style="text-align: center; width: 100%;">
        <el-button @click="resetForm">重置</el-button>
        <el-button style="width:10%" type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </div>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, h } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import {
  save,
  update,
  getDetailListByOrderNumber,
  queryLotAttributeValueByOrderDetailId as queryLotAttributeValueByOrderDetailIdApi,
  deleteByIds
} from '@/service/api/purchase/suggestion';
import {
  getSupplierByClientId,
  getWarehouseBySupplierId,
  getProjectBySupplierAndWarehouseCode,
  fuzzyQueryProduct
} from '@/service/api/basic/product-price-config';
import { getProductPackByProductId } from '@/service/api/mdm/product';
import { getAddressVosByCustomerId } from '@/service/api/mdm/address';
import { queryLotAttributeByCustomerId as queryLotAttributeByCustomerIdApi } from '@/service/api/mdm/lot-attribute';

defineOptions({ name: 'UpdateOrAdd' });

const props = withDefaults(
  defineProps<{
    deliveryMethodOptions?: any[];
  }>(),
  {
    deliveryMethodOptions: () => []
  }
);

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const detailTableRef = ref<any>();

const dialogVisible = ref(false);
const title = ref('');
const submitLoading = ref(false);
const productCnNameLoading = ref(false);

// platform store 已移除 carriers，使用本地 ref 空数组保持 UI 结构
const carriers = ref<any[]>([]);

const fromAddressList = ref<any[]>([]);
const productList = ref<any[]>([]);
const lotAttributeVos = ref<any[]>([]);

const warehouseOptions = ref<any[]>([]);
const projectOptions = ref<any[]>([]);
const supplierOptions = ref<any[]>([]);
const supplierOptionsForSelect = ref<any[]>([]);

// 用于控制watch监听器的触发时机
const shouldTriggerWarehouseWatch = ref(false);
const shouldTriggerProjectWatch = ref(false);

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const formData = ref<any>({
  id: null,
  orderNumber: '',
  deliveryWarehouseCode: '',
  deliveryWarehouseName: '',
  supplierId: null,
  supplierCode: '',
  supplierName: '',
  clientId: null,
  clientCode: '',
  clientName: '',
  projectId: null,
  projectCode: '',
  projectName: '',
  fromAddressId: '',
  fromAddressName: '',
  fromAddressCode: '',
  documentTypeCode: '10',
  documentTypeName: '采购订单',
  deliveryMethodCode: '',
  deliveryMethodName: '',
  carrierId: null,
  carrierCode: '',
  carrierName: '',
  orderStatus: 10,
  orderStatusName: '待确认',
  estimatedDeliveryDate: '',
  remarks: '',
  detailList: []
});

// 表单验证规则
const rules = ref<FormRules>({
  deliveryWarehouseCode: [
    { required: true, message: '请选择送货仓库', trigger: 'change' }
  ],
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  projectId: [
    { required: true, message: '请选择货主', trigger: 'change' }
  ],
  deliveryMethodCode: [
    { required: true, message: '请选择送货方式', trigger: 'change' }
  ],
  estimatedDeliveryDate: [
    { required: true, message: '请选择预计到仓日期', trigger: 'change' }
  ],
  orderStatus: [
    { required: true, message: '请选择订单状态', trigger: 'change' }
  ]
});

// 监听供应商ID变化，自动加载仓库
watch(
  () => formData.value.supplierId,
  (newVal, oldVal) => {
    if (newVal && oldVal != newVal) {
      if (supplierOptions.value.length > 0) {
        const supplier = supplierOptions.value.find((supplier: any) => supplier.supplierId == newVal);
        if (supplier) {
          formData.value.supplierCode = supplier.supplierCode;
          formData.value.supplierName = supplier.supplierName;
        }
      }
      loadWarehouseOptions();
    }
  }
);

// 监听仓库编码变化，自动加载货主
watch(
  () => formData.value.deliveryWarehouseCode,
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
    if (warehouseOptions.value.length > 0) {
      const warehouse = warehouseOptions.value.find((warehouse: any) => warehouse.warehouseCode == newVal);
      if (warehouse) {
        formData.value.deliveryWarehouseName = warehouse.warehouseName;
      }
    }
    loadProjectOptions();
  }
);

// 监听货主ID变化，自动加载批次属性
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
    getFromAddressListByProjectIdHandle();
    if (formData.value.detailList && formData.value.detailList.length > 0) {
      resetDetailList();
    }
  }
);

async function addInit(dialogTitle: string, _formData: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  initFormData();
  try {
    // 启用watch监听器
    shouldTriggerWarehouseWatch.value = true;
    shouldTriggerProjectWatch.value = true;
    // 1. 加载供应商
    await loadSupplierOptions();
    await nextTick();
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('初始化失败，请重试');
  }
}

async function updateInit(dialogTitle: string, _formData: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  try {
    // 启用watch监听器
    shouldTriggerWarehouseWatch.value = true;
    shouldTriggerProjectWatch.value = true;
    formData.value = {
      id: _formData.id,
      orderNumber: _formData.orderNumber,
      deliveryWarehouseCode: _formData.deliveryWarehouseCode,
      deliveryWarehouseName: _formData.deliveryWarehouseName,
      supplierId: _formData.supplierId,
      supplierCode: _formData.supplierCode,
      supplierName: _formData.supplierName,
      clientId: _formData.clientId,
      clientCode: _formData.clientCode,
      clientName: _formData.clientName,
      projectId: _formData.projectId,
      projectCode: _formData.projectCode,
      projectName: _formData.projectName,
      fromAddressId: _formData.fromAddressId,
      fromAddressName: _formData.fromAddressName,
      fromAddressCode: _formData.fromAddressCode,
      deliveryMethodCode: _formData.deliveryMethodCode,
      deliveryMethodName: _formData.deliveryMethodName,
      carrierId: _formData.carrierId,
      carrierCode: _formData.carrierCode,
      carrierName: _formData.carrierName,
      estimatedDeliveryDate: _formData.estimatedDeliveryDate,
      remarks: _formData.remarks
    };
    // 1. 加载供应商
    await loadSupplierOptions();
    await loadOrderDetails();
    await loadProductPack();

    // 5. 确保DOM更新完成
    await nextTick();
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('初始化失败，请重试');
  }
}

async function addInitFromForecastRecord(dialogTitle: string, _formData: any) {
  dialogVisible.value = true;
  title.value = dialogTitle;
  try {
    formData.value = {
      id: null,
      orderNumber: '',
      forecastRecordIdList: _formData.forecastRecordIdList,
      deliveryWarehouseCode: _formData.deliveryWarehouseCode,
      deliveryWarehouseName: _formData.deliveryWarehouseName,
      supplierId: _formData.supplierId,
      supplierCode: _formData.supplierCode,
      supplierName: _formData.supplierName,
      clientId: _formData.clientId,
      clientCode: _formData.clientCode,
      clientName: _formData.clientName,
      projectId: _formData.projectId,
      projectCode: _formData.projectCode,
      projectName: _formData.projectName,
      fromAddressId: '',
      fromAddressName: '',
      fromAddressCode: '',
      documentTypeCode: '10',
      documentTypeName: '采购订单',
      deliveryMethodCode: '',
      deliveryMethodName: '',
      carrierId: null,
      carrierCode: '',
      carrierName: '',
      orderStatus: 10,
      orderStatusName: '待确认',
      estimatedDeliveryDate: '',
      remarks: _formData.remarks,
      // 前端页面新增订单的操作来源，2=通过库存预测记录创建采购订单
      frontAddOrderSource: 2,
      detailList: _formData.detailList
    };

    // 1. 加载供应商
    await loadSupplierOptions();
    loadProjectOptions();
    queryLotAttributeByCustomerId();
    getFromAddressListByProjectIdHandle();
    await loadProductPack();
    formData.value.detailList.forEach((item: any, index: number) => {
      calculateTotals(index);
    });

    // 5. 确保DOM更新完成
    await nextTick();
    // 启用watch监听器
    shouldTriggerWarehouseWatch.value = true;
    shouldTriggerProjectWatch.value = true;
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('初始化失败，请重试');
  }
}

function initFormData() {
  formData.value = {
    id: null,
    orderNumber: '',
    deliveryWarehouseCode: '',
    deliveryWarehouseName: '',
    supplierId: null,
    supplierCode: '',
    supplierName: '',
    clientId: null,
    clientCode: '',
    clientName: '',
    projectId: null,
    projectCode: '',
    projectName: '',
    fromAddressId: '',
    fromAddressName: '',
    fromAddressCode: '',
    documentTypeCode: '10',
    documentTypeName: '采购订单',
    deliveryMethodCode: '',
    deliveryMethodName: '',
    carrierId: null,
    carrierCode: '',
    carrierName: '',
    orderStatus: 10,
    orderStatusName: '待确认',
    estimatedDeliveryDate: '',
    remarks: '',
    detailList: []
  };
  shouldTriggerWarehouseWatch.value = false;
  shouldTriggerProjectWatch.value = false;
}

function getSummaries(param: any) {
  const { columns, data } = param;
  const sums: any[] = [];

  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '总计';
      return;
    }
    const values = data.map((item: any) => {
      const value = item[column.property];
      return parseFloat(value) || 0;
    });

    if (!values.every((value: number) => isNaN(value))) {
      // 根据列属性计算不同的汇总值
      switch (column.property) {
        case 'quantity':
          sums[index] = values.reduce((prev: number, curr: number) => prev + curr, 0);
          break;
        case 'weight':
          sums[index] = values.reduce((prev: number, curr: number) => prev + curr, 0);
          break;
        case 'volume':
          {
            const totalCm3 = values.reduce((prev: number, curr: number) => prev + curr, 0);
            const totalM3 = (totalCm3 / 1000000).toFixed(6);
            // 使用 h() 创建复杂的 DOM 结构
            sums[index] = h('div', {}, [
              h('div', {}, `${totalCm3} cm³`),
              h('div', {}, `${totalM3} m³`)
            ]);
          }
          break;
        case 'totalPrice':
          sums[index] = values.reduce((prev: number, curr: number) => prev + curr, 0);
          break;
      }
    } else {
      sums[index] = '';
    }
  });

  return sums;
}

/**
 *模糊搜索提货地址名称
 */
function getFromAddressListByProjectIdHandle() {
  if (!formData.value.projectId) {
    ElMessage.warning('请先选择货主！');
    return;
  }
  fromAddressList.value = [];

  getAddressVosByCustomerId(formData.value.projectId).then(({ response }) => {
    const data: any = response?.data;
    if (data && (data.code as unknown as number) === 0) {
      fromAddressList.value = data.data;
    }
  });
}

function fromAddressChangeHandle(item: any) {
  formData.value.fromAddressCode = item.code;
  formData.value.fromAddressName = item.name;
  formData.value.fromAddressId = item.id;
}

//货主发生改变时，需要清空明细信息
function resetDetailList() {
  formData.value.detailList = [];
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      submitLoading.value = true;
      if (formData.value.id) {
        update(formData.value)
          .then(({ response }) => {
            const data: any = response?.data;
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
        formData.value.clientId = platformStore.client?.id;
        formData.value.clientName = platformStore.client?.cnName;
        formData.value.clientCode = platformStore.client?.code;
        save(formData.value)
          .then(({ response }) => {
            const data: any = response?.data;
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

//加载订单明细
function loadOrderDetails() {
  return new Promise<void>((resolve, reject) => {
    getDetailListByOrderNumber(formData.value.orderNumber)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && (data.code as unknown as number) === 0) {
          formData.value.detailList = data.data;
        }
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

function loadProductPack() {
  for (let i = 0; i < formData.value.detailList.length; i++) {
    const element = formData.value.detailList[i];
    getProductPackByProductIdHandle(element);
  }
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields();
  initFormData();
  // 清空内部数据
  productList.value = [];
  formData.value.detailList = [];
  productCnNameLoading.value = false;
}

// 获取供应商列表
function loadSupplierOptions() {
  return new Promise<void>((resolve, reject) => {
    getSupplierByClientId(platformStore.client?.id)
      .then(({ response }) => {
        const data: any = response?.data;
        if (data && (data.code as unknown as number) === 0) {
          supplierOptions.value = data.data;
          supplierOptionsForSelect.value = supplierOptions.value;
          //如果只有一个供应商，直接选中，选中的同时 查询仓库
          if (supplierOptions.value.length == 1) {
            formData.value.supplierId = supplierOptions.value[0].supplierId;
            formData.value.supplierCode = supplierOptions.value[0].supplierCode;
            formData.value.supplierName = supplierOptions.value[0].supplierName;
          }
        }
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

//查询仓库信息
function loadWarehouseOptions() {
  if (!formData.value.supplierId) {
    return;
  }
  // 调用API获取仓库列表
  getWarehouseBySupplierId(platformStore.client?.id, formData.value.supplierId)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        warehouseOptions.value = data.data;
        //如果只有一个仓库，直接选中，同时查询货主信息
        if (warehouseOptions.value.length == 1) {
          formData.value.deliveryWarehouseCode = warehouseOptions.value[0].warehouseCode;
          formData.value.deliveryWarehouseName = warehouseOptions.value[0].warehouseName;
        }
      }
    })
    .catch(() => {});
}

//查询货主信息
function loadProjectOptions() {
  if (!formData.value.supplierId || !formData.value.deliveryWarehouseCode) {
    return;
  }
  // 调用API获取货主列表
  getProjectBySupplierAndWarehouseCode(
    platformStore.client?.id,
    formData.value.supplierId,
    formData.value.deliveryWarehouseCode
  )
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        projectOptions.value = data.data;
        //如果只有一个货主，则默认选中，同时查询货主配置的批属性信息
        if (projectOptions.value.length == 1) {
          formData.value.projectId = projectOptions.value[0].projectId;
          formData.value.projectCode = projectOptions.value[0].projectCode;
          formData.value.projectName = projectOptions.value[0].projectName;
        }
      }
    })
    .catch(() => {});
}

function carrierChangeHandle() {
  if (!formData.value.carrierId) {
    return;
  }
  const carrier = carriers.value.find((carrier: any) => carrier.id == formData.value.carrierId);
  if (carrier) {
    formData.value.carrierCode = carrier.code;
    formData.value.carrierName = carrier.fullName;
  }
}

function deliveryMethodChangeHandle() {
  const deliveryMethod = props.deliveryMethodOptions.find((item: any) => item.value == formData.value.deliveryMethodCode);
  if (deliveryMethod) {
    formData.value.deliveryMethodName = deliveryMethod.name;
  }
  updateFormValidationRules();
}

// 更新表单验证规则，根据送货方式动态控制承运商和提货地址的必填性
function updateFormValidationRules() {
  // 复制原始规则
  const newRules: FormRules = { ...rules.value };

  // 送货方式等于1时，承运商和提货地址必填
  if (formData.value.deliveryMethodCode === 1) {
    newRules.carrierId = [
      { required: true, message: '请选择承运商', trigger: 'change' }
    ];
    newRules.fromAddressId = [
      { required: true, message: '请选择提货地址', trigger: 'change' }
    ];
  } else {
    // 送货方式不等于1时，承运商和提货地址不必填
    newRules.carrierId = [];
    newRules.fromAddressId = [];
    formData.value.carrierId = null;
    formData.value.carrierCode = '';
    formData.value.carrierName = '';
    formData.value.fromAddressId = null;
    formData.value.fromAddressName = '';
    formData.value.fromAddressCode = '';
  }

  // 更新规则
  rules.value = newRules;

  // 清除相关字段的验证状态
  if (formRef.value) {
    formRef.value.clearValidate(['carrierId', 'fromAddressName']);
  }
}

// 表格行样式
function tableRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
  row.index = rowIndex;
  return '';
}

//根据订单明细ID查询批属性值
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

// 根据客户ID查询批次属性
function queryLotAttributeByCustomerId() {
  if (!formData.value.projectId) {
    return;
  }

  queryLotAttributeByCustomerIdApi(formData.value.projectId, 0)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        lotAttributeVos.value = data.data;
        if (formData.value.frontAddOrderSource === 2 && formData.value.detailList && formData.value.detailList.length > 0) {
          // 通过库存预测记录新增的采购订单给订单行赋批属性初始值
          formData.value.detailList.forEach((item: any) => {
            item.lotAttributeVos = structuredClone(lotAttributeVos.value);
          });
        }
      }
    })
    .catch(error => {
      console.error('查询客户批次属性失败:', error);
    });
}

// 新增明细行
function addDetailRow() {
  formData.value.detailList.push({
    id: null, // 使用时间戳作为临时ID
    productId: null,
    productNumber: '',
    productName: '',
    quantity: 0,
    unitDictionaryName: '',
    unitDictionaryId: '',
    volume: 0,
    weight: 0,
    totalPrice: 0,
    remarks: '',
    lotAttributeVos: lotAttributeVos.value ? JSON.parse(JSON.stringify(lotAttributeVos.value)) : [] // 深拷贝初始化扩展字段
  });
  detailTableRef.value?.doLayout();
}

// 删除明细行
function deleteDetailRow(id: any, index: number) {
  // 如果明细行有ID（已保存到数据库），需要调用API删除
  if (id) {
    ElMessageBox.confirm('确认删除该明细行？', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const idList = [id];
        deleteByIds(idList)
          .then(({ response }) => {
            const data: any = response?.data;
            if (data && (data.code as unknown as number) === 0) {
              ElMessage.success('删除成功');
              formData.value.detailList.splice(index, 1);
            } else {
              ElMessage.error(data.message || '删除失败');
            }
          })
          .catch(error => {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
          });
      })
      .catch(() => {});
  } else {
    // 没有ID（新增未保存的行），直接从前端删除
    formData.value.detailList.splice(index, 1);
  }
}

// 根据产品编码搜索产品
function searchProductByCode(row: any, index: number) {
  if (!row.productNumber) return;
  const param = {
    productNumber: row.productNumber,
    projectId: formData.value.projectId,
    warehouseCode: formData.value.deliveryWarehouseCode,
    supplierId: formData.value.supplierId,
    clientId: platformStore.client?.id
  };
  fuzzyQueryProduct(param).then(({ response }) => {
    const data: any = response?.data;
    if (data && (data.code as unknown as number) === 0 && data.data) {
      const product = data.data[0];
      if (product) {
        fillProductInfo(row, product, index);
      }
    } else if (data && (data.code as unknown as number) === 0 && !data.data) {
      ElMessage.warning('该货主下未找到产品[' + row.productNumber + ']的相关信息，请确认后重试');
      return;
    }
  });
}

// 根据产品名称模糊搜索产品（防抖）
function debounceSearchProductByName(row: any, index: number, query: string) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    searchProductByName(row, index, query);
  }, 500);
}

// 根据产品名称搜索产品
function searchProductByName(row: any, _index: number, query: string) {
  if (!query) return;
  // 根据输入的产品名称，模糊查找产品编码+名称
  if (!formData.value.projectId) {
    ElMessage.warning('请录入货主再进行查询');
    return;
  }

  productList.value = [];
  productCnNameLoading.value = true;
  const param = {
    productName: query,
    projectId: formData.value.projectId,
    warehouseCode: formData.value.deliveryWarehouseCode,
    supplierId: formData.value.supplierId,
    clientId: platformStore.client?.id
  };

  fuzzyQueryProduct(param)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        productList.value = data.data;
      }
      productCnNameLoading.value = false;
    })
    .catch(() => {
      productCnNameLoading.value = false;
    });
}

//根据产品查询包装信息
function getProductPackByProductIdHandle(row: any) {
  getProductPackByProductId(row.productId)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        row.packList = data.data;
      }

      if (data && data.data && data.data.length == 1) {
        row.unitDictionaryName = row.packList[0].unitDictionaryName;
        row.unitDictionaryId = row.packList[0].unitDictionaryId;
      }

      if (formData.value.frontAddOrderSource === 2 && row.quantity > 0 && row.unitDictionaryId && row.weight === null) {
        // 通过库存预测生成采购建议单，初始化数据时计算重量、体积
        const calculateIndexArr: number[] = [];
        formData.value.detailList.forEach((item: any, index: number) => {
          if (row.productId === item.productId) {
            calculateIndexArr.push(index);
          }
        });
        calculateIndexArr.forEach(item => calculateTotals(item));
      }
    })
    .catch(() => {});
}

// 填充产品信息
function fillProductInfo(row: any, product: any, index: number) {
  row.productId = product.productId;
  row.productNumber = product.productNumber;
  row.productName = product.productName;
  getProductPackByProductIdHandle(row);
  calculateTotals(index);
}

// 计算总重量和总体积
function calculateTotals(index: number) {
  const orderDetail = formData.value.detailList[index];
  if (!orderDetail.packList || orderDetail.packList.length == 0) {
    return;
  }
  const quantity = parseFloat(orderDetail.quantity);
  if (quantity <= 0) {
    return;
  }
  // 计算毛重、净重、体积
  formData.value.detailList[index].weight = 0;
  formData.value.detailList[index].volume = 0;
  for (let i = 0; i < orderDetail.packList.length; i++) {
    const item = orderDetail.packList[i];
    if (item.unitDictionaryName === orderDetail.unitDictionaryName) {
      orderDetail.productPackId = item.id;
      orderDetail.unitDictionaryId = item.unitDictionaryId;
      item.volume = (item.caseHeight ? item.caseHeight : 0) * (item.caseLength ? item.caseLength : 0) * (item.caseWidth ? item.caseWidth : 0);
      orderDetail.weight = ((item.grossWeight ? item.grossWeight : 0) * (quantity ? quantity : 0)).toFixed(2);
      orderDetail.volume = ((item.volume ? item.volume : 0) * (quantity ? quantity : 0)).toFixed(2);
    }
  }
}

function supplierFilterHandle(val: string) {
  if (val) {
    supplierOptionsForSelect.value = supplierOptions.value.filter((item: any) => {
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

defineExpose({ addInit, updateInit, addInitFromForecastRecord });
</script>

<style scoped>
/* 扩展字段容器样式 - 简化版 */
.lot-attribute-container {
  padding: 12px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
}

/* 扩展字段项样式 */
.lot-attribute-item {
  margin-bottom: 12px;
}

/* 标签样式 */
.attribute-label {
  margin-bottom: 6px;
}

.label-text {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.required-mark {
  color: #f56c6c;
  font-size: 12px;
  margin-left: 2px;
}

/* 控件样式 */
.attribute-control {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .lot-attribute-item {
    width: 100%;
  }
}
</style>
