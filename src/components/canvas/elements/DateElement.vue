<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="w-full flex items-center gap-2.5">
      <div
        v-if="isTranslationFrame && element.dateMode !== 'range' && !element.defaultLongTerm"
        class="flex-1 min-w-0 min-h-[32px] px-3 py-1.5 rounded-md border border-slate-200/90 bg-slate-50/60 flex items-center justify-between gap-2 text-[13px] transition-colors hover:border-blue-300"
      >
        <EditableText
          v-model="currentPlaceholder"
          :placeholder="placeholderFallback"
          :element-id="element.id"
          field="placeholder"
          custom-class="flex-1 min-w-0 block text-[13px] text-slate-600"
        />
        <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
      </div>
      <div v-else class="flex-1 min-w-0 pointer-events-none">
        <a-range-picker
          v-if="element.dateMode === 'range'"
          style="width: 100%"
          :placeholder="[t('common.startDate'), t('common.endDate')]"
          :model-value="element.defaultValue && element.endValue ? [element.defaultValue, element.endValue] : undefined"
        />
        <a-input
          v-else-if="element.defaultLongTerm"
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
          style="width: 100%"
          :placeholder="displayPlaceholder"
          :model-value="element.defaultValue || undefined"
        />
      </div>

      <div v-if="element.enableLongTerm && element.dateMode !== 'range'" class="flex-shrink-0 flex items-center">
        <a-checkbox
          :model-value="Boolean(element.defaultLongTerm)"
          :disabled="isTranslationFrame"
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
import { computed, inject, type ComputedRef } from 'vue';
import { Calendar } from '@lucide/vue';
import type { FormElement } from '@/types/schema';
import { markDirty, primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));

const displayPlaceholder = computed(() => {
  return getFieldText(props.element, 'placeholder', frameLocale.value);
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
  return getFieldText(props.element, 'placeholder', primaryLocale.value) || t('prop.datePickerLabel');
});

function onToggleLongTerm(val: boolean | (string | number | boolean)[]) {
  if (isTranslationFrame.value) return;
  props.element.defaultLongTerm = Boolean(val);
  markDirty();
}
</script>

