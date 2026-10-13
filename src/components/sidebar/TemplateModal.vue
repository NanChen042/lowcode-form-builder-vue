<template>
  <a-modal
    v-model:visible="modalVisible"
    :width="720"
    :title="t('tpl.modalTitle')"
    :title-align="'start'"
    unmount-on-close
    @cancel="handleCancel"
  >
    <div class="py-1 flex flex-col gap-4">
      <!-- 模板选择 (客户案例 / 个人案例 / 实体案例) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">
          <span class="text-red-500 mr-1">*</span>
          {{ store.currentLocale === 'en' ? 'Select Scenario Template' : '选择场景模板' }}
        </label>

        <div class="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          <!-- 1. 客户案例卡片 -->
          <div
            class="group flex flex-col cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 select-none p-3"
            :class="selectedTemplateKey === 'kyc-client'
              ? 'border-blue-600 bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectTemplate('kyc-client')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedTemplateKey === 'kyc-client'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'"
              >
                <Users class="h-4 w-4" />
              </div>
              <div
                v-if="selectedTemplateKey === 'kyc-client'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h3 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Client Case - KYC' : '客户案例 - KYC 表单' }}
            </h3>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for client cases.' : '客户案例专用KYC问卷，包含母案例主体与授权代表合规尽调。' }}
            </p>
          </div>

          <!-- 2. 个人案例卡片 -->
          <div
            class="group flex flex-col cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 select-none p-3"
            :class="selectedTemplateKey === 'kyc-individual'
              ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectTemplate('kyc-individual')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedTemplateKey === 'kyc-individual'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white'"
              >
                <UserCheck class="h-4 w-4" />
              </div>
              <div
                v-if="selectedTemplateKey === 'kyc-individual'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h3 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Individual Case - KYC' : '个人案例 - KYC 表单' }}
            </h3>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for individual members.' : '个人成员专用KYC问卷，包含个人基础身份与财务背景凭证。' }}
            </p>
          </div>

          <!-- 3. 实体案例卡片 -->
          <div
            class="group flex flex-col cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 select-none p-3"
            :class="selectedTemplateKey === 'kyc-entity'
              ? 'border-[#1677ff] bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'"
            @click="onSelectTemplate('kyc-entity')"
          >
            <div class="flex items-center justify-between mb-2">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                :class="selectedTemplateKey === 'kyc-entity'
                  ? 'bg-[#1677ff] text-white'
                  : 'bg-slate-100 text-slate-400 group-hover:bg-[#1677ff] group-hover:text-white'"
              >
                <Building2 class="h-4 w-4" />
              </div>
              <div
                v-if="selectedTemplateKey === 'kyc-entity'"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#1677ff] text-white"
              >
                <Check class="h-2.5 w-2.5" />
              </div>
            </div>

            <h3 class="text-[12.5px] font-bold text-slate-800 m-0">
              {{ store.currentLocale === 'en' ? 'Entity Case - KYC' : '实体案例 - KYC 表单' }}
            </h3>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500 m-0 line-clamp-2">
              {{ store.currentLocale === 'en' ? 'Dedicated KYC questionnaire for entity members.' : '实体成员专用KYC问卷，核验企业注册登记信息及授权代表。' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 表单名称输入 -->
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

      <!-- 表单描述输入 (新增表单描述字段) -->
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
import { store, loadSchema, establishBaseline, generateFormId, syncUrlParams } from '@/core/store';
import { t } from '@/core/i18n';
import { kycClientTemplate, kycIndividualTemplate, kycEntityTemplate } from '@/templates/recommend';
import type { ProfileType } from '@/types/schema';
import { UserCheck, Building2, Users, Check } from '@lucide/vue';
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

type TemplateKey = 'kyc-client' | 'kyc-individual' | 'kyc-entity';

const defaultTemplateMap: Record<TemplateKey, { title: string; desc: string; type: ProfileType }> = {
  'kyc-client': {
    title: 'SG_CDD_Client(2026)',
    desc: '客户案例专用KYC问卷',
    type: 'client'
  },
  'kyc-individual': {
    title: 'SG_CDD_Individual(2026)',
    desc: '个人成员专用KYC问卷',
    type: 'individual'
  },
  'kyc-entity': {
    title: 'SG_CDD_Entity(2026)',
    desc: '实体成员专用KYC问卷',
    type: 'entity'
  }
};

const selectedTemplateKey = ref<TemplateKey>('kyc-client');
const formTitle = ref('');
const formDescription = ref('');
const titleInputRef = ref<any>(null);

const currentTitlePlaceholder = computed(() => {
  const example = defaultTemplateMap[selectedTemplateKey.value]?.title || 'SG_CDD_Client(2026)';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单名称，留空默认为：${example}`;
});

const currentDescPlaceholder = computed(() => {
  const example = defaultTemplateMap[selectedTemplateKey.value]?.desc || '客户案例专用KYC问卷';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单描述，留空默认为：${example}`;
});

function onSelectTemplate(key: TemplateKey) {
  selectedTemplateKey.value = key;
}

watch(
  () => props.visible,
  val => {
    if (val) {
      selectedTemplateKey.value = 'kyc-client';
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
  const trimmedTitle = formTitle.value.trim() || defaultTemplateMap[selectedTemplateKey.value].title;
  const trimmedDesc = formDescription.value.trim() || defaultTemplateMap[selectedTemplateKey.value].desc;

  const profileType: ProfileType = defaultTemplateMap[selectedTemplateKey.value].type;
  let baseSchema = kycClientTemplate;
  if (selectedTemplateKey.value === 'kyc-individual') {
    baseSchema = kycIndividualTemplate;
  } else if (selectedTemplateKey.value === 'kyc-entity') {
    baseSchema = kycEntityTemplate;
  }

  const targetSchema = JSON.parse(JSON.stringify(baseSchema));
  const formId = generateFormId(profileType, 'template');
  const now = Date.now();

  targetSchema.meta.title = trimmedTitle;
  targetSchema.meta.description = trimmedDesc;
  targetSchema.meta.source = 'template';
  targetSchema.meta.profileType = profileType;
  targetSchema.meta.templateKey = selectedTemplateKey.value;
  targetSchema.meta.serialNo = formId;
  targetSchema.meta.formId = formId;
  targetSchema.meta.createdAt = now;

  loadSchema(targetSchema);
  store.meta.title = trimmedTitle;
  store.meta.description = trimmedDesc;
  store.meta.source = 'template';
  store.meta.profileType = profileType;
  store.meta.templateKey = selectedTemplateKey.value;
  store.meta.serialNo = formId;
  store.meta.formId = formId;
  store.meta.createdAt = now;
  store.activeTemplateKey = selectedTemplateKey.value;
  establishBaseline();
  syncUrlParams(formId);

  Message.success(store.currentLocale === 'en' ? 'Canvas created successfully' : '画布创建成功');
  modalVisible.value = false;
  emit('created');
  emit('close');
}
</script>
