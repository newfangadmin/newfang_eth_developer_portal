<template>
  <el-container style="width: 520px;">
    <el-header class="main-header">Reset password</el-header>
    <el-main>
      <el-form ref="accountForm" label-position="top" :model="accountModel" :rules="accountRules">
        <el-form-item label="Current password" prop="currentPassword">
          <el-input v-model="accountModel.currentPassword" type="password" />
        </el-form-item>
        <el-form-item label="New password" prop="newPassword">
          <el-input v-model="accountModel.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="New password (again)" prop="newPasswordAgain">
          <el-input v-model="accountModel.newPasswordAgain" type="password" />
        </el-form-item>
        <el-form-item style="margin-top: 48px;">
          <el-button type="primary" :loading="loading" @click="submitForm">Reset password</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { updateUserPasswordWithOldPassword } from '@/api/server'

export default {
  name: 'AccountSettings',
  data() {
    const validateCurrentPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Current password cannot be empty.'))
      } else {
        callback()
      }
    }

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
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: ''
      },
      accountRules: {
        currentPassword: [{ required: true, trigger: 'change', validator: validateCurrentPassword }],
        newPassword: [{ required: true, trigger: 'change', validator: validateNewPassword }],
        newPasswordAgain: [{ required: true, trigger: 'change', validator: validateNewPasswordAgain }]
      },
      loading: false
    }
  },
  methods: {
    submitForm() {
      this.$refs['accountForm'].validate(valid => {
        if (valid) {
          if (this.$store.getters.isDemo) {
            this.$message({
              message: 'Cannot change account settings from demo account',
              type: 'error'
            })
            return
          }

          this.loading = true

          updateUserPasswordWithOldPassword({
            oldPassword: this.accountModel.currentPassword,
            newPassword: this.accountModel.newPassword
          }).then(() => {
            this.$message({
              message: 'Password changed successfully.',
              type: 'success'
            })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  color: rgb(144, 147, 153);
  font-weight: 700;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: solid 1px #f4f4f4;
}
</style>
