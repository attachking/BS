<template>
  <div class="issues-edit">
    <el-form :model="form" label-width="120px" ref="form" :rules="rules">
      <el-form-item label="标题" prop="knowledgeHead">
        <el-input type="text" v-model="form.knowledgeHead" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="knowledgeKeyword">
        <el-input type="text" v-model="form.knowledgeKeyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="问题类别" prop="knowledgeType">
        <el-select v-model="form.knowledgeType" placeholder="请选择问题类别" clearable>
          <el-option :label="item.parameterOption" :value="item.parameterId" v-for="(item, key) in dictionaries.issuesType" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="knowledgeDesc">
        <el-input type="textarea" v-model="form.knowledgeDesc" placeholder="请输入问题描述" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
      <el-form-item label="解决方法" prop="knowledgeMethod">
        <el-input type="textarea" v-model="form.knowledgeMethod" placeholder="请输入解决方法" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload
          class="upload-demo"
          :data="{fileSize: 10000}"
          :action="actionUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">选择附件进行上传，最多选择3个</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import E from 'wangeditor'
import {BASE_URL} from '../../../../common/js/config'
import {post} from '../../../../common/js/http'
import {mapGetters} from 'vuex'

export default {
  name: 'issues-edit',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid',
      'dictionaries'
    ])
  },
  data() {
    return {
      actionUrl: BASE_URL + 'service/business/college/iccKnowledge/iccDeviceFile/uploadAttachment.xf',
      form: {
        userId: '', // 当前登录人id
        knowledgeId: '', // 知识id
        knowledgeHead: '', // 标题
        knowledgeKeyword: '', // 关键字
        knowledgeType: '', // 类型id
        knowledgeDesc: '', // 描述
        knowledgeMethod: '', // 解决方法
        deviceFileUrl: '', // 文件url
        deviceFileType: 2,
        deviceFileName: '' // 文件名称
      },
      rules: {
        knowledgeHead: [{
          required: true,
          message: '请输入问题标题',
          trigger: 'change'
        }, {
          max: 50,
          message: '最多不超过50个字符',
          trigger: 'change'
        }],
        knowledgeKeyword: [{
          required: true,
          message: '请输入关键字',
          trigger: 'change'
        }, {
          max: 50,
          message: '最多不超过50个字符',
          trigger: 'change'
        }],
        knowledgeType: [{
          required: true,
          message: '请选择问题类别',
          trigger: 'change'
        }],
        knowledgeDesc: [{
          required: true,
          message: '请输入问题描述',
          trigger: 'change'
        }, {
          max: 200,
          message: '最多不超过200个字符',
          trigger: 'change'
        }],
        knowledgeMethod: [{
          required: true,
          message: '请输入解决方法',
          trigger: 'change'
        }, {
          max: 2000,
          message: '最多不超过2000个字符',
          trigger: 'change'
        }]
      },
      fileList: [],
      loading: false
    }
  },
  watch: {
    data(newVal, oldVal) {
      this.form.knowledgeId = newVal.knowledgeId || ''
      this.form.knowledgeHead = newVal.knowledgeHead || ''
      this.form.knowledgeKeyword = newVal.knowledgeKeyword || ''
      this.form.knowledgeType = newVal.knowledgeType || ''
      this.form.knowledgeMethod = newVal.knowledgeMethod || ''
      this.form.knowledgeDesc = newVal.knowledgeDesc || ''
      this.form.deviceFileUrl = newVal.deviceFileUrl || ''
      this.form.deviceFileName = newVal.deviceFileName || ''
      this.fileList = newVal.fileList.map(item => {
        return {
          name: item.deviceFileName,
          url: item.deviceFileUrl
        }
      })
    }
  },
  methods: {
    /*
    initEditor() {
      this.wangEditor = new E(this.$refs['wang'])
      // 自定义菜单配置
      this.wangEditor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      this.wangEditor.customConfig.uploadImgServer = BASE_URL + 'service/business/college/content/content/picUpload'
      this.wangEditor.customConfig.uploadFileName = 'image'
      this.wangEditor.customConfig.customAlert = function (info) {
        // info 是需要提示的内容
        // '图片上传出错'
      }
      this.wangEditor.customConfig.uploadImgHooks = {
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          const url = result.result[0]
          insertImg(url)
          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      this.wangEditor.create()
    }
    */
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSuccess(res, file, fileList) {
      if (res.error.result === 1) {
        file.url = res.result
      } else {
        this.$message({
          showClose: false,
          message: res.error.message,
          type: 'warning'
        })
      }
      setTimeout(() => {
        this.fileList = fileList
      }, 20)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      if (this.isInvalid(file.name)) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    beforeUpload(file) {
      if (!this.isInvalid(file.name)) {
        this.$message({
          type: 'warning',
          message: '只能选择图片或文档类文件'
        })
        return Promise.reject(new Error('只能选择图片或文档类文件'))
      }
    },
    isInvalid(name) {
      return /\.(png|jpe?g|gif|svg|txt|docx?|xlsx?|pptx?)(\?.*)?$/.test(name)
    },
    onSubmit() {
      this.form.userId = this.uid
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loading = true
          let obj = Object.assign({}, this.form)
          /*
          for (let i in obj) {
            obj[i] = encodeURIComponent(obj[i])
          }
          */
          obj.deviceFileUrl = JSON.stringify(this.fileList.map(item => item.url)).replace(/\\+/g, '\\')
          obj.deviceFileName = JSON.stringify(this.fileList.map(item => item.name)).replace(/\\+/g, '\\')
          post('service/business/college/iccKnowledge/iccKnowledge/saveKnowledgeInfo.xf', obj).then(res => {
            this.loading = false
            if (res.error.result === 1) {
              this.$message({
                type: 'success',
                message: res.error.message
              })
              this.$emit('success')
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    }
  },
  mounted() {
    // this.initEditor()
  }
}
</script>
<style scoped lang="scss">
  .wangeditor{
    width: 800px;
  }
  .el-form{
    width: 550px;
    .el-select{
      width: 100%;
    }
  }
</style>
