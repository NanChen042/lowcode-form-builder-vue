<template>
  <div class="space-y-3.5">
    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
      <div>
        <span class="text-[12px] font-semibold text-slate-700">{{ t('prop.basicInfo') }}</span>
        <span class="block text-[11px] text-slate-400">{{ t('prop.basicInfoDesc') }}</span>
      </div>
      <a-tag size="small" class="text-[11px] font-normal">{{ componentLabel }}</a-tag>
    </div>

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
        :auto-size="{ minRows: isRisk ? 3 : 1, maxRows: 5 }"
        allow-clear
        :placeholder="element.type === 'alert' ? t('common.notice') : t('prop.fieldLabelPlaceholder')"
        class="w-full"
        :class="{ 'prop-field-focused': isFieldFocused('label') }"
        @focus="setFocus('label')"
        @blur="clearFocus"
        @input="markDirty"
      />
    </div>

    <template v-if="isRisk">
      <div class="mb-3 pt-1">
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-[12px] font-medium text-slate-700">
            {{ store.currentLocale === 'en' ? 'Weight (1-10)' : '权重 (1-10)' }}
          </label>
        </div>
        <a-input-number
          v-model="questionWeightModel"
          :min="1"
          :max="10"
          :step="1"
          :precision="0"
          mode="button"
          class="w-full"
        />
        <p class="mt-2 text-[11.5px] leading-relaxed text-slate-500 m-0">
          {{
            store.currentLocale === 'en'
              ? 'New questions default to weight 1. Selecting "Yes" indicates a risk hit and deducts the weight from the risk score. Phrase questions so that "Yes" clearly indicates risk.'
              : '新问题默认权重为 1。选择 “Yes” 表示命中风险项，系统将按该问题的权重扣减风险评分。请将问题表述为：回答 “Yes” 时明确代表存在风险。'
          }}
        </p>
      </div>

      <div class="rounded-lg border border-slate-200/90 bg-slate-50/80 p-3 flex items-start gap-2.5">
        <Lock class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div class="text-[11.5px] leading-relaxed text-slate-600">
          {{
            store.currentLocale === 'en'
              ? 'Answer options are fixed as Yes / No / Not Applicable, where Yes is the risk answer and deducts points by the configured weight.'
              : '回答选项固定为 Yes / No / Not Applicable，其中 Yes 为风险回答，并按所设权重扣分。'
          }}
        </div>
      </div>
    </template>

    <div v-if="!isRisk && element.type !== 'alert'" class="mb-3">
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

      <div class="mt-2 flex items-center justify-between py-1 pl-1">
        <div class="flex items-center gap-1.5">
          <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.helpLayout') }}</span>
          <a-tooltip :content="t('prop.helpPositionTip')">
            <HelpCircle class="w-3.5 h-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>

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

    <div v-if="!isRisk && element.type !== 'alert'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
      <div class="flex items-center gap-1.5">
        <span class="text-[12px] font-medium text-slate-600">
          {{ element.type === 'signature' ? t('prop.signatureRequired') : t('prop.required') }}
        </span>
        <a-tooltip :content="element.type === 'signature' ? t('prop.signatureRequiredTip') : t('prop.requiredTip')" position="top">
          <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
        </a-tooltip>
      </div>
      <a-switch v-model="isElementRequired" size="small" />
    </div>

    <CollapseTransition
      v-if="!isRisk && element.type !== 'alert'"
      :key="`${element.id}-req`"
      :show="Boolean(isElementRequired)"
    >
      <div class="pt-1.5 pb-0.5 space-y-1">
        <div class="flex items-center justify-between text-[11.5px]">
          <div class="flex items-center gap-1.5 text-slate-600 font-medium overflow-hidden pr-2">
            <MessageSquare class="w-3.5 h-3.5 text-[#1677ff] shrink-0" />
            <span>{{ element.type === 'signature' ? t('prop.signatureErrorMsg') : t('prop.customErrorMsg') }}</span>
          </div>
          
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

        <div
          v-if="!isCustomErrorExpanded"
          class="text-[11.5px] text-slate-400 truncate select-none mt-0.5"
          :title="rawDefaultErrorMessage"
        >
          <span class="text-slate-400">{{ t('common.defaultColon') }}</span>“{{ rawDefaultErrorMessage }}”
        </div>

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

    <div v-if="element.type === 'signature'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
      <div class="flex items-center gap-1.5">
        <span class="text-[12px] font-medium text-slate-600">{{ t('prop.declarationRequired') }}</span>
        <a-tooltip :content="t('prop.declarationRequiredTip')" position="top">
          <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
        </a-tooltip>
      </div>
      <a-switch v-model="isDeclarationRequired" size="small" />
    </div>

    <CollapseTransition
      v-if="element.type === 'signature'"
      :key="`${element.id}-decl`"
      :show="Boolean(isDeclarationRequired)"
    >
      <div class="pt-1.5 pb-0.5 space-y-1">
        <div class="flex items-center justify-between text-[11.5px]">
          <div class="flex items-center gap-1.5 text-slate-600 font-medium overflow-hidden pr-2">
            <MessageSquare class="w-3.5 h-3.5 text-[#1677ff] shrink-0" />
            <span>{{ t('prop.declarationErrorMsg') }}</span>
          </div>
          
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

        <div
          v-if="!isDeclarationCustomErrorExpanded"
          class="text-[11.5px] text-slate-400 truncate select-none mt-0.5"
          :title="rawDeclarationErrorMessage"
        >
          <span class="text-slate-400">{{ t('common.defaultColon') }}</span>“{{ rawDeclarationErrorMessage }}”
        </div>

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

    <div v-if="['select', 'country', 'nationality'].includes(element.type)" class="flex items-center justify-between py-1.5 border-t border-slate-50">
      <div class="flex items-center gap-1.5">
        <span class="text-[12px] font-medium text-slate-600">{{ t('prop.allowMultiple') }}</span>
        <a-tooltip :content="t('prop.allowMultipleTip')" position="top">
          <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
        </a-tooltip>
      </div>
      <a-switch v-model="isSelectMultiple" size="small" />
    </div>

    <CollapseTransition
      v-if="['select', 'country', 'nationality', 'checkbox'].includes(element.type)"
      :key="`${element.id}-max`"
      :show="Boolean(canHaveMaxSelections)"
    >
      <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.maxSelections') }}</span>
          <a-tooltip
            :content="['country', 'nationality'].includes(element.type)
              ? t('prop.maxSelectionsCountryTip')
              : t('prop.maxSelectionsOptionsTip', undefined, { count: maxAllowedLimit })"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, isRisk, markDirty, isBilingual } from '@/core/store';
import { t, getFieldDefaultErrorMessage, getFieldText, setFieldText } from '@/core/i18n';
import { componentRegistry } from '@/registry/components';
import CollapseTransition from '@/components/common/CollapseTransition.vue';
import { HelpCircle, CornerDownRight, MessageSquare, Pencil, RotateCcw, Lock } from '@lucide/vue';

const props = defineProps<{
  element: FormElement;
}>();

const questionWeightModel = computed<number>({
  get() {
    const w = Number(props.element.weight);
    if (!w || isNaN(w)) return 1;
    return Math.min(10, Math.max(1, Math.round(w)));
  },
  set(val: number) {
    const num = Number(val);
    props.element.weight = !num || isNaN(num) ? 1 : Math.min(10, Math.max(1, Math.round(num)));
    markDirty();
  }
});

const componentLabel = computed(() => {
  const meta = componentRegistry[props.element.type];
  if (!meta) return t('prop.fieldFallback');
  return (store.currentLocale === 'en' ? (meta.label_en || meta.label) : meta.label) || t('prop.fieldFallback');
});

const isShowLabel = computed({
  get() {
    return props.element.showLabel !== false;
  },
  set(val: boolean) {
    props.element.showLabel = val;
    markDirty();
  }
});

const fieldLabelModel = computed({
  get() {
    return getFieldText(props.element, 'label');
  },
  set(val: string) {
    setFieldText(props.element, 'label', val);
  }
});

const isFieldLabelMissing = computed(() => {
  if (!isBilingual.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.element.label && !props.element.label_en);
  }
  return Boolean(props.element.label_en && !props.element.label);
});

const fieldHelpModel = computed({
  get() {
    return getFieldText(props.element, 'help');
  },
  set(val: string) {
    setFieldText(props.element, 'help', val);
  }
});

const isFieldHelpMissing = computed(() => {
  if (!isBilingual.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.element.help && !props.element.help_en);
  }
  return Boolean(props.element.help_en && !props.element.help);
});

const helpPositionValue = computed<'right' | 'bottom'>({
  get() {
    return props.element.helpPosition || 'right';
  },
  set(val: 'right' | 'bottom') {
    props.element.helpPosition = val;
    markDirty();
  }
});

const hasPlaceholder = computed(() => {
  return ['input', 'textarea', 'select', 'date', 'country', 'nationality', 'signature', 'email'].includes(
    props.element.type
  );
});

const placeholderFieldLabel = computed(() => {
  if (props.element.type === 'signature') return t('prop.sigPadLabel');
  if (props.element.type === 'date') return t('prop.datePickerLabel');
  if (props.element.type === 'email') return t('prop.emailPlaceholderLabel');
  return t('prop.placeholder');
});

const placeholderInputDefault = computed(() => {
  if (props.element.type === 'email') {
    return t('prop.emailPlaceholder');
  }
  if (props.element.type === 'signature') {
    return t('common.clickToSign');
  }
  const defaultData = componentRegistry[props.element.type]?.defaultData();
  if (defaultData) {
    const defaultPlaceholder = store.currentLocale === 'en' ? defaultData.placeholder_en : defaultData.placeholder;
    if (defaultPlaceholder) return defaultPlaceholder;
  }
  return placeholderFieldLabel.value;
});

const fieldPlaceholderModel = computed({
  get() {
    return getFieldText(props.element, 'placeholder');
  },
  set(val: string) {
    setFieldText(props.element, 'placeholder', val);
  }
});

const isFieldPlaceholderMissing = computed(() => {
  if (!isBilingual.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.element.placeholder && !props.element.placeholder_en);
  }
  return Boolean(props.element.placeholder_en && !props.element.placeholder);
});

const isElementRequired = computed({
  get() {
    return Boolean(props.element.required);
  },
  set(val: boolean) {
    props.element.required = val;
    markDirty();
  }
});

const isDeclarationRequired = computed({
  get() {
    return props.element.declarationRequired !== false;
  },
  set(val: boolean) {
    props.element.declarationRequired = val;
    markDirty();
  }
});

const isCustomErrorExpanded = ref(false);
const isDeclarationCustomErrorExpanded = ref(false);

watch(
  () => [props.element.id, store.currentLocale],
  () => {
    const hasCustomErr = store.currentLocale === 'en'
      ? (typeof props.element.customErrorMessage_en === 'string' && props.element.customErrorMessage_en.trim().length > 0)
      : (typeof props.element.customErrorMessage === 'string' && props.element.customErrorMessage.trim().length > 0);
    isCustomErrorExpanded.value = hasCustomErr;

    const hasDeclErr = store.currentLocale === 'en'
      ? (typeof props.element.declarationErrorMessage_en === 'string' && props.element.declarationErrorMessage_en.trim().length > 0)
      : (typeof props.element.declarationErrorMessage === 'string' && props.element.declarationErrorMessage.trim().length > 0);
    isDeclarationCustomErrorExpanded.value = hasDeclErr;
  },
  { immediate: true }
);

const rawDefaultErrorMessage = computed(() => {
  return getFieldDefaultErrorMessage(
    props.element,
    props.element.type === 'signature' ? 'signature' : undefined,
    store.currentLocale as 'zh' | 'en'
  );
});

const rawDeclarationErrorMessage = computed(() => {
  return getFieldDefaultErrorMessage(
    props.element,
    'declaration',
    store.currentLocale as 'zh' | 'en'
  );
});

const fieldCustomErrorModel = computed({
  get() {
    return getFieldText(props.element, 'customErrorMessage');
  },
  set(val: string) {
    setFieldText(props.element, 'customErrorMessage', val);
  }
});

const fieldDeclarationErrorModel = computed({
  get() {
    return getFieldText(props.element, 'declarationErrorMessage');
  },
  set(val: string) {
    setFieldText(props.element, 'declarationErrorMessage', val);
  }
});

function expandCustomError() {
  isCustomErrorExpanded.value = true;
  nextTick(() => {
    document.getElementById('prop-custom-error-input')?.focus();
  });
}

function resetCustomError() {
  props.element.customErrorMessage = '';
  props.element.customErrorMessage_en = '';
  markDirty();
  isCustomErrorExpanded.value = false;
}

function expandDeclarationCustomError() {
  isDeclarationCustomErrorExpanded.value = true;
  nextTick(() => {
    document.getElementById('prop-declaration-error-input')?.focus();
  });
}

function resetDeclarationCustomError() {
  props.element.declarationErrorMessage = '';
  props.element.declarationErrorMessage_en = '';
  markDirty();
  isDeclarationCustomErrorExpanded.value = false;
}

const maxAllowedLimit = computed(() => {
  if (['country', 'nationality'].includes(props.element.type)) {
    return 3;
  }
  const len = props.element.options?.length || 0;
  return len > 0 ? len : 1;
});

const isSelectMultiple = computed({
  get() {
    return Boolean(props.element.multiple);
  },
  set(val: boolean) {
    props.element.multiple = val;
    if (val) {
      const limit = maxAllowedLimit.value;
      const current = Number(props.element.maxSelections);
      if (!current || current < 1) {
        props.element.maxSelections = 1;
      } else if (current > limit) {
        props.element.maxSelections = limit;
      }
    }
    markDirty();
  }
});

watch(
  () => props.element.options?.length,
  (newLen) => {
    if (newLen && props.element.maxSelections) {
      if (!['country', 'nationality'].includes(props.element.type)) {
        if (props.element.maxSelections > newLen) {
          props.element.maxSelections = newLen;
          markDirty();
        }
      }
    }
  }
);

const canHaveMaxSelections = computed(() => {
  if (isRisk.value) return false;
  if (props.element.type === 'checkbox') return true;
  if (['select', 'country', 'nationality'].includes(props.element.type) && props.element.multiple) return true;
  return false;
});

const currentMaxSelections = computed<number | undefined>({
  get() {
    const val = props.element.maxSelections;
    if (val === undefined || val === null || Number(val) < 1) {
      return undefined;
    }
    return Number(val);
  },
  set(val: number | undefined) {
    if (val === undefined || val === null || Number(val) < 1) {
      delete props.element.maxSelections;
    } else {
      props.element.maxSelections = Number(val);
    }
    markDirty();
  }
});

function isFieldFocused(field: 'label' | 'placeholder' | 'help' | 'default') {
  if (!store.focusedTarget) return false;
  return (
    store.focusedTarget.elementId === props.element.id &&
    store.focusedTarget.field === field
  );
}

function setFocus(field: 'label' | 'placeholder' | 'help' | 'default') {
  store.focusedTarget = {
    elementId: props.element.id,
    field
  };
}

function clearFocus() {
  store.focusedTarget = null;
}
</script>
