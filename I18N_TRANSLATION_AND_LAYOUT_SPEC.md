# 低代码表单构建器 · 全系统多语言文案对照与界面版面间距控制规范

> **文档说明**：本文档整理了系统内全部 UI 文案的中英文当前文案、优化替换方案、对应界面位置（截图指引），以及针对中英文排版差异的**布局间距、外边距、内边距、截断与防溢出把控规范**。

---

## 📐 距离与版面把控核心设计总则

在低代码构建器中，英文文本通常比中文长 **1.5 倍至 2.5 倍**。为避免出现英文换行挤压、截断失效、按钮错位、弹窗滚动条异常等问题，所有界面元素均需遵循以下版面与间距规范：

1. **紧凑工具栏 / 顶部栏（高度 52px）**：
   - 按钮水平内边距保持 `px-2.5` 至 `px-3`，图标与文字间距固定 `gap-1.5`（6px）。
   - 英文模式下建议动词前置且精炼（例如“发布表单”从 `Publish Form` 优化为 `Publish`），避免右侧按钮组在分辨率低于 1280px 时与表单标题发生物理重叠。
2. **侧边栏宽度控制（左栏 320px / 右栏 300px~520px）**：
   - 表单项标签：推荐采用纵向堆叠布局（`layout="vertical"`），标签与输入框间距保持 `mb-1.5`（6px）；
   - 水平胶囊分段器：必须使用 `shrink-0` 与 `whitespace-nowrap`，胶囊内部间距控制在 `px-2 py-0.5`，避免在 300px 默认面板宽度下发生折行。
3. **条件联动结构化逻辑卡片（Option A）**：
   - 父级胶囊与选项胶囊必须设置 `max-w-[120px] truncate`，并在 `a-tooltip` 或 `title` 中提供全量名称，确保整条逻辑链 `当 [组件 ↗] 选择 [选项] 时展开` 单行流式对齐。
4. **移动端仿真预览器（iPhone 视口 375px / 390px）**：
   - 页面表单内边距统一为 `px-4 pt-4 pb-12`，各组件垂直间距为 `space-y-4`（16px）；
   - 单选/多选框组：选项较长（英文 > 14 字符）时建议强制采用 `layout="stack"` 垂直排列，间距保持 `space-y-2`（8px）。

---

## 一、 顶部全局导航栏 (AppHeader)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **返回上一页** | Back | **返回** | **Back** | 📍 **定位**：顶栏最左侧箭头返回按钮的 tooltip。<br>📏 **距离把控**：按钮为方形 `w-8 h-8 flex items-center justify-center`，hover 展开提示气泡，左右外边距 `mr-2`，确保不挤占左侧 Logo 区域。 |
| **未命名表单** | Untitled Form | **未命名表单** | **Untitled Form** | 📍 **定位**：顶栏中央左侧可编辑表单标题。<br>📏 **距离把控**：最大宽度限制为 `max-w-[260px] truncate`，文字字号 `text-sm font-semibold`，右侧预留 `w-4 h-4` 铅笔图标及 `gap-1.5` 间隙。 |
| **请输入表单名称** | Enter form title | **请输入表单名称** | **Enter form title** | 📍 **定位**：双击或点击编辑表单标题时的行内输入框 placeholder。<br>📏 **距离把控**：输入框高度 `h-7 text-xs px-2`，宽度根据字符动态伸缩，最小 `min-w-[160px]`。 |
| **点击修改表单名称** | Click to rename form | **点击修改表单名称** | **Click to rename** | 📍 **定位**：标题 hover 时的 tooltip 提示。<br>📏 **距离把控**：提示气泡延迟 200ms 显示，避免鼠标滑过时抖动。 |
| **操作指南** | User Guide | **操作指南** | **Guide** | 📍 **定位**：顶栏右侧功能引导按钮。<br>📏 **距离把控**：按钮尺寸 `size="small"`，内边距 `px-2.5`，英文使用精炼词 **Guide**，节省出 30px 横向空间给语言切换栏。 |
| **随时开启表单设计器操作指南** | View the form builder user guide anytime | **随时查看操作指南与快捷键** | **Open interactive tour & shortcuts** | 📍 **定位**：操作指南按钮的 Tooltip。<br>📏 **距离把控**：Tooltip 弹层设置 `max-w-[200px] text-xs`。 |
| **有未保存变更** | Unsaved Changes | **未保存** | **Unsaved** | 📍 **定位**：顶栏保存状态指示胶囊（黄色徽标）。<br>📏 **距离把控**：圆点 `w-1.5 h-1.5`，间距 `gap-1.5`，徽标内边距 `px-2 py-0.5`，中英文宽度差控制在 12px 以内。 |
| **全部已保存** | All Saved | **已保存** | **Saved** | 📍 **定位**：顶栏保存状态指示胶囊（灰色徽标）。<br>📏 **距离把控**：与上述未保存状态共享相同固定盒模型尺寸，防止状态切换时顶栏右侧抖动。 |
| **正在保存...** | Saving... | **正在保存...** | **Saving...** | 📍 **定位**：保存触发时的即时动态状态。<br>📏 **距离把控**：前置带有旋转 Spin 动画图标，间隙 `gap-1`。 |
| **保存** | Save | **保存** | **Save** | 📍 **定位**：顶栏操作区次要按钮（Secondary Button）。<br>📏 **距离把控**：按钮高度 `h-7`，内边距 `px-3`，右侧距离预览按钮 `mr-2`（8px）。 |
| **预览** | Preview | **预览** | **Preview** | 📍 **定位**：顶栏操作区预览按钮。<br>📏 **距离把控**：左侧图标与文字间距 `gap-1.5`，与发布按钮外间距 `mr-2`。 |
| **发布表单** | Publish | **发布** | **Publish** | 📍 **定位**：顶栏右侧主操作强调按钮（Primary Button）。<br>📏 **距离把控**：主色渐变，内边距 `px-3.5`，字重 `font-medium`，保持醒目首要视觉锚点。 |
| **表单内容语言** | Content Language | **编辑语言** | **Form Language** | 📍 **定位**：顶栏多语言快速切换器左侧说明标签。<br>📏 **距离把控**：浅灰小字 `text-[11px]`，与分段控制器的右外间距为 `mr-2`。 |
| **还有 {count} 项内容未翻译** | {count} items untranslated | **{count} 项待补英文** | **{count} missing translation** | 📍 **定位**：多语言切换栏上的告警黄色小徽标。<br>📏 **距离把控**：高度 `h-4`，字号 `text-[10px]`，左右内边距 `px-1.5`，圆角 `rounded-full`。 |
| **多语言内容已填写完整** | All content translated | **双语内容已齐备** | **Fully Translated** | 📍 **定位**：多语言完备度 100% 时的绿色提示小标。<br>📏 **距离把控**：内嵌打勾绿色对勾图标，与文字间隙 `gap-1`。 |
| **多语言发布校验提醒** | Translation Incomplete Warning | **发布双语校验提醒** | **Incomplete Translation Warning** | 📍 **定位**：点击发布时，若存在未翻译项弹出的拦截 Modal 标题。<br>📏 **距离把控**：Modal 标题字号 `text-base font-semibold`，前置警告图标距文字 `mr-2`。 |
| **当前表单还有 {count} 项内容尚未完成英文翻译。** | There are {count} items missing English translation. | **当前表单尚有 {count} 项内容未录入英文翻译。** | **{count} field(s) have no English translation.** | 📍 **定位**：发布校验提醒 Modal 强调首句。<br>📏 **距离把控**：字号 `text-sm text-slate-700 leading-relaxed mb-2`。 |
| **如果直接发布，英文环境下的用户将看到部分中文默认文案或留白，建议完善后再发布。** | English users may see default Chinese or blank fields if published now. | **直接发布将导致海外填表端显示中文或留白，建议先补全英文。** | **Direct publishing may display Chinese text or blanks to overseas users.** | 📍 **定位**：发布校验提醒 Modal 次要辅助说明。<br>📏 **距离把控**：灰色辅助字 `text-xs text-slate-500 leading-normal mb-4`。 |
| **前往完善翻译** | Complete Translations | **立即补全** | **Complete Now** | 📍 **定位**：Modal 底部的引导主按钮。<br>📏 **距离把控**：宽度占据右侧，内边距 `px-4`。 |
| **仍然发布** | Publish Anyway | **仍然发布** | **Publish Anyway** | 📍 **定位**：Modal 底部的次要文本/次要按钮。<br>📏 **距离把控**：与“立即补全”按钮横向间距为 `gap-3`（12px）。 |

---

## 二、 左侧物料侧边栏 (MaterialSidebar)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **组件物料库** | Component Library | **组件库** | **Components** | 📍 **定位**：左侧 ActivityBar 首个图标的 hover tooltip。<br>📏 **距离把控**：ActivityBar 固定宽度 48px，图标居中 `w-5 h-5`，选中间隙 `p-2.5`。 |
| **场景模板库** | Scenario Templates | **模板库** | **Templates** | 📍 **定位**：左侧 ActivityBar 第二个模板图标的 hover tooltip。<br>📏 **距离把控**：上下图标间隔 `mb-2`。 |
| **画布页面列表** | Canvas Pages | **页面大纲** | **Pages** | 📍 **定位**：左侧 ActivityBar 第三个页面层级大纲图标。<br>📏 **距离把控**：底部设置分割线 `border-b my-2` 与收起按钮隔开。 |
| **完全收起侧边栏** | Collapse Sidebar | **收起侧边栏** | **Collapse Sidebar** | 📍 **定位**：ActivityBar 最底部收起按钮。<br>📏 **距离把控**：定位在底部 `mt-auto mb-3`。 |
| **查找组件或模块...** | Search components... | **搜索组件物料...** | **Search components...** | 📍 **定位**：物料面板顶部常驻搜索输入框。<br>📏 **距离把控**：高度 `h-8`，前置放大镜图标 `w-3.5 h-3.5 text-slate-400 mr-1.5`，输入框内边距 `px-2.5`。 |
| **未找到匹配的组件** | No matching components found | **无匹配组件** | **No components found** | 📍 **定位**：搜索无结果时的空状态插画下方说明。<br>📏 **距离把控**：垂直居中内边距 `py-8`，文字 `text-xs text-slate-400`。 |
| **基础输入** | Basic Inputs | **基础字段** | **Basic Fields** | 📍 **定位**：物料库第一类目折叠分组标题。<br>📏 **距离把控**：字号 `text-[11px] font-semibold tracking-wider text-slate-400 uppercase py-2`。 |
| **业务组件** | Business Components | **高级业务** | **Business** | 📍 **定位**：物料库第二类目折叠分组标题。<br>📏 **距离把控**：类目之间垂直间距 `mt-4 mb-1.5`。 |
| **单行文本** | Single Line | **单行文本** | **Short Text** | 📍 **定位**：输入类组件拖拽卡片标题。<br>📏 **距离把控**：物料卡片固定高度 `h-9`，网格两列排布 `grid-cols-2 gap-2`，卡片内边距 `px-2.5 py-1.5`，文字最大宽度 `max-w-[85px] truncate`。 |
| **多行文本** | Multi-line | **多行文本** | **Long Text** | 📍 **定位**：多行文本组件拖拽卡片。<br>📏 **距离把控**：图标与文字间距 `gap-2`，图标为 16px Lucide 图标。 |
| **下拉选择** | Dropdown | **下拉选择** | **Dropdown** | 📍 **定位**：下拉选择组件卡片。<br>📏 **距离把控**：与单选框卡片同行对称展示。 |
| **单选框组** | Radio Group | **单选框组** | **Radio** | 📍 **定位**：单选组件卡片。<br>📏 **距离把控**：悬停时边框由 `border-slate-200` 变为 `border-blue-500`，过度时长 150ms。 |
| **多选框组** | Checkbox Group | **多选框组** | **Checkbox** | 📍 **定位**：多选组件卡片。<br>📏 **距离把控**：同单选框组对齐。 |
| **日期选择** | Date Picker | **日期时间** | **Date** | 📍 **定位**：日期组件卡片。<br>📏 **距离把控**：英文保持单字 **Date**，在 130px 卡片中杜绝文本折行。 |
| **国家/地区** | Country | **国家/地区** | **Country / Region** | 📍 **定位**：业务组件卡片。<br>📏 **距离把控**：英文文本较长，卡片内使用 `text-[11px]` 并增加 `truncate` 防止破框。 |
| **国籍选择** | Nationality | **国籍选择** | **Nationality** | 📍 **定位**：国籍组件卡片。<br>📏 **距离把控**：卡片右侧可拖拽把手图标预留 12px 留白。 |
| **手机号码** | Phone | **国际手机号** | **Phone Number** | 📍 **定位**：国际电话组件卡片。<br>📏 **距离把控**：两列网格展示，卡片圆角 `rounded-lg`。 |
| **电子邮箱** | Email | **电子邮箱** | **Email Address** | 📍 **定位**：邮箱组件卡片。<br>📏 **距离把控**：内边距与手机号保持一致。 |
| **提示告示** | Notice Banner | **提示说明** | **Notice / Alert** | 📍 **定位**：布局说明类组件卡片。<br>📏 **距离把控**：区别于表单字段，采用淡橙色/淡蓝色微背景区分。 |
| **手写签名** | Signature | **手写签名板** | **Signature Pad** | 📍 **定位**：电子签名物料卡片。<br>📏 **距离把控**：置于业务物料底端，图标与标题距离 `gap-2`。 |
| **新建空白画布** | Create Blank Canvas | **新建空白页面** | **Blank Page** | 📍 **定位**：模板标签页置顶首个新建快捷卡片。<br>📏 **距离把控**：加号虚线边框卡片，垂直内边距 `py-3`，居中排布。 |
| **从零开始自由搭建表单** | Build form from scratch | **自由编排全新画布** | **Design freely from scratch** | 📍 **定位**：新建空白画布的副标题说明。<br>📏 **距离把控**：浅灰 `text-[11px]`，与主标题纵向间距 `mt-0.5`。 |
| **预置场景模板** | Preset Scenarios | **合规推荐模板** | **KYC Templates** | 📍 **定位**：模板类目分割小标题。<br>📏 **距离把控**：上外边距 `mt-4`，字号 `text-[11px] font-semibold text-slate-400`。 |
| **添加新画板页面** | Add Canvas Page | **添加新页面** | **Add Page** | 📍 **定位**：大纲标签页底部常驻添加画板按钮。<br>📏 **距离把控**：整行通栏按钮 `w-full h-8`，上下内边距 `my-2`，虚线边框。 |

---

## 三、 右侧属性配置面板 (PropertyPanel)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **属性配置** | Properties | **属性设置** | **Properties** | 📍 **定位**：右侧面板固定顶栏左侧大标题。<br>📏 **距离把控**：面板宽度默认为 300px（支持拉伸至 520px），顶栏高度固定 48px，左右内边距 `px-4 py-3`。 |
| **画布页面全局设置** | Page Canvas Settings | **画板全局设置** | **Canvas Settings** | 📍 **定位**：选中画板时顶栏下方显示的副标题。<br>📏 **距离把控**：浅灰色 `text-[11px] text-slate-400`，字距紧凑无换行。 |
| **组件字段属性设置** | Component Field Settings | **字段属性设置** | **Field Properties** | 📍 **定位**：选中组件时顶栏副标题。<br>📏 **距离把控**：同上。 |
| **未选中组件** | No Element Selected | **暂无选中国家/字段** | **No Selection** | 📍 **定位**：画布无选中态时的面板标题。<br>📏 **距离把控**：水平居中在面板内容区，上下留白 `py-16`。 |
| **点击画布中的字段开始编辑** | Click any field on the canvas to edit | **点击画布中任意组件即可配置属性** | **Select any field on canvas to configure** | 📍 **定位**：未选中时的空状态引导说明。<br>📏 **距离把控**：字号 `text-xs text-slate-400 leading-relaxed text-center px-6`。 |
| **编辑语言** | Language | **当前编辑语言** | **Editing Language** | 📍 **定位**：面板顶部中英语言切换分段器标签。<br>📏 **距离把控**：左右排列，左侧地球图标 `w-3.5 h-3.5 mr-1`，右侧胶囊分段器高 24px，内边距 `p-0.5`。 |
| **基础信息** | Basic Information | **基础配置** | **Basic Settings** | 📍 **定位**：组件属性面板第一个分组小标题。<br>📏 **距离把控**：下边框 `border-b border-slate-100 pb-2 mb-3`。 |
| **设置字段标题、展示与校验** | Configure field label, display and validation | **字段名称、说明与校验规则** | **Label, subtitle and validation** | 📍 **定位**：基础配置标题下方辅助说明。<br>📏 **距离把控**：浅灰 `text-[11px]`。 |
| **字段标题** | Field Label | **字段名称** | **Field Label** | 📍 **定位**：字段主标题输入项 Label。<br>📏 **距离把控**：垂直堆叠，距离输入框 `mb-1.5`（6px），右侧预留未翻译橙色徽标（`scale-90 origin-left ml-2`）。 |
| **请输入字段标题** | Enter field label | **请输入字段名称** | **Enter field label** | 📍 **定位**：标题输入框 placeholder。<br>📏 **距离把控**：高度 `h-8 text-xs`，支持一键清空图标。 |
| **副标题** | Subtitle | **副标题 / 填写指引** | **Help Text / Subtitle** | 📍 **定位**：副标题输入项 Label。<br>📏 **距离把控**：垂直间距 `mt-3 mb-1.5`。 |
| **请输入副标题或补充说明** | Enter subtitle or explanation | **请输入副标题或填写说明...** | **Enter subtitle or hint...** | 📍 **定位**：副标题输入框 placeholder。<br>📏 **距离把控**：支持多行或单行，自适应高度。 |
| **排布方式** | Layout | **排布位置** | **Placement** | 📍 **定位**：副标题位置切换小标题。<br>📏 **距离把控**：整行 `flex items-center justify-between`，右侧放并排/换行微型分段器（宽度固定 120px，内部选项间距 `px-2 py-0.5`）。 |
| **标题右侧** | Inline | **同排靠右** | **Inline Right** | 📍 **定位**：副标题排布微型胶囊选项一。<br>📏 **距离把控**：内置专用双方块排版 SVG 示意图标，图标与文字间距 4px。 |
| **标题下方** | Below | **换行下方** | **Below Title** | 📍 **定位**：副标题排布微型胶囊选项二。<br>📏 **距离把控**：内置上下堆叠排版 SVG 示意图标。 |
| **显示标题** | Show Label | **显示标题** | **Show Label** | 📍 **定位**：标题显隐 Switch 开关项。<br>📏 **距离把控**：左右两端对齐 `flex justify-between items-center py-1.5`。 |
| **设为必填** | Required | **设为必填** | **Required** | 📍 **定位**：必填校验 Switch 开关。<br>📏 **距离把控**：与问号提示图标保持 `gap-1.5`（6px），Switch 开关尺寸为 `size="small"`。 |
| **未填校验提示** | Validation Message | **未填校验提示** | **Error Message** | 📍 **定位**：开启必填后的自定义报错文案配置项。<br>📏 **距离把控**：折叠面板平滑展开动画（`transition-all duration-200`），外边距 `mt-2.5`。 |
| **自定义提示** | Customize | **自定义提示** | **Customize** | 📍 **定位**：切换默认校验提示与自定义文案的操作链接。<br>📏 **距离把控**：文字链接样式 `text-[11px] text-[#1677ff] hover:underline cursor-pointer`。 |
| **恢复默认** | Reset to Default | **恢复默认提示** | **Reset to Default** | 📍 **定位**：已自定义文案时，恢复系统智能文案的操作按钮。<br>📏 **距离把控**：右侧对齐，前置微型旋转复位图标（`w-3 h-3 mr-1`）。 |
| **占位提示** | Placeholder | **占位提示** | **Placeholder** | 📍 **定位**：输入框/选择框通用占位符配置项。<br>📏 **距离把控**：垂直堆叠，输入框内边距 `px-2.5`，清除按钮居右。 |
| **排布方式 (选项)** | Layout | **选项排布** | **Options Layout** | 📍 **定位**：单选/多选框选项排列方向配置。<br>📏 **距离把控**：左右对齐，右侧分段器固定两个选项：并排 / 堆叠。 |
| **并排** | Inline | **横向并排** | **Horizontal** | 📍 **定位**：选项横向流式排列。<br>📏 **距离把控**：胶囊内边距 `px-2 py-0.5 text-[11px]`。 |
| **堆叠** | Stacked | **纵向堆叠** | **Vertical** | 📍 **定位**：选项换行独占一行排列。<br>📏 **距离把控**：适合选项文字较长时选择。 |
| **最大允许选择数** | Max Allowed Selections | **最大可选数** | **Max Selections** | 📍 **定位**：多选框或支持多选的下拉框限制数量输入项。<br>📏 **距离把控**：左右排布，右侧数字步进器（InputNumber）宽度固定 88px。 |
| **不限制** | Unlimited | **不限制** | **No Limit** | 📍 **定位**：最大可选数未填写时的 placeholder。<br>📏 **距离把控**：浅灰色置灰展示。 |
| **展开规则** | Display Rule | **展开条件规则** | **Display Condition** | 📍 **定位**：**Option A 逻辑卡片顶栏标题**。<br>📏 **距离把控**：卡片内部内边距 `p-2.5`，上外边距 `pt-3.5 border-t border-slate-100`，字号 `text-[12px] font-semibold text-slate-800`。 |
| **生效中** | Active | **生效中** | **Active** | 📍 **定位**：Option A 卡片标题右侧的绿色呼吸灯状态徽标。<br>📏 **距离把控**：外框内边距 `px-1.5 py-0.5 rounded-full`，左侧绿点 `w-1.5 h-1.5 bg-emerald-500 animate-pulse mr-1`，间距严格保证不发生换行。 |
| **解除** | Unlink | **解除关联** | **Unlink** | 📍 **定位**：Option A 卡片顶栏右侧幽灵解除按钮。<br>📏 **距离把控**：文字前置垃圾桶/解除链条图标 `w-3 h-3 mr-1`，外层包裹 `a-popconfirm` 气泡提示框，防止误触。 |
| **确定解除与该选项的展开联动吗？解除后该组件将恢复为常驻显示。** | Unlink this condition? The field will become permanently visible. | **确定解除展开联动吗？解除后组件将恢复为常驻显示。** | **Unlink this condition? This component will become permanently visible.** | 📍 **定位**：点击解除时的 Arco 气泡二次确认文案。<br>📏 **距离把控**：Popconfirm 宽度限制在 220px，文字 `text-xs leading-normal`，底部提供取消/确认按钮。 |
| **当** | When | **当** | **When** | 📍 **定位**：Option A 结构化胶囊语法首部连接词。<br>📏 **距离把控**：灰色文字 `text-slate-400 text-[12px] font-medium mr-1`。 |
| **点击定位画布上游组件** | Click to locate upstream component on canvas | **点击高亮画布前置组件** | **Click to locate upstream field** | 📍 **定位**：Option A 父级组件胶囊的 hover Tooltip。<br>📏 **距离把控**：按钮样式 `bg-blue-50 text-[#1677ff] border border-blue-200/80 px-2 py-0.5 rounded-md text-[12px] max-w-[120px] truncate`。 |
| **选择** | selects | **选中** | **equals** | 📍 **定位**：Option A 语法中连接动词。<br>📏 **距离把控**：左右间距 `mx-1 text-slate-400 text-[12px]`。 |
| **时展开** | reveal this field | **时展开此项** | **then show** | 📍 **定位**：Option A 语法末尾结论词。<br>📏 **距离把控**：`text-slate-600 font-medium ml-1`。 |
| **未满足该条件时在填表端默认折叠隐藏** | Hidden by default until this condition is met | **未满足条件时在填表端默认隐藏** | **Hidden by default until this condition is met** | 📍 **定位**：Option A 卡片底部单行极简辅助说明。<br>📏 **距离把控**：左侧图标 `w-3 h-3 text-slate-400 shrink-0 mr-1`，文字 `text-[11px] text-slate-400 leading-tight`，严格控制为 1 行。 |
| **复制** | Duplicate | **复制字段** | **Duplicate** | 📍 **定位**：面板最底部次要操作按钮。<br>📏 **距离把控**：底部通栏排布 `flex gap-2 pt-4 border-t border-slate-100`，两按钮均分宽度 `flex-1 h-8 text-xs`。 |
| **删除** | Delete | **删除字段** | **Delete** | 📍 **定位**：面板最底部危险删除按钮。<br>📏 **距离把控**：红色幽灵/边框按钮，与复制按钮平分。 |

---

## 四、 选项与条款编辑器 (OptionsEditor)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **选项配置** | Option Settings | **选项列表** | **Choices** | 📍 **定位**：单选/多选/下拉属性面板中的选项列表配置标题。<br>📏 **距离把控**：分组标题 `text-[12px] font-semibold text-slate-700 mb-2`。 |
| **设置列表的具体选项，选项名称用于展示给用户。** | Configure choices displayed to users. | **配置供用户选择的选项内容与默认值。** | **Configure choices and default selections.** | 📍 **定位**：选项配置标题下方的浅灰色说明。<br>📏 **距离把控**：字号 `text-[11px] text-slate-400 mb-3`。 |
| **添加选项** | Add Option | **添加选项** | **Add Choice** | 📍 **定位**：选项列表底部的“+ 添加选项”虚线按钮。<br>📏 **距离把控**：整行高度 32px，外间距 `mt-2 mb-1`，虚线边框 `border-dashed border-slate-200`，hover 变蓝。 |
| **按住拖拽排序** | Drag to reorder | **按住拖拽调整顺序** | **Drag to reorder** | 📍 **定位**：选项条目最左侧六点拖拽把手的 Tooltip。<br>📏 **距离把控**：把手图标 `w-3.5 h-3.5 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing mr-1.5`。 |
| **点击切换默认选中项** | Click to toggle default selection | **设为默认选中** | **Set as default** | 📍 **定位**：选项输入框左侧 Radio / Checkbox 图标 Tooltip。<br>📏 **距离把控**：图标右外边距 `mr-2`，点击立即更新 store 并标记 dirty。 |
| **选项名称** | Option Label | **选项文案** | **Option Label** | 📍 **定位**：选项文本输入框的 placeholder。<br>📏 **距离把控**：输入框高度 `h-7 text-xs`，与右侧操作按钮保持 `mr-1` 紧凑对齐。 |
| **删除选项** | Delete Option | **删除** | **Remove** | 📍 **定位**：选项条目最右侧的垃圾桶图标按钮。<br>📏 **距离把控**：图标按钮 `w-6 h-6 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors`。 |
| **设置选择【{name}】时展开的表单组件** | Configure fields to reveal when choosing [{name}] | **配置选中【{name}】时的展开字段** | **Configure fields revealed when choosing [{name}]** | 📍 **定位**：点击选项行“设置展开”后的追问关联弹窗/抽屉标题。<br>📏 **距离把控**：弹窗宽度 420px，内边距 `p-4`，名称 `{name}` 加粗显示并超出 12 字截断。 |
| **展开: {name}** | Reveal: {name} | **已联动: {name}** | **Linked: {name}** | 📍 **定位**：选项右侧展示的蓝色小胶囊 Badge。<br>📏 **距离把控**：高度 `h-5`，字体 `text-[10px]`，内边距 `px-1.5`，最大宽度 `max-w-[100px] truncate`。 |

---

## 五、 主设计画布与右键快捷菜单 (InfiniteCanvas / ContextMenu)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **画布缩放与视口平移** | Canvas Zoom & Panning | **视口导航与缩放** | **Navigation & Zoom** | 📍 **定位**：画布底部快捷键帮助弹窗的第一模块标题。<br>📏 **距离把控**：弹窗尺寸 480px，网格两列图文说明，条目上下间距 `py-2`。 |
| **自由平移画布** | Pan Canvas | **自由平移画布** | **Pan Canvas** | 📍 **定位**：快捷键说明条目名称。<br>📏 **距离把控**：左侧功能名与右侧快捷键徽标（如 `Space + 拖拽`）保持两端对齐。 |
| **滚轮平滑缩放** | Smooth Zoom | **画布平滑缩放** | **Zoom Canvas** | 📍 **定位**：快捷键说明条目。<br>📏 **距离把控**：右侧展示按键徽标 `Ctrl + 滚轮`，徽标带有浅阴影与边框。 |
| **复制选中组件** | Duplicate Element | **复制组件** | **Duplicate** | 📍 **定位**：组件右键菜单第一项。<br>📏 **距离把控**：右键菜单项高度 `h-7.5 px-3`，图标尺寸 `w-3.5 h-3.5 mr-2`，菜单宽度固定 160px。 |
| **在下方插入组件** | Insert Below | **在正下方插入...** | **Insert Below...** | 📍 **定位**：组件右键菜单第二项。<br>📏 **距离把控**：hover 背景变为 `bg-blue-50 text-[#1677ff]`，子菜单展开延迟 120ms。 |
| **删除组件** | Delete Component | **删除组件** | **Delete** | 📍 **定位**：组件右键菜单底部的删除选项。<br>📏 **距离把控**：危险操作标红 `text-red-600 hover:bg-red-50`，上附一条轻量分割线 `border-t my-1`。 |
| **新建画布页面** | New Blank Page | **新建画板页面** | **New Canvas Page** | 📍 **定位**：空白画布处右键菜单首项。<br>📏 **距离把控**：内边距 `px-3 py-1.5 text-xs`。 |
| **重置画布视角** | Reset View | **重置视角并居中** | **Reset & Center View** | 📍 **定位**：空白画布右键菜单重置视图项。<br>📏 **距离把控**：触发平滑插值过渡补间动画，耗时 420ms。 |
| **删除当前画布** | Delete Current Canvas | **删除当前画板** | **Delete Canvas Page** | 📍 **定位**：空白画布右键菜单危险删除项。<br>📏 **距离把控**：点击弹出确认删除二次对话框，防止误删整个画板内容。 |
| **若选「{option}」** | If "{option}" is selected | **若选择「{option}」** | **If selects "{option}"** | 📍 **定位**：画布上追问子项上方悬浮的黄色逻辑指示小浮标。<br>📏 **距离把控**：高度 20px，内边距 `px-2 py-0.5 rounded-full text-[11px]`，带向上小箭头连线指向父组件，避免遮挡组件标题。 |
| **中文待补齐清单** | Chinese Completion Checklist | **中文待补清单** | **Missing Chinese** | 📍 **定位**：画布右下角悬浮多语言待办抽屉标题。<br>📏 **距离把控**：悬浮窗宽度 240px，圆角 `rounded-xl shadow-lg border border-slate-200`，支持拖拽定位。 |
| **英文待翻译清单** | English Translation Checklist | **英文待译清单** | **Missing English** | 📍 **定位**：当前处于英文模式时的悬浮待办抽屉标题。<br>📏 **距离把控**：标题右侧放置待办数量小圆标 `px-1.5 py-0.2 rounded-full text-[10px]`。 |
| **定位补齐** | Locate & Fill | **定位字段** | **Locate** | 📍 **定位**：待办清单中单条未录入项的快捷跳转按钮。<br>📏 **距离把控**：按钮内边距 `px-2 py-0.5 text-[11px] text-[#1677ff]`，点击后画布平滑缩放居中该组件并高亮对应属性输入框。 |

---

## 六、 模态弹窗与向导组件 (Modals & Wizards)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **欢迎使用 AlgoCandy** | Welcome to AlgoCandy | **欢迎使用 AlgoCandy** | **Welcome to AlgoCandy** | 📍 **定位**：首次进入系统时的全屏欢迎向导弹窗主标题。<br>📏 **距离把控**：弹窗宽度 720px，主标题字号 `text-2xl font-bold text-slate-800 tracking-tight mb-2`。 |
| **选择创建表单的方式，几秒钟即可开启高效编排。** | Choose how you want to create your form, and get started in seconds. | **选择建表方式，快速开启表单可视化编排。** | **Choose a starting method to design your forms in seconds.** | 📍 **定位**：欢迎向导副标题。<br>📏 **距离把控**：字号 `text-sm text-slate-500 mb-6 leading-relaxed`。 |
| **选用场景模板** | Use a Template | **选用场景模板** | **Explore Templates** | 📍 **定位**：向导推荐卡片之二。<br>📏 **距离把控**：双卡片并排 `grid grid-cols-2 gap-4`，卡片内边距 `p-5`，圆角 `rounded-xl`。 |
| **精选合规预设场景，开箱即用加速构建。** | Choose from ready-made templates to build faster. | **预置标准合规业务流程，开箱即用。** | **Prebuilt standard compliance workflows, ready out of the box.** | 📍 **定位**：模板卡片辅助描述。<br>📏 **距离把控**：卡片内部段落限制 `line-clamp-2 min-h-[38px]`，确保中英文卡片高度绝对一致。 |
| **立即创建** | Create Now | **立即开始** | **Get Started** | 📍 **定位**：向导卡片内部主按钮。<br>📏 **距离把控**：按钮通栏 `w-full h-9 mt-4`，字重 `font-medium`。 |
| **新建表单画布** | New Form Canvas | **新建表单** | **Create New Form** | 📍 **定位**：新建表单弹窗 (CreateFormModal) 顶部大标题。<br>📏 **距离把控**：弹窗固定宽度 480px，头部边距 `px-6 pt-5 pb-3 border-b border-slate-100`。 |
| **业务主体** | Profile Type | **适用主体类型** | **Target Profile** | 📍 **定位**：新建表单中的业务主体选择项。<br>📏 **距离把控**：下方提供三个单选卡片（个人、机构、客户），横向三等分 `grid-cols-3 gap-2.5`，卡片内边距 `p-3 text-center`。 |
| **覆盖确认** | Confirm Overwrite | **画布覆盖警告** | **Confirm Canvas Overwrite** | 📍 **定位**：新建表单将清除当前画布时的拦截警告 Modal。<br>📏 **距离把控**：危险警告对话框宽度 400px，警告图标外距 `mr-3 text-amber-500`。 |
| **当前画布已包含 {pages} 个画板页面，新建表单将完全覆盖当前画布内容。是否确认继续？** | The current canvas already contains {pages} artboard page(s). Creating a new form will overwrite all current canvas contents. Are you sure you want to continue? | **当前画布已存在 {pages} 个页面，新建操作将清空当前内容，是否继续？** | **The canvas already contains {pages} page(s). Creating a new form will overwrite all contents. Continue?** | 📍 **定位**：覆盖确认详细警示说明。<br>📏 **距离把控**：段落行高 `leading-relaxed text-xs text-slate-600 my-2`。 |
| **确定覆盖** | Confirm Overwrite | **确认覆盖并新建** | **Overwrite & Create** | 📍 **定位**：覆盖确认的红色高危确认按钮。<br>📏 **距离把控**：按钮内边距 `px-4 h-8`，与取消按钮间隙 `gap-3`。 |
| **手机设备模拟器中体验表单交互与验证** | Experience responsive mobile form interactions and validations | **在真实手机模型中体验表单交互与校验** | **Experience interactive mobile preview and validation** | 📍 **定位**：预览弹窗左侧手机模型顶部的副标题说明。<br>📏 **距离把控**：预览弹窗全屏覆盖，居中手机容器尺寸 `390px * 780px`，带刘海屏仿真阴影 `shadow-2xl`。 |
| **重新填写表单** | Refill Form | **清空并重新填写** | **Reset & Refill** | 📍 **定位**：手机预览模型底部的重置输入快捷按钮。<br>📏 **距离把控**：居中浅灰文字按钮，上下边距 `py-2 text-xs`。 |

---

## 七、 校验提示与智能兜底引擎 (Validation & Smart Fallback)

| 中文 (当前) | 英文 (当前) | 中文替换成 (推荐) | 英文替换成 (推荐) | 详情（截图定位）与距离把控 |
| :--- | :--- | :--- | :--- | :--- |
| **必填项不能为空** | This required field cannot be empty | **此项为必填项** | **This field is required** | 📍 **定位**：通用单行/多行/文本输入未填时的红色报错文字。<br>📏 **距离把控**：位于输入框正下方，字体 `text-[11px] text-red-500 leading-none mt-1`，预留 `min-h-[16px]` 防止出现布局跳动（CLS）。 |
| **请选择一个选项** | Please select an option | **请选择一个选项** | **Please select an option** | 📍 **定位**：单选框组、下拉框（单选模式）未选报错。<br>📏 **距离把控**：位于选项组下方，左对齐，与最底一个选项间距 `mt-1.5`。 |
| **请至少选择一个选项** | Please select at least one option | **请至少选择一项** | **Please select at least one choice** | 📍 **定位**：多选框组、多选下拉框未选报错。<br>📏 **距离把控**：同上。 |
| **最多只能选择 {count} 项** | Maximum {count} options allowed | **最多只可选择 {count} 项** | **Maximum {count} selections allowed** | 📍 **定位**：多选超出最大限制时的即时报错 Toast 或行内提示。<br>📏 **距离把控**：Toast 居中弹出，内边距 `px-3 py-1.5 rounded-lg shadow-md`。 |
| **请输入有效的邮箱地址** | Please enter a valid email | **请输入正确的邮箱格式** | **Please enter a valid email address** | 📍 **定位**：邮箱输入不合规时的校验报错。<br>📏 **距离把控**：失焦（Blur）后即时触发，字距紧凑。 |
| **手机号位数与格式不合规** | Invalid phone number format | **手机号格式不符合国际规范** | **Invalid phone number for selected region** | 📍 **定位**：手机组件开启严格校验且格式不符合该国标准时的报错。<br>📏 **距离把控**：位于电话输入组件底部，红字 `text-[11px]`。 |
| **请完成手写签名** | Please complete handwritten signature | **请在签名板上手写签名** | **Handwritten signature is required** | 📍 **定位**：手写签名板必填未签时的报错。<br>📏 **距离把控**：位于签名感应板灰色方框底部，间距 `mt-1.5`。 |
| **请确认并同意声明条款** | Please agree to the declarations | **请仔细阅读并勾选同意条款** | **Please read and agree to all clauses** | 📍 **定位**：声明条款必填未全选时的报错。<br>📏 **距离把控**：位于最后一个复选声明条目下方 `mt-2`。 |

---

## 🛠️ 后续代码落地与批量替换指引

如需将上述“中文替换成”与“英文替换成”应用到工程中，可在以下核心源文件中一键完成更新：

1. **核心字典源文件**：`src/core/i18n.ts`（包含 `systemMessages.zh` 与 `systemMessages.en` 完整键值对）；
2. **组件物料注册表**：`src/registry/components.ts`（包含各组件的默认标题 `label`、`label_en` 与默认占位符）；
3. **操作引导文案**：`src/utils/useAppTour.ts`（包含 8 个步骤的 driver.js 引导标题与描述段落）；
4. **场景模板预设**：`src/templates/recommend.ts`（包含各模板的名称与副标题描述）。
