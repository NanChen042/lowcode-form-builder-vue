<template>
  <a-modal
    :visible="visible"
    :title="t('publish.modalTitle')"
    :width="540"
    :title-align="'start'"
    :footer="!isSuccess"
    draggable
    unmount-on-close
    :mask-closable="!isSubmitting"
    @cancel="handleClose"
  >

    <div v-if="isSuccess" class="py-4 flex flex-col items-center text-center">

      <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 ring-8 ring-emerald-50/60 shrink-0">
        <Check class="w-6 h-6 stroke-[2.5]" />
      </div>


      <h3 class="text-base font-semibold text-slate-800 m-0 mb-1.5">
        {{ t('publish.successTitle') }}
      </h3>

      <!-- 风险评估模式：不展示公网访问链接，提供返回列表与关闭页面入口 -->
      <template v-if="isRisk">
        <p class="text-xs text-slate-500 m-0 mb-5 max-w-[360px] leading-relaxed">
          {{ t('publish.riskSuccessDesc') }}
        </p>

        <div class="w-full flex items-center justify-center gap-3">
          <a-button
            type="primary"
            class="h-9 px-5 rounded-md bg-[#1677ff] flex items-center justify-center gap-1.5 text-xs font-medium flex-1"
            @click="handleBackToFormSetting"
          >
            {{ t('publish.backToRiskSetting') }}
          </a-button>

          <a-button
            class="h-9 px-5 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700 flex-1"
            @click="handleClosePage"
          >
            {{ t('publish.closePage') }}
          </a-button>
        </div>
      </template>

      <!-- 标准/KYC模式：展示公网访问链接与操作按钮 -->
      <template v-else>
        <p class="text-xs text-slate-500 m-0 mb-4 max-w-[360px] leading-relaxed">
          {{ t('publish.successDesc') }}
        </p>

        <div class="w-full space-y-4">
          <div
            class="group flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/90 text-left transition-all hover:border-slate-300"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1 pr-3">
              <Link2 class="w-4 h-4 text-slate-400 shrink-0" />
              <span class="text-xs text-slate-600 font-mono break-all select-all leading-relaxed">
                {{ publishedUrl }}
              </span>
            </div>
            <a
              :href="publishedUrl"
              target="_blank"
              class="text-xs text-[#1677ff] hover:text-blue-700 flex items-center gap-1 font-medium transition-colors no-underline px-2.5 py-1 rounded hover:bg-blue-50 shrink-0"
              :title="t('publish.openPreviewTip')"
            >
              <span>{{ t('publish.openPreview') }}</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>

          <div class="w-full flex items-center justify-center gap-3">
            <a-button
              type="primary"
              class="h-9 px-5 rounded-md bg-[#1677ff] flex items-center justify-center gap-1.5 text-xs font-medium flex-1"
              @click="handleBackToFormSetting"
            >
              {{ t('publish.backToRiskSetting') }}
            </a-button>

            <a-button
              class="h-9 px-5 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700 flex-1"
              @click="handleClosePage"
            >
              {{ t('publish.closePage') }}
            </a-button>
          </div>
        </div>
      </template>
    </div>


    <div v-else class="space-y-3.5 py-1">
      <div class="flex items-center justify-between pb-0.5">
        <p class="text-xs text-slate-500 m-0 leading-relaxed pr-3">
          {{ isRisk ? t('publish.riskModalDesc') : t('publish.modalDesc') }}
        </p>
        <a-radio-group v-if="showLocaleSwitch" v-model="activeLocale" type="button" size="small" class="shrink-0">
          <template v-if="primaryLocale === 'en'">
            <a-radio value="en" class="whitespace-nowrap">English</a-radio>
            <a-radio value="zh" class="whitespace-nowrap">中文</a-radio>
          </template>
          <template v-else>
            <a-radio value="zh" class="whitespace-nowrap">中文</a-radio>
            <a-radio value="en" class="whitespace-nowrap">English</a-radio>
          </template>
        </a-radio-group>
      </div>

      <a-form :model="formModel" layout="vertical">
        <a-form-item
          :label="activeLocale === 'zh' ? t('publish.formName') : t('publish.formNameEn')"
          required
          class="mb-3"
        >
          <a-input
            v-if="activeLocale === 'zh'"
            ref="titleInputZhRef"
            v-model="formModel.titleZh"
            :placeholder="t('publish.formNamePlaceholder')"
            :max-length="50"
            :error="nameError"
            show-word-limit
            allow-clear
            @input="nameError = false"
            @keydown.enter="handleConfirmPublish"
          />
          <a-input
            v-else
            ref="titleInputEnRef"
            v-model="formModel.titleEn"
            :placeholder="t('publish.formNameEnPlaceholder')"
            :max-length="50"
            :error="nameError"
            show-word-limit
            allow-clear
            @input="nameError = false"
            @keydown.enter="handleConfirmPublish"
          />
        </a-form-item>

        <a-form-item
          :label="activeLocale === 'zh' ? t('publish.formDesc') : t('publish.formDescEn')"
          class="mb-3"
        >
          <a-textarea
            v-if="activeLocale === 'zh'"
            v-model="formModel.descZh"
            :placeholder="t('publish.formDescPlaceholder')"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 3, maxRows: 4 }"
            allow-clear
          />
          <a-textarea
            v-else
            v-model="formModel.descEn"
            :placeholder="t('publish.formDescEnPlaceholder')"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 3, maxRows: 4 }"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </div>


    <template #footer>
      <div v-if="!isSuccess" class="flex items-center justify-end gap-2">
        <a-button type="primary" :loading="isSubmitting" class="bg-[#1677ff]" @click="handleConfirmPublish">
          {{ t('publish.confirmPublish') }}
        </a-button>
        <a-button :disabled="isSubmitting" @click="handleClose">
          {{ t('common.cancel') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { store, buildSchema, primaryLocale, establishBaseline, syncUrlParams, isRisk } from '@/core/store';
import { t } from '@/core/i18n';
import { FormAPI } from '@/core/api';
import { Message } from '@arco-design/web-vue';
import { Check, ExternalLink, Link2 } from '@lucide/vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close'): void;
  (e: 'published', data: { url: string }): void;
}>();

const hasZhEnabled = computed(() =>
  primaryLocale.value === 'zh' || (store.meta.enabledLocales || []).includes('zh')
);
const hasEnEnabled = computed(() =>
  primaryLocale.value === 'en' || (store.meta.enabledLocales || []).includes('en')
);
const showLocaleSwitch = computed(() => hasZhEnabled.value && hasEnEnabled.value);

const localPublishLocale = ref<'zh' | 'en'>(primaryLocale.value === 'en' ? 'en' : 'zh');
const activeLocale = computed<'zh' | 'en'>({
  get: () => (showLocaleSwitch.value ? localPublishLocale.value : (primaryLocale.value === 'en' ? 'en' : 'zh')),
  set: (val: 'zh' | 'en') => {
    localPublishLocale.value = val;
  }
});
const formModel = reactive({
  titleZh: '',
  titleEn: '',
  descZh: '',
  descEn: ''
});
const initialTitles = reactive({
  zh: '',
  en: ''
});

const defaultTemplateCodeTitles = [
  'SG_CDD_CUSTOMER', 'SG_CDD_INDIVIDUAL', 'SG_CDD_ENTITY',
  'SG_RISK_CUSTOMER', 'SG_RISK_INDIVIDUAL', 'SG_RISK_ENTITY'
];

const nameError = ref(false);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const publishedUrl = ref('');

const titleInputZhRef = ref<any>(null);
const titleInputEnRef = ref<any>(null);

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

function setMetaField(loc: string, key: 'title' | 'description', val: string) {
  store.meta.i18n[loc] = { ...(store.meta.i18n[loc] || {}), [key]: val };
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      isSuccess.value = false;
      nameError.value = false;
      localPublishLocale.value = primaryLocale.value === 'en' ? 'en' : 'zh';

      let initZh = (store.meta.i18n.zh?.title || '').trim();
      let initEn = (store.meta.i18n.en?.title || '').trim();
      if (!initZh && defaultTemplateCodeTitles.includes(initEn)) {
        initZh = initEn;
      } else if (!initEn && defaultTemplateCodeTitles.includes(initZh)) {
        initEn = initZh;
      }

      formModel.titleZh = initZh;
      formModel.titleEn = initEn;
      initialTitles.zh = initZh;
      initialTitles.en = initEn;

      const defaultMockDescs = [
        '涵盖全部12种低代码组件、属性测试及中英双语国际化验证',
        'Comprehensive test suite covering all 12 form components and attributes',
        '客户母案例专用KYC问卷',
        '客户案例专用KYC问卷',
        'Dedicated KYC questionnaire for customer cases',
        '个人成员专用KYC问卷',
        'Dedicated KYC questionnaire for individual members',
        '实体成员专用KYC问卷',
        'Dedicated KYC questionnaire for entity members',
        '空白画布新建自定义表单',
        'Custom form created from blank canvas',
        '覆盖全量组件完整配置项、多行文本字数/行数、单多选/国家国籍、条件显隐及多语言联动测试',
        'Comprehensive test suite for all form components, multiline row/char limits, selectors, conditional logic, and i18n'
      ];

      const curDescZh = store.meta.i18n.zh?.description || '';
      const curDescEn = store.meta.i18n.en?.description || '';

      if (defaultMockDescs.includes(curDescZh)) setMetaField('zh', 'description', '');
      if (defaultMockDescs.includes(curDescEn)) setMetaField('en', 'description', '');

      formModel.descZh = store.meta.i18n.zh?.description || '';
      formModel.descEn = store.meta.i18n.en?.description || '';

      nextTick(() => {
        if (activeLocale.value === 'zh') {
          titleInputZhRef.value?.focus?.();
        } else {
          titleInputEnRef.value?.focus?.();
        }
      });
    }
  },
  { immediate: true }
);

async function handleConfirmPublish() {
  nameError.value = false;
  let rawZh = formModel.titleZh.trim();
  let rawEn = formModel.titleEn.trim();
  const activeTitle = activeLocale.value === 'zh' ? rawZh : rawEn;
  const fallbackTitle = activeTitle || rawZh || rawEn;

  if (!fallbackTitle) {
    nameError.value = true;
    Message.warning(t('publish.nameRequired'));
    if (activeLocale.value === 'zh') {
      titleInputZhRef.value?.focus?.();
    } else {
      titleInputEnRef.value?.focus?.();
    }
    return;
  }

  // 若只编辑了一侧标题，另一侧留空或仍是未改动的默认模板编码，则双语统一对齐为同一名称；若两侧各自翻译则分别保留
  if (!rawZh && rawEn) {
    rawZh = rawEn;
  } else if (!rawEn && rawZh) {
    rawEn = rawZh;
  } else if (
    rawZh === initialTitles.zh &&
    defaultTemplateCodeTitles.includes(rawZh) &&
    rawEn &&
    rawEn !== initialTitles.en
  ) {
    rawZh = rawEn;
  } else if (
    rawEn === initialTitles.en &&
    defaultTemplateCodeTitles.includes(rawEn) &&
    rawZh &&
    rawZh !== initialTitles.zh
  ) {
    rawEn = rawZh;
  }

  if (hasZhEnabled.value) {
    setMetaField('zh', 'title', rawZh);
    setMetaField('zh', 'description', formModel.descZh.trim());
  }
  if (hasEnEnabled.value) {
    setMetaField('en', 'title', rawEn);
    setMetaField('en', 'description', formModel.descEn.trim());
  }

  const schema = buildSchema();
  isSubmitting.value = true;

  try {
    const res = await FormAPI.publishForm(schema);
    if (res.success) {
      if (res.data?.url) {
        publishedUrl.value = res.data.url;
      }
      isSuccess.value = true;
      const savedId = store.meta.formId || store.meta.serialNo;
      if (savedId) {
        syncUrlParams(savedId);
      }
      establishBaseline();
      const now = new Date();
      store.lastSavedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      emit('published', { url: publishedUrl.value });
    } else {
      const rawMsg = res.message || res.msg || '';
      if (res.code == 409 || rawMsg.includes('重名') || rawMsg.includes('名称已存在') || rawMsg.includes('already exists')) {
        nameError.value = true;
        Message.error(t('publish.nameDuplicate'));
        nextTick(() => {
          if (activeLocale.value === 'zh') {
            titleInputZhRef.value?.focus?.();
          } else {
            titleInputEnRef.value?.focus?.();
          }
        });
      } else {
        Message.error((rawMsg && rawMsg !== 'ERROE') ? rawMsg : t('preview.publishFailed'));
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || t('preview.publishFailed');
    Message.error(errMsg);
  } finally {
    isSubmitting.value = false;
  }
}

function handleBackToFormSetting() {
  const targetUrl = isRisk.value ? '/pc/csp/formsetting?tab=risk' : '/pc/csp/formsetting?tab=kyc';
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.location.href = targetUrl;
      window.opener.focus();
      window.close();
      return;
    }
  } catch (_) {}
  window.location.href = targetUrl;
}

function handleClosePage() {
  try {
    if (window.opener && !window.opener.closed) {
      window.opener.location.reload();
    }
  } catch (_) {}
  window.close();
  setTimeout(() => {
    handleClose();
  }, 300);
}
</script>
