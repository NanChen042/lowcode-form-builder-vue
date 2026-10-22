<template>
  <div id="options-editor" class="options-editor space-y-1.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
    <template v-if="isDisplayOnly">
      <div
        v-for="(option, idx) in options"
        :key="idx"
        class="notice-row group flex items-start gap-1.5 py-1 transition-all"
      >
        <div class="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium shrink-0 select-none">
          {{ idx + 1 }}
        </div>

        <div class="flex-1 relative">
          <a-textarea
            :model-value="getOptionLabel(option)"
            :auto-size="{ minRows: 1, maxRows: 5 }"
            size="small"
            :placeholder="t('options.noticePlaceholder')"
            class="w-full !rounded-md !text-[12px]"
            :class="{ 'prop-field-focused': isOptionFocused(idx) }"
            @focus="onFocus(idx)"
            @blur="onBlur"
            @input="onOptionInput(option, idx, $event)"
          />
        </div>

        <button
          type="button"
          class="mt-0.5 option-del-btn flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
          :disabled="options.length <= 1"
          :title="t('options.deleteOption')"
          @click="removeOption(idx)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </button>
      </div>
    </template>

    <template v-else>
      <div ref="sortableListRef" class="space-y-1.5">
        <div
          v-for="(option, idx) in options"
          :key="option.value ? ((props.element?.id || '') + '_' + option.value) : ((props.element?.id || '') + '_' + idx)"
          class="option-row group flex flex-col gap-1 py-0.5"
        >
          <div class="flex items-center gap-1.5 w-full">
            <div
              class="drag-handle flex items-center justify-center w-4 h-6 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing transition-colors select-none shrink-0"
              :title="t('options.dragToReorderIndexed', undefined, { index: idx + 1 })"
            >
              <GripVertical class="h-3.5 w-3.5" />
            </div>

            <a-input
              :model-value="getOptionLabel(option)"
              size="mini"
              :placeholder="props.element.type === 'signature' ? t('options.declarationPlaceholder', undefined, { index: idx + 1 }) : formatOptionLabel(idx + 1, store.currentLocale)"
              class="flex-1"
              :class="{ 'prop-field-focused': isOptionFocused(idx) }"
              @focus="onFocus(idx)"
              @blur="onBlur"
              @input="onOptionInput(option, idx, $event)"
              @keydown.enter.prevent="addOptionAt(idx + 1)"
            />

            <a-popover
              v-if="['radio', 'select', 'checkbox'].includes(props.element.type)"
              trigger="click"
              position="br"
              :content-style="{ padding: '10px 12px', width: '280px' }"
            >
              <button
                type="button"
                class="flex items-center justify-center w-6 h-6 rounded transition-all shrink-0 cursor-pointer"
                :class="getLinkedFieldsForOption(option).length > 0
                  ? 'text-[#1677ff] bg-blue-50/90 hover:bg-blue-100 font-semibold shadow-2xs border border-blue-200/80'
                  : (isMaxDepthReached
                      ? 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100')"
                :title="isMaxDepthReached && getLinkedFieldsForOption(option).length === 0
                  ? t('options.maxDepthReachedShort')
                  : t('options.linkConfigTitle', undefined, { name: getOptionLabel(option, undefined, true) || t('options.thisOption') })"
              >
                <Link2 class="h-3.5 w-3.5" />
              </button>

              <template #content>
                <div class="space-y-2.5 text-xs">
                  <div class="font-semibold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <div class="flex items-center gap-1">
                      <Link2 class="w-3.5 h-3.5 text-[#1677ff]" />
                      <span>{{ t('options.linkTriggerHeader', undefined, { name: getOptionLabel(option, undefined, true) || t('options.thisOption') }) }}</span>
                    </div>
                  </div>

                  <div
                    v-if="isMaxDepthReached"
                    class="p-2 rounded bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] leading-relaxed"
                  >
                    {{ t('options.maxDepthReached') }}
                  </div>

                  <div v-if="!isMaxDepthReached">
                    <div class="text-[11px] font-medium text-slate-500 mb-1.5">
                      {{ t('options.chooseFollowupField') }}
                    </div>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        v-for="item in branchTypes"
                        :key="item.type"
                        type="button"
                        class="flex items-center gap-1.5 px-2 py-1.5 rounded border border-slate-200/80 bg-white hover:bg-blue-50/70 hover:border-blue-300 hover:text-[#1677ff] text-[11px] text-slate-700 transition-all cursor-pointer text-left select-none"
                        @click.stop="quickInsertFollowupField(option, item.type, item.label)"
                      >
                        <Plus class="w-3 h-3 text-[#1677ff] shrink-0" />
                        <span class="truncate">{{ item.label }}</span>
                      </button>
                    </div>
                  </div>

                  <div v-if="downstreamFields.length > 0" class="pt-2 border-t border-slate-100">
                    <div class="text-[11px] font-medium text-slate-500 mb-1">
                      {{ t('options.orLinkExisting') }}
                    </div>
                    <div class="max-h-36 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
                      <div
                        v-for="df in downstreamFields"
                        :key="df.id"
                        class="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer select-none transition-colors"
                        @click.stop="toggleFieldLinkToOption(df.id, option)"
                      >
                        <a-checkbox
                          :model-value="isFieldLinkedToOption(df.id, option)"
                          size="small"
                          class="!m-0 pointer-events-none"
                        />
                        <span class="truncate flex-1 font-medium text-slate-700 text-[11px]">{{ getFieldText(df, 'label', undefined, true) || df.key }}</span>
                        <span class="text-[10px] text-slate-400 font-mono shrink-0">({{ df.type }})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>

            <button
              type="button"
              class="option-del-btn flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
              :disabled="options.length <= 1"
              :title="t('options.deleteOption')"
              @click="removeOption(idx)"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>

          <div
            v-if="['radio', 'select', 'checkbox'].includes(props.element.type) && getLinkedFieldsForOption(option).length > 0"
            class="flex flex-wrap items-center gap-1 pl-6 pt-0.5"
          >
            <span
              v-for="lf in getLinkedFieldsForOption(option)"
              :key="lf.id"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50/90 text-[#1677ff] text-[10.5px] border border-blue-200/80 shadow-2xs group"
            >
              <CornerDownRight class="w-2.5 h-2.5 text-blue-400" />
              <span class="font-medium max-w-[130px] truncate">
                {{ t('options.expandedTag', undefined, { name: getFieldText(lf, 'label', undefined, true) || lf.key }) }}
              </span>
              <button
                type="button"
                class="ml-0.5 text-blue-400 hover:text-red-500 transition-colors cursor-pointer text-xs font-bold leading-none"
                :title="t('options.unlink')"
                @click.stop="unlinkField(lf.id)"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      </div>
    </template>

    <a-button
      type="dashed"
      long
      size="mini"
      class="mt-2"
      @click="addOption"
    >
      <template #icon>
        <Plus class="h-3.5 w-3.5" />
      </template>
      {{ addButtonLabel }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { FormElement, FormElementOption, ComponentType } from '@/types/schema';
import { store, markDirty, createElement, selectElement } from '@/core/store';
import { t, formatOptionLabel, getOptionLabel, setOptionLabel, getFieldText } from '@/core/i18n';
import { Trash2, GripVertical, Plus, Link2, CornerDownRight } from '@lucide/vue';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import Sortable from 'sortablejs';

const branchTypes = computed(() => [
  { type: 'input' as const, label: store.currentLocale === 'en' ? 'Input' : '单行输入' },
  { type: 'textarea' as const, label: store.currentLocale === 'en' ? 'Textarea' : '多行文本' },
  { type: 'radio' as const, label: store.currentLocale === 'en' ? 'Radio' : '单选框组' },
  { type: 'checkbox' as const, label: store.currentLocale === 'en' ? 'Checkbox' : '多选框组' },
  { type: 'select' as const, label: store.currentLocale === 'en' ? 'Dropdown' : '下拉选择' },
  { type: 'date' as const, label: store.currentLocale === 'en' ? 'Date' : '日期选择' },
  { type: 'phone' as const, label: store.currentLocale === 'en' ? 'Phone' : '手机号码' },
  { type: 'email' as const, label: store.currentLocale === 'en' ? 'Email' : '电子邮箱' }
]);

const props = defineProps<{ element: FormElement }>();

const options = computed<FormElementOption[]>(() => {
  return props.element?.options || [];
});

const isDisplayOnly = computed(() => {
  return props.element?.type === 'signature';
});

const addButtonLabel = computed(() => {
  if (props.element?.type === 'signature') {
    return t('prop.addClauseItem');
  }
  return t('prop.addOption');
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

function onOptionInput(option: FormElementOption, idx: number, val: string) {
  setOptionLabel(option, val);
  store.focusedTarget = {
    elementId: props.element.id,
    field: 'option',
    optionIndex: idx
  };
  markDirty();
}

function addOption() {
  if (!props.element.options) {
    props.element.options = [];
  }
  const nextIdx = props.element.options.length + 1;
  props.element.options.push({
    label: formatOptionLabel(nextIdx, 'zh'),
    label_en: formatOptionLabel(nextIdx, 'en'),
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
    label: formatOptionLabel(nextIdx, 'zh'),
    label_en: formatOptionLabel(nextIdx, 'en'),
    value: `option_${nextIdx}_${Date.now().toString(36)}`
  };
  props.element.options.splice(targetIndex, 0, newOpt);
  markDirty();
  nextTick(() => {
    initSortable();
  });
}

const currentPage = computed(() => {
  if (!props.element) return null;
  return store.pages.find(p => p.fields?.some(f => f.id === props.element.id)) || null;
});

const MAX_NESTING_DEPTH = 2;

const currentElementDepth = computed(() => {
  if (!props.element?.dependsOn || !currentPage.value) return 0;
  let depth = 0;
  let current: FormElement | undefined = props.element;
  const visited = new Set<string>();
  const fields = currentPage.value.fields || [];
  while (current?.dependsOn?.fieldKey) {
    if (visited.has(current.dependsOn.fieldKey)) break;
    visited.add(current.dependsOn.fieldKey);
    const parent = fields.find(f => f.key === current?.dependsOn?.fieldKey);
    if (!parent) break;
    depth++;
    current = parent;
  }
  return depth;
});

const isMaxDepthReached = computed(() => {
  return currentElementDepth.value >= MAX_NESTING_DEPTH;
});

const downstreamFields = computed(() => {
  if (!currentPage.value || !props.element) return [];
  const fields = currentPage.value.fields || [];
  const currentIndex = fields.findIndex(f => f.id === props.element.id);
  if (currentIndex < 0) return [];
  // 排除掉所有祖先字段，避免形成死循环依赖
  const ancestorKeys = new Set<string>();
  let cur: FormElement | undefined = props.element;
  while (cur?.dependsOn?.fieldKey) {
    ancestorKeys.add(cur.dependsOn.fieldKey);
    cur = fields.find(f => f.key === cur?.dependsOn?.fieldKey);
  }
  return fields.slice(currentIndex + 1).filter(f => !ancestorKeys.has(f.key));
});

function getLinkedFieldsForOption(option: FormElementOption) {
  if (!props.element?.key || !option.value) return [];
  return downstreamFields.value.filter(f => {
    return f.dependsOn?.fieldKey === props.element.key && f.dependsOn?.value === option.value;
  });
}

function isFieldLinkedToOption(fieldId: string, option: FormElementOption): boolean {
  const f = downstreamFields.value.find(field => field.id === fieldId);
  return f?.dependsOn?.fieldKey === props.element.key && f?.dependsOn?.value === option.value;
}

function toggleFieldLinkToOption(fieldId: string, option: FormElementOption) {
  const f = downstreamFields.value.find(field => field.id === fieldId);
  if (!f) return;
  if (isFieldLinkedToOption(fieldId, option)) {
    delete f.dependsOn;
  } else {
    f.dependsOn = {
      fieldKey: props.element.key,
      value: option.value
    };
  }
  markDirty();
}

function unlinkField(fieldId: string) {
  const f = downstreamFields.value.find(field => field.id === fieldId);
  if (f) {
    delete f.dependsOn;
    markDirty();
  }
}

function quickInsertFollowupField(option: FormElementOption, type: ComponentType = 'input', typeLabel?: string) {
  if (!currentPage.value || !props.element || isMaxDepthReached.value) return;
  const newEl = createElement(type);
  newEl.label = typeLabel || t('options.singleInputDefault');
  newEl.required = false;
  newEl.defaultValue = '';
  newEl.dependsOn = {
    fieldKey: props.element.key,
    value: option.value
  };

  const fields = currentPage.value.fields || [];
  const currentIdx = fields.findIndex(f => f.id === props.element.id);

  // 寻找到当前组件及其名下所有层级从属子组件的末尾进行插入
  const descendantKeys = new Set<string>([props.element.key]);
  let insertIdx = currentIdx + 1;
  while (insertIdx < fields.length) {
    const next = fields[insertIdx];
    if (next?.dependsOn?.fieldKey && descendantKeys.has(next.dependsOn.fieldKey)) {
      if (next.key) descendantKeys.add(next.key);
      insertIdx++;
    } else {
      break;
    }
  }

  fields.splice(insertIdx, 0, newEl);
  selectElement(newEl);
  markDirty();
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
  // 清除所有关联到该被删选项的下游组件联动
  if (removed && props.element.key) {
    for (const page of store.pages) {
      for (const f of (page.fields || [])) {
        if (f.dependsOn?.fieldKey === props.element.key && f.dependsOn?.value === removed.value) {
          delete f.dependsOn;
        }
      }
    }
  }
  // 如果删减后选项数量小于 maxSelections，自动同步收缩
  if (props.element.maxSelections && props.element.maxSelections > props.element.options.length) {
    props.element.maxSelections = props.element.options.length;
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
:deep(.arco-input),
:deep(.arco-input:focus),
:deep(.arco-input:focus-visible),
:deep(input),
:deep(input:focus),
:deep(input:focus-visible),
:deep(.arco-textarea),
:deep(.arco-textarea:focus),
:deep(.arco-textarea:focus-visible),
:deep(textarea),
:deep(textarea:focus),
:deep(textarea:focus-visible) {
  outline: none !important;
  border: none !important;
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
