<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div v-if="isTranslationFrame" class="space-y-1.5">
      <div
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

      <!-- 译文对照画板：自动内联展开下拉选项以便直接就地翻译 -->
      <div
        v-if="element.options && element.options.length > 0"
        class="rounded-lg border border-blue-100/90 bg-blue-50/25 p-2 space-y-1"
      >
        <div
          v-for="(opt, idx) in element.options"
          :key="idx"
          class="flex items-center justify-between gap-2 px-2 py-1 rounded bg-white/90 border border-slate-200/70 hover:border-blue-300 transition-colors"
        >
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <span class="text-[10.5px] font-mono text-slate-400 shrink-0 select-none">{{ idx + 1 }}.</span>
            <EditableText
              :model-value="getOptionLabel(opt, frameLocale)"
              :placeholder="getOptionLabel(opt, primaryLocale) || formatOptionLabel(idx + 1, frameLocale)"
              :element-id="element.id"
              field="option"
              :option-index="idx"
              custom-class="option-text text-[12.5px] text-slate-700 flex-1 min-w-0 block"
              @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
            />
          </div>
        </div>
      </div>
    </div>

    <a-select
      v-else
      class="w-full pointer-events-none"
      :placeholder="getFieldText(element, 'placeholder', frameLocale)"
      :multiple="Boolean(element.multiple)"
      :max-tag-count="element.multiple ? (element.maxSelections || 3) : undefined"
      :model-value="element.multiple ? parsedDefaultValue : (element.defaultValue || undefined)"
      allow-clear
    >
      <a-option v-for="(opt, idx) in element.options" :key="idx" :value="opt.value">
        {{ getOptionLabel(opt, frameLocale) }}
      </a-option>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import { parseMultiValue } from '@/utils/helpers';
import { ChevronDown } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));

const currentPlaceholder = computed({
  get() {
    return getFieldText(props.element, 'placeholder', frameLocale.value);
  },
  set(val: string) {
    setFieldText(props.element, 'placeholder', val, frameLocale.value);
  }
});

const placeholderFallback = computed(() => {
  return getFieldText(props.element, 'placeholder', primaryLocale.value) || t('prop.placeholder');
});

const parsedDefaultValue = computed(() => {
  return parseMultiValue(props.element.defaultValue);
});
</script>
