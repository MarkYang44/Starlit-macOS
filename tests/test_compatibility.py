import importlib.util
import sys
import types
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('mac_compat', Path(__file__).parents[1] / 'src/backend/mac_compat.py')
compat = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(compat)


class CompatibilityTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        class Companion:
            async def test_diagnostic(self, body):
                return {'delegated': body}
            def _llm_ready(self):
                return self.ready
            def _record_diagnostic_test(self, target, ok, message):
                return {'target': target, 'ok': ok, 'message': message}
            def _safe_diagnostic_error(self, target, exc):
                return 'provider request failed'
        self.Companion = Companion
        self.old = {key: sys.modules.get(key) for key in ('app', 'app.main')}
        sys.modules['app'] = types.ModuleType('app')
        module = types.ModuleType('app.main')
        module.Companion = Companion
        sys.modules['app.main'] = module
        compat.apply_compatibility_fixes()

    def tearDown(self):
        for key, value in self.old.items():
            if value is None:
                sys.modules.pop(key, None)
            else:
                sys.modules[key] = value

    async def test_reasoning_budget_and_idempotence(self):
        method = self.Companion.test_diagnostic
        compat.apply_compatibility_fixes()
        self.assertIs(self.Companion.test_diagnostic, method)
        calls = []
        class LLM:
            async def chat(self, messages, **kwargs):
                calls.append((messages, kwargs))
                if kwargs['max_tokens'] < 128:
                    raise RuntimeError('reasoning consumed visible output budget')
                return 'OK'
        instance = self.Companion()
        instance.ready = True
        instance.llm = LLM()
        result = await instance.test_diagnostic({'target': 'llm'})
        self.assertTrue(result['ok'])
        self.assertEqual(calls[0][1]['max_tokens'], 2048)

    async def test_provider_errors_are_not_reported_as_success(self):
        class LLM:
            async def chat(self, *args, **kwargs):
                raise RuntimeError('fixture: unauthorized')
        instance = self.Companion()
        instance.ready = True
        instance.llm = LLM()
        self.assertFalse((await instance.test_diagnostic({'target': 'llm'}))['ok'])

    async def test_other_targets_and_missing_config_delegate(self):
        instance = self.Companion()
        instance.ready = False
        self.assertEqual(await instance.test_diagnostic({'target': 'llm'}), {'delegated': {'target': 'llm'}})
        instance.ready = True
        self.assertEqual(await instance.test_diagnostic({'target': 'tts'}), {'delegated': {'target': 'tts'}})
