/**
 * 提示区块内容解析器 (Alert Parser)
 * 将纯文本/轻量 Markdown 格式解析为安全的结构化段落、无序列表和超链接
 * 
 * 规则：
 * 1. 换行与空行：空行自动生成段落间距
 * 2. 列表项：以 "- " 或 "* " 或 "• " 开头的行识别为无序列表项，渲染为蓝色微方块
 * 3. 超链接：支持 Markdown 格式 [链接文案](https://example.com) 及独立 URL，新标签页打开
 * 4. XSS 防护：对用户输入的非链接 HTML 特殊字符进行严格转义
 */

export interface AlertSegment {
  id: string;
  type: 'bullet' | 'paragraph' | 'spacer';
  text: string;
  html: string;
  orderIndex?: number;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 将单行文本中的 [文案](url) 或 bare url 解析为安全 a 标签
 */
export function formatInlineText(rawText: string): string {
  if (!rawText) return '';

  // 1. 暂存 Markdown 格式链接 [text](url) - 宽松匹配任意 URL (包含 xxx.com, https://..., /path 等)
  const linkPlaceholders: { placeholder: string; html: string }[] = [];
  let index = 0;

  // 匹配 [文案](URL)
  let processed = rawText.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, rawUrl) => {
    const trimmedUrl = String(rawUrl).trim();
    // 智能协议补全：若未写协议头 (如 xxx.com、www.xxx.com)，自动补全 https://
    let href = trimmedUrl;
    if (!/^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmedUrl)) {
      href = `https://${trimmedUrl}`;
    }
    const safeLabel = escapeHtml(label);
    const safeHref = escapeHtml(href);
    const token = `__ALERT_LINK_${index++}__`;
    linkPlaceholders.push({
      placeholder: token,
      html: `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-[#1677ff] underline underline-offset-2 hover:text-[#4096ff] font-medium transition-colors break-words">${safeLabel}</a>`
    });
    return token;
  });

  // 2. 转义剩余的 HTML 字符
  processed = escapeHtml(processed);

  // 3. 匹配未包装在 Markdown 语法中的裸 URL (例如 https://example.com 或 www.example.com)
  processed = processed.replace(/(https?:\/\/[^\s<]+|www\.[^\s<]+)/g, (url) => {
    const href = url.startsWith('www.') ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#1677ff] underline underline-offset-2 hover:text-[#4096ff] font-medium transition-colors break-words">${url}</a>`;
  });

  // 4. 还原 Markdown 链接
  for (const item of linkPlaceholders) {
    processed = processed.replace(item.placeholder, item.html);
  }

  return processed;
}

/**
 * 解析整篇提示区块纯文本
 * @param content 原始内容
 * @param listStyle 列表形式：circle 圆点无序 | number 数字有序 (默认 circle)
 */
export function parseAlertContent(content?: string, _listStyle: 'circle' | 'number' = 'circle'): AlertSegment[] {
  if (!content || !content.trim()) {
    return [];
  }

  const lines = content.split('\n');
  const segments: AlertSegment[] = [];
  let orderCounter = 0;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      // 空行：重置连续编号计数器
      orderCounter = 0;
      if (segments.length > 0 && segments[segments.length - 1].type !== 'spacer') {
        segments.push({
          id: `spacer_${idx}`,
          type: 'spacer',
          text: '',
          html: ''
        });
      }
      return;
    }

    // 检查是否为列表项：以 "- ", "* ", "• " 开头，或以 "1. ", "1、" 数字编号开头
    const bulletMatch = line.match(/^\s*[-*•]\s+(.*)$/);
    const numberMatch = line.match(/^\s*(\d+)[\.、]\s*(.*)$/);

    if (bulletMatch || numberMatch) {
      orderCounter++;
      const itemText = bulletMatch ? bulletMatch[1] : numberMatch![2];
      segments.push({
        id: `bullet_${idx}`,
        type: 'bullet',
        text: itemText,
        html: formatInlineText(itemText),
        orderIndex: orderCounter
      });
    } else {
      // 普通文本段落
      orderCounter = 0;
      segments.push({
        id: `para_${idx}`,
        type: 'paragraph',
        text: line,
        html: formatInlineText(line)
      });
    }
  });

  // 移除尾部多余的 spacer
  while (segments.length > 0 && segments[segments.length - 1].type === 'spacer') {
    segments.pop();
  }

  return segments;
}
