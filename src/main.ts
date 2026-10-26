import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.css';

// 捕获动态路由异步 chunk 更新后 404 错误，自动无感刷新页面
window.addEventListener('vite:preloadError', () => {
  const reloadKey = '__fb_preload_reload__';
  const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
  if (Date.now() - lastReload > 10000) {
    sessionStorage.setItem(reloadKey, String(Date.now()));
    window.location.reload();
  }
});

// 仅在显式配置 VITE_USE_MOCK === 'true' 时加载 Mock 拦截，默认发起真实网络请求
if (import.meta.env.VITE_USE_MOCK === 'true') {
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
