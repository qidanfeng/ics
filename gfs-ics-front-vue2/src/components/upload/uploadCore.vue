<template>
  <div>
    <div style="width: 100%; text-align: right">
      <a :href="templateUrl.url"
         style="margin-left: 16px;color: #42B983;font-size: 12px"
         v-if="templateUrl && templateUrl.url && templateUrl.code == 1">
        {{ '下载' + templateUrl.name }}
      </a>
    </div>

    <el-upload
      :drag="autoUpload"
      :with-credentials="true"
      :action="url"
      :accept="accept"
      :headers="headers"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :on-error="errorHandler"
      :file-list="fileList"
      :data="getData()"
      :auto-upload="autoUpload"
      :multiple="!autoUpload"
      ref="upload"
      style="text-align: center;">
      <div v-if="!autoUpload"  align="center" style="margin-top: 10px;margin-bottom: 10px">
        <el-button type="info" icon="el-icon-upload">选取文件</el-button>
      </div>
      <i v-if="autoUpload" class="el-icon-upload"></i>
      <div v-if="autoUpload" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持{{accept}}格式的文档！</div>

    </el-upload>
    <div v-if="!autoUpload"  align="center" style="margin-top: 20px;margin-bottom: 20px">
      <el-button  size="middle" type="success" @click="submitUpload">上传到服务器</el-button>
    </div>

    <el-divider>异常信息</el-divider>

    <el-collapse-transition>
      <div v-if="errorMessage" class="transition-box">
        <div v-html="errorMessage" style="color: red"></div>
      </div>
      <div v-else style="height: 10px;"></div>
    </el-collapse-transition>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import UploadCore from './uploadCore'

export default {
  data () {
    return {
      url: '',
      errorMessage:null,
      autoUpload: true,
      accept: '',
      fileList: [],
      headers: {
        // Authorization: '',
        warehouseCode:''
      }
    }
  },
  props:{
    templateUrl: Object || undefined
  },
  computed: {
    ...mapGetters([
      'client',
    ])
  },

  methods: {
    //autoUpload-是否自动上传 true-单选 false-多选，需要手动上传文件
    init (url,accept,autoUpload) {
      // this.headers.Authorization = 'Bearer ' + getToken()
      this.headers.warehouseCode = this.warehouseCode;
      this.errorMessage = null
      this.url = url;
      //autoUpload新增的参数，老的调用方法未传参，拿到的值会是undefined
      if(autoUpload !== undefined) {
        this.autoUpload = autoUpload;
      }
      //accept: 默认接收格式（.xls,.xlsx）   逗号分隔
      if(!accept || accept == ''){
        accept = '.xls,.xlsx'
      }
      this.accept = accept;
    },
    // 上传之前
    async beforeUploadHandle (file) {
      this.$emit('uploadStartTrigger')
      if(this.accept != '.*') {
        var suffix = file.name.substring(file.name.lastIndexOf("."), file.name.length);
        var arr = this.accept.split(',');
        if (arr.indexOf(suffix) == -1) {
          this.$message.error('只支持' + this.accept + '格式的文件！');
          this.$emit('uploadFailTrigger');
          return false;
        }
      }
    },
    getData(){
      return {
        clientId: this.client.id,
      };
    },
    // 上传成功
    successHandle (response, file, fileList) {
      this.fileList = fileList;
      if (response && response.code === 0) {
        let message = "导入成功"
        if (response.data && response.data.trim() !== '') {
          message = message + " " + response.data.trim();
        }
        this.$message({
          message: message,
          type: 'success'
        });
        this.fileList =[];
        // 触发成功
        this.$emit('uploadSuccessTrigger');
      } else {
        this.fileList =[];
        this.errorMessage = response.msg
        this.$emit('uploadFailTrigger');
      }

    },
    errorHandler(err, file, fileList){
      console.error(err);
      this.$message.error("未知异常，请联系管理员！" + err.message);
      this.$emit('uploadFailTrigger');
    },
    // 弹窗关闭时
    clearFileList() {
      this.fileList = [];
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  }
}
</script>
