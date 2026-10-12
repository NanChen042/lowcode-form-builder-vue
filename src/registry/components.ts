import type { ComponentType, FormElement, FormElementOption } from '@/types/schema';
import {
  Type,
  AlignLeft,
  ListCollapse,
  CheckCircle,
  CheckSquare,
  Calendar,
  Globe,
  Flag,
  PenTool,
  Info,
  Phone,
  Mail
} from '@lucide/vue';

export interface ComponentMeta {
  type: ComponentType;
  label: string;
  label_en: string;
  category: 'basic' | 'business' | 'layout';
  icon: string;
  defaultData: () => Partial<FormElement>;
}

import { fullCountryOptions, fullNationalityOptions } from './countryList';

export const defaultCountryOptions: FormElementOption[] = fullCountryOptions;
export const defaultNationalityOptions: FormElementOption[] = fullNationalityOptions;

import {
  allCountryPhoneRules,
  getCountryPhoneRule,
  validatePhoneNumber as validatePhoneNumberRule,
  type CountryPhoneRule
} from './phoneRules';

export type DialCodeOption = CountryPhoneRule;
export const defaultDialCodeOptions = allCountryPhoneRules;

export function getDialCodeOption(codeOrDialCode?: string): CountryPhoneRule {
  return getCountryPhoneRule(codeOrDialCode);
}

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
    category: 'basic',
    icon: 'Type',
    defaultData: () => ({
      label: '单行文本',
      label_en: 'Single Line Text',
      placeholder: '请输入内容',
      placeholder_en: 'Please enter content',
      help: '',
      help_en: '',
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
    category: 'basic',
    icon: 'AlignLeft',
    defaultData: () => ({
      label: '多行文本',
      label_en: 'Multi-line Text',
      placeholder: '请输入详细描述...',
      placeholder_en: 'Please enter detailed description...',
      help: '',
      help_en: '',
      defaultValue: '',
      required: true,
      showLabel: true
    })
  },
  select: {
    type: 'select',
    label: '下拉选择',
    label_en: 'Dropdown',
    category: 'basic',
    icon: 'ListCollapse',
    defaultData: () => ({
      label: '下拉选择',
      label_en: 'Dropdown Select',
      placeholder: '请选择选项',
      placeholder_en: 'Please select an option',
      help: '',
      help_en: '',
      defaultValue: '',
      multiple: false,
      maxSelections: 3,
      required: true,
      showLabel: true,
      options: [
        { label: '选项一', label_en: 'Option 1', value: 'option_1' },
        { label: '选项二', label_en: 'Option 2', value: 'option_2' }
      ]
    })
  },
  radio: {
    type: 'radio',
    label: '单选框组',
    label_en: 'Radio Group',
    category: 'basic',
    icon: 'CheckCircle',
    defaultData: () => ({
      label: '单选框组',
      label_en: 'Radio Group',
      help: '',
      help_en: '',
      defaultValue: '',
      layout: 'inline',
      required: true,
      showLabel: true,
      options: [
        { label: '选项一', label_en: 'Option 1', value: 'option_1' },
        { label: '选项二', label_en: 'Option 2', value: 'option_2' }
      ]
    })
  },
  checkbox: {
    type: 'checkbox',
    label: '多选框组',
    label_en: 'Checkbox',
    category: 'basic',
    icon: 'CheckSquare',
    defaultData: () => ({
      label: '多选框组',
      label_en: 'Checkbox Group',
      help: '',
      help_en: '',
      defaultValue: '',
      layout: 'inline',
      required: true,
      showLabel: true,
      maxSelections: 3,
      options: [
        { label: '选项一', label_en: 'Option 1', value: 'option_1' },
        { label: '选项二', label_en: 'Option 2', value: 'option_2' }
      ]
    })
  },
  date: {
    type: 'date',
    label: '日期选择',
    label_en: 'Date Picker',
    category: 'basic',
    icon: 'Calendar',
    defaultData: () => ({
      label: '日期选择',
      label_en: 'Date Picker',
      placeholder: '请选择日期',
      placeholder_en: 'Please select a date',
      help: '',
      help_en: '',
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
    label: '国家选择',
    label_en: 'Country',
    category: 'business',
    icon: 'Globe',
    defaultData: () => ({
      label: '国家选择',
      label_en: 'Country Select',
      placeholder: '请选择国家',
      placeholder_en: 'Please select a country',
      help: '',
      help_en: '',
      defaultValue: '',
      required: true,
      showLabel: true,
      multiple: false,
      maxSelections: 3,
      options: [...defaultCountryOptions]
    })
  },
  nationality: {
    type: 'nationality',
    label: '国籍选择',
    label_en: 'Nationality',
    category: 'business',
    icon: 'Flag',
    defaultData: () => ({
      label: '国籍选择',
      label_en: 'Nationality Select',
      placeholder: '请选择国籍',
      placeholder_en: 'Please select nationality',
      help: '',
      help_en: '',
      defaultValue: '',
      required: true,
      showLabel: true,
      multiple: false,
      maxSelections: 3,
      options: [...defaultNationalityOptions]
    })
  },
  signature: {
    type: 'signature',
    label: '电子签名',
    label_en: 'E-Signature',
    category: 'business',
    icon: 'PenTool',
    defaultData: () => ({
      label: '电子签名',
      label_en: 'E-Signature',
      placeholder: '请在此处手写签名',
      placeholder_en: 'Please sign here',
      help: '',
      help_en: '',
      showLabel: true,
      required: true,
      declarationRequired: true,
      options: [
        { label: '本人保证以上填写的信息真实、准确、有效。', label_en: 'I confirm that all information provided is true, accurate and valid.', value: 'dec_1' }
      ]
    })
  },
  alert: {
    type: 'alert',
    label: '提示区块',
    label_en: 'Notice Block',
    category: 'business',
    icon: 'Info',
    defaultData: () => ({
      label: '提示',
      label_en: 'Notice',
      required: false,
      showLabel: true,
      options: [
        { label: '您将作为以下公司的授权代表，完成KYC问卷填写。', label_en: 'You are completing this KYC questionnaire as an authorized representative.', value: 'opt_1' },
        { label: '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。', label_en: 'Please verify the details below. Contact support if changes are needed before proceeding.', value: 'opt_2' }
      ]
    })
  },
  email: {
    type: 'email',
    label: '电子邮箱',
    label_en: 'Email Address',
    category: 'basic',
    icon: 'Mail',
    defaultData: () => ({
      label: '电子邮箱',
      label_en: 'Email Address',
      placeholder: '请输入邮箱',
      placeholder_en: 'Please enter email',
      help: '',
      help_en: '',
      defaultValue: '',
      required: true,
      showLabel: true
    })
  },
  phone: {
    type: 'phone',
    label: '手机号码',
    label_en: 'Phone Number',
    category: 'business',
    icon: 'Phone',
    defaultData: () => ({
      label: '手机号码',
      label_en: 'Phone Number',
      placeholder: '',
      placeholder_en: '',
      help: '',
      help_en: '',
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
  ListCollapse,
  CheckCircle,
  CheckSquare,
  Calendar,
  Globe,
  Flag,
  PenTool,
  Info,
  Phone,
  Mail
};

export function getComponentIcon(iconName: string) {
  return componentIconMap[iconName] || Info;
}

export const allComponents: ComponentMeta[] = Object.values(componentRegistry);
export const basicComponents: ComponentMeta[] = allComponents.filter(c => c.category === 'basic');
export const businessComponents: ComponentMeta[] = allComponents.filter(c => c.category === 'business');

