<template>
  <div class="login-container">
    <el-row class="container">
      <img class="logo" src="full.svg">
    </el-row>
    <el-form ref="accountForm" :model="accountModel" :rules="accountRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Update Password</h3>
      </div>
      <el-form-item prop="newPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="accountModel.newPassword"
          type="password"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="newPasswordAgain">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="accountModel.newPasswordAgain"
          type="password"
          placeholder="Password (again)"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>
      <el-col>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:0px;" @click.native.prevent="handleUpdatePassword">CHANGE YOUR PASSWORD</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { updateUserPasswordWithOTP } from '@/api/server'

export default {
  name: 'ViewUpdatePassword',
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('New password cannot be empty.'))
      } else {
        if (this.accountModel.newPasswordAgain !== '') {
          this.$refs.accountForm.validateField('newPasswordAgain')
        }
        callback()
      }
    }

    const validateNewPasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('New password cannot be empty.'))
      } else if (value.length < 6) {
        callback(new Error('Password is too short.'))
      } else if (value !== this.accountModel.newPassword) {
        callback(new Error('Passwords do not match.'))
      } else {
        callback()
      }
    }

    return {
      accountModel: {
        newPassword: '',
        newPasswordAgain: ''
      },
      accountRules: {
        newPassword: [{ required: true, trigger: 'change', validator: validateNewPassword }],
        newPasswordAgain: [{ required: true, trigger: 'change', validator: validateNewPasswordAgain }]
      },
      loading: false
    }
  },
  watch: {
  },
  methods: {
    handleUpdatePassword() {
      this.$refs.accountForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          updateUserPasswordWithOTP({
            code: this.$route.query.code,
            newPassword: this.accountModel.newPassword
          }).then(() => {
            this.$message({
              message: 'Password updated successfully. Login again to continue.',
              type: 'Success'
            })
            this.loading = false
            this.$router.push('/login')
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

  .login-form {
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
