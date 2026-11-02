#!/usr/bin/env python3
"""Check public sources without reading personal application profiles."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []
text_suffixes = {'.py', '.js', '.cjs', '.json', '.html', '.css', '.md', '.yml', '.txt'}
for directory in ('src', 'tools', 'tests', 'docs', '.github'):
    for path in (ROOT / directory).rglob('*'):
        if not path.is_file() or '__pycache__' in path.parts:
            continue
        if path.suffix in {'.js', '.cjs'}:
            result = subprocess.run(['node', '--check', str(path)], capture_output=True, text=True)
            if result.returncode:
                errors.append(f'JavaScript syntax error: {path.relative_to(ROOT)}\n{result.stderr}')
        if path.suffix not in text_suffixes:
            continue
        text = path.read_text(encoding='utf-8')
        if re.search(r'\b(?:sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})', text):
            errors.append(f'Credential-shaped value: {path.relative_to(ROOT)}')
        if re.search(r'/Users/[A-Za-z0-9._-]+/', text):
            errors.append(f'Private absolute path: {path.relative_to(ROOT)}')
if errors:
    raise SystemExit('\n'.join(errors))
print('JavaScript syntax and source disclosure checks passed')
