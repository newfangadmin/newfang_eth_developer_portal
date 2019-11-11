<template>
  <div class="org-container">
    <el-container>
      <el-aside class="aside-container">
        <el-menu class="aside-menu" default-active="members" @select="handleMenuItemSelected">
          <el-menu-item index="members">
            <svg-icon icon-class="peoples" class="custom-icon" />
            <span>Members</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <i class="el-icon-setting" />
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <MemberSettings v-if="selectedMenuItem === 'members'" />
        <OrgSettings v-if="selectedMenuItem === 'settings'" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MemberSettings from '@/components/MemberSettings'
import OrgSettings from '@/components/OrgSettings'

export default {
  name: 'ViewOrganisation',
  components: {
    MemberSettings,
    OrgSettings
  },
  data() {
    return {
      selectedMenuItem: 'members'
    }
  },
  methods: {
    handleMenuItemSelected(selectedMenuItem) {
      this.selectedMenuItem = selectedMenuItem
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

.custom-icon {
  margin-right: 8px;
  margin-left: 5px;
}
</style>
