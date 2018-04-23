<template>
  <div class="order_list">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="我的发票"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      stripe
      border
      v-loading="loading"
      style="width: 100%"
      @click="showList()"
    >
      <el-table-column
        align="center"
        label="购买套餐">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="购买时间">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPaymentTime || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        align="center"
        label="购买人">
      </el-table-column>
      <el-table-column
        align="center"
        label="发票状态">
        <template slot-scope="scope">
          <span>{{ scope.row.invoicePrintState == 0 ? "待打印" : scope.row.invoicePrintState == 1 ? "等待发出" : scope.row.invoicePrintState == 2 ? "已发出" :  scope.row.invoicePrintState ? "未申请" : scope.row.invoicePrintState ? "已接收" : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.invoicePrintState" @click="handleClick(scope.row.invoiceId)" type="text" size="small">查看</el-button>
          <el-button v-if="scope.row.invoicePrintState" @click="addNew(scope.row.invoiceId,scope.row.orderId)"  type="text" size="small">重新申请</el-button>
          <el-button v-if="!scope.row.invoicePrintState" @click="addNew(scope.row.invoiceId,scope.row.orderId)"  type="text" size="small">申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <el-dialog title="发票信息" :visible.sync="dialogTableVisible" :loading="loading">
      <el-dialog
        width="450px"
        title="物流信息"
        :visible.sync="innerVisible"
        append-to-body>
        <p style="text-align: center;" v-if="!invoiceList.length">暂无物流信息~</p>
        <el-steps direction="vertical" :active="invoiceList.length - 1" space="80px" class="steps">
          <el-step :title="val.AcceptTime" :description="val.AcceptStation" v-for="(val, key) in invoiceList" :key="key"></el-step>
        </el-steps>
      </el-dialog>
      <div class="box_message">
       <el-button type="primary" @click="innerVisible = true" size="small"> 查看物流信息</el-button>
        <table class="user_list" border="1px">
          <tr>
            <td class="table_left">发票类型</td>
            <td class="table_right">{{detailed.invoiceType == 0 ? "电子发票" : "纸质发票" || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">发票种类</td>
            <td class="table_right">{{detailed.invoiceClass == 0 ? "增值税普通发票" : "增值税专用发票" || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">发票抬头</td>
            <td class="table_right">{{detailed.invoiceHead || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">税号</td>
            <td class="table_right">{{detailed.invoiceDutyParagraph || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">发票内容</td>
            <td class="table_right">{{detailed.invoiceContent || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">发票金额</td>
            <td class="table_right">{{detailed.invoiceValue || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">地址</td>
            <td class="table_right">{{detailed.invoiceAddress || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">电话</td>
            <td class="table_right">{{detailed.invoiceTelephone || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">开户行</td>
            <td class="table_right">{{detailed.invoiceOpenBank || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">银行卡账户</td>
            <td class="table_right">{{detailed.invoiceAccounts || nulltip}}</td>
          </tr>
        </table>
        <p class="text_style">收件信息</p>
        <table class="user_list" border="1px">
          <tr>
            <td class="table_left">收件人</td>
            <td class="table_right">{{detailed.invoiceAddressee || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">联系电话</td>
            <td class="table_right">{{detailed.invoiceAddresseePhone || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">所在地区</td>
            <td class="table_right">{{detailed.invoiceAddresseeArea || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">详细地址</td>
            <td class="table_right">{{detailed.invoiceAddresseeAddress || nulltip}}</td>
          </tr>
          <tr>
            <td class="table_left">电子邮件</td>
            <td class="table_right">{{detailed.invoiceAddresseeEmail || nulltip}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="发票信息" :visible.sync="dialogFormVisible" :loading="loading" fullscreen width="600px">
      <el-form :model="form" :rules="rules" ref="form" class="form">
        <el-form-item label="请选择发票类型" :label-width="formLabelWidth" prop="invoiceType">
          <el-radio-group v-model="form.invoiceType"  >
            <el-radio border disabled  :label="0" >电子发票</el-radio>
            <el-radio border  :label="1" >纸质发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票种类" prop="invoiceClass" :label-width="formLabelWidth">
          <el-radio-group v-model="form.invoiceClass">
            <el-radio :label="0">增值税普通发票</el-radio>
            <el-radio :label="1">增值税专用发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抬头类型" prop="invoiceHeadType" :label-width="formLabelWidth">
          <el-radio-group v-model="form.invoiceHeadType">
            <el-radio :label="0">企业抬头</el-radio>
            <el-radio :label="1">个人/非企业单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" :label-width="formLabelWidth" prop="invoiceHead">
          <el-input class="user_width" v-model="form.invoiceHead" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="税号" :label-width="formLabelWidth" prop="invoiceDutyParagraph">
          <el-input class="user_width" v-model="form.invoiceDutyParagraph" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发票内容" :label-width="formLabelWidth" prop="invoiceContent">
          <el-input class="user_width" v-model="form.invoiceContent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发票金额" :label-width="formLabelWidth" prop="invoiceValue">
          <el-input class="user_width" v-model="form.invoiceValue" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="invoiceAddress">
          <el-input class="user_width" v-model="form.invoiceAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="invoiceTelephone">
          <el-input class="user_width" v-model="form.invoiceTelephone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户行" :label-width="formLabelWidth" prop="invoiceOpenBank">
          <el-input class="user_width" v-model="form.invoiceOpenBank" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡账户" :label-width="formLabelWidth" prop="invoiceAccounts">
          <el-input class="user_width" v-model="form.invoiceAccounts" auto-complete="off"></el-input>
        </el-form-item>
        <p class="text_style">收件信息</p>
        <el-form-item v-if="form.invoiceType === 1" label="收件人" :label-width="formLabelWidth" prop="invoiceAddressee">
          <el-input class="user_width" v-model="form.invoiceAddressee" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.invoiceType === 1" label="联系电话" :label-width="formLabelWidth" prop="invoiceAddresseePhone">
          <el-input class="user_width" v-model="form.invoiceAddresseePhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.invoiceType === 1" label="所在地区" :label-width="formLabelWidth" prop="invoiceAddresseeArea">
          <el-input class="user_width" v-model="form.invoiceAddresseeArea" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.invoiceType === 1" label="详细地址" :label-width="formLabelWidth" prop="invoiceAddresseeAddress">
          <el-input class="user_width" v-model="form.invoiceAddresseeAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  label="电子邮箱" :label-width="formLabelWidth" prop="invoiceAddresseeEmail">
          <el-input class="user_width" v-model="form.invoiceAddresseeEmail" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {PAGE_SIZE} from '../../../common/js/config'
import {mapGetters} from 'vuex'
import {post} from '../../../common/js/http'

export default {
  name: 'order_list',
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      editableTabsValue: 'list',
      nulltip: '--',
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        orderId: '',
        invoiceId: '',
        invoiceType: 1,
        invoiceClass: '',
        invoiceHeadType: '',
        invoiceHead: '',
        invoiceDutyParagraph: '',
        invoiceContent: '',
        invoiceValue: '',
        invoiceAddress: '',
        invoiceTelephone: '',
        invoiceOpenBank: '',
        invoiceAccounts: '',
        invoiceAddressee: '',
        invoiceAddresseePhone: '',
        invoiceAddresseeArea: '',
        invoiceAddresseeAddress: '',
        invoiceAddresseeEmail: ''
      },
      rules: {
        invoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        invoiceClass: [
          { required: true, message: '请选择发票种类', trigger: 'change' }
        ],
        invoiceHeadType: [
          { required: true, message: '请选择抬头类型', trigger: 'change' }
        ],
        invoiceHead: [
          { required: true, message: '请输入发票抬头', trigger: 'change' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' }
        ],
        invoiceDutyParagraph: [
          { required: true, message: '请输入税号', trigger: 'change' },
          { validator(rule, value, callback) {
            if (/^[0-9]*$/.test(value)) {
              if (value.length > 30) {
                callback(new Error('税号长度不能超过30位'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入数字值'))
            }
          },
          trigger: 'change' }
        ],
        invoiceContent: [
          { required: true, message: '请输入发票内容', trigger: 'change' },
          { min: 1, max: 30, message: '发票内容长度在 1 到 20 个字符', trigger: 'change' }
        ],
        invoiceValue: [
          { required: true, message: '请输入发票金额', trigger: 'change' },
          { validator(rule, value, callback) {
            if (/^[0-9]*$/.test(value)) {
              if (value.length > 5) {
                callback(new Error('发票金额长度不能超过5位'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入数字值'))
            }
          },
          trigger: 'change' }
        ],
        invoiceAddress: [
          { required: true, message: '请输入地址', trigger: 'change' },
          { min: 1, max: 30, message: '地址内容长度在 1 到 30 个字符', trigger: 'change' }
        ],
        invoiceTelephone: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          { validator(rule, value, callback) {
            if (/^[0-9]*$/.test(value)) {
              if (value.length > 11) {
                callback(new Error('请输入正确的电话格式'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入正确的电话格式'))
            }
          },
          trigger: 'change' }
        ],
        invoiceOpenBank: [
          { required: true, message: '请输入开户银行', trigger: 'change' },
          { min: 1, max: 10, message: '开户银行长度在 1 到 10 个字符', trigger: 'change' }
        ],
        invoiceAccounts: [
          { required: true, message: '请输入银行卡账户', trigger: 'change' },
          { validator(rule, value, callback) {
            if (/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的银行卡账户格式'))
            }
          },
          trigger: 'change' }
        ],
        invoiceAddressee: [
          { required: true, message: '请输入收件人姓名', trigger: 'change' },
          { min: 1, max: 8, message: '姓名长度在 1 到 8 个字符', trigger: 'change' }
        ],
        invoiceAddresseePhone: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          { validator(rule, value, callback) {
            if (/^[0-9]*$/.test(value)) {
              if (value.length > 11) {
                callback(new Error('请输入正确的电话格式'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入正确的电话格式'))
            }
          },
          trigger: 'change' }
        ],
        invoiceAddresseeArea: [
          { required: true, message: '请输入所在地区', trigger: 'change' },
          { min: 1, max: 30, message: '所在地区内容长度在 1 到 30 个字符', trigger: 'change' }
        ],
        invoiceAddresseeAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' },
          { min: 1, max: 30, message: '详细地址内容长度在 1 到 30 个字符', trigger: 'change' }
        ],
        invoiceAddresseeEmail: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
        ]
      },
      userdata: {
        userId: '',
        rowsNum: PAGE_SIZE,
        currentPage: 1
      },
      detailed: {},
      invoiceList: [],
      innerVisible: false,
      loading: false,
      pageBean: {},
      list: [],
      formLabelWidth: '130px',
      loading2: false
    }
  },
  methods: {
    showList () {
    },
    handleClick(invoiceId) {
      this.dialogTableVisible = true
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccInvoice/iccInvoice/getIccInvoice.xf', { invoiceId: invoiceId }).then(data => {
        this.loading = false
        data.result || (data.result = [])
        this.detailed = data.result
        this.invoiceList = data.result.logistics instanceof Array ? data.result.logistics.Traces : []
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(size) {
      this.userdata.rowsNum = size
      this.getmessage()
    },
    handleCurrentChange(page) {
      this.userdata.currentPage = page
      this.getmessage()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading2 = true
          post('service/business/college/iccInvoice/iccInvoice/saveIccInvoice.xf', this.form).then(res => {
            this.loading2 = false
            this.dialogFormVisible = false
            if (res.error.result === 1) {
              this.$alert(res.error.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm(formName)
                }
              })
            }
          }).catch(() => {
            this.loading2 = false
            this.dialogFormVisible = false
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    getmessage() {
      if (this.loading) return
      this.loading = true
      this.userdata.userId = this.uid
      post('service/business/college/iccInvoice/iccInvoice/getIccInvoiceList.xf', this.userdata).then(data => {
        this.loading = false
        data.result || (data.result = [])
        this.tableData = data.result
        this.pageBean = data.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    addNew(Fid, Did) {
      if (this.loading) return
      this.loading = true
      this.form.invoiceId = Fid
      this.form.orderId = Did
      post('service/business/college/iccInvoice/iccInvoice/applyIccInvoice.xf', {
        orderId: Did,
        userId: this.uid
      }).then(data => {
        this.loading = false
        data.result || (data.result = [])
        if (data.result) {
          // this.form = data.result
        }
      }).catch(() => {
        this.loading = false
      })
      this.dialogFormVisible = true
    }
  },
  mounted() {
    this.getmessage()
  }
}
</script>

<style scoped lang="scss">
  @import "../../../common/style/variables";

  .box_message{
    border-top: 1px solid gainsboro;
    padding-top: 20px ;
  }
  .user_list{
    border-collapse: collapse;
    border: 1px solid gainsboro;
    width: 100%;
    margin-top: 20px;
    text-align: center;
    .table_left{
      width: 20%;
      background: #fafafa;
    }
    .table_right{
      width: 80%;
      text-align: left;
      padding: 10px;
    }
  }
  .user_width{
    width: 250px;
  }
  .text_style{
    padding-left: 10px;
    font-size: 16px;
    margin-bottom: 22px;
    color: $--color-primary;
  }
  .pagination{
    margin-top: 20px;
    text-align: center;
  }
  .form{
    width: 470px;
    margin: 0 auto;
  }
</style>
