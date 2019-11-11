<template>
  <el-row v-loading="loading" :gutter="20" style="margin: 0; height: 100%;" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.7)">
    <h2 class="header">Bills</h2>
    <div class="bills">
      <transition-group name="fade">
        <el-col v-for="row in bills" :key="row.id" :xs="{span: 24}" :sm="{span: 12}" :md="{span:24}" :lg="{span:24}" class="billContainer">
          <el-card class="box-card">
            <el-row>
              <el-col :span="3" style="text-align: left;">
                <div class="billLabel">Bill Id</div>
                <div class="billId">#{{ row.id }}</div>
              </el-col>
              <el-col v-if="row.bill_paid" :span="6" style="text-align: left;">
                <div class="billLabel">Bill Start Date</div>
                <div class="billStartDate">{{ row.bill_start_date | moment('D MMM YYYY') }}</div>
              </el-col>
              <el-col v-if="!row.bill_paid" :span="12" style="text-align: left;">
                <div class="billLabel">Bill Start Date</div>
                <div class="billStartDate">{{ row.bill_start_date | moment('D MMM YYYY') }}</div>
              </el-col>
              <el-col v-if="row.bill_paid" :span="6" style="text-align: left;">
                <div class="billLabel">Bill Pay Date</div>
                <div class="billStartDate">{{ row.bill_pay_date | moment('D MMM YYYY') }}</div>
              </el-col>
              <el-col :span="9" style="text-align: right;">
                <div class="billLabel">Bill Amount</div>
                <div class="billAmount">{{ row.bill_amount | numFormat('$0,0.00') }}</div>
              </el-col>
            </el-row>
            <el-row class="payBtnContainer">
              <el-button v-if="!row.bill_paid" class="payBtn" icon="el-icon-coin" size="mini" @click="handlePay(row.id)">Pay Now</el-button>
              <el-tag v-else type="success" size="mini" style="text-align: right; margin-top: 6px;">Paid</el-tag>
            </el-row>
          </el-card>
        </el-col>
      </transition-group>
    </div>
  </el-row>
</template>

<script>
import { getTableRows, streamTableRows } from '@/api/blockchain'
import { InboundMessageType } from '@dfuse/client'

export default {
  name: 'Bills',
  data() {
    return {
      stream: null,
      loading: true,
      loadingText: 'Loading Bills...',

      bills: []
    }
  },
  async mounted() {
    const userName = this.$store.getters.userName

    var params = {
      code: process.env.VUE_APP_NEWFANG_CONTRACT,
      scope: userName,
      table: 'billingtab',
      limit: 10,
      json: true,
      reverse: true
    }
    const { rows } = await getTableRows(params)
    this.bills = rows
    this.loading = false

    this.stream = await streamTableRows({ code: process.env.VUE_APP_NEWFANG_CONTRACT, scope: userName, table: 'billingtab' }, async(message) => {
      if (message.type === InboundMessageType.TABLE_DELTA) {
        if (this.bills[0].id !== message.data.dbop.new.json.id) {
          this.bills.unshift(message.data.dbop.new.json)
        } else {
          this.bills.splice(0, 1, message.data.dbop.new.json)
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
    async handlePay(billId) {
      const isDemo = this.$store.getters.isDemo
      if (isDemo) {
        this.$message({
          message: 'Cannot pay bills on demo account.',
          type: 'error'
        })
      } else {
        this.$message({
          message: "Bill payment isn't available yet.",
          type: 'warning'
        })
      }

      // const name = this.$store.getters.userName
      // if (!isDemo) {
      //   this.loadingText = 'Paying Bill...'
      //   this.loading = true
      //   var params = {
      //     user_name: name,
      //     bill_id: billId,
      //     amount: Number(this.bills[0].bill_amount)
      //   }
      //   this.curAmt = Number(Number(this.bills[0].bill_amount).toFixed(2))
      //   await payBill(params)
      //   this.loading = false
      //   this.loadingText = 'Loading Bills...'
      // } else {
      //   this.$message({
      //     message: 'Cannot Pay Bill on demo account',
      //     type: 'error'
      //   })
      // }
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

.bills {
  height: 100%;
  overflow: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 80px;
}

.billContainer {
  margin-bottom: 20px;
}

.box-card {
  text-align: center;
}

.billLabel {
  font-size: 10px;
  color: #888;
}

.billId, .billStartDate {
  font-size: 14px;
  line-height: 24px;
}

.billAmount {
  font-weight: 600;
  font-size: 20px;
}

.payBtnContainer {
  text-align: right;
}

.payBtn {
  margin-top: 10px;
}

hr {
  margin-top:20px;
  border-top: 1px solid #ddd;
}

.noBills {
  text-align: center;
  color: #888;
  font-weight: 200;
}
</style>
