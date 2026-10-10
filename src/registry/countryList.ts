import type { FormElementOption } from '@/types/schema';
import { allCountryPhoneRules } from './phoneRules';

/**
 * 知名国籍英文名称对照字典 (对齐 algo 国际 KYC / AML 业务标准)
 */
const nationalityEnMap: Record<string, string> = {
  sg: 'Singaporean',
  cn: 'Chinese',
  hk: 'Hong Konger',
  mo: 'Macanese',
  tw: 'Taiwanese',
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
  label: c.zh,
  label_en: c.name
}));

/**
 * 完整全球 244 个国籍下拉选项列表
 * 与 algo KYC / AML 国际标准业务对齐
 */
export const fullNationalityOptions: FormElementOption[] = allCountryPhoneRules.map(c => {
  const code = c.iso2.toLowerCase();
  const enNat = nationalityEnMap[code] || `${c.name} Citizen`;
  const zhNat = c.zh.endsWith('籍') ? c.zh : `${c.zh}籍`;

  return {
    value: c.iso2.toUpperCase(),
    label: zhNat,
    label_en: enNat
  };
});

/**
 * 动态加载国家与国籍数据 (支持同步对接 algo 后端 /index/getcountry 接口)
 * @param apiEndpoint 接口地址，默认 '/index/getcountry'
 */
export async function fetchRemoteCountryData(apiEndpoint: string = '/index/getcountry'): Promise<{
  countries: FormElementOption[];
  nationalities: FormElementOption[];
}> {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await response.json();
      if (res && res.code === 0 && Array.isArray(res.data?.list)) {
        const countries: FormElementOption[] = [];
        const nationalities: FormElementOption[] = [];

        for (const item of res.data.list) {
          const upperCode = (item.code || '').toUpperCase();
          countries.push({
            value: upperCode,
            label: item.name || item.name_en || upperCode,
            label_en: item.name_en || item.name || upperCode
          });
          nationalities.push({
            value: upperCode,
            label: item.nationality || `${item.name || item.name_en}籍`,
            label_en: item.nationality || item.name_en || upperCode
          });
        }

        return { countries, nationalities };
      }
    } catch {
      // 离线模式或无后端服务时平滑回退至内置全量字典
    }
  }

  return {
    countries: fullCountryOptions,
    nationalities: fullNationalityOptions
  };
}
