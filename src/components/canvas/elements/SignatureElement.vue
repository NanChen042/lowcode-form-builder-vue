<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div class="signature-canvas-mock bg-white rounded-lg p-1">
      <!-- 声明列表 -->
      <div class="signature-options-container mb-4 flex flex-col gap-2.5">
        <div v-for="(opt, idx) in element.options" :key="idx" class="flex items-start gap-2.5">
          <a-checkbox disabled class="!mt-0.5 flex-shrink-0" />
          <EditableText
            :model-value="getOptionLabel(opt)"
            :placeholder="store.currentLocale === 'en' ? `Declaration item ${idx + 1}` : `声明事项${idx + 1}`"
            :element-id="element.id"
            field="option"
            :option-index="idx"
            custom-class="option-text signature-declaration-text text-[13px] text-slate-700 leading-5 flex-1"
            @update:model-value="(val) => handleOptionUpdate(opt, val)"
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
          @update:model-value="handlePlaceholderUpdate"
        />
      </div>

      <!-- 模拟签名板 -->
      <div class="relative h-32 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-xs select-none">
        <span>{{ t('canvas.signatureArea') }}</span>
        <a-button size="mini" type="secondary" class="!absolute !right-2 !bottom-2" @click.stop>
          {{ t('canvas.clear') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormElement, FormElementOption } from '@/types/schema';
import { store, markDirty } from '@/core/store';
import { t, getFieldText, getOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

function handlePlaceholderUpdate(val: string) {
  if (store.currentLocale === 'en') {
    props.element.placeholder_en = val;
  } else {
    props.element.placeholder = val;
  }
  markDirty();
}

function handleOptionUpdate(opt: FormElementOption, val: string) {
  if (store.currentLocale === 'en') {
    opt.label_en = val;
  } else {
    opt.label = val;
  }
  markDirty();
}
</script>
