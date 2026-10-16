<template>
  <div class="space-y-3.5">
    <!-- 单行文本格式类型 (文本 / 数字) -->
    <div v-if="element.type === 'input'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
      <div class="flex items-center gap-1.5">
        <span class="text-[12px] font-medium text-slate-600">{{ t('prop.inputType') }}</span>
        <a-tooltip :content="t('prop.inputTypeTip')" position="top">
          <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
        </a-tooltip>
      </div>

      <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs select-none">
        <div
          role="button"
          tabindex="0"
          class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
          :class="(!element.inputType || element.inputType === 'text') ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
          @click="element.inputType = 'text'; markDirty();"
        >
          {{ t('prop.inputTypeText') }}
        </div>
        <div
          role="button"
          tabindex="0"
          class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
          :class="element.inputType === 'number' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
          @click="element.inputType = 'number'; markDirty();"
        >
          {{ t('prop.inputTypeNumber') }}
        </div>
      </div>
    </div>

    <!-- 多行文本自适应行数配置 (最小行数 / 最大行数) -->
    <div v-if="element.type === 'textarea'" class="space-y-0.5">
      <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.minRows') }}</span>
          <a-tooltip :content="t('prop.minRowsTip')" position="top">
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>
        <a-input-number
          v-model="textareaMinRows"
          :min="1"
          :max="10"
          size="small"
          style="width: 100px"
        />
      </div>

      <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.maxRows') }}</span>
          <a-tooltip :content="t('prop.maxRowsTip')" position="top">
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>
        <a-input-number
          v-model="textareaMaxRows"
          :min="textareaMinRows"
          :max="20"
          size="small"
          style="width: 100px"
        />
      </div>
    </div>

    <!-- 电话组件专属：默认国际区号设置 -->
    <div v-if="element.type === 'phone'" class="space-y-2.5 pt-3.5 border-t border-slate-100">
      <a-form-item :label="t('prop.defaultDialCode')" class="mb-0">
        <a-select
          :model-value="selectedCountryIso"
          class="w-full"
          size="small"
          allow-search
          :trigger-props="{
            position: 'br',
            autoFitPopupWidth: false,
            autoFitPopupMinWidth: true,
            contentClass: 'dial-code-dropdown-popup'
          }"
          @change="onCountryIsoChange"
        >
          <template #label="{ data }">
            <div v-if="data" class="flex items-center gap-2 text-xs font-sans">
              <span class="iti__flag shrink-0" :class="'iti__' + (data.value || 'sg')"></span>
              <span class="font-mono font-medium text-slate-800">{{ getCountryCodeByIso(data.value) }}</span>
              <span class="text-slate-600 truncate font-sans">
                {{ getCountryNameByIso(data.value) }}
              </span>
            </div>
          </template>
          <a-option
            v-for="item in countryPhoneRules"
            :key="item.iso2"
            :value="item.iso2"
            :label="`${item.code} ${getCountryRuleName(item)}`"
          >
            <div class="flex items-center justify-between w-full text-xs font-sans py-0.5">
              <div class="flex items-center gap-2 min-w-0 flex-1 mr-2.5">
                <span class="iti__flag shrink-0" :class="'iti__' + item.iso2"></span>
                <span class="text-slate-800 font-sans text-xs truncate">
                  {{ getCountryRuleName(item) }}
                </span>
              </div>
              <span class="font-mono font-medium text-slate-400 shrink-0 text-right">{{ item.code }}</span>
            </div>
          </a-option>
        </a-select>
      </a-form-item>
    </div>

    <!-- 国家 / 国籍专属：预设国家 -->
    <div v-if="['country', 'nationality'].includes(element.type)" class="pt-3.5 border-t border-slate-100">
      <div class="flex items-center justify-between py-1">
        <span class="text-[12px] font-medium text-slate-600">
          {{ element.type === 'nationality'
            ? t('prop.presetNationalities')
            : t('prop.presetCountries')
          }}
        </span>
        <a-button
          size="mini"
          type="secondary"
          class="!text-[12px] !h-6 !px-2 !rounded-md"
          @click="emit('open-country-modal')"
        >
          <span>{{ t('prop.viewDirectory') }}</span>
          <ChevronRight class="w-3 h-3 ml-0.5 text-slate-400" />
        </a-button>
      </div>
    </div>

    <!-- 提示区块专属：提示内容多行编辑 -->
    <div v-if="element.type === 'alert'" class="space-y-2 pt-3.5 border-t border-slate-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-[12px] font-semibold text-slate-700 whitespace-nowrap">
            {{ t('prop.alertContentTitle') }}
          </span>
          <span
            v-if="isAlertContentMissing"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0"
          >
            {{ t('prop.untranslated') }}
          </span>
          <a-tooltip :content="t('prop.alertContentTip')" position="top">
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors shrink-0" />
          </a-tooltip>
        </div>

        <!-- 快捷插入辅助条 -->
        <div class="flex items-center gap-1.5 shrink-0">
          <a-dropdown position="bl" @select="handleListDropdownSelect">
            <a-button
              size="mini"
              type="secondary"
              class="!text-[12px] !h-6 !px-2 !rounded"
            >
              <template #icon>
                <List class="w-3.5 h-3.5 text-slate-500" />
              </template>
              <span>{{ t('prop.alertInsertBullet') }}</span>
              <ChevronDown class="w-3 h-3 ml-1 text-slate-400" />
            </a-button>
            <template #content>
              <a-doption value="circle">圆点列表 (无序)</a-doption>
              <a-doption value="number">数字列表 (有序)</a-doption>
            </template>
          </a-dropdown>

          <a-button
            size="mini"
            type="secondary"
            class="!text-[12px] !h-6 !px-2 !rounded"
            @click="insertAlertLink"
          >
            <template #icon>
              <Link2 class="w-3.5 h-3.5 text-slate-500" />
            </template>
            <span>{{ t('prop.alertInsertLink') }}</span>
          </a-button>
        </div>
      </div>

      <a-textarea
        id="prop-alert-content-input"
        v-model="alertContentModel"
        :auto-size="{ minRows: 6, maxRows: 14 }"
        :placeholder="t('prop.alertContentPlaceholder')"
        class="w-full !text-[12px] font-sans"
      />
    </div>

    <!-- 选项配置 (单选、多选、下拉、签名声明条款) -->
    <div v-if="hasOptionsConfig" class="space-y-2.5 pt-3.5 border-t border-slate-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-semibold text-slate-700">
            {{ element.type === 'signature' ? t('prop.clauseConfig') : t('prop.optionsConfig') }}
          </span>
          <a-tooltip
            :content="element.type === 'signature' ? t('prop.clauseConfigTip') : t('prop.optionsConfigTip')"
            position="top"
          >
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>
        <span class="text-[11px] text-slate-400">
          {{ element.type === 'signature'
            ? (store.currentLocale === 'en'
                ? `${element.options?.length || 0} items`
                : `共 ${element.options?.length || 0} 条`)
            : t('common.totalOptions', undefined, { count: element.options?.length || 0 })
          }}
        </span>
      </div>

      <OptionsEditor :element="element" />

      <!-- 选项排布方式 -->
      <div
        v-if="canStackChoices"
        class="mt-2 flex items-center justify-between py-1 pl-1"
      >
        <div class="flex items-center gap-1.5 shrink-0">
          <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="text-[12px] font-medium text-slate-600 whitespace-nowrap">{{ t('prop.optionLayout') }}</span>
        </div>

        <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs shrink-0 select-none">
          <div
            role="button"
            tabindex="0"
            class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
            :class="element.layout !== 'stack' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
            @click="element.layout = 'inline'; markDirty();"
          >
            <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1.5" y="4" width="5.8" height="8" rx="1.2" />
              <rect x="8.7" y="4" width="5.8" height="8" rx="1.2" :opacity="element.layout !== 'stack' ? 0.7 : 0.45" />
            </svg>
            <span>{{ t('prop.layoutInline') }}</span>
          </div>

          <div
            role="button"
            tabindex="0"
            class="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
            :class="element.layout === 'stack' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
            @click="element.layout = 'stack'; markDirty();"
          >
            <svg class="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="3" width="12" height="4" rx="1.2" />
              <rect x="2" y="9" width="12" height="4" rx="1.2" :opacity="element.layout === 'stack' ? 0.7 : 0.45" />
            </svg>
            <span>{{ t('prop.layoutStack') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 日期选择器专属配置 -->
    <div v-if="element.type === 'date'" class="space-y-0.5 pt-1.5 border-t border-slate-100">
      <div class="flex items-center justify-between py-1.5 border-t border-slate-50">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.dateMode') }}</span>
          <a-tooltip :content="t('prop.dateModeTip')" position="top">
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>

        <div class="inline-flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 shadow-xs select-none">
          <div
            role="button"
            tabindex="0"
            class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
            :class="(!element.dateMode || element.dateMode === 'single') ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
            @click="setDateMode('single')"
          >
            {{ t('prop.dateModeSingle') }}
          </div>
          <div
            role="button"
            tabindex="0"
            class="px-2 py-0.5 rounded text-[11px] font-medium leading-none transition-all cursor-pointer whitespace-nowrap"
            :class="element.dateMode === 'range' ? 'bg-[#1677ff] text-white shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'"
            @click="setDateMode('range')"
          >
            {{ t('prop.dateModeRange') }}
          </div>
        </div>
      </div>

      <!-- 启用长期选项 (仅单日期模式生效) -->
      <div v-if="element.dateMode !== 'range'" class="flex items-center justify-between py-1.5 border-t border-slate-50">
        <div class="flex items-center gap-1.5">
          <span class="text-[12px] font-medium text-slate-600">{{ t('prop.enableLongTerm') }}</span>
          <a-tooltip :content="t('prop.enableLongTermTip')" position="top">
            <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
          </a-tooltip>
        </div>
        <a-switch
          v-model="element.enableLongTerm"
          size="small"
          @change="onEnableLongTermChange"
        />
      </div>

      <!-- 默认勾选长期 -->
      <CollapseTransition
        v-if="element.type === 'date' && element.dateMode !== 'range'"
        :key="`${element.id}-longterm`"
        :show="Boolean(element.enableLongTerm)"
      >
        <div class="flex items-center justify-between py-1 pl-1">
          <div class="flex items-center gap-1.5">
            <CornerDownRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span class="text-[12px] font-medium text-slate-600">{{ t('prop.defaultLongTerm') }}</span>
            <a-tooltip :content="t('prop.defaultLongTermTip')" position="top">
              <HelpCircle class="h-3.5 w-3.5 text-slate-400 hover:text-[#1677ff] cursor-help transition-colors" />
            </a-tooltip>
          </div>
          <a-switch
            v-model="element.defaultLongTerm"
            size="small"
            @change="markDirty"
          />
        </div>
      </CollapseTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormElement } from '@/types/schema';
import { store, markDirty } from '@/core/store';
import { t, getFieldText, setFieldText } from '@/core/i18n';
import { countryPhoneRules, getCountryPhoneRule } from '@/registry/phoneRules';
import OptionsEditor from './OptionsEditor.vue';
import CollapseTransition from '@/components/common/CollapseTransition.vue';
import {
  HelpCircle,
  CornerDownRight,
  ChevronRight,
  List,
  ChevronDown,
  Link2
} from '@lucide/vue';

const props = defineProps<{
  element: FormElement;
}>();

const emit = defineEmits<{
  (e: 'open-country-modal'): void;
}>();

const textareaMinRows = computed<number>({
  get() {
    return props.element.minRows || 3;
  },
  set(val: number) {
    const num = Number(val) || 1;
    props.element.minRows = num;
    if (props.element.maxRows && props.element.maxRows < num) {
      props.element.maxRows = num;
    }
    markDirty();
  }
});

const textareaMaxRows = computed<number>({
  get() {
    return props.element.maxRows || 6;
  },
  set(val: number) {
    const min = props.element.minRows || 1;
    const num = Number(val) || min;
    props.element.maxRows = Math.max(num, min);
    markDirty();
  }
});

const selectedCountryIso = computed(() => {
  if (props.element.countryCode) return props.element.countryCode.toLowerCase();
  if (props.element.dialCode) {
    return getCountryPhoneRule(props.element.dialCode).iso2;
  }
  return 'sg';
});

function getCountryRuleName(rule?: { name?: string; zh?: string }): string {
  if (!rule) return '';
  return store.currentLocale === 'en' ? (rule.name || rule.zh || '') : (rule.zh || rule.name || '');
}

function getCountryCodeByIso(iso?: string): string {
  return getCountryPhoneRule(iso).code;
}

function getCountryNameByIso(iso?: string): string {
  if (!iso) return t('common.singapore');
  const rule = getCountryPhoneRule(iso);
  return getCountryRuleName(rule);
}

function onCountryIsoChange(iso: any) {
  if (props.element.type !== 'phone') {
    markDirty();
    return;
  }
  const rule = getCountryPhoneRule(String(iso));
  props.element.countryCode = rule.iso2;
  props.element.dialCode = rule.code;
  markDirty();
}

const alertContentModel = computed({
  get() {
    return getFieldText(props.element, 'content');
  },
  set(val: string) {
    setFieldText(props.element, 'content', val);
  }
});

const isAlertContentMissing = computed(() => {
  if (props.element.type !== 'alert') return false;
  if (store.currentLocale === 'en') {
    return Boolean(props.element.content && !props.element.content_en);
  }
  return Boolean(props.element.content_en && !props.element.content);
});

function handleListDropdownSelect(value: any) {
  if (value === 'number') {
    props.element.listStyle = 'number';
    const current = alertContentModel.value || '';
    const prefix = current && !current.endsWith('\n') ? '\n' : '';
    const lines = current.split('\n');
    let maxNum = 0;
    for (const line of lines) {
      const match = line.trim().match(/^(\d+)[\.、]/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const nextNum = maxNum + 1;
    alertContentModel.value = `${current}${prefix}${nextNum}. `;
  } else {
    props.element.listStyle = 'circle';
    const current = alertContentModel.value || '';
    const prefix = current && !current.endsWith('\n') ? '\n' : '';
    alertContentModel.value = `${current}${prefix}- `;
  }
  markDirty();
}

function insertAlertLink() {
  const current = alertContentModel.value || '';
  const prefix = current && !current.endsWith('\n') && !current.endsWith(' ') ? ' ' : '';
  alertContentModel.value = `${current}${prefix}[提示文字](xxx.com)`;
}

const hasOptionsConfig = computed(() => {
  return ['select', 'radio', 'checkbox', 'signature'].includes(
    props.element.type
  );
});

const canStackChoices = computed(() => {
  return ['radio', 'checkbox'].includes(props.element.type);
});

function setDateMode(mode: 'single' | 'range') {
  props.element.dateMode = mode;
  if (mode === 'range') {
    props.element.enableLongTerm = false;
    props.element.defaultLongTerm = false;
  }
  markDirty();
}

function onEnableLongTermChange(val: any) {
  props.element.enableLongTerm = Boolean(val);
  if (!val) {
    props.element.defaultLongTerm = false;
  }
  markDirty();
}
</script>
