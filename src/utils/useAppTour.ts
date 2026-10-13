import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { store, focusOnPage, resetCanvasView } from '@/core/store';
import { Message } from '@arco-design/web-vue';

let driverInstance: Driver | null = null;

export function getTourSteps(isEn: boolean): DriveStep[] {
  return [
    {
      element: '#tour-material-sidebar',
      popover: {
        title: isEn ? '1. Materials & Templates' : '1. 物料库与场景模板',
        description: isEn
          ? 'Access all form materials here. Click "Create from Template" to load preset KYC questionnaires, or click / drag fields from Basic Inputs and Business Components into your canvas.'
          : '左侧汇集表单全套构建物料：点击“从场景模板创建”可一键套用预设的 KYC 问卷；在下方“基础输入”与“业务组件”库中，可直接点击或拖拽字段添加到右侧画布中。',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-canvas-viewport',
      popover: {
        title: isEn ? '2. Infinite Canvas & Navigation' : '2. 无限画布与自由漫游',
        description: isEn
          ? 'The center is an infinite visual workspace: hold [Ctrl + Left Drag] or hold [Middle Mouse] to pan the canvas; scroll [Mouse Wheel] to zoom smoothly and arrange multi-page form workflows.'
          : '中间为可视化无限设计画布：按住【Ctrl + 鼠标左键拖拽】或直接按住【鼠标中键】可自由平移画布；滑动【鼠标滚轮】可平滑缩放视图，支持在无限空间中自由编排多画板。',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-first-page-frame',
      popover: {
        title: isEn ? '3. Basic Information (System Preset)' : '3. 基本资料（系统预设只读）',
        description: isEn
          ? 'Page 1 is preset "Basic Information": this section is system-generated and read-only, and cannot be modified. Customers verify it before proceeding to subsequent custom form pages.'
          : '第 1 个画板为系统预设的“基本资料”：此部分由系统自动录入，属于只读核验信息，不可更改；终端客户在填表时仅供核对确认，后续页面才是真正自定义动态收集的表单内容。',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-property-panel',
      popover: {
        title: isEn ? '4. Properties & Configuration' : '4. 属性配置与规则设置',
        description: isEn
          ? 'Configure form and field settings. When no element is selected, edit form name/description and toggle bilingual mode. Clicking any field in canvas reveals its label, placeholder, validation, and options.'
          : '右侧为当前选中的配置面板：未选中组件时，可在此修改表单名称/描述，并切换中英文双语模式；当点击画布中的具体字段时，将自动展开标题、必填校验、选项配置及联动规则。',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '#tour-preview-btn',
      popover: {
        title: isEn ? '5. Mobile Simulator Preview' : '5. 手机端真机模拟预览',
        description: isEn
          ? 'Click "Preview" anytime to test the actual respondent experience in an iPhone mockup, including page transitions, validation errors, and clean JSON Schema.'
          : '随时点击顶部的“预览”按钮，将在 iPhone 仿真手机壳中模拟终端用户的真实填表体验，实时测试字段必填校验、多页流转逻辑以及底层低代码 Schema。',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-deploy-btn',
      popover: {
        title: isEn ? '6. Publish & Frontend Deployment' : '6. 发布表单与前台交付',
        description: isEn
          ? 'Once form design is ready, click "Publish Form" to generate a standalone form link, QR code, or export low-code Schema. After publishing, you can configure and send the DIY form tasks directly in your frontend portal!'
          : '表单设计就绪后，点击“发布表单”，即可一键生成对外填表专属链接与二维码，或导出低代码 Schema 数据，快速集成上线。导出发布后就可以在前台配置发送对应的 DIY 表单了！',
        side: 'bottom',
        align: 'end'
      }
    }
  ];
}

export function startAppTour() {
  // If sidebars are hidden, ensure they are visible during tour
  if (!store.leftSidebarVisible) {
    store.leftSidebarVisible = true;
  }
  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }

  const isEn = store.currentLocale === 'en';

  if (typeof document !== 'undefined') {
    document.body.classList.add('tour-active');
  }

  driverInstance = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    disableActiveInteraction: true,
    overlayColor: 'rgba(15, 23, 42, 0.65)',
    stageRadius: 8,
    stagePadding: 6,
    nextBtnText: isEn ? 'Next →' : '下一步 →',
    prevBtnText: isEn ? '← Back' : '← 上一步',
    doneBtnText: isEn ? 'Start Now' : '开始使用',
    progressText: isEn ? 'Step {{current}} of {{total}}' : '第 {{current}} / {{total}} 步',
    steps: getTourSteps(isEn),
    onHighlightStarted: (_el, _step, opts) => {
      if (opts.state.activeIndex === 1) {
        resetCanvasView({ duration: 0 });
      } else if (opts.state.activeIndex === 2 && store.pages.length > 0) {
        focusOnPage(store.pages[0].id, { forTour: true, duration: 0 });
      }
    },
    onPopoverRender: (popoverDOM) => {
      const footer = popoverDOM.footer;
      if (footer && !footer.querySelector('.driver-never-show-btn')) {
        const neverBtn = document.createElement('button');
        neverBtn.className = 'driver-never-show-btn';
        neverBtn.type = 'button';
        neverBtn.innerText = isEn ? "Don't show again" : '不再提示';
        neverBtn.title = isEn ? "Never show tour automatically on startup" : '以后进入页面不再自动弹出新手指引';
        neverBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          localStorage.setItem('diy_form_tour_never_show', 'true');
          localStorage.setItem('diy_form_tour_shown', 'true');
          if (driverInstance) {
            driverInstance.destroy();
            driverInstance = null;
          }
          Message.info(
            isEn
              ? 'Tour closed. You can restart it anytime from the top-right Settings.'
              : '已关闭新手指引，后续可随时在右上角设置中重新开启'
          );
        });
        footer.insertBefore(neverBtn, footer.firstChild);
      }
    },
    onDestroyStarted: () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('tour-active');
      }
      localStorage.setItem('diy_form_tour_shown', 'true');
      if (driverInstance) {
        driverInstance.destroy();
        driverInstance = null;
      }
    }
  });

  driverInstance.drive();
}

export function checkAutoStartTour() {
  if (typeof window === 'undefined') return;
  const neverShow = localStorage.getItem('diy_form_tour_never_show');
  if (neverShow === 'true') return;

  const hasShown = localStorage.getItem('diy_form_tour_shown');
  if (hasShown === 'true') return;

  setTimeout(() => {
    startAppTour();
  }, 800);
}
