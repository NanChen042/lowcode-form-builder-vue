<template>
  <div class="system-profile-view w-full flex flex-col gap-3 text-left select-none">
    <div class="w-full">
      <div class="relative overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff]">
        <div class="flex items-center gap-2 mb-2.5">
          <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
          <span class="text-[14px] font-bold text-slate-800 leading-5">
            {{ t('common.notice', effectiveLocale) }}
          </span>
        </div>

        <div class="space-y-2 text-[13px] leading-5 text-slate-700">
          <p v-for="(text, idx) in noticeList" :key="idx" class="m-0 flex items-start gap-1.5">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1677ff]"></span>
            <span class="flex-1 break-words leading-relaxed" v-html="formatInlineText(text)"></span>
          </p>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3.5">
        <div class="flex items-center gap-2">
          <Building2 v-if="profileType === 'entity' || profileType === 'client' || profileType === 'customer'" class="h-4 w-4 text-[#1677ff]" />
          <User v-else class="h-4 w-4 text-[#1677ff]" />
          <span class="text-[13px] font-bold text-slate-800">
            {{ mainInfoTitle }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="(item, idx) in mainFields" :key="idx" class="border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ item.label }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="[item.skeletonWidth || '50%']" />
            </a-skeleton>
            <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-sans">
              {{ item.value || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="profileType === 'entity' || profileType === 'client' || profileType === 'customer'" class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3.5">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4 text-[#1677ff]" />
          <span class="text-[13px] font-bold text-slate-800">
            {{ t('profile.authorizedRep', effectiveLocale) }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="(item, idx) in repFields" :key="idx" class="border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ item.label }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="[item.skeletonWidth || '60%']" />
            </a-skeleton>
            <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-sans">
              {{ item.value || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="profileType === 'individual' || profileType === 'entity'" class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3.5">
        <div class="flex items-center gap-2">
          <Link2 class="h-4 w-4 text-[#1677ff]" />
          <span class="text-[13px] font-bold text-slate-800">
            {{ t('profile.associatedInfo', effectiveLocale) }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div class="border-b border-slate-50 pb-2.5">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ t('profile.associatedEntity', effectiveLocale) }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="['35%']" />
            </a-skeleton>
            <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-mono">
              {{ profileType === 'entity' ? 'Algo Global Trading Pte. Ltd.' : 'SG-CORP-CDD-001' }}
            </div>
          </div>
        </div>

        <div v-if="profileType === 'individual'">
          <div class="text-[11.5px] text-slate-400 font-medium mb-1.5">
            {{ t('profile.relationshipType', effectiveLocale) }}
          </div>
          <div v-if="showSkeleton" class="mt-0.5">
            <a-skeleton :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="['35%']" />
            </a-skeleton>
          </div>
          <div v-else class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.shareholder', effectiveLocale) }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.director', effectiveLocale) }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.partner', effectiveLocale) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 股份与出资信息卡片 (针对 individual / entity 展示) -->
    <div v-if="hasCapital" class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3.5">
        <div class="flex items-center gap-2">
          <CircleDollarSign class="h-4 w-4 text-[#1677ff]" />
          <span class="text-[13px] font-bold text-slate-800">
            {{ t('profile.capitalTitle', effectiveLocale) }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div class="border-b border-slate-50 pb-2.5">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ t('profile.shareClass', effectiveLocale) }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="['45%']" />
            </a-skeleton>
            <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-sans">
              {{ effectiveLocale === 'en' ? 'SGD · Ordinary Shares' : 'SGD · 普通股' }}
            </div>
          </div>
        </div>

        <div class="border-b border-slate-50 pb-2.5">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ t('profile.sharesHeld', effectiveLocale) }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="['35%']" />
            </a-skeleton>
            <div v-else class="flex items-center gap-1.5 text-[13.5px] font-bold text-slate-900 tracking-tight font-sans">
              <span>10,000</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                25.00%
              </span>
            </div>
          </div>
        </div>

        <div>
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ t('profile.paidUpAmount', effectiveLocale) }}
          </div>
          <div class="mt-0.5">
            <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
              <a-skeleton-line :rows="1" :widths="['40%']" />
            </a-skeleton>
            <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-sans">
              10,000.00 SGD
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProfileType } from '@/types/schema';
import { store } from '@/core/store';
import { t, TRADITIONAL_LOCALE } from '@/core/i18n';
import { formatInlineText } from '@/utils/alertParser';
import {
  Info,
  Building2,
  User,
  Link2,
  CircleDollarSign
} from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    profileType?: ProfileType;
    showSkeleton?: boolean;
    isCanvas?: boolean;
    locale?: string;
  }>(),
  {
    profileType: 'entity',
    showSkeleton: true,
    isCanvas: false
  }
);

// 语言规则：支持简体中文 (zh)、繁体中文 (zh-Hant)、英文 (en)、马来语 (ms) 基本资料页默认文案，其余语种回退英文 (en)
const effectiveLocale = computed<string>(() => {
  const raw = props.locale || (props.isCanvas ? store.currentLocale : (store.previewLocale || 'zh'));
  const loc = (raw || 'zh').toLowerCase().trim();
  if (loc === 'zh' || loc === 'zh-cn') return 'zh';
  if (loc === TRADITIONAL_LOCALE.toLowerCase()) return TRADITIONAL_LOCALE;
  if (loc === 'ms' || loc.startsWith('ms-')) return 'ms';
  return 'en';
});

const noticeList = computed(() => {
  if (props.profileType === 'individual') {
    return [
      t('profile.notice.ind1', effectiveLocale.value),
      t('profile.notice.common', effectiveLocale.value)
    ];
  }
  return [
    t('profile.notice.ent1', effectiveLocale.value),
    t('profile.notice.common', effectiveLocale.value)
  ];
});

const mainInfoTitle = computed(() => {
  if (props.profileType === 'client' || props.profileType === 'customer') {
    return t('profile.customerTitle', effectiveLocale.value);
  }
  if (props.profileType === 'entity') {
    return t('profile.entityTitle', effectiveLocale.value);
  }
  return t('profile.basicTitle', effectiveLocale.value);
});

const mainFields = computed(() => {
  const loc = effectiveLocale.value;
  if (props.profileType === 'individual') {
    return [
      { label: t('profile.field.name', loc), value: 'Alexander Tan', skeletonWidth: '45%' },
      { label: t('profile.field.nativeName', loc), value: '陈建国', skeletonWidth: '20%' },
      { label: t('profile.field.nationality', loc), value: loc === 'en' ? 'Singaporean' : '新加坡 / Singapore', skeletonWidth: '35%' },
      { label: t('profile.field.sgStatus', loc), value: t('profile.val.sgCitizen', loc), skeletonWidth: '45%' },
      { label: t('profile.field.nricFin', loc), value: 'S1234567A', skeletonWidth: '25%' },
      { label: t('profile.field.idType', loc), value: t('profile.val.idCardPassport', loc), skeletonWidth: '40%' },
      { label: t('profile.field.idNumber', loc), value: 'S1234567A', skeletonWidth: '50%' },
      { label: t('profile.field.dob', loc), value: '1988-06-18', skeletonWidth: '45%' },
      { label: t('profile.field.gender', loc), value: t('profile.val.male', loc), skeletonWidth: '15%' },
      { label: t('profile.field.phone', loc), value: '+65 9123 4567', skeletonWidth: '55%' },
      { label: t('profile.field.email', loc), value: 'alexander.tan@example.com', skeletonWidth: '65%' },
      { label: t('profile.field.resAddress', loc), value: '10 Marina Boulevard, #18-01, Singapore 018983', skeletonWidth: '70%' },
      { label: t('profile.field.contactAddress', loc), value: '10 Marina Boulevard, #18-01, Singapore 018983', skeletonWidth: '70%' }
    ];
  }
  return [
    { label: t('profile.field.entityName', loc), value: 'Algo Global Trading Pte. Ltd.', skeletonWidth: '50%' },
    { label: t('profile.field.formerName', loc), value: '-', skeletonWidth: '20%' },
    { label: t('profile.field.jurisdiction', loc), value: loc === 'en' ? 'Singapore' : '新加坡 / Singapore', skeletonWidth: '35%' },
    { label: t('profile.field.entityRegNo', loc), value: '202412345K', skeletonWidth: '35%' },
    { label: t('profile.field.registeredAddress', loc), value: '10 Anson Road, #23-07 International Plaza, Singapore 079903', skeletonWidth: '85%' }
  ];
});

const repFields = computed(() => {
  const loc = effectiveLocale.value;
  return [
    { label: t('profile.field.repCapacity', loc), value: t('profile.val.repCapacityVal', loc), skeletonWidth: '60%' },
    { label: t('profile.field.repName', loc), value: 'Michael Wong', skeletonWidth: '35%' },
    { label: t('profile.field.nationality', loc), value: loc === 'en' ? 'Singaporean' : '新加坡 / Singapore', skeletonWidth: '45%' },
    { label: t('profile.field.idType', loc), value: t('profile.val.repIdTypeVal', loc), skeletonWidth: '55%' },
    { label: t('profile.field.idNumber', loc), value: 'S7654321B', skeletonWidth: '50%' },
    { label: t('profile.field.phone', loc), value: '+65 8123 1232', skeletonWidth: '55%' },
    { label: t('profile.field.email', loc), value: 'compliance@example.com', skeletonWidth: '65%' }
  ];
});

const hasCapital = computed(() => {
  return props.profileType === 'individual' || props.profileType === 'entity';
});
</script>

<style scoped>
:deep(.arco-skeleton-line-row) {
  height: 14px;
  border-radius: 4px;
  background-color: #f1f5f9;
}
</style>
