<template>
  <aside
    class="relative min-h-0 flex flex-col border-l border-[#f0f0f0] bg-white overflow-hidden shrink-0 z-30"
    :class="{
      'transition-all duration-300 ease-in-out': !isResizing,
      '!w-0 !opacity-0 border-none pointer-events-none': !store.rightSidebarVisible
    }"
    :style="{
      width: store.rightSidebarVisible ? `${store.rightSidebarWidth}px` : '0px'
    }"
    @mouseenter="store.isRightSidebarHovered = true"
    @mouseleave="store.isRightSidebarHovered = false"
  >
    <!-- 左侧可拖拽拉伸边框把手 (Min: 260px, Max: 520px, Default: 300px) -->
    <div
      v-if="store.rightSidebarVisible"
      class="sidebar-resize-handle-left absolute left-0 top-0 bottom-0 w-2 -ml-1 cursor-col-resize hover:bg-[#1677ff]/40 active:bg-[#1677ff] transition-colors z-40 group select-none flex items-center justify-center"
      :class="{ 'bg-[#1677ff]/60': isResizing }"
      title="拖拽拉伸属性面板宽度"
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
          <a-tooltip :content="store.currentLocale === 'en' ? 'Collapse panel' : '收起属性面板'" position="bottom">
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

      <!-- 语言模式快捷指示与切换器 -->
      <div class="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
        <span class="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Globe class="h-3 w-3 text-slate-400" />
          {{ store.currentLocale === 'en' ? t('prop.configuringEn') : t('prop.configuringZh') }}
        </span>
        <div class="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-[11px] select-none">
          <div
            role="button"
            tabindex="0"
            class="px-2 py-0.5 rounded transition-colors cursor-pointer leading-none"
            :class="store.currentLocale === 'zh' ? 'bg-[#1677ff] text-white font-medium' : 'text-slate-600 hover:text-slate-900'"
            @click="store.currentLocale = 'zh'"
          >
            中文
          </div>
          <div
            role="button"
            tabindex="0"
            class="px-2 py-0.5 rounded transition-colors cursor-pointer leading-none"
            :class="store.currentLocale === 'en' ? 'bg-[#1677ff] text-white font-medium' : 'text-slate-600 hover:text-slate-900'"
            @click="store.currentLocale = 'en'"
          >
            EN
          </div>
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

      <!-- 画布页面属性配置 -->
      <div v-else-if="store.selectedType === 'page' && selectedPage" class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <a-form id="page-prop-editor" :model="selectedPage" layout="vertical" size="small">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 uppercase tracking-wider">{{ t('prop.canvasSettings') }}</span>
            <a-tag color="blue" size="small">{{ t('prop.page') }}</a-tag>
          </div>

          <!-- 英文模式页面配置 -->
          <template v-if="store.currentLocale === 'en'">
            <!-- 英文页面标题 -->
            <a-form-item :label="t('prop.pageTitleEn')" class="!mb-3">
              <a-input
                id="page-prop-title-input"
                v-model="selectedPage.title_en"
                allow-clear
                :placeholder="t('prop.pageTitlePlaceholder')"
                class="w-full"
                @focus="setPageFocus('title')"
                @blur="clearFocus"
                @input="markDirty"
              />
            </a-form-item>

            <!-- 英文页面描述 -->
            <a-form-item :label="t('prop.pageDescEn')" class="!mb-4">
              <a-textarea
                id="page-prop-desc-input"
                v-model="selectedPage.description_en"
                :auto-size="{ minRows: 3, maxRows: 6 }"
                :placeholder="t('prop.pageDescPlaceholder')"
                class="w-full"
                @focus="setPageFocus('desc')"
                @blur="clearFocus"
                @input="markDirty"
              />
            </a-form-item>
          </template>

          <!-- 中文模式页面配置 -->
          <template v-else>
            <a-form-item :label="t('prop.pageTitle')" class="!mb-3">
              <a-input id="page-prop-title-input" v-model="selectedPage.title" allow-clear :placeholder="t('prop.pageTitlePlaceholder')" @focus="setPageFocus('title')" @blur="clearFocus" @input="markDirty" />
            </a-form-item>

            <a-form-item :label="t('prop.pageDesc')" class="!mb-4">
              <a-textarea id="page-prop-desc-input" v-model="selectedPage.description" :auto-size="{ minRows: 3, maxRows: 6 }" :placeholder="t('prop.pageDescPlaceholder')" @focus="setPageFocus('desc')" @blur="clearFocus" @input="markDirty" />
            </a-form-item>
          </template>

          <div class="pt-3 border-t border-slate-100">
            <a-popconfirm :content="store.currentLocale === 'en' ? 'Are you sure you want to delete this canvas page? This cannot be undone.' : '确定要删除当前画布页面吗？此操作不可撤销。'" type="warning" @ok="handleDeletePage">
              <a-button status="danger" long size="small">
                <template #icon>
                  <Trash2 class="h-3.5 w-3.5" />
                </template>
                {{ t('prop.deletePage') }}
              </a-button>
            </a-popconfirm>
          </div>
        </a-form>
      </div>

      <!-- 组件属性配置 -->
      <div v-else-if="selectedElement" class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 space-y-5">
        <a-form id="prop-editor" :model="selectedElement" layout="vertical" size="small">
          <!-- 基础信息 -->
          <div class="space-y-3.5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span class="text-[12px] font-semibold text-slate-700">{{ t('prop.basicInfo') }}</span>
                <span class="block text-[11px] text-slate-400">{{ t('prop.basicInfoDesc') }}</span>
              </div>
              <a-tag color="gray" size="small" class="text-[11px] font-normal">{{ componentLabel }}</a-tag>
            </div>

            <!-- 英文模式下的字段配置 -->
            <template v-if="store.currentLocale === 'en'">
              <!-- 英文字段标题 -->
              <a-form-item :label="t('prop.fieldLabelEn')" class="!mb-3">
                <a-input
                  id="prop-label-input"
                  v-model="selectedElement.label_en"
                  allow-clear
                  :placeholder="t('prop.fieldLabelPlaceholder')"
                  class="w-full"
                  :class="{ 'prop-field-focused': isFieldFocused('label') }"
                  @focus="setFocus('label')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </a-form-item>

              <!-- 英文副标题 -->
              <div v-if="selectedElement.type !== 'alert'" class="!mb-3">
                <a-form-item :label="t('prop.fieldHelpEn')" class="!mb-1">
                  <a-input
                    id="prop-help-input"
                    v-model="selectedElement.help_en"
                    allow-clear
                    :placeholder="t('prop.fieldHelpPlaceholder')"
                    class="w-full"
                    :class="{ 'prop-field-focused': isFieldFocused('help') }"
                    @focus="setFocus('help')"
                    @blur="clearFocus"
                    @input="markDirty"
                  />
                </a-form-item>

                <!-- 方案 A：二级缩进子卡片层次感 (仅在有副标题内容时微缩进展开) -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                >
                  <div
                    v-if="hasHelpContent"
                    class="mt-1.5 ml-1 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70 border-l-[2.5px] border-l-[#1677ff] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <div class="flex items-center gap-1.5">
                      <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span class="text-[12px] font-medium text-slate-600">{{ t('prop.helpLayout') }}</span>
                    </div>

                    <!-- 现代微型胶囊分段器 -->
                    <div class="inline-flex items-center p-0.5 rounded-md bg-white border border-slate-200/80 shadow-sm shrink-0 select-none">
                      <div
                        role="button"
                        tabindex="0"
                        class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                        :class="helpPositionValue === 'right' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                        @click="helpPositionValue = 'right'"
                      >
                        <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
                          <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="helpPositionValue === 'right' ? 0.7 : 0.45" />
                        </svg>
                        <span>{{ t('prop.helpPositionRight') }}</span>
                      </div>

                      <div
                        role="button"
                        tabindex="0"
                        class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                        :class="helpPositionValue === 'bottom' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                        @click="helpPositionValue = 'bottom'"
                      >
                        <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="2" y="3" width="12" height="4" rx="1.2" />
                          <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="helpPositionValue === 'bottom' ? 0.7 : 0.45" />
                        </svg>
                        <span>{{ t('prop.helpPositionBottom') }}</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>

            <!-- 中文模式下的字段配置 -->
            <template v-else>
              <a-form-item :label="t('prop.fieldLabel')" class="!mb-3">
                <a-input
                  id="prop-label-input"
                  v-model="selectedElement.label"
                  allow-clear
                  :placeholder="t('prop.fieldLabelPlaceholder')"
                  :class="{ 'prop-field-focused': isFieldFocused('label') }"
                  @focus="setFocus('label')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </a-form-item>

              <!-- 中文副标题 -->
              <div v-if="selectedElement.type !== 'alert'" class="!mb-3">
                <a-form-item :label="t('prop.fieldHelp')" class="!mb-1">
                  <a-input
                    id="prop-help-input"
                    v-model="selectedElement.help"
                    allow-clear
                    :placeholder="t('prop.fieldHelpPlaceholder')"
                    :class="{ 'prop-field-focused': isFieldFocused('help') }"
                    @focus="setFocus('help')"
                    @blur="clearFocus"
                    @input="markDirty"
                  />
                </a-form-item>

                <!-- 方案 A：二级缩进子卡片层次感 (仅在有副标题内容时微缩进展开) -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                >
                  <div
                    v-if="hasHelpContent"
                    class="mt-1.5 ml-1 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70 border-l-[2.5px] border-l-[#1677ff] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <div class="flex items-center gap-1.5">
                      <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span class="text-[12px] font-medium text-slate-600">{{ t('prop.helpLayout') }}</span>
                    </div>

                    <!-- 现代微型胶囊分段器 -->
                    <div class="inline-flex items-center p-0.5 rounded-md bg-white border border-slate-200/80 shadow-sm shrink-0 select-none">
                      <div
                        role="button"
                        tabindex="0"
                        class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                        :class="helpPositionValue === 'right' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                        @click="helpPositionValue = 'right'"
                      >
                        <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
                          <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="helpPositionValue === 'right' ? 0.7 : 0.45" />
                        </svg>
                        <span>{{ t('prop.helpPositionRight') }}</span>
                      </div>

                      <div
                        role="button"
                        tabindex="0"
                        class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                        :class="helpPositionValue === 'bottom' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                        @click="helpPositionValue = 'bottom'"
                      >
                        <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="2" y="3" width="12" height="4" rx="1.2" />
                          <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="helpPositionValue === 'bottom' ? 0.7 : 0.45" />
                        </svg>
                        <span>{{ t('prop.helpPositionBottom') }}</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>

            <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <span class="text-[12px] font-medium text-slate-600">{{ t('prop.showLabel') }}</span>
              <a-switch v-model="isShowLabel" size="small" />
            </div>

            <div v-if="selectedElement.type !== 'alert'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">
                  {{ selectedElement.type === 'signature' ? t('prop.signatureRequired') : t('prop.required') }}
                </span>
                <a-tooltip :content="selectedElement.type === 'signature' ? t('prop.signatureRequiredTip') : t('prop.requiredTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isElementRequired" size="small" />
            </div>

            <div v-if="selectedElement.type === 'signature'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.declarationRequired') }}</span>
                <a-tooltip :content="t('prop.declarationRequiredTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isDeclarationRequired" size="small" />
            </div>

            <div v-if="selectedElement.type === 'select'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.allowMultiple') }}</span>
                <a-tooltip :content="t('prop.allowMultipleTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isSelectMultiple" size="small" />
            </div>

            <!-- 单行文本格式类型 (文本 / 数字) -->
            <div v-if="selectedElement.type === 'input'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.inputType') }}</span>
                <a-tooltip :content="t('prop.inputTypeTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>

              <!-- 微型胶囊分段器: 文本 / 数字 -->
              <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs select-none">
                <div
                  role="button"
                  tabindex="0"
                  class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="(!selectedElement.inputType || selectedElement.inputType === 'text') ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="selectedElement.inputType = 'text'; markDirty();"
                >
                  {{ t('prop.inputTypeText') }}
                </div>
                <div
                  role="button"
                  tabindex="0"
                  class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="selectedElement.inputType === 'number' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="selectedElement.inputType = 'number'; markDirty();"
                >
                  {{ t('prop.inputTypeNumber') }}
                </div>
              </div>
            </div>

            <!-- 电话号码专属：严格号码校验开关 (对齐 algo) -->
            <div v-if="selectedElement.type === 'phone'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.strictPhoneValidation') }}</span>
                <a-tooltip :content="t('prop.strictPhoneValidationTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isStrictPhoneValidation" size="small" />
            </div>
          </div>

          <!-- 电话组件专属：默认国际区号设置 (默认新加坡 +65，选中后展示国家国旗图标) -->
          <div v-if="selectedElement.type === 'phone'" class="space-y-2.5 pt-3.5 border-t border-slate-100">
            <a-form-item :label="t('prop.defaultDialCode')" class="!mb-0">
              <a-select
                v-model="selectedElement.dialCode"
                class="w-full"
                size="small"
                allow-search
                @change="markDirty"
              >
                <!-- 选中后在输入框内渲染国旗图标和区号 -->
                <template #label="{ data }">
                  <div v-if="data" class="flex items-center gap-1.5 font-mono text-xs">
                    <span class="iti__flag shrink-0" :class="'iti__' + (getCountryIso(data.value) || 'sg')"></span>
                    <span class="font-medium text-slate-800">{{ data.value }}</span>
                    <span class="text-slate-400 text-[11px] truncate">
                      {{ getCountryZhName(data.value) }}
                    </span>
                  </div>
                </template>
                <a-option
                  v-for="item in countryPhoneRules"
                  :key="item.iso2"
                  :value="item.code"
                  :label="`${item.code} ${store.currentLocale === 'en' ? item.name : item.zh}`"
                >
                  <div class="flex items-center justify-between gap-2 w-full text-xs">
                    <span class="flex items-center gap-2 font-mono">
                      <span class="iti__flag shrink-0" :class="'iti__' + item.iso2"></span>
                      <span class="font-medium text-slate-800">{{ item.code }}</span>
                    </span>
                    <span class="text-slate-400 text-[11px] truncate max-w-[120px]">
                      {{ store.currentLocale === 'en' ? item.name : item.zh }}
                    </span>
                  </div>
                </a-option>
              </a-select>
            </a-form-item>

            <!-- 国家与区号支持列表查看 (紧凑胶囊按钮排布，杜绝文字错位与换行) -->
            <div class="pt-0.5">
              <button
                type="button"
                class="w-full h-8 px-2.5 rounded-md bg-slate-50 hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 flex items-center justify-between text-xs text-slate-700 hover:text-blue-600 transition-all cursor-pointer group select-none shadow-xs"
                @click="isCountryListModalVisible = true"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <Globe class="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span class="text-[12px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors truncate whitespace-nowrap">
                    {{ store.currentLocale === 'en' ? 'Supported 244 Regions' : '全球 244 国/区号支持列表' }}
                  </span>
                </div>
                <div class="flex items-center gap-0.5 text-[11px] text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 whitespace-nowrap ml-2">
                  <span>{{ store.currentLocale === 'en' ? 'View' : '查看' }}</span>
                  <ChevronRight class="w-3.5 h-3.5 shrink-0" />
                </div>
              </button>
            </div>
          </div>

          <!-- 占位提示 -->
          <div v-if="hasPlaceholder" class="space-y-3 pt-3.5 border-t border-slate-100">
            <!-- 英文占位符配置 -->
            <template v-if="store.currentLocale === 'en'">
              <a-form-item :label="englishPlaceholderFieldLabel" class="!mb-0">
                <a-input
                  id="prop-placeholder-input"
                  v-model="selectedElement.placeholder_en"
                  allow-clear
                  :placeholder="englishPlaceholderFieldLabel"
                  class="w-full"
                  :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
                  @focus="setFocus('placeholder')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </a-form-item>
            </template>
            <!-- 中文占位符配置 -->
            <template v-else>
              <a-form-item :label="placeholderFieldLabel" class="!mb-0">
                <a-input
                  id="prop-placeholder-input"
                  v-model="selectedElement.placeholder"
                  allow-clear
                  :placeholder="placeholderFieldLabel"
                  :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
                  @focus="setFocus('placeholder')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </a-form-item>
            </template>
          </div>

          <!-- 国家 / 国籍专属：预设下拉选项列表展示 -->
          <div v-if="['country', 'nationality'].includes(selectedElement.type)" class="space-y-2 pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="text-[12px] font-semibold text-slate-700">
                {{ store.currentLocale === 'en' ? 'Preset Dropdown Options' : '预设下拉选项' }}
              </span>
              <span class="text-[11px] text-slate-400">
                {{ store.currentLocale === 'en' ? `${selectedElement.options?.length || 0} options` : `共 ${selectedElement.options?.length || 0} 项` }}
              </span>
            </div>

            <!-- 下拉框预设选项列表展示 -->
            <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-1.5 max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar">
              <div
                v-for="(opt, idx) in selectedElement.options"
                :key="idx"
                class="flex items-center justify-between px-2.5 py-1.5 rounded bg-white border border-slate-100 text-[12px] text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <span class="font-medium text-slate-800">{{ getOptionLabel(opt) }}</span>
                <span class="text-[11px] text-slate-400 font-mono">{{ opt.value }}</span>
              </div>
            </div>
          </div>

          <!-- 选项配置 -->
          <div v-if="hasOptionsConfig" class="space-y-2.5 pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-semibold text-slate-700">{{ t('prop.optionsConfig') }}</span>
                <a-tooltip :content="t('prop.optionsConfigTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <span class="text-[11px] text-slate-400">
                {{ store.currentLocale === 'en' ? `${selectedElement.options?.length || 0} options` : `共 ${selectedElement.options?.length || 0} 项` }}
              </span>
            </div>

            <OptionsEditor v-if="selectedElement" :element="selectedElement" />

            <!-- 选项排布方式 (方案 A 规范：二级缩进子卡片，现代化小巧精致) -->
            <div
              v-if="canStackChoices"
              class="mt-1 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70 border-l-[2.5px] border-l-[#1677ff] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div class="flex items-center gap-1.5 shrink-0">
                <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span class="text-[12px] font-medium text-slate-600 whitespace-nowrap">{{ t('prop.optionLayout') }}</span>
              </div>

              <!-- 现代微型胶囊分段器 (小巧精致) -->
              <div class="inline-flex items-center p-0.5 rounded-md bg-white border border-slate-200/80 shadow-sm shrink-0 select-none">
                <!-- 横向并排 -->
                <div
                  role="button"
                  tabindex="0"
                  class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="selectedElement?.layout !== 'stack' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="if (selectedElement) { selectedElement.layout = 'inline'; markDirty(); }"
                >
                  <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
                    <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="selectedElement?.layout !== 'stack' ? 0.7 : 0.45" />
                  </svg>
                  <span>{{ t('prop.layoutInline') }}</span>
                </div>

                <!-- 纵向堆叠 -->
                <div
                  role="button"
                  tabindex="0"
                  class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="selectedElement?.layout === 'stack' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="if (selectedElement) { selectedElement.layout = 'stack'; markDirty(); }"
                >
                  <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="3" width="12" height="4" rx="1.2" />
                    <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="selectedElement?.layout === 'stack' ? 0.7 : 0.45" />
                  </svg>
                  <span>{{ t('prop.layoutStack') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 最大选择数量限制 -->
          <div v-if="canHaveMaxSelections" class="space-y-2 pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.maxSelections') }}</span>
                <a-tooltip :content="t('prop.maxSelectionsTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-input-number v-model="currentMaxSelections" :min="1" :max="20" size="small" style="width: 100px" @change="onMaxSelectionsChange" />
            </div>
          </div>

          <!-- 日期选择器专属配置 (现代化 Arco 原生组件) -->
          <div v-if="selectedElement.type === 'date'" class="space-y-3 pt-3.5 border-t border-slate-100">
            <!-- 日期模式 (单日期 / 起止日期) -->
            <a-form-item :label="t('prop.dateMode')" class="!mb-0">
              <a-radio-group
                v-model="selectedElement.dateMode"
                type="button"
                size="small"
                class="w-full !flex"
                @change="markDirty"
              >
                <a-radio value="single" class="!flex-1 !text-center">{{ t('prop.dateModeSingle') }}</a-radio>
                <a-radio value="range" class="!flex-1 !text-center">{{ t('prop.dateModeRange') }}</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- 启用长期选项 -->
            <div class="flex items-center justify-between py-1">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.enableLongTerm') }}</span>
                <a-tooltip :content="t('prop.enableLongTermTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch
                v-model="selectedElement.enableLongTerm"
                size="small"
                @change="onEnableLongTermChange"
              />
            </div>

            <!-- 默认勾选长期 -->
            <div
              v-if="selectedElement.enableLongTerm"
              class="flex items-center justify-between py-1.5 px-3 rounded-lg bg-blue-50/60 border border-blue-100 transition-all"
            >
              <span class="text-[12px] font-medium text-blue-900">{{ t('prop.defaultLongTerm') }}</span>
              <a-switch
                v-model="selectedElement.defaultLongTerm"
                size="small"
                @change="markDirty"
              />
            </div>
          </div>

          <!-- 底部操作按钮 -->
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

<!-- 全球国家与国际区号支持列表弹窗 (全量 244 个国家/地区) -->
<a-modal
  v-model:visible="isCountryListModalVisible"
  :title="store.currentLocale === 'en' ? 'Supported Countries & Dial Codes (244 Regions)' : '全球国家与国际区号支持清单 (共 244 个地区)'"
  width="540px"
  :footer="false"
>
  <div class="space-y-3">
    <!-- 搜索框 -->
    <a-input
      v-model="countrySearchKeyword"
      allow-clear
      :placeholder="store.currentLocale === 'en' ? 'Search by country name, code or dial code...' : '搜索国家名称、英文、代码或区号 (如 +65, 新加坡, sg)...'"
      class="w-full"
    >
      <template #prefix>
        <Search class="w-3.5 h-3.5 text-slate-400" />
      </template>
    </a-input>

    <!-- 列表展示 -->
    <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-2 max-h-[420px] overflow-y-auto space-y-1.5 custom-scrollbar">
      <div
        v-for="item in filteredCountryPhoneRules"
        :key="item.iso2"
        class="flex items-center justify-between px-3 py-2 rounded-md bg-white border border-slate-100 text-xs text-slate-700 shadow-xs hover:border-blue-200 hover:bg-blue-50/30 transition-all"
      >
        <div class="flex items-center gap-2.5">
          <span class="iti__flag shrink-0" :class="'iti__' + item.iso2"></span>
          <span class="font-medium text-slate-800">{{ store.currentLocale === 'en' ? item.name : item.zh }}</span>
          <span class="text-slate-400 text-[11px] font-mono uppercase">({{ item.iso2 }})</span>
        </div>
        <span class="font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{{ item.code }}</span>
      </div>
      <div v-if="filteredCountryPhoneRules.length === 0" class="py-8 text-center text-xs text-slate-400">
        {{ store.currentLocale === 'en' ? 'No matching regions found' : '未找到匹配的国家或区号' }}
      </div>
    </div>
  </div>
</a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  store,
  selectedElement,
  selectedPage,
  markDirty,
  deletePage,
  duplicateElement,
  deleteElement
} from '@/core/store';
import {
  t,
  getOptionLabel
} from '@/core/i18n';
import { componentRegistry } from '@/registry/components';
import { countryPhoneRules } from '@/registry/phoneRules';
import OptionsEditor from './OptionsEditor.vue';
import {
  SlidersHorizontal,
  Copy,
  Trash2,
  HelpCircle,
  Globe,
  PanelRight,
  CornerDownRight,
  ChevronRight,
  Search
} from '@lucide/vue';

// 国家与区号检索弹窗状态与检索逻辑
const isCountryListModalVisible = ref(false);
const countrySearchKeyword = ref('');

const filteredCountryPhoneRules = computed(() => {
  const kw = countrySearchKeyword.value.trim().toLowerCase();
  if (!kw) return countryPhoneRules;
  return countryPhoneRules.filter(
    (item) =>
      item.code.toLowerCase().includes(kw) ||
      item.iso2.toLowerCase().includes(kw) ||
      item.name.toLowerCase().includes(kw) ||
      item.zh.toLowerCase().includes(kw)
  );
});

function getCountryIso(dialCode?: string): string {
  if (!dialCode) return 'sg';
  const rule = countryPhoneRules.find((r) => r.code === dialCode);
  return rule ? rule.iso2 : 'sg';
}

function getCountryZhName(dialCode?: string): string {
  if (!dialCode) return '新加坡';
  const rule = countryPhoneRules.find((r) => r.code === dialCode);
  if (!rule) return '';
  return store.currentLocale === 'en' ? rule.name : rule.zh;
}

// 侧边栏拖拽拉伸
const isResizing = ref(false);

function startResize(e: MouseEvent) {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = store.rightSidebarWidth;

  const onMouseMove = (moveEvent: MouseEvent) => {
    // 拖向左侧增加宽度，拖向右侧减小宽度
    const deltaX = moveEvent.clientX - startX;
    const newWidth = Math.max(260, Math.min(520, startWidth - deltaX));
    store.rightSidebarWidth = Math.round(newWidth);
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

const headerBadgeText = computed(() => {
  if (store.selectedType === 'page') return store.selectedId || t('prop.page');
  if (store.selectedType === 'element') return store.selectedId || (store.currentLocale === 'en' ? 'Unselected' : '未选中');
  return store.currentLocale === 'en' ? 'Unselected' : '未选中';
});

const componentLabel = computed(() => {
  if (!selectedElement.value) return store.currentLocale === 'en' ? 'Field' : '字段';
  const meta = componentRegistry[selectedElement.value.type];
  if (store.currentLocale === 'en') {
    return meta?.label_en || meta?.label || 'Field';
  }
  return meta?.label || '字段';
});

const isShowLabel = computed({
  get() {
    return selectedElement.value?.showLabel !== false;
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.showLabel = val;
      markDirty();
    }
  }
});

const helpPositionValue = computed<'right' | 'bottom'>({
  get() {
    return selectedElement.value?.helpPosition || 'right';
  },
  set(val: 'right' | 'bottom') {
    if (selectedElement.value) {
      selectedElement.value.helpPosition = val;
      markDirty();
    }
  }
});

const hasHelpContent = computed(() => {
  if (!selectedElement.value) return false;
  const zh = selectedElement.value.help?.trim();
  const en = selectedElement.value.help_en?.trim();
  return Boolean(zh || en);
});

const isElementRequired = computed({
  get() {
    return Boolean(selectedElement.value?.required);
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.required = val;
      markDirty();
    }
  }
});

const isDeclarationRequired = computed({
  get() {
    return selectedElement.value?.declarationRequired !== false;
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.declarationRequired = val;
      markDirty();
    }
  }
});

const isSelectMultiple = computed({
  get() {
    return Boolean(selectedElement.value?.multiple);
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.multiple = val;
      if (val && (!selectedElement.value.maxSelections || selectedElement.value.maxSelections < 1)) {
        selectedElement.value.maxSelections = 3;
      }
      markDirty();
    }
  }
});

const isStrictPhoneValidation = computed({
  get() {
    return selectedElement.value?.strictPhoneValidation !== false;
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.strictPhoneValidation = val;
      markDirty();
    }
  }
});

watch(
  () => selectedElement.value,
  (el) => {
    if (el && el.type === 'phone' && !el.dialCode) {
      el.dialCode = '+65';
    }
  },
  { immediate: true }
);

const hasPlaceholder = computed(() => {
  if (!selectedElement.value) return false;
  return ['input', 'textarea', 'select', 'date', 'country', 'nationality', 'signature', 'email'].includes(
    selectedElement.value.type
  );
});

const placeholderFieldLabel = computed(() => {
  if (!selectedElement.value) return t('prop.placeholder');
  if (selectedElement.value.type === 'signature') return t('prop.sigPadLabel');
  if (selectedElement.value.type === 'date') return t('prop.datePickerLabel');
  if (selectedElement.value.type === 'phone') return t('prop.phonePlaceholderLabel');
  if (selectedElement.value.type === 'email') return t('prop.emailPlaceholderLabel');
  return t('prop.placeholder');
});

const englishPlaceholderFieldLabel = computed(() => {
  if (!selectedElement.value) return 'Placeholder (English)';
  if (selectedElement.value.type === 'signature') return 'Signature Prompt (English)';
  if (selectedElement.value.type === 'date') return 'Date Picker Placeholder (English)';
  if (selectedElement.value.type === 'phone') return t('prop.phonePlaceholderLabel', 'en');
  if (selectedElement.value.type === 'email') return t('prop.emailPlaceholderLabel', 'en');
  return 'Placeholder (English)';
});


const hasOptionsConfig = computed(() => {
  if (!selectedElement.value) return false;
  return ['select', 'radio', 'checkbox', 'signature', 'alert'].includes(
    selectedElement.value.type
  );
});

const canStackChoices = computed(() => {
  if (!selectedElement.value) return false;
  return ['radio', 'checkbox'].includes(selectedElement.value.type);
});

const canHaveMaxSelections = computed(() => {
  if (!selectedElement.value) return false;
  if (['country', 'nationality', 'checkbox'].includes(selectedElement.value.type)) return true;
  if (selectedElement.value.type === 'select' && selectedElement.value.multiple) return true;
  return false;
});

const currentMaxSelections = computed<number>({
  get() {
    const val = Number(selectedElement.value?.maxSelections);
    return !val || val < 1 ? 1 : val;
  },
  set(val: number) {
    if (selectedElement.value) {
      selectedElement.value.maxSelections = val;
      markDirty();
    }
  }
});

function onMaxSelectionsChange(val: number | undefined) {
  if (selectedElement.value && val !== undefined) {
    selectedElement.value.maxSelections = val;
    markDirty();
  }
}

function isFieldFocused(field: 'label' | 'placeholder' | 'help' | 'default') {
  if (!store.focusedTarget || !selectedElement.value) return false;
  return (
    store.focusedTarget.elementId === selectedElement.value.id &&
    store.focusedTarget.field === field
  );
}

function setFocus(field: 'label' | 'placeholder' | 'help' | 'default') {
  if (selectedElement.value) {
    store.focusedTarget = {
      elementId: selectedElement.value.id,
      field
    };
  }
}

function setPageFocus(field: 'title' | 'desc') {
  if (selectedPage.value) {
    store.focusedTarget = {
      elementId: selectedPage.value.id,
      field: field === 'title' ? 'label' : 'help'
    };
  }
}

function clearFocus() {
  store.focusedTarget = null;
}

function onEnableLongTermChange(val: any) {
  if (selectedElement.value) {
    selectedElement.value.enableLongTerm = Boolean(val);
    if (!val) {
      selectedElement.value.defaultLongTerm = false;
    }
    markDirty();
  }
}

function handleDeletePage() {
  if (selectedPage.value) {
    deletePage(selectedPage.value.id);
  }
}
</script>

<style scoped>
:deep(.arco-form-item) {
  margin-bottom: 12px;
}
:deep(.arco-form-item-content-flex) {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  width: 100% !important;
}
</style>
