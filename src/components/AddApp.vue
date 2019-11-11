<template>
  <div class="documentation-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" style="margin-bottom:10px;">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="110px" class="demo-ruleForm">
          <el-form-item label="App Name" prop="appName">
            <el-input v-model="ruleForm.appName" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="App ID" prop="appID">
            <el-input v-model="ruleForm.appID" type="text" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="k Value" prop="kVal">
            <div class="block">
              <el-slider v-model="ruleForm.kVal" :min="min" :max="max" show-input input-size="mini" @change="computeExpansion" />
            </div>
          </el-form-item>
          <el-form-item label="N Value" prop="nVal">
            <div class="block">
              <el-slider v-model="ruleForm.nVal" :min="min" :max="max" show-input input-size="mini" @change="computeExpansion" />
            </div>
          </el-form-item>
          <el-form-item label="Config Details">
            <el-row class="panel-group">
              <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-heading">Speed</div>
                  <div v-if="validConfig" class="card-panel-text">You file will be downloaded, simultaneously from between <strong>{{ kv }}</strong> to <strong>{{ nv }}</strong> nodes.</div>
                  <div v-if="!validConfig" class="card-panel-text">Invalid Config!</div>
                  <div class="card-panel-heading">Redundancy</div>
                  <div v-if="validConfig" class="card-panel-text">You file will be broken up into <strong>{{ nv }}</strong> shares and needs any <strong>{{ kv }}</strong> shares to be retrieved.</div>
                  <div v-if="!validConfig" class="card-panel-text">Invalid Config!</div>
                  <div class="card-panel-heading">Cost</div>
                  <div v-if="validConfig" class="card-panel-text">The expansion cost of your config is <strong>N/k = {{ expVal }}x</strong><br>i.e. a <strong>10MB</strong> file will be expanded to <strong>{{ (10*expVal).toFixed(2) }}MB</strong>.</div>
                  <div v-if="!validConfig" class="card-panel-text">Invalid Config!</div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="formBtns">
            <el-button type="info" plain :disabled="loading" @click="closeForm()">CANCEL</el-button>
            <el-button type="info" plain :disabled="loading" @click="resetForm('ruleForm')">RESET</el-button>
            <el-button v-if="!loading" class="submitFormBtn" @click="submitForm('ruleForm')">ADD APP</el-button>
            <el-button v-if="loading" class="submitFormBtn" disabled="disabled"><i class="el-icon-loading" /></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
  .el-dialog__body {
    padding-bottom: 0;
  }

  .el-slider__bar {
    background-color: #ff7500 !important;
  }
  .el-slider__button {
    border:solid 2px #ff7500 !important;
  }
  .el-slider__input {
    width: 90px;
  }
  .el-input-number__decrease, .el-input-number__increase {
    color: #ff7500;
    background: #fff;
    border-color: #efefef;
  }
  .el-input-number__decrease:hover, .el-input-number__increase:hover {
    color: #fff;
    background: #ff7500;
    border-color: #ff7500;
  }
  .el-input__inner:hover {
    border-color: #ff7500;
  }
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 18px;
    }

    .card-panel {
      min-height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #222;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      border-radius: 4px;
      line-height: 24px;

      .card-panel-heading {
        font-weight: bold;
        margin-left: 12px;
        margin-top: 6px;
      }

      .card-panel-text {
        margin-left: 12px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        padding-right: 12px;
        padding-bottom: 6px;
      }

      .card-panel-num {
        font-size: 18px;
      }
    }
  }
</style>

<script>
import { addApp } from '@/api/server'

export default {
  name: 'Documentation',
  components: {
  },
  data() {
    var validateKVal = (rule, value, callback) => {
      if ((this.ruleForm.nVal - value) < 1) {
        callback(new Error('k Val must be lesser than than N Val'))
      } else {
        callback()
      }
    }
    var validateNVal = (rule, value, callback) => {
      if ((value - this.ruleForm.kVal) < 1) {
        callback(new Error('N Val must be greater than k Val'))
      } else {
        callback()
      }
    }
    var validateAppName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the App name'))
      } else if (value.length > 12) {
        callback(new Error('App name must be less than 12 characters.'))
      } else {
        callback()
      }
    }
    var validateAppID = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the App ID'))
      } else if (!/^([a-z1-5]{12})$/.test(value)) {
        callback(new Error('App ID can only be a-z, 1-5 and 12 chars long.'))
      } else {
        callback()
      }
    }
    return {
      min: 1,
      max: 6,
      nv: 6,
      kv: 4,
      validConfig: true,
      api: null,
      loading: false,
      ruleForm: {
        kVal: 4,
        nVal: 6,
        appName: '',
        appID: this.randomAppID()
      },
      rules: {
        kVal: [
          { validator: validateKVal, trigger: 'blur' }
        ],
        nVal: [
          { validator: validateNVal, trigger: 'blur' }
        ],
        appName: [
          { validator: validateAppName, trigger: 'blur' }
        ],
        appID: [
          { validator: validateAppID, trigger: 'blur' }
        ]
      },
      expVal: (10 / 6).toFixed(2)
    }
  },
  methods: {
    randomChar(string) {
      const randomIndex = Math.floor(Math.random() * string.length)
      return string[randomIndex]
    },

    randomAppID() {
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      const numbers = '12345'

      let result = ''
      for (let i = 0; i < 12; i++) {
        if (i < 8) {
          result += this.randomChar(letters)
        } else {
          result += this.randomChar(numbers)
        }
      }
      return result
    },

    closeForm() {
      this.resetForm('ruleForm')
      this.$root.$emit('closeAddAppForm')
    },

    async submitForm(formName) {
      const isDemo = this.$store.getters.isDemo
      if (!isDemo) {
        var validity = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            validity = true
            this.loading = true
          } else {
            console.log('error submit!!')
            return false
          }
        })
        if (validity) {
          try {
            const data = {
              'name': this.ruleForm.appID,
              'display_name': this.ruleForm.appName,
              'k_val': this.ruleForm.kVal,
              'n_val': this.ruleForm.nVal
            }
            await addApp(data)
            this.loading = false
            this.resetForm('ruleForm')
            this.$root.$emit('newAppAdded')
            this.ruleForm.appID = this.randomAppID()
          } catch (e) {
            this.loading = false
          }
        }
      } else {
        this.$message({
          message: 'Cannot add app from demo account',
          type: 'error'
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.computeExpansion()
    },
    computeExpansion() {
      if ((this.ruleForm.nVal - this.ruleForm.kVal) < 1) {
        this.expVal = '<span>Invalid Config!</span>'
        this.validConfig = false
      } else {
        this.expVal = (this.ruleForm.nVal / this.ruleForm.kVal).toFixed(2)
        this.validConfig = true
      }
      this.nv = this.ruleForm.nVal
      this.kv = this.ruleForm.kVal
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  position: relative;
  padding: 10px;
}

.submitFormBtn {
  min-width: 100px;
}

.formBtns {
  float: right;
}
</style>
