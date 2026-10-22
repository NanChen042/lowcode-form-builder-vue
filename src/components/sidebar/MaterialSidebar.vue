<template>
  <aside
    id="tour-material-sidebar"
    class="relative flex h-full shrink-0 flex-row border-r border-slate-200 bg-[#FAFAFA] font-sans text-slate-900 overflow-hidden select-none"
    :class="{
      'transition-all duration-300 ease-in-out': !isResizing,
      '!w-0 !opacity-0 border-none pointer-events-none': !store.leftSidebarVisible
    }"
    :style="{
      width: store.leftSidebarVisible ? `${store.leftSidebarWidth}px` : '0px'
    }"
  >
    <div
      class="flex h-full min-h-0 flex-row shrink-0"
      :style="{ width: `${store.leftSidebarWidth}px` }"
    >
      <div class="flex flex-col items-center justify-between w-[64px] h-full shrink-0 border-r border-slate-200/90 bg-[#F8FAFC] py-3.5 z-20">
        <div id="tour-activity-bar" class="flex flex-col items-center gap-2 w-full px-1">
          <button
              type="button"
              class="figma-activity-btn"
              :class="{ active: activeTab === 'templates' }"
              @click="activeTab = 'templates'"
            >
              <LayoutTemplate class="h-4 w-4 shrink-0" />
              <span
                class="w-full text-center truncate px-0.5 leading-tight mt-0.5"
                :class="store.currentLocale === 'en' ? 'text-[9.5px] tracking-tight' : 'text-[10px]'"
              >
                {{ t('sidebar.templates') }}
              </span>
            </button>

            <button
              type="button"
              class="figma-activity-btn"
              :class="{ active: activeTab === 'components' }"
              @click="activeTab = 'components'"
            >
              <Component class="h-4 w-4 shrink-0" />
              <span
                class="w-full text-center truncate px-0.5 leading-tight mt-0.5"
                :class="store.currentLocale === 'en' ? 'text-[9.5px] tracking-tight' : 'text-[10px]'"
              >
                {{ t('sidebar.components') }}
              </span>
            </button>

            <button
              type="button"
              class="figma-activity-btn relative"
              :class="{ active: activeTab === 'pages' }"
              @click="activeTab = 'pages'"
            >
              <Files class="h-4 w-4 shrink-0" />
              <span
                class="w-full text-center truncate px-0.5 leading-tight mt-0.5"
                :class="store.currentLocale === 'en' ? 'text-[9.5px] tracking-tight' : 'text-[10px]'"
              >
                {{ t('sidebar.pages') }}
              </span>
              <span v-if="store.pages.length > 0" class="figma-page-count-badge">
                {{ store.pages.length }}
              </span>
            </button>
          </div>

        <div class="flex flex-col items-center gap-1 w-full px-1">
          <a-tooltip :content="t('header.tour')" position="right">
            <button
              id="tour-guide-btn"
              type="button"
              class="figma-activity-btn is-icon-only text-slate-400 hover:text-slate-700 cursor-pointer"
              :title="t('header.tour')"
              @click="handleTriggerTour"
            >
              <HelpCircle class="h-4 w-4" />
            </button>
          </a-tooltip>

          <a-dropdown trigger="click" position="tr" :popup-max-height="false" v-model:popup-visible="isSettingsDropdownOpen">
            <a-tooltip :content="t('app.settings')" position="right">
              <button
                type="button"
                class="figma-activity-btn is-icon-only text-slate-400 hover:text-slate-700 cursor-pointer"
                :title="t('app.settings')"
              >
                <Settings class="h-4 w-4" />
              </button>
            </a-tooltip>
            <template #content>
              <div class="p-2 space-y-2 min-w-[170px]">
                <div class="text-[12px] font-medium text-slate-400 px-1">{{ t('app.settings') }}</div>
                <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
                  <span class="text-[13px] text-slate-700">{{ t('app.leftSidebar') }}</span>
                  <a-switch v-model="store.leftSidebarVisible" size="small" />
                </div>
                <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
                  <span class="text-[13px] text-slate-700">{{ t('app.rightSidebar') }}</span>
                  <a-switch v-model="store.rightSidebarVisible" size="small" />
                </div>
              </div>
            </template>
          </a-dropdown>

          <a-tooltip :content="t('sidebar.tooltipCollapse')" position="right">
            <button
              type="button"
              class="figma-activity-btn is-icon-only text-slate-400 hover:text-slate-700 cursor-pointer"
              @click="store.leftSidebarVisible = false"
            >
              <PanelLeft class="h-4 w-4" />
            </button>
          </a-tooltip>
        </div>
      </div>

      <div id="tour-material-drawer" class="flex h-full min-h-0 flex-col flex-1 shrink-0 bg-[#FAFAFA] overflow-hidden">
        <header class="flex-none border-b border-slate-200/90 bg-[#FAFAFA] px-3.5 pb-2.5 pt-3">
          <div class="flex items-start justify-between mb-2">
            <div class="flex flex-col min-w-0 pr-2">
              <h2 class="text-[13px] font-bold tracking-tight text-slate-800 leading-tight truncate">
                {{ drawerTitle }}
              </h2>
              <span v-if="drawerSubtitle" class="text-[11px] text-slate-400 font-normal leading-tight mt-0.5 truncate">
                {{ drawerSubtitle }}
              </span>
            </div>

            <div class="flex items-center gap-1 shrink-0 pt-0.5">
              <a-tooltip v-if="activeTab !== 'pages'" :content="t('sidebar.searchTooltip')" position="bottom">
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 cursor-pointer"
                  :class="{ 'text-[#1677ff] bg-blue-50': searchOpen }"
                  @click="toggleSearch"
                >
                  <Search class="h-3.5 w-3.5" />
                </button>
              </a-tooltip>

              <a-tooltip :content="t('sidebar.collapseBtn')" position="bottom">
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 cursor-pointer"
                  @click="store.leftSidebarVisible = false"
                >
                  <PanelLeft class="h-3.5 w-3.5" />
                </button>
              </a-tooltip>
            </div>
          </div>

          <div v-if="searchOpen || activeTab === 'templates'" class="mt-1.5">
            <a-input
              ref="searchInputRef"
              v-model="searchQuery"
              class="figma-search-input"
              :placeholder="activeTab === 'templates' ? t('sidebar.searchTemplates') : t('sidebar.searchPlaceholder')"
              allow-clear
              size="small"
              @keydown.esc="handleSearchEsc"
            >
              <template #prefix>
                <Search class="h-3.5 w-3.5 text-slate-400" />
              </template>
              <template #suffix>
                <span v-if="!searchQuery && activeTab === 'components'" class="text-[10px] text-slate-400 font-mono">
                  {{ isMac ? '⌘K' : 'Ctrl+K' }}
                </span>
              </template>
            </a-input>
          </div>
        </header>

        <main class="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
          <div id="tour-template-panel" v-show="activeTab === 'templates'" class="flex flex-col">
            <button
              type="button"
              class="w-full flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-200/90 hover:border-[#1677ff] bg-white hover:bg-blue-50/30 text-slate-700 hover:text-[#1677ff] transition-all duration-150 cursor-pointer group shadow-2xs hover:shadow-xs"
              @click="$emit('open-create-canvas')"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="flex items-center justify-center w-7 h-7 rounded-md bg-blue-50 group-hover:bg-[#1677ff] text-[#1677ff] group-hover:text-white transition-colors shrink-0">
                  <Plus class="w-4 h-4 stroke-[2.2]" />
                </div>
                <div class="flex flex-col text-left min-w-0">
                  <span class="text-[12.5px] font-semibold text-slate-800 group-hover:text-[#1677ff] leading-tight">
                    {{ t('sidebar.createBlank') }}
                  </span>
                  <span class="text-[10.5px] text-slate-400 leading-tight mt-0.5 truncate">
                    {{ t('sidebar.createBlankDesc') }}
                  </span>
                </div>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1677ff] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </button>

            <div class="mt-3.5 mb-2 flex items-center justify-between px-0.5 text-[11px] font-medium text-slate-400 select-none">
              <span>{{ t('sidebar.presetScenarios') }}</span>
              <span class="font-mono text-[10.5px] text-slate-500 bg-slate-100/90 px-1.5 py-0.5 rounded-full">
                {{ filteredTemplates.length }}
              </span>
            </div>

            <div class="flex flex-col gap-3 pb-3">
              <div
                v-for="tpl in filteredTemplates"
                :key="tpl.key"
                class="group flex flex-col rounded-lg border border-slate-200/90 bg-white hover:border-[#1677ff] hover:shadow-xs transition-all duration-150 cursor-pointer select-none overflow-hidden"
                @click="handleSelectTemplate(tpl.key)"
              >
                <div
                  class="h-[88px] w-full border-b border-slate-100 flex items-center justify-center relative overflow-hidden select-none bg-slate-50"
                  :class="tpl.bannerBgClass"
                >
                  <img
                    :src="tpl.image"
                    :alt="getFieldText(tpl, 'title')"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                    loading="lazy"
                  />
                  <a-tag
                    size="small"
                    :color="tpl.tagColor"
                    class="absolute top-2 right-2 text-[10px] px-1.5 h-4.5 leading-none rounded shadow-2xs font-medium"
                  >
                    {{ getFieldText(tpl, 'tag') }}
                  </a-tag>
                </div>

                <div class="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <div class="mb-1 text-[13px] font-bold text-slate-800 group-hover:text-[#1677ff] transition-colors truncate">
                      {{ getFieldText(tpl, 'title') }}
                    </div>

                    <p class="text-[11.5px] text-slate-500 leading-[18px] m-0 mb-2 line-clamp-2 min-h-[36px]">
                      {{ getFieldText(tpl, 'desc') }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div class="flex items-center gap-1.5 text-slate-400 font-medium">
                      <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{{ getFieldText(tpl, 'stats') }}</span>
                    </div>
                    <div class="flex items-center gap-0.5 text-[#1677ff] font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150">
                      <span class="text-[11px]">{{ t('sidebar.useTemplate') }}</span>
                      <ArrowRight class="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="filteredTemplates.length === 0"
              class="rounded-lg border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-[12px] leading-5 text-slate-400"
            >
              {{ t('sidebar.searchEmpty') }}
            </div>
          </div>

          <div id="tour-component-panel" v-show="activeTab === 'components'" class="space-y-4">
            <section v-if="filteredBasicComponents.length > 0">
              <h3 class="mb-2 pl-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
                {{ t('sidebar.catBasic') }}
              </h3>
              <div id="components-basic" ref="basicGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2">
                <div
                  v-for="item in filteredBasicComponents"
                  :key="item.type + '_' + store.currentLocale"
                  class="component-item select-none group flex cursor-pointer items-center rounded-lg border border-slate-200/90 shadow-2xs bg-white px-2 py-1.5 h-[34px] transition-all hover:border-[#1677ff]/60 hover:bg-blue-50/40 hover:shadow-sm active:bg-blue-50/70 active:border-[#1677ff]"
                  :data-type="item.type"
                  :title="getFieldText(item, 'label')"
                  @click="handleComponentClick(item.type)"
                >
                  <div class="sidebar-btn-view flex w-full items-center gap-1.5 overflow-hidden">
                    <component :is="getIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-[#1677ff] shrink-0" />
                    <span
                      class="truncate font-medium text-slate-700 transition-colors group-hover:text-[#1677ff]"
                      :class="store.currentLocale === 'en' ? 'text-[11px] tracking-tight' : 'text-[11.5px]'"
                    >
                      {{ getFieldText(item, 'label') }}
                    </span>
                  </div>
                  <div class="canvas-ghost-skeleton pointer-events-none hidden w-full select-none text-left">
                    <component :is="getGhostComponent(item.type)" :element="getGhostElement(item.type)" />
                  </div>
                </div>
              </div>
            </section>

            <section v-if="filteredBusinessComponents.length > 0">
              <h3 class="mb-2 pl-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
                {{ t('sidebar.catBusiness') }}
              </h3>
              <div id="components-business" ref="businessGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2">
                <div
                  v-for="item in filteredBusinessComponents"
                  :key="item.type + '_' + store.currentLocale"
                  class="component-item select-none group flex cursor-pointer items-center rounded-lg border border-slate-200/90 shadow-2xs bg-white px-2 py-1.5 h-[34px] transition-all hover:border-[#1677ff]/60 hover:bg-blue-50/40 hover:shadow-sm active:bg-blue-50/70 active:border-[#1677ff]"
                  :data-type="item.type"
                  :title="getFieldText(item, 'label')"
                  @click="handleComponentClick(item.type)"
                >
                  <div class="sidebar-btn-view flex w-full items-center gap-1.5 overflow-hidden">
                    <component :is="getIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-[#1677ff] shrink-0" />
                    <span
                      class="truncate font-medium text-slate-700 transition-colors group-hover:text-[#1677ff]"
                      :class="store.currentLocale === 'en' ? 'text-[11px] tracking-tight' : 'text-[11.5px]'"
                    >
                      {{ getFieldText(item, 'label') }}
                    </span>
                  </div>
                  <div class="canvas-ghost-skeleton pointer-events-none hidden w-full select-none text-left">
                    <component :is="getGhostComponent(item.type)" :element="getGhostElement(item.type)" />
                  </div>
                </div>
              </div>
            </section>

            <div v-if="noSearchResult" class="rounded-lg border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-[12px] leading-5 text-slate-400">
              {{ t('sidebar.searchEmpty') }}
            </div>
          </div>

          <div v-show="activeTab === 'pages'" class="space-y-2">
            <div
              v-for="(page, idx) in store.pages"
              :key="page.id"
              class="figma-page-row group relative flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all duration-150"
              :class="[
                (store.selectedType === 'page' && store.selectedId === page.id)
                  ? 'border-[#1677ff] bg-blue-50/50 shadow-xs ring-1 ring-[#1677ff]/25'
                  : store.activePageId === page.id
                    ? 'border-blue-200/90 bg-blue-50/25 shadow-2xs'
                    : 'border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 hover:bg-slate-50/40 hover:shadow-xs'
              ]"
              @click="focusPage(page.id)"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1 pr-2">
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10.5px] font-semibold transition-colors"
                  :class="[
                    (store.selectedType === 'page' && store.selectedId === page.id)
                      ? 'bg-[#1677ff] text-white shadow-2xs'
                      : store.activePageId === page.id
                        ? 'bg-blue-100 text-[#1677ff]'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#1677ff]'
                  ]"
                >
                  {{ idx + 1 }}
                </span>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span
                      class="text-[12px] truncate leading-snug transition-colors"
                      :class="[
                        (store.selectedType === 'page' && store.selectedId === page.id)
                          ? 'font-bold text-[#1677ff]'
                          : store.activePageId === page.id
                            ? 'font-semibold text-slate-800'
                            : 'font-medium text-slate-700 group-hover:text-[#1677ff]'
                      ]"
                      :title="getPageDisplayInfo(page, idx).mainTitle"
                    >
                      {{ getPageDisplayInfo(page, idx).mainTitle }}
                    </span>
                    <Lock v-if="page.pageType === 'system_profile'" class="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                  <div class="text-[10.5px] text-slate-400 mt-0.5 truncate">
                    {{ getPageDisplayInfo(page, idx).subtitle }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-0.5 shrink-0">
                <a-popconfirm
                  v-if="idx > 0"
                  :content="t('sidebar.deletePagePrompt')"
                  position="tr"
                  type="warning"
                  :ok-text="t('modal.confirm')"
                  :cancel-text="t('modal.cancel')"
                  :ok-button-props="{ status: 'danger', size: 'small' }"
                  :cancel-button-props="{ size: 'small' }"
                  @ok="handleDeletePage(page.id)"
                >
                  <button
                    type="button"
                    class="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    :title="t('prop.deletePage')"
                    @click.stop
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </a-popconfirm>
              </div>
            </div>

            <div class="pt-1.5">
              <button
                type="button"
                class="group flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-300/90 bg-white py-2 px-3 text-[12px] font-medium text-slate-600 transition-all duration-180 hover:border-[#1677ff] hover:bg-blue-50/40 hover:text-[#1677ff] hover:shadow-xs active:scale-[0.99] cursor-pointer"
                @click="handleAddNewPage"
              >
                <span class="flex h-4.5 w-4.5 items-center justify-center rounded bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-[#1677ff] group-hover:text-white group-hover:rotate-90">
                  <Plus class="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
                <span>{{ t('sidebar.addCanvasPage') }}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 右侧拖拽拉伸边框把手 -->
    <div
      v-if="store.leftSidebarVisible"
      class="sidebar-resize-handle-right absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-[#1677ff]/40 active:bg-[#1677ff] transition-colors z-40 group select-none flex items-center justify-center"
      :class="{ 'bg-[#1677ff]/60': isResizing }"
      :title="t('sidebar.resizeHandleTip')"
      @mousedown.prevent="startResize"
    >
      <div class="w-0.5 h-6 rounded-full bg-slate-300 group-hover:bg-[#1677ff] transition-colors"></div>
    </div>

    <a-modal
      v-model:visible="confirmModalVisible"
      :title="t('sidebar.confirmOverwriteTitle')"
      :width="380"
      :title-align="'start'"
      draggable
      unmount-on-close
      class="clean-confirm-modal"
      @cancel="confirmModalVisible = false"
    >
      <div class="text-[13px] text-slate-600 leading-normal">
        {{ t('sidebar.confirmOverwriteDesc', undefined, { pages: store.pages.length }) }}
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <a-button type="primary" status="warning" class="bg-amber-600 hover:bg-amber-700" @click="handleConfirmApplyTemplate">
            {{ t('sidebar.confirmOverwriteBtn') }}
          </a-button>
          <a-button @click="confirmModalVisible = false">
            {{ t('modal.cancel') }}
          </a-button>
        </div>
      </template>
    </a-modal>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { store, addElement, focusOnPage, addPage, applyTemplateKey, selectPage, deletePage } from '@/core/store';
import { t, getPageText, getFieldText } from '@/core/i18n';
import { componentRegistry, getComponentIcon } from '@/registry/components';
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
  Component,
  LayoutTemplate,
  Files,
  Search,
  PanelLeft,
  Plus,
  ArrowRight,
  Lock,
  Trash2,
  Settings,
  HelpCircle,
  FileText
} from '@lucide/vue';
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import { Message } from '@arco-design/web-vue';
import { useSidebarResize } from '@/utils/useSidebarResize';
import { startAppTour } from '@/utils/useAppTour';

const emit = defineEmits(['open-template-gallery', 'open-create-canvas', 'open-create-form']);

const isSettingsDropdownOpen = ref(false);

function handleTriggerTour() {
  isSettingsDropdownOpen.value = false;
  startAppTour();
}

const activeTab = computed({
  get: () => store.sidebarTab,
  set: (val: 'templates' | 'components' | 'pages') => {
    store.sidebarTab = val;
  }
});

const scenarioTemplates = [
  {
    key: 'kyc-customer' as const,
    title: '客户案例 KYC 模板',
    title_en: 'Customer KYC Template',
    tag: '客户案例',
    tag_en: 'Customer',
    tagColor: 'purple',
    image: tplCustomerImg,
    desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
    desc_en: 'Covers business activities, sales volume, funding source, listed company stock code linkage, and authorized signature.',
    stats: '3 页面 · 9 字段',
    stats_en: '3 Pages · 9 Fields',
    code: 'SG_CDD_Customer',
    bannerBgClass: 'bg-[#faf5ff]'
  },
  {
    key: 'kyc-individual' as const,
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC Template',
    tag: '个人案例',
    tag_en: 'Individual',
    tagColor: 'green',
    image: tplIndividualImg,
    desc: '涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。',
    desc_en: 'Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature.',
    stats: '5 页面 · 15 字段',
    stats_en: '5 Pages · 15 Fields',
    code: 'SG_CDD_Individual',
    bannerBgClass: 'bg-[#f0fdf4]'
  },
  {
    key: 'kyc-entity' as const,
    title: '实体案例 KYC 模板',
    title_en: 'Entity KYC Template',
    tag: '实体案例',
    tag_en: 'Entity',
    tagColor: 'arcoblue',
    image: tplEntityImg,
    desc: '包含企业统一社会信用代码、经营地址、授权代表核验与法人签章。',
    desc_en: 'Includes corporate UEN, business address, authorized rep verification and seal.',
    stats: '3 页面 · 16 字段',
    stats_en: '3 Pages · 16 Fields',
    code: 'SG_CDD_Entity',
    bannerBgClass: 'bg-[#eff6ff]'
  }
];

const { isResizing, startResize } = useSidebarResize({
  getWidth: () => store.leftSidebarWidth,
  setWidth: (newWidth) => {
    store.leftSidebarWidth = newWidth;
  },
  min: 280,
  max: 500,
  direction: 'right'
});

const drawerTitle = computed(() => {
  if (activeTab.value === 'templates') return t('sidebar.tabTemplates');
  if (activeTab.value === 'pages') return t('sidebar.tabPages');
  return t('sidebar.tabComponents');
});

const drawerSubtitle = computed(() => {
  if (activeTab.value === 'templates') return t('sidebar.subTemplates');
  if (activeTab.value === 'pages') return `${store.pages.length} ${t('common.pagesUnit')}`;
  return t('sidebar.subComponents');
});

const searchOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

const filteredTemplates = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return scenarioTemplates;
  return scenarioTemplates.filter(t =>
    t.title.toLowerCase().includes(q) ||
    (t.title_en && t.title_en.toLowerCase().includes(q)) ||
    t.desc.toLowerCase().includes(q) ||
    (t.desc_en && t.desc_en.toLowerCase().includes(q)) ||
    t.tag.toLowerCase().includes(q) ||
    (t.tag_en && t.tag_en.toLowerCase().includes(q)) ||
    t.code.toLowerCase().includes(q)
  );
});

function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function handleSearchEsc() {
  searchQuery.value = '';
  searchOpen.value = false;
}

const confirmModalVisible = ref(false);
const pendingTemplateKey = ref<'kyc-customer' | 'kyc-individual' | 'kyc-entity' | null>(null);

function handleSelectTemplate(tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity') {
  pendingTemplateKey.value = tplKey;
  if (store.pages.length > 0) {
    confirmModalVisible.value = true;
    return;
  }
  handleConfirmApplyTemplate();
}

function handleConfirmApplyTemplate() {
  if (pendingTemplateKey.value) {
    applyTemplateKey(pendingTemplateKey.value);
    Message.success(t('sidebar.templateLoaded'));
    pendingTemplateKey.value = null;
  }
  confirmModalVisible.value = false;
}

function focusPage(pageId: string) {
  selectPage(pageId);
  focusOnPage(pageId, { duration: 400 });
}

function getPageDisplayInfo(page: any, _idx: number) {
  if (page.pageType === 'system_profile') {
    return {
      mainTitle: getPageText(page, 'title') || t('common.basicInfo'),
      subtitle: t('sidebar.systemPreset')
    };
  }

  const rawTitle = getPageText(page, 'title') || t('common.untitledPage');
  const match = rawTitle.match(/^(第[一二三四五六七八九十0-9]+部分|Part\s*\d+)[：:\s]+(.+)$/i);
  const fieldsCount = `${page.fields?.length || 0} ${t('common.fieldsUnit')}`;

  if (match) {
    return {
      mainTitle: match[2].trim(),
      subtitle: `${match[1].trim()} · ${fieldsCount}`
    };
  }

  return {
    mainTitle: rawTitle,
    subtitle: fieldsCount
  };
}

function handleAddNewPage() {
  addPage();
  Message.success(t('sidebar.pageAdded'));
}

function handleDeletePage(pageId: string) {
  deletePage(pageId);
  Message.success(t('sidebar.pageDeleted'));
}

const basicGroupRef = ref<HTMLElement | null>(null);
const businessGroupRef = ref<HTMLElement | null>(null);
let basicSortable: Sortable | null = null;
let businessSortable: Sortable | null = null;

const isMac = ref(false);

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    store.leftSidebarVisible = true;
    activeTab.value = 'components';
    searchOpen.value = true;
    nextTick(() => {
      searchInputRef.value?.focus();
      searchInputRef.value?.select();
    });
  }
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  window.addEventListener('keydown', handleKeydown);
  initDragSources();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (basicSortable) {
    basicSortable.destroy();
    basicSortable = null;
  }
  if (businessSortable) {
    businessSortable.destroy();
    businessSortable = null;
  }
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

      if (evt.clone && evt.clone.parentNode && evt.item) {
        evt.clone.parentNode.replaceChild(evt.item, evt.clone);
      }
    }
  };

  if (basicGroupRef.value) basicSortable = new Sortable(basicGroupRef.value, dragOptions);
  if (businessGroupRef.value) businessSortable = new Sortable(businessGroupRef.value, dragOptions);
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

function createGhostElement(type: ComponentType): FormElement {
  const meta = componentRegistry[type];
  const defaultData = meta ? meta.defaultData() : {};
  return {
    id: `ghost_${type}`,
    type,
    key: `ghost_${type}`,
    required: defaultData.required !== undefined ? defaultData.required : true,
    showLabel: defaultData.showLabel !== false,
    helpPosition: 'right',
    ...defaultData,
    label: '',
    label_en: '',
    options: defaultData.options ? JSON.parse(JSON.stringify(defaultData.options)) : undefined
  };
}

const ghostElements = computed<Record<ComponentType, FormElement>>(() => {
  const map: Partial<Record<ComponentType, FormElement>> = {};
  for (const type of Object.keys(componentRegistry) as ComponentType[]) {
    map[type] = createGhostElement(type);
  }
  return map as Record<ComponentType, FormElement>;
});

function getGhostElement(type: ComponentType) {
  return ghostElements.value[type] || createGhostElement(type);
}

const filteredBasicComponents = computed(() => {
  const all = Object.values(componentRegistry).filter(c => c.category === 'basic');
  if (!searchQuery.value.trim()) return all;
  const q = searchQuery.value.trim().toLowerCase();
  return all.filter(
    c =>
      c.label.toLowerCase().includes(q) ||
      (c.label_en && c.label_en.toLowerCase().includes(q)) ||
      c.type.toLowerCase().includes(q)
  );
});

const filteredBusinessComponents = computed(() => {
  const all = Object.values(componentRegistry).filter(c => c.category === 'business');
  if (!searchQuery.value.trim()) return all;
  const q = searchQuery.value.trim().toLowerCase();
  return all.filter(
    c =>
      c.label.toLowerCase().includes(q) ||
      (c.label_en && c.label_en.toLowerCase().includes(q)) ||
      c.type.toLowerCase().includes(q)
  );
});

const noSearchResult = computed(() => {
  return (
    searchQuery.value.trim().length > 0 &&
    filteredBasicComponents.value.length === 0 &&
    filteredBusinessComponents.value.length === 0
  );
});

function handleComponentClick(type: ComponentType) {
  const activePage = store.pages.find(p => p.id === store.activePageId) || store.pages[1] || store.pages[0];
  if (!activePage) return;
  addElement(type, activePage.id);
  Message.success(t('sidebar.componentAdded'));
}
</script>

<style scoped>
.figma-activity-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  min-height: 48px;
  padding: 5px 2px;
  border-radius: 8px;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.16s ease;
  user-select: none;
  box-sizing: border-box;
}

.figma-activity-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.figma-activity-btn.is-icon-only {
  width: 36px;
  height: 36px;
  min-height: 36px;
  padding: 0;
  border-radius: 7px;
}

.figma-activity-btn.active {
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 600;
}

.figma-page-count-badge {
  position: absolute;
  top: 3px;
  right: 5px;
  font-size: 8.5px;
  line-height: 1;
  padding: 1.5px 4px;
  border-radius: 9999px;
  background: #1677ff;
  color: white;
  font-weight: bold;
}

.figma-search-input :deep(.arco-input-wrapper) {
  border-radius: 7px;
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.figma-search-input :deep(.arco-input-wrapper:hover) {
  border-color: #91caff;
}

.figma-search-input :deep(.arco-input-wrapper:focus-within) {
  border-color: #1677ff;
  box-shadow: 0 0 0 1px #1677ff;
}

.figma-page-row:hover {
  border-color: #91caff;
}

.clean-confirm-modal :deep(.arco-modal) {
  border-radius: 6px;
}

.clean-confirm-modal :deep(.arco-modal-body) {
  padding: 14px 16px;
}
</style>
