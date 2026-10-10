import { computed } from 'vue';
import { store } from './store';
import type { FormElement, FormElementOption } from '@/types/schema';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

export type Locale = 'zh' | 'en';

export const arcoLocales = {
  zh: zhCN,
  en: enUS
};

/**
 * Arco 官方组件库全局当前语言包（响应式联动）
 */
export const currentArcoLocale = computed(() => {
  return store.currentLocale === 'en' ? enUS : zhCN;
});

// 系统固定场景 UI 翻译字典
export const systemMessages: Record<Locale, Record<string, string>> = {
  zh: {
    // 顶部栏
    'app.title': '自定义表单构建器',
    'app.subtitle': '可视化低代码表单编排引擎',
    'app.dirty': '有未保存变更',
    'app.saved': '全部已保存',
    'app.saving': '正在保存...',
    'app.save': '保存',
    'app.preview': '真实预览',
    'app.deploy': '发布表单',
    'app.settings': '面板布局设置',
    'app.leftSidebar': '左侧物料库',
    'app.rightSidebar': '右侧属性面板',
    'app.lang': '语言',

    // 用户下拉菜单
    'user.profile': '个人中心',
    'user.settings': '账号设置',
    'user.activity': '操作日志',
    'user.logout': '退出登录',
    'user.role': '系统管理员',

    // 属性面板
    'prop.title': '属性配置',
    'prop.pageSubtitle': '画布页面全局设置',
    'prop.elementSubtitle': '组件字段属性设置',
    'prop.emptyTitle': '未选中组件',
    'prop.emptyDesc': '点击画布中的字段开始编辑',
    'prop.basicInfo': '基础信息',
    'prop.basicInfoDesc': '设置字段标题、展示与校验',
    'prop.configuringZh': '配置中文模式',
    'prop.configuringEn': '配置英文模式',
    'prop.editingPageEn': '正在编辑页面英文字段',
    'prop.editingElementEn': '正在编辑组件英文字段',
    'prop.copyAllZh': '一键复制中文配置',
    'prop.zhRef': '中文原文：',
    'prop.zhPageTitleRef': '中文原标题：',
    'prop.zhPageDescRef': '中文原描述：',
    'prop.copyZh': '复制中文',
    'prop.canvasSettings': '画布设置',
    'prop.page': '页面',
    'prop.pageTitle': '页面标题',
    'prop.pageTitleEn': '英文页面标题 (English Title)',
    'prop.pageTitlePlaceholder': '请输入页面标题',
    'prop.pageDesc': '页面描述',
    'prop.pageDescEn': '英文页面描述 (English Description)',
    'prop.pageDescPlaceholder': '显示在标题下方的副标题或补充说明',
    'prop.deletePage': '删除当前页面',
    'prop.fieldLabel': '字段标题',
    'prop.fieldLabelEn': '英文字段标题 (English Label)',
    'prop.fieldLabelPlaceholder': '请输入字段标题',
    'prop.fieldHelp': '副标题',
    'prop.fieldHelpEn': '英文副标题 (English Subtitle)',
    'prop.fieldHelpPlaceholder': '请输入副标题或补充说明',
    'prop.helpLayout': '排布方式',
    'prop.helpPosition': '排布方式',
    'prop.helpPositionRight': '并排',
    'prop.helpPositionBottom': '换行',
    'prop.helpPositionTip': '控制副标题的展示位置：并排展示或在标题下方换行展示。',
    'prop.showLabel': '显示标题',
    'prop.required': '设为必填',
    'prop.requiredTip': '开启后，该字段为必须填写项，未填写无法提交。',
    'prop.signatureRequired': '签名板必填',
    'prop.signatureRequiredTip': '开启后，用户必须在手写感应板中签名。',
    'prop.declarationRequired': '声明条款必填',
    'prop.declarationRequiredTip': '开启后，用户必须勾选同意所有声明复选条款才能提交表单。',
    'prop.placeholder': '占位提示',
    'prop.placeholderPrefixEn': '英文',
    'prop.placeholderSuffixEn': ' (English)',
    'prop.sigPadLabel': '签名提示文案',
    'prop.datePickerLabel': '日期选择提示',
    'prop.defaultValue': '默认值',
    'prop.defaultSelection': '默认选中项',
    'prop.defaultSelectionTip': '表单加载时预先选中的初始选项。',
    'prop.defaultValueTip': '组件的初始默认内容，用户在填写表单时可在此基础上修改。',
    'prop.presetContent': '预设内容',
    'prop.presetContentPlaceholder': '请输入默认初始文本',
    'prop.defaultRadio': '默认单选',
    'prop.defaultRadioNone': '无默认选中（不预选）',
    'prop.defaultSelect': '默认选项',
    'prop.defaultSelectNone': '无默认选中',
    'prop.defaultMulti': '默认多选',
    'prop.defaultMultiPlaceholder': '请选择默认勾选项',
    'prop.defaultDate': '默认日期',
    'prop.defaultDatePlaceholder': '请选择默认日期',
    'prop.defaultDateRangeStart': '开始日期',
    'prop.defaultDateRangeEnd': '结束日期',
    'prop.dateMode': '日期模式',
    'prop.dateModeSingle': '单日期',
    'prop.dateModeRange': '起止日期',
    'prop.enableLongTerm': '启用长期选项',
    'prop.enableLongTermTip': '开启后在日期输入框右侧显示“长期”选项，选中后将禁用日期选择。',
    'prop.defaultLongTerm': '默认勾选长期',
    'prop.longTermLabel': '长期',
    'prop.optionsConfig': '选项配置',
    'prop.optionsConfigTip': '设置列表的具体选项，选项名称用于展示给用户。',
    'prop.addOption': '添加选项',
    'prop.optionLayout': '排布方式',
    'prop.layoutInline': '并排',
    'prop.layoutStack': '堆叠',
    'prop.maxSelections': '最大允许选择数',
    'prop.maxSelectionsTip': '限制用户在多选时最多可选择的选项或标签数量。',
    'prop.allowMultiple': '开启多选',
    'prop.allowMultipleTip': '开启后支持在下拉框中选择多个选项。',
    'prop.inputType': '格式类型',
    'prop.inputTypeTip': '设置单行文本的输入格式，可选择普通文本或纯数字。',
    'prop.inputTypeText': '文本',
    'prop.inputTypeNumber': '数字',
    'prop.defaultDialCode': '默认国际区号',
    'prop.defaultDialCodeTip': '设置手机号输入框左侧默认选中的国际区域号码。',
    'prop.strictPhoneValidation': '严格号码校验',
    'prop.strictPhoneValidationTip': '开启后将按照所选国家的真实国际规则校验手机号位数与号段格式（如新加坡8位且8/9开头，中国11位且1开头等）。',
    'prop.phonePlaceholderLabel': '手机号占位提示',
    'prop.emailPlaceholderLabel': '邮箱占位提示',
    'prop.copy': '复制',
    'prop.delete': '删除',

    // 选项编辑器
    'options.zhPrefix': '中文：',
    'options.copyZh': '复制中文',
    'options.deleteOption': '删除选项',
    'options.optionNamePlaceholder': '选项名称',
    'options.noticePlaceholder': '请输入提示或声明内容...',

    // 画布
    'canvas.clear': '清空',
    'canvas.signatureArea': '（手写签名感应区域）',
    'canvas.unnamed': '未命名字段',

    // 侧边栏物料库
    'sidebar.title': '表单构建器',
    'sidebar.currentTemplate': '当前模板：',
    'sidebar.tplIndividual': '个人 KYC',
    'sidebar.tplEntity': '实体 KYC',
    'sidebar.tplSaved': '最近保存的表单',
    'sidebar.tplBlank': '新建画布',
    'sidebar.badgePersonal': '个人',
    'sidebar.badgeEntity': '实体',
    'sidebar.badgeRecommend': '推荐',
    'sidebar.searchPlaceholder': '查找组件或模块...',
    'sidebar.searchEmpty': '未找到匹配的组件',
    'sidebar.createMethod': '创建方式',
    'sidebar.createFromTemplate': '从场景模板创建',
    'sidebar.newBlankCanvas': '新建空白画布',
    'sidebar.catBasic': '基础输入',
    'sidebar.catBusiness': '业务组件',
    'sidebar.catLayout': '高级布局',
    'sidebar.newBlankConfirmTitle': '确认新建空白画布',
    'sidebar.newBlankConfirmContent': '新建空白画布将清空当前所有内容，是否继续？',
    'sidebar.confirmOk': '确认新建',
    'sidebar.cancel': '取消',

    // 场景模板弹窗
    'tpl.modalTitle': '场景模板库',
    'tpl.modalDesc': '从预设行业场景模板开始创建，加载模板后将载入该预设表单结构。',
    'tpl.individualTitle': '个人 KYC',
    'tpl.individualDesc': '适用于个人用户进行KYC表单填写和身份验证。',
    'tpl.entityTitle': '实体 KYC',
    'tpl.entityDesc': '适用于公司、机构实体进行的KYC表单和身份验证',
    'tpl.activeTag': '当前启用',
    'tpl.confirmTitle': '确认加载模板？',
    'tpl.confirmContent': '加载新模板将重置当前画布中的所有表单字段，请确认是否继续？',
    'tpl.confirmOk': '确认加载',
    'tpl.confirmCancel': '取消'
  },
  en: {
    // Top Bar
    'app.title': 'Form Builder',
    'app.subtitle': 'Visual Low-Code Form Orchestration Engine',
    'app.dirty': 'Unsaved Changes',
    'app.saved': 'All Saved',
    'app.saving': 'Saving...',
    'app.save': 'Save',
    'app.preview': 'Live Preview',
    'app.deploy': 'Publish',
    'app.settings': 'Panel Settings',
    'app.leftSidebar': 'Component Library',
    'app.rightSidebar': 'Properties Panel',
    'app.lang': 'Language',

    // User dropdown menu
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.activity': 'Activity Log',
    'user.logout': 'Sign Out',
    'user.role': 'System Administrator',

    // Properties Panel
    'prop.title': 'Properties',
    'prop.pageSubtitle': 'Page Canvas Settings',
    'prop.elementSubtitle': 'Component Field Settings',
    'prop.emptyTitle': 'No Element Selected',
    'prop.emptyDesc': 'Click any field on the canvas to edit',
    'prop.basicInfo': 'Basic Information',
    'prop.basicInfoDesc': 'Configure field label, display and validation',
    'prop.configuringZh': 'Chinese Config Mode',
    'prop.configuringEn': 'English Config Mode',
    'prop.editingPageEn': 'Editing Page (English Content)',
    'prop.editingElementEn': 'Editing Component (English Content)',
    'prop.copyAllZh': 'Copy Chinese Config',
    'prop.zhRef': 'Original (ZH): ',
    'prop.zhPageTitleRef': 'Original Title (ZH): ',
    'prop.zhPageDescRef': 'Original Description (ZH): ',
    'prop.copyZh': 'Use ZH',
    'prop.canvasSettings': 'Canvas Settings',
    'prop.page': 'Page',
    'prop.pageTitle': 'Page Title',
    'prop.pageTitleEn': 'Page Title (English)',
    'prop.pageTitlePlaceholder': 'Enter page title',
    'prop.pageDesc': 'Page Description',
    'prop.pageDescEn': 'Page Description (English)',
    'prop.pageDescPlaceholder': 'Subtitle or description displayed below the title',
    'prop.deletePage': 'Delete Page',
    'prop.fieldLabel': 'Field Label',
    'prop.fieldLabelEn': 'Field Label (English)',
    'prop.fieldLabelPlaceholder': 'Enter field label',
    'prop.fieldHelp': 'Subtitle',
    'prop.fieldHelpEn': 'Subtitle (English)',
    'prop.fieldHelpPlaceholder': 'Enter subtitle or explanation',
    'prop.helpLayout': 'Layout',
    'prop.helpPosition': 'Layout',
    'prop.helpPositionRight': 'Inline',
    'prop.helpPositionBottom': 'Below',
    'prop.helpPositionTip': 'Set subtitle placement: inline beside title or stacked below title.',
    'prop.showLabel': 'Show Label',
    'prop.required': 'Required',
    'prop.requiredTip': 'When enabled, this field is mandatory for submission.',
    'prop.signatureRequired': 'Signature Required',
    'prop.signatureRequiredTip': 'When enabled, user must sign in the signature pad.',
    'prop.declarationRequired': 'Declarations Required',
    'prop.declarationRequiredTip': 'When enabled, user must agree to all declarations.',
    'prop.placeholder': 'Placeholder',
    'prop.placeholderPrefixEn': '',
    'prop.placeholderSuffixEn': ' (English)',
    'prop.sigPadLabel': 'Signature Prompt Text',
    'prop.datePickerLabel': 'Date Picker Placeholder',
    'prop.defaultValue': 'Default Value',
    'prop.defaultSelection': 'Default Selection',
    'prop.defaultSelectionTip': 'Pre-selected option when form loads.',
    'prop.defaultValueTip': 'Initial content for this field that user can modify.',
    'prop.presetContent': 'Preset Text',
    'prop.presetContentPlaceholder': 'Enter default initial text',
    'prop.defaultRadio': 'Default Radio Selection',
    'prop.defaultRadioNone': 'No default selection (None)',
    'prop.defaultSelect': 'Default Option',
    'prop.defaultSelectNone': 'No default selection',
    'prop.defaultMulti': 'Default Multi-selection',
    'prop.defaultMultiPlaceholder': 'Select default checked options',
    'prop.defaultDate': 'Default Date',
    'prop.defaultDatePlaceholder': 'Please select default date',
    'prop.defaultDateRangeStart': 'Start Date',
    'prop.defaultDateRangeEnd': 'End Date',
    'prop.dateMode': 'Date Mode',
    'prop.dateModeSingle': 'Single Date',
    'prop.dateModeRange': 'Date Range',
    'prop.enableLongTerm': 'Enable Long-term Option',
    'prop.enableLongTermTip': 'Show a "Long-term" option next to the date input; checking it disables date selection.',
    'prop.defaultLongTerm': 'Default to Long-term',
    'prop.longTermLabel': 'Long-term',
    'prop.optionsConfig': 'Option Settings',
    'prop.optionsConfigTip': 'Configure choices displayed to users.',
    'prop.addOption': 'Add Option',
    'prop.optionLayout': 'Layout',
    'prop.layoutInline': 'Inline',
    'prop.layoutStack': 'Stacked',
    'prop.maxSelections': 'Max Allowed Selections',
    'prop.maxSelectionsTip': 'Limit maximum number of choices allowed.',
    'prop.allowMultiple': 'Allow Multi-selection',
    'prop.allowMultipleTip': 'Allow selecting multiple choices from the dropdown.',
    'prop.inputType': 'Format Type',
    'prop.inputTypeTip': 'Set single line input format: normal text or number.',
    'prop.inputTypeText': 'Text',
    'prop.inputTypeNumber': 'Number',
    'prop.defaultDialCode': 'Default Dial Code',
    'prop.defaultDialCodeTip': 'Set default country dial code selected on the left of the phone input.',
    'prop.strictPhoneValidation': 'Strict Validation',
    'prop.strictPhoneValidationTip': 'Validate phone digits and prefix against official rules for the selected country (e.g., Singapore 8 digits starting with 8/9, China 11 digits starting with 1).',
    'prop.phonePlaceholderLabel': 'Phone Placeholder',
    'prop.emailPlaceholderLabel': 'Email Placeholder',
    'prop.copy': 'Duplicate',
    'prop.delete': 'Delete',

    // Options Editor
    'options.zhPrefix': 'ZH: ',
    'options.copyZh': 'Use ZH',
    'options.deleteOption': 'Delete Option',
    'options.optionNamePlaceholder': 'Option Label',
    'options.noticePlaceholder': 'Enter notice or declaration text...',

    // Canvas
    'canvas.clear': 'Clear',
    'canvas.signatureArea': '(Signature Sensing Area)',
    'canvas.unnamed': 'Untitled Field',

    // Sidebar Materials
    'sidebar.title': 'Form Builder',
    'sidebar.currentTemplate': 'Current Template: ',
    'sidebar.tplIndividual': 'Individual KYC',
    'sidebar.tplEntity': 'Entity KYC',
    'sidebar.tplSaved': 'Recently Saved Form',
    'sidebar.tplBlank': 'Blank Canvas',
    'sidebar.badgePersonal': 'Personal',
    'sidebar.badgeEntity': 'Entity',
    'sidebar.badgeRecommend': 'Recommended',
    'sidebar.searchPlaceholder': 'Search components...',
    'sidebar.searchEmpty': 'No matching components found',
    'sidebar.createMethod': 'Creation Modes',
    'sidebar.createFromTemplate': 'Create from Template',
    'sidebar.newBlankCanvas': 'New Blank Canvas',
    'sidebar.catBasic': 'Basic Inputs',
    'sidebar.catBusiness': 'Business Components',
    'sidebar.catLayout': 'Advanced Layout',
    'sidebar.newBlankConfirmTitle': 'Confirm New Blank Canvas',
    'sidebar.newBlankConfirmContent': 'Creating a new blank canvas will clear all current content. Continue?',
    'sidebar.confirmOk': 'Confirm',
    'sidebar.cancel': 'Cancel',

    // Template Gallery Modal
    'tpl.modalTitle': 'Template Gallery',
    'tpl.modalDesc': 'Start from preset industry templates. Loading a template will load its form structure.',
    'tpl.individualTitle': 'Individual KYC',
    'tpl.individualDesc': 'Suitable for individual user KYC form submission and identity verification.',
    'tpl.entityTitle': 'Entity KYC',
    'tpl.entityDesc': 'Suitable for corporate and institutional entity KYC forms and verification.',
    'tpl.activeTag': 'Active',
    'tpl.confirmTitle': 'Confirm Loading Template?',
    'tpl.confirmContent': 'Loading a new template will reset all form fields on the current canvas. Continue?',
    'tpl.confirmOk': 'Confirm',
    'tpl.confirmCancel': 'Cancel'
  }
};

/**
 * 获取系统 UI 文案
 */
export function t(key: string, locale?: Locale): string {
  const current = locale || store.currentLocale || 'zh';
  return systemMessages[current]?.[key] || systemMessages.zh[key] || key;
}

/**
 * 获取组件多语言文本
 */
export function getFieldText(
  element: FormElement,
  field: 'label' | 'placeholder' | 'help',
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    const enVal = (element as any)[`${field}_en`];
    return enVal !== undefined && enVal !== '' ? enVal : (element[field] || '');
  }
  return element[field] || '';
}

/**
 * 获取选项多语言文案
 */
export function getOptionLabel(
  option: FormElementOption,
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    return option.label_en || option.label || option.value;
  }
  return option.label || option.value;
}

/**
 * 获取页面多语言文本
 */
export function getPageText(
  page: { title?: string; title_en?: string; description?: string; description_en?: string },
  field: 'title' | 'description',
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    const enVal = (page as any)[`${field}_en`];
    return enVal !== undefined && enVal !== '' ? enVal : ((page as any)[field] || '');
  }
  return (page as any)[field] || '';
}

/**
 * 一键复制组件中文配置到英文字段
 */
export function copyChineseToEnglish(element: FormElement) {
  element.label_en = element.label || '';
  if (element.placeholder !== undefined) {
    element.placeholder_en = element.placeholder;
  }
  if (element.help !== undefined) {
    element.help_en = element.help;
  }
  if (element.options) {
    element.options.forEach(opt => {
      opt.label_en = opt.label;
    });
  }
}

/**
 * 一键复制页面中文配置到英文字段
 */
export function copyPageChineseToEnglish(page: { title: string; title_en?: string; description?: string; description_en?: string }) {
  page.title_en = page.title || '';
  if (page.description !== undefined) {
    page.description_en = page.description;
  }
}
