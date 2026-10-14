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
        <EditableText
          :model-value="getOptionLabel(opt)"
          :placeholder="formatOptionLabel(idx + 1)"
          :element-id="element.id"
          field="option"
          :option-index="idx"
          custom-class="option-text text-sm text-slate-700"
          @update:model-value="(val) => setOptionLabel(opt, val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormElement } from '@/types/schema';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import { markDirty } from '@/core/store';
import { t, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

function isChecked(val: string) {
  const vals = parseMultiValue(props.element.defaultValue);
  return vals.includes(val);
}

function toggleDefaultCheckbox(optValue: string) {
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
