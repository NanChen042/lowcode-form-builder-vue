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
    fields: 22,
    descKey: 'wizard.tplIndividualDesc',
    desc: '涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。',
    desc_en: 'Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature.',
    stats: '5 页面 · 22 字段',
    stats_en: '5 Pages · 22 Fields',
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
    fields: 9,
    descKey: 'wizard.tplEntityDesc',
    desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
    desc_en: 'Covers corporate business activities, sales volume, funding source, listed company stock code linkage, and authorized signature.',
    stats: '3 页面 · 9 字段',
    stats_en: '3 Pages · 9 Fields',
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
  const isEnEntry =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('lang')?.toLowerCase() === 'en' ||
      (!new URLSearchParams(window.location.search).get('lang') &&
        (localStorage.getItem('builder_current_locale') === 'en' || localStorage.getItem('lowcode_current_locale') === 'en')));

  const defaultMetaMap: Record<string, { title: string; desc: string }> = {
    customer: { title: isEnEntry ? 'Corporate Customer CDD Questionnaire' : '企业客户尽职调查问卷', desc: '' },
    client: { title: isEnEntry ? 'Corporate Customer CDD Questionnaire' : '企业客户尽职调查问卷', desc: '' },
    individual: { title: isEnEntry ? 'Individual CDD Questionnaire' : '个人客户尽职调查问卷', desc: '' },
    entity: { title: isEnEntry ? 'Corporate Entity CDD Questionnaire' : '实体企业尽职调查问卷', desc: '' }
  };
  const resolvedTitle = title || defaultMetaMap[normType]?.title || (isEnEntry ? 'Corporate Customer CDD Questionnaire' : '企业客户尽职调查问卷');
  const resolvedDesc = description || '';

  const defaultFields = normType === 'individual'
    ? presetIndividualProfileFields
    : (normType === 'entity' ? presetEntityProfileFields : presetCustomerProfileFields);

  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: normType,
      baseLocale: isEnEntry ? 'en' : 'zh',
      enabledLocales: isEnEntry ? ['en'] : ['zh', 'en'],
      source: 'diy',
      i18n: isEnEntry
        ? {
            en: {
              title: title_en || resolvedTitle,
              ...(description_en ? { description: description_en } : {})
            }
          }
        : {
            zh: {
              title: resolvedTitle,
              ...(resolvedDesc ? { description: resolvedDesc } : {})
            }
          }
    },
    pages: [
      {
        id: 'page_profile_0',
        pageType: 'system_profile',
        profileType: normType,
        showSkeleton: true,
        i18n: isEnEntry
          ? { en: { title: 'Basic Information' } }
          : { zh: { title: '基本资料' } },
        fields: [],
        profileFields: defaultFields
      },
      {
        id: 'page_form_1',
        pageType: 'form',
        i18n: {},
        fields: []
      }
    ]
  };
}


export const blankTemplate: FormSchema = createBlankTemplate('customer');


export const RISK_FIXED_OPTIONS = [
  { value: 'yes', i18n: { zh: { label: 'Yes' }, en: { label: 'Yes' } } },
  { value: 'no', i18n: { zh: { label: 'No' }, en: { label: 'No' } } },
  { value: 'na', i18n: { zh: { label: 'Not Applicable' }, en: { label: 'Not Applicable' } } }
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

  const presetGroups = [{ id: 'grp_risk_1', i18n: {} }];
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
      i18n: isEnEntry
        ? {
            en: {
              title: title_en || resolvedTitle,
              ...(description_en || description ? { description: description_en || description } : {})
            }
          }
        : {
            zh: {
              title: resolvedTitle,
              ...(description ? { description } : {})
            }
          }
    },
    pages: [
      {
        id: 'page_risk_0',
        pageType: 'form',
        i18n: isEnEntry
          ? {
              en: {
                title: metaPreset.pageTitleEn,
                description: metaPreset.pageDescEn
              }
            }
          : {
              zh: {
                title: metaPreset.pageTitle,
                description: metaPreset.pageDesc
              }
            },
        groups: presetGroups,
        fields: [
          {
            id: 'cmp_risk_default_1',
            type: 'radio',
            key: 'radio_risk_1',
            required: true,
            showLabel: true,
            layout: 'inline',
            weight: 1,
            groupId: 'grp_risk_1',
            i18n: {},
            options: JSON.parse(JSON.stringify(RISK_FIXED_OPTIONS))
          }
        ]
      }
    ]
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
        "title": "企业客户尽职调查问卷",
        "description": "适用于企业及机构客户身份认证与合规KYC尽职调查场景。"
      },
      "en": {
        "title": "Corporate Customer CDD Questionnaire",
        "description": "Applicable for corporate and institutional client KYC due diligence."
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
      "id": "page_biz_info",
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
              "value": "option_1",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 以下"
                },
                "en": {
                  "label": "Below SGD 100,000"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 – 1,000,000"
                },
                "en": {
                  "label": "SGD 100,000 – 1,000,000"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "SGD 1,000,000 – 5,000,000"
                },
                "en": {
                  "label": "SGD 1,000,000 – 5,000,000"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "SGD 5,000,000 以上"
                },
                "en": {
                  "label": "Above SGD 5,000,000"
                }
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
                "zh": {
                  "label": "银行贷款"
                },
                "en": {
                  "label": "Bank Loans"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "营业收入"
                },
                "en": {
                  "label": "Business Income"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "出资/股权投入"
                },
                "en": {
                  "label": "Capital/Shareholding Contribution"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "公司间资金/借贷"
                },
                "en": {
                  "label": "Inter-company Funding/Loans"
                }
              }
            },
            {
              "value": "option_5",
              "i18n": {
                "zh": {
                  "label": "个人储蓄"
                },
                "en": {
                  "label": "Personal Savings"
                }
              }
            },
            {
              "value": "option_6",
              "i18n": {
                "zh": {
                  "label": "资产出售（如商业地产、机器设备等）"
                },
                "en": {
                  "label": "Sales of Assets (e.g., commercial properties, machineries)"
                }
              }
            },
            {
              "value": "option_7",
              "i18n": {
                "zh": {
                  "label": "其他"
                },
                "en": {
                  "label": "Others"
                }
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
          "id": "cmp_6",
          "type": "input",
          "key": "input_6",
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
          "id": "cmp_7",
          "type": "radio",
          "key": "radio_7",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_8",
          "type": "input",
          "key": "input_8",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "and",
            "conditions": [
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "股票代码(如适用)",
              "placeholder": "请输入股票代码(如适用)"
            },
            "en": {
              "label": "Stock Ticker (if applicable)",
              "placeholder": "Please enter stock ticker (if applicable)"
            }
          }
        }
      ]
    },
    {
      "id": "page_declaration",
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
          "id": "cmp_9",
          "type": "signature",
          "key": "signature_9",
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
                "zh": {
                  "label": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。"
                },
                "en": {
                  "label": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever."
                }
              }
            },
            {
              "value": "dec_2",
              "i18n": {
                "zh": {
                  "label": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。"
                },
                "en": {
                  "label": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability."
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

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
    "i18n": {
      "zh": {
        "title": "个人客户尽职调查问卷",
        "description": "适用于自然人、个人客户身份认证与合规KYC尽职调查场景。"
      },
      "en": {
        "title": "Individual CDD Questionnaire",
        "description": "Applicable for individual customer identification and compliance KYC due diligence."
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
      "id": "page_ubo",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "page_pep",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_6",
          "type": "radio",
          "key": "radio_6",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_8",
          "type": "checkbox",
          "key": "checkbox_8",
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
                "zh": {
                  "label": "新加坡敏感政治人物"
                },
                "en": {
                  "label": "Singapore-sensitive political figure"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "外国敏感政治人物"
                },
                "en": {
                  "label": "Foreign-sensitive political figure"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "国际组织敏感政治人物"
                },
                "en": {
                  "label": "International organization PEP"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "敏感政治人物的家庭成员"
                },
                "en": {
                  "label": "Family member of a PEP"
                }
              }
            },
            {
              "value": "option_5",
              "i18n": {
                "zh": {
                  "label": "敏感政治人物的亲密伙伴"
                },
                "en": {
                  "label": "Close associate of a PEP"
                }
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
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "id": "cmp_9",
          "type": "textarea",
          "key": "textarea_9",
          "required": true,
          "showLabel": true,
          "minRows": 3,
          "maxRows": 6,
          "maxLength": 800,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "与PEP(政界公众人士)的关系说明(如适用)",
              "placeholder": "请输入详细描述..."
            },
            "en": {
              "label": "Description of relationship with the PEP(Politically Exposed Person), if applicable",
              "placeholder": "Please enter detailed description..."
            }
          }
        },
        {
          "id": "cmp_10",
          "type": "input",
          "key": "input_10",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "PEP(政界公众人士)的姓名",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Name of the PEP (Politically Exposed Person)",
              "placeholder": "Please enter content"
            }
          }
        },
        {
          "id": "cmp_11",
          "type": "input",
          "key": "input_11",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "PEP(政界公众人士)担任重要公职的国家或国际组织名称",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Name of the country or international organization where the PEP holds or held a prominent public position",
              "placeholder": "Please enter content"
            }
          }
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
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "描述正在或曾经担任的重要公共职务",
              "placeholder": "请输入内容"
            },
            "en": {
              "label": "Description of the prominent public position currently or previously held",
              "placeholder": "Please enter content"
            }
          }
        },
        {
          "id": "cmp_13",
          "type": "date",
          "key": "date_13",
          "endValue": "",
          "dateType": "date",
          "dateMode": "range",
          "enableLongTerm": false,
          "defaultLongTerm": false,
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_5",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_6",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
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
          }
        }
      ]
    },
    {
      "id": "page_criminal",
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
          "id": "cmp_14",
          "type": "radio",
          "key": "radio_14",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_15",
          "type": "radio",
          "key": "radio_15",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_16",
          "type": "radio",
          "key": "radio_16",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_17",
          "type": "radio",
          "key": "radio_17",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_18",
          "type": "radio",
          "key": "radio_18",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_19",
          "type": "radio",
          "key": "radio_19",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_20",
          "type": "radio",
          "key": "radio_20",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_21",
          "type": "input",
          "key": "input_21",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_14",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_15",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_16",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_17",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_18",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_19",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_20",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "犯罪记录详细说明",
              "placeholder": "请详细说明相关涉案事项及判定结果"
            },
            "en": {
              "label": "Details of Criminal Record",
              "placeholder": "Please provide details of the offense and outcome"
            }
          }
        }
      ]
    },
    {
      "id": "page_declaration",
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
          "id": "cmp_22",
          "type": "signature",
          "key": "signature_22",
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
                "zh": {
                  "label": "本人特此声明，以上所提供的信息均真实、准确且完整。本人知悉，如发现有任何虚假陈述或故意隐瞒重要事实的行为，本人可能会面临法律起诉及刑事处罚。"
                },
                "en": {
                  "label": "I hereby declare that all information provided above is true, accurate and complete. I acknowledge that if I make any false statements or intentionally conceal material facts, I may bear corresponding legal liabilities, including criminal liability."
                }
              }
            }
          ]
        }
      ]
    }
  ]
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
        "title": "实体企业尽职调查问卷",
        "description": "实体企业尽职调查问卷标准模板"
      },
      "en": {
        "title": "Corporate Entity CDD Questionnaire",
        "description": "Standard Corporate Entity Customer Due Diligence Questionnaire"
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
      "id": "page_biz_info",
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
              "value": "option_1",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 以下"
                },
                "en": {
                  "label": "Below SGD 100,000"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 – 1,000,000"
                },
                "en": {
                  "label": "SGD 100,000 – 1,000,000"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "SGD 1,000,000 – 5,000,000"
                },
                "en": {
                  "label": "SGD 1,000,000 – 5,000,000"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "SGD 5,000,000 以上"
                },
                "en": {
                  "label": "Above SGD 5,000,000"
                }
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
                "zh": {
                  "label": "银行贷款"
                },
                "en": {
                  "label": "Bank Loans"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "营业收入"
                },
                "en": {
                  "label": "Business Income"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "出资/股权投入"
                },
                "en": {
                  "label": "Capital/Shareholding Contribution"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "公司间资金/借贷"
                },
                "en": {
                  "label": "Inter-company Funding/Loans"
                }
              }
            },
            {
              "value": "option_5",
              "i18n": {
                "zh": {
                  "label": "个人储蓄"
                },
                "en": {
                  "label": "Personal Savings"
                }
              }
            },
            {
              "value": "option_6",
              "i18n": {
                "zh": {
                  "label": "资产出售（如商业地产、机器设备等）"
                },
                "en": {
                  "label": "Sales of Assets (e.g., commercial properties, machineries)"
                }
              }
            },
            {
              "value": "option_7",
              "i18n": {
                "zh": {
                  "label": "其他"
                },
                "en": {
                  "label": "Others"
                }
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
          "id": "cmp_6",
          "type": "input",
          "key": "input_6",
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
          "id": "cmp_7",
          "type": "radio",
          "key": "radio_7",
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
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                }
              }
            }
          ]
        },
        {
          "id": "cmp_8",
          "type": "input",
          "key": "input_8",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "and",
            "conditions": [
              {
                "fieldKey": "radio_7",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "股票代码(如适用)",
              "placeholder": "请输入股票代码(如适用)"
            },
            "en": {
              "label": "Stock Ticker (if applicable)",
              "placeholder": "Please enter stock ticker (if applicable)"
            }
          }
        }
      ]
    },
    {
      "id": "page_declaration",
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
          "id": "cmp_9",
          "type": "signature",
          "key": "signature_9",
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
                "zh": {
                  "label": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。"
                },
                "en": {
                  "label": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever."
                }
              }
            },
            {
              "value": "dec_2",
              "i18n": {
                "zh": {
                  "label": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。"
                },
                "en": {
                  "label": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability."
                }
              }
            }
          ]
        }
      ]
    }
  ]
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
      "zh-HK"
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
      },
      "zh-HK": {
        "title": "企業客戶多語言盡職調查問卷",
        "description": "多語言企業客戶盡職調查問卷範例"
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
        "zh-HK": {
          "title": "基本資料"
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
        "zh-HK": {
          "title": "業務與合規資訊",
          "description": "請如實填寫貴司主營業務、資金來源及合規聯絡資訊。"
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
            "zh-HK": {
              "label": "填報須知",
              "content": "請在提交前確認以下事項：\n· 所有金額均以新加坡元 (SGD) 計價\n· 若涉及跨國業務，請完整披露前三大交易對手國家/地區"
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
            "zh-HK": {
              "label": "公司主營業務說明",
              "placeholder": "請簡述公司業務範圍及經營模式。",
              "help": "建議涵蓋核心產品/服務及主要目標市場",
              "customErrorMessage": "請填寫公司主營業務說明"
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
            "zh-HK": {
              "label": "年銷售額規模",
              "placeholder": "請選擇選項"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 以下"
                },
                "en": {
                  "label": "Below SGD 100,000"
                },
                "zh-HK": {
                  "label": "SGD 100,000 以下"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "SGD 100,000 – 1,000,000"
                },
                "en": {
                  "label": "SGD 100,000 – 1,000,000"
                },
                "zh-HK": {
                  "label": "SGD 100,000 – 1,000,000"
                }
              }
            },
            {
              "value": "option_3",
              "i18n": {
                "zh": {
                  "label": "SGD 1,000,000 – 5,000,000"
                },
                "en": {
                  "label": "SGD 1,000,000 – 5,000,000"
                },
                "zh-HK": {
                  "label": "SGD 1,000,000 – 5,000,000"
                }
              }
            },
            {
              "value": "option_4",
              "i18n": {
                "zh": {
                  "label": "SGD 5,000,000 以上"
                },
                "en": {
                  "label": "Above SGD 5,000,000"
                },
                "zh-HK": {
                  "label": "SGD 5,000,000 以上"
                }
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
            "zh-HK": {
              "label": "主要資金來源渠道",
              "help": "(最多選3項)"
            }
          },
          "options": [
            {
              "value": "bank_loan",
              "i18n": {
                "zh": {
                  "label": "银行贷款"
                },
                "en": {
                  "label": "Bank Loans"
                },
                "zh-HK": {
                  "label": "銀行貸款"
                }
              }
            },
            {
              "value": "biz_income",
              "i18n": {
                "zh": {
                  "label": "营业收入"
                },
                "en": {
                  "label": "Business Income"
                },
                "zh-HK": {
                  "label": "營業收入"
                }
              }
            },
            {
              "value": "capital_contribution",
              "i18n": {
                "zh": {
                  "label": "出资/股权投入"
                },
                "en": {
                  "label": "Capital/Shareholding Contribution"
                },
                "zh-HK": {
                  "label": "出資/股權投入"
                }
              }
            },
            {
              "value": "intercompany",
              "i18n": {
                "zh": {
                  "label": "公司间资金/借贷"
                },
                "en": {
                  "label": "Inter-company Funding/Loans"
                },
                "zh-HK": {
                  "label": "公司間資金/借貸"
                }
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
            "zh-HK": {
              "label": "主要客戶所在國家/地區",
              "placeholder": "請選擇國家",
              "help": "(最多選3項)"
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
            "zh-HK": {
              "label": "營業執照有效期限",
              "placeholder": "開始日期",
              "endPlaceholder": "截止日期",
              "longTermText": "長期有效"
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
            "zh-HK": {
              "label": "是否是上市公司"
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": {
                  "label": "是"
                },
                "en": {
                  "label": "Yes"
                },
                "zh-HK": {
                  "label": "是"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "否"
                },
                "en": {
                  "label": "No"
                },
                "zh-HK": {
                  "label": "否"
                }
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
            "zh-HK": {
              "label": "股票代碼(如適用)",
              "placeholder": "請輸入股票代碼(如適用)"
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
      "id": "page_declaration",
      "pageType": "form",
      "showSkeleton": true,
      "i18n": {
        "zh": {
          "title": "声明及签名"
        },
        "en": {
          "title": "Declaration and Signature"
        },
        "zh-HK": {
          "title": "聲明及簽名"
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
            "zh-HK": {
              "label": "聲明",
              "placeholder": "請在下方指定區域簽名",
              "signPlaceholder": "請在此處手寫簽名",
              "declarationErrorMessage": "請先閱讀並勾選全部法定聲明條款"
            }
          },
          "options": [
            {
              "value": "dec_1",
              "i18n": {
                "zh": {
                  "label": "本人特此声明，公司已根据相关要求，完整、真实地披露其最终受益所有人(UBO)的全部信息，且不存在任何形式的隐瞒、遗漏或规避披露的情况。"
                },
                "en": {
                  "label": "I hereby declare that the Company has fully and truthfully disclosed all information regarding its Ultimate Beneficial Owners (UBOs) in accordance with the relevant requirements, and there exists no concealment, omission or circumvention of such disclosure in any form whatsoever."
                },
                "zh-HK": {
                  "label": "本人特此聲明，公司已根據相關要求，完整、真實地披露其最終受益所有人(UBO)的全部資訊，且不存在任何形式的隱瞞、遺漏或規避披露的情況。"
                }
              }
            },
            {
              "value": "dec_2",
              "i18n": {
                "zh": {
                  "label": "本人确认已获得该公司或实体的正式授权，代表其填写并提交本问卷及文件和声明。\n本人特此声明，以上所提供的信息、文件及声明均为真实、准确且完整。本人知悉，如存在任何虚假陈述、误导性陈述或故意隐瞒重要事实的行为，本人可能需承担相应的法律责任，包括刑事责任。"
                },
                "en": {
                  "label": "I confirm that I have been duly authorised by the company or entity to complete and submit this questionnaire, documents, and declarations on its behalf.\nI hereby declare that all information, documents, and declarations provided above are true, accurate, and complete. I understand that any false statement, misleading statement, or intentional concealment of material facts may result in legal liability, including criminal liability."
                },
                "zh-HK": {
                  "label": "本人確認已獲得該公司或實體的正式授權，代表其填寫並提交本問卷及文件和聲明。\n本人特此聲明，以上所提供的資訊、文件及聲明均為真實、準確且完整。本人知悉，如存在任何虛假陳述、誤導性陳述或故意隱瞞重要事實的行為，本人可能需承擔相應的法律責任，包括刑事責任。"
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
