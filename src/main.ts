import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import './style.css'
import App from './App.vue'

import { store } from './core/store'

const app = createApp(App)
app.use(ArcoVue)
;(window as any).__store = store

app.mount('#app')

