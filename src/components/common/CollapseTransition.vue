<template>
  <div
    v-show="isVisible"
    ref="wrapperRef"
    :hidden="!isVisible"
    class="collapse-transition-wrapper"
    :class="{ 'is-expanded': isExpanded }"
    :style="{ '--collapse-duration': `${duration}ms` }"
    @transitionend="handleTransitionEnd"
  >
    <div class="collapse-transition-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    duration?: number;
  }>(),
  {
    show: true,
    duration: 220
  }
);

const isVisible = ref(Boolean(props.show));
const isExpanded = ref(Boolean(props.show));
const wrapperRef = ref<HTMLElement | null>(null);

let closeTimer: ReturnType<typeof setTimeout> | null = null;
let openRaf1: number | null = null;
let openRaf2: number | null = null;

function clearTimers() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  if (openRaf1 !== null) {
    cancelAnimationFrame(openRaf1);
    openRaf1 = null;
  }
  if (openRaf2 !== null) {
    cancelAnimationFrame(openRaf2);
    openRaf2 = null;
  }
}

watch(
  () => props.show,
  (newVal) => {
    clearTimers();
    if (newVal) {
      isVisible.value = true;

      openRaf1 = requestAnimationFrame(() => {
        openRaf2 = requestAnimationFrame(() => {
          isExpanded.value = true;
          openRaf1 = null;
          openRaf2 = null;
        });
      });
    } else {
      isExpanded.value = false;

      closeTimer = setTimeout(() => {
        if (!props.show) {
          isVisible.value = false;
        }
        closeTimer = null;
      }, (props.duration || 220) + 60);
    }
  }
);

function handleTransitionEnd(event: TransitionEvent) {
  if (event.target !== wrapperRef.value || event.propertyName !== 'grid-template-rows') {
    return;
  }
  if (!props.show) {
    clearTimers();
    isVisible.value = false;
  }
}

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.collapse-transition-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows var(--collapse-duration, 220ms) cubic-bezier(0.16, 1, 0.3, 1),
    opacity calc(var(--collapse-duration, 220ms) * 0.8) cubic-bezier(0.16, 1, 0.3, 1);
  will-change: grid-template-rows, opacity;
}

.collapse-transition-wrapper.is-expanded {
  grid-template-rows: 1fr;
  opacity: 1;
}

.collapse-transition-wrapper:not(.is-expanded) {
  pointer-events: none;
}

.collapse-transition-content {
  min-height: 0;
  overflow: hidden;
}
</style>
