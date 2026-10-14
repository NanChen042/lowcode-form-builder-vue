<template>
  <CountrySelectBase :element="element" />
</template>

<script setup lang="ts">
import type { FormElement } from '@/types/schema';
import CountrySelectBase from './CountrySelectBase.vue';

defineProps<{ element: FormElement }>();
</script>
