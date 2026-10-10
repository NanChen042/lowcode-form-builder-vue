<template>
  <a-dropdown
    trigger="click"
    position="br"
    :popup-max-height="false"
    v-model:popup-visible="isDropdownOpen"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[13px] font-normal text-slate-700 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none cursor-pointer"
      :class="[
        size === 'small' ? 'h-7.5' : 'h-8',
        isDropdownOpen ? 'border-[#1677ff] text-[#1677ff] ring-2 ring-blue-500/10' : '',
        customClass
      ]"
    >
      <IconLanguage class="text-[14px] shrink-0" :class="isDropdownOpen ? 'text-[#1677ff]' : 'text-slate-600'" />
      <span class="leading-none">{{ store.currentLocale === 'zh' ? '中文' : 'English' }}</span>
      <IconDown
        class="text-[11px] shrink-0 text-slate-400 transition-transform duration-200"
        :class="{ 'rotate-180 text-[#1677ff]': isDropdownOpen }"
      />
    </button>

    <template #content>
      <div class="py-1 px-1 min-w-[130px] bg-white rounded-lg shadow-lg border border-slate-100/80">
        <!-- English 选项 -->
        <div
          class="flex items-center h-8 px-2.5 rounded-md text-[13px] cursor-pointer transition-colors duration-150 select-none"
          :class="store.currentLocale === 'en' ? 'text-[#1677ff] font-medium bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'"
          @click="setLocale('en')"
        >
          <span class="w-4.5 flex items-center justify-start text-[#1677ff] shrink-0">
            <IconCheck v-if="store.currentLocale === 'en'" class="text-[13px]" />
          </span>
          <span class="ml-0.5">English</span>
        </div>

        <!-- 简体中文 选项 -->
        <div
          class="flex items-center h-8 px-2.5 rounded-md text-[13px] cursor-pointer transition-colors duration-150 select-none"
          :class="store.currentLocale === 'zh' ? 'text-[#1677ff] font-medium bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'"
          @click="setLocale('zh')"
        >
          <span class="w-4.5 flex items-center justify-start text-[#1677ff] shrink-0">
            <IconCheck v-if="store.currentLocale === 'zh'" class="text-[13px]" />
          </span>
          <span class="ml-0.5">简体中文</span>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { store } from '@/core/store';
import type { Locale } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';
import { IconLanguage, IconDown, IconCheck } from '@arco-design/web-vue/es/icon';

withDefaults(
  defineProps<{
    size?: 'small' | 'medium';
    customClass?: string;
  }>(),
  {
    size: 'small',
    customClass: ''
  }
);

const emit = defineEmits<{
  (e: 'change', locale: Locale): void;
}>();

const isDropdownOpen = ref(false);

function setLocale(loc: Locale) {
  isDropdownOpen.value = false;
  if (store.currentLocale === loc) return;
  store.currentLocale = loc;
  emit('change', loc);
  Message.info({
    content: loc === 'zh' ? '已切换至简体中文' : 'Switched to English',
    duration: 1500
  });
}
</script>
