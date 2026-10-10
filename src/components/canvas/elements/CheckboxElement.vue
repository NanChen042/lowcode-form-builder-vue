<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="choice-group flex flex-wrap gap-3" :class="{ '!flex-col !gap-2': element.layout === 'stack' }">
      <div v-for="(opt, idx) in element.options" :key="idx" class="inline-flex items-center gap-1.5 select-none">
        <span
          class="inline-flex items-center cursor-pointer p-0.5 rounded hover:bg-blue-50/70 transition-colors"
          :title="store.currentLocale === 'en' ? 'Click to toggle default check' : '点击切换默认勾选'"
          @click.stop="toggleDefaultCheckbox(opt.value)"
        >
          <a-checkbox :model-value="isChecked(opt.value)" class="!pointer-events-none" />
        </span>
        <EditableText
          :model-value="getOptionLabel(opt)"
          :placeholder="store.currentLocale === 'en' ? `Option ${idx + 1}` : `选项${idx + 1}`"
          :element-id="element.id"
          field="option"
          :option-index="idx"
          custom-class="option-text text-sm text-slate-700"
          @update:model-value="(val) => handleOptionUpdate(opt, val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormElement, FormElementOption } from '@/types/schema';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import { store, markDirty } from '@/core/store';
import { getOptionLabel } from '@/core/i18n';
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

function handleOptionUpdate(opt: FormElementOption, val: string) {
  if (store.currentLocale === 'en') {
    opt.label_en = val;
  } else {
    opt.label = val;
  }
  markDirty();
}
</script>
