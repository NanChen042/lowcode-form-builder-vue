<template>
  <div id="options-editor" class="options-editor space-y-1.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
    <!-- 提示与声明条款模式 (多行文本域) -->
    <template v-if="isDisplayOnly">
      <div
        v-for="(option, idx) in options"
        :key="idx"
        class="notice-row group flex items-start gap-2 py-1 transition-all"
      >
        <!-- 序号徽标 -->
        <div class="mt-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium shrink-0 select-none">
          {{ idx + 1 }}
        </div>

        <!-- 英文模式 -->
        <div v-if="store.currentLocale === 'en'" class="flex-1 relative">
          <a-textarea
            v-model="option.label_en"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            size="small"
            :placeholder="t('options.noticePlaceholder')"
            class="w-full !rounded-md"
            :class="{ 'prop-field-focused': isOptionFocused(idx) }"
            @focus="onFocus(idx)"
            @blur="onBlur"
            @input="onInput(idx, $event)"
          />
          <span
            v-if="option.label && !option.label_en"
            class="absolute right-2 bottom-2 text-[10px] text-amber-600 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
            :title="`中文: ${option.label}`"
          >
            {{ t('prop.missingEnTag') }}
          </span>
        </div>
        <!-- 中文模式 -->
        <div v-else class="flex-1 relative">
          <a-textarea
            v-model="option.label"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            size="small"
            :placeholder="t('options.noticePlaceholder')"
            class="w-full !rounded-md"
            :class="{ 'prop-field-focused': isOptionFocused(idx) }"
            @focus="onFocus(idx)"
            @blur="onBlur"
            @input="onInput(idx, $event)"
          />
          <span
            v-if="option.label_en && !option.label"
            class="absolute right-2 bottom-2 text-[10px] text-amber-600 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
            :title="`EN: ${option.label_en}`"
          >
            {{ t('prop.missingZhTag') }}
          </span>
        </div>

        <!-- 删除按钮 -->
        <button
          type="button"
          class="mt-1 option-del-btn flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50/80 active:bg-red-100 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all shrink-0"
          :disabled="options.length <= 1"
          :title="t('options.deleteOption')"
          @click="removeOption(idx)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </button>
      </div>
    </template>

    <!-- 常规选项模式 (单行输入) -->
    <template v-else>
      <div ref="sortableListRef" class="space-y-1.5">
        <div
          v-for="(option, idx) in options"
          :key="option.value ? ((props.element?.id || '') + '_' + option.value) : ((props.element?.id || '') + '_' + idx)"
          class="option-row group flex items-center gap-1.5 py-0.5 transition-all"
        >
          <!-- 拖拽/排序手柄图标 -->
          <div
            class="drag-handle flex items-center justify-center w-5 h-7 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing transition-colors select-none shrink-0"
            :title="t('options.dragToReorderIndexed', undefined, { index: idx + 1 })"
          >
            <GripVertical class="h-3.5 w-3.5" />
          </div>

          <!-- 英文模式输入框 -->
          <template v-if="store.currentLocale === 'en'">
            <a-input
              v-model="option.label_en"
              size="small"
              :placeholder="`${t('options.optionNamePlaceholder')} ${idx + 1}`"
              class="flex-1 !rounded-md"
              :class="{ 'prop-field-focused': isOptionFocused(idx) }"
              allow-clear
              @focus="onFocus(idx)"
              @blur="onBlur"
              @input="onInput(idx, $event)"
              @keydown.enter.prevent="addOptionAt(idx + 1)"
            >
              <template #suffix>
                <span
                  v-if="option.label && !option.label_en"
                  class="text-[10px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
                  :title="`中文: ${option.label}`"
                >
                  {{ t('prop.missingEnTag') }}
                </span>
                <span
                  v-else-if="option.label_en && !option.label"
                  class="text-[10px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
                >
                  {{ t('prop.missingZhTag') }}
                </span>
              </template>
            </a-input>
          </template>
          <!-- 中文模式输入框 -->
          <template v-else>
            <a-input
              v-model="option.label"
              size="small"
              :placeholder="`${t('options.optionNamePlaceholder')} ${idx + 1}`"
              class="flex-1 !rounded-md"
              :class="{ 'prop-field-focused': isOptionFocused(idx) }"
              allow-clear
              @focus="onFocus(idx)"
              @blur="onBlur"
              @input="onInput(idx, $event)"
              @keydown.enter.prevent="addOptionAt(idx + 1)"
            >
              <template #suffix>
                <span
                  v-if="option.label && !option.label_en"
                  class="text-[10px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
                >
                  {{ t('prop.missingEnTag') }}
                </span>
                <span
                  v-else-if="option.label_en && !option.label"
                  class="text-[10px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200/60 font-medium whitespace-nowrap select-none"
                  :title="`EN: ${option.label_en}`"
                >
                  {{ t('prop.missingZhTag') }}
                </span>
              </template>
            </a-input>
          </template>

          <!-- 现代精致删除按钮 (不受全局 Arco 样式污染) -->
          <button
            type="button"
            class="option-del-btn flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50/80 active:bg-red-100 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all shrink-0"
            :disabled="options.length <= 1"
            :title="t('options.deleteOption')"
            @click="removeOption(idx)"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </template>

    <!-- 底部快捷添加选项按钮 (采用标准 Arco a-button，配合 long 属性宽度自适应容器) -->
    <a-button
      type="dashed"
      long
      size="small"
      class="mt-2.5 !h-7 !text-[12px] !rounded-[6px] !font-medium"
      @click="addOption"
    >
      <template #icon>
        <Plus class="h-3.5 w-3.5" />
      </template>
      {{ t('prop.addOption') }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { FormElement, FormElementOption } from '@/types/schema';
import { store, markDirty } from '@/core/store';
import { t } from '@/core/i18n';
import { Trash2, GripVertical, Plus } from '@lucide/vue';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import Sortable from 'sortablejs';

const props = defineProps<{ element: FormElement }>();

const options = computed<FormElementOption[]>(() => {
  return props.element?.options || [];
});

const isDisplayOnly = computed(() => {
  return props.element?.type === 'signature' || props.element?.type === 'alert';
});

const sortableListRef = ref<HTMLElement | null>(null);
let sortableInstance: Sortable | null = null;

function initSortable() {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  if (!sortableListRef.value || isDisplayOnly.value) return;

  sortableInstance = new Sortable(sortableListRef.value, {
    handle: '.drag-handle',
    draggable: '.option-row',
    animation: 200,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    ghostClass: 'option-sortable-ghost',
    chosenClass: 'option-sortable-chosen',
    dragClass: 'option-sortable-drag',
    fallbackClass: 'option-sortable-fallback',
    forceFallback: true,
    fallbackOnBody: false,
    fallbackTolerance: 2,
    onEnd(evt) {
      if (document.activeElement && (document.activeElement === evt.item || evt.item?.contains(document.activeElement))) {
        (document.activeElement as HTMLElement)?.blur?.();
      }
    },
    onUpdate(evt) {
      if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
        if (!props.element?.options) return;
        const [moved] = props.element.options.splice(evt.oldIndex, 1);
        if (moved) {
          props.element.options.splice(evt.newIndex, 0, moved);
          markDirty();
        }
      }
    }
  });
}

onMounted(() => {
  initSortable();
});

watch(
  () => [props.element?.id, isDisplayOnly.value],
  () => {
    nextTick(() => {
      initSortable();
    });
  }
);

onBeforeUnmount(() => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
});

function isOptionFocused(idx: number) {
  return (
    store.focusedTarget?.elementId === props.element.id &&
    store.focusedTarget?.field === 'option' &&
    store.focusedTarget?.optionIndex === idx
  );
}

function onFocus(idx: number) {
  store.focusedTarget = {
    elementId: props.element.id,
    field: 'option',
    optionIndex: idx
  };
}

function onBlur() {
  store.focusedTarget = null;
}

function onInput(_idx?: number, _val?: any) {
  markDirty();
}

function addOption() {
  if (!props.element.options) {
    props.element.options = [];
  }
  const nextIdx = props.element.options.length + 1;
  props.element.options.push({
    label: store.currentLocale === 'zh' ? `选项${nextIdx}` : '',
    label_en: store.currentLocale === 'en' ? `Option ${nextIdx}` : '',
    value: `option_${nextIdx}_${Date.now().toString(36)}`
  });
  markDirty();
  nextTick(() => {
    initSortable();
  });
}

function addOptionAt(targetIndex: number) {
  if (!props.element.options) {
    props.element.options = [];
  }
  const nextIdx = props.element.options.length + 1;
  const newOpt = {
    label: store.currentLocale === 'zh' ? `选项${nextIdx}` : '',
    label_en: store.currentLocale === 'en' ? `Option ${nextIdx}` : '',
    value: `option_${nextIdx}_${Date.now().toString(36)}`
  };
  props.element.options.splice(targetIndex, 0, newOpt);
  markDirty();
  nextTick(() => {
    initSortable();
  });
}

function removeOption(idx: number) {
  if (!props.element.options || props.element.options.length <= 1) return;
  const removed = props.element.options[idx];
  props.element.options.splice(idx, 1);
  if (removed && props.element.defaultValue) {
    if (props.element.type === 'radio' || props.element.type === 'select') {
      if (props.element.defaultValue === removed.value) {
        props.element.defaultValue = '';
      }
    } else if (['checkbox', 'country', 'nationality'].includes(props.element.type)) {
      const vals = parseMultiValue(props.element.defaultValue).filter(v => v !== removed.value);
      props.element.defaultValue = stringifyMultiValue(vals);
    }
  }
  markDirty();
  nextTick(() => {
    initSortable();
  });
}
</script>

<style scoped>
.option-row {
  outline: none !important;
}
.option-row:focus,
.option-row:focus-visible,
.option-row:active {
  outline: none !important;
  box-shadow: none !important;
}
.option-del-btn {
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}
.drag-handle {
  cursor: grab;
  touch-action: none;
  outline: none !important;
  user-select: none;
  -webkit-user-select: none;
}
.drag-handle:focus,
.drag-handle:focus-visible,
.drag-handle:active {
  outline: none !important;
  box-shadow: none !important;
}
.drag-handle:active {
  cursor: grabbing;
}
.option-sortable-fallback {
  opacity: 0.95;
  background-color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-radius: 6px !important;
  outline: none !important;
}
.option-sortable-ghost {
  opacity: 0.45;
  background-color: #eff6ff !important;
  border: 1px dashed #60a5fa !important;
  border-radius: 6px !important;
  outline: none !important;
}
.option-sortable-chosen {
  background-color: #f8fafc;
  outline: none !important;
}
.option-sortable-drag {
  outline: none !important;
}
</style>
