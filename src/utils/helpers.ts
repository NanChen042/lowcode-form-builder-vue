/**
 * 读取多选默认值，兼容历史逗号字符串和新的 JSON 数组格式
 */
export function parseMultiValue(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean);
    }
  } catch {
    // 兼容旧数据：option_1,option_2
  }

  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

const COMPONENT_HEIGHT_MAP: Record<string, number> = {
  input: 88,
  select: 88,
  date: 88,
  country: 88,
  nationality: 88,
  textarea: 124,
  radio: 108,
  checkbox: 108,
  signature: 270,
  alert: 110
};

export function syncDragPlaceholderHeight(type?: string | null) {
  if (!type) {
    document.body.style.removeProperty('--drag-placeholder-height');
    return;
  }
  const height = COMPONENT_HEIGHT_MAP[type] || 88;
  document.body.style.setProperty('--drag-placeholder-height', `${height}px`);
}

/**
 * 多选默认值统一序列化为 JSON 数组
 */
export function stringifyMultiValue(values: (string | number)[]): string {
  return JSON.stringify(Array.from(new Set(values.filter(Boolean).map(String))));
}

/**
 * JSON 语法高亮实现（仿 One Dark 风格）
 */
export function highlightJSON(jsonStr: string): string {
  const str = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return str.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      let cls = 'text-[#d19a66]'; // number/boolean (orange)
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-[#e06c75]'; // key (red)
        } else {
          cls = 'text-[#98c379]'; // string (green)
        }
      } else if (/null/.test(match)) {
        cls = 'text-[#5c6370] italic'; // null (grey italic)
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type EdgeType = 'top' | 'bottom' | 'left' | 'right';

/**
 * 获取连接锚点的具体坐标
 */
export function getEdgePoint(rect: Rect, edge: EdgeType): { x: number; y: number } {
  const { x, y, w, h } = rect;
  switch (edge) {
    case 'top':
      return { x: x + w / 2, y };
    case 'bottom':
      return { x: x + w / 2, y: y + h };
    case 'left':
      return { x, y: y + h / 2 };
    case 'right':
      return { x: x + w, y: y + h / 2 };
    default:
      return { x: x + w, y: y + h / 2 };
  }
}

/**
 * 获取贝塞尔曲线的控制点
 */
export function getControlPoint(
  x: number,
  y: number,
  edge: EdgeType,
  offset: number
): { x: number; y: number } {
  switch (edge) {
    case 'top':
      return { x, y: y - offset };
    case 'bottom':
      return { x, y: y + offset };
    case 'left':
      return { x: x - offset, y };
    case 'right':
      return { x: x + offset, y };
    default:
      return { x: x + offset, y };
  }
}

/**
 * 智能计算画板之间的出入边
 */
export function getSmartEdges(
  rectA: Rect,
  rectB: Rect
): { sourceEdge: EdgeType; targetEdge: EdgeType } {
  const centerA = { x: rectA.x + rectA.w / 2, y: rectA.y + rectA.h / 2 };
  const centerB = { x: rectB.x + rectB.w / 2, y: rectB.y + rectB.h / 2 };

  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;

  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle < 0) angle += 360;

  let sourceEdge: EdgeType = 'right';
  let targetEdge: EdgeType = 'left';

  if (angle >= 45 && angle < 135) {
    sourceEdge = 'bottom';
    targetEdge = 'top';
  } else if (angle >= 135 && angle < 225) {
    sourceEdge = 'left';
    targetEdge = 'right';
  } else if (angle >= 225 && angle < 315) {
    sourceEdge = 'top';
    targetEdge = 'bottom';
  }
  return { sourceEdge, targetEdge };
}
