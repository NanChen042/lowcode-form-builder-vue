<template>
  <header class="w-full flex h-14 shrink-0 items-center justify-between px-6 relative z-40 bg-white border-b border-slate-200/80 transition-all select-none pointer-events-auto">
    <div class="flex min-w-0 items-center gap-2.5">
      <div class="flex items-center gap-1.5 shrink-0">
        <img :src="logoUrl" alt="AlgoCandy" class="h-[28px] w-auto max-w-[150px] object-contain shrink-0 select-none" />
        <span class="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded border border-slate-200/80 leading-none select-none tracking-wider">
          SG
        </span>
      </div>

      <div class="h-4 w-px bg-slate-200/90 shrink-0" />

      <div class="flex items-center min-w-0">
        <div v-if="isEditingTitle" class="flex items-center min-w-0">
          <input
            ref="titleInputRef"
            v-model="editTitleValue"
            type="text"
            maxlength="50"
            class="h-7 w-[180px] sm:w-[240px] px-2 text-[13px] font-medium text-slate-800 bg-white border border-blue-500 rounded-md shadow-2xs outline-none ring-2 ring-blue-100 transition-all"
            :placeholder="t('header.formTitlePlaceholder')"
            @keydown.enter.prevent="handleConfirmTitle"
            @keydown.esc.prevent="handleCancelTitle"
            @blur="handleConfirmTitle"
          />
        </div>

        <div v-else class="group flex items-center gap-1.5 px-2 py-1 -ml-1 rounded-md hover:bg-slate-100/80 cursor-pointer transition-colors min-w-0 select-none" :title="t('header.clickToRename')" @click="startEditTitle">
          <span class="text-[13px] font-semibold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
            {{ displayTitle }}
          </span>
          <button type="button" class="flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-blue-50/80 group-hover:text-slate-600 transition-all cursor-pointer shrink-0" :title="t('header.renameForm')" @click.stop="startEditTitle">
            <Pencil class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- 文档保存状态指示器 (紧随表单名称右侧，符合飞书/Figma/宜搭工作台规范) -->
      <div v-if="isSaving" class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50/70 text-[11.5px] font-medium text-blue-600 select-none shrink-0">
        <Loader2 class="h-3 w-3 animate-spin shrink-0 text-blue-500" />
        <span>{{ t('app.saving') }}</span>
      </div>
      <div v-else-if="store.isDirty && store.lastSavedHash" class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50/80 text-[11.5px] font-medium text-amber-600 select-none shrink-0" :title="t('app.dirty')">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span>{{ t('app.dirty') }}</span>
      </div>
      <div v-else-if="!store.isDirty && store.lastSavedTime" class="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100/80 text-[11.5px] font-medium text-slate-500 select-none shrink-0" :title="t('app.saved')">
        <Check class="w-3 h-3 text-emerald-500 stroke-[2.4] shrink-0" />
        <span>{{ store.currentLocale === 'en' ? `Draft saved ${store.lastSavedTime}` : `已保存至草稿 ${store.lastSavedTime}` }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <!-- 表单业务属性：双语问卷能力开关 -->
      <div class="flex items-center gap-1.5 select-none shrink-0" :title="t('header.bilingualTooltip')">
        <span class="text-slate-600 font-medium text-[12px] leading-none">{{ t('header.bilingualSwitch') }}</span>
        <a-switch
          size="small"
          :model-value="isBilingual"
          @change="handleToggleBilingual"
        />

        <!-- 引导与使用说明 Popover (包含视频演示卡片入口) -->
        <a-popover
          position="bottom"
          trigger="hover"
          :content-style="{ padding: '12px 14px', width: '300px', boxSizing: 'border-box' }"
        >
          <button
            type="button"
            class="flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
            :title="t('header.bilingualGuideTitle')"
          >
            <HelpCircle class="w-3.5 h-3.5" />
          </button>
          <template #content>
            <div class="space-y-2.5 antialiased" style="transform: translateZ(0); backface-visibility: hidden;">
              <div class="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                <Languages class="w-4 h-4 text-blue-500 shrink-0" />
                <span>{{ t('header.bilingualGuideTitle') }}</span>
              </div>
              <p class="text-[12px] text-slate-600 leading-relaxed m-0 break-words">
                {{ t('header.bilingualGuideDesc') }}
              </p>

              <!-- 视频演示封面入口 -->
              <div
                class="group relative mt-2 rounded-lg overflow-hidden border border-slate-200/90 cursor-pointer shadow-xs transition-all hover:shadow-md hover:border-blue-400 select-none aspect-[16/9] w-full bg-slate-900"
                @click="handleOpenVideoModal"
              >
                <img
                  :src="currentGuideCover"
                  alt="Video Guide Cover"
                  width="1024"
                  height="576"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 block"
                />
                <div class="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors pointer-events-none"></div>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-11 h-11 rounded-full bg-white/95 text-[#1677ff] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-200">
                    <Play class="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </a-popover>
      </div>

      <a-divider direction="vertical" class="mx-0.5 h-5 border-slate-300/40" />

      <a-space size="small">
        <a-button
          type="secondary"
          :loading="isSaving"
          :disabled="!store.isDirty"
          @click="handleSave"
        >
          <template #icon>
            <Save class="h-4 w-4" />
          </template>
          {{ t('app.save') }}
        </a-button>

        <a-button id="tour-preview-btn" type="secondary" @click="$emit('open-preview')">
          <template #icon>
            <Eye class="h-4 w-4" />
          </template>
          {{ t('app.preview') }}
        </a-button>

        <a-button id="tour-deploy-btn" type="primary" @click="handleDeployClick">
          <template #icon>
            <CloudUpload class="h-4 w-4" />
          </template>
          {{ t('app.deploy') }}
        </a-button>
      </a-space>

      <a-divider direction="vertical" class="mx-0.5 h-5 border-slate-300/40" />

      <LanguageSwitcher />

      <a-dropdown trigger="hover" position="br" :popup-max-height="false" v-model:popup-visible="isUserDropdownOpen">
        <div
          class="flex items-center justify-center p-0.5 rounded-full cursor-pointer transition-all select-none ring-2"
          :class="isUserDropdownOpen ? 'ring-blue-400/70' : 'ring-transparent hover:ring-slate-200'"
        >
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 overflow-hidden border border-slate-200 shadow-2xs bg-[#EFF6FF] shrink-0">
            <img v-if="store.user.avatar" class="w-full h-full object-cover" :src="store.user.avatar" alt="" @error="($event.target as HTMLElement).style.display='none'" />
            <span v-else class="w-full h-full text-[#186DF5] font-bold flex items-center justify-center text-xs">
              {{ store.user.nickname ? store.user.nickname.charAt(0).toUpperCase() : 'U' }}
            </span>
          </div>
        </div>

        <template #content>
          <div class="w-[260px] px-3.5 py-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 overflow-hidden border border-slate-200 bg-[#EFF6FF] shrink-0">
                <img v-if="store.user.avatar" class="w-full h-full object-cover" :src="store.user.avatar" alt="" @error="($event.target as HTMLElement).style.display='none'" />
                <span v-else class="w-full h-full text-[#186DF5] font-bold flex items-center justify-center text-sm">
                  {{ store.user.nickname ? store.user.nickname.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-[14px] font-semibold text-slate-900 leading-snug truncate">
                  {{ store.user.nickname }}
                </div>
                <div class="text-[11.5px] text-slate-400 mt-0.5 truncate leading-normal">
                  {{ store.user.email || t('user.role') }}
                </div>
              </div>
              <a-tooltip :content="t('user.logout')" position="bottom">
                <button
                  type="button"
                  class="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  @click="handleUserAction('logout')"
                >
                  <IconExport class="text-[15px]" />
                </button>
              </a-tooltip>
            </div>

            <div
              v-if="store.org.companyName"
              class="mt-2.5 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-100 flex items-start gap-1.5 text-[11.5px] text-slate-600 font-medium"
            >
              <img :src="companyIcon" alt="Company" class="w-3.5 h-3.5 object-contain opacity-65 shrink-0 mt-0.5" />
              <span class="line-clamp-2 leading-snug break-words">{{ store.org.companyName }}</span>
            </div>
          </div>
        </template>
      </a-dropdown>
    </div>

    <a-modal
      v-model:visible="publishCheckModalVisible"
      :title="t('header.warnTitle')"
      :width="480"
      :title-align="'start'"
      draggable
      unmount-on-close
    >
      <div class="py-1 space-y-3">
        <!-- 标准 Arco Warning 警示条 -->
        <a-alert type="warning" class="rounded">
          <template #title>
            <span class="font-medium text-xs">
              {{ t('header.warnCount', undefined, { count: translationStats.untranslatedCount }) }}
            </span>
          </template>
          <div class="text-[12px] text-slate-600 leading-relaxed mt-0.5">
            {{ t('header.warnDesc') }}
          </div>
        </a-alert>

        <!-- 待完善字段项列表 -->
        <div class="max-h-[160px] overflow-y-auto space-y-1.5 custom-scrollbar">
          <div
            v-for="item in translationStats.untranslatedItems.slice(0, 10)"
            :key="item.id"
            class="flex items-center justify-between py-2 px-3 rounded border border-slate-200/80 bg-white hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer text-xs transition-colors"
            @click="handleJumpFromPublishCheck(item)"
          >
            <span class="text-slate-700 font-medium truncate pr-3">{{ item.fieldName }}</span>
            <a-tag size="small" color="orange" class="shrink-0">
              P{{ item.pageIndex + 1 }} · {{ t('header.untranslatedTag') }}
            </a-tag>
          </div>

          <div v-if="translationStats.untranslatedItems.length > 10" class="text-center text-[11px] text-slate-400 pt-1">
            {{ t('header.warnMore', undefined, { count: translationStats.untranslatedItems.length - 10 }) }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <a-button type="primary" class="bg-[#1677ff]" @click="handleGoToTranslate">
            {{ t('header.warnComplete') }}
          </a-button>
          <a-button @click="handleProceedPublish">
            {{ t('header.warnPublishAnyway') }}
          </a-button>
        </div>
      </template>
    </a-modal>

    <!-- 停用中英文模式确认弹窗 -->
    <a-modal
      v-model:visible="isDisableBilingualModalVisible"
      :title="t('header.bilingualDisableTitle')"
      :title-align="'start'"
      :simple="false"
      width="420px"
      :ok-button-props="{ status: 'danger' }"
    >
      <div class="py-2 text-sm text-slate-600 leading-relaxed">
        {{ t('header.bilingualDisableDesc') }}
      </div>
      <template #footer>
        <div class="flex justify-end gap-2.5">
          <a-button status="danger" type="primary" @click="handleConfirmDisableBilingual">
            {{ t('header.bilingualDisableConfirm') }}
          </a-button>
          <a-button @click="isDisableBilingualModalVisible = false">
            {{ t('header.bilingualDisableCancel') }}
          </a-button>
        </div>
      </template>
    </a-modal>

    <!-- 双语问卷操作演示视频弹窗 (720px 高清播放，按需懒加载，无页面抖动) -->
    <a-modal
      v-model:visible="isVideoModalVisible"
      :title="t('header.bilingualVideoTitle')"
      :title-align="'start'"
      :width="720"
      :footer="false"
      :lock-scroll="false"
      draggable
      unmount-on-close
      @before-close="handleCloseVideoModal"
    >
      <div class="py-1">
        <video
          ref="videoPlayerRef"
          :src="helpVideoUrl"
          controls
          autoplay
          playsinline
          class="w-full h-auto max-h-[460px] rounded-lg bg-black object-contain shadow-sm"
        />
        <div class="mt-3 px-1 flex items-center justify-between text-xs text-slate-500">
          <span>{{ t('header.bilingualVideoTip') }}</span>
          <a-button size="small" type="primary" class="bg-[#1677ff]" @click="handleCloseVideoModal">
            {{ t('common.close') }}
          </a-button>
        </div>
      </div>
    </a-modal>

    <transition name="nano-progress-fade">
      <div v-if="store.isCanvasLoading" class="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden pointer-events-none z-50 bg-blue-50/70">
        <div class="nano-stream-bar h-full w-full" />
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import {
  store,
  buildSchema,
  establishBaseline,
  markDirty,
  syncUrlParams,
  isBilingual,
  enableBilingual,
  disableMultiLanguage,
  selectPage,
  selectElement,
  focusOnPage
} from '@/core/store';
import { FormAPI } from '@/core/api';
import { t } from '@/core/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { Message } from '@arco-design/web-vue';
import {
  IconExport
} from '@arco-design/web-vue/es/icon';
import {
  Save,
  Eye,
  CloudUpload,
  Check,
  Loader2,
  Pencil,
  HelpCircle,
  Languages,
  Play
} from '@lucide/vue';
import {
  translationStats,
  navigateToUntranslatedItem,
  type UntranslatedItem
} from '@/utils/translationHelper';

import logoUrl from '@/assets/logo.png';
import companyIcon from '@/assets/gs.png';
import helpVideoUrl from '@/help.mp4';
import guideCoverZh from '@/assets/guide-cover-zh.webp';
import guideCoverEn from '@/assets/guide-cover-en.webp';

const currentGuideCover = computed(() => {
  return store.currentLocale === 'en' ? guideCoverEn : guideCoverZh;
});

const emit = defineEmits(['open-preview', 'open-deploy']);

const isSaving = ref(false);

function formatTime(d: Date = new Date()) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

const isUserDropdownOpen = ref(false);
const publishCheckModalVisible = ref(false);

function validateFormBeforePublish(): boolean {
  const isEn = store.currentLocale === 'en';
  const formPages = store.pages.filter(p => p.pageType !== 'system_profile');
  if (formPages.length === 0) {
    Message.warning(isEn ? 'Please add at least one form page before publishing' : '请至少添加一个表单页面后再发布');
    return false;
  }

  for (let i = 0; i < store.pages.length; i++) {
    const page = store.pages[i];
    if (page.pageType === 'system_profile') continue;
    const pageNum = i + 1;

    const pageTitle = (isEn ? (page.title_en || page.title) : (page.title || page.title_en))?.trim();
    if (!pageTitle) {
      Message.warning(isEn ? `Please enter the page title for Page ${pageNum}` : `请填写第 ${pageNum} 页的页面标题`);
      focusOnPage(page.id, { duration: 350 });
      selectPage(page.id);
      store.focusedTarget = { elementId: page.id, field: 'label' };
      if (!store.rightSidebarVisible) store.rightSidebarVisible = true;
      return false;
    }

    if (!page.fields || page.fields.length === 0) {
      Message.warning(isEn ? `Page ${pageNum} has no components. Please add components or remove the empty page.` : `第 ${pageNum} 页暂无表单组件，请添加组件或删除空页面`);
      focusOnPage(page.id, { duration: 350 });
      selectPage(page.id);
      return false;
    }

    for (const field of page.fields) {
      if (field.showLabel !== false) {
        const fieldLabel = (isEn ? (field.label_en || field.label) : (field.label || field.label_en))?.trim();
        if (!fieldLabel) {
          Message.warning(isEn ? `Please enter the label for the untitled field on Page ${pageNum}` : `请填写第 ${pageNum} 页中未命名组件的标题`);
          focusOnPage(page.id, { duration: 350 });
          selectElement(field);
          store.focusedTarget = { elementId: field.id, field: 'label' };
          if (!store.rightSidebarVisible) store.rightSidebarVisible = true;
          return false;
        }
      }
    }
  }

  return true;
}

function handleDeployClick() {
  if (!validateFormBeforePublish()) return;
  if (isBilingual.value && translationStats.value.untranslatedCount > 0) {
    publishCheckModalVisible.value = true;
  } else {
    emit('open-deploy');
  }
}

function handleProceedPublish() {
  publishCheckModalVisible.value = false;
  emit('open-deploy');
}

function handleGoToTranslate() {
  publishCheckModalVisible.value = false;
  if (translationStats.value.untranslatedItems.length > 0) {
    navigateToUntranslatedItem(translationStats.value.untranslatedItems[0]);
  }
}

function handleJumpFromPublishCheck(item: UntranslatedItem) {
  publishCheckModalVisible.value = false;
  navigateToUntranslatedItem(item);
}

// 表单名称实时重命名与编辑控制
const isEditingTitle = ref(false);
const editTitleValue = ref('');
const titleInputRef = ref<HTMLInputElement | null>(null);

const displayTitle = computed(() => {
  if (store.currentLocale === 'en') {
    return store.meta.title_en?.trim() || t('header.untitledForm');
  }
  return store.meta.title?.trim() || t('header.untitledForm');
});

function startEditTitle() {
  if (store.currentLocale === 'en') {
    editTitleValue.value = store.meta.title_en || '';
  } else {
    editTitleValue.value = store.meta.title || '';
  }
  isEditingTitle.value = true;
  nextTick(() => {
    titleInputRef.value?.focus();
    titleInputRef.value?.select();
  });
}

function handleConfirmTitle() {
  if (!isEditingTitle.value) return;
  const trimmed = editTitleValue.value.trim();
  const fallback = t('header.untitledForm');
  const newTitle = trimmed || fallback;
  if (store.currentLocale === 'en') {
    if (store.meta.title_en !== newTitle) {
      store.meta.title_en = newTitle;
      markDirty();
    }
  } else {
    if (store.meta.title !== newTitle) {
      store.meta.title = newTitle;
      markDirty();
    }
  }
  isEditingTitle.value = false;
}

// 顶部中英文双语模式开关控制与引导提示
const isDisableBilingualModalVisible = ref(false);

// 双语操作演示视频弹窗控制
const isVideoModalVisible = ref(false);
const videoPlayerRef = ref<HTMLVideoElement | null>(null);

function handleOpenVideoModal() {
  isVideoModalVisible.value = true;
  nextTick(() => {
    if (videoPlayerRef.value) {
      videoPlayerRef.value.currentTime = 0;
      videoPlayerRef.value.play().catch(() => {});
    }
  });
}

function handleCloseVideoModal() {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.pause();
  }
  isVideoModalVisible.value = false;
}

function handleToggleBilingual(val: any) {
  const enable = Boolean(val);
  if (enable) {
    enableBilingual();
    Message.success(t('header.bilingualEnabledMsg'));
  } else {
    isDisableBilingualModalVisible.value = true;
  }
}

function handleConfirmDisableBilingual() {
  disableMultiLanguage();
  isDisableBilingualModalVisible.value = false;
  Message.info(t('header.bilingualDisabledMsg'));
}

function handleCancelTitle() {
  isEditingTitle.value = false;
}





function handleUserAction(action: string) {
  isUserDropdownOpen.value = false;
  if (action === 'logout') {
    window.location.href = '/pc/logout';
  } else if (action === 'profile' || action === 'settings') {
    window.open('/pc/user/index', '_blank');
  }
}

async function handleSave() {
  if (isSaving.value || !store.isDirty) return;

  isSaving.value = true;

  try {
    const schema = buildSchema();
    const res = await FormAPI.saveTemplate(schema);
    if (res.success) {
      const savedId = res.data?.id || store.meta.formId || store.meta.serialNo;
      if (savedId) {
        store.meta.formId = savedId;
        store.meta.serialNo = savedId;
        syncUrlParams(savedId);
      }
      establishBaseline();
      store.lastSavedTime = formatTime();
      Message.success(t('header.saveSuccess'));
    } else if (res.code == 409) {
      Message.error(t('publish.nameDuplicate'));
    } else {
      Message.error(t('header.saveFailed'));
    }
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    isSaving.value = false;
  }
}

function handleGlobalKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyS' || (e.key && e.key.toLowerCase() === 's'))) {
    e.preventDefault();
    e.stopPropagation();
    if (!store.isDirty || isSaving.value) return;
    handleSave();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown, true);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown, true);
});
</script>

<style scoped>
.header-user-avatar {
  background: linear-gradient(to top right, #1677ff, #69b1ff);
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.header-user-avatar:hover {
  transform: scale(1.05);
}

.nano-stream-bar {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 35%, #93c5fd 65%, #2563eb 100%);
  background-size: 200% 100%;
  animation: nano-stream-anim 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes nano-stream-anim {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(100%);
  }
}

.nano-progress-fade-enter-active,
.nano-progress-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.nano-progress-fade-enter-from,
.nano-progress-fade-leave-to {
  opacity: 0;
}
</style>
