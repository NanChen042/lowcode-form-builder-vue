import axios, { type AxiosInstance } from 'axios';
import { Message } from '@arco-design/web-vue';
import { store } from '@/core/store';

// 统一标准 API 响应结构 (对齐 algo 规范: { code, msg, data })
export interface ApiResponse<T = any> {
  code: number | string;
  msg?: string;
  message?: string;
  data: T;
  success?: boolean;
}

// 创建统一 Axios 单例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  adapter: 'xhr',
  // 必须开启跨域携带凭证，确保 Cookie 中的 pc_token 与 sc_org_id 自动传递给 algo 后端
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest' // 告知 algo 后端当前为 AJAX 请求
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 1. 如果 store 中有外部注入的 token，附加到 Header 作为兜底鉴权
    if (store.user.token) {
      config.headers['token'] = store.user.token;
      config.headers['Authorization'] = `Bearer ${store.user.token}`;
    }

    // 2. 携带当前机构 ID (如果已识别)
    if (store.org.orgId) {
      config.headers['X-Org-Id'] = String(store.org.orgId);
    }

    // 3. 携带当前界面语言
    config.headers['Accept-Language'] = store.currentLocale === 'en' ? 'en-US,en;q=0.9' : 'zh-CN,zh;q=0.9';

    return config;
  },
  error => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

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
          content: res.msg || '登录已过期，请重新登录',
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
    const errMsg = res.msg || res.message || '操作失败';
    console.warn('[API Business Warning]', res.code, errMsg);

    return res;
  },
  error => {
    console.error('[Response Error]', error);

    // 如果配置了 silent，静默处理，不弹窗打扰用户
    if (error.config?.silent) {
      return Promise.reject(error);
    }

    let errorMsg = '网络连接异常，请检查网络';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMsg = '请求参数错误 (400)';
          break;
        case 401:
          errorMsg = '登录已失效，请重新登录 (401)';
          break;
        case 403:
          errorMsg = '拒绝访问，没有权限 (403)';
          break;
        case 404:
          errorMsg = '请求的资源不存在 (404)';
          break;
        case 500:
          errorMsg = '服务器内部错误 (500)';
          break;
        case 502:
        case 503:
        case 504:
          errorMsg = '服务器响应超时或服务暂时不可用 (502/503)';
          break;
        default:
          errorMsg = `请求失败 (${status})`;
          break;
      }
    } else if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      errorMsg = '请求超时，请检查网络后重试';
    } else if (error.message && error.message.includes('Network Error')) {
      errorMsg = '网络连接失败，请检查网络连接';
    }

    Message.error({
      content: errorMsg,
      duration: 3000
    });

    return Promise.reject(error);
  }
);

export default service;
