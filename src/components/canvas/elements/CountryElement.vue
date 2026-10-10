<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-select
      class="w-full pointer-events-none"
      :placeholder="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Select Country/Region' : '请选择国家/地区')"
      multiple
      :max-tag-count="element.maxSelections || 3"
      :model-value="parsedDefaultValue"
      allow-clear
    >
      <a-option v-for="(opt, idx) in element.options" :key="idx" :value="opt.value">
        {{ getOptionLabel(opt) }}
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
