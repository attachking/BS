<template>
  <div class="login">
    <div class="head_login">
      <img style="vertical-align: text-top;" alt="logo" src="../../common/img/xf-logo.png">
      <span>讯丰业务系统内部运维平台</span>
    </div>
    <div class="banner">
      <div class="login-aside">
        <el-form :model="logins" :rules="rules" ref="form">
          <el-form-item prop="username" class="fm-item1">
            <el-input autofocus placeholder="请输入用户名" prefix-icon="xffont xf-yonghu" v-model="logins.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="fm-item2">
            <el-input type="password" placeholder="请输入密码" prefix-icon="xffont xf-suo"
                      v-model="logins.password" @keydown.native.enter="login"></el-input>
          </el-form-item>
          <el-form-item style="margin: 10px 0;">
            <el-radio v-model="logins.userType" :label="1">普通用户</el-radio>
            <el-radio v-model="logins.userType" :label="2">管理员</el-radio>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="remember"
              active-text="自动登录">
            </el-switch>
          </el-form-item>
          <el-form-item class="center">
            <el-button type="warning" @click="login" class="login-btn" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="foot_login">
        技术支持：<a class="href" href="http://www.xfxxgs.com/" target="_blank">河南讯丰信息技术有限公司</a> 建议使用IE10+,Chrome,Firefox,360浏览器极速模式访问
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import {setCookie, getCookies, COOKIE_TYPE} from '../../common/js/cookie'
import {post} from '../../common/js/http'
import event, {EVENT_TYPES} from '../../common/js/event'

export default {
  name: 'login',
  data() {
    return {
      logins: {
        username: '',
        password: '',
        userType: 1 // 1为普通用户，2为管理员
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('只能输入数字和字母'))
            }
          }
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9_]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('只能输入数字、字母或下划线'))
            }
          }
        }]
      },
      remember: false,
      loading: false
    }
  },
  methods: {
    login() {
      if (this.loading) return
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          post('service/business/college/iccUser/iccUser/login.xf', {
            userAccount: this.logins.username,
            password: this.logins.password,
            userType: this.logins.userType
          }).then(res => {
            this.loading = false
            if (res.error.result === 1) {
              res.result.authenType = Number(res.result.authenType)
              res.result.userType = Number(res.result.userType)
              this.$message({
                type: 'success',
                message: '登录成功!'
              })
              this.saveStatus(1)
              this.setCategory(Number(res.result.authenType))
              this.setUid(res.result.userId + '')
              this.setNickname(res.result.userName)
              this.setUserType(res.result.userType)
              setCookie(COOKIE_TYPE.category, res.result.authenType, 30)
              if (this.remember) {
                setCookie(COOKIE_TYPE.status, 1, 30)
                setCookie(COOKIE_TYPE.username, res.result.userAccount, 30)
                setCookie(COOKIE_TYPE.password, res.result.password, 30)
                setCookie(COOKIE_TYPE.nickname, res.result.userName, 30)
                setCookie(COOKIE_TYPE.uid, res.result.userId, 30)
                setCookie(COOKIE_TYPE.userType, res.result.userType, 30)
              } else {
                setCookie(COOKIE_TYPE.status, 1)
                setCookie(COOKIE_TYPE.username, res.result.userAccount)
                setCookie(COOKIE_TYPE.password, res.result.password)
                setCookie(COOKIE_TYPE.nickname, res.result.userName)
                setCookie(COOKIE_TYPE.uid, res.result.userId)
                setCookie(COOKIE_TYPE.userType, res.result.userType)
              }
              if (res.result.authenType === 1) {
                this.$router.replace({
                  name: 'myself'
                })
              } else {
                this.$router.replace({
                  name: 'admin'
                })
              }
              event.$emit(EVENT_TYPES.handleLogin)
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    ...mapMutations({
      'saveStatus': 'SET_STATUS',
      'setCategory': 'SET_CATEGORY',
      'setUid': 'SET_UID',
      'setNickname': 'SET_NICKNAME',
      'setUserType': 'SET_USER_TYPE'
    })
  },
  created() {
    this.logins.userType = Number(getCookies()[COOKIE_TYPE.category] || 1)
  }
}
</script>
<style lang="scss">
  @import "../../common/style/variables";

  .login {
    width: 100%;
    min-width: 1000px;
    position: relative;
    height: 100%;
    overflow: hidden;
    background: url(../../common/img/bg.jpg) no-repeat;
    background-size: 100% 100%;
    .head_login {
      height: 125px;
      margin: 26px auto;
      overflow: hidden;
      width: 1200px;
      color: white;
      font-size: 30px;
      line-height: 125px;
      text-align: center;
    }
    .banner {
      width: 100%;
      height: 100%;
      position: relative;
      padding-top: 55px;
    }
    .login-aside {
      width: 400px;
      padding: 20px 40px;
      border-radius: 5px;
      background: rgba(0,0,0,0.5);
      margin: 0 auto;
    }
    .fm-item1 {
      margin-top: 45px;
    }
    .fm-item2 {
      margin-top: 25px;
      margin-bottom: 0;
    }
    .foot_login {
      position: absolute;
      width: 100%;
      height: 145px;
      text-align: center;
      color: white;
      bottom: 180px;
      line-height: 100px;
      font-size: 14px;
      left: 0;
    }
    .center{
      text-align: center;
    }
    .login-btn{
      width: 100%;
    }
    .href{
      color: #d9d9d9;
      text-decoration: none;
      font-weight: bold;
      &:hover{
        color: $--color-primary;
      }
    }
    .el-switch__label,.el-radio{
      color: #fff;
    }
  }
</style>
