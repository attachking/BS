import {mapGetters} from 'vuex'

// manage.vue和admin.vue的mixin
export const manageMixin = {
  data() {
    return {
      isCollapse: false,
      active: ''
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.active = newVal.path
    }
  },
  created() {
    this.active = this.$route.path
  }
}

// 判断用户读写权限的mixin
export const adminReadableMixin = {
  computed: {
    ...mapGetters([
      'adminAssets',
      'userType'
    ]),
    adminReadable: {
      get() {
        if (this.userType === 2) return true
        for (let i = 0; i < this.adminAssets.length; i++) {
          if (this.adminAssets[i].url === this.$route.path && this.adminAssets[i].readable === 1) {
            return true
          }
          for (let j = 0; j < this.adminAssets[i].children.length; j++) {
            if (this.adminAssets[i].children[j].url === this.$route.path && this.adminAssets[i].children[j].readable === 1) {
              return true
            }
          }
        }
        return false
      }
    }
  }
}

// 包含一些通用方法的mixin
export const normalMixin = {
  methods: {
    handleKeywords(str, keywords) {
      if (!str) return '--'
      if (keywords) {
        return str.replace(new RegExp(keywords, 'g'), `<span style="color: red;">${keywords}</span>`)
      } else {
        return str
      }
    },
    noSelect() {
      this.$message({
        type: 'warning',
        message: '未选中任何项'
      })
    }
  }
}
