<template>
  <div class="system-profile-view w-full flex flex-col gap-3 text-left select-none">
    <div class="w-full">
      <div class="relative overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff]">
        <div class="flex items-center gap-2 mb-2.5">
          <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
          <span class="text-[14px] font-bold text-slate-800 leading-5">
            {{ t('common.notice') }}
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
            {{ t('profile.authorizedRep') }}
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

    <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-[13px] font-bold text-slate-800">
            {{ t('profile.associatedInfo') }}
          </span>
        </div>
      </div>

      <div class="rounded-xl bg-white border border-slate-200/80 p-3 shadow-2xs">
        <div class="text-[11.5px] text-slate-400 font-medium">
          {{ t('profile.associatedEntity') }}
        </div>
        <div class="mt-1">
          <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
            <a-skeleton-line :rows="1" :widths="['35%']" />
          </a-skeleton>
          <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-mono">
            {{ profileType === 'entity' ? 'Algo Global Trading Pte. Ltd.' : 'SG-CORP-CDD-001' }}
          </div>
        </div>

        <div v-if="profileType === 'individual'" class="mt-3 pt-2.5 border-t border-slate-200/50">
          <div class="text-[11.5px] text-slate-400 font-medium mb-1.5">
            {{ t('profile.relationshipType') }}
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.shareholder') }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.director') }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ t('profile.partner') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProfileType } from '@/types/schema';
import { t } from '@/core/i18n';
import { formatInlineText } from '@/utils/alertParser';
import {
  Info,
  Building2,
  User
} from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    profileType?: ProfileType;
    showSkeleton?: boolean;
    isCanvas?: boolean;
  }>(),
  {
    profileType: 'entity',
    showSkeleton: true,
    isCanvas: false
  }
);

const noticeList = computed(() => {
  if (props.profileType === 'individual') {
    return [
      t('profile.notice.ind1'),
      t('profile.notice.common')
    ];
  }
  return [
    t('profile.notice.ent1'),
    t('profile.notice.common')
  ];
});

const mainInfoTitle = computed(() => {
  if (props.profileType === 'client' || props.profileType === 'customer') {
    return t('profile.customerTitle');
  }
  if (props.profileType === 'entity') {
    return t('profile.entityTitle');
  }
  return t('profile.basicTitle');
});

const mainFields = computed(() => {
  if (props.profileType === 'individual') {
    return [
      { label: t('profile.field.name'), value: 'Alexander Tan', skeletonWidth: '45%' },
      { label: t('profile.field.nativeName'), value: '陈建国', skeletonWidth: '20%' },
      { label: t('profile.field.nationality'), value: 'Singaporean', skeletonWidth: '35%' },
      { label: t('profile.field.sgStatus'), value: t('profile.val.sgCitizen'), skeletonWidth: '45%' },
      { label: t('profile.field.nricFin'), value: 'S1234567A', skeletonWidth: '25%' },
      { label: t('profile.field.idType'), value: t('profile.val.idCardPassport'), skeletonWidth: '40%' },
      { label: t('profile.field.idNumber'), value: 'S1234567A', skeletonWidth: '50%' },
      { label: t('profile.field.dob'), value: '1988-06-18', skeletonWidth: '45%' },
      { label: t('profile.field.gender'), value: t('profile.val.male'), skeletonWidth: '15%' },
      { label: t('profile.field.phone'), value: '+65 9123 4567', skeletonWidth: '55%' },
      { label: t('profile.field.email'), value: 'alexander.tan@example.com', skeletonWidth: '65%' },
      { label: t('profile.field.resAddress'), value: '10 Marina Boulevard, #18-01, Singapore 018983', skeletonWidth: '70%' },
      { label: t('profile.field.contactAddress'), value: '10 Marina Boulevard, #18-01, Singapore 018983', skeletonWidth: '70%' }
    ];
  }
  return [
    { label: t('profile.field.entityName'), value: 'Algo Global Trading Pte. Ltd.', skeletonWidth: '50%' },
    { label: t('profile.field.formerName'), value: '-', skeletonWidth: '20%' },
    { label: t('profile.field.jurisdiction'), value: 'Singapore', skeletonWidth: '35%' },
    { label: t('profile.field.entityRegNo'), value: '202412345K', skeletonWidth: '35%' },
    { label: t('profile.field.registeredAddress'), value: '10 Anson Road, #23-07 International Plaza, Singapore 079903', skeletonWidth: '85%' }
  ];
});

const repFields = computed(() => {
  return [
    { label: t('profile.field.repCapacity'), value: t('profile.val.repCapacityVal'), skeletonWidth: '60%' },
    { label: t('profile.field.repName'), value: 'Michael Wong', skeletonWidth: '35%' },
    { label: t('profile.field.nationality'), value: 'Singaporean', skeletonWidth: '45%' },
    { label: t('profile.field.idType'), value: t('profile.val.repIdTypeVal'), skeletonWidth: '55%' },
    { label: t('profile.field.idNumber'), value: 'S7654321B', skeletonWidth: '50%' },
    { label: t('profile.field.phone'), value: '+65 8123 1232', skeletonWidth: '55%' },
    { label: t('profile.field.email'), value: 'compliance@example.com', skeletonWidth: '65%' }
  ];
});
</script>

<style scoped>
:deep(.arco-skeleton-line-row) {
  height: 14px;
  border-radius: 4px;
  background-color: #f1f5f9;
}
</style>
