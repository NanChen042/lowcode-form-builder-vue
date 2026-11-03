<template>
  <div
    :id="element.id"
    :data-element-id="element.id"
    class="canvas-element"
    :class="{
      'is-selected': isSelected,
      'is-branch-child': hasLinkage,
      'branch-depth-1': elementDepth === 1,
      'branch-depth-2': elementDepth >= 2
    }"
    :data-type="element.type"
    @click.stop="handleClick"
  >
    <div class="element-actions">
      <button class="action-btn copy-btn" type="button" @click.stop="duplicateElement(element.id)">
        <Copy class="h-3.5 w-3.5" />
      </button>
      <button class="action-btn delete-btn" type="button" @click.stop="deleteElement(element.id)">
        <Trash2 class="h-3.5 w-3.5" />
      </button>
    </div>

    <div
      v-if="hasLinkage"
      class="inline-flex items-center gap-1.5 mb-2 pr-14 select-none flex-wrap"
    >
      <span
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#1677ff] font-medium text-[11px] border border-blue-200/60 shadow-2xs"
        :title="t('canvas.dependentLockedTitle')"
      >
        <Lock class="w-2.5 h-2.5 text-blue-500 shrink-0" />
        {{ t('canvas.conditionPrefix', undefined, { option: triggerOptName }) }}
        <span v-if="elementDepth >= 2" class="text-[9.5px] bg-blue-100/90 text-blue-700 px-1 py-0.2 rounded font-semibold ml-0.5">{{ t('canvas.tier2') }}</span>
      </span>
      <span
        v-if="element.showLabel === false && element.required"
        class="text-[#ff4d4f] font-bold text-[13px] leading-none select-none"
        :title="t('prop.required')"
      >*</span>
    </div>

    <component :is="renderComponent" :element="element" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, selectElement, duplicateElement, deleteElement, highlightPropertyField } from '@/core/store';
import { t, getOptionLabel, getFieldText } from '@/core/i18n';
import { Copy, Trash2, Lock } from '@lucide/vue';

import InputElement from './elements/InputElement.vue';
import TextareaElement from './elements/TextareaElement.vue';
import SelectElement from './elements/SelectElement.vue';
import RadioElement from './elements/RadioElement.vue';
import CheckboxElement from './elements/CheckboxElement.vue';
import DateElement from './elements/DateElement.vue';
import CountryElement from './elements/CountryElement.vue';
import NationalityElement from './elements/NationalityElement.vue';
import SignatureElement from './elements/SignatureElement.vue';
import AlertElement from './elements/AlertElement.vue';
import PhoneElement from './elements/PhoneElement.vue';
import EmailElement from './elements/EmailElement.vue';

const props = defineProps<{
  element: FormElement;
}>();

const isSelected = computed(() => {
  return store.selectedType === 'element' && store.selectedId === props.element.id;
});

const hasLinkage = computed(() => {
  return Boolean(props.element.linkage?.conditions?.length);
});

const DEFAULT_TITLES = new Set([
  '请输入字段标题',
  'Please enter field title',
  '单选框组',
  'Radio Group',
  '下拉选择',
  'Select',
  '多选框组',
  'Checkbox Group'
]);

const triggerOptName = computed(() => {
  const conds = props.element.linkage?.conditions;
  if (!conds || conds.length === 0) return '';

  const pageFields = currentPage.value?.fields || [];
  // 计算当前子组件所属父组件链中的序号 (#1, #2...)
  const chainParentKeys: string[] = [];
  if (currentFieldIndex.value > 0) {
    // 找到紧邻当前子组件块上方的所有被引用父组件
    let firstChildIdx = currentFieldIndex.value;
    while (firstChildIdx > 0 && pageFields[firstChildIdx - 1]?.linkage?.conditions?.length) {
      firstChildIdx--;
    }
    const blockParentKeySet = new Set<string>();
    for (let i = firstChildIdx; i < pageFields.length; i++) {
      const f = pageFields[i];
      if (!f?.linkage?.conditions?.length) break;
      for (const c of f.linkage.conditions) {
        blockParentKeySet.add(c.fieldKey);
      }
    }
    for (let i = 0; i < firstChildIdx; i++) {
      if (blockParentKeySet.has(pageFields[i].key)) {
        chainParentKeys.push(pageFields[i].key);
      }
    }
  }

  const resolveItem = (dep: { fieldKey: string; value: string }, idx: number) => {
    let optLabel = dep.value === 'yes' ? t('canvas.yes') : (dep.value === 'no' ? t('canvas.no') : dep.value);
    let customParentName = '';
    const chainIdx = chainParentKeys.indexOf(dep.fieldKey);
    const pNum = chainIdx !== -1 ? chainIdx + 1 : idx + 1;

    for (const page of store.pages) {
      const parentField = page.fields.find(f => f.key === dep.fieldKey);
      if (parentField) {
        const opt = parentField.options?.find(o => o.value === dep.value);
        if (opt) {
          optLabel = getOptionLabel(opt, undefined, true) || opt.label || opt.value;
        }
        const rawLabel = (getFieldText(parentField, 'label', undefined, true) || '').trim();
        if (rawLabel && !DEFAULT_TITLES.has(rawLabel)) {
          customParentName = rawLabel.length > 8 ? `${rawLabel.slice(0, 8)}…` : rawLabel;
        }
        break;
      }
    }

    return { pNum, optLabel, customParentName };
  };

  if (conds.length === 1) {
    const { pNum, optLabel, customParentName } = resolveItem(conds[0], 0);
    if (chainParentKeys.length > 1) {
      return customParentName ? `${customParentName}:${optLabel}` : `#${pNum} ${optLabel}`;
    }
    return optLabel;
  }

  const joinStr = props.element.linkage?.logic === 'and' ? ' + ' : ' / ';
  const resolvedList = conds.map((dep, idx) => resolveItem(dep, idx));
  resolvedList.sort((a, b) => a.pNum - b.pNum);

  return resolvedList
    .map(({ pNum, optLabel, customParentName }) => {
      return customParentName ? `${customParentName}:${optLabel}` : `#${pNum} ${optLabel}`;
    })
    .join(joinStr);
});

const currentPage = computed(() => {
  return store.pages.find(p => p.fields.some(f => f.id === props.element.id)) || null;
});

const currentFieldIndex = computed(() => {
  if (!currentPage.value) return -1;
  return currentPage.value.fields.findIndex(f => f.id === props.element.id);
});

function getFieldDepthInPage(field: FormElement | undefined, fields: FormElement[]): number {
  if (!field?.linkage?.conditions?.length) return 0;
  let depth = 0;
  let current: FormElement | undefined = field;
  const visited = new Set<string>();
  while (current?.linkage?.conditions?.[0]?.fieldKey) {
    const parentKey: string = current.linkage.conditions[0].fieldKey;
    if (visited.has(parentKey)) break;
    visited.add(parentKey);
    const parent: FormElement | undefined = fields.find(f => f.key === parentKey);
    if (!parent) break;
    depth++;
    current = parent;
  }
  return depth;
}

const elementDepth = computed(() => {
  if (!hasLinkage.value || !currentPage.value) return 0;
  return getFieldDepthInPage(props.element, currentPage.value.fields);
});

const renderComponent = computed(() => {
  switch (props.element.type) {
    case 'input':
      return InputElement;
    case 'textarea':
      return TextareaElement;
    case 'select':
      return SelectElement;
    case 'radio':
      return RadioElement;
    case 'checkbox':
      return CheckboxElement;
    case 'date':
      return DateElement;
    case 'country':
      return CountryElement;
    case 'nationality':
      return NationalityElement;
    case 'signature':
      return SignatureElement;
    case 'alert':
      return AlertElement;
    case 'phone':
      return PhoneElement;
    case 'email':
      return EmailElement;
    default:
      return InputElement;
  }
});

function handleClick(e: MouseEvent) {
  selectElement(props.element);

  const target = e.target as HTMLElement;
  if (target.closest('[contenteditable]')) {
    return;
  }

  const placeholderText = target.closest('.component-placeholder');
  if (placeholderText) {
    store.focusedTarget = { elementId: props.element.id, field: 'placeholder' };
    highlightPropertyField('placeholder');
  }
}
</script>

<style scoped>
.canvas-element.branch-depth-1 {
  margin-left: 15px;
}
.canvas-element.branch-depth-2 {
  margin-left: 36px ;
}
</style>
