<template>
  <a-dsubmenu :value="valuePrefix" trigger="hover">
    <template #icon>
      <PlusCircle class="h-4 w-4 text-[#1677ff]" />
    </template>
    <template #default>
      <span :class="titleClass || 'text-[13px] text-slate-700'">{{ title }}</span>
    </template>
    <template #content>
      <a-dsubmenu :value="`${valuePrefix}-basic`" trigger="hover">
        <template #icon>
          <Layers class="h-4 w-4 text-slate-500" />
        </template>
        <template #default>
          <span class="text-[13px] text-slate-700">
            {{ t('sidebar.catBasic') }}
          </span>
        </template>
        <template #content>
          <a-doption
            v-for="item in basicComponents"
            :key="`${valuePrefix}_${item.type}`"
            @click="emit('select', item.type)"
          >
            <template #icon>
              <component :is="getComponentIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400" />
            </template>
            <span class="text-[13px] text-slate-700">
              {{ getFieldText(item, 'label') }}
            </span>
          </a-doption>
        </template>
      </a-dsubmenu>

      <a-dsubmenu :value="`${valuePrefix}-biz`" trigger="hover">
        <template #icon>
          <Briefcase class="h-4 w-4 text-slate-500" />
        </template>
        <template #default>
          <span class="text-[13px] text-slate-700">
            {{ t('sidebar.catBusiness') }}
          </span>
        </template>
        <template #content>
          <a-doption
            v-for="item in businessComponents"
            :key="`${valuePrefix}_${item.type}`"
            @click="emit('select', item.type)"
          >
            <template #icon>
              <component :is="getComponentIcon(item.icon)" class="h-3.5 w-3.5 text-slate-400" />
            </template>
            <span class="text-[13px] text-slate-700">
              {{ getFieldText(item, 'label') }}
            </span>
          </a-doption>
        </template>
      </a-dsubmenu>
    </template>
  </a-dsubmenu>
</template>

<script setup lang="ts">
import type { ComponentType } from '@/types/schema';
import { t, getFieldText } from '@/core/i18n';
import { basicComponents, businessComponents, getComponentIcon } from '@/registry/components';
import { PlusCircle, Layers, Briefcase } from '@lucide/vue';

defineProps<{
  title: string;
  valuePrefix: string;
  titleClass?: string;
}>();

const emit = defineEmits<{
  (e: 'select', type: ComponentType): void;
}>();
</script>
