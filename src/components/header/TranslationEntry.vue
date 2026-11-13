<template>
  <div class="inline-flex items-center gap-1 select-none shrink-0 relative">
    <button
      id="tour-translation-btn"
      type="button"
      class="h-8 px-3 rounded-(--radius-control) border text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer select-none transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      :class="isWorkspace
        ? 'bg-[#eff6ff] border-[#91caff] text-[#1677ff] hover:bg-[#e0edff] hover:border-[#4096ff] active:bg-[#d0e4ff]'
        : 'bg-white border-[#d9d9d9] text-[#1f2937] hover:border-[#4096ff] hover:text-[#1677ff] hover:bg-[#f8fafc] active:border-[#0958d9] active:bg-[#eff6ff]'"
      @click="handleToggle"
    >
      <Languages class="w-[15px] h-[15px] shrink-0 text-[#1677ff]" />

      <span class="leading-none">{{ label }}</span>

      <template v-if="!isWorkspace">
        <!-- 未完成待办：紧凑橙色数字微章 -->
        <span
          v-if="missingItemsCount > 0"
          class="ml-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-500 text-white text-[11px] font-semibold inline-flex items-center justify-center leading-none shadow-2xs"
          :title="`${missingItemsCount}`"
        >
          {{ missingItemsCount }}
        </span>
        <!-- 全部完成：极简翠绿对勾微徽章 -->
        <span
          v-else-if="isBilingual"
          class="ml-0.5 w-[16px] h-[16px] rounded-full bg-emerald-500/15 text-emerald-600 inline-flex items-center justify-center shrink-0"
          :title="t('trans.allDoneShort')"
        >
          <Check class="w-2.5 h-2.5 stroke-[3]" />
        </span>
      </template>
    </button>

    <a-popover position="bottom" trigger="hover" :content-style="{ padding: '12px 14px', width: '380px', boxSizing: 'border-box' }">
      <button
        type="button"
        :aria-label="t('header.bilingualGuideTitle')"
        class="w-7 h-7 rounded-full text-slate-400 hover:text-[#1677ff] hover:bg-slate-100 active:bg-slate-200/70 inline-flex items-center justify-center cursor-pointer transition-colors"
        :title="t('header.bilingualGuideTitle')"
      >
        <HelpCircle class="w-3.5 h-3.5" />
      </button>
      <template #content>
        <div class="space-y-2.5 antialiased" style="transform: translateZ(0); backface-visibility: hidden;">
          <div class="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
            <Languages class="w-4 h-4 text-blue-500 shrink-0" />
            <span>{{ t('header.bilingualGuideTitle') }}</span>
          </div>
          <p class="text-[12px] text-slate-600 leading-relaxed m-0 break-words">
            {{ t('header.bilingualGuideDesc') }}
          </p>

          <div class="group relative mt-2 rounded-lg overflow-hidden border border-slate-200/90 cursor-pointer shadow-xs transition-all hover:shadow-md hover:border-blue-400 select-none aspect-[16/9] w-full bg-slate-900" @click="emit('open-video')">
            <img :src="guideCover" alt="Video Guide Cover" width="1024" height="576" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block" style="image-rendering: -webkit-optimize-contrast;" />
            <div class="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors pointer-events-none"></div>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-11 h-11 rounded-full bg-white/95 text-[#1677ff] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-200">
                <Play class="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Languages, HelpCircle, Play, Check } from '@lucide/vue';
import {
  store,
  isRisk,
  isBilingual,
  primaryLocale,
  targetLocales,
  openTranslationWorkspace,
  closeTranslationWorkspace
} from '@/core/store';
import { t } from '@/core/i18n';
import { translationStats } from '@/utils/translationHelper';
import guideCoverForm from '@/assets/guide-cover-form.webp';
import guideCoverRisk from '@/assets/guide-cover-risk.webp';

const emit = defineEmits<{ (e: 'open-video'): void }>();

const isWorkspace = computed(() => store.workspaceMode === 'translation');
const guideCover = computed(() => (isRisk.value ? guideCoverRisk : guideCoverForm));

const label = computed(() => {
  if (isWorkspace.value) return t('trans.exitWorkspace');
  return t('trans.addLanguage');
});

const missingItemsCount = computed(() => {
  if (primaryLocale.value === 'zh' && !targetLocales.value.includes('en')) {
    return translationStats.value.total || 1;
  }
  return translationStats.value.untranslatedCount;
});

function handleToggle() {
  if (isWorkspace.value) {
    closeTranslationWorkspace();
  } else {
    openTranslationWorkspace();
  }
}
</script>
