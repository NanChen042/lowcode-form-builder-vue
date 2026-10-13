<template>
  <div
    :id="pageIndex === 0 ? 'tour-first-page-frame' : ('frame_' + page.id)"
    :data-page-id="page.id"
    :data-page-index="pageIndex"
    :data-page-type="page.pageType"
    class="mobile-frame absolute min-h-[720px] w-[390px] bg-[#F7F8FA] rounded-2xl shadow-sm flex flex-col cursor-default transition-all duration-200"
    :class="[
      isPageSelected ? 'is-selected ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'ring-1 ring-slate-200/90 hover:ring-slate-300 hover:shadow-md',
      isFrameElevated ? '!z-20 is-active-frame' : 'z-10',
      store.isDraggingComponent && !isSystemProfile ? 'ring-2 !ring-blue-500 ring-offset-2 !shadow-lg !border-blue-400' : '',
      store.isDraggingComponent && isSystemProfile ? 'opacity-85' : ''
    ]"
    :style="{
      transform: `translate(${page.x}px, ${page.y}px)`
    }"
    @mousedown="handleFrameMouseDown"
    @click.stop="selectPage(page.id)"
  >
    <!-- 左上角序号角标 -->
    <div class="absolute -top-7 left-0 flex items-center gap-1.5 text-[12px] font-medium tracking-wider text-black/40 cursor-grab active:cursor-grabbing hover:text-black/70 transition-colors select-none">
      <Smartphone class="h-3.5 w-3.5" />
      <template v-if="isSystemProfile">
        <span class="font-mono font-medium text-slate-700">01 · {{ store.currentLocale === 'en' ? 'Basic Info' : '基础资料' }}</span>
        <span class="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200/60 ml-0.5">
          <Lock class="h-2.5 w-2.5" />
          {{ store.currentLocale === 'en' ? 'System Preset' : '系统预设' }}
        </span>
        <span v-if="store.isDraggingComponent" class="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 border border-rose-200/80 ml-0.5 animate-pulse">
          {{ store.currentLocale === 'en' ? 'Cannot Drop' : '不可放置' }}
        </span>
      </template>
      <template v-else>
        <span class="font-mono font-bold text-slate-600 text-[13px] tracking-normal">{{ pageIndexString }}</span>
      </template>
    </div>

    <!-- 拖拽组件时：右上角动态标识“可放置画布”状态 -->
    <div
      v-if="store.isDraggingComponent && !isSystemProfile"
      class="absolute -top-7 right-0 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs select-none pointer-events-none animate-pulse"
    >
      <ArrowDownToLine class="h-3 w-3 text-blue-500" />
      <span>{{ store.currentLocale === 'en' ? 'Droppable Canvas' : '可放置画布' }}</span>
    </div>

    <!-- 页面主容器 -->
    <div class="flex-1 overflow-hidden flex flex-col w-full h-full rounded-2xl relative">
      <!-- 拖拽组件时：系统前置页只读锁定遮罩向导（防止用户误解） -->
      <div
        v-if="store.isDraggingComponent && isSystemProfile"
        class="absolute inset-0 z-30 rounded-2xl bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none transition-all duration-200 border-2 border-dashed border-slate-300"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md mb-2.5 text-slate-500">
          <Lock class="h-5 w-5 text-slate-400" />
        </div>
        <span class="text-[13px] font-bold text-slate-700 bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-slate-200">
          {{ store.currentLocale === 'en' ? 'System Preset · Cannot Drop' : '系统预设步骤 · 不可添加组件' }}
        </span>
        <p class="mt-2 text-[11px] text-slate-500 max-w-[220px] leading-relaxed m-0">
          {{ store.currentLocale === 'en' ? 'Please drag components to subsequent form canvases' : '请将组件拖拽至右侧常规表单画布中' }}
        </p>
      </div>

      <!-- 页面头部 -->
      <div class="page-header-area px-5 pt-6 pb-4 shrink-0 bg-white rounded-t-2xl" @click.stop="selectPage(page.id)">
        <template v-if="isSystemProfile">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold tracking-tight text-slate-800 m-0 leading-7">
              {{ store.currentLocale === 'en' ? (page.title_en || 'Basic Information') : (page.title || '基本资料') }}
            </h2>
            <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Lock class="h-3 w-3" />
              {{ store.currentLocale === 'en' ? 'Read-only' : '只读核验' }}
            </span>
          </div>
        </template>
        <template v-else>
          <input v-model="displayPageTitle" class="page-title-input text-xl font-semibold tracking-tight leading-7 text-slate-800 w-full bg-transparent outline-none transition-colors border-b-2 border-transparent focus:text-blue-500 focus:border-blue-500 pb-1" :class="{ 'canvas-text-focus': isFocusedPageTitle }" :placeholder="store.currentLocale === 'en' ? 'Page Title' : '页面标题'" @focus="onPageTitleFocus" @blur="onPageTitleBlur" @click.stop="onPageTitleFocus" @input="markDirty" />
          <textarea v-model="displayPageDesc" class="page-desc-input mt-1.5 w-full overflow-hidden resize-none bg-transparent text-[15px] leading-6 text-slate-500 outline-none transition-colors border-b-2 border-transparent focus:text-blue-500 focus:border-blue-500 pb-1" :class="{ 'canvas-text-focus': isFocusedPageDesc }" rows="1" :placeholder="store.currentLocale === 'en' ? 'Enter page description here...' : '在此输入页面的描述信息...'" @focus="onPageDescFocus" @blur="onPageDescBlur" @click.stop="onPageDescFocus" @input="markDirty"></textarea>
        </template>
      </div>

      <!-- 系统预设基础资料页：直接自然平铺展开高保真业务资料卡片 -->
      <div v-if="isSystemProfile" class="flex-1 bg-white p-3" @click="selectPage(page.id)">
        <SystemProfileView
          :profile-type="page.profileType || store.meta.profileType || 'client'"
          :show-skeleton="page.showSkeleton !== false"
          :is-canvas="true"
        />
      </div>

      <!-- 常规画布组件容器与拖拽接收区 -->
      <div v-else class="canvas-pages-container relative flex-1 bg-white flex flex-col">
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
        <div
          ref="dropzoneRef"
          class="canvas-dropzone relative z-10 flex-1 min-h-[520px] p-3 transition-colors duration-200"
          :class="{
            'has-elements': page.fields.length > 0,
            'bg-blue-50/15': store.isDraggingComponent
          }"
          :data-page-id="page.id"
          @click.self="selectPage(page.id)"
        >
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
import SystemProfileView from '@/components/common/SystemProfileView.vue';
import { Smartphone, ArrowDownToLine, Plus, Lock } from '@lucide/vue';

const props = defineProps<{
  page: FormPage;
  pageIndex: number;
}>();

const isSystemProfile = computed(() => props.page.pageType === 'system_profile');

const pageIndexString = computed(() => {
  return String(props.pageIndex + 1).padStart(2, '0');
});

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
  if (dropzoneRef.value && !isSystemProfile.value) {
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
        store.isDraggingComponent = true;
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

        // 同步配置拖拽镜像，修复 Sortable 在缩放画布下的坐标除以 scale 偏移 bug，并杜绝异步 setTimeout 导致的闪烁与抽搐
        const fallback = document.querySelector('body > .drag-fallback') as HTMLElement;
        if (fallback && evt.item) {
          const rect = evt.item.getBoundingClientRect();
          const scale = store.canvasState.scale || 1;
          const visual = evt.item.cloneNode(true) as HTMLElement;
          visual.classList.remove('sortable-ghost', 'drag-chosen');
          visual.classList.add('drag-fallback-visual');
          visual.style.position = 'relative';
          visual.style.left = '0';
          visual.style.top = '0';
          visual.style.width = `${evt.item.offsetWidth}px`;
          visual.style.height = `${evt.item.offsetHeight}px`;
          visual.style.transform = `scale(${scale})`;
          visual.style.transformOrigin = '0 0';
          visual.style.boxSizing = 'border-box';
          visual.style.pointerEvents = 'none';

          // 核心修复：Sortable.js 内部会将 fixed top/left 除以 scale，导致缩放下拖起瞬间大幅向下向右掉落错位；
          // 同步校准 fallback 的初始坐标与宽高，与当前组件屏幕位置精确对齐
          fallback.style.left = `${rect.left}px`;
          fallback.style.top = `${rect.top}px`;
          fallback.style.width = `${rect.width}px`;
          fallback.style.height = `${rect.height}px`;
          fallback.classList.add('drag-fallback-shell');
          fallback.innerHTML = '';
          fallback.appendChild(visual);
        }
      },
      onEnd(evt) {
        store.isDraggingComponent = false;
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
