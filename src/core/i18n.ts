import { computed } from 'vue';
import { store, markDirty } from './store';
import type { FormElement, FormElementOption } from '@/types/schema';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';

export type Locale = 'zh' | 'en';

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
    'common.noticeItem': '提示说明项',
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
    'common.templatesUnit': '个',
    'common.optionsUnit': '项',
    'common.totalOptions': '共 {count} 项',
    'common.passed': '通过',
    'common.prev': '上一步',
    'common.confirmNext': '确认 & 下一步',
    'common.nextStep': '下一步',
    'common.cancel': '取消',
    'common.singapore': '新加坡',
    'common.prefilledBaseline': '预置核验节点',
    'common.unknownError': '未知错误',
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
    'common.defaultColon': '默认：',

    // 顶部导航栏 (AppHeader)
    'app.dirty': '有未保存变更',
    'app.saved': '全部已保存',
    'app.saving': '正在保存...',
    'app.save': '保存',
    'app.preview': '预览',
    'app.deploy': '发布表单',
    'app.settings': '面板布局设置',
    'app.leftSidebar': '左侧物料库',
    'app.rightSidebar': '右侧属性面板',
    'header.back': '返回上一页',
    'header.formTitlePlaceholder': '请输入表单名称',
    'header.confirmRename': '确认修改',
    'header.clickToRename': '点击修改表单名称',
    'header.renameForm': '修改表单名称',
    'header.tour': '操作指南',
    'header.saveSuccess': '表单配置已成功保存！',
    'header.saveFailed': '保存失败，请检查网络或重试',
    'header.saveError': '保存遇到异常，请重试',
    'header.loggedOut': '已成功退出登录',
    'header.profileOpened': '已进入个人中心',
    'header.activityOpened': '已进入操作日志',
    'header.settingsOpened': '已进入账号设置',
    'header.untitledForm': '未命名表单',
    'header.warnTitle': '多语言发布校验提醒',
    'header.warnCount': '当前表单还有 {count} 项内容尚未完成英文翻译。',
    'header.warnDesc': '如果直接发布，英文环境下的用户将看到部分中文默认文案或留白，建议完善后再发布。',
    'header.warnMore': '...以及其他 {count} 项未翻译内容',
    'header.warnComplete': '前往完善翻译',
    'header.warnPublishAnyway': '仍然发布',
    'header.untranslatedTag': '未翻译',
    'header.contentLang': '表单内容语言',
    'header.clickToSwitchEn': '点击切换至英文编辑未翻译项',
    'header.hasUntranslated': '当前语言尚有未填写项',
    'header.itemsUntranslated': '还有 {count} 项内容未翻译',
    'header.allTranslated': '多语言内容已填写完整',
    'header.switchedZh': '已切换至中文编辑模式',
    'header.switchedEn': '已切换至英文编辑模式',
    'header.bilingualTooltip': '开启后表单支持中英双语问卷，可向填表人提供中英文语言切换',
    'header.bilingualSwitch': '双语问卷',
    'header.bilingualGuideTitle': '双语问卷说明',
    'header.bilingualGuideDesc': '开启后，您可以在表单设计器中对照编辑中文与英文内容。填表人打开表单时，可通过右上角的语言切换按钮自由在中英双语间无缝切换。',
    'header.bilingualDisableTitle': '停用双语问卷模式',
    'header.bilingualDisableDesc': '确定停用双语问卷模式吗？停用后将仅保留主要语言并隐藏英文双语配置。',
    'header.bilingualDisableConfirm': '确认停用',
    'header.bilingualDisableCancel': '取消',
    'header.bilingualVideoTitle': '双语问卷功能操作演示',
    'header.bilingualVideoTip': '温馨提示：开启双语问卷后，填表端右上角将自动提供语言切换胶囊。',
    'header.bilingualEnabledMsg': '已开启双语问卷模式',
    'header.bilingualDisabledMsg': '已停用双语问卷模式',

    // 用户下拉菜单 (User Menu)
    'user.profile': '个人中心',
    'user.settings': '账号设置',
    'user.activity': '操作日志',
    'user.logout': '退出登录',
    'user.role': '系统管理员',

    // 侧边栏物料库 (MaterialSidebar)
    'sidebar.searchPlaceholder': '查找组件或模块...',
    'sidebar.searchEmpty': '未找到匹配的组件',
    'sidebar.catBasic': '基础输入',
    'sidebar.catBusiness': '业务组件',
    'sidebar.tooltipCollapse': '完全收起侧边栏',
    'sidebar.components': '组件',
    'sidebar.templates': '模板',
    'sidebar.pages': '页面',
    'sidebar.searchTooltip': '搜索',
    'sidebar.collapseBtn': '完全收起',
    'sidebar.searchTemplates': '搜索模板名称...',
    'sidebar.createBlank': '新建空白画布',
    'sidebar.createBlankDesc': '从零开始自由搭建表单',
    'sidebar.presetScenarios': '预置场景模板',
    'sidebar.addCanvasPage': '添加新画板页面',
    'sidebar.confirmTitle': '提示',
    'sidebar.templateLoaded': '模板已载入',
    'sidebar.pageAdded': '已添加新画板页面',
    'sidebar.pageDeleted': '画板已删除',
    'sidebar.deletePagePrompt': '确定删除此画板页面？',
    'sidebar.systemPreset': '系统预置',
    'sidebar.locatePage': '聚焦定位画板',
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
    'canvas.unnamed': '未命名字段',
    'canvas.helpPlaceholder': '补充说明',
    'canvas.droppable': '可放置画布',
    'canvas.presetCannotDrop': '系统预设步骤 · 不可添加组件',
    'canvas.dragToFormCanvas': '请将组件拖拽至右侧常规表单画布中',
    'canvas.emptyTitle': '画布当前为空',
    'canvas.emptyDesc': '拖拽左侧基础输入或业务组件即可在这里生成并预览表单',
    'canvas.addPageRight': '在右侧添加新页面',
    'canvas.initializing': '正在初始化画布...',
    'canvas.preparingEnv': '正在准备表单设计环境',
    'canvas.noPages': '暂无画布页面',
    'canvas.noPagesDesc': '你的工作区准备就绪。创建一个画布来配置表单字段与布局。',
    'canvas.newCanvas': '新建空白表单',
    'canvas.browseTemplates': '选用场景模板',
    'canvas.expandSidebar': '展开侧边栏',
    'canvas.expandProperties': '展开右侧属性面板',
    'canvas.zoomIn': '放大画布',
    'canvas.zoomOut': '缩小画布',
    'canvas.zoom100': '缩放到 100%',
    'canvas.zoomFit': '适应画布全貌',
    'canvas.zoomSelection': '缩放到选中项',
    'canvas.helpTooltip': '操作指南与快捷键',
    'canvas.helpModalTitle': '操作指南与快捷键',
    'canvas.secCanvasZoom': '画布缩放与视口平移',
    'canvas.panCanvas': '自由平移画布',
    'canvas.leftDrag': '左键拖拽',
    'canvas.smoothZoom': '滚轮平滑缩放',
    'canvas.wheel': '滚轮',
    'canvas.secFormEditing': '表单编辑与组件',
    'canvas.searchComponents': '搜索物料组件',
    'canvas.contextMenu': '画布右键快捷菜单',
    'canvas.rightClick': '鼠标右键',
    'canvas.inlineTextEdit': '就地直接编辑文字',
    'canvas.clickText': '单击文字',
    'canvas.duplicateElement': '复制选中组件',
    'canvas.deleteElement': '删除选中组件',
    'canvas.productTour': '查看操作指南',
    'canvas.gotIt': '我知道了',
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
    'context.insertBelow': '在下方插入组件',
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
    'prop.zhRef': '中文原文：',
    'prop.zhPageTitleRef': '中文原标题：',
    'prop.zhPageDescRef': '中文原描述：',
    'prop.copyZh': '复制中文',
    'prop.canvasSettings': '画布设置',
    'prop.deletePage': '删除当前页面',
    'prop.fieldLabel': '字段标题',
    'prop.fieldLabelEn': '字段标题',
    'prop.fieldLabelPlaceholder': '请输入字段标题',
    'prop.fieldHelp': '副标题',
    'prop.fieldHelpEn': '副标题',
    'prop.fieldHelpPlaceholder': '请输入副标题或补充说明',
    'prop.helpLayout': '排布方式',
    'prop.helpPosition': '排布方式',
    'prop.helpPositionRight': '标题右侧',
    'prop.helpPositionBottom': '标题下方',
    'prop.helpPositionRightDesc': '标题右侧显示（默认同排浅灰色小字）',
    'prop.helpPositionBottomDesc': '标题下方换行显示',
    'prop.helpPositionTip': '控制副标题排布方式：可选标题右侧显示（默认同排浅灰色小字）或标题下方换行显示。',
    'prop.showLabel': '显示标题',
    'prop.required': '设为必填',
    'prop.requiredTip': '开启后，该字段为必须填写项，未填写无法提交。',
    'prop.declarationRequired': '声明条款必填',
    'prop.declarationRequiredTip': '开启后，用户必须勾选同意所有声明复选条款才能提交表单。',
    'prop.customErrorMsg': '未填校验提示',
    'prop.customErrorMsgTip': '当用户未填写该必填项时展示的错误提示文字。留空则自动使用智能默认文案。',
    'prop.defaultAutoErrorTip': '默认自动生成提示文案',
    'prop.customizeError': '自定义提示',
    'prop.resetToDefaultError': '恢复默认',
    'prop.declarationErrorMsg': '未同意声明提示',
    'prop.declarationErrorMsgTip': '当用户未勾选同意声明时的提示文字。留空则自动使用智能默认文案“请先同意声明”。',
    'prop.placeholder': '占位提示',
    'prop.enableLongTerm': '启用长期选项',
    'prop.enableLongTermTip': '开启后在单日期输入框右侧显示“长期”选项，勾选后免填截止时间（起止日期模式自动停用）。',
    'prop.defaultLongTerm': '默认勾选长期',
    'prop.defaultLongTermTip': '开启后用户填表时默认自动勾选长期有效，免填日期。',
    'prop.longTermLabel': '长期',
    'prop.addOption': '添加选项',
    'prop.noticeConfig': '提示内容',
    'prop.noticeConfigTip': '配置展示给用户的提示条款与说明段落。',
    'prop.addNoticeItem': '添加提示内容',
    'prop.addClauseItem': '添加条款内容',
    'prop.layoutInline': '并排',
    'prop.layoutStack': '堆叠',
    'prop.unlimited': '不限制',
    'prop.allowMultiple': '开启多选',
    'prop.allowMultipleTip': '开启后支持在下拉框中选择多个选项。',
    'prop.defaultDialCode': '默认国际区号',
    'prop.defaultDialCodeTip': '设置手机号输入框左侧默认选中的国际区域号码。',
    'prop.strictPhoneValidation': '严格号码校验',
    'prop.strictPhoneValidationTip': '开启后将按照所选国家的真实国际规则校验手机号位数与号段格式（如新加坡8位且8/9开头，中国11位且1开头等）。',
    'prop.conditionalDisplay': '条件显隐联动',
    'prop.conditionalDisplayTip': '仅当前置选项满足特定条件时才在表单中展示当前字段，其他情况自动隐藏并免除必填校验。',
    'prop.dependsOnField': '关联前置字段',
    'prop.selectParentField': '请选择前置单选/下拉组件',
    'prop.selectTriggerValue': '请选择触发选项',
    'prop.noEligibleParent': '当前页面前方无可供关联的单选/下拉组件',
    'prop.copy': '复制',
    'prop.delete': '删除',
    'prop.collapsePanel': '收起属性面板',
    'prop.systemPreset': '系统预设',
    'prop.nodeType': '节点类型',
    'prop.systemBaseline': '系统前置 · 基础资料',
    'prop.businessType': '业务类型',
    'prop.locked': '已锁定',
    'prop.deletePageConfirm': '确定要删除当前画布页面吗？此操作不可撤销。',
    'prop.presetNationalities': '预设国籍',
    'prop.presetCountries': '预设国家',
    'prop.viewDirectory': '查看',
    'prop.unselected': '未选中',
    'prop.fieldFallback': '字段',
    'prop.clientCase': '客户案例',
    'prop.entityCase': '实体案例',
    'prop.individualCase': '个人案例',
    'prop.missingZhTag': '待补中文',
    'prop.missingEnTag': '待补英文',
    'prop.origZh': '中文原文：',
    'prop.origEn': '英文原文：',
    'prop.sameAsZh': '同中文',
    'prop.sameAsEn': '同英文',
    'prop.systemPresetAlert': '该节点为系统预置前置核验步骤，内容与逻辑由系统固化，不支持修改属性配置。',
    'prop.defaultCountryPlaceholder': '请选择国家/地区',
    'prop.defaultNatPlaceholder': '请选择国籍',
    'prop.configuringZhMode': '当前正在配置：中文内容',
    'prop.configuringEnMode': '当前正在配置：英文内容',
    'prop.linkageRuleTitle': '展开规则',
    'prop.linkageWhen': '当',
    'prop.linkageEquals': '选择',
    'prop.linkageThenShow': '时展开',
    'prop.linkageTipSimple': '未满足该条件时在填表端默认折叠隐藏',
    'prop.locateParentTip': '点击定位画布上游组件',
    'prop.unlinkRuleConfirm': '确定解除与该选项的展开联动吗？解除后该组件将恢复为常驻显示。',
    'prop.unlink': '解除联动',
    'prop.resizeHandleTip': '拖拽拉伸属性面板宽度',
    'prop.editLanguage': '编辑语言',
    'prop.zhCompleteness': '中文完备率: {percent}%',
    'prop.enCompleteness': '英文完备率: {percent}%',
    'prop.singleLangZh': '单语言 (简体中文)',
    'prop.singleLangEn': '单语言 (English)',
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
    'prop.signatureErrorMsgTip': '当用户未在签名板完成手写签名时的提示文字。留空则自动使用智能默认文案。',
    'prop.sigPadLabel': '签名提示文案',
    'prop.datePickerLabel': '日期选择提示',
    'prop.dateMode': '日期模式',
    'prop.dateModeTip': '设置日期选择方式，可切换为单日期选择或起止日期范围选择。',
    'prop.dateModeSingle': '单日期',
    'prop.dateModeRange': '起止日期',
    'prop.alertContentTitle': '提示内容',
    'prop.alertContentTip': '直接输入告示或说明文本，支持自然换行。行首以“- ”开头自动生成无序列表，支持 [文字](链接) 插入超链接。',
    'prop.alertContentPlaceholder': '请输入提示内容...\n- 以“- ”开头自动生成列表项\n- 支持 [链接文案](xxx.com) 插入超链接',
    'prop.alertEmptyContentPlaceholder': '请输入提示内容',
    'prop.alertListStyle': '列表形式',
    'prop.alertListStyleTip': '选择无序圆点列表或有序数字编号列表。',
    'prop.alertListCircle': '圆点',
    'prop.alertListNumber': '数字',
    'prop.alertInsertBullet': '列表项',
    'prop.alertInsertBulletTip': '在当前光标或新行插入列表项标记',
    'prop.alertInsertLink': '超链接',
    'prop.alertInsertLinkTip': '插入超链接 Markdown 语法 [链接文字](xxx.com)',
    'prop.maxSelections': '最大允许选择数',
    'prop.maxSelectionsTip': '限制用户在多选时最多可选择的选项或标签数量，留空则不限制。',
    'prop.inputType': '格式类型',
    'prop.inputTypeTip': '设置单行文本的输入格式，可选择普通文本或纯数字。',
    'prop.inputTypeText': '文本',
    'prop.inputTypeNumber': '数字',
    'prop.textareaRows': '行数与高度',
    'prop.textareaRowsTip': '设置多行文本框的初始最小行数与内容增多时自适应扩展的最大行数。',
    'prop.minRows': '最小行数',
    'prop.minRowsTip': '输入框默认展示的最小行高（行数）。',
    'prop.maxRows': '最大行数',
    'prop.maxRowsTip': '内容超出时自动向上扩展的最大行数，超过后出现纵向滚动条。',
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
    'prop.pageTitle': '页面标题',
    'prop.pageTitleEn': '页面标题',
    'prop.pageTitlePlaceholder': '请输入页面标题',
    'prop.pageDesc': '页面描述',
    'prop.pageDescEn': '页面描述',
    'prop.pageDescPlaceholder': '显示在标题下方的副标题或补充说明',

    // 选项与级联联动 (OptionsEditor)
    'prop.optionsConfig': '选项配置',
    'prop.optionsConfigTip': '设置列表的具体选项，选项名称用于展示给用户。',
    'prop.clauseConfig': '声明条款',
    'prop.clauseConfigTip': '配置要求用户阅读并确认的声明条款。',
    'prop.optionLayout': '排布方式',
    'prop.triggerValue': '展开显示的触发选项',
    'options.deleteOption': '删除选项',
    'options.optionNamePlaceholder': '选项名称',
    'options.noticePlaceholder': '请输入提示或声明内容...',
    'options.dragToReorderIndexed': '按住拖拽排序 (选项 {index})',
    'options.optionIndex': '选项',
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
    'options.singleInputDefault': '单行输入',
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
    'profile.relationshipType': '关系类型',
    'profile.shareholder': '股东',
    'profile.director': '董事',
    'profile.partner': '合伙人',
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
    'wizard.createNewTag': 'Create NEW',
    'wizard.createBlank': '新建空白画布',
    'wizard.createBlankDesc': '点击左下方立即创建按钮，开始创建您的第一个定制表单。',
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
    'modal.createForm.lockedProfile': '已锁定主体：',
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
    'modal.createForm.defaultDesc': '从空白画布创建的自定义表单',
    'modal.createForm.defaultPlaceholder': '留空默认为：{title}',

    // 预览与发布 (PreviewModal & PublishModal)
    'preview.preview': '预览',
    'preview.deploySchema': '发布结构',
    'preview.previewDesc': '在手机设备模拟器中体验表单交互与验证',
    'preview.deployDesc': '当前表单已生成可保存的结构数据',
    'preview.schemaJson': '结构 JSON',
    'preview.formSteps': '表单步骤列表',
    'preview.disclaimer': '预览效果仅供参考，实际显示可能因设备和浏览器不同而存在差异，请在移动端进行最终确认。',
    'preview.submitSuccess': '表单提交成功！',
    'preview.submitSuccessDesc': '所有必填项已严格通过校验，数据格式完全合规。',
    'preview.validationSummary': '校验结果汇总',
    'preview.totalFieldsChecked': '校验字段总数',
    'preview.mandatoryFields': '必填项目',
    'preview.refillForm': '重新填写表单',
    'preview.noFields': '当前页面暂无字段',
    'preview.validateForm': '表单验证',
    'preview.liveValidatorActive': '实时校验引擎已就绪（国际区号默认 +65 新加坡）',
    'preview.publishForm': '发布表单',
    'preview.publishing': '发布中...',
    'preview.defaultCompanyTitle': '上海青墨信息技术有限公司北京分公司',
    'preview.fillRequiredFields': '请填写所有必填项并修正错误',
    'preview.publishSuccess': '表单发布成功！',
    'preview.publishFailed': '发布失败',
    'publish.modalTitle': '发布表单',
    'publish.modalDesc': '核对并确认表单基本信息与发布介绍，确认无误后即可生成公网访问链接。',
    'publish.modalBilingualDesc': '已开启双语填报：请核对中英文表单名称与描述，发布后填表端支持双语自由切换。',
    'publish.editLocale': '编辑语言',
    'publish.formName': '表单名称',
    'publish.formNamePlaceholder': '请输入表单名称 (50字以内)',
    'publish.formNameEn': '英文表单名称',
    'publish.formNameEnPlaceholder': 'Enter English form name',
    'publish.formDesc': '表单描述 / 介绍',
    'publish.formDescPlaceholder': '向填表人介绍该表单的用途、填表须知或隐私声明（将展示在表单首屏）...',
    'publish.formDescEn': '英文表单描述',
    'publish.formDescEnPlaceholder': 'Introduce the purpose of the form, guidelines, or notices...',
    'publish.summaryTarget': '适用主体',
    'publish.formScale': '表单体量',
    'publish.summaryPages': '页',
    'publish.summaryFields': '字段',
    'publish.summaryTrans': '双语填报',
    'publish.transComplete': '已翻译',
    'publish.allCompleted': '全部齐备',
    'publish.missingCount': '{count} 项待补齐',
    'publish.nameRequired': '表单名称不能为空',
    'publish.confirmPublish': '确认发布',
    'publish.publishing': '正在发布...',
    'publish.successTitle': '表单发布成功！',
    'publish.successDesc': '表单已成功部署并生成公网访问链接，填表人可通过下方链接提交表单。',
    'publish.formUrl': '访问链接',
    'publish.copyLink': '复制链接',
    'publish.copied': '已复制',
    'publish.copySuccess': '链接已复制到剪贴板',
    'publish.openPreview': '新窗口打开',
    'publish.openPreviewTip': '点击在新窗口打开预览表单',
    'publish.done': '完成',

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
    'notFound.backToBuilder': '返回表单构建器',
    'notFound.backToKycList': '返回KYC表单列表',
    'notFound.autoRedirect': '将在 {countdown}s 后自动返回',

  },
  en: {
    // 通用与状态 (Common)
    'common.untitledPage': 'Untitled Page',
    'common.untitledField': 'Untitled Field',
    'common.notice': 'Notice',
    'common.noticeItem': 'Notice item',
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
    'common.templatesUnit': 'templates',
    'common.optionsUnit': 'options',
    'common.totalOptions': '{count} options',
    'common.passed': 'Passed',
    'common.prev': 'Previous',
    'common.confirmNext': 'Confirm & Next',
    'common.nextStep': 'Next Step',
    'common.cancel': 'Cancel',
    'common.singapore': 'Singapore',
    'common.prefilledBaseline': 'Pre-filled Baseline',
    'common.unknownError': 'Unknown error',
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
    'common.defaultColon': 'Default: ',

    // 顶部导航栏 (AppHeader)
    'app.dirty': 'Unsaved Changes',
    'app.saved': 'All Saved',
    'app.saving': 'Saving...',
    'app.save': 'Save',
    'app.preview': 'Preview',
    'app.deploy': 'Publish',
    'app.settings': 'Panel Settings',
    'app.leftSidebar': 'Component Library',
    'app.rightSidebar': 'Properties Panel',
    'header.back': 'Back',
    'header.formTitlePlaceholder': 'Enter form title',
    'header.confirmRename': 'Confirm',
    'header.clickToRename': 'Click to rename form',
    'header.renameForm': 'Rename form',
    'header.tour': 'User Guide',
    'header.saveSuccess': 'Form configuration saved successfully!',
    'header.saveFailed': 'Save failed, please check network or try again',
    'header.saveError': 'Error during save, please try again',
    'header.loggedOut': 'Logged out successfully',
    'header.profileOpened': 'User profile opened',
    'header.activityOpened': 'Activity log opened',
    'header.settingsOpened': 'Account settings opened',
    'header.untitledForm': 'Untitled Form',
    'header.warnTitle': 'Translation Incomplete Warning',
    'header.warnCount': 'There are {count} items missing English translation.',
    'header.warnDesc': 'English users may see default Chinese or blank fields if published now.',
    'header.warnMore': '...and {count} more items',
    'header.warnComplete': 'Complete Translations',
    'header.warnPublishAnyway': 'Publish Anyway',
    'header.untranslatedTag': 'Untranslated',
    'header.contentLang': 'Content Language',
    'header.clickToSwitchEn': 'Click to switch to English to edit untranslated items',
    'header.hasUntranslated': 'Current language has untranslated items',
    'header.itemsUntranslated': '{count} items untranslated',
    'header.allTranslated': 'All content translated',
    'header.switchedZh': 'Switched to Chinese editing mode',
    'header.switchedEn': 'Switched to English editing mode',
    'header.bilingualTooltip': 'When enabled, the form supports bilingual questionnaire, allowing respondents to switch languages',
    'header.bilingualSwitch': 'Bilingual Questionnaire',
    'header.bilingualGuideTitle': 'Bilingual Questionnaire Guide',
    'header.bilingualGuideDesc': 'When enabled, you can edit Chinese and English contents side by side. Respondents can toggle languages via the top-right button.',
    'header.bilingualDisableTitle': 'Disable Bilingual Questionnaire',
    'header.bilingualDisableDesc': 'Are you sure you want to disable bilingual questionnaire? When disabled, only primary language will be retained.',
    'header.bilingualDisableConfirm': 'Confirm Disable',
    'header.bilingualDisableCancel': 'Cancel',
    'header.bilingualVideoTitle': 'Bilingual Questionnaire Video Tutorial',
    'header.bilingualVideoTip': 'Tip: Once enabled, respondents can switch languages in the top-right corner.',
    'header.bilingualEnabledMsg': 'Bilingual questionnaire enabled',
    'header.bilingualDisabledMsg': 'Bilingual questionnaire disabled',

    // 用户下拉菜单 (User Menu)
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.activity': 'Activity Log',
    'user.logout': 'Sign Out',
    'user.role': 'System Administrator',

    // 侧边栏物料库 (MaterialSidebar)
    'sidebar.searchPlaceholder': 'Search components...',
    'sidebar.searchEmpty': 'No matching components found',
    'sidebar.catBasic': 'Basic Inputs',
    'sidebar.catBusiness': 'Business Components',
    'sidebar.tooltipCollapse': 'Collapse Sidebar',
    'sidebar.components': 'Components',
    'sidebar.templates': 'Templates',
    'sidebar.pages': 'Pages',
    'sidebar.searchTooltip': 'Search',
    'sidebar.collapseBtn': 'Collapse Sidebar',
    'sidebar.searchTemplates': 'Search templates...',
    'sidebar.createBlank': 'Create Blank Canvas',
    'sidebar.createBlankDesc': 'Build form from scratch',
    'sidebar.presetScenarios': 'Preset Scenarios',
    'sidebar.addCanvasPage': 'Add Canvas Page',
    'sidebar.confirmTitle': 'Prompt',
    'sidebar.templateLoaded': 'Template loaded',
    'sidebar.pageAdded': 'New canvas page added',
    'sidebar.pageDeleted': 'Canvas page deleted',
    'sidebar.deletePagePrompt': 'Are you sure you want to delete this canvas page?',
    'sidebar.systemPreset': 'System Preset',
    'sidebar.locatePage': 'Locate page',
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
    'canvas.unnamed': 'Untitled Field',
    'canvas.helpPlaceholder': 'Description',
    'canvas.droppable': 'Droppable Canvas',
    'canvas.presetCannotDrop': 'System Preset · Cannot Drop',
    'canvas.dragToFormCanvas': 'Please drag components to subsequent form canvases',
    'canvas.emptyTitle': 'Canvas is currently empty',
    'canvas.emptyDesc': 'Drag and drop components from the left sidebar to start building',
    'canvas.addPageRight': 'Add new page to the right',
    'canvas.initializing': 'Initializing canvas...',
    'canvas.preparingEnv': 'Preparing form environment',
    'canvas.noPages': 'No Canvas Pages',
    'canvas.noPagesDesc': 'Your workspace is ready. Create a canvas page to configure form fields.',
    'canvas.newCanvas': 'New Blank Form',
    'canvas.browseTemplates': 'Use Scenario Template',
    'canvas.expandSidebar': 'Expand Sidebar',
    'canvas.expandProperties': 'Expand Properties',
    'canvas.zoomIn': 'Zoom in',
    'canvas.zoomOut': 'Zoom out',
    'canvas.zoom100': 'Zoom to 100%',
    'canvas.zoomFit': 'Zoom to Fit',
    'canvas.zoomSelection': 'Zoom to Selection',
    'canvas.helpTooltip': 'User Guide & Shortcuts',
    'canvas.helpModalTitle': 'User Guide & Shortcuts',
    'canvas.secCanvasZoom': 'Canvas Zoom & Panning',
    'canvas.panCanvas': 'Pan Canvas',
    'canvas.leftDrag': 'Left Drag',
    'canvas.smoothZoom': 'Smooth Zoom',
    'canvas.wheel': 'Wheel',
    'canvas.secFormEditing': 'Form & Editing',
    'canvas.searchComponents': 'Search Components',
    'canvas.contextMenu': 'Context Menu',
    'canvas.rightClick': 'Right Click',
    'canvas.inlineTextEdit': 'Inline Text Edit',
    'canvas.clickText': 'Click Text',
    'canvas.duplicateElement': 'Duplicate Element',
    'canvas.deleteElement': 'Delete Element',
    'canvas.productTour': 'View User Guide',
    'canvas.gotIt': 'Got it',
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
    'context.insertBelow': 'Insert Below',
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
    'prop.zhRef': 'Original (ZH): ',
    'prop.zhPageTitleRef': 'Original Title (ZH): ',
    'prop.zhPageDescRef': 'Original Description (ZH): ',
    'prop.copyZh': 'Use ZH',
    'prop.canvasSettings': 'Canvas Settings',
    'prop.deletePage': 'Delete Page',
    'prop.fieldLabel': 'Field Label',
    'prop.fieldLabelEn': 'Field Label',
    'prop.fieldLabelPlaceholder': 'Enter field label',
    'prop.fieldHelp': 'Subtitle',
    'prop.fieldHelpEn': 'Subtitle',
    'prop.fieldHelpPlaceholder': 'Enter subtitle or explanation',
    'prop.helpLayout': 'Layout',
    'prop.helpPosition': 'Layout',
    'prop.helpPositionRight': 'Inline',
    'prop.helpPositionBottom': 'Below',
    'prop.helpPositionRightDesc': 'Inline on right (default light gray text)',
    'prop.helpPositionBottomDesc': 'Below title (new line)',
    'prop.helpPositionTip': 'Control subtitle placement: inline beside title or on a new line below title.',
    'prop.showLabel': 'Show Label',
    'prop.required': 'Required',
    'prop.requiredTip': 'When enabled, this field is mandatory for submission.',
    'prop.declarationRequired': 'Declarations Required',
    'prop.declarationRequiredTip': 'When enabled, user must agree to all declarations.',
    'prop.customErrorMsg': 'Validation Message',
    'prop.customErrorMsgTip': 'Error prompt displayed when this required field is empty. Leave blank to use smart default message.',
    'prop.defaultAutoErrorTip': 'Auto prompt by label',
    'prop.customizeError': 'Customize',
    'prop.resetToDefaultError': 'Reset to Default',
    'prop.declarationErrorMsg': 'Declaration Error Message',
    'prop.declarationErrorMsgTip': 'Error prompt displayed when declarations are not agreed. Leave blank to use smart default "Please agree to the declarations first".',
    'prop.placeholder': 'Placeholder',
    'prop.enableLongTerm': 'Enable Long-term Option',
    'prop.enableLongTermTip': 'Show a "Long-term" checkbox next to single date input (disabled in date range mode).',
    'prop.defaultLongTerm': 'Default to Long-term',
    'prop.defaultLongTermTip': 'Default to long-term checked when filling form, bypassing date requirement.',
    'prop.longTermLabel': 'Long-term',
    'prop.addOption': 'Add Option',
    'prop.noticeConfig': 'Notice Content',
    'prop.noticeConfigTip': 'Configure notice paragraphs displayed to users.',
    'prop.addNoticeItem': 'Add Notice Item',
    'prop.addClauseItem': 'Add Clause',
    'prop.layoutInline': 'Inline',
    'prop.layoutStack': 'Stacked',
    'prop.unlimited': 'Unlimited',
    'prop.allowMultiple': 'Allow Multi-selection',
    'prop.allowMultipleTip': 'Allow selecting multiple choices from the dropdown.',
    'prop.defaultDialCode': 'Default Dial Code',
    'prop.defaultDialCodeTip': 'Set default country dial code selected on the left of the phone input.',
    'prop.strictPhoneValidation': 'Strict Validation',
    'prop.strictPhoneValidationTip': 'Validate phone digits and prefix against official rules for the selected country (e.g., Singapore 8 digits starting with 8/9, China 11 digits starting with 1).',
    'prop.conditionalDisplay': 'Conditional Display',
    'prop.conditionalDisplayTip': 'Show this field only when a preceding choice field meets specific condition; otherwise auto-hide and bypass validation.',
    'prop.dependsOnField': 'Depends On Field',
    'prop.selectParentField': 'Select parent choice field',
    'prop.selectTriggerValue': 'Select trigger option',
    'prop.noEligibleParent': 'No preceding choice fields available on this page',
    'prop.copy': 'Duplicate',
    'prop.delete': 'Delete',
    'prop.collapsePanel': 'Collapse panel',
    'prop.systemPreset': 'System Preset',
    'prop.nodeType': 'Node Type',
    'prop.systemBaseline': 'System Baseline · Basic Info',
    'prop.businessType': 'Business Type',
    'prop.locked': 'Locked',
    'prop.deletePageConfirm': 'Are you sure you want to delete this canvas page? This cannot be undone.',
    'prop.presetNationalities': 'Preset Nationalities',
    'prop.presetCountries': 'Preset Countries',
    'prop.viewDirectory': 'View',
    'prop.unselected': 'Unselected',
    'prop.fieldFallback': 'Field',
    'prop.clientCase': 'Client Case',
    'prop.entityCase': 'Entity Case',
    'prop.individualCase': 'Individual Case',
    'prop.missingZhTag': 'Missing Chinese',
    'prop.missingEnTag': 'Missing English',
    'prop.origZh': 'Original ZH: ',
    'prop.origEn': 'Original EN: ',
    'prop.sameAsZh': 'Same as ZH',
    'prop.sameAsEn': 'Same as EN',
    'prop.systemPresetAlert': 'This node is a system-level pre-check step with fixed logic. Property modification is not supported.',
    'prop.defaultCountryPlaceholder': 'Select Country/Region',
    'prop.defaultNatPlaceholder': 'Select Nationality',
    'prop.configuringZhMode': 'Configuring: Chinese Content',
    'prop.configuringEnMode': 'Configuring: English Content',
    'prop.linkageRuleTitle': 'Display Rule',
    'prop.linkageWhen': 'When',
    'prop.linkageEquals': 'selects',
    'prop.linkageThenShow': 'reveal this field',
    'prop.linkageTipSimple': 'Hidden by default until this condition is met',
    'prop.locateParentTip': 'Click to locate upstream component on canvas',
    'prop.unlinkRuleConfirm': 'Unlink this condition? The field will become permanently visible.',
    'prop.unlink': 'Unlink',
    'prop.resizeHandleTip': 'Drag to resize property panel',
    'prop.editLanguage': 'Language',
    'prop.zhCompleteness': 'Chinese completeness: {percent}%',
    'prop.enCompleteness': 'English completeness: {percent}%',
    'prop.singleLangZh': 'Single Language (Simplified Chinese)',
    'prop.singleLangEn': 'Single Language (English)',
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
    'prop.signatureErrorMsgTip': 'Error prompt displayed when signature is missing. Leave blank to use smart default message.',
    'prop.sigPadLabel': 'Signature Prompt Text',
    'prop.datePickerLabel': 'Date Picker Placeholder',
    'prop.dateMode': 'Date Mode',
    'prop.dateModeTip': 'Configure date selection mode: single date or date range.',
    'prop.dateModeSingle': 'Single Date',
    'prop.dateModeRange': 'Date Range',
    'prop.alertContentTitle': 'Notice Content',
    'prop.alertContentTip': 'Enter notice text directly. Lines starting with "- " create bullet points. Supports [Link](url) hyperlinks.',
    'prop.alertContentPlaceholder': 'Enter notice content...\n- Start with "- " for list items\n- Supports [Link Text](xxx.com) hyperlinks',
    'prop.alertEmptyContentPlaceholder': 'Please enter notice content',
    'prop.alertListStyle': 'List Style',
    'prop.alertListStyleTip': 'Select circle bullets or numbered list items.',
    'prop.alertListCircle': 'Bullet',
    'prop.alertListNumber': 'Number',
    'prop.alertInsertBullet': 'Bullet',
    'prop.alertInsertBulletTip': 'Insert list item prefix',
    'prop.alertInsertLink': 'Link',
    'prop.alertInsertLinkTip': 'Insert Markdown link [Text](xxx.com)',
    'prop.maxSelections': 'Max Allowed Selections',
    'prop.maxSelectionsTip': 'Limit maximum number of choices allowed. Leave empty for unlimited.',
    'prop.inputType': 'Format Type',
    'prop.inputTypeTip': 'Set single line input format: normal text or number.',
    'prop.inputTypeText': 'Text',
    'prop.inputTypeNumber': 'Number',
    'prop.textareaRows': 'Rows & Auto-size',
    'prop.textareaRowsTip': 'Configure the initial minimum rows and maximum expanding rows for the textarea.',
    'prop.minRows': 'Min Rows',
    'prop.minRowsTip': 'The initial and minimum visible text line count.',
    'prop.maxRows': 'Max Rows',
    'prop.maxRowsTip': 'The maximum number of rows to expand to before scrolling.',
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
    'prop.pageTitle': 'Page Title',
    'prop.pageTitleEn': 'Page Title',
    'prop.pageTitlePlaceholder': 'Enter page title',
    'prop.pageDesc': 'Page Description',
    'prop.pageDescEn': 'Page Description',
    'prop.pageDescPlaceholder': 'Subtitle or description displayed below the title',

    // 选项与级联联动 (OptionsEditor)
    'prop.optionsConfig': 'Option Settings',
    'prop.optionsConfigTip': 'Configure choices displayed to users.',
    'prop.clauseConfig': 'Declaration Clauses',
    'prop.clauseConfigTip': 'Configure legal declaration clauses for user acknowledgment.',
    'prop.optionLayout': 'Layout',
    'prop.triggerValue': 'Trigger Option Value',
    'options.deleteOption': 'Delete Option',
    'options.optionNamePlaceholder': 'Option Label',
    'options.noticePlaceholder': 'Enter notice or declaration text...',
    'options.dragToReorderIndexed': 'Drag to reorder Option {index}',
    'options.optionIndex': 'Option',
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
    'options.singleInputDefault': 'Single-line Input',
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
    'wizard.createNewTag': 'Create NEW',
    'wizard.createBlank': 'Create Blank Canvas',
    'wizard.createBlankDesc': 'Click the "Create Now" button at the bottom left to start creating your first custom form.',
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
    'modal.createForm.lockedProfile': 'Locked Profile: ',
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
    'modal.createForm.defaultDesc': 'Custom form created from blank canvas',
    'modal.createForm.defaultPlaceholder': 'Default: {title}',

    // 预览与发布 (PreviewModal & PublishModal)
    'preview.preview': 'Preview',
    'preview.deploySchema': 'Deploy Schema',
    'preview.previewDesc': 'Experience responsive mobile form interactions and validations',
    'preview.deployDesc': 'Form schema is ready for deployment',
    'preview.schemaJson': 'Schema JSON',
    'preview.formSteps': 'Form Steps',
    'preview.disclaimer': 'Preview is for reference only. Actual display may vary depending on device and browser. Please verify on mobile devices.',
    'preview.submitSuccess': 'Submitted successfully!',
    'preview.submitSuccessDesc': 'All mandatory fields and rules have passed strict validation.',
    'preview.validationSummary': 'Validation Summary',
    'preview.totalFieldsChecked': 'Total Fields Checked',
    'preview.mandatoryFields': 'Mandatory Fields',
    'preview.refillForm': 'Refill Form',
    'preview.noFields': 'Current page has no fields',
    'preview.validateForm': 'Validate Form',
    'preview.liveValidatorActive': 'Live Validator: Active (Singapore +65 default)',
    'preview.publishForm': 'Publish Form',
    'preview.publishing': 'Publishing...',
    'preview.defaultCompanyTitle': 'Beijing Branch of Shanghai Qingmo Information Co., Ltd',
    'preview.fillRequiredFields': 'Please fill in all required fields',
    'preview.publishSuccess': 'Form published successfully!',
    'preview.publishFailed': 'Publish failed',
    'publish.modalTitle': 'Publish Form',
    'publish.modalDesc': 'Confirm form name and description before generating public access link.',
    'publish.modalBilingualDesc': 'Bilingual filing enabled: please verify Chinese and English titles & descriptions. Respondents can switch languages freely.',
    'publish.editLocale': 'Language',
    'publish.formName': 'Form Name',
    'publish.formNamePlaceholder': 'Enter form name (up to 50 chars)',
    'publish.formNameEn': 'English Form Name',
    'publish.formNameEnPlaceholder': 'Enter English form name',
    'publish.formDesc': 'Form Description',
    'publish.formDescPlaceholder': 'Introduce the purpose of the form, guidelines, or notices (displayed on first screen)...',
    'publish.formDescEn': 'English Description',
    'publish.formDescEnPlaceholder': 'Introduce the purpose of the form, guidelines, or notices...',
    'publish.summaryTarget': 'Target Entity',
    'publish.formScale': 'Form Scale',
    'publish.summaryPages': 'pages',
    'publish.summaryFields': 'fields',
    'publish.summaryTrans': 'Bilingual Filing',
    'publish.transComplete': 'Complete',
    'publish.allCompleted': 'All Completed',
    'publish.missingCount': '{count} to complete',
    'publish.nameRequired': 'Form name is required',
    'publish.confirmPublish': 'Confirm Publish',
    'publish.publishing': 'Publishing...',
    'publish.successTitle': 'Form Published Successfully!',
    'publish.successDesc': 'Your form is now live and accessible via the public link below.',
    'publish.formUrl': 'Public URL',
    'publish.copyLink': 'Copy Link',
    'publish.copied': 'Copied',
    'publish.copySuccess': 'Link copied to clipboard',
    'publish.openPreview': 'Open in New Tab',
    'publish.openPreviewTip': 'Click to open preview form in a new window',
    'publish.done': 'Done',

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
    'tour.neverShow': '',
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
    'notFound.backToBuilder': 'Back to Form Builder',
    'notFound.backToKycList': 'Back to KYC Forms',
    'notFound.autoRedirect': 'Auto redirecting in {countdown}s',

  }
};

/**
 * 获取系统 UI 文案（支持多语言与参数插值）
 */
export function t(key: string, locale?: Locale, params?: Record<string, string | number>): string {
  const current = locale || store.currentLocale || 'zh';
  let str = systemMessages[current]?.[key] || systemMessages.zh[key] || key;
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

export function formatOptionLabel(index: number, locale?: Locale): string {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    return `Option ${index}`;
  }
  if (index >= 1 && index <= 10) {
    return `选项${CHINESE_NUMS[index - 1]}`;
  }
  return `选项${index}`;
}

/**
 * 获取组件多语言文本
 * @param element 组件对象
 * @param field 属性名 (label, placeholder, help, customErrorMessage 等)
 * @param locale 指定语言，缺省时取当前激活语言
 * @param fallback 是否在当前语言未设置时回退另一语言（设计态为 false 保证所见即所得；预览态为 true）
 */
export function getFieldText(
  element: any,
  field: string,
  locale?: Locale,
  fallback = false
): string {
  if (!element) return '';
  const current = locale || store.currentLocale || 'zh';
  const val = current === 'en' ? element[`${field}_en`] : element[field];
  if (val !== undefined && val !== null && val !== '') {
    return String(val);
  }
  if (fallback) {
    const fallbackVal = current === 'en' ? element[field] : element[`${field}_en`];
    return fallbackVal !== undefined && fallbackVal !== null ? String(fallbackVal) : '';
  }
  return '';
}

/**
 * 预览态/只读态获取组件多语言文本（自动回退另一语言，确保终端填表用户绝不出现空白无文字）
 */
export function getLocalizedFieldText(
  element: any,
  field: string,
  locale?: Locale
): string {
  return getFieldText(element, field, locale, true);
}

/**
 * 获取选项多语言文案
 * @param option 选项对象
 * @param locale 指定语言
 * @param fallback 是否在当前语言为空时回退另一语言（设计态为 false；预览态为 true）
 */
export function getOptionLabel(
  option: FormElementOption,
  locale?: Locale,
  fallback = false
): string {
  if (!option) return '';
  const current = locale || store.currentLocale || 'zh';
  const val = current === 'en' ? option.label_en : option.label;
  if (val !== undefined && val !== null && val !== '') {
    return String(val);
  }
  if (fallback) {
    const fallbackVal = current === 'en' ? option.label : option.label_en;
    return fallbackVal !== undefined && fallbackVal !== null ? String(fallbackVal) : '';
  }
  return '';
}

/**
 * 预览态/只读态获取选项多语言文案（自动回退另一语言）
 */
export function getLocalizedOptionLabel(
  option: FormElementOption,
  locale?: Locale
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
  page: { title?: string; title_en?: string; description?: string; description_en?: string },
  field: 'title' | 'description',
  locale?: Locale,
  fallback = false
): string {
  if (!page) return '';
  const current = locale || store.currentLocale || 'zh';
  const val = current === 'en' ? (page as any)[`${field}_en`] : (page as any)[field];
  if (val !== undefined && val !== null && val !== '') {
    return String(val);
  }
  if (fallback) {
    const fallbackVal = current === 'en' ? (page as any)[field] : (page as any)[`${field}_en`];
    return fallbackVal !== undefined && fallbackVal !== null ? String(fallbackVal) : '';
  }
  return '';
}

/**
 * 预览态/只读态获取页面多语言文本（自动回退另一语言）
 */
export function getLocalizedPageText(
  page: { title?: string; title_en?: string; description?: string; description_en?: string },
  field: 'title' | 'description',
  locale?: Locale
): string {
  return getPageText(page, field, locale, true);
}

/**
 * 统一设置组件多语言文本并标记变更
 */
export function setFieldText(
  element: FormElement,
  field: string,
  val: string,
  locale?: Locale
) {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    (element as any)[`${field}_en`] = val;
  } else {
    (element as any)[field] = val;
  }
  markDirty();
}

/**
 * 统一设置页面多语言文本并标记变更
 */
export function setPageText(
  page: { title?: string; title_en?: string; description?: string; description_en?: string },
  field: 'title' | 'description',
  val: string,
  locale?: Locale
) {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    (page as any)[`${field}_en`] = val;
  } else {
    (page as any)[field] = val;
  }
  markDirty();
}

/**
 * 统一设置选项多语言文本并标记变更（互不破坏另一语言数据）
 */
export function setOptionLabel(
  option: FormElementOption,
  val: string,
  locale?: Locale
) {
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    option.label_en = val;
  } else {
    option.label = val;
  }
  markDirty();
}

/**
 * 获取字段在当前语言下的通用默认/兜底校验错误提示文字
 */
export function getFieldDefaultErrorMessage(
  element: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  const isEn = current === 'en';

  if (subType === 'declaration') {
    return isEn ? 'Please agree to the declarations' : '请确认并同意声明条款';
  }

  if (subType === 'signature' || element.type === 'signature') {
    return isEn ? 'Please complete handwritten signature' : '请完成手写签名';
  }

  switch (element.type) {
    case 'radio':
      return isEn ? 'Please select an option' : '请选择一个选项';
    case 'checkbox':
      return isEn ? 'Please select at least one option' : '请至少选择一个选项';
    case 'select':
    case 'country':
    case 'nationality':
      if (element.multiple) {
        return isEn ? 'Please select at least one option' : '请至少选择一个选项';
      }
      return isEn ? 'Please select an option' : '请选择一个选项';
    case 'date':
      return isEn ? 'Please select a date' : '请选择日期';
    case 'input':
    case 'textarea':
    case 'phone':
    case 'email':
    default:
      return isEn ? 'This required field cannot be empty' : '必填项不能为空';
  }
}

/**
 * 解析字段的有效校验错误提示（三级降级：用户自定义 > 智能语义兜底 > 系统通用兜底）
 */
export function getFieldValidationMessage(
  element: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  const isEn = current === 'en';

  if (subType === 'declaration') {
    if (isEn && element.declarationErrorMessage_en) return element.declarationErrorMessage_en;
    if (!isEn && element.declarationErrorMessage) return element.declarationErrorMessage;
    return getFieldDefaultErrorMessage(element, 'declaration', current);
  }

  // 第一优先级：用户配置的自定义提示
  if (isEn && element.customErrorMessage_en) return element.customErrorMessage_en;
  if (!isEn && element.customErrorMessage) return element.customErrorMessage;

  // 第二优先级：组件语义化智能兜底
  return getFieldDefaultErrorMessage(element, subType, current);
}
