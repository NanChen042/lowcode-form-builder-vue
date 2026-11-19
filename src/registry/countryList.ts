import type { FormElementOption } from '@/types/schema';
import { allCountryPhoneRules, getCountryZhHantName } from './phoneRules';

/**
 * 知名国籍英文名称对照字典 (对齐 algo 国际 KYC / AML 业务标准)
 */
const nationalityEnMap: Record<string, string> = {
  sg: 'Singaporean',
  cn: 'Chinese',
  hk: 'Hong Kong SAR China',
  mo: 'Macao SAR China',
  tw: 'Taiwan (Province of China)',
  my: 'Malaysian',
  us: 'American',
  gb: 'British',
  jp: 'Japanese',
  kr: 'South Korean',
  au: 'Australian',
  ca: 'Canadian',
  de: 'German',
  fr: 'French',
  in: 'Indian',
  id: 'Indonesian',
  th: 'Thai',
  vn: 'Vietnamese',
  ph: 'Filipino',
  nz: 'New Zealander',
  ae: 'Emirati',
  sa: 'Saudi',
  ru: 'Russian',
  it: 'Italian',
  es: 'Spanish',
  nl: 'Dutch',
  ch: 'Swiss',
  se: 'Swedish',
  no: 'Norwegian',
  fi: 'Finnish',
  dk: 'Danish',
  ie: 'Irish',
  br: 'Brazilian',
  mx: 'Mexican',
  za: 'South African'
};

/**
 * 完整全球 244 个国家与地区下拉选项列表
 * 与 algo / index/getcountry 接口及 intl-tel-input 全球规则 100% 对齐
 */
export const fullCountryOptions: FormElementOption[] = allCountryPhoneRules.map(c => ({
  value: c.iso2.toUpperCase(),
  i18n: {
    zh: { label: c.zh },
    'zh-Hant': { label: getCountryZhHantName(c.iso2, c.zh) },
    en: { label: c.name }
  }
}));

/**
 * 完整全球 244 个国籍下拉选项列表
 * 与 algo KYC / AML 国际标准业务对齐
 */
export const fullNationalityOptions: FormElementOption[] = allCountryPhoneRules.map(c => {
  const code = c.iso2.toLowerCase();
  const enNat = nationalityEnMap[code] || `${c.name} Citizen`;
  const zhNat = c.zh.endsWith('籍') ? c.zh : `${c.zh}籍`;
  const zhHantCountry = getCountryZhHantName(c.iso2, c.zh);
  const zhHantNat = zhHantCountry.endsWith('籍') ? zhHantCountry : `${zhHantCountry}籍`;

  return {
    value: c.iso2.toUpperCase(),
    i18n: {
      zh: { label: zhNat },
      'zh-Hant': { label: zhHantNat },
      en: { label: enNat }
    }
  };
});
