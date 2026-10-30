<template>
  <a-config-provider :locale="currentArcoLocale">
    <div class="relative flex h-full w-full flex-col overflow-hidden">
      <AppHeader
        @open-preview="openPreview('preview')"
        @open-deploy="handleOpenPublish"
      />

      <div class="app-main relative flex min-h-0 flex-1 overflow-hidden">
        <MaterialSidebar
          @open-template-gallery="handleOpenTemplateModal"
          @open-create-canvas="handleOpenCreateCanvas"
          @open-create-form="handleOpenCreateCanvas"
        />

        <InfiniteCanvas
          @open-template-gallery="handleOpenTemplateModal"
          @open-create-canvas="handleOpenCreateCanvas"
        />

        <PropertyPanel />
      </div>

      <CreateFormModal
        v-model:visible="createCanvasModalVisible"
        :is-initial="openedFromWizard"
        @created="handleFormCreated"
        @cancel="handleCreateCanvasCancel"
        @close="handleCreateCanvasClose"
      />

      <WelcomeWizardModal
        v-model:visible="welcomeWizardVisible"
        :mandatory="isInitialWizardMandatory"
        @open-blank="handleWizardOpenBlank"
        @selected-template="handleTemplateSelected"
        @close="handleWelcomeWizardClosed"
      />

      <PreviewModal
        :visible="previewModalVisible"
        :schema="currentPreviewSchema"
        :mode="previewMode"
        @close="previewModalVisible = false"
        @open-publish="handleOpenPublish"
      />

      <PublishModal
        v-model:visible="publishModalVisible"
        @close="publishModalVisible = false"
      />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  store,
  isRisk,
  buildSchema,
  loadSchema,
  syncUrlParams,
  generateFormId,
  establishBaseline
} from '@/core/store';
import { currentArcoLocale, t } from '@/core/i18n';
import { FormAPI, UserAPI } from '@/core/api';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate,
  blankTemplate,
  createBlankTemplate,
  createRiskAssessmentTemplate
} from '@/templates/recommend';
import type { FormSchema } from '@/types/schema';
import { checkAutoStartTour } from '@/utils/useAppTour';

import AppHeader from '@/components/header/AppHeader.vue';
import MaterialSidebar from '@/components/sidebar/MaterialSidebar.vue';
import InfiniteCanvas from '@/components/canvas/InfiniteCanvas.vue';
import PropertyPanel from '@/components/properties/PropertyPanel.vue';
import CreateFormModal from '@/components/sidebar/CreateFormModal.vue';
import WelcomeWizardModal from '@/components/common/WelcomeWizardModal.vue';
import PreviewModal from '@/components/preview/PreviewModal.vue';
import PublishModal from '@/components/preview/PublishModal.vue';

const router = useRouter();
const createCanvasModalVisible = ref(false);
const welcomeWizardVisible = ref(false);
const isInitialWizardMandatory = ref(false);
const previewModalVisible = ref(false);
const publishModalVisible = ref(false);
const previewMode = ref<'preview' | 'deploy'>('preview');
const openedFromWizard = ref(false);

function handleOpenPublish() {
  publishModalVisible.value = true;
}

function handleOpenCreateCanvas() {
  openedFromWizard.value = store.pages.length === 0;
  createCanvasModalVisible.value = true;
}

function handleOpenTemplateModal() {
  isInitialWizardMandatory.value = false;
  welcomeWizardVisible.value = true;
}

function handleWizardOpenBlank() {
  openedFromWizard.value = true;
  welcomeWizardVisible.value = false;
  createCanvasModalVisible.value = true;
}

function handleTemplateSelected(_tplKey: string) {
  welcomeWizardVisible.value = false;
  openedFromWizard.value = false;
  store.sidebarTab = 'components';
  setTimeout(() => {
    checkAutoStartTour();
  }, 400);
}

function handleFormCreated() {
  createCanvasModalVisible.value = false;
  openedFromWizard.value = false;
  store.sidebarTab = 'components';
  setTimeout(() => {
    checkAutoStartTour();
  }, 400);
}

function handleCreateCanvasCancel() {
  createCanvasModalVisible.value = false;
  if (openedFromWizard.value || store.pages.length === 0) {
    welcomeWizardVisible.value = true;
  }
}

function handleCreateCanvasClose() {
  createCanvasModalVisible.value = false;
  if (store.pages.length === 0) {
    welcomeWizardVisible.value = true;
  }
}

function handleWelcomeWizardClosed() {
  welcomeWizardVisible.value = false;
  store.sidebarTab = 'components';
  if (openedFromWizard.value || createCanvasModalVisible.value) {
    return;
  }
  if (store.pages.length === 0) {
    if (isRisk.value) {
      const riskSchema = createRiskAssessmentTemplate(store.lockedProfileType || 'customer', '', '', '', '');
      loadSchema(riskSchema);
    } else {
      loadSchema(blankTemplate);
    }
    store.lastSavedHash = '';
    store.isDirty = true;
    store.lastSavedTime = '';
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

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = (urlParams.get('id') || '').toLowerCase().trim();
  const isCopyMode = urlParams.get('copy') === '1' || urlParams.get('copy') === 'true';
  const tplParam = (urlParams.get('tpl') || '').toLowerCase().trim();
  const rawType = (urlParams.get('type') || '').toLowerCase().trim();
  const rawFormType = (urlParams.get('formType') || '').toLowerCase().trim();
  const typeParam = (urlParams.get('profileType') || (rawType !== 'risk' ? rawType : '')).toLowerCase().trim();
  const isRiskRoute =
    window.location.pathname.includes('/risk') ||
    urlParams.get('mode') === 'risk' ||
    rawFormType === 'risk' ||
    rawType === 'risk';
  store.editorMode = isRiskRoute ? 'risk' : 'standard';

  if (rawId) {
    store.isCanvasLoading = true;
  }
  let loadingTimer: ReturnType<typeof setTimeout> | null = !rawId
    ? setTimeout(() => {
        store.isCanvasLoading = true;
      }, 150)
    : null;

  const lang = urlParams.get('lang');
  if (lang === 'en' || lang === 'zh') {
    store.currentLocale = lang;
  }

  const nickname = urlParams.get('nickname');
  const company = urlParams.get('company');
  if (nickname) store.user.nickname = nickname;
  if (company) store.org.companyName = company;

  if (!store.user.isLoggedIn) {
    UserAPI.getCurrentUser().then(res => {
      if (res.success && res.data && res.data.uid > 0) {
        store.user.isLoggedIn = true;
        store.user.uid = res.data.uid;
        if (res.data.nickname) store.user.nickname = res.data.nickname;
        if (res.data.companyName) store.org.companyName = res.data.companyName;
        if (res.data.avatar) store.user.avatar = res.data.avatar;
        const cachedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('builder_current_locale') : null;
        if (res.data.language && !lang && !cachedLang) store.currentLocale = res.data.language;
      }
    }).catch(() => {});
  }

  window.addEventListener('message', handleWindowMessage);

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

  const resetToBlankState = () => {
    if (store.lockedProfileType) {
      if (isRisk.value) {
        const riskSchema = createRiskAssessmentTemplate(store.lockedProfileType, '', '', '', '');
        loadSchema(riskSchema, { duration: 0 });
      } else {
        const blankSchema = createBlankTemplate(store.lockedProfileType, '', '', '');
        loadSchema(blankSchema, { duration: 0 });
      }
      store.selectedType = null;
      store.selectedId = null;
      store.meta.formId = '';
      store.meta.serialNo = '';
      syncUrlParams('');
      store.activeTemplateKey = 'blank';
      store.sidebarTab = 'components';
      return;
    }
    // 首次进入欢迎弹窗前，彻底清空画布（pages: []），防止背景残留 KYC 「基本资料」模板
    loadSchema({
      schemaVersion: '1.0.0',
      meta: {
        title: '',
        description: '',
        formType: isRisk.value ? 'risk' : 'kyc',
        enabledLocales: [store.currentLocale || 'zh'],
        source: 'diy'
      },
      pages: []
    }, { duration: 0 });
    store.selectedType = null;
    store.selectedId = null;
    store.meta.formId = '';
    store.meta.serialNo = '';
    syncUrlParams('');
    store.activeTemplateKey = 'blank';
    isInitialWizardMandatory.value = false;
    welcomeWizardVisible.value = true;
  };

  let notFound = false;

  try {
    if (rawId) {
      const res = await FormAPI.getTemplate(rawId);
      if (res.success && res.data?.schema?.pages && res.data.schema.pages.length > 0) {
        targetTemplate = res.data.schema;
        targetTemplateKey = 'saved';
      } else if (rawId.startsWith('preset-cdd-')) {
        if (rawId.includes('individual')) {
          targetTemplate = kycIndividualTemplate;
          targetTemplateKey = 'kyc-individual';
        } else if (rawId.includes('entity')) {
          targetTemplate = kycEntityTemplate;
          targetTemplateKey = 'kyc-entity';
        } else {
          targetTemplate = kycCustomerTemplate;
          targetTemplateKey = 'kyc-customer';
        }
      } else {
        notFound = true;
      }
    } else if (isRisk.value) {
      resetToBlankState();
      targetTemplateKey = 'blank';
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
      resetToBlankState();
      targetTemplateKey = 'blank';
    }
  } catch {
    if (rawId && !rawId.startsWith('preset-cdd-')) {
      notFound = true;
    } else {
      resetToBlankState();
    }
  } finally {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
    store.isCanvasLoading = false;
  }

  if (notFound) {
    if (typeof (window as any).__dismissAppLoader === 'function') {
      (window as any).__dismissAppLoader();
    }
    const notFoundPath = '/404';
    router.replace({
      path: notFoundPath,
      query: {
        reason: 'form',
        id: rawId,
        lang: store.currentLocale
      }
    });
    return;
  }

  if (rawId || tplParam) {
    loadSchema(targetTemplate, { duration: 0 });
    if (isCopyMode) {
      const newCopiedId = generateFormId(store.meta.profileType || 'customer', store.meta.source || 'diy');
      store.meta.formId = newCopiedId;
      store.meta.serialNo = newCopiedId;
      if (store.meta.title && !store.meta.title.endsWith('_副本')) {
        store.meta.title = `${store.meta.title}_副本`;
      }
      if (store.meta.title_en && !store.meta.title_en.endsWith('_Copy')) {
        store.meta.title_en = `${store.meta.title_en}_Copy`;
      }
      let saveRes = await FormAPI.saveTemplate(buildSchema());
      if (!saveRes.success && saveRes.code == 409) {
        const suffix = newCopiedId.split('_').pop() || String(Date.now()).slice(-4);
        store.meta.title = `${store.meta.title}_${suffix}`;
        if (store.meta.title_en) {
          store.meta.title_en = `${store.meta.title_en}_${suffix}`;
        }
        saveRes = await FormAPI.saveTemplate(buildSchema());
      }
      if (saveRes.success) {
        const savedId = saveRes.data?.id || newCopiedId;
        store.meta.formId = savedId;
        store.meta.serialNo = savedId;
        syncUrlParams(savedId);
        establishBaseline();
        const now = new Date();
        store.lastSavedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      } else {
        syncUrlParams('');
        store.lastSavedHash = '';
        store.isDirty = true;
        store.lastSavedTime = '';
      }
    } else if (targetTemplateKey === 'saved') {
      const effectiveId = rawId;
      store.meta.formId = effectiveId;
      store.meta.serialNo = effectiveId;
      syncUrlParams(effectiveId);
    } else {
      const newFormId = generateFormId(store.meta.profileType || 'customer', store.meta.source || 'template');
      store.meta.formId = newFormId;
      store.meta.serialNo = newFormId;
      syncUrlParams('');
      store.lastSavedHash = '';
      store.isDirty = true;
      store.lastSavedTime = '';
    }
    store.activeTemplateKey = targetTemplateKey;
  }

  if (rawId || tplParam) {
    checkAutoStartTour();
  }

  setTimeout(() => {
    if (typeof (window as any).__dismissAppLoader === 'function') {
      (window as any).__dismissAppLoader();
    }
  }, 220);

  window.addEventListener('beforeunload', handleBeforeUnload);
});

function handleWindowMessage(event: MessageEvent) {
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
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (store.isDirty) {
    e.preventDefault();
    e.returnValue = t('common.leaveConfirm');
  }
}

onUnmounted(() => {
  window.removeEventListener('message', handleWindowMessage);
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>
