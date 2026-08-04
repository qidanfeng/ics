<template>
  <el-dialog
    title="选择库存"
    v-model="dialogVisible"
    width="95%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div class="inventory-selection">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            size="small"
            v-model="searchForm.productNumber"
            placeholder="请输入产品编码"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchForm.productName"
            filterable
            size="small"
            class="w-full"
            remote
            clearable
            value-key="id"
            reserve-keyword
            placeholder="输入产品名称模糊搜索"
            :remote-method="(query: string) => debounceSearchProductByName(query)"
            :loading="productCnNameLoading"
            @change="(value: any) => fillProductInfo(value)"
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.productCnName"
              :value="item"
            >
              <span style="float: left">{{ item.productNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productCnName }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr01Value" placeholder="请输入批次属性1" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr02Value" placeholder="请输入批次属性2" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr03Value" placeholder="请输入批次属性3" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr04Value" placeholder="请输入批次属性4" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr05Value" placeholder="请输入批次属性5" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr06Value" placeholder="请输入批次属性6" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr07Value" placeholder="请输入批次属性7" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr08Value" placeholder="请输入批次属性8" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr09Value" placeholder="请输入批次属性9" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr10Value" placeholder="请输入批次属性10" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr11Value" placeholder="请输入批次属性11" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr12Value" placeholder="请输入批次属性12" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr13Value" placeholder="请输入批次属性13" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr14Value" placeholder="请输入批次属性14" clearable />
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="searchForm.lotAttr15Value" placeholder="请输入批次属性15" clearable />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
          <el-button size="small" @click="handleResetSearch">重置</el-button>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <div class="operation-buttons">
        <el-button type="primary" size="small" @click="handleConfirm" :disabled="!(totalReturnQty > 0)">
          确定选择
        </el-button>
        <el-button size="small" @click="handleClearAll">清空</el-button>
        <span style="margin-left: 10px; color: #409eff;">
          已选择 {{ selectedRows.length }} 项，退货数量：{{ totalReturnQtyWithReceiveUnit }} 收货单位 | {{ totalReturnQtyWithInventoryUnit }} 库存单位
        </span>
      </div>

      <!-- 库存列表 -->
      <div>
        <el-table
          ref="inventoryTableRef"
          :data="availableInventoryList"
          border
          size="small"
          stripe
          :height="550"
          style="width: 100%"
          v-loading="tableLoading"
          element-loading-text="数据加载中..."
          @select="handleSelectionChange"
          @select-all="handleSelectionAllChange"
        >
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column prop="productNumber" label="产品编码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
          <el-table-column label="可用库存(库存单位)" min-width="130">
            <template #default="scope">
              {{ scope.row.availableQty + scope.row.unitDictionaryName }}
            </template>
          </el-table-column>
          <el-table-column label="可用库存(收货单位)" min-width="130">
            <template #default="scope">
              {{ calculateQuantityToUnitForShow(scope.row.availableQty, scope.row.receiveProductPackVo, scope.row.unitDictionaryName) }}
            </template>
          </el-table-column>
          <el-table-column label="已退货数量" width="100">
            <template #default="scope">
              {{ calculateQuantityToUnitForShow(getReturnedQty(scope.row), scope.row.receiveProductPackVo, scope.row.unitDictionaryName) }}
            </template>
          </el-table-column>
          <el-table-column label="退货数量(库存单位)" width="200">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.returnQtyWithInventoryUnit"
                :min="0"
                style="width: 100%"
                :max="getReturnQtyWithInventoryUnitMaxLimit(scope.row)"
                size="small"
                :disabled="getRemainingQty(scope.row) <= 0"
                @change="handleReturnQtyChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="退货数量(收货单位)" width="200">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.returnQtyWithReceiveUnit"
                :min="0"
                style="width: 100%"
                :max="getReturnQtyWithReceiveUnitMaxLimit(scope.row)"
                size="small"
                :disabled="getRemainingQty(scope.row) < scope.row.receiveProductPackVo.number || scope.row.receiveProductPackLossFlag || scope.row.receiveProductPackVo.number === 1"
                @change="handleReturnQtyChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="剩余数量" width="100">
            <template #default="scope">
              {{ calculateQuantityToUnitForShow(getRemainingQty(scope.row) - scope.row.returnQty, scope.row.receiveProductPackVo, scope.row.unitDictionaryName) }}
            </template>
          </el-table-column>
          <!-- 批次属性列 -->
          <el-table-column prop="lotAttr01Value" label="生产日期" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr02Value" label="过期日期" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr03Value" label="入库日期" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr04Value" label="质量状态" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr05Value" label="批次属性5" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr06Value" label="批次属性6" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr07Value" label="批次属性7" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr08Value" label="批次属性8" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr09Value" label="批次属性9" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr10Value" label="批次属性10" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr11Value" label="批次属性11" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr12Value" label="批次属性12" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr13Value" label="批次属性13" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr14Value" label="批次属性14" min-width="120" show-overflow-tooltip />
          <el-table-column prop="lotAttr15Value" label="批次属性15" min-width="120" show-overflow-tooltip />
        </el-table>

        <!-- 分页组件 -->
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            style="margin-top: 10px; text-align: right;"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { queryInventory } from '@/service/api/inventory/wms-inventory';
import { queryEntityByProductCnNameAndCustomerId } from '@/service/api/mdm/product';

defineOptions({ name: 'ReturnSupplierSelectInventory' });

const props = withDefaults(
  defineProps<{
    detailList?: any[];
    returnWarehouse?: any;
    project?: any;
  }>(),
  {
    detailList: () => [],
    returnWarehouse: () => ({ code: '', name: '' }),
    project: () => ({ id: null, name: '', code: '' })
  }
);

const emit = defineEmits(['confirm', 'cancel', 'close']);

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const productList = ref<any[]>([]);
const productCnNameLoading = ref(false);
const dialogVisible = ref(false);
const inventoryList = ref<any[]>([]);
const tableLoading = ref(false);
const searchForm = reactive<any>({
  productNumber: '',
  productName: '',
  lotAttr01Value: '',
  lotAttr02Value: '',
  lotAttr03Value: '',
  lotAttr04Value: '',
  lotAttr05Value: '',
  lotAttr06Value: '',
  lotAttr07Value: '',
  lotAttr08Value: '',
  lotAttr09Value: '',
  lotAttr10Value: '',
  lotAttr11Value: '',
  lotAttr12Value: '',
  lotAttr13Value: '',
  lotAttr14Value: '',
  lotAttr15Value: ''
});

const returnQtyMap = ref<Record<string, number>>({});
const selectedRows = ref<any[]>([]);
const totalReturnQty = ref(0);
const totalReturnQtyWithReceiveUnit = ref(0);
const totalReturnQtyWithInventoryUnit = ref(0);
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const inventoryTableRef = ref<any>();

// 可选择的库存列表
const availableInventoryList = computed(() => {
  if (!inventoryList.value) {
    return [];
  }
  return inventoryList.value.map((item: any) => {
    const returnQty = returnQtyMap.value[item.uniqueCode] || 0;
    // 无收货单位时特殊处理
    if (!item.receiveProductPackVo) {
      item.receiveProductPackLossFlag = true;
      item.receiveProductPackVo = {
        unitDictionaryId: item.unitDictionaryId,
        unitDictionaryName: item.unitDictionaryName,
        number: 1
      };
    }
    const returnQtyTranUnitObj: any = calculateQuantityToUnit(returnQty, item.receiveProductPackVo);
    const returnQtyWithReceiveUnit = returnQtyTranUnitObj.quantityWithReceiveUnit;
    const returnQtyWithInventoryUnit = returnQtyTranUnitObj.quantityWithInventoryUnit;

    return {
      ...item,
      returnQty: returnQty,
      returnQtyWithReceiveUnit: returnQtyWithReceiveUnit,
      returnQtyWithInventoryUnit: returnQtyWithInventoryUnit,
      remainingQty: getRemainingQty(item),
      returnedQty: getReturnedQty(item)
    };
  });
});

/** 初始化 */
function init(visible: boolean) {
  dialogVisible.value = visible;
  nextTick(() => {
    returnQtyMap.value = {};
    selectedRows.value = [];
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    pagination.total = 0;
    loadInventoryList();
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
  if (!props.project.id) {
    ElMessage.warning('请录入货主再进行查询');
    return;
  }
  productList.value = [];
  productCnNameLoading.value = true;
  queryEntityByProductCnNameAndCustomerId(query, props.project.id)
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

/** 填充产品信息 */
function fillProductInfo(product: any) {
  searchForm.productId = product.id;
  searchForm.productNumber = product.productNumber;
  searchForm.productName = product.productCnName;
}

/** 对话框关闭时的处理 */
function handleDialogClose() {
  dialogVisible.value = false;
  emit('close');
}

/** 取消选择 */
function handleCancel() {
  dialogVisible.value = false;
  emit('cancel');
}

/** 确认选择 */
function handleConfirm() {
  const selectedItems: any[] = [];

  // 处理复选框选中的行
  selectedRows.value.forEach(row => {
    const returnQty = returnQtyMap.value[row.uniqueCode] || 0;
    if (returnQty > 0) {
      selectedItems.push({
        ...row,
        productNumber: row.productNumber,
        productName: row.productName,
        specification: row.specification || '',
        warehouseCode: row.warehouseCode || props.returnWarehouse.code,
        warehouseName: row.warehouseName || props.returnWarehouse.name,
        availableQty: row.availableQty,
        returnQty: returnQty,
        quantity: returnQty
      });
    }
  });

  // 处理手动输入退货数量的行
  availableInventoryList.value
    .filter(item => item.returnQty > 0 && !selectedRows.value.some(row => row.uniqueCode === item.uniqueCode))
    .forEach(item => {
      selectedItems.push({
        ...item,
        productNumber: item.productNumber,
        productName: item.productName,
        availableQty: item.availableQty,
        returnQty: item.returnQty,
        quantity: item.returnQty
      });
    });

  // 累加现有的明细和新的明细
  const updatedDetails = [...props.detailList];

  selectedItems.forEach(newItem => {
    const existingIndex = updatedDetails.findIndex(detail => detail.uniqueCode === newItem.uniqueCode);
    let quantityForDetailNew = newItem.quantity;
    let matchUpdatedDetail = newItem;
    if (existingIndex >= 0) {
      matchUpdatedDetail = updatedDetails[existingIndex];
      quantityForDetailNew = matchUpdatedDetail.quantity * matchUpdatedDetail.unitMatchInventoryNumber + newItem.quantity;
    } else {
      updatedDetails.push(newItem);
    }

    const availableQtyTranUnitObj: any = calculateQuantityToUnit(newItem.availableQty, newItem.receiveProductPackVo);
    const returnQtyTranUnitObj: any = calculateQuantityToUnit(quantityForDetailNew, newItem.receiveProductPackVo);
    let returnOrderDetailQuantity = quantityForDetailNew;
    let returnOrderDetailUnitId = newItem.unitDictionaryId;
    let returnOrderDetailUnitName = newItem.unitDictionaryName;
    let unitMatchInventoryNumber = 1;
    let returnOrderDetailQuantityMaxLimit = newItem.availableQty;
    if (returnQtyTranUnitObj.quantityWithInventoryUnit === 0) {
      returnOrderDetailQuantity = returnQtyTranUnitObj.quantityWithReceiveUnit;
      returnOrderDetailUnitId = newItem.receiveProductPackVo.unitDictionaryId;
      returnOrderDetailUnitName = newItem.receiveProductPackVo.unitDictionaryName;
      returnOrderDetailQuantityMaxLimit = availableQtyTranUnitObj.quantityWithReceiveUnit;
      unitMatchInventoryNumber = newItem.receiveProductPackVo.number;
    }
    matchUpdatedDetail.quantity = returnOrderDetailQuantity;
    matchUpdatedDetail.unitDictionaryId = returnOrderDetailUnitId;
    matchUpdatedDetail.unitDictionaryName = returnOrderDetailUnitName;
    matchUpdatedDetail.quantityMaxLimit = returnOrderDetailQuantityMaxLimit;
    matchUpdatedDetail.unitMatchInventoryNumber = unitMatchInventoryNumber;
  });

  emit('confirm', updatedDetails);
  dialogVisible.value = false;
}

/** 获取退货的总量 */
function getReturnedTotalQty() {
  totalReturnQty.value = 0;
  totalReturnQtyWithReceiveUnit.value = 0;
  totalReturnQtyWithInventoryUnit.value = 0;
  availableInventoryList.value.forEach(item => {
    if (item.returnQty > 0) {
      totalReturnQty.value += item.returnQty;
      totalReturnQtyWithReceiveUnit.value += item.returnQtyWithReceiveUnit;
      totalReturnQtyWithInventoryUnit.value += item.returnQtyWithInventoryUnit;
    }
  });
}

/** 获取已退货的数量 */
function getReturnedQty(item: any) {
  const existingDetail = props.detailList.find(detail => detail.uniqueCode === item.uniqueCode);
  if (existingDetail) {
    const unitMatchInventoryNumber = getUnitMatchInventoryNumber(item, existingDetail);
    return existingDetail.quantity * unitMatchInventoryNumber;
  }
  return 0;
}

function getUnitMatchInventoryNumber(item: any, existingDetail: any) {
  if (item.unitDictionaryId === existingDetail.unitDictionaryId) {
    return 1;
  } else if (item.receiveProductPackVo.unitDictionaryId === existingDetail.unitDictionaryId) {
    return item.receiveProductPackVo.number;
  } else {
    ElMessage.error('未匹配到包装单位');
    throw new Error('未匹配到包装单位');
  }
}

/** 获取剩余数量 */
function getRemainingQty(item: any) {
  const existingDetail = props.detailList.find(detail => detail.uniqueCode === item.uniqueCode);
  if (existingDetail) {
    const unitMatchInventoryNumber = getUnitMatchInventoryNumber(item, existingDetail);
    return Math.max(0, item.availableQty - existingDetail.quantity * unitMatchInventoryNumber);
  }
  return item.availableQty;
}

/** 退货数量变化处理 */
function handleReturnQtyChange(item: any) {
  const returnQtyWithReceiveUnit = item.returnQtyWithReceiveUnit;
  let returnQty = item.returnQtyWithInventoryUnit;
  if (returnQtyWithReceiveUnit) {
    const returnQtyByReceiveTrans = returnQtyWithReceiveUnit * item.receiveProductPackVo.number;
    returnQty += returnQtyByReceiveTrans;
  }
  item.returnQty = returnQty;
  returnQtyMap.value[item.uniqueCode] = item.returnQty;
  getReturnedTotalQty();
}

function getReturnQtyWithReceiveUnitMaxLimit(row: any) {
  if (row.receiveProductPackLossFlag || row.receiveProductPackVo.number === 1) {
    return 0;
  }
  return Math.floor((getRemainingQty(row) - row.returnQtyWithInventoryUnit) / row.receiveProductPackVo.number);
}

function getReturnQtyWithInventoryUnitMaxLimit(row: any) {
  if (row.receiveProductPackLossFlag || row.receiveProductPackVo.number === 1) {
    return getRemainingQty(row);
  }
  return Math.min(getRemainingQty(row) - row.returnQtyWithReceiveUnit * row.receiveProductPackVo.number, row.receiveProductPackVo.number - 1);
}

/** 计算数量到单位的转换 */
function calculateQuantityToUnit(quantity: number, packUnitNumberVo: any) {
  if (!packUnitNumberVo || packUnitNumberVo.number === 1) {
    return { quantityWithReceiveUnit: 0, quantityWithInventoryUnit: quantity };
  }
  const packNumber = Number(packUnitNumberVo.number) || 1;
  const spec = Math.floor(quantity / packNumber);
  const remainder = quantity - spec * packNumber;
  if (Math.abs(remainder) < 0.000001) {
    return { quantityWithReceiveUnit: spec, quantityWithInventoryUnit: 0 };
  }
  return { quantityWithReceiveUnit: spec, quantityWithInventoryUnit: remainder };
}

/** 计算数量到单位的转换-展示用 */
function calculateQuantityToUnitForShow(quantity: number, packUnitNumberVo: any, inventoryUnitName: string) {
  if (!packUnitNumberVo || packUnitNumberVo.number === 1) {
    return formatNumber(quantity) + inventoryUnitName;
  }
  const packNumber = Number(packUnitNumberVo.number) || 1;
  const spec = Math.floor(quantity / packNumber);
  const remainder = quantity - spec * packNumber;
  if (Math.abs(remainder) < 0.000001) {
    return formatNumber(spec) + packUnitNumberVo.unitDictionaryName;
  }
  return formatNumber(spec) + packUnitNumberVo.unitDictionaryName + formatNumber(remainder) + inventoryUnitName;
}

/** 格式化数字 */
function formatNumber(value: number) {
  const num = Number(value);
  if (Number.isInteger(num)) {
    return num.toString();
  }
  let str = num.toFixed(4);
  str = str.replace(/(\.\d*?)0+$/, '$1');
  str = str.replace(/\.$/, '');
  return str;
}

/** 复选框选择变化 */
function handleSelectionChange(selection: any[], row: any) {
  if (selection.length > 0) {
    for (let i = 0; i < selection.length; i++) {
      const item = selection[i];
      if (item.uniqueCode == row.uniqueCode) {
        const remainingQty = getRemainingQty(row);
        returnQtyMap.value[row.uniqueCode] = remainingQty;
        const remainingQtyTransUnitObj: any = calculateQuantityToUnit(remainingQty, row.receiveProductPackVo);
        row.returnQty = remainingQty;
        row.returnQtyWithReceiveUnit = remainingQtyTransUnitObj.quantityWithReceiveUnit;
        row.returnQtyWithInventoryUnit = remainingQtyTransUnitObj.quantityWithInventoryUnit;
        selectedRows.value = selection;
        getReturnedTotalQty();
        return;
      }
    }
  }
  delete returnQtyMap.value[row.uniqueCode];
  row.returnQty = 0;
  row.returnQtyWithReceiveUnit = 0;
  row.returnQtyWithInventoryUnit = 0;
  selectedRows.value = selection;
  getReturnedTotalQty();
}

/** 全选变化 */
function handleSelectionAllChange(selection: any[]) {
  if (selection.length == 0) {
    returnQtyMap.value = {};
    selectedRows.value.forEach(row => {
      row.returnQty = 0;
      row.returnQtyWithReceiveUnit = 0;
      row.returnQtyWithInventoryUnit = 0;
    });
  }
  selection.forEach(row => {
    const remainingQty = getRemainingQty(row);
    returnQtyMap.value[row.uniqueCode] = remainingQty;
    const remainingQtyTransUnitObj: any = calculateQuantityToUnit(remainingQty, row.receiveProductPackVo);
    row.returnQty = remainingQty;
    row.returnQtyWithReceiveUnit = remainingQtyTransUnitObj.quantityWithReceiveUnit;
    row.returnQtyWithInventoryUnit = remainingQtyTransUnitObj.quantityWithInventoryUnit;
  });
  selectedRows.value = selection;
  getReturnedTotalQty();
}

/** 清空选择 */
function handleClearAll() {
  selectedRows.value = [];
  availableInventoryList.value.forEach(item => {
    returnQtyMap.value[item.uniqueCode] = 0;
    item.returnQty = 0;
    item.returnQtyWithReceiveUnit = 0;
    item.returnQtyWithInventoryUnit = 0;
  });
  getReturnedTotalQty();
  inventoryTableRef.value?.clearSelection();
}

/** 搜索库存 */
function handleSearch() {
  loadInventoryList();
}

/** 重置搜索条件 */
function handleResetSearch() {
  searchForm.productNumber = '';
  searchForm.productName = '';
  searchForm.lotAttr01Value = '';
  searchForm.lotAttr02Value = '';
  searchForm.lotAttr03Value = '';
  searchForm.lotAttr04Value = '';
  searchForm.lotAttr05Value = '';
  searchForm.lotAttr06Value = '';
  searchForm.lotAttr07Value = '';
  searchForm.lotAttr08Value = '';
  searchForm.lotAttr09Value = '';
  searchForm.lotAttr10Value = '';
  searchForm.lotAttr11Value = '';
  searchForm.lotAttr12Value = '';
  searchForm.lotAttr13Value = '';
  searchForm.lotAttr14Value = '';
  searchForm.lotAttr15Value = '';
  loadInventoryList();
}

/** 加载库存列表 */
function loadInventoryList() {
  tableLoading.value = true;
  const param = {
    warehouseCode: props.returnWarehouse.code,
    projectId: props.project.id,
    productNumber: searchForm.productNumber,
    productName: searchForm.productName,
    page: pagination.currentPage,
    limit: pagination.pageSize,
    lotAttr01Value: searchForm.lotAttr01Value,
    lotAttr02Value: searchForm.lotAttr02Value,
    lotAttr03Value: searchForm.lotAttr03Value,
    lotAttr04Value: searchForm.lotAttr04Value,
    lotAttr05Value: searchForm.lotAttr05Value,
    lotAttr06Value: searchForm.lotAttr06Value,
    lotAttr07Value: searchForm.lotAttr07Value,
    lotAttr08Value: searchForm.lotAttr08Value,
    lotAttr09Value: searchForm.lotAttr09Value,
    lotAttr10Value: searchForm.lotAttr10Value,
    lotAttr11Value: searchForm.lotAttr11Value,
    lotAttr12Value: searchForm.lotAttr12Value,
    lotAttr13Value: searchForm.lotAttr13Value,
    lotAttr14Value: searchForm.lotAttr14Value,
    lotAttr15Value: searchForm.lotAttr15Value
  };

  queryInventory(param)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        const apiInventoryList = data.data.list || [];
        if (data.data.totalCount) {
          pagination.total = data.data.totalCount;
        }
        inventoryList.value = apiInventoryList.map((item: any) => {
          const availableQty = item.quantity;
          return {
            uniqueCode: item.uniqueCode,
            productId: item.productId,
            productNumber: item.productNumber,
            productName: item.productName,
            warehouseCode: item.warehouseCode,
            projectId: props.project.id,
            projectName: props.project.name,
            availableQty: availableQty > 0 ? availableQty : 0,
            unitDictionaryId: item.unitDictionaryId,
            unitDictionaryName: item.unitDictionaryName,
            receiveProductPackVo: item.receiveProductPackVo,
            lotAttr01Value: item.lotAttr01Value,
            lotAttr02Value: item.lotAttr02Value,
            lotAttr03Value: item.lotAttr03Value,
            lotAttr04Value: item.lotAttr04Value,
            lotAttr05Value: item.lotAttr05Value,
            lotAttr06Value: item.lotAttr06Value,
            lotAttr07Value: item.lotAttr07Value,
            lotAttr08Value: item.lotAttr08Value,
            lotAttr09Value: item.lotAttr09Value,
            lotAttr10Value: item.lotAttr10Value,
            lotAttr11Value: item.lotAttr11Value,
            lotAttr12Value: item.lotAttr12Value,
            lotAttr13Value: item.lotAttr13Value,
            lotAttr14Value: item.lotAttr14Value,
            lotAttr15Value: item.lotAttr15Value
          };
        });
      } else {
        inventoryList.value = [];
        pagination.total = 0;
        ElMessage.warning('未查询到库存数据');
      }
    })
    .catch(error => {
      console.error('API调用失败:', error);
      inventoryList.value = [];
      pagination.total = 0;
      ElMessage.error('库存查询失败，请稍后重试');
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

/** 分页大小变化 */
function handleSizeChange(val: number) {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  loadInventoryList();
}

/** 当前页变化 */
function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  loadInventoryList();
}

defineExpose({ init });
</script>

<style scoped>
.inventory-selection {
  height: 700px;
}

.operation-buttons {
  margin-top: 10px;
}

.el-dialog {
  min-width: 1200px;
  max-width: 95vw;
}
</style>
