"""Compatibility fix around the unchanged, separately supplied RC10 backend."""
from functools import wraps

DIAGNOSTIC_MAX_TOKENS = 2048


def apply_compatibility_fixes():
    from app.main import Companion

    original = Companion.test_diagnostic
    if getattr(original, '_mac_diagnostic_fix', False):
        return

    @wraps(original)
    async def test_diagnostic(self, body):
        target = str(body.get('target') or '').strip().lower() if isinstance(body, dict) else ''
        if target != 'llm' or not self._llm_ready():
            return await original(self, body)
        try:
            await self.llm.chat(
                [{'role': 'user', 'content': '连接测试，请只回复 OK'}],
                temperature=0.0, max_tokens=DIAGNOSTIC_MAX_TOKENS, retries=0,
            )
        except Exception as exc:
            print(f'[diagnostics] 模型实测失败：{exc!r}')
            return self._record_diagnostic_test('llm', False, self._safe_diagnostic_error('llm', exc))
        return self._record_diagnostic_test(
            'llm', True, '模型实测成功；测试回复未写入聊天或记忆',
        )

    test_diagnostic._mac_diagnostic_fix = True
    Companion.test_diagnostic = test_diagnostic
