# RC10 macOS validation record

**Release:** `1.0.0-rc.10-mac.3`  
**Date:** 2026-11-02  
**Runtime environment:** macOS 27.0.1, Apple Silicon / ARM64

## Current release checks

| Check | Result and scope |
| --- | --- |
| Python tooling tests | 7 passing: ASAR roundtrip/tamper detection, bundle/helper rename with retained identity, seed credentials/external links, access-token rejection, compatibility-wrapper budget/idempotence/delegation/provider failures |
| Node lifecycle tests | 3 passing: graceful child cleanup, forced termination after grace, backend stop after pending sync completion/error |
| Source validation | All tracked JavaScript/CommonJS files pass `node --check`; source disclosure-pattern checks pass |
| Installed identity | Display name, main executable and About item are 星伴; identifier remains `local.starlit.macos`; version `1.0.0-rc.10-mac.3` |
| Actual running paths | Application and backend execute from `/Applications/星伴.app`, rather than a staging or older copy |
| Data continuity | Saved model/backend configuration hashes unchanged by replacement; existing conversations visible after restart |
| Notification preference | Settings shows 页外通知 enabled after rename; no preference reset |
| Local HTTP | Chat page and authenticated `/api/identity` both return HTTP 200 after installed-app launch |
| Release image | `hdiutil verify` passes; mounted read-only; contains 星伴.app, Applications link and installation guide |
| Mounted app signature | `codesign --verify --deep --strict` passes |
| Mounted app contents | ARM64 backend, valid ASAR header hash, no external/broken application symlinks, no seed conversation databases, dependency/attribution notices present |
| Credential isolation | Byte scan of mounted app found none of the maintainer's currently saved model credentials or local access token; no user profile was copied |
| Launcher registration | One primary LaunchServices registration: `/Applications/星伴.app`; test disk image ejected |

The package auditor's recognized fields and paths are a focused guard. The credential scan is evidence about this artifact and the tested credentials, not a universal claim that arbitrary input bundles cannot contain private information.

## Artifact

Filename: `Starlit-1.0.0-rc.10-mac.3-macOS-arm64.dmg`  
Size: `972239723` bytes  
SHA-256: `2a5b8f4b42db9deba33f36165eb13653fad04a998eaaf1a87264003bb8b83da6`

## Earlier RC10 port validation

Before this source-export/name-cleanup release, the port was checked for native backend startup, static web delivery, token rejection, WebSocket receive/push behavior, character/sticker loading, SQLite diagnostics and persistence across restart. An end-to-end emotion → analysis → reply → WebSocket sequence used a deliberately local simulated model. The model-connection diagnostic was subsequently checked against a real configured provider using a short request.

These are historical adaptation checks, not reruns of the entire application for this release. No private conversation, API key, profile export or simulated-model configuration is included in the public repository.

## Not established by these checks

- Intel support or universal binaries.
- Compatibility with macOS 13–26; the minimum-version declaration alone is not a runtime test.
- Developer ID signing or Apple notarization.
- Complete original-backend rebuild from this repository's source.
- Android real-device pairing/sync interoperability.
- Full image, TTS, search or every optional integration workflow.
- Long-running live-model chat quality, service reliability or cost.
- Banner delivery under every macOS Focus/notification configuration.
- Notifications after closing the renderer window; the current implementation does not provide that path.
- A comprehensive security/privacy audit or independent verification of every artwork's rights.

CI runs the Python/Node/source checks only. It does not build the unavailable original backend source or exercise the macOS graphical application.
