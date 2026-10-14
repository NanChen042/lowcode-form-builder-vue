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

      <!-- 语言模式快捷指示与切换器 (带双语完备率百分比指示，防止窄屏换行) -->
      <div class="px-3.5 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0 gap-2">
        <span class="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <Globe class="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{{ store.currentLocale === 'en' ? 'Language' : '编辑语言' }}</span>
        </span>
        <div class="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-[11px] select-none shadow-2xs shrink-0 whitespace-nowrap">
          <button
            type="button"
            class="flex items-center gap-1 px-2 py-0.5 rounded-md transition-all cursor-pointer font-medium leading-none whitespace-nowrap shrink-0"
            :class="store.currentLocale === 'zh' ? 'bg-white text-slate-800 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800'"
            :title="`中文完备率: ${translationStats.zhPercent}%`"
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
            :title="`英文完备率: ${translationStats.enPercent}%`"
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

      <!-- 画布页面属性配置 -->
      <div v-else-if="store.selectedType === 'page' && selectedPage" class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <!-- 场景 A：系统前置基础资料页（只读预设节点，禁止修改任何属性） -->
        <a-form v-if="selectedPage.pageType === 'system_profile'" id="system-page-prop-editor" :model="selectedPage" layout="vertical" size="small">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 uppercase tracking-wider">{{ t('prop.canvasSettings') }}</span>
            <a-tag color="arcoblue" size="small">
              {{ t('prop.systemPreset') }}
            </a-tag>
          </div>

          <a-form-item :label="t('prop.nodeType')">
            <a-input
              :model-value="t('prop.systemBaseline')"
              readonly
            >
              <template #prefix>
                <span class="text-[11px] font-mono font-semibold text-[#1677ff] bg-blue-50 px-1 py-0.5 rounded border border-blue-200/60 mr-1">01</span>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="t('prop.businessType')">
            <a-input
              :model-value="getProfileTypeName(currentProfileType)"
              readonly
            >
              <template #prefix>
                <Users v-if="currentProfileType === 'client'" class="h-3.5 w-3.5 text-blue-600 mr-1" />
                <Building2 v-else-if="currentProfileType === 'entity'" class="h-3.5 w-3.5 text-[#1677ff] mr-1" />
                <User v-else class="h-3.5 w-3.5 text-emerald-600 mr-1" />
              </template>
              <template #suffix>
                <span class="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock class="h-3 w-3" />
                  {{ t('prop.locked') }}
                </span>
              </template>
            </a-input>
          </a-form-item>

          <a-alert type="info" :show-icon="false" class="mt-2 text-xs">
            <div class="flex items-start gap-1.5 text-slate-600">
              <Lock class="h-3.5 w-3.5 text-[#1677ff] shrink-0 mt-0.5" />
              <span class="leading-relaxed text-[12px]">
                {{ t('prop.systemPresetAlert') }}
              </span>
            </div>
          </a-alert>
        </a-form>

        <!-- 场景 B：普通业务表单画布页面配置 -->
        <a-form v-else id="page-prop-editor" :model="selectedPage" layout="vertical" size="small">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 uppercase tracking-wider">{{ t('prop.canvasSettings') }}</span>
            <a-tag color="blue" size="small">
              {{ t('prop.page') }}
            </a-tag>
          </div>

          <!-- 英文模式页面配置 -->
          <template v-if="store.currentLocale === 'en'">
            <!-- 英文页面标题 -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[12px] font-medium text-slate-700">{{ t('prop.pageTitleEn') }}</span>
                <a-tag v-if="selectedPage.title && !selectedPage.title_en" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                  {{ t('prop.missingEnTag') }}
                </a-tag>
              </div>
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
            </div>

            <!-- 英文页面描述 -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[12px] font-medium text-slate-700">{{ t('prop.pageDescEn') }}</span>
                <a-tag v-if="selectedPage.description && !selectedPage.description_en" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                  {{ t('prop.missingEnTag') }}
                </a-tag>
              </div>
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
            </div>
          </template>

          <!-- 中文模式页面配置 -->
          <template v-else>
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[12px] font-medium text-slate-700">{{ t('prop.pageTitle') }}</span>
                <a-tag v-if="selectedPage.title_en && !selectedPage.title" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                  {{ t('prop.missingZhTag') }}
                </a-tag>
              </div>
              <a-input id="page-prop-title-input" v-model="selectedPage.title" allow-clear :placeholder="t('prop.pageTitlePlaceholder')" @focus="setPageFocus('title')" @blur="clearFocus" @input="markDirty" />
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[12px] font-medium text-slate-700">{{ t('prop.pageDesc') }}</span>
                <a-tag v-if="selectedPage.description_en && !selectedPage.description" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                  {{ t('prop.missingZhTag') }}
                </a-tag>
              </div>
              <a-textarea id="page-prop-desc-input" v-model="selectedPage.description" :auto-size="{ minRows: 3, maxRows: 6 }" :placeholder="t('prop.pageDescPlaceholder')" @focus="setPageFocus('desc')" @blur="clearFocus" @input="markDirty" />
            </div>
          </template>

          <div class="pt-3 border-t border-slate-100">
            <a-popconfirm
              :content="t('prop.deletePageConfirm')"
              type="error"
              :ok-text="t('modal.confirm')"
              :cancel-text="t('modal.cancel')"
              @ok="handleDeletePage"
            >
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
              <a-tag size="small" class="text-[11px] font-normal">{{ componentLabel }}</a-tag>
            </div>

            <!-- 英文模式下的字段配置 -->
            <template v-if="store.currentLocale === 'en'">
              <!-- 英文字段标题与显示标题开关 -->
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-1.5">
                    <label for="prop-label-input" class="text-[12px] font-medium text-slate-700">
                      {{ t('prop.fieldLabelEn') }}
                    </label>
                    <a-tag v-if="selectedElement.label && !selectedElement.label_en" color="orange" size="small" class="text-[10px] scale-90 origin-left">
                      {{ t('prop.missingEnTag') }}
                    </a-tag>
                  </div>
                  <div class="flex items-center gap-1.5 font-normal select-none">
                    <span class="text-[11px] text-slate-400">{{ t('prop.showLabel') }}</span>
                    <a-switch v-model="isShowLabel" size="small" />
                  </div>
                </div>
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
              </div>

              <!-- 英文副标题 (默认不常驻输入框，点击才展开) -->
              <div v-if="selectedElement.type !== 'alert'" class="mb-3">
                <div v-if="!isSubtitleExpanded" class="flex items-center justify-between py-0.5">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-[11.5px] text-[#1677ff] hover:text-blue-700 font-medium transition-colors cursor-pointer select-none"
                    @click="expandSubtitle"
                  >
                    <Plus class="w-3 h-3" />
                    <span>{{ t('prop.addHelp') }}</span>
                  </button>
                </div>
                <div v-else class="space-y-1.5">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[12px] font-medium text-slate-700">{{ t('prop.fieldHelpEn') }}</span>
                      <a-tag v-if="selectedElement.help && !selectedElement.help_en" color="orange" size="small" class="text-[10px] scale-90 origin-left">
                        {{ t('prop.missingEnTag') }}
                      </a-tag>
                    </div>
                    <button
                      type="button"
                      class="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-0.5"
                      @click="removeSubtitle"
                    >
                      <Trash2 class="w-3 h-3" />
                      <span>{{ t('prop.removeHelp') }}</span>
                    </button>
                  </div>
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

                  <!-- 方案 A：二级缩进子卡片层次感 (仅在有副标题内容时微缩进展开) -->
                  <CollapseTransition :key="`${selectedElement.id}-help-en`" :show="hasHelpContent">
                    <div
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
                  </CollapseTransition>
                </div>
              </div>

              <!-- 英文占位提示 -->
              <div v-if="hasPlaceholder" class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[12px] font-medium text-slate-700">{{ placeholderFieldLabel }}</span>
                  <a-tag v-if="selectedElement.placeholder && !selectedElement.placeholder_en" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                    {{ t('prop.missingEnTag') }}
                  </a-tag>
                </div>
                <a-input
                  id="prop-placeholder-input"
                  v-model="selectedElement.placeholder_en"
                  allow-clear
                  :placeholder="placeholderInputDefault"
                  class="w-full"
                  :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
                  @focus="setFocus('placeholder')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </div>
            </template>

            <!-- 中文模式下的字段配置 -->
            <template v-else>
              <!-- 中文字段标题与显示标题开关 -->
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-1.5">
                    <label for="prop-label-input" class="text-[12px] font-medium text-slate-700">
                      {{ t('prop.fieldLabel') }}
                    </label>
                    <a-tag v-if="selectedElement.label_en && !selectedElement.label" color="orange" size="small" class="text-[10px] scale-90 origin-left">
                      {{ t('prop.missingZhTag') }}
                    </a-tag>
                  </div>
                  <div class="flex items-center gap-1.5 font-normal select-none">
                    <span class="text-[11px] text-slate-400">{{ t('prop.showLabel') }}</span>
                    <a-switch v-model="isShowLabel" size="small" />
                  </div>
                </div>
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
              </div>

              <!-- 中文副标题 -->
              <!-- 中文副标题 (默认不常驻输入框，点击才展开) -->
              <div v-if="selectedElement.type !== 'alert'" class="mb-3">
                <div v-if="!isSubtitleExpanded" class="flex items-center justify-between py-0.5">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-[11.5px] text-[#1677ff] hover:text-blue-700 font-medium transition-colors cursor-pointer select-none"
                    @click="expandSubtitle"
                  >
                    <Plus class="w-3 h-3" />
                    <span>{{ t('prop.addHelp') }}</span>
                  </button>
                </div>
                <div v-else class="space-y-1.5">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[12px] font-medium text-slate-700">{{ t('prop.fieldHelp') }}</span>
                      <a-tag v-if="selectedElement.help_en && !selectedElement.help" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                        {{ t('prop.missingZhTag') }}
                      </a-tag>
                    </div>
                    <button
                      type="button"
                      class="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-0.5"
                      @click="removeSubtitle"
                    >
                      <Trash2 class="w-3 h-3" />
                      <span>{{ t('prop.removeHelp') }}</span>
                    </button>
                  </div>
                  <a-input
                    id="prop-help-input"
                    v-model="selectedElement.help"
                    allow-clear
                    :placeholder="t('prop.fieldHelpPlaceholder')"
                    class="w-full"
                    :class="{ 'prop-field-focused': isFieldFocused('help') }"
                    @focus="setFocus('help')"
                    @blur="clearFocus"
                    @input="markDirty"
                  />

                  <!-- 方案 A：二级缩进子卡片层次感 (仅在有副标题内容时微缩进展开) -->
                  <CollapseTransition :key="`${selectedElement.id}-help-zh`" :show="hasHelpContent">
                    <div
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
                  </CollapseTransition>
                </div>
              </div>

              <!-- 中文占位提示 -->
              <div v-if="hasPlaceholder" class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[12px] font-medium text-slate-700">{{ placeholderFieldLabel }}</span>
                  <a-tag v-if="selectedElement.placeholder_en && !selectedElement.placeholder" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                    {{ t('prop.missingZhTag') }}
                  </a-tag>
                </div>
                <a-input
                  id="prop-placeholder-input"
                  v-model="selectedElement.placeholder"
                  allow-clear
                  :placeholder="placeholderInputDefault"
                  :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
                  @focus="setFocus('placeholder')"
                  @blur="clearFocus"
                  @input="markDirty"
                />
              </div>
            </template>

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

            <!-- 必填校验提示展开项 (极简树形导轨式 Linear/Figma 风格，丝滑展开折叠过渡) -->
            <!-- 必填校验提示展开项 (极简树形导轨式 Linear/Figma 风格，默认自动提示，按需展开自定义) -->
            <CollapseTransition
              v-if="selectedElement.type !== 'alert'"
              :key="`${selectedElement.id}-req`"
              :show="Boolean(isElementRequired)"
            >
              <div
                class="ml-2 pl-3 pt-1 pb-1.5 border-l-2 border-slate-200/90 space-y-1 transition-colors group hover:border-[#1677ff]/60"
              >
                <!-- 默认轻量文案提示行，不让用户觉得必须填输入框 -->
                <div v-if="!isCustomErrorExpanded" class="flex items-center justify-between text-[11px] py-0.5">
                  <div class="flex items-center gap-1.5 text-slate-400 overflow-hidden pr-2">
                    <MessageSquare class="w-3 h-3 shrink-0 text-slate-400" />
                    <span class="truncate" :title="store.currentLocale === 'en' ? customErrorPlaceholderEn : customErrorPlaceholderZh">
                      {{ store.currentLocale === 'en' ? customErrorPlaceholderEn : customErrorPlaceholderZh }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] text-[#1677ff] hover:text-blue-700 font-medium whitespace-nowrap cursor-pointer shrink-0 transition-colors"
                    @click="isCustomErrorExpanded = true"
                  >
                    {{ t('prop.customizeError') }}
                  </button>
                </div>
                <!-- 展开后的自定义输入框 -->
                <div v-else class="space-y-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <MessageSquare class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1677ff] transition-colors shrink-0" />
                      <span class="text-[11px] font-medium text-slate-600">
                        {{ selectedElement.type === 'signature' ? t('prop.signatureErrorMsg') : t('prop.customErrorMsg') }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      @click="resetCustomError"
                    >
                      {{ t('prop.resetToDefaultError') }}
                    </button>
                  </div>
                  <a-input
                    v-if="store.currentLocale === 'en'"
                    v-model="selectedElement.customErrorMessage_en"
                    size="mini"
                    allow-clear
                    class="sub-input-mini w-full"
                    :placeholder="customErrorPlaceholderEn"
                    @input="markDirty"
                  />
                  <a-input
                    v-else
                    v-model="selectedElement.customErrorMessage"
                    size="mini"
                    allow-clear
                    class="sub-input-mini w-full"
                    :placeholder="customErrorPlaceholderZh"
                    @input="markDirty"
                  />
                </div>
              </div>
            </CollapseTransition>

            <div v-if="selectedElement.type === 'signature'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.declarationRequired') }}</span>
                <a-tooltip :content="t('prop.declarationRequiredTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isDeclarationRequired" size="small" />
            </div>

            <!-- 签名组件声明必填校验提示展开项 (极简树形导轨式 Linear/Figma 风格，默认自动提示，按需展开自定义) -->
            <CollapseTransition
              v-if="selectedElement.type === 'signature'"
              :key="`${selectedElement.id}-decl`"
              :show="Boolean(isDeclarationRequired)"
            >
              <div
                class="ml-2 pl-3 pt-1 pb-1.5 border-l-2 border-slate-200/90 space-y-1 transition-colors group hover:border-[#1677ff]/60"
              >
                <!-- 默认轻量文案提示行 -->
                <div v-if="!isDeclarationCustomErrorExpanded" class="flex items-center justify-between text-[11px] py-0.5">
                  <div class="flex items-center gap-1.5 text-slate-400 overflow-hidden pr-2">
                    <MessageSquare class="w-3 h-3 shrink-0 text-slate-400" />
                    <span class="truncate" :title="store.currentLocale === 'en' ? declarationErrorPlaceholderEn : declarationErrorPlaceholderZh">
                      {{ store.currentLocale === 'en' ? declarationErrorPlaceholderEn : declarationErrorPlaceholderZh }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] text-[#1677ff] hover:text-blue-700 font-medium whitespace-nowrap cursor-pointer shrink-0 transition-colors"
                    @click="isDeclarationCustomErrorExpanded = true"
                  >
                    {{ t('prop.customizeError') }}
                  </button>
                </div>
                <!-- 展开后的自定义输入框 -->
                <div v-else class="space-y-1">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <MessageSquare class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1677ff] transition-colors shrink-0" />
                      <span class="text-[11px] font-medium text-slate-600">
                        {{ t('prop.declarationErrorMsg') }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      @click="resetDeclarationCustomError"
                    >
                      {{ t('prop.resetToDefaultError') }}
                    </button>
                  </div>
                  <a-input
                    v-if="store.currentLocale === 'en'"
                    v-model="selectedElement.declarationErrorMessage_en"
                    size="mini"
                    allow-clear
                    class="sub-input-mini w-full"
                    :placeholder="declarationErrorPlaceholderEn"
                    @input="markDirty"
                  />
                  <a-input
                    v-else
                    v-model="selectedElement.declarationErrorMessage"
                    size="mini"
                    allow-clear
                    class="sub-input-mini w-full"
                    :placeholder="declarationErrorPlaceholderZh"
                    @input="markDirty"
                  />
                </div>
              </div>
            </CollapseTransition>

            <div v-if="['select', 'country', 'nationality'].includes(selectedElement.type)" class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.allowMultiple') }}</span>
                <a-tooltip :content="t('prop.allowMultipleTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <a-switch v-model="isSelectMultiple" size="small" />
            </div>

            <!-- 点击开启多选时，最大允许选择数紧跟在开启多选正下方 (或多选框组 checkbox 自带多选，丝滑展开折叠过渡) -->
            <CollapseTransition
              v-if="['select', 'country', 'nationality', 'checkbox'].includes(selectedElement.type)"
              :key="`${selectedElement.id}-max`"
              :show="Boolean(canHaveMaxSelections)"
            >
              <div
                class="flex items-center justify-between py-1.5 border-t border-slate-50"
              >
                <div class="flex items-center gap-1.5">
                  <span class="text-[12px] font-medium text-slate-600">{{ t('prop.maxSelections') }}</span>
                  <a-tooltip :content="t('prop.maxSelectionsTip')" position="top">
                    <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>
                <a-input-number
                  v-model="currentMaxSelections"
                  :min="1"
                  :max="20"
                  size="small"
                  style="width: 100px"
                />
              </div>
            </CollapseTransition>

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
            <a-form-item :label="t('prop.defaultDialCode')" class="mb-0">
              <a-select
                :model-value="selectedCountryIso"
                class="w-full"
                size="small"
                allow-search
                :trigger-props="{
                  position: 'br',
                  autoFitPopupWidth: false,
                  autoFitPopupMinWidth: true,
                  contentClass: 'dial-code-dropdown-popup'
                }"
                @change="onCountryIsoChange"
              >
                <!-- 选中后在输入框内渲染国旗图标和区号 -->
                <template #label="{ data }">
                  <div v-if="data" class="flex items-center gap-2 text-xs font-sans">
                    <span class="iti__flag shrink-0" :class="'iti__' + (data.value || 'sg')"></span>
                    <span class="font-mono font-medium text-slate-800">{{ getCountryCodeByIso(data.value) }}</span>
                    <span class="text-slate-600 truncate font-sans">
                      {{ getCountryNameByIso(data.value) }}
                    </span>
                  </div>
                </template>
                <a-option
                  v-for="item in countryPhoneRules"
                  :key="item.iso2"
                  :value="item.iso2"
                  :label="`${item.code} ${getCountryRuleName(item)}`"
                >
                  <div class="flex items-center justify-between w-full text-xs font-sans py-0.5">
                    <div class="flex items-center gap-2 min-w-0 flex-1 mr-2.5">
                      <span class="iti__flag shrink-0" :class="'iti__' + item.iso2"></span>
                      <span class="text-slate-800 font-sans text-xs truncate">
                        {{ getCountryRuleName(item) }}
                      </span>
                    </div>
                    <span class="font-mono font-medium text-slate-400 shrink-0 text-right">{{ item.code }}</span>
                  </div>
                </a-option>
              </a-select>
            </a-form-item>

          </div>

          <!-- 国家 / 国籍专属：预设国家 -->
          <div v-if="['country', 'nationality'].includes(selectedElement.type)" class="pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between py-1">
              <span class="text-[12px] font-medium text-slate-600">
                {{ selectedElement.type === 'nationality'
                  ? t('prop.presetNationalities')
                  : t('prop.presetCountries')
                }}
              </span>
              <a-button
                size="mini"
                type="secondary"
                class="!text-[12px] !h-6 !px-2 !rounded-md"
                @click="openCountryListModal"
              >
                <span>{{ t('prop.viewDirectory') }}</span>
                <ChevronRight class="w-3 h-3 ml-0.5 text-slate-400" />
              </a-button>
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
                {{ t('common.totalOptions', undefined, { count: selectedElement.options?.length || 0 }) }}
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



          <!-- 日期选择器专属配置 (现代化 Arco 原生组件) -->
          <div v-if="selectedElement.type === 'date'" class="space-y-3 pt-3.5 border-t border-slate-100">
            <!-- 日期模式 (单日期 / 起止日期) -->
            <a-form-item :label="t('prop.dateMode')" class="mb-0">
              <a-radio-group
                v-model="selectedElement.dateMode"
                type="button"
                size="small"
                class="w-full flex"
                @change="markDirty"
              >
                <a-radio value="single" class="flex-1 text-center">{{ t('prop.dateModeSingle') }}</a-radio>
                <a-radio value="range" class="flex-1 text-center">{{ t('prop.dateModeRange') }}</a-radio>
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

            <!-- 默认勾选长期 (丝滑展开折叠过渡) -->
            <CollapseTransition
              v-if="selectedElement.type === 'date'"
              :key="`${selectedElement.id}-longterm`"
              :show="Boolean(selectedElement.enableLongTerm)"
            >
              <div
                class="flex items-center justify-between py-1.5 px-3 rounded-lg bg-blue-50/60 border border-blue-100 transition-all"
              >
                <span class="text-[12px] font-medium text-blue-900">{{ t('prop.defaultLongTerm') }}</span>
                <a-switch
                  v-model="selectedElement.defaultLongTerm"
                  size="small"
                  @change="markDirty"
                />
              </div>
            </CollapseTransition>
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

  <!-- 全球国家/国籍/区号统一预设清单弹窗 -->
  <CountryDirectoryModal v-model:visible="isCountryListModalVisible" />
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import {
  store,
  selectedElement,
  selectedPage,
  markDirty,
  deletePage,
  duplicateElement,
  deleteElement
} from '@/core/store';
import { t, getFieldDefaultErrorMessage } from '@/core/i18n';
import { componentRegistry } from '@/registry/components';
import { countryPhoneRules, getCountryPhoneRule } from '@/registry/phoneRules';
import { useSidebarResize } from '@/utils/useSidebarResize';
import OptionsEditor from './OptionsEditor.vue';
import CountryDirectoryModal from './CountryDirectoryModal.vue';
import CollapseTransition from '@/components/common/CollapseTransition.vue';
import {
  SlidersHorizontal,
  Plus,
  Copy,
  Trash2,
  HelpCircle,
  Globe,
  PanelRight,
  CornerDownRight,
  ChevronRight,
  MessageSquare,
  Building2,
  User,
  Users,
  Lock
} from '@lucide/vue';
import { translationStats } from '@/utils/translationHelper';
import type { ProfileType } from '@/types/schema';

function getProfileTypeName(type?: ProfileType) {
  if (type === 'client') return t('prop.clientCase');
  if (type === 'entity') return t('prop.entityCase');
  return t('prop.individualCase');
}

// 当前基础资料业务类型
const currentProfileType = computed(() => {
  return selectedPage.value?.profileType || store.meta.profileType || 'client';
});

// 全球国家/国籍/区号统一预设清单弹窗状态
const isCountryListModalVisible = ref(false);

function openCountryListModal() {
  isCountryListModalVisible.value = true;
}

const selectedCountryIso = computed(() => {
  if (!selectedElement.value) return 'sg';
  if (selectedElement.value.countryCode) return selectedElement.value.countryCode.toLowerCase();
  if (selectedElement.value.dialCode) {
    return getCountryPhoneRule(selectedElement.value.dialCode).iso2;
  }
  return 'sg';
});

function getCountryRuleName(rule?: { name?: string; zh?: string }): string {
  if (!rule) return '';
  return store.currentLocale === 'en' ? (rule.name || rule.zh || '') : (rule.zh || rule.name || '');
}

function getCountryCodeByIso(iso?: string): string {
  return getCountryPhoneRule(iso).code;
}

function getCountryNameByIso(iso?: string): string {
  if (!iso) return t('common.singapore');
  const rule = getCountryPhoneRule(iso);
  return getCountryRuleName(rule);
}

function onCountryIsoChange(iso: any) {
  if (!selectedElement.value || selectedElement.value.type !== 'phone') {
    markDirty();
    return;
  }
  const rule = getCountryPhoneRule(String(iso));
  selectedElement.value.countryCode = rule.iso2;
  selectedElement.value.dialCode = rule.code;
  markDirty();
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

const componentLabel = computed(() => {
  if (!selectedElement.value) return t('prop.fieldFallback');
  const meta = componentRegistry[selectedElement.value.type];
  if (!meta) return t('prop.fieldFallback');
  return (store.currentLocale === 'en' ? (meta.label_en || meta.label) : meta.label) || t('prop.fieldFallback');
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
  const currentVal = store.currentLocale === 'en'
    ? selectedElement.value.help_en
    : selectedElement.value.help;
  return Boolean(currentVal?.trim());
});

// 副标题显隐展开状态 (默认根据当前元素是否已有副标题内容决定，避免空输入框常驻误导用户)
const isSubtitleExpanded = ref(false);

// 必填未填自定义错误提示显隐展开状态 (默认折叠使用系统自动提示，点击才展开自定义)
const isCustomErrorExpanded = ref(false);

// 签名组件声明必填自定义错误提示显隐展开状态
const isDeclarationCustomErrorExpanded = ref(false);

watch(
  () => [selectedElement.value?.id, store.currentLocale],
  () => {
    if (!selectedElement.value) {
      isSubtitleExpanded.value = false;
      isCustomErrorExpanded.value = false;
      isDeclarationCustomErrorExpanded.value = false;
      return;
    }
    const hasHelp = store.currentLocale === 'en'
      ? Boolean(selectedElement.value.help_en?.trim())
      : Boolean(selectedElement.value.help?.trim());
    isSubtitleExpanded.value = hasHelp;

    const hasCustomErr = store.currentLocale === 'en'
      ? Boolean(selectedElement.value.customErrorMessage_en?.trim())
      : Boolean(selectedElement.value.customErrorMessage?.trim());
    isCustomErrorExpanded.value = hasCustomErr;

    const hasDeclErr = store.currentLocale === 'en'
      ? Boolean(selectedElement.value.declarationErrorMessage_en?.trim())
      : Boolean(selectedElement.value.declarationErrorMessage?.trim());
    isDeclarationCustomErrorExpanded.value = hasDeclErr;
  },
  { immediate: true }
);

function expandSubtitle() {
  isSubtitleExpanded.value = true;
  nextTick(() => {
    document.getElementById('prop-help-input')?.focus();
  });
}

function removeSubtitle() {
  if (selectedElement.value) {
    selectedElement.value.help = '';
    selectedElement.value.help_en = '';
    markDirty();
  }
  isSubtitleExpanded.value = false;
}

function resetCustomError() {
  if (selectedElement.value) {
    selectedElement.value.customErrorMessage = '';
    selectedElement.value.customErrorMessage_en = '';
    markDirty();
  }
  isCustomErrorExpanded.value = false;
}

function resetDeclarationCustomError() {
  if (selectedElement.value) {
    selectedElement.value.declarationErrorMessage = '';
    selectedElement.value.declarationErrorMessage_en = '';
    markDirty();
  }
  isDeclarationCustomErrorExpanded.value = false;
}

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

const customErrorPlaceholderZh = computed(() => {
  if (!selectedElement.value) return '';
  return `默认：${getFieldDefaultErrorMessage(selectedElement.value, undefined, 'zh')}`;
});

const customErrorPlaceholderEn = computed(() => {
  if (!selectedElement.value) return '';
  return `Default: ${getFieldDefaultErrorMessage(selectedElement.value, undefined, 'en')}`;
});

const declarationErrorPlaceholderZh = computed(() => {
  if (!selectedElement.value) return '';
  return `默认：${getFieldDefaultErrorMessage(selectedElement.value, 'declaration', 'zh')}`;
});

const declarationErrorPlaceholderEn = computed(() => {
  if (!selectedElement.value) return '';
  return `Default: ${getFieldDefaultErrorMessage(selectedElement.value, 'declaration', 'en')}`;
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

const hasPlaceholder = computed(() => {
  if (!selectedElement.value) return false;
  return ['input', 'textarea', 'select', 'date', 'country', 'nationality', 'signature', 'email'].includes(
    selectedElement.value.type
  );
});

const placeholderInputDefault = computed(() => {
  if (!selectedElement.value) return '';
  if (selectedElement.value.type === 'email') {
    return t('prop.emailPlaceholder');
  }
  return placeholderFieldLabel.value;
});

const placeholderFieldLabel = computed(() => {
  if (!selectedElement.value) return t('prop.placeholder');
  if (selectedElement.value.type === 'signature') return t('prop.sigPadLabel');
  if (selectedElement.value.type === 'date') return t('prop.datePickerLabel');
  if (selectedElement.value.type === 'email') return t('prop.emailPlaceholderLabel');
  return t('prop.placeholder');
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
  if (selectedElement.value.type === 'checkbox') return true;
  if (['select', 'country', 'nationality'].includes(selectedElement.value.type) && selectedElement.value.multiple) return true;
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

watch(
  () => store.focusedTarget,
  (target) => {
    if (!target) return;
    // 如果当前正在画布中的 contenteditable 节点编辑输入，绝不偷走焦点
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement.closest('[contenteditable]')) {
      return;
    }
    nextTick(() => {
      let targetInput: HTMLElement | null = null;
      if (target.field === 'label') {
        targetInput = document.getElementById('prop-label-input') || document.getElementById('page-prop-title-input');
      } else if (target.field === 'help') {
        targetInput = document.getElementById('prop-help-input') || document.getElementById('page-prop-desc-input');
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
        const inputElem = (targetInput.tagName === 'INPUT' || targetInput.tagName === 'TEXTAREA')
          ? targetInput
          : (targetInput.querySelector('input, textarea') as HTMLElement);
        if (inputElem) {
          inputElem.focus();
        }
      }
    });
  },
  { deep: true }
);

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
