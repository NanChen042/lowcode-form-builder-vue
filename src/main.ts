import { createApp, type DirectiveBinding } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import './style.css'
import App from './App.vue'

import { store } from './core/store'

const app = createApp(App)
app.use(ArcoVue)
;(window as any).__store = store

// 注册全局指令 v-click-outside
app.directive('click-outside', {
  mounted(el: HTMLElement & { _clickOutside?: (e: MouseEvent) => void }, binding: DirectiveBinding) {
    el._clickOutside = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement & { _clickOutside?: (e: MouseEvent) => void }) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside)
      delete el._clickOutside
    }
  }
})

app.mount('#app')
