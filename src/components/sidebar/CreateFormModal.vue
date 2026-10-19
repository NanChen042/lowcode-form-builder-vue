<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="t('modal.createForm.title')"
    :width="460"
    :title-align="'start'"
    :closable="false"
    :mask-closable="false"
    :esc-to-close="false"
    draggable
    unmount-on-close
    class="clean-create-modal"
    @cancel="handleCancel"
  >
    <div class="space-y-4 py-1">
      <!-- 外部业务主体锁定提示 (若锁定则提示) -->
      <a-alert
        v-if="store.lockedProfileType"
        type="info"
        class="rounded border border-blue-100 bg-blue-50/70 py-1 px-2.5 text-xs"
      >
        <template #icon>
          <Lock class="h-3.5 w-3.5 text-[#1677ff]" />
        </template>
        <span>{{ t('modal.createForm.lockedProfile') }}{{ lockedTypeName }}</span>
      </a-alert>

      <!-- 1. 业务主体选择 (平铺标准微圆角卡片) -->
      <div>
        <div class="text-xs font-semibold text-slate-700 mb-1.5">
          {{ t('modal.createForm.profileType') }}
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="item in profileOptions"
            :key="item.value"
            type="button"
            :disabled="Boolean(store.lockedProfileType && store.lockedProfileType !== item.value)"
            class="flex flex-col items-center justify-center py-2.5 px-2 rounded border transition-colors cursor-pointer select-none text-center"
            :class="[
              selectedProfile === item.value
                ? 'border-[#1677ff] bg-blue-50/40 text-[#1677ff] font-medium'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50',
              store.lockedProfileType && store.lockedProfileType !== item.value ? 'opacity-40 cursor-not-allowed' : ''
            ]"
            @click="selectedProfile = item.value"
          >
            <component :is="item.icon" class="w-4 h-4 mb-1" />
            <span class="text-[12px] leading-tight">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <!-- 2. 表单名称设置 -->
      <div>
        <div class="text-xs font-semibold text-slate-700 mb-1.5">
          {{ t('modal.createForm.formTitle') }}
        </div>
        <a-input
          ref="titleInputRef"
          v-model="customTitle"
          :placeholder="computedTitlePlaceholder"
          allow-clear
          class="rounded h-9"
          @keydown.enter="handleConfirm"
        />
      </div>

      <p class="text-[11.5px] text-slate-400 m-0 leading-normal">
        {{ t('modal.createForm.desc') }}
      </p>
    </div>

    <!-- 弹窗底部操作栏 -->
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" class="bg-[#1677ff]" @click="handleConfirm">
          {{ t('modal.createForm.create') }}
        </a-button>
        <a-button @click="handleCancel">
          {{ t('modal.createForm.cancel') }}
        </a-button>
      </div>
    </template>
  </a-modal>

  <!-- 画布覆盖二次确认弹窗 -->
  <a-modal
    v-model:visible="confirmOverwriteVisible"
    :title="t('modal.createForm.confirmOverwriteTitle')"
    :width="380"
    :title-align="'start'"
    draggable
    unmount-on-close
    class="clean-confirm-modal"
    @cancel="confirmOverwriteVisible = false"
  >
    <div class="text-[13px] text-slate-600 leading-normal">
      {{ t('modal.createForm.confirmOverwriteDesc', undefined, { pages: store.pages.length }) }}
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" status="warning" class="bg-amber-600 hover:bg-amber-700" @click="executeCreateCanvas">
          {{ t('modal.createForm.confirmOverwriteBtn') }}
        </a-button>
        <a-button @click="confirmOverwriteVisible = false">
          {{ t('modal.createForm.cancel') }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { ProfileType } from '@/types/schema';
import {
  store,
  createNewCanvas
} from '@/core/store';
import { t } from '@/core/i18n';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Lock
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits(['close', 'update:visible', 'created', 'cancel']);

const modalVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val) emit('close');
  }
});

const selectedProfile = ref<ProfileType>('customer');
const customTitle = ref('');
const titleInputRef = ref<any>(null);

const profileOptions = computed(() => [
  { value: 'customer' as const, label: t('modal.createForm.customer'), icon: Building2 },
  { value: 'individual' as const, label: t('modal.createForm.individual'), icon: UserCheck },
  { value: 'entity' as const, label: t('modal.createForm.entity'), icon: ShieldCheck }
]);

const lockedTypeName = computed(() => {
  const profile = store.lockedProfileType;
  if (profile === 'individual') return t('modal.createForm.individual');
  if (profile === 'entity') return t('modal.createForm.entity');
  return t('modal.createForm.customer');
});

const defaultTitleForProfile = computed(() => {
  if (selectedProfile.value === 'individual') return 'SG_CDD_Individual';
  if (selectedProfile.value === 'entity') return 'SG_CDD_Entity';
  return 'SG_CDD_Customer';
});

const computedTitlePlaceholder = computed(() => {
  return t('modal.createForm.defaultPlaceholder', undefined, { title: defaultTitleForProfile.value });
});

watch(
  () => props.visible,
  val => {
    if (val) {
      customTitle.value = '';
      if (store.lockedProfileType) {
        selectedProfile.value = store.lockedProfileType;
      } else {
        selectedProfile.value = 'customer';
      }
      nextTick(() => {
        titleInputRef.value?.focus();
      });
    }
  }
);

const confirmOverwriteVisible = ref(false);

function handleCancel() {
  confirmOverwriteVisible.value = false;
  emit('cancel');
  modalVisible.value = false;
}

function isCanvasDirty(): boolean {
  if (store.pages.length === 0) return false;
  const totalFields = store.pages.reduce((acc, p) => acc + (p.fields?.length || 0), 0);
  if (totalFields === 0 && store.pages.length <= 2) {
    return false;
  }
  return true;
}

function handleConfirm() {
  if (isCanvasDirty()) {
    confirmOverwriteVisible.value = true;
    return;
  }
  executeCreateCanvas();
}

function executeCreateCanvas() {
  const pType = selectedProfile.value;
  const title = customTitle.value.trim() || defaultTitleForProfile.value;

  createNewCanvas({
    title,
    description: t('modal.createForm.defaultDesc'),
    profileType: pType
  });

  Message.success(t('modal.createForm.createdSuccess'));
  confirmOverwriteVisible.value = false;
  emit('created');
  modalVisible.value = false;
}
</script>

<style scoped>
.clean-create-modal :deep(.arco-modal) {
  border-radius: 6px;
}
</style>
