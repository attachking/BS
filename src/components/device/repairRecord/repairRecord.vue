<template>
  <div class="repairRecord">
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        label="维修记录"
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
    <repair-detail :data="detailData" :files="files" v-show="editableTabsValue === 'detail'"></repair-detail>
    <div v-show="editableTabsValue === 'list'">
      <el-form :inline="true" class="demo-form-inline" ref="search">
        <el-form-item label="设备类型">
          <el-select v-model="searchData.deviceType" placeholder="设备类型" clearable>
            <el-option :label="item.parameterOption" :value="item.parameterId" v-for="(item, key) in dictionaries.deviceType" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>
          <el-select v-model="searchData.qrCodePrintStatus" placeholder="二维码是否打印">
            <el-option label="未打印" :value="0"></el-option>
            <el-option label="已打印" :value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="实施人员">
          <el-select filterable v-model="searchData.userId" placeholder="请选择实施人员" clearable>
            <el-option :label="val.userName" :value="val.userId" v-for="(val, key) in impList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="searchData.projectName" placeholder="请选择项目" filterable clearable>
            <el-option :label="item.projectName" :value="item.projectName" v-for="(item, key) in projectList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchData.deviceName" placeholder="设备名称" @keydown.native.enter="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="searchData.deviceCode" placeholder="设备编码" @keydown.native.enter="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="摆放位置">
          <el-input v-model="searchData.devicePosition" placeholder="摆放位置" @keydown.native.enter="onSubmit"></el-input>
        </el-form-item>
        <el-form-item class="dateRange" label="实施时间">
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
        @row-dblclick="handleDbclick"
        @selection-change="handleSelectionChange"
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
              <el-form-item label="设备编码:">
                <span>{{ props.row.deviceCode || '--' }}</span>
              </el-form-item>
              <el-form-item label="设备ID:">
                <span>{{ props.row.deviceId || '--' }}</span>
              </el-form-item>
              <el-form-item label="设备类型:">
                <span>{{ props.row.parameterOption || '--' }}</span>
              </el-form-item>
              <el-form-item label="设备名称:">
                <span>{{ props.row.deviceName || '--'}}</span>
              </el-form-item>
              <el-form-item label="机器码:">
                <span>{{ props.row.deviceMachineCode || '--' }}</span>
              </el-form-item>
              <el-form-item label="授权码:">
                <span>{{ props.row.deviceLicenseKey || '--' }}</span>
              </el-form-item>
              <el-form-item label="摆放位置:">
                <span>{{ props.row.devicePosition || '--' }}</span>
              </el-form-item>
              <el-form-item label="实施人员:">
                <span>{{ props.row.repairProcesseName || '--' }}</span>
              </el-form-item>
              <el-form-item label="实施时间:">
                <span>{{ props.row.repairProcesseTime || '--' }}</span>
              </el-form-item>
              <el-form-item label="问题描述:">
                <span>{{ props.row.repairProblemDesc || '--' }}</span>
              </el-form-item>
              <el-form-item label="处理结果:">
                <span>{{ props.row.repairProcesseResults === 1 ? '已处理' : '待处理' }}</span>
              </el-form-item>
              <el-form-item label="工单上传:">
                <span>{{ !!props.row.isHasFile ? '已上传' : '未上传' }}</span>
              </el-form-item>
              <el-form-item label="联系客户:">
                <span>{{ props.row.addressBooksContacts || '--' }}</span>
              </el-form-item>
              <el-form-item label="客户电话:">
                <span>{{ props.row.addressBooksContactsPhone || '--' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="项目名称">
          <template slot-scope="scope">
            <span>{{scope.row.projectName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="设备编码"
          align="center">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.deviceCode, searchData.deviceCode)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="设备类型"
          align="center"
          prop="deviceCreatetime">
          <template slot-scope="scope">
            <span>{{scope.row.parameterOption || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="设备名称"
          align="center">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.deviceName, searchData.deviceName)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="摆放位置"
          align="center">
          <template slot-scope="scope">
            <span v-html="handleKeywords(scope.row.devicePosition, searchData.devicePosition)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="实施人员"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.repairProcesseName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实施时间"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.repairProcesseTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="问题描述"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.repairProblemDesc || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getDetail(scope.row.repairRecordId)"
              size="small">
              详情
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
          导出记录<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="first">导出全部</el-dropdown-item>
          <!--<el-dropdown-item command="second">导出当前页</el-dropdown-item>-->
          <el-dropdown-item command="third">导出当前页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {post} from '../../../common/js/http'
import {PAGE_SIZE, BASE_URL} from '../../../common/js/config'
import {dateFormat} from '../../../common/js/clazz'
import {adminReadableMixin, normalMixin} from '../../../common/js/mixin'
import RepairDetail from '../repairDetail/repairDetail.vue'

export default {
  components: {RepairDetail},
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  mixins: [adminReadableMixin, normalMixin],
  data() {
    return {
      projectList: [],
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        projectName: '',
        deviceName: '', // 设备名称
        deviceType: '', // 设备类型
        repairProblemDesc: '', // 问题描述
        deviceCode: '', // 设备编码
        repairProcesseResults: '', // 问题处理结果
        deviceFileUrlState: '', // 是否上传工单
        qrCodePrintStatus: '', // 二维码打印状态
        deviceRepairStatus: '', // 设备维修状态
        devicePosition: '', // 设备所在位置
        userIduserId: '', // 实施人员id
        startTime: '', // 安装开始时间
        endTime: '' // 安装结束时间
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
      impList: [],
      list: [],
      pageBean: {},
      loading: false,
      editableTabs: [],
      editableTabsValue: 'list',
      detailData: {},
      files: [],
      selections: []
    }
  },
  methods: {
    getList() {
      if (this.loading) return
      this.loading = true
      let o = Object.assign({}, this.searchData)
      o.deviceName = encodeURIComponent(o.deviceName)
      o.deviceCode = encodeURIComponent(o.deviceCode)
      o.devicePosition = encodeURIComponent(o.devicePosition)
      post('service/business/college/iccDevice/iccRepairRecord/getRepairRecordList.xf', o).then(res => {
        this.loading = false
        this.list = res.result
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
      })
    },
    getImpList() {
      post('service/business/college/iccUser/iccUser/getImpUserList.xf', {
        rowsNum: 9999,
        currentPage: 1
      }).then(res => {
        this.impList = res.result
      })
    },
    onSubmit() {
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      // this.$refs.search.resetFields()
      this.searchData.currentPage = 1
      this.searchData.projectName = ''
      this.searchData.deviceName = ''
      this.searchData.deviceType = ''
      this.searchData.repairProblemDesc = ''
      this.searchData.deviceCode = ''
      this.searchData.repairProcesseResults = ''
      this.searchData.deviceFileUrlState = ''
      this.searchData.qrCodePrintStatus = ''
      this.searchData.deviceRepairStatus = ''
      this.searchData.devicePosition = ''
      this.searchData.userIduserId = ''
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.userId = ''
      this.dateRange = []
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    handleDbclick(row) {
      this.$refs.table.toggleRowExpansion(row)
    },
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
    },
    removeTab(name) {
      this.editableTabs.splice(this.editableTabs.findIndex(item => item.name === name), 1)
      this.editableTabsValue = 'list'
    },
    tabClick(tab) {},
    showDetail() {
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
    getDetail(repairRecordId) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccDevice/iccRepairRecord/editRepairRecordInfo.xf', {repairRecordId}).then(res => {
        this.fullLoading.close()
        this.detailData = res.result.iccRepairRecord || {}
        this.files = res.result.fileList || []
        this.showDetail()
      }).catch(() => {
        this.fullLoading.close()
      })
    },
    getProjectList() {
      post('service/business/college/iccProject/iccProject/getProjectList.xf', {
        rowsNum: 99999,
        currentPage: 1
      }).then(res => {
        this.projectList = res.result
      })
    },
    handleSelectionChange(selections) {
      this.selections = selections
    },
    download(search) {
      window.open(`${BASE_URL}service/business/college/iccDevice/iccRepairRecord/exportRepairRecordInfo.xf?${search}`)
    },
    handleCommand(e) {
      if (e === 'first') {
        let search = []
        for (let i in this.searchData) {
          if (i !== 'currentPage' && i !== 'rowsNum') {
            if (this.searchData.hasOwnProperty(i)) search.push(`${i}=${this.searchData[i]}`)
          }
        }
        this.download(search.join('&'))
      } else if (e === 'second') {
        this.download(`repairRecordIdStr=${this.list.map(item => item.repairRecordId).join(',')}`)
      } else if (e === 'third') {
        if (!this.selections.length) {
          this.noSelect()
          return
        }
        this.download(`repairRecordIdStr=${this.selections.map(item => item.repairRecordId).join(',')}`)
      }
    }
  },
  watch: {
    dateRange(newVal, oldVal) {
      if (newVal.length) {
        this.searchData.startTime = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endTime = dateFormat.call(newVal[1], 'yyyy-MM-dd')
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    'searchData.deviceType'() {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    'searchData.projectName'() {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    },
    'searchData.userId'() {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    }
  },
  created() {
    this.searchData.deviceCode = this.$route.query.deviceCode || ''
    this.getImpList()
    this.getList()
    this.getProjectList()
  }
}
</script>
<style scoped lang="scss">
  .pagination{
    margin: 20px 0;
    text-align: center;
  }
  .demo-table-expand{
    .el-form-item{
      width: 50%;
      margin: 0;
    }
  }
</style>
