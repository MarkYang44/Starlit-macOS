[English](README.md) | 简体中文

<img src="src/desktop/assets/icon.png" alt="星伴 / Starlit icon" width="112">

# 星伴 · Starlit

基于 **[Unclecheng-li 原作「星伴」](https://unclecheng-li.github.io/starlit.com/)** 的非官方 **Apple Silicon macOS 适配版**。

在 Mac 上使用原有角色聊天界面、本地会话和角色记忆，连接自己选择的模型服务。应用自带原生本地后端，安装后的名称为 **星伴.app**。

[![Release](https://img.shields.io/github/v/release/MarkYang44/Starlit-macOS?include_prereleases&label=release)](https://github.com/MarkYang44/Starlit-macOS/releases)
![Platform](https://img.shields.io/badge/platform-macOS%20%C2%B7%20Apple%20Silicon-30343b)
![Status](https://img.shields.io/badge/status-community%20RC-orange)

**[下载与版本说明](https://github.com/MarkYang44/Starlit-macOS/releases)** · [快速开始](#快速开始) · [源码范围](#源码范围) · [原作项目](https://github.com/Unclecheng-li/starlit.com)

> **原作声明：**「星伴 / Starlit」由 **[Unclecheng-li](https://github.com/Unclecheng-li)** 创作。本仓库维护 macOS 适配，不是官方项目。当前版本基于 **Windows 1.0.0-rc.10**，不代表已经同步原作后续更新。[来源与授权范围](THIRD_PARTY_NOTICES.md)。

## 项目概览

星伴使用网页界面呈现角色聊天，通过本地后端管理会话和记忆，并调用用户配置的模型 API。本适配版将 macOS ARM64 Python 后端与 Electron 打包在一起，运行时无需另行安装 Python。

“本地后端”不等于“完全离线推理”：生成回复时，对话及相关上下文会发送给你配置的模型服务商。也可以自行配置兼容的本地模型接口，但安装包不包含模型权重或推理服务。

## macOS 适配内容

- **原生后端运行：**使用 macOS ARM64 可执行文件，替代 Windows 后端。
- **桌面集成：**macOS 原生窗口控制、编辑与窗口菜单、单实例运行及后端退出管理。
- **原有聊天体验：**保留角色、群聊、本地记录与记忆，以及原作随包角色和表情资源。
- **模型实测修复：**提高连接测试的输出预算，避免原先仅 8 token 的限制被模型思考过程耗尽。
- **可选消息通知：**在设置中开启「页外通知」并授予权限；窗口隐藏/最小化或其他会话收到消息时可通知。静音会话和当前可见会话不弹窗。关闭窗口后，当前基于网页渲染进程的通知路径停止工作。
- **更新机制隔离：**macOS 不调用原作的 Windows 安装器更新，通过替换应用手动升级。

保留原有手机配对/局域网同步入口。Android 真机互通、图片/TTS 流程和外部搜索尚未在本适配版上验证。

## 安装

1. 从 [Releases](https://github.com/MarkYang44/Starlit-macOS/releases) 下载 **`Starlit-1.0.0-rc.10-mac.3-macOS-arm64.dmg`**。
2. 打开磁盘映像，将 **星伴.app** 拖入 **Applications（应用程序）**。
3. 推出磁盘映像，从应用程序目录启动 **星伴**。

本包仅包含 **Apple Silicon** 代码，**不支持 Intel Mac**。运行验证环境为 **macOS 27.0.1 / Apple Silicon**。应用声明最低系统版本为 macOS 13，但尚未验证 macOS 13–26，不能据此保证旧系统兼容性。

应用使用 **ad-hoc 本地签名**，**未经过 Apple 公证**。如果 macOS 拦截可信来源的下载副本，请使用系统「隐私与安全性 → 仍要打开」流程；无需关闭 Gatekeeper。[详细安装与升级说明](docs/INSTALLATION.md)。

同时下载 `SHA256SUMS.txt`，在下载目录执行校验：

```bash
shasum -a 256 -c SHA256SUMS.txt
```

## 快速开始

1. 启动星伴，在设置中完整填写模型的 **API Key、Base URL、模型名**；输入框中的占位提示不是实际配置。
2. 保存模型设置，运行模型实测。实测成功只说明这次服务请求可用，不代表服务商的全部能力都已验证。
3. 选择角色并发送消息。调用费用由你使用的模型服务商决定。
4. 如需通知，开启「页外通知」，并允许系统通知；需要保留窗口打开或最小化。

关闭窗口后，本地后端继续驻留；点击 Dock 图标可重新打开。通过 **星伴 → 退出** 完整停止应用和后端。

## 源码范围

本仓库提供**现有可读的桌面端与网页源码、macOS 兼容补丁和打包/验证工具**，不等同于原作完整源码开源。

| 组件 | 当前提供形式 |
| --- | --- |
| Electron 主进程与 preload | [`src/desktop`](src/desktop) 内的可读 CommonJS 源码，来自已安装的 RC10 适配版 |
| 网页界面 | [`src/webclient`](src/webclient) 内的 JavaScript、HTML、CSS |
| 后端模型诊断兼容补丁 | [`src/backend`](src/backend) 内的 Python 源码 |
| 原始 Python 业务逻辑 | 未取得原始 `.py` 源文件；运行时使用恢复的 CPython 3.13 字节码 |
| 原生运行时、角色与大体积媒体 | 随安装包提供，不进入 Git 历史 |

打包工具将仓库源码覆盖到**另行提供的原生应用包**，更新 ASAR 完整性信息、规范应用名称、签名并生成 DMG。它不会仅凭本仓库编译出原作 Python 后端。[构建步骤与限制](docs/BUILD.md)。

## 数据与隐私

用户数据独立保存在：

```text
~/Library/Application Support/starlit-macos/
```

其中包含 API 配置、聊天记录、角色记忆、导入的资源及 Chromium 配置。由「星伴 Mac」改名为「星伴」时保留原数据目录和应用标识，不主动迁移或删除聊天数据。

模型请求会访问你指定的服务商；可选集成可能发起其他网络请求。局域网同步可能在本地网络提供受令牌保护的服务。请勿公开用户数据目录或访问令牌。安装包使用初始化资源，不包含维护者的个人配置或 API Key。[网络端口、通知与隐私说明](docs/PRIVACY.md)。

## 开发

打包需要 **macOS、Python 3.11+、Apple Command Line Tools**，以及另行提供的原生 macOS 应用。JavaScript 检查及进程测试使用 Node.js；打包工具不需要 npm 依赖。

```bash
git clone https://github.com/MarkYang44/Starlit-macOS.git
cd Starlit-macOS
python3 -m unittest discover -s tests -v
node --test tests/lifecycle.test.cjs
python3 tools/package.py --base-app '/Applications/星伴.app'
```

最后一步是**重新打包**，不是完整源码构建。产物输出至 `dist/`，中间目录和运行时不提交至 Git。不要把 Windows EXE 作为 `--base-app` 输入。

## 验证与限制

RC10 适配阶段已检查原生后端启动、本地 HTTP 鉴权、网页交付、WebSocket 消息收发、持久化及真实模型短请求诊断。此前完整聊天流程使用过本地模拟模型，不能据此宣称真实模型长期对话质量已通过验证。

当前版本增加归档完整性、应用元数据/标识、发布内容检查、签名校验与挂载安装包启动验证。[版本验证记录](docs/VALIDATION.md)。CI 仅检查源码与工具，不代表能重建尚未取得源码的原始后端，也不替代 macOS 图形环境验证。

## 文档

| 文档 | 内容 |
| --- | --- |
| [安装与升级](docs/INSTALLATION.md) | 首次启动、改名升级、数据保留与故障排查 |
| [构建指南](docs/BUILD.md) | 打包输入、源码边界、运行时版本和发布步骤 |
| [隐私与网络](docs/PRIVACY.md) | 数据、模型请求、局域网端口和通知行为 |
| [验证记录](docs/VALIDATION.md) | 已验证项目与尚未覆盖的功能 |
| [第三方声明](THIRD_PARTY_NOTICES.md) | 原作归属、依赖许可证和授权边界 |
| [原作授权状态](UPSTREAM_PERMISSION.md) | 二次分发授权及其限制 |

## 致谢与许可

原作软件、产品名称及随包内容来自 **Unclecheng-li 的[星伴](https://unclecheng-li.github.io/starlit.com/)** 及各自权利人。macOS 适配与版本维护：**[MarkYang44](https://github.com/MarkYang44)**。

[MIT 许可证](LICENSE) **仅适用于新增的适配工具、测试、文档和兼容代码**，不重新授权导入的原作桌面/网页代码、后端、角色图片、表情、产品名称或第三方组件。尚未找到适用于原作的通用开源许可证。二次分发授权单独记录在 [UPSTREAM_PERMISSION.md](UPSTREAM_PERMISSION.md)，不表示任何人都可以不受限制地再次分发。

本项目是独立社区适配，不声称官方背书。原作 Windows / Android 版本请访问[官方网站](https://unclecheng-li.github.io/starlit.com/)。
