<template>
  <a-modal
    v-model:visible="modalVisible"
    :width="'min(860px, 94vw)'"
    :align-center="true"
    :footer="false"
    :header="false"
    :closable="false"
    draggable
    unmount-on-close
    :mask-closable="false"
    :esc-to-close="false"
    modal-class="clean-welcome-modal"
    :modal-style="{
      padding: 0,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)'
    }"
    :body-style="{
      padding: 0,
      overflow: 'hidden',
      borderRadius: '8px'
    }"
    :mask-style="{
      backdropFilter: 'blur(6px)',
      backgroundColor: 'rgba(15, 23, 42, 0.45)'
    }"
  >
    <div class="flex flex-col bg-white rounded-lg overflow-hidden select-none">
      <header class="flex h-13 shrink-0 items-center justify-between border-b border-slate-100 px-6 bg-white select-none">
        <div class="flex items-center gap-2.5">
          <img
            :src="logoUrl"
            alt="AlgoCandy"
            class="h-6 w-auto max-w-[130px] object-contain select-none"
          />
          <span class="text-slate-300 font-light text-sm select-none">|</span>
          <span class="text-[13px] text-slate-600 font-medium select-none">
            {{ t('wizard.brandSubtitle') }}
          </span>
        </div>
      </header>

      <div class="p-6 select-none">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          <div class="md:col-span-5 flex">
            <div
              class="group flex flex-1 flex-col justify-between items-start rounded-lg bg-gradient-to-b from-[#edf5fe] via-[#e5f0fe] to-[#d8ebfe] hover:from-[#e6f2fe] hover:to-[#d2e6fe] p-5 cursor-pointer transition-all duration-150 select-none text-left relative overflow-hidden"
              @click="handleCreateBlank"
            >
              <div class="z-10">
                <span class="text-[11px] font-bold text-[#1677ff] tracking-wider">
                  {{ t('wizard.createNewTag') }}
                </span>
                <h3 class="text-[18px] font-bold text-slate-900 mt-1 leading-tight tracking-tight group-hover:text-[#1677ff] transition-colors">
                  {{ t('wizard.createBlank') }}
                </h3>
                <p class="text-[12px] text-slate-400 mt-1 leading-normal m-0">
                  {{ t('wizard.createBlankDesc') }}
                </p>
              </div>

              <div class="w-full flex items-center justify-center my-auto py-2 z-10">
                <img
                  :src="tplBlankHeroImg"
                  :alt="t('wizard.createBlank')"
                  class="w-full max-h-[170px] object-contain select-none pointer-events-none group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div class="z-10 mt-1">
                <a-button
                  type="primary"
                  shape="round"
                  class="px-5 h-8 bg-[#1677ff] hover:bg-blue-600 font-medium text-[12.5px] flex items-center gap-1.5 shadow-sm"
                >
                  <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{{ t('wizard.createNowBtn') }}</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a-button>
              </div>
            </div>
          </div>

          <div class="md:col-span-7 flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-2.5 mb-3.5">
                <LayoutGrid class="w-5 h-5 text-[#1677ff] shrink-0 mt-0.5" />
                <div>
                  <h4 class="text-[16px] font-bold text-slate-900 m-0 tracking-tight leading-tight">
                    {{ t('wizard.selectTemplate') }}
                  </h4>
                  <p class="text-[12px] text-slate-400 m-0 mt-0.5 leading-tight">
                    {{ t('wizard.selectTemplateDesc') }}
                  </p>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="tpl in scenarioTemplates"
                  :key="tpl.key"
                  class="group rounded-lg p-3.5 px-4 flex items-center justify-between border border-slate-200/90 bg-white hover:border-[#1677ff] hover:bg-blue-50/20 hover:shadow-2xs cursor-pointer transition-all duration-150 select-none"
                  @click="handleSelectTemplate(tpl.key)"
                >
                  <div class="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md group-hover:scale-105 transition-transform duration-150 mt-0.5 overflow-hidden"
                    >
                      <img
                        :src="tpl.image"
                        :alt="getFieldText(tpl, 'title')"
                        class="w-full h-full object-contain select-none pointer-events-none"
                      />
                    </div>

                    <div class="min-w-0 flex-1 pr-2">
                      <h5 class="text-[14px] font-bold text-slate-800 group-hover:text-[#1677ff] transition-colors m-0 leading-tight truncate">
                        {{ getFieldText(tpl, 'title') }}
                      </h5>
                      
                      <div class="flex items-center gap-2 text-[12px] text-slate-400 mt-1 m-0 leading-none">
                        <span class="flex items-center gap-1">
                          <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{{ getPagesText(tpl) }}</span>
                        </span>
                        <span class="text-slate-300">·</span>
                        <span class="flex items-center gap-1">
                          <Layers class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{{ getFieldsText(tpl) }}</span>
                        </span>
                      </div>

                      <p class="text-[11px] text-slate-400 mt-1.5 m-0 leading-normal line-clamp-1">
                        {{ t(tpl.descKey) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2.5 shrink-0 pl-3">
                    <a-tag
                      :color="tpl.arcoTagColor"
                      size="small"
                      class="rounded font-medium px-2"
                    >
                      {{ getFieldText(tpl, 'tag') }}
                    </a-tag>

                    <div class="text-slate-400 group-hover:text-[#1677ff] group-hover:translate-x-0.5 transition-all">
                      <ArrowRight class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="confirmOverwriteVisible"
    :title="t('wizard.confirmOverwriteTitle')"
    :width="380"
    :title-align="'start'"
    draggable
    unmount-on-close
    class="clean-confirm-modal"
    @cancel="confirmOverwriteVisible = false"
  >
    <div class="text-[13px] text-slate-600 leading-normal">
      {{
        t('wizard.confirmOverwriteDesc', undefined, {
          pages: String(store.pages.length),
          title: pendingTemplateTitle
        })
      }}
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" status="warning" class="bg-amber-600 hover:bg-amber-700" @click="executeApplyTemplate">
          {{ t('wizard.confirmOverwriteBtn') }}
        </a-button>
        <a-button @click="confirmOverwriteVisible = false">
          {{ t('common.cancel') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { store, applyTemplateKey } from '@/core/store';
import { t, getFieldText } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';
import logoUrl from '@/assets/logo.png';
import tplBlankHeroImg from '@/assets/templates/tpl-blank-hero.webp';
import iconCustomer from '@/assets/templates/c.png';
import iconIndividual from '@/assets/templates/u.png';
import iconEntity from '@/assets/templates/e.png';
import {
  LayoutGrid,
  FileText,
  Layers,
  ArrowRight,
  Plus
} from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    mandatory?: boolean;
  }>(),
  {
    mandatory: false
  }
);

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'close'): void;
  (e: 'open-blank'): void;
  (e: 'selected-template', key: 'kyc-customer' | 'kyc-individual' | 'kyc-entity'): void;
}>();

const modalVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val) emit('close');
  }
});

const scenarioTemplates = [
  {
    key: 'kyc-customer' as const,
    type: 'customer' as const,
    title: '客户案例 KYC 模板',
    title_en: 'Customer KYC Template',
    tag: '客户案例',
    tag_en: 'Customer',
    pages: 3,
    fields: 9,
    descKey: 'wizard.tplCustomerDesc',
    image: iconCustomer,
    arcoTagColor: 'purple'
  },
  {
    key: 'kyc-individual' as const,
    type: 'individual' as const,
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC Template',
    tag: '个人成员',
    tag_en: 'Individual',
    pages: 5,
    fields: 15,
    descKey: 'wizard.tplIndividualDesc',
    image: iconIndividual,
    arcoTagColor: 'green'
  },
  {
    key: 'kyc-entity' as const,
    type: 'entity' as const,
    title: '机构案例 KYC 模板',
    title_en: 'Entity KYC Template',
    tag: '机构成员',
    tag_en: 'Entity',
    pages: 3,
    fields: 16,
    descKey: 'wizard.tplEntityDesc',
    image: iconEntity,
    arcoTagColor: 'arcoblue'
  }
];

function getPagesText(tpl: (typeof scenarioTemplates)[number]) {
  return t('wizard.pagesCount', undefined, { count: tpl.pages });
}

function getFieldsText(tpl: (typeof scenarioTemplates)[number]) {
  return t('wizard.fieldsCount', undefined, { count: tpl.fields });
}

function handleCreateBlank() {
  modalVisible.value = false;
  emit('open-blank');
}

const confirmOverwriteVisible = ref(false);
const pendingTemplateKey = ref<'kyc-customer' | 'kyc-individual' | 'kyc-entity' | null>(null);

const pendingTemplateTitle = computed(() => {
  if (!pendingTemplateKey.value) return '';
  const item = scenarioTemplates.find(t => t.key === pendingTemplateKey.value);
  if (!item) return '';
  return store.currentLocale === 'en' ? item.title_en : item.title;
});

function isCanvasDirty(): boolean {
  if (store.pages.length === 0) return false;
  const totalFields = store.pages.reduce((acc, p) => acc + (p.fields?.length || 0), 0);
  if (totalFields === 0 && store.pages.length <= 2) {
    return false;
  }
  return true;
}

function handleSelectTemplate(tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity') {
  pendingTemplateKey.value = tplKey;
  if (isCanvasDirty()) {
    confirmOverwriteVisible.value = true;
    return;
  }
  executeApplyTemplate();
}

function executeApplyTemplate() {
  if (!pendingTemplateKey.value) return;
  applyTemplateKey(pendingTemplateKey.value);
  Message.success(t('sidebar.templateLoaded') || '场景模板已成功载入');
  emit('selected-template', pendingTemplateKey.value);
  pendingTemplateKey.value = null;
  confirmOverwriteVisible.value = false;
  modalVisible.value = false;
}
</script>

<style scoped>
:deep(.clean-welcome-modal.arco-modal-wrapper .arco-modal),
:deep(.clean-welcome-modal .arco-modal) {
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.clean-welcome-modal.arco-modal-wrapper .arco-modal-body),
:deep(.clean-welcome-modal .arco-modal-body) {
  padding: 0 !important;
  overflow: hidden;
  border-radius: 8px;
}
</style>
