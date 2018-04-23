<!--展开行式的表格-->
<template>
  <div class="search">
    <div class="option">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="registerStatus" placeholder="请选择登记状态">
            <el-option label="请选择登记状态" value=""></el-option>
            <el-option label="存续" value="1"></el-option>
            <el-option label="注销" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="enterpriseType" placeholder="请选择企业类型">
            <el-option label="请选择企业类型" value=""></el-option>
            <el-option label="公司" value="1"></el-option>
            <el-option label="自然人" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="dateRange">
          <el-date-picker
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
          <el-input v-model="keywords" placeholder="请输入关键字" @keydown.native.enter="onSubmit">
            <el-button slot="append" icon="el-icon-search" @click="onSubmit"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
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
              <el-form-item label="企业名称:">
                <span>{{ props.row.enterpriseName }}</span>
              </el-form-item>
              <el-form-item label="统一社会信用代码:">
                <span>{{ props.row.uniformSocialCreditCode }}</span>
              </el-form-item>
              <el-form-item label="法人:">
                <span>{{ props.row.legalPerson }}</span>
              </el-form-item>
              <el-form-item label="登记机关:">
                <span>{{ props.row.registrationAuthority }}</span>
              </el-form-item>
              <el-form-item label="成立日期:">
                <span>{{ props.row.establishmentDate }}</span>
              </el-form-item>
              <el-form-item label="登记状态(存续,注销):">
                <span>{{ props.row.registerStatus }}</span>
              </el-form-item>
              <el-form-item label="企业类型:">
                <span>{{ props.row.enterpriseType }}</span>
              </el-form-item>
              <el-form-item label="注册资本:">
                <span>{{ props.row.registeredCapital }}</span>
              </el-form-item>
              <el-form-item label="营业期限开始日期:">
                <span>{{ props.row.businessTermStartDate }}</span>
              </el-form-item>
              <el-form-item label="营业期限结束日期:">
                <span>{{ props.row.businessTermEndDate }}</span>
              </el-form-item>
              <el-form-item label="核准日期:">
                <span>{{ props.row.approvedDate }}</span>
              </el-form-item>
              <el-form-item label="认证日期:">
                <span>{{ props.row.createDate }}</span>
              </el-form-item>
              <el-form-item label="经营范围:">
                <span>{{ props.row.businessScope }}</span>
              </el-form-item>
              <el-form-item label="企业注册地:">
                <span>{{ props.row.companiesRegistered }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.enterpriseName)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="统一社会信用代码"
          prop="uniformSocialCreditCode">
        </el-table-column>
        <el-table-column
          label="法人"
          prop="legalPerson">
        </el-table-column>
        <el-table-column
          label="企业类型"
          prop="enterpriseType">
        </el-table-column>
        <el-table-column
          label="登记状态"
          prop="registerStatus">
        </el-table-column>
        <el-table-column
          label="认证日期"
          prop="createDate">
        </el-table-column>
        <el-table-column
          label="企业注册地">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.companiesRegistered)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <el-tooltip class="download" effect="dark" content="点击导出当前条件下所有企业信息" placement="top-end" v-if="list.length">
      <el-button type="success" @click="download">导出</el-button>
    </el-tooltip>
  </div>
</template>
<script>
import {BASE_URL, PAGE_SIZE} from '../../common/js/config'
import {post} from '../../common/js/http'
import {dateFormat} from '../../common/js/clazz'

export default {
  data() {
    return {
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        registerStatus: '',
        enterpriseType: '',
        enterpriseName: '',
        beginApprovedDate: '',
        endApprovedDate: ''
      },
      registerStatus: '',
      enterpriseType: '',
      keywords: '',
      dateRange: [],
      pageBean: {},
      list: [],
      loading: true,
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
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      post('service/business/college/corp/tEnterprise/corpList.xf', this.searchData).then(data => {
        this.loading = false
        data.result.forEach(item => {
          item.createDate = dateFormat.call(new Date(item.createDate), 'yyyy-MM-dd')
          item.enterpriseType = this.getCorpType(item.enterpriseType)
        })
        this.list = data.result
        this.pageBean = data.pageBean
      }).catch(() => {
        this.loading = false
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
    onSubmit() {
      this.searchData.enterpriseName = this.keywords
      this.searchData.currentPage = 1
      this.getList()
    },
    download() {
      window.open(`${BASE_URL}service/business/college/corp/tEnterprise/export?registerStatus=${this.searchData.registerStatus}&enterpriseType=${this.searchData.enterpriseType}&enterpriseName=${this.searchData.enterpriseName}&beginApprovedDate=${this.searchData.beginApprovedDate}&endApprovedDate=${this.searchData.endApprovedDate}`)
    },
    handleKeywords(str) {
      if (this.searchData.enterpriseName) {
        return str.replace(new RegExp(this.searchData.enterpriseName, 'g'), `<span style="color: red;">${this.searchData.enterpriseName}</span>`)
      } else {
        return str
      }
    },
    getCorpType(type) {
      if (type === 1) return '公司'
      return '自然人'
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
    }
  },
  watch: {
    dateRange(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.searchData.beginApprovedDate = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endApprovedDate = dateFormat.call(newVal[1], 'yyyy-MM-dd')
        this.searchData.currentPage = 1
      } else {
        this.searchData.beginApprovedDate = ''
        this.searchData.endApprovedDate = ''
        this.searchData.currentPage = 1
      }
      this.getList()
    },
    registerStatus(newVal, oldVal) {
      this.searchData.registerStatus = newVal
      this.searchData.currentPage = 1
      this.getList()
    },
    enterpriseType(newVal, oldVal) {
      this.searchData.enterpriseType = newVal
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

  .option {
    height: 160px;
    background: url(../../common/img/head_bg.jpg) no-repeat 100% 100%;
    padding: 63px 0 0 0;
    form {
      text-align: center;
    }
  }

  .pagination {
    text-align: center;
    margin: 20px 0;
  }

  .table {
    margin: 10px 50px;
  }

  .search{
    position: relative;
    .download{
      position: absolute;
      bottom: 0;
      left: 70px;
    }
  }

</style>
