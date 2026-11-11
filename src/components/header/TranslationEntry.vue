<template>
  <div class="inline-flex items-center gap-0.5 select-none shrink-0 relative">
    <button
      id="tour-translation-btn"
      type="button"
      class="h-8 px-2.5 rounded-(--radius-control) border text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer select-none"
      :class="isWorkspace
        ? 'bg-white border-[#165DFF]/40 text-[#165DFF] hover:bg-[#f5f9ff] hover:border-[#165DFF]/60'
        : 'bg-transparent border-transparent hover:bg-[#f2f3f5] active:bg-[#e5e6eb] text-slate-700'"
      @click="handleToggle"
    >
      <Languages class="w-[15px] h-[15px] shrink-0 text-[#165DFF]" />

      <span>{{ label }}</span>

      <template v-if="!isWorkspace">
        <!-- 未完成待办：数字角标 -->
        <span
          v-if="missingItemsCount > 0"
          class="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-[4px] bg-amber-500 text-white text-[11px] font-bold inline-flex items-center justify-center leading-none shadow-2xs"
        >
          {{ missingItemsCount }}
        </span>
        <!-- 全部完成：已译完标签 -->
        <template v-else>
          <span class="h-3 w-[1px] bg-slate-200 mx-0.5"></span>
          <span class="px-1.5 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-700 rounded-[4px] leading-none">
            已译完
          </span>
        </template>
      </template>
    </button>

    <a-popover position="bottom" trigger="hover" :content-style="{ padding: '12px 14px', width: '300px', boxSizing: 'border-box' }">
      <button
        type="button"
        aria-label="翻译管理功能说明"
        class="w-6 h-8 rounded-(--radius-control) text-slate-400 hover:text-slate-600 hover:bg-[#f2f3f5] inline-flex items-center justify-center cursor-pointer"
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
            <img :src="guideCover" alt="Video Guide Cover" width="1024" height="576" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block" />
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
import { Languages, HelpCircle, Play } from '@lucide/vue';
import {
  store,
  isBilingual,
  primaryLocale,
  targetLocales,
  openTranslationWorkspace,
  closeTranslationWorkspace
} from '@/core/store';
import { t } from '@/core/i18n';
import { translationStats } from '@/utils/translationHelper';
import guideCoverZh from '@/assets/guide-cover-zh.webp';
import guideCoverEn from '@/assets/guide-cover-en.webp';

const emit = defineEmits<{ (e: 'open-video'): void }>();

const isWorkspace = computed(() => store.workspaceMode === 'translation');

const guideCover = computed(() => (store.currentLocale === 'en' ? guideCoverEn : guideCoverZh));

const label = computed(() => {
  if (isWorkspace.value) return t('trans.exitWorkspace');
  if (isBilingual.value) {
    return t('trans.multilingualWithCount', undefined, { count: targetLocales.value.length + 1 });
  }
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
