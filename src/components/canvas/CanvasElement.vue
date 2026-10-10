<template>
  <div :id="element.id" class="canvas-element" :class="{
    'is-selected': isSelected
  }" :data-type="element.type" @click.stop="handleClick">
    <!-- 悬浮操作按钮区 -->
    <div class="element-actions">
      <button class="action-btn copy-btn" type="button" @click.stop="duplicateElement(element.id)">
        <Copy class="h-3.5 w-3.5" />
      </button>
      <button class="action-btn delete-btn" type="button" @click.stop="deleteElement(element.id)">
        <Trash2 class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- 动态组件分发 -->
    <component :is="renderComponent" :element="element" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, selectElement, duplicateElement, deleteElement, highlightPropertyField } from '@/core/store';
import { Copy, Trash2 } from '@lucide/vue';

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
