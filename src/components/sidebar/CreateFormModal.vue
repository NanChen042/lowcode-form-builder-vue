<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="store.currentLocale === 'en' ? 'Create Form Canvas' : '新建表单画布'"
    :width="840"
    :title-align="'start'"
    unmount-on-close
    class="figma-create-modal"
    @cancel="handleCancel"
  >
    <div class="py-1 space-y-4 figma-modal-content">
      <!-- 外部 URL 业务主体锁定提示 -->
      <a-alert
        v-if="store.lockedProfileType"
        type="info"
        class="rounded-xl border border-blue-100 bg-blue-50/60"
      >
        <template #icon>
          <Lock class="h-4 w-4 text-[#0d99ff]" />
        </template>
        <div class="flex items-center gap-2 text-xs">
          <span class="font-semibold text-slate-800">
            {{ store.currentLocale === 'en' ? 'Context Locked: ' : '业务上下文已锁定：' }}
          </span>
          <span class="text-[#0d99ff] font-bold">{{ lockedTypeName }}</span>
          <span class="text-slate-400">
            {{ store.currentLocale === 'en' ? '(Constrained by external integration)' : '（当前任务由外部系统指定，不可跨主体创建）' }}
          </span>
        </div>
      </a-alert>

      <!-- 第一栏：新建空白画布 (Figma 画布风格可视化效果展示卡片) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-800">
              <span class="text-red-500 mr-1">*</span>
              {{ store.currentLocale === 'en' ? '1. Blank Canvas' : '1. 新建空白画布' }}
            </span>
            <span class="text-[11px] text-slate-400 font-normal">
              {{ store.currentLocale === 'en' ? 'Design from scratch with infinite canvas' : '从零自由编排 · 支持无限画布扩展' }}
            </span>
          </div>
          <span class="text-[11px] text-blue-500 font-medium flex items-center gap-1">
            <Sparkles class="w-3 h-3 text-blue-500" />
            Figma 画板体验
          </span>
        </div>

        <div
          class="figma-card figma-hero-card cursor-pointer transition-all duration-200 relative overflow-hidden"
          :class="{ 'card-is-active': selectedMode === 'blank' }"
          @click="selectBlankMode"
        >
          <!-- 选中勾选指示徽标 -->
          <div v-if="selectedMode === 'blank'" class="figma-check-badge">
            <Check class="w-3 h-3 text-white stroke-[3]" />
          </div>

          <div class="p-4 flex flex-col md:flex-row items-center gap-4">
            <!-- 左侧：说明与 Figma 风格业务主体切页器 -->
            <div class="flex-1 min-w-0 pr-1">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-[15px] font-bold text-slate-900 tracking-tight">
                  {{ store.currentLocale === 'en' ? 'Blank Canvas' : '新建空白画布' }}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0d99ff] font-semibold border border-blue-200/80">
                  DIY 自由编排
                </span>
              </div>

              <p class="text-[12px] text-slate-500 leading-relaxed m-0 mb-3.5">
                {{ store.currentLocale === 'en'
                  ? 'Start with a verified system profile artboard. Drag, connect and layout custom form components freely starting from page 2.'
                  : '自带所选主体的系统预设基本资料核验页，后续页面在无限网格画布中从零自由拖拽编排。' }}
              </p>

              <!-- Figma 风格主体切页器 Segmented Pills -->
              <div class="pt-2 border-t border-slate-100 flex flex-col gap-1.5" @click.stop>
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold text-slate-600">
                    {{ store.currentLocale === 'en' ? 'Select Profile Type' : '选择业务主体类型' }}
                  </span>
                  <span class="text-[10px] text-slate-400">
                    {{ blankProfileType === 'customer' ? '母案例包含实体与授权代表' : blankProfileType === 'individual' ? '自然人个人尽调' : '独立企业实体' }}
                  </span>
                </div>

                <div class="figma-segmented-group">
                  <button
                    type="button"
                    class="figma-seg-btn"
                    :class="{
                      'active': blankProfileType === 'customer',
                      'disabled': !!store.lockedProfileType && store.lockedProfileType !== 'customer' && store.lockedProfileType !== 'client'
                    }"
                    :disabled="!!store.lockedProfileType && store.lockedProfileType !== 'customer' && store.lockedProfileType !== 'client'"
                    @click="onBlankProfileChange('customer')"
                  >
                    <Users class="w-3.5 h-3.5" />
                    <span>{{ store.currentLocale === 'en' ? 'Customer' : '母案例 (Customer)' }}</span>
                  </button>

                  <button
                    type="button"
                    class="figma-seg-btn"
                    :class="{
                      'active': blankProfileType === 'individual',
                      'disabled': !!store.lockedProfileType && store.lockedProfileType !== 'individual'
                    }"
                    :disabled="!!store.lockedProfileType && store.lockedProfileType !== 'individual'"
                    @click="onBlankProfileChange('individual')"
                  >
                    <UserCheck class="w-3.5 h-3.5" />
                    <span>{{ store.currentLocale === 'en' ? 'Individual' : '个人案例 (Individual)' }}</span>
                  </button>

                  <button
                    type="button"
                    class="figma-seg-btn"
                    :class="{
                      'active': blankProfileType === 'entity',
                      'disabled': !!store.lockedProfileType && store.lockedProfileType !== 'entity'
                    }"
                    :disabled="!!store.lockedProfileType && store.lockedProfileType !== 'entity'"
                    @click="onBlankProfileChange('entity')"
                  >
                    <Building2 class="w-3.5 h-3.5" />
                    <span>{{ store.currentLocale === 'en' ? 'Entity' : '机构案例 (Entity)' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 右侧：Figma 风格无限画布微缩模型展示 -->
            <div class="shrink-0 w-[300px] h-[130px] rounded-xl border border-slate-200/90 bg-[#f8fafc] relative overflow-hidden flex items-center justify-center p-3 select-none figma-canvas-viewport shadow-inner">
              <!-- Figma 点阵背景 (Dot Grid) -->
              <div class="figma-dot-grid absolute inset-0"></div>

              <!-- Figma 左上角缩放标签 -->
              <div class="absolute top-1.5 left-2 z-20 flex items-center gap-1 text-[8px] font-mono text-slate-400 bg-white/80 px-1 py-0.5 rounded border border-slate-200/60 backdrop-blur-xs">
                <Grid class="w-2.5 h-2.5 text-slate-400" />
                <span>100% · Canvas</span>
              </div>

              <!-- 仿真画板 01：系统预设资料 (Figma Frame 风格) -->
              <div class="relative z-10 w-[96px] h-[98px] rounded-lg bg-white border border-slate-300 shadow-sm p-1.5 flex flex-col justify-between figma-artboard">
                <!-- Figma Frame 头部 -->
                <div>
                  <div class="flex items-center justify-between pb-1 border-b border-slate-100 mb-1">
                    <span class="text-[8px] font-bold font-mono text-slate-600">01</span>
                    <span
                      class="text-[7px] px-1 py-0.2 rounded font-semibold leading-none"
                      :class="blankProfileType === 'individual' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-blue-50 text-blue-600 border border-blue-200/60'"
                    >
                      {{ blankProfileType === 'customer' ? '母案例资料' : blankProfileType === 'individual' ? '个人凭证' : '机构执照' }}
                    </span>
                  </div>
                  <div class="h-1.5 w-12 bg-slate-200 rounded-xs mb-1"></div>
                  <div class="h-1 w-full bg-slate-100 rounded-xs mb-0.5"></div>
                  <div class="h-1 w-14 bg-slate-100 rounded-xs mb-1"></div>
                  <div class="flex gap-1">
                    <div class="h-1.5 w-5 bg-blue-100 rounded-xs"></div>
                    <div class="h-1.5 w-7 bg-slate-100 rounded-xs"></div>
                  </div>
                </div>
                <div class="text-[7px] text-slate-400 font-mono flex items-center justify-between pt-0.5 border-t border-slate-50">
                  <span>只读核验</span>
                  <Lock class="w-2 h-2 text-slate-300" />
                </div>
              </div>

              <!-- 连接流动箭头 & 贝塞尔路径指示 -->
              <div class="relative z-10 mx-1 flex flex-col items-center justify-center">
                <div class="w-5 h-[1.5px] bg-[#0d99ff] relative">
                  <div class="absolute -right-1 -top-[3.5px] w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#0d99ff]"></div>
                </div>
                <span class="text-[7px] text-[#0d99ff] font-mono mt-0.5">Next</span>
              </div>

              <!-- 仿真画板 02：空白可拖拽编排画板 (Figma 选中蓝框与 4 角控制点) -->
              <div class="relative z-10 w-[96px] h-[98px] rounded-lg bg-white border-2 border-[#0d99ff] shadow-md p-1.5 flex flex-col justify-between figma-artboard-active">
                <!-- Figma 经典选中 4 角锚点 (Corner Resize Handles) -->
                <div class="figma-anchor -top-1 -left-1"></div>
                <div class="figma-anchor -top-1 -right-1"></div>
                <div class="figma-anchor -bottom-1 -left-1"></div>
                <div class="figma-anchor -bottom-1 -right-1"></div>

                <!-- 画板 Frame 标题 -->
                <div>
                  <div class="flex items-center justify-between pb-1 border-b border-blue-100 mb-1">
                    <span class="text-[8px] font-bold font-mono text-[#0d99ff]">02 空白</span>
                    <span class="text-[7px] px-1 py-0.2 rounded font-semibold bg-blue-50 text-[#0d99ff] leading-none">
                      自由编排
                    </span>
                  </div>
                  <!-- 拖拽插槽指示槽 -->
                  <div class="h-8 rounded border border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-center gap-0.5">
                    <Plus class="h-3 w-3 text-[#0d99ff]" />
                    <span class="text-[7px] text-blue-500 font-medium">拖入组件</span>
                  </div>
                </div>

                <div class="text-[7px] text-slate-400 text-center font-mono">
                  自定义业务字段
                </div>
              </div>

              <!-- Figma 协作光标 (Multiplayer Cursor) -->
              <div class="absolute right-4 bottom-2 z-20 flex items-center gap-0.5 pointer-events-none figma-cursor">
                <MousePointer2 class="w-3.5 h-3.5 text-purple-600 fill-purple-600 drop-shadow-xs" />
                <span class="text-[8px] bg-purple-600 text-white font-medium px-1 py-0.2 rounded-xs leading-none shadow-xs">
                  Designer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二栏：选择场景模板 (Figma 社区模板卡片风格) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-800">
              <span class="text-red-500 mr-1">*</span>
              {{ store.currentLocale === 'en' ? '2. Scenario Templates' : '2. 选择场景模板' }}
            </span>
            <span class="text-[11px] text-slate-400 font-normal">
              {{ store.currentLocale === 'en' ? 'Standard KYC compliance forms with ready-to-use workflows' : '官方预置合规 KYC 标准问卷 · 开箱即用' }}
            </span>
          </div>
          <span class="text-[11px] text-slate-400">共 3 套专业合规模板</span>
        </div>

        <a-grid :cols="{ xs: 1, sm: 3 }" :col-gap="12" :row-gap="12">
          <!-- 模板 1：客户母案例 KYC 模板 -->
          <a-grid-item>
            <div
              class="figma-card figma-template-card cursor-pointer transition-all duration-200 h-full flex flex-col relative overflow-hidden"
              :class="[
                selectedMode === 'template' && selectedTemplateKey === 'kyc-customer' ? 'card-is-active' : '',
                store.lockedProfileType && store.lockedProfileType !== 'customer' && store.lockedProfileType !== 'client' ? 'card-is-disabled' : ''
              ]"
              @click="selectTemplate('kyc-customer', 'customer')"
            >
              <!-- 选中勾选指示徽标 -->
              <div v-if="selectedMode === 'template' && selectedTemplateKey === 'kyc-customer'" class="figma-check-badge">
                <Check class="w-3 h-3 text-white stroke-[3]" />
              </div>

              <!-- 顶部 Figma 风格模板视觉预览 Thumbnail Banner -->
              <div class="h-[84px] bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/40 relative border-b border-slate-200/80 p-2 flex items-center justify-center overflow-hidden">
                <div class="figma-dot-grid absolute inset-0 opacity-40"></div>
                <!-- 微型多页连接示意 -->
                <div class="relative z-10 flex items-center gap-1.5">
                  <div class="w-[60px] h-[58px] bg-white rounded border border-blue-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-blue-600">01 实体核验</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1 w-6 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-blue-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">02 控股股东</span>
                    <div class="h-1 bg-blue-100 rounded-xs"></div>
                    <div class="h-1 w-8 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-blue-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">03 授权声明</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1.5 w-5 bg-blue-200 rounded-xs"></div>
                  </div>
                </div>
              </div>

              <!-- 下方详细信息 -->
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[13px] font-bold text-slate-900">母案例 KYC 模板</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-blue-50 text-[#0d99ff] border border-blue-200/60">
                      母案例
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed m-0 mb-2 line-clamp-2">
                    涵盖企业统一社会信用代码、注册地址、授权代表与法定签署声明等。
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span class="text-[#0d99ff] font-mono font-medium">SG_CDD_Customer</span>
                  <span class="text-slate-400">3 页流转</span>
                </div>
              </div>
            </div>
          </a-grid-item>

          <!-- 模板 2：个人案例 KYC 模板 -->
          <a-grid-item>
            <div
              class="figma-card figma-template-card cursor-pointer transition-all duration-200 h-full flex flex-col relative overflow-hidden"
              :class="[
                selectedMode === 'template' && selectedTemplateKey === 'kyc-individual' ? 'card-is-active' : '',
                store.lockedProfileType && store.lockedProfileType !== 'individual' ? 'card-is-disabled' : ''
              ]"
              @click="selectTemplate('kyc-individual', 'individual')"
            >
              <!-- 选中勾选指示徽标 -->
              <div v-if="selectedMode === 'template' && selectedTemplateKey === 'kyc-individual'" class="figma-check-badge">
                <Check class="w-3 h-3 text-white stroke-[3]" />
              </div>

              <!-- 顶部 Figma 风格模板视觉预览 Thumbnail Banner -->
              <div class="h-[84px] bg-gradient-to-br from-emerald-50/80 via-slate-50 to-emerald-50/40 relative border-b border-slate-200/80 p-2 flex items-center justify-center overflow-hidden">
                <div class="figma-dot-grid absolute inset-0 opacity-40"></div>
                <!-- 微型多页连接示意 -->
                <div class="relative z-10 flex items-center gap-1.5">
                  <div class="w-[60px] h-[58px] bg-white rounded border border-emerald-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-emerald-600">01 个人证件</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1 w-6 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">02 就业来源</span>
                    <div class="h-1 bg-emerald-100 rounded-xs"></div>
                    <div class="h-1 w-8 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">03 电子签名</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1.5 w-6 bg-emerald-200 rounded-xs"></div>
                  </div>
                </div>
              </div>

              <!-- 下方详细信息 -->
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[13px] font-bold text-slate-900">个人案例 KYC 模板</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      个人成员
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed m-0 mb-2 line-clamp-2">
                    涵盖身份证件/护照、国籍、就业收入状况、资金来源合规声明与手写签名。
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span class="text-emerald-600 font-mono font-medium">SG_CDD_Individual</span>
                  <span class="text-slate-400">3 页流转</span>
                </div>
              </div>
            </div>
          </a-grid-item>

          <!-- 模板 3：机构案例 KYC 模板 -->
          <a-grid-item>
            <div
              class="figma-card figma-template-card cursor-pointer transition-all duration-200 h-full flex flex-col relative overflow-hidden"
              :class="[
                selectedMode === 'template' && selectedTemplateKey === 'kyc-entity' ? 'card-is-active' : '',
                store.lockedProfileType && store.lockedProfileType !== 'entity' ? 'card-is-disabled' : ''
              ]"
              @click="selectTemplate('kyc-entity', 'entity')"
            >
              <!-- 选中勾选指示徽标 -->
              <div v-if="selectedMode === 'template' && selectedTemplateKey === 'kyc-entity'" class="figma-check-badge">
                <Check class="w-3 h-3 text-white stroke-[3]" />
              </div>

              <!-- 顶部 Figma 风格模板视觉预览 Thumbnail Banner -->
              <div class="h-[84px] bg-gradient-to-br from-indigo-50/80 via-slate-50 to-indigo-50/40 relative border-b border-slate-200/80 p-2 flex items-center justify-center overflow-hidden">
                <div class="figma-dot-grid absolute inset-0 opacity-40"></div>
                <!-- 微型多页连接示意 -->
                <div class="relative z-10 flex items-center gap-1.5">
                  <div class="w-[60px] h-[58px] bg-white rounded border border-indigo-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-indigo-600">01 注册登记</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1 w-6 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">02 经营场所</span>
                    <div class="h-1 bg-indigo-100 rounded-xs"></div>
                    <div class="h-1 w-8 bg-slate-100 rounded-xs"></div>
                  </div>
                  <ArrowRight class="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                  <div class="w-[60px] h-[58px] bg-white rounded border border-slate-200 shadow-2xs p-1 flex flex-col justify-between">
                    <span class="text-[6.5px] font-bold text-slate-700">03 法人签章</span>
                    <div class="h-1 bg-slate-200 rounded-xs"></div>
                    <div class="h-1.5 w-6 bg-indigo-200 rounded-xs"></div>
                  </div>
                </div>
              </div>

              <!-- 下方详细信息 -->
              <div class="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[13px] font-bold text-slate-900">机构案例 KYC 模板</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                      机构成员
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-relaxed m-0 mb-2 line-clamp-2">
                    包含企业工商登记号、注册国家、经营地址、授权代表核验与法人签章。
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span class="text-indigo-600 font-mono font-medium">SG_CDD_Entity</span>
                  <span class="text-slate-400">3 页流转</span>
                </div>
              </div>
            </div>
          </a-grid-item>
        </a-grid>
      </div>

      <!-- 第三栏：表单基础信息配置 (Figma 风格输入框) -->
      <div class="pt-3 border-t border-slate-100">
        <a-form :model="formModel" layout="vertical" size="small">
          <a-form-item :label="store.currentLocale === 'en' ? 'Form Name' : '表单名称'" class="mb-3">
            <a-input
              ref="titleInputRef"
              v-model="formModel.title"
              :placeholder="currentTitlePlaceholder"
              allow-clear
              class="figma-input"
              @keydown.enter="handleConfirm"
            />
          </a-form-item>

          <a-form-item :label="store.currentLocale === 'en' ? 'Form Description' : '表单描述'" class="mb-0">
            <a-textarea
              v-model="formModel.description"
              :placeholder="currentDescPlaceholder"
              allow-clear
              class="figma-input"
              :auto-size="{ minRows: 2, maxRows: 3 }"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="flex items-center justify-between">
        <div class="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :class="selectedMode === 'blank' ? 'bg-[#0d99ff]' : 'bg-emerald-500'"></span>
          <span>当前将创建：</span>
          <span class="font-bold text-slate-700">
            {{ selectedMode === 'blank'
              ? (blankProfileType === 'customer' ? '母案例空白画布' : blankProfileType === 'individual' ? '个人案例空白画布' : '机构案例空白画布')
              : (selectedTemplateKey === 'kyc-customer' ? '母案例 KYC 模板' : selectedTemplateKey === 'kyc-individual' ? '个人案例 KYC 模板' : '机构案例 KYC 模板')
            }}
          </span>
        </div>

        <div class="flex items-center gap-2.5">
          <a-button class="figma-btn-ghost" @click="handleCancel">
            {{ store.currentLocale === 'en' ? 'Cancel' : '取消' }}
          </a-button>
          <a-button type="primary" class="figma-btn-primary" @click="handleConfirm">
            {{ store.currentLocale === 'en' ? 'Create Canvas' : '立即创建' }}
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import type { ProfileType, FormSchema } from '@/types/schema';
import {
  store,
  createNewCanvas,
  loadSchema,
  generateFormId,
  establishBaseline,
  syncUrlParams
} from '@/core/store';
import {
  kycCustomerTemplate,
  kycIndividualTemplate,
  kycEntityTemplate
} from '@/templates/recommend';
import {
  Building2,
  UserCheck,
  Users,
  Lock,
  Plus,
  ArrowRight,
  Check,
  Grid,
  MousePointer2,
  Sparkles
} from '@lucide/vue';
import { Message } from '@arco-design/web-vue';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(['close', 'update:visible', 'created']);

const modalVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val);
    if (!val) emit('close');
  }
});

// 选择模式：'blank' 空白自建 / 'template' 套用模板
const selectedMode = ref<'blank' | 'template'>('blank');

// 空白模式下的主体类型
const blankProfileType = ref<ProfileType>('customer');

// 模板模式下的选定模板
const selectedTemplateKey = ref<'kyc-customer' | 'kyc-individual' | 'kyc-entity'>('kyc-customer');
const templateProfileType = ref<ProfileType>('customer');

// 表单信息
const formModel = reactive({
  title: '',
  description: ''
});

const titleInputRef = ref<any>(null);

const defaultMetaMap: Record<string, { title: string; desc: string }> = {
  customer: {
    title: 'SG_CDD_Customer(2026)',
    desc: '客户母案例专用KYC问卷，包含主体与授权代表合规尽调。'
  },
  client: {
    title: 'SG_CDD_Customer(2026)',
    desc: '客户母案例专用KYC问卷，包含主体与授权代表合规尽调。'
  },
  individual: {
    title: 'SG_CDD_Individual(2026)',
    desc: '个人成员专用KYC问卷，包含个人基础身份与财务背景凭证。'
  },
  entity: {
    title: 'SG_CDD_Entity(2026)',
    desc: '企业实体专用KYC问卷，包含企业注册信息与法人授权签署。'
  }
};

const lockedTypeName = computed(() => {
  const t = store.lockedProfileType;
  if (t === 'individual') return store.currentLocale === 'en' ? 'Individual' : '个人案例 (Individual)';
  if (t === 'entity') return store.currentLocale === 'en' ? 'Entity' : '机构案例 (Entity)';
  return store.currentLocale === 'en' ? 'Customer' : '母案例 (Customer)';
});

const activeProfileType = computed<ProfileType>(() => {
  if (selectedMode.value === 'blank') {
    return blankProfileType.value;
  }
  return templateProfileType.value;
});

const currentTitlePlaceholder = computed(() => {
  const norm = activeProfileType.value === 'client' ? 'customer' : activeProfileType.value;
  const example = defaultMetaMap[norm]?.title || 'SG_CDD_Customer(2026)';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单名称，留空默认为：${example}`;
});

const currentDescPlaceholder = computed(() => {
  const norm = activeProfileType.value === 'client' ? 'customer' : activeProfileType.value;
  const example = defaultMetaMap[norm]?.desc || '客户母案例专用KYC问卷';
  return store.currentLocale === 'en'
    ? `e.g. ${example}`
    : `请输入表单描述，留空默认为：${example}`;
});

function selectBlankMode() {
  selectedMode.value = 'blank';
}

function onBlankProfileChange(val: ProfileType) {
  blankProfileType.value = val;
  selectedMode.value = 'blank';
}

function selectTemplate(tplKey: 'kyc-customer' | 'kyc-individual' | 'kyc-entity', pType: ProfileType) {
  if (store.lockedProfileType && store.lockedProfileType !== pType) return;
  selectedMode.value = 'template';
  selectedTemplateKey.value = tplKey;
  templateProfileType.value = pType;
}

watch(
  () => props.visible,
  val => {
    if (val) {
      if (store.lockedProfileType) {
        const locked = store.lockedProfileType === 'client' ? 'customer' : store.lockedProfileType;
        blankProfileType.value = locked;
        templateProfileType.value = locked;
        if (locked === 'individual') selectedTemplateKey.value = 'kyc-individual';
        else if (locked === 'entity') selectedTemplateKey.value = 'kyc-entity';
        else selectedTemplateKey.value = 'kyc-customer';
      } else {
        blankProfileType.value = 'customer';
        templateProfileType.value = 'customer';
        selectedTemplateKey.value = 'kyc-customer';
      }
      selectedMode.value = 'blank';
      formModel.title = '';
      formModel.description = '';
      nextTick(() => {
        titleInputRef.value?.focus();
      });
    }
  }
);

function handleCancel() {
  modalVisible.value = false;
  emit('close');
}

function handleConfirm() {
  const normType = activeProfileType.value === 'client' ? 'customer' : activeProfileType.value;
  const defaultMeta = defaultMetaMap[normType] || defaultMetaMap.customer;
  const trimmedTitle = formModel.title.trim() || defaultMeta.title;
  const trimmedDesc = formModel.description.trim() || defaultMeta.desc;

  if (selectedMode.value === 'blank') {
    createNewCanvas({
      title: trimmedTitle,
      description: trimmedDesc,
      profileType: normType
    });
  } else {
    let templateSource: FormSchema = kycCustomerTemplate;
    let tplKey = 'kyc-customer';
    if (selectedTemplateKey.value === 'kyc-individual') {
      templateSource = kycIndividualTemplate;
      tplKey = 'kyc-individual';
    } else if (selectedTemplateKey.value === 'kyc-entity') {
      templateSource = kycEntityTemplate;
      tplKey = 'kyc-entity';
    }

    const clonedSchema: FormSchema = JSON.parse(JSON.stringify(templateSource));
    const formId = generateFormId(normType, 'template');
    const now = Date.now();

    clonedSchema.meta.title = trimmedTitle;
    clonedSchema.meta.description = trimmedDesc;
    clonedSchema.meta.profileType = normType;
    clonedSchema.meta.source = 'template';
    clonedSchema.meta.templateKey = tplKey;
    clonedSchema.meta.formId = formId;
    clonedSchema.meta.serialNo = formId;
    clonedSchema.meta.createdAt = now;

    loadSchema(clonedSchema);
    store.meta.title = trimmedTitle;
    store.meta.description = trimmedDesc;
    store.meta.profileType = normType;
    store.meta.source = 'template';
    store.meta.templateKey = tplKey;
    store.meta.formId = formId;
    store.meta.serialNo = formId;
    store.meta.createdAt = now;
    store.activeTemplateKey = tplKey;

    establishBaseline();
    syncUrlParams(formId);
  }

  Message.success(store.currentLocale === 'en' ? 'Form created successfully' : '表单画布创建成功');
  modalVisible.value = false;
  emit('created');
  emit('close');
}
</script>

<style scoped>
/* Figma 质感卡片基础 */
.figma-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  position: relative;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.figma-card:hover {
  border-color: #94bfff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08);
}

/* 激活状态：Figma 经典高亮蓝边与轻柔底色 */
.card-is-active {
  border-color: #0d99ff !important;
  background-color: #f8fbff !important;
  box-shadow: 0 0 0 1px #0d99ff, 0 8px 24px -4px rgba(13, 153, 255, 0.15) !important;
}

/* 选中角标 */
.figma-check-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0d99ff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  box-shadow: 0 2px 6px rgba(13, 153, 255, 0.4);
  animation: figmaBadgePop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes figmaBadgePop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* 禁用状态 */
.card-is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
  filter: grayscale(0.5);
}

/* Figma 点阵背景 (Dot Grid) */
.figma-dot-grid {
  background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px);
  background-size: 10px 10px;
  opacity: 0.35;
}

/* Figma 经典 4 角控制手柄 (Resize Anchors) */
.figma-anchor {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #ffffff;
  border: 1.5px solid #0d99ff;
  border-radius: 1px;
  z-index: 25;
}

/* Figma 协作光标浮层微动画 */
.figma-cursor {
  animation: figmaCursorHover 3s ease-in-out infinite;
}

@keyframes figmaCursorHover {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-4px, -3px); }
}

/* Figma Segmented Control */
.figma-segmented-group {
  display: flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 8px;
  gap: 3px;
}

.figma-seg-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 8px;
  font-size: 11.5px;
  font-weight: 500;
  color: #475569;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.figma-seg-btn:hover:not(.disabled) {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.6);
}

.figma-seg-btn.active {
  background: #ffffff;
  color: #0d99ff;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.figma-seg-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Figma 风格按钮 */
.figma-btn-ghost {
  border-radius: 8px;
  font-weight: 500;
  color: #475569;
}

.figma-btn-primary {
  border-radius: 8px;
  background: #0d99ff !important;
  border-color: #0d99ff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(13, 153, 255, 0.25);
  transition: all 0.15s ease;
}

.figma-btn-primary:hover {
  background: #0085e6 !important;
  border-color: #0085e6 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 153, 255, 0.35);
}
</style>
