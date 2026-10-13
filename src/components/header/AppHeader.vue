<template>
  <header
    class="w-full flex h-14 shrink-0 items-center justify-between px-6 relative z-40 transition-all select-none pointer-events-auto"
    style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.35) 55%, rgba(255, 255, 255, 0) 100%);"
  >
    <!-- 左侧返回按钮、品牌 Logo 与标题 -->
    <div class="flex min-w-0 items-center gap-2.5">
      <!-- 回退按钮 -->
      <a-tooltip :content="store.currentLocale === 'en' ? 'Back' : '返回上一页'" position="bottom">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/90 bg-white/85 text-slate-600 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-blue-300 hover:bg-white hover:text-[#1677ff] hover:shadow-xs active:scale-95 shrink-0 cursor-pointer"
          @click="handleGoBack"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
      </a-tooltip>

      <div class="h-4 w-px bg-slate-200/90 shrink-0" />

      <!-- Logo 图片 (本地优先，杜绝混合内容与外链离线失效) -->
      <img
        :src="logoUrl"
        alt="AlgoCandy"
        class="h-[30px] w-auto max-w-[160px] object-contain shrink-0 select-none"
      />

      <!-- 分隔线 -->
      <div class="h-4 w-px bg-slate-200/90 shrink-0" />

      <!-- DIY Form Builder 标题 -->
      <div class="flex items-center min-w-0">
        <span class="text-[14px] font-semibold text-slate-800 tracking-tight whitespace-nowrap">
          DIY Form Builder
        </span>
      </div>
    </div>

    <!-- 右侧操作与状态组 -->
    <div class="flex items-center gap-2.5">
      <!-- 保存状态标签 -->
      <a-tag v-if="store.isDirty" color="orangered" size="small" class="flex items-center gap-1.5">
        <template #icon>
          <CircleAlert class="h-3 w-3" />
        </template>
        {{ t('app.dirty') }}
      </a-tag>
      <a-tag v-else-if="saveSuccess" color="green" size="small" class="flex items-center gap-1.5">
        <template #icon>
          <Check class="h-3 w-3" />
        </template>
        {{ t('app.saved') }}
      </a-tag>
      <a-tag v-else-if="isSaving" color="arcoblue" size="small" class="flex items-center gap-1.5">
        <template #icon>
          <Loader2 class="h-3 w-3 animate-spin" />
        </template>
        {{ t('app.saving') }}
      </a-tag>

      <!-- 主要操作按钮 (对齐 Stitch 胶囊毛玻璃按钮风格) -->
      <a-space size="small">

        <a-button
          type="secondary"
          class="header-glass-btn"
          :loading="isSaving"
          @click="handleSave"
        >
          <template #icon>
            <Save class="h-4 w-4 text-slate-600" />
          </template>
          {{ t('app.save') }}
        </a-button>

        <a-button
          id="tour-preview-btn"
          type="secondary"
          class="header-glass-btn"
          @click="$emit('open-preview')"
        >
          <template #icon>
            <Eye class="h-4 w-4 text-slate-600" />
          </template>
          {{ t('app.preview') }}
        </a-button>

        <a-button
          id="tour-deploy-btn"
          type="primary"
          class="header-primary-btn"
          @click="$emit('open-deploy')"
        >
          <template #icon>
            <CloudUpload class="h-4 w-4" />
          </template>
          {{ t('app.deploy') }}
        </a-button>
      </a-space>

      <a-divider direction="vertical" class="mx-0.5 h-5 border-slate-300/40" />

      <!-- 语言切换组件 -->
      <LanguageSwitcher />

      <!-- 布局折叠与新手引导快捷菜单 -->
      <a-dropdown trigger="click" position="br">
        <a-button
          type="secondary"
          size="medium"
          class="header-icon-btn"
          :title="t('app.settings')"
        >
          <template #icon>
            <Settings class="h-4 w-4 text-slate-500" />
          </template>
        </a-button>
        <template #content>
          <div class="p-2 space-y-2 min-w-[170px]">
            <div class="text-[12px] font-medium text-slate-400 px-1">{{ t('app.settings') }}</div>
            <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
              <span class="text-[13px] text-slate-700">{{ t('app.leftSidebar') }}</span>
              <a-switch v-model="store.leftSidebarVisible" size="small" />
            </div>
            <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
              <span class="text-[13px] text-slate-700">{{ t('app.rightSidebar') }}</span>
              <a-switch v-model="store.rightSidebarVisible" size="small" />
            </div>
            <a-divider style="margin: 4px 0" />
            <button
              type="button"
              class="w-full flex items-center justify-between px-1.5 py-1 text-left hover:bg-blue-50 text-[#1677ff] rounded transition-colors text-[13px] font-medium cursor-pointer"
              @click="handleTriggerTour"
            >
              <span>{{ store.currentLocale === 'en' ? 'Product Tour' : '新手漫游引导' }}</span>
              <Sparkles class="h-3.5 w-3.5" />
            </button>
          </div>
        </template>
      </a-dropdown>

      <a-divider direction="vertical" class="mx-0.5 h-5 border-slate-300/40" />

      <!-- 最右侧：纯圆形头像徽章 (对标 Stitch 截图，悬浮微光独立头像) -->
      <a-dropdown trigger="click" position="br" v-model:popup-visible="isUserDropdownOpen">
        <div
          class="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-blue-400/50 cursor-pointer transition-all select-none"
          :class="{ 'ring-2 ring-[#1677ff]': isUserDropdownOpen }"
          title="ceshi"
        >
          <a-avatar
            :size="32"
            class="header-user-avatar"
          >
            <IconUser class="text-white text-[15px]" />
          </a-avatar>
        </div>

        <template #content>
          <div class="px-3.5 py-2.5 border-b border-slate-100 min-w-[170px]">
            <div class="text-[13px] font-semibold text-slate-800 leading-tight">ceshi</div>
            <div class="text-[11px] text-slate-400 mt-0.5">{{ t('user.role') }}</div>
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
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { store, buildSchema, establishBaseline } from '@/core/store';
import { FormAPI } from '@/core/api';
import { t } from '@/core/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import { Message } from '@arco-design/web-vue';
import {
  IconUser,
  IconSettings,
  IconHistory,
  IconExport
} from '@arco-design/web-vue/es/icon';
import {
  ArrowLeft,
  Settings,
  Save,
  Eye,
  CloudUpload,
  Check,
  CircleAlert,
  Loader2,
  Sparkles
} from '@lucide/vue';
import { startAppTour } from '@/utils/useAppTour';

defineEmits(['open-preview', 'open-deploy']);

const logoUrl = `${import.meta.env.BASE_URL}img/algocandy-logo.png`;
const isSaving = ref(false);
const saveSuccess = ref(false);
const isUserDropdownOpen = ref(false);

function handleTriggerTour() {
  startAppTour();
}

function handleGoBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}

function handleUserAction(action: string) {
  isUserDropdownOpen.value = false;
  if (action === 'logout') {
    Message.warning(store.currentLocale === 'en' ? 'Logged out successfully' : '已成功退出登录');
  } else if (action === 'profile') {
    Message.info(store.currentLocale === 'en' ? 'User profile opened' : '已进入个人中心');
  } else if (action === 'activity') {
    Message.info(store.currentLocale === 'en' ? 'Activity log opened' : '已进入操作日志');
  } else if (action === 'settings') {
    Message.info(store.currentLocale === 'en' ? 'Account settings opened' : '已进入账号设置');
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
      Message.success('表单配置已成功保存！');
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    } else {
      Message.error('保存失败，请检查网络或重试');
    }
  } catch (e) {
    console.error('Save failed:', e);
    Message.error('保存遇到异常，请重试');
  } finally {
    isSaving.value = false;
  }
}
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
