<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" @tab-click="tabClick">
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
    <div class="addDetail">
      <el-button
        size="small"
        icon="el-icon-plus"
        :disabled="!adminReadable"
        type="primary"
        @click="addDetail">
        添加
      </el-button>
    </div>
    <el-table
      border
      class="table"
      :data="tableData"
      :loading="loading"
      stripe
      style="width: 90%">
      <el-table-column
        align="center"
        label="序号">
        <template slot-scope="scope">
          <span>{{getIndex(scope.row.rownum)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="parameterOption"
        label="名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.parameterCode}}</span>
        </template>
      </el-table-column>
      parameterCode
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row)"
            :disabled="!adminReadable"
            size="small">
            修改
          </el-button>
          <el-button
            type="text"
            @click="confirmRemove(scope.row)"
            :disabled="!adminReadable"
            size="small">
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
    <el-dialog :title="currentTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="名称" prop="parameterOption">
          <el-input v-model="form.parameterOption" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="parameterCode">
          <el-input v-model="form.parameterCode" placeholder="请输入编码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="loadingAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {post} from '../../../common/js/http'
import {PAGE_SIZE} from '../../../common/js/config'
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
      loading: false,
      editableTabsValue: '',
      editableTabs: [],
      searchDetail: {
        parameterExplainId: '',
        rowsNum: PAGE_SIZE,
        currentPage: 1
      },
      tableData: [],
      pageBean: {},
      dialogFormVisible: false,
      currentTitle: '',
      rules: {
        parameterOption: [{
          required: true,
          message: '请输入名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        parameterCode: [{
          required: true,
          message: '请输入编码',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('只能输入数字或字母'))
            }
          }
        }]
      },
      form: {
        parameterExplainId: '', // 字典表id
        parameterOption: '', // 名称
        parameterCode: '', // 编码
        userId: '' // 用户ID
      },
      loadingAdd: false
    }
  },
  methods: {
    removeTab(tab) {
      console.log(tab)
    },
    tabClick(tab) {
      this.currentTitle = tab.label
      this.form.parameterExplainId = tab.name
      this.searchDetail.parameterExplainId = tab.name
      this.searchDetail.currentPage = 1
      this.detail()
    },
    addTab() {},
    getDictionaries() {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccParameterExplain/iccParameterExplain/listJson').then(res => {
        this.fullLoading.close()
        if (!res.result.length) return
        this.editableTabs = res.result.map(item => {
          return {
            label: item.parameterExplainName,
            title: item.parameterExplainName,
            name: item.parameterExplainId + '',
            content: ''
          }
        })
        this.editableTabsValue = this.editableTabs[0].name
        this.tabClick(this.editableTabs[0])
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    detail() {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccParameter/iccParameter/listJson', this.searchDetail).then(res => {
        this.fullLoading.close()
        this.tableData = res.result || []
        this.pageBean = res.pageBean || {}
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    addDetail() {
      this.dialogFormVisible = true
      this.form.parameterId = ''
      this.form.parameterOption = ''
      this.form.parameterCode = ''
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 20)
    },
    addSubmit() {
      this.form.userId = this.uid
      let url = 'service/sys/iccParameter/iccParameter/add'
      if (this.form.parameterId) url = 'service/sys/iccParameter/iccParameter/update.xf'
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loadingAdd = true
          let obj = Object.assign({}, this.form)
          obj.parameterOption = encodeURIComponent(obj.parameterOption)
          obj.parameterCode = encodeURIComponent(obj.parameterCode)
          post(url, obj).then(res => {
            this.loadingAdd = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.detail()
              this.dialogFormVisible = false
            }
          }).catch(() => {
            this.loadingAdd = false
          })
        }
      })
    },
    edit(row) {
      this.dialogFormVisible = true
      this.form.parameterId = row.parameterId
      this.form.parameterOption = row.parameterOption
      this.form.parameterCode = row.parameterCode
    },
    confirmRemove(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(row.parameterId)
      }).catch(() => {
        // 取消
      })
    },
    remove(parameterId) {
      this.loading = true
      post('service/sys/iccParameter/iccParameter/del', {parameterId}).then(res => {
        this.loading = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.detail()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(size) {
      this.searchDetail.rowsNum = size
      this.detail()
    },
    handleCurrentChange(page) {
      this.searchDetail.currentPage = page
      this.detail()
    },
    getIndex(num) {
      return Number(num) + this.pageBean.pageSize * (this.pageBean.currentPage - 1)
    }
  },
  created() {
    this.getDictionaries()
  }
}
</script>
<style scoped lang="scss">
  .table{
    margin: 0 auto 20px auto;
  }
  .pagination{
    text-align: center;
  }
  .addDetail{
    margin: 15px auto;
  }
  .add{
    width: 500px;
  }
</style>
