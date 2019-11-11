import Vue from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { loginUser, getUserProfile, updateUserProfile, getUserOrg, updateUserOrg, getUserOrgMembers, removeUser, getApps } from '@/api/server'

const state = {
  token: getToken(),
  role: null,
  profile: {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    isDemo: true
  },
  org: {
    id: '',
    organizationName: '',
    organizationDescription: '',
    maxDevCount: null
  },
  orgMembers: [],
  orgApps: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_USER_NAME: (state, userName) => {
    state.profile.userName = userName
  },
  SET_FIRST_NAME: (state, firstName) => {
    state.profile.firstName = firstName
  },
  SET_LAST_NAME: (state, lastName) => {
    state.profile.lastName = lastName
  },
  SET_EMAIL: (state, email) => {
    state.profile.email = email
  },
  SET_IS_DEMO: (state, isDemo) => {
    state.profile.isDemo = isDemo
  },
  SET_ORG_ID: (state, id) => {
    state.org.id = id
  },
  SET_ORG_NAME: (state, organizationName) => {
    state.org.organizationName = organizationName
  },
  SET_ORG_DESC: (state, organizationDescription) => {
    state.org.organizationDescription = organizationDescription
  },
  SET_ORG_MAX_DEV_COUNT: (state, maxDevCount) => {
    state.org.maxDevCount = maxDevCount
  },
  SET_ORG_MEMBERS: (state, orgMembers) => {
    Vue.set(state, 'orgMembers', orgMembers)
  },
  SET_ORG_MEMBER: (state, orgMember) => {
    const index = state.orgMembers.findIndex(member => member.email === orgMember.email)
    if (index !== -1) {
      const existingOrgMember = state.orgMembers[index]
      Vue.set(state.orgMembers, index, { ...existingOrgMember, ...orgMember })
    } else {
      Vue.set(state, 'orgMembers', [orgMember, ...state.orgMembers])
    }
  },
  REMOVE_ORG_MEMBER: (state, orgMember) => {
    const index = state.orgMembers.findIndex(member => member.email === orgMember.email)
    if (index !== -1) {
      Vue.delete(state.orgMembers, index)
    }
  },
  SET_ORG_APPS: (state, orgApps) => {
    Vue.set(state, 'orgApps', orgApps)
  }
}

const actions = {
  loginUser({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      loginUser({ email: email.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserProfile({ commit }) {
    return new Promise((resolve, reject) => {
      getUserProfile().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_USER_NAME', response.data.user_name)
        commit('SET_FIRST_NAME', response.data.firstName)
        commit('SET_LAST_NAME', response.data.lastName)
        commit('SET_EMAIL', response.data.email)
        commit('SET_IS_DEMO', response.data.isDemo)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUserProfile({ commit }, profile) {
    return new Promise((resolve, reject) => {
      updateUserProfile(profile).then(response => {
        commit('SET_USER_NAME', response.data.user_name)
        commit('SET_FIRST_NAME', response.data.firstName)
        commit('SET_LAST_NAME', response.data.lastName)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserOrg({ commit }) {
    return new Promise((resolve, reject) => {
      getUserOrg().then(response => {
        commit('SET_ORG_ID', response.data.id)
        commit('SET_ORG_NAME', response.data.organizationName)
        commit('SET_ORG_DESC', response.data.organizationDescription)
        commit('SET_ORG_MAX_DEV_COUNT', response.data.maxDevCount)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUserOrg({ commit }, org) {
    return new Promise((resolve, reject) => {
      updateUserOrg(org).then(response => {
        commit('SET_ORG_NAME', response.data.organizationName)
        commit('SET_ORG_DESC', response.data.organizationDescription)
        commit('SET_ORG_MAX_DEV_COUNT', response.data.maxDevCount)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserOrgMembers({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserOrgMembers().then(response => {
        const userEmail = state.profile.email
        const orgMembers = response.data.data
        commit('SET_ORG_MEMBERS', orgMembers)
        commit('SET_ROLE', orgMembers.find(member => member.email === userEmail).type)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserOrgMember({ commit }, member) {
    commit('SET_ORG_MEMBER', member)
  },

  removeUserOrgMember({ commit }, member) {
    return new Promise((resolve, reject) => {
      removeUser(member.email).then(response => {
        commit('REMOVE_ORG_MEMBER', member)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserOrgApps({ commit, state }) {
    return new Promise((resolve, reject) => {
      getApps().then(response => {
        console.log(response)
        const apps = response.data.apps
        commit('SET_ORG_APPS', apps)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  logoutUser({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', null)
      dispatch('permission/resetRoutes', null, { root: true })
      removeToken()
      resetRouter()
      resolve()
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
