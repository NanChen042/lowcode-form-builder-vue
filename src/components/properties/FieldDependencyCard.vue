<template>
  <!-- 条件联动从属信息：现代结构化逻辑卡片 -->
  <div
    v-if="element.dependsOn && dependencyInfo"
    class="pt-3.5 border-t border-slate-100"
  >
    <div class="rounded-xl border border-blue-200/90 bg-gradient-to-b from-blue-50/70 to-indigo-50/20 p-2.5 shadow-xs space-y-2.5 transition-all">
      <!-- 卡片顶栏：标题 + 生效中徽标 + 解除联动操作 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <Link2 class="h-3.5 w-3.5 text-[#1677ff]" />
          <span class="text-[12px] font-semibold text-slate-800">{{ t('prop.linkageRuleTitle') }}</span>
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 text-[10px] font-medium leading-none">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ t('prop.linkageActive') }}
          </span>
        </div>

        <!-- 解除联动按钮 (带气泡防误触) -->
        <a-popconfirm
          :content="t('prop.unlinkRuleConfirm')"
          type="warning"
          position="bottom"
          @ok="onToggleDependency(false)"
        >
          <button
            type="button"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-slate-400 hover:text-red-600 hover:bg-red-50/80 transition-all cursor-pointer border border-transparent hover:border-red-200/60"
            :title="t('prop.unlink')"
          >
            <Unlink class="w-3 h-3" />
            <span>{{ t('prop.unlink') }}</span>
          </button>
        </a-popconfirm>
      </div>

      <!-- 逻辑结构化胶囊区：当 [父字段 ↗] 选择 [选项值] 时展开 -->
      <div class="flex flex-wrap items-center gap-1.5 text-[12px] leading-relaxed select-none bg-white/95 p-2 rounded-lg border border-blue-100/90 shadow-2xs">
        <span class="text-slate-400 font-medium">{{ t('prop.linkageWhen') }}</span>
        
        <!-- 父级组件胶囊 (点击穿透定位高亮父组件) -->
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#1677ff] hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium cursor-pointer border border-blue-200/80 max-w-[130px] truncate group"
          :title="t('prop.locateParentTip')"
          @click="locateParentField"
        >
          <span class="truncate">{{ dependencyInfo.parentLabel }}</span>
          <ExternalLink class="w-2.5 h-2.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>

        <span class="text-slate-400 font-medium">{{ t('prop.linkageEquals') }}</span>

        <!-- 触发选项胶囊 -->
        <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200/80 max-w-[130px] truncate shadow-2xs">
          <span class="truncate">{{ dependencyInfo.optLabel }}</span>
        </span>

        <span class="text-slate-500 font-medium">{{ t('prop.linkageThenShow') }}</span>
      </div>

      <!-- 底部辅助说明 -->
      <div class="flex items-center gap-1 text-[11px] text-slate-400 leading-tight">
        <Info class="w-3 h-3 text-slate-400 shrink-0" />
        <span>{{ t('prop.linkageTipSimple') }}</span>
      </div>
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
    const el = document.querySelector(`[data-element-id="${field.id}"]`) || document.getElementById(`el_${field.id}`);
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
