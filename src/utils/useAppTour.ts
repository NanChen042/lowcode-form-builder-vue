import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { store, focusOnPage, resetCanvasView } from '@/core/store';
import { t, type Locale } from '@/core/i18n';
import { Message } from '@arco-design/web-vue';

let driverInstance: Driver | null = null;

export function getTourSteps(localeOrIsEn?: Locale | boolean): DriveStep[] {
  const locale: Locale | undefined = typeof localeOrIsEn === 'boolean'
    ? (localeOrIsEn ? 'en' : 'zh')
    : localeOrIsEn;

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
        side: 'bottom',
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
      const idx = opts.state.activeIndex;
      if (idx === 1) {
        store.sidebarTab = 'templates';
      } else if (idx === 2) {
        store.sidebarTab = 'components';
      } else if (idx === 3) {
        resetCanvasView({ duration: 0 });
      } else if (idx === 4 && store.pages.length > 0) {
        focusOnPage(store.pages[0].id, { forTour: true, duration: 0 });
        const canvasContainer = document.getElementById('tour-canvas-area');
        if (canvasContainer) {
          canvasContainer.scrollTop = 0;
          canvasContainer.scrollLeft = 0;
        }
        requestAnimationFrame(() => {
          driverInstance?.refresh();
        });
      }
    },
    onHighlighted: (_el, _step, opts) => {
      const idx = opts.state.activeIndex;
      if (idx === 4) {
        const canvasContainer = document.getElementById('tour-canvas-area');
        if (canvasContainer) {
          canvasContainer.scrollTop = 0;
          canvasContainer.scrollLeft = 0;
        }
        driverInstance?.refresh();
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
