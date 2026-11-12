<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div class="signature-canvas-mock rounded-lg p-1">
      <div class="signature-options-container mb-4 flex flex-col gap-2.5">
        <div v-for="(opt, idx) in element.options" :key="idx" class="flex items-start gap-2.5">
          <a-checkbox disabled class="mt-0.5 flex-shrink-0" />
          <EditableText
            :model-value="getOptionLabel(opt, frameLocale)"
            :placeholder="getOptionLabel(opt, primaryLocale) || t('options.declarationPlaceholder', frameDictLocale, { index: idx + 1 })"
            :element-id="element.id"
            field="option"
            :option-index="idx"
            :allow-empty="true"
            custom-class="option-text signature-declaration-text text-[13px] text-slate-700 leading-5 flex-1"
            @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
          />
        </div>
      </div>

      <div class="signature-pad-label mb-2 flex items-center gap-1">
        <span v-if="element.required" class="signature-pad-required text-red-500 font-bold">*</span>
        <EditableText
          :model-value="getFieldText(element, 'placeholder', frameLocale)"
          :placeholder="getFieldText(element, 'placeholder', primaryLocale) || (frameDictLocale === 'zh' ? '请在下方指定区域签名' : 'Please sign in the designated area below')"
          :element-id="element.id"
          field="placeholder"
          :allow-empty="true"
          custom-class="signature-pad-text text-xs text-slate-600 font-medium"
          @update:model-value="(val) => setFieldText(element, 'placeholder', val, frameLocale)"
        />
      </div>

      <div class="relative h-28 w-full rounded-[4px] border border-dashed border-slate-300/90 bg-transparent flex items-center justify-center text-slate-400 text-xs select-none">
        <span class="flex items-center gap-1.5 text-slate-400 text-xs font-normal">
          <PenLine class="w-3.5 h-3.5 opacity-60" />
          <EditableText
            :model-value="getFieldText(element, 'signPlaceholder', frameLocale)"
            :placeholder="getFieldText(element, 'signPlaceholder', primaryLocale) || (frameDictLocale === 'zh' ? '请在此处手写签名' : 'Please sign here')"
            :element-id="element.id"
            field="signPlaceholder"
            :allow-empty="true"
            custom-class="signature-area-text text-xs text-slate-500 font-normal inline-block cursor-text hover:text-[#1677ff]"
            @update:model-value="(val) => setFieldText(element, 'signPlaceholder', val, frameLocale)"
          />
        </span>
        <button
          type="button"
          class="absolute right-2 bottom-2 w-6 h-6 flex items-center justify-center rounded bg-transparent border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
          :title="t('common.clearSignature')"
          @click.stop
        >
          <Eraser class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue';
import type { FormElement } from '@/types/schema';
import { primaryLocale } from '@/core/store';
import { t, TRADITIONAL_LOCALE, getFieldText, getOptionLabel, setFieldText, setOptionLabel } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';
import { Eraser, PenLine } from '@lucide/vue';

defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const frameDictLocale = computed<'zh' | 'en'>(() =>
  frameLocale.value === 'zh' || frameLocale.value === TRADITIONAL_LOCALE ? 'zh' : 'en'
);
</script>
