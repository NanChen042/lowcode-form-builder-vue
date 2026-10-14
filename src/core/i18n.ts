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
    // 通用
    'common.untitledPage': '未命名页面',
    'common.untitledField': '未命名字段',
    'common.notice': '提示',
    'common.noticeItem': '提示说明项',
    'common.signed': '已签署：授权代表已核验 ✓',
    'common.clearSignature': '清除签名',
    'common.clickToSign': '点击此处手写签名',
    'common.longTerm': '长期',
    'common.systemPreset': '系统预设',
    'common.cannotDrop': '不可放置',
    'common.basicInfo': '基础资料',
    'common.readOnly': '只读核验',

    // 顶部栏
    'app.dirty': '有未保存变更',
    'app.saved': '全部已保存',
    'app.saving': '正在保存...',
    'app.save': '保存',
    'app.preview': '预览',
    'app.deploy': '发布表单',
    'app.settings': '面板布局设置',
    'app.leftSidebar': '左侧物料库',
    'app.rightSidebar': '右侧属性面板',

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
    'prop.zhRef': '中文原文：',
    'prop.zhPageTitleRef': '中文原标题：',
    'prop.zhPageDescRef': '中文原描述：',
    'prop.copyZh': '复制中文',
    'prop.canvasSettings': '画布设置',
    'prop.page': '页面',
    'prop.pageTitle': '页面标题',
    'prop.pageTitleEn': '页面标题',
    'prop.pageTitlePlaceholder': '请输入页面标题',
    'prop.pageDesc': '页面描述',
    'prop.pageDescEn': '页面描述',
    'prop.pageDescPlaceholder': '显示在标题下方的副标题或补充说明',
    'prop.deletePage': '删除当前页面',
    'prop.fieldLabel': '字段标题',
    'prop.fieldLabelEn': '字段标题',
    'prop.fieldLabelPlaceholder': '请输入字段标题',
    'prop.fieldHelp': '副标题',
    'prop.fieldHelpEn': '副标题',
    'prop.fieldHelpPlaceholder': '请输入副标题或补充说明',
    'prop.addHelp': '添加副标题说明',
    'prop.removeHelp': '删除副标题',
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
    'prop.customErrorMsg': '未填校验提示',
    'prop.customErrorMsgTip': '当用户未填写该必填项时展示的错误提示文字。留空则自动使用智能默认文案。',
    'prop.defaultAutoErrorTip': '默认自动生成提示文案',
    'prop.customizeError': '自定义提示',
    'prop.resetToDefaultError': '恢复默认',
    'prop.signatureErrorMsg': '未签名提示',
    'prop.signatureErrorMsgTip': '当用户未在签名板完成手写签名时的提示文字。留空则自动使用智能默认文案。',
    'prop.declarationErrorMsg': '未同意声明提示',
    'prop.declarationErrorMsgTip': '当用户未勾选同意声明时的提示文字。留空则自动使用智能默认文案“请先同意声明”。',
    'prop.placeholder': '占位提示',
    'prop.sigPadLabel': '签名提示文案',
    'prop.datePickerLabel': '日期选择提示',
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
    'prop.emailPlaceholderLabel': '邮箱占位提示',
    'prop.copy': '复制',
    'prop.delete': '删除',

    // 选项编辑器
    'options.deleteOption': '删除选项',
    'options.optionNamePlaceholder': '选项名称',
    'options.noticePlaceholder': '请输入提示或声明内容...',

    // 画布
    'canvas.signatureArea': '请在此处手写签名',
    'canvas.unnamed': '未命名字段',

    // 侧边栏物料库
    'sidebar.searchPlaceholder': '查找组件或模块...',
    'sidebar.searchEmpty': '未找到匹配的组件',
    'sidebar.catBasic': '基础输入',
    'sidebar.catBusiness': '业务组件',
    'sidebar.tooltipComponents': '组件物料库',
    'sidebar.tooltipTemplates': '场景模板库',
    'sidebar.tooltipPages': '画布页面列表',
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
    'sidebar.confirmOverwrite': '会覆盖当前画布内容，是否继续？',
    'sidebar.templateLoaded': '模板已载入',
    'sidebar.pageAdded': '已添加新画板页面',
    'sidebar.componentAdded': '组件已添加到画布',
    'sidebar.tabComponents': '组件库',
    'sidebar.tabTemplates': '场景模板库',
    'sidebar.tabPages': '页面大纲',
    'sidebar.subComponents': '点击或拖拽至画布',
    'sidebar.subTemplates': '标准 KYC 问卷',

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

    // 新建表单弹窗 (CreateFormModal)
    'modal.createForm': '新建表单画布',
    'modal.lockedProfile': '已锁定主体：',
    'modal.profileType': '业务主体',
    'modal.formTitle': '表单名称',
    'modal.formTitlePlaceholder': '请输入表单名称',
    'modal.createDesc': '初始化所选主体的基本资料画板，后续可在画布中自由拖拽编排。',
    'modal.createCanvas': '立即创建',
    'modal.cancel': '取消',
    'modal.confirm': '确定',
    'modal.createdSuccess': '表单画布创建成功',
    'modal.individualCase': '个人案例 (Individual)',
    'modal.entityCase': '机构案例 (Entity)',
    'modal.customerCase': '母案例 (Customer)',
    'modal.defaultIndividualTitle': '留空默认为：SG_CDD_Individual',
    'modal.defaultEntityTitle': '留空默认为：SG_CDD_Entity',
    'modal.defaultCustomerTitle': '留空默认为：SG_CDD_Customer',
    'modal.customFormDesc': '从空白画布创建的自定义表单',

    // 欢迎向导弹窗 (WelcomeWizardModal)
    'wizard.brandSubtitle': 'DIY 表单设计器',
    'wizard.title': '欢迎使用 AlgoCandy',
    'wizard.subtitle': '选择创建表单的方式，几秒钟即可开启高效编排。',
    'wizard.createBlank': '新建空白画布',
    'wizard.createBlankDesc': '从零开始，自由搭建您的专属表单。',
    'wizard.createNowBtn': '立即创建',
    'wizard.useTemplate': '选用场景模板',
    'wizard.useTemplateDesc': '精选合规预设场景，开箱即用加速构建。',
    'wizard.browseTemplatesBtn': '浏览模板',
    'wizard.popularTemplates': '热门场景模板',
    'wizard.viewAllTemplates': '查看全部模板',
    'wizard.slogan1': 'Build Better Forms,',
    'wizard.slogan2': 'Power Your Business.',
    'wizard.skip': '先逛逛画布',

    // 顶部导航栏 (AppHeader)
    'header.back': '返回上一页',
    'header.formTitlePlaceholder': '请输入表单名称',
    'header.confirmRename': '确认修改',
    'header.clickToRename': '点击修改表单名称',
    'header.renameForm': '修改表单名称',
    'header.tour': '操作指南',
    'header.tourTooltip': '随时开启表单设计器操作指南',
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

    // 操作指南 (User Guide)
    'tour.nextBtn': '下一步 →',
    'tour.prevBtn': '← 上一步',
    'tour.doneBtn': '开始使用',
    'tour.progressText': '第 {{current}} / {{total}} 步',
    'tour.neverShow': '不再提示',
    'tour.neverShowTitle': '以后进入页面不再自动弹出操作指南',
    'tour.closedMsg': '已关闭操作指南，后续可随时点击顶栏“操作指南”重新开启',

    // 属性面板补充
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

    // Schema 侧边栏
    'schema.title': '表单结构 JSON Schema',
    'schema.copied': '已复制',
    'schema.copyJson': '复制 JSON',
    'schema.copySuccess': '已成功复制 Schema JSON 到剪贴板',

    // 基础单位与通用操作
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
    'canvas.profileEntity': '机构案例',
    'canvas.profileCustomer': '母案例',

    // 右键上下文菜单 (ContextMenu)
    'context.duplicate': '复制组件',
    'context.insertBelow': '在下方插入组件',
    'context.deleteElement': '删除组件',
    'context.presetReadOnly': '系统预设资料（只读锁定）',
    'context.addComponent': '添加表单组件',
    'context.insertPageAfter': '在当前画布后方插入',
    'context.resetView': '重置画布视角',
    'context.deletePage': '删除当前画布',
    'context.newPage': '新建画布页面',
    'context.confirmDeleteTitle': '确认删除画布',
    'context.confirmDeleteContent': '确定要删除当前画布及其所有内容吗？此操作不可撤销。',
    'context.confirmDeleteOk': '确认删除',

    // 预览与发布 (PreviewModal)
    'preview.preview': '预览',
    'preview.deploySchema': '发布结构',
    'preview.previewDesc': '在手机设备模拟器中体验表单交互与验证',
    'preview.deployDesc': '当前表单已生成可保存的结构数据',
    'preview.schemaJson': '结构 JSON',
    'preview.formSteps': '表单步骤列表',
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

    // 校验提示 (Validation)
    'val.validNumber': '请输入有效数字',
    'val.validEmail': '请输入有效的邮箱地址',
    'val.maxOptions': '最多只能选择 {count} 项',
    'val.maxItems': '最多只能选择 {count} 项',
    'val.pleaseEnterEmail': '请输入邮箱',

    // 国家/国籍清单 (CountryDirectoryModal)
    'dir.searchPlaceholder': '搜索国家、国籍名称、代码或区号 (如 中国, 新加坡籍, SG, +86)...',
    'dir.country': '国家',
    'dir.nationality': '国籍',
    'dir.code': '代码',
    'dir.dialCode': '国际区号',
    'dir.noMatching': '未找到匹配的数据记录',
    'dir.totalCountPrefix': '共',
    'dir.totalCountSuffix': '个预设国家与地区',
    'dir.presetList': '预设清单',

    // 选项配置 (OptionsEditor)
    'options.dragToReorder': '按住拖拽排序',
    'options.dragToReorderIndexed': '按住拖拽排序 (选项 {index})',
    'options.optionIndex': '选项',
    'options.toggleDefaultRadio': '点击切换默认选中项',
    'options.toggleDefaultCheckbox': '点击切换默认勾选',
    'options.optionPlaceholder': '选项{index}',
    'options.declarationPlaceholder': '声明事项{index}',

    // 属性面板补充 (PropertyPanel)
    'prop.systemPresetAlert': '该节点为系统预置前置核验步骤，内容与逻辑由系统固化，不支持修改属性配置。',
    'prop.emailPlaceholder': '请输入邮箱',
    'prop.defaultCountryPlaceholder': '请选择国家/地区',
    'prop.defaultNatPlaceholder': '请选择国籍',
    'prop.configuringZhMode': '当前正在配置：中文内容',
    'prop.configuringEnMode': '当前正在配置：英文内容',
  },
  en: {
    // Common
    'common.untitledPage': 'Untitled Page',
    'common.untitledField': 'Untitled Field',
    'common.notice': 'Notice',
    'common.noticeItem': 'Notice item',
    'common.signed': 'Signed: Verified Representative ✓',
    'common.clearSignature': 'Clear Signature',
    'common.clickToSign': 'Click to sign',
    'common.longTerm': 'Long-term',
    'common.systemPreset': 'System Preset',
    'common.cannotDrop': 'Cannot Drop',
    'common.basicInfo': 'Basic Info',
    'common.readOnly': 'Read-only',

    // Top Bar
    'app.dirty': 'Unsaved Changes',
    'app.saved': 'All Saved',
    'app.saving': 'Saving...',
    'app.save': 'Save',
    'app.preview': 'Preview',
    'app.deploy': 'Publish',
    'app.settings': 'Panel Settings',
    'app.leftSidebar': 'Component Library',
    'app.rightSidebar': 'Properties Panel',

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
    'prop.zhRef': 'Original (ZH): ',
    'prop.zhPageTitleRef': 'Original Title (ZH): ',
    'prop.zhPageDescRef': 'Original Description (ZH): ',
    'prop.copyZh': 'Use ZH',
    'prop.canvasSettings': 'Canvas Settings',
    'prop.page': 'Page',
    'prop.pageTitle': 'Page Title',
    'prop.pageTitleEn': 'Page Title',
    'prop.pageTitlePlaceholder': 'Enter page title',
    'prop.pageDesc': 'Page Description',
    'prop.pageDescEn': 'Page Description',
    'prop.pageDescPlaceholder': 'Subtitle or description displayed below the title',
    'prop.deletePage': 'Delete Page',
    'prop.fieldLabel': 'Field Label',
    'prop.fieldLabelEn': 'Field Label',
    'prop.fieldLabelPlaceholder': 'Enter field label',
    'prop.fieldHelp': 'Subtitle',
    'prop.fieldHelpEn': 'Subtitle',
    'prop.fieldHelpPlaceholder': 'Enter subtitle or explanation',
    'prop.addHelp': 'Add Subtitle / Note',
    'prop.removeHelp': 'Remove Subtitle',
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
    'prop.customErrorMsg': 'Validation Message',
    'prop.customErrorMsgTip': 'Error prompt displayed when this required field is empty. Leave blank to use smart default message.',
    'prop.defaultAutoErrorTip': 'Auto prompt by label',
    'prop.customizeError': 'Customize',
    'prop.resetToDefaultError': 'Reset to Default',
    'prop.signatureErrorMsg': 'Missing Signature Message',
    'prop.signatureErrorMsgTip': 'Error prompt displayed when signature is missing. Leave blank to use smart default message.',
    'prop.declarationErrorMsg': 'Declaration Error Message',
    'prop.declarationErrorMsgTip': 'Error prompt displayed when declarations are not agreed. Leave blank to use smart default "Please agree to the declarations first".',
    'prop.placeholder': 'Placeholder',
    'prop.sigPadLabel': 'Signature Prompt Text',
    'prop.datePickerLabel': 'Date Picker Placeholder',
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
    'prop.emailPlaceholderLabel': 'Email Placeholder',
    'prop.copy': 'Duplicate',
    'prop.delete': 'Delete',

    // Options Editor
    'options.deleteOption': 'Delete Option',
    'options.optionNamePlaceholder': 'Option Label',
    'options.noticePlaceholder': 'Enter notice or declaration text...',

    // Canvas
    'canvas.signatureArea': 'Please sign here',
    'canvas.unnamed': 'Untitled Field',

    // Sidebar Materials
    'sidebar.searchPlaceholder': 'Search components...',
    'sidebar.searchEmpty': 'No matching components found',
    'sidebar.catBasic': 'Basic Inputs',
    'sidebar.catBusiness': 'Business Components',
    'sidebar.tooltipComponents': 'Component Library',
    'sidebar.tooltipTemplates': 'Scenario Templates',
    'sidebar.tooltipPages': 'Canvas Pages',
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
    'sidebar.confirmOverwrite': 'Loading this template will overwrite current canvas contents. Do you want to continue?',
    'sidebar.templateLoaded': 'Template loaded',
    'sidebar.pageAdded': 'New canvas page added',
    'sidebar.componentAdded': 'Component added to canvas',
    'sidebar.tabComponents': 'Component Library',
    'sidebar.tabTemplates': 'Templates',
    'sidebar.tabPages': 'Pages',
    'sidebar.subComponents': 'Drag or click to canvas',
    'sidebar.subTemplates': 'KYC Standards',

    // System Profile Preset Page (SystemProfileView)
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

    // Create Form Modal (CreateFormModal)
    'modal.createForm': 'New Form Canvas',
    'modal.lockedProfile': 'Locked Profile: ',
    'modal.profileType': 'Profile Type',
    'modal.formTitle': 'Form Title',
    'modal.formTitlePlaceholder': 'Enter form title',
    'modal.createDesc': 'Initializes basic profile page for the selected entity. You can freely orchestrate components on the canvas afterward.',
    'modal.createCanvas': 'Create Canvas',
    'modal.cancel': 'Cancel',
    'modal.confirm': 'Confirm',
    'modal.createdSuccess': 'Form canvas created successfully',
    'modal.individualCase': 'Individual Case',
    'modal.entityCase': 'Entity Case',
    'modal.customerCase': 'Customer Case',
    'modal.defaultIndividualTitle': 'Default: SG_CDD_Individual',
    'modal.defaultEntityTitle': 'Default: SG_CDD_Entity',
    'modal.defaultCustomerTitle': 'Default: SG_CDD_Customer',
    'modal.customFormDesc': 'Custom form created from blank canvas',

    // Welcome Wizard Modal (WelcomeWizardModal)
    'wizard.brandSubtitle': 'DIY Form Builder',
    'wizard.title': 'Welcome to AlgoCandy',
    'wizard.subtitle': 'Choose how you want to create your form, and get started in seconds.',
    'wizard.createBlank': 'Create Blank Canvas',
    'wizard.createBlankDesc': 'Start from scratch and build your form freely.',
    'wizard.createNowBtn': 'Create Now',
    'wizard.useTemplate': 'Use a Template',
    'wizard.useTemplateDesc': 'Choose from ready-made templates to build faster.',
    'wizard.browseTemplatesBtn': 'Browse Templates',
    'wizard.popularTemplates': 'Popular Templates',
    'wizard.viewAllTemplates': 'View All Templates',
    'wizard.slogan1': 'Build Better Forms,',
    'wizard.slogan2': 'Power Your Business.',
    'wizard.skip': 'Explore Canvas First',

    // App Header
    'header.back': 'Back',
    'header.formTitlePlaceholder': 'Enter form title',
    'header.confirmRename': 'Confirm',
    'header.clickToRename': 'Click to rename form',
    'header.renameForm': 'Rename form',
    'header.tour': 'User Guide',
    'header.tourTooltip': 'View the form builder user guide anytime',
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

    // User Guide (Tour)
    'tour.nextBtn': 'Next →',
    'tour.prevBtn': '← Back',
    'tour.doneBtn': 'Start Now',
    'tour.progressText': 'Step {{current}} of {{total}}',
    'tour.neverShow': "Don't show again",
    'tour.neverShowTitle': 'Never show user guide automatically on startup',
    'tour.closedMsg': 'User guide closed. You can restart it anytime from "User Guide" in the top bar.',

    // Property Panel extra
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

    // Schema Sidebar
    'schema.title': 'JSON Schema Structure',
    'schema.copied': 'Copied',
    'schema.copyJson': 'Copy JSON',
    'schema.copySuccess': 'Schema JSON copied to clipboard',

    // Basic Units & Operations
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

    // Context Menu (ContextMenu)
    'context.duplicate': 'Duplicate',
    'context.insertBelow': 'Insert Below',
    'context.deleteElement': 'Delete Component',
    'context.presetReadOnly': 'System Preset (Read-only)',
    'context.addComponent': 'Add Component',
    'context.insertPageAfter': 'Insert Page After',
    'context.resetView': 'Reset View',
    'context.deletePage': 'Delete Current Canvas',
    'context.newPage': 'New Blank Page',
    'context.confirmDeleteTitle': 'Confirm Delete Canvas',
    'context.confirmDeleteContent': 'Are you sure you want to delete this canvas and all its contents? This action cannot be undone.',
    'context.confirmDeleteOk': 'Delete',

    // Preview & Deploy (PreviewModal)
    'preview.preview': 'Preview',
    'preview.deploySchema': 'Deploy Schema',
    'preview.previewDesc': 'Experience responsive mobile form interactions and validations',
    'preview.deployDesc': 'Form schema is ready for deployment',
    'preview.schemaJson': 'Schema JSON',
    'preview.formSteps': 'Form Steps',
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

    // Validation
    'val.validNumber': 'Please enter a valid number',
    'val.validEmail': 'Please enter a valid email',
    'val.maxOptions': 'Maximum {count} options allowed',
    'val.maxItems': 'Maximum {count} items allowed',
    'val.pleaseEnterEmail': 'Please enter email',

    // Country/Nationality Directory (CountryDirectoryModal)
    'dir.searchPlaceholder': 'Search by country, nationality, code or dial code (e.g. Singapore, SG, +65)...',
    'dir.country': 'Country',
    'dir.nationality': 'Nationality',
    'dir.code': 'Code',
    'dir.dialCode': 'Dial Code',
    'dir.noMatching': 'No matching records found',
    'dir.totalCountPrefix': 'Total',
    'dir.totalCountSuffix': 'countries & regions',
    'dir.presetList': 'Preset List',

    // Options Editor
    'options.dragToReorder': 'Drag to reorder',
    'options.dragToReorderIndexed': 'Drag to reorder Option {index}',
    'options.optionIndex': 'Option',
    'options.toggleDefaultRadio': 'Click to toggle default selection',
    'options.toggleDefaultCheckbox': 'Click to toggle default check',
    'options.optionPlaceholder': 'Option {index}',
    'options.declarationPlaceholder': 'Declaration item {index}',

    // Property Panel Additions
    'prop.systemPresetAlert': 'This node is a system-level pre-check step with fixed logic. Property modification is not supported.',
    'prop.emailPlaceholder': 'Please enter email',
    'prop.defaultCountryPlaceholder': 'Select Country/Region',
    'prop.defaultNatPlaceholder': 'Select Nationality',
    'prop.configuringZhMode': 'Configuring: Chinese Content',
    'prop.configuringEnMode': 'Configuring: English Content',
    'prop.missingZhTag': 'Missing Chinese',
    'prop.missingEnTag': 'Missing English',
    'prop.origZh': 'Original ZH: ',
    'prop.origEn': 'Original EN: ',
    'prop.sameAsZh': 'Same as ZH',
    'prop.sameAsEn': 'Same as EN',
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
 * 获取组件多语言文本（画布渲染严格遵循当前激活语言，清空输入框时实时同步清空画布）
 */
export function getFieldText(
  element: any,
  field: string,
  locale?: Locale
): string {
  if (!element) return '';
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    return element[`${field}_en`] ?? '';
  }
  return element[field] ?? '';
}

/**
 * 获取选项多语言文案（画布渲染严格遵循当前激活语言）
 */
export function getOptionLabel(
  option: FormElementOption,
  locale?: Locale
): string {
  if (!option) return '';
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    return option.label_en ?? '';
  }
  return option.label ?? '';
}

/**
 * 获取页面多语言文本（画布渲染严格遵循当前激活语言）
 */
export function getPageText(
  page: { title?: string; title_en?: string; description?: string; description_en?: string },
  field: 'title' | 'description',
  locale?: Locale
): string {
  if (!page) return '';
  const current = locale || store.currentLocale || 'zh';
  if (current === 'en') {
    return (page as any)[`${field}_en`] ?? '';
  }
  return (page as any)[field] ?? '';
}

/**
 * 统一设置组件多语言文本并标记变更
 */
export function setFieldText(
  element: FormElement,
  field: 'label' | 'placeholder' | 'help',
  val: string
) {
  if (store.currentLocale === 'en') {
    (element as any)[`${field}_en`] = val;
  } else {
    element[field] = val;
  }
  markDirty();
}

/**
 * 统一设置选项多语言文本并标记变更
 */
export function setOptionLabel(
  option: FormElementOption,
  val: string
) {
  if (store.currentLocale === 'en') {
    // 若在英文模式下编辑，且中文原本是默认占位符 "选项一" / "选项1" 等，清空以触发缺失提示
    if (option.label && /^选项[一二三四五六七八九十\d]+$/.test(option.label.trim()) && val !== option.label_en) {
      option.label = '';
    }
    option.label_en = val;
  } else {
    // 若在中文模式下修改了选项，且英文原本还是初始假占位符 "Option 1" 等，清空英文以触发待补齐提醒
    if (option.label_en && /^Option\s*\d+$/i.test(option.label_en.trim()) && val !== option.label) {
      option.label_en = '';
    }
    option.label = val;
  }
  markDirty();
}

/**
 * 获取字段在当前语言下的智能默认/兜底错误提示文字
 */
export function getFieldDefaultErrorMessage(
  element: FormElement,
  subType?: 'declaration' | 'signature',
  locale?: Locale
): string {
  const current = locale || store.currentLocale || 'zh';
  const isEn = current === 'en';

  if (subType === 'declaration') {
    return isEn ? 'Please agree to the declarations first' : '请先同意声明';
  }

  const label = isEn
    ? (element.label_en || element.label || 'this field')
    : (element.label || '此项');

  switch (element.type) {
    case 'input':
    case 'textarea':
      return isEn ? `Please enter ${label}` : `请输入${label}`;
    case 'select':
    case 'country':
    case 'nationality':
    case 'date':
      return isEn ? `Please select ${label}` : `请选择${label}`;
    case 'radio':
      return isEn ? `Please select an option for ${label}` : `请选择一项${label}`;
    case 'checkbox':
      return isEn ? `Please select at least one option for ${label}` : `请至少选择一项${label}`;
    case 'signature':
      return isEn ? 'Please sign in the designated area' : '请在指定区域完成手写签名';
    case 'phone':
      return isEn ? 'Please enter phone number' : '请输入手机号码';
    case 'email':
      return isEn ? 'Please enter email' : '请输入邮箱地址';
    default:
      return isEn ? 'This field is required' : '此项为必填项';
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
