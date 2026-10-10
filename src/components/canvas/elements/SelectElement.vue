<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-select
      class="w-full pointer-events-none"
      :placeholder="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Please select' : '请选择选项')"
      :multiple="Boolean(element.multiple)"
      :max-tag-count="element.multiple ? (element.maxSelections || 3) : undefined"
      :model-value="element.multiple ? parsedDefaultValue : (element.defaultValue || undefined)"
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
import { store } from '@/core/store';
import { getFieldText, getOptionLabel } from '@/core/i18n';
import { parseMultiValue } from '@/utils/helpers';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const parsedDefaultValue = computed(() => {
  return parseMultiValue(props.element.defaultValue);
});
</script>
