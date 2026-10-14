<template>
  <!-- 全球国家/国籍/区号统一预设清单弹窗 (单一弹窗：分别是国籍、国家、代码、国际区号) -->
  <a-modal
    :visible="visible"
    :title="countryModalTitle"
    width="auto"
    :footer="false"
    draggable
    unmount-on-close
    @cancel="handleClose"
  >
    <div class="w-[600px] max-w-[92vw] space-y-3">
      <!-- 搜索输入框与条数统计 -->
      <div class="flex items-center gap-2">
        <a-input
          v-model="countrySearchKeyword"
          allow-clear
          :placeholder="t('dir.searchPlaceholder')"
          class="flex-1"
        >
          <template #prefix>
            <Search class="w-3.5 h-3.5 text-slate-400" />
          </template>
        </a-input>
        <div class="text-[12px] text-slate-500 whitespace-nowrap px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-md shrink-0 font-medium font-mono">
          {{ filteredUnifiedList.length }} / 244
        </div>
      </div>

      <!-- 企业级标准规整数据表格：4列（国籍、国家、代码、国际区号），中文显示中文，英文显示英文 -->
      <div class="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
        <!-- 表头：国家、国籍、代码、国际区号 -->
        <div
          class="flex items-center px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 tracking-wider select-none"
        >
          <div style="width: 32%;">
            {{ t('dir.country') }}
          </div>
          <div style="width: 30%;">
            {{ t('dir.nationality') }}
          </div>
          <div style="width: 18%;">
            {{ t('dir.code') }}
          </div>
          <div class="text-right" style="width: 20%;">
            {{ t('dir.dialCode') }}
          </div>
        </div>

        <!-- 表体滚动列表 -->
        <div class="max-h-[360px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          <div
            v-for="item in filteredUnifiedList"
            :key="item.iso2"
            class="flex items-center px-3.5 py-2 text-xs transition-colors hover:bg-blue-50/40 select-none group"
          >
            <!-- 列 1: 国家 (带国旗) -->
            <div class="flex items-center gap-2 min-w-0 pr-2" style="width: 32%;">
              <span class="iti__flag shrink-0" :class="'iti__' + item.iso2"></span>
              <span
                class="font-medium text-slate-800 truncate"
                :title="getCountryName(item)"
              >
                {{ getCountryName(item) }}
              </span>
            </div>
            <!-- 列 2: 国籍 -->
            <div
              class="text-slate-600 truncate min-w-0 pr-2"
              style="width: 30%;"
              :title="getNatName(item)"
            >
              {{ getNatName(item) }}
            </div>
            <!-- 列 3: 代码 (ISO-2) -->
            <div class="min-w-0" style="width: 18%;">
              <span class="inline-block px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-600 font-medium uppercase">
                {{ item.iso2 }}
              </span>
            </div>
            <!-- 列 4: 国际区号 -->
            <div class="text-right min-w-0" style="width: 20%;">
              <span class="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-mono text-[11px] font-semibold">
                {{ item.code }}
              </span>
            </div>
          </div>

          <!-- 空态提示 -->
          <div v-if="filteredUnifiedList.length === 0" class="py-12 text-center text-xs text-slate-400">
            {{ t('dir.noMatching') }}
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
        <span>
          {{ t('dir.totalCountPrefix') }} 244 {{ t('dir.totalCountSuffix') }}
        </span>
        <span class="font-mono text-slate-400">244 Total</span>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { store } from '@/core/store';
import { t } from '@/core/i18n';
import { countryPhoneRules } from '@/registry/phoneRules';
import { fullNationalityOptions } from '@/registry/countryList';
import { Search } from '@lucide/vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close'): void;
}>();

const countrySearchKeyword = ref('');

watch(
  () => props.visible,
  (val) => {
    if (val) {
      countrySearchKeyword.value = '';
    }
  }
);

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

function getCountryName(item: { countryEn: string; countryZh: string }) {
  return store.currentLocale === 'en' ? item.countryEn : item.countryZh;
}

function getNatName(item: { natEn: string; natZh: string }) {
  return store.currentLocale === 'en' ? item.natEn : item.natZh;
}

const nationalityMap = computed(() => {
  const map: Record<string, { zh: string; en: string }> = {};
  for (const opt of fullNationalityOptions) {
    map[opt.value.toLowerCase()] = {
      zh: opt.label || '',
      en: opt.label_en || opt.label || ''
    };
  }
  return map;
});

const unifiedDirectoryList = computed(() => {
  return countryPhoneRules.map((c) => {
    const entry = nationalityMap.value[c.iso2.toLowerCase()];
    return {
      iso2: c.iso2,
      code: c.code,
      dialCode: c.dialCode,
      countryZh: c.zh,
      countryEn: c.name,
      natZh: entry ? entry.zh : (c.zh.endsWith('籍') ? c.zh : `${c.zh}籍`),
      natEn: entry ? entry.en : `${c.name} Citizen`
    };
  });
});

const countryModalTitle = computed(() => {
  return `${t('dir.presetList')} (244)`;
});

const filteredUnifiedList = computed(() => {
  const kw = countrySearchKeyword.value.trim().toLowerCase();
  const list = unifiedDirectoryList.value;
  if (!kw) return list;
  return list.filter((item) => {
    return (
      item.natZh.toLowerCase().includes(kw) ||
      item.natEn.toLowerCase().includes(kw) ||
      item.countryZh.toLowerCase().includes(kw) ||
      item.countryEn.toLowerCase().includes(kw) ||
      item.iso2.toLowerCase().includes(kw) ||
      item.code.toLowerCase().includes(kw) ||
      item.dialCode.toLowerCase().includes(kw)
    );
  });
});
</script>
