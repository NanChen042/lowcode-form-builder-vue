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
          @open-template-gallery="templateModalVisible = true"
        />

        <InfiniteCanvas
          class="-mt-14"
          @open-template-gallery="templateModalVisible = true"
        />

        <PropertyPanel />
      </div>

      <!-- 场景模板库弹窗 -->
      <TemplateModal
        v-model:visible="templateModalVisible"
        @close="templateModalVisible = false"
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
  loadSchema
} from '@/core/store';
import { currentArcoLocale } from '@/core/i18n';
import { FormAPI } from '@/core/api';
import { kycIndividualTemplate, kycEntityTemplate, blankTemplate } from '@/templates/recommend';
import type { FormSchema } from '@/types/schema';

import AppHeader from './components/header/AppHeader.vue';
import MaterialSidebar from './components/sidebar/MaterialSidebar.vue';
import InfiniteCanvas from './components/canvas/InfiniteCanvas.vue';
import PropertyPanel from './components/properties/PropertyPanel.vue';
import TemplateModal from './components/sidebar/TemplateModal.vue';
import PreviewModal from './components/preview/PreviewModal.vue';

const templateModalVisible = ref(false);
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
  const tplParam = urlParams.get('tpl');

  let targetTemplate: FormSchema = blankTemplate;
  let targetTemplateKey = 'blank';

  try {
    if (tplParam === 'kyc-individual') {
      targetTemplate = kycIndividualTemplate;
      targetTemplateKey = 'kyc-individual';
    } else if (tplParam === 'kyc-entity') {
      targetTemplate = kycEntityTemplate;
      targetTemplateKey = 'kyc-entity';
    } else {
      const res = await FormAPI.getTemplate('default');
      if (res.success && res.data?.schema?.pages && res.data.schema.pages.length > 0) {
        targetTemplate = res.data.schema;
        targetTemplateKey = 'saved';
      }
    }
  } catch {
    // 降级使用空白模板
  } finally {
    loadSchema(targetTemplate);
    store.activeTemplateKey = targetTemplateKey;
    store.isCanvasLoading = false;
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
