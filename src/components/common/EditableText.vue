<template>
  <component
    :is="tag"
    ref="textRef"
    class="outline-none cursor-text hover:text-[#1677ff] editable-text-node"
    :class="[
      customClass,
      { 'canvas-text-focus': isFocused }
    ]"
    :data-placeholder="placeholder"
    contenteditable="plaintext-only"
    spellcheck="false"
    style="user-select: text !important; -webkit-user-select: text !important; outline: none !important;"
    @mousedown="handleMouseDown"
    @dragstart.prevent
    @focus="handleFocus"
    @blur="handleBlur"
    @input="handleInput"
    @keydown.enter="handleEnter"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { store, markDirty, highlightPropertyField, selectElement, selectPage } from '@/core/store';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    elementId?: string;
    field?: 'label' | 'help' | 'placeholder' | 'option' | 'title' | 'description' | 'content';
    optionIndex?: number;
    customClass?: string;
    tag?: string;
    autoSelect?: boolean;
    allowEmpty?: boolean;
    multiline?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    field: 'label',
    tag: 'span',
    autoSelect: true,
    allowEmpty: false,
    multiline: false
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

function getElementText(): string {
  if (!textRef.value) return '';
  if (props.multiline) {
    return textRef.value.innerText || textRef.value.textContent || '';
  }
  return textRef.value.textContent || '';
}

function syncTextToDOM(val: string | undefined) {
  if (!textRef.value) return;
  const targetText = val !== undefined && val !== null && val !== '' ? val : (!props.allowEmpty ? (props.placeholder || '') : '');
  if (getElementText() !== targetText) {
    textRef.value.textContent = targetText;
  }
}

onMounted(() => {
  syncTextToDOM(props.modelValue);
});

watch(
  () => [props.modelValue, props.placeholder, store.currentLocale],
  () => {
    // 当自身正在编辑或为当前活动聚焦元素时，绝对不同步，避免破坏用户正在输入的光标选区
    if (isEditing.value || (typeof document !== 'undefined' && document.activeElement === textRef.value)) {
      return;
    }
    syncTextToDOM(props.modelValue);
  }
);

function handleMouseDown(e: MouseEvent) {
  // 如果处于空格抓手模式、中键拖拽、或 Ctrl/Cmd 组合键，允许冒泡让 InfiniteCanvas 正常平移画布！
  if (store.isSpacePressed || e.button === 1 || e.ctrlKey || e.metaKey) {
    return;
  }
  // 如果当前文本元素已经聚焦处于编辑划选中，阻止冒泡，避免划选文本时意外带动底层画板
  if (typeof document !== 'undefined' && document.activeElement === textRef.value) {
    e.stopPropagation();
  }
}

function handleFocus(e: FocusEvent) {
  isEditing.value = true;
  if (props.autoSelect && props.elementId) {
    if (props.field === 'title' || props.field === 'description') {
      selectPage(props.elementId);
    } else {
      selectElement(props.elementId);
    }
    store.focusedTarget = {
      elementId: props.elementId,
      field: props.field,
      optionIndex: props.optionIndex
    };
    highlightPropertyField(
      props.field,
      props.optionIndex
    );
  }
  emit('focus', e);
}

function handleBlur(e: FocusEvent) {
  isEditing.value = false;
  const currentText = (getElementText() || '').trim();
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
  const currentText = getElementText();
  emit('update:modelValue', currentText);
  emit('change', currentText);
  markDirty();
}

function handleEnter(e: KeyboardEvent) {
  if (props.multiline || props.field === 'description' || props.field === 'content') {
    return;
  }
  e.preventDefault();
  textRef.value?.blur();
}
</script>

<style scoped>
.editable-text-node:empty::before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}
</style>
