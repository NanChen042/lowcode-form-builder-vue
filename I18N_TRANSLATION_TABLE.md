# 系统多语言翻译对照表

> **多语言体系与架构说明**：
> 1. **PC 端低代码表单设计器（管理端）**：面向企业管理员与表单设计者，支持 **中英文双语 (`zh` / `en`)** 自由切换，Arco Design 组件库全套语言包联动。
> 2. **表单组件、默认移动端样例与移动端填报端（运行端）**：面向全球跨国业务填报与终端客户，底层架构**完整支持 16 种国际语言**，覆盖标准 BCP 47 语言码：
>    - **亚太核心 4 语**：简体中文 (`zh`)、英语 (`en`)、繁体中文 (`zh-Hant`)、马来语 (`ms`)
>    - **东南亚本地化 4 语**：印度尼西亚语 (`id`)、泰语 (`th`)、越南语 (`vi`)、泰米尔语 (`ta`)
>    - **东亚与南亚高潜 3 语**：日语 (`ja`)、韩语 (`ko`)、印地语 (`hi`)
>    - **欧美与全球主要 5 语**：西班牙语 (`es`)、法语 (`fr`)、德语 (`de`)、葡萄牙语 (`pt`)、俄语 (`ru`)
> 3. **表单发布与终端呈现联动机制**：
>    - 移动端顶部多语言切换器根据表单发布时配置的 `enabledLocales`（已启用语言列表）动态呈现国旗与母语原生名称。
>    - 切换语言后，所有系统级按钮（上一步/下一步/提交/重新浏览等）、预审基本资料卡片、手写签名板、国家/地区/区号级联搜索以及系统内置校验提示均 100% 自动匹配对应母语，无缝适配。
> 4. **文档查阅指引**：
>    - **第 1 ~ 27 节**：PC 端设计器界面的中英对照文案（已同步补充最新欢迎向导卡片、适用对象锁定提示、固定页面说明等 19 个最新词条）。
>    - **第 28.1 节**：移动端亚太核心 4 语精细化校对表（包含业务日常最高频的审核与“替换成”建议列）。
>    - **第 28.2 节**：移动端全球 12 语拓展对照表（按出海目标市场大区分为 3 张独立子表，并支持展开/折叠，防止横向爆版）。
>    - **第 29 节**：系统统一校验提示（16 国语言内置映射，无需人工配置）。

## 通用与状态
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 未命名页面 | Untitled Page |  |  |  |
| 未命名字段 | Untitled Field |  |  |  |
| 提示 | Notice |  |  |  |
| 已签字 | Signed |  |  |  |
| 清除签名 | Clear Signature |  |  |  |
| 点击此处手写签名 | Click to sign |  |  |  |
| 长期 | Long-term |  |  |  |
| 长期有效 | Permanent |  |  |  |
| 系统预设 | System Preset |  |  |  |
| 不可放置 | Cannot Drop |  |  |  |
| 基础资料 | Basic Info |  |  |  |
| 只读核验 | Read-only |  |  |  |
| 取消 | Cancel |  |  |  |
| 确定 | Confirm |  |  |  |
| 页 | Pages |  |  |  |
| 个字段 | fields |  |  |  |
| 项 | options |  |  |  |
| 共 {count} 项 | {count} options |  |  |  |
| 上一步 | Previous |  |  |  |
| 确认 & 下一步 | Confirm & Next |  |  |  |
| 下一步 | Next Step |  |  |  |
| 新加坡 | Singapore |  |  |  |
| 预置核验节点 | Pre-filled Baseline |  |  |  |
| 开始日期 | Start Date |  |  |  |
| 结束日期 | End Date |  |  |  |
| 最多只能选择 {count} 项 | Maximum {count} items allowed |  |  |  |
| 最多只能选择 {count} 项 | Maximum {count} items allowed |  |  |  |
| 搜索国家/地区、国籍名称、代码或区号 (如 中国, 新加坡籍, SG, +86)... | Search by country/region, nationality, code or dial code (e.g. Singapore, SG, +65)... |  |  |  |
| 国家 | Country |  |  |  |
| 国籍 | Nationality |  |  |  |
| 代码 | Code |  |  |  |
| 国际区号 | Dial Code |  |  |  |
| 未找到匹配的数据记录 | No matching records found |  |  |  |
| 共 | Total |  |  |  |
| 个预设国家与地区 | countries & regions |  |  |  |
| 预设清单 | Preset List |  |  |  |
| 关闭 | Close |  |  |  |
| 系统内置 | Built-in |  |  |  |
| 本列表以 ISO 3166-1 标准及联合国相关名称资料为基础，仅用于信息采集，不代表本平台对任何国家或地区法律地位的立场。 | This list is based on ISO 3166-1 and relevant United Nations naming references. It is intended solely for data collection and does not imply any position by this platform regarding the legal status of any country or region. |  |  |  |

## 顶部导航栏
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 风险评估设计工作台 | Risk Assessment Workspace |  |  |  |
| 表单设计工作台 | Form Design Workspace |  |  |  |
| 有未保存变更 | Unsaved Changes |  |  |  |
| 已保存至草稿 | Saved to draft |  |  |  |
| 正在保存... | Saving... |  |  |  |
| 保存至草稿 | Save to Draft |  |  |  |
| 预览 | Preview |  |  |  |
| 发布表单 | Publish Form |  |  |  |
| 面板布局设置 | Panel Settings |  |  |  |
| 左侧物料库 | Component Library |  |  |  |
| 右侧属性面板 | Properties Panel |  |  |  |
| 请输入表单名称 | Enter form title |  |  |  |
| 点击修改表单名称 | Click to rename form |  |  |  |
| 修改表单名称 | Rename form |  |  |  |
| 操作指南 | User Guide |  |  |  |
| 保存失败，请检查网络或重试 | Save failed, please check network or try again |  |  |  |
| 未命名表单 | Untitled Form |  |  |  |
| 多语言发布校验提醒 | Translation Incomplete Warning |  |  |  |
| 当前表单还有 {count} 项内容尚未完成英文翻译。 | There are {count} items missing English translation. |  |  |  |
| ...以及其他 {count} 项未翻译内容 | ...and {count} more items |  |  |  |
| 前往完善翻译 | Complete Translations |  |  |  |
| 仍然发布 | Publish Anyway |  |  |  |
| 未翻译 | Untranslated |  |  |  |
| 翻译管理说明 | Translation Management Guide |  |  |  |
| 管理表单各语言翻译内容。您可以在翻译工作台中对照编辑源语言与目标语言文案。填表人打开表单时，可通过语言切换按钮自由切换多语言。 | Manage form translations across languages. You can edit source and target language copies side-by-side in the translation workspace. Respondents can toggle languages via the top-right button. |  |  |  |
| 多语言 KYC 问卷操作演示 | Multilingual KYC Questionnaire Video Tutorial |  |  |  |
| 温馨提示：进入翻译管理后，可配置对应表单语言版本。 | Tip: You can configure corresponding form language versions in Translation Management. |  |  |  |

## 用户下拉菜单
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 退出登录 | Sign Out |  |  |  |
| 系统管理员 | System Administrator |  |  |  |

## 侧边栏物料库
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 查找组件或模块... | Search components... |  |  |  |
| 未找到匹配的组件 | No matching components found |  |  |  |
| 基础输入 | Basic Inputs |  |  |  |
| 业务组件 | Business Components |  |  |  |
| 收起 | Collapse |  |  |  |
| 组件 | Components |  |  |  |
| 模板 | Templates |  |  |  |
| 页面 | Page |  |  |  |
| 搜索 | Search |  |  |  |
| 搜索模板名称... | Search templates... |  |  |  |
| 新建空白画布 | Create Blank Canvas |  |  |  |
| 从零开始自由搭建表单 | Build form from scratch |  |  |  |
| 预置场景模板 | Preset Scenarios |  |  |  |
| 添加新画板页面 | Add Canvas Page |  |  |  |
| 模板已载入 | Template loaded |  |  |  |
| 已添加新画板页面 | New canvas page added |  |  |  |
| 画板已删除 | Canvas page deleted |  |  |  |
| 确定删除此画板页面？ | Are you sure you want to delete this canvas page? |  |  |  |
| 系统预置 | System Preset |  |  |  |
| 组件已添加到画布 | Component added to canvas |  |  |  |
| 组件库 | Component Library |  |  |  |
| 场景模板库 | Templates |  |  |  |
| 页面大纲 | Pages |  |  |  |
| 点击或拖拽至画布 | Drag or click to canvas |  |  |  |
| 标准 KYC 问卷 | KYC Standards |  |  |  |
| 拖拽拉伸物料库面板宽度 | Drag to resize material sidebar |  |  |  |
| 选用模板 | Use Template |  |  |  |
| 覆盖确认 | Confirm Overwrite |  |  |  |
| 当前画布已包含 {pages} 个画板页面，载入新预置模板将会完全覆盖当前画布内容。是否确认继续？ | The current canvas already contains {pages} artboard page(s). Loading a new template will overwrite current canvas contents. Are you sure you want to continue? |  |  |  |
| 确定覆盖 | Confirm Overwrite |  |  |  |
| 固定页面 | Fixed Page |  |  |  |

## 画布与画板交互
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 提示：画布模式下编辑的是默认语言（英文）内容，请使用英文填写所有组件内容。 | Note: In canvas mode, you are editing content in the default language (English). Please enter all component content in English. |  |  |  |
| 请在此处手写签名 | Please sign here |  |  |  |
| 可放置画布 | Droppable Canvas |  |  |  |
| 系统预设步骤 · 不可添加组件 | System Preset · Cannot Drop |  |  |  |
| 请将组件拖拽至右侧常规表单画布中 | Please drag components to subsequent form canvases |  |  |  |
| 画布当前为空 | Canvas is currently empty |  |  |  |
| 拖拽左侧基础输入或业务组件即可在这里生成并预览表单 | Drag and drop components from the left sidebar to start building |  |  |  |
| 在右侧添加新页面 | Add new page to the right |  |  |  |
| 正在初始化画布... | Initializing canvas... |  |  |  |
| 展开侧边栏 | Expand Sidebar |  |  |  |
| 展开右侧属性面板 | Expand Properties |  |  |  |
| 放大画布 | Zoom in |  |  |  |
| 缩小画布 | Zoom out |  |  |  |
| 缩放到 100% | Zoom to 100% |  |  |  |
| 适应画布全貌 | Zoom to Fit |  |  |  |
| 缩放到选中项 | Zoom to Selection |  |  |  |
| 个人案例 | Individual Case |  |  |  |
| 实体案例 | Entity Case |  |  |  |
| 母案例 | Customer |  |  |  |
| 中文待补齐清单 | Chinese Completion Checklist |  |  |  |
| 英文待翻译清单 | English Translation Checklist |  |  |  |
| 共 {count} 项 | {count} item(s) in total |  |  |  |
| 定位补齐 | Locate & Fill |  |  |  |
| 暂时忽略 | Ignore for now |  |  |  |
| {count} 项中文未填写 | {count} Chinese field(s) empty |  |  |  |
| {count} 项英文未翻译 | {count} English translation(s) missing |  |  |  |
| 若选「{option}」 | If "{option}" is selected |  |  |  |
| 是 | Yes |  |  |  |
| 否 | No |  |  |  |
| 下一项 ({current}/{total}) | Next ({current}/{total}) |  |  |  |
| 条件从属项：位置已锁定并跟随父级联动 | Conditional Dependent: Position locked and follows parent trigger |  |  |  |
| 2级 | Level 2 |  |  |  |
| 返回表单内容 | Back to Content |  |  |  |
| 已复制所选组件 (Ctrl+D) | Component duplicated (Ctrl+D) |  |  |  |
| 请先在画布中选中要复制的组件 | Please select a component on canvas to duplicate |  |  |  |
| 固定页面 · 不可添加组件 | Fixed Page · Cannot Add Fields |  |  |  |

## 右键上下文菜单
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 复制组件 | Duplicate |  |  |  |
| 插入组件 | Insert Component |  |  |  |
| 关联组件 | Link Component |  |  |  |
| 解除关联 | Unlink |  |  |  |
| 删除组件 | Delete Component |  |  |  |
| 系统预设资料 | System Preset |  |  |  |
| 添加表单组件 | Add Component |  |  |  |
| 在当前画布后方插入 | Insert Page After |  |  |  |
| 重置画布视角 | Reset View |  |  |  |
| 删除当前画布 | Delete Current Canvas |  |  |  |
| 新建画布页面 | New Blank Page |  |  |  |
| 确认删除画布 | Confirm Delete Canvas |  |  |  |
| 确定要删除当前画布及其所有内容吗？此操作不可撤销。 | Are you sure you want to delete this canvas and all its contents? This action cannot be undone. |  |  |  |
| 确认删除 | Delete |  |  |  |

## 属性面板：基础属性
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 属性配置 | Properties |  |  |  |
| 组件字段属性设置 | Component Field Settings |  |  |  |
| 未选中组件 | No Element Selected |  |  |  |
| 点击画布中的字段开始编辑 | Click any field on the canvas to edit |  |  |  |
| 基础信息 | Basic Information |  |  |  |
| 设置字段标题、展示与校验 | Configure field label, display and validation |  |  |  |
| 画布设置 | Canvas Settings |  |  |  |
| 删除当前页面 | Delete Page |  |  |  |
| 字段标题 | Field Label |  |  |  |
| 请输入字段标题 | Enter field label |  |  |  |
| 副标题 | Help Text |  |  |  |
| 请输入副标题或补充说明 | Enter subtitle or explanation |  |  |  |
| 排布方式 | Layout |  |  |  |
| 标题右侧 | Inline |  |  |  |
| 标题下方 | Below |  |  |  |
| 标题右侧显示（默认同排浅灰色小字） | Inline on right (default light gray text) |  |  |  |
| 标题下方换行显示 | Below title (new line) |  |  |  |
| 控制副标题排布方式：可选标题右侧显示（默认同排浅灰色小字）或标题下方换行显示。 | Control subtitle placement: inline beside title or on a new line below title. |  |  |  |
| 显示标题 | Show Label |  |  |  |
| 关闭后，表单页面上将隐藏该标题；但在数据导出、后台报表和联动条件选择时，仍会使用此字段标题作为唯一标识。 | When disabled, the title is hidden on the form, but still used for backend auditing, data export headers, and logic rules. |  |  |  |
| 前台已隐藏展示，此名称仅用于后台数据导出与联动识别 | Hidden on form; used only for data export and logic references |  |  |  |
| 设为必填 | Required |  |  |  |
| 开启后，该字段为必须填写项，未填写无法提交。 | When enabled, this field is mandatory for submission. |  |  |  |
| 声明条款必填 | Declarations Required |  |  |  |
| 开启后，用户必须勾选同意所有声明复选条款才能提交表单。 | When enabled, user must agree to all declarations. |  |  |  |
| 未填校验提示 | Validation Message |  |  |  |
| 自定义提示 | Customize |  |  |  |
| 系统默认提示 | System Default |  |  |  |
| 用户提交表单未填写此项时的校验报错提示 | Error message displayed when the field is left empty on submission |  |  |  |
| 动图效果预览区域 | GIF Preview Area |  |  |  |
| 恢复默认 | Reset to Default |  |  |  |
| 未同意声明提示 | Declaration Error Message |  |  |  |
| 占位提示 | Placeholder |  |  |  |
| 启用长期选项 | Enable Long-term Option |  |  |  |
| 开启后在单日期输入框右侧显示“长期”选项，勾选后免填截止时间（起止日期模式自动停用）。 | Show a "Long-term" checkbox next to single date input (disabled in date range mode). |  |  |  |
| 默认勾选长期 | Default to Long-term |  |  |  |
| 开启后用户填表时默认自动勾选长期有效，免填日期。 | Default to long-term checked when filling form, bypassing date requirement. |  |  |  |
| 添加选项 | Add Option |  |  |  |
| 添加条款内容 | Add Clause |  |  |  |
| 并排 | Inline |  |  |  |
| 堆叠 | Stacked |  |  |  |
| 开启多选 | Allow Multi-selection |  |  |  |
| 开启后支持在下拉框中选择多个选项。 | Allow selecting multiple choices from the dropdown. |  |  |  |
| 默认国际区号 | Default Dial Code |  |  |  |
| 复制 | Duplicate |  |  |  |
| 删除 | Delete |  |  |  |
| 收起属性面板 | Collapse panel |  |  |  |
| 系统预设 | System Preset |  |  |  |
| 系统前置 · 基础资料 | System Baseline · Basic Info |  |  |  |
| 已锁定 | Locked |  |  |  |
| 确定要删除当前画布页面吗？此操作不可撤销。 | Are you sure you want to delete this canvas page? This cannot be undone. |  |  |  |
| 预设国籍 | Preset Nationalities |  |  |  |
| 预设国家 | Preset Countries |  |  |  |
| 查看 | View |  |  |  |
| 字段 | Field |  |  |  |
| 客户案例 | Client Case |  |  |  |
| 实体案例 | Entity Case |  |  |  |
| 个人案例 | Individual Case |  |  |  |
| 该节点为系统预置前置核验步骤，内容与逻辑由系统固化，不支持修改属性配置。 | This node is a system-level pre-check step with fixed logic. Property modification is not supported. |  |  |  |
| 请选择国家/地区 | Select Country/Region |  |  |  |
| 请选择国籍 | Select Nationality |  |  |  |
| 展开规则 | Display Rule |  |  |  |
| 当 | When |  |  |  |
| 选择 | selects |  |  |  |
| 时展开 | reveal this field |  |  |  |
| 且 | AND |  |  |  |
| 或 | OR |  |  |  |
| 全部满足 | Match All |  |  |  |
| 任一满足 | Match Any |  |  |  |
| 移除此项条件 | Remove this condition |  |  |  |
| 未满足条件时在填表端默认折叠隐藏 | Hidden by default until conditions are met |  |  |  |
| 点击定位画布上游组件 | Click to locate upstream component on canvas |  |  |  |
| 确定解除与该选项的展开联动吗？解除后该组件将恢复为常驻显示。 | Unlink this condition? The field will become permanently visible. |  |  |  |
| 解除联动 | Unlink |  |  |  |
| 拖拽拉伸属性面板宽度 | Drag to resize property panel |  |  |  |
| 行数范围 | Row Range |  |  |  |
| 设置多行文本框自适应行高区间（最小行数 ~ 最大行数）。初始呈现最小行数，内容增多时自动拉伸，超出最大行数后出现滚动条。 | Set textarea adaptive row height range (min rows ~ max rows). Initially renders min rows, automatically expands as content increases, and scrolls when exceeding max rows. |  |  |  |
| 行 | rows |  |  |  |
| 默认 800 | Default 800 |  |  |  |
| 字 | chars |  |  |  |
| 未翻译 | Untranslated |  |  |  |
| 系统内置 | Built-in |  |  |  |

## 属性面板：特定组件属性
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 签名板必填 | Signature Required |  |  |  |
| 开启后，用户必须在手写感应板中签名。 | When enabled, user must sign in the signature pad. |  |  |  |
| 未签名提示 | Missing Signature Message |  |  |  |
| 签名提示文案 | Signature Prompt Text |  |  |  |
| 手写区内提示文案 | Signature Pad Placeholder |  |  |  |
| 日期选择提示 | Date Picker Placeholder |  |  |  |
| 开始日期提示文案 | Start Date Placeholder |  |  |  |
| 截止日期提示文案 | End Date Placeholder |  |  |  |
| 长期选项文案 | Long-term Option Text |  |  |  |
| 日期模式 | Date Mode |  |  |  |
| 设置日期选择方式，可切换为单日期选择或起止日期范围选择。 | Configure date selection mode: single date or date range. |  |  |  |
| 单日期 | Single Date |  |  |  |
| 起止日期 | Date Range |  |  |  |
| 提示内容 | Notice Content |  |  |  |
| 直接输入告示或说明文本，支持自然换行。行首以“- ”开头自动生成无序列表，支持 [文字](链接) 插入超链接。 | Enter notice text directly. Lines starting with "- " create bullet points. Supports [Link](url) hyperlinks. |  |  |  |
| 请输入提示内容...\n- 以“- ”开头自动生成列表项\n- 支持 [链接文案](xxx.com) 插入超链接 | Enter notice content...\n- Start with "- " for list items\n- Supports [Link Text](xxx.com) hyperlinks |  |  |  |
| 请输入提示内容 | Please enter notice content |  |  |  |
| 列表项 | Bullet |  |  |  |
| 超链接 | Link |  |  |  |
| 最大允许选择数 | Max Allowed Selections |  |  |  |
| 格式类型 | Format Type |  |  |  |
| 设置单行文本的输入格式，可选择普通文本或纯数字。 | Set single line input format: normal text or number. |  |  |  |
| 文本 | Text |  |  |  |
| 数字 | Number |  |  |  |
| 邮箱占位提示 | Email Placeholder |  |  |  |
| 请输入邮箱 | Please enter email |  |  |  |
| 国家/国籍组件最多允许选择 3 项 | Country/Nationality component allows up to 3 selections |  |  |  |
| 最多允许选择 {count} 项（不超过配置选项数） | Up to {count} selections allowed (within available options) |  |  |  |
| 最大字数 | Max Length |  |  |  |
| 限制最多输入的字符数，默认为 800 字（留空则继承默认 800，可自定义或调大）。 | Limit the maximum number of characters allowed. Default is 800 (leave blank to inherit default 800, customizable). |  |  |  |
| 圆点列表 (无序) | Bullet List (Unordered) |  |  |  |
| 数字列表 (有序) | Numbered List (Ordered) |  |  |  |
| 提示文字 | Link Text |  |  |  |

## 属性面板：页面属性
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 画布页面全局设置 | Page Canvas Settings |  |  |  |
| 页面大标题 | Page Title |  |  |  |
| 页面说明文案 | Page Description |  |  |  |
| 页面 | Page |  |  |  |
| 请输入页面标题 | Enter page title |  |  |  |
| 显示在标题下方的副标题或补充说明 | Subtitle or description displayed below the title |  |  |  |
| 基本资料展示页 | Basic Information Page |  |  |  |
| 该页面展示系统自动带出的客户基本资料，填报人仅查看核对，不支持在此修改或删减。 | This page displays auto-populated client basic information as read-only and cannot be edited here. |  |  |  |

## 选项与级联联动
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 选项配置 | Option Settings |  |  |  |
| 设置列表的具体选项，选项名称用于展示给用户。 | Configure choices displayed to users. |  |  |  |
| 声明条款 | Declaration Clauses |  |  |  |
| 配置要求用户阅读并确认的声明条款。 | Configure legal declaration clauses for user acknowledgment. |  |  |  |
| 排布方式 | Layout |  |  |  |
| 删除选项 | Delete Option |  |  |  |
| 请输入提示或声明内容... | Enter notice or declaration text... |  |  |  |
| 按住拖拽排序 (选项 {index}) | Drag to reorder Option {index} |  |  |  |
| 点击切换默认选中项 | Click to toggle default selection |  |  |  |
| 点击切换默认勾选 | Click to toggle default check |  |  |  |
| 设置选择【{name}】时展开的表单组件 | Configure fields to reveal when choosing [{name}] |  |  |  |
| 选择【{name}】时触发显示 | Reveal when selecting [{name}] |  |  |  |
| 选择想要添加的展开组件： | Add new followup field to reveal: |  |  |  |
| 或勾选已有下游组件： | Or select existing downstream fields: |  |  |  |
| 展开: {name} | Reveal: {name} |  |  |  |
| 此项 | This option |  |  |  |
| 请输入声明条款内容（条款 {index}） | Enter declaration terms (Clause {index}) |  |  |  |
| 解除关联 | Unlink |  |  |  |
| 已达到最大追问层级（最多支持 2 级嵌套）。为保障移动端填写体验与表单性能，不可继续向下嵌套。 | Maximum nesting depth reached (up to 2 levels). Cannot add deeper sub-questions to ensure optimal form performance and mobile usability. |  |  |  |
| 已达最大追问层级（最多支持2级嵌套） | Max nesting depth reached (up to 2 levels) |  |  |  |

## 系统预设资料页
| 中文 | 英文 | 繁体中文 | 马来语 | 中文替换成 | 英文替换成 | 繁体替换成 | 马来语替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 根据合规监管要求，您需要完成KYC问卷填写。 | According to regulatory compliance requirements, you need to complete the KYC questionnaire. | 根據合規要求，您需要填寫 KYC 問卷。 | Mengikut keperluan pematuhan kawal selia, anda perlu melengkapkan soal selidik KYC. |  |  |  |  |  |
| 您将作为以下公司的授权代表，完成KYC问卷填写。 | You will complete the KYC questionnaire as the authorized representative of the company below. | 您將作為以下公司的授權代表填寫 KYC 問卷。 | Anda akan melengkapkan soal selidik KYC sebagai wakil sah bagi syarikat di bawah. |  |  |  |  |  |
| 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please verify if the following information is accurate. If modification is required, contact your service provider before proceeding. | 請確認以下信息是否準確，如需修改請聯繫服務商修改後再進行下一步。 | Sila sahkan sama ada maklumat berikut adalah tepat. Jika pengubahsuaian diperlukan, sila hubungi pembekal perkhidmatan anda sebelum meneruskan. |  |  |  |  |  |
| 客户母案例注册基本信息 | Customer Registration Information | 客戶註冊信息 | Maklumat Pendaftaran Pelanggan |  |  |  |  |  |
| 公司注册基本信息 | Corporate Registration Information | 企業註冊信息 | Maklumat Pendaftaran Korporat |  |  |  |  |  |
| 基本资料 | Basic Information | 基本信息 | Maklumat Asas |  |  |  |  |  |
| 授权代表 | Authorized Representative | 授權代表 | Wakil Sah |  |  |  |  |  |
| 关联信息 | Associated Information | 關聯信息 | Maklumat Berkaitan |  |  |  |  |  |
| 关联实体 | Associated Entity | 關聯實體 | Entiti Berkaitan |  |  |  |  |  |
| 关联类型 | Relationship Type | 關聯類型 | Jenis Hubungan |  |  |  |  |  |
| 股东 | Shareholder | 股東 | Pemegang Saham |  |  |  |  |  |
| 董事 | Director | 董事 | Pengarah |  |  |  |  |  |
| 合伙人 | Partner | 合夥人 | Rakan Kongsi |  |  |  |  |  |
| 股份与出资信息 | Shareholding & Capital Info | 股份與出資信息 | Maklumat Pegangan Saham & Modal |  |  |  |  |  |
| 股份类别 | Share Class | 股份類別 | Kelas Saham |  |  |  |  |  |
| 持有股份数 | Shares Held | 持股數量 | Bilangan Saham Dipegang |  |  |  |  |  |
| 对应已缴股本金额 | Allocated Paid-up Capital | 分配實繳資本額 | Jumlah Modal Berbayar Diperuntukkan |  |  |  |  |  |
| 姓名 | Full Name | 姓名 | Nama Penuh |  |  |  |  |  |
| 国籍语言姓名 | Native Language Name | 母語姓名 | Nama Bahasa Ibunda |  |  |  |  |  |
| 国籍 | Nationality | 國籍 | Kewarganegaraan |  |  |  |  |  |
| 新加坡身份类型 | Singapore Status | 新加坡身份 | Status Singapura |  |  |  |  |  |
| NRIC/FIN(如适用) | NRIC/FIN (if applicable) | NRIC/FIN(如有) | NRIC/FIN (jika berkenaan) |  |  |  |  |  |
| 证件类型 | ID Document Type | 證件類型 | Jenis Dokumen Pengenalan |  |  |  |  |  |
| 证件号码 | ID / Passport Number | 證件號碼 | Nombor Pengenalan / Pasport |  |  |  |  |  |
| 出生日期 | Date of Birth | 出生日期 | Tarikh Lahir |  |  |  |  |  |
| 性别 | Gender | 性別 | Jantina |  |  |  |  |  |
| 手机号码 | Phone Number | 手機號碼 | Nombor Telefon Bimbit |  |  |  |  |  |
| 电子邮箱 | Email Address | 電子郵箱 | Alamat E-mel |  |  |  |  |  |
| 居住地址 | Residential Address | 居住地址 | Alamat Kediaman |  |  |  |  |  |
| 联系地址 | Contact Address | 聯繫地址 | Alamat Surat-menyurat |  |  |  |  |  |
| 实体名称 | Entity Name | 實體名稱 | Nama Entiti |  |  |  |  |  |
| 曾用名(如有) | Former Name (if any) | 曾用名(如有) | Nama Dahulu (jika ada) |  |  |  |  |  |
| 注册地 | Jurisdiction of Incorporation | 註冊地 | Bidang Kuasa Pemerbadanan |  |  |  |  |  |
| 实体注册号码 | Entity Registration Number | 實體註冊號碼 | Nombor Pendaftaran Entiti |  |  |  |  |  |
| 注册地址 | Registered Address | 註冊地址 | Alamat Berdaftar |  |  |  |  |  |
| 授权代表身份 | Capacity / Role | 授權代表身份 | Kapasiti / Peranan Wakil Sah |  |  |  |  |  |
| 授权代表姓名 | Representative Name | 授權代表姓名 | Nama Wakil Sah |  |  |  |  |  |
| 新加坡公民 | Singapore Citizen | 新加坡公民 | Warganegara Singapura |  |  |  |  |  |
| 身份证 / 护照 | NRIC / Passport | 身份證 / 護照 | NRIC / Pasport |  |  |  |  |  |
| 男 | Male | 男 | Lelaki |  |  |  |  |  |
| 董事 / 高级管理人员 | Director / Senior Officer | 董事 / 高級管理人員 | Pengarah / Pegawai Kanan |  |  |  |  |  |
| NRIC(新加坡公民) | NRIC (Singapore Citizen) | NRIC (新加坡公民) | NRIC (Warganegara Singapura) |  |  |  |  |  |
| 提示 | Notice | 提示 | Notis |  |  |  |  |  |
| 根据合规监管要求，您需要完成KYC问卷填写。 | In accordance with regulatory compliance requirements, you are required to complete the KYC questionnaire. | 根據合規監管要求，您需要完成KYC問卷填寫。 | Selaras dengan keperluan pematuhan peraturan, anda dikehendaki melengkapkan soal selidik KYC. |  |  |  |  |  |
| 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please confirm whether the following information is accurate. If modifications are required, please contact the service provider before proceeding. | 請確認以下資訊是否準確，如需修改，請聯繫服務商修改後再進行下一步。 | Sila sahkan sama ada maklumat berikut adalah tepat. Jika pengubahsuaian diperlukan, sila hubungi pembekal perkhidmatan sebelum meneruskan. |  |  |  |  |  |
| 基本资料 | Basic Details | 基本資料 | Butiran Asas |  |  |  |  |  |
| 关联信息 | Relationship Information | 關聯資訊 | Maklumat Hubungan |  |  |  |  |  |
| 股份与出资信息 | Shareholding & Capital Information | 股份與出資資訊 | Maklumat Pegangan Saham & Modal |  |  |  |  |  |
| 持有股份数 | Number of Shares Held | 持有股份數 | Bilangan Saham Dipegang |  |  |  |  |  |
| 对应已缴股本金额 | Allocated Paid-up Amount | 對應已繳股本金額 | Jumlah Modal Berbayar Diperuntukkan |  |  |  |  |  |
| 企业注册全称 | Company Name | 企業註冊全稱 | Nama Syarikat |  |  |  |  |  |
| 统一机构识别码 (UEN) | UEN | 統一機構識別碼 (UEN) | Nombor Pengenalan Entiti Unik (UEN) |  |  |  |  |  |
| 注册设立国家 | Country of Incorporation | 註冊設立國家 | Negara Pemerbadanan |  |  |  |  |  |
| 法律实体形式 | Entity Type | 法律實體形式 | Jenis Entiti Undang-Undang |  |  |  |  |  |
| 实体注册号码 | Registration Number | 實體註冊號碼 | Nombor Pendaftaran Entiti |  |  |  |  |  |
| 注册地 | Place of Incorporation | 註冊地 | Bidang Kuasa Pemerbadanan |  |  |  |  |  |
| 授权代表身份 | Authorised Representative Role | 授權代表身份 | Kapasiti / Peranan Wakil Sah |  |  |  |  |  |
| 授权代表姓名 | Authorized Representative | 授權代表姓名 | Nama Wakil Diberi Kuasa |  |  |  |  |  |
| 官方联络邮箱 | Contact Email | 官方聯絡信箱 | E-mel Rasmi |  |  |  |  |  |
| 企业注册地址 | Registered Address | 企業註冊地址 | Alamat Berdaftar Syarikat |  |  |  |  |  |
| 姓名 | Name | 姓名 | Nama |  |  |  |  |  |
| 国籍语言姓名 | Native Name | 國籍語言姓名 | Nama Bahasa Asal |  |  |  |  |  |
| 新加坡身份类型 | Singapore Identity Status | 新加坡身分類型 | Status Identiti Singapura |  |  |  |  |  |
| NRIC/FIN(如适用) | NRIC/FIN | NRIC/FIN(如適用) | NRIC/FIN (jika berkenaan) |  |  |  |  |  |
| 证件类型 | ID Type | 證件類型 | Jenis Pengenalan |  |  |  |  |  |
| 证件号码 | ID Number | 證件號碼 | Nombor Dokumen |  |  |  |  |  |
| 电子邮箱 | Email | 電子郵件 | E-mel |  |  |  |  |  |
| 最终受益人 | Ultimate Beneficial Owner | 最終受益人 | Pemilik Manfaat Muktamad |  |  |  |  |  |
| 普通股 | Ordinary Shares | 普通股 | Saham Biasa |  |  |  |  |  |
| 优先股 | Preference Shares | 優先股 | Saham Keutamaan |  |  |  |  |  |
| 新加坡籍 | Singaporean | 新加坡籍 | Warganegara Singapura |  |  |  |  |  |

## 欢迎向导弹窗
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| DIY 表单设计器 | DIY Form Builder |  |  |  |
| 风险评估表单设计器 | Risk Assessment Form Builder |  |  |  |
| 快捷新建 | Create NEW |  |  |  |
| 新建空白画布 | Create Blank Canvas |  |  |  |
| 点击左下方立即创建按钮，开始创建您的第一个定制表单。 | Click the "Create Now" button at the bottom left to start creating your first custom form. |  |  |  |
| 新建风险评估表单 | Create Risk Assessment Form |  |  |  |
| 基于 Yes / No / Not Applicable 三态判定与 1~10 分动态权重，快速配置客户、个人或实体的合规问卷。 | Configure compliance risk forms for Customer, Individual, or Entity profiles with Yes / No / Not Applicable logic and dynamic scoring weights. |  |  |  |
| 立即创建 | Create Now |  |  |  |
| 选择模板 | Select Template |  |  |  |
| 使用模板快速创建，提升设计效率 | Create quickly with templates to boost design efficiency |  |  |  |
| 适用于客户身份认证、KYC 相关的业务场景。 | Suitable for customer identification and KYC-related scenarios. |  |  |  |
| 适用于个人用户信息采集、身份验证等场景。 | Suitable for personal user data collection and identity verification. |  |  |  |
| 适用于实体成员、企业信息采集等场景。 | Suitable for corporate clients and enterprise information collection. |  |  |  |
| 覆盖确认 | Confirm Overwrite |  |  |  |
| 当前画布已包含 {pages} 个画板页面，载入 {title} 将完全覆盖当前画布内容。是否确认继续？ | The current canvas already contains {pages} artboard page(s). Applying {title} will overwrite all current canvas contents. Are you sure you want to continue? |  |  |  |
| 确定覆盖 | Confirm Overwrite |  |  |  |
| {count} 页面 | {count} Pages |  |  |  |
| {count} 字段 | {count} Fields |  |  |  |
| 客户案例 KYC 模板 | Customer KYC Template |  |  |  |
| 客户案例 | Customer |  |  |  |
| 涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。 | Covers business activities, sales volume, funding source, listed company stock code linkage, and authorized signature. |  |  |  |
| 3 页面 · 9 字段 | 3 Pages · 9 Fields |  |  |  |
| 个人案例 KYC 模板 | Individual KYC Template |  |  |  |
| 个人案例 | Individual Case |  |  |  |
| 涵盖最终受益所有人(UBO)、PEP政治公众人物、犯罪记录声明与手写签名确认。 | Covers Ultimate Beneficial Owner (UBO), PEP declaration, criminal records, and signature. |  |  |  |
| 5 页面 · 22 字段 | 5 Pages · 22 Fields |  |  |  |
| 实体案例 KYC 模板 | Entity KYC Template |  |  |  |
| 实体案例 | Entity Case |  |  |  |
| 涵盖主营业务说明、年销售额、资金来源、上市公司股票代码联动及法人声明签署。 | Covers corporate business activities, sales volume, funding source, listed company stock code linkage, and authorized signature. |  |  |  |
| 涵盖客户、国家及服务交易三大风险维度（24 题）。 | Covers client, country, and service risk dimensions (24 questions). |  |  |  |
| 涵盖恐怖分子名单、制裁、PEP 及高风险国家（5 题）。 | Covers terrorist list, sanctions, PEP, and FATF high-risk checks (5 questions). |  |  |  |
| 涵盖恐怖分子名单、制裁、FATF 及高风险实体（4 题）。 | Covers terrorist list, sanctions, FATF, and higher-risk entity checks (4 questions). |  |  |  |
| {count} 题 | {count} Questions |  |  |  |
| 客户案例风险评估模板 | Customer Risk Template |  |  |  |
| 涵盖客户、国家及服务交易三大风险维度，共 3 个分组 24 道合规评估项。 | Covers client, country, and service risk factors across 3 groups (24 compliance questions). |  |  |  |
| 1 页面 · 24 题 | 1 Page · 24 Questions |  |  |  |
| 个人案例风险评估模板 | Individual Risk Template |  |  |  |
| 涵盖 MHA 恐怖分子名单、MAS 制裁名单、PEP 及高风险国家等 5 道评估项。 | Covers MHA terrorist list, MAS sanctions list, PEP, and FATF high-risk checks (5 questions). |  |  |  |
| 1 页面 · 5 题 | 1 Page · 5 Questions |  |  |  |
| 实体案例风险评估模板 | Entity Risk Template |  |  |  |
| 涵盖 MHA 恐怖分子名单、MAS 制裁名单、FATF 名单及高风险客户特征 4 道评估项。 | Covers MHA terrorist list, MAS sanctions list, FATF list, and higher-risk entity checks (4 questions). |  |  |  |
| 1 页面 · 4 题 | 1 Page · 4 Questions |  |  |  |
| 涵盖客户、国家及服务交易三大风险维度（34 题）。 | Covers client, country, and service risk dimensions (34 questions). |  |  |  |
| 从空白画布开始，自由搭建当前案例的 KYC 问卷。 | Start from a blank canvas and build the KYC questionnaire for this subject. |  |  |  |
| 从空白画布开始，自由配置当前案例的风险评估问题与权重。 | Start from a blank canvas and configure risk questions and weights for this subject. |  |  |  |
| 支持空白自定义或选用场景模板 | Start from scratch or use scenario templates |  |  |  |
| 支持空白自定义或选用预置模型 | Start from scratch or use preset models |  |  |  |

## 新建表单弹窗
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 新建表单画布 | New Form Canvas |  |  |  |
| 业务主体 | Profile Type |  |  |  |
| 表单名称 | Form Name |  |  |  |
| 客户案例 | Customer |  |  |  |
| 个人案例 | Individual Case |  |  |  |
| 实体案例 | Entity Case |  |  |  |
| 初始化所选主体的基本资料画板，后续可在画布中自由拖拽编排。 | Initializes basic profile artboard for the selected entity. You can freely orchestrate components on the canvas afterward. |  |  |  |
| 立即创建 | Create Canvas |  |  |  |
| 取消 | Cancel |  |  |  |
| 覆盖确认 | Confirm Overwrite |  |  |  |
| 当前画布已包含 {pages} 个画板页面，新建表单将完全覆盖当前画布内容。是否确认继续？ | The current canvas already contains {pages} artboard page(s). Creating a new form will overwrite all current canvas contents. Are you sure you want to continue? |  |  |  |
| 确定覆盖 | Confirm Overwrite |  |  |  |
| 表单画布创建成功 | Form canvas created successfully |  |  |  |
| 留空默认为：{title} | Default: {title} |  |  |  |

## 预览与发布
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 预览 | Preview |  |  |  |
| 发布结构 | Deploy Schema |  |  |  |
| 结构 JSON | Schema JSON |  |  |  |
| 表单步骤列表 | Form Steps |  |  |  |
| 预览效果仅供参考，实际显示可能因设备和浏览器不同而存在差异，请在移动端进行最终确认。 | Preview is for reference only. Actual display may vary depending on device and browser. Please verify on mobile devices. |  |  |  |
| 表单提交成功！ | Submitted successfully! |  |  |  |
| 当前页面暂无字段 | Current page has no fields |  |  |  |
| 表单验证 | Validate Form |  |  |  |
| 发布表单 | Publish Form |  |  |  |
| 请填写所有必填项并修正错误 | Please fill in all required fields |  |  |  |
| 发布失败 | Publish failed |  |  |  |
| 核对并确认表单基本信息与发布介绍，确认无误后即可发布生效。 | Verify and confirm form name and description before publishing. |  |  |  |
| 核对并确认风险评估表单基本信息，确认无误后即可发布生效。 | Verify and confirm risk assessment form details before publishing. |  |  |  |
| 表单名称 | Form Name |  |  |  |
| 请输入表单名称 (50字以内) | Enter form name (up to 50 chars) |  |  |  |
| 英文表单名称 | English Form Name |  |  |  |
| Enter English form name | Enter English form name |  |  |  |
| 表单描述 / 介绍 | Form Description |  |  |  |
| 向填表人介绍该表单的用途、填表须知或隐私声明（将展示在表单首屏）... | Introduce the purpose of the form, guidelines, or notices (displayed on first screen)... |  |  |  |
| 英文表单描述 | English Description |  |  |  |
| Introduce the purpose of the form, guidelines, or notices... | Introduce the purpose of the form, guidelines, or notices... |  |  |  |
| 表单名称不能为空 | Form name is required |  |  |  |
| 表单名称已存在，请更换名称 | Form name already exists, please use another name |  |  |  |
| 确认发布 | Confirm Publish |  |  |  |
| 表单发布成功！ | Form Published Successfully! |  |  |  |
| 表单模板已发布生效。您可通过下方链接在新窗口预览移动端效果，或直接返回表单设置页面。 | The form template is now live. You can preview the mobile experience via the link below, or return to form settings. |  |  |  |
| 风险评估表单已发布生效。您可以关闭当前页面后刷新列表，或直接返回表单管理页面。 | The risk assessment form has been published. You can close this page and refresh the list, or return to the form settings page. |  |  |  |
| 返回表单设置 | Back to Form Settings |  |  |  |
| 关闭页面 | Close Page |  |  |  |
| 新窗口打开 | Open in New Tab |  |  |  |
| 点击在新窗口打开预览表单 | Click to open preview form in a new window |  |  |  |
| 适用对象 | Applicable Subject |  |  |  |
| 已保存模板不支持变更适用对象，以保障历史案例关联一致 | Subject type cannot be changed for an existing template. |  |  |  |
| 适用对象在创建时已确定，发布后将归属到该案例类型下。 | The subject is set at creation; the form will be published under this subject. |  |  |  |

## Schema 源码侧边栏
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 表单结构 JSON Schema | JSON Schema Structure |  |  |  |
| 已复制 | Copied |  |  |  |
| 复制 JSON | Copy JSON |  |  |  |
| 已成功复制 Schema JSON 到剪贴板 | Schema JSON copied to clipboard |  |  |  |

## 新手漫游引导
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 请先完成首张画布创建 | Please create a form canvas first. |  |  |  |
| 下一步 → | Next → |  |  |  |
| ← 上一步 | ← Back |  |  |  |
| 开始使用 | Start Now |  |  |  |
| 第 {{current}} / {{total}} 步 | Step {{current}} of {{total}} |  |  |  |
| 不再提示 | Don't show again |  |  |  |
| 以后进入页面不再自动弹出操作指南 | Never show user guide automatically on startup |  |  |  |
| 已关闭操作指南，后续可随时点击顶栏“操作指南”重新开启 | User guide closed. You can restart it anytime from "User Guide" in the top bar. |  |  |  |
| 1. 侧边导航 | 1. Navigation |  |  |  |
| 快速切换模板库、组件库与页面大纲。 | Switch between Templates, Components, and Pages. |  |  |  |
| 2. 场景模板 | 2. Templates |  |  |  |
| 支持一键载入预设模板，或新建空白画布。 | Load a preset template or create a blank canvas. |  |  |  |
| 3. 组件物料 | 3. Components |  |  |  |
| 包含基础与业务表单字段，支持点击或拖拽添加。 | Form fields can be added by clicking or dragging. |  |  |  |
| 4. 设计画布 | 4. Canvas |  |  |  |
| 拖拽空白处平移画布，滑动滚轮平滑缩放。 | Drag empty canvas to pan, scroll wheel to zoom. |  |  |  |
| 5. 预设核验页 | 5. Preset Page |  |  |  |
| 首页为系统只读核验页，后续页面可自由添加字段。 | First page is read-only; subsequent pages are custom. |  |  |  |
| 6. 属性配置 | 6. Properties |  |  |  |
| 配置表单全局设置、字段属性及展开联动规则。 | Configure form settings, field properties, and linkage rules. |  |  |  |
| 7. 表单预览 | 7. Preview |  |  |  |
| 在手机模拟器中实时测试填表流程与字段校验。 | Test form flow and field validations in mobile preview. |  |  |  |
| 8. 发布表单 | 8. Publish |  |  |  |
| 检查多语言完整度，并将表单正式保存发布。 | Verify translation completeness and publish the form. |  |  |  |
| 1. 风险评估组件 | 1. Risk Question Component |  |  |  |
| 欢迎来到风险评估！点击或拖拽该组件添加到画布，选项固定为 Yes / No / NA 并支持配置扣分权重。 | Welcome to Risk Assessment! Click or drag this component to the canvas. Fixed Yes/No/NA logic with weight scoring. |  |  |  |
| 2. 画布概览与快捷操作 | 2. Canvas Overview & Quick Actions |  |  |  |
| 点击画布空白区域即可在右侧面板查看问卷概览与评分规则，并可快捷新增分组或问题。 | Click the canvas to view the form overview and scoring rules in the right panel, and quickly add groups or questions. |  |  |  |
| 3. 问题分组与题目管理 | 3. Question Group & Management |  |  |  |
| 支持直接修改组名，按住左侧把手可上下拖拽排序；可在分组内点击“+ 添加问题”，或在右侧面板快捷加题加组。 | Edit group names inline and drag the left handle to reorder. Click "+ Add Question" inside the group or use the right panel to add questions and groups. |  |  |  |
| 4. 翻译管理 | 4. Translation Management |  |  |  |
| 点击进入多语言工作区，支持双画布左右对照，点击“+ Add Language”即可新增翻译。 | Enter the workspace for side-by-side localization. Click "+ Add Language" to create a new translation. |  |  |  |
| 5. 保存与发布 | 5. Save & Publish |  |  |  |
| 设计完成后可随时保存草稿；点击“发布表单”系统将校验问卷并正式上线。 | Save progress to draft anytime, or click "Publish" to validate and deploy your form. |  |  |  |
| 5. 基本资料页 | 5. Basic Info Page |  |  |  |
| 首页为客户基本资料展示页（不可编辑），后续页面可自由添加字段。 | First page displays read-only basic information; subsequent pages are customizable. |  |  |  |
| 9. 随时重新开启指南 | 9. Reopen Guide Anytime |  |  |  |
| 如果后续需要再次查看操作指南，可随时点击左下角此处的问号图标重新唤起。 | Click this help icon here on the bottom-left bar at any time to reopen this interactive guide. |  |  |  |
| 6. 随时重新开启指南 | 6. Reopen Guide Anytime |  |  |  |
| 如果后续需要再次查看操作指南，可随时点击左下角此处的问号图标重新唤起。 | Click this help icon here on the bottom-left bar at any time to reopen this interactive guide. |  |  |  |

## API 接口错误提示
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 请求参数错误 (400) | Bad request parameter (400) |  |  |  |
| 登录已失效，请重新登录 (401) | Session expired, please sign in again (401) |  |  |  |
| 拒绝访问，没有权限 (403) | Access denied, permission required (403) |  |  |  |
| 请求的资源不存在 (404) | Requested resource not found (404) |  |  |  |
| 服务器内部错误 (500) | Internal server error (500) |  |  |  |
| 服务器响应超时或服务暂时不可用 (502/503) | Server timeout or service temporarily unavailable (502/503) |  |  |  |
| 请求失败 ({status}) | Request failed ({status}) |  |  |  |
| 请求超时，请检查网络后重试 | Request timeout, please check network and retry |  |  |  |
| 网络连接失败，请检查网络连接 | Network connection failed, please check network connection |  |  |  |
| 网络连接异常，请检查网络 | Network connection error, please check network |  |  |  |
| 操作失败 | Operation failed |  |  |  |

## 404 页面
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 页面未找到 | Page Not Found |  |  |  |
| 抱歉，您访问的页面不存在或已被移除。 | Sorry, the page you are looking for could not be found. |  |  |  |
| 未找到指定表单 | Form Not Found |  |  |  |
| 抱歉，您访问的表单不存在或已被删除。 | Sorry, the form you are looking for does not exist or has been deleted. |  |  |  |
| 新建表单 | Create New Form |  |  |  |
| 返回表单设计器 | Back to Form Builder |  |  |  |
| 返回表单列表 | Back to Form List |  |  |  |
| 将在 {countdown}s 后自动返回 | Auto redirecting in {countdown}s |  |  |  |

## 风险评估问卷
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 风险评估 | Risk Assessment |  |  |  |
| 风险评估组件 | Risk Assessment Components |  |  |  |
| 风险评估问题 | Risk Question |  |  |  |
| 问题分组 | Question Groups |  |  |  |
| 问题分组 | Question Groups |  |  |  |
| 分组 | Groups |  |  |  |
| {count} 个分组 | {count} groups |  |  |  |
| {count} 个问题 | {count} questions |  |  |  |
| 题 | questions |  |  |  |
| 添加问题分组 | Add Question Group |  |  |  |
| 添加问题 | Add Question |  |  |  |
| 添加本组问题 | Add Question to Group |  |  |  |
| 删除分组 | Delete Group |  |  |  |
| 确定删除该分组及其包含的问题吗？ | Delete this question group and all questions inside? |  |  |  |
| 分组 {index} | Section {index} |  |  |  |
| 请输入分组名称... | Enter group name... |  |  |  |
| 分组信息 | Group Information |  |  |  |
| 英文分组名称为必填项，中文翻译选填 | English group title is required; Chinese is optional |  |  |  |
| 按住拖拽调整分组顺序 | Drag to reorder group |  |  |  |
| 从左侧拖入评估问题组件，或点击下方按钮添加问题 | Drag question component here or click button below to add |  |  |  |
| 问题设置 | Question Settings |  |  |  |
| 配置评估问题与分值权重 | Configure risk question and weight score |  |  |  |
| 分组设置 | Group Settings |  |  |  |
| 配置分组名称及组内问题 | Configure group title and questions |  |  |  |
| 问卷标题、引导说明与快捷概览 | Page title, description & overview |  |  |  |
| 问卷概览 | Questionnaire Overview |  |  |  |
| 分组 | Group(s) |  |  |  |
| 评分规则说明 | Scoring Rules |  |  |  |
| 采用固定命中扣分制；回答选项固定为 Yes / No / Not Applicable，勾选“Yes”表示命中风险项并按设定权重扣除分值。 | Fixed deduction system: Answer options are fixed as Yes / No / Not Applicable. Selecting "Yes" deducts the configured weight points. |  |  |  |
| 添加分组 | Add Group |  |  |  |
| 添加新问题分组 | Add Question Group |  |  |  |
| 已添加新问题分组 | New question group added |  |  |  |
| 多语言风险评估问卷操作演示 | Multilingual Risk Assessment Video Tutorial |  |  |  |
| 温馨提示：进入翻译管理后，可对照配置风险评估题目与选项语言版本。 | Tip: In Translation Management, you can configure risk questions and options across languages. |  |  |  |
| 拖拽至分组或直接点击添加，用于构建客户合规审查项。 | Drag or click to add into groups to build compliance questions. |  |  |  |
| 选项: | Options: |  |  |  |
| 按住拖拽添加至分组 | Drag to add to group |  |  |  |

## 标准组件类型名称
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 单行文本 | Single Line Text |  |  |  |
| 多行文本 | Multi-line Text |  |  |  |
| 单选框组 | Radio Group |  |  |  |
| 多选框组 | Checkbox Group |  |  |  |
| 下拉选择 | Dropdown Select |  |  |  |
| 日期选择 | Date Picker |  |  |  |
| 手机号码 | Phone Number |  |  |  |
| 电子邮箱 | Email Address |  |  |  |
| 国家/地区 | Country/Region |  |  |  |
| 国籍选择 | Nationality |  |  |  |
| 电子签名 | Electronic Signature |  |  |  |
| 提示说明 | Alert / Notice |  |  |  |

## 风险评估扩展文案
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 复制问题 | Duplicate Question |  |  |  |
| 在下方插入问题 | Insert Question Below |  |  |  |
| 删除问题 | Delete Question |  |  |  |
| 问题内容 | Question Content |  |  |  |
| 请输入风险评估问题... | Enter risk assessment question... |  |  |  |
| 权重设置 | Weight Settings |  |  |  |
| 新问题默认权重为 1。选择 “Yes” 表示命中风险项，系统将按该问题的权重扣减风险评分。请将问题表述为：回答 “Yes” 时明确代表存在风险。 | New questions default to weight 1. Selecting Yes indicates a risk hit and deducts the weight from the risk score. |  |  |  |
| 命中扣分权重 | Risk Deduction Weight |  |  |  |
| 回答“Yes”表示命中风险项，系统将按此权重扣减评分 | Answering "Yes" triggers risk deduction by this weight value |  |  |  |
| 权重：{weight} | Weight: {weight} |  |  |  |
| 分 | pts |  |  |  |
| 分组名称 (中文) | Group Name (EN) |  |  |  |

## 发布校验与提示
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 请至少添加一个表单页面后再发布 | Please add at least one form page before publishing |  |  |  |
| 请填写第 {page} 页的页面标题 | Please enter the page title for Page {page} |  |  |  |
| 第 {page} 页暂无表单组件，请添加组件或删除空页面 | Page {page} has no components. Please add components or remove the empty page. |  |  |  |
| 请填写分组 {index} 的分组名称 | Please enter the title for Group {index} |  |  |  |
| 请填写第 {index} 道评估问题的题目内容 | Please enter question text for Question {index} |  |  |  |
| 请填写第 {page} 页中未命名组件的标题 | Please enter the label for the untitled field on Page {page} |  |  |  |
| 已保存至草稿 {time} | Draft saved {time} |  |  |  |
| 必填项不能为空 | This required field cannot be empty |  |  |  |
| 请填写「{group}」第 {index} 题的题目内容 | Please enter question text for Question {index} in "{group}" |  |  |  |
| 请填写「{group}」第 {index} 题的题目内容（共 {total} 题未填写） | Please enter question text for Question {index} in "{group}" ({total} unfilled) |  |  |  |

## 预览与提交结果
| 中文 | 英文 | 繁体中文 | 马来语 | 中文替换成 | 英文替换成 | 繁体替换成 | 马来语替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 提交已完成 | Submission Completed | 提交已完成 | Penghantaran Selesai |  |  |  |  |  |
| 感谢您的填写！您的表单信息已成功提交。 | Thank you! Your information has been received successfully. | 感謝您的填寫！您的表單資訊已成功提交。 | Terima kasih! Maklumat borang anda telah berjaya diterima. |  |  |  |  |  |
| 处理状态 | Status | 處理狀態 | Status |  |  |  |  |  |
| 已完成 | Completed | 已完成 | Selesai |  |  |  |  |  |
| 提交编号 | Submission No. | 提交編號 | No. Rujukan Penghantaran |  |  |  |  |  |
| 提交时间 | Submission Time | 提交時間 | Masa Penghantaran |  |  |  |  |  |
| 重新体验填报 | Refill Form (Preview) | 重新體驗填報 | Isi Borang Semula (Pratonton) |  |  |  |  |  |
| 签名区域 | Signature Area | 簽名區域 | Kawasan Tandatangan |  |  |  |  |  |

## 翻译抽屉与通用
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 页面标题 | Page Title |  |  |  |
| 描述说明 | Page Description |  |  |  |
| 分组 | Group |  |  |  |
| 提示说明 | Notice Content |  |  |  |
| 输入提示 | Placeholder |  |  |  |
| 副标题 | Help Text |  |  |  |
| 选项 | Option |  |  |  |
| 表单字段 | Field |  |  |  |
| 字段标签 | Field Label |  |  |  |
| 帮助说明 / 副标题 | Help Text / Subtitle |  |  |  |
| 提示内容 | Notice Content |  |  |  |
| 退出翻译 | Exit Translation |  |  |  |
| 翻译管理 | Translation Management |  |  |  |
| 翻译管理 ({count}) | Translation Management ({count}) |  |  |  |
| 添加语言 | Add Language |  |  |  |
| 移除语言 | Remove language |  |  |  |
| 默认 | Default |  |  |  |
| 可翻译页面 | Translatable Pages |  |  |  |
| 待译 {count} | {count} left |  |  |  |
| 暂无需要翻译的自定义页面 | No custom form pages to translate |  |  |  |
| 已添加 {name} 翻译版本 | Added {name} |  |  |  |
| 已移除 {name} 翻译版本 | Removed {name} |  |  |  |
| 当前为单语言版本 | Single Language Form |  |  |  |
| 未启用多语言翻译。可直接发布当前单语言表单，或点击「+ 添加语言」开启多语言对照 | No translation enabled. You can publish directly or click "+ Add Language" to enable translations |  |  |  |
| 返回普通设计模式 | Back to Form Design |  |  |  |
| 页面导航与翻译进度 | Page navigation & progress |  |  |  |
| 译文属性 | Translation Properties |  |  |  |
| 对照源语言编辑目标内容 | Edit target translation against source |  |  |  |
| {count} 项{langName}未翻译 | {count} {langName} items untranslated |  |  |  |
| 已填写 | Filled |  |  |  |
| 待翻译 | Pending |  |  |  |
| 已完成 | Completed |  |  |  |
| 已译完 | Translated |  |  |  |
| {lang}原文 | Source ({lang}) |  |  |  |
| 选项译文对照 | Options Translation |  |  |  |
| 声明条款译文对照 | Declarations Translation |  |  |  |
| 签名区提示文字 | Signature Prompt Text |  |  |  |
| 手写区内提示文字 | Signature Pad Watermark |  |  |  |
| 开始日期提示 | Start Date Placeholder |  |  |  |
| 截止日期提示 | End Date Placeholder |  |  |  |
| 长期选项文案 | Long-term Option Text |  |  |  |
| 页面译文 | Page Translation |  |  |  |
| 页面副标题 / 描述 | Page Description |  |  |  |
| 问题分组译文 | Group Translation |  |  |  |
| 分组名称 | Group Title |  |  |  |
| 请输入译文... | Enter translation... |  |  |  |
| 英文翻译为必填项，请完成全部英文翻译后再提交发布。 | English translation is required. Please complete all English translations before publishing. |  |  |  |
| 当前表单还有 {count} 项多语言翻译尚未完成。 | There are {count} untranslated items in target languages. |  |  |  |
| 现在发布可能导致对应语言访问时显示英文或空白，建议补充完整后再发布。 | Publishing now may cause these languages to display English text or blank fields. We recommend completing the translations first. |  |  |  |
| 组件属性 | Element Properties |  |  |  |
| 您有未保存的更改，确定要离开吗？ | You have unsaved changes. Are you sure you want to leave? |  |  |  |
| 页面标题 | Page Title (EN) |  |  |  |
| 页面描述 | Page Description (EN) |  |  |  |

## 支持的表单语言名称（SUPPORTED_FORM_LOCALES）
| 中文 | 英文 | 中文替换成 | 英文替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- |
| 简体中文 | Simplified Chinese |  |  |  |
| 英语 (English) | English |  |  |  |
| 繁体中文 | Traditional Chinese |  |  |  |
| 马来语 (Bahasa Melayu) | Malay (Bahasa Melayu) |  |  |  |

## 组件库与默认字段占位文案（componentRegistry / phoneRules）
| 中文 | 英文 | 繁体中文 | 马来语 | 中文替换成 | 英文替换成 | 繁体替换成 | 马来语替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 单行文本 | Single Line | 單行文字 | Baris Tunggal |  |  |  |  |  |
| 多行文本 | Multi-line | 多行文字 | Pelbagai Baris |  |  |  |  |  |
| 下拉选择 | Dropdown | 下拉選擇 | Menu Juntai Bawah |  |  |  |  |  |
| 单选框组 | Radio | 單選框組 | Pilihan Tunggal (Radio) |  |  |  |  |  |
| 多选框组 | Checkbox | 多選框組 | Kotak Semak (Checkbox) |  |  |  |  |  |
| 电子签名 | E-Signature | 電子簽名 | Tandatangan Elektronik |  |  |  |  |  |
| 提示区块 | Notice | 提示區塊 | Notis |  |  |  |  |  |
| 手机号码 | Phone | 手機號碼 | Nombor Telefon |  |  |  |  |  |
| 请输入内容 | Please enter content | 請輸入內容 | Sila masukkan kandungan |  |  |  |  |  |
| 请输入详细描述... | Please enter detailed description... | 請輸入詳細描述... | Sila masukkan penerangan terperinci... |  |  |  |  |  |
| 请选择国家 | Please select a country | 請選擇國家 | Sila pilih negara |  |  |  |  |  |
| 本人保证以上填写的信息真实、准确、有效。 | I confirm that all information provided is true, accurate and valid. | 本人保證以上填寫的資訊真實、準確、有效。 | Saya mengesahkan semua maklumat yang diberikan adalah benar, tepat dan sah. |  |  |  |  |  |
| 请输入手机号码 | Please enter phone number | 請輸入手機號碼 | Sila masukkan nombor telefon |  |  |  |  |  |
| 请输入6-15位有效手机号码 | Please enter 6-15 digit phone number | 請輸入6-15位有效手機號碼 | Sila masukkan 6-15 digit nombor telefon yang sah |  |  |  |  |  |

## 表单组件默认校验与选项占位文案（多语言默认配置）
| 中文 | 英文 | 繁体中文 | 马来语 | 中文替换成 | 英文替换成 | 繁体替换成 | 马来语替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 请确认并同意声明条款 | Please agree to the declarations | 請確認並同意聲明條款 | Sila sahkan dan bersetuju dengan pengisytiharan |  |  |  |  |  |
| 请完成手写签名 | Please complete handwritten signature | 請完成手寫簽名 | Sila lengkapkan tandatangan |  |  |  |  |  |
| 请选择一个选项 | Please select an option | 請選擇一個選項 | Sila pilih satu pilihan |  |  |  |  |  |
| 请至少选择一个选项 | Please select at least one option | 請至少選擇一個選項 | Sila pilih sekurang-kurangnya satu pilihan |  |  |  |  |  |
| 请选择日期 | Please select a date | 請選擇日期 | Sila pilih tarikh |  |  |  |  |  |
| 必填项不能为空 | This required field cannot be empty | 必填項不能為空 | Medan ini diperlukan |  |  |  |  |  |
| 请选择选项 | Please select an option | 請選擇選項 | Sila pilih satu pilihan |  |  |  |  |  |
| 请至少选择一项 | Please select at least one option | 請至少選擇一項 | Sila pilih sekurang-kurangnya satu pilihan |  |  |  |  |  |
| 请选择日期 | Please select date | 請選擇日期 | Sila pilih tarikh |  |  |  |  |  |
| 请在下方签名板完成电子手写签名 | Please provide electronic handwritten signature on the signature pad below | 請在下方簽名板完成電子手寫簽名 | Sila lengkapkan tandatangan elektronik pada pad tandatangan di bawah |  |  |  |  |  |
| 请阅读并勾选同意上方声明条款 | Please read and agree to the above declaration terms | 請閱讀並勾選同意上方聲明條款 | Sila baca dan setuju dengan syarat perisytiharan di atas |  |  |  |  |  |
| 必填项不能为空 | This field is required | 必填項不能為空 | Medan ini diperlukan |  |  |  |  |  |
| 选项一 ~ 选项十（超过十项为 选项N） | Option 1 ~ Option N | 選項一 ~ 選項十（超過十項為 選項N） | Option 1 ~ Option N |  |  |  |  |  |

## 移动端填报端（全量 16 国语言对照体系）

### 28.1 亚太核心 4 语精细化校对表（中 / 英 / 繁 / 马）
> 专供日常亚太核心业务核对与修改，支持在“替换成”列直接填写调整建议。

| 字段Key / 词条 | 简体中文 (`zh`) | 英语 (`en`) | 繁体中文 (`zh-Hant`) | 马来语 (`ms`) | 中文替换成 | 英文替换成 | 繁体替换成 | 马来替换成 | 详情（截图） |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `app.title` | 在线表单填报 | Online Form | 線上表單填報 | Borang Dalam Talian | | | | | |
| `form.prevStep` | 上一步 | Back | 上一步 | Kembali | | | | | |
| `form.nextStep` | 下一步 | Next | 下一步 | Seterusnya | | | | | |
| `form.submit` | 确认提交 | Submit Form | 確認提交 | Hantar Borang | | | | | |
| `form.submitting` | 提交中... | Submitting... | 提交中... | Menghantar... | | | | | |
| `form.submitSuccess` | 表单已提交 | Form Submitted | 表單已提交 | Borang Berjaya Dihantar | | | | | |
| `form.submitFailed` | 提交失败，请检查网络后重试 | Submission failed. Please check network and retry. | 提交失敗，請檢查網路後重試 | Penghantaran gagal. Sila semak rangkaian dan cuba lagi. | | | | | |
| `form.requiredError` | 必填项不能为空 | This field is required | 必填項不能為空 | Medan ini wajib diisi | | | | | |
| `form.emailError` | 请输入有效的电子邮箱地址 | Please enter a valid email address | 請輸入有效的電子郵件地址 | Sila masukkan alamat e-mel yang sah | | | | | |
| `form.phoneError` | 请输入有效的手机号码 | Please enter a valid phone number | 請輸入有效的手機號碼 | Sila masukkan nombor telefon yang sah | | | | | |
| `form.signatureRequired` | 请在下方签名板完成电子手写签名 | Please sign in the signature pad below | 請在下方簽名板完成電子手寫簽名 | Sila lengkapkan tandatangan elektronik pada pad tandatangan di bawah | | | | | |
| `form.clearSignature` | 重新签名 | Clear Signature | 重新簽名 | Padam Tandatangan | | | | | |
| `form.finishSign` | 完成签名 | Done | 完成簽名 | Selesai | | | | | |
| `form.reSign` | 修改签名 | Edit | 修改簽名 | Edit | | | | | |
| `form.signPlaceholder` | 请在此处手写签名 | Please sign here | 請在此處手寫簽名 | Sila tandatangan di sini | | | | | |
| `form.selectPlaceholder` | 请点击选择 | Select an option | 請點擊選擇 | Sila pilih satu pilihan | | | | | |
| `form.inputPlaceholder` | 请输入 | Enter here | 請輸入 | Sila masukkan | | | | | |
| `form.dateLongTerm` | 长期 | Long-term | 長期 | Jangka panjang | | | | | |
| `form.dateLongTermDisplay` | 长期有效 | Permanent | 長期有效 | Sah kekal | | | | | |
| `form.loadFailed` | 获取表单数据失败，请检查链接有效性 | Failed to load form schema. Invalid link. | 獲取表單資料失敗，請檢查連結有效性 | Gagal memuatkan data borang. Sila semak kesahan pautan. | | | | | |
| `form.successDesc` | 您的填报资料已成功送达，请勿重复提交。 | Your submission has been received. Please do not submit again. | 您的填報資料已成功送達，請勿重複提交。 | Maklumat anda telah berjaya dihantar. Sila jangan hantar lagi. | | | | | |
| `form.submitTime` | 提交时间 | Submission Time | 提交時間 | Masa Penghantaran | | | | | |
| `form.statusLabel` | 当前状态 | Status | 當前狀態 | Status | | | | | |
| `form.statusCompleted` | 已完成 | Completed | 已完成 | Selesai | | | | | |
| `form.closePage` | 关闭页面 | Close Page | 關閉頁面 | Tutup Halaman | | | | | |
| `form.returnToList` | 返回待办列表 | Back to Task List | 返回待辦清單 | Kembali ke Senarai Tugasan | | | | | |
| `form.notFoundTitle` | 链接无效或已失效 | Link Invalid or Expired | 連結無效或已失效 | Pautan Tidak Sah atau Telah Tamat Tempoh | | | | | |
| `form.notFoundDesc` | 未找到对应的填报任务，该链接可能已过期或已被处理 | Task not found. The link may have expired or already been processed. | 未找到對應的填報任務，該連結可能已過期或已被處理 | Tugasan tidak ditemui. Pautan mungkin telah tamat tempoh atau telah diproses. | | | | | |
| `form.confirm` | 确认 | Confirm | 確認 | Sahkan | | | | | |
| `form.cancel` | 取消 | Cancel | 取消 | Batal | | | | | |
| `form.confirmSubmitTitle` | 确认提交表单？ | Confirm Submission? | 確認提交表單？ | Sahkan penghantaran borang? | | | | | |
| `form.confirmSubmitDesc` | 提交后表单资料将进入正式审核流程，无法撤回或修改，请确认所填信息真实有效。 | Once submitted, your information will be processed and cannot be edited. Please ensure all details are accurate. | 提交後表單資料將進入正式審核流程，無法撤回或修改，請確認所填資訊真實有效。 | Maklumat anda akan diproses dan tidak boleh diedit selepas dihantar. Sila pastikan semua maklumat adalah tepat. | | | | | |
| `form.confirmSubmitBtn` | 确认提交 | Confirm Submit | 確認提交 | Sahkan Hantar | | | | | |
| `form.checkAgainBtn` | 再检查下 | Check Again | 再檢查下 | Semak Semula | | | | | |
| `form.checkRequired` | 请检查并完善标红的必填项 | Please check and complete the required fields | 請檢查並完善標紅的必填項 | Sila semak dan lengkapkan medan wajib yang ditandakan merah | | | | | |
| `form.backToFirst` | 回到第一页 (重新浏览) | Back to Step 1 | 回到第一頁 (重新瀏覽) | Kembali ke Langkah 1 (Semak Semula) | | | | | |
| `form.backToFirstToast` | 已回到第一页 | Returned to Step 1 | 已回到第一頁 | Kembali ke Langkah 1 | | | | | |
| `preview.notice` | 当前为表单预览模式，所填内容仅供体验，不会被保存或提交。 | This is a form preview. Information entered here will not be saved or submitted. |  |  | | | | | |
| `preview.scanQrTitle` | 手机扫码预览 | Mobile Preview |  |  | | | | | |
| `preview.scanQrDesc` | 手机扫码即可体验 | Scan to preview |  |  | | | | | |
| `common.selectLanguage` | 选择语言 | Select Language | 選擇語言 | Pilih Bahasa | | | | | |
| `common.cancel` | 取消 | Cancel | 取消 | Batal | | | | | |
| `common.add` | 添加 | Add | 新增 | Tambah | | | | | |
| `common.selected` | 已选 | Selected | 已選 | Dipilih | | | | | |
| `common.selectedColon` | 已选: | Selected: | 已選: | Dipilih: | | | | | |
| `common.confirm` | 确定 | Confirm | 確定 | Sahkan | | | | | |
| `common.remove` | 移除 | Remove | 移除 | Padam | | | | | |
| `common.undo` | 撤销 | Undo | 復原 | Buat asal | | | | | |
| `common.searchOptions` | 请输入关键字搜索... | Search options... | 請輸入關鍵字搜尋... | Cari pilihan... | | | | | |
| `common.noMatchingOptions` | 未找到相关选项 | No matching options found | 未找到相關選項 | Tiada pilihan ditemui | | | | | |
| `common.noMatchingCountry` | 暂无匹配国家、地区或区号 | No matching country, region or code found | 查無相符國家、地區或國碼 | Tiada negara, wilayah atau kod yang sepadan ditemui | | | | | |
| `common.selectCountryRegion` | 选择国家/地区 | Select Country/Region | 選擇國家/地區 | Pilih Negara/Wilayah | | | | | |
| `common.selectCountryDialCode` | 选择国家/地区区号 | Select Country/Region Code | 選擇國家/地區國碼 | Pilih Kod Negara/Wilayah | | | | | |
| `common.selectNationality` | 选择国籍 | Select Nationality | 選擇國籍 | Pilih Kewarganegaraan | | | | | |
| `common.pleaseSelectNationality` | 请选择国籍 | Please select nationality | 請選擇國籍 | Sila pilih kewarganegaraan | | | | | |
| `common.pleaseSelectCountry` | 请选择国家/地区 | Please select country/region | 請選擇國家/地區 | Sila pilih negara/wilayah | | | | | |
| `common.clickToLocate` | 点击在下方列表中定位 | Click to locate in list | 點擊在下方列表中定位 | Klik untuk cari dalam senarai | | | | | |
| `common.startDate` | 开始日期 | Start Date | 開始日期 | Tarikh Mula | | | | | |
| `common.endDate` | 截止日期 | End Date | 截止日期 | Tarikh Tamat | | | | | |
| `common.selectDate` | 选择日期 | Select Date | 選擇日期 | Pilih Tarikh | | | | | |
| `common.selectDateRange` | 选择日期范围 | Select Date Range | 選擇日期範圍 | Pilih Julat Tarikh | | | | | |
| `common.searchCountryOrCode` | 搜索国家、地区或区号... | Search by country or dial code... | 搜尋國家、地區或國碼... | Cari mengikut negara, wilayah atau kod panggilan... | | | | | |
| `common.searchCountryName` | 搜索国家或地区名称... | Search country or region... | 搜尋國家或地區名稱... | Cari negara atau wilayah... | | | | | |
| `common.signAreaPlaceholder` | 请在下方指定区域签名 | Please sign in the designated area below | 請在下方指定區域簽名 | Sila tandatangan di kawasan yang ditetapkan di bawah | | | | | |
| `common.maxSelectLimit` | 最多只能选择 {max} 项 | Up to {max} items allowed | 最多只能選擇 {max} 項 | Sehingga {max} item dibenarkan | | | | | |
| `profile.noticeTitle` | 提示 | Notice | 提示 | Notis | | | | | |
| `profile.noticeDesc1` | 根据合规监管要求，您需要完成KYC问卷填写。 | In accordance with regulatory compliance requirements, you are required to complete the KYC questionnaire. | 根據合規監管要求，您需要完成KYC問卷填寫。 | Selaras dengan keperluan pematuhan peraturan, anda dikehendaki melengkapkan soal selidik KYC. | | | | | |
| `profile.noticeDesc2` | 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please confirm whether the following information is accurate. If modifications are required, please contact the service provider before proceeding. | 請確認以下資訊是否準確，如需修改，請聯繫服務商修改後再進行下一步。 | Sila sahkan sama ada maklumat berikut adalah tepat. Jika pengubahsuaian diperlukan, sila hubungi pembekal perkhidmatan sebelum meneruskan. | | | | | |
| `profile.basicDetails` | 基本资料 | Basic Details | 基本資料 | Butiran Asas | | | | | |
| `profile.relationshipInfo` | 关联信息 | Relationship Information | 關聯資訊 | Maklumat Hubungan | | | | | |
| `profile.associatedEntity` | 关联实体 | Associated Entity | 關聯實體 | Entiti Berkaitan | | | | | |
| `profile.relationshipType` | 关联类型 | Relationship Type | 關聯類型 | Jenis Hubungan | | | | | |
| `profile.shareholdingInfo` | 股份与出资信息 | Shareholding & Capital Information | 股份與出資資訊 | Maklumat Pegangan Saham & Modal | | | | | |
| `profile.sharesHeld` | 持有股份数 | Number of Shares Held | 持有股份數 | Bilangan Saham Dipegang | | | | | |
| `profile.allocatedPaidUpAmount` | 对应已缴股本金额 | Allocated Paid-up Amount | 對應已繳股本金額 | Jumlah Modal Berbayar Diperuntukkan | | | | | |
| `profile.companyName` | 企业注册全称 | Company Name | 企業註冊全稱 | Nama Syarikat | | | | | |
| `profile.uen` | 统一机构识别码 (UEN) | UEN | 統一機構識別碼 (UEN) | Nombor Pengenalan Entiti Unik (UEN) | | | | | |
| `profile.countryOfIncorporation` | 注册设立国家 | Country of Incorporation | 註冊設立國家 | Negara Pemerbadanan | | | | | |
| `profile.entityType` | 法律实体形式 | Entity Type | 法律實體形式 | Jenis Entiti Undang-Undang | | | | | |
| `profile.entityName` | 实体名称 | Entity Name | 實體名稱 | Nama Entiti | | | | | |
| `profile.entityRegNo` | 实体注册号码 | Registration Number | 實體註冊號碼 | Nombor Pendaftaran Entiti | | | | | |
| `profile.formerName` | 曾用名(如有) | Former Name (if any) | 曾用名(如有) | Nama Dahulu (jika ada) | | | | | |
| `profile.jurisdiction` | 注册地 | Place of Incorporation | 註冊地 | Bidang Kuasa Pemerbadanan | | | | | |
| `profile.repCapacity` | 授权代表身份 | Authorised Representative Role | 授權代表身份 | Kapasiti / Peranan Wakil Sah | | | | | |
| `profile.authorizedRep` | 授权代表姓名 | Authorized Representative | 授權代表姓名 | Nama Wakil Diberi Kuasa | | | | | |
| `profile.contactEmail` | 官方联络邮箱 | Contact Email | 官方聯絡信箱 | E-mel Rasmi | | | | | |
| `profile.registeredAddress` | 企业注册地址 | Registered Address | 企業註冊地址 | Alamat Berdaftar Syarikat | | | | | |
| `profile.residentialAddress` | 居住地址 | Residential Address | 居住地址 | Alamat Kediaman | | | | | |
| `profile.contactAddress` | 联系地址 | Contact Address | 聯絡地址 | Alamat Surat-menyurat | | | | | |
| `profile.name` | 姓名 | Name | 姓名 | Nama | | | | | |
| `profile.nativeName` | 国籍语言姓名 | Native Name | 國籍語言姓名 | Nama Bahasa Asal | | | | | |
| `profile.nationality` | 国籍 | Nationality | 國籍 | Kewarganegaraan | | | | | |
| `profile.singaporeIdentityStatus` | 新加坡身份类型 | Singapore Identity Status | 新加坡身分類型 | Status Identiti Singapura | | | | | |
| `profile.nricFin` | NRIC/FIN(如适用) | NRIC/FIN | NRIC/FIN(如適用) | NRIC/FIN (jika berkenaan) | | | | | |
| `profile.idType` | 证件类型 | ID Type | 證件類型 | Jenis Pengenalan | | | | | |
| `profile.idNumber` | 证件号码 | ID Number | 證件號碼 | Nombor Dokumen | | | | | |
| `profile.dob` | 出生日期 | Date of Birth | 出生日期 | Tarikh Lahir | | | | | |
| `profile.gender` | 性别 | Gender | 性別 | Jantina | | | | | |
| `profile.mobilePhone` | 手机号码 | Mobile Phone | 手機號碼 | Nombor Telefon Mudah Alih | | | | | |
| `profile.email` | 电子邮箱 | Email | 電子郵件 | E-mel | | | | | |
| `profile.roleDirector` | 董事 | Director | 董事 | Pengarah | | | | | |
| `profile.roleShareholder` | 股东 | Shareholder | 股東 | Pemegang Saham | | | | | |
| `profile.roleUbo` | 最终受益人 | Ultimate Beneficial Owner | 最終受益人 | Pemilik Manfaat Muktamad | | | | | |
| `profile.shareClass` | 股份类别 | Share Class | 股份類別 | Kelas Saham | | | | | |
| `profile.ordinaryShares` | 普通股 | Ordinary Shares | 普通股 | Saham Biasa | | | | | |
| `profile.preferenceShares` | 优先股 | Preference Shares | 優先股 | Saham Keutamaan | | | | | |

### 28.2 全球 12 语拓展对照表（出海三大区域市场分组）
> 覆盖出海全球业务场景，采用三大地理大区独立子表呈现，点击即可展开对应语系核对，页面宽度自适应且绝不横向爆版。

<details>
<summary><b>🌏 子表 A：东南亚本地化市场（4 语：印尼语 id / 泰语 th / 越南语 vi / 泰米尔语 ta）▶ 点击展开</b></summary>

| 字段Key / 词条 | 简体中文参考 | 英语参考 | 印度尼西亚语 (`id`) | 泰语 (`th`) | 越南语 (`vi`) | 泰米尔语 (`ta`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `app.title` | 在线表单填报 | Online Form | Formulir Online | แบบฟอร์มออนไลน์ | Biểu mẫu trực tuyến | ஆன்லைன் படிவம் |
| `form.prevStep` | 上一步 | Back | Sebelumnya | ย้อนกลับ | Quay lại | முந்தையது |
| `form.nextStep` | 下一步 | Next | Berikutnya | ถัดไป | Tiếp theo | அடுத்தது |
| `form.submit` | 确认提交 | Submit Form | Kirim Formulir | ส่งแบบฟอร์ม | Gửi biểu mẫu | படிவத்தைச் சமர்ப்பி |
| `form.submitting` | 提交中... | Submitting... | Mengirim... | กำลังส่ง... | Đang gửi... | சமர்ப்பிக்கிறது... |
| `form.submitSuccess` | 表单已提交 | Form Submitted | Formulir Terkirim | ส่งแบบฟอร์มเรียบร้อยแล้ว | Đã gửi biểu mẫu | படிவம் சமர்ப்பிக்கப்பட்டது |
| `form.submitFailed` | 提交失败，请检查网络后重试 | Submission failed. Please check network and retry. | Pengiriman gagal. Silakan periksa jaringan dan coba lagi. | ส่งข้อมูลไม่สำเร็จ โปรดตรวจสอบเครือข่ายแล้วลองใหม่ | Gửi thất bại. Vui lòng kiểm tra mạng và thử lại. | சமர்ப்பிப்பு தோல்வியடைந்தது. இணையத்தைச் சரிபார்த்து மீண்டும் முயலவும். |
| `form.requiredError` | 必填项不能为空 | This field is required | Kolom ini wajib diisi | จำเป็นต้องกรอกข้อมูลในช่องนี้ | Trường này là bắt buộc | இந்தப் புலம் கட்டாயமானது |
| `form.emailError` | 请输入有效的电子邮箱地址 | Please enter a valid email address | Harap masukkan alamat email yang valid | กรุณากรอกอีเมลที่ถูกต้อง | Vui lòng nhập địa chỉ email hợp lệ | சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும் |
| `form.phoneError` | 请输入有效的手机号码 | Please enter a valid phone number | Harap masukkan nomor telepon yang valid | กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง | Vui lòng nhập số điện thoại hợp lệ | சரியான தொலைபேசி எண்ணை உள்ளிடவும் |
| `form.signatureRequired` | 请在下方签名板完成电子手写签名 | Please sign in the signature pad below | Harap tanda tangani pada papan tanda tangan di bawah ini | กรุณาลงลายมือชื่อในช่องลายเซ็นด้านล่าง | Vui lòng ký vào khung chữ ký bên dưới | கீழே உள்ள கையொப்பப் பலகையில் கையொப்பமிடவும் |
| `form.clearSignature` | 重新签名 | Clear Signature | Hapus Tanda Tangan | ล้างลายเซ็น | Xóa chữ ký | கையொப்பத்தை அழி |
| `form.finishSign` | 完成签名 | Done | Selesai | เสร็จสิ้น | Hoàn tất | முடிந்தது |
| `form.reSign` | 修改签名 | Edit | Ubah | แก้ไข | Ký lại | திருத்து |
| `form.signPlaceholder` | 请在此处手写签名 | Please sign here | Silakan tanda tangan di sini | กรุณาลงนามที่นี่ | Vui lòng ký tại đây | இங்கே கையொப்பமிடவும் |
| `form.selectPlaceholder` | 请点击选择 | Select an option | Pilih opsi | กรุณาเลือก | Chọn một tùy chọn | தேர்வு செய்யவும் |
| `form.inputPlaceholder` | 请输入 | Enter here | Masukkan di sini | กรุณากรอกข้อมูล | Nhập tại đây | உள்ளிடவும் |
| `form.dateLongTerm` | 长期 | Long-term | Jangka Panjang | ระยะยาว | Dài hạn | நீண்ட காலம் |
| `form.dateLongTermDisplay` | 长期有效 | Permanent | Berlaku Permanen | ถาวร | Vô thời hạn | நிரந்தரம் |
| `form.loadFailed` | 获取表单数据失败，请检查链接有效性 | Failed to load form schema. Invalid link. | Gagal memuat data formulir. Tautan tidak valid. | ไม่สามารถโหลดแบบฟอร์มได้ ลิงก์ไม่ถูกต้อง | Không thể tải biểu mẫu. Liên kết không hợp lệ. | படிவத் தரவை ஏற்ற முடியவில்லை. இணைப்பு தவறானது. |
| `form.successDesc` | 您的填报资料已成功送达，请勿重复提交。 | Your submission has been received. Please do not submit again. | Data Anda telah berhasil diterima. Mohon jangan kirim ulang. | ระบบได้รับข้อมูลของคุณเรียบร้อยแล้ว กรุณาอย่าส่งซ้ำ | Thông tin của bạn đã được tiếp nhận. Vui lòng không gửi lại. | உங்கள் தகவல் வெற்றிகரமாக பெறப்பட்டது. மீண்டும் சமர்ப்பிக்க வேண்டாம். |
| `form.submitTime` | 提交时间 | Submission Time | Waktu Pengiriman | เวลาที่ส่ง | Thời gian gửi | சமர்ப்பித்த நேரம் |
| `form.statusLabel` | 当前状态 | Status | Status | สถานะ | Trạng thái | நிலை |
| `form.statusCompleted` | 已完成 | Completed | Selesai | เสร็จสมบูรณ์ | Hoàn tất | முடிந்தது |
| `form.closePage` | 关闭页面 | Close Page | Tutup Halaman | ปิดหน้านี้ | Đóng trang | பக்கத்தை மூடு |
| `form.returnToList` | 返回待办列表 | Back to Task List | Kembali ke Daftar Tugas | กลับไปที่รายการงาน | Quay lại danh sách công việc | பணிப் பட்டியலுக்குத் திரும்பு |
| `form.notFoundTitle` | 链接无效或已失效 | Link Invalid or Expired | Tautan Tidak Valid atau Kedaluwarsa | ลิงก์ไม่ถูกต้องหรือหมดอายุ | Liên kết không hợp lệ hoặc đã hết hạn | இணைப்பு தவறானது அல்லது காலாவதியானது |
| `form.notFoundDesc` | 未找到对应的填报任务，该链接可能已过期或已被处理 | Task not found. The link may have expired or already been processed. | Tugas tidak ditemukan. Tautan mungkin sudah kedaluwarsa atau telah diproses. | ไม่พบงานที่ระบุ ลิงก์อาจหมดอายุหรือถูกดำเนินการไปแล้ว | Không tìm thấy tác vụ. Liên kết có thể đã hết hạn hoặc đã được xử lý. | பணி காணப்படவில்லை. இணைப்பு காலாவதியாகி இருக்கலாம் அல்லது ஏற்கனவே செயல்படுத்தப்பட்டிருக்கலாம். |
| `form.confirm` | 确认 | Confirm | Konfirmasi | ยืนยัน | Xác nhận | உறுதிப்படுத்து |
| `form.cancel` | 取消 | Cancel | Batal | ยกเลิก | Hủy | ரத்து செய் |
| `form.confirmSubmitTitle` | 确认提交表单？ | Confirm Submission? | Konfirmasi Pengiriman Formulir? | ยืนยันการส่งแบบฟอร์ม? | Xác nhận gửi biểu mẫu? | சமர்ப்பிப்பதை உறுதிப்படுத்தவா? |
| `form.confirmSubmitDesc` | 提交后表单资料将进入正式审核流程，无法撤回或修改，请确认所填信息真实有效。 | Once submitted, your information will be processed and cannot be edited. Please ensure all details are accurate. | Setelah dikirim, data akan diproses dan tidak dapat diubah lagi. Pastikan semua informasi sudah benar. | เมื่อส่งแล้ว ข้อมูลจะเข้าสู่กระบวนการตรวจสอบและไม่สามารถแก้ไขได้ กรุณาตรวจสอบความถูกต้องก่อนส่ง | Sau khi gửi, dữ liệu sẽ được xử lý và không thể chỉnh sửa. Vui lòng kiểm tra kỹ thông tin. | சமர்ப்பித்த பிறகு தகவல்கள் செயலாக்கப்படும்; திருத்த முடியாது. அனைத்து விவரங்களும் சரியானவை என்பதை உறுதிப்படுத்தவும். |
| `form.confirmSubmitBtn` | 确认提交 | Confirm Submit | Konfirmasi Kirim | ยืนยันการส่ง | Xác nhận gửi | சமர்ப்பி |
| `form.checkAgainBtn` | 再检查下 | Check Again | Periksa Lagi | ตรวจสอบอีกครั้ง | Kiểm tra lại | மீண்டும் சரிபார் |
| `form.checkRequired` | 请检查并完善标红的必填项 | Please check and complete the required fields | Harap periksa dan lengkapi kolom wajib bertanda merah | กรุณาตรวจสอบและกรอกข้อมูลในช่องสีแดงให้ครบถ้วน | Vui lòng kiểm tra và điền đầy đủ các mục bắt buộc màu đỏ | சிவப்பு நிறத்தில் உள்ள கட்டாயப் புலங்களைச் சரிபார்த்து நிரப்பவும் |
| `form.backToFirst` | 回到第一页 (重新浏览) | Back to Step 1 | Kembali ke Langkah 1 | กลับไปขั้นตอนที่ 1 | Quay lại Bước 1 | படி 1-க்குத் திரும்பு |
| `form.backToFirstToast` | 已回到第一页 | Returned to Step 1 | Kembali ke Langkah 1 | กลับมาที่ขั้นตอนที่ 1 แล้ว | Đã quay lại Bước 1 | படி 1-க்குத் திரும்பியது |
| `preview.notice` | 当前为表单预览模式，所填内容仅供体验，不会被保存或提交。 | This is a form preview. Information entered here will not be saved or submitted. |  |  |  |  |
| `preview.scanQrTitle` | 手机扫码预览 | Mobile Preview |  |  |  |  |
| `preview.scanQrDesc` | 手机扫码即可体验 | Scan to preview |  |  |  |  |
| `common.selectLanguage` | 选择语言 | Select Language | Pilih Bahasa | เลือกภาษา | Chọn ngôn ngữ | மொழியைத் தேர்ந்தெடு |
| `common.cancel` | 取消 | Cancel | Batal | ยกเลิก | Hủy | ரத்து செய் |
| `common.add` | 添加 | Add | Tambah | เพิ่ม | Thêm | சேர் |
| `common.selected` | 已选 | Selected | Dipilih | เลือกแล้ว | Đã chọn | தேர்ந்தெடுக்கப்பட்டது |
| `common.selectedColon` | 已选: | Selected: | Dipilih: | เลือกแล้ว: | Đã chọn: | தேர்ந்தெடுக்கப்பட்டது: |
| `common.confirm` | 确定 | Confirm | Konfirmasi | ยืนยัน | Xác nhận | உறுதிப்படுத்து |
| `common.remove` | 移除 | Remove | Hapus | ลบ | Xóa | நீக்கு |
| `common.undo` | 撤销 | Undo | Urungkan | ย้อนกลับ | Hoàn tác | செயல்தவிர் |
| `common.searchOptions` | 请输入关键字搜索... | Search options... | Cari opsi... | ค้นหาตัวเลือก... | Tìm kiếm tùy chọn... | விருப்பங்களைத் தேடு... |
| `common.noMatchingOptions` | 未找到相关选项 | No matching options found | Tidak ada opsi yang cocok ditemukan | ไม่พบตัวเลือกที่ตรงกัน | Không tìm thấy tùy chọn phù hợp | பொருந்தும் விருப்பங்கள் இல்லை |
| `common.noMatchingCountry` | 暂无匹配国家、地区或区号 | No matching country, region or code found | Tidak ada negara, wilayah, atau kode yang cocok | ไม่พบประเทศ ภูมิภาค หรือรหัสที่ตรงกัน | Không tìm thấy quốc gia, vùng hoặc mã phù hợp | பொருந்தும் நாடு, பகுதி அல்லது குறியீடு இல்லை |
| `common.selectCountryRegion` | 选择国家/地区 | Select Country/Region | Pilih Negara/Wilayah | เลือกประเทศ/ภูมิภาค | Chọn quốc gia/vùng | நாடு/பகுதியைத் தேர்ந்தெடு |
| `common.selectCountryDialCode` | 选择国家/地区区号 | Select Country/Region Code | Pilih Kode Negara/Wilayah | เลือกรหัสประเทศ/ภูมิภาค | Chọn mã quốc gia/vùng | நாடு/பகுதி குறியீட்டைத் தேர்ந்தெடு |
| `common.selectNationality` | 选择国籍 | Select Nationality | Pilih Kewarganegaraan | เลือกสัญชาติ | Chọn quốc tịch | தேசியத்தைத் தேர்ந்தெடு |
| `common.pleaseSelectNationality` | 请选择国籍 | Please select nationality | Silakan pilih kewarganegaraan | กรุณาเลือกสัญชาติ | Vui lòng chọn quốc tịch | தேசியத்தைத் தேர்ந்தெடுக்கவும் |
| `common.pleaseSelectCountry` | 请选择国家/地区 | Please select country/region | Silakan pilih negara/wilayah | กรุณาเลือกประเทศ/ภูมิภาค | Vui lòng chọn quốc gia/vùng | நாடு/பகுதியைத் தேர்ந்தெடுக்கவும் |
| `common.clickToLocate` | 点击在下方列表中定位 | Click to locate in list | Klik untuk mencari di daftar | คลิกเพื่อค้นหาในรายการ | Nhấn để định vị trong danh sách | பட்டியலில் கண்டறிய கிளிக் செய்யவும் |
| `common.startDate` | 开始日期 | Start Date | Tanggal Mulai | วันที่เริ่มต้น | Ngày bắt đầu | தொடக்க தேதி |
| `common.endDate` | 截止日期 | End Date | Tanggal Berakhir | วันที่สิ้นสุด | Ngày kết thúc | முடிவு தேதி |
| `common.selectDate` | 选择日期 | Select Date | Pilih Tanggal | เลือกวันที่ | Chọn ngày | தேதியைத் தேர்ந்தெடு |
| `common.selectDateRange` | 选择日期范围 | Select Date Range | Pilih Rentang Tanggal | เลือกช่วงวันที่ | Chọn khoảng ngày | தேதி வரம்பைத் தேர்ந்தெடு |
| `common.searchCountryOrCode` | 搜索国家、地区或区号... | Search by country or dial code... | Cari negara, wilayah, atau kode telepon... | ค้นหาประเทศ ภูมิภาค หรือรหัสโทรศัพท์... | Tìm theo quốc gia, vùng hoặc mã vùng... | நாடு, பகுதி அல்லது குறியீட்டைத் தேடு... |
| `common.searchCountryName` | 搜索国家或地区名称... | Search country or region... | Cari negara atau wilayah... | ค้นหาชื่อประเทศหรือภูมิภาค... | Tìm tên quốc gia hoặc vùng... | நாடு அல்லது பகுதியின் பெயரைத் தேடு... |
| `common.signAreaPlaceholder` | 请在下方指定区域签名 | Please sign in the designated area below | Silakan tanda tangani di area berikut | กรุณาลงนามในพื้นที่ที่กำหนดด้านล่าง | Vui lòng ký vào khu vực bên dưới | கீழே உள்ள குறிப்பிட்ட பகுதியில் கையொப்பமிடவும் |
| `common.maxSelectLimit` | 最多只能选择 {max} 项 | Up to {max} items allowed | Maksimal {max} item diperbolehkan | เลือกได้สูงสุด {max} รายการ | Chỉ được chọn tối đa {max} mục | அதிகபட்சம் {max} உருப்படிகள் மட்டுமே |
| `profile.noticeTitle` | 提示 | Notice | Pemberitahuan | ประกาศ | Thông báo | அறிவிப்பு |
| `profile.noticeDesc1` | 根据合规监管要求，您需要完成KYC问卷填写。 | In accordance with regulatory compliance requirements, you are required to complete the KYC questionnaire. | Sesuai persyaratan kepatuhan regulasi, Anda diwajibkan melengkapi kuesioner KYC. | ตามข้อกำหนดด้านการปฏิบัติตามกฎระเบียบ คุณจำเป็นต้องกรอกแบบสอบถาม KYC ให้ครบถ้วน | Theo yêu cầu tuân thủ quy định, bạn cần hoàn thành bảng câu hỏi KYC. | ஒழுங்குமுறை இணக்கத் தேவைகளின்படி, நீங்கள் KYC வினாத்தாளை நிரப்ப வேண்டும். |
| `profile.noticeDesc2` | 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please confirm whether the following information is accurate. If modifications are required, please contact the service provider before proceeding. | Harap pastikan informasi berikut sudah akurat. Jika perlu perubahan, silakan hubungi penyedia layanan sebelum melanjutkan. | โปรดตรวจสอบความถูกต้องของข้อมูลด้านล่าง หากต้องการแก้ไข กรุณาติดต่อผู้ให้บริการก่อนดำเนินการต่อ | Vui lòng xác nhận thông tin dưới đây là chính xác. Nếu cần chỉnh sửa, hãy liên hệ nhà cung cấp dịch vụ trước khi tiếp tục. | கீழே உள்ள தகவல்கள் சரியானவையா என்பதை உறுதிப்படுத்தவும். மாற்றம் தேவைப்பட்டால் தொடரும் முன் சேவை வழங்குநரைத் தொடர்பு கொள்ளவும். |
| `profile.basicDetails` | 基本资料 | Basic Details | Informasi Dasar | ข้อมูลพื้นฐาน | Thông tin cơ bản | அடிப்படை விவரங்கள் |
| `profile.relationshipInfo` | 关联信息 | Relationship Information | Informasi Terkait | ข้อมูลความสัมพันธ์ | Thông tin liên kết | தொடர்பு தகவல் |
| `profile.associatedEntity` | 关联实体 | Associated Entity | Entitas Terkait | นิติบุคคลที่เกี่ยวข้อง | Pháp nhân liên kết | தொடர்புடைய நிறுவனம் |
| `profile.relationshipType` | 关联类型 | Relationship Type | Jenis Hubungan | ประเภทความสัมพันธ์ | Loại quan hệ | உறவு வகை |
| `profile.shareholdingInfo` | 股份与出资信息 | Shareholding & Capital Information | Informasi Kepemilikan Saham & Modal | ข้อมูลผู้ถือหุ้นและทุนจดทะเบียน | Thông tin cổ phần & vốn góp | பங்கு மற்றும் மூலதனத் தகவல் |
| `profile.sharesHeld` | 持有股份数 | Number of Shares Held | Jumlah Saham Dimiliki | จำนวนหุ้นที่ถือครอง | Số lượng cổ phần nắm giữ | வைத்திருக்கும் பங்குகளின் எண்ணிக்கை |
| `profile.allocatedPaidUpAmount` | 对应已缴股本金额 | Allocated Paid-up Amount | Jumlah Modal Disetor Dialokasikan | จำนวนทุนชำระแล้วที่จัดสรร | Số vốn đã góp được phân bổ | ஒதுக்கப்பட்ட செலுத்தப்பட்ட மூலதனம் |
| `profile.companyName` | 企业注册全称 | Company Name | Nama Perusahaan | ชื่อบริษัท | Tên công ty | நிறுவனத்தின் பெயர் |
| `profile.uen` | 统一机构识别码 (UEN) | UEN | UEN | UEN | UEN | UEN |
| `profile.countryOfIncorporation` | 注册设立国家 | Country of Incorporation | Negara Pendirian | ประเทศที่จดทะเบียน | Quốc gia thành lập | பதிவு செய்யப்பட்ட நாடு |
| `profile.entityType` | 法律实体形式 | Entity Type | Bentuk Badan Hukum | ประเภทนิติบุคคล | Loại hình pháp nhân | சட்ட நிறுவன வகை |
| `profile.entityName` | 实体名称 | Entity Name | Nama Entitas | ชื่อนิติบุคคล | Tên pháp nhân | நிறுவனப் பெயர் |
| `profile.entityRegNo` | 实体注册号码 | Registration Number | Nomor Registrasi Entitas | เลขทะเบียนนิติบุคคล | Mã số đăng ký doanh nghiệp | நிறுவனப் பதிவு எண் |
| `profile.formerName` | 曾用名(如有) | Former Name (if any) | Nama Sebelumnya (jika ada) | ชื่อเดิม (ถ้ามี) | Tên trước đây (nếu có) | முன்னாள் பெயர் (இருப்பின்) |
| `profile.jurisdiction` | 注册地 | Place of Incorporation | Yurisdiksi Pendirian | เขตอำนาจที่จดทะเบียน | Nơi thành lập | பதிவு அதிகார வரம்பு |
| `profile.repCapacity` | 授权代表身份 | Authorised Representative Role | Kapasitas / Peran Perwakilan Resmi | บทบาท / ตำแหน่งผู้แทนผู้มีอำนาจ | Vai trò người đại diện được ủy quyền | அங்கீகரிக்கப்பட்ட பிரதிநிதியின் பங்கு |
| `profile.authorizedRep` | 授权代表姓名 | Authorized Representative | Nama Perwakilan Resmi | ชื่อผู้แทนผู้มีอำนาจ | Tên người đại diện được ủy quyền | அங்கீகரிக்கப்பட்ட பிரதிநிதி பெயர் |
| `profile.contactEmail` | 官方联络邮箱 | Contact Email | Email Kontak Resmi | อีเมลติดต่อทางการ | Email liên hệ chính thức | அதிகாரப்பூர்வ மின்னஞ்சல் |
| `profile.registeredAddress` | 企业注册地址 | Registered Address | Alamat Terdaftar | ที่อยู่จดทะเบียน | Địa chỉ đăng ký | பதிவு செய்யப்பட்ட முகவரி |
| `profile.residentialAddress` | 居住地址 | Residential Address | Alamat Tempat Tinggal | ที่อยู่ปัจจุบัน | Địa chỉ thường trú | வசிப்பிட முகவரி |
| `profile.contactAddress` | 联系地址 | Contact Address | Alamat Korespondensi | ที่อยู่ติดต่อ | Địa chỉ liên hệ | தொடர்பு முகவரி |
| `profile.name` | 姓名 | Name | Nama Lengkap | ชื่อ-นามสกุล | Họ và tên | பெயர் |
| `profile.nativeName` | 国籍语言姓名 | Native Name | Nama Bahasa Asli | ชื่อภาษาท้องถิ่น | Tên bản ngữ | தாய்மொழி பெயர் |
| `profile.nationality` | 国籍 | Nationality | Kewarganegaraan | สัญชาติ | Quốc tịch | தேசியம் |
| `profile.singaporeIdentityStatus` | 新加坡身份类型 | Singapore Identity Status | Status Identitas Singapura | สถานะในสิงคโปร์ | Tình trạng cư trú Singapore | சிங்கப்பூர் அடையாள நிலை |
| `profile.nricFin` | NRIC/FIN(如适用) | NRIC/FIN | NRIC/FIN (jika ada) | NRIC/FIN (ถ้ามี) | NRIC/FIN (nếu có) | NRIC/FIN (பொருந்தினால்) |
| `profile.idType` | 证件类型 | ID Type | Jenis Identitas | ประเภทเอกสารยืนยันตัวตน | Loại giấy tờ tùy thân | அடையாள அட்டை வகை |
| `profile.idNumber` | 证件号码 | ID Number | Nomor Identitas | หมายเลขเอกสาร | Số giấy tờ | அடையாள எண் |
| `profile.dob` | 出生日期 | Date of Birth | Tanggal Lahir | วันเกิด | Ngày sinh | பிறந்த தேதி |
| `profile.gender` | 性别 | Gender | Jenis Kelamin | เพศ | Giới tính | பாலினம் |
| `profile.mobilePhone` | 手机号码 | Mobile Phone | Nomor Ponsel | เบอร์โทรศัพท์มือถือ | Số điện thoại di động | கைபேசி எண் |
| `profile.email` | 电子邮箱 | Email | Email | อีเมล | Email | மின்னஞ்சல் |
| `profile.roleDirector` | 董事 | Director | Direktur | กรรมการ | Giám đốc | இயக்குநர் |
| `profile.roleShareholder` | 股东 | Shareholder | Pemegang Saham | ผู้ถือหุ้น | Cổ đông | பங்குதாரர் |
| `profile.roleUbo` | 最终受益人 | Ultimate Beneficial Owner | Pemilik Manfaat Akhir | ผู้รับผลประโยชน์ที่แท้จริง | Chủ sở hữu hưởng lợi cuối cùng | இறுதிப் பயனாளி |
| `profile.shareClass` | 股份类别 | Share Class | Kelas Saham | ประเภทหุ้น | Loại cổ phần | பங்கு வகை |
| `profile.ordinaryShares` | 普通股 | Ordinary Shares | Saham Biasa | หุ้นสามัญ | Cổ phần phổ thông | சாதாரண பங்குகள் |
| `profile.preferenceShares` | 优先股 | Preference Shares | Saham Preferen | หุ้นบุริมสิทธิ | Cổ phần ưu đãi | முன்னுரிமைப் பங்குகள் |

</details>

<details>
<summary><b>🗾 子表 B：东亚与南亚高潜市场（3 语：日语 ja / 韩语 ko / 印地语 hi）▶ 点击展开</b></summary>

| 字段Key / 词条 | 简体中文参考 | 英语参考 | 日语 (`ja`) | 韩国语 (`ko`) | 印地语 (`hi`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `app.title` | 在线表单填报 | Online Form | オンラインフォーム | 온라인 양식 | ऑनलाइन फ़ॉर्म |
| `form.prevStep` | 上一步 | Back | 戻る | 이전 | पिछला |
| `form.nextStep` | 下一步 | Next | 次へ | 다음 | अगला |
| `form.submit` | 确认提交 | Submit Form | 送信する | 양식 제출 | फ़ॉर्म जमा करें |
| `form.submitting` | 提交中... | Submitting... | 送信中... | 제출 중... | जमा हो रहा है... |
| `form.submitSuccess` | 表单已提交 | Form Submitted | 送信が完了しました | 제출 완료 | फ़ॉर्म जमा हो गया |
| `form.submitFailed` | 提交失败，请检查网络后重试 | Submission failed. Please check network and retry. | 送信に失敗しました。ネットワークを確認して再試行してください。 | 제출에 실패했습니다. 네트워크를 확인하고 다시 시도해 주세요. | सबमिशन विफल रहा। कृपया नेटवर्क जांचें और पुनः प्रयास करें। |
| `form.requiredError` | 必填项不能为空 | This field is required | この項目は必須です | 필수 입력 항목입니다 | यह फ़ील्ड आवश्यक है |
| `form.emailError` | 请输入有效的电子邮箱地址 | Please enter a valid email address | 有効なメールアドレスを入力してください | 유효한 이메일 주소를 입력하세요 | कृपया मान्य ईमेल पता दर्ज करें |
| `form.phoneError` | 请输入有效的手机号码 | Please enter a valid phone number | 有効な電話番号を入力してください | 유효한 전화번호를 입력하세요 | कृपया मान्य फ़ोन नंबर दर्ज करें |
| `form.signatureRequired` | 请在下方签名板完成电子手写签名 | Please sign in the signature pad below | 下の署名欄にご署名ください | 아래 서명란에 서명해 주세요 | कृपया नीचे हस्ताक्षर पैड में हस्ताक्षर करें |
| `form.clearSignature` | 重新签名 | Clear Signature | 署名をクリア | 서명 지우기 | हस्ताक्षर साफ़ करें |
| `form.finishSign` | 完成签名 | Done | 完了 | 완료 | पूर्ण |
| `form.reSign` | 修改签名 | Edit | 修正 | 수정 | संपादित करें |
| `form.signPlaceholder` | 请在此处手写签名 | Please sign here | ここにご署名ください | 여기에 서명하세요 | कृपया यहाँ हस्ताक्षर करें |
| `form.selectPlaceholder` | 请点击选择 | Select an option | 選択してください | 옵션 선택 | एक विकल्प चुनें |
| `form.inputPlaceholder` | 请输入 | Enter here | 入力してください | 여기에 입력 | यहाँ दर्ज करें |
| `form.dateLongTerm` | 长期 | Long-term | 長期 | 장기 | दीर्घकालिक |
| `form.dateLongTermDisplay` | 长期有效 | Permanent | 無期限 | 영구 | स्थायी |
| `form.loadFailed` | 获取表单数据失败，请检查链接有效性 | Failed to load form schema. Invalid link. | フォームの読み込みに失敗しました。リンクが無効です。 | 양식을 불러오지 못했습니다. 유효하지 않은 링크입니다. | फ़ॉर्म डेटा लोड करने में विफल। लिंक अमान्य है। |
| `form.successDesc` | 您的填报资料已成功送达，请勿重复提交。 | Your submission has been received. Please do not submit again. | 入力内容は正常に受信されました。重複送信はお控えください。 | 제출하신 정보가 정상적으로 접수되었습니다. 중복 제출하지 마세요. | आपका विवरण प्राप्त हो गया है। कृपया दोबारा जमा न करें। |
| `form.submitTime` | 提交时间 | Submission Time | 送信日時 | 제출 시간 | जमा करने का समय |
| `form.statusLabel` | 当前状态 | Status | ステータス | 상태 | स्थिति |
| `form.statusCompleted` | 已完成 | Completed | 完了 | 완료됨 | पूर्ण |
| `form.closePage` | 关闭页面 | Close Page | ページを閉じる | 페이지 닫기 | पृष्ठ बंद करें |
| `form.returnToList` | 返回待办列表 | Back to Task List | タスク一覧に戻る | 작업 목록으로 돌아가기 | कार्य सूची पर लौटें |
| `form.notFoundTitle` | 链接无效或已失效 | Link Invalid or Expired | リンクが無効または期限切れです | 유효하지 않거나 만료된 링크 | लिंक अमान्य या समाप्त हो गया |
| `form.notFoundDesc` | 未找到对应的填报任务，该链接可能已过期或已被处理 | Task not found. The link may have expired or already been processed. | 対象のタスクが見つかりません。リンクの有効期限切れか、既に処理済みの可能性があります。 | 작업을 찾을 수 없습니다. 링크가 만료되었거나 이미 처리되었을 수 있습니다. | कार्य नहीं मिला। लिंक समाप्त हो गया होगा या पहले ही संसाधित हो चुका है। |
| `form.confirm` | 确认 | Confirm | 確定 | 확인 | पुष्टि करें |
| `form.cancel` | 取消 | Cancel | キャンセル | 취소 | रद्द करें |
| `form.confirmSubmitTitle` | 确认提交表单？ | Confirm Submission? | フォームを送信しますか？ | 양식을 제출하시겠습니까? | फ़ॉर्म जमा करने की पुष्टि करें? |
| `form.confirmSubmitDesc` | 提交后表单资料将进入正式审核流程，无法撤回或修改，请确认所填信息真实有效。 | Once submitted, your information will be processed and cannot be edited. Please ensure all details are accurate. | 送信後は審査処理に進むため内容を編集できません。すべての入力内容が正確であることをご確認ください。 | 제출 후에는 심사가 진행되어 수정할 수 없습니다. 모든 정보가 정확한지 확인해 주세요. | जमा करने के बाद जानकारी संसाधित की जाएगी और संपादित नहीं की जा सकेगी। कृपया सुनिश्चित करें कि सभी विवरण सटीक हैं। |
| `form.confirmSubmitBtn` | 确认提交 | Confirm Submit | 送信を確定 | 제출 확인 | जमा करें |
| `form.checkAgainBtn` | 再检查下 | Check Again | 再確認する | 다시 확인 | फिर से जांचें |
| `form.checkRequired` | 请检查并完善标红的必填项 | Please check and complete the required fields | 赤く表示された必須項目を確認・入力してください | 빨간색으로 표시된 필수 항목을 확인하여 입력해 주세요 | कृपया लाल रंग से चिह्नित आवश्यक फ़ील्ड जांचें और भरें |
| `form.backToFirst` | 回到第一页 (重新浏览) | Back to Step 1 | 最初のページに戻る | 1단계로 돌아가기 | चरण 1 पर लौटें |
| `form.backToFirstToast` | 已回到第一页 | Returned to Step 1 | 最初のページに戻りました | 1단계로 돌아갔습니다 | चरण 1 पर लौटे |
| `preview.notice` | 当前为表单预览模式，所填内容仅供体验，不会被保存或提交。 | This is a form preview. Information entered here will not be saved or submitted. |  |  |  |
| `preview.scanQrTitle` | 手机扫码预览 | Mobile Preview |  |  |  |
| `preview.scanQrDesc` | 手机扫码即可体验 | Scan to preview |  |  |  |
| `common.selectLanguage` | 选择语言 | Select Language | 言語を選択 | 언어 선택 | भाषा चुनें |
| `common.cancel` | 取消 | Cancel | キャンセル | 취소 | रद्द करें |
| `common.add` | 添加 | Add | 追加 | 추가 | जोड़ें |
| `common.selected` | 已选 | Selected | 選択済み | 선택됨 | चयनित |
| `common.selectedColon` | 已选: | Selected: | 選択済み: | 선택됨: | चयनित: |
| `common.confirm` | 确定 | Confirm | 確定 | 확인 | पुष्टि करें |
| `common.remove` | 移除 | Remove | 削除 | 제거 | हटाएं |
| `common.undo` | 撤销 | Undo | 元に戻す | 실행 취소 | पूर्ववत करें |
| `common.searchOptions` | 请输入关键字搜索... | Search options... | 選択肢を検索... | 옵션 검색... | विकल्प खोजें... |
| `common.noMatchingOptions` | 未找到相关选项 | No matching options found | 一致する選択肢がありません | 일치하는 옵션이 없습니다 | कोई मेल खाने वाला विकल्प नहीं मिला |
| `common.noMatchingCountry` | 暂无匹配国家、地区或区号 | No matching country, region or code found | 一致する国・地域または国番号がありません | 일치하는 국가, 지역 또는 국가번호가 없습니다 | कोई मेल खाने वाला देश, क्षेत्र या कोड नहीं मिला |
| `common.selectCountryRegion` | 选择国家/地区 | Select Country/Region | 国・地域を選択 | 국가/지역 선택 | देश/क्षेत्र चुनें |
| `common.selectCountryDialCode` | 选择国家/地区区号 | Select Country/Region Code | 国番号を選択 | 국가번호 선택 | देश/क्षेत्र कोड चुनें |
| `common.selectNationality` | 选择国籍 | Select Nationality | 国籍を選択 | 국적 선택 | राष्ट्रीयता चुनें |
| `common.pleaseSelectNationality` | 请选择国籍 | Please select nationality | 国籍を選択してください | 국적을 선택하세요 | कृपया राष्ट्रीयता चुनें |
| `common.pleaseSelectCountry` | 请选择国家/地区 | Please select country/region | 国・地域を選択してください | 국가/지역을 선택하세요 | कृपया देश/क्षेत्र चुनें |
| `common.clickToLocate` | 点击在下方列表中定位 | Click to locate in list | クリックして一覧で位置を表示 | 목록에서 위치 찾기 | सूची में खोजने के लिए क्लिक करें |
| `common.startDate` | 开始日期 | Start Date | 開始日 | 시작일 | प्रारंभ तिथि |
| `common.endDate` | 截止日期 | End Date | 終了日 | 종료일 | समाप्ति तिथि |
| `common.selectDate` | 选择日期 | Select Date | 日付を選択 | 날짜 선택 | तिथि चुनें |
| `common.selectDateRange` | 选择日期范围 | Select Date Range | 日付範囲を選択 | 날짜 범위 선택 | तिथि सीमा चुनें |
| `common.searchCountryOrCode` | 搜索国家、地区或区号... | Search by country or dial code... | 国・地域または国番号で検索... | 국가, 지역 또는 국가번호 검색... | देश, क्षेत्र या डायल कोड खोजें... |
| `common.searchCountryName` | 搜索国家或地区名称... | Search country or region... | 国・地域名で検索... | 국가 또는 지역명 검색... | देश या क्षेत्र का नाम खोजें... |
| `common.signAreaPlaceholder` | 请在下方指定区域签名 | Please sign in the designated area below | 下の指定エリアにご署名ください | 아래 지정된 영역에 서명해 주세요 | कृपया नीचे निर्दिष्ट क्षेत्र में हस्ताक्षर करें |
| `common.maxSelectLimit` | 最多只能选择 {max} 项 | Up to {max} items allowed | 最大 {max} 件まで選択できます | 최대 {max}개까지 선택할 수 있습니다 | अधिकतम {max} आइटम अनुमत हैं |
| `profile.noticeTitle` | 提示 | Notice | お知らせ | 안내 | सूचना |
| `profile.noticeDesc1` | 根据合规监管要求，您需要完成KYC问卷填写。 | In accordance with regulatory compliance requirements, you are required to complete the KYC questionnaire. | 法令遵守要件に基づき、KYC質問票へのご回答が必要です。 | 규정 준수 요건에 따라 KYC 설문지를 작성하셔야 합니다. | नियामक अनुपालन आवश्यकताओं के अनुसार, आपको KYC प्रश्नावली पूरी करनी होगी। |
| `profile.noticeDesc2` | 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please confirm whether the following information is accurate. If modifications are required, please contact the service provider before proceeding. | 以下の内容に誤りがないかご確認ください。修正が必要な場合は、次へ進む前にサービス提供者へご連絡ください。 | 아래 정보가 정확한지 확인해 주세요. 수정이 필요한 경우 진행하기 전에 서비스 제공업체에 문의하시기 바랍니다. | कृपया पुष्टि करें कि नीचे दी गई जानकारी सटीक है। यदि संशोधन आवश्यक हो, तो आगे बढ़ने से पहले सेवा प्रदाता से संपर्क करें। |
| `profile.basicDetails` | 基本资料 | Basic Details | 基本情報 | 기본 정보 | बुनियादी विवरण |
| `profile.relationshipInfo` | 关联信息 | Relationship Information | 関連情報 | 관련 정보 | संबंध जानकारी |
| `profile.associatedEntity` | 关联实体 | Associated Entity | 関連法人 | 관련 법인 | संबद्ध संस्था |
| `profile.relationshipType` | 关联类型 | Relationship Type | 関係区分 | 관계 유형 | संबंध प्रकार |
| `profile.shareholdingInfo` | 股份与出资信息 | Shareholding & Capital Information | 株式・出資情報 | 주식 및 자본금 정보 | शेयरधारिता और पूंजी जानकारी |
| `profile.sharesHeld` | 持有股份数 | Number of Shares Held | 保有株式数 | 보유 주식 수 | धारित शेयरों की संख्या |
| `profile.allocatedPaidUpAmount` | 对应已缴股本金额 | Allocated Paid-up Amount | 割当払込資本金額 | 배정 납입 자본금 | आवंटित चुकता पूंजी राशि |
| `profile.companyName` | 企业注册全称 | Company Name | 会社名 | 회사명 | कंपनी का नाम |
| `profile.uen` | 统一机构识别码 (UEN) | UEN | UEN | UEN | UEN |
| `profile.countryOfIncorporation` | 注册设立国家 | Country of Incorporation | 設立国 | 설립 국가 | निगमन देश |
| `profile.entityType` | 法律实体形式 | Entity Type | 法人形態 | 법인 형태 | संस्था प्रकार |
| `profile.entityName` | 实体名称 | Entity Name | 法人名 | 법인명 | संस्था का नाम |
| `profile.entityRegNo` | 实体注册号码 | Registration Number | 法人登録番号 | 법인 등록 번호 | संस्था पंजीकरण संख्या |
| `profile.formerName` | 曾用名(如有) | Former Name (if any) | 旧名称（ある場合） | 이전 명칭 (해당 시) | पूर्व नाम (यदि कोई हो) |
| `profile.jurisdiction` | 注册地 | Place of Incorporation | 設立法域 | 설립 관할권 | निगमन क्षेत्राधिकार |
| `profile.repCapacity` | 授权代表身份 | Authorised Representative Role | 授権代表者の役職・資格 | 권한 있는 대표자 역할 | अधिकृत प्रतिनिधि भूमिका |
| `profile.authorizedRep` | 授权代表姓名 | Authorized Representative | 授権代表者氏名 | 권한 있는 대표자 성명 | अधिकृत प्रतिनिधि का नाम |
| `profile.contactEmail` | 官方联络邮箱 | Contact Email | 公式連絡先メール | 공식 연락처 이메일 | आधिकारिक संपर्क ईमेल |
| `profile.registeredAddress` | 企业注册地址 | Registered Address | 登記住所 | 등록 주소 | पंजीकृत पता |
| `profile.residentialAddress` | 居住地址 | Residential Address | 居住住所 | 거주지 주소 | निवास पता |
| `profile.contactAddress` | 联系地址 | Contact Address | 連絡先住所 | 연락처 주소 | संपर्क पता |
| `profile.name` | 姓名 | Name | 氏名 | 성명 | पूरा नाम |
| `profile.nativeName` | 国籍语言姓名 | Native Name | 母国語表記氏名 | 모국어 성명 | मूल भाषा में नाम |
| `profile.nationality` | 国籍 | Nationality | 国籍 | 국적 | राष्ट्रीयता |
| `profile.singaporeIdentityStatus` | 新加坡身份类型 | Singapore Identity Status | シンガポール在留資格 | 싱가포르 체류 자격 | सिंगापुर पहचान स्थिति |
| `profile.nricFin` | NRIC/FIN(如适用) | NRIC/FIN | NRIC/FIN（該当する場合） | NRIC/FIN (해당 시) | NRIC/FIN (यदि लागू हो) |
| `profile.idType` | 证件类型 | ID Type | 本人確認書類の種類 | 신분증 유형 | पहचान पत्र प्रकार |
| `profile.idNumber` | 证件号码 | ID Number | 書類番号 | 신분증 번호 | पहचान संख्या |
| `profile.dob` | 出生日期 | Date of Birth | 生年月日 | 생년월일 | जन्म तिथि |
| `profile.gender` | 性别 | Gender | 性別 | 성별 | लिंग |
| `profile.mobilePhone` | 手机号码 | Mobile Phone | 携帯電話番号 | 휴대전화 번호 | मोबाइल फ़ोन |
| `profile.email` | 电子邮箱 | Email | メールアドレス | 이메일 | ईमेल |
| `profile.roleDirector` | 董事 | Director | 取締役 | 이사 | निदेशक |
| `profile.roleShareholder` | 股东 | Shareholder | 株主 | 주주 | शेयरधारक |
| `profile.roleUbo` | 最终受益人 | Ultimate Beneficial Owner | 実質的支配者 | 실소유자 | अंतिम लाभकारी स्वामी |
| `profile.shareClass` | 股份类别 | Share Class | 株式の種類 | 주식 종류 | शेयर वर्ग |
| `profile.ordinaryShares` | 普通股 | Ordinary Shares | 普通株式 | 보통주 | साधारण शेयर |
| `profile.preferenceShares` | 优先股 | Preference Shares | 優先株式 | 우선주 | अधिमान्य शेयर |

</details>

<details>
<summary><b>🌍 子表 C：欧美与全球主要语种（5 语：西班牙语 es / 法语 fr / 德语 de / 葡萄牙语 pt / 俄语 ru）▶ 点击展开</b></summary>

| 字段Key / 词条 | 简体中文参考 | 英语参考 | 西班牙语 (`es`) | 法语 (`fr`) | 德语 (`de`) | 葡萄牙语 (`pt`) | 俄语 (`ru`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `app.title` | 在线表单填报 | Online Form | Formulario en línea | Formulaire en ligne | Online-Formular | Formulário Online | Онлайн-форма |
| `form.prevStep` | 上一步 | Back | Atrás | Précédent | Zurück | Voltar | Назад |
| `form.nextStep` | 下一步 | Next | Siguiente | Suivant | Weiter | Avançar | Далее |
| `form.submit` | 确认提交 | Submit Form | Enviar formulario | Soumettre le formulaire | Formular absenden | Enviar Formulário | Отправить форму |
| `form.submitting` | 提交中... | Submitting... | Enviando... | Envoi en cours... | Wird gesendet... | Enviando... | Отправка... |
| `form.submitSuccess` | 表单已提交 | Form Submitted | Formulario enviado | Formulaire envoyé | Formular gesendet | Formulário Enviado | Форма отправлена |
| `form.submitFailed` | 提交失败，请检查网络后重试 | Submission failed. Please check network and retry. | Error al enviar. Verifique su conexión e inténtelo de nuevo. | Échec de l'envoi. Veuillez vérifier votre connexion et réessayer. | Senden fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut. | Falha ao enviar. Verifique sua conexão e tente novamente. | Ошибка отправки. Проверьте подключение и повторите попытку. |
| `form.requiredError` | 必填项不能为空 | This field is required | Este campo es obligatorio | Ce champ est obligatoire | Dieses Feld ist erforderlich | Este campo é obrigatório | Это поле обязательно для заполнения |
| `form.emailError` | 请输入有效的电子邮箱地址 | Please enter a valid email address | Ingrese una dirección de correo electrónico válida | Veuillez saisir une adresse e-mail valide | Bitte geben Sie eine gültige E-Mail-Adresse ein | Por favor, insira um e-mail válido | Введите корректный адрес электронной почты |
| `form.phoneError` | 请输入有效的手机号码 | Please enter a valid phone number | Ingrese un número de teléfono válido | Veuillez saisir un numéro de téléphone valide | Bitte geben Sie eine gültige Telefonnummer ein | Por favor, insira um telefone válido | Введите корректный номер телефона |
| `form.signatureRequired` | 请在下方签名板完成电子手写签名 | Please sign in the signature pad below | Firme en el recuadro de firma inferior | Veuillez signer dans la zone de signature ci-dessous | Bitte unterschreiben Sie im Unterschriftenfeld unten | Por favor, assine no quadro de assinatura abaixo | Пожалуйста, поставьте подпись в поле ниже |
| `form.clearSignature` | 重新签名 | Clear Signature | Borrar firma | Effacer la signature | Unterschrift löschen | Limpar Assinatura | Очистить подпись |
| `form.finishSign` | 完成签名 | Done | Listo | Terminer | Fertig | Concluir | Готово |
| `form.reSign` | 修改签名 | Edit | Editar | Modifier | Bearbeiten | Editar | Изменить |
| `form.signPlaceholder` | 请在此处手写签名 | Please sign here | Firme aquí | Veuillez signer ici | Bitte hier unterschreiben | Assine aqui | Подпишите здесь |
| `form.selectPlaceholder` | 请点击选择 | Select an option | Seleccione una opción | Sélectionner une option | Option auswählen | Selecione uma opção | Выберите вариант |
| `form.inputPlaceholder` | 请输入 | Enter here | Ingrese aquí | Saisir ici | Hier eingeben | Digite aqui | Введите здесь |
| `form.dateLongTerm` | 长期 | Long-term | Largo plazo | Long terme | Langfristig | Longo prazo | Бессрочно |
| `form.dateLongTermDisplay` | 长期有效 | Permanent | Permanente | Permanent | Dauerhaft | Permanente | Бессрочно |
| `form.loadFailed` | 获取表单数据失败，请检查链接有效性 | Failed to load form schema. Invalid link. | No se pudo cargar el formulario. Enlace no válido. | Impossible de charger le formulaire. Lien invalide. | Formular konnte nicht geladen werden. Ungültiger Link. | Falha ao carregar o formulário. Link inválido. | Не удалось загрузить форму. Недействительная ссылка. |
| `form.successDesc` | 您的填报资料已成功送达，请勿重复提交。 | Your submission has been received. Please do not submit again. | Su envío se ha recibido correctamente. Por favor, no lo envíe de nuevo. | Votre soumission a bien été enregistrée. Veuillez ne pas soumettre à nouveau. | Ihre Angaben sind eingegangen. Bitte senden Sie das Formular nicht erneut ab. | Seus dados foram recebidos. Por favor, não envie novamente. | Ваши данные успешно получены. Пожалуйста, не отправляйте повторно. |
| `form.submitTime` | 提交时间 | Submission Time | Hora de envío | Heure de soumission | Übermittlungszeit | Horário do Envio | Время отправки |
| `form.statusLabel` | 当前状态 | Status | Estado | Statut | Status | Status | Статус |
| `form.statusCompleted` | 已完成 | Completed | Completado | Terminé | Abgeschlossen | Concluído | Завершено |
| `form.closePage` | 关闭页面 | Close Page | Cerrar página | Fermer la page | Seite schließen | Fechar Página | Закрыть страницу |
| `form.returnToList` | 返回待办列表 | Back to Task List | Volver a la lista de tareas | Retour à la liste des tâches | Zur Aufgabenliste | Voltar para Lista de Tarefas | К списку задач |
| `form.notFoundTitle` | 链接无效或已失效 | Link Invalid or Expired | Enlace inválido o caducado | Lien invalide ou expiré | Link ungültig oder abgelaufen | Link Inválido ou Expirado | Ссылка недействительна или устарела |
| `form.notFoundDesc` | 未找到对应的填报任务，该链接可能已过期或已被处理 | Task not found. The link may have expired or already been processed. | No se encontró la tarea. El enlace puede haber caducado o ya haber sido procesado. | Tâche introuvable. Le lien a peut-être expiré ou a déjà été traité. | Aufgabe nicht gefunden. Der Link ist möglicherweise abgelaufen oder wurde bereits bearbeitet. | Tarefa não encontrada. O link pode ter expirado ou já foi processado. | Задача не найдена. Срок действия ссылки истёк или она уже обработана. |
| `form.confirm` | 确认 | Confirm | Confirmar | Confirmer | Bestätigen | Confirmar | Подтвердить |
| `form.cancel` | 取消 | Cancel | Cancelar | Annuler | Abbrechen | Cancelar | Отмена |
| `form.confirmSubmitTitle` | 确认提交表单？ | Confirm Submission? | ¿Confirmar envío del formulario? | Confirmer la soumission ? | Übermittlung bestätigen? | Confirmar Envio? | Подтвердить отправку формы? |
| `form.confirmSubmitDesc` | 提交后表单资料将进入正式审核流程，无法撤回或修改，请确认所填信息真实有效。 | Once submitted, your information will be processed and cannot be edited. Please ensure all details are accurate. | Una vez enviado, la información será procesada y no podrá editarse. Asegúrese de que todos los datos sean correctos. | Une fois soumises, vos informations seront traitées et ne pourront plus être modifiées. Veuillez vérifier leur exactitude. | Nach dem Absenden werden Ihre Daten verarbeitet und können nicht mehr geändert werden. Bitte prüfen Sie alle Angaben. | Após o envio, as informações serão processadas e não poderão ser editadas. Certifique-se de que todos os dados estão corretos. | После отправки данные поступят на проверку и их нельзя будет изменить. Убедитесь в правильности всех сведений. |
| `form.confirmSubmitBtn` | 确认提交 | Confirm Submit | Confirmar envío | Confirmer l’envoi | Absenden bestätigen | Confirmar Envio | Подтвердить отправку |
| `form.checkAgainBtn` | 再检查下 | Check Again | Revisar de nuevo | Vérifier à nouveau | Erneut prüfen | Verificar Novamente | Проверить ещё раз |
| `form.checkRequired` | 请检查并完善标红的必填项 | Please check and complete the required fields | Por favor revise y complete los campos obligatorios marcados en rojo | Veuillez vérifier et remplir les champs obligatoires marqués en rouge | Bitte prüfen und vervollständigen Sie die rot markierten Pflichtfelder | Por favor, verifique e preencha os campos obrigatórios destacados em vermelho | Пожалуйста, проверьте и заполните обязательные поля, отмеченные красным |
| `form.backToFirst` | 回到第一页 (重新浏览) | Back to Step 1 | Volver al Paso 1 | Retour à l’étape 1 | Zurück zu Schritt 1 | Voltar ao Passo 1 | Вернуться к шагу 1 |
| `form.backToFirstToast` | 已回到第一页 | Returned to Step 1 | Volvió al Paso 1 | Retour à l’étape 1 | Zurück zu Schritt 1 | Voltou ao Passo 1 | Вы вернулись к шагу 1 |
| `preview.notice` | 当前为表单预览模式，所填内容仅供体验，不会被保存或提交。 | This is a form preview. Information entered here will not be saved or submitted. |  |  |  |  |  |
| `preview.scanQrTitle` | 手机扫码预览 | Mobile Preview |  |  |  |  |  |
| `preview.scanQrDesc` | 手机扫码即可体验 | Scan to preview |  |  |  |  |  |
| `common.selectLanguage` | 选择语言 | Select Language | Seleccionar idioma | Choisir la langue | Sprache wählen | Selecionar Idioma | Выберите язык |
| `common.cancel` | 取消 | Cancel | Cancelar | Annuler | Abbrechen | Cancelar | Отмена |
| `common.add` | 添加 | Add | Agregar | Ajouter | Hinzufügen | Adicionar | Добавить |
| `common.selected` | 已选 | Selected | Seleccionado | Sélectionné | Ausgewählt | Selecionado | Выбрано |
| `common.selectedColon` | 已选: | Selected: | Seleccionado: | Sélectionné : | Ausgewählt: | Selecionado: | Выбрано: |
| `common.confirm` | 确定 | Confirm | Confirmar | Confirmer | Bestätigen | Confirmar | Подтвердить |
| `common.remove` | 移除 | Remove | Eliminar | Supprimer | Entfernen | Remover | Удалить |
| `common.undo` | 撤销 | Undo | Deshacer | Annuler | Rückgängig | Desfazer | Отменить |
| `common.searchOptions` | 请输入关键字搜索... | Search options... | Buscar opciones... | Rechercher des options... | Optionen suchen... | Pesquisar opções... | Поиск вариантов... |
| `common.noMatchingOptions` | 未找到相关选项 | No matching options found | No se encontraron opciones coincidentes | Aucune option correspondante | Keine passenden Optionen gefunden | Nenhuma opção correspondente encontrada | Подходящие варианты не найдены |
| `common.noMatchingCountry` | 暂无匹配国家、地区或区号 | No matching country, region or code found | No se encontró ningún país, región o código coincidente | Aucun pays, région ou indicatif correspondant | Kein passendes Land, keine Region und keine Vorwahl gefunden | Nenhum país, região ou código correspondente | Страна, регион или код не найдены |
| `common.selectCountryRegion` | 选择国家/地区 | Select Country/Region | Seleccionar país/región | Sélectionner un pays/région | Land/Region wählen | Selecionar País/Região | Выберите страну/регион |
| `common.selectCountryDialCode` | 选择国家/地区区号 | Select Country/Region Code | Seleccionar código de país/región | Sélectionner un indicatif pays/région | Ländervorwahl wählen | Selecionar Código do País/Região | Выберите код страны/региона |
| `common.selectNationality` | 选择国籍 | Select Nationality | Seleccionar nacionalidad | Sélectionner la nationalité | Staatsangehörigkeit wählen | Selecionar Nacionalidade | Выберите гражданство |
| `common.pleaseSelectNationality` | 请选择国籍 | Please select nationality | Seleccione nacionalidad | Veuillez sélectionner une nationalité | Bitte Staatsangehörigkeit wählen | Por favor, selecione a nacionalidade | Пожалуйста, выберите гражданство |
| `common.pleaseSelectCountry` | 请选择国家/地区 | Please select country/region | Seleccione país/región | Veuillez sélectionner un pays/région | Bitte Land/Region wählen | Por favor, selecione o país/região | Пожалуйста, выберите страну/регион |
| `common.clickToLocate` | 点击在下方列表中定位 | Click to locate in list | Haga clic para ubicar en la lista | Cliquer pour localiser dans la liste | Klicken, um in der Liste zu springen | Clique para localizar na lista | Нажмите, чтобы найти в списке |
| `common.startDate` | 开始日期 | Start Date | Fecha de inicio | Date de début | Startdatum | Data de Início | Дата начала |
| `common.endDate` | 截止日期 | End Date | Fecha de fin | Date de fin | Enddatum | Data de Término | Дата окончания |
| `common.selectDate` | 选择日期 | Select Date | Seleccionar fecha | Sélectionner une date | Datum wählen | Selecionar Data | Выберите дату |
| `common.selectDateRange` | 选择日期范围 | Select Date Range | Seleccionar rango de fechas | Sélectionner une plage de dates | Datumsbereich wählen | Selecionar Período | Выберите период |
| `common.searchCountryOrCode` | 搜索国家、地区或区号... | Search by country or dial code... | Buscar país, región o código... | Rechercher un pays, région ou indicatif... | Nach Land, Region oder Vorwahl suchen... | Buscar por país, região ou código... | Поиск страны, региона или кода... |
| `common.searchCountryName` | 搜索国家或地区名称... | Search country or region... | Buscar país o región... | Rechercher un pays ou une région... | Land oder Region suchen... | Buscar país ou região... | Поиск страны или региона... |
| `common.signAreaPlaceholder` | 请在下方指定区域签名 | Please sign in the designated area below | Firme en el área designada a continuación | Veuillez signer dans la zone désignée ci-dessous | Bitte im vorgesehenen Feld unten unterschreiben | Assine na área designada abaixo | Пожалуйста, подпишите в указанной области ниже |
| `common.maxSelectLimit` | 最多只能选择 {max} 项 | Up to {max} items allowed | Máximo {max} elementos permitidos | Jusqu’à {max} éléments autorisés | Maximal {max} Einträge zulässig | Máximo de {max} itens permitidos | Можно выбрать не более {max} элементов |
| `profile.noticeTitle` | 提示 | Notice | Aviso | Avis | Hinweis | Aviso | Уведомление |
| `profile.noticeDesc1` | 根据合规监管要求，您需要完成KYC问卷填写。 | In accordance with regulatory compliance requirements, you are required to complete the KYC questionnaire. | De acuerdo con los requisitos normativos, debe completar el cuestionario KYC. | Conformément aux exigences réglementaires, vous devez remplir le questionnaire KYC. | Gemäß den gesetzlichen Compliance-Anforderungen müssen Sie den KYC-Fragebogen ausfüllen. | De acordo com os requisitos regulatórios de conformidade, você deve preencher o questionário KYC. | В соответствии с нормативными требованиями вам необходимо заполнить анкету KYC. |
| `profile.noticeDesc2` | 请确认以下信息是否准确，如需修改，请联系服务商修改后再进行下一步。 | Please confirm whether the following information is accurate. If modifications are required, please contact the service provider before proceeding. | Confirme que la siguiente información es correcta. Si requiere modificaciones, comuníquese con el proveedor de servicios antes de continuar. | Veuillez confirmer l’exactitude des informations suivantes. En cas de modification, veuillez contacter votre prestataire avant de continuer. | Bitte bestätigen Sie, dass die folgenden Angaben korrekt sind. Bei Änderungsbedarf wenden Sie sich bitte vor dem Fortfahren an Ihren Dienstleister. | Confirme se as informações abaixo estão corretas. Caso precise corrigir, entre em contato com o provedor de serviços antes de prosseguir. | Пожалуйста, подтвердите точность указанных данных. Если требуются изменения, свяжитесь с поставщиком услуг перед продолжением. |
| `profile.basicDetails` | 基本资料 | Basic Details | Datos básicos | Informations de base | Basisdaten | Dados Básicos | Основные сведения |
| `profile.relationshipInfo` | 关联信息 | Relationship Information | Información de relación | Informations sur les relations | Beziehungsangaben | Informações de Relacionamento | Связанная информация |
| `profile.associatedEntity` | 关联实体 | Associated Entity | Entidad asociada | Entité associée | Verbundene Einheit | Entidade Associada | Связанное лицо |
| `profile.relationshipType` | 关联类型 | Relationship Type | Tipo de relación | Type de relation | Beziehungsart | Tipo de Vínculo | Тип связи |
| `profile.shareholdingInfo` | 股份与出资信息 | Shareholding & Capital Information | Información accionaria y de capital | Actionnariat et capital | Anteils- & Kapitalangaben | Participação Acionária e Capital | Сведения об акциях и капитале |
| `profile.sharesHeld` | 持有股份数 | Number of Shares Held | Número de acciones | Nombre d’actions détenues | Anzahl gehaltener Anteile | Número de Ações | Количество акций |
| `profile.allocatedPaidUpAmount` | 对应已缴股本金额 | Allocated Paid-up Amount | Capital desembolsado asignado | Capital libéré attribué | Zugewiesenes eingezahltes Kapital | Capital Integralizado Alocado | Выделенный оплаченный капитал |
| `profile.companyName` | 企业注册全称 | Company Name | Nombre de la empresa | Nom de la société | Firmenname | Nome da Empresa | Название компании |
| `profile.uen` | 统一机构识别码 (UEN) | UEN | UEN | UEN | UEN | UEN | UEN |
| `profile.countryOfIncorporation` | 注册设立国家 | Country of Incorporation | País de constitución | Pays de constitution | Gründungsland | País de Constituição | Страна регистрации |
| `profile.entityType` | 法律实体形式 | Entity Type | Tipo de entidad | Forme juridique | Rechtsform | Tipo de Entidade | Организационно-правовая форма |
| `profile.entityName` | 实体名称 | Entity Name | Nombre de la entidad | Nom de l’entité | Name der Einheit | Nome da Entidade | Наименование организации |
| `profile.entityRegNo` | 实体注册号码 | Registration Number | Número de registro | Numéro d’immatriculation | Registernummer | Número de Registro | Регистрационный номер |
| `profile.formerName` | 曾用名(如有) | Former Name (if any) | Nombre anterior (si aplica) | Ancien nom (le cas échéant) | Früherer Name (falls zutreffend) | Nome Anterior (se houver) | Прежнее наименование (если есть) |
| `profile.jurisdiction` | 注册地 | Place of Incorporation | Jurisdicción de constitución | Juridiction d’immatriculation | Gründungsrechtsraum | Jurisdição de Constituição | Юрисдикция регистрации |
| `profile.repCapacity` | 授权代表身份 | Authorised Representative Role | Rol de representante autorizado | Rôle du représentant autorisé | Funktion des Vertreters | Cargo do Representante Autorizado | Роль уполномоченного представителя |
| `profile.authorizedRep` | 授权代表姓名 | Authorized Representative | Nombre del representante autorizado | Nom du représentant autorisé | Bevollmächtigter Vertreter | Representante Autorizado | Уполномоченный представитель |
| `profile.contactEmail` | 官方联络邮箱 | Contact Email | Correo de contacto oficial | E-mail officiel | Offizielle Kontakt-E-Mail | E-mail Oficial | Официальный e-mail |
| `profile.registeredAddress` | 企业注册地址 | Registered Address | Domicilio registrado | Siège social | Registrierte Adresse | Endereço Registrado | Юридический адрес |
| `profile.residentialAddress` | 居住地址 | Residential Address | Dirección residencial | Adresse de résidence | Wohnadresse | Endereço Residencial | Адрес проживания |
| `profile.contactAddress` | 联系地址 | Contact Address | Dirección de contacto | Adresse de contact | Kontaktadresse | Endereço de Contato | Контактный адрес |
| `profile.name` | 姓名 | Name | Nombre completo | Nom complet | Vollständiger Name | Nome Completo | Полное имя |
| `profile.nativeName` | 国籍语言姓名 | Native Name | Nombre en idioma nativo | Nom en langue maternelle | Name in Landessprache | Nome no Idioma Nativo | Имя на родном языке |
| `profile.nationality` | 国籍 | Nationality | Nacionalidad | Nationalité | Staatsangehörigkeit | Nacionalidade | Гражданство |
| `profile.singaporeIdentityStatus` | 新加坡身份类型 | Singapore Identity Status | Estatus de identidad en Singapur | Statut à Singapour | Singapur-Identitätsstatus | Status em Singapura | Статус в Сингапуре |
| `profile.nricFin` | NRIC/FIN(如适用) | NRIC/FIN | NRIC/FIN (si aplica) | NRIC/FIN (le cas échéant) | NRIC/FIN (falls vorhanden) | NRIC/FIN (se aplicável) | NRIC/FIN (если применимо) |
| `profile.idType` | 证件类型 | ID Type | Tipo de documento | Type de pièce d’identité | Ausweistyp | Tipo de Documento | Тип документа |
| `profile.idNumber` | 证件号码 | ID Number | Número de documento | Numéro de pièce | Ausweisnummer | Número do Documento | Номер документа |
| `profile.dob` | 出生日期 | Date of Birth | Fecha de nacimiento | Date de naissance | Geburtsdatum | Data de Nascimento | Дата рождения |
| `profile.gender` | 性别 | Gender | Género | Sexe | Geschlecht | Gênero | Пол |
| `profile.mobilePhone` | 手机号码 | Mobile Phone | Teléfono móvil | Téléphone mobile | Mobiltelefon | Celular | Мобильный телефон |
| `profile.email` | 电子邮箱 | Email | Correo electrónico | E-mail | E-Mail | E-mail | Электронная почта |
| `profile.roleDirector` | 董事 | Director | Director | Administrateur | Geschäftsführer | Diretor | Директор |
| `profile.roleShareholder` | 股东 | Shareholder | Accionista | Actionnaire | Anteilseigner | Acionista | Акционер |
| `profile.roleUbo` | 最终受益人 | Ultimate Beneficial Owner | Beneficiario final | Bénéficiaire effectif | Wirtschaftlich Berechtigter | Beneficiário Final | Конечный бенефициар |
| `profile.shareClass` | 股份类别 | Share Class | Clase de acciones | Catégorie d’actions | Aktienklasse | Classe de Ações | Класс акций |
| `profile.ordinaryShares` | 普通股 | Ordinary Shares | Acciones ordinarias | Actions ordinaires | Stammaktien | Ações Ordinárias | Обыкновенные акции |
| `profile.preferenceShares` | 优先股 | Preference Shares | Acciones preferentes | Actions de préférence | Vorzugsaktien | Ações Preferenciais | Привилегированные акции |

</details>

## 统一校验提示（16 国语言内置映射，无需人工设置与翻译）
| 序号 | 语言 | 显示名称 | 语言代码 | 必填统一提示 | 格式错误提示 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 英语（默认） | English | en | Please complete all required fields. | Invalid format. |
| 2 | 简体中文 | 简体中文 | zh-Hans (内部兼容 zh) | 请填写所有必填项。 | 格式无效。 |
| 3 | 繁体中文 | 繁體中文 | zh-Hant | 請填寫所有必填項。 | 格式無效。 |
| 4 | 马来语 | Bahasa Melayu | ms | Sila lengkapkan semua medan yang diperlukan. | Format tidak sah. |
| 5 | 印度尼西亚语 | Bahasa Indonesia | id | Harap lengkapi semua kolom yang wajib diisi. | Format tidak valid. |
| 6 | 泰米尔语 | தமிழ் | ta | தேவையான அனைத்து புலங்களையும் பூர்த்தி செய்யவும். | தவறான வடிவம். |
| 7 | 泰语 | ไทย | th | โปรดกรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน | รูปแบบไม่ถูกต้อง |
| 8 | 越南语 | Tiếng Việt | vi | Vui lòng hoàn thành tất cả các trường bắt buộc. | Định dạng không hợp lệ. |
| 9 | 日语 | 日本語 | ja | 必須項目をすべてご入力ください。 | 形式が無効です。 |
| 10 | 韩语 | 한국어 | ko | 필수 항목을 모두 입력해 주세요. | 형식이 올바르지 않습니다. |
| 11 | 印地语 | हिन्दी | hi | कृपया सभी आवश्यक फ़ील्ड भरें। | अमान्य प्रारूप। |
| 12 | 西班牙语 | Español | es | Por favor, complete todos los campos obligatorios. | Formato no válido. |
| 13 | 法语 | Français | fr | Veuillez remplir tous les champs obligatoires. | Format invalide. |
| 14 | 德语 | Deutsch | de | Bitte füllen Sie alle Pflichtfelder aus. | Ungültiges Format. |
| 15 | 葡萄牙语 | Português | pt | Por favor, preencha todos os campos obrigatórios. | Formato inválido. |
| 16 | 俄语 | Русский | ru | Пожалуйста, заполните все обязательные поля. | Неверный формат. |

