<template>
  <div class="system-profile-view w-full flex flex-col gap-3 text-left select-none">
    <!-- 1. 顶部提示区块 (严格采用项目统一提示区块组件的视觉结构规范) -->
    <div class="w-full">
      <div class="relative overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff]">
        <!-- 标题行 -->
        <div class="flex items-center gap-2 mb-2.5">
          <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
          <span class="text-[14px] font-bold text-slate-800 leading-5">
            {{ store.currentLocale === 'en' ? 'Notice' : '提示' }}
          </span>
        </div>

        <!-- 说明列表项 -->
        <div class="space-y-2 text-[13px] leading-5 text-slate-700">
          <p v-for="(item, idx) in noticeList" :key="idx" class="m-0 flex items-start gap-2.5">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#1677ff]"></span>
            <span>{{ store.currentLocale === 'en' ? item.en : item.zh }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 2. 主体基本信息卡片 (公司注册基本信息 / 个人基本资料) -->
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

      <!-- 字段项列表 -->
      <div class="space-y-3">
        <div v-for="(item, idx) in mainFields" :key="idx" class="border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ store.currentLocale === 'en' ? item.label_en : item.label }}
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

    <!-- 3. 授权代表卡片 (机构/实体与客户案例展示) -->
    <div v-if="profileType === 'entity' || profileType === 'client' || profileType === 'customer'" class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3.5">
        <div class="flex items-center gap-2">
          <User class="h-4 w-4 text-[#1677ff]" />
          <span class="text-[13px] font-bold text-slate-800">
            {{ store.currentLocale === 'en' ? 'Authorized Representative' : '授权代表' }}
          </span>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="(item, idx) in repFields" :key="idx" class="border-b border-slate-50 pb-2.5 last:border-none last:pb-0">
          <div class="text-[11.5px] text-slate-400 font-medium">
            {{ store.currentLocale === 'en' ? item.label_en : item.label }}
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

    <!-- 4. 关联信息卡片 (个人与机构对应展示) -->
    <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100/80 pb-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-[13px] font-bold text-slate-800">
            {{ store.currentLocale === 'en' ? 'Associated Information' : '关联信息' }}
          </span>
        </div>
      </div>

      <div class="rounded-lg bg-slate-50/90 border border-slate-100 p-3">
        <div class="text-[11.5px] text-slate-400 font-medium">
          {{ store.currentLocale === 'en' ? 'Associated Entity' : '关联实体' }}
        </div>
        <div class="mt-1">
          <a-skeleton v-if="showSkeleton" :animation="true" class="w-full">
            <a-skeleton-line :rows="1" :widths="['35%']" />
          </a-skeleton>
          <div v-else class="text-[13.5px] font-bold text-slate-900 tracking-tight font-mono">
            {{ profileType === 'entity' ? '1ST' : '3123123' }}
          </div>
        </div>

        <!-- 个人特有：关系类型标签胶囊 (股东 / 董事 / 合伙人) -->
        <div v-if="profileType === 'individual'" class="mt-3 pt-2.5 border-t border-slate-200/50">
          <div class="text-[11.5px] text-slate-400 font-medium mb-1.5">
            {{ store.currentLocale === 'en' ? 'Relationship Type' : '关系类型' }}
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ store.currentLocale === 'en' ? 'Shareholder' : '股东' }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ store.currentLocale === 'en' ? 'Director' : '董事' }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#1677ff] border border-blue-100">
              {{ store.currentLocale === 'en' ? 'Partner' : '合伙人' }}
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
import { store } from '@/core/store';
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

// 顶部提示文案列表 (对齐图1个人与图2机构截图文案)
const noticeList = computed(() => {
  if (props.profileType === 'individual') {
    return [
      {
        zh: '根据合规监管要求，您需要完成KYC问卷填写。',
        en: 'According to regulatory compliance requirements, you need to complete the KYC questionnaire.'
      },
      {
        zh: '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。',
        en: 'Please verify if the following information is accurate. If modification is required, contact your service provider before proceeding.'
      }
    ];
  }
  return [
    {
      zh: '您将作为以下公司的授权代表，完成KYC问卷填写。',
      en: 'You will complete the KYC questionnaire as the authorized representative of the company below.'
    },
    {
      zh: '请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。',
      en: 'Please verify if the following information is accurate. If modification is required, contact your service provider before proceeding.'
    }
  ];
});

// 主体信息卡片标题
const mainInfoTitle = computed(() => {
  if (props.profileType === 'client' || props.profileType === 'customer') {
    return store.currentLocale === 'en' ? 'Customer Registration Information' : '客户母案例注册基本信息';
  }
  if (props.profileType === 'entity') {
    return store.currentLocale === 'en' ? 'Corporate Registration Information' : '公司注册基本信息';
  }
  return store.currentLocale === 'en' ? 'Basic Information' : '基本资料';
});

// 主体信息字段集 (图1 个人 vs 图2 机构严格对齐)
const mainFields = computed(() => {
  if (props.profileType === 'individual') {
    return [
      { label: '姓名', label_en: 'Full Name', value: 'W3123123', skeletonWidth: '45%' },
      { label: '国籍语言姓名', label_en: 'Native Language Name', value: '人', skeletonWidth: '20%' },
      { label: '国籍', label_en: 'Nationality', value: 'Argentine', skeletonWidth: '35%' },
      { label: '新加坡身份类型', label_en: 'Singapore Status', value: '无新加坡身份', skeletonWidth: '45%' },
      { label: 'NRIC/FIN(如适用)', label_en: 'NRIC/FIN (if applicable)', value: '-', skeletonWidth: '25%' },
      { label: '证件类型', label_en: 'ID Document Type', value: '护照 / 其他', skeletonWidth: '40%' },
      { label: '证件号码', label_en: 'ID / Passport Number', value: 'G4054633U', skeletonWidth: '50%' },
      { label: '出生日期', label_en: 'Date of Birth', value: '2026-09-07', skeletonWidth: '45%' },
      { label: '性别', label_en: 'Gender', value: '男', skeletonWidth: '15%' },
      { label: '手机号码', label_en: 'Mobile Phone', value: '+65 81232332', skeletonWidth: '55%' },
      { label: '电子邮箱', label_en: 'Email Address', value: '1159063863@qq.com', skeletonWidth: '65%' },
      { label: '居住地址', label_en: 'Residential Address', value: 'SHANGHAI', skeletonWidth: '40%' },
      { label: '联系地址', label_en: 'Contact Address', value: 'BAOSHANQU', skeletonWidth: '45%' }
    ];
  }
  return [
    { label: '实体名称', label_en: 'Entity Name', value: '1ST', skeletonWidth: '30%' },
    { label: '曾用名(如有)', label_en: 'Former Name (if any)', value: '-', skeletonWidth: '20%' },
    { label: '注册地', label_en: 'Jurisdiction of Incorporation', value: 'Singapore', skeletonWidth: '35%' },
    { label: '实体注册号码', label_en: 'Entity Registration Number', value: '-', skeletonWidth: '25%' },
    { label: '注册地址', label_en: 'Registered Address', value: '10 Anson Road, #23-07 International Plaza, Singapore 079903', skeletonWidth: '85%' }
  ];
});

// 授权代表字段集 (图2 机构特有)
const repFields = computed(() => {
  return [
    { label: '授权代表身份', label_en: 'Capacity / Role', value: '董事 / 高级管理人员', skeletonWidth: '60%' },
    { label: '授权代表姓名', label_en: 'Representative Name', value: '123123', skeletonWidth: '35%' },
    { label: '国籍', label_en: 'Nationality', value: 'Åland Island', skeletonWidth: '45%' },
    { label: '证件类型', label_en: 'ID Document Type', value: 'NRIC(新加坡公民)', skeletonWidth: '55%' },
    { label: '证件号码', label_en: 'ID / Passport Number', value: 'G4054633U', skeletonWidth: '50%' },
    { label: '手机号码', label_en: 'Mobile Phone', value: '+65 81231232', skeletonWidth: '55%' },
    { label: '电子邮箱', label_en: 'Email Address', value: '1159063863@qq.com', skeletonWidth: '65%' }
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
