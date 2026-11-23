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
    code: 'SG_CSP_CUSTOMER_2025',
    bannerBgClass: 'bg-[#faf5ff]',
    i18n: {
      zh: {
        title: '客户案例 KYC 模板',
        tag: '客户案例',
        desc: '基于 ACRA 2025 年 CSP 指南的客户实体 KYC 问卷。',
        stats: '3 页面 · 9 字段'
      },
      en: {
        title: 'Customer KYC Template',
        tag: 'Customer',
        desc: 'Client entity KYC questionnaire based on ACRA’s 2025 CSP Guidelines.',
        stats: '3 Pages · 9 Fields'
      }
    }
  },
  {
    key: 'kyc-individual',
    type: 'individual',
    tagColor: 'green',
    pages: 6,
    fields: 25,
    descKey: 'wizard.tplIndividualDesc',
    image: tplIndividualImg,
    icon: tplIndividualIcon,
    code: 'SG_CSP_INDIVIDUAL_2025',
    bannerBgClass: 'bg-[#f0fdf4]',
    i18n: {
      zh: {
        title: '个人案例 KYC 模板',
        tag: '个人案例',
        desc: '基于 ACRA 2025 年 CSP 指南的个人子案例 KYC 问卷。',
        stats: '6 页面 · 25 字段'
      },
      en: {
        title: 'Individual KYC Template',
        tag: 'Individual',
        desc: 'Individual sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines.',
        stats: '6 Pages · 25 Fields'
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
    code: 'SG_CSP_ENTITY_2025',
    bannerBgClass: 'bg-[#f0f9ff]',
    i18n: {
      zh: {
        title: '实体案例 KYC 模板',
        tag: '实体案例',
        desc: '基于 ACRA 2025 年 CSP 指南的实体子案例 KYC 问卷。',
        stats: '3 页面 · 9 字段'
      },
      en: {
        title: 'Entity KYC Template',
        tag: 'Entity',
        desc: 'Entity sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines.',
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
    fields: 34,
    descKey: 'wizard.tplRiskCustomerDesc',
    image: tplCustomerImg,
    icon: tplCustomerIcon,
    code: 'SG_CSP_RA_CUSTOMER_2025',
    bannerBgClass: 'bg-[#faf5ff]',
    i18n: {
      zh: {
        title: '客户案例风险评估模板',
        tag: '客户案例',
        desc: '基于 ACRA 2025 年 CSP 指南的客户实体风险评估。',
        stats: '1 页面 · 34 题'
      },
      en: {
        title: 'Customer Risk Template',
        tag: 'Customer',
        desc: 'Client entity risk assessment based on ACRA’s 2025 CSP Guidelines.',
        stats: '1 Page · 34 Questions'
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
    code: 'SG_CSP_RA_INDIVIDUAL_2025',
    bannerBgClass: 'bg-[#f0fdf4]',
    i18n: {
      zh: {
        title: '个人案例风险评估模板',
        tag: '个人案例',
        desc: '基于 ACRA 2025 年 CSP 指南的个人子案例风险评估。',
        stats: '1 页面 · 5 题'
      },
      en: {
        title: 'Individual Risk Template',
        tag: 'Individual',
        desc: 'Individual sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
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
    code: 'SG_CSP_RA_ENTITY_2025',
    bannerBgClass: 'bg-[#f0f9ff]',
    i18n: {
      zh: {
        title: '实体案例风险评估模板',
        tag: '实体案例',
        desc: '基于 ACRA 2025 年 CSP 指南的实体子案例风险评估。',
        stats: '1 页面 · 4 题'
      },
      en: {
        title: 'Entity Risk Template',
        tag: 'Entity',
        desc: 'Entity sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
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

  const defaultMetaMap: Record<string, { title: string; desc: string; descEn: string }> = {
    customer: {
      title: 'SG_CSP_CUSTOMER_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的客户实体 KYC 问卷。',
      descEn: 'Client entity KYC questionnaire based on ACRA’s 2025 CSP Guidelines.'
    },
    client: {
      title: 'SG_CSP_CUSTOMER_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的客户实体 KYC 问卷。',
      descEn: 'Client entity KYC questionnaire based on ACRA’s 2025 CSP Guidelines.'
    },
    individual: {
      title: 'SG_CSP_INDIVIDUAL_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的个人子案例 KYC 问卷。',
      descEn: 'Individual sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines.'
    },
    entity: {
      title: 'SG_CSP_ENTITY_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的实体子案例 KYC 问卷。',
      descEn: 'Entity sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines.'
    }
  };
  const fallbackMeta = defaultMetaMap[normType] || defaultMetaMap.customer;
  const resolvedTitle = title || fallbackMeta.title;
  const resolvedDesc = description || fallbackMeta.desc;
  const resolvedDescEn = description_en || description || fallbackMeta.descEn;

  const defaultFields = normType === 'individual'
    ? presetIndividualProfileFields
    : (normType === 'entity' ? presetEntityProfileFields : presetCustomerProfileFields);

  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: normType,
      baseLocale: 'en',
      enabledLocales: ['en'],
      source: 'diy',
      i18n: {
        en: {
          title: title_en || resolvedTitle,
          ...(resolvedDescEn ? { description: resolvedDescEn } : {})
        },
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
        i18n: {
          en: { title: 'Basic Information' },
          zh: { title: '基本资料' }
        },
        fields: [],
        profileFields: defaultFields
      },
      {
        id: 'page_form_1',
        pageType: 'form',
        i18n: {
          en: { title: 'Questionnaire' },
          zh: { title: '问卷表单' }
        },
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
  const defaultMetaMap: Record<string, { title: string; desc: string; descEn: string; pageTitle: string; pageTitleEn: string; pageDesc: string; pageDescEn: string }> = {
    customer: {
      title: 'SG_CSP_RA_CUSTOMER_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的客户实体风险评估。',
      descEn: 'Client entity risk assessment based on ACRA’s 2025 CSP Guidelines.',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置本表单的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    individual: {
      title: 'SG_CSP_RA_INDIVIDUAL_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的个人子案例风险评估。',
      descEn: 'Individual sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置个人成员的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure individual risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    },
    entity: {
      title: 'SG_CSP_RA_ENTITY_2025',
      desc: '基于 ACRA 2025 年 CSP 指南的实体子案例风险评估。',
      descEn: 'Entity sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
      pageTitle: '风险评估',
      pageTitleEn: 'Risk Assessment',
      pageDesc: '设置实体机构的风险评估问题与权重；回答选项固定为 Yes / No / Not Applicable，选择“Yes”表示命中风险项并按权重扣分。',
      pageDescEn: 'Configure corporate entity risk assessment questions and weights. Answer options are fixed as Yes / No / Not Applicable.'
    }
  };

  const metaPreset = defaultMetaMap[normType] || defaultMetaMap.customer;
  const resolvedTitle = title || metaPreset.title;
  const resolvedDesc = description || metaPreset.desc;
  const resolvedDescEn = description_en || description || metaPreset.descEn;

  const presetGroups = [{ id: 'grp_risk_1', i18n: {} }];

  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: normType,
      formType: 'risk',
      baseLocale: 'en',
      enabledLocales: ['en'],
      source: 'diy',
      i18n: {
        en: {
          title: title_en || resolvedTitle,
          ...(resolvedDescEn ? { description: resolvedDescEn } : {})
        },
        zh: {
          title: resolvedTitle,
          ...(resolvedDesc ? { description: resolvedDesc } : {})
        }
      }
    },
    pages: [
      {
        id: 'page_risk_0',
        pageType: 'form',
        i18n: {
          en: {
            title: metaPreset.pageTitleEn,
            description: metaPreset.pageDescEn
          },
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
    "baseLocale": "en",
    "enabledLocales": [
      "en",
      "zh"
    ],
    "source": "template",
    "templateKey": "kyc-customer",
    "i18n": {
      "zh": {
        "title": "SG_CSP_CUSTOMER_2025",
        "description": "基于 ACRA 2025 年 CSP 指南的客户实体 KYC 问卷。"
      },
      "en": {
        "title": "SG_CSP_CUSTOMER_2025",
        "description": "Client entity KYC questionnaire based on ACRA’s 2025 CSP Guidelines."
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
    "baseLocale": "en",
    "enabledLocales": [
      "en",
      "zh"
    ],
    "source": "template",
    "templateKey": "kyc-individual",
    "i18n": {
      "zh": {
        "title": "SG_CSP_INDIVIDUAL_2025",
        "description": "基于 ACRA 2025 年 CSP 指南的个人子案例 KYC 问卷。"
      },
      "en": {
        "title": "SG_CSP_INDIVIDUAL_2025",
        "description": "Individual sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines."
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
          "title": "多重国籍"
        },
        "en": {
          "title": "Multiple Nationalities"
        }
      },
      "fields": [
        {
          "id": "cmp_1",
          "type": "radio",
          "key": "radio_1",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "您是否拥有两个或以上国籍？"
            },
            "en": {
              "label": "Do you hold more than one nationality?"
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
          "id": "cmp_2",
          "type": "textarea",
          "key": "textarea_2",
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
                "fieldKey": "radio_1",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "请列出您目前拥有的所有国籍及取得各国籍的日期。",
              "placeholder": "例如：中国国籍 — 自出生起；加拿大国籍 — 2020年3月15日"
            },
            "en": {
              "label": "Please list all your current nationalities and the date you acquired each nationality.",
              "placeholder": "e.g. Chinese — Since birth; Canadian — 15 Mar 2020"
            }
          }
        }
      ]
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
          "id": "cmp_3",
          "type": "alert",
          "key": "alert_3",
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
              "content": "If a natural person directly or indirectly holds more than 25% of the shares in the company, or has significant influence or actual control over the company (even if not holding shares), the natural person should be considered as the ultimate beneficial owner (UBO) of the company."
            }
          }
        },
        {
          "id": "cmp_4",
          "type": "radio",
          "key": "radio_4",
          "layout": "inline",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "i18n": {
            "zh": {
              "label": "个人是否持有公司超过25%的股份?"
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
          "id": "cmp_5",
          "type": "select",
          "key": "select_5",
          "multiple": true,
          "required": true,
          "showLabel": true,
          "maxSelections": 3,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_4",
                "value": "option_1"
              }
            ]
          },
          "i18n": {
            "zh": {
              "label": "您个人财富的主要来源有哪些？",
              "placeholder": "请选择选项",
              "help": "请最多选择三项主要来源。"
            },
            "en": {
              "label": "What are the main sources of your wealth?",
              "placeholder": "Please select an option",
              "help": "Select up to three main sources."
            }
          },
          "options": [
            {
              "value": "option_1",
              "i18n": {
                "zh": {
                  "label": "工资／专业服务收入"
                },
                "en": {
                  "label": "Employment / Professional Income"
                }
              }
            },
            {
              "value": "option_2",
              "i18n": {
                "zh": {
                  "label": "企业经营收入／出售企业所得"
                },
                "en": {
                  "label": "Business Income / Sale of Business"
                }
              }
            },
            {
              "value": "option_3_mwlk8pn9",
              "i18n": {
                "zh": {
                  "label": "投资收益／出售投资所得"
                },
                "en": {
                  "label": "Investments / Sale of Investments"
                }
              }
            },
            {
              "value": "option_4_mwlk8qtt",
              "i18n": {
                "zh": {
                  "label": "房产出售所得／租金收入"
                },
                "en": {
                  "label": "Property Sales / Rental Income"
                }
              }
            },
            {
              "value": "option_5_mwlk8rs7",
              "i18n": {
                "zh": {
                  "label": "遗产继承"
                },
                "en": {
                  "label": "Inheritance"
                }
              }
            },
            {
              "value": "option_6_mwlk8sxc",
              "i18n": {
                "zh": {
                  "label": "赠与／家庭资助"
                },
                "en": {
                  "label": "Gifts / Family Support"
                }
              }
            },
            {
              "value": "option_7_mwlk8tk4",
              "i18n": {
                "zh": {
                  "label": "养老金／退休福利"
                },
                "en": {
                  "label": "Pension / Retirement Benefits"
                }
              }
            },
            {
              "value": "option_8_mwlk8uam",
              "i18n": {
                "zh": {
                  "label": "其他"
                },
                "en": {
                  "label": "Other"
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
          "id": "cmp_7",
          "type": "alert",
          "key": "alert_7",
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
          "id": "cmp_8",
          "type": "radio",
          "key": "radio_8",
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
          "id": "cmp_9",
          "type": "radio",
          "key": "radio_9",
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
          "id": "cmp_10",
          "type": "radio",
          "key": "radio_10",
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
          "id": "cmp_11",
          "type": "checkbox",
          "key": "checkbox_11",
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
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
                "value": "option_1"
              }
            ]
          }
        },
        {
          "id": "cmp_12",
          "type": "textarea",
          "key": "textarea_12",
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
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
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
          "id": "cmp_13",
          "type": "input",
          "key": "input_13",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
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
          "id": "cmp_14",
          "type": "input",
          "key": "input_14",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
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
          "id": "cmp_15",
          "type": "input",
          "key": "input_15",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
              {
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
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
          "id": "cmp_16",
          "type": "date",
          "key": "date_16",
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
                "fieldKey": "radio_8",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_9",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_10",
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
          "id": "cmp_17",
          "type": "radio",
          "key": "radio_17",
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
          "id": "cmp_18",
          "type": "radio",
          "key": "radio_18",
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
          "id": "cmp_19",
          "type": "radio",
          "key": "radio_19",
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
          "id": "cmp_20",
          "type": "radio",
          "key": "radio_20",
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
          "id": "cmp_21",
          "type": "radio",
          "key": "radio_21",
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
          "id": "cmp_22",
          "type": "radio",
          "key": "radio_22",
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
          "id": "cmp_23",
          "type": "radio",
          "key": "radio_23",
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
          "id": "cmp_24",
          "type": "input",
          "key": "input_24",
          "inputType": "text",
          "required": true,
          "showLabel": true,
          "helpPosition": "right",
          "linkage": {
            "logic": "or",
            "conditions": [
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
              },
              {
                "fieldKey": "radio_21",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_22",
                "value": "option_1"
              },
              {
                "fieldKey": "radio_23",
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
          "id": "cmp_25",
          "type": "signature",
          "key": "signature_25",
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
    "baseLocale": "en",
    "enabledLocales": [
      "en",
      "zh"
    ],
    "source": "template",
    "templateKey": "kyc-entity",
    "i18n": {
      "zh": {
        "title": "SG_CSP_ENTITY_2025",
        "description": "基于 ACRA 2025 年 CSP 指南的实体子案例 KYC 问卷。"
      },
      "en": {
        "title": "SG_CSP_ENTITY_2025",
        "description": "Entity sub-case KYC questionnaire based on ACRA’s 2025 CSP Guidelines."
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
    "baseLocale": "en",
    "enabledLocales": [
      "en",
      "zh",
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
  descZh: string;
  descEn: string;
  groups: RiskGroupSeed[];
  questions: RiskQuestionSeed[];
}): FormSchema {
  return {
    schemaVersion: '1.0.0',
    meta: {
      profileType: params.profileType,
      formType: 'risk',
      baseLocale: 'en',
      enabledLocales: ['en', 'zh'],
      source: 'template',
      templateKey: params.templateKey,
      i18n: {
        zh: { title: params.code, description: params.descZh },
        en: { title: params.code, description: params.descEn }
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
  code: 'SG_CSP_RA_CUSTOMER_2025',
  descZh: '基于 ACRA 2025 年 CSP 指南的客户实体风险评估。',
  descEn: 'Client entity risk assessment based on ACRA’s 2025 CSP Guidelines.',
  groups: [
    { id: 'grp_risk_1', zh: '客户风险因素', en: 'Customer’s Risk Factors' },
    { id: 'grp_risk_2', zh: '国家／地区风险因素', en: 'Country/Territory Risk Factors' },
    { id: 'grp_risk_3', zh: '服务／交易风险因素', en: 'Services/ Transactions Risk Factors' }
  ],
  questions: [
    // A. 客户风险因素 (19 题: A1 ~ A18, 含 A4a / A4b)
    { id: 'cmp_1', key: 'radio_1', groupId: 'grp_risk_1', zh: '该客户是否为新客户？', en: 'Is this a new customer?' },
    { id: 'cmp_2', key: 'radio_2', groupId: 'grp_risk_1', zh: '客户是否为在任何证券交易所上市且获豁免披露要求的公众公司？', en: 'Is the customer a public company listed on any stock exchange and exempted from disclosure requirements?' },
    { id: 'cmp_3', key: 'radio_3', groupId: 'grp_risk_1', zh: '客户是否为法人，或能够以自身名义持有资产的实体？', en: 'Is the customer a legal person or an entity that can hold assets in its own name?' },
    { id: 'cmp_4', key: 'radio_4', groupId: 'grp_risk_1', zh: '客户是否使用挂名董事或挂名股东？', en: 'Does the customer use nominee director(s) or shareholder(s)?' },
    { id: 'cmp_5', key: 'radio_5', groupId: 'grp_risk_1', zh: '如适用，挂名股东是否持有多数股权？', en: 'Where applicable, do the nominee shareholders represent majority ownership?' },
    { id: 'cmp_6', key: 'radio_6', groupId: 'grp_risk_1', zh: '考虑到客户的业务性质，其所有权结构是否显得异常或过于复杂？', en: 'Does the ownership structure of the customer appear unusual or excessively complex given the nature of its business?' },
    { id: 'cmp_7', key: 'radio_7', groupId: 'grp_risk_1', zh: '客户的业务是否为现金密集型？', en: 'Is the customer’s business cash-intensive?' },
    { id: 'cmp_8', key: 'radio_8', groupId: 'grp_risk_1', zh: '客户是否频繁与相同或类似的收款方进行无法解释的现金交易？', en: 'Does the customer frequently make unaccounted cash transactions to similar recipient(s)?' },
    { id: 'cmp_9', key: 'radio_9', groupId: 'grp_risk_1', zh: '拟任董事／合伙人／股东是否曾因涉及欺诈或不诚实行为的刑事罪行被定罪？', en: 'Do the proposed directors/partners/shareholders have prior criminal convictions involving fraud or dishonesty?' },
    { id: 'cmp_10', key: 'radio_10', groupId: 'grp_risk_1', zh: '客户、实益拥有人或客户的代理人中，是否有任何一方属于政治公众人物？', en: 'Is any of the customer, beneficial owner or its agent a politically-exposed person?' },
    { id: 'cmp_11', key: 'radio_11', groupId: 'grp_risk_1', zh: '客户的公司财务报表是否已过时？', en: 'Are the customer’s company financial statements outdated?' },
    { id: 'cmp_12', key: 'radio_12', groupId: 'grp_risk_1', zh: '客户的股东和／或董事是否频繁变更，且这些变更在合理范围内？', en: 'Do the customer’s shareholders and/or directors frequently change, and the changes are within reason?' },
    { id: 'cmp_13', key: 'radio_13', groupId: 'grp_risk_1', zh: '获取相关表格所要求的信息是否存在困难？', en: 'Is there any problem obtaining the required information in the relevant form?' },
    { id: 'cmp_14', key: 'radio_14', groupId: 'grp_risk_1', zh: '所获取的信息能否通过独立且可靠的来源加以核实？', en: 'Can the information obtained be verified by independent and reliable sources?' },
    { id: 'cmp_15', key: 'radio_15', groupId: 'grp_risk_1', zh: '客户是否为未在新加坡注册的慈善或非营利组织？', en: 'Is the customer a charitable or non-profit organisation which is not registered in Singapore?' },
    { id: 'cmp_16', key: 'radio_16', groupId: 'grp_risk_1', zh: '客户是否看起来是一家空壳公司？', en: 'Does the customer appear to be a shell company?' },
    { id: 'cmp_17', key: 'radio_17', groupId: 'grp_risk_1', zh: '客户是否从事高风险行业？', en: 'Is the customer in a high-risk industry?' },
    {
      id: 'cmp_18',
      key: 'radio_18',
      groupId: 'grp_risk_1',
      zh: '注册 CSP 已根据所要求的信息来源，对客户、客户的实益拥有人、代表客户行事的人员及客户关联方的资料进行了筛查，即参考 ACRA 提供的警示名单、Google 搜索结果、美国财政部外国资产控制办公室发布的制裁名单、《2001年联合国法》项下的规例、《2002年恐怖主义（制止资助）法》第一附表，以及／或其他第三方筛查数据库。\n\n筛查是否发现负面新闻或不利信息？',
      en: 'The registered CSP has performed screening of particulars of the customer, beneficial owners of the customer, persons acting on behalf of the customer, and connected parties of the customer against the required information sources, i.e., Alert list provided by ACRA, on Google, the sanctions lists published by the Office of Foreign Assets Control of the US Department of the Treasury, against the regulations under the United Nations Act 2001; First Schedule of the Terrorism (Suppression of Financing) Act 2002; and/or other third party screening database.\n\nAre there adverse news or information arising?'
    },
    { id: 'cmp_19', key: 'radio_19', groupId: 'grp_risk_1', zh: '在客户、客户的实益拥有人、代表客户行事的人员或客户关联方的资料中发现的异常事项，无法得到令人满意的处理。', en: 'Exceptions noted from particulars of the customer, beneficial owners of the customer, persons acting on behalf of the customer, or connected parties of the customer cannot be disposed of satisfactorily.' },

    // B. 国家／地区风险因素 (4 题: B1 ~ B4)
    { id: 'cmp_20', key: 'radio_20', groupId: 'grp_risk_2', zh: '客户是否与 FATF 呼吁采取对策的国家或地区存在关联或交易往来？', en: 'Is the customer connected to or transacting with a country or territory in relation to which the FATF has called for countermeasures?' },
    { id: 'cmp_21', key: 'radio_21', groupId: 'grp_risk_2', zh: '客户是否与被 FATF 列入加强监控范围的国家或地区存在关联或交易往来？', en: 'Is the customer connected to or transacting with a country or territory in relation to which the FATF has subject to increased monitoring?' },
    { id: 'cmp_22', key: 'radio_22', groupId: 'grp_risk_2', zh: '客户是否与受到联合国（UN）等监管机构制裁的国家或地区存在关联或交易往来？', en: 'Is the customer connected to or transacting with a country or a territory that is sanctioned by a regulatory body, such as the United Nations (UN)?' },
    { id: 'cmp_23', key: 'radio_23', groupId: 'grp_risk_2', zh: '客户是否与被认定为资助或支持恐怖活动，或其境内有被指定的恐怖组织开展活动的国家或地区存在关联或交易往来？', en: 'Is the customer connected to or transacting with a country or a territory that is identified to be funding or supporting terrorist activities or that has designated terrorist organisations operating within their territories?' },

    // C. 服务／交易风险因素 (11 题: C1 ~ C11)
    { id: 'cmp_24', key: 'radio_24', groupId: 'grp_risk_3', zh: '客户是否曾指示以匿名方式进行交易（可能包括现金交易）？', en: 'Has the customer given any instruction to perform a transaction (which may include cash) anonymously?' },
    { id: 'cmp_25', key: 'radio_25', groupId: 'grp_risk_3', zh: '客户是否曾在未提供相应基础服务或未发生相应基础交易的情况下转移资金？', en: 'Has the customer transferred any funds without providing underlying services or transactions?' },
    { id: 'cmp_26', key: 'radio_26', groupId: 'grp_risk_3', zh: '是否存在无明显经济目的的异常交易模式，或在通常应使用其他付款方式（如支票、银行汇票等）的情况下进行大额现金付款？', en: 'Are there unusual patterns of transactions that have no apparent economic purpose or large cash payments, in which disbursement would have been normally made by other modes of payment (such as cheque, bank drafts etc.)?' },
    { id: 'cmp_27', key: 'radio_27', groupId: 'grp_risk_3', zh: '是否存在因客户提供的服务和／或交易而收到的、来自身份不明或无关联第三方的无法解释的付款？', en: 'Are there unaccounted payments received from unknown or un-associated third parties for services and/or transactions provided by the customer?' },
    { id: 'cmp_28', key: 'radio_28', groupId: 'grp_risk_3', zh: '客户是否指示设立使用挂名股东和／或挂名董事的“空壳”公司？', en: 'Is there instruction from the customer to incorporate “shell” companies with nominee shareholder(s) and/or director(s)?' },
    {
      id: 'cmp_29',
      key: 'radio_29',
      groupId: 'grp_risk_3',
      zh: '客户是否有意在无明显商业目的的情况下购买公司或商业实体？这包括：\na) 多层级、跨多个国家且复杂的集团结构。\nb) 在新加坡设立实体，但该设立行为没有明显商业目的，或与客户没有任何其他个人或经济联系。',
      en: 'Does the customer intend to purchase companies or business entities with no apparent commercial purpose? This would include:\na) Multi-layer, multi-country and complex group structures.\nb) Setting up entities in Singapore where there is no obvious commercial purpose, or any other personal or economic connection to the customer.'
    },
    { id: 'cmp_30', key: 'radio_30', groupId: 'grp_risk_3', zh: '本次业务关系是否在未进行任何线下面谈的情况下建立？', en: 'Is this business relationship being established without any physical meeting?' },
    { id: 'cmp_31', key: 'radio_31', groupId: 'grp_risk_3', zh: '是否有任何交易在未进行线下面谈的情况下开展？', en: 'Are there any transactions being performed without any physical meeting?' },
    { id: 'cmp_32', key: 'radio_32', groupId: 'grp_risk_3', zh: '客户要求进行的交易是否与专业中介对客户风险状况及业务性质的了解不一致？', en: 'Are the transactions required by the customer inconsistent with the professional intermediaries’ knowledge of the customer’s risk profile and nature of business?' },
    { id: 'cmp_33', key: 'radio_33', groupId: 'grp_risk_3', zh: '在拟进行的注册成立交易中，客户是否亲自到场接受身份核验？', en: 'Is the customer physically present for identification purposes in a proposed incorporation transaction?' },
    { id: 'cmp_34', key: 'radio_34', groupId: 'grp_risk_3', zh: '在拟进行的涉及管理权转移、所有权转移或现成公司出售的交易中，客户是否亲自到场接受身份核验？', en: 'Is the customer physically present for identification purposes in a proposed transaction involving the transfer of management or ownership or sale of a shelf company?' }
  ]
});

export const riskIndividualTemplate: FormSchema = createPresetRiskSchema({
  profileType: 'individual',
  templateKey: 'risk-individual',
  code: 'SG_CSP_RA_INDIVIDUAL_2025',
  descZh: '基于 ACRA 2025 年 CSP 指南的个人子案例风险评估。',
  descEn: 'Individual sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
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
  code: 'SG_CSP_RA_ENTITY_2025',
  descZh: '基于 ACRA 2025 年 CSP 指南的实体子案例风险评估。',
  descEn: 'Entity sub-case risk assessment based on ACRA’s 2025 CSP Guidelines.',
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
