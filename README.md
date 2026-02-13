# Way UI - Vue3 企业级组件库解决方案

<!-- 建议后续替换为实际架构图 -->
<!-- ![Way UI Architecture](/public/vue.svg) -->

一套基于 Vue3 + Element Plus 的企业级中后台组件库解决方案，提供完整的工程化体系和可定制主题。

- @way-ui
  - commitlint-config
  - components
  - constants
  - directives
  - eslint-config
  - eslint-config-typescript
  - hooks
  - internal-utils
  - lint-staged-config
  - plugins
  - prettier-config
  - shared-libs
  - stores
  - stylelint-config
  - styles
  - theme-chalk
  - unplugin
  - utils
- way-ui
- playground

## ✨ 特性

- 📦 开箱即用的 Monorepo 多包管理
- 🎨 支持 CSS 变量注入的主题系统
- ⚡ 深度优化的工程化配置（ESLint + Stylelint + Changesets）
- 🔧 丰富的工具链支持（指令系统、插件体系、共享库集成）

## 🏗 项目架构

```mermaid
graph TD
    root[way-design]
    style root fill:#F5F7FA,stroke:#4A90E2

    root --> config[工程化配置]
    root --> packages(packages 多包工作区)

    subgraph config [工程配置]
        direction LR
        changeset[Changesets] -->|版本管理| pnpm[pnpm workspaces]
        lint[ESLint/Stylelint] -->|代码质量| commit[Husky/lint-staged]
    end

    subgraph 配置模块
        direction TB
        commitlint[[@way-ui/commitlint-config]]
        eslint[eslint]
        eslint -.-> javascript[[@way-ui/eslint-config]]
        eslint -.-> typescript[[@way-ui/eslint-config-typescript]]
        stylelint[[@way-ui/stylelint-config]]
        prettier[[@way-ui/prettier-config]]
        lint-staged[[@way-ui/lint-staged-config]]
    end

    subgraph packages [核心模块]
        direction TB
        way-ui[[way-ui]]
        way-ui -.-> components[[@way-ui/components]]
        way-ui -.-> directives[[@way-ui/directives]]
        way-ui -.-> internal[[@way-ui/internal-utils]]
        way-ui -.-> plugins[[@way-ui/plugins]]
        way-ui -.-> theme[[@way-ui/theme-chalk]]
        constants[[@way-ui/constants]]
        hooks[[@way-ui/hooks]]
        stores[[@way-ui/stores]]
        styles[[@way-ui/styles]]
    end

    subgraph 工具模块
        direction TB
        libs[[@way-ui/shared-libs]]
        unplugin[[@way-ui/unplugin]]
        utils[[@way-ui/utils]]
    end

    config --> 配置模块
    packages --> 工具模块

    classDef core fill:#FFF7E6,stroke:#FFA940
    classDef config fill:#E6F4FF,stroke:#1890FF
    classDef tool fill:#F6FFED,stroke:#73D13D
```

架构说明：

1. **核心模块**：包含组件库、主题系统、工具库和第三方库集成
2. **配置模块**：统一管理代码规范、提交规范和工程配置
3. **工具模块**：提供指令系统、插件体系等扩展能力

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm add prettier-plugin-tailwindcss --filter @way-ui/prettier-config
```

```bash
pnpm add stylelint@16.9.0 --save-peer --filter @way-ui/stylelint-config
```

```bash
pnpm add --workspace @way-ui/constants --filter @way-ui/components
```

要在 pnpm 工作空间上配置 changesets，请将 changesets 作为开发依赖项安装在工作空间的根目录中：

```bash
pnpm add -Dw @changesets/cli
```

```bash
pnpm -F @way-ui/playground dev
```

## 🔖 版本发布流程

```bash
# 1. 生成变更集（选择需要发布的包）
pnpm changeset

# 2. 提升版本号（自动更新 CHANGELOG）
pnpm changeset version

# 3. 发布到仓库
pnpm changeset-publish
```

## 📄 许可证

[MIT License](LICENSE) © 2026 Team Wang
