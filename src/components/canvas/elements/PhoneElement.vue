<template>
  <div class="w-full">
    <ElementLabel :element="element" />
    <div class="flex items-center gap-2 w-full pointer-events-none select-none">
      <!-- 独立左侧区号盒子 (对齐 algo 真实视觉：国旗精灵图 + 区号 + 右侧下拉三角) -->
      <div
        class="h-8 px-2.5 min-w-[92px] rounded-md border border-slate-200 bg-white flex items-center justify-between gap-1.5 shadow-xs shrink-0"
      >
        <div class="flex items-center gap-1.5">
          <div class="iti__flag shrink-0" :class="'iti__' + (currentOption.iso2 || 'sg')"></div>
          <span class="text-[13px] font-medium text-slate-800 font-mono tracking-tight">{{ element.dialCode || currentOption.code || '+65' }}</span>
        </div>
        <div class="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-slate-500 shrink-0"></div>
      </div>

      <!-- 独立右侧号码占位盒子 (标准 32px 高度，显示所选国家真实国际规则示范号码) -->
      <div
        class="flex-1 min-w-0 h-8 px-3 rounded-md border border-slate-200 bg-white flex items-center text-[13px] text-slate-400 truncate shadow-xs font-mono"
      >
        {{ exampleNumber }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { getCountryPhoneRule, getCountryExampleNumber } from '@/registry/phoneRules';
import ElementLabel from './ElementLabel.vue';

const props = defineProps<{ element: FormElement }>();

const currentOption = computed(() => {
  return getCountryPhoneRule(props.element.countryCode || props.element.dialCode || 'sg');
});

const exampleNumber = computed(() => {
  return getCountryExampleNumber(props.element.countryCode || props.element.dialCode || 'sg');
});
</script>
