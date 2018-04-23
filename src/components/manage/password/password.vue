<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane
        label="修改密码"
        name="list"
      >
      </el-tab-pane>
    </el-tabs>
    <el-form class="user_password" :label-position="labelPosition" :rules="rules" label-width="120px"
             :model="formLabelAlign" ref="ruleForm2">
      <el-form-item label="请输入原密码" prop="oldPassword">
        <el-input v-model="formLabelAlign.oldPassword" placeholder="请输入原密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newPassword">
        <el-input v-model="formLabelAlign.newPassword" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="请确认新密码" prop="newPassword2">
        <el-input v-model="formLabelAlign.newPassword2" placeholder="请确认新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')" :loading="loading">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {post} from '../../../common/js/http'

export default {
  computed: {
    ...mapGetters([
      'uid',
      'category'
    ])
  },
  data() {
    let _this = this
    return {
      editableTabsValue: 'list',
      labelPosition: 'right',
      formLabelAlign: {
        userId: this.uid,
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      loading: false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'change'
          }
        ],
        newPassword: [{
          required: true,
          message: '请输入新密码',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (/^[a-zA-Z0-9]{6,15}$/.test(value)) {
              callback()
            } else {
              callback(new Error('密码格式数字或字母，6~15位'))
            }
          },
          trigger: 'change'
        }],
        newPassword2: [{
          required: true,
          message: '请再次输入新密码',
          trigger: 'change'
        }, {
          validator(rule, value, callback) {
            if (_this.formLabelAlign.newPassword === value) {
              callback()
            } else {
              callback(new Error('两次密码输入不一致'))
            }
          },
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.formLabelAlign.userId = this.uid
          this.formLabelAlign.userType = this.category
          post('service/business/college/iccUser/iccUser/savePwd.xf', this.formLabelAlign).then(res => {
            this.loading = false
            if (res.error.result === 1) {
              this.$alert(res.error.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.resetForm(formName)
                }
              })
            } else {
              this.$message.error(res.error.message)
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
  .user_password {
    width: 500px;
  }
</style>
