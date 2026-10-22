<template>
  <a-modal
    :visible="visible"
    :title="t('publish.modalTitle')"
    :width="500"
    :title-align="'start'"
    :footer="!isSuccess"
    draggable
    unmount-on-close
    :mask-closable="!isSubmitting"
    @cancel="handleClose"
  >
    <!-- 发布成功视图 -->
    <div v-if="isSuccess" class="py-4 flex flex-col items-center text-center">
      <!-- 成功徽标 -->
      <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 ring-8 ring-emerald-50/60 shrink-0">
        <Check class="w-6 h-6 stroke-[2.5]" />
      </div>

      <!-- 成功标题与说明 -->
      <h3 class="text-base font-semibold text-slate-800 m-0 mb-1.5">
        {{ t('publish.successTitle') }}
      </h3>
      <p class="text-xs text-slate-500 m-0 mb-4 max-w-[340px] leading-relaxed">
        {{ t('publish.successDesc') }}
      </p>

      <!-- 链接展示卡片与操作：可直接点击打开预览，也可一键复制 -->
      <div class="w-full space-y-3">
        <!-- 真正可点击的链接条：点击直接新窗口打开 -->
        <a
          :href="publishedUrl"
          target="_blank"
          class="group flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 transition-all text-left no-underline cursor-pointer"
          :title="t('publish.openPreviewTip')"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1 pr-3">
            <Link2 class="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />
            <span class="text-xs text-slate-600 group-hover:text-blue-600 font-mono truncate transition-colors">
              {{ publishedUrl }}
            </span>
          </div>
          <span class="text-xs text-slate-400 group-hover:text-blue-600 flex items-center gap-1 shrink-0 font-medium transition-colors">
            <span>{{ t('publish.openPreview') }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </span>
        </a>

        <!-- 复制链接主按钮 -->
        <a-button
          type="primary"
          long
          class="h-9 rounded-md bg-[#1677ff] flex items-center justify-center gap-1.5 text-xs font-medium"
          @click="handleCopyUrl"
        >
          <template #icon>
            <Check v-if="isCopied" class="w-4 h-4" />
            <Copy v-else class="w-4 h-4" />
          </template>
          {{ isCopied ? t('publish.copied') : t('publish.copyLink') }}
        </a-button>
      </div>
    </div>

    <!-- 正常确认与编辑表单视图 -->
    <div v-else class="space-y-3.5 py-1">
      <div class="flex items-center justify-between pb-0.5">
        <p class="text-xs text-slate-500 m-0 leading-relaxed pr-3">
          {{ t('publish.modalDesc') }}
        </p>
        <a-radio-group v-if="isBilingual" v-model="activeLocale" type="button" size="small" class="shrink-0">
          <a-radio value="zh" class="whitespace-nowrap">中文</a-radio>
          <a-radio value="en" class="whitespace-nowrap">English</a-radio>
        </a-radio-group>
      </div>

      <a-form :model="formModel" layout="vertical">
        <a-form-item
          :label="activeLocale === 'zh' ? t('publish.formName') : t('publish.formNameEn')"
          required
          :validate-status="nameError ? 'error' : undefined"
          :help="nameError"
          class="mb-3"
        >
          <a-input
            v-if="activeLocale === 'zh'"
            ref="titleInputZhRef"
            v-model="formModel.titleZh"
            :placeholder="t('publish.formNamePlaceholder')"
            :max-length="50"
            show-word-limit
            allow-clear
            @input="nameError = ''"
            @keydown.enter="handleConfirmPublish"
          />
          <a-input
            v-else
            ref="titleInputEnRef"
            v-model="formModel.titleEn"
            :placeholder="t('publish.formNameEnPlaceholder')"
            :max-length="50"
            show-word-limit
            allow-clear
            @input="nameError = ''"
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

    <!-- 弹窗底部操作按钮 (发布成功后隐藏 Footer) -->
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
import { store, buildSchema, isBilingual, primaryLocale, establishBaseline } from '@/core/store';
import { t } from '@/core/i18n';
import { FormAPI } from '@/core/api';
import { Message } from '@arco-design/web-vue';
import { Check, Copy, ExternalLink, Link2 } from '@lucide/vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close'): void;
  (e: 'published', data: { url: string }): void;
}>();

const activeLocale = computed<'zh' | 'en'>({
  get: () => (isBilingual.value ? (store.currentLocale === 'en' ? 'en' : 'zh') : primaryLocale.value),
  set: (val: 'zh' | 'en') => {
    store.currentLocale = val;
  }
});
const formModel = reactive({
  titleZh: '',
  titleEn: '',
  descZh: '',
  descEn: ''
});

const nameError = ref('');
const isSubmitting = ref(false);
const isSuccess = ref(false);
const publishedUrl = ref('');
const isCopied = ref(false);

const titleInputZhRef = ref<any>(null);
const titleInputEnRef = ref<any>(null);

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      isSuccess.value = false;
      nameError.value = '';
      isCopied.value = false;

      formModel.titleZh = store.meta.title || '';
      formModel.titleEn = store.meta.title_en || '';

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

      const curDescZh = store.meta.description || '';
      const curDescEn = store.meta.description_en || '';

      if (defaultMockDescs.includes(curDescZh)) store.meta.description = '';
      if (defaultMockDescs.includes(curDescEn)) store.meta.description_en = '';

      formModel.descZh = store.meta.description || '';
      formModel.descEn = store.meta.description_en || '';

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
  nameError.value = '';

  const activeTitle = activeLocale.value === 'zh' ? formModel.titleZh.trim() : formModel.titleEn.trim();
  const fallbackTitle = formModel.titleZh.trim() || formModel.titleEn.trim();

  if (!activeTitle && !fallbackTitle) {
    nameError.value = t('publish.nameRequired');
    if (activeLocale.value === 'zh') {
      titleInputZhRef.value?.focus?.();
    } else {
      titleInputEnRef.value?.focus?.();
    }
    return;
  }

  if (formModel.titleZh.trim()) store.meta.title = formModel.titleZh.trim();
  if (formModel.titleEn.trim()) store.meta.title_en = formModel.titleEn.trim();
  store.meta.description = formModel.descZh.trim();
  store.meta.description_en = formModel.descEn.trim();

  const schema = buildSchema();
  isSubmitting.value = true;

  try {
    const res = await FormAPI.publishForm(schema);
    if (res.success && res.data?.url) {
      publishedUrl.value = res.data.url;
      isSuccess.value = true;
      establishBaseline();
      emit('published', { url: res.data.url });
    } else {
      const errMsg = res.message || res.msg || '发布失败';
      if (errMsg.includes('重名') || errMsg.includes('名称已存在') || errMsg.includes('already exists') || res.code === 409) {
        nameError.value = errMsg;
        nextTick(() => {
          if (activeLocale.value === 'zh') {
            titleInputZhRef.value?.focus?.();
          } else {
            titleInputEnRef.value?.focus?.();
          }
        });
      } else {
        Message.error(errMsg);
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || '发布请求异常，请稍后重试';
    Message.error(errMsg);
  } finally {
    isSubmitting.value = false;
  }
}

async function handleCopyUrl() {
  if (!publishedUrl.value) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(publishedUrl.value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = publishedUrl.value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    isCopied.value = true;
    Message.success(t('publish.copySuccess'));
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (_) {
    Message.error('复制失败，请手动复制链接');
  }
}
</script>
