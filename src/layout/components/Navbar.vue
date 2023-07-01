<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="app-breadcrumb">
      灰心星球科技股份有限公司
      <span class="breadBtn">体验版</span>
  </div>

  
    <div class="right-menu">
      <ScreenFull class="right-menu-item"></ScreenFull>
      <ThemePicker class="right-menu-item"></ThemePicker>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="getffPhoto" v-imgeerror="defaultImg" class="user-avatar">
          <span class="name">{{name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/dadaguai12138/hrsaas/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    

  </div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import Hamburger from '@/components/Hamburger'

export default {
  data(){
    return {
    defaultImg:require('@/assets/common/head.jpg')
    }
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'getffPhoto'
    ])
  },
  methods: {
    ...mapActions(['user/logout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this['user/logout']()
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #ffffff;
  cursor: text;
  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

     
   .name {
          color: #fff;
          vertical-align: middle;
          margin-left:5px;
          cursor: pointer;
   }
   
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: middle;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .right-menu-item {
    vertical-align: middle;
    height: unset;
}
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
 
}
</style>
