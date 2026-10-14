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
    <!-- 内部固定宽度包装容器：保证整体折叠/展开动画时内部不挤压变形 -->
    <div
      class="flex h-full min-h-0 flex-row shrink-0"
      :style="{ width: `${store.leftSidebarWidth}px` }"
    >
      <!-- 1. 64px 侧边垂直导航列 (Activity Bar) - 纵向排列在侧边，严格使用框架图标，杜绝 emoji -->
      <div id="tour-activity-bar" class="flex flex-col items-center justify-between w-[64px] h-full shrink-0 border-r border-slate-200/90 bg-[#F8FAFC] py-3 z-20">
        <!-- 顶部 Logo 标识与导航分类 (垂直排列) -->
        <div class="flex flex-col items-center gap-3.5 w-full">
          <!-- 品牌标识 -->
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d99ff] text-white shadow-xs">
            <Boxes class="h-4 w-4 stroke-[2.4]" />
          </div>

          <!-- 3 个垂直分类图标按钮 -->
          <div class="flex flex-col items-center gap-1.5 w-full px-1">
            <!-- 分类 1：场景模板 (Templates) -->
            <a-tooltip :content="t('sidebar.tooltipTemplates')" position="right">
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
            </a-tooltip>

            <!-- 分类 2：组件物料 (Components) -->
            <a-tooltip :content="t('sidebar.tooltipComponents')" position="right">
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
            </a-tooltip>

            <!-- 分类 3：页面大纲 (Pages) -->
            <a-tooltip :content="t('sidebar.tooltipPages')" position="right">
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
            </a-tooltip>
          </div>
        </div>

        <!-- 底部区域：设置快捷菜单与收起按钮 (对标 VS Code / Figma 左下角规范) -->
        <div class="flex flex-col items-center gap-1.5 w-full px-1">
          <!-- 设置快捷菜单 -->
          <a-dropdown trigger="click" position="tr" :popup-max-height="false">
            <a-tooltip :content="t('app.settings')" position="right">
              <button
                type="button"
                class="figma-activity-btn text-slate-400 hover:text-slate-700 cursor-pointer"
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
                <a-divider style="margin: 4px 0" />
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-1.5 py-1 text-left hover:bg-blue-50 text-[#1677ff] rounded transition-colors text-[13px] font-medium cursor-pointer"
                  @click="handleTriggerTour"
                >
                  <span>{{ t('header.tour') }}</span>
                  <Sparkles class="h-3.5 w-3.5" />
                </button>
              </div>
            </template>
          </a-dropdown>

          <!-- 底部完全收起按钮 (对标 Figma ◨ 图标，点击后整个侧边栏完全收起到 0px) -->
          <a-tooltip :content="t('sidebar.tooltipCollapse')" position="right">
            <button
              type="button"
              class="figma-activity-btn text-slate-400 hover:text-slate-700 cursor-pointer"
              @click="store.leftSidebarVisible = false"
            >
              <PanelLeft class="h-4 w-4" />
            </button>
          </a-tooltip>
        </div>
      </div>

      <!-- 2. 二级抽屉内容区 (Drawer Content) -->
      <div id="tour-material-drawer" class="flex h-full min-h-0 flex-col flex-1 shrink-0 bg-[#FAFAFA] overflow-hidden">
        <!-- 面板顶栏 Header -->
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
              <!-- 搜索按钮 -->
              <a-tooltip v-if="activeTab !== 'pages'" :content="t('sidebar.searchTooltip')" position="bottom">
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 cursor-pointer"
                  :class="{ 'text-blue-600 bg-blue-50': searchOpen }"
                  @click="toggleSearch"
                >
                  <Search class="h-3.5 w-3.5" />
                </button>
              </a-tooltip>

              <!-- 完全收起按钮 -->
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

          <!-- 搜索输入框 -->
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

        <!-- 面板主体内容区 -->
        <main class="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
          <!-- ================= 视图 1：场景模板库 (Templates) ================= -->
          <div id="tour-template-panel" v-show="activeTab === 'templates'" class="space-y-2">
            <!-- 顶部快捷新建空白画布卡片 -->
            <button
              type="button"
              class="w-full flex items-center gap-2.5 p-2 rounded border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-slate-700 hover:text-blue-600 transition-colors duration-150 cursor-pointer group"
              @click="$emit('open-create-canvas')"
            >
              <div class="flex items-center justify-center w-6 h-6 rounded bg-slate-100 group-hover:bg-blue-500 text-slate-500 group-hover:text-white transition-colors shrink-0">
                <Plus class="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <div class="flex flex-col text-left min-w-0">
                <span class="text-[12px] font-semibold text-slate-800 group-hover:text-blue-600 leading-tight">
                  {{ t('sidebar.createBlank') }}
                </span>
                <span class="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
                  {{ t('sidebar.createBlankDesc') }}
                </span>
              </div>
            </button>

            <!-- 模板列表分区提示 -->
            <div class="flex items-center justify-between px-0.5 pt-0.5 text-[11px] font-medium text-slate-400 select-none">
              <span>{{ t('sidebar.presetScenarios') }}</span>
              <span>{{ filteredTemplates.length }} {{ t('common.templatesUnit') }}</span>
            </div>

            <!-- 图文列表：每个预置模板顶部带有业务流程缩略图，下方为信息说明 -->
            <div
              v-for="tpl in filteredTemplates"
              :key="tpl.key"
              class="group flex flex-col rounded border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-2xs transition-all duration-150 cursor-pointer select-none overflow-hidden"
              @click="handleSelectTemplate(tpl.key)"
            >
              <!-- 顶部 3D 插画缩略图横幅 (对齐客户紫色、机构蓝色、个人绿色) -->
              <div
                class="h-[84px] w-full border-b border-slate-100 flex items-center justify-center relative overflow-hidden select-none bg-slate-50"
                :class="tpl.bannerBgClass"
              >
                <img
                  :src="tpl.image"
                  :alt="getFieldText(tpl, 'title')"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <!-- 下方图文说明 -->
              <div class="p-2.5">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[12px] font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {{ getFieldText(tpl, 'title') }}
                  </span>
                  <a-tag size="small" :color="tpl.tagColor" class="shrink-0 text-[10px] px-1 h-4 leading-none rounded">
                    {{ getFieldText(tpl, 'tag') }}
                  </a-tag>
                </div>

                <p class="text-[11px] text-slate-500 leading-normal m-0 mb-2 line-clamp-2">
                  {{ getFieldText(tpl, 'desc') }}
                </p>

                <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                  <span class="font-mono text-slate-400">{{ tpl.code }}</span>
                  <div class="flex items-center gap-1">
                    <span>{{ getFieldText(tpl, 'stats') }}</span>
                    <ArrowRight class="w-3 h-3 text-blue-500 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 搜索无结果提示 -->
            <div
              v-if="filteredTemplates.length === 0"
              class="rounded-lg border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-[12px] leading-5 text-slate-400"
            >
              {{ t('sidebar.searchEmpty') }}
            </div>
          </div>

          <!-- ================= 视图 2：组件物料库 (Components) ================= -->
          <div id="tour-component-panel" v-show="activeTab === 'components'" class="space-y-4">
            <!-- 基础输入分类 -->
            <section v-if="filteredBasicComponents.length > 0">
              <h3 class="mb-2 pl-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
                {{ t('sidebar.catBasic') }}
              </h3>
              <div id="components-basic" ref="basicGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2">
                <div
                  v-for="item in filteredBasicComponents"
                  :key="item.type + '_' + store.currentLocale"
                  class="component-item select-none group flex cursor-pointer items-center rounded-lg border border-slate-200/90 shadow-2xs bg-white px-2 py-1.5 h-[34px] transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm active:bg-blue-50/60 active:border-blue-500"
                  :data-type="item.type"
                  :title="getFieldText(item, 'label')"
                  @click="handleComponentClick(item.type)"
                >
                  <div class="sidebar-btn-view flex w-full items-center gap-1.5 overflow-hidden">
                    <component :is="getIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-500 shrink-0" />
                    <span
                      class="truncate font-medium text-slate-700 transition-colors group-hover:text-blue-700"
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

            <!-- 业务组件分类 -->
            <section v-if="filteredBusinessComponents.length > 0">
              <h3 class="mb-2 pl-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
                {{ t('sidebar.catBusiness') }}
              </h3>
              <div id="components-business" ref="businessGroupRef" class="sidebar-drag-group grid grid-cols-2 gap-2">
                <div
                  v-for="item in filteredBusinessComponents"
                  :key="item.type + '_' + store.currentLocale"
                  class="component-item select-none group flex cursor-pointer items-center rounded-lg border border-slate-200/90 shadow-2xs bg-white px-2 py-1.5 h-[34px] transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm active:bg-blue-50/60 active:border-blue-500"
                  :data-type="item.type"
                  :title="getFieldText(item, 'label')"
                  @click="handleComponentClick(item.type)"
                >
                  <div class="sidebar-btn-view flex w-full items-center gap-1.5 overflow-hidden">
                    <component :is="getIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-500 shrink-0" />
                    <span
                      class="truncate font-medium text-slate-700 transition-colors group-hover:text-blue-700"
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

            <!-- 搜索无结果 -->
            <div v-if="noSearchResult" class="rounded-lg border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-[12px] leading-5 text-slate-400">
              {{ t('sidebar.searchEmpty') }}
            </div>
          </div>

          <!-- ================= 视图 3：页面大纲 (Pages) ================= -->
          <div v-show="activeTab === 'pages'" class="space-y-2">
            <div
              v-for="(page, idx) in store.pages"
              :key="page.id"
              class="figma-page-row group flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all"
              :class="[
                (store.selectedType === 'page' && store.selectedId === page.id)
                  ? 'border-[#1677ff] bg-blue-50/60 shadow-xs ring-1 ring-[#1677ff]/20'
                  : store.activePageId === page.id
                    ? 'border-blue-200 bg-blue-50/20'
                    : 'border-slate-200/90 bg-white shadow-2xs hover:border-blue-300 hover:shadow-xs'
              ]"
              @click="focusPage(page.id)"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10.5px] font-bold transition-colors"
                  :class="[
                    (store.selectedType === 'page' && store.selectedId === page.id)
                      ? 'bg-[#1677ff] text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                  ]"
                >
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>

                <div class="min-w-0">
                  <div
                    class="text-[12px] truncate transition-colors"
                    :class="[
                      (store.selectedType === 'page' && store.selectedId === page.id)
                        ? 'font-bold text-[#1677ff]'
                        : 'font-semibold text-slate-800 group-hover:text-blue-600'
                    ]"
                  >
                    {{ getPageText(page, 'title') || (page.pageType === 'system_profile' ? t('common.basicInfo') : t('common.untitledPage')) }}
                  </div>
                  <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span v-if="page.pageType === 'system_profile'" class="text-blue-500 font-medium flex items-center gap-0.5">
                      <Lock class="w-2.5 h-2.5" /> {{ t('common.readOnly') }}
                    </span>
                    <span v-else>
                      {{ page.fields?.length || 0 }} {{ t('common.fieldsUnit') }}
                    </span>
                  </div>
                </div>
              </div>

              <div
                class="shrink-0 transition-colors"
                :class="[
                  (store.selectedType === 'page' && store.selectedId === page.id)
                    ? 'text-[#1677ff]'
                    : 'text-slate-300 group-hover:text-blue-500'
                ]"
              >
                <Eye class="h-3.5 w-3.5" />
              </div>
            </div>

            <div class="pt-2">
              <a-button
                type="outline"
                long
                class="figma-outline-action-btn"
                @click="handleAddNewPage"
              >
                <Plus class="h-3.5 w-3.5 mr-1 stroke-[2.5]" />
                {{ t('sidebar.addCanvasPage') }}
              </a-button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 右侧拖拽拉伸边框把手 -->
    <div
      v-if="store.leftSidebarVisible"
      class="sidebar-resize-handle-right absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-[#0d99ff]/40 active:bg-[#0d99ff] transition-colors z-40 group select-none flex items-center justify-center"
      :class="{ 'bg-[#0d99ff]/60': isResizing }"
      title="拖拽调整侧边栏宽度"
      @mousedown.prevent="startResize"
    >
      <div class="w-0.5 h-6 rounded-full bg-slate-300 group-hover:bg-[#0d99ff] transition-colors"></div>
    </div>

    <!-- 模板覆盖确认轻量弹窗 (对齐新建表单画布的正常规范标准样式) -->
    <a-modal
      v-model:visible="confirmModalVisible"
      :title="t('sidebar.confirmTitle')"
      :width="400"
      :title-align="'start'"
      draggable
      unmount-on-close
      class="clean-confirm-modal"
      @cancel="confirmModalVisible = false"
    >
      <div class="py-2.5 text-[13px] text-slate-600 leading-relaxed">
        {{ t('sidebar.confirmOverwrite') }}
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <a-button type="primary" class="bg-[#1677ff]" @click="handleConfirmApplyTemplate">
            {{ t('modal.confirm') }}
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
import { store, addElement, focusOnPage, addPage, applyTemplateKey, selectPage } from '@/core/store';
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
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import {
  Boxes,
  Component,
  LayoutTemplate,
  Files,
  Search,
  PanelLeft,
  Plus,
  ArrowRight,
  Lock,
  Eye,
  Building2,
  UserCheck,
  ShieldCheck,
  Settings,
  Sparkles
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';
import { useSidebarResize } from '@/utils/useSidebarResize';
import { startAppTour } from '@/utils/useAppTour';

const emit = defineEmits(['open-template-gallery', 'open-create-canvas', 'open-create-form']);

function handleTriggerTour() {
  startAppTour();
}

// 当前选中的侧边垂直分类：'templates' 模板 | 'components' 物料 | 'pages' 页面大纲
const activeTab = computed({
  get: () => store.sidebarTab,
  set: (val: 'templates' | 'components' | 'pages') => {
    store.sidebarTab = val;
  }
});

// 场景模板数据源（纯净数据驱动，无冗余 DOM，无假画布）
const scenarioTemplates = [
  {
    key: 'kyc-customer' as const,
    title: '母案例 KYC 模板',
    title_en: 'Customer KYC Template',
    tag: '母案例',
    tag_en: 'Customer',
    tagColor: 'purple',
    icon: Building2,
    image: tplCustomerImg,
    desc: '包含公司统一社会信用代码、注册地、授权代表尽调与法定声明。',
    desc_en: 'Includes corporate UEN, registered address, authorized representative CDD and declarations.',
    stats: '3 页面 · 18 字段',
    stats_en: '3 Pages · 18 Fields',
    code: 'SG_CDD_Customer',
    bannerBgClass: 'bg-[#faf5ff]'
  },
  {
    key: 'kyc-individual' as const,
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC Template',
    tag: '个人成员',
    tag_en: 'Individual',
    tagColor: 'green',
    icon: UserCheck,
    image: tplIndividualImg,
    desc: '涵盖身份证件/护照、国籍、就业收入状况与个人手写签名确认。',
    desc_en: 'Covers ID/Passport, nationality, employment income, and handwritten signature.',
    stats: '3 页面 · 15 字段',
    stats_en: '3 Pages · 15 Fields',
    code: 'SG_CDD_Individual',
    bannerBgClass: 'bg-[#f0fdf4]'
  },
  {
    key: 'kyc-entity' as const,
    title: '机构案例 KYC 模板',
    title_en: 'Entity KYC Template',
    tag: '机构成员',
    tag_en: 'Entity',
    tagColor: 'arcoblue',
    icon: ShieldCheck,
    image: tplEntityImg,
    desc: '包含企业统一社会信用代码、经营地址、授权代表核验与法人签章。',
    desc_en: 'Includes corporate UEN, business address, authorized rep verification and seal.',
    stats: '3 页面 · 16 字段',
    stats_en: '3 Pages · 16 Fields',
    code: 'SG_CDD_Entity',
    bannerBgClass: 'bg-[#eff6ff]'
  }
];

// 侧边栏拖拽拉伸 (默认 320px = 56px 垂直栏 + 264px 抽屉)
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
  confirmModalVisible.value = true;
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

function handleAddNewPage() {
  addPage();
  Message.success(t('sidebar.pageAdded'));
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
    label: defaultData.label || '未命名字段',
    label_en: defaultData.label_en || '',
    required: defaultData.required !== undefined ? defaultData.required : true,
    showLabel: defaultData.showLabel !== false,
    helpPosition: 'right',
    ...defaultData,
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
/* 64px 侧边垂直导航栏按钮 (Figma 风格) */
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

.figma-activity-btn.active {
  background: #e8f3ff;
  color: #0d99ff;
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
  background: #0d99ff;
  color: white;
  font-weight: bold;
}

/* 搜索框 */
.figma-search-input :deep(.arco-input-wrapper) {
  border-radius: 7px;
  background-color: #ffffff;
  border-color: #e2e8f0;
}

.figma-search-input :deep(.arco-input-wrapper:hover) {
  border-color: #94bfff;
}

.figma-search-input :deep(.arco-input-wrapper:focus-within) {
  border-color: #0d99ff;
  box-shadow: 0 0 0 1px #0d99ff;
}

/* 页面行样式 */
.figma-page-row:hover {
  border-color: #94bfff;
}

/* 提示弹窗样式 (对齐新建表单画布的正常标准样式) */
.clean-confirm-modal :deep(.arco-modal) {
  border-radius: 6px;
}
</style>
