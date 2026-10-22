import axios, { type AxiosInstance } from 'axios';
import { Message } from '@arco-design/web-vue';
import { store } from '@/core/store';
import { t } from '@/core/i18n';

export interface ApiResponse<T = any> {
  code: number | string;
  msg?: string;
  message?: string;
  data: T;
  success?: boolean;
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  adapter: 'xhr',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    if (store.user.token) {
      config.headers['token'] = store.user.token;
      config.headers['Authorization'] = `Bearer ${store.user.token}`;
    }

    if (store.org.orgId) {
      config.headers['X-Org-Id'] = String(store.org.orgId);
    }

    config.headers['Accept-Language'] = store.currentLocale === 'en' ? 'en-US,en;q=0.9' : 'zh-CN,zh;q=0.9';

    return config;
  },
  error => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

function getNetworkErrorMessage(error: any): string {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return t('api.error400');
      case 401:
        return t('api.error401');
      case 403:
        return t('api.error403');
      case 404:
        return t('api.error404');
      case 500:
        return t('api.error500');
      case 502:
      case 503:
      case 504:
        return t('api.error502');
      default:
        return t('api.errorFailed', undefined, { status });
    }
  }

  if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
    return t('api.errorTimeout');
  }

  if (error.message && error.message.includes('Network Error')) {
    return t('api.errorNetwork');
  }

  return t('api.errorDefault');
}

// 响应拦截器
service.interceptors.response.use(
  (response: any): any => {
    const res = response.data;

    // 如果返回的不是标准 JSON (例如重定向的 HTML 页面)，视为成功返回或特殊处理
    if (typeof res !== 'object' || res === null) {
      return response.data;
    }

    // algo 规范：code 为 0 或 200 或 "SYS_SUCCESS" 均视为业务成功
    const isSuccess =
      res.code === 0 ||
      res.code === 200 ||
      res.code === '0' ||
      res.code === 'SYS_SUCCESS';

    if (isSuccess) {
      return res;
    }

    // 登录态失效拦截
    if (res.code === 2008 || res.code === 'ACCOUNT_BANNING' || res.code === 401) {
      if (!response.config?.silent) {
        Message.warning({
          content: res.msg || t('api.error401'),
          duration: 2500
        });
      }
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.top) {
          window.top.location.href = '/pc/login/';
        }
      }, 1500);
      return Promise.reject(new Error(res.msg || 'Unauthorized'));
    }

    // 业务错误统一轻量提示
    const errMsg = res.msg || res.message || t('api.operationFailed');
    console.warn('[API Business Warning]', res.code, errMsg);

    return res;
  },
  error => {
    console.error('[Response Error]', error);

    // 如果配置了 silent，静默处理，不弹窗打扰用户
    if (error.config?.silent) {
      return Promise.reject(error);
    }

    const errorMsg = getNetworkErrorMessage(error);

    Message.error({
      content: errorMsg,
      duration: 3000
    });

    return Promise.reject(error);
  }
);

export default service;
