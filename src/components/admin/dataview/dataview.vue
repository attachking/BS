<template>
  <div class="dataview">
    <div class="msg-box">
      <div class="msg">
        <div class="box">
          注册企业总数 <span class="orange"><grow-num :value="totalCount"></grow-num></span>
        </div>
      </div>
      <div class="msg">
        <div class="box">
          <p>今日使用自主认证企业条数 <span class="green"><grow-num :value="usedToday"></grow-num></span></p>
          <p>本周使用自主认证企业条数 <span class="green"><grow-num :value="usedWeek"></grow-num></span></p>
          <p>本月使用自主认证企业条数 <span class="green"><grow-num :value="usedMonth"></grow-num></span></p>
        </div>
      </div>
      <div class="msg">
        <div class="box">
          <div class="left">
            账户金额
          </div>
          <div class="right">
            <div class="right-content">
              <span class="blue"><grow-num :value="assets"></grow-num></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="今日" name="first"></el-tab-pane>
      <el-tab-pane label="昨日" name="second"></el-tab-pane>
      <el-tab-pane label="过去3天" name="third"></el-tab-pane>
      <el-tab-pane label="过去一星期" name="fourth"></el-tab-pane>
      <el-tab-pane label="过去一个月" name="fifth"></el-tab-pane>
    </el-tabs>
    <div>
      <el-radio-group v-model="radio">
        <el-radio-button :label="1">使用自主认证企业条数</el-radio-button>
        <el-radio-button :label="2">平台客户自主认证企业个数</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="noData" class="noData">抱歉，暂无数据~</div>
    <div class="view" v-show="!noData">
      <div class="echarts" ref="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {post} from '../../../common/js/http'
import {dateFormat} from '../../../common/js/clazz'
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      searchData: {
        userId: '',
        status: 0, // =0 的时候为今天和昨天的折线图，=1 的时候为三天、七天、一个月折线图
        days: 0
      },
      noData: false,
      totalCount: 0,
      usedToday: 0,
      usedWeek: 0,
      usedMonth: 0,
      assets: 0,
      radio: 1,
      option2: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          name: '时间',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '数量',
            type: 'line',
            smooth: true,
            stack: '总量',
            data: []
          }
        ]
      },
      option: {
        color: ['#3398DB'],
        toolbox: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name: '客户',
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '数量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: []
          }
        ]
      },
      activeName: 'first'
    }
  },
  methods: {
    createChart() {
      this.myChart = echarts.init(this.$refs.chart)
    },
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.searchData.status = 0
        this.searchData.days = ''
        this.getInfo(0)
      } else if (tab.name === 'second') {
        this.searchData.status = 0
        this.searchData.days = ''
        this.getInfo(1)
      } else if (tab.name === 'third') {
        this.searchData.status = 1
        this.searchData.days = 3
        this.getInfo(2)
      } else if (tab.name === 'fourth') {
        this.searchData.status = 1
        this.searchData.days = 7
        this.getInfo(3)
      } else if (tab.name === 'fifth') {
        this.searchData.status = 1
        this.searchData.days = 30
        this.getInfo(4)
      }
    },
    getInfo(type) {
      // this.searchData.userId = this.uid
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccOrder/iccOrder/getOrderStatistics.xf', this.searchData).then(res => {
        this.fullLoading.close()
        this.totalCount = res.result.cntCorp
        this.assets = res.result.totalMoney
        if (type === 0) {
          this.option2.series[0].data = res.result.order_list_by_time_A.map(item => item.cntAuthen)
          this.option2.xAxis.data = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
          this.option.series[0].data = res.result.authenCountByUser_A.map(item => item.useCount)
          this.option.xAxis[0].data = res.result.authenCountByUser_A.map(item => item.pate)
          this.renderChart()
        } else if (type === 1) {
          this.option2.series[0].data = res.result.order_list_by_time_B.map(item => item.cntAuthen)
          this.option2.xAxis.data = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
          this.option.series[0].data = res.result.authenCountByUser_B.map(item => item.useCount)
          this.option.xAxis[0].data = res.result.authenCountByUser_B.map(item => item.pate)
          this.renderChart()
        } else if (type === 2) {
          this.option2.series[0].data = res.result.order_list_by_time_C.map(item => item.cntAuthen)
          this.option2.xAxis.data = [this.beforeDay(3), this.beforeDay(2), this.beforeDay(1)]
          this.option.series[0].data = res.result.authenCountByUser_C.map(item => item.useCount)
          this.option.xAxis[0].data = res.result.authenCountByUser_C.map(item => item.pate)
          this.renderChart()
        } else if (type === 3) {
          this.option2.series[0].data = res.result.order_list_by_time_C.map(item => item.cntAuthen)
          this.option2.xAxis.data = []
          for (let i = 1; i < 8; i++) {
            this.option2.xAxis.data.push(this.beforeDay(i))
          }
          this.option2.xAxis.data.reverse()
          this.option.series[0].data = res.result.authenCountByUser_C.map(item => item.useCount)
          this.option.xAxis[0].data = res.result.authenCountByUser_C.map(item => item.pate)
          this.renderChart()
        } else if (type === 4) {
          this.option2.series[0].data = res.result.order_list_by_time_C.map(item => item.cntAuthen)
          this.option2.xAxis.data = []
          for (let i = 1; i < 31; i++) {
            this.option2.xAxis.data.push(this.beforeDay(i))
          }
          this.option2.xAxis.data.reverse()
          this.option.series[0].data = res.result.authenCountByUser_C.map(item => item.useCount)
          this.option.xAxis[0].data = res.result.authenCountByUser_C.map(item => item.pate)
          this.renderChart()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    renderChart() {
      this.myChart.clear()
      this.createChart()
      if (this.radio === 1) {
        this.noData = false
        this.myChart.setOption(this.option2)
      } else {
        this.myChart.setOption(this.option)
        if (!this.option.xAxis[0].data.length) {
          setTimeout(() => {
            this.noData = true
          }, 20)
        } else {
          setTimeout(() => {
            this.noData = false
          }, 20)
        }
      }
    },
    beforeDay(num) {
      let date = new Date()
      return dateFormat.call(new Date(date.getTime() - 1000 * 60 * 60 * 24 * num), 'yyyy-MM-dd')
    },
    getStaticData() {
      post('service/business/college/corp/iccCompany/authenTotal').then(res => {
        this.usedToday = res.result.yesdayCount
        this.usedWeek = res.result.weekCount
        this.usedMonth = res.result.monthCount
      })
    }
  },
  watch: {
    radio() {
      setTimeout(this.renderChart, 20)
    }
  },
  mounted() {
    this.createChart()
    this.getInfo(0)
    this.getStaticData()
  }
}
</script>
<style scoped lang="scss">
  .msg{
    width: 350px;
    float: left;
    height: 150px;
    padding: 0 20px;
    color: #666;
    .box{
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      height: 100%;
    }
    &:nth-child(1){
      text-align: center;
      line-height: 150px;
      font-size: 22px;
    }
    &:nth-child(2){
      text-align: center;
      font-size: 14px;
      p{
        padding: 5px 0;
      }
      p:nth-child(1){
        padding: 15px 0;
        margin: 0 10px;
        border-bottom: 1px solid #d9d9d9;
        font-size: 16px;
      }
    }
    &:nth-child(3){
      .left{
        width: 33%;
        float: left;
        font-size: 22px;
        padding: 41px 0 0 46px;
      }
      .right{
        width: 67%;
        float: left;
        padding: 20px 0 20px 0;
        height: 100%;
        .right-content{
          height: 100%;
          border-left: 1px solid #d9d9d9;
          font-size: 26px;
          line-height: 108px;
          text-align: center;
        }
      }
    }
  }
  .orange{
    color: #fb9d23;
  }
  .green{
    color: #69c03b;
    font-size: 20px !important;
  }
  .blue{
    color: #409eff;
  }
  .tabs{
    padding: 20px 0;
  }
  .echarts{
    width: 100%;
    height: 500px;
  }
  .msg-box{
    width: 1050px;
    margin: 0 auto;
    overflow: hidden;
  }
  .noData{
    width: 1000px;
    padding-top: 50px;
    text-align: center;
  }
</style>
