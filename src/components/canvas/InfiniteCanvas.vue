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
    @scroll="onCanvasScroll"
    @contextmenu.prevent="onContextMenu"
  >
    <div id="tour-canvas-viewport" style="position: absolute; top: 56px; left: 0; right: 0; bottom: 0; pointer-events: none;" />

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
      <CanvasConnections v-if="!isRisk" />

      <PageFrame
        v-for="(page, idx) in (isRisk ? store.pages.slice(0, 1) : store.pages)"
        :key="page.id"
        :page="page"
        :page-index="idx"
      />
    </div>

    <transition name="fade">
      <div
        v-if="!store.leftSidebarVisible"
        class="figma-floating-pill absolute left-4 top-[70px] z-30 flex items-center gap-2.5 px-3 py-1.5 bg-white/95 rounded-xl border border-slate-200/90 shadow-md backdrop-blur-md select-none transition-all duration-200 hover:shadow-lg hover:border-blue-300 cursor-pointer"
        @click="store.leftSidebarVisible = true"
      >
        <div class="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 text-blue-600">
          <Boxes class="w-3.5 h-3.5 stroke-[2.2]" />
        </div>

        <span class="text-[13px] font-bold text-slate-800 tracking-tight max-w-[140px] truncate">
          {{ floatingTitle }}
        </span>

        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 leading-none">
          {{ floatingProfileBadge }}
        </span>

        <div class="w-px h-3.5 bg-slate-200" />

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


    <transition name="pill-bounce">
      <div
        v-if="isBilingual && store.pages.length > 0 && translationStats.untranslatedCount > 0 && !isPillDismissed"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-3.5 py-1.5 bg-white/95 text-slate-700 rounded-full shadow-md shadow-slate-900/5 border border-slate-200/90 backdrop-blur-md select-none pointer-events-auto transition-all text-xs"
      >

        <a-popover
          v-if="translationStats.untranslatedCount > 1"
          v-model:popup-visible="isPillPopoverOpen"
          trigger="click"
          position="top"
        >
          <button
            type="button"
            class="flex items-center gap-1.5 cursor-pointer hover:text-[#1677ff] transition-colors py-0.5 outline-none bg-transparent border-0 p-0 text-left"
            :title="isMissingZh ? t('canvas.todoZhTitle') : t('canvas.todoEnTitle')"
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
            <div class="w-[340px] max-h-[320px] flex flex-col -m-1">

              <div class="flex items-center justify-between gap-2 px-2 py-2.5 border-b border-slate-100  rounded-t-lg shrink-0">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span class="text-xs font-semibold text-slate-800 truncate whitespace-nowrap">
                    {{ isMissingZh ? t('canvas.todoZhTitle') : t('canvas.todoEnTitle') }}
                  </span>
                </div>
                <span class="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0 whitespace-nowrap leading-tight">
                  {{ t('canvas.todoTotalCount', undefined, { count: translationStats.untranslatedCount }) }}
                </span>
              </div>


              <div class="overflow-y-auto custom-scrollbar p-1 space-y-1.5 max-h-[240px]">
                <div
                  v-for="group in translationStats.groupedByPage"
                  :key="group.pageId"
                  class="space-y-0.5"
                >
                  <div class="text-[10.5px] font-semibold text-slate-400 px-1 pt-1 flex items-center gap-1">
                    <span class="truncate">{{ group.pageTitle }}</span>
                    <span class="text-slate-400">({{ group.items.length }})</span>
                  </div>

                  <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="flex items-center justify-between py-1 px-2 rounded text-xs hover:bg-blue-50/80 hover:text-[#1677ff] transition-all cursor-pointer group/item border border-transparent hover:border-blue-100"
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
          <span>{{ translationStats.untranslatedCount > 1 ? t('canvas.todoNextIndexed', undefined, { current: (currentUntranslatedIndex % translationStats.untranslatedCount) + 1, total: translationStats.untranslatedCount }) : t('canvas.todoLocate') }}</span>
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

    <div
      v-if="store.pages.length > 0"
      class="absolute bottom-8 right-8 z-50 flex items-center gap-2 select-none"
    >
      <a-tooltip :content="t('canvas.zoomFit') + (isMac ? ' (⇧1)' : ' (Shift+1)')" position="top">
        <button
          type="button"
          class="flex h-8 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95"
          :class="isCanvasOffScreen ? 'px-3 gap-1.5 border-blue-400/90 bg-blue-50/90 text-[#1677ff] shadow-sm' : 'w-8 px-0'"
          @click="resetCanvasView()"
        >
          <ArrowUp
            v-if="isCanvasOffScreen"
            class="w-3.5 h-3.5 text-[#1677ff] transition-transform duration-200 shrink-0"
            :style="{ transform: 'rotate(' + (offScreenDirection.angle + 90) + 'deg)' }"
          />
          <Maximize2 v-else class="w-3.5 h-3.5 shrink-0" />
          <span v-if="isCanvasOffScreen" class="text-xs font-semibold whitespace-nowrap">
            {{ t('canvas.backToContent') }}
          </span>
        </button>
      </a-tooltip>

      <a-dropdown
        v-model:popup-visible="isZoomMenuOpen"
        trigger="click"
        position="top"
        :popup-max-height="false"
      >
        <button
          type="button"
          class="flex h-8 min-w-[64px] cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 px-3.5 text-[13px] font-semibold text-slate-700 shadow-sm shadow-black/5 backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-md active:scale-95"
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
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘+' : 'Ctrl+' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="out" @click="handleZoomAction('out')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomOut') }}
              </span>
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⌘-' : 'Ctrl-' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="100" @click="handleZoomAction('100')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoom100') }}
              </span>
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧0' : 'Shift+0' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="fit" @click="handleZoomAction('fit')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomFit') }}
              </span>
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧1' : 'Shift+1' }}
              </span>
            </div>
          </a-doption>
          <a-doption value="selection" @click="handleZoomAction('selection')">
            <div class="flex items-center justify-between gap-6 w-full min-w-[185px] py-0.5 whitespace-nowrap">
              <span class="text-[13px] text-slate-700 font-medium whitespace-nowrap">
                {{ t('canvas.zoomSelection') }}
              </span>
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ isMac ? '⇧2' : 'Shift+2' }}
              </span>
            </div>
          </a-doption>
        </template>
      </a-dropdown>
    </div>


    <ContextMenu :visible="contextMenuVisible" :x="contextMenuPos.x" :y="contextMenuPos.y" :target-page-id="contextMenuTargetPageId" :target-element-id="contextMenuTargetElementId" :target-type="contextMenuTargetType" @close="contextMenuVisible = false" />


    <transition name="fade">
      <div
        v-if="store.isCanvasLoading"
        class="absolute inset-0 z-40 flex items-center justify-center pointer-events-none select-none bg-slate-50/40 backdrop-blur-[2px]"
      >
        <div class="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xl shadow-slate-200/60 backdrop-blur-md min-w-[200px]">
          <span class="text-[13px] font-semibold text-slate-700 tracking-tight mb-2.5">
            {{ t('canvas.initializing') }}
          </span>
          <div class="w-36 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-[#1677ff] rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  store,
  isRisk,
  getPageWidth,
  PAGE_HEIGHT,
  adjustZoom,
  resetCanvasView,
  focusOnPage,
  animateCanvasTransition,
  clearSelection,
  selectElement,
  selectPage,
  duplicateElement,
  deleteElement,
  isBilingual
} from '@/core/store';
import { t } from '@/core/i18n';
import CanvasConnections from './CanvasConnections.vue';
import PageFrame from './PageFrame.vue';
import ContextMenu from './ContextMenu.vue';
import {
  PanelLeft,
  PanelRight,
  Boxes,
  ArrowUp,
  Maximize2,
  ArrowRight,
  ChevronUp,
  X
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';
import { translationStats, navigateToUntranslatedItem, type UntranslatedItem } from '@/utils/translationHelper';

defineEmits(['open-template-gallery', 'open-create-canvas']);

const canvasContainerRef = ref<HTMLElement | null>(null);


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
    return store.meta.title_en?.trim() || t('header.untitledForm');
  }
  return store.meta.title?.trim() || t('header.untitledForm');
});

const floatingProfileBadge = computed(() => {
  const p = store.meta.profileType;
  if (p === 'individual') return t('canvas.profileIndividual');
  if (p === 'entity') return t('canvas.profileEntity');
  return t('canvas.profileCustomer');
});

const currentGridSize = computed(() => {
  return Math.max(9, Math.min(22, Math.round(14 * store.canvasState.scale)));
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let isMouseInside = false;
let spotlightOpacity = 0;
let rafId: number | null = null;
let lastMoveTime = 0;
const IDLE_TIMEOUT_MS = 1200;

function onCanvasMouseMove(e: MouseEvent) {
  if (!canvasContainerRef.value) return;
  const rect = canvasContainerRef.value.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  if (spotlightOpacity <= 0.01) {
    mouseX = currentX;
    mouseY = currentY;
  }
  targetX = currentX;
  targetY = currentY;
  isMouseInside = true;
  lastMoveTime = performance.now();

  if (!rafId) {
    rafId = requestAnimationFrame(updateSpotlight);
  }
}

function onCanvasMouseLeave() {
  isMouseInside = false;
  if (!rafId && spotlightOpacity > 0.005) {
    rafId = requestAnimationFrame(updateSpotlight);
  }
}

function onCanvasScroll() {
  if (canvasContainerRef.value) {
    if (canvasContainerRef.value.scrollTop !== 0) canvasContainerRef.value.scrollTop = 0;
    if (canvasContainerRef.value.scrollLeft !== 0) canvasContainerRef.value.scrollLeft = 0;
  }
}

function updateSpotlight() {
  const now = performance.now();
  const timeSinceMove = now - lastMoveTime;
  const isMoving = isMouseInside && (timeSinceMove < IDLE_TIMEOUT_MS);
  const targetOpacity = isMoving ? 1 : 0;

  spotlightOpacity += (targetOpacity - spotlightOpacity) * (targetOpacity > spotlightOpacity ? 0.15 : 0.05);

  if (spotlightOpacity > 0.005) {
    const dx = targetX - mouseX;
    const dy = targetY - mouseY;
    mouseX += dx * 0.25;
    mouseY += dy * 0.25;

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
    spotlightOpacity = 0;
    if (canvasContainerRef.value) {
      canvasContainerRef.value.style.setProperty('--spotlight-opacity', '0');
    }
    rafId = null;
  }
}

const contextMenuVisible = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });
const contextMenuTargetPageId = ref<string | null>(null);
const contextMenuTargetElementId = ref<string | null>(null);
const contextMenuTargetType = ref<'element' | 'page' | 'canvas'>('canvas');

let panStartX = 0;
let panStartY = 0;
let panStartCanvasX = 0;
let panStartCanvasY = 0;
let frameStartX = 0;
let frameStartY = 0;

const isZoomMenuOpen = ref(false);
const isCanvasOffScreen = ref(false);

const allPagesWorldBox = computed(() => {
  if (store.pages.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const pWidth = getPageWidth();
  store.pages.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x + pWidth > maxX) maxX = p.x + pWidth;
    if (p.y + PAGE_HEIGHT > maxY) maxY = p.y + PAGE_HEIGHT;
  });

  return { minX, minY, maxX, maxY };
});

function checkOffScreenStatus() {
  const box = allPagesWorldBox.value;
  if (!box || store.pages.length === 0) {
    isCanvasOffScreen.value = false;
    return;
  }

  const container = canvasContainerRef.value;
  const w = container?.clientWidth || window.innerWidth;
  const h = container?.clientHeight || window.innerHeight;
  const headerHeight = 56;

  const { x, y, scale } = store.canvasState;
  const screenMinX = x + box.minX * scale;
  const screenMaxX = x + box.maxX * scale;
  const screenMinY = y + box.minY * scale;
  const screenMaxY = y + box.maxY * scale;

  if (isCanvasOffScreen.value) {
    const hasReentered =
      screenMaxX > 100 &&
      screenMinX < w - 100 &&
      screenMaxY > headerHeight + 80 &&
      screenMinY < h - 80;

    if (hasReentered) {
      isCanvasOffScreen.value = false;
    }
  } else {
    const isCompletelyOut =
      screenMaxX < -10 ||
      screenMinX > w + 10 ||
      screenMaxY < headerHeight - 10 ||
      screenMinY > h + 10;

    if (isCompletelyOut) {
      isCanvasOffScreen.value = true;
    }
  }
}

watch([() => store.pages.length, () => store.canvasState.scale], () => {
  checkOffScreenStatus();
});

const offScreenDirection = computed(() => {
  const box = allPagesWorldBox.value;
  if (!box) return { angle: 0 };
  const container = canvasContainerRef.value;
  const cw = container?.clientWidth || window.innerWidth;
  const ch = container?.clientHeight || window.innerHeight;
  const headerHeight = 56;

  const viewCenterX = cw / 2;
  const viewCenterY = headerHeight + (ch - headerHeight) / 2;

  const { x, y, scale } = store.canvasState;
  const screenCenterX = x + ((box.minX + box.maxX) / 2) * scale;
  const screenCenterY = y + ((box.minY + box.maxY) / 2) * scale;

  const dx = screenCenterX - viewCenterX;
  const dy = screenCenterY - viewCenterY;

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  return { angle: angleDeg };
});
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
}

function zoomToSelection() {
  if (store.selectedId) {
    const directPage = store.pages.find(p => p.id === store.selectedId);
    if (directPage) {
      focusOnPage(directPage.id);
      return;
    }

    const parentPage = store.pages.find(p => p.fields.some(f => f.id === store.selectedId));
    if (parentPage) {
      focusOnPage(parentPage.id);
      return;
    }
  }

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
    store.isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartCanvasX = store.canvasState.x;
    panStartCanvasY = store.canvasState.y;

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
    }
  }
}

function onMouseMove(e: MouseEvent) {
  if (store.isPanning) {
    e.preventDefault();
    if (Math.hypot(e.clientX - panStartX, e.clientY - panStartY) > 3) {
      document.body.classList.add('is-panning');
    }
    store.canvasState.x = panStartCanvasX + (e.clientX - panStartX);
    store.canvasState.y = panStartCanvasY + (e.clientY - panStartY);
    checkOffScreenStatus();
  } else if (store.isDraggingFrame && store.draggedFrameId) {
    e.preventDefault();
    if (Math.hypot(e.clientX - panStartX, e.clientY - panStartY) > 3) {
      document.body.classList.add('is-panning');
    }
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
    checkOffScreenStatus();
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


  if (e.ctrlKey || e.metaKey) {
    const oldScale = store.canvasState.scale;
    const nextScale = oldScale * Math.exp(-e.deltaY * 0.0016);
    const left = store.leftSidebarVisible ? store.leftSidebarWidth : 0;
    adjustZoom(nextScale - oldScale, e.clientX, e.clientY, { left, top: 0 } as DOMRect);
  checkOffScreenStatus();
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

  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  const isKeyD = e.code === 'KeyD' || (e.key && e.key.toLowerCase() === 'd');

  if (isCtrlOrCmd && isKeyD) {
    e.preventDefault();
    e.stopPropagation();

    if (store.selectedType === 'element' && store.selectedId) {
      duplicateElement(store.selectedId);
      Message.success(t('canvas.componentDuplicated'));
    } else {
      Message.info(t('canvas.selectToDuplicate'));
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

  if (isCtrlOrCmd && (e.key === '=' || e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd')) {
    e.preventDefault();
    adjustZoom(0.1);
  } else if (isCtrlOrCmd && (e.key === '-' || e.key === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract')) {
    e.preventDefault();
    adjustZoom(-0.1);
  } else if (
    (isCtrlOrCmd && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0')) ||
    (e.shiftKey && (e.key === '0' || e.key === ')' || e.code === 'Digit0' || e.code === 'Numpad0') && !isCtrlOrCmd)
  ) {
    e.preventDefault();
    handleZoomAction('100');
  } else if (e.shiftKey && (e.key === '1' || e.key === '!' || e.code === 'Digit1' || e.code === 'Numpad1') && !isCtrlOrCmd) {
    e.preventDefault();
    handleZoomAction('fit');
  } else if (e.shiftKey && (e.key === '2' || e.key === '@' || e.code === 'Digit2' || e.code === 'Numpad2') && !isCtrlOrCmd) {
    e.preventDefault();
    handleZoomAction('selection');
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
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

function handleWindowResize() {
  if (isRisk.value && store.pages.length > 0) {
    resetCanvasView({ duration: 0 });
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', handleKeyDown, true);
  window.removeEventListener('keyup', handleKeyUp, true);
  window.removeEventListener('resize', handleWindowResize);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
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
