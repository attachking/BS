<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" ref="form2">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建机构</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="category" placeholder="请选择所属类型">
          <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="keywords" placeholder="请输入机构名称进行查询" @keydown.native.enter="onSubmit">
          <el-button slot="append" icon="el-icon-search" @click="onSubmit" title="搜索"></el-button>
          <el-button slot="append" icon="el-icon-refresh" @click="reset" title="重置搜索条件"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="角色" prop="agencyApply">
          <el-select v-model="form.agencyApply" placeholder="请选择角色">
            <el-option label="平台角色" :value="0"></el-option>
            <el-option label="系统管理角色" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="agencyName">
          <el-input v-model="form.agencyName" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="agencyType">
          <el-select v-model="form.agencyType" placeholder="请选择机构所属类型">
            <el-option :label="item.name" :value="item.code" v-for="item in projectType" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构备注" prop="agencyRemark">
          <el-input v-model="form.agencyRemark" placeholder="请输入机构备注"></el-input>
        </el-form-item>
        <el-form-item label="机构描述" prop="agencyDescribe">
          <el-input type="textarea" v-model="form.agencyDescribe" placeholder="请输入机构描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      stripe
      :data="list"
      style="width: 100%"
      v-loading="loading"
      ref="table">
      <el-table-column
        label="序号"
        align="center"
        width="50"
        type="index"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        align="center"
        label="机构名称"
        prop="agencyName">
      </el-table-column>
      <el-table-column
        align="center"
        label="角色"
        prop="agencyApplyName">
      </el-table-column>
      <el-table-column
        align="center"
        label="所属类型">
        <template slot-scope="scope">
          <span>{{scope.row.agencyTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="agencyCreatetime">
      </el-table-column>
      <el-table-column
        align="center"
        label="机构描述">
        <template slot-scope="scope">
          <span>{{scope.row.agencyDescribe}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="机构备注">
        <template slot-scope="scope">
          <span>{{scope.row.agencyRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="!adminReadable"
            @click="edit(scope.row.agencyId)">
            修改
          </el-button>
          <el-button
            type="text"
            size="small"
            :disabled="!adminReadable"
            @click="check(scope.row.agencyId)">
            删除
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
import {post} from '../../../common/js/http'
import {PAGE_SIZE, PROJECT_TYPE} from '../../../common/js/config'
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
      projectType: PROJECT_TYPE,
      dialogTitle: '',
      category: '',
      keywords: '',
      dialogFormVisible: false,
      form: {
        agencyId: '', // 机构id
        userId: '', // 用户id
        agencyName: '', // 机构名称
        agencyApply: '', // 角色类型
        agencyType: '', // 所属类型
        agencyRemark: '', // 机构备注
        agencyDescribe: '' // 机构描述
      },
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        agencyName: '', // 机构名称
        agencyType: '' // 所属类型
      },
      pageBean: {},
      list: [],
      loading: false,
      rules: {
        agencyApply: [{
          required: true,
          message: '请选择角色类型',
          trigger: 'change'
        }],
        agencyName: [{
          required: true,
          message: '请输入机构名称',
          trigger: 'change'
        }, {
          min: 1,
          max: 10,
          message: '最多不能超过10个字符',
          trigger: 'change'
        }],
        agencyType: [{
          required: true,
          message: '请选择所属类型',
          trigger: 'change'
        }],
        agencyRemark: [{
          max: 20,
          message: '最多不能超过20个字符',
          trigger: 'change'
        }],
        agencyDescribe: [{
          max: 50,
          message: '最多不能超过50个字符',
          trigger: 'change'
        }]
      },
      loading2: false
    }
  },
  methods: {
    onSubmit() {
      this.searchData.currentPage = 1
      this.searchData.agencyName = encodeURIComponent(this.keywords)
      this.getList()
    },
    reset() {
      this.category = ''
      this.keywords = ''
      this.searchData.agencyName = ''
      this.searchData.agencyType = ''
      this.searchData.currentPage = 1
      this.getList()
    },
    add() {
      this.dialogFormVisible = true
      this.form.agencyId = ''
      this.dialogTitle = '创建机构'
      this.resetForm('form')
    },
    addSubmit(formName) {
      this.form.userId = this.uid
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading2 = true
          let data = Object.assign({}, this.form)
          post('service/sys/iccAgency/iccAgency/saveIccAgency.xf', data).then(res => {
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.resetForm('form')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$alert(res.error.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  // action
                }
              })
            }
          }).catch(() => {
            this.loading2 = false
          })
        }
      })
    },
    dateFormat(d, fmt) {
      if (!d) return ''
      let t = new Date(d.replace(/-/g, '/'))
      return dateFormat.call(t, fmt)
    },
    getList() {
      this.loading = true
      post('service/sys/iccAgency/iccAgency/getIccAgencyList.xf', this.searchData).then(res => {
        this.loading = false
        this.list = res.result || []
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    indexMethod(index) {
      return index + 1 + (this.pageBean.currentPage - 1) * this.pageBean.pageSize
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    remove(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccAgency/iccAgency/deleteIccAgency.xf', {
        agencyId: id
      }).then(res => {
        if (res.result.result === 1) {
          this.$message({
            type: 'success',
            message: res.result.message
          })
          this.getList()
        } else {
          this.$alert(res.result.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // action
            }
          })
        }
        this.fullLoading.close()
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    check(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccAgency/iccAgency/checkIccAgency.xf', {
        agencyId: id
      }).then(res => {
        this.fullLoading.close()
        if (res.result.result === 0) {
          this.$confirm('机构下存在平台信息，您是否还要继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.remove(id)
          }).catch(() => {
            // 取消
          })
        } else {
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
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    edit(id) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccAgency/iccAgency/getIccAgency.xf', {
        agencyId: id
      }).then(res => {
        this.fullLoading.close()
        this.form.agencyId = id
        this.form.agencyName = res.result.agencyName || ''
        this.form.agencyApply = res.result.agencyApply || 0
        this.form.agencyType = res.result.agencyType || 0
        this.form.agencyRemark = res.result.agencyRemark || ''
        this.form.agencyDescribe = res.result.agencyDescribe || ''
        this.dialogTitle = '修改'
        this.dialogFormVisible = true
      }).catch(() => {
        this.fullLoading.close()
      })
    }
  },
  watch: {
    category(newVal, oldVal) {
      this.searchData.agencyType = newVal
      this.searchData.currentPage = 1
      this.getList()
    }
  },
  created() {
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
  .pagination{
    padding: 20px 0;
    text-align: center;
  }
</style>
