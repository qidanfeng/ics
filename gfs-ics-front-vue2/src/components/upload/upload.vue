<template>
  <el-dialog
    title="上传文件"
    v-loading="fullscreenLoading"
    element-loading-text="正在上传，请勿关闭页面"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="closeHandle"
    :visible.sync="visible">

    <div slot="title" class="header-title" v-if="templateUrl">
      <span class="title-age">上传文件</span>
      <a :href="templateUrl.url"
         style="margin-left: 16px;color: #42B983;font-size: 12px"
         v-if="templateUrl.url && templateUrl.code == 1">
        {{ '下载' + templateUrl.name }}
      </a>
    </div>

    <!-- 上传组件 -->
    <upload-core ref="uploadCore"
                 @uploadStartTrigger="startLoading"
                 @uploadSuccessTrigger="successHandle"
                 @uploadFailTrigger="endLoading">
    </upload-core>
  </el-dialog>
</template>

<script>
import {mapGetters} from "vuex";
import UploadCore from './uploadCore'

export default {
  components: {
    UploadCore
  },
  data() {
    return {
      fullscreenLoading: false,
      visible: false,
    }
  },
  props: {
    templateUrl: Object || undefined
  },

  methods: {
    //autoUpload-是否自动上传 true-单选 false-多选，需要手动上传文件
    init(url, accept, autoUpload) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.uploadCore.init(url, accept, autoUpload);
      })
    },

    startLoading() {
      this.fullscreenLoading = true;
    },

    endLoading() {
      this.fullscreenLoading = false;
    },

    successHandle() {
      this.endLoading();
      this.visible = false;
    },

    // 弹窗关闭时
    closeHandle() {
      this.$refs.uploadCore.clearFileList();
      this.$emit('refreshDataList')
    },
  }
}
</script>

<style scoped>
.plus-icon-enter-active {
  transition: opacity 0.5s;
}

.plus-icon-enter {
  opacity: 0;
}

.plus-icon-leave-active {
  transition: opacity 0.5s;
}

.plus-icon-leave-to {
  opacity: 0;
}
</style>
