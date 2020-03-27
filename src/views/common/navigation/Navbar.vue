<template>
  <el-menu class="navbar" mode="horizontal">
    <div style="float: left;font-size: 25px;line-height: 50px;margin-left: 15px;">汇客多掌柜宝后台管理系统</div>
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->

    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->

    <div class="right-menu">
      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->

      <!-- <el-tooltip effect="dark" :content="'全屏显示'" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click" @visible-change="toggleUserAvatar">
        <div class="avatar-wrapper">
          <span class="user-avatar">{{ shop }}</span>
          <i :class="iClass"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
           <span style="display:block;">{{ avatar + " " + name }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'

export default {
  data() {
    return {
      iClass: "el-icon-arrow-down",
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    // Screenfull,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'shop',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    toggleUserAvatar(flag) {
      if (flag) {
        this.iClass = "el-icon-arrow-up"
      } else {
        this.iClass = "el-icon-arrow-down"
      }
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  min-width: 800px;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  z-index: 1002;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
