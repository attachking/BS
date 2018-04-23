<template>
  <div class="resources">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="资源管理"
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
        <span class="node-title">{{node.label}}</span>
        <span class="right-edit">
          <span class="edit">
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              @click="append(data)">
              新增
            </el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              v-if="data.resourceId !== 0"
              @click="edit(data)">
              修改
            </el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="!adminReadable"
              v-if="data.resourceId !== 0"
              @click="confirmRemove(data)">
              删除
            </el-button>
          </span>
        </span>
      </span>
    </el-tree>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" class="add" label-width="120px" ref="form" :rules="rules" style="width: 480px; margin: 0 auto;">
        <el-form-item label="资源名称" prop="resourceName">
          <el-input v-model="form.resourceName" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源别名" prop="resourceCode">
          <el-input v-model="form.resourceCode" placeholder="请输入资源别名"></el-input>
        </el-form-item>
        <el-form-item label="资源图标" prop="resourceIcon">
          <el-input v-model="form.resourceIcon" placeholder="请输入资源图标编码"></el-input>
        </el-form-item>
        <el-form-item label="资源类别" prop="resourceType">
          <el-radio v-model="form.resourceType" :label="0">目录</el-radio>
          <el-radio v-model="form.resourceType" :label="1">菜单</el-radio>
        </el-form-item>
        <el-form-item label="排序" prop="resourceOrder">
          <el-input v-model="form.resourceOrder" placeholder="请输入排序序号"></el-input>
        </el-form-item>
        <el-form-item label="资源URL" prop="resourceUrl">
          <el-input v-model="form.resourceUrl" placeholder="请输入资源URL"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {post} from '../../../common/js/http'
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
      trees: [],
      treeProps: {
        label: 'resourceName',
        id: 'resourceId',
        children: 'childList'
      },
      dialogFormVisible: false,
      dialogTitle: '',
      form: {
        userId: '', // 用户ID
        parentResourc: '', // 父级资源id
        resourceId: '', // 资源id
        resourceName: '', // 资源名称
        resourceCode: '', // 资源别名
        resourceIcon: '', // 资源图标
        resourceOrder: '', // 排序
        resourceUrl: '', // 资源url
        resourceType: '' // 资源类别  0目录1菜单
      },
      rules: {
        resourceName: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        resourceCode: [{
          required: true,
          message: '请输入资源别名',
          trigger: 'change'
        }, {
          max: 10,
          message: '最多10个字符',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('资源别名只能是字母或数字'))
            }
          }
        }],
        resourceIcon: [{
          required: true,
          message: '请输入资源图标名称',
          trigger: 'change'
        }, {
          max: 30,
          message: '最多30个字符',
          trigger: 'change'
        }],
        resourceOrder: [{
          max: 10,
          message: '最多10个字符',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[0-9]*$/.test(value)) {
              callback()
            } else {
              callback(new Error('只能输入数字'))
            }
          }
        }],
        resourceUrl: {
          max: 30,
          message: '最多30个字符',
          trigger: 'change'
        },
        resourceType: {
          required: true,
          message: '请选择资源类别',
          trigger: 'change'
        }
      },
      loading: false
    }
  },
  methods: {
    append(data) {
      this.form.userId = this.uid
      this.form.resourceId = ''
      this.form.parentResourc = data.resourceId
      this.form.resourceName = ''
      this.form.resourceCode = ''
      this.form.resourceIcon = ''
      this.form.resourceOrder = ''
      this.form.resourceUrl = ''
      this.form.resourceType = ''
      this.dialogTitle = '新增'
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 20)
    },
    edit(data) {
      this.form.userId = this.uid
      this.form.resourceId = data.resourceId
      this.form.resourceName = data.resourceName
      this.form.resourceCode = data.resourceCode
      this.form.resourceIcon = data.resourceIcon
      this.form.resourceOrder = data.resourceOrder
      this.form.resourceUrl = data.resourceUrl
      this.form.resourceType = data.resourceType
      this.form.parentResourc = ''
      this.dialogTitle = '修改'
      this.dialogFormVisible = true
    },
    getList() {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccResource/iccResource/listJson').then(res => {
        this.fullLoading.close()
        this.trees = [{
          resourceId: 0,
          resourceName: '资源分配',
          childList: res.result || []
        }]
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.resourceId) {
            this.addSubmit()
          } else {
            this.editSubmit()
          }
        }
      })
    },
    addSubmit() {
      this.loading = true
      post('service/sys/iccResource/iccResource/add', this.form).then(res => {
        this.loading = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.dialogFormVisible = false
          this.getList()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    editSubmit() {
      this.loading = true
      post('service/sys/iccResource/iccResource/update', this.form).then(res => {
        this.loading = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.dialogFormVisible = false
          this.getList()
        }
      }).catch(() => {
        this.loading = false
      })
    },
    confirmRemove(data) {
      this.$confirm(`确定删除${data.resourceName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove(data.resourceId)
      }).catch(() => {
        // 取消
      })
    },
    remove(resourceId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccResource/iccResource/del', {resourceId}).then(res => {
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
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
  .resources{
    font-size: 14px;
    .el-tree-node__content{
      position: relative;
    }
    .custom-tree-node{
      width: 600px;
      .right-edit{
        font-size: 14px;
        width: 300px;
        display: inline-block;
        position: absolute;
        left: 300px;
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
  }
</style>
