import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/styles/css/index.css'
import 'element-plus/dist/index.css'
// import { WayUIPlugins } from 'way-ui'

import 'virtual:svg-icons-register'

import '@/assets/styles/scss/index.scss'
import App from './App.vue'
import router from './router'
// import './permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(WayUIPlugins)

app.mount('#app')
