

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true,  /\.js$/)


// you do not need `import app from './modules/system/user.js'`
// it will auto require all vuex module from modules file
const modules  = modulesFiles.keys().reduce((modules, modulePath) => {

  // set '/system/user.js' => 'user'
  const moduleName = modulePath.replace(/(.*\/)*([^.]+).*/ig,"$2")

  const value = modulesFiles(modulePath)

  modules [moduleName] = value

  return modules
}, {})



export default  modules
