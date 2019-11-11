<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-tag type="info" effect="plain" style="margin-right: 16px;">
        <svg-icon icon-class="peoples" style="margin-bottom: 2px; margin-right: 4px;" />
        <span>{{ orgName }}</span>
      </el-tag>
      <el-dropdown class="avatar-container" trigger="click">
        <avatar :username="userName" :size="32" background-color="#efefef" color="#888" />
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <div @click="settings">Settings</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="logout">Log out</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Avatar from 'vue-avatar'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Avatar
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'orgName'
    ]),
    userName() {
      const firstName = this.$store.getters.firstName
      const lastName = this.$store.getters.lastName
      return `${firstName} ${lastName}`
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    async logout() {
      await this.$store.dispatch('user/logoutUser')
      this.$router.push(`/login`)
    },

    async settings() {
      this.$router.push('/settings')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: #efefef;
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 45px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
      }
    }
  }

  .vue-avatar--wrapper {
    font-family: 'Titillium Web' !important;
    font-weight: 600 !important;
    cursor: pointer;
  }
}
</style>
