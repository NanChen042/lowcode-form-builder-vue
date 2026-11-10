import type { FormSchema, ProfileType, ProfileFieldItem } from '@/types/schema';
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplCustomerIcon from '@/assets/templates/c.png';
import tplIndividualIcon from '@/assets/templates/u.png';
import tplEntityIcon from '@/assets/templates/e.png';

export interface ScenarioTemplateMeta {
  key: 'kyc-customer' | 'kyc-individual' | 'kyc-entity';
  type: ProfileType;
  title: string;
  title_en: string;
  tag: string;
  tag_en: string;
  tagColor: string;
  pages: number;
  fields: number;
  descKey: string;
  desc: string;
  desc_en: string;
  stats: string;
  stats_en: string;
  image: string;
  icon: string;
  code: string;
  bannerBgClass: string;
}

export const SCENARIO_TEMPLATES_META: ScenarioTemplateMeta[] = [
  {
    key: 'kyc-customer',
    type: 'customer',
    title: '客户案例 KYC 模板',
    title_en: 'Customer KYC Template',
    tag: '客户案例',
    tag_en: 'Customer',
    tagColor: 'purple',
    pages: 3,
    fields: 9,
    descKey: 'wizard.tplCustomerDesc',
    desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
    desc_en: 'Covers business activities, sales volume, funding source, listed company stock code linkage, and authorized signature.',
    stats: '3 页面 · 9 字段',
    stats_en: '3 Pages · 9 Fields',
    image: tplCustomerImg,
    icon: tplCustomerIcon,
    code: 'SG_CDD_CUSTOMER',
    bannerBgClass: 'bg-[#faf5ff]'
  },
  {
    key: 'kyc-individual',
    type: 'individual',
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC Template',
    tag: '个人案例',
    tag_en: 'Individual',
    tagColor: 'green',
    pages: 5,
    fields: 15,
    descKey: 'wizard.tplIndividualDesc',
    desc: '涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。',
    desc_en: 'Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature.',
    stats: '5 页面 · 15 字段',
    stats_en: '5 Pages · 15 Fields',
    image: tplIndividualImg,
    icon: tplIndividualIcon,
    code: 'SG_CDD_INDIVIDUAL',
    bannerBgClass: 'bg-[#f0fdf4]'
  },
  {
    key: 'kyc-entity',
    type: 'entity',
    title: '实体案例 KYC 模板',
    title_en: 'Entity KYC Template',
    tag: '实体案例',
    tag_en: 'Entity',
    tagColor: 'arcoblue',
    pages: 3,
    fields: 16,
    descKey: 'wizard.tplEntityDesc',
    desc: '涵盖企业多类营业牌照、多持股比例穿透、控股关系声明及董事会决议签署。',
    desc_en: 'Covers corporate business licenses, multi-tier shareholding structure, ownership declaration, and board resolution.',
    stats: '3 页面 · 16 字段',
    stats_en: '3 Pages · 16 Fields',
    image: tplEntityImg,
    icon: tplEntityIcon,
    code: 'SG_CDD_ENTITY',
    bannerBgClass: 'bg-[#f0f9ff]'
  }
];

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

  const isEnEntry =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('lang')?.toLowerCase() === 'en' ||
      (!new URLSearchParams(window.location.search).get('lang') &&
        (localStorage.getItem('builder_current_locale') === 'en' || localStorage.getItem('lowcode_current_locale') === 'en')));

  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: normType,
      baseLocale: isEnEntry ? 'en' : 'zh',
      enabledLocales: isEnEntry ? ['en'] : ['zh', 'en'],
      source: 'diy',
      i18n: {
        zh: {
          title: resolvedTitle,
          ...(resolvedDesc ? { description: resolvedDesc } : {})
        },
        en: {
          title: title_en || resolvedTitle,
          ...(description_en ? { description: description_en } : {})
        }
      }
    },
    pages: [
      {
        id: 'page_profile_0',
        pageType: 'system_profile',
        profileType: normType,
        showSkeleton: true,
        i18n: {
          zh: { title: '基本资料' },
          en: { title: 'Basic Information' }
        },
        fields: [],
        profileFields: defaultFields
      },
      {
        id: 'page_form_1',
        pageType: 'form',
        i18n: {},
        fields: []
      }
    ],
    pageConnections: []
  };
}


export const blankTemplate: FormSchema = createBlankTemplate('customer');


export const RISK_FIXED_OPTIONS = [
  { value: 'yes', i18n: { zh: 'Yes', en: 'Yes' } },
  { value: 'no', i18n: { zh: 'No', en: 'No' } },
  { value: 'na', i18n: { zh: 'Not Applicable', en: 'Not Applicable' } }
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
  const isEnEntry =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('lang')?.toLowerCase() === 'en' ||
      (!new URLSearchParams(window.location.search).get('lang') &&
        (localStorage.getItem('builder_current_locale') === 'en' || localStorage.getItem('lowcode_current_locale') === 'en')));

  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: normType,
      formType: 'risk',
      baseLocale: isEnEntry ? 'en' : 'zh',
      enabledLocales: isEnEntry ? ['en'] : ['zh', 'en'],
      source: 'diy',
      i18n: {
        zh: {
          title: resolvedTitle,
          ...(description ? { description } : {})
        },
        en: {
          title: title_en || resolvedTitle,
          ...(description_en ? { description: description_en } : {})
        }
      }
    },
    pages: [
      {
        id: 'page_risk_0',
        pageType: 'form',
        i18n: {
          zh: {
            title: metaPreset.pageTitle,
            description: metaPreset.pageDesc
          },
          en: {
            title: metaPreset.pageTitleEn,
            description: metaPreset.pageDescEn
          }
        },
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
    "profileType": "customer",
    "formType": "kyc",
    "baseLocale": "zh",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-customer",
    "i18n": {
      "zh": {
        "title": "SG_CDD_CUSTOMER"
      },
      "en": {
        "title": "SG_CDD_CUSTOMER"
      }
    }
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "customer",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "基本资料"
        },
        "en": {
          "title": "Basic Information"
        }
      },
      "fields": [],
      "profileFields": presetCustomerProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "业务信息"
        },
        "en": {
          "title": "Business Information"
        }
      },
      "fields": [
        {
          "id": "cmp_1",
          "type": "textarea",
          "key": "textarea_1",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "公司主营业务说明",
              "placeholder": "请简述公司业务范围及经营模式。"
            },
            "en": {
              "label": "Description of Main Business Activity",
              "placeholder": "Please briefly describe your business scope and operating model"
            }
          }
        },
        {
          "id": "cmp_2",
          "type": "select",
          "key": "select_2",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "年销售额规模",
              "placeholder": "请选择选项"
            },
            "en": {
              "label": "Annual Sales Volume",
              "placeholder": "Please select an option"
            }
          },
          "options": [
            {
              "value": "option_2",
              "i18n": {
                "zh": "SGD 100,000 以下",
                "en": "Below SGD 100,000"
              }
            },
            {
              "value": "option_4_mvudy41x",
              "i18n": {
                "zh": "SGD 100,000 – 1,000,000",
                "en": "SGD 100,000 – 1,000,000"
              }
            },
            {
              "value": "option_5_mvuenpk9",
              "i18n": {
                "zh": "SGD 1,000,000 – 5,000,000",
                "en": "SGD 1,000,000 – 5,000,000"
              }
            },
            {
              "value": "option_6_mvuenxs6",
              "i18n": {
                "zh": "SGD 5,000,000 以上",
                "en": "Above SGD 5,000,000"
              }
            }
          ]
        },
        {
          "id": "cmp_3",
          "type": "select",
          "key": "select_3",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "资金来源",
              "placeholder": "请选择选项"
            },
            "en": {
              "label": "Source of Funds",
              "placeholder": "Please select an option"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "银行贷款",
                "en": "Bank Loans"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "营业收入",
                "en": "Business Income"
              }
            },
            {
              "value": "option_3_mvue6ypd",
              "i18n": {
                "zh": "出资/股权投入",
                "en": "Capital/Shareholding Contribution"
              }
            },
            {
              "value": "option_4_mvuecgqw",
              "i18n": {
                "zh": "公司间资金/借贷",
                "en": "Inter-company Funding/Loans"
              }
            },
            {
              "value": "option_6_mvueciit",
              "i18n": {
                "zh": "个人储蓄",
                "en": "Personal Savings"
              }
            },
            {
              "value": "option_7_mvuecxqt",
              "i18n": {
                "zh": "资产出售（如商业地产、机器设备等）",
                "en": "Sales of Assets (e.g., commercial properties, machineries)"
              }
            },
            {
              "value": "option_7_mvuf55ap",
              "i18n": {
                "zh": "其他",
                "en": "Others"
              }
            }
          ]
        },
        {
          "id": "cmp_4",
          "type": "country",
          "key": "country_4",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "helpPosition": "right",
          "maxSelections": 3,
          "i18n": {
            "zh": {
              "label": "主要客户所在国家/地区",
              "placeholder": "请选择国家",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Main Client Country / Region",
              "placeholder": "Please select a country",
              "help": "(Up to 3 items)"
            }
          }
        },
        {
          "id": "cmp_5",
          "type": "country",
          "key": "country_5",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "helpPosition": "right",
          "maxSelections": 3,
          "i18n": {
            "zh": {
              "label": "主要供应商所在国家/地区",
              "placeholder": "请选择国家",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Main Supplier Country / Region",
              "placeholder": "Please select a country",
              "help": "(Up to 3 items)"
            }
          }
        },
        {
          "id": "cmp_9",
          "type": "input",
          "key": "input_9",
          "inputType": "text",
          "required": false,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "公司官网、网店或社交媒体主页链接(如有)",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Company website, e-commerce store, or social media homepage (if any)",
              "placeholder": "Please enter content"
            }
          }
        },
        {
          "id": "cmp_11",
          "type": "radio",
          "key": "radio_11",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "是否是上市公司"
            },
            "en": {
              "label": "Is your company publicly listed?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_12",
          "type": "input",
          "key": "input_12",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "and",
            "conditions": [
              {
                "fieldKey": "radio_11",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "请说明",
              "placeholder": "请输入股票代码(如适用)"
            },
            "en": {
              "label": "Please provide details",
              "placeholder": "Please enter stock ticker (if applicable)"
            }
          }
        }
      ]
    },
    {
      "id": "page_1793331484329_13",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "声明及签名"
        },
        "en": {
          "title": "Declaration and Signature"
        }
      },
      "fields": [
        {
          "id": "cmp_15",
          "type": "signature",
          "key": "signature_15",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "声明",
              "placeholder": "请在下方指定区域签名",
              "signPlaceholder": "请在此处手写签名"
            },
            "en": {
              "label": "Declaration",
              "placeholder": "Please sign in the designated area below",
              "signPlaceholder": "Please sign here"
            }
          },
          "options": [
            {
              "value": "dec_1",
              "i18n": {
                "zh": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。",
                "en": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever."
              }
            },
            {
              "value": "option_2_mvufeei9",
              "i18n": {
                "zh": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。",
                "en": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability."
              }
            }
          ]
        }
      ]
    }
  ],
  "pageConnections": []
};

export const kycClientTemplate: FormSchema = kycCustomerTemplate;


export const kycIndividualTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "profileType": "individual",
    "formType": "kyc",
    "baseLocale": "zh",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-individual",
    "formId": "individual_diy_161456",
    "serialNo": "individual_diy_161456",
    "createdAt": 1793347455387,
    "i18n": {
      "zh": {
        "title": "SG_CDD_INDIVIDUAL"
      },
      "en": {
        "title": "SG_CDD_INDIVIDUAL"
      }
    }
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "individual",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "基本资料"
        },
        "en": {
          "title": "Basic Information"
        }
      },
      "fields": [],
      "profileFields": presetIndividualProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "最终受益所有人(UBO)"
        },
        "en": {
          "title": "Ultimate Beneficial Owner"
        }
      },
      "fields": [
        {
          "id": "cmp_1",
          "type": "alert",
          "key": "alert_1",
          "required": false,
          "showLabel": true,
          "listStyle": "circle",
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "提示",
              "content": "如果某一名自然人 直接或间接持有公司 25% 以上的股份，或 对公司拥有 重大影响力或实际控制权(即使不持股)，该自然人应被视为公司的 最终受益所有人(UBO)。"
            },
            "en": {
              "label": "Note",
              "content": "If a natural person directly or indirectly holds more than 25% of the shares in the company, or has significant influence or actual control over the company (even if not holding shares), the natural person should be considered as the ultimate beneficial owner (UBO) of the company. "
            }
          }
        },
        {
          "id": "cmp_2",
          "type": "radio",
          "key": "radio_2",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "个人是否持有公司超过25%的股份? "
            },
            "en": {
              "label": "Does individual control more than 25% share of the company？"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_3",
          "type": "radio",
          "key": "radio_3",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "个人是否对公司具有重大控制权？"
            },
            "en": {
              "label": "Does individual have significant control in the company?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "page_1793332682595_4",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "PEP声明"
        },
        "en": {
          "title": "PEP Declaration"
        }
      },
      "fields": [
        {
          "id": "cmp_4",
          "type": "alert",
          "key": "alert_4",
          "required": false,
          "showLabel": true,
          "listStyle": "circle",
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "提示",
              "content": "政治公众人物（PEP）是指目前或曾经在新加坡、其他国家或国际组织中担任重要公共职务的人士，通常包括：\n· 国家元首或政府首脑（如总统、总理）\n· 高级政治人物（如部长、副部长、议员）\n· 高级政府官员（如政府部门或重要监管机构高级官员）\n· 司法或军事机构的高级官员（如最高法院法官、将军）\n· 重要国有企业（SOE）的高级管理人员（如董事长、首席执行官）\n· 中央银行高级管理人员（如行长、副行长）\n· 大型国际组织（如联合国、世界银行、国际货币基金组织）中的高级管理人员（如执行董事、理事会成员）\n\n基于 AML/CFT 合规要求，PEP 还包括：\n· PEP 的直系家庭成员\n· PEP 的密切关联人士 "
            },
            "en": {
              "label": "Note",
              "content": "A Politically Exposed Person (PEP) refers to an individual who currently holds, or has previously held, a prominent public function in Singapore, another country, or an international organisation. This typically includes:\n· Head of state or government, such as President or Prime Minister\n· Senior political figure, such as Minister, Deputy Minister, or Member of Parliament\n· Senior government official, such as a senior official of a government department or key regulatory authority\n· Senior official of a judicial or military body, such as a Supreme Court Judge or General\n· Senior management of an important state-owned enterprise (SOE), such as Chairman or Chief Executive Officer\n· Senior executive of a central bank, such as Governor or Deputy Governor\n· Senior management of a major international organisation, such as Executive Director or Board Member of the United Nations, World Bank, or International Monetary Fund\n\nFor AML/CFT purposes, PEP also includes:\n· Immediate family members of a PEP\n· Close associates of a PEP "
            }
          }
        },
        {
          "id": "cmp_5",
          "type": "radio",
          "key": "radio_5",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "您是否目前在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职？"
            },
            "en": {
              "label": "Are you currently holding a prominent public position in Singapore, in any other country or under the mandate of an international organization?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_7",
          "type": "radio",
          "key": "radio_7",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "您是否曾在新加坡、新加坡以外的国家或地区或受国际组织委托担任重要公职，并已辞去该重要公职？"
            },
            "en": {
              "label": "Have you previously held a prominent public position in Singapore, overseas or under an international organization, and have since stepped down?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_8",
          "type": "radio",
          "key": "radio_8",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "您是否是现任或已卸任的政治人物的家庭成员或关系密切者？"
            },
            "en": {
              "label": "Are you a family member or close associate of a current or former political figure?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_36",
          "type": "checkbox",
          "key": "checkbox_36",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "被识别的PEP是以下哪种类型？"
            },
            "en": {
              "label": "What type of PEP has been identified?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "新加坡敏感政治人物",
                "en": "Singapore-sensitive political figure"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "外国敏感政治人物",
                "en": "Foreign-sensitive political figure"
              }
            },
            {
              "value": "option_3_mw02dacj",
              "i18n": {
                "zh": "国际组织敏感政治人物",
                "en": "International organization PEP"
              }
            },
            {
              "value": "option_4_mw02dju4",
              "i18n": {
                "zh": "敏感政治人物的家庭成员",
                "en": "Family member of a PEP"
              }
            },
            {
              "value": "option_5_mw02dr61",
              "i18n": {
                "zh": "敏感政治人物的亲密伙伴",
                "en": "Close associate of a PEP"
              }
            }
          ],
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
          "id": "cmp_37",
          "type": "textarea",
          "key": "textarea_37",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "与PEP(政界公众人士)的关系说明(如适用)",
              "placeholder": "请输入详细描述..."
            },
            "en": {
              "label": "Description of relationship with the PEP(Politically Exposed Person), if applicable",
              "placeholder": "Please enter detailed description..."
            }
          },
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
          "id": "cmp_38",
          "type": "input",
          "key": "input_38",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "PEP(政界公众人士)的姓名",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Name of the PEP (Politically Exposed Person)",
              "placeholder": "Please enter content"
            }
          },
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
          "id": "cmp_39",
          "type": "input",
          "key": "input_39",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "PEP(政界公众人士)担任重要公职的国家或国际组织名称",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Name of the country or international\norganization where the PEP holds or held a\nprominent public position",
              "placeholder": "Please enter content"
            }
          },
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
          "id": "cmp_40",
          "type": "input",
          "key": "input_40",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "描述正在或曾经担任的重要公共职务",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Description of the prominent public position\ncurrently or previously held",
              "placeholder": "Please enter content"
            }
          },
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
          "id": "cmp_41",
          "type": "date",
          "key": "date_41",
          "endValue": "",
          "dateType": "date",
          "dateMode": "range",
          "enableLongTerm": false,
          "defaultLongTerm": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "曾属于PEP(政界公众人士)身份的起止时间",
              "placeholder": "开始日期",
              "endPlaceholder": "截止日期"
            },
            "en": {
              "label": "Period during which the individual was classified as a PEP",
              "placeholder": "Start Date",
              "endPlaceholder": "End Date"
            }
          },
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
      ]
    },
    {
      "id": "page_1793339330496_9",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "犯罪记录声明"
        },
        "en": {
          "title": "Criminal Record Declaration"
        }
      },
      "fields": [
        {
          "id": "cmp_10",
          "type": "radio",
          "key": "radio_10",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "欺骗，金融诈骗，贿赂，受贿，伪造或逃税的行为"
            },
            "en": {
              "label": "Fraud, financial scams, bribery, acceptance of bribes, forgery, or tax evasion"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_24",
          "type": "radio",
          "key": "radio_24",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "在规范市场或第三方国家的等价市场中进行交易的金融证券股票市场价格进行操控"
            },
            "en": {
              "label": "Manipulation of financial securities or stock prices in regulated or equivalent third-country markets"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_22",
          "type": "radio",
          "key": "radio_22",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "被判处有期徒刑罪行"
            },
            "en": {
              "label": "Criminal offenses resulting in imprisonment"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_32",
          "type": "radio",
          "key": "radio_32",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "涉及使用机密信息的犯罪或违法行为"
            },
            "en": {
              "label": "Crimes or misconduct involving confidential information"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_30",
          "type": "radio",
          "key": "radio_30",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "涉及洗钱、恐怖分子资金筹集/扩大融资等违规及违法活动"
            },
            "en": {
              "label": "Offenses related to money laundering or terrorist financing"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_28",
          "type": "radio",
          "key": "radio_28",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "宣布破产"
            },
            "en": {
              "label": "Bankruptcy declaration"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_26",
          "type": "radio",
          "key": "radio_26",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "其他犯罪行为"
            },
            "en": {
              "label": "Other criminal offenses"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_27",
          "type": "input",
          "key": "input_27",
          "inputType": "text",
          "required": true,
          "showLabel": false,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "说明",
              "placeholder": "请说明"
            },
            "en": {
              "label": "Description",
              "placeholder": "Please enter description"
            }
          },
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
      ]
    },
    {
      "id": "page_1793339759637_34",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "声明及签名"
        },
        "en": {
          "title": "Declaration and Signature"
        }
      },
      "fields": [
        {
          "id": "cmp_35",
          "type": "signature",
          "key": "signature_35",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "声明",
              "placeholder": "请在下方指定区域签名",
              "signPlaceholder": "请在此处手写签名"
            },
            "en": {
              "label": "Applicant's Declaration",
              "placeholder": "Please sign in the designated area below",
              "signPlaceholder": "Please sign here"
            }
          },
          "options": [
            {
              "value": "dec_1",
              "i18n": {
                "zh": "本人特此声明，以上所提供的信息均真实、准确且完整。本人知悉，如发现有任何虚假陈述或故意隐瞒重要事实的行为，本人可能会面临法律起诉及刑事处罚。",
                "en": "I hereby declare that all information provided above is true, accurate and complete. I acknowledge that if I make any false statements or intentionally conceal material facts, I may bear corresponding legal liabilities, including criminal liability."
              }
            }
          ]
        }
      ]
    }
  ],
  "pageConnections": []
};

export const kycEntityTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "profileType": "entity",
    "formType": "kyc",
    "baseLocale": "zh",
    "enabledLocales": [
      "zh",
      "en"
    ],
    "source": "template",
    "templateKey": "kyc-entity",
    "i18n": {
      "zh": {
        "title": "SG_CDD_ENTITY"
      },
      "en": {
        "title": "SG_CDD_ENTITY"
      }
    }
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "entity",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "基本资料"
        },
        "en": {
          "title": "Basic Information"
        }
      },
      "fields": [],
      "profileFields": presetEntityProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "业务信息"
        },
        "en": {
          "title": "Business Information"
        }
      },
      "fields": [
        {
          "id": "cmp_1",
          "type": "textarea",
          "key": "textarea_1",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "公司主营业务说明",
              "placeholder": "请简述公司业务范围及经营模式。"
            },
            "en": {
              "label": "Description of Main Business Activity",
              "placeholder": "Please briefly describe your business scope and operating model"
            }
          }
        },
        {
          "id": "cmp_2",
          "type": "select",
          "key": "select_2",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "年销售额规模",
              "placeholder": "请选择选项"
            },
            "en": {
              "label": "Annual Sales Volume",
              "placeholder": "Please select an option"
            }
          },
          "options": [
            {
              "value": "option_2",
              "i18n": {
                "zh": "SGD 100,000 以下",
                "en": "Below SGD 100,000"
              }
            },
            {
              "value": "option_4_mvudy41x",
              "i18n": {
                "zh": "SGD 100,000 – 1,000,000",
                "en": "SGD 100,000 – 1,000,000"
              }
            },
            {
              "value": "option_5_mvuenpk9",
              "i18n": {
                "zh": "SGD 1,000,000 – 5,000,000",
                "en": "SGD 1,000,000 – 5,000,000"
              }
            },
            {
              "value": "option_6_mvuenxs6",
              "i18n": {
                "zh": "SGD 5,000,000 以上",
                "en": "Above SGD 5,000,000"
              }
            }
          ]
        },
        {
          "id": "cmp_3",
          "type": "select",
          "key": "select_3",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "资金来源",
              "placeholder": "请选择选项"
            },
            "en": {
              "label": "Source of Funds",
              "placeholder": "Please select an option"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "银行贷款",
                "en": "Bank Loans"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "营业收入",
                "en": "Business Income"
              }
            },
            {
              "value": "option_3_mvue6ypd",
              "i18n": {
                "zh": "出资/股权投入",
                "en": "Capital/Shareholding Contribution"
              }
            },
            {
              "value": "option_4_mvuecgqw",
              "i18n": {
                "zh": "公司间资金/借贷",
                "en": "Inter-company Funding/Loans"
              }
            },
            {
              "value": "option_6_mvueciit",
              "i18n": {
                "zh": "个人储蓄",
                "en": "Personal Savings"
              }
            },
            {
              "value": "option_7_mvuecxqt",
              "i18n": {
                "zh": "资产出售（如商业地产、机器设备等）",
                "en": "Sales of Assets (e.g., commercial properties, machineries)"
              }
            },
            {
              "value": "option_7_mvuf55ap",
              "i18n": {
                "zh": "其他",
                "en": "Others"
              }
            }
          ]
        },
        {
          "id": "cmp_4",
          "type": "country",
          "key": "country_4",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "helpPosition": "right",
          "maxSelections": 3,
          "i18n": {
            "zh": {
              "label": "主要客户所在国家/地区",
              "placeholder": "请选择国家",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Main Client Country / Region",
              "placeholder": "Please select a country",
              "help": "(Up to 3 items)"
            }
          }
        },
        {
          "id": "cmp_5",
          "type": "country",
          "key": "country_5",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "helpPosition": "right",
          "maxSelections": 3,
          "i18n": {
            "zh": {
              "label": "主要供应商所在国家/地区",
              "placeholder": "请选择国家",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Main Supplier Country / Region",
              "placeholder": "Please select a country",
              "help": "(Up to 3 items)"
            }
          }
        },
        {
          "id": "cmp_9",
          "type": "input",
          "key": "input_9",
          "inputType": "text",
          "required": false,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "公司官网、网店或社交媒体主页链接(如有)",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Company website, e-commerce store, or social media homepage (if any)",
              "placeholder": "Please enter content"
            }
          }
        },
        {
          "id": "cmp_11",
          "type": "radio",
          "key": "radio_11",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "是否是上市公司"
            },
            "en": {
              "label": "Is your company publicly listed?"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No"
              }
            }
          ]
        },
        {
          "id": "cmp_12",
          "type": "input",
          "key": "input_12",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "股票代码(如适用)",
              "placeholder": "请输入股票代码(如适用)"
            },
            "en": {
              "label": "Stock Ticker (if applicable)",
              "placeholder": "Please enter stock ticker (if applicable)"
            }
          },
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
      ]
    },
    {
      "id": "page_1793331484329_13",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "声明及签名"
        },
        "en": {
          "title": "Declaration and Signature"
        }
      },
      "fields": [
        {
          "id": "cmp_15",
          "type": "signature",
          "key": "signature_15",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "声明",
              "placeholder": "请在下方指定区域签名",
              "signPlaceholder": "请在此处手写签名"
            },
            "en": {
              "label": "Declaration",
              "placeholder": "Please sign in the designated area below",
              "signPlaceholder": "Please sign here"
            }
          },
          "options": [
            {
              "value": "dec_1",
              "i18n": {
                "zh": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。",
                "en": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever."
              }
            },
            {
              "value": "option_2_mvufeei9",
              "i18n": {
                "zh": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。",
                "en": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability."
              }
            }
          ]
        }
      ]
    }
  ],
  "pageConnections": []
};

export const multilingualMockTemplate: FormSchema = {
  "schemaVersion": "1.0.0",
  "meta": {
    "profileType": "customer",
    "formType": "kyc",
    "baseLocale": "zh",
    "enabledLocales": [
      "zh",
      "en",
      "ja"
    ],
    "source": "template",
    "templateKey": "kyc-multilang-demo",
    "formId": "cus_tpl_20261013_multilang",
    "serialNo": "cus_tpl_20261013_multilang",
    "i18n": {
      "zh": {
        "title": "企业客户多语言尽职调查问卷",
        "description": "多语言企业客户尽职调查问卷示例"
      },
      "en": {
        "title": "Multilingual Corporate CDD Questionnaire",
        "description": "Multilingual Corporate CDD Questionnaire Demo"
      }
    }
  },
  "pages": [
    {
      "id": "page_profile_0",
      "pageType": "system_profile",
      "profileType": "customer",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "基本资料"
        },
        "en": {
          "title": "Basic Information"
        },
        "ja": {
          "title": "基本情報"
        }
      },
      "fields": [],
      "profileFields": presetCustomerProfileFields
    },
    {
      "id": "page_form_1",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "业务与合规信息",
          "description": "请如实填写贵司主营业务、资金来源及合规联络信息。"
        },
        "en": {
          "title": "Business & Compliance Information",
          "description": "Please truthfully provide your core business activities, source of funds, and compliance contact details."
        },
        "ja": {
          "title": "事業およびコンプライアンス情報",
          "description": "貴社の主な事業内容、資金源、およびコンプライアンス連絡先を正確にご記入ください。"
        }
      },
      "fields": [
        {
          "id": "cmp_alert_1",
          "type": "alert",
          "key": "alert_notice",
          "required": false,
          "showLabel": true,
          "listStyle": "circle",
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "填报须知",
              "content": "请在提交前确认以下事项：\n· 所有金额均以新加坡元 (SGD) 计价\n· 若涉及跨国业务，请完整披露前三大交易对手国家/地区"
            },
            "en": {
              "label": "Filing Instructions",
              "content": "Please confirm the following before submission:\n· All monetary amounts are denominated in Singapore Dollars (SGD)\n· If cross-border business is involved, please disclose your top 3 counterparty countries/regions"
            },
            "ja": {
              "label": "記入上の注意",
              "content": "提出前に以下の事項をご確認ください：\n· すべての金額はシンガポールドル（SGD）建てです\n· クロスボーダー取引がある場合は、上位3カ国の取引先国・地域を開示してください"
            }
          }
        },
        {
          "id": "cmp_1",
          "type": "textarea",
          "key": "textarea_1",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "公司主营业务说明",
              "placeholder": "请简述公司业务范围及经营模式。",
              "help": "建议涵盖核心产品/服务及主要目标市场",
              "customErrorMessage": "请填写公司主营业务说明"
            },
            "en": {
              "label": "Description of Main Business Activity",
              "placeholder": "Please briefly describe your business scope and operating model",
              "help": "Recommended to cover core products/services and target markets",
              "customErrorMessage": "Please provide a description of your main business activity"
            },
            "ja": {
              "label": "主な事業内容の説明",
              "placeholder": "事業範囲およびビジネスモデルを簡潔にご記入ください。",
              "help": "主力製品・サービスおよび主要ターゲット市場を含めることを推奨します",
              "customErrorMessage": "主な事業内容をご入力ください"
            }
          }
        },
        {
          "id": "cmp_2",
          "type": "select",
          "key": "select_2",
          "multiple": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "年销售额规模",
              "placeholder": "请选择选项"
            },
            "en": {
              "label": "Annual Sales Volume",
              "placeholder": "Please select an option"
            },
            "ja": {
              "label": "年間売上高規模",
              "placeholder": "選択してください"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "SGD 100,000 以下",
                "en": "Below SGD 100,000",
                "ja": "SGD 100,000 未満"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "SGD 100,000 – 1,000,000",
                "en": "SGD 100,000 – 1,000,000",
                "ja": "SGD 100,000 ～ 1,000,000"
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": "SGD 1,000,000 – 5,000,000",
                "en": "SGD 1,000,000 – 5,000,000",
                "ja": "SGD 1,000,000 ～ 5,000,000"
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": "SGD 5,000,000 以上",
                "en": "Above SGD 5,000,000",
                "ja": "SGD 5,000,000 以上"
              }
            }
          ]
        },
        {
          "id": "cmp_3",
          "type": "checkbox",
          "key": "checkbox_funds",
          "layout": "stack",
          "required": true,
          "showLabel": true,
          "maxSelections": 3,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "主要资金来源渠道",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Primary Source of Funds",
              "help": "(Up to 3 items)"
            },
            "ja": {
              "label": "主な資金源チャネル",
              "help": "（最大3つまで選択）"
            }
          },
          "options": [
            {
              "value": "bank_loan",
              "i18n": {
                "zh": "银行贷款",
                "en": "Bank Loans",
                "ja": "銀行借入"
              }
            },
            {
              "value": "biz_income",
              "i18n": {
                "zh": "营业收入",
                "en": "Business Income",
                "ja": "事業収入"
              }
            },
            {
              "value": "capital_contribution",
              "i18n": {
                "zh": "出资/股权投入",
                "en": "Capital/Shareholding Contribution",
                "ja": "出資金・株式払込金"
              }
            },
            {
              "value": "intercompany",
              "i18n": {
                "zh": "公司间资金/借贷",
                "en": "Inter-company Funding/Loans",
                "ja": "グループ会社間資金・貸付"
              }
            }
          ]
        },
        {
          "id": "cmp_4",
          "type": "country",
          "key": "country_4",
          "required": true,
          "showLabel": true,
          "multiple": true,
          "helpPosition": "right",
          "maxSelections": 3,
          "i18n": {
            "zh": {
              "label": "主要客户所在国家/地区",
              "placeholder": "请选择国家",
              "help": "(最多选3项)"
            },
            "en": {
              "label": "Main Client Country / Region",
              "placeholder": "Please select a country",
              "help": "(Up to 3 items)"
            },
            "ja": {
              "label": "主要顧客の所在国・地域",
              "placeholder": "国・地域を選択してください",
              "help": "（最大3つまで選択）"
            }
          }
        },
        {
          "id": "cmp_date_1",
          "type": "date",
          "key": "date_license",
          "dateType": "date",
          "dateMode": "range",
          "enableLongTerm": true,
          "defaultLongTerm": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "营业执照有效期限",
              "placeholder": "开始日期",
              "endPlaceholder": "截止日期",
              "longTermText": "长期有效"
            },
            "en": {
              "label": "Business License Validity Period",
              "placeholder": "Start Date",
              "endPlaceholder": "End Date",
              "longTermText": "Long-term"
            },
            "ja": {
              "label": "営業許可証の有効期間",
              "placeholder": "開始日",
              "endPlaceholder": "終了日",
              "longTermText": "無期限（長期有効）"
            }
          }
        },
        {
          "id": "cmp_11",
          "type": "radio",
          "key": "radio_11",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "是否是上市公司"
            },
            "en": {
              "label": "Is your company publicly listed?"
            },
            "ja": {
              "label": "上場企業ですか？"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": "是",
                "en": "Yes",
                "ja": "はい"
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": "否",
                "en": "No",
                "ja": "いいえ"
              }
            }
          ]
        },
        {
          "id": "cmp_12",
          "type": "input",
          "key": "input_12",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "股票代码(如适用)",
              "placeholder": "请输入股票代码(如适用)"
            },
            "en": {
              "label": "Stock Ticker (if applicable)",
              "placeholder": "Please enter stock ticker (if applicable)"
            },
            "ja": {
              "label": "証券コード（該当する場合）",
              "placeholder": "証券コードをご入力ください"
            }
          },
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
      ]
    },
    {
      "id": "page_1793331484329_13",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "声明及签名"
        },
        "en": {
          "title": "Declaration and Signature"
        },
        "ja": {
          "title": "宣誓および署名"
        }
      },
      "fields": [
        {
          "id": "cmp_15",
          "type": "signature",
          "key": "signature_15",
          "showLabel": false,
          "required": true,
          "declarationRequired": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "声明",
              "placeholder": "请在下方指定区域签名",
              "signPlaceholder": "请在此处手写签名",
              "declarationErrorMessage": "请先阅读并勾选全部法定声明条款"
            },
            "en": {
              "label": "Declaration",
              "placeholder": "Please sign in the designated area below",
              "signPlaceholder": "Please sign here",
              "declarationErrorMessage": "Please read and accept all statutory declaration terms first"
            },
            "ja": {
              "label": "宣誓事項",
              "placeholder": "下の指定エリアに署名してください",
              "signPlaceholder": "ここに手書きで署名してください",
              "declarationErrorMessage": "すべての法定宣誓事項をお読みの上、チェックを入れてください"
            }
          },
          "options": [
            {
              "value": "dec_1",
              "i18n": {
                "zh": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。",
                "en": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever.",
                "ja": "私は、当社が関連規制の要件に従い、実質的支配者（UBO）に関するすべての情報を完全かつ誠実に開示しており、いかなる隠蔽、脱漏、または開示回避も存在しないことをここに宣誓いたします。"
              }
            },
            {
              "value": "option_2_mvufeei9",
              "i18n": {
                "zh": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。",
                "en": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability.",
                "ja": "私は、当会社または法人から正式な権限を付与され、その代表として本質問票、書類、および宣誓書を作成・提出することを確認いたします。\nまた、上記で提供したすべての情報、書類、および宣誓事項が真実、正確かつ完全であることを宣誓いたします。虚偽の陳述、誤解を招く陳述、または重要な事実の意図的な隠蔽があった場合、刑事責任を含む法的責任を負う可能性があることを理解しています。"
              }
            }
          ]
        }
      ]
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
          longTermText: '长期',
          longTermText_en: 'Long-term',
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
          placeholder: '开始日期',
          placeholder_en: 'Start Date',
          endPlaceholder: '截止日期',
          endPlaceholder_en: 'End Date'
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
          placeholder: '请在下方指定区域签名',
          placeholder_en: 'Please sign in the designated area below',
          signPlaceholder: '请在此处手写签名',
          signPlaceholder_en: 'Please sign here',
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

const TRANSLATABLE_PROPS = [
  'label',
  'placeholder',
  'endPlaceholder',
  'longTermText',
  'signPlaceholder',
  'help',
  'content',
  'customErrorMessage',
  'declarationErrorMessage',
  'customDeclarationErrorMessage'
];

export function normalizeSchemaToUnifiedI18n(schema: FormSchema): FormSchema {
  if (!schema) return schema;
  const meta = schema.meta as any;
  if (meta) {
    if (!meta.baseLocale) meta.baseLocale = 'zh';
    if (!meta.i18n) meta.i18n = {};
    const zhTitle = meta.i18n.zh?.title ?? meta.title ?? '';
    const enTitle = meta.i18n.en?.title ?? meta.title_en ?? '';
    const zhDesc = meta.i18n.zh?.description ?? meta.description ?? '';
    const enDesc = meta.i18n.en?.description ?? meta.description_en ?? '';
    if (zhTitle || zhDesc) {
      meta.i18n.zh = {
        ...(meta.i18n.zh || {}),
        ...(zhTitle ? { title: zhTitle } : {}),
        ...(zhDesc ? { description: zhDesc } : {})
      };
    }
    if (enTitle || enDesc) {
      meta.i18n.en = {
        ...(meta.i18n.en || {}),
        ...(enTitle ? { title: enTitle } : {}),
        ...(enDesc ? { description: enDesc } : {})
      };
    }
    delete meta.title;
    delete meta.title_en;
    delete meta.description;
    delete meta.description_en;
  }

  for (const page of schema.pages || []) {
    const p = page as any;
    if (!p.i18n) p.i18n = {};
    const pTitleZh = p.i18n.zh?.title ?? p.title ?? '';
    const pTitleEn = p.i18n.en?.title ?? p.title_en ?? '';
    const pDescZh = p.i18n.zh?.description ?? p.description ?? '';
    const pDescEn = p.i18n.en?.description ?? p.description_en ?? '';
    if (pTitleZh || pDescZh) {
      p.i18n.zh = {
        ...(p.i18n.zh || {}),
        ...(pTitleZh ? { title: pTitleZh } : {}),
        ...(pDescZh ? { description: pDescZh } : {})
      };
    }
    if (pTitleEn || pDescEn) {
      p.i18n.en = {
        ...(p.i18n.en || {}),
        ...(pTitleEn ? { title: pTitleEn } : {}),
        ...(pDescEn ? { description: pDescEn } : {})
      };
    }
    delete p.title;
    delete p.title_en;
    delete p.description;
    delete p.description_en;

    for (const f of p.fields || []) {
      if (!f.i18n) f.i18n = {};
      for (const prop of TRANSLATABLE_PROPS) {
        const valZh = f.i18n.zh?.[prop] ?? f[prop];
        const valEn = f.i18n.en?.[prop] ?? f[`${prop}_en`];
        if (valZh !== undefined && valZh !== null && String(valZh).trim() !== '') {
          if (!f.i18n.zh) f.i18n.zh = {};
          f.i18n.zh[prop] = String(valZh);
        }
        if (valEn !== undefined && valEn !== null && String(valEn).trim() !== '') {
          if (!f.i18n.en) f.i18n.en = {};
          f.i18n.en[prop] = String(valEn);
        }
        delete f[prop];
        delete f[`${prop}_en`];
      }
      if (f.defaultValue === '') delete f.defaultValue;
      if (Array.isArray(f.options)) {
        f.options = f.options.map((opt: any) => {
          const optI18n: Record<string, string> = { ...(opt.i18n || {}) };
          const oZh = typeof opt.i18n?.zh === 'object' ? opt.i18n.zh.label : (opt.i18n?.zh ?? opt.label);
          const oEn = typeof opt.i18n?.en === 'object' ? opt.i18n.en.label : (opt.i18n?.en ?? opt.label_en);
          if (oZh !== undefined && oZh !== null && String(oZh).trim() !== '') {
            optI18n.zh = String(oZh);
          }
          if (oEn !== undefined && oEn !== null && String(oEn).trim() !== '') {
            optI18n.en = String(oEn);
          }
          return {
            value: opt.value,
            i18n: optI18n
          };
        });
      }
    }
  }
  return schema;
}

normalizeSchemaToUnifiedI18n(kycCustomerTemplate);
normalizeSchemaToUnifiedI18n(kycIndividualTemplate);
normalizeSchemaToUnifiedI18n(kycEntityTemplate);
normalizeSchemaToUnifiedI18n(allComponentsDemoTemplate);
normalizeSchemaToUnifiedI18n(blankTemplate);
