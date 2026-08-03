const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  permissions: state => state.permission.permissions,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  client: state =>state.platForm.client,
  projects: state =>state.platForm.projects,
  warehouses: state =>state.platForm.warehouses,
  carriers: state =>state.platForm.carriers,
  suppliers: state =>state.platForm.suppliers
}
export default getters
