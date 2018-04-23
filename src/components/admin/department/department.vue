<!--部门管理-->
<template>
  <div class="department">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="部门管理"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-tree
      :data="trees"
      default-expand-all
      node-key="resourceId"
      :props="treeProps"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span :title="node.label" class="node-title">{{node.label}}</span>
        <span class="right-edit">
          <span class="remark" :title="data.remark">
            {{data.remark || '--'}}
          </span>
          <span class="edit">
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              v-if="!data.noChild"
              @click="append(data)">
              新增
            </el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              v-if="data.id !== -1"
              @click="edit(data)">
              修改
            </el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              v-if="data.id !== -1"
              @click="confirmRemove(data)">
              删除
            </el-button>
          </span>
        </span>
      </span>
    </el-tree>
    <pagination @current-change="handleCurrentChange"
                :bean="pageBean"
                layout="prev, pager, next"
                class="pagination"></pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules">
        <el-form-item label="名称" prop="agencyName">
          <el-input v-model="form.agencyName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="agencyRemark">
          <el-input type="textarea" v-model="form.agencyRemark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {adminReadableMixin} from '../../../common/js/mixin'
import {post} from '../../../common/js/http'
import {PAGE_SIZE} from '../../../common/js/config'
import {mapGetters} from 'vuex'

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
      treeProps: {
        label: 'label',
        id: 'id',
        children: 'children'
      },
      trees: [],
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        agencyName: '',
        agencyType: ''
      },
      list: [],
      pageBean: {},
      dialogTitle: '',
      dialogFormVisible: false,
      form: {
        agencyId: '',
        parentId: '',
        userId: '',
        agencyName: '',
        agencyRemark: ''
      },
      rules: {
        agencyName: [{
          required: true,
          message: '请输入名称',
          trigger: 'change'
        }, {
          min: 1,
          max: 10,
          message: '最多不能超过10个字符',
          trigger: 'change'
        }],
        agencyRemark: [{
          max: 20,
          message: '最多不能超过20个字符',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
    },
    append(data) {
      console.log(data)
      this.form.parentId = data.id === -1 ? '' : data.id
      this.form.agencyId = ''
      this.form.agencyName = ''
      this.form.agencyRemark = ''
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 20)
    },
    edit(data) {
      this.form.parentId = data.parentId
      this.form.agencyId = data.id
      this.form.agencyName = data.label
      this.form.agencyRemark = data.remark
      this.dialogFormVisible = true
      this.dialogTitle = '修改'
    },
    remove(agencyId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccAgency/iccAgency/deleteIccAgency.xf', {agencyId}).then(res => {
        this.fullLoading.close()
        if (res.result.result === 1) {
          this.$message({
            type: 'success',
            message: res.result.message
          })
          this.getList()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    confirmRemove({id}) {
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
    getList() {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccAgency/iccAgency/getIccAgencyList.xf', this.searchData).then(res => {
        this.fullLoading.close()
        this.trees = [{
          label: '河南讯丰信息技术有限公司',
          id: -1,
          remark: '备注',
          children: res.result.map(item => {
            return {
              id: item.agencyId,
              label: item.agencyName,
              remark: item.agencyRemark,
              parentId: item.parentId,
              children: item.iccAgencyList ? item.iccAgencyList.map(item => {
                return {
                  id: item.agencyId,
                  label: item.agencyName,
                  remark: item.agencyRemark,
                  parentId: item.parentId,
                  noChild: true
                }
              }) : null
            }
          })
        }]
        this.pageBean = res.pageBean
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    addSubmit() {
      this.form.userId = this.uid
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.fullLoading = this.$loading({
            lock: true
          })
          post('service/sys/iccAgency/iccAgency/saveIccAgency.xf', this.form).then(res => {
            this.fullLoading.close()
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => {
            this.fullLoading.close()
          })
        }
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
  .department{
    .add{
      width: 500px;
      margin: 0 auto;
      .el-select{
        width: 100%;
      }
    }
    .el-tree-node__content{
      position: relative;
    }
    .custom-tree-node{
      width: 800px;
      .right-edit{
        font-size: 14px;
        width: 500px;
        display: inline-block;
        position: absolute;
        left: 500px;
        top: 10px;
        .remark{
          display: inline-block;
          width: 400px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .edit{
          width: 100px;
          display: inline-block;
          .el-button{
            font-size: 16px;
          }
        }
      }
    }
    .node-title{
      font-size: 16px;
      font-weight: 600;
    }
    .el-tree-node__content{
      border-bottom: 1px dashed #d9d9d9;
      padding: 10px 0;
      height: auto;
    }
    .pagination{
      text-align: center;
      margin: 30px 0;
    }
  }
</style>
