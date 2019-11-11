<template>
  <div class="billing-container">
    <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:8}" :lg="{span:8}" class="billsContainer">
      <Bills />
    </el-col>
    <el-col :md="{span:16}" :lg="{span:16}" class="chargesContainer hidden-sm-and-down">
      <Charges />
    </el-col>
  </div>
</template>

<script>
import Bills from '@/components/Bills'
import Charges from '@/components/Charges'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'ViewBilling',
  components: {
    Bills,
    Charges
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.billing {
  &-container {
    height: calc(100vh - 50px);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.billsContainer {
  background-color: #efefef;
  height: 100%;
}

.chargesContainer {
  height: 100%;
  -webkit-box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  -moz-box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  background-color: #ffffff;
}
</style>
