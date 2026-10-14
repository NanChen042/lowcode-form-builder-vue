<template>
  <section
    id="tour-canvas-area"
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
    <!-- 专属新手引导视口目标（严格对齐顶栏 56px 下方，杜绝负外边距穿透顶栏） -->
    <div id="tour-canvas-viewport" style="position: absolute; top: 56px; left: 0; right: 0; bottom: 0; pointer-events: none;" />

    <!-- 画布世界 -->
    <div class="canvas-world" :class="{ 'is-animating': store.isCanvasAnimating }" :style="{
      transform: `translate(${store.canvasState.x}px, ${store.canvasState.y}px) scale(${store.canvasState.scale})`
    }">
      <!-- SVG 页面连线 -->
      <CanvasConnections />

      <!-- 多画板页面列表 -->
      <PageFrame
        v-for="(page, idx) in store.pages"
        :key="page.id"
        :page="page"
        :page-index="idx"
      />
    </div>

    <!-- 全局画布初始化加载状态 -->
    <div v-if="store.isCanvasLoading" class="absolute inset-0 flex items-center justify-center z-40 bg-slate-50/70 backdrop-blur-sm">
      <div class="flex flex-col items-center justify-center p-8 bg-white/95 rounded-xl shadow-lg border border-slate-200/80">
        <a-spin :size="32" :tip="t('canvas.initializing')" />
        <span class="mt-3 text-xs text-slate-400">{{ t('canvas.preparingEnv') }}</span>
      </div>
    </div>

    <!-- 全局空状态提示（标准简约实线边框微圆角，与网格点阵自然融合） -->
    <div
      v-else-if="store.pages.length === 0"
      class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none"
    >
      <div
        class="pointer-events-auto flex flex-col items-center justify-center w-full max-w-[400px] mx-4 px-8 py-6 rounded-lg border border-slate-200/90 bg-white/95 shadow-sm transition-all duration-150"
      >
        <!-- 顶部轻拟物图标 -->
        <div class="w-9 h-9 rounded-md bg-blue-50 text-[#1677ff] flex items-center justify-center mb-2.5 border border-blue-100">
          <FilePlus2 class="w-4.5 h-4.5 stroke-[2]" />
        </div>

        <h3 class="mb-1 text-sm font-bold text-slate-800 tracking-tight">
          {{ t('canvas.noPages') }}
        </h3>
        <p class="mb-4 text-xs text-slate-500 text-center max-w-[280px] leading-relaxed m-0">
          {{ t('canvas.noPagesDesc') }}
        </p>

        <!-- 横排并列双按钮 (主按钮在左，次按钮在右，标准微圆角) -->
        <div class="flex items-center gap-2.5">
          <a-button
            type="primary"
            class="h-8 px-3.5 rounded bg-[#1677ff] text-xs font-medium flex items-center gap-1.5 shadow-2xs hover:bg-blue-600 transition-colors cursor-pointer"
            @click="$emit('open-create-canvas')"
          >
            <template #icon>
              <Plus class="h-3.5 w-3.5" />
            </template>
            {{ t('canvas.newCanvas') }}
          </a-button>

          <a-button
            class="h-8 px-3.5 rounded border border-slate-200 bg-white text-slate-700 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
            @click="$emit('open-template-gallery')"
          >
            <template #icon>
              <LayoutTemplate class="h-3.5 w-3.5 text-slate-500" />
            </template>
            {{ t('canvas.browseTemplates') }}
          </a-button>
        </div>
      </div>
    </div>

    <!-- 左上角 Figma UI3 独立悬浮胶囊小组件 (完全收起时浮现，1:1 还原 Figma 截图) -->
    <transition name="fade">
      <div
        v-if="!store.leftSidebarVisible"
        class="figma-floating-pill absolute left-4 top-[70px] z-30 flex items-center gap-2.5 px-3 py-1.5 bg-white/95 rounded-xl border border-slate-200/90 shadow-md backdrop-blur-md select-none transition-all duration-200 hover:shadow-lg hover:border-blue-300 cursor-pointer"
        @click="store.leftSidebarVisible = true"
      >
        <!-- 品牌 / Figma 风格 Logo -->
        <div class="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600">
          <Boxes class="w-3.5 h-3.5 stroke-[2.2]" />
        </div>

        <!-- 当前表单标题 (如无标题则显示 无标题) -->
        <span class="text-[13px] font-bold text-slate-800 tracking-tight max-w-[140px] truncate">
          {{ floatingTitle }}
        </span>

        <!-- 业务主体类型标签 (对标截图 免费 徽标) -->
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 leading-none">
          {{ floatingProfileBadge }}
        </span>

        <!-- 分隔细线 -->
        <div class="w-px h-3.5 bg-slate-200" />

        <!-- 侧边栏展开图标按钮 (对标 Figma 截图 ◨ 图标) -->
        <a-tooltip :content="t('canvas.expandSidebar')" position="bottom">
          <button
            type="button"
            class="flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
            @click.stop="store.leftSidebarVisible = true"
          >
            <PanelLeft class="w-4 h-4" />
          </button>
        </a-tooltip>
      </div>
    </transition>

    <!-- 右上角悬浮半透明展开属性面板按钮 (折叠时对称优雅浮现) -->
    <transition name="fade">
      <a-tooltip
        v-if="!store.rightSidebarVisible"
        :content="t('canvas.expandProperties')"
        position="left"
      >
        <button
          type="button"
          class="absolute right-3.5 top-[70px] z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95 group"
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
                {{ t('canvas.zoomIn') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘+' : 'Ctrl+' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="out" @click="handleZoomAction('out')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomOut') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘-' : 'Ctrl-' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="100" @click="handleZoomAction('100')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoom100') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧0' : 'Shift+0' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="fit" @click="handleZoomAction('fit')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomFit') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧1' : 'Shift+1' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="selection" @click="handleZoomAction('selection')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[170px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomSelection') }}
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
        :content="t('canvas.helpTooltip')"
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
      :title="t('canvas.helpModalTitle')"
      :footer="false"
      :width="500"
      draggable
      unmount-on-close
    >
      <div class="space-y-4 py-1 select-none">
        <!-- 视口与缩放 -->
        <div>
          <div class="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {{ t('canvas.secCanvasZoom') }}
          </div>
          <div class="grid grid-cols-1 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.zoomIn') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ +' : 'Ctrl +' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.zoomOut') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ -' : 'Ctrl -' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.zoom100') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 0' : 'Shift + 0' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.zoomFit') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 1' : 'Shift + 1' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.zoomSelection') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⇧ 2' : 'Shift + 2' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.panCanvas') }}
              </span>
              <span class="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
                <span>+</span>
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ t('canvas.leftDrag') }}</kbd>
              </span>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.smoothZoom') }}
              </span>
              <span class="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
                <span>+</span>
                <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white shadow-xs">{{ t('canvas.wheel') }}</kbd>
              </span>
            </div>
          </div>
        </div>

        <!-- 常用编辑快捷操作 -->
        <div>
          <div class="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {{ t('canvas.secFormEditing') }}
          </div>
          <div class="grid grid-cols-1 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.searchComponents') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ K' : 'Ctrl + K' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.contextMenu') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ t('canvas.rightClick') }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.inlineTextEdit') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ t('canvas.clickText') }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.duplicateElement') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                {{ isMac ? '⌘ D' : 'Ctrl + D' }}
              </kbd>
            </div>
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-700 font-medium">
                {{ t('canvas.deleteElement') }}
              </span>
              <kbd class="px-2 py-0.5 rounded border border-slate-200 bg-white font-mono text-[11px] text-slate-600 shadow-xs">
                Delete
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <a-button type="outline" class="rounded-lg" @click="handleRestartTour">
          <template #icon><Sparkles class="h-4 w-4 text-[#1677ff]" /></template>
          {{ t('canvas.productTour') }}
        </a-button>
        <a-button type="primary" class="rounded-lg px-5" @click="helpModalVisible = false">
          {{ t('canvas.gotIt') }}
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
  clearSelection,
  selectElement,
  selectPage,
  duplicateElement,
  deleteElement
} from '@/core/store';
import { t } from '@/core/i18n';
import CanvasConnections from './CanvasConnections.vue';
import PageFrame from './PageFrame.vue';
import ContextMenu from './ContextMenu.vue';
import {
  Plus,
  LayoutTemplate,
  FilePlus2,
  PanelLeft,
  PanelRight,
  Sparkles,
  Boxes
} from '@lucide/vue';
import { startAppTour } from '@/utils/useAppTour';

defineEmits(['open-template-gallery', 'open-create-canvas']);

const canvasContainerRef = ref<HTMLElement | null>(null);

const floatingTitle = computed(() => {
  if (store.currentLocale === 'en') {
    return store.meta.title_en?.trim() || store.meta.title?.trim() || t('header.untitledForm');
  }
  return store.meta.title?.trim() || t('header.untitledForm');
});

const floatingProfileBadge = computed(() => {
  const p = store.meta.profileType;
  if (p === 'individual') return t('canvas.profileIndividual');
  if (p === 'entity') return t('canvas.profileEntity');
  return t('canvas.profileCustomer');
});

// 谷歌 Stitch 原版 14px 黄金基准间距（缩放比例 0.7~0.8 时渲染为 10.5~11.2px，与 Google Stitch 10.6px 完全一致）
const currentGridSize = computed(() => {
  return Math.max(9, Math.min(22, Math.round(14 * store.canvasState.scale)));
});


// 谷歌 Bento / Stitch 风格微点阵光斑追踪与静止自动隐藏 (纯原生变量，0 Vue 响应式追踪开销)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let isMouseInside = false;
let spotlightOpacity = 0;
let rafId: number | null = null;
let lastMoveTime = 0;
const IDLE_TIMEOUT_MS = 1200; // 鼠标超过 1.2 秒未移动自动平滑淡出

function onCanvasMouseMove(e: MouseEvent) {
  if (!canvasContainerRef.value) return;
  const rect = canvasContainerRef.value.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  // 若处于静止淡出态或刚移入，瞬间对齐当前鼠标位置，确保绝对居中发散
  if (spotlightOpacity <= 0.01) {
    mouseX = currentX;
    mouseY = currentY;
  }
  targetX = currentX;
  targetY = currentY;
  isMouseInside = true;
  lastMoveTime = performance.now();

  // 按需唤醒：仅在动画未激活时启动 rAF 渲染，静止淡出后完全休眠，0% 空闲 CPU 开销
  if (!rafId) {
    rafId = requestAnimationFrame(updateSpotlight);
  }
}

function onCanvasMouseLeave() {
  isMouseInside = false;
  // 鼠标移出画布后，若动画已暂停则唤醒执行平滑淡出
  if (!rafId && spotlightOpacity > 0.005) {
    rafId = requestAnimationFrame(updateSpotlight);
  }
}

function updateSpotlight() {
  const now = performance.now();
  const timeSinceMove = now - lastMoveTime;
  const isMoving = isMouseInside && (timeSinceMove < IDLE_TIMEOUT_MS);
  const targetOpacity = isMoving ? 1 : 0;

  // 顺滑淡入与消退插值（移动时 0.15 渐入，静止超时 0.05 优雅慢消退）
  spotlightOpacity += (targetOpacity - spotlightOpacity) * (targetOpacity > spotlightOpacity ? 0.15 : 0.05);

  if (spotlightOpacity > 0.005) {
    // 鼠标坐标阻尼插值：响应敏捷，紧跟光标居中发散
    const dx = targetX - mouseX;
    const dy = targetY - mouseY;
    mouseX += dx * 0.25;
    mouseY += dy * 0.25;

    // 谷歌 Stitch 原版聚光灯扩散控制（精确对照采样）：紧凑半径 65px，移动活跃时微舒展至 75px
    const moveFactor = Math.max(0, 1 - timeSinceMove / 400);
    const radius = 65 + moveFactor * 10;

    if (canvasContainerRef.value) {
      canvasContainerRef.value.style.setProperty('--mouse-x', `${mouseX.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--mouse-y', `${mouseY.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--spotlight-radius', `${radius.toFixed(1)}px`);
      canvasContainerRef.value.style.setProperty('--spotlight-opacity', `${spotlightOpacity.toFixed(3)}`);
    }

    rafId = requestAnimationFrame(updateSpotlight);
  } else {
    // 完全静止且淡出完成：设为 0 并彻底休眠 rAF 循环，释放 CPU / GPU
    spotlightOpacity = 0;
    if (canvasContainerRef.value) {
      canvasContainerRef.value.style.setProperty('--spotlight-opacity', '0');
    }
    rafId = null;
  }
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
    const parentPage = store.pages.find(p => p.fields.some(f => f.id === store.selectedId));
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

function handleRestartTour() {
  helpModalVisible.value = false;
  setTimeout(() => {
    startAppTour();
  }, 250);
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
  const isCtrlDrag = e.button === 0 && (e.ctrlKey || e.metaKey);
  const isMiddleDrag = e.button === 1;
  const isBackgroundDrag =
    e.button === 0 &&
    (e.target === canvasContainerRef.value ||
      (e.target as HTMLElement).classList.contains('canvas-world') ||
      (e.target as HTMLElement).id === 'canvas-connections');

  if (isSpaceDrag || isCtrlDrag || isMiddleDrag || isBackgroundDrag) {
    e.preventDefault();
    store.isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartCanvasX = store.canvasState.x;
    panStartCanvasY = store.canvasState.y;
    document.body.classList.add('is-panning');

    if (e.button === 0 && !isSpaceDrag && !isCtrlDrag && !isMiddleDrag) {
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
    const left = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
    adjustZoom(nextScale - oldScale, e.clientX, e.clientY, { left, top: 0 } as DOMRect);
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

  // 辅助解析所属画板 ID（优先从 data-page-id 取真实 ID，次之兼容 id 解析与第一页回退）
  const getFramePageId = (el: HTMLElement | null): string | null => {
    if (!el) return null;
    return (
      el.getAttribute('data-page-id') ||
      (el.id?.startsWith('frame_') ? el.id.replace('frame_', '') : null) ||
      (el.id === 'tour-first-page-frame' ? store.pages[0]?.id : null)
    );
  };

  const resolvedPageId = getFramePageId(frameEl);

  if (elementEl && elementEl.id) {
    selectElement(elementEl.id);
    contextMenuTargetType.value = 'element';
    contextMenuTargetElementId.value = elementEl.id;
    contextMenuTargetPageId.value = resolvedPageId;
    if (resolvedPageId) {
      store.activePageId = resolvedPageId;
    }
  } else if (frameEl && resolvedPageId) {
    // 默认高亮选中当前画板，并展开属性面板
    selectPage(resolvedPageId);
    contextMenuTargetType.value = 'page';
    contextMenuTargetElementId.value = null;
    contextMenuTargetPageId.value = resolvedPageId;
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
  // 6. Duplicate Element: Ctrl/Cmd + D
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
    if (store.selectedType === 'element' && store.selectedId) {
      e.preventDefault();
      duplicateElement(store.selectedId);
    }
  }
  // 7. Delete Element: Delete / Backspace
  else if (e.key === 'Delete' || e.key === 'Backspace') {
    if (store.selectedType === 'element' && store.selectedId) {
      e.preventDefault();
      deleteElement(store.selectedId);
    }
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
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});
</script>
