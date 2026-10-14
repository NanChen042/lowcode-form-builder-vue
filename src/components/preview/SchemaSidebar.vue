<template>
  <a-drawer
    :visible="visible"
    :width="480"
    :title="t('schema.title')"
    @cancel="$emit('close')"
  >
    <template #extra>
      <a-space size="small">
        <a-tag size="small" color="arcoblue">
          {{ pageCount }} {{ t('common.pagesUnit') }} / {{ fieldCount }} {{ t('common.fieldsUnit') }}
        </a-tag>
        <a-button size="mini" type="secondary" @click="copySchema">
          <template #icon>
            <Check v-if="copied" class="h-3.5 w-3.5 text-green-500" />
            <Copy v-else class="h-3.5 w-3.5" />
          </template>
          {{ copied ? t('schema.copied') : t('schema.copyJson') }}
        </a-button>
      </a-space>
    </template>

    <div class="h-full flex flex-col -m-4 bg-[#282c34] p-4 text-[#d19a66]">
      <pre
        class="custom-scrollbar m-0 flex-1 overflow-auto bg-transparent font-mono text-[12px] leading-5 text-[#d19a66] selection:bg-[#3e4451]"
        v-html="highlightedJson"
      ></pre>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FormSchema } from '@/types/schema';
import { t } from '@/core/i18n';
import { highlightJSON } from '@/utils/helpers';
import { Message } from '@arco-design/web-vue';
import { Copy, Check } from '@lucide/vue';

const props = defineProps<{
  visible: boolean;
  schema: FormSchema;
}>();

defineEmits(['close']);

const copied = ref(false);

const jsonString = computed(() => {
  return JSON.stringify(props.schema, null, 2);
});

const highlightedJson = computed(() => {
  return highlightJSON(jsonString.value);
});

const pageCount = computed(() => props.schema.pages?.length || 0);

const fieldCount = computed(() => {
  return props.schema.pages?.reduce((acc, p) => acc + (p.fields?.length || 0), 0) || 0;
});

async function copySchema() {
  try {
    await navigator.clipboard.writeText(jsonString.value);
    copied.value = true;
    Message.success(t('schema.copySuccess'));
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error('Copy failed:', e);
  }
}
</script>
