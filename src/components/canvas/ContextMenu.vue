<template>
  <a-dropdown
    :popup-visible="visible"
    position="bl"
    :popup-max-height="false"
    @popup-visible-change="handleVisibleChange"
  >
    <!-- 虚拟锚点定位在鼠标坐标 (x, y) 处，不占空间且不可见 -->
    <div
      class="fixed pointer-events-none w-px h-px opacity-0"
      :style="{ left: `${x}px`, top: `${y}px` }"
    />

    <template #content>
      <!-- 组件操作右键菜单 -->
      <template v-if="targetType === 'element' && targetElementId">
        <a-doption @click="handleDuplicateElement">
          <template #icon>
            <Copy class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Duplicate' : '复制组件' }}</span>
          <template #suffix>
            <span class="text-[10px] text-slate-400 font-mono">Ctrl+D</span>
          </template>
        </a-doption>

        <!-- 快捷多级子菜单：在下方插入组件（复用级联组件菜单） -->
        <ComponentCascadeMenu
          :title="store.currentLocale === 'en' ? 'Insert Below' : '在下方插入组件'"
          value-prefix="elem-insert"
          @select="handleQuickAddComponent"
        />

        <a-divider style="margin: 4px 0" />

        <a-doption class="!text-red-500 hover:!bg-red-50" @click="handleDeleteElement">
          <template #icon>
            <Trash2 class="h-4 w-4 text-red-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Delete Component' : '删除组件' }}</span>
        </a-doption>
      </template>

      <!-- 场景 2：在画板页面内右键（targetType === 'page' && targetPageId） -->
      <template v-else-if="targetType === 'page' && targetPageId">
        <!-- 快捷多级子菜单：添加表单组件 -->
        <ComponentCascadeMenu
          :title="store.currentLocale === 'en' ? 'Add Component' : '添加表单组件'"
          value-prefix="page-insert"
          title-class="font-medium text-slate-800"
          @select="handleQuickAddComponent"
        />

        <a-divider style="margin: 4px 0" />

        <a-doption @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Insert Page After' : '在当前画布后方插入' }}</span>
        </a-doption>

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Reset View' : '重置画布视角' }}</span>
        </a-doption>

        <a-divider style="margin: 4px 0" />

        <a-doption
          :disabled="isTargetFirstPage"
          :class="isTargetFirstPage ? '!text-slate-300 !cursor-not-allowed' : '!text-red-500 hover:!bg-red-50'"
          @click="handleDeletePage"
        >
          <template #icon>
            <Trash2 class="h-4 w-4" :class="isTargetFirstPage ? 'text-slate-300' : 'text-red-500'" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Delete Current Canvas' : '删除当前画布' }}</span>
        </a-doption>
      </template>

      <!-- 场景 3：在空白画布背景上右键（不在任何画板中，不显示“添加表单组件”） -->
      <template v-else>
        <a-doption @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'New Blank Page' : '新建画布页面' }}</span>
        </a-doption>

        <a-divider style="margin: 4px 0" />

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ store.currentLocale === 'en' ? 'Reset View' : '重置画布视角' }}</span>
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
import { Modal } from '@arco-design/web-vue';
import { FilePlus, Expand, Trash2, Copy } from '@lucide/vue';
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

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isTargetFirstPage = computed(() => {
  return props.targetPageId ? store.pages[0]?.id === props.targetPageId : false;
});

function handleVisibleChange(val: boolean) {
  if (!val) {
    emit('close');
  }
}

function handleQuickAddComponent(type: ComponentType) {
  if (props.targetType === 'element' && props.targetElementId) {
    addElement(type, props.targetPageId || undefined);
  } else {
    const targetPageId = props.targetPageId || store.activePageId || (store.pages[0]?.id ?? undefined);
    if (store.selectedType !== 'element') {
      clearSelection();
    }
    addElement(type, targetPageId);
  }
  emit('close');
}

function handleDuplicateElement() {
  if (props.targetElementId) {
    duplicateElement(props.targetElementId);
  }
  emit('close');
}

function handleDeleteElement() {
  if (props.targetElementId) {
    deleteElement(props.targetElementId);
  }
  emit('close');
}

function handleAddPage() {
  addPage(props.targetPageId);
  emit('close');
}

function handleResetView() {
  resetCanvasView();
  emit('close');
}

function handleDeletePage() {
  if (isTargetFirstPage.value) return;
  if (props.targetPageId) {
    const pageId = props.targetPageId;
    Modal.confirm({
      title: store.currentLocale === 'en' ? 'Confirm Delete Canvas' : '确认删除画布',
      content: store.currentLocale === 'en'
        ? 'Are you sure you want to delete this canvas and all its contents? This action cannot be undone.'
        : '确定要删除当前画布及其所有内容吗？此操作不可撤销。',
      okText: store.currentLocale === 'en' ? 'Delete' : '确认删除',
      cancelText: store.currentLocale === 'en' ? 'Cancel' : '取消',
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
