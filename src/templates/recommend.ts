import type { FormSchema, ProfileType, ProfileFieldItem } from '@/types/schema';
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplCustomerIcon from '@/assets/templates/c.png';
import tplIndividualIcon from '@/assets/templates/u.png';
import tplEntityIcon from '@/assets/templates/e.png';

export type ScenarioTemplateKey =
  | 'kyc-customer'
  | 'kyc-individual'
  | 'kyc-entity'
  | 'risk-customer'
  | 'risk-individual'
  | 'risk-entity';

export interface ScenarioTemplateMeta {
  key: ScenarioTemplateKey;
  type: ProfileType;
  tagColor: string;
  pages: number;
  fields: number;
  descKey: string;
  image: string;
  icon: string;
  code: string;
  bannerBgClass: string;
  i18n: {
    zh: { title: string; tag: string; desc: string; stats: string };
    en: { title: string; tag: string; desc: string; stats: string };
  };
}

export const SCENARIO_TEMPLATES_META: ScenarioTemplateMeta[] = [
  {
    key: 'kyc-customer',
    type: 'customer',
    tagColor: 'purple',
    pages: 3,
    fields: 9,
    descKey: 'wizard.tplCustomerDesc',
    image: tplCustomerImg,
    icon: tplCustomerIcon,
    code: 'SG_CDD_CUSTOMER',
    bannerBgClass: 'bg-[#faf5ff]',
    i18n: {
      zh: {
        title: '客户案例 KYC 模板',
        tag: '客户案例',
        desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
        stats: '3 页面 · 9 字段'
      },
      en: {
        title: 'Customer KYC Template',
        tag: 'Customer',
        desc: 'Covers business activities, sales volume, funding source, listed company stock code linkage, and authorized signature.',
        stats: '3 Pages · 9 Fields'
      }
    }
  },
  {
    key: 'kyc-individual',
    type: 'individual',
    tagColor: 'green',
    pages: 5,
    fields: 22,
    descKey: 'wizard.tplIndividualDesc',
    image: tplIndividualImg,
    icon: tplIndividualIcon,
    code: 'SG_CDD_INDIVIDUAL',
    bannerBgClass: 'bg-[#f0fdf4]',
    i18n: {
      zh: {
        title: '个人案例 KYC 模板',
        tag: '个人案例',
        desc: '涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。',
        stats: '5 页面 · 22 字段'
      },
      en: {
        title: 'Individual KYC Template',
        tag: 'Individual',
        desc: 'Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature.',
        stats: '5 Pages · 22 Fields'
      }
    }
  },
  {
    key: 'kyc-entity',
    type: 'entity',
    tagColor: 'arcoblue',
    pages: 3,
    fields: 9,
    descKey: 'wizard.tplEntityDesc',
    image: tplEntityImg,
    icon: tplEntityIcon,
    code: 'SG_CDD_ENTITY',
    bannerBgClass: 'bg-[#f0f9ff]',
    i18n: {
      zh: {
        title: '实体案例 KYC 模板',
        tag: '实体案例',
        desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
        stats: '3 页面 · 9 字段'
      },
      en: {
        title: 'Entity KYC Template',
        tag: 'Entity',
        desc: 'Covers corporate business activities, sales volume, funding source, listed company stock code linkage, and authorized signature.',
        stats: '3 Pages · 9 Fields'
      }
    }
  }
];

export const RISK_SCENARIO_TEMPLATES_META: ScenarioTemplateMeta[] = [
  {
    key: 'risk-customer',
    type: 'customer',
    tagColor: 'purple',
    pages: 1,
    fields: 24,
    descKey: 'wizard.tplRiskCustomerDesc',
    image: tplCustomerImg,
    icon: tplCustomerIcon,
    code: 'SG_RISK_CUSTOMER',
    bannerBgClass: 'bg-[#faf5ff]',
    i18n: {
      zh: {
        title: '客户案例风险评估模板',
        tag: '客户案例',
        desc: '涵盖客户、国家及服务交易三大风险维度，共 3 个分组 24 道合规评估项。',
        stats: '1 页面 · 24 题'
      },
      en: {
        title: 'Customer Risk Template',
        tag: 'Customer',
        desc: 'Covers client, country, and service risk factors across 3 groups (24 compliance questions).',
        stats: '1 Page · 24 Questions'
      }
    }
  },
  {
    key: 'risk-individual',
    type: 'individual',
    tagColor: 'green',
    pages: 1,
    fields: 5,
    descKey: 'wizard.tplRiskIndividualDesc',
    image: tplIndividualImg,
    icon: tplIndividualIcon,
    code: 'SG_RISK_INDIVIDUAL',
    bannerBgClass: 'bg-[#f0fdf4]',
    i18n: {
      zh: {
        title: '个人案例风险评估模板',
        tag: '个人案例',
        desc: '涵盖 MHA 恐怖分子名单、MAS 制裁名单、PEP 及高风险国家等 5 道评估项。',
        stats: '1 页面 · 5 题'
      },
      en: {
        title: 'Individual Risk Template',
        tag: 'Individual',
        desc: 'Covers MHA terrorist list, MAS sanctions list, PEP, and FATF high-risk checks (5 questions).',
        stats: '1 Page · 5 Questions'
      }
    }
  },
  {
    key: 'risk-entity',
    type: 'entity',
    tagColor: 'arcoblue',
    pages: 1,
    fields: 4,
    descKey: 'wizard.tplRiskEntityDesc',
    image: tplEntityImg,
    icon: tplEntityIcon,
    code: 'SG_RISK_ENTITY',
    bannerBgClass: 'bg-[#f0f9ff]',
    i18n: {
      zh: {
        title: '实体案例风险评估模板',
        tag: '实体案例',
        desc: '涵盖 MHA 恐怖分子名单、MAS 制裁名单、FATF 名单及高风险客户特征 4 道评估项。',
        stats: '1 页面 · 4 题'
      },
      en: {
        title: 'Entity Risk Template',
        tag: 'Entity',
        desc: 'Covers MHA terrorist list, MAS sanctions list, FATF list, and higher-risk entity checks (4 questions).',
        stats: '1 Page · 4 Questions'
      }
    }
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
        "title": "SG_CDD_CUSTOMER",
        "description": ""
      },
      "en": {
        "title": "SG_CDD_CUSTOMER",
        "description": ""
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
        "title": "SG_CDD_INDIVIDUAL",
        "description": ""
      },
      "en": {
        "title": "SG_CDD_INDIVIDUAL",
        "description": ""
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
        "title": "SG_CDD_ENTITY",
        "description": ""
      },
      "en": {
        "title": "SG_CDD_ENTITY",
        "description": ""
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
      "zh-Hant"
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
      "zh-Hant": {
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
        "zh-Hant": {
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
        "zh-Hant": {
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
            "zh-Hant": {
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
            "zh-Hant": {
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
            "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
            "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
            "zh-Hant": {
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
            "zh-Hant": {
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
            "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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
            "zh-Hant": {
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
        "zh-Hant": {
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
            "zh-Hant": {
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
                "zh-Hant": {
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
                "zh-Hant": {
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

interface RiskQuestionSeed {
  id: string;
  key: string;
  groupId: string;
  zh: string;
  en: string;
  weight?: number;
}

interface RiskGroupSeed {
  id: string;
  zh: string;
  en: string;
}

function createPresetRiskSchema(params: {
  profileType: ProfileType;
  templateKey: ScenarioTemplateKey;
  code: string;
  groups: RiskGroupSeed[];
  questions: RiskQuestionSeed[];
}): FormSchema {
  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: params.profileType,
      formType: 'risk',
      baseLocale: 'zh',
      enabledLocales: ['zh', 'en'],
      source: 'template',
      templateKey: params.templateKey,
      i18n: {
        zh: { title: params.code, description: '' },
        en: { title: params.code, description: '' }
      }
    },
    pages: [
      {
        id: 'page_risk_0',
        pageType: 'form',
        i18n: {
          zh: { title: '风险评估' },
          en: { title: 'Risk Assessment' }
        },
        groups: params.groups.map(g => ({
          id: g.id,
          i18n: {
            zh: { title: g.zh },
            en: { title: g.en }
          }
        })),
        fields: params.questions.map(q => ({
          id: q.id,
          key: q.key,
          type: 'radio',
          required: true,
          groupId: q.groupId,
          weight: q.weight ?? 1,
          i18n: {
            zh: { label: q.zh },
            en: { label: q.en }
          },
          options: JSON.parse(JSON.stringify(RISK_FIXED_OPTIONS))
        }))
      }
    ]
  };
}

export const riskCustomerTemplate: FormSchema = createPresetRiskSchema({
  profileType: 'customer',
  templateKey: 'risk-customer',
  code: 'SG_RISK_CUSTOMER',
  groups: [
    { id: 'grp_risk_1', zh: '客户/委托人风险因素', en: 'Customer or Client Risk Factors' },
    { id: 'grp_1793342667455_13', zh: '国家或地区风险因素', en: 'Country or Territory Risk Factors' },
    { id: 'grp_1793342755246_19', zh: '服务或交易风险因素', en: 'Service or Transaction Risk Factors' }
  ],
  questions: [
    { id: 'cmp_1', key: 'radio_1', groupId: 'grp_risk_1', zh: '该客户是否为新客户？', en: 'Is this client a new customer?' },
    { id: 'cmp_2', key: 'radio_2', groupId: 'grp_risk_1', zh: '该客户是否使用提名董事或股东？', en: 'Does the client use nominee directors or shareholders?' },
    { id: 'cmp_3', key: 'radio_3', groupId: 'grp_risk_1', zh: '如适用，挂名股东是否持有公司的多数股权？', en: 'Where applicable, do the nominee shareholders hold majority ownership in the company?' },
    { id: 'cmp_4', key: 'radio_4', groupId: 'grp_risk_1', zh: '鉴于客户/委托人的业务性质，其股权结构是否显得异常或过于复杂？', en: 'Does the ownership structure of the customer/client appear unusual or excessively complex given the nature of its business?' },
    { id: 'cmp_5', key: 'radio_5', groupId: 'grp_risk_1', zh: '客户/委托人的业务是否为现金密集型？', en: 'Is the customer/client’s business cash-intensive?' },
    { id: 'cmp_6', key: 'radio_6', groupId: 'grp_risk_1', zh: '拟任董事、合伙人或股东是否曾因欺诈、失信或类似不当行为而被判刑？', en: 'Have any of the proposed directors, partners, or shareholders ever been convicted of a criminal offence involving fraud, dishonesty, or similar misconduct?' },
    { id: 'cmp_7', key: 'radio_7', groupId: 'grp_risk_1', zh: '客户/委托人、任何实益拥有人或其代理人是否属于政治公众人物(PEP)？', en: 'Is the customer/client, any beneficial owner, or any of their agents a Politically Exposed Person (PEP)?' },
    { id: 'cmp_8', key: 'radio_8', groupId: 'grp_risk_1', zh: '客户/委托人是否为未在新加坡注册的慈善或非营利组织？', en: 'Is the customer/client a charitable or non-profit organisation that is not registered in Singapore?' },
    { id: 'cmp_9', key: 'radio_9', groupId: 'grp_risk_1', zh: '客户/委托人是否看起来像是一家空壳公司(即无实际业务活动或实体办公场所的公司)？', en: 'Does the customer/client appear to be a shell company (i.e., a company with no significant business activity or physical presence)?' },
    { id: 'cmp_10', key: 'radio_10', groupId: 'grp_risk_1', zh: '客户/委托人是否从事高风险行业或领域？', en: 'Is the customer/client engaged in a high-risk industry or sector?' },
    { id: 'cmp_11', key: 'radio_11', groupId: 'grp_risk_1', zh: '专业机构是否通过额外筛查(如使用 Google、美国财政部外国资产控制办公室发布的制裁名单，或其他第三方数据库)发现与客户/委托人、其实益拥有人、授权代表或关联方有关的不利信息或负面新闻？', en: 'Has the professional firm identified any adverse news or information through additional screening of the customer/client, its beneficial owner, authorised representative, or connected party using sources such as Google, OFAC sanctions lists, or third-party databases?' },
    { id: 'cmp_12', key: 'radio_12', groupId: 'grp_risk_1', zh: '是否存在与客户/委托人、其实益拥有人、授权代表或关联方相关的异常情况，且无法被令人满意地解释或解决？', en: 'Are there any exceptions or irregularities related to the customer/client, its beneficial owner, authorised representative, or connected party that cannot be satisfactorily explained or resolved?' },
    { id: 'cmp_14', key: 'radio_14', groupId: 'grp_1793342667455_13', zh: '客户/委托人是否与被认定为缺乏充分反洗钱(AML)或反恐融资(CFT)措施的国家或地区存在关联或交易行为？', en: 'Is the customer/client connected to, or conducting transactions with, a country or territory identified as lacking adequate anti-money laundering (AML) or counter-financing of terrorism (CFT) measures?' },
    { id: 'cmp_15', key: 'radio_15', groupId: 'grp_1793342667455_13', zh: '客户/委托人是否与与高风险司法管辖区有往来的国家或地区存在关联或交易行为？', en: 'Is the customer/client connected to, or transacting with, a country or territory that has dealings with high-risk jurisdictions?' },
    { id: 'cmp_16', key: 'radio_16', groupId: 'grp_1793342667455_13', zh: '客户/委托人是否与被联合国(UN)等监管机构制裁的国家或地区存在关联或交易行为？', en: 'Is the customer/client connected to, or transacting with, a country or territory that is subject to sanctions imposed by a regulatory body, such as the United Nations (UN)?' },
    { id: 'cmp_17', key: 'radio_17', groupId: 'grp_1793342667455_13', zh: '客户/委托人是否与被认定为资助或支持恐怖活动，或其境内有被指定的恐怖组织活动的国家或地区存在关联或交易行为？', en: 'Is the customer/client connected to, or transacting with, a country or territory identified as financing or supporting terrorist activities, or as having designated terrorist organisations operating within its borders?' },
    { id: 'cmp_18', key: 'radio_18', groupId: 'grp_1793342667455_13', zh: '客户/委托人是否与金融行动特别工作组(FATF)呼吁采取对策的国家或地区存在关联或交易行为？', en: 'Is the customer/client connected to, or transacting with, a country or territory for which the FATF has called for the application of countermeasures?' },
    { id: 'cmp_20', key: 'radio_20', groupId: 'grp_1793342755246_19', zh: '客户/委托人是否曾指示以匿名或不披露身份的方式进行交易(包括现金交易)？', en: 'Has the customer/client provided any instruction to conduct a transaction (including cash) anonymously or without disclosing their identity?' },
    { id: 'cmp_21', key: 'radio_21', groupId: 'grp_1793342755246_19', zh: '客户/委托人是否曾指示设立包含挂名股东和/或挂名董事的空壳公司？', en: 'Has the customer/client provided any instruction to incorporate shell companies with nominee shareholder(s) and/or nominee director(s)?' },
    { id: 'cmp_22', key: 'radio_22', groupId: 'grp_1793342755246_19', zh: '本次业务关系是否在未与客户/委托人进行任何面对面会面的情况下建立？', en: 'Is this business relationship being established without any face-to-face (physical) meeting with the customer/client?' },
    { id: 'cmp_23', key: 'radio_23', groupId: 'grp_1793342755246_19', zh: '客户/委托人所要求的交易是否与专业中介对其风险画像和业务性质的了解不一致？', en: 'Are the transactions requested by the customer/client inconsistent with the professional intermediary’s understanding of the customer/client’s risk profile and nature of business?' },
    { id: 'cmp_24', key: 'radio_24', groupId: 'grp_1793342755246_19', zh: '客户/委托人是否使用注册的 FA 地址或邮政信箱地址作为其注册或邮寄地址？', en: 'Does the customer/client use a registered FA address or a P.O. Box address as its registered or mailing address?' },
    { id: 'cmp_25', key: 'radio_25', groupId: 'grp_1793342755246_19', zh: '客户/委托人是否在客户尽职调查(CDD)过程中提供了可疑或不一致的信息？', en: 'Has the customer/client provided any suspicious or inconsistent information during the customer due diligence (CDD) process?' },
    { id: 'cmp_26', key: 'radio_26', groupId: 'grp_1793342755246_19', zh: '客户/委托人是否不愿意或无法提供客户尽职调查(CDD)所需的信息？', en: 'Is the customer/client unwilling or unable to provide information required for customer due diligence (CDD)?' }
  ]
});

export const riskIndividualTemplate: FormSchema = createPresetRiskSchema({
  profileType: 'individual',
  templateKey: 'risk-individual',
  code: 'SG_RISK_INDIVIDUAL',
  groups: [
    { id: 'grp_risk_1', zh: '客户/委托人风险因素', en: 'Customer or Client Risk Factors' }
  ],
  questions: [
    { id: 'cmp_1', key: 'radio_1', groupId: 'grp_risk_1', zh: '是否在新加坡内政部(MHA)网站的跨部门恐怖分子认定委员会(IMC-TD)所发布的恐怖分子认定名单中发现匹配的个人或实体？', en: 'Is there any match found on the Ministry of Home Affairs (MHA) website under the Inter-Ministry Committee on Terrorist Designation (IMC-TD) list of designated terrorists (persons or entities)?' },
    { id: 'cmp_2', key: 'radio_2', groupId: 'grp_risk_1', zh: '是否在新加坡金融管理局(MAS)网站根据《联合国法规》(UN Regulations)发布的定向金融制裁名单中，发现匹配的被指定个人或实体？', en: 'Is there any match found on the Monetary Authority of Singapore (MAS) website under the United Nations Regulations (UN Regulations) list of designated individuals and entities subject to targeted financial sanctions?' },
    { id: 'cmp_3', key: 'radio_3', groupId: 'grp_risk_1', zh: '客户/委托人是否为政治公众人物(PEP)？', en: 'Is the customer/client a Politically Exposed Person (PEP)?' },
    { id: 'cmp_4', key: 'radio_4', groupId: 'grp_risk_1', zh: '客户所在国家是否被列入金融行动特别工作组(FATF)公开发布的高风险或加强监控的司法管辖区名单？', en: "Is the customer's country listed on the FATF public list of high-risk jurisdictions or jurisdictions under increased monitoring?" },
    { id: 'cmp_5', key: 'radio_5', groupId: 'grp_risk_1', zh: '根据受监管交易商所进行的风险评估，客户/委托人是否符合高风险客户的特征？', en: 'Does the customer/client fit the profile of a higher-risk customer based on the risk assessment conducted by the regulated dealer?' }
  ]
});

export const riskEntityTemplate: FormSchema = createPresetRiskSchema({
  profileType: 'entity',
  templateKey: 'risk-entity',
  code: 'SG_RISK_ENTITY',
  groups: [
    { id: 'grp_risk_1', zh: '客户/委托人风险因素', en: 'Customer or Client Risk Factors' }
  ],
  questions: [
    { id: 'cmp_1', key: 'radio_1', groupId: 'grp_risk_1', zh: '是否在新加坡内政部(MHA)网站的跨部门恐怖分子认定委员会(IMC-TD)所发布的恐怖分子认定名单中发现匹配的个人或实体？', en: 'Is there any match found on the Ministry of Home Affairs (MHA) website under the Inter-Ministry Committee on Terrorist Designation (IMC-TD) list of designated terrorists (persons or entities)?' },
    { id: 'cmp_2', key: 'radio_2', groupId: 'grp_risk_1', zh: '是否在新加坡金融管理局(MAS)网站根据《联合国法规》(UN Regulations)发布的定向金融制裁名单中，发现匹配的被指定个人或实体？', en: 'Is there any match found on the Monetary Authority of Singapore (MAS) website under the United Nations Regulations (UN Regulations) list of designated individuals and entities subject to targeted financial sanctions?' },
    { id: 'cmp_3', key: 'radio_3', groupId: 'grp_risk_1', zh: '客户所在国家是否被列入金融行动特别工作组(FATF)公开发布的高风险或加强监控的司法管辖区名单？', en: "Is the customer's country listed on the FATF public list of high-risk jurisdictions or jurisdictions under increased monitoring?" },
    { id: 'cmp_4', key: 'radio_4', groupId: 'grp_risk_1', zh: '根据受监管交易商所进行的风险评估，客户/委托人是否符合高风险客户的特征？', en: 'Does the customer/client fit the profile of a higher-risk customer based on the risk assessment conducted by the regulated dealer?' }
  ]
});
