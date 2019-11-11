<template>
  <el-row v-loading="loading" :gutter="20" style="margin: 0; height: 100%;" element-loading-text="Loading Stats..." element-loading-background="rgba(0, 0, 0, 0.7)">
    <h2 class="header">Stats</h2>
    <div class="widgets">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="widgetContainer">
        <el-card class="box-card">
          <el-row>
            <el-col :span="3" style="text-align: left;">
              <svg-icon icon-class="dollar" />
            </el-col>
            <el-col :span="9">
              <div class="widgetHeader">Total Spend</div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <count-to use-easing :start-val="0" :end-val="usageAmount" :decimals="8" :duration="1500" class="widgetText" prefix="$" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="widgetContainer">
        <el-card class="box-card">
          <el-row>
            <el-col :span="3" style="text-align: left;">
              <svg-icon icon-class="database" />
            </el-col>
            <el-col :span="9">
              <div class="widgetHeader">Storage Used</div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <count-to use-easing :start-val="0" :end-val="totalUp" :decimals="2" :duration="2500" class="widgetText" suffix=" GB" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="widgetContainer">
        <el-card class="box-card">
          <el-row>
            <el-col :span="3" style="text-align: left;">
              <svg-icon icon-class="wifi" />
            </el-col>
            <el-col :span="9">
              <div class="widgetHeader">Bandwidth Used</div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <count-to use-easing :start-val="0" :end-val="totalDown" :decimals="2" :duration="2500" class="widgetText" suffix=" GB" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="widgetContainer">
        <el-card class="box-card">
          <el-row>
            <el-col :span="3" style="text-align: left;">
              <svg-icon icon-class="upload" />
            </el-col>
            <el-col :span="9">
              <div class="widgetHeader">Total Uploads</div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <count-to use-easing :start-val="0" :end-val="totalUpCount" :decimals="0" :duration="2500" class="widgetText" suffix="↑" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="widgetContainer">
        <el-card class="box-card">
          <el-row>
            <el-col :span="3" style="text-align: left;">
              <svg-icon icon-class="download" />
            </el-col>
            <el-col :span="9">
              <div class="widgetHeader">Total Downloads</div>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <count-to use-easing :start-val="0" :end-val="totalDownCount" :decimals="0" :duration="2500" class="widgetText" suffix="↓" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { streamTableRows } from '@/api/blockchain'
import { InboundMessageType } from '@dfuse/client'

export default {
  name: 'Widgets',
  components: {
    CountTo
  },
  data() {
    return {
      stream: null,
      loading: true,

      usageAmount: 0,
      totalUp: 0,
      totalDown: 0,
      totalUpCount: 0,
      totalDownCount: 0
    }
  },
  async mounted() {
    const userName = this.$store.getters.userName

    this.stream = await streamTableRows({ code: process.env.VUE_APP_NEWFANG_CONTRACT, scope: userName, table: 'usagetab' }, (message) => {
      if (message.type === InboundMessageType.TABLE_SNAPSHOT) {
        if (message.data.rows.length !== 0) {
          const data = message.data.rows[0].json
          this.setTableData(data)
        }
        this.loading = false
      }
      if (message.type === InboundMessageType.TABLE_DELTA) {
        const data = message.data.dbop.new.json
        this.setTableData(data)
      }

      if (message.type === InboundMessageType.ERROR) {
        console.log('e', JSON.stringify(message.data, undefined, 2))
      }
    }, { fetch: true, listen: true })
  },
  async beforeDestroy() {
    if (this.stream) {
      await this.stream.close()
    }
  },
  methods: {
    setTableData(data) {
      this.usageAmount = Number(data.total_spend)
      this.totalUp = data.total_up_bytes / 1000000000
      this.totalDown = data.total_down_bytes / 1000000000
      this.totalUpCount = data.total_up_count
      this.totalDownCount = data.total_down_count
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  color: #888;
  margin-top: 20px;
  margin-bottom: 24px;
  text-align: center;
}

.widgets {
  height: 100%;
  overflow: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 80px;
}

.widgetContainer {
  margin-bottom: 20px;
}

.box-card {
  text-align: center;
}

.svg-icon {
  fill: #ff7500;
  width: 32px;
  height: 32px;
}

.widgetHeader {
  color: #888;
  padding-top: 6px;
  font-size: 16px;
  text-align: left;
}

.widgetText {
  color: #222;
  font-size: 20px;
  font-weight: 600;
  text-align: right;
  line-height: 30px;
}

.widgetSubText {
  font-size: 10px;
  font-weight: 600;
}

@media (max-width: 1199px) {
  .svg-icon {
    width: 20px;
    height: 20px;
  }

  .widgetHeader {
    padding-top: 5px;
    font-size: 10px;
  }

  .widgetText {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
}
</style>
