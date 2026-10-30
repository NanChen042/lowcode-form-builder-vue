<template>
  <a-dropdown
    trigger="hover"
    position="br"
    :popup-max-height="false"
    v-model:popup-visible="isDropdownOpen"
    @select="handleSelect"
  >
    <button
      type="button"
      class="flex items-center gap-1.5 px-2 py-1.5 text-[13px] font-normal text-slate-700 hover:text-[#1677ff] transition-colors cursor-pointer select-none border-0 bg-transparent shrink-0 outline-none"
      :class="customClass"
      :title="t('common.switchLanguage')"
    >
      <Languages class="w-[15px] h-[15px] text-slate-700 shrink-0" />
      <span class="leading-none select-none text-slate-700">{{ store.currentLocale === 'zh' ? '中文' : 'English' }}</span>
      <ChevronDown
        class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180 text-[#1677ff]': isDropdownOpen }"
      />
    </button>

    <template #content>
      <a-doption value="en" :active="store.currentLocale === 'en'">
        <template #icon>
          <Check v-if="store.currentLocale === 'en'" class="w-3.5 h-3.5 text-[#1677ff] stroke-[2.5]" />
          <span v-else class="w-3.5 inline-block" />
        </template>
        English
      </a-doption>
      <a-doption value="zh" :active="store.currentLocale === 'zh'">
        <template #icon>
          <Check v-if="store.currentLocale === 'zh'" class="w-3.5 h-3.5 text-[#1677ff] stroke-[2.5]" />
          <span v-else class="w-3.5 inline-block" />
        </template>
        简体中文
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { store } from '@/core/store';
import { t, type Locale } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';
import { Languages, ChevronDown, Check } from '@lucide/vue';

withDefaults(
  defineProps<{
    customClass?: string;
  }>(),
  {
    customClass: ''
  }
);

const emit = defineEmits<{
  (e: 'change', locale: Locale): void;
}>();

const isDropdownOpen = ref(false);

function handleSelect(val: any) {
  const loc = val as Locale;
  isDropdownOpen.value = false;
  if (store.currentLocale === loc) return;
  store.currentLocale = loc;
  emit('change', loc);
  Message.info({
    content: loc === 'zh' ? t('header.switchedZh') : t('header.switchedEn'),
    duration: 1500
  });
}
</script>
