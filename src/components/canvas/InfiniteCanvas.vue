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

    <!-- 画布世界 (加载时柔和静默，就绪后平滑淡入) -->
    <div
      class="canvas-world transition-opacity duration-300 ease-out"
      :class="{
        'opacity-0': store.isCanvasLoading,
        'is-animating': store.isCanvasAnimating
      }"
      :style="{
        transform: `translate(${store.canvasState.x}px, ${store.canvasState.y}px) scale(${store.canvasState.scale})`
      }"
    >
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


    <!-- 画布底部居中：多语言待补齐/巡检浮动胶囊 (轻量非侵入、不遮挡顶栏、点击一键定位补齐) -->
    <transition name="pill-bounce">
      <div
        v-if="store.pages.length > 0 && translationStats.untranslatedCount > 0 && !isPillDismissed"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-3.5 py-1.5 bg-white/95 text-slate-700 rounded-full shadow-md shadow-slate-900/5 border border-slate-200/90 backdrop-blur-md select-none pointer-events-auto transition-all text-xs"
      >
        <!-- 左侧提示与微清单气泡 (多于 1 项时可点击展开查看全部) -->
        <a-popover
          v-if="translationStats.untranslatedCount > 1"
          v-model:popup-visible="isPillPopoverOpen"
          trigger="click"
          position="top"
        >
          <button
            type="button"
            class="flex items-center gap-1.5 cursor-pointer hover:text-[#1677ff] transition-colors py-0.5 outline-none bg-transparent border-0 p-0 text-left"
            :title="t('canvas.todoZhTitle')"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span class="font-medium text-[12px] text-slate-700 hover:text-[#1677ff] whitespace-nowrap">
              {{ pillTitle }}
            </span>
            <ChevronUp
              class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180 text-[#1677ff]': isPillPopoverOpen }"
            />
          </button>

          <template #content>
            <div class="w-[280px] max-h-[300px] flex flex-col -m-1">
              <!-- 气泡顶栏 -->
              <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/80 shrink-0">
                <span class="text-xs font-semibold text-slate-800">
                  {{ isMissingZh ? t('canvas.todoZhTitle') : t('canvas.todoEnTitle') }}
                </span>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200/60">
                  {{ t('canvas.todoTotalCount', undefined, { count: translationStats.untranslatedCount }) }}
                </span>
              </div>

              <!-- 清单滚动区 -->
              <div class="overflow-y-auto custom-scrollbar p-1.5 space-y-1.5 max-h-[220px]">
                <div
                  v-for="group in translationStats.groupedByPage"
                  :key="group.pageId"
                  class="space-y-0.5"
                >
                  <div class="text-[10.5px] font-semibold text-slate-400 px-1.5 pt-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                    <span class="truncate">{{ group.pageTitle }}</span>
                    <span class="text-slate-400">({{ group.items.length }})</span>
                  </div>

                  <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="flex items-center justify-between px-2 py-1 rounded text-xs hover:bg-blue-50/80 hover:text-[#1677ff] transition-all cursor-pointer group/item border border-transparent hover:border-blue-100"
                    @click="handleJumpToSpecificItem(item)"
                  >
                    <div class="min-w-0 flex-1 mr-2">
                      <div class="font-medium text-slate-700 group-hover/item:text-[#1677ff] truncate text-[11.5px]">
                        {{ item.fieldName }}
                      </div>
                      <div class="text-[10.5px] text-slate-400 group-hover/item:text-blue-500/80 truncate">
                        {{ item.targetLocale === 'zh' ? (store.currentLocale === 'en' ? 'EN' : '英文') : (store.currentLocale === 'en' ? 'ZH' : '中文') }}: {{ item.sourceText }}
                      </div>
                    </div>
                    <ArrowRight class="w-3 h-3 text-slate-300 group-hover/item:text-[#1677ff] shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </a-popover>

        <!-- 只有 1 项时，直接显示静态文案（无下拉箭头，保持极致精简） -->
        <div v-else class="flex items-center gap-1.5 py-0.5 select-none">
          <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
          <span class="font-medium text-[12px] text-slate-700 whitespace-nowrap">
            {{ pillTitle }}
          </span>
        </div>

        <div class="w-px h-3.5 bg-slate-200 shrink-0" />
        <button
          type="button"
          class="flex items-center gap-1 font-medium text-[#1677ff] hover:text-blue-700 transition-colors cursor-pointer text-[12px] px-1 py-0.5 whitespace-nowrap active:scale-95"
          @click="handleJumpToCurrentUntranslated"
        >
          <span>{{ translationStats.untranslatedCount > 1 ? (store.currentLocale === 'en' ? `Next (${(currentUntranslatedIndex % translationStats.untranslatedCount) + 1}/${translationStats.untranslatedCount})` : `下一项 (${(currentUntranslatedIndex % translationStats.untranslatedCount) + 1}/${translationStats.untranslatedCount})`) : t('canvas.todoLocate') }}</span>
          <ArrowRight class="w-3 h-3" />
        </button>
        <button
          type="button"
          class="flex items-center justify-center w-4 h-4 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-0.5"
          :title="t('canvas.todoIgnore')"
          @click="isPillDismissed = true"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition>

    <!-- 悬浮画布控制与帮助组 (对标 Google Stitch 极简双胶囊/圆形原生设计，彻底移除加减号) -->
    <!-- 悬浮画布控制与帮助组 (现代化高级白色毛玻璃 + Arco 原生组件) -->
    <div
      v-if="store.pages.length > 0"
      class="absolute bottom-8 right-8 z-50 flex items-center gap-2 select-none"
    >
      <!-- 缩放控制胶囊按钮与 Arco 原生下拉菜单 -->
      <a-dropdown
        v-model:popup-visible="isZoomMenuOpen"
        trigger="click"
        position="top"
        :popup-max-height="false"
      >
        <button
          type="button"
          class="flex h-8 min-w-[64px] cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 px-3.5 font-mono text-[13px] font-semibold text-slate-700 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95"
          :class="{ 'border-blue-400/80 bg-white text-[#1677ff] shadow-md': isZoomMenuOpen }"
        >
          {{ Math.round(store.canvasState.scale * 100) }}%
        </button>
        <template #content>
          <a-doption value="in" @click="handleZoomAction('in')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomIn') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘+' : 'Ctrl+' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="out" @click="handleZoomAction('out')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomOut') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘-' : 'Ctrl-' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="100" @click="handleZoomAction('100')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoom100') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧0' : 'Shift+0' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="fit" @click="handleZoomAction('fit')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomFit') }}
              </span>
              <span class="font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧1' : 'Shift+1' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="selection" @click="handleZoomAction('selection')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
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
    </div>

    <!-- 右键菜单 -->
    <ContextMenu :visible="contextMenuVisible" :x="contextMenuPos.x" :y="contextMenuPos.y" :target-page-id="contextMenuTargetPageId" :target-element-id="contextMenuTargetElementId" :target-type="contextMenuTargetType" @close="contextMenuVisible = false" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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
  PanelLeft,
  PanelRight,
  Boxes,
  ArrowRight,
  ChevronUp,
  X
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';
import { translationStats, navigateToUntranslatedItem, type UntranslatedItem } from '@/utils/translationHelper';

defineEmits(['open-template-gallery', 'open-create-canvas']);

const canvasContainerRef = ref<HTMLElement | null>(null);

// 底部巡检胶囊相关状态
const isPillDismissed = ref(false);
const isPillPopoverOpen = ref(false);
const currentUntranslatedIndex = ref(0);

function handleJumpToSpecificItem(item: UntranslatedItem) {
  isPillPopoverOpen.value = false;
  navigateToUntranslatedItem(item);
  Message.info({
    content: `${item.pageTitle} · ${item.fieldName}`,
    duration: 1200
  });
}

const isMissingZh = computed(() => {
  return translationStats.value.untranslatedItems[0]?.targetLocale === 'zh';
});

const pillTitle = computed(() => {
  const count = translationStats.value.untranslatedCount;
  if (count === 1) {
    const item = translationStats.value.untranslatedItems[0];
    const fieldName = item ? ` (${item.fieldName})` : '';
    const base = isMissingZh.value
      ? t('canvas.todoZhCount', undefined, { count: 1 })
      : t('canvas.todoEnCount', undefined, { count: 1 });
    return `${base}${fieldName}`;
  }
  return isMissingZh.value
    ? t('canvas.todoZhCount', undefined, { count })
    : t('canvas.todoEnCount', undefined, { count });
});

function handleJumpToCurrentUntranslated() {
  const items = translationStats.value.untranslatedItems;
  if (!items.length) return;
  const idx = currentUntranslatedIndex.value % items.length;
  const item = items[idx];
  navigateToUntranslatedItem(item);
  Message.info({
    content: `${item.pageTitle} · ${item.fieldName} (${idx + 1}/${items.length})`,
    duration: 1200
  });
  currentUntranslatedIndex.value = (idx + 1) % items.length;
}

watch(
  () => translationStats.value.untranslatedCount,
  (newCount, oldCount) => {
    if (newCount > (oldCount || 0)) {
      isPillDismissed.value = false;
    }
  }
);

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

// 平移鼠标跟踪与微阻尼物理顺滑跟随状态
let panStartX = 0;
let panStartY = 0;
let panStartCanvasX = 0;
let panStartCanvasY = 0;
let targetCanvasX = 0;
let targetCanvasY = 0;
let panRafId: number | null = null;
let frameStartX = 0;
let frameStartY = 0;

// 微阻尼平滑平移物理引擎（方案一：对齐 Figma / Google Stitch 高级空气阻尼质感）
function updateSmoothPan() {
  const dx = targetCanvasX - store.canvasState.x;
  const dy = targetCanvasY - store.canvasState.y;

  if (store.isPanning) {
    // 拖拽平移中：柔和微阻尼物理跟随（0.28 阻尼系数，完美吸收人手微颤与急停，质感极度柔和丝滑）
    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      store.canvasState.x += dx * 0.28;
      store.canvasState.y += dy * 0.28;
    } else {
      store.canvasState.x = targetCanvasX;
      store.canvasState.y = targetCanvasY;
    }
    panRafId = requestAnimationFrame(updateSmoothPan);
  } else {
    // 鼠标释放后：柔和微衰减贴合至目标终点，彻底消除急停机械感与突兀感
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      store.canvasState.x += dx * 0.28;
      store.canvasState.y += dy * 0.28;
      panRafId = requestAnimationFrame(updateSmoothPan);
    } else {
      store.canvasState.x = targetCanvasX;
      store.canvasState.y = targetCanvasY;
      panRafId = null;
    }
  }
}

// 缩放预设菜单状态与动作
const isZoomMenuOpen = ref(false);
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || '');

function zoomTo100() {
  const oldScale = store.canvasState.scale;
  if (Math.abs(oldScale - 1.0) < 0.001) return;
  animateCanvasTransition(300);
  const leftWidth = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
  const rightWidth = store.rightSidebarVisible ? store.rightSidebarWidth : 0;
  const viewportWidth = Math.max(320, window.innerWidth - leftWidth - rightWidth);
  const viewportHeight = Math.max(320, window.innerHeight - 56);
  const centerX = leftWidth + viewportWidth / 2;
  const centerY = 56 + viewportHeight / 2;
  const worldX = (centerX - store.canvasState.x) / oldScale;
  const worldY = (centerY - store.canvasState.y) / oldScale;
  store.canvasState.scale = 1.0;
  store.canvasState.x = centerX - worldX;
  store.canvasState.y = centerY - worldY;
  targetCanvasX = store.canvasState.x;
  targetCanvasY = store.canvasState.y;
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

function onMouseDown(e: MouseEvent) {
  if (isZoomMenuOpen.value) {
    isZoomMenuOpen.value = false;
  }
  if (contextMenuVisible.value) {
    contextMenuVisible.value = false;
  }
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
    if (panRafId) {
      cancelAnimationFrame(panRafId);
      panRafId = null;
    }
    store.isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartCanvasX = store.canvasState.x;
    panStartCanvasY = store.canvasState.y;
    targetCanvasX = store.canvasState.x;
    targetCanvasY = store.canvasState.y;
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
    targetCanvasX = panStartCanvasX + (e.clientX - panStartX);
    targetCanvasY = panStartCanvasY + (e.clientY - panStartY);
    if (!panRafId) {
      panRafId = requestAnimationFrame(updateSmoothPan);
    }
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
    // 若平移结束时仍有微小距离，唤醒动画平滑衰减贴合终点
    if (!panRafId) {
      const dx = targetCanvasX - store.canvasState.x;
      const dy = targetCanvasY - store.canvasState.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        panRafId = requestAnimationFrame(updateSmoothPan);
      }
    }
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
  e.preventDefault();

  if (panRafId) {
    cancelAnimationFrame(panRafId);
    panRafId = null;
  }

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

  targetCanvasX = store.canvasState.x;
  targetCanvasY = store.canvasState.y;
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

  // 1. 全局最高优先拦截 Ctrl/Cmd + D 复制组件（在任何输入框检查之前拦截，彻底封死浏览器添加书签弹窗）
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  const isKeyD = e.code === 'KeyD' || (e.key && e.key.toLowerCase() === 'd');

  if (isCtrlOrCmd && isKeyD) {
    e.preventDefault();
    e.stopPropagation();

    if (store.selectedType === 'element' && store.selectedId) {
      duplicateElement(store.selectedId);
      Message.success(store.currentLocale === 'en' ? 'Component duplicated (Ctrl+D)' : '已复制所选组件 (Ctrl+D)');
    } else {
      Message.info(store.currentLocale === 'en' ? 'Please select a component on canvas to duplicate' : '请先在画布中选中要复制的组件');
    }
    return;
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
  if (isCtrlOrCmd && (e.key === '=' || e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd')) {
    e.preventDefault();
    adjustZoom(0.1);
  }
  // 2. Zoom out: Ctrl/Cmd + '-' or '_'
  else if (isCtrlOrCmd && (e.key === '-' || e.key === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract')) {
    e.preventDefault();
    adjustZoom(-0.1);
  }
  // 3. Zoom to 100% (还原): Shift+0 或 Ctrl/Cmd+0
  else if (
    (isCtrlOrCmd && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')) ||
    (e.shiftKey && (e.key === '0' || e.key === ')' || e.code === 'Digit0' || e.code === 'Numpad0') && !isCtrlOrCmd)
  ) {
    e.preventDefault();
    handleZoomAction('100');
  }
  // 4. Zoom to Fit: Shift+1
  else if (e.shiftKey && (e.key === '1' || e.key === '!' || e.code === 'Digit1' || e.code === 'Numpad1') && !isCtrlOrCmd) {
    e.preventDefault();
    handleZoomAction('fit');
  }
  // 5. Zoom to Selection: Shift+2
  else if (e.shiftKey && (e.key === '2' || e.key === '@' || e.code === 'Digit2' || e.code === 'Numpad2') && !isCtrlOrCmd) {
    e.preventDefault();
    handleZoomAction('selection');
  }
  // 6. Delete Element: Delete / Backspace
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
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', handleKeyDown, true);
  window.removeEventListener('keyup', handleKeyUp, true);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (panRafId) {
    cancelAnimationFrame(panRafId);
    panRafId = null;
  }
});
</script>

<style scoped>
.pill-bounce-enter-active,
.pill-bounce-leave-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pill-bounce-enter-from,
.pill-bounce-leave-to {
  opacity: 0;
  transform: translate(-50%, 14px) scale(0.96);
}
</style>
