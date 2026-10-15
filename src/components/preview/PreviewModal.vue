<template>
  <a-modal
    :visible="visible"
    :width="'min(1060px, 94vw)'"
    :align-center="true"
    :footer="false"
    :header="false"
    :closable="false"
    draggable
    modal-class="preview-arco-modal"
    :modal-style="{
      padding: 0,
      height: 'min(860px, 92vh)',
      maxHeight: '92vh',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06)'
    }"
    :mask-style="{
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(15, 23, 42, 0.45)'
    }"
    :body-style="{
      padding: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: '8px'
    }"
    unmount-on-close
    :mask-closable="true"
    @cancel="handleClose"
  >
    <div class="flex h-full w-full flex-col overflow-hidden bg-white rounded-[8px]">
      <!-- 头部 -->
      <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-6">
        <div class="flex items-center gap-2.5">
          <h2 class="m-0 text-base font-semibold leading-6 text-slate-800">
            {{ mode === 'deploy' ? t('preview.deploySchema') : t('preview.preview') }}
          </h2>
          <a-tag v-if="schema?.meta?.title || store.meta.title" color="arcoblue" size="small">
            {{ schema?.meta?.title || store.meta.title }}
          </a-tag>
        </div>

        <div class="flex items-center gap-2.5">
          <a-button type="secondary" size="small" @click="schemaSidebarVisible = !schemaSidebarVisible">
            <template #icon><Code class="h-3.5 w-3.5" /></template>
            {{ t('preview.schemaJson') }}
          </a-button>

          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            :title="t('common.close') || '关闭'"
            @click="handleClose"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </header>

      <!-- 中间主视图 -->
      <div class="relative min-h-0 flex-1 flex overflow-hidden">
        <section class="flex-1 flex items-center justify-center gap-12 overflow-hidden bg-[#f8fafc] py-6 transition-all duration-300 relative">
          <!-- 左侧大纲进度条（多页时展示） -->
          <div v-if="pages.length > 1 && !isSubmitted" class="w-[240px] shrink-0 flex flex-col gap-1 max-h-full overflow-y-auto custom-scrollbar">
            <div class="mb-2 pb-2 border-b border-slate-200/80 text-xs text-slate-500 font-medium">
              <span>{{ t('preview.formSteps') }}</span>
            </div>

            <div v-for="(p, i) in pages" :key="p.id" class="preview-step-item cursor-pointer flex items-start gap-3 transition group py-1.5 select-none" :class="i === currentStep ? 'text-[#1677ff]' : 'text-slate-600 hover:text-blue-600'" @click="handleStepClick(i)">
              <div class="flex flex-col items-center">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-mono transition-all" :class="i === currentStep ? 'border-[#1677ff] font-semibold bg-blue-50 text-[#1677ff] shadow-xs' : 'border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600 group-hover:bg-blue-50/40'">
                  {{ getStepNumber(i) }}
                </span>
                <div v-if="i < pages.length - 1" class="w-px h-8 bg-slate-200 my-1"></div>
              </div>
              <div class="pt-0.5 flex flex-col min-w-0">
                <span class="text-sm font-medium leading-5 truncate" :class="{ 'font-semibold': i === currentStep }">
                  {{ p.pageType === 'system_profile' ? `01 · ${t('common.basicInfo')} [${t('common.systemPreset')}]` : getPageTitleDisplay(p, i) }}
                </span>
                <span class="text-[11px] text-slate-400">
                  {{ p.pageType === 'system_profile' ? t('common.prefilledBaseline') : `${p.fields?.length || 0} ${t('common.fieldsUnit')}` }}
                </span>
              </div>
            </div>
          </div>

          <!-- 仿真手机机模 (经典长方形圆角机身，杜绝大圆角椭圆畸变) -->
          <div class="relative flex h-full max-h-[780px] w-[375px] shrink-0 flex-col select-none transition-all duration-200 min-h-0">
            <!-- 手机黑色外框 (精致微圆角 32px，超窄边框) -->
            <div class="relative flex flex-1 flex-col min-h-0 rounded-[32px] bg-slate-900 p-[7px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(15,23,42,0.12)] ring-1 ring-black/40">
              <!-- 纯白主屏显示区域 (内圆角 26px) -->
              <div class="relative flex flex-1 flex-col min-h-0 overflow-hidden rounded-[26px] bg-white">
                <!-- 顶部灵动岛胶囊 (居中简约设计) -->
                <div class="pointer-events-none absolute left-1/2 top-[8px] z-30 flex h-[22px] w-[90px] -translate-x-1/2 items-center justify-center rounded-full bg-black shadow-xs">
                  <div class="h-[7px] w-[7px] rounded-full bg-[#1c1c1e] ring-1 ring-[#2c2c2e]"></div>
                </div>

                <!-- 顶部状态栏 -->
                <div class="flex h-10 shrink-0 items-center justify-between px-6 text-black z-20 select-none">
                  <!-- iOS 状态栏时间 -->
                  <span class="font-semibold text-[13px] tracking-tight leading-none" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;">{{ currentTime }}</span>
                  
                  <!-- iOS 状态栏图标组合 (信号 + Wi-Fi + 电池) -->
                  <div class="flex items-center gap-[6px]">
                    <!-- 蜂窝网络信号 -->
                    <svg class="w-[16px] h-[10px] text-black shrink-0" viewBox="0 0 18 12" fill="currentColor">
                      <rect x="0.5" y="8" width="3" height="4" rx="1" />
                      <rect x="5.1" y="5.3" width="3" height="6.7" rx="1" />
                      <rect x="9.7" y="2.6" width="3" height="9.4" rx="1" />
                      <rect x="14.3" y="0" width="3" height="12" rx="1" />
                    </svg>

                    <!-- Wi-Fi -->
                    <svg class="w-[15px] h-[10.5px] text-black shrink-0" viewBox="0 0 16 12" fill="none">
                      <path d="M 1.2 4.2 A 9.8 9.8 0 0 1 14.8 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <path d="M 3.8 6.9 A 6.2 6.2 0 0 1 12.2 6.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <path d="M 6.4 9.5 A 2.8 2.8 0 0 1 9.6 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <circle cx="8" cy="11.4" r="0.75" fill="currentColor" />
                    </svg>

                    <!-- 电池 -->
                    <svg class="w-[23px] h-[11px] text-black shrink-0" viewBox="0 0 25 12" fill="none">
                      <rect x="0.6" y="0.6" width="20.8" height="10.8" rx="3.5" stroke="currentColor" stroke-width="1.2" />
                      <path d="M 22.8 4.3 C 23.5 4.3 23.8 4.7 23.8 5.3 V 6.7 C 23.8 7.3 23.5 7.7 22.8 7.7" fill="currentColor" />
                      <rect x="2.4" y="2.4" width="17.2" height="7.2" rx="2" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <!-- 提交成功状态卡片展示 -->
                <div v-if="isSubmitted" class="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-6 text-center animate-fade-in custom-scrollbar">
                  <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle class="w-10 h-10" />
                  </div>
                  <h3 class="text-lg font-bold text-slate-800 m-0 mb-1">
                    {{ t('preview.submitSuccess') }}
                  </h3>
                  <p class="text-xs text-slate-400 mb-6 leading-relaxed max-w-[240px]">
                    {{ t('preview.submitSuccessDesc') }}
                  </p>

                  <div class="w-full bg-emerald-50/30 rounded-xl p-3 mb-6 text-left border border-emerald-100/80 space-y-1.5 text-xs">
                    <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {{ t('preview.validationSummary') }}
                    </div>
                    <div class="flex items-center justify-between text-slate-600">
                      <span>{{ t('preview.totalFieldsChecked') }}:</span>
                      <span class="font-mono font-medium text-slate-800">{{ totalFieldsCount }}</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-600">
                      <span>{{ t('preview.mandatoryFields') }}:</span>
                      <span class="font-mono font-medium text-emerald-600">100% {{ t('common.passed') }}</span>
                    </div>
                  </div>

                  <a-button type="primary" class="w-full h-9 rounded-lg" @click="resetForm">
                    {{ t('preview.refillForm') }}
                  </a-button>
                </div>

                <!-- 手机主视图表单内容 -->
                <div v-else class="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <!-- 手机端顶栏：品牌 Logo + 企业标题 + 嵌入式 [中 | EN] 语言切换 (对齐 AlgoCandy 规范，固定不随滚动条滚动) -->
                  <div class="shrink-0 px-5 pt-1 pb-2.5 border-b border-slate-100 bg-white z-20 flex items-center justify-between">
                    <div class="flex items-center gap-2 min-w-0 pr-2">
                      <img :src="logoUrl" alt="AlgoCandy" class="w-6 h-auto shrink-0 object-contain" />
                      <span class="text-xs font-semibold text-slate-800 truncate leading-snug">
                        {{ formBrandTitle }}
                      </span>
                    </div>

                    <!-- 嵌入手机内的双语切换胶囊 -->
                    <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shrink-0 select-none">
                      <button type="button" class="px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer" :class="store.currentLocale === 'zh' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'" @click="store.currentLocale = 'zh'">
                        中
                      </button>
                      <button type="button" class="px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer" :class="store.currentLocale === 'en' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'" @click="store.currentLocale = 'en'">
                        EN
                      </button>
                    </div>
                  </div>

                  <!-- 手机主视图可滚动内容 -->
                  <div ref="phoneContentRef" class="flex-1 min-h-0 overflow-y-auto px-5 pb-14 pt-2 custom-scrollbar">
                    <!-- 步骤与进度条 (对齐 AlgoCandy 样式) -->
                    <div class="flex items-center justify-between mt-2 mb-3">
                      <h3 class="m-0 text-base font-bold text-slate-900 tracking-tight">
                        {{ currentLocalizedTitle }}
                      </h3>
                      <div v-if="pages.length > 1" class="flex items-center gap-2">
                        <div class="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div class="h-full bg-blue-600 rounded-full transition-all duration-300" :style="{ width: `${((currentStep + 1) / pages.length) * 100}%` }"></div>
                        </div>
                        <span class="text-xs font-medium text-slate-400 font-mono">
                          {{ currentStep + 1 }} / {{ pages.length }}
                        </span>
                      </div>
                    </div>

                    <p v-if="currentLocalizedDesc" class="mb-4 text-xs text-slate-500 leading-relaxed">
                      {{ currentLocalizedDesc }}
                    </p>

                    <!-- 系统预设基础资料页 (无表单验证，直接渲染结构化卡片与骨架屏) -->
                    <div v-if="currentPage?.pageType === 'system_profile'" class="w-full flex flex-col">
                      <SystemProfileView
                        :profile-type="currentPage.profileType || schema?.meta?.profileType || 'customer'"
                        :show-skeleton="currentPage.showSkeleton !== false"
                        :is-canvas="false"
                      />

                      <!-- 底部操作按钮：确认 & 下一步 (无任何验证阻断，直接进入下一步！) -->
                      <div class="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-slate-100">
                        <a-button v-if="hasPrev" type="secondary" class="h-9 px-4 rounded-lg text-xs" @click="currentStep--">
                          {{ t('common.prev') }}
                        </a-button>
                        <div v-else class="flex-1"></div>

                        <a-button type="primary" class="h-9 px-6 rounded-lg text-xs font-semibold bg-[#1677ff]" @click="handleProfileNext">
                          {{ t('common.confirmNext') }}
                        </a-button>
                      </div>
                    </div>

                    <!-- 真实 Arco Design 表单结构 (禁用浏览器原生冒泡提示，采用统一美观校验反馈) -->
                    <form v-else class="w-full flex flex-col" novalidate @submit.prevent>
                      <!-- 空页面 -->
                      <div v-if="!currentPage?.fields?.length" class="py-12 text-center text-slate-400 text-sm">
                        {{ t('preview.noFields') }}
                      </div>

                      <!-- 将所有页面常驻在 DOM 中，通过 v-show 进行步骤切换，杜绝跨步切换时测试数据丢失 -->
                      <div v-for="(page, stepIdx) in pages" :key="page.id" v-show="stepIdx === currentStep && page.pageType !== 'system_profile'" class="w-full flex flex-col">
                        <PreviewField v-for="field in page.fields" :key="field.id" :field="field" :all-fields="page.fields" :form-data="formData" :error="errors[field.key]" :errors="errors" @clear-error="clearFieldError" />
                      </div>

                      <!-- 表单底部操作按钮 (下一步 / 提交表单) -->
                      <div class="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-slate-100">
                        <a-button v-if="hasPrev" type="secondary" class="h-9 px-4 rounded-lg text-xs" @click="currentStep--">
                          {{ t('common.prev') }}
                        </a-button>
                        <div v-else class="flex-1"></div>

                        <a-button v-if="hasNext" type="primary" class="h-9 px-5 rounded-lg text-xs font-medium" @click="handleNextStep">
                          {{ t('common.nextStep') }}
                        </a-button>

                        <a-button v-else type="primary" class="h-9 px-5 rounded-lg text-xs font-semibold bg-[#1677ff]" @click="handleFormSubmit">
                          {{ t('preview.validateForm') }}
                        </a-button>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- 底部 Home Indicator 触控横条 -->
                <div class="pointer-events-none absolute bottom-[6px] left-1/2 -translate-x-1/2 h-[4px] w-[110px] rounded-full bg-black/75 z-30"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧 JSON 侧边栏抽屉 -->
        <SchemaSidebar :visible="schemaSidebarVisible" :schema="schema" @close="schemaSidebarVisible = false" />
      </div>

      <!-- 底部全局操作栏 (移除多余状态文案) -->
      <footer class="flex h-14 shrink-0 items-center justify-end border-t border-[#f0f0f0] bg-[#fafafa] px-6 z-10">
        <div class="flex items-center gap-3">
          <a-button type="primary" size="small" :loading="isPublishing" @click="handlePublish">
            {{ isPublishing ? t('preview.publishing') : t('preview.publishForm') }}
          </a-button>

          <a-button type="secondary" size="small" @click="handleClose">
            {{ t('common.cancel') }}
          </a-button>
        </div>
      </footer>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch, nextTick } from 'vue';
import type { FormSchema, FormElement } from '@/types/schema';
import { store } from '@/core/store';
import { t, getLocalizedPageText, getFieldValidationMessage } from '@/core/i18n';
import { FormAPI } from '@/core/api';
import { Message } from '@arco-design/web-vue';
import { parseMultiValue } from '@/utils/helpers';
import { validatePhoneNumber } from '@/registry/components';
import PreviewField from './PreviewField.vue';
import SchemaSidebar from './SchemaSidebar.vue';
import SystemProfileView from '@/components/common/SystemProfileView.vue';
import {
  Code,
  X,
  CheckCircle
} from '@lucide/vue';

const props = defineProps<{
  visible: boolean;
  schema: FormSchema;
  mode?: 'preview' | 'deploy';
}>();

const logoUrl = `${import.meta.env.BASE_URL}img/algocandy-logo.png`;

const emit = defineEmits(['close']);

function handleClose() {
  emit('close');
}

const currentStep = ref(0);
const schemaSidebarVisible = ref(false);
const isPublishing = ref(false);
const isSubmitted = ref(false);
const formData = reactive<Record<string, any>>({});
const errors = reactive<Record<string, string>>({});
const phoneContentRef = ref<HTMLElement | null>(null);

function clearFieldError(key: string) {
  delete errors[key];
  delete errors[`${key}_declaration`];
  delete errors[`${key}_signature`];
}

function initFormData() {
  for (const key of Object.keys(formData)) {
    delete formData[key];
  }
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }
  isSubmitted.value = false;
  currentStep.value = 0;

  for (const page of props.schema.pages || []) {
    for (const field of page.fields || []) {
      if (field.defaultValue !== undefined && field.defaultValue !== null && field.defaultValue !== '') {
        formData[field.key] = field.defaultValue;
      }
      // 电话组件默认严格使用新加坡区号 '+65'，手机号码本身保持为空无默认值
      if (field.type === 'phone') {
        formData[`${field.key}_areacode`] = field.dialCode || '+65';
        formData[`${field.key}_countryCode`] = field.countryCode || 'sg';
        formData[field.key] = '';
      }
    }
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      initFormData();
    }
  },
  { immediate: true }
);

function isFieldVisibleInForm(field: FormElement): boolean {
  let cur: FormElement | undefined = field;
  const visited = new Set<string>();
  const allFields = pages.value.flatMap(p => p.fields || []);

  while (cur?.dependsOn) {
    const parentKey: string = cur.dependsOn.fieldKey;
    const targetVal: any = cur.dependsOn.value;
    if (visited.has(parentKey)) break;
    visited.add(parentKey);

    const parentVal = formData[parentKey];
    let matches = false;
    if (parentVal === targetVal) {
      matches = true;
    } else if (Array.isArray(parentVal)) {
      matches = parentVal.includes(targetVal);
    } else if (typeof parentVal === 'string' && parentVal) {
      const list = parseMultiValue(parentVal);
      matches = list.includes(targetVal);
    }

    if (!matches) {
      return false;
    }

    cur = allFields.find(f => f.key === parentKey);
  }

  return true;
}

// 校验单个字段
function validateField(field: FormElement): string | null {
  if (field.type === 'alert') return null;

  // 如果设置了联动依赖，且当前依赖未达成（处于隐藏状态），则跳过校验
  if (field.dependsOn && !isFieldVisibleInForm(field)) {
    return null;
  }

  const isRequired = field.type === 'signature'
    ? Boolean(field.declarationRequired || field.required)
    : Boolean(field.required);

  const rawVal = formData[field.key];
  const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';

  // 1. 单行文本
  if (field.type === 'input') {
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    if (strVal && field.inputType === 'number' && isNaN(Number(strVal))) {
      return t('val.validNumber');
    }
    return null;
  }

  // 2. 多行文本
  if (field.type === 'textarea') {
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    return null;
  }

  // 3. 电子邮箱
  if (field.type === 'email') {
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    if (strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      return t('val.validEmail');
    }
    return null;
  }

  // 4. 手机号码 (带区号，严格按照全量 244 国电信规则校验)
  if (field.type === 'phone') {
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    if (strVal) {
      // 优先采用 intlTelInput 内置 Google libphonenumber 的实时校验结论
      if (formData[`${field.key}_valid`] === true) {
        return null;
      }
      if (formData[`${field.key}_valid`] === false && formData[`${field.key}_msg`]) {
        return formData[`${field.key}_msg`];
      }
      // 备用：基于当前选择的国家代码或区号校验 (全量 244 国)
      const countryCode = formData[`${field.key}_countryCode`];
      const dialCode = formData[`${field.key}_areacode`] || field.dialCode || '+65';
      const res = validatePhoneNumber(countryCode || dialCode, strVal, true);
      if (!res.valid) {
        return store.currentLocale === 'en' ? res.message_en : res.message;
      }
    }
    return null;
  }

  // 5. 下拉选择
  if (field.type === 'select') {
    if (field.multiple) {
      const arr = parseMultiValue(rawVal);
      if (isRequired && arr.length === 0) {
        return getFieldValidationMessage(field);
      }
      if (field.maxSelections && arr.length > field.maxSelections) {
        return t('val.maxOptions', undefined, { count: field.maxSelections });
      }
    } else {
      if (isRequired && !strVal) {
        return getFieldValidationMessage(field);
      }
    }
    return null;
  }

  // 6. 国家 / 国籍
  if (field.type === 'country' || field.type === 'nationality') {
    if (field.multiple) {
      const arr = parseMultiValue(rawVal);
      if (isRequired && arr.length === 0) {
        return getFieldValidationMessage(field);
      }
      if (field.maxSelections && arr.length > field.maxSelections) {
        return t('val.maxItems', undefined, { count: field.maxSelections });
      }
    } else {
      if (isRequired && !strVal) {
        return getFieldValidationMessage(field);
      }
    }
    return null;
  }

  // 7. 单选框
  if (field.type === 'radio') {
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    return null;
  }

  // 8. 多选框
  if (field.type === 'checkbox') {
    const arr = parseMultiValue(rawVal);
    if (isRequired && arr.length === 0) {
      return getFieldValidationMessage(field);
    }
    if (field.maxSelections && arr.length > field.maxSelections) {
      return t('val.maxOptions', undefined, { count: field.maxSelections });
    }
    return null;
  }

  // 9. 日期
  if (field.type === 'date') {
    if (field.dateMode !== 'range' && field.enableLongTerm && formData[`${field.key}_isLongTerm`]) {
      return null;
    }
    if (isRequired && !strVal) {
      return getFieldValidationMessage(field);
    }
    return null;
  }

  // 10. 签名
  if (field.type === 'signature') {
    let hasSigErr = false;
    if (field.declarationRequired && !formData[`${field.key}_declared`]) {
      const decMsg = getFieldValidationMessage(field, 'declaration', store.currentLocale);
      errors[`${field.key}_declaration`] = decMsg;
      hasSigErr = true;
    } else {
      delete errors[`${field.key}_declaration`];
    }
    if (field.required && !strVal) {
      const sigMsg = getFieldValidationMessage(field, 'signature', store.currentLocale);
      errors[`${field.key}_signature`] = sigMsg;
      hasSigErr = true;
    } else {
      delete errors[`${field.key}_signature`];
    }
    if (hasSigErr) {
      return errors[`${field.key}_declaration`] || errors[`${field.key}_signature`];
    }
    return null;
  }

  return null;
}

// 校验整页
function validateCurrentPage(): boolean {
  if (!currentPage.value) return true;
  // 系统预设基础资料页：不做任何表单验证，直接放行
  if (currentPage.value.pageType === 'system_profile') return true;

  let hasError = false;

  for (const field of currentPage.value.fields || []) {
    const errMsg = validateField(field);
    if (errMsg) {
      errors[field.key] = errMsg;
      hasError = true;
    } else {
      delete errors[field.key];
    }
  }

  if (hasError) {
    Message.error(t('preview.fillRequiredFields'));
    nextTick(() => {
      if (phoneContentRef.value) {
        const errEl = phoneContentRef.value.querySelector('.has-error, [data-error="true"], .arco-input-error, .arco-textarea-error, .arco-select-view-error, .arco-picker-error');
        if (errEl) {
          errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
    return false;
  }

  return true;
}

function handleProfileNext() {
  // 第一页基础资料页：完全不做表单验证，直接流转至下一页
  currentStep.value++;
  nextTick(() => {
    if (phoneContentRef.value) {
      phoneContentRef.value.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function handleNextStep() {
  if (!validateCurrentPage()) return;
  currentStep.value++;
}

function handleStepClick(stepIdx: number) {
  // 预览模式：左侧大纲支持自由快速切换，方便表单设计者随时免填必填项预览任意页面排版与多语言
  for (const key of Object.keys(errors)) {
    delete errors[key];
  }
  currentStep.value = stepIdx;
}

function handleFormSubmit() {
  if (!validateCurrentPage()) return;
  isSubmitted.value = true;
  Message.success(t('preview.submitSuccess'));
}

function resetForm() {
  initFormData();
}

// 实时时钟
const currentTime = ref('9:41');
let timer: any = null;

function updateTime() {
  const d = new Date();
  currentTime.value = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const pages = computed(() => props.schema.pages || []);
const currentPage = computed(() => pages.value[currentStep.value] || null);

function getStepNumber(idx: number): string {
  return String(idx + 1).padStart(2, '0');
}

function getPageTitleDisplay(p: any, idx: number): string {
  const stepNo = getStepNumber(idx);
  const rawTitle = getLocalizedPageText(p, 'title') || (p.pageType === 'system_profile' ? t('common.basicInfo') : t('common.untitledPage'));
  if (rawTitle.startsWith(stepNo) || /^\d{2}\s*·/.test(rawTitle)) {
    return rawTitle;
  }
  return `${stepNo} · ${rawTitle}`;
}

const totalFieldsCount = computed(() => {
  let count = 0;
  for (const p of pages.value) {
    count += (p.fields || []).filter(f => f.type !== 'alert').length;
  }
  return count;
});

const currentLocalizedTitle = computed(() => {
  if (currentPage.value) {
    return getLocalizedPageText(currentPage.value, 'title') || (currentPage.value.pageType === 'system_profile' ? t('common.basicInfo') : t('common.untitledPage'));
  }
  return props.schema.meta?.title || t('header.untitledForm');
});

const formBrandTitle = computed(() => {
  return props.schema.meta?.title || t('preview.defaultCompanyTitle');
});

const currentLocalizedDesc = computed(() => {
  if (currentPage.value) {
    const desc = getLocalizedPageText(currentPage.value, 'description');
    return desc && desc.trim() ? desc.trim() : '';
  }
  const metaDesc = props.schema.meta?.description;
  return metaDesc && metaDesc.trim() ? metaDesc.trim() : '';
});

const hasPrev = computed(() => currentStep.value > 0);
const hasNext = computed(() => currentStep.value < pages.value.length - 1);

async function handlePublish() {
  if (isPublishing.value) return;
  isPublishing.value = true;

  try {
    const res = await FormAPI.publishForm(props.schema);
    if (res.success) {
      Message.success(`${t('preview.publishSuccess')} URL: ${res.data.url}`);
      emit('close');
    }
  } catch (e: any) {
    Message.error(`${t('preview.publishFailed')}: ${e?.message || t('common.unknownError')}`);
  } finally {
    isPublishing.value = false;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

:deep(.preview-arco-modal .arco-modal) {
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

:deep(.preview-arco-modal .arco-modal-body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
}
</style>
