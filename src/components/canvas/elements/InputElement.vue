<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-input
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="displayPlaceholder"
      :model-value="element.defaultValue || ''"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store } from '@/core/store';
import { getFieldText } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const displayPlaceholder = computed(() => {
  return getFieldText(props.element, 'placeholder');
});

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
