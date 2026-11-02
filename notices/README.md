# Runtime license texts

These files retain the licenses/notices for the bundled Electron and Python runtimes and Python dependencies. They do not license the original Starlit application or its assets.

- `Electron-LICENSE` and `Electron-LICENSES.chromium.html`: extracted from the official Electron 45.2.1 Darwin ARM64 release.
- `CPython-LICENSE.txt`: upstream CPython 3.13.18 license.
- Package subdirectories: unmodified legal files from the pinned package wheels; provenance in `python-packages.json`.
- `python-runtime/`: standalone CPython distribution and native-library notices; provenance in `python-runtime-source.json`. No pip runtime is shipped by the application.

The packaging tool copies this directory and the repository's main attribution/permission/license files to `星伴.app/Contents/Resources/Notices/`.
