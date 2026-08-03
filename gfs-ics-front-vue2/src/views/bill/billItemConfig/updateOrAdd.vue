<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog_customWidth"
    top="10vh"
    :visible.sync="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <el-form
      ref="form"
      :model="currentFormData"
      :rules="rules"
      size="mini"
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

<script>
import { mapGetters } from 'vuex'
import API from "@/api";
export default {
  name: 'UpdateOrAdd',
  computed: {
    ...mapGetters([
      'client',
    ]),
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      currentFormData: {
        id: null,
        costItemCode: '',
        costItemName: '',
        remarks: ''
      },
      submitButtonLoading: false,
      // 表单验证规则
      rules: {
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
      }
    }
  },
  methods: {
    // 新增初始化方法（供父组件调用）
    addInit() {
      this.dialogTitle = '新增费项配置'
      this.isEdit = false
      this.currentFormData = {
        id: null,
        costItemCode: '',
        costItemName: '',
        remarks: ''
      }
      this.dialogVisible = true
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 编辑初始化方法（供父组件调用）
    updateInit(rowData) {
      this.dialogTitle = '编辑费项配置'
      this.isEdit = true
      this.currentFormData = { ...rowData }
      this.dialogVisible = true
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 弹窗关闭处理
    handleDialogClose() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 重置表单（供父组件调用）
    reset() {
      this.resetForm()
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitButtonLoading = true


          if (this.isEdit) {
            // 编辑操作
            API.billItemConfig.update(this.currentFormData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.$emit("submit")
                this.dialogVisible = false
              } else {
                this.$message.error(data.message || '更新失败')
              }
              this.submitButtonLoading = false
            }).catch(error => {
              this.submitButtonLoading = false
              this.$message.error('更新失败：' + error.message)
            })
          } else {
            // 新增操作
            API.billItemConfig.save(this.currentFormData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success('保存成功')
                this.$emit("submit")
                this.dialogVisible = false
              } else {
                this.$message.error(data.message || '保存失败')
              }
              this.submitButtonLoading = false
            }).catch(error => {
              this.submitButtonLoading = false
              this.$message.error('保存失败：' + error.message)
            })
          }
        }
      })
    },

    // 重置表单
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },

    // 验证费项编码唯一性（新增时）
    validateCostItemCode() {
      if (!this.currentFormData.costItemCode || this.isEdit) {
        return Promise.resolve()
      }

      return API.billItemConfig.getByCostItemCode({ costItemCode: this.currentFormData.costItemCode }).then(({ data }) => {
        if (data.code === 0 && data.data) {
          return Promise.reject(new Error('费项编码已存在，请重新输入'))
        }
        return Promise.resolve()
      }).catch(error => {
        if (error.message.includes('费项编码已存在')) {
          return Promise.reject(error)
        }
        return Promise.resolve() // 接口错误时不阻止提交
      })
    },

    // 提交前验证唯一性
    submitFormWithUniqueCheck() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.validateCostItemCode().then(() => {
            this.submitForm()
          }).catch(error => {
            this.$message.error(error.message)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* 可以添加一些样式 */
</style>
