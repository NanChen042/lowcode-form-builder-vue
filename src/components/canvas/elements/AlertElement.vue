<template>
  <div class="w-full" @click="handleCardClick">
    <div
      class="relative overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff]"
    >
      <!-- 标题行 -->
      <div v-if="element.showLabel !== false" class="flex items-center gap-2 mb-2.5">
        <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
        <EditableText
          :model-value="getFieldText(element, 'label')"
          :placeholder="t('common.notice')"
          :element-id="element.id"
          field="label"
          custom-class="label-text text-[14px] font-bold text-slate-800 m-0 leading-5"
          @update:model-value="(val) => setFieldText(element, 'label', val)"
        />
      </div>

      <!-- 1. 解析视图态 (未就地编辑时：高保真呈现蓝色超链接、列表圆点/序号，支持鼠标自由划选文字) -->
      <div
        v-if="!isEditing && segments.length > 0"
        class="alert-canvas-parsed space-y-2 text-[13px] leading-5 text-slate-700 cursor-text select-text"
        @click.stop="startEditContent"
      >
        <template v-for="seg in segments" :key="seg.id">
          <!-- 间距行 -->
          <div v-if="seg.type === 'spacer'" class="h-1.5"></div>

          <!-- 列表项 (圆形圆点 或 数字有序) -->
          <p v-else-if="seg.type === 'bullet'" class="m-0 flex items-start gap-1.5">
            <!-- 数字型 (有序) -->
            <span
              v-if="element.listStyle === 'number'"
              class="shrink-0 font-semibold text-[#1677ff] text-[13px] leading-5 tabular-nums select-none"
            >
              {{ seg.orderIndex }}.
            </span>
            <!-- 圆形 (无序) -->
            <span
              v-else
              class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1677ff]"
            ></span>
            <span class="flex-1 break-words leading-relaxed" v-html="seg.html"></span>
          </p>

          <!-- 普通文本段落 -->
          <p v-else class="m-0 break-words leading-relaxed" v-html="seg.html"></p>
        </template>
      </div>

      <!-- 2. 就地编辑态 (点击后进入：同标题一致，下划线蓝色聚焦、光标划选打字、双向同步属性栏) -->
      <EditableText
        v-else
        ref="editableTextRef"
        :model-value="rawContent"
        :placeholder="t('prop.alertEmptyContentPlaceholder')"
        :element-id="element.id"
        field="content"
        tag="div"
        :allow-empty="true"
        multiline
        custom-class="alert-content-text w-full text-[13px] leading-relaxed text-slate-700 block border-b-2 border-transparent pb-0.5 cursor-text whitespace-pre-wrap font-sans select-text"
        @update:model-value="(val) => setFieldText(element, 'content', val)"
        @blur="handleContentBlur"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { FormElement } from '@/types/schema';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import { store, selectElement, highlightPropertyField } from '@/core/store';
import EditableText from '@/components/common/EditableText.vue';
import { Info } from '@lucide/vue';
import { parseAlertContent } from '@/utils/alertParser';

const props = defineProps<{ element: FormElement }>();

const isEditing = ref(false);
const editableTextRef = ref<any>(null);

const rawContent = computed(() => {
  return getFieldText(props.element, 'content');
});

const segments = computed(() => {
  return parseAlertContent(rawContent.value, props.element.listStyle);
});

// 点击解析视图态，立即切换为与标题一致的就地编辑态并激活聚焦
function startEditContent(e?: MouseEvent) {
  if (e) {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'a' || Boolean(target.closest('a'))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  selectElement(props.element);
  isEditing.value = true;
  store.focusedTarget = { elementId: props.element.id, field: 'content' };
  highlightPropertyField('content');

  nextTick(() => {
    const el = editableTextRef.value?.$el as HTMLElement | null;
    if (el) {
      el.focus();
    }
  });
}

function handleContentBlur() {
  isEditing.value = false;
}

// 点击卡片空白处：选中当前组件并高亮右侧属性栏
function handleCardClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const isEditableLabel = Boolean(target.closest('[contenteditable]'));

  selectElement(props.element);

  if (!isEditableLabel && !isEditing.value) {
    store.focusedTarget = { elementId: props.element.id, field: 'content' };
    highlightPropertyField('content');
  }
}
</script>
