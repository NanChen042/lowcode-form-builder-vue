<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <!-- 1. 可编辑模式（就地编辑占位提示） -->
    <div
      v-if="!isReadOnlyFrame"
      class="w-full h-[32px] px-3 rounded-[4px] border bg-white flex items-center justify-between gap-2 text-[13px] transition-all cursor-text"
      :class="isFocusedPlaceholder ? 'canvas-control-focus border-[#1677ff] shadow-[0_0_0_2px_rgba(22,119,255,0.16)]' : 'border-[#d9d9d9] hover:border-[#4096ff]'"
      @click="placeholderInputRef?.focus()"
    >
      <EditableText
        ref="placeholderInputRef"
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        custom-class="component-placeholder-text flex-1 min-w-0 block text-[13px] text-slate-700 truncate"
      />
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
    </div>

    <!-- 2. 只读参照模式（如多语言翻译对照左侧栏） -->
    <div
      v-else
      class="w-full h-[32px] px-3 rounded-[4px] border border-slate-200 bg-transparent flex items-center justify-between gap-2 text-[13px] select-none text-slate-500"
    >
      <span class="truncate">{{ placeholderText }}</span>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import { ChevronDown } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{
  element: FormElement;
}>();

const placeholderInputRef = ref<InstanceType<typeof EditableText> | null>(null);
const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isReadOnlyFrame = inject<ComputedRef<boolean>>('isReadOnlyFrame', computed(() => false));

const isFocusedPlaceholder = computed(() => {
  return (
    !isReadOnlyFrame.value &&
    store.focusedTarget?.elementId === props.element.id &&
    store.focusedTarget?.field === 'placeholder'
  );
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
  const src = getFieldText(props.element, 'placeholder', primaryLocale.value);
  if (src) return src;
  return props.element.type === 'nationality' ? t('prop.defaultNatPlaceholder') : t('prop.defaultCountryPlaceholder');
});

const placeholderText = computed(() => {
  const custom = getFieldText(props.element, 'placeholder', frameLocale.value);
  if (custom) return custom;
  if (props.element.type === 'nationality') {
    return t('prop.defaultNatPlaceholder');
  }
  return t('prop.defaultCountryPlaceholder');
});
</script>
