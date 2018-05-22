<template>
  <div class="order_list">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="我的订单"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      stripe
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="packagePrice"
        align="center"
        width="150px"
        label="购买套餐">
        <template slot-scope="scope">
          <span >{{ scope.row.packagePrice+'元/'+ scope.row.packageCounts + '条' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="packageCounts"
        width="150px"
        align="center"
        label="可认证企业数据">
      </el-table-column>
      <el-table-column
        align="center"
        label="剩余条数">
        <template slot-scope="scope">
          <span v-if="scope.row.orderPaymentStatus != 0">{{ scope.row.packageCounts - scope.row.cntAuthen }}</span>
          <span v-if="scope.row.orderPaymentStatus == 0">{{ '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderAmount"
        align="center"
        label="缴费金额">
      </el-table-column>
      <el-table-column
        prop="orderTime"
        width="180px"
        align="center"
        label="订单提交时间">
      </el-table-column>
      <el-table-column
        width="180px"
        align="center"
        label="支付时间">
        <template slot-scope="scope">
          <span v-if="scope.row.orderPaymentStatus != 0">{{ scope.row.orderPaymentTime}}</span>
          <span v-if="scope.row.orderPaymentStatus == 0">{{ '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="支付状态">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.orderPaymentStatus) === 0 ? "待付款" : Number(scope.row.orderPaymentStatus) === 1 ? "使用中" : Number(scope.row.orderPaymentStatus) === 2 ? "已退款" : "已失效" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        align="center"
        width="200px"
        label="购买人">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="100">
        <template  slot-scope="scope">
          <el-button v-if="Number(scope.row.orderPaymentStatus) === 0" @click="handleClick(scope.row.orderNo, scope.row.packageId)" type="text" size="small">支付</el-button>
          <el-button v-if="Number(scope.row.orderPaymentStatus) == 0" @click="daleClick(scope.row.orderId, scope.row.packageId)" type="text" size="small">取消</el-button>
          <el-button v-if="Number(scope.row.orderPaymentStatus) != 0" disabled type="text" size="small">暂无</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <pay v-model="dialogFormVisible2" :data="userData2" @update="getList"></pay>
  </div>
</template>

<script>
import {post} from '../../../common/js/http'
import {PAGE_SIZE} from '../../../common/js/config'
import {mapGetters} from 'vuex'
import Pay from '../../shopping/pay/pay.vue'
export default {
  components: {Pay},
  name: 'order_list',
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      editableTabsValue: 'list',
      loading: false,
      nulltip: '暂无',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogVisible: false,
      tableData: [],
      pageBean: {},
      userData2: {},
      userdata: {
        userId: '',
        rowsNum: PAGE_SIZE,
        currentPage: 1
      },
      form: {
        name: '',
        region: ''
      },
      formLabelWidth: '130px'
    }
  },
  methods: {
    getList() {
      if (this.loading) return
      this.loading = true
      this.userdata.userId = this.uid
      post('service/business/college/iccOrder/iccOrder/getMyOrderList.xf', this.userdata).then(data => {
        this.loading = false
        data.result || (data.result = [])
        this.tableData = data.result
        this.pageBean = data.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    handleClick(ids, id) {
      this.dialogFormVisible2 = true
      this.dialogVisible = true
      this.userData2 = {
        NumOF: ids,
        id: id
      }
    },
    handleSizeChange(size) {
      this.userdata.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.userdata.currentPage = page
      this.getList()
    },
    daleClick(ids, id) {
      this.userdata.userId = this.uid
      this.$confirm('此操作将取消该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '保留',
        type: 'warning'
      }).then(() => {
        this.fullLoading = this.$loading({
          lock: true
        })
        post('service/business/college/iccOrder/iccOrder/cancelPayOrder.xf', {
          orderId: ids
        }).then(data => {
          this.fullLoading.close()
          if (data.error.result === 1) {
            this.$message({
              type: 'success',
              message: data.error.message
            })
            this.getList()
          }
        }).catch(() => {
          this.fullLoading.close()
        })
      }).catch(() => {
        // 取消
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped lang="scss">
  .pagination{
    margin-top: 20px;
    text-align: center;
  }
</style>
