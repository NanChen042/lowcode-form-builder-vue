import { ref, onBeforeUnmount } from 'vue';

export interface SidebarResizeOptions {
  getWidth: () => number;
  setWidth: (width: number) => void;
  min: number;
  max: number;
  direction: 'left' | 'right';
}

export function useSidebarResize(options: SidebarResizeOptions) {
  const isResizing = ref(false);

  let onMouseMove: ((moveEvent: MouseEvent) => void) | null = null;
  let onMouseUp: (() => void) | null = null;

  function stopResize() {
    isResizing.value = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (onMouseMove) {
      window.removeEventListener('mousemove', onMouseMove);
      onMouseMove = null;
    }
    if (onMouseUp) {
      window.removeEventListener('mouseup', onMouseUp);
      onMouseUp = null;
    }
  }

  function startResize(e: MouseEvent) {
    stopResize();
    isResizing.value = true;
    const startX = e.clientX;
    const startWidth = options.getWidth();

    onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const rawWidth =
        options.direction === 'right'
          ? startWidth + deltaX
          : startWidth - deltaX;
      const clamped = Math.max(options.min, Math.min(options.max, rawWidth));
      options.setWidth(Math.round(clamped));
    };

    onMouseUp = () => {
      stopResize();
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  onBeforeUnmount(() => {
    stopResize();
  });

  return {
    isResizing,
    startResize
  };
}
