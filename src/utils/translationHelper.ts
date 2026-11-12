import { computed } from 'vue';
import { store, isRisk, primaryLocale, targetLocales, selectPage, selectElement, selectGroup, focusOnPage, resetCanvasView, highlightPropertyField } from '@/core/store';
import { componentRegistry } from '@/registry/components';
import { t, TRADITIONAL_LOCALE, getPageText, getGroupText, getFieldText, getOptionLabel } from '@/core/i18n';

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
  targetLocale: string; // 哪种语言缺失了
  optionIndex?: number;
}

export interface PageTranslationGroup {
  pageId: string;
  pageIndex: number;
  pageTitle: string;
  items: UntranslatedItem[];
}

export interface LocaleStatEntry {
  locale: string;
  completed: number;
  percent: number;
  missingCount: number;
  missingItems: UntranslatedItem[];
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
  localeStats: Record<string, LocaleStatEntry>;
  untranslatedCount: number;
  untranslatedItems: UntranslatedItem[];
  groupedByPage: PageTranslationGroup[];
  pageTotals: Record<string, number>;
}

/**
 * 获取字段用于展示的可读标签
 */
function getFieldDisplayLabel(element: any, locale: string): string {
  const primary = getFieldText(element, 'label', locale)?.trim();
  const base = getFieldText(element, 'label', primaryLocale.value)?.trim();
  if (primary) return primary;
  if (base) return base;
  const meta = componentRegistry[element.type as keyof typeof componentRegistry];
  if (meta) {
    return getFieldText(meta, 'label', store.currentLocale) || t('trans.fieldDefault');
  }
  return t('trans.fieldDefault');
}

export function isDefaultOptionPlaceholder(val: string, loc: string): boolean {
  const trimmed = (val || '').trim();
  if (!trimmed) return true;
  if (loc === 'en' || loc === 'ms') return /^Option\s*\d+$/i.test(trimmed);
  if (loc === 'zh' || loc === TRADITIONAL_LOCALE) return /^(?:选项|選項)[一二三四五六七八九十\d]+$/.test(trimmed);
  return false;
}

export function isOptionTranslated(opt: any, targetLoc: string, baseLoc: string): boolean {
  const raw = (getOptionLabel(opt, targetLoc) || '').trim();
  if (!raw) return false;
  const baseOptText = (getOptionLabel(opt, baseLoc) || '').trim();
  const isBaseCustomized = Boolean(baseOptText && !isDefaultOptionPlaceholder(baseOptText, baseLoc));
  if (targetLoc !== baseLoc && isBaseCustomized && isDefaultOptionPlaceholder(raw, targetLoc)) {
    return false;
  }
  return true;
}

/**
 * 计算表单中所有可翻译文案的多语言翻译进度及缺失清单
 */
export function calculateTranslationStats(): TranslationStats {
  const baseLoc = primaryLocale.value;
  const allLocales = Array.from(new Set([baseLoc, ...targetLocales.value, 'zh', 'en']));
  const localeStats: Record<string, LocaleStatEntry> = {};
  for (const loc of allLocales) {
    localeStats[loc] = {
      locale: loc,
      completed: 0,
      percent: 100,
      missingCount: 0,
      missingItems: []
    };
  }

  let total = 0;
  const pageTotals: Record<string, number> = {};

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
    getTextByLocale: (loc: string) => string;
    optionIndex?: number;
  }) {
    const texts: Record<string, string> = {};
    let hasAnyText = false;
    for (const loc of allLocales) {
      const v = (params.getTextByLocale(loc) || '').trim();
      texts[loc] = v;
      if (v) hasAnyText = true;
    }

    if (!hasAnyText) return;

    // 若为副标题/帮助说明，且源基准语言并未配置该文案，则无需列入翻译指标考核与待办清单
    if ((params.fieldType === 'field_help' || params.fieldType === 'page_desc') && !texts[baseLoc]) {
      return;
    }

    total++;
    pageTotals[params.pageId] = (pageTotals[params.pageId] || 0) + 1;
    const sourceText = texts[baseLoc] || texts.zh || texts.en || Object.values(texts).find(Boolean) || '';

    for (const loc of allLocales) {
      const entry = localeStats[loc];
      if (texts[loc]) {
        entry.completed++;
      } else {
        entry.missingItems.push({
          id: `${params.id}_${loc}`,
          pageId: params.pageId,
          pageIndex: params.pageIndex,
          pageTitle: params.pageTitle,
          groupId: params.groupId,
          elementId: params.elementId,
          elementLabel: params.elementLabel,
          componentType: params.componentType,
          fieldType: params.fieldType,
          fieldName: params.fieldName,
          sourceText,
          targetText: '',
          targetLocale: loc,
          optionIndex: params.optionIndex
        });
      }
    }
  }

  let translatablePageCounter = 0;
  store.pages.forEach((page) => {
    if (page.pageType === 'system_profile') return;
    const pageIdx = translatablePageCounter++;

    const isRiskForm = isRisk.value;
    const defaultRiskTitle = store.currentLocale === 'en' ? 'Risk Assessment' : '风险评估';
    const pageTitle = getPageText(page, 'title', baseLoc, true) || (isRiskForm ? defaultRiskTitle : '') || (store.currentLocale === 'en' ? `Page ${pageIdx + 1}` : `第 ${pageIdx + 1} 页`);

    if (!isRiskForm) {
      registerItem({
        id: `${page.id}_title`,
        pageId: page.id,
        pageIndex: pageIdx,
        pageTitle,
        fieldType: 'page_title',
        fieldName: t('trans.pageTitle'),
        getTextByLocale: loc => getPageText(page, 'title', loc)
      });

      registerItem({
        id: `${page.id}_desc`,
        pageId: page.id,
        pageIndex: pageIdx,
        pageTitle,
        fieldType: 'page_desc',
        fieldName: t('trans.pageDesc'),
        getTextByLocale: loc => getPageText(page, 'description', loc)
      });
    }

    if (page.groups && Array.isArray(page.groups)) {
      page.groups.forEach((group, gIdx) => {
        const gLabel = getGroupText(group, 'title', baseLoc, true) || `Group ${gIdx + 1}`;
        registerItem({
          id: `${group.id}_title`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          groupId: group.id,
          fieldType: 'group_title',
          fieldName: `${t('trans.group')} ${String(gIdx + 1).padStart(2, '0')} · ${gLabel}`,
          getTextByLocale: loc => getGroupText(group, 'title', loc)
        });
      });
    }

    page.fields?.forEach(element => {
      const elLabel = getFieldDisplayLabel(element, baseLoc);

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
          getTextByLocale: loc => getFieldText(element, 'label', loc)
        });
      }

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
          getTextByLocale: loc => getFieldText(element, 'content', loc)
        });
      }

      const supportsPlaceholder =
        ['input', 'textarea', 'select', 'country', 'nationality', 'email', 'signature'].includes(element.type) ||
        (element.type === 'date' && !element.defaultLongTerm);

      if (supportsPlaceholder) {
        registerItem({
          id: `${element.id}_placeholder`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_placeholder',
          fieldName: `${elLabel} · ${element.type === 'signature' ? t('trans.sigPromptLabel') : (element.type === 'date' && element.dateMode === 'range' ? t('trans.startDatePlaceholder') : t('trans.placeholder'))}`,
          getTextByLocale: loc => getFieldText(element, 'placeholder', loc)
        });
      }

      if (element.type === 'date' && element.dateMode === 'range') {
        registerItem({
          id: `${element.id}_endPlaceholder`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_placeholder',
          fieldName: `${elLabel} · ${t('trans.endDatePlaceholder')}`,
          getTextByLocale: loc => getFieldText(element, 'endPlaceholder', loc)
        });
      }

      if (element.type === 'date' && element.enableLongTerm) {
        registerItem({
          id: `${element.id}_longTermText`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_placeholder',
          fieldName: `${elLabel} · ${t('trans.longTermOptionLabel')}`,
          getTextByLocale: loc => getFieldText(element, 'longTermText', loc)
        });
      }

      if (element.type === 'signature') {
        registerItem({
          id: `${element.id}_signPlaceholder`,
          pageId: page.id,
          pageIndex: pageIdx,
          pageTitle,
          elementId: element.id,
          elementLabel: elLabel,
          componentType: element.type,
          fieldType: 'field_placeholder',
          fieldName: `${elLabel} · ${t('trans.signWatermarkLabel')}`,
          getTextByLocale: loc => getFieldText(element, 'signPlaceholder', loc)
        });
      }

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
          getTextByLocale: loc => getFieldText(element, 'help', loc)
        });
      }

      if (!isRisk.value && element.options && Array.isArray(element.options)) {
        element.options.forEach((opt, optIdx) => {
          const baseOptText = getOptionLabel(opt, baseLoc);
          const isBaseCustomized = Boolean(baseOptText && !isDefaultOptionPlaceholder(baseOptText, baseLoc));
          const optName = baseOptText || getOptionLabel(opt, baseLoc, true) || `${t('trans.option')} ${optIdx + 1}`;

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
            getTextByLocale: loc => {
              const raw = getOptionLabel(opt, loc);
              if (!raw) return '';
              if (loc !== baseLoc && isBaseCustomized && isDefaultOptionPlaceholder(raw, loc)) {
                return '';
              }
              return raw;
            },
            optionIndex: optIdx
          });
        });
      }
    });
  });

  for (const loc of allLocales) {
    const entry = localeStats[loc];
    entry.missingCount = entry.missingItems.length;
    entry.percent = total === 0 ? 100 : Math.round((entry.completed / total) * 100);
  }

  const zhEntry = localeStats.zh;
  const enEntry = localeStats.en;

  const activeTarget = store.activeTargetLocale || (baseLoc === 'zh' ? 'en' : 'zh');
  let currentUntranslatedItems: UntranslatedItem[] = [];
  if (targetLocales.value.length > 0) {
    const activeEntry = localeStats[activeTarget];
    if (activeEntry && activeEntry.missingItems.length > 0) {
      currentUntranslatedItems = activeEntry.missingItems;
    } else {
      for (const tLoc of targetLocales.value) {
        if (localeStats[tLoc]?.missingItems.length) {
          currentUntranslatedItems = localeStats[tLoc].missingItems;
          break;
        }
      }
      if (currentUntranslatedItems.length === 0 && localeStats[baseLoc]?.missingItems.length) {
        currentUntranslatedItems = localeStats[baseLoc].missingItems;
      }
    }
  } else {
    currentUntranslatedItems = localeStats[baseLoc]?.missingItems || [];
  }

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
    zhCompleted: zhEntry.completed,
    zhPercent: zhEntry.percent,
    zhMissingCount: zhEntry.missingCount,
    zhMissingItems: zhEntry.missingItems,
    enCompleted: enEntry.completed,
    enPercent: enEntry.percent,
    enMissingCount: enEntry.missingCount,
    enMissingItems: enEntry.missingItems,
    localeStats,
    untranslatedCount: currentUntranslatedItems.length,
    untranslatedItems: currentUntranslatedItems,
    groupedByPage,
    pageTotals
  };
}

/**
 * 响应式计算属性
 */
export const translationStats = computed(() => calculateTranslationStats());

/**
 * 计算单个页面的翻译完成度百分比 (0 - 100)
 */
export function getPageTranslationProgress(pageId: string, locale?: string): number {
  const activeLoc = locale || store.activeTargetLocale || 'en';
  const entry = translationStats.value.localeStats?.[activeLoc];
  const pageTotal = translationStats.value.pageTotals?.[pageId] || 0;
  if (!entry || pageTotal === 0) return 100;
  const missingInPage = entry.missingItems.filter(item => item.pageId === pageId).length;
  if (missingInPage === 0) return 100;
  const completed = Math.max(0, pageTotal - missingInPage);
  return Math.round((completed / pageTotal) * 100);
}

/**
 * 一键点击定位：聚焦画布页面（源画板或右侧多语言画板）、选中目标组件/画板，绝不篡改平台 UI 语言 store.currentLocale
 */
export function navigateToUntranslatedItem(item: UntranslatedItem) {
  const targetLoc = item.targetLocale || store.activeTargetLocale || 'en';
  const isTargetFrame = targetLoc !== primaryLocale.value;
  const pageChanged = store.activePageId !== item.pageId;
  const modeChanged = isTargetFrame && store.workspaceMode !== 'translation';

  if (isTargetFrame) {
    store.activeTargetLocale = targetLoc;
    store.workspaceMode = 'translation';
    store.sidebarTab = 'languages';
  }
  store.editingLocale = targetLoc;
  store.activePageId = item.pageId;

  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }

  if (store.workspaceMode !== 'translation') {
    focusOnPage(item.pageId, { duration: 400 });
  } else if (pageChanged || modeChanged) {
    setTimeout(() => {
      resetCanvasView({ duration: 280 });
    }, 20);
  }

  if (item.groupId) {
    selectGroup(item.groupId);
    store.focusedTarget = {
      elementId: item.groupId,
      field: 'title'
    };
    highlightPropertyField('title');
  } else if (!item.elementId) {
    selectPage(item.pageId);
    const pageField = item.fieldType === 'page_title' ? 'title' : 'description';
    store.focusedTarget = {
      elementId: item.pageId,
      field: pageField
    };
    highlightPropertyField(pageField);
  } else {
    const page = store.pages.find(p => p.id === item.pageId);
    const element = page?.fields.find(f => f.id === item.elementId);
    if (element) {
      selectElement(element);
      const targetField =
        item.fieldType === 'field_label' ? 'label'
        : item.fieldType === 'field_placeholder' ? 'placeholder'
        : item.fieldType === 'field_help' ? 'help'
        : item.fieldType === 'field_content' ? 'content'
        : 'option';
      store.focusedTarget = {
        elementId: element.id,
        field: targetField,
        optionIndex: item.optionIndex
      };
      highlightPropertyField(targetField, item.optionIndex);
    }
  }
}
