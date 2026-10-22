<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-textarea
      :key="`${element.id}-${element.minRows || 3}-${element.maxRows || 6}-${element.maxLength ?? 800}`"
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="getFieldText(element, 'placeholder')"
      :model-value="element.defaultValue || ''"
      :auto-size="{ minRows: element.minRows || 3, maxRows: element.maxRows || 6 }"
      :max-length="element.maxLength ?? 800"
      :show-word-limit="true"
      :style="{ minHeight: `${(element.minRows || 3) * 22 + 16}px` }"
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

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
