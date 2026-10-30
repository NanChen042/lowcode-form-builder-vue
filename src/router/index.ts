import { createRouter, createWebHistory } from 'vue-router';
import BuilderView from '@/views/BuilderView.vue';
import { store } from '@/core/store';
import { UserAPI } from '@/core/api';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Builder',
      component: BuilderView
    },
    {
      path: '/form-builder',
      name: 'BuilderSubpath',
      component: BuilderView
    },
    {
      path: '/risk',
      name: 'RiskBuilder',
      component: BuilderView
    },
    {
      path: '/form-builder/risk',
      name: 'RiskBuilderSubpath',
      component: BuilderView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
});

// PC 端与 Algo 母系统互通：登录态强校验前置守卫
router.beforeEach(async (to, _from, next) => {
  // 1. 显式调试参数 (bypass_auth=1) 直接放行
  if (to.query.bypass_auth === '1') {
    return next();
  }

  // 2. 环境判定：本地开发调试环境 (localhost / 127.0.0.1 / DEV 模式) 不做强阻断重定向
  const isLocalDev =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.')));

  // 3. 如果 URL 携带 Token 参数，自动写入 Store 供全局请求透传
  const queryToken = (to.query.token || to.query.pc_token) as string | undefined;
  if (queryToken && queryToken.trim() && !store.user.token) {
    store.user.token = queryToken.trim();
  }

  // 4. 当前会话中已持有经过验真的合法 UID，直接放行
  if (store.user.isLoggedIn && store.user.uid > 0) {
    return next();
  }

  // 5. 调用 Algo 现有接口 /pc/user/authInfo 发起验真请求
  try {
    const res = await UserAPI.getCurrentUser();
    if (res.success && res.data && res.data.uid > 0) {
      // 验真成功：将用户与机构信息存入全局 Store
      store.user.isLoggedIn = true;
      store.user.uid = res.data.uid;
      store.user.nickname = res.data.nickname || store.user.nickname;
      store.user.avatar = res.data.avatar || store.user.avatar;
      store.user.email = res.data.email || store.user.email;
      store.org.orgId = res.data.orgId || store.org.orgId;
      store.org.companyName = res.data.companyName || store.org.companyName;

      if (res.data.language && !to.query.lang) {
        store.currentLocale = res.data.language;
      }

      return next();
    }
  } catch (error) {
    console.warn('[AuthGuard] 鉴权请求异常:', error);
  }

  // 6. 本地开发环境：即使未登录或未连接后端，也优雅放行，不影响本地设计与调试
  if (isLocalDev) {
    return next();
  }

  // 7. 仅在正式服务器环境：验真不通过 (未登录或 Token 失效) 时坚决阻断进入，直接跳转到 Algo 登录页
  if (typeof window !== 'undefined') {
    window.location.href = '/pc/login/';
  }
});

export default router;
