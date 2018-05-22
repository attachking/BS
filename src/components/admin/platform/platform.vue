<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建平台</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="category" placeholder="请选择所属类型" clearable>
          <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="dateRange">
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
      <el-form-item>
        <el-input v-model="keywords" placeholder="请输入平台名称进行查询" @keydown.native.enter="onSubmit">
          <el-button slot="append" icon="el-icon-search" @click="onSubmit" title="搜索"></el-button>
          <el-button slot="append" icon="el-icon-refresh" @click="reset" title="重置搜索条件"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" width="600px" fullscreen>
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="平台名称" prop="agencyId">
          <el-select v-model="form.agencyId" placeholder="请选择机构" clearable>
            <el-option :label="item.agencyName" :value="item.agencyId" v-for="(item, key) in agencyList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入平台名称"></el-input>
        </el-form-item>
        <el-form-item label="名称代码" prop="userCode">
          <el-input v-model="form.userCode" placeholder="名称代码" readonly></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="userAccount">
          <el-input v-model="form.userAccount" placeholder="请输入平台账号"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="userTel">
          <el-input v-model="form.userTel" placeholder="请输入办公电话"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="userContact">
          <el-input v-model="form.userContact" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="微信号" prop="userWechart">
          <el-input v-model="form.userWechart" placeholder="请输入微信号"></el-input>
        </el-form-item>
        <el-form-item label="QQ号" prop="userQq">
          <el-input v-model="form.userQq" placeholder="请输入QQ号"></el-input>
        </el-form-item>
        <el-form-item label="IP白名单" prop="userAccessIp">
          <el-input v-model="form.userAccessIp" placeholder="请输入IP白名单"></el-input>
        </el-form-item>
        <el-form-item label="服务时间" class="dateRange" v-if="!form.userId">
          <el-date-picker
            :editable="false"
            v-model="dateRange2"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="userRemark">
          <el-input type="textarea" v-model="form.userRemark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="serviceTimeTitle" :visible.sync="dialogFormVisible2">
      <el-form class="add" label-width="120px" ref="serviceTimeForm" :rules="serviceTimeRules" :model="serviceTime">
        <el-form-item label="服务时间" class="dateRange no-margin" prop="serviceTime">
          <el-date-picker
            :default-value="serviceDefault"
            :editable="false"
            v-model="dateRange3"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        :data="serviceTimeList"
        style="width: 100%"
        v-loading="loading4"
        class="service-table"
        ref="table2">
        <el-table-column
          align="center"
          label="服务时间">
          <template slot-scope="scope">
            <span>{{scope.row.serviceTimeStart}} -- {{scope.row.serviceTimeEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创办时间"
          align="center"
          prop="serviceTimeCreatetime">
        </el-table-column>
        <el-table-column
          label="创办人"
          align="center"
          prop="serviceTimeCreator">
        </el-table-column>
      </el-table>
      <pagination @current-change="handleCurrentChange2"
                  :bean="pageBean2"
                  layout="prev, pager, next"
                  class="pagination"></pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitServiceTime" :loading="loading3">确 定</el-button>
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
            <el-form-item label="平台名称:">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="机构名称:">
              <span>{{ props.row.agencyName }}</span>
            </el-form-item>
            <el-form-item label="所属类型:">
              <span>{{ props.row.agencyTypeName }}</span>
            </el-form-item>
            <el-form-item label="账号:">
              <span>{{ props.row.userAccount }}</span>
            </el-form-item>
            <el-form-item label="联系人:">
              <span>{{ props.row.userContact }}</span>
            </el-form-item>
            <el-form-item label="办公电话:">
              <span>{{ props.row.userTel }}</span>
            </el-form-item>
            <el-form-item label="联系电话:">
              <span>{{ props.row.userPhone }}</span>
            </el-form-item>
            <!--<el-form-item label="注册资本:">
              <span>{{ props.row.registeredCapital }}</span>
            </el-form-item>-->
            <el-form-item label="邮箱:">
              <span>{{ props.row.userEmail }}</span>
            </el-form-item>
            <el-form-item label="微信:">
              <span>{{ props.row.userWechart }}</span>
            </el-form-item>
            <el-form-item label="QQ:">
              <span>{{ props.row.userQq }}</span>
            </el-form-item>
            <el-form-item label="IP白名单:">
              <span>{{ props.row.userAccessIp }}</span>
            </el-form-item>
            <el-form-item label="token:">
              <span>{{ props.row.userAccessToken || '--' }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ dateFormat(props.row.userCreatetime, 'yyyy-MM-dd hh:mm:ss') }}</span>
            </el-form-item>
            <el-form-item label="平台服务时间:">
              <span>{{ props.row.startEndTime }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.userRemark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        align="center"
        width="50"
        type="index"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        align="center"
        label="平台名称">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属机构"
        align="center"
        prop="agencyName">
      </el-table-column>
      <el-table-column
        label="所属类型"
        align="center"
        prop="agencyTypeName">
      </el-table-column>
      <el-table-column
        label="联系人"
        align="center"
        prop="userContact">
      </el-table-column>
      <el-table-column
        label="平台服务时间"
        prop="startEndTime"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row.agencyId)"
            :disabled="!adminReadable"
            size="small">
            修改
          </el-button>
          <el-button
            type="text"
            @click="confirmRemove(scope.row.userId)"
            :disabled="!adminReadable"
            size="small">
            删除
          </el-button>
          <br>
          <el-button
            type="text"
            @click="checkResetPsd(scope.row.userId)"
            :disabled="!adminReadable"
            size="small">
            重置密码
          </el-button>
          <el-button
            type="text"
            @click="setServiceTime(scope.row)"
            :disabled="!adminReadable"
            size="small">
            设置服务时间
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
</template>
<script>
import {PAGE_SIZE, PROJECT_TYPE} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import {dateFormat, debounce} from '../../../common/js/clazz'
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
    let _this = this
    return {
      projectType: PROJECT_TYPE,
      addTitle: '创建平台',
      category: '',
      keywords: '',
      dialogFormVisible: false,
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        userType: 0,
        agencyType: '', // 所属类型
        userAgencyName: '', // 平台或机构名称
        beginTime: '',
        endTime: ''
      },
      form: {
        agencyId: '', // 机构id
        nowUserId: '', // 当前用户id
        userId: '', // 用户id
        userType: 0, // 用户类型
        userName: '', // 平台名称
        userCode: '',
        userStatus: 0,
        userAccount: '', // 账号
        userTel: '', // 办公电话
        userContact: '', // 联系人
        userPhone: '', // 联系电话
        userEmail: '', // 邮箱
        userWechart: '', // 微信
        userQq: '', // QQ号
        userAccessIp: '', // ip白名单
        serviceTimeStart: '', // 服务开始时间
        serviceTimeEnd: '', // 服务结束时间
        userRemark: '' // 备注
      },
      dateRange: [],
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
      list: [],
      pageBean: {},
      loading: false,
      dateRange2: [],
      loading2: false,
      agencyList: [],
      rules: {
        agencyId: [{
          required: true,
          message: '请选择机构',
          trigger: 'change'
        }],
        userName: [{
          required: true,
          message: '请输入平台名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        userAccount: [{
          required: true,
          message: '请输入平台账号',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/[a-zA-Z0-9]{1,20}/.test(value)) {
              callback()
            } else {
              callback(new Error('账号为1~20个字符，只能是数字或字母'))
            }
          },
          trigger: 'change'
        }],
        userTel: [{
          validator(rule, value, callback) {
            if (/[\w]{0,15}/.test(value)) {
              callback()
            } else {
              callback(new Error('错误的电话格式'))
            }
          },
          trigger: 'change'
        }],
        userContact: [{
          required: true,
          message: '请输入联系人',
          trigger: 'change'
        }, {
          max: 15,
          message: '最多15个字符',
          trigger: 'change'
        }],
        userPhone: [{
          validator(rule, value, callback) {
            if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的手机号'))
            }
          },
          trigger: 'change'
        }],
        userEmail: [{
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的邮箱号'))
            }
          },
          trigger: 'change'
        }],
        userWechart: [{
          validator(rule, value, callback) {
            if (/[\w]{0,20}/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的微信号'))
            }
          },
          trigger: 'change'
        }],
        userQq: [{
          validator(rule, value, callback) {
            if (/[1-9][0-9]{4,14}/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的QQ号'))
            }
          },
          trigger: 'change'
        }],
        userAccessIp: [{
          validator(rule, value, callback) {
            if (/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(value) || value === '') {
              callback()
            } else {
              callback(new Error('请输入正确的IP地址'))
            }
          },
          trigger: 'change'
        }],
        userRemark: [{
          max: 50,
          trigger: 'change'
        }]
      },
      serviceTimeRules: {
        serviceTime: [{
          validator(rule, value, callback) {
            setTimeout(() => {
              if (!_this.dateRange3.length) {
                callback(new Error('请选择服务时间段'))
              } else if (_this.dateRange3[0].getTime() < _this.maxServiceTime) {
                callback(new Error('新增服务时间必须在历史服务时间之后'))
              } else {
                callback()
              }
            }, 20)
          },
          trigger: 'change'
        }]
      },
      maxServiceTime: 0,
      dialogFormVisible2: false,
      loading3: false,
      dateRange3: [],
      serviceTime: {
        serviceTimeStart: '',
        serviceTimeEnd: ''
      },
      serviceTimeTitle: '',
      serviceDefault: new Date(),
      searchServiceTime: {
        rowsNum: 5,
        currentPage: 1
      },
      serviceTimeList: [],
      pageBean2: {},
      loading4: false
    }
  },
  methods: {
    dateFormat(str, fmt) {
      if (!str) return ''
      str = typeof str === 'string' ? str.replace(/-/g, '/') : str
      return dateFormat.call(new Date(str), fmt)
    },
    onSubmit() {
      this.searchData.userAgencyName = encodeURIComponent(this.keywords)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.currentPage = 1
      this.searchData.agencyType = ''
      this.searchData.userAgencyName = ''
      this.searchData.beginTime = ''
      this.searchData.endTime = ''
      this.category = ''
      this.keywords = ''
      this.dateRange = []
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccUser/iccUser/getIccUserList.xf', this.searchData).then(res => {
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
      this.form.nowUserId = this.uid
      this.form.userCode || (this.form.userCode = 'DEFAULT')
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loading2 = true
          post('service/business/college/iccUser/iccUser/saveIccUser.xf', this.form).then(res => {
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
    indexMethod(index) {
      return index + 1 + (this.pageBean.currentPage - 1) * this.pageBean.pageSize
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
      post('service/business/college/iccUser/iccUser/editIccUser.xf', {
        userId: id,
        agencyApply: 0
      }).then(res => {
        this.fullLoading.close()
        const detail = res.result.iccUser || {}
        if (detail.userId) {
          this.addTitle = '修改'
        } else {
          this.addTitle = '创建平台'
        }
        this.agencyList = res.result.agencyList
        this.form.userId = detail.userId || ''
        this.form.agencyId = detail.agencyId || ''
        this.form.userName = detail.userName || ''
        this.form.userCode = detail.userCode || ''
        this.form.userAccount = detail.userAccount || ''
        this.form.userTel = detail.userTel || ''
        this.form.userContact = detail.userContact || ''
        this.form.userPhone = detail.userPhone || ''
        this.form.userEmail = detail.userEmail || ''
        this.form.userWechart = detail.userWechart || ''
        this.form.userQq = detail.userQq || ''
        this.form.userAccessIp = detail.userAccessIp || ''
        this.form.serviceTimeStart = detail.serviceTimeStart || ''
        this.form.serviceTimeEnd = detail.serviceTimeEnd || ''
        this.form.userRemark = detail.userRemark || ''
        if (detail.serviceTimeStart && detail.serviceTimeEnd) {
          this.dateRange2 = [new Date(detail.serviceTimeStart.replace(/-/g, '/')), new Date(detail.serviceTimeEnd.replace(/-/g, '/'))]
        } else {
          this.dateRange2 = []
        }
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
    getPinyin(str) {
      post('service/business/college/iccUser/iccUser/getUserCode.xf', {
        userName: str
      }).then(res => {
        if (res.result && res.result.userCode) {
          this.form.userCode = res.result.userCode
        } else {
          this.form.userCode = ''
        }
      })
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
        nowUserId: this.uid,
        userId: id
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
    setServiceTime(row) {
      this.serviceTimeTitle = row.userName
      this.serviceTime.userId = row.userId
      this.searchServiceTime.userId = row.userId
      this.searchServiceTime.currentPage = 1
      this.fullLoading = this.$loading({
        lock: true
      })
      this.dateRange3 = []
      this.getServiceTimes()
    },
    getServiceTimes() {
      post('service/business/college/iccUser/iccUser/getServiceTimeList.xf', this.searchServiceTime).then(res => {
        this.serviceTimeList = res.result || []
        this.pageBean2 = res.pageBean
        if (this.pageBean2.currentPage === 1) {
          this.handleMaxService(this.serviceTimeList)
        }
        this.fullLoading.close()
        if (!this.dialogFormVisible2) {
          this.dialogFormVisible2 = true
          this.$refs.serviceTimeForm.clearValidate()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleCurrentChange2(page) {
      this.searchServiceTime.currentPage = page
      this.getServiceTimes()
    },
    handleMaxService(arr) {
      let times = arr.map(item => {
        if (typeof item.serviceTimeEnd === 'string') {
          return new Date(item.serviceTimeEnd.replace(/-/g, '/')).getTime()
        }
      })
      this.maxServiceTime = Math.max.apply(null, times)
      this.serviceDefault = new Date(this.maxServiceTime)
    },
    submitServiceTime() {
      this.$refs.serviceTimeForm.validate().then(valid => {
        if (valid) {
          this.loading3 = true
          this.serviceTime.nowUserId = this.uid
          post('service/business/college/iccUser/iccUser/setServiceTimes.xf', this.serviceTime).then(res => {
            this.loading3 = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible2 = false
              this.getList()
            }
          }).catch(() => {
            this.loading3 = false
          })
        }
      })
    },
    remove(id) {
      this.loading = true
      post('service/business/college/iccUser/iccUser/deleteIccUser.xf', {
        userId: id
      }).then(res => {
        this.loading = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getList()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    confirmRemove(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(id)
      }).catch(() => {
        // 取消
      })
    }
  },
  watch: {
    dateRange(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.searchData.beginTime = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endTime = dateFormat.call(newVal[1], 'yyyy-MM-dd')
        this.searchData.currentPage = 1
      } else {
        this.searchData.beginTime = ''
        this.searchData.endTime = ''
        this.searchData.currentPage = 1
      }
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    dateRange2(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.form.serviceTimeStart = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.form.serviceTimeEnd = dateFormat.call(newVal[1], 'yyyy-MM-dd')
      } else {
        this.form.serviceTimeStart = ''
        this.form.serviceTimeEnd = ''
      }
    },
    dateRange3(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.serviceTime.serviceTimeStart = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.serviceTime.serviceTimeEnd = dateFormat.call(newVal[1], 'yyyy-MM-dd')
      } else {
        this.serviceTime.serviceTimeStart = ''
        this.serviceTime.serviceTimeEnd = ''
      }
    },
    category(newVal, oldVal) {
      this.searchData.agencyType = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    }
  },
  created() {
    this.getList()
    this.$watch('form.userName', debounce((newVal) => {
      this.getPinyin(newVal)
    }, 800))
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
