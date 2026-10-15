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
                <Users v-if="currentProfileType === 'customer' || currentProfileType === 'client'" class="h-3.5 w-3.5 text-blue-600 mr-1" />
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

          <!-- 页面配置 (统一单源，根据当前语言自动响应) -->
          <!-- 页面标题 -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[12px] font-medium text-slate-700">
                {{ store.currentLocale === 'en' ? t('prop.pageTitleEn') : t('prop.pageTitle') }}
              </span>
              <a-tag v-if="isPageTitleMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
              </a-tag>
            </div>
            <a-input
              id="page-prop-title-input"
              v-model="pageTitleModel"
              allow-clear
              :placeholder="t('prop.pageTitlePlaceholder')"
              class="w-full"
              @focus="setPageFocus('title')"
              @blur="clearFocus"
              @input="markDirty"
            />
          </div>

          <!-- 页面描述 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[12px] font-medium text-slate-700">
                {{ store.currentLocale === 'en' ? t('prop.pageDescEn') : t('prop.pageDesc') }}
              </span>
              <a-tag v-if="isPageDescMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
              </a-tag>
            </div>
            <a-textarea
              id="page-prop-desc-input"
              v-model="pageDescModel"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              :placeholder="t('prop.pageDescPlaceholder')"
              class="w-full"
              @focus="setPageFocus('description')"
              @blur="clearFocus"
              @input="markDirty"
            />
          </div>

          <div class="pt-3 border-t border-slate-100">
            <a-popconfirm
              :content="t('prop.deletePageConfirm')"
              type="warning"
              :ok-text="t('modal.confirm')"
              :cancel-text="t('modal.cancel')"
              :ok-button-props="{ status: 'danger', size: 'small' }"
              :cancel-button-props="{ size: 'small' }"
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

            <!-- 字段基础配置 (统一单源，按激活语言自动读写) -->
            <!-- 字段标题与显示标题开关 -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-1.5">
                  <label for="prop-label-input" class="text-[12px] font-medium text-slate-700">
                    {{ store.currentLocale === 'en' ? t('prop.fieldLabelEn') : t('prop.fieldLabel') }}
                  </label>
                  <a-tag v-if="isFieldLabelMissing" color="orange" size="small" class="text-[10px] scale-90 origin-left">
                    {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
                  </a-tag>
                </div>
                <div class="flex items-center gap-1.5 font-normal select-none">
                  <span class="text-[11px] text-slate-400">{{ t('prop.showLabel') }}</span>
                  <a-switch v-model="isShowLabel" size="small" />
                </div>
              </div>
              <a-textarea
                id="prop-label-input"
                v-model="fieldLabelModel"
                :auto-size="{ minRows: 1, maxRows: 4 }"
                allow-clear
                :placeholder="t('prop.fieldLabelPlaceholder')"
                class="w-full"
                :class="{ 'prop-field-focused': isFieldFocused('label') }"
                @focus="setFocus('label')"
                @blur="clearFocus"
                @input="markDirty"
              />
            </div>

            <!-- 字段副标题与排布方式分段器 -->
            <div v-if="selectedElement.type !== 'alert'" class="mb-3">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-1.5">
                  <label for="prop-help-input" class="text-[12px] font-medium text-slate-700">
                    {{ store.currentLocale === 'en' ? t('prop.fieldHelpEn') : t('prop.fieldHelp') }}
                  </label>
                  <a-tag v-if="isFieldHelpMissing" color="orange" size="small" class="text-[10px] scale-90 origin-left">
                    {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
                  </a-tag>
                </div>
              </div>
              <a-textarea
                id="prop-help-input"
                v-model="fieldHelpModel"
                :auto-size="{ minRows: 1, maxRows: 3 }"
                allow-clear
                :placeholder="t('prop.fieldHelpPlaceholder')"
                class="w-full"
                :class="{ 'prop-field-focused': isFieldFocused('help') }"
                @focus="setFocus('help')"
                @blur="clearFocus"
                @input="markDirty"
              />

              <!-- 排布方式切换分段器：可选 标题右侧显示（默认同排浅灰色小字）或 标题下方换行显示 -->
              <div
                class="mt-2 flex items-center justify-between py-1 pl-1"
              >
                <div class="flex items-center gap-1.5">
                  <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="text-[12px] font-medium text-slate-600">{{ t('prop.helpLayout') }}</span>
                  <a-tooltip :content="t('prop.helpPositionTip')">
                    <HelpCircle class="w-3.5 h-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>

                <!-- 现代微型胶囊分段器 -->
                <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs shrink-0 select-none">
                  <button
                    type="button"
                    class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                    :class="helpPositionValue === 'right' ? 'bg-[#1677ff] text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'"
                    :title="t('prop.helpPositionRightDesc')"
                    @click="helpPositionValue = 'right'"
                  >
                    <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
                      <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="helpPositionValue === 'right' ? 0.7 : 0.45" />
                    </svg>
                    <span>{{ t('prop.helpPositionRight') }}</span>
                  </button>

                  <button
                    type="button"
                    class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                    :class="helpPositionValue === 'bottom' ? 'bg-[#1677ff] text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'"
                    :title="t('prop.helpPositionBottomDesc')"
                    @click="helpPositionValue = 'bottom'"
                  >
                    <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="3" width="12" height="4" rx="1.2" />
                      <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="helpPositionValue === 'bottom' ? 0.7 : 0.45" />
                    </svg>
                    <span>{{ t('prop.helpPositionBottom') }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 字段占位提示 (统一单源) -->
            <div v-if="hasPlaceholder" class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[12px] font-medium text-slate-700">{{ placeholderFieldLabel }}</span>
                <a-tag v-if="isFieldPlaceholderMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
                  {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
                </a-tag>
              </div>
              <a-input
                id="prop-placeholder-input"
                v-model="fieldPlaceholderModel"
                allow-clear
                :placeholder="placeholderInputDefault"
                class="w-full"
                :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
                @focus="setFocus('placeholder')"
                @blur="clearFocus"
                @input="markDirty"
              />
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

            <!-- 必填校验提示展开项 (极简树形导轨式 Linear/Figma 风格，丝滑展开折叠过渡) -->
            <!-- 必填校验提示展开项 (极简无框设计：默认态简洁文字 + 铅笔图标切换；自定义态输入框 + 恢复图标切换) -->
            <CollapseTransition
              v-if="selectedElement.type !== 'alert'"
              :key="`${selectedElement.id}-req`"
              :show="Boolean(isElementRequired)"
            >
              <div class="pt-1.5 pb-0.5 space-y-1">
                <div class="flex items-center justify-between text-[11.5px]">
                  <div class="flex items-center gap-1.5 text-slate-600 font-medium overflow-hidden pr-2">
                    <MessageSquare class="w-3.5 h-3.5 text-[#1677ff] shrink-0" />
                    <span>{{ selectedElement.type === 'signature' ? t('prop.signatureErrorMsg') : t('prop.customErrorMsg') }}</span>
                  </div>
                  
                  <!-- 图标切换按钮 -->
                  <button
                    v-if="!isCustomErrorExpanded"
                    type="button"
                    class="inline-flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                    :title="t('prop.customizeError')"
                    @click="expandCustomError"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-else
                    type="button"
                    class="inline-flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    :title="t('prop.resetToDefaultError')"
                    @click="resetCustomError"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- 默认模式：简洁纯文本展示系统默认提示 -->
                <div
                  v-if="!isCustomErrorExpanded"
                  class="text-[11.5px] text-slate-400 truncate select-none mt-0.5"
                  :title="rawDefaultErrorMessage"
                >
                  <span class="text-slate-400">{{ store.currentLocale === 'en' ? 'Default: ' : '默认：' }}</span>“{{ rawDefaultErrorMessage }}”
                </div>

                <!-- 自定义模式：输入框 (点击铅笔自动聚焦，输入即保存，清空或点击重置即回退) -->
                <div v-else class="mt-1">
                  <a-input
                    id="prop-custom-error-input"
                    v-model="fieldCustomErrorModel"
                    size="mini"
                    allow-clear
                    class="w-full"
                    :placeholder="rawDefaultErrorMessage"
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

            <!-- 签名组件声明必填校验提示展开项 (极简无框设计：默认态简洁文字 + 铅笔图标切换；自定义态输入框 + 恢复图标切换) -->
            <CollapseTransition
              v-if="selectedElement.type === 'signature'"
              :key="`${selectedElement.id}-decl`"
              :show="Boolean(isDeclarationRequired)"
            >
              <div class="pt-1.5 pb-0.5 space-y-1">
                <div class="flex items-center justify-between text-[11.5px]">
                  <div class="flex items-center gap-1.5 text-slate-600 font-medium overflow-hidden pr-2">
                    <MessageSquare class="w-3.5 h-3.5 text-[#1677ff] shrink-0" />
                    <span>{{ t('prop.declarationErrorMsg') }}</span>
                  </div>
                  
                  <!-- 图标切换按钮 -->
                  <button
                    v-if="!isDeclarationCustomErrorExpanded"
                    type="button"
                    class="inline-flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                    :title="t('prop.customizeError')"
                    @click="expandDeclarationCustomError"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-else
                    type="button"
                    class="inline-flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    :title="t('prop.resetToDefaultError')"
                    @click="resetDeclarationCustomError"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- 默认模式：简洁纯文本展示系统默认提示 -->
                <div
                  v-if="!isDeclarationCustomErrorExpanded"
                  class="text-[11.5px] text-slate-400 truncate select-none mt-0.5"
                  :title="rawDeclarationErrorMessage"
                >
                  <span class="text-slate-400">{{ store.currentLocale === 'en' ? 'Default: ' : '默认：' }}</span>“{{ rawDeclarationErrorMessage }}”
                </div>

                <!-- 自定义模式：输入框 (点击铅笔自动聚焦，输入即保存，清空或点击重置即回退) -->
                <div v-else class="mt-1">
                  <a-input
                    id="prop-declaration-error-input"
                    v-model="fieldDeclarationErrorModel"
                    size="mini"
                    allow-clear
                    class="w-full"
                    :placeholder="rawDeclarationErrorMessage"
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
                  <a-tooltip
                    :content="['country', 'nationality'].includes(selectedElement.type)
                      ? (store.currentLocale === 'en' ? 'Max 3 selections for country/nationality' : '国家/国籍组件最多允许选择 3 项')
                      : (store.currentLocale === 'en' ? `Max ${maxAllowedLimit} selections (up to options count)` : `最多允许选择 ${maxAllowedLimit} 项（不超过配置选项数）`)"
                    position="top"
                  >
                    <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>
                <a-input-number
                  v-model="currentMaxSelections"
                  :min="1"
                  :max="maxAllowedLimit"
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

            <!-- 多行文本自适应行数配置 (最小行数 / 最大行数，无灰底标准行) -->
            <div v-if="selectedElement.type === 'textarea'" class="space-y-0.5">
              <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
                <div class="flex items-center gap-1.5">
                  <span class="text-[12px] font-medium text-slate-600">{{ t('prop.minRows') }}</span>
                  <a-tooltip :content="t('prop.minRowsTip')" position="top">
                    <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>
                <a-input-number
                  v-model="textareaMinRows"
                  :min="1"
                  :max="10"
                  size="small"
                  style="width: 100px"
                />
              </div>

              <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
                <div class="flex items-center gap-1.5">
                  <span class="text-[12px] font-medium text-slate-600">{{ t('prop.maxRows') }}</span>
                  <a-tooltip :content="t('prop.maxRowsTip')" position="top">
                    <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>
                <a-input-number
                  v-model="textareaMaxRows"
                  :min="textareaMinRows"
                  :max="20"
                  size="small"
                  style="width: 100px"
                />
              </div>
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

          <!-- 提示区块专属：提示内容多行编辑 -->
          <div v-if="selectedElement.type === 'alert'" class="space-y-2 pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-[12px] font-semibold text-slate-700 whitespace-nowrap">
                  {{ t('prop.alertContentTitle') }}
                </span>
                <span
                  v-if="isAlertContentMissing"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0"
                >
                  {{ t('prop.untranslated') }}
                </span>
                <a-tooltip :content="t('prop.alertContentTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors shrink-0" />
                </a-tooltip>
              </div>

              <!-- 快捷插入辅助条 (基于标准 Arco a-dropdown 与 a-button 组件) -->
              <div class="flex items-center gap-1.5 shrink-0">
                <!-- 列表项二级下拉菜单 (官方标准 Arco a-dropdown 组件) -->
                <a-dropdown position="bl" @select="handleListDropdownSelect">
                  <a-button
                    size="mini"
                    type="secondary"
                    class="!text-[12px] !h-6 !px-2 !rounded"
                  >
                    <template #icon>
                      <List class="w-3.5 h-3.5 text-slate-500" />
                    </template>
                    <span>{{ t('prop.alertInsertBullet') }}</span>
                    <ChevronDown class="w-3 h-3 ml-1 text-slate-400" />
                  </a-button>
                  <template #content>
                    <a-doption value="circle">圆点列表 (无序)</a-doption>
                    <a-doption value="number">数字列表 (有序)</a-doption>
                  </template>
                </a-dropdown>

                <!-- 超链接插入按钮 (官方标准 Arco a-button 组件) -->
                <a-button
                  size="mini"
                  type="secondary"
                  class="!text-[12px] !h-6 !px-2 !rounded"
                  @click="insertAlertLink"
                >
                  <template #icon>
                    <Link2 class="w-3.5 h-3.5 text-slate-500" />
                  </template>
                  <span>{{ t('prop.alertInsertLink') }}</span>
                </a-button>
              </div>
            </div>

            <a-textarea
              id="prop-alert-content-input"
              v-model="alertContentModel"
              :auto-size="{ minRows: 6, maxRows: 14 }"
              :placeholder="t('prop.alertContentPlaceholder')"
              class="w-full !text-[12px] font-sans"
            />
          </div>

          <!-- 选项配置 (单选、多选、下拉、签名声明条款) -->
          <div v-if="hasOptionsConfig" class="space-y-2.5 pt-3.5 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-semibold text-slate-700">
                  {{ selectedElement.type === 'signature' ? t('prop.clauseConfig') : t('prop.optionsConfig') }}
                </span>
                <a-tooltip
                  :content="selectedElement.type === 'signature' ? t('prop.clauseConfigTip') : t('prop.optionsConfigTip')"
                  position="top"
                >
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>
              <span class="text-[11px] text-slate-400">
                {{ selectedElement.type === 'signature'
                  ? (store.currentLocale === 'en'
                      ? `${selectedElement.options?.length || 0} items`
                      : `共 ${selectedElement.options?.length || 0} 条`)
                  : t('common.totalOptions', undefined, { count: selectedElement.options?.length || 0 })
                }}
              </span>
            </div>

            <OptionsEditor v-if="selectedElement" :element="selectedElement" />

            <!-- 选项排布方式 (统一二级子配置规范：精致微型无框分段器) -->
            <div
              v-if="canStackChoices"
              class="mt-2 flex items-center justify-between py-1 pl-1"
            >
              <div class="flex items-center gap-1.5 shrink-0">
                <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span class="text-[12px] font-medium text-slate-600 whitespace-nowrap">{{ t('prop.optionLayout') }}</span>
              </div>

              <!-- 现代微型胶囊分段器 (小巧精致) -->
              <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs shrink-0 select-none">
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



          <!-- 日期选择器专属配置 (微型胶囊分段器 + 规范二级子项) -->
          <div v-if="selectedElement && selectedElement.type === 'date'" class="space-y-0.5 pt-1.5 border-t border-slate-100">
            <!-- 日期模式 (单日期 / 起止日期) -->
            <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
              <div class="flex items-center gap-1.5">
                <span class="text-[12px] font-medium text-slate-600">{{ t('prop.dateMode') }}</span>
                <a-tooltip :content="t('prop.dateModeTip')" position="top">
                  <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                </a-tooltip>
              </div>

              <!-- 微型胶囊分段器: 单日期 / 起止日期 -->
              <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs select-none">
                <div
                  role="button"
                  tabindex="0"
                  class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="(!selectedElement.dateMode || selectedElement.dateMode === 'single') ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="setDateMode('single')"
                >
                  {{ t('prop.dateModeSingle') }}
                </div>
                <div
                  role="button"
                  tabindex="0"
                  class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
                  :class="selectedElement.dateMode === 'range' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
                  @click="setDateMode('range')"
                >
                  {{ t('prop.dateModeRange') }}
                </div>
              </div>
            </div>

            <!-- 启用长期选项 (仅单日期模式生效；起止日期不展示长期选项) -->
            <div v-if="selectedElement.dateMode !== 'range'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
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

            <!-- 默认勾选长期 (二级子项：无框缩进导轨规范，丝滑展开折叠过渡) -->
            <CollapseTransition
              v-if="selectedElement && selectedElement.type === 'date' && selectedElement.dateMode !== 'range'"
              :key="`${selectedElement?.id}-longterm`"
              :show="Boolean(selectedElement?.enableLongTerm)"
            >
              <div class="flex items-center justify-between py-1 pl-1">
                <div class="flex items-center gap-1.5">
                  <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="text-[12px] font-medium text-slate-600">{{ t('prop.defaultLongTerm') }}</span>
                  <a-tooltip :content="t('prop.defaultLongTermTip')" position="top">
                    <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
                  </a-tooltip>
                </div>
                <a-switch
                  v-if="selectedElement"
                  v-model="selectedElement.defaultLongTerm"
                  size="small"
                  @change="markDirty"
                />
              </div>
            </CollapseTransition>
          </div>

          <!-- 条件联动从属信息：现代结构化逻辑卡片 (Option A) -->
          <div
            v-if="selectedElement && selectedElement.dependsOn && dependencyInfo"
            class="pt-3.5 border-t border-slate-100"
          >
            <div class="rounded-xl border border-blue-200/90 bg-gradient-to-b from-blue-50/70 to-indigo-50/20 p-2.5 shadow-xs space-y-2.5 transition-all">
              <!-- 卡片顶栏：标题 + 生效中徽标 + 解除联动操作 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <Link2 class="h-3.5 w-3.5 text-[#1677ff]" />
                  <span class="text-[12px] font-semibold text-slate-800">{{ t('prop.linkageRuleTitle') }}</span>
                  <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 text-[10px] font-medium leading-none">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {{ t('prop.linkageActive') }}
                  </span>
                </div>

                <!-- 解除联动按钮 (带气泡防误触) -->
                <a-popconfirm
                  :content="t('prop.unlinkRuleConfirm')"
                  type="warning"
                  position="bottom"
                  @ok="onToggleDependency(false)"
                >
                  <button
                    type="button"
                    class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-slate-400 hover:text-red-600 hover:bg-red-50/80 transition-all cursor-pointer border border-transparent hover:border-red-200/60"
                    :title="t('prop.unlink')"
                  >
                    <Unlink class="w-3 h-3" />
                    <span>{{ t('prop.unlink') }}</span>
                  </button>
                </a-popconfirm>
              </div>

              <!-- 逻辑结构化胶囊区：当 [父字段 ↗] 选择 [选项值] 时展开 -->
              <div class="flex flex-wrap items-center gap-1.5 text-[12px] leading-relaxed select-none bg-white/95 p-2 rounded-lg border border-blue-100/90 shadow-2xs">
                <span class="text-slate-400 font-medium">{{ t('prop.linkageWhen') }}</span>
                
                <!-- 父级组件胶囊 (点击穿透定位高亮父组件) -->
                <button
                  type="button"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#1677ff] hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium cursor-pointer border border-blue-200/80 max-w-[130px] truncate group"
                  :title="t('prop.locateParentTip')"
                  @click="locateParentField"
                >
                  <span class="truncate">{{ dependencyInfo.parentLabel }}</span>
                  <ExternalLink class="w-2.5 h-2.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>

                <span class="text-slate-400 font-medium">{{ t('prop.linkageEquals') }}</span>

                <!-- 触发选项胶囊 -->
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200/80 max-w-[130px] truncate shadow-2xs">
                  <span class="truncate">{{ dependencyInfo.optLabel }}</span>
                </span>

                <span class="text-slate-500 font-medium">{{ t('prop.linkageThenShow') }}</span>
              </div>

              <!-- 底部辅助说明 (极简一行) -->
              <div class="flex items-center gap-1 text-[11px] text-slate-400 leading-tight">
                <Info class="w-3 h-3 text-slate-400 shrink-0" />
                <span>{{ t('prop.linkageTipSimple') }}</span>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div v-if="selectedElement" class="pt-5 border-t border-slate-100 flex gap-2">
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
  deleteElement,
  selectElement,
  highlightPropertyField,
  triggerHighlight
} from '@/core/store';
import {
  t,
  getFieldDefaultErrorMessage,
  getPageText,
  setPageText,
  getFieldText,
  setFieldText,
  getOptionLabel
} from '@/core/i18n';
import { componentRegistry } from '@/registry/components';
import { countryPhoneRules, getCountryPhoneRule } from '@/registry/phoneRules';
import { useSidebarResize } from '@/utils/useSidebarResize';
import OptionsEditor from './OptionsEditor.vue';
import CountryDirectoryModal from './CountryDirectoryModal.vue';
import CollapseTransition from '@/components/common/CollapseTransition.vue';
import {
  SlidersHorizontal,
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
  Lock,
  Link2,
  Unlink,
  ExternalLink,
  Info,
  Pencil,
  RotateCcw,
  List,
  ChevronDown
} from '@lucide/vue';
import { translationStats } from '@/utils/translationHelper';
import type { ProfileType } from '@/types/schema';

function getProfileTypeName(type?: ProfileType) {
  if (type === 'customer' || type === 'client') return t('prop.clientCase');
  if (type === 'entity') return t('prop.entityCase');
  return t('prop.individualCase');
}

// 当前基础资料业务类型
const currentProfileType = computed(() => {
  return selectedPage.value?.profileType || store.meta.profileType || 'customer';
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

// ========== 统一单源多语言响应式双向绑定 ==========
// 页面标题与描述双向绑定
const pageTitleModel = computed({
  get() {
    return selectedPage.value ? getPageText(selectedPage.value, 'title') : '';
  },
  set(val: string) {
    if (selectedPage.value) {
      setPageText(selectedPage.value, 'title', val);
    }
  }
});

const pageDescModel = computed({
  get() {
    return selectedPage.value ? getPageText(selectedPage.value, 'description') : '';
  },
  set(val: string) {
    if (selectedPage.value) {
      setPageText(selectedPage.value, 'description', val);
    }
  }
});

const isPageTitleMissing = computed(() => {
  if (!selectedPage.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedPage.value.title && !selectedPage.value.title_en);
  }
  return Boolean(selectedPage.value.title_en && !selectedPage.value.title);
});

const isPageDescMissing = computed(() => {
  if (!selectedPage.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedPage.value.description && !selectedPage.value.description_en);
  }
  return Boolean(selectedPage.value.description_en && !selectedPage.value.description);
});

// 组件字段属性双向绑定
const fieldLabelModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'label') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'label', val);
    }
  }
});

const fieldHelpModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'help') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'help', val);
    }
  }
});

const fieldPlaceholderModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'placeholder') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'placeholder', val);
    }
  }
});

const fieldCustomErrorModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'customErrorMessage') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'customErrorMessage', val);
    }
  }
});

const fieldDeclarationErrorModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'declarationErrorMessage') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'declarationErrorMessage', val);
    }
  }
});

const isFieldLabelMissing = computed(() => {
  if (!selectedElement.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedElement.value.label && !selectedElement.value.label_en);
  }
  return Boolean(selectedElement.value.label_en && !selectedElement.value.label);
});

const isFieldHelpMissing = computed(() => {
  if (!selectedElement.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedElement.value.help && !selectedElement.value.help_en);
  }
  return Boolean(selectedElement.value.help_en && !selectedElement.value.help);
});

const isFieldPlaceholderMissing = computed(() => {
  if (!selectedElement.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedElement.value.placeholder && !selectedElement.value.placeholder_en);
  }
  return Boolean(selectedElement.value.placeholder_en && !selectedElement.value.placeholder);
});

// 提示区块专属提示内容双向绑定
const alertContentModel = computed({
  get() {
    return selectedElement.value ? getFieldText(selectedElement.value, 'content') : '';
  },
  set(val: string) {
    if (selectedElement.value) {
      setFieldText(selectedElement.value, 'content', val);
    }
  }
});

const isAlertContentMissing = computed(() => {
  if (!selectedElement.value || selectedElement.value.type !== 'alert') return false;
  if (store.currentLocale === 'en') {
    return Boolean(selectedElement.value.content && !selectedElement.value.content_en);
  }
  return Boolean(selectedElement.value.content_en && !selectedElement.value.content);
});

function handleListDropdownSelect(value: any) {
  if (!selectedElement.value) return;
  if (value === 'number') {
    selectedElement.value.listStyle = 'number';
    const current = alertContentModel.value || '';
    const prefix = current && !current.endsWith('\n') ? '\n' : '';
    const lines = current.split('\n');
    let maxNum = 0;
    for (const line of lines) {
      const match = line.trim().match(/^(\d+)[\.、]/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const nextNum = maxNum + 1;
    alertContentModel.value = `${current}${prefix}${nextNum}. `;
  } else {
    selectedElement.value.listStyle = 'circle';
    const current = alertContentModel.value || '';
    const prefix = current && !current.endsWith('\n') ? '\n' : '';
    alertContentModel.value = `${current}${prefix}- `;
  }
  markDirty();
}

function insertAlertLink() {
  const current = alertContentModel.value || '';
  const prefix = current && !current.endsWith('\n') && !current.endsWith(' ') ? ' ' : '';
  alertContentModel.value = `${current}${prefix}[提示文字](xxx.com)`;
}

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

// 必填未填自定义错误提示显隐展开状态 (默认折叠使用系统自动提示，点击才展开自定义)
const isCustomErrorExpanded = ref(false);

// 签名组件声明必填自定义错误提示显隐展开状态
const isDeclarationCustomErrorExpanded = ref(false);

watch(
  () => [selectedElement.value?.id, store.currentLocale],
  () => {
    if (!selectedElement.value) {
      isCustomErrorExpanded.value = false;
      isDeclarationCustomErrorExpanded.value = false;
      return;
    }

    const hasCustomErr = store.currentLocale === 'en'
      ? (typeof selectedElement.value.customErrorMessage_en === 'string' && selectedElement.value.customErrorMessage_en.trim().length > 0)
      : (typeof selectedElement.value.customErrorMessage === 'string' && selectedElement.value.customErrorMessage.trim().length > 0);
    isCustomErrorExpanded.value = hasCustomErr;

    const hasDeclErr = store.currentLocale === 'en'
      ? (typeof selectedElement.value.declarationErrorMessage_en === 'string' && selectedElement.value.declarationErrorMessage_en.trim().length > 0)
      : (typeof selectedElement.value.declarationErrorMessage === 'string' && selectedElement.value.declarationErrorMessage.trim().length > 0);
    isDeclarationCustomErrorExpanded.value = hasDeclErr;
  },
  { immediate: true }
);


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

const rawDefaultErrorMessage = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldDefaultErrorMessage(
    selectedElement.value,
    selectedElement.value.type === 'signature' ? 'signature' : undefined,
    store.currentLocale as 'zh' | 'en'
  );
});

const rawDeclarationErrorMessage = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldDefaultErrorMessage(
    selectedElement.value,
    'declaration',
    store.currentLocale as 'zh' | 'en'
  );
});

function expandCustomError() {
  isCustomErrorExpanded.value = true;
  nextTick(() => {
    document.getElementById('prop-custom-error-input')?.focus();
  });
}

function resetCustomError() {
  if (selectedElement.value) {
    selectedElement.value.customErrorMessage = '';
    selectedElement.value.customErrorMessage_en = '';
    markDirty();
  }
  isCustomErrorExpanded.value = false;
}

function expandDeclarationCustomError() {
  isDeclarationCustomErrorExpanded.value = true;
  nextTick(() => {
    document.getElementById('prop-declaration-error-input')?.focus();
  });
}

function resetDeclarationCustomError() {
  if (selectedElement.value) {
    selectedElement.value.declarationErrorMessage = '';
    selectedElement.value.declarationErrorMessage_en = '';
    markDirty();
  }
  isDeclarationCustomErrorExpanded.value = false;
}


const maxAllowedLimit = computed(() => {
  if (!selectedElement.value) return 1;
  // 国家与国籍组件最大限制固定为 3
  if (['country', 'nationality'].includes(selectedElement.value.type)) {
    return 3;
  }
  // 下拉选择与多选框等自定义选项组件，最大上限为创建的选择配置数量
  const len = selectedElement.value.options?.length || 0;
  return len > 0 ? len : 1;
});

const isSelectMultiple = computed({
  get() {
    return Boolean(selectedElement.value?.multiple);
  },
  set(val: boolean) {
    if (selectedElement.value) {
      selectedElement.value.multiple = val;
      if (val) {
        // 开启多选后，最大允许选择数默认是 1 个，上限为配置选项数（国家/国籍为3）
        const limit = maxAllowedLimit.value;
        const current = Number(selectedElement.value.maxSelections);
        if (!current || current < 1) {
          selectedElement.value.maxSelections = 1;
        } else if (current > limit) {
          selectedElement.value.maxSelections = limit;
        }
      }
      markDirty();
    }
  }
});

watch(
  () => selectedElement.value?.options?.length,
  (newLen) => {
    if (selectedElement.value && newLen && selectedElement.value.maxSelections) {
      if (!['country', 'nationality'].includes(selectedElement.value.type)) {
        if (selectedElement.value.maxSelections > newLen) {
          selectedElement.value.maxSelections = newLen;
          markDirty();
        }
      }
    }
  }
);

const textareaMinRows = computed<number>({
  get() {
    return selectedElement.value?.minRows || 3;
  },
  set(val: number) {
    if (selectedElement.value) {
      const num = Number(val) || 1;
      selectedElement.value.minRows = num;
      if (selectedElement.value.maxRows && selectedElement.value.maxRows < num) {
        selectedElement.value.maxRows = num;
      }
      markDirty();
    }
  }
});

const textareaMaxRows = computed<number>({
  get() {
    return selectedElement.value?.maxRows || 6;
  },
  set(val: number) {
    if (selectedElement.value) {
      const min = selectedElement.value.minRows || 1;
      const num = Number(val) || min;
      selectedElement.value.maxRows = Math.max(num, min);
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
  return ['select', 'radio', 'checkbox', 'signature'].includes(
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

const currentMaxSelections = computed<number | undefined>({
  get() {
    const val = selectedElement.value?.maxSelections;
    if (val === undefined || val === null || Number(val) < 1) {
      return undefined;
    }
    return Number(val);
  },
  set(val: number | undefined) {
    if (selectedElement.value) {
      if (val === undefined || val === null || Number(val) < 1) {
        delete selectedElement.value.maxSelections;
      } else {
        selectedElement.value.maxSelections = Number(val);
      }
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

function setPageFocus(field: 'title' | 'description') {
  if (selectedPage.value) {
    store.focusedTarget = {
      elementId: selectedPage.value.id,
      field
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
    // 如果当前正在画布区域编辑输入（contenteditable、输入框等），绝不强行抢夺光标焦点到右侧
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

function setDateMode(mode: 'single' | 'range') {
  if (!selectedElement.value) return;
  selectedElement.value.dateMode = mode;
  if (mode === 'range') {
    selectedElement.value.enableLongTerm = false;
    selectedElement.value.defaultLongTerm = false;
  }
  markDirty();
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

const dependencyInfo = computed(() => {
  if (!selectedElement.value?.dependsOn) return null;
  const dep = selectedElement.value.dependsOn;
  const yesLabel = t('canvas.yes');
  for (const page of store.pages) {
    const parentField = page.fields?.find(f => f.key === dep.fieldKey);
    if (parentField) {
      const parentLabel = getFieldText(parentField, 'label', undefined, true) || parentField.label || parentField.key;
      const opt = parentField.options?.find(o => o.value === dep.value);
      const optLabel = opt ? (getOptionLabel(opt, undefined, true) || opt.label || opt.value) : (dep.value === 'yes' ? yesLabel : dep.value);
      return {
        parentField,
        page,
        parentLabel,
        optLabel,
        rawDep: dep
      };
    }
  }
  const fallbackOpt = dep.value === 'yes' ? yesLabel : dep.value;
  return {
    parentField: null,
    page: null,
    parentLabel: dep.fieldKey,
    optLabel: fallbackOpt,
    rawDep: dep
  };
});

function locateParentField() {
  if (!dependencyInfo.value?.parentField) return;
  const field = dependencyInfo.value.parentField;
  selectElement(field);
  nextTick(() => {
    const el = document.querySelector(`[data-element-id="${field.id}"]`) || document.getElementById(`el_${field.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
    highlightPropertyField('label');
  });
}

function onToggleDependency(val: any) {
  if (!selectedElement.value) return;
  if (!val) {
    delete selectedElement.value.dependsOn;
  }
  markDirty();
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
