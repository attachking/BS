<!--客户维护-->
<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="客户维护"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input v-model="projectName" placeholder="项目名称" @keydown.native.enter="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input v-model="customerOrg" placeholder="机构名称" @keydown.native.enter="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="customerName" placeholder="客户名称" @keydown.native.enter="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="客户账号">
        <el-input v-model="customerAccount" placeholder="客户账号" @keydown.native.enter="onSubmit"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改" :visible.sync="dialogFormVisible" width="600px" fullscreen>
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="客户账号">
          <span>{{form.customerAccount}}</span>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="客户所在机构" prop="customerOrg">
          <el-input v-model="form.customerOrg" placeholder="请输入客户所在机构"></el-input>
        </el-form-item>
        <el-form-item label="客户职位" prop="customerDuty">
          <el-input v-model="form.customerDuty" placeholder="请输入客户职位"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号" prop="customerPhone">
          <el-input v-model="form.customerPhone" placeholder="请输入客户手机号"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="customerSex">
          <el-radio v-model="form.customerSex" :label="0">男</el-radio>
          <el-radio v-model="form.customerSex" :label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="办公地址" prop="customerOfficeAddress">
          <el-input v-model="form.customerOfficeAddress" placeholder="请输入客户办公地址"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="customerOfficeTel">
          <el-input v-model="form.customerOfficeTel" placeholder="请输入客户办公电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="customerEmail">
          <el-input v-model="form.customerEmail" placeholder="请输入客户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="QQ号" prop="customerQq">
          <el-input v-model="form.customerQq" placeholder="请输入客户QQ号"></el-input>
        </el-form-item>
        <el-form-item label="客户微信" prop="customerWechat">
          <el-input v-model="form.customerWechat" placeholder="请输入客户微信"></el-input>
        </el-form-item>
        <el-form-item label="IP白名单" prop="customerAccessIp">
          <el-input v-model="form.customerAccessIp" placeholder="请输入IP白名单"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="customerRemark">
          <el-input type="textarea" v-model="form.customerRemark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      stripe
      :data="list"
      style="width: 100%"
      v-loading="loading"
      @row-dblclick="handleDbclick"
      @expand-change="handleExpandChange"
      ref="table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目名称:">
              <span>{{ props.row.projectName || '--' }}</span>
            </el-form-item>
            <el-form-item label="项目类别:">
              <span>{{ props.row.projectTypeStr || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户名称:">
              <span>{{ props.row.customerName || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户联系电话:">
              <span>{{ props.row.customerPhone || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户邮箱:">
              <span>{{ props.row.customerEmail || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户QQ:">
              <span>{{ props.row.customerQq || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户微信:">
              <span>{{ props.row.customerWechat || '--' }}</span>
            </el-form-item>
            <el-form-item label="实施人员:">
              <span>{{ props.row.implementStr || '--' }}</span>
            </el-form-item>
            <el-form-item label="所在机构:">
              <span>{{ props.row.customerOrg || '--' }}</span>
            </el-form-item>
            <el-form-item label="职位:">
              <span>{{ props.row.customerDuty || '--' }}</span>
            </el-form-item>
            <el-form-item label="办公地址:">
              <span>{{ props.row.customerOfficeAddress || '--' }}</span>
            </el-form-item>
            <el-form-item label="办公电话:">
              <span>{{ props.row.customerOfficeTel || '--' }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ props.row.customerCreatetime || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户性别:">
              <span>{{ props.row.customerSexStr }}</span>
            </el-form-item>
            <el-form-item label="IP白名单:">
              <span>{{ props.row.customerAccessIp || '--' }}</span>
            </el-form-item>
            <el-form-item label="token:">
              <span>{{ props.row.customerAccessToken || '--' }}</span>
            </el-form-item>
            <el-form-item label="项目备注:">
              <span>{{ props.row.projectRemark || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户备注:">
              <span>{{ props.row.customerRemark || '--' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称">
        <template slot-scope="scope">
          <span>{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目类别"
        align="center"
        prop="projectTypeStr">
      </el-table-column>
      <el-table-column
        label="客户名称"
        align="center"
        prop="customerName">
      </el-table-column>
      <el-table-column
        label="联系电话"
        align="center"
        prop="customerPhone">
      </el-table-column>
      <el-table-column
        label="所在机构"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.customerOrg || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职位"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.customerDuty || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="checkResetPsd(scope.row.customerId)"
            :disabled="!adminReadable"
            size="small">
            重置密码
          </el-button>
          <el-button
            type="text"
            @click="showContacts(scope.row.customerId)"
            size="small">
            通讯录
          </el-button>
          <el-button
            type="text"
            @click="edit(scope.row.customerId)"
            :disabled="!adminReadable"
            size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <!--<el-dropdown @command="handleCommand" class="dropdown">
      <el-button type="primary" size="small">
        导出客户<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="first">按当前条件导出</el-dropdown-item>
        &lt;!&ndash;<el-dropdown-item command="second">导出当前页</el-dropdown-item>&ndash;&gt;
        <el-dropdown-item command="third">导出当前页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>-->
    <el-dialog title="通讯录" :visible.sync="dialogFormVisible2" width="600px" fullscreen>
      <el-dialog
        width="500px"
        :title="contactTitle"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form :model="contactForm" style="width: 420px;" label-width="120px" ref="contactForm" :rules="rules2">
          <el-form-item label="联系人" prop="addressBooksContacts">
            <el-input v-model="contactForm.addressBooksContacts" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="addressBooksContactsPhone">
            <el-input v-model="contactForm.addressBooksContactsPhone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="addressBooksContactsOrg">
            <el-input v-model="contactForm.addressBooksContactsOrg" placeholder="请输入所属机构"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="addressBooksContactsDuty">
            <el-input v-model="contactForm.addressBooksContactsDuty" placeholder="请输入联系人职位"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="contactSubmit" :loading="loading5">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addContact" :disabled="!adminReadable">添加联系人</el-button>
      <el-table
        stripe
        :data="contacts"
        style="width: 100%"
        v-loading="loading4"
        class="service-table"
        ref="table2">
        <el-table-column
          align="center"
          label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.addressBooksContacts || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所在机构"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.addressBooksContactsOrg || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职位"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.addressBooksContactsDuty || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.addressBooksContactsPhone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editContact(scope.row)"
              :disabled="!adminReadable"
              size="small">
              修改
            </el-button>
            <el-button
              type="text"
              @click="confirmDelContact(scope.row.addressBooksId)"
              :disabled="!adminReadable"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @current-change="handleCurrentChange2"
                  :bean="pageBean2"
                  layout="prev, pager, next"
                  class="pagination"></pagination>
    </el-dialog>
  </div>
</template>
<script>
import {PAGE_SIZE, PROJECT_TYPE, BASE_URL} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import {dateFormat} from '../../../common/js/clazz'
import {mapGetters} from 'vuex'
import {adminReadableMixin} from '../../../common/js/mixin'

export default {
  mixins: [adminReadableMixin],
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    return {
      editableTabsValue: 'list',
      projectType: PROJECT_TYPE,
      customerName: '',
      customerOrg: '',
      projectName: '',
      customerAccount: '',
      dialogFormVisible: false,
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        customerName: '', // 客户名称
        customerOrg: '', // 组织机构
        projectName: '', // 项目名称
        customerAccount: '' // 客户账号
      },
      form: {
        projectId: '', // 项目id
        customerId: '', // 客户id
        // projectName: '', // 项目名称
        customerAccount: '', // 客户账号
        customerName: '', // 客户名称
        customerOrg: '', // 客户所在机构
        customerDuty: '', // 客户职位
        customerPhone: '', // 客户电话
        customerSex: '', // 客户性别
        customerOfficeAddress: '', // 办公地址
        customerOfficeTel: '', // 办公电话
        customerEmail: '', // 客户邮箱
        customerQq: '', // 客户QQ
        customerWechat: '', // 客户微信
        customerRemark: '', // 客户备注
        customerAccessIp: '' // IP白名单
        // userName: '', // 创建人名称
        // customerCreatetime: '' // 创建时间
      },
      list: [],
      pageBean: {},
      loading: false,
      loading2: false,
      rules: {
        customerName: [{
          required: true,
          message: '请输入客户名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        customerOrg: [{
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        customerDuty: [{
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        customerSex: [{
          required: true,
          message: '请选择客户性别',
          trigger: 'change'
        }],
        customerOfficeAddress: [{
          max: 30,
          message: '最多30个字符',
          trigger: 'change'
        }],
        customerPhone: [{
          required: true,
          message: '请输入客户手机号',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的手机号'))
            }
          },
          trigger: 'change'
        }],
        customerEmail: [{
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的邮箱号'))
            }
          },
          trigger: 'change'
        }],
        customerWechat: [{
          validator(rule, value, callback) {
            if (/[\w]{0,20}/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的微信号'))
            }
          },
          trigger: 'change'
        }],
        customerQq: [{
          validator(rule, value, callback) {
            if (/[1-9][0-9]{4,14}/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的QQ号'))
            }
          },
          trigger: 'change'
        }],
        customerOfficeTel: [{
          validator(rule, value, callback) {
            if (/[\w]{0,15}/.test(value)) {
              callback()
            } else {
              callback(new Error('错误的电话格式'))
            }
          },
          trigger: 'change'
        }],
        customerAccessIp: [{
          validator(rule, value, callback) {
            if (/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的IP地址'))
            }
          },
          trigger: 'change'
        }],
        customerRemark: [{
          max: 50,
          message: '最多50个字符',
          trigger: 'change'
        }]
      },
      contacts: [],
      loading4: false,
      form2: {},
      pageBean2: {},
      dialogFormVisible2: false,
      searchContacts: {
        rowsNum: 10,
        currentPage: 1,
        customerId: ''
      },
      innerVisible: false,
      contactForm: {
        userId: '', // 当前登录人员id
        addressBooksId: '', // 通讯录id
        customerId: '', // 客户id
        addressBooksContacts: '', // 通讯录联系人
        addressBooksContactsOrg: '', // 联系人部门
        addressBooksContactsDuty: '', // 联系人职位
        addressBooksContactsPhone: '' // 联系人电话
      },
      rules2: {
        addressBooksContacts: [{
          required: true,
          message: '请输入联系人姓名',
          trigger: 'change'
        }, {
          max: 15,
          message: '最多不超过15个字符',
          trigger: 'change'
        }],
        addressBooksContactsOrg: [{
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        addressBooksContactsDuty: [{
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        addressBooksContactsPhone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的手机号'))
            }
          },
          trigger: 'change'
        }]
      },
      loading5: false,
      contactTitle: '',
      selections: []
    }
  },
  methods: {
    dateFormat(str, fmt) {
      if (!str) return ''
      str = typeof str === 'string' ? str.replace(/-/g, '/') : str
      return dateFormat.call(new Date(str), fmt)
    },
    onSubmit() {
      this.searchData.customerName = encodeURIComponent(this.customerName)
      this.searchData.customerOrg = encodeURIComponent(this.customerOrg)
      this.searchData.projectName = encodeURIComponent(this.projectName)
      this.searchData.customerAccount = encodeURIComponent(this.customerAccount)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.currentPage = 1
      this.customerName = ''
      this.customerOrg = ''
      this.projectName = ''
      this.customerAccount = ''
      this.onSubmit()
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccUser/iccCustomer/getCustomerList.xf', this.searchData).then(res => {
        this.loading = false
        this.list = res.result
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.edit()
    },
    addSubmit() {
      this.form.userId = this.uid
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loading2 = true
          post('service/business/college/iccUser/iccCustomer/saveCustomerInfo.xf', this.form).then(res => {
            this.loading2 = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => {
            this.loading2 = false
          })
        }
      })
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
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
    },
    edit(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccUser/iccCustomer/editCustomerInfo.xf', {
        customerId: id,
        rowsNum: 1,
        currentPage: 1
      }).then(res => {
        this.fullLoading.close()
        const detail = res.result.iccCustomer || {}
        this.form.projectId = detail.projectId || ''
        this.form.customerId = detail.customerId || ''
        this.form.customerAccount = detail.customerAccount || ''
        this.form.customerName = detail.customerName || ''
        this.form.customerOrg = detail.customerOrg || ''
        this.form.customerDuty = detail.customerDuty || ''
        this.form.customerPhone = detail.customerPhone || ''
        this.form.customerSex = detail.customerSex || 0
        this.form.customerOfficeAddress = detail.customerOfficeAddress || ''
        this.form.customerOfficeTel = detail.customerOfficeTel || ''
        this.form.customerEmail = detail.customerEmail || ''
        this.form.customerQq = detail.customerQq || ''
        this.form.customerWechat = detail.customerWechat || ''
        this.form.customerAccessIp = detail.customerAccessIp || ''
        this.form.customerRemark = detail.customerRemark || ''
        this.dialogFormVisible = true
        setTimeout(() => {
          this.$refs.form.clearValidate()
        }, 20)
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    checkResetPsd(id) {
      this.$confirm('确定重置为初始密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetPsd(id)
      }).catch(() => {
        // 取消
      })
    },
    resetPsd(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccUser/iccUser/setUserPassword.xf', {
        userType: 1,
        nowUserId: this.uid,
        customerId: id
      }).then(res => {
        this.fullLoading.close()
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleCurrentChange2(page) {
      this.searchContacts.currentPage = page
      this.getContacts()
    },
    showContacts(customerId) {
      this.searchContacts.customerId = customerId
      this.searchContacts.currentPage = 1
      this.dialogFormVisible2 = true
      this.getContacts()
    },
    getContacts() {
      this.loading4 = true
      post('service/business/college/iccUser/iccAddressBooks/getAddressBooksList.xf', this.searchContacts).then(res => {
        this.loading4 = false
        this.contacts = res.result
        this.pageBean2 = res.pageBean
      }).catch(() => {
        this.loading4 = false
      })
    },
    addContact() {
      this.contactForm.addressBooksId = ''
      this.contactForm.customerId = this.searchContacts.customerId
      this.contactForm.addressBooksContacts = ''
      this.contactForm.addressBooksContactsOrg = ''
      this.contactForm.addressBooksContactsDuty = ''
      this.contactForm.addressBooksContactsPhone = ''
      this.contactTitle = '添加联系人'
      this.innerVisible = true
      setTimeout(() => {
        this.$refs.contactForm.clearValidate()
      }, 20)
    },
    editContact(data) {
      this.contactForm.addressBooksId = data.addressBooksId
      this.contactForm.customerId = this.searchContacts.customerId
      this.contactForm.addressBooksContacts = data.addressBooksContacts
      this.contactForm.addressBooksContactsOrg = data.addressBooksContactsOrg
      this.contactForm.addressBooksContactsDuty = data.addressBooksContactsDuty
      this.contactForm.addressBooksContactsPhone = data.addressBooksContactsPhone
      this.contactTitle = '修改联系人'
      this.innerVisible = true
    },
    contactSubmit() {
      this.contactForm.userId = this.uid
      this.$refs.contactForm.validate().then(valid => {
        if (valid) {
          this.loading5 = true
          post('service/business/college/iccUser/iccAddressBooks/saveAddressBooks.xf', this.contactForm).then(res => {
            this.loading5 = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.getContacts()
              this.innerVisible = false
            }
          }).catch(() => {
            this.loading5 = false
          })
        }
      })
    },
    confirmDelContact(id) {
      this.$confirm('确定删除该联系人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delContact(id)
      }).catch(() => {
        // 取消
      })
    },
    delContact(addressBooksIdStr) {
      this.loading4 = true
      post('service/business/college/iccUser/iccAddressBooks/delAddressBooks.xf', {
        userId: this.uid,
        addressBooksIdStr
      }).then(res => {
        this.loading4 = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getContacts()
        }
      }).catch(() => {
        this.loading4 = false
      })
    },
    handleSelectionChange(selections) {
      this.selections = selections
    },
    download(search) {
      window.open(`${BASE_URL}service/business/college/iccProject/iccProject/exportProjectInfo.xf?${search}`)
    },
    handleCommand(e) {
      if (e === 'first') {
        this.download(`projectName=${encodeURIComponent(this.searchData.projectName)}&customerName=${encodeURIComponent(this.searchData.customerName)}&customerOrg=${encodeURIComponent(this.searchData.customerOrg)}&customerAccount=${encodeURIComponent(this.searchData.customerAccount)}`)
      } else if (e === 'second') {
        this.download(`projectIdStr=${this.list.map(item => item.projectId).join(',')}`)
      } else if (e === 'third') {
        this.download(`projectIdStr=${this.selections.map(item => item.projectId).join(',')}`)
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style scoped lang="scss">
  .add{
    width: 470px;
    .el-select{
      width: 100%;
    }
  }
  .demo-table-expand{
    .el-form-item{
      width: 50%;
      margin: 0;
    }
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }

  .table {
    margin: 10px 0;
  }
  .no-margin{
    margin-bottom: 0;
  }
  .service-table{
    margin: 20px 0 0 0;
  }
</style>
