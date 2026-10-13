<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div class="signature-canvas-mock bg-white rounded-lg p-1">
      <!-- 声明列表 -->
      <div class="signature-options-container mb-4 flex flex-col gap-2.5">
        <div v-for="(opt, idx) in element.options" :key="idx" class="flex items-start gap-2.5">
          <a-checkbox disabled class="mt-0.5 flex-shrink-0" />
          <EditableText
            :model-value="getOptionLabel(opt)"
            :placeholder="store.currentLocale === 'en' ? `Declaration item ${idx + 1}` : `声明事项${idx + 1}`"
            :element-id="element.id"
            field="option"
            :option-index="idx"
            custom-class="option-text signature-declaration-text text-[13px] text-slate-700 leading-5 flex-1"
            @update:model-value="(val) => setOptionLabel(opt, val)"
          />
        </div>
      </div>

      <!-- 签名区域标题 -->
      <div class="signature-pad-label mb-2 flex items-center gap-1">
        <span v-if="element.required" class="signature-pad-required text-red-500 font-bold">*</span>
        <EditableText
          :model-value="getFieldText(element, 'placeholder') || (store.currentLocale === 'en' ? 'Please sign in the area below:' : '请在下方指定区域签名：')"
          :placeholder="store.currentLocale === 'en' ? 'Please sign in the area below:' : '请在下方指定区域签名：'"
          :element-id="element.id"
          field="placeholder"
          custom-class="signature-pad-text text-xs text-slate-600 font-medium"
          @update:model-value="(val) => setFieldText(element, 'placeholder', val)"
        />
      </div>

      <!-- 模拟签名板 -->
      <div class="relative h-28 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs select-none">
        <span class="flex items-center gap-1.5 text-slate-400 text-xs font-normal">
          <PenLine class="w-3.5 h-3.5 opacity-60" />
          <span>{{ t('canvas.signatureArea') }}</span>
        </span>
        <button
          type="button"
          class="absolute right-2 bottom-2 w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          title="Clear"
          @click.stop
        >
          <Eraser class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormElement } from '@/types/schema';
import { store } from '@/core/store';
import { t, getFieldText, getOptionLabel, setFieldText, setOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';
import { Eraser, PenLine } from '@lucide/vue';

defineProps<{ element: FormElement }>();
</script>
