<template>
  <a-config-provider :locale="currentArcoLocale">
    <div class="relative flex h-full w-full flex-col overflow-hidden">
      <!-- 顶部导航栏 (Stitch 通栏流光毛玻璃) -->
      <AppHeader
        @open-preview="openPreview('preview')"
        @open-deploy="openPreview('deploy')"
      />

      <!-- 主工作区：左侧组件库 + 中间无限画布 + 右侧属性面板 -->
      <div class="app-main relative flex min-h-0 flex-1 overflow-hidden">
        <MaterialSidebar
          @open-template-gallery="handleOpenTemplateModal"
          @open-create-canvas="handleOpenCreateCanvas"
          @open-create-form="handleOpenCreateCanvas"
        />

        <InfiniteCanvas
          class="-mt-14"
          @open-template-gallery="handleOpenTemplateModal"
          @open-create-canvas="handleOpenCreateCanvas"
        />

        <PropertyPanel />
      </div>

      <!-- 二次弹窗：新建空白表单画布 (选择业务类型：客户案例/个人案例/实体案例及设置表单名称) -->
      <CreateFormModal
        v-model:visible="createCanvasModalVisible"
        @created="handleFormCreated"
        @close="createCanvasModalVisible = false"
      />

      <!-- 欢迎向导弹窗 (空 URL 时首次进入引导，可点击新建空白唤起二次弹窗，或直接选用模板) -->
      <WelcomeWizardModal
        v-model:visible="welcomeWizardVisible"
        :mandatory="isInitialWizardMandatory"
        @open-blank="handleWizardOpenBlank"
        @selected-template="handleTemplateSelected"
        @close="handleWelcomeWizardClosed"
      />

      <!-- 仿真 iPhone 手机模型表单预览弹窗 -->
      <PreviewModal
        :visible="previewModalVisible"
        :schema="currentPreviewSchema"
        :mode="previewMode"
        @close="previewModalVisible = false"
      />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  store,
  buildSchema,
  loadSchema,
  syncUrlParams
} from '@/core/store';
import { currentArcoLocale } from '@/core/i18n';
import { FormAPI, UserAPI } from '@/core/api';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate,
  blankTemplate,
  createBlankTemplate
} from '@/templates/recommend';
import type { FormSchema, ProfileType } from '@/types/schema';
import { checkAutoStartTour } from '@/utils/useAppTour';

import AppHeader from '@/components/header/AppHeader.vue';
import MaterialSidebar from '@/components/sidebar/MaterialSidebar.vue';
import InfiniteCanvas from '@/components/canvas/InfiniteCanvas.vue';
import PropertyPanel from '@/components/properties/PropertyPanel.vue';
import CreateFormModal from '@/components/sidebar/CreateFormModal.vue';
import WelcomeWizardModal from '@/components/common/WelcomeWizardModal.vue';
import PreviewModal from '@/components/preview/PreviewModal.vue';

const createCanvasModalVisible = ref(false);
const welcomeWizardVisible = ref(false);
const isInitialWizardMandatory = ref(false);
const previewModalVisible = ref(false);
const previewMode = ref<'preview' | 'deploy'>('preview');

// 从侧边栏或画布打开新建空白表单二次弹窗 (支持选择业务类型：客户案例/个人案例/实体案例及设置表单名称)
function handleOpenCreateCanvas() {
  createCanvasModalVisible.value = true;
}

// 打开场景模板选择
function handleOpenTemplateModal() {
  isInitialWizardMandatory.value = false;
  welcomeWizardVisible.value = true;
}

// 从向导弹窗点击“新建空白画布”唤起二次弹窗
function handleWizardOpenBlank() {
  welcomeWizardVisible.value = false;
  createCanvasModalVisible.value = true;
}

// 首次向导或二次弹窗创建表单后，平滑衔接工作区新手漫游引导
function handleTemplateSelected(_tplKey: string) {
  welcomeWizardVisible.value = false;
  setTimeout(() => {
    checkAutoStartTour(true);
  }, 500);
}

function handleFormCreated() {
  createCanvasModalVisible.value = false;
  setTimeout(() => {
    checkAutoStartTour(true);
  }, 500);
}

function handleWelcomeWizardClosed() {
  welcomeWizardVisible.value = false;
  if (store.pages.length > 0) {
    setTimeout(() => {
      checkAutoStartTour(true);
    }, 500);
  }
}
const currentPreviewSchema = ref<FormSchema>({
  schemaVersion: '1.0.0',
  meta: { title: '', description: '' },
  pages: []
});

function openPreview(mode: 'preview' | 'deploy') {
  currentPreviewSchema.value = buildSchema();
  previewMode.value = mode;
  previewModalVisible.value = true;
}

watch(
  () => store.currentLocale,
  loc => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-locale', loc);
    }
  },
  { immediate: true }
);

// 初始化加载模板
onMounted(async () => {
  store.isCanvasLoading = true;
  try {
    localStorage.removeItem('mock_db_schema');
  } catch (_) {}
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = (urlParams.get('id') || '').toLowerCase().trim();
  const tplParam = (urlParams.get('tpl') || '').toLowerCase().trim();
  const typeParam = (urlParams.get('type') || urlParams.get('profileType') || '').toLowerCase().trim();

  // 0. 解析外部系统传入的默认语言环境 (?lang=en / ?locale=en / ?language=zh 或母系统缓存)
  const langParam = (urlParams.get('lang') || urlParams.get('locale') || urlParams.get('language') || '').toLowerCase().trim();
  if (langParam.startsWith('en')) {
    store.currentLocale = 'en';
  } else if (langParam.startsWith('zh')) {
    store.currentLocale = 'zh';
  } else {
    try {
      const storedLang = (localStorage.getItem('algo_lang') || localStorage.getItem('locale') || localStorage.getItem('lang') || '').toLowerCase();
      if (storedLang.startsWith('en')) {
        store.currentLocale = 'en';
      } else if (storedLang.startsWith('zh')) {
        store.currentLocale = 'zh';
      }
    } catch (_) {}
  }

  // 1. 解析外部母系统传入的用户信息与机构信息 (通过 URL 参数、Cookie、本地存储或 postMessage)
  const tokenParam = urlParams.get('token') || urlParams.get('pc_token') || '';
  const nicknameParam = urlParams.get('nickname') || urlParams.get('name') || urlParams.get('username') || '';
  const emailParam = urlParams.get('email') || '';
  const orgIdParam = urlParams.get('org_id') || urlParams.get('sc_org_id') || '';
  const companyParam = urlParams.get('company') || urlParams.get('company_name') || urlParams.get('org_name') || '';

  if (tokenParam) store.user.token = tokenParam;
  if (nicknameParam) store.user.nickname = nicknameParam;
  if (emailParam) store.user.email = emailParam;
  if (orgIdParam) store.org.orgId = parseInt(orgIdParam, 10) || 0;
  if (companyParam) store.org.companyName = companyParam;

  // 尝试从 Cookie / localStorage 读取母系统用户信息兜底
  try {
    const cachedUser = localStorage.getItem('algo_user_info');
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      if (parsed.nickname && !nicknameParam) store.user.nickname = parsed.nickname;
      if (parsed.company_name && !companyParam) store.org.companyName = parsed.company_name;
      if (parsed.org_id && !orgIdParam) store.org.orgId = parsed.org_id;
    }
  } catch (_) {}

  // 异步向母系统发送鉴权请求获取当前登录用户与机构信息 (基于 Axios 自动携带 Cookie 凭证)
  UserAPI.getCurrentUser().then(res => {
    if (res.success && res.data) {
      if (!nicknameParam && res.data.nickname) store.user.nickname = res.data.nickname;
      if (!companyParam && res.data.companyName) store.org.companyName = res.data.companyName;
      if (!orgIdParam && res.data.orgId) store.org.orgId = res.data.orgId;
      if (res.data.email) store.user.email = res.data.email;
      if (res.data.avatar) store.user.avatar = res.data.avatar;
      if (!urlParams.get('lang') && !urlParams.get('locale') && res.data.language) {
        store.currentLocale = res.data.language;
      }
    }
  }).catch(() => {});

  // 监听来自父级母系统 (iframe postMessage) 的动态同步
  window.addEventListener('message', (event: MessageEvent) => {
    try {
      const data = event.data;
      if (!data) return;
      if (data.type === 'ALGO_USER_INIT' || data.type === 'SYNC_USER_INFO') {
        const payload = data.data || data;
        if (payload.token) store.user.token = payload.token;
        if (payload.nickname) store.user.nickname = payload.nickname;
        if (payload.email) store.user.email = payload.email;
        if (payload.org_id || payload.sc_org_id) store.org.orgId = payload.org_id || payload.sc_org_id;
        if (payload.company_name || payload.company) store.org.companyName = payload.company_name || payload.company;
        if (payload.language || payload.lang) {
          const l = String(payload.language || payload.lang).toLowerCase();
          store.currentLocale = l.startsWith('en') ? 'en' : 'zh';
        }
      }
    } catch (_) {}
  });

  // 2. 解析并锁定外部业务主体类型 (customer/client, individual, entity)
  if (typeParam === 'individual') {
    store.lockedProfileType = 'individual';
  } else if (typeParam === 'entity') {
    store.lockedProfileType = 'entity';
  } else if (typeParam === 'customer' || typeParam === 'client') {
    store.lockedProfileType = 'customer';
  } else {
    store.lockedProfileType = null;
  }

  let targetTemplate: FormSchema = blankTemplate;
  let targetTemplateKey = 'blank';

  try {
    // 2. 如果 URL 带有纯小写 id 参数 (例如 cus_diy_..., ind_diy_..., ent_tpl_...)
    if (rawId) {
      // 先尝试向后端获取持久化数据
      const res = await FormAPI.getTemplate(rawId);
      if (res.success && res.data?.schema?.pages && res.data.schema.pages.length > 0) {
        targetTemplate = res.data.schema;
        targetTemplateKey = 'saved';
      } else {
        // 本地/纯前端模式：直接从 id 标识自解析 (cus/cli=母案例, ind=个人案例, ent=实体案例; diy=自建, tpl=模板)
        const isCus = rawId.startsWith('cus_') || rawId.startsWith('cli_');
        const isEntity = rawId.startsWith('ent_');
        const isTpl = rawId.includes('_tpl_');
        const resolvedType: ProfileType = isCus ? 'customer' : (isEntity ? 'entity' : 'individual');

        if (!typeParam) {
          store.lockedProfileType = resolvedType;
        }

        if (isTpl) {
          if (resolvedType === 'customer') {
            targetTemplate = kycCustomerTemplate;
            targetTemplateKey = 'kyc-customer';
          } else if (resolvedType === 'entity') {
            targetTemplate = kycEntityTemplate;
            targetTemplateKey = 'kyc-entity';
          } else {
            targetTemplate = kycIndividualTemplate;
            targetTemplateKey = 'kyc-individual';
          }
        } else {
          targetTemplate = createBlankTemplate(resolvedType);
          targetTemplateKey = 'blank';
        }
      }
    } else if (tplParam === 'kyc-customer' || tplParam === 'kyc-client' || typeParam === 'customer' || typeParam === 'client') {
      targetTemplate = kycCustomerTemplate;
      targetTemplateKey = 'kyc-customer';
    } else if (tplParam === 'kyc-individual' || typeParam === 'individual') {
      targetTemplate = kycIndividualTemplate;
      targetTemplateKey = 'kyc-individual';
    } else if (tplParam === 'kyc-entity' || typeParam === 'entity') {
      targetTemplate = kycEntityTemplate;
      targetTemplateKey = 'kyc-entity';
    } else {
      // 默认 URL 为空（无任何 id 与预设模板参数）：画布完全置空，必须通过向导弹窗选择模板或自建空白
      store.pages = [];
      store.selectedType = null;
      store.selectedId = null;
      store.activePageId = null;
      store.meta.formId = '';
      store.meta.serialNo = '';
      syncUrlParams('');
      store.activeTemplateKey = 'blank';

      isInitialWizardMandatory.value = true;
      welcomeWizardVisible.value = true;
      targetTemplateKey = 'blank';
    }
  } catch {
    // 异常兜底：保证画布干净并唤起强制向导
    store.pages = [];
    store.selectedType = null;
    store.selectedId = null;
    store.activePageId = null;
    store.meta.formId = '';
    store.meta.serialNo = '';
    syncUrlParams('');
    store.activeTemplateKey = 'blank';

    isInitialWizardMandatory.value = true;
    welcomeWizardVisible.value = true;
  } finally {
    if (rawId || tplParam) {
      loadSchema(targetTemplate);
      if (rawId) {
        store.meta.formId = rawId;
        store.meta.serialNo = rawId;
        syncUrlParams(rawId);
      } else {
        store.meta.formId = '';
        store.meta.serialNo = '';
        syncUrlParams('');
      }
      store.activeTemplateKey = targetTemplateKey;
    }
    store.isCanvasLoading = false;
  }

  // 仅在带有模板或表单 ID 进入时自动检查新手漫游引导
  if (rawId || tplParam) {
    checkAutoStartTour();
  }

  // 离开页面时未保存拦截
  window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
    if (store.isDirty) {
      e.preventDefault();
      e.returnValue = '您有未保存的更改，确定要离开吗？';
    }
  });
});
</script>
