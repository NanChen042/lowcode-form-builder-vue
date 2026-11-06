<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div
      v-if="isTranslationFrame"
      class="w-full min-h-[32px] px-3 py-1.5 rounded-md border border-slate-200/90 bg-slate-50/60 flex items-center text-[13px] transition-colors hover:border-blue-300"
      :class="{ 'canvas-control-focus border-[#1677ff] bg-white': isFocusedPlaceholder }"
    >
      <EditableText
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        custom-class="w-full block text-[13px] text-slate-600"
      />
    </div>
    <a-input
      v-else
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="displayPlaceholder"
      :model-value="element.defaultValue || ''"
      readonly
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
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
  return getFieldText(props.element, 'placeholder', primaryLocale.value) || t('prop.placeholder');
});

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
