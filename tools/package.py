#!/usr/bin/env python3
"""Package adaptation sources using a separately supplied native runtime.

This does not rebuild the upstream Python application from source. See docs/BUILD.md.
"""
import argparse
import hashlib
import json
import plistlib
import re
import shutil
import struct
import subprocess
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
BLOCK_SIZE = 4 * 1024 * 1024


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def _asar_parts(path):
    data = Path(path).read_bytes()
    if len(data) < 16:
        raise ValueError('Invalid ASAR header')
    pickle_size, header_size, payload_size, json_size = struct.unpack_from('<IIII', data)
    if pickle_size != 4 or header_size != payload_size + 4 or 8 + header_size > len(data):
        raise ValueError('Invalid ASAR header size')
    raw = data[16:16 + json_size]
    return data, json.loads(raw), raw, 8 + header_size


def asar_header_hash(path):
    return sha256(_asar_parts(path)[2])


def read_asar(path):
    data, header, _, base = _asar_parts(path)
    files = {}

    def walk(node, prefix=PurePosixPath()):
        for name, item in node['files'].items():
            if name in ('.', '..') or '/' in name or '\\' in name:
                raise ValueError('Unsafe ASAR path')
            rel = prefix / name
            if 'files' in item:
                walk(item, rel)
                continue
            if 'link' in item or item.get('unpacked'):
                raise ValueError('Linked/unpacked ASAR entries are unsupported')
            offset, size = int(item['offset']), int(item['size'])
            if offset < 0 or size < 0 or base + offset + size > len(data):
                raise ValueError('Invalid ASAR file bounds')
            content = data[base + offset:base + offset + size]
            integrity = item.get('integrity', {})
            if integrity and (integrity.get('algorithm') != 'SHA256' or integrity.get('hash') != sha256(content)):
                raise ValueError('ASAR integrity mismatch')
            files[str(rel)] = content

    walk(header)
    return files


def pack_asar(source, output):
    source = Path(source)
    header = {'files': {}}
    contents = []
    offset = 0
    for path in sorted(source.rglob('*')):
        if path.is_symlink():
            raise ValueError('Source symlinks are unsupported')
        if not path.is_file() or path.name == '.DS_Store':
            continue
        content = path.read_bytes()
        parts = path.relative_to(source).parts
        node = header
        for part in parts[:-1]:
            node = node['files'].setdefault(part, {'files': {}})
        item = {'size': len(content), 'offset': str(offset), 'integrity': {
            'algorithm': 'SHA256', 'hash': sha256(content), 'blockSize': BLOCK_SIZE,
            'blocks': [sha256(content[i:i + BLOCK_SIZE]) for i in range(0, len(content), BLOCK_SIZE)]}}
        if path.stat().st_mode & 0o111:
            item['executable'] = True
        node['files'][parts[-1]] = item
        contents.append(content)
        offset += len(content)
    raw = json.dumps(header, ensure_ascii=False, separators=(',', ':')).encode()
    padding = b'\0' * (-len(raw) % 4)
    pickle_header = struct.pack('<II', 4 + len(raw) + len(padding), len(raw)) + raw + padding
    Path(output).write_bytes(struct.pack('<II', 4, len(pickle_header)) + pickle_header + b''.join(contents))
    return sha256(raw)


def rename_bundle(app, version):
    app = Path(app)
    helpers = sorted((app / 'Contents/Frameworks').glob('*.app'))
    for bundle in [*helpers, app]:
        info_path = bundle / 'Contents/Info.plist'
        info = plistlib.loads(info_path.read_bytes())
        old_executable = info['CFBundleExecutable']
        new_executable = old_executable.replace('星伴 Mac', '星伴')
        if old_executable != new_executable:
            (bundle / 'Contents/MacOS' / old_executable).rename(bundle / 'Contents/MacOS' / new_executable)
        for key in ('CFBundleName', 'CFBundleDisplayName', 'CFBundleExecutable'):
            if key in info:
                info[key] = info[key].replace('星伴 Mac', '星伴')
        if bundle == app:
            info.update(CFBundleName='星伴', CFBundleDisplayName='星伴',
                        CFBundleShortVersionString=version, CFBundleVersion=version)
        info_path.write_bytes(plistlib.dumps(info))
        if bundle != app and '星伴 Mac' in bundle.name:
            bundle.rename(bundle.with_name(bundle.name.replace('星伴 Mac', '星伴')))


def audit_payload(app):
    """Return paths/reasons only; never include potentially sensitive values."""
    app = Path(app).resolve()
    errors = []
    forbidden = {'desktop-profile', 'settings.json', 'companion.db', 'desktop.log',
                 'companion.log', 'sync-temp', 'backups', 'Local Storage', 'Cookies'}
    for path in app.rglob('*'):
        rel = path.relative_to(app)
        if path.name in forbidden or path.suffix in {'.sqlite', '.sqlite3'}:
            errors.append(f'Personal state is forbidden: {rel}')
        if path.is_symlink():
            if not path.exists() or not path.resolve().is_relative_to(app):
                errors.append(f'External or broken symlink: {rel}')
    template = app / 'Contents/Resources/template'
    for config in template.rglob('*.yaml'):
        for line in config.read_text(encoding='utf-8').splitlines():
            match = re.match(r'^\s*(?:api_key|access_token|token|password|secret|authorization)\s*:\s*(.*?)\s*$', line, re.I)
            if match and match[1].split('#', 1)[0].strip() not in ('', '""', "''", 'null', '~'):
                errors.append(f'Nonempty seed credential: {config.relative_to(app)}')
    return sorted(set(errors))


def run(*args):
    subprocess.run([str(x) for x in args], check=True)


def build(base_app, output, version, make_dmg=True):
    base_app = Path(base_app).resolve()
    output = Path(output).resolve()
    source_resources = base_app / 'Contents/Resources'
    if not (source_resources / 'backend/StarlitBackend').is_file():
        raise ValueError('Supply the separately prepared native macOS ARM64 application runtime')
    stage = ROOT / '.local/dmg-root'
    if base_app.is_relative_to(stage):
        raise ValueError('Base application must be outside the output staging directory')
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)
    app = stage / '星伴.app'
    run('ditto', '--noqtn', base_app, app)
    resources = app / 'Contents/Resources'
    # Upstream's seed includes an empty group DB. Let the backend create it
    # on first launch; no conversation databases belong in a release image.
    for seed_file in (resources / 'template/data').rglob('*'):
        if seed_file.is_file() and seed_file.suffix in {'.db', '.sqlite', '.sqlite3'}:
            seed_file.unlink()
    integrity = pack_asar(ROOT / 'src/desktop', resources / 'app.asar')
    for path in (ROOT / 'src/webclient').iterdir():
        if path.is_file():
            shutil.copy2(path, resources / 'webclient' / path.name)
    rename_bundle(app, version)
    info_path = app / 'Contents/Info.plist'
    info = plistlib.loads(info_path.read_bytes())
    info['ElectronAsarIntegrity'] = {'Resources/app.asar': {'algorithm': 'SHA256', 'hash': integrity}}
    info_path.write_bytes(plistlib.dumps(info))
    notices = resources / 'Notices'
    shutil.copytree(ROOT / 'notices', notices, dirs_exist_ok=True)
    for name in ('THIRD_PARTY_NOTICES.md', 'LICENSE', 'UPSTREAM_PERMISSION.md'):
        shutil.copy2(ROOT / name, notices / name)
    errors = audit_payload(app)
    if errors:
        raise ValueError('\n'.join(errors))
    read_asar(resources / 'app.asar')
    run('codesign', '--force', '--deep', '--sign', '-', '--timestamp=none', app)
    run('codesign', '--verify', '--deep', '--strict', '--verbose=2', app)
    (stage / 'Applications').symlink_to('/Applications')
    shutil.copy2(ROOT / 'docs/INSTALL.txt', stage / '安装说明.txt')
    output.mkdir(parents=True, exist_ok=True)
    if make_dmg:
        dmg = output / f'Starlit-{version}-macOS-arm64.dmg'
        run('hdiutil', 'create', '-volname', '星伴', '-srcfolder', stage,
            '-format', 'UDZO', '-ov', dmg)
        with dmg.open('rb') as stream:
            digest = hashlib.file_digest(stream, 'sha256').hexdigest()
        (output / 'SHA256SUMS.txt').write_text(f'{digest}  {dmg.name}\n')
        print(f'Created {dmg.name}\nSHA-256: {digest}')
    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-app', type=Path, help='Existing native macOS port; not the Windows installer')
    parser.add_argument('--output', type=Path, default=ROOT / 'dist')
    parser.add_argument('--version', default='1.0.0-rc.10-mac.3')
    parser.add_argument('--no-dmg', action='store_true')
    parser.add_argument('--audit', type=Path, help='Audit a supplied .app without modifying it')
    args = parser.parse_args()
    if args.audit:
        problems = audit_payload(args.audit)
        print('\n'.join(problems) if problems else 'Payload audit passed')
        raise SystemExit(bool(problems))
    if not args.base_app:
        parser.error('--base-app is required unless --audit is used')
    build(args.base_app, args.output, args.version, not args.no_dmg)
