<template>
  <div
    v-if="isFieldVisible"
    class="preview-field w-full mb-4.5 transition-all duration-200"
    :data-type="field.type"
    :data-error="Boolean(error)"
    :class="{
      'has-error': Boolean(error),
      'pl-3 border-l-2 border-blue-200/90 rounded-l': fieldDepth === 1,
      'pl-5 border-l-2 border-blue-400 rounded-l': fieldDepth >= 2
    }"
  >
    <template v-if="field.type === 'alert'">
      <div
        class="w-full overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff] mb-4"
      >
        <div v-if="field.showLabel !== false" class="flex items-center gap-2 mb-2.5">
          <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
          <span class="text-[14px] font-bold text-slate-800 leading-5">{{ localizedLabel || t('common.notice') }}</span>
        </div>
        <div v-if="alertSegments.length > 0" class="space-y-2 text-[13px] leading-5 text-slate-700">
          <template v-for="seg in alertSegments" :key="seg.id">
            <div v-if="seg.type === 'spacer'" class="h-1.5"></div>

            <p v-else-if="seg.type === 'bullet'" class="m-0 flex items-start gap-1.5">
              <span
                v-if="seg.listType === 'number' || (!seg.listType && field.listStyle === 'number')"
                class="shrink-0 font-semibold text-[#1677ff] text-[13px] leading-5 tabular-nums select-none"
              >
                {{ seg.orderIndex || 1 }}.
              </span>
              <span
                v-else
                class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1677ff]"
              ></span>
              <span class="flex-1 break-words leading-relaxed" v-html="seg.html || '&nbsp;'"></span>
            </p>

            <p v-else class="m-0 break-words leading-relaxed" v-html="seg.html"></p>
          </template>
        </div>
        <div v-else class="text-[12px] text-slate-400 italic py-1">
          {{ t('prop.alertEmptyContentPlaceholder') }}
        </div>
      </div>
    </template>

    <template v-else-if="field.type === 'radio' && field.weight">
      <div
        class="w-full rounded-lg border px-3.5 py-3 transition-colors"
        :class="error ? 'border-red-300 bg-red-50/15' : 'border-slate-200/80 bg-white hover:border-slate-300'"
      >
        <div class="flex items-center justify-between gap-6">
          <div class="min-w-0 flex-1 text-[13px] font-semibold text-slate-800 leading-5">
            <span v-if="isFieldRequired" class="req-star text-[#ff4d4f] font-bold mr-1 inline select-none">*</span><span class="label-text inline break-words">{{ localizedLabel || t('common.untitledField') }}</span><span
              class="ml-1.5 inline-flex items-center rounded border border-blue-200 bg-blue-50/90 px-1.5 py-0.5 text-[11px] font-semibold text-[#1677ff] leading-none align-middle select-none"
            >{{ store.currentLocale === 'en' ? `Weight ${field.weight}` : `权重 ${field.weight}` }}</span>
          </div>

          <div class="choice-group flex shrink-0 items-center gap-x-5">
            <label
              v-for="(opt, idx) in field.options"
              :key="opt.value || idx"
              class="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-800 group whitespace-nowrap"
              @click="formData[field.key] = opt.value; handleFieldInput();"
            >
              <span
                class="flex items-center justify-center w-4 h-4 rounded-full border transition-all shrink-0"
                :class="formData[field.key] === opt.value
                  ? 'border-[#1677ff] bg-[#1677ff]'
                  : (error ? 'border-red-400 bg-white group-hover:border-red-500' : 'border-slate-300 bg-white group-hover:border-blue-400')"
              >
                <span v-if="formData[field.key] === opt.value" class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
              <span>{{ getLocalizedOptionLabel(opt) }}</span>
            </label>
          </div>
        </div>

        <div
          v-if="error"
          class="mt-1.5 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
        >
          <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="field.showLabel !== false" class="component-label mb-1.5 text-[13px] font-semibold text-slate-800 leading-5">
        <span v-if="isFieldRequired" class="req-star text-[#ff4d4f] font-bold mr-1 inline select-none">*</span><span class="label-text inline break-words">{{ localizedLabel || t('common.untitledField') }}</span><span
          v-if="field.weight"
          class="ml-1.5 inline-flex items-center rounded border border-blue-200 bg-blue-50/90 px-1.5 py-0.5 text-[11px] font-semibold text-[#1677ff] leading-none align-middle select-none"
        >{{ store.currentLocale === 'en' ? `Weight ${field.weight}` : `权重 ${field.weight}` }}</span>
        <span v-if="field.helpPosition !== 'bottom' && localizedHelp" class="field-help text-[11px] text-slate-400 font-normal ml-1.5 inline">{{ localizedHelp }}</span>

        <div v-if="field.helpPosition === 'bottom' && localizedHelp" class="field-help-bottom text-[11px] text-slate-400 font-normal mt-0.5 leading-4">
          {{ localizedHelp }}
        </div>
      </div>

      <a-input-number
        v-if="field.type === 'input' && field.inputType === 'number'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :hide-button="true"
        @change="handleFieldInput"
      />
      <a-input
        v-else-if="field.type === 'input'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        @input="handleFieldInput"
      />

      <a-input
        v-else-if="field.type === 'email'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        @input="handleFieldInput"
      >
        <template #prefix>
          <Mail class="h-3.5 w-3.5 text-slate-400" />
        </template>
      </a-input>

      <IntlTelInput
        v-else-if="field.type === 'phone'"
        v-model="formData[field.key]"
        v-model:dial-code="phoneDialCode"
        v-model:country-code="phoneCountryCode"
        :custom-placeholder="localizedPlaceholder"
        :custom-error-message="localizedCustomErrorMessage"
        :required="isFieldRequired"
        :strict="true"
        :error="Boolean(error)"
        :error-message="error"
        @change="handlePhoneChange"
      />

      <a-textarea
        v-else-if="field.type === 'textarea'"
        :key="`${field.id}-${field.minRows || 3}-${field.maxRows || 6}-${field.maxLength ?? 800}`"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :auto-size="{ minRows: field.minRows || 3, maxRows: field.maxRows || 6 }"
        :max-length="field.maxLength ?? 800"
        :show-word-limit="true"
        @input="handleFieldInput"
      />

      <a-select
        v-else-if="field.type === 'select' && field.multiple"
        v-model="selectedTags"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        multiple
        :limit="field.maxSelections || undefined"
        :max-tag-count="field.maxSelections || 3"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <a-option
          v-for="(opt, idx) in field.options"
          :key="idx"
          :value="opt.value"
        >
          {{ getLocalizedOptionLabel(opt) }}
        </a-option>
      </a-select>

      <a-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <a-option
          v-for="(opt, idx) in field.options"
          :key="idx"
          :value="opt.value"
        >
          {{ getLocalizedOptionLabel(opt) }}
        </a-option>
      </a-select>

      <a-select
        v-else-if="(field.type === 'country' || field.type === 'nationality') && field.multiple"
        v-model="selectedTags"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        multiple
        :limit="field.maxSelections || undefined"
        :max-tag-count="field.maxSelections || 3"
        :options="countrySelectOptions"
        :virtual-list-props="{ height: 240 }"
        :filter-option="filterCountryOption"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <template #label="{ data }">
          <span class="inline-flex items-center gap-1.5">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span>{{ data.label }}</span>
          </span>
        </template>
        <template #option="{ data }">
          <div class="flex items-center gap-2 w-full text-xs font-sans">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span class="font-medium text-slate-800">{{ data.label }}</span>
          </div>
        </template>
      </a-select>

      <a-select
        v-else-if="field.type === 'country' || field.type === 'nationality'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :options="countrySelectOptions"
        :virtual-list-props="{ height: 240 }"
        :filter-option="filterCountryOption"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <template #label="{ data }">
          <span class="inline-flex items-center gap-1.5">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span>{{ data.label }}</span>
          </span>
        </template>
        <template #option="{ data }">
          <div class="flex items-center gap-2 w-full text-xs font-sans">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span class="font-medium text-slate-800">{{ data.label }}</span>
          </div>
        </template>
      </a-select>

      <div
        v-else-if="field.type === 'radio'"
        class="w-full py-0.5"
      >
        <div
          class="choice-group flex flex-wrap"
          :class="field.layout === 'stack' ? 'flex-col gap-2.5' : 'flex-row gap-x-5 gap-y-2.5'"
        >
          <label
            v-for="(opt, idx) in field.options"
            :key="opt.value || idx"
            class="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-800 group"
            @click="formData[field.key] = opt.value; handleFieldInput();"
          >
            <span
              class="flex items-center justify-center w-4 h-4 rounded-full border transition-all shrink-0"
              :class="formData[field.key] === opt.value
                ? 'border-[#1677ff] bg-[#1677ff]'
                : (error ? 'border-red-400 bg-white group-hover:border-red-500' : 'border-slate-300 bg-white group-hover:border-blue-400')"
            >
              <span v-if="formData[field.key] === opt.value" class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>
            <span>{{ getLocalizedOptionLabel(opt) }}</span>
          </label>
        </div>
      </div>

      <div
        v-else-if="field.type === 'checkbox'"
        class="w-full py-0.5"
      >
        <div
          class="choice-group flex flex-wrap"
          :class="field.layout === 'stack' ? 'flex-col gap-2.5' : 'flex-row gap-x-5 gap-y-2.5'"
        >
          <label
            v-for="(opt, idx) in field.options"
            :key="opt.value || idx"
            class="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-800 group"
            @click="toggleCheckbox(opt.value)"
          >
            <span
              class="flex items-center justify-center w-4 h-4 rounded border transition-all shrink-0"
              :class="selectedTags.includes(opt.value)
                ? 'border-[#1677ff] bg-[#1677ff] text-white'
                : (error ? 'border-red-400 bg-white group-hover:border-red-500' : 'border-slate-300 bg-white group-hover:border-blue-400')"
            >
              <svg v-if="selectedTags.includes(opt.value)" class="w-2.5 h-2.5 text-white stroke-[2.5]" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>{{ getLocalizedOptionLabel(opt) }}</span>
          </label>
        </div>
      </div>

      <div v-else-if="field.type === 'date'" class="w-full">
        <div class="flex items-center gap-2.5">
          <div class="flex-1 min-w-0">
            <a-range-picker
              v-if="field.dateMode === 'range'"
              v-model="formData[field.key]"
              style="width: 100%"
              :error="Boolean(error)"
              :placeholder="[t('common.startDate'), t('common.endDate')]"
              @change="handleFieldInput"
            />
            <a-input
              v-else-if="isLongTermChecked"
              :model-value="t('common.longTermValid')"
              disabled
              style="width: 100%"
              class="!bg-slate-50 !text-slate-600 font-medium select-none"
            >
              <template #suffix>
                <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </template>
            </a-input>
            <a-date-picker
              v-else
              v-model="formData[field.key]"
              style="width: 100%"
              :error="Boolean(error)"
              :placeholder="localizedPlaceholder"
              @change="handleFieldInput"
            />
          </div>

          <div v-if="field.enableLongTerm && field.dateMode !== 'range'" class="flex-shrink-0 flex items-center">
            <a-checkbox
              v-model="isLongTermChecked"
              class="!m-0 select-none"
              @change="onLongTermChange"
            >
              <span class="text-[13px] font-medium text-slate-700">
                {{ t('common.longTerm') }}
              </span>
            </a-checkbox>
          </div>
        </div>
      </div>

      <div
        v-else-if="field.type === 'signature'"
        class="w-full space-y-3"
      >
        <div v-if="field.options && field.options.length" class="space-y-1.5">
          <div class="space-y-2">
            <label
              v-for="(opt, idx) in field.options"
              :key="opt.value || idx"
              class="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer select-none group"
              @click.prevent="toggleDeclaration(idx)"
            >
              <span
                class="mt-0.5 flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-all"
                :class="isDeclarationChecked(idx)
                  ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                  : (declarationError ? 'border-red-400 bg-white ring-2 ring-red-100' : 'border-slate-300 bg-white group-hover:border-blue-400')"
              >
                <svg v-if="isDeclarationChecked(idx)" class="w-2.5 h-2.5 text-white stroke-[2.5]" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="flex-1 text-[13px] leading-5 text-slate-700 break-words whitespace-normal font-normal">
                {{ getLocalizedOptionLabel(opt) }}
              </span>
            </label>
          </div>

          <transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="declarationError"
              class="mt-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
            >
              <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ declarationError }}</span>
            </div>
          </transition>
        </div>

        <div class="space-y-1.5">
          <div v-if="localizedPlaceholder || field.required" class="mb-1 flex items-center gap-1 text-xs font-medium text-slate-600">
            <span v-if="field.required" class="text-[#ff4d4f] font-bold mr-0.5">*</span>
            <span>{{ localizedPlaceholder || (store.currentLocale === 'en' ? 'Signature Area' : '签名区域') }}</span>
          </div>

          <div
            class="relative h-28 w-full rounded-lg border border-dashed flex items-center justify-center text-xs select-none cursor-pointer transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
            :class="formData[field.key]
              ? 'border-emerald-400 bg-emerald-50/30 text-emerald-700 font-serif'
              : (signatureError
                ? 'border-red-400 bg-red-50/25 ring-2 ring-red-100/80'
                : 'border-slate-300 bg-white hover:border-[#1677ff] hover:bg-blue-50/20')"
            @click="toggleSignature"
          >
            <template v-if="formData[field.key]">
              <span class="text-base italic font-semibold text-slate-800 tracking-wider font-serif">
                {{ t('common.signed') }}
              </span>
              <button
                type="button"
                class="absolute right-2.5 bottom-2.5 w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-slate-50 text-slate-400 hover:text-red-500 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                :title="t('common.clearSignature')"
                @click.stop="clearSignature"
              >
                <Eraser class="w-3.5 h-3.5" />
              </button>
            </template>
            <template v-else>
              <span
                class="flex items-center gap-1.5 text-xs transition-colors"
                :class="signatureError ? 'text-red-500 font-medium' : 'text-slate-400'"
              >
                <PenLine class="w-3.5 h-3.5" :class="signatureError ? 'text-red-500' : 'opacity-60'" />
                <span>{{ t('common.clickToSign') }}</span>
              </span>
            </template>
          </div>

          <transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="signatureError"
              class="mt-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
            >
              <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ signatureError }}</span>
            </div>
          </transition>
        </div>
      </div>

      <transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="error && field.type !== 'phone' && field.type !== 'signature'"
          class="mt-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
        >
          <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FormElement } from '@/types/schema';
import { t, getLocalizedFieldText, getLocalizedOptionLabel } from '@/core/i18n';
import { store } from '@/core/store';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import { Info, Mail, Eraser, PenLine, Calendar } from '@lucide/vue';
import IntlTelInput from '@/components/common/IntlTelInput.vue';
import { defaultCountryOptions, defaultNationalityOptions } from '@/registry/components';
import { parseAlertContent } from '@/utils/alertParser';

const props = defineProps<{
  field: FormElement;
  allFields?: FormElement[];
  formData: Record<string, any>;
  error?: string;
  errors?: Record<string, string>;
}>();

const localizedAlertContent = computed(() => {
  return getLocalizedFieldText(props.field, 'content');
});

const alertSegments = computed(() => {
  return parseAlertContent(localizedAlertContent.value, props.field.listStyle);
});

const resolvedCountryOptions = computed(() => {
  if (props.field.options && props.field.options.length > 0) {
    return props.field.options;
  }
  return props.field.type === 'nationality' ? defaultNationalityOptions : defaultCountryOptions;
});

const countrySelectOptions = computed(() => {
  return resolvedCountryOptions.value.map(opt => {
    const label = getLocalizedOptionLabel(opt);
    return {
      value: opt.value,
      label: label,
      label_en: opt.label_en || opt.value,
      rawOption: opt
    };
  });
});

function filterCountryOption(input: string, option: any): boolean {
  if (!input) return true;
  const q = input.trim().toLowerCase();
  const val = String(option.value || '').toLowerCase();
  const label = String(option.label || '').toLowerCase();
  const labelEn = String(option.label_en || option.rawOption?.label_en || '').toLowerCase();
  return val.includes(q) || label.includes(q) || labelEn.includes(q);
}

const emit = defineEmits<{
  (e: 'clear-error', key: string): void;
}>();

const fieldDepth = computed(() => {
  if (!props.field.dependsOn) return 0;
  let depth = 0;
  let current: FormElement | undefined = props.field;
  const visited = new Set<string>();
  const fields = props.allFields || store.pages.flatMap(p => p.fields || []);
  while (current?.dependsOn?.fieldKey) {
    if (visited.has(current.dependsOn.fieldKey)) break;
    visited.add(current.dependsOn.fieldKey);
    const parent = fields.find(f => f.key === current?.dependsOn?.fieldKey);
    if (!parent) break;
    depth++;
    current = parent;
  }
  return depth;
});

const isFieldVisible = computed<boolean>(() => {
  let cur: FormElement | undefined = props.field;
  const visited = new Set<string>();
  const fields = props.allFields || store.pages.flatMap(p => p.fields || []);

  while (cur?.dependsOn) {
    const parentKey: string = cur.dependsOn.fieldKey;
    const targetVal: any = cur.dependsOn.value;
    if (visited.has(parentKey)) break;
    visited.add(parentKey);

    const parentVal = props.formData[parentKey];
    let matches = false;
    if (parentVal === targetVal) {
      matches = true;
    } else if (Array.isArray(parentVal)) {
      matches = parentVal.includes(targetVal);
    } else if (typeof parentVal === 'string' && parentVal) {
      const list = parseMultiValue(parentVal);
      matches = list.includes(targetVal);
    }

    if (!matches) {
      return false;
    }

    cur = fields.find(f => f.key === parentKey);
  }

  return true;
});

function handleFieldInput() {
  emit('clear-error', props.field.key);
}

const declarationError = computed(() => {
  if (props.field.type !== 'signature') return '';
  return props.errors?.[`${props.field.key}_declaration`] || (
    (props.error && props.field.declarationRequired && !props.formData[`${props.field.key}_declared`])
      ? props.error
      : ''
  );
});

const signatureError = computed(() => {
  if (props.field.type !== 'signature') return '';
  return props.errors?.[`${props.field.key}_signature`] || (
    (props.error && props.field.required && !props.formData[props.field.key])
      ? props.error
      : ''
  );
});

function toggleCheckbox(val: string) {
  const current = [...selectedTags.value];
  const idx = current.indexOf(val);
  if (idx > -1) {
    current.splice(idx, 1);
  } else {
    if (props.field.maxSelections === 1) {
      selectedTags.value = [val];
      handleFieldInput();
      return;
    }
    if (props.field.maxSelections && current.length >= props.field.maxSelections) {
      return;
    }
    current.push(val);
  }
  selectedTags.value = current;
  handleFieldInput();
}

const phoneDialCode = computed({
  get() {
    return props.formData[`${props.field.key}_areacode`] || props.field.dialCode || '+65';
  },
  set(val: string) {
    props.formData[`${props.field.key}_areacode`] = val;
  }
});

const phoneCountryCode = computed({
  get() {
    return props.formData[`${props.field.key}_countryCode`] || props.field.countryCode || 'sg';
  },
  set(val: string) {
    props.formData[`${props.field.key}_countryCode`] = val;
  }
});

function handlePhoneChange(data: any) {
  if (data.areacode) {
    props.formData[`${props.field.key}_areacode`] = `+${data.areacode}`;
  }
  if (data.countryCode) {
    props.formData[`${props.field.key}_countryCode`] = data.countryCode;
  }
  props.formData[`${props.field.key}_full`] = data.fullNumber;
  props.formData[`${props.field.key}_valid`] = data.valid;
  props.formData[`${props.field.key}_msg`] = data.message;
  emit('clear-error', props.field.key);
}

const isLongTermChecked = ref(
  props.field.dateMode !== 'range' && (
    props.formData[props.field.key] === '9999-12-31' ||
    Boolean(props.formData[`${props.field.key}_isLongTerm`]) ||
    Boolean(props.field.defaultLongTerm)
  )
);

watch(
  () => [props.formData[props.field.key], props.formData[`${props.field.key}_isLongTerm`]],
  ([val, isLt]) => {
    isLongTermChecked.value = props.field.dateMode !== 'range' && (val === '9999-12-31' || Boolean(isLt));
  }
);

if (props.field.type === 'date' && props.field.dateMode !== 'range' && props.field.enableLongTerm && props.field.defaultLongTerm && !props.formData[props.field.key]) {
  props.formData[props.field.key] = '9999-12-31';
  props.formData[`${props.field.key}_isLongTerm`] = true;
}

function onLongTermChange(val: boolean | (string | number | boolean)[]) {
  const isChecked = Boolean(val);
  props.formData[`${props.field.key}_isLongTerm`] = isChecked;
  if (isChecked) {
    props.formData[props.field.key] = '9999-12-31';
  } else {
    props.formData[props.field.key] = props.field.defaultValue || '';
  }
  emit('clear-error', props.field.key);
}

function onDeclarationChange() {
  const checks = props.formData[`${props.field.key}_checks`] || {};
  const allChecked = (props.field.options || []).every((_, idx) => Boolean(checks[idx]));
  props.formData[`${props.field.key}_declared`] = allChecked;
  if (allChecked) {
    if (props.errors) {
      delete props.errors[`${props.field.key}_declaration`];
    }
    if (!signatureError.value) {
      emit('clear-error', props.field.key);
    }
  }
}

function isDeclarationChecked(idx: number): boolean {
  return Boolean(props.formData[`${props.field.key}_checks`]?.[idx]);
}

function toggleDeclaration(idx: number) {
  if (!props.formData[`${props.field.key}_checks`]) {
    props.formData[`${props.field.key}_checks`] = {};
  }
  const current = Boolean(props.formData[`${props.field.key}_checks`][idx]);
  props.formData[`${props.field.key}_checks`][idx] = !current;
  onDeclarationChange();
}

function toggleSignature() {
  if (!props.formData[props.field.key]) {
    props.formData[props.field.key] = 'data:image/svg+xml;signed';
  }
  if (props.errors) {
    delete props.errors[`${props.field.key}_signature`];
  }
  if (!declarationError.value) {
    emit('clear-error', props.field.key);
  }
}

function clearSignature() {
  props.formData[props.field.key] = '';
}

const localizedLabel = computed(() => getLocalizedFieldText(props.field, 'label'));
const localizedHelp = computed(() => getLocalizedFieldText(props.field, 'help'));
const localizedCustomErrorMessage = computed(() => getLocalizedFieldText(props.field, 'customErrorMessage'));
const localizedPlaceholder = computed(() => {
  const custom = getLocalizedFieldText(props.field, 'placeholder');
  if (custom) return custom;
  if (props.field.type === 'email') return t('prop.emailPlaceholder');
  if (props.field.type === 'country') return t('prop.defaultCountryPlaceholder');
  if (props.field.type === 'nationality') return t('prop.defaultNatPlaceholder');
  return '';
});

const isFieldRequired = computed(() => {
  if (props.field.type === 'signature') {
    return Boolean(props.field.declarationRequired || props.field.required);
  }
  return Boolean(props.field.required);
});

const selectedTags = computed<string[]>({
  get() {
    return parseMultiValue(props.formData[props.field.key]);
  },
  set(val) {
    props.formData[props.field.key] = stringifyMultiValue(val);
    emit('clear-error', props.field.key);
  }
});
</script>
