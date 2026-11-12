<template>
  <div v-if="isRisk" class="group/risk-row w-full">
    <!-- 第一行：序号 + 题干文字 + [Yes / No / Not Applicable 胶囊选项] + [复制/删除按钮] -->
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
      <div class="flex items-start gap-2 flex-1 min-w-[220px]">
        <GripVertical v-if="!isTranslationFrame" class="risk-question-drag-handle mt-[2.5px] h-4 w-4 text-slate-300 hover:text-slate-600 shrink-0 cursor-grab active:cursor-grabbing transition-colors" />
        <span
          class="text-[14px] font-semibold leading-normal shrink-0 select-none"
          :class="[isTranslationFrame ? '' : 'cursor-grab', isGhostElement ? 'text-[#1677ff]' : 'text-slate-700']"
        >{{ isGhostElement ? '+' : `${questionIndex}.` }}</span>
        <div class="flex-1 min-w-0 pr-2">
          <div class="text-[14px] font-semibold text-slate-800 leading-normal">
            <EditableText
              v-model="currentLabel"
              :placeholder="labelPlaceholder"
              :element-id="element.id"
              field="label"
              custom-class="label-text break-words"
            /><span v-if="!isRisk && element.required" class="inline-block w-[10px] ml-1 -mr-[14px] text-[#ff4d4f] font-bold select-none">*</span>
          </div>
          <div
            v-if="showHelpSlot"
            class="mt-0.5 text-[12px] text-slate-400 leading-normal font-normal"
          >
            <EditableText
              v-model="currentHelp"
              :placeholder="helpPlaceholder"
              :element-id="element.id"
              field="help"
              custom-class="field-help text-[12px] text-slate-400 font-normal"
              :allow-empty="!isTranslationFrame || !sourceHelp"
            />
          </div>
        </div>
      </div>

      <!-- 文字右侧：仅保留「Yes · 分值」徽章，复制/删除改为行卡片外侧悬浮胶囊，避免行内占位或宽度变化引起抖动 -->
      <div v-if="!isTranslationFrame" class="shrink-0 flex items-center select-none ml-auto">
        <!-- 轻量紧凑分值徽章（固定等宽对齐；点击浮层快选 1~10 分，不撑高行距、不挤动题干） -->
        <a-popover
          v-model:popup-visible="weightPopoverVisible"
          trigger="click"
          position="br"
          :content-style="{ padding: '10px 12px', borderRadius: '8px' }"
        >
          <button
            type="button"
            class="risk-weight-selector inline-flex items-center justify-center gap-1 min-w-[80px] px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border transition-colors cursor-pointer tabular-nums shrink-0"
            :class="
              isSelected || weightPopoverVisible
                ? 'bg-[#1677ff] text-white border-[#1677ff] shadow-2xs'
                : 'bg-blue-50/90 text-[#1677ff] border-blue-200/80 hover:bg-blue-100/80'
            "
            :title="t('risk.weightSettings')"
            @click.stop="selectElement(element)"
          >
            <span class="text-[10.5px] opacity-80">Yes</span>
            <span class="opacity-60">·</span>
            <span>{{ element.weight ?? 1 }} {{ t('risk.ptsUnit') }}</span>
          </button>

          <template #content>
            <div class="w-[228px] select-none" @click.stop>
              <div class="flex items-center justify-between mb-2 text-[12px]">
                <div class="flex items-center gap-1.5">
                  <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100/90 text-[#1677ff] leading-none">
                    Yes
                  </span>
                  <span class="font-medium text-slate-700 text-[11.5px]">{{ t('risk.yesDeductionWeight') }}</span>
                </div>
                <span class="text-[11px] font-bold text-[#1677ff] tabular-nums">
                  {{ element.weight ?? 1 }} {{ t('risk.ptsUnit') }}
                </span>
              </div>
              <div class="grid grid-cols-5 gap-1.5">
                <button
                  v-for="w in 10"
                  :key="w"
                  type="button"
                  class="h-7 rounded-[5px] text-[12px] font-semibold transition-all cursor-pointer tabular-nums border"
                  :class="
                    (element.weight ?? 1) === w
                      ? 'bg-[#1677ff] text-white border-[#1677ff] shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-[#1677ff] hover:text-[#1677ff] hover:bg-blue-50/50'
                  "
                  @click.stop="handleQuickSelectWeight(w)"
                >
                  {{ w }}
                </button>
              </div>
            </div>
          </template>
        </a-popover>

        <!-- 方案二：行尾紧凑极浅灰常驻操作图标（与左侧拖拽手柄视觉权重一致；无分割线、零占位抖动） -->
        <div v-if="!isGhostElement" class="flex items-center gap-0.5 ml-1.5">
          <button
            type="button"
            class="action-btn flex h-6 w-6 items-center justify-center rounded transition-colors cursor-pointer"
            :class="isSelected ? 'text-slate-500 hover:text-[#1677ff] hover:bg-blue-50' : 'text-slate-300 group-hover/risk-row:text-slate-400 hover:!text-[#1677ff] hover:bg-blue-50'"
            :title="t('prop.copy')"
            @click.stop="duplicateElement(element.id)"
          >
            <Copy class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            class="action-btn flex h-6 w-6 items-center justify-center rounded transition-colors cursor-pointer"
            :class="isSelected ? 'text-slate-500 hover:text-red-500 hover:bg-red-50' : 'text-slate-300 group-hover/risk-row:text-slate-400 hover:!text-red-500 hover:bg-red-50'"
            :title="t('prop.delete')"
            @click.stop="deleteElement(element.id)"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full">
    <ElementLabel :element="element" />
    <div class="choice-group" :class="{ 'choice-stack': element.layout === 'stack' }">
      <div v-for="(opt, idx) in element.options" :key="idx" class="inline-flex items-center gap-1.5 select-none">
        <span
          class="inline-flex items-center cursor-pointer p-0.5 rounded hover:bg-blue-50/70 transition-colors"
          :title="t('options.toggleDefaultRadio')"
          @click.stop="toggleDefaultRadio(opt.value)"
        >
          <a-radio :model-value="element.defaultValue === opt.value" class="pointer-events-none" />
        </span>
        <EditableText
          :model-value="getOptionLabel(opt, frameLocale)"
          :placeholder="(isTranslationFrame && getOptionLabel(opt, primaryLocale)) ? getOptionLabel(opt, primaryLocale) : formatOptionLabel(idx + 1, frameLocale)"
          :element-id="element.id"
          field="option"
          :option-index="idx"
          custom-class="option-text text-sm text-slate-700"
          @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, isRisk, primaryLocale, selectElement, duplicateElement, deleteElement, markDirty } from '@/core/store';
import { t, getFieldText, setFieldText, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import { GripVertical, Copy, Trash2 } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));

const weightPopoverVisible = ref(false);

const isSelected = computed(() => {
  return store.selectedType === 'element' && store.selectedId === props.element.id;
});

const isGhostElement = computed(() => String(props.element.id || '').startsWith('ghost_'));

const questionIndex = computed(() => {
  const page = store.pages[0];
  if (!page) return 1;
  const firstGroupId = page.groups?.[0]?.id;
  const targetGroupId = props.element.groupId || firstGroupId;
  const groupFields = (page.fields || []).filter(f => (f.groupId || firstGroupId) === targetGroupId);
  const idx = groupFields.findIndex(f => f.id === props.element.id);
  return idx !== -1 ? idx + 1 : 1;
});

const sourceLabel = computed(() => getFieldText(props.element, 'label', primaryLocale.value));
const sourceHelp = computed(() => getFieldText(props.element, 'help', primaryLocale.value));

const labelPlaceholder = computed(() => {
  if (isTranslationFrame.value && sourceLabel.value) {
    return sourceLabel.value;
  }
  return t('risk.enterQuestionPlaceholder');
});

const helpPlaceholder = computed(() => {
  if (isTranslationFrame.value && sourceHelp.value) {
    return sourceHelp.value;
  }
  return t('prop.fieldHelpPlaceholder');
});

const showHelpSlot = computed(() => {
  return Boolean(
    getFieldText(props.element, 'help', frameLocale.value) ||
    getFieldText(props.element, 'help', primaryLocale.value)
  );
});

const currentLabel = computed({
  get: () => getFieldText(props.element, 'label', frameLocale.value),
  set: (val: string) => {
    setFieldText(props.element, 'label', val, frameLocale.value);
    markDirty();
  }
});

const currentHelp = computed({
  get: () => getFieldText(props.element, 'help', frameLocale.value),
  set: (val: string) => {
    setFieldText(props.element, 'help', val, frameLocale.value);
    markDirty();
  }
});

function setWeight(val: number) {
  selectElement(props.element);
  const clamped = Math.min(10, Math.max(1, Math.round(val)));
  if (props.element.weight !== clamped) {
    props.element.weight = clamped;
    markDirty();
  }
}

function handleQuickSelectWeight(val: number) {
  setWeight(val);
  weightPopoverVisible.value = false;
}

function toggleDefaultRadio(optValue: string) {
  if (isTranslationFrame.value) {
    selectElement(props.element);
    return;
  }
  if (props.element.defaultValue === optValue) {
    props.element.defaultValue = '';
  } else {
    props.element.defaultValue = optValue;
  }
  markDirty();
}
</script>
