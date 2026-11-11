<template>
  <div class="space-y-3.5">
    <div v-if="!isRisk" class="flex items-center justify-between border-b border-slate-100 pb-2">
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
            {{ isRisk ? t('risk.questionContent') : t('prop.fieldLabel') }}
          </label>
          <a-tag v-if="isFieldLabelMissing" color="orange" size="small" class="text-[10px] scale-90 origin-left">
            {{ t('prop.untranslated') }}
          </a-tag>
        </div>
        <div v-if="!isRisk" class="flex items-center gap-1.5 font-normal select-none">
          <span class="text-[11px] text-slate-400">{{ t('prop.showLabel') }}</span>
          <a-tooltip :content="t('prop.showLabelTip')" position="top">
            <HelpCircle class="w-3.5 h-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
          <a-switch v-model="isShowLabel" size="small" />
        </div>
      </div>
      <a-textarea
        id="prop-label-input"
        v-model="fieldLabelModel"
        :auto-size="{ minRows: isRisk ? 3 : 1, maxRows: 5 }"
        allow-clear
        :placeholder="element.type === 'alert' ? t('common.notice') : (isRisk ? t('risk.enterQuestionPlaceholder') : t('prop.fieldLabelPlaceholder'))"
        class="w-full"
        :class="{ 'prop-field-focused': isFieldFocused('label') }"
        @focus="setFocus('label')"
        @blur="clearFocus"
        @input="markDirty"
      />
      <div v-if="!isRisk && !isShowLabel" class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
        <span>{{ t('prop.hiddenLabelNote') }}</span>
      </div>
    </div>

    <template v-if="isRisk">
      <div class="pt-3 mt-1 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-[12px] font-medium text-slate-700">
              {{ t('risk.weightSettings') }}
            </span>
            <a-tooltip
              :content="t('risk.weightSettingsDesc')"
              position="top"
            >
              <HelpCircle class="w-3.5 h-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
            </a-tooltip>
          </div>

          <!-- 紧凑加减器 -->
          <div class="inline-flex items-center h-7 rounded border border-slate-200 bg-slate-50/60 overflow-hidden select-none">
            <button
              type="button"
              class="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              :disabled="questionWeightModel <= 1"
              @click="questionWeightModel = Math.max(1, questionWeightModel - 1)"
            >
              <Minus class="w-3 h-3 stroke-[2.2]" />
            </button>
            <input
              type="number"
              :value="questionWeightModel"
              min="1"
              max="10"
              class="w-11 h-full bg-white border-x border-slate-200 text-center text-[13px] font-semibold text-slate-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              @change="onWeightInputChange"
            />
            <button
              type="button"
              class="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              :disabled="questionWeightModel >= 10"
              @click="questionWeightModel = Math.min(10, questionWeightModel + 1)"
            >
              <Plus class="w-3 h-3 stroke-[2.2]" />
            </button>
          </div>
        </div>

        <p class="mt-1.5 text-[11px] text-slate-400 leading-normal">
          {{ t('risk.yesDeductionTip') }}
        </p>
      </div>
    </template>

    <div v-if="!isRisk && element.type !== 'alert'" class="mb-3">
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <label for="prop-help-input" class="text-[12px] font-medium text-slate-700">
            {{ t('prop.fieldHelp') }}
          </label>
          <a-tag v-if="isFieldHelpMissing" color="orange" size="small" class="text-[10px] scale-90 origin-left">
            {{ t('prop.untranslated') }}
          </a-tag>
        </div>
        <div class="flex items-center gap-1.5 font-normal select-none">
          <a-switch :model-value="isHelpEnabled" size="small" @change="handleHelpSwitchChange" />
        </div>
      </div>

      <CollapseTransition :show="Boolean(isHelpEnabled)">
        <div>
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

            <div class="inline-flex items-center p-0.5 rounded-[5px] bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 select-none h-6.5">
              <button
                type="button"
                class="flex items-center gap-1 h-5.5 px-2 rounded-[3.5px] transition-all cursor-pointer whitespace-nowrap !text-[11px]"
                :class="helpPositionValue === 'right' ? 'bg-[#1677ff] text-white shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'"
                :title="t('prop.helpPositionRightDesc')"
                @click="helpPositionValue = 'right'"
              >
                <svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
                  <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="helpPositionValue === 'right' ? 0.7 : 0.45" />
                </svg>
                <span class="!text-[11px] leading-none">{{ t('prop.helpPositionRight') }}</span>
              </button>

              <button
                type="button"
                class="flex items-center gap-1 h-5.5 px-2 rounded-[3.5px] transition-all cursor-pointer whitespace-nowrap !text-[11px]"
                :class="helpPositionValue === 'bottom' ? 'bg-[#1677ff] text-white shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'"
                :title="t('prop.helpPositionBottomDesc')"
                @click="helpPositionValue = 'bottom'"
              >
                <svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="3" width="12" height="4" rx="1.2" />
                  <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="helpPositionValue === 'bottom' ? 0.7 : 0.45" />
                </svg>
                <span class="!text-[11px] leading-none">{{ t('prop.helpPositionBottom') }}</span>
              </button>
            </div>
          </div>
        </div>
      </CollapseTransition>
    </div>

    <div v-if="hasPlaceholder" class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[12px] font-medium text-slate-700">{{ placeholderFieldLabel }}</span>
        <a-tag v-if="isFieldPlaceholderMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
          {{ t('prop.untranslated') }}
        </a-tag>
      </div>
      <a-textarea
        id="prop-placeholder-input"
        v-model="fieldPlaceholderModel"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        allow-clear
        :placeholder="placeholderInputDefault"
        class="w-full"
        :class="{ 'prop-field-focused': isFieldFocused('placeholder') }"
        @focus="setFocus('placeholder')"
        @blur="clearFocus"
        @input="markDirty"
      />
    </div>

    <!-- 额外占位符：起止日期的截止日期提示 -->
    <div v-if="hasEndPlaceholder" class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[12px] font-medium text-slate-700">{{ t('prop.endDatePlaceholder') }}</span>
        <a-tag v-if="isFieldEndPlaceholderMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
          {{ t('prop.untranslated') }}
        </a-tag>
      </div>
      <a-textarea
        id="prop-end-placeholder-input"
        v-model="fieldEndPlaceholderModel"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        allow-clear
        :placeholder="t('common.endDate')"
        class="w-full"
        :class="{ 'prop-field-focused': isFieldFocused('endPlaceholder') }"
        @focus="setFocus('endPlaceholder')"
        @blur="clearFocus"
        @input="markDirty"
      />
    </div>

    <!-- 额外占位符：签名板手写区内提示文案 -->
    <div v-if="hasSignWatermark" class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-[12px] font-medium text-slate-700">{{ t('prop.signWatermarkPlaceholder') }}</span>
        <a-tag v-if="isFieldSignPlaceholderMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
          {{ t('prop.untranslated') }}
        </a-tag>
      </div>
      <a-textarea
        id="prop-sign-placeholder-input"
        v-model="fieldSignPlaceholderModel"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        allow-clear
        :placeholder="t('canvas.signatureArea')"
        class="w-full"
        :class="{ 'prop-field-focused': isFieldFocused('signPlaceholder') }"
        @focus="setFocus('signPlaceholder')"
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
      <div class="pt-2 pb-1">
        <ValidationErrorItem
          :label="element.type === 'signature' ? t('prop.signatureErrorMsg') : t('prop.customErrorMsg')"
          v-model="fieldCustomErrorModel"
          :default-text="rawDefaultErrorMessage"
          input-id="prop-custom-error-input"
          :is-focused="isFieldFocused('customErrorMessage')"
          @focus="setFocus('customErrorMessage')"
          @blur="clearFocus"
        />
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
      <div class="pt-2 pb-1">
        <ValidationErrorItem
          :label="t('prop.declarationErrorMsg')"
          v-model="fieldDeclarationErrorModel"
          :default-text="rawDeclarationErrorMessage"
          input-id="prop-declaration-error-input"
          :is-focused="isFieldFocused('declarationErrorMessage')"
          @focus="setFocus('declarationErrorMessage')"
          @blur="clearFocus"
        />
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
import { store, isRisk, markDirty, isBilingual, primaryLocale } from '@/core/store';
import { t, getFieldDefaultErrorMessage, getFieldText, setFieldText, getEffectiveFormLocale } from '@/core/i18n';
import { componentRegistry } from '@/registry/components';
import CollapseTransition from '@/components/common/CollapseTransition.vue';
import ValidationErrorItem from './ValidationErrorItem.vue';
import { HelpCircle, CornerDownRight, Minus, Plus } from '@lucide/vue';

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

function onWeightInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (isNaN(val)) {
    questionWeightModel.value = 1;
    target.value = '1';
  } else {
    const clamped = Math.min(10, Math.max(1, val));
    questionWeightModel.value = clamped;
    target.value = String(clamped);
  }
}


const componentLabel = computed(() => {
  if (isRisk.value) {
    return t('risk.cmpQuestion');
  }
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
  const cur = getFieldText(props.element, 'label');
  const src = getFieldText(props.element, 'label', primaryLocale.value);
  return Boolean(src && !cur);
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
  const cur = getFieldText(props.element, 'help');
  const src = getFieldText(props.element, 'help', primaryLocale.value);
  return Boolean(src && !cur);
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

const isHelpEnabled = ref(false);

watch(
  () => [props.element.id, store.currentLocale, store.editingLocale],
  () => {
    isHelpEnabled.value = Boolean(fieldHelpModel.value && fieldHelpModel.value.trim().length > 0);
  },
  { immediate: true }
);

function handleHelpSwitchChange(val: any) {
  const boolVal = Boolean(val);
  isHelpEnabled.value = boolVal;
  if (!boolVal) {
    fieldHelpModel.value = '';
    markDirty();
  } else {
    nextTick(() => {
      document.getElementById('prop-help-input')?.focus();
    });
  }
}

const hasPlaceholder = computed(() => {
  return ['input', 'textarea', 'select', 'date', 'country', 'nationality', 'signature', 'email'].includes(
    props.element.type
  );
});

const placeholderFieldLabel = computed(() => {
  if (props.element.type === 'signature') return t('prop.sigPadLabel');
  if (props.element.type === 'date') {
    return props.element.dateMode === 'range' ? t('prop.startDatePlaceholder') : t('prop.datePickerLabel');
  }
  if (props.element.type === 'email') return t('prop.emailPlaceholderLabel');
  return t('prop.placeholder');
});

const hasEndPlaceholder = computed(() => {
  return props.element.type === 'date' && props.element.dateMode === 'range';
});

const fieldEndPlaceholderModel = computed({
  get() {
    return getFieldText(props.element, 'endPlaceholder');
  },
  set(val: string) {
    setFieldText(props.element, 'endPlaceholder', val);
  }
});

const isFieldEndPlaceholderMissing = computed(() => {
  if (!isBilingual.value) return false;
  const cur = getFieldText(props.element, 'endPlaceholder');
  const src = getFieldText(props.element, 'endPlaceholder', primaryLocale.value);
  return Boolean(src && !cur);
});

const hasSignWatermark = computed(() => {
  return props.element.type === 'signature';
});

const fieldSignPlaceholderModel = computed({
  get() {
    return getFieldText(props.element, 'signPlaceholder');
  },
  set(val: string) {
    setFieldText(props.element, 'signPlaceholder', val);
  }
});

const isFieldSignPlaceholderMissing = computed(() => {
  if (!isBilingual.value) return false;
  const cur = getFieldText(props.element, 'signPlaceholder');
  const src = getFieldText(props.element, 'signPlaceholder', primaryLocale.value);
  return Boolean(src && !cur);
});

const placeholderInputDefault = computed(() => {
  if (props.element.type === 'date' && props.element.dateMode === 'range') {
    return t('common.startDate');
  }
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
  const cur = getFieldText(props.element, 'placeholder');
  const src = getFieldText(props.element, 'placeholder', primaryLocale.value);
  return Boolean(src && !cur);
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

const rawDefaultErrorMessage = computed(() => {
  return getFieldDefaultErrorMessage(
    props.element,
    props.element.type === 'signature' ? 'signature' : undefined,
    getEffectiveFormLocale()
  );
});

const rawDeclarationErrorMessage = computed(() => {
  return getFieldDefaultErrorMessage(
    props.element,
    'declaration',
    getEffectiveFormLocale()
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

function isFieldFocused(
  field: 'label' | 'placeholder' | 'help' | 'default' | 'endPlaceholder' | 'signPlaceholder' | 'customErrorMessage' | 'declarationErrorMessage'
) {
  if (!store.focusedTarget) return false;
  return (
    store.focusedTarget.elementId === props.element.id &&
    store.focusedTarget.field === field
  );
}

function setFocus(
  field: 'label' | 'placeholder' | 'help' | 'default' | 'endPlaceholder' | 'signPlaceholder' | 'customErrorMessage' | 'declarationErrorMessage'
) {
  store.focusedTarget = {
    elementId: props.element.id,
    field
  };
}

function clearFocus() {
  store.focusedTarget = null;
}
</script>
