<template>
  <el-dialog
    title="上传文件"
    v-model="visible"
    v-loading="fullscreenLoading"
    element-loading-text="正在上传，请勿关闭页面"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    :close-on-click-modal="false"
    @close="closeHandle">
    <el-upload
      drag
      :action="url"
      :accept="accept"
      :headers="headers"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :on-error="errorHandler"
      :file-list="fileList"
      style="text-align: center;">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">只支持{{accept}}格式的文档！</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

interface Props {
  visible?: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'refreshDataList'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const fullscreenLoading = ref(false);
const visible = ref(false);
const url = ref('');
const accept = ref('');
const fileList = ref([]);
const headers = reactive({
  warehouseCode: ''
});

// 初始化方法
const init = (uploadUrl: string, fileAccept: string = '.xls,.xlsx') => {
  url.value = uploadUrl;
  accept.value = fileAccept || '.xls,.xlsx';
  visible.value = true;
};

// 上传之前
const beforeUploadHandle = (file: any) => {
  fullscreenLoading.value = true;
  if (accept.value == '.*') {
    return true;
  }
  const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
  const arr = accept.value.split(',');
  if (arr.indexOf(suffix) == -1) {
    ElMessage.error('只支持' + accept.value + '格式的文件！');
    fullscreenLoading.value = false;
    return false;
  }
};

// 上传成功
const successHandle = (response: any, file: any, uploadFileList: any[]) => {
  fileList.value = uploadFileList;
  fullscreenLoading.value = false;
  if (response && response.code === 0) {
    ElMessageBox.confirm('操作成功, 是否继续操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(() => {
      visible.value = false;
    });
    fileList.value = [];
  } else {
    fileList.value = [];
    ElMessage.error(response.msg);
  }
};

// 错误处理
const errorHandler = (err: any, file: any, uploadFileList: any[]) => {
  console.log(err);
};

// 弹窗关闭时
const closeHandle = () => {
  fileList.value = [];
  emit('refreshDataList');
};

// 暴露方法给父组件
defineExpose({
  init
});
</script>
