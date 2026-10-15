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

      <!-- 双栏主体内容区 (1:1 还原用户参考设计) -->
      <div class="flex flex-col md:flex-row min-h-[410px]">
        <!-- 左侧栏：现代精密动态矢量插画 + 底部口号 -->
        <div class="w-full md:w-[310px] shrink-0 border-r border-slate-100 bg-linear-to-b from-blue-50/20 via-slate-50/15 to-white p-5 flex flex-col justify-between relative overflow-hidden">
          <!-- 插画展示区 (无缝居中展示，支持优雅 3D 悬浮视差) -->
          <div
            class="relative w-full flex-1 flex items-center justify-center my-auto py-2 select-none"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          >
            <!-- 柔和微光底晕 -->
            <div class="absolute inset-0 bg-radial from-blue-400/10 via-indigo-400/5 to-transparent blur-xl pointer-events-none" />

            <div
              class="relative w-full max-w-[270px] flex items-center justify-center transition-transform duration-300 ease-out"
              :style="{
                transform: `perspective(600px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`
              }"
            >
              <img
                :src="wizardIllustrationImg"
                alt="AlgoCandy Form Builder"
                class="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm animate-gentle-float"
              />
            </div>
          </div>

          <!-- 底部口号文案 -->
          <div class="pt-2 select-none">
            <p class="text-[11px] italic font-medium text-slate-400 m-0 tracking-tight leading-snug">
              {{ t('wizard.slogan1') }}<br />
              {{ t('wizard.slogan2') }}
            </p>
            <svg class="w-20 h-1.5 mt-1 text-blue-300 opacity-60" viewBox="0 0 100 8" fill="none">
              <path d="M0 6C30 1 70 1 100 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- 右侧栏：欢迎语 + 2 大核心操作卡片 + 热门场景模板网格 -->
        <div class="flex-1 min-w-0 p-5 flex flex-col justify-between bg-white">
          <div>
            <!-- 主标题与副标题 -->
            <div class="mb-3.5">
              <h2 class="text-base sm:text-lg font-bold text-slate-900 m-0 tracking-tight leading-tight">
                {{ t('wizard.title') }}
              </h2>
              <p class="text-[12px] text-slate-500 m-0 mt-0.5 leading-normal">
                {{ t('wizard.subtitle') }}
              </p>
            </div>

            <!-- 2 大核心操作卡片 (并排 2 列) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <!-- 卡片 1：新建空白画布 (点击触发二次弹窗，供选择主体类型与表单名称) -->
              <div
                class="group relative rounded-lg border-2 border-[#1677ff] bg-white p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all duration-150 cursor-pointer"
                @click="handleCreateBlank"
              >
                <div>
                  <!-- 蓝色图标方块 -->
                  <div class="w-8 h-8 rounded-md bg-[#1677ff] text-white flex items-center justify-center shadow-2xs mb-2.5 group-hover:scale-105 transition-transform">
                    <FilePlus2 class="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <h3 class="text-[13.5px] font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors m-0 mb-0.5">
                    {{ t('wizard.createBlank') }}
                  </h3>
                  <p class="text-[11px] text-slate-400 leading-normal m-0 mb-3">
                    {{ t('wizard.createBlankDesc') }}
                  </p>
                </div>

                <button
                  type="button"
                  class="w-full h-7.5 rounded-md bg-[#1677ff] hover:bg-blue-600 active:bg-blue-700 text-white text-[12px] font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  @click.stop="handleCreateBlank"
                >
                  <span>{{ t('wizard.createNowBtn') }}</span>
                  <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <!-- 卡片 2：选用场景模板 (精选合规预设场景，点击引导定位下方模板) -->
              <div
                class="group relative rounded-lg border border-slate-200 hover:border-slate-300 bg-white p-3.5 flex flex-col justify-between hover:shadow-2xs transition-all duration-150 cursor-pointer"
                @click="scrollToTemplates"
              >
                <div>
                  <!-- 靛紫图标方块 -->
                  <div class="w-8 h-8 rounded-md bg-indigo-500 text-white flex items-center justify-center shadow-2xs mb-2.5 group-hover:scale-105 transition-transform">
                    <LayoutTemplate class="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <h3 class="text-[13.5px] font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors m-0 mb-0.5">
                    {{ t('wizard.useTemplate') }}
                  </h3>
                  <p class="text-[11px] text-slate-400 leading-normal m-0 mb-3">
                    {{ t('wizard.useTemplateDesc') }}
                  </p>
                </div>

                <button
                  type="button"
                  class="w-full h-7.5 rounded-md border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-[12px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer group-hover:border-slate-300"
                  @click.stop="scrollToTemplates"
                >
                  <span>从下方选择模板 ↓</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 下方区域：热门场景模板 (共 3 套预设，已彻底移除“查看全部模板”无用跳转) -->
          <div ref="templatesSectionRef" class="pt-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[12.5px] font-bold text-slate-800">
                业务场景模板 (3)
              </span>
              <span class="text-[10.5px] text-slate-400 font-normal">
                点击卡片直接载入并开启编排
              </span>
            </div>

            <!-- 3 大 KYC 模板卡片横排网格 (客户-紫色, 个人-绿色, 机构-蓝色) -->
            <div class="grid grid-cols-3 gap-2.5">
              <div
                v-for="tpl in scenarioTemplates"
                :key="tpl.key"
                class="group rounded-lg border border-slate-200/90 bg-white hover:border-[#1677ff] hover:shadow-xs transition-all duration-150 cursor-pointer overflow-hidden flex flex-col"
                :class="{ 'ring-2 ring-blue-400/50 border-[#1677ff]': highlightedTemplateKey === tpl.key }"
                @click="handleSelectTemplate(tpl.key)"
              >
                <!-- 顶部 3D 缩略图横幅 -->
                <div
                  class="h-[68px] w-full border-b border-slate-100 flex items-center justify-center relative overflow-hidden select-none"
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
                    class="absolute top-1.5 right-1.5 text-[9.5px] px-1.5 py-0.2 rounded-full font-semibold shadow-2xs leading-none"
                    :class="tpl.tagBadgeClass"
                  >
                    {{ getFieldText(tpl, 'tag') }}
                  </span>
                </div>

                <!-- 底部标题与字段统计 -->
                <div class="p-2.5 flex flex-col flex-1 justify-center">
                  <div class="text-[11.5px] font-bold text-slate-800 group-hover:text-[#1677ff] transition-colors truncate leading-tight">
                    {{ getFieldText(tpl, 'title') }}
                  </div>
                  <div class="text-[10px] text-slate-400 truncate leading-normal mt-1 flex items-center gap-1">
                    <FileText class="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{{ getFieldText(tpl, 'stats') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import wizardIllustrationImg from '@/assets/templates/wizard-illustration.webp';
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import {
  FilePlus2,
  LayoutTemplate,
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

const templatesSectionRef = ref<HTMLElement | null>(null);
const highlightedTemplateKey = ref<string | null>(null);

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
    tagBadgeClass: 'bg-purple-100/95 text-purple-700'
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
    tagBadgeClass: 'bg-emerald-100/95 text-emerald-700'
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
    tagBadgeClass: 'bg-blue-100/95 text-blue-700'
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

// 点击“从下方选择模板 ↓”时微高亮提示下方模板
function scrollToTemplates() {
  highlightedTemplateKey.value = 'kyc-customer';
  templatesSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => {
    highlightedTemplateKey.value = null;
  }, 1200);
}

// 鼠标 3D 微视差浮动
const tiltX = ref(0);
const tiltY = ref(0);

function handleMouseMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  tiltX.value = Number((x / 22).toFixed(2));
  tiltY.value = Number((-y / 22).toFixed(2));
}

function handleMouseLeave() {
  tiltX.value = 0;
  tiltY.value = 0;
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

@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-gentle-float {
  animation: gentleFloat 5s ease-in-out infinite;
}
</style>
