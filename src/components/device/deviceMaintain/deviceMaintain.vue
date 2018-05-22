<template>
  <div class="deviceMaintain">
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="设备维护"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="选择项目">
        <el-select v-model="searchData.projectId" placeholder="请选择项目" filterable clearable>
          <el-option :label="item.projectName" :value="item.projectId" v-for="(item, key) in projectList" :key="key"></el-option>
        </el-select>
      </el-form-item>
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
        <el-select filterable v-model="searchData.userIduserId" placeholder="请选择实施人员" clearable>
          <el-option :label="val.userName" :value="val.userId" v-for="(val, key) in impList" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="searchData.projectName" placeholder="项目名称" @keydown.native.enter="onSubmit"></el-input>
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
      <!--<el-form-item label="安装时间">
        <el-date-picker
          v-model="startTime"
          type="date"
          :editable="false"
          placeholder="安装开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="endTime"
          type="date"
          :editable="false"
          placeholder="安装结束时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item class="dateRange" label="安装时间">
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
      @expand-change="handleExpandChange"
      @selection-change="handleSelectionChange"
      ref="table">
      <el-table-column
        type="selection"
        :selectable="selectable"
        width="55">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="设备名称:">
              <span>{{ props.row.deviceName || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备类型:">
              <span>{{ props.row.parameterOption || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备编码:">
              <span>{{ props.row.deviceCode || '--' }}</span>
            </el-form-item>
            <el-form-item label="机器码:">
              <span>{{ props.row.deviceMachineCode || '--' }}</span>
            </el-form-item>
            <el-form-item label="授权码:">
              <span>{{ props.row.deviceLicenseKey || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备所在位置:">
              <span>{{ props.row.devicePosition || '--'}}</span>
            </el-form-item>
            <el-form-item label="设备安装时间:">
              <span>{{ props.row.deviceInstallTime || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备是否授权:">
              <span>{{ !!props.row.deviceLicenseKey ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="所属项目:">
              <span>{{ props.row.projectName || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备安装人员:">
              <span>{{ props.row.deviceInstallerName || '--' }}</span>
            </el-form-item>
            <el-form-item label="设备创建人员:">
              <span>{{ props.row.deviceCreatorName || '--' }}</span>
            </el-form-item>
            <el-form-item label="客户设备编号:">
              <span>{{props.row.deviceRegisteCode || '--'}}</span>
            </el-form-item>
            <el-form-item label="设备二维码:">
              <img :src="getQrCode(props.row)" alt="" style="width: 100px;" v-img="getQrCode(props.row)">
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="设备名称">
        <template slot-scope="scope">
          <span>{{scope.row.deviceName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="设备类型">
        <template slot-scope="scope">
          <span>{{scope.row.parameterOption || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备编码"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceCode || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备所在位置"
        width="300px"
        align="center">
        <template slot-scope="scope">
          <span v-html="handleKeywords(scope.row.devicePosition, searchData.devicePosition)"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属项目"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.projectName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备安装时间"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deviceInstallTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备是否授权"
        align="center">
        <template slot-scope="scope">
          <span>{{!!scope.row.deviceLicenseKey ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
        align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="repairRecord(scope.row)"
            size="small">
            维修记录
          </el-button>
          <el-button
            type="text"
            @click="confirmRemove(scope.row.deviceId)"
            :disabled="!!scope.row.deviceLicenseKey || !adminReadable"
            size="small">
            删除
          </el-button>
          <el-button
            type="text"
            @click="printOne(scope.row)"
            size="small">
            打印二维码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :bean="pageBean"
      class="pagination"></pagination>
    <div class="bottom">
      <el-button size="mini" icon="el-icon-plus" :disabled="!adminReadable" type="primary" @click="add">新增设备</el-button>
      <el-button size="mini" icon="el-icon-printer" type="primary" @click="showPrint">打印二维码</el-button>
      <el-button size="mini" icon="el-icon-delete" :disabled="!adminReadable" type="danger" @click="removeAll">删除</el-button>
    </div>
    <el-dialog title="添加设备" :visible.sync="dialogFormVisible" width="520px">
      <el-form :model="deviceForm" style="width: 420px;" label-width="120px" ref="deviceForm" :rules="rules" class="add">
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="deviceForm.projectId" placeholder="请选择项目" filterable clearable>
            <el-option :label="item.projectName" :value="item.projectId" v-for="(item, key) in projectList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-select v-model="deviceForm.deviceTypeId" placeholder="设备类型" clearable>
            <el-option :label="item.parameterOption" :value="item.parameterId" v-for="(item, key) in dictionaries.deviceType" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="deviceForm.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备数量" prop="deviceNum">
          <el-input v-model="deviceForm.deviceNum" placeholder="请输入设备数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceSubmit" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {post} from '../../../common/js/http'
import {PAGE_SIZE, BASE_URL} from '../../../common/js/config'
import {dateFormat} from '../../../common/js/clazz'
import {adminReadableMixin, normalMixin} from '../../../common/js/mixin'
import $ from 'jquery'

export default {
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  mixins: [adminReadableMixin, normalMixin],
  data() {
    return {
      editableTabsValue: 'list',
      dateRange: [],
      searchData: {
        rowsNum: PAGE_SIZE,
        currentPage: 1,
        projectName: '',
        deviceName: '', // 设备名称
        deviceType: '', // 设备类型
        deviceCode: '', // 设备编码
        qrCodePrintStatus: '', // 二维码打印状态
        deviceRepairStatus: '', // 设备维修状态
        devicePosition: '', // 设备所在位置
        userIduserId: '', // 实施人员id
        startTime: '', // 安装开始时间
        endTime: '' // 安装结束时间
      },
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
      startTime: '',
      endTime: '',
      list: [],
      loading: false,
      pageBean: {},
      impList: [],
      dialogFormVisible: false,
      deviceForm: {
        projectId: '', // 项目id
        deviceTypeId: '', // 设备类型
        deviceTypeCode: '', // 设备类型编码
        deviceName: '', // 设备名称
        deviceNum: '', // 设备数量
        userId: '' // 当前登录用户id
      },
      rules: {
        projectId: [{
          required: true,
          message: '选择所属项目',
          trigger: 'change'
        }],
        deviceTypeId: [{
          required: true,
          message: '选择设备类型',
          trigger: 'change'
        }],
        deviceName: [{
          required: true,
          message: '请输入设备名称',
          trigger: 'change'
        }, {
          max: 20,
          message: '最多20个字符',
          trigger: 'change'
        }],
        deviceNum: [{
          required: true,
          message: '请输入设备数量',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[1-9][0-9]{0,3}$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入1~9999的数字'))
            }
          },
          trigger: 'change'
        }]
      },
      loading2: false,
      projectList: [],
      selections: []
    }
  },
  methods: {
    onSubmit() {
      this.searchData.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchData.projectName = ''
      this.searchData.deviceName = ''
      this.searchData.deviceType = ''
      this.searchData.deviceCode = ''
      this.searchData.qrCodePrintStatus = ''
      this.searchData.deviceRepairStatus = ''
      this.searchData.devicePosition = ''
      this.searchData.userIduserId = ''
      this.searchData.projectId = ''
      this.startTime = ''
      this.endTime = ''
      this.dateRange = []
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 20)
    },
    getList() {
      if (this.loading) return
      this.loading = true
      post('service/business/college/iccDevice/iccDevice/getDeviceList.xf', this.searchData).then(res => {
        this.loading = false
        this.list = res.result
        this.pageBean = res.pageBean
      }).catch(() => {
        this.loading = false
      })
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
    },
    getImpList() {
      post('service/business/college/iccUser/iccUser/getImpUserList.xf', {
        rowsNum: 9999,
        currentPage: 1
      }).then(res => {
        this.impList = res.result
      })
    },
    handleSelectionChange(selections) {
      this.selections = selections
    },
    repairRecord(row) {
      this.$router.push({
        name: 'repairRecord',
        query: {
          deviceCode: row.deviceCode
        }
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
    add() {
      this.dialogFormVisible = true
      setTimeout(() => {
        this.$refs.deviceForm.resetFields()
      }, 20)
    },
    deviceSubmit() {
      this.deviceForm.userId = this.uid
      this.$refs.deviceForm.validate().then(valid => {
        if (valid) {
          const index = this.dictionaries.deviceType.findIndex(item => item.parameterId === this.deviceForm.deviceTypeId)
          this.deviceForm.deviceTypeCode = this.dictionaries.deviceType[index].parameterCode
          this.loading2 = true
          post('service/business/college/iccDevice/iccDevice/saveDeviceInfo.xf', this.deviceForm).then(res => {
            this.loading2 = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => {
            this.loading2 = false
          })
        }
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
    remove(deviceIdStr) {
      this.fullLoading = this.$loading({
        lock: true
      })
      post('service/business/college/iccDevice/iccDevice/delDeviceInfo.xf', {
        userId: this.uid,
        deviceIdStr
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
    confirmRemove(id) {
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
    removeAll() {
      if (!this.selections.length) {
        this.noSelect()
        return
      }
      this.confirmRemove(this.selections.map(item => item.deviceId).join(','))
    },
    noSelect() {
      this.$message({
        type: 'warning',
        message: '未选中任何项'
      })
    },
    selectable(row) {
      return !row.deviceLicenseKey
    },
    getQrCode(row) {
      return `${BASE_URL}service/business/college/iccDevice/iccDevice/printQrCode.xf?deviceId=${row.deviceId}&_=${new Date().getTime()}`
    },
    showPrint() {
      if (!this.selections.length) {
        this.noSelect()
        return
      }
      this.doPrint(this.selections)
    },
    doPrint(arr) {
      $('#iframe').remove()
      $('body').append(`<iframe id="iframe" width="0px" height="0px" style="opacity: 0;position: fixed;"></iframe>`)
      setTimeout(() => {
        let dom = $(document.getElementById('iframe').contentWindow.document)
        arr.forEach(item => {
          dom.find('body').append(`<img src="${this.getQrCode(item)}" style="margin: 20px 0 0 110px;">`)
        })
        let imgNum = 0
        let error = false
        dom.find('img').on('load', () => {
          imgNum++
          if (imgNum >= arr.length) {
            document.getElementById('iframe').contentWindow.print()
          }
        }).on('error', () => {
          if (!error) {
            this.$alert('二维码加载失败', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                // action
              }
            })
            error = true
          }
        })
      }, 20)
    },
    printOne(row) {
      this.doPrint([row])
    }
  },
  watch: {
    startTime(newVal) {
      if (newVal) {
        this.searchData.startTime = dateFormat.call(newVal, 'yyyy-MM-dd hh:mm:ss')
      } else {
        this.searchData.startTime = ''
      }
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 300)
    },
    endTime(newVal) {
      if (newVal) {
        this.searchData.endTime = dateFormat.call(newVal, 'yyyy-MM-dd hh:mm:ss')
      } else {
        this.searchData.endTime = ''
      }
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 300)
    },
    dateRange(newVal, oldVal) {
      if (newVal.length) {
        this.searchData.startTime = dateFormat.call(newVal[0], 'yyyy-MM-dd')
        this.searchData.endTime = dateFormat.call(newVal[1], 'yyyy-MM-dd')
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
      this.searchData.currentPage = 1
      setTimeout(() => {
        this.getList()
      }, 20)
    },
    'searchData.projectId'(newVal, oldVal) {
      setTimeout(() => {
        this.getList()
      }, 20)
    },
    'searchData.deviceType'() {
      setTimeout(() => {
        this.getList()
      }, 20)
    },
    'searchData.userIduserId'() {
      setTimeout(() => {
        this.getList()
      }, 20)
    }
  },
  created() {
    this.getList()
    this.getImpList()
    this.getProjectList()
  }
}
</script>
<style scoped lang="scss">
  .demo-table-expand{
    .el-form-item{
      width: 50%;
      margin: 0;
    }
  }
  .pagination{
    text-align: center;
    margin: 20px 0;
  }
  .add .el-select{
    width: 100%;
  }
</style>
