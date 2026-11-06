<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div
      v-if="isTranslationFrame"
      class="w-full min-h-[32px] px-3 py-1.5 rounded-md border border-slate-200/90 bg-slate-50/60 flex items-center justify-between gap-2 text-[13px] transition-colors hover:border-blue-300"
    >
      <EditableText
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        custom-class="flex-1 min-w-0 block text-[13px] text-slate-600"
      />
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
    </div>

    <a-select
      v-else-if="element.multiple"
      class="w-full pointer-events-none"
      :placeholder="placeholderText"
      multiple
      :max-tag-count="element.maxSelections || 3"
      :model-value="parsedDefaultValue"
      :options="countrySelectOptions"
      :virtual-list-props="{ height: 240 }"
      allow-clear
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
      v-else
      class="w-full pointer-events-none"
      :placeholder="placeholderText"
      :model-value="element.defaultValue || undefined"
      :options="countrySelectOptions"
      :virtual-list-props="{ height: 240 }"
      allow-clear
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
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { primaryLocale } from '@/core/store';
import { parseMultiValue } from '@/utils/helpers';
import { t, getFieldText, setFieldText, getOptionLabel } from '@/core/i18n';
import { defaultCountryOptions, defaultNationalityOptions } from '@/registry/components';
import { ChevronDown } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{
  element: FormElement;
}>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));

const resolvedOptions = computed(() => {
  if (props.element.options && props.element.options.length > 0) {
    return props.element.options;
  }
  return props.element.type === 'nationality' ? defaultNationalityOptions : defaultCountryOptions;
});

const countrySelectOptions = computed(() => {
  return resolvedOptions.value.map(opt => ({
    value: opt.value,
    label: getOptionLabel(opt, frameLocale.value, true),
    label_en: opt.label_en || opt.value
  }));
});

const currentPlaceholder = computed({
  get() {
    return getFieldText(props.element, 'placeholder', frameLocale.value);
  },
  set(val: string) {
    setFieldText(props.element, 'placeholder', val, frameLocale.value);
  }
});

const placeholderFallback = computed(() => {
  const src = getFieldText(props.element, 'placeholder', primaryLocale.value);
  if (src) return src;
  return props.element.type === 'nationality' ? t('prop.defaultNatPlaceholder') : t('prop.defaultCountryPlaceholder');
});

const placeholderText = computed(() => {
  const custom = getFieldText(props.element, 'placeholder', frameLocale.value);
  if (custom) return custom;
  if (props.element.type === 'nationality') {
    return t('prop.defaultNatPlaceholder');
  }
  return t('prop.defaultCountryPlaceholder');
});

const parsedDefaultValue = computed(() => {
  return parseMultiValue(props.element.defaultValue);
});
</script>
