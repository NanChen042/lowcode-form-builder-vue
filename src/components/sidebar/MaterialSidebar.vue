<template>
  <aside
    class="relative flex h-full shrink-0 flex-col border-r border-slate-200 bg-[#FAFAFA] font-sans text-slate-900 overflow-hidden"
    :class="{
      'transition-all duration-300 ease-in-out': !isResizing,
      '!w-0 !opacity-0 border-none pointer-events-none': !store.leftSidebarVisible
    }"
    :style="{
      width: store.leftSidebarVisible ? `${store.leftSidebarWidth}px` : '0px'
    }"
    @mouseenter="store.isLeftSidebarHovered = true"
    @mouseleave="store.isLeftSidebarHovered = false"
  >
    <!-- 内部固定宽度抽屉容器：保证折叠/展开动画过程中文字与组件不挤压重排 -->
    <div
      class="flex h-full min-h-0 flex-col shrink-0"
      :style="{ width: `${store.leftSidebarWidth}px` }"
    >
      <header class="flex-none border-b border-slate-200 bg-[#FAFAFA] px-4 pb-3 pt-4">
      <div class="flex flex-col gap-3 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-[15px] font-bold tracking-tight text-slate-800">{{ t('sidebar.title') }}</h2>
          </div>

          <div class="flex items-center gap-1">
            <a-tooltip :content="t('sidebar.searchPlaceholder')" position="bottom">
              <button class="relative flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-400 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none" :class="{ 'border-blue-500 bg-blue-50 text-blue-600': searchOpen }" type="button" @click="toggleSearch">
                <ChevronUp v-if="searchOpen" class="h-4 w-4 transition-all duration-300" />
                <Search v-else class="h-3.5 w-3.5 transition-all duration-300" />
              </button>
            </a-tooltip>

            <a-tooltip :content="store.currentLocale === 'en' ? 'Collapse sidebar' : '收起物料栏'" position="bottom">
              <button
                type="button"
                class="relative flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-400 transition-all duration-300 hover:bg-slate-200/60 hover:text-slate-700 focus:outline-none cursor-pointer"
                @click="store.leftSidebarVisible = false"
              >
                <PanelLeft class="h-4 w-4" />
              </button>
            </a-tooltip>
          </div>
        </div>

        <div class="flex items-center gap-1.5 px-1">
          <span class="h-1.5 w-1.5 rounded-full" :class="templateDotClass"></span>
          <span class="text-[11px] font-medium text-slate-500">
            {{ t('sidebar.currentTemplate') }}{{ templateLabel }}
          </span>
        </div>
      </div>

      <!-- 可折叠搜索框 -->
      <div class="transition-all duration-300 overflow-hidden" :class="searchOpen ? 'max-h-16 opacity-100 mt-3' : 'max-h-0 opacity-0'">
        <div class="relative">
          <a-input ref="searchInputRef" v-model="searchQuery" class="sidebar-search-box !h-[32px]" :placeholder="t('sidebar.searchPlaceholder')" allow-clear @keydown.esc="handleSearchEsc">
            <template #prefix>
              <Search class="h-4 w-4 text-slate-400" />
            </template>
            <template #suffix>
              <span v-if="!searchQuery" class="pointer-events-none inline-flex h-[18px] items-center justify-center rounded border border-slate-200 bg-slate-100/70 px-1.5 text-[10px] font-sans font-medium text-slate-400 leading-none select-none">
                {{ isMac ? '⌘K' : 'Ctrl+K' }}
              </span>
            </template>
          </a-input>
        </div>
      </div>
    </header>

    <main class="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-2">
      <!-- 创建方式 -->
      <div v-if="!searchQuery" class="mb-6 px-1 mt-4">
        <h3 class="mb-3 pl-1 text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
          {{ t('sidebar.createMethod') }}
        </h3>
        <div class="flex flex-col gap-1.5">
          <button type="button" class="group flex w-full items-center justify-between rounded-lg bg-[#1677ff] px-3.5 py-2.5 text-left shadow-sm transition-colors hover:bg-[#4096ff]" @click="$emit('open-template-gallery')">
            <div class="flex items-center gap-2">
              <LayoutTemplate class="h-4 w-4 text-white" />
              <span class="text-[12px] font-semibold text-white tracking-wide">{{ t('sidebar.createFromTemplate') }}</span>
            </div>
            <span class="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white backdrop-blur-sm">
              {{ templateBadge }}
            </span>
          </button>

          <button type="button" class="group flex w-full items-center justify-center gap-1.5 rounded-lg border border-transparent bg-transparent py-1.5 transition-colors hover:bg-slate-100" @click="handleNewBlank">
            <span class="text-[11px] font-medium text-slate-500 transition-colors group-hover:text-slate-700">
              {{ t('sidebar.newBlankCanvas') }}
            </span>
            <ArrowRight class="h-3 w-3 text-slate-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-slate-600" />
          </button>
        </div>
      </div>

      <!-- 物料组件分类列表 -->
      <div class="space-y-8 px-1">
        <!-- 基础输入 -->
        <section v-if="filteredBasicComponents.length > 0">
          <h3 class="mb-3 pl-1 text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            {{ t('sidebar.catBasic') }}
          </h3>
          <div id="components-basic" ref="basicGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2.5">
            <div
              v-for="item in filteredBasicComponents"
              :key="item.type + '_' + store.currentLocale"
              class="component-item select-none group flex cursor-pointer items-center rounded-md border border-slate-200 shadow-sm bg-white px-3 py-2 h-[36px] transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md active:bg-blue-50/60 active:border-blue-500"
              :data-type="item.type"
              @click="handleComponentClick(item.type)"
            >
              <!-- 侧边栏常态按钮形态 -->
              <div class="sidebar-btn-view flex w-full items-center gap-2.5 overflow-hidden">
                <component :is="getIcon(item.icon)" class="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 shrink-0" />
                <span class="truncate text-[12px] font-medium text-slate-600 transition-colors group-hover:text-blue-700">
                  {{ store.currentLocale === 'en' ? (item.label_en || item.label) : item.label }}
                </span>
              </div>

              <!-- 画布拖拽占位骨架形态（与画布内真实组件 100% 结构对齐，含红色必填星号与标准 32px 高度） -->
              <div class="canvas-ghost-skeleton pointer-events-none hidden w-full select-none text-left">
                <component :is="getGhostComponent(item.type)" :element="getGhostElement(item.type)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 业务组件 -->
        <section v-if="filteredBusinessComponents.length > 0">
          <h3 class="mb-3 pl-1 text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            {{ t('sidebar.catBusiness') }}
          </h3>
          <div id="components-business" ref="businessGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2.5">
            <div
              v-for="item in filteredBusinessComponents"
              :key="item.type + '_' + store.currentLocale"
              class="component-item select-none group flex cursor-pointer items-center rounded-md border border-slate-200 shadow-sm bg-white px-3 py-2 h-[36px] transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md active:bg-blue-50/60 active:border-blue-500"
              :data-type="item.type"
              @click="handleComponentClick(item.type)"
            >
              <!-- 侧边栏常态按钮形态 -->
              <div class="sidebar-btn-view flex w-full items-center gap-2.5 overflow-hidden">
                <component :is="getIcon(item.icon)" class="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 shrink-0" />
                <span class="truncate text-[12px] font-medium text-slate-600 transition-colors group-hover:text-blue-700">
                  {{ store.currentLocale === 'en' ? (item.label_en || item.label) : item.label }}
                </span>
              </div>

              <!-- 画布拖拽占位骨架形态（与画布内真实组件 100% 结构对齐，含红色必填星号与标准 32px 高度） -->
              <div class="canvas-ghost-skeleton pointer-events-none hidden w-full select-none text-left">
                <component :is="getGhostComponent(item.type)" :element="getGhostElement(item.type)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 高级布局 -->
        <section v-if="filteredLayoutComponents.length > 0">
          <h3 class="mb-3 pl-1 text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            {{ t('sidebar.catLayout') }}
          </h3>
          <div id="components-layout" ref="layoutGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2.5">
            <div
              v-for="item in filteredLayoutComponents"
              :key="item.type + '_' + store.currentLocale"
              class="component-item select-none group flex cursor-pointer items-center rounded-md border border-slate-200 shadow-sm bg-white px-3 py-2 h-[36px] transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md active:bg-blue-50/60 active:border-blue-500"
              :data-type="item.type"
              @click="handleComponentClick(item.type)"
            >
              <!-- 侧边栏常态按钮形态 -->
              <div class="sidebar-btn-view flex w-full items-center gap-2.5 overflow-hidden">
                <component :is="getIcon(item.icon)" class="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500 shrink-0" />
                <span class="truncate text-[12px] font-medium text-slate-600 transition-colors group-hover:text-blue-700">
                  {{ store.currentLocale === 'en' ? (item.label_en || item.label) : item.label }}
                </span>
              </div>

              <!-- 画布拖拽占位骨架形态（与画布内真实组件 100% 结构对齐，含红色必填星号与标准 32px 高度） -->
              <div class="canvas-ghost-skeleton pointer-events-none hidden w-full select-none text-left">
                <component :is="getGhostComponent(item.type)" :element="getGhostElement(item.type)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 无搜索结果 -->
        <div v-if="noSearchResult" class="rounded-md border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-[12px] leading-5 text-slate-400">
          {{ t('sidebar.searchEmpty') }}
        </div>
      </div>
    </main>
  </div>

  <!-- 右侧可拖拽拉伸边框把手 (Min: 240px, Max: 480px, Default: 300px) -->
  <div
    v-if="store.leftSidebarVisible"
    class="sidebar-resize-handle-right absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-[#1677ff]/40 active:bg-[#1677ff] transition-colors z-40 group select-none flex items-center justify-center"
    :class="{ 'bg-[#1677ff]/60': isResizing }"
    title="拖拽拉伸物料面板宽度"
    @mousedown.prevent="startResize"
  >
    <div class="w-0.5 h-6 rounded-full bg-slate-300 group-hover:bg-[#1677ff] transition-colors"></div>
  </div>

  <!-- 确认新建空白画布弹窗 (标准普通简洁样式) -->
  <a-modal
    v-model:visible="isBlankConfirmVisible"
    :title="t('sidebar.newBlankConfirmTitle')"
    :title-align="'start'"
    :width="420"
    :ok-text="t('sidebar.confirmOk')"
    :cancel-text="t('sidebar.cancel')"
    :ok-button-props="{ status: 'warning' }"
    unmount-on-close
    @ok="executeNewBlank"
  >
    <div class="text-[13px] text-slate-600 leading-relaxed py-1">
      {{ t('sidebar.newBlankConfirmContent') }}
    </div>
  </a-modal>
</aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { store, addElement, loadSchema, createElement } from '@/core/store';
import { t } from '@/core/i18n';
import { componentRegistry, getComponentIcon, type ComponentMeta } from '@/registry/components';
import { blankTemplate } from '@/templates/recommend';
import { syncDragPlaceholderHeight } from '@/utils/helpers';
import type { ComponentType, FormElement } from '@/types/schema';
import Sortable from 'sortablejs';
import InputElement from '@/components/canvas/elements/InputElement.vue';
import TextareaElement from '@/components/canvas/elements/TextareaElement.vue';
import SelectElement from '@/components/canvas/elements/SelectElement.vue';
import RadioElement from '@/components/canvas/elements/RadioElement.vue';
import CheckboxElement from '@/components/canvas/elements/CheckboxElement.vue';
import DateElement from '@/components/canvas/elements/DateElement.vue';
import CountryElement from '@/components/canvas/elements/CountryElement.vue';
import NationalityElement from '@/components/canvas/elements/NationalityElement.vue';
import SignatureElement from '@/components/canvas/elements/SignatureElement.vue';
import AlertElement from '@/components/canvas/elements/AlertElement.vue';
import PhoneElement from '@/components/canvas/elements/PhoneElement.vue';
import EmailElement from '@/components/canvas/elements/EmailElement.vue';
import {
  Search,
  ChevronUp,
  LayoutTemplate,
  ArrowRight,
  PanelLeft
} from '@lucide/vue';

defineEmits(['open-template-gallery']);

// 侧边栏拖拽拉伸
const isResizing = ref(false);

function startResize(e: MouseEvent) {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = store.leftSidebarWidth;

  const onMouseMove = (moveEvent: MouseEvent) => {
    // 拖向右侧增加宽度，拖向左侧减小宽度
    const deltaX = moveEvent.clientX - startX;
    const newWidth = Math.max(240, Math.min(480, startWidth + deltaX));
    store.leftSidebarWidth = Math.round(newWidth);
  };

  const onMouseUp = () => {
    isResizing.value = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

const searchOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

const basicGroupRef = ref<HTMLElement | null>(null);
const businessGroupRef = ref<HTMLElement | null>(null);
const layoutGroupRef = ref<HTMLElement | null>(null);

const isMac = ref(false);
onMounted(() => {
  isMac.value = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);

  // 绑定全局 ⌘K 搜索快捷键
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchOpen.value = true;
      nextTick(() => {
        searchInputRef.value?.focus();
        searchInputRef.value?.select();
      });
    }
  });

  // 初始化 Sortable 拖拽源
  initDragSources();
});

function initDragSources() {
  const dragOptions: Sortable.Options = {
    group: {
      name: 'shared',
      pull: 'clone',
      put: false
    },
    sort: false,
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'drag-chosen',
    fallbackClass: 'drag-fallback',
    forceFallback: true,
    fallbackOnBody: true,
    draggable: '.component-item',
    onStart(evt) {
      store.isDraggingComponent = true;
      document.body.classList.add('is-dragging-component');
      const type = evt.item?.getAttribute('data-type');
      if (type) {
        syncDragPlaceholderHeight(type);
      }
    },
    onEnd(evt) {
      store.isDraggingComponent = false;
      document.body.classList.remove('is-dragging-component');
      syncDragPlaceholderHeight(null);

      // 拖拽结束后，还原 Vue 真实响应式节点并移除 Sortable 遗留的静态 clone 节点，确保多语言与事件响应性不丢失
      if (evt.clone && evt.clone.parentNode && evt.item) {
        evt.clone.parentNode.replaceChild(evt.item, evt.clone);
      }
    }
  };

  if (basicGroupRef.value) new Sortable(basicGroupRef.value, dragOptions);
  if (businessGroupRef.value) new Sortable(businessGroupRef.value, dragOptions);
  if (layoutGroupRef.value) new Sortable(layoutGroupRef.value, dragOptions);
}

const getIcon = getComponentIcon;

const ghostComponentMap: Record<ComponentType, any> = {
  input: InputElement,
  textarea: TextareaElement,
  select: SelectElement,
  radio: RadioElement,
  checkbox: CheckboxElement,
  date: DateElement,
  country: CountryElement,
  nationality: NationalityElement,
  signature: SignatureElement,
  alert: AlertElement,
  phone: PhoneElement,
  email: EmailElement
};

function getGhostComponent(type: ComponentType) {
  return ghostComponentMap[type] || InputElement;
}

const ghostElements = computed<Record<ComponentType, FormElement>>(() => {
  const map: Partial<Record<ComponentType, FormElement>> = {};
  for (const type of Object.keys(componentRegistry) as ComponentType[]) {
    map[type] = createElement(type);
  }
  return map as Record<ComponentType, FormElement>;
});

function getGhostElement(type: ComponentType) {
  return ghostElements.value[type] || createElement(type);
}

const allComponents = computed<ComponentMeta[]>(() => Object.values(componentRegistry));

const filteredBasicComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return allComponents.value
    .filter(c => c.category === 'basic')
    .filter(c => !q || c.label.toLowerCase().includes(q) || c.label_en?.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
});

const filteredBusinessComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return allComponents.value
    .filter(c => c.category === 'business')
    .filter(c => !q || c.label.toLowerCase().includes(q) || c.label_en?.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
});

const filteredLayoutComponents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return allComponents.value
    .filter(c => c.category === 'layout')
    .filter(c => !q || c.label.toLowerCase().includes(q) || c.label_en?.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
});

const noSearchResult = computed(() => {
  return (
    searchQuery.value.trim().length > 0 &&
    filteredBasicComponents.value.length === 0 &&
    filteredBusinessComponents.value.length === 0 &&
    filteredLayoutComponents.value.length === 0
  );
});

const templateLabel = computed(() => {
  switch (store.activeTemplateKey) {
    case 'kyc-individual':
      return t('sidebar.tplIndividual');
    case 'kyc-entity':
      return t('sidebar.tplEntity');
    case 'saved':
      return t('sidebar.tplSaved');
    default:
      return t('sidebar.tplBlank');
  }
});

const templateDotClass = computed(() => {
  switch (store.activeTemplateKey) {
    case 'kyc-individual':
      return 'bg-emerald-500';
    case 'kyc-entity':
    case 'saved':
      return 'bg-blue-500';
    default:
      return 'bg-slate-400';
  }
});

const templateBadge = computed(() => {
  switch (store.activeTemplateKey) {
    case 'kyc-individual':
      return t('sidebar.badgePersonal');
    case 'kyc-entity':
      return t('sidebar.badgeEntity');
    default:
      return t('sidebar.badgeRecommend');
  }
});

function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    nextTick(() => searchInputRef.value?.focus());
  } else {
    searchQuery.value = '';
  }
}

function handleSearchEsc() {
  if (searchQuery.value) {
    searchQuery.value = '';
  } else {
    searchOpen.value = false;
  }
}

function handleComponentClick(type: ComponentType) {
  if (store.isDraggingComponent) return;
  const targetPageId = (store.selectedType === 'page' ? store.selectedId : null)
    || store.activePageId
    || undefined;
  addElement(type, targetPageId);
}

const isBlankConfirmVisible = ref(false);

function handleNewBlank() {
  isBlankConfirmVisible.value = true;
}

function executeNewBlank() {
  loadSchema(blankTemplate);
  store.activeTemplateKey = 'blank';
  isBlankConfirmVisible.value = false;
}
</script>
