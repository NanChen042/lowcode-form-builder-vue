<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store, isRisk } from '@/core/store';
import { t } from '@/core/i18n';

const route = useRoute();

function updateDocTitle() {
  if (typeof document === 'undefined') return;
  const path = route.path ? route.path.toLowerCase() : '';
  const isRiskMode = isRisk.value || path.includes('/risk') || route.query.mode === 'risk';
  document.title = isRiskMode ? t('app.riskWorkspaceTitle') : t('app.formWorkspaceTitle');
}

watch(
  () => [route.path, route.query.mode, isRisk.value, store.currentLocale],
  () => {
    updateDocTitle();
  },
  { immediate: true }
);

function updateBrandIcon() {
  if (typeof document === 'undefined' || !store.org.brandIcon) return;
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = store.org.brandIcon;
}

watch(
  () => store.org.brandIcon,
  () => {
    updateBrandIcon();
  },
  { immediate: true }
);

onMounted(() => {
  updateDocTitle();
  updateBrandIcon();
});
</script>
