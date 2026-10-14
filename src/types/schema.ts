export type ComponentType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'country'
  | 'nationality'
  | 'signature'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'phone'
  | 'email'
  | 'alert';

export interface FormElementOption {
  label: string;
  label_en?: string;
  value: string;
}

export interface FormElement {
  id: string;
  type: ComponentType;
  label: string;
  label_en?: string;
  key: string;
  required: boolean;
  showLabel?: boolean;
  placeholder?: string;
  placeholder_en?: string;
  help?: string;
  help_en?: string;
  helpPosition?: 'right' | 'bottom';
  defaultValue?: string;
  options?: FormElementOption[];
  multiple?: boolean;
  // 单行文本格式
  inputType?: 'text' | 'number';
  // 电话特有属性
  dialCode?: string;
  countryCode?: string;
  strictPhoneValidation?: boolean;
  // 日期特有属性
  dateType?: 'date' | 'datetime-local' | 'month' | 'time';
  dateMode?: 'single' | 'range';
  enableLongTerm?: boolean;
  defaultLongTerm?: boolean;
  endValue?: string;
  // 多选与排布特有属性
  maxSelections?: number | null;
  layout?: 'inline' | 'stack';
  declarationRequired?: boolean;
  // 自定义校验错误提示 (中英双语)
  customErrorMessage?: string;
  customErrorMessage_en?: string;
  declarationErrorMessage?: string;
  declarationErrorMessage_en?: string;
  // 条件联动显示规则 (例如: 仅当指定字段等于某值时展开)
  dependsOn?: {
    fieldKey: string;
    value: string;
  };
}

export type ProfileType = 'customer' | 'individual' | 'entity' | 'client';

export interface FormPage {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  fields: FormElement[];
  x: number;
  y: number;
  pageType?: 'form' | 'system_profile';
  profileType?: ProfileType;
  showSkeleton?: boolean;
}

export interface PageConnection {
  from: string;
  to: string;
}

export interface FormMeta {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  profileType?: ProfileType;
  // 内部创建模式：仅内部业务与后端识别，不在 URL 暴露明文
  source?: 'template' | 'diy';
  templateKey?: string;
  // 安全随机业务序列号与系统唯一 ID
  formId?: string;
  serialNo?: string;
  createdAt?: number;
  updatedAt?: string | number;
}

export interface FormSchema {
  schemaVersion: string;
  meta: FormMeta;
  pages: {
    id: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    fields: FormElement[];
    pageType?: 'form' | 'system_profile';
    profileType?: ProfileType;
    showSkeleton?: boolean;
  }[];
  pageConnections?: PageConnection[];
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}
