<template>
  <div v-if="isRisk" class="group/risk-row w-full py-1">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-2.5 flex-1 min-w-0">
        <GripVertical class="h-4 w-4 text-slate-300 shrink-0 mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover/risk-row:opacity-100 hover:!text-slate-500 transition-opacity" />
        <span class="text-[14px] font-semibold text-slate-700 leading-6 shrink-0 select-none">{{ questionIndex }}.</span>
        <div class="flex-1 min-w-0">
          <div class="text-[14px] font-semibold text-slate-800 leading-6 pr-4">
            <EditableText
              v-model="currentLabel"
              :placeholder="labelPlaceholder"
              :element-id="element.id"
              field="label"
              custom-class="label-text inline break-words"
            /><span v-if="!isRisk && element.required" class="inline-block w-[10px] ml-1 -mr-[14px] text-[#ff4d4f] font-bold select-none">*</span>
          </div>
          <div
            v-if="Boolean(getFieldText(element, 'help'))"
            class="mt-1 text-[12.5px] text-slate-400 leading-5 font-normal"
          >
            <EditableText
              v-model="currentHelp"
              :placeholder="t('prop.fieldHelpPlaceholder')"
              :element-id="element.id"
              field="help"
              custom-class="field-help text-[12.5px] text-slate-400 font-normal"
              :allow-empty="true"
            />
          </div>
        </div>
      </div>

      <div class="shrink-0 flex items-center gap-1 select-none">
        <div
          class="flex items-center gap-0.5 transition-opacity duration-150"
          :class="isSelected ? 'opacity-100' : 'opacity-0 group-hover/risk-row:opacity-100'"
        >
          <button
            type="button"
            class="action-btn flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-[#1677ff] hover:bg-blue-50 transition-colors cursor-pointer"
            :title="t('prop.copy')"
            @click.stop="duplicateElement(element.id)"
          >
            <Copy class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            class="action-btn flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            :title="t('prop.delete')"
            @click.stop="deleteElement(element.id)"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <div
      ref="weightBarRef"
      class="risk-weight-selector mt-3 ml-[26px] inline-flex items-center flex-wrap gap-2 select-none cursor-pointer touch-none"
      @mousedown.stop.prevent="startDragWeight"
    >
      <button
        v-for="w in 10"
        :key="w"
        :data-weight-val="w"
        type="button"
        class="w-9 h-8 rounded-[6px] text-[13px] transition-all duration-100 flex items-center justify-center cursor-pointer pointer-events-none"
        :class="
          (element.weight ?? 1) === w
            ? 'bg-[#1677ff] border border-[#1677ff] text-white font-semibold shadow-sm shadow-blue-500/20'
            : 'bg-white border border-slate-200/90 text-slate-700 font-medium hover:border-[#1677ff] hover:text-[#1677ff] hover:bg-blue-50/30 shadow-2xs'
        "
      >
        {{ w }}
      </button>
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
          :model-value="getOptionLabel(opt)"
          :placeholder="formatOptionLabel(idx + 1)"
          :element-id="element.id"
          field="option"
          :option-index="idx"
          custom-class="option-text text-sm text-slate-700"
          @update:model-value="(val) => setOptionLabel(opt, val)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, isRisk, selectElement, duplicateElement, deleteElement, markDirty } from '@/core/store';
import { t, getFieldText, setFieldText, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import { GripVertical, Copy, Trash2 } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const weightBarRef = ref<HTMLElement | null>(null);

const isSelected = computed(() => {
  return store.selectedType === 'element' && store.selectedId === props.element.id;
});

const questionIndex = computed(() => {
  const page = store.pages[0];
  if (!page) return 1;
  const firstGroupId = page.groups?.[0]?.id;
  const targetGroupId = props.element.groupId || firstGroupId;
  const groupFields = (page.fields || []).filter(f => (f.groupId || firstGroupId) === targetGroupId);
  const idx = groupFields.findIndex(f => f.id === props.element.id);
  return idx !== -1 ? idx + 1 : 1;
});

const labelPlaceholder = computed(() => {
  return store.currentLocale === 'en' ? 'Enter risk assessment question...' : '请输入风险评估问题...';
});

const currentLabel = computed({
  get: () => getFieldText(props.element, 'label'),
  set: (val: string) => {
    setFieldText(props.element, 'label', val);
    markDirty();
  }
});

const currentHelp = computed({
  get: () => getFieldText(props.element, 'help'),
  set: (val: string) => {
    setFieldText(props.element, 'help', val);
    markDirty();
  }
});

function updateWeightFromClientX(clientX: number) {
  if (!weightBarRef.value) return;
  const buttons = weightBarRef.value.querySelectorAll<HTMLElement>('[data-weight-val]');
  if (!buttons.length) return;
  let closestWeight = props.element.weight ?? 1;
  let minDistance = Infinity;
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dist = Math.abs(clientX - centerX);
    if (dist < minDistance) {
      minDistance = dist;
      closestWeight = Number(btn.dataset.weightVal) || 1;
    }
  });
  if (props.element.weight !== closestWeight) {
    props.element.weight = closestWeight;
    markDirty();
  }
}

function startDragWeight(e: MouseEvent) {
  selectElement(props.element);
  updateWeightFromClientX(e.clientX);
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';

  const onMouseMove = (moveEvt: MouseEvent) => {
    updateWeightFromClientX(moveEvt.clientX);
  };

  const onMouseUp = () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function toggleDefaultRadio(optValue: string) {
  if (props.element.defaultValue === optValue) {
    props.element.defaultValue = '';
  } else {
    props.element.defaultValue = optValue;
  }
  markDirty();
}
</script>
