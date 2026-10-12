<template>
  <CountrySelectBase
    :element="element"
    fallback-placeholder-zh="请选择国家/地区"
    fallback-placeholder-en="Select Country/Region"
  />
</template>

<script setup lang="ts">
import type { FormElement } from '@/types/schema';
import CountrySelectBase from './CountrySelectBase.vue';

defineProps<{ element: FormElement }>();
</script>
