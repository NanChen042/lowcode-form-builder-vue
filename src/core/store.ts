import { reactive, computed, toRaw } from 'vue';
import type {
  FormSchema,
  FormPage,
  FormElement,
  ComponentType,
  CanvasState,
  ProfileType
} from '../types/schema';
import { componentRegistry } from '../registry/components';
import {
  createBlankTemplate,
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

// 全局响应式状态单例
export const store = reactive({
  // 唯一 ID 计数器
  uniqueIdCounter: 1,

  // 元数据
  meta: {
    title: '未命名表单',
    title_en: '',
    description: '',
    description_en: '',
    profileType: 'customer' as ProfileType,
    source: 'diy' as 'template' | 'diy',
    templateKey: '' as string,
    formId: '' as string,
    serialNo: '' as string,
    createdAt: 0 as number
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
  isCanvasLoading: false,

  // 虚拟焦点高亮目标
  focusedTarget: null as FocusedTarget | null,

  // 模板与脏状态
  activeTemplateKey: 'blank',
  isDirty: false,
  lastSavedHash: '',

  // 侧边栏布局展示与尺寸拉伸
  leftSidebarVisible: true,
  rightSidebarVisible: true,
  leftSidebarWidth: 320,
  rightSidebarWidth: 300,
  sidebarTab: 'components' as 'templates' | 'components' | 'pages',

  // 国际化语言环境
  currentLocale: 'zh' as 'zh' | 'en',

  // 母系统 algo 用户登录态与机构信息
  user: {
    isLoggedIn: false,
    token: '',
    uid: 0,
    nickname: 'ceshi',
    avatar: '',
    email: '',
    role: ''
  },
  org: {
    orgId: 0,
    companyName: ''
  },

  // 外部 URL 锁定的业务主体类型 (若有则锁定不能切换，若无则为 null 允许自由选择)
  lockedProfileType: null as ProfileType | null
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

  return {
    id,
    type,
    key: makeFieldKey(type, id),
    label: '未命名字段',
    label_en: '',
    required: true,
    showLabel: true,
    helpPosition: 'right',
    ...defaultData,
    options: defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined
  };
}

export function addElement(type: ComponentType, targetPageId?: string) {
  if (store.pages.length === 0) {
    addPage();
  }

  // 1. 优先使用显式指定的 targetPageId
  // 2. 否则如果当前选中了画板（selectedType === 'page'），使用选中的画板 ID
  // 3. 否则如果当前有激活画板（activePageId），使用激活画板
  let resolvedPageId = targetPageId;
  if (!resolvedPageId) {
    if (store.selectedType === 'page' && store.selectedId) {
      resolvedPageId = store.selectedId;
    } else if (store.activePageId) {
      resolvedPageId = store.activePageId;
    }
  }

  let page = resolvedPageId ? store.pages.find(p => p.id === resolvedPageId) : null;

  // 核心约束：第 1 个画布（基础资料核验页，pageType === 'system_profile'）不允许添加任何表单组件
  if (!page || page.pageType === 'system_profile' || store.pages[0]?.id === page.id) {
    // 自动定向到首个可用的常规表单页
    let formPage = store.pages.find(p => p.pageType !== 'system_profile' && p.id !== store.pages[0]?.id);
    if (!formPage) {
      // 若当前只有第 1 页系统资料页，自动创建第 2 页常规表单页
      addPage(undefined, { focus: false });
      formPage = store.pages.find(p => p.pageType !== 'system_profile' && p.id !== store.pages[0]?.id)
        || store.pages[store.pages.length - 1];
    }
    page = formPage;
  }

  if (!page) return;

  const newEl = createElement(type);

  // 如果当前在目标页面内已选中了某个元素，在其正下方插入（若选中的是父组件，自动顺延到整个联动组下方，杜绝插断树状链路）
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

// 中文数字转换函数（1 -> '一', 2 -> '二', 10 -> '十', 12 -> '十二'）
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

  // 第一页不允许删除（保护第一页为默认通用画布）
  if (idx === 0) return;

  if (store.selectedId === pageId) {
    clearSelection();
  }

  store.pages.splice(idx, 1);

  // 重新排列被删除画板之后的后续画板
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

  // 纯 JavaScript 高性能几何计算，零 DOM 查询，杜绝强制同步重排 (Reflow)
  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  const viewportWidth = Math.max(320, window.innerWidth - leftWidth - rightWidth);
  const viewportHeight = Math.max(320, window.innerHeight - 56);
  const headerHeight = 56; // AppHeader 占位高度（InfiniteCanvas 采用了 -mt-14）

  // 获取画板真实物理高度：普通画板基准 720px；系统预设基础资料页随卡片自然展开，动态获取实际或预设展开高度
  let realHeight = PAGE_HEIGHT;
  if (typeof document !== 'undefined') {
    const frameEl = document.getElementById(page.id === store.pages[0]?.id ? 'tour-first-page-frame' : `frame_${page.id}`);
    if (frameEl && frameEl.offsetHeight > 0) {
      realHeight = frameEl.offsetHeight;
    } else if (page.pageType === 'system_profile') {
      realHeight = store.meta.profileType === 'individual' ? 620 : 1220;
    }
  } else if (page.pageType === 'system_profile') {
    realHeight = store.meta.profileType === 'individual' ? 620 : 1220;
  }
  const realWidth = PAGE_WIDTH;

  // 上方序号标签占用 28px 高度，预留 32px
  const badgeOffset = 32;
  const totalContentHeight = realHeight + badgeOffset;

  // 垂直方向：保证完整画板卡片（包括顶部标签和底部卡片）在视口内具备舒适的呼吸留白
  const paddingY = options?.forTour ? 100 : 80;
  const safeHeight = Math.max(240, viewportHeight - paddingY);
  const targetScaleY = safeHeight / totalContentHeight;

  if (options?.forTour) {
    // 操作指南高亮模式：为右侧解说气泡预留独立展示空间（气泡宽约 360px，间距 24px）
    const popoverWidth = options.popoverWidth || 360;
    const gap = 24;
    const paddingX = 70;
    const safeWidth = Math.max(300, viewportWidth - popoverWidth - gap - paddingX);
    const targetScaleX = safeWidth / realWidth;

    // 智能自适应缩放：长画板自适应缩放（~0.55），常规画板（~0.82），完整展示全貌绝不切边
    const finalScale = clampScale(Math.min(targetScaleX, targetScaleY, 0.85));
    store.canvasState.scale = finalScale;

    // 水平方向：将 [画板 + 气泡] 复合取景整体居中在视口内
    const cardRenderedWidth = realWidth * finalScale;
    const totalGroupWidth = cardRenderedWidth + gap + popoverWidth;
    const leftMargin = Math.max(28, (viewportWidth - totalGroupWidth) / 2);

    store.canvasState.x = leftMargin - page.x * finalScale;

    // 垂直方向：将画板内容垂直居中在可视视口中，上下均保留充足呼吸留白
    const visualCenterY = page.y - (badgeOffset / 2) + realHeight / 2;
    const viewportCenterY = headerHeight + viewportHeight / 2;
    store.canvasState.y = viewportCenterY - visualCenterY * finalScale;
  } else {
    // 常规聚焦模式（如新建/删除画板、聚焦到选中）：将画板居中
    const paddingX = 80;
    const safeWidth = Math.max(200, viewportWidth - paddingX);
    const targetScaleX = safeWidth / realWidth;

    const targetScale = Math.min(targetScaleX, targetScaleY);
    const finalScale = clampScale(Math.abs(targetScale - 1) < 0.05 ? 1 : Math.min(0.9, targetScale));
    store.canvasState.scale = finalScale;

    store.canvasState.x = viewportWidth / 2 - (page.x + realWidth / 2) * finalScale;

    const visualCenterY = page.y - (badgeOffset / 2) + realHeight / 2;
    const viewportCenterY = headerHeight + viewportHeight / 2;
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

  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  const viewportWidth = Math.max(320, window.innerWidth - leftWidth - rightWidth);
  const viewportHeight = Math.max(320, window.innerHeight - 56);
  const headerHeight = 56;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  store.pages.forEach(p => {
    let pHeight = PAGE_HEIGHT;
    if (typeof document !== 'undefined') {
      const frameEl = document.getElementById(p.id === store.pages[0]?.id ? 'tour-first-page-frame' : `frame_${p.id}`);
      if (frameEl && frameEl.offsetHeight > 0) {
        pHeight = frameEl.offsetHeight;
      } else if (p.pageType === 'system_profile') {
        pHeight = store.meta.profileType === 'individual' ? 620 : 1220;
      }
    } else if (p.pageType === 'system_profile') {
      pHeight = store.meta.profileType === 'individual' ? 620 : 1220;
    }
    const pWidth = PAGE_WIDTH;

    if (p.x < minX) minX = p.x;
    if (p.y - 28 < minY) minY = p.y - 28;
    if (p.x + pWidth > maxX) maxX = p.x + pWidth;
    if (p.y + pHeight > maxY) maxY = p.y + pHeight;
  });

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;
  const padding = 120;

  const safeWidth = Math.max(10, viewportWidth - padding);
  const safeHeight = Math.max(10, viewportHeight - padding);

  let targetScale = Math.min(1, Math.max(0.1, Math.min(safeWidth / totalWidth, safeHeight / totalHeight)));
  if (Math.abs(targetScale - 1) < 0.05) targetScale = 1;

  store.canvasState.scale = targetScale;
  const contentCenterX = minX + totalWidth / 2;
  const contentCenterY = minY + totalHeight / 2;

  store.canvasState.x = viewportWidth / 2 - contentCenterX * targetScale;
  store.canvasState.y = (headerHeight + viewportHeight / 2) - contentCenterY * targetScale;
}

// 统一生成纯小写规范表单业务 ID (例如: cli_diy_20261012_7x8k / ind_diy_... / ent_tpl_...)
// 结构: [cli客户/ind个人/ent机构]_[diy自建/tpl模板]_[日期]_[纯小写防重随机码]
export function generateFormId(
  profileType: ProfileType = 'customer',
  source: 'diy' | 'template' = 'diy'
): string {
  const isCus = profileType === 'customer' || profileType === 'client';
  const typeCode = isCus ? 'cus' : (profileType === 'entity' ? 'ent' : 'ind');
  const srcCode = source === 'template' ? 'tpl' : 'diy';
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toLowerCase();
  return `${typeCode}_${srcCode}_${dateStr}_${rand}`;
}

export function generateSerialNo(
  profileType: ProfileType = 'customer',
  source: 'diy' | 'template' = 'diy'
): string {
  return generateFormId(profileType, source);
}

// Schema 转换与导出
export function buildSchema(): FormSchema {
  return {
    schemaVersion: '1.0.0',
    meta: {
      title: store.meta.title || store.pages[0]?.title || '未命名表单',
      title_en: store.meta.title_en || store.pages[0]?.title_en || '',
      description: store.meta.description || store.pages[0]?.description || '',
      description_en: store.meta.description_en || store.pages[0]?.description_en || '',
      profileType: store.meta.profileType || 'individual',
      source: store.meta.source || 'diy',
      templateKey: store.meta.templateKey,
      formId: store.meta.formId,
      serialNo: store.meta.serialNo,
      createdAt: store.meta.createdAt
    },
    pages: store.pages.map(p => ({
      id: p.id,
      pageType: p.pageType || 'form',
      profileType: p.pageType === 'system_profile' ? (store.meta.profileType || p.profileType || 'individual') : p.profileType,
      showSkeleton: p.showSkeleton,
      title: p.title,
      title_en: p.title_en,
      description: p.description,
      description_en: p.description_en,
      fields: p.fields.map(f => {
        const fieldCopy = JSON.parse(JSON.stringify(f));
        // 国家和国籍组件是系统内建预设字典，无需在 Schema JSON 中冗余序列化全部244个国家选项
        if (['country', 'nationality'].includes(fieldCopy.type)) {
          if (!fieldCopy.options || fieldCopy.options.length === 0 || fieldCopy.options.length >= 200) {
            delete fieldCopy.options;
          }
        }
        return fieldCopy;
      })
    })),
    pageConnections: []
  };
}

// URL 同步：仅使用纯小写 ID，不泄露多余长参数
export function syncUrlParams(id?: string) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('profileType');
    url.searchParams.delete('mode');
    url.searchParams.delete('source');
    url.searchParams.delete('tpl');

    const formId = (id || store.meta.formId || store.meta.serialNo || '').toLowerCase();
    if (formId) {
      url.searchParams.set('id', formId);
    } else {
      url.searchParams.delete('id');
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) {
    console.error('Failed to sync URL params', e);
  }
}

export function createNewCanvas(options: {
  title: string;
  description?: string;
  profileType?: ProfileType;
}) {
  const profileType = options.profileType || store.lockedProfileType || 'customer';
  const schema = createBlankTemplate(profileType, options.title, '', options.description || '');
  const formId = generateFormId(profileType, 'diy');
  const now = Date.now();

  schema.meta.source = 'diy';
  schema.meta.serialNo = formId;
  schema.meta.formId = formId;
  schema.meta.createdAt = now;

  loadSchema(schema);
  store.meta.title = options.title || schema.meta.title;
  store.meta.description = options.description !== undefined ? options.description : schema.meta.description;
  store.meta.profileType = profileType;
  store.meta.source = 'diy';
  store.meta.serialNo = formId;
  store.meta.formId = formId;
  store.meta.createdAt = now;
  store.activeTemplateKey = 'blank';
  store.sidebarTab = 'components';
  establishBaseline();
  syncUrlParams(formId);
}

export function applyTemplateKey(tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity', customTitle?: string) {
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
  }

  const clonedSchema: FormSchema = JSON.parse(JSON.stringify(templateSource));
  const formId = generateFormId(pType, 'template');
  const now = Date.now();
  const title = customTitle?.trim() || defaultTitle;

  clonedSchema.meta.title = title;
  clonedSchema.meta.profileType = pType;
  clonedSchema.meta.source = 'template';
  clonedSchema.meta.templateKey = tplKey;
  clonedSchema.meta.formId = formId;
  clonedSchema.meta.serialNo = formId;
  clonedSchema.meta.createdAt = now;

  loadSchema(clonedSchema);
  store.meta.title = title;
  store.meta.profileType = pType;
  store.meta.source = 'template';
  store.meta.templateKey = tplKey;
  store.meta.formId = formId;
  store.meta.serialNo = formId;
  store.meta.createdAt = now;
  store.activeTemplateKey = tplKey;
  store.sidebarTab = 'components';

  establishBaseline();
  syncUrlParams(formId);
}

export function loadSchema(schema: FormSchema) {
  clearSelection();
  store.meta.title = schema.meta?.title || '未命名表单';
  store.meta.title_en = schema.meta?.title_en || '';
  store.meta.description = schema.meta?.description || '';
  store.meta.description_en = schema.meta?.description_en || '';
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

  syncUrlParams(formId);

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
      return {
        id: p.id || `page_${Date.now()}_${idx}`,
        pageType: (isSystemProfile ? 'system_profile' : 'form') as 'form' | 'system_profile',
        profileType: isSystemProfile ? (store.meta.profileType || p.profileType || 'entity') : p.profileType,
        showSkeleton: p.showSkeleton !== false,
        title: isSystemProfile ? (p.title || '基本资料') : pageTitle,
        title_en: isSystemProfile ? (p.title_en || 'Basic Information') : pageTitleEn,
        description: p.description || '',
        description_en: p.description_en || '',
        fields: isSystemProfile ? [] : (p.fields || []).map(f => {
          const meta = componentRegistry[f.type];
          const defaultData = meta ? meta.defaultData() : {};
          const fieldOptions = f.options && f.options.length
            ? f.options
            : (defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined);
          return {
            ...defaultData,
            ...f,
            options: (['country', 'nationality'].includes(f.type) && fieldOptions && fieldOptions.length >= 200)
              ? []
              : fieldOptions
          };
        }),
        x: idx * (PAGE_WIDTH + PAGE_GAP),
        y: 0
      };
    });
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
  field: 'label' | 'placeholder' | 'help' | 'option' | 'title' | 'description' | 'content',
  optionIndex?: number
) {
  setTimeout(() => {
    let targetInput: HTMLElement | null = null;
    if (field === 'label') {
      targetInput = document.getElementById('prop-label-input');
    } else if (field === 'title') {
      targetInput = document.getElementById('page-prop-title-input');
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
