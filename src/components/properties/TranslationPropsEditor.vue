<template>
  <div id="prop-editor" class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 space-y-4 select-none bg-white">
    <!-- 组件文案翻译 -->
    <div v-if="selectedElement" class="space-y-4">
      <!-- 选中的组件信息栏 -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div class="min-w-0 flex-1 pr-2">
          <span class="text-[12.5px] font-semibold text-slate-800 truncate block" :title="componentTitle">
            {{ componentTitle }}
          </span>
        </div>
        <a-tag size="small" class="text-[11px] font-normal shrink-0 !rounded-[3px]">
          {{ t(`comp.${selectedElement.type}`) }}
        </a-tag>
      </div>

      <!-- 字段标题 -->
      <div v-if="selectedElement.showLabel !== false" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-label-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldLabel') }}
            <span v-if="selectedElement.required" class="text-rose-500 ml-0.5">*</span>
          </label>
          <span
            v-if="targetLabel?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceLabel" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceLabel }}
          </div>
        </div>

        <a-textarea
          id="prop-label-input"
          :model-value="targetLabel"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: isRisk ? 2 : 1, maxRows: 5 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('label') }"
          @focus="setFocus('label')"
          @blur="clearFocus"
          @update:model-value="handleTargetLabelInput"
        />
      </div>

      <!-- 输入占位符 / 签名提示文案 / 开始日期提示 -->
      <div v-if="supportsPlaceholder" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-placeholder-input" class="text-[12px] font-medium text-slate-700">
            {{ selectedElement.type === 'signature' ? t('trans.sigPromptLabel') : (selectedElement.type === 'date' && selectedElement.dateMode === 'range' ? t('trans.startDatePlaceholder') : t('trans.fieldPlaceholder')) }}
          </label>
          <span
            v-if="targetPlaceholder?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourcePlaceholder" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePlaceholder" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourcePlaceholder }}
          </div>
        </div>

        <a-textarea
          id="prop-placeholder-input"
          :model-value="targetPlaceholder"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
          @focus="setFocus('placeholder')"
          @blur="clearFocus"
          @update:model-value="handleTargetPlaceholderInput"
        />
      </div>

      <!-- 起止日期：截止日期提示文案 -->
      <div v-if="selectedElement.type === 'date' && selectedElement.dateMode === 'range'" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-end-placeholder-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.endDatePlaceholder') }}
          </label>
          <span
            v-if="targetEndPlaceholder?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceEndPlaceholder" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceEndPlaceholder" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceEndPlaceholder }}
          </div>
        </div>

        <a-textarea
          id="prop-end-placeholder-input"
          :model-value="targetEndPlaceholder"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('endPlaceholder') }"
          @focus="setFocus('endPlaceholder')"
          @blur="clearFocus"
          @update:model-value="handleTargetEndPlaceholderInput"
        />
      </div>

      <!-- 日期组件：长期有效选项文案 -->
      <div v-if="selectedElement.type === 'date' && selectedElement.enableLongTerm" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-longterm-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.longTermOptionLabel') }}
          </label>
          <span
            v-if="targetLongTermText?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceLongTermText" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceLongTermText" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceLongTermText }}
          </div>
        </div>

        <a-textarea
          id="prop-longterm-input"
          :model-value="targetLongTermText"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 3 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('longTermText') }"
          @focus="setFocus('longTermText')"
          @blur="clearFocus"
          @update:model-value="handleTargetLongTermTextInput"
        />
      </div>

      <!-- 签名组件：手写区内提示文案 -->
      <div v-if="selectedElement.type === 'signature'" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-sign-placeholder-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.signWatermarkLabel') }}
          </label>
          <span
            v-if="targetSignPlaceholder?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceSignPlaceholder" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceSignPlaceholder" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceSignPlaceholder }}
          </div>
        </div>

        <a-textarea
          id="prop-sign-placeholder-input"
          :model-value="targetSignPlaceholder"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('signPlaceholder') }"
          @focus="setFocus('signPlaceholder')"
          @blur="clearFocus"
          @update:model-value="handleTargetSignPlaceholderInput"
        />
      </div>

      <!-- 帮助说明 (仅当源语言存在帮助说明或目标语言已填写时展示) -->
      <div v-if="selectedElement.type !== 'alert' && (sourceHelp?.trim() || targetHelp?.trim())" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-help-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldHelp') }}
          </label>
          <span
            v-if="targetHelp?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceHelp" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceHelp" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceHelp }}
          </div>
        </div>

        <a-textarea
          id="prop-help-input"
          :model-value="targetHelp"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('help') }"
          @focus="setFocus('help')"
          @blur="clearFocus"
          @update:model-value="handleTargetHelpInput"
        />
      </div>

      <!-- 自定义校验提示 (仅当存在自定义校验文案时支持多语言翻译) -->
      <div v-if="selectedElement.type !== 'alert' && (sourceCustomError?.trim() || targetCustomError?.trim())" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-custom-error-input" class="text-[12px] font-medium text-slate-700">
            {{ t('prop.customErrorMsg') }}
          </label>
          <span
            v-if="targetCustomError?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceCustomError?.trim()" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceCustomError" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceCustomError }}
          </div>
        </div>

        <a-textarea
          id="prop-custom-error-input"
          :model-value="targetCustomError"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('customErrorMessage') }"
          @focus="setFocus('customErrorMessage')"
          @blur="clearFocus"
          @update:model-value="handleTargetCustomErrorInput"
        />
      </div>

      <!-- 提示区块正文 (Alert) -->
      <div v-if="selectedElement.type === 'alert'" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="prop-alert-content-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldContent') }}
          </label>
          <span
            v-if="targetContent?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceContent" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceContent }}
          </div>
        </div>

        <a-textarea
          id="prop-alert-content-input"
          :model-value="targetContent"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 3, maxRows: 8 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isFieldFocused('content') }"
          @focus="setFocus('content')"
          @blur="clearFocus"
          @update:model-value="handleTargetContentInput"
        />
      </div>

      <!-- 选项列表翻译 (下拉框 / 单选 / 多选 / 签名声明勾选项，风险评估固定选项除外) -->
      <div v-if="!isRisk && selectedElement.options && selectedElement.options.length > 0" class="space-y-2 pt-3 border-t border-slate-100">
        <div class="flex items-center justify-between mb-0.5">
          <label class="text-[12px] font-medium text-slate-700">
            {{ selectedElement.type === 'signature' ? t('trans.declarationOptionsTitle') : t('trans.optionsTitle') }}
          </label>
          <span class="text-[11px] font-mono text-slate-400">
            {{ selectedElement.options.length }} {{ t('common.optionsUnit') }}
          </span>
        </div>

        <div id="options-editor" class="space-y-2">
          <div
            v-for="(opt, optIdx) in selectedElement.options"
            :key="optIdx"
            class="p-2.5 rounded-[4px] border border-slate-200/80 bg-white space-y-1.5 transition-all hover:border-blue-200 hover:shadow-xs"
          >
            <div class="flex items-center justify-between text-[11.5px]">
              <span class="text-[12px] font-medium text-slate-800 break-words truncate flex-1 min-w-0 pr-2" :title="getOptionLabel(opt, primaryLocale)">
                {{ getOptionLabel(opt, primaryLocale) || `Option ${optIdx + 1}` }}
              </span>
              <span
                v-if="isOptionTranslated(opt, store.activeTargetLocale, primaryLocale)"
                class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1 shrink-0"
              >
                <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
                <span>{{ t('trans.translated') }}</span>
              </span>
              <span v-else class="text-[10.5px] text-[#ff7d00] font-medium shrink-0 inline-flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
                <span>{{ t('trans.pending') }}</span>
              </span>
            </div>

            <a-textarea
              :model-value="isOptionTranslated(opt, store.activeTargetLocale, primaryLocale) ? getOptionLabel(opt, store.activeTargetLocale) : ''"
              :placeholder="getOptionLabel(opt, primaryLocale) || t('trans.enterTarget')"
              :auto-size="{ minRows: 1, maxRows: 5 }"
              allow-clear
              class="w-full"
              :class="{ 'prop-field-focused': isFieldFocused('option', optIdx) }"
              @focus="setFocus('option', optIdx)"
              @blur="clearFocus"
              @update:model-value="(val: any) => handleOptionLabelInput(opt, val)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 风险评估题目分组翻译 -->
    <div v-else-if="selectedGroup" class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div class="min-w-0 flex-1 pr-2">
          <span class="text-[12.5px] font-semibold text-slate-800 truncate block">
            {{ t('trans.groupTranslation') }}
          </span>
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="group-prop-title-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.groupTitleLabel') }}
          </label>
          <span
            v-if="targetGroupTitle?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceGroupTitle" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourceGroupTitle }}
          </div>
        </div>

        <a-textarea
          id="group-prop-title-input"
          :model-value="targetGroupTitle"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isGroupTitleFocused }"
          @focus="setGroupFocus"
          @blur="clearFocus"
          @update:model-value="handleTargetGroupTitleInput"
        />
      </div>
    </div>

    <!-- 页面文案翻译 (未选中组件时，显示当前活动页面的标题和描述翻译) -->
    <div v-else-if="activePage" class="space-y-4">
      <!-- 页面顶部标头 -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div class="min-w-0 flex-1 pr-2">
          <span class="text-[12.5px] font-semibold text-slate-800 truncate block">
            {{ t('trans.pageTranslation') }}
          </span>
        </div>
        <a-tag size="small" class="font-mono text-[10.5px] shrink-0 !rounded-[3px]">
          P{{ activeTranslatablePageIndex + 1 }}
        </a-tag>
      </div>

      <!-- 页面标题对照卡片 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="page-prop-title-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.pageTitleLabel') }}
          </label>
          <span
            v-if="targetPageTitle?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePageTitle" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourcePageTitle }}
          </div>
        </div>

        <a-textarea
          id="page-prop-title-input"
          :model-value="targetPageTitle"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isPageFieldFocused('title') }"
          @focus="setPageFocus('title')"
          @blur="clearFocus"
          @update:model-value="handleTargetPageTitleInput"
        />
      </div>

      <!-- 页面描述对照卡片 (仅当源语言存在页面描述或目标语言已填写时展示) -->
      <div v-if="sourcePageDesc?.trim() || targetPageDesc?.trim()" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label for="page-prop-desc-input" class="text-[12px] font-medium text-slate-700">
            {{ t('trans.pageDescLabel') }}
          </label>
          <span
            v-if="targetPageDesc?.trim()"
            class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourcePageDesc" class="text-[10.5px] text-[#ff7d00] font-medium inline-flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#ff7d00] shrink-0"></span>
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePageDesc" class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text">
          <div class="text-[10px] font-medium text-slate-400 mb-1 select-none">
            {{ getLocaleNativeName(primaryLocale) }}原文
          </div>
          <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
            {{ sourcePageDesc }}
          </div>
        </div>

        <a-textarea
          id="page-prop-desc-input"
          :model-value="targetPageDesc"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allow-clear
          class="w-full"
          :class="{ 'prop-field-focused': isPageFieldFocused('description') }"
          @focus="setPageFocus('description')"
          @blur="clearFocus"
          @update:model-value="handleTargetPageDescInput"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  store,
  isRisk,
  selectedElement,
  selectedGroup,
  primaryLocale
} from '@/core/store';
import {
  t,
  getFieldText,
  setFieldText,
  getPageText,
  setPageText,
  getGroupText,
  setGroupText,
  getOptionLabel,
  setOptionLabel,
  getLocaleNativeName
} from '@/core/i18n';
import { isOptionTranslated } from '@/utils/translationHelper';
import type { FormElementOption } from '@/types/schema';
import { CheckCircle2 } from '@lucide/vue';

const activePageIndex = computed(() => {
  const idx = store.pages.findIndex(p => p.id === store.activePageId && p.pageType !== 'system_profile');
  if (idx >= 0) return idx;
  const first = store.pages.findIndex(p => p.pageType !== 'system_profile');
  return first >= 0 ? first : 0;
});

const activeTranslatablePageIndex = computed(() => {
  const formPages = store.pages.filter(p => p.pageType !== 'system_profile');
  const idx = formPages.findIndex(p => p.id === activePage.value?.id);
  return idx >= 0 ? idx : 0;
});

const activePage = computed(() => store.pages[activePageIndex.value] || null);

const componentTitle = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'label', primaryLocale.value) || selectedElement.value.type;
});

const supportsPlaceholder = computed(() => {
  if (!selectedElement.value) return false;
  const el = selectedElement.value;
  if (el.type === 'date') {
    return !el.defaultLongTerm;
  }
  return ['input', 'textarea', 'select', 'country', 'nationality', 'email', 'signature'].includes(el.type);
});

// 截止日期占位符
const sourceEndPlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'endPlaceholder', primaryLocale.value) || t('common.endDate');
});
const targetEndPlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'endPlaceholder', store.activeTargetLocale);
});
function handleTargetEndPlaceholderInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'endPlaceholder', val, store.activeTargetLocale);
}

// 长期选项文案
const sourceLongTermText = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'longTermText', primaryLocale.value) || t('common.longTerm');
});
const targetLongTermText = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'longTermText', store.activeTargetLocale);
});
function handleTargetLongTermTextInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'longTermText', val, store.activeTargetLocale);
}

// 签名手写区内提示
const sourceSignPlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'signPlaceholder', primaryLocale.value) || t('canvas.signatureArea');
});
const targetSignPlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'signPlaceholder', store.activeTargetLocale);
});
function handleTargetSignPlaceholderInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'signPlaceholder', val, store.activeTargetLocale);
}

// 字段标题
const sourceLabel = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'label', primaryLocale.value);
});
const targetLabel = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'label', store.activeTargetLocale);
});
function handleTargetLabelInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'label', val, store.activeTargetLocale);
}

// 占位符
const sourcePlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'placeholder', primaryLocale.value);
});
const targetPlaceholder = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'placeholder', store.activeTargetLocale);
});
function handleTargetPlaceholderInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'placeholder', val, store.activeTargetLocale);
}

// 帮助说明
const sourceHelp = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'help', primaryLocale.value);
});
const targetHelp = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'help', store.activeTargetLocale);
});
function handleTargetHelpInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'help', val, store.activeTargetLocale);
}

// 自定义校验提示
const sourceCustomError = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'customErrorMessage', primaryLocale.value);
});
const targetCustomError = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'customErrorMessage', store.activeTargetLocale);
});
function handleTargetCustomErrorInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'customErrorMessage', val, store.activeTargetLocale);
}

// 提示框内容
const sourceContent = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'content', primaryLocale.value);
});
const targetContent = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'content', store.activeTargetLocale);
});
function handleTargetContentInput(val: string) {
  if (!selectedElement.value) return;
  setFieldText(selectedElement.value, 'content', val, store.activeTargetLocale);
}

// 选项
function handleOptionLabelInput(option: FormElementOption, val: string) {
  setOptionLabel(option, val, store.activeTargetLocale);
}

// 风险评估分组标题
const sourceGroupTitle = computed(() => {
  if (!selectedGroup.value) return '';
  return getGroupText(selectedGroup.value, 'title', primaryLocale.value);
});
const targetGroupTitle = computed(() => {
  if (!selectedGroup.value) return '';
  return getGroupText(selectedGroup.value, 'title', store.activeTargetLocale);
});
function handleTargetGroupTitleInput(val: string) {
  if (!selectedGroup.value) return;
  setGroupText(selectedGroup.value, 'title', val, store.activeTargetLocale);
}

// 页面标题
const sourcePageTitle = computed(() => {
  if (!activePage.value) return '';
  return getPageText(activePage.value, 'title', primaryLocale.value);
});
const targetPageTitle = computed(() => {
  if (!activePage.value) return '';
  return getPageText(activePage.value, 'title', store.activeTargetLocale);
});
function handleTargetPageTitleInput(val: string) {
  if (!activePage.value) return;
  setPageText(activePage.value, 'title', val, store.activeTargetLocale);
}

// 页面描述
const sourcePageDesc = computed(() => {
  if (!activePage.value) return '';
  return getPageText(activePage.value, 'description', primaryLocale.value);
});
const targetPageDesc = computed(() => {
  if (!activePage.value) return '';
  return getPageText(activePage.value, 'description', store.activeTargetLocale);
});
function handleTargetPageDescInput(val: string) {
  if (!activePage.value) return;
  setPageText(activePage.value, 'description', val, store.activeTargetLocale);
}

function isFieldFocused(
  field:
    | 'label'
    | 'placeholder'
    | 'help'
    | 'content'
    | 'option'
    | 'endPlaceholder'
    | 'longTermText'
    | 'signPlaceholder'
    | 'customErrorMessage'
    | 'declarationErrorMessage',
  optionIndex?: number
) {
  if (!store.focusedTarget || !selectedElement.value) return false;
  if (store.focusedTarget.elementId !== selectedElement.value.id) return false;
  if (store.focusedTarget.field !== field) return false;
  if (optionIndex !== undefined) {
    return store.focusedTarget.optionIndex === optionIndex;
  }
  return true;
}

function setFocus(
  field:
    | 'label'
    | 'placeholder'
    | 'help'
    | 'content'
    | 'option'
    | 'endPlaceholder'
    | 'longTermText'
    | 'signPlaceholder'
    | 'customErrorMessage'
    | 'declarationErrorMessage',
  optionIndex?: number
) {
  if (!selectedElement.value) return;
  store.editingLocale = store.activeTargetLocale;
  store.focusedTarget = {
    elementId: selectedElement.value.id,
    field,
    optionIndex
  };
}

const isGroupTitleFocused = computed(() => {
  if (!store.focusedTarget || !selectedGroup.value) return false;
  return (
    store.focusedTarget.elementId === selectedGroup.value.id &&
    store.focusedTarget.field === 'title'
  );
});

function setGroupFocus() {
  if (!selectedGroup.value) return;
  store.editingLocale = store.activeTargetLocale;
  store.focusedTarget = {
    elementId: selectedGroup.value.id,
    field: 'title'
  };
}

function isPageFieldFocused(field: 'title' | 'description') {
  if (!store.focusedTarget || !activePage.value) return false;
  return (
    store.focusedTarget.elementId === activePage.value.id &&
    store.focusedTarget.field === field
  );
}

function setPageFocus(field: 'title' | 'description') {
  if (!activePage.value) return;
  store.editingLocale = store.activeTargetLocale;
  store.focusedTarget = {
    elementId: activePage.value.id,
    field
  };
}

function clearFocus() {
  store.focusedTarget = null;
}
</script>
