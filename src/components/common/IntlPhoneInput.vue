<template>
  <div class="relative w-full" v-click-outside="closeDropdown">
    <!-- 国际电话输入主排布：左侧独立区号选择框 + 右侧独立号码输入框 -->
    <div class="flex items-center gap-2 w-full">
      <!-- 左侧：独立国家区号选择器 (标准 32px 高度，独立圆角边框) -->
      <div class="relative shrink-0">
        <button
          type="button"
          :disabled="disabled || readonly"
          class="h-8 px-2.5 min-w-[88px] rounded-md border bg-white flex items-center justify-between gap-1.5 transition-all select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
          :class="[
            isDropdownOpen
              ? 'border-[#1677ff] ring-2 ring-[#1677ff]/15 shadow-sm'
              : 'border-slate-200 hover:border-[#1677ff] hover:bg-slate-50/50',
            (disabled || readonly) ? '!cursor-not-allowed !bg-slate-50 !border-slate-200 opacity-80' : ''
          ]"
          @click="toggleDropdown"
        >
          <!-- 国旗 Emoji -->
          <span class="text-[16px] leading-none select-none">{{ currentRule.flag }}</span>

          <!-- 国际区号 -->
          <span class="text-[13px] font-medium text-slate-800 font-mono tracking-tight">
            {{ currentRule.code }}
          </span>

          <!-- 向下微型展开箭头 -->
          <ChevronDown
            class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200"
            :class="{ 'rotate-180 text-[#1677ff]': isDropdownOpen }"
          />
        </button>

        <!-- 悬浮国家区号选择面板 (参照 algo 交互与设计改造) -->
        <transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-1 scale-95"
        >
          <div
            v-if="isDropdownOpen"
            class="absolute left-0 top-[36px] z-50 w-[300px] rounded-lg border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col text-left"
          >
            <!-- 顶部搜索框 (Search) -->
            <div class="p-2 border-b border-slate-100 bg-slate-50/70">
              <div class="relative flex items-center">
                <Search class="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  class="w-full h-7 pl-7 pr-6 rounded border border-slate-200 bg-white text-[12px] text-slate-800 placeholder:text-slate-400 focus:border-[#1677ff] focus:outline-none transition-all"
                  :placeholder="store.currentLocale === 'en' ? 'Search country or code...' : '搜索国家名或区号...'"
                  @keydown.esc="closeDropdown"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
                  @click="searchQuery = ''"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- 国家列表滚动区 -->
            <div class="max-h-[240px] overflow-y-auto custom-scrollbar p-1">
              <!-- 无匹配结果 -->
              <div
                v-if="filteredList.length === 0"
                class="py-6 text-center text-xs text-slate-400"
              >
                {{ store.currentLocale === 'en' ? 'No country found' : '未找到匹配国家' }}
              </div>

              <!-- 搜索时直接显示过滤结果 -->
              <template v-if="searchQuery.trim()">
                <div
                  v-for="item in filteredList"
                  :key="item.iso2 + item.dialCode"
                  class="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors"
                  :class="item.code === currentRule.code ? 'bg-blue-50/80 text-[#1677ff] font-medium' : 'text-slate-700 hover:bg-slate-100/70'"
                  @click="selectCountry(item)"
                >
                  <div class="flex items-center gap-2 min-w-0 mr-2">
                    <span class="text-base leading-none select-none">{{ item.flag }}</span>
                    <span class="truncate">{{ store.currentLocale === 'en' ? item.name : `${item.zh} (${item.name})` }}</span>
                  </div>
                  <span class="text-[12px] text-slate-400 shrink-0 font-mono">{{ item.code }}</span>
                </div>
              </template>

              <!-- 未搜索时：先展示常用置顶国家，再展示全部国家 -->
              <template v-else>
                <!-- 常用置顶国家 -->
                <div class="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {{ store.currentLocale === 'en' ? 'Popular' : '常用地区' }}
                </div>
                <div
                  v-for="item in preferredList"
                  :key="'pref_' + item.iso2"
                  class="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors"
                  :class="item.code === currentRule.code ? 'bg-blue-50/80 text-[#1677ff] font-medium' : 'text-slate-700 hover:bg-slate-100/70'"
                  @click="selectCountry(item)"
                >
                  <div class="flex items-center gap-2 min-w-0 mr-2">
                    <span class="text-base leading-none select-none">{{ item.flag }}</span>
                    <span class="truncate">{{ store.currentLocale === 'en' ? item.name : `${item.zh} (${item.name})` }}</span>
                  </div>
                  <span class="text-[12px] text-slate-400 shrink-0 font-mono">{{ item.code }}</span>
                </div>

                <div class="h-px bg-slate-100 my-1"></div>

                <!-- 全部国家列表 -->
                <div class="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {{ store.currentLocale === 'en' ? 'All Countries' : '全部国家/地区' }}
                </div>
                <div
                  v-for="item in countryPhoneRules"
                  :key="'all_' + item.iso2 + item.dialCode"
                  class="flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors"
                  :class="item.code === currentRule.code ? 'bg-blue-50/80 text-[#1677ff] font-medium' : 'text-slate-700 hover:bg-slate-100/70'"
                  @click="selectCountry(item)"
                >
                  <div class="flex items-center gap-2 min-w-0 mr-2">
                    <span class="text-base leading-none select-none">{{ item.flag }}</span>
                    <span class="truncate">{{ store.currentLocale === 'en' ? item.name : `${item.zh} (${item.name})` }}</span>
                  </div>
                  <span class="text-[12px] text-slate-400 shrink-0 font-mono">{{ item.code }}</span>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </div>

      <!-- 右侧：独立电话号码输入框 (标准 32px 高度，独立圆角边框) -->
      <div class="flex-1 min-w-0 relative">
        <a-input
          :model-value="modelValue"
          :placeholder="computedPlaceholder"
          :disabled="disabled"
          :readonly="readonly"
          :error="hasError"
          :max-length="currentRule.maxLength + 2"
          allow-clear
          class="!h-8 w-full !rounded-md"
          @input="handleInput"
          @clear="handleClear"
        />
      </div>
    </div>

    <!-- 底部实时规则校验错误提示 (严格国际手机号规则) -->
    <transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="validationError"
        class="mt-1 pl-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
      >
        <span>{{ validationError }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { store } from '@/core/store';
import {
  countryPhoneRules,
  preferredCountryCodes,
  getCountryPhoneRule,
  validatePhoneNumber,
  type CountryPhoneRule
} from '@/registry/phoneRules';
import { ChevronDown, Search } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    dialCode?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    strict?: boolean;
    required?: boolean;
  }>(),
  {
    modelValue: '',
    dialCode: '+86',
    placeholder: '',
    disabled: false,
    readonly: false,
    strict: true,
    required: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'update:dialCode', val: string): void;
  (e: 'change', data: {
    dialCode: string;
    mobile: string;
    fullNumber: string;
    valid: boolean;
    iso2: string;
  }): void;
}>();

// 内部下拉弹层状态
const isDropdownOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);

// 当前选中国家规则
const currentRule = computed<CountryPhoneRule>(() => {
  return getCountryPhoneRule(props.dialCode || '+86');
});

// 动态占位符（若外部配置了自定义 placeholder 则优先使用，否则呈现该国真实示例号码）
const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  return currentRule.value.placeholder;
});

// 常用推荐国家清单
const preferredList = computed(() => {
  return countryPhoneRules.filter(c => preferredCountryCodes.includes(c.code));
});

// 搜索过滤清单
const filteredList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return countryPhoneRules;
  return countryPhoneRules.filter(c => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.zh.includes(q) ||
      c.dialCode.includes(q) ||
      c.code.includes(q) ||
      c.iso2.toLowerCase().includes(q)
    );
  });
});

// 号码规则校验结果
const validation = computed(() => {
  const val = (props.modelValue || '').trim();
  if (!val) {
    if (props.required) {
      return {
        valid: false,
        message: '请输入手机号码',
        message_en: 'Please enter phone number'
      };
    }
    return { valid: true, message: '', message_en: '' };
  }
  return validatePhoneNumber(currentRule.value.code, val, props.strict);
});

const hasError = computed(() => {
  const val = (props.modelValue || '').trim();
  if (!val) return false;
  return !validation.value.valid;
});

const validationError = computed(() => {
  const val = (props.modelValue || '').trim();
  if (!val) return '';
  if (!validation.value.valid) {
    return store.currentLocale === 'en' ? validation.value.message_en : validation.value.message;
  }
  return '';
});

function toggleDropdown() {
  if (props.disabled || props.readonly) return;
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function closeDropdown() {
  isDropdownOpen.value = false;
  searchQuery.value = '';
}

function selectCountry(item: CountryPhoneRule) {
  emit('update:dialCode', item.code);
  closeDropdown();
  emitChangeEvent(props.modelValue, item.code);
}

function handleInput(val: string) {
  // 过滤非数字字符
  const cleaned = val.replace(/\D/g, '');
  emit('update:modelValue', cleaned);
  emitChangeEvent(cleaned, currentRule.value.code);
}

function handleClear() {
  emit('update:modelValue', '');
  emitChangeEvent('', currentRule.value.code);
}

function emitChangeEvent(mobile: string, dialCode: string) {
  const rule = getCountryPhoneRule(dialCode);
  const validRes = validatePhoneNumber(rule.code, mobile, props.strict);
  emit('change', {
    dialCode: rule.code,
    mobile: mobile,
    fullNumber: mobile ? `${rule.code}${mobile}` : '',
    valid: validRes.valid,
    iso2: rule.iso2
  });
}
</script>
