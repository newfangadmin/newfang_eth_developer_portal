<template>
  <div class="dialog-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" style="margin-bottom:10px;">
        <el-form ref="dialogForm" :model="dialogModel" :rules="dialogRules" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="First name" prop="firstName">
                <el-input v-model="dialogModel.firstName" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Last name" prop="lastName">
                <el-input v-model="dialogModel.lastName" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Email address" prop="email">
                <el-input v-model="dialogModel.email" type="email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Role" prop="type">
                <el-select v-model="dialogModel.type" style="width: 248px;">
                  <el-option key="admin" value="admin" label="Admin" />
                  <el-option key="dev" value="dev" label="Developer" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="dialogModel.type === 'dev'" class="role-description">
                Developers can only create and manage apps in the organisation.
              </div>
              <div v-if="dialogModel.type === 'admin'" class="role-description">
                Admins can create and manage apps, view and pay bills and manage other organisation members.
              </div>
            </el-col>
          </el-row>
          <el-form-item class="formBtns">
            <el-button type="info" plain :disabled="loading" @click="closeForm">CANCEL</el-button>
            <el-button type="info" plain :disabled="loading" @click="resetForm">RESET</el-button>
            <el-button v-if="!loading" class="submitFormBtn" @click="submitForm">ADD MEMBER</el-button>
            <el-button v-if="loading" class="submitFormBtn" disabled="disabled"><i class="el-icon-loading" /></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addUserOrgMember } from '@/api/server'

export default {
  name: 'AddOrgMember',
  data() {
    const organisation = this.$store.getters.orgId
    return {
      dialogModel: {
        firstName: '',
        lastName: '',
        email: '',
        type: 'dev',
        organisation
      },
      dialogRules: {
        firstName: [{ required: true, trigger: 'change' }],
        lastName: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }],
        type: [{ required: true, trigger: 'change' }]
      },
      loading: false
    }
  },
  methods: {
    resetForm() {
      this.$refs['dialogForm'].resetFields()
    },
    closeForm() {
      this.resetForm()
      this.$root.$emit('closeAddOrgMemberDialog')
    },
    submitForm() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          if (this.$store.getters.isDemo) {
            this.$message({
              message: 'Cannot add members from demo account',
              type: 'error'
            })
            return
          }

          this.loading = true

          addUserOrgMember({
            firstName: this.dialogModel.firstName,
            lastName: this.dialogModel.lastName,
            email: this.dialogModel.email,
            type: this.dialogModel.type,
            organization: this.dialogModel.organisation
          }).then(() => {
            return this.$store.dispatch('user/getUserOrgMembers')
          }).then(() => {
            this.$message({
              message: 'Member added successfully.',
              type: 'success'
            })
            this.loading = false
            this.closeForm()
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
.dialog-container {
  position: relative;
  padding: 10px;
}
.role-description {
  margin-top: 40px;
  margin-right: 10px;
  line-height: 1.5;
  word-break: break-word;
}
.submitFormBtn {
  min-width: 100px;
}
.formBtns {
  float: right;
  margin-top: 45px;
}
</style>
