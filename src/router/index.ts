import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

