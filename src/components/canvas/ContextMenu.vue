<template>
  <a-dropdown
    :popup-visible="visible"
    position="bl"
    :popup-max-height="false"
    @popup-visible-change="handleVisibleChange"
  >
    <div
      class="fixed pointer-events-none w-px h-px opacity-0"
      :style="{ left: `${x}px`, top: `${y}px` }"
    />

    <template #content>
      <template v-if="targetType === 'element' && targetElementId">
        <a-doption @click="handleDuplicateElement">
          <template #icon>
            <Copy class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.duplicate') }}</span>
          <template #suffix>
            <span class="text-[10px] text-slate-400 font-mono">{{ isMac ? '⌘D' : 'Ctrl+D' }}</span>
          </template>
        </a-doption>

        <ComponentCascadeMenu
          :title="t('context.insertBelow')"
          value-prefix="elem-insert"
          @select="handleQuickAddComponent"
        />

        <a-divider style="margin: 4px 0" />

        <a-doption class="context-danger-option" @click="handleDeleteElement">
          <template #icon>
            <Trash2 class="h-4 w-4 text-red-500" />
          </template>
          <span>{{ t('context.deleteElement') }}</span>
        </a-doption>
      </template>

      <template v-else-if="targetType === 'page' && targetPageId">
        <div
          v-if="isTargetSystemProfilePage"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-500 border-b border-slate-100 select-none"
        >
          <Lock class="h-3 w-3 text-blue-500" />
          <span>{{ t('context.presetReadOnly') }}</span>
        </div>

        <template v-if="!isTargetSystemProfilePage">
          <ComponentCascadeMenu
            :title="t('context.addComponent')"
            value-prefix="page-insert"
            title-class="font-medium text-slate-800"
            @select="handleQuickAddComponent"
          />

          <a-divider style="margin: 4px 0" />
        </template>

        <a-doption @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.insertPageAfter') }}</span>
        </a-doption>

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.resetView') }}</span>
        </a-doption>

        <template v-if="!isTargetSystemProfilePage">
          <a-divider style="margin: 4px 0" />

          <a-doption class="context-danger-option" @click="handleDeletePage">
            <template #icon>
              <Trash2 class="h-4 w-4 text-red-500" />
            </template>
            <span>{{ t('context.deletePage') }}</span>
          </a-doption>
        </template>
      </template>

      <template v-else>
        <a-doption @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.newPage') }}</span>
        </a-doption>

        <a-divider style="margin: 4px 0" />

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.resetView') }}</span>
        </a-doption>
      </template>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentType } from '@/types/schema';
import {
  addPage,
  deletePage,
  resetCanvasView,
  duplicateElement,
  deleteElement,
  addElement,
  clearSelection,
  store
} from '@/core/store';
import { t } from '@/core/i18n';
import { Modal } from '@arco-design/web-vue';
import { FilePlus, Expand, Trash2, Copy, Lock } from '@lucide/vue';
import ComponentCascadeMenu from './ComponentCascadeMenu.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    x: number;
    y: number;
    targetPageId?: string | null;
    targetElementId?: string | null;
    targetType?: 'element' | 'page' | 'canvas';
  }>(),
  {
    targetPageId: null,
    targetElementId: null,
    targetType: 'canvas'
  }
);

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const targetPage = computed(() => {
  return props.targetPageId ? store.pages.find(p => p.id === props.targetPageId) : null;
});

const isTargetSystemProfilePage = computed(() => {
  if (!props.targetPageId) return false;
  return targetPage.value?.pageType === 'system_profile' || store.pages[0]?.id === props.targetPageId;
});

const isTargetFirstPage = isTargetSystemProfilePage;

function handleVisibleChange(val: boolean) {
  if (!val) {
    emit('close');
  }
}

function handleQuickAddComponent(type: ComponentType) {
  try {
    if (props.targetType === 'element' && props.targetElementId) {
      addElement(type, props.targetPageId || undefined);
    } else {
      const targetPageId = props.targetPageId || store.activePageId || (store.pages[0]?.id ?? undefined);
      if (store.selectedType !== 'element') {
        clearSelection();
      }
      addElement(type, targetPageId);
    }
  } catch (err) {
    console.error('Failed to add component via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDuplicateElement() {
  try {
    if (props.targetElementId) {
      duplicateElement(props.targetElementId);
    }
  } catch (err) {
    console.error('Failed to duplicate element via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDeleteElement() {
  try {
    if (props.targetElementId) {
      deleteElement(props.targetElementId);
    }
  } catch (err) {
    console.error('Failed to delete element via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleAddPage() {
  try {
    addPage(props.targetPageId);
  } catch (err) {
    console.error('Failed to add page via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleResetView() {
  try {
    resetCanvasView();
  } catch (err) {
    console.error('Failed to reset view via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDeletePage() {
  if (isTargetFirstPage.value) return;
  if (props.targetPageId) {
    const pageId = props.targetPageId;
    Modal.confirm({
      title: t('context.confirmDeleteTitle'),
      content: t('context.confirmDeleteContent'),
      okText: t('context.confirmDeleteOk'),
      cancelText: t('common.cancel'),
      okButtonProps: { status: 'danger' },
      simple: false,
      width: 440,
      titleAlign: 'start',
      onOk: () => {
        deletePage(pageId);
      }
    });
  }
  emit('close');
}
</script>

<style scoped>
:deep(.context-danger-option) {
  color: #ef4444;
}
:deep(.context-danger-option:hover) {
  background-color: #fef2f2;
}
:deep(.context-disabled-option) {
  color: #cbd5e1;
  cursor: not-allowed;
}
</style>
