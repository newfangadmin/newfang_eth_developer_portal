<template>
  <el-container style="width: 520px;">
    <el-header class="main-header">Update organisation details</el-header>
    <el-main>
      <el-form ref="orgForm" label-position="top" :model="orgModel" :rules="orgRules">
        <el-form-item label="Organisation name" prop="orgName">
          <el-input v-model="orgModel.orgName" type="text" placeholder="Organisation name" />
        </el-form-item>
        <el-form-item label="Organisation decription" prop="orgDesc">
          <el-input v-model="orgModel.orgDesc" type="textarea" :rows="3" placeholder="Organisation description" />
        </el-form-item>
        <!--
        <el-form-item label="Max member count" prop="orgMaxDevCount">
          <el-input v-model="orgModel.orgMaxDevCount" type="number" min="1" max="5" step="1" />
        </el-form-item>
        -->
        <el-form-item style="margin-top: 48px;">
          <el-button type="primary" :loading="loading" @click="submitForm">Update organisation</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'OrgSettings',
  data() {
    const orgName = this.$store.getters.orgName
    const orgDesc = this.$store.getters.orgDesc
    const orgMaxDevCount = this.$store.getters.orgMaxDevCount

    const validateOrgName = (rule, value, callback) => {
      if (value === '') {
        callback('Organisation name cannot be empty.')
      } else {
        callback()
      }
    }

    const validateOrgDesc = (rule, value, callback) => {
      callback()
    }

    const validateOrgMaxDevCount = (rule, value, callback) => {
      if (value > 0 && value > 5) {
        callback('Maximum member count should be between 1 and 5.')
      } else {
        callback()
      }
    }

    return {
      orgModel: {
        orgName,
        orgDesc,
        orgMaxDevCount
      },
      orgRules: {
        orgName: [{ required: true, trigger: 'change', validator: validateOrgName }],
        orgDesc: [{ required: false, trigger: 'change', validator: validateOrgDesc }],
        orgMaxDevCount: [{ required: true, trigger: 'change', validator: validateOrgMaxDevCount }]
      },
      loading: false
    }
  },
  methods: {
    submitForm() {
      this.$refs['orgForm'].validate(valid => {
        if (valid) {
          if (this.$store.getters.isDemo) {
            this.$message({
              message: 'Cannot change organisation settings from demo account',
              type: 'error'
            })
            return
          }

          this.loading = true

          this.$store.dispatch('user/updateUserOrg', {
            organizationName: this.orgModel.orgName,
            organizationDescription: this.orgModel.orgDesc
            // Hiding maxDevCount
            // maxDevCount: this.orgModel.orgMaxDevCount
          }).then(() => {
            this.$message({
              message: 'Organisation updated successfully.',
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
