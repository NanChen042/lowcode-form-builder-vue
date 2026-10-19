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
    :mask-closable="!mandatory"
    :esc-to-close="!mandatory"
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
    @cancel="handleClose"
  >
    <div class="flex flex-col bg-white rounded-[8px] overflow-hidden select-none">
      <!-- 顶栏：Logo | DIY 表单设计器 + (非强制模式下的关闭按钮) -->
      <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-6 bg-white select-none">
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

        <!-- 仅在非强制模式时展示关闭按钮 (首次空 URL 进入时必须执行操作，无关闭按钮) -->
        <button
          v-if="!mandatory"
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          :title="t('common.close') || '关闭'"
          @click="handleClose"
        >
          <X class="h-4 w-4" />
        </button>
      </header>

      <!-- 主体内容区：用户认可的 4 列横排架构 (1 张空白画布专属卡 + 3 张 3D 模板卡，紧凑无多余空隙) -->
      <div class="p-6 sm:p-7 select-none">
        <!-- 欢迎标语 -->
        <div class="text-center max-w-lg mx-auto mb-5">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 m-0 tracking-tight leading-tight">
            {{ t('wizard.title') }}
          </h2>
          <p class="text-[12px] text-slate-500 m-0 mt-1 leading-normal">
            {{ t('wizard.subtitle') }}
          </p>
        </div>

        <!-- 4 张横排卡片 (彻底拿掉 min-h 强制撑高，消除上下空旷死角) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-2">
          
          <!-- 卡片 1：新建空白画布 (专属特殊高亮画板，与 3 款模板有明确的主次区隔) -->
          <div
            class="group rounded-lg border border-blue-200/90 hover:border-[#1677ff] bg-gradient-to-b from-blue-50/50 via-white to-white hover:shadow-md flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden"
            @click="handleCreateBlank"
          >
            <div>
              <!-- 顶部专属空白画板插画 (无廉价点阵，无虚线，清爽微质感) -->
              <div class="h-[88px] w-full bg-blue-50/60 border-b border-blue-100/80 flex items-center justify-center relative overflow-hidden select-none">
                <div class="w-10 h-10 rounded-lg bg-white border border-blue-200/80 shadow-2xs flex items-center justify-center text-[#1677ff] group-hover:scale-110 transition-transform">
                  <Plus class="w-5 h-5 stroke-[2.4]" />
                </div>
                <!-- 右上角专属胶囊 Tag -->
                <span class="absolute top-2 right-2 text-[9.5px] px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-700 leading-none">
                  {{ store.currentLocale === 'en' ? 'Blank' : '从零开始' }}
                </span>
              </div>

              <!-- 标题与描述 -->
              <div class="p-3 pb-2">
                <h4 class="text-[12.5px] font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors m-0 leading-tight truncate">
                  {{ t('wizard.createBlank') }}
                </h4>
                <p class="text-[11px] text-slate-400 mt-1.5 m-0 leading-normal flex items-center gap-1 truncate">
                  <FileText class="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{{ store.currentLocale === 'en' ? '0 Fields · Free Layout' : '0 初始字段 · 自由搭建' }}</span>
                </p>
              </div>
            </div>

            <!-- 底部操作按钮 (专属主色实心按钮，紧贴在信息下方，间距恰到好处) -->
            <div class="p-3 pt-0">
              <div class="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  class="w-full h-7 rounded border border-transparent bg-[#1677ff] hover:bg-blue-600 text-white text-[11.5px] font-medium flex items-center justify-center gap-1 shadow-2xs transition-all duration-150 cursor-pointer"
                >
                  <span>{{ t('wizard.createNowBtn') }}</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <!-- 卡片 2~4：客户案例、个人案例、机构案例 (经典 3D 渲染图，白底微边框，次级按钮) -->
          <div
            v-for="tpl in scenarioTemplates"
            :key="tpl.key"
            class="group rounded-lg border border-slate-200/90 bg-white hover:border-[#1677ff] hover:shadow-md flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden"
            @click="handleSelectTemplate(tpl.key)"
          >
            <div>
              <!-- 顶部 3D 场景图 -->
              <div
                class="h-[88px] w-full border-b border-slate-100 flex items-center justify-center relative overflow-hidden select-none"
                :class="tpl.bannerBgClass"
              >
                <img
                  :src="tpl.image"
                  :alt="getFieldText(tpl, 'title')"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <!-- 右上角胶囊 Tag -->
                <span
                  class="absolute top-2 right-2 text-[9.5px] px-2 py-0.5 rounded font-semibold shadow-2xs leading-none"
                  :class="tpl.tagBadgeClass"
                >
                  {{ getFieldText(tpl, 'tag') }}
                </span>
              </div>

              <!-- 标题与字段统计 -->
              <div class="p-3 pb-2">
                <h4 class="text-[12.5px] font-bold text-slate-800 group-hover:text-[#1677ff] transition-colors m-0 leading-tight truncate">
                  {{ getFieldText(tpl, 'title') }}
                </h4>
                <p class="text-[11px] text-slate-400 mt-1.5 m-0 leading-normal flex items-center gap-1 truncate">
                  <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{{ getFieldText(tpl, 'stats') }}</span>
                </p>
              </div>
            </div>

            <!-- 底部操作按钮 (白底微灰边框次级按钮，紧贴信息下方) -->
            <div class="p-3 pt-0">
              <div class="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  class="w-full h-7 rounded border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-[11.5px] font-medium flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer"
                >
                  <span>{{ store.currentLocale === 'en' ? 'Load Template' : '载入模板' }}</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- 底部轻量指引 -->
        <div class="text-center text-[11px] text-slate-400 pt-3 select-none">
          {{ store.currentLocale === 'en' ? 'Click any card to start building directly' : '点击任意卡片即可直接进入画布开启编排' }}
        </div>
      </div>
    </div>
  </a-modal>

  <!-- 模板覆盖二次确认弹窗 -->
  <a-modal
    v-model:visible="confirmOverwriteVisible"
    :title="store.currentLocale === 'en' ? 'Confirm Overwrite' : '覆盖确认'"
    :width="380"
    :title-align="'start'"
    draggable
    unmount-on-close
    class="clean-confirm-modal"
    @cancel="confirmOverwriteVisible = false"
  >
    <div class="text-[13px] text-slate-600 leading-normal">
      <template v-if="store.currentLocale === 'en'">
        The current canvas already contains <strong>{{ store.pages.length }} artboard page(s)</strong>. Applying <strong>{{ pendingTemplateTitle }}</strong> will overwrite all current canvas contents. Are you sure you want to continue?
      </template>
      <template v-else>
        当前画布已包含 <strong>{{ store.pages.length }} 个画板页面</strong>，载入 <strong>{{ pendingTemplateTitle }}</strong> 将完全覆盖当前画布内容。是否确认继续？
      </template>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" status="warning" class="bg-amber-600 hover:bg-amber-700" @click="executeApplyTemplate">
          {{ store.currentLocale === 'en' ? 'Confirm Overwrite' : '确定覆盖' }}
        </a-button>
        <a-button @click="confirmOverwriteVisible = false">
          {{ store.currentLocale === 'en' ? 'Cancel' : '取消' }}
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
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import {
  Plus,
  ArrowRight,
  X,
  Building2,
  UserCheck,
  ShieldCheck,
  FileText
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
    title: '客户案例 KYC 模板',
    title_en: 'Customer Registration',
    tag: '客户案例',
    tag_en: 'Customer',
    stats: '3 页面 · 9 字段',
    stats_en: '3 Pages · 9 Fields',
    icon: Building2,
    image: tplCustomerImg,
    desc: '涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。',
    desc_en: 'Includes business profile, sales turnover, fund sources, listed company stock code linkage and formal declaration.',
    code: 'SG_CDD_Customer',
    bannerBgClass: 'bg-[#faf5ff]',
    tagBadgeClass: 'bg-purple-100/95 text-purple-700',
    iconColorClass: 'text-purple-600',
    tagColor: 'purple'
  },
  {
    key: 'kyc-individual' as const,
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC',
    tag: '个人成员',
    tag_en: 'Individual',
    stats: '5 页面 · 15 字段',
    stats_en: '5 Pages · 15 Fields',
    icon: UserCheck,
    image: tplIndividualImg,
    desc: '涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。',
    desc_en: 'Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature.',
    code: 'SG_CDD_Individual',
    bannerBgClass: 'bg-[#f0fdf4]',
    tagBadgeClass: 'bg-emerald-100/95 text-emerald-700',
    iconColorClass: 'text-emerald-600',
    tagColor: 'green'
  },
  {
    key: 'kyc-entity' as const,
    title: '机构案例 KYC 模板',
    title_en: 'Entity KYC',
    tag: '机构成员',
    tag_en: 'Entity',
    stats: '3 页面 · 16 字段',
    stats_en: '3 Pages · 16 Fields',
    icon: ShieldCheck,
    image: tplEntityImg,
    desc: '包含企业统一社会信用代码、经营地址、授权代表核验与法人签章。',
    desc_en: 'Includes corporate UEN, business address, authorized rep verification and seal.',
    code: 'SG_CDD_Entity',
    bannerBgClass: 'bg-[#eff6ff]',
    tagBadgeClass: 'bg-blue-100/95 text-blue-700',
    iconColorClass: 'text-blue-600',
    tagColor: 'blue'
  }
];

function handleClose() {
  if (props.mandatory) return;
  modalVisible.value = false;
  emit('close');
}

// 点击新建空白画布：关闭向导弹窗并唤起二次弹窗 (CreateFormModal)，供选择业务主体与表单名称
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

// 选择某个场景模板：若画布已有画板则先二次确认，确认后载入并进入画布
function handleSelectTemplate(tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity') {
  pendingTemplateKey.value = tplKey;
  if (store.pages.length > 0) {
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

:deep(.welcome-card-btn) {
  height: 32px !important;
  line-height: 1 !important;
  padding: 0 12px !important;
}

:deep(.welcome-card-btn .arco-btn-content) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  line-height: 1 !important;
}
</style>
