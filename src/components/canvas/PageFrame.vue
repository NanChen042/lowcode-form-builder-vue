<template>
  <div
    :id="pageIndex === 0 ? 'tour-first-page-frame' : ('frame_' + page.id)"
    :data-page-id="page.id"
    :data-page-index="pageIndex"
    :data-page-type="page.pageType"
    class="mobile-frame absolute min-h-[720px] w-[390px] bg-white rounded-2xl shadow-sm flex flex-col"
    :class="[
      isPageSelected ? 'is-selected ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'ring-1 ring-slate-200/90 hover:ring-slate-300 hover:shadow-md',
      isFrameElevated ? '!z-20 is-active-frame' : 'z-10',
      store.isDraggingComponent && !isSystemProfile ? 'ring-2 !ring-blue-500 ring-offset-2 !shadow-lg !border-blue-400' : '',
      store.isDraggingComponent && isSystemProfile ? 'opacity-85' : '',
      store.isDraggingFrame && store.draggedFrameId === page.id ? '!transition-none is-dragging-frame' : 'transition-shadow transition-colors duration-200'
    ]"
    :style="{
      transform: `translate(${page.x}px, ${page.y}px)`
    }"
    @mousedown="handleFrameMouseDown"
    @click.stop="selectPage(page.id)"
  >
    <div class="absolute -top-7 left-0 flex items-center gap-1.5 text-[12px] font-medium tracking-wider text-black/40 cursor-grab active:cursor-grabbing hover:text-black/70 transition-colors select-none">
      <Smartphone class="h-3.5 w-3.5" />
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
        <span class="font-mono font-bold text-slate-700 text-[13px] tracking-normal">{{ pageIndexString }}</span>
        <span class="text-slate-400 font-normal">·</span>
        <span
          class="font-medium max-w-[200px] truncate"
          :class="displayPageTitle ? 'text-slate-700' : 'text-slate-400 font-normal'"
        >
          {{ displayPageTitle || t('common.untitledPage') }}
        </span>
      </template>
    </div>

    <div
      v-if="store.isDraggingComponent && !isSystemProfile"
      class="absolute -top-7 right-0 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs select-none pointer-events-none animate-pulse"
    >
      <ArrowDownToLine class="h-3 w-3 text-blue-500" />
      <span>{{ t('canvas.droppable') }}</span>
    </div>

    <div class="flex-1 flex flex-col w-full rounded-2xl relative">
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

      <div class="page-header-area px-5 pt-6 pb-4 shrink-0 bg-white rounded-t-2xl" @click.stop="selectPage(page.id)">
        <template v-if="isSystemProfile">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold tracking-tight text-slate-800 m-0 leading-7">
              {{ getPageText(page, 'title') || t('common.basicInfo') }}
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
            :placeholder="t('prop.pageTitlePlaceholder')"
            :element-id="page.id"
            field="title"
            tag="h2"
            custom-class="page-title-text text-xl font-semibold tracking-tight leading-7 text-slate-800 w-full block border-b-2 border-transparent pb-1"
          />
          <EditableText
            v-model="displayPageDesc"
            :placeholder="t('prop.pageDescPlaceholder')"
            :element-id="page.id"
            field="description"
            tag="p"
            :allow-empty="true"
            multiline
            custom-class="page-desc-text mt-1.5 w-full text-[15px] leading-6 text-slate-500 block border-b-2 border-transparent pb-1"
          />
        </template>
      </div>

      <div v-if="isSystemProfile" class="flex-1 bg-white p-3 rounded-b-2xl" @click="selectPage(page.id)">
        <SystemProfileView
          :profile-type="page.profileType || store.meta.profileType || 'customer'"
          :show-skeleton="page.showSkeleton !== false"
          :is-canvas="true"
        />
      </div>

      <div v-else class="canvas-pages-container relative flex-1 bg-white flex flex-col rounded-b-2xl">
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

        <div
          ref="dropzoneRef"
          class="canvas-dropzone relative z-10 flex-1 min-h-[520px] p-3 transition-colors duration-200"
          :class="{
            'has-elements': page.fields.length > 0,
            'bg-blue-50/15': store.isDraggingComponent
          }"
          :data-page-id="page.id"
          @click.self="selectPage(page.id)"
        >
          <div
            v-for="group in elementGroups"
            :key="group.id"
            :data-group-id="group.id"
            class="canvas-element-group relative"
            :class="{ 'is-multi-branch-group': group.elements.length > 1 }"
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

    <a-tooltip :content="t('canvas.addPageRight')" position="top">
      <div class="add-next-page-btn absolute -right-3 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#1677ff] shadow-md border border-slate-200/90 transition hover:scale-110 hover:border-[#1677ff]" @click.stop="addPage(page.id)">
        <Plus class="h-4 w-4" />
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { FormPage, FormElement, ComponentType } from '@/types/schema';
import { store, selectPage, addPage, createElement, selectElement, markDirty } from '@/core/store';
import { t, getPageText, setPageText } from '@/core/i18n';
import Sortable from 'sortablejs';
import CanvasElement from './CanvasElement.vue';
import EditableText from '@/components/common/EditableText.vue';
import SystemProfileView from '@/components/common/SystemProfileView.vue';
import { Smartphone, ArrowDownToLine, Plus, Lock } from '@lucide/vue';

const props = defineProps<{
  page: FormPage;
  pageIndex: number;
}>();

const isSystemProfile = computed(() => props.page.pageType === 'system_profile');

const pageIndexString = computed(() => {
  return String(props.pageIndex + 1).padStart(2, '0');
});

const dropzoneRef = ref<HTMLElement | null>(null);

const displayPageTitle = computed({
  get() {
    return getPageText(props.page, 'title');
  },
  set(val: string) {
    setPageText(props.page, 'title', val);
  }
});

const displayPageDesc = computed({
  get() {
    return getPageText(props.page, 'description');
  },
  set(val: string) {
    setPageText(props.page, 'description', val);
  }
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
  const result: ElementGroup[] = [];
  const fields = props.page.fields;
  let currentGroup: ElementGroup | null = null;

  for (let i = 0; i < fields.length; i++) {
    const el = fields[i];
    if (currentGroup && el.dependsOn && currentGroup.elements.some(m => m.key === el.dependsOn?.fieldKey)) {
      currentGroup.elements.push(el);
    } else {
      currentGroup = {
        id: el.id,
        elements: [el]
      };
      result.push(currentGroup);
    }
  }

  return result;
});

let globalDraggingGroup: {
  sourcePageId: string;
  group: ElementGroup;
} | null = null;

let sortableInstance: Sortable | null = null;

onMounted(() => {
  if (dropzoneRef.value && !isSystemProfile.value) {
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
      filter: '.is-branch-child, input, textarea, select, button, [contenteditable], .action-btn, .alert-canvas-parsed, .alert-content-text',
      preventOnFilter: false,
      onStart(evt) {
        store.isDraggingComponent = true;
        document.body.classList.add('is-dragging-component');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '9999';
        }

        const groupId = evt.item.getAttribute('data-group-id') || evt.item.id;
        if (groupId) {
          const group = elementGroups.value.find(g => g.id === groupId);
          if (group) {
            globalDraggingGroup = {
              sourcePageId: props.page.id,
              group: JSON.parse(JSON.stringify(group))
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
        store.isDraggingComponent = false;
        document.body.classList.remove('is-dragging-component');
        document.body.style.removeProperty('--drag-placeholder-height');
        const frame = evt.from?.closest('.mobile-frame') as HTMLElement;
        if (frame) {
          frame.style.zIndex = '';
        }
        globalDraggingGroup = null;
      },
      onAdd(evt) {
        const itemEl = evt.item;
        const insertIdx = props.page.fields.length === 0 ? 0 : Math.min(evt.newIndex ?? elementGroups.value.length, elementGroups.value.length);

        itemEl.remove();

        if (itemEl.classList.contains('component-item')) {
          const type = itemEl.getAttribute('data-type') as ComponentType;
          if (type) {
            const newEl = createElement(type);
            const groups = [...elementGroups.value];
            groups.splice(insertIdx, 0, { id: newEl.id, elements: [newEl] });
            props.page.fields = groups.flatMap(g => g.elements);
            selectElement(newEl);
            markDirty();
          }
          return;
        }

        if (globalDraggingGroup) {
          const { sourcePageId, group } = globalDraggingGroup;
          const sourcePage = store.pages.find(p => p.id === sourcePageId);
          if (sourcePage) {
            const idsToRemove = new Set(group.elements.map(e => e.id));
            sourcePage.fields = sourcePage.fields.filter(f => !idsToRemove.has(f.id));
          }

          const groups = [...elementGroups.value];
          groups.splice(insertIdx, 0, group);
          props.page.fields = groups.flatMap(g => g.elements);

          selectElement(group.elements[0]);
          markDirty();
          globalDraggingGroup = null;
          return;
        }

        const fallbackGroupId = itemEl.getAttribute('data-group-id') || itemEl.id;
        if (fallbackGroupId) {
          for (const p of store.pages) {
            const idx = p.fields.findIndex(f => f.id === fallbackGroupId);
            if (idx !== -1) {
              const el = p.fields[idx];
              const descendantKeys = new Set<string>([el.key]);
              const children: FormElement[] = [];
              let i = idx + 1;
              while (i < p.fields.length) {
                const next = p.fields[i];
                if (next?.dependsOn?.fieldKey && descendantKeys.has(next.dependsOn.fieldKey)) {
                  if (next.key) descendantKeys.add(next.key);
                  children.push(next);
                  i++;
                } else {
                  break;
                }
              }
              const movedElements = p.fields.splice(idx, 1 + children.length);

              const groups = [...elementGroups.value];
              groups.splice(insertIdx, 0, { id: el.id, elements: movedElements });
              props.page.fields = groups.flatMap(g => g.elements);
              selectElement(el);
              markDirty();
              return;
            }
          }
        }
      },
      onUpdate(evt) {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
          const groups = [...elementGroups.value];
          const [movedGroup] = groups.splice(evt.oldIndex, 1);
          groups.splice(evt.newIndex, 0, movedGroup);

          props.page.fields = groups.flatMap(g => g.elements);
          selectElement(movedGroup.elements[0]);
          markDirty();
        }
        globalDraggingGroup = null;
      }
    });
  }
});

onBeforeUnmount(() => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
});

function handleFrameMouseDown(e: MouseEvent) {
  store.activePageId = props.page.id;

  if (e.button === 0 && !store.isSpacePressed) {
    const isClickingElement = (e.target as HTMLElement).closest(
      '.canvas-element, .icon-btn, .add-next-page-btn'
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
      'input, textarea, select, button, .canvas-element, .icon-btn, .add-next-page-btn'
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
