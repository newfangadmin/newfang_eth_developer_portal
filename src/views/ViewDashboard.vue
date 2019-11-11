<template>
  <div class="dashboardContainer">
    <el-col :xs="{span:24}" :sm="{span:24}" :md="{span:7}" :lg="{span:8}" class="widgetsContainer">
      <Widgets />
    </el-col>
    <el-col :md="{span:17}" :lg="{span:16}" class="requestsContainer hidden-sm-and-down">
      <Requests />
    </el-col>
  </div>
</template>

<script>
import Widgets from '@/components/Widgets'
import Requests from '@/components/Requests'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'ViewDashboard',
  components: {
    Widgets,
    Requests
  }
}
</script>

<style lang="scss" scoped>
.dashboardContainer {
  height: calc(100vh - 50px);
}

.widgetsContainer {
  background-color: #efefef;
  height: 100%;
}

.requestsContainer {
  height: 100%;
  -webkit-box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  -moz-box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  box-shadow: -2px 0px 4px 1px rgba(0,21,41,0.05);
  background-color: #ffffff;
}
</style>
