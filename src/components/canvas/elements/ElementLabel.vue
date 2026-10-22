<template>
  <div v-if="element.showLabel !== false || element.type === 'alert'" class="component-label text-[13px] text-slate-800 font-semibold leading-5 mb-1.5 pr-12">
    <span v-if="isRequired" class="req-star text-[#ff4d4f] font-bold mr-1 inline select-none">*</span><EditableText
      v-model="currentLabel"
      :placeholder="t('prop.fieldLabelPlaceholder')"
      :element-id="element.id"
      field="label"
      custom-class="label-text inline break-words"
    />

    <EditableText
      v-if="element.helpPosition !== 'bottom' && Boolean(getFieldText(element, 'help'))"
      v-model="currentHelp"
      :placeholder="t('prop.fieldHelpPlaceholder')"
      :element-id="element.id"
      field="help"
      custom-class="field-help text-[11px] text-slate-400 font-normal leading-4 ml-1.5 inline"
      :allow-empty="true"
    />

    <div
      v-if="element.helpPosition === 'bottom' && Boolean(getFieldText(element, 'help'))"
      class="mt-0.5 leading-4"
    >
      <EditableText
        v-model="currentHelp"
        :placeholder="t('prop.fieldHelpPlaceholder')"
        :element-id="element.id"
        field="help"
        custom-class="field-help field-help-bottom text-[11px] text-slate-400 font-normal leading-4"
        :allow-empty="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import EditableText from '@/components/common/EditableText.vue';

const props = defineProps<{ element: FormElement }>();

const isRequired = computed(() => {
  if (props.element.type === 'signature') {
    return Boolean(props.element.declarationRequired || props.element.required);
  }
  return Boolean(props.element.required);
});

const currentLabel = computed({
  get() {
    return getFieldText(props.element, 'label');
  },
  set(val: string) {
    setFieldText(props.element, 'label', val);
  }
});

const currentHelp = computed({
  get() {
    return getFieldText(props.element, 'help');
  },
  set(val: string) {
    setFieldText(props.element, 'help', val);
  }
});
</script>
