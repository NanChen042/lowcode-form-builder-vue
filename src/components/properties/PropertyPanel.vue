<template>
  <aside
    id="tour-property-panel"
    class="relative min-h-0 flex flex-col border-l border-[#f0f0f0] bg-white overflow-hidden shrink-0 z-30"
    :class="{
      'transition-all duration-300 ease-in-out': !isResizing,
      '!w-0 !opacity-0 border-none pointer-events-none': !store.rightSidebarVisible
    }"
    :style="{
      width: store.rightSidebarVisible ? `${store.rightSidebarWidth}px` : '0px'
    }"
  >
    <!-- 左侧可拖拽拉伸边框把手 (Min: 260px, Max: 520px, Default: 300px) -->
    <div
      v-if="store.rightSidebarVisible"
      class="sidebar-resize-handle-left absolute left-0 top-0 bottom-0 w-2 -ml-1 cursor-col-resize hover:bg-[#1677ff]/40 active:bg-[#1677ff] transition-colors z-40 group select-none flex items-center justify-center"
      :class="{ 'bg-[#1677ff]/60': isResizing }"
      :title="t('prop.resizeHandleTip')"
      @mousedown.prevent="startResize"
    >
      <div class="w-0.5 h-6 rounded-full bg-slate-300 group-hover:bg-[#1677ff] transition-colors"></div>
    </div>

    <!-- 内部固定宽度抽屉容器：保证折叠/展开动画与左侧栏完全一致 -->
    <div
      class="flex h-full min-h-0 flex-col shrink-0"
      :style="{ width: `${store.rightSidebarWidth}px` }"
    >
      <section class="flex flex-1 min-h-0 flex-col w-full">
        <!-- 头部：标题与 ID 徽章 -->
        <div class="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3 shrink-0">
          <div>
            <h2 class="m-0 text-sm font-semibold leading-5 text-slate-800">{{ t('prop.title') }}</h2>
            <p class="m-0 text-[11px] leading-4 text-slate-400">
              {{ store.selectedType === 'page' ? t('prop.pageSubtitle') : (selectedElement ? t('prop.elementSubtitle') : t('prop.emptyTitle')) }}
            </p>
          </div>
          <div class="flex items-center gap-1.5">
            <a-tag v-if="store.selectedId" color="arcoblue" size="small" class="font-mono">
              {{ headerBadgeText }}
            </a-tag>
            <a-tooltip :content="t('prop.collapsePanel')" position="bottom">
              <button
                type="button"
                class="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                @click="store.rightSidebarVisible = false"
              >
                <PanelRight class="h-3.5 w-3.5" />
              </button>
            </a-tooltip>
          </div>
        </div>

        <!-- 语言模式快捷指示与切换器 (带双语完备率百分比指示) -->
        <div
          class="px-3.5 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0 gap-2"
          :title="store.currentLocale === 'en' ? t('prop.configuringEnMode') : t('prop.configuringZhMode')"
        >
          <span class="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <Globe class="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{{ t('prop.editLanguage') }}</span>
          </span>
          <div class="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-[11px] select-none shadow-2xs shrink-0 whitespace-nowrap">
            <button
              type="button"
              class="flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium leading-none whitespace-nowrap shrink-0"
              :class="store.currentLocale === 'zh' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              :title="t('prop.zhCompleteness', undefined, { percent: translationStats.zhPercent })"
              @click="store.currentLocale = 'zh'"
            >
              <span>中文</span>
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="translationStats.zhPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
              />
              <span class="text-[10px] text-slate-400 font-normal">({{ translationStats.zhPercent }}%)</span>
            </button>
            <button
              type="button"
              class="flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium leading-none whitespace-nowrap shrink-0"
              :class="store.currentLocale === 'en' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              :title="t('prop.enCompleteness', undefined, { percent: translationStats.enPercent })"
              @click="store.currentLocale = 'en'"
            >
              <span>EN</span>
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="translationStats.enPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
              />
              <span class="text-[10px] text-slate-400 font-normal">({{ translationStats.enPercent }}%)</span>
            </button>
          </div>
        </div>

        <!-- 未选中空状态 -->
        <div v-if="!store.selectedType" class="flex flex-1 items-center justify-center p-6 text-center">
          <a-empty :description="t('prop.emptyTitle')">
            <template #image>
              <SlidersHorizontal class="h-10 w-10 text-slate-300 mx-auto" />
            </template>
            <span class="text-xs text-slate-400">{{ t('prop.emptyDesc') }}</span>
          </a-empty>
        </div>

        <!-- 1. 画布页面属性配置子组件 -->
        <PagePropsEditor
          v-else-if="store.selectedType === 'page' && selectedPage"
          :page="selectedPage"
        />

        <!-- 2. 组件字段属性配置区 -->
        <div v-else-if="selectedElement" class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 space-y-5">
          <a-form id="prop-editor" :model="selectedElement" layout="vertical" size="small">
            <!-- 2.1 字段基础配置（标题、副标题排布、占位、必填、多选） -->
            <FieldBasicProps :element="selectedElement" />

            <!-- 2.2 字段特化属性配置（格式类型、行数、默认区号、预设国家、提示内容、选项配置、日期模式等） -->
            <FieldSpecificProps
              :element="selectedElement"
              @open-country-modal="openCountryListModal"
            />

            <!-- 2.3 条件联动逻辑配置卡片 -->
            <FieldDependencyCard :element="selectedElement" />

            <!-- 2.4 底部操作按钮：复制 / 删除 -->
            <div class="pt-5 border-t border-slate-100 flex gap-2">
              <a-button type="secondary" size="small" class="flex-1" @click="duplicateElement(selectedElement.id)">
                <template #icon>
                  <Copy class="h-3.5 w-3.5" />
                </template>
                {{ t('prop.copy') }}
              </a-button>

              <a-button status="danger" size="small" class="flex-1" @click="deleteElement(selectedElement.id)">
                <template #icon>
                  <Trash2 class="h-3.5 w-3.5" />
                </template>
                {{ t('prop.delete') }}
              </a-button>
            </div>
          </a-form>
        </div>
      </section>
    </div>
  </aside>

  <!-- 全球国家/国籍/区号统一预设清单弹窗 -->
  <CountryDirectoryModal v-model:visible="isCountryListModalVisible" />
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import {
  store,
  selectedElement,
  selectedPage,
  duplicateElement,
  deleteElement,
  triggerHighlight
} from '@/core/store';
import { t } from '@/core/i18n';
import { useSidebarResize } from '@/utils/useSidebarResize';
import { translationStats } from '@/utils/translationHelper';
import PagePropsEditor from './PagePropsEditor.vue';
import FieldBasicProps from './FieldBasicProps.vue';
import FieldSpecificProps from './FieldSpecificProps.vue';
import FieldDependencyCard from './FieldDependencyCard.vue';
import CountryDirectoryModal from './CountryDirectoryModal.vue';
import {
  SlidersHorizontal,
  Copy,
  Trash2,
  Globe,
  PanelRight
} from '@lucide/vue';

// 全球国家/国籍/区号统一预设清单弹窗状态
const isCountryListModalVisible = ref(false);

function openCountryListModal() {
  isCountryListModalVisible.value = true;
}

// 侧边栏拖拽拉伸
const { isResizing, startResize } = useSidebarResize({
  getWidth: () => store.rightSidebarWidth,
  setWidth: (newWidth) => {
    store.rightSidebarWidth = newWidth;
  },
  min: 260,
  max: 520,
  direction: 'left'
});

const headerBadgeText = computed(() => {
  if (store.selectedType === 'page') return store.selectedId || t('prop.page');
  if (store.selectedType === 'element') return store.selectedId || t('prop.unselected');
  return t('prop.unselected');
});

// 画布编辑与右侧属性栏双向高亮与平滑滚动同步
watch(
  () => store.focusedTarget,
  (target) => {
    if (!target) return;
    // 如果当前正在画布区域编辑输入，绝不强行抢夺光标焦点到右侧
    if (
      typeof document !== 'undefined' &&
      document.activeElement &&
      document.activeElement.closest('#tour-canvas-viewport, .canvas-viewport, .canvas-world, [contenteditable], input, textarea')
    ) {
      nextTick(() => {
        let targetInput: HTMLElement | null = null;
        if (target.field === 'label') {
          targetInput = document.getElementById('prop-label-input');
        } else if (target.field === 'title') {
          targetInput = document.getElementById('page-prop-title-input');
        } else if (target.field === 'help') {
          targetInput = document.getElementById('prop-help-input');
        } else if (target.field === 'description') {
          targetInput = document.getElementById('page-prop-desc-input');
        } else if (target.field === 'placeholder') {
          targetInput = document.getElementById('prop-placeholder-input');
        } else if (target.field === 'option' && target.optionIndex !== undefined) {
          const optionInputs = document.querySelectorAll('#options-editor input, #options-editor textarea');
          if (optionInputs && optionInputs[target.optionIndex]) {
            targetInput = optionInputs[target.optionIndex] as HTMLElement;
          }
        }
        if (targetInput) {
          targetInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          triggerHighlight(targetInput);
        }
      });
      return;
    }
    nextTick(() => {
      let targetInput: HTMLElement | null = null;
      if (target.field === 'label') {
        targetInput = document.getElementById('prop-label-input');
      } else if (target.field === 'title') {
        targetInput = document.getElementById('page-prop-title-input');
      } else if (target.field === 'help') {
        targetInput = document.getElementById('prop-help-input');
      } else if (target.field === 'description') {
        targetInput = document.getElementById('page-prop-desc-input');
      } else if (target.field === 'placeholder') {
        targetInput = document.getElementById('prop-placeholder-input');
      } else if (target.field === 'content') {
        targetInput = document.getElementById('prop-alert-content-input');
      } else if (target.field === 'option' && target.optionIndex !== undefined) {
        const optionInputs = document.querySelectorAll('#options-editor input, #options-editor textarea');
        if (optionInputs && optionInputs[target.optionIndex]) {
          targetInput = optionInputs[target.optionIndex] as HTMLElement;
        }
      }
      if (targetInput) {
        targetInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        triggerHighlight(targetInput);
      }
    });
  },
  { deep: true }
);
</script>

<style scoped>
:deep(.arco-form-item) {
  margin-bottom: 12px;
}
:deep(.arco-form-item-content-flex) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

/* 默认国际区号下拉悬浮层规范：国旗与国家名称紧凑在左，区号右对齐 */
:global(.dial-code-dropdown-popup) {
  min-width: 250px !important;
  max-width: min(420px, 92vw) !important;
}

:global(.dial-code-dropdown-popup .arco-select-dropdown) {
  width: 100% !important;
}

:global(.dial-code-dropdown-popup .arco-select-option),
:global(.dial-code-dropdown-popup .arco-select-option:hover),
:global(.dial-code-dropdown-popup .arco-select-option.arco-select-option-active),
:global(.dial-code-dropdown-popup .arco-select-option.arco-select-option-selected) {
  width: 100% !important;
  font-weight: 400 !important;
  padding: 0 12px !important;
}

:global(.dial-code-dropdown-popup .arco-select-option *) {
  font-weight: 400 !important;
}

:global(.dial-code-dropdown-popup .font-mono) {
  font-weight: 500 !important;
}

:global(.dial-code-dropdown-popup .arco-select-option-content) {
  width: 100% !important;
  flex: 1 1 auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>
