<template>
  <div :id="'frame_' + page.id" class="mobile-frame absolute min-h-[720px] w-[390px] bg-[#F7F8FA] rounded-2xl shadow-sm flex flex-col transition-all cursor-default" :class="[
    isPageSelected ? 'is-selected ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'ring-1 ring-slate-200/90 hover:ring-slate-300 hover:shadow-md',
    isFrameElevated ? '!z-20 is-active-frame' : 'z-10'
  ]" :style="{
      transform: `translate(${page.x}px, ${page.y}px)`
    }" @mousedown="handleFrameMouseDown" @click.stop="selectPage(page.id)">
    <!-- 左上角序号角标 -->
    <div class="absolute -top-7 left-0 flex items-center gap-1.5 text-[12px] font-medium tracking-wider text-black/40 cursor-grab active:cursor-grabbing hover:text-black/70 transition-colors select-none">
      <Smartphone class="h-3.5 w-3.5" />
      <span class="font-mono">{{ store.currentLocale === 'en' ? `Page ${pageIndex + 1}` : `第${pageIndex + 1}页` }}</span>
    </div>

    <!-- 页面主容器 -->
    <div class="flex-1 overflow-hidden flex flex-col w-full h-full rounded-2xl">
      <!-- 页面头部 -->
      <div class="page-header-area px-5 pt-6 pb-4 shrink-0 bg-white rounded-t-2xl" @click.stop="selectPage(page.id)">
        <input v-model="displayPageTitle" class="page-title-input text-xl font-semibold tracking-tight leading-7 text-slate-800 w-full bg-transparent outline-none transition-colors border-b-2 border-transparent focus:text-blue-500 focus:border-blue-500 pb-1" :class="{ 'canvas-text-focus': isFocusedPageTitle }" :placeholder="store.currentLocale === 'en' ? 'Page Title' : '页面标题'" @focus="onPageTitleFocus" @blur="onPageTitleBlur" @click.stop="onPageTitleFocus" @input="markDirty" />
        <textarea v-model="displayPageDesc" class="page-desc-input mt-1.5 w-full overflow-hidden resize-none bg-transparent text-[15px] leading-6 text-slate-500 outline-none transition-colors border-b-2 border-transparent focus:text-blue-500 focus:border-blue-500 pb-1" :class="{ 'canvas-text-focus': isFocusedPageDesc }" rows="1" :placeholder="store.currentLocale === 'en' ? 'Enter page description here...' : '在此输入页面的描述信息...'" @focus="onPageDescFocus" @blur="onPageDescBlur" @click.stop="onPageDescFocus" @input="markDirty"></textarea>
      </div>

      <!-- 画布组件容器与拖拽接收区 -->
      <div class="canvas-pages-container relative flex-1 bg-white flex flex-col">
        <!-- 空状态提示：绝对定位浮层，不占据 Sortable DOM 节点流，拖拽组件时透明隐藏 -->
        <div v-if="page.fields.length === 0" class="empty-state canvas-empty-state pointer-events-none absolute inset-3 z-0 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/30 transition-opacity duration-200" :class="{ 'opacity-0': store.isDraggingComponent }">
          <div class="relative mb-6 grid h-20 w-24 grid-cols-2 gap-2">
            <div class="col-span-2 rounded-md border border-slate-200 bg-white shadow-sm"></div>
            <div class="rounded-md border border-slate-200 bg-white shadow-sm"></div>
            <div class="flex items-center justify-center rounded-md border-2 border-dashed border-blue-300 bg-blue-50/50 text-blue-500 transition-all hover:bg-blue-100">
              <ArrowDownToLine class="h-4 w-4" />
            </div>
          </div>

          <h3 class="text-[14px] font-semibold tracking-tight text-slate-800">{{ store.currentLocale === 'en' ? 'Canvas is currently empty' : '画布当前为空' }}</h3>
          <p class="mt-2 max-w-[260px] text-center text-[12px] leading-relaxed text-slate-500">
            {{ store.currentLocale === 'en' ? 'Drag and drop components from the left sidebar to start building' : '拖拽左侧基础输入或业务组件即可在这里生成并预览表单' }}
          </p>
        </div>

        <!-- 真实组件列表与拖拽投放区：空状态时内部无任何子节点，新拖入组件必然成为第 1 个子元素 -->
        <div ref="dropzoneRef" class="canvas-dropzone relative z-10 flex-1 min-h-[520px] p-3 transition" :class="{ 'has-elements': page.fields.length > 0 }" :data-page-id="page.id" @click.self="selectPage(page.id)">
          <CanvasElement v-for="element in page.fields" :key="element.id" :element="element" />
        </div>
      </div>
    </div>

    <!-- 右侧中间添加新页面按钮 -->
    <a-tooltip content="在右侧添加新页面" position="top">
      <div class="add-next-page-btn absolute -right-5 top-[340px] flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#1677ff] shadow-md transition hover:scale-110" @click.stop="addPage(page.id)">
        <Plus class="h-4 w-4" />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { FormPage, FormElement, ComponentType } from '@/types/schema';
import { store, selectPage, addPage, createElement, selectElement, markDirty, triggerHighlight } from '@/core/store';
import { getPageText } from '@/core/i18n';
import Sortable from 'sortablejs';
import CanvasElement from './CanvasElement.vue';
import { Smartphone, ArrowDownToLine, Plus } from '@lucide/vue';

const props = defineProps<{
  page: FormPage;
  pageIndex: number;
}>();

const dropzoneRef = ref<HTMLElement | null>(null);

const displayPageTitle = computed({
  get() {
    return getPageText(props.page, 'title');
  },
  set(val: string) {
    if (store.currentLocale === 'en') {
      props.page.title_en = val;
    } else {
      props.page.title = val;
    }
  }
});

const displayPageDesc = computed({
  get() {
    return getPageText(props.page, 'description');
  },
  set(val: string) {
    if (store.currentLocale === 'en') {
      props.page.description_en = val;
    } else {
      props.page.description = val;
    }
  }
});

const isPageSelected = computed(() => {
  return store.selectedType === 'page' && store.selectedId === props.page.id;
});

const isElementInsideSelected = computed(() => {
  if (store.selectedType !== 'element' || !store.selectedId) return false;
  return props.page.fields.some(f => f.id === store.selectedId);
});

const isFrameElevated = computed(() => {
  return (
    isPageSelected.value ||
    isElementInsideSelected.value ||
    store.activePageId === props.page.id ||
    (store.isDraggingFrame && store.draggedFrameId === props.page.id)
  );
});

const isFocusedPageTitle = computed(() => {
  return (
    store.focusedTarget?.elementId === props.page.id &&
    store.focusedTarget?.field === 'label'
  );
});

const isFocusedPageDesc = computed(() => {
  return (
    store.focusedTarget?.elementId === props.page.id &&
    store.focusedTarget?.field === 'help'
  );
});

function onPageTitleFocus() {
  selectPage(props.page.id);
  store.focusedTarget = {
    elementId: props.page.id,
    field: 'label'
  };
  setTimeout(() => {
    const input = document.getElementById('page-prop-title-input');
    triggerHighlight(input);
  }, 40);
}

function onPageTitleBlur() {
  if (store.focusedTarget?.elementId === props.page.id && store.focusedTarget?.field === 'label') {
    store.focusedTarget = null;
  }
}

function onPageDescFocus() {
  selectPage(props.page.id);
  store.focusedTarget = {
    elementId: props.page.id,
    field: 'help'
  };
  setTimeout(() => {
    const input = document.getElementById('page-prop-desc-input');
    triggerHighlight(input);
  }, 40);
}

function onPageDescBlur() {
  if (store.focusedTarget?.elementId === props.page.id && store.focusedTarget?.field === 'help') {
    store.focusedTarget = null;
  }
}

// 记录全局当前被拖拽的已存在组件信息（支持跨画板迁移）
let globalDraggingItem: {
  sourcePageId: string;
  element: FormElement;
} | null = null;

onMounted(() => {
  if (dropzoneRef.value) {
    new Sortable(dropzoneRef.value, {
      group: 'shared',
      animation: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'drag-chosen',
      fallbackClass: 'drag-fallback',
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      swapThreshold: 0.65,
      emptyInsertThreshold: 28,
      draggable: '.canvas-element, .component-item',
      filter: 'input, textarea, select, button, [contenteditable], .action-btn',
      preventOnFilter: false,
      onStart(evt) {
        document.body.classList.add('is-dragging-component');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '9999';
        }

        const elementId = evt.item.id;
        if (elementId) {
          const el = props.page.fields.find(f => f.id === elementId);
          if (el) {
            globalDraggingItem = {
              sourcePageId: props.page.id,
              element: el
            };
          }
        }

        setTimeout(() => {
          const fallback = document.querySelector('body > .drag-fallback') as HTMLElement;
          if (fallback && evt.item) {
            const rect = evt.item.getBoundingClientRect();
            const scale = store.canvasState.scale || 1;
            const visual = evt.item.cloneNode(true) as HTMLElement;
            visual.classList.remove('sortable-ghost', 'drag-chosen');
            visual.classList.add('drag-fallback', 'sortable-drag', 'drag-fallback-visual');
            visual.style.position = 'relative';
            visual.style.left = '0';
            visual.style.top = '0';
            visual.style.width = `${evt.item.offsetWidth}px`;
            visual.style.height = `${evt.item.offsetHeight}px`;
            visual.style.transform = `scale(${scale})`;
            visual.style.transformOrigin = '0 0';
            visual.style.boxSizing = 'border-box';

            fallback.style.left = `${rect.left}px`;
            fallback.style.top = `${rect.top}px`;
            fallback.style.width = `${rect.width}px`;
            fallback.style.height = `${rect.height}px`;
            fallback.style.scale = '';
            fallback.style.transformOrigin = '';
            fallback.classList.add('drag-fallback-shell');
            fallback.innerHTML = '';
            fallback.appendChild(visual);
          }
        }, 0);
      },
      onEnd(evt) {
        document.body.classList.remove('is-dragging-component');
        document.body.style.removeProperty('--drag-placeholder-height');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '';
        }
        globalDraggingItem = null;
      },
      onAdd(evt) {
        const itemEl = evt.item;
        const newIndex = props.page.fields.length === 0 ? 0 : Math.min(evt.newIndex ?? props.page.fields.length, props.page.fields.length);

        // 移除非响应式的克隆节点，由 Vue 响应式数据接管渲染
        itemEl.remove();

        // 场景 1：从左侧物料栏拖入全新组件 (.component-item)
        if (itemEl.classList.contains('component-item')) {
          const type = itemEl.getAttribute('data-type') as ComponentType;
          if (type) {
            const newEl = createElement(type);
            props.page.fields.splice(newIndex, 0, newEl);
            selectElement(newEl);
            markDirty();
          }
          return;
        }

        // 场景 2：跨画板拖拽已存在组件 (.canvas-element)
        if (globalDraggingItem) {
          const { sourcePageId, element } = globalDraggingItem;
          const sourcePage = store.pages.find(p => p.id === sourcePageId);
          if (sourcePage) {
            const srcIdx = sourcePage.fields.findIndex(f => f.id === element.id);
            if (srcIdx !== -1) {
              sourcePage.fields.splice(srcIdx, 1);
            }
          }
          props.page.fields.splice(newIndex, 0, element);
          selectElement(element);
          markDirty();
          globalDraggingItem = null;
          return;
        }

        // 兜底机制：通过 DOM id 全局跨画板查找并迁移
        if (itemEl.id) {
          for (const p of store.pages) {
            const idx = p.fields.findIndex(f => f.id === itemEl.id);
            if (idx !== -1) {
              const [moved] = p.fields.splice(idx, 1);
              props.page.fields.splice(newIndex, 0, moved);
              selectElement(moved);
              markDirty();
              return;
            }
          }
        }
      },
      onUpdate(evt) {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          const moved = props.page.fields.splice(evt.oldIndex, 1)[0];
          props.page.fields.splice(evt.newIndex, 0, moved);
          selectElement(moved);
          markDirty();
        }
        globalDraggingItem = null;
      }
    });
  }
});

function handleFrameMouseDown(e: MouseEvent) {
  // 无论点击画板空白还是内部组件，都优先将当前画板标记为活跃画板提升层级
  store.activePageId = props.page.id;

  // 如果不是右键或中键，优先选中当前页面
  if (e.button === 0 && !store.isSpacePressed) {
    const isClickingElement = (e.target as HTMLElement).closest(
      '.canvas-element, .icon-btn, .add-next-page-btn'
    );
    if (!isClickingElement) {
      selectPage(props.page.id);
    }
  }

  // 如果点击的是内部的输入框、按钮或组件，则不启动画板整体拖拽平移
  if (
    (e.target as HTMLElement).closest(
      'input, textarea, select, button, .canvas-element, .icon-btn, .add-next-page-btn'
    )
  ) {
    return;
  }
  if (e.button === 0 && !store.isSpacePressed) {
    store.isDraggingFrame = true;
    store.draggedFrameId = props.page.id;
  }
}
</script>
