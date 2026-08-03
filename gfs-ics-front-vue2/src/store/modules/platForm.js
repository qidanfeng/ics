import API from '@/api'
const state = {
  client:null,
  clients:[],
  projects:[],
  warehouses:[],
  carriers:[],
  suppliers:[]
}

const mutations = {
  SET_CLIENT: (state, client) => {
    state.client = client
  },
  SET_CLIENTS: (state, clients) => {
    state.clients = clients
  },
  SET_PROJECTS: (state, projects) => {
    state.projects = projects
  },
  SET_WAREHOUSES: (state, warehouses) => {
    state.warehouses = warehouses
  },
  SET_CARRIERS: (state, carriers) => {
    state.carriers = carriers
  },
  SET_SUPPLIERS: (state, suppliers) => {
    state.suppliers = suppliers
  }
}

const actions = {
  setClient({ dispatch, commit }, client) {
    commit('SET_CLIENT', client)
  },
  setClients({ dispatch, commit }, clients) {
    commit('SET_CLIENTS', clients)
  },
  setProjects({ dispatch, commit }, projects) {
    commit('SET_PROJECTS', projects)
  },
  setWarehouses({ dispatch, commit }, warehouses) {
    commit('SET_WAREHOUSES', warehouses)
  },
  setCarriers({ dispatch, commit }, carriers) {
    commit('SET_CARRIERS', carriers)
  },
  setSuppliers({ dispatch, commit }, suppliers) {
    commit('SET_SUPPLIERS', suppliers)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
