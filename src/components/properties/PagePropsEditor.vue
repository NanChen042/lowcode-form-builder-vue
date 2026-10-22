<template>
  <div class="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
    <div v-if="page.pageType === 'system_profile'" id="system-page-prop-editor" class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <span class="text-[12px] font-semibold text-slate-700">{{ t('prop.canvasSettings') }}</span>
          <span class="block text-[11px] text-slate-400">{{ t('prop.pageSubtitle') }}</span>
        </div>
        <a-tag color="arcoblue" size="small" class="text-[11px] font-normal">
          {{ t('prop.systemPreset') }}
        </a-tag>
      </div>

      <div class="py-8 px-4 flex flex-col items-center text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <Lock class="h-5 w-5" />
        </div>

        <h3 class="text-sm font-semibold text-slate-800 m-0">
          {{ t('prop.systemBaseline') }}
        </h3>

        <div class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
          <Users v-if="currentProfileType === 'customer' || currentProfileType === 'client'" class="h-3 w-3 text-slate-500" />
          <Building2 v-else-if="currentProfileType === 'entity'" class="h-3 w-3 text-slate-500" />
          <User v-else class="h-3 w-3 text-emerald-500" />
          <span>{{ getProfileTypeName(currentProfileType) }}</span>
          <span class="text-slate-300">·</span>
          <span>{{ t('prop.locked') }}</span>
        </div>

        <p class="mt-3.5 text-xs text-slate-400 leading-relaxed max-w-[240px] m-0">
          {{ t('prop.systemPresetAlert') }}
        </p>
      </div>
    </div>

    <a-form v-else id="page-prop-editor" :model="page" layout="vertical" size="small">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-3.5">
        <div>
          <span class="text-[12px] font-semibold text-slate-700">{{ t('prop.canvasSettings') }}</span>
          <span class="block text-[11px] text-slate-400">{{ t('prop.pageSubtitle') }}</span>
        </div>
        <a-tag color="blue" size="small" class="text-[11px] font-normal">
          {{ t('prop.page') }}
        </a-tag>
      </div>

      <div class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[12px] font-medium text-slate-700">
            {{ store.currentLocale === 'en' ? t('prop.pageTitleEn') : t('prop.pageTitle') }}
          </span>
          <a-tag v-if="isPageTitleMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
            {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
          </a-tag>
        </div>
        <a-input
          id="page-prop-title-input"
          v-model="pageTitleModel"
          allow-clear
          :placeholder="t('prop.pageTitlePlaceholder')"
          class="w-full"
          @focus="setPageFocus('title')"
          @blur="clearFocus"
          @input="markDirty"
        />
      </div>

      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[12px] font-medium text-slate-700">
            {{ store.currentLocale === 'en' ? t('prop.pageDescEn') : t('prop.pageDesc') }}
          </span>
          <a-tag v-if="isPageDescMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
            {{ store.currentLocale === 'en' ? t('prop.missingEnTag') : t('prop.missingZhTag') }}
          </a-tag>
        </div>
        <a-textarea
          id="page-prop-desc-input"
          v-model="pageDescModel"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :placeholder="t('prop.pageDescPlaceholder')"
          class="w-full"
          @focus="setPageFocus('description')"
          @blur="clearFocus"
          @input="markDirty"
        />
      </div>

      <div class="pt-3 border-t border-slate-100">
        <a-popconfirm
          :content="t('prop.deletePageConfirm')"
          type="warning"
          :ok-text="t('modal.confirm')"
          :cancel-text="t('modal.cancel')"
          :ok-button-props="{ status: 'danger', size: 'small' }"
          :cancel-button-props="{ size: 'small' }"
          @ok="handleDeletePage"
        >
          <a-button status="danger" long size="small">
            <template #icon>
              <Trash2 class="h-3.5 w-3.5" />
            </template>
            {{ t('prop.deletePage') }}
          </a-button>
        </a-popconfirm>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormPage, ProfileType } from '@/types/schema';
import { store, markDirty, deletePage, isBilingual } from '@/core/store';
import { t, getPageText, setPageText } from '@/core/i18n';
import {
  Building2,
  User,
  Users,
  Lock,
  Trash2
} from '@lucide/vue';

const props = defineProps<{
  page: FormPage;
}>();

function getProfileTypeName(type?: ProfileType) {
  if (type === 'customer' || type === 'client') return t('prop.clientCase');
  if (type === 'entity') return t('prop.entityCase');
  return t('prop.individualCase');
}

const currentProfileType = computed(() => {
  return props.page.profileType || store.meta.profileType || 'customer';
});

const pageTitleModel = computed({
  get() {
    return getPageText(props.page, 'title');
  },
  set(val: string) {
    setPageText(props.page, 'title', val);
  }
});

const pageDescModel = computed({
  get() {
    return getPageText(props.page, 'description');
  },
  set(val: string) {
    setPageText(props.page, 'description', val);
  }
});

const isPageTitleMissing = computed(() => {
  if (!isBilingual.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.page.title && !props.page.title_en);
  }
  return Boolean(props.page.title_en && !props.page.title);
});

const isPageDescMissing = computed(() => {
  if (!isBilingual.value) return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.page.description && !props.page.description_en);
  }
  return Boolean(props.page.description_en && !props.page.description);
});

function setPageFocus(field: 'title' | 'description') {
  store.focusedTarget = {
    elementId: props.page.id,
    field
  };
}

function clearFocus() {
  store.focusedTarget = null;
}

function handleDeletePage() {
  deletePage(props.page.id);
}
</script>
