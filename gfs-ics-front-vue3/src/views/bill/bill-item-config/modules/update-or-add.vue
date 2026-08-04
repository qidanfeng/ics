<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog_customWidth"
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
        <el-col :span="12">
          <el-form-item v-if="isEdit" label="费项编码" prop="costItemCode">
            <el-input
              v-model="currentFormData.costItemCode"
              placeholder="请输入费项编码"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="费项名称" prop="costItemName">
            <el-input
              v-model="currentFormData.costItemName"
              placeholder="请输入费项名称"
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
import { ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { usePlatformStore } from '@/store/modules/platform';
import { save, update, getByCostItemCode } from '@/service/api/bill/bill-item-config';

defineOptions({ name: 'UpdateOrAdd' });

const emit = defineEmits(['submit']);

const platformStore = usePlatformStore();

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const submitButtonLoading = ref(false);

const currentFormData = ref<any>({
  id: null,
  costItemCode: '',
  costItemName: '',
  remarks: ''
});

// 表单验证规则
const rules = ref<FormRules>({
  costItemCode: [
    { required: true, message: '请输入费项编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\-]+$/, message: '费项编码只能包含字母、数字、下划线和横线', trigger: 'blur' }
  ],
  costItemName: [
    { required: true, message: '请输入费项名称', trigger: 'blur' },
    { min: 2, max: 100, message: '费项名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  remarks: [
    { max: 256, message: '备注长度不能超过 256 个字符', trigger: 'blur' }
  ]
});

// 新增初始化方法（供父组件调用）
function addInit() {
  dialogTitle.value = '新增费项配置';
  isEdit.value = false;
  currentFormData.value = {
    id: null,
    costItemCode: '',
    costItemName: '',
    remarks: ''
  };
  dialogVisible.value = true;
  // 清除验证
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 编辑初始化方法（供父组件调用）
function updateInit(rowData: any) {
  dialogTitle.value = '编辑费项配置';
  isEdit.value = true;
  currentFormData.value = { ...rowData };
  dialogVisible.value = true;
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

// 重置表单（供父组件调用）
function reset() {
  resetForm();
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      submitButtonLoading.value = true;

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

// 验证费项编码唯一性（新增时）
function validateCostItemCode() {
  if (!currentFormData.value.costItemCode || isEdit.value) {
    return Promise.resolve();
  }

  return getByCostItemCode(currentFormData.value.costItemCode)
    .then(({ response }) => {
      const data: any = response?.data;
      if (data && (data.code as unknown as number) === 0 && data.data) {
        return Promise.reject(new Error('费项编码已存在，请重新输入'));
      }
      return Promise.resolve();
    })
    .catch((error: any) => {
      if (error.message.includes('费项编码已存在')) {
        return Promise.reject(error);
      }
      return Promise.resolve(); // 接口错误时不阻止提交
    });
}

// 提交前验证唯一性
function submitFormWithUniqueCheck() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      validateCostItemCode()
        .then(() => {
          submitForm();
        })
        .catch((error: any) => {
          ElMessage.error(error.message);
        });
    }
  });
}

defineExpose({ addInit, updateInit, reset });
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
