<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-input
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="getFieldText(element, 'placeholder')"
      :model-value="element.defaultValue || ''"
      readonly
    >
      <template #prefix>
        <Mail class="h-3.5 w-3.5 text-slate-400" />
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store } from '@/core/store';
import { getFieldText } from '@/core/i18n';
import { Mail } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
