<template>
  <div class="issues">
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        label="问题维护"
        name="list"
      >
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        {{item.content}}
      </el-tab-pane>
    </el-tabs>
    <issues-edit ref="issuesEdit" v-show="editableTabsValue === 'edit'" :data="editData" @cancel="handleCancel" @success="handleSuccess"></issues-edit>
    <issues-detail v-show="editableTabsValue === 'detail'" :data="detailData" :files="files"></issues-detail>
    <div class="list" v-show="editableTabsValue === 'list'">
      <el-form :inline="true" class="demo-form-inline" ref="form2">
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="add" :disabled="!adminReadable">创建问题</el-button>
        </el-form-item>
        <el-form-item label="问题类别">
          <el-select v-model="searchData.knowledgeType" filterable placeholder="请选择问题类别" clearable>
            <el-option :label="item.parameterOption" :value="item.parameterId" v-for="item in dictionaries.issuesType" :key="item.parameterId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-select v-model="searchData.userId" filterable placeholder="请选择创建人" clearable>
            <el-option :label="item.userName" :value="item.userId" v-for="item in userList" :key="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="keywords" placeholder="请输入关键字" @keydown.native.enter="onSubmit">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
          <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        :data="list"
        style="width: 100%"
        v-loading="loading"
        @row-dblclick="showDetail"
        ref="table">
        <el-table-column
          align="center"
          label="标题">
          <template slot-scope="scope">
            <el-badge :title="scope.row.knowledgeHead" value="置顶" v-if="scope.row.knowledgeTop === 1" class="badge">
              <span v-html="handleKeywords(scope.row.knowledgeHead, keywords)"></span>
            </el-badge>
            <span v-if="scope.row.knowledgeTop !== 1" v-html="handleKeywords(scope.row.knowledgeHead, keywords)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="关键字">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.knowledgeKeyword, keywords)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="问题类别">
          <template slot-scope="scope">
            <span>{{scope.row.parameterOption}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建人">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="修改时间">
          <template slot-scope="scope">
            <span>{{scope.row.knowledgeModifytime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="点击量">
          <template slot-scope="scope">
            <span>{{scope.row.knowledgeClicks || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showDetail(scope.row)">
              查看详情
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!adminReadable"
              v-if="scope.row.knowledgeCreator + '' === uid || adminReadable"
              @click="top(scope.row.knowledgeId)">
              {{scope.row.knowledgeTop === 1 ? '取消置顶' : '置顶'}}
            </el-button>
            <br v-if="scope.row.knowledgeCreator + '' === uid || adminReadable">
            <el-button
              type="text"
              size="small"
              :disabled="!adminReadable"
              v-if="scope.row.knowledgeCreator + '' === uid || adminReadable"
              @click="edit(scope.row.knowledgeId)">
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              :disabled="!adminReadable"
              v-if="scope.row.knowledgeCreator + '' === uid || adminReadable"
              @click="check(scope.row.knowledgeId)">
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
  </div>
</template>
<script>
import IssuesEdit from './edit/issues-edit.vue'
import {adminReadableMixin, normalMixin} from '../../../common/js/mixin'
import {PAGE_SIZE} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import IssuesDetail from './detail/issues-detail.vue'
import {mapGetters} from 'vuex'

export default {
  components: {
    IssuesDetail,
    IssuesEdit
  },
  mixins: [adminReadableMixin, normalMixin],
  computed: {
    ...mapGetters([
      'dictionaries',
      'uid'
    ])
  },
  data() {
    return {
      editableTabsValue: 'list',
      editableTabs: [],
      list: [],
      loading: false,
      keywords: '',
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        userId: '', // 创建人id
        knowledgeType: '', // 问题类别
        knowledgeDesc: '' // 问题描述
      },
      pageBean: {},
      userList: [],
      editData: {},
      detailData: {},
      files: []
    }
  },
  methods: {
    getUserList() {
      post('service/business/college/iccUser/iccUser/getIccUserList.xf', {
        rowsNum: 9999,
        currentPage: 1,
        userType: 1
      }).then(res => {
        this.userList = res.result
      })
    },
    removeTab(name) {
      this.editableTabs.splice(this.editableTabs.findIndex(item => item.name === name), 1)
      this.editableTabsValue = 'list'
    },
    tabClick(tab) {},
    check(id) {
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
    remove(id) {
      this.loading = true
      post('service/business/college/iccKnowledge/iccKnowledge/delKnowledgeInfo.xf', {
        userId: this.uid,
        knowledgeId: id
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
    edit(knowledgeId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccKnowledge/iccKnowledge/editKnowledgeInfo.xf', {
        iccKnowledgeId: knowledgeId
      }).then(res => {
        this.fullLoading.close()
        let obj = res.result.iccKnowledgeInfo || {}
        obj.fileList = res.result.iccDeviceFileList
        this.editData = obj
        this.showEditTab()
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    top(knowledgeId) {
      this.loading = true
      post('service/business/college/iccKnowledge/iccKnowledge/topKnowledgeInfo.xf', {
        userId: this.uid,
        knowledgeId
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
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.searchData.currentPage = 1
      this.getList()
    },
    handleCurrentChange(num) {
      this.searchData.currentPage = num
      this.getList()
    },
    showEditTab() {
      let index = this.editableTabs.findIndex(item => item.name === 'edit')
      if (index !== -1) {
        this.editableTabs.splice(index, 1)
      }
      let title = this.editData.knowledgeId ? '修改问题' : '新建问题'
      this.editableTabs.push({
        name: 'edit',
        title: title
      })
      this.editableTabsValue = 'edit'
    },
    getList(cb) {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccKnowledge/iccKnowledge/getKnowledgeList.xf', this.searchData).then(res => {
        this.loading = false
        this.list = res.result
        this.pageBean = res.pageBean
        setTimeout(() => {
          if (typeof cb === 'function') cb()
        }, 20)
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.editData = {
        fileList: []
      }
      this.showEditTab()
      setTimeout(() => {
        this.$refs.issuesEdit.clearValidate()
      }, 20)
    },
    onSubmit() {
      this.searchData.knowledgeDesc = encodeURIComponent(this.keywords)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.userId = ''
      this.searchData.knowledgeType = ''
      this.searchData.knowledgeDesc = ''
      this.keywords = ''
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    getDetail() {
      let index = this.editableTabs.findIndex(item => item.name === 'detail')
      if (index !== -1) {
        this.editableTabs.splice(index, 1)
      }
      this.editableTabs.push({
        name: 'detail',
        title: '查看详情'
      })
      this.editableTabsValue = 'detail'
    },
    showDetail(row) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccKnowledge/iccKnowledge/editKnowledgeInfo.xf', {
        iccKnowledgeId: row.knowledgeId
      }).then(res => {
        this.fullLoading.close()
        let obj = res.result.iccKnowledgeInfo || {}
        this.files = res.result.iccDeviceFileList.map(item => {
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(item.deviceFileUrl)) {
            return {
              type: 1,
              name: item.deviceFileName,
              url: item.deviceFileUrl
            }
          } else {
            return {
              type: 2,
              name: item.deviceFileName,
              url: item.deviceFileUrl
            }
          }
        })
        this.detailData = obj
        this.getList(() => {
          this.getDetail()
        })
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    handleSuccess() {
      this.getList()
      this.removeTab('edit')
    },
    handleCancel() {
      this.removeTab('edit')
    }
  },
  watch: {
    'searchData.userId'(newVal, oldVal) {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    'searchData.knowledgeType'(newVal, oldVal) {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    }
  },
  created() {
    this.getList()
    this.getUserList()
  }
}
</script>
<style lang="scss">
  .issues{
    .pagination{
      padding: 20px 0;
      text-align: center;
    }
    .badge{
      margin: 10px 26px 0 0;
      .el-badge__content.is-fixed{
        right: 2px;
      }
    }
  }
</style>
