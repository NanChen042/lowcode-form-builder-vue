import type { FormSchema, ProfileType } from '@/types/schema';

// 创建空白画布工厂函数 (自带第 1 页系统基础资料，支持指定母案例客户/个人/机构与表单名称、描述)
export function createBlankTemplate(
  profileType: ProfileType = 'customer',
  title = '',
  title_en = '',
  description = '',
  description_en = ''
): FormSchema {
  const normType = (profileType === 'client' || profileType === 'customer') ? 'customer' : profileType;
  const defaultMetaMap: Record<string, { title: string; desc: string }> = {
    customer: { title: 'SG_CDD_Customer(2026)', desc: '客户母案例专用KYC问卷' },
    client: { title: 'SG_CDD_Customer(2026)', desc: '客户母案例专用KYC问卷' },
    individual: { title: 'SG_CDD_Individual(2026)', desc: '个人成员专用KYC问卷' },
    entity: { title: 'SG_CDD_Entity(2026)', desc: '实体成员专用KYC问卷' }
  };
  const resolvedTitle = title || defaultMetaMap[normType]?.title || 'SG_CDD_Customer(2026)';
  const resolvedDesc = description || defaultMetaMap[normType]?.desc || '客户母案例专用KYC问卷';

  return {
    schemaVersion: '1.0.0',
    meta: {
      title: resolvedTitle,
      title_en: title_en || resolvedTitle,
      description: resolvedDesc,
      description_en: description_en || resolvedDesc,
      profileType: normType,
      source: 'diy'
    },
    pages: [
      {
        id: 'page_profile_0',
        pageType: 'system_profile',
        profileType: normType,
        showSkeleton: true,
        title: '基本资料',
        title_en: 'Basic Information',
        description: '',
        description_en: '',
        fields: []
      },
      {
        id: 'page_form_1',
        pageType: 'form',
        title: '第二页',
        title_en: 'Page 2',
        description: '',
        description_en: '',
        fields: []
      }
    ],
    pageConnections: []
  };
}

// 默认空白画布模板 (自带第 1 页系统基础资料，默认客户母案例)
export const blankTemplate: FormSchema = createBlankTemplate('customer');

// 1. 客户母案例 - KYC 表单 (SG_CDD_Customer(2026))
export const kycCustomerTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Customer(2026)',
    title_en: 'SG_CDD_Customer(2026)',
    description: '客户母案例专用KYC问卷',
    description_en: 'Dedicated KYC questionnaire for parent customer cases',
    profileType: 'customer',
    source: 'template',
    templateKey: 'kyc-customer'
  },
  pages: [
    {
      id: 'page_profile_cli',
      pageType: 'system_profile',
      profileType: 'customer',
      showSkeleton: true,
      title: '基本资料',
      title_en: 'Basic Information',
      description: '',
      description_en: '',
      fields: []
    },
    {
      id: 'page_kyc_cli_1',
      pageType: 'form',
      title: '第一部分：公司基本信息',
      title_en: 'Part 1: Corporate Information',
      description: '核实企业注册登记信息',
      description_en: 'Verify entity registration details',
      fields: [
        { id: 'cmp_101', type: 'input', label: '公司全称', label_en: 'Company Legal Name', key: 'input_101', required: true, placeholder: '请输入营业执照上的法定名称', placeholder_en: 'Enter registered enterprise legal name' },
        { id: 'cmp_102', type: 'input', label: '注册号码', label_en: 'Registration Number', key: 'input_102', required: true, placeholder: '请输入统一社会信用代码或注册号', placeholder_en: 'Enter unified credit / registration code' },
        { id: 'cmp_103', type: 'country', label: '注册国家', label_en: 'Country of Registration', key: 'country_103', required: true, placeholder: '请选择注册国家/地区', placeholder_en: 'Please select country' },
        { id: 'cmp_104', type: 'date', label: '成立日期', label_en: 'Date of Incorporation', key: 'date_104', dateType: 'date', dateMode: 'single', required: false, placeholder: '请选择成立日期', placeholder_en: 'Please select date of incorporation' },
        { id: 'cmp_105', type: 'textarea', label: '注册地址', label_en: 'Registered Address', key: 'textarea_105', required: true, placeholder: '请输入详细的注册地', placeholder_en: 'Please enter detailed registered address' }
      ]
    },
    {
      id: 'page_kyc_cli_2',
      title: '第二部分：授权代表及声明',
      title_en: 'Part 2: Authorized Proxy & Declarations',
      description: '企业指定法定授权人签名',
      description_en: 'Designated legal representative signature',
      fields: [
        {
          id: 'cmp_106',
          type: 'alert',
          label: '提示',
          label_en: 'Notice',
          key: 'alert_106',
          required: false,
          options: [
            { label: '您将作为以下公司的授权代表，完成KYC问卷填写。', label_en: 'You will complete the KYC survey as the authorized representative of the company.', value: 'opt_1' },
            { label: '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。', label_en: 'Please confirm if the information is accurate. If changes are needed, contact your provider before proceeding.', value: 'opt_2' }
          ]
        },
        { id: 'cmp_107', type: 'input', label: '授权代表姓名', label_en: 'Authorized Representative Name', key: 'input_107', required: true, placeholder: '法定代表人或被授权人', placeholder_en: 'Legal representative or authorized proxy' },
        {
          id: 'cmp_108',
          type: 'signature',
          label: '企业代表签署',
          label_en: 'Authorized Representative Signature',
          key: 'signature_108',
          showLabel: true,
          required: true,
          declarationRequired: true,
          options: [
            { label: '本人在此作为该实体的有效授权人，声明所有提交凭证均合规且受法律效力约束。', label_en: 'I hereby, as the valid authorized representative of the entity, declare that all submitted credentials comply with requirements and bear legal effect.', value: 'cli_dec_1' }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};

// 向后兼容别名导出
export const kycClientTemplate: FormSchema = kycCustomerTemplate;

// 2. 个人案例 - KYC 表单 (SG_CDD_Individual(2026))
export const kycIndividualTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Individual(2026)',
    title_en: 'SG_CDD_Individual(2026)',
    description: '个人成员专用KYC问卷',
    description_en: 'Dedicated KYC questionnaire for individual members',
    profileType: 'individual',
    source: 'template',
    templateKey: 'kyc-individual'
  },
  pages: [
    {
      id: 'page_profile_ind',
      pageType: 'system_profile',
      profileType: 'individual',
      showSkeleton: true,
      title: '基本资料',
      title_en: 'Basic Information',
      description: '',
      description_en: '',
      fields: []
    },
    {
      id: 'page_kyc_ind_1',
      pageType: 'form',
      title: '第一部分：个人身份信息',
      title_en: 'Part 1: Personal Identification',
      description: '请填写个人基本身份凭据',
      description_en: 'Please provide basic identity credentials',
      fields: [
        { id: 'cmp_1', type: 'input', label: '全名', label_en: 'Full Name', key: 'input_1', required: true, placeholder: '请填写与证件一致的姓名', placeholder_en: 'Please enter your full name as on ID' },
        { id: 'cmp_3', type: 'nationality', label: '国籍', label_en: 'Nationality', key: 'nationality_3', required: true, placeholder: '请选择国籍', placeholder_en: 'Please select nationality' },
        { id: 'cmp_4', type: 'date', label: '出生日期', label_en: 'Date of Birth', key: 'date_4', required: true, dateType: 'date', dateMode: 'single', placeholder: '请选择出生日期', placeholder_en: 'Please select date of birth' },
        { id: 'cmp_5', type: 'input', label: '证件号码', label_en: 'ID / Passport Number', key: 'input_5', required: true, placeholder: '请输入身份证或护照号', placeholder_en: 'Please enter ID or passport number' },
        { id: 'cmp_6', type: 'textarea', label: '居住地址', label_en: 'Residential Address', key: 'textarea_6', required: true, placeholder: '请输入详细的当前居住地址', placeholder_en: 'Please enter detailed residential address' }
      ]
    },
    {
      id: 'page_kyc_ind_2',
      title: '第二部分：职业与财务背景',
      title_en: 'Part 2: Professional & Financial Background',
      description: '收集您的就业及资金状况',
      description_en: 'Collect your employment and funding status',
      fields: [
        {
          id: 'cmp_7',
          type: 'select',
          label: '就业状态',
          label_en: 'Employment Status',
          key: 'select_7',
          required: true,
          placeholder: '请选择就业状态',
          placeholder_en: 'Please select employment status',
          defaultValue: '',
          options: [
            { label: '受雇', label_en: 'Employed', value: 'option_1' },
            { label: '自雇', label_en: 'Self-Employed', value: 'option_2' },
            { label: '退休', label_en: 'Retired', value: 'option_3' },
            { label: '无业', label_en: 'Unemployed', value: 'option_4' }
          ]
        },
        { id: 'cmp_8', type: 'input', label: '资金来源', label_en: 'Source of Funds', key: 'input_8', required: true, placeholder: '例如：工资、投资收益、储蓄', placeholder_en: 'e.g. Salary, Investments, Savings' },
        {
          id: 'cmp_9',
          type: 'radio',
          label: '预计年收入',
          label_en: 'Estimated Annual Income',
          key: 'radio_9',
          layout: 'stack',
          required: false,
          defaultValue: '',
          options: [
            { label: '低于 50,000 美元', label_en: 'Under $50,000', value: 'option_1' },
            { label: '50,000 - 100,000 美元', label_en: '$50,000 - $100,000', value: 'option_2' },
            { label: '高于 100,000 美元', label_en: 'Above $100,000', value: 'option_3' }
          ]
        }
      ]
    },
    {
      id: 'page_kyc_ind_3',
      title: '第三部分：声明',
      title_en: 'Part 3: Declarations',
      description: '请在确认各项条款后进行签名确认',
      description_en: 'Please review and confirm each clause with your signature',
      fields: [
        {
          id: 'cmp_10',
          type: 'signature',
          label: '客户声明',
          label_en: 'Client Declaration',
          key: 'signature_10',
          showLabel: true,
          required: true,
          declarationRequired: true,
          options: [
            { label: '本人特此声明，本表格中提供的所有信息均真实、完整且准确。', label_en: 'I hereby declare that all information provided in this form is true, complete and accurate.', value: 'dec_1' },
            { label: '本人已知悉并同意相关隐私政策和信息处理条款。', label_en: 'I acknowledge and agree to the relevant Privacy Policy and Data Processing Terms.', value: 'dec_2' }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};

// 3. 实体案例 - KYC 表单 (SG_CDD_Entity(2026))
export const kycEntityTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Entity(2026)',
    title_en: 'SG_CDD_Entity(2026)',
    description: '实体成员专用KYC问卷',
    description_en: 'Dedicated KYC questionnaire for entity members',
    profileType: 'entity',
    source: 'template',
    templateKey: 'kyc-entity'
  },
  pages: [
    {
      id: 'page_profile_ent',
      pageType: 'system_profile',
      profileType: 'entity',
      showSkeleton: true,
      title: '基本资料',
      title_en: 'Basic Information',
      description: '',
      description_en: '',
      fields: []
    },
    {
      id: 'page_kyc_ent_1',
      pageType: 'form',
      title: '第一部分：公司基本信息',
      title_en: 'Part 1: Corporate Information',
      description: '核实企业注册登记信息',
      description_en: 'Verify entity registration details',
      fields: [
        { id: 'cmp_20', type: 'input', label: '公司全称', label_en: 'Company Legal Name', key: 'input_20', required: true, placeholder: '请输入营业执照上的法定名称', placeholder_en: 'Enter registered enterprise legal name' },
        { id: 'cmp_22', type: 'input', label: '注册号码', label_en: 'Registration Number', key: 'input_22', required: true, placeholder: '请输入统一社会信用代码或注册号', placeholder_en: 'Enter unified credit / registration code' },
        { id: 'cmp_23', type: 'country', label: '注册国家', label_en: 'Country of Registration', key: 'country_23', required: true, placeholder: '请选择注册国家/地区', placeholder_en: 'Please select country' },
        { id: 'cmp_24', type: 'date', label: '成立日期', label_en: 'Date of Incorporation', key: 'date_24', dateType: 'date', dateMode: 'single', required: false, placeholder: '请选择成立日期', placeholder_en: 'Please select date of incorporation' },
        { id: 'cmp_25', type: 'textarea', label: '注册地址', label_en: 'Registered Address', key: 'textarea_25', required: true, placeholder: '请输入详细的注册地', placeholder_en: 'Please enter detailed registered address' }
      ]
    },
    {
      id: 'page_kyc_ent_2',
      title: '第二部分：授权代表及授权声明',
      title_en: 'Part 2: Authorized Proxy & Declarations',
      description: '企业指定法定授权人签名',
      description_en: 'Designated legal representative signature',
      fields: [
        {
          id: 'cmp_26',
          type: 'alert',
          label: '提示',
          label_en: 'Notice',
          key: 'alert_26',
          required: false,
          options: [
            { label: '您将作为以下公司的授权代表，完成KYC问卷填写。', label_en: 'You will complete the KYC survey as the authorized representative of the company.', value: 'opt_1' },
            { label: '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。', label_en: 'Please confirm if the information is accurate. If changes are needed, contact your provider before proceeding.', value: 'opt_2' }
          ]
        },
        { id: 'cmp_27', type: 'input', label: '授权代表姓名', label_en: 'Authorized Representative Name', key: 'input_27', required: true, placeholder: '法定代表人或被授权人', placeholder_en: 'Legal representative or authorized proxy' },
        {
          id: 'cmp_28',
          type: 'signature',
          label: '企业代表签署',
          label_en: 'Authorized Representative Signature',
          key: 'signature_28',
          showLabel: true,
          required: true,
          declarationRequired: true,
          options: [
            { label: '本人在此作为该实体的有效授权人，声明所有提交凭证均合规且受法律效力约束。', label_en: 'I hereby, as the valid authorized representative of the entity, declare that all submitted credentials comply with requirements and bear legal effect.', value: 'ent_dec_1' }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};
