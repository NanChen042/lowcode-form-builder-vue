<template>
  <div
    v-if="conditionItems.length > 0"
    class="pt-3.5 border-t border-slate-100 space-y-2.5"
  >
    <div class="flex items-center justify-between gap-1.5 whitespace-nowrap">
      <div class="flex items-center gap-1.5 shrink-0">
        <Link2 class="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span class="text-[12px] font-medium text-slate-700 whitespace-nowrap">{{ t('prop.linkageRuleTitle') }}</span>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <div
          v-if="conditionItems.length > 1 && element.linkage"
          class="inline-flex items-center p-0.5 rounded-[5px] bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 select-none h-6"
        >
          <button
            type="button"
            class="flex items-center justify-center h-5 px-2 rounded-[3.5px] transition-all cursor-pointer whitespace-nowrap !text-[11px] leading-none"
            :class="element.linkage.logic !== 'and' ? 'bg-[#1677ff] text-white font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            @click="setLinkageLogic('or')"
          >
            <span class="!text-[11px] leading-none whitespace-nowrap">{{ t('prop.linkageLogicOr') }}</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center h-5 px-2 rounded-[3.5px] transition-all cursor-pointer whitespace-nowrap !text-[11px] leading-none"
            :class="element.linkage.logic === 'and' ? 'bg-[#1677ff] text-white font-semibold shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            @click="setLinkageLogic('and')"
          >
            <span class="!text-[11px] leading-none whitespace-nowrap">{{ t('prop.linkageLogicAnd') }}</span>
          </button>
        </div>

        <a-popconfirm
          :content="t('prop.unlinkRuleConfirm')"
          type="warning"
          position="bottom"
          @ok="onToggleDependency(false)"
        >
          <button
            type="button"
            class="inline-flex items-center gap-1 !text-[11px] leading-none text-slate-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            :title="t('prop.unlink')"
          >
            <Unlink class="w-3 h-3 shrink-0" />
            <span class="!text-[11px] leading-none whitespace-nowrap">{{ t('prop.unlink') }}</span>
          </button>
        </a-popconfirm>
      </div>
    </div>

    <div class="space-y-1.5">
      <div
        v-for="(item, idx) in conditionItems"
        :key="item.rawCond.fieldKey + '_' + item.rawCond.value"
        class="text-[12px] text-slate-600 leading-normal flex items-center gap-1 py-0.5 select-none min-w-0"
      >
        <span class="text-slate-400 font-medium shrink-0">
          {{ idx === 0 ? t('prop.linkageWhen') : (element.linkage?.logic === 'and' ? t('prop.linkageAndJoin') : t('prop.linkageOrJoin')) }}
        </span>

        <button
          type="button"
          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#1677ff] hover:bg-blue-100 hover:text-blue-700 font-medium border border-blue-200/80 transition-colors cursor-pointer min-w-0 shrink max-w-[140px] truncate group !text-[12px]"
          :title="t('prop.locateParentTip')"
          @click="locateParentField(item.parentField)"
        >
          <span class="truncate !text-[12px]">{{ item.parentLabel }}</span>
          <ExternalLink class="w-2.5 h-2.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>

        <span class="text-slate-400 shrink-0">{{ t('prop.linkageEquals') }}</span>

        <span class="font-medium text-slate-800 shrink-0 max-w-[72px] truncate" :title="item.optLabel">
          “{{ item.optLabel }}”
        </span>

        <span v-if="idx === conditionItems.length - 1" class="text-slate-500 shrink-0">
          {{ t('prop.linkageThenShow') }}
        </span>

        <button
          v-if="conditionItems.length > 1"
          type="button"
          class="ml-auto text-slate-300 hover:text-red-500 transition-colors cursor-pointer px-1 !text-xs leading-none shrink-0"
          :title="t('prop.removeSingleCondition')"
          @click="removeCondition(item.origIdx)"
        >
          ×
        </button>
      </div>
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

const conditionItems = computed(() => {
  const conds = props.element.linkage?.conditions;
  if (!conds || conds.length === 0) return [];
  const yesLabel = t('canvas.yes');

  const items = conds.map((cond, idx) => {
    for (const page of store.pages) {
      const parentIdx = page.fields?.findIndex(f => f.key === cond.fieldKey) ?? -1;
      if (parentIdx !== -1 && page.fields) {
        const parentField = page.fields[parentIdx];
        const rawLabel = getFieldText(parentField, 'label', undefined, true) || parentField.key;
        const opt = parentField.options?.find(o => o.value === cond.value);
        const optLabel = opt
          ? (getOptionLabel(opt, undefined, true) || opt.value)
          : (cond.value === 'yes' ? yesLabel : cond.value);
        return {
          parentField,
          page,
          rawLabel,
          parentOrder: parentIdx,
          origIdx: idx,
          optLabel,
          rawCond: cond
        };
      }
    }
    const fallbackOpt = cond.value === 'yes' ? yesLabel : cond.value;
    return {
      parentField: null,
      page: null,
      rawLabel: cond.fieldKey,
      parentOrder: 999 + idx,
      origIdx: idx,
      optLabel: fallbackOpt,
      rawCond: cond
    };
  });

  items.sort((a, b) => a.parentOrder - b.parentOrder);
  return items.map((item, sortedIdx) => ({
    ...item,
    parentLabel: conds.length > 1 ? `#${sortedIdx + 1} ${item.rawLabel}` : item.rawLabel
  }));
});

function setLinkageLogic(logic: 'and' | 'or') {
  if (!props.element.linkage) return;
  props.element.linkage.logic = logic;
  markDirty();
}

function removeCondition(idx: number) {
  if (!props.element.linkage?.conditions) return;
  props.element.linkage.conditions.splice(idx, 1);
  if (props.element.linkage.conditions.length === 0) {
    delete props.element.linkage;
  }
  markDirty();
}

function locateParentField(field: FormElement | null) {
  if (!field) return;
  selectElement(field);
  nextTick(() => {
    const el = document.querySelector(`[data-element-id="${field.id}"]`) || document.getElementById(field.id) || document.getElementById(`el_${field.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
    highlightPropertyField('label');
  });
}

function onToggleDependency(val: boolean) {
  if (!val && props.element.linkage) {
    delete props.element.linkage;
  }
  markDirty();
}
</script>
