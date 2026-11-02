# Installation and upgrades / 安装与升级

## First installation

Download the Apple Silicon DMG and `SHA256SUMS.txt` from this repository's Releases. Verify the checksum, mount the image, then drag **星伴.app** into Applications. Eject the image before launching from Applications.

运行时不需要 Python 或 Node.js。Apple Silicon 为当前发布架构；Intel 不受支持。已验证环境为 macOS 27.0.1，不能把 Info.plist 中的最低版本声明当成旧系统测试结果。

Current builds are ad-hoc signed and not notarized. For a trusted copy, follow the system's Privacy & Security approval flow if macOS blocks the first launch. Do not disable Gatekeeper globally.

## Upgrading from 星伴 Mac

1. Choose **星伴 → 退出** to stop the old application and backend.
2. Keep a private backup of `~/Library/Application Support/starlit-macos/` if desired. It can contain API credentials and private conversations.
3. Replace the old application with **星伴.app** in Applications. Remove old application copies from download/build folders and eject old disk images if duplicate launcher entries appear.
4. Open 星伴 and confirm the existing characters, conversations and model configuration remain available.

The renamed application retains the bundle identifier and data directory. Do not delete the data directory as part of an application upgrade. The original Windows automatic updater is disabled on macOS; install a new DMG manually.

## Model settings

Fill in actual values for API Key, Base URL and model identifier. Placeholder text does not configure the field. Save before testing. A blank API-key field after saving may represent an existing masked key; it does not necessarily mean the key was lost.

The connection test makes a short request to the configured provider. It may incur usage charges and requires a usable account, valid credentials, a compatible model and network access. Provider errors, quotas and unsupported models are independent of the macOS port.

本版将连接测试输出预算由 8 token 提高到 2048，避免思考模型在产生可见回复前耗尽测试预算。该变更不调整普通聊天的生成参数。

## Notifications and closing the window

Enable **设置 → 页外通知**, allow the permission request, and check **System Settings → Notifications → 星伴** if notifications do not appear. Focus modes and system presentation preferences can suppress banners.

The current renderer sends notifications for hidden/minimized windows or incoming messages in other conversations. Muted conversations and the current visible conversation are excluded. **Closing the red window button destroys the renderer, so this notification path is unavailable until the window is reopened.** Click the Dock icon to reopen it; choose Quit to stop the backend completely.

## Troubleshooting

- **Backend startup failure:** quit all old Starlit copies, then reopen the installed application. The HTTP backend uses loopback TCP `18765`; another process using that port can block startup. Logs are in the data directory and may contain private information.
- **New empty profile after upgrade:** confirm the intended app is running and that `STARLIT_DATA_ROOT` was not overridden. The expected data root is `~/Library/Application Support/starlit-macos/`.
- **Duplicate app icons:** keep one installed application, eject mounted installer images, and remove unused build copies. Renaming the data directory does not fix launcher registration.
- **Model test failure:** recheck saved provider values and inspect the provider's error. Avoid posting logs or screenshots containing API keys, bearer tokens or conversations.

## Uninstall

Quit the app and remove **星伴.app**. User data remains in the separate Application Support directory. Deleting that directory also deletes local history, memory, configuration and imported content; it is not required for a normal upgrade.
