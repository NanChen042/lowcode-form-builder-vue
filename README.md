# Low-Code Form Builder (Vue 3 + TypeScript + Arco Design)

现代化多步表单低代码可视化设计器与预览引擎，深度对齐生产级 KYC / 业务合规表单场景。

> 📖 **产品与业务文档**：查看完整的前端实现功能清单、交互流程与使用教程，请参阅 [产品功能全景与使用教程 (PRODUCT_FEATURE_GUIDE.md)](./PRODUCT_FEATURE_GUIDE.md)。

## 🌟 核心特性

- **可视化画布与拖拽排布**：支持单行文本、多行文本、下拉选择、单选框、复选框、日期选择、国家/地区、国籍、手机号码（集成国际区号）、电子邮箱、手写签名、提示卡片等多类型表单控件。
- **全量国际化与多语言**：支持中英文无缝切换，字段标题、占位符、提示说明、预设选项等均支持多语言配置。
- **全球 244 国/地区电信规则与国旗精灵图**：集成 `intl-tel-input` 与 244 国电信格式校验库，默认支持新加坡（+65）、中国（+86）、香港（+852）等，内置支持清单弹窗即时检索。
- **国际 KYC / AML 国家与国籍选择器**：内置全球 ISO-3166 标准 244 个国家与国籍选项，支持与后端 `/index/getcountry` 接口异步同步。
- **多步向导与移动端仿真预览**：内置高拟真手机外观交互容器，支持分步骤进度导航、实时表单字段严谨校验与汇总上报。
- **JSON Schema 导入导出**：完整 Schema 实时双向绑定，支持一键查看与复制标准 JSON 数据协议。

## 🛠 技术栈

- **框架**：Vue 3 (Composition API, `<script setup>`)
- **语言**：TypeScript 5
- **构建工具**：Vite 8
- **组件库**：Arco Design Vue (`@arco-design/web-vue`)
- **样式**：Tailwind CSS
- **图标**：Lucide Vue Next (`@lucide/vue`)
- **国际手机号码**：Intl-Tel-Input v25

## 🚀 快速开始

```bash
# 安装依赖
npm install
# 或使用 pnpm
pnpm install

# 启动本地开发服务
npm run dev

# 类型检查与生产打包
npm run build
```

## 📄 开源许可

[MIT License](LICENSE)
