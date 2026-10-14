import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { store, focusOnPage, resetCanvasView } from '@/core/store';
import { t } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';

let driverInstance: Driver | null = null;

export function getTourSteps(isEn: boolean): DriveStep[] {
  return [
    {
      element: '#tour-activity-bar',
      popover: {
        title: isEn ? '1. Sidebar Navigation' : '1. 侧边功能导航',
        description: isEn
          ? 'The leftmost activity bar provides three core workspaces: Scenario Templates (preset questionnaires), Field Components (form inputs), and Page Outline (multi-page flow).'
          : '最左侧为核心功能导航栏，纵向整合三大主功能区：模板库（开箱即用行业问卷）、组件库（表单字段物料）与页面大纲（多画板流程编排）。',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-template-panel',
      popover: {
        title: isEn ? '2. Scenario Templates' : '2. 场景模板库',
        description: isEn
          ? 'Browse prebuilt compliance KYC templates (Customer, Individual, Entity). Click any template to load its full structure in 1-click, or click "Create Blank Canvas" to build from scratch.'
          : '汇集标准合规的 KYC 行业模板（客户案例、个人案例、机构案例）。点击任意模板卡片即可一键载入完整架构，或点击顶部“新建空白画布”从零自定义搭建。',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-component-panel',
      popover: {
        title: isEn ? '3. Field Components' : '3. 字段组件库',
        description: isEn
          ? 'Offers basic and business form fields including Text Inputs, ID Selectors, Dates, Addresses, and Signatures. Click any component or drag it directly into a page on the canvas.'
          : '提供单行输入、数字、证件选择、日期、地址、声明复选及手写签名等多种标准表单物料。支持直接点击字段，或直接拖拽添加至画布对应页面中。',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-canvas-viewport',
      popover: {
        title: isEn ? '4. Main Design Canvas' : '4. 主设计画布',
        description: isEn
          ? 'The central workspace for visual form design: hold [Ctrl + Left Drag] or [Middle Mouse] to pan the canvas; scroll [Mouse Wheel] to zoom smoothly and arrange multi-page flows.'
          : '中央为可视化自由排版画布：按住【Ctrl + 鼠标左键拖拽】或【鼠标中键】可自由平移画布视口；滑动【鼠标滚轮】可平滑缩放视图，支持直观编排多页面联动。',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-first-page-frame',
      popover: {
        title: isEn ? '5. System Preset Information' : '5. 系统预设信息',
        description: isEn
          ? 'The first frame displays system preset data: automatically populated by the host system and locked as read-only for verification. Subsequent pages contain your custom fields.'
          : '首个画板为系统预设核验页：由母系统根据企业或个人档案自动生成并锁定为只读状态，供填表人在填写自定义问卷前核对确认基本信息。后续画板才是真正自定义收集的业务内容。',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-property-panel',
      popover: {
        title: isEn ? '6. Property Panel' : '6. 属性配置面板',
        description: isEn
          ? 'When no element is selected, edit form title, description, and toggle bilingual mode. Clicking any field in the canvas reveals its label, placeholder, validation, and options.'
          : '未选中组件时，可在此设置表单全局名称、描述及中英文双语模式；选中画布中具体字段后，将展开该字段的标题、占位提示、必填校验及选项配置。',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '#tour-preview-btn',
      popover: {
        title: isEn ? '7. Mobile Device Preview' : '7. 移动端真机预览',
        description: isEn
          ? 'Click "Preview" anytime to test the actual respondent experience in an iPhone mockup, including field validations, multi-step navigation, and underlying JSON Schema.'
          : '随时点击顶部的“预览”按钮，将在 iPhone 仿真模型中模拟终端用户的真实填表流程，实时测试表单必填校验、多页流转以及底层低代码 Schema 数据。',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-deploy-btn',
      popover: {
        title: isEn ? '8. Form Publishing & Integration' : '8. 表单发布与交付',
        description: isEn
          ? 'Once form design is ready, click "Publish" to generate a standalone form link and QR code, or export the standard low-code Schema for frontend integration.'
          : '表单设计就绪后，点击“发布表单”，即可一键生成对外填表专属链接与二维码，或导出标准化低代码 Schema 数据，便捷集成至前台业务系统中。',
        side: 'bottom',
        align: 'end'
      }
    }
  ];
}

export function startAppTour(initialIndex = 0) {
  if (driverInstance) {
    try {
      driverInstance.destroy();
    } catch (_) {}
    driverInstance = null;
  }

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
    nextBtnText: t('tour.nextBtn'),
    prevBtnText: t('tour.prevBtn'),
    doneBtnText: t('tour.doneBtn'),
    progressText: t('tour.progressText'),
    steps: getTourSteps(isEn),
    onHighlightStarted: (_el, _step, opts) => {
      const idx = opts.state.activeIndex;
      if (idx === 1) {
        store.sidebarTab = 'templates';
      } else if (idx === 2) {
        store.sidebarTab = 'components';
      } else if (idx === 3) {
        resetCanvasView({ duration: 0 });
      } else if (idx === 4 && store.pages.length > 0) {
        focusOnPage(store.pages[0].id, { forTour: true, duration: 0 });
      }
    },
    onPopoverRender: (popoverDOM) => {
      const footer = popoverDOM.footer;
      if (footer && !footer.querySelector('.driver-never-show-btn')) {
        const neverBtn = document.createElement('button');
        neverBtn.className = 'driver-never-show-btn';
        neverBtn.type = 'button';
        neverBtn.innerText = t('tour.neverShow');
        neverBtn.title = t('tour.neverShowTitle');
        neverBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          localStorage.setItem('diy_form_tour_never_show', 'true');
          sessionStorage.setItem('diy_form_tour_shown_session', 'true');
          if (driverInstance) {
            driverInstance.destroy();
            driverInstance = null;
          }
          Message.info(t('tour.closedMsg'));
        });
        footer.insertBefore(neverBtn, footer.firstChild);
      }
    },
    onDestroyStarted: () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('tour-active');
      }
      sessionStorage.setItem('diy_form_tour_shown_session', 'true');
      if (driverInstance) {
        driverInstance.destroy();
        driverInstance = null;
      }
    }
  });

  driverInstance.drive(initialIndex);
}

export function checkAutoStartTour(force = false) {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const tourParam = urlParams.get('tour');
  if (tourParam === '1' || tourParam === 'true') {
    setTimeout(() => {
      startAppTour();
    }, 500);
    return;
  }

  const neverShow = localStorage.getItem('diy_form_tour_never_show');
  if (neverShow === 'true' && !force) return;

  const hasShown = sessionStorage.getItem('diy_form_tour_shown_session') || localStorage.getItem('diy_form_tour_shown');
  if (hasShown === 'true' && !force) return;

  setTimeout(() => {
    startAppTour();
  }, 600);
}
