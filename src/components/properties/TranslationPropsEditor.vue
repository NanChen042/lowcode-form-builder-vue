<template>
  <div class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 space-y-4 select-none bg-white">
    <!-- 组件文案翻译 -->
    <div v-if="selectedElement" class="space-y-4">
      <!-- 选中的组件信息栏 -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div class="flex items-center gap-2 min-w-0 flex-1 pr-2">
          <span class="w-1 h-3.5 bg-[#1677ff] rounded-xs shrink-0"></span>
          <span class="text-[12px] font-semibold text-slate-800 truncate" :title="componentTitle">
            {{ componentTitle }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a-tag size="small" class="font-mono text-[10.5px]">
            {{ selectedElement.type }}
          </a-tag>
          <button
            type="button"
            class="text-[11px] text-slate-400 hover:text-[#1677ff] cursor-pointer transition-colors"
            :title="t('trans.backToPage')"
            @click="clearSelection"
          >
            {{ t('trans.backToPage') }}
          </button>
        </div>
      </div>

      <!-- 字段标题 -->
      <div v-if="selectedElement.showLabel !== false" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldLabel') }}
            <span v-if="selectedElement.required" class="text-rose-500 ml-0.5">*</span>
          </label>
          <span
            v-if="targetLabel?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceLabel" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourceLabel }}
        </div>

        <a-input
          :model-value="targetLabel"
          :placeholder="t('trans.enterTarget')"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetLabelInput"
        />
      </div>

      <!-- 输入占位符 -->
      <div v-if="supportsPlaceholder" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldPlaceholder') }}
          </label>
          <span
            v-if="targetPlaceholder?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourcePlaceholder" class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePlaceholder" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourcePlaceholder }}
        </div>

        <a-input
          :model-value="targetPlaceholder"
          :placeholder="t('trans.enterTarget')"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetPlaceholderInput"
        />
      </div>

      <!-- 帮助说明 -->
      <div v-if="selectedElement.type !== 'alert'" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldHelp') }}
          </label>
          <span
            v-if="targetHelp?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourceHelp" class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceHelp" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourceHelp }}
        </div>

        <a-textarea
          :model-value="targetHelp"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetHelpInput"
        />
      </div>

      <!-- 提示区块正文 (Alert) -->
      <div v-if="selectedElement.type === 'alert'" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.fieldContent') }}
          </label>
          <span
            v-if="targetContent?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourceContent" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text whitespace-pre-wrap break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourceContent }}
        </div>

        <a-textarea
          :model-value="targetContent"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 3, maxRows: 8 }"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetContentInput"
        />
      </div>

      <!-- 选项列表翻译 (下拉框 / 单选 / 多选) -->
      <div v-if="selectedElement.options && selectedElement.options.length > 0" class="space-y-2 pt-2 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.optionsTitle') }}
          </label>
          <span class="text-[11px] font-mono text-slate-400">
            {{ selectedElement.options.length }} {{ t('common.optionsUnit') }}
          </span>
        </div>

        <div class="border border-slate-200 rounded-[4px] divide-y divide-slate-100 bg-white">
          <div
            v-for="(opt, optIdx) in selectedElement.options"
            :key="optIdx"
            class="p-2.5 space-y-1.5"
          >
            <div class="flex items-center justify-between text-[11.5px]">
              <div class="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                <span class="font-mono text-slate-400 font-semibold">{{ String(optIdx + 1).padStart(2, '0') }}.</span>
                <span class="text-slate-700 truncate" :title="getOptionLabel(opt, primaryLocale)">
                  {{ getOptionLabel(opt, primaryLocale) || `Option ${optIdx + 1}` }}
                </span>
              </div>
              <span
                v-if="getOptionLabel(opt, store.activeTargetLocale)?.trim()"
                class="text-emerald-500 inline-flex items-center shrink-0"
                :title="t('trans.translated')"
              >
                <Check class="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span v-else class="text-[10px] text-amber-500 font-medium shrink-0">
                {{ t('trans.pending') }}
              </span>
            </div>

            <a-input
              :model-value="getOptionLabel(opt, store.activeTargetLocale)"
              :placeholder="t('trans.enterTarget')"
              size="small"
              allow-clear
              class="w-full !rounded-[4px]"
              @input="(val: any) => handleOptionLabelInput(opt, val)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 页面文案翻译 (未选中组件时，显示当前活动页面的标题和描述翻译) -->
    <div v-else-if="activePage" class="space-y-4">
      <!-- 页面顶部标头 -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-1 h-3.5 bg-[#1677ff] rounded-xs shrink-0"></span>
          <span class="text-[12px] font-semibold text-slate-800 truncate">
            {{ t('trans.pageTranslation') }}
          </span>
        </div>
        <a-tag size="small" class="font-mono text-[10.5px]">
          P{{ activePageIndex + 1 }}
        </a-tag>
      </div>

      <!-- 页面标题对照卡片 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.pageTitleLabel') }}
          </label>
          <span
            v-if="targetPageTitle?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePageTitle" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourcePageTitle }}
        </div>

        <a-input
          :model-value="targetPageTitle"
          :placeholder="t('trans.enterTarget')"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetPageTitleInput"
        />
      </div>

      <!-- 页面描述对照卡片 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            {{ t('trans.pageDescLabel') }}
          </label>
          <span
            v-if="targetPageDesc?.trim()"
            class="text-[10.5px] text-emerald-600 font-medium inline-flex items-center gap-0.5"
          >
            <Check class="w-3 h-3 stroke-[2.5]" />
            {{ t('trans.translated') }}
          </span>
          <span v-else-if="sourcePageDesc" class="text-[10.5px] text-amber-500 font-medium">
            {{ t('trans.pending') }}
          </span>
        </div>

        <div v-if="sourcePageDesc" class="rounded-[4px] border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-[12px] text-slate-700 leading-normal select-text break-words">
          <span class="text-[10px] text-slate-400 font-mono block mb-0.5 uppercase tracking-wide">
            {{ primaryLocale.toUpperCase() }} ({{ t('trans.source') }})
          </span>
          {{ sourcePageDesc }}
        </div>

        <a-textarea
          :model-value="targetPageDesc"
          :placeholder="t('trans.enterTarget')"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          size="small"
          allow-clear
          class="w-full !rounded-[4px]"
          @input="handleTargetPageDescInput"
        />
      </div>

      <!-- 提示文案 (紧凑提示) -->
      <div class="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-start gap-1.5">
        <Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span class="leading-normal">{{ t('trans.quickTipDesc') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  store,
  selectedElement,
  primaryLocale,
  clearSelection
} from '@/core/store';
import {
  t,
  getFieldText,
  setFieldText,
  getPageText,
  setPageText,
  getOptionLabel,
  setOptionLabel
} from '@/core/i18n';
import type { FormElementOption } from '@/types/schema';
import { Check, Info } from '@lucide/vue';

const activePageIndex = computed(() => {
  const idx = store.pages.findIndex(p => p.id === store.activePageId && p.pageType !== 'system_profile');
  if (idx >= 0) return idx;
  const first = store.pages.findIndex(p => p.pageType !== 'system_profile');
  return first >= 0 ? first : 0;
});

const activePage = computed(() => store.pages[activePageIndex.value] || null);

const componentTitle = computed(() => {
  if (!selectedElement.value) return '';
  return getFieldText(selectedElement.value, 'label', primaryLocale.value) || selectedElement.value.type;
});

const supportsPlaceholder = computed(() => {
  if (!selectedElement.value) return false;
  return ['input', 'textarea', 'select', 'date', 'country', 'nationality', 'phone', 'email'].includes(selectedElement.value.type);
});

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
</script>
