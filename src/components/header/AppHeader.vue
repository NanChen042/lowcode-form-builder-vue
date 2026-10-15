<template>
  <header class="w-full flex h-14 shrink-0 items-center justify-between px-6 relative z-40 bg-white border-b border-slate-200/80 transition-all select-none pointer-events-auto">
    <!-- 左侧品牌 Logo 与标题 -->
    <div class="flex min-w-0 items-center gap-2.5">

      <!-- Logo 图片与 SG 品牌徽标 (对齐母系统 algo) -->
      <div class="flex items-center gap-1.5 shrink-0">
        <img :src="logoUrl" alt="AlgoCandy" class="h-[28px] w-auto max-w-[150px] object-contain shrink-0 select-none" />
        <span class="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded border border-slate-200/80 leading-none select-none tracking-wider">
          SG
        </span>
      </div>

      <!-- 分隔线 -->
      <div class="h-4 w-px bg-slate-200/90 shrink-0" />

      <!-- 表单名称（支持就地编辑与独立修改按钮） -->
      <div class="flex items-center min-w-0">
        <!-- 编辑输入态 -->
        <div v-if="isEditingTitle" class="flex items-center gap-1.5 min-w-0">
          <input ref="titleInputRef" v-model="editTitleValue" type="text" maxlength="50" class="h-7 w-[180px] sm:w-[240px] px-2 text-[13px] font-medium text-slate-800 bg-white border border-blue-500 rounded-md shadow-2xs outline-none ring-2 ring-blue-100 transition-all" :placeholder="t('header.formTitlePlaceholder')" @keydown.enter.prevent="handleConfirmTitle" @keydown.esc.prevent="handleCancelTitle" @blur="handleConfirmTitle" />
          <button type="button" class="flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0" :title="t('header.confirmRename')" @mousedown.prevent="handleConfirmTitle">
            <Check class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- 正常展示态：标题文本 + 独立修改按钮 -->
        <div v-else class="group flex items-center gap-1.5 px-2 py-1 -ml-1 rounded-md hover:bg-slate-100/80 cursor-pointer transition-colors min-w-0 select-none" :title="t('header.clickToRename')" @click="startEditTitle">
          <span class="text-[13px] font-semibold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
            {{ displayTitle }}
          </span>
          <button type="button" class="flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-blue-50/80 group-hover:text-slate-600 transition-all cursor-pointer shrink-0" :title="t('header.renameForm')" @click.stop="startEditTitle">
            <Pencil class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧操作与状态组 -->
    <div class="flex items-center gap-2.5">
      <!-- 保存状态轻量微提示 -->
      <div v-if="store.isDirty" class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-amber-600 bg-amber-50/70 border border-amber-200/50">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span>{{ t('app.dirty') }}</span>
      </div>
      <div v-else-if="saveSuccess" class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-600 bg-emerald-50/70 border border-emerald-200/50">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>{{ t('app.saved') }}</span>
      </div>
      <div v-else-if="isSaving" class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-blue-600 bg-blue-50/70 border border-blue-200/50">
        <Loader2 class="h-3 w-3 animate-spin shrink-0 text-blue-500" />
        <span>{{ t('app.saving') }}</span>
      </div>



      <!-- 主要操作按钮 (原生标准 Arco 规范，简约不喧宾夺主) -->
      <a-space size="small">
        <a-tooltip :content="`${t('app.save')} (${isMac ? '⌘S' : 'Ctrl+S'})`" position="bottom">
          <a-button type="secondary" :loading="isSaving" @click="handleSave">
            <template #icon>
              <Save class="h-4 w-4" />
            </template>
            {{ t('app.save') }}
          </a-button>
        </a-tooltip>

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

      <!-- 语言切换组件 (对齐母系统 algo 标准规范，唯一系统语言入口) -->
      <LanguageSwitcher />

      <!-- 问号新手引导 / 操作指南快捷入口 (HelpCircle) -->
      <a-tooltip :content="t('header.tourTooltip')" position="bottom">
        <button
          id="tour-guide-btn"
          type="button"
          class="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#1677ff] hover:bg-slate-100 transition-colors cursor-pointer"
          :title="t('header.tourTooltip')"
          @click="handleTriggerTour"
        >
          <HelpCircle class="w-4 h-4" />
        </button>
      </a-tooltip>

      <!-- 最右侧：头像 + 昵称 + 下拉箭头 (对齐母系统 algo 规范，无底色纯净悬浮) -->
      <a-dropdown trigger="hover" position="br" :popup-max-height="false" v-model:popup-visible="isUserDropdownOpen">
        <div class="flex items-center gap-1.5 px-1 py-1 cursor-pointer transition-colors select-none text-slate-700 hover:text-[#1677ff]" :title="store.user.nickname || 'ceshi'">
          <a-avatar :size="26" class="header-user-avatar shrink-0">
            <img v-if="store.user.avatar" :src="store.user.avatar" alt="Avatar" />
            <IconUser v-else class="text-white text-[13px]" />
          </a-avatar>
          <span class="text-[13px] font-medium max-w-[120px] truncate leading-none transition-colors">
            {{ store.user.nickname || 'ceshi' }}
          </span>
          <IconDown class="text-[10px] text-slate-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180 text-[#1677ff]': isUserDropdownOpen }" />
        </div>

        <template #content>
          <div class="px-3.5 py-2.5 border-b border-slate-100 min-w-[170px]">
            <div class="text-[13px] font-semibold text-slate-800 leading-tight">
              {{ store.user.nickname || 'ceshi' }}
            </div>
            <div v-if="store.org.companyName" class="text-[11px] font-medium text-blue-600 mt-1 truncate max-w-[180px]">
              {{ store.org.companyName }}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">
              {{ store.user.email || t('user.role') }}
            </div>
          </div>
          <div class="p-1">
            <a-doption @click="handleUserAction('profile')">
              <template #icon>
                <IconUser class="text-[14px]" />
              </template>
              {{ t('user.profile') }}
            </a-doption>
            <a-doption @click="handleUserAction('activity')">
              <template #icon>
                <IconHistory class="text-[14px]" />
              </template>
              {{ t('user.activity') }}
            </a-doption>
            <a-doption @click="handleUserAction('settings')">
              <template #icon>
                <IconSettings class="text-[14px]" />
              </template>
              {{ t('user.settings') }}
            </a-doption>
            <div class="h-px bg-slate-100 my-1 mx-1"></div>
            <a-doption class="logout-option" @click="handleUserAction('logout')">
              <template #icon>
                <IconExport class="text-[14px]" />
              </template>
              {{ t('user.logout') }}
            </a-doption>
          </div>
        </template>
      </a-dropdown>
    </div>

    <!-- 5. 发布前未翻译项校验提醒弹窗 -->
    <a-modal v-model:visible="publishCheckModalVisible" :title="t('header.warnTitle')" :width="460" :title-align="'start'" draggable unmount-on-close>
      <div class="py-2 space-y-3">
        <div class="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs leading-relaxed">
          <AlertCircle class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span class="font-semibold block mb-0.5">
              {{ t('header.warnCount', undefined, { count: translationStats.untranslatedCount }) }}
            </span>
            <span class="text-amber-700 text-[11.5px]">
              {{ t('header.warnDesc') }}
            </span>
          </div>
        </div>

        <!-- 缺失项列表快速预览 -->
        <div class="max-h-[170px] overflow-y-auto custom-scrollbar rounded-lg border border-slate-200 p-1.5 space-y-1 bg-slate-50/50">
          <div v-for="item in translationStats.untranslatedItems.slice(0, 10)" :key="item.id" class="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-white hover:text-blue-600 transition-colors cursor-pointer group" @click="handleJumpFromPublishCheck(item)">
            <span class="text-slate-700 group-hover:text-blue-600 truncate pr-2 font-medium">
              {{ item.fieldName }}
            </span>
            <span class="font-mono text-[10px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60 shrink-0">
              P{{ item.pageIndex + 1 }} · {{ t('header.untranslatedTag') }}
            </span>
          </div>
          <div v-if="translationStats.untranslatedItems.length > 10" class="text-center text-[11px] text-slate-400 py-1">
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

    <!-- 顶部 2.5px 极光流动微进度条 (Linear / Vercel 风格，无感且优雅) -->
    <transition name="nano-progress-fade">
      <div v-if="store.isCanvasLoading" class="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden pointer-events-none z-50 bg-blue-50/70">
        <div class="nano-stream-bar h-full w-full" />
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { store, buildSchema, establishBaseline, markDirty } from '@/core/store';
import { FormAPI } from '@/core/api';
import { t } from '@/core/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { Message } from '@arco-design/web-vue';
import {
  IconUser,
  IconSettings,
  IconHistory,
  IconExport,
  IconDown
} from '@arco-design/web-vue/es/icon';
import {
  Save,
  Eye,
  CloudUpload,
  Check,
  AlertCircle,
  Loader2,
  Pencil,
  HelpCircle
} from '@lucide/vue';
import { startAppTour } from '@/utils/useAppTour';
import { translationStats, navigateToUntranslatedItem, type UntranslatedItem } from '@/utils/translationHelper';

import logoUrl from '@/assets/logo.png';

const emit = defineEmits(['open-preview', 'open-deploy']);

const isSaving = ref(false);
const saveSuccess = ref(false);
const isUserDropdownOpen = ref(false);
const publishCheckModalVisible = ref(false);




function handleDeployClick() {
  if (translationStats.value.untranslatedCount > 0) {
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
    return store.meta.title_en?.trim() || store.meta.title?.trim() || t('header.untitledForm');
  }
  return store.meta.title?.trim() || t('header.untitledForm');
});

function startEditTitle() {
  if (store.currentLocale === 'en') {
    editTitleValue.value = store.meta.title_en || store.meta.title || '';
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

function handleCancelTitle() {
  isEditingTitle.value = false;
}





function handleUserAction(action: string) {
  isUserDropdownOpen.value = false;
  if (action === 'logout') {
    Message.warning(t('header.loggedOut'));
  } else if (action === 'profile') {
    Message.info(t('header.profileOpened'));
  } else if (action === 'activity') {
    Message.info(t('header.activityOpened'));
  } else if (action === 'settings') {
    Message.info(t('header.settingsOpened'));
  }
}

async function handleSave() {
  if (isSaving.value) return;
  isSaving.value = true;
  saveSuccess.value = false;

  try {
    const schema = buildSchema();
    const res = await FormAPI.saveTemplate(schema);
    if (res.success) {
      establishBaseline();
      saveSuccess.value = true;
      Message.success(t('header.saveSuccess'));
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    } else {
      Message.error(t('header.saveFailed'));
    }
  } catch (e) {
    console.error('Save failed:', e);
    Message.error(t('header.saveError'));
  } finally {
    isSaving.value = false;
  }
}

function handleTriggerTour() {
  startAppTour();
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function handleGlobalKeyDown(e: KeyboardEvent) {
  // 拦截 Ctrl+S (Windows/Linux) 或 Cmd+S (Mac)，阻止浏览器原生另存为网页行为，执行应用保存
  if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyS' || (e.key && e.key.toLowerCase() === 's'))) {
    e.preventDefault();
    e.stopPropagation();
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

:deep(.logout-option),
:deep(.logout-option .arco-dropdown-option-icon),
:deep(.logout-option .arco-dropdown-option-content) {
  color: #ef4444 !important;
}

:deep(.logout-option:hover) {
  background-color: #fef2f2 !important;
}

:deep(.logout-option:hover .arco-dropdown-option-icon),
:deep(.logout-option:hover .arco-dropdown-option-content) {
  color: #dc2626 !important;
}

/* 顶部极光微流光进度条 */
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
