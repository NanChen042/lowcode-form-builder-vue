<template>
  <div v-if="isRisk" class="group/risk-row w-full">
    <!-- 第一行：序号 + 题干文字 + [Yes / No / Not Applicable 胶囊选项] + [复制/删除按钮] -->
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
      <div class="flex items-center gap-2 flex-1 min-w-[220px]">
        <GripVertical class="risk-question-drag-handle h-4 w-4 text-slate-300 hover:text-slate-600 shrink-0 cursor-grab active:cursor-grabbing transition-colors" />
        <span class="text-[14px] font-semibold text-slate-700 leading-none shrink-0 select-none cursor-grab">{{ questionIndex }}.</span>
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
            v-if="Boolean(getFieldText(element, 'help'))"
            class="mt-0.5 text-[12px] text-slate-400 leading-normal font-normal"
          >
            <EditableText
              v-model="currentHelp"
              :placeholder="t('prop.fieldHelpPlaceholder')"
              :element-id="element.id"
              field="help"
              custom-class="field-help text-[12px] text-slate-400 font-normal"
              :allow-empty="true"
            />
          </div>
        </div>
      </div>

      <!-- 文字右侧：固定 Yes 选中态 + 静态不可选 No / Not Applicable + 复制删除操作按钮 -->
      <div class="shrink-0 flex items-center gap-3 select-none ml-auto">
        <div class="flex items-center gap-1.5">
          <!-- Yes：固定唯一选中的风险项，配白勾与高亮蓝底 -->
          <div
            ref="yesPillRef"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-[6px] text-[12px] font-semibold bg-[#1677ff] border border-[#1677ff] text-white shadow-xs select-none"
          >
            <Check class="h-3 w-3 stroke-[3]" />
            <span>Yes</span>
          </div>

          <!-- No：不可选中的只读合规选项 -->
          <div
            class="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-normal bg-slate-50 border border-slate-200/80 text-slate-400 select-none cursor-default"
          >
            <span>No</span>
          </div>

          <!-- Not Applicable：不可选中的只读不适用选项 -->
          <div
            class="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-normal bg-slate-50 border border-slate-200/80 text-slate-400 select-none cursor-default"
          >
            <span>Not Applicable</span>
          </div>
        </div>

        <div
          class="flex items-center gap-0.5 transition-opacity duration-150 pl-2 border-l border-slate-200/80"
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

    <!-- 第二行：权重分值微面板容器（气泡折角锚定上方 Yes，右对齐） -->
    <div
      class="mt-1 flex justify-end select-none"
      @click.stop="selectElement(element)"
    >
      <div
        ref="sliderCardRef"
        class="risk-weight-slider-section relative w-full max-w-[360px] sm:max-w-[390px] rounded-lg bg-slate-50/90 border border-slate-200/80 px-3 py-1.5 shadow-2xs hover:border-slate-300/80 transition-colors"
      >
        <!-- 气泡尖角：精准对齐上方 [✔ Yes] 按钮 -->
        <div
          class="absolute -top-[5.5px] w-2.5 h-2.5 bg-slate-50 border-t border-l border-slate-200/80 rotate-45 pointer-events-none"
          :style="{ right: `${caretOffsetRight}px` }"
        ></div>

        <div class="flex items-center justify-between mb-1 text-[12px]">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100/90 text-[#1677ff] leading-none">
              Yes
            </span>
            <span class="font-medium text-slate-700 text-[11.5px]">{{ t('risk.yesDeductionWeight') }}</span>
            <a-tooltip :content="t('risk.yesDeductionTip')" position="top">
              <HelpCircle class="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
            </a-tooltip>
          </div>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#1677ff] px-2 py-0.5 text-[10.5px] font-bold text-white shadow-2xs tabular-nums">
            {{ element.weight ?? 1 }} {{ t('risk.ptsUnit') }}
          </span>
        </div>

        <div
          ref="sliderTrackRef"
          class="py-0.5 select-none cursor-pointer touch-none"
          @mousedown.prevent="startSliderDrag"
        >
          <div class="relative flex items-center justify-between">
            <div class="absolute left-[8px] right-[8px] top-[7px] h-[2px] bg-slate-200 rounded-full pointer-events-none"></div>
            <div
              class="absolute left-[8px] top-[7px] h-[2px] bg-[#1677ff] rounded-full pointer-events-none"
              :class="isDraggingSlider ? '' : 'transition-all duration-150'"
              :style="{ width: `calc((100% - 16px) * ${((element.weight ?? 1) - 1) / 9})` }"
            ></div>

            <button
              v-for="w in 10"
              :key="w"
              :data-slider-weight="w"
              type="button"
              class="relative z-10 flex flex-col items-center gap-1 cursor-pointer group focus:outline-none pointer-events-none"
            >
              <div class="h-3.5 w-3.5 flex items-center justify-center">
                <span
                  v-if="(element.weight ?? 1) === w"
                  class="w-3 h-3 rounded-full bg-[#1677ff] ring-3 ring-blue-500/15 flex items-center justify-center shadow-xs transition-transform scale-105"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <span
                  v-else-if="w < (element.weight ?? 1)"
                  class="w-2 h-2 rounded-full bg-[#1677ff] transition-transform group-hover:scale-125"
                ></span>
                <span
                  v-else
                  class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-300 transition-transform group-hover:scale-125"
                ></span>
              </div>
              <span
                class="text-[10.5px] leading-none transition-colors"
                :class="(element.weight ?? 1) === w ? 'text-[#1677ff] font-bold' : 'text-slate-400 font-medium group-hover:text-slate-700'"
              >
                {{ w }}
              </span>
            </button>
          </div>
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
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, isRisk, selectElement, duplicateElement, deleteElement, markDirty } from '@/core/store';
import { t, getFieldText, setFieldText, getOptionLabel, setOptionLabel, formatOptionLabel } from '@/core/i18n';
import { GripVertical, Copy, Trash2, Check, HelpCircle } from '@lucide/vue';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const yesPillRef = ref<HTMLElement | null>(null);
const sliderCardRef = ref<HTMLElement | null>(null);
const caretOffsetRight = ref<number>(265);

function updateCaretPosition() {
  if (!yesPillRef.value || !sliderCardRef.value) return;
  const yesRect = yesPillRef.value.getBoundingClientRect();
  const cardRect = sliderCardRef.value.getBoundingClientRect();
  const yesCenter = yesRect.left + yesRect.width / 2;
  const offset = Math.round(cardRect.right - yesCenter - 5);
  if (offset > 0) {
    caretOffsetRight.value = offset;
  }
}

onMounted(() => {
  if (isRisk.value) {
    nextTick(updateCaretPosition);
    window.addEventListener('resize', updateCaretPosition);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCaretPosition);
});

const sliderTrackRef = ref<HTMLElement | null>(null);
const isDraggingSlider = ref(false);

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
  return t('risk.enterQuestionPlaceholder');
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

function setWeight(val: number) {
  selectElement(props.element);
  const clamped = Math.min(10, Math.max(1, Math.round(val)));
  if (props.element.weight !== clamped) {
    props.element.weight = clamped;
    markDirty();
  }
}

function updateSliderWeightFromClientX(clientX: number) {
  if (!sliderTrackRef.value) return;
  const nodes = sliderTrackRef.value.querySelectorAll<HTMLElement>('[data-slider-weight]');
  if (nodes.length > 0) {
    let closest = props.element.weight ?? 1;
    let minDiff = Infinity;
    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const nodeX = rect.left + rect.width / 2;
      const diff = Math.abs(clientX - nodeX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = Number(node.dataset.sliderWeight) || 1;
      }
    });
    setWeight(closest);
    return;
  }
  const rect = sliderTrackRef.value.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left - 8) / (rect.width - 16)));
  setWeight(Math.round(1 + ratio * 9));
}

function startSliderDrag(e: MouseEvent) {
  selectElement(props.element);
  isDraggingSlider.value = true;
  updateSliderWeightFromClientX(e.clientX);
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';

  const onMouseMove = (moveEvt: MouseEvent) => {
    updateSliderWeightFromClientX(moveEvt.clientX);
  };

  const onMouseUp = () => {
    isDraggingSlider.value = false;
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
