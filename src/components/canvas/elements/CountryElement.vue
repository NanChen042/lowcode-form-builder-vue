<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <!-- 多选模式 -->
    <a-select
      v-if="element.multiple"
      class="w-full pointer-events-none"
      :placeholder="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Select Country/Region' : '请选择国家/地区')"
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
        v-for="(opt, idx) in element.options"
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

    <!-- 单选模式 (标准国家选择框) -->
    <a-select
      v-else
      class="w-full pointer-events-none"
      :placeholder="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Select Country/Region' : '请选择国家/地区')"
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
        v-for="(opt, idx) in element.options"
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
import { store } from '@/core/store';
import { getFieldText, getOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const parsedDefaultValue = computed(() => {
  return parseMultiValue(props.element.defaultValue);
});
</script>
