import { computed } from 'vue';
import { store, markDirty, primaryLocale } from './store';
import type { FormElement, FormElementOption, I18nTexts } from '@/types/schema';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

export type Locale = 'zh' | 'en';

export interface SupportedFormLocaleItem {
  code: string;
  labelZh: string;
  labelEn: string;
  nativeLabel: string;
  shortBadge: string;
  flag: string;
}

/** 繁体中文统一语言码：zh-Hant（BCP 47 文字子标签，不区分香港/台湾） */
export const TRADITIONAL_LOCALE = 'zh-Hant';

export const SUPPORTED_FORM_LOCALES: SupportedFormLocaleItem[] = [
  { code: 'zh', labelZh: '简体中文', labelEn: 'Simplified Chinese', nativeLabel: '简体中文', shortBadge: 'ZH', flag: 'cn' },
  { code: 'en', labelZh: '英语 (English)', labelEn: 'English', nativeLabel: 'English', shortBadge: 'EN', flag: 'gb' },
  { code: 'zh-Hant', labelZh: '繁体中文', labelEn: 'Traditional Chinese', nativeLabel: '繁體中文', shortBadge: '繁', flag: 'cn' },
  { code: 'ms', labelZh: '马来语 (Bahasa Melayu)', labelEn: 'Malay (Bahasa Melayu)', nativeLabel: 'Bahasa Melayu', shortBadge: 'MS', flag: 'my' }
];

export function getLocaleFlag(loc: string): string {
  const norm = (loc || '').trim().toLowerCase();
  if (norm === 'zh' || norm === 'zh-cn') return 'cn';
  if (norm === 'en' || norm === 'en-us') return 'gb';
  if (norm === 'ms') return 'my';
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm);
  if (item?.flag) return item.flag;
  return 'cn';
}

export function getLocaleDisplayName(loc: string, uiLocale?: Locale): string {
  const norm = (loc || '').trim().toLowerCase();
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm);
  const currentUi = uiLocale || store.currentLocale || 'zh';
  if (!item) return loc.toUpperCase();
  return currentUi === 'en' ? item.labelEn : item.labelZh;
}

export function getLocaleNativeName(loc: string): string {
  const norm = (loc || '').trim().toLowerCase();
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm);
  return item ? item.nativeLabel : loc.toUpperCase();
}

export function getLocaleShortBadge(loc: string): string {
  const norm = (loc || '').trim().toLowerCase();
  const item = SUPPORTED_FORM_LOCALES.find(l => l.code.toLowerCase() === norm);
  return item ? item.shortBadge : loc.toUpperCase();
}

export function getEffectiveFormLocale(locale?: string): string {
  if (locale) return locale;
  if (store.workspaceMode === 'translation') {
    return store.activeTargetLocale || store.editingLocale || primaryLocale.value || 'zh';
  }
  return primaryLocale.value || 'zh';
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
    'common.systemPreset': '系统预设',
    'common.cannotDrop': '不可放置',
    'common.basicInfo': '基础资料',
    'common.readOnly': '只读核验',
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
    'val.validNumber': '请输入有效数字',
    'val.validEmail': '请输入有效的邮箱地址',
    'val.maxOptions': '最多只能选择 {count} 项',
    'val.maxItems': '最多只能选择 {count} 项',
    'dir.searchPlaceholder': '搜索国家、国籍名称、代码或区号 (如 中国, 新加坡籍, SG, +86)...',
    'dir.country': '国家',
    'dir.nationality': '国籍',
    'dir.code': '代码',
    'dir.dialCode': '国际区号',
    'dir.noMatching': '未找到匹配的数据记录',
    'dir.totalCountPrefix': '共',
    'dir.totalCountSuffix': '个预设国家与地区',
    'dir.presetList': '预设清单',
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
    'header.warnCount': '当前表单还有 {count} 项内容尚未完成英文翻译。',
    'header.warnMore': '...以及其他 {count} 项未翻译内容',
    'header.warnComplete': '前往完善翻译',
    'header.warnPublishAnyway': '仍然发布',
    'header.untranslatedTag': '未翻译',
    'header.bilingualGuideTitle': '翻译管理说明',
    'header.bilingualGuideDesc': '管理表单各语言翻译内容。您可以在翻译工作台中对照编辑源语言与目标语言文案。填表人打开表单时，可通过语言切换按钮自由切换多语言。',
    'header.bilingualVideoTitle': '双语问卷功能操作演示',
    'header.bilingualVideoTip': '温馨提示：开启双语问卷后，填表端右上角将自动提供语言切换胶囊。',

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
    'sidebar.systemPreset': '系统预置',
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
    'canvas.signatureArea': '请在此处手写签名',
    'canvas.droppable': '可放置画布',
    'canvas.presetCannotDrop': '系统预设步骤 · 不可添加组件',
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
    'prop.fieldHelp': '副标题',
    'prop.fieldHelpPlaceholder': '请输入副标题或补充说明',
    'prop.helpLayout': '排布方式',
    'prop.helpPositionRight': '标题右侧',
    'prop.helpPositionBottom': '标题下方',
    'prop.helpPositionRightDesc': '标题右侧显示（默认同排浅灰色小字）',
    'prop.helpPositionBottomDesc': '标题下方换行显示',
    'prop.helpPositionTip': '控制副标题排布方式：可选标题右侧显示（默认同排浅灰色小字）或标题下方换行显示。',
    'prop.showLabel': '显示标题',
    'prop.showLabelTip': '关闭后，表单页面上将隐藏该标题；但在数据导出、后台报表和联动条件选择时，仍会使用此字段标题作为唯一标识。',
    'prop.hiddenLabelNote': '前台已隐藏展示，此名称仅用于后台数据导出与联动识别',
    'prop.required': '设为必填',
    'prop.requiredTip': '开启后，该字段为必须填写项，未填写无法提交。',
    'prop.declarationRequired': '声明条款必填',
    'prop.declarationRequiredTip': '开启后，用户必须勾选同意所有声明复选条款才能提交表单。',
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
    'prop.allowMultipleTip': '开启后支持在下拉框中选择多个选项。',
    'prop.defaultDialCode': '默认国际区号',
    'prop.copy': '复制',
    'prop.delete': '删除',
    'prop.collapsePanel': '收起属性面板',
    'prop.systemPreset': '系统预设',
    'prop.systemBaseline': '系统前置 · 基础资料',
    'prop.locked': '已锁定',
    'prop.deletePageConfirm': '确定要删除当前画布页面吗？此操作不可撤销。',
    'prop.presetNationalities': '预设国籍',
    'prop.presetCountries': '预设国家',
    'prop.viewDirectory': '查看',
    'prop.fieldFallback': '字段',
    'prop.clientCase': '客户案例',
    'prop.entityCase': '实体案例',
    'prop.individualCase': '个人案例',
    'prop.systemPresetAlert': '该节点为系统预置前置核验步骤，内容与逻辑由系统固化，不支持修改属性配置。',
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
    'prop.signatureRequired': '签名板必填',
    'prop.signatureRequiredTip': '开启后，用户必须在手写感应板中签名。',
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
    'prop.pageTitle': '页面大标题',
    'prop.pageDesc': '页面说明文案',
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
    'wizard.tplCustomerDesc': '适用于客户身份认证、KYC 相关的业务场景。',
    'wizard.tplIndividualDesc': '适用于个人用户信息采集、身份验证等场景。',
    'wizard.tplEntityDesc': '适用于实体成员、企业信息采集等场景。',
    'wizard.confirmOverwriteTitle': '覆盖确认',
    'wizard.confirmOverwriteDesc': '当前画布已包含 {pages} 个画板页面，载入 {title} 将完全覆盖当前画布内容。是否确认继续？',
    'wizard.confirmOverwriteBtn': '确定覆盖',
    'wizard.pagesCount': '{count} 页面',
    'wizard.fieldsCount': '{count} 字段',

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
    'preview.fillRequiredFields': '请填写所有必填项并修正错误',
    'preview.publishFailed': '发布失败',
    'publish.modalTitle': '发布表单',
    'publish.modalDesc': '核对并确认表单基本信息与发布介绍，确认无误后即可生成公网访问链接。',
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
    'tour.step5Title': '5. 预设核验页',
    'tour.step5Desc': '首页为系统只读核验页，后续页面可自由添加字段。',
    'tour.step6Title': '6. 属性配置',
    'tour.step6Desc': '配置表单全局设置、字段属性及展开联动规则。',
    'tour.step7Title': '7. 表单预览',
    'tour.step7Desc': '在手机模拟器中实时测试填表流程与字段校验。',
    'tour.step8Title': '8. 发布表单',
    'tour.step8Desc': '检查多语言完整度，并将表单正式保存发布。',
    'tour.risk.step1Title': '1. 风险评估组件',
    'tour.risk.step1Desc': '欢迎来到风险评估！点击或拖拽该组件添加到画布，选项固定为 Yes / No / NA 并支持配置扣分权重。',
    'tour.risk.step2Title': '2. 画布与题目编辑',
    'tour.risk.step2Desc': '点击画板文字可直接修改大标题和说明；点击底部按钮可快捷添加问题或新建分组。',
    'tour.risk.step3Title': '3. 问题分组管理',
    'tour.risk.step3Desc': '支持直接修改组名，右侧显示题目数，按住左侧把手可上下拖拽调整分组顺序。',
    'tour.risk.step4Title': '4. 翻译管理',
    'tour.risk.step4Desc': '点击进入多语言工作区，支持双画布左右对照，点击“+ Add Language”即可新增翻译。',
    'tour.risk.step5Title': '5. 保存与发布',
    'tour.risk.step5Desc': '设计完成后可随时保存草稿；点击“发布表单”系统将校验问卷并正式上线。',

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
    'risk.catComponents': '风险评估组件',
    'risk.cmpQuestion': '风险评估问题',
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
    'header.valEmptyFieldLabel': '请填写第 {page} 页中未命名组件的标题',
    'header.draftSavedWithTime': '已保存至草稿 {time}',
    'val.requiredFallback': '必填项不能为空',
    'val.validPhoneFallback': '请输入有效的手机号码',

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
    'trans.multilingualWithCount': '翻译管理 ({count})',
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
    'header.warnEnRequiredDesc': '英文翻译为必填项，请完成全部英文翻译后再提交发布。',
    'header.warnMultiCount': '当前表单还有 {count} 项多语言翻译尚未完成。',
    'header.warnMultiDesc': '现在发布可能导致对应语言访问时显示英文或空白，建议补充完整后再发布。',
    'prop.element': '组件属性',
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
    'common.systemPreset': 'System Preset',
    'common.cannotDrop': 'Cannot Drop',
    'common.basicInfo': 'Basic Info',
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
    'val.validNumber': 'Please enter a valid number',
    'val.validEmail': 'Please enter a valid email',
    'val.maxOptions': 'Maximum {count} options allowed',
    'val.maxItems': 'Maximum {count} items allowed',
    'dir.searchPlaceholder': 'Search by country, nationality, code or dial code (e.g. Singapore, SG, +65)...',
    'dir.country': 'Country',
    'dir.nationality': 'Nationality',
    'dir.code': 'Code',
    'dir.dialCode': 'Dial Code',
    'dir.noMatching': 'No matching records found',
    'dir.totalCountPrefix': 'Total',
    'dir.totalCountSuffix': 'countries & regions',
    'dir.presetList': 'Preset List',
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
    'header.warnCount': 'There are {count} items missing English translation.',
    'header.warnMore': '...and {count} more items',
    'header.warnComplete': 'Complete Translations',
    'header.warnPublishAnyway': 'Publish Anyway',
    'header.untranslatedTag': 'Untranslated',
    'header.bilingualGuideTitle': 'Translation Management Guide',
    'header.bilingualGuideDesc': 'Manage form translations across languages. You can edit source and target language copies side-by-side in the translation workspace. Respondents can toggle languages via the top-right button.',
    'header.bilingualVideoTitle': 'Bilingual Questionnaire Video Tutorial',
    'header.bilingualVideoTip': 'Tip: Once enabled, respondents can switch languages in the top-right corner.',

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
    'sidebar.systemPreset': 'System Preset',
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
    'canvas.signatureArea': 'Please sign here',
    'canvas.droppable': 'Droppable Canvas',
    'canvas.presetCannotDrop': 'System Preset · Cannot Drop',
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
    'prop.fieldHelp': 'Subtitle',
    'prop.fieldHelpPlaceholder': 'Enter subtitle or explanation',
    'prop.helpLayout': 'Layout',
    'prop.helpPositionRight': 'Inline',
    'prop.helpPositionBottom': 'Below',
    'prop.helpPositionRightDesc': 'Inline on right (default light gray text)',
    'prop.helpPositionBottomDesc': 'Below title (new line)',
    'prop.helpPositionTip': 'Control subtitle placement: inline beside title or on a new line below title.',
    'prop.showLabel': 'Show Label',
    'prop.showLabelTip': 'When disabled, the title is hidden on the form, but still used for backend auditing, data export headers, and logic rules.',
    'prop.hiddenLabelNote': 'Hidden on form; used only for data export and logic references',
    'prop.required': 'Required',
    'prop.requiredTip': 'When enabled, this field is mandatory for submission.',
    'prop.declarationRequired': 'Declarations Required',
    'prop.declarationRequiredTip': 'When enabled, user must agree to all declarations.',
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
    'prop.allowMultipleTip': 'Allow selecting multiple choices from the dropdown.',
    'prop.defaultDialCode': 'Default Dial Code',
    'prop.copy': 'Duplicate',
    'prop.delete': 'Delete',
    'prop.collapsePanel': 'Collapse panel',
    'prop.systemPreset': 'System Preset',
    'prop.systemBaseline': 'System Baseline · Basic Info',
    'prop.locked': 'Locked',
    'prop.deletePageConfirm': 'Are you sure you want to delete this canvas page? This cannot be undone.',
    'prop.presetNationalities': 'Preset Nationalities',
    'prop.presetCountries': 'Preset Countries',
    'prop.viewDirectory': 'View',
    'prop.fieldFallback': 'Field',
    'prop.clientCase': 'Client Case',
    'prop.entityCase': 'Entity Case',
    'prop.individualCase': 'Individual Case',
    'prop.systemPresetAlert': 'This node is a system-level pre-check step with fixed logic. Property modification is not supported.',
    'prop.defaultCountryPlaceholder': 'Select Country/Region',
    'prop.defaultNatPlaceholder': 'Select Nationality',
    'prop.linkageRuleTitle': 'Display Rule',
    'prop.linkageWhen': 'When',
    'prop.linkageEquals': 'selects',
    'prop.linkageThenShow': 'reveal this field',
    'prop.linkageAndJoin': 'AND',
    'prop.linkageOrJoin': 'OR',
    'prop.linkageLogicAnd': 'Match All',
    'prop.linkageLogicOr': 'Match Any',
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
    'prop.signatureRequired': 'Signature Required',
    'prop.signatureRequiredTip': 'When enabled, user must sign in the signature pad.',
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
    'prop.pageTitle': 'Page Title',
    'prop.pageDesc': 'Page Description',
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
    'wizard.tplCustomerDesc': 'Suitable for customer identification and KYC-related scenarios.',
    'wizard.tplIndividualDesc': 'Suitable for personal user data collection and identity verification.',
    'wizard.tplEntityDesc': 'Suitable for corporate clients and enterprise information collection.',
    'wizard.confirmOverwriteTitle': 'Confirm Overwrite',
    'wizard.confirmOverwriteDesc': 'The current canvas already contains {pages} artboard page(s). Applying {title} will overwrite all current canvas contents. Are you sure you want to continue?',
    'wizard.confirmOverwriteBtn': 'Confirm Overwrite',
    'wizard.pagesCount': '{count} Pages',
    'wizard.fieldsCount': '{count} Fields',

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
    'preview.fillRequiredFields': 'Please fill in all required fields',
    'preview.publishFailed': 'Publish failed',
    'publish.modalTitle': 'Publish Form',
    'publish.modalDesc': 'Confirm form name and description before generating public access link.',
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
    'tour.step5Title': '5. Preset Page',
    'tour.step5Desc': 'First page is read-only; subsequent pages are custom.',
    'tour.step6Title': '6. Properties',
    'tour.step6Desc': 'Configure form settings, field properties, and linkage rules.',
    'tour.step7Title': '7. Preview',
    'tour.step7Desc': 'Test form flow and field validations in mobile preview.',
    'tour.step8Title': '8. Publish',
    'tour.step8Desc': 'Verify translation completeness and publish the form.',
    'tour.risk.step1Title': '1. Risk Question Component',
    'tour.risk.step1Desc': 'Welcome to Risk Assessment! Click or drag this component to the canvas. Fixed Yes/No/NA logic with weight scoring.',
    'tour.risk.step2Title': '2. Canvas & Question Editing',
    'tour.risk.step2Desc': 'Click on text to edit title and description. Use the buttons below to quickly add questions or new groups.',
    'tour.risk.step3Title': '3. Question Groups',
    'tour.risk.step3Desc': 'Edit group names inline, check question counts, and drag the left handle to reorder groups.',
    'tour.risk.step4Title': '4. Translation Management',
    'tour.risk.step4Desc': 'Enter the workspace for side-by-side localization. Click "+ Add Language" to create a new translation.',
    'tour.risk.step5Title': '5. Save & Publish',
    'tour.risk.step5Desc': 'Save progress to draft anytime, or click "Publish" to validate and deploy your form.',

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
    'risk.catComponents': 'Risk Assessment Components',
    'risk.cmpQuestion': 'Risk Question',
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
    'header.valEmptyFieldLabel': 'Please enter the label for the untitled field on Page {page}',
    'header.draftSavedWithTime': 'Draft saved {time}',
    'val.requiredFallback': 'This required field cannot be empty',
    'val.validPhoneFallback': 'Please enter a valid phone number',

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
    'trans.multilingualWithCount': 'Translation Management ({count})',
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
    'header.warnEnRequiredDesc': 'English translation is required. Please complete all English translations before publishing.',
    'header.warnMultiCount': 'There are {count} untranslated items in target languages.',
    'header.warnMultiDesc': 'Publishing now may cause these languages to display English text or blank fields. We recommend completing the translations first.',
    'prop.element': 'Element Properties',
    'common.leaveConfirm': 'You have unsaved changes. Are you sure you want to leave?',
    'prop.pageTitleWithLang': 'Page Title (EN)',
    'prop.pageDescWithLang': 'Page Description (EN)',

  }
};

/**
 * 系统预设资料页（基本资料页）多语言默认配置（补充繁体中文 zh-Hant 与马来语 ms）
 */
const profileTwDict: Record<string, string> = {
  'common.notice': '提示',
  'profile.notice.ind1': '根據合規要求，您需要填寫 KYC 問卷。',
  'profile.notice.ent1': '您將作為以下公司的授權代表填寫 KYC 問卷。',
  'profile.notice.common': '請確認以下信息是否準確，如需修改請聯繫服務商修改後再進行下一步。',
  'profile.customerTitle': '客戶註冊信息',
  'profile.entityTitle': '企業註冊信息',
  'profile.basicTitle': '基本信息',
  'profile.authorizedRep': '授權代表',
  'profile.associatedInfo': '關聯信息',
  'profile.associatedEntity': '關聯實體',
  'profile.relationshipType': '關聯類型',
  'profile.shareholder': '股東',
  'profile.director': '董事',
  'profile.partner': '合夥人',
  'profile.capitalTitle': '股份與出資信息',
  'profile.shareClass': '股份類別',
  'profile.sharesHeld': '持股數量',
  'profile.paidUpAmount': '分配實繳資本額',
  'profile.field.name': '姓名',
  'profile.field.nativeName': '母語姓名',
  'profile.field.nationality': '國籍',
  'profile.field.sgStatus': '新加坡身份',
  'profile.field.nricFin': 'NRIC/FIN(如有)',
  'profile.field.idType': '證件類型',
  'profile.field.idNumber': '證件號碼',
  'profile.field.dob': '出生日期',
  'profile.field.gender': '性別',
  'profile.field.phone': '手機號碼',
  'profile.field.email': '電子郵箱',
  'profile.field.resAddress': '居住地址',
  'profile.field.contactAddress': '聯繫地址',
  'profile.field.entityName': '實體名稱',
  'profile.field.formerName': '曾用名(如有)',
  'profile.field.jurisdiction': '註冊地',
  'profile.field.entityRegNo': '實體註冊號碼',
  'profile.field.registeredAddress': '註冊地址',
  'profile.field.repCapacity': '授權代表身份',
  'profile.field.repName': '授權代表姓名',
  'profile.val.sgCitizen': '新加坡公民',
  'profile.val.idCardPassport': '身份證 / 護照',
  'profile.val.male': '男',
  'profile.val.repCapacityVal': '董事 / 高級管理人員',
  'profile.val.repIdTypeVal': 'NRIC (新加坡公民)'
};

const profileMsDict: Record<string, string> = {
  'common.notice': 'Notis',
  'profile.notice.ind1': 'Mengikut keperluan pematuhan kawal selia, anda perlu melengkapkan soal selidik KYC.',
  'profile.notice.ent1': 'Anda akan melengkapkan soal selidik KYC sebagai wakil sah bagi syarikat di bawah.',
  'profile.notice.common': 'Sila sahkan sama ada maklumat berikut adalah tepat. Jika pengubahsuaian diperlukan, sila hubungi pembekal perkhidmatan anda sebelum meneruskan.',
  'profile.customerTitle': 'Maklumat Pendaftaran Pelanggan',
  'profile.entityTitle': 'Maklumat Pendaftaran Korporat',
  'profile.basicTitle': 'Maklumat Asas',
  'profile.authorizedRep': 'Wakil Sah',
  'profile.associatedInfo': 'Maklumat Berkaitan',
  'profile.associatedEntity': 'Entiti Berkaitan',
  'profile.relationshipType': 'Jenis Hubungan',
  'profile.shareholder': 'Pemegang Saham',
  'profile.director': 'Pengarah',
  'profile.partner': 'Rakan Kongsi',
  'profile.capitalTitle': 'Maklumat Pegangan Saham & Modal',
  'profile.shareClass': 'Kelas Saham',
  'profile.sharesHeld': 'Bilangan Saham Dipegang',
  'profile.paidUpAmount': 'Jumlah Modal Berbayar Diperuntukkan',
  'profile.field.name': 'Nama Penuh',
  'profile.field.nativeName': 'Nama Bahasa Ibunda',
  'profile.field.nationality': 'Kewarganegaraan',
  'profile.field.sgStatus': 'Status Singapura',
  'profile.field.nricFin': 'NRIC/FIN (jika berkenaan)',
  'profile.field.idType': 'Jenis Dokumen Pengenalan',
  'profile.field.idNumber': 'Nombor Pengenalan / Pasport',
  'profile.field.dob': 'Tarikh Lahir',
  'profile.field.gender': 'Jantina',
  'profile.field.phone': 'Nombor Telefon Bimbit',
  'profile.field.email': 'Alamat E-mel',
  'profile.field.resAddress': 'Alamat Kediaman',
  'profile.field.contactAddress': 'Alamat Surat-menyurat',
  'profile.field.entityName': 'Nama Entiti',
  'profile.field.formerName': 'Nama Dahulu (jika ada)',
  'profile.field.jurisdiction': 'Bidang Kuasa Pemerbadanan',
  'profile.field.entityRegNo': 'Nombor Pendaftaran Entiti',
  'profile.field.registeredAddress': 'Alamat Berdaftar',
  'profile.field.repCapacity': 'Kapasiti / Peranan Wakil Sah',
  'profile.field.repName': 'Nama Wakil Sah',
  'profile.val.sgCitizen': 'Warganegara Singapura',
  'profile.val.idCardPassport': 'NRIC / Pasport',
  'profile.val.male': 'Lelaki',
  'profile.val.repCapacityVal': 'Pengarah / Pegawai Kanan',
  'profile.val.repIdTypeVal': 'NRIC (Warganegara Singapura)'
};

export const profileMultiMessages: Record<string, Record<string, string>> = {
  'zh-Hant': profileTwDict,
  ms: profileMsDict
};

/**
 * 获取系统 UI 文案（支持多语言与参数插值）
 * 注意：系统 UI 界面仅维护中英双语（基本资料页额外支持繁体中文与马来语预设文案）；其他语种自动以 en 保底展示
 */
export function t(key: string, locale?: string, params?: Record<string, string | number>): string {
  const targetLoc = locale || store.currentLocale || 'zh';
  const isTrad = targetLoc === TRADITIONAL_LOCALE;
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
  if (current === 'en' || current === 'ms') {
    return `Option ${index}`;
  }
  if (current === TRADITIONAL_LOCALE) {
    if (index >= 1 && index <= 10) {
      return `選項${CHINESE_NUMS[index - 1]}`;
    }
    return `選項${index}`;
  }
  if (index >= 1 && index <= 10) {
    return `选项${CHINESE_NUMS[index - 1]}`;
  }
  return `选项${index}`;
}

function readI18nField(obj: any, field: string, loc: string): string {
  const val = obj?.i18n?.[loc]?.[field];
  return val !== undefined && val !== null ? String(val).trim() : '';
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
  const val = readI18nField(element, field, current);
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
function readOptionI18n(option: any, loc: string): string {
  return readI18nField(option, 'label', loc);
}

export function getOptionLabel(
  option: FormElementOption,
  locale?: string,
  fallback = false
): string {
  if (!option) return '';
  const current = getEffectiveFormLocale(locale);
  const val = readOptionI18n(option, current);
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
  const val = readI18nField(page, field, current);
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
  const val = readI18nField(group, field, current);
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
  const val = readI18nField(meta, field, current);
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
 * 获取字段在当前语言下的通用默认/兜底校验错误提示文字
 */
const defaultValidationMessages: Record<string, Record<string, string>> = {
  declaration: {
    zh: '请确认并同意声明条款',
    'zh-Hant': '請確認並同意聲明條款',
    en: 'Please agree to the declarations',
    ms: 'Sila sahkan dan bersetuju dengan pengisytiharan'
  },
  signature: {
    zh: '请完成手写签名',
    'zh-Hant': '請完成手寫簽名',
    en: 'Please complete handwritten signature',
    ms: 'Sila lengkapkan tandatangan'
  },
  selectOne: {
    zh: '请选择一个选项',
    'zh-Hant': '請選擇一個選項',
    en: 'Please select an option',
    ms: 'Sila pilih satu pilihan'
  },
  selectAtLeastOne: {
    zh: '请至少选择一个选项',
    'zh-Hant': '請至少選擇一個選項',
    en: 'Please select at least one option',
    ms: 'Sila pilih sekurang-kurangnya satu pilihan'
  },
  selectDate: {
    zh: '请选择日期',
    'zh-Hant': '請選擇日期',
    en: 'Please select a date',
    ms: 'Sila pilih tarikh'
  },
  required: {
    zh: '必填项不能为空',
    'zh-Hant': '必填項不能為空',
    en: 'This required field cannot be empty',
    ms: 'Medan ini diperlukan'
  }
};

function resolveDefaultMsg(type: keyof typeof defaultValidationMessages, loc: string): string {
  const dict = defaultValidationMessages[type];
  return dict[loc] || dict[loc.split('-')[0]] || dict.en || dict.zh;
}

export function getFieldDefaultErrorMessage(
  element: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: string
): string {
  const current = getEffectiveFormLocale(locale);

  if (subType === 'declaration') {
    return resolveDefaultMsg('declaration', current);
  }

  if (subType === 'signature' || element.type === 'signature') {
    return resolveDefaultMsg('signature', current);
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
 * 解析字段的有效校验错误提示（三级降级：用户自定义 > 智能语义兜底 > 系统通用兜底）
 */
export function getFieldValidationMessage(
  element: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: string
): string {
  const current = getEffectiveFormLocale(locale);

  if (subType === 'declaration') {
    const customDecl = readI18nField(element, 'declarationErrorMessage', current);
    if (customDecl) return customDecl;
    return getFieldDefaultErrorMessage(element, 'declaration', current);
  }

  // 第一优先级：用户配置的自定义提示
  const customErr = readI18nField(element, 'customErrorMessage', current);
  if (customErr) return customErr;

  // 第二优先级：组件语义化智能兜底
  return getFieldDefaultErrorMessage(element, subType, current);
}
