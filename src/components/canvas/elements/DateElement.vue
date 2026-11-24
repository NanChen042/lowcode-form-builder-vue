<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="w-full flex items-center gap-2.5">
      <div
        v-if="!isReadOnlyFrame && element.dateMode !== 'range' && !element.defaultLongTerm"
        class="flex-1 min-w-0 h-[32px] px-3 rounded-[4px] border bg-white flex items-center justify-between gap-2 text-[13px] transition-all cursor-text"
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
        <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
      </div>

      <!-- 可编辑模式：起止日期范围输入框 -->
      <div
        v-else-if="!isReadOnlyFrame && element.dateMode === 'range'"
        class="flex-1 min-w-0 h-[32px] px-2.5 rounded-[4px] border border-[#d9d9d9] bg-white flex items-center justify-between gap-1.5 text-[13px] transition-all"
      >
        <EditableText
          :model-value="placeholderDisplayValue(getFieldText(element, 'placeholder', frameLocale))"
          :placeholder="(isTranslationFrame && getFieldText(element, 'placeholder', primaryLocale) && !isDefaultInputPlaceholder('date', getFieldText(element, 'placeholder', primaryLocale))) ? getFieldText(element, 'placeholder', primaryLocale) : t('common.startDate', frameLocale)"
          :element-id="element.id"
          field="placeholder"
          custom-class="component-placeholder-text flex-1 min-w-0 block text-[12px] text-slate-700 truncate"
          @update:model-value="(val) => setFieldText(element, 'placeholder', val, frameLocale)"
        />
        <span class="text-slate-400 text-xs shrink-0 select-none">~</span>
        <EditableText
          :model-value="placeholderDisplayValue(getFieldText(element, 'endPlaceholder', frameLocale))"
          :placeholder="(isTranslationFrame && getFieldText(element, 'endPlaceholder', primaryLocale) && !isDefaultInputPlaceholder('date', getFieldText(element, 'endPlaceholder', primaryLocale))) ? getFieldText(element, 'endPlaceholder', primaryLocale) : t('common.endDate', frameLocale)"
          :element-id="element.id"
          field="endPlaceholder"
          custom-class="component-placeholder-text flex-1 min-w-0 block text-[12px] text-slate-700 truncate"
          @update:model-value="(val) => setFieldText(element, 'endPlaceholder', val, frameLocale)"
        />
        <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
      </div>

      <div v-else class="flex-1 min-w-0 pointer-events-none">
        <a-range-picker
          v-if="element.dateMode === 'range'"
          class="w-full"
          :placeholder="[
            getFieldText(element, 'placeholder', frameLocale) || t('common.startDate', frameLocale),
            getFieldText(element, 'endPlaceholder', frameLocale) || t('common.endDate', frameLocale)
          ]"
          :model-value="element.defaultValue && element.endValue ? [element.defaultValue, element.endValue] : undefined"
        />
        <a-input
          v-else-if="element.defaultLongTerm"
          :model-value="getFieldText(element, 'longTermText', frameLocale) || t('common.longTermValid', frameLocale)"
          disabled
          class="w-full !bg-slate-50 !text-slate-600 font-medium select-none"
        >
          <template #suffix>
            <Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </template>
        </a-input>
        <a-date-picker
          v-else
          class="w-full"
          :placeholder="displayPlaceholder || t('prop.datePlaceholder', frameLocale)"
          :model-value="element.defaultValue || undefined"
        />
      </div>

      <!-- 长期勾选区：复选框按钮与文字彻底独立分离，点击文字仅触发文案编辑/翻译，绝不触碰复选框勾选 -->
      <div v-if="element.enableLongTerm && element.dateMode !== 'range'" class="flex-shrink-0 flex items-center gap-1.5 select-none">
        <a-checkbox
          :model-value="Boolean(element.defaultLongTerm)"
          class="m-0 !p-0 select-none"
          @change="onToggleLongTerm"
        />
        <EditableText
          v-if="!isReadOnlyFrame"
          :model-value="placeholderDisplayValue(getFieldText(element, 'longTermText', frameLocale))"
          :placeholder="longTermFallback"
          :element-id="element.id"
          field="longTermText"
          custom-class="text-[13px] font-medium text-slate-700 inline-block cursor-text hover:text-[#1677ff]"
          @update:model-value="(val) => setFieldText(element, 'longTermText', val, frameLocale)"
        />
        <span
          v-else
          class="text-[13px] font-medium text-slate-700 cursor-default"
        >
          {{ getFieldText(element, 'longTermText', frameLocale) || t('common.longTerm', frameLocale) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type ComputedRef } from 'vue';
import { Calendar } from '@lucide/vue';
import type { FormElement } from '@/types/schema';
import { store, markDirty, primaryLocale } from '@/core/store';
import { t, getFieldText, setFieldText, isDefaultInputPlaceholder, isDefaultLongTermText, placeholderDisplayValue } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const placeholderInputRef = ref<InstanceType<typeof EditableText> | null>(null);
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

const displayPlaceholder = computed(() => {
  return placeholderDisplayValue(getFieldText(props.element, 'placeholder', frameLocale.value));
});

const currentPlaceholder = computed({
  get() {
    return placeholderDisplayValue(getFieldText(props.element, 'placeholder', frameLocale.value));
  },
  set(val: string) {
    setFieldText(props.element, 'placeholder', val, frameLocale.value);
  }
});

const placeholderFallback = computed(() => {
  if (props.element.dateMode === 'range') {
    return t('common.startDate', frameLocale.value);
  }
  const src = getFieldText(props.element, 'placeholder', primaryLocale.value);
  if (isTranslationFrame.value && src && !isDefaultInputPlaceholder('date', src)) {
    return src;
  }
  return t('prop.datePlaceholder', frameLocale.value);
});

const longTermFallback = computed(() => {
  const src = getFieldText(props.element, 'longTermText', primaryLocale.value);
  if (isTranslationFrame.value && src && !isDefaultLongTermText(src)) {
    return src;
  }
  return t('common.longTerm', frameLocale.value);
});

function onToggleLongTerm(val: boolean | (string | number | boolean)[]) {
  if (isTranslationFrame.value) return;
  props.element.defaultLongTerm = Boolean(val);
  markDirty();
}
</script>

