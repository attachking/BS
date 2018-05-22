<template>
  <div class="monitor">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="设备监控"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline" ref="search">
      <el-form-item label="设备类型">
        <el-select v-model="searchData.deviceType" placeholder="设备类型" clearable>
          <el-option :label="item.parameterOption" :value="item.parameterId" v-for="(item, key) in dictionaries.deviceType" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item>
        <el-select v-model="searchData.deviceLastRunStatus" placeholder="运行状态">
          <el-option label="异常" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="所属项目">
        <el-select v-model="searchData.projectId" placeholder="请选择项目" filterable clearable>
          <el-option :label="item.projectName" :value="item.projectId" v-for="(item, key) in projectList" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="dateRange" label="监控时间">
        <el-date-picker
          :editable="false"
          v-model="dateRange"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-value="defaultValue"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="searchData.deviceName" placeholder="设备名称" @keydown.native.enter="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="设备编码">
        <el-input v-model="searchData.deviceCode" placeholder="设备编码" @keydown.native.enter="onSubmit"></el-input>
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
      @selection-change="handleSelectionChange"
      ref="table">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        label="项目名称">
        <template slot-scope="scope">
          <span>{{scope.row.projectName || '--'}}</span>
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
        label="设备类型"
        align="center"
        prop="deviceCreatetime">
        <template slot-scope="scope">
          <span>{{scope.row.parameterOption || '--'}}</span>
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
        label="机器码"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceMachineCode || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权码"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceLicenseKey || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开机状态"
        align="center">
        <template slot-scope="scope">
          <span v-html="deviceStatus(scope.row.openCounts)"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="监控时间"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.time || '--'}}</span>
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
        <!--<el-dropdown-item command="third">导出当前页</el-dropdown-item>-->
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {post} from '../../../common/js/http'
import {PAGE_SIZE, BASE_URL} from '../../../common/js/config'
import {dateFormat} from '../../../common/js/clazz'
import {normalMixin} from '../../../common/js/mixin'

export default {
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  mixins: [normalMixin],
  data() {
    return {
      editableTabsValue: 'list',
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        projectName: '',
        deviceType: '', // 设备类型
        deviceLastRunStatus: '',
        projectId: '',
        startTime: '',
        endTime: '',
        deviceName: '', // 设备名称
        deviceCode: '' // 设备编码
      },
      loading: false,
      list: [],
      projectList: [],
      dateRange: [],
      pageBean: {},
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
      selections: [],
      defaultValue: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
    }
  },
  methods: {
    onSubmit() {
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.currentPage = 1
      this.searchData.projectName = ''
      this.searchData.deviceType = ''
      this.searchData.deviceLastRunStatus = ''
      this.searchData.projectId = ''
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.deviceName = ''
      this.searchData.deviceCode = ''
      this.dateRange = []
      setTimeout(() => {
        this.getList()
      }, 20)
    },
    getList() {
      if (this.loading) return
      this.loading = true
      let o = Object.assign({}, this.searchData)
      o.deviceName = encodeURIComponent(o.deviceName)
      post('service/business/college/iccDevice/iccDevice/editDeviceRecordList.xf', o).then(res => {
        this.loading = false
        this.list = res.result
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
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
    handleSizeChange(size) {
      this.searchData.rowsNum = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.searchData.currentPage = page
      this.getList()
    },
    handleSelectionChange(selections) {
      this.selections = selections
    },
    download(search) {
      console.log(search)
      window.open(`${BASE_URL}service/business/college/iccDevice/iccDevice/exportDeviceRecodeList.xf?${search}`)
    },
    handleCommand(e) {
      if (e === 'first') {
        let search = []
        for (let i in this.searchData) {
          if (i !== 'currentPage' && i !== 'rowsNum') {
            if (this.searchData.hasOwnProperty(i)) search.push(`${i}=${encodeURIComponent(this.searchData[i])}`)
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
    },
    deviceStatus(s) {
      return Number(s) === 0 ? '<span style="color: red;">未开机</span>' : '已开机'
    }
  },
  watch: {
    dateRange(newVal) {
      if (newVal && newVal.length) {
        if (newVal[1].getTime() > new Date().getTime()) {
          if (newVal[0].getTime() > new Date().getTime()) {
            this.dateRange = [new Date(), new Date()]
          } else {
            this.dateRange = [newVal[0], new Date()]
          }
          return
        }
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
    'searchData.projectId'() {
      setTimeout(() => {
        this.onSubmit()
      }, 20)
    }
  },
  created() {
    this.getList()
    this.getProjectList()
  }
}
</script>
<style lang="scss" scoped>
  .pagination{
    margin: 20px 0;
    text-align: center;
  }
</style>
