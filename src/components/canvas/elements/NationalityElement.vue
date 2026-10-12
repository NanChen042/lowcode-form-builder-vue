<template>
  <CountrySelectBase
    :element="element"
    fallback-placeholder-zh="请选择国籍"
    fallback-placeholder-en="Select Nationality"
  />
</template>

<script setup lang="ts">
import type { FormElement } from '@/types/schema';
import CountrySelectBase from './CountrySelectBase.vue';

defineProps<{ element: FormElement }>();
</script>
