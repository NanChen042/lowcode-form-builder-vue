<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div
      v-if="!isReadOnlyFrame"
      class="w-full h-[32px] px-3 rounded-[4px] border bg-white flex items-center gap-2 text-[13px] transition-all cursor-text"
      :class="isFocusedPlaceholder ? 'canvas-control-focus border-[#1677ff] shadow-[0_0_0_2px_rgba(22,119,255,0.16)]' : 'border-[#d9d9d9] hover:border-[#4096ff]'"
      @click="placeholderInputRef?.focus()"
    >
      <Mail class="h-3.5 w-3.5 text-slate-400 shrink-0" />
      <EditableText
        ref="placeholderInputRef"
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        custom-class="component-placeholder-text w-full block text-[13px] text-slate-700 truncate"
      />
    </div>
    <div
      v-else
      class="w-full h-[32px] px-3 rounded-[4px] border border-slate-200 bg-transparent flex items-center gap-2 text-[13px] select-none text-slate-500"
    >
      <Mail class="h-3.5 w-3.5 text-slate-400 shrink-0" />
      <span class="truncate">{{ getFieldText(element, 'placeholder', frameLocale) || placeholderFallback }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import { Mail } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const placeholderInputRef = ref<InstanceType<typeof EditableText> | null>(null);
const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isReadOnlyFrame = inject<ComputedRef<boolean>>('isReadOnlyFrame', computed(() => false));

const currentPlaceholder = computed({
  get() {
    return getFieldText(props.element, 'placeholder', frameLocale.value);
  },
  set(val: string) {
    setFieldText(props.element, 'placeholder', val, frameLocale.value);
  }
});

const placeholderFallback = computed(() => {
  return getFieldText(props.element, 'placeholder', primaryLocale.value) || t('prop.emailPlaceholder');
});

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
