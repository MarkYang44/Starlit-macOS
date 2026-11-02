/* 星伴双端更新：原生壳负责下载与安装，本模块只负责检查和用户确认。 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const keys = { auto: 'starlit.update.auto', channel: 'starlit.update.channel',
    skip: 'starlit.update.skip', checked: 'starlit.update.checkedAt' };
  const store = {
    get(key, fallback = '') { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* 隐私模式不阻断更新 */ } },
  };
  const state = { platform: '', bridge: null, release: null, checking: false,
    phase: 'idle', progress: 0, message: '', manual: false, currentVersion: '' };

  function bytes(value) {
    const n = Number(value || 0);
    return n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(2)} GB` : `${(n / 1024 ** 2).toFixed(1)} MB`;
  }
  function prefs() {
    return { auto: store.get(keys.auto, '1') !== '0', channel: store.get(keys.channel, 'test') };
  }
  function toast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.add('hidden'), 3500);
  }
  function syncSettings() {
    const p = prefs();
    $('settingsUpdateAuto').checked = p.auto;
    $('settingsUpdateChannel').value = p.channel;
    $('settingsUpdateCheck').disabled = state.checking || state.phase === 'downloading';
    const current = state.currentVersion ? `当前版本 ${state.currentVersion} · ` : '';
    const labels = { idle: `${current}仅检查公开版本信息，不会上传聊天或个人配置`,
      checking: '正在检查新版本…', downloading: `正在后台下载 ${state.progress}%`,
      ready: '安装包已校验，可以安装', error: state.message || '更新失败，请重试' };
    let text = labels[state.phase] || labels.idle;
    if (state.phase === 'idle' && state.release) text = `发现新版本 ${state.release.version} · ${bytes(state.release.size)}`;
    $('settingsUpdateState').textContent = text;
  }
  function show() {
    if (!state.release) return;
    const r = state.release;
    $('updateTitle').textContent = state.phase === 'ready' ? '新版本已准备好' : `星伴 ${r.version}`;
    $('updateSummary').textContent = `${r.channel === 'test' ? '测试通道' : '稳定通道'} · ${bytes(r.size)} · 安装前会自动备份`;
    const notes = $('updateNotes');
    notes.replaceChildren();
    (r.notes.length ? r.notes : ['体验与稳定性改进。']).forEach(note => {
      const li = document.createElement('li'); li.textContent = note; notes.append(li);
    });
    $('updateProgress').classList.toggle('hidden', !['downloading', 'ready'].includes(state.phase));
    $('updateProgress').value = state.phase === 'ready' ? 100 : state.progress;
    $('updateState').textContent = state.phase === 'ready'
      ? '下载与 SHA-256 校验完成。点击安装后，按系统提示完成即可。'
      : state.phase === 'downloading' ? `正在下载，可以暂时关闭此窗口 · ${state.progress}%` : state.message;
    $('updatePrimary').textContent = state.phase === 'ready' ? '立即安装'
      : state.phase === 'downloading' ? '正在下载…' : state.phase === 'error' ? '重试下载' : '立即更新';
    $('updatePrimary').disabled = state.phase === 'downloading';
    $('updateSkip').classList.toggle('hidden', ['downloading', 'ready'].includes(state.phase));
    $('updateLater').textContent = state.phase === 'downloading' ? '后台下载' : '稍后提醒';
    $('updateMask').classList.remove('hidden');
    syncSettings();
  }
  function close() { $('updateMask').classList.add('hidden'); }

  async function check(manual = false) {
    if (!state.platform || state.checking || state.phase === 'downloading') return;
    state.checking = true; state.manual = manual; state.phase = 'checking'; state.message = '';
    syncSettings();
    if (manual) { $('settingsUpdateCheck').textContent = '检查中…'; }
    try {
      const response = await window.StarlitUpdaterApi('/api/update/check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: state.platform, channel: prefs().channel }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || '更新服务暂时不可用');
      state.currentVersion = String(result.currentVersion || state.currentVersion);
      store.set(keys.checked, Date.now());
      if (result.supported && result.available && result.release) {
        state.release = result.release;
        const skipped = store.get(keys.skip) === result.release.version;
        if (manual || !skipped) { state.phase = 'idle'; show(); }
        else state.phase = 'idle';
      } else {
        state.release = null; state.phase = 'idle';
        if (manual) toast(result.supported ? `当前已经是最新版本（${state.currentVersion}）` : (result.message || '当前平台不支持自动更新'));
      }
    } catch (error) {
      state.phase = 'idle'; state.message = error.message || String(error);
      if (manual) toast('检查失败：' + state.message);
    } finally {
      state.checking = false;
      $('settingsUpdateCheck').textContent = '检查更新';
      syncSettings();
    }
  }

  function progress(raw) {
    let data = raw;
    if (typeof raw === 'string') { try { data = JSON.parse(raw); } catch { return; } }
    if (!data || typeof data !== 'object') return;
    state.phase = data.phase || state.phase;
    state.progress = Math.max(0, Math.min(100, Math.round(Number(data.progress) || 0)));
    state.message = String(data.message || '');
    if (state.phase === 'ready') {
      state.progress = 100;
      show();
      toast('新版本已下载，随时可以在设置中安装');
    } else if (state.phase === 'error') {
      show();
      toast('更新失败：' + (state.message || '请稍后重试'));
    }
    if (!$('updateMask').classList.contains('hidden')) show();
    syncSettings();
  }

  async function download() {
    if (!state.release || state.phase === 'downloading') return;
    state.phase = 'downloading'; state.progress = 0; state.message = '';
    show();
    try {
      if (state.platform === 'windows') await state.bridge.updateDownload(state.release);
      else await state.bridge.downloadUpdate(JSON.stringify(state.release));
    } catch (error) {
      progress({ phase: 'error', message: error.message || String(error) });
    }
  }
  async function primary() {
    if (state.phase === 'ready') {
      state.message = state.platform === 'windows' ? '正在备份并准备安装，请稍候…' : '正在打开系统安装界面…';
      $('updateState').textContent = state.message;
      $('updatePrimary').disabled = true;
      try {
        if (state.platform === 'windows') await state.bridge.updateInstall();
        else await state.bridge.installUpdate();
      } catch (error) {
        state.phase = 'error'; state.message = error.message || String(error);
        show();
      }
      $('updatePrimary').disabled = false;
      return;
    }
    await download();
  }
  function init(apiFetch) {
    const desktop = window.starlitDesktop;
    const android = window.starlitAndroid;
    if (desktop && typeof desktop.updateDownload === 'function') {
      state.platform = 'windows'; state.bridge = desktop;
      desktop.onUpdateState(progress);
    } else if (android && typeof android.downloadUpdate === 'function') {
      state.platform = 'android'; state.bridge = android;
      window.starlitUpdateProgress = progress;
    } else return;
    window.StarlitUpdaterApi = apiFetch;
    $('settingsUpdateRow').classList.remove('hidden');
    $('settingsUpdateCheck').addEventListener('click', () => {
      if (state.release && ['ready', 'downloading'].includes(state.phase)) show();
      else check(true);
    });
    $('settingsUpdateAuto').addEventListener('change', event => {
      store.set(keys.auto, event.target.checked ? '1' : '0');
    });
    $('settingsUpdateChannel').addEventListener('change', event => {
      store.set(keys.channel, event.target.value);
      state.release = null; state.phase = 'idle'; syncSettings();
    });
    $('updateClose').addEventListener('click', close);
    $('updateLater').addEventListener('click', close);
    $('updateMask').addEventListener('click', event => { if (event.target === $('updateMask')) close(); });
    $('updateSkip').addEventListener('click', () => {
      if (state.release) store.set(keys.skip, state.release.version);
      state.release = null; state.phase = 'idle'; close(); syncSettings();
    });
    $('updatePrimary').addEventListener('click', primary);
    syncSettings();
    setTimeout(() => {
      if (prefs().auto) check(false);
    }, 15000);
  }
  window.StarlitUpdater = { init, check, show };
})();
