import { reactive, computed } from 'vue';
import type {
  FormSchema,
  FormPage,
  FormElement,
  ComponentType,
  CanvasState
} from '../types/schema';
import { componentRegistry } from '../registry/components';

const PAGE_WIDTH = 390;
const PAGE_GAP = 160;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1.6;

export interface FocusedTarget {
  elementId: string;
  field: 'label' | 'placeholder' | 'help' | 'option' | 'title' | 'description' | 'default';
  optionIndex?: number;
}

// 全局响应式状态单例
export const store = reactive({
  // 唯一 ID 计数器
  uniqueIdCounter: 1,

  // 元数据
  meta: {
    title: '未命名表单',
    title_en: '',
    description: '',
    description_en: ''
  },

  // 页面列表
  pages: [] as FormPage[],

  // 当前激活选中的目标
  selectedType: null as 'element' | 'page' | null,
  selectedId: null as string | null,
  activePageId: null as string | null,

  // 画布视口状态
  canvasState: {
    x: 320,
    y: 160,
    scale: 1
  } as CanvasState,

  // 交互状态
  isPanning: false,
  isSpacePressed: false,
  isDraggingComponent: false,
  isDraggingFrame: false,
  draggedFrameId: null as string | null,
  isCanvasAnimating: false,
  isCanvasLoading: true,

  // 虚拟焦点高亮目标
  focusedTarget: null as FocusedTarget | null,

  // 模板与脏状态
  activeTemplateKey: 'blank',
  isDirty: false,
  lastSavedHash: '',

  // 侧边栏布局展示与尺寸拉伸
  leftSidebarVisible: true,
  rightSidebarVisible: true,
  leftSidebarWidth: 300,
  rightSidebarWidth: 300,
  isLeftSidebarHovered: false,
  isRightSidebarHovered: false,

  // 国际化语言环境
  currentLocale: 'zh' as 'zh' | 'en',

  // 测量占位高度
  dragPlaceholderHeight: null as number | null
});

// 计算属性：当前选中的元素或画板页面
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

// 生成唯一 ID
export function getUniqueId(): number {
  return store.uniqueIdCounter++;
}

export function makeFieldKey(type: ComponentType, id: string): string {
  return `${type}_${String(id).replace('cmp_', '')}`;
}

// 选中控制
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
    if (findElementById(page.fields, targetId)) {
      store.activePageId = page.id;
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

export function clearSelection() {
  store.selectedType = null;
  store.selectedId = null;
  store.focusedTarget = null;
}

// 元素操作方法
export function createElement(type: ComponentType): FormElement {
  const meta = componentRegistry[type];
  const id = `cmp_${getUniqueId()}`;
  const defaultData = meta ? meta.defaultData() : {};

  const el: FormElement = {
    id,
    type,
    label: defaultData.label || '未命名字段',
    label_en: defaultData.label_en || '',
    key: makeFieldKey(type, id),
    required: defaultData.required !== undefined ? defaultData.required : true,
    showLabel: defaultData.showLabel !== false,
    placeholder: defaultData.placeholder,
    placeholder_en: defaultData.placeholder_en || '',
    help: defaultData.help,
    help_en: defaultData.help_en || '',
    helpPosition: defaultData.helpPosition || 'right',
    defaultValue: defaultData.defaultValue,
    inputType: defaultData.inputType,
    dialCode: defaultData.dialCode,
    countryCode: defaultData.countryCode,
    strictPhoneValidation: defaultData.strictPhoneValidation,
    options: defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined,
    multiple: defaultData.multiple,
    dateType: defaultData.dateType,
    dateMode: defaultData.dateMode,
    enableLongTerm: defaultData.enableLongTerm,
    defaultLongTerm: defaultData.defaultLongTerm,
    endValue: defaultData.endValue,
    maxSelections: defaultData.maxSelections,
    layout: defaultData.layout,
    declarationRequired: defaultData.declarationRequired
  };

  return el;
}

export function addElement(type: ComponentType, targetPageId?: string) {
  if (store.pages.length === 0) {
    addPage();
  }

  // 1. 优先使用显式指定的 targetPageId
  // 2. 否则如果当前选中了画板（selectedType === 'page'），使用选中的画板 ID
  // 3. 否则如果当前有激活画板（activePageId），使用激活画板
  // 4. 兜底才使用最后一个画板
  let resolvedPageId = targetPageId;
  if (!resolvedPageId) {
    if (store.selectedType === 'page' && store.selectedId) {
      resolvedPageId = store.selectedId;
    } else if (store.activePageId) {
      resolvedPageId = store.activePageId;
    }
  }

  const page = (resolvedPageId ? store.pages.find(p => p.id === resolvedPageId) : null)
    || store.pages[store.pages.length - 1];

  const newEl = createElement(type);

  // 如果当前在目标页面内已选中了某个元素，直接在其正下方插入
  if (selectedElement.value) {
    for (const p of store.pages) {
      if (resolvedPageId && p.id !== resolvedPageId) continue;

      const searchRes = findElementParentAndIndex(p.fields, selectedElement.value.id);
      if (searchRes) {
        searchRes.parentArray.splice(searchRes.index + 1, 0, newEl);
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
      const cloneStr = JSON.stringify(original);
      const cloneObj: FormElement = JSON.parse(cloneStr);

      const newId = `cmp_${getUniqueId()}`;
      cloneObj.id = newId;
      cloneObj.key = makeFieldKey(cloneObj.type, newId);

      res.parentArray.splice(res.index + 1, 0, cloneObj);
      selectElement(cloneObj);
      markDirty();
      return;
    }
  }
}

export function deleteElement(elementId: string) {
  if (store.selectedId === elementId) {
    clearSelection();
  }
  for (const page of store.pages) {
    const res = findElementParentAndIndex(page.fields, elementId);
    if (res) {
      res.parentArray.splice(res.index, 1);
      markDirty();
      return;
    }
  }
}

// 页面操作方法
export function addPage(afterPageId?: string | null, options: { focus?: boolean } = {}) {
  const isFirst = store.pages.length === 0;
  const newId = `page_${Date.now()}`;
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
    title: `第 ${store.pages.length + 1} 页`,
    description: '',
    fields: [],
    x,
    y
  };

  store.pages.splice(insertIndex, 0, newPage);

  // 重新排列后续页面
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
  const idx = store.pages.findIndex(p => p.id === pageId);
  if (idx === -1) return;

  if (store.selectedId === pageId) {
    clearSelection();
  }

  store.pages.splice(idx, 1);

  // 重新排列后续画板
  for (let i = 1; i < store.pages.length; i++) {
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

// 画布视口缩放与平移方法
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
    // 居中缩放
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
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

export function focusOnPage(pageId: string) {
  const page = store.pages.find(p => p.id === pageId);
  if (!page) return;

  animateCanvasTransition(420);

  const viewportWidth = window.innerWidth - 300 - 280; // 大致除去左右侧边栏
  const viewportHeight = window.innerHeight - 64; // 除去顶部高度
  const frameHeight = 720;

  const targetScale = clampScale(Math.min((viewportWidth - 120) / PAGE_WIDTH, (viewportHeight - 120) / frameHeight));
  const finalScale = Math.abs(targetScale - 1) < 0.05 ? 1 : Math.min(1, targetScale);

  store.canvasState.scale = finalScale;
  store.canvasState.x = viewportWidth / 2 - (page.x + PAGE_WIDTH / 2) * finalScale;
  store.canvasState.y = viewportHeight / 2 - (page.y + frameHeight / 2) * finalScale;
}

export function resetCanvasView(viewportWidth = window.innerWidth - 580, viewportHeight = window.innerHeight - 64) {
  animateCanvasTransition(420);
  if (store.pages.length === 0) {
    store.canvasState.x = 0;
    store.canvasState.y = 0;
    store.canvasState.scale = 1;
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  store.pages.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x + PAGE_WIDTH > maxX) maxX = p.x + PAGE_WIDTH;
    if (p.y + 720 > maxY) maxY = p.y + 720;
  });

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;
  const padding = 160;

  const safeWidth = Math.max(10, viewportWidth - padding);
  const safeHeight = Math.max(10, viewportHeight - padding);

  let targetScale = Math.min(1, Math.max(0.1, Math.min(safeWidth / totalWidth, safeHeight / totalHeight)));
  if (Math.abs(targetScale - 1) < 0.05) targetScale = 1;

  store.canvasState.scale = targetScale;
  const contentCenterX = minX + totalWidth / 2;
  const contentCenterY = minY + totalHeight / 2;

  store.canvasState.x = viewportWidth / 2 - contentCenterX * targetScale;
  store.canvasState.y = viewportHeight / 2 - contentCenterY * targetScale;
}

// Schema 转换与加载
export function buildSchema(): FormSchema {
  return {
    schemaVersion: '1.0.0',
    meta: {
      title: store.meta.title || store.pages[0]?.title || '未命名表单',
      title_en: store.meta.title_en || store.pages[0]?.title_en || '',
      description: store.meta.description || store.pages[0]?.description || '',
      description_en: store.meta.description_en || store.pages[0]?.description_en || ''
    },
    pages: store.pages.map(p => ({
      id: p.id,
      title: p.title,
      title_en: p.title_en,
      description: p.description,
      description_en: p.description_en,
      fields: JSON.parse(JSON.stringify(p.fields))
    })),
    pageConnections: []
  };
}

export function loadSchema(schema: FormSchema) {
  clearSelection();
  store.meta.title = schema.meta?.title || '未命名表单';
  store.meta.title_en = schema.meta?.title_en || '';
  store.meta.description = schema.meta?.description || '';
  store.meta.description_en = schema.meta?.description_en || '';

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

  // 构建页面
  if (schema.pages && schema.pages.length > 0) {
    store.pages = schema.pages.map((p, idx) => ({
      id: p.id || `page_${Date.now()}_${idx}`,
      title: p.title || `第 ${idx + 1} 页`,
      title_en: p.title_en || '',
      description: p.description || '',
      description_en: p.description_en || '',
      fields: (p.fields || []).map(f => {
        const meta = componentRegistry[f.type];
        const defaultData = meta ? meta.defaultData() : {};
        const parsed = JSON.parse(JSON.stringify(f));
        return {
          ...defaultData,
          ...parsed,
          options: parsed.options && parsed.options.length
            ? parsed.options
            : (defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined)
        };
      }),
      x: idx * (PAGE_WIDTH + PAGE_GAP),
      y: 0
    }));
    store.activePageId = store.pages.length > 0 ? store.pages[0].id : null;
    setTimeout(() => {
      resetCanvasView();
    }, 50);
  } else {
    store.pages = [];
    store.activePageId = null;
  }

  establishBaseline();
}

// 脏状态比对
let dirtyTimer: any = null;
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

// 属性面板联动高亮与滚动
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
  field: 'label' | 'placeholder' | 'help' | 'option',
  optionIndex?: number
) {
  setTimeout(() => {
    let targetInput: HTMLElement | null = null;
    if (field === 'label') {
      targetInput = document.getElementById('prop-label-input');
    } else if (field === 'placeholder') {
      targetInput = document.getElementById('prop-placeholder-input');
    } else if (field === 'help') {
      targetInput = document.getElementById('prop-help-input');
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
