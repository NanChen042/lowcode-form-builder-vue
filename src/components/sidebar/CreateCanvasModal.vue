<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="store.currentLocale === 'en' ? 'Create Form Canvas' : '新建表单画布'"
    :width="680"
    :title-align="'start'"
    unmount-on-close
    @cancel="handleCancel"
  >
    <div class="py-1 flex flex-col gap-4">
      <!-- 1. 表单名称输入 -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">
          {{ store.currentLocale === 'en' ? 'Form Name' : '表单名称' }}
        </label>
        <a-input
          ref="titleInputRef"
          v-model="formTitle"
          :placeholder="currentTitlePlaceholder"
          allow-clear
          class="rounded-lg h-9"
          @keydown.enter="handleConfirm"
        />
      </div>

      <!-- 2. 表单描述输入 (新增表单描述字段) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">
          {{ store.currentLocale === 'en' ? 'Form Description' : '表单描述' }}
        </label>
        <a-textarea
          v-model="formDescription"
          :placeholder="currentDescPlaceholder"
          allow-clear
          :auto-size="{ minRows: 2, maxRows: 4 }"
          class="rounded-lg text-xs"
        />
      </div>

      <!-- 3. 基础资料业务类型选择 (客户案例 / 个人案例 / 实体案例) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">
          <span class="text-red-500 mr-1">*</span>
          {{ store.currentLocale === 'en' ? 'Business Type' : '业务类型' }}
        </label>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <!-- 客户案例卡片 -->
          <div
            class="relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none group"
            :class="selectedType === 'client'
              ? 'border-blue-600 bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectType('client')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedType === 'client' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'"
              >
                <Users class="h-4 w-4" />
              </div>
              <div
                v-if="selectedType === 'client'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h4 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Client Case' : '客户案例' }}
            </h4>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for client cases.' : '客户案例专用KYC问卷，预置母案例主体及授权代表核验。' }}
            </p>
          </div>

          <!-- 个人案例卡片 -->
          <div
            class="relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none group"
            :class="selectedType === 'individual'
              ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectType('individual')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedType === 'individual' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'"
              >
                <UserCheck class="h-4 w-4" />
              </div>
              <div
                v-if="selectedType === 'individual'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h4 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Individual Case' : '个人案例' }}
            </h4>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for individual members.' : '个人成员专用KYC问卷，预置个人基础身份凭证核验资料。' }}
            </p>
          </div>

          <!-- 实体案例卡片 -->
          <div
            class="relative flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none group"
            :class="selectedType === 'entity'
              ? 'border-[#1677ff] bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectType('entity')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedType === 'entity' ? 'bg-[#1677ff] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'"
              >
                <Building2 class="h-4 w-4" />
              </div>
              <div
                v-if="selectedType === 'entity'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#1677ff] text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h4 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Entity Case' : '实体案例' }}
            </h4>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for entity members.' : '实体成员专用KYC问卷，预置企业登记与授权代表核验。' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="flex items-center justify-end gap-2.5">
        <a-button @click="handleCancel">
          {{ store.currentLocale === 'en' ? 'Cancel' : '取消' }}
        </a-button>
        <a-button type="primary" @click="handleConfirm">
          {{ store.currentLocale === 'en' ? 'Create Canvas' : '立即创建' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { ProfileType } from '@/types/schema';
import { store, createNewCanvas } from '@/core/store';
import { Building2, UserCheck, Users, Check } from '@lucide/vue';
import { Message } from '@arco-design/web-vue';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['close', 'update:visible', 'created']);

const modalVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val) emit('close');
  }
});

const defaultMetaMap: Record<string, { title: string; desc: string }> = {
  customer: { title: 'SG_CDD_Customer(2026)', desc: '客户母案例专用KYC问卷' },
  client: { title: 'SG_CDD_Customer(2026)', desc: '客户母案例专用KYC问卷' },
  individual: { title: 'SG_CDD_Individual(2026)', desc: '个人成员专用KYC问卷' },
  entity: { title: 'SG_CDD_Entity(2026)', desc: '实体成员专用KYC问卷' }
};

const formTitle = ref('');
const formDescription = ref('');
const selectedType = ref<ProfileType>('client');
const titleInputRef = ref<any>(null);

const currentTitlePlaceholder = computed(() => {
  const example = defaultMetaMap[selectedType.value]?.title || 'SG_CDD_Client(2026)';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单名称，留空默认为：${example}`;
});

const currentDescPlaceholder = computed(() => {
  const example = defaultMetaMap[selectedType.value]?.desc || '客户案例专用KYC问卷';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单描述，留空默认为：${example}`;
});

function onSelectType(type: ProfileType) {
  selectedType.value = type;
}

watch(
  () => props.visible,
  val => {
    if (val) {
      selectedType.value = 'client';
      formTitle.value = '';
      formDescription.value = '';
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
  const trimmedTitle = formTitle.value.trim() || defaultMetaMap[selectedType.value].title;
  const trimmedDesc = formDescription.value.trim() || defaultMetaMap[selectedType.value].desc;

  createNewCanvas({
    title: trimmedTitle,
    description: trimmedDesc,
    profileType: selectedType.value
  });

  Message.success(store.currentLocale === 'en' ? 'Canvas created successfully' : '画布创建成功');
  modalVisible.value = false;
  emit('created');
  emit('close');
}
</script>
