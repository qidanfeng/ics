<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>计费合同编辑</span>
        </div>
      </template>

      <!-- 头部表单 -->
      <el-form
        ref="headFormRef"
        :model="contractHead"
        :rules="headRules"
        size="small"
        label-width="120px"
        class="head-form"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input v-model="contractHead.contractCode" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="contractHead.contractName" placeholder="请输入合同名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同类型" prop="contractType">
              <el-select v-model="contractHead.contractType" placeholder="请选择合同类型" class="w-full">
                <el-option label="仓储合同" value="STORAGE" />
                <el-option label="运输合同" value="TRANSPORT" />
                <el-option label="综合合同" value="COMPREHENSIVE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商" prop="supplierId">
              <el-select
                v-model="contractHead.supplierId"
                placeholder="请选择供应商"
                class="w-full"
                filterable
              >
                <el-option
                  v-for="item in supplierOptions"
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
            <el-form-item label="货主" prop="projectId">
              <el-select
                v-model="contractHead.projectId"
                placeholder="请选择货主"
                class="w-full"
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
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseCode">
              <el-select
                v-model="contractHead.warehouseCode"
                placeholder="请选择仓库"
                class="w-full"
                filterable
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="有效期起" prop="effectiveDateStart">
              <el-date-picker
                v-model="contractHead.effectiveDateStart"
                type="date"
                placeholder="选择开始日期"
                value-format="YYYY-MM-DD"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效期止" prop="effectiveDateEnd">
              <el-date-picker
                v-model="contractHead.effectiveDateEnd"
                type="date"
                placeholder="选择结束日期"
                value-format="YYYY-MM-DD"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="contractHead.status" placeholder="请选择状态" class="w-full">
                <el-option label="草稿" value="DRAFT" />
                <el-option label="生效" value="EFFECTIVE" />
                <el-option label="失效" value="EXPIRED" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="税率" prop="taxRate">
              <el-input-number
                v-model="contractHead.taxRate"
                :precision="2"
                :min="0"
                :max="1"
                :step="0.01"
                size="small"
                class="w-full"
                placeholder="请输入税率(0-1)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账期(天)" prop="paymentPeriod">
              <el-input-number
                v-model="contractHead.paymentPeriod"
                :min="0"
                :step="1"
                size="small"
                class="w-full"
                placeholder="请输入账期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="contractHead.remarks"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 明细行表格 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>明细行信息</span>
          <el-button type="primary" size="small" :icon="Plus" @click="addDetailRow">新增明细</el-button>
        </div>
      </template>

      <el-table
        :data="contractDetails"
        border
        size="small"
        style="width: 100%"
        max-height="400"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column label="费项" min-width="180" align="center">
          <template #default="scope">
            <el-select
              v-model="scope.row.costItemCode"
              placeholder="请选择费项"
              size="small"
              class="w-full"
              @change="handleCostItemChange(scope.$index)"
            >
              <el-option
                v-for="item in costItemOptions"
                :key="item.costItemCode"
                :label="item.costItemName"
                :value="item.costItemCode">
                <span style="float: left">{{ item.costItemCode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.costItemName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="产品" min-width="180" align="center">
          <template #default="scope">
            <el-select
              v-model="scope.row.productId"
              placeholder="请选择产品"
              size="small"
              class="w-full"
              filterable
              @change="handleProductChange(scope.$index)"
            >
              <el-option
                v-for="item in productOptions"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
                <span style="float: left">{{ item.productNumber }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="计费规则" min-width="200" align="center">
          <template #default="scope">
            <el-select
              v-model="scope.row.billingRuleCode"
              placeholder="请选择计费规则"
              size="small"
              class="w-full"
              @change="handleBillingRuleChange(scope.$index)"
            >
              <el-option
                v-for="item in billingRuleOptions"
                :key="item.ruleCode"
                :label="item.ruleName"
                :value="item.ruleCode">
                <span style="float: left">{{ item.ruleCode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ruleName }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="税率" width="120" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.taxRate"
              :precision="2"
              :min="0"
              :max="1"
              :step="0.01"
              size="small"
              class="w-full"
              placeholder="税率"
            />
          </template>
        </el-table-column>

        <el-table-column label="账期(天)" width="120" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.paymentPeriod"
              :min="0"
              :step="1"
              size="small"
              class="w-full"
              placeholder="账期"
            />
          </template>
        </el-table-column>

        <el-table-column label="单价" width="120" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.unitPrice"
              :precision="2"
              :min="0"
              size="small"
              class="w-full"
              placeholder="请输入单价"
            />
          </template>
        </el-table-column>

        <el-table-column label="单位" width="100" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.unit" placeholder="单位" size="small" class="w-full">
              <el-option label="件" value="PIECE" />
              <el-option label="箱" value="BOX" />
              <el-option label="托" value="PALLET" />
              <el-option label="千克" value="KG" />
              <el-option label="立方米" value="M3" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="150" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.remarks" size="small" placeholder="请输入备注" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              :icon="Delete"
              style="color: #F56C6C"
              @click="deleteDetailRow(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="contractDetails.length === 0" style="text-align: center; padding: 20px; color: #909399;">
        暂无明细数据，请点击"新增明细"按钮添加
      </div>
    </el-card>

    <!-- 底部按钮 -->
    <div class="footer-buttons">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="success" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Delete } from '@element-plus/icons-vue';

defineOptions({ name: 'BillingContract' });

const headFormRef = ref();

// 合同头数据
const contractHead = reactive<any>({
  contractCode: 'HT202603050001',
  contractName: '',
  contractType: '',
  supplierId: '',
  supplierCode: '',
  supplierName: '',
  projectId: '',
  projectCode: '',
  projectName: '',
  warehouseCode: '',
  warehouseName: '',
  effectiveDateStart: '',
  effectiveDateEnd: '',
  status: 'DRAFT',
  taxRate: 0.13,
  paymentPeriod: 30,
  remarks: ''
});

// 合同明细数据
const contractDetails = ref<any[]>([]);

// 静态选项数据
const supplierOptions = ref([
  { supplierId: '1001', supplierCode: 'SUPPLIER001', supplierName: '优质供应商有限公司' },
  { supplierId: '1002', supplierCode: 'SUPPLIER002', supplierName: '快捷物流供应商' },
  { supplierId: '1003', supplierCode: 'SUPPLIER003', supplierName: '华东配送中心' },
  { supplierId: '1004', supplierCode: 'SUPPLIER004', supplierName: '华南供应链公司' },
  { supplierId: '1005', supplierCode: 'SUPPLIER005', supplierName: '北方仓储服务商' }
]);

const projectOptions = ref([
  { projectId: '2001', projectCode: 'PROJECT001', projectName: '京东自营项目' },
  { projectId: '2002', projectCode: 'PROJECT002', projectName: '天猫旗舰店项目' },
  { projectId: '2003', projectCode: 'PROJECT003', projectName: '拼多多官方店' },
  { projectId: '2004', projectCode: 'PROJECT004', projectName: '唯品会特卖项目' },
  { projectId: '2005', projectCode: 'PROJECT005', projectName: '抖音电商项目' }
]);

const warehouseOptions = ref([
  { warehouseCode: 'WH-BJ-001', warehouseName: '北京大兴仓' },
  { warehouseCode: 'WH-SH-001', warehouseName: '上海浦东仓' },
  { warehouseCode: 'WH-GZ-001', warehouseName: '广州白云仓' },
  { warehouseCode: 'WH-SZ-001', warehouseName: '深圳宝安仓' },
  { warehouseCode: 'WH-CD-001', warehouseName: '成都双流仓' }
]);

const costItemOptions = ref([
  { costItemCode: 'COST001', costItemName: '仓储保管费' },
  { costItemCode: 'COST002', costItemName: '装卸作业费' },
  { costItemCode: 'COST003', costItemName: '干线运输费' },
  { costItemCode: 'COST004', costItemName: '市内配送费' },
  { costItemCode: 'COST005', costItemName: '包装材料费' },
  { costItemCode: 'COST006', costItemName: '分拣作业费' },
  { costItemCode: 'COST007', costItemName: '贴标服务费' },
  { costItemCode: 'COST008', costItemName: '退货处理费' }
]);

const productOptions = ref([
  { productId: '3001', productNumber: 'PRD-20260001', productName: '高端智能手机' },
  { productId: '3002', productNumber: 'PRD-20260002', productName: '无线蓝牙耳机' },
  { productId: '3003', productNumber: 'PRD-20260003', productName: '智能手表' },
  { productId: '3004', productNumber: 'PRD-20260004', productName: '平板电脑' },
  { productId: '3005', productNumber: 'PRD-20260005', productName: '笔记本电脑' },
  { productId: '3006', productNumber: 'PRD-20260006', productName: '智能音箱' },
  { productId: '3007', productNumber: 'PRD-20260007', productName: '运动手环' },
  { productId: '3008', productNumber: 'PRD-20260008', productName: '充电宝' }
]);

const billingRuleOptions = ref([
  { ruleCode: 'BY_WEIGHT', ruleName: '按重量计费(元/千克)' },
  { ruleCode: 'BY_VOLUME', ruleName: '按体积计费(元/立方米)' },
  { ruleCode: 'BY_QUANTITY', ruleName: '按件数计费(元/件)' },
  { ruleCode: 'BY_DAY', ruleName: '按天数计费(元/天)' },
  { ruleCode: 'BY_PALLET', ruleName: '按托盘计费(元/托)' },
  { ruleCode: 'BY_AREA', ruleName: '按面积计费(元/平方米)' },
  { ruleCode: 'BY_ORDER', ruleName: '按订单计费(元/单)' }
]);

// 头部表单验证规则
const headRules = reactive({
  contractCode: [
    { required: true, message: '请输入合同编号', trigger: 'blur' }
  ],
  contractName: [
    { required: true, message: '请输入合同名称', trigger: 'blur' }
  ],
  contractType: [
    { required: true, message: '请选择合同类型', trigger: 'change' }
  ],
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  projectId: [
    { required: true, message: '请选择货主', trigger: 'change' }
  ],
  warehouseCode: [
    { required: true, message: '请选择仓库', trigger: 'change' }
  ],
  effectiveDateStart: [
    { required: true, message: '请选择有效期起始日期', trigger: 'change' }
  ],
  effectiveDateEnd: [
    { required: true, message: '请选择有效期截止日期', trigger: 'change' }
  ]
});

// 新增明细行
function addDetailRow() {
  contractDetails.value.push({
    costItemCode: '',
    costItemName: '',
    productId: '',
    productNumber: '',
    productName: '',
    billingRuleCode: '',
    billingRuleName: '',
    taxRate: contractHead.taxRate,
    paymentPeriod: contractHead.paymentPeriod,
    unitPrice: 0,
    unit: 'PIECE',
    remarks: ''
  });
}

// 删除明细行
function deleteDetailRow(index: number) {
  ElMessageBox.confirm('确认删除该明细行吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    contractDetails.value.splice(index, 1);
    ElMessage.success('删除成功');
  }).catch(() => {});
}

// 费项选择变化
function handleCostItemChange(index: number) {
  const costItem = costItemOptions.value.find(item => item.costItemCode === contractDetails.value[index].costItemCode);
  if (costItem) {
    contractDetails.value[index].costItemName = costItem.costItemName;
  }
}

// 产品选择变化
function handleProductChange(index: number) {
  const product = productOptions.value.find(item => item.productId === contractDetails.value[index].productId);
  if (product) {
    contractDetails.value[index].productNumber = product.productNumber;
    contractDetails.value[index].productName = product.productName;
  }
}

// 计费规则选择变化
function handleBillingRuleChange(index: number) {
  const rule = billingRuleOptions.value.find(item => item.ruleCode === contractDetails.value[index].billingRuleCode);
  if (rule) {
    contractDetails.value[index].billingRuleName = rule.ruleName;
  }
}

// 保存
function handleSave() {
  headFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (contractDetails.value.length === 0) {
        ElMessage.warning('请至少添加一条明细数据');
        return;
      }

      // 检查明细数据是否完整
      const incompleteRows = contractDetails.value.filter(row => !row.costItemCode || !row.productId || !row.billingRuleCode);
      if (incompleteRows.length > 0) {
        ElMessage.warning('请完整填写明细信息');
        return;
      }

      ElMessage.success('保存成功（演示模式）');
      console.log('合同头数据：', contractHead);
      console.log('合同明细数据：', contractDetails.value);
    } else {
      ElMessage.error('请完善合同基本信息');
      return false;
    }
  });
}

// 提交
function handleSubmit() {
  handleSave();
}

// 取消
function handleCancel() {
  ElMessageBox.confirm('确认取消编辑吗？未保存的数据将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.info('已取消');
    // 可以跳转到列表页或其他操作
  }).catch(() => {});
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 85px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-form {
  margin-bottom: 10px;
}

.detail-card {
  margin-top: 20px;
}

.footer-buttons {
  margin-top: 20px;
  text-align: center;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 4px;
}

.footer-buttons .el-button {
  min-width: 100px;
}
</style>
