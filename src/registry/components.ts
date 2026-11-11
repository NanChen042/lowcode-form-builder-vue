import type { ComponentType, FormElement, FormElementOption, I18nTexts } from '@/types/schema';
import {
  Type,
  AlignLeft,
  SquareChevronDown,
  CircleDot,
  CheckSquare,
  Calendar,
  Globe,
  Flag,
  Signature,
  Info,
  Smartphone,
  Mail
} from '@lucide/vue';

export interface ComponentMeta {
  type: ComponentType;
  label: string;
  label_en: string;
  i18n?: I18nTexts;
  category: 'basic' | 'business' | 'layout';
  icon: string;
  defaultData: () => Partial<FormElement>;
}

import { fullCountryOptions, fullNationalityOptions } from './countryList';

export const defaultCountryOptions: FormElementOption[] = fullCountryOptions;
export const defaultNationalityOptions: FormElementOption[] = fullNationalityOptions;

import {
  validatePhoneNumber as validatePhoneNumberRule
} from './phoneRules';

export function validatePhoneNumber(
  dialCode: string,
  rawNumber: string,
  strict: boolean = true
): { valid: boolean; message: string; message_en: string } {
  return validatePhoneNumberRule(dialCode, rawNumber, strict);
}

export const componentRegistry: Record<ComponentType, ComponentMeta> = {
  input: {
    type: 'input',
    label: '单行文本',
    label_en: 'Single Line',
    i18n: { zh: { label: '单行文本' }, en: { label: 'Single Line' } },
    category: 'basic',
    icon: 'Type',
    defaultData: () => ({
      i18n: {
        zh: { label: '单行文本', placeholder: '请输入内容' },
        en: { label: 'Single Line Text', placeholder: 'Please enter content' }
      },
      defaultValue: '',
      inputType: 'text',
      required: true,
      showLabel: true
    })
  },
  textarea: {
    type: 'textarea',
    label: '多行文本',
    label_en: 'Multi-line',
    i18n: { zh: { label: '多行文本' }, en: { label: 'Multi-line' } },
    category: 'basic',
    icon: 'AlignLeft',
    defaultData: () => ({
      i18n: {
        zh: { label: '多行文本', placeholder: '请输入详细描述...' },
        en: { label: 'Multi-line Text', placeholder: 'Please enter detailed description...' }
      },
      defaultValue: '',
      required: true,
      showLabel: true,
      minRows: 3,
      maxRows: 6,
      maxLength: 800
    })
  },
  select: {
    type: 'select',
    label: '下拉选择',
    label_en: 'Dropdown',
    i18n: { zh: { label: '下拉选择' }, en: { label: 'Dropdown' } },
    category: 'basic',
    icon: 'SquareChevronDown',
    defaultData: () => ({
      i18n: {
        zh: { label: '下拉选择', placeholder: '请选择选项' },
        en: { label: 'Dropdown Select', placeholder: 'Please select an option' }
      },
      defaultValue: '',
      multiple: false,
      required: true,
      showLabel: true,
      options: [
        { value: 'option_1', i18n: { zh: { label: '选项一' }, en: { label: 'Option 1' } } },
        { value: 'option_2', i18n: { zh: { label: '选项二' }, en: { label: 'Option 2' } } }
      ]
    })
  },
  radio: {
    type: 'radio',
    label: '单选框组',
    label_en: 'Radio',
    i18n: { zh: { label: '单选框组' }, en: { label: 'Radio' } },
    category: 'basic',
    icon: 'CircleDot',
    defaultData: () => ({
      i18n: {
        zh: { label: '单选框组' },
        en: { label: 'Radio Group' }
      },
      defaultValue: '',
      layout: 'inline',
      required: true,
      showLabel: true,
      options: [
        { value: 'option_1', i18n: { zh: { label: '选项一' }, en: { label: 'Option 1' } } },
        { value: 'option_2', i18n: { zh: { label: '选项二' }, en: { label: 'Option 2' } } }
      ]
    })
  },
  checkbox: {
    type: 'checkbox',
    label: '多选框组',
    label_en: 'Checkbox',
    i18n: { zh: { label: '多选框组' }, en: { label: 'Checkbox' } },
    category: 'basic',
    icon: 'CheckSquare',
    defaultData: () => ({
      i18n: {
        zh: { label: '多选框组' },
        en: { label: 'Checkbox Group' }
      },
      defaultValue: '',
      layout: 'inline',
      required: true,
      showLabel: true,
      options: [
        { value: 'option_1', i18n: { zh: { label: '选项一' }, en: { label: 'Option 1' } } },
        { value: 'option_2', i18n: { zh: { label: '选项二' }, en: { label: 'Option 2' } } }
      ]
    })
  },
  date: {
    type: 'date',
    label: '日期选择',
    label_en: 'Date Picker',
    i18n: { zh: { label: '日期选择' }, en: { label: 'Date Picker' } },
    category: 'basic',
    icon: 'Calendar',
    defaultData: () => ({
      i18n: {
        zh: { label: '日期选择', placeholder: '请选择日期' },
        en: { label: 'Date Picker', placeholder: 'Please select a date' }
      },
      defaultValue: '',
      endValue: '',
      dateType: 'date',
      dateMode: 'single',
      enableLongTerm: false,
      defaultLongTerm: false,
      required: true,
      showLabel: true
    })
  },
  country: {
    type: 'country',
    label: '国家',
    label_en: 'Country',
    i18n: { zh: { label: '国家' }, en: { label: 'Country' } },
    category: 'business',
    icon: 'Globe',
    defaultData: () => ({
      i18n: {
        zh: { label: '国家', placeholder: '请选择国家' },
        en: { label: 'Country', placeholder: 'Please select a country' }
      },
      defaultValue: '',
      required: true,
      showLabel: true,
      multiple: false,
      options: []
    })
  },
  nationality: {
    type: 'nationality',
    label: '国籍',
    label_en: 'Nationality',
    i18n: { zh: { label: '国籍' }, en: { label: 'Nationality' } },
    category: 'business',
    icon: 'Flag',
    defaultData: () => ({
      i18n: {
        zh: { label: '国籍', placeholder: '请选择国籍' },
        en: { label: 'Nationality', placeholder: 'Please select nationality' }
      },
      defaultValue: '',
      required: true,
      showLabel: true,
      multiple: false,
      options: []
    })
  },
  signature: {
    type: 'signature',
    label: '电子签名',
    label_en: 'E-Signature',
    i18n: { zh: { label: '电子签名' }, en: { label: 'E-Signature' } },
    category: 'business',
    icon: 'Signature',
    defaultData: () => ({
      i18n: {
        zh: { label: '电子签名', placeholder: '请在下方指定区域签名', signPlaceholder: '请在此处手写签名' },
        en: { label: 'E-Signature', placeholder: 'Please sign in the designated area below', signPlaceholder: 'Please sign here' }
      },
      showLabel: true,
      required: true,
      declarationRequired: true,
      options: [
        { value: 'dec_1', i18n: { zh: { label: '本人保证以上填写的信息真实、准确、有效。' }, en: { label: 'I confirm that all information provided is true, accurate and valid.' } } }
      ]
    })
  },
  alert: {
    type: 'alert',
    label: '提示区块',
    label_en: 'Notice',
    i18n: { zh: { label: '提示区块' }, en: { label: 'Notice' } },
    category: 'business',
    icon: 'Info',
    defaultData: () => ({
      i18n: {
        zh: { label: '提示' },
        en: { label: 'Notice' }
      },
      required: false,
      showLabel: true,
      listStyle: 'circle'
    })
  },
  email: {
    type: 'email',
    label: '电子邮箱',
    label_en: 'Email',
    i18n: { zh: { label: '电子邮箱' }, en: { label: 'Email' } },
    category: 'basic',
    icon: 'Mail',
    defaultData: () => ({
      i18n: {
        zh: { label: '电子邮箱', placeholder: '请输入邮箱' },
        en: { label: 'Email Address', placeholder: 'Please enter email' }
      },
      defaultValue: '',
      required: true,
      showLabel: true
    })
  },
  phone: {
    type: 'phone',
    label: '手机号码',
    label_en: 'Phone',
    i18n: { zh: { label: '手机号码' }, en: { label: 'Phone' } },
    category: 'business',
    icon: 'Smartphone',
    defaultData: () => ({
      i18n: {
        zh: { label: '手机号码' },
        en: { label: 'Phone Number' }
      },
      dialCode: '+65',
      countryCode: 'sg',
      strictPhoneValidation: true,
      defaultValue: '',
      required: true,
      showLabel: true
    })
  }
};

export const componentIconMap: Record<string, any> = {
  Type,
  AlignLeft,
  SquareChevronDown,
  CircleDot,
  CheckSquare,
  Calendar,
  Globe,
  Flag,
  Signature,
  Info,
  Smartphone,
  Mail
};

export function getComponentIcon(iconName: string) {
  return componentIconMap[iconName] || Info;
}

export const allComponents: ComponentMeta[] = Object.values(componentRegistry);
export const basicComponents: ComponentMeta[] = allComponents.filter(c => c.category === 'basic');
export const businessComponents: ComponentMeta[] = allComponents.filter(c => c.category === 'business');

