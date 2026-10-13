<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="w-full flex items-center gap-2.5">
      <div class="flex-1 min-w-0 pointer-events-none">
        <a-range-picker
          v-if="element.dateMode === 'range'"
          style="width: 100%"
          :placeholder="store.currentLocale === 'en' ? ['Start Date', 'End Date'] : ['开始日期', '结束日期']"
          :model-value="element.defaultValue && element.endValue ? [element.defaultValue, element.endValue] : undefined"
          :disabled="Boolean(element.defaultLongTerm)"
        />
        <a-date-picker
          v-else
          style="width: 100%"
          :placeholder="displayPlaceholder"
          :model-value="element.defaultValue || undefined"
          :disabled="Boolean(element.defaultLongTerm)"
        />
      </div>

      <!-- 启用长期选项 (框架自带 Arco Checkbox 组件，现代化排版) -->
      <div v-if="element.enableLongTerm" class="flex-shrink-0 flex items-center">
        <a-checkbox
          :model-value="Boolean(element.defaultLongTerm)"
          class="m-0 select-none"
          @change="onToggleLongTerm"
        >
          <span class="text-[13px] font-medium text-slate-700">
            {{ store.currentLocale === 'en' ? 'Long-term' : '长期' }}
          </span>
        </a-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, markDirty } from '@/core/store';
import { getFieldText } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const displayPlaceholder = computed(() => {
  return getFieldText(props.element, 'placeholder') || (store.currentLocale === 'en' ? 'Select Date' : '请选择日期');
});

function onToggleLongTerm(val: boolean | (string | number | boolean)[]) {
  props.element.defaultLongTerm = Boolean(val);
  markDirty();
}
</script>

