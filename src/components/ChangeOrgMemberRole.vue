<template>
  <div class="dialog-container">
    <el-row :gutter="8" style="margin-bottom:10px;">
      <div class="selected-member">Change role for <strong>{{ selectedMember.firstName }} {{ selectedMember.lastName }}</strong></div>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" style="margin-bottom:10px;">
        <el-form ref="dialogForm" :model="dialogModel" :rules="dialogRules" label-position="top">
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
            <el-button v-if="!loading" class="submitFormBtn" @click="submitForm">CHANGE ROLE</el-button>
            <el-button v-if="loading" class="submitFormBtn" disabled="disabled"><i class="el-icon-loading" /></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { changeUserOrgMemberRole } from '@/api/server'

export default {
  name: 'ChangeOrgMemberRole',
  props: {
    selectedMember: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogModel: {
        type: 'dev'
      },
      dialogRules: {
        type: [{ required: true, trigger: 'change' }]
      },
      loading: false
    }
  },
  watch: {
    selectedMember() {
      this.dialogModel.type = this.selectedMember.type
    }
  },
  methods: {
    resetForm() {
      this.dialogModel.type = this.selectedMember.type
    },
    closeForm() {
      this.resetForm()
      this.$root.$emit('closeChangeOrgMemberRoleDiaglog')
    },
    submitForm() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          if (this.$store.getters.isDemo) {
            this.$message({
              message: 'Cannot edit members from demo account',
              type: 'error'
            })
            return
          }

          this.loading = true

          changeUserOrgMemberRole({
            userId: this.selectedMember.id,
            type: this.dialogModel.type
          }).then((response) => {
            const member = response.data
            this.$store.dispatch('user/setUserOrgMember', member)
            this.$message({
              message: 'Member role changed successfully.',
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
.selected-member {
  padding: 16px;
  background: #FBF1A9;
}
</style>
