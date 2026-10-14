<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <!-- 多选模式 -->
    <a-select
      v-if="element.multiple"
      class="w-full pointer-events-none"
      :placeholder="placeholderText"
      multiple
      :max-tag-count="element.maxSelections || 3"
      :model-value="parsedDefaultValue"
      allow-clear
    >
      <template #label="{ data }">
        <span class="inline-flex items-center gap-1.5">
          <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
          <span>{{ data.label }}</span>
        </span>
      </template>
      <a-option
        v-for="(opt, idx) in resolvedOptions"
        :key="idx"
        :value="opt.value"
        :label="getOptionLabel(opt)"
      >
        <div class="flex items-center gap-2 w-full text-xs font-sans">
          <span class="iti__flag shrink-0" :class="'iti__' + (opt.value ? String(opt.value).toLowerCase() : 'sg')"></span>
          <span class="font-medium text-slate-800">{{ getOptionLabel(opt) }}</span>
        </div>
      </a-option>
    </a-select>

    <!-- 单选模式 -->
    <a-select
      v-else
      class="w-full pointer-events-none"
      :placeholder="placeholderText"
      :model-value="element.defaultValue || undefined"
      allow-clear
    >
      <template #label="{ data }">
        <span class="inline-flex items-center gap-1.5">
          <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
          <span>{{ data.label }}</span>
        </span>
      </template>
      <a-option
        v-for="(opt, idx) in resolvedOptions"
        :key="idx"
        :value="opt.value"
        :label="getOptionLabel(opt)"
      >
        <div class="flex items-center gap-2 w-full text-xs font-sans">
          <span class="iti__flag shrink-0" :class="'iti__' + (opt.value ? String(opt.value).toLowerCase() : 'sg')"></span>
          <span class="font-medium text-slate-800">{{ getOptionLabel(opt) }}</span>
        </div>
      </a-option>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { parseMultiValue } from '@/utils/helpers';
import { t, getFieldText, getOptionLabel } from '@/core/i18n';
import { defaultCountryOptions, defaultNationalityOptions } from '@/registry/components';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{
  element: FormElement;
}>();

const resolvedOptions = computed(() => {
  if (props.element.options && props.element.options.length > 0) {
    return props.element.options;
  }
  return props.element.type === 'nationality' ? defaultNationalityOptions : defaultCountryOptions;
});

const placeholderText = computed(() => {
  const custom = getFieldText(props.element, 'placeholder');
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
