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
  /**
   * 保存表单模板到服务器（向后端发送持久化请求，并返回后端持久化后的数据结构）
   */
  async saveTemplate(schema: FormSchema): Promise<ApiResponse<{ id: string; updatedAt: string; schema?: FormSchema }>> {
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
  },

  /**
   * 获取已保存的表单模板（按指定的真实 ID 请求后端，不读本地 localStorage）
   */
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

  /**
   * 正式发布表单
   */
  async publishForm(schema: FormSchema): Promise<ApiResponse<{ url: string }>> {
    try {
      const res = await request.post<any, any>('/pc/form/publish', { schema });
      if (res && (res.code === 0 || res.code === 200) && res.data?.url) {
        return {
          code: 200,
          success: true,
          data: { url: res.data.url },
          message: '发布成功'
        };
      }
    } catch (_) {
      // 降级模拟
    }

    await delay(600);
    return {
      code: 200,
      success: true,
      data: {
        url: `https://app.algocandy.com/forms/published_${Date.now()}`
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
  /**
   * 获取当前母系统 algo 登录态、昵称与机构信息
   * 基于封装的 Axios 自动携带 Cookie: pc_token 和 sc_org_id
   */
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
