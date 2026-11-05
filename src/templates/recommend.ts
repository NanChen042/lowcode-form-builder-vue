import type { FormSchema, ProfileType, ProfileFieldItem } from '@/types/schema';

export const presetCustomerProfileFields: ProfileFieldItem[] = [
  { label: '企业注册全称', label_en: 'Company Name', value: 'Algo Global Trading Pte. Ltd.', skeletonWidth: '65%' },
  { label: '统一机构识别码 (UEN)', label_en: 'UEN', value: '202319827K', skeletonWidth: '40%' },
  { label: '注册设立国家', label_en: 'Country of Incorporation', value: '新加坡 / Singapore', skeletonWidth: '30%' },
  { label: '法律实体形式', label_en: 'Entity Type', value: '私人豁免有限公司 / Private Limited Company', skeletonWidth: '45%' },
  { label: '授权代表姓名', label_en: 'Authorized Representative', value: 'Alexander Tan (陈建国)', skeletonWidth: '35%' },
  { label: '官方联络邮箱', label_en: 'Contact Email', value: 'compliance@algocandy.com', skeletonWidth: '55%' },
  { label: '企业注册地址', label_en: 'Registered Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' },
  { label: '居住地址', label_en: 'Residential Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' }
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
  { label: '居住地址', label_en: 'Residential Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' },
  { label: '联系地址', label_en: 'Contact Address', value: '8 Marina View, #07-02 Asia Square Tower 1, Singapore 018960', skeletonWidth: '80%' }
];

export const presetEntityProfileFields: ProfileFieldItem[] = [
  { label: '企业注册全称', label_en: 'Company Name', value: 'Algo Global Holdings Ltd.', skeletonWidth: '65%' },
  { label: '统一机构识别码 (UEN)', label_en: 'UEN', value: '202100888E', skeletonWidth: '40%' },
  { label: '注册设立国家', label_en: 'Country of Incorporation', value: '新加坡 / Singapore', skeletonWidth: '30%' },
  { label: '法律实体形式', label_en: 'Entity Type', value: '私人豁免有限公司 / Private Limited Company', skeletonWidth: '45%' },
  { label: '授权代表姓名', label_en: 'Authorized Representative', value: 'Alexander Tan (陈建国)', skeletonWidth: '35%' },
  { label: '官方联络邮箱', label_en: 'Contact Email', value: 'contact@algoholdings.com', skeletonWidth: '55%' },
  { label: '企业注册地址', label_en: 'Registered Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' },
  { label: '居住地址', label_en: 'Residential Address', value: '10 Marina Boulevard, #38-01 MBFC Tower 2, Singapore 018983', skeletonWidth: '85%' }
];


export function createBlankTemplate(
  profileType: ProfileType = 'customer',
  title = '',
  title_en = '',
  description = '',
  description_en = ''
): FormSchema {
  const normType = (profileType === 'client' || profileType === 'customer') ? 'customer' : profileType;
  const defaultMetaMap: Record<string, { title: string; desc: string }> = {
    customer: { title: 'SG_CDD_CUSTOMER', desc: '' },
    client: { title: 'SG_CDD_CUSTOMER', desc: '' },
    individual: { title: 'SG_CDD_INDIVIDUAL', desc: '' },
    entity: { title: 'SG_CDD_ENTITY', desc: '' }
  };
  const resolvedTitle = title || defaultMetaMap[normType]?.title || 'SG_CDD_CUSTOMER';
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


export const blankTemplate: FormSchema = createBlankTemplate('customer');


export const RISK_FIXED_OPTIONS = [
  { label: 'Yes', label_en: 'Yes', value: 'yes' },
  { label: 'No', label_en: 'No', value: 'no' },
  { label: 'Not Applicable', label_en: 'Not Applicable', value: 'na' }
];


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
      title: 'SG_RISK_CUSTOMER',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置本表单的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    individual: {
      title: 'SG_RISK_INDIVIDUAL',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置个人成员的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure individual risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    entity: {
      title: 'SG_RISK_ENTITY',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置实体机构的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure corporate entity risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    }
  };

  const metaPreset = defaultMetaMap[normType] || defaultMetaMap.customer;
  const resolvedTitle = title || metaPreset.title;

  const presetGroups = [{ id: 'grp_risk_1', title: '', title_en: '' }];

  return {
    schemaVersion: '1.0.0',
    meta: {
      title: resolvedTitle,
      title_en: title_en || resolvedTitle,
      description: description || '',
      description_en: description_en || '',
      profileType: normType,
      formType: 'risk',
      enabledLocales: ['zh'],
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
        groups: presetGroups,
        fields: []
      }
    ],
    pageConnections: []
  };
}


export const kycCustomerTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "title": "SG_CDD_CUSTOMER",
    "title_en": "SG_CDD_CUSTOMER",
    "description": "",
    "description_en": "",
    "profileType": "customer",
    "formType": "kyc",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-customer"
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "customer",
      "showSkeleton": true,
      "title": "基本资料",
      "description": "",
      "fields": [],
      "title_en": "Basic Information",
      "description_en": "",
      "profileFields": presetCustomerProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "title": "业务信息",
      "description": "",
      "fields": [
        {
          "label": "公司主营业务说明",
          "label_en": "Description of Main Business Activity",
          "placeholder": "请简述公司业务范围及经营模式。",
          "placeholder_en": "Please briefly describe your business scope and operating model",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "id": "cmp_1",
          "type": "textarea",
          "key": "textarea_1",
          "helpPosition": "right"
        },
        {
          "label": "年销售额规模",
          "label_en": "Annual Sales Volume",
          "placeholder": "请选择选项",
          "placeholder_en": "Please select an option",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "SGD 100,000 以下",
              "label_en": "Below SGD 100,000",
              "value": "option_2"
            },
            {
              "label": "SGD 100,000 – 1,000,000",
              "label_en": "SGD 100,000 – 1,000,000",
              "value": "option_4_mvudy41x"
            },
            {
              "label": "SGD 1,000,000 – 5,000,000",
              "label_en": "SGD 1,000,000 – 5,000,000",
              "value": "option_5_mvuenpk9"
            },
            {
              "label": "SGD 5,000,000 以上",
              "label_en": "Above SGD 5,000,000",
              "value": "option_6_mvuenxs6"
            }
          ],
          "id": "cmp_2",
          "type": "select",
          "key": "select_2",
          "helpPosition": "right"
        },
        {
          "label": "资金来源",
          "label_en": "Source of Funds",
          "placeholder": "请选择选项",
          "placeholder_en": "Please select an option",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "银行贷款",
              "label_en": "Bank Loans",
              "value": "option_1"
            },
            {
              "label": "营业收入",
              "label_en": "Business Income",
              "value": "option_2"
            },
            {
              "label": "出资/股权投入",
              "label_en": "Capital/Shareholding Contribution",
              "value": "option_3_mvue6ypd"
            },
            {
              "label": "公司间资金/借贷",
              "label_en": "Inter-company Funding/Loans",
              "value": "option_4_mvuecgqw"
            },
            {
              "label": "个人储蓄",
              "label_en": "Personal Savings",
              "value": "option_6_mvueciit"
            },
            {
              "label": "资产出售（如商业地产、机器设备等）",
              "label_en": "Sales of Assets (e.g., commercial properties, machineries)",
              "value": "option_7_mvuecxqt"
            },
            {
              "label": "其他",
              "label_en": "Others",
              "value": "option_7_mvuf55ap"
            }
          ],
          "id": "cmp_3",
          "type": "select",
          "key": "select_3",
          "helpPosition": "right"
        },
        {
          "label": "主要客户所在国家/地区",
          "label_en": "Main Client Country / Region",
          "placeholder": "请选择国家",
          "placeholder_en": "Please select a country",
          "help": "(最多选3项)",
          "help_en": "(Up to 3 items)",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "id": "cmp_4",
          "type": "country",
          "key": "country_4",
          "helpPosition": "right",
          "maxSelections": 3
        },
        {
          "label": "主要供应商所在国家/地区",
          "label_en": "Main Supplier Country / Region",
          "placeholder": "请选择国家",
          "placeholder_en": "Please select a country",
          "help": "(最多选3项)",
          "help_en": "(Up to 3 items)",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "id": "cmp_5",
          "type": "country",
          "key": "country_5",
          "helpPosition": "right",
          "maxSelections": 3
        },
        {
          "label": "公司官网、网店或社交媒体主页链接(如有)",
          "label_en": "Company website, e-commerce store, or social media homepage (if any)",
          "placeholder": "请输入内容",
          "placeholder_en": "Please enter content",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": false,
          "showLabel": true,
          "id": "cmp_9",
          "type": "input",
          "key": "input_9",
          "helpPosition": "right"
        },
        {
          "label": "是否是上市公司",
          "label_en": "Is your company publicly listed?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_11",
          "type": "radio",
          "key": "radio_11",
          "helpPosition": "right"
        },
        {
          "label": "请说明",
          "label_en": "Please provide details",
          "placeholder": "请输入股票代码(如适用)",
          "placeholder_en": "Please enter stock ticker (if applicable)",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "id": "cmp_12",
          "type": "input",
          "key": "input_12",
          "helpPosition": "right",
          "linkage": {
            "logic": "and",
            "conditions": [
              {
                "fieldKey": "radio_11",
                "value": "option_1"
              }
            ]
          }
        }
      ],
      "title_en": "Business Information",
      "description_en": ""
    },
    {
      "id": "page_1793331484329_13",
      "pageType": "form",
      "showSkeleton": true,
      "title": "声明及签名",
      "description": "",
      "fields": [
        {
          "label": "声明",
          "label_en": "Declaration",
          "placeholder": "请在下方指定区域签名",
          "placeholder_en": "Please sign in the designated area below",
          "help": "",
          "help_en": "",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "options": [
            {
              "label": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。",
              "label_en": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever.",
              "value": "dec_1"
            },
            {
              "label": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。",
              "label_en": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability.",
              "value": "option_2_mvufeei9"
            }
          ],
          "id": "cmp_15",
          "type": "signature",
          "key": "signature_15",
          "helpPosition": "right"
        }
      ],
      "title_en": "Declaration and Signature",
      "description_en": ""
    }
  ],
  "pageConnections": []
};

export const kycClientTemplate: FormSchema = kycCustomerTemplate;


export const kycIndividualTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "title": "SG_CDD_INDIVIDUAL",
    "title_en": "SG_CDD_INDIVIDUAL",
    "description": "",
    "description_en": "",
    "profileType": "individual",
    "formType": "kyc",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-individual",
    "formId": "individual_diy_161456",
    "serialNo": "individual_diy_161456",
    "createdAt": 1793347455387
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "individual",
      "showSkeleton": true,
      "title": "基本资料",
      "description": "",
      "fields": [],
      "title_en": "Basic Information",
      "description_en": "",
      "profileFields": presetIndividualProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "title": "最终受益所有人(UBO)",
      "description": "",
      "fields": [
        {
          "label": "提示",
          "label_en": "Note",
          "required": false,
          "showLabel": true,
          "listStyle": "circle",
          "content": "如果某一名自然人 直接或间接持有公司 25% 以上的股份，或 对公司拥有 重大影响力或实际控制权(即使不持股)，该自然人应被视为公司的 最终受益所有人(UBO)。",
          "content_en": "If a natural person directly or indirectly holds more than 25% of the shares in the company, or has significant influence or actual control over the company (even if not holding shares), the natural person should be considered as the ultimate beneficial owner (UBO) of the company. ",
          "id": "cmp_1",
          "type": "alert",
          "key": "alert_1",
          "helpPosition": "right"
        },
        {
          "label": "个人是否持有公司超过25%的股份? ",
          "label_en": "Does individual control more than 25% share of the company？",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_2",
          "type": "radio",
          "key": "radio_2",
          "helpPosition": "right"
        },
        {
          "label": "个人是否对公司具有重大控制权？",
          "label_en": "Does individual have significant control in the company?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_3",
          "type": "radio",
          "key": "radio_3",
          "helpPosition": "right"
        }
      ],
      "title_en": "Ultimate Beneficial Owner",
      "description_en": ""
    },
    {
      "id": "page_1793332682595_4",
      "pageType": "form",
      "showSkeleton": true,
      "title": "PEP声明",
      "description": "",
      "fields": [
        {
          "label": "提示",
          "label_en": "Note",
          "required": false,
          "showLabel": true,
          "listStyle": "circle",
          "content": "政治公众人物（PEP）是指目前或曾经在新加坡、其他国家或国际组织中担任重要公共职务的人士，通常包括：\n· 国家元首或政府首脑（如总统、总理）\n· 高级政治人物（如部长、副部长、议员）\n· 高级政府官员（如政府部门或重要监管机构高级官员）\n· 司法或军事机构的高级官员（如最高法院法官、将军）\n· 重要国有企业（SOE）的高级管理人员（如董事长、首席执行官）\n· 中央银行高级管理人员（如行长、副行长）\n· 大型国际组织（如联合国、世界银行、国际货币基金组织）中的高级管理人员（如执行董事、理事会成员）\n\n基于 AML/CFT 合规要求，PEP 还包括：\n· PEP 的直系家庭成员\n· PEP 的密切关联人士 ",
          "content_en": "A Politically Exposed Person (PEP) refers to an individual who currently holds, or has previously held, a prominent public function in Singapore, another country, or an international organisation. This typically includes:\n· Head of state or government, such as President or Prime Minister\n· Senior political figure, such as Minister, Deputy Minister, or Member of Parliament\n· Senior government official, such as a senior official of a government department or key regulatory authority\n· Senior official of a judicial or military body, such as a Supreme Court Judge or General\n· Senior management of an important state-owned enterprise (SOE), such as Chairman or Chief Executive Officer\n· Senior executive of a central bank, such as Governor or Deputy Governor\n· Senior management of a major international organisation, such as Executive Director or Board Member of the United Nations, World Bank, or International Monetary Fund\n\nFor AML/CFT purposes, PEP also includes:\n· Immediate family members of a PEP\n· Close associates of a PEP ",
          "id": "cmp_4",
          "type": "alert",
          "key": "alert_4",
          "helpPosition": "right"
        },
        {
          "label": "您是否目前在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职？",
          "label_en": "Are you currently holding a prominent public position in Singapore, in any other country or under the mandate of an international organization?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_5",
          "type": "radio",
          "key": "radio_5",
          "helpPosition": "right"
        },
        {
          "label": "您是否曾在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职，并已辞去该重要公职？",
          "label_en": "Have you previously held a prominent public position in Singapore, overseas or under an international organization, and have since stepped down?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_7",
          "type": "radio",
          "key": "radio_7",
          "helpPosition": "right"
        },
        {
          "label": "您是否是现任或已卸任的政治人物的家庭成员或关系密切者？",
          "label_en": "Are you a family member or close associate of a current or former political figure?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_8",
          "type": "radio",
          "key": "radio_8",
          "helpPosition": "right"
        },
        {
          "label": "被识别的PEP是以下哪种类型？",
          "label_en": "What type of PEP has been identified?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "新加坡敏感政治人物",
              "label_en": "Singapore-sensitive political figure",
              "value": "option_1"
            },
            {
              "label": "外国敏感政治人物",
              "label_en": "Foreign-sensitive political figure",
              "value": "option_2"
            },
            {
              "label": "国际组织敏感政治人物",
              "label_en": "International organization PEP",
              "value": "option_3_mw02dacj"
            },
            {
              "label": "敏感政治人物的家庭成员",
              "label_en": "Family member of a PEP",
              "value": "option_4_mw02dju4"
            },
            {
              "label": "敏感政治人物的亲密伙伴",
              "label_en": "Close associate of a PEP",
              "value": "option_5_mw02dr61"
            }
          ],
          "id": "cmp_36",
          "type": "checkbox",
          "key": "checkbox_36",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "label": "与PEP(政界公众人士)的关系说明(如适用)",
          "label_en": "Description of relationship with the PEP(Politically Exposed Person), if applicable",
          "placeholder": "请输入详细描述...",
          "placeholder_en": "Please enter detailed description...",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "id": "cmp_37",
          "type": "textarea",
          "key": "textarea_37",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "label": "PEP(政界公众人士)的姓名",
          "label_en": "Name of the PEP (Politically Exposed Person)",
          "placeholder": "请输入内容",
          "placeholder_en": "Please enter content",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "id": "cmp_38",
          "type": "input",
          "key": "input_38",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "label": "PEP(政界公众人士)担任重要公职的国家或国际组织名称",
          "label_en": "Name of the country or international\norganization where the PEP holds or held a\nprominent public position",
          "placeholder": "请输入内容",
          "placeholder_en": "Please enter content",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "id": "cmp_39",
          "type": "input",
          "key": "input_39",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "label": "描述正在或曾经担任的重要公共职务",
          "label_en": "Description of the prominent public position\ncurrently or previously held",
          "placeholder": "请输入内容",
          "placeholder_en": "Please enter content",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "id": "cmp_40",
          "type": "input",
          "key": "input_40",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "label": "曾属于PEP(政界公众人士)身份的起止时间",
          "label_en": "Period during which the individual was classified as a PEP",
          "placeholder": "请选择日期",
          "placeholder_en": "Please select a date",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "endValue": "",
          "dateType": "date",
          "dateMode": "range",
          "enableLongTerm": false,
          "defaultLongTerm": false,
          "required": true,
          "showLabel": true,
          "id": "cmp_41",
          "type": "date",
          "key": "date_41",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              }
            ]
          }
        }
      ],
      "title_en": "PEP Declaration",
      "description_en": ""
    },
    {
      "id": "page_1793339330496_9",
      "pageType": "form",
      "showSkeleton": true,
      "title": "犯罪记录声明",
      "description": "",
      "fields": [
        {
          "label": "欺骗，金融诈骗，贿赂，受贿，伪造或逃税的行为",
          "label_en": "Fraud, financial scams, bribery, acceptance of bribes, forgery, or tax evasion",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_10",
          "type": "radio",
          "key": "radio_10",
          "helpPosition": "right"
        },
        {
          "label": "在规范市场或第三方国家的等价市场中进行交易的金融证券股票市场价格进行操控",
          "label_en": "Manipulation of financial securities or stock prices in regulated or equivalent third-country markets",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_24",
          "type": "radio",
          "key": "radio_24",
          "helpPosition": "right"
        },
        {
          "label": "被判处有期徒刑罪行",
          "label_en": "Criminal offenses resulting in imprisonment",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_22",
          "type": "radio",
          "key": "radio_22",
          "helpPosition": "right"
        },
        {
          "label": "涉及使用机密信息的犯罪或违法行为",
          "label_en": "Crimes or misconduct involving confidential information",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_32",
          "type": "radio",
          "key": "radio_32",
          "helpPosition": "right"
        },
        {
          "label": "涉及洗钱、恐怖分子资金筹集/扩大融资等违规及违法活动",
          "label_en": "Offenses related to money laundering or terrorist financing",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_30",
          "type": "radio",
          "key": "radio_30",
          "helpPosition": "right"
        },
        {
          "label": "宣布破产",
          "label_en": "Bankruptcy declaration",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_28",
          "type": "radio",
          "key": "radio_28",
          "helpPosition": "right"
        },
        {
          "label": "其他犯罪行为",
          "label_en": "Other criminal offenses",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_26",
          "type": "radio",
          "key": "radio_26",
          "helpPosition": "right"
        },
        {
          "label": "说明",
          "label_en": "Description",
          "placeholder": "请说明",
          "placeholder_en": "Please enter description",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": false,
          "id": "cmp_27",
          "type": "input",
          "key": "input_27",
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_10",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_24",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_22",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_32",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_30",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_28",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_26",
                "value": "option_1"
              }
            ]
          }
        }
      ],
      "title_en": "Criminal Record Declaration",
      "description_en": ""
    },
    {
      "id": "page_1793339759637_34",
      "pageType": "form",
      "showSkeleton": true,
      "title": "声明及签名",
      "description": "",
      "fields": [
        {
          "label": "声明",
          "label_en": "Applicant's Declaration",
          "placeholder": "请在下方指定区域签名",
          "placeholder_en": "Please sign in the designated area below",
          "help": "",
          "help_en": "",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "options": [
            {
              "label": "本人特此声明，以上所提供的信息均真实、准确且完整。本人知悉，如发现有任何虚假陈述或故意隐瞒重要事实的行为，本人可能会面临法律起诉及刑事处罚。",
              "label_en": "I hereby declare that all information provided above is true, accurate and complete. I acknowledge that if I make any false statements or intentionally conceal material facts, I may bear corresponding legal liabilities, including criminal liability.",
              "value": "dec_1"
            }
          ],
          "id": "cmp_35",
          "type": "signature",
          "key": "signature_35",
          "helpPosition": "right"
        }
      ],
      "title_en": "Declaration and Signature",
      "description_en": ""
    }
  ],
  "pageConnections": []
};

export const kycEntityTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "title": "SG_CDD_ENTITY",
    "title_en": "SG_CDD_ENTITY",
    "description": "",
    "description_en": "",
    "profileType": "entity",
    "formType": "kyc",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-entity"
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "entity",
      "showSkeleton": true,
      "title": "基本资料",
      "description": "",
      "fields": [],
      "title_en": "Basic Information",
      "description_en": "",
      "profileFields": presetEntityProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "title": "业务信息",
      "description": "",
      "fields": [
        {
          "label": "公司主营业务说明",
          "label_en": "Description of Main Business Activity",
          "placeholder": "请简述公司业务范围及经营模式。",
          "placeholder_en": "Please briefly describe your business scope and operating model",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "id": "cmp_1",
          "type": "textarea",
          "key": "textarea_1",
          "helpPosition": "right"
        },
        {
          "label": "年销售额规模",
          "label_en": "Annual Sales Volume",
          "placeholder": "请选择选项",
          "placeholder_en": "Please select an option",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "SGD 100,000 以下",
              "label_en": "Below SGD 100,000",
              "value": "option_2"
            },
            {
              "label": "SGD 100,000 – 1,000,000",
              "label_en": "SGD 100,000 – 1,000,000",
              "value": "option_4_mvudy41x"
            },
            {
              "label": "SGD 1,000,000 – 5,000,000",
              "label_en": "SGD 1,000,000 – 5,000,000",
              "value": "option_5_mvuenpk9"
            },
            {
              "label": "SGD 5,000,000 以上",
              "label_en": "Above SGD 5,000,000",
              "value": "option_6_mvuenxs6"
            }
          ],
          "id": "cmp_2",
          "type": "select",
          "key": "select_2",
          "helpPosition": "right"
        },
        {
          "label": "资金来源",
          "label_en": "Source of Funds",
          "placeholder": "请选择选项",
          "placeholder_en": "Please select an option",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "银行贷款",
              "label_en": "Bank Loans",
              "value": "option_1"
            },
            {
              "label": "营业收入",
              "label_en": "Business Income",
              "value": "option_2"
            },
            {
              "label": "出资/股权投入",
              "label_en": "Capital/Shareholding Contribution",
              "value": "option_3_mvue6ypd"
            },
            {
              "label": "公司间资金/借贷",
              "label_en": "Inter-company Funding/Loans",
              "value": "option_4_mvuecgqw"
            },
            {
              "label": "个人储蓄",
              "label_en": "Personal Savings",
              "value": "option_6_mvueciit"
            },
            {
              "label": "资产出售（如商业地产、机器设备等）",
              "label_en": "Sales of Assets (e.g., commercial properties, machineries)",
              "value": "option_7_mvuecxqt"
            },
            {
              "label": "其他",
              "label_en": "Others",
              "value": "option_7_mvuf55ap"
            }
          ],
          "id": "cmp_3",
          "type": "select",
          "key": "select_3",
          "helpPosition": "right"
        },
        {
          "label": "主要客户所在国家/地区",
          "label_en": "Main Client Country / Region",
          "placeholder": "请选择国家",
          "placeholder_en": "Please select a country",
          "help": "(最多选3项)",
          "help_en": "(Up to 3 items)",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "id": "cmp_4",
          "type": "country",
          "key": "country_4",
          "helpPosition": "right",
          "maxSelections": 3
        },
        {
          "label": "主要供应商所在国家/地区",
          "label_en": "Main Supplier Country / Region",
          "placeholder": "请选择国家",
          "placeholder_en": "Please select a country",
          "help": "(最多选3项)",
          "help_en": "(Up to 3 items)",
          "defaultValue": "",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "id": "cmp_5",
          "type": "country",
          "key": "country_5",
          "helpPosition": "right",
          "maxSelections": 3
        },
        {
          "label": "公司官网、网店或社交媒体主页链接(如有)",
          "label_en": "Company website, e-commerce store, or social media homepage (if any)",
          "placeholder": "请输入内容",
          "placeholder_en": "Please enter content",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": false,
          "showLabel": true,
          "id": "cmp_9",
          "type": "input",
          "key": "input_9",
          "helpPosition": "right"
        },
        {
          "label": "是否是上市公司",
          "label_en": "Is your company publicly listed?",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "options": [
            {
              "label": "是",
              "label_en": "Yes",
              "value": "option_1"
            },
            {
              "label": "否",
              "label_en": "No",
              "value": "option_2"
            }
          ],
          "id": "cmp_11",
          "type": "radio",
          "key": "radio_11",
          "helpPosition": "right"
        },
        {
          "label": "股票代码(如适用)",
          "label_en": "Stock Ticker (if applicable)",
          "placeholder": "请输入股票代码(如适用)",
          "placeholder_en": "Please enter stock ticker (if applicable)",
          "help": "",
          "help_en": "",
          "defaultValue": "",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "id": "cmp_12",
          "type": "input",
          "key": "input_12",
          "helpPosition": "right",
          "linkage": {
            "logic": "and",
            "conditions": [
              {
                "fieldKey": "radio_11",
                "value": "option_1"
              }
            ]
          }
        }
      ],
      "title_en": "Business Information",
      "description_en": ""
    },
    {
      "id": "page_1793331484329_13",
      "pageType": "form",
      "showSkeleton": true,
      "title": "声明及签名",
      "description": "",
      "fields": [
        {
          "label": "声明",
          "label_en": "Declaration",
          "placeholder": "请在下方指定区域签名",
          "placeholder_en": "Please sign in the designated area below",
          "help": "",
          "help_en": "",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "options": [
            {
              "label": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。",
              "label_en": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever.",
              "value": "dec_1"
            },
            {
              "label": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。",
              "label_en": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability.",
              "value": "option_2_mvufeei9"
            }
          ],
          "id": "cmp_15",
          "type": "signature",
          "key": "signature_15",
          "helpPosition": "right"
        }
      ],
      "title_en": "Declaration and Signature",
      "description_en": ""
    }
  ],
  "pageConnections": []
};


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

    {
      id: 'page_test_input',
      pageType: 'form',
      title: '第 1 页：单行文本',
      title_en: 'Page 1: Single-line Text (Input)',
      description: '测试单行文本普通文本、数字输入、前置条件联动及自定义校验提示',
      description_en: 'Test text/number input, conditional visibility (linkage) and custom error messages',
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
          linkage: {
            logic: 'and',
            conditions: [
              {
                fieldKey: 'radio_has_parent',
                value: 'yes'
              }
            ]
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
