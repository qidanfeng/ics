<template>
  <el-dialog
    title="上传文件"
    v-loading="fullscreenLoading"
    element-loading-text="正在上传，请勿关闭页面"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    :close-on-click-modal="false"
    @close="closeHandle"
    v-model="visible"
  >
    <template #title v-if="templateUrl">
      <div class="header-title">
        <span class="title-age">上传文件</span>
        <a :href="templateUrl" style="margin-left: 16px; color: #42B983; font-size: 12px">
          {{ '下载' + templateName }}
        </a>
      </div>
    </template>
    <el-upload
      drag
      :with-credentials="true"
      :action="url"
      :accept="accept"
      :headers="headers"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :on-error="errorHandler"
      :file-list="fileList"
      multiple
      style="text-align: center"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持{{ accept }}格式的文档！</div>
    </el-upload>
    <el-divider>异常信息</el-divider>
    <el-collapse-transition>
      <div v-if="errorMessage" class="transition-box">
        <div v-html="errorMessage" style="color: red"></div>
      </div>
    </el-collapse-transition>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {useAuthStore} from "@/store/modules/auth";

const emit = defineEmits(['refreshDataList']);

// 用户信息
const userStore = useAuthStore();

interface Props {
  templateName?: string;
  templateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  templateName: '',
  templateUrl: ''
});

const fullscreenLoading = ref(false);
const visible = ref(false);
const url = ref('');
const accept = ref('');
const fileList = ref<any[]>([]);
const taskNumber = ref<number | null>(null);
const errorMessage = ref<string | null>(null);

// 认证头 - 假设项目2通过请求拦截器自动处理，这里不需要手动设置
const headers = reactive({});

function init(uploadUrl: string, uploadAccept: string) {
  errorMessage.value = null;
  url.value = uploadUrl;
  // accept: 默认接收格式（.xls,.xlsx） 逗号分隔
  if (!uploadAccept || uploadAccept === '') {
    uploadAccept = '.xls,.xlsx';
  }
  accept.value = uploadAccept;
  visible.value = true;
}

// 上传之前
async function beforeUploadHandle(file: any) {
  fullscreenLoading.value = true;

  if (accept.value !== '.*') {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const arr = accept.value.split(',');
    if (arr.indexOf(suffix) === -1) {
      ElMessage.error('只支持' + accept.value + '格式的文件！');
      fullscreenLoading.value = false;
      return false;
    }
  }

  // 尝试获取用户信息（如果 store 存在且方法存在）
  try {
    /*if (typeof userStore.getInfo === 'function') {
      await userStore.getInfo();
    }*/
    // userStore.userInfo
  } catch (e) {
    // 如果 store 不存在或方法不存在，忽略错误
    console.warn('获取用户信息失败，跳过', e);
  }

  return true;
}

// 上传成功
function successHandle(response: any, file: any, fileList: any[]) {
  fileList.value = fileList;
  fullscreenLoading.value = false;

  if (response && response.code === 0) {
    taskNumber.value = response.data;
    ElMessage.success('操作成功!');
    visible.value = false;
    fileList.value = [];
  } else {
    fileList.value = [];
    errorMessage.value = response.msg;
  }
}

function errorHandler(err: any, file: any, fileList: any[]) {
  console.error(err);
  fullscreenLoading.value = false;
}

// 弹窗关闭时
function closeHandle() {
  fileList.value = [];
  errorMessage.value = null;
  emit('refreshDataList');
}

defineExpose({ init });
</script>
