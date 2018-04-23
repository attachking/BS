import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// 路由组件懒加载,每个路由组件单独生成一个js,需要时通过创建script标签引入,需要配置webpack的output.chunkFilename
// import(url)返回的是一个Promise对象实例
const login = () => import('../components/login/login.vue')
const search = () => import('../components/search/search-dialog.vue')
const shopping = () => import('../components/shopping/shopping.vue')
const manage = () => import('../components/manage/manage.vue')
const order = () => import('../components/manage/order/order.vue')
const invoice = () => import('../components/manage/invoice/invoice.vue')
const password = () => import('../components/manage/password/password.vue')
const admin = () => import('../components/admin/admin.vue')
const mechanism = () => import('../components/admin/mechanism/mechanism.vue')
const platform = () => import('../components/admin/platform/platform.vue')
const user = () => import('../components/admin/user/user.vue')
const role = () => import('../components/admin/role/role.vue')
const dictionary = () => import('../components/admin/dictionary/dictionary.vue')
const adminOrder = () => import('../components/admin/order/order.vue')
const corporation = () => import('../components/admin/corporation/corporation.vue')
const dataview = () => import('../components/admin/dataview/dataview.vue')
const resources = () => import('../components/admin/resources/resources.vue')
const myself = () => import('../components/manage/myself/myself.vue')
const issues = () => import('../components/knowledge/issues/issues.vue')
const department = () => import('../components/admin/department/department.vue')
const customer = () => import('../components/project/customer/customer.vue') // 客户维护
const maintain = () => import('../components/project/maintain/maintain.vue') // 项目维护
const deviceMaintain = () => import('../components/device/deviceMaintain/deviceMaintain.vue') // 设备维护
const repairRecord = () => import('../components/device/repairRecord/repairRecord.vue') // 设备维护
const monitor = () => import('../components/device/monitor/monitor.vue') // 设备监控

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      name: 'search',
      component: search
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: shopping
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage,
      children: [{
        path: 'order',
        name: 'order',
        component: order,
        meta: {category: 1}
      }, {
        path: 'invoice',
        name: 'invoice',
        component: invoice,
        meta: {category: 1}
      }, {
        path: 'password',
        name: 'password',
        component: password,
        meta: {category: 1}
      }, {
        path: 'myself',
        name: 'myself',
        component: myself,
        meta: {category: 1}
      }]
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children: [{
        path: 'mechanism',
        name: 'mechanism',
        component: mechanism,
        meta: {category: 2}
      }, {
        path: 'platform',
        name: 'platform',
        component: platform,
        meta: {category: 2}
      }, {
        path: 'user',
        name: 'user',
        component: user,
        meta: {category: 2}
      }, {
        path: 'role',
        name: 'role',
        component: role,
        meta: {category: 2}
      }, {
        path: 'dictionary',
        name: 'dictionary',
        component: dictionary,
        meta: {category: 2}
      }, {
        path: 'password',
        name: 'adminPassword',
        component: password,
        meta: {category: 2}
      }, {
        path: 'order',
        name: 'adminOrder',
        component: adminOrder,
        meta: {category: 2}
      }, {
        path: 'corporation',
        name: 'corporation',
        component: corporation,
        meta: {category: 2}
      }, {
        path: 'dataview',
        name: 'dataview',
        component: dataview,
        meta: {category: 2}
      }, {
        path: 'resources',
        name: 'resources',
        component: resources,
        meta: {category: 2}
      }, {
        path: 'issues',
        name: 'issues',
        component: issues,
        meta: {category: 2}
      }, {
        path: 'department',
        name: 'department',
        component: department,
        meta: {category: 2}
      }, {
        path: 'customer',
        name: 'customer',
        component: customer,
        meta: {category: 2}
      }, {
        path: 'maintain',
        name: 'maintain',
        component: maintain,
        meta: {category: 2}
      }, {
        path: 'deviceMaintain',
        name: 'deviceMaintain',
        component: deviceMaintain,
        meta: {category: 2}
      }, {
        path: 'repairRecord',
        name: 'repairRecord',
        component: repairRecord,
        meta: {category: 2}
      }, {
        path: 'monitor',
        name: 'monitor',
        component: monitor,
        meta: {category: 2}
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const status = store.state.status
  if (to.name !== 'login' && !status) {
    next({
      name: 'login'
    })
  } else if (to.matched.some(record => typeof record.meta.category !== 'undefined' && record.meta.category !== store.state.category)) {
    next({
      name: store.state.category === 1 ? 'myself' : 'dataview'
    })
  } else {
    next(true)
  }
})

export default router
