<template>
  <a-modal
    v-model:visible="modalVisible"
    :width="'min(840px, 94vw)'"
    :align-center="true"
    :footer="false"
    :header="false"
    :closable="false"
    draggable
    unmount-on-close
    :mask-closable="true"
    :esc-to-close="true"
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
      <!-- 顶栏：Logo | DIY 表单设计器 + 关闭按钮 (紧凑规范 8px 架构) -->
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

        <!-- 关闭按钮 (方案 A 即开即用：点击关闭直接进入已就绪的画布) -->
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          :title="t('common.close') || '关闭'"
          @click="handleClose"
        >
          <X class="h-4 w-4" />
        </button>
      </header>

      <!-- 主体内容区：纯粹舒展的「1（Hero横幅）+ 3（精选模板）」黄金单体结构 -->
      <div class="p-6 pt-5 pb-5 select-none">
        
        <!-- 上方 Hero 横幅：新建空白画布 (主角，全宽舒展，8px 圆角，一体化蓝白微光渐变) -->
        <div
          class="group rounded-lg border border-blue-200/90 bg-gradient-to-r from-[#eef6ff] via-[#f3f7fd] to-[#f8faff] hover:border-[#1677ff] hover:shadow-sm transition-all duration-200 p-4 px-5 flex items-center justify-between cursor-pointer relative overflow-hidden mb-4"
          @click="handleCreateBlank"
        >
          <!-- 左侧文案 -->
          <div class="max-w-[300px] sm:max-w-[340px] z-10">
            <h3 class="text-[15px] font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors m-0 leading-tight">
              {{ t('wizard.createBlank') }}
            </h3>
            <p class="text-[12px] text-slate-500 mt-1 m-0 leading-normal truncate">
              {{ t('wizard.createBlankDesc') }}
            </p>
          </div>

          <!-- 中间 3D 画布创意插画 (带光环轨道与浮动面板) -->
          <div class="h-[70px] w-[200px] flex items-center justify-center pointer-events-none select-none z-10">
            <img
              :src="tplBlankImg"
              alt="Blank Canvas"
              class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          <!-- 右侧高亮操作按钮 (Arco Primary 规范按钮) -->
          <div class="z-10 shrink-0">
            <a-button
              type="primary"
              size="small"
              class="rounded font-medium px-4 h-8 shadow-2xs bg-[#1677ff] hover:bg-blue-600 flex items-center gap-1"
            >
              <span>{{ t('wizard.createNowBtn') }}</span>
              <ArrowRight class="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a-button>
          </div>
        </div>

        <!-- 下方区域：精选 KYC 模板 + 紧凑分类药丸 -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <h4 class="text-[13.5px] font-bold text-slate-800 m-0">
              {{ t('wizard.featuredTemplates') }}
            </h4>

            <!-- 分类过滤药丸 Tabs: 全部 / 客户 / 个人 / 机构 (4px 紧凑微圆角) -->
            <div class="bg-slate-100 p-0.5 rounded flex items-center gap-0.5 text-[11px]">
              <button
                v-for="cat in categoryTabs"
                :key="cat.key"
                type="button"
                class="px-2.5 py-0.5 rounded transition-all cursor-pointer select-none"
                :class="selectedCategory === cat.key ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-700'"
                @click.stop="selectedCategory = cat.key"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- 模板卡片网格 (3 列，充足宽度，每张卡片宽敞舒展) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-2">
            <div
              v-for="tpl in filteredTemplates"
              :key="tpl.key"
              class="group rounded-lg border bg-white hover:shadow-sm flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden"
              :class="tpl.cardBorderClass"
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
                    class="absolute top-2 right-2 text-[9.5px] px-1.5 py-0.5 rounded font-semibold shadow-2xs leading-none"
                    :class="tpl.tagBadgeClass"
                  >
                    {{ getFieldText(tpl, 'tag') }}
                  </span>
                </div>

                <!-- 标题与字段统计 -->
                <div class="p-3 pb-2">
                  <h5 class="text-[12.5px] font-bold text-slate-800 group-hover:text-[#1677ff] transition-colors m-0 leading-tight truncate">
                    {{ getFieldText(tpl, 'title') }}
                  </h5>
                  <p class="text-[11px] text-slate-400 mt-1 m-0 leading-normal flex items-center gap-1 truncate">
                    <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{{ getFieldText(tpl, 'stats') }}</span>
                  </p>
                </div>
              </div>

              <!-- 底部操作按钮 (Arco Secondary 规范按钮) -->
              <div class="p-3 pt-0">
                <a-button
                  type="secondary"
                  long
                  class="welcome-card-btn rounded font-medium text-[11.5px] text-slate-700 hover:text-[#1677ff] flex items-center justify-center gap-1"
                >
                  <span>{{ store.currentLocale === 'en' ? 'Load Template' : '载入模板' }}</span>
                  <ArrowRight class="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部轻量指引 -->
        <div class="text-center text-[11px] text-slate-400 pt-2 select-none">
          {{ t('wizard.hintClickCard') }}
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
import tplBlankImg from '@/assets/templates/tpl-blank.webp';
import tplCustomerImg from '@/assets/templates/tpl-customer.webp';
import tplEntityImg from '@/assets/templates/tpl-entity.webp';
import tplIndividualImg from '@/assets/templates/tpl-individual.webp';
import {
  ArrowRight,
  X,
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

// 分类筛选药丸: 'all' | 'customer' | 'individual' | 'entity'
const selectedCategory = ref<'all' | 'customer' | 'individual' | 'entity'>('all');

const categoryTabs = computed(() => [
  { key: 'all' as const, label: t('wizard.filterAll') },
  { key: 'customer' as const, label: t('wizard.filterCustomer') },
  { key: 'individual' as const, label: t('wizard.filterIndividual') },
  { key: 'entity' as const, label: t('wizard.filterEntity') }
]);

const scenarioTemplates = [
  {
    key: 'kyc-customer' as const,
    category: 'customer' as const,
    title: '客户案例 KYC 模板',
    title_en: 'Customer Registration',
    tag: '客户案例',
    tag_en: 'Customer',
    stats: '3 页面 · 9 字段',
    stats_en: '3 Pages · 9 Fields',
    image: tplCustomerImg,
    bannerBgClass: 'bg-[#faf5ff]',
    tagBadgeClass: 'bg-purple-100/95 text-purple-700',
    cardBorderClass: 'border-purple-200/90 hover:border-purple-400'
  },
  {
    key: 'kyc-individual' as const,
    category: 'individual' as const,
    title: '个人案例 KYC 模板',
    title_en: 'Individual KYC',
    tag: '个人成员',
    tag_en: 'Individual',
    stats: '5 页面 · 15 字段',
    stats_en: '5 Pages · 15 Fields',
    image: tplIndividualImg,
    bannerBgClass: 'bg-[#f0fdf4]',
    tagBadgeClass: 'bg-emerald-100/95 text-emerald-700',
    cardBorderClass: 'border-emerald-200/90 hover:border-emerald-400'
  },
  {
    key: 'kyc-entity' as const,
    category: 'entity' as const,
    title: '机构案例 KYC 模板',
    title_en: 'Entity KYC',
    tag: '机构成员',
    tag_en: 'Entity',
    stats: '3 页面 · 16 字段',
    stats_en: '3 Pages · 16 Fields',
    image: tplEntityImg,
    bannerBgClass: 'bg-[#eff6ff]',
    tagBadgeClass: 'bg-blue-100/95 text-blue-700',
    cardBorderClass: 'border-blue-200/90 hover:border-blue-400'
  }
];

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') {
    return scenarioTemplates;
  }
  return scenarioTemplates.filter(tpl => tpl.category === selectedCategory.value);
});

function handleClose() {
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
  height: 28px !important;
  line-height: 1 !important;
  padding: 0 10px !important;
}

:deep(.welcome-card-btn .arco-btn-content) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  line-height: 1 !important;
}
</style>
