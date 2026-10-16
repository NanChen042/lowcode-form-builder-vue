import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.css';
// 仅在开发环境或显式开启时动态加载 Mock 拦截，避免生产构建引入 eval 与冗余体积
if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true') {
  await import('./mock');
}
import router from './router';
import App from './App.vue';

import { store } from './core/store';

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
if (import.meta.env.DEV) {
  ;(window as any).__store = store;
}

app.mount('#app');
