<template>
  <header
    class="w-full flex h-14 shrink-0 items-center justify-between px-6 relative z-40 transition-all select-none pointer-events-auto"
    style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.35) 55%, rgba(255, 255, 255, 0) 100%);"
  >
    <!-- 左侧标题与标识 -->
    <div class="flex min-w-0 items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#1677ff] shrink-0 shadow-2xs border border-blue-100/60">
        <Layers class="h-4 w-4" />
      </div>
      <div>
        <div class="m-0 text-[14px] font-semibold leading-5 text-slate-800 tracking-tight">
          {{ t('app.title') }}
        </div>
        <p class="m-0 text-[11px] leading-4 text-slate-400">
          {{ t('app.subtitle') }}
        </p>
      </div>
    </div>

    <!-- 右侧操作与状态组 -->
    <div class="flex items-center gap-2.5">
      <!-- 保存状态标签 -->
      <a-tag v-if="store.isDirty" color="orangered" size="small" class="!flex items-center gap-1.5">
        <template #icon>
          <CircleAlert class="h-3 w-3" />
        </template>
        {{ t('app.dirty') }}
      </a-tag>
      <a-tag v-else-if="saveSuccess" color="green" size="small" class="!flex items-center gap-1.5">
        <template #icon>
          <Check class="h-3 w-3" />
        </template>
        {{ t('app.saved') }}
      </a-tag>
      <a-tag v-else-if="isSaving" color="arcoblue" size="small" class="!flex items-center gap-1.5">
        <template #icon>
          <Loader2 class="h-3 w-3 animate-spin" />
        </template>
        {{ t('app.saving') }}
      </a-tag>

      <!-- 主要操作按钮 (对齐 Stitch 胶囊毛玻璃按钮风格) -->
      <a-space size="small">
        <a-button
          type="secondary"
          class="!h-9 !px-3.5 !rounded-xl !bg-white/65 hover:!bg-white/95 !border-slate-300/50 !shadow-xs backdrop-blur-md !text-slate-700 !font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          :loading="isSaving"
          @click="handleSave"
        >
          <template #icon>
            <Save class="h-4 w-4 text-slate-600" />
          </template>
          {{ t('app.save') }}
        </a-button>

        <a-button
          type="secondary"
          class="!h-9 !px-3.5 !rounded-xl !bg-white/65 hover:!bg-white/95 !border-slate-300/50 !shadow-xs backdrop-blur-md !text-slate-700 !font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          @click="$emit('open-preview')"
        >
          <template #icon>
            <Eye class="h-4 w-4 text-slate-600" />
          </template>
          {{ t('app.preview') }}
        </a-button>

        <a-button
          type="primary"
          class="!h-9 !px-4 !rounded-xl !bg-[#1677ff] hover:!bg-[#4096ff] !text-white !font-medium !shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          @click="$emit('open-deploy')"
        >
          <template #icon>
            <CloudUpload class="h-4 w-4" />
          </template>
          {{ t('app.deploy') }}
        </a-button>
      </a-space>

      <a-divider direction="vertical" class="!mx-0.5 !h-5 !border-slate-300/40" />

      <!-- 语言切换组件 -->
      <LanguageSwitcher />

      <!-- 布局折叠快捷菜单 -->
      <a-dropdown trigger="click" position="br">
        <a-button
          type="secondary"
          shape="circle"
          size="medium"
          class="!h-9 !w-9 !rounded-xl !bg-white/65 hover:!bg-white/95 !border-slate-300/50 !shadow-xs backdrop-blur-md"
          :title="t('app.settings')"
        >
          <template #icon>
            <Settings class="h-4 w-4 text-slate-500" />
          </template>
        </a-button>
        <template #content>
          <div class="p-2 space-y-2 min-w-[160px]">
            <div class="text-[12px] font-medium text-slate-400 px-1">{{ t('app.settings') }}</div>
            <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
              <span class="text-[13px] text-slate-700">{{ t('app.leftSidebar') }}</span>
              <a-switch v-model="store.leftSidebarVisible" size="small" />
            </div>
            <div class="flex items-center justify-between px-1 py-1 hover:bg-slate-50 rounded">
              <span class="text-[13px] text-slate-700">{{ t('app.rightSidebar') }}</span>
              <a-switch v-model="store.rightSidebarVisible" size="small" />
            </div>
          </div>
        </template>
      </a-dropdown>

      <a-divider direction="vertical" class="!mx-0.5 !h-5 !border-slate-300/40" />

      <!-- 最右侧：纯圆形头像徽章 (对标 Stitch 截图，悬浮微光独立头像) -->
      <a-dropdown trigger="click" position="br" v-model:popup-visible="isUserDropdownOpen">
        <div
          class="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-blue-400/50 cursor-pointer transition-all select-none"
          :class="{ 'ring-2 ring-[#1677ff]': isUserDropdownOpen }"
          title="ceshi"
        >
          <a-avatar
            :size="32"
            class="!bg-gradient-to-tr !from-[#1677ff] !to-[#69b1ff] !text-white !font-semibold text-xs shadow-xs shrink-0 flex items-center justify-center transition-transform hover:scale-105 border border-white/80"
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
            <a-divider class="!my-1" />
            <a-doption class="!text-red-500 hover:!bg-red-50" @click="handleUserAction('logout')">
              <template #icon><IconExport class="!text-red-500 text-[14px]" /></template>
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
  Layers,
  Settings,
  Save,
  Eye,
  CloudUpload,
  Check,
  CircleAlert,
  Loader2
} from '@lucide/vue';

defineEmits(['open-preview', 'open-deploy']);

const isSaving = ref(false);
const saveSuccess = ref(false);
const isUserDropdownOpen = ref(false);

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
