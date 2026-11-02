import importlib.util
import json
import plistlib
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('packaging_tools', Path(__file__).parents[1] / 'tools/package.py')
pkg = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(pkg)


class PackagingTests(unittest.TestCase):
    def test_asar_roundtrip_and_integrity(self):
        with tempfile.TemporaryDirectory() as root:
            root = Path(root)
            src = root / 'source'
            (src / '目录').mkdir(parents=True)
            (src / 'main.cjs').write_bytes(b'console.log("ok");\n')
            (src / '目录/文件.txt').write_text('星伴', encoding='utf-8')
            archive = root / 'app.asar'
            digest = pkg.pack_asar(src, archive)
            files = pkg.read_asar(archive)
            self.assertIsInstance(files, dict)
            self.assertEqual(files['目录/文件.txt'], '星伴'.encode())
            self.assertEqual(pkg.asar_header_hash(archive), digest)
            payload = bytearray(archive.read_bytes())
            payload[-1] ^= 1
            archive.write_bytes(payload)
            with self.assertRaisesRegex(ValueError, 'integrity'):
                pkg.read_asar(archive)

    def test_renames_helper_and_main_executables_but_preserves_identity(self):
        with tempfile.TemporaryDirectory() as root:
            app = Path(root) / '星伴.app'
            for rel, name in [('', '星伴 Mac'), ('Frameworks/星伴 Mac Helper.app/', '星伴 Mac Helper')]:
                contents = app / 'Contents' / rel / 'Contents' if rel else app / 'Contents'
                (contents / 'MacOS').mkdir(parents=True)
                info = {'CFBundleName': name, 'CFBundleDisplayName': name, 'CFBundleExecutable': name,
                        'CFBundleIdentifier': 'local.starlit.macos' + ('.helper' if rel else '')}
                (contents / 'Info.plist').write_bytes(plistlib.dumps(info))
                (contents / 'MacOS' / name).write_bytes(b'test executable')
            pkg.rename_bundle(app, '1.0.0-rc.10-mac.3')
            main = plistlib.loads((app / 'Contents/Info.plist').read_bytes())
            self.assertEqual(main['CFBundleDisplayName'], '星伴')
            self.assertEqual(main['CFBundleIdentifier'], 'local.starlit.macos')
            self.assertTrue((app / 'Contents/MacOS/星伴').exists())
            self.assertTrue((app / 'Contents/Frameworks/星伴 Helper.app/Contents/MacOS/星伴 Helper').exists())

    def test_rejects_external_links_and_seed_secrets(self):
        with tempfile.TemporaryDirectory() as root:
            app = Path(root) / '星伴.app'
            seed = app / 'Contents/Resources/template'
            seed.mkdir(parents=True)
            (seed / 'config.yaml').write_text('llm:\n  api_key: ""\nweb:\n  token: ""\n')
            self.assertEqual(pkg.audit_payload(app), [])
            (seed / 'config.yaml').write_text('llm:\n  api_key: "test-not-a-real-key"\n')
            self.assertTrue(any('credential' in item for item in pkg.audit_payload(app)))
            (seed / 'config.yaml').write_text('llm:\n  api_key: ""\n')
            (seed / 'outside').symlink_to(Path(root) / 'outside')
            self.assertTrue(any('symlink' in item for item in pkg.audit_payload(app)))

    def test_rejects_access_tokens_in_seed_config(self):
        with tempfile.TemporaryDirectory() as root:
            app = Path(root) / '星伴.app'
            seed = app / 'Contents/Resources/template'
            seed.mkdir(parents=True)
            (seed / 'config.yaml').write_text('qq:\n  ws:\n    access_token: "fixture-token"\n')
            self.assertTrue(any('credential' in item for item in pkg.audit_payload(app)))


if __name__ == '__main__':
    unittest.main()
