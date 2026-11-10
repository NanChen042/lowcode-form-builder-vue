<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <!-- 1. 可编辑模式（可就地编辑占位提示） -->
    <div v-if="!isReadOnlyFrame">
      <div
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
    </div>

    <!-- 2. 只读参照模式 -->
    <div v-else>
      <div
        class="w-full h-[32px] px-3 rounded-[4px] border border-slate-200 bg-transparent flex items-center justify-between gap-2 text-[13px] select-none text-slate-500"
      >
        <span class="truncate">{{ getFieldText(element, 'placeholder', frameLocale) || placeholderFallback }}</span>
        <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
      </div>
    </div>

    <!-- 4. 翻译对照模式：就地内联展开选项列表供在画布上直观查看与就地编辑翻译 -->
    <div
      v-if="isTranslationFrame && element.options && element.options.length > 0"
      class="mt-1.5 rounded-[4px] border border-slate-200/80 bg-transparent p-1.5 space-y-1"
    >
      <!-- 可编辑目标语言帧 -->
      <template v-if="!isReadOnlyFrame">
        <div
          v-for="(opt, idx) in element.options"
          :key="idx"
          class="flex items-start justify-between gap-2 px-2.5 py-1.5 rounded-[4px] border transition-all cursor-text"
          :class="isOptionFocused(idx) ? 'canvas-control-focus border-[#1677ff] shadow-[0_0_0_2px_rgba(22,119,255,0.12)] bg-white' : 'bg-white border-slate-200/80 hover:border-[#4096ff]'"
          @click="focusOptionInput(idx)"
        >
          <div class="flex items-start gap-1.5 flex-1 min-w-0">
            <EditableText
              :ref="(el) => setOptionInputRef(el, idx)"
              :model-value="getOptionLabel(opt, frameLocale)"
              :placeholder="(isTranslationFrame && getOptionLabel(opt, primaryLocale)) ? getOptionLabel(opt, primaryLocale) : formatOptionLabel(idx + 1, frameLocale)"
              :element-id="element.id"
              field="option"
              :option-index="idx"
              multiline
              custom-class="component-placeholder-text text-[12.5px] leading-[20px] text-slate-700 flex-1 min-w-0 block cursor-text break-words"
              @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
            />
          </div>
        </div>
      </template>

      <!-- 只读参照基准语言帧 -->
      <template v-else>
        <div
          v-for="(opt, idx) in element.options"
          :key="idx"
          class="flex items-start gap-1.5 px-2.5 py-1.5 rounded-[4px] bg-transparent border border-slate-200/80 text-[12.5px] text-slate-500 select-none"
        >
          <span class="flex-1 min-w-0 font-normal leading-[20px] break-words">
            {{ getOptionLabel(opt, frameLocale) || formatOptionLabel(idx + 1, frameLocale) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, primaryLocale } from '@/core/store';
import { getFieldText, setFieldText, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import { ChevronDown } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const placeholderInputRef = ref<InstanceType<typeof EditableText> | null>(null);
const optionInputRefs = ref<Record<number, any>>({});

function setOptionInputRef(el: any, idx: number) {
  if (el) {
    optionInputRefs.value[idx] = el;
  } else {
    delete optionInputRefs.value[idx];
  }
}

function focusOptionInput(idx: number) {
  optionInputRefs.value[idx]?.focus?.();
}

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));
const isReadOnlyFrame = inject<ComputedRef<boolean>>('isReadOnlyFrame', computed(() => false));

const isFocusedPlaceholder = computed(() => {
  return (
    !isReadOnlyFrame.value &&
    store.focusedTarget?.elementId === props.element.id &&
    store.focusedTarget?.field === 'placeholder'
  );
});

function isOptionFocused(idx: number) {
  return (
    !isReadOnlyFrame.value &&
    store.focusedTarget?.elementId === props.element.id &&
    store.focusedTarget?.field === 'option' &&
    store.focusedTarget?.optionIndex === idx
  );
}

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
  return store.currentLocale === 'en' ? 'Please select an option' : '请选择选项';
});
</script>
