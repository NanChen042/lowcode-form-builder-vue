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

    <!-- 校验错误提示 (与 algo / Arco 体系保持一致) -->
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
import type { IntlTelInputInstance, IntlTelInputOptions } from '@/types/intlTelInput';
import { getCountryPhoneRule } from '@/registry/phoneRules';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    dialCode?: string;
    customPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    strict?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: '',
    dialCode: '+65',
    customPlaceholder: '',
    disabled: false,
    readonly: false,
    required: false,
    strict: true,
    error: false,
    errorMessage: ''
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'update:dialCode', val: string): void;
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

  // 默认国家二字码 (默认新加坡 'sg')
  const defaultIso = parseIsoFromDialCode(props.dialCode) || 'sg';

  const options: IntlTelInputOptions = {
    initialCountry: defaultIso,
    preferredCountries: ['sg', 'cn', 'hk', 'my', 'us', 'gb'],
    autoPlaceholder: 'aggressive',
    separateDialCode: true,
    validationNumberType: 'MOBILE',
    countrySearch: true
  };

  iti = window.intlTelInput(inputRef.value, options);

  // 初始化已有电话号码
  if (props.modelValue) {
    const full = props.modelValue.startsWith('+')
      ? props.modelValue
      : `${props.dialCode || '+65'}${props.modelValue}`;
    iti.setNumber(full);
  }

  updateInputPlaceholder();

  // 监听国家切换事件
  inputRef.value.addEventListener('countrychange', handleCountryChange);

  // 初始上报国家与校验状态
  validateAndEmit();
}

function parseIsoFromDialCode(code?: string): string {
  if (!code) return 'sg';
  const rule = getCountryPhoneRule(code);
  return rule ? rule.iso2 : 'sg';
}

function updateInputPlaceholder() {
  if (!inputRef.value) return;
  const current = iti ? iti.getSelectedCountryData() : null;
  const rule = current?.iso2 ? getCountryPhoneRule(current.iso2) : getCountryPhoneRule(props.dialCode || '+65');
  if (props.customPlaceholder && !/[a-zA-Z]/.test(props.customPlaceholder)) {
    inputRef.value.placeholder = props.customPlaceholder;
  } else {
    inputRef.value.placeholder = rule?.placeholder || '8123 4567';
  }
}

function handleCountryChange() {
  if (!iti) return;
  const countryData = iti.getSelectedCountryData();
  const newDialCode = '+' + countryData.dialCode;
  emit('update:dialCode', newDialCode);
  updateInputPlaceholder();
  validateAndEmit();
}

function handleInput() {
  if (inputRef.value) {
    const sanitized = inputRef.value.value.replace(/[^\d\s\-]/g, '');
    if (inputRef.value.value !== sanitized) {
      inputRef.value.value = sanitized;
    }
  }
  isDirty.value = true;
  validateAndEmit();
}

function handleBlur() {
  isDirty.value = true;
  validateAndEmit();
}

function validateAndEmit() {
  if (!iti || !inputRef.value) return;

  const raw = inputRef.value.value.trim();
  const countryData = iti.getSelectedCountryData();
  const nationalNumber = iti.getNumber();
  const pureMobile = raw.replace(/\D/g, '');

  let valid = true;
  let message = '';
  let message_en = '';

  if (!raw) {
    if (props.required) {
      valid = false;
      message = '请输入手机号码';
      message_en = 'Please enter phone number';
    }
  } else if (props.strict) {
    valid = iti.isValidNumber();
    if (!valid) {
      const rule = getCountryPhoneRule(countryData.iso2);
      const nameZh = rule?.zh || countryData.name || '';
      message = `请输入有效的${nameZh}手机号码`;
      message_en = `Please enter a valid ${countryData.name || ''} phone number`;
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

// 监听外部区号变化
watch(
  () => props.dialCode,
  newCode => {
    if (iti && newCode) {
      const current = iti.getSelectedCountryData();
      if ('+' + current.dialCode !== newCode) {
        const iso = parseIsoFromDialCode(newCode);
        iti.setCountry(iso);
        updateInputPlaceholder();
      }
    }
  }
);
</script>

<style>
/* 整体容器布局 (拆解为与 algo 完全一致的独立双矩形框排布) */
.intl-tel-wrapper .iti {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  position: relative !important;
}

/* 左侧独立区号方框容器 */
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

/* 左侧独立按钮 (标准 32px 高度，自带边框与交互态，彻底消除右偏与灰块) */
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

/* 核心修复：消除 primary 内部背景与边距，消除左侧多余灰块 */
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

/* 隐藏 primary 内部硬编码三角，改用优雅的末端 after 箭头 */
.intl-tel-wrapper .iti__selected-country-primary .iti__arrow {
  display: none !important;
}

/* 国旗居中 */
.intl-tel-wrapper .iti__selected-country-primary .iti__flag {
  margin-right: 0 !important;
  flex-shrink: 0 !important;
}

/* 国家区号紧随国旗排列于左侧，不发生向右偏移 */
.intl-tel-wrapper .iti__selected-dial-code {
  order: 2 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #1e293b !important;
  margin-left: 6px !important;
  white-space: nowrap !important;
}

/* 自定义下拉箭头：居于最右侧，比例精致 */
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

/* 下拉菜单位置与搜索面板 (对齐 algo 240+ 全球国家面板) */
.intl-tel-wrapper .iti__dropdown-content {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  margin-top: 4px !important;
  min-width: 290px !important;
  max-width: 320px !important;
  background: #ffffff !important;
  border-radius: 6px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06) !important;
  overflow: hidden !important;
  z-index: 1050 !important;
}

.intl-tel-wrapper .iti__search-input {
  border: 1px solid #e2e8f0 !important;
  border-radius: 4px !important;
  font-size: 12px !important;
  padding: 6px 10px !important;
  margin: 6px !important;
  width: calc(100% - 12px) !important;
  outline: none !important;
  box-sizing: border-box !important;
}

.intl-tel-wrapper .iti__search-input:focus {
  border-color: #1677ff !important;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15) !important;
}

.intl-tel-wrapper .iti__country-list {
  max-height: 240px !important;
  overflow-y: auto !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.intl-tel-wrapper .iti__country {
  padding: 7px 10px !important;
  font-size: 13px !important;
  color: #334155 !important;
  transition: background-color 0.15s !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.intl-tel-wrapper .iti__country:hover {
  background-color: #f1f5f9 !important;
}

.intl-tel-wrapper .iti__country.iti__highlight {
  background-color: #eff6ff !important;
  color: #1d4ed8 !important;
}

.intl-tel-wrapper .iti__dial-code {
  color: #94a3b8 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  margin-left: auto !important;
}

/* 右侧独立号码输入方框 (标准 32px 高度，重置 iti 原生左侧 padding) */
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
