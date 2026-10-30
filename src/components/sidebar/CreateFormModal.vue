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
      <div>
        <div class="text-xs font-semibold text-slate-700 mb-1.5">
          {{ t('modal.createForm.profileType') }}
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="item in profileOptions"
            :key="item.value"
            type="button"
            class="flex flex-col items-center justify-center py-2.5 px-2 rounded border transition-colors cursor-pointer select-none text-center"
            :class="[
              selectedProfile === item.value
                ? 'border-[#1677ff] bg-blue-50/40 text-[#1677ff] font-medium'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
            ]"
            @click="selectedProfile = item.value"
          >
            <component :is="item.icon" class="w-4 h-4 mb-1" />
            <span class="text-[12px] leading-tight">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <div>
        <div class="text-xs font-semibold text-slate-700 mb-1.5">
          {{ t('modal.createForm.formTitle') }}
        </div>
        <a-input
          ref="titleInputRef"
          v-model="customTitle"
          :error="nameError"
          :placeholder="computedTitlePlaceholder"
          allow-clear
          class="rounded h-9"
          @input="nameError = false"
          @keydown.enter="handleConfirm"
        />
      </div>

      <p class="text-[11.5px] text-slate-400 m-0 leading-normal">
        {{ t('modal.createForm.desc') }}
      </p>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" class="bg-[#1677ff]" :loading="isSubmitting" @click="handleConfirm">
          {{ t('modal.createForm.create') }}
        </a-button>
        <a-button :disabled="isSubmitting" @click="handleCancel">
          {{ t('modal.createForm.cancel') }}
        </a-button>
      </div>
    </template>
  </a-modal>

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
        <a-button type="primary" status="warning" class="bg-amber-600 hover:bg-amber-700" :loading="isSubmitting" @click="executeCreateCanvas">
          {{ t('modal.createForm.confirmOverwriteBtn') }}
        </a-button>
        <a-button :disabled="isSubmitting" @click="confirmOverwriteVisible = false">
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
  isRisk,
  createNewCanvas
} from '@/core/store';
import { t } from '@/core/i18n';
import {
  Building2,
  UserCheck,
  ShieldCheck
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    isInitial?: boolean;
  }>(),
  {
    isInitial: false
  }
);
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
const nameError = ref(false);
const isSubmitting = ref(false);
const titleInputRef = ref<any>(null);

const profileOptions = computed(() => [
  { value: 'customer' as const, label: t('modal.createForm.customer'), icon: Building2 },
  { value: 'individual' as const, label: t('modal.createForm.individual'), icon: UserCheck },
  { value: 'entity' as const, label: t('modal.createForm.entity'), icon: ShieldCheck }
]);

const defaultTitleForProfile = computed(() => {
  if (isRisk.value) {
    if (selectedProfile.value === 'individual') return 'SG_Risk_Individual';
    if (selectedProfile.value === 'entity') return 'SG_Risk_Entity';
    return 'SG_Risk_Customer';
  }
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
      nameError.value = false;
      selectedProfile.value = store.meta.profileType || 'customer';
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
  if (props.isInitial) return false;
  if (store.pages.length === 0) return false;
  if (!store.meta.formId && !store.meta.serialNo && !store.isDirty) {
    return false;
  }
  const totalFields = store.pages.reduce((acc, p) => acc + (p.fields?.length || 0), 0);
  if (totalFields === 0 && store.pages.length <= 2) {
    return false;
  }
  // 针对风险评估模式初始默认仅有1个未编辑空问题的情况，视为纯净模板无需覆盖确认
  if (isRisk.value && store.pages.length === 1 && totalFields === 1) {
    const firstField = store.pages[0].fields?.[0];
    if (firstField && !firstField.label && !firstField.label_en && !store.meta.formId) {
      return false;
    }
  }
  return true;
}

function handleConfirm() {
  if (isSubmitting.value) return;
  nameError.value = false;
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
    description: '',
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
