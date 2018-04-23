<template>
  <div class="admin-order">
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        label="订单管理"
        name="list"
      >
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
    <div class="order-main">
      <div class="list" v-if="editableTabsValue === 'list'">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="套餐类型">
            <el-select v-model="packageId" placeholder="请选择购买套餐类型">
              <el-option :label="val.packageName" :value="val.packageId" v-for="(val, key) in packageList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属类型">
            <el-select v-model="agencyType" placeholder="请选择所属类型">
              <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="所属机构">
            <el-select v-model="agencyId" placeholder="请选择机构">
              <el-option :label="val.agencyName" :value="val.agencyId" v-for="(val, key) in agencyIdList" :key="key"></el-option>
            </el-select>
          </el-form-item>-->
          <!--<el-form-item label="所属平台">
            <el-select v-model="userId" placeholder="请选择平台">
              <el-option :label="val.userContact" :value="val.userId" v-for="(val, key) in userIdList" :key="key"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="订单状态">
            <el-select v-model="orderStatus" placeholder="请选择订单状态">
              <el-option label="待付款" :value="0"></el-option>
              <el-option label="使用中" :value="1"></el-option>
              <el-option label="已取消" :value="2"></el-option>
              <el-option label="已失效" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select v-model="orderPaymentStatus" placeholder="请选择支付状态">
              <el-option label="未付款" :value="0"></el-option>
              <el-option label="已付款" :value="1"></el-option>
              <el-option label="已退款" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票打印状态">
            <el-select v-model="invoicePrintTempState" placeholder="请选择发票打印状态">
              <el-option label="待打印" :value="0"></el-option>
              <el-option label="等待发出" :value="1"></el-option>
              <el-option label="已发出" :value="2"></el-option>
              <el-option label="已接收" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票类型">
            <el-select v-model="invoiceType" placeholder="请选择发票类型">
              <el-option label="电子" :value="0"></el-option>
              <el-option label="纸质" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="dateRange" label="订单提交时间">
            <el-date-picker
              :editable="false"
              v-model="dateRange"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="keywords" placeholder="请输入订单号进行查询" @keydown.native.enter="onSubmit">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
            <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
          </el-form-item>
        </el-form>
        <p class="msg">
          总金额：<span class="red"><grow-num :value="assetsData.total"></grow-num>元</span>&nbsp;&nbsp;&nbsp;&nbsp;
          收入金额：<span class="red"><grow-num :value="assetsData.received"></grow-num>元</span>&nbsp;&nbsp;&nbsp;&nbsp;
          退款金额：<span class="red"><grow-num :value="assetsData.back"></grow-num>元</span>
        </p>
        <div class="table">
          <el-table
            stripe
            :data="list"
            style="width: 100%"
            v-loading="loading"
            @row-dblclick="handleDbclick"
            @selection-change="handleSelectionChange"
            ref="table">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号:">
                    <span>{{ props.row.orderNo }}</span>
                  </el-form-item>
                  <el-form-item label="购买套餐:">
                    <span>{{ props.row.packageName || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="项目名称:">
                    <span>{{ props.row.projectName || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="所属类型：">
                    <span>{{ props.row.projectTypeStr || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="订单提交时间:">
                    <span>{{ props.row.orderTime || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="订单金额:">
                    <span>{{ props.row.orderAmount || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="已使用条数:">
                    <span>{{ props.row.cntAuthen || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="剩余条数:">
                    <span>{{ props.row.packageCounts || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="订单状态:">
                    <span>{{ props.row.orderStatusStr || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="支付状态:">
                    <span>{{ props.row.orderPaymentStatusStr || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="付款类型:">
                    <span>{{ props.row.orderPaymentSourcesStr || '--' }}</span>
                  </el-form-item>
                  <el-form-item label="发票打印状态:">
                    <span>{{props.row.invoicePrintStateStr || '--'}}</span>
                  </el-form-item>
                  <el-form-item label="发票种类:">
                    <span>{{ props.row.invoiceTypeStr || '--' }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              width="150px"
              prop="orderNo">
            </el-table-column>
            <el-table-column
              align="center"
              label="项目名称"
              width="150px"
              prop="projectName">
            </el-table-column>
            <el-table-column
              align="center"
              label="支付状态"
              prop="orderPaymentStatusStr">
            </el-table-column>
            <el-table-column
              align="center"
              label="订单状态"
              prop="orderStatusStr">
            </el-table-column>
            <el-table-column
              align="center"
              label="发票状态">
              <template slot-scope="scope">
                <span>{{scope.row.invoicePrintStateStr || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="订单提交时间"
              width="160px"
              prop="orderTime">
            </el-table-column>
            <el-table-column
              align="center"
              label="订单金额"
              prop="orderAmount">
            </el-table-column>
            <el-table-column
              align="center"
              width="160px"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="getDetail(scope.row, $event)"
                  type="text"
                  v-if="Number(scope.row.orderStatus) !== 0"
                  size="small">
                  查看详情
                </el-button>
                <el-button
                  @click.native.prevent="pay(scope.row)"
                  type="text"
                  v-if="Number(scope.row.orderPaymentStatus) === 0"
                  size="small">
                  付款
                </el-button>
                <el-button
                  @click.native.prevent="refund(scope.row)"
                  type="text"
                  :disabled="!adminReadable"
                  v-if="Number(scope.row.orderStatus) !== 0 && Number(scope.row.orderPaymentStatus) === 1"
                  size="small">
                  退款
                </el-button>
                <br v-if="Number(scope.row.orderStatus) !== 0">
                <el-button
                  @click.native.prevent="downInvoice(scope.row)"
                  type="text"
                  v-if="scope.row.invoicePrintState !== null"
                  size="small">
                  下载发票信息
                </el-button>
                <el-button
                  @click.native.prevent="logistics(scope.row)"
                  type="text"
                  :disabled="!adminReadable"
                  v-if="Number(scope.row.orderStatus) !== 0 && scope.row.invoiceId"
                  size="small">
                  编辑物流
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :bean="pageBean"
            class="pagination"></pagination>
        </div>
        <div class="download">
          <el-dropdown @command="handleCommand" class="dropdown" placement="bottom-start">
            <el-button type="primary" size="small">
              导出订单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="first">按当前条件导出</el-dropdown-item>
              <!--<el-dropdown-item command="second">导出当前页</el-dropdown-item>-->
              <el-dropdown-item command="third">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand2" class="dropdown" placement="bottom-start">
            <el-button type="primary" size="small">
              导出发票<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="first">按当前条件导出</el-dropdown-item>
              <!--<el-dropdown-item command="second">导出当前页</el-dropdown-item>-->
              <el-dropdown-item command="third">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <admin-order-detail v-show="editableTabsValue === 'detail'" :data="orderDetail"></admin-order-detail>
    </div>
    <el-dialog title="编辑物流" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="物流公司" prop="logisticsSid">
          <el-select v-model="form.logisticsSid" filterable placeholder="请选择物流公司">
            <el-option
              v-for="item in dictionaries.express"
              :key="item.parameterCode"
              :label="item.parameterOption"
              :value="item.parameterCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="form.logisticsNo" placeholder="请输入物流单号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="logisticsRemark">
          <el-input v-model="form.logisticsRemark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="退款" :visible.sync="dialogFormVisible2" width="600px">
      <el-form :model="form2" class="add" label-width="120px" ref="form2" :rules="rules2">
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="form2.logisticsNo" placeholder="请输入物流单号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="logisticsRemark">
          <el-input v-model="form2.logisticsRemark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="backSubmit" :loading="loading3">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="付款" :visible.sync="dialogFormVisible3" width="500px">
      <el-form :model="form3" class="payForm" label-width="120px" ref="form3" :rules="rules3">
        <el-form-item label="付款金额" prop="price">
          <el-input v-model="form3.price" placeholder="请输入付款金额"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="paySubmit" :loading="loading4">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AdminOrderDetail from './detail/detail.vue'
import {post} from '../../../common/js/http'
import {dateFormat} from '../../../common/js/clazz'
import {PAGE_SIZE, BASE_URL, PROJECT_TYPE} from '../../../common/js/config'
import {mapGetters} from 'vuex'
import {adminReadableMixin, normalMixin} from '../../../common/js/mixin'

export default {
  components: {AdminOrderDetail},
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  mixins: [adminReadableMixin, normalMixin],
  data() {
    return {
      projectType: PROJECT_TYPE,
      orderNo: '', // 订单号码
      packageId: '', // 套餐ID
      agencyType: '', // 机构所属类别
      agencyId: '', // 机构ID
      userId: '', // 平台
      orderStatus: '', // 订单状态
      orderPaymentStatus: '', // 支付状态
      invoicePrintTempState: '', // 发票打印状态
      invoiceType: '', // 发票类型
      keywords: '',
      dateRange: [],
      searchData: {
        orderNo: '', // 订单号码
        packageId: '', // 套餐ID
        projectType: '', // 机构所属类别
        agencyId: '', // 机构ID
        userId: '', // 平台
        orderStatus: '', // 订单状态
        orderPaymentStatus: '', // 支付状态
        invoicePrintTempState: '', // 发票打印状态
        invoiceType: '', // 发票类型
        startTime: '',
        endTime: '',
        rowsNum: PAGE_SIZE,
        currentPage: 1
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      editableTabsValue: 'list',
      editableTabs: [],
      currentOrder: {},
      loading: false,
      list: [],
      packageList: [],
      agencyIdList: [],
      userIdList: [],
      pageBean: {},
      assetsData: {
        total: 0,
        received: 0,
        back: 0
      },
      orderDetail: {
        iccLogistics: {},
        iccOrder: {},
        iccInvoice: {}
      },
      dialogFormVisible: false,
      rules: {
        logisticsSid: [{
          required: true,
          message: '请选择物流公司',
          trigger: 'change'
        }],
        logisticsNo: [{
          required: true,
          message: '请输入物流单号',
          trigger: 'change'
        }, {
          max: 25,
          message: '最多25个字符',
          trigger: 'change'
        }],
        logisticsRemark: [{
          max: 30,
          message: '最多30个字符',
          trigger: 'change'
        }]
      },
      form: {
        invoiceId: '', // 发票id
        userId: '', // 用户id
        logisticsSid: '', // 物流公司id
        logisticsNo: '', // 物流单号
        logisticsRemark: '' // 备注
      },
      loading2: false,
      dialogFormVisible2: false,
      form2: {
        userId: '',
        orderNo: ''
      },
      rules2: {},
      loading3: false,
      dialogFormVisible3: false,
      form3: {
        orderId: '',
        price: ''
      },
      rules3: {
        price: [{
          required: true,
          message: '请输入付款金额',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[\d]{1,5}$/.test(value)) {
              callback()
            } else {
              callback(new Error('只能输入数字，1-5位'))
            }
          }
        }]
      },
      loading4: false,
      selections: []
    }
  },
  methods: {
    removeTab(name) {
      this.editableTabs.splice(this.editableTabs.findIndex(item => item.name === name), 1)
      this.editableTabsValue = 'list'
    },
    tabClick(tab) {},
    onSubmit() {
      this.searchData.orderNo = this.keywords
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.orderNo = '' // 订单号码
      this.packageId = '' // 套餐ID
      this.agencyType = '' // 机构所属类别
      this.agencyId = '' // 机构ID
      this.userId = '' // 平台
      this.orderStatus = '' // 订单状态
      this.orderPaymentStatus = '' // 支付状态
      this.invoicePrintTempState = '' // 发票打印状态
      this.invoiceType = '' // 发票类型
      this.keywords = ''
      this.searchData.currentPage = 1
      this.searchData.orderNo = ''
      this.dateRange = []
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    handleDbclick(row, event) {
      this.$refs.table.toggleRowExpansion(row)
    },
    handleExpandChange(row, expandedRows) {
      if (expandedRows.length > 1) {
        setTimeout(() => {
          expandedRows.forEach(item => {
            if (row.id !== item.id) {
              this.$refs.table.toggleRowExpansion(item)
            }
          })
        }, 20)
      }
    },
    getPackageList() {
      post('service/business/college/iccOrder/iccPackage/getPackageList.xf').then(res => {
        this.packageList = res.result
      })
    },
    getAgencyIdList(agencyType) {
      post('service/sys/iccAgency/iccAgency/getIccAgencyListByType.xf', {agencyType}).then(res => {
        this.agencyIdList = res.result
      })
    },
    getUserIdList(agencyId) {
      post('service/business/college/iccUser/iccUser/getIccUserListByAgency.xf', {agencyId}).then(res => {
        this.userIdList = res.result
      })
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccOrder/iccOrder/getAllOrderList.xf', this.searchData).then(res => {
        this.loading = false
        if (res.pageBean.currentPage === 1 && res.result.length) {
          let total = Number(res.result[0].total)
          let back = Number(res.result[0].refund)
          this.assetsData.total = total + back
          this.assetsData.received = total
          this.assetsData.back = back
        } else if (!res.result.length) {
          this.assetsData.total = 0
          this.assetsData.received = 0
          this.assetsData.back = 0
        }
        this.list = res.result
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.searchData.currentPage = 1
      this.getList()
    },
    handleCurrentChange(num) {
      this.searchData.currentPage = num
      this.getList()
    },
    getDetail(row) {
      this.fullLoading = this.$loading({
        lock: true
      })
      let orderId = row.orderId
      post('service/business/college/iccOrder/iccOrder/getOrderDetail.xf', {orderId}).then(res => {
        this.fullLoading.close()
        this.editableTabs = [{
          name: 'detail',
          title: '订单详情'
        }]
        this.editableTabsValue = 'detail'
        this.orderDetail = {
          iccLogistics: res.result.iccLogistics || {},
          iccOrder: res.result.iccOrder || {},
          iccInvoice: res.result.iccInvoice || {}
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleSelectionChange(selection) {
      this.selections = selection.map(item => item.orderId)
    },
    handleCommand(cmd) {
      let str
      let arr = []
      if (cmd === 'first') {
        for (let i in this.searchData) {
          arr.push(`${i}=${this.searchData[i]}`)
        }
        str = `?${arr.join('&')}`
        window.open(`${BASE_URL}service/business/college/iccOrder/iccOrder/exportOrderList.xf${str}`)
      } else if (cmd === 'second') {
        arr = this.list.map(item => item.orderId)
        window.open(`${BASE_URL}service/business/college/iccOrder/iccOrder/exportOrderList.xf?orderIdStr=${arr.join(',')}`)
      } else if (cmd === 'third') {
        if (!this.selections.length) {
          this.noSelect()
          return
        }
        window.open(`${BASE_URL}service/business/college/iccOrder/iccOrder/exportOrderList.xf?orderIdStr=${this.selections.join(',')}`)
      }
    },
    handleCommand2(cmd) {
      let str
      let arr = []
      if (cmd === 'first') {
        for (let i in this.searchData) {
          arr.push(`${i}=${this.searchData[i]}`)
        }
        str = `?${arr.join('&')}`
        window.open(`${BASE_URL}service/business/college/iccInvoice/iccInvoice/exportInvoiceList.xf${str}`)
      } else if (cmd === 'second') {
        arr = this.list.map(item => item.orderId)
        window.open(`${BASE_URL}service/business/college/iccInvoice/iccInvoice/exportInvoiceList.xf?orderIdStr=${arr.join(',')}`)
      } else if (cmd === 'third') {
        if (!this.selections.length) {
          this.noSelect()
          return
        }
        window.open(`${BASE_URL}service/business/college/iccInvoice/iccInvoice/exportInvoiceList.xf?orderIdStr=${this.selections.join(',')}`)
      }
    },
    downInvoice(row) {
      window.open(`${BASE_URL}service/business/college/iccInvoice/iccInvoice/exportInvoiceList.xf?orderIdStr=${row.orderId}`)
    },
    logistics(row) {
      this.form.invoiceId = row.invoiceId
      this.form.userId = row.userId || ''
      this.form.logisticsSid = row.logisticsSid || ''
      this.form.logisticsNo = row.logisticsNo || ''
      this.form.logisticsRemark = row.logisticsRemark || ''
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 20)
    },
    addSubmit() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loading2 = true
          let o = Object.assign({}, this.form)
          for (let i in o) {
            o[i] = encodeURIComponent(o[i])
          }
          post('service/business/college/iccLogistics/iccLogistics/applyIccInvoice.xf', o).then(res => {
            this.loading2 = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible = false
            }
          }).catch(() => {
            this.loading2 = false
          })
        }
      })
    },
    backSubmit() {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/alipay/alipay/toAccountTransfer.xf', this.form2).then(res => {
        this.fullLoading.close()
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getList()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    refund(row) {
      // this.dialogFormVisible2 = true
      this.form2.orderNo = row.orderNo
      this.form2.userId = this.uid
      this.$confirm('确定要对该订单进行退款吗?退款费用在一天之内返回原付款账户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.backSubmit()
      }).catch(() => {
        // 1
      })
    },
    pay(row) {
      // this.form3.orderId = row.orderId
      // this.dialogFormVisible3 = true
      this.$confirm(`为该订单付款${row.packagePrice}元，是否继续？`, `提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.paySubmit(row.orderId)
      }).catch(() => {
        // 取消
      })
    },
    paySubmit(orderId) {
      // this.$refs.form3.validate().then()
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccOrder/iccOrder/ptpTransferPayOrder.xf', {orderId}).then(res => {
        this.fullLoading.close()
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getList()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    }
  },
  watch: {
    agencyType(newVal, oldVal) {
      this.searchData.projectType = newVal
      this.searchData.agencyId = ''
      this.searchData.currentPage = 1
      this.getList()
    },
    agencyId(newVal, oldVal) {
      this.searchData.agencyId = newVal
      this.searchData.userId = ''
      if (newVal !== '') {
        this.getUserIdList(newVal)
        this.searchData.currentPage = 1
        this.getList()
      } else {
        this.userIdList = []
      }
    },
    dateRange(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.searchData.startTime = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endTime = dateFormat.call(newVal[1], 'yyyy-MM-dd')
        this.searchData.currentPage = 1
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
        this.searchData.currentPage = 1
      }
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    packageId(newVal, oldVal) {
      this.searchData.packageId = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    userId(newVal, oldVal) {
      this.searchData.userId = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    orderStatus(newVal, oldVal) {
      this.searchData.orderStatus = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    orderPaymentStatus(newVal, oldVal) {
      this.searchData.orderPaymentStatus = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    invoicePrintTempState(newVal, oldVal) {
      this.searchData.invoicePrintTempState = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    },
    invoiceType(newVal, oldVal) {
      this.searchData.invoiceType = newVal
      if (newVal !== '') {
        this.searchData.currentPage = 1
        this.getList()
      }
    }
  },
  created() {
    this.getPackageList()
    this.getList()
  }
}
</script>
<style scoped lang="scss">
  .add{
    width: 500px;
    margin: 0 auto;
    .el-select{
      width: 100%;
    }
  }
  .payForm{
    width: 400px;
    margin: 0 auto;
    .el-select{
      width: 100%;
    }
  }
  .demo-table-expand{
    .el-form-item{
      margin: 0;
      width: 50%;
      display: inline-block;
    }
  }
  .msg{
    padding: 10px 0;
    font-size: 14px;
  }
  .red{
    color: red;
  }
  .download{
    padding: 10px 0;
  }
  .pagination{
    padding: 10px 0;
    text-align: center;
  }
</style>
