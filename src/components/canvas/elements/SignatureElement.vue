<template>
  <div class="w-full">
    <ElementLabel :element="element" />

    <div class="signature-canvas-mock rounded-lg p-1">
      <div v-if="element.options && element.options.length > 0" class="signature-options-container mb-4 flex flex-col gap-2.5">
        <div v-for="(opt, idx) in element.options" :key="idx" class="flex items-start gap-2.5">
          <a-checkbox disabled class="mt-0.5 flex-shrink-0" />
          <EditableText
            :model-value="getOptionLabel(opt, frameLocale)"
            :placeholder="(isTranslationFrame && getOptionLabel(opt, primaryLocale) && !isDefaultClauseLabel(getOptionLabel(opt, primaryLocale))) ? getOptionLabel(opt, primaryLocale) : t('options.declarationPlaceholder', frameLocale, { index: idx + 1 })"
            :element-id="element.id"
            field="option"
            :option-index="idx"
            :allow-empty="true"
            custom-class="option-text signature-declaration-text text-[13px] text-slate-700 leading-5 flex-1"
            @update:model-value="(val) => setOptionLabel(opt, val, frameLocale)"
          />
        </div>
      </div>

      <div v-if="element.showSignPrompt !== false" class="signature-pad-label mb-2 flex items-center gap-1">
        <span v-if="element.required" class="signature-pad-required text-red-500 font-bold">*</span>
        <EditableText
          :model-value="placeholderDisplayValue(getFieldText(element, 'placeholder', frameLocale))"
          :placeholder="(isTranslationFrame && getFieldText(element, 'placeholder', primaryLocale) && !isDefaultInputPlaceholder('signature', getFieldText(element, 'placeholder', primaryLocale))) ? getFieldText(element, 'placeholder', primaryLocale) : t('common.signAreaPlaceholder', frameLocale)"
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
            :model-value="placeholderDisplayValue(getFieldText(element, 'signPlaceholder', frameLocale))"
            :placeholder="(isTranslationFrame && getFieldText(element, 'signPlaceholder', primaryLocale) && !isDefaultInputPlaceholder('signature', getFieldText(element, 'signPlaceholder', primaryLocale))) ? getFieldText(element, 'signPlaceholder', primaryLocale) : t('canvas.signatureArea', frameLocale)"
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
import { t, getFieldText, getOptionLabel, setFieldText, setOptionLabel, isDefaultClauseLabel, isDefaultInputPlaceholder, placeholderDisplayValue } from '@/core/i18n';
import ElementLabel from './ElementLabel.vue';
import EditableText from '@/components/common/EditableText.vue';
import { Eraser, PenLine } from '@lucide/vue';

defineProps<{ element: FormElement }>();

const frameLocale = inject<ComputedRef<string>>('frameLocale', computed(() => primaryLocale.value));
const isTranslationFrame = inject<ComputedRef<boolean>>('isTranslationFrame', computed(() => false));
</script>
