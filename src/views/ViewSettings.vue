<template>
  <div class="settings-container">
    <el-container>
      <el-aside class="aside-container">
        <el-menu class="aside-menu" default-active="profile" @select="handleSettingSelected">
          <el-menu-item index="profile">
            <i class="el-icon-user" />
            <span>Profile</span>
          </el-menu-item>
          <el-menu-item index="account">
            <i class="el-icon-view" />
            <span>Account</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <ProfileSettings v-if="selectedSetting === 'profile'" />
        <AccountSettings v-if="selectedSetting === 'account'" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ProfileSettings from '@/components/ProfileSettings'
import AccountSettings from '@/components/AccountSettings'

export default {
  name: 'ViewSettings',
  components: {
    ProfileSettings,
    AccountSettings
  },
  data() {
    return {
      selectedSetting: 'profile'
    }
  },
  methods: {
    handleSettingSelected(selectedSetting) {
      this.selectedSetting = selectedSetting
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-item.is-active {
  outline: 0;
  background-color: #EFEFEF;
  color: rgb(255, 117, 0);
}
</style>
