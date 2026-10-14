<template>
  <div
    :id="element.id"
    class="canvas-element"
    :class="{
      'is-selected': isSelected,
      'is-branch-child': Boolean(element.dependsOn),
      '!ml-6': Boolean(element.dependsOn)
    }"
    :data-type="element.type"
    @click.stop="handleClick"
  >
    <!-- 连线：父级组件底部引出主干母线与定位连接点 -->
    <div
      v-if="isBranchParent"
      class="absolute left-[13px] -bottom-[13px] w-[2px] h-[13px] bg-blue-500 z-10 pointer-events-none"
    >
      <div class="absolute -top-1 -left-[3px] w-2 h-2 rounded-full bg-blue-500 border border-white shadow-xs"></div>
    </div>

    <!-- 连线：子级左侧连续树状导轨连线与指向箭头 (将整组组件真正串联) -->
    <div
      v-if="element.dependsOn"
      class="absolute -left-[11px] pointer-events-none z-10"
      :class="isLastBranchChild ? 'top-[-13px] h-[38px] w-[14px]' : 'top-[-13px] -bottom-[13px] w-[14px]'"
    >
      <!-- 竖向主干连续导轨 -->
      <div
        class="absolute left-0 top-0 w-[2px] bg-blue-500"
        :class="isLastBranchChild ? 'h-[31px]' : 'bottom-0'"
      ></div>

      <!-- 末尾子级：平滑 90 度圆弧拐角 + 箭头收口 -->
      <template v-if="isLastBranchChild">
        <div class="absolute left-0 top-[29px] w-[8px] h-[8px] border-l-2 border-b-2 border-blue-500 rounded-bl-[4px]"></div>
        <div class="absolute left-[7px] top-[33.5px] w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[5px] border-l-blue-500"></div>
      </template>

      <!-- 中间子级：T 型横向分支 + 箭头进入当前卡片 -->
      <template v-else>
        <div class="absolute left-0 top-[36px] w-[8px] h-[2px] bg-blue-500"></div>
        <div class="absolute left-[7px] top-[33.5px] w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[5px] border-l-blue-500"></div>
      </template>
    </div>

    <!-- 悬浮操作按钮区 -->
    <div class="element-actions">
      <button class="action-btn copy-btn" type="button" @click.stop="duplicateElement(element.id)">
        <Copy class="h-3.5 w-3.5" />
      </button>
      <button class="action-btn delete-btn" type="button" @click.stop="deleteElement(element.id)">
        <Trash2 class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- 树状联动分支精炼条件徽标 (含从属锁定标识) -->
    <div
      v-if="element.dependsOn"
      class="inline-flex items-center gap-1.5 mb-2 select-none"
    >
      <span
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#1677ff] font-medium text-[11px] border border-blue-200/60 shadow-2xs"
        title="条件从属项：位置已锁定并跟随父级联动"
      >
        <Lock class="w-2.5 h-2.5 text-blue-500 shrink-0" />
        若选「{{ triggerOptName }}」
      </span>
    </div>

    <!-- 动态组件分发 -->
    <component :is="renderComponent" :element="element" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, selectElement, duplicateElement, deleteElement, highlightPropertyField } from '@/core/store';
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

const props = defineProps<{ element: FormElement }>();

const isSelected = computed(() => {
  return store.selectedType === 'element' && store.selectedId === props.element.id;
});

const triggerOptName = computed(() => {
  if (!props.element.dependsOn) return '';
  const dep = props.element.dependsOn;
  for (const page of store.pages) {
    const parentField = page.fields.find(f => f.key === dep.fieldKey);
    if (parentField) {
      const opt = parentField.options?.find(o => o.value === dep.value);
      if (opt && opt.label) return opt.label;
    }
  }
  return dep.value === 'yes' ? '是' : (dep.value === 'no' ? '否' : dep.value);
});

const currentPage = computed(() => {
  return store.pages.find(p => p.fields.some(f => f.id === props.element.id)) || null;
});

const currentFieldIndex = computed(() => {
  if (!currentPage.value) return -1;
  return currentPage.value.fields.findIndex(f => f.id === props.element.id);
});

// 是否作为联动分支的父级组件（当紧随其后的组件有依赖当前组件时，向下引出主干母线）
const isBranchParent = computed(() => {
  if (!currentPage.value || currentFieldIndex.value === -1) return false;
  const fields = currentPage.value.fields;
  const nextField = fields[currentFieldIndex.value + 1];
  return Boolean(nextField && nextField.dependsOn?.fieldKey === props.element.key);
});

// 是否是分支序列中的最后一个子组件（如果是最后一个，导轨向下弯折收口；如果后面还有同组子组件，主干导轨继续贯穿向下）
const isLastBranchChild = computed(() => {
  if (!props.element.dependsOn) return false;
  if (!currentPage.value || currentFieldIndex.value === -1) return true;
  const fields = currentPage.value.fields;
  const nextField = fields[currentFieldIndex.value + 1];
  return !nextField || nextField.dependsOn?.fieldKey !== props.element.dependsOn.fieldKey;
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
