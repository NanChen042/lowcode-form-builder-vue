<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="w-full flex items-center gap-2.5">
      <div class="flex-1 min-w-0 pointer-events-none">
        <a-range-picker
          v-if="element.dateMode === 'range'"
          style="width: 100%"
          :placeholder="[t('common.startDate'), t('common.endDate')]"
          :model-value="element.defaultValue && element.endValue ? [element.defaultValue, element.endValue] : undefined"
        />
        <a-date-picker
          v-else
          style="width: 100%"
          :placeholder="displayPlaceholder"
          :model-value="element.defaultValue || undefined"
          :disabled="Boolean(element.defaultLongTerm)"
        />
      </div>

      <!-- 启用长期选项 (仅单日期模式生效；起止日期不展示长期选项) -->
      <div v-if="element.enableLongTerm && element.dateMode !== 'range'" class="flex-shrink-0 flex items-center">
        <a-checkbox
          :model-value="Boolean(element.defaultLongTerm)"
          class="m-0 select-none"
          @change="onToggleLongTerm"
        >
          <span class="text-[13px] font-medium text-slate-700">
            {{ t('common.longTerm') }}
          </span>
        </a-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { markDirty } from '@/core/store';
import { t, getFieldText } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const displayPlaceholder = computed(() => {
  return getFieldText(props.element, 'placeholder');
});

function onToggleLongTerm(val: boolean | (string | number | boolean)[]) {
  props.element.defaultLongTerm = Boolean(val);
  markDirty();
}
</script>

