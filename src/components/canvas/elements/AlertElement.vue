<template>
  <div class="w-full">
    <div class="relative overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff]">
      <!-- 标题行 -->
      <div v-if="element.showLabel !== false" class="flex items-center gap-2 mb-2.5">
        <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
        <EditableText
          :model-value="getFieldText(element, 'label')"
          :placeholder="store.currentLocale === 'en' ? 'Notice' : '提示'"
          :element-id="element.id"
          field="label"
          custom-class="label-text text-[14px] font-bold text-slate-800 m-0 leading-5"
          @update:model-value="handleLabelUpdate"
        />
      </div>

      <!-- 说明列表项 -->
      <div class="space-y-2 text-[13px] leading-5 text-slate-700">
        <p v-for="(opt, idx) in element.options" :key="idx" class="m-0 flex items-start gap-2.5">
          <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#1677ff]"></span>
          <EditableText
            :model-value="getOptionLabel(opt)"
            :placeholder="store.currentLocale === 'en' ? 'Notice item' : '提示说明项'"
            :element-id="element.id"
            field="option"
            :option-index="idx"
            custom-class="option-text flex-1"
            @update:model-value="(val) => handleOptionUpdate(opt, val)"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormElement, FormElementOption } from '@/types/schema';
import { store, markDirty } from '@/core/store';
import { getFieldText, getOptionLabel } from '@/core/i18n';
import EditableText from '@/components/common/EditableText.vue';
import { Info } from '@lucide/vue';

const props = defineProps<{ element: FormElement }>();

function handleLabelUpdate(val: string) {
  if (store.currentLocale === 'en') {
    props.element.label_en = val;
  } else {
    props.element.label = val;
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
