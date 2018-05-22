<template>
  <div>
    <el-dialog
      title="请选择支付方式"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="支付宝支付" name="first">
          <el-button type="success" :loading="loading" round @click="Pays()">{{showmessage }}</el-button>
        </el-tab-pane>
        <el-tab-pane label="微信支付" name="second">
          <div class="weixinQR clearfix" style="display: block;">
            <dl>
              <dt><img class="QR" src=""></dt>
              <dd><p class="QR_tip2">请使用<span>微信扫一扫</span>，轻松完成支付</p></dd>
            </dl>
            <div class="QR_tip1"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {BASE_URL} from '../../../common/js/config'
import {post} from '../../../common/js/http'
export default {
  name: 'pay',
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      number: 0,
      loading: false,
      dialogFormVisible: false,
      NumOF: '',
      takemoney: false,
      shour: '',
      formLabelAlign: {
        type: ''
      },
      showmessage: '立即支付'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    calculate(newVal, oldVal) {
    },
    Pays() {
      console.log(this.data)
      if (this.loading) return
      window.open(BASE_URL + 'service/business/college/alipay/alipay/aliPayment.xf?packageId=' + this.data.id + '&userId=' + this.uid + '&orderNo=' + this.data.NumOF)
      if (this.loading) return
      this.loading = true
      this.showmessage = '正在支付'
      this.userTime = setInterval(() => {
        post('service/business/college/alipay/alipay/getPaymentState.xf', {
          userId: this.uid,
          orderNo: this.data.NumOF
        }).then(data => {
          if (Number(data.result) === 1) {
            this.dialogFormVisible = false
            this.loading = false
            this.$alert('支付成功', {
              confirmButtonText: '确定',
              callback: action => {
                this.$emit('update')
                this.$router.push({ name: 'order' })
              }
            })
            window.clearInterval(this.userTime)
          }
        }).catch(() => {
        })
      }, 2000)
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === oldVal) return
      this.dialogFormVisible = newVal
    },
    dialogFormVisible(newVal, oldVal) {
      if (newVal === oldVal) return
      this.$emit('input', newVal)
      if (!newVal) {
        window.clearInterval(this.userTime)
        this.loading = false
        this.showmessage = '立即支付'
      }
    }
  },
  created() {
  }
}
</script>
<style>
  .weixinQR {
    width: 100%;
    background: #F7F8FA;
    padding: 40px 0 20px;
    clear: both;
    text-align: center;
  }
  .weixinQR dl {
    display: inline-block;
    margin-right: 135px;
    vertical-align: -11px;
    text-align: center;
  }
  .QR_tip1 {
    width: 212px;
    height: 240px;
    background: url(http://static.699pic.com/images/find-wx.png);
    display: inline-block;
  }
</style>
