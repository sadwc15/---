import { createApp } from 'vue'  // 需要导入 reactive

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import directive from './directive'// 引入自定义指令（权限控制）

// 引入图标
import plugins from './plugins' // plugins
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { download } from '@/utils/request'



// 引入工具类
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from "@/utils/form"

// 引入全局组件
import Pagination from './components/Pagination/index.vue'
import RightToolbar from './components/RightToolbar/index.vue'
import ImagePreview from './components/ImagePreview/index.vue'
import ImageUpload from './components/ImageUpload/index.vue'

// 引入 Pinia
import { createPinia } from 'pinia'

// 1. 先创建 app 实例
const app = createApp(App)

// 2. 创建并使用 Pinia
const pinia = createPinia()
app.use(pinia)


app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.download = download
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 注册全局组件
app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)
app.component('ImagePreview', ImagePreview)
app.component('ImageUpload', ImageUpload)


app.use(router)
app.use(plugins)
app.use(ElementPlus)


directive(app)
app.mount('#app')
