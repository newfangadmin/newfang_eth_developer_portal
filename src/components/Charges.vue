<template>
  <div v-loading="loading" class="chaContainer" element-loading-text="Loading Charges..." element-loading-background="rgba(0, 0, 0, 0.7)">
    <el-row :span="24" type="flex" class="header">
      <el-col :span="4"><h2>Charges</h2></el-col>
      <el-col :span="20" align="right" style="padding-top: 20px;">
        <el-button v-if="areFiltersActive" icon="el-icon-refresh-left" size="mini" circle class="reset-filter" @click="handleResetFilters" />
        <el-select v-model="filters.selectedChargeType" placeholder="Filter by app" size="mini" class="select-mini" :disabled="hasNoCharges">
          <el-option
            key="ALL_CHARGES"
            label="All charges"
            value="ALL_CHARGES"
          />
          <el-option
            v-for="type in filters.chargeTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
        <el-select v-model="filters.selectedApp" placeholder="Filter by app" size="mini" class="select-mini" :disabled="hasNoCharges">
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
    <div v-if="hasNoCharges" class="noCharges">No charges yet.</div>
    <div v-else ref="charges" v-scroll="onScroll" class="charges">
      <transition-group name="fade">
        <el-col v-for="row in filteredCharges" :key="row.id" :ref="row.id" :span="24">
          <el-card class="card">
            <el-row>
              <el-col :span="3" class="card-col">
                <el-row><div class="card-col__label">App ID</div></el-row>
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
                  <el-button v-if="filters.selectedApp !== row.app_name" size="mini" class="filter-charges-btn" @click="setAppFilterByName(row.app_name)">Filter charges from {{ row.app_name }}</el-button>
                  <el-button v-else size="mini" class="filter-charges-btn" @click="clearAppFilter">Clear filter</el-button>
                  <el-row slot="reference"><div class="card-col__value appId">{{ row.app_name }}</div></el-row>
                </el-popover>
              </el-col>
              <el-col :span="4" class="card-col">
                <el-row><div class="card-col__label">Request ID</div></el-row>
                <el-row><div class="card-col__value">{{ row.request_id }}</div></el-row>
              </el-col>
              <el-col :span="1" class="dividerL">|</el-col>
              <el-col :span="3" class="card-col">
                <el-row><div class="card-col__label">File Size</div></el-row>
                <el-row><div class="card-col__value">{{ row.file_size | fileSizeFilter }}</div></el-row>
              </el-col>
              <el-col :span="1" class="dividerR">|</el-col>
              <el-col :span="3" class="card-col">
                <el-row><div class="card-col__label">Charge Type</div></el-row>
                <el-row><div class="card-col__value">{{ row.charge_type }}</div></el-row>
              </el-col>
              <el-col :span="4" class="card-col">
                <el-row><div class="card-col__label">Charge Time</div></el-row>
                <el-row><div class="card-col__value">{{ row.charge_time | moment("MMM D, hh:mm a") }}</div></el-row>
              </el-col>
              <el-col :span="4" class="card-col">
                <el-row><div class="card-col__label">Charge Amount</div></el-row>
                <el-row><div class="card-col__value">${{ row.charge_amount | removeTrailingZerosFilter }}</div></el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </transition-group>
      <el-col :span="6" :offset="9">
        <i v-if="hasMoreCharges" class="el-icon-loading loader" />
        <div v-else class="noMoreRowsText">No more requests.</div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getTableRows, streamTableRows } from '@/api/blockchain'
import { InboundMessageType } from '@dfuse/client'
import removeTrailingZeros from 'remove-trailing-zeros'

export default {
  name: 'Charges',
  filters: {
    chargeTypeFilter(val) {
      const chargeType = val.split('|')[0]
      return chargeType
    },

    requestIdFilter(val) {
      const requestId = val.split('|')[1]
      return requestId
    },

    fileSizeFilter(val) {
      const digitCount = val.toString().length
      if (digitCount < 4) {
        return (val).toFixed(2) + ' B'
      } else if (digitCount < 7) {
        return (val / 1000).toFixed(2) + ' KB'
      } else {
        return (val / 1000 / 1000).toFixed(2) + ' MB'
      }
    },

    removeTrailingZerosFilter(val) {
      return removeTrailingZeros(val)
    }
  },
  data() {
    return {
      loading: true,
      stream: null,

      charges: [],
      lastIndex: null,
      hasMoreCharges: true,
      hasNoCharges: false,

      filters: {
        apps: [],
        selectedApp: 'ALL_APPS',
        chargeTypes: ['RENT', 'B/W'],
        selectedChargeType: 'ALL_CHARGES'
      }
    }
  },
  computed: {
    filteredCharges() {
      var data = this.charges
      if (this.filters.selectedApp !== 'ALL_APPS') {
        data = data.filter(charge => charge.app_name === this.filters.selectedApp)
      }
      if (this.filters.selectedChargeType !== 'ALL_CHARGES') {
        data = data.filter(charge => charge.charge_type === this.filters.selectedChargeType)
      }
      return data
    },
    areFiltersActive() {
      return (
        this.filters.selectedApp !== 'ALL_APPS' ||
        this.filters.selectedChargeType !== 'ALL_CHARGES'
      )
    }
  },
  watch: {
    async filteredCharges(newFilteredCharges, oldFilteredCharges) {
      if (newFilteredCharges.length < 9 && this.hasMoreCharges) {
        await this.fetchCharges()
      }
    }
  },
  async mounted() {
    const userName = this.$store.getters.userName
    this.filters.apps = this.$store.getters.orgApps
    await this.fetchCharges()
    this.loading = false

    this.stream = await streamTableRows({ code: process.env.VUE_APP_NEWFANG_CONTRACT, scope: userName, table: 'chargestab' }, (message) => {
      if (message.type === InboundMessageType.TABLE_DELTA) {
        this.charges.unshift(message.data.dbop.new.json)
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
      if (this.charges.length > 9) {
        const scrollH = this.$refs.charges.scrollHeight
        const visibleH = this.$refs.charges.clientHeight
        if (scrollH - pos.scrollTop <= visibleH) {
          if (this.lastIndex > 0) {
            await this.fetchCharges()
          } else {
            this.hasMoreCharges = false
          }
        }
      }
    },

    async fetchCharges() {
      const userName = this.$store.getters.userName
      let params = {
        code: process.env.VUE_APP_NEWFANG_CONTRACT,
        scope: userName,
        table: 'chargestab',
        limit: 10,
        json: true,
        reverse: true
      }

      let upper_bound = 0
      let lower_bound = 0
      if (this.lastIndex != null) {
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
      this.loading = false
      if (rows.length > 0) {
        if (rows.length <= 9) {
          this.hasMoreCharges = false
        }
        this.charges = this.charges.concat(rows)
        if (this.lastIndex == null) {
          this.lastIndex = this.charges[this.charges.length - 1].id
        } else {
          this.lastIndex -= 10
        }
      } else {
        this.hasNoCharges = true
      }
    },

    handleResetFilters() {
      this.filters.selectedApp = 'ALL_APPS'
      this.filters.selectedChargeType = 'ALL_CHARGES'
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
.chaContainer {
  height: 100%;
  padding-bottom: 20px;
}

.noCharges {
  text-align: center;
  color: #888;
  font-size: 14px;
}

.header {
  padding-right: 20px;
}

.charges {
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

.card {
  // background-color: #555;
  margin-bottom: 20px;
}

.card-col {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 3px;
  text-align: center;

  .card-col__label {
    font-size: 10px;
    color: #888;
  }

  .card-col__value {
    font-size: 14px;
    padding-top: 12px;
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

.filter-charges-btn {
  display: block;
  margin: 0 auto;
  margin-bottom: 16px;
}
@media (max-width: 1199px) {
  .card-col {
    .card-col__value {
      font-size: 12px;
    }
  }
}
</style>
