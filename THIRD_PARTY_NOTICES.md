# Third-party notices / 第三方来源与许可声明

## Starlit / 星伴 — original application

- **Original author / 原作者:** [Unclecheng-li](https://github.com/Unclecheng-li)
- **Official website / 官网:** https://unclecheng-li.github.io/starlit.com/
- **Public project and original releases:** https://github.com/Unclecheng-li/starlit.com
- **Port baseline:** `Starlit-Setup-1.0.0-rc.10-personal-x64.exe`
- **Baseline SHA-256:** `8cef33c9785b854ca3f7ca6ee31400a2733394c450884e1963e4856847d8a02a`

The original application, browser interface, desktop shell, backend logic, character definitions and bundled content were not created by this adaptation's maintainer. The macOS port changes platform startup/lifecycle integration, packaging and a model-diagnostic compatibility path. Importing readable files from the distributed application does not establish ownership of the original work.

原作及相关权利仍归原作者和各自权利人所有。本仓库不声称创作了原作，不声称官方维护或获得官方背书，也不把原作重新许可为 MIT。当前原作公开仓库未发现通用开源许可证；二次分发状态单独记载于 [UPSTREAM_PERMISSION.md](UPSTREAM_PERMISSION.md)。

Bundled characters, avatars and stickers may refer to third-party fictional characters and artwork. Their names, likenesses, artwork and trademarks remain with their respective rights holders. A permission from the software author does not automatically establish separate rights to every third-party asset, nor does this repository's code license grant those rights. Known artist-specific notices must be retained when supplied; this export does not invent missing artist attribution.

## Newly authored adaptation work

Copyright (c) 2026 Mark Yang.

The MIT terms in [LICENSE](LICENSE) apply to newly authored packaging/checking tools, tests, documentation, `src/backend` compatibility code, `src/desktop/process_lifecycle.cjs`, and the maintainer's original adaptation changes only. Imported upstream code, media and native runtime components are excluded and retain their own rights/terms.

## Electron and Chromium

Electron `45.2.1`, Darwin ARM64. Project: https://www.electronjs.org/ · Source: https://github.com/electron/electron

Electron is distributed under MIT terms. Its Chromium and other dependencies have their own notices. Unmodified license texts extracted from the matching official runtime release are included in:

- [`notices/Electron-LICENSE`](notices/Electron-LICENSE)
- [`notices/Electron-LICENSES.chromium.html`](notices/Electron-LICENSES.chromium.html)

These notices are also embedded in the app under `Contents/Resources/Notices/`.

## Python and native backend

CPython `3.13.18`, Darwin ARM64; Python Software Foundation and other contributors. [Python source](https://github.com/python/cpython) · [License](notices/CPython-LICENSE.txt).

The runtime was assembled with PyInstaller `6.22.3`. PyInstaller's license includes an explicit bootloader exception for combined executables; runtime hooks have separate terms described in its notice. See [`notices/pyinstaller`](notices/pyinstaller).

License texts for the standalone Python distribution and linked libraries are retained in [`notices/python-runtime`](notices/python-runtime). Collection provenance is recorded in [`notices/python-runtime-source.json`](notices/python-runtime-source.json). These notices do not license the original Starlit business logic.

| Dependency | Version | License declaration / notice |
| --- | --- | --- |
| aiohappyeyeballs | 2.7.1 | PSF-2.0; [`notices/aiohappyeyeballs`](notices/aiohappyeyeballs) |
| aiohttp, including llhttp | 3.14.5 | Apache-2.0 and MIT; [`notices/aiohttp`](notices/aiohttp) |
| aiosignal | 1.4.0 | Apache-2.0; [`notices/aiosignal`](notices/aiosignal) |
| attrs | 26.1.0 | MIT; [`notices/attrs`](notices/attrs) |
| frozenlist | 1.8.0 | Apache-2.0; [`notices/frozenlist`](notices/frozenlist) |
| idna | 3.20 | BSD-3-Clause; [`notices/idna`](notices/idna) |
| multidict | 7.2.1 | Apache-2.0; [`notices/multidict`](notices/multidict) |
| Pillow and bundled image libraries | 13.0.0 | MIT-CMU and component terms in the combined [`Pillow license`](notices/pillow) |
| propcache | 0.5.4 | Apache-2.0 with NOTICE; [`notices/propcache`](notices/propcache) |
| PyYAML | 6.0.3 | MIT; [`notices/pyyaml`](notices/pyyaml) |
| yarl | 1.25.1 | Apache-2.0 with NOTICE; [`notices/yarl`](notices/yarl) |

Exact package-version metadata, wheel download sources and collected filenames are recorded in [`notices/python-packages.json`](notices/python-packages.json). Pillow's combined license includes bundled codec/library notices. Build-only tools are not a license grant for application content.

## Scope

This file is attribution and a guide to retained license texts. It does not grant rights beyond the referenced licenses or the actual upstream permission. If an applicable attribution/permission needs correction, open a repository issue describing the affected file or asset; do not include private credentials or conversations.
