<template>
  <el-container style="width: 520px;">
    <el-header class="main-header">Edit profile details</el-header>
    <el-main>
      <el-form ref="profileForm" label-position="top" :model="profileForm" :rules="profileRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First name" prop="firstName">
              <el-input v-model="profileForm.firstName" type="text" placeholder="First name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last name" prop="lastName">
              <el-input v-model="profileForm.lastName" type="text" placeholder="Last name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Username" prop="userName">
          <el-input v-model="profileForm.userName" type="text" placeholder="Username" disabled />
        </el-form-item>
        <el-form-item style="margin-top: 48px;">
          <el-button type="primary" :loading="loading" @click="submitForm">Update profile</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'ProfileSettings',
  data() {
    const firstName = this.$store.getters.firstName
    const lastName = this.$store.getters.lastName
    const userName = this.$store.getters.userName

    function validateFirstName(rule, value, callback) {
      if (value === '') {
        callback(new Error('First name cannot be empty.'))
      } else {
        callback()
      }
    }

    function validateLastName(rule, value, callback) {
      if (value === '') {
        callback(new Error('Last name cannot be empty.'))
      } else {
        callback()
      }
    }

    function validateUserName(rule, value, callback) {
      if (value === '') {
        callback(new Error('Username cannot be empty.'))
      } else if (/\s/.test(value)) {
        callback(new Error('Username cannot contain spaces.'))
      } else {
        callback()
      }
    }

    return {
      profileForm: {
        firstName,
        lastName,
        userName
      },
      profileRules: {
        firstName: [{ required: true, trigger: 'change', validator: validateFirstName }],
        lastName: [{ required: true, trigger: 'change', validator: validateLastName }],
        userName: [{ required: true, trigger: 'change', validator: validateUserName }]
      },
      loading: false
    }
  },
  methods: {
    submitForm() {
      this.$refs['profileForm'].validate(valid => {
        if (valid) {
          if (this.$store.getters.isDemo) {
            this.$message({
              message: 'Cannot change profile settings from demo account',
              type: 'error'
            })
            return
          }

          this.loading = true

          this.$store.dispatch('user/updateUserProfile', {
            firstName: this.profileForm.firstName,
            lastName: this.profileForm.lastName,
            user_name: this.profileForm.userName
          }).then(() => {
            this.$message({
              message: 'Profile details updated successfully.',
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
