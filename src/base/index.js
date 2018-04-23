import pagination from './pagination/pagination.vue'
import growNum from './grow-num/grow-num.vue'

let components = [
  pagination,
  growNum
]

export default {
  install(Vue) {
    components.forEach(item => {
      Vue.component(item.name, item)
    })
  }
}
