<template>
  <header
    class="w-full flex h-14 shrink-0 items-center justify-between px-6 relative z-40 bg-white border-b border-slate-200/80 transition-all select-none pointer-events-auto"
  >
    <!-- 左侧品牌 Logo 与标题 -->
    <div class="flex min-w-0 items-center gap-2.5">

      <!-- Logo 图片与 SG 品牌徽标 (对齐母系统 algo) -->
      <div class="flex items-center gap-1.5 shrink-0">
        <img
          :src="logoUrl"
          alt="AlgoCandy"
          class="h-[28px] w-auto max-w-[150px] object-contain shrink-0 select-none"
        />
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
          <button
            type="button"
            class="flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
            :title="t('header.confirmRename')"
            @mousedown.prevent="handleConfirmTitle"
          >
            <Check class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- 正常展示态：标题文本 + 独立修改按钮 -->
        <div
          v-else
          class="group flex items-center gap-1.5 px-2 py-1 -ml-1 rounded-md hover:bg-slate-100/80 cursor-pointer transition-colors min-w-0 select-none"
          :title="t('header.clickToRename')"
          @click="startEditTitle"
        >
          <span class="text-[13px] font-semibold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
            {{ displayTitle }}
          </span>
          <button
            type="button"
            class="flex items-center justify-center w-5 h-5 rounded text-slate-400 hover:text-[#1677ff] hover:bg-blue-50/80 group-hover:text-slate-600 transition-all cursor-pointer shrink-0"
            :title="t('header.renameForm')"
            @click.stop="startEditTitle"
          >
            <Pencil class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧操作与状态组 -->
    <div class="flex items-center gap-2.5">
      <!-- 保存状态轻量微提示 -->
      <div
        v-if="store.isDirty"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-amber-600 bg-amber-50/70 border border-amber-200/50"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span>{{ t('app.dirty') }}</span>
      </div>
      <div
        v-else-if="saveSuccess"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-600 bg-emerald-50/70 border border-emerald-200/50"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>{{ t('app.saved') }}</span>
      </div>
      <div
        v-else-if="isSaving"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-blue-600 bg-blue-50/70 border border-blue-200/50"
      >
        <Loader2 class="h-3 w-3 animate-spin shrink-0 text-blue-500" />
        <span>{{ t('app.saving') }}</span>
      </div>

      <!-- 待翻译项巡检胶囊：仅在有未翻译/未填写项时展示，纯检测与一键定位清单 -->
      <a-popover
        v-if="translationStats.untranslatedCount > 0"
        v-model:popup-visible="translationPopoverVisible"
        trigger="click"
        position="bottom"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium text-amber-700 bg-amber-50/90 border border-amber-200/80 whitespace-nowrap cursor-pointer hover:bg-amber-100 hover:border-amber-300 active:scale-95 transition-all shadow-2xs mr-1"
          :title="badgeTooltip"
        >
          <AlertCircle class="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{{ badgeText }}</span>
          <ChevronRight class="w-3 h-3 text-amber-500 shrink-0" />
        </button>

        <template #content>
          <div class="w-[320px] max-h-[360px] flex flex-col -m-1">
            <!-- 弹窗顶栏 -->
            <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <span class="text-xs font-semibold text-slate-800">
                {{ badgeText }}
              </span>
              <a-tag color="orangered" size="small" class="text-[10px]">
                {{ isMissingZh ? (store.currentLocale === 'en' ? 'Missing Chinese' : '中文待补齐') : t('header.untranslatedTag') }}
              </a-tag>
            </div>

            <!-- 清单滚动区 (按页面分组) -->
            <div class="overflow-y-auto custom-scrollbar p-2 space-y-2.5 max-h-[260px]">
              <div
                v-for="group in translationStats.groupedByPage"
                :key="group.pageId"
                class="space-y-1"
              >
                <!-- 页面标题组头 -->
                <div class="text-[11px] font-medium text-slate-500 px-1.5 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                  <span class="truncate">{{ group.pageTitle }}</span>
                  <span class="text-slate-400">({{ group.items.length }})</span>
                </div>

                <!-- 页面内的未翻译项目 -->
                <div
                  v-for="item in group.items"
                  :key="item.id"
                  class="flex items-center justify-between px-2 py-1.5 rounded-md text-xs hover:bg-blue-50/80 hover:text-[#1677ff] transition-all cursor-pointer group/item border border-transparent hover:border-blue-100"
                  @click="handleJumpToUntranslated(item)"
                >
                  <div class="min-w-0 flex-1 mr-2">
                    <div class="font-medium text-slate-700 group-hover/item:text-[#1677ff] truncate text-[12px]">
                      {{ item.fieldName }}
                    </div>
                    <div class="text-[11px] text-slate-400 group-hover/item:text-blue-500/80 truncate">
                      {{ item.targetLocale === 'zh' ? '英文' : '中文' }}: {{ item.sourceText }}
                    </div>
                  </div>
                  <ChevronRight class="w-3.5 h-3.5 text-slate-300 group-hover/item:text-[#1677ff] shrink-0 transition-transform group-hover/item:translate-x-0.5" />
                </div>
              </div>
            </div>

            <!-- 底部快速指引 -->
            <div class="px-3 py-1.5 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-400 text-center shrink-0">
              {{ isMissingZh ? (store.currentLocale === 'en' ? 'Click item to focus and switch to Chinese' : '点击条目自动定位并切至中文编辑') : (store.currentLocale === 'en' ? 'Click item to focus and switch to English' : t('header.clickToSwitchEn')) }}
            </div>
          </div>
        </template>
      </a-popover>

      <!-- 主要操作按钮 (原生标准 Arco 规范，简约不喧宾夺主) -->
      <a-space size="small">
        <!-- 操作指南快捷按钮 -->
        <a-tooltip :content="t('header.tourTooltip')" position="bottom">
          <a-button
            id="tour-guide-header-btn"
            type="text"
            class="text-slate-600 hover:text-[#1677ff] hover:bg-blue-50/80 cursor-pointer"
            @click="handleTriggerTour"
          >
            <template #icon>
              <Sparkles class="h-4 w-4 text-[#1677ff]" />
            </template>
            {{ t('header.tour') }}
          </a-button>
        </a-tooltip>

        <a-tooltip :content="`${t('app.save')} (${isMac ? '⌘S' : 'Ctrl+S'})`" position="bottom">
          <a-button
            type="secondary"
            :loading="isSaving"
            @click="handleSave"
          >
            <template #icon>
              <Save class="h-4 w-4" />
            </template>
            {{ t('app.save') }}
          </a-button>
        </a-tooltip>

        <a-button
          id="tour-preview-btn"
          type="secondary"
          @click="$emit('open-preview')"
        >
          <template #icon>
            <Eye class="h-4 w-4" />
          </template>
          {{ t('app.preview') }}
        </a-button>

        <a-button
          id="tour-deploy-btn"
          type="primary"
          @click="handleDeployClick"
        >
          <template #icon>
            <CloudUpload class="h-4 w-4" />
          </template>
          {{ t('app.deploy') }}
        </a-button>
      </a-space>

      <a-divider direction="vertical" class="mx-0.5 h-5 border-slate-300/40" />

      <!-- 语言切换组件 (对齐母系统 algo 标准规范，唯一系统语言入口) -->
      <LanguageSwitcher />

      <!-- 最右侧：头像 + 昵称 + 下拉箭头 (对齐母系统 algo 规范，无底色纯净悬浮) -->
      <a-dropdown trigger="hover" position="br" :popup-max-height="false" v-model:popup-visible="isUserDropdownOpen">
        <div
          class="flex items-center gap-1.5 px-1 py-1 cursor-pointer transition-colors select-none text-slate-700 hover:text-[#1677ff]"
          :title="store.user.nickname || 'ceshi'"
        >
          <a-avatar
            :size="26"
            class="header-user-avatar shrink-0"
          >
            <img v-if="store.user.avatar" :src="store.user.avatar" alt="Avatar" />
            <IconUser v-else class="text-white text-[13px]" />
          </a-avatar>
          <span class="text-[13px] font-medium max-w-[120px] truncate leading-none transition-colors">
            {{ store.user.nickname || 'ceshi' }}
          </span>
          <IconDown
            class="text-[10px] text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180 text-[#1677ff]': isUserDropdownOpen }"
          />
        </div>

        <template #content>
          <div class="px-3.5 py-2.5 border-b border-slate-100 min-w-[170px]">
            <div class="text-[13px] font-semibold text-slate-800 leading-tight">
              {{ store.user.nickname || 'ceshi' }}
            </div>
            <div v-if="store.org.companyName" class="text-[11px] font-medium text-blue-600 mt-1 truncate max-w-[180px]">
              {{ store.org.companyName }}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">
              {{ store.user.email || t('user.role') }}
            </div>
          </div>
          <div class="p-1">
            <a-doption @click="handleUserAction('profile')">
              <template #icon><IconUser class="text-[14px]" /></template>
              {{ t('user.profile') }}
            </a-doption>
            <a-doption @click="handleUserAction('activity')">
              <template #icon><IconHistory class="text-[14px]" /></template>
              {{ t('user.activity') }}
            </a-doption>
            <a-doption @click="handleUserAction('settings')">
              <template #icon><IconSettings class="text-[14px]" /></template>
              {{ t('user.settings') }}
            </a-doption>
            <a-divider class="my-1" />
            <a-doption class="logout-option" @click="handleUserAction('logout')">
              <template #icon><IconExport class="text-[14px]" /></template>
              {{ t('user.logout') }}
            </a-doption>
          </div>
        </template>
      </a-dropdown>
    </div>

    <!-- 5. 发布前未翻译项校验提醒弹窗 -->
    <a-modal
      v-model:visible="publishCheckModalVisible"
      :title="t('header.warnTitle')"
      :width="460"
      :title-align="'start'"
      draggable
      unmount-on-close
    >
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
          <div
            v-for="item in translationStats.untranslatedItems.slice(0, 10)"
            :key="item.id"
            class="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-white hover:text-blue-600 transition-colors cursor-pointer group"
            @click="handleJumpFromPublishCheck(item)"
          >
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
          <a-button @click="handleProceedPublish">
            {{ t('header.warnPublishAnyway') }}
          </a-button>
          <a-button type="primary" class="bg-[#1677ff]" @click="handleGoToTranslate">
            {{ t('header.warnComplete') }}
          </a-button>
        </div>
      </template>
    </a-modal>
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
  ChevronRight,
  Sparkles
} from '@lucide/vue';
import { startAppTour } from '@/utils/useAppTour';
import { translationStats, navigateToUntranslatedItem, type UntranslatedItem } from '@/utils/translationHelper';

import logoUrl from '@/assets/logo.png';

const emit = defineEmits(['open-preview', 'open-deploy']);

const isSaving = ref(false);
const saveSuccess = ref(false);
const isUserDropdownOpen = ref(false);
const publishCheckModalVisible = ref(false);
const translationPopoverVisible = ref(false);

const isMissingZh = computed(() => {
  return translationStats.value.untranslatedItems[0]?.targetLocale === 'zh';
});

const badgeText = computed(() => {
  if (isMissingZh.value) {
    return store.currentLocale === 'en'
      ? `${translationStats.value.untranslatedCount} items missing Chinese`
      : `还有 ${translationStats.value.untranslatedCount} 项中文未填写`;
  }
  return t('header.itemsUntranslated', undefined, { count: translationStats.value.untranslatedCount });
});

const badgeTooltip = computed(() => {
  if (isMissingZh.value) {
    return store.currentLocale === 'zh' ? '点击查看未填写的中文项' : 'Click to view items missing Chinese';
  }
  return store.currentLocale === 'zh' ? t('header.clickToSwitchEn') : t('header.hasUntranslated');
});

function handleJumpToUntranslated(item: UntranslatedItem) {
  translationPopoverVisible.value = false;
  navigateToUntranslatedItem(item);
  Message.info({
    content: item.targetLocale === 'zh' ? t('header.switchedZh') : t('header.switchedEn'),
    duration: 1200
  });
}

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
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
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
:deep(.logout-option) {
  color: #ef4444;
}
:deep(.logout-option:hover) {
  background-color: #fef2f2;
}
</style>
