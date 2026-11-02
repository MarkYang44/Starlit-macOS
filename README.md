English | [简体中文](README.zh-CN.md)

# 星伴 · Starlit

An **unofficial Apple Silicon adaptation** of [Unclecheng-li's Starlit](https://unclecheng-li.github.io/starlit.com/), bringing its local character chat interface and backend to macOS.

Keep conversations and character memory on your Mac. Connect your own compatible model service, and chat through a desktop window backed by a native local process.

![Platform](https://img.shields.io/badge/platform-macOS%20%C2%B7%20Apple%20Silicon-30343b)
![Status](https://img.shields.io/badge/status-community%20RC-orange)

**[Downloads and release notes](https://github.com/MarkYang44/Starlit-macOS/releases)** · [Quick start](#quick-start) · [Source availability](#source-availability) · [Original project](https://github.com/Unclecheng-li/starlit.com)

> **Original work:** Starlit / 星伴 is by **[Unclecheng-li](https://github.com/Unclecheng-li)**. This repository maintains the macOS adaptation; it is not the official project. The current port is based on **Windows 1.0.0-rc.10**, independently of newer upstream releases. [Attribution and license scope](THIRD_PARTY_NOTICES.md).

## Overview

Starlit combines a browser-based character chat interface, local conversation and memory storage, and a configurable model API. This adaptation bundles an ARM64 Python backend with Electron so the application can run directly on an Apple Silicon Mac. The installed application is named **星伴.app**.

A local backend does **not** mean that model inference is offline: messages and relevant context are sent to the model provider you configure. A compatible local model endpoint can be configured separately; it is not bundled.

## What the macOS adaptation includes

- **Native backend:** a bundled macOS ARM64 executable, with no separate Python installation required to use the app.
- **Desktop integration:** macOS window controls, Edit and Window menus, single-instance behavior, and backend shutdown tied to application exit.
- **Existing chat interface:** character conversations, groups, local history and memory, and the original character/sticker resources.
- **Model diagnostics:** a larger completion budget for the connection test, preventing reasoning tokens from exhausting the original eight-token allowance.
- **Optional message notifications:** enable **Settings → 页外通知** and allow notifications. Hidden/minimized windows and messages in other conversations can trigger notifications; muted conversations and the visible current conversation are excluded. Closing the window currently stops this renderer-based notification path.
- **Update safety:** the original Windows installer updater is disabled on macOS; update by replacing the application manually.

The desktop includes the original LAN pairing/sync interface. Real-device Android interoperability, image/TTS workflows, and external search have not been validated for this port.

## Installation

1. Download **`Starlit-1.0.0-rc.10-mac.3-macOS-arm64.dmg`** from [Releases](https://github.com/MarkYang44/Starlit-macOS/releases).
2. Open the disk image and drag **星伴.app** to **Applications**.
3. Eject the disk image and open **星伴** from Applications.

The application bundles Apple Silicon code. **Intel Macs are not supported by this build.** Runtime checks were performed on **macOS 27.0.1 / Apple Silicon**. The bundle declares macOS 13 as its minimum; macOS 13–26 have not been tested and compatibility is not guaranteed.

The app uses an **ad-hoc signature** and is **not notarized by Apple**. For a trusted downloaded copy, follow macOS's **Privacy & Security → Open Anyway** flow if needed. Keep Gatekeeper enabled. [Detailed installation and upgrade guide](docs/INSTALLATION.md).

To verify the disk image, download `SHA256SUMS.txt` beside it and run in the download directory:

```bash
shasum -a 256 -c SHA256SUMS.txt
```

## Quick start

1. Launch **星伴**, open Settings, and enter your model's **API key**, **Base URL**, and **model identifier**. Placeholder text is not a saved value.
2. Save the model settings, then run the model connection test. A successful test checks that provider request; it does not certify every provider feature.
3. Select a character and send a message. Model usage and charges depend on your provider.
4. Optionally enable **页外通知** in Settings and allow notifications in macOS. Keep the window open or minimized for background message notifications.

Closing the window keeps the backend resident. Use **星伴 → Quit / 退出** to stop the app and backend. Reopen the window by clicking the Dock icon.

## Source availability

This repository contains the **available desktop and web client sources**, the macOS compatibility wrapper, and packaging/validation tools. It is **not a complete from-source release of the original application**.

| Component | Availability |
| --- | --- |
| Electron shell and preload | Readable CommonJS sources in [`src/desktop`](src/desktop), imported from the installed RC10 adaptation |
| Browser interface | Readable JavaScript, HTML and CSS in [`src/webclient`](src/webclient) |
| macOS backend diagnostic wrapper | Python source in [`src/backend`](src/backend) |
| Original Python business logic | Original `.py` sources were not supplied; runtime contains recovered CPython 3.13 bytecode |
| Native runtime, persona and large media resources | Included in the packaged app; kept out of Git history |

The packaging command overlays the tracked sources onto a **separately supplied native application**, refreshes ASAR integrity, renames the bundles, signs the result, and creates a DMG. It does not compile the original Python application from this checkout. [Build instructions and limitations](docs/BUILD.md).

## Data and privacy

User data remains outside the application at:

```text
~/Library/Application Support/starlit-macos/
```

This includes API settings, character memory, conversations, imported resources and the Chromium profile. The name and bundle identity are retained across the rename from “星伴 Mac” to “星伴”; replacing the app does not intentionally migrate or erase this directory.

Model requests contact your configured provider. Optional integrations can make additional network requests, and LAN sync may expose a token-protected service on the local network. Do not share your data directory or access token. The release contains seed resources, not the maintainer's profile or API key. [Privacy, ports and notification behavior](docs/PRIVACY.md).

## Development

Packaging requires **macOS, Python 3.11+**, Apple Command Line Tools, and a separately supplied native macOS build. Node.js is required for JavaScript checks and lifecycle tests; no npm dependencies are required by the packaging tool.

```bash
git clone https://github.com/MarkYang44/Starlit-macOS.git
cd Starlit-macOS
python3 -m unittest discover -s tests -v
node --test tests/lifecycle.test.cjs
python3 tools/package.py --base-app '/Applications/星伴.app'
```

The last command is **repackaging**, not a complete source build. Artifacts are written to `dist/`; staging and runtime files are ignored by Git. Do not use a Windows EXE as `--base-app`.

## Validation and limitations

The RC10 adaptation has been checked for native backend startup, authenticated local HTTP, browser delivery, WebSocket message delivery, persistence, and a real short model diagnostic. Earlier full chat-pipeline checks used a local simulated model; they are not evidence of extended live-provider conversation quality.

The current release adds packaging and archive-integrity tests, metadata/identity checks, release-payload checks, code-signature validation, and a mounted-image launch check. [Versioned validation record](docs/VALIDATION.md). Desktop CI checks sources and tools; it cannot reproduce the unavailable original backend sources or certify macOS UI behavior.

## Documentation

| Document | Contents |
| --- | --- |
| [Installation](docs/INSTALLATION.md) | First launch, upgrades, existing-data preservation and troubleshooting |
| [Build guide](docs/BUILD.md) | Packaging inputs, source boundaries, runtime versions and release commands |
| [Privacy](docs/PRIVACY.md) | Local storage, provider requests, LAN services and notifications |
| [Validation](docs/VALIDATION.md) | Checks performed and features that remain untested |
| [Third-party notices](THIRD_PARTY_NOTICES.md) | Original authorship, dependency notices and license boundaries |
| [Upstream permission](UPSTREAM_PERMISSION.md) | Distribution permission status and its limits |

## Credits and licensing

Original software, product identity and bundled content come from **Unclecheng-li's [Starlit](https://unclecheng-li.github.io/starlit.com/)** and their respective rights holders. macOS adaptation and release maintenance: **[MarkYang44](https://github.com/MarkYang44)**.

The [MIT license](LICENSE) covers newly authored adaptation tooling, tests, documentation and compatibility code **only**. It does not relicense the imported original shell/web code, backend, characters, images, stickers, product name or third-party components. No general upstream open-source license has been located. Distribution permission is documented separately in [UPSTREAM_PERMISSION.md](UPSTREAM_PERMISSION.md); it does not imply unrestricted downstream redistribution.

This is an independent community adaptation. No official endorsement is claimed. For original Windows/Android releases, visit the [official website](https://unclecheng-li.github.io/starlit.com/).
