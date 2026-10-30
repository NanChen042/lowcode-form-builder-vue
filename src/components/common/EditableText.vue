<template>
  <component
    :is="tag"
    ref="textRef"
    class="outline-none cursor-text hover:text-[#1677ff] editable-text-node"
    :class="[
      customClass,
      {
        'canvas-text-focus': isFocused,
        'is-placeholder': isShowingPlaceholder
      }
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
import { store, markDirty, highlightPropertyField, selectElement, selectPage, selectGroup } from '@/core/store';

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

const isShowingPlaceholder = computed(() => {
  if (isEditing.value) return false;
  const val = props.modelValue;
  return val === undefined || val === null || val === '';
});

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
  const hasVal = val !== undefined && val !== null && val !== '';
  const targetText = hasVal ? val : (props.allowEmpty ? '' : (props.placeholder || ''));
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
    if (isEditing.value || (typeof document !== 'undefined' && document.activeElement === textRef.value)) {
      return;
    }
    syncTextToDOM(props.modelValue);
  }
);

function handleMouseDown(e: MouseEvent) {
  if (store.isSpacePressed || e.button === 1 || e.ctrlKey || e.metaKey) {
    return;
  }
  if (typeof document !== 'undefined' && document.activeElement === textRef.value) {
    e.stopPropagation();
  }
}

function handleFocus(e: FocusEvent) {
  isEditing.value = true;
  if ((!props.modelValue || props.modelValue === '') && textRef.value) {
    textRef.value.textContent = '';
  }

  if (props.autoSelect && props.elementId) {
    if (props.elementId.startsWith('grp_')) {
      selectGroup(props.elementId);
    } else if (props.field === 'title' || props.field === 'description') {
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
  const rawText = getElementText() || '';
  const finalVal = (props.multiline || props.field === 'content' || props.field === 'description')
    ? rawText.replace(/\r\n/g, '\n').replace(/\n+$/, '')
    : rawText.trim();

  emit('update:modelValue', finalVal);
  emit('change', finalVal);
  markDirty();

  if (!finalVal) {
    if (textRef.value) {
      textRef.value.textContent = props.allowEmpty ? '' : (props.placeholder || '');
    }
  }

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
  if (!currentText.trim() && textRef.value && textRef.value.innerHTML === '<br>') {
    textRef.value.innerHTML = '';
  }
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

function focus() {
  if (!textRef.value) return;
  textRef.value.focus();
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || (sel.anchorNode === textRef.value && sel.anchorOffset === 0)) {
      const range = document.createRange();
      range.selectNodeContents(textRef.value);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  } catch {}
}

defineExpose({
  focus,
  textRef
});
</script>

<style scoped>
.editable-text-node.is-placeholder {
  color: #94a3b8 !important;
  font-weight: 400 !important;
  font-style: normal;
}
.editable-text-node:empty::before {
  content: attr(data-placeholder);
  color: #94a3b8;
  font-weight: 400;
  pointer-events: none;
}
</style>
