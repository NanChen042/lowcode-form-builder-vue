import { reactive, computed, toRaw, watch } from 'vue';
import type {
  FormSchema,
  FormPage,
  FormElement,
  FormQuestionGroup,
  ComponentType,
  CanvasState,
  ProfileType
} from '../types/schema';
import { componentRegistry } from '../registry/components';
import {
  createBlankTemplate,
  createRiskAssessmentTemplate,
  RISK_FIXED_OPTIONS,
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate
} from '../templates/recommend';

export const PAGE_WIDTH = 390;
export const TRANSLATION_FRAME_GAP = 64;
export const TRANSLATION_RISK_PAGE_WIDTH = 540;

export function getTranslationPageWidth(): number {
  return isRisk.value ? TRANSLATION_RISK_PAGE_WIDTH : PAGE_WIDTH;
}

export function getPagePairWidth(_page?: FormPage): number {
  return getPageWidth();
}
export const PAGE_HEIGHT = 720;
export const PAGE_GAP = 160;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1.6;

export interface FocusedTarget {
  elementId: string;
  field:
    | 'label'
    | 'placeholder'
    | 'help'
    | 'option'
    | 'title'
    | 'description'
    | 'default'
    | 'content'
    | 'signPlaceholder'
    | 'endPlaceholder'
    | 'longTermText'
    | 'customErrorMessage'
    | 'declarationErrorMessage';
  optionIndex?: number;
}

function getInitialLocale(): 'zh' | 'en' {
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang')?.toLowerCase();
      if (langParam === 'en' || langParam === 'zh') {
        return langParam;
      }
      const cached = localStorage.getItem('builder_current_locale') || localStorage.getItem('lowcode_current_locale');
      if (cached === 'en' || cached === 'zh') {
        return cached;
      }
    } catch (_) {}
  }
  return 'zh';
}

export const store = reactive({
  uniqueIdCounter: 1,

  meta: {
    title: '未命名表单',
    title_en: '',
    description: '',
    description_en: '',
    profileType: 'customer' as ProfileType,
    baseLocale: '' as string,
    enabledLocales: undefined as string[] | undefined,
    i18n: undefined as Record<string, Record<string, string>> | undefined,
    source: 'diy' as 'template' | 'diy',
    templateKey: '' as string,
    formId: '' as string,
    serialNo: '' as string,
    createdAt: 0 as number
  },

  pages: [] as FormPage[],

  selectedType: null as 'element' | 'page' | 'group' | null,
  selectedId: null as string | null,
  activePageId: null as string | null,
  activeGroupId: null as string | null,

  canvasState: {
    x: 320,
    y: 160,
    scale: 1
  } as CanvasState,

  isPanning: false,
  isSpacePressed: false,
  isDraggingComponent: false,
  isDraggingFrame: false,
  draggedFrameId: null as string | null,
  isCanvasAnimating: false,
  isCanvasLoading: false,

  focusedTarget: null as FocusedTarget | null,

  activeTemplateKey: 'blank',
  isDirty: false,
  lastSavedHash: '',
  lastSavedTime: '',

  leftSidebarVisible: true,
  rightSidebarVisible: true,
  leftSidebarWidth: 320,
  rightSidebarWidth: 300,
  sidebarTab: 'components' as 'components' | 'templates' | 'pages' | 'languages',

  activeTargetLocale: 'en' as string,
  editingLocale: '' as string,
  previewLocale: '' as string,
  workspaceMode: 'builder' as 'builder' | 'translation',

  currentLocale: getInitialLocale() as 'zh' | 'en',

  user: {
    isLoggedIn: false,
    token: '',
    uid: 0,
    nickname: '',
    avatar: '',
    email: '',
    role: ''
  },
  org: {
    orgId: 0,
    companyName: ''
  },

  lockedProfileType: null as ProfileType | null,
  editorMode: 'standard' as 'standard' | 'risk',
  riskPageWidth: 860,
  isRiskPageWidthCustomized: false
});

export const DEFAULT_RISK_PAGE_RATIO = 0.82;

export function getMiddleCanvasWidth(): number {
  if (typeof window === 'undefined') return 1200;
  if (typeof document !== 'undefined') {
    const canvasEl = document.getElementById('tour-canvas-area');
    if (canvasEl && canvasEl.clientWidth > 0) {
      return canvasEl.clientWidth;
    }
  }
  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  return Math.max(360, window.innerWidth - leftWidth - rightWidth);
}

export function calculateDefaultRiskPageWidth(): number {
  const middleWidth = getMiddleCanvasWidth();
  const maxSafeWidth = Math.max(440, middleWidth - 56);
  return Math.min(1160, maxSafeWidth, Math.max(440, Math.round(middleWidth * DEFAULT_RISK_PAGE_RATIO)));
}

export const isRisk = computed<boolean>(() => store.editorMode === 'risk');

export function getPageWidth(): number {
  if (isRisk.value) {
    if (!store.isRiskPageWidthCustomized && typeof window !== 'undefined') {
      const calculated = calculateDefaultRiskPageWidth();
      if (store.riskPageWidth !== calculated) {
        store.riskPageWidth = calculated;
      }
      return calculated;
    }
    return store.riskPageWidth || calculateDefaultRiskPageWidth();
  }
  return PAGE_WIDTH;
}

export function findElementById(elements: FormElement[], id: string): FormElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
  }
  return null;
}

export function findElementParentAndIndex(
  elements: FormElement[],
  id: string
): { parentArray: FormElement[]; index: number } | null {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) {
      return { parentArray: elements, index: i };
    }
  }
  return null;
}

export const selectedElement = computed<FormElement | null>(() => {
  if (store.selectedType !== 'element' || !store.selectedId) return null;
  for (const page of store.pages) {
    const found = findElementById(page.fields, store.selectedId);
    if (found) return found;
  }
  return null;
});

export const selectedPage = computed<FormPage | null>(() => {
  if (store.selectedType !== 'page' || !store.selectedId) return null;
  return store.pages.find(p => p.id === store.selectedId) || null;
});

export const selectedGroup = computed<FormQuestionGroup | null>(() => {
  if (store.selectedType !== 'group' || !store.selectedId) return null;
  for (const page of store.pages) {
    const g = page.groups?.find(grp => grp.id === store.selectedId);
    if (g) return g;
  }
  return null;
});

export function getUniqueId(): number {
  return store.uniqueIdCounter++;
}

export function makeFieldKey(type: ComponentType, id: string): string {
  return `${type}_${String(id).replace('cmp_', '')}`;
}

export function selectElement(el: FormElement | string | null) {
  if (!el) {
    clearSelection();
    return;
  }
  const targetId = typeof el === 'string' ? el : el.id;
  store.selectedType = 'element';
  store.selectedId = targetId;

  // 联动更新激活画板：找到该元素所在的画板并提升层级
  for (const page of store.pages) {
    const found = findElementById(page.fields, targetId);
    if (found) {
      store.activePageId = page.id;
      if (found.groupId) {
        store.activeGroupId = found.groupId;
      }
      break;
    }
  }

  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }
}

export function selectPage(pageId: string) {
  store.selectedType = 'page';
  store.selectedId = pageId;
  store.activePageId = pageId;
  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }
  if (store.workspaceMode === 'translation') {
    syncTranslationUrlParams();
  }
}

export function selectGroup(groupId: string) {
  store.selectedType = 'group';
  store.selectedId = groupId;
  store.activeGroupId = groupId;
  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }
}

export function clearSelection() {
  store.selectedType = null;
  store.selectedId = null;
  store.focusedTarget = null;
}

export function createElement(type: ComponentType, groupId?: string): FormElement {
  const meta = componentRegistry[type];
  const id = `cmp_${getUniqueId()}`;
  const defaultData = meta ? meta.defaultData() : {};

  if (isRisk.value) {
    return {
      id,
      type: 'radio',
      key: makeFieldKey('radio', id),
      required: true,
      showLabel: true,
      layout: 'inline',
      weight: 1,
      groupId,
      label: '',
      label_en: '',
      options: RISK_FIXED_OPTIONS.map(o => ({ ...o }))
    };
  }

  return {
    id,
    type,
    key: makeFieldKey(type, id),
    required: true,
    showLabel: true,
    helpPosition: 'right',
    ...defaultData,
    label: '',
    label_en: '',
    options: defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined
  };
}

export function addQuestionGroup(afterGroupId?: string, insertIndexOverride?: number): FormQuestionGroup | null {
  const page = store.pages[0];
  if (!page) return null;
  if (!page.groups) page.groups = [];
  const newId = `grp_${Date.now()}_${getUniqueId()}`;
  const newGroup: FormQuestionGroup = {
    id: newId,
    title: '',
    title_en: ''
  };
  let insertIdx = page.groups.length;
  if (typeof insertIndexOverride === 'number') {
    insertIdx = Math.max(0, Math.min(insertIndexOverride, page.groups.length));
  } else if (afterGroupId) {
    const foundIdx = page.groups.findIndex(g => g.id === afterGroupId);
    if (foundIdx !== -1) insertIdx = foundIdx + 1;
  }
  page.groups.splice(insertIdx, 0, newGroup);
  const firstQuestion = createElement('radio', newId);
  page.fields.push(firstQuestion);
  const groupOrder = page.groups.map(g => g.id);
  const groupedFields = groupOrder.flatMap(gId => page.fields.filter(f => f.groupId === gId));
  const leftoverFields = page.fields.filter(f => !f.groupId || !groupOrder.includes(f.groupId));
  page.fields = [...groupedFields, ...leftoverFields];
  selectGroup(newId);
  markDirty();
  return newGroup;
}

export function deleteQuestionGroup(groupId: string): boolean {
  const page = store.pages[0];
  if (!page || !page.groups || page.groups.length <= 1) return false;
  const idx = page.groups.findIndex(g => g.id === groupId);
  if (idx === -1) return false;
  page.groups.splice(idx, 1);
  const deletedFieldIds = new Set(page.fields.filter(f => f.groupId === groupId).map(f => f.id));
  page.fields = page.fields.filter(f => f.groupId !== groupId);
  if (store.selectedId && (store.selectedId === groupId || deletedFieldIds.has(store.selectedId))) {
    clearSelection();
  }
  if (store.activeGroupId === groupId) {
    store.activeGroupId = page.groups[0]?.id || null;
  }
  markDirty();
  return true;
}

export function moveQuestionGroup(groupId: string, direction: 'up' | 'down') {
  const page = store.pages[0];
  if (!page || !page.groups) return;
  const idx = page.groups.findIndex(g => g.id === groupId);
  if (idx === -1) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= page.groups.length) return;
  const [moved] = page.groups.splice(idx, 1);
  page.groups.splice(targetIdx, 0, moved);
  const groupOrder = page.groups.map(g => g.id);
  const groupedFields = groupOrder.flatMap(gId => page.fields.filter(f => f.groupId === gId));
  const leftoverFields = page.fields.filter(f => !f.groupId || !groupOrder.includes(f.groupId));
  page.fields = [...groupedFields, ...leftoverFields];
  markDirty();
}

export function addElement(type: ComponentType, targetPageId?: string, targetGroupId?: string, insertAfterElementId?: string) {
  if (store.pages.length === 0) {
    addPage();
  }

  if (isRisk.value) {
    const page = store.pages[0];
    if (!page) return;
    if (!page.groups || page.groups.length === 0) {
      page.groups = [
        { id: 'grp_risk_1', title: '', title_en: '' }
      ];
    }
    const resolvedGroupId =
      targetGroupId ||
      (selectedElement.value && store.selectedType === 'element' ? selectedElement.value.groupId : undefined) ||
      store.activeGroupId ||
      page.groups[0].id;
    const newEl = createElement('radio', resolvedGroupId);

    const targetAfterId = insertAfterElementId || (!targetGroupId && selectedElement.value && store.selectedType === 'element' && selectedElement.value.groupId === resolvedGroupId ? selectedElement.value.id : undefined);

    if (targetAfterId) {
      const searchRes = findElementParentAndIndex(page.fields, targetAfterId);
      if (searchRes) {
        newEl.groupId = page.fields[searchRes.index].groupId || resolvedGroupId;
        searchRes.parentArray.splice(searchRes.index + 1, 0, newEl);
        store.activePageId = page.id;
        store.activeGroupId = newEl.groupId;
        selectElement(newEl);
        markDirty();
        return;
      }
    }

    let lastGroupItemIdx = -1;
    for (let i = page.fields.length - 1; i >= 0; i--) {
      if (page.fields[i].groupId === resolvedGroupId) {
        lastGroupItemIdx = i;
        break;
      }
    }
    if (lastGroupItemIdx !== -1) {
      page.fields.splice(lastGroupItemIdx + 1, 0, newEl);
    } else {
      page.fields.push(newEl);
      const groupOrder = page.groups.map(g => g.id);
      const groupedFields = groupOrder.flatMap(gId => page.fields.filter(f => f.groupId === gId));
      const leftoverFields = page.fields.filter(f => !f.groupId || !groupOrder.includes(f.groupId));
      page.fields = [...groupedFields, ...leftoverFields];
    }
    store.activePageId = page.id;
    store.activeGroupId = resolvedGroupId;
    selectElement(newEl);
    markDirty();
    return;
  }

  let resolvedPageId = targetPageId;
  if (!resolvedPageId) {
    if (store.selectedType === 'page' && store.selectedId) {
      resolvedPageId = store.selectedId;
    } else if (store.activePageId) {
      resolvedPageId = store.activePageId;
    }
  }

  let page = resolvedPageId ? store.pages.find(p => p.id === resolvedPageId) : null;

  if (!page || page.pageType === 'system_profile' || store.pages[0]?.id === page.id) {
    let formPage = store.pages.find(p => p.pageType !== 'system_profile' && p.id !== store.pages[0]?.id);
    if (!formPage) {
      addPage(undefined, { focus: false });
      formPage = store.pages.find(p => p.pageType !== 'system_profile' && p.id !== store.pages[0]?.id)
        || store.pages[store.pages.length - 1];
    }
    page = formPage;
  }

  if (!page) return;

  const newEl = createElement(type);

  if (selectedElement.value && store.selectedType === 'element') {
    for (const p of store.pages) {
      if (p.pageType === 'system_profile') continue;
      if (page && p.id !== page.id) continue;

      const searchRes = findElementParentAndIndex(p.fields, selectedElement.value.id);
      if (searchRes) {
        const descendantKeys = new Set<string>([selectedElement.value.key]);
        let insertIdx = searchRes.index + 1;
        while (insertIdx < searchRes.parentArray.length) {
          const next = searchRes.parentArray[insertIdx];
          if (next?.linkage?.conditions?.some(c => descendantKeys.has(c.fieldKey))) {
            if (next.key) descendantKeys.add(next.key);
            insertIdx++;
          } else {
            break;
          }
        }
        searchRes.parentArray.splice(insertIdx, 0, newEl);
        store.activePageId = p.id;
        selectElement(newEl);
        markDirty();
        return;
      }
    }
  }

  page.fields.push(newEl);
  store.activePageId = page.id;
  selectElement(newEl);
  markDirty();
}

export function duplicateElement(elementId: string) {
  for (const page of store.pages) {
    const res = findElementParentAndIndex(page.fields, elementId);
    if (res) {
      const original = res.parentArray[res.index];
      const cloneObj: FormElement = JSON.parse(JSON.stringify(toRaw(original)));

      const newParentId = `cmp_${getUniqueId()}`;
      cloneObj.id = newParentId;
      cloneObj.key = makeFieldKey(cloneObj.type, newParentId);
      if (isRisk.value) {
        cloneObj.groupId = original.groupId || page.groups?.[0]?.id || 'grp_risk_1';
        delete cloneObj.defaultValue;
        cloneObj.type = 'radio';
        cloneObj.options = RISK_FIXED_OPTIONS.map(o => ({ ...o }));
      }

      // 检查原组件名下是否有紧随其后的从属联动子组件（含多级嵌套），若有则打包一同复制并重映射依赖目标
      const clonedChildren: FormElement[] = [];
      const keyMap: Record<string, string> = { [original.key]: cloneObj.key };
      let insertIdx = res.index + 1;
      while (insertIdx < res.parentArray.length) {
        const childOriginal = res.parentArray[insertIdx];
        if (childOriginal?.linkage?.conditions?.some(c => Boolean(keyMap[c.fieldKey]))) {
          const childClone: FormElement = JSON.parse(JSON.stringify(toRaw(childOriginal)));
          const newChildId = `cmp_${getUniqueId()}`;
          childClone.id = newChildId;
          childClone.key = makeFieldKey(childClone.type, newChildId);
          keyMap[childOriginal.key] = childClone.key;
          if (childClone.linkage?.conditions) {
            childClone.linkage.conditions = childClone.linkage.conditions.map(c => ({
              fieldKey: keyMap[c.fieldKey] || c.fieldKey,
              value: c.value
            }));
          }
          clonedChildren.push(childClone);
          insertIdx++;
        } else {
          break;
        }
      }

      // 整组整体插入到原组件及其全部从属子项的下方
      res.parentArray.splice(insertIdx, 0, cloneObj, ...clonedChildren);
      selectElement(cloneObj);
      markDirty();
      return;
    }
  }
}

export function deleteElement(elementId: string) {
  for (const page of store.pages) {
    const res = findElementParentAndIndex(page.fields, elementId);
    if (res) {
      const original = res.parentArray[res.index];
      const idsToDelete = new Set<string>([elementId]);
      const keysToDelete = new Set<string>();
      if (original?.key) {
        keysToDelete.add(original.key);
      }

      // 级联查找完全依附于该父组件（及多级从属）的联动子项一并删除；若子项还关联了其他未删除的父组件，则仅移除已删父组件条件
      let foundMore = true;
      while (foundMore) {
        foundMore = false;
        for (const f of page.fields) {
          if (!idsToDelete.has(f.id) && f.linkage?.conditions?.length) {
            const allParentsDeleted = f.linkage.conditions.every(c => keysToDelete.has(c.fieldKey));
            if (allParentsDeleted) {
              idsToDelete.add(f.id);
              if (f.key) keysToDelete.add(f.key);
              foundMore = true;
            }
          }
        }
      }

      for (const f of page.fields) {
        if (!idsToDelete.has(f.id) && f.linkage?.conditions?.length) {
          f.linkage.conditions = f.linkage.conditions.filter(c => !keysToDelete.has(c.fieldKey));
          if (f.linkage.conditions.length === 0) {
            delete f.linkage;
          }
        }
      }

      // 若当前选中的组件是要被删除的目标或其子项，清空选中态
      if (store.selectedId && idsToDelete.has(store.selectedId)) {
        clearSelection();
      }

      // 从页面字段中彻底级联移除整组节点
      page.fields = page.fields.filter(f => !idsToDelete.has(f.id));
      markDirty();
      return;
    }
  }
}

export function toChineseNum(num: number): string {
  const cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return cnNums[num] || String(num);
  if (num < 20) {
    const unit = num % 10;
    return `十${unit > 0 ? cnNums[unit] : ''}`;
  }
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const rem = num % 10;
    return `${cnNums[tens]}十${rem > 0 ? cnNums[rem] : ''}`;
  }
  return String(num);
}

export function addPage(afterPageId?: string | null, options: { focus?: boolean } = {}) {
  if (isRisk.value && store.pages.length >= 1) {
    return store.pages[0];
  }
  const isFirst = store.pages.length === 0;
  const newId = `page_${Date.now()}_${getUniqueId()}`;
  let insertIndex = store.pages.length;
  let x = 0;
  let y = 0;

  if (!isFirst) {
    if (afterPageId) {
      const foundIdx = store.pages.findIndex(p => p.id === afterPageId);
      if (foundIdx !== -1) insertIndex = foundIdx + 1;
    }
    const prevPage = store.pages[insertIndex - 1] || store.pages[store.pages.length - 1];
    if (prevPage) {
      x = prevPage.x + PAGE_WIDTH + PAGE_GAP;
      y = prevPage.y;
    }
  }

  const newPage: FormPage = {
    id: newId,
    pageType: 'form',
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    fields: [],
    x,
    y
  };

  store.pages.splice(insertIndex, 0, newPage);


  for (let i = insertIndex + 1; i < store.pages.length; i++) {
    store.pages[i].x = store.pages[i - 1].x + PAGE_WIDTH + PAGE_GAP;
  }

  if (options.focus !== false) {
    selectPage(newId);
    focusOnPage(newId);
  }

  markDirty();
  return newPage;
}

export function deletePage(pageId: string) {
  if (isRisk.value) return;
  const idx = store.pages.findIndex(p => p.id === pageId);
  if (idx === -1) return;

  // 第一页不允许删除（保护第一页为默认通用画布）
  if (idx === 0) return;

  if (store.selectedId === pageId) {
    clearSelection();
  }

  store.pages.splice(idx, 1);


  for (let i = idx; i < store.pages.length; i++) {
    store.pages[i].x = store.pages[i - 1].x + PAGE_WIDTH + PAGE_GAP;
  }

  if (store.pages.length > 0) {
    const targetIdx = Math.max(0, idx - 1);
    focusOnPage(store.pages[targetIdx].id);
    selectPage(store.pages[targetIdx].id);
  } else {
    clearSelection();
    store.canvasState.x = 0;
    store.canvasState.y = 0;
    store.canvasState.scale = 1;
  }

  markDirty();
}

export function updatePageFields(pageId: string, fields: FormElement[]) {
  const target = store.pages.find(p => p.id === pageId);
  if (target) {
    target.fields = fields;
    markDirty();
  }
}

export function updatePageGroups(pageId: string, groups: FormQuestionGroup[]) {
  const target = store.pages.find(p => p.id === pageId);
  if (target) {
    target.groups = groups;
    markDirty();
  }
}

export function setPagePosition(pageId: string, pos: { x?: number; y?: number }) {
  const target = store.pages.find(p => p.id === pageId);
  if (target) {
    if (pos.x !== undefined) target.x = pos.x;
    if (pos.y !== undefined) target.y = pos.y;
    markDirty();
  }
}

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function adjustZoom(delta: number, clientX?: number, clientY?: number, viewportRect?: DOMRect) {
  const oldScale = store.canvasState.scale;
  const nextScale = clampScale(oldScale + delta);
  if (nextScale === oldScale) return;

  if (clientX !== undefined && clientY !== undefined && viewportRect) {
    const pointerX = clientX - viewportRect.left;
    const pointerY = clientY - viewportRect.top;
    const worldX = (pointerX - store.canvasState.x) / oldScale;
    const worldY = (pointerY - store.canvasState.y) / oldScale;

    store.canvasState.scale = nextScale;
    store.canvasState.x = pointerX - worldX * nextScale;
    store.canvasState.y = pointerY - worldY * nextScale;
  } else {
    const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
    const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
    const viewportWidth = Math.max(320, (typeof window !== 'undefined' ? window.innerWidth : 1200) - leftWidth - rightWidth);
    const viewportHeight = Math.max(320, (typeof window !== 'undefined' ? window.innerHeight - 56 : 800));
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const worldX = (centerX - store.canvasState.x) / oldScale;
    const worldY = (centerY - store.canvasState.y) / oldScale;

    store.canvasState.scale = nextScale;
    store.canvasState.x = centerX - worldX * nextScale;
    store.canvasState.y = centerY - worldY * nextScale;
  }
}

export function animateCanvasTransition(duration = 380) {
  store.isCanvasAnimating = true;
  setTimeout(() => {
    store.isCanvasAnimating = false;
  }, duration);
}

export interface FocusOnPageOptions {
  forTour?: boolean;
  popoverWidth?: number;
  duration?: number;
}

export function resetTranslationCanvasView(options?: { duration?: number }) {
  const duration = options?.duration ?? 380;
  if (duration > 0) {
    animateCanvasTransition(duration);
  } else {
    store.isCanvasAnimating = false;
  }

  // 1. 获取真实可用画布视口尺寸
  let viewportWidth = 0;
  let viewportHeight = 0;
  if (typeof document !== 'undefined') {
    const canvasArea = document.getElementById('tour-canvas-area');
    if (canvasArea && canvasArea.clientWidth > 0 && canvasArea.clientHeight > 0) {
      viewportWidth = canvasArea.clientWidth;
      viewportHeight = canvasArea.clientHeight;
    }
  }
  if (!viewportWidth || !viewportHeight) {
    const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
    const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
    viewportWidth = Math.max(320, (typeof window !== 'undefined' ? window.innerWidth : 1200) - leftWidth - rightWidth);
    viewportHeight = Math.max(320, (typeof window !== 'undefined' ? window.innerHeight : 800) - 56);
  }

  // 2. 确定当前展示的翻译页面与内容尺寸
  const activePage = store.pages.find(p => p.id === store.activePageId && p.pageType !== 'system_profile')
    || store.pages.find(p => p.pageType !== 'system_profile')
    || store.pages[0];

  const hasTargetLocale = targetLocales.value.length > 0 && !!store.activeTargetLocale;
  const singleWidth = getTranslationPageWidth();
  const contentWidth = hasTargetLocale ? (singleWidth * 2 + TRANSLATION_FRAME_GAP) : singleWidth;

  let contentHeight = PAGE_HEIGHT;
  if (typeof document !== 'undefined' && activePage) {
    const srcEl = document.getElementById(`frame_trans_${primaryLocale.value}_${activePage.id}`);
    const tgtEl = hasTargetLocale ? document.getElementById(`frame_trans_${store.activeTargetLocale}_${activePage.id}`) : null;
    const measuredHeight = Math.max(srcEl?.offsetHeight || 0, tgtEl?.offsetHeight || 0);
    if (measuredHeight > 0) {
      contentHeight = measuredHeight;
    }
  }

  // 3. 计算自适应缩放比例 (Fit to Canvas)
  const topBarHeight = 44;
  const paddingX = hasTargetLocale ? 96 : 120;
  const paddingY = 80;
  const availableHeight = Math.max(200, viewportHeight - topBarHeight);
  const safeWidth = Math.max(200, viewportWidth - paddingX);
  const safeHeight = Math.max(200, availableHeight - paddingY);

  const scaleX = safeWidth / contentWidth;
  const referenceHeight = Math.max(PAGE_HEIGHT, Math.min(contentHeight, 920));
  const scaleY = safeHeight / referenceHeight;

  let targetScale = Math.min(scaleX, scaleY);

  // 保证卡片在高分屏或大视口下保持 1:1 标准高保真（不超过 1.0，避免超大拉伸变形）
  // 当视口能容纳 92%~108% 时，自动规整到 1.0，呈现最清晰的 1:1 像素
  if (targetScale >= 0.92 && targetScale <= 1.08) {
    targetScale = 1.0;
  } else if (targetScale > 1.08) {
    targetScale = 1.0;
  } else {
    targetScale = Math.max(0.45, targetScale);
  }

  const finalScale = clampScale(targetScale);
  store.canvasState.scale = finalScale;

  // 4. 水平居中
  const contentCenterX = contentWidth / 2;
  store.canvasState.x = Math.round(viewportWidth / 2 - contentCenterX * finalScale);

  // 5. 垂直居中 / 顶部合理边距 (预留顶部 44px 语言栏高度)
  const scaledContentHeight = contentHeight * finalScale;
  if (scaledContentHeight + 64 <= availableHeight) {
    store.canvasState.y = topBarHeight + Math.max(36, Math.round((availableHeight - scaledContentHeight) / 2));
  } else {
    store.canvasState.y = topBarHeight + 42;
  }
}

export function focusOnPage(pageOrId: string | FormPage, options?: FocusOnPageOptions) {
  const page = typeof pageOrId === 'string' ? store.pages.find(p => p.id === pageOrId) : pageOrId;
  if (!page) return;

  if (store.workspaceMode === 'translation') {
    resetTranslationCanvasView(options);
    return;
  }

  const duration = options?.duration ?? 420;
  if (duration > 0) {
    animateCanvasTransition(duration);
  } else {
    store.isCanvasAnimating = false;
  }

  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  const viewportWidth = Math.max(320, window.innerWidth - leftWidth - rightWidth);
  const viewportHeight = Math.max(320, window.innerHeight - 56);

  const pType = page.profileType || store.meta.profileType;
  const presetExpectedHeight = pType === 'individual' ? 620 : 1080;

  let realHeight = PAGE_HEIGHT;
  if (typeof document !== 'undefined') {
    const frameEl = document.getElementById(page.id === store.pages[0]?.id ? 'tour-first-page-frame' : `frame_${page.id}`);
    if (page.pageType === 'system_profile') {
      realHeight = Math.max(frameEl?.offsetHeight || 0, presetExpectedHeight);
    } else if (frameEl && frameEl.offsetHeight > 0) {
      realHeight = frameEl.offsetHeight;
    }
  } else if (page.pageType === 'system_profile') {
    realHeight = presetExpectedHeight;
  }
  const realWidth = getPageWidth();

  const badgeOffset = 32;
  const totalContentHeight = realHeight + badgeOffset;

  const paddingY = options?.forTour ? 120 : 80;
  const safeHeight = Math.max(240, viewportHeight - paddingY);
  const targetScaleY = safeHeight / totalContentHeight;

  if (options?.forTour) {
    const popoverWidth = options.popoverWidth || 360;
    const gap = 24;
    const paddingX = 70;
    const safeWidth = Math.max(300, viewportWidth - popoverWidth - gap - paddingX);
    const targetScaleX = safeWidth / realWidth;

    const finalScale = clampScale(Math.min(targetScaleX, targetScaleY, 0.85));
    store.canvasState.scale = finalScale;

    const cardRenderedWidth = realWidth * finalScale;
    const totalGroupWidth = cardRenderedWidth + gap + popoverWidth;
    const leftMargin = Math.max(28, (viewportWidth - totalGroupWidth) / 2);

    store.canvasState.x = leftMargin - page.x * finalScale;

    const visualCenterY = page.y - (badgeOffset / 2) + realHeight / 2;
    const viewportCenterY = viewportHeight / 2;
    store.canvasState.y = viewportCenterY - visualCenterY * finalScale;
  } else {
    const paddingX = 80;
    const safeWidth = Math.max(200, viewportWidth - paddingX);
    const targetScaleX = safeWidth / realWidth;

    const targetScale = Math.min(targetScaleX, targetScaleY);
    const finalScale = clampScale(Math.abs(targetScale - 1) < 0.05 ? 1 : Math.min(0.9, targetScale));
    store.canvasState.scale = finalScale;

    store.canvasState.x = viewportWidth / 2 - (page.x + realWidth / 2) * finalScale;

    const visualCenterY = page.y - (badgeOffset / 2) + realHeight / 2;
    const viewportCenterY = viewportHeight / 2;
    store.canvasState.y = viewportCenterY - visualCenterY * finalScale;
  }
}

export function resetCanvasView(options?: { duration?: number }) {
  if (store.workspaceMode === 'translation') {
    resetTranslationCanvasView(options);
    return;
  }

  const duration = options?.duration ?? 380;
  if (duration > 0) {
    animateCanvasTransition(duration);
  } else {
    store.isCanvasAnimating = false;
  }

  if (store.pages.length === 0) {
    store.canvasState.x = 0;
    store.canvasState.y = 0;
    store.canvasState.scale = 1;
    return;
  }

  if (isRisk.value && !store.isRiskPageWidthCustomized && typeof window !== 'undefined') {
    store.riskPageWidth = calculateDefaultRiskPageWidth();
  }

  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  const viewportWidth = Math.max(320, window.innerWidth - leftWidth - rightWidth);
  const viewportHeight = Math.max(320, window.innerHeight - 56);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  store.pages.forEach(p => {
    let pHeight = PAGE_HEIGHT;
    const pType = p.profileType || store.meta.profileType;
    const presetExpectedHeight = pType === 'individual' ? 620 : 1080;
    if (typeof document !== 'undefined') {
      const frameEl = document.getElementById(p.id === store.pages[0]?.id ? 'tour-first-page-frame' : `frame_${p.id}`);
      if (p.pageType === 'system_profile') {
        pHeight = Math.max(frameEl?.offsetHeight || 0, presetExpectedHeight);
      } else if (frameEl && frameEl.offsetHeight > 0) {
        pHeight = frameEl.offsetHeight;
      }
    } else if (p.pageType === 'system_profile') {
      pHeight = presetExpectedHeight;
    }
    const pWidth = getPageWidth();

    if (p.x < minX) minX = p.x;
    if (p.y - 28 < minY) minY = p.y - 28;
    if (p.x + pWidth > maxX) maxX = p.x + pWidth;
    if (p.y + pHeight > maxY) maxY = p.y + pHeight;
  });

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;

  if (isRisk.value) {
    const safeWidth = Math.max(240, viewportWidth - 48);
    let targetScale = Math.min(1, safeWidth / totalWidth);
    if (Math.abs(targetScale - 1) < 0.03) targetScale = 1;
    store.canvasState.scale = clampScale(targetScale);
    const contentCenterX = minX + totalWidth / 2;
    store.canvasState.x = Math.round(viewportWidth / 2 - contentCenterX * store.canvasState.scale);

    const visualCenterY = (minY + maxY) / 2;
    const viewportCenterY = viewportHeight / 2;
    const centeredY = Math.round(viewportCenterY - visualCenterY * store.canvasState.scale);
    const minTopMargin = 56;
    store.canvasState.y = Math.max(minTopMargin, centeredY);
    return;
  }

  const padding = 120;

  const safeWidth = Math.max(10, viewportWidth - padding);
  const safeHeight = Math.max(10, viewportHeight - padding);

  let targetScale = Math.min(1, Math.max(0.1, Math.min(safeWidth / totalWidth, safeHeight / totalHeight)));
  if (Math.abs(targetScale - 1) < 0.05) targetScale = 1;

  store.canvasState.scale = targetScale;
  const contentCenterX = minX + totalWidth / 2;
  const contentCenterY = minY + totalHeight / 2;

  store.canvasState.x = viewportWidth / 2 - contentCenterX * targetScale;
  store.canvasState.y = (viewportHeight / 2) - contentCenterY * targetScale;
}

// 统一生成纯小写规范表单业务 ID (例如: tpl_20261030_7x8k)
// 结构: tpl_[日期]_[纯小写防重随机码] (不再区分 cus/ent/ind/diy，由 meta.profileType / case_type 单独分类)
export function generateFormId(
  _profileType?: ProfileType,
  _source?: 'diy' | 'template'
): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toLowerCase();
  return `tpl_${dateStr}_${rand}`;
}

export function generateSerialNo(
  profileType: ProfileType = 'customer',
  source: 'diy' | 'template' = 'diy'
): string {
  return generateFormId(profileType, source);
}

const TRANSLATABLE_FIELD_PROPS = [
  'label',
  'placeholder',
  'endPlaceholder',
  'signPlaceholder',
  'longTermText',
  'help',
  'content',
  'customErrorMessage',
  'declarationErrorMessage'
] as const;

export function buildSchema(): FormSchema {
  const baseLoc = primaryLocale.value;
  const activeLocale = baseLoc;
  const rawLocales = store.meta.enabledLocales && store.meta.enabledLocales.length > 0
    ? [...store.meta.enabledLocales]
    : [baseLoc];
  if (!rawLocales.includes(baseLoc)) {
    rawLocales.unshift(baseLoc);
  }
  const enabledLocales = Array.from(new Set(rawLocales));
  const hasEn = enabledLocales.includes('en') || baseLoc === 'en';

  const ensuredId = store.meta.formId || store.meta.serialNo || generateFormId(store.meta.profileType || 'customer', store.meta.source || 'diy');
  if (!store.meta.formId) store.meta.formId = ensuredId;
  if (!store.meta.serialNo) store.meta.serialNo = ensuredId;

  const defaultTemplateTitles = [
    'SG_CDD_CUSTOMER', 'SG_CDD_INDIVIDUAL', 'SG_CDD_ENTITY',
    'SG_RISK_CUSTOMER', 'SG_RISK_INDIVIDUAL', 'SG_RISK_ENTITY',
    'SG_CDD_Customer', 'SG_CDD_Individual', 'SG_CDD_Entity',
    'SG_Risk_Customer', 'SG_Risk_Individual', 'SG_Risk_Entity',
    '未命名表单', 'Untitled Form', '风险评估', 'Risk Assessment',
    '企业客户尽职调查问卷', '个人客户尽职调查问卷', '实体企业尽职调查问卷',
    'Corporate Customer CDD Questionnaire', 'Individual CDD Questionnaire', 'Corporate Entity CDD Questionnaire'
  ];
  const effectiveTitle = (
    store.meta.title ||
    store.meta.i18n?.zh?.title ||
    (activeLocale === 'en' ? (store.meta.title_en || store.meta.i18n?.en?.title) : '') ||
    (isRisk.value ? (activeLocale === 'en' ? 'Risk Assessment' : '风险评估') : (activeLocale === 'en' ? 'Untitled Form' : '未命名表单'))
  ).trim();
  let effectiveTitleEn = (store.meta.title_en || store.meta.i18n?.en?.title || '').trim();

  // 若英文标题仍为默认冲突模版名，且中文标题已被用户修改，则英文标题自动对齐中文标题，彻底杜绝后端 checkTitle 触发 409
  if (defaultTemplateTitles.includes(effectiveTitleEn) && !defaultTemplateTitles.includes(effectiveTitle)) {
    effectiveTitleEn = effectiveTitle;
    store.meta.title_en = effectiveTitle;
  }
  if (!effectiveTitleEn && hasEn) {
    effectiveTitleEn = effectiveTitle;
    store.meta.title_en = effectiveTitle;
  }

  const metaI18n: Record<string, Record<string, string>> = {};
  for (const loc of enabledLocales) {
    const entry: Record<string, string> = {};
    const tVal = loc === 'zh'
      ? effectiveTitle
      : loc === 'en'
        ? (effectiveTitleEn || effectiveTitle)
        : (store.meta.i18n?.[loc]?.title || '').trim();
    const dVal = loc === 'zh'
      ? (store.meta.description || store.meta.i18n?.zh?.description || '').trim()
      : loc === 'en'
        ? (store.meta.description_en || store.meta.i18n?.en?.description || '').trim()
        : (store.meta.i18n?.[loc]?.description || '').trim();
    if (tVal) entry.title = tVal;
    if (dVal) entry.description = dVal;
    if (Object.keys(entry).length > 0) {
      metaI18n[loc] = entry;
    }
  }

  const metaCopy: any = isRisk.value
    ? {
        formId: ensuredId,
        serialNo: ensuredId,
        profileType: store.meta.profileType || 'customer',
        formType: 'risk',
        baseLocale: store.meta.baseLocale || activeLocale,
        enabledLocales,
        i18n: metaI18n
      }
    : {
        formId: ensuredId,
        serialNo: ensuredId,
        profileType: store.meta.profileType || 'customer',
        formType: 'kyc',
        baseLocale: store.meta.baseLocale || activeLocale,
        enabledLocales,
        source: store.meta.source || 'diy',
        ...(store.meta.templateKey ? { templateKey: store.meta.templateKey } : {}),
        ...(store.meta.createdAt ? { createdAt: store.meta.createdAt } : {}),
        i18n: metaI18n
      };

  const buildUnifiedOptions = (options: any[] | undefined) => {
    if (!Array.isArray(options)) return undefined;
    return options.map((opt: any) => {
      const optI18n: Record<string, string> = {};
      for (const loc of enabledLocales) {
        const rawI18n = opt.i18n?.[loc];
        const fromI18n = typeof rawI18n === 'object' ? rawI18n?.label : rawI18n;
        const val = loc === 'zh'
          ? (fromI18n ?? opt.label ?? '')
          : loc === 'en'
            ? (fromI18n ?? opt.label_en ?? '')
            : (fromI18n ?? '');
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          optI18n[loc] = String(val);
        }
      }
      return {
        value: opt.value,
        i18n: optI18n
      };
    });
  };

  const pagesCopy = store.pages.map((p, idx) => {
    if (isRisk.value) {
      const firstGroupId = p.groups?.[0]?.id || 'grp_risk_1';
      const riskPageI18n: Record<string, Record<string, string>> = {};
      for (const loc of enabledLocales) {
        const tVal = loc === 'zh'
          ? (p.i18n?.zh?.title || p.title || '风险评估').trim()
          : loc === 'en'
            ? (p.i18n?.en?.title || p.title_en || 'Risk Assessment').trim()
            : (p.i18n?.[loc]?.title || '').trim();
        if (tVal) {
          riskPageI18n[loc] = { title: tVal };
        }
      }

      const cleanPage: any = {
        id: p.id || `page_risk_${idx}`,
        i18n: riskPageI18n,
        groups: p.groups && p.groups.length > 0
          ? p.groups.map(g => {
              const grpI18n: Record<string, Record<string, string>> = {};
              for (const loc of enabledLocales) {
                const gt = loc === 'zh'
                  ? (g.i18n?.zh?.title ?? g.title ?? '').trim()
                  : loc === 'en'
                    ? (g.i18n?.en?.title ?? g.title_en ?? '').trim()
                    : (g.i18n?.[loc]?.title ?? '').trim();
                if (gt) grpI18n[loc] = { title: gt };
              }
              return {
                id: g.id,
                i18n: grpI18n
              };
            })
          : [],
        fields: p.fields.map(f => {
          const rawOpts = f.options && f.options.length
            ? JSON.parse(JSON.stringify(f.options))
            : RISK_FIXED_OPTIONS.map(o => ({ ...o }));
          const fieldI18n: Record<string, Record<string, string>> = {};
          for (const loc of enabledLocales) {
            const dict: Record<string, string> = {};
            const lbl = loc === 'zh'
              ? (f.i18n?.zh?.label ?? f.label ?? '').trim()
              : loc === 'en'
                ? (f.i18n?.en?.label ?? f.label_en ?? '').trim()
                : (f.i18n?.[loc]?.label ?? '').trim();
            const hlp = loc === 'zh'
              ? (f.i18n?.zh?.help ?? f.help ?? '').trim()
              : loc === 'en'
                ? (f.i18n?.en?.help ?? f.help_en ?? '').trim()
                : (f.i18n?.[loc]?.help ?? '').trim();
            if (lbl) dict.label = lbl;
            if (hlp) dict.help = hlp;
            if (Object.keys(dict).length > 0) {
              fieldI18n[loc] = dict;
            }
          }
          return {
            id: f.id,
            key: f.key,
            type: 'radio',
            groupId: f.groupId || firstGroupId,
            weight: f.weight ?? 1,
            i18n: fieldI18n,
            options: buildUnifiedOptions(rawOpts)
          };
        })
      };

      return cleanPage;
    }

    const pageI18n: Record<string, Record<string, string>> = {};
    for (const loc of enabledLocales) {
      const entry: Record<string, string> = {};
      const pTitle = loc === 'zh'
        ? (p.i18n?.zh?.title ?? p.title ?? '').trim()
        : loc === 'en'
          ? (p.i18n?.en?.title ?? p.title_en ?? '').trim()
          : (p.i18n?.[loc]?.title ?? '').trim();
      const pDesc = loc === 'zh'
        ? (p.i18n?.zh?.description ?? p.description ?? '').trim()
        : loc === 'en'
          ? (p.i18n?.en?.description ?? p.description_en ?? '').trim()
          : (p.i18n?.[loc]?.description ?? '').trim();
      if (pTitle) entry.title = pTitle;
      if (pDesc) entry.description = pDesc;
      if (Object.keys(entry).length > 0) {
        pageI18n[loc] = entry;
      }
    }

    const pageCopy: any = {
      id: p.id,
      pageType: p.pageType || 'form',
      ...(p.pageType === 'system_profile'
        ? {
            profileType: store.meta.profileType || p.profileType || 'individual',
            ...(p.showSkeleton !== undefined ? { showSkeleton: p.showSkeleton } : {})
          }
        : {}),
      i18n: pageI18n,
      ...(p.groups && p.groups.length > 0 ? { groups: JSON.parse(JSON.stringify(p.groups)) } : {}),
      fields: p.fields.map(f => {
        const fieldCopy: any = JSON.parse(JSON.stringify(f));
        // 国家和国籍组件是系统内建预设字典，无需在 Schema JSON 中冗余序列化全部244个国家选项
        if (['country', 'nationality'].includes(fieldCopy.type)) {
          if (!fieldCopy.options || fieldCopy.options.length === 0 || fieldCopy.options.length >= 200) {
            delete fieldCopy.options;
          }
        }
        // 签名组件：规范化填充默认值
        if (fieldCopy.type === 'signature') {
          if (!fieldCopy.signPlaceholder && !fieldCopy.i18n?.zh?.signPlaceholder) {
            fieldCopy.signPlaceholder = '请在此处手写签名';
          }
          if (hasEn && !fieldCopy.signPlaceholder_en && !fieldCopy.i18n?.en?.signPlaceholder) {
            fieldCopy.signPlaceholder_en = 'Please sign here';
          }
          if (!fieldCopy.placeholder && !fieldCopy.i18n?.zh?.placeholder) {
            fieldCopy.placeholder = '请在下方指定区域签名';
          }
          if (hasEn && !fieldCopy.placeholder_en && !fieldCopy.i18n?.en?.placeholder) {
            fieldCopy.placeholder_en = 'Please sign in the designated area below';
          }
        }
        // 日期组件：起止模式规范化默认占位符，长期有效规范化默认文案
        if (fieldCopy.type === 'date') {
          if (fieldCopy.dateMode === 'range') {
            if (!fieldCopy.placeholder || fieldCopy.placeholder === '请选择日期') {
              fieldCopy.placeholder = '开始日期';
              if (hasEn && !fieldCopy.placeholder_en) fieldCopy.placeholder_en = 'Start Date';
            }
            if (!fieldCopy.endPlaceholder) {
              fieldCopy.endPlaceholder = '截止日期';
              if (hasEn && !fieldCopy.endPlaceholder_en) fieldCopy.endPlaceholder_en = 'End Date';
            }
          }
          if (fieldCopy.enableLongTerm) {
            if (!fieldCopy.longTermText) {
              fieldCopy.longTermText = '长期';
              if (hasEn && !fieldCopy.longTermText_en) fieldCopy.longTermText_en = 'Long-term';
            }
          }
        }

        // 构建统一的多语言对象 i18n: { zh: { ... }, en: { ... }, ja: { ... } }
        const unifiedFieldI18n: Record<string, Record<string, string>> = {};
        for (const loc of enabledLocales) {
          const locDict: Record<string, string> = {};
          for (const prop of TRANSLATABLE_FIELD_PROPS) {
            const rawVal = loc === 'zh'
              ? (fieldCopy.i18n?.zh?.[prop] ?? fieldCopy[prop])
              : loc === 'en'
                ? (fieldCopy.i18n?.en?.[prop] ?? fieldCopy[`${prop}_en`])
                : fieldCopy.i18n?.[loc]?.[prop];
            if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== '') {
              locDict[prop] = String(rawVal);
            }
          }
          if (Object.keys(locDict).length > 0) {
            unifiedFieldI18n[loc] = locDict;
          }
        }

        // 移除顶层散落的旧版单语言及 _en 冗余属性与空值属性
        for (const prop of TRANSLATABLE_FIELD_PROPS) {
          delete fieldCopy[prop];
          delete fieldCopy[`${prop}_en`];
        }
        if (fieldCopy.defaultValue === '') delete fieldCopy.defaultValue;
        if (fieldCopy.endValue === '') delete fieldCopy.endValue;
        delete fieldCopy.i18n;

        const savedOptions = fieldCopy.options;
        delete fieldCopy.options;

        fieldCopy.i18n = unifiedFieldI18n;

        if (savedOptions && Array.isArray(savedOptions)) {
          if (savedOptions.length > 0 || ['select', 'radio', 'checkbox', 'signature'].includes(fieldCopy.type)) {
            fieldCopy.options = buildUnifiedOptions(savedOptions);
          }
        }

        return fieldCopy;
      })
    };

    return pageCopy;
  });

  return {
    schemaVersion: '1.0.0',
    meta: metaCopy,
    pages: pagesCopy,
    pageConnections: isRisk.value ? [] : []
  };
}

export function syncTranslationUrlParams() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (store.workspaceMode === 'translation') {
      url.searchParams.set('mode', 'translation');
      if (store.activeTargetLocale) {
        url.searchParams.set('target', store.activeTargetLocale);
      } else {
        url.searchParams.delete('target');
      }
      if (store.activePageId) {
        url.searchParams.set('page', store.activePageId);
      } else {
        url.searchParams.delete('page');
      }
    } else {
      if (url.searchParams.get('mode') === 'translation') {
        if (isRisk.value && !url.pathname.includes('/risk')) {
          url.searchParams.set('mode', 'risk');
        } else {
          url.searchParams.delete('mode');
        }
      }
      url.searchParams.delete('target');
      url.searchParams.delete('page');
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    console.error('Failed to sync translation URL params', e);
  }
}

export function syncUrlParams(id?: string) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('profileType');
    if (store.workspaceMode === 'translation') {
      url.searchParams.set('mode', 'translation');
      if (store.activeTargetLocale) {
        url.searchParams.set('target', store.activeTargetLocale);
      }
      if (store.activePageId) {
        url.searchParams.set('page', store.activePageId);
      }
    } else if (isRisk.value && !url.pathname.includes('/risk')) {
      url.searchParams.set('mode', 'risk');
      url.searchParams.delete('target');
      url.searchParams.delete('page');
    } else {
      url.searchParams.delete('mode');
      url.searchParams.delete('target');
      url.searchParams.delete('page');
    }
    url.searchParams.delete('source');
    url.searchParams.delete('tpl');
    url.searchParams.delete('copy');
    url.searchParams.delete('_v');

    const formId = (id !== undefined ? id : (store.meta.formId || store.meta.serialNo || '')).toLowerCase();
    if (formId) {
      url.searchParams.set('id', formId);
    } else {
      url.searchParams.delete('id');
    }
    if (store.currentLocale) {
      url.searchParams.set('lang', store.currentLocale);
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    console.error('Failed to sync URL params', e);
  }
}

if (typeof window !== 'undefined') {
  watch(
    () => store.currentLocale,
    loc => {
      try {
        localStorage.setItem('builder_current_locale', loc);
        const url = new URL(window.location.href);
        if (url.searchParams.get('lang') !== loc) {
          url.searchParams.set('lang', loc);
          window.history.replaceState(null, '', url.toString());
        }
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-locale', loc);
        }
      } catch (e) {
        console.warn('Failed to persist locale', e);
      }
    },
    { immediate: true }
  );
}

export function createNewCanvas(options: {
  title: string;
  description?: string;
  profileType?: ProfileType;
}) {
  const profileType = options.profileType || store.meta.profileType || 'customer';
  const defaultTemplateTitles = [
    'SG_CDD_CUSTOMER', 'SG_CDD_INDIVIDUAL', 'SG_CDD_ENTITY',
    'SG_RISK_CUSTOMER', 'SG_RISK_INDIVIDUAL', 'SG_RISK_ENTITY',
    'SG_CDD_Customer', 'SG_CDD_Individual', 'SG_CDD_Entity',
    'SG_Risk_Customer', 'SG_Risk_Individual', 'SG_Risk_Entity',
    '未命名表单', 'Untitled Form', '风险评估', 'Risk Assessment',
    '企业客户尽职调查问卷', '个人客户尽职调查问卷', '实体企业尽职调查问卷',
    'Corporate Customer CDD Questionnaire', 'Individual CDD Questionnaire', 'Corporate Entity CDD Questionnaire'
  ];
  const defaultTitle = isRisk.value
    ? (profileType === 'individual' ? 'SG_RISK_INDIVIDUAL' : profileType === 'entity' ? 'SG_RISK_ENTITY' : 'SG_RISK_CUSTOMER')
    : (profileType === 'individual' ? '个人客户尽职调查问卷' : profileType === 'entity' ? '实体企业尽职调查问卷' : '企业客户尽职调查问卷');
  const persistedUrlId = typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('id') || '').toLowerCase().trim()
    : '';
  const isPersisted = Boolean((persistedUrlId && !persistedUrlId.startsWith('preset-cdd-')) || store.lastSavedTime);
  // 保留已持久化保存的 ID，如果当前已有已保存的表单，新建覆盖时保持原 ID，保存时原地覆盖 (Update)
  const existingId = store.meta.formId || store.meta.serialNo;
  const formId = (isPersisted && existingId) ? existingId : generateFormId(profileType, 'diy');
  const now = Date.now();
  const curTitle = (store.meta.title || '').trim();
  const curTitleEn = (store.meta.title_en || '').trim();
  const shouldKeepTitle = isPersisted || Boolean(curTitle && !defaultTemplateTitles.includes(curTitle));
  const shouldKeepTitleEn = isPersisted || Boolean(curTitleEn && !defaultTemplateTitles.includes(curTitleEn));
  const initialTitle = options.title?.trim() || (shouldKeepTitle && curTitle ? curTitle : defaultTitle);
  const initialTitleEn = options.title?.trim() || (shouldKeepTitleEn && curTitleEn ? curTitleEn : initialTitle);
  const schema = isRisk.value
    ? createRiskAssessmentTemplate(profileType, initialTitle, initialTitleEn, options.description || '')
    : createBlankTemplate(profileType, initialTitle, initialTitleEn, options.description || '');

  schema.meta.source = 'diy';
  schema.meta.serialNo = formId;
  schema.meta.formId = formId;
  schema.meta.createdAt = store.meta.createdAt || now;

  loadSchema(schema);
  store.meta.title = initialTitle;
  store.meta.title_en = initialTitleEn;
  store.meta.description = options.description !== undefined ? options.description : (schema.meta.description || '');
  if (!store.meta.i18n) store.meta.i18n = {};
  if (primaryLocale.value === 'en') {
    store.meta.i18n.en = {
      ...(store.meta.i18n.en || {}),
      title: initialTitleEn,
      ...(store.meta.description_en ? { description: store.meta.description_en } : {})
    };
    delete store.meta.i18n.zh;
  } else {
    store.meta.i18n.zh = {
      ...(store.meta.i18n.zh || {}),
      title: initialTitle,
      ...(store.meta.description ? { description: store.meta.description } : {})
    };
  }
  store.meta.profileType = profileType;
  store.meta.source = 'diy';
  store.meta.serialNo = formId;
  store.meta.formId = formId;
  store.meta.createdAt = schema.meta.createdAt;
  store.activeTemplateKey = 'blank';
  store.sidebarTab = 'components';
  if (isRisk.value && store.pages[0]?.fields?.[0]) {
    selectElement(store.pages[0].fields[0]);
  }
  if (dirtyTimer) clearTimeout(dirtyTimer);
  establishBaseline();
  store.lastSavedTime = '';
  // 已持久化保存的表单保持 URL 参数稳定；若全新创建尚未持久化保存则清空 URL
  syncUrlParams(isPersisted ? formId : '');
}

export function applyTemplateKey(
  tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity' | 'risk-customer' | 'risk-individual' | 'risk-entity' | string,
  customTitle?: string
) {
  let templateSource: FormSchema = kycCustomerTemplate;
  let pType: ProfileType = 'customer';
  let defaultTitle = '企业客户尽职调查问卷';
  let defaultTitleEn = 'Corporate Customer CDD Questionnaire';

  if (tplKey === 'kyc-individual') {
    templateSource = kycIndividualTemplate;
    pType = 'individual';
    defaultTitle = '个人客户尽职调查问卷';
    defaultTitleEn = 'Individual CDD Questionnaire';
  } else if (tplKey === 'kyc-entity') {
    templateSource = kycEntityTemplate;
    pType = 'entity';
    defaultTitle = '实体企业尽职调查问卷';
    defaultTitleEn = 'Corporate Entity CDD Questionnaire';
  } else if (tplKey === 'risk-individual') {
    templateSource = createRiskAssessmentTemplate('individual', 'SG_RISK_INDIVIDUAL');
    pType = 'individual';
    defaultTitle = 'SG_RISK_INDIVIDUAL';
    defaultTitleEn = 'SG_RISK_INDIVIDUAL';
  } else if (tplKey === 'risk-entity') {
    templateSource = createRiskAssessmentTemplate('entity', 'SG_RISK_ENTITY');
    pType = 'entity';
    defaultTitle = 'SG_RISK_ENTITY';
    defaultTitleEn = 'SG_RISK_ENTITY';
  } else if (tplKey === 'risk-customer') {
    templateSource = createRiskAssessmentTemplate('customer', 'SG_RISK_CUSTOMER');
    pType = 'customer';
    defaultTitle = 'SG_RISK_CUSTOMER';
    defaultTitleEn = 'SG_RISK_CUSTOMER';
  }

  const defaultTemplateTitles = [
    'SG_CDD_CUSTOMER', 'SG_CDD_INDIVIDUAL', 'SG_CDD_ENTITY',
    'SG_RISK_CUSTOMER', 'SG_RISK_INDIVIDUAL', 'SG_RISK_ENTITY',
    'SG_CDD_Customer', 'SG_CDD_Individual', 'SG_CDD_Entity',
    'SG_Risk_Customer', 'SG_Risk_Individual', 'SG_Risk_Entity',
    '未命名表单', 'Untitled Form', '风险评估', 'Risk Assessment',
    '企业客户尽职调查问卷', '个人客户尽职调查问卷', '实体企业尽职调查问卷',
    'Corporate Customer CDD Questionnaire', 'Individual CDD Questionnaire', 'Corporate Entity CDD Questionnaire'
  ];
  const persistedUrlId = typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('id') || '').toLowerCase().trim()
    : '';
  const isPersisted = Boolean((persistedUrlId && !persistedUrlId.startsWith('preset-cdd-')) || store.lastSavedTime);

  const clonedSchema: FormSchema = JSON.parse(JSON.stringify(templateSource));
  // 保留已持久化保存的 ID，切换模板时不重新生成 ID，保存时直接原地覆盖 (Update)
  const existingId = store.meta.formId || store.meta.serialNo;
  const formId = (isPersisted && existingId) ? existingId : generateFormId(pType, 'template');
  const now = Date.now();

  const curTitle = (store.meta.title || '').trim();
  const curTitleEn = (store.meta.title_en || '').trim();
  const shouldKeepTitle = isPersisted || Boolean(curTitle && !defaultTemplateTitles.includes(curTitle));
  const shouldKeepTitleEn = isPersisted || Boolean(curTitleEn && !defaultTemplateTitles.includes(curTitleEn));

  // 若用户已手动修改过标题或表单已保存，则保留原标题；否则随模板切换自动同步为新模板默认名称
  const title = customTitle?.trim() || (shouldKeepTitle && curTitle ? curTitle : (store.currentLocale === 'en' ? defaultTitleEn : defaultTitle));
  const titleEn = customTitle?.trim() || (shouldKeepTitleEn && curTitleEn ? curTitleEn : defaultTitleEn);

  clonedSchema.meta.title = title;
  clonedSchema.meta.title_en = titleEn;
  const isEnEntry = store.currentLocale === 'en';
  clonedSchema.meta.baseLocale = isEnEntry ? 'en' : 'zh';
  clonedSchema.meta.enabledLocales = isEnEntry ? ['en'] : ['zh', 'en'];
  if (!clonedSchema.meta.i18n) clonedSchema.meta.i18n = {};
  if (isEnEntry) {
    clonedSchema.meta.i18n.en = { ...(clonedSchema.meta.i18n.en || {}), title: titleEn };
    delete clonedSchema.meta.i18n.zh;
  } else {
    clonedSchema.meta.i18n.zh = { ...(clonedSchema.meta.i18n.zh || {}), title };
    clonedSchema.meta.i18n.en = { ...(clonedSchema.meta.i18n.en || {}), title: titleEn };
  }
  clonedSchema.meta.profileType = pType;
  clonedSchema.meta.source = 'template';
  clonedSchema.meta.templateKey = tplKey;
  clonedSchema.meta.formId = formId;
  clonedSchema.meta.serialNo = formId;
  clonedSchema.meta.createdAt = store.meta.createdAt || now;

  loadSchema(clonedSchema);
  store.meta.title = title;
  store.meta.title_en = titleEn;
  if (!store.meta.i18n) store.meta.i18n = {};
  if (isEnEntry) {
    store.meta.i18n.en = { ...(store.meta.i18n.en || {}), title: titleEn };
    delete store.meta.i18n.zh;
  } else {
    store.meta.i18n.zh = { ...(store.meta.i18n.zh || {}), title };
    store.meta.i18n.en = { ...(store.meta.i18n.en || {}), title: titleEn };
  }
  store.meta.profileType = pType;
  store.meta.source = 'template';
  store.meta.templateKey = tplKey;
  store.meta.formId = formId;
  store.meta.serialNo = formId;
  store.meta.createdAt = clonedSchema.meta.createdAt;
  store.activeTemplateKey = tplKey;
  store.sidebarTab = 'components';

  if (dirtyTimer) clearTimeout(dirtyTimer);
  establishBaseline();
  store.lastSavedTime = '';
  // 已持久化保存的表单保持 URL 参数稳定；若全新创建尚未持久化保存则清空 URL
  syncUrlParams(isPersisted ? formId : '');
}

export function loadSchema(schema: FormSchema, options?: { duration?: number }) {
  clearSelection();
  if (schema.meta?.formType === 'risk') {
    store.editorMode = 'risk';
  }
  const metaI18n = schema.meta?.i18n ? JSON.parse(JSON.stringify(schema.meta.i18n)) : undefined;
  store.meta.title = metaI18n?.zh?.title || schema.meta?.title || '未命名表单';
  store.meta.title_en = metaI18n?.en?.title || schema.meta?.title_en || '';
  store.meta.description = metaI18n?.zh?.description || schema.meta?.description || '';
  store.meta.description_en = metaI18n?.en?.description || schema.meta?.description_en || '';
  const baseLoc = schema.meta?.baseLocale || (store.currentLocale === 'en' ? 'en' : 'zh');
  store.meta.baseLocale = baseLoc;
  store.meta.i18n = metaI18n;

  if (schema.meta?.enabledLocales && schema.meta.enabledLocales.length > 0) {
    const loadedLocales = [...schema.meta.enabledLocales];
    if (!loadedLocales.includes(baseLoc)) {
      loadedLocales.unshift(baseLoc);
    }
    // 中文基准下强制默认追加英文版
    if (baseLoc === 'zh' && !loadedLocales.includes('en')) {
      loadedLocales.push('en');
    }
    // 自动扫描 schema 中表单内容实际包含的多语言（排除 system_profile 固有中英文骨架，避免仅有系统骨架导致非启用语种自动冒出）
    schema.pages?.forEach(p => {
      if (p.pageType === 'system_profile') return;
      if (p.i18n) {
        Object.entries(p.i18n).forEach(([loc, content]: [string, any]) => {
          if (!loadedLocales.includes(loc)) {
            if (content && (content.title?.trim() || content.description?.trim())) {
              loadedLocales.push(loc);
            }
          }
        });
      }
      p.fields?.forEach(f => {
        if (f.i18n) {
          Object.entries(f.i18n).forEach(([loc, content]: [string, any]) => {
            if (!loadedLocales.includes(loc)) {
              const hasText = content && (
                content.label?.trim() ||
                content.placeholder?.trim() ||
                content.help?.trim() ||
                content.content?.trim()
              );
              if (hasText) {
                loadedLocales.push(loc);
              }
            }
          });
        }
      });
    });
    store.meta.enabledLocales = Array.from(new Set(loadedLocales));
  } else {
    store.meta.enabledLocales = baseLoc === 'zh' ? ['zh', 'en'] : ['en'];
  }
  const rawProfileType = schema.meta?.profileType
    || (schema.pages?.[0]?.profileType)
    || 'customer';
  const profileType: ProfileType = rawProfileType === 'client' ? 'customer' : rawProfileType;
  store.meta.profileType = profileType;
  store.meta.source = schema.meta?.source || 'diy';
  store.meta.templateKey = schema.meta?.templateKey || '';

  const incomingId = (schema.meta?.formId || schema.meta?.serialNo || '').toLowerCase();
  const formId = incomingId || generateFormId(store.meta.profileType, store.meta.source);
  store.meta.formId = formId;
  store.meta.serialNo = formId;
  store.meta.createdAt = schema.meta?.createdAt || Date.now();

  // 重新计算并扫描最大组件 ID，防止编号冲突
  let maxId = 0;
  const scanElements = (list: FormElement[]) => {
    if (!list) return;
    list.forEach(el => {
      if (el.id && el.id.startsWith('cmp_')) {
        const num = parseInt(el.id.replace('cmp_', ''), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });
  };

  if (schema.pages) {
    schema.pages.forEach(p => scanElements(p.fields));
  }
  store.uniqueIdCounter = maxId + 1;


  if (schema.pages && schema.pages.length > 0) {
    store.pages = schema.pages.map((p, idx) => {
      const pageI18n = p.i18n ? JSON.parse(JSON.stringify(p.i18n)) : undefined;
      const rawTitleZh = pageI18n?.zh?.title || p.title || '';
      const rawTitleEn = pageI18n?.en?.title || p.title_en || '';
      const isSystemProfile = p.pageType === 'system_profile' || (idx === 0 && (rawTitleZh === '基本资料' || rawTitleEn === 'Basic Information'));
      let pageTitle = rawTitleZh;
      let pageTitleEn = rawTitleEn;
      if (!isSystemProfile) {
        // 清理历史遗留纯数字序号残余（如 '02' / '2'），保持空状态以展示 placeholder
        if (/^0\d+$/.test(pageTitle.trim())) {
          pageTitle = '';
        }
        if (/^0\d+$/.test(pageTitleEn.trim())) {
          pageTitleEn = '';
        }
      }
      let hydratedGroups = p.groups && p.groups.length > 0
        ? JSON.parse(JSON.stringify(p.groups)).map((g: any) => ({
            ...g,
            title: g.i18n?.zh?.title ?? g.title ?? '',
            title_en: g.i18n?.en?.title ?? g.title_en ?? ''
          }))
        : undefined;
      if (isRisk.value && !isSystemProfile && (!hydratedGroups || hydratedGroups.length === 0)) {
        hydratedGroups = [
          {
            id: 'grp_risk_1',
            title: '',
            title_en: ''
          }
        ];
      }
      const fallbackGroupId = hydratedGroups?.[0]?.id;

      return {
        id: p.id || `page_${Date.now()}_${getUniqueId()}_${idx}`,
        pageType: (isSystemProfile ? 'system_profile' : 'form') as 'form' | 'system_profile',
        profileType: isSystemProfile ? (store.meta.profileType || p.profileType || 'entity') : p.profileType,
        showSkeleton: p.showSkeleton !== false,
        title: isSystemProfile ? (rawTitleZh || '基本资料') : pageTitle,
        title_en: isSystemProfile ? (rawTitleEn || 'Basic Information') : pageTitleEn,
        description: pageI18n?.zh?.description ?? p.description ?? '',
        description_en: pageI18n?.en?.description ?? p.description_en ?? '',
        i18n: pageI18n,
        groups: hydratedGroups,
        fields: isSystemProfile ? [] : (p.fields || []).map(f => {
          const resolvedType = isRisk.value ? 'radio' : f.type;
          const meta = componentRegistry[resolvedType];
          const defaultData = meta ? meta.defaultData() : {};
          const rawFieldOptions = isRisk.value
            ? RISK_FIXED_OPTIONS.map(o => ({ ...o }))
            : (f.options && f.options.length
                ? f.options
                : (defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined));
          const fieldOptions = rawFieldOptions
            ? rawFieldOptions.map((opt: any) => {
                const optZh = typeof opt.i18n?.zh === 'string' ? opt.i18n.zh : (opt.i18n?.zh?.label ?? opt.label ?? '');
                const optEn = typeof opt.i18n?.en === 'string' ? opt.i18n.en : (opt.i18n?.en?.label ?? opt.label_en ?? '');
                return {
                  ...opt,
                  label: optZh,
                  label_en: optEn
                };
              })
            : undefined;
          const fI18n = f.i18n ? JSON.parse(JSON.stringify(f.i18n)) : undefined;
          return {
            ...defaultData,
            ...f,
            label: fI18n?.zh?.label ?? f.label ?? defaultData.label ?? '',
            label_en: fI18n?.en?.label ?? f.label_en ?? defaultData.label_en ?? '',
            placeholder: fI18n?.zh?.placeholder ?? f.placeholder ?? defaultData.placeholder ?? '',
            placeholder_en: fI18n?.en?.placeholder ?? f.placeholder_en ?? defaultData.placeholder_en ?? '',
            endPlaceholder: fI18n?.zh?.endPlaceholder ?? f.endPlaceholder ?? defaultData.endPlaceholder ?? '',
            endPlaceholder_en: fI18n?.en?.endPlaceholder ?? f.endPlaceholder_en ?? defaultData.endPlaceholder_en ?? '',
            longTermText: fI18n?.zh?.longTermText ?? f.longTermText ?? defaultData.longTermText ?? '',
            longTermText_en: fI18n?.en?.longTermText ?? f.longTermText_en ?? defaultData.longTermText_en ?? '',
            signPlaceholder: fI18n?.zh?.signPlaceholder ?? f.signPlaceholder ?? defaultData.signPlaceholder ?? '',
            signPlaceholder_en: fI18n?.en?.signPlaceholder ?? f.signPlaceholder_en ?? defaultData.signPlaceholder_en ?? '',
            help: fI18n?.zh?.help ?? f.help ?? defaultData.help ?? '',
            help_en: fI18n?.en?.help ?? f.help_en ?? defaultData.help_en ?? '',
            content: fI18n?.zh?.content ?? f.content ?? defaultData.content ?? '',
            content_en: fI18n?.en?.content ?? f.content_en ?? defaultData.content_en ?? '',
            customErrorMessage: fI18n?.zh?.customErrorMessage ?? f.customErrorMessage ?? defaultData.customErrorMessage ?? '',
            customErrorMessage_en: fI18n?.en?.customErrorMessage ?? f.customErrorMessage_en ?? defaultData.customErrorMessage_en ?? '',
            declarationErrorMessage: fI18n?.zh?.declarationErrorMessage ?? f.declarationErrorMessage ?? defaultData.declarationErrorMessage ?? '',
            declarationErrorMessage_en: fI18n?.en?.declarationErrorMessage ?? f.declarationErrorMessage_en ?? defaultData.declarationErrorMessage_en ?? '',
            i18n: fI18n,
            type: resolvedType,
            groupId: isRisk.value ? (f.groupId || fallbackGroupId) : f.groupId,
            options: (['country', 'nationality'].includes(resolvedType) && fieldOptions && fieldOptions.length >= 200)
              ? []
              : fieldOptions
          };
        }),
        x: idx * (getPageWidth() + PAGE_GAP),
        y: 0
      };
    });
    store.activePageId = store.pages.length > 0 ? store.pages[0].id : null;
    store.activeGroupId = store.pages[0]?.groups?.[0]?.id || null;
    setTimeout(() => {
      resetCanvasView({ duration: options?.duration });
    }, 50);
  } else {
    store.pages = [];
    store.activePageId = null;
  }

  // 确保目标语言与编辑语言与新 Schema 对齐，绝不残留上一模板或之前会话的未启用语言
  if (targetLocales.value.length > 0) {
    if (!store.activeTargetLocale || !targetLocales.value.includes(store.activeTargetLocale)) {
      store.activeTargetLocale = targetLocales.value[0];
    }
    if (store.editingLocale && store.editingLocale !== primaryLocale.value && !targetLocales.value.includes(store.editingLocale)) {
      store.editingLocale = store.activeTargetLocale;
    }
  } else {
    store.activeTargetLocale = '';
    store.editingLocale = primaryLocale.value;
  }

  establishBaseline();
}


let dirtyTimer: ReturnType<typeof setTimeout> | null = null;
export function markDirty() {
  if (dirtyTimer) clearTimeout(dirtyTimer);
  dirtyTimer = setTimeout(() => {
    const currentStr = JSON.stringify(buildSchema());
    store.isDirty = currentStr !== store.lastSavedHash;
  }, 300);
}

export function establishBaseline() {
  if (dirtyTimer) clearTimeout(dirtyTimer);
  store.lastSavedHash = JSON.stringify(buildSchema());
  store.isDirty = false;
}


export function triggerHighlight(input: HTMLElement | null) {
  if (!input) return;
  input.classList.remove('pulse-highlight');
  void input.offsetWidth;
  input.classList.add('pulse-highlight');

  const editor =
    document.getElementById('prop-editor') ||
    document.getElementById('page-prop-editor') ||
    input.closest('form');
  if (editor) {
    const editorRect = editor.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const targetScroll =
      editor.scrollTop +
      (inputRect.top - editorRect.top) -
      editorRect.height / 2 +
      inputRect.height / 2;
    editor.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }
  setTimeout(() => input.classList.remove('pulse-highlight'), 1200);
}

export function highlightPropertyField(
  field: 'label' | 'placeholder' | 'help' | 'option' | 'title' | 'description' | 'content' | 'signPlaceholder' | 'endPlaceholder' | 'longTermText' | 'customErrorMessage' | 'declarationErrorMessage',
  optionIndex?: number
) {
  setTimeout(() => {
    let targetInput: HTMLElement | null = null;
    if (field === 'label') {
      targetInput = document.getElementById('prop-label-input');
    } else if (field === 'title') {
      targetInput = document.getElementById(store.selectedType === 'group' ? 'group-prop-title-input' : 'page-prop-title-input');
    } else if (field === 'placeholder') {
      targetInput = document.getElementById('prop-placeholder-input');
    } else if (field === 'signPlaceholder') {
      targetInput = document.getElementById('prop-sign-placeholder-input');
    } else if (field === 'endPlaceholder') {
      targetInput = document.getElementById('prop-end-placeholder-input');
    } else if (field === 'longTermText') {
      targetInput = document.getElementById('prop-long-term-text-input') || document.getElementById('prop-longterm-input');
    } else if (field === 'help') {
      targetInput = document.getElementById('prop-help-input');
    } else if (field === 'customErrorMessage') {
      targetInput = document.getElementById('prop-custom-error-input');
    } else if (field === 'declarationErrorMessage') {
      targetInput = document.getElementById('prop-declaration-error-input');
    } else if (field === 'content') {
      targetInput = document.getElementById('prop-alert-content-input');
    } else if (field === 'description') {
      targetInput = document.getElementById('page-prop-desc-input');
    } else if (field === 'option' && optionIndex !== undefined) {
      const editor = document.getElementById('options-editor');
      if (editor && editor.children[optionIndex]) {
        targetInput = editor.children[optionIndex].querySelector(
          '.arco-input-wrapper, .arco-textarea-wrapper, input, textarea'
        ) as HTMLElement;
      }
    }

    if (targetInput) {
      triggerHighlight(targetInput);
    }
  }, 40);
}

export const primaryLocale = computed<string>(() => {
  return store.meta.baseLocale || store.currentLocale || 'zh';
});

export const targetLocales = computed<string[]>(() => {
  if (!store.meta.enabledLocales || store.meta.enabledLocales.length <= 1) {
    return [];
  }
  return store.meta.enabledLocales.filter(l => l !== primaryLocale.value);
});

export const isBilingual = computed<boolean>(() => {
  return targetLocales.value.length > 0;
});

export const secondaryLocale = computed<string>(() => {
  if (store.activeTargetLocale && targetLocales.value.includes(store.activeTargetLocale)) {
    return store.activeTargetLocale;
  }
  if (targetLocales.value.length > 0) {
    return targetLocales.value[0];
  }
  return primaryLocale.value === 'zh' ? 'en' : 'zh';
});

export function setActiveTargetLocale(locale: string) {
  if (targetLocales.value.includes(locale)) {
    store.activeTargetLocale = locale;
    if (store.editingLocale && store.editingLocale !== primaryLocale.value) {
      store.editingLocale = locale;
    }
    syncTranslationUrlParams();
  }
}

export function addTargetLocale(locale?: string) {
  const base = primaryLocale.value;
  if (!store.meta.baseLocale) {
    store.meta.baseLocale = base;
  }
  if (!store.meta.enabledLocales || store.meta.enabledLocales.length === 0) {
    store.meta.enabledLocales = [base];
  } else if (!store.meta.enabledLocales.includes(base)) {
    store.meta.enabledLocales.unshift(base);
  }

  let nextLocale = locale;
  if (!nextLocale) {
    const candidates = ['zh', 'en', 'zh-HK', 'ms'];
    nextLocale = candidates.find(c => !store.meta.enabledLocales!.includes(c)) || (base === 'zh' ? 'en' : 'zh');
  }

  if (!store.meta.enabledLocales.includes(nextLocale)) {
    store.meta.enabledLocales.push(nextLocale);
  }
  store.activeTargetLocale = nextLocale;
  store.editingLocale = nextLocale;

  store.pages.forEach(p => {
    if (p.pageType === 'system_profile') {
      if (!p.title) p.title = '基本资料';
      if (!p.title_en) p.title_en = 'Basic Information';
    }
  });

  markDirty();
  syncTranslationUrlParams();
}

export function removeTargetLocale(locale: string) {
  if (!store.meta.enabledLocales) return;
  const base = primaryLocale.value;
  // 英文版是合规法定核心语言，永远不允许被删除；主语言也不允许删除
  if (locale === base || locale === 'en') return;
  store.meta.enabledLocales = store.meta.enabledLocales.filter(l => l !== locale);
  if (store.meta.i18n && locale in store.meta.i18n) {
    delete store.meta.i18n[locale];
  }
  store.pages.forEach(p => {
    if (p.i18n && locale in p.i18n) {
      delete p.i18n[locale];
    }
    p.groups?.forEach(g => {
      if (g.i18n && locale in g.i18n) {
        delete g.i18n[locale];
      }
    });
    p.fields?.forEach(f => {
      if (f.i18n && locale in f.i18n) {
        delete f.i18n[locale];
      }
      f.options?.forEach(opt => {
        if (opt.i18n && locale in opt.i18n) {
          delete opt.i18n[locale];
        }
      });
    });
  });
  const remaining = store.meta.enabledLocales.filter(l => l !== base);
  if (remaining.length > 0) {
    if (!remaining.includes(store.activeTargetLocale)) {
      store.activeTargetLocale = remaining[0];
    }
    if (store.editingLocale === locale) {
      store.editingLocale = store.activeTargetLocale;
    }
  } else {
    store.activeTargetLocale = '';
    store.editingLocale = base;
  }
  markDirty();
  syncTranslationUrlParams();
}

export function enableBilingual() {
  const base = primaryLocale.value;
  const defaultTarget = base === 'zh' ? 'en' : 'zh';
  addTargetLocale(defaultTarget);
}

export function disableMultiLanguage() {
  const base = primaryLocale.value;
  store.meta.baseLocale = base;
  store.meta.enabledLocales = [base];
  store.editingLocale = base;
  store.workspaceMode = 'builder';
  markDirty();
  syncTranslationUrlParams();
}

export function openTranslationWorkspace(targetLocale?: string) {
  if (targetLocale && !targetLocales.value.includes(targetLocale)) {
    addTargetLocale(targetLocale);
  }
  const activeTarget =
    (targetLocale && targetLocales.value.includes(targetLocale) ? targetLocale : '') ||
    (store.activeTargetLocale && targetLocales.value.includes(store.activeTargetLocale) ? store.activeTargetLocale : '') ||
    targetLocales.value[0] ||
    '';

  store.activeTargetLocale = activeTarget;
  store.editingLocale = activeTarget || primaryLocale.value;
  store.workspaceMode = 'translation';
  store.sidebarTab = 'languages';
  store.leftSidebarVisible = true;
  clearSelection();

  const currentActivePage = store.pages.find(p => p.id === store.activePageId && p.pageType !== 'system_profile');
  if (!currentActivePage) {
    const firstFormPage = store.pages.find(p => p.pageType !== 'system_profile') || store.pages[0];
    if (firstFormPage) {
      store.activePageId = firstFormPage.id;
    }
  }

  syncTranslationUrlParams();

  requestAnimationFrame(() => {
    resetCanvasView({ duration: 380 });
  });
}

export function closeTranslationWorkspace() {
  store.workspaceMode = 'builder';
  store.editingLocale = primaryLocale.value;
  if (store.sidebarTab === 'languages') {
    store.sidebarTab = 'pages';
  }
  syncTranslationUrlParams();
  requestAnimationFrame(() => {
    resetCanvasView({ duration: 380 });
  });
}
