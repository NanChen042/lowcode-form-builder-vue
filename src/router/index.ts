import { createRouter, createWebHistory } from 'vue-router';

function getRouterBase() {
  if (typeof window === 'undefined') return '/';
  const envBase = import.meta.env.BASE_URL;
  if (envBase && envBase.startsWith('/') && envBase !== '/') {
    return envBase;
  }
  const path = window.location.pathname;
  let base = path.replace(/\/[^/]+\.html?$/i, '/').replace(/\/caller\/?$/i, '/');
  if (!base.endsWith('/')) {
    base += '/';
  }
  return base;
}

const router = createRouter({
  history: createWebHistory(getRouterBase()),
  routes: [
    {
      path: '/',
      name: 'Builder',
      component: () => import('@/views/BuilderView.vue')
    },
    {
      path: '/caller',
      name: 'Caller',
      component: () => import('@/views/CallerHostView.vue')
    }
  ]
});

export default router;

