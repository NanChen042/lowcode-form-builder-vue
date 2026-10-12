<template>
  <a-modal :visible="visible" :footer="false" :header="false" :closable="false" :width="'min(95vw, 1400px)'" modal-class="preview-arco-modal" :modal-style="{
    height: '92vh',
    maxHeight: '92vh',
    padding: 0,
    borderRadius: '16px',
    overflow: 'hidden'
  }" :body-style="{
      padding: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }" unmount-on-close :mask-closable="true" @cancel="handleClose">
    <div class="flex h-full w-full flex-col overflow-hidden bg-white rounded-2xl">
      <!-- 头部 -->
      <header class="flex h-16 shrink-0 items-center justify-between border-b border-[#f0f0f0] px-6">
        <div>
          <h2 class="m-0 text-base font-semibold leading-6 text-slate-800">
            {{ mode === 'deploy' ? (store.currentLocale === 'en' ? 'Deploy Schema' : '发布结构') : (store.currentLocale === 'en' ? 'Preview' : '预览') }}
          </h2>
          <p class="m-0 text-xs leading-5 text-slate-400">
            {{ mode === 'deploy' ? (store.currentLocale === 'en' ? 'Form schema is ready for deployment' : '当前表单已生成可保存的结构数据') : (store.currentLocale === 'en' ? 'Experience responsive mobile form interactions and validations' : '在手机设备模拟器中体验表单交互与验证') }}
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <a-button type="secondary" size="small" @click="schemaSidebarVisible = !schemaSidebarVisible">
            <template #icon><Code class="h-3.5 w-3.5" /></template>
            {{ store.currentLocale === 'en' ? 'Schema JSON' : '结构 JSON' }}
          </a-button>

          <a-button type="secondary" size="small" shape="circle" aria-label="关闭" @click="handleClose">
            <template #icon>
              <X class="h-4 w-4" />
            </template>
          </a-button>
        </div>
      </header>

      <!-- 中间主视图 -->
      <div class="relative min-h-0 flex-1 flex overflow-hidden">
        <section class="flex-1 flex items-center justify-center gap-12 overflow-auto bg-[#f8fafc] py-8 transition-all duration-300 relative">
          <!-- 左侧大纲进度条（多页时展示） -->
          <div v-if="pages.length > 1 && !isSubmitted" class="w-[240px] shrink-0 flex flex-col gap-1">
            <div class="mb-2 pb-2 border-b border-slate-200/80 text-xs text-slate-500 font-medium">
              <span>{{ store.currentLocale === 'en' ? 'Form Steps' : '表单步骤列表' }}</span>
            </div>

            <div v-for="(p, i) in pages" :key="p.id" class="preview-step-item cursor-pointer flex items-start gap-3 transition group py-1.5 select-none" :class="i === currentStep ? 'text-[#1677ff]' : 'text-slate-600 hover:text-blue-600'" @click="handleStepClick(i)">
              <div class="flex flex-col items-center">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-all" :class="i === currentStep ? 'border-[#1677ff] font-semibold bg-blue-50 text-[#1677ff] shadow-xs' : 'border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600 group-hover:bg-blue-50/40'">
                  {{ i + 1 }}
                </span>
                <div v-if="i < pages.length - 1" class="w-px h-8 bg-slate-200 my-1"></div>
              </div>
              <div class="pt-0.5 flex flex-col min-w-0">
                <span class="text-sm font-medium leading-5 truncate" :class="{ 'font-semibold': i === currentStep }">
                  {{ getPageText(p, 'title') || (store.currentLocale === 'en' ? `Page ${i + 1}` : `第 ${i + 1} 页`) }}
                </span>
                <span class="text-[11px] text-slate-400">
                  {{ store.currentLocale === 'en' ? `${p.fields?.length || 0} fields` : `${p.fields?.length || 0} 个字段` }}
                </span>
              </div>
            </div>
          </div>

          <!-- 仿真 iPhone 手机机模 -->
          <div class="relative flex h-[812px] max-h-full w-[375px] shrink-0 flex-col rounded-[48px] bg-gradient-to-br from-[#ffffff] via-[#f4f4f5] to-[#d4d4d8] p-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_24px_48px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15)] transition-all duration-300">
            <!-- 黑色边框 -->
            <div class="relative flex flex-1 flex-col overflow-hidden rounded-[45px] bg-[#0a0a0a] p-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
              <!-- 白色主屏显示 -->
              <div class="relative flex flex-1 flex-col overflow-hidden rounded-[39px] bg-white ring-1 ring-black/5">
                <!-- 黑色刘海 -->
                <div class="absolute left-1/2 top-0 z-30 h-[26px] w-[140px] -translate-x-1/2 rounded-b-[20px] bg-[#0a0a0a] shadow-[inset_0_-1px_2px_rgba(255,255,255,0.08)]"></div>

                <!-- 顶部状态栏 -->
                <div class="flex h-12 shrink-0 items-center justify-between px-6 text-[13px] font-semibold text-black z-20">
                  <span>{{ currentTime }}</span>
                  <div class="flex items-center gap-1.5">
                    <BarChart2 class="h-3.5 w-3.5" />
                    <Wifi class="h-3.5 w-3.5" />
                    <BatteryFull class="h-4 w-4" />
                  </div>
                </div>

                <!-- 提交成功状态卡片展示 -->
                <div v-if="isSubmitted" class="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                  <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle class="w-10 h-10" />
                  </div>
                  <h3 class="text-lg font-bold text-slate-800 m-0 mb-1">
                    {{ store.currentLocale === 'en' ? 'Submitted Successfully!' : '表单提交成功！' }}
                  </h3>
                  <p class="text-xs text-slate-400 mb-6 leading-relaxed max-w-[240px]">
                    {{ store.currentLocale === 'en' ? 'All mandatory fields and rules have passed strict validation.' : '所有必填项已严格通过校验，数据格式完全合规。' }}
                  </p>

                  <div class="w-full bg-slate-50 rounded-xl p-3 mb-6 text-left border border-slate-100 space-y-1.5 text-xs">
                    <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {{ store.currentLocale === 'en' ? 'Validation Summary' : '校验结果汇总' }}
                    </div>
                    <div class="flex items-center justify-between text-slate-600">
                      <span>{{ store.currentLocale === 'en' ? 'Total Fields Checked' : '校验字段总数' }}:</span>
                      <span class="font-mono font-medium text-slate-800">{{ totalFieldsCount }}</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-600">
                      <span>{{ store.currentLocale === 'en' ? 'Mandatory Fields' : '必填项目' }}:</span>
                      <span class="font-mono font-medium text-emerald-600">100% 通过</span>
                    </div>
                  </div>

                  <a-button type="primary" class="w-full h-9 rounded-lg" @click="resetForm">
                    {{ store.currentLocale === 'en' ? 'Refill Form' : '重新填写表单' }}
                  </a-button>
                </div>

                <!-- 手机主视图表单内容 -->
                <div v-else ref="phoneContentRef" class="flex-1 overflow-auto px-5 pb-12 pt-2 custom-scrollbar">
                  <!-- 手机端顶栏：品牌 Logo + 企业标题 + 嵌入式 [中 | EN] 语言切换 (对齐 AlgoCandy 规范) -->
                  <div class="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-100">
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

                  <!-- 空页面 -->
                  <div v-if="!currentPage?.fields?.length" class="py-12 text-center text-slate-400 text-sm">
                    {{ store.currentLocale === 'en' ? 'Current page has no fields' : '当前页面暂无字段' }}
                  </div>

                  <!-- 真实 Arco Design 表单结构 -->
                  <form class="w-full flex flex-col" @submit.prevent>
                    <!-- 将所有页面常驻在 DOM 中，通过 v-show 进行步骤切换，杜绝跨步切换时测试数据丢失 -->
                    <div v-for="(page, stepIdx) in pages" :key="page.id" v-show="stepIdx === currentStep" class="w-full flex flex-col">
                      <!-- 空页面 -->
                      <div v-if="!page.fields?.length" class="py-12 text-center text-slate-400 text-sm">
                        {{ store.currentLocale === 'en' ? 'Current page has no fields' : '当前页面暂无字段' }}
                      </div>

                      <PreviewField v-for="field in page.fields" :key="field.id" :field="field" :form-data="formData" :error="errors[field.key]" @clear-error="clearFieldError" />
                    </div>

                    <!-- 表单底部操作按钮 (下一步 / 提交表单) -->
                    <div class="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-slate-100">
                      <a-button v-if="hasPrev" type="secondary" class="h-9 px-4 rounded-lg text-xs" @click="currentStep--">
                        {{ store.currentLocale === 'en' ? 'Previous' : '上一步' }}
                      </a-button>
                      <div v-else class="flex-1"></div>

                      <a-button v-if="hasNext" type="primary" class="h-9 px-5 rounded-lg text-xs font-medium" @click="handleNextStep">
                        {{ store.currentLocale === 'en' ? 'Next Step' : '下一步' }}
                      </a-button>

                      <a-button v-else type="primary" class="h-9 px-5 rounded-lg text-xs font-semibold bg-[#1677ff]" @click="handleFormSubmit">
                        {{ store.currentLocale === 'en' ? 'Validate Form' : '表单验证' }}
                      </a-button>
                    </div>
                  </form>
                </div>

                <!-- 底部 Home Indicator 横条 -->
                <div class="pointer-events-none absolute bottom-2 left-1/2 h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-slate-300"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧 JSON 侧边栏抽屉 -->
        <SchemaSidebar :visible="schemaSidebarVisible" :schema="schema" @close="schemaSidebarVisible = false" />
      </div>

      <!-- 底部全局操作栏 -->
      <footer class="flex h-14 shrink-0 items-center justify-between border-t border-[#f0f0f0] bg-[#fafafa] px-6 z-10">
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{{ store.currentLocale === 'en' ? 'Live Validator: Active (Singapore +65 default)' : '实时校验引擎已就绪（国际区号默认 +65 新加坡）' }}</span>
        </div>

        <div class="flex items-center gap-3">
          <a-button type="primary" size="small" :loading="isPublishing" @click="handlePublish">
            {{ isPublishing ? (store.currentLocale === 'en' ? 'Publishing...' : '发布中...') : (store.currentLocale === 'en' ? 'Publish Form' : '发布表单') }}
          </a-button>

          <a-button type="secondary" size="small" @click="handleClose">
            {{ store.currentLocale === 'en' ? 'Cancel' : '取消' }}
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
import { getPageText, getFieldText } from '@/core/i18n';
import { FormAPI } from '@/core/api';
import { Message } from '@arco-design/web-vue';
import { parseMultiValue } from '@/utils/helpers';
import { validatePhoneNumber } from '@/registry/components';
import PreviewField from './PreviewField.vue';
import SchemaSidebar from './SchemaSidebar.vue';
import {
  Code,
  X,
  BarChart2,
  Wifi,
  BatteryFull,
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

// 校验单个字段
function validateField(field: FormElement): string | null {
  if (field.type === 'alert') return null;

  const isRequired = field.type === 'signature'
    ? Boolean(field.declarationRequired || field.required)
    : Boolean(field.required);

  const rawVal = formData[field.key];
  const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';

  // 1. 单行文本
  if (field.type === 'input') {
    if (isRequired && !strVal) {
      const name = getFieldText(field, 'label') || (store.currentLocale === 'en' ? 'This field' : '此项');
      return store.currentLocale === 'en' ? `Please enter ${name}` : `请输入${name}`;
    }
    if (strVal && field.inputType === 'number' && isNaN(Number(strVal))) {
      return store.currentLocale === 'en' ? 'Please enter a valid number' : '请输入有效数字';
    }
    return null;
  }

  // 2. 多行文本
  if (field.type === 'textarea') {
    if (isRequired && !strVal) {
      const name = getFieldText(field, 'label') || (store.currentLocale === 'en' ? 'This field' : '此项');
      return store.currentLocale === 'en' ? `Please enter ${name}` : `请输入${name}`;
    }
    return null;
  }

  // 3. 电子邮箱
  if (field.type === 'email') {
    if (isRequired && !strVal) {
      return store.currentLocale === 'en' ? 'Please enter email' : '请输入邮箱';
    }
    if (strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      return store.currentLocale === 'en' ? 'Please enter a valid email' : '请输入有效的邮箱地址';
    }
    return null;
  }

  // 4. 手机号码 (带区号，严格按照全量 244 国电信规则校验)
  if (field.type === 'phone') {
    if (isRequired && !strVal) {
      return store.currentLocale === 'en' ? 'Please enter phone number' : '请输入手机号码';
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
      const res = validatePhoneNumber(countryCode || dialCode, strVal, field.strictPhoneValidation !== false);
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
        return store.currentLocale === 'en' ? 'Please select an option' : '请选择选项';
      }
      if (field.maxSelections && arr.length > field.maxSelections) {
        return store.currentLocale === 'en' ? `Maximum ${field.maxSelections} options allowed` : `最多只能选择 ${field.maxSelections} 项`;
      }
    } else {
      if (isRequired && !strVal) {
        return store.currentLocale === 'en' ? 'Please select an option' : '请选择选项';
      }
    }
    return null;
  }

  // 6. 国家 / 国籍
  if (field.type === 'country' || field.type === 'nationality') {
    if (field.multiple) {
      const arr = parseMultiValue(rawVal);
      if (isRequired && arr.length === 0) {
        return store.currentLocale === 'en' ? 'Please select at least one item' : '请至少选择一项';
      }
      if (field.maxSelections && arr.length > field.maxSelections) {
        return store.currentLocale === 'en' ? `Maximum ${field.maxSelections} items allowed` : `最多只能选择 ${field.maxSelections} 项`;
      }
    } else {
      if (isRequired && !strVal) {
        return store.currentLocale === 'en' ? 'Please select' : '请选择';
      }
    }
    return null;
  }

  // 7. 单选框
  if (field.type === 'radio') {
    if (isRequired && !strVal) {
      return store.currentLocale === 'en' ? 'Please select an option' : '请选择一项';
    }
    return null;
  }

  // 8. 多选框
  if (field.type === 'checkbox') {
    const arr = parseMultiValue(rawVal);
    if (isRequired && arr.length === 0) {
      return store.currentLocale === 'en' ? 'Please select at least one option' : '请至少选择一项';
    }
    if (field.maxSelections && arr.length > field.maxSelections) {
      return store.currentLocale === 'en' ? `Maximum ${field.maxSelections} options allowed` : `最多只能选择 ${field.maxSelections} 项`;
    }
    return null;
  }

  // 9. 日期
  if (field.type === 'date') {
    if (isRequired && !strVal) {
      return store.currentLocale === 'en' ? 'Please select date' : '请选择日期';
    }
    return null;
  }

  // 10. 签名
  if (field.type === 'signature') {
    if (field.declarationRequired && !formData[`${field.key}_declared`]) {
      return store.currentLocale === 'en' ? 'Please confirm declarations' : '请勾选确认声明事项';
    }
    if (isRequired && !strVal) {
      return store.currentLocale === 'en' ? 'Please sign in the designated area' : '请在指定区域完成手写签名';
    }
    return null;
  }

  return null;
}

// 校验整页
function validateCurrentPage(): boolean {
  if (!currentPage.value) return true;

  let hasError = false;
  let firstErrorKey = '';

  for (const field of currentPage.value.fields || []) {
    const errMsg = validateField(field);
    if (errMsg) {
      errors[field.key] = errMsg;
      hasError = true;
      if (!firstErrorKey) firstErrorKey = field.key;
    } else {
      delete errors[field.key];
    }
  }

  if (hasError) {
    Message.error(store.currentLocale === 'en' ? 'Please fill in all required fields' : '请填写所有必填项并修正错误');
    nextTick(() => {
      if (phoneContentRef.value) {
        const errEl = phoneContentRef.value.querySelector('.preview-field-error, .has-error, [data-error="true"]');
        if (errEl) {
          errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
    return false;
  }

  return true;
}

function handleNextStep() {
  if (!validateCurrentPage()) return;
  currentStep.value++;
}

function handleStepClick(stepIdx: number) {
  // 预览模式：左侧大纲支持自由快速切换，方便表单设计者随时免填必填项预览任意页面排版与多语言
  currentStep.value = stepIdx;
}

function handleFormSubmit() {
  if (!validateCurrentPage()) return;
  isSubmitted.value = true;
  Message.success(store.currentLocale === 'en' ? 'Submitted successfully!' : '表单提交成功！');
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

const totalFieldsCount = computed(() => {
  let count = 0;
  for (const p of pages.value) {
    count += (p.fields || []).filter(f => f.type !== 'alert').length;
  }
  return count;
});

const currentLocalizedTitle = computed(() => {
  if (currentPage.value) {
    return getPageText(currentPage.value, 'title') || currentPage.value.title || (store.currentLocale === 'en' ? 'Untitled Page' : '未命名页面');
  }
  return props.schema.meta?.title || (store.currentLocale === 'en' ? 'Untitled Form' : '未命名表单');
});

const formBrandTitle = computed(() => {
  return (
    props.schema.meta?.title ||
    (store.currentLocale === 'en'
      ? 'Beijing Branch of Shanghai Qingmo Information Co., Ltd'
      : '上海青墨信息技术有限公司北京分公司')
  );
});

const currentLocalizedDesc = computed(() => {
  if (currentPage.value) {
    return getPageText(currentPage.value, 'description') || currentPage.value.description || (store.currentLocale === 'en' ? 'No description available' : '暂无描述信息');
  }
  return props.schema.meta?.description || (store.currentLocale === 'en' ? 'No description available' : '暂无描述信息');
});

const hasPrev = computed(() => currentStep.value > 0);
const hasNext = computed(() => currentStep.value < pages.value.length - 1);

async function handlePublish() {
  if (isPublishing.value) return;
  isPublishing.value = true;

  try {
    const res = await FormAPI.publishForm(props.schema);
    if (res.success) {
      Message.success(`表单发布成功！线上地址: ${res.data.url}`);
      emit('close');
    }
  } catch (e: any) {
    Message.error(`发布失败: ${e.message}`);
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
  padding: 0 !important;
}

:deep(.preview-arco-modal .arco-modal-body) {
  padding: 0 !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}
</style>
