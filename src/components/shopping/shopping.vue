<template>
  <div class="buy">
    <div class="shopping_head">
      <img src="../../common/img/shopping.jpg">
      <div class="user">
        <p class="title">购买套餐立即成为VIP客户</p>
        <p class="show"> <i class="xffont xf-huangguanhuiyuan"></i> 更/多/特/权   ·  超/值/服/务 <i class="xffont xf-huangguanhuiyuan"></i></p>
      </div>
    </div>
    <div class="shop_body">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img src="../../common/img/shopping1.jpg" alt="">
            <div v-if="listData.length > 0">
              <div class="user_buy">
                <p class="money">{{listData[0].packageCounts || nulltip}}条/{{listData[0].packagePrice || nulltip}}元</p>
                <p class="easy"><span class="wrong">原价{{listData[0].packageOrigPrice || nulltip}}元</span> | 折合每条{{ (listData[0].packagePrice/listData[0].packageCounts).toFixed(3) || nulltip }}元</p>
              </div>
              <div class="button_box">
                <el-button type="warning" @click="shour(listData[0].packageCounts,listData[0].packagePrice,listData[0].packageId)">立刻购买</el-button>
              </div>
            </div>
            <div v-if="listData.length < 0" class="button_box">
              <el-button type="warning" >敬请期待</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img src="../../common/img/shopping2.jpg" alt="">
            <div v-if="listData.length > 1">
              <div class="user_buy">
                <p class="money">{{listData[1].packageCounts || nulltip}}条/{{listData[1].packagePrice || nulltip}}元</p>
                <p class="easy"><span class="wrong">原价{{listData[1].packageOrigPrice || nulltip}}元</span> | 折合每条{{(listData[1].packagePrice/listData[1].packageCounts).toFixed(3) || nulltip}}元</p>
              </div>
              <div class="button_box">
                <el-button type="warning" @click="shour(listData[1].packageCounts,listData[1].packagePrice,listData[1].packageId)">立刻购买</el-button>
              </div>
            </div>
            <div v-if="listData.length <= 1" class="button_box">
              <el-button disabled type="warning" >敬请期待</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <img src="../../common/img/shopping3.jpg" alt="">
            <div v-if="listData.length > 2">
              <div class="user_buy">
                <p class="money">{{listData[2].packageCounts || nulltip}}条/{{listData[2].packagePrice || nulltip}}元</p>
                <p class="easy"><span class="wrong">原价{{listData[2].packageOrigPrice || nulltip}}元</span> | 折合每条{{(listData[2].packagePrice/listData[2].packageCounts).toFixed(3) || nulltip}}元</p>
              </div>
              <div class="button_box">
                <el-button type="warning" @click="shour(listData[2].packageCounts,listData[2].packagePrice,listData[2].packageId)">立刻购买</el-button>
              </div>
            </div>
            <div v-if="listData.length <= 2" class="button_box">
              <el-button disabled type="warning" >敬请期待</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <p>特权1 ：企业数据精准化、认证高效化、展示精细化  </p>
      <p>特权2 ：企业数据可随时随地进行导出</p>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogFormVisible2" width="500px">
      <el-form  label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" style="width: 400px;margin: 0 auto;">
        <el-form-item label="条数">
          <el-input :value="userData.name + '条'" disabled> </el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input :value="userData.money + '元'" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="type">
          <el-input type="textarea" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit('formLabelAlign')">立即下单</el-button>
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <pay v-model="dialogFormVisible" :data="userDatapay"></pay>
  </div>
</template>

<script>
import Pay from './pay/pay.vue'
import {post} from '../../common/js/http'
import {mapGetters} from 'vuex'
export default {
  components: {Pay},
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  name: 'buy',
  data() {
    return {
      dialogFormVisible2: false,
      dialogFormVisible: false,
      nulltip: '暂无',
      userData: {},
      userDatapay: {},
      formLabelAlign: {
        type: ''
      },
      loading: false,
      listData: {},
      rules: {
        type: [{
          max: 50,
          message: '最多50个字符',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    shour(num, money, id) {
      this.formLabelAlign.type = ''
      this.dialogFormVisible2 = true
      this.userData = {
        name: num,
        money: money,
        id: id
      }
    },
    getList() {
      post('service/business/college/iccOrder/iccPackage/getPackageList.xf', {}).then(data => {
        data.result || (data.result = [])
        this.listData = data.result
      }).catch(() => {
        this.loading = false
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          post('service/business/college/iccOrder/iccOrder/genOrder.xf', {
            packageId: this.userData.id,
            userId: this.uid,
            orderSource: 0,
            orderRemark: encodeURIComponent(this.formLabelAlign.type)
          }).then(res => {
            this.loading = false
            this.dialogFormVisible2 = false
            if (res.error.result === 1) {
              this.dialogFormVisible = true
              this.userDatapay = {
                id: this.userData.id,
                NumOF: res.result.orderNo
              }
            } else {
              this.$message.error(res.error.message)
            }
          }).catch(() => {
            this.loading = false
            this.dialogFormVisible2 = false
          })
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped lang="scss">
  .shopping_head {
    position: relative;
    width: 100%;
    height: 210px;
    img {
      width: 100%;
      height: 210px;
      display: block;
    }
    .user {
      position: absolute;
      width: 420px;
      height: 80px;
      right: 0;
      left: 0;
      top: 55px;
      margin: auto;
      .title {
        font-size: 36px;
        font-family: "Microsoft YaHei";
        color: rgb(243, 243, 243);
        line-height: 1.345;
        text-align: center;
      }
      .show {
        font-size: 14px;
        font-family: "Microsoft YaHei";
        color: rgb(243, 243, 243);
        line-height: 3.459;
        text-align: center;
      }
    }
  }
  .shop_body {
    width: 1200px;
    margin: auto;
    margin-top: 30px;
    .bg-purple{
      height: 310px;
      width: 380px;
      position: relative;
      border: 1px solid gainsboro;
      transition:0.5s;
      border-radius: 5px;
      img{
        width: 100%;
      }
      .user_buy{
        position: absolute;
        width: 100%;
        text-align: center;
        top:50px;
        .money{
            font-size: 36px;
            font-family: "Microsoft YaHei";
            color: rgb(255, 255, 255);
            line-height: 38px;
        }
        .easy{
            font-size: 18px;
            font-family: "Microsoft YaHei";
            color: rgb(255, 255, 255);
            line-height: 40px;
            text-align: center;
          .wrong{
            text-decoration: line-through;
          }
        }
      }
      .button_box{
        text-align: center;
        margin-top: 55px;
      }
    }
    .bg-purple:hover{
      box-shadow: 0px 2px 10px #888888;
    }
  }
  .bottom{
    width: 1200px;
    margin: auto;
    margin-top: 20px;
    padding-left: 20px;
    p{
        font-size: 14px;
        font-family: "Microsoft YaHei";
        color: rgb(153, 153, 153);
        line-height: 1.286;
    }
  }
</style>
