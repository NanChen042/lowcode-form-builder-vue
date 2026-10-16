import Mock from 'mockjs';
import type { FormSchema, ProfileType } from '@/types/schema';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate,
  createBlankTemplate
} from '@/templates/recommend';
import { generateFormId } from '@/core/store';

// 规范内存数据库，绝不向客户端 localStorage 写入 Schema
export const mockDatabase = new Map<string, FormSchema>();

// 初始化 Mock 数据库预设模板
function initMockDatabase() {
  // 1. 实体成员专用KYC模板
  const entTpl: FormSchema = JSON.parse(JSON.stringify(kycEntityTemplate));
  entTpl.meta.formId = 'ent_tpl_20261013_yl63';
  entTpl.meta.serialNo = 'ent_tpl_20261013_yl63';
  mockDatabase.set('ent_tpl_20261013_yl63', entTpl);

  // 2. 个人自建表单
  const indDiy: FormSchema = JSON.parse(JSON.stringify(kycIndividualTemplate));
  indDiy.meta.formId = 'ind_diy_20261013_mvpr';
  indDiy.meta.serialNo = 'ind_diy_20261013_mvpr';
  mockDatabase.set('ind_diy_20261013_mvpr', indDiy);

  // 3. 客户母案例模板
  const cusTpl: FormSchema = JSON.parse(JSON.stringify(kycCustomerTemplate));
  cusTpl.meta.formId = 'cus_tpl_20261013_demo';
  cusTpl.meta.serialNo = 'cus_tpl_20261013_demo';
  mockDatabase.set('cus_tpl_20261013_demo', cusTpl);
}

initMockDatabase();

// 设置 Mock 响应延时，模拟真实服务器网络环境
Mock.setup({
  timeout: '150-300'
});

/**
 * 1. Mock 保存表单接口: POST /pc/form/saveTemplate
 */
Mock.mock(/\/pc\/form\/saveTemplate/, 'post', (options: any) => {
  let body: any = options.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {}
  }

  const schema: FormSchema = body?.schema;
  if (!schema) {
    return {
      code: 400,
      success: false,
      msg: '保存失败：缺少表单数据结构 (schema)'
    };
  }

  // 服务端确认/生成唯一 ID 与持久化时间
  const formId = (schema.meta?.formId || generateFormId(schema.meta?.profileType, schema.meta?.source)).toLowerCase();
  const updatedAt = new Date().toISOString();

  const savedSchema: FormSchema = JSON.parse(JSON.stringify(schema));
  savedSchema.meta.formId = formId;
  savedSchema.meta.serialNo = formId;
  savedSchema.meta.updatedAt = updatedAt;

  // 持久化到 Mock 服务端数据库
  mockDatabase.set(formId, savedSchema);

  return {
    code: 200,
    success: true,
    msg: '保存成功',
    data: {
      id: formId,
      serialNo: formId,
      updatedAt,
      schema: savedSchema
    }
  };
});

/**
 * 2. Mock 查询表单接口: GET /pc/form/getTemplate?id=xxx
 */
Mock.mock(/\/pc\/form\/getTemplate.*/, 'get', (options: any) => {
  const url = options.url || '';
  let id = '';
  const match = url.match(/[?&]id=([^&]+)/);
  if (match) {
    id = decodeURIComponent(match[1]).toLowerCase().trim();
  }

  if (!id || id === 'default') {
    return {
      code: 400,
      success: false,
      msg: '未提供有效表单 ID',
      data: null
    };
  }

  // 优先在 Mock 数据库中检索
  if (mockDatabase.has(id)) {
    return {
      code: 200,
      success: true,
      data: {
        id,
        schema: JSON.parse(JSON.stringify(mockDatabase.get(id)!))
      }
    };
  }

  // 若为模板格式 ID，动态加载模板并持久化到 Mock 库
  if (id.includes('_tpl_')) {
    let tplSource: FormSchema = kycCustomerTemplate;
    if (id.startsWith('ent_')) tplSource = kycEntityTemplate;
    else if (id.startsWith('ind_')) tplSource = kycIndividualTemplate;

    const clone = JSON.parse(JSON.stringify(tplSource));
    clone.meta.formId = id;
    clone.meta.serialNo = id;
    mockDatabase.set(id, clone);
    return {
      code: 200,
      success: true,
      data: {
        id,
        schema: clone
      }
    };
  }

  // 若为自建格式 ID (diy)，动态创建空白表单并持久化到 Mock 库
  if (id.includes('_diy_')) {
    let pType: ProfileType = 'customer';
    if (id.startsWith('ent_')) pType = 'entity';
    else if (id.startsWith('ind_')) pType = 'individual';

    const blank = createBlankTemplate(pType);
    blank.meta.formId = id;
    blank.meta.serialNo = id;
    mockDatabase.set(id, blank);
    return {
      code: 200,
      success: true,
      data: {
        id,
        schema: blank
      }
    };
  }

  return {
    code: 404,
    success: false,
    msg: `表单模板 [${id}] 不存在或已被删除`,
    data: null
  };
});

/**
 * 3. Mock 发布表单接口: POST /pc/form/publish
 */
Mock.mock(/\/pc\/form\/publish/, 'post', (options: any) => {
  let body: any = options.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {}
  }
  const formId = body?.schema?.meta?.formId || 'form_' + Date.now();
  return {
    code: 200,
    success: true,
    msg: '发布成功',
    data: {
      url: `https://app.algocandy.com/forms/published_${formId}`
    }
  };
});

/**
 * 4. Mock 母系统当前用户信息: GET /pc/user/getUserInfo
 */
Mock.mock(/\/pc\/user\/getUserInfo.*/, 'get', () => {
  return {
    code: 200,
    success: true,
    data: {
      uid: 9527,
      nickname: 'SouthernWind',
      avatar: '',
      email: 'lizong@alpha-tech.io',
      org_id: 1024,
      company_name: '公司1',
      language: 'zh'
    }
  };
});

export function matchMockRequest(_config?: any): any | null {
  return null;
}

export default Mock;
