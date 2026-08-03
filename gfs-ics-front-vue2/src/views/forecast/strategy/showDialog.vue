<template>
  <!-- 查看详情弹窗 -->
  <el-dialog
    title="预测策略配置详情"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    custom-class="dialog_customWidth"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <!-- 基本信息卡片 -->
    <el-card class="info-card" shadow="never">
      <div style="display: flex; flex-direction: row;">
        <div style="width: 40%">
          <AlgorithmDescription/>

        </div>
        <div style="width: 60%">
          <el-form
            size="mini"
            style="width: 100%;"
            label-width="130px">
            <!-- 基本信息 -->
            <el-divider content-position="left">基本信息</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="策略名称：" prop="strategyName">
                  <span>{{formData.strategyName}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="仓库：" prop="warehouseName">
                  <span>{{formData.warehouseName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货主：" prop="projectName">
                  <span>{{formData.projectName}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 预测算法配置 -->
            <el-divider content-position="left">预测算法配置</el-divider>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="预测算法：" prop="algorithmTypeName">
                  <span>{{formData.algorithmTypeName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截至售卖日：" prop="saleEndDate">
                  <span>{{formData.saleEndDate}}</span>
                </el-form-item>
              </el-col>


              <!-- SMA参数 -->
              <el-col :span="12">
                <el-form-item label="历史数据周期数：" prop="hisDataPeriods">
                  <span>{{formData.hisDataPeriods}}</span>
                </el-form-item>
              </el-col>

              <!-- 数据周期 -->
              <el-col :span="12">
                <el-form-item label="数据周期：" prop="dataPeriodName">
                  <span>{{formData.dataPeriodName}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="产品编码：" prop="productNumber">
                  <span>{{formData.productNumber}}</span>
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="产品名称：" prop="productName">
                  <span>{{formData.productName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注：" prop="remarks">
                  <span>{{formData.remarks}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>
  </el-dialog>
</template>

<script>
import AlgorithmDescription from "@/views/forecast/strategy/components/AlgorithmDescription.vue";

export default {
  name: 'ShowDialog',
  components: {
    AlgorithmDescription,
  },

  data() {
    return {
      dialogVisible: false,
      submitting: false,
      selectedRows: [],
      formData: null, // 存储初始化数据
    }
  },
  methods: {
    /**
     * 初始化弹窗数据
     * @param {Object} data - 预测策略详情数据
     */
    init(data) {
      // 显示弹窗
      this.dialogVisible = true

      // 存储初始化数据
      this.formData = data
    },


    /**
     * 弹窗关闭处理
     */
    handleDialogClose() {
      this.dialogVisible = false
    },


  }
}
</script>

<style scoped>
/* 自定义样式 */
.dialog_customWidth {
  max-width: 1200px;
}
</style>
