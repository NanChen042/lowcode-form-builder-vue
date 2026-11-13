import { nextTick } from 'vue';
import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { store, isRisk, focusOnPage, selectPage, resetCanvasView, closeTranslationWorkspace } from '@/core/store';
import { t, type Locale } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';

let driverInstance: Driver | null = null;

export function getRiskTourSteps(locale?: Locale): DriveStep[] {
  const hasPageHeader = typeof document !== 'undefined' ? Boolean(document.querySelector('#tour-risk-page-header')) : true;
  const pageHeaderTarget = hasPageHeader ? '#tour-risk-page-header' : '#tour-first-page-frame';

  const hasGroupHeader = typeof document !== 'undefined' ? Boolean(document.querySelector('#tour-risk-first-group-header')) : true;
  const groupTarget = hasGroupHeader
    ? '#tour-risk-first-group-header'
    : (typeof document !== 'undefined' && document.querySelector('#tour-risk-first-group') ? '#tour-risk-first-group' : '#tour-first-page-frame');

  const steps: DriveStep[] = [
    {
      element: '#tour-risk-component-item',
      popover: {
        title: t('tour.risk.step1Title', locale),
        description: t('tour.risk.step1Desc', locale),
        side: 'right',
        align: 'start'
      }
    },
    {
      element: pageHeaderTarget,
      popover: {
        title: t('tour.risk.step2Title', locale),
        description: t('tour.risk.step2Desc', locale),
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: groupTarget,
      popover: {
        title: t('tour.risk.step3Title', locale),
        description: t('tour.risk.step3Desc', locale),
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-translation-btn',
      popover: {
        title: t('tour.risk.step4Title', locale),
        description: t('tour.risk.step4Desc', locale),
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-deploy-btn',
      popover: {
        title: t('tour.risk.step5Title', locale),
        description: t('tour.risk.step5Desc', locale),
        side: 'bottom',
        align: 'end'
      }
    }
  ];
  return steps.filter(step => typeof step.element !== 'string' || document.querySelector(step.element));
}

export function getTourSteps(localeOrIsEn?: Locale | boolean): DriveStep[] {
  const locale: Locale | undefined = typeof localeOrIsEn === 'boolean'
    ? (localeOrIsEn ? 'en' : 'zh')
    : localeOrIsEn;

  if (isRisk.value) {
    return getRiskTourSteps(locale);
  }

  return [
    {
      element: '#tour-activity-bar',
      popover: {
        title: t('tour.step1Title', locale),
        description: t('tour.step1Desc', locale),
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-template-panel',
      popover: {
        title: t('tour.step2Title', locale),
        description: t('tour.step2Desc', locale),
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-component-panel',
      popover: {
        title: t('tour.step3Title', locale),
        description: t('tour.step3Desc', locale),
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-canvas-viewport',
      popover: {
        title: t('tour.step4Title', locale),
        description: t('tour.step4Desc', locale),
        side: 'top',
        align: 'center'
      }
    },
    {
      element: '#tour-first-page-frame',
      popover: {
        title: t('tour.step5Title', locale),
        description: t('tour.step5Desc', locale),
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '#tour-property-panel',
      popover: {
        title: t('tour.step6Title', locale),
        description: t('tour.step6Desc', locale),
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '#tour-preview-btn',
      popover: {
        title: t('tour.step7Title', locale),
        description: t('tour.step7Desc', locale),
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-deploy-btn',
      popover: {
        title: t('tour.step8Title', locale),
        description: t('tour.step8Desc', locale),
        side: 'bottom',
        align: 'end'
      }
    }
  ];
}

export function cleanupTour() {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('tour-active', 'driver-active', 'driver-fade', 'driver-simple', 'driver-no-scroll');
    document.querySelectorAll('.driver-overlay, .driver-popover, #driver-dummy-element').forEach(el => el.remove());
  }
  sessionStorage.setItem('diy_form_tour_shown_session', 'true');
  localStorage.setItem('diy_form_tour_shown', 'true');
  if (isRisk.value && store.workspaceMode === 'translation') {
    closeTranslationWorkspace({ immediate: true });
  }
  store.sidebarTab = 'components';
  if (driverInstance) {
    try {
      driverInstance.destroy();
    } catch (_) {}
    driverInstance = null;
  }
}

export function startAppTour(initialIndex = 0) {
  cleanupTour();

  if (store.pages.length === 0) {
    Message.info(t('tour.needCanvasMsg'));
    return;
  }

  if (!store.leftSidebarVisible) {
    store.leftSidebarVisible = true;
  }
  if (!store.rightSidebarVisible) {
    store.rightSidebarVisible = true;
  }

  if (typeof document !== 'undefined') {
    document.body.classList.add('tour-active');
  }

  driverInstance = driver({
    popoverClass: 'figma-tour-popover',
    showProgress: true,
    animate: true,
    allowClose: true,
    allowScroll: false,
    smoothScroll: false,
    disableActiveInteraction: false,
    overlayColor: 'rgba(15, 23, 42, 0.65)',
    stageRadius: 8,
    stagePadding: 6,
    nextBtnText: t('tour.nextBtn'),
    prevBtnText: t('tour.prevBtn'),
    doneBtnText: t('tour.doneBtn'),
    progressText: t('tour.progressText'),
    steps: getTourSteps(),
    onHighlightStarted: (_el, _step, opts) => {
      if (isRisk.value) {
        const activeIdx = opts.state.activeIndex;
        if (activeIdx === 0) {
          // 第 1 步：选中组件里的风险评估组件
          if (store.workspaceMode === 'translation') closeTranslationWorkspace({ immediate: true });
          store.sidebarTab = 'components';
          if (!store.leftSidebarVisible) store.leftSidebarVisible = true;
        } else if (activeIdx === 1 || activeIdx === 2) {
          // 第 2 步画布编辑 & 第 3 步分组功能
          if (store.workspaceMode === 'translation') closeTranslationWorkspace({ immediate: true });
          resetCanvasView({ duration: 0 });
        } else if (activeIdx === 3) {
          // 第 4 步翻译管理
        } else if (activeIdx === 4) {
          // 第 5 步：退出翻译管理，切回标准组件页面，聚焦发布
          if (store.workspaceMode === 'translation') {
            closeTranslationWorkspace({ immediate: true });
          }
          store.sidebarTab = 'components';
        }
        nextTick(() => {
          requestAnimationFrame(() => {
            driverInstance?.refresh();
          });
        });
        return;
      }
      const idx = opts.state.activeIndex;
      if (idx === 1) {
        store.sidebarTab = 'templates';
      } else if (idx === 2) {
        store.sidebarTab = 'components';
      } else if (idx === 3) {
        resetCanvasView({ duration: 0 });
      } else if (idx === 4 && store.pages.length > 0) {
        focusOnPage(store.pages[0].id, { forTour: true, popoverWidth: 380, duration: 0 });
        const canvasContainer = document.getElementById('tour-canvas-area');
        if (canvasContainer) {
          canvasContainer.scrollTop = 0;
          canvasContainer.scrollLeft = 0;
        }
        nextTick(() => {
          requestAnimationFrame(() => {
            driverInstance?.refresh();
          });
        });
      } else if (idx === 5 && store.pages.length > 0) {
        if (!store.selectedType) {
          selectPage(store.pages[0].id);
        }
        if (!store.rightSidebarVisible) {
          store.rightSidebarVisible = true;
        }
        nextTick(() => {
          requestAnimationFrame(() => {
            driverInstance?.refresh();
          });
        });
      }
    },
    onHighlighted: (_el, _step, opts) => {
      if (isRisk.value) {
        requestAnimationFrame(() => {
          driverInstance?.refresh();
        });
        return;
      }
      const idx = opts.state.activeIndex;
      if (idx === 4) {
        const canvasContainer = document.getElementById('tour-canvas-area');
        if (canvasContainer) {
          canvasContainer.scrollTop = 0;
          canvasContainer.scrollLeft = 0;
        }
        nextTick(() => {
          requestAnimationFrame(() => {
            driverInstance?.refresh();
          });
        });
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
          cleanupTour();
          Message.info(t('tour.closedMsg'));
        });
        footer.insertBefore(neverBtn, footer.firstChild);
      }
    },
    onDestroyStarted: () => {
      cleanupTour();
    },
    onDestroyed: () => {
      cleanupTour();
    }
  });

  driverInstance.drive(initialIndex);
}

export function checkAutoStartTour(force = false) {
  if (typeof window === 'undefined') return;
  if (store.pages.length === 0) return;

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
