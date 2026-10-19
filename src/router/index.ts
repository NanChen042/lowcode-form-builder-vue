import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Builder',
      component: () => import('@/views/BuilderView.vue')
    },
    {
      path: '/form-builder',
      name: 'BuilderSubpath',
      component: () => import('@/views/BuilderView.vue')
    },
    {
      path: '/caller',
      name: 'Caller',
      component: () => import('@/views/CallerHostView.vue')
    },
    {
      path: '/form-builder/caller',
      name: 'CallerSubpath',
      component: () => import('@/views/CallerHostView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
});

export default router;

