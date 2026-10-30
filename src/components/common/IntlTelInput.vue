<template>
  <div
    class="intl-tel-wrapper w-full text-left"
    :class="{ 'is-disabled': disabled, 'has-error': hasError || error }"
  >
    <input
      ref="inputRef"
      type="tel"
      class="iti-phone-input"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="customPlaceholder || ''"
      @input="handleInput"
      @blur="handleBlur"
    />

    <transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="effectiveErrorMessage"
        class="mt-1 pl-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
      >
        <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ effectiveErrorMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { store } from '@/core/store';
import { t } from '@/core/i18n';
import type { IntlTelInputInstance, IntlTelInputOptions } from '@/types/intlTelInput';
import {
  getCountryPhoneRule,
  getCountryPhoneOrder,
  getCountryI18nMap
} from '@/registry/phoneRules';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    dialCode?: string;
    countryCode?: string;
    customPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    strict?: boolean;
    error?: boolean;
    errorMessage?: string;
    customErrorMessage?: string;
  }>(),
  {
    modelValue: '',
    dialCode: '+65',
    countryCode: '',
    customPlaceholder: '',
    disabled: false,
    readonly: false,
    required: false,
    strict: true,
    error: false,
    errorMessage: '',
    customErrorMessage: ''
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'update:dialCode', val: string): void;
  (e: 'update:countryCode', val: string): void;
  (e: 'change', data: {
    valid: boolean;
    areacode: string;
    mobile: string;
    fullNumber: string;
    countryCode: string;
    message: string;
  }): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
let iti: IntlTelInputInstance | null = null;
const isDirty = ref(false);
let isInternalCountryChange = false;

const validationState = ref({
  valid: true,
  message: '',
  message_en: ''
});

const hasError = computed(() => {
  if (props.error) return true;
  if (!isDirty.value) return false;
  return !validationState.value.valid;
});

const effectiveErrorMessage = computed(() => {
  if (props.errorMessage) return props.errorMessage;
  if (!isDirty.value || validationState.value.valid) return '';
  if (props.customErrorMessage) return props.customErrorMessage;
  return store.currentLocale === 'en'
    ? validationState.value.message_en
    : validationState.value.message;
});

onMounted(() => {
  initIntlTel();
});

onUnmounted(() => {
  if (iti) {
    iti.destroy();
    iti = null;
  }
});

function initIntlTel() {
  if (!inputRef.value) return;
  if (typeof window === 'undefined' || !window.intlTelInput) {
    console.warn('intlTelInput library not found on window');
    return;
  }

  const defaultIso = props.countryCode?.toLowerCase() || parseIsoFromDialCode(props.dialCode) || 'sg';

  const options: IntlTelInputOptions = {
    initialCountry: defaultIso,
    countryOrder: getCountryPhoneOrder(),
    autoPlaceholder: 'aggressive',
    separateDialCode: true,
    validationNumberType: 'MOBILE',
    nationalMode: true,
    autoInsertDialCode: false,
    countrySearch: true,
    i18n: getCountryI18nMap(store.currentLocale)
  };

  iti = window.intlTelInput(inputRef.value, options);

  if (props.modelValue) {
    const full = props.modelValue.startsWith('+')
      ? props.modelValue
      : `+${props.dialCode?.replace(/\D/g, '') || '65'}${props.modelValue}`;
    iti.setNumber(full);
  }

  updateInputPlaceholder();

  inputRef.value.addEventListener('countrychange', handleCountryChange);

  validateAndEmit();
}

function parseIsoFromDialCode(code?: string): string {
  if (!code) return 'sg';
  const rule = getCountryPhoneRule(code);
  return rule ? rule.iso2 : 'sg';
}

function updateInputPlaceholder() {
  if (!inputRef.value) return;
  if (props.customPlaceholder) {
    inputRef.value.placeholder = props.customPlaceholder;
  }
}

function handleCountryChange() {
  if (!iti) return;
  const countryData = iti.getSelectedCountryData();
  const newDialCode = '+' + countryData.dialCode;
  const newCountryCode = countryData.iso2 || '';

  isInternalCountryChange = true;
  emit('update:dialCode', newDialCode);
  emit('update:countryCode', newCountryCode);
  updateInputPlaceholder();
  validateAndEmit();

  setTimeout(() => {
    isInternalCountryChange = false;
  }, 100);
}

function handleInput() {
  if (!inputRef.value || !iti) return;

  const currentCountry = iti.getSelectedCountryData();
  if (currentCountry.iso2 === 'tw' && inputRef.value.value.startsWith('0')) {
    inputRef.value.value = inputRef.value.value.replace(/^0+/, '');
  }

  isDirty.value = true;
  validateAndEmit();
}

function handleBlur() {
  if (inputRef.value && inputRef.value.value.trim().length > 0) {
    isDirty.value = true;
    validateAndEmit();
  }
}

function validateAndEmit() {
  if (!iti || !inputRef.value) return;

  const raw = inputRef.value.value.trim();
  const countryData = iti.getSelectedCountryData();
  const nationalNumber = iti.getNumber();
  const pureMobile = (iti.getNumber('national') || raw).replace(/\D/g, '');

  let valid = true;
  let message = '';
  let message_en = '';

  if (!raw) {
    if (props.required) {
      valid = false;
      message = props.customErrorMessage || t('val.requiredFallback', 'zh');
      message_en = props.customErrorMessage || t('val.requiredFallback', 'en');
    }
  } else if (props.strict) {
    valid = iti.isValidNumber();
    if (!valid) {
      message = props.customErrorMessage || t('val.validPhoneFallback', 'zh');
      message_en = props.customErrorMessage || t('val.validPhoneFallback', 'en');
    }
  }

  validationState.value = { valid, message, message_en };

  emit('update:modelValue', pureMobile);
  emit('change', {
    valid,
    areacode: countryData.dialCode || '',
    mobile: pureMobile,
    fullNumber: nationalNumber,
    countryCode: countryData.iso2 || '',
    message
  });
}

watch(
  () => [props.countryCode, props.dialCode],
  ([newIso, newCode]) => {
    if (!iti || isInternalCountryChange) return;
    const current = iti.getSelectedCountryData();
    if (newIso && newIso.toLowerCase() !== current.iso2?.toLowerCase()) {
      iti.setCountry(newIso.toLowerCase());
      updateInputPlaceholder();
    } else if (newCode) {
      const cleanNew = newCode.replace(/\D/g, '');
      const cleanCur = (current.dialCode || '').replace(/\D/g, '');
      if (cleanNew && cleanNew !== cleanCur) {
        const iso = parseIsoFromDialCode(newCode);
        if (iso && iso.toLowerCase() !== current.iso2?.toLowerCase()) {
          iti.setCountry(iso);
          updateInputPlaceholder();
        }
      }
    }
  }
);

watch(
  () => store.currentLocale,
  () => {
    if (iti && inputRef.value) {
      const currentVal = inputRef.value.value;
      const currentCountry = iti.getSelectedCountryData();
      iti.destroy();
      iti = null;
      initIntlTel();
      const currentIti = iti as IntlTelInputInstance | null;
      if (currentCountry?.iso2 && currentIti) {
        currentIti.setCountry(currentCountry.iso2);
      }
      if (currentVal && inputRef.value) {
        inputRef.value.value = currentVal;
      }
    }
  }
);

onUnmounted(() => {
  if (inputRef.value) {
    inputRef.value.removeEventListener('countrychange', handleCountryChange);
  }
  if (iti) {
    iti.destroy();
    iti = null;
  }
});
</script>

<style>
.intl-tel-wrapper .iti {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  position: relative !important;
}

.intl-tel-wrapper .iti__country-container {
  position: relative !important;
  top: auto !important;
  bottom: auto !important;
  left: auto !important;
  right: auto !important;
  padding: 0 !important;
  flex-shrink: 0 !important;
  height: 32px !important;
}

.intl-tel-wrapper .iti__selected-country {
  height: 32px !important;
  min-width: 92px !important;
  padding: 0 10px !important;
  background-color: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
  box-sizing: border-box !important;
  position: relative !important;
}

.intl-tel-wrapper .iti__selected-country:hover {
  border-color: #1677ff !important;
  background-color: #fafafa !important;
}

.intl-tel-wrapper .iti--dropdown-open .iti__selected-country,
.intl-tel-wrapper .iti__selected-country:focus-visible,
.intl-tel-wrapper .iti__selected-country[aria-expanded="true"] {
  border-color: #1677ff !important;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15) !important;
  outline: none !important;
}

.intl-tel-wrapper .iti__selected-country-primary {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  padding: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  order: 1 !important;
  margin: 0 !important;
}

.intl-tel-wrapper .iti--allow-dropdown .iti__selected-country-primary:hover,
.intl-tel-wrapper .iti__selected-country-primary:hover {
  background: transparent !important;
  background-color: transparent !important;
}

.intl-tel-wrapper .iti__selected-country-primary .iti__arrow {
  display: none !important;
}

.intl-tel-wrapper .iti__selected-country-primary .iti__flag {
  margin-right: 0 !important;
  flex-shrink: 0 !important;
}

.intl-tel-wrapper .iti__selected-dial-code {
  order: 2 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #1e293b !important;
  margin-left: 6px !important;
  white-space: nowrap !important;
}

.intl-tel-wrapper .iti__selected-country::after {
  content: "" !important;
  order: 3 !important;
  margin-left: auto !important;
  border-left: 3.5px solid transparent !important;
  border-right: 3.5px solid transparent !important;
  border-top: 4px solid #64748b !important;
  width: 0 !important;
  height: 0 !important;
  flex-shrink: 0 !important;
  transition: transform 0.2s ease !important;
}

.intl-tel-wrapper .iti--dropdown-open .iti__selected-country::after,
.intl-tel-wrapper .iti__selected-country[aria-expanded="true"]::after {
  transform: rotate(180deg) !important;
}

.intl-tel-wrapper .iti__dropdown-content {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  margin-top: 6px !important;
  width: 100% !important;
  min-width: 300px !important;
  max-width: 335px !important;
  background: #ffffff !important;
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08) !important;
  overflow: hidden !important;
  z-index: 1050 !important;
}

.intl-tel-wrapper .iti__search-input {
  border: 1px solid #e2e8f0 !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 10px !important;
  margin: 8px !important;
  width: calc(100% - 16px) !important;
  outline: none !important;
  box-sizing: border-box !important;
  color: #1e293b !important;
}

.intl-tel-wrapper .iti__search-input::placeholder {
  color: #94a3b8 !important;
}

.intl-tel-wrapper .iti__search-input:focus {
  border-color: #1677ff !important;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15) !important;
}

.intl-tel-wrapper .iti__country-list {
  max-height: 230px !important;
  overflow-y: auto !important;
  list-style: none !important;
  padding: 2px 4px 6px 4px !important;
  margin: 0 !important;
}

.intl-tel-wrapper .iti__country {
  padding: 0 12px !important;
  height: 36px !important;
  min-height: 36px !important;
  font-size: 13px !important;
  color: #334155 !important;
  border-radius: 6px !important;
  margin: 1px 4px !important;
  transition: background-color 0.15s ease, color 0.15s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.intl-tel-wrapper .iti__country:hover,
.intl-tel-wrapper .iti__country.iti__highlight {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

.intl-tel-wrapper .iti__country[aria-selected="true"] {
  background-color: #e6f4ff !important;
  color: #1677ff !important;
}

.intl-tel-wrapper .iti__country .iti__flag {
  order: 1 !important;
  margin-right: 0 !important;
  flex-shrink: 0 !important;
}

.intl-tel-wrapper .iti__country .iti__country-name {
  order: 2 !important;
  flex: 1 1 auto !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #1e293b !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  margin-left: 0 !important;
}

.intl-tel-wrapper .iti__country .iti__dial-code {
  order: 3 !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  color: #64748b !important;
  font-weight: 500 !important;
  text-align: right !important;
}

.intl-tel-wrapper .iti__country[aria-selected="true"] .iti__dial-code {
  color: #1677ff !important;
}

.intl-tel-wrapper input.iti__tel-input {
  flex: 1 1 0% !important;
  min-width: 0 !important;
  height: 32px !important;
  padding-left: 11px !important;
  padding-right: 11px !important;
  font-size: 13px !important;
  color: #1e293b !important;
  background-color: #ffffff !important;
  border: 1px solid #d9d9d9 !important;
  border-radius: 4px !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02) !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-sizing: border-box !important;
}

.intl-tel-wrapper input.iti__tel-input:focus {
  border-color: #1677ff !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15) !important;
}

.intl-tel-wrapper.has-error input.iti__tel-input {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.15) !important;
}

.intl-tel-wrapper.is-disabled .iti__selected-country,
.intl-tel-wrapper.is-disabled input.iti__tel-input {
  background-color: #f5f5f5 !important;
  color: #00000040 !important;
  cursor: not-allowed !important;
  border-color: #d9d9d9 !important;
}
</style>
