<template>
  <svg id="canvas-connections" class="absolute inset-0 pointer-events-none" style="overflow: visible; z-index: 0">
    <defs>
      <marker id="arrowhead" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 3 3 L 9 6 L 3 9" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </marker>
      <marker id="arrowhead-blue" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 3 3 L 9 6 L 3 9" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </marker>
    </defs>

    <path
      v-for="(conn, idx) in connections"
      :key="idx"
      :d="conn.pathD"
      class="connection-path"
      :class="{ 'is-system-flow': conn.isSystemFlow }"
      :marker-end="conn.isSystemFlow ? 'url(#arrowhead-blue)' : 'url(#arrowhead)'"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { store } from '@/core/store';
import { getSmartEdges, getEdgePoint, getControlPoint, type Rect } from '@/utils/helpers';

const PAGE_WIDTH = 390;
const PAGE_HEIGHT = 720;

const connections = computed(() => {
  const result: { pathD: string; isSystemFlow: boolean }[] = [];
  if (!store.pages || store.pages.length <= 1) return result;

  for (let i = 0; i < store.pages.length - 1; i++) {
    const pageA = store.pages[i];
    const pageB = store.pages[i + 1];

    const rectA: Rect = { x: pageA.x, y: pageA.y, w: PAGE_WIDTH, h: PAGE_HEIGHT };
    const rectB: Rect = { x: pageB.x, y: pageB.y, w: PAGE_WIDTH, h: PAGE_HEIGHT };

    const { sourceEdge, targetEdge } = getSmartEdges(rectA, rectB);
    const p1 = getEdgePoint(rectA, sourceEdge);
    const p2 = getEdgePoint(rectB, targetEdge);

    const dist = Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y));
    const controlOffset = Math.min(Math.max(dist / 2, 60), 150);

    const cp1 = getControlPoint(p1.x, p1.y, sourceEdge, controlOffset);
    const cp2 = getControlPoint(p2.x, p2.y, targetEdge, controlOffset);

    const isSystemFlow = pageA.pageType === 'system_profile';

    result.push({
      pathD: `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`,
      isSystemFlow
    });
  }

  return result;
});
</script>

<style scoped>
.is-system-flow {
  stroke: #3b82f6 !important;
  stroke-dasharray: 6 4 !important;
  marker-end: url(#arrowhead-blue) !important;
}
.is-system-flow:hover {
  stroke: #1677ff !important;
}
</style>
