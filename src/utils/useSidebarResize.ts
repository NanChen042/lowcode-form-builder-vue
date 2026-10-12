import { ref } from 'vue';

export interface SidebarResizeOptions {
  getWidth: () => number;
  setWidth: (width: number) => void;
  min: number;
  max: number;
  direction: 'left' | 'right';
}

export function useSidebarResize(options: SidebarResizeOptions) {
  const isResizing = ref(false);

  function startResize(e: MouseEvent) {
    isResizing.value = true;
    const startX = e.clientX;
    const startWidth = options.getWidth();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const rawWidth =
        options.direction === 'right'
          ? startWidth + deltaX
          : startWidth - deltaX;
      const clamped = Math.max(options.min, Math.min(options.max, rawWidth));
      options.setWidth(Math.round(clamped));
    };

    const onMouseUp = () => {
      isResizing.value = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  return {
    isResizing,
    startResize
  };
}
