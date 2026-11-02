# Data, network and notifications / 数据、网络与通知

## Local storage

The default data root is `~/Library/Application Support/starlit-macos/`. It contains configuration, saved model settings, SQLite conversation/memory stores, persona resources, media, Chromium profile state and logs. `STARLIT_DATA_ROOT` can override this path for development.

API settings are local configuration, not guaranteed to be encrypted in Keychain. Treat the whole directory as private. Backups can include credentials and conversations. User data is not copied by the release packaging process; only application resources and fresh seed content are packaged.

本仓库不收集维护者或用户的个人聊天样本。发布前会检查配置、已识别的用户状态路径与凭据模式，但这不替代对新增第三方运行时的人工检查。

## Model and optional services

Model inference uses the Base URL you configure. Prompts, conversation context and relevant memory may be sent to that provider according to the application's request-building behavior. Provider billing, logging, retention and policies apply. A local compatible model service is possible but is not bundled or validated by this release.

Optional TTS, search, update metadata or other original integrations may contact external services. The macOS adaptation disables the Windows installer update flow; this is not a claim that the complete original application is network-silent or has undergone a comprehensive privacy audit.

## Local services

| Service | Port / exposure |
| --- | --- |
| Web/API backend | TCP `18765`, bound to `127.0.0.1`, access-token protected |
| LAN synchronization | TCP `18766`, may listen on the local network, token protected |
| LAN discovery | UDP `18767`, local network discovery |

The pairing screen can reveal/copy an access token. Share it only with a trusted device. LAN token protection is not a substitute for TLS encryption or a trusted network. Real-device Android synchronization has not been verified for this macOS build. Do not expose these services through Internet port forwarding.

## Notifications

The web client stores its preference in the Chromium profile under `vol.notifications`. Enabling it requires browser notification permission; macOS notification and Focus settings can further affect presentation.

A notification can contain the character/group name and a preview of the incoming message. Consider lock-screen preview settings if that content is private. The current code excludes muted conversations and the current visible conversation. It can notify while the window is hidden/minimized or a different conversation is selected.

**The backend running after window closure does not imply notifications continue:** the current implementation creates notifications in the web renderer. Closing the window removes that renderer. Reopening the window restores the notification path when permissions and preferences allow it. There is no separate native background notification bridge in this release.

## Sharing diagnostics

Before posting a bug report, remove API keys, access tokens, model request bodies, private character prompts, conversation excerpts and identifying paths. The public repository and release must not include personal profile exports. Keep full private logs and backups on your own machine unless you deliberately choose a trusted recipient.
