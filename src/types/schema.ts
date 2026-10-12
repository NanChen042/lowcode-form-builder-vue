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
}

export interface FormPage {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  fields: FormElement[];
  x: number;
  y: number;
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
  }[];
  pageConnections?: PageConnection[];
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}
