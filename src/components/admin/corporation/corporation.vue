<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="企业管理"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="登记状态">
        <el-select v-model="registerStatus" placeholder="请选择登记状态">
          <el-option label="存续" value="1"></el-option>
          <el-option label="注销" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业类型">
        <el-select v-model="enterpriseType" placeholder="请选择企业类型">
          <el-option label="公司" value="1"></el-option>
          <el-option label="自然人" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业性质">
        <el-select v-model="corpNature" placeholder="请选择企业性质">
          <el-option :label="val.parameterOption" :value="val.parameterCode" v-for="(val, key) in dictionaries.corpNature" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="dateRange" label="创建日期">
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
      <!--<el-form-item label="企业所在地">
        <el-cascader
          :options="dictionaries.cities"
          change-on-select
          filterable
          placeholder="请选择企业所在地"
          :props="cascaderFmt"
          @change="handleRegisterAddress"
          clearable
          :value="registerAddressValue"
        ></el-cascader>
      </el-form-item>-->
      <el-form-item label="关键字">
        <el-input v-model="keywords" placeholder="请输入关键字" @keydown.native.enter="onSubmit">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit" title="搜索">搜索</el-button>
        <el-button type="warning" size="small" icon="el-icon-refresh" @click="reset" title="重置搜索条件">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
        stripe
        :data="list"
        style="width: 100%"
        v-loading="loading"
        @row-dblclick="handleDbclick"
        @selection-change="handleSelectionChange"
        ref="table">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="企业名称">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.companyName, keywords)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="统一社会信用代码">
          <template slot-scope="scope">
            <span>{{scope.row.companyUniformSocialCreditCode || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="120"
          label="法人">
          <template slot-scope="scope">
            <span>{{scope.row.companyLegalPerson || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="120"
          label="企业类型">
          <template slot-scope="scope">
            <span v-html="handleCompanyType(scope.row.companyType)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="登记状态">
          <template slot-scope="scope">
            <span>{{scope.row.companyRegistrationStatus || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="累计使用次数">
          <template slot-scope="scope">
            <span>{{scope.row.useCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="创建日期">
          <template slot-scope="scope">
            <span v-html="dateFormat(scope.row.companyCreateTime, 'yyyy-MM-dd')"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="企业注册地">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.companyRegisteredAddress, keywords)"></span>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          align="center"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="handleDbclick(scope.row, $event)"
              type="text"
              size="small">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <el-dropdown @command="handleCommand" class="dropdown" placement="bottom-start">
      <el-button type="primary" size="small">
        导出企业<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="first">按当前条件导出</el-dropdown-item>
        <!--<el-dropdown-item command="second">导出当前页</el-dropdown-item>-->
        <el-dropdown-item command="third">导出当前页</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog :title="currentRow.companyName" :visible.sync="dialogTableVisible">
      <el-form label-position="left" class="dialog-table-expand">
        <el-form-item label="企业名称:">
          <span>{{ currentRow.companyName || '--' }}</span>
        </el-form-item>
        <el-form-item label="法人:">
          <span>{{ currentRow.companyLegalPerson || '--' }}</span>
        </el-form-item>
        <el-form-item label="社会统一信用代码:">
          <span>{{ currentRow.companyUniformSocialCreditCode || '--' }}</span>
        </el-form-item>
        <el-form-item label="成立日期:">
          <span>{{ currentRow.companyEstablishmentTime || '--' }}</span>
        </el-form-item>
        <el-form-item label="登记状态:">
          <span>{{ currentRow.companyRegistrationStatus || '--' }}</span>
        </el-form-item>
        <el-form-item label="登记机关:">
          <span>{{ currentRow.companyRegistrationOrgan || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业类型:">
          <span>{{ handleCompanyType(currentRow.companyType) || '--' }}</span>
        </el-form-item>
        <el-form-item label="注册资本:">
          <span>{{ currentRow.companyRegisteredCapital || '--' }}</span>
        </el-form-item>
        <el-form-item label="营业期限:">
          <span>{{ currentRow.companyStartTime }} -- {{ currentRow.companyEndTime }}</span>
        </el-form-item>
        <el-form-item label="企业创建日期:">
          <span>{{ dateFormat(currentRow.companyCreateTime, 'yyyy-MM-dd hh:mm:ss') }}</span>
        </el-form-item>
        <el-form-item label="核准日期:">
          <span>{{ currentRow.companyApprovedTime || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业性质:">
          <span>{{ currentRow.corpNature || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业电话:">
          <span>{{ currentRow.companyContactTel || '--' }}</span>
        </el-form-item>
        <div class="clear-both"></div>
      </el-form>
      <el-form label-position="left" class="dialog-table-expand2">
        <el-form-item label="企业注册地:">
          <span>{{ currentRow.companyRegisteredAddress || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业联系地址:">
          <span>{{ currentRow.companyContactAddress || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业营业执照:">
          <img :src="currentRow.companyLicenseUrl" v-img="currentRow.companyLicenseUrl" alt="企业营业执照" style="width: 150px;" v-if="currentRow.companyLicenseUrl">
        </el-form-item>
        <el-form-item label="经营范围:">
          <span>{{ currentRow.companyBusinessScope || '--' }}</span>
        </el-form-item>
        <el-form-item label="企业介绍:">
          <span>{{ currentRow.companyIntroduce || '--' }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {BASE_URL, PAGE_SIZE} from '../../../common/js/config'
import {post} from '../../../common/js/http'
import {dateFormat} from '../../../common/js/clazz'
import {mapGetters} from 'vuex'
import {normalMixin} from '../../../common/js/mixin'

export default {
  mixins: [normalMixin],
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  data() {
    return {
      editableTabsValue: 'list',
      searchData: {
        userId: '',
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        registerAddress: '', // 企业所在地
        registerStatus: '', // 登记状态
        enterpriseType: '', // 企业类型
        corpNature: '', // 企业性质
        enterpriseName: '', // 企业名字
        beginDate: '',
        endDate: ''
      },
      cascaderFmt: {
        value: 'id',
        label: 'text',
        children: 'children'
      },
      registerAddress: '', // 企业所在地
      registerStatus: '', // 登记状态
      enterpriseType: '', // 企业类型
      corpNature: '', // 企业性质
      enterpriseName: '', // 企业名字
      keywords: '',
      addressStr: '',
      registerAddressValue: [],
      dateRange: [],
      pageBean: {},
      list: [],
      loading: false,
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
      dialogTableVisible: false,
      currentRow: {},
      selections: []
    }
  },
  methods: {
    getList() {
      if (this.loading) return
      this.loading = true
      this.searchData.userId = this.uid
      post('service/business/college/corp/iccCompany/corpAll.xf', this.searchData).then(data => {
        this.loading = false
        data.result || (data.result = [])
        this.list = data.result
        this.pageBean = data.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    dateFormat(d, fmt) {
      if (!d) return ''
      d = typeof d === 'string' ? d.replace(/-/g, '/') : d
      let t = new Date(d)
      return dateFormat.call(t, fmt)
    },
    download() {
      window.open(`${BASE_URL}service/business/college/corp/iccCompany/exportHT.xf?registerStatus=${this.searchData.registerStatus}&enterpriseType=${this.searchData.enterpriseType}&enterpriseName=${encodeURIComponent(this.searchData.enterpriseName)}&beginDate=${this.searchData.beginDate}&endDate=${this.searchData.endDate}&corpNature=${this.searchData.corpNature}&registerAddress=${this.searchData.registerAddress}&userId=${this.uid}`)
    },
    onSubmit() {
      this.searchData.enterpriseName = encodeURIComponent(this.keywords)
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.registerAddressValue = []
      this.registerStatus = ''
      this.enterpriseType = ''
      this.corpNature = ''
      this.keywords = ''
      this.searchData.enterpriseName = ''
      this.searchData.registerAddress = ''
      this.dateRange = []
    },
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
    },
    getCorpType(type) {
      if (type === 1) return '公司'
      return '自然人'
    },
    handleDbclick(row, event) {
      const loading = this.$loading({
        lock: true
      })
      post('service/business/college/corp/iccCompany/corpDetails.xf', {
        companyId: row.companyId
      }).then(res => {
        this.dialogTableVisible = true
        this.currentRow = res.result
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    handleCompanyType(num) {
      if (num === 1) return '公司'
      return '自然人'
    },
    handleRegisterAddress(val) {
      this.searchData.registerAddress = val[val.length - 1]
      this.searchData.currentPage = 1
      this.getList()
    },
    handleCommand(cmd) {
      if (cmd === 'first') {
        this.download()
      } else if (cmd === 'second') {
        let arr = this.list.map(item => item.companyId)
        window.open(`${BASE_URL}service/business/college/corp/iccCompany/exportHT.xf?userId=${this.uid}&ids=${arr.join(',')}`)
      } else if (cmd === 'third') {
        if (!this.selections.length) {
          this.noSelect()
          return
        }
        window.open(`${BASE_URL}service/business/college/corp/iccCompany/exportHT.xf?userId=${this.uid}&ids=${this.selections.join(',')}`)
      }
    },
    handleSelectionChange(selections) {
      this.selections = selections.map(item => item.companyId)
    }
  },
  watch: {
    dateRange(newVal, oldVal) {
      if (newVal && newVal.length === 2) {
        this.searchData.beginDate = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endDate = dateFormat.call(newVal[1], 'yyyy-MM-dd')
        this.searchData.currentPage = 1
      } else {
        this.searchData.beginDate = ''
        this.searchData.endDate = ''
        this.searchData.currentPage = 1
      }
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    registerStatus(newVal, oldVal) {
      this.searchData.registerStatus = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    enterpriseType(newVal, oldVal) {
      this.searchData.enterpriseType = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    },
    corpNature(newVal, oldVal) {
      this.searchData.corpNature = newVal
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 200)
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style scoped lang="scss">
  .pagination {
    text-align: center;
    margin: 20px 0 0 0;
  }

  .table {
    margin: 10px 0;
  }
</style>
