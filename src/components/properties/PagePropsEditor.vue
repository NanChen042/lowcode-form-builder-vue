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

    <div v-else-if="isRisk" id="risk-page-prop-editor" class="space-y-4">
      <!-- 页面大标题 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700 flex items-center gap-1">
            <span>{{ t('prop.pageTitle') }}</span>
          </label>
          <span class="text-[10px] text-slate-400 font-mono">H2</span>
        </div>
        <a-input
          id="page-prop-title-input"
          v-model="pageTitleModel"
          allow-clear
          :placeholder="t('prop.pageTitlePlaceholder')"
          class="w-full !rounded-[4px] !text-xs"
          @focus="setPageFocus('title')"
          @blur="clearFocus"
          @input="markDirty"
          @clear="markDirty"
        />
      </div>

      <!-- 页面引导/说明文案 -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[12px] font-medium text-slate-700">
            <span>{{ t('prop.pageDesc') }}</span>
          </label>
        </div>
        <a-textarea
          id="page-prop-desc-input"
          v-model="pageDescModel"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          allow-clear
          :placeholder="t('prop.pageDescPlaceholder')"
          class="w-full !rounded-[4px] !text-xs"
          @focus="setPageFocus('description')"
          @blur="clearFocus"
          @input="markDirty"
          @clear="markDirty"
        />
      </div>

      <!-- 问卷概览与快捷操作 -->
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <span class="text-[12px] font-medium text-slate-700">{{ t('risk.overviewStats') }}</span>
          <span class="text-[11px] text-slate-400">
            {{ (page.groups?.length || 1) }} {{ t('risk.groupUnit') }} · {{ page.fields?.length || 0 }} {{ t('risk.questionUnit') }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="h-7.5 px-2 rounded-[4px] !text-xs font-medium border border-dashed border-slate-300 hover:border-[#1677ff] hover:text-[#1677ff] bg-white hover:bg-blue-50/40 text-slate-600 transition cursor-pointer flex items-center justify-center gap-1 min-w-0"
            @click="handleAddQuestion"
          >
            <Plus class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            <span class="truncate whitespace-nowrap">{{ t('risk.addQuestion') }}</span>
          </button>
          <button
            type="button"
            class="h-7.5 px-2 rounded-[4px] !text-xs font-medium border border-dashed border-slate-300 hover:border-[#1677ff] hover:text-[#1677ff] bg-white hover:bg-blue-50/40 text-slate-600 transition cursor-pointer flex items-center justify-center gap-1 min-w-0"
            @click="handleAddGroup"
          >
            <FolderPlus class="w-3.5 h-3.5 stroke-[2] shrink-0" />
            <span class="truncate whitespace-nowrap">{{ t('risk.addGroupBtn') }}</span>
          </button>
        </div>
      </div>

      <!-- 评分机制说明卡片 -->
      <div class="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1.5 text-slate-600 leading-relaxed">
        <div class="flex items-center gap-1.5 font-semibold text-slate-700">
          <Scale class="w-3.5 h-3.5 text-blue-500" />
          <span>{{ t('risk.rulesCardTitle') }}</span>
        </div>
        <p class="text-[11.5px] text-slate-500 m-0 leading-normal">
          {{ t('risk.rulesCardDesc') }}
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
            {{ t('prop.pageTitleWithLang') }}
          </span>
          <a-tag v-if="isPageTitleMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
            {{ t('prop.untranslated') }}
          </a-tag>
        </div>
        <a-textarea
          id="page-prop-title-input"
          v-model="pageTitleModel"
          :auto-size="{ minRows: 1, maxRows: 3 }"
          allow-clear
          :placeholder="t('prop.pageTitlePlaceholder')"
          class="w-full"
          @focus="setPageFocus('title')"
          @blur="clearFocus"
          @input="markDirty"
          @clear="markDirty"
        />
      </div>

      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[12px] font-medium text-slate-700">
            {{ t('prop.pageDescWithLang') }}
          </span>
          <a-tag v-if="isPageDescMissing" color="orange" size="small" class="text-[10px] scale-90 origin-right">
            {{ t('prop.untranslated') }}
          </a-tag>
        </div>
        <a-textarea
          id="page-prop-desc-input"
          v-model="pageDescModel"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          allow-clear
          :placeholder="t('prop.pageDescPlaceholder')"
          class="w-full"
          @focus="setPageFocus('description')"
          @blur="clearFocus"
          @input="markDirty"
          @clear="markDirty"
        />
      </div>

      <div class="pt-3 border-t border-slate-100">
        <a-popconfirm
          :content="t('prop.deletePageConfirm')"
          type="error"
          :ok-text="t('modal.confirm')"
          :cancel-text="t('modal.cancel')"
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
import {
  store,
  markDirty,
  deletePage,
  isBilingual,
  isRisk,
  primaryLocale,
  addElement,
  addQuestionGroup
} from '@/core/store';
import { t, getPageText, setPageText } from '@/core/i18n';
import {
  Building2,
  User,
  Users,
  Lock,
  Trash2,
  Plus,
  FolderPlus,
  Scale
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
  const cur = getPageText(props.page, 'title');
  const src = getPageText(props.page, 'title', primaryLocale.value);
  return Boolean(src && !cur);
});

const isPageDescMissing = computed(() => {
  if (!isBilingual.value) return false;
  const cur = getPageText(props.page, 'description');
  const src = getPageText(props.page, 'description', primaryLocale.value);
  return Boolean(src && !cur);
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

function handleAddQuestion() {
  const firstGrp = props.page.groups?.[0]?.id || 'grp_risk_1';
  addElement('radio', props.page.id, firstGrp);
}

function handleAddGroup() {
  addQuestionGroup();
}
</script>
