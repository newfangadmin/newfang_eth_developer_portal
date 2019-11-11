<template>
  <div v-loading="loading" class="reqContainer" element-loading-text="Loading Requests..." element-loading-background="rgba(0, 0, 0, 0.7)">
    <el-row :span="24" type="flex" class="header">
      <el-col :span="4"><h2>Requests</h2></el-col>
      <el-col :span="20" align="right" style="padding-top: 20px;">
        <el-button v-if="areFiltersActive" icon="el-icon-refresh-left" size="mini" circle class="reset-filter" @click="handleResetFilters" />
        <el-select v-model="filters.selectedRequestType" placeholder="Filter by app" size="mini" class="select-mini" :disabled="hasNoRequests">
          <el-option
            key="ALL_REQUESTS"
            label="All requests"
            value="ALL_REQUESTS"
          />
          <el-option
            v-for="type in filters.requestTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
        <el-select v-model="filters.selectedApp" placeholder="Filter by app" size="mini" class="select-mini" :disabled="hasNoRequests">
          <el-option
            key="ALL_APPS"
            label="All app ids"
            value="ALL_APPS"
          />
          <el-option
            v-for="app in filters.apps"
            :key="app.name"
            :label="app.name"
            :value="app.name"
          />
        </el-select>
      </el-col>
    </el-row>
    <div v-if="hasNoRequests" class="noReqs">No requests yet.</div>
    <div v-else ref="reqs" v-scroll="onScroll" class="requests">
      <transition-group name="fade">
        <el-col v-for="row in filteredRequests" :key="row.request_id" :ref="row.request_id" :span="24">
          <el-card class="table-card">
            <el-row>
              <transition name="fade">
                <el-col :span="24" class="typeContainer">
                  <svg-icon :icon-class="row.req_type" />
                  <span class="reqType">{{ row.req_type }}</span>
                  <el-tag v-if="row.req_status=='open'" type="warning" size="mini" style="margin-left: 6px;">open</el-tag>
                  <el-tag v-else type="success" size="mini" style="margin-left: 6px;">closed</el-tag>
                </el-col>
              </transition>
            </el-row>
            <el-row style="padding-top: 10px; padding-bottom: 16px;">
              <el-col :span="4" class="appIdContainer">
                <el-row><div class="label">App ID</div></el-row>
                <el-popover placement="bottom" width="300" trigger="click">
                  <div v-if="getAppByName(row.app_name)">
                    <el-col :span="10" :offset="1" style="margin-bottom: 16px;">
                      <el-row><div class="popover-heading">App Name</div></el-row>
                      <el-row><div class="popover-heading">App ID</div></el-row>
                      <el-row><div class="popover-heading">Created on</div></el-row>
                      <el-row><div class="popover-heading">Config (k/N)</div></el-row>
                    </el-col>
                    <el-col :span="12" style="margin-bottom: 16px;">
                      <el-row>
                        <div v-if="getAppByName(row.app_name).display_name" class="popover-text">{{ getAppByName(row.app_name).display_name }}</div>
                        <div v-else class="popover-text" style="color: #aaa;">No App Name</div>
                      </el-row>
                      <el-row><div class="popover-text">{{ getAppByName(row.app_name).name }}</div></el-row>
                      <el-row><div class="popover-text">{{ getAppByName(row.app_name).created_at | moment("MMM D, hh:mm:ss a") }}</div></el-row>
                      <el-row><div class="popover-text">{{ getAppByName(row.app_name).k_val + '/' + getAppByName(row.app_name).n_val }}</div></el-row>
                    </el-col>
                  </div>
                  <div v-else>
                    <el-row><div class="popover-heading" style="text-align: center">No app details found.</div></el-row>
                  </div>
                  <el-button v-if="filters.selectedApp !== row.app_name" size="mini" class="filter-requests-btn" @click="setAppFilterByName(row.app_name)">Filter requests from {{ row.app_name }}</el-button>
                  <el-button v-else size="mini" class="filter-requests-btn" @click="clearAppFilter">Clear filter</el-button>
                  <el-row slot="reference"><div class="appId">{{ row.app_name }}</div></el-row>
                </el-popover>
              </el-col>
              <el-col :span="4" class="reqIdContainer">
                <el-row><div class="label">Request ID</div></el-row>
                <el-row><div class="reqId">{{ row.request_id }}</div></el-row>
              </el-col>
              <el-col :span="1" class="dividerL">|</el-col>
              <el-col :span="4" class="miscContainer">
                <el-row><div class="label">Start Time</div></el-row>
                <el-row><div class="reqId">{{ row.req_init_time | moment("MMM D, hh:mm:ss a") }}</div></el-row>
              </el-col>
              <el-col :span="2" class="miscContainer">
                <el-row><div class="label">TAT</div></el-row>
                <el-row><div v-if="row.req_end_time == 0" class="reqId">-</div></el-row>
                <el-row><div v-if="row.req_end_time != 0" class="reqId">{{ row.req_end_time - row.req_init_time }} s</div></el-row>
              </el-col>
              <el-col :span="1" class="dividerR">|</el-col>
              <el-col :span="4" class="miscContainer">
                <el-row><div class="label">File Size</div></el-row>
                <el-row><div class="reqId">{{ row.file_size_init | fileSizeFilter }}</div></el-row>
              </el-col>
              <el-col :span="4" class="miscContainer">
                <el-row><div class="label">Work Done</div></el-row>
                <el-row><div class="reqId">{{ totalWorkDone(row.work_done.work_bytes) | fileSizeFilter }}</div></el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </transition-group>
      <el-col :span="6" :offset="9">
        <i v-if="hasMoreRequests" class="el-icon-loading loader" />
        <div v-else class="noMoreRowsText">No more requests.</div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getTableRows, streamTableRows } from '@/api/blockchain'
import { InboundMessageType } from '@dfuse/client'

export default {
  name: 'Requests',
  filters: {
    fileSizeFilter(val) {
      const digitCount = val.toString().length
      if (digitCount < 4) {
        return (val).toFixed(2) + ' B'
      } else if (digitCount < 7) {
        return (val / 1000).toFixed(2) + ' KB'
      } else {
        return (val / 1000 / 1000).toFixed(2) + ' MB'
      }
    }
  },
  data() {
    return {
      loading: true,
      stream: null,

      requests: [],
      lastIndex: null,
      hasMoreRequests: true,
      hasNoRequests: false,

      filters: {
        apps: [],
        selectedApp: 'ALL_APPS',
        requestTypes: ['UPLOAD', 'DOWNLOAD', 'DELETE'],
        selectedRequestType: 'ALL_REQUESTS'
      }
    }
  },
  computed: {
    filteredRequests() {
      var data = this.requests
      if (this.filters.selectedApp !== 'ALL_APPS') {
        data = data.filter(request => request.app_name === this.filters.selectedApp)
      }
      if (this.filters.selectedRequestType !== 'ALL_REQUESTS') {
        data = data.filter(request => request.req_type === this.filters.selectedRequestType.toLowerCase())
      }
      return data
    },
    areFiltersActive() {
      return (
        this.filters.selectedApp !== 'ALL_APPS' ||
        this.filters.selectedRequestType !== 'ALL_REQUESTS'
      )
    }
  },
  watch: {
    async filteredRequests(newFilteredRequests, oldFilteredRequests) {
      if (newFilteredRequests.length < 9 && this.hasMoreRequests) {
        await this.fetchRequests()
      }
    }
  },
  async mounted() {
    const userName = this.$store.getters.userName
    this.filters.apps = this.$store.getters.orgApps
    await this.fetchRequests()
    this.loading = false

    this.stream = await streamTableRows({ code: process.env.VUE_APP_NEWFANG_CONTRACT, scope: userName, table: 'requeststab' }, (message) => {
      if (message.type === InboundMessageType.TABLE_DELTA) {
        if (this.requests[0].id !== message.data.dbop.new.json.id) {
          // Insert a new request
          this.requests.unshift(message.data.dbop.new.json)
        } else {
          // Change an existing request from open to closed
          this.requests[0].req_status = message.data.dbop.new.json.req_status
          this.requests[0].req_end_time = message.data.dbop.new.json.req_end_time
          this.requests[0].work_done.work_bytes = message.data.dbop.new.json.work_done.work_bytes
        }
      }

      if (message.type === InboundMessageType.ERROR) {
        console.log('e', JSON.stringify(message.data, undefined, 2))
      }
    }, { listen: true })
  },
  async beforeDestroy() {
    if (this.stream) {
      await this.stream.close()
    }
  },
  methods: {
    async onScroll(e, pos) {
      if (this.requests.length > 9) {
        const scrollH = this.$refs.reqs.scrollHeight
        const visibleH = this.$refs.reqs.clientHeight
        if (scrollH - pos.scrollTop <= visibleH) {
          if (this.lastIndex > 0) {
            await this.fetchRequests()
          } else {
            this.hasMoreRequests = false
          }
        }
      }
    },

    async fetchRequests() {
      const userName = this.$store.getters.userName
      let params = {
        code: process.env.VUE_APP_NEWFANG_CONTRACT,
        scope: userName,
        table: 'requeststab',
        limit: 10,
        json: true,
        reverse: true
      }

      let upper_bound = 0
      let lower_bound = 0
      if (this.lastIndex !== null) {
        if ((this.lastIndex - 1) < 0) {
          upper_bound = 0
        } else {
          upper_bound = this.lastIndex - 1
        }
        if ((this.lastIndex - 10) < 0) {
          lower_bound = 0
        } else {
          lower_bound = this.lastIndex - 10
        }

        params = Object.assign({
          upper_bound: upper_bound,
          lower_bound: lower_bound
        }, params)
      }
      const { rows } = await getTableRows(params)
      if (rows.length > 0) {
        if (rows.length <= 9) {
          this.hasMoreRequests = false
        }
        this.requests = this.requests.concat(rows)
        if (this.lastIndex == null) {
          this.lastIndex = this.requests[this.requests.length - 1].id
        } else {
          this.lastIndex -= 10
        }
      } else {
        this.hasNoRequests = true
      }
    },

    totalWorkDone(workBytesArray) {
      return workBytesArray
        .map(byteString => Number(byteString))
        .reduce((total, bytes) => total + bytes, 0)
    },

    handleResetFilters() {
      this.filters.selectedApp = 'ALL_APPS'
      this.filters.selectedRequestType = 'ALL_REQUESTS'
    },

    getAppByName(name) {
      return this.filters.apps.find(app => app.name === name)
    },

    setAppFilterByName(name) {
      this.filters.selectedApp = name
    },

    clearAppFilter() {
      this.filters.selectedApp = 'ALL_APPS'
    }
  }
}
</script>

<style lang="scss" scoped>
.reqContainer {
  height: 100%;
  padding-bottom: 20px;
}

.header {
  padding-right: 20px;
}

.noReqs {
  text-align: center;
  color: #888;
  font-size: 14px;
}

.requests {
  height: 85%;
  padding-left: 20px;
  padding-right: 20px;
  overflow: auto;
}

h2 {
  color: #888;
  margin: 0;
  padding-top: 20px;
  padding-bottom: 24px;
  text-align: center;
}

.table-card {
  // background-color: #555;
  margin-bottom: 20px;
}

.typeContainer {
  text-align: center;
  padding-top: 6px;
  padding-left: 10px;
  padding-right: 10px;
  // border-right: 1px solid rgb(236, 236, 236);

  .svg-icon {
    width: 18px;
    height: 20px;
    fill: #888;
  }

  .reqType {
    font-size: 14px;
    color: #888;
    // text-transform: uppercase;
    margin-left: 4px;
  }
}

.typeContainerO {
  background: #ffc814;
}

.typeContainerC {
  background: #009149;
}

.reqIdContainer, .appIdContainer, .miscContainer {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 3px;
  text-align: center;

  .label {
    font-size: 10px;
    color: #888;
  }

  .reqId, .appId {
    font-size: 14px;
    padding-top: 4px;
  }
}

.el-icon-loading {
  font-size: 24px;
  color: #888;
  display: block;
  text-align: center;
}

.noMoreRowsText {
  font-size: 10px;
  color: #888;
  text-align: center;
}

hr {
  margin-top:20px;
}

.dividerL {
  text-align: left;
  color: #ddd;
}

.dividerR {
  text-align: right;
  color: #ddd;
}

.loader {
  width: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

.select-mini {
  width: 120px;
}

.reset-filter {
  margin-right: 4px;
}

.appId {
  color: #ff7500;
  font-weight: 600;
  cursor: pointer;
}
.appId:hover {
  opacity: 0.7;
}

.popover-heading, .popover-text {
  padding: 8px;
}
.popover-heading {
  font-weight: bold;
}
.popover-text {
  text-align: right;
}

.filter-requests-btn {
  display: block;
  margin: 0 auto;
  margin-bottom: 16px;
}
@media (max-width: 1199px) {
  .reqIdContainer, .appIdContainer, .miscContainer {
    .reqId, .appId {
      font-size: 12px;
    }
  }
}

</style>

<style>
.table-card .el-card__body{
  padding: 0px !important;
}
</style>

