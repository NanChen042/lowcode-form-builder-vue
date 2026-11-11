<template>
  <div class="space-y-1.5">
    <!-- 1. 标题与状态栏 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <MessageSquare class="w-3.5 h-3.5 text-[#1677ff] shrink-0" />
        <span class="text-[12px] font-medium text-slate-700">
          {{ label }}
        </span>
        <!-- 问号解释：单行说明 + 预留 GIF 动图预览效果容器 -->
        <a-popover position="top" trigger="hover" :content-style="{ padding: '10px 12px', width: '250px', boxSizing: 'border-box' }">
          <button type="button" class="flex items-center justify-center text-slate-400 hover:text-[#1677ff] transition-colors cursor-help">
            <HelpCircle class="w-3.5 h-3.5" />
          </button>
          <template #content>
            <div class="space-y-2 text-left select-none">
              <p class="text-[12px] text-slate-600 leading-normal m-0">
                {{ computedTooltip }}
              </p>
              <!-- 动图预览容器预留：供用户后续贴入实际 gif 动图效果 -->
              <div class="rounded border border-slate-200/90 bg-slate-50 flex items-center justify-center overflow-hidden min-h-[96px] text-slate-400">
                <img
                  v-if="previewGif"
                  :src="previewGif"
                  alt="校验提示动图预览"
                  class="w-full h-auto object-cover block"
                />
                <div v-else class="flex flex-col items-center gap-1 py-3 text-slate-400">
                  <Play class="w-4 h-4 opacity-40" />
                  <span class="text-[11px]">动图效果预览区域</span>
                </div>
              </div>
            </div>
          </template>
        </a-popover>
      </div>

      <!-- 翻译管理模式专属：已翻译状态标识（未自定义时不显示多余文字） -->
      <div v-if="isTranslationMode" class="shrink-0 select-none">
        <span
          v-if="isCustomized"
          class="text-[10.5px] text-[#00b42a] font-medium inline-flex items-center gap-1"
        >
          <CheckCircle2 class="w-3.5 h-3.5 stroke-[2] shrink-0" />
          {{ t('trans.translated') }}
        </span>
      </div>
    </div>

    <!-- 2. 翻译管理模式专属：源语言原文对照卡片（不含兜底字样） -->
    <div
      v-if="isTranslationMode && sourceText"
      class="rounded-[4px] bg-[#f8fafc] border border-slate-200/70 p-2 text-[12px] select-text"
    >
      <div class="text-[10px] font-medium text-slate-400 mb-1 select-none flex items-center justify-between">
        <span>{{ sourceLangName ? `${sourceLangName}原文` : '原文' }}</span>
      </div>
      <div class="text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-text">
        {{ sourceText }}
      </div>
    </div>

    <!-- 3. 所见即所得报错提示展示态（真实表单报错行风格，无外框） -->
    <div
      v-if="!isEditing"
      :id="inputId"
      class="group/err-preview flex items-center justify-between py-1 px-1.5 transition-colors rounded hover:bg-slate-50/80 cursor-pointer"
      :class="{ 'prop-field-focused': isFocused }"
      @click="startEditing"
    >
      <div class="flex items-center gap-1.5 min-w-0 flex-1 pr-1.5">
        <svg
          class="h-3 w-3 text-[#f53f3f] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="text-[12px] font-normal text-[#f53f3f] break-words truncate" :title="displayText">
          {{ displayText }}
        </span>
      </div>

      <div class="flex items-center gap-0.5 shrink-0" @click.stop>
        <button
          type="button"
          class="flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-slate-100 transition-colors cursor-pointer"
          :title="t('prop.customizeError')"
          @click="startEditing"
        >
          <Pencil class="w-3.5 h-3.5 stroke-[2]" />
        </button>
        <button
          v-if="isCustomized"
          type="button"
          class="flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors cursor-pointer"
          :title="t('prop.resetToDefaultError')"
          @click="resetToDefault"
        >
          <RotateCcw class="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>
    </div>

    <!-- 4. 点击铅笔或文本后展开的就地编辑态 -->
    <div v-else class="flex items-center gap-1.5">
      <a-input
        :id="inputId"
        ref="inputRef"
        :model-value="modelValue"
        size="small"
        allow-clear
        class="flex-1 !rounded-[4px]"
        :class="{ 'prop-field-focused': isFocused }"
        :placeholder="defaultText || t('trans.enterTarget')"
        @input="handleInput"
        @focus="emit('focus')"
        @blur="handleBlur"
        @keydown.enter="finishEditing"
      />
      <button
        type="button"
        class="flex items-center justify-center w-7 h-7 rounded bg-[#1677ff] text-white hover:bg-blue-600 transition-colors cursor-pointer shrink-0 shadow-2xs"
        :title="t('modal.confirm')"
        @mousedown.prevent="finishEditing"
      >
        <Check class="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { MessageSquare, HelpCircle, Pencil, RotateCcw, Check, CheckCircle2, Play } from '@lucide/vue';
import { t } from '@/core/i18n';

interface Props {
  // 标题文字
  label: string;
  // 问号 tooltip 内容（可选）
  tooltip?: string;
  // 效果演示动图 URL（可选，未传时展示占位容器）
  previewGif?: string;
  // 当前绑定的自定义报错文案
  modelValue?: string;
  // 当前语言下的默认提示文案
  defaultText: string;
  // DOM id 用于定位和聚焦高亮
  inputId?: string;
  // 是否处于高亮聚焦状态（用于呼吸灯动画）
  isFocused?: boolean;

  // --- 翻译模式专属属性 ---
  // 是否处于多语言翻译对照模式
  isTranslationMode?: boolean;
  // 源语言原生名称（如 简体中文 / English）
  sourceLangName?: string;
  // 源语言校验提示文案原文
  sourceText?: string;
  // 源语言是否采用默认提示
  isSourceDefault?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  previewGif: '',
  modelValue: '',
  inputId: 'prop-custom-error-input',
  isFocused: false,
  isTranslationMode: false,
  sourceLangName: '',
  sourceText: '',
  isSourceDefault: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}>();

const isEditing = ref(false);
const inputRef = ref<any>(null);

const isCustomized = computed(() => Boolean(props.modelValue && props.modelValue.trim()));

const displayText = computed(() => {
  if (isCustomized.value) {
    return props.modelValue!;
  }
  return props.defaultText || t('prop.defaultFallback');
});

const computedTooltip = computed(() => {
  if (props.tooltip) return props.tooltip;
  return t('prop.defaultFallbackTip');
});

watch(
  () => [props.inputId, props.defaultText],
  () => {
    isEditing.value = false;
  }
);

function startEditing() {
  isEditing.value = true;
  emit('focus');
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function finishEditing() {
  isEditing.value = false;
  emit('blur');
}

function handleBlur() {
  isEditing.value = false;
  emit('blur');
}

function handleInput(val: string) {
  emit('update:modelValue', val);
  emit('change', val);
}

function resetToDefault() {
  emit('update:modelValue', '');
  emit('change', '');
  isEditing.value = false;
}
</script>
