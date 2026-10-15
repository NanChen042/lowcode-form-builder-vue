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
    customer: { title: 'SG_CDD_Customer', desc: '客户母案例专用KYC问卷' },
    client: { title: 'SG_CDD_Customer', desc: '客户母案例专用KYC问卷' },
    individual: { title: 'SG_CDD_Individual', desc: '个人成员专用KYC问卷' },
    entity: { title: 'SG_CDD_Entity', desc: '实体成员专用KYC问卷' }
  };
  const resolvedTitle = title || defaultMetaMap[normType]?.title || 'SG_CDD_Customer';
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

// 默认空白画布模板 (自带第 1 页系统基础资料，默认客户母案例)
export const blankTemplate: FormSchema = createBlankTemplate('customer');

// 1. 客户案例 - KYC 表单 (SG_CDD_Customer)
export const kycCustomerTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Customer',
    title_en: 'SG_CDD_Customer',
    description: '客户案例专用KYC问卷',
    description_en: 'Dedicated KYC questionnaire for customer cases',
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
            { label: 'SGD 1,000,000 – 5,000,000', label_en: 'SGD 1,000,000 – 5,000,000', value: 'sgd_1m_5m' },
            { label: 'SGD 100,000 – 1,000,000', label_en: 'SGD 100,000 – 1,000,000', value: 'sgd_100k_1m' },
            { label: 'SGD 100,000 以下', label_en: 'Below SGD 100,000', value: 'sgd_under_100k' },
            { label: 'SGD 5,000,000 以上', label_en: 'Above SGD 5,000,000', value: 'sgd_above_5m' }
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
          help: '(最多选3项)',
          help_en: '(Max 3 selections)',
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
          help: '(最多选3项)',
          help_en: '(Max 3 selections)',
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

// 2. 个人案例 - KYC 表单 (SG_CDD_Individual)
export const kycIndividualTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Individual',
    title_en: 'SG_CDD_Individual',
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

// 3. 实体案例 - KYC 表单 (SG_CDD_Entity)
export const kycEntityTemplate: FormSchema = {
  schemaVersion: '1.0.0',
  meta: {
    title: 'SG_CDD_Entity',
    title_en: 'SG_CDD_Entity',
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
