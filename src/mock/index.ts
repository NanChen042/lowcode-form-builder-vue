import Mock from 'mockjs';
import type { FormSchema, ProfileType } from '@/types/schema';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate,
  createBlankTemplate,
  createRiskAssessmentTemplate
} from '@/templates/recommend';
import { generateFormId } from '@/core/store';

export const mockDatabase = new Map<string, FormSchema>();

function initMockDatabase() {
  const entTpl: FormSchema = JSON.parse(JSON.stringify(kycEntityTemplate));
  entTpl.meta.formId = 'ent_tpl_20261013_yl63';
  entTpl.meta.serialNo = 'ent_tpl_20261013_yl63';
  mockDatabase.set('ent_tpl_20261013_yl63', entTpl);

  const indDiy: FormSchema = JSON.parse(JSON.stringify(kycIndividualTemplate));
  indDiy.meta.formId = 'ind_diy_20261013_mvpr';
  indDiy.meta.serialNo = 'ind_diy_20261013_mvpr';
  mockDatabase.set('ind_diy_20261013_mvpr', indDiy);

  const cusTpl: FormSchema = JSON.parse(JSON.stringify(kycCustomerTemplate));
  cusTpl.meta.formId = 'cus_tpl_20261013_demo';
  cusTpl.meta.serialNo = 'cus_tpl_20261013_demo';
  mockDatabase.set('cus_tpl_20261013_demo', cusTpl);
}

initMockDatabase();

Mock.setup({
  timeout: '150-300'
});

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

  // 若为自建格式 ID (diy)，动态创建空白表单并持久化到 Mock 库（风险评估路由创建风险评估问卷，而非 KYC 空白模板）
  if (id.includes('_diy_')) {
    let pType: ProfileType = 'customer';
    if (id.startsWith('ent_')) pType = 'entity';
    else if (id.startsWith('ind_')) pType = 'individual';

    const isRiskRoute = window.location.pathname.includes('/risk') || new URLSearchParams(window.location.search).get('mode') === 'risk';
    const blank = isRiskRoute ? createRiskAssessmentTemplate(pType) : createBlankTemplate(pType);
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

Mock.mock(/\/pc\/form\/publish/, 'post', (options: any) => {
  let body: any = options.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {}
  }
  const formId = body?.schema?.meta?.formId || 'form_' + Date.now();
  const formTitle = (body?.schema?.meta?.title || '').trim();

  if (formTitle.includes('重名') || formTitle.includes('已存在') || formTitle.toLowerCase().includes('duplicate')) {
    return {
      code: 409,
      success: false,
      msg: '该表单名称已存在，请换一个名称',
      data: null
    };
  }

  return {
    code: 200,
    success: true,
    msg: '发布成功',
    data: {
      url: `https://app.algocandy.com/forms/published_${formId}`
    }
  };
});

Mock.mock(/\/pc\/user\/authInfo.*/, 'get', () => {
  return {
    code: 0,
    success: true,
    data: {
      user: {
        uid: 9527,
        nickname: 'SouthernWind',
        avatar: '',
        email: 'lizong@alpha-tech.io',
        org_id: 1024,
        company_name: '公司1',
        language: 'zh'
      }
    }
  };
});

export function matchMockRequest(_config?: any): any | null {
  return null;
}

export default Mock;
