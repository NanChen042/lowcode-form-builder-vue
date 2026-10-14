<template>
  <div
    v-if="isFieldVisible"
    class="preview-field w-full mb-4.5 transition-all duration-200"
    :data-type="field.type"
    :data-error="Boolean(error)"
    :class="{ 'has-error': Boolean(error) }"
  >
    <!-- 提示区块 (仅展示无校验) -->
    <template v-if="field.type === 'alert'">
      <div
        class="w-full overflow-hidden rounded-xl border border-[#bae0ff] bg-[#f0f7ff]/90 p-4 shadow-[0_1px_3px_rgba(22,119,255,0.06)] border-t-[3.5px] border-t-[#1677ff] mb-4"
      >
        <div v-if="field.showLabel !== false" class="flex items-center gap-2 mb-2.5">
          <Info class="h-4 w-4 text-[#1677ff] shrink-0" />
          <span class="text-[14px] font-bold text-slate-800 leading-5">{{ localizedLabel || t('common.notice') }}</span>
        </div>
        <div class="space-y-2 text-[13px] leading-5 text-slate-700">
          <p v-for="(opt, idx) in field.options" :key="idx" class="m-0 flex items-start gap-2.5">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#1677ff]"></span>
            <span>{{ getLocalizedOptionLabel(opt) }}</span>
          </p>
        </div>
      </div>
    </template>

    <!-- 普通表单组件：采用高精度布局与严谨校验 -->
    <template v-else>
      <!-- 字段标签区 -->
      <div v-if="field.showLabel !== false" class="component-label mb-1.5 text-[13px] font-medium text-slate-800 leading-5">
        <span v-if="isFieldRequired" class="req-star text-[#ff4d4f] font-bold mr-1 inline select-none">*</span><span class="label-text inline break-words">{{ localizedLabel || t('common.untitledField') }}</span>
        <!-- 标题右侧说明 (默认排布) -->
        <span v-if="field.helpPosition !== 'bottom' && localizedHelp" class="field-help text-[11px] text-slate-400 font-normal ml-1.5 inline">{{ localizedHelp }}</span>

        <!-- 标题下方说明 (底部换行排布) -->
        <div v-if="field.helpPosition === 'bottom' && localizedHelp" class="field-help-bottom text-[11px] text-slate-400 font-normal mt-0.5 leading-4">
          {{ localizedHelp }}
        </div>
      </div>

      <!-- 单行文本 (普通文本或数字) -->
      <a-input-number
        v-if="field.type === 'input' && field.inputType === 'number'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :hide-button="true"
        @change="handleFieldInput"
      />
      <a-input
        v-else-if="field.type === 'input'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        @input="handleFieldInput"
      />

      <!-- 电子邮箱 -->
      <a-input
        v-else-if="field.type === 'email'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        @input="handleFieldInput"
      >
        <template #prefix>
          <Mail class="h-3.5 w-3.5 text-slate-400" />
        </template>
      </a-input>

      <!-- 手机号码 (直接复用 algo 同款 intlTelInput 库，默认新加坡 +65) -->
      <IntlTelInput
        v-else-if="field.type === 'phone'"
        v-model="formData[field.key]"
        v-model:dial-code="phoneDialCode"
        v-model:country-code="phoneCountryCode"
        :custom-placeholder="localizedPlaceholder"
        :custom-error-message="localizedCustomErrorMessage"
        :required="isFieldRequired"
        :strict="field.strictPhoneValidation !== false"
        :error="Boolean(error)"
        :error-message="error"
        @change="handlePhoneChange"
      />

      <!-- 多行文本 -->
      <a-textarea
        v-else-if="field.type === 'textarea'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :auto-size="{ minRows: 3, maxRows: 6 }"
        @input="handleFieldInput"
      />

      <!-- 下拉选择 (多选) -->
      <a-select
        v-else-if="field.type === 'select' && field.multiple"
        v-model="selectedTags"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        multiple
        :limit="field.maxSelections || undefined"
        :max-tag-count="field.maxSelections || 3"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <a-option
          v-for="(opt, idx) in field.options"
          :key="idx"
          :value="opt.value"
        >
          {{ getLocalizedOptionLabel(opt) }}
        </a-option>
      </a-select>

      <!-- 下拉选择 (单选) -->
      <a-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <a-option
          v-for="(opt, idx) in field.options"
          :key="idx"
          :value="opt.value"
        >
          {{ getLocalizedOptionLabel(opt) }}
        </a-option>
      </a-select>

      <!-- 国家 / 国籍标签选择器 (多选模式，虚拟滚动极速渲染) -->
      <a-select
        v-else-if="(field.type === 'country' || field.type === 'nationality') && field.multiple"
        v-model="selectedTags"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        multiple
        :limit="field.maxSelections || undefined"
        :max-tag-count="field.maxSelections || 3"
        :options="countrySelectOptions"
        :virtual-list-props="{ height: 240 }"
        :filter-option="filterCountryOption"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <template #label="{ data }">
          <span class="inline-flex items-center gap-1.5">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span>{{ data.label }}</span>
          </span>
        </template>
        <template #option="{ data }">
          <div class="flex items-center gap-2 w-full text-xs font-sans">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span class="font-medium text-slate-800">{{ data.label }}</span>
          </div>
        </template>
      </a-select>

      <!-- 国家 / 国籍选择器 (单选模式，虚拟滚动极速渲染) -->
      <a-select
        v-else-if="field.type === 'country' || field.type === 'nationality'"
        v-model="formData[field.key]"
        class="w-full"
        :error="Boolean(error)"
        :placeholder="localizedPlaceholder"
        :options="countrySelectOptions"
        :virtual-list-props="{ height: 240 }"
        :filter-option="filterCountryOption"
        allow-clear
        allow-search
        @change="handleFieldInput"
      >
        <template #label="{ data }">
          <span class="inline-flex items-center gap-1.5">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span>{{ data.label }}</span>
          </span>
        </template>
        <template #option="{ data }">
          <div class="flex items-center gap-2 w-full text-xs font-sans">
            <span class="iti__flag shrink-0" :class="'iti__' + (data.value ? String(data.value).toLowerCase() : 'sg')"></span>
            <span class="font-medium text-slate-800">{{ data.label }}</span>
          </div>
        </template>
      </a-select>

      <!-- 单选框组 (天然统一排版，与画布一致，杜绝 Arco 内部样式冲突与调换顺序间距塌陷) -->
      <div
        v-else-if="field.type === 'radio'"
        class="w-full py-0.5"
      >
        <div
          class="choice-group flex flex-wrap"
          :class="field.layout === 'stack' ? 'flex-col gap-2.5' : 'flex-row gap-x-5 gap-y-2.5'"
        >
          <label
            v-for="(opt, idx) in field.options"
            :key="opt.value || idx"
            class="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-800 group"
            @click="formData[field.key] = opt.value; handleFieldInput();"
          >
            <span
              class="flex items-center justify-center w-4 h-4 rounded-full border transition-all shrink-0"
              :class="formData[field.key] === opt.value
                ? 'border-[#1677ff] bg-[#1677ff]'
                : (error ? 'border-red-400 bg-white group-hover:border-red-500' : 'border-slate-300 bg-white group-hover:border-blue-400')"
            >
              <span v-if="formData[field.key] === opt.value" class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>
            <span>{{ getLocalizedOptionLabel(opt) }}</span>
          </label>
        </div>
      </div>

      <!-- 多选框组 (天然统一排版，与画布一致) -->
      <div
        v-else-if="field.type === 'checkbox'"
        class="w-full py-0.5"
      >
        <div
          class="choice-group flex flex-wrap"
          :class="field.layout === 'stack' ? 'flex-col gap-2.5' : 'flex-row gap-x-5 gap-y-2.5'"
        >
          <label
            v-for="(opt, idx) in field.options"
            :key="opt.value || idx"
            class="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-slate-800 group"
            @click="toggleCheckbox(opt.value)"
          >
            <span
              class="flex items-center justify-center w-4 h-4 rounded border transition-all shrink-0"
              :class="selectedTags.includes(opt.value)
                ? 'border-[#1677ff] bg-[#1677ff] text-white'
                : (error ? 'border-red-400 bg-white group-hover:border-red-500' : 'border-slate-300 bg-white group-hover:border-blue-400')"
            >
              <svg v-if="selectedTags.includes(opt.value)" class="w-2.5 h-2.5 text-white stroke-[2.5]" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>{{ getLocalizedOptionLabel(opt) }}</span>
          </label>
        </div>
      </div>

      <!-- 日期选择 -->
      <div v-else-if="field.type === 'date'" class="w-full">
        <div class="flex items-center gap-2.5">
          <div class="flex-1 min-w-0">
            <a-range-picker
              v-if="field.dateMode === 'range'"
              v-model="formData[field.key]"
              style="width: 100%"
              :error="Boolean(error)"
              :disabled="isLongTermChecked"
              :placeholder="[t('common.startDate'), t('common.endDate')]"
              @change="handleFieldInput"
            />
            <a-date-picker
              v-else
              v-model="formData[field.key]"
              style="width: 100%"
              :error="Boolean(error)"
              :disabled="isLongTermChecked"
              :placeholder="localizedPlaceholder"
              @change="handleFieldInput"
            />
          </div>

          <!-- 启用长期选项 (框架自带 Arco Checkbox 组件) -->
          <div v-if="field.enableLongTerm" class="flex-shrink-0 flex items-center">
            <a-checkbox
              v-model="isLongTermChecked"
              class="!m-0 select-none"
              @change="onLongTermChange"
            >
              <span class="text-[13px] font-medium text-slate-700">
                {{ t('common.longTerm') }}
              </span>
            </a-checkbox>
          </div>
        </div>
      </div>

      <!-- 电子签名 (拼多选声明事项 + 手写签名板，各自下方独立展示校验错误) -->
      <div
        v-else-if="field.type === 'signature'"
        class="w-full bg-white rounded-lg"
      >
        <!-- 声明事项复选 -->
        <div v-if="field.options && field.options.length" class="mb-3">
          <div
            class="space-y-2 rounded-lg transition-all"
            :class="{ 'p-2 bg-red-50/40 border border-red-300 ring-1 ring-red-300/50': Boolean(declarationError) }"
          >
            <label
              v-for="(opt, idx) in field.options"
              :key="opt.value || idx"
              class="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer select-none group"
              @click.prevent="declarationChecks[idx] = !declarationChecks[idx]; onDeclarationChange();"
            >
              <span
                class="mt-0.5 flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-all"
                :class="declarationChecks[idx]
                  ? 'border-[#1677ff] bg-[#1677ff] text-white shadow-xs'
                  : (declarationError ? 'border-red-400 bg-white ring-2 ring-red-100' : 'border-slate-300 bg-white group-hover:border-blue-400')"
              >
                <svg v-if="declarationChecks[idx]" class="w-2.5 h-2.5 text-white stroke-[2.5]" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span class="flex-1 text-[13px] leading-5 text-slate-700 break-words whitespace-normal font-normal">
                {{ getLocalizedOptionLabel(opt) }}
              </span>
            </label>
          </div>

          <!-- 声明事项独立校验错误提示 (直接显示在多选条款下方) -->
          <transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="declarationError"
              class="mt-1.5 pl-0.5 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
            >
              <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ declarationError }}</span>
            </div>
          </transition>
        </div>

        <!-- 签名画板提示 -->
        <div class="mb-2 text-xs font-medium text-slate-600">
          <span v-if="field.required" class="text-[#ff4d4f] font-bold mr-0.5">*</span>
          {{ localizedPlaceholder }}
        </div>

        <!-- 模拟签名绘制区 -->
        <div
          class="relative h-24 w-full rounded-lg border border-dashed flex items-center justify-center text-xs select-none cursor-pointer transition-all"
          :class="formData[field.key]
            ? 'border-emerald-400 bg-emerald-50/40 text-emerald-700 font-serif'
            : (signatureError
              ? 'border-red-400 bg-red-50/45 shadow-[0_0_0_2px_rgba(239,68,68,0.18)] text-red-500'
              : 'border-slate-300 bg-slate-50/80 text-slate-400 hover:border-blue-400')"
          @click="toggleSignature"
        >
          <template v-if="formData[field.key]">
            <span class="text-base italic font-semibold text-slate-800 tracking-wider">
              {{ t('common.signed') }}
            </span>
            <button
              type="button"
              class="absolute right-2 bottom-2 w-6 h-6 flex items-center justify-center rounded bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 border border-slate-200 shadow-xs transition-colors cursor-pointer"
              :title="t('common.clearSignature')"
              @click.stop="clearSignature"
            >
              <Eraser class="w-3.5 h-3.5" />
            </button>
          </template>
          <template v-else>
            <span class="flex items-center gap-1.5 text-slate-400 text-xs">
              <PenLine class="w-3.5 h-3.5 opacity-60" />
              <span>{{ t('common.clickToSign') }}</span>
            </span>
          </template>
        </div>

        <!-- 手写签名板独立校验错误提示 (直接显示在签名画板下方) -->
        <transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="signatureError"
            class="mt-1.5 pl-0.5 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
          >
            <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ signatureError }}</span>
          </div>
        </transition>
      </div>

      <!-- 统一字段校验错误提示 (除已就近展示的 phone 和 signature 以外) -->
      <transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="error && field.type !== 'phone' && field.type !== 'signature'"
          class="mt-1 text-[11px] font-medium text-[#f53f3f] flex items-center gap-1 leading-tight"
        >
          <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { FormElement } from '@/types/schema';
import { t, getLocalizedFieldText, getLocalizedOptionLabel } from '@/core/i18n';
import { parseMultiValue, stringifyMultiValue } from '@/utils/helpers';
import { Info, Mail, Eraser, PenLine } from '@lucide/vue';
import IntlTelInput from '@/components/common/IntlTelInput.vue';
import { defaultCountryOptions, defaultNationalityOptions } from '@/registry/components';

const props = defineProps<{
  field: FormElement;
  formData: Record<string, any>;
  error?: string;
  errors?: Record<string, string>;
}>();

const resolvedCountryOptions = computed(() => {
  if (props.field.options && props.field.options.length > 0) {
    return props.field.options;
  }
  return props.field.type === 'nationality' ? defaultNationalityOptions : defaultCountryOptions;
});

const countrySelectOptions = computed(() => {
  return resolvedCountryOptions.value.map(opt => {
    const label = getLocalizedOptionLabel(opt);
    return {
      value: opt.value,
      label: label,
      label_en: opt.label_en || opt.value,
      rawOption: opt
    };
  });
});

function filterCountryOption(input: string, option: any): boolean {
  if (!input) return true;
  const q = input.trim().toLowerCase();
  const val = String(option.value || '').toLowerCase();
  const label = String(option.label || '').toLowerCase();
  const labelEn = String(option.label_en || option.rawOption?.label_en || '').toLowerCase();
  return val.includes(q) || label.includes(q) || labelEn.includes(q);
}

const emit = defineEmits<{
  (e: 'clear-error', key: string): void;
}>();

const isFieldVisible = computed(() => {
  if (!props.field.dependsOn) return true;
  return props.formData[props.field.dependsOn.fieldKey] === props.field.dependsOn.value;
});

function handleFieldInput() {
  emit('clear-error', props.field.key);
}

const declarationError = computed(() => {
  if (props.field.type !== 'signature') return '';
  return props.errors?.[`${props.field.key}_declaration`] || (
    (props.error && props.field.declarationRequired && !props.formData[`${props.field.key}_declared`])
      ? props.error
      : ''
  );
});

const signatureError = computed(() => {
  if (props.field.type !== 'signature') return '';
  return props.errors?.[`${props.field.key}_signature`] || (
    (props.error && props.field.required && !props.formData[props.field.key])
      ? props.error
      : ''
  );
});

function toggleCheckbox(val: string) {
  const current = [...selectedTags.value];
  const idx = current.indexOf(val);
  if (idx > -1) {
    current.splice(idx, 1);
  } else {
    if (props.field.maxSelections && current.length >= props.field.maxSelections) {
      return;
    }
    current.push(val);
  }
  selectedTags.value = current;
  handleFieldInput();
}

// 电话组件交互：双向绑定 formData，保持区号与国家代码响应式同步
const phoneDialCode = computed({
  get() {
    return props.formData[`${props.field.key}_areacode`] || props.field.dialCode || '+65';
  },
  set(val: string) {
    props.formData[`${props.field.key}_areacode`] = val;
  }
});

const phoneCountryCode = computed({
  get() {
    return props.formData[`${props.field.key}_countryCode`] || props.field.countryCode || 'sg';
  },
  set(val: string) {
    props.formData[`${props.field.key}_countryCode`] = val;
  }
});

function handlePhoneChange(data: any) {
  if (data.areacode) {
    props.formData[`${props.field.key}_areacode`] = `+${data.areacode}`;
  }
  if (data.countryCode) {
    props.formData[`${props.field.key}_countryCode`] = data.countryCode;
  }
  props.formData[`${props.field.key}_full`] = data.fullNumber;
  props.formData[`${props.field.key}_valid`] = data.valid;
  props.formData[`${props.field.key}_msg`] = data.message;
  emit('clear-error', props.field.key);
}

// 长期有效选项
const isLongTermChecked = ref(
  props.formData[props.field.key] === '9999-12-31' ||
  props.formData[props.field.key] === 'Long-term' ||
  props.formData[props.field.key] === '长期' ||
  Boolean(props.formData[`${props.field.key}_isLongTerm`]) ||
  Boolean(props.field.defaultLongTerm)
);

if (props.field.type === 'date' && props.field.enableLongTerm && props.field.defaultLongTerm && !props.formData[props.field.key]) {
  props.formData[props.field.key] = '9999-12-31';
  props.formData[`${props.field.key}_isLongTerm`] = true;
}

function onLongTermChange(val: boolean | (string | number | boolean)[]) {
  const isChecked = Boolean(val);
  props.formData[`${props.field.key}_isLongTerm`] = isChecked;
  if (isChecked) {
    props.formData[props.field.key] = '9999-12-31';
  } else {
    props.formData[props.field.key] = props.field.defaultValue || '';
  }
  emit('clear-error', props.field.key);
}

// 声明事项复选勾选状态 (持久化存入 formData，避免切换页面时状态丢失)
if (!props.formData[`${props.field.key}_checks`]) {
  props.formData[`${props.field.key}_checks`] = {};
}
const declarationChecks = reactive<Record<number, boolean>>(props.formData[`${props.field.key}_checks`]);

function onDeclarationChange() {
  props.formData[`${props.field.key}_checks`] = { ...declarationChecks };
  const allChecked = (props.field.options || []).every((_, idx) => Boolean(declarationChecks[idx]));
  props.formData[`${props.field.key}_declared`] = allChecked;
  if (allChecked) {
    if (props.errors) {
      delete props.errors[`${props.field.key}_declaration`];
    }
    if (!signatureError.value) {
      emit('clear-error', props.field.key);
    }
  }
}

function toggleSignature() {
  if (!props.formData[props.field.key]) {
    props.formData[props.field.key] = 'data:image/svg+xml;signed';
  }
  if (props.errors) {
    delete props.errors[`${props.field.key}_signature`];
  }
  if (!declarationError.value) {
    emit('clear-error', props.field.key);
  }
}

function clearSignature() {
  props.formData[props.field.key] = '';
}

const localizedLabel = computed(() => getLocalizedFieldText(props.field, 'label'));
const localizedHelp = computed(() => getLocalizedFieldText(props.field, 'help'));
const localizedCustomErrorMessage = computed(() => getLocalizedFieldText(props.field, 'customErrorMessage'));
const localizedPlaceholder = computed(() => {
  const custom = getLocalizedFieldText(props.field, 'placeholder');
  if (custom) return custom;
  if (props.field.type === 'email') return t('prop.emailPlaceholder');
  if (props.field.type === 'country') return t('prop.defaultCountryPlaceholder');
  if (props.field.type === 'nationality') return t('prop.defaultNatPlaceholder');
  return '';
});

const isFieldRequired = computed(() => {
  if (props.field.type === 'signature') {
    return Boolean(props.field.declarationRequired || props.field.required);
  }
  return Boolean(props.field.required);
});

const selectedTags = computed<string[]>({
  get() {
    return parseMultiValue(props.formData[props.field.key]);
  },
  set(val) {
    props.formData[props.field.key] = stringifyMultiValue(val);
    emit('clear-error', props.field.key);
  }
});
</script>
