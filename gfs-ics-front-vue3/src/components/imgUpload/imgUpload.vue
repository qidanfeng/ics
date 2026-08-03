<template>
  <el-dialog
    title="上传图片"
    v-model="visible"
    :close-on-click-modal="false"
    @close="closeHandle"
    width="600px"
  >
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
      style="text-align: center;"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持{{accept}}格式的图片！</div>
    </el-upload>
    <el-divider>异常信息</el-divider>
    <el-collapse-transition>
      <div v-if="errorMessage" class="transition-box">
        <div v-html="errorMessage" class="text-red-500"></div>
      </div>
    </el-collapse-transition>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 响应式数据
const visible = ref(false);
const url = ref('');
const accept = ref('');
const fileList = ref<File[]>([]);
const errorMessage = ref('');

const headers = ref({
  Authorization: ''
});

// 接收参数
interface Props {
  templateName?: string;
  templateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  templateName: '',
  templateUrl: ''
});

// 初始化方法
const init = (urlVal: string, acceptVal: string) => {
  // headers.value.Authorization = 'Bearer ' + getToken(); // 移除token设置，根据实际项目需求调整
  errorMessage.value = '';
  url.value = urlVal;
  // accept: 默认接收格式（.jpg,.png,.jpeg,.jpe）   逗号分隔
  if (!acceptVal || acceptVal === '') {
    acceptVal = '.jpg,.png,.jpeg,.jpe';
  }
  accept.value = acceptVal;
  visible.value = true;
};

// 上传之前
const beforeUploadHandle = async (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小超过5M限制！');
    return false;
  }
  if (accept.value !== '.*') {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const arr = accept.value.split(',');
    if (arr.indexOf(suffix) === -1) {
      ElMessage.error('只支持' + accept.value + '格式的图片！');
      return false;
    }
  }
};

// 上传成功
const successHandle = (response: any, file: any, uploadFileList: any[]) => {
  if (response && response.code === 0) {
    ElMessage.success('操作成功!');
    visible.value = false;
    fileList.value = [];
  } else {
    fileList.value = [];
    errorMessage.value = response.msg || response.message || '上传失败';
  }
};

const errorHandler = (err: any, file: any, fileList: any[]) => {
  console.log(err);
};

// 弹窗关闭时
const closeHandle = () => {
  fileList.value = [];
  errorMessage.value = '';
  emit('refresh-data-list');
};

// 定义事件
const emit = defineEmits(['refresh-data-list']);

// 暴露方法给父组件
defineExpose({
  init
});
</script>