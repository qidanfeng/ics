<template>
  <el-dialog
    title="修改密码"
    :close-on-click-modal="true"
    top="5vh"
    :modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户名" prop="userName">
            <el-input disabled v-model="dataForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码" prop="password">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitUpdatePassword()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }

      return {
        visible: true,
        dataForm:{
          userName: this.$store.getters.name,
          password:'',
          confirmPassword:''
        },
        submitLoading:false,
        dataRule: {
          password: [
            { required: true, validator: validatePassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true,validator: validateConfirmPassword, trigger: 'blur' }
          ],

        }
      }
    },

    methods: {

      init () {
        this.visible = true;
        this.dataForm={
             userName: this.$store.getters.name,
            password:'',
            confirmPassword:''
        }
      },

      submitUpdatePassword(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            API.user.updatePassword({newPassword:this.dataForm.password}).then(({data})=>{
              if (data && data.code === 0) {
                // this.$message({
                //   message: '操作成功',
                //   type: 'success',
                // })
                this.$message.success('操作成功');
                this.visible = false

              }
              this.submitLoading = false;
            }).catch(error=>{
              this.submitLoading = false;
            });
          }
        })

      }

    }
  }
</script>
