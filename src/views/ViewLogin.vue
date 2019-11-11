<template>
  <div class="login-container">
    <el-row class="container">
      <img class="logo" src="full.svg">
    </el-row>
    <el-form v-if="action == 'LOGIN'" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Developer Login</h3>
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="Email"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-col :span="12" class="termsContainer">
        <el-checkbox v-model="checked">
          <el-row :span="12" type="flex" align="center">
            <el-link href="https://newfang.io/terms" target="_blank">Terms</el-link>
            &nbsp;and&nbsp;
            <el-link href="https://newfang.io/privacy" target="_blank">Privacy Policy</el-link>
          </el-row>
        </el-checkbox>
      </el-col>
      <el-col :span="8" :offset="4">
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:0px;" @click.native.prevent="handleLogin">LOGIN</el-button>
      </el-col>
      <el-col v-if="termsError" :span="16" class="termsError">
        Please accept Terms and Conditions before proceeding
      </el-col>
    </el-form>

    <el-form v-if="action == 'FORGOT_PASSWORD'" ref="forgotPasswordForm" :model="forgotPasswordForm" :rules="forgotPasswordRules" class="forgot-password-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Reset Password</h3>
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="forgotPasswordForm.email"
          placeholder="Email"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-col>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:0px;" @click.native.prevent="handleForgotPassword">SEND PASSWORD RESET EMAIL</el-button>
      </el-col>
    </el-form>
    <el-row class="footer-container">
      <el-col :xs="{span: 22, offset: 1}" :sm="{span: 14, offset: 5}" :md="{span: 12, offset: 6}" :lg="{span: 6, offset: 9}">
        <div v-if="action == 'LOGIN'" class="el-link el-link--default is-underline" @click="action = 'FORGOT_PASSWORD'">Forgot your password?</div>
        <div v-if="action == 'FORGOT_PASSWORD'" class="el-link el-link--default is-underline" @click="action = 'LOGIN'">Login instead?</div>
        <div class="signupText">
          If you would like to build your (d)App with it's storage on Newfang, please write in to us <a class="email" href="mailto:hello@newfang.io">hello@newfang.io</a>.
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { sendPasswordResetEmail } from '@/api/server'

export default {
  name: 'ViewLogin',
  data() {
    const validateEmail = (rule, value, callback) => {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (!regex.test(value)) {
        callback(new Error('Not a valid email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      action: 'LOGIN',
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      forgotPasswordForm: {
        email: ''
      },
      forgotPasswordRules: {
        email: [{ required: true, trigger: 'change', validator: validateEmail }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      checked: true,
      termsError: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          if (this.checked) {
            this.loading = true
            try {
              await this.$store.dispatch('user/loginUser', this.loginForm)

              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            } catch (e) {
              this.loading = false
            }
          } else {
            this.termsError = true
            return false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async handleForgotPassword() {
      this.$refs.forgotPasswordForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          sendPasswordResetEmail({
            email: this.forgotPasswordForm.email
          }).then(() => {
            this.$message({
              message: 'Reset email sent successfully. Please check your inbox.',
              type: 'Success'
            })
            this.loading = false
            this.action = 'LOGIN'
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#fff;
$light_gray:#333;
$cursor: #222;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 42px;
    width: 85%;

    input {
      font-family: "Titillium Web";
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #efefef;
    background: #fff;
    border-radius: 5px;
    color: #222;
  }
}
</style>

<style lang="scss" scoped>
$bg:#f2f2f2;
$dark_gray:#333;
$light_gray:#222;

.container {
  margin-top: 20px;
  text-align: center;
}

.logo {
  width: 200px;
  margin-top: 100px;
}

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form, .forgot-password-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 5px 12px 12px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.email {
  color: #ff7500;
}

.email:hover {
  font-weight: 600;
  text-decoration: underline;
}

.termsContainer {
  padding-top: 11px;
  overflow-wrap: break-word;
}

.termsError {
  text-align: left;
  font-size: 11px;
  color: #888;
}

.signupText {
  margin-top: 20px;
  line-height: 24px;
  margin-bottom: 20px;
}

.footer-container {
  margin-top: 32px;
  text-align: center;
}
</style>
