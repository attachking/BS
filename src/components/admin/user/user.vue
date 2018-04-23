<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="用户管理"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建用户</el-button>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-cascader
          v-model="department"
          placeholder="请选择部门"
          :options="options"
          filterable
          change-on-select
        ></el-cascader>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input v-model="keywords" placeholder="请输入用户名称进行查询" @keydown.native.enter="onSubmit">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="创建用户" :visible.sync="dialogFormVisible" width="520px">
      <el-form :model="form" class="add" label-width="130px" ref="form" :rules="rules">
        <el-form-item label="所属部门" prop="agencyId">
          <el-cascader
            v-model="department2"
            placeholder="请选择部门"
            :options="options"
            filterable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否为最高管理员">
          <el-switch
            v-model="isAdmin"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="名称代码" prop="userCode">
          <el-input v-model="form.userCode" placeholder="名称代码" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="form.userAccount" placeholder="请输入登录账号" :readonly="!!form.userId"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入用户手机号"></el-input>
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
    <el-table
      stripe
      :data="list"
      style="width: 100%"
      v-loading="loading"
      ref="table">
      <el-table-column
        align="center"
        label="用户名称">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.userPhone || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属部门"
        align="center"
        prop="agencyName">
      </el-table-column>
      <el-table-column
        label="用户账号"
        align="center"
        prop="userAccount">
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center">
        <template slot-scope="scope">
          <span>{{dateFormat(scope.row.userCreatetime, 'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注信息"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userRemark || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row.userId)"
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
          <el-button
            type="text"
            @click="checkResetPsd(scope.row.userId)"
            :disabled="!adminReadable"
            size="small">
            重置密码
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
import {PAGE_SIZE} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import {adminReadableMixin} from '../../../common/js/mixin'
import {dateFormat, debounce} from '../../../common/js/clazz'

export default {
  mixins: [adminReadableMixin],
  data() {
    return {
      editableTabsValue: 'list',
      options: [],
      department: [],
      keywords: '',
      dialogFormVisible: false,
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        userType: 1,
        userAgencyName: '' // 部门名称
      },
      department2: [],
      form: {
        agencyId: '', // 部门id
        nowUserId: '', // 当前用户id
        userId: '', // 用户id
        userType: 1, // 用户类型
        userStatus: 0,
        userName: '', // 平台名称
        userCode: '',
        userAccount: '', // 账号
        userPhone: '', // 手机号
        userRemark: '' // 备注
      },
      rules: {
        agencyId: [{
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
        userName: [{
          required: true,
          message: '请输入用户名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多不超过20个字符',
          trigger: 'change'
        }],
        userAccount: [{
          required: true,
          message: '请输入用户账号',
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
        userPhone: [{
          required: true,
          message: '请输入用户手机号',
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
        userRemark: [{
          max: 50,
          message: '最多不超过50个字符',
          trigger: 'change'
        }]
      },
      loading: false,
      loading2: false,
      list: [],
      pageBean: {},
      agencyList: [],
      isAdmin: false
    }
  },
  methods: {
    dateFormat(str, fmt) {
      return dateFormat.call(new Date(str), fmt)
    },
    onSubmit() {
      this.searchData.userAgencyName = encodeURIComponent(this.keywords)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.keywords = ''
      this.searchData.agencyId = ''
      this.department = []
      this.onSubmit()
    },
    add() {
      this.edit()
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
    addSubmit() {
      this.form.nowUserId = this.uid
      if (this.isAdmin) {
        this.form.userType = 2 // 最高管理员
      } else {
        this.form.userType = 1 // 一般管理员
      }
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.form.userCode || (this.form.userCode = 'DEFAULT')
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
    edit(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccUser/iccUser/editIccUser.xf', {
        userId: id,
        agencyApply: 1
      }).then(res => {
        this.fullLoading.close()
        const detail = res.result.iccUser || {}
        this.agencyList = res.result.agencyList
        this.form.userId = detail.userId || ''
        this.form.agencyId = detail.agencyId || ''
        if (detail.agencyId) {
          this.options.forEach(item => {
            if (item.value === detail.agencyId) {
              this.department2 = [detail.agencyId]
              return
            }
            if (item.children) {
              item.children.forEach(item2 => {
                if (item2.value === detail.agencyId) {
                  this.department2 = [item.value, detail.agencyId]
                }
              })
            }
          })
        } else {
          this.department2 = []
        }
        this.form.userName = detail.userName || ''
        this.form.userCode = detail.userCode || ''
        this.form.userAccount = detail.userAccount || ''
        this.form.userPhone = detail.userPhone || ''
        this.form.userRemark = detail.userRemark || ''
        this.isAdmin = detail.userType === 2
        this.dialogFormVisible = true
        setTimeout(() => {
          this.$refs.form.clearValidate()
        }, 20)
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
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
        userType: 0,
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
    },
    getDepartment() {
      post('service/sys/iccAgency/iccAgency/getIccAgencyCascade.xf').then(res => {
        this.options = res.result.map(item => {
          return {
            value: item.agencyId,
            label: item.agencyName,
            children: item.iccAgencyList && item.iccAgencyList.length ? item.iccAgencyList.map(item => {
              return {
                value: item.agencyId,
                label: item.agencyName
              }
            }) : null
          }
        })
      })
    }
  },
  watch: {
    department(newVal, oldVal) {
      this.searchData.agencyId = newVal[newVal.length - 1]
    },
    department2(newVal, oldVal) {
      this.form.agencyId = newVal[newVal.length - 1]
    }
  },
  created() {
    this.getList()
    this.getDepartment()
    this.$watch('form.userName', debounce((newVal) => {
      this.getPinyin(newVal)
    }, 800))
  }
}
</script>
<style scoped lang="scss">
  .add{
    width: 400px;
    margin: 0 auto;
    .el-select{
      width: 100%;
    }
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }

  .table {
    margin: 10px 0;
  }
</style>
