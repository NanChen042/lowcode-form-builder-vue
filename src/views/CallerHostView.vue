<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- 顶部导航栏 -->
    <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          HOST
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-800 leading-tight">母系统业务调用中心 (Form Builder Caller)</h1>
          <p class="text-[12px] text-slate-400">基于 Mockjs 与 Vue-Router 的多场景表单构建器调用与联调平台</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/60"
          @click="openNewBlankForm"
        >
          + 一键新建空白表单 (无 ID 纯净态)
        </button>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
      <!-- 场景卡片 1：常用场景一键调用 -->
      <section class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              常用模板与场景快捷调用 (Quick Presets)
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">点击直接通过 URL 参数呼起构建器，体验不同 ID 对应的数据拉取与纯净新建流程</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">Mockjs Active</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- 卡片 1: 全新空白表单 (无 ID) -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition-all bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">新建页面 (无 ID)</span>
                <span class="text-[10px] text-slate-400">clean state</span>
              </div>
              <h3 class="text-sm font-bold text-slate-800 mb-1">新建纯净空白表单</h3>
              <p class="text-xs text-slate-500 line-clamp-2">URL 中不带 ?id 参数。打开即为全新的空白画布，不会从本地或服务端读取任何旧草稿。</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <code class="text-[11px] text-slate-400 font-mono">/?nickname=李总</code>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                @click="callBuilder('/')"
              >
                调用打开
              </button>
            </div>
          </div>

          <!-- 卡片 2: 实体成员 KYC 模板 (ent_tpl_20261013_yl63) -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-indigo-400 hover:shadow-sm transition-all bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">预设模板</span>
                <span class="text-[10px] text-slate-400">ent_tpl</span>
              </div>
              <h3 class="text-sm font-bold text-slate-800 mb-1">实体成员 KYC 模板</h3>
              <p class="text-xs text-slate-500 line-clamp-2">包含实体成员基础资料页与问卷表单页，调用标准 Mock 数据。</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <code class="text-[11px] text-slate-400 font-mono">id=ent_tpl_20261013_yl63</code>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                @click="callBuilder('/?id=ent_tpl_20261013_yl63')"
              >
                调用打开
              </button>
            </div>
          </div>

          <!-- 卡片 3: 个人自建 KYC 问卷 (ind_diy_20261013_mvpr) -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-sm transition-all bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100">已存自建表单</span>
                <span class="text-[10px] text-slate-400">ind_diy</span>
              </div>
              <h3 class="text-sm font-bold text-slate-800 mb-1">个人自建问卷</h3>
              <p class="text-xs text-slate-500 line-clamp-2">测试 ID 为 ind_diy_20261013_mvpr，对应完整的个人表单架构。</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <code class="text-[11px] text-slate-400 font-mono">id=ind_diy_20261013_mvpr</code>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                @click="callBuilder('/?id=ind_diy_20261013_mvpr')"
              >
                调用打开
              </button>
            </div>
          </div>

          <!-- 卡片 4: 客户母案例模板 (cus_tpl_20261013_demo) -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-sm transition-all bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">母案例模板</span>
                <span class="text-[10px] text-slate-400">cus_tpl</span>
              </div>
              <h3 class="text-sm font-bold text-slate-800 mb-1">客户母案例标准模板</h3>
              <p class="text-xs text-slate-500 line-clamp-2">SG_CDD_Customer 客户母案例标准 CDD 模板。</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <code class="text-[11px] text-slate-400 font-mono">id=cus_tpl_20261013_demo</code>
              <button
                type="button"
                class="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors cursor-pointer"
                @click="callBuilder('/?id=cus_tpl_20261013_demo')"
              >
                调用打开
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 场景卡片 2：自定义参数调用控制台 -->
      <section class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h2 class="text-sm font-bold text-slate-800 mb-1">自定义参数调用控制台 (Custom Parameters Invoker)</h2>
        <p class="text-xs text-slate-400 mb-4">模拟外部系统传递的真实业务参数组合</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">表单 ID (id)</label>
            <input
              v-model="customFormId"
              type="text"
              placeholder="留空即为新建空白页面"
              class="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">登录人昵称 (nickname)</label>
            <input
              v-model="customNickname"
              type="text"
              placeholder="例如：李总"
              class="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">企业/机构名称 (company)</label>
            <input
              v-model="customCompany"
              type="text"
              placeholder="例如：阿尔法数字科技"
              class="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">界面语言环境 (lang)</label>
            <select
              v-model="customLang"
              class="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="zh">中文 (zh)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="text-xs text-slate-500 font-mono">
            生成的调用 URL：<span class="text-blue-600 font-semibold">{{ computedCallUrl }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              @click="openInCurrentWindow"
            >
              当前窗口打开
            </button>
            <button
              type="button"
              class="px-4 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
              @click="openInNewTab"
            >
              新标签页打开
            </button>
            <button
              type="button"
              class="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              @click="embedInIframe"
            >
              在下方内嵌预览
            </button>
          </div>
        </div>
      </section>

      <!-- 场景卡片 3：内嵌 Iframe 容器实时联调 -->
      <section v-if="iframeUrl" class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-800">内嵌式调用容器 (Embedded Iframe Host)</h2>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono border border-emerald-100">
              {{ iframeUrl }}
            </span>
          </div>
          <button
            type="button"
            class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            @click="iframeUrl = ''"
          >
            关闭内嵌容器
          </button>
        </div>

        <div class="h-[750px] w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-inner">
          <iframe
            :src="iframeUrl"
            class="w-full h-full border-0"
            title="Form Builder Container"
          ></iframe>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const customFormId = ref('');
const customNickname = ref('李总');
const customCompany = ref('阿尔法数字科技');
const customLang = ref('zh');
const iframeUrl = ref('');

const computedCallUrl = computed(() => {
  const params = new URLSearchParams();
  if (customFormId.value.trim()) {
    params.set('id', customFormId.value.trim());
  }
  if (customNickname.value.trim()) {
    params.set('nickname', customNickname.value.trim());
  }
  if (customCompany.value.trim()) {
    params.set('company', customCompany.value.trim());
  }
  if (customLang.value) {
    params.set('lang', customLang.value);
  }
  const queryStr = params.toString();
  return queryStr ? `/?${queryStr}` : '/';
});

function callBuilder(url: string) {
  window.location.href = url;
}

function openNewBlankForm() {
  window.location.href = '/?nickname=李总&company=阿尔法数字科技&lang=zh';
}

function openInCurrentWindow() {
  window.location.href = computedCallUrl.value;
}

function openInNewTab() {
  window.open(computedCallUrl.value, '_blank');
}

function embedInIframe() {
  iframeUrl.value = computedCallUrl.value;
}
</script>
