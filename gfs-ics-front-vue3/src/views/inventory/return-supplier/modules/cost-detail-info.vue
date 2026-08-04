<template>
  <el-dialog
    title="费用明细"
    width="90%"
    top="20vh"
    :close-on-click-modal="false"
    v-model="visible"
    :append-to-body="true"
    @close="closeHandle"
  >
    <el-table
      :data="tableData"
      border
      size="small"
      style="width: 100%"
      row-key="index"
      height="auto"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="productNumber" label="产品编码" min-width="120" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center" />
      <el-table-column prop="quantity" label="数量" width="100" align="center" />
      <el-table-column prop="unitPrice" label="单价" width="100" align="center" />
      <el-table-column prop="costPrice" label="金额" width="130" align="center">
        <template #default="scope">
          <span v-if="!scope.row.editing || scope.row.lineNumber">{{ scope.row.costPrice }}</span>
          <el-input-number v-else v-model="scope.row.costPrice" size="small" :min="0" :precision="2" :controls="false" style="width: 100%" />
        </template>
      </el-table-column>
      <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <div v-if="!scope.row.lineNumber">
            <el-button v-if="hasAuth('ics:returnSupplier:costDetailInfo:edit') && !scope.row.editing" size="small" type="text" @click="editRow(scope.row)">修改</el-button>
            <el-button v-if="hasAuth('ics:returnSupplier:costDetailInfo:edit') && scope.row.editing" size="small" type="text" @click="saveRow(scope.row)">保存</el-button>
            <el-button v-if="hasAuth('ics:returnSupplier:costDetailInfo:delete')" size="small" type="text" class="delete-btn" @click="deleteRow(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth } from '@/hooks/business/auth';
import { billUpdate, billDelete, billSave } from '@/service/api/inventory/return-supplier';

defineOptions({ name: 'ReturnSupplierCostDetailInfo' });

const { hasAuth } = useAuth();

const emit = defineEmits(['refreshData']);

const visible = ref(false);
const changedData = ref(false);
const tableData = ref<any[]>([]);
const orderData = ref<any>({});
const lotAttributeVos = ref<any[]>([]);

/** 初始化费用详情数据 */
function init(data: any) {
  tableData.value = data.detailList;
  tableData.value.forEach((item: any, idx: number) => {
    item.index = idx + 1;
  });
  visible.value = true;
  changedData.value = false;
}

/** 关闭弹窗处理 */
function closeHandle() {
  visible.value = false;
  if (changedData.value) {
    emit('refreshData');
  }
}

/** 编辑行 */
function editRow(row: any) {
  row.editing = true;
  nextTick(() => {
    // 强制更新
    tableData.value = [...tableData.value];
  });
}

/** 保存行 */
function saveRow(row: any) {
  row.editing = false;
  let api: any = null;
  if (row.id) {
    api = billUpdate([row]);
  } else {
    api = billSave([row]);
  }
  api
    .then(({ response }: any) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0) {
        changedData.value = true;
        ElMessage.success('保存成功');
        tableData.value = [...tableData.value];
      }
    })
    .catch(() => {});
}

/** 删除行 */
function deleteRow(row: any) {
  ElMessageBox.confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      billDelete([row.id])
        .then(({ response }) => {
          const data: any = response?.data;
          if (data && (data.code as unknown as number) === 0) {
            changedData.value = true;
            ElMessage.success('删除成功');
            const index = tableData.value.indexOf(row);
            if (index !== -1) {
              tableData.value.splice(index, 1);
              tableData.value.forEach((item: any, idx: number) => {
                item.index = idx + 1;
              });
            }
          }
        })
        .catch(() => {});
    })
    .catch(() => {});
}

defineExpose({ init });
</script>

<style scoped>
.delete-btn {
  color: #f56c6c;
}
</style>
