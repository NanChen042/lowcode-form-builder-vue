import type { FormSchema, ProfileType, ProfileFieldItem } from '@/types/schema';

export const presetCustomerProfileFields: ProfileFieldItem[] = [
  { label: '企业注册全称', label_en: 'Company Name', value: 'Algo Global Trading Pte. Ltd.', skeletonWidth: '65%' },
  { label: '统一机构识别码 (UEN)', label_en: 'UEN', value: '202319827K', skeletonWidth: '40%' },
  { label: '注册设立国家', label_en: 'Country of Incorporation', value: '新加坡 / Singapore', skeletonWidth: '30%' },
  { label: '法律实体形式', label_en: 'Entity Type', value: '私人豁免有限公司 / Private Limited Company', skeletonWidth: '45%' },
  { label: '授权代表姓名', label_en: 'Authorized Representative', value: 'Alexander Tan (陈建国)', skeletonWidth: '35%' },
  { label: '官方联络邮箱', label_en: 'Contact Email', value: 'compliance@algocandy.com', skeletonWidth: '55%' },
  { label: '企业注册地址', label_en: 'Registered Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' }
];

export const presetIndividualProfileFields: ProfileFieldItem[] = [
  { label: '姓名', label_en: 'Name', value: '陈建国 (Alexander Tan)', skeletonWidth: '40%' },
  { label: '国籍语言姓名', label_en: 'Native Name', value: '陈建国', skeletonWidth: '30%' },
  { label: '国籍', label_en: 'Nationality', value: '新加坡 / Singapore', skeletonWidth: '25%' },
  { label: '新加坡身份类型', label_en: 'Singapore Identity Status', value: '公民 / Citizen', skeletonWidth: '30%' },
  { label: 'NRIC/FIN(如适用)', label_en: 'NRIC/FIN', value: 'S****123A', skeletonWidth: '35%' },
  { label: '证件类型', label_en: 'ID Type', value: '护照 / Passport', skeletonWidth: '25%' },
  { label: '证件号码', label_en: 'ID Number', value: 'E98765432', skeletonWidth: '40%' },
  { label: '出生日期', label_en: 'Date of Birth', value: '1985-06-15', skeletonWidth: '35%' },
  { label: '性别', label_en: 'Gender', value: '男 / Male', skeletonWidth: '20%' },
  { label: '手机号码', label_en: 'Mobile Phone', value: '+65 91234567', skeletonWidth: '45%' },
  { label: '电子邮箱', label_en: 'Email', value: 'alex.tan@example.com', skeletonWidth: '50%' },
  { label: '居住地址', label_en: 'Residential Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' }
];

export const presetEntityProfileFields: ProfileFieldItem[] = [
  { label: '企业注册全称', label_en: 'Company Name', value: 'Algo Global Holdings Ltd.', skeletonWidth: '65%' },
  { label: '统一机构识别码 (UEN)', label_en: 'UEN', value: '202100888E', skeletonWidth: '40%' },
  { label: '注册设立国家', label_en: 'Country of Incorporation', value: '新加坡 / Singapore', skeletonWidth: '30%' },
  { label: '法律实体形式', label_en: 'Entity Type', value: '私人豁免有限公司 / Private Limited Company', skeletonWidth: '45%' },
  { label: '授权代表姓名', label_en: 'Authorized Representative', value: 'Alexander Tan (陈建国)', skeletonWidth: '35%' },
  { label: '官方联络邮箱', label_en: 'Contact Email', value: 'contact@algoholdings.com', skeletonWidth: '55%' },
  { label: '企业注册地址', label_en: 'Registered Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' }
];

// 创建空白画布工厂函数
export function createBlankTemplate(
  profileType: ProfileType = 'customer',
  title = '',
  title_en = '',
  description = '',
  description_en = ''
): FormSchema {
  const normType = (profileType === 'client' || profileType === 'customer') ? 'customer' : profileType;
  const defaultMetaMap: Record<string, { title: string; desc: string }> = {
    customer: { title: 'SG_CDD_Customer', desc: '' },
    client: { title: 'SG_CDD_Customer', desc: '' },
    individual: { title: 'SG_CDD_Individual', desc: '' },
    entity: { title: 'SG_CDD_Entity', desc: '' }
  };
  const resolvedTitle = title || defaultMetaMap[normType]?.title || 'SG_CDD_Customer';
  const resolvedDesc = description || '';

  const defaultFields = normType === 'individual'
    ? presetIndividualProfileFields
    : (normType === 'entity' ? presetEntityProfileFields : presetCustomerProfileFields);

  return {
    schemaVersion: '1.0.0',
    meta: {
      title: resolvedTitle,
      title_en: title_en || resolvedTitle,
      description: resolvedDesc,
      description_en: description_en || '',
      profileType: normType,
      enabledLocales: ['zh', 'en'],
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
        fields: [],
        profileFields: defaultFields
      },
      {
        id: 'page_form_1',
        pageType: 'form',
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        fields: []
      }
    ],
    pageConnections: []
  };
}

// 默认空白画布模板
export const blankTemplate: FormSchema = createBlankTemplate('customer');

// 风险评估固定回答选项：Yes 为命中风险项
export const RISK_FIXED_OPTIONS = [
  { label: 'Yes', label_en: 'Yes', value: 'yes' },
  { label: 'No', label_en: 'No', value: 'no' },
  { label: 'Not Applicable', label_en: 'Not Applicable', value: 'na' }
];

// 创建风险评估表单工厂函数（单页形式，分客户/个人/实体，带权重 1-10）
export function createRiskAssessmentTemplate(
  profileType: ProfileType = 'customer',
  title = '',
  title_en = '',
  description = '',
  description_en = ''
): FormSchema {
  const normType = (profileType === 'client' || profileType === 'customer') ? 'customer' : profileType;
  const defaultMetaMap: Record<string, { title: string; pageTitle: string; pageTitleEn: string; pageDesc: string; pageDescEn: string }> = {
    customer: {
      title: 'SG_Risk_Customer',
      pageTitle: '客户与主体风险因素',
      pageTitleEn: 'Client / Principal Risk Factors',
      pageDesc: '设置本表单的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    individual: {
      title: 'SG_Risk_Individual',
      pageTitle: '个人成员风险因素',
      pageTitleEn: 'Individual Member Risk Factors',
      pageDesc: '设置个人成员的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure individual risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    entity: {
      title: 'SG_Risk_Entity',
      pageTitle: '实体机构风险因素',
      pageTitleEn: 'Corporate Entity Risk Factors',
      pageDesc: '设置实体机构的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure corporate entity risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    }
  };

  const metaPreset = defaultMetaMap[normType] || defaultMetaMap.customer;
  const resolvedTitle = title || metaPreset.title;
  const cloneRiskOpts = () => RISK_FIXED_OPTIONS.map(o => ({ ...o }));

  const questionsMap: Record<string, Array<{ id: string; key: string; label: string; label_en: string; weight: number }>> = {
    customer: [
      {
        id: 'risk_q_1',
        key: 'risk_is_new_client',
        label: '该客户是否为新建立业务关系的客户？',
        label_en: 'Is the client a new client?',
        weight: 1
      },
      {
        id: 'risk_q_2',
        key: 'risk_nominee_directors_shareholders',
        label: '客户是否使用挂名董事或挂名股东？',
        label_en: 'Does the client use nominee directors or shareholders?',
        weight: 1
      },
      {
        id: 'risk_q_3',
        key: 'risk_complex_ownership_structure',
        label: '结合客户业务性质，其股权或控制权结构是否显得异常或过度复杂？',
        label_en: "Does the ownership structure appear unusual or overly complex given the nature of the client's business?",
        weight: 2
      },
      {
        id: 'risk_q_4',
        key: 'risk_cash_intensive_business',
        label: '客户业务是否属于现金密集型行业？',
        label_en: "Is the client's business cash intensive?",
        weight: 1
      },
      {
        id: 'risk_q_5',
        key: 'risk_high_risk_jurisdiction',
        label: '客户注册地、主要运营地或资金来源是否涉及高风险或受制裁国家/地区？',
        label_en: 'Does the client have operations or source of funds connected to high-risk or sanctioned jurisdictions?',
        weight: 3
      },
      {
        id: 'risk_q_6',
        key: 'risk_non_face_to_face',
        label: '与客户的业务关系是否在完全非面对面（无可靠电子身份核验）的情况下建立？',
        label_en: 'Was the business relationship established on a non-face-to-face basis without reliable electronic verification?',
        weight: 1
      }
    ],
    individual: [
      {
        id: 'risk_ind_1',
        key: 'risk_ind_pep_status',
        label: '该个人是否为政要人物（PEP）或其直系亲属、密切关联人？',
        label_en: 'Is the individual a Politically Exposed Person (PEP), or a family member or close associate of a PEP?',
        weight: 3
      },
      {
        id: 'risk_ind_2',
        key: 'risk_ind_adverse_media',
        label: '该个人是否存在任何洗钱、恐怖融资、欺诈或金融犯罪相关的负面新闻或制裁记录？',
        label_en: 'Is there any adverse media, sanctions, or enforcement record related to AML/CFT or financial crime against this individual?',
        weight: 3
      },
      {
        id: 'risk_ind_3',
        key: 'risk_ind_high_risk_country',
        label: '该个人的国籍或常住国家/地区是否属于高风险司法管辖区（如 FATF 灰/黑名单）？',
        label_en: 'Is the individual a national or resident of a high-risk jurisdiction (e.g., FATF grey/black list)?',
        weight: 2
      },
      {
        id: 'risk_ind_4',
        key: 'risk_ind_unverified_wealth',
        label: '该个人的财富来源或资金来源是否难以合理解释或缺乏证明文件？',
        label_en: "Is the individual's source of wealth or source of funds unclear or difficult to corroborate?",
        weight: 2
      }
    ],
    entity: [
      {
        id: 'risk_ent_1',
        key: 'risk_ent_shell_or_bearer_shares',
        label: '该实体是否可发行不记名股票（Bearer Shares）或属于无实质经营的空壳公司？',
        label_en: 'Is the entity capable of issuing bearer shares or operating as a shell company without substantive business?',
        weight: 2
      },
      {
        id: 'risk_ent_2',
        key: 'risk_ent_nominee_arrangement',
        label: '该实体是否存在代持安排、家族信托或多层离岸架构导致最终受益人（UBO）难以穿透识别？',
        label_en: 'Does the entity involve nominee arrangements, trusts, or multi-layered offshore structures that obscure the UBO?',
        weight: 2
      },
      {
        id: 'risk_ent_3',
        key: 'risk_ent_sanctioned_country',
        label: '该实体的注册国家/地区或母公司所在地是否位于高风险或受监管重点关注司法管辖区？',
        label_en: 'Is the entity incorporated or controlled from a high-risk or monitored jurisdiction?',
        weight: 2
      },
      {
        id: 'risk_ent_4',
        key: 'risk_ent_adverse_screening',
        label: '该实体或其关联控制人是否命中监管处罚、诉讼或反洗钱负面筛查记录？',
        label_en: 'Has the entity or its controllers matched any regulatory enforcement, litigation, or AML screening records?',
        weight: 3
      }
    ]
  };

  const presetQuestions = questionsMap[normType] || questionsMap.customer;

  return {
    schemaVersion: '1.0.0',
    meta: {
      title: resolvedTitle,
      title_en: title_en || resolvedTitle,
      description: description || '',
      description_en: description_en || '',
      profileType: normType,
      formType: 'risk',
      enabledLocales: ['zh', 'en'],
      source: 'diy'
    },
    pages: [
      {
        id: 'page_risk_0',
        pageType: 'form',
        title: metaPreset.pageTitle,
        title_en: metaPreset.pageTitleEn,
        description: metaPreset.pageDesc,
        description_en: metaPreset.pageDescEn,
        fields: presetQuestions.map(q => ({
          id: q.id,
          type: 'checkbox',
          label: q.label,
          label_en: q.label_en,
          key: q.key,
          required: true,
          showLabel: true,
          layout: 'inline',
          maxSelections: 1,
          weight: q.weight,
          options: cloneRiskOpts()
        }))
      }
    ],
    pageConnections: []
  };
}

// 1. 客户案例 KYC 模板
export const kycCustomerTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Customer',
    title_en: 'SG_CDD_Customer',
    description: '',
    description_en: '',
    profileType: 'customer',
    enabledLocales: ['zh', 'en'],
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
      fields: [],
      profileFields: presetCustomerProfileFields
    },
    {
      id: 'page_kyc_cus_biz',
      pageType: 'form',
      title: '业务信息',
      title_en: 'Business Information',
      description: '请提供公司核心业务及经营状况',
      description_en: 'Please provide core business activities and operations',
      fields: [
        {
          id: 'cmp_cus_biz_desc',
          type: 'textarea',
          label: '公司主营业务说明',
          label_en: 'Company Main Business Description',
          key: 'textarea_biz_desc',
          required: true,
          showLabel: true,
          placeholder: '请简述公司业务范围及经营模式。',
          placeholder_en: 'Please briefly describe company business scope and operating model.'
        },
        {
          id: 'cmp_cus_sales_vol',
          type: 'select',
          label: '年销售额规模',
          label_en: 'Annual Sales Turnover',
          key: 'select_sales_vol',
          required: true,
          showLabel: true,
          placeholder: '请选择',
          placeholder_en: 'Please select',
          options: [
            { label: '100万 – 500万', label_en: 'SGD 1,000,000 – 5,000,000', value: 'sgd_1m_5m' },
            { label: '10万 – 100万', label_en: 'SGD 100,000 – 1,000,000', value: 'sgd_100k_1m' },
            { label: '10万以下', label_en: 'Below SGD 100,000', value: 'sgd_under_100k' },
            { label: '500万以上', label_en: 'Above SGD 5,000,000', value: 'sgd_above_5m' }
          ]
        },
        {
          id: 'cmp_cus_funds_src',
          type: 'select',
          label: '资金来源',
          label_en: 'Source of Funds',
          key: 'select_funds_src',
          required: true,
          showLabel: true,
          placeholder: '请选择',
          placeholder_en: 'Please select',
          options: [
            { label: '出资/股权投入', label_en: 'Capital / Equity Contribution', value: 'equity' },
            { label: '个人储蓄', label_en: 'Personal Savings', value: 'savings' },
            { label: '公司间资金/借贷', label_en: 'Intercompany Funds / Loan', value: 'intercompany' },
            { label: '其他', label_en: 'Other', value: 'other' },
            { label: '银行贷款', label_en: 'Bank Loan', value: 'bank_loan' },
            { label: '营业收入', label_en: 'Operating Revenue', value: 'revenue' },
            { label: '资产出售(如商业地产、机器设备等)', label_en: 'Asset Sales (e.g. Real Estate, Machinery)', value: 'asset_sale' }
          ]
        },
        {
          id: 'cmp_cus_major_clients',
          type: 'country',
          label: '主要客户所在国家/地区',
          label_en: 'Major Customer Countries / Regions',
          key: 'country_major_clients',
          required: true,
          showLabel: true,
          multiple: true,
          maxSelections: 3,
          placeholder: '请选择',
          placeholder_en: 'Please select'
        },
        {
          id: 'cmp_cus_major_suppliers',
          type: 'country',
          label: '主要供应商所在国家/地区',
          label_en: 'Major Supplier Countries / Regions',
          key: 'country_major_suppliers',
          required: true,
          showLabel: true,
          multiple: true,
          maxSelections: 3,
          placeholder: '请选择',
          placeholder_en: 'Please select'
        },
        {
          id: 'cmp_cus_website',
          type: 'input',
          label: '公司官网、网店或社交媒体主页链接(如有)',
          label_en: 'Company Website, Online Store or Social Media Link (If any)',
          key: 'input_company_website',
          required: false,
          showLabel: true,
          placeholder: '请输入',
          placeholder_en: 'Please enter'
        },
        {
          id: 'cmp_cus_is_listed',
          type: 'radio',
          label: '是否是上市公司',
          label_en: 'Is it a Listed Company?',
          key: 'radio_is_listed',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_cus_stock_code',
          type: 'input',
          label: '股票代码(如适用)',
          label_en: 'Stock Code (If applicable)',
          key: 'input_stock_code',
          required: false,
          showLabel: true,
          placeholder: '请输入股票代码(如适用)',
          placeholder_en: 'Please enter stock code (if applicable)',
          dependsOn: {
            fieldKey: 'radio_is_listed',
            value: 'yes'
          }
        }
      ]
    },
    {
      id: 'page_kyc_cus_sign',
      pageType: 'form',
      title: '声明及签名',
      title_en: 'Declaration & Signature',
      description: '请在确认各项条款后进行签名确认',
      description_en: 'Please review and confirm each clause with your signature',
      fields: [
        {
          id: 'cmp_cus_signature',
          type: 'signature',
          label: '声明及签名',
          label_en: 'Declaration & Signature',
          key: 'signature_cus_main',
          showLabel: false,
          required: true,
          declarationRequired: true,
          placeholder: '请在下方指定区域签名：',
          placeholder_en: 'Please sign in the designated area below:',
          options: [
            {
              label: '本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。',
              label_en: 'I hereby declare that the company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBO) in accordance with relevant requirements, without any form of concealment, omission or avoidance.',
              value: 'dec_ubo_disclosure'
            },
            {
              label: '本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。',
              label_en: 'I confirm that I have been duly authorized by the company or entity to complete and submit this questionnaire, documents and declarations on its behalf. I hereby declare that all information, documents and declarations provided above are true, accurate and complete. I acknowledge that any false, misleading representation or deliberate concealment of material facts may result in legal liability, including criminal liability.',
              value: 'dec_auth_truth'
            }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};

// 向后兼容别名导出
export const kycClientTemplate: FormSchema = kycCustomerTemplate;

// 2. 个人案例 KYC 模板
export const kycIndividualTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Individual',
    title_en: 'SG_CDD_Individual',
    description: '',
    description_en: '',
    profileType: 'individual',
    enabledLocales: ['zh', 'en'],
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
      fields: [],
      profileFields: presetIndividualProfileFields,
      relation: {
        title: '关联信息',
        title_en: 'Relationship Information',
        entityLabel: '关联实体',
        entityLabel_en: 'Associated Entity',
        typeLabel: '关联类型',
        typeLabel_en: 'Relationship Type',
        motherName: 'Algo Global Trading Pte. Ltd.',
        relationships: ['董事', '股东', '最终受益人'],
        relationships_en: ['Director', 'Shareholder', 'Ultimate Beneficial Owner']
      },
      capitalTitle: '股份与出资信息',
      capitalTitle_en: 'Shareholding & Capital Info',
      capitalList: [
        {
          currency: 'SGD',
          shareType: '普通股',
          shareType_en: 'Ordinary Shares',
          shareClassLabel: '股份类别',
          shareClassLabel_en: 'Share Class',
          sharesHeld: '10,000',
          sharesHeldLabel: '持有股份数',
          sharesHeldLabel_en: 'Shares Held',
          shareRatio: '25.00%',
          paidUpAmount: '10,000.00 SGD',
          paidUpAmountLabel: '对应已缴股本金额',
          paidUpAmountLabel_en: 'Allocated Paid-up Capital'
        }
      ]
    },
    {
      id: 'page_kyc_ind_ubo',
      pageType: 'form',
      title: '最终受益所有人(UBO)',
      title_en: 'Ultimate Beneficial Owner (UBO)',
      description: '请确认是否属于最终受益所有人',
      description_en: 'Please confirm whether you are an Ultimate Beneficial Owner (UBO)',
      fields: [
        {
          id: 'cmp_ind_ubo_note',
          type: 'alert',
          label: '提示',
          label_en: 'Note',
          key: 'alert_ubo_note',
          required: false,
          showLabel: true,
          content: '- 如果某一名自然人 直接或间接持有公司 25% 以上的股份，或 对公司拥有 重大影响力或实际控制权 (即使不持股)，该自然人应被视为公司的 最终受益所有人(UBO)。',
          content_en: "- If an individual directly or indirectly holds more than 25% of the company's shares, or has significant influence or actual control over the company (even without shareholding), that individual should be deemed an Ultimate Beneficial Owner (UBO) of the company."
        },
        {
          id: 'cmp_ind_ubo_q1',
          type: 'radio',
          label: '个人是否持有公司超过25%的股份？',
          label_en: "Does the individual hold more than 25% of the company's shares?",
          key: 'radio_ubo_q1',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_ubo_q2',
          type: 'radio',
          label: '个人在公司中是否拥有显著的控制权？',
          label_en: 'Does the individual have significant control over the company?',
          key: 'radio_ubo_q2',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        }
      ]
    },
    {
      id: 'page_kyc_ind_pep',
      pageType: 'form',
      title: 'PEP声明',
      title_en: 'PEP Declaration',
      description: '政治公众人物及关联人士身份确认',
      description_en: 'Politically Exposed Persons & Associates Confirmation',
      fields: [
        {
          id: 'cmp_ind_pep_note',
          type: 'alert',
          label: '提示',
          label_en: 'Note',
          key: 'alert_pep_note',
          required: false,
          showLabel: true,
          content: '政治公众人物（PEP）是指目前或曾经在新加坡、其他国家或国际组织中担任重要公共职务的人士，通常包括：\n- 国家元首或政府首脑（如总统、总理）\n- 高级政治人物（如部长、副部长、议员）\n- 高级政府官员（如政府部门或重要监管机构高级官员）\n- 司法或军事机构的高级官员（如最高法院法官、将军）\n- 重要国有企业（SOE）的高级管理人员（如董事长、首席执行官）\n- 中央银行高级管理人员（如行长、副行长）\n- 大型国际组织（如联合国、世界银行、国际货币基金组织）中的高级管理人员\n\n基于 AML/CFT 合规要求，PEP 还包括：\n- PEP 的直系家庭成员\n- PEP 的密切关联人士',
          content_en: 'Politically Exposed Persons (PEPs) refer to individuals who currently hold or have held prominent public functions in Singapore, foreign countries, or international organizations, including:\n- Heads of state or government\n- Senior politicians and officials\n- Judicial or military officers\n- Senior executives of state-owned enterprises\n- Central bank executives and directors of international organizations\n\nUnder AML/CFT compliance requirements, PEPs also include:\n- Immediate family members of PEPs\n- Close associates of PEPs'
        },
        {
          id: 'cmp_ind_pep_q1',
          type: 'radio',
          label: '您是否目前在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职？',
          label_en: 'Do you currently hold a prominent public function in Singapore, foreign countries/territories, or on behalf of an international organization?',
          key: 'radio_pep_q1',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_pep_q2',
          type: 'radio',
          label: '您是否曾在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职，并已辞去该重要公职？',
          label_en: 'Have you previously held a prominent public function in Singapore, foreign countries/territories, or international organizations, and have stepped down from that role?',
          key: 'radio_pep_q2',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_pep_q3',
          type: 'radio',
          label: '您是否是现任或已卸任的政治人物的家庭成员或关系密切者？',
          label_en: 'Are you an immediate family member or close associate of a current or former politically exposed person?',
          key: 'radio_pep_q3',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        }
      ]
    },
    {
      id: 'page_kyc_ind_crime',
      pageType: 'form',
      title: '犯罪记录声明',
      title_en: 'Criminal Record Declaration',
      description: '请如实确认以下声明事项',
      description_en: 'Please truthfully confirm the following declaration items',
      fields: [
        {
          id: 'cmp_ind_crime_q1',
          type: 'radio',
          label: '欺骗，金融诈骗，贿赂，受贿，伪造或逃税的行为',
          label_en: 'Acts of deception, financial fraud, bribery, accepting bribes, forgery, or tax evasion',
          key: 'radio_crime_q1',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q2',
          type: 'radio',
          label: '在规范市场或第三方国家的等价市场中进行交易的金融证券股票市场价格进行操控',
          label_en: 'Manipulating prices of financial securities or stocks traded in regulated or equivalent third-country markets',
          key: 'radio_crime_q2',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q3',
          type: 'radio',
          label: '被判处有期徒刑罪行',
          label_en: 'Convicted of any offense punishable by imprisonment',
          key: 'radio_crime_q3',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q4',
          type: 'radio',
          label: '涉及使用机密信息的犯罪或违法行为',
          label_en: 'Crimes or offenses involving the unauthorized use of confidential or insider information',
          key: 'radio_crime_q4',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q5',
          type: 'radio',
          label: '涉及洗钱、恐怖分子资金筹集/扩大融资等违规及违法活动',
          label_en: 'Involvement in money laundering, terrorist financing, proliferation financing or related illicit activities',
          key: 'radio_crime_q5',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q6',
          type: 'radio',
          label: '宣布破产',
          label_en: 'Declared bankrupt or subject to bankruptcy proceedings',
          key: 'radio_crime_q6',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        },
        {
          id: 'cmp_ind_crime_q7',
          type: 'radio',
          label: '其他犯罪行为',
          label_en: 'Any other criminal offenses or regulatory enforcement actions',
          key: 'radio_crime_q7',
          layout: 'inline',
          required: true,
          showLabel: true,
          defaultValue: '',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' }
          ]
        }
      ]
    },
    {
      id: 'page_kyc_ind_sign',
      pageType: 'form',
      title: '声明及签名',
      title_en: 'Declaration & Signature',
      description: '请在确认各项条款后进行签名确认',
      description_en: 'Please review and confirm each clause with your signature',
      fields: [
        {
          id: 'cmp_ind_sign_1',
          type: 'signature',
          label: '声明及签名',
          label_en: 'Declaration & Signature',
          key: 'signature_ind_main',
          showLabel: false,
          required: true,
          declarationRequired: true,
          placeholder: '请在下方指定区域签名：',
          placeholder_en: 'Please sign in the designated area below:',
          options: [
            {
              label: '本人特此声明，以上所提供的信息均真实、准确且完整。本人知悉，如发现有任何虚假陈述或故意隐瞒重要事实的行为，本人可能会面临法律起诉及刑事处罚。',
              label_en: 'I hereby declare that all information provided above is true, accurate and complete. I acknowledge that any false representation or deliberate concealment of material facts may lead to legal prosecution and criminal liability.',
              value: 'dec_truth'
            }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};

// 3. 实体案例 KYC 模板
export const kycEntityTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Entity',
    title_en: 'SG_CDD_Entity',
    description: '',
    description_en: '',
    profileType: 'entity',
    enabledLocales: ['zh', 'en'],
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
      fields: [],
      profileFields: presetEntityProfileFields,
      relation: {
        title: '关联信息',
        title_en: 'Relationship Information',
        entityLabel: '关联实体',
        entityLabel_en: 'Associated Entity',
        typeLabel: '关联类型',
        typeLabel_en: 'Relationship Type',
        motherName: 'Algo Global Holdings Ltd.',
        relationships: ['子公司', '机构股东'],
        relationships_en: ['Subsidiary', 'Corporate Shareholder']
      },
      capitalTitle: '股份与出资信息',
      capitalTitle_en: 'Shareholding & Capital Info',
      capitalList: [
        {
          currency: 'USD',
          shareType: '普通股',
          shareType_en: 'Ordinary Shares',
          shareClassLabel: '股份类别',
          shareClassLabel_en: 'Share Class',
          sharesHeld: '1,000,000',
          sharesHeldLabel: '持有股份数',
          sharesHeldLabel_en: 'Shares Held',
          shareRatio: '100.00%',
          paidUpAmount: '1,000,000.00 USD',
          paidUpAmountLabel: '对应已缴股本金额',
          paidUpAmountLabel_en: 'Allocated Paid-up Capital'
        }
      ]
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
          content: '',
          content_en: ''
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


// 4. 全组件测试模板
export const allComponentsDemoTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: '全组件属性全量测试套件',
    title_en: 'All Components & Attributes Test Suite',
    description: '',
    description_en: '',
    profileType: 'customer',
    enabledLocales: ['zh', 'en'],
    source: 'template',
    templateKey: 'all-components-demo'
  },
  pages: [
    // Page 1: 单行文本 (input)
    {
      id: 'page_test_input',
      pageType: 'form',
      title: '第 1 页：单行文本',
      title_en: 'Page 1: Single-line Text (Input)',
      description: '测试单行文本普通文本、数字输入、前置条件联动及自定义校验提示',
      description_en: 'Test text/number input, conditional visibility (dependsOn) and custom error messages',
      fields: [
        {
          id: 'test_input_basic',
          type: 'input',
          label: '法定全名（必填文本）',
          label_en: 'Legal Full Name (Required Text)',
          key: 'input_legal_name',
          required: true,
          showLabel: true,
          placeholder: '请输入您的法定姓名',
          placeholder_en: 'Please enter your legal name',
          help: '请与有效身份证件上的姓名保持完全一致',
          help_en: 'Must exactly match your official identification'
        },
        {
          id: 'test_input_num',
          type: 'input',
          inputType: 'number',
          label: '注册资本金额（数字格式）',
          label_en: 'Registered Capital (Number Type)',
          key: 'input_reg_capital',
          required: false,
          showLabel: true,
          placeholder: '请输入纯数字金额，如 500000',
          placeholder_en: 'Enter numbers only, e.g. 500000',
          help: '单位为当前登记币种',
          help_en: 'In registered currency'
        },
        {
          id: 'test_input_trigger',
          type: 'radio',
          label: '是否拥有直接母公司？（联动触发器）',
          label_en: 'Has Direct Holding Company? (Dependency Trigger)',
          key: 'radio_has_parent',
          required: true,
          showLabel: true,
          layout: 'inline',
          options: [
            { label: '是（展开母公司名称输入）', label_en: 'Yes (Reveal parent company field)', value: 'yes' },
            { label: '否（保持隐藏）', label_en: 'No (Keep hidden)', value: 'no' }
          ]
        },
        {
          id: 'test_input_dependent',
          type: 'input',
          label: '母公司完整法定名称（联动显示字段）',
          label_en: 'Parent Company Legal Name (Conditional Field)',
          key: 'input_parent_company_name',
          required: true,
          showLabel: true,
          placeholder: '请输入上级母公司登记全称',
          placeholder_en: 'Please enter registered name of parent entity',
          dependsOn: {
            fieldKey: 'radio_has_parent',
            value: 'yes'
          }
        },
        {
          id: 'test_input_custom_err',
          type: 'input',
          label: '特定合规代码（自定义必填错误提示）',
          label_en: 'Compliance Code (Custom Error Message)',
          key: 'input_compliance_code',
          required: true,
          showLabel: true,
          placeholder: '留空直接点下一步可触发自定义错误',
          placeholder_en: 'Leave empty to trigger custom error',
          customErrorMessage: '【合规审计关键项】此项必填，请联系合规官获取代码！',
          customErrorMessage_en: '[Audit Essential] This field is required by AML regulations!'
        }
      ]
    },

    // Page 2: 多行文本 (textarea)
    {
      id: 'page_test_textarea',
      pageType: 'form',
      title: '第 2 页：多行文本',
      title_en: 'Page 2: Multi-line Text (Textarea)',
      description: '测试多行文本不同高度行数限制、字数输入及占位说明',
      description_en: 'Test multi-line text with minRows/maxRows and layout adaptability',
      fields: [
        {
          id: 'test_textarea_standard',
          maxLength: 200,
          type: 'textarea',
          label: '企业主营业务描述（标准 3-6 行）',
          label_en: 'Core Business Activities (Standard 3-6 rows)',
          key: 'textarea_biz_scope',
          required: true,
          showLabel: true,
          minRows: 3,
          maxRows: 6,
          placeholder: '请简述公司主营业务范围、商业模式及主要客户群体...',
          placeholder_en: 'Please briefly describe business operations, products and core clients...',
          help: '建议在 200 字以内进行扼要概括',
          help_en: 'Recommended to keep within 200 words'
        },
        {
          id: 'test_textarea_large',
          type: 'textarea',
          label: '五年期商业规划与资金用途（大段落 5-10 行）',
          label_en: 'Five-Year Business Plan (Large 5-10 rows)',
          key: 'textarea_business_plan',
          required: false,
          showLabel: true,
          minRows: 5,
          maxRows: 10,
          placeholder: '请详细阐述未来商业扩张规划、预期现金流以及专项资金筹措安排...',
          placeholder_en: 'Detail upcoming strategic expansions, cash flow expectations and funding arrangements...'
        }
      ]
    },

    // Page 3: 下拉选择 (select)
    {
      id: 'page_test_select',
      pageType: 'form',
      title: '第 3 页：下拉选择',
      title_en: 'Page 3: Dropdown Select (Select)',
      description: '测试下拉单选弹窗选择器与多选标签抽屉（含最大选择数上限）',
      description_en: 'Test single-select picker popup and multi-select tags drawer with maxSelections',
      fields: [
        {
          id: 'test_select_single',
          type: 'select',
          label: '年度营业总额区间（单选）',
          label_en: 'Annual Turnover Range (Single Select)',
          key: 'select_turnover_tier',
          required: true,
          showLabel: true,
          multiple: false,
          placeholder: '请点击选择年营业额',
          placeholder_en: 'Please select annual turnover tier',
          options: [
            { label: 'SGD 100,000 以下', label_en: 'Below SGD 100,000', value: 'tier_under_100k' },
            { label: 'SGD 100,000 – 1,000,000', label_en: 'SGD 100,000 – 1,000,000', value: 'tier_100k_1m' },
            { label: 'SGD 1,000,000 – 5,000,000', label_en: 'SGD 1,000,000 – 5,000,000', value: 'tier_1m_5m' },
            { label: 'SGD 5,000,000 以上', label_en: 'Above SGD 5,000,000', value: 'tier_above_5m' }
          ]
        },
        {
          id: 'test_select_multi',
          type: 'select',
          label: '核心资金来源渠道（多选，最多3项）',
          label_en: 'Primary Source of Funds (Multi-select, Max 3)',
          key: 'select_funding_sources',
          required: true,
          showLabel: true,
          multiple: true,
          maxSelections: 3,
          placeholder: '请选择资金来源渠道',
          placeholder_en: 'Please select funding source channels',
          options: [
            { label: '股东初始实缴出资', label_en: 'Shareholder Paid-in Capital', value: 'shareholder_equity' },
            { label: '企业日常主营收入', label_en: 'Operating Sales Revenue', value: 'operating_revenue' },
            { label: '银行或金融机构贷款', label_en: 'Bank / Institutional Loans', value: 'bank_loans' },
            { label: '投资收益与分红', label_en: 'Investment Return & Dividends', value: 'investment_dividends' },
            { label: '集团内部关联借款', label_en: 'Intercompany Group Lending', value: 'group_lending' },
            { label: '固定资产处置与变现', label_en: 'Fixed Asset Disposals', value: 'asset_disposals' }
          ]
        }
      ]
    },

    // Page 4: 单选框组 (radio)
    {
      id: 'page_test_radio',
      pageType: 'form',
      title: '第 4 页：单选框组',
      title_en: 'Page 4: Radio Button Group (Radio)',
      description: '测试行内水平排布与垂直卡片堆叠排布',
      description_en: 'Test horizontal inline layout and vertical stacked cards layout',
      fields: [
        {
          id: 'test_radio_inline',
          type: 'radio',
          label: '是否为公开上市公司？（行内水平排布）',
          label_en: 'Publicly Listed Company? (Inline Layout)',
          key: 'radio_is_listed',
          required: true,
          showLabel: true,
          layout: 'inline',
          options: [
            { label: '是', label_en: 'Yes', value: 'yes' },
            { label: '否', label_en: 'No', value: 'no' },
            { label: '筹备挂牌中', label_en: 'Pre-IPO / In Preparation', value: 'pre_ipo' }
          ]
        },
        {
          id: 'test_radio_stack',
          type: 'radio',
          label: '企业综合风控评级（垂直堆叠排布）',
          label_en: 'Comprehensive Risk Rating (Stack Layout)',
          key: 'radio_risk_tier',
          required: true,
          showLabel: true,
          layout: 'stack',
          options: [
            { label: '低风险（无跨国高风险业务）', label_en: 'Low Risk - No high risk cross-border business', value: 'risk_low' },
            { label: '中等风险（存在常规跨境进出口）', label_en: 'Medium Risk - Standard cross-border trade', value: 'risk_medium' },
            { label: '高风险（涉及特许行业或敏感司法管辖区）', label_en: 'High Risk - Regulated sectors or sensitive jurisdictions', value: 'risk_high' }
          ]
        }
      ]
    },

    // Page 5: 多选框组 (checkbox)
    {
      id: 'page_test_checkbox',
      pageType: 'form',
      title: '第 5 页：多选框组',
      title_en: 'Page 5: Checkbox Group (Checkbox)',
      description: '测试多选框组行内排布、垂直堆叠以及数量上限限制',
      description_en: 'Test inline/stacked layouts and max selections limit for checkboxes',
      fields: [
        {
          id: 'test_checkbox_inline',
          type: 'checkbox',
          label: '企业运营涉及牌照类别（行内排布）',
          label_en: 'Operating License Categories (Inline Layout)',
          key: 'checkbox_license_types',
          required: true,
          showLabel: true,
          layout: 'inline',
          options: [
            { label: '支付业务牌照', label_en: 'Payment License (MAS)', value: 'mas_payment' },
            { label: '数字资产交易许可', label_en: 'Digital Asset License', value: 'crypto_license' },
            { label: '进出口贸易通关许可', label_en: 'Import & Export Permit', value: 'trade_permit' }
          ]
        },
        {
          id: 'test_checkbox_stack_limit',
          type: 'checkbox',
          label: '未来十二个月重点发力市场（垂直堆叠，最多选2项）',
          label_en: 'Priority Markets in Next 12 Months (Stack, Max 2)',
          key: 'checkbox_target_markets',
          required: true,
          showLabel: true,
          layout: 'stack',
          maxSelections: 2,
          options: [
            { label: '新加坡本地市场', label_en: 'Singapore Domestic', value: 'mkt_sg' },
            { label: '中国大陆及港澳大湾区', label_en: 'Greater China Region', value: 'mkt_china' },
            { label: '东南亚新兴经济体', label_en: 'ASEAN Emerging Markets', value: 'mkt_asean' },
            { label: '欧美发达国家市场', label_en: 'Europe & North America', value: 'mkt_eu_us' }
          ]
        }
      ]
    },

    // Page 6: 日期选择 (date)
    {
      id: 'page_test_date',
      pageType: 'form',
      title: '第 6 页：日期选择',
      title_en: 'Page 6: Date Picker (Date)',
      description: '测试单日选择器、支持“长期有效”勾选框以及日期区间范围选择',
      description_en: 'Test single date, long-term validity checkbox and date range picker',
      fields: [
        {
          id: 'test_date_single',
          type: 'date',
          dateMode: 'single',
          label: '企业注册成立日期（单日必填）',
          label_en: 'Date of Incorporation (Single Date)',
          key: 'date_incorporation',
          required: true,
          showLabel: true,
          placeholder: '请选择成立日期',
          placeholder_en: 'Select date of incorporation'
        },
        {
          id: 'test_date_long_term',
          type: 'date',
          dateMode: 'single',
          enableLongTerm: true,
          label: '特许营业许可证有效截止日（可勾选长期）',
          label_en: 'Business License Expiry (Long-term Option)',
          key: 'date_license_expiry',
          required: true,
          showLabel: true,
          placeholder: '请选择到期日期或勾选长期有效',
          placeholder_en: 'Select expiry date or tick long-term'
        },
        {
          id: 'test_date_range',
          type: 'date',
          dateMode: 'range',
          label: '上年度财务审计会计周期（日期区间范围）',
          label_en: 'Fiscal Audit Period (Date Range)',
          key: 'date_audit_range',
          required: true,
          showLabel: true,
          placeholder: '请选择起始日期与截止日期',
          placeholder_en: 'Select start date and end date'
        }
      ]
    },

    // Page 7: 国家选择器 (country)
    {
      id: 'page_test_country',
      pageType: 'form',
      title: '第 7 页：国家选择器',
      title_en: 'Page 7: Country Selector (Country)',
      description: '测试纯中文/纯英文显示、拼音与字母双向排序、国旗展示、单选与多选',
      description_en: 'Test pure Chinese/English names, Pinyin/Alphabet sorting, flags and single/multi modes',
      fields: [
        {
          id: 'test_country_single',
          type: 'country',
          multiple: false,
          label: '法定设立国家/地区（单选）',
          label_en: 'Country of Incorporation (Single Select)',
          key: 'country_incorporation',
          required: true,
          showLabel: true,
          placeholder: '请选择注册国家/地区',
          placeholder_en: 'Please select country/region'
        },
        {
          id: 'test_country_multi',
          type: 'country',
          multiple: true,
          maxSelections: 3,
          label: '主要供货商所在国家/地区（多选，最多3项）',
          label_en: 'Major Supplier Countries (Multi-select, Max 3)',
          key: 'country_major_suppliers',
          required: true,
          showLabel: true,
          placeholder: '请选择主要供货商所在国家/地区',
          placeholder_en: 'Please select supplier countries'
        }
      ]
    },

    // Page 8: 国籍选择器 (nationality)
    {
      id: 'page_test_nationality',
      pageType: 'form',
      title: '第 8 页：国籍选择器',
      title_en: 'Page 8: Nationality Selector (Nationality)',
      description: '测试国籍专有名词（如中国籍）、拼音首字母分组、单选与多选',
      description_en: 'Test nationality terminology (e.g. Chinese), pinyin grouping and single/multi modes',
      fields: [
        {
          id: 'test_nationality_single',
          type: 'nationality',
          multiple: false,
          label: '法定代表人国籍（单选）',
          label_en: 'Legal Representative Nationality (Single)',
          key: 'nationality_representative',
          required: true,
          showLabel: true,
          placeholder: '请选择法定代表人国籍',
          placeholder_en: 'Please select representative nationality'
        },
        {
          id: 'test_nationality_multi',
          type: 'nationality',
          multiple: true,
          maxSelections: 3,
          label: '主要受益所有人国籍（多选，最多3项）',
          label_en: 'Beneficial Owner Nationalities (Multi, Max 3)',
          key: 'nationality_beneficial_owners',
          required: false,
          showLabel: true,
          placeholder: '请选择主要股东/受益人国籍',
          placeholder_en: 'Please select shareholder nationalities'
        }
      ]
    },

    // Page 9: 手机号码 (phone)
    {
      id: 'page_test_phone',
      pageType: 'form',
      title: '第 9 页：手机号码',
      title_en: 'Page 9: Mobile Phone Number (Phone)',
      description: '测试国际电话区号弹窗选择、国家旗帜、严格号码规则校验（8位或11位）',
      description_en: 'Test international dial code selection, flags, and strict validation regex rules',
      fields: [
        {
          id: 'test_phone_sg',
          type: 'phone',
          label: '新加坡本地紧急联络人手机（预设区号）',
          label_en: 'Local Singapore Contact Mobile (Preset +65)',
          key: 'phone_sg_contact',
          dialCode: '+65',
          countryCode: 'sg',
          strictPhoneValidation: true,
          required: true,
          showLabel: true,
          placeholder: '',
          placeholder_en: ''
        },
        {
          id: 'test_phone_cn',
          type: 'phone',
          label: '亚太业务代表手机号码（预设区号严格校验）',
          label_en: 'APAC Representative Mobile (Preset +86 strict)',
          key: 'phone_cn_rep',
          dialCode: '+86',
          countryCode: 'cn',
          strictPhoneValidation: true,
          required: true,
          showLabel: true,
          placeholder: '',
          placeholder_en: ''
        }
      ]
    },

    // Page 10: 电子邮箱 (email)
    {
      id: 'page_test_email',
      pageType: 'form',
      title: '第 10 页：电子邮箱',
      title_en: 'Page 10: Corporate Email (Email)',
      description: '测试邮箱输入框、电子邮件格式正则校验与自定义错误提示',
      description_en: 'Test email format regex validation and custom error alerts',
      fields: [
        {
          id: 'test_email_official',
          type: 'email',
          label: '公司官方商务对接邮箱（必填）',
          label_en: 'Official Corporate Business Email (Required)',
          key: 'email_corporate_official',
          required: true,
          showLabel: true,
          placeholder: 'example@company.com',
          placeholder_en: 'example@company.com',
          help: '用于接收合规复核正式电子回执通知',
          help_en: 'Used for receiving official audit completion certificates'
        },
        {
          id: 'test_email_finance',
          type: 'email',
          label: '财务对账备用联络邮箱（选填）',
          label_en: 'Finance Accounting Backup Email (Optional)',
          key: 'email_finance_backup',
          required: false,
          showLabel: true,
          placeholder: 'finance@company.com',
          placeholder_en: 'finance@company.com'
        }
      ]
    },

    // Page 11: 提示区块 (alert)
    {
      id: 'page_test_alert',
      pageType: 'form',
      title: '第 11 页：提示说明区块',
      title_en: 'Page 11: Informational Notice (Alert)',
      description: '测试圆点列表样式、数字列表样式、超链接与警示视觉',
      description_en: 'Test bullet lists (circle), numbered lists, markdown links and notice styles',
      fields: [
        {
          id: 'test_alert_circle',
          type: 'alert',
          label: '合规准入须知（圆点列表样式）',
          label_en: 'Compliance Notice (Bullet Style)',
          key: 'alert_compliance_circle',
          required: false,
          showLabel: true,
          listStyle: 'circle',
          content: '请在签署前仔细阅读以下重要合规条款：\n- 所有提交的公司注册凭证需处于有效法定续存状态\n- 涉及被制裁国家名单的企业将触发二级强化尽职审查\n- 如需查看监管指引，请访问 [金管局监管指南](https://www.mas.gov.sg)',
          content_en: 'Please review the following compliance terms carefully before proceeding:\n- All submitted business licenses must be legally valid\n- Entities associated with sanctioned regions will trigger EDD review\n- For regulatory guidelines, visit [MAS Regulatory Portal](https://www.mas.gov.sg)'
        },
        {
          id: 'test_alert_number',
          type: 'alert',
          label: '后续审批与流转指引（数字列表样式）',
          label_en: 'Audit & Workflow Guidance (Numbered Style)',
          key: 'alert_workflow_numbers',
          required: false,
          showLabel: true,
          listStyle: 'number',
          content: '问卷签署完成后的标准化审核流转步骤：\n1. 系统自动校验证件编码与工商黑名单数据库\n2. 高级合规主管进行人工资料复核并出具尽职调查简报\n3. 最终通过后向法定联络邮箱发放带电子时间戳的完整归档文件',
          content_en: 'Standard operational steps following form submission:\n1. Automatic background checks against compliance screening lists\n2. Senior compliance officer manual review and risk assessment\n3. Final delivery of timestamped sealed PDF to designated corporate email'
        }
      ]
    },

    // Page 12: 电子签名 (signature)
    {
      id: 'page_test_signature',
      pageType: 'form',
      title: '第 12 页：电子签署',
      title_en: 'Page 12: Electronic Signature (Signature)',
      description: '测试法律声明勾选框必选约束、手写画布笔迹交互、清空重签及最终提交',
      description_en: 'Test mandatory legal declaration checkboxes, smooth canvas signing, clear & submit',
      fields: [
        {
          id: 'test_signature_final',
          type: 'signature',
          label: '法定授权代表手写签署确认',
          label_en: 'Authorized Legal Representative Signature',
          key: 'signature_representative_final',
          required: true,
          showLabel: true,
          declarationRequired: true,
          declarationErrorMessage: '请务必仔细阅读并勾选上述法定声明后方可签署！',
          declarationErrorMessage_en: 'You must read and tick the legal declaration before signing!',
          options: [
            {
              label: '本人在此郑重声明并确认：本问卷填报的所有信息、凭证及声明均真实、完整、准确且具备法律约束力。',
              label_en: 'I hereby solemnly declare and confirm that all information, documents and declarations submitted in this form are true, complete, accurate and legally binding.',
              value: 'legal_dec_accurate'
            },
            {
              label: '本人同意本机构及受托合规团队依据反洗钱监管法例对所载资料进行核实与存档。',
              label_en: 'I authorize the institution and compliance officers to verify and retain all provided information under AML/CFT regulations.',
              value: 'legal_dec_consent'
            }
          ]
        }
      ]
    }
  ],
  pageConnections: []
};
