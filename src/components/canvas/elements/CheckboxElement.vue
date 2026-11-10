<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="choice-group" :class="{ 'choice-stack': element.layout === 'stack' }">
      <div v-for="(opt, idx) in element.options" :key="idx" class="inline-flex items-center gap-1.5 select-none">
        <span
          class="inline-flex items-center cursor-pointer p-0.5 rounded hover:bg-blue-50/70 transition-colors"
          :title="t('options.toggleDefaultCheckbox')"
          @click.stop="toggleDefaultCheckbox(opt.value)"
        >
          <a-checkbox :model-value="isChecked(opt.value)" class="pointer-events-none" />
        </span>
        <span v-if="isRisk" class="option-text text-sm text-slate-700">
          {{ getOptionLabel(opt, frameLocale) }}
        </span>
        <EditableText
          v-else
          :model-value="getOptionLabel(opt, frameLocale)"
          :placeholder="(isTranslationFrame && getOptionLabel(opt, primaryLocale)) ? getOptionLabel(opt, primaryLocale) : formatOptionLabel(idx + 1, frameLocale)"
          :element-id="element.id"
          field="option"
          :option-index="idx"
          custom-class="option-text text-sm text-slate-700"
          @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import { isRisk, primaryLocale, selectElement, markDirty } from '@/core/store';
import { t, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));

function isChecked(val: string) {
  const vals = parseMultiValue(props.element.defaultValue);
  return vals.includes(val);
}

function toggleDefaultCheckbox(optValue: string) {
  if (isTranslationFrame.value) {
    selectElement(props.element);
    return;
  }
  if (isRisk.value) {
    props.element.defaultValue = isChecked(optValue) ? '' : optValue;
    markDirty();
    return;
  }
  const current = parseMultiValue(props.element.defaultValue);
  const idx = current.indexOf(optValue);
  if (idx !== -1) {
    current.splice(idx, 1);
  } else {
    const max = props.element.maxSelections || Infinity;
    if (current.length < max) {
      current.push(optValue);
    }
  }
  props.element.defaultValue = stringifyMultiValue(current);
  markDirty();
}
</script>
