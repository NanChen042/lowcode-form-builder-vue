import { createRouter, createWebHistory } from 'vue-router';
import BuilderView from '@/views/BuilderView.vue';
import CallerHostView from '@/views/CallerHostView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Builder',
      component: BuilderView
    },
    {
      path: '/caller',
      name: 'Caller',
      component: CallerHostView
    }
  ]
});

export default router;
