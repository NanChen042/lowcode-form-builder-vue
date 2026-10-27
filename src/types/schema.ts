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
  showSearch?: boolean;
  // 单行文本格式
  inputType?: 'text' | 'number';
  // 多行文本自适应行数与字数限制
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
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
  // 提示区块文本内容 (支持换行、- 列表、[文字](链接))
  content?: string;
  content_en?: string;
  listStyle?: 'circle' | 'number';
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
  // 风险评估问题权重 (1-10，默认 1) 及所属分组 ID
  weight?: number;
  groupId?: string;
}

export interface FormQuestionGroup {
  id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
}

export type ProfileType = 'customer' | 'individual' | 'entity' | 'client';

export interface ProfileFieldItem {
  label: string;
  label_en?: string;
  value: string;
  skeletonWidth?: string;
}

export interface ProfileRelation {
  title?: string;
  title_en?: string;
  entityLabel?: string;
  entityLabel_en?: string;
  typeLabel?: string;
  typeLabel_en?: string;
  motherName?: string;
  relationships?: string[];
  relationships_en?: string[];
}

export interface ProfileCapitalItem {
  currency?: string;
  shareType?: string;
  shareType_en?: string;
  shareClassLabel?: string;
  shareClassLabel_en?: string;
  sharesHeld: string | number;
  sharesHeldLabel?: string;
  sharesHeldLabel_en?: string;
  shareRatio?: string | number;
  paidUpAmount: string;
  paidUpAmountLabel?: string;
  paidUpAmountLabel_en?: string;
}

export interface FormPageSchema {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  fields: FormElement[];
  groups?: FormQuestionGroup[];
  pageType?: 'form' | 'system_profile';
  profileType?: ProfileType;
  showSkeleton?: boolean;
  profileFields?: ProfileFieldItem[];
  relation?: ProfileRelation;
  capitalTitle?: string;
  capitalTitle_en?: string;
  capitalList?: ProfileCapitalItem[];
}

export interface FormPage extends FormPageSchema {
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
  profileType?: ProfileType;
  formType?: 'kyc' | 'risk';
  enabledLocales?: ('zh' | 'en')[];
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
  pages: FormPageSchema[];
  pageConnections?: PageConnection[];
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}
