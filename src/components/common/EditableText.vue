<template>
  <component :is="tag" ref="textRef" class="outline-none transition-all duration-200 cursor-text hover:text-[#1677ff]" :class="[
    customClass,
    { 'canvas-text-focus': isFocused }
  ]" contenteditable="plaintext-only" spellcheck="false" style="user-select: text !important; -webkit-user-select: text !important; outline: none !important;" @focus="handleFocus" @blur="handleBlur" @input="handleInput" @keydown.enter.prevent="handleEnter" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { store, markDirty, highlightPropertyField, selectElement } from '@/core/store';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    elementId?: string;
    field?: 'label' | 'help' | 'placeholder' | 'option' | 'title' | 'description';
    optionIndex?: number;
    customClass?: string;
    tag?: string;
    autoSelect?: boolean;
    allowEmpty?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    field: 'label',
    tag: 'span',
    autoSelect: true,
    allowEmpty: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: string): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'blur', evt: FocusEvent): void;
}>();

const textRef = ref<HTMLElement | null>(null);
const isEditing = ref(false);

const isFocused = computed(() => {
  if (!store.focusedTarget || !props.elementId) return false;
  if (store.focusedTarget.elementId !== props.elementId) return false;
  if (store.focusedTarget.field !== props.field) return false;
  if (props.optionIndex !== undefined) {
    return store.focusedTarget.optionIndex === props.optionIndex;
  }
  return true;
});

function syncTextToDOM(val: string | undefined) {
  if (!textRef.value) return;
  const targetText = val || props.placeholder || '';
  if (textRef.value.textContent !== targetText) {
    textRef.value.textContent = targetText;
  }
}

onMounted(() => {
  syncTextToDOM(props.modelValue);
});

watch(
  () => props.modelValue,
  newVal => {
    // 当自身非活动聚焦元素时，才由外部响应式同步更新，避免破坏正在输入的选区光标
    if (typeof document !== 'undefined' && document.activeElement !== textRef.value) {
      syncTextToDOM(newVal);
    }
  }
);

watch(
  () => props.placeholder,
  () => {
    if (typeof document !== 'undefined' && document.activeElement !== textRef.value && !props.modelValue) {
      syncTextToDOM(props.modelValue);
    }
  }
);

function handleFocus(e: FocusEvent) {
  isEditing.value = true;
  if (props.autoSelect && props.elementId) {
    selectElement(props.elementId);
    store.focusedTarget = {
      elementId: props.elementId,
      field: props.field,
      optionIndex: props.optionIndex
    };
    if (['label', 'placeholder', 'help', 'option'].includes(props.field)) {
      highlightPropertyField(
        props.field as 'label' | 'placeholder' | 'help' | 'option',
        props.optionIndex
      );
    }
  }
  emit('focus', e);
}

function handleBlur(e: FocusEvent) {
  isEditing.value = false;
  const currentText = textRef.value?.textContent?.trim() || '';
  let finalVal = currentText;

  if (!finalVal && !props.allowEmpty) {
    finalVal = props.placeholder || '';
    if (textRef.value) {
      textRef.value.textContent = finalVal;
    }
  }

  emit('update:modelValue', finalVal);
  emit('change', finalVal);
  markDirty();

  if (
    store.focusedTarget?.elementId === props.elementId &&
    store.focusedTarget?.field === props.field &&
    (props.optionIndex === undefined || store.focusedTarget?.optionIndex === props.optionIndex)
  ) {
    store.focusedTarget = null;
  }

  emit('blur', e);
}

function handleInput() {
  const currentText = textRef.value?.textContent || '';
  emit('update:modelValue', currentText);
  emit('change', currentText);
  markDirty();
}

function handleEnter() {
  textRef.value?.blur();
}
</script>
