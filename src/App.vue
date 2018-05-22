<template>
  <div id="app">
    <el-menu
      :default-active="active"
      class="home-top"
      mode="horizontal"
      background-color="#262626"
      text-color="#bbb"
      active-text-color="#409EFF"
      router>
      <li class="title">
        <img style="width: 80px;display: inline-block;vertical-align: middle;" src="./common/img/xf-logo.png" alt="">
        &nbsp;
        <span>讯丰业务系统内部运维平台</span>
      </li>
      <template v-if="status === 1">
        <span class="home-top-center" v-if="category === 1 && userAssets.serviceTimeStart">服务时间：{{userAssets.serviceTimeStart}} 至 {{userAssets.serviceTimeEnd}}</span>
        <span class="home-top-center" v-if="category === 1 && !userAssets.serviceTimeStart">
          总条数：<span class="red"><grow-num :value="userAssets.sumCount || 0"></grow-num></span>&nbsp;&nbsp;
        已使用条数：<span class="red"><grow-num :value="userAssets.authenCount || 0"></grow-num></span>&nbsp;&nbsp;
        剩余条数：<span class="red"><grow-num :value="(userAssets.sumCount || 0) - (userAssets.authenCount || 0)"></grow-num></span>
      </span>
        <div class="item" v-if="category === 1">
          <el-menu-item index="/manage/myself">首页</el-menu-item>
          <el-menu-item index="/shopping">套餐购买</el-menu-item>
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="myself">个人中心</el-dropdown-item>
              <el-dropdown-item command="order">我的订单</el-dropdown-item>
              <el-dropdown-item command="invoice">我的发票</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="search">认证企业</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="item" v-if="category === 2">
          <el-menu-item index="">
            <i class="el-icon-time"></i>
            <span>{{time}}</span>
          </el-menu-item>
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="mechanism">系统管理</el-dropdown-item>
              <el-dropdown-item command="adminOrder">订单管理</el-dropdown-item>
              <el-dropdown-item command="dataview">概况统计</el-dropdown-item>-->
              <el-dropdown-item command="adminPassword">
                <i class="el-icon-edit"></i>
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <i class="el-icon-back"></i>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </el-menu>
    <transition name="el-fade-in" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {setCookie, COOKIE_TYPE} from './common/js/cookie'
import event, {EVENT_TYPES} from './common/js/event'
import {post} from './common/js/http'
import {dateFormat} from './common/js/clazz'

export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'status',
      'category',
      'userAssets',
      'uid',
      'nickname'
    ])
  },
  data() {
    return {
      active: '',
      time: ''
    }
  },
  methods: {
    ...mapMutations({
      setStatus: 'SET_STATUS',
      setUserAssets: 'SET_USER_ASSETS'
    }),
    ...mapActions([
      'getDictionaries'
    ]),
    confirm() {
      this.$confirm('确定注销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      }).catch(() => {
        // 取消
      })
      return false
    },
    logout() {
      this.setStatus(0)
      setCookie(COOKIE_TYPE.username, 0, -1)
      setCookie(COOKIE_TYPE.password, 0, -1)
      setCookie(COOKIE_TYPE.uid, 0, -1)
      setCookie(COOKIE_TYPE.status, 0, -1)
      this.$message({
        type: 'success',
        message: '注销成功!'
      })
      setTimeout(() => {
        this.$router.replace({
          name: 'login'
        })
      }, 20)
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.confirm()
      } else {
        this.$router.push({
          name: command
        })
      }
    },
    getAssets() {
      if (this.category !== 1 || this.status !== 1) return
      post('service/business/college/iccUser/iccUser/getServiceTime.xf', {
        userId: this.uid
      }).then((res) => {
        if (res.error.result === 1) {
          this.setUserAssets(res.result)
        }
      })
    },
    handleOnLoad(route) { // 记住密码的首次进入处理
      if (route.name === 'search' && this.category === 2 && this.status === 1) {
        this.$router.replace({
          name: 'admin'
        })
      }
    }
  },
  watch: {
    $route(newVal) {
      this.active = newVal.path
      this.handleOnLoad(newVal)
    }
  },
  created() {
    this.getAssets()
    this.getDictionaries()
    this.active = this.$route.path
    event.$on(EVENT_TYPES.logout, () => {
      this.logout()
    })
    event.$on(EVENT_TYPES.handleLogin, () => {
      this.getAssets()
    })
    setInterval(() => {
      this.time = dateFormat.call(new Date(), 'yyyy-MM-dd hh:mm:ss')
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
  @import './common/style/variables';

  #app {
    min-width: 1300px;
    min-height: 800px;
    width: 100%;
    height: 100%;
    padding-top: 55px;
    & > .el-menu--horizontal{
      border-bottom: none;
    }
  }
  .home-top {
    padding: 0 20px;
    text-align: center;
    position: fixed;
    z-index:5;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 1300px;
    .title{
      padding: 0 10px 0 0;
      float: left;
      height: 55px;
      line-height: 60px;
      margin: 0;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      border-bottom: 2px solid transparent;
      color: #fff;
      font-size: 14px;
      display: inline-block;
      &:focus{
        outline: none;
      }
    }
    .home-top-center{
      display: inline-block;
      line-height: 55px;
      font-size: 14px;
      color: #bbb;
      &:focus{
        outline: none;
      }
    }
    .item{
      &:focus{
        outline: none;
      }
      float: right;
      display: inline-block;
    }
    .el-menu-item{
      .xffont{
        font-size: 20px;
        margin: 0 5px 0 0;
      }
    }
  }
  .el-dropdown-link{
    color: #bbb;
    padding: 0 5px;
    &:hover{
      cursor: pointer;
    }
  }
  .red{
    color: red;
  }
</style>
