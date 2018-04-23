<template>
  <div class="myself">
    <el-row class="msg-box">
      <el-col :span="8"><div class="grid-content bg-purple">
        注册企业总数 <span class="color_yellow"><grow-num :value="tableData.cntCorp"></grow-num></span> 家
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
        自主认证企业总数 <span class="color_green"><grow-num :value="tableData.cntAccessCorp"></grow-num></span> 家
      </div></el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div class="left">
            我的账户
          </div>
          <div class="right">
            <p><span class="user_right">总条数：</span><span class="color_blue"><grow-num :value="tableData.totalCnt"></grow-num></span> 条</p>
            <p><span class="user_right">已使用条数：</span><span class="color_blue"><grow-num :value="tableData.authenCnt"></grow-num></span> 条 </p>
            <p><span class="user_right">剩余条数：</span><span class="color_blue"><grow-num :value="tableData.surplusCnt"></grow-num></span> 条</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="box_line">
      <template :loading="loading">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="今日" name="first">
            <el-checkbox style="float: right" v-model="checked3" label="对比昨日" border></el-checkbox>
          </el-tab-pane>
          <el-tab-pane label="昨日" name="second">
          </el-tab-pane>
          <el-tab-pane label="过去三天" name="third">
          </el-tab-pane>
          <el-tab-pane label="过去一周" name="fourth">
          </el-tab-pane>
          <el-tab-pane label="过去30天" name="fifthly">
          </el-tab-pane>
        </el-tabs>
        <div class="box_list" id="user_line"></div>
      </template>
    </div>
  </div>
</template>

<script>
import {post} from '../../../common/js/http'
import echarts from 'echarts'
import {mapGetters} from 'vuex'
export default {
  name: 'myself',
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      usedToday: 200,
      activeName: 'first',
      tableData: {},
      checked3: false,
      users: '',
      dataX: [],
      dataY: [],
      data2Yname: '昨日',
      dataYname: '今日',
      data2Y: []
    }
  },
  methods: {
    handleClick(tab, event) {
      this.users = tab.$el.id.split('-')[1]
      if (this.users === 'first') {
        post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
          userId: this.uid,
          status: 0
        }).then(data => {
          this.loading = false
          data.result || (data.result = [])
          this.tableData = data.result
          this.dataX = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:45', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
          if (this.tableData.order_list_by_time_A.length === 0) {
            this.tableData.order_list_by_time_A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            this.dataY = []
            for (var i = 0; i < 24; i++) {
              this.dataY.push(this.tableData.order_list_by_time_A[i].cntAuthen)
            }
          }
          if (this.tableData.order_list_by_time_B.length === 0) {
            this.tableData.order_list_by_time_B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            this.data2Y = []
            for (var f = 0; f < 24; f++) {
              this.data2Y.push(this.tableData.order_list_by_time_B[f].cntAuthen)
            }
          }
          this.data2Yname = '昨日'
          this.dataYname = '今日'
          // this.dataY = this.tableData.order_list_by_time_A
          this.data2Y = []
          this.userLine()
        }).catch(() => {
          this.loading = false
        })
      }
      if (this.users === 'second') {
        post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
          userId: this.uid,
          status: 0
        }).then(data => {
          this.loading = false
          data.result || (data.result = [])
          this.tableData = data.result
          this.dataX = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:45', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
          if (this.tableData.order_list_by_time_B.length === 0) {
            this.tableData.order_list_by_time_B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            this.data2Y = []
            for (var f = 0; f < 24; f++) {
              this.data2Y.push(this.tableData.order_list_by_time_B[f].cntAuthen)
            }
          }
          this.data2Yname = '昨日'
          this.dataYname = '今日'
          this.dataY = []
          // this.data2Y = this.tableData.order_list_by_time_B
          this.userLine()
        }).catch(() => {
          this.loading = false
        })
      }
      if (this.users === 'third') {
        post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
          userId: this.uid,
          status: 1,
          days: 3
        }).then(data => {
          this.loading = false
          data.result || (data.result = [])
          this.tableData = data.result
          this.dataX = ['1', '2', '3']
          if (this.tableData.order_list_by_time_C.length === 0) {
            this.tableData.order_list_by_time_C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            this.dataX = []
            this.dataY = []
            for (var i = 0; i < 3; i++) {
              this.dataX.push(this.tableData.order_list_by_time_C[i].companyAccessRecordTimeStr)
              this.dataY.push(this.tableData.order_list_by_time_C[i].cntAuthen)
            }
          }
          this.dataYname = '过去三天'
          this.data2Y = []
          this.userLine()
        }).catch(() => {
          this.loading = false
        })
      }
      if (this.users === 'fourth') {
        post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
          userId: this.uid,
          status: 1,
          days: 7
        }).then(data => {
          this.loading = false
          data.result || (data.result = [])
          this.tableData = data.result
          this.dataX = ['1', '2', '3', '4', '5', '6', '7']
          if (this.tableData.order_list_by_time_C.length === 0) {
            this.tableData.order_list_by_time_C = [0, 0, 0, 0, 0, 0, 0]
          } else {
            this.dataX = []
            this.dataY = []
            for (var i = 0; i < 7; i++) {
              this.dataX.push(this.tableData.order_list_by_time_C[i].companyAccessRecordTimeStr)
              this.dataY.push(this.tableData.order_list_by_time_C[i].cntAuthen)
            }
          }
          this.dataYname = '过去一周'
          this.data2Y = []
          this.userLine()
        }).catch(() => {
          this.loading = false
        })
      }
      if (this.users === 'fifthly') {
        post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
          userId: this.uid,
          status: 1,
          days: 30
        }).then(data => {
          this.loading = false
          data.result || (data.result = [])
          this.tableData = data.result
          this.dataX = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
          if (this.tableData.order_list_by_time_C.length === 0) {
            this.tableData.order_list_by_time_C = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            this.dataX = []
            this.dataY = []
            for (var i = 0; i < 30; i++) {
              this.dataX.push(this.tableData.order_list_by_time_C[i].companyAccessRecordTimeStr)
              this.dataY.push(this.tableData.order_list_by_time_C[i].cntAuthen)
            }
          }
          this.dataYname = '过去30天'
          // this.dataY = this.tableData.order_list_by_time_C
          this.data2Y = []
          this.userLine()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    getmessage() {
      post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', {
        userId: this.uid,
        status: 0
      }).then(data => {
        this.loading = false
        data.result || (data.result = [])
        this.tableData = data.result
        this.dataX = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:45', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        if (this.tableData.order_list_by_time_A.length === 0) {
          this.tableData.order_list_by_time_A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        } else {
          this.dataY = []
          for (var i = 0; i < 24; i++) {
            this.dataY.push(this.tableData.order_list_by_time_A[i].cntAuthen)
          }
        }
        // this.dataY = this.tableData.order_list_by_time_A
        this.userLine()
      }).catch(() => {
        this.loading = false
      })
    },
    userLine() {
      var _this = this
      var myChart = echarts.init(document.getElementById('user_line'))
      var option = {
        title: {
          text: '自助认证新增企业趋势图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          name: '时间',
          boundaryGap: false,
          data: _this.dataX,
          axisTick: {
            alignWithLabel: true,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          axisPointer: {
            snap: true
          },
          axisTick: {
            interval: 0
          }
        },
        series: [
          {
            name: _this.dataYname,
            type: 'line',
            smooth: true,
            data: _this.dataY
          },
          {
            name: _this.data2Yname,
            type: 'line',
            smooth: true,
            data: _this.data2Y
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  mounted() {
    this.userLine()
    this.getmessage()
  },
  watch: {
    checked3(newval, oldval) {
      if (newval) {
        if (this.tableData.order_list_by_time_B.length === 0) {
          this.tableData.order_list_by_time_B = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        } else {
          this.data2Y = []
          for (var f = 0; f < 24; f++) {
            this.data2Y.push(this.tableData.order_list_by_time_B[f].cntAuthen)
          }
        }
        // this.data2Y = this.tableData.order_list_by_time_B
        this.userLine()
      } else {
        this.data2Y = []
        this.userLine()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .msg-box{
    width: 1100px;
    margin: 0 auto;
  }
  .bg-purple{
    height: 175px;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    text-align: center;
    font-size: 22px;
    line-height: 173px;
    color: #666;
    .left{
      float: left;
      width: 80px;
      height: 100px;
      font-size: 26px;
      line-height: 30px;
      margin-top: 60px;
      padding-left: 20px;
    }
    .right{
      float: right;
      border-left: 1px solid gainsboro;
      width: 246px;
      margin-top: 30px;
      height: 100px;
      line-height: 34px;
      text-align: left;
      font-size: 18px;
      .user_right{
        display: inline-block;
        width: 120px;
        text-align: right;
      }
    }
  }
  .color_yellow{
    color: #fa9d24;
    font-size: 30px;
  }
  .color_green{
    color: #67c23a;
    font-size: 30px;
  }
  .color_blue{
    color: #409eff;
    font-size: 24px;
  }
  .box_line{
    margin-top: 30px;
  }
  .box_list{
    margin-top: 20px;
    height: 400px;
  }
  .grid-content{
    margin: 0 15px;
  }
</style>
