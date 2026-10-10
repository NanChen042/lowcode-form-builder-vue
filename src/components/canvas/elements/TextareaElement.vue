<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <a-textarea
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Please enter detailed description...' : '请输入详细描述...')"
      :model-value="element.defaultValue || ''"
      :auto-size="{ minRows: 3, maxRows: 5 }"
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
