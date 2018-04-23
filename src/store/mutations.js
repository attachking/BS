import * as types from './mutation-types'

const mutations = {
  [types.SET_STATUS](state, o) {
    state.status = o
  },
  [types.SET_CATEGORY](state, o) {
    state.category = o
  },
  [types.SET_UID](state, o) {
    state.uid = o
  },
  [types.SET_USER_ASSETS](state, o) {
    state.userAssets = o
  },
  [types.SET_ADMIN_ASSETS](state, o) {
    state.adminAssets = o
  },
  [types.SET_NICKNAME](state, o) {
    state.nickname = o
  },
  [types.SET_DICTIONARIES](state, o) {
    state.dictionaries = o
  },
  [types.SET_USER_TYPE](state, o) {
    state.userType = o
  }
}

export default mutations
