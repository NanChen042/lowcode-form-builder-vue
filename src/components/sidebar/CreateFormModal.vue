<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="store.currentLocale === 'en' ? 'New Form Canvas' : '新建表单画布'"
    :width="460"
    :title-align="'start'"
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
        <span>{{ store.currentLocale === 'en' ? 'Locked Profile: ' : '已锁定主体：' }}{{ lockedTypeName }}</span>
      </a-alert>

      <!-- 1. 业务主体选择 (平铺标准微圆角卡片) -->
      <div>
        <div class="text-xs font-semibold text-slate-700 mb-1.5">
          {{ store.currentLocale === 'en' ? 'Profile Type' : '业务主体' }}
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
          {{ store.currentLocale === 'en' ? 'Form Title' : '表单名称' }}
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
        {{ store.currentLocale === 'en' ? 'Initializes basic profile artboard for the selected entity. You can freely orchestrate components on the canvas afterward.' : '初始化所选主体的基本资料画板，后续可在画布中自由拖拽编排。' }}
      </p>
    </div>

    <!-- 弹窗底部操作栏 (主操作 立即创建 在左，次操作 取消 在右) -->
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <a-button type="primary" class="bg-[#1677ff]" @click="handleConfirm">
          {{ store.currentLocale === 'en' ? 'Create Canvas' : '立即创建' }}
        </a-button>
        <a-button @click="handleCancel">
          {{ store.currentLocale === 'en' ? 'Cancel' : '取消' }}
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
const emit = defineEmits(['close', 'update:visible', 'created']);

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
  { value: 'customer' as const, label: store.currentLocale === 'en' ? 'Customer' : '客户案例', icon: Building2 },
  { value: 'individual' as const, label: store.currentLocale === 'en' ? 'Individual' : '个人案例', icon: UserCheck },
  { value: 'entity' as const, label: store.currentLocale === 'en' ? 'Entity' : '机构案例', icon: ShieldCheck }
]);

const lockedTypeName = computed(() => {
  const t = store.lockedProfileType;
  if (t === 'individual') return store.currentLocale === 'en' ? 'Individual' : '个人案例';
  if (t === 'entity') return store.currentLocale === 'en' ? 'Entity' : '机构案例';
  return store.currentLocale === 'en' ? 'Customer' : '客户案例';
});

const computedTitlePlaceholder = computed(() => {
  if (selectedProfile.value === 'individual') {
    return store.currentLocale === 'en' ? 'Default: SG_CDD_Individual' : '留空默认为：SG_CDD_Individual';
  }
  if (selectedProfile.value === 'entity') {
    return store.currentLocale === 'en' ? 'Default: SG_CDD_Entity' : '留空默认为：SG_CDD_Entity';
  }
  return store.currentLocale === 'en' ? 'Default: SG_CDD_Customer' : '留空默认为：SG_CDD_Customer';
});

watch(
  () => props.visible,
  val => {
    if (val) {
      customTitle.value = '';
      if (store.lockedProfileType) {
        selectedProfile.value = store.lockedProfileType === 'client' ? 'customer' : store.lockedProfileType;
      } else {
        selectedProfile.value = 'customer';
      }
      nextTick(() => {
        titleInputRef.value?.focus();
      });
    }
  }
);

function handleCancel() {
  modalVisible.value = false;
  emit('close');
}

function handleConfirm() {
  const pType = selectedProfile.value === 'client' ? 'customer' : selectedProfile.value;
  const defaultTitle = pType === 'individual'
    ? 'SG_CDD_Individual'
    : pType === 'entity'
    ? 'SG_CDD_Entity'
    : 'SG_CDD_Customer';
  const title = customTitle.value.trim() || defaultTitle;

  createNewCanvas({
    title,
    description: store.currentLocale === 'en' ? 'Custom form created from blank canvas' : '从空白画布创建的自定义表单',
    profileType: pType
  });

  Message.success(store.currentLocale === 'en' ? 'Form canvas created successfully' : '表单画布创建成功');
  modalVisible.value = false;
  emit('created');
  emit('close');
}
</script>

<style scoped>
.clean-create-modal :deep(.arco-modal) {
  border-radius: 6px;
}
</style>
