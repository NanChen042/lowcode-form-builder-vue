<template>
  <div
    :id="isTranslationFrame ? ('frame_trans_' + frameLocale + '_' + page.id) : (pageIndex === 0 ? 'tour-first-page-frame' : ('frame_' + page.id))"
    :data-page-id="page.id"
    :data-page-index="pageIndex"
    :data-page-type="page.pageType"
    :data-translation-frame="isTranslationFrame ? 'true' : undefined"
    :data-read-only-frame="isReadOnlyReference ? 'true' : undefined"
    class="mobile-frame absolute min-h-[720px] flex flex-col"
    :class="[
      isReadOnlyReference ? 'bg-[#f8fafc]' : 'bg-white',
      isRisk ? 'rounded-none shadow-[0_1px_4px_rgba(0,0,0,0.06),0_12px_32px_-6px_rgba(0,0,0,0.08)]' : 'w-[390px] rounded-2xl shadow-sm',
      !inTranslationWorkspace && isPageSelected && isCurrentLocaleFocused
        ? (isRisk ? 'is-selected ring-2 ring-blue-500 shadow-lg' : 'is-selected ring-2 ring-blue-500 ring-offset-1 shadow-md')
        : (inTranslationWorkspace
          ? (isReadOnlyReference
            ? 'ring-1 ring-slate-200/90 shadow-none'
            : 'ring-2 ring-[#1677ff] shadow-[0_12px_32px_-6px_rgba(22,119,255,0.18),0_2px_10px_rgba(22,119,255,0.08)]')
          : 'ring-1 ring-slate-200/90 hover:ring-slate-300 hover:shadow-md'),
      isFrameElevated ? 'z-20 is-active-frame' : 'z-10',
      store.isDraggingComponent && !isSystemProfile && !isTranslationFrame ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg border-blue-400' : '',
      store.isDraggingComponent && (isSystemProfile || isTranslationFrame) ? 'opacity-85' : '',
      (store.isDraggingFrame && store.draggedFrameId === page.id) ? 'transition-none is-dragging-frame' : 'transition-shadow transition-colors duration-200'
    ]"
    :style="{
      transform: `translate(${frameX}px, ${frameY}px)`,
      width: inTranslationWorkspace ? `${getTranslationPageWidth()}px` : (isRisk ? `${store.riskPageWidth}px` : undefined)
    }"
    @mousedown="handleFrameMouseDown"
    @click.stop="handleSelectPage"
  >

    <!-- 画板顶部信息栏 -->
    <div class="absolute -top-8 left-0 right-0 flex items-center justify-between gap-2 select-none">
      <div class="flex items-center gap-1.5 text-[12px] font-medium tracking-wider text-black/40 transition-colors min-w-0" :class="inTranslationWorkspace ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:text-black/70'">
        <Smartphone v-if="!isRisk" class="h-3.5 w-3.5 shrink-0" />
        <template v-if="isSystemProfile">
          <span class="font-mono font-medium text-slate-700">01 · {{ t('common.basicInfo') }}</span>
          <span class="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200/60 ml-0.5">
            <Lock class="h-2.5 w-2.5" />
            {{ t('common.systemPreset') }}
          </span>
          <span v-if="store.isDraggingComponent" class="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 border border-rose-200/80 ml-0.5 animate-pulse">
            {{ t('common.cannotDrop') }}
          </span>
        </template>
        <template v-else>
          <span v-if="!isRisk" class="font-mono font-bold text-[13px] tracking-normal shrink-0" :class="inTranslationWorkspace && !isReadOnlyReference ? 'text-[#1677ff]' : 'text-slate-700'">{{ pageIndexString }}</span>
          <span v-if="!isRisk" class="text-slate-400 font-normal shrink-0">·</span>
          <span
            class="font-medium max-w-[160px] truncate"
            :class="inTranslationWorkspace && !isReadOnlyReference ? 'text-slate-800 font-semibold' : ((displayPageTitle || sourcePageTitle) ? 'text-slate-600' : 'text-slate-400 font-normal')"
          >
            {{ isRisk ? ((inTranslationWorkspace ? (displayPageTitle || sourcePageTitle) : displayPageTitle) || t('risk.pageTitle')) : (displayPageTitle || sourcePageTitle || t('common.untitledPage')) }}
          </span>
        </template>
      </div>

      <!-- 多语言对照模式下顶部语言标识 -->
      <div v-if="inTranslationWorkspace" class="flex items-center gap-1.5 shrink-0">
        <span
          v-if="isReadOnlyReference"
          class="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200/90"
        >
          <span>{{ getLocaleNativeName(frameLocale) }}</span>
        </span>
        <span
          v-else
          class="inline-flex items-center rounded bg-[#1677ff] px-2 py-0.5 text-[11px] font-semibold text-white shadow-2xs"
        >
          <span>{{ getLocaleNativeName(frameLocale) }}</span>
        </span>
      </div>
    </div>

    <div
      v-if="store.isDraggingComponent && !isSystemProfile && !isTranslationFrame"
      class="absolute -top-7 right-0 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs select-none pointer-events-none animate-pulse"
    >
      <ArrowDownToLine class="h-3 w-3 text-blue-500" />
      <span>{{ t('canvas.droppable') }}</span>
    </div>

    <div class="flex-1 flex flex-col w-full relative" :class="isRisk ? 'rounded-none' : 'rounded-2xl'">
      <div
        v-if="store.isDraggingComponent && isSystemProfile"
        class="absolute inset-0 z-30 rounded-2xl bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none transition-all duration-200 border-2 border-dashed border-slate-300"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md mb-2.5 text-slate-500">
          <Lock class="h-5 w-5 text-slate-400" />
        </div>
        <span class="text-[13px] font-bold text-slate-700 bg-white/95 px-3 py-1 rounded-full shadow-2xs border border-slate-200">
          {{ t('canvas.presetCannotDrop') }}
        </span>
        <p class="mt-2 text-[11px] text-slate-500 max-w-[220px] leading-relaxed m-0">
          {{ t('canvas.dragToFormCanvas') }}
        </p>
      </div>

      <div class="page-header-area pb-4 shrink-0" :class="[isReadOnlyReference ? 'bg-[#f8fafc]' : 'bg-white', isRisk ? 'px-8 pt-7 rounded-none' : 'px-6 pt-6 rounded-t-2xl']" @click.stop="handleSelectPage">
        <template v-if="isSystemProfile">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold tracking-tight text-slate-800 m-0 leading-7">
              {{ getPageText(page, 'title', frameLocale) || t('common.basicInfo') }}
            </h2>
            <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Lock class="h-3 w-3" />
              {{ t('common.readOnly') }}
            </span>
          </div>
        </template>
        <template v-else>
          <EditableText
            v-model="displayPageTitle"
            :placeholder="pageTitlePlaceholder"
            :element-id="page.id"
            field="title"
            tag="h2"
            :custom-class="`page-title-text text-xl ${isRisk ? 'font-bold' : 'font-semibold'} tracking-tight leading-7 text-slate-800 w-full block border-b-2 border-transparent pb-1`"
          />
          <EditableText
            v-if="!inTranslationWorkspace || sourcePageDesc?.trim() || displayPageDesc?.trim()"
            v-model="displayPageDesc"
            :placeholder="pageDescPlaceholder"
            :element-id="page.id"
            field="description"
            tag="p"
            :allow-empty="!isTranslationFrame || !sourcePageDesc"
            multiline
            :custom-class="`page-desc-text mt-1.5 w-full ${isRisk ? 'text-[14px]' : 'text-[15px]'} leading-6 text-slate-500 block border-b-2 border-transparent pb-1`"
          />
        </template>
      </div>

      <div v-if="isSystemProfile" class="flex-1 bg-white p-3 rounded-b-2xl" @click="handleSelectPage">
        <SystemProfileView
          :profile-type="page.profileType || store.meta.profileType || 'customer'"
          :show-skeleton="page.showSkeleton !== false"
          :is-canvas="true"
          :locale="frameLocale"
        />
      </div>

      <div v-else-if="isRisk" class="canvas-pages-container relative flex-1 bg-white flex flex-col rounded-none px-8 pb-10 pt-2 space-y-5">
        <div ref="riskGroupsContainerRef" class="risk-groups-list space-y-5">
          <div
            v-for="(grp, gIdx) in page.groups"
            :key="grp.id"
            :id="isTranslationFrame ? ('risk_grp_trans_' + grp.id) : (gIdx === 0 ? 'tour-risk-first-group' : ('risk_grp_' + grp.id))"
            :data-risk-group-id="grp.id"
            class="risk-group-section border rounded-[4px] bg-white transition-[border-color,box-shadow] duration-150"
            :class="
              store.selectedType === 'group' && store.selectedId === grp.id && (inTranslationWorkspace || isCurrentLocaleFocused)
                ? 'border-[#1677ff] ring-2 ring-blue-500/20 shadow-xs'
                : 'border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300'
            "
            @click.stop="handleSelectGroup(grp.id)"
          >

            <div
              class="risk-group-header flex items-center justify-between gap-3 px-4 py-2.5 border-b rounded-t-[4px] transition-colors"
              :class="[
                isTranslationFrame ? '' : 'cursor-grab active:cursor-grabbing',
                isGroupTitleUnfilled(grp) ? 'border-amber-200/90 bg-amber-50/85' : 'border-blue-100/90 bg-[#f0f6ff]'
              ]"
            >
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <GripVertical
                  v-if="!isTranslationFrame"
                  class="risk-group-drag-handle h-4 w-4 text-blue-300 hover:text-blue-600 shrink-0 cursor-grab active:cursor-grabbing transition-colors"
                  :title="t('risk.dragReorderTip')"
                />
                <EditableText
                  :model-value="getGroupTitle(grp, gIdx)"
                  :placeholder="getGroupTitlePlaceholder(grp, gIdx)"
                  :element-id="grp.id"
                  field="title"
                  tag="span"
                  custom-class="group-title-text text-[14px] font-semibold text-blue-950 leading-5 inline-block max-w-full truncate"
                  @update:model-value="(val) => setGroupTitle(grp, val)"
                />
              </div>

              <div class="flex items-center gap-2 shrink-0 select-none">
                <span
                  v-if="!isTranslationFrame"
                  class="rounded bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-400 border border-slate-200/70"
                >
                  Yes / No / Not Applicable
                </span>
                <span class="rounded bg-white/95 px-2 py-0.5 text-[11px] font-medium text-blue-600 border border-blue-200/80 shadow-2xs">
                  {{ getGroupFields(grp.id).length }} {{ t('risk.questionUnit') }}
                </span>

                <a-popconfirm
                  v-if="!isTranslationFrame && (page.groups?.length || 0) > 1"
                  :content="t('risk.deleteGroupConfirm')"
                  position="tr"
                  type="error"
                  :ok-text="t('modal.confirm')"
                  :cancel-text="t('modal.cancel')"
                  @ok="deleteQuestionGroup(grp.id)"
                >
                  <button
                    type="button"
                    class="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    :title="t('risk.deleteGroup')"
                    @click.stop
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </a-popconfirm>
              </div>
            </div>


            <div
              :ref="(el) => setRiskGroupDropzoneRef(grp.id, el as HTMLElement | null)"
              class="risk-group-dropzone min-h-[48px] bg-white transition-colors"
              :class="{ 'bg-blue-50/15': store.isDraggingComponent && !isTranslationFrame }"
              :data-page-id="page.id"
              :data-risk-group-id="grp.id"
            >
              <div
                v-for="element in getGroupFields(grp.id)"
                :key="element.id"
                :data-group-id="element.id"
                :data-element-id="element.id"
                class="canvas-element-group relative"
                @click.stop
              >
                <CanvasElement :element="element" />
              </div>

              <div
                v-if="getGroupFields(grp.id).length === 0 && !store.isDraggingComponent"
                class="pointer-events-none py-6 text-center text-[12.5px] text-slate-400 border border-dashed border-slate-200/90 rounded-[3px] bg-slate-50/40 m-3"
              >
                {{ t('risk.dropzoneTip') }}
              </div>
            </div>


            <div v-if="!isTranslationFrame" class="px-4 py-2 bg-slate-50/40 border-t border-slate-100 flex items-center">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium text-[#1677ff] hover:bg-blue-50/80 rounded transition-colors cursor-pointer"
                @click.stop="addElement('radio', page.id, grp.id)"
              >
                <Plus class="h-3.5 w-3.5 stroke-[2.2]" />
                <span>{{ t('risk.addQuestion') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 规范化分组添加插槽：与卡片同宽、轻量虚线结构、稳重专业 -->
        <div
          v-if="!isTranslationFrame"
          class="risk-add-group-slot group/slot flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] border border-dashed border-slate-200/90 hover:border-[#1677ff] bg-slate-50/50 hover:bg-blue-50/30 text-slate-500 hover:text-[#1677ff] transition-all duration-150 cursor-pointer select-none"
          @click.stop="addQuestionGroup()"
        >
          <div class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200/60 group-hover/slot:bg-[#1677ff] text-slate-500 group-hover/slot:text-white transition-colors">
            <Plus class="h-3 w-3 stroke-[2.5]" />
          </div>
          <span class="text-[13px] font-medium leading-none tracking-tight">
            {{ t('risk.addSectionSlot') }}
          </span>
        </div>
      </div>

      <div v-else class="canvas-pages-container relative flex-1 flex flex-col rounded-b-2xl" :class="isReadOnlyReference ? 'bg-[#f8fafc]' : 'bg-white'">
        <div v-if="page.fields.length === 0" class="empty-state canvas-empty-state pointer-events-none absolute inset-3 z-0 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/30 transition-opacity duration-200" :class="{ 'opacity-0': store.isDraggingComponent }">
          <div class="relative mb-6 grid h-20 w-24 grid-cols-2 gap-2">
            <div class="col-span-2 rounded-md border border-slate-200 bg-white shadow-sm"></div>
            <div class="rounded-md border border-slate-200 bg-white shadow-sm"></div>
            <div class="flex items-center justify-center rounded-md border-2 border-dashed border-blue-300 bg-blue-50/50 text-blue-500 transition-all hover:bg-blue-100">
              <ArrowDownToLine class="h-4 w-4" />
            </div>
          </div>

          <h3 class="text-[14px] font-semibold tracking-tight text-slate-800">{{ t('canvas.emptyTitle') }}</h3>
          <p class="mt-2 max-w-[260px] text-center text-[12px] leading-relaxed text-slate-500">
            {{ t('canvas.emptyDesc') }}
          </p>
        </div>

        <svg
          v-if="!store.isDraggingComponent && linkageSvgRuns.length > 0"
          class="branch-line-decor pointer-events-none absolute inset-0 w-full h-full overflow-visible z-20"
        >
          <g v-for="run in linkageSvgRuns" :key="run.key">
            <path
              :d="run.trunkPath"
              fill="none"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              v-for="pLine in run.parentBranches"
              :key="pLine.key"
              :x1="pLine.x1"
              :y1="pLine.y"
              :x2="pLine.x2"
              :y2="pLine.y"
              stroke="#3b82f6"
              stroke-width="2"
            />
            <line
              v-for="cLine in run.childBranches"
              :key="cLine.key"
              :x1="cLine.x1"
              :y1="cLine.y"
              :x2="cLine.x2"
              :y2="cLine.y"
              stroke="#3b82f6"
              stroke-width="2"
            />
            <polygon
              v-for="arrow in run.arrows"
              :key="arrow.key"
              :points="arrow.points"
              fill="#3b82f6"
            />
            <circle
              v-for="dot in run.dots"
              :key="dot.key"
              :cx="dot.x"
              :cy="dot.y"
              r="3.5"
              fill="#3b82f6"
              stroke="#ffffff"
              stroke-width="1.2"
            />
          </g>
        </svg>

        <div
          ref="dropzoneRef"
          class="canvas-dropzone relative z-10 flex-1 min-h-[520px] p-3 transition-colors duration-200"
          :class="{
            'has-elements': page.fields.length > 0,
            'bg-blue-50/15': store.isDraggingComponent && !isTranslationFrame
          }"
          :data-page-id="page.id"
          :style="page.fields.some(f => f.linkage?.conditions?.length) ? { paddingLeft: '24px' } : undefined"
          @click.self="handleSelectPage"
        >
          <div
            v-for="group in elementGroups"
            :key="group.id"
            :data-group-id="group.id"
            class="canvas-element-group relative"
            :class="{ 'is-multi-branch-group': group.elements.length > 1 }"
            @click.stop
          >
            <CanvasElement
              v-for="element in group.elements"
              :key="element.id"
              :element="element"
            />
          </div>
        </div>
      </div>
    </div>

    <a-tooltip v-if="!isRisk && !inTranslationWorkspace" :content="t('canvas.addPageRight')" position="top">
      <div class="add-next-page-btn absolute -right-3 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#1677ff] shadow-md border border-slate-200/90 transition hover:scale-110 hover:border-[#1677ff]" @click.stop="addPage(page.id)">
        <Plus class="h-4 w-4" />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, provide } from 'vue';
import type { FormPage, FormElement, FormQuestionGroup, ComponentType } from '@/types/schema';
import {
  store,
  isRisk,
  primaryLocale,
  getPageWidth,
  getTranslationPageWidth,
  TRANSLATION_FRAME_GAP,
  addElement,
  selectPage,
  selectGroup,
  addQuestionGroup,
  deleteQuestionGroup,
  addPage,
  createElement,
  selectElement,
  markDirty,
  updatePageFields,
  updatePageGroups
} from '@/core/store';
import {
  t,
  getPageText,
  setPageText,
  getGroupText,
  setGroupText,
  getLocaleNativeName
} from '@/core/i18n';
import { getConnectedLinkageGroup } from '@/utils/helpers';
import Sortable from 'sortablejs';
import CanvasElement from './CanvasElement.vue';
import EditableText from '@/components/common/EditableText.vue';
import SystemProfileView from '@/components/common/SystemProfileView.vue';
import { Smartphone, ArrowDownToLine, GripVertical, Trash2, Plus, Lock } from '@lucide/vue';

const props = defineProps<{
  page: FormPage;
  pageIndex: number;
  isTranslationFrame?: boolean;
  translationLocale?: string;
  inTranslationWorkspace?: boolean;
  isReadOnlyReference?: boolean;
  customX?: number;
  customY?: number;
}>();

const isTranslationFrameComputed = computed(() => Boolean(props.isTranslationFrame));
const isReadOnlyReferenceComputed = computed(() => Boolean(props.isReadOnlyReference));
const frameLocale = computed<string>(() => {
  if (props.translationLocale) {
    return props.translationLocale;
  }
  if (props.isTranslationFrame) {
    return store.activeTargetLocale || (primaryLocale.value === 'zh' ? 'en' : 'zh');
  }
  return primaryLocale.value;
});

provide('frameLocale', frameLocale);
provide('isTranslationFrame', isTranslationFrameComputed);
provide('isReadOnlyFrame', isReadOnlyReferenceComputed);

const isCurrentLocaleFocused = computed(() => {
  const activeLoc = store.editingLocale || primaryLocale.value;
  return activeLoc === frameLocale.value;
});

const frameX = computed(() => {
  if (props.customX !== undefined) {
    return props.customX;
  }
  if (props.isTranslationFrame && !props.inTranslationWorkspace) {
    return props.page.x + getPageWidth() + TRANSLATION_FRAME_GAP;
  }
  return props.page.x;
});

const frameY = computed(() => {
  if (props.customY !== undefined) {
    return props.customY;
  }
  return props.page.y;
});

function handleSelectPage() {
  if (props.isReadOnlyReference) return;
  store.editingLocale = frameLocale.value;
  selectPage(props.page.id);
}

function handleSelectGroup(groupId: string) {
  if (props.isReadOnlyReference) return;
  store.editingLocale = frameLocale.value;
  selectGroup(groupId);
}

const isSystemProfile = computed(() => props.page.pageType === 'system_profile');

const pageIndexString = computed(() => {
  return String(props.pageIndex + 1).padStart(2, '0');
});

const dropzoneRef = ref<HTMLElement | null>(null);
const riskGroupsContainerRef = ref<HTMLElement | null>(null);
let riskGroupsSortable: Sortable | null = null;
const riskGroupDropzoneEls = new Map<string, HTMLElement>();
const riskGroupSortables = new Map<string, Sortable>();

const linkageLayoutTick = ref(0);
let linkageResizeObserver: ResizeObserver | null = null;
let linkageMutationObserver: MutationObserver | null = null;

function refreshLinkageLayout() {
  linkageLayoutTick.value++;
}

function syncLinkageObservers() {
  if (!dropzoneRef.value || isRisk.value || isSystemProfile.value) return;
  if (linkageResizeObserver) {
    linkageResizeObserver.disconnect();
    linkageResizeObserver.observe(dropzoneRef.value);
    dropzoneRef.value.querySelectorAll('.canvas-element').forEach(el => {
      linkageResizeObserver?.observe(el);
    });
  }
  refreshLinkageLayout();
}

interface LinkageSvgRun {
  key: string;
  trunkPath: string;
  parentBranches: Array<{ key: string; x1: number; x2: number; y: number }>;
  childBranches: Array<{ key: string; x1: number; x2: number; y: number }>;
  arrows: Array<{ key: string; points: string }>;
  dots: Array<{ key: string; x: number; y: number }>;
}

const linkageSvgRuns = computed<LinkageSvgRun[]>(() => {
  void linkageLayoutTick.value;
  if (isRisk.value || isSystemProfile.value || store.isDraggingComponent) return [];
  const dz = dropzoneRef.value;
  const fields = props.page.fields || [];
  if (!dz || fields.length === 0) return [];

  const getCardMetrics = (fieldId: string) => {
    const groupEl = dz.querySelector(`[data-group-id="${fieldId}"]`) as HTMLElement | null;
    if (!groupEl) return null;
    const cardEl = (groupEl.querySelector(':scope > .canvas-element') || groupEl) as HTMLElement;
    const left = dz.offsetLeft + groupEl.offsetLeft + cardEl.offsetLeft;
    const top = dz.offsetTop + groupEl.offsetTop + cardEl.offsetTop;
    const height = cardEl.offsetHeight;
    return { left, top, height };
  };

  const keyToIdx = new Map<string, number>();
  fields.forEach((f, idx) => {
    if (f.key) keyToIdx.set(f.key, idx);
  });

  const rawIntervals: Array<{
    min: number;
    max: number;
    parentKeys: Set<string>;
    childIndices: Set<number>;
  }> = [];

  for (let idx = 0; idx < fields.length; idx++) {
    const conds = fields[idx].linkage?.conditions;
    if (!conds || conds.length === 0) continue;
    let min = idx;
    let max = idx;
    const parentKeys = new Set<string>();
    for (const c of conds) {
      const pIdx = keyToIdx.get(c.fieldKey);
      if (pIdx !== undefined) {
        min = Math.min(min, pIdx);
        max = Math.max(max, pIdx);
        parentKeys.add(c.fieldKey);
      }
    }
    rawIntervals.push({
      min,
      max,
      parentKeys,
      childIndices: new Set([idx])
    });
  }

  if (rawIntervals.length === 0) return [];

  rawIntervals.sort((a, b) => a.min - b.min || a.max - b.max);
  const mergedIntervals: typeof rawIntervals = [];
  for (const interval of rawIntervals) {
    const prev = mergedIntervals[mergedIntervals.length - 1];
    if (prev && interval.min <= prev.max) {
      prev.max = Math.max(prev.max, interval.max);
      for (const pk of interval.parentKeys) prev.parentKeys.add(pk);
      for (const ci of interval.childIndices) prev.childIndices.add(ci);
    } else {
      mergedIntervals.push({
        min: interval.min,
        max: interval.max,
        parentKeys: new Set(interval.parentKeys),
        childIndices: new Set(interval.childIndices)
      });
    }
  }

  const runs: LinkageSvgRun[] = [];
  const laneX = 12;
  const cornerR = 4;

  for (const group of mergedIntervals) {
    interface TrunkNode {
      id: string;
      kind: 'parent' | 'child';
      left: number;
      endX: number;
      y: number;
      isMulti: boolean;
    }

    const nodes: TrunkNode[] = [];
    for (let idx = group.min; idx <= group.max; idx++) {
      const field = fields[idx];
      const isChild = group.childIndices.has(idx);
      const isParent = group.parentKeys.has(field.key);
      if (!isChild && !isParent) continue;

      const m = getCardMetrics(field.id);
      if (!m) continue;

      if (isChild) {
        nodes.push({
          id: field.id,
          kind: 'child',
          left: m.left,
          endX: m.left - 5,
          y: Math.round(m.top + 25),
          isMulti: (field.linkage?.conditions?.length || 0) > 1
        });
      } else if (isParent) {
        nodes.push({
          id: field.id,
          kind: 'parent',
          left: m.left,
          endX: m.left,
          y: Math.round(m.top + m.height / 2),
          isMulti: false
        });
      }
    }

    if (nodes.length === 0) continue;
    nodes.sort((a, b) => a.y - b.y);

    const runKey = `run_${group.min}_${group.max}`;
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const topY = firstNode.y;
    const bottomY = lastNode.y;

    let trunkPath = '';
    if (nodes.length >= 2 && bottomY > topY) {
      const r = Math.min(cornerR, Math.max(0, Math.floor((bottomY - topY) / 2)));
      trunkPath = `M ${firstNode.endX} ${topY} H ${laneX + r} Q ${laneX} ${topY} ${laneX} ${topY + r} V ${bottomY - r} Q ${laneX} ${bottomY} ${laneX + r} ${bottomY} H ${lastNode.endX}`;
    } else {
      const fallbackTopY = topY - 8;
      trunkPath = `M ${laneX} ${fallbackTopY} V ${bottomY - cornerR} Q ${laneX} ${bottomY} ${laneX + cornerR} ${bottomY} H ${lastNode.endX}`;
    }

    const parentBranches: Array<{ key: string; x1: number; x2: number; y: number }> = [];
    const childBranches: Array<{ key: string; x1: number; x2: number; y: number }> = [];

    for (let k = 1; k < nodes.length - 1; k++) {
      const node = nodes[k];
      if (node.kind === 'parent') {
        parentBranches.push({
          key: `pb_${runKey}_${node.id}`,
          x1: laneX,
          x2: node.endX,
          y: node.y
        });
      } else {
        childBranches.push({
          key: `cb_${runKey}_${node.id}`,
          x1: laneX,
          x2: node.endX,
          y: node.y
        });
      }
    }

    const arrows = nodes
      .filter(n => n.kind === 'child')
      .map(c => ({
        key: `arr_${runKey}_${c.id}`,
        points: `${c.left - 1},${c.y} ${c.left - 6},${c.y - 3.5} ${c.left - 6},${c.y + 3.5}`
      }));

    const dots: Array<{ key: string; x: number; y: number }> = [];
    for (const n of nodes) {
      if (n.kind === 'parent') {
        dots.push({ key: `pdot_${runKey}_${n.id}`, x: n.left, y: n.y });
      } else if (n.isMulti) {
        dots.push({ key: `cdot_${runKey}_${n.id}`, x: laneX, y: n.y });
      }
    }

    runs.push({
      key: runKey,
      trunkPath,
      parentBranches,
      childBranches,
      arrows,
      dots
    });
  }

  return runs;
});

function setRiskGroupDropzoneRef(groupId: string, el: HTMLElement | null) {
  if (el) {
    riskGroupDropzoneEls.set(groupId, el);
  } else {
    riskGroupDropzoneEls.delete(groupId);
  }
}

function getGroupTitle(grp: FormQuestionGroup, _idx?: number): string {
  return getGroupText(grp, 'title', frameLocale.value);
}

function isGroupTitleUnfilled(grp: FormQuestionGroup): boolean {
  if (!store.showPublishValidation || props.isReadOnlyReference) return false;
  const sourceTitle = getGroupText(grp, 'title', primaryLocale.value).trim();
  if (props.isTranslationFrame) {
    return Boolean(sourceTitle) && !getGroupText(grp, 'title', frameLocale.value).trim();
  }
  return !sourceTitle;
}

function getGroupTitlePlaceholder(grp?: FormQuestionGroup, _idx?: number): string {
  if (props.isTranslationFrame && grp) {
    const srcTitle = getGroupText(grp, 'title', primaryLocale.value);
    if (srcTitle) return srcTitle;
  }
  return t('risk.groupNamePlaceholder');
}

function setGroupTitle(grp: FormQuestionGroup, val: string) {
  setGroupText(grp, 'title', val, frameLocale.value);
}

function getGroupFields(groupId: string): FormElement[] {
  const firstGroupId = props.page.groups?.[0]?.id;
  return props.page.fields.filter(f => (f.groupId || firstGroupId) === groupId);
}

function rebuildRiskFieldsOrder(targetGroupId: string, updatedGroupList: FormElement[]) {
  const groups = props.page.groups || [];
  const firstGroupId = groups[0]?.id;
  const newFields: FormElement[] = [];
  for (const grp of groups) {
    if (grp.id === targetGroupId) {
      updatedGroupList.forEach(el => {
        el.groupId = grp.id;
        newFields.push(el);
      });
    } else {
      props.page.fields
        .filter(f => (f.groupId || firstGroupId) === grp.id)
        .forEach(el => newFields.push(el));
    }
  }
  updatePageFields(props.page.id, newFields);
}

function syncRiskGroupSortables() {
  if (!isRisk.value || props.isTranslationFrame) return;

  if (riskGroupsContainerRef.value && !riskGroupsSortable) {
    riskGroupsSortable = new Sortable(riskGroupsContainerRef.value, {
      group: {
        name: 'risk-groups',
        put: ['risk-groups', 'sidebar-risk-groups']
      },
      animation: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'drag-chosen',
      fallbackClass: 'drag-fallback',
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      direction: 'vertical',
      swapThreshold: 0.5,
      handle: '.risk-group-header',
      draggable: '.risk-group-section',
      filter: 'input, textarea, select, button, .group-title-text, [contenteditable]',
      preventOnFilter: false,
      onStart(evt) {
        store.isDraggingComponent = true;
        document.body.classList.add('is-dragging-component');
        const fallback = document.querySelector('body > .drag-fallback') as HTMLElement;
        if (fallback && evt.item) {
          const rect = evt.item.getBoundingClientRect();
          const scale = store.canvasState.scale || 1;
          const visual = evt.item.cloneNode(true) as HTMLElement;
          visual.classList.remove('sortable-ghost', 'drag-chosen');
          visual.classList.add('drag-fallback-visual');
          visual.style.position = 'relative';
          visual.style.left = '0';
          visual.style.top = '0';
          visual.style.width = `${evt.item.offsetWidth}px`;
          visual.style.height = `${evt.item.offsetHeight}px`;
          visual.style.transform = `scale(${scale})`;
          visual.style.transformOrigin = '0 0';
          visual.style.boxSizing = 'border-box';
          visual.style.pointerEvents = 'none';
          visual.querySelectorAll('.element-actions, .arco-popconfirm, .arco-popover').forEach(el => el.remove());
          fallback.style.left = `${rect.left}px`;
          fallback.style.top = `${rect.top}px`;
          fallback.style.width = `${rect.width}px`;
          fallback.style.height = `${rect.height}px`;
          fallback.classList.add('drag-fallback-shell');
          fallback.innerHTML = '';
          fallback.appendChild(visual);
        }
      },
      onEnd() {
        store.isDraggingComponent = false;
        document.body.classList.remove('is-dragging-component');
      },
      onAdd(evt) {
        const itemEl = evt.item;
        const insertIdx = evt.newIndex ?? (props.page.groups?.length || 0);
        itemEl.remove();
        addQuestionGroup(undefined, insertIdx);
      },
      onUpdate(evt) {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex && props.page.groups) {
          const groups = [...props.page.groups];
          const [movedGrp] = groups.splice(evt.oldIndex, 1);
          if (movedGrp) {
            groups.splice(evt.newIndex, 0, movedGrp);
            updatePageGroups(props.page.id, groups);
            const firstGroupId = groups[0]?.id;
            updatePageFields(
              props.page.id,
              groups.flatMap(g =>
                props.page.fields.filter(f => (f.groupId || firstGroupId) === g.id)
              )
            );
            selectGroup(movedGrp.id);
            markDirty();
          }
        }
      }
    });
  }

  for (const [id, inst] of riskGroupSortables.entries()) {
    if (!riskGroupDropzoneEls.has(id)) {
      inst.destroy();
      riskGroupSortables.delete(id);
    }
  }

  for (const [grpId, containerEl] of riskGroupDropzoneEls.entries()) {
    if (riskGroupSortables.has(grpId)) continue;
    const inst = new Sortable(containerEl, {
      group: 'shared',
      animation: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'drag-chosen',
      fallbackClass: 'drag-fallback',
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      swapThreshold: 0.65,
      emptyInsertThreshold: 24,
      draggable: '.canvas-element-group, .component-item',
      filter: 'input, textarea, select, button, .canvas-text-focus, .action-btn, .risk-weight-slider-section, .risk-weight-selector, .slider-track',
      preventOnFilter: false,
      onStart(evt) {
        store.isDraggingComponent = true;
        document.body.classList.add('is-dragging-component');
        const fallback = document.querySelector('body > .drag-fallback') as HTMLElement;
        if (fallback && evt.item) {
          const rect = evt.item.getBoundingClientRect();
          const scale = store.canvasState.scale || 1;
          const visual = evt.item.cloneNode(true) as HTMLElement;
          visual.classList.remove('sortable-ghost', 'drag-chosen');
          visual.classList.add('drag-fallback-visual');
          visual.style.position = 'relative';
          visual.style.left = '0';
          visual.style.top = '0';
          visual.style.width = `${evt.item.offsetWidth}px`;
          visual.style.height = `${evt.item.offsetHeight}px`;
          visual.style.transform = `scale(${scale})`;
          visual.style.transformOrigin = '0 0';
          visual.style.boxSizing = 'border-box';
          visual.style.pointerEvents = 'none';
          visual.querySelectorAll('.element-actions').forEach(btn => btn.remove());
          fallback.style.left = `${rect.left}px`;
          fallback.style.top = `${rect.top}px`;
          fallback.style.width = `${rect.width}px`;
          fallback.style.height = `${rect.height}px`;
          fallback.classList.add('drag-fallback-shell');
          fallback.innerHTML = '';
          fallback.appendChild(visual);
        }
      },
      onEnd() {
        store.isDraggingComponent = false;
        document.body.classList.remove('is-dragging-component');
        document.body.style.removeProperty('--drag-placeholder-height');
      },
      onAdd(evt) {
        const itemEl = evt.item;
        const currentGrpFields = [...getGroupFields(grpId)];
        const insertIdx = Math.min(evt.newIndex ?? currentGrpFields.length, currentGrpFields.length);
        itemEl.remove();

        if (itemEl.classList.contains('component-item')) {
          const newEl = createElement('radio', grpId);
          currentGrpFields.splice(insertIdx, 0, newEl);
          rebuildRiskFieldsOrder(grpId, currentGrpFields);
          selectElement(newEl);
          markDirty();
          return;
        }

        const movedId = itemEl.getAttribute('data-element-id') || itemEl.getAttribute('data-group-id') || itemEl.id;
        if (movedId) {
          const movedEl = props.page.fields.find(f => f.id === movedId);
          if (movedEl) {
            updatePageFields(props.page.id, props.page.fields.filter(f => f.id !== movedId));
            movedEl.groupId = grpId;
            const targetList = [...getGroupFields(grpId)];
            targetList.splice(insertIdx, 0, movedEl);
            rebuildRiskFieldsOrder(grpId, targetList);
            selectElement(movedEl);
            markDirty();
          }
        }
      },
      onUpdate(evt) {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
          const from = evt.from;
          const item = evt.item;
          const targetSibling = from.children[evt.oldIndex > evt.newIndex ? evt.oldIndex + 1 : evt.oldIndex];
          if (targetSibling) {
            from.insertBefore(item, targetSibling);
          } else {
            from.appendChild(item);
          }

          const list = [...getGroupFields(grpId)];
          const [moved] = list.splice(evt.oldIndex, 1);
          if (moved) {
            list.splice(evt.newIndex, 0, moved);
            rebuildRiskFieldsOrder(grpId, list);
            selectElement(moved);
            markDirty();
          }
        }
      }
    });
    riskGroupSortables.set(grpId, inst);
  }
}

watch(
  () => [isRisk.value, props.page.groups?.map(g => g.id).join(',')],
  () => {
    nextTick(() => {
      syncRiskGroupSortables();
    });
  },
  { immediate: true }
);

const displayPageTitle = computed({
  get() {
    return getPageText(props.page, 'title', frameLocale.value);
  },
  set(val: string) {
    setPageText(props.page, 'title', val, frameLocale.value);
  }
});

const displayPageDesc = computed({
  get() {
    return getPageText(props.page, 'description', frameLocale.value);
  },
  set(val: string) {
    setPageText(props.page, 'description', val, frameLocale.value);
  }
});

const sourcePageTitle = computed(() => getPageText(props.page, 'title', primaryLocale.value));
const sourcePageDesc = computed(() => getPageText(props.page, 'description', primaryLocale.value));

const pageTitlePlaceholder = computed(() => {
  if (props.isTranslationFrame && sourcePageTitle.value) {
    return sourcePageTitle.value;
  }
  return t('prop.pageTitlePlaceholder');
});

const pageDescPlaceholder = computed(() => {
  if (props.isTranslationFrame && sourcePageDesc.value) {
    return sourcePageDesc.value;
  }
  return t('prop.pageDescPlaceholder');
});

const isPageSelected = computed(() => {
  return store.selectedType === 'page' && store.selectedId === props.page.id;
});

const isElementInsideSelected = computed(() => {
  if (store.selectedType !== 'element' || !store.selectedId) return false;
  return props.page.fields.some(f => f.id === store.selectedId);
});

const isFrameElevated = computed(() => {
  return (
    isPageSelected.value ||
    isElementInsideSelected.value ||
    store.activePageId === props.page.id ||
    (store.isDraggingFrame && store.draggedFrameId === props.page.id)
  );
});

interface ElementGroup {
  id: string;
  elements: FormElement[];
}

const elementGroups = computed<ElementGroup[]>(() => {
  return props.page.fields.map(el => ({
    id: el.id,
    elements: [el]
  }));
});

let globalDraggingGroup: {
  sourcePageId: string;
  group: ElementGroup;
  isWholeGroupDrag: boolean;
  liveElements: FormElement[];
  handledDrop: boolean;
} | null = null;

function cleanupTempGroupDom(container: HTMLElement | null | undefined) {
  if (!container) return;
  container.querySelectorAll('[data-temp-ghost-clone]').forEach(el => el.remove());
  container.querySelectorAll('[data-temp-orig-hidden]').forEach(el => {
    (el as HTMLElement).style.display = '';
    el.removeAttribute('data-temp-orig-hidden');
  });
  container.querySelectorAll('[data-temp-companion-hidden]').forEach(el => {
    (el as HTMLElement).style.display = '';
    el.removeAttribute('data-temp-companion-hidden');
  });
}

function restoreSortableDomPosition(evt: Sortable.SortableEvent) {
  if (!evt.from || !evt.item || evt.oldIndex === undefined) return;
  const from = evt.from;
  const item = evt.item;
  const currentIdx = Array.from(from.children).indexOf(item);
  if (currentIdx === -1 || currentIdx === evt.oldIndex) return;
  const targetSibling = from.children[currentIdx > evt.oldIndex ? evt.oldIndex : evt.oldIndex + 1];
  if (targetSibling) {
    from.insertBefore(item, targetSibling);
  } else {
    from.appendChild(item);
  }
}

function applySamePageReorder(evt: Sortable.SortableEvent) {
  if (!evt.from) return;

  if (globalDraggingGroup?.isWholeGroupDrag && globalDraggingGroup.liveElements.length > 1) {
    const connectedEls = globalDraggingGroup.liveElements;
    const connectedIdSet = new Set(connectedEls.map(e => e.id));
    const newFields: FormElement[] = [];

    for (const child of Array.from(evt.from.children)) {
      if (child === evt.item) {
        newFields.push(...connectedEls);
      } else {
        const gid = child.getAttribute('data-group-id');
        if (gid && !connectedIdSet.has(gid)) {
          const f = props.page.fields.find(el => el.id === gid);
          if (f) newFields.push(f);
        }
      }
    }

    restoreSortableDomPosition(evt);
    cleanupTempGroupDom(evt.from);

    if (newFields.length === props.page.fields.length) {
      updatePageFields(props.page.id, newFields);
      selectElement(connectedEls[0]);
      markDirty();
    }
    globalDraggingGroup.handledDrop = true;
    return;
  }

  if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
    restoreSortableDomPosition(evt);
    const list = [...props.page.fields];
    const [moved] = list.splice(evt.oldIndex, 1);
    if (moved) {
      list.splice(evt.newIndex, 0, moved);
      updatePageFields(props.page.id, list);
      selectElement(moved);
      markDirty();
    }
    if (globalDraggingGroup) {
      globalDraggingGroup.handledDrop = true;
    }
  }
}

function createGroupDragSvg(cardsContainer: HTMLElement, elements: FormElement[]): SVGSVGElement | null {
  const cardEls = Array.from(cardsContainer.querySelectorAll(':scope > .canvas-element[data-temp-ghost-clone="true"]')) as HTMLElement[];
  if (cardEls.length <= 1) return null;

  interface NodeMetric {
    id: string;
    kind: 'parent' | 'child';
    left: number;
    endX: number;
    y: number;
    isMulti: boolean;
  }

  const nodes: NodeMetric[] = [];
  for (let idx = 0; idx < elements.length; idx++) {
    const el = elements[idx];
    const cardEl = cardEls[idx];
    if (!cardEl) continue;
    const isChild = Boolean(el.linkage?.conditions?.length);
    const top = cardEl.offsetTop;
    const height = cardEl.offsetHeight;
    const left = cardEl.offsetLeft;

    if (isChild) {
      nodes.push({
        id: el.id,
        kind: 'child',
        left,
        endX: left - 5,
        y: Math.round(top + 25),
        isMulti: (el.linkage?.conditions?.length || 0) > 1
      });
    } else {
      nodes.push({
        id: el.id,
        kind: 'parent',
        left,
        endX: left,
        y: Math.round(top + height / 2),
        isMulti: false
      });
    }
  }

  if (nodes.length < 2) return null;
  nodes.sort((a, b) => a.y - b.y);

  const laneX = -12;
  const cornerR = 4;
  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];
  const topY = firstNode.y;
  const bottomY = lastNode.y;
  const r = Math.min(cornerR, Math.max(0, Math.floor((bottomY - topY) / 2)));

  const trunkPath = `M ${firstNode.endX} ${topY} H ${laneX + r} Q ${laneX} ${topY} ${laneX} ${topY + r} V ${bottomY - r} Q ${laneX} ${bottomY} ${laneX + r} ${bottomY} H ${lastNode.endX}`;

  let branchesHtml = '';
  for (let k = 1; k < nodes.length - 1; k++) {
    const n = nodes[k];
    branchesHtml += `<line x1="${laneX}" y1="${n.y}" x2="${n.endX}" y2="${n.y}" stroke-linecap="round" />`;
  }

  let arrowsHtml = '';
  for (const n of nodes) {
    if (n.kind === 'child') {
      const pts = `${n.left - 1},${n.y} ${n.left - 6},${n.y - 3.5} ${n.left - 6},${n.y + 3.5}`;
      arrowsHtml += `<polygon points="${pts}" />`;
    }
  }

  let dotsHtml = '';
  for (const n of nodes) {
    if (n.kind === 'parent') {
      dotsHtml += `<circle cx="${n.left}" cy="${n.y}" r="3" stroke="#ffffff" stroke-width="1.5" />`;
    } else if (n.isMulti) {
      dotsHtml += `<circle cx="${laneX}" cy="${n.y}" r="3" stroke="#ffffff" stroke-width="1.5" />`;
    }
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'drag-group-svg pointer-events-none absolute inset-0 w-full h-full overflow-visible');
  svg.setAttribute('style', 'z-index: 20;');
  svg.innerHTML = `
    <path d="${trunkPath}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    ${branchesHtml}
    ${arrowsHtml}
    ${dotsHtml}
  `;
  return svg;
}

let sortableInstance: Sortable | null = null;

onMounted(() => {
  if (dropzoneRef.value && !isSystemProfile.value && !props.isTranslationFrame) {
    sortableInstance = new Sortable(dropzoneRef.value, {
      group: 'shared',
      animation: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'drag-chosen',
      fallbackClass: 'drag-fallback',
      forceFallback: true,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      swapThreshold: 0.65,
      emptyInsertThreshold: 28,
      draggable: '.canvas-element-group, .component-item',
      filter: 'input, textarea, select, button, [contenteditable], .action-btn, .alert-canvas-parsed, .alert-content-text',
      preventOnFilter: false,
      onStart(evt) {
        store.isDraggingComponent = true;
        document.body.classList.add('is-dragging-component');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '9999';
        }

        const groupId = evt.item.getAttribute('data-group-id') || evt.item.id;
        const draggedEl = groupId ? props.page.fields.find(f => f.id === groupId) : undefined;

        if (draggedEl) {
          const rawConnected = getConnectedLinkageGroup(props.page.fields, draggedEl);
          const connectedIdSet = new Set(rawConnected.map(e => e.id));
          const connectedEls = props.page.fields.filter(f => connectedIdSet.has(f.id));

          if (connectedEls.length > 1) {
            globalDraggingGroup = {
              sourcePageId: props.page.id,
              group: {
                id: draggedEl.id,
                elements: JSON.parse(JSON.stringify(connectedEls))
              },
              isWholeGroupDrag: true,
              liveElements: connectedEls,
              handledDrop: false
            };

            if (evt.from) {
              const groupDomNodes = connectedEls
                .map(el => evt.from.querySelector(`[data-group-id="${el.id}"]`) as HTMLElement | null)
                .filter((n): n is HTMLElement => Boolean(n));

              const origCard = evt.item.querySelector(':scope > .canvas-element') as HTMLElement | null;
              if (origCard) {
                origCard.style.display = 'none';
                origCard.setAttribute('data-temp-orig-hidden', 'true');
              }

              for (const domNode of groupDomNodes) {
                const cardEl = domNode.querySelector(':scope > .canvas-element') as HTMLElement | null;
                if (cardEl) {
                  const cardClone = cardEl.cloneNode(true) as HTMLElement;
                  cardClone.style.display = '';
                  cardClone.setAttribute('data-temp-ghost-clone', 'true');
                  evt.item.appendChild(cardClone);
                }
                if (domNode !== evt.item) {
                  domNode.style.display = 'none';
                  domNode.setAttribute('data-temp-companion-hidden', 'true');
                }
              }

              const dragSvg = createGroupDragSvg(evt.item, connectedEls);
              if (dragSvg) {
                dragSvg.setAttribute('data-temp-ghost-clone', 'true');
                evt.item.appendChild(dragSvg);
              }
            }
          } else {
            globalDraggingGroup = {
              sourcePageId: props.page.id,
              group: {
                id: draggedEl.id,
                elements: [JSON.parse(JSON.stringify(draggedEl))]
              },
              isWholeGroupDrag: false,
              liveElements: [draggedEl],
              handledDrop: false
            };
          }
        }

        const fallback = document.querySelector('body > .drag-fallback') as HTMLElement;
        if (fallback && evt.item) {
          const rect = evt.item.getBoundingClientRect();
          const scale = store.canvasState.scale || 1;
          const visual = evt.item.cloneNode(true) as HTMLElement;
          visual.classList.remove('sortable-ghost', 'drag-chosen');
          visual.classList.add('drag-fallback-visual');
          visual.style.position = 'relative';
          visual.style.left = '0';
          visual.style.top = '0';
          visual.style.width = `${evt.item.offsetWidth}px`;
          visual.style.height = `${evt.item.offsetHeight}px`;
          visual.style.transform = `scale(${scale})`;
          visual.style.transformOrigin = '0 0';
          visual.style.boxSizing = 'border-box';
          visual.style.pointerEvents = 'none';

          visual.querySelectorAll('.element-actions').forEach(btn => btn.remove());

          fallback.style.left = `${rect.left}px`;
          fallback.style.top = `${rect.top}px`;
          fallback.style.width = `${rect.width}px`;
          fallback.style.height = `${rect.height}px`;
          fallback.classList.add('drag-fallback-shell');
          fallback.innerHTML = '';
          fallback.appendChild(visual);
        }
      },
      onEnd(evt) {
        if (globalDraggingGroup?.isWholeGroupDrag && !globalDraggingGroup.handledDrop && evt.from === evt.to) {
          applySamePageReorder(evt);
        } else {
          cleanupTempGroupDom(evt.from);
          cleanupTempGroupDom(dropzoneRef.value);
        }
        store.isDraggingComponent = false;
        document.body.classList.remove('is-dragging-component');
        document.body.style.removeProperty('--drag-placeholder-height');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '';
        }
        globalDraggingGroup = null;
        nextTick(() => {
          syncLinkageObservers();
        });
      },
      onAdd(evt) {
        const itemEl = evt.item;
        const insertIdx = props.page.fields.length === 0 ? 0 : Math.min(evt.newIndex ?? props.page.fields.length, props.page.fields.length);

        cleanupTempGroupDom(evt.from);
        itemEl.remove();

        if (itemEl.classList.contains('component-item')) {
          const type = itemEl.getAttribute('data-type') as ComponentType;
          if (type) {
            const newEl = createElement(type);
            const list = [...props.page.fields];
            list.splice(insertIdx, 0, newEl);
            updatePageFields(props.page.id, list);
            selectElement(newEl);
            markDirty();
          }
          return;
        }

        if (globalDraggingGroup) {
          const { sourcePageId, group } = globalDraggingGroup;
          globalDraggingGroup.handledDrop = true;
          const sourcePage = store.pages.find(p => p.id === sourcePageId);
          if (sourcePage) {
            const idsToRemove = new Set(group.elements.map(e => e.id));
            updatePageFields(sourcePage.id, sourcePage.fields.filter(f => !idsToRemove.has(f.id)));
          }

          const list = [...props.page.fields];
          list.splice(insertIdx, 0, ...group.elements);
          updatePageFields(props.page.id, list);

          selectElement(group.elements[0]);
          markDirty();
          globalDraggingGroup = null;
          return;
        }
      },
      onUpdate(evt) {
        applySamePageReorder(evt);
        globalDraggingGroup = null;
      }
    });
  }
  if (dropzoneRef.value && !isSystemProfile.value && !isRisk.value) {
    linkageResizeObserver = new ResizeObserver(() => {
      refreshLinkageLayout();
    });
    linkageMutationObserver = new MutationObserver(() => {
      syncLinkageObservers();
    });
    linkageMutationObserver.observe(dropzoneRef.value, { childList: true });
    syncLinkageObservers();
  }
  syncRiskGroupSortables();
});

watch(
  () => [
    props.page.fields.length,
    store.currentLocale,
    props.page.fields
      .map(f => `${f.id}:${f.linkage?.logic || ''}:${(f.linkage?.conditions || []).map(c => `${c.fieldKey}=${c.value}`).join(',')}`)
      .join('|')
  ],
  () => {
    nextTick(() => {
      syncLinkageObservers();
    });
  }
);

onBeforeUnmount(() => {
  if (linkageResizeObserver) {
    linkageResizeObserver.disconnect();
    linkageResizeObserver = null;
  }
  if (linkageMutationObserver) {
    linkageMutationObserver.disconnect();
    linkageMutationObserver = null;
  }
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  if (riskGroupsSortable) {
    riskGroupsSortable.destroy();
    riskGroupsSortable = null;
  }
  for (const inst of riskGroupSortables.values()) {
    inst.destroy();
  }
  riskGroupSortables.clear();
});

function handleFrameMouseDown(e: MouseEvent) {
  if (props.inTranslationWorkspace) {
    if (!props.isReadOnlyReference) {
      store.editingLocale = frameLocale.value;
    }
    return;
  }
  store.activePageId = props.page.id;
  store.editingLocale = frameLocale.value;

  if (e.button === 0 && !store.isSpacePressed) {
    const isClickingElement = (e.target as HTMLElement).closest(
      '.canvas-element, .risk-group-section, .canvas-resize-handle, .icon-btn, .add-next-page-btn, .frame-lang-toolbar'
    );
    if (!isClickingElement) {
      selectPage(props.page.id);
    }
  }

  const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
  const isEditingThisText = Boolean(
    activeEl &&
    (e.target as HTMLElement).closest('[contenteditable]') === activeEl
  );

  if (
    isEditingThisText ||
    (e.target as HTMLElement).closest(
      'input, textarea, select, button, .canvas-element, .risk-group-section, .canvas-resize-handle, .icon-btn, .add-next-page-btn'
    )
  ) {
    return;
  }
  if (e.button === 0 && !store.isSpacePressed) {
    store.isDraggingFrame = true;
    store.draggedFrameId = props.page.id;
  }
}
</script>
