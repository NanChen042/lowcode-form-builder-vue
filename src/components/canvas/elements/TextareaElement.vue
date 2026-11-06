<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div
      v-if="isTranslationFrame"
      class="w-full px-3 py-2 rounded-md border border-slate-200/90 bg-slate-50/60 flex flex-col justify-between text-[13px] transition-colors hover:border-blue-300"
      :class="{ 'canvas-control-focus border-[#1677ff] bg-white': isFocusedPlaceholder }"
      :style="{ minHeight: `${(element.minRows || 3) * 22 + 16}px` }"
    >
      <EditableText
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        multiline
        custom-class="w-full block text-[13px] text-slate-600 leading-relaxed"
      />
      <div class="text-right text-[11px] text-slate-400 select-none mt-1">
        0/{{ element.maxLength ?? 800 }}
      </div>
    </div>
    <a-textarea
      v-else
      :key="`${element.id}-${element.minRows || 3}-${element.maxRows || 6}-${element.maxLength ?? 800}`"
      class="w-full pointer-events-none"
      :class="{ 'canvas-control-focus': isFocusedPlaceholder }"
      :placeholder="getFieldText(element, 'placeholder', frameLocale)"
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
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText } from '@/core/i18n';
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

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
