<!--项目维护-->
<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="项目维护"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建项目</el-button>
      </el-form-item>
      <el-form-item label="所属类型">
        <el-select v-model="category" placeholder="请选择所属类型">
          <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实施人员">
        <el-select filterable v-model="implementId" placeholder="请选择实施人员">
          <el-option :label="val.userName" :value="val.userId" v-for="(val, key) in impList" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="dateRange" label="服务时间">
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
      <el-form-item label="项目名称">
        <el-input v-model="keywords" placeholder="请输入项目名称进行查询" @keydown.native.enter="onSubmit">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" width="600px" fullscreen>
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目类别" prop="projectType">
          <el-select v-model="form.projectType" placeholder="请选择项目类别">
            <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" @blur="handleBlur" :disabled="!!form.projectId"></el-input>
        </el-form-item>
        <el-form-item label="客户账号" prop="customerAccount">
          <el-input v-model="form.customerAccount" placeholder="请输入客户账号" :disabled="!!form.projectId"></el-input>
        </el-form-item>
        <el-form-item label="客户手机号" prop="customerPhone">
          <el-input v-model="form.customerPhone" placeholder="请输入客户手机号" :disabled="!!form.projectId"></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="customerSex">
          <el-radio v-model="form.customerSex" :label="0" :disabled="!!form.projectId">男</el-radio>
          <el-radio v-model="form.customerSex" :label="1" :disabled="!!form.projectId">女</el-radio>
        </el-form-item>
        <el-form-item label="设备开机时间" prop="deviceOpenTime">
          <el-time-select
            v-model="form.deviceOpenTime"
            :editable="false"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            placeholder="设备开机时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="设备关机时间" prop="deviceCloseTime">
          <el-time-select
            v-model="form.deviceCloseTime"
            :editable="false"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30'
            }"
            placeholder="设备关机时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="组织机构" prop="customerOrg">
          <el-input v-model="form.customerOrg" placeholder="请输入组织机构" :disabled="!!form.projectId"></el-input>
        </el-form-item>
        <el-form-item label="客户职位" prop="customerDuty">
          <el-input v-model="form.customerDuty" placeholder="请输入客户职位" :disabled="!!form.projectId"></el-input>
        </el-form-item>
        <el-form-item label="项目备注" prop="projectRemark">
          <el-input type="textarea" v-model="form.projectRemark" placeholder="请输入备注信息"></el-input>
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
          prop="serviceTimeCreatorName">
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
      @selection-change="handleSelectionChange2"
      ref="table">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
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
            <el-form-item label="客户账号:">
              <span>{{ props.row.customerAccount || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户联系电话:">
              <span>{{ props.row.customerPhone || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户邮箱:">
              <span>{{ props.row.customerEmail || '--' }}</span>
            </el-form-item>
            <el-form-item label="实施人员:">
              <span>{{ props.row.implementStr || '--' }}</span>
            </el-form-item>
            <el-form-item label="服务开始时间:">
              <span>{{ dateFormat(props.row.serviceTimeStart, 'yyyy-MM-dd') || '--' }}</span>
            </el-form-item>
            <el-form-item label="服务结束时间:">
              <span>{{ dateFormat(props.row.serviceTimeEnd, 'yyyy-MM-dd') || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备开机时间:">
              <span>{{ props.row.deviceOpenTime || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备关机时间:">
              <span>{{ props.row.deviceCloseTime || '--' }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ props.row.projectCreatetime || '--' }}</span>
            </el-form-item>
            <el-form-item label="项目备注:">
              <span>{{ props.row.projectRemark || '--' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称">
        <template slot-scope="scope">
          <span v-html="handleKeywords(scope.row.projectName, keywords)"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户账号">
        <template slot-scope="scope">
          <span>{{scope.row.customerAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目类别"
        align="center"
        prop="projectTypeStr">
      </el-table-column>
      <el-table-column
        label="联系人"
        align="center"
        prop="customerName">
      </el-table-column>
      <el-table-column
        label="联系电话"
        align="center"
        prop="customerPhone">
      </el-table-column>
      <el-table-column
        label="服务开始时间"
        align="center">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.serviceTimeStart, 'yyyy-MM-dd') || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务结束时间"
        align="center">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.serviceTimeEnd, 'yyyy-MM-dd') || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row.projectId)"
            :disabled="!adminReadable"
            size="small">
            修改
          </el-button>
          <el-button
            type="text"
            @click="confirmRemove(scope.row.projectId)"
            :disabled="!adminReadable"
            size="small">
            删除
          </el-button>
          <br>
          <el-button
            type="text"
            @click="getProjectImp(scope.row)"
            :disabled="!adminReadable"
            size="small">
            分配实施人员
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
    <el-dropdown @command="handleCommand" class="dropdown" placement="bottom-start">
      <el-button type="primary" size="small">
        导出项目<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="first">按当前条件导出</el-dropdown-item>
        <!--<el-dropdown-item command="second">导出当前页</el-dropdown-item>-->
        <el-dropdown-item command="third">导出当前页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :title="dispatchTitle" :visible.sync="dialogFormVisible3">
      <el-table
        stripe
        :data="impList2"
        style="width: 100%"
        v-loading="loading5"
        class="service-table"
        @selection-change="handleSelectionChange"
        ref="multipleTable">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.agencyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center"
          prop="userName">
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center"
          prop="userAccount">
          <template slot-scope="scope">
            <span>{{scope.row.userPhone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="账号"
          align="center"
          prop="userAccount">
        </el-table-column>
      </el-table>
      <!--<pagination @current-change="handleCurrentChange3"
                  :bean="pageBean3"
                  layout="prev, pager, next"
                  class="pagination"></pagination>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="submitImp" :loading="loading6">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {PAGE_SIZE, PROJECT_TYPE, BASE_URL} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import {dateFormat} from '../../../common/js/clazz'
import {mapGetters} from 'vuex'
import {adminReadableMixin, normalMixin} from '../../../common/js/mixin'

export default {
  mixins: [adminReadableMixin, normalMixin],
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  data() {
    let _this = this
    return {
      dispatchTitle: '',
      editableTabsValue: 'list',
      projectType: PROJECT_TYPE,
      addTitle: '创建项目',
      category: '',
      implementId: '',
      keywords: '',
      dialogFormVisible: false,
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        projectType: '', // 所属类型
        projectName: '', // 项目名称
        startTime: '',
        endTime: '',
        implementId: '' // 实施人员id
      },
      form: {
        projectId: '',
        userId: '', // 用户id
        projectName: '', // 项目名称
        projectType: '', // 项目类别
        customerName: '', // 客户名称
        customerAccount: '', // 客户账号
        customerSex: 0, // 客户性别
        deviceOpenTime: '', // 设备开机时间
        deviceCloseTime: '', // 设备关机时间
        customerOrg: '', // 组织机构
        customerDuty: '', // 职位
        projectRemark: '' // 备注
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
      rules: {
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        projectType: [{
          required: true,
          message: '请选择项目类别',
          trigger: 'change'
        }],
        customerName: [{
          required: true,
          message: '请输入客户名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        customerAccount: [{
          required: true,
          message: '请输入客户账号',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9]{1,20}$/.test(value)) {
              callback()
            } else {
              callback(new Error('账号为1~20个字符，只能是数字或字母'))
            }
          },
          trigger: 'change'
        }],
        customerSex: [{
          required: true,
          message: '请选择客户性别',
          trigger: 'change'
        }],
        customerOrg: [{
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        customerDuty: [{
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        projectRemark: [{
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
      loading4: false,
      impList: [],
      searchImp: {
        rowsNum: 999,
        currentPage: 1,
        projectId: ''
      },
      impList2: [],
      loading5: false,
      loading6: false,
      dialogFormVisible3: false,
      pageBean3: {},
      multipleSelection: [], // 已选择的实施人员
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
      this.searchData.projectName = encodeURIComponent(this.keywords)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.currentPage = 1
      this.searchData.projectType = ''
      this.searchData.implementId = ''
      this.searchData.projectName = ''
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.category = ''
      this.implementId = ''
      this.keywords = ''
      this.dateRange = []
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccProject/iccProject/getProjectList.xf', this.searchData).then(res => {
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
          let obj = Object.assign({}, this.form)
          // obj.deviceOpenTime = dateFormat.call(this.form.deviceOpenTime, 'hh:mm:ss')
          // obj.deviceCloseTime = dateFormat.call(this.form.deviceCloseTime, 'hh:mm:ss')
          post('service/business/college/iccProject/iccProject/saveProjectInfo.xf', obj).then(res => {
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
    edit(projectId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccProject/iccProject/editProjectInfo.xf', {
        userId: this.uid,
        projectId
      }).then(res => {
        this.fullLoading.close()
        const detail = res.result || {}
        if (detail.projectId) {
          this.addTitle = '修改'
        } else {
          this.addTitle = '创建项目'
        }
        this.form.projectName = detail.projectName || ''
        this.form.projectType = detail.projectType || ''
        this.form.customerName = detail.customerName || ''
        this.form.customerAccount = detail.customerAccount || ''
        this.form.customerPhone = detail.customerPhone || ''
        this.form.customerSex = detail.customerSex || 0
        // const yyMMdd = dateFormat.call(new Date(), 'yyyy/MM/dd')
        this.form.deviceOpenTime = detail.deviceOpenTime
        this.form.deviceCloseTime = detail.deviceCloseTime
        this.form.customerOrg = detail.customerOrg || ''
        this.form.customerDuty = detail.customerDuty || ''
        this.form.projectRemark = detail.projectRemark || ''
        this.form.projectId = detail.projectId || ''
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
          this.form.customerAccount = res.result.userCode
        }
      })
    },
    handleBlur() {
      if (this.form.projectId) return
      setTimeout(() => {
        this.getPinyin(this.form.customerName)
      }, 20)
    },
    checkResetPsd(id) {
      this.$confirm('确定重置为初始密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.resetPsd(id)
      }).catch(() => {
        // 取消
      })
    },
    getProjectImp(row) {
      this.dispatchTitle = row.projectName
      this.searchImp.projectId = row.projectId
      this.loading5 = true
      this.dialogFormVisible3 = true
      post('service/business/college/iccUser/iccUser/getImpUserList.xf', this.searchImp).then(res => {
        this.loading5 = false
        this.impList2 = res.result
        this.pageBean3 = res.pageBean
        this.toggleSelection()
      }).catch(() => {
        this.loading5 = false
      })
    },
    toggleSelection() {
      setTimeout(() => {
        this.impList2.forEach(item => {
          if (item.isCheck !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
      }, 20)
    },
    setServiceTime(row) {
      this.serviceTimeTitle = row.projectName
      this.serviceTime.customerId = row.customerId
      this.searchServiceTime.customerId = row.customerId
      this.searchServiceTime.userId = this.uid
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
      this.maxServiceTime = times.length ? Math.max.apply(null, times) : 0
      this.serviceDefault = this.maxServiceTime ? new Date(this.maxServiceTime) : new Date()
    },
    submitServiceTime() {
      this.$refs.serviceTimeForm.validate().then(valid => {
        if (valid) {
          this.loading3 = true
          this.serviceTime.userId = this.uid
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
    remove(projectArr) {
      this.loading = true
      post('service/business/college/iccProject/iccProject/delProjectInfo.xf', {projectArr}).then(res => {
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
    },
    getImpList(projectId) {
      post('service/business/college/iccUser/iccUser/getImpUserList.xf', {
        rowsNum: 999,
        currentPage: 1,
        projectId
      }).then(res => {
        this.impList = res.result
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange2(selections) {
      this.selections = selections
    },
    submitImp() {
      this.loading6 = true
      post('service/business/college/iccUser/iccUser/saveImpUserInfo.xf', {
        userId: this.uid,
        projectId: this.searchImp.projectId,
        userIdArr: this.multipleSelection.map(item => item.userId).join(',')
      }).then(res => {
        this.loading6 = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.dialogFormVisible3 = false
          this.getList()
        }
      }).catch(() => {
        this.loading6 = false
      })
    },
    handleCurrentChange3() {},
    download(search) {
      window.open(`${BASE_URL}service/business/college/iccProject/iccProject/exportProjectInfo.xf?${search}`)
    },
    handleCommand(e) {
      if (e === 'first') {
        this.download(`projectName=${encodeURIComponent(this.searchData.projectName)}&projectType=${encodeURIComponent(this.searchData.projectType)}&implementId=${encodeURIComponent(this.searchData.implementId)}&startTime=${encodeURIComponent(this.searchData.startTime)}&endTime=${encodeURIComponent(this.searchData.endTime)}`)
      } else if (e === 'second') {
        this.download(`projectIdStr=${this.list.map(item => item.projectId).join(',')}`)
      } else if (e === 'third') {
        if (!this.selections.length) {
          this.noSelect()
          return
        }
        this.download(`projectIdStr=${this.selections.map(item => item.projectId).join(',')}`)
      }
    }
  },
  watch: {
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
      this.searchData.projectType = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    implementId(newVal, oldVal) {
      this.searchData.implementId = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    }
  },
  created() {
    this.getList()
    this.getImpList()
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
