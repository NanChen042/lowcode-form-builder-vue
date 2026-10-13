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
          @open-template-gallery="createFormModalVisible = true"
          @open-create-canvas="createFormModalVisible = true"
          @open-create-form="createFormModalVisible = true"
        />

        <InfiniteCanvas
          class="-mt-14"
          @open-template-gallery="createFormModalVisible = true"
          @open-create-canvas="createFormModalVisible = true"
        />

        <PropertyPanel />
      </div>

      <!-- 统一新建表单画布弹窗 (母案例/个人/机构，空白自建/场景模板) -->
      <CreateFormModal
        v-model:visible="createFormModalVisible"
        @close="createFormModalVisible = false"
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
import { FormAPI } from '@/core/api';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate,
  blankTemplate,
  createBlankTemplate
} from '@/templates/recommend';
import type { FormSchema, ProfileType } from '@/types/schema';
import { checkAutoStartTour } from '@/utils/useAppTour';

import AppHeader from './components/header/AppHeader.vue';
import MaterialSidebar from './components/sidebar/MaterialSidebar.vue';
import InfiniteCanvas from './components/canvas/InfiniteCanvas.vue';
import PropertyPanel from './components/properties/PropertyPanel.vue';
import CreateFormModal from './components/sidebar/CreateFormModal.vue';
import PreviewModal from './components/preview/PreviewModal.vue';

const createFormModalVisible = ref(false);
const previewModalVisible = ref(false);
const previewMode = ref<'preview' | 'deploy'>('preview');
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
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = (urlParams.get('id') || '').toLowerCase().trim();
  const tplParam = (urlParams.get('tpl') || '').toLowerCase().trim();
  const typeParam = (urlParams.get('type') || urlParams.get('profileType') || '').toLowerCase().trim();

  // 1. 解析并锁定外部业务主体类型 (customer/client, individual, entity)
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
      const res = await FormAPI.getTemplate('default');
      if (res.success && res.data?.schema?.pages && res.data.schema.pages.length > 0) {
        targetTemplate = res.data.schema;
        targetTemplateKey = 'saved';
      } else {
        // 无任何参数且无草稿：若为初次进入，自动弹出新建表单向导
        targetTemplate = createBlankTemplate('customer');
        targetTemplateKey = 'blank';
        setTimeout(() => {
          createFormModalVisible.value = true;
        }, 350);
      }
    }
  } catch {
    // 降级使用空白模板
  } finally {
    loadSchema(targetTemplate);
    if (rawId) {
      store.meta.formId = rawId;
      store.meta.serialNo = rawId;
    }
    store.activeTemplateKey = targetTemplateKey;
    store.isCanvasLoading = false;
    syncUrlParams(store.meta.formId);
  }

  // 检查是否需要自动开启新手漫游引导
  checkAutoStartTour();

  // 离开页面时未保存拦截
  window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
    if (store.isDirty) {
      e.preventDefault();
      e.returnValue = '您有未保存的更改，确定要离开吗？';
    }
  });
});
</script>
