<template>
  <el-container v-loading="pageLoading" class="memberContainer" :element-loading-text="pageLoadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
    <el-header class="main-header">Manage members</el-header>
    <el-main>
      <el-col>
        <el-row>
          <el-col :span="24" align="center">
            <el-button icon="el-icon-plus" size="medium" @click="handleAddOrgMember">ADD MEMBER</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="memberCard" style="margin-top: 24px;">
              <el-table size="large" :data="orgMembers">
                <template slot="empty">
                  No members in this organisation.
                </template>
                <el-table-column label="Member Name" align="center">
                  <template slot-scope="scope">
                    {{ `${scope.row.firstName} ${scope.row.lastName}` }}
                  </template>
                </el-table-column>
                <el-table-column label="Add Date" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.createdAt | moment }}
                  </template>
                </el-table-column>
                <el-table-column label="Member Role" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 'dev'">Developer</span>
                    <span v-if="scope.row.type === 'admin'">Admin</span>
                  </template>
                </el-table-column>
                <el-table-column label="Member Role" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleChangeMemberRole(scope.$index, scope.row)"
                    >Change role</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      plain
                      style="width:40px;"
                      class="el-icon-delete"
                      @click="handleDeleteMember(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-dialog title="Add Member" :visible.sync="showAddOrgMemberDialog" width="40%">
        <AddOrgMember />
      </el-dialog>
      <el-dialog title="Change Member Role" :visible.sync="showChangeOrgMemberRoleDialog" width="40%">
        <ChangeOrgMemberRole :selected-member="selectedMember" />
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import AddOrgMember from '@/components/AddOrgMember.vue'
import ChangeOrgMemberRole from '@/components/ChangeOrgMemberRole.vue'
import moment from 'moment'

export default {
  name: 'MemberSettings',
  components: {
    AddOrgMember,
    ChangeOrgMemberRole
  },
  filters: {
    moment: function(date) {
      return moment(date).format('MMM Do YYYY, h:mm:ss a')
    }
  },
  data() {
    return {
      pageLoading: false,
      pageLoadingText: 'Loading members...',
      showAddOrgMemberDialog: false,
      showChangeOrgMemberRoleDialog: false,
      selectedMember: null
    }
  },
  computed: {
    orgMembers() {
      return this.$store.getters.orgMembers
    }
  },
  async mounted() {
    this.$root.$on('closeAddOrgMemberDialog', () => {
      this.showAddOrgMemberDialog = false
    })
    this.$root.$on('closeChangeOrgMemberRoleDiaglog', () => {
      this.showChangeOrgMemberRoleDialog = false
    })
  },
  methods: {
    handleAddOrgMember() {
      this.showAddOrgMemberDialog = true
    },
    handleChangeMemberRole(index, member) {
      this.selectedMember = member
      this.showChangeOrgMemberRoleDialog = true
    },
    handleDeleteMember(index, member) {
      if (this.$store.getters.isDemo) {
        this.$message({
          message: 'Cannot remove members from demo account',
          type: 'error'
        })
        return
      }

      this.$confirm(`Remove ${member.firstName} ${member.lastName} from the organisation?`, 'Warning', {
        confirmButtonText: 'Remove member',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/removeUserOrgMember', member)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'User removed from organisation.'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Action canceled'
        })
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

<style>
.memberContainer .memberCard .el-card__body {
  padding: 0px !important;
}
</style>
