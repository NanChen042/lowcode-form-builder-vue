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
export const PAGE_HEIGHT = 720;
export const PAGE_GAP = 160;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1.6;

export interface FocusedTarget {
  elementId: string;
  field: 'label' | 'placeholder' | 'help' | 'option' | 'title' | 'description' | 'default' | 'content';
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
    enabledLocales: undefined as ('zh' | 'en')[] | undefined,
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
  sidebarTab: 'components' as 'templates' | 'components' | 'pages',

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
          if (next?.dependsOn?.fieldKey && descendantKeys.has(next.dependsOn.fieldKey)) {
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
        if (childOriginal?.dependsOn?.fieldKey && keyMap[childOriginal.dependsOn.fieldKey]) {
          const childClone: FormElement = JSON.parse(JSON.stringify(toRaw(childOriginal)));
          const newChildId = `cmp_${getUniqueId()}`;
          childClone.id = newChildId;
          childClone.key = makeFieldKey(childClone.type, newChildId);
          keyMap[childOriginal.key] = childClone.key;
          childClone.dependsOn = {
            fieldKey: keyMap[childOriginal.dependsOn.fieldKey],
            value: childOriginal.dependsOn.value
          };
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

      // 级联查找所有依附于该父组件（及多级从属）的全部联动子项一并删除
      let foundMore = true;
      while (foundMore) {
        foundMore = false;
        for (const f of page.fields) {
          if (!idsToDelete.has(f.id) && f.dependsOn?.fieldKey && keysToDelete.has(f.dependsOn.fieldKey)) {
            idsToDelete.add(f.id);
            if (f.key) keysToDelete.add(f.key);
            foundMore = true;
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

export function animateCanvasTransition(duration = 420) {
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

export function focusOnPage(pageId: string, options?: FocusOnPageOptions) {
  const page = store.pages.find(p => p.id === pageId);
  if (!page) return;

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
  const duration = options?.duration ?? 420;
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
    store.canvasState.y = 36;
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

export function buildSchema(): FormSchema {
  const isBilingualMode = Boolean(store.meta.enabledLocales?.includes('zh') && store.meta.enabledLocales?.includes('en'));
  const activeLocale = store.currentLocale || 'zh';

  const ensuredId = store.meta.formId || store.meta.serialNo || generateFormId(store.meta.profileType || 'customer', store.meta.source || 'diy');
  if (!store.meta.formId) store.meta.formId = ensuredId;
  if (!store.meta.serialNo) store.meta.serialNo = ensuredId;

  const defaultTemplateTitles = [
    'SG_CDD_Customer', 'SG_CDD_Individual', 'SG_CDD_Entity',
    'SG_Risk_Customer', 'SG_Risk_Individual', 'SG_Risk_Entity'
  ];
  const effectiveTitle = (store.meta.title || (isRisk.value ? '风险评估' : '未命名表单')).trim();
  let effectiveTitleEn = (store.meta.title_en || '').trim();

  // 若英文标题仍为默认冲突模版名，且中文标题已被用户修改，则英文标题自动对齐中文标题，彻底杜绝后端 checkTitle 触发 409
  if (defaultTemplateTitles.includes(effectiveTitleEn) && !defaultTemplateTitles.includes(effectiveTitle)) {
    effectiveTitleEn = effectiveTitle;
    store.meta.title_en = effectiveTitle;
  }
  if (!effectiveTitleEn && isBilingualMode) {
    effectiveTitleEn = effectiveTitle;
    store.meta.title_en = effectiveTitle;
  }

  const metaCopy: any = isRisk.value
    ? {
        formId: ensuredId,
        serialNo: ensuredId,
        title: effectiveTitle,
        profileType: store.meta.profileType || 'customer',
        formType: 'risk',
        enabledLocales: isBilingualMode ? ['zh', 'en'] : [activeLocale],
        ...(isBilingualMode && effectiveTitleEn ? { title_en: effectiveTitleEn } : {}),
        ...(store.meta.description ? { description: store.meta.description } : {}),
        ...(isBilingualMode && store.meta.description_en ? { description_en: store.meta.description_en } : {})
      }
    : {
        title: effectiveTitle,
        title_en: isBilingualMode ? effectiveTitleEn : '',
        description: store.meta.description || '',
        description_en: isBilingualMode ? (store.meta.description_en || '') : '',
        profileType: store.meta.profileType || 'customer',
        formType: 'kyc',
        enabledLocales: isBilingualMode ? ['zh', 'en'] : [activeLocale],
        source: store.meta.source || 'diy',
        templateKey: store.meta.templateKey,
        formId: ensuredId,
        serialNo: ensuredId,
        createdAt: store.meta.createdAt
      };

  const pagesCopy = store.pages.map((p, idx) => {
    if (isRisk.value) {
      // 风险评估模式：彻底剥离所有无用字段（pageType, showSkeleton, profileType, description, type, options, layout 等）
      const firstGroupId = p.groups?.[0]?.id || 'grp_risk_1';
      const cleanPage: any = {
        id: p.id || `page_risk_${idx}`,
        title: p.title || '风险评估',
        groups: p.groups && p.groups.length > 0
          ? p.groups.map(g => ({
              id: g.id,
              title: g.title?.trim() || '',
              title_en: g.title_en?.trim() || ''
            }))
          : [],
        fields: p.fields.map(f => {
          const cleanField: any = {
            id: f.id,
            key: f.key,
            type: 'radio',
            groupId: f.groupId || firstGroupId,
            label: f.label || '',
            weight: f.weight ?? 1,
            options: f.options && f.options.length
              ? JSON.parse(JSON.stringify(f.options))
              : RISK_FIXED_OPTIONS.map(o => ({ ...o }))
          };
          if (isBilingualMode) {
            cleanField.label_en = f.label_en || '';
          }
          if (f.help?.trim()) {
            cleanField.help = f.help.trim();
            if (isBilingualMode && f.help_en?.trim()) {
              cleanField.help_en = f.help_en.trim();
            }
          }
          if (!isBilingualMode && Array.isArray(cleanField.options)) {
            cleanField.options.forEach((opt: any) => {
              delete opt.label_en;
            });
          }
          return cleanField;
        })
      };

      if (isBilingualMode) {
        cleanPage.title_en = p.title_en || 'Risk Assessment';
      }

      return cleanPage;
    }

    const pageCopy: any = {
      id: p.id,
      pageType: p.pageType || 'form',
      profileType: p.pageType === 'system_profile' ? (store.meta.profileType || p.profileType || 'individual') : p.profileType,
      showSkeleton: p.showSkeleton,
      title: p.title,
      description: p.description,
      groups: p.groups && p.groups.length > 0 ? JSON.parse(JSON.stringify(p.groups)) : undefined,
      fields: p.fields.map(f => {
        const fieldCopy: any = JSON.parse(JSON.stringify(f));
        // 国家和国籍组件是系统内建预设字典，无需在 Schema JSON 中冗余序列化全部244个国家选项
        if (['country', 'nationality'].includes(fieldCopy.type)) {
          if (!fieldCopy.options || fieldCopy.options.length === 0 || fieldCopy.options.length >= 200) {
            delete fieldCopy.options;
          }
        }
        if (!isBilingualMode) {
          // 纯净单语言模式：彻底剥离英文副语言键，绝不向后端提交未开启的第二语言脏数据
          delete fieldCopy.label_en;
          delete fieldCopy.placeholder_en;
          delete fieldCopy.help_en;
          delete fieldCopy.customErrorMessage_en;
          if (fieldCopy.options && Array.isArray(fieldCopy.options)) {
            fieldCopy.options.forEach((opt: any) => {
              delete opt.label_en;
            });
          }
        }
        return fieldCopy;
      })
    };

    if (isBilingualMode) {
      pageCopy.title_en = p.title_en;
      pageCopy.description_en = p.description_en;
    }

    return pageCopy;
  });

  return {
    schemaVersion: '1.0.0',
    meta: metaCopy,
    pages: pagesCopy,
    pageConnections: isRisk.value ? [] : []
  };
}

export function syncUrlParams(id?: string) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('profileType');
    if (isRisk.value && !url.pathname.includes('/risk')) {
      url.searchParams.set('mode', 'risk');
    } else {
      url.searchParams.delete('mode');
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
  // 保留已存在的 ID，如果当前已有正在编辑的表单，新建覆盖时应保持原 ID，保存时原地覆盖 (Update)
  const existingId = store.meta.formId || store.meta.serialNo;
  const formId = existingId || generateFormId(profileType, 'diy');
  const now = Date.now();
  const initialTitle = options.title?.trim() || (existingId && store.meta.title ? store.meta.title : (isRisk.value ? '风险评估' : '未命名表单'));
  const schema = isRisk.value
    ? createRiskAssessmentTemplate(profileType, initialTitle, initialTitle, options.description || '')
    : createBlankTemplate(profileType, initialTitle, initialTitle, options.description || '');

  schema.meta.source = 'diy';
  schema.meta.serialNo = formId;
  schema.meta.formId = formId;
  schema.meta.createdAt = store.meta.createdAt || now;

  loadSchema(schema);
  store.meta.title = initialTitle;
  store.meta.title_en = initialTitle;
  store.meta.description = options.description !== undefined ? options.description : schema.meta.description;
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
  store.lastSavedHash = '';
  store.isDirty = true;
  store.lastSavedTime = '';
  // 已有 ID 则保持 URL 参数稳定；若全新创建尚未持久化保存则清空 URL
  syncUrlParams(existingId ? formId : '');
}

export function applyTemplateKey(
  tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity' | 'risk-customer' | 'risk-individual' | 'risk-entity' | string,
  customTitle?: string
) {
  let templateSource: FormSchema = kycCustomerTemplate;
  let pType: ProfileType = 'customer';
  let defaultTitle = 'SG_CDD_Customer';

  if (tplKey === 'kyc-individual') {
    templateSource = kycIndividualTemplate;
    pType = 'individual';
    defaultTitle = 'SG_CDD_Individual';
  } else if (tplKey === 'kyc-entity') {
    templateSource = kycEntityTemplate;
    pType = 'entity';
    defaultTitle = 'SG_CDD_Entity';
  } else if (tplKey === 'risk-individual') {
    templateSource = createRiskAssessmentTemplate('individual', 'SG_Risk_Individual');
    pType = 'individual';
    defaultTitle = 'SG_Risk_Individual';
  } else if (tplKey === 'risk-entity') {
    templateSource = createRiskAssessmentTemplate('entity', 'SG_Risk_Entity');
    pType = 'entity';
    defaultTitle = 'SG_Risk_Entity';
  } else if (tplKey === 'risk-customer') {
    templateSource = createRiskAssessmentTemplate('customer', 'SG_Risk_Customer');
    pType = 'customer';
    defaultTitle = 'SG_Risk_Customer';
  }

  const clonedSchema: FormSchema = JSON.parse(JSON.stringify(templateSource));
  // 保留已存在的 ID，切换模板时不重新生成 ID，保存时直接原地覆盖 (Update)
  const existingId = store.meta.formId || store.meta.serialNo;
  const formId = existingId || generateFormId(pType, 'template');
  const now = Date.now();
  // 保留用户已有标题或自定义标题
  const title = customTitle?.trim() || (existingId && store.meta.title ? store.meta.title : defaultTitle);
  const titleEn = (existingId && store.meta.title_en) ? store.meta.title_en : title;

  clonedSchema.meta.title = title;
  clonedSchema.meta.title_en = titleEn;
  clonedSchema.meta.profileType = pType;
  clonedSchema.meta.source = 'template';
  clonedSchema.meta.templateKey = tplKey;
  clonedSchema.meta.formId = formId;
  clonedSchema.meta.serialNo = formId;
  clonedSchema.meta.createdAt = store.meta.createdAt || now;

  loadSchema(clonedSchema);
  store.meta.title = title;
  store.meta.title_en = titleEn;
  store.meta.profileType = pType;
  store.meta.source = 'template';
  store.meta.templateKey = tplKey;
  store.meta.formId = formId;
  store.meta.serialNo = formId;
  store.meta.createdAt = clonedSchema.meta.createdAt;
  store.activeTemplateKey = tplKey;
  store.sidebarTab = 'components';

  if (dirtyTimer) clearTimeout(dirtyTimer);
  store.lastSavedHash = '';
  store.isDirty = true;
  store.lastSavedTime = '';
  // 已有 ID 则保持 URL 参数稳定；若全新创建尚未持久化保存则清空 URL
  syncUrlParams(existingId ? formId : '');
}

export function loadSchema(schema: FormSchema, options?: { duration?: number }) {
  clearSelection();
  if (schema.meta?.formType === 'risk') {
    store.editorMode = 'risk';
  }
  store.meta.title = schema.meta?.title || '未命名表单';
  store.meta.title_en = schema.meta?.title_en || '';
  store.meta.description = schema.meta?.description || '';
  store.meta.description_en = schema.meta?.description_en || '';
  if (schema.meta?.enabledLocales && schema.meta.enabledLocales.length > 0) {
    if (isRisk.value && schema.meta.enabledLocales.length === 1) {
      store.meta.enabledLocales = [store.currentLocale || 'zh'];
    } else {
      store.meta.enabledLocales = [...schema.meta.enabledLocales];
    }
  } else if (isRisk.value) {
    store.meta.enabledLocales = [store.currentLocale || 'zh'];
  } else {
    const hasExplicitEn = Boolean(
      schema.meta?.title_en ||
      schema.pages?.some(p => p.title_en || p.fields?.some(f => Boolean(f.label_en && f.label_en !== f.label)))
    );
    const hasExplicitZh = Boolean(
      schema.meta?.title ||
      schema.pages?.some(p => p.title || p.fields?.some(f => Boolean(f.label)))
    );

    if (hasExplicitEn && hasExplicitZh) {
      store.meta.enabledLocales = ['zh', 'en'];
    } else if (hasExplicitEn && !hasExplicitZh) {
      store.meta.enabledLocales = ['en'];
    } else if (hasExplicitZh && !hasExplicitEn) {
      store.meta.enabledLocales = ['zh'];
    } else {
      store.meta.enabledLocales = [store.currentLocale || 'zh'];
    }
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
      const isSystemProfile = p.pageType === 'system_profile' || (idx === 0 && (p.title === '基本资料' || p.title_en === 'Basic Information'));
      let pageTitle = p.title || '';
      let pageTitleEn = p.title_en || '';
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
        ? JSON.parse(JSON.stringify(p.groups))
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
        title: isSystemProfile ? (p.title || '基本资料') : pageTitle,
        title_en: isSystemProfile ? (p.title_en || 'Basic Information') : pageTitleEn,
        description: p.description || '',
        description_en: p.description_en || '',
        groups: hydratedGroups,
        fields: isSystemProfile ? [] : (p.fields || []).map(f => {
          const resolvedType = isRisk.value ? 'radio' : f.type;
          const meta = componentRegistry[resolvedType];
          const defaultData = meta ? meta.defaultData() : {};
          const fieldOptions = isRisk.value
            ? RISK_FIXED_OPTIONS.map(o => ({ ...o }))
            : (f.options && f.options.length
                ? f.options
                : (defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined));
          return {
            ...defaultData,
            ...f,
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
  field: 'label' | 'placeholder' | 'help' | 'option' | 'title' | 'description' | 'content',
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
    } else if (field === 'help') {
      targetInput = document.getElementById('prop-help-input');
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

export const isBilingual = computed<boolean>(() => {
  return Boolean(store.meta.enabledLocales?.includes('zh') && store.meta.enabledLocales?.includes('en'));
});

export const primaryLocale = computed<'zh' | 'en'>(() => {
  if (store.meta.enabledLocales && store.meta.enabledLocales.length === 1) {
    return store.meta.enabledLocales[0];
  }
  return store.currentLocale || 'zh';
});

export const secondaryLocale = computed<'zh' | 'en'>(() => {
  return primaryLocale.value === 'zh' ? 'en' : 'zh';
});

export function enableBilingual() {
  if (!store.meta.enabledLocales) {
    store.meta.enabledLocales = [store.currentLocale || 'zh'];
  }
  if (!store.meta.enabledLocales.includes('zh')) store.meta.enabledLocales.push('zh');
  if (!store.meta.enabledLocales.includes('en')) store.meta.enabledLocales.push('en');

  // 对于系统预设页面（基本资料），确保系统标准双语标题完备
  store.pages.forEach(p => {
    if (p.pageType === 'system_profile') {
      if (!p.title) p.title = '基本资料';
      if (!p.title_en) p.title_en = 'Basic Information';
    }
  });

  // 保持用户当前的语言模式，不随意篡改 store.currentLocale
  markDirty();
}

export function disableMultiLanguage() {
  const current = store.currentLocale || 'zh';
  store.meta.enabledLocales = [current];
  markDirty();
}
