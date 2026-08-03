<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <div class="login-wrapper">
      <!-- 左侧品牌展示区 -->
      <div class="brand-section">
        <!-- Logo -->
        <div class="brand-logo">
          <img :src="logoImg" alt="Logo" class="logo-image">
        </div>

        <!-- 标题 -->
        <h1 class="brand-title">普冷订存管理系统</h1>

        <!-- 副标题 -->
        <p class="brand-subtitle">高效、智能的冷链仓储解决方案</p>
      </div>

      <!-- 右侧登录表单区域 -->
      <div class="login-section">
        <div class="card">
          <!-- 移动端Logo -->
          <div class="mobile-logo">
            <img :src="logoImg" alt="WMS Logo" class="logo-image">
          </div>

          <!-- 卡片头部 -->
          <div class="card-header">
            <h1>账号登录</h1>
            <p>欢迎使用普冷订存管理系统</p>
          </div>

          <!-- 登录状态提示 -->
          <div v-if="loginMessage" :class="['login-status', loginMessageType]">
            {{ loginMessage }}
          </div>

          <!-- 登录表单 -->
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @submit.native.prevent="dataFormSubmit()" class="login-form">
            <!-- 用户名/工号 -->
            <div class="form-group">
              <label for="username" class="form-label">用户名</label>
              <div class="input-group">
                <span class="input-icon">
                  <i class="el-icon-user-solid"></i>
                </span>
                <input
                  v-model="dataForm.username"
                  placeholder="请输入用户名"
                  class="custom-input"
                  required
                  autofocus>
              </div>
            </div>

            <!-- 密码 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="input-group">
                <span class="input-icon">
                  <i class="el-icon-lock"></i>
                </span>
                <input
                  v-model="dataForm.password"
                  :type="passwordVisible ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="custom-input has-icon-right"
                  required>
                <button type="button"
                        @click="togglePasswordVisibility"
                        class="password-toggle">
                  <i :class="passwordVisible ? 'el-icon-view' : 'el-icon-remove-outline'"></i>
                </button>
              </div>
            </div>

            <!-- 验证码 -->
            <div class="form-group captcha-group">
              <label class="form-label">验证码</label>
              <div class="captcha-wrapper">
                <div class="captcha-input">
                  <div class="input-group">
                    <span class="input-icon">
                      <i class="el-icon-key"></i>
                    </span>
                    <input
                      v-model="dataForm.captcha"
                      placeholder="请输入验证码"
                      class="custom-input"
                      required
                      maxlength="4">
                  </div>
                </div>
                <div class="captcha-image" @click="refreshImg">
                  <img :src="captchaPath" alt="点击刷新验证码" class="captcha-img">
                </div>
              </div>
            </div>

            <!-- 登录按钮 -->
            <div>
              <el-button
                :loading="submitBtn"
                type="primary"
                native-type="submit"
                class="btn-primary">
                <span>登录系统</span>
                <i class="fa fa-arrow-right"></i>
              </el-button>
            </div>

            <!-- 登录失败次数提示 -->
            <div class="login-attempts" v-if="loginAttempts < 5">
              剩余登录次数: <span class="attempts-count">{{ loginAttempts }}</span>/5
            </div>
          </el-form>
        </div>

        <!-- 底部版权信息 -->
        <div class="footer">
          <p>© 2025 Global Freezer Services - 普冷国际</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LogoImg from "@/assets/login.png"
import API from '@/api'
export default {
  data () {
    return {
      submitBtn: false,
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      logoImg: LogoImg,
      dataRule: {
        username: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: '',
      key: '',
      // 新增数据属性
      passwordVisible: false,
      rememberMe: false,
      loginMessage: '',
      loginMessageType: '',
      loginAttempts: 5,
      lockedUntil: null
    }
  },
  created () {
    this.refreshImg();
    this.checkLockStatus();
    this.initAnimations();
  },
  mounted() {
    // 添加GSAP动画库
    this.loadGSAP();
  },
  methods: {
    refreshImg(){
      this.dataForm.captcha = '';
      // 随机id+当前时间戳
      this.key = this.getUid()+'-'+Date.now();
      API.login.captcha(this.key).then(({data})=>{
        this.captchaPath = window.URL.createObjectURL(data);
      })
    },
    /**
     * 生成一个随机id
     * @returns {string}
     */
    getUid() {
      return 'x4yx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 检查是否锁定
          if (this.isLocked()) {
            this.showLoginStatus('账号已被锁定，请在 ' + this.formatTimeLeft() + ' 后重试', 'error');
            return;
          }

          this.dataForm.key = this.key;
          this.submitBtn = true;
          this.$store.dispatch('user/login', this.dataForm).then(() => {
            this.showLoginStatus('登录成功，正在跳转...', 'success');
            setTimeout(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
              this.submitBtn = false;
            }, 1500);
          }).catch(() => {
            this.submitBtn = false;
            this.handleLoginFailed();
            this.refreshImg();
          });
        }
      });
    },
    // 处理登录失败
    handleLoginFailed() {
      this.loginAttempts--;

      // 检查是否需要锁定
      if (this.loginAttempts <= 0) {
        this.lockAccount();
        this.showLoginStatus('登录失败次数过多，账号已被锁定10分钟', 'error');
      } else {
        this.showLoginStatus('用户名或密码错误，还有 ' + this.loginAttempts + ' 次机会', 'error');
      }
    },
    // 切换密码可见性
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    // 显示登录状态提示
    showLoginStatus(message, type) {
      this.loginMessage = message;
      this.loginMessageType = `alert-${type}`;

      // 3秒后自动清除提示
      setTimeout(() => {
        this.loginMessage = '';
      }, 3000);
    },
    // 显示忘记密码模态框
    showForgotPasswordModal() {
      this.$message.info('忘记密码功能正在开发中');
    },
    // 检查锁定状态
    checkLockStatus() {
      const lockedUntilStr = localStorage.getItem('lockedUntil');
      const attemptsStr = localStorage.getItem('loginAttempts');

      if (lockedUntilStr) {
        this.lockedUntil = new Date(parseInt(lockedUntilStr));

        // 检查是否仍然锁定
        if (this.isLocked()) {
          this.loginAttempts = 0;
          this.showLoginStatus('账号已被锁定，请在 ' + this.formatTimeLeft() + ' 后重试', 'error');
          this.startLockCountdown();
        } else {
          // 已解锁，重置状态
          this.resetLockStatus();
        }
      }

      if (attemptsStr) {
        this.loginAttempts = parseInt(attemptsStr);
      }
    },
    // 锁定账号
    lockAccount() {
      this.lockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后解锁
      localStorage.setItem('lockedUntil', this.lockedUntil.getTime());
      localStorage.setItem('loginAttempts', 0);
      this.startLockCountdown();
    },
    // 重置锁定状态
    resetLockStatus() {
      this.loginAttempts = 5;
      this.lockedUntil = null;
      localStorage.removeItem('lockedUntil');
      localStorage.setItem('loginAttempts', this.loginAttempts);
    },
    // 检查是否锁定
    isLocked() {
      if (!this.lockedUntil) return false;
      return new Date() < this.lockedUntil;
    },
    // 格式化剩余锁定时间
    formatTimeLeft() {
      if (!this.lockedUntil) return '0分钟';

      const now = new Date();
      const diff = this.lockedUntil - now;

      if (diff <= 0) return '0分钟';

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      return minutes + '分' + seconds + '秒';
    },
    // 开始锁定倒计时
    startLockCountdown() {
      const countdownInterval = setInterval(() => {
        if (!this.isLocked()) {
          clearInterval(countdownInterval);
          this.resetLockStatus();
          this.loginMessage = '';
          return;
        }

        // 更新登录状态提示
        if (this.loginMessage) {
          this.loginMessage = '账号已被锁定，请在 ' + this.formatTimeLeft() + ' 后重试';
        }
      }, 1000);
    },
    // 初始化动画
    initAnimations() {
      // 等待DOM渲染完成后执行动画
      this.$nextTick(() => {
        if (window.gsap) {
          gsap.from('.card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
          });

          gsap.from('.form-input', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
          });
        }
      });
    },
    // 加载GSAP动画库
    loadGSAP() {
      if (!window.gsap) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = () => {
          this.initAnimations();
        };
        document.head.appendChild(script);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #0D5F4C 0%, #17ad4c 100%);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .login-wrapper {
    display: flex;
    height: 100vh;

    .brand-section {
      flex: 1;
      background: linear-gradient(135deg, rgba(13, 95, 76, 0.9) 0%, rgba(23, 173, 76, 0.8) 100%),
                  url('~@/assets/login_back.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      color: white;
      padding: 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .brand-logo {
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: center;
        gap: 30px;

        .logo-image {
          width: 300px;
          height: 300px;
          object-fit: contain;
        }

        .logo-text {
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          width: 100%;
        }
      }

      .brand-title {
        font-size: 2.2rem;
        font-weight: 600;
        margin-bottom: 20px;
        line-height: 1.3;
        text-align: center;
        width: 100%;
      }

      .brand-subtitle {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 40px;
        line-height: 1.6;
        text-align: center;
        width: 100%;
      }

      .features-list {
        list-style: none;
        padding: 0;

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          font-size: 1rem;

          .feature-icon {
            color: #FFD700;
            margin-right: 15px;
            font-size: 1.2rem;
          }
        }
      }
    }

    .login-section {
      flex: 1;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;

      .card {
        width: 100%;
        max-width: 400px;

        .mobile-logo {
          display: none;
          text-align: center;
          margin-bottom: 30px;

          .logo-image {
            width: 480px;
            height: 480px;
            object-fit: contain;
          }
        }

        .card-header {
          text-align: center;
          margin-bottom: 40px;

          h1 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 10px;
          }

          p {
            color: #666;
            font-size: 0.95rem;
          }
        }

        .login-form {
          position: relative;
        }

        .form-group {
          margin-bottom: 24px;

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 0.9rem;
          }

          .input-group {
            position: relative;

            .input-icon {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: #999;
              z-index: 2;
              font-size: 16px;
            }

            .password-toggle {
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: #999;
              cursor: pointer;
              font-size: 1rem;
              z-index: 2;

              &:hover {
                color: #0D5F4C;
              }
            }
          }

          &.captcha-group {
            .captcha-wrapper {
              display: flex;
              gap: 10px;

              .captcha-input {
                flex: 1;
              }

              .captcha-image {
                width: 120px;
                height: 40px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8f9fa;

                &:hover {
                  border-color: #0D5F4C;
                }

                img {
                  max-width: 100%;
                  max-height: 100%;
                }
              }
            }
          }
        }

        .btn-primary {
          width: 100%;
          background: #0D5F4C;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover:not(:disabled) {
            background: #1a8c6c;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(13, 95, 76, 0.3);
          }

          &:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        }

        .login-status {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
          margin-top: 0;

          &.alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          &.alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          &.alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-attempts {
          text-align: center;
          margin-top: 15px;
          font-size: 0.85rem;
          color: #666;

          .attempts-count {
            font-weight: 600;
            color: #0D5F4C;
          }
        }

        // 自定义输入框样式
        .custom-input {
          width: 100%;
          height: 44px;
          padding: 12px 15px 12px 50px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          background: white;
          transition: all 0.3s ease;
          box-sizing: border-box;

          &:focus {
            outline: none;
            border-color: #0D5F4C;
            box-shadow: 0 0 0 3px rgba(13, 95, 76, 0.1);
          }

          &.has-icon-right {
            padding-right: 45px;
          }

          &::placeholder {
            color: #999;
          }
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.85rem;
    color: #666;

    p {
      margin: 0;
    }
  }
}

/* 平板适配 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .login-wrapper {
    .brand-section {
      padding: 60px 40px;

      .brand-logo {
        .logo-image {
          width: 200px;
          height: 200px;
        }
      }

      .brand-title {
        font-size: 2rem;
      }

      .brand-subtitle {
        font-size: 1.1rem;
      }
    }

    .login-section {
      padding: 30px;

      .card {
        max-width: 350px;
      }
    }
  }
}

/* 移动端适配 (768px以下) */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    padding-bottom: 0;

    .brand-section {
      padding: 10px 5px;
      text-align: center;
      flex: 0 0 auto;
      min-height: 60px;

      .brand-logo {
        justify-content: center;
        margin-bottom: 0;

        .logo-image {
          width: 40px;
          height: 40px;
        }
      }

      .brand-title,
      .brand-subtitle,
      .features-list {
        display: none;
      }
    }

    .login-section {
      padding: 0 10px 15px;
      flex: 1;
      min-height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .card {
        max-width: 100%;
        margin: 0 auto;
        padding: 15px;

        .mobile-logo {
          display: none;
        }

        .card-header {
          margin-bottom: 15px;
          text-align: center;

          h1 {
            font-size: 1.1rem;
            margin-bottom: 5px;
          }

          p {
            font-size: 0.75rem;
            color: #666;
          }
        }

        // 移动端自定义输入框样式
        .custom-input {
          padding: 10px 12px 10px 40px;
          font-size: 16px; // 防止iOS缩放
          height: 42px; // 移动端触摸友好

          &.has-icon-right {
            padding-right: 35px;
          }
        }

        .input-group {
          .input-icon {
            left: 12px;
            font-size: 14px;
          }

          .password-toggle {
            right: 12px;
            font-size: 14px;
          }
        }

        .captcha-group {
          .captcha-wrapper {
            flex-direction: column;
            gap: 8px;

            .captcha-image {
              width: 100%;
              height: 38px;
            }
          }
        }

        .btn-primary {
          padding: 10px;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 12px;
        }
      }
    }

    .footer {
      position: static;
      margin-top: 10px;
      padding: 8px 10px;
      font-size: 0.7rem;
      background: #f8f9fa;
      text-align: center;
    }
  }
}

/* 小屏手机适配 (480px以下) */
@media (max-width: 480px) {
  .login-wrapper {
    .brand-section {
      padding: 20px 15px;

      .brand-logo {
        .logo-image {
          width: 100px;
          height: 100px;
        }
      }

      .brand-title {
        font-size: 1.3rem;
      }

      .brand-subtitle {
        font-size: 0.85rem;
      }
    }

    .login-section {
      padding: 15px;

      .card {
        .mobile-logo {
          .logo-image {
            width: 60px;
            height: 60px;
          }
        }

        .card-header {
          h1 {
            font-size: 1.3rem;
          }

          p {
            font-size: 0.85rem;
          }
        }

        .custom-input {
          padding: 10px 12px 10px 40px;
          height: 44px;

          &.has-icon-right {
            padding-right: 35px;
          }
        }

        .input-group {
          .input-icon {
            left: 12px;
            font-size: 16px;
          }

          .password-toggle {
            right: 12px;
            font-size: 16px;
          }
        }

        .btn-primary {
          padding: 14px;
          font-size: 1rem;
        }
      }
    }
  }
}
</style>






