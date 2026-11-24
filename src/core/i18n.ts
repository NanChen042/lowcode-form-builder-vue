import { computed } from 'vue';
import { store, markDirty, primaryLocale } from './store';
import type { FormElement, FormElementOption, I18nTexts } from '@/types/schema';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import { formRuntimeMultiMessages } from './i18nFormLocales';

export type Locale = 'zh' | 'en';

export interface SupportedFormLocaleItem {
  code: string;
  /** 下拉选项等展示用的标准 BCP 47 代码（如 zh 对应展示 zh-Hans） */
  displayCode?: string;
  labelZh: string;
  labelEn: string;
  nativeLabel: string;
  shortBadge: string;
  flag: string;
}

/** 繁体中文统一语言码：zh-Hant（BCP 47 文字子标签，不区分香港/台湾） */
export const TRADITIONAL_LOCALE = 'zh-Hant';

/**
 * 判断是否为繁体/香港/台湾等繁体中文语种标识
 */
export function isTraditionalChineseLocale(loc?: string): boolean {
  if (!loc) return false;
  const norm = loc.trim().toLowerCase();
  return (
    norm === 'zh-hant' ||
    norm === 'zh_hant' ||
    norm === 'zh-hk' ||
    norm === 'zh_hk' ||
    norm === 'zh-tw' ||
    norm === 'zh_tw' ||
    norm === 'zh-mo' ||
    norm === 'zh_mo' ||
    norm === 'hk' ||
    norm === 'tw' ||
    norm.startsWith('zh-hant')
  );
}

export function normalizeLocaleKey(loc?: string): string {
  const raw = (loc || '').trim();
  const norm = raw.toLowerCase();
  if (isTraditionalChineseLocale(norm)) return TRADITIONAL_LOCALE;
  if (norm === 'zh' || norm === 'zh-cn' || norm === 'zh_cn' || norm === 'cn' || norm.startsWith('zh-hans')) return 'zh';
  if (norm === 'en' || norm.startsWith('en-') || norm.startsWith('en_')) return 'en';
  if (norm === 'ms' || norm.startsWith('ms-') || norm.startsWith('ms_')) return 'ms';
  if (norm === 'id' || norm.startsWith('id-') || norm.startsWith('id_')) return 'id';
  if (norm === 'ta' || norm.startsWith('ta-') || norm.startsWith('ta_')) return 'ta';
  if (norm === 'th' || norm.startsWith('th-') || norm.startsWith('th_')) return 'th';
  if (norm === 'vi' || norm.startsWith('vi-') || norm.startsWith('vi_')) return 'vi';
  if (norm === 'ja' || norm.startsWith('ja-') || norm.startsWith('ja_')) return 'ja';
  if (norm === 'ko' || norm.startsWith('ko-') || norm.startsWith('ko_')) return 'ko';
  if (norm === 'hi' || norm.startsWith('hi-') || norm.startsWith('hi_')) return 'hi';
  if (norm === 'es' || norm.startsWith('es-') || norm.startsWith('es_')) return 'es';
  if (norm === 'fr' || norm.startsWith('fr-') || norm.startsWith('fr_')) return 'fr';
  if (norm === 'de' || norm.startsWith('de-') || norm.startsWith('de_')) return 'de';
  if (norm === 'pt' || norm.startsWith('pt-') || norm.startsWith('pt_')) return 'pt';
  if (norm === 'ru' || norm.startsWith('ru-') || norm.startsWith('ru_')) return 'ru';
  return raw;
}

export const SUPPORTED_FORM_LOCALES: SupportedFormLocaleItem[] = [
  { code: 'en', labelZh: '英语 (English)', labelEn: 'English', nativeLabel: 'English', shortBadge: 'EN', flag: 'gb' },
  { code: 'zh', displayCode: 'zh-Hans', labelZh: '简体中文', labelEn: 'Simplified Chinese', nativeLabel: '简体中文', shortBadge: 'ZH', flag: 'cn' },
  { code: 'zh-Hant', labelZh: '繁体中文', labelEn: 'Traditional Chinese', nativeLabel: '繁體中文', shortBadge: 'ZH', flag: 'hk' },
  { code: 'ms', labelZh: '马来语 (Bahasa Melayu)', labelEn: 'Malay (Bahasa Melayu)', nativeLabel: 'Bahasa Melayu', shortBadge: 'MS', flag: 'my' },
  { code: 'id', labelZh: '印度尼西亚语 (Bahasa Indonesia)', labelEn: 'Indonesian (Bahasa Indonesia)', nativeLabel: 'Bahasa Indonesia', shortBadge: 'ID', flag: 'id' },
  { code: 'ta', labelZh: '泰米尔语 (தமிழ்)', labelEn: 'Tamil (தமிழ்)', nativeLabel: 'தமிழ்', shortBadge: 'TA', flag: 'sg' },
  { code: 'th', labelZh: '泰语 (ไทย)', labelEn: 'Thai (ไทย)', nativeLabel: 'ไทย', shortBadge: 'TH', flag: 'th' },
  { code: 'vi', labelZh: '越南语 (Tiếng Việt)', labelEn: 'Vietnamese (Tiếng Việt)', nativeLabel: 'Tiếng Việt', shortBadge: 'VI', flag: 'vn' },
  { code: 'ja', labelZh: '日语 (日本語)', labelEn: 'Japanese (日本語)', nativeLabel: '日本語', shortBadge: 'JA', flag: 'jp' },
  { code: 'ko', labelZh: '韩语 (한국어)', labelEn: 'Korean (한국어)', nativeLabel: '한국어', shortBadge: 'KO', flag: 'kr' },
  { code: 'hi', labelZh: '印地语 (हिन्दी)', labelEn: 'Hindi (हिन्दी)', nativeLabel: 'हिन्दी', shortBadge: 'HI', flag: 'in' },
  { code: 'es', labelZh: '西班牙语 (Español)', labelEn: 'Spanish (Español)', nativeLabel: 'Español', shortBadge: 'ES', flag: 'es' },
  { code: 'fr', labelZh: '法语 (Français)', labelEn: 'French (Français)', nativeLabel: 'Français', shortBadge: 'FR', flag: 'fr' },
  { code: 'de', labelZh: '德语 (Deutsch)', labelEn: 'German (Deutsch)', nativeLabel: 'Deutsch', shortBadge: 'DE', flag: 'de' },
  { code: 'pt', labelZh: '葡萄牙语 (Português)', labelEn: 'Portuguese (Português)', nativeLabel: 'Português', shortBadge: 'PT', flag: 'pt' },
  { code: 'ru', labelZh: '俄语 (Русский)', labelEn: 'Russian (Русский)', nativeLabel: 'Русский', shortBadge: 'RU', flag: 'ru' }
];

export function getLocaleFlag(loc: string): string {
  const norm = normalizeLocaleKey(loc);
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm.toLowerCase());
  return item?.flag || 'cn';
}

export function getLocaleDisplayName(loc: string, uiLocale?: Locale): string {
  const norm = normalizeLocaleKey(loc);
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm.toLowerCase());
  const currentUi = uiLocale || store.currentLocale || 'zh';
  if (!item) return loc.toUpperCase();
  return currentUi === 'en' ? item.labelEn : item.labelZh;
}

export function getLocaleNativeName(loc: string): string {
  const norm = normalizeLocaleKey(loc);
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm.toLowerCase());
  return item ? item.nativeLabel : loc.toUpperCase();
}

export function getLocaleShortBadge(loc: string): string {
  const norm = (loc || '').trim().toLowerCase();
  if (norm === 'zh-hk' || norm === 'hk') return 'ZH';
  const normalized = normalizeLocaleKey(loc);
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === normalized.toLowerCase());
  return item ? item.shortBadge : loc.toUpperCase();
}

export function getEffectiveFormLocale(locale?: string): string {
  if (locale) return normalizeLocaleKey(locale);
  if (store.workspaceMode === 'translation') {
    return normalizeLocaleKey(store.activeTargetLocale || store.editingLocale || primaryLocale.value || 'en');
  }
  return normalizeLocaleKey(primaryLocale.value || 'en');
}

/**
 * Arco 官方组件库全局当前语言包（响应式联动）
 */
export const currentArcoLocale = computed(() => {
  return store.currentLocale === 'en' ? enUS : zhCN;
});

// 系统固定场景 UI 翻译字典
export const systemMessages: Record<Locale, Record<string, string>> = {
  zh: {
    // 通用与状态 (Common)
    'common.untitledPage': '未命名页面',
    'common.untitledField': '未命名字段',
    'common.notice': '提示',
    'common.signed': '已签字',
    'common.clearSignature': '清除签名',
    'common.clickToSign': '点击此处手写签名',
    'common.longTerm': '长期',
    'common.longTermValid': '长期有效',
    'common.systemPreset': '系统内置',
    'common.cannotDrop': '不可放置',
    'common.basicInfo': '基本资料',
    'common.readOnly': '不可编辑',
    'modal.cancel': '取消',
    'modal.confirm': '确定',
    'common.pagesUnit': '页',
    'common.fieldsUnit': '个字段',
    'common.optionsUnit': '项',
    'common.totalOptions': '共 {count} 项',
    'common.prev': '上一步',
    'common.confirmNext': '确认 & 下一步',
    'common.nextStep': '下一步',
    'common.cancel': '取消',
    'common.singapore': '新加坡',
    'common.prefilledBaseline': '预置核验节点',
    'common.startDate': '开始日期',
    'common.endDate': '结束日期',
    'val.maxOptions': '最多只能选择 {count} 项',
    'val.maxItems': '最多只能选择 {count} 项',
    'dir.searchPlaceholder': '搜索国家/地区、国籍名称、代码或区号 (如 中国, 新加坡籍, SG, +86)...',
    'dir.country': '国家/地区',
    'dir.nationality': '国籍',
    'dir.code': '代码',
    'dir.dialCode': '国际区号',
    'dir.noMatching': '未找到匹配的数据记录',
    'dir.totalCountPrefix': '共',
    'dir.totalCountSuffix': '个预设国家与地区',
    'dir.presetList': '预设清单',
    'dir.standardNote': '本列表以 ISO 3166-1 标准及联合国相关名称资料为基础，仅用于信息采集，不代表本平台对任何国家或地区法律地位的立场。',
    'common.close': '关闭',

    // 顶部导航栏 (AppHeader)
    'app.riskWorkspaceTitle': '风险评估设计工作台',
    'app.formWorkspaceTitle': '表单设计工作台',
    'app.dirty': '有未保存变更',
    'app.saved': '已保存至草稿',
    'app.saving': '正在保存...',
    'app.save': '保存至草稿',
    'app.preview': '预览',
    'app.deploy': '发布表单',
    'app.settings': '面板布局设置',
    'app.leftSidebar': '左侧物料库',
    'app.rightSidebar': '右侧属性面板',
    'header.formTitlePlaceholder': '请输入表单名称',
    'header.clickToRename': '点击修改表单名称',
    'header.renameForm': '修改表单名称',
    'header.tour': '操作指南',
    'header.saveSuccess': '已保存至草稿',
    'header.saveFailed': '保存失败，请检查网络或重试',
    'header.untitledForm': '未命名表单',
    'header.warnTitle': '多语言发布校验提醒',
    'header.warnMore': '...以及其他 {count} 项未翻译内容',
    'header.warnComplete': '前往完善翻译',
    'header.warnPublishAnyway': '仍然发布',
    'header.untranslatedTag': '未翻译',
    'header.bilingualGuideTitle': '翻译管理说明',
    'header.bilingualGuideDesc': '管理表单各语言翻译内容。您可以在翻译工作台中对照编辑源语言与目标语言文案。填表人打开表单时，可通过语言切换按钮自由切换多语言。',
    'header.bilingualVideoTitle': '多语言 KYC 问卷操作演示',
    'header.bilingualVideoTip': '温馨提示：进入翻译管理后，可配置对应表单语言版本。',

    // 用户下拉菜单 (User Menu)
    'user.logout': '退出登录',
    'user.role': '系统管理员',

    // 侧边栏物料库 (MaterialSidebar)
    'sidebar.searchPlaceholder': '查找组件或模块...',
    'sidebar.searchEmpty': '未找到匹配的组件',
    'sidebar.catBasic': '基础输入',
    'sidebar.catBusiness': '业务组件',
    'sidebar.tooltipCollapse': '收起',
    'sidebar.components': '组件',
    'sidebar.templates': '模板',
    'sidebar.pages': '页面',
    'sidebar.searchTooltip': '搜索',
    'sidebar.collapseBtn': '收起',
    'sidebar.searchTemplates': '搜索模板名称...',
    'sidebar.createBlank': '新建空白画布',
    'sidebar.createBlankDesc': '从零开始自由搭建表单',
    'sidebar.presetScenarios': '预置场景模板',
    'sidebar.addCanvasPage': '添加新画板页面',
    'sidebar.templateLoaded': '模板已载入',
    'sidebar.pageAdded': '已添加新画板页面',
    'sidebar.pageDeleted': '画板已删除',
    'sidebar.deletePagePrompt': '确定删除此画板页面？',
    'sidebar.systemPreset': '固定页面',
    'sidebar.componentAdded': '组件已添加到画布',
    'sidebar.tabComponents': '组件库',
    'sidebar.tabTemplates': '场景模板库',
    'sidebar.tabPages': '页面大纲',
    'sidebar.subComponents': '点击或拖拽至画布',
    'sidebar.subTemplates': '标准 KYC 问卷',
    'sidebar.resizeHandleTip': '拖拽拉伸物料库面板宽度',
    'sidebar.useTemplate': '选用模板',
    'sidebar.confirmOverwriteTitle': '覆盖确认',
    'sidebar.confirmOverwriteDesc': '当前画布已包含 {pages} 个画板页面，载入新预置模板将会完全覆盖当前画布内容。是否确认继续？',
    'sidebar.confirmOverwriteBtn': '确定覆盖',

    // 画布与画板交互 (InfiniteCanvas & PageFrame)
    'canvas.defaultLangTip': '提示：画布模式下编辑的是默认语言（英文）内容，请使用英文填写所有组件内容。',
    'common.signAreaPlaceholder': '请在下方指定区域签名',
    'canvas.signatureArea': '请在此处手写签名',
    'canvas.droppable': '可放置画布',
    'canvas.presetCannotDrop': '固定页面 · 不可添加组件',
    'canvas.dragToFormCanvas': '请将组件拖拽至右侧常规表单画布中',
    'canvas.emptyTitle': '画布当前为空',
    'canvas.emptyDesc': '拖拽左侧基础输入或业务组件即可在这里生成并预览表单',
    'canvas.addPageRight': '在右侧添加新页面',
    'canvas.initializing': '正在初始化画布...',
    'canvas.expandSidebar': '展开侧边栏',
    'canvas.expandProperties': '展开右侧属性面板',
    'canvas.zoomIn': '放大画布',
    'canvas.zoomOut': '缩小画布',
    'canvas.zoom100': '缩放到 100%',
    'canvas.zoomFit': '适应画布全貌',
    'canvas.zoomSelection': '缩放到选中项',
    'canvas.profileIndividual': '个人案例',
    'canvas.profileEntity': '实体案例',
    'canvas.profileCustomer': '母案例',
    'canvas.todoZhTitle': '中文待补齐清单',
    'canvas.todoEnTitle': '英文待翻译清单',
    'canvas.todoTotalCount': '共 {count} 项',
    'canvas.todoLocate': '定位补齐',
    'canvas.todoIgnore': '暂时忽略',
    'canvas.todoZhCount': '{count} 项中文未填写',
    'canvas.todoEnCount': '{count} 项英文未翻译',
    'canvas.conditionPrefix': '若选「{option}」',
    'canvas.yes': '是',
    'canvas.no': '否',
    'canvas.todoNextIndexed': '下一项 ({current}/{total})',
    'canvas.dependentLockedTitle': '条件从属项：位置已锁定并跟随父级联动',
    'canvas.tier2': '2级',
    'canvas.backToContent': '返回表单内容',
    'canvas.componentDuplicated': '已复制所选组件 (Ctrl+D)',
    'canvas.selectToDuplicate': '请先在画布中选中要复制的组件',

    // 右键上下文菜单 (ContextMenu)
    'context.duplicate': '复制组件',
    'context.insertBelow': '插入组件',
    'context.linkComponent': '关联组件',
    'context.unlinkElement': '解除关联',
    'context.deleteElement': '删除组件',
    'context.presetReadOnly': '系统预设资料',
    'context.addComponent': '添加表单组件',
    'context.insertPageAfter': '在当前画布后方插入',
    'context.resetView': '重置画布视角',
    'context.deletePage': '删除当前画布',
    'context.newPage': '新建画布页面',
    'context.confirmDeleteTitle': '确认删除画布',
    'context.confirmDeleteContent': '确定要删除当前画布及其所有内容吗？此操作不可撤销。',
    'context.confirmDeleteOk': '确认删除',

    // 属性面板：基础属性 (FieldBasicProps)
    'prop.title': '属性配置',
    'prop.elementSubtitle': '组件字段属性设置',
    'prop.emptyTitle': '未选中组件',
    'prop.emptyDesc': '点击画布中的字段开始编辑',
    'prop.basicInfo': '基础信息',
    'prop.basicInfoDesc': '设置字段标题、展示与校验',
    'prop.canvasSettings': '画布设置',
    'prop.deletePage': '删除当前页面',
    'prop.fieldLabel': '字段标题',
    'prop.fieldLabelPlaceholder': '请输入字段标题',
    'prop.inputPlaceholder': '请输入内容',
    'prop.textareaPlaceholder': '请输入详细描述...',
    'prop.selectPlaceholder': '请选择选项',
    'prop.datePlaceholder': '请选择日期',
    'prop.agreeDeclarationHint': '请同意声明条款',
    'prop.fieldHelp': '副标题',
    'prop.fieldHelpPlaceholder': '请输入副标题或补充说明',
    'prop.helpLayout': '排布方式',
    'prop.helpPositionRight': '标题右侧',
    'prop.helpPositionBottom': '标题下方',
    'prop.helpPositionRightDesc': '标题右侧显示（默认同排浅灰色小字）',
    'prop.helpPositionBottomDesc': '标题下方换行显示',
    'prop.helpPositionTip': '控制副标题排布方式：可选标题右侧显示（默认同排浅灰色小字）或标题下方换行显示。',
    'prop.showLabel': '显示标题',
    'prop.showSignPrompt': '显示文案',
    'prop.required': '设为必填',
    'prop.declarationRequired': '声明条款必填',
    'prop.customErrorMsg': '未填校验提示',
    'prop.customizeError': '自定义提示',
    'prop.defaultFallback': '系统默认提示',
    'prop.defaultFallbackTip': '用户提交表单未填写此项时的校验报错提示',
    'prop.previewGifPlaceholder': '动图效果预览区域',
    'prop.resetToDefaultError': '恢复默认',
    'prop.declarationErrorMsg': '未同意声明提示',
    'prop.placeholder': '占位提示',
    'prop.enableLongTerm': '启用长期选项',
    'prop.enableLongTermTip': '开启后在单日期输入框右侧显示“长期”选项，勾选后免填截止时间（起止日期模式自动停用）。',
    'prop.defaultLongTerm': '默认勾选长期',
    'prop.defaultLongTermTip': '开启后用户填表时默认自动勾选长期有效，免填日期。',
    'prop.addOption': '添加选项',
    'prop.addClauseItem': '添加条款内容',
    'prop.layoutInline': '并排',
    'prop.layoutStack': '堆叠',
    'prop.allowMultiple': '开启多选',
    'prop.defaultDialCode': '默认国际区号',
    'prop.copy': '复制',
    'prop.delete': '删除',
    'prop.collapsePanel': '收起属性面板',
    'prop.systemBaseline': '基本资料展示页',
    'prop.locked': '已锁定',
    'prop.deletePageConfirm': '确定要删除当前画布页面吗？此操作不可撤销。',
    'prop.presetNationalities': '预设国籍',
    'prop.presetCountries': '预设国家',
    'prop.viewDirectory': '查看',
    'prop.fieldFallback': '字段',
    'prop.clientCase': '客户案例',
    'prop.entityCase': '实体案例',
    'prop.individualCase': '个人案例',
    'prop.systemPresetAlert': '该页面展示系统自动带出的客户基本资料，填报人仅查看核对，不支持在此修改或删减。',
    'prop.defaultCountryPlaceholder': '请选择国家/地区',
    'prop.defaultNatPlaceholder': '请选择国籍',
    'prop.linkageRuleTitle': '展开规则',
    'prop.linkageWhen': '当',
    'prop.linkageEquals': '选择',
    'prop.linkageThenShow': '时展开',
    'prop.linkageAndJoin': '且',
    'prop.linkageOrJoin': '或',
    'prop.linkageLogicAnd': '全部满足',
    'prop.linkageLogicOr': '任一满足',
    'prop.removeSingleCondition': '移除此项条件',
    'prop.linkageTipSimple': '未满足条件时在填表端默认折叠隐藏',
    'prop.locateParentTip': '点击定位画布上游组件',
    'prop.unlinkRuleConfirm': '确定解除与该选项的展开联动吗？解除后该组件将恢复为常驻显示。',
    'prop.unlink': '解除联动',
    'prop.resizeHandleTip': '拖拽拉伸属性面板宽度',
    'prop.rowRange': '行数范围',
    'prop.rowRangeTip': '设置多行文本框自适应行高区间（最小行数 ~ 最大行数）。初始呈现最小行数，内容增多时自动拉伸，超出最大行数后出现滚动条。',
    'prop.rowUnit': '行',
    'prop.defaultMaxLengthPlaceholder': '默认 800',
    'prop.charUnit': '字',
    'prop.untranslated': '未翻译',

    // 属性面板：特定组件属性 (FieldSpecificProps)
    'prop.handwrittenSignPad': '手写签名板',
    'prop.signatureRequired': '签名板必填',
    'prop.signatureErrorMsg': '未签名提示',
    'prop.sigPadLabel': '签名提示文案',
    'prop.signWatermarkPlaceholder': '手写区内提示文案',
    'prop.datePickerLabel': '日期选择提示',
    'prop.startDatePlaceholder': '开始日期提示文案',
    'prop.endDatePlaceholder': '截止日期提示文案',
    'prop.longTermOptionLabel': '长期选项文案',
    'prop.dateMode': '日期模式',
    'prop.dateModeTip': '设置日期选择方式，可切换为单日期选择或起止日期范围选择。',
    'prop.dateModeSingle': '单日期',
    'prop.dateModeRange': '起止日期',
    'prop.alertContentTitle': '提示内容',
    'prop.alertContentTip': '直接输入告示或说明文本，支持自然换行。行首以“- ”开头自动生成无序列表，支持 [文字](链接) 插入超链接。',
    'prop.alertContentPlaceholder': '请输入提示内容...\n- 以“- ”开头自动生成列表项\n- 支持 [链接文案](xxx.com) 插入超链接',
    'prop.alertEmptyContentPlaceholder': '请输入提示内容',
    'prop.alertInsertBullet': '列表项',
    'prop.alertInsertLink': '超链接',
    'prop.maxSelections': '最大允许选择数',
    'prop.inputType': '格式类型',
    'prop.inputTypeTip': '设置单行文本的输入格式，可选择普通文本或纯数字。',
    'prop.inputTypeText': '文本',
    'prop.inputTypeNumber': '数字',
    'prop.emailPlaceholderLabel': '邮箱占位提示',
    'prop.emailPlaceholder': '请输入邮箱',
    'prop.maxSelectionsCountryTip': '国家/国籍组件最多允许选择 3 项',
    'prop.maxSelectionsOptionsTip': '最多允许选择 {count} 项（不超过配置选项数）',
    'prop.maxLength': '最大字数',
    'prop.maxLengthTip': '限制最多输入的字符数，默认为 800 字（留空则继承默认 800，可自定义或调大）。',
    'prop.alertListCircleFull': '圆点列表 (无序)',
    'prop.alertListNumberFull': '数字列表 (有序)',
    'prop.alertLinkTextSample': '提示文字',

    // 属性面板：页面属性 (PagePropsEditor)
    'prop.pageSubtitle': '画布页面全局设置',
    'prop.page': '页面',
    'prop.pageTitlePlaceholder': '请输入页面标题',
    'prop.pageDescPlaceholder': '显示在标题下方的副标题或补充说明',

    // 选项与级联联动 (OptionsEditor)
    'prop.optionsConfig': '选项配置',
    'prop.optionsConfigTip': '设置列表的具体选项，选项名称用于展示给用户。',
    'prop.clauseConfig': '声明条款',
    'prop.clauseConfigTip': '配置要求用户阅读并确认的声明条款。',
    'prop.optionLayout': '排布方式',
    'options.deleteOption': '删除选项',
    'options.noticePlaceholder': '请输入提示或声明内容...',
    'options.dragToReorderIndexed': '按住拖拽排序 (选项 {index})',
    'options.toggleDefaultRadio': '点击切换默认选中项',
    'options.toggleDefaultCheckbox': '点击切换默认勾选',
    'options.linkConfigTitle': '设置选择【{name}】时展开的表单组件',
    'options.linkTriggerHeader': '选择【{name}】时触发显示',
    'options.chooseFollowupField': '选择想要添加的展开组件：',
    'options.orLinkExisting': '或勾选已有下游组件：',
    'options.expandedTag': '展开: {name}',
    'options.thisOption': '此项',
    'options.declarationPlaceholder': '请输入声明条款内容（条款 {index}）',
    'options.clauseLabel': '条款 {index}',
    'options.unlink': '解除关联',
    'options.maxDepthReached': '已达到最大追问层级（最多支持 2 级嵌套）。为保障移动端填写体验与表单性能，不可继续向下嵌套。',
    'options.maxDepthReachedShort': '已达最大追问层级（最多支持2级嵌套）',

    // 系统预设资料页 (SystemProfileView)
    'profile.notice.ind1': '根据合规监管要求，您需要完成KYC问卷填写。',
    'profile.notice.ent1': '您将作为以下公司的授权代表，完成KYC问卷填写。',
    'profile.notice.common': '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。',
    'profile.customerTitle': '客户母案例注册基本信息',
    'profile.entityTitle': '公司注册基本信息',
    'profile.basicTitle': '基本资料',
    'profile.authorizedRep': '授权代表',
    'profile.associatedInfo': '关联信息',
    'profile.associatedEntity': '关联实体',
    'profile.relationshipType': '关联类型',
    'profile.shareholder': '股东',
    'profile.director': '董事',
    'profile.partner': '合伙人',
    'profile.capitalTitle': '股份与出资信息',
    'profile.shareClass': '股份类别',
    'profile.sharesHeld': '持有股份数',
    'profile.paidUpAmount': '对应已缴股本金额',
    'profile.field.name': '姓名',
    'profile.field.nativeName': '国籍语言姓名',
    'profile.field.nationality': '国籍',
    'profile.field.sgStatus': '新加坡身份类型',
    'profile.field.nricFin': 'NRIC/FIN(如适用)',
    'profile.field.idType': '证件类型',
    'profile.field.idNumber': '证件号码',
    'profile.field.dob': '出生日期',
    'profile.field.gender': '性别',
    'profile.field.phone': '手机号码',
    'profile.field.email': '电子邮箱',
    'profile.field.resAddress': '居住地址',
    'profile.field.contactAddress': '联系地址',
    'profile.field.entityName': '实体名称',
    'profile.field.formerName': '曾用名(如有)',
    'profile.field.jurisdiction': '注册地',
    'profile.field.entityRegNo': '实体注册号码',
    'profile.field.registeredAddress': '注册地址',
    'profile.field.repCapacity': '授权代表身份',
    'profile.field.repName': '授权代表姓名',
    'profile.val.singapore': '新加坡',
    'profile.val.singaporean': '新加坡籍',
    'profile.val.sgCitizen': '新加坡公民',
    'profile.val.idCardPassport': '身份证 / 护照',
    'profile.val.male': '男',
    'profile.val.repCapacityVal': '董事 / 高级管理人员',
    'profile.val.repIdTypeVal': 'NRIC(新加坡公民)',

    // 欢迎向导弹窗 (WelcomeWizardModal)
    'wizard.brandSubtitle': 'DIY 表单设计器',
    'wizard.brandSubtitleRisk': '风险评估表单设计器',
    'wizard.createNewTag': '快捷新建',
    'wizard.createBlank': '新建空白画布',
    'wizard.createBlankDesc': '点击左下方立即创建按钮，开始创建您的第一个定制表单。',
    'wizard.createBlankRisk': '新建风险评估表单',
    'wizard.createBlankRiskDesc': '基于 Yes / No / Not Applicable 三态判定与 1~10 分动态权重，快速配置客户、个人或实体的合规问卷。',
    'wizard.createNowBtn': '立即创建',
    'wizard.selectTemplate': '选择模板',
    'wizard.selectTemplateDesc': '使用模板快速创建，提升设计效率',
    'wizard.lockedSubtext': '支持空白自定义或选用场景模板',
    'wizard.lockedSubtextRisk': '支持空白自定义或选用预置模型',
    'wizard.tplCustomerDesc': '适用于客户身份认证、KYC 相关的业务场景。',
    'wizard.tplIndividualDesc': '适用于个人用户信息采集、身份验证等场景。',
    'wizard.tplEntityDesc': '适用于实体成员、企业信息采集等场景。',
    'wizard.tplRiskCustomerDesc': '涵盖客户、国家及服务交易三大风险维度（34 题）。',
    'wizard.tplRiskIndividualDesc': '涵盖恐怖分子名单、制裁、PEP 及高风险国家（5 题）。',
    'wizard.tplRiskEntityDesc': '涵盖恐怖分子名单、制裁、FATF 及高风险实体（4 题）。',
    'wizard.confirmOverwriteTitle': '覆盖确认',
    'wizard.confirmOverwriteDesc': '当前画布已包含 {pages} 个画板页面，载入 {title} 将完全覆盖当前画布内容。是否确认继续？',
    'wizard.confirmOverwriteBtn': '确定覆盖',
    'wizard.pagesCount': '{count} 页面',
    'wizard.fieldsCount': '{count} 字段',
    'wizard.questionsCount': '{count} 题',
    'wizard.lockedBlankDesc': '从空白画布开始，自由搭建当前案例的 KYC 问卷。',
    'wizard.lockedBlankRiskDesc': '从空白画布开始，自由配置当前案例的风险评估问题与权重。',

    // 新建表单弹窗 (CreateFormModal)
    'modal.createForm.title': '新建表单画布',
    'modal.createForm.profileType': '业务主体',
    'modal.createForm.formTitle': '表单名称',
    'modal.createForm.customer': '客户案例',
    'modal.createForm.individual': '个人案例',
    'modal.createForm.entity': '实体案例',
    'modal.createForm.desc': '初始化所选主体的基本资料画板，后续可在画布中自由拖拽编排。',
    'modal.createForm.create': '立即创建',
    'modal.createForm.cancel': '取消',
    'modal.createForm.confirmOverwriteTitle': '覆盖确认',
    'modal.createForm.confirmOverwriteDesc': '当前画布已包含 {pages} 个画板页面，新建表单将完全覆盖当前画布内容。是否确认继续？',
    'modal.createForm.confirmOverwriteBtn': '确定覆盖',
    'modal.createForm.createdSuccess': '表单画布创建成功',
    'modal.createForm.defaultPlaceholder': '留空默认为：{title}',

    // 预览与发布 (PreviewModal & PublishModal)
    'preview.preview': '预览',
    'preview.deploySchema': '发布结构',
    'preview.schemaJson': '结构 JSON',
    'preview.formSteps': '表单步骤列表',
    'preview.disclaimer': '预览效果仅供参考，实际显示可能因设备和浏览器不同而存在差异，请在移动端进行最终确认。',
    'preview.submitSuccess': '表单提交成功！',
    'preview.noFields': '当前页面暂无字段',
    'preview.validateForm': '表单验证',
    'preview.publishForm': '发布表单',
    'preview.publishFailed': '发布失败',
    'publish.modalTitle': '发布表单',
    'publish.modalDesc': '核对并确认表单基本信息与发布介绍，确认无误后即可发布生效。',
    'publish.riskModalDesc': '核对并确认风险评估表单基本信息，确认无误后即可发布生效。',
    'publish.formName': '表单名称',
    'publish.formNamePlaceholder': '请输入表单名称 (50字以内)',
    'publish.formNameEn': '英文表单名称',
    'publish.formNameEnPlaceholder': 'Enter English form name',
    'publish.formDesc': '表单描述 / 介绍',
    'publish.formDescPlaceholder': '向填表人介绍该表单的用途、填表须知或隐私声明（将展示在表单首屏）...',
    'publish.formDescEn': '英文表单描述',
    'publish.formDescEnPlaceholder': 'Introduce the purpose of the form, guidelines, or notices...',
    'publish.nameRequired': '表单名称不能为空',
    'publish.nameDuplicate': '表单名称已存在，请更换名称',
    'publish.confirmPublish': '确认发布',
    'publish.successTitle': '表单发布成功！',
    'publish.successDesc': '表单模板已发布生效。您可通过下方链接在新窗口预览移动端效果，或直接返回表单设置页面。',
    'publish.riskSuccessDesc': '风险评估表单已发布生效。您可以关闭当前页面后刷新列表，或直接返回表单管理页面。',
    'publish.backToRiskSetting': '返回表单设置',
    'publish.closePage': '关闭页面',
    'publish.openPreview': '新窗口打开',
    'publish.openPreviewTip': '点击在新窗口打开预览表单',

    // Schema 源码侧边栏 (SchemaSidebar)
    'schema.title': '表单结构 JSON Schema',
    'schema.copied': '已复制',
    'schema.copyJson': '复制 JSON',
    'schema.copySuccess': '已成功复制 Schema JSON 到剪贴板',

    // 新手漫游引导 (Product Tour)
    'tour.needCanvasMsg': '请先完成首张画布创建',
    'tour.nextBtn': '下一步 →',
    'tour.prevBtn': '← 上一步',
    'tour.doneBtn': '开始使用',
    'tour.progressText': '第 {{current}} / {{total}} 步',
    'tour.neverShow': '不再提示',
    'tour.neverShowTitle': '以后进入页面不再自动弹出操作指南',
    'tour.closedMsg': '已关闭操作指南，后续可随时点击顶栏“操作指南”重新开启',
    'tour.step1Title': '1. 侧边导航',
    'tour.step1Desc': '快速切换模板库、组件库与页面大纲。',
    'tour.step2Title': '2. 场景模板',
    'tour.step2Desc': '支持一键载入预设模板，或新建空白画布。',
    'tour.step3Title': '3. 组件物料',
    'tour.step3Desc': '包含基础与业务表单字段，支持点击或拖拽添加。',
    'tour.step4Title': '4. 设计画布',
    'tour.step4Desc': '拖拽空白处平移画布，滑动滚轮平滑缩放。',
    'tour.step5Title': '5. 基本资料页',
    'tour.step5Desc': '首页为客户基本资料展示页（不可编辑），后续页面可自由添加字段。',
    'tour.step6Title': '6. 属性配置',
    'tour.step6Desc': '配置表单全局设置、字段属性及展开联动规则。',
    'tour.step7Title': '7. 表单预览',
    'tour.step7Desc': '在手机模拟器中实时测试填表流程与字段校验。',
    'tour.step8Title': '8. 发布表单',
    'tour.step8Desc': '检查多语言完整度，并将表单正式保存发布。',
    'tour.step9Title': '9. 随时重新开启指南',
    'tour.step9Desc': '如果后续需要再次查看操作指南，可随时点击左下角此处的问号图标重新唤起。',
    'tour.risk.step1Title': '1. 风险评估组件',
    'tour.risk.step1Desc': '欢迎来到风险评估！点击或拖拽该组件添加到画布，选项固定为 Yes / No / NA 并支持配置扣分权重。',
    'tour.risk.step2Title': '2. 画布概览与快捷操作',
    'tour.risk.step2Desc': '点击画布空白区域即可在右侧面板查看问卷概览与评分规则，并可快捷新增分组或问题。',
    'tour.risk.step3Title': '3. 问题分组与题目管理',
    'tour.risk.step3Desc': '支持直接修改组名，按住左侧把手可上下拖拽排序；可在分组内点击“+ 添加问题”，或在右侧面板快捷加题加组。',
    'tour.risk.step4Title': '4. 翻译管理',
    'tour.risk.step4Desc': '点击进入多语言工作区，支持双画布左右对照，点击“+ Add Language”即可新增翻译。',
    'tour.risk.step5Title': '5. 保存与发布',
    'tour.risk.step5Desc': '设计完成后可随时保存草稿；点击“发布表单”系统将校验问卷并正式上线。',
    'tour.risk.step6Title': '6. 随时重新开启指南',
    'tour.risk.step6Desc': '如果后续需要再次查看操作指南，可随时点击左下角此处的问号图标重新唤起。',

    // API 接口错误提示
    'api.error400': '请求参数错误 (400)',
    'api.error401': '登录已失效，请重新登录 (401)',
    'api.error403': '拒绝访问，没有权限 (403)',
    'api.error404': '请求的资源不存在 (404)',
    'api.error500': '服务器内部错误 (500)',
    'api.error502': '服务器响应超时或服务暂时不可用 (502/503)',
    'api.errorFailed': '请求失败 ({status})',
    'api.errorTimeout': '请求超时，请检查网络后重试',
    'api.errorNetwork': '网络连接失败，请检查网络连接',
    'api.errorDefault': '网络连接异常，请检查网络',
    'api.operationFailed': '操作失败',

    // 404 页面 (NotFoundView)
    'notFound.title': '页面未找到',
    'notFound.desc': '抱歉，您访问的页面不存在或已被移除。',
    'notFound.formTitle': '未找到指定表单',
    'notFound.formDesc': '抱歉，您访问的表单不存在或已被删除。',
    'notFound.createNewForm': '新建表单',
    'notFound.backToBuilder': '返回表单设计器',
    'notFound.backToKycList': '返回表单列表',
    'notFound.autoRedirect': '将在 {countdown}s 后自动返回',

    // 风险评估问卷 (Risk Assessment)
    'risk.pageTitle': '风险评估',
    'risk.bilingualVideoTitle': '多语言风险评估问卷操作演示',
    'risk.bilingualVideoTip': '温馨提示：进入翻译管理后，可对照配置风险评估题目与选项语言版本。',
    'risk.catComponents': '风险评估组件',
    'risk.cmpQuestion': '风险评估问题',
    'risk.cmpQuestionCardDesc': '拖拽至分组或直接点击添加，用于构建客户合规审查项。',
    'risk.cmpOptLabel': '选项:',
    'risk.cmpScoringRule': '扣分制',
    'risk.dragToAddTip': '按住拖拽添加至分组',
    'risk.cmpGroup': '问题分组',
    'risk.groupOutlineTitle': '问题分组',
    'risk.groupTab': '分组',
    'risk.groupCount': '{count} 个分组',
    'risk.questionsCount': '{count} 个问题',
    'risk.questionUnit': '题',
    'risk.addGroup': '添加问题分组',
    'risk.addQuestion': '添加问题',
    'risk.addQuestionToGroup': '添加本组问题',
    'risk.deleteGroup': '删除分组',
    'risk.deleteGroupConfirm': '确定删除该分组及其包含的问题吗？',
    'risk.defaultGroupTitle': '分组 {index}',
    'risk.groupNamePlaceholder': '请输入分组名称...',
    'risk.groupInfo': '分组信息',
    'risk.groupInfoSub': '英文分组名称为必填项，中文翻译选填',
    'risk.dragReorderTip': '按住拖拽调整分组顺序',
    'risk.dropzoneTip': '从左侧拖入评估问题组件，或点击下方按钮添加问题',
    'risk.propQuestionTitle': '问题设置',
    'risk.propQuestionSub': '配置评估问题与分值权重',
    'risk.propGroupTitle': '分组设置',
    'risk.propGroupSub': '配置分组名称及组内问题',
    'risk.canvasSettingsDesc': '问卷标题、引导说明与快捷概览',
    'risk.overviewStats': '问卷概览',
    'risk.groupUnit': '分组',
    'risk.rulesCardTitle': '评分规则说明',
    'risk.rulesCardDesc': '采用固定命中扣分制；回答选项固定为 Yes / No / Not Applicable，勾选“Yes”表示命中风险项并按设定权重扣除分值。',
    'risk.addGroupBtn': '添加分组',
    'risk.addSectionSlot': '添加新问题分组',
    'risk.groupCreated': '已添加新问题分组',

    // 标准组件类型名称 (Component Names)
    'comp.input': '单行文本',
    'comp.textarea': '多行文本',
    'comp.radio': '单选框组',
    'comp.checkbox': '多选框组',
    'comp.select': '下拉选择',
    'comp.date': '日期选择',
    'comp.phone': '手机号码',
    'comp.email': '电子邮箱',
    'comp.country': '国家/地区',
    'comp.nationality': '国籍选择',
    'comp.signature': '电子签名',
    'comp.alert': '提示说明',

    // 风险评估扩展文案 (Risk Assessment Ext)
    'risk.duplicateQuestion': '复制问题',
    'risk.insertQuestionBelow': '在下方插入问题',
    'risk.deleteQuestion': '删除问题',
    'risk.questionContent': '问题内容',
    'risk.enterQuestionPlaceholder': '请输入风险评估问题...',
    'risk.weightSettings': '权重设置',
    'risk.weightSettingsDesc': '新问题默认权重为 1。选择 “Yes” 表示命中风险项，系统将按该问题的权重扣减风险评分。请将问题表述为：回答 “Yes” 时明确代表存在风险。',
    'risk.yesDeductionWeight': '命中扣分权重',
    'risk.yesDeductionTip': '回答“Yes”表示命中风险项，系统将按此权重扣减评分',
    'risk.weightBadge': '权重：{weight}',
    'risk.ptsUnit': '分',
    'risk.groupNameWithLang': '分组名称 (中文)',

    // 发布校验与提示 (Publish & Validation)
    'header.valNoPages': '请至少添加一个表单页面后再发布',
    'header.valEmptyPageTitle': '请填写第 {page} 页的页面标题',
    'header.valEmptyPageFields': '第 {page} 页暂无表单组件，请添加组件或删除空页面',
    'header.valEmptyGroupTitle': '请填写分组 {index} 的分组名称',
    'header.valEmptyQuestionText': '请填写第 {index} 道评估问题的题目内容',
    'header.valEmptyGroupQuestionText': '请填写「{group}」第 {index} 题的题目内容',
    'header.valEmptyGroupQuestionTextMulti': '请填写「{group}」第 {index} 题的题目内容（共 {total} 题未填写）',
    'header.valEmptyFieldLabel': '请填写第 {page} 页中未命名组件的标题',
    'header.draftSavedWithTime': '已保存至草稿 {time}',

    // 预览与提交结果 (Preview & Submission)
    'preview.submissionCompleted': '提交已完成',
    'preview.submissionThanks': '感谢您的填写！您的表单信息已成功提交。',
    'preview.status': '处理状态',
    'preview.completed': '已完成',
    'preview.submissionNo': '提交编号',
    'preview.submissionTime': '提交时间',
    'preview.refillFormPreview': '重新体验填报',
    'preview.signatureArea': '签名区域',

    // 发布弹窗扩展 (Publish Modal Ext)

    // 翻译抽屉与通用 (Translation Helper & Common)
    'trans.pageTitle': '页面标题',
    'trans.pageDesc': '描述说明',
    'trans.group': '分组',
    'trans.content': '提示说明',
    'trans.placeholder': '输入提示',
    'trans.helpText': '副标题',
    'trans.option': '选项',
    'trans.fieldDefault': '表单字段',
    'trans.fieldLabel': '字段标签',
    'trans.fieldPlaceholder': '输入提示',
    'trans.fieldHelp': '帮助说明 / 副标题',
    'trans.fieldContent': '提示内容',
    'trans.exitWorkspace': '退出翻译',
    'trans.multilingual': '翻译管理',
    'trans.addLanguage': '翻译管理',
    'trans.addLanguageShort': '添加语言',
    'trans.removeLanguage': '移除语言',
    'trans.defaultLang': '默认',
    'trans.translatablePages': '可翻译页面',
    'trans.countLeft': '待译 {count}',
    'trans.noPagesToTranslate': '暂无需要翻译的自定义页面',
    'trans.addedLocaleSuccess': '已添加 {name} 翻译版本',
    'trans.removedLocaleSuccess': '已移除 {name} 翻译版本',
    'trans.singleLocaleTitle': '当前为单语言版本',
    'trans.singleLocaleDesc': '未启用多语言翻译。可直接发布当前单语言表单，或点击「+ 添加语言」开启多语言对照',
    'trans.backToNormalDesign': '返回普通设计模式',
    'trans.navTitle': '翻译管理',
    'trans.navSubtitle': '页面导航与翻译进度',
    'trans.propTitle': '译文属性',
    'trans.propSubtitle': '对照源语言编辑目标内容',
    'trans.pendingSummary': '{count} 项{langName}未翻译',
    'trans.translated': '已填写',
    'trans.pending': '待翻译',
    'trans.completed': '已完成',
    'trans.allDoneShort': '已译完',
    'trans.sourceTextLabel': '{lang}原文',
    'trans.optionsTitle': '选项译文对照',
    'trans.declarationOptionsTitle': '声明条款译文对照',
    'trans.sigPromptLabel': '签名区提示文字',
    'trans.signWatermarkLabel': '手写区内提示文字',
    'trans.startDatePlaceholder': '开始日期提示',
    'trans.endDatePlaceholder': '截止日期提示',
    'trans.longTermOptionLabel': '长期选项文案',
    'trans.pageTranslation': '页面译文',
    'trans.pageTitleLabel': '页面标题',
    'trans.pageDescLabel': '页面副标题 / 描述',
    'trans.groupTranslation': '问题分组译文',
    'trans.groupTitleLabel': '分组名称',
    'trans.enterTarget': '请输入译文...',
    'header.warnMultiCount': '当前表单还有 {count} 项多语言翻译尚未完成。',
    'header.warnMultiDesc': '现在发布可能导致对应语言访问时显示英文或空白，建议补充完整后再发布。',
    'common.leaveConfirm': '您有未保存的更改，确定要离开吗？',
    'prop.pageTitleWithLang': '页面标题',
    'prop.pageDescWithLang': '页面描述',

  },
  en: {
    // 通用与状态 (Common)
    'common.untitledPage': 'Untitled Page',
    'common.untitledField': 'Untitled Field',
    'common.notice': 'Notice',
    'common.signed': 'Signed',
    'common.clearSignature': 'Clear Signature',
    'common.clickToSign': 'Click to sign',
    'common.longTerm': 'Long-term',
    'common.longTermValid': 'Permanent',
    'common.systemPreset': 'Built-in',
    'common.cannotDrop': 'Cannot Drop',
    'common.basicInfo': 'Basic Information',
    'common.readOnly': 'Read-only',
    'modal.cancel': 'Cancel',
    'modal.confirm': 'Confirm',
    'common.pagesUnit': 'Pages',
    'common.fieldsUnit': 'fields',
    'common.optionsUnit': 'options',
    'common.totalOptions': '{count} options',
    'common.prev': 'Previous',
    'common.confirmNext': 'Confirm & Next',
    'common.nextStep': 'Next Step',
    'common.cancel': 'Cancel',
    'common.singapore': 'Singapore',
    'common.prefilledBaseline': 'Pre-filled Baseline',
    'common.startDate': 'Start Date',
    'common.endDate': 'End Date',
    'val.maxOptions': 'Maximum {count} options allowed',
    'val.maxItems': 'Maximum {count} items allowed',
    'dir.searchPlaceholder': 'Search by country/region, nationality, code or dial code (e.g. Singapore, SG, +65)...',
    'dir.country': 'Country/Region',
    'dir.nationality': 'Nationality',
    'dir.code': 'Code',
    'dir.dialCode': 'Dial Code',
    'dir.noMatching': 'No matching records found',
    'dir.totalCountPrefix': 'Total',
    'dir.totalCountSuffix': 'countries & regions',
    'dir.presetList': 'Preset List',
    'dir.standardNote': 'This list is based on ISO 3166-1 and relevant United Nations naming references. It is intended solely for data collection and does not imply any position by this platform regarding the legal status of any country or region.',
    'common.close': 'Close',

    // 顶部导航栏 (AppHeader)
    'app.riskWorkspaceTitle': 'Risk Assessment Workspace',
    'app.formWorkspaceTitle': 'Form Design Workspace',
    'app.dirty': 'Unsaved Changes',
    'app.saved': 'Saved to draft',
    'app.saving': 'Saving...',
    'app.save': 'Save to Draft',
    'app.preview': 'Preview',
    'app.deploy': 'Publish',
    'app.settings': 'Panel Settings',
    'app.leftSidebar': 'Component Library',
    'app.rightSidebar': 'Properties Panel',
    'header.formTitlePlaceholder': 'Enter form title',
    'header.clickToRename': 'Click to rename form',
    'header.renameForm': 'Rename form',
    'header.tour': 'User Guide',
    'header.saveSuccess': 'Saved to draft',
    'header.saveFailed': 'Save failed, please check network or try again',
    'header.untitledForm': 'Untitled Form',
    'header.warnTitle': 'Translation Incomplete Warning',
    'header.warnMore': '...and {count} more items',
    'header.warnComplete': 'Complete Translations',
    'header.warnPublishAnyway': 'Publish Anyway',
    'header.untranslatedTag': 'Untranslated',
    'header.bilingualGuideTitle': 'Translation Management Guide',
    'header.bilingualGuideDesc': 'Manage form translations across languages. You can edit source and target language copies side-by-side in the translation workspace. Respondents can toggle languages via the top-right button.',
    'header.bilingualVideoTitle': 'Multilingual KYC Questionnaire Video Tutorial',
    'header.bilingualVideoTip': 'Tip: You can configure corresponding form language versions in Translation Management.',

    // 用户下拉菜单 (User Menu)
    'user.logout': 'Sign Out',
    'user.role': 'System Administrator',

    // 侧边栏物料库 (MaterialSidebar)
    'sidebar.searchPlaceholder': 'Search components...',
    'sidebar.searchEmpty': 'No matching components found',
    'sidebar.catBasic': 'Basic Inputs',
    'sidebar.catBusiness': 'Business Components',
    'sidebar.tooltipCollapse': 'Collapse',
    'sidebar.components': 'Components',
    'sidebar.templates': 'Templates',
    'sidebar.pages': 'Pages',
    'sidebar.searchTooltip': 'Search',
    'sidebar.collapseBtn': 'Collapse',
    'sidebar.searchTemplates': 'Search templates...',
    'sidebar.createBlank': 'Create Blank Canvas',
    'sidebar.createBlankDesc': 'Build form from scratch',
    'sidebar.presetScenarios': 'Preset Scenarios',
    'sidebar.addCanvasPage': 'Add Canvas Page',
    'sidebar.templateLoaded': 'Template loaded',
    'sidebar.pageAdded': 'New canvas page added',
    'sidebar.pageDeleted': 'Canvas page deleted',
    'sidebar.deletePagePrompt': 'Are you sure you want to delete this canvas page?',
    'sidebar.systemPreset': 'Fixed Page',
    'sidebar.componentAdded': 'Component added to canvas',
    'sidebar.tabComponents': 'Component Library',
    'sidebar.tabTemplates': 'Templates',
    'sidebar.tabPages': 'Pages',
    'sidebar.subComponents': 'Drag or click to canvas',
    'sidebar.subTemplates': 'KYC Standards',
    'sidebar.resizeHandleTip': 'Drag to resize material sidebar',
    'sidebar.useTemplate': 'Use Template',
    'sidebar.confirmOverwriteTitle': 'Confirm Overwrite',
    'sidebar.confirmOverwriteDesc': 'The current canvas already contains {pages} artboard page(s). Loading a new template will overwrite current canvas contents. Are you sure you want to continue?',
    'sidebar.confirmOverwriteBtn': 'Confirm Overwrite',

    // 画布与画板交互 (InfiniteCanvas & PageFrame)
    'canvas.defaultLangTip': 'Note: In canvas mode, you are editing content in the default language (English). Please enter all component content in English.',
    'common.signAreaPlaceholder': 'Please sign in the designated area below',
    'canvas.signatureArea': 'Please sign here',
    'canvas.droppable': 'Droppable Canvas',
    'canvas.presetCannotDrop': 'Fixed Page · Cannot Add Fields',
    'canvas.dragToFormCanvas': 'Please drag components to subsequent form canvases',
    'canvas.emptyTitle': 'Canvas is currently empty',
    'canvas.emptyDesc': 'Drag and drop components from the left sidebar to start building',
    'canvas.addPageRight': 'Add new page to the right',
    'canvas.initializing': 'Initializing canvas...',
    'canvas.expandSidebar': 'Expand Sidebar',
    'canvas.expandProperties': 'Expand Properties',
    'canvas.zoomIn': 'Zoom in',
    'canvas.zoomOut': 'Zoom out',
    'canvas.zoom100': 'Zoom to 100%',
    'canvas.zoomFit': 'Zoom to Fit',
    'canvas.zoomSelection': 'Zoom to Selection',
    'canvas.profileIndividual': 'Individual',
    'canvas.profileEntity': 'Entity',
    'canvas.profileCustomer': 'Customer',
    'canvas.todoZhTitle': 'Chinese Completion Checklist',
    'canvas.todoEnTitle': 'English Translation Checklist',
    'canvas.todoTotalCount': '{count} item(s) in total',
    'canvas.todoLocate': 'Locate & Fill',
    'canvas.todoIgnore': 'Ignore for now',
    'canvas.todoZhCount': '{count} Chinese field(s) empty',
    'canvas.todoEnCount': '{count} English translation(s) missing',
    'canvas.conditionPrefix': 'If "{option}" is selected',
    'canvas.yes': 'Yes',
    'canvas.no': 'No',
    'canvas.todoNextIndexed': 'Next ({current}/{total})',
    'canvas.dependentLockedTitle': 'Conditional Dependent: Position locked and follows parent trigger',
    'canvas.tier2': 'Level 2',
    'canvas.backToContent': 'Back to Content',
    'canvas.componentDuplicated': 'Component duplicated (Ctrl+D)',
    'canvas.selectToDuplicate': 'Please select a component on canvas to duplicate',

    // 右键上下文菜单 (ContextMenu)
    'context.duplicate': 'Duplicate',
    'context.insertBelow': 'Insert Component',
    'context.linkComponent': 'Link Component',
    'context.unlinkElement': 'Unlink Rule',
    'context.deleteElement': 'Delete Component',
    'context.presetReadOnly': 'System Preset',
    'context.addComponent': 'Add Component',
    'context.insertPageAfter': 'Insert Page After',
    'context.resetView': 'Reset View',
    'context.deletePage': 'Delete Current Canvas',
    'context.newPage': 'New Blank Page',
    'context.confirmDeleteTitle': 'Confirm Delete Canvas',
    'context.confirmDeleteContent': 'Are you sure you want to delete this canvas and all its contents? This action cannot be undone.',
    'context.confirmDeleteOk': 'Delete',

    // 属性面板：基础属性 (FieldBasicProps)
    'prop.title': 'Properties',
    'prop.elementSubtitle': 'Component Field Settings',
    'prop.emptyTitle': 'No Element Selected',
    'prop.emptyDesc': 'Click any field on the canvas to edit',
    'prop.basicInfo': 'Basic Information',
    'prop.basicInfoDesc': 'Configure field label, display and validation',
    'prop.canvasSettings': 'Canvas Settings',
    'prop.deletePage': 'Delete Page',
    'prop.fieldLabel': 'Field Label',
    'prop.fieldLabelPlaceholder': 'Enter field label',
    'prop.inputPlaceholder': 'Please enter content',
    'prop.textareaPlaceholder': 'Please enter detailed description...',
    'prop.selectPlaceholder': 'Please select an option',
    'prop.datePlaceholder': 'Please select a date',
    'prop.agreeDeclarationHint': 'Please agree to the declarations',
    'prop.fieldHelp': 'Subtitle',
    'prop.fieldHelpPlaceholder': 'Enter subtitle or explanation',
    'prop.helpLayout': 'Layout',
    'prop.helpPositionRight': 'Inline',
    'prop.helpPositionBottom': 'Below',
    'prop.helpPositionRightDesc': 'Inline on right (default light gray text)',
    'prop.helpPositionBottomDesc': 'Below title (new line)',
    'prop.helpPositionTip': 'Control subtitle placement: inline beside title or on a new line below title.',
    'prop.showLabel': 'Show Label',
    'prop.showSignPrompt': 'Show Prompt',
    'prop.required': 'Required',
    'prop.declarationRequired': 'Declarations Required',
    'prop.customErrorMsg': 'Validation Message',
    'prop.customizeError': 'Customize',
    'prop.defaultFallback': 'System Default',
    'prop.defaultFallbackTip': 'Error message displayed when the field is left empty on submission',
    'prop.previewGifPlaceholder': 'GIF Preview Area',
    'prop.resetToDefaultError': 'Reset to Default',
    'prop.declarationErrorMsg': 'Declaration Error Message',
    'prop.placeholder': 'Placeholder',
    'prop.enableLongTerm': 'Enable Long-term Option',
    'prop.enableLongTermTip': 'Show a "Long-term" checkbox next to single date input (disabled in date range mode).',
    'prop.defaultLongTerm': 'Default to Long-term',
    'prop.defaultLongTermTip': 'Default to long-term checked when filling form, bypassing date requirement.',
    'prop.addOption': 'Add Option',
    'prop.addClauseItem': 'Add Clause',
    'prop.layoutInline': 'Inline',
    'prop.layoutStack': 'Stacked',
    'prop.allowMultiple': 'Allow Multi-selection',
    'prop.defaultDialCode': 'Default Dial Code',
    'prop.copy': 'Duplicate',
    'prop.delete': 'Delete',
    'prop.collapsePanel': 'Collapse panel',
    'prop.systemBaseline': 'Basic Information Page',
    'prop.locked': 'Locked',
    'prop.deletePageConfirm': 'Are you sure you want to delete this canvas page? This cannot be undone.',
    'prop.presetNationalities': 'Preset Nationalities',
    'prop.presetCountries': 'Preset Countries',
    'prop.viewDirectory': 'View',
    'prop.fieldFallback': 'Field',
    'prop.clientCase': 'Client Case',
    'prop.entityCase': 'Entity Case',
    'prop.individualCase': 'Individual Case',
    'prop.systemPresetAlert': 'This page displays auto-populated client basic information as read-only and cannot be edited here.',
    'prop.defaultCountryPlaceholder': 'Select Country/Region',
    'prop.defaultNatPlaceholder': 'Select Nationality',
    'prop.linkageRuleTitle': 'Display Rule',
    'prop.linkageWhen': 'When',
    'prop.linkageEquals': 'selects',
    'prop.linkageThenShow': 'to show',
    'prop.linkageAndJoin': 'AND',
    'prop.linkageOrJoin': 'OR',
    'prop.linkageLogicAnd': 'All',
    'prop.linkageLogicOr': 'Any',
    'prop.removeSingleCondition': 'Remove this condition',
    'prop.linkageTipSimple': 'Hidden by default until conditions are met',
    'prop.locateParentTip': 'Click to locate upstream component on canvas',
    'prop.unlinkRuleConfirm': 'Unlink this condition? The field will become permanently visible.',
    'prop.unlink': 'Unlink',
    'prop.resizeHandleTip': 'Drag to resize property panel',
    'prop.rowRange': 'Row Range',
    'prop.rowRangeTip': 'Set textarea adaptive row height range (min rows ~ max rows). Initially renders min rows, automatically expands as content increases, and scrolls when exceeding max rows.',
    'prop.rowUnit': 'rows',
    'prop.defaultMaxLengthPlaceholder': 'Default 800',
    'prop.charUnit': 'chars',
    'prop.untranslated': 'Untranslated',

    // 属性面板：特定组件属性 (FieldSpecificProps)
    'prop.handwrittenSignPad': 'Handwritten Signature Pad',
    'prop.signatureRequired': 'Signature Required',
    'prop.signatureErrorMsg': 'Missing Signature Message',
    'prop.sigPadLabel': 'Signature Prompt Text',
    'prop.signWatermarkPlaceholder': 'Signature Pad Placeholder',
    'prop.datePickerLabel': 'Date Picker Placeholder',
    'prop.startDatePlaceholder': 'Start Date Placeholder',
    'prop.endDatePlaceholder': 'End Date Placeholder',
    'prop.longTermOptionLabel': 'Long-term Option Text',
    'prop.dateMode': 'Date Mode',
    'prop.dateModeTip': 'Configure date selection mode: single date or date range.',
    'prop.dateModeSingle': 'Single Date',
    'prop.dateModeRange': 'Date Range',
    'prop.alertContentTitle': 'Notice Content',
    'prop.alertContentTip': 'Enter notice text directly. Lines starting with "- " create bullet points. Supports [Link](url) hyperlinks.',
    'prop.alertContentPlaceholder': 'Enter notice content...\n- Start with "- " for list items\n- Supports [Link Text](xxx.com) hyperlinks',
    'prop.alertEmptyContentPlaceholder': 'Please enter notice content',
    'prop.alertInsertBullet': 'Bullet',
    'prop.alertInsertLink': 'Link',
    'prop.maxSelections': 'Max Allowed Selections',
    'prop.inputType': 'Format Type',
    'prop.inputTypeTip': 'Set single line input format: normal text or number.',
    'prop.inputTypeText': 'Text',
    'prop.inputTypeNumber': 'Number',
    'prop.emailPlaceholderLabel': 'Email Placeholder',
    'prop.emailPlaceholder': 'Please enter email',
    'prop.maxSelectionsCountryTip': 'Country/Nationality component allows up to 3 selections',
    'prop.maxSelectionsOptionsTip': 'Up to {count} selections allowed (within available options)',
    'prop.maxLength': 'Max Length',
    'prop.maxLengthTip': 'Limit the maximum number of characters allowed. Default is 800 (leave blank to inherit default 800, customizable).',
    'prop.alertListCircleFull': 'Bullet List (Unordered)',
    'prop.alertListNumberFull': 'Numbered List (Ordered)',
    'prop.alertLinkTextSample': 'Link Text',

    // 属性面板：页面属性 (PagePropsEditor)
    'prop.pageSubtitle': 'Page Canvas Settings',
    'prop.page': 'Page',
    'prop.pageTitlePlaceholder': 'Enter page title',
    'prop.pageDescPlaceholder': 'Subtitle or description displayed below the title',

    // 选项与级联联动 (OptionsEditor)
    'prop.optionsConfig': 'Option Settings',
    'prop.optionsConfigTip': 'Configure choices displayed to users.',
    'prop.clauseConfig': 'Declaration Clauses',
    'prop.clauseConfigTip': 'Configure legal declaration clauses for user acknowledgment.',
    'prop.optionLayout': 'Layout',
    'options.deleteOption': 'Delete Option',
    'options.noticePlaceholder': 'Enter notice or declaration text...',
    'options.dragToReorderIndexed': 'Drag to reorder Option {index}',
    'options.toggleDefaultRadio': 'Click to toggle default selection',
    'options.toggleDefaultCheckbox': 'Click to toggle default check',
    'options.linkConfigTitle': 'Configure fields to reveal when choosing [{name}]',
    'options.linkTriggerHeader': 'Reveal when selecting [{name}]',
    'options.chooseFollowupField': 'Add new followup field to reveal:',
    'options.orLinkExisting': 'Or select existing downstream fields:',
    'options.expandedTag': 'Reveal: {name}',
    'options.thisOption': 'This option',
    'options.declarationPlaceholder': 'Enter declaration terms (Clause {index})',
    'options.clauseLabel': 'Clause {index}',
    'options.unlink': 'Unlink',
    'options.maxDepthReached': 'Maximum nesting depth reached (up to 2 levels). Cannot add deeper sub-questions to ensure optimal form performance and mobile usability.',
    'options.maxDepthReachedShort': 'Max nesting depth reached (up to 2 levels)',

    // 系统预设资料页 (SystemProfileView)
    'profile.notice.ind1': 'According to regulatory compliance requirements, you need to complete the KYC questionnaire.',
    'profile.notice.ent1': 'You will complete the KYC questionnaire as the authorized representative of the company below.',
    'profile.notice.common': 'Please verify if the following information is accurate. If modification is required, contact your service provider before proceeding.',
    'profile.customerTitle': 'Customer Registration Information',
    'profile.entityTitle': 'Corporate Registration Information',
    'profile.basicTitle': 'Basic Information',
    'profile.authorizedRep': 'Authorized Representative',
    'profile.associatedInfo': 'Associated Information',
    'profile.associatedEntity': 'Associated Entity',
    'profile.relationshipType': 'Relationship Type',
    'profile.shareholder': 'Shareholder',
    'profile.director': 'Director',
    'profile.partner': 'Partner',
    'profile.capitalTitle': 'Shareholding & Capital Info',
    'profile.shareClass': 'Share Class',
    'profile.sharesHeld': 'Shares Held',
    'profile.paidUpAmount': 'Allocated Paid-up Capital',
    'profile.field.name': 'Full Name',
    'profile.field.nativeName': 'Native Language Name',
    'profile.field.nationality': 'Nationality',
    'profile.field.sgStatus': 'Singapore Status',
    'profile.field.nricFin': 'NRIC/FIN (if applicable)',
    'profile.field.idType': 'ID Document Type',
    'profile.field.idNumber': 'ID / Passport Number',
    'profile.field.dob': 'Date of Birth',
    'profile.field.gender': 'Gender',
    'profile.field.phone': 'Mobile Phone',
    'profile.field.email': 'Email Address',
    'profile.field.resAddress': 'Residential Address',
    'profile.field.contactAddress': 'Contact Address',
    'profile.field.entityName': 'Entity Name',
    'profile.field.formerName': 'Former Name (if any)',
    'profile.field.jurisdiction': 'Jurisdiction of Incorporation',
    'profile.field.entityRegNo': 'Entity Registration Number',
    'profile.field.registeredAddress': 'Registered Address',
    'profile.field.repCapacity': 'Capacity / Role',
    'profile.field.repName': 'Representative Name',
    'profile.val.singapore': 'Singapore',
    'profile.val.singaporean': 'Singaporean',
    'profile.val.sgCitizen': 'Singapore Citizen',
    'profile.val.idCardPassport': 'NRIC / Passport',
    'profile.val.male': 'Male',
    'profile.val.repCapacityVal': 'Director / Senior Officer',
    'profile.val.repIdTypeVal': 'NRIC (Singapore Citizen)',

    // 欢迎向导弹窗 (WelcomeWizardModal)
    'wizard.brandSubtitle': 'DIY Form Builder',
    'wizard.brandSubtitleRisk': 'Risk Assessment Form Builder',
    'wizard.createNewTag': 'Create NEW',
    'wizard.createBlank': 'Create Blank Canvas',
    'wizard.createBlankDesc': 'Click the "Create Now" button at the bottom left to start creating your first custom form.',
    'wizard.createBlankRisk': 'Create Risk Assessment Form',
    'wizard.createBlankRiskDesc': 'Configure compliance risk forms for Customer, Individual, or Entity profiles with Yes / No / Not Applicable logic and dynamic scoring weights.',
    'wizard.createNowBtn': 'Create Now',
    'wizard.selectTemplate': 'Select Template',
    'wizard.selectTemplateDesc': 'Create quickly with templates to boost design efficiency',
    'wizard.lockedSubtext': 'Start from scratch or use scenario templates',
    'wizard.lockedSubtextRisk': 'Start from scratch or use preset models',
    'wizard.tplCustomerDesc': 'Suitable for customer identification and KYC-related scenarios.',
    'wizard.tplIndividualDesc': 'Suitable for personal user data collection and identity verification.',
    'wizard.tplEntityDesc': 'Suitable for corporate clients and enterprise information collection.',
    'wizard.tplRiskCustomerDesc': 'Covers client, country, and service risk dimensions (34 questions).',
    'wizard.tplRiskIndividualDesc': 'Covers terrorist list, sanctions, PEP, and FATF high-risk checks (5 questions).',
    'wizard.tplRiskEntityDesc': 'Covers terrorist list, sanctions, FATF, and higher-risk entity checks (4 questions).',
    'wizard.confirmOverwriteTitle': 'Confirm Overwrite',
    'wizard.confirmOverwriteDesc': 'The current canvas already contains {pages} artboard page(s). Applying {title} will overwrite all current canvas contents. Are you sure you want to continue?',
    'wizard.confirmOverwriteBtn': 'Confirm Overwrite',
    'wizard.pagesCount': '{count} Pages',
    'wizard.fieldsCount': '{count} Fields',
    'wizard.questionsCount': '{count} Questions',
    'wizard.lockedBlankDesc': 'Start from a blank canvas and build the KYC questionnaire for this subject.',
    'wizard.lockedBlankRiskDesc': 'Start from a blank canvas and configure risk questions and weights for this subject.',

    // 新建表单弹窗 (CreateFormModal)
    'modal.createForm.title': 'New Form Canvas',
    'modal.createForm.profileType': 'Profile Type',
    'modal.createForm.formTitle': 'Form Title',
    'modal.createForm.customer': 'Customer',
    'modal.createForm.individual': 'Individual',
    'modal.createForm.entity': 'Entity',
    'modal.createForm.desc': 'Initializes basic profile artboard for the selected entity. You can freely orchestrate components on the canvas afterward.',
    'modal.createForm.create': 'Create Canvas',
    'modal.createForm.cancel': 'Cancel',
    'modal.createForm.confirmOverwriteTitle': 'Confirm Overwrite',
    'modal.createForm.confirmOverwriteDesc': 'The current canvas already contains {pages} artboard page(s). Creating a new form will overwrite all current canvas contents. Are you sure you want to continue?',
    'modal.createForm.confirmOverwriteBtn': 'Confirm Overwrite',
    'modal.createForm.createdSuccess': 'Form canvas created successfully',
    'modal.createForm.defaultPlaceholder': 'Default: {title}',

    // 预览与发布 (PreviewModal & PublishModal)
    'preview.preview': 'Preview',
    'preview.deploySchema': 'Deploy Schema',
    'preview.schemaJson': 'Schema JSON',
    'preview.formSteps': 'Form Steps',
    'preview.disclaimer': 'Preview is for reference only. Actual display may vary depending on device and browser. Please verify on mobile devices.',
    'preview.submitSuccess': 'Submitted successfully!',
    'preview.noFields': 'Current page has no fields',
    'preview.validateForm': 'Validate Form',
    'preview.publishForm': 'Publish Form',
    'preview.publishFailed': 'Publish failed',
    'publish.modalTitle': 'Publish Form',
    'publish.modalDesc': 'Verify and confirm form name and description before publishing.',
    'publish.riskModalDesc': 'Verify and confirm risk assessment form details before publishing.',
    'publish.formName': 'Form Name',
    'publish.formNamePlaceholder': 'Enter form name (up to 50 chars)',
    'publish.formNameEn': 'English Form Name',
    'publish.formNameEnPlaceholder': 'Enter English form name',
    'publish.formDesc': 'Form Description',
    'publish.formDescPlaceholder': 'Introduce the purpose of the form, guidelines, or notices (displayed on first screen)...',
    'publish.formDescEn': 'English Description',
    'publish.formDescEnPlaceholder': 'Introduce the purpose of the form, guidelines, or notices...',
    'publish.nameRequired': 'Form name is required',
    'publish.nameDuplicate': 'Form name already exists, please use another name',
    'publish.confirmPublish': 'Confirm Publish',
    'publish.successTitle': 'Form Published Successfully!',
    'publish.successDesc': 'The form template is now live. You can preview the mobile experience via the link below, or return to form settings.',
    'publish.riskSuccessDesc': 'The risk assessment form has been published. You can close this page and refresh the list, or return to the form settings page.',
    'publish.backToRiskSetting': 'Back to Form Settings',
    'publish.closePage': 'Close Page',
    'publish.openPreview': 'Open in New Tab',
    'publish.openPreviewTip': 'Click to open preview form in a new window',

    // Schema 源码侧边栏 (SchemaSidebar)
    'schema.title': 'JSON Schema Structure',
    'schema.copied': 'Copied',
    'schema.copyJson': 'Copy JSON',
    'schema.copySuccess': 'Schema JSON copied to clipboard',

    // 新手漫游引导 (Product Tour)
    'tour.needCanvasMsg': 'Please create a form canvas first.',
    'tour.nextBtn': 'Next →',
    'tour.prevBtn': '← Back',
    'tour.doneBtn': 'Start Now',
    'tour.progressText': 'Step {{current}} of {{total}}',
    'tour.neverShow': "Don't show again",
    'tour.neverShowTitle': 'Never show user guide automatically on startup',
    'tour.closedMsg': 'User guide closed. You can restart it anytime from "User Guide" in the top bar.',
    'tour.step1Title': '1. Navigation',
    'tour.step1Desc': 'Switch between Templates, Components, and Pages.',
    'tour.step2Title': '2. Templates',
    'tour.step2Desc': 'Load a preset template or create a blank canvas.',
    'tour.step3Title': '3. Components',
    'tour.step3Desc': 'Form fields can be added by clicking or dragging.',
    'tour.step4Title': '4. Canvas',
    'tour.step4Desc': 'Drag empty canvas to pan, scroll wheel to zoom.',
    'tour.step5Title': '5. Basic Info Page',
    'tour.step5Desc': 'First page displays read-only basic information; subsequent pages are customizable.',
    'tour.step6Title': '6. Properties',
    'tour.step6Desc': 'Configure form settings, field properties, and linkage rules.',
    'tour.step7Title': '7. Preview',
    'tour.step7Desc': 'Test form flow and field validations in mobile preview.',
    'tour.step8Title': '8. Publish',
    'tour.step8Desc': 'Verify translation completeness and publish the form.',
    'tour.step9Title': '9. Reopen Guide Anytime',
    'tour.step9Desc': 'Click this help icon here on the bottom-left bar at any time to reopen this interactive guide.',
    'tour.risk.step1Title': '1. Risk Question Component',
    'tour.risk.step1Desc': 'Welcome to Risk Assessment! Click or drag this component to the canvas. Fixed Yes/No/NA logic with weight scoring.',
    'tour.risk.step2Title': '2. Canvas Overview & Quick Actions',
    'tour.risk.step2Desc': 'Click the canvas to view the form overview and scoring rules in the right panel, and quickly add groups or questions.',
    'tour.risk.step3Title': '3. Question Group & Management',
    'tour.risk.step3Desc': 'Edit group names inline and drag the left handle to reorder. Click "+ Add Question" inside the group or use the right panel to add questions and groups.',
    'tour.risk.step4Title': '4. Translation Management',
    'tour.risk.step4Desc': 'Enter the workspace for side-by-side localization. Click "+ Add Language" to create a new translation.',
    'tour.risk.step5Title': '5. Save & Publish',
    'tour.risk.step5Desc': 'Save progress to draft anytime, or click "Publish" to validate and deploy your form.',
    'tour.risk.step6Title': '6. Reopen Guide Anytime',
    'tour.risk.step6Desc': 'Click this help icon here on the bottom-left bar at any time to reopen this interactive guide.',

    // API 接口错误提示
    'api.error400': 'Bad request parameter (400)',
    'api.error401': 'Session expired, please sign in again (401)',
    'api.error403': 'Access denied, permission required (403)',
    'api.error404': 'Requested resource not found (404)',
    'api.error500': 'Internal server error (500)',
    'api.error502': 'Server timeout or service temporarily unavailable (502/503)',
    'api.errorFailed': 'Request failed ({status})',
    'api.errorTimeout': 'Request timeout, please check network and retry',
    'api.errorNetwork': 'Network connection failed, please check network connection',
    'api.errorDefault': 'Network connection error, please check network',
    'api.operationFailed': 'Operation failed',

    // 404 页面 (NotFoundView)
    'notFound.title': 'Page Not Found',
    'notFound.desc': 'Sorry, the page you are looking for could not be found.',
    'notFound.formTitle': 'Form Not Found',
    'notFound.formDesc': 'Sorry, the form you are looking for does not exist or has been deleted.',
    'notFound.createNewForm': 'Create New Form',
    'notFound.backToBuilder': 'Back to Form Builder',
    'notFound.backToKycList': 'Back to Form List',
    'notFound.autoRedirect': 'Auto redirecting in {countdown}s',

    // 风险评估问卷 (Risk Assessment)
    'risk.pageTitle': 'Risk Assessment',
    'risk.bilingualVideoTitle': 'Multilingual Risk Assessment Video Tutorial',
    'risk.bilingualVideoTip': 'Tip: In Translation Management, you can configure risk questions and options across languages.',
    'risk.catComponents': 'Risk Assessment Components',
    'risk.cmpQuestion': 'Risk Question',
    'risk.cmpQuestionCardDesc': 'Drag or click to add into groups to build compliance questions.',
    'risk.cmpOptLabel': 'Options:',
    'risk.cmpScoringRule': 'Deduction',
    'risk.dragToAddTip': 'Drag to add to group',
    'risk.cmpGroup': 'Question Group',
    'risk.groupOutlineTitle': 'Question Groups',
    'risk.groupTab': 'Groups',
    'risk.groupCount': '{count} groups',
    'risk.questionsCount': '{count} questions',
    'risk.questionUnit': 'questions',
    'risk.addGroup': 'Add Question Group',
    'risk.addQuestion': 'Add Question',
    'risk.addQuestionToGroup': 'Add Question to Group',
    'risk.deleteGroup': 'Delete Group',
    'risk.deleteGroupConfirm': 'Delete this question group and all questions inside?',
    'risk.defaultGroupTitle': 'Section {index}',
    'risk.groupNamePlaceholder': 'Enter group name...',
    'risk.groupInfo': 'Group Information',
    'risk.groupInfoSub': 'English group title is required; Chinese is optional',
    'risk.dragReorderTip': 'Drag to reorder group',
    'risk.dropzoneTip': 'Drag question component here or click button below to add',
    'risk.propQuestionTitle': 'Question Settings',
    'risk.propQuestionSub': 'Configure risk question and weight score',
    'risk.propGroupTitle': 'Group Settings',
    'risk.propGroupSub': 'Configure group title and questions',
    'risk.canvasSettingsDesc': 'Page title, description & overview',
    'risk.overviewStats': 'Questionnaire Overview',
    'risk.groupUnit': 'Group(s)',
    'risk.rulesCardTitle': 'Scoring Rules',
    'risk.rulesCardDesc': 'Fixed deduction system: Answer options are fixed as Yes / No / Not Applicable. Selecting "Yes" deducts the configured weight points.',
    'risk.addGroupBtn': 'Add Group',
    'risk.addSectionSlot': 'Add Question Group',
    'risk.groupCreated': 'New question group added',

    // 标准组件类型名称 (Component Names)
    'comp.input': 'Single Line Text',
    'comp.textarea': 'Multi-line Text',
    'comp.radio': 'Radio Group',
    'comp.checkbox': 'Checkbox Group',
    'comp.select': 'Dropdown Select',
    'comp.date': 'Date Picker',
    'comp.phone': 'Phone Number',
    'comp.email': 'Email Address',
    'comp.country': 'Country / Region',
    'comp.nationality': 'Nationality',
    'comp.signature': 'Electronic Signature',
    'comp.alert': 'Alert / Notice',

    // 风险评估扩展文案 (Risk Assessment Ext)
    'risk.duplicateQuestion': 'Duplicate Question',
    'risk.insertQuestionBelow': 'Insert Question Below',
    'risk.deleteQuestion': 'Delete Question',
    'risk.questionContent': 'Question Content',
    'risk.enterQuestionPlaceholder': 'Enter risk assessment question...',
    'risk.weightSettings': 'Weight Settings',
    'risk.weightSettingsDesc': 'New questions default to weight 1. Selecting Yes indicates a risk hit and deducts the weight from the risk score.',
    'risk.yesDeductionWeight': 'Risk Deduction Weight',
    'risk.yesDeductionTip': 'Answering "Yes" triggers risk deduction by this weight value',
    'risk.weightBadge': 'Weight: {weight}',
    'risk.ptsUnit': 'pts',
    'risk.groupNameWithLang': 'Group Name (EN)',

    // 发布校验与提示 (Publish & Validation)
    'header.valNoPages': 'Please add at least one form page before publishing',
    'header.valEmptyPageTitle': 'Please enter the page title for Page {page}',
    'header.valEmptyPageFields': 'Page {page} has no components. Please add components or remove the empty page.',
    'header.valEmptyGroupTitle': 'Please enter the title for Group {index}',
    'header.valEmptyQuestionText': 'Please enter question text for Question {index}',
    'header.valEmptyGroupQuestionText': 'Please enter question text for Question {index} in "{group}"',
    'header.valEmptyGroupQuestionTextMulti': 'Please enter question text for Question {index} in "{group}" ({total} unfilled)',
    'header.valEmptyFieldLabel': 'Please enter the label for the untitled field on Page {page}',
    'header.draftSavedWithTime': 'Draft saved {time}',

    // 预览与提交结果 (Preview & Submission)
    'preview.submissionCompleted': 'Submission Completed',
    'preview.submissionThanks': 'Thank you! Your information has been received successfully.',
    'preview.status': 'Status',
    'preview.completed': 'Completed',
    'preview.submissionNo': 'Submission No.',
    'preview.submissionTime': 'Submission Time',
    'preview.refillFormPreview': 'Refill Form (Preview)',
    'preview.signatureArea': 'Signature Area',

    // 发布弹窗扩展 (Publish Modal Ext)

    // 翻译抽屉与通用 (Translation Helper & Common)
    'trans.pageTitle': 'Page Title',
    'trans.pageDesc': 'Page Description',
    'trans.group': 'Group',
    'trans.content': 'Notice Content',
    'trans.placeholder': 'Placeholder',
    'trans.helpText': 'Help Text',
    'trans.option': 'Option',
    'trans.fieldDefault': 'Field',
    'trans.fieldLabel': 'Field Label',
    'trans.fieldPlaceholder': 'Placeholder',
    'trans.fieldHelp': 'Help Text / Subtitle',
    'trans.fieldContent': 'Notice Content',
    'trans.exitWorkspace': 'Exit Translation',
    'trans.multilingual': 'Translation Management',
    'trans.addLanguage': 'Translation Management',
    'trans.addLanguageShort': 'Add Language',
    'trans.removeLanguage': 'Remove language',
    'trans.defaultLang': 'Default',
    'trans.translatablePages': 'Translatable Pages',
    'trans.countLeft': '{count} left',
    'trans.noPagesToTranslate': 'No custom form pages to translate',
    'trans.addedLocaleSuccess': 'Added {name}',
    'trans.removedLocaleSuccess': 'Removed {name}',
    'trans.singleLocaleTitle': 'Single Language Form',
    'trans.singleLocaleDesc': 'No translation enabled. You can publish directly or click "+ Add Language" to enable translations',
    'trans.backToNormalDesign': 'Back to Form Design',
    'trans.navTitle': 'Translation Management',
    'trans.navSubtitle': 'Page navigation & progress',
    'trans.propTitle': 'Translation Properties',
    'trans.propSubtitle': 'Edit target translation against source',
    'trans.pendingSummary': '{count} {langName} items untranslated',
    'trans.translated': 'Filled',
    'trans.pending': 'Pending',
    'trans.completed': 'Completed',
    'trans.allDoneShort': 'Translated',
    'trans.sourceTextLabel': 'Source ({lang})',
    'trans.optionsTitle': 'Options Translation',
    'trans.declarationOptionsTitle': 'Declarations Translation',
    'trans.sigPromptLabel': 'Signature Prompt Text',
    'trans.signWatermarkLabel': 'Signature Pad Watermark',
    'trans.startDatePlaceholder': 'Start Date Placeholder',
    'trans.endDatePlaceholder': 'End Date Placeholder',
    'trans.longTermOptionLabel': 'Long-term Option Text',
    'trans.pageTranslation': 'Page Translation',
    'trans.pageTitleLabel': 'Page Title',
    'trans.pageDescLabel': 'Page Description',
    'trans.groupTranslation': 'Group Translation',
    'trans.groupTitleLabel': 'Group Title',
    'trans.enterTarget': 'Enter translation...',
    'header.warnMultiCount': 'There are {count} untranslated items in target languages.',
    'header.warnMultiDesc': 'Publishing now may cause these languages to display English text or blank fields. We recommend completing the translations first.',
    'common.leaveConfirm': 'You have unsaved changes. Are you sure you want to leave?',
    'prop.pageTitleWithLang': 'Page Title (EN)',
    'prop.pageDescWithLang': 'Page Description (EN)',

  }
};

export const profileMultiMessages: Record<string, Record<string, string>> = formRuntimeMultiMessages;

/**
 * 获取系统 UI 文案（支持多语言与参数插值）
 * 系统界面维持中英双语；表单填报预览与基本资料页支持全部 16 种表单语言，未定义条目自动以 en 保底展示
 */
export function t(key: string, locale?: string, params?: Record<string, string | number>): string {
  const rawLoc = locale || store.currentLocale || 'zh';
  const targetLoc = normalizeLocaleKey(rawLoc);
  const isTrad = isTraditionalChineseLocale(rawLoc);
  const multiHit = profileMultiMessages[targetLoc]?.[key];
  const resolvedLocale: Locale = (targetLoc === 'zh' || isTrad) ? 'zh' : 'en';
  let str = multiHit || systemMessages[resolvedLocale]?.[key] || systemMessages.en?.[key] || systemMessages.zh[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

/**
 * 中文序号数字映射 (1-10 转为 一、二、三... 保持选项序列命名一致)
 */
const CHINESE_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export function formatOptionLabel(index: number, locale?: string): string {
  const current = getEffectiveFormLocale(locale);
  if (isTraditionalChineseLocale(current)) {
    if (index >= 1 && index <= 10) return `選項${CHINESE_NUMS[index - 1]}`;
    return `選項${index}`;
  }
  if (current === 'zh' || current.startsWith('zh')) {
    if (index >= 1 && index <= 10) return `选项${CHINESE_NUMS[index - 1]}`;
    return `选项${index}`;
  }
  if (current === 'ja') return `選択肢 ${index}`;
  if (current === 'ko') return `선택지 ${index}`;
  if (current === 'ms') return `Pilihan ${index}`;
  if (current === 'id') return `Opsi ${index}`;
  if (current === 'ta') return `விருப்பம் ${index}`;
  if (current === 'th') return `ตัวเลือก ${index}`;
  if (current === 'vi') return `Tùy chọn ${index}`;
  if (current === 'hi') return `विकल्प ${index}`;
  if (current === 'es') return `Opción ${index}`;
  if (current === 'pt') return `Opção ${index}`;
  if (current === 'ru') return `Вариант ${index}`;
  return `Option ${index}`;
}

export function formatClauseLabel(index: number, locale?: string): string {
  const current = getEffectiveFormLocale(locale);
  if (isTraditionalChineseLocale(current)) return `條款 ${index}`;
  if (current === 'zh' || current.startsWith('zh')) return `条款 ${index}`;
  if (current === 'ja') return `条項 ${index}`;
  if (current === 'ko') return `조항 ${index}`;
  if (current === 'ms') return `Klausa ${index}`;
  if (current === 'id') return `Klausul ${index}`;
  if (current === 'ta') return `விதி ${index}`;
  if (current === 'th') return `ข้อกำหนด ${index}`;
  if (current === 'vi') return `Điều khoản ${index}`;
  if (current === 'hi') return `खंड ${index}`;
  if (current === 'es') return `Cláusula ${index}`;
  if (current === 'fr') return `Clause ${index}`;
  if (current === 'de') return `Klausel ${index}`;
  if (current === 'pt') return `Cláusula ${index}`;
  if (current === 'ru') return `Пункт ${index}`;
  return `Clause ${index}`;
}

/**
 * 判断某个选项文本是否仅为系统默认生成的选项文案（例如 Option 1, 选项一, 選択肢 1）
 */
export function isDefaultOptionLabel(label?: string): boolean {
  if (!label || !label.trim()) return true;
  const s = label.trim();
  return /^(Option\s*\d+|选项[一二三四五六七八九十\d]+|選項[一二三四五六七八九十\d]+|選択肢\s*\d+|선택지\s*\d+|Pilihan\s*\d+|Opsi\s*\d+|Opción\s*\d+|Opção\s*\d+|Вариант\s*\d+|Tùy\s*chọn\s*\d+|ตัวเลือก\s*\d+|विकल्प\s*\d+|விருப்பம்\s*\d+)$/i.test(s);
}

/**
 * 判断声明条款文案是否仅为系统默认占位文案
 */
export function isDefaultClauseLabel(label?: string): boolean {
  if (!label || !label.trim()) return true;
  const s = label.trim();
  return /^(Clause\s*\d+|条款\s*\d+|條款\s*\d+|条項\s*\d+|조항\s*\d+|Klausa\s*\d+|Klausul\s*\d+|Cláusula\s*\d+|Klausel\s*\d+|Пункт\s*\d+|Điều\s*khoản\s*\d+|ข้อกำหนด\s*\d+|खंड\s*\d+|விதி\s*\d+)$/i.test(s);
}

/**
 * 判断输入框占位符是否仅为系统默认占位文案（而非用户定制内容）
 */
let defaultPlaceholderSet: Set<string> | null = null;
const DEFAULT_PLACEHOLDER_KEYS = [
  'prop.inputPlaceholder', 'prop.textareaPlaceholder', 'prop.selectPlaceholder', 'prop.datePlaceholder',
  'prop.emailPlaceholder', 'prop.defaultCountryPlaceholder', 'prop.defaultNatPlaceholder',
  'common.signAreaPlaceholder', 'canvas.signatureArea', 'common.startDate', 'common.endDate'
];
function getDefaultPlaceholderSet(): Set<string> {
  if (defaultPlaceholderSet) return defaultPlaceholderSet;
  const set = new Set<string>([
    'Please enter', 'Please enter details', 'Please select a country', '请选择国家', '請選擇國家',
    'Please enter email', '请输入邮箱', '請輸入郵箱', '请输入电子邮箱',
    'Please sign in the designated area below', 'Please sign here', '请输入详细内容'
  ]);
  const dicts: Record<string, string>[] = [systemMessages.zh, systemMessages.en, ...Object.values(formRuntimeMultiMessages)];
  for (const d of dicts) {
    for (const k of DEFAULT_PLACEHOLDER_KEYS) {
      const v = d?.[k];
      if (v) set.add(v.trim());
    }
  }
  defaultPlaceholderSet = set;
  return set;
}

/**
 * 判断占位符是否仅为系统默认文案（任一语种），此类文案视为「空值」，显示时按目标语种取系统默认
 */
export function isDefaultInputPlaceholder(_type: string, placeholder?: string): boolean {
  if (!placeholder || !placeholder.trim()) return true;
  return getDefaultPlaceholderSet().has(placeholder.trim());
}

/** 画布输入框展示值：系统默认占位文案按空值处理 */
export function placeholderDisplayValue(val?: string): string {
  return isDefaultInputPlaceholder('', val) ? '' : (val || '');
}

function readI18nField(obj: any, field: string, loc: string, allowWhitespaceOnly = false): string {
  if (!obj?.i18n) return '';
  const norm = normalizeLocaleKey(loc);
  const locVariants = isTraditionalChineseLocale(loc)
    ? Array.from(new Set([loc, norm, 'zh-Hant', 'zh-HK', 'zh-TW', 'zh_hk', 'zh_tw', 'hk', 'tw']))
    : [loc, norm];
  for (const l of locVariants) {
    const val = obj.i18n[l]?.[field];
    if (val !== undefined && val !== null) {
      const str = String(val);
      if (allowWhitespaceOnly ? str !== '' : str.trim() !== '') {
        return str;
      }
    }
  }
  return '';
}

function writeI18nField(obj: any, field: string, val: string, loc: string) {
  if (!obj) return;
  if (!obj.i18n) obj.i18n = {};
  if (!obj.i18n[loc]) obj.i18n[loc] = {};
  obj.i18n[loc][field] = val;
}

/**
 * 获取组件多语言文本
 * @param element 组件对象
 * @param field 属性名 (label, placeholder, help, customErrorMessage 等)
 * @param locale 指定语言，缺省时取当前表单编辑语言
 * @param fallback 是否在当前语言未设置时回退主语言（设计态为 false 保证所见即所得；预览态为 true）
 */
export function getFieldText(
  element: any,
  field: string,
  locale?: string,
  fallback = false
): string {
  if (!element) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readI18nField(element, field, current, !fallback);
  if (val !== '') {
    return val;
  }
  if (fallback) {
    if (current !== 'en') {
      const enVal = readI18nField(element, field, 'en');
      if (enVal !== '') return enVal;
    }
    const baseVal = readI18nField(element, field, primaryLocale.value);
    if (baseVal !== '') return baseVal;
    const zhVal = readI18nField(element, field, 'zh');
    if (zhVal !== '') return zhVal;
    const enVal = readI18nField(element, field, 'en');
    if (enVal !== '') return enVal;
  }
  return '';
}

/**
 * 预览态/只读态获取组件多语言文本（自动回退另一语言，确保终端填表用户绝不出现空白无文字）
 */
export function getLocalizedFieldText(
  element: any,
  field: string,
  locale?: string
): string {
  return getFieldText(element, field, locale, true);
}

/**
 * 获取选项多语言文案
 * @param option 选项对象
 * @param locale 指定语言
 * @param fallback 是否在当前语言为空时回退另一语言（设计态为 false；预览态为 true）
 */
function readOptionI18n(option: any, loc: string, allowWhitespaceOnly = false): string {
  return readI18nField(option, 'label', loc, allowWhitespaceOnly);
}

export function getOptionLabel(
  option: FormElementOption,
  locale?: string,
  fallback = false
): string {
  if (!option) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readOptionI18n(option, current, !fallback);
  if (val !== '') {
    return val;
  }
  if (fallback) {
    if (current !== 'en') {
      const enVal = readOptionI18n(option, 'en');
      if (enVal !== '') return enVal;
    }
    const baseVal = readOptionI18n(option, primaryLocale.value);
    if (baseVal !== '') return baseVal;
    const zhVal = readOptionI18n(option, 'zh');
    if (zhVal !== '') return zhVal;
    const enVal = readOptionI18n(option, 'en');
    if (enVal !== '') return enVal;
  }
  return '';
}

/**
 * 预览态/只读态获取选项多语言文案（自动回退另一语言）
 */
export function getLocalizedOptionLabel(
  option: FormElementOption,
  locale?: string
): string {
  return getOptionLabel(option, locale, true);
}

/**
 * 获取页面多语言文本
 * @param page 页面对象
 * @param field title | description
 * @param locale 指定语言
 * @param fallback 是否在当前语言为空时回退另一语言（设计态为 false；预览态为 true）
 */
export function getPageText(
  page: { i18n?: I18nTexts },
  field: 'title' | 'description',
  locale?: string,
  fallback = false
): string {
  if (!page) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readI18nField(page, field, current, !fallback);
  if (val !== '') {
    return val;
  }
  if (fallback) {
    if (current !== 'en') {
      const enVal = readI18nField(page, field, 'en');
      if (enVal !== '') return enVal;
    }
    const baseVal = readI18nField(page, field, primaryLocale.value);
    if (baseVal !== '') return baseVal;
    const zhVal = readI18nField(page, field, 'zh');
    if (zhVal !== '') return zhVal;
    const enVal = readI18nField(page, field, 'en');
    if (enVal !== '') return enVal;
  }
  return '';
}

/**
 * 预览态/只读态获取页面多语言文本（自动回退另一语言）
 */
export function getLocalizedPageText(
  page: { i18n?: I18nTexts },
  field: 'title' | 'description',
  locale?: string
): string {
  return getPageText(page, field, locale, true);
}

export function getGroupText(
  group: any,
  field: 'title' | 'description',
  locale?: string,
  fallback = false
): string {
  if (!group) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readI18nField(group, field, current, !fallback);
  if (val !== '') return val;
  if (fallback) {
    if (current !== 'en') {
      const enVal = readI18nField(group, field, 'en');
      if (enVal !== '') return enVal;
    }
    const baseVal = readI18nField(group, field, primaryLocale.value);
    if (baseVal !== '') return baseVal;
    const zhVal = readI18nField(group, field, 'zh');
    if (zhVal !== '') return zhVal;
    const enVal = readI18nField(group, field, 'en');
    if (enVal !== '') return enVal;
  }
  return '';
}

export function setGroupText(
  group: any,
  field: 'title' | 'description',
  val: string,
  locale?: string
) {
  if (!group) return;
  const current = getEffectiveFormLocale(locale);
  writeI18nField(group, field, val, current);
  markDirty();
}

export function getMetaText(
  meta: any,
  field: 'title' | 'description',
  locale?: string,
  fallback = false
): string {
  if (!meta) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readI18nField(meta, field, current, !fallback);
  if (val !== '') return val;
  if (fallback) {
    const baseVal = readI18nField(meta, field, primaryLocale.value);
    if (baseVal !== '') return baseVal;
    const zhVal = readI18nField(meta, field, 'zh');
    if (zhVal !== '') return zhVal;
    const enVal = readI18nField(meta, field, 'en');
    if (enVal !== '') return enVal;
  }
  return '';
}

/**
 * 统一设置组件多语言文本并标记变更
 */
export function setFieldText(
  element: FormElement,
  field: string,
  val: string,
  locale?: string
) {
  const current = getEffectiveFormLocale(locale);
  writeI18nField(element, field, val, current);
  markDirty();
}

/**
 * 统一设置页面多语言文本并标记变更
 */
export function setPageText(
  page: { i18n?: I18nTexts },
  field: 'title' | 'description',
  val: string,
  locale?: string
) {
  const current = getEffectiveFormLocale(locale);
  writeI18nField(page, field, val, current);
  markDirty();
}

/**
 * 统一设置选项多语言文本并标记变更（互不破坏另一语言数据）
 */
export function setOptionLabel(
  option: FormElementOption,
  val: string,
  locale?: string
) {
  writeI18nField(option, 'label', val, getEffectiveFormLocale(locale));
  markDirty();
}

/**
 * 统一设置表单 Meta（标题/描述）多语言文本并标记变更
 */
export function setMetaText(
  meta: any,
  field: 'title' | 'description',
  val: string,
  locale?: string
) {
  writeI18nField(meta, field, val, getEffectiveFormLocale(locale));
  markDirty();
}

/**
 * 系统内置多语言校验错误提示字典（支持 16 种语种自动匹配，无需人工配置/翻译）
 */
export const SYSTEM_REQUIRED_MESSAGES: Record<string, string> = {
  en: 'Please complete all required fields.',
  zh: '请填写所有必填项。',
  'zh-Hant': '請填寫所有必填項。',
  ms: 'Sila lengkapkan semua medan yang diperlukan.',
  id: 'Harap lengkapi semua kolom yang wajib diisi.',
  ta: 'தேவையான அனைத்து புலங்களையும் பூர்த்தி செய்யவும்.',
  th: 'โปรดกรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน',
  vi: 'Vui lòng hoàn thành tất cả các trường bắt buộc.',
  ja: '必須項目をすべてご入力ください。',
  ko: '필수 항목을 모두 입력해 주세요.',
  hi: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
  es: 'Por favor, complete todos los campos obligatorios.',
  fr: 'Veuillez remplir tous les champs obligatoires.',
  de: 'Bitte füllen Sie alle Pflichtfelder aus.',
  pt: 'Por favor, preencha todos os campos obrigatórios.',
  ru: 'Пожалуйста, заполните все обязательные поля.'
};

export const SYSTEM_INVALID_FORMAT_MESSAGES: Record<string, string> = {
  en: 'Invalid format.',
  zh: '格式无效。',
  'zh-Hant': '格式無效。',
  ms: 'Format tidak sah.',
  id: 'Format tidak valid.',
  ta: 'தவறான வடிவம்.',
  th: 'รูปแบบไม่ถูกต้อง',
  vi: 'Định dạng không hợp lệ.',
  ja: '形式が無効です。',
  ko: '형식이 올바르지 않습니다.',
  hi: 'अमान्य प्रारूप।',
  es: 'Formato no válido.',
  fr: 'Format invalide.',
  de: 'Ungültiges Format.',
  pt: 'Formato inválido.',
  ru: 'Неверный формат.'
};

export function getRequiredErrorMessage(locale?: string): string {
  const current = getEffectiveFormLocale(locale);
  return SYSTEM_REQUIRED_MESSAGES[current] || SYSTEM_REQUIRED_MESSAGES.en;
}

export function getInvalidFormatErrorMessage(locale?: string): string {
  const current = getEffectiveFormLocale(locale);
  return SYSTEM_INVALID_FORMAT_MESSAGES[current] || SYSTEM_INVALID_FORMAT_MESSAGES.en;
}

/**
 * 字段默认语义化校验报错提示（支持 16 种语言体系）
 */
export const defaultValidationMessages: Record<string, Record<string, string>> = {
  declaration: {
    zh: '请确认并同意声明条款',
    'zh-Hant': '請確認並同意聲明條款',
    en: 'Please agree to the declarations',
    ms: 'Sila sahkan dan bersetuju dengan pengisytiharan',
    id: 'Harap konfirmasi dan setujui ketentuan pernyataan',
    ta: 'அறிவிப்பு விதிமுறைகளை உறுதிசெய்து ஒப்புக்கொள்ளவும்',
    th: 'โปรดยืนยันและยอมรับข้อกำหนดในคำชี้แจง',
    vi: 'Vui lòng xác nhận và đồng ý với các điều khoản tuyên bố',
    ja: '誓約事項を確認し、同意してください',
    ko: '선언 조항을 확인하고 동의해 주세요',
    hi: 'कृपया घोषणा की शर्तों की पुष्टि करें और सहमत हों',
    es: 'Por favor, confirme y acepte los términos de la declaración',
    fr: 'Veuillez confirmer et accepter les termes de la déclaration',
    de: 'Bitte bestätigen Sie die Erklärung und stimmen Sie den Bedingungen zu',
    pt: 'Por favor, confirme e concorde com os termos da declaração',
    ru: 'Пожалуйста, подтвердите и согласитесь с условиями заявления'
  },
  signature: {
    zh: '请完成手写签名',
    'zh-Hant': '請完成手寫簽名',
    en: 'Please complete handwritten signature',
    ms: 'Sila lengkapkan tandatangan',
    id: 'Harap lengkapi tanda tangan tulisan tangan',
    ta: 'கையொப்பமிட்டு முடிக்கவும்',
    th: 'โปรดลงลายมือชื่อให้สมบูรณ์',
    vi: 'Vui lòng hoàn thành chữ ký viết tay',
    ja: '手書き署名を完了してください',
    ko: '자필 서명을 완료해 주세요',
    hi: 'कृपया हस्तलिखित हस्ताक्षर पूरा करें',
    es: 'Por favor, complete la firma manuscrita',
    fr: 'Veuillez compléter votre signature manuscrite',
    de: 'Bitte vervollständigen Sie Ihre handschriftliche Unterschrift',
    pt: 'Por favor, conclua a assinatura manuscrita',
    ru: 'Пожалуйста, поставьте рукописную подпись'
  },
  selectOne: {
    zh: '请选择一个选项',
    'zh-Hant': '請選擇一個選項',
    en: 'Please select an option',
    ms: 'Sila pilih satu pilihan',
    id: 'Harap pilih satu opsi',
    ta: 'ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
    th: 'โปรดเลือกหนึ่งตัวเลือก',
    vi: 'Vui lòng chọn một tùy chọn',
    ja: '項目を1つ選択してください',
    ko: '옵션을 하나 선택해 주세요',
    hi: 'कृपया एक विकल्प चुनें',
    es: 'Por favor, seleccione una opción',
    fr: 'Veuillez sélectionner une option',
    de: 'Bitte wählen Sie eine Option',
    pt: 'Por favor, selecione uma opção',
    ru: 'Пожалуйста, выберите один вариант'
  },
  selectAtLeastOne: {
    zh: '请至少选择一个选项',
    'zh-Hant': '請至少選擇一個選項',
    en: 'Please select at least one option',
    ms: 'Sila pilih sekurang-kurangnya satu pilihan',
    id: 'Harap pilih setidaknya satu opsi',
    ta: 'குறைந்தது ஒரு விருப்பத்தையாவது தேர்ந்தெடுக்கவும்',
    th: 'โปรดเลือกอย่างน้อยหนึ่งตัวเลือก',
    vi: 'Vui lòng chọn ít nhất một tùy chọn',
    ja: '項目を1つ以上選択してください',
    ko: '하나 이상의 옵션을 선택해 주세요',
    hi: 'कृपया कम से कम एक विकल्प चुनें',
    es: 'Por favor, seleccione al menos una opción',
    fr: 'Veuillez sélectionner au moins une option',
    de: 'Bitte wählen Sie mindestens eine Option',
    pt: 'Por favor, selecione pelo menos uma opção',
    ru: 'Пожалуйста, выберите хотя бы один вариант'
  },
  selectDate: {
    zh: '请选择日期',
    'zh-Hant': '請選擇日期',
    en: 'Please select a date',
    ms: 'Sila pilih tarikh',
    id: 'Harap pilih tanggal',
    ta: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    th: 'โปรดเลือกวันที่',
    vi: 'Vui lòng chọn ngày',
    ja: '日付を選択してください',
    ko: '날짜를 선택해 주세요',
    hi: 'कृपया दिनांक चुनें',
    es: 'Por favor, seleccione una fecha',
    fr: 'Veuillez sélectionner une date',
    de: 'Bitte wählen Sie ein Datum',
    pt: 'Por favor, selecione uma data',
    ru: 'Пожалуйста, выберите дату'
  },
  required: {
    zh: '必填项不能为空',
    'zh-Hant': '必填項不能為空',
    en: 'This required field cannot be empty',
    ms: 'Medan ini diperlukan',
    id: 'Kolom ini wajib diisi',
    ta: 'இந்த புலம் அவசியமானது',
    th: 'ช่องนี้จำเป็นต้องกรอก',
    vi: 'Trường này là bắt buộc',
    ja: 'この項目は必須です',
    ko: '이 항목은 필수입니다',
    hi: 'यह फ़ील्ड आवश्यक है',
    es: 'Este campo es obligatorio',
    fr: 'Ce champ est obligatoire',
    de: 'Dieses Feld ist erforderlich',
    pt: 'Este campo é obrigatório',
    ru: 'Это поле обязательно для заполнения'
  }
};

function resolveDefaultMsg(type: keyof typeof defaultValidationMessages, loc?: string): string {
  const current = getEffectiveFormLocale(loc);
  const norm = normalizeLocaleKey(current);
  const dict = defaultValidationMessages[type];
  if (!dict) return SYSTEM_REQUIRED_MESSAGES[norm] || SYSTEM_REQUIRED_MESSAGES.en;
  return dict[norm] || dict[current] || dict[norm.split('-')[0]] || dict.en || dict.zh;
}

export function getFieldDefaultErrorMessage(
  element?: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: string
): string {
  const current = getEffectiveFormLocale(locale);

  if (subType === 'declaration') {
    return resolveDefaultMsg('declaration', current);
  }

  if (subType === 'signature' || element?.type === 'signature') {
    return resolveDefaultMsg('signature', current);
  }

  if (!element) {
    return resolveDefaultMsg('required', current);
  }

  switch (element.type) {
    case 'radio':
      return resolveDefaultMsg('selectOne', current);
    case 'checkbox':
      return resolveDefaultMsg('selectAtLeastOne', current);
    case 'select':
    case 'country':
    case 'nationality':
      if (element.multiple) {
        return resolveDefaultMsg('selectAtLeastOne', current);
      }
      return resolveDefaultMsg('selectOne', current);
    case 'date':
      return resolveDefaultMsg('selectDate', current);
    case 'input':
    case 'textarea':
    case 'phone':
    case 'email':
    default:
      return resolveDefaultMsg('required', current);
  }
}

/**
 * 解析字段的有效校验错误提示（三级降级：用户自定义 > 组件语义默认兜底 > 系统通用提示）
 */
export function getFieldValidationMessage(
  element?: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: string
): string {
  const current = getEffectiveFormLocale(locale);

  if (subType === 'declaration') {
    if (element) {
      const customDecl = readI18nField(element, 'declarationErrorMessage', current) ||
        (current === 'zh' || current === primaryLocale.value ? (element as any).declarationErrorMessage : '');
      if (customDecl && customDecl.trim()) return customDecl.trim();
    }
    return getFieldDefaultErrorMessage(element, 'declaration', current);
  }

  // 第一优先级：用户配置的自定义提示
  if (element) {
    const customErr = readI18nField(element, 'customErrorMessage', current) ||
      (current === 'zh' || current === primaryLocale.value ? (element as any).customErrorMessage : '');
    if (customErr && customErr.trim()) return customErr.trim();
  }

  // 第二优先级：组件语义化智能兜底
  return getFieldDefaultErrorMessage(element, subType, current);
}
