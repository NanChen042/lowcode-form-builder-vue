import type { FormSchema } from '@/types/schema';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  data: T;
  message?: string;
}

export const FormAPI = {
  /**
   * 保存表单模板到服务器（Mock API）
   */
  async saveTemplate(schema: FormSchema): Promise<ApiResponse<{ id: string; updatedAt: string }>> {
    await delay(600);
    localStorage.setItem('mock_db_schema', JSON.stringify(schema));
    return {
      code: 200,
      success: true,
      data: {
        id: 'form_' + Date.now(),
        updatedAt: new Date().toISOString()
      },
      message: '保存成功'
    };
  },

  /**
   * 获取已保存的表单模板
   */
  async getTemplate(id = 'default'): Promise<ApiResponse<{ id: string; schema: FormSchema | null }>> {
    await delay(300);
    const localData = localStorage.getItem('mock_db_schema');
    const schema = localData ? (JSON.parse(localData) as FormSchema) : null;
    return {
      code: 200,
      success: true,
      data: {
        id,
        schema
      }
    };
  },

  /**
   * 正式发布表单
   */
  async publishForm(_schema: FormSchema): Promise<ApiResponse<{ url: string }>> {
    await delay(800);
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
