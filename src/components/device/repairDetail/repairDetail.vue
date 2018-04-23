<template>
  <div class="repairDetail">
    <el-form label-position="left" inline class="table-expand">
      <el-form-item label="项目名称:">
        <span>{{ data.projectName || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="设备编码:">
        <span>{{ data.deviceCode || '--' }}</span>
      </el-form-item>
      <el-form-item label="设备类型:">
        <span>{{ data.parameterOption || '--' }}</span>
      </el-form-item>
      <el-form-item label="设备名称:">
        <span>{{ data.deviceName || '--' }}</span>
      </el-form-item>
      <el-form-item label="设备ID:">
        <span>{{ data.deviceId || '--'}}</span>
      </el-form-item>
      <el-form-item label="机器码:">
        <span>{{ data.deviceMachineCode || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="摆放位置:">
        <span>{{ data.devicePosition || '--' }}</span>
      </el-form-item>
      <el-form-item label="授权码:">
        <span>{{ data.deviceLicenseKey || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="实施人员:">
        <span>{{ data.repairProcesseName || '--' }}</span>
      </el-form-item>
      <el-form-item label="实施时间:">
        <span>{{ data.repairProcesseTime || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="处理结果:">
        <span>{{ data.repairProcesseResults === 1 ? '已处理' : '待处理' }}</span>
      </el-form-item>
      <el-form-item label="图片:" class="full">
        <span v-if="!files.length">--</span>
        <img :src="item.deviceFileUrl" v-img="item.deviceFileUrl" class="img" alt="图片" v-for="item in files" :key="item.deviceFileUrl">
      </el-form-item>
      <br>
      <el-form-item label="工单上传:">
        <span>{{ !!data.isHasFile ? '已上传' : '未上传' }}</span>
      </el-form-item>
      <el-form-item label="工单:">
        <img :src="data.isHasFile" alt="" v-if="data.isHasFile" class="img">
        <span v-if="!data.isHasFile">--</span>
      </el-form-item>
      <br>
      <el-form-item label="问题描述:">
        <span>{{ data.repairProblemDesc || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="处理方法:">
        <span>{{ data.repairProcesseMethod || '--' }}</span>
      </el-form-item>
      <br>
      <el-form-item label="客户联系人:">
        <span>{{ data.addressBooksContacts || '--' }}</span>
      </el-form-item>
      <el-form-item label="联系方式:">
        <span>{{ data.addressBooksContactsPhone || '--' }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'repair-detail',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    files: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
  @import '../../../common/style/variables';
  .repairDetail{
    padding-left: 20px;
    .table-expand {
      font-size: 0;
      label {
        color: $--color-label;
      }
      .el-form-item{
        margin-right: 40px;
      }
    }
    .img{
      width: 200px;
      display: inline-block;
    }
  }
</style>
