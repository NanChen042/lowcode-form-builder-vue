<template>
  <transition
    name="smooth-collapse"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="isExpanded"
      class="smooth-collapse-outer"
      style="overflow: hidden; will-change: height, opacity;"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    duration?: number;
  }>(),
  {
    show: true,
    duration: 280
  }
);

const isExpanded = computed(() => props.show);

function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '0px';
  htmlEl.style.opacity = '0';
  htmlEl.style.overflow = 'hidden';
}

function onEnter(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement;
  const targetHeight = htmlEl.scrollHeight;
  const duration = props.duration;

  // 苹果与 Radix UI 黄金减速弹簧曲线 (自然、柔顺、绝不机械僵硬)
  htmlEl.style.transition = `height ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(duration * 0.85)}ms cubic-bezier(0.16, 1, 0.3, 1)`;

  // 触发重排
  void htmlEl.offsetHeight;

  htmlEl.style.height = `${targetHeight}px`;
  htmlEl.style.opacity = '1';

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    htmlEl.removeEventListener('transitionend', onEnd);
    done();
  };

  const onEnd = (e: TransitionEvent) => {
    if (e.target === htmlEl && e.propertyName === 'height') {
      finish();
    }
  };

  htmlEl.addEventListener('transitionend', onEnd);
  setTimeout(finish, duration + 60);
}

function onAfterEnter(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.opacity = '';
  htmlEl.style.overflow = '';
  htmlEl.style.transition = '';
}

function onBeforeLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = `${htmlEl.offsetHeight}px`;
  htmlEl.style.overflow = 'hidden';
}

function onLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement;
  const duration = Math.max(180, Math.round(props.duration * 0.8));

  htmlEl.style.transition = `height ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(duration * 0.75)}ms ease-in`;

  // 触发重排
  void htmlEl.offsetHeight;

  htmlEl.style.height = '0px';
  htmlEl.style.opacity = '0';

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    htmlEl.removeEventListener('transitionend', onEnd);
    done();
  };

  const onEnd = (e: TransitionEvent) => {
    if (e.target === htmlEl && e.propertyName === 'height') {
      finish();
    }
  };

  htmlEl.addEventListener('transitionend', onEnd);
  setTimeout(finish, duration + 60);
}

function onAfterLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
  htmlEl.style.opacity = '';
  htmlEl.style.overflow = '';
  htmlEl.style.transition = '';
}
</script>
