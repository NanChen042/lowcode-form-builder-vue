/**
 * 读取多选默认值，兼容历史逗号字符串和新的 JSON 数组格式
 * @param value 原始默认值字符串
 * @returns 解析后的字符串数组
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
  phone: 88,
  email: 88,
  textarea: 124,
  radio: 108,
  checkbox: 108,
  signature: 270,
  alert: 110
};

/**
 * 同步拖拽占位符的高度 CSS 变量
 * @param type 组件类型
 */
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
 * @param values 选项值数组
 * @returns 序列化后的 JSON 字符串
 */
export function stringifyMultiValue(values: (string | number)[]): string {
  return JSON.stringify(Array.from(new Set(values.filter(Boolean).map(String))));
}

/**
 * JSON 语法高亮实现（仿 One Dark 风格）
 * @param jsonStr 待高亮的 JSON 格式字符串
 * @returns 包含 HTML 样式标签的高亮字符串
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
 * 计算矩形指定边中点的绝对坐标
 * @param rect 矩形边界对象 (x, y, w, h)
 * @param edge 边类型 ('top' | 'bottom' | 'left' | 'right')
 * @returns 锚点绝对坐标 { x, y }
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
 * 计算贝塞尔曲线在出入边方向上的控制点坐标
 * @param x 锚点 X 坐标
 * @param y 锚点 Y 坐标
 * @param edge 出入边方向
 * @param offset 控制点延伸偏移量
 * @returns 控制点坐标 { x, y }
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
 * 根据两画板的相对中心几何夹角，智能判定起点边与终点边
 * @param rectA 起始画板矩形
 * @param rectB 目标画板矩形
 * @returns 智能决策的出入边组合 { sourceEdge, targetEdge }
 */
export function getSmartEdges(
  rectA: Rect,
  rectB: Rect
): { sourceEdge: EdgeType; targetEdge: EdgeType } {
  const centerA = { x: rectA.x + rectA.w / 2, y: rectA.y + rectA.h / 2 };
  const centerB = { x: rectB.x + rectB.w / 2, y: rectB.y + rectB.h / 2 };

  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;

  // 1. 正向流向：目标画板在源画板右侧 (dx >= 0)
  if (dx >= 0) {
    if (Math.abs(dy) > Math.abs(dx) * 1.3) {
      return dy > 0
        ? { sourceEdge: 'bottom', targetEdge: 'top' }
        : { sourceEdge: 'top', targetEdge: 'bottom' };
    }
    return { sourceEdge: 'right', targetEdge: 'left' };
  }

  // 2. 逆向流向：目标画板被拖拽到了源画板左侧 (dx < 0)
  // 核心约束：
  // • targetEdge 绝对不能是 'right'（避免箭头插在目标画板加号上被遮挡）
  // • sourceEdge 绝对不能是 'left'（避免与上一页进入当前画板的连线在左侧碰撞打架）
  if (dy < 0) {
    return { sourceEdge: 'top', targetEdge: 'left' };
  } else {
    return { sourceEdge: 'bottom', targetEdge: 'left' };
  }
}
