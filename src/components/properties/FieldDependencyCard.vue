<template>
  <div
    v-if="element.dependsOn && dependencyInfo"
    class="pt-3.5 border-t border-slate-100 space-y-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <Link2 class="h-3.5 w-3.5 text-slate-400" />
        <span class="text-[12px] font-medium text-slate-700">{{ t('prop.linkageRuleTitle') }}</span>
      </div>

      <a-popconfirm
        :content="t('prop.unlinkRuleConfirm')"
        type="warning"
        position="bottom"
        @ok="onToggleDependency(false)"
      >
        <button
          type="button"
          class="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          :title="t('prop.unlink')"
        >
          <Unlink class="w-3 h-3" />
          <span>{{ t('prop.unlink') }}</span>
        </button>
      </a-popconfirm>
    </div>

    <div class="text-[12px] text-slate-600 leading-normal flex items-center gap-1.5 flex-wrap py-0.5 select-none">
      <span class="text-slate-400">{{ t('prop.linkageWhen') }}</span>

      <button
        type="button"
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#1677ff] hover:bg-blue-100 hover:text-blue-700 font-medium border border-blue-200/80 transition-colors cursor-pointer max-w-[140px] truncate group"
        :title="t('prop.locateParentTip')"
        @click="locateParentField"
      >
        <span class="truncate">{{ dependencyInfo.parentLabel }}</span>
        <ExternalLink class="w-2.5 h-2.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      <span class="text-slate-400">{{ t('prop.linkageEquals') }}</span>

      <span class="font-medium text-slate-800">
        “{{ dependencyInfo.optLabel }}”
      </span>

      <span class="text-slate-500">{{ t('prop.linkageThenShow') }}</span>
    </div>

    <div class="flex items-center gap-1 text-[11px] text-slate-400 leading-tight">
      <Info class="w-3 h-3 text-slate-400 shrink-0" />
      <span>{{ t('prop.linkageTipSimple') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, markDirty, selectElement, highlightPropertyField } from '@/core/store';
import { t, getFieldText, getOptionLabel } from '@/core/i18n';
import { Link2, Unlink, ExternalLink, Info } from '@lucide/vue';

const props = defineProps<{
  element: FormElement;
}>();

const dependencyInfo = computed(() => {
  if (!props.element.dependsOn) return null;
  const dep = props.element.dependsOn;
  const yesLabel = t('canvas.yes');
  for (const page of store.pages) {
    const parentField = page.fields?.find(f => f.key === dep.fieldKey);
    if (parentField) {
      const parentLabel = getFieldText(parentField, 'label', undefined, true) || parentField.label || parentField.key;
      const opt = parentField.options?.find(o => o.value === dep.value);
      const optLabel = opt ? (getOptionLabel(opt, undefined, true) || opt.label || opt.value) : (dep.value === 'yes' ? yesLabel : dep.value);
      return {
        parentField,
        page,
        parentLabel,
        optLabel,
        rawDep: dep
      };
    }
  }
  const fallbackOpt = dep.value === 'yes' ? yesLabel : dep.value;
  return {
    parentField: null,
    page: null,
    parentLabel: dep.fieldKey,
    optLabel: fallbackOpt,
    rawDep: dep
  };
});

function locateParentField() {
  if (!dependencyInfo.value?.parentField) return;
  const field = dependencyInfo.value.parentField;
  selectElement(field);
  nextTick(() => {
    const el = document.querySelector(`[data-element-id="${field.id}"]`) || document.getElementById(field.id) || document.getElementById(`el_${field.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
    highlightPropertyField('label');
  });
}

function onToggleDependency(val: any) {
  if (!val) {
    delete props.element.dependsOn;
  }
  markDirty();
}
</script>
