<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="choice-group" :class="{ 'choice-stack': element.layout === 'stack' }">
      <div v-for="(opt, idx) in element.options" :key="idx" class="inline-flex items-center gap-1.5 select-none">
        <span
          class="inline-flex items-center cursor-pointer p-0.5 rounded hover:bg-blue-50/70 transition-colors"
          :title="store.currentLocale === 'en' ? 'Click to toggle default selection' : '点击切换默认选中项'"
          @click.stop="toggleDefaultRadio(opt.value)"
        >
          <a-radio :model-value="element.defaultValue === opt.value" class="pointer-events-none" />
        </span>
        <EditableText
          :model-value="getOptionLabel(opt)"
          :placeholder="store.currentLocale === 'en' ? `Option ${idx + 1}` : `选项${idx + 1}`"
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
import { store, markDirty } from '@/core/store';
import { getOptionLabel, setOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

function toggleDefaultRadio(optValue: string) {
  if (props.element.defaultValue === optValue) {
    props.element.defaultValue = '';
  } else {
    props.element.defaultValue = optValue;
  }
  markDirty();
}
</script>
