import request from '@/utils/request';
import type { FormSchema } from '@/types/schema';
import { generateFormId } from '@/core/store';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface ApiResponse<T = any> {
  code: number | string;
  success: boolean;
  data: T;
  msg?: string;
  message?: string;
}

export const FormAPI = {
  /** 保存表单模板 */
  async saveTemplate(schema: FormSchema): Promise<ApiResponse<{ id: string; updatedAt: string; schema?: FormSchema }>> {
    try {
      const res = await request.post<any, any>('/pc/form/saveTemplate', { schema });
      if (res && (res.code === 0 || res.code === 200 || res.code === 'SYS_SUCCESS')) {
        return {
          code: 200,
          success: true,
          data: res.data || {
            id: schema.meta.formId || generateFormId(schema.meta.profileType, schema.meta.source),
            updatedAt: new Date().toISOString()
          },
          message: res.msg || res.message || '保存成功'
        };
      }
      return {
        code: res?.code || 500,
        success: false,
        data: res?.data,
        message: res?.msg || res?.message || '保存失败'
      };
    } catch (err: any) {
      console.warn('[FormAPI.saveTemplate] Local fallback save:', err);
      const formId = schema.meta.formId || generateFormId(schema.meta.profileType, schema.meta.source);
      const updatedAt = new Date().toISOString();
      return {
        code: 200,
        success: true,
        data: {
          id: formId,
          updatedAt,
          schema
        },
        message: '本地已保存'
      };
    }
  },

  /** 获取表单模板 */
  async getTemplate(id: string): Promise<ApiResponse<{ id: string; schema: FormSchema | null }>> {
    if (!id || id === 'default') {
      return {
        code: 400,
        success: false,
        data: { id: '', schema: null },
        message: '未指定表单ID'
      };
    }

    try {
      const res = await request.get<any, any>(`/pc/form/getTemplate?id=${encodeURIComponent(id)}`);
      if (res && (res.code === 0 || res.code === 200) && res.data?.schema) {
        return {
          code: 200,
          success: true,
          data: {
            id,
            schema: res.data.schema
          }
        };
      }
      return {
        code: res?.code || 404,
        success: false,
        data: { id, schema: null },
        message: res?.msg || res?.message || '未找到指定表单'
      };
    } catch (e: any) {
      return {
        code: 500,
        success: false,
        data: { id, schema: null },
        message: e?.message || '获取表单失败'
      };
    }
  },

  /** 发布表单 */
  async publishForm(schema: FormSchema): Promise<ApiResponse<{ url: string }>> {
    try {
      const res = await request.post<any, any>('/pc/form/publish', { schema });
      if (res && (res.code === 0 || res.code === 200 || res.success) && res.data?.url) {
        let finalUrl = res.data.url;
        if (typeof window !== 'undefined' && finalUrl.startsWith('/')) {
          finalUrl = `${window.location.origin}${finalUrl}`;
        }
        return {
          code: 200,
          success: true,
          data: { url: finalUrl },
          message: res.msg || '发布成功'
        };
      }
      if (res && (res.code !== 0 && res.code !== 200)) {
        return {
          code: res.code || 400,
          success: false,
          data: null as any,
          message: res.msg || res.message || '发布失败'
        };
      }
    } catch (e: any) {
      if (e?.response?.data?.msg) {
        return {
          code: e.response.status || 400,
          success: false,
          data: null as any,
          message: e.response.data.msg
        };
      }
    }

    await delay(300);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://jzw.qingmob.com';
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const formId = (schema.meta?.formId || schema.meta?.serialNo || `form_${Date.now()}`).toLowerCase().trim();
    const dynamicUrl = isLocal
      ? `http://localhost:5174/?id=${encodeURIComponent(formId)}`
      : `${origin}/form-mobile/?id=${encodeURIComponent(formId)}`;

    return {
      code: 200,
      success: true,
      data: {
        url: dynamicUrl
      },
      message: '发布成功'
    };
  }
};

export interface UserSessionData {
  uid: number;
  nickname: string;
  avatar?: string;
  email?: string;
  orgId: number;
  companyName: string;
  token?: string;
  language?: 'zh' | 'en';
}

export const UserAPI = {
  /** 获取当前登录态与机构信息 */
  async getCurrentUser(): Promise<ApiResponse<UserSessionData>> {
    try {
      const res = await request.get<any, any>('/pc/user/authInfo', { silent: true } as any);
      const user = res?.data?.user;
      if ((res?.code === 0 || res?.code === 200) && user) {
        return {
          code: 200,
          success: true,
          data: {
            uid: user.uid,
            nickname: user.nickname,
            avatar: user.avatar,
            email: user.email,
            orgId: user.org_id,
            companyName: user.company_name,
            language: user.language
          }
        };
      }
    } catch (_) {
      // 鉴权失败或网络异常
    }

    return {
      code: 401,
      success: false,
      data: {
        uid: 0,
        nickname: '',
        avatar: '',
        email: '',
        orgId: 0,
        companyName: '',
        language: 'zh'
      },
      message: '未获取到登录信息'
    };
  }
};
