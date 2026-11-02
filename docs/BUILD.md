# Build and source guide / 构建与源码指南

## What this checkout can build

This checkout can **repackage an existing native RC10 macOS application** with the tracked shell and web sources. It cannot independently compile the original Python application: its original `.py` sources were not supplied.

本仓库能够使用现有 macOS 原生应用作为运行时，覆盖可读源码并生成新的应用与 DMG。它不能仅凭仓库内容完整重建原始 Python 业务后端。恢复的 `.pyc` 不等同于原始源码。

## Inputs and versions

| Input | Current baseline |
| --- | --- |
| Original product | Unclecheng-li / Starlit, Windows `1.0.0-rc.10-personal-x64` |
| Original installer SHA-256 | `8cef33c9785b854ca3f7ca6ee31400a2733394c450884e1963e4856847d8a02a` |
| Packaged Electron | `45.2.1`, Darwin ARM64 |
| Packaged CPython | `3.13.18`, Darwin ARM64 |
| Backend assembly | PyInstaller `6.22.3` |
| Primary Python dependencies | aiohttp `3.14.5`, PyYAML `6.0.3`, Pillow `13.0.0` |
| Packaging tools | Python `3.11+`, `ditto`, `codesign`, `hdiutil` |
| JS checks | Node.js with `node:test` and `node --check` |

The versioned runtime was assembled before this public source export. The source files under `src/backend` preserve the diagnostic compatibility wrapper and its bootstrap; `app` and `backend_entry` must come from the separately supplied upstream payload. The repository does not include a speculative replacement for the unavailable original logic.

第三方依赖的完整版本和许可证来源记录在 [`notices/python-packages.json`](../notices/python-packages.json)。角色、媒体和原生库由输入应用提供；不能用 Windows 运行时替代。

## Directory map

```text
src/
  desktop/       Electron entry, preload, lifecycle, pairing and assets
  webclient/     Browser JavaScript, HTML and CSS
  backend/       Available Python compatibility wrapper and bootstrap
notices/         Runtime dependency license texts and provenance
tools/          Packaging, integrity and source validation tools
tests/          Packaging, compatibility and process lifecycle checks
docs/           User, build, privacy and validation guides
```

`src/desktop` and `src/webclient` contain imported upstream work with adaptation changes. Consult [third-party notices](../THIRD_PARTY_NOTICES.md) before reusing them. Large runtime/media resources and all user profiles remain outside Git.

## Validate

```bash
python3 -m unittest discover -s tests -v
node --test tests/lifecycle.test.cjs
python3 tools/check_sources.py
```

These checks do not contact a model provider and use no real API key. They do not claim GUI acceptance or a full backend source rebuild.

## Package on macOS

Close the application before replacing an installed copy. Supply a native macOS application from the matching port, for example an extracted release:

```bash
python3 tools/package.py \
  --base-app '/Applications/星伴.app' \
  --version '1.0.0-rc.10-mac.3'
```

The tool performs the following:

1. Copies the application bundle, never its external user-data directory.
2. Removes seed conversation databases so the backend creates fresh stores on first run.
3. Packs `src/desktop` into ASAR with SHA-256 file/block metadata; overlays `src/webclient`.
4. Updates application/helper names to 星伴, preserving `local.starlit.macos` and the existing data-root behavior.
5. Updates the bundle's Electron ASAR-integrity record and embeds attribution/dependency notices.
6. Rejects external/broken application symlinks, nonempty YAML seed credentials and recognized personal-state files.
7. Applies an ad-hoc signature, verifies it, and creates a compressed DMG with an Applications shortcut.
8. Writes the DMG and `SHA256SUMS.txt` to `dist/`.

`--no-dmg` prepares and signs only the staged app. `--audit /path/to/星伴.app` checks a supplied bundle without changing it. Payload checks are a focused guard, not a general proof that arbitrary third-party input is free of secrets; inspect any new input runtime before publication.

The base app must be outside `.local/dmg-root`, which the tool replaces. Application sources and required runtime inputs must be trusted. Do not build while another process is modifying the source tree or base app.

## Installation identity

The product name is **星伴**. Bundle identifier remains `local.starlit.macos`, and data remains under `~/Library/Application Support/starlit-macos/`. A name change must not silently create a new profile. Helper display/executable names are renamed together with their bundles; ASAR and bundle signatures must be refreshed afterward.

## Release verification

Before uploading an artifact:

```bash
codesign --verify --deep --strict --verbose=2 '.local/dmg-root/星伴.app'
hdiutil verify dist/Starlit-1.0.0-rc.10-mac.3-macOS-arm64.dmg
```

Checksum filenames are relative to the checksum file's directory. Use:

```bash
(cd dist && shasum -a 256 -c SHA256SUMS.txt)
```

Mount the DMG read-only, verify the mounted bundle's signature and embedded notices, confirm its backend is ARM64 and its symlinks resolve within the application, then launch the installed application in a graphical macOS session. Confirm startup and data continuity without sending diagnostic or chat content to a paid provider unless explicitly intended.

Publish the installer and checksum file as GitHub Release assets. Keep `.app`, DMG, native runtimes, profiles and build directories out of Git. The original code/content permission and third-party notices must match the actual payload; a license on new adaptation tools does not relicense the rest of the application.

## Signing

Current artifacts use ad-hoc signatures. They are not Developer ID signed or Apple notarized. Distribution with a recognized Developer ID would require the maintainer's signing identity, appropriate entitlements, hardened-runtime validation and Apple's notarization workflow; this repository does not claim those steps have been completed.
