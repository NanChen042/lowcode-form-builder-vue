<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div
      v-if="!isReadOnlyFrame"
      class="w-full px-3 py-2 rounded-[4px] border bg-white flex flex-col justify-between text-[13px] transition-all cursor-text"
      :class="isFocusedPlaceholder ? 'canvas-control-focus border-[#1677ff] shadow-[0_0_0_2px_rgba(22,119,255,0.16)]' : 'border-[#d9d9d9] hover:border-[#4096ff]'"
      :style="{ minHeight: `${(element.minRows || 3) * 22 + 16}px` }"
      @click="placeholderInputRef?.focus()"
    >
      <EditableText
        ref="placeholderInputRef"
        v-model="currentPlaceholder"
        :placeholder="placeholderFallback"
        :element-id="element.id"
        field="placeholder"
        multiline
        custom-class="component-placeholder-text w-full block text-[13px] text-slate-700 leading-relaxed"
      />
      <div class="text-right text-[11px] text-slate-400 select-none mt-1">
        0/{{ element.maxLength ?? 800 }}
      </div>
    </div>
    <div
      v-else
      class="w-full px-3 py-2 rounded-[4px] border border-slate-200 bg-transparent flex flex-col justify-between text-[13px] select-none text-slate-500"
      :style="{ minHeight: `${(element.minRows || 3) * 22 + 16}px` }"
    >
      <div class="whitespace-pre-wrap leading-relaxed truncate">{{ getFieldText(element, 'placeholder', frameLocale) || placeholderFallback }}</div>
      <div class="text-right text-[11px] text-slate-400 select-none mt-1">
        0/{{ element.maxLength ?? 800 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
import { getFieldText, setFieldText } from '@/core/i18n';
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
  const src = getFieldText(props.element, 'placeholder', primaryLocale.value);
  if (src) return src;
  return store.currentLocale === 'en' ? 'Please enter details' : '请输入详细内容';
});

const isFocusedPlaceholder = computed(() => {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    (store.focusedTarget?.field === 'placeholder' || store.focusedTarget?.field === 'default')
  );
});
</script>
