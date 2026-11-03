import type { FormElement, FormElementOption } from '@/types/schema';

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

  if (dx >= 0) {
    if (Math.abs(dy) > Math.abs(dx) * 1.3) {
      return dy > 0
        ? { sourceEdge: 'bottom', targetEdge: 'top' }
        : { sourceEdge: 'top', targetEdge: 'bottom' };
    }
    return { sourceEdge: 'right', targetEdge: 'left' };
  }

  if (dy < 0) {
    return { sourceEdge: 'top', targetEdge: 'left' };
  } else {
    return { sourceEdge: 'bottom', targetEdge: 'left' };
  }
}

export function getFieldDepthInPage(
  el: FormElement | undefined,
  fields: FormElement[],
  visited = new Set<string>()
): number {
  const conds = el?.linkage?.conditions;
  if (!conds || conds.length === 0) return 0;
  let maxParentDepth = 0;
  for (const c of conds) {
    if (visited.has(c.fieldKey)) continue;
    const nextVisited = new Set(visited);
    nextVisited.add(c.fieldKey);
    const parent = fields.find(f => f.key === c.fieldKey);
    if (parent) {
      maxParentDepth = Math.max(maxParentDepth, 1 + getFieldDepthInPage(parent, fields, nextVisited));
    }
  }
  return maxParentDepth;
}

export function getSubtreeDepth(
  el: FormElement | undefined,
  fields: FormElement[],
  visited = new Set<string>()
): number {
  if (!el?.key || visited.has(el.key)) return 0;
  const nextVisited = new Set(visited);
  nextVisited.add(el.key);
  let maxChildDepth = 0;
  for (const f of fields) {
    if (f.linkage?.conditions?.some(c => c.fieldKey === el.key)) {
      maxChildDepth = Math.max(maxChildDepth, 1 + getSubtreeDepth(f, fields, nextVisited));
    }
  }
  return maxChildDepth;
}

/**
 * 规整关联组内组件顺序：确保所有触发父组件排在上方，同组从属子组件紧邻排在下方，二级从属子组件紧跟对应一级父组件
 */
export function normalizeConnectedLinkageOrder(fields: FormElement[], ...seedKeys: string[]) {
  const processedKeys = new Set<string>();

  for (const rawSeed of seedKeys) {
    if (!rawSeed || processedKeys.has(rawSeed)) continue;

    const connectedKeys = new Set<string>([rawSeed]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const el of fields) {
        const conds = el.linkage?.conditions;
        if (!conds?.length) continue;
        const isChildInSet = connectedKeys.has(el.key);
        const hasParentInSet = conds.some(c => connectedKeys.has(c.fieldKey));
        if (isChildInSet || hasParentInSet) {
          if (!connectedKeys.has(el.key)) {
            connectedKeys.add(el.key);
            changed = true;
          }
          for (const c of conds) {
            if (!connectedKeys.has(c.fieldKey)) {
              connectedKeys.add(c.fieldKey);
              changed = true;
            }
          }
        }
      }
    }

    for (const k of connectedKeys) {
      processedKeys.add(k);
    }

    const groupEls = fields.filter(el => connectedKeys.has(el.key));
    if (groupEls.length <= 1) continue;

    const firstIdx = fields.findIndex(el => connectedKeys.has(el.key));
    if (firstIdx === -1) continue;

    const rootParents = groupEls.filter(el => !el.linkage?.conditions?.length);
    const depth1Children = groupEls.filter(el => getFieldDepthInPage(el, fields) === 1);
    const depth2Children = groupEls.filter(el => getFieldDepthInPage(el, fields) >= 2);

    const orderedChildren: FormElement[] = [];
    const placedDepth2Ids = new Set<string>();

    for (const d1 of depth1Children) {
      orderedChildren.push(d1);
      for (const d2 of depth2Children) {
        if (!placedDepth2Ids.has(d2.id) && d2.linkage?.conditions?.some(c => c.fieldKey === d1.key)) {
          orderedChildren.push(d2);
          placedDepth2Ids.add(d2.id);
        }
      }
    }
    for (const d2 of depth2Children) {
      if (!placedDepth2Ids.has(d2.id)) {
        orderedChildren.push(d2);
      }
    }

    const orderedGroup = [...rootParents, ...orderedChildren];
    const before = fields.slice(0, firstIdx).filter(el => !connectedKeys.has(el.key));
    const after = fields.slice(firstIdx).filter(el => !connectedKeys.has(el.key));
    fields.splice(0, fields.length, ...before, ...orderedGroup, ...after);
  }
}

export function getConnectedLinkageGroup(fields: FormElement[], seedEl: FormElement): FormElement[] {
  if (!seedEl?.key) return [seedEl];
  const connectedKeys = new Set<string>([seedEl.key]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const el of fields) {
      const conds = el.linkage?.conditions;
      if (!conds?.length) continue;
      const isChildInSet = connectedKeys.has(el.key);
      const hasParentInSet = conds.some(c => connectedKeys.has(c.fieldKey));
      if (isChildInSet || hasParentInSet) {
        if (!connectedKeys.has(el.key)) {
          connectedKeys.add(el.key);
          changed = true;
        }
        for (const c of conds) {
          if (!connectedKeys.has(c.fieldKey)) {
            connectedKeys.add(c.fieldKey);
            changed = true;
          }
        }
      }
    }
  }
  const groupEls = fields.filter(el => connectedKeys.has(el.key));
  return groupEls.length > 0 ? groupEls : [seedEl];
}

export function getDirectChildren(fields: FormElement[], parentKey: string): FormElement[] {
  if (!parentKey) return [];
  return fields.filter(f => f.linkage?.conditions?.some(c => c.fieldKey === parentKey));
}

export function isParentLinkedToTargetWithOption(
  _fields: FormElement[],
  parent: FormElement,
  option: FormElementOption,
  target: FormElement
): boolean {
  if (!parent?.key || !option?.value || !target) return false;
  return Boolean(
    target.linkage?.conditions?.some(c => c.fieldKey === parent.key && c.value === option.value)
  );
}

export function isParentLinkedToTargetAnyOption(
  _fields: FormElement[],
  parent: FormElement,
  target: FormElement
): boolean {
  if (!parent?.key || !target) return false;
  return Boolean(target.linkage?.conditions?.some(c => c.fieldKey === parent.key));
}

function upsertConditionOnElement(el: FormElement, fieldKey: string, value: string) {
  if (!fieldKey || el.key === fieldKey) return;
  if (!el.linkage || !Array.isArray(el.linkage.conditions)) {
    el.linkage = {
      logic: 'or',
      conditions: []
    };
  }
  const existingIdx = el.linkage.conditions.findIndex(c => c.fieldKey === fieldKey);
  if (existingIdx !== -1) {
    el.linkage.conditions[existingIdx].value = value;
  } else {
    el.linkage.conditions.push({ fieldKey, value });
  }
}

function removeConditionFromElement(el: FormElement, fieldKey: string, value?: string) {
  if (!el.linkage?.conditions) return;
  el.linkage.conditions = el.linkage.conditions.filter(c => {
    if (c.fieldKey !== fieldKey) return true;
    return value !== undefined ? c.value !== value : false;
  });
  if (el.linkage.conditions.length === 0) {
    delete el.linkage;
  }
}

/**
 * 绑定或切换父组件选项与目标子组件的关联关系（保持原位置不自动位移）
 */
export function toggleParentOptionLink(
  fields: FormElement[],
  parent: FormElement,
  option: FormElementOption,
  target: FormElement
) {
  if (!parent?.key || !option?.value || !target || parent.id === target.id) return;

  if (isParentLinkedToTargetWithOption(fields, parent, option, target)) {
    removeConditionFromElement(target, parent.key, option.value);
    return;
  }

  upsertConditionOnElement(target, parent.key, option.value);
}

/**
 * 解除指定组件的关联关系（保持组件位置不动：若为子组件则清除其从属规则；若为父组件则从其名下子组件中移除该父组件条件）
 */
export function unlinkElementFromGroup(fields: FormElement[], el: FormElement) {
  if (!el) return;

  if (el.linkage?.conditions?.length) {
    delete el.linkage;
  }

  const directChildren = getDirectChildren(fields, el.key);
  if (directChildren.length > 0) {
    for (const ch of directChildren) {
      removeConditionFromElement(ch, el.key);
    }
  }
}
