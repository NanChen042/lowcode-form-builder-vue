<template>
  <a-dropdown
    :popup-visible="visible"
    position="bl"
    :popup-max-height="false"
    @popup-visible-change="handleVisibleChange"
  >
    <div
      class="fixed pointer-events-none w-px h-px opacity-0"
      :style="{ left: `${x}px`, top: `${y}px` }"
    />

    <template #content>
      <template v-if="targetType === 'element' && targetElementId">
        <a-doption @click="handleDuplicateElement">
          <template #icon>
            <Copy class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ isRisk ? t('risk.duplicateQuestion') : t('context.duplicate') }}</span>
          <template #suffix>
            <span class="text-[10px] text-slate-400 font-mono">{{ isMac ? '⌘D' : 'Ctrl+D' }}</span>
          </template>
        </a-doption>

        <a-doption v-if="isRisk" @click="handleInsertRiskQuestionBelow">
          <template #icon>
            <Plus class="h-4 w-4 text-blue-500" />
          </template>
          <span>{{ t('risk.insertQuestionBelow') }}</span>
        </a-doption>

        <ComponentCascadeMenu
          v-else
          :title="t('context.insertBelow')"
          value-prefix="elem-insert"
          @select="handleQuickAddComponent"
        />

        <a-dsubmenu
          v-if="!isRisk && !isTargetChoiceComponent && upstreamLinkableParents.length > 0"
          value="elem-link-parent"
          trigger="hover"
        >
          <template #icon>
            <Link2 class="h-4 w-4 text-[#1677ff]" />
          </template>
          <template #default>
            <span class="text-[13px] text-slate-700">{{ t('context.linkComponent') }}</span>
          </template>
          <template #content>
            <a-dsubmenu
              v-for="parentItem in upstreamLinkableParents"
              :key="parentItem.field.id"
              :value="`link_p_${parentItem.field.id}`"
              trigger="hover"
            >
              <template #default>
                <div class="flex items-center justify-between gap-2 max-w-[210px]">
                  <span
                    class="text-[13px] truncate"
                    :class="parentItem.isLinked ? 'text-[#1677ff] font-medium' : 'text-slate-700'"
                  >
                    #{{ parentItem.orderNum }} {{ parentItem.title }}
                  </span>
                  <span class="text-[11px] text-slate-400 shrink-0">
                    {{ t(`comp.${parentItem.field.type}`) }}
                  </span>
                </div>
              </template>
              <template #content>
                <a-doption
                  v-for="opt in parentItem.field.options"
                  :key="`${parentItem.field.id}_${opt.value}`"
                  @click="handleToggleUpstreamParentOption(parentItem.field, opt)"
                >
                  <div class="flex items-center justify-between gap-3 min-w-[130px]">
                    <span
                      class="text-[13px] truncate max-w-[160px]"
                      :class="isLinkedToParentOption(parentItem.field, opt) ? 'text-[#1677ff] font-semibold' : 'text-slate-700'"
                    >
                      {{ getOptionLabel(opt) || opt.value }}
                    </span>
                    <Check
                      v-if="isLinkedToParentOption(parentItem.field, opt)"
                      class="h-3.5 w-3.5 text-[#1677ff] shrink-0"
                    />
                  </div>
                </a-doption>
              </template>
            </a-dsubmenu>
          </template>
        </a-dsubmenu>

        <a-dsubmenu
          v-else-if="!isRisk && isTargetChoiceComponent && downstreamLinkableTargets.length > 0"
          value="elem-link-child"
          trigger="hover"
        >
          <template #icon>
            <Link2 class="h-4 w-4 text-[#1677ff]" />
          </template>
          <template #default>
            <span class="text-[13px] text-slate-700">{{ t('context.linkComponent') }}</span>
          </template>
          <template #content>
            <a-dsubmenu
              v-for="opt in targetElement?.options"
              :key="`down_opt_${opt.value}`"
              :value="`down_opt_${opt.value}`"
              trigger="hover"
            >
              <template #default>
                <div class="flex items-center justify-between gap-2 min-w-[130px] max-w-[200px]">
                  <span
                    class="text-[13px] truncate"
                    :class="hasAnyDownstreamLinkedToOption(opt) ? 'text-[#1677ff] font-medium' : 'text-slate-700'"
                  >
                    {{ getOptionLabel(opt) || opt.value }}
                  </span>
                </div>
              </template>
              <template #content>
                <a-doption
                  v-for="downItem in downstreamLinkableTargets"
                  :key="`${opt.value}_${downItem.field.id}`"
                  @click="handleToggleDownstreamTarget(opt, downItem.field)"
                >
                  <div class="flex items-center justify-between gap-2.5 min-w-[170px] max-w-[230px]">
                    <span
                      class="text-[13px] truncate"
                      :class="isDownstreamLinkedToOption(downItem.field, opt) ? 'text-[#1677ff] font-semibold' : 'text-slate-700'"
                    >
                      #{{ downItem.orderNum }} {{ downItem.title }}
                    </span>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <span class="text-[11px] text-slate-400">
                        {{ t(`comp.${downItem.field.type}`) }}
                      </span>
                      <Check
                        v-if="isDownstreamLinkedToOption(downItem.field, opt)"
                        class="h-3.5 w-3.5 text-[#1677ff] shrink-0"
                      />
                    </div>
                  </div>
                </a-doption>
              </template>
            </a-dsubmenu>
          </template>
        </a-dsubmenu>

        <a-doption v-if="!isRisk && hasTargetLinkage" @click="handleUnlinkElement">
          <template #icon>
            <Unlink class="h-4 w-4 text-amber-500" />
          </template>
          <span>{{ t('context.unlinkElement') }}</span>
        </a-doption>

        <a-divider style="margin: 4px 0" />

        <a-doption class="context-danger-option" @click="handleDeleteElement">
          <template #icon>
            <Trash2 class="h-4 w-4 text-red-500" />
          </template>
          <span>{{ isRisk ? t('risk.deleteQuestion') : t('context.deleteElement') }}</span>
        </a-doption>
      </template>

      <template v-else-if="targetType === 'page' && targetPageId">
        <div
          v-if="isTargetSystemProfilePage"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-500 border-b border-slate-100 select-none"
        >
          <Lock class="h-3 w-3 text-blue-500" />
          <span>{{ t('context.presetReadOnly') }}</span>
        </div>

        <template v-if="!isTargetSystemProfilePage">
          <a-doption v-if="isRisk" @click="handleQuickAddRiskQuestion">
            <template #icon>
              <Plus class="h-4 w-4 text-blue-500" />
            </template>
            <span>{{ t('risk.addQuestion') }}</span>
          </a-doption>

          <ComponentCascadeMenu
            v-else
            :title="t('context.addComponent')"
            value-prefix="page-insert"
            title-class="font-medium text-slate-800"
            @select="handleQuickAddComponent"
          />

          <a-doption v-if="isRisk" @click="handleAddGroup">
            <template #icon>
              <FilePlus class="h-4 w-4 text-slate-500" />
            </template>
            <span>{{ t('risk.addGroup') }}</span>
          </a-doption>

          <a-divider style="margin: 4px 0" />
        </template>

        <a-doption v-if="!isRisk" @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.insertPageAfter') }}</span>
        </a-doption>

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.resetView') }}</span>
        </a-doption>

        <template v-if="!isRisk && !isTargetSystemProfilePage">
          <a-divider style="margin: 4px 0" />

          <a-doption class="context-danger-option" @click="handleDeletePage">
            <template #icon>
              <Trash2 class="h-4 w-4 text-red-500" />
            </template>
            <span>{{ t('context.deletePage') }}</span>
          </a-doption>
        </template>
      </template>

      <template v-else>
        <a-doption v-if="isRisk" @click="handleAddGroup">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('risk.addGroup') }}</span>
        </a-doption>
        <a-doption v-else @click="handleAddPage">
          <template #icon>
            <FilePlus class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.newPage') }}</span>
        </a-doption>

        <a-divider style="margin: 4px 0" />

        <a-doption @click="handleResetView">
          <template #icon>
            <Expand class="h-4 w-4 text-slate-500" />
          </template>
          <span>{{ t('context.resetView') }}</span>
        </a-doption>
      </template>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentType, FormElement, FormElementOption } from '@/types/schema';
import {
  addPage,
  deletePage,
  addQuestionGroup,
  resetCanvasView,
  duplicateElement,
  deleteElement,
  addElement,
  clearSelection,
  markDirty,
  isRisk,
  store
} from '@/core/store';
import { t, getFieldText, getOptionLabel } from '@/core/i18n';
import {
  getDirectChildren,
  getFieldDepthInPage,
  getSubtreeDepth,
  isParentLinkedToTargetWithOption,
  isParentLinkedToTargetAnyOption,
  toggleParentOptionLink,
  unlinkElementFromGroup
} from '@/utils/helpers';
import { Modal } from '@arco-design/web-vue';
import { FilePlus, Expand, Trash2, Copy, Lock, Plus, Link2, Unlink, Check } from '@lucide/vue';
import ComponentCascadeMenu from './ComponentCascadeMenu.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    x: number;
    y: number;
    targetPageId?: string | null;
    targetElementId?: string | null;
    targetType?: 'element' | 'page' | 'canvas';
  }>(),
  {
    targetPageId: null,
    targetElementId: null,
    targetType: 'canvas'
  }
);

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const targetPage = computed(() => {
  return props.targetPageId ? store.pages.find(p => p.id === props.targetPageId) : null;
});

const resolvedTargetPage = computed(() => {
  if (targetPage.value) return targetPage.value;
  if (!props.targetElementId) return null;
  return store.pages.find(p => p.fields?.some(f => f.id === props.targetElementId)) || null;
});

const targetElement = computed(() => {
  if (!props.targetElementId || !resolvedTargetPage.value?.fields) return null;
  return resolvedTargetPage.value.fields.find(f => f.id === props.targetElementId) || null;
});

const hasTargetLinkage = computed(() => {
  if (!targetElement.value || !resolvedTargetPage.value?.fields) return false;
  if (targetElement.value.linkage?.conditions?.length) return true;
  return getDirectChildren(resolvedTargetPage.value.fields, targetElement.value.key).length > 0;
});

const isTargetChoiceComponent = computed(() => {
  if (!targetElement.value) return false;
  return ['radio', 'select', 'checkbox'].includes(targetElement.value.type) && Boolean(targetElement.value.options?.length);
});

const upstreamLinkableParents = computed(() => {
  if (isRisk.value || isTargetChoiceComponent.value || !targetElement.value || !resolvedTargetPage.value?.fields) return [];
  const fields = resolvedTargetPage.value.fields;

  return fields
    .map((f, idx) => ({ field: f, idx }))
    .filter(({ field }) => {
      if (field.id === targetElement.value!.id) return false;
      if (getFieldDepthInPage(field, fields) >= 2) return false;
      return ['radio', 'select', 'checkbox'].includes(field.type) && Boolean(field.options?.length);
    })
    .map(({ field, idx }) => ({
      field,
      orderNum: idx + 1,
      title: getFieldText(field, 'label', undefined, true) || field.label || field.key,
      isLinked: isParentLinkedToTargetAnyOption(fields, field, targetElement.value!)
    }));
});

const downstreamLinkableTargets = computed(() => {
  if (isRisk.value || !isTargetChoiceComponent.value || !targetElement.value || !resolvedTargetPage.value?.fields) {
    return [];
  }
  const fields = resolvedTargetPage.value.fields;
  const myDepth = getFieldDepthInPage(targetElement.value, fields);
  if (myDepth >= 2) return [];

  const ancestorKeys = new Set<string>();
  const collectAncestors = (el: FormElement | undefined) => {
    const conds = el?.linkage?.conditions;
    if (!conds) return;
    for (const c of conds) {
      if (!ancestorKeys.has(c.fieldKey)) {
        ancestorKeys.add(c.fieldKey);
        const parent = fields.find(f => f.key === c.fieldKey);
        if (parent) collectAncestors(parent);
      }
    }
  };
  collectAncestors(targetElement.value);

  return fields
    .map((f, idx) => ({ field: f, idx }))
    .filter(({ field }) => {
      if (field.id === targetElement.value!.id || ancestorKeys.has(field.key)) return false;
      const targetSubtreeDepth = getSubtreeDepth(field, fields);
      return myDepth + 1 + targetSubtreeDepth <= 2;
    })
    .map(({ field, idx }) => ({
      field,
      orderNum: idx + 1,
      title: getFieldText(field, 'label', undefined, true) || field.label || field.key
    }));
});

function isLinkedToParentOption(parent: FormElement, opt: FormElementOption): boolean {
  if (!targetElement.value || !resolvedTargetPage.value?.fields) return false;
  return isParentLinkedToTargetWithOption(
    resolvedTargetPage.value.fields,
    parent,
    opt,
    targetElement.value
  );
}

function isDownstreamLinkedToOption(downField: FormElement, opt: FormElementOption): boolean {
  if (!targetElement.value || !resolvedTargetPage.value?.fields) return false;
  return isParentLinkedToTargetWithOption(
    resolvedTargetPage.value.fields,
    targetElement.value,
    opt,
    downField
  );
}

function hasAnyDownstreamLinkedToOption(opt: FormElementOption): boolean {
  return downstreamLinkableTargets.value.some(item => isDownstreamLinkedToOption(item.field, opt));
}

function handleToggleUpstreamParentOption(parent: FormElement, opt: FormElementOption) {
  try {
    const el = targetElement.value;
    const page = resolvedTargetPage.value;
    if (!el || !page?.fields) return;
    toggleParentOptionLink(page.fields, parent, opt, el);
    markDirty();
  } catch (err) {
    console.error('Failed to link upstream parent option via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleToggleDownstreamTarget(opt: FormElementOption, downField: FormElement) {
  try {
    const el = targetElement.value;
    const page = resolvedTargetPage.value;
    if (!el || !page?.fields) return;
    toggleParentOptionLink(page.fields, el, opt, downField);
    markDirty();
  } catch (err) {
    console.error('Failed to link downstream target via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleUnlinkElement() {
  try {
    const el = targetElement.value;
    const page = resolvedTargetPage.value;
    if (!el || !page?.fields) return;
    unlinkElementFromGroup(page.fields, el);
    markDirty();
  } catch (err) {
    console.error('Failed to unlink element via context menu:', err);
  } finally {
    emit('close');
  }
}

const isTargetSystemProfilePage = computed(() => {
  if (!props.targetPageId) return false;
  if (isRisk.value) return false;
  return targetPage.value?.pageType === 'system_profile' || store.pages[0]?.id === props.targetPageId;
});

const isTargetFirstPage = isTargetSystemProfilePage;

function handleVisibleChange(val: boolean) {
  if (!val) {
    emit('close');
  }
}

function handleQuickAddComponent(type: ComponentType) {
  try {
    if (props.targetType === 'element' && props.targetElementId) {
      addElement(type, props.targetPageId || undefined);
    } else {
      const targetPageId = props.targetPageId || store.activePageId || (store.pages[0]?.id ?? undefined);
      if (store.selectedType !== 'element') {
        clearSelection();
      }
      addElement(type, targetPageId);
    }
  } catch (err) {
    console.error('Failed to add component via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleInsertRiskQuestionBelow() {
  try {
    if (props.targetElementId) {
      addElement('radio', undefined, undefined, props.targetElementId);
    }
  } catch (err) {
    console.error('Failed to insert question below via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleQuickAddRiskQuestion() {
  try {
    addElement('radio', store.pages[0]?.id);
  } catch (err) {
    console.error('Failed to add question via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDuplicateElement() {
  try {
    if (props.targetElementId) {
      duplicateElement(props.targetElementId);
    }
  } catch (err) {
    console.error('Failed to duplicate element via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDeleteElement() {
  try {
    if (props.targetElementId) {
      deleteElement(props.targetElementId);
    }
  } catch (err) {
    console.error('Failed to delete element via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleAddPage() {
  try {
    addPage(props.targetPageId);
  } catch (err) {
    console.error('Failed to add page via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleAddGroup() {
  try {
    addQuestionGroup();
  } catch (err) {
    console.error('Failed to add group via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleResetView() {
  try {
    resetCanvasView();
  } catch (err) {
    console.error('Failed to reset view via context menu:', err);
  } finally {
    emit('close');
  }
}

function handleDeletePage() {
  if (isTargetFirstPage.value) return;
  if (props.targetPageId) {
    const pageId = props.targetPageId;
    Modal.confirm({
      title: t('context.confirmDeleteTitle'),
      content: t('context.confirmDeleteContent'),
      okText: t('context.confirmDeleteOk'),
      cancelText: t('common.cancel'),
      okButtonProps: { status: 'danger' },
      simple: false,
      width: 440,
      titleAlign: 'start',
      onOk: () => {
        deletePage(pageId);
      }
    });
  }
  emit('close');
}
</script>

<style scoped>
:deep(.context-danger-option) {
  color: #ef4444;
}
:deep(.context-danger-option:hover) {
  background-color: #fef2f2;
}
:deep(.context-disabled-option) {
  color: #cbd5e1;
  cursor: not-allowed;
}
</style>
