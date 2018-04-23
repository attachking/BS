<template>
  <div class="manage">
    <div class="container">
      <div class="left">
        <el-menu :default-active="active" router class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#333" text-color="#fff">
          <el-menu-item v-for="(item, key) in adminAssets" :index="item.url" :key="key" v-if="!item.children.length">
            <i :class="item.icon"></i>
            <template slot="title">
              <span>{{item.name}}</span>
            </template>
          </el-menu-item>
          <el-submenu v-for="(item, key) in adminAssets" :index="item.name" :key="key" v-if="item.children.length">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group v-if="item.children.length">
              <el-menu-item :index="item2.url" v-for="(item2, key2) in item.children" :key="key2">
                <i :class="item2.icon"></i>
                {{item2.name}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
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
      <p class="tips">你有 <span class="red">{{iccInvoiceCounts}}</span> 个订单发票打印申请，<el-button type="text" @click="goToPage('adminOrder')">前去审批<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
      <p class="tips">昨日新增订单 <span class="red">{{newIccOrderCounts}}</span> 个，已支付订单 <span class="red">{{payIccOrderCounts}}</span> 个，退款订单 <span class="red">{{refundIccOrderCounts}}</span> 个，<el-button type="text" @click="goToPage('adminOrder')">查看详情<i class="el-icon-arrow-right el-icon--right"></i></el-button></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {manageMixin} from '../../common/js/mixin'
import {post} from '../../common/js/http'
import event, {EVENT_TYPES} from '../../common/js/event'
import {mapGetters, mapMutations} from 'vuex'
import {getCookies, setCookie, COOKIE_TYPE} from '../../common/js/cookie'

export default {
  mixins: [manageMixin],
  computed: {
    ...mapGetters([
      'uid',
      'adminAssets'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      iccInvoiceCounts: 0, // 待打印发票数
      newIccOrderCounts: 0, // 昨天新增订单总数
      payIccOrderCounts: 0, // 昨天新增订单支付成功数
      refundIccOrderCounts: 0 // 昨天退款订单数
    }
  },
  methods: {
    ...mapMutations({
      setAdminAssets: 'SET_ADMIN_ASSETS'
    }),
    getAdminAssets() {
      post('service/sys/iccResource/iccResource/getUserResourceList.xf', {
        userId: this.uid
      }).then(res => {
        this.handleList(res.result)
        this.setAdminAssets(res.result)
        if (this.$route.name === 'admin') {
          this.goFirstRoute(res.result)
        }
      })
    },
    goFirstRoute(arr) {
      if (arr.length) {
        if (arr[0].children && arr[0].children.length) {
          this.goFirstRoute(arr[0].children)
        } else {
          this.$router.push(arr[0].url)
        }
      }
    },
    handleList(arr) {
      arr.forEach(item => {
        if (item.twoResourceList && item.twoResourceList.length) {
          this.handleList(item.twoResourceList)
        }
        item.name = item.resourceName || ''
        item.url = item.resourceUrl || ''
        item.readable = item.resourceState || 0
        item.children = item.twoResourceList || []
        item.icon = item.resourceIcon || ''
      })
    },
    getPrompted() {
      post('service/business/college/iccInvoice/iccInvoice/getSchedule.xf').then(res => {
        this.iccInvoiceCounts = res.result.iccInvoiceCounts
        this.newIccOrderCounts = res.result.newIccOrderCounts
        this.payIccOrderCounts = res.result.payIccOrderCounts
        this.refundIccOrderCounts = res.result.refundIccOrderCounts
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
  mounted() {
    this.getAdminAssets()
    this.getPrompted()
    event.$on(EVENT_TYPES.refreshReadable, this.getAdminAssets)
  }
}
</script>
<style scoped lang="scss">
  .red{
    color: red;
  }
  .tips{
    font-size: 16px;
    padding: 10px 0;
    &:not(:last-child){
      border-bottom: 1px solid #d9d9d9;
    }
  }
</style>
