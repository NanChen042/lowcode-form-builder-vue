<template>
  <a-modal v-model:visible="modalVisible" :footer="false" :width="760" :title="t('tpl.modalTitle')" unmount-on-close @cancel="handleCancel">
    <div class="py-1">
      <p class="text-xs text-slate-400 mb-4">{{ t('tpl.modalDesc') }}</p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 个人 KYC 卡片 -->
        <div class="group flex cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:border-emerald-400 hover:shadow-md" :class="store.activeTemplateKey === 'kyc-individual'
            ? 'border-emerald-400 bg-emerald-50/50 shadow-sm'
            : 'border-slate-200 bg-white'
          " @click="selectTemplate('kyc-individual')">
          <div class="flex w-14 shrink-0 items-center justify-center border-r transition-colors duration-200" :class="store.activeTemplateKey === 'kyc-individual'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white'
            ">
            <UserCheck class="h-5 w-5" />
          </div>

          <div class="flex flex-1 flex-col justify-center p-4 pr-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[14px] font-bold text-slate-800 m-0">{{ t('tpl.individualTitle') }}</h3>
              <a-tag v-if="store.activeTemplateKey === 'kyc-individual'" color="green" size="small">
                {{ t('tpl.activeTag') }}
              </a-tag>
              <Plus v-else class="h-4 w-4 text-slate-300 transition-colors group-hover:text-emerald-500" />
            </div>
            <p class="mt-1 text-[12px] leading-relaxed text-slate-500 m-0">
              {{ t('tpl.individualDesc') }}
            </p>
          </div>
        </div>

        <!-- 实体 KYC 卡片 -->
        <div class="group flex cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:border-blue-400 hover:shadow-md" :class="store.activeTemplateKey === 'kyc-entity'
            ? 'border-blue-400 bg-blue-50/50 shadow-sm'
            : 'border-slate-200 bg-white'
          " @click="selectTemplate('kyc-entity')">
          <div class="flex w-14 shrink-0 items-center justify-center border-r transition-colors duration-200" :class="store.activeTemplateKey === 'kyc-entity'
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-[#1677ff] group-hover:border-[#1677ff] group-hover:text-white'
            ">
            <Building2 class="h-5 w-5" />
          </div>

          <div class="flex flex-1 flex-col justify-center p-4 pr-5">
            <div class="flex items-center justify-between">
              <h3 class="text-[14px] font-bold text-slate-800 m-0">{{ t('tpl.entityTitle') }}</h3>
              <a-tag v-if="store.activeTemplateKey === 'kyc-entity'" color="arcoblue" size="small">
                {{ t('tpl.activeTag') }}
              </a-tag>
              <Plus v-else class="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#1677ff]" />
            </div>
            <p class="mt-1 text-[12px] leading-relaxed text-slate-500 m-0">
              {{ t('tpl.entityDesc') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { store, loadSchema } from '@/core/store';
import { t } from '@/core/i18n';
import { kycIndividualTemplate, kycEntityTemplate } from '@/templates/recommend';
import { UserCheck, Building2, Plus } from '@lucide/vue';
import { Modal } from '@arco-design/web-vue';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['close', 'update:visible']);

const modalVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val) emit('close');
  }
});

function handleCancel() {
  modalVisible.value = false;
  emit('close');
}

function selectTemplate(key: 'kyc-individual' | 'kyc-entity') {
  Modal.confirm({
    title: t('tpl.confirmTitle'),
    content: t('tpl.confirmContent'),
    okText: t('tpl.confirmOk'),
    cancelText: t('tpl.confirmCancel'),
    onOk() {
      if (key === 'kyc-individual') {
        loadSchema(kycIndividualTemplate);
        store.activeTemplateKey = 'kyc-individual';
      } else {
        loadSchema(kycEntityTemplate);
        store.activeTemplateKey = 'kyc-entity';
      }
      emit('close');
    }
  });
}
</script>
