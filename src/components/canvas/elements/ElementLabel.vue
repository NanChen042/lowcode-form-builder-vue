<template>
  <div v-if="element.showLabel !== false || element.type === 'alert'" class="component-label">
    <div class="flex items-center flex-wrap gap-1">
      <span v-if="isRequired" class="req-star">*</span>

      <EditableText
        v-model="currentLabel"
        :placeholder="t('canvas.unnamed')"
        :element-id="element.id"
        field="label"
        custom-class="label-text"
      />

      <!-- 标题右侧说明 (默认排布) -->
      <EditableText
        v-if="element.helpPosition !== 'bottom' && (element.help || (store.currentLocale === 'en' && element.help_en))"
        v-model="currentHelp"
        :placeholder="store.currentLocale === 'en' ? 'Description' : '补充说明'"
        :element-id="element.id"
        field="help"
        custom-class="field-help text-[11px] text-slate-400 font-normal leading-4"
        :allow-empty="true"
      />
    </div>

    <!-- 标题下方说明 (底部换行排布) -->
    <div
      v-if="element.helpPosition === 'bottom' && (element.help || (store.currentLocale === 'en' && element.help_en))"
      class="mt-0.5 leading-4"
    >
      <EditableText
        v-model="currentHelp"
        :placeholder="store.currentLocale === 'en' ? 'Description' : '补充说明'"
        :element-id="element.id"
        field="help"
        custom-class="field-help text-[11px] text-slate-400 font-normal leading-4 !ml-0"
        :allow-empty="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store } from '@/core/store';
import { t, getFieldText } from '@/core/i18n';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const isRequired = computed(() => {
  if (props.element.type === 'signature') {
    return Boolean(props.element.declarationRequired);
  }
  return Boolean(props.element.required);
});

const currentLabel = computed({
  get() {
    return getFieldText(props.element, 'label');
  },
  set(val: string) {
    if (store.currentLocale === 'en') {
      props.element.label_en = val;
    } else {
      props.element.label = val;
    }
  }
});

const currentHelp = computed({
  get() {
    return getFieldText(props.element, 'help');
  },
  set(val: string) {
    if (store.currentLocale === 'en') {
      props.element.help_en = val;
    } else {
      props.element.help = val;
    }
  }
});
</script>
