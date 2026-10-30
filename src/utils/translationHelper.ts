import { computed } from 'vue';
import { store, isRisk, selectPage, selectElement, selectGroup, focusOnPage } from '@/core/store';
import { componentRegistry } from '@/registry/components';
import { t } from '@/core/i18n';

export type TranslationFieldType =
  | 'page_title'
  | 'page_desc'
  | 'group_title'
  | 'field_label'
  | 'field_placeholder'
  | 'field_help'
  | 'field_content'
  | 'field_option';

export interface UntranslatedItem {
  id: string;
  pageId: string;
  pageIndex: number;
  pageTitle: string;
  groupId?: string;
  elementId?: string;
  elementLabel?: string;
  componentType?: string;
  fieldType: TranslationFieldType;
  fieldName: string; // e.g. '页面标题', '描述说明', '字段标签', '输入提示', '字段描述', '选项'
  sourceText: string;
  targetText: string;
  targetLocale: 'zh' | 'en'; // 哪种语言缺失了
  optionIndex?: number;
}

export interface PageTranslationGroup {
  pageId: string;
  pageIndex: number;
  pageTitle: string;
  items: UntranslatedItem[];
}

export interface TranslationStats {
  total: number;
  zhCompleted: number;
  zhPercent: number;
  zhMissingCount: number;
  zhMissingItems: UntranslatedItem[];
  enCompleted: number;
  enPercent: number;
  enMissingCount: number;
  enMissingItems: UntranslatedItem[];
  untranslatedCount: number;
  untranslatedItems: UntranslatedItem[];
  groupedByPage: PageTranslationGroup[];
}

/**
 * 获取字段用于展示的可读标签
 */
function getFieldDisplayLabel(element: any, locale: 'zh' | 'en'): string {
  const isEn = locale === 'en';
  const primary = isEn ? element.label_en?.trim() : element.label?.trim();
  const secondary = isEn ? element.label?.trim() : element.label_en?.trim();
  if (primary) return primary;
  if (secondary) return secondary;
  const meta = componentRegistry[element.type as keyof typeof componentRegistry];
  if (meta) {
    return isEn ? meta.label_en : meta.label;
  }
  return t('trans.fieldDefault');
}

/**
 * 计算表单中所有可翻译文案的双向翻译进度及缺失清单
 */
export function calculateTranslationStats(): TranslationStats {
  const enMissingItems: UntranslatedItem[] = [];
  const zhMissingItems: UntranslatedItem[] = [];
  let total = 0;
  let zhCompleted = 0;
  let enCompleted = 0;

  function registerItem(params: {
    id: string;
    pageId: string;
    pageIndex: number;
    pageTitle: string;
    groupId?: string;
    elementId?: string;
    elementLabel?: string;
    componentType?: string;
    fieldType: TranslationFieldType;
    fieldName: string;
    zhText?: string;
    enText?: string;
    optionIndex?: number;
  }) {
    const zh = params.zhText?.trim() || '';
    const en = params.enText?.trim() || '';

    // 若中英双语均为空（例如可选的副标题、占位符），不计入必须翻译项
    if (!zh && !en) return;

    total++;
    if (zh) zhCompleted++;
    if (en) enCompleted++;

    // 缺少英文
    if (zh && !en) {
      enMissingItems.push({
        id: `${params.id}_en`,
        pageId: params.pageId,
        pageIndex: params.pageIndex,
        pageTitle: params.pageTitle,
        groupId: params.groupId,
        elementId: params.elementId,
        elementLabel: params.elementLabel,
        componentType: params.componentType,
        fieldType: params.fieldType,
        fieldName: params.fieldName,
        sourceText: zh,
        targetText: '',
        targetLocale: 'en',
        optionIndex: params.optionIndex
      });
    }

    // 缺少中文
    if (en && !zh) {
      zhMissingItems.push({
        id: `${params.id}_zh`,
        pageId: params.pageId,
        pageIndex: params.pageIndex,
        pageTitle: params.pageTitle,
        groupId: params.groupId,
        elementId: params.elementId,
        elementLabel: params.elementLabel,
        componentType: params.componentType,
        fieldType: params.fieldType,
        fieldName: params.fieldName,
        sourceText: en,
        targetText: '',
        targetLocale: 'zh',
        optionIndex: params.optionIndex
      });
    }
  }

  store.pages.forEach((page, pageIdx) => {
    // 排除系统固定预设核验页
    if (page.pageType === 'system_profile') return;

    const isRiskForm = isRisk.value;
    const defaultRiskTitle = store.currentLocale === 'en' ? 'Risk Assessment' : '风险评估';
    const pageTitle = (store.currentLocale === 'en' ? (page.title_en || (isRiskForm ? defaultRiskTitle : page.title)) : (page.title || (isRiskForm ? defaultRiskTitle : ''))) || (store.currentLocale === 'en' ? `Page ${pageIdx + 1}` : `第 ${pageIdx + 1} 页`);

    // 1. 页面标题 & 2. 页面描述 (风险评估表单使用系统固定规则，无需页面级标题和描述翻译)
    if (!isRiskForm) {
      registerItem({
        id: `${page.id}_title`,
        pageId: page.id,
        pageIndex: pageIdx,
        pageTitle,
        fieldType: 'page_title',
        fieldName: t('trans.pageTitle'),
        zhText: page.title,
        enText: page.title_en
      });

      registerItem({
        id: `${page.id}_desc`,
        pageId: page.id,
        pageIndex: pageIdx,
        pageTitle,
        fieldType: 'page_desc',
        fieldName: t('trans.pageDesc'),
        zhText: page.description,
        enText: page.description_en
      });
    }

    // 2.5 问题分组标题 (风险评估表单)
    if (page.groups && Array.isArray(page.groups)) {
      page.groups.forEach((group, gIdx) => {
        const gLabel = (store.currentLocale === 'en' ? (group.title_en || group.title) : (group.title || group.title_en)) || `Group ${gIdx + 1}`;
        registerItem({
          id: `${group.id}_title`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          groupId: group.id,
          fieldType: 'group_title',
          fieldName: `${t('trans.group')} ${String(gIdx + 1).padStart(2, '0')} · ${gLabel}`,
          zhText: group.title,
          enText: group.title_en
        });
      });
    }

    // 3. 页面内的各个字段
    page.fields?.forEach(element => {
      const elLabel = getFieldDisplayLabel(element, store.currentLocale || 'zh');

      // 字段标签 (如果展示标签)
      if (element.showLabel !== false) {
        registerItem({
          id: `${element.id}_label`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_label',
          fieldName: elLabel,
          zhText: element.label,
          enText: element.label_en
        });
      }

      // 提示区块专属：提示内容
      if (element.type === 'alert') {
        registerItem({
          id: `${element.id}_content`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_content',
          fieldName: `${elLabel} · ${t('trans.content')}`,
          zhText: element.content,
          enText: element.content_en
        });
      }

      // 输入提示 / 占位符 (提示区块无输入提示)
      if (element.type !== 'alert') {
        registerItem({
          id: `${element.id}_placeholder`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_placeholder',
          fieldName: `${elLabel} · ${t('trans.placeholder')}`,
          zhText: element.placeholder,
          enText: element.placeholder_en
        });
      }

      // 字段副标题 / 辅助说明 (提示区块无副标题)
      if (element.type !== 'alert') {
        registerItem({
          id: `${element.id}_help`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_help',
          fieldName: `${elLabel} · ${t('trans.helpText')}`,
          zhText: element.help,
          enText: element.help_en
        });
      }

      // 选项列表 (单选、多选、下拉、声明条款等；风险评估固定选项无需计入)
      if (!isRisk.value && element.options && Array.isArray(element.options)) {
        element.options.forEach((opt, optIdx) => {
          const optName = (store.currentLocale === 'en' ? (opt.label_en || opt.label) : (opt.label || opt.label_en)) || `${t('trans.option')} ${optIdx + 1}`;
          let zhText = opt.label;
          let enText = opt.label_en;
          // 若中文已被修改为具体业务词（非默认“选项一/选项1”），而英文仍然是默认虚拟占位符“Option N”，则英文判定为未翻译
          if (zhText && !/^选项[一二三四五六七八九十\d]+$/.test(zhText.trim()) && enText && /^Option\s*\d+$/i.test(enText.trim())) {
            enText = '';
          }
          // 反之，若英文已修改为具体业务词，而中文仍是默认虚拟占位符“选项N”，则中文判定为未翻译
          if (enText && !/^Option\s*\d+$/i.test(enText.trim()) && zhText && /^选项[一二三四五六七八九十\d]+$/.test(zhText.trim())) {
            zhText = '';
          }

          registerItem({
            id: `${element.id}_opt_${optIdx}`,
            pageId: page.id,
            pageIndex: pageIdx,
            pageTitle,
            elementId: element.id,
            elementLabel: elLabel,
            componentType: element.type,
            fieldType: 'field_option',
            fieldName: `${elLabel} · ${optName}`,
            zhText,
            enText,
            optionIndex: optIdx
          });
        });
      }
    });
  });

  const zhPercent = total === 0 ? 100 : Math.round((zhCompleted / total) * 100);
  const enPercent = total === 0 ? 100 : Math.round((enCompleted / total) * 100);

  // 根据当前语言智能决定优先呈现的缺失清单
  // 1. 中文模式：如果中文有缺失，优先呈现中文缺失项；若中文已满100%则呈现英文缺失项
  // 2. 英文模式：如果英文有缺失，优先呈现英文缺失项；若英文已满100%则呈现中文缺失项
  let currentUntranslatedItems: UntranslatedItem[] = [];
  if (store.currentLocale === 'zh') {
    currentUntranslatedItems = zhMissingItems.length > 0 ? zhMissingItems : enMissingItems;
  } else {
    currentUntranslatedItems = enMissingItems.length > 0 ? enMissingItems : zhMissingItems;
  }

  // 按页面分组
  const groupMap = new Map<string, PageTranslationGroup>();
  currentUntranslatedItems.forEach(item => {
    if (!groupMap.has(item.pageId)) {
      groupMap.set(item.pageId, {
        pageId: item.pageId,
        pageIndex: item.pageIndex,
        pageTitle: item.pageTitle,
        items: []
      });
    }
    groupMap.get(item.pageId)!.items.push(item);
  });

  const groupedByPage = Array.from(groupMap.values());

  return {
    total,
    zhCompleted,
    zhPercent,
    zhMissingCount: zhMissingItems.length,
    zhMissingItems,
    enCompleted,
    enPercent,
    enMissingCount: enMissingItems.length,
    enMissingItems,
    untranslatedCount: currentUntranslatedItems.length,
    untranslatedItems: currentUntranslatedItems,
    groupedByPage
  };
}

/**
 * 响应式计算属性
 */
export const translationStats = computed(() => calculateTranslationStats());

/**
 * 一键点击定位：聚焦画布页面、选中目标组件/画板、切至缺失语言模式并在右侧展开对应属性
 */
export function navigateToUntranslatedItem(item: UntranslatedItem) {
  // 1. 自动切换至缺失语言模式以便立即编辑该语言
  store.currentLocale = item.targetLocale || 'en';

  // 2. 镜头平滑居中聚焦目标画板
  focusOnPage(item.pageId, { duration: 400 });

  // 3. 选中画板、问题分组或组件
  if (item.groupId) {
    selectGroup(item.groupId);
    setTimeout(() => {
      document.getElementById('group-prop-title-input')?.focus();
    }, 100);
  } else if (!item.elementId) {
    // 页面级别 (标题或描述)
    selectPage(item.pageId);
    store.focusedTarget = {
      elementId: item.pageId,
      field: item.fieldType === 'page_title' ? 'label' : 'help'
    };
  } else {
    // 组件字段级别
    const page = store.pages.find(p => p.id === item.pageId);
    const element = page?.fields.find(f => f.id === item.elementId);
    if (element) {
      selectElement(element);
      store.focusedTarget = {
        elementId: element.id,
        field: item.fieldType === 'field_label' ? 'label'
             : item.fieldType === 'field_placeholder' ? 'placeholder'
             : item.fieldType === 'field_help' ? 'help'
             : item.fieldType === 'field_content' ? 'content'
             : 'option',
        optionIndex: item.optionIndex
      };
    }
  }

  // 4. 确保右侧属性面板已展开
  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }
}
