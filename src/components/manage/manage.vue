<template>
  <div class="manage">
    <div class="container">
      <div class="left">
        <el-menu :default-active="active" router class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#333" text-color="#fff">
          <el-menu-item index="/manage/myself">
            <i class="el-icon-setting"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
          <el-menu-item index="/manage/order">
            <i class="el-icon-document"></i>
            <span slot="title">我的订单</span>
          </el-menu-item>
          <el-menu-item index="/manage/invoice">
            <i class="el-icon-message"></i>
            <span slot="title">我的发票</span>
          </el-menu-item>
          <el-menu-item index="/manage/password">
            <i class="el-icon-question"></i>
            <span slot="title">修改密码</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right">
        <div class="right-in">
          <transition name="el-fade-in" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px">
        <p class="tips" v-if="days">
          您的服务时间剩余 <span class="red">{{days}}</span> 天到期，
          到期之后，网站自主认证功能将停用，若您已续约，请联系管理员进行更新服务时间；若未续约请联系管理员进行咨询，咨询电话：0371-86502016。
        </p>
        <p class="tips" v-if="orderNum">您有订单尚未完成， <el-button type="text" @click="goToPage('order')">前去支付<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
        <p class="tips" v-if="logisticsNum">您的发票已寄出， <el-button type="text" @click="goToPage('invoice')">前去查看物流信息<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
        <p class="tips" v-if="corpNum">本月新增自主认证企业数 <span class="red">{{corpNum}}</span> 家， <el-button type="text" @click="goToPage('search')">查看详情<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {manageMixin} from '../../common/js/mixin'
import {post} from '../../common/js/http'
import {getCookies, setCookie, COOKIE_TYPE} from '../../common/js/cookie'
import {mapGetters} from 'vuex'

export default {
  mixins: [manageMixin],
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      days: 0, // 剩余服务天数
      orderNum: 0, // 未完成订单数
      logisticsNum: 0, // 物流信息数
      corpNum: 0 // 新增自主认证企业数
    }
  },
  methods: {
    getPrompt() {
      post('service/business/college/iccUser/iccUser/promptMessage.xf', {
        userId: this.uid
      }).then(res => {
        this.days = res.result.days
        this.orderNum = res.result.orderNum
        this.logisticsNum = res.result.logisticsNum
        this.corpNum = res.result.corpNum
        if (this.days === 0 && this.orderNum === 0 && this.logisticsNum === 0 && this.corpNum === 0) return
        if (!getCookies()[COOKIE_TYPE.prompted]) {
          this.dialogVisible = true
          setCookie(COOKIE_TYPE.prompted, 1)
        }
      })
    },
    goToPage(name) {
      this.$router.push({name})
      this.dialogVisible = false
    }
  },
  created() {
    this.getPrompt()
  }
}
</script>
<style scoped lang="scss">
  .red{
    color: red;
  }
  .tips{
    font-size: 14px;
    padding: 10px 0;
    word-break: break-all;
    &:not(:last-child){
      border-bottom: 1px solid #d9d9d9;
    }
  }
</style>
