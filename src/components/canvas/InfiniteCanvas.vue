<template>
  <section
    ref="canvasContainerRef"
    class="canvas-grid relative min-h-0 flex-1 overflow-hidden"
    :class="{ 'space-panning-ready': store.isSpacePressed }"
    :style="{
      '--grid-size': `${currentGridSize}px`,
      '--grid-pos-x': `${((store.canvasState.x % currentGridSize) + currentGridSize) % currentGridSize}px`,
      '--grid-pos-y': `${((store.canvasState.y % currentGridSize) + currentGridSize) % currentGridSize}px`
    }"
    @mousedown="onMouseDown"
    @wheel="onWheel"
    @mousemove="onCanvasMouseMove"
    @mouseleave="onCanvasMouseLeave"
    @contextmenu.prevent="onContextMenu"
  >

    <!-- 画布世界 -->
    <div class="canvas-world" :class="{ 'is-animating': store.isCanvasAnimating }" :style="{
      transform: `translate(${store.canvasState.x}px, ${store.canvasState.y}px) scale(${store.canvasState.scale})`
    }">
      <!-- SVG 页面连线 -->
      <CanvasConnections />

      <!-- 多画板页面列表 -->
      <PageFrame v-for="(page, idx) in store.pages" :key="page.id" :page="page" :page-index="idx" />
    </div>

    <!-- 全局画布初始化加载状态 -->
    <div v-if="store.isCanvasLoading" class="absolute inset-0 flex items-center justify-center z-40 bg-slate-50/70 backdrop-blur-sm">
      <div class="flex flex-col items-center justify-center p-8 bg-white/95 rounded-xl shadow-lg border border-slate-200/80">
        <a-spin :size="32" tip="正在初始化画布..." />
        <span class="mt-3 text-xs text-slate-400">正在准备表单设计环境</span>
      </div>
    </div>

    <!-- 全局空状态提示（仅在加载完毕且所有页面被用户主动清空时展示） -->
    <div v-else-if="store.pages.length === 0" class="absolute inset-0 flex items-center justify-center z-10 bg-slate-50/60 backdrop-blur-sm">
      <div class="flex flex-col items-center justify-center w-full max-w-[420px] px-12 py-10 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 class="mb-2 text-[17px] font-medium text-slate-800">暂无画布页面</h3>
        <p class="mb-8 text-sm text-slate-500 text-center">
          你的工作区准备就绪。创建一个画布来配置表单字段与布局。
        </p>

        <div class="flex flex-col gap-3 w-full max-w-[200px]">
          <a-button type="primary" size="large" long @click="addPage()">
            <template #icon>
              <Plus class="h-4 w-4" />
            </template>
            新建画布
          </a-button>
          <a-button type="secondary" size="large" long @click="$emit('open-template-gallery')">
            <template #icon>
              <LayoutTemplate class="h-4 w-4" />
            </template>
            浏览场景模板
          </a-button>
        </div>
      </div>
    </div>

    <!-- 左上角悬浮半透明展开物料栏按钮 (折叠时优雅浮现，毛玻璃极简质感，精准对应红框位置) -->
    <transition name="fade">
      <a-tooltip
        v-if="!store.leftSidebarVisible"
        :content="store.currentLocale === 'en' ? 'Expand Materials' : '展开左侧物料栏'"
        position="right"
      >
        <button
          type="button"
          class="absolute left-3.5 top-3.5 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95 group"
          @click="store.leftSidebarVisible = true"
        >
          <PanelLeft class="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
        </button>
      </a-tooltip>
    </transition>

    <!-- 右上角悬浮半透明展开属性面板按钮 (折叠时对称优雅浮现) -->
    <transition name="fade">
      <a-tooltip
        v-if="!store.rightSidebarVisible"
        :content="store.currentLocale === 'en' ? 'Expand Properties' : '展开右侧属性面板'"
        position="left"
      >
        <button
          type="button"
          class="absolute right-3.5 top-3.5 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95 group"
          @click="store.rightSidebarVisible = true"
        >
          <PanelRight class="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
        </button>
      </a-tooltip>
    </transition>

    <!-- 悬浮画布控制与帮助组 (对标 Google Stitch 极简双胶囊/圆形原生设计，彻底移除加减号) -->
    <!-- 悬浮画布控制与帮助组 (现代化高级白色毛玻璃 + Arco 原生组件) -->
    <div
      v-if="store.pages.length > 0"
      class="absolute bottom-8 right-8 z-50 flex items-center gap-2 select-none"
    >
      <!-- 缩放控制胶囊按钮与 Arco 原生下拉菜单 -->
      <a-dropdown v-model:popup-visible="isZoomMenuOpen" trigger="click" position="top">
        <button
          type="button"
          class="flex h-8 min-w-[64px] cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 px-3.5 font-mono text-[13px] font-semibold text-slate-700 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95"
          :class="{ 'border-blue-400/80 bg-white text-[#1677ff] shadow-md': isZoomMenuOpen }"
        >
          {{ Math.round(store.canvasState.scale * 100) }}%
        </button>
        <template #content>
          <a-doption value="in" @click="handleZoomAction('in')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ store.currentLocale === 'en' ? 'Zoom in' : '放大画布' }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘+' : 'Ctrl+' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="out" @click="handleZoomAction('out')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ store.currentLocale === 'en' ? 'Zoom out' : '缩小画布' }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘-' : 'Ctrl-' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="100" @click="handleZoomAction('100')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ store.currentLocale === 'en' ? 'Zoom to 100%' : '缩放到 100%' }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧0' : 'Shift+0' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="fit" @click="handleZoomAction('fit')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ store.currentLocale === 'en' ? 'Zoom to Fit' : '适应画布全貌' }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧1' : 'Shift+1' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="selection" @click="handleZoomAction('selection')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ store.currentLocale === 'en' ? 'Zoom to Selection' : '缩放到选中项' }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧2' : 'Shift+2' }}
              </span>
            </div>
          </a-doption>
        </template>
      </a-dropdown>

      <!-- 帮助与快捷键圆形按钮 (现代化高级白色毛玻璃 + 原生深黑气泡提示) -->
      <a-tooltip
        :content="store.currentLocale === 'en' ? 'Help & Shortcuts' : '帮助与快捷键指南'"
        position="top"
      >
        <button
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-[14px] font-semibold text-slate-600 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95"
          @click="showHelpAlert"
        >
          ?
        </button>
      </a-tooltip>
    </div>

    <!-- 平台帮助与快捷键指南弹窗 (现代化分类卡片排版) -->
    <a-modal
      v-model:visible="helpModalVisible"
      :title="store.currentLocale === 'en' ? 'Platform Help & Shortcuts' : '平台帮助与快捷键指南'"
      :footer="false"
      :width="500"
      unmount-on-close
    >
      <div class="space-y-4 py-1 select-none">
        <!-- 视口与缩放 -->
        <div>
          <div class="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {{ store.currentLocale === 'en' ? 'Canvas & Zoom' : '画布缩放与漫游' }}
          </div>
          <div class="grid grid-cols-1 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Zoom In' : '放大画布' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ +' : 'Ctrl +' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Zoom Out' : '缩小画布' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ -' : 'Ctrl -' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Zoom to 100%' : '缩放到 100%' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 0' : 'Shift + 0' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Zoom to Fit' : '适应画布全貌' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 1' : 'Shift + 1' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Zoom to Selection' : '缩放到选中项' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 2' : 'Shift + 2' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Pan Canvas' : '自由平移画布' }}
              </span>
              <span class="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ store.currentLocale === 'en' ? 'Space' : '空格' }}</kbd>
                <span>+</span>
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ store.currentLocale === 'en' ? 'Drag' : '拖拽' }}</kbd>
              </span>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Smooth Zoom' : '滚轮平滑缩放' }}
              </span>
              <span class="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
                <span>+</span>
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ store.currentLocale === 'en' ? 'Wheel' : '滚轮' }}</kbd>
              </span>
            </div>
          </div>
        </div>

        <!-- 常用编辑快捷操作 -->
        <div>
          <div class="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {{ store.currentLocale === 'en' ? 'Form & Editing' : '表单编辑与组件' }}
          </div>
          <div class="grid grid-cols-1 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Search Components' : '搜索物料组件' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ K' : 'Ctrl + K' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Context Menu' : '画布右键快捷菜单' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ store.currentLocale === 'en' ? 'Right Click' : '鼠标右键' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ store.currentLocale === 'en' ? 'Inline Text Edit' : '就地直接编辑文字' }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ store.currentLocale === 'en' ? 'Click Text' : '单击文字' }}
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <a-button type="primary" class="rounded-lg px-5" @click="helpModalVisible = false">
          {{ store.currentLocale === 'en' ? 'Got it' : '我知道了' }}
        </a-button>
      </div>
    </a-modal>

    <!-- 右键菜单 -->
    <ContextMenu :visible="contextMenuVisible" :x="contextMenuPos.x" :y="contextMenuPos.y" :target-page-id="contextMenuTargetPageId" :target-element-id="contextMenuTargetElementId" :target-type="contextMenuTargetType" @close="contextMenuVisible = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  store,
  adjustZoom,
  resetCanvasView,
  focusOnPage,
  animateCanvasTransition,
  addPage,
  clearSelection,
  selectElement,
  selectPage
} from '@/core/store';
import CanvasConnections from './CanvasConnections.vue';
import PageFrame from './PageFrame.vue';
import ContextMenu from './ContextMenu.vue';
import {
  Plus,
  LayoutTemplate,
  PanelLeft,
  PanelRight
} from '@lucide/vue';

defineEmits(['open-template-gallery']);

const canvasContainerRef = ref<HTMLElement | null>(null);

// 谷歌 Stitch 原版 14px 黄金基准间距（缩放比例 0.7~0.8 时渲染为 10.5~11.2px，与 Google Stitch 10.6px 完全一致）
const currentGridSize = computed(() => {
  return Math.max(9, Math.min(22, Math.round(14 * store.canvasState.scale)));
});

// 谷歌 Bento 风格微点阵光斑追踪与静止自动隐藏
const mouseX = ref(window.innerWidth / 2);
const mouseY = ref(window.innerHeight / 2);
const targetX = ref(window.innerWidth / 2);
const targetY = ref(window.innerHeight / 2);
const isMouseInside = ref(false);
let spotlightOpacity = 0;
let rafId: number | null = null;
let lastMoveTime = 0;
const IDLE_TIMEOUT_MS = 1200; // 鼠标超过 1.2 秒未移动自动平滑淡出

function onCanvasMouseMove(e: MouseEvent) {
  if (!canvasContainerRef.value) return;
  const rect = canvasContainerRef.value.getBoundingClientRect();
  targetX.value = e.clientX - rect.left;
  targetY.value = e.clientY - rect.top;
  isMouseInside.value = true;
  lastMoveTime = performance.now();
}

function onCanvasMouseLeave() {
  isMouseInside.value = false;
}

function updateSpotlight() {
  const now = performance.now();
  const timeSinceMove = now - lastMoveTime;
  const isMoving = isMouseInside.value && (timeSinceMove < IDLE_TIMEOUT_MS);
  const targetOpacity = isMoving ? 1 : 0;

  // 顺滑淡入与消退插值（移动时 0.15 渐入，静止超时 0.05 优雅慢消退）
  spotlightOpacity += (targetOpacity - spotlightOpacity) * (targetOpacity > spotlightOpacity ? 0.15 : 0.05);

  if (spotlightOpacity > 0.005) {
    // 鼠标坐标平滑阻尼插值
    const dx = targetX.value - mouseX.value;
    const dy = targetY.value - mouseY.value;
    mouseX.value += dx * 0.14;
    mouseY.value += dy * 0.14;

    // 谷歌 Stitch 原版聚光灯扩散控制（精确对照采样）：紧凑半径 65px，移动活跃时微舒展至 75px
    const moveFactor = Math.max(0, 1 - timeSinceMove / 400);
    const radius = 65 + moveFactor * 10;

    if (canvasContainerRef.value) {
      canvasContainerRef.value.style.setProperty('--mouse-x', `${mouseX.value.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--mouse-y', `${mouseY.value.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--spotlight-radius', `${radius.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--spotlight-opacity', `${spotlightOpacity.toFixed(3)}`);
    }
  } else {
    if (canvasContainerRef.value) {
      canvasContainerRef.value.style.setProperty('--spotlight-opacity', '0');
    }
  }

  rafId = requestAnimationFrame(updateSpotlight);
}

// 右键菜单状态
const contextMenuVisible = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });
const contextMenuTargetPageId = ref<string | null>(null);
const contextMenuTargetElementId = ref<string | null>(null);
const contextMenuTargetType = ref<'element' | 'page' | 'canvas'>('canvas');

// 平移鼠标跟踪状态
let panStartX = 0;
let panStartY = 0;
let panStartCanvasX = 0;
let panStartCanvasY = 0;
let frameStartX = 0;
let frameStartY = 0;

// 缩放预设菜单状态与动作
const isZoomMenuOpen = ref(false);
const helpModalVisible = ref(false);
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || '');

function zoomTo100() {
  const oldScale = store.canvasState.scale;
  if (oldScale === 1.0) return;
  animateCanvasTransition(300);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const worldX = (centerX - store.canvasState.x) / oldScale;
  const worldY = (centerY - store.canvasState.y) / oldScale;
  store.canvasState.scale = 1.0;
  store.canvasState.x = centerX - worldX;
  store.canvasState.y = centerY - worldY;
}

function zoomToSelection() {
  if (store.selectedId) {
    // 1. 优先检查选中的是否为画板页面
    const directPage = store.pages.find(p => p.id === store.selectedId);
    if (directPage) {
      focusOnPage(directPage.id);
      return;
    }

    // 2. 检查选中的是否为画板内表单组件
    const parentPage = store.pages.find(p => {
      const hasEl = (fields: any[]): boolean => {
        return fields.some(f => f.id === store.selectedId || (f.children && hasEl(f.children)));
      };
      return hasEl(p.fields);
    });
    if (parentPage) {
      focusOnPage(parentPage.id);
      return;
    }
  }

  // 3. 兜底聚焦第 1 个画板
  if (store.pages.length > 0) {
    focusOnPage(store.pages[0].id);
  }
}

function handleZoomAction(action: 'in' | 'out' | '100' | 'fit' | 'selection') {
  if (action === 'in') {
    adjustZoom(0.1);
  } else if (action === 'out') {
    adjustZoom(-0.1);
  } else if (action === '100') {
    zoomTo100();
  } else if (action === 'fit') {
    resetCanvasView();
  } else if (action === 'selection') {
    zoomToSelection();
  }
  isZoomMenuOpen.value = false;
}

function showHelpAlert() {
  helpModalVisible.value = true;
}

function onMouseDown(e: MouseEvent) {
  if (isZoomMenuOpen.value) {
    isZoomMenuOpen.value = false;
  }
  if (contextMenuVisible.value) {
    contextMenuVisible.value = false;
  }
  if (store.pages.length === 0) return;
  if ((e.target as HTMLElement).closest('.ruler')) return;

  const isSpaceDrag = store.isSpacePressed;
  const isMiddleDrag = e.button === 1;
  const isBackgroundDrag =
    e.button === 0 &&
    (e.target === canvasContainerRef.value ||
      (e.target as HTMLElement).classList.contains('canvas-world') ||
      (e.target as HTMLElement).id === 'canvas-connections');

  if (isSpaceDrag || isMiddleDrag || isBackgroundDrag) {
    e.preventDefault();
    store.isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartCanvasX = store.canvasState.x;
    panStartCanvasY = store.canvasState.y;
    document.body.classList.add('is-panning');

    if (e.button === 0 && !isSpaceDrag && !isMiddleDrag) {
      clearSelection();
    }
  } else if (store.isDraggingFrame && store.draggedFrameId) {
    const page = store.pages.find(p => p.id === store.draggedFrameId);
    if (page) {
      frameStartX = page.x;
      frameStartY = page.y;
      panStartX = e.clientX;
      panStartY = e.clientY;
      document.body.classList.add('is-panning');
    }
  }
}

function onMouseMove(e: MouseEvent) {
  if (store.isPanning) {
    e.preventDefault();
    store.canvasState.x = panStartCanvasX + (e.clientX - panStartX);
    store.canvasState.y = panStartCanvasY + (e.clientY - panStartY);
  } else if (store.isDraggingFrame && store.draggedFrameId) {
    e.preventDefault();
    const dx = (e.clientX - panStartX) / store.canvasState.scale;
    const dy = (e.clientY - panStartY) / store.canvasState.scale;
    const page = store.pages.find(p => p.id === store.draggedFrameId);
    if (page) {
      page.x = frameStartX + dx;
      page.y = frameStartY + dy;
    }
  }
}

function onMouseUp() {
  if (store.isPanning) {
    store.isPanning = false;
    document.body.classList.remove('is-panning');
  }
  if (store.isDraggingFrame) {
    store.isDraggingFrame = false;
    store.draggedFrameId = null;
    document.body.classList.remove('is-panning');
  }
}

function onWheel(e: WheelEvent) {
  if (isZoomMenuOpen.value) {
    isZoomMenuOpen.value = false;
  }
  if (contextMenuVisible.value) {
    contextMenuVisible.value = false;
  }
  if (store.pages.length === 0) return;
  e.preventDefault();

  if (e.ctrlKey || e.metaKey) {
    const oldScale = store.canvasState.scale;
    const nextScale = oldScale * Math.exp(-e.deltaY * 0.0016);
    const rect = canvasContainerRef.value?.getBoundingClientRect();
    adjustZoom(nextScale - oldScale, e.clientX, e.clientY, rect);
  } else {
    let dy = e.deltaY;
    let dx = e.deltaX;
    if (e.deltaMode === 1) {
      dy *= 40;
      dx *= 40;
    } else if (e.deltaMode === 2) {
      dy *= 800;
      dx *= 800;
    }
    if (e.shiftKey) {
      store.canvasState.x -= dy;
    } else {
      store.canvasState.y -= dy;
      store.canvasState.x -= dx;
    }
  }
}

function onContextMenu(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const elementEl = target.closest('.canvas-element') as HTMLElement | null;
  const frameEl = target.closest('.mobile-frame') as HTMLElement | null;

  if (elementEl && elementEl.id) {
    selectElement(elementEl.id);
    contextMenuTargetType.value = 'element';
    contextMenuTargetElementId.value = elementEl.id;
    contextMenuTargetPageId.value = frameEl?.id ? frameEl.id.replace('frame_', '') : null;
  } else if (frameEl && frameEl.id) {
    selectPage(frameEl.id.replace('frame_', ''));
    contextMenuTargetType.value = 'page';
    contextMenuTargetElementId.value = null;
    contextMenuTargetPageId.value = frameEl.id.replace('frame_', '');
  } else {
    contextMenuTargetType.value = 'canvas';
    contextMenuTargetElementId.value = null;
    contextMenuTargetPageId.value = null;
  }

  contextMenuPos.value = { x: e.clientX, y: e.clientY };
  contextMenuVisible.value = true;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (helpModalVisible.value) {
      helpModalVisible.value = false;
      e.preventDefault();
      return;
    }
    if (isZoomMenuOpen.value) {
      isZoomMenuOpen.value = false;
      e.preventDefault();
      return;
    }
    if (contextMenuVisible.value) {
      contextMenuVisible.value = false;
      e.preventDefault();
      return;
    }
  }

  const activeEl = document.activeElement as HTMLElement | null;
  if (activeEl && (['INPUT', 'TEXTAREA'].includes(activeEl.tagName) || activeEl.isContentEditable)) {
    return;
  }

  if (e.code === 'Space') {
    store.isSpacePressed = true;
  }

  // 快捷键支持
  // 1. Zoom in: Ctrl/Cmd + '+' or '='
  if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
    e.preventDefault();
    adjustZoom(0.1);
  }
  // 2. Zoom out: Ctrl/Cmd + '-' or '_'
  else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
    e.preventDefault();
    adjustZoom(-0.1);
  }
  // 3. Zoom to 100%: Shift+0 或 Ctrl/Cmd+0
  else if (((e.ctrlKey || e.metaKey) && e.key === '0') || (e.shiftKey && e.key === '0')) {
    e.preventDefault();
    handleZoomAction('100');
  }
  // 4. Zoom to Fit: Shift+1
  else if (e.shiftKey && (e.key === '1' || e.code === 'Digit1') && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    handleZoomAction('fit');
  }
  // 5. Zoom to Selection: Shift+2
  else if (e.shiftKey && (e.key === '2' || e.code === 'Digit2') && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    handleZoomAction('selection');
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.code === 'Space') {
    store.isSpacePressed = false;
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  rafId = requestAnimationFrame(updateSpotlight);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});
</script>
