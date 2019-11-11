<template>
  <div v-loading="pageLoading" class="appsContainer" :element-loading-text="pageLoadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
    <el-col :xs="{span:22, offset:1}" :sm="{span:22, offset:1}" :md="{span:22, offset:1}" :lg="{span:20, offset:2}" class="appsTableContainer">
      <el-row>
        <el-col :span="12" :offset="6" class="addAppBtnContainer">
          <el-button id="step1" class="addAppBtn" icon="el-icon-plus" size="medium" @click="handleAddApp()">ADD APP</el-button>
        </el-col>
      </el-row>
      <el-card class="appsTableCard">
        <el-table id="step2" ref="appTable" :data="orgApps" style="width: 100%;" size="large">
          <template slot="empty">
            No apps in this organisation.
          </template>
          <el-table-column label="App Name" width="160" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.display_name">{{ scope.row.display_name }}</span>
              <span v-else style="color: #aaa;">No App Name</span>
            </template>
          </el-table-column>
          <el-table-column label="App ID" width="160" align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="Add Date" width="210" align="center">
            <template slot-scope="scope">
              {{ scope.row.created_at | moment }}
            </template>
          </el-table-column>
          <el-table-column label="App Config" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.k_val + ' of ' + scope.row.n_val }}
            </template>
          </el-table-column>
          <el-table-column label="Download SDK" min-width="210" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload('node', scope.$index, scope.row)"
              >DESKTOP</el-button>
              <el-button
                size="mini"
                style="width:80px;"
                @click="handleDownload('web', scope.$index, scope.row)"
              >WEB</el-button>
            </template>
          </el-table-column>
          <el-table-column label="Delete" width="100" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete" /></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog title="Confirm Delete" :visible.sync="deleteFormVisible" :show-close="true" width="36%">
      <span>Are you sure you want to delete this app: <strong>{{ curApp }}</strong> ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" plain :disabled="loading" @click="deleteFormVisible = false">CANCEL</el-button>
        <el-button v-if="!loading" class="dialogBtn" @click="confirmDelete()">CONFIRM</el-button>
        <el-button v-if="loading" class="dialogBtn" disabled="disabled"><i class="el-icon-loading" /></el-button>
      </span>
    </el-dialog>
    <el-dialog title="Add Application" :visible.sync="addAppFormVisible" width="40%" class="add-app-dialog">
      <AddApp />
    </el-dialog>
  </div>
</template>

<style lang="scss">
.appsContainer {
  height: calc(100vh - 50px);
}

.appsTableContainer {
  margin-top: 20px;
}

.dialogBtn {
  min-width: 120px;
}

.addAppBtnContainer {
  text-align: center;
  margin-bottom: 20px;
}

.add-app-dialog .el-dialog {
  margin-top: 36px !important;
}

@media (max-width:1024px) {
  .el-dialog {
    width: 70% !important;
  }
}
@media (max-width:550px) {
  .el-dialog {
    width: 90% !important;
  }
}
</style>

<style>
.appsContainer .appsTableCard .el-card__body{
  padding: 0px !important;
}
</style>

<script>
import { deleteApp, downloadSDK } from '@/api/server'
import moment from 'moment'
import AddApp from '@/components/AddApp.vue'
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewApps',
  components: {
    AddApp
  },
  filters: {
    moment: function(date) {
      return moment(date).format('MMM Do YYYY, h:mm:ss a')
    }
  },
  data() {
    return {
      innerVisible: false,
      addAppFormVisible: false,
      addFormVisible: false,
      subFormVisible: false,
      deleteFormVisible: false,
      curBal: 0,
      curApp: '',
      totalAppsBalance: 0,
      api: null,
      rpc: null,
      formLabelWidth: '180px',
      curRow: null,
      curIndex: -1,
      userName: '',
      loading: false,
      pageLoading: false,
      pageLoadingText: 'Loading Applications...'
    }
  },
  computed: {
    ...mapGetters([
      'orgApps'
    ])
  },
  async created() {
    this.userName = this.$store.getters.userName
    this.$root.$on('closeAddAppForm', () => {
      this.addAppFormVisible = false
    })
    this.$root.$on('newAppAdded', async() => {
      this.loading = true
      this.addAppFormVisible = false
      await this.$store.dispatch('user/getUserOrgApps')
      this.loading = false
      this.$message({
        message: 'App added successfully',
        type: 'success'
      })
    })
  },
  mounted() {
    const driver = new Driver()
    driver.defineSteps([
      {
        element: '#step1',
        popover: {
          title: 'Add App',
          description: 'Click here to configure and add a new app that you want to download SDKs for.',
          offset: 53
        }
      },
      {
        element: '#step2',
        popover: {
          title: 'View Apps',
          description: 'Once added, your application will show up here.'
        }
      }
    ])
    // driver.start()
  },
  methods: {
    handleAddApp() {
      this.addAppFormVisible = true
    },
    handleDelete(index, row) {
      const isDemo = this.$store.getters.isDemo
      if (!isDemo) {
        this.deleteFormVisible = true
        this.curApp = row.name
        this.curIndex = index
      } else {
        this.$message({
          message: 'Cannot delete app from demo account',
          type: 'error'
        })
      }
    },
    async confirmDelete() {
      this.loading = true
      await deleteApp(this.curApp)
      await this.$store.dispatch('user/getUserOrgApps')
      this.loading = false
      this.deleteFormVisible = false
      this.curApp = ''
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    async handleDownload(type, index, row) {
      const isDemo = this.$store.getters.isDemo
      if (!isDemo) {
        try {
          this.pageLoadingText = 'Preparing Download...'
          this.pageLoading = true
          const res = await downloadSDK(row.name, type)
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'newfang.zip')
          document.body.appendChild(link)
          link.click()
          this.pageLoadingText = 'Loading Applications...'
        } catch (e) {
          this.$message({
            message: 'Something went wrong. Failed to download the SDK.',
            type: 'error'
          })
        }
        this.pageLoading = false
      } else {
        this.$message({
          message: 'Cannot download SDK from demo account',
          type: 'error'
        })
      }
    }
  }
}
</script>
