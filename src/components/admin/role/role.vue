<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="用户管理"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="title">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建角色</el-button>
    </div>
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
        label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色别名"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色描述"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleDescribe || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
        align="center">
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
            @click="confirmDel(scope.row)"
            :disabled="!adminReadable"
            size="small">
            删除
          </el-button>
          <el-button
            type="text"
            @click="dispatch(scope.row)"
            :disabled="!adminReadable"
            size="small">
            分配功能
          </el-button>
          <el-button
            type="text"
            @click="editIntroduce(scope.row)"
            :disabled="!adminReadable"
            size="small">
            引入用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="创建角色" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" class="add" label-width="120px" ref="formAdd" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色别名" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色别名" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="roleDescribe">
          <el-input type="textarea" v-model="form.roleDescribe" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="loadingAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配功能" :visible.sync="dialogFormVisible2" width="600px">
      <el-tree
        :data="checkedData"
        show-checkbox
        node-key="resourceId"
        default-expand-all
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
        :expand-on-click-node="false"
        ref="tree"
        class="tree">
        <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{node.label}}</span>
        <span class="edit">
          <el-checkbox v-model="readable" :label="data.resourceId" size="mini" v-if="!data.isTop">可写</el-checkbox>
        </span>
      </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dispatchSubmit" :loading="loadingDis">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="引入用户" :visible.sync="dialogFormVisible3" width="1200px" class="introduce">
      <div class="left">
        <p class="tit">未引入用户</p>
        <el-table
          stripe
          :data="unintroducedList"
          style="width: 90%"
          v-loading="loading4"
          class="introduce-table"
          ref="table2">
          <el-table-column
            align="center"
            label="用户名称">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userRemark || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <span>
                <el-button
                  type="text"
                  @click="introduceAdd(scope.row)"
                  size="small">
                  添加
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination @current-change="handleCurrentChange2"
                    :bean="pageBean3"
                    layout="prev, pager, next"
                    class="pagination"></pagination>
      </div>
      <div class="right">
        <p class="tit">已引入用户</p>
        <el-table
          stripe
          :data="introducedList"
          style="width: 90%"
          v-loading="loading4"
          class="introduce-table"
          ref="table2">
          <el-table-column
            align="center"
            label="用户名称">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userRemark || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <span>
                <el-button
                  type="text"
                  @click="introduceRemove(scope.row)"
                  size="small">
                  移除
                </el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination @current-change="handleCurrentChange3"
                    :bean="pageBean2"
                    layout="prev, pager, next"
                    class="pagination"></pagination>
      </div>
      <div class="clear-both"></div>
    </el-dialog>
  </div>
</template>
<script>
import {post} from '../../../common/js/http'
import {mapGetters} from 'vuex'
import {adminReadableMixin} from '../../../common/js/mixin'
import {debounce} from '../../../common/js/clazz'

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
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        roleId: '',
        userId: '',
        roleName: '',
        roleCode: '',
        roleDescribe: ''
      },
      rules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        roleDescribe: [{
          max: 50,
          message: '最多50个字符',
          trigger: 'change'
        }]
      },
      readable: [],
      checkedData: [],
      defaultChecked: [],
      defaultProps: {
        children: 'twoResourceList',
        label: 'resourceName',
        id: 'resourceId'
      },
      list: [],
      loading: false,
      loadingAdd: false,
      dispatchData: {
        resourceIdAndSateStr: '',
        roleId: '',
        userId: ''
      },
      loadingDis: false,
      dialogFormVisible3: false,
      searchIntroduced: {
        roleId: '',
        currentPage: 1,
        rowsNum: 10
      },
      searchUnintroduced: {
        roleId: '',
        currentPage: 1,
        rowsNum: 10
      },
      loading4: false,
      loading5: false,
      introducedList: [],
      pageBean2: {},
      unintroducedList: [],
      pageBean3: {}
    }
  },
  methods: {
    addSubmit() {
      let url = 'service/sys/iccRole/iccRole/add'
      if (this.form.roleId) url = 'service/sys/iccRole/iccRole/update.xf'
      this.$refs.formAdd.validate().then(valid => {
        if (valid) {
          this.loadingAdd = true
          let o = Object.assign({}, this.form)
          for (let i in o) {
            o[i] = encodeURIComponent(o[i])
          }
          post(url, o).then(res => {
            this.loadingAdd = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => {
            this.loadingAdd = false
          })
        }
      })
    },
    add() {
      this.form.roleId = ''
      this.form.userId = this.uid
      this.form.roleName = ''
      this.form.roleCode = ''
      this.form.roleDescribe = ''
      this.dialogFormVisible = true
    },
    edit(row) {
      this.form.userId = ''
      this.form.roleId = row.roleId
      this.form.roleName = row.roleName
      this.form.roleCode = row.roleCode
      this.form.roleDescribe = row.roleDescribe
      this.dialogFormVisible = true
    },
    del(row) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccRole/iccRole/del', {
        roleId: row.roleId
      }).then(res => {
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
    confirmDel(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del(row)
      }).catch(() => {
        // 取消
      })
    },
    dispatch(row) {
      this.dispatchList(row.roleId)
      this.dispatchData.roleId = row.roleId
    },
    dispatchList(roleId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccRoleResource/iccRoleResource/getListResource.xf', {roleId}).then(res => {
        this.fullLoading.close()
        for (let i = 0; i < res.result.length; i++) {
          res.result[i].isTop = true
        }
        this.dialogFormVisible2 = true
        this.defaultChecked = []
        this.readable = []
        this.initDefaultChecked(res.result)
        this.checkedData = res.result
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    initDefaultChecked(arr) {
      arr.forEach(item => {
        if (Number(item.selectSign) === 1) {
          this.defaultChecked.push(item.resourceId)
        }
        if (Number(item.resourceState) === 1) {
          this.readable.push(item.resourceId)
        }
        if (item.twoResourceList && item.twoResourceList.length) {
          this.initDefaultChecked(item.twoResourceList)
        }
      })
    },
    dispatchSubmit() {
      let arr = []
      this.$refs.tree.getCheckedKeys().forEach(item => {
        for (let i = 0; i < this.readable.length; i++) {
          if (this.readable[i] === item) {
            arr.push(`${item}-1`)
            return
          }
        }
        arr.push(`${item}-0`)
      })
      this.dispatchData.resourceIdAndSateStr = arr.join(',')
      this.dispatchData.userId = this.uid
      this.loadingDis = true
      post('service/sys/iccRole/iccRole/addUserResourse.xf', this.dispatchData).then(res => {
        this.loadingDis = false
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.dialogFormVisible2 = false
        }
      }).catch(() => {
        this.loadingDis = false
      })
    },
    editIntroduce(row) {
      this.dialogFormVisible3 = true
      this.searchIntroduced.roleId = row.roleId
      this.searchIntroduced.currentPage = 1
      this.searchUnintroduced.roleId = row.roleId
      this.searchUnintroduced.currentPage = 1
      this.getIntroducedList()
      this.getUnintroducedList()
    },
    getIntroducedList() { // 已引入用户
      this.loading4 = true
      post('service/sys/iccRole/iccRole/roleUserList.xf', this.searchIntroduced).then(res => {
        this.loading4 = false
        this.introducedList = res.result || []
        this.pageBean2 = res.pageBean || {}
      }).catch(() => {
        this.loading4 = false
      })
    },
    getUnintroducedList() { // 未引入用户
      this.loading5 = true
      post('service/business/college/iccUser/iccUser/userList.xf', this.searchUnintroduced).then(res => {
        this.loading5 = false
        this.unintroducedList = res.result || []
        this.pageBean3 = res.pageBean || {}
      }).catch(() => {
        this.loading5 = false
      })
    },
    introduceAdd(row) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccRole/iccRole/addUser.xf', {
        userIdStr: row.userId,
        roleId: this.searchUnintroduced.roleId,
        userId: this.uid
      }).then(res => {
        this.fullLoading.close()
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getIntroducedList()
          this.getUnintroducedList()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    introduceRemove(row) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/sys/iccRole/iccRole/removeUser.xf', {
        roleId: this.searchUnintroduced.roleId,
        userIds: row.userId
      }).then(res => {
        this.fullLoading.close()
        if (res.error.result === 1) {
          this.$message({
            type: 'success',
            message: res.error.message
          })
          this.getIntroducedList()
          this.getUnintroducedList()
        }
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleCurrentChange2(page) {
      this.searchUnintroduced.currentPage = page
      this.getUnintroducedList()
    },
    handleCurrentChange3(page) {
      this.searchIntroduced.currentPage = page
      this.getIntroducedList()
    },
    indexMethod(index) {
      return index + 1
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/sys/iccRole/iccRole/listJson').then(res => {
        this.loading = false
        this.list = res.result || []
      }).catch(() => {
        this.loading = false
      })
    },
    getPinyin(str) {
      post('service/business/college/iccUser/iccUser/getUserCode.xf', {
        userName: str
      }).then(res => {
        if (res.result && res.result.userCode) {
          this.form.roleCode = res.result.userCode
        } else {
          this.form.userCode = ''
        }
      })
    }
  },
  created() {
    this.getList()
    this.$watch('form.roleName', debounce((newVal) => {
      this.getPinyin(newVal)
    }, 800))
  }
}
</script>
<style scoped lang="scss">
  @import '../../../common/style/variables';

  .add{
    width: 500px;
    margin: 0 auto;
  }
  .tree{
    padding: 0 50px;
  }
  .title{
    padding: 0 0 20px 0;
  }
  .custom-tree-node{
    .edit{
      padding-left: 20px;
    }
  }
  .introduce{
    .tit{
      padding-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .left{
      width: 50%;
      float: left;
    }
    .right{
      width: 50%;
      float: left;
    }
    .introduce-table{
      margin: 0 auto;
    }
  }
  .pagination{
    padding-top: 10px;
    text-align: center;
  }
</style>
